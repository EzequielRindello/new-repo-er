const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    let className = "No";

    if (data && data.length > 0 && data[0].classification_name) {
      className = data[0].classification_name;
    }

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let itemData = await invModel.getCarById(inv_id);
  itemData = itemData[0];
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    grid: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumnail: itemData.inv_thumnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;

    req.flash("notice", "Sorry, the insert failed. Please review the form.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      grid: classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

invCont.deleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    let itemData = await invModel.getCarById(inv_id);
    itemData = itemData[0];
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    next(error);
  }
};

invCont.deleteItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const deleteResult = await invModel.deleteInventory(inv_id);

    if (deleteResult) {
      req.flash("notice", "The deletion was successful");
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, the delete failed!");
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
