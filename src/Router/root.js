const express = require("express");
const router = express.Router();
const HomeController = require("../Controller/HomeController");

router.get("/get-branch", HomeController.getBranchStore);

module.exports = router;
