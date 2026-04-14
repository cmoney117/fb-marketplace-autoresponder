/**
 * Background Service Worker
 * Orchestrates polling, reply generation, and state management.
 */

const CRM_URL = "https://usa-fleet-sales-crm.vercel.app/api/fb/generate-reply";
const POLL_INTERVAL_MINUTES = 1; // Check every 60 seconds
const REPLIED_KEY = "repliedMessageIds";
const CONFIG_KEY = "config";

// ─── Phone Number Guardrail ─────────────────────────────────────────────────
// ONLY these numbers are allowed in outbound messages. Any other phone number
// found in a reply will be stripped and replaced with the primary number.
const APPROVED_PHONES = [
  "6157564629",   // USA Fleet Sales — calls only
];

/**
 * Scans text for phone numbers. If ANY phone number is found that isn't on
 * the approved list, it gets replaced with the primary approved number.
 * Returns the sanitized text.
 */
function enforceApprovedPhones(text) {
  // Match common US phone patterns: (XXX) XXX-XXXX, XXX-XXX-XXXX, XXX.XXX.XXXX,
  // XXXXXXXXXX, +1XXXXXXXXXX, 1-XXX-XXX-XXXX, etc.
  const phoneRegex = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
  const primaryFormatted = "615-756-4629";

  return text.replace(phoneRegex, (match) => {
    const digits = match.replace(/\D/g, "");
    // Strip leading 1 for comparison
    const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
    if (APPROVED_PHONES.includes(normalized)) {
      return match; // Approved — keep as-is
    }
    log(`BLOCKED unapproved phone number: "${match}" → replaced with ${primaryFormatted}`);
    return primaryFormatted;
  });
}

// ─── Startup ─────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("pollMarketplace", {
    periodInMinutes: POLL_INTERVAL_MINUTES,
  });
  log("Extension installed. Polling every", POLL_INTERVAL_MINUTES, "minute(s).");
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("pollMarketplace", {
    periodInMinutes: POLL_INTERVAL_MINUTES,
  });
});

// ─── Main Poll Loop ───────────────────────────────────────────────────────────

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "pollMarketplace") return;

  const config = await getConfig();
  if (!config.agentSecret) {
    log("No agent secret configured. Open the extension popup to set it up.");
    return;
  }
  if (!config.enabled) {
    log("Auto-reply is paused.");
    return;
  }

  // Find an open Facebook Messenger tab, or open one
  const tabs = await chrome.tabs.query({ url: "https://www.facebook.com/messages/*" });

  if (tabs.length === 0) {
    // Open Messenger in background tab if not already open
    chrome.tabs.create({
      url: "https://www.facebook.com/messages/",
      active: false,
    });
    log("Opened Facebook Messenger tab for monitoring.");
    return; // Content script will fire on next poll
  }

  // Ask content script to scan for new messages
  for (const tab of tabs) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: triggerScan,
      });
    } catch (err) {
      log("Could not inject into tab", tab.id, err?.message);
    }
  }
});

// ─── Message Handler (from content script) ───────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NEW_MARKETPLACE_MESSAGE") {
    handleNewMessage(message.data)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((err) => {
        log("Error handling message:", err?.message);
        sendResponse({ ok: false, error: err?.message });
      });
    return true; // Keep channel open for async response
  }

  if (message.type === "GET_STATUS") {
    getStatus().then(sendResponse);
    return true;
  }
});

// ─── Core Logic ──────────────────────────────────────────────────────────────

async function handleNewMessage(data) {
  const { messageId, senderId, senderName, messageText, listingTitle, threadId, conversationHistory } = data;

  // Deduplicate
  const replied = await getRepliedIds();
  if (replied.has(messageId)) {
    log("Already replied to", messageId, "— skipping.");
    return { skipped: true };
  }

  log(`New Marketplace message from ${senderName || senderId}: "${messageText.slice(0, 80)}"`);

  const config = await getConfig();

  // Call CRM API for AI reply
  let reply;
  try {
    const res = await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-agent-secret": config.agentSecret,
      },
      body: JSON.stringify({ senderId, senderName, messageText, listingTitle, threadId, conversationHistory }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`CRM API returned ${res.status}: ${errBody.slice(0, 200)}`);
    }

    const json = await res.json();
    reply = json.reply;

    if (!reply) throw new Error("Empty reply from CRM API. Response: " + JSON.stringify(json).slice(0, 200));
    log("AI reply generated:", reply.slice(0, 100));
  } catch (err) {
    log("CRM API error:", err?.message);
    log("Config check — agentSecret present:", !!config.agentSecret, "length:", config.agentSecret?.length);
    // Use fallback reply so conversation isn't dropped
    reply = config.fallbackReply || CORRECT_FALLBACK;
  }

  // ── Phone number guardrail: block ALL unapproved numbers before sending ──
  reply = enforceApprovedPhones(reply);

  // Tell content script to send the reply
  const tabs = await chrome.tabs.query({ url: "https://www.facebook.com/messages/*" });
  let sent = false;

  for (const tab of tabs) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: sendReplyInBrowser,
        args: [threadId, reply],
      });
      if (results?.[0]?.result?.sent) {
        sent = true;
        break;
      }
    } catch (err) {
      log("Send script error on tab", tab.id, ":", err?.message);
    }
  }

  if (sent) {
    // Mark as replied so we don't double-reply
    await markReplied(messageId);
    log("Reply sent successfully.");
    await updateStats({ sent: 1 });
  } else {
    log("Could not send reply — Facebook tab may not be on the right conversation.");
    await updateStats({ failed: 1 });
  }

  return { sent, reply };
}

// ─── Functions injected into page (must be self-contained) ───────────────────

function triggerScan() {
  // This runs in the page context — triggers the content script's scan
  window.dispatchEvent(new CustomEvent("UFS_SCAN_INBOX"));
}

async function sendReplyInBrowser(threadId, replyText) {
  // Injected into the Facebook Messenger tab to navigate and send a reply
  // Returns { sent: true/false }
  try {
    // Navigate to the specific conversation if we have a thread URL hint
    const targetUrl = `https://www.facebook.com/messages/t/${threadId}`;
    if (!window.location.href.includes(threadId)) {
      window.location.href = targetUrl;
      await new Promise((r) => setTimeout(r, 3000));
    }

    // Find the message input
    const selectors = [
      '[aria-label="Message"]',
      '[data-lexical-editor="true"]',
      '[contenteditable="true"][role="textbox"]',
    ];

    let input = null;
    for (const sel of selectors) {
      input = document.querySelector(sel);
      if (input) break;
    }

    if (!input) return { sent: false, reason: "input_not_found" };

    // Focus and type the reply
    input.focus();
    await new Promise((r) => setTimeout(r, 300));

    // Use execCommand to insert text (works with React's synthetic events)
    document.execCommand("insertText", false, replyText);

    // Trigger React's onChange
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLElement.prototype,
      "textContent"
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, replyText);
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));

    await new Promise((r) => setTimeout(r, 500));

    // Send with Enter key
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true })
    );
    input.dispatchEvent(
      new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true })
    );

    await new Promise((r) => setTimeout(r, 500));

    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err?.message };
  }
}

// ─── Storage Helpers ──────────────────────────────────────────────────────────

async function getRepliedIds() {
  const data = await chrome.storage.local.get(REPLIED_KEY);
  return new Set(data[REPLIED_KEY] || []);
}

async function markReplied(messageId) {
  const replied = await getRepliedIds();
  replied.add(messageId);
  // Keep only the last 1000 IDs to avoid unbounded growth
  const arr = [...replied].slice(-1000);
  await chrome.storage.local.set({ [REPLIED_KEY]: arr });
}

const CORRECT_FALLBACK = "Thanks for your interest! We have work trucks and vans available. Check our inventory at usafleetsales.com or call us at 615-756-4629.";

async function getConfig() {
  const data = await chrome.storage.local.get(CONFIG_KEY);
  const config = data[CONFIG_KEY] || {
    enabled: true,
    agentSecret: "",
    fallbackReply: CORRECT_FALLBACK,
  };

  // Migration: replace any stored fallback that has the old wrong phone numbers
  if (config.fallbackReply && (/629.?206.?7938|931.?572.?7466/.test(config.fallbackReply))) {
    config.fallbackReply = CORRECT_FALLBACK;
    await chrome.storage.local.set({ [CONFIG_KEY]: config });
    log("Migrated fallback reply to correct phone number.");
  }

  return config;
}

async function getStatus() {
  const config = await getConfig();
  const data = await chrome.storage.local.get(["stats", REPLIED_KEY]);
  return {
    enabled: config.enabled,
    configured: !!config.agentSecret,
    repliedCount: (data[REPLIED_KEY] || []).length,
    stats: data.stats || { sent: 0, failed: 0 },
  };
}

async function updateStats(delta) {
  const data = await chrome.storage.local.get("stats");
  const stats = data.stats || { sent: 0, failed: 0 };
  if (delta.sent) stats.sent += delta.sent;
  if (delta.failed) stats.failed += delta.failed;
  await chrome.storage.local.set({ stats });
}

function log(...args) {
  console.log("[UFS AutoReply]", ...args);
}
