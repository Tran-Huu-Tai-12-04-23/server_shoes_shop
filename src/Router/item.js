const express = require("express");
const router = express.Router();
const ItemController = require("../Controller/ItemController");

router.post("/add", ItemController.addNewItem);

module.exports = router;
