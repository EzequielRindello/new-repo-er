const pool = require("../database/index");

async function getCarById(inv_id) {
  try {
    const CarData = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    return CarData.rows;
  } catch (error) {
    console.error("getCarById " + error);
  }
}

async function getDelorean() {
  try {
    const CarData = await pool.query("SELECT * FROM public.special");
    return CarData.rows;
  } catch (error) {
    console.error("getCarById " + error);
  }
}

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

module.exports = { getCarById, getDelorean, getAccountByEmail};
