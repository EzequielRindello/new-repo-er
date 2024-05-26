const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

async function buildEdit(req, res, next) {
  let nav = await utilities.getNav();
  let accountData = null;

  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, decodedData) {
        if (err) {
          return next(err);
        } else {
          accountData = decodedData;
          res.locals.accountData = accountData;
          res.locals.loggedin = 1;

          res.cookie("account_type", accountData.account_type.trim(), {
            httpOnly: false,
          });

          res.render("account/credentials", {
            title: "Change Your credentials",
            nav,
            accountData,
            errors: null,
          });
        }
      }
    );
  } else {
    res.render("account/credentials", {
      title: "Change Your credentials",
      nav,
      accountData,
      errors: null,
    });
  }
}

async function buildAccountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      messages: req.flash("info"),
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

async function updateAccount(req, res) {
  if (!req.cookies.jwt) {
    req.flash("notice", "You must be logged in to update your account.");
    return res.redirect("/account/login");
  }

  jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    async function (err, decodedData) {
      if (err) {
        req.flash("notice", "Invalid token. Please log in again.");
        return res.redirect("/account/login");
      }

      const { account_id } = decodedData;
      const { account_firstname, account_lastname, account_email } = req.body;

      if (!account_firstname || !account_lastname || !account_email) {
        req.flash("notice", "All fields are required.");
        return res.redirect("/account/edit");
      }

      try {
        const regResult = await accountModel.updateAccount(
          account_id,
          account_firstname,
          account_lastname,
          account_email
        );

        if (regResult) {
          req.flash(
            "notice",
            `Congratulations, you've updated your info ${account_firstname}. Please log ing`
          );
          return res.redirect("/account/logout");
        } else {
          req.flash(
            "notice",
            "Failed to update your account. Please try again."
          );
          return res.redirect("/account/edit");
        }
      } catch (error) {
        req.flash("notice", "An error occurred during the update.");
        return res.redirect("/account/edit");
      }
    }
  );
}

async function updateOnlyPassword(req, res) {
  if (!req.cookies.jwt) {
    req.flash("notice", "You must be logged in to update your account.");
    return res.redirect("/account/login");
  }

  jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    async function (err, decodedData) {
      if (err) {
        req.flash("notice", "Invalid token. Please log in again.");
        return res.redirect("/account/login");
      }

      const { account_id } = decodedData;
      const { account_password } = req.body;

      if (!account_password) {
        req.flash("notice", "All fields are required.");
        return res.redirect("/account/edit");
      }

      try {
        const hashedPassword = await bcrypt.hash(account_password, 10);

        const regResult = await accountModel.updatepassword(
          account_id,
          hashedPassword
        );

        if (regResult.rowCount > 0) {
          req.flash(
            "notice",
            "Congratulations, you've updated your password. Please log in."
          );
          return res.redirect("/account/logout");
        } else {
          req.flash(
            "notice",
            "Failed to update your account. Please try again."
          );
          return res.redirect("/account/edit");
        }
      } catch (error) {
        console.error("Error during password update:", error); 
        req.flash("notice", "An error occurred during the update.");
        return res.redirect("/account/edit");
      }
    }
  );
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildEdit,
  updateAccount,
  updateOnlyPassword,
};
