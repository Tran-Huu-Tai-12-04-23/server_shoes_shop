const pool = require("../config/db");
const util = require("util");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(pass) {
  try {
    const hashPass = await bcrypt.hash(pass, saltRounds);
    return hashPass;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function verifyPassword(password, hashPassword) {
  try {
    const match = await bcrypt.compare(password, hashPassword);
    return match;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

async function checkUserExists(userName) {
  const query = util.promisify(pool.query).bind(pool);
  try {
    const result = await query(
      "SELECT username FROM account WHERE username = ?",
      [userName]
    );
    return result.length > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function checkEmailExists(email) {
  const query = util.promisify(pool.query).bind(pool);
  try {
    const result = await query("SELECT username FROM account WHERE email = ?", [
      email,
    ]);
    return result.length > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  // return promise
  hashPassword,
  // return true or false
  verifyPassword,
  //
  checkUserExists,
  checkEmailExists,
};
