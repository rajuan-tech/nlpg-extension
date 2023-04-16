const baseURL = "https://api.nlpgraph.com/stage/api";
var isLoggedIn = false;

document.addEventListener("DOMContentLoaded", function () {
  // replaced here 2023-03-22
function loadUser() {
  chrome.storage.local.get(["user"], (data) => {
    if (data.user) {
      const user = JSON.parse(data.user);
      document.getElementById("user-username").innerHTML = user.username;
      document.getElementById("user-username-2").innerHTML = user.username; /// Added 2023-03-20 by Stanislav
      // document.getElementById("user-email").innerHTML = user.email; // NATALIA CODE
      checkBlackList();
        // console.log('loadUser')
    }
  });
}

  //to delete synchistory button if it was pushed once, and adjust the popup main page:
  chrome.storage.local.get(["synchistory"]).then((result) => {
    if (result.synchistory) {
      document.querySelector(".sync-history").style.visibility = "hidden";
      document.querySelector("div.snooze.popup-flex").style.top = "75px";
      document.querySelector("div.block-the-page.popup-flex").style.top =
        "125px";
    }
  });

  const switchButton = document.querySelector(
    '.logo-switch input[type="checkbox"]'
  );
  checkSetting(); // required to check toggle's condition after refresh app

  //TODO: Maybe a tiny loader, while fetching access_token?
  document.getElementById("sign-in").style.display = "none";
  document.getElementById("sign-up").style.display = "none";
  document.getElementById("signed-in").style.display = "none";
  document.getElementById("heybrain-settings").style.display = "none"; /// 2023-03-13 Added by Stanislav
  document.getElementById("heybrain-blocked").style.display = "none"; /// 2023-03-19 Added by Stanislav

  // Check if user is logged in
  chrome.storage.local.get(["access_token", "user"], (data) => {
    if (data.access_token) {
      document.getElementById("sign-in").style.display = "none";
      document.getElementById("sign-up").style.display = "none";
      document.getElementById("signed-in").style.display = "flex";
      document.getElementById("heybrain-settings").style.display = "none"; /// 2023-03-13 Added by Stanislav
      document.getElementById("heybrain-blocked").style.display = "none"; /// 2023-03-19 Added by Stanislav
      loadUser();
    } else {
      document.getElementById("sign-in").style.display = "flex";
      document.getElementById("signed-in").style.display = "none";
      document.getElementById("heybrain-settings").style.display = "none"; /// 2023-03-13 Added by Stanislav
      document.getElementById("heybrain-blocked").style.display = "none"; /// 2023-03-19 Added by Stanislav
    }
  });

  // Sign in, up & out actions.

  // Added on 2023-03-30 by Stanislav ------------------------------------------------------------
  function signOutClick() {
    // localStorage.removeItem("access_token");
    // save access token to chrome storage
    chrome.storage.local.set({
      access_token: null,
      user: null,
    });

    document.getElementById("sign-in").style.display = "flex";
    document.getElementById("sign-up").style.display = "none";
    document.getElementById("signed-in").style.display = "none";
    document.getElementById("heybrain-settings").style.display = "none"; /// 2023-03-13 Added by Stanislav
    document.getElementById("heybrain-blocked").style.display = "none"; /// 2023-03-19 Added by Stanislav

    //to turn off the app
    switchButton.checked = false; // NATALIA code:after sign out toggle is always off
    storeSetting(); // NATALIA code:after sign out toggle is always off
    checkSetting(); // NATALIA code:after sign out toggle is always off
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { message: "deinit" });
      });
    });
  }

  // END of Adding 2023-03-20 ----------------------------------------------------------------

  // Modified on 2023-03-20 by Stanislav

  document
    .getElementById("sign-out-button")
    .addEventListener("click", signOutClick);
  document
    .getElementById("sign-out-button-2")
    .addEventListener("click", signOutClick);

  /// end of modification 2023-03-20

  var showSignInButton = document.getElementById("show-sign-in-button");
  showSignInButton.addEventListener("click", function () {
    document.getElementById("sign-in").style.display = "flex";
    document.getElementById("sign-up").style.display = "none";
    document.getElementById("heybrain-settings").style.display = "none"; /// 2023-03-13 Added by Stanislav
    document.getElementById("heybrain-blocked").style.display = "none"; /// 2023-03-19 Added by Stanislav
  });

  var showSignUpButton = document.getElementById("show-sign-up-button");
  showSignUpButton.addEventListener("click", function () {
    document.getElementById("sign-in").style.display = "none";
    document.getElementById("sign-up").style.display = "flex";
    document.getElementById("heybrain-settings").style.display = "none"; /// 2023-03-13 Added by Stanislav
    document.getElementById("heybrain-blocked").style.display = "none"; /// 2023-03-19 Added by Stanislav
  });

  var signInButton = document.getElementById("sign-in-button"); // sign in button

  // NASTYA'S CODING FOR ALERT WINDOWS ----------------------------------------------------------------
  let dialogoverlay = document.getElementById("dialogoverlay");
  let dialogbox = document.getElementById("dialogbox");
  let dialogboxbody = document.getElementById("dialogboxbody");
  dialogbox.style.display = "none";
  let btnOk = document.getElementById("dialogboxfoot");

  function alertWinow(str) {
    dialogbox.style.display = "block";
    dialogoverlay.style.opacity = "0.1";
    dialogboxbody.innerHTML = str;
  }

  btnOk.addEventListener("click", function () {
    dialogbox.style.display = "none";
    dialogoverlay.style.opacity = "100%";
  });

  // NASTYA'S FINISHED CODING ----------------------------------------------------------

  signInButton.addEventListener("click", function () {
    const signingInText = "SIGNING YOU IN...";
    let alertShown = false; // Initialize flag to track whether the alert has been shown

    if (signInButton.innerHTML == signingInText) {
      return;
    }
    var email = document.getElementById("sign-in-username");
    var password = document.getElementById("sign-in-password");

    email.disabled = true;
    password.disabled = true;
    signInButton.disabled = true;
    signInButton.innerHTML = signingInText;

    var emailValue = email.value;
    var passwordValue = password.value;
    const req = new XMLHttpRequest();
    req.open("POST", baseURL + "/auth/login", true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(
      JSON.stringify({
        username: emailValue,
        password: passwordValue,
      })
    );
    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        if (req.status == 200) {
          const response = JSON.parse(req.responseText);
          chrome.storage.local.set({
            access_token: response.response.user.api_key,
            user: JSON.stringify(response.response.user),
          });
          // hide sign in form
          document.getElementById("sign-in").style.display = "none";
          // signed in form
          document.getElementById("signed-in").style.display = "flex";
          // load user
          loadUser();

          signInButton.innerHTML = "SIGN IN";
          email.disabled = false;
          password.disabled = false;
          signInButton.disabled = false;

          switchButton.checked = true; // NATALIA code:after sign toggle is always on
          storeSetting(); // NATALIA code:after sign toggle is always on
          checkSetting(); // NATALIA code:after sign toggle is always on
        } else if (!alertShown) {
          email.disabled = false;
          password.disabled = false;
          signInButton.disabled = false;
          signInButton.innerHTML = "SIGN IN";

          // alert("Wrong username or password, please try again");
          alertWinow("Wrong username or password, please try again");

          alertShown = true; // Set the flag to indicate that the alert has been shown
        }
      }
    };

    // End of sign in, up & out actions.
  }); // End of sign in button event listener.

  var signUpButton = document.getElementById("sign-up-button");
  signUpButton.addEventListener("click", function () {
    const signingUpText = "SIGNING YOU UP...";
    if (signUpButton.innerHTML == signingUpText) {
      return;
    }

    var username = document.getElementById("sign-up-username");
    var email = document.getElementById("sign-up-email");
    var password = document.getElementById("sign-up-password");
    var passwordConfirm = document.getElementById("sign-up-confirm-password");

    if (username.value == "") {
      // alert("Username is required.");

      alertWinow("Username is required.");
      return;
    }

    if (email.value == "") {
      alertWinow("Email is required.");
      return;
    }
    // Define the regular expression to match the email
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    // Check if the email meets the regular expression
    if (!emailRegex.test(email.value)) {
      // alert("Please enter a valid email address.");
      alertWinow("Please enter a valid email address.");
      return;
    }

    if (password.value == "") {
      // alert("Password is required.");
      alertWinow("Password is required.");

      return;
    }

    // Define the regular expression to match the password
    const regex =
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    // Check if the password meets the regular expression
    if (!regex.test(password.value)) {
      // alert(
      //   "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number or special character."
      // );
      alertWinow(
        "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number or special character."
      );
      return;
    }

    if (password.value !== passwordConfirm.value) {
      // alert("Passwords do not match.");
      alertWinow("Passwords do not match.");
      return;
    }

    username.disabled = true;
    email.disabled = true;
    password.disabled = true;
    passwordConfirm.disabled = true;
    signUpButton.disabled = true;
    signUpButton.innerHTML = signingUpText;

    var usernameValue = username.value;
    var emailValue = email.value;
    var passwordValue = password.value;
    const req = new XMLHttpRequest();
    req.open("POST", baseURL + "/auth/register", true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(
      JSON.stringify({
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        firstname: "",
        lastname: "",
      })
    );
    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        const response = JSON.parse(req.responseText);
        if (
          response.code === 200 &&
          response.data &&
          response.data.accessToken.length > 0 &&
          response.data.user &&
          response.data.user.api_key
        ) {
          chrome.storage.local.set({
            access_token: response.data.user.api_key,
            user: JSON.stringify(response.data.user),
          });
          // hide sign in form
          document.getElementById("sign-up").style.display = "none";
          // signed in form
          document.getElementById("signed-in").style.display = "flex";
          // load user
          loadUser();
        } else {
          username.disabled = false;
          email.disabled = false;
          password.disabled = false;
          passwordConfirm.disabled = false;
          signUpButton.disabled = false;
          signUpButton.innerHTML = "SIGN UP";
          alert(response.response);
        }
      } else {
        username.disabled = false;
        email.disabled = false;
        password.disabled = false;
        passwordConfirm.disabled = false;
        signUpButton.disabled = false;
        signUpButton.innerHTML = "SIGN UP";
      }
    };
  }); // End of sign up button event listener.

  const syncHistoryButton = document.querySelector(
    "div.sync-history.popup-flex"
  );

  syncHistoryButton.addEventListener("click", function () {
    const syncHistoryAlert = document.createElement("div");
    syncHistoryAlert.innerHTML = `
    <div id="sync-content" style="padding-top:50px; height:100%; width:100%; background-color:white;">
        <div id="sync-wrapper">
            <div style="display: flex; justify-content:center;">
               <img src="assets/icons/brain-with-marker.png" style="height:62px;text-align: center;margin-bottom:20px;">
            </div>
            <p style="text-align: center;">This operation can take a few hours.<br>
            Are you sure ?</p>
          
            <div class="buttons" style="display: flex; justify-content:space-evenly;">
                <button class="yes" style="box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); border:none;">YES</button>
                <button class="no" style="background-color: white;color:#6416f3; box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); border:none;">NO</button>
            </div>
            <p id="sync-process" style="text-align:center;"></p>
            <div style="display: flex; justify-content:center;">
                <button class="ok" style="display:none;box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); border:none;">OK</button>
            </div>
        </div>
    </div>`;
    syncHistoryAlert.style.zIndex = "999999";
    syncHistoryAlert.style.position = "absolute";
    syncHistoryAlert.style.background = "white";
    syncHistoryAlert.style.bottom = "0px";
    syncHistoryAlert.style.right = "0px";
    syncHistoryAlert.style.width = "100%";
    syncHistoryAlert.style.height = "100%";

    document.querySelector("div#signed-in").append(syncHistoryAlert);
    document.querySelector("button.no").addEventListener("click", () => {
      syncHistoryAlert.remove();
    });
    document.querySelector("button.ok").addEventListener("click", () => {
      syncHistoryAlert.remove();
    });

    const nonSyncText = "SYNCED SUCCESSFULLY";
    const syncText = "SYNCING...";
    const syncProcessText = document.querySelector("p#sync-process");

    document.querySelector("button.yes").addEventListener("click", () => {
      if (syncHistoryButton.checked == true) {
        return;
      }
      chrome.storage.local.get(["access_token", "user"], (data) => {
        syncProcessText.innerHTML = syncText;
        document.querySelector(".buttons").remove();
        document.querySelector("#sync-wrapper p").remove();

        chrome.runtime.sendMessage(
          {
            action: "sync-history",
            data: data,
          },
          (response) => {
            syncProcessText.innerHTML = `${nonSyncText} <br><br>
              This could take up to a few hours but this shouldn’t stop you from start using Brain!`;

            document.querySelector("button.ok").style.display = "block";
          }
        );
      });
      document.querySelector(".sync-history").style.visibility = "hidden"; // to hide sync-history block
      let removed = true;
      chrome.storage.local.set({ synchistory: removed });
    });
  }); // End of sync-history button event listener.

  switchButton.addEventListener("change", function () {
    storeSetting();
    checkSetting();
  }); // End of switchButton event listener.

  function storeSetting() {
    const isEnabled = switchButton.checked; //true or false
    const setting = { enabled: isEnabled };
    chrome.storage.local.set(setting);
  }

  function checkSetting() {
    chrome.storage.local.get(["enabled"]).then((result) => {
      const isEnabled = result.enabled;
      switchButton.checked = isEnabled;
    });
    chrome.storage.local.get(["timer"]).then((result) => {
      console.log("timer is switched on: " + result.timer);
      result.timer ? snoozeAlert.style.display = "flex" : snoozeAlert.style.display = "none";
    });
  }

  /// 2023-03-13 Added by Stanislav: BEGIN ----------------------------------------------------------------

  checkBlackList(); // ON EACH POPUP'S OPEN IF IT'S LOGGED IN

  let addpage_button = document.getElementById("addpage-button");
  let adddom_button = document.getElementById("adddom-button");
  let delpage_button = document.getElementById("delpage-button");
  let deldom_button = document.getElementById("deldom-button");
  let delpage_label = document.getElementById("page-is-blocked");
  let deldom_label = document.getElementById("domain-is-blocked");
  let kaputt_label = document.getElementById("wrong-page");

  function applyBlockToPopup(status) {
    if (status === 0) {
      document.getElementById("sign-in").style.display = "none";
      document.getElementById("sign-up").style.display = "none";
      document.getElementById("signed-in").style.display = "flex";
      document.getElementById("heybrain-settings").style.display = "none";
      document.getElementById("heybrain-blocked").style.display = "none";
    } else {
      document.getElementById("sign-in").style.display = "none";
      document.getElementById("sign-up").style.display = "none";
      document.getElementById("signed-in").style.display = "none";
      document.getElementById("heybrain-settings").style.display = "none";
      document.getElementById("heybrain-blocked").style.display = "flex";
    }
    applyBlackListButtons(status);
  }
  function doHide(obj) {
    if (!obj.classList.contains("hidden")) obj.classList.add("hidden");
  }
  function doUnHide(obj) {
    obj.classList.remove("hidden");
  }

  /// Changed 2023-03-20 by Stanislav --------------------------------------------------
  function applyBlackListButtons(status) {
    // console.log('BlackList status code: '+status)
    switch (status) {
      case -1:
        doHide(delpage_button);
        doHide(adddom_button);
        doHide(deldom_button);
        doHide(deldom_label);
        doHide(kaputt_label);
        doUnHide(delpage_label);
        break;
      case 1:
        doHide(deldom_label);
        doHide(deldom_button);
        doHide(kaputt_label);
        doUnHide(delpage_button);
        doUnHide(adddom_button);
        doUnHide(delpage_label);
        break;
      case 2:
        doHide(delpage_button);
        doHide(adddom_button);
        doHide(delpage_label);
        doHide(kaputt_label);

        doUnHide(deldom_label);
        doUnHide(deldom_button);
        break;
      case 0:
        doHide(delpage_button);
        doHide(adddom_button);
        doHide(deldom_button);
        doHide(deldom_label);
        doHide(delpage_label);
        doHide(delpage_label);

        doUnHide(kaputt_label);
        break;
      default:
        doHide(delpage_button);
        doHide(adddom_button);
        doHide(deldom_button);
        doHide(deldom_label);
        doHide(delpage_label);
        doHide(kaputt_label);
    }
  }

  /// END: Changed 2023-03-20 by Stanislav -----------------------------------------------

  function checkBlackList() {
    // console.log('--- DOING INIT OF BLACKLIST MENU ------');

    chrome.storage.local
      .get(["access_token", "heybrain_current_url"])
      .then((obj) => {
        if (!obj.access_token) return 0;

        let my_url = obj.heybrain_current_url;

        if (my_url === undefined || my_url === "") {
          applyBlockToPopup(-1);
          return 0;
        }

        let checkIsInBlacklist = new Promise((resolve) => {
          chrome.runtime.sendMessage(
            { action: "getBlackList", key: my_url },
            (response) => {
              // console.log('Page message recieved: '+ response.data);
              resolve(response.data);
            }
          );
        });

        let checkDomIsInBlacklist = new Promise((resolve) => {
          chrome.runtime.sendMessage(
            { action: "getBlackListDom", key: my_url },
            (response) => {
              // console.log('Dom message recieved: '+ response.data);
              resolve(response.data);
            }
          );
        });

        checkIsInBlacklist.then((inBlackListResponse) => {
          let isURLinBL = inBlackListResponse[0];
          checkDomIsInBlacklist.then((DomInBlackListResponse) => {
            let isDomInBL = DomInBlackListResponse[0];

            let black_list_state =
              isDomInBL > -1
                ? 2 // Domain is not in the blacklist
                : isURLinBL > -1
                ? 1 // Page is in the blacklist
                : 0; // Nothing is in the blacklist

            applyBlockToPopup(black_list_state);
          });
        });
      }); // getting end
    //  console.log('--- INIT OF BLACKLIST MENU IS DONE ------');
  }

  //  var GoSettingsButton = document.getElementById("heybrain-settings-button");

  //  GoSettingsButton.addEventListener("click", function () {
  //    document.getElementById("sign-in").style.display = "none";
  //    document.getElementById("sign-up").style.display = "none";
  //    document.getElementById("signed-in").style.display = "none";
  //    document.getElementById("heybrain-settings").style.display = "flex";
  //    // checkBlackList();
  //  });

  addpage_button.addEventListener("click", function () {
    chrome.storage.local.get(["heybrain_current_url"]).then((obj) => {
      let url = obj.heybrain_current_url;
      if (url !== null || url !== undefined || url !== "") {
        chrome.runtime.sendMessage(
          { action: "addPageToBlackList", key: url },
          (response) => {
            checkBlackList();
          }
        );
      }
    });
  });

  adddom_button.addEventListener("click", function () {
    chrome.storage.local.get(["heybrain_current_url"]).then((obj) => {
      let url = obj.heybrain_current_url;
      if (url !== null || url !== undefined || url !== "") {
        chrome.runtime.sendMessage(
          { action: "addDomainToBlackList", key: url },
          (response) => {
            checkBlackList();
          }
        );
      }
    });
  });

  delpage_button.addEventListener("click", function () {
    chrome.storage.local.get(["heybrain_current_url"]).then((obj) => {
      let url = obj.heybrain_current_url;
      if (url !== null || url !== undefined || url !== "") {
        chrome.runtime.sendMessage(
          { action: "delPageFromBlackList", key: url },
          (response) => {
            checkBlackList();
          }
        );
      }
    });
  });

  deldom_button.addEventListener("click", function () {
    chrome.storage.local.get(["heybrain_current_url"]).then((obj) => {
      let url = obj.heybrain_current_url;
      if (url !== null || url !== undefined || url !== "") {
        chrome.runtime.sendMessage(
          { action: "delDomainFromBlackList", key: url },
          (response) => {
            checkBlackList();
          }
        );
      }
    });
  });
  /// 2023-03-13 Added byStanislav: END ----------------------------------------------------------------

  ///2023-03-26 Added by Natalia START ----------------------------------------------------------------
  
  //   code to abort timer
  // chrome.storage.local.set({timer: false}); 

  const snoozeAlert = document.querySelector("#snooze-content");
  snoozeAlert.style.display = "none";
  const wakeupButton = document.querySelector("button#wakeup");
  const snoozeButton = document.querySelector("div.snooze.popup-flex");
  const timetext = document.querySelector("p#timetext");
  const delayInMinutes = 60;

  snoozeButton.addEventListener("click", () => {
    //initialize timer
 
    storeSetting();
    startTimer();
    chrome.runtime.sendMessage(
      {
        action: "timer",
        time: delayInMinutes,   // minutes
      },
    );
  });

  function startTimer() {
    //create alarm
    snoozeAlert.style.display = "flex";
    switchButton.checked = false;
    chrome.alarms.create("timerAlarm", { delayInMinutes: delayInMinutes }); // minutes
    chrome.storage.local.set({ timer: true });
  }

  function stopTimer() {
    //stop alarm
    snoozeAlert.style.display = "none";
    switchButton.checked = true;
    timetext.innerHTML = "";
    chrome.alarms.clear("timerAlarm");
    chrome.storage.local.set({ timer: false });
  }

  wakeupButton.addEventListener("click", () => {

    storeSetting();
    stopTimer()
    chrome.runtime.sendMessage(
      {
        action: "stop-timer",
      },
    );
    
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
  if (request.action === "remove-snooze-window") {// to remove snooze window if popup is opened
    snoozeAlert.style.display = "none";
    switchButton.checked = true;
    storeSetting();
    console.log('snooze alert removed')
  } else if (request.action === "render-timer") { // to display remaining time
    timetext.innerHTML = request.text;
  }
});

}); // End of DOMContentLoaded event listener.

chrome.runtime.connect({ name: "popup" }); // allows to BG to detect if popup is opened 
///2023-03-26 Added by Natalia END ----------------------------------------------------------------

