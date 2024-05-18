const utilities = require("./index");
const { body, validationResult } = require("express-validator");
const validate = {};

validate.registationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid classification name."), 
  ];
};

validate.checkRegData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./account/classification", {
      errors,
      title: "Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

module.exports = validate;