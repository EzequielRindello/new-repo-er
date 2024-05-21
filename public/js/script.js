// password hide/show funtion
document.addEventListener("DOMContentLoaded", function () {
  const passwordBtn = document.getElementById("password-btn");
  const form = document.querySelector("#updateForm");

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
});
