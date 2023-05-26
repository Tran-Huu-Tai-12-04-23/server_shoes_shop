const express = require("express");
const router = express.Router();
const UserController = require("../Controller/UserController");

router.get("/get-detail-user", UserController.getDetailUser);
router.get("/get-point-user", UserController.getPointUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/send-email", UserController.sendEmail);
router.post("/change-password", UserController.changePassword);
router.post("/add-employee", UserController.addNewEmployee);
router.post("/get-id-user", UserController.getIdUser);
router.post("/update-profile", UserController.updateProfile);
router.post("/change-password-user", UserController.changePasswordUser);
router.post("/", UserController.getUser);

module.exports = router;
