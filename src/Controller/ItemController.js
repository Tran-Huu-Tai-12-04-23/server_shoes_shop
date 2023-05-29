const pool = require("../config/db");
const util = require("util");
const {
  hashPassword,
  checkUserExists,
  checkEmailExists,
} = require("../util/index");

const Services = require("../services/index");
const query = util.promisify(pool.query).bind(pool);

class ItemController {
  async addNewItem(req, res) {
    const receivedData = req.body;
    if (!receivedData) {
      return res.json({
        status: 400,
        message: "Invalid data received",
      });
    }
    const {
      name,
      branch_id,
      quantity = 1,
      size,
      type,
      gender,
      des,
      age,
      status,
      brand,
      color,
      cost,
      photos,
    } = receivedData;

    if (
      !des ||
      !name ||
      !branch_id ||
      !cost ||
      !quantity ||
      !size ||
      !type ||
      !gender ||
      !age ||
      !photos ||
      !status ||
      !brand
    ) {
      return res.json({
        status: 400,
        message: "Invalid data step 2",
      });
    } else {
      let result = await Services.addDataIntoDb("item", {
        name,
        branch_id,
      });

      if (result) {
        let item_id = result;
        result = await Services.addDataIntoDb("item_detail", {
          cost,
          color,
          quantity,
          size,
          type,
          gender,
          age,
          status,
          item_id: item_id,
          des,
          brand,
        });
        result = await Services.addDataIntoDb("photo_item", {
          item_id: item_id,
          photos,
        });

        if (result) {
          return res.json({
            status: 200,
            message: "Add new shoes successfully!",
          });
        } else {
          return res.json({
            status: 400,
            message: "Insert item_detail failed!",
          });
        }
      } else {
        return res.json({
          status: 400,
          message: "Insert failed!",
        });
      }
    }
    return;
  }

  async getAllItem(req, res) {
    const limit = req.query.limit;
    const number = req.query.number;

    let queryText = `
           SELECT item.*, item_detail.*, (
            SELECT photo_item.link_photo
            FROM photo_item
            WHERE item.item_id = photo_item.item_id and item.is_delete = 0
            LIMIT 1
        ) AS link_photo, item_sale.price_sale
        FROM item
        INNER JOIN item_detail ON item.item_id = item_detail.item_id  and item.is_delete = 0
        LEFT JOIN (
            SELECT item_id, MAX(date_start) AS max_date_start
            FROM item_sale
            WHERE date_end >= CURRENT_TIMESTAMP
            GROUP BY item_id
        ) AS latest_sale ON item.item_id = latest_sale.item_id
        LEFT JOIN item_sale ON latest_sale.item_id = item_sale.item_id AND latest_sale.max_date_start = item_sale.date_start and item.is_delete = 0

      `;
    const result = await query(queryText);
    if (result) {
      return res.json({
        status: 200,
        data: JSON.stringify(result),
        message: "Get all items successfully",
      });
    }
    res.json({
      status: 400,
      message: "Get all items failed",
    });
    return null;
  }

  async getDetailItem(req, res) {
    const data = req.query;
    if (!data) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    }
    let queryText = `SELECT 
          item.*,
          item_detail.*,
          photo_item.link_photo,
          item_sale.price_sale,
          item_sale.date_end AS sale_date_end
        FROM 
          item
        INNER JOIN 
          item_detail ON item.item_id = item_detail.item_id
        LEFT JOIN 
          photo_item ON item.item_id = photo_item.item_id
        LEFT JOIN 
          item_sale ON item.item_id = item_sale.item_id
        WHERE 
          item.item_id = ?
          AND item_sale.date_end = (
            SELECT MAX(date_end)
            FROM item_sale
            WHERE item_sale.item_id = item.item_id
            AND item_sale.date_end > CURRENT_TIMESTAMP
          )

        UNION

        SELECT 
          item.*,
          item_detail.*,
          photo_item.link_photo,
          NULL AS price_sale,
          NULL AS sale_date_end
        FROM 
          item
        INNER JOIN 
          item_detail ON item.item_id = item_detail.item_id
        LEFT JOIN 
          photo_item ON item.item_id = photo_item.item_id
        WHERE 
          item.item_id = ?
          AND NOT EXISTS (
            SELECT 1
            FROM item_sale
            WHERE item_sale.item_id = item.item_id
          )
        `;

    const result = await query(queryText, [data.id, data.id]);
    if (result) {
      return res.json({
        status: 200,
        data: JSON.stringify(convert(result)),
        message: "Get all items successfully",
      });
    }
    res.json({
      status: 400,
      message: "Get all items failed",
    });
    return null;
  }

  async updateItem(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({
        status: 400,
        message: "Update item failed",
      });
    }

    const {
      name,
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
    if (
      !cost ||
      !color ||
      !quantity ||
      !size ||
      !type ||
      !gender ||
      !age ||
      !status ||
      !item_id ||
      !des ||
      !brand ||
      !name
    ) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    }

    let queryText = `
    UPDATE item_detail 
    SET  quantity = ?, cost = ?, status = ?, color = ?, brand = ?, size = ?, type = ?, gender = ?, age = ?, des = ?
    WHERE item_id = ?`;
    let params = [
      quantity,
      cost,
      status,
      color,
      brand,
      size,
      type,
      gender,
      age,
      des,
      item_id,
    ];

    try {
      const result = await query(queryText, params);
      return res.json({
        status: 200,
        message: "Updated item successfully",
        data: JSON.stringify(result),
      });
    } catch (error) {
      console.error(error);
      return res.json({
        status: 400,
        message: "Update item failed",
      });
    }
  }

  async getNewestItem(req, res) {
    const number = req.query.number;
    let queryText = `SELECT subquery.name, item.*, item_detail.*, photo_item.link_photo
        FROM (
          SELECT item.name, ROW_NUMBER() OVER (PARTITION BY item.name ORDER BY item_detail.add_date DESC) AS row_num
          FROM item
          INNER JOIN item_detail ON item.item_id = item_detail.item_id
          INNER JOIN photo_item ON item.item_id = photo_item.item_id
          ORDER BY item_detail.add_date DESC
        ) AS subquery
        INNER JOIN item ON subquery.name != item.name
        INNER JOIN item_detail ON item.item_id = item_detail.item_id
        INNER JOIN photo_item ON item.item_id = photo_item.item_id
        WHERE subquery.row_num = 1
        ORDER BY item_detail.add_date 
      `;
    if (number) {
      queryText = queryText + `limit  ${0}, ${number}`;
    }

    const result = await query(queryText);
    if (result) {
      return res.json({
        status: 200,
        data: JSON.stringify(result),
        message: "Get newest items successfully",
      });
    }
    res.json({
      status: 400,
      message: "Get all items failed",
    });
    return null;
  }

  async addSalesItem(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    }

    const { listIdProduct, dateStart, dateEnd, selectedDiscount } = data;
    if (
      !selectedDiscount ||
      !listIdProduct ||
      !listIdProduct.length > 0 ||
      !dateStart ||
      !dateEnd
    ) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    }

    let queryText = "select * from item_detail where item_id = ?";
    const listItemSale = await Promise.all(
      listIdProduct.map(async (item) => {
        const result = await query(queryText, [item]);
        if (result && result.length > 0) {
          const priceSale =
            +result[0].cost *
            +convertPercentageToFraction(selectedDiscount || "");
          return {
            price_sale: +result[0].cost - priceSale,
            item_id: item,
            date_end: dateEnd,
            date_start: dateStart,
          };
        }
      })
    );
    queryText =
      "INSERT INTO item_sale(date_start, date_end, price_sale, item_id) values(?,?,?,?)";
    const resultAll = await Promise.all(
      listItemSale.map(async (item) => {
        return await query(queryText, [
          item.date_start,
          item.date_end,
          item.price_sale,
          item.item_id,
        ]);
      })
    );

    if (resultAll) {
      res.json({
        status: 200,
        message: "Add item sale successfully!!",
      });
    } else {
      res.json({
        status: 400,
        message: "Add item sale failed!!",
      });
    }
    return;
  }

  async getSaleItem(req, res) {
    let queryText = `SELECT item_sale.sale_id, item_sale.date_start, item_sale.date_end, item_sale.price_sale, item_detail.*, photo_item.link_photo, item.*
          FROM item_sale
          JOIN item_detail ON item_sale.item_id = item_detail.item_id
          JOIN photo_item ON item_detail.item_id = photo_item.item_id
          JOIN item ON item_detail.item_id = item.item_id and item.is_delete = 0
          GROUP BY item_detail.item_id
          ORDER BY item_sale.date_start DESC;
    `;
    let result = await query(queryText);
    if (result) {
      return res.json({
        status: 200,
        message: "Get sale item success",
        data: JSON.stringify(result),
      });
    } else {
      return res.json({ status: 400, message: "Get sale item failure" });
    }
  }

  async removeSaleItem(req, res) {
    const data = req.query;
    if (!data || !data.id) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    }
    let queryText = "DELETE FROM item_sale WHERE sale_id = ?";
    const result = await query(queryText, [data.id]);

    if (result) {
      res.json({
        status: 200,
        message: "Delete sale item success",
      });
    } else {
      res.json({
        status: 400,
        message: "Delete sale item failure",
      });
    }
  }

  async saveEditItemSale(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({ status: 400, message: "Invalid data " });
    }

    const { dateEnd, dateStart, price_sale, sale_id } = data;

    if (!dateEnd || !dateStart || !price_sale || !sale_id) {
      return res.json({ status: 400, message: "Invalid data " });
    }
    const queryText =
      "UPDATE item_sale set date_start = ? , date_end = ?,price_sale=? where sale_id = ?";
    const result = await query(queryText, [
      dateEnd,
      dateStart,
      price_sale,
      sale_id,
    ]);

    if (result) {
      res.json({
        status: 200,
        message: "Update sale item successfully ",
      });
    } else {
      res.json({
        status: 400,
        message: "Update sale item failed ",
      });
    }
  }

  async orderNewItem(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({ status: 400, message: "Invalid data" });
    }

    const {
      item_id,
      accountId,
      phoneNumber,
      email,
      price,
      address,
      nameItem,
      quantity,
      nameUser,
      typeOrder,
    } = data;

    if (
      !item_id ||
      !phoneNumber ||
      !email ||
      !price ||
      !address ||
      !nameItem ||
      !quantity ||
      !nameUser
    ) {
      return res.json({ status: 400, message: "Invalid data" });
    }

    // Check item availability
    for (let i = 0; i < item_id.length; i++) {
      const queryText = "SELECT quantity FROM item_detail WHERE item_id = ?";
      const result = await query(queryText, item_id[i]);

      if (!result || result.length === 0) {
        return res.json({ status: 400, message: "Item not found" });
      }

      const itemQuantity = result[0].quantity;
      if (typeOrder[i] === 0) {
        if (itemQuantity - quantity[i] < 0) {
          return res.json({
            status: 400,
            message: "Insufficient item quantity",
          });
        }
      }
    }

    // Create order
    let order_id = [];
    const orderParams = [];

    for (let i = 0; i < item_id.length; i++) {
      let orderResult;
      if (accountId) {
        const queryText =
          "INSERT INTO `order` (item_id, account_id, type) VALUES (?, ?, ?)";
        const params = [item_id[i], accountId, typeOrder[i]];
        orderResult = await query(queryText, params);
      } else {
        const queryText = "INSERT INTO `order` (item_id, type) VALUES (?, ?)";
        const params = [item_id[i], typeOrder[i]];
        orderResult = await query(queryText, params);
      }

      if (orderResult) {
        let orderId = orderResult.insertId;
        order_id.push(orderId);
      } else {
        return res.json({ status: 400, message: "Failed to create order" });
      }
    }

    // Insert order details
    let queryText =
      "INSERT INTO order_detail (phone_number,item_id, name_client, email_client, price, address, name_item, quantity, order_id) VALUES ";
    let params = [];

    for (let i = 0; i < item_id.length; i++) {
      queryText += "(?, ?, ?, ?, ?, ?, ?, ?,?)";
      if (i < item_id.length - 1) {
        queryText += ",";
      }
    }
    for (let i = 0; i < item_id.length; i++) {
      params.push(
        phoneNumber,
        item_id[i],
        nameUser,
        email,
        price[i],
        address,
        nameItem[i],
        quantity[i],
        order_id[i]
      );
    }

    const orderDetailResult = await query(queryText, params);

    if (orderDetailResult) {
      // Update item quantities
      for (let i = 0; i < item_id.length; i++) {
        const updateQueryText =
          "UPDATE item_detail SET quantity = quantity - ? WHERE item_id = ?";
        const updateResult = await query(updateQueryText, [
          quantity[i],
          item_id[i],
        ]);

        if (!updateResult) {
          return res.json({
            status: 400,
            message: "Failed to update item quantity",
          });
        }
      }

      return res.json({
        status: 200,
        message: "Order placed successfully!",
      });
    } else {
      return res.json({
        status: 400,
        message: "Failed to create order details",
      });
    }
  }

  async getOrderAll(req, res) {
    let queryText =
      "SELECT o.*, od.* FROM `order` o JOIN order_detail od ON o.order_id = od.order_id;";

    const result = await query(queryText);
    if (result) {
      res.json({
        status: 200,
        data: JSON.stringify(result),
      });
    } else {
      res.json({
        status: 400,
        data: "Get order failed",
      });
    }
  }

  async getOrderRecently(req, res) {
    let queryText =
      "SELECT o.*, od.* FROM `order` o JOIN order_detail od ON o.order_id = od.order_id order by od.order_date desc limit 5";

    const result = await query(queryText);
    if (result) {
      res.json({
        status: 200,
        data: JSON.stringify(result),
      });
    } else {
      res.json({
        status: 400,
        data: "Get order failed",
      });
    }
  }

  async getOrderAllSold(req, res) {
    let queryText =
      "SELECT o.*, od.* FROM `order` o JOIN order_detail od ON o.order_id = od.order_id WHERE od.status_process = 5;";

    const result = await query(queryText);
    if (result) {
      res.json({
        status: 200,
        data: JSON.stringify(result),
      });
    } else {
      res.json({
        status: 400,
        data: "Get order failed",
      });
    }
  }

  async getOrderUser(req, res) {
    let id = req.query.id;
    if (!id) {
      return res.json({
        status: 400,
        message: "INvalid data",
      });
    }
    let queryText =
      "SELECT o.*, od.* FROM `order` o JOIN order_detail od ON o.order_id = od.order_id WHERE o.account_id = ?;";

    const result = await query(queryText, id);
    if (result) {
      res.json({
        status: 200,
        data: JSON.stringify(result),
      });
    } else {
      res.json({
        status: 400,
        data: "Get order failed",
      });
    }
  }

  async editOrder(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({ status: 400, message: "Invalid data " });
    }

    const { status_process, status, order_detail_id, reason } = data;
    if (!status_process || !status || !order_detail_id) {
      return res.json({ status: 400, message: "Invalid data " });
    }

    //
    let queryText =
      "UPDATE order_detail set status_process = ? , status = ? where order_detail_id = ? ";
    const result = await query(queryText, [
      status_process,
      status,
      order_detail_id,
    ]);
    if (result) {
      res.json({
        status: 200,
        message: "Change status order successfully",
      });
    } else {
      res.json({
        status: 400,
        message: "Change status order failed!!",
      });
    }
  }
  async cancelOrder(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({ status: 400, message: "Invalid data " });
    }

    const { order_detail_id, order_id, reason } = data;

    if (!order_detail_id || !order_id || !reason) {
      return res.json({ status: 400, message: "Invalid data " });
    }
    let queryText = "Select * from order_detail where order_detail_id = ?";
    let result = await query(queryText, order_detail_id);
    if (result.length > 0) {
      let item_id = result[0].item_id;
      queryText =
        "UPDATE item_detail SET quantity = quantity + 1 WHERE item_id = ?;";
      result = await query(queryText, item_id);

      if (!result) {
        return res.json({ status: 400, message: "Update quantity failed " });
      }
    } else {
      return res.json({ status: 400, message: "Invalid data " });
    }

    //
    queryText =
      "UPDATE order_detail set status_process = -1 , status = 'canceled' where order_detail_id = ? ";
    result = await query(queryText, order_detail_id);
    if (result) {
      queryText = "INSERT into order_cancel(order_id, reason) values(?,?)";
      result = await query(queryText, [order_id, reason]);
      if (result) {
        res.json({
          status: 200,
          message: "Cancel order successfully",
        });
      } else {
        res.json({
          status: 400,
          message: "Insert order cancel failed!!",
        });
      }
    } else {
      res.json({
        status: 400,
        message: "Cancel order failed!!",
      });
    }
  }

  async countDelivery(req, res) {
    let queryText =
      "SELECT COUNT(*) as count_delivery FROM order_detail WHERE status_process = 2;";

    const result = await query(queryText);
    if (result && result.length > 0) {
      res.json({
        status: 200,
        orderDeliveryCount: result[0].count_delivery,
      });
    } else {
      res.json({
        status: 200,
      });
    }
  }

  async countTotalOrder(req, res) {
    let account_id = req.query.account_id;
    let queryText;
    let result;
    if (account_id) {
      queryText =
        "SELECT SUM(order_detail.price) AS count_total FROM order_detail JOIN `order` ON `order`.order_id = order_detail.order_id WHERE `order`.account_id = ?;";
      result = await query(queryText, account_id);
    } else {
      queryText =
        "SELECT SUM(order_detail.price) AS count_total FROM order_detail ";
      result = await query(queryText);
    }

    if (result && result.length > 0) {
      res.json({
        status: 200,
        count_total: result[0].count_total,
      });
    } else {
      res.json({
        status: 200,
      });
    }
  }

  async countBalance(req, res) {
    let queryText =
      "SELECT sum(order_detail.price) as count_balance FROM order_detail WHERE status_process = 5;";

    const result = await query(queryText);
    if (result && result.length > 0) {
      res.json({
        status: 200,
        count_balance: result[0].count_balance,
      });
    } else {
      res.json({
        status: 400,
      });
    }
  }

  async countItemSold(req, res) {
    let queryText =
      "SELECT count(*) as number_item_sold FROM order_detail WHERE status_process = 5;";

    const result = await query(queryText);
    if (result && result.length > 0) {
      res.json({
        status: 200,
        number_item_sold: result[0].number_item_sold,
      });
    } else {
      res.json({
        status: 400,
      });
    }
  }

  async delete(req, res) {
    const { item_id } = req.body;

    if (!item_id) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    }

    let queryText = "UPDATE item set is_delete = 1 where item_id = ?;";

    const result = await query(queryText, item_id);
    if (result && result.length > 0) {
      res.json({
        status: 200,
        message: "Delete successfully!",
      });
    } else {
      res.json({
        status: 400,
        message: "Delete failed!",
      });
    }
  }

  async getItemDelete(req, res) {
    const queryText = `SELECT item.*, item_detail.*, (
            SELECT photo_item.link_photo
            FROM photo_item
            WHERE item.item_id = photo_item.item_id and item.is_delete = 1
            LIMIT 1
        ) AS link_photo, item_sale.price_sale
        FROM item
        INNER JOIN item_detail ON item.item_id = item_detail.item_id  and item.is_delete = 1
        LEFT JOIN (
            SELECT item_id, MAX(date_start) AS max_date_start
            FROM item_sale
            WHERE date_end >= CURRENT_TIMESTAMP
            GROUP BY item_id
        ) AS latest_sale ON item.item_id = latest_sale.item_id
        LEFT JOIN item_sale ON latest_sale.item_id = item_sale.item_id AND latest_sale.max_date_start = item_sale.date_start and item.is_delete = 1 ;`;

    const result = await query(queryText);
    if (result) {
      res.json({
        status: 200,
        message: "Get item delete successfully!",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        message: "Get item delete failed!",
      });
    }
  }

  async restore(req, res) {
    const { item_id } = req.body;

    if (!item_id) {
      return res.json({
        status: 400,
        message: "Invalid item id",
      });
    }

    const queryText = "UPDATE item set is_delete = 0 where item_id = ?";
    const result = await query(queryText, item_id);

    if (result) {
      res.json({
        status: 200,
        message: "Restore item successfully!",
      });
    } else {
      res.json({
        status: 400,
        message: "Restore item failed!",
      });
    }
  }
}
function convert(object) {
  let linkPhotos = object.map((item) => item.link_photo);
  return {
    ...object[0],
    link_photo: linkPhotos,
  };
}

module.exports = new ItemController();

function convertPercentageToFraction(percentage) {
  if (typeof percentage !== "string") {
    throw new Error("Invalid input. Percentage must be a string.");
  }
  const percentValue = parseFloat(percentage);
  if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
    throw new Error(
      "Invalid input. Percentage must be a valid number between 0 and 100."
    );
  }
  const numerator = percentValue;
  const denominator = 100;
  return numerator / denominator;
}
