// password hide/show funtion
document.addEventListener("DOMContentLoaded", function () {
  const passwordBtn = document.getElementById("password-btn");
  const form = document.querySelector("#updateForm");

  function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  if (passwordBtn != null) {
    passwordBtn.addEventListener("click", () => {
      const passwordInput = document.getElementById("pword");
      const type = passwordInput.getAttribute("type");

      if (type == "password") {
        passwordInput.setAttribute("type", "text");
      } else {
        passwordInput.setAttribute("type", "password");
      }
    });
  }

  if (form != null) {
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button");
      updateBtn.removeAttribute("disabled");
    });
  }

  let accountType = "";
  accountType = getCookie("account_type");

  window.removeAccountType = function () {
    document.cookie =
      "account_type=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    accountType = undefined;
    document.getElementById("log-out").style.display = "none";
  };

  function checkLogout() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("logout") === "true") {
      window.removeAccountType();
    }
  }

  if (
    accountType === "Admin" ||
    accountType === "Employee" ||
    accountType === "Client"
  ) {
    try {
      document.getElementById("log-out").style.display = "block";
      document.getElementById("call-to-action").style.display = "block";
      document.getElementById("call-to-action").href = "/account";
    } catch (error) {
      console.warn;
    }
  }

  if (accountType === "Admin" || accountType === "Employee") {
    try {
      document.getElementById("credentials").style.display = "block";
    } catch (error) {
      console.warn;
    }
  }

  window.onload = checkLogout;
});
