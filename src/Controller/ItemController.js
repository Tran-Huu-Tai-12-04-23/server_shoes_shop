const pool = require("../config/db");
const {
  hashPassword,
  checkUserExists,
  checkEmailExists,
} = require("../util/index");

const Services = require("../services/index");

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
    console.log(receivedData);

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
      console.log(result);
    }
    return;
  }
}

module.exports = new ItemController();
