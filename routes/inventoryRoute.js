// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const invController = require("../controllers/invController");
const managementModel = require("../models/management-model");
const regValidate = require("../utilities/register-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/edit/:inv_id", invController.editInventoryView);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// post routes
router.post("/update/", invController.updateInventory)

module.exports = router;
