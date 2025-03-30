// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        console.log("URL changed to:", changeInfo.url);
    }
});

// Optional: Log when the active tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        console.log("Switched to tab with URL:", tab.url);
    });
});