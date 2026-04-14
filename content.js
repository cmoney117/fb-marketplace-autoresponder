/**
 * Content Script — runs on facebook.com/messages/*
 * RULES:
 *  1. Only operates when the Marketplace tab/section is active
 *  2. Only replies to people who messaged US first (they sent the opening message)
 *  3. Never touches personal inbox conversations
 *  4. Never replies twice to the same thread
 *  5. Never replies to Facebook/Meta/system senders
 */

const SCAN_INTERVAL_MS = 60000; // Scan every 60 seconds
const SEEN_KEY = "__ufs_seen_messages__";
const REPLIED_KEY = "__ufs_replied_threads__"; // Persists across sessions via sessionStorage

let seenMessages = new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) || "[]"));
let repliedThreads = new Set(JSON.parse(sessionStorage.getItem(REPLIED_KEY) || "[]"));
let scanning = false;

// Senders we must NEVER auto-reply to
const IGNORED_SENDERS = [
  "facebook", "facebook assistant", "marketplace", "meta", "messenger",
  "facebook marketplace", "facebook for business",
];

function isIgnoredSender(name) {
  if (!name) return false;
  const lower = name.toLowerCase().trim();
  return IGNORED_SENDERS.some((s) => lower.includes(s));
}

// ─── Safety Gate: Only Run in Marketplace Section ─────────────────────────────

function isOnMarketplaceTab() {
  // Must be in a Marketplace conversation thread — check page context
  const url = window.location.href;

  // Direct marketplace thread URLs contain marketplace context
  // The Marketplace tab in Messages shows conversations with marketplace items
  const pageText = document.body?.textContent || "";

  // Look for Marketplace section being active in sidebar
  const marketplaceTabActive = (
    document.querySelector('[aria-label="Marketplace"]') !== null ||
    document.querySelector('[aria-selected="true"][aria-label*="Marketplace"]') !== null ||
    document.querySelector('[href*="marketplace"]') !== null
  );

  // Check if we're in a thread that has marketplace listing context
  const hasListingContext = (
    pageText.includes("Listing by") ||
    pageText.includes("Item details") ||
    pageText.includes("See listing") ||
    document.querySelector('[aria-label*="listing"]') !== null ||
    document.querySelector('[data-testid*="marketplace"]') !== null
  );

  return marketplaceTabActive || hasListingContext;
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

// Auto-scan DISABLED — too risky: was replying to sellers in buyer-initiated threads.
// Scanning is now manual-only, triggered from the extension popup.
window.addEventListener("UFS_SCAN_INBOX", () => scanInbox());
// setInterval(() => scanInbox(), SCAN_INTERVAL_MS);
// setTimeout(() => scanInbox(), 6000);

// ─── Inbox Scanner ────────────────────────────────────────────────────────────

async function scanInbox() {
  if (scanning) return;

  // HARD GATE: Only run when Marketplace section is visible
  if (!isOnMarketplaceTab()) {
    log("Not on Marketplace tab — skipping scan entirely.");
    return;
  }

  scanning = true;

  try {
    const conversations = getMarketplaceConversations();
    if (conversations.length === 0) {
      log("No Marketplace conversations found.");
      scanning = false;
      return;
    }

    log(`Found ${conversations.length} Marketplace conversation(s).`);

    for (const conv of conversations) {
      await processConversation(conv);
      await sleep(1000);
    }
  } catch (err) {
    log("Scan error:", err?.message);
  } finally {
    scanning = false;
  }
}

// ─── Conversation Detection ───────────────────────────────────────────────────

function getMarketplaceConversations() {
  const results = [];

  const convItems = document.querySelectorAll(
    '[data-testid="conversation-list-item"], [role="row"], [role="listitem"]'
  );

  for (const item of convItems) {
    const text = item.textContent || "";

    const isMarketplace = (
      text.includes("Marketplace") ||
      text.includes("marketplace") ||
      item.querySelector('[aria-label*="Marketplace"]') ||
      item.querySelector('[aria-label*="marketplace"]') ||
      item.querySelector('svg[aria-label*="shop"]') ||
      (item.querySelector('a[href*="/messages/t/"]') && hasMarketplaceIcon(item))
    );

    if (!isMarketplace) continue;

    const link = item.querySelector('a[href*="/messages/t/"]');
    if (!link) continue;

    const href = link.href;
    const threadIdMatch = href.match(/\/messages\/t\/([^/?]+)/);
    const threadId = threadIdMatch?.[1];
    if (!threadId) continue;

    results.push({ threadId, element: item, href });
  }

  // Fallback: if currently viewing a marketplace thread
  if (results.length === 0) {
    const currentThread = getCurrentThreadFromUrl();
    if (currentThread && isCurrentConversationMarketplace()) {
      results.push({ threadId: currentThread, element: document.body, href: window.location.href });
    }
  }

  return results;
}

function hasMarketplaceIcon(element) {
  const svgs = element.querySelectorAll("svg");
  for (const svg of svgs) {
    const label = svg.getAttribute("aria-label")?.toLowerCase() || "";
    if (label.includes("marketplace") || label.includes("shop")) return true;
  }
  return false;
}

function getCurrentThreadFromUrl() {
  const match = window.location.href.match(/\/messages\/t\/([^/?]+)/);
  return match?.[1] || null;
}

function isCurrentConversationMarketplace() {
  const pageText = document.body.textContent || "";
  return (
    pageText.includes("Marketplace") ||
    pageText.includes("Listing by") ||
    pageText.includes("Item details") ||
    document.querySelector('[aria-label*="listing"]') !== null
  );
}

// ─── Process a Single Conversation ───────────────────────────────────────────

async function processConversation(conv) {
  const { threadId, element } = conv;

  // RULE: Never reply to same thread twice
  if (repliedThreads.has(threadId)) {
    log(`Thread ${threadId}: Already replied — skipping.`);
    return;
  }

  // Navigate to the conversation if needed
  const currentThread = getCurrentThreadFromUrl();
  if (currentThread !== threadId) {
    const link = element.querySelector(`a[href*="${threadId}"]`);
    if (link) {
      link.click();
      await sleep(3000);
    }
  }

  // RULE: Check who sent the first message — skip if WE opened the conversation
  if (didWeSendFirstMessage()) {
    log(`Thread ${threadId}: We sent the first message — NOT a buyer inquiry. Skipping.`);
    return;
  }

  // Get the last inbound message
  const lastInbound = getLastInboundMessage();
  if (!lastInbound) {
    log(`Thread ${threadId}: No inbound message found.`);
    return;
  }

  // RULE: Skip Facebook/Meta system messages
  if (isIgnoredSender(lastInbound.senderName)) {
    log(`Thread ${threadId}: Ignored sender "${lastInbound.senderName}" — skipping.`);
    return;
  }

  // RULE: Only reply if LAST message is from them (not us)
  if (lastInbound.isOurMessage) {
    log(`Thread ${threadId}: Last message is ours — they haven't replied, won't double-message.`);
    return;
  }

  const messageId = `${threadId}:${lastInbound.text.slice(0, 40)}`;

  if (seenMessages.has(messageId)) {
    log(`Thread ${threadId}: Already processed this exact message.`);
    return;
  }

  // GUARD: Only reply if the conversation is actually about a vehicle
  const combinedText = `${lastInbound.text} ${getListingTitle() || ""}`;
  if (!isVehicleConversation(combinedText)) {
    log(`Thread ${threadId}: Not a vehicle conversation — skipping. Text: "${lastInbound.text.slice(0, 60)}"`);
    return;
  }

  log(`Thread ${threadId}: Buyer message — "${lastInbound.text.slice(0, 80)}"`);

  const listingTitle = getListingTitle();

  // Build full conversation history for AI context
  const conversationHistory = buildConversationHistory();

  const response = await chrome.runtime.sendMessage({
    type: "NEW_MARKETPLACE_MESSAGE",
    data: {
      messageId,
      senderId: threadId,
      senderName: lastInbound.senderName,
      messageText: lastInbound.text,
      listingTitle,
      threadId,
      conversationHistory,
    },
  });

  if (response?.ok) {
    seenMessages.add(messageId);
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seenMessages].slice(-500)));

    // Mark this thread as replied — never reply again
    repliedThreads.add(threadId);
    sessionStorage.setItem(REPLIED_KEY, JSON.stringify([...repliedThreads].slice(-1000)));

    log(`Thread ${threadId}: Replied. sent=${response.result?.sent}`);
  } else {
    log(`Thread ${threadId}: Error — ${response?.error}`);
  }
}

// ─── DOM Helpers ──────────────────────────────────────────────────────────────

/**
 * Returns true if the first message in the conversation was sent BY US.
 * If we opened the thread (we are the buyer), skip it.
 *
 * SAFE DEFAULT: returns true (skip) whenever detection is uncertain.
 * Buyers on our listings ALWAYS message us first — if we can't confirm
 * the first message is inbound, skip rather than risk replying to a seller.
 */
function didWeSendFirstMessage() {
  const messageContainers = getMessageContainers();

  // Can't detect messages → can't confirm buyer sent first → SKIP
  if (messageContainers.length === 0) return true;

  const firstMsg = messageContainers[0];

  // Positive outbound signal on first message → we started the thread → SKIP
  if (isOutboundMessage(firstMsg)) return true;

  // First message has no outbound signals → they started the thread → PROCEED
  return false;
}

/**
 * Extra guard: only proceed if the conversation topic looks like a vehicle inquiry.
 * Prevents accidentally replying to personal conversations that happen to be
 * in the Marketplace section.
 */
function isVehicleConversation(text) {
  return /\b(truck|van|transit|sprinter|promaster|box|pickup|f[- ]?150|f[- ]?250|f[- ]?350|ram|silverado|sierra|express|savana|vehicle|cargo|fleet|diesel|gas|engine|mileage|miles|available|price|payment|finance|credit|down\s*payment|work\s*van|work\s*truck|trailer|hotshot)\b/i.test(text);
}

function getMessageContainers() {
  // Use only targeted selectors — NO broad div[dir] fallback.
  // The fallback was incorrectly picking up UI chrome as "messages",
  // causing didWeSendFirstMessage() to fail silently and reply to sellers.
  const selectors = [
    '[data-testid="message-container"]',
    '[data-scope="messages_table"] [role="row"]',
    '[data-pagelet="MWMainWrapper"] [role="row"]',
  ];

  for (const sel of selectors) {
    const found = [...document.querySelectorAll(sel)];
    if (found.length > 0) return found;
  }

  // If none of the specific selectors matched, return empty.
  // Fail-safe: better to skip than to reply to a wrong conversation.
  return [];
}

function isOutboundMessage(el) {
  return !!(
    el.getAttribute("aria-label")?.includes("You") ||
    el.querySelector('[aria-label*="Sent"]') ||
    el.querySelector('[aria-label*="Delivered"]') ||
    el.querySelector('[aria-label*="Seen"]') ||
    el.closest('[style*="align-self: flex-end"]') ||
    el.closest('[style*="align-items: flex-end"]')
  );
}

function getLastInboundMessage() {
  const containers = getMessageContainers();
  let lastInbound = null;
  let senderName = null;

  for (const el of containers) {
    const text = el.textContent?.trim();
    if (!text || text.length < 2) continue;

    const outbound = isOutboundMessage(el);

    if (!outbound) {
      const nameEl =
        el.closest("[data-scope]")?.querySelector('[data-scope="user_name"]') ||
        el.closest('[role="row"]')?.querySelector('a[role="link"]');
      if (nameEl) senderName = nameEl.textContent?.trim();
      lastInbound = { text, senderName, isOurMessage: false };
    } else {
      // Track that the last message seen was ours
      lastInbound = lastInbound ? { ...lastInbound, isOurMessage: true } : null;
    }
  }

  if (lastInbound?.senderName === null) lastInbound.senderName = senderName;
  return lastInbound;
}

function getListingTitle() {
  const selectors = ['[aria-label*="listing"]', '[data-testid*="marketplace"]', "h1, h2, h3"];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el?.textContent?.trim()) return el.textContent.trim().slice(0, 200);
  }
  const header =
    document.querySelector('[role="banner"]') ||
    document.querySelector('[data-testid="conversation-header"]');
  return header?.textContent?.trim().slice(0, 200) || null;
}

/**
 * Builds a plain-text conversation history string from all visible message bubbles.
 * Used to give the AI full context so it can reply specifically to the conversation.
 */
function buildConversationHistory() {
  const containers = getMessageContainers();
  if (containers.length === 0) return null;

  const lines = [];
  for (const el of containers) {
    const text = el.textContent?.trim();
    if (!text || text.length < 2) continue;
    const direction = isOutboundMessage(el) ? "Us" : "Them";
    lines.push(`${direction}: ${text.slice(0, 300)}`);
  }

  return lines.length > 0 ? lines.join("\n") : null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function log(...args) {
  console.log("[UFS AutoReply]", ...args);
}
