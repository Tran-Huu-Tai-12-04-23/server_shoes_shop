const pool = require("../config/db");
const {
  hashPassword,
  checkUserExists,
  checkEmailExists,
} = require("../util/index");
const util = require("util");
const query = util.promisify(pool.query).bind(pool);
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  // config mail server
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "huutaidev@gmail.com", // generated ethereal user
    pass: "vynpmzlehxevdqxg", // generated ethereal password
  }, // Sender's email password
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

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
        let account_id = add.account_id;
        console.log(account_id);
        return res.status(200).json({
          status: 200,
          message: "Registration successful",
          id: account_id,
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

  async sendEmail(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({
        status: 200,
        message: "Invalid data",
      });
    }

    const { email, subject } = data;
    const code = generateVerificationCode();
    const mailOptions = {
      from: "huutaidev@gmail.com", // Sender's email address
      to: email,
      subject: subject,
      text: "code verify for you is : ",
      html:
        "<b>Code verify for you is : <span style='color: blue'}>" +
        code +
        "</span></b>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.json({ status: 400, message: "Failed to send email" });
      } else {
        res.json({
          status: 200,
          message: "Email sent successfully",
          code: code,
        });
      }
    });

    return;
  }

  async getUser(req, res) {
    let data = req.body;
    if (!data) {
      return res.json({ status: 400, message: "Get user failed" });
    }

    const { id } = data;
    console.log(id);

    let queryText = "Select * from account where account_id = ?";
    let result = await query(queryText, [id]);

    if (result) {
      res.json({
        status: 200,
        message: "Get user successfully",
        data: JSON.stringify(result),
      });
    } else {
      res.json({
        status: 400,
        message: "Get user failed",
      });
    }
  }

  async changePassword(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({ status: 400, message: "Change password failed" });
    }

    const { password, confirmPassword, email } = data;

    if (!password || !confirmPassword) {
      return res.json({ status: 400, message: "Change password invalid" });
    }

    if (!(password === confirmPassword)) {
      return res.json({
        status: 400,
        message: "Password and confirm password is not matching",
      });
    }
    const hashedPassword = await hashPassword(password);

    let queryText = "Update account set password= ? where email = ?";

    let result = await query(queryText, [hashedPassword, email]);

    if (result) {
      return res.json({
        status: 200,
        message: "Change password successfully!!",
      });
    } else {
      res.json({
        status: 400,
        message: "Change password failed!!",
      });
    }
  }

  async addNewEmployee(req, res) {
    const data = req.body;
    let isCheckErr = false;
    if (!data) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    }

    const {
      email,
      username,
      password,
      confirmPassword,
      firstName,
      lastName,
      role,
      phoneNumber,
      address,
      branchId,
      salary,
    } = data;
    let queryText =
      "Insert into account(email, username, password, role_account) values(?,?,?,?)";
    const hashedPassword = await hashPassword(password);
    const result = await query(queryText, [
      email,
      username,
      hashedPassword,
      role,
    ]);
    if (result) {
      let idAccount = result.insertId;

      queryText =
        "Insert into employee(role, salary, account_id, branch_id) values(?,?,?,?) ";
      const resultInsertEmployee = await query(queryText, [
        role,
        salary,
        idAccount,
        branchId,
      ]);

      if (resultInsertEmployee) {
        let employee_id = resultInsertEmployee.insertId;
        queryText =
          "Insert into profile(phone_number, address, first_name, last_name, employee_id) values(?,?,?,?,?)";
        const resultInsertProfile = await query(queryText, [
          phoneNumber,
          address,
          firstName,
          lastName,
          employee_id,
        ]);

        if (!resultInsertProfile) {
          isCheckErr = true;
        }
      } else {
        isCheckErr = true;
      }
    }

    if (isCheckErr) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    } else {
      return res.json({
        status: 200,
        message: "Add new employee successfully",
      });
    }
  }
  async getIdUser(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({
        status: 400,
        message: "Invalid data",
      });
    }

    if (!data.email) {
      return res.json({
        status: 400,
        message: "Email not found",
      });
    }
    let queryText = "Select account_id from account where email = ?";
    const result = await query(queryText, data.email);
    if (result.length > 0) {
      res.json({
        status: 200,
        id: result[0].account_id,
      });
    } else {
      res.json({
        status: 400,
        message: "Get account_id failed",
      });
    }
  }

  async getDetailUser(req, res) {
    const id = req.query.id;
    if (!id) {
      return res.json({ status: 400, message: "Invalid data" });
    }

    const queryText =
      "SELECT distinct * FROM account LEFT JOIN profile ON account.account_id = profile.account_id WHERE account.account_id = ?; ";

    const result = await query(queryText, [id]);

    if (result.length > 0) {
      res.json({ status: 200, data: JSON.stringify(result[0]) });
    } else {
      res.json({ status: 400, message: "User not found" });
    }
  }

  async getPointUser(req, res) {
    const id = req.query.id;
    if (!id) {
      return res.json({ status: 400, message: "Invalid data" });
    }

    const queryText =
      "SELECT SUM(od.total) AS total_value FROM `order` o JOIN order_detail od ON o.order_id = od.order_id JOIN account u ON o.account_id = u.account_id WHERE u.account_id = ? AND od.status_process = 5;";

    const result = await query(queryText, [id]);

    if (result.length > 0) {
      res.json({ status: 200, data: result[0].total_value });
    } else {
      res.json({ status: 400, message: "User not found" });
    }
  }

  async updateProfile(req, res) {
    const data = req.body;
    if (!data) {
      return res.json({ status: 400, message: "Invalid data" });
    }
    const { phone_number, address, first_name, last_name, account_id, email } =
      data;

    if (
      !phone_number ||
      !address ||
      !first_name ||
      !last_name ||
      !account_id ||
      !email
    ) {
      return res.json({ status: 400, message: "Invalid data " });
    }
    let queryText = "select * from account where email = ? and account_id != ?";
    let result = await query(queryText, [email, account_id]);
    console.log(result);
    if (result.length > 0) {
      return res.json({ status: 400, message: "Email is already exist" });
    }
    queryText = "UPDATE account set email = ? where account_id = ? ";
    result = await query(queryText, [email, account_id]);

    if (!result) {
      return res.json({ status: 400, message: "Server error" });
    }

    queryText =
      "select * from profile where phone_number = ? and account_id != ?";
    result = await query(queryText, [phone_number, account_id]);
    if (result.length > 0) {
      return res.json({
        status: 400,
        message: "Phone number is already exist",
      });
    }

    queryText = "Select * from profile where account_id = ?";
    result = await query(queryText, account_id);
    if (result.length > 0) {
      queryText =
        "update profile set phone_number = ?, first_name = ?, last_name = ? , address = ? where account_id = ?";
      let params = [phone_number, first_name, last_name, address, account_id];

      result = await query(queryText, params);

      if (result) {
        res.json({ status: 200, message: "Update profile success!!" });
      } else {
        res.json({ status: 400, message: "Server is error" });
      }
    } else {
      queryText =
        "insert profile(phone_number, first_name, last_name, address, account_id) values(?,?,?,?,?) ";
      let params = [phone_number, first_name, last_name, address, account_id];
      result = await query(queryText, params);
      if (result) {
        res.json({ status: 200, message: "Update profile success!!" });
      } else {
        res.json({ status: 400, message: "Server is error" });
      }
    }
  }
}

function generateVerificationCode() {
  const length = 6;
  let code = "";
  const characters = "0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

module.exports = new UserController();
