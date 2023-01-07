chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.url !== "chrome://newtab/" &&
    tab.active
  ) {
    chrome.tabs.sendMessage(tabId, { action: "init" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "select-tab") {
    if (request.data === "smartpass") {
      // will load smartpass data from the server
      sendResponse({ tab: request.data, data: [] });
    } else if (request.data === "tags") {
      // will load tags data from the server
      sendResponse({ tab: request.data, data: ["example", "another-tag"] });
    } else if (request.data === "notes") {
      // will load notes data from the server
      sendResponse({ tab: request.data, sender: sender, data: "lorem ipsum" });
    } else {
      sendResponse({});
    }
  } else {
    sendResponse({});
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let key in changes) {
    if (key === "access_token") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action:
            changes[key].newValue && changes[key].newValue.length > 0
              ? "init"
              : "deinit",
        });
      });
    }
  }
});
