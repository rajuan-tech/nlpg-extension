// constants --start
const elBrainDrawerID = "hey-brain-drawer";
const elBrainRootID = "hey-brain-root";
const elBrainRootTabsID = "hey-brain-root-tabs";
const elBrainContentID = "hey-brain-content";
const elBrainLoaderID = "hey-brain-loader";
const kBrainRootHeight = 582; 
const tabFirstItemID = "hey-brain-root-tab-item-first";
const tabSecondItemID = "hey-brain-root-tab-item-second";
const tabThirdItemID = "hey-brain-root-tab-item-third";
// constants --end
var accessToken = "";
var pageData = null;
var pageSmartPast = [];
var pageTagsSuggestions = [];
var pageTagsRecommendations = [];

let isServerIsAvailable = true;
let isSmartpastAvailable = true;

let waitForAutosave = false; /// NEW 2023-05-09, replaced on 2023-05-10
let AutoSaveTimer = null; /// NEW 2023-05-14

// helpers --start

const metaSelector = (name) => {
  if (!name) {
    return null;
  }
  if (document.querySelector(name)) {
    return document.querySelector(name);
  }
  return null;
};

/**
 * Returns the content of a meta tag
 *
 * @param {string} selector
 * @returns {string} content of the meta tag
 */
const getMetaContent = (selector) => {
  if (!selector) {
    return "";
  }

  if (document.querySelector(selector)) {
    return document.querySelector(selector).getAttribute("content");
  }

  return "";
};

const pageInfo = () => {
  const description =
    getMetaContent('meta[name="description"]') ||
    getMetaContent('meta[property="og:description"]') ||
    getMetaContent('meta[property="twitter:description"]');

  return {
    title: document.title,
    url: window.location.href,
    description: description,
    domain: window.location.hostname,
  };
};
// helpers --end

//natalia 17.04
const drawBrainWithMarker = () => {   //natalia 17.04
  
    let elBrainDrawerNoHandsImageWithMarker = document.getElementById(
      "brain-drawer-no-hands-image"
    );
    elBrainDrawerNoHandsImageWithMarker.src = chrome.runtime.getURL(
      "assets/icons/brain-with-marker.png"
    );
    elBrainDrawerNoHandsImageWithMarker.alt = "brain-with-marker";
    elBrainDrawerNoHandsImageWithMarker.style.width = "80px"; // 03.05

    document.getElementById('brain-drawer-image').style.width = "80px"; // 03.05
    // elBrainDrawerNoHandsImageWithMarker.style.right = "26px"; // 03.05
    document.getElementById('brain-drawer-image').style.position = "absolute";
    document.getElementById('brain-drawer-image').style.right = "5px";
    elBrainDrawerNoHandsImageWithMarker.style.height = "67px"; 
    elBrainDrawerNoHandsImageWithMarker.style.top = "0px";
    elBrainDrawerNoHandsImageWithMarker.style.right = "3px";

    document.getElementById("brain-drawer-image").src = chrome.runtime.getURL(
        "assets/icons/brain-with-marker.png"
    ); 
    document.getElementById("brain-drawer-image").alt = "brain-drawer-image"; 
}  

const drawBrainWithHands = () => {
  let elBrainDrawerNoHandsImageWithMarker = document.getElementById(
    "brain-drawer-no-hands-image"
  );
  elBrainDrawerNoHandsImageWithMarker.src = chrome.runtime.getURL(
    "assets/icons/brain-drawer-no-hands.png"
  );
  document.getElementById('brain-drawer-image').style.width = "65px"; // 03.05

  elBrainDrawerNoHandsImageWithMarker.alt = "brain-drawer-no-hands";
  elBrainDrawerNoHandsImageWithMarker.style.width = "62px";
  elBrainDrawerNoHandsImageWithMarker.style.height = "54px"; 
  elBrainDrawerNoHandsImageWithMarker.style.right = "5px"; 
  document.getElementById("brain-drawer-image").src = chrome.runtime.getURL(
    "assets/icons/brain-drawer-160.png"
  );
  document.getElementById("brain-drawer-image").alt = "brain-drawer-image";
// natalia 17.04
}

// init --start
const init = () => {
  pageSmartPast = [];

  // 2023-03-20 Added by Stanislav: Delete elements if they're already exist
  if (document.getElementById("hey-brain-drawer") !== null) {
      document.body.removeChild(document.getElementById(elBrainDrawerID));
  }
  if (document.getElementById("hey-brain-root") !== null) {
      document.body.removeChild(document.getElementById(elBrainRootID));
  }
  if (document.getElementById("hey-brain-root") !== null) {
      document.body.removeChild(
      document.getElementById(elBrainRootDismissButton)
      );
  }

    // brain drawer --star
    if (document.getElementById(elBrainDrawerID) === null) {
      // changed 2023-03-20 by Stanislav
      let elBrainDrawer = document.createElement("div");
      elBrainDrawer.id = elBrainDrawerID;
      elBrainDrawer.classList.add("hey-brain-main");
      elBrainDrawer.style.position = "fixed";
      elBrainDrawer.style.bottom = kBrainRootHeight - 20 + "px";
      elBrainDrawer.style.right = "-36px";
      elBrainDrawer.style.width = "80px";
      elBrainDrawer.style.height = "67px";
      elBrainDrawer.style.zIndex = "99999";
      elBrainDrawer.style.cursor = "pointer";
     

      elBrainDrawer.onclick = () => {
        
        // getSmartpastContent().then(() => {
          console.log('click on brain');
          // createSmartpastContent();
                // 05.05
        let elBrainRoot = document.getElementById(elBrainRootID);
        elBrainDrawer.style.right = "26px"; // 30.04
        if (elBrainRoot.style.transform === "translateX(100%)") {

          document.getElementById('hey-brain-content')
          .innerHTML =
           `<div style="width:30px; height: 20px; margin: 230px auto;"><img src=${chrome.runtime.getURL(
            "assets/icons/spinner.svg")}></div>`;

          elBrainRoot.style.transform = "translateX(0%)";
          elBrainRootDismissButton.style.display = "block"; 
          document.getElementById("brain-drawer-no-hands-image").style.display =
            "none";
          document.getElementById("brain-drawer-image").style.display = "initial";
          document.getElementById("brain-drawer-image").style.position = "absolute"; //03.05
          document.getElementById("brain-drawer-image").style.right = "7px"; //03.05
          // console.log(isSmartpastAvailable);
     
        } else {
          elBrainRoot.style.transform = "translateX(100%)";
          elBrainRootDismissButton.style.display = "none";  
          document.getElementById("brain-drawer-no-hands-image").style.display =
          "initial";
          elBrainDrawer.style.right = "-36px";
          document.getElementById("brain-drawer-image").style.display = "none";
        }
        selectTabItem(tabFirstItemID);
      };

      let elBrainDrawerImage = document.createElement("img");
  
      // pic assigned is seen ONLY inside the SMARTPAST
      elBrainDrawerImage.src = chrome.runtime.getURL(
        "assets/icons/brain-drawer-160.png"  
      );
      elBrainDrawerImage.alt = "brain-drawer-160";
      
      elBrainDrawerImage.setAttribute("id", "brain-drawer-image");
      elBrainDrawerImage.style.width = "65px"; 
      elBrainDrawerImage.style.height = "67px"; 
      elBrainDrawerImage.style.display = "none";
      elBrainDrawer.appendChild(elBrainDrawerImage);
  
      let elBrainDrawerNoHandsImage = document.createElement("img");
      elBrainDrawerNoHandsImage.src = chrome.runtime.getURL(
        "assets/icons/brain-drawer-no-hands.png"
      );
      elBrainDrawerNoHandsImage.alt = "brain-drawer-no-hands"
  
      elBrainDrawerNoHandsImage.style.width = "67px";
      elBrainDrawerNoHandsImage.style.height = "54px";
      elBrainDrawerNoHandsImage.style.position = "absolute";
      elBrainDrawerNoHandsImage.style.top = "0px";
      elBrainDrawerNoHandsImage.style.right = "3px";
      elBrainDrawerNoHandsImage.style.display = "initial";
      elBrainDrawerNoHandsImage.setAttribute("id", "brain-drawer-no-hands-image");
      elBrainDrawerNoHandsImage.style.transition = "all 0.5s ease-in-out";
      elBrainDrawer.appendChild(elBrainDrawerNoHandsImage);
      document.body.appendChild(elBrainDrawer);
      // brain drawer --end
    }
  // const metadata = await fetchMetadata(sender.tab.url);
  // sendResponse(metadata);

      // brain root --start
  let elBrainRoot = document.createElement("div");
  elBrainRoot.id = elBrainRootID;
  elBrainRoot.classList.add("hey-brain-main");
  elBrainRoot.style.position = "fixed";
  elBrainRoot.style.bottom = "0";
  elBrainRoot.style.right = "0";
  elBrainRoot.style.width = "100%";
  elBrainRoot.style.height = "100%";
  elBrainRoot.style.zIndex = "99998";
  elBrainRoot.style.backgroundColor = "rgba(243, 243, 243, 0.8)";
  elBrainRoot.style.backdropFilter = "blur(10px)";
  elBrainRoot.style.borderLeft = "1px solid rgba(200, 200, 200, 0.4)";
  elBrainRoot.style.borderBottom = "1px solid rgba(200, 200, 200, 0.4)";
  elBrainRoot.style.boxShadow = " -3px 0 3px  rgba(0, 0, 0, 0.1)";
  elBrainRoot.style.display = "flex";
  elBrainRoot.style.flexDirection = "column"; // natalia 19/04
  elBrainRoot.style.borderBottomLeftRadius = "20px";
  elBrainRoot.style.borderTopLeftRadius = "20px";
  elBrainRoot.style.padding = "25px 20px";

  elBrainRoot.style.boxSizing = "border-box";
  elBrainRoot.style.alignItems = "center";
  elBrainRoot.style.justifyContent = "center";
  elBrainRoot.style.height = kBrainRootHeight + "px";
  elBrainRoot.style.width = "427px"; // natalia 23.04
  elBrainRoot.style.transition = "all 0.3s ease-in-out";
  elBrainRoot.style.transform = "translateX(100%)";
  elBrainRoot.style.fontFamily = "'Montserrat', sans-serif";
  elBrainRoot.style.fontSize = "16px";
  elBrainRoot.style.color = "#000";
  // brain root --end

  // brain root dismiss button --start
   let elBrainRootDismissButton = document.createElement("div");
   elBrainRootDismissButton.style.position = "absolute";
   elBrainRootDismissButton.style.top = "0";// natalia 23.04
   elBrainRootDismissButton.style.left = "0";// natalia 23.04
   elBrainRootDismissButton.style.zIndex = "99999";
   elBrainRootDismissButton.style.cursor = "pointer";
   elBrainRootDismissButton.style.display = "none";
 
   let elBrainRootDismissButtonImage = document.createElement("img");
   elBrainRootDismissButtonImage.src = chrome.runtime.getURL(
     "assets/images/drawer-dismiss.png"
   );
   elBrainRootDismissButtonImage.alt = "drawer-dismiss";
   elBrainRootDismissButtonImage.style.width = "24px";// natalia 23.04
   elBrainRootDismissButtonImage.style.height = "24px";// natalia 23.04
   elBrainRootDismissButtonImage.style.filter = "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))";
   elBrainRootDismissButton.appendChild(elBrainRootDismissButtonImage);
   elBrainRoot.appendChild(elBrainRootDismissButton);
 
   elBrainRootDismissButton.onclick = () => {
     elBrainRoot.style.transform = "translateX(100%)";
     document.getElementById("brain-drawer-no-hands-image").style.display =
       "initial";
     document.getElementById("brain-drawer-image").style.display = "none";
     document.getElementById(elBrainDrawerID).style.right = "-36px";
   };
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
 const tabItemHeight = 25; // natalia 23.04
 const tabItemDeactiveBackground = "#0A0458";

 let elBrainRootTabs = document.createElement("div");
 elBrainRootTabs.id = elBrainRootTabsID;
 elBrainRootTabs.style.position = "absolute";
 elBrainRootTabs.style.top = -tabItemHeight + "px"; 
 elBrainRootTabs.style.left = "-40px"; // natalia 23.04
 elBrainRootTabs.style.width = "100%";
 elBrainRootTabs.style.height = tabItemHeight + "px";
 elBrainRootTabs.style.zIndex = "99999";
 elBrainRootTabs.style.display = "flex";
 elBrainRootTabs.style.flexDirection = "row";
 elBrainRootTabs.style.alignItems = "center";
 elBrainRootTabs.style.justifyContent = "center";
 elBrainRootTabs.style.boxSizing = "border-box";
 elBrainRootTabs.style.fontSize= "12px";
 elBrainRootTabs.style.fontWeight = "600";
 elBrainRoot.appendChild(elBrainRootTabs);

 // brain root tab first --start
 let elBrainRootTabItemFirst = createTabItem(tabFirstItemID, "<span style='color:#6416F3; font-size:12px; font-weight:600;'>SMART</span>PAST"); // natalia 23.04
 elBrainRootTabItemFirst.style.height = tabItemHeight + "px";
 elBrainRootTabItemFirst.style.backgroundColor = "#EFEFEF";  // natalia 23.04
 elBrainRootTabItemFirst.style.borderLeft = "1px solid rgba(200, 200, 200, 0.4)";// natalia 23.04
 elBrainRootTabItemFirst.style.borderBottom = "0px";// natalia 23.04
 elBrainRootTabItemFirst.style.borderBottom = "none";// natalia 23.04
 elBrainRootTabItemFirst.style.boxShadow = " -3px 0 3px rgba(0, 0, 0, 0.1)";// natalia 23.04
 elBrainRootTabItemFirst.style.fontWeight = '600';
 elBrainRootTabItemFirst.style.fontSize= "12px";
 elBrainRootTabItemFirst.style.fontFamily = "'Montserrat', sans-serif";


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
 elBrainRootTabItemSecond.style.fontWeight = '600'; //nastya 23.04
 elBrainRootTabItemSecond.style.fontSize = '12px'; //nastya 23.04
 elBrainRootTabItemSecond.style.fontFamily = "'Montserrat', sans-serif";
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
 elBrainRootTabItemThird.style.fontWeight = '600';//nastya 23.04
 elBrainRootTabItemThird.style.fontSize = '12px';
 elBrainRootTabItemThird.style.fontFamily = "'Montserrat', sans-serif";
 elBrainRootTabItemThird.onclick = () => {
   selectTabItem(tabThirdItemID);
 };
 elBrainRootTabs.appendChild(elBrainRootTabItemThird);
 // brain root tab second --third

 document.body.appendChild(elBrainRoot);

  chrome.runtime.sendMessage(
    {
      action: "get-url-data",
      data: {
        access_token: accessToken,
        page_description: pageInfo().description,
        domain: pageInfo().domain,
      },
    },
    (response) => { 
      if (response) {
      pageData = response;
      // console.log(pageData);
 
      // getSmartpastContent().then(() => {

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
  elBrainRootTabs.style.display = "flex";
  elBrainContent.style.display = "block";
  elBrainLoader.style.display = "none";

        if (pageData.tags.length > 0 || pageData.notes.length > 0 && pageData.notes!= " ") {
          drawBrainWithMarker(); //natalia 17.04
        } 
        if (!pageData.favicon_url) {
          pageData.favicon_url =
            "https://www.google.com/s2/favicons?domain=" +
            pageData.url +
            "&sz=64";
        }
        // selectTabItem(tabFirstItemID);
        if (!pageData.screenshot_url || pageData.screenshot_url.length === 0) {
          chrome.runtime.sendMessage(
            {
              action: "save-screenshot",
              data: {
                access_token: accessToken,
                id: pageData.id,
              },
            },
            (response) => {}
          );
        }
    // });
   } else {
      isServerIsAvailable = false;
      document.getElementById(elBrainContentID)
      .innerHTML=`<div style="display:flex; justify-content: center; margin-top: 180px;"><p>Sorry, we have technical problems now :(</p></div>`;
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
  tabItem.style.padding = "0px 18px";
  return tabItem;
};

function selectTabItem  (tabID)  {
  // NEW 2023-05-09   // NEW 2023-05-10
  if (tabID != tabThirdItemID) 
    if (waitForAutosave) {
      if (AutoSaveTimer) clearTimeout(AutoSaveTimer); 
      waitForAutosave = false
      saveNotes()
    }

  let elTabItem = document.getElementById(tabID);
  let elTabItemContainer = document.getElementById(elBrainRootTabsID);
  let elTabItemContainerChildren = elTabItemContainer.children;
  for (let i = 0; i < elTabItemContainerChildren.length; i++) {
    elTabItemContainerChildren[i].style.backgroundColor = "#0A0458";
    elTabItemContainerChildren[i].style.color = "#fff";
  }
  elTabItem.style.backgroundColor = "rgba(243, 243, 243, 0.8)";
  elTabItem.style.color = "#0A0458";
  document.getElementById(elBrainLoaderID).style.display = "none";

  if (document.getElementById(elBrainContentID + "-tags-content-input")) {
    // remove input enter key listener
    document
      .getElementById(elBrainContentID + "-tags-content-input")
      .removeEventListener("keydown", tagInputKeydown);
    document
      .getElementById(elBrainContentID + "-tags-content-input")
      .removeEventListener("keyup", tagInputKeyup);
    document
      .getElementById(elBrainContentID + "-tags-content-tag-input-clear")
      .removeEventListener("click", onResetTagInput, false);

    // remove tag item remove click listener
    if (document.getElementsByClassName("remove-tag-item").length > 0) {
      Array.from(document.getElementsByClassName("remove-tag-item")).forEach(
        (el) => {
          el.removeEventListener("click", removeTag, false);
        }
      );
    }
  }

  if (document.getElementById(elBrainContentID + "-notes-save-content")) {
    document
      .getElementById(elBrainContentID + "-notes-save-button")
      .removeEventListener("click", saveNotes, false);
  }

  if (tabID === tabFirstItemID) {
    pageSmartPast.length === 0 ? getSmartpastContent().then(data => createSmartpastContent(data)) : createSmartpastContent();
  } else if (tabID === tabSecondItemID) {
    createTagsContent();
  } else if (tabID === tabThirdItemID) {
    createNotesContent();
  }
};
// tab related actions --end

// tab content related actions --start

// tab smartpast content --start

let selectedText = null; 

async function getSmartpastContent() {

  return new Promise(resolve => {
    document.getElementById('hey-brain-content')
    .innerHTML =
     `<div style="width:30px; height: 20px; margin: 230px auto;"><img src=${chrome.runtime.getURL(
      "assets/icons/spinner.svg")}></div>`;

      if (isSmartpastAvailable)  {
    chrome.runtime.sendMessage(
      {
        action: "get-smartpast",
        data: {
          access_token: accessToken,
          id: selectedText !== null ? null : pageData.id,
          is_new: selectedText !== null ? true : pageData.is_new,
          text: selectedText !== null ? selectedText : pageData.title,
          limit: 10,
        },
      },
      (response) => {
        if (response) {
          pageSmartPast = response;
            // console.log(`response from getSmartpastContent received`);
            chrome.storage.local.set({'getsmartpast': response}); // 05.05 start
            // getsmartpast = response;
            // console.log('getSmartpastContent finished work')
            resolve(response);
        } else {
          isSmartpastAvailable = false;
          document.getElementById(elBrainContentID)
          .innerHTML=`<div style="display:flex; justify-content: center; margin-top: 180px;">Sorry, we have technical problems now :(</div>`;
        }
      }
    )} else {
      document.getElementById(elBrainContentID)
      .innerHTML=`<div style="display:flex; justify-content: center; margin-top: 180px;"><p>Sorry, we have technical problems now :(</p></div>`;
    }
    console.log('getsmartpast finished work');
  });
  
}

function createSmartpastContent(data) {

  chrome.storage.local.get(["getsmartpast"]).then((result) => {
    pageSmartPast = result.getsmartpast;
   
  }).then(() => {
    
  if (document.getElementById("taglink") !== null)  {document.getElementById("taglink").remove();}
  let tagLink = document.createElement("a");
  tagLink.innerHTML = `<a href="https://heybrain.ai/cloud" id="taglink" target="_blank">view all</a>`;
  tagLink.style.position = "absolute";
  tagLink.style.bottom = "0px";
  tagLink.style.left = "0px";
  tagLink.style.marginTop = "10px";
  tagLink.style.fontSize = "14px";
  tagLink.style.lineHeight = "20px";
  tagLink.style.fontWeight = "400";
  tagLink.style.fontStyle = "normal";
  tagLink.style.textDecorationLine = "underline";
  tagLink.style.color = "#2B007B";

  // end natalia 21/04 
  if (isServerIsAvailable === false || isSmartpastAvailable === false) {
    document.getElementById(elBrainContentID)
    .innerHTML=`<div style="display:flex; justify-content: center; margin-top: 180px;"><p>Sorry, we have technical problems now :(</p></div>`;
  } else {
  let tabContent = document.createElement("div");
  tabContent.id = elBrainContentID + "-smartpast-content";
  tabContent.style.position = "relative";
  tabContent.style.display = "flex";
  tabContent.style.flexDirection = "column";
  tabContent.style.width = "376px"; // natalia 23.04
  tabContent.style.height = "506px"; // natalia 23.04

  tabContent.style.overflowY = "auto";
  tabContent.style.overflowX = "hidden";
  document.getElementById(elBrainContentID).innerHTML = ``;
  document.getElementById(elBrainContentID).appendChild(tabContent);
  document.getElementById(elBrainLoaderID).style.display = "flex";
  document.getElementById(elBrainLoaderID).style.display = "none";
  }

        let smartPastContentEl = document.getElementById(
          elBrainContentID + "-smartpast-content"
        );
        if (smartPastContentEl) {
          pageSmartPast.forEach((item) => {
            if (!item.favicon_url) {
              item.favicon_url =
                "https://www.google.com/s2/favicons?domain=" +
                item.url +
                "&sz=64";
            }

            let elSmartpastItem = document.createElement("div");
            elSmartpastItem.style.position = "relative";
            elSmartpastItem.style.border = "1px solid rgba(200, 200, 200, 0.4)";
            elSmartpastItem.style.borderRadius = "12px";
            elSmartpastItem.style.marginBottom = "10px";
            elSmartpastItem.style.padding = "15px";
            elSmartpastItem.style.display = "flex";
            elSmartpastItem.style.flexDirection = "column";
            elSmartpastItem.style.justifyContent = "space-between";
            elSmartpastItem.style.cursor = "pointer";
            elSmartpastItem.style.boxSizing = "border-box";
            elSmartpastItem.style.backgroundColor = "white";
            elSmartpastItem.style.width= "366px";
            elSmartpastItem.style.height = "290px";
            elSmartpastItem.onclick = () => {
              window.open(item.url, "_blank");
            };

            const favIcon = `
              <div>
                <img src="${item.favicon_url}" width="16" height="16" alt="favicon" />
              </div>
            `;

            const title =
              item.title.length > 75
                ? item.title.substring(0, 75) + "..."
                : item.title;

            const screenshot_url = item.screenshot_url
              ? item.screenshot_url
              : item.favicon_url;

            const blur_effect = !item.screenshot_url
              ? "style=' filter: blur(6px);border:1px solid #EFEFEF; border-radius:8px; max-height: 147px;object-fit: contain; margin: 10px 0 auto;'"
              : "";
            // natalia 24.04
            let isScreenshotIsSeen = false; // variable responsible for behaviour of elSmartpastItem's screenshot
            const screenshot = isScreenshotIsSeen
            ? `<img src="${screenshot_url}" width="332px" height="147px" ; ${blur_effect}>`
            : ``

            const descriptionImgSrc = chrome.runtime.getURL(
              "assets/images/description.png"
            );

            var descriptionText =
              item.description && item.description.length > 0
                ? item.description
                : item.title;

            descriptionText =
              descriptionText.length > 150
                ? descriptionText.substring(0, 150) + "..."
                : descriptionText;

            const descriptionContent = `
              <div class="brain-flex brain-flex-row w-full p-1 space-x-2" style="font-size:10px; line-height:17px;font-weight:400;">
                <div class="shrink-0"><img src="${descriptionImgSrc}" width="16px" height="16px" /></div>
                <div style="max-height:20px; margin-left: 9px; line-height: 10px; overflow: hidden; color: rgba(0,0,0,0.8);">${descriptionText}</div>
              </div>
            `;

            var dateContent = "";

            if (item.__timestamp) {
              const date = new Date(item.__timestamp);
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const monthIndex = date.getMonth();
              const year = date.getFullYear();
              const day = date.getDate();
              const dateStr =
                // date.getDate() +
                // "/" +
                // (date.getMonth() + 1) +
                // "/" +
                // date.getFullYear() +
                // " " +
                // date.getHours() +
                // ":" +
                // date.getMinutes();
              
               `${monthNames[monthIndex]} ${day}, ${year}`;

              dateContent =
                `<div style="margin:5px 0 3px 25px;font-size:10px; font-weight: 500; opacity:0.5;">` +
                dateStr +
                `</div>
                
                `;
            }

            let domain = item.domain;
            let url = item.url;

            // replace www. with empty string if www. only occurs once
            // once because there might be such domain: "www.examplewww.com"
            if (domain && domain.split("www.").length === 2) {
              domain = domain.replace("www.", "");
            }

            if (domain && url) {
              domain = url.split("//")[0] + "//" + domain;
            }

            elSmartpastItem.innerHTML =
              `
              <div style="font-family: 'Montserrat', sans-serif;position: relative; display: flex; flex-direction: column; justify-content: space-between; font-size: 16px;" class="space-y-4">
              <div class="brain-flex brain-flex-col">
                <div class="brain-flex brain-flex-row space-x-2">
                ` +
              favIcon +
              `
                    <div style="font-size:14px; font-family: 'Montserrat', sans-serif; font-weight: bold;">` +
              title +
              `
                    </div>
                  </div>
                  <div style="font-weight:600; font-family: 'Montserrat', sans-serif; margin:5px 0 0 25px;font-size:10px;opacity:0.5;">` +
              domain +
              `</div>
                </div>
                ` +
              screenshot +
              `  
              ` +
              descriptionContent +
              `
              ` +
              dateContent +
              `
              </div>
             
              `;
            smartPastContentEl.appendChild(elSmartpastItem);
          });
        }
        document.getElementById(elBrainContentID).appendChild(tagLink);// end natalia 21/04 
    
         if(selectedText !== null) selectedText = null;
       console.log('createSmartpastContent finished work');
  });
};
       

  
  // let elSmartpastContainer = document.createElement("div");
// };
// tab smartpast content --end

// tab tags content --start
const createTagsContent = () => {
  let tabContent = document.createElement("div");
  tabContent.id = elBrainContentID + "-tags-content";
  tabContent.style.position = "relative";
  tabContent.style.height = "100%";
  tabContent.style.display = "flex";
  tabContent.style.flexDirection = "column";
  tabContent.className = "space-y-4";

  const favIcon = `<div><img src="${pageData.favicon_url}" width="16" height="16" alt="favIcon" /></div>`;
  const uploadIcon = `<div><img src="${chrome.runtime.getURL("assets/images/upload.png")}" width="24" height="24" alt="upload" /></div>`;
  const title =
    pageData.title.length > 35
      ? pageData.title.substring(0, 35) + "..."
      : pageData.title;

  tabContent.innerHTML =
    `
    <div class="brain-flex brain-flex-row space-x-2">
    ` +
    favIcon + 
    `
        <div class="brain-flex" style="width:100%; justify-content:space-between; font-weight:600;">` +
    title + uploadIcon +
    `
        </div>
    </div>
    <div class="brain-flex brain-flex-grow brain-flex-wrap" style="align-content: baseline;" id="` +
    elBrainContentID +
    `-tags-content-active-tags-list">
    </div>
    <div class="brain-flex">
      <div class="hey-brain-main input-clear" style="position:absolute; right: 20px; margin-top: 12px;font-size: 16px;cursor: pointer; display: none;" id="` +
    elBrainContentID +
    `-tags-content-tag-input-clear">
        <img src="` +
    chrome.runtime.getURL("assets/images/tag-input-clear.png") +
    `" width="24" height="24" alt="tag-input-clear"/>
      </div>
      <input type="text" id="` +
    elBrainContentID +
    `-tags-content-input" 
      class="brain-flex-grow px-6  rounded-full" 
      style="margin-bottom: 20px; background: white; width: 378px; height: 48px; font-size:14px; border:none;"
      placeholder="add new tag" />
    </div>
    <div style="font-size:16px; font-weight:700;">Suggestions</div>
    <div class="brain-flex brain-flex-grow brain-flex-wrap" style="align-content: baseline;" id="` +
    elBrainContentID +
    `-tags-content-suggested">
    
    </div>
    <a href="https://heybrain.ai/` + createPeaceOfLink() + `" target="_blank" style="color: #2B007B; text-decoration: underline; font-weight:400; font-size:14px;">view all tags</a>
  `;

  document.getElementById(elBrainContentID).innerHTML = "";
  document.getElementById(elBrainContentID).appendChild(tabContent);
  fillTagsContent();
  document
    .getElementById(elBrainContentID + "-tags-content-input")
    .addEventListener("keydown", tagInputKeydown, false);
  document
    .getElementById(elBrainContentID + "-tags-content-input")
    .addEventListener("keyup", tagInputKeyup, false);
  document
    .getElementById(elBrainContentID + "-tags-content-tag-input-clear")
    .addEventListener("click", onResetTagInput, false);

  if (pageTagsSuggestions.length > 0) {
    fillSuggestionsContent();
  } else {
    if (document.getElementById(elBrainContentID + "-tags-content-suggested")) {
      document.getElementById(
        elBrainContentID + "-tags-content-suggested"
      ).innerHTML =
        "<p class='text-xs text-gray-500 text-center w-full'>Loading suggestions..</p>";
    }
    chrome.runtime.sendMessage(
      {
        action: "suggested-tags",
        data: {
          id: pageData.id,
          access_token: accessToken,
        },
      },
      (response) => {
        if (response) {
          Object.keys(response.response).forEach((key) => {
            var r = response.response[key];
            r.local_type = "suggested";
            pageTagsSuggestions.push(r);
          });
          let tagsContentSuggestedEl = document.getElementById(
            elBrainContentID + "-tags-content-suggested"
          );
          if (tagsContentSuggestedEl) {
            tagsContentSuggestedEl.innerHTML = "";
          }
          fillSuggestionsContent();
        }
      }
    );
  }

  //  not to affect content in browser while typing tags
    document.getElementById( elBrainContentID + "-tags-content-input").addEventListener('keydown', function(e) {
          e.stopPropagation();
    });

  loadRecommendedTags();
};

const tagInputKeydown = (e) => {
  if (e.keyCode === 13) {
    // if enter key
    const el = document.getElementById(
      elBrainContentID + "-tags-content-input"
    );
    const tag = el.value.trim();
    if (tag.length === 0) return;
    addTag(tag);
    el.value = "";
  } else {
  }
};

const tagInputKeyup = (e) => {
  if (e.keyCode === 13) {
    // if enter key
    return;
  } else {
    const el = document.getElementById(
      elBrainContentID + "-tags-content-input"
    );
    const tag = el.value.trim();
    if (tag.length === 0) {
      fillSuggestionsContent();
      document.getElementById(
        elBrainContentID + "-tags-content-tag-input-clear"
      ).style.display = "none";
      return;
    } else {
      document.getElementById(
        elBrainContentID + "-tags-content-tag-input-clear"
      ).style.display = "initial";
    }
    if (document.getElementById(elBrainContentID + "-tags-content-suggested")) {
      document.getElementById(
        elBrainContentID + "-tags-content-suggested"
      ).innerHTML =
        "<p class='text-xs text-gray-500 text-center w-full'>Loading autocomplete..</p>";
    }
    chrome.runtime.sendMessage(
      {
        action: "autocomplete-tags",
        data: {
          access_token: accessToken,
          query: tag,
        },
      },
      (response) => {
        if (response) {
          fillAutoCompleteContent(response.response);
        } else {
          if (
            document.getElementById(
              elBrainContentID + "-tags-content-suggested"
            )
          ) {
            document.getElementById(
              elBrainContentID + "-tags-content-suggested"
            ).innerHTML = "";
          }
        }
      }
    );
  }
};

const onResetTagInput = () => {
  document.getElementById(elBrainContentID + "-tags-content-input").value = "";
  fillSuggestionsContent();
  document.getElementById(
    elBrainContentID + "-tags-content-tag-input-clear"
  ).style.display = "none";
};

const addTag = (tag) => {
  if (tag.length > 25) {
    document.getElementById(elBrainContentID + "-tags-content-input").placeholder  ='the tag should be no more than 25 characters';
    document.getElementById(elBrainContentID + "-tags-content-input").classList.add('placeholder-red');
    setTimeout(() => {
      document.getElementById(elBrainContentID + "-tags-content-input").placeholder  ='add new tag';
      document.getElementById(elBrainContentID + "-tags-content-input").classList.remove('placeholder-red');
      onResetTagInput();
    }, 2000 );
    return;
  } else {
  const tags = pageData.tags;
  tags.push(tag);
  tags.forEach((tag) => {
    const t = tag.trim();
    if (t.length > 0 && pageData.tags.indexOf(t) === -1) {
      pageData.tags.push(t);
    }
  });
  fillTagsContent();
  document.getElementById(elBrainContentID + "-tags-content-input").value = "";
  document.getElementById(
    elBrainContentID + "-tags-content-tag-input-clear"
  ).style.display = "none";
  if (pageData.tags.length > 0 || pageData.notes.length > 0 && pageData.notes!==" ") {
    drawBrainWithMarker();
  }
  chrome.runtime.sendMessage(
    {
      action: "add-tags",
      data: {
        access_token: accessToken,
        id: pageData.id,
        tags: [tag],
      },
    },
    (response) => {
      if (response) {
        fillSuggestionsContent();
        loadRecommendedTags();
      }
    }
  );
  }
};

const removeTag = (e) => {
  const el = e.target;
  const idx = el.attributes["idx"].value;
  if (idx === undefined) {
    return;
  }

  const tags = pageData.tags;
  const tag = document.getElementById("tag-item-" + idx).innerText;
  const index = tags.indexOf(tag);
  if (index > -1) {
    tags.splice(index, 1);
  }
  pageData.tags = tags;
  // natalia 17.04


  fillTagsContent();



  chrome.runtime.sendMessage(
    {
      action: "remove-tags",
      data: {
        access_token: accessToken,
        id: pageData.id,
        tags: [tag],
      },
    },
    (response) => {
      if (response) {
        fillSuggestionsContent();
        loadRecommendedTags();
       
      }
    }
  );
  console.log(pageData.tags.length);
  console.log(pageData.notes);
  if (pageData.tags.length  === 0 && (pageData.notes.length === 0 || pageData.notes === " ")) {
    drawBrainWithHands();
}// natalia 17.04

};

const loadRecommendedTags = () => {
  if (pageData.tags.length === 0 ) {
    return;
  }
  chrome.runtime.sendMessage(
    {
      action: "recommended-tags",
      data: {
        id: pageData.id,
        access_token: accessToken,
      },
    },
    (response) => {
      if (response) {
        pageTagsRecommendations = [];
        Object.keys(response.response).forEach((key) => {
          var r = response.response[key];
          r.local_type = "recommended";
          pageTagsRecommendations.push(r);
        });
        fillSuggestionsContent();
      }
    }
  );
};

const createPeaceOfLink = () => {
  const tags = pageData.tags;
  let peace = '';
  for (let i = 0; i < (tags.length-2); i++) {
     peace += `${tags[i]} %2C `;
  }

  peace += tags[tags.length-1];
  if (tags.length === 0){
    peace = '';
  }
  return peace;
}


const fillTagsContent = () => {
  const tags = pageData.tags;
  if (tags.length === 0) {
    document.getElementById(
      elBrainContentID + "-tags-content-active-tags-list"
    ).innerHTML = "";
    var emptyStateHTML = "";
    emptyStateHTML +=
      '<div class="brain-flex brain-flex-col items-center justify-center text-md font-semibold" style="align-self: center;width: 100%;height: 100%;">';
    emptyStateHTML += "<p style='margin-bottom: 0px;'>No tags yet 😔</p>";
    emptyStateHTML +=
      "<p class='font-normal text-gray-500'>Add tags from our suggestions</p>";
    emptyStateHTML += "</div>";
    document.getElementById(
      elBrainContentID + "-tags-content-active-tags-list"
    ).innerHTML = emptyStateHTML;
    return;
  }
  var tagsHTML = "";
  tags.forEach((tag, index) => {
    tagsHTML +=
      '<div class="hey-brain-main brain-flex brain-flex-row items-center justify-center px-2 py-1 space-x-1 mr-1 mb-1 text-sm rounded-full" style="background-color: #E7E8FC; height:24px; font-weight: 600; font-size: 12px;">';
    tagsHTML += '<div class="hey-brain-main brain-flex-shrink-0"><img src="';
    tagsHTML += chrome.runtime.getURL("assets/images/tag.png");
    tagsHTML += '"alt="tag"/></div>';
    tagsHTML += "<div id='tag-item-" + index + "'>" + tag + "</div>";
    tagsHTML +=
      '<div class="hey-brain-main brain-flex-shrink-0 cursor-pointer remove-tag-item" id="tag-remove-item-id-' +
      index +
      '"><img idx="' +
      index +
      '" src="';
    tagsHTML += chrome.runtime.getURL("assets/images/tag-remove.png");
    tagsHTML += '"alt="tag-remove"/></div>';
    tagsHTML += "</div>";
    
  });
  document.getElementById(
    elBrainContentID + "-tags-content-active-tags-list"
  ).innerHTML = tagsHTML;

  // remove tag item remove click listener
  if (document.getElementsByClassName("remove-tag-item").length > 0) {
    Array.from(document.getElementsByClassName("remove-tag-item")).forEach(
      (el) => {
        el.removeEventListener("click", removeTag, false);
      }
    );
  }

  // add tag item remove click listener
  if (document.getElementsByClassName("remove-tag-item").length > 0) {
    Array.from(document.getElementsByClassName("remove-tag-item")).forEach(
      (el) => {
        el.addEventListener("click", removeTag, false);
      }
    );
  }
};

const fillSuggestionsContent = () => {
  let tagsContentSuggestedEl = document.getElementById(
    elBrainContentID + "-tags-content-suggested"
  );
  if (!tagsContentSuggestedEl) {
    return;
  }

  const el = document.getElementById(elBrainContentID + "-tags-content-input");
  if (el.value.length > 0) {
    return;
  }

  tagsContentSuggestedEl.innerHTML = "";

  if (
    pageTagsSuggestions.length === 0 &&
    pageTagsRecommendations.length === 0
  ) {
    return;
  }

  var combined = [...pageTagsRecommendations];
  var i = 0;
  var k = 2;
  while (i < pageTagsSuggestions.length) {
    if (combined[k] !== undefined) {
      combined.splice(k, 0, pageTagsSuggestions[i]);
      k += 3;
    } else {
      combined.push(pageTagsSuggestions[i]);
    }
    i++;
  }

  Object.keys(combined).forEach((key, index) => {
    const item = combined[key];
    const tag = item.id;

    if (pageData.tags.indexOf(tag) === -1) {
      var bgColor =
        item.kind && item.kind === "recommended" ? "#6CF7D3" : "#82EBFC";
      var iconSrc =
        item.kind && item.kind === "recommended" ? "tag" : "tag-suggestion";
        "tag";
      if (item.local_type && item.local_type === "recommended") {
        bgColor = "#6CF7D3";
        iconSrc = "tag";
      }

      const el = document.createElement("div");
      el.className =
        "brain-flex brain-flex-row items-center justify-center px-2 py-1 space-x-1 mr-1 mb-1 text-sm rounded-full cursor-pointer tag-suggestion-item-" +
        index;
      el.style.backgroundColor = bgColor;
      el.style.height = "24px";
      el.innerHTML =
        '<div class="brain-flex-shrink-0" style="font-weight: 600; font-size: 12px;"><img src="' +
        chrome.runtime.getURL("assets/images/" + iconSrc + ".png") +
        '"alt="icon"/></div>';
      el.innerHTML += "<div style='font-weight: 600; font-size: 12px;'>" + tag + "</div>";
      el.addEventListener("click", (e) => {
        addTag(tag);
      });
      document
        .getElementById(elBrainContentID + "-tags-content-suggested")
        .appendChild(el);
    }
  });
};

const fillAutoCompleteContent = (items) => {
  const el = document.getElementById(elBrainContentID + "-tags-content-input");
  if (el.value.length === 0) {
    return;
  }

  document.getElementById(
    elBrainContentID + "-tags-content-suggested"
  ).innerHTML = "";

  Object.keys(items).forEach((key, index) => {
    const item = items[key];
    const tag = item.id ? item.id : item;
    if (pageData.tags.indexOf(tag) === -1) {
      var bgColor =
        item.kind && item.kind === "recommended" ? "#6CF7D3" : "#82EBFC";
      var iconSrc =
        // item.kind && item.kind === "recommended" ? "tag" : "tag-suggestion";
        "tag";

      const el = document.createElement("div");
      el.className =
        "brain-flex brain-flex-row items-center justify-center px-2 py-1 space-x-1 mr-1 mb-1 text-sm font-medium rounded-full cursor-pointer tag-suggestion-item-" +
        index;
      el.style.backgroundColor = bgColor;
      el.style.height = "24px";
      el.innerHTML =
        '<div class="brain-flex-shrink-0"><img src="' +
        chrome.runtime.getURL("assets/images/" + iconSrc + ".png") +
        '"alt="icon"/></div>';
      el.innerHTML += "<div>" + tag + "</div>";
      el.addEventListener("click", (e) => {
        addTag(tag);
      });
      document
        .getElementById(elBrainContentID + "-tags-content-suggested")
        .appendChild(el);
    }
  });
};

// tab tags content --end

// tab notes content --start
const createNotesContent = () => {
  let tabContent = document.createElement("div");
  tabContent.id = elBrainContentID + "-notes-content";
  tabContent.style.position = "relative";
  tabContent.style.height = "100%";

  const favIcon = `
    <div>
      <img src="${pageData.favicon_url}" width="16" height="16" alt="favIcon"/>
    </div>
  `;

  const title =
    pageData.title.length > 35
      ? pageData.title.substring(0, 35) + "..."
      : pageData.title;

  tabContent.innerHTML =
    `
      <div class="brain-flex brain-flex-col space-y-2 h-full">
        <div class="brain-flex brain-flex-row space-x-2">
      ` +
    favIcon +
    `
          <div class="font-semibold">` +
    title +
    `
          </div>
        </div>
        <div class="brain-flex brain-flex-grow fields"  style="overflow: hidden;">
          <textarea class="w-full h-full border border-gray-100 rounded-lg p-2 text-md" style="background: white;" id="` +
    elBrainContentID +
    `-notes-textarea"></textarea>
        </div>
        <div class="brain-flex brain-flex-row space-x-2 items-center">
        <a href="https://heybrain.ai/?filter=modified_urls" target="_blank" style="color: #2B007B; font-weight:400; font-size:14px; text-decoration:";>view all notes</a>
          <div class="brain-flex-grow" id="` +
    elBrainContentID +
    `-notes-footer">
          </div>
    
            <div>
            <button class="save-button py-2 text-white font-semibold rounded-full text-xs"  id="` +
      elBrainContentID +
      `-notes-share-button">
                  SHARE
                </button>
            </div>
  
              <div>
                <button class=" save-button py-2 text-white font-semibold rounded-full text-xs " id="` +
    elBrainContentID +
    `-notes-save-button">
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
  `;

  document.getElementById(elBrainContentID).innerHTML = "";
  document.getElementById(elBrainContentID).appendChild(tabContent);
  
  // not to affect content in browser while typing notes
  tabContent.addEventListener("keydown", (e) => {
    e.stopPropagation();
  });

  // save notes button click listener
  document
    .getElementById(elBrainContentID + "-notes-save-button")
    .addEventListener("click", saveNotes, false);

  // notes wysiwyg editor
  simpleEditor.init({
    selector: ".fields textarea",
    pastePlain: true,
  });

  if (pageData.notes_html) {
    document.querySelector(".hey-brain-main.text").innerHTML = pageData.notes_html;
  }
};

const saveNotes = () => {
  simpleEditor.save();
  // NEW 2023-05-09
  if (document.querySelector(".hey-brain-main.text") != null)
  {   
    let notes = document.querySelector(".hey-brain-main.text").innerText !='' 
              ? document.querySelector(".hey-brain-main.text").innerText
              : ' ';                          // NEW 2023-05-10
    let notes_html = document.querySelector(".hey-brain-main.text").innerHTML!='' 
              ? document.querySelector(".hey-brain-main.text").innerHTML
              : ' ';                          // NEW 2023-05-10;
 
  if (
    document.getElementById(elBrainContentID + "-notes-save-button")
      .innerText === "SAVING"
  ) {
    return;
  }

  document.getElementById(elBrainContentID + "-notes-save-button").innerText =
    "SAVING";
  chrome.runtime.sendMessage(
    {
      action: "update-notes",
      data: {
        access_token: accessToken,
        id: pageData.id,
        notes: notes,
        notes_html: notes_html,
      },
    },
    (response) => {
      // console.log(response);
      if (response) {
        pageData.notes = notes;

       pageData.notes === " " && pageData.tags.length === 0 ? drawBrainWithHands() : drawBrainWithMarker();
          
        pageData.notes_html = notes_html;
        document.getElementById(
          elBrainContentID + "-notes-save-button"
        ).innerText = "SAVE";
        document.getElementById(
          elBrainContentID + "-notes-footer"
        ).innerHTML = `<div class="text-xs text-green-600">Saved.</div>`;
        setTimeout(() => {
          document.getElementById(
            elBrainContentID + "-notes-footer"
          ).innerHTML = "";
        }, 2000);
      }
    }
  
  );
  }  /// NEW 2023-05-09
};
// tab notes content --end

// tab content related actions --end

// listeners --start
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

  /// NEW 2023-05-14
  if (request.action === "save_notes") 
    if (tabID = tabThirdItemID) 
      if (waitForAutosave) {
        if (AutoSaveTimer) clearTimeout(AutoSaveTimer); 
        waitForAutosave = false
        saveNotes()
    }
  /// end new

  if (request.action === "init") {
    chrome.storage.local.get(["access_token"], (data) => {
      if (data.access_token) {
        accessToken = data.access_token;
        init();
      }
    });
  } else if (request.action === "deinit") {
    if (document.getElementById("hey-brain-drawer") !== null) {
      document.body.removeChild(document.getElementById(elBrainDrawerID));
    }
    if (document.getElementById("hey-brain-root") !== null) {
      document.body.removeChild(document.getElementById(elBrainRootID));
    }
    if (document.getElementById("hey-brain-root") !== null) {
      // 2023-03-20 Added by Stanislav
      document.body.removeChild(
        document.getElementById(elBrainRootDismissButton)
      );
    }
  } else if (request.action === "smartpast-selected") {
    selectedText = request.text;
    getSmartpastContent().then((data) => {
      createSmartpastContent(data);
    });

  }
});

if (document.readyState !== "complete") {
  window.addEventListener("load", afterWindowLoaded);
} else {
  afterWindowLoaded();
}

function afterWindowLoaded() {}

// listeners --end
