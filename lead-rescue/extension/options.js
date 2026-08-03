/**
 * Lead Rescue — Options page logic
 *
 * Everything is stored in chrome.storage.local under "lrConfig".
 * The dealer API key is never hardcoded anywhere in the codebase — it only
 * exists in this browser's extension storage after the dealer pastes it here.
 *
 * On save we also request an optional host permission for the API origin so
 * the background worker can reach the dealer's CRM regardless of its CORS
 * configuration (host permissions must be granted from a user gesture, which
 * the Save click provides).
 */

const CONFIG_KEY = "lrConfig";

const el = (id) => document.getElementById(id);

function linesToArray(value) {
  return String(value)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function load() {
  const data = await chrome.storage.local.get(CONFIG_KEY);
  const config = data[CONFIG_KEY] || {};

  el("apiBaseUrl").value = config.apiBaseUrl || "";
  el("dealerApiKey").value = config.dealerApiKey || "";
  el("dealerId").value = config.dealerId || "";
  el("approvedPhones").value = (config.approvedPhones || []).join("\n");
  el("ignoredSenders").value = (config.ignoredSenders || []).join("\n");
  el("ignoredThreadIds").value = (config.ignoredThreadIds || []).join("\n");
  el("extraTopicKeywords").value = (config.extraTopicKeywords || []).join("\n");
}

el("saveBtn").addEventListener("click", async () => {
  const permWarn = el("permWarn");
  permWarn.style.display = "none";
  permWarn.textContent = "";

  const apiBaseUrl = el("apiBaseUrl").value.trim().replace(/\/+$/, "");

  // Validate the URL early so a typo doesn't silently break every request
  if (apiBaseUrl) {
    try {
      const parsed = new URL(apiBaseUrl);
      if (!/^https?:$/.test(parsed.protocol)) throw new Error("must be http(s)");
    } catch {
      permWarn.textContent = "API base URL doesn't look like a valid http(s) URL — fix it and save again.";
      permWarn.style.display = "block";
      return;
    }
  }

  const config = {
    apiBaseUrl,
    dealerApiKey: el("dealerApiKey").value.trim(),
    dealerId: el("dealerId").value.trim(),
    approvedPhones: linesToArray(el("approvedPhones").value),
    ignoredSenders: linesToArray(el("ignoredSenders").value),
    ignoredThreadIds: linesToArray(el("ignoredThreadIds").value),
    extraTopicKeywords: linesToArray(el("extraTopicKeywords").value),
  };

  await chrome.storage.local.set({ [CONFIG_KEY]: config });

  // Ask for host permission on the API origin (user gesture = this click)
  if (apiBaseUrl) {
    try {
      const origin = new URL(apiBaseUrl).origin + "/*";
      const granted = await chrome.permissions.request({ origins: [origin] });
      if (!granted) {
        permWarn.textContent =
          "Settings saved, but host permission for " + origin + " was declined. " +
          "Draft generation and lead capture will only work if your CRM sends permissive CORS headers. " +
          "Save again to re-request the permission.";
        permWarn.style.display = "block";
      }
    } catch (err) {
      permWarn.textContent = "Settings saved, but the permission request failed: " + (err?.message || err);
      permWarn.style.display = "block";
    }
  }

  const saved = el("savedMsg");
  saved.style.display = "inline";
  setTimeout(() => { saved.style.display = "none"; }, 1800);
});

load();
