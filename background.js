const baseURL = "https://api.nlpgraph.com/stage/api";
var autoCompleteControllers = [];
let enabled; // shows if app's toggle is switched on or off: true or false
checkEnable();

function checkEnable() {
  chrome.storage.local.get(["enabled"], (result) => {
    enabled = result.enabled;
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  checkEnable();
  if (enabled && changeInfo.status === "complete" && tab.active) {
    chrome.tabs.sendMessage(tabId, { action: "init" });
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes?.enabled) {
    chrome.storage.local.get(["enabled"]).then((result) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: result.enabled ? "init" : "deinit",
        });
      });
    });
  }
});

// chrome.storage.onChanged.addListener((changes) => {
//   if (changes?.enabled) {
//     let newValue = changes.enabled.newValue;
//     chrome.tabs.query({  "active": true, currentWindow: true }, function (tabs) {

//         chrome.tabs.sendMessage(tabs[0].id, {
//           action: newValue ? "init" : "deinit",
//         });

//     });
//   }
// });

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.storage.local.get(["enabled"]).then((result) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (result.enabled) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "init" });
      } else {
        chrome.tabs.sendMessage(tabs[0].id, { action: "deinit" });
      }
    });
  });
});

// for sending request about all opened tabs when storage changed

// chrome.storage.onChanged.addListener((changes) => {
//   if (changes?.enabled) {
//     let newValue = changes.enabled.newValue;
//     chrome.tabs.query({ currentWindow: true }, function (tabs) {
//       tabs.forEach((tab) => {
//         chrome.tabs.sendMessage(tab.id, {
//           action: newValue ? "init" : "deinit",
//         });
//       });
//     });
//   }
// });

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
        if (!"favicon" in (data.response || {})) {
          data.response.favicon = sender.tab.favIconUrl;
        }
        sendResponse(data.response);
      });
    return true;
  } else if (request.action === "get-smartpast") {
    const url = new URL(baseURL + "/brain/embeddings/related");

    url.search = new URLSearchParams({
      id: request.data.id,
      text: request.data.text,
      is_new: request.data.is_new ? 1 : 0,
      limit: request.data.limit || 10,
    });

    fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        api_key: request.data.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!"favicon" in (data.response || {})) {
          data.response.favicon = sender.tab.favIconUrl;
        }

        sendResponse(data.response);
      });
    return true;
  } else if (request.action === "update-notes") {
    var id = request.data.id;
    var notes = request.data.notes;
    var notes_html = request.data.notes_html;

    fetch(baseURL + "/brain/update_url_document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_key: request.data.access_token,
      },
      body: JSON.stringify({
        id: id,
        notes: notes,
        notes_html: notes_html,
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
      chrome.tabs.captureVisibleTab(
        sender.tab.windowId,
        {},
        function (dataUrl) {
          res(dataUrl);
        }
      );
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
  } else if (request.action === "sync-history") {
    getHistory().then((history) => {
      // response is an array of history items
      // make them a csv
      // get headers
      const headers = Object.keys(history[0]);

      const csv = history
        .map((item) => {
          const names = Object.keys(item);

          return names
            .map((name) => {
              return `"${item[name]}"`;
            })
            .join(",");
        })
        .join("\n");

      const csvWithHeaders = [headers.join(","), csv].join("\n");

      // save csv to file
      const blob = new Blob([csvWithHeaders], { type: "text/csv" });
      //const url = URL.createObjectURL(blob);

      fetch(baseURL + "/tools/browser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          api_key: request.data.access_token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          uploadFile(blob, data.response).then((result) => {
            sendResponse(result);
          });
        });
      // somehow get the url for put to s3
      // ...

      // upload to s3
      // ...

      // enjoy the party

      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "history.csv";
      // a.click();
      // URL.revokeObjectURL(url);
    });

    return true;
  } else {
    sendResponse({});
  }
});

// get all chrome history
const getHistory = () => {
  return new Promise((resolve, reject) => {
    chrome.history.search(
      {
        text: "",
        startTime: 0,
        endTime: Date.now(),
        maxResults: 100000,
      },
      (historyItems) => {
        resolve(historyItems);
      }
    );
  });
};

async function uploadFile(file, presignedPost) {
  const formData = new FormData();
  //formData.append("Content-Type", file.type);
  Object.entries(presignedPost.fields).forEach(([key, value]) => {
    if (key == "key") {
      value = value.replace("${filename}", "history.csv");
    }
    formData.append(key, value);
  });
  formData.append("file", file);

  const res = await fetch(presignedPost.url, {
    method: "POST",
    body: formData,
  });

  const location = res.headers.get("Location"); // get the final url of our uploaded file
  return decodeURIComponent(location);
}

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
