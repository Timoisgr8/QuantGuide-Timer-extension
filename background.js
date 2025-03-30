let isEnabled = false; // Toggle state, default to false

// Listen for updates to the URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        console.log("We are enabled:", isEnabled);
        console.log("URL changed to:", changeInfo.url);
        checkQuantGuideQuestion(tab, tabId);
    }

    // Listen for page reloads or when the page is loading
    if (changeInfo.status === 'loading') {
        console.log("Page is reloading or being loaded");
        checkQuantGuideQuestion(tab, tabId);
    }
});

// Listen for messages from popup or other parts of the extension to toggle the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleExtension") {
        const newState = message.state;
        isEnabled = newState; // Update the local state
        chrome.storage.local.set({ isEnabled: newState }); // Save to local storage
        console.log("Extension state updated:", newState);
    }
});

// Optional: Log when the active tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        console.log("We are enabled:", isEnabled);
        console.log("Switched to tab with URL:", tab.url);
        checkQuantGuideQuestion(tab, activeInfo.tabId);
    });
});

// Load toggle state
chrome.storage.sync.get("isEnabled", (data) => {
    isEnabled = data.isEnabled || false;
});

// Main function to check the URL and inject the timer if needed
function checkQuantGuideQuestion(tab, tabId) {
    if (isEnabled && tab.url.startsWith("https://www.quantguide.io/questions/")) {
        console.log("SERVING TIMER");
        
        // Send message to content.js to create the timer
        chrome.tabs.sendMessage(tabId, { action: 'showTimer', tabId: tabId });
    } else {
        console.log("REMOVING TIMER");
        
        // Send message to content.js to remove the timer
        chrome.tabs.sendMessage(tabId, { action: 'hideTimer', tabId: tabId });
    }
}

// Function to show timer on the page (via content script)
function showTimer(tabId) {
    chrome.tabs.sendMessage(tabId, { action: 'showTimer' });
}

// Function to hide timer on the page (via content script)
function hideTimer(tabId) {
    chrome.tabs.sendMessage(tabId, { action: 'hideTimer' });
}