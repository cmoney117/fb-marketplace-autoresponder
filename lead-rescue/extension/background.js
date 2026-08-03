/**
 * Lead Rescue — Background Service Worker
 *
 * COMPLIANCE NOTE — READ BEFORE EDITING:
 * This worker contains NO code path that sends a Facebook message. The
 * original extension's sendReplyInBrowser() (synthetic typing + Enter key
 * simulation), its poll/auto-reply loop, and its follow-up send engine were
 * all DELETED — not disabled, deleted. Do not re-add them. The product's
 * core promise is that it is physically incapable of sending on Facebook.
 *
 * What this worker does:
 *  - Relays "scan inbox" requests from the side panel to the content script
 *    on the dealer's already-open facebook.com/messages tab
 *  - Collects extracted threads into chrome.storage.session for the panel
 *  - Fetches AI reply DRAFTS from the CRM (/api/fb/generate-reply — same
 *    request contract as the original) for the human to copy/paste
 *  - Applies the phone-number guardrail to every draft (kept from original)
 *  - Captures leads to the CRM (/api/leads), queueing locally in
 *    chrome.storage.local and retrying when the CRM is unreachable
 */

const CONFIG_KEY = "lrConfig";           // chrome.storage.local — options page settings
const THREADS_KEY = "lrThreads";         // chrome.storage.session — last scan results
const SCAN_STATUS_KEY = "lrScanStatus";  // chrome.storage.session — scan progress
const LEAD_STATUS_KEY = "lrLeadStatus";  // chrome.storage.session — per-thread capture state
const LEAD_QUEUE_KEY = "lrLeadQueue";    // chrome.storage.local — offline lead queue
const LEAD_QUEUE_ALARM = "lrFlushLeadQueue";
const LEAD_QUEUE_RETRY_MINUTES = 5;
const LEAD_QUEUE_MAX = 200;

// ─── Startup ─────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  init();
  log("Installed. No polling loops, no auto-send — scans run only when the human clicks Scan.");
});

chrome.runtime.onStartup.addListener(() => {
  init();
});

function init() {
  // Clicking the toolbar icon opens the side panel
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((err) => log("sidePanel.setPanelBehavior failed:", err?.message));

  // The ONLY alarm in this extension: retry delivery of locally-queued leads.
  // (The original's pollMarketplace / checkFollowUps / checkReengagement
  // auto-send alarms were removed.)
  chrome.alarms.create(LEAD_QUEUE_ALARM, { periodInMinutes: LEAD_QUEUE_RETRY_MINUTES });
  flushLeadQueue();
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === LEAD_QUEUE_ALARM) flushLeadQueue();
});

// ─── Phone Number Guardrail (kept from original, made configurable) ──────────
// ONLY numbers on the dealer's approved list (options page) are allowed in
// outbound DRAFTS. Any other phone number found in a draft is replaced with
// the dealer's primary approved number — or a visible placeholder if none is
// configured — so a hallucinated number can never reach a buyer.

function enforceApprovedPhones(text, config) {
  // Match common US phone patterns: (XXX) XXX-XXXX, XXX-XXX-XXXX, XXX.XXX.XXXX,
  // XXXXXXXXXX, +1XXXXXXXXXX, 1-XXX-XXX-XXXX, etc. (regex verbatim from original)
  const phoneRegex = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

  const approvedRaw = Array.isArray(config.approvedPhones) ? config.approvedPhones : [];
  const approved = approvedRaw
    .map((p) => normalizePhone(p))
    .filter((p) => p.length === 10);
  const primaryFormatted = approvedRaw.length > 0 ? String(approvedRaw[0]).trim() : null;

  const warnings = [];
  const sanitized = String(text).replace(phoneRegex, (match) => {
    const normalized = normalizePhone(match);
    if (approved.includes(normalized)) {
      return match; // Approved — keep as-is
    }
    if (primaryFormatted) {
      log(`BLOCKED unapproved phone number in draft: "${match}" → replaced with ${primaryFormatted}`);
      warnings.push(`Replaced unapproved number "${match}" with your primary number.`);
      return primaryFormatted;
    }
    log(`BLOCKED unapproved phone number in draft: "${match}" → removed (no approved numbers configured)`);
    warnings.push(`Removed unapproved number "${match}" — add your real numbers in Options.`);
    return "[phone removed]";
  });

  return { text: sanitized, warnings };
}

function normalizePhone(str) {
  const digits = String(str).replace(/\D/g, "");
  // Strip leading 1 for comparison
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

// ─── Message Handlers ────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message?.type) {
    // From the side panel: kick off a scan on the open Messenger tab
    case "LR_START_SCAN":
      startScan()
        .then(sendResponse)
        .catch((err) => sendResponse({ ok: false, error: "scan_start_failed", detail: err?.message }));
      return true;

    // From the content script: incremental scan results
    case "LR_THREAD_FOUND":
      recordThread(message.thread).then(() => sendResponse({ ok: true }));
      return true;

    case "LR_SCAN_COMPLETE":
      setScanStatus({
        state: "done",
        found: message.found ?? 0,
        skipped: message.skipped ?? 0,
        empty: !!message.empty,
        finishedAt: Date.now(),
      }).then(() => sendResponse({ ok: true }));
      return true;

    case "LR_SCAN_ERROR":
      setScanStatus({
        state: "error",
        error: message.error,
        detail: message.detail || null,
        finishedAt: Date.now(),
      }).then(() => sendResponse({ ok: true }));
      return true;

    // From the side panel: generate an AI reply DRAFT (human sends it)
    case "LR_GENERATE_DRAFT":
      generateDraft(message.thread)
        .then(sendResponse)
        .catch((err) => sendResponse({ ok: false, error: "draft_failed", detail: err?.message }));
      return true;

    // From the side panel: push this thread to the CRM as a lead
    case "LR_CAPTURE_LEAD":
      captureLead(message.thread)
        .then(sendResponse)
        .catch((err) => sendResponse({ ok: false, error: "capture_failed", detail: err?.message }));
      return true;

    // From the side panel: force a queue flush right now
    case "LR_FLUSH_QUEUE":
      flushLeadQueue()
        .then((result) => sendResponse({ ok: true, ...result }))
        .catch((err) => sendResponse({ ok: false, detail: err?.message }));
      return true;
  }
});

// ─── Scan Orchestration ──────────────────────────────────────────────────────

async function startScan() {
  // Scan the tab the dealer ALREADY has open. We deliberately do not open
  // facebook.com ourselves — the human drives the browser, we just read it.
  const tabs = await chrome.tabs.query({ url: "https://www.facebook.com/messages/*" });

  if (tabs.length === 0) {
    return {
      ok: false,
      error: "no_tab",
      detail: "No Facebook Messages tab is open. Open facebook.com/messages, select the Marketplace section, and scan again.",
    };
  }

  // Reset scan state for a fresh run
  await chrome.storage.session.set({
    [THREADS_KEY]: [],
    [SCAN_STATUS_KEY]: { state: "scanning", startedAt: Date.now() },
  });

  for (const tab of tabs) {
    const started = await askTabToScan(tab.id);
    if (started) return { ok: true, tabId: tab.id };
  }

  await setScanStatus({
    state: "error",
    error: "content_script_unreachable",
    detail: "Could not reach the Messages tab. Refresh the facebook.com/messages tab and try again.",
    finishedAt: Date.now(),
  });
  return { ok: false, error: "content_script_unreachable" };
}

async function askTabToScan(tabId) {
  // Try the already-loaded content script first; if the tab predates the
  // extension install, inject content.js and retry once.
  const trySend = async () => {
    try {
      const res = await chrome.tabs.sendMessage(tabId, { type: "LR_SCAN" });
      return !!res?.started;
    } catch {
      return false;
    }
  };

  if (await trySend()) return true;

  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
  } catch (err) {
    log("Could not inject content script into tab", tabId, err?.message);
    return false;
  }

  return trySend();
}

async function recordThread(thread) {
  if (!thread?.threadId) return;
  const data = await chrome.storage.session.get(THREADS_KEY);
  const threads = data[THREADS_KEY] || [];
  // Replace any earlier record for the same thread (dedupe within a scan)
  const next = threads.filter((t) => t.threadId !== thread.threadId);
  next.push(thread);
  await chrome.storage.session.set({ [THREADS_KEY]: next });
}

async function setScanStatus(status) {
  await chrome.storage.session.set({ [SCAN_STATUS_KEY]: status });
}

// ─── Draft Generation ────────────────────────────────────────────────────────
// Same request contract as the original extension used against
// POST {apiBaseUrl}/api/fb/generate-reply with header x-agent-secret.
// The response's `reply` becomes a DRAFT in the side panel — nothing more.

async function generateDraft(thread) {
  const config = await getConfig();

  if (!config.apiBaseUrl) {
    return { ok: false, error: "not_configured", detail: "Set your API base URL in the Lead Rescue options page." };
  }
  if (!config.dealerApiKey) {
    return { ok: false, error: "not_configured", detail: "Set your dealer API key in the Lead Rescue options page." };
  }

  const url = joinUrl(config.apiBaseUrl, "/api/fb/generate-reply");

  let reply;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-agent-secret": config.dealerApiKey,
      },
      // Request shape kept identical to the original extension
      body: JSON.stringify({
        senderId: thread.threadId,
        senderName: thread.senderName,
        messageText: thread.messageText,
        listingTitle: thread.listingTitle,
        threadId: thread.threadId,
        conversationHistory: thread.conversationHistory,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`API returned ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const json = await res.json();
    reply = json.reply;
    if (!reply) throw new Error("Empty reply from API. Response: " + JSON.stringify(json).slice(0, 200));
    log("AI draft generated:", reply.slice(0, 100));
  } catch (err) {
    log("Draft API error:", err?.message);
    return { ok: false, error: "api_error", detail: err?.message };
  }

  // Phone number guardrail: applied to every draft before a human sees it
  const { text, warnings } = enforceApprovedPhones(reply, config);

  return { ok: true, draft: text, warnings };
}

// ─── Lead Capture (with offline queue) ───────────────────────────────────────
// POST {apiBaseUrl}/api/leads — the CRM backend contract. If the CRM is
// unreachable (or errors), the lead is queued in chrome.storage.local and
// retried every LEAD_QUEUE_RETRY_MINUTES until it lands. Leads are never
// silently dropped.

async function captureLead(thread) {
  const config = await getConfig();

  if (!config.apiBaseUrl) {
    return { ok: false, error: "not_configured", detail: "Set your API base URL in the Lead Rescue options page." };
  }

  const payload = {
    dealer_id: config.dealerId || null,
    buyer_name: thread.senderName || null,
    thread_id: thread.threadId,
    listing_title: thread.listingTitle || null,
    last_message: thread.messageText || null,
    conversation_history: thread.conversationHistory || null,
    phone: thread.buyerPhone || null,
    email: thread.buyerEmail || null,
    source: "lead-rescue-extension",
    captured_at: new Date().toISOString(),
  };

  const result = await postLead(payload, config);

  if (result.delivered) {
    await setLeadStatus(thread.threadId, { state: "delivered", at: Date.now() });
    return { ok: true, delivered: true };
  }

  // CRM unreachable or errored — queue locally and retry on the alarm
  const queued = await enqueueLead(payload);
  await setLeadStatus(thread.threadId, {
    state: queued ? "queued" : "failed",
    at: Date.now(),
    detail: result.detail || null,
  });
  return { ok: true, delivered: false, queued, detail: result.detail || null };
}

async function postLead(payload, config) {
  const url = joinUrl(config.apiBaseUrl, "/api/leads");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-agent-secret": config.dealerApiKey || "",
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { delivered: true };
    const errBody = await res.text().catch(() => "");
    return { delivered: false, detail: `CRM returned ${res.status}: ${errBody.slice(0, 200)}` };
  } catch (err) {
    return { delivered: false, detail: err?.message || "network error" };
  }
}

async function enqueueLead(payload) {
  const data = await chrome.storage.local.get(LEAD_QUEUE_KEY);
  const queue = data[LEAD_QUEUE_KEY] || [];
  if (queue.length >= LEAD_QUEUE_MAX) {
    log("Lead queue full — dropping oldest entry to make room.");
    queue.shift();
  }
  queue.push({ payload, queuedAt: Date.now(), attempts: 0 });
  await chrome.storage.local.set({ [LEAD_QUEUE_KEY]: queue });
  log(`Lead queued locally (${queue.length} pending). Will retry every ${LEAD_QUEUE_RETRY_MINUTES} min.`);
  return true;
}

async function flushLeadQueue() {
  const config = await getConfig();
  const data = await chrome.storage.local.get(LEAD_QUEUE_KEY);
  const queue = data[LEAD_QUEUE_KEY] || [];
  if (queue.length === 0) return { flushed: 0, remaining: 0 };
  if (!config.apiBaseUrl) return { flushed: 0, remaining: queue.length };

  log(`Flushing lead queue: ${queue.length} pending...`);
  const remaining = [];
  let flushed = 0;

  for (const item of queue) {
    const result = await postLead(item.payload, config);
    if (result.delivered) {
      flushed += 1;
      const threadId = item.payload.thread_id;
      if (threadId) await setLeadStatus(threadId, { state: "delivered", at: Date.now() });
    } else {
      remaining.push({ ...item, attempts: (item.attempts || 0) + 1, lastError: result.detail, lastAttemptAt: Date.now() });
    }
  }

  await chrome.storage.local.set({ [LEAD_QUEUE_KEY]: remaining });
  if (flushed > 0) log(`Delivered ${flushed} queued lead(s); ${remaining.length} still pending.`);
  return { flushed, remaining: remaining.length };
}

async function setLeadStatus(threadId, status) {
  const data = await chrome.storage.session.get(LEAD_STATUS_KEY);
  const map = data[LEAD_STATUS_KEY] || {};
  map[threadId] = status;
  await chrome.storage.session.set({ [LEAD_STATUS_KEY]: map });
}

// ─── Config / Utils ──────────────────────────────────────────────────────────

async function getConfig() {
  const data = await chrome.storage.local.get(CONFIG_KEY);
  return {
    apiBaseUrl: "",
    dealerApiKey: "",
    dealerId: "",
    approvedPhones: [],
    ignoredThreadIds: [],
    ignoredSenders: [],
    extraTopicKeywords: [],
    ...(data[CONFIG_KEY] || {}),
  };
}

function joinUrl(base, path) {
  return String(base).replace(/\/+$/, "") + path;
}

function log(...args) {
  console.log("[Lead Rescue]", ...args);
}
