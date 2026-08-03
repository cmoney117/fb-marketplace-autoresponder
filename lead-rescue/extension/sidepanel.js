/**
 * Lead Rescue — Side Panel UI
 *
 * Renders scanned Marketplace threads, fetches AI reply DRAFTS on demand,
 * and offers [Copy] + [Capture lead]. All DOM is built with createElement/
 * textContent — no innerHTML with page-derived strings.
 *
 * There is deliberately no "Send" button anywhere in this file.
 */

const CONFIG_KEY = "lrConfig";
const THREADS_KEY = "lrThreads";
const SCAN_STATUS_KEY = "lrScanStatus";
const LEAD_STATUS_KEY = "lrLeadStatus";
const LEAD_QUEUE_KEY = "lrLeadQueue";

// Drafts live in panel memory only, keyed by messageId. Closing the panel
// discards them (they're one click away from regeneration).
const drafts = new Map();

const el = (id) => document.getElementById(id);

// ─── Wiring ──────────────────────────────────────────────────────────────────

el("openOptions").addEventListener("click", () => chrome.runtime.openOptionsPage());

el("scanBtn").addEventListener("click", async () => {
  el("scanBtn").disabled = true;
  el("scanStatus").textContent = "Starting scan...";
  const res = await chrome.runtime.sendMessage({ type: "LR_START_SCAN" });
  if (!res?.ok) {
    el("scanBtn").disabled = false;
    el("scanStatus").textContent = res?.detail || "Could not start scan.";
  }
  // Progress + completion arrive via storage.session changes
});

el("retryQueue").addEventListener("click", async () => {
  el("queueNote").style.display = "block";
  await chrome.runtime.sendMessage({ type: "LR_FLUSH_QUEUE" });
  refreshQueueNote();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "session") {
    if (changes[THREADS_KEY] || changes[LEAD_STATUS_KEY]) renderThreads();
    if (changes[SCAN_STATUS_KEY]) renderScanStatus();
  }
  if (area === "local") {
    if (changes[LEAD_QUEUE_KEY]) refreshQueueNote();
    if (changes[CONFIG_KEY]) refreshConfigBanner();
  }
});

// ─── Renderers ───────────────────────────────────────────────────────────────

async function refreshConfigBanner() {
  const data = await chrome.storage.local.get(CONFIG_KEY);
  const config = data[CONFIG_KEY] || {};
  const missing = !config.apiBaseUrl || !config.dealerApiKey;
  el("configBanner").style.display = missing ? "block" : "none";
}

async function refreshQueueNote() {
  const data = await chrome.storage.local.get(LEAD_QUEUE_KEY);
  const queue = data[LEAD_QUEUE_KEY] || [];
  el("queueCount").textContent = String(queue.length);
  el("queueNote").style.display = queue.length > 0 ? "block" : "none";
}

async function renderScanStatus() {
  const data = await chrome.storage.session.get(SCAN_STATUS_KEY);
  const status = data[SCAN_STATUS_KEY];
  const label = el("scanStatus");
  const btn = el("scanBtn");

  if (!status) {
    label.textContent = "Idle";
    btn.disabled = false;
    return;
  }

  switch (status.state) {
    case "scanning":
      label.textContent = "Scanning your open Messages tab...";
      btn.disabled = true;
      break;
    case "done":
      label.textContent = status.empty
        ? "Scan done — no Marketplace conversations found."
        : `Scan done — ${status.found} to review, ${status.skipped} skipped.`;
      btn.disabled = false;
      break;
    case "error":
      label.textContent = status.detail || `Scan failed (${status.error}).`;
      btn.disabled = false;
      break;
    default:
      label.textContent = "Idle";
      btn.disabled = false;
  }
}

async function renderThreads() {
  const data = await chrome.storage.session.get([THREADS_KEY, LEAD_STATUS_KEY]);
  const threads = data[THREADS_KEY] || [];
  const leadStatus = data[LEAD_STATUS_KEY] || {};

  const eligible = threads.filter((t) => t.eligible);
  const skipped = threads.filter((t) => !t.eligible);

  const list = el("threadList");
  list.textContent = "";
  el("emptyState").style.display = eligible.length === 0 ? "block" : "none";

  for (const thread of eligible) {
    list.appendChild(buildThreadCard(thread, leadStatus[thread.threadId]));
  }

  // Skipped section
  const section = el("skippedSection");
  const skippedList = el("skippedList");
  skippedList.textContent = "";
  el("skippedCount").textContent = String(skipped.length);
  section.style.display = skipped.length > 0 ? "block" : "none";
  for (const s of skipped) {
    const row = document.createElement("div");
    row.className = "skipped-item";
    const id = document.createElement("div");
    id.textContent = `Thread ${s.threadId}`;
    const reason = document.createElement("div");
    reason.className = "reason";
    reason.textContent = s.skippedDetail || s.skippedReason || "skipped";
    row.appendChild(id);
    row.appendChild(reason);
    skippedList.appendChild(row);
  }
}

function buildThreadCard(thread, leadState) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.threadId = thread.threadId;

  const who = document.createElement("div");
  who.className = "who";
  who.textContent = thread.senderName || `Thread ${thread.threadId}`;
  card.appendChild(who);

  if (thread.listingTitle) {
    const listing = document.createElement("div");
    listing.className = "listing";
    listing.textContent = thread.listingTitle;
    card.appendChild(listing);
  }

  const msg = document.createElement("div");
  msg.className = "msg";
  msg.textContent = thread.messageText || "";
  card.appendChild(msg);

  // Contact chips + lead status
  const chips = document.createElement("div");
  chips.className = "chips";
  if (thread.buyerPhone) chips.appendChild(chip(`📞 ${thread.buyerPhone}`, "ok"));
  if (thread.buyerEmail) chips.appendChild(chip(`✉ ${thread.buyerEmail}`, "ok"));
  if (leadState?.state === "delivered") chips.appendChild(chip("Lead captured ✓", "ok"));
  if (leadState?.state === "queued") chips.appendChild(chip("Lead queued — retrying", "warn"));
  if (leadState?.state === "failed") chips.appendChild(chip("Lead capture failed", "warn"));
  if (chips.childElementCount > 0) card.appendChild(chips);

  // Full conversation
  if (thread.conversationHistory) {
    const details = document.createElement("details");
    details.className = "history";
    const summary = document.createElement("summary");
    summary.textContent = "Full conversation";
    const pre = document.createElement("pre");
    pre.textContent = thread.conversationHistory;
    details.appendChild(summary);
    details.appendChild(pre);
    card.appendChild(details);
  }

  // Action buttons
  const actions = document.createElement("div");
  actions.className = "actions";

  const draftBtn = document.createElement("button");
  draftBtn.className = "btn small";
  draftBtn.textContent = drafts.has(thread.messageId) ? "Redraft reply" : "Draft reply";

  const captureBtn = document.createElement("button");
  captureBtn.className = "btn small secondary";
  captureBtn.textContent = "Capture lead";
  if (leadState?.state === "delivered") {
    captureBtn.disabled = true;
    captureBtn.textContent = "Lead captured";
  }

  const openBtn = document.createElement("button");
  openBtn.className = "btn small secondary";
  openBtn.textContent = "Open thread";
  openBtn.title = "Focus this conversation in your Facebook tab";

  actions.appendChild(draftBtn);
  actions.appendChild(captureBtn);
  actions.appendChild(openBtn);
  card.appendChild(actions);

  // Draft area
  const draftArea = document.createElement("div");
  draftArea.className = "draft-area";
  const textarea = document.createElement("textarea");
  textarea.setAttribute("aria-label", "Reply draft — edit before copying");
  const warningsDiv = document.createElement("div");
  warningsDiv.className = "draft-warnings";
  const copyRow = document.createElement("div");
  copyRow.className = "actions";
  const copyBtn = document.createElement("button");
  copyBtn.className = "btn small";
  copyBtn.textContent = "Copy";
  copyRow.appendChild(copyBtn);
  const hint = document.createElement("div");
  hint.className = "draft-hint";
  hint.textContent = "Review and edit, then Copy → paste into Facebook's message box → click Send there yourself.";
  draftArea.appendChild(textarea);
  draftArea.appendChild(warningsDiv);
  draftArea.appendChild(copyRow);
  draftArea.appendChild(hint);
  card.appendChild(draftArea);

  const statusLine = document.createElement("div");
  statusLine.className = "thread-status";
  card.appendChild(statusLine);

  // Restore an in-memory draft if we have one
  const existing = drafts.get(thread.messageId);
  if (existing) {
    textarea.value = existing.text;
    warningsDiv.textContent = (existing.warnings || []).join("\n");
    draftArea.style.display = "block";
  }

  // ── Handlers ──
  draftBtn.addEventListener("click", async () => {
    draftBtn.disabled = true;
    draftBtn.textContent = "Drafting...";
    statusLine.textContent = "";
    statusLine.className = "thread-status";

    const res = await chrome.runtime.sendMessage({ type: "LR_GENERATE_DRAFT", thread });

    draftBtn.disabled = false;
    if (res?.ok) {
      drafts.set(thread.messageId, { text: res.draft, warnings: res.warnings || [] });
      textarea.value = res.draft;
      warningsDiv.textContent = (res.warnings || []).join("\n");
      draftArea.style.display = "block";
      draftBtn.textContent = "Redraft reply";
    } else {
      draftBtn.textContent = "Draft reply";
      statusLine.textContent = res?.detail || "Could not generate a draft.";
      statusLine.className = "thread-status err";
    }
  });

  textarea.addEventListener("input", () => {
    const d = drafts.get(thread.messageId) || { warnings: [] };
    drafts.set(thread.messageId, { ...d, text: textarea.value });
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(textarea.value);
      copyBtn.textContent = "Copied ✓";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
    } catch {
      // Fallback: select the text so the human can Ctrl+C
      textarea.focus();
      textarea.select();
      copyBtn.textContent = "Press Ctrl+C";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 2500);
    }
  });

  captureBtn.addEventListener("click", async () => {
    captureBtn.disabled = true;
    captureBtn.textContent = "Capturing...";
    const res = await chrome.runtime.sendMessage({ type: "LR_CAPTURE_LEAD", thread });
    if (res?.ok && res.delivered) {
      captureBtn.textContent = "Lead captured";
      statusLine.textContent = "Lead sent to your CRM.";
      statusLine.className = "thread-status ok";
    } else if (res?.ok && res.queued) {
      captureBtn.disabled = false;
      captureBtn.textContent = "Capture lead";
      statusLine.textContent = "CRM unreachable — lead queued locally, will retry automatically.";
      statusLine.className = "thread-status ok";
    } else {
      captureBtn.disabled = false;
      captureBtn.textContent = "Capture lead";
      statusLine.textContent = res?.detail || "Could not capture lead.";
      statusLine.className = "thread-status err";
    }
  });

  openBtn.addEventListener("click", async () => {
    // Focus (not create) the dealer's own Facebook tab on this thread
    const tabs = await chrome.tabs.query({ url: "https://www.facebook.com/messages/*" });
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, { url: thread.href, active: true });
      await chrome.windows.update(tabs[0].windowId, { focused: true });
    }
  });

  return card;
}

function chip(text, cls) {
  const c = document.createElement("span");
  c.className = `chip ${cls || ""}`;
  c.textContent = text;
  return c;
}

// ─── Init ────────────────────────────────────────────────────────────────────

refreshConfigBanner();
refreshQueueNote();
renderScanStatus();
renderThreads();
