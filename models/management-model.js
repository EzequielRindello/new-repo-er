const pool = require("../database/index");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  classification_name
) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [
      classification_name
    ]);
  } catch (error) {
    return error.message;
  }
}

module.exports = { registerAccount};