chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.url !== "chrome://newtab/" &&
    tab.active
  ) {
    chrome.tabs.sendMessage(tabId, { action: "init" });
  }
});
