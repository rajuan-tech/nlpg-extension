// constants --start
const elBrainDrawerID = "hey-brain-drawer";
const elBrainRootID = "hey-brain-root";
const elBrainRootTabsID = "hey-brain-root-tabs";
const elBrainContentID = "hey-brain-content";
const elBrainLoaderID = "hey-brain-loader";
const kBrainRootHeight = 475;

const tabFirstItemID = "hey-brain-root-tab-item-first";
const tabSecondItemID = "hey-brain-root-tab-item-second";
const tabThirdItemID = "hey-brain-root-tab-item-third";
// constants --end

var pageData = null;
var pageSmartPast = [];

// helpers --start
const pageInfo = () => {
  return {
    title: document.title,
    url: window.location.href,
  };
};
// helpers --end

// init --start
const init = () => {
  // brain drawer --start
  let elBrainDrawer = document.createElement("div");
  elBrainDrawer.id = elBrainDrawerID;
  elBrainDrawer.style.position = "fixed";
  elBrainDrawer.style.bottom = kBrainRootHeight - 40 + "px";
  elBrainDrawer.style.right = "-36px";
  elBrainDrawer.style.width = "80px";
  elBrainDrawer.style.height = "80px";
  elBrainDrawer.style.zIndex = "99999";
  elBrainDrawer.style.cursor = "pointer";
  elBrainDrawer.onclick = () => {
    // chrome.runtime.sendMessage({ action: "open-drawer" });
    let elBrainRoot = document.getElementById(elBrainRootID);
    if (elBrainRoot.style.transform === "translateX(100%)") {
      elBrainRoot.style.transform = "translateX(0%)";
    } else {
      elBrainRoot.style.transform = "translateX(100%)";
    }
  };

  let elBrainDrawerImage = document.createElement("img");
  elBrainDrawerImage.src = chrome.runtime.getURL(
    "assets/icons/brain-drawer-160.png"
  );
  elBrainDrawerImage.style.width = "80px";
  elBrainDrawerImage.style.height = "80px";
  elBrainDrawer.appendChild(elBrainDrawerImage);

  document.body.appendChild(elBrainDrawer);
  // brain drawer --end

  // const metadata = await fetchMetadata(sender.tab.url);
  // sendResponse(metadata);

  // brain root --start
  let elBrainRoot = document.createElement("div");
  elBrainRoot.id = elBrainRootID;
  elBrainRoot.style.position = "fixed";
  elBrainRoot.style.bottom = "0";
  elBrainRoot.style.right = "0";
  elBrainRoot.style.width = "100%";
  elBrainRoot.style.height = "100%";
  elBrainRoot.style.zIndex = "99998";
  elBrainRoot.style.backgroundColor = "rgba(243, 243, 243, 0.2)";
  elBrainRoot.style.backdropFilter = "blur(10px)";
  elBrainRoot.style.border = "1px solid rgba(200, 200, 200, 0.4)";
  elBrainRoot.style.borderRightWidth = "0";
  elBrainRoot.style.display = "flex";
  elBrainRoot.style.borderBottomLeftRadius = "20px";
  elBrainRoot.style.borderTopLeftRadius = "20px";
  elBrainRoot.style.padding = "20px";
  elBrainRoot.style.boxSizing = "border-box";
  elBrainRoot.style.alignItems = "center";
  elBrainRoot.style.justifyContent = "center";
  elBrainRoot.style.height = kBrainRootHeight + "px";
  elBrainRoot.style.width = "375px";
  elBrainRoot.style.transition = "all 0.3s ease-in-out";
  elBrainRoot.style.transform = "translateX(100%)";
  elBrainRoot.style.font = "14px/1.5 Helvetica, sans-serif";
  elBrainRoot.style.fontSize = "16px";
  // brain root --end

  // brain root dismiss button --start
  let elBrainRootDismissButton = document.createElement("div");
  elBrainRootDismissButton.style.position = "absolute";
  elBrainRootDismissButton.style.top = "-10px";
  elBrainRootDismissButton.style.left = "-10px";
  elBrainRootDismissButton.style.width = "32px";
  elBrainRootDismissButton.style.height = "32px";
  elBrainRootDismissButton.style.zIndex = "99999";
  elBrainRootDismissButton.style.cursor = "pointer";
  elBrainRootDismissButton.onclick = () => {
    elBrainRoot.style.transform = "translateX(100%)";
  };

  let elBrainRootDismissButtonImage = document.createElement("img");
  elBrainRootDismissButtonImage.src = chrome.runtime.getURL(
    "assets/images/drawer-dismiss.png"
  );
  elBrainRootDismissButtonImage.style.width = "32px";
  elBrainRootDismissButtonImage.style.height = "32px";
  elBrainRootDismissButton.appendChild(elBrainRootDismissButtonImage);
  elBrainRoot.appendChild(elBrainRootDismissButton);
  // brain root dismiss button --end

  // brain content --start
  let elBrainContent = document.createElement("div");
  elBrainContent.id = elBrainContentID;
  elBrainContent.style.position = "relative";
  elBrainContent.style.width = "100%";
  elBrainContent.style.height = "100%";
  elBrainContent.style.zIndex = "99999";
  elBrainContent.style.overflowY = "auto";
  elBrainContent.style.overflowX = "hidden";
  elBrainRoot.appendChild(elBrainContent);
  // brain content --end

  // brain root tabs --start
  const tabItemHeight = 32;
  const tabItemDeactiveBackground = "#0A0458";

  let elBrainRootTabs = document.createElement("div");
  elBrainRootTabs.id = elBrainRootTabsID;
  elBrainRootTabs.style.position = "absolute";
  elBrainRootTabs.style.top = -tabItemHeight - 1 + "px"; // 1px border
  elBrainRootTabs.style.left = "0";
  elBrainRootTabs.style.width = "100%";
  elBrainRootTabs.style.height = tabItemHeight + "px";
  elBrainRootTabs.style.zIndex = "99999";
  elBrainRootTabs.style.display = "flex";
  elBrainRootTabs.style.flexDirection = "row";
  elBrainRootTabs.style.alignItems = "center";
  elBrainRootTabs.style.justifyContent = "center";
  elBrainRootTabs.style.boxSizing = "border-box";
  elBrainRoot.appendChild(elBrainRootTabs);

  // brain root tab first --start
  let elBrainRootTabItemFirst = createTabItem(tabFirstItemID, "SMARTPAST");
  elBrainRootTabItemFirst.style.height = tabItemHeight + "px";
  elBrainRootTabItemFirst.style.backgroundColor = "rgba(243, 243, 243, 0.2)";
  elBrainRootTabItemFirst.style.color = tabItemDeactiveBackground;
  elBrainRootTabItemFirst.onclick = () => {
    selectTabItem(tabFirstItemID);
  };
  elBrainRootTabs.appendChild(elBrainRootTabItemFirst);
  // brain root tab first --end

  // brain root tab second --start
  let elBrainRootTabItemSecond = createTabItem(tabSecondItemID, "TAGS");
  elBrainRootTabItemSecond.style.height = tabItemHeight + "px";
  elBrainRootTabItemSecond.style.backgroundColor = tabItemDeactiveBackground;
  elBrainRootTabItemSecond.style.color = "#fff";
  elBrainRootTabItemSecond.style.marginLeft = "8px";
  elBrainRootTabItemSecond.style.marginRight = "8px";
  elBrainRootTabItemSecond.onclick = () => {
    selectTabItem(tabSecondItemID);
  };
  elBrainRootTabs.appendChild(elBrainRootTabItemSecond);
  // brain root tab second --end

  // brain root tab second --third
  let elBrainRootTabItemThird = createTabItem(tabThirdItemID, "NOTES");
  elBrainRootTabItemThird.style.height = tabItemHeight + "px";
  elBrainRootTabItemThird.style.backgroundColor = tabItemDeactiveBackground;
  elBrainRootTabItemThird.style.color = "#fff";
  elBrainRootTabItemThird.onclick = () => {
    selectTabItem(tabThirdItemID);
  };
  elBrainRootTabs.appendChild(elBrainRootTabItemThird);
  // brain root tab second --third

  document.body.appendChild(elBrainRoot);

  // load page data --start
  elBrainRootTabs.style.display = "none";
  elBrainContent.style.display = "none";

  let elBrainLoader = document.createElement("div");
  elBrainLoader.id = elBrainLoaderID;
  elBrainLoader.style.position = "absolute";
  elBrainLoader.style.top = "0";
  elBrainLoader.style.left = "0";
  elBrainLoader.style.width = "100%";
  elBrainLoader.style.height = "100%";
  elBrainLoader.style.zIndex = "99999";
  elBrainLoader.style.display = "flex";
  elBrainLoader.style.flexDirection = "column";
  elBrainLoader.style.alignItems = "center";
  elBrainLoader.style.justifyContent = "center";
  elBrainLoader.style.boxSizing = "border-box";
  elBrainLoader.style.fontSize = "16px";
  elBrainLoader.style.fontWeight = "regular";
  elBrainLoader.innerText = "Loading...";
  elBrainRoot.appendChild(elBrainLoader);

  chrome.runtime.sendMessage(
    { action: "get-url-data", data: {} },
    (response) => {
      elBrainRootTabs.style.display = "flex";
      elBrainContent.style.display = "block";
      elBrainLoader.style.display = "none";
      if (response) {
        pageData = response;
        console.log("pageData", pageData);
        selectTabItem(tabSecondItemID);
      }
    }
  );
  // load page data --end
};
// init --end

// tab related actions --start
const createTabItem = (id, title) => {
  let tabItem = document.createElement("div");
  tabItem.id = id;
  tabItem.style.position = "relative";
  tabItem.style.borderTopLeftRadius = "8px";
  tabItem.style.borderTopRightRadius = "8px";
  tabItem.style.border = "1px solid rgba(200, 200, 200, 0.4)";
  tabItem.style.borderBottomWidth = "0";
  tabItem.style.backdropFilter = "blur(10px)";
  tabItem.innerHTML = title;
  tabItem.style.fontSize = "14px";
  tabItem.style.fontWeight = "bold";
  tabItem.style.display = "flex";
  tabItem.style.alignItems = "center";
  tabItem.style.justifyContent = "center";
  tabItem.style.cursor = "pointer";
  tabItem.style.padding = "0px 12px";
  return tabItem;
};

const selectTabItem = (tabID) => {
  let elTabItem = document.getElementById(tabID);
  let elTabItemContainer = document.getElementById(elBrainRootTabsID);
  let elTabItemContainerChildren = elTabItemContainer.children;
  for (let i = 0; i < elTabItemContainerChildren.length; i++) {
    elTabItemContainerChildren[i].style.backgroundColor = "#0A0458";
    elTabItemContainerChildren[i].style.color = "#fff";
  }
  elTabItem.style.backgroundColor = "rgba(243, 243, 243, 0.2)";
  elTabItem.style.color = "#0A0458";
  document.getElementById(elBrainLoaderID).style.display = "none";
  if (tabID === tabFirstItemID) {
    createSmartpastContent();
  } else if (tabID === tabSecondItemID) {
    createTagsContent();
  } else if (tabID === tabThirdItemID) {
    createNotesContent();
  }
};
// tab related actions --end

// tab content related actions --start

// tab smartpast content --start
const createSmartpastContent = () => {
  let tabContent = document.createElement("div");
  tabContent.id = elBrainContentID + "-smartpast-content";
  tabContent.style.position = "relative";
  tabContent.style.display = "flex";
  tabContent.style.flexDirection = "column";
  tabContent.style.width = "100%";
  tabContent.style.height = "100%";
  tabContent.innerHTML = "";
  document.getElementById(elBrainContentID).innerHTML = "";
  document.getElementById(elBrainContentID).appendChild(tabContent);

  document.getElementById(elBrainLoaderID).style.display = "flex";
  chrome.runtime.sendMessage(
    { action: "get-smartpast", data: {} },
    (response) => {
      document.getElementById(elBrainLoaderID).style.display = "none";
      if (response) {
        pageSmartPast = response;
        Object.keys(pageSmartPast).forEach((key) => {
          const item = pageSmartPast[key];
          let elSmartpastItem = document.createElement("div");
          elSmartpastItem.style.position = "relative";
          elSmartpastItem.style.border = "1px solid rgba(200, 200, 200, 0.4)";
          elSmartpastItem.style.borderRadius = "12px";
          elSmartpastItem.style.margin = "8px";
          elSmartpastItem.style.padding = "8px";
          elSmartpastItem.style.display = "flex";
          elSmartpastItem.style.flexDirection = "column";
          elSmartpastItem.style.justifyContent = "space-between";
          elSmartpastItem.style.cursor = "pointer";
          elSmartpastItem.style.boxSizing = "border-box";
          elSmartpastItem.style.backgroundColor = "white";
          elSmartpastItem.onclick = () => {
            window.open(item.url, "_blank");
          };

          const favIcon = item.favicon
            ? `<div><img src="` +
              item.favicon +
              `" width="32" height="32" /></div>`
            : "";

          const title =
            item.title.length > 50
              ? item.title.substring(0, 50) + "..."
              : item.title;

          const screenshot = item.screenshot
            ? `<img src="` +
              item.screenshot +
              `" width="100%" height="140px" />`
            : "";

          const descriptionImgSrc = chrome.runtime.getURL(
            "assets/images/description.png"
          );

          const description = item.description
            ? item.description
            : "No description.";

          elSmartpastItem.innerHTML =
            `
            <div style="position: relative; display: flex; flex-direction: column; justify-content: space-between; font-size: 16px;" class="space-y-4">
            <div class="flex flex-row space-x-2">
            ` +
            favIcon +
            `
                <div class="font-semibold">` +
            title +
            `
                </div>
              </div>
              ` +
            screenshot +
            `  
            <div class="flex flex-row w-full p-1 space-x-2" style="font-size:12px;">
              <div class="shrink-0"><img src="` +
            descriptionImgSrc +
            `" width="24px" height="24px" /></div>
            <div>` +
            description +
            `</div>
            </div>
            </div>
            `;

          document
            .getElementById(elBrainContentID + "-smartpast-content")
            .appendChild(elSmartpastItem);
        });
      }
    }
  );

  // let elSmartpastContainer = document.createElement("div");
};
// tab smartpast content --end

// tab tags content --start
const createTagsContent = (tid) => {
  let tabContent = document.createElement("div");
  tabContent.id = elBrainContentID + "-tags-content";
  tabContent.style.position = "relative";
  tabContent.style.height = "100%";
  tabContent.style.display = "flex";
  tabContent.style.flexDirection = "column";

  tabContent.innerHTML =
    `
    <div class="flex flex-grow flex-wrap space-y-4" id="` +
    elBrainContentID +
    `-tags-content-active-tags-list">
    </div>
    <div class="flex">
    input
    </div>
    <div class="flex flex-grow flex-wrap">
    suggesteds
    </div>
  `;

  document.getElementById(elBrainContentID).innerHTML = "";
  document.getElementById(elBrainContentID).appendChild(tabContent);
  fillTagsContent();
};

const fillTagsContent = () => {
  const tags = pageData.tags.split(",");

  var tagsHTML = "";
  tags.forEach((tag, index) => {
    tagsHTML +=
      '<div class="flex flex-row items-center justify-center px-2 py-1 space-x-1 text-sm font-medium rounded-full" style="background-color: #E7E8FC; height:24px;">';
    tagsHTML += '<div class="flex-shrink-0"><img src="';
    tagsHTML += chrome.runtime.getURL("assets/images/tag.png");
    tagsHTML += '" width="16px" height="16px" /></div>';
    tagsHTML += "<div id='tag-item-" + index + "'>" + tag + "</div>";
    tagsHTML +=
      '<div class="flex-shrink-0 cursor-pointer" onclick="(function(e){alert(\'remove tag\');return false;})(arguments[0]);return false;"><img src="';
    tagsHTML += chrome.runtime.getURL("assets/images/tag-remove.png");
    tagsHTML += '" width="16px" height="16px" /></div>';
    tagsHTML += "</div>";
  });
  document.getElementById(
    elBrainContentID + "-tags-content-active-tags-list"
  ).innerHTML = tagsHTML;
};

// tab tags content --end

// tab notes content --start
const createNotesContent = () => {
  let tabContent = document.createElement("div");
  tabContent.id = elBrainContentID + "-notes-content";
  tabContent.style.position = "relative";
  tabContent.style.height = "100%";
  const favIcon = pageData.favicon
    ? `<div><img src="` + pageData.favicon + `" width="32" height="32" /></div>`
    : "";

  const title =
    pageData.title.length > 100
      ? pageData.title.substring(0, 100) + "..."
      : pageData.title;

  tabContent.innerHTML =
    `
      <div class="flex flex-col space-y-2 h-full">
        <div class="flex flex-row space-x-2">
      ` +
    favIcon +
    `
          <div class="font-semibold">` +
    title +
    `
          </div>
        </div>
        <div class="flex flex-grow">
          <textarea class="w-full h-full border border-gray-100 rounded-lg p-2 text-md">` +
    pageData.notes +
    `</textarea>
        </div>
        <div class="flex flex-row space-x-2 items-center">
          <p class="flex flex-grow"><a href="https://heybrain.ai/notes" class="text-purple-600 hover:text-purple-500 underline hover:underline text-sm" target="_blank">view all notes</a></p> 
          <div>
          <button class="px-6 py-2 font-semibold rounded-full text-xs" style="background:#DDD;color:#666;">
          EXPORT
        </button>          
          </div>
          <div>
            <button class="px-6 py-2 text-white font-semibold rounded-full text-xs" style="background:#2B007B;" onclick="
            (function(e){
              console.log(e);
              alert('save note');
              return false;
          })(arguments[0]);return false;
            ">
              SAVE
            </button>
          </div>
        </div>
      </div>
  `;

  document.getElementById(elBrainContentID).innerHTML = "";
  document.getElementById(elBrainContentID).appendChild(tabContent);
};
// tab notes content --end

// tab content related actions --end

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "init") {
    chrome.storage.local.get(["access_token"], (data) => {
      if (data.access_token) {
        init();
      }
    });
  } else if (request.action === "deinit") {
    document.body.removeChild(document.getElementById(elBrainDrawerID));
    document.body.removeChild(document.getElementById(elBrainRootID));
  }
});
