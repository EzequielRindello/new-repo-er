const ownModel = require("../models/own-today-model");
const utilities = require("../utilities/index");

const ownCont = {};

ownCont.builOwnToday = async function (req, res, next) {
  let nav = await utilities.getNav();
  //veryfy if client is loggin, if not redirect to login with message: You need to login in order to buy a car
  if (req.cookies.account_type) {
    // get vehicle requested data and acc data
    const vehicleId = req.params.id;
    const email = req.cookies.account_email;
    const vehicleData = await ownModel.getCarById(vehicleId);
    const accData = await ownModel.getAccountByEmail(email);
    const grid = await utilities.buildOwnGrid(accData, vehicleData[0]);
    res.render("./inventory/own-today", {
      title: "Please review the data carefully before proceeding",
      grid: grid,
      nav,
    });
  } else {
    res.render("./account/login", {
      title: " Please login in order to buy a car :)",
      nav,
    });
  }
};

ownCont.builOwnTodayForDelorean = async function (req, res, next) {
  let nav = await utilities.getNav();
  //veryfy if client is loggin, if not redirect to login with message: yYou need to login in order to buy a car
  if (req.cookies.account_type) {
    // get vehicle requested data and acc data
    const vehicleData = await ownModel.getDelorean();
    const email = req.cookies.account_email;
    const accData = await ownModel.getAccountByEmail(email);
    const grid = await utilities.buildOwnGrid(accData, vehicleData[0]);
    res.render("./inventory/own-today", {
      title: "Please review the data carefully before proceeding",
      grid: grid,
      nav,
    });
  } else {
    res.render("./account/login", {
      title: "Did you just try to buy a DeLorean without an account?",
      nav,
    });
  }
};

ownCont.confirmPurchase = async function (req, res, next) {
  res.redirect("/");
};

module.exports = ownCont;
