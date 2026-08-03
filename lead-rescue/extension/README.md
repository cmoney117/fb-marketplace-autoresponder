# Lead Rescue — Marketplace Reply Assistant

A Chrome (Manifest V3) extension for car dealers. It watches the Facebook
Marketplace messages tab **you already have open**, extracts buyer
conversations, drafts an AI reply for each one, and lets you capture the lead
to your CRM — **you** copy the draft, paste it into Facebook's own composer,
and click Send yourself.

**Lead Rescue never sends a Facebook message. That is the product.**

---

## Compliance: why there is no auto-send

Meta's Terms of Service prohibit automated messaging through the Facebook UI.
Dealers running auto-responders get 30-day bans on ID-verified accounts, and
appeals are routinely denied. An account ban doesn't just kill the tool — it
kills the dealership's whole Marketplace channel.

So Lead Rescue is built to be **physically incapable of sending**:

- There is no code path that types into Facebook's composer, dispatches a
  synthetic Enter/click, or submits a message. The upstream codebase's send
  function (`sendReplyInBrowser`), its polling auto-reply loop, and its
  follow-up send engine were **deleted, not disabled** — grep the code for
  `execCommand`, `KeyboardEvent`, or `insertText` and the only hits are
  comments documenting their removal. The only `.click()` in the codebase
  navigates between conversation threads during a scan (like a human clicking
  a thread in the sidebar); it never touches a composer or send button.
- The content script is read-only against Facebook's DOM (it navigates between
  conversations during a scan, exactly like a human clicking threads, and
  extracts text — nothing else).
- The human sends every message from Facebook's own UI. Automated follow-up
  belongs off-platform (SMS/email via your CRM) once a buyer shares a number —
  where automation is legal and ban-proof.

This is the core promise to customers and the differentiator against gray-zone
auto-senders. **Do not add a send path.** If a change would let the extension
send, it's the wrong change.

## What it does

1. **Scan** — from the side panel, click "Scan Marketplace inbox". The content
   script walks the Marketplace conversations in your open
   `facebook.com/messages` tab (it clicks through threads in that tab, same as
   you would) and extracts each conversation.
2. **Safety gates** (all inherited from the battle-tested original):
   - Only runs when the Marketplace section is active — never your personal inbox
   - Only surfaces threads the **buyer started** (fail-safe: skips when uncertain)
   - Skips threads where the last message is yours (nothing to answer)
   - Ignore-lists for Facebook/Meta system senders and system threads
     (user-extendable in Options)
   - Topic gate: only surfaces conversations that look like vehicle/inventory
     inquiries (extra keywords configurable)
3. **Draft** — per thread, "Draft reply" calls your CRM's
   `POST /api/fb/generate-reply` (same request contract as the original
   extension). The draft appears in an editable box with a **[Copy]** button.
   A phone-number guardrail replaces/removes any number not on your approved
   list before you ever see the draft.
4. **You send** — paste into Facebook's message box, click Send there.
5. **Capture lead** — one click POSTs
   `{dealer_id, buyer_name, thread_id, listing/topic context, phone, email}`
   to your CRM's `POST /api/leads`. If the CRM is unreachable, the lead is
   queued in `chrome.storage.local` and retried every 5 minutes (and on
   browser startup) until it lands — leads are never silently dropped.

## Install (unpacked)

1. Open Chrome → `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and select this folder
   (`lead-rescue/extension/`)
4. Pin "Lead Rescue — Marketplace Reply Assistant" to the toolbar
5. Click the toolbar icon — the side panel opens (Chrome 114+ required for the
   Side Panel API)

## Configuration

Right-click the toolbar icon → **Options** (or use the link in the side
panel's yellow banner):

| Setting | What it does |
| --- | --- |
| **API base URL** | Your Lead Rescue/CRM backend, e.g. `https://your-crm.example.com`. The extension calls `{base}/api/fb/generate-reply` and `{base}/api/leads`. Saving requests a Chrome host permission for that origin. |
| **Dealer API key** | Sent as the `x-agent-secret` header on every API call. Stored in `chrome.storage.local` only — never hardcoded. |
| **Dealer ID** | Included as `dealer_id` on every captured lead (multi-tenant routing). |
| **Approved phone numbers** | Guardrail allow-list. First number is primary; any other number appearing in an AI draft is replaced with it (or removed if the list is empty). |
| **Ignored senders / thread IDs** | Added on top of the built-in system ignore-lists (Facebook, Meta, Marketplace Assistant, ...). Built-ins always apply and cannot be removed. |
| **Extra topic keywords** | Extends the built-in vehicle-inquiry topic gate for other inventory types. |

### Backend contracts

```
POST {base}/api/fb/generate-reply         (existing contract, unchanged)
  headers: Content-Type: application/json, x-agent-secret: <dealer API key>
  body: { senderId, senderName, messageText, listingTitle, threadId, conversationHistory }
  resp: { reply: "..." }

POST {base}/api/leads                     (CRM lead-capture contract)
  headers: Content-Type: application/json, x-agent-secret: <dealer API key>
  body: {
    dealer_id, buyer_name, thread_id,
    listing_title, last_message, conversation_history,
    phone, email,                  // only what the BUYER shared in-thread, if anything
    source: "lead-rescue-extension",
    captured_at                    // ISO 8601
  }
  resp: any 2xx = accepted; anything else → lead queued locally and retried
```

## Daily use

1. Open `facebook.com/messages`, switch to the **Marketplace** section
2. Open the Lead Rescue side panel (toolbar icon)
3. Click **Scan Marketplace inbox** — note: the scan clicks through your
   Marketplace threads in that tab, so let it finish before using the tab
4. For each surfaced thread: **Draft reply** → review/edit → **Copy** → paste
   into Facebook's composer → **Send it yourself**
5. Click **Capture lead** when a buyer is real — especially once they share a
   phone number or email, so your CRM's off-platform (SMS/email) follow-up
   can take over

Drafts live only in the open panel (close it and they're gone — regeneration
is one click). Scan results reset when the browser restarts.

## Needs live testing (cannot be verified without a live Facebook session)

Everything below is marked `TODO-VERIFY` in the code. The DOM selectors are
copied **verbatim** from the original extension that runs live at a dealership,
but Facebook changes its DOM regularly and none of this can be exercised in a
dev container:

1. **Marketplace-section detection** (`content.js` → `isOnMarketplaceTab`):
   aria-labels (`[aria-label="Marketplace"]`), `href*="marketplace"`, and the
   "Listing by" / "Item details" / "See listing" text heuristics.
2. **Conversation-list detection** (`getMarketplaceConversations`):
   `[data-testid="conversation-list-item"]`, `[role="row"]`,
   `[role="listitem"]`, marketplace icon/aria heuristics, and the
   `/messages/t/<threadId>` link pattern.
3. **SPA navigation assumption** (`extractConversation`): clicking a
   conversation link must swap threads *without a full page load* (a full
   reload would kill the content script mid-scan) — this is how Messenger
   behaved when the original ran live; re-confirm, and re-tune the 3 s
   post-click settle delay if threads load slower.
4. **Message-bubble extraction** (`getMessageContainers`):
   `[data-testid="message-container"]`,
   `[data-scope="messages_table"] [role="row"]`,
   `[data-pagelet="MWMainWrapper"] [role="row"]`.
5. **Outbound-vs-inbound detection** (`isOutboundMessage`): aria-label
   "You"/"Sent"/"Delivered"/"Seen" and flex-end style heuristics — this feeds
   the buyer-initiated gate, so verify it errs toward *skipping* threads.
6. **Sender-name extraction** (`getLastInboundMessage`):
   `[data-scope="user_name"]` / `a[role="link"]` fallbacks.
7. **Listing-title extraction** (`getListingTitle`): can grab generic
   headers; check quality of `listing_title` in captured leads.
8. **Buyer phone/email extraction** (`extractBuyerContact`): depends on the
   `Us:`/`Them:` transcript labeling surviving points 4–5 above.
9. **Side panel + scan UX end-to-end**: panel opens on toolbar click
   (Chrome 114+), scan status/thread cards populate via
   `chrome.storage.session` events, clipboard Copy works in the panel.
10. **CRM round-trips**: `/api/fb/generate-reply` with a real dealer key, and
    `/api/leads` — including the offline path (kill the network, capture a
    lead, confirm it queues and later flushes). Note: `/api/leads` must exist
    on the backend; the original CRM only shipped `generate-reply`, so this
    endpoint is part of the Lead Rescue backend work.

## Relationship to the original extension

This folder is a **separate extension** from the auto-reply extension at the
repo root (which is live at a dealership and untouched). Reused verbatim from
it: every DOM selector/heuristic listed above, all safety gates, the
ignore-list defaults, the phone-guardrail regex, and the
`generate-reply` request shape. Deleted from it: `sendReplyInBrowser`,
synthetic keyboard events, the 1-minute polling alarm, the follow-up and
re-engagement send engines, and the auto-open of Facebook tabs. New here: the
side panel UI, draft-copy workflow, lead capture + offline queue, and the
options page (configurable API base, per-dealer key, ignore-list editor,
guardrail allow-list, topic keywords).

Both extensions can be loaded in the same browser; they use different storage
keys and never talk to each other.
