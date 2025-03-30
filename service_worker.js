chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method === "POST") {
      console.log("found a post");
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);