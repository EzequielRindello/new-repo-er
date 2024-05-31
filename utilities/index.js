const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};
/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data != undefined) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};
/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetailGrid = async function (data) {
  let grid = "";
  if (data !== undefined && data.length > 0) {
    grid += '<div class="detail-grid">';
    data.forEach((vehicle) => {
      grid += '<div class="detail-item">';
      grid += '<div class="image-container">';
      grid +=
        '<img src="' +
        vehicle.inv_image +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" />';
      grid += "</div>";
      grid += '<div class="details-container">';
      grid += "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + "</h2>";
      grid +=
        '<p class="price"><strong> Price: $' +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</strong></p>";
      grid +=
        '<p class="description"><strong>Description</strong>: ' +
        vehicle.inv_description +
        "</p>";
      grid +=
        '<p class="miles"><strong>Color:</strong> ' +
        vehicle.inv_color +
        "</p>";
      grid +=
        '<p class="miles"><strong>Miles:</strong> ' +
        new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
        "</p>";

      if (vehicle.inv_model === "DeLorean") {
        grid +=
          '<a class="cta-button" href="/own/special/' +
          vehicle.inv_id +
          '" title="View special DeLorean details"><button>Special DeLorean!</button></a>';
      } else {
        grid +=
          '<a class="cta-button" href="/own/own-today/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details"><button>Buy now!</button></a>';
      }

      grid += "</div>";
      grid += "</div>";
    });
    grid += "</div>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildOwnGrid = async function (accountData, vehicleData) {
  let grid = "";
  if (accountData && vehicleData) {
    grid += '<div class="confirmation-grid">';
    grid += '<div class="client-details">';
    grid += "<h2>Confirm your details:</h2>";
    grid +=
      "<p><strong>First Name:</strong> " +
      accountData.account_firstname +
      "</p>";
    grid +=
      "<p><strong>Last Name:</strong> " + accountData.account_lastname + "</p>";
    grid += "<p><strong>Email:</strong> " + accountData.account_email + "</p>";
    grid +=
      "<p><strong>Account Type:</strong> " + accountData.account_type + "</p>";
    grid += "</div>";
    grid += '<div class="vehicle-details">';
    grid += '<div class="detail-item">';
    grid += '<div class="image-container">';
    grid +=
      '<img src="' +
      vehicleData.inv_image +
      '" alt="Image of ' +
      vehicleData.inv_make +
      " " +
      vehicleData.inv_model +
      ' on CSE Motors" />';
    grid += "</div>";
    grid += '<div class="details-container">';
    grid +=
      "<h2>" + vehicleData.inv_make + " " + vehicleData.inv_model + "</h2>";
    grid +=
      '<p class="price"><strong> Price: $' +
      new Intl.NumberFormat("en-US").format(vehicleData.inv_price) +
      "</strong></p>";
    grid +=
      '<p class="description"><strong>Description:</strong> ' +
      vehicleData.inv_description +
      "</p>";
    grid +=
      '<p class="color"><strong>Color:</strong> ' +
      vehicleData.inv_color +
      "</p>";
    grid +=
      '<p class="miles"><strong>Miles:</strong> ' +
      new Intl.NumberFormat("en-US").format(vehicleData.inv_miles) +
      "</p>";
    grid += "</div>";
    grid += "</div>";
    grid += "</div>";
    grid += '<div class="action-buttons">';
    grid +=
      '<button class="cancel-button"><a href="/">Cancel Purchase</a></button>';

    let formActionUrl =
      vehicleData.inv_model === "DeLorean"
        ? "/own/confirm-purchase-delorean/"
        : "/own/confirm-purchase/";
    grid +=
      '<form action="' +
      formActionUrl +
      vehicleData.inv_id +
      '" method="POST">';
    grid +=
      '<input type="hidden" name="username" value="' +
      accountData.account_email +
      '">';
    grid +=
      '<input type="hidden" name="vehicleId" value="' +
      vehicleData.inv_id +
      '">';
    grid += '<button type="submit" class="buy-now-button">Get now!</button>';
    grid += "</form>";

    grid += "</div>";
    grid += "</div>";
  } else {
    grid += '<p class="notice">Sorry, no data available to display.</p>';
  }
  return grid;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          Util.clearJWTToken(req, res);
        } else {
          // Save the account data in res.locals
          res.locals.accountData = accountData;
          res.locals.loggedin = 1;

          // Store account type in a cookie
          res.cookie("account_type", accountData.account_type.trim(), {
            httpOnly: false,
          });
          res.cookie("account_email", accountData.account_email.trim(), {
            httpOnly: false,
          });

          next();
        }
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
