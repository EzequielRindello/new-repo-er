const utilities = require("../utilities");
const accountModel = require("../models/management-model")

/* ***************************
 *  Build management view
 * ************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  });
}
/* ***************************
 *  Build management New Classification
 * ************************** */
async function buildNewClassification(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/classification", {
    title: "New Classification",
    nav,
    errors: null,
  });
}
/* ***************************
 *  Build management New Vehicle
 * ************************** */
async function buildNewVehicle(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/vehicle", {
    title: "New Vehicle",
    nav,
    errors: null,
  });
}
/* ****************************************
 *  Process Classification
 * *************************************** */
async function registerClassification(req, res) {
  let nav = await utilities.getNav();
  const {
    classification_name
  } = req.body;

  const regResult = await accountModel.registerAccount(
    classification_name
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${classification_name}.`
    );
    res.status(201).render("./account/classification", {
      title: "New Classification",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./account/classification", {
      title: "New Classification",
      nav,
    });
  }
}

module.exports = {
  buildManagement,
  buildNewClassification,
  buildNewVehicle,
  registerClassification,
};
