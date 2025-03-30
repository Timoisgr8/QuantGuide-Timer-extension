// popup.js
const toggle = document.getElementById("toggle");

// Load stored state
chrome.storage.local.get("isEnabled", (data) => {
  toggle.checked = data.isEnabled || false; // Default to false if not set
  updateStatus(); // Update the UI based on the state
});

// Toggle switch event
toggle.addEventListener("change", () => {
  const newState = toggle.checked;
  chrome.runtime.sendMessage({ action: "toggleExtension", state: newState });
  updateStatus();
});

// Update status text
function updateStatus() {
  document.getElementById("status").textContent = toggle.checked ? "Extension On" : "Extension Off";
}