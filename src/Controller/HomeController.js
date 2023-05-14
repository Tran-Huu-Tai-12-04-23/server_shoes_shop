const pool = require("../config/db");
const util = require("util");
const query = util.promisify(pool.query).bind(pool);

class HomeController {
  async getBranchStore(req, res) {
    try {
      const result = await query("SELECT * from branch_store");
      if (!result || result.length === 0) {
        return {
          status: 400,
          message: "User not found",
        };
      }
      const data = result;
      if (result) {
        return res.json({
          status: 200,
          message: "Get branch successfully!",
          data: JSON.stringify(data),
        });
      } else {
        return res.json({
          status: 400,
          message: "Get branch failed!",
        });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Server error : " + e.message,
      });
    }
  }
}

module.exports = new HomeController();
