// password hide/show funtion
document.addEventListener("DOMContentLoaded", function () {
  const passwordBtn = document.getElementById("password-btn");

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
});
