/**
 * Lead Rescue — Content Script (runs on facebook.com/messages/*)
 *
 * READ-ONLY BY DESIGN. This script extracts Marketplace conversations and
 * reports them to the extension's side panel. It NEVER types into Facebook's
 * composer, NEVER dispatches synthetic key events, and NEVER submits anything.
 * The human copies the drafted reply and sends it from Facebook's own UI.
 *
 * DOM selectors and safety-gate logic are copied verbatim from the original
 * (battle-tested) auto-reply extension's content.js in this repo. The send
 * path was deleted, not disabled.
 *
 * SAFETY GATES (all kept from the original):
 *  1. Only operates when the Marketplace tab/section is active
 *  2. Only surfaces threads where the BUYER messaged first
 *  3. Never surfaces threads where the last message is ours (nothing to answer)
 *  4. Never surfaces Facebook/Meta/system senders (ignore-lists, user-extendable)
 *  5. Topic gate: only surfaces conversations that look like a real inquiry
 */

(() => {
  // Guard against double-injection (manifest content_script + programmatic fallback)
  if (window.__LEAD_RESCUE_LOADED__) return;
  window.__LEAD_RESCUE_LOADED__ = true;

  const CONFIG_KEY = "lrConfig";

  let scanning = false;

  // ─── Ignore-lists (defaults copied verbatim from the original; user can extend
  // via the options page — user entries are ADDED to these, never replace them) ──

  // Thread IDs to NEVER surface (FB system bots)
  const DEFAULT_IGNORED_THREAD_IDS = [
    "389917088531093", // Facebook Marketplace Assistant
  ];

  // Senders we must NEVER surface
  const DEFAULT_IGNORED_SENDERS = [
    "facebook", "facebook assistant", "marketplace", "meta", "messenger",
    "facebook marketplace", "facebook for business",
  ];

  async function getLrConfig() {
    try {
      const data = await chrome.storage.local.get(CONFIG_KEY);
      return data[CONFIG_KEY] || {};
    } catch {
      return {};
    }
  }

  function buildIgnoreLists(config) {
    const threadIds = [
      ...DEFAULT_IGNORED_THREAD_IDS,
      ...(Array.isArray(config.ignoredThreadIds) ? config.ignoredThreadIds : []),
    ];
    const senders = [
      ...DEFAULT_IGNORED_SENDERS,
      ...(Array.isArray(config.ignoredSenders) ? config.ignoredSenders : []).map((s) =>
        String(s).toLowerCase().trim()
      ),
    ].filter(Boolean);
    return { threadIds, senders };
  }

  function isIgnoredSender(name, senders) {
    if (!name) return false;
    const lower = name.toLowerCase().trim();
    return senders.some((s) => lower.includes(s));
  }

  // ─── Safety Gate: Only Run in Marketplace Section (verbatim from original) ───

  function isOnMarketplaceTab() {
    // Must be in a Marketplace conversation thread — check page context
    // TODO-VERIFY: these heuristics depend on Facebook's current DOM/aria labels.
    // They are copied verbatim from the live original extension but need a
    // re-check against a live Facebook session before shipping.
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

  // ─── Entry Point ────────────────────────────────────────────────────────────
  // Scanning is MANUAL-ONLY, triggered from the side panel. No timers, no
  // background polling loop — the human decides when to look at the inbox.

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "LR_PING") {
      sendResponse({ pong: true });
      return;
    }
    if (message?.type === "LR_SCAN") {
      if (scanning) {
        sendResponse({ started: false, reason: "already_scanning" });
        return;
      }
      scanInbox(); // async — results stream back via LR_THREAD_FOUND / LR_SCAN_COMPLETE
      sendResponse({ started: true });
    }
  });

  // ─── Inbox Scanner ──────────────────────────────────────────────────────────

  async function scanInbox() {
    if (scanning) return;

    // HARD GATE: Only run when Marketplace section is visible
    if (!isOnMarketplaceTab()) {
      log("Not on Marketplace tab — skipping scan entirely.");
      report("LR_SCAN_ERROR", {
        error: "not_marketplace_tab",
        detail: "Open facebook.com/messages and select the Marketplace section, then scan again.",
      });
      return;
    }

    scanning = true;
    const config = await getLrConfig();
    const ignore = buildIgnoreLists(config);
    let found = 0;
    let skipped = 0;

    try {
      const conversations = getMarketplaceConversations();
      if (conversations.length === 0) {
        log("No Marketplace conversations found.");
        report("LR_SCAN_COMPLETE", { found: 0, skipped: 0, empty: true });
        return;
      }

      log(`Found ${conversations.length} Marketplace conversation(s).`);

      for (const conv of conversations) {
        const record = await extractConversation(conv, config, ignore);
        if (record) {
          if (record.eligible) found += 1;
          else skipped += 1;
          report("LR_THREAD_FOUND", { thread: record });
        }
        await sleep(1000);
      }

      report("LR_SCAN_COMPLETE", { found, skipped });
    } catch (err) {
      log("Scan error:", err?.message);
      report("LR_SCAN_ERROR", { error: "scan_failed", detail: err?.message });
    } finally {
      scanning = false;
    }
  }

  function report(type, payload) {
    try {
      chrome.runtime.sendMessage({ type, ...payload });
    } catch (err) {
      log("Could not report to background:", err?.message);
    }
  }

  // ─── Conversation Detection (verbatim from original) ────────────────────────

  function getMarketplaceConversations() {
    // TODO-VERIFY: conversation-list selectors against Facebook's current DOM.
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

  // ─── Extract a Single Conversation (pivoted from processConversation) ───────
  // The original called the background worker to generate AND SEND a reply.
  // This version only extracts the thread and reports it. All gates kept.

  async function extractConversation(conv, config, ignore) {
    const { threadId, element, href } = conv;

    // RULE: Never surface FB system bots / user-ignored threads
    if (ignore.threadIds.includes(threadId)) {
      log(`Thread ${threadId}: Ignored thread — skipping.`);
      return skippedRecord(threadId, href, "ignored_thread", "On the ignore-list (system bot or user-ignored thread).");
    }

    // Navigate to the conversation if needed
    // TODO-VERIFY: relies on Messenger being a SPA — link.click() must swap the
    // thread without a full page load, or this content script would be destroyed
    // mid-scan. This is how the original worked live; re-confirm on current FB.
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
      return skippedRecord(threadId, href, "not_buyer_initiated", "We sent the first message — not a buyer inquiry (or detection was uncertain; fail-safe skip).");
    }

    // Get the last inbound message
    const lastInbound = getLastInboundMessage();
    if (!lastInbound) {
      log(`Thread ${threadId}: No inbound message found.`);
      return skippedRecord(threadId, href, "no_inbound_message", "No inbound message could be extracted.");
    }

    // RULE: Skip Facebook/Meta system messages
    if (isIgnoredSender(lastInbound.senderName, ignore.senders)) {
      log(`Thread ${threadId}: Ignored sender "${lastInbound.senderName}" — skipping.`);
      return skippedRecord(threadId, href, "ignored_sender", `Sender "${lastInbound.senderName}" is on the ignore-list.`);
    }

    // RULE: Only surface if LAST message is from them (not us)
    if (lastInbound.isOurMessage) {
      log(`Thread ${threadId}: Last message is ours — nothing to answer.`);
      return skippedRecord(threadId, href, "awaiting_buyer_reply", "Last message is ours — waiting on the buyer, nothing to answer.");
    }

    // GUARD: Topic gate — only surface if the conversation is actually about
    // a vehicle (plus any extra keywords the dealer configured in options)
    const combinedText = `${lastInbound.text} ${getListingTitle() || ""}`;
    if (!isRelevantTopic(combinedText, config.extraTopicKeywords)) {
      log(`Thread ${threadId}: Off-topic conversation — skipping. Text: "${lastInbound.text.slice(0, 60)}"`);
      return skippedRecord(threadId, href, "off_topic", "Doesn't look like a vehicle/inventory inquiry (topic gate).");
    }

    log(`Thread ${threadId}: Buyer message — "${lastInbound.text.slice(0, 80)}"`);

    const listingTitle = getListingTitle();
    const conversationHistory = buildConversationHistory();
    const messageId = `${threadId}:${lastInbound.text.slice(0, 40)}`;
    const contact = extractBuyerContact(conversationHistory);

    return {
      eligible: true,
      threadId,
      href,
      messageId,
      senderName: lastInbound.senderName || null,
      messageText: lastInbound.text,
      listingTitle,
      conversationHistory,
      buyerPhone: contact.phone,
      buyerEmail: contact.email,
      scannedAt: Date.now(),
    };
  }

  function skippedRecord(threadId, href, reason, detail) {
    return { eligible: false, threadId, href, skippedReason: reason, skippedDetail: detail, scannedAt: Date.now() };
  }

  // ─── DOM Helpers (verbatim from original) ───────────────────────────────────

  /**
   * Returns true if the first message in the conversation was sent BY US.
   * If we opened the thread (we are the buyer), skip it.
   *
   * SAFE DEFAULT: returns true (skip) whenever detection is uncertain.
   * Buyers on our listings ALWAYS message us first — if we can't confirm
   * the first message is inbound, skip rather than surface a wrong thread.
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
   * Topic gate: only proceed if the conversation looks like a vehicle inquiry.
   * The base regex is verbatim from the original. Dealers can add their own
   * keywords in the options page (e.g. other inventory types).
   */
  function isRelevantTopic(text, extraKeywords) {
    const vehicleRegex = /\b(truck|van|transit|sprinter|promaster|box|pickup|f[- ]?150|f[- ]?250|f[- ]?350|ram|silverado|sierra|express|savana|vehicle|cargo|fleet|diesel|gas|engine|mileage|miles|available|price|payment|finance|credit|down\s*payment|work\s*van|work\s*truck|trailer|hotshot)\b/i;
    if (vehicleRegex.test(text)) return true;

    if (Array.isArray(extraKeywords) && extraKeywords.length > 0) {
      const escaped = extraKeywords
        .map((k) => String(k).trim())
        .filter(Boolean)
        .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      if (escaped.length > 0) {
        const extraRegex = new RegExp(`\\b(${escaped.join("|")})\\b`, "i");
        if (extraRegex.test(text)) return true;
      }
    }
    return false;
  }

  function getMessageContainers() {
    // Use only targeted selectors — NO broad div[dir] fallback.
    // The fallback was incorrectly picking up UI chrome as "messages",
    // causing didWeSendFirstMessage() to fail silently in the original.
    // TODO-VERIFY: message-container selectors against Facebook's current DOM.
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
    // Fail-safe: better to skip than to surface a wrong conversation.
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
    // TODO-VERIFY: listing-title selectors against Facebook's current DOM.
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
   * Builds a plain-text conversation history string from all visible message
   * bubbles. Sent to the AI for context (same format the original produced,
   * so the existing /api/fb/generate-reply backend keeps working unchanged).
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

  /**
   * Pulls a phone number / email the BUYER shared, if any — only looks at
   * "Them:" lines so we never mistake our own dealership number for a lead's.
   * Used to enrich the "Capture lead" payload.
   */
  function extractBuyerContact(conversationHistory) {
    const result = { phone: null, email: null };
    if (!conversationHistory) return result;

    const theirLines = conversationHistory
      .split("\n")
      .filter((l) => l.startsWith("Them: "))
      .join("\n");

    // Phone regex copied verbatim from the original guardrail
    const phoneMatch = theirLines.match(/(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      const digits = phoneMatch[0].replace(/\D/g, "");
      if (digits.length >= 10) result.phone = phoneMatch[0].trim();
    }

    const emailMatch = theirLines.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    if (emailMatch) result.email = emailMatch[0];

    return result;
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function log(...args) {
    console.log("[Lead Rescue]", ...args);
  }
})();
