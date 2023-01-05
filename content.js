chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "init") {
    let elem = document.createElement("div");
    elem.id = "hey-brain-drawer";
    elem.style.position = "fixed";
    elem.style.bottom = "375px";
    elem.style.right = "-32px";
    elem.style.width = "80px";
    elem.style.height = "80px";
    elem.style.zIndex = "99999999999";
    elem.style.cursor = "pointer";
    elem.onclick = () => {
      // chrome.runtime.sendMessage({ action: "open-drawer" });
      alert("clicked");
    };

    let image = document.createElement("img");
    image.src = chrome.runtime.getURL("assets/icons/brain-drawer-160.png");
    image.style.width = "80px";
    image.style.height = "80px";
    elem.appendChild(image);

    document.body.appendChild(elem);
    // const metadata = await fetchMetadata(sender.tab.url);
    // sendResponse(metadata);
  }
});
