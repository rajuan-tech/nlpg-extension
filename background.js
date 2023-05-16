try {
  importScripts("assets/js/black_list.js");
} catch (e) {
  console.log(e);
} // 2023-03-12 #1 added by Stanislav

const baseURL = "https://api.nlpgraph.com/stage/api";
var autoCompleteControllers = [];
let enabled; // shows if app's toggle is switched on or off: true or false
checkEnable();
getBlackList(); // 2023-03-12 #10 added by Stanislav
let current_page = { url: "", id: "" }; // 2023-03-14 #10 added by Stanislav


let text = null;//natalia 3.04

function checkEnable() {
  chrome.storage.local.get(["enabled"]).then((result) => {
    enabled = result.enabled;
  });
}

// 2023-03-12 #6 added by Stanislav: BEGIN  ------------------------
let startOrStop = () => {
  // console.log('test3') 
 chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { 
    let url = current_page.url;
    let id = current_page.id;
    // console.log(current_page);
    chrome.storage.local.get(["enabled"]).then((result) => {
      refreshBlackList().then(() => {
        let blackListIdx = isInBlacklist(url, true, false);
        // console.log('--- INTING START OR STOP ---');
        let needToInit = result.enabled && blackListIdx < 0; /// ToDo: add the condition for Snoose
        // console.log(blackListIdx);
        // console.log(needToInit);

        chrome.tabs.sendMessage(id, {
          action: needToInit ? "init" : "deinit",
        });

        // console.log('--- INTING START OR STOP DONE ---');
      }); // refreshBlacklist end
    });
  });
};
// 2023-03-12 #6 added by Stanislav: END  ------------------------

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  updateCurrentUrl(); // 2023-03-12 #2 added by Stanislav
  if (changeInfo.status === "complete" && tab.active) {
    // 2023-03-19 changed by Stanislav
    if (current_page && current_page.url.indexOf('http') === 0)  /// NEW 2023-05-14
    startOrStop(); // 2023-03-13 #7 changed by Stanislav
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes?.enabled || changes?.heybrain_black_list) {
    // 2023-03-20 changed by Stanislav
    // console.log('!!! storage was changed')
    if (current_page.url.indexOf('http') === 0)  // 2023-05-14 NEW!
    startOrStop(); // 2023-03-13 #8 changed by Stanislav
  }
});

chrome.tabs.onActivated.addListener(() => {
  updateCurrentUrl(); // 2023-03-12 #3 added by Stanislav
  if (current_page.url.indexOf('http') === 0)  // 2023-05-14 NEW!
  startOrStop(); // 2023-03-13 #9 changed by Stanislav
});

// 2023-03-12 #4 added by Stanislav: BEGIN  ------------------------
function updateCurrentUrl() {
  // Save the current url to local storage for sharing it between modules
  
  // 2023-05-14 NEW! 
  let oldUrl = undefined;
  let oldId = undefined;

  if (current_page) {
    oldUrl = current_page.url;
    oldId = current_page.id;
  }
  // 2023-05-14 NEW! end
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (
      tabs[0].url != "" &&
      tabs[0].url !== undefined &&
      tabs[0].url !== null
    ) {
      chrome.storage.local.set({ heybrain_current_url: tabs[0].url });
      current_page.url = tabs[0].url;
      current_page.id = tabs[0].id;
    } else chrome.storage.local.set({ heybrain_current_url: "" });
  });
  if (current_page && current_page.url.indexOf('http') === 0) // 2023-05-14 NEW!
  getBlackList;
  
  // 2023-05-14 NEW! Save notes
  // if (oldUrl != current_page.url || oldId != current_page.id) {
    // console.log('test0')
    if (oldUrl.indexOf('http') === 0)
    { 
      chrome.tabs.sendMessage(oldId, {
      action: "save_notes",
      });
    } 
  // }    
  // end - new 2023-05-14 
}
// 2023-03-12 #4 added by Stanislav: END  --------------------------

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 2023-03-12 #5 added by Stanislav: BEGIN  ------------------------
  if (request.action === "getBlackList") {
    // Getting the response for the content (is the URL in the black list)

    let resp_data = isInBlacklist(request.key, true, false);
    //  console.log('Sending the BlackList response for Page: '+ resp_data);
    sendResponse({ data: [resp_data] });
  }
  // 2023-03-12 #5 added by Stanislav: END  --------------------------

  // 2023-03-14 #11 added by Stanislav: BEGIN  ------------------------
  else if (request.action === "getBlackListDom") {
    // Getting the response for the content (is the DOM URL in the black list)
    let resp_data = isInBlacklist(request.key, true, true);
    //  console.log('Sending the BlackList response for Domain: '+ resp_data);
    sendResponse({ data: [resp_data] });
  }
  // 2023-03-14 #11 added by Stanislav: END  --------------------------

  // 2023-03-15 #12 added by Stanislav: BEGIN  ------------------------
  else if (request.action === "addPageToBlackList") {
    let resp_data = addPageToBlackList(request.key, false);
    sendResponse({ data: [resp_data] });
  } else if (request.action === "addDomainToBlackList") {
    let resp_data = addPageToBlackList(request.key, true);
    sendResponse({ data: [resp_data] });
  } else if (request.action === "delPageFromBlackList") {
    let resp_data = deletePageFromBlackList(request.key, false);
    sendResponse({ data: [resp_data] });
  } else if (request.action === "delDomainFromBlackList") {
    let resp_data = deletePageFromBlackList(request.key, true);
    sendResponse({ data: [resp_data] });
  }

  // 2023-03-15 #12 added by Stanislav: END --------------------------
  else if (request.action === "get-url-data") {

    fetch(baseURL + "/brain/get_url_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_key: request.data.access_token,
      },
      body: JSON.stringify({
        url: sender.url,
        title:  sender.tab.title,  
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
      }).catch(e => sendResponse(undefined));
    return true;
  } else if (request.action === "get-smartpast") {
    // console.log(`before ${text}`);
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

// open the tab after install

function installScript(){
  // Installing content script in all opened tabs 2023-04-17 by Stanislav
  let params = {
      currentWindow: true
  };

  chrome.tabs.query(params, (tabs) => {
      let contentjsFile = chrome.runtime.getManifest().content_scripts[0].js[0];
      
      for (let index = 0; index < tabs.length; index++) {
          // console.log((index+1)+') '+tabs[index].url+'!!!!!!!')
        
          id = tabs[index].id
         url = tabs[index].url
        //  console.log(url)
         if (url.indexOf('http') === 0)
          chrome.scripting.executeScript({
            target: {tabId: id, allFrames: true},
            files: [contentjsFile],
          });
      }
  });  

    chrome.tabs.create({
    url: "https://heybrain.ai/register"
      });

}
      
 chrome.runtime.onInstalled.addListener(installScript)



///2023-03-26 Added by Natalia START-----------------------------------
let timer; // main timer
let timerText; // string with remaining time stored every sec in local storage
let timeRem; // string with remaining time rendered in pop up
let time; // remaining time before  the timer is expired
let endTime; // date when the timer expires (timestamp)
let timerInterval;

chrome.alarms.onAlarm.addListener(() => {

  chrome.storage.local.set({ enabled: true });
  chrome.storage.local.set({ timer: false });

  if(typeof timer !== undefined) clearInterval(timer);
  if(typeof timerInterval !== undefined) clearInterval(timerInterval);
  
  chrome.storage.local.remove("remainingTime");
  chrome.storage.local.remove("end");
  timeRem = null;

  chrome.runtime.sendMessage(
    {
      action: "remove-snooze-window", 
    },
  );
});

function updateTimer() {
 
  chrome.storage.local.get(["end"]).then(result => {
    endTime = result.end;
  });

  time = (endTime - Date.now()) / 1000 ;

  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  timerText = `${minutes} : ${seconds}`;

  chrome.storage.local.set({ remainingTime: timerText });
  // console.log(timerText);
}


function drawTimer() {

  chrome.storage.local.get(["remainingTime"]).then(result => {
     timeRem = result.remainingTime;
     if (timeRem !== null && timeRem !== undefined) {
        chrome.runtime.sendMessage( 
          {
            action: "render-timer",
            text: timeRem
          },
        );
      }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "timer") {

    endTime = Date.now() + request.time * 60 * 1000; // in Timestamp
    chrome.storage.local.set( {end:endTime} );
    updateTimer();
    timer = setInterval(updateTimer, 1000);
    chrome.storage.local.set( {enabled:false} );
  }

  if (request.action === "stop-timer") {

    chrome.storage.local.set({ enabled: true });
    clearInterval(timer);
    if(typeof timerInterval !== undefined) clearInterval(timerInterval);
    chrome.storage.local.remove("remainingTime");
    chrome.storage.local.remove("end");
    timeRem = null;
  }
}); 

chrome.runtime.onConnect.addListener(function(port) {

  chrome.storage.local.get(["timer"]).then((result) => {

    if(result.timer && port.name === "popup" ) {
      // popup is opened, timer is running
      drawTimer();
     timerInterval = setInterval(drawTimer, 1000);

      port.onDisconnect.addListener(function() {
      //popup has been closed
      clearInterval(timerInterval);
      });
    }
  });
});


chrome.windows.onCreated.addListener(function(window) {
 
  chrome.storage.local.get(["timer"]).then((result) => {
   
    if(result.timer) {
      updateTimer();
      // console.log('new window has been created, timer is running');
      timer = setInterval(updateTimer, 1000);
    }
  });
});

chrome.windows.onRemoved.addListener(function(window) {
  
  chrome.storage.local.get(["timer"]).then((result) => {

    if(result.timer)  {
      // console.log('window is closed, timer is running');
      clearInterval(timer);
    }
  });
});
///2023-03-26 Added by Natalia END ----------------------------------------------------------------

chrome.contextMenus.create({

  "id": "1",
  "title": "Update SMARTPAST",
  "contexts": ["selection"], // Отображать контекстное меню только при выделении текста
  
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  
  chrome.tabs.sendMessage(tab.id, {
    action: "smartpast-selected",
    text:  info.selectionText
  });

})
