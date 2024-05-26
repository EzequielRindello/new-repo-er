// Needed Resources
const express = require("express");
const router = new express.Router();
const accController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accController.buildLogin));

router.get("/register", utilities.handleErrors(accController.buildRegister));

router.get("/edit", utilities.handleErrors(accController.buildEdit));

// Account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accController.buildAccountManagement)
);

router.get("/logout", (req, res) => {
  console.log("Logout route hit");
  res.clearCookie("jwt");
  console.log("JWT cookie cleared");
  res.redirect("/?logout=true");
});

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
);

router.post("/updatedata", utilities.handleErrors(accController.updateAccount));

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
);

module.exports = router;
