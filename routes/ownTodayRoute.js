const express = require("express");
const router = express.Router();
const ownController = require("../controllers/ownTodayController");

router.get("/own-today/:id", ownController.builOwnToday);

router.get("/special/:id", ownController.builOwnTodayForDelorean);

router.post("/confirm-purchase/:id", ownController.confirmPurchase)

router.post("/confirm-purchase-delorean/:id", ownController.confirmDelorean)

module.exports = router;
