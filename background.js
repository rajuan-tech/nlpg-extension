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
  if (request.action === "get-url-data") {
    fetch(
      "https://s3.eu-west-2.amazonaws.com/nlpgraph.com/ttttemp0921/get_url_data.json"
    )
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data);
      });
    return true;
  } else if (request.action === "get-smartpast") {
    fetch(
      "https://s3.eu-west-2.amazonaws.com/nlpgraph.com/ttttemp0921/document-embedding-related.json"
    )
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data);
      });
    return true;
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
