// background.js
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method === "POST") {
      console.log("found a post request");
    }
  },
  { urls: ["<all_urls>"] },
  []
);