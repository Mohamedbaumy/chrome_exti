chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab) {
    chrome.tabs.sendMessage(tabId, {
      type: "Start",
    });
  } else {
    chrome.tabs.sendMessage(tabId, {
      type: "faild",
    });
  }
});