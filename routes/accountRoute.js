// Needed Resources
const express = require("express");
const router = new express.Router();
const accController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accController.buildLogin));

router.get("/register", utilities.handleErrors(accController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
);

module.exports = router;
