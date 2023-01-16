const baseURL = "https://api.nlpgraph.com/stage/api";

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
    fetch(baseURL + "/brain/get_url_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + request.data.access_token,
      },
      body: JSON.stringify({
        url: sender.url,
        domain: sender.origin,
        title: sender.tab.title,
        description: request.data.page_description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data.response);
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
  } else if (request.action === "update-notes") {
    var id = request.data.id;
    var notes = request.data.notes;

    fetch(baseURL + "/brain/update_url_document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + request.data.access_token,
      },
      body: JSON.stringify({
        id: id,
        notes: notes,
        notes_html: "<p>" + notes + "</p>",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data.response);
      });
    return true;
  } else if (request.action === "add-tags") {
    var id = request.data.id;
    var tags = request.data.tags;

    fetch(baseURL + "/document/add_tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + request.data.access_token,
      },
      body: JSON.stringify({
        id: id,
        tags: tags,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data.response);
      });
    return true;
  } else if (request.action === "remove-tags") {
    var id = request.data.id;
    var tags = request.data.tags;

    fetch(baseURL + "/document/remove_tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + request.data.access_token,
      },
      body: JSON.stringify({
        id: id,
        tags: tags,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data.response);
      });
    return true;
  } else if (request.action === "suggested-tags") {
    fetch(baseURL + "/tag/suggested?id=" + request.data.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + request.data.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data);
      });
    return true;
  } else if (request.action === "autocomplete-tags") {
    fetch(
      baseURL +
        "/tag/search/autocomplete?q=" +
        request.data.query +
        "&limit=10",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + request.data.access_token,
        },
      }
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
