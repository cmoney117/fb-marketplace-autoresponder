/**
 * Popup UI logic
 */

const CONFIG_KEY = "config";
const CORRECT_FALLBACK = "Thanks for your interest! We have work trucks and vans available. Check our inventory at usafleetsales.com or call us at 615-756-4629.";

async function load() {
  const status = await chrome.runtime.sendMessage({ type: "GET_STATUS" });

  // Status dot
  const dot = document.getElementById("statusDot");
  const label = document.getElementById("statusLabel");
  const warn = document.getElementById("warnNotConfigured");
  const toggle = document.getElementById("enabledToggle");

  toggle.checked = status.enabled;

  if (!status.configured) {
    dot.className = "status-dot warn";
    label.textContent = "Not configured";
    warn.style.display = "block";
  } else if (status.enabled) {
    dot.className = "status-dot on";
    label.textContent = "Active — watching inbox";
  } else {
    dot.className = "status-dot off";
    label.textContent = "Paused";
  }

  // Stats
  document.getElementById("statSent").textContent = status.stats?.sent ?? 0;
  document.getElementById("statFailed").textContent = status.stats?.failed ?? 0;
  document.getElementById("statTotal").textContent = status.repliedCount ?? 0;

  // Config fields — force correct fallback (nuke any old stored value)
  const data = await chrome.storage.local.get(CONFIG_KEY);
  const config = data[CONFIG_KEY] || {};
  if (!config.fallbackReply || config.fallbackReply !== CORRECT_FALLBACK) {
    config.fallbackReply = CORRECT_FALLBACK;
    await chrome.storage.local.set({ [CONFIG_KEY]: config });
  }
  document.getElementById("agentSecret").value = config.agentSecret || "";
  document.getElementById("fallbackReply").value = config.fallbackReply;
}

document.getElementById("saveBtn").addEventListener("click", async () => {
  const data = await chrome.storage.local.get(CONFIG_KEY);
  const existing = data[CONFIG_KEY] || {};

  const updated = {
    ...existing,
    agentSecret: document.getElementById("agentSecret").value.trim(),
    fallbackReply: document.getElementById("fallbackReply").value.trim(),
  };

  await chrome.storage.local.set({ [CONFIG_KEY]: updated });

  const saved = document.getElementById("savedMsg");
  saved.style.display = "block";
  setTimeout(() => { saved.style.display = "none"; load(); }, 1500);
});

document.getElementById("enabledToggle").addEventListener("change", async (e) => {
  const data = await chrome.storage.local.get(CONFIG_KEY);
  const config = data[CONFIG_KEY] || {};
  config.enabled = e.target.checked;
  await chrome.storage.local.set({ [CONFIG_KEY]: config });
  load();
});

load();
