const baseURL = "https://api.nlpgraph.com/stage/api";
var autoCompleteControllers = [];

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
        api_key: request.data.access_token,
      },
      body: JSON.stringify({
        url: sender.url,
        title: sender.tab.title,
        domain: request.data.domain,
        description: request.data.page_description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!'favicon' in (data.response || {})) {
          data.response.favicon = sender.tab.favIconUrl;
        }
        
        sendResponse(data.response);
      });
    return true;
  } else if (request.action === "get-smartpast") {
    const url = new URL(baseURL + "/brain/embeddings/related")

    url.search = new URLSearchParams({
      id: request.data.id,
      text: request.data.text,
      is_new: request.data.is_new ? 1 : 0,
      limit: request.data.limit || 10,
    });

    console.log(request.data.access_token);
    
    fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        api_key: request.data.access_token,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (!'favicon' in (data.response || {})) {
          data.response.favicon = sender.tab.favIconUrl;
        }
        
        sendResponse(data.response);
      });
    return true;
  } else if (request.action === "update-notes") {
    var id = request.data.id;
    var notes = request.data.notes;

    fetch(baseURL + "/brain/update_url_document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_key: request.data.access_token,
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
  } else if (request.action === "save-screenshot") {
    var id = request.data.id;
    const getScreenshot = new Promise((res, rej) => {
      chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
        res(dataUrl);
      });
    });
    getScreenshot.then((data) => {
      fetch(baseURL + "/brain/update_url_document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_key: request.data.access_token,
        },
        body: JSON.stringify({
          id: id,
          screenshot: data,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          sendResponse(data.response);
        });
    });
    return true;
  } else if (request.action === "add-tags") {
    var id = request.data.id;
    var tags = request.data.tags;

    fetch(baseURL + "/document/add_tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_key: request.data.access_token,
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
        api_key: request.data.access_token,
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
        api_key: request.data.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data);
      });
    return true;
  } else if (request.action === "recommended-tags") {
    fetch(
      baseURL +
        "/tag/recommended?doc_id=" +
        request.data.id +
        "&type=keyword&limit=10",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          api_key: request.data.access_token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data);
      });
    return true;
  } else if (request.action === "autocomplete-tags") {
    if (autoCompleteControllers.length > 0) {
      autoCompleteControllers.forEach((controller) => {
        controller.abort();
      });
      autoCompleteControllers = [];
    }

    var autoCompleteController = new AbortController();
    autoCompleteControllers.push(autoCompleteController);
    fetch(
      baseURL +
        "/tag/search/autocomplete?q=" +
        request.data.query +
        "&limit=10",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          api_key: request.data.access_token,
        },
        signal: autoCompleteController.signal,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data);
        isLoadingAutocomplete = false;
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
