chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "init") {
    const elBrainDrawerID = "hey-brain-drawer";
    const elBrainRootID = "hey-brain-root";
    const kBrainRootHeight = 475;

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

    // brain root tabs --start
    const tabItemHeight = 32;
    const tabItemDeactiveBackground = "#0A0458";

    const tabFirstItemID = "hey-brain-root-tab-item-first";
    const tabSecondItemID = "hey-brain-root-tab-item-second";
    const tabThirdItemID = "hey-brain-root-tab-item-third";

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
    let elBrainRootTabItemFirst = document.createElement("div");
    elBrainRootTabItemFirst.id = tabFirstItemID;
    elBrainRootTabItemFirst.style.position = "relative";
    elBrainRootTabItemFirst.style.borderTopLeftRadius = "8px";
    elBrainRootTabItemFirst.style.borderTopRightRadius = "8px";
    elBrainRootTabItemFirst.style.border = "1px solid rgba(200, 200, 200, 0.4)";
    elBrainRootTabItemFirst.style.borderBottomWidth = "0";
    elBrainRootTabItemFirst.style.backgroundColor = "rgba(243, 243, 243, 0.2)";
    elBrainRootTabItemFirst.style.backdropFilter = "blur(10px)";
    elBrainRootTabItemFirst.style.height = tabItemHeight + "px";
    elBrainRootTabItemFirst.style.color = tabItemDeactiveBackground;
    elBrainRootTabItemFirst.innerHTML = "SMARTPAST";
    elBrainRootTabItemFirst.style.fontSize = "14px";
    elBrainRootTabItemFirst.style.fontWeight = "bold";
    elBrainRootTabItemFirst.style.display = "flex";
    elBrainRootTabItemFirst.style.alignItems = "center";
    elBrainRootTabItemFirst.style.justifyContent = "center";
    elBrainRootTabItemFirst.style.cursor = "pointer";
    elBrainRootTabItemFirst.style.padding = "0px 12px";
    elBrainRootTabItemFirst.onclick = () => {
      elBrainRootTabItemFirst.style.backgroundColor =
        "rgba(243, 243, 243, 0.2)";
      elBrainRootTabItemFirst.style.color = tabItemDeactiveBackground;
      document.getElementById(tabSecondItemID).style.backgroundColor =
        tabItemDeactiveBackground;
      document.getElementById(tabSecondItemID).style.color = "#fff";
      document.getElementById(tabThirdItemID).style.backgroundColor =
        tabItemDeactiveBackground;
      document.getElementById(tabThirdItemID).style.color = "#fff";
    };
    elBrainRootTabs.appendChild(elBrainRootTabItemFirst);
    // brain root tab first --end

    // brain root tab second --start
    let elBrainRootTabItemSecond = document.createElement("div");
    elBrainRootTabItemSecond.id = tabSecondItemID;
    elBrainRootTabItemSecond.style.position = "relative";
    elBrainRootTabItemSecond.style.borderTopLeftRadius = "8px";
    elBrainRootTabItemSecond.style.borderTopRightRadius = "8px";
    elBrainRootTabItemSecond.style.border =
      "1px solid rgba(200, 200, 200, 0.4)";
    elBrainRootTabItemSecond.style.borderBottomWidth = "0";
    elBrainRootTabItemSecond.style.backgroundColor = tabItemDeactiveBackground;
    elBrainRootTabItemSecond.style.backdropFilter = "blur(10px)";
    elBrainRootTabItemSecond.style.height = tabItemHeight + "px";
    elBrainRootTabItemSecond.style.color = "#fff";
    elBrainRootTabItemSecond.innerHTML = "TAGS";
    elBrainRootTabItemSecond.style.fontSize = "14px";
    elBrainRootTabItemSecond.style.fontWeight = "bold";
    elBrainRootTabItemSecond.style.display = "flex";
    elBrainRootTabItemSecond.style.alignItems = "center";
    elBrainRootTabItemSecond.style.justifyContent = "center";
    elBrainRootTabItemSecond.style.cursor = "pointer";
    elBrainRootTabItemSecond.style.padding = "0px 12px";
    elBrainRootTabItemSecond.style.marginLeft = "8px";
    elBrainRootTabItemSecond.style.marginRight = "8px";
    elBrainRootTabItemSecond.onclick = () => {
      elBrainRootTabItemSecond.style.backgroundColor =
        "rgba(243, 243, 243, 0.2)";
      elBrainRootTabItemSecond.style.color = tabItemDeactiveBackground;
      document.getElementById(tabFirstItemID).style.backgroundColor =
        tabItemDeactiveBackground;
      document.getElementById(tabFirstItemID).style.color = "#fff";
      document.getElementById(tabThirdItemID).style.backgroundColor =
        tabItemDeactiveBackground;
      document.getElementById(tabThirdItemID).style.color = "#fff";
    };
    elBrainRootTabs.appendChild(elBrainRootTabItemSecond);
    // brain root tab second --end

    // brain root tab second --third
    let elBrainRootTabItemThird = document.createElement("div");
    elBrainRootTabItemThird.id = tabThirdItemID;
    elBrainRootTabItemThird.style.position = "relative";
    elBrainRootTabItemThird.style.borderTopLeftRadius = "8px";
    elBrainRootTabItemThird.style.borderTopRightRadius = "8px";
    elBrainRootTabItemThird.style.border = "1px solid rgba(200, 200, 200, 0.4)";
    elBrainRootTabItemThird.style.borderBottomWidth = "0";
    elBrainRootTabItemThird.style.backgroundColor = tabItemDeactiveBackground;
    elBrainRootTabItemThird.style.backdropFilter = "blur(10px)";
    elBrainRootTabItemThird.style.height = tabItemHeight + "px";
    elBrainRootTabItemThird.style.color = "#fff";
    elBrainRootTabItemThird.innerHTML = "NOTES";
    elBrainRootTabItemThird.style.fontSize = "14px";
    elBrainRootTabItemThird.style.fontWeight = "bold";
    elBrainRootTabItemThird.style.display = "flex";
    elBrainRootTabItemThird.style.alignItems = "center";
    elBrainRootTabItemThird.style.justifyContent = "center";
    elBrainRootTabItemThird.style.cursor = "pointer";
    elBrainRootTabItemThird.style.padding = "0px 12px";
    elBrainRootTabItemThird.onclick = () => {
      elBrainRootTabItemThird.style.backgroundColor =
        "rgba(243, 243, 243, 0.2)";
      elBrainRootTabItemThird.style.color = tabItemDeactiveBackground;
      document.getElementById(tabFirstItemID).style.backgroundColor =
        tabItemDeactiveBackground;
      document.getElementById(tabFirstItemID).style.color = "#fff";
      document.getElementById(tabSecondItemID).style.backgroundColor =
        tabItemDeactiveBackground;
      document.getElementById(tabSecondItemID).style.color = "#fff";
    };
    elBrainRootTabs.appendChild(elBrainRootTabItemThird);
    // brain root tab second --third

    document.body.appendChild(elBrainRoot);
  }
});
