// constants --start
const elBrainDrawerID = "hey-brain-drawer";
const elBrainRootID = "hey-brain-root";
const elBrainContentID = "hey-brain-content";
const kBrainRootHeight = 475;

const tabFirstItemID = "hey-brain-root-tab-item-first";
const tabSecondItemID = "hey-brain-root-tab-item-second";
const tabThirdItemID = "hey-brain-root-tab-item-third";
// constants --end

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
  elBrainRootTabs.id = "hey-brain-root-tabs";
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
  let elBrainRootTabItemFirst = createTabItem(tabFirstItemID, "SMARTPASS");
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
  selectTabItem(tabFirstItemID);
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
  let elTabItemContainer = document.getElementById("hey-brain-root-tabs");
  let elTabItemContainerChildren = elTabItemContainer.children;
  for (let i = 0; i < elTabItemContainerChildren.length; i++) {
    elTabItemContainerChildren[i].style.backgroundColor = "#0A0458";
    elTabItemContainerChildren[i].style.color = "#fff";
  }
  elTabItem.style.backgroundColor = "rgba(243, 243, 243, 0.2)";
  elTabItem.style.color = "#0A0458";

  var content = "";
  if (tabID === tabFirstItemID) {
    content = "smartpass";
  } else if (tabID === tabSecondItemID) {
    content = "tags";
  } else if (tabID === tabThirdItemID) {
    content = "notes";
  }

  chrome.runtime.sendMessage(
    { action: "select-tab", data: content },
    (response) => {
      console.log("response:", response);
      if (response) {
        if (response.tab === "smartpass") {
          createSmartpassContent(tabID);
        } else if (response.tab === "tags") {
          createTagsContent(tabID);
        } else if (response.tab === "notes") {
          createNotesContent(tabID);
        }
      }
    }
  );
};
// tab related actions --end

// tab content related actions --start

// tab smartpass content --start
const createSmartpassContent = (tid) => {
  let tabContent = document.createElement("div");
  tabContent.id = elBrainContentID + "-" + tid + "-content";
  tabContent.style.position = "relative";
  tabContent.innerText = elBrainContentID + "-" + tid + "-content !smartpass";
  document.getElementById(elBrainContentID).innerHTML = "";
  document.getElementById(elBrainContentID).appendChild(tabContent);
};
// tab smartpass content --end

// tab tags content --start
const createTagsContent = (tid) => {
  let tabContent = document.createElement("div");
  tabContent.id = elBrainContentID + "-" + tid + "-content";
  tabContent.style.position = "relative";
  tabContent.innerText = elBrainContentID + "-" + tid + "-content !tags";
  document.getElementById(elBrainContentID).innerHTML = "";
  document.getElementById(elBrainContentID).appendChild(tabContent);
};
// tab tags content --end

// tab notes content --start
const createNotesContent = (tid) => {
  let tabContent = document.createElement("div");
  tabContent.id = elBrainContentID + "-" + tid + "-content";
  tabContent.style.position = "relative";
  tabContent.innerText = elBrainContentID + "-" + tid + "-content !notes";
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
