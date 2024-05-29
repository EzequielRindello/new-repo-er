// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const invController = require("../controllers/invController");
const deloreanControler = require("../controllers/deloreanControler");
const managementModel = require("../models/management-model");
const regValidate = require("../utilities/register-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/edit/:inv_id", invController.editInventoryView);
router.get("/delete/:inv_id", invController.deleteView);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get("/delorean",deloreanControler.buildDeloreanDetail);

// post routes
router.post("/update/", invController.updateInventory);
router.post("/delete/", invController.deleteItem);

module.exports = router;
