const pool = require("../config/db");
const {
  hashPassword,
  checkUserExists,
  checkEmailExists,
} = require("../util/index");

const Services = require("../services/index");

class UserController {
  async register(req, res) {
    const receivedData = req.body;
    if (!receivedData) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    }
    const { username, password, confirmPassword, email, avatar, id } =
      receivedData;

    if (!username) {
      return res.json({
        status: 400,
        message: "Username is required",
      });
    }
    if (!password || !confirmPassword) {
      return res.json({
        status: 400,
        message: "Password is required",
      });
    }
    if (password !== confirmPassword) {
      return res.json({
        status: 400,
        message: "Password and confirm password do not match",
      });
    }
    if (!email) {
      return res.json({
        status: 400,
        message: "Email is required",
      });
    }
    try {
      const userExists = await checkUserExists(username);
      if (userExists) {
        return res.json({
          status: 400,
          message: "User already registered",
        });
      }
      const emailExist = await checkEmailExists(email);
      if (emailExist) {
        return res.json({
          status: 400,
          message: "Email already exists",
        });
      }
      const hashedPassword = await hashPassword(password);
      const add = await Services.addDataIntoDb("account", {
        username: username,
        password: hashedPassword,
        email: email,
        avatar: avatar ? avatar : "updating",
        id: id ? id : null,
      });

      if (add) {
        return res.status(200).json({
          status: 200,
          message: "Registration successful",
        });
      } else {
        return res.status(200).json({
          message: "Registration failed",
          status: 400,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async login(req, res) {
    const receivedData = req.body;
    if (!receivedData) {
      res.json({
        status: 400,
        message: "Invalid data",
      });
      return;
    }
    const { username_email, password } = receivedData;
    if (!username_email) {
      res.json({
        status: 400,
        message: "Please enter your username || email",
      });
      return;
    }
    if (!password) {
      res.json({
        status: 400,
        message: "Please enter your password",
      });
      return;
    }

    try {
      const result = await Services.authUser({
        username_email,
        password,
      });
      res.json({
        ...result,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new UserController();
