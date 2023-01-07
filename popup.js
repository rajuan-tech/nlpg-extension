const baseURL = "https://api.nlpgraph.com/stage/api";

function loadUser() {
  chrome.storage.local.get(["user"], (data) => {
    if (data.user) {
      const user = JSON.parse(data.user);
      document.getElementById("user-username").innerHTML = user.username;
      document.getElementById("user-email").innerHTML = user.email;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  //TODO: Maybe a tiny loader, while fetching access_token?
  document.getElementById("sign-in").style.display = "none";
  document.getElementById("sign-up").style.display = "none";
  document.getElementById("signed-in").style.display = "none";

  // Check if user is logged in
  chrome.storage.local.get(["access_token", "user"], (data) => {
    if (data.access_token) {
      document.getElementById("sign-in").style.display = "none";
      document.getElementById("sign-up").style.display = "none";
      document.getElementById("signed-in").style.display = "flex";
      loadUser();
    } else {
      document.getElementById("sign-in").style.display = "flex";
      document.getElementById("signed-in").style.display = "none";
    }
  });

  // Sign in, up & out actions.
  var signOut = document.getElementById("sign-out-button");
  signOut.addEventListener("click", function () {
    // localStorage.removeItem("access_token");
    // save access token to chrome storage
    chrome.storage.local.set({
      access_token: null,
      user: null,
    });
    document.getElementById("sign-in").style.display = "flex";
    document.getElementById("sign-up").style.display = "none";
    document.getElementById("signed-in").style.display = "none";
  });

  var showSignInButton = document.getElementById("show-sign-in-button");
  showSignInButton.addEventListener("click", function () {
    document.getElementById("sign-in").style.display = "flex";
    document.getElementById("sign-up").style.display = "none";
  });

  var showSignUpButton = document.getElementById("show-sign-up-button");
  showSignUpButton.addEventListener("click", function () {
    document.getElementById("sign-in").style.display = "none";
    document.getElementById("sign-up").style.display = "flex";
  });

  var signInButton = document.getElementById("sign-in-button");
  signInButton.addEventListener("click", function () {
    const signingInText = "SIGNING YOU IN...";
    if (signInButton.innerHTML == signingInText) {
      return;
    }
    var email = document.getElementById("sign-in-email");
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
      if (req.readyState == 4 && req.status == 200) {
        const response = JSON.parse(req.responseText);
        // // save accessToken to local storage
        // localStorage.setItem("access_token", response.response.accessToken);
        // // save user json to local storage
        // localStorage.setItem("user", JSON.stringify(response.response.user));
        // save access token to chrome storage
        chrome.storage.local.set({
          access_token: response.response.accessToken,
          user: JSON.stringify(response.response.user),
        });
        // hide sign in form
        document.getElementById("sign-in").style.display = "none";
        // signed in form
        document.getElementById("signed-in").style.display = "flex";
        // load user
        loadUser();
      } else {
        email.disabled = false;
        password.disabled = false;
        signInButton.disabled = false;
        signInButton.innerHTML = "SIGN IN";
      }
    };
    // End of sign in, up & out actions.
  }); // End of sign in button event listener.
}); // End of DOMContentLoaded event listener.
