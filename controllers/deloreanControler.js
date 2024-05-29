const detailModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const detailCont = {};

/* ***************************
 *  Build special delorean view
 * ************************** */
detailCont.buildDeloreanDetail = async function (req, res, next) {
  const data = await detailModel.getDelorean();
  const grid = await utilities.buildDetailGrid(data);
  let nav = await utilities.getNav();
  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/delorean", {
    title: className,
    nav,
    grid,
  });
};

module.exports = detailCont;
