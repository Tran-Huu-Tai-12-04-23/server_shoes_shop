const pool = require("../config/db");
const util = require("util");
const { verifyPassword } = require("../util/index");

const query = util.promisify(pool.query).bind(pool);

class Services {
  async checkCondition(item_id, quantity) {
    let success = true;

    for (let i = 0; i < item_id.length; i++) {
      const item_id_sub = item_id[i];
      const quantity_sub = quantity[i];

      let queryText =
        "SELECT * FROM item JOIN item_detail ON item.item_id = item_detail.item_id WHERE item.item_id = ?";
      let resultCheck = await query(queryText, item_id_sub);

      if (!resultCheck) {
        success = false;
        break;
      }

      let quantity_res = resultCheck.quantity;

      if (quantity_res - quantity_sub > 0) {
        queryText = "UPDATE item_detail SET quantity = ?";
        let resultUp = await query(queryText, quantity_res - quantity_sub);

        if (!resultUp) {
          success = false;
          break;
        }
      } else {
        queryText = "DELETE FROM item WHERE item_id = ?";
        let resultDelete = await query(queryText, item_id_sub);

        if (!resultDelete) {
          success = false;
          break;
        }
      }
    }

    return success;
  }

  async addDataIntoDb(nameTable, data) {
    if (!pool) {
      throw new Error("Database pool not initialized");
    }
    switch (nameTable) {
      case "account":
        const { username, password, email, avatar, id } = data;
        const queryText = id
          ? "INSERT INTO account (account_id, username, email, password, avatar) VALUES (?, ?, ?, ?, ?)"
          : "INSERT INTO account (username, email, password, avatar) VALUES (?, ?, ?, ?)";
        const queryParams = id
          ? [id, username, email, password, avatar]
          : [username, email, password, avatar];

        const result = await query(queryText, queryParams);
        if (result.affectedRows > 0) {
          return {
            account_id: result.insertId,
          };
        } else {
          return false;
        }

      case "item": {
        const { name, branch_id } = data;
        const queryText = "INSERT INTO item (name, branch_id) VALUES (?, ?)";
        const queryParams = [name, branch_id];

        const result = await query(queryText, queryParams);
        if (result.affectedRows > 0) {
          const insertedItemId = result.insertId;
          return insertedItemId;
        } else {
          return null;
        }
      }

      case "item_detail": {
        const {
          cost,
          color,
          quantity,
          size,
          type,
          gender,
          age,
          status,
          item_id,
          des,
          brand,
        } = data;
        const queryText =
          "INSERT INTO item_detail (quantity, cost, status, color, brand, size, type, gender, age, item_id, des) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const queryParams = [
          quantity,
          cost,
          status,
          color,
          brand,
          size,
          type,
          gender,
          age,
          item_id,
          des,
        ];

        const result = await query(queryText, queryParams);
        if (result.affectedRows > 0) {
          return true;
        } else {
          return false;
        }
      }

      case "photo_item": {
        const { item_id, photos } = data;
        let insertedItemIds = [];
        const promises = photos.map(async (link_photo) => {
          const queryText =
            "INSERT INTO photo_item (link_photo, item_id) VALUES (?, ?)";
          const queryParams = [link_photo, item_id];
          const result = await query(queryText, queryParams);
          if (result.affectedRows > 0) {
            const insertedItemId = result.insertId;
            return insertedItemId;
          }
        });
        insertedItemIds = await Promise.all(promises);
        return insertedItemIds.length > 0 ? insertedItemIds : null;
      }

      default:
        console.log("Table is invalid");
        return false;
    }
  }

  async authUser(user) {
    try {
      const res = await query(
        "SELECT * from account where username = ? or email = ?",
        [user.username_email, user.username_email]
      );
      if (!res || res.length === 0) {
        return {
          status: 400,
          message: "User not found",
        };
      }
      const data = res[0];
      const { username, email, account_id, password, role_account } = data;

      try {
        const isCheck = await verifyPassword(user.password, password);
        if (isCheck) {
          return {
            status: 200,
            message: "Login successfully",
            data: {
              username,
              account_id,
              email,
              role_account,
            },
          };
        } else {
          return {
            status: 400,
            message: "Invalid password",
          };
        }
      } catch (e) {
        console.error(e);
        return {
          status: 500,
          message: "Server error: " + e.message,
        };
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = new Services();
