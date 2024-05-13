const utilities = require("../utilities/");

/* ***************************
 *  Build acc view
 * ************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: " Login",
    nav,
  });
}

module.exports = { buildLogin };
