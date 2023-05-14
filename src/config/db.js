// get the client
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.db_server || "localhost",
  user: process.env.db_user || "root",
  database: process.env.db_name || "shoes_shop",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});

module.exports = pool;
// simple query
// const test = () => {
//   connection.query("SELECT * FROM `shoes` ", function (err, results, fields) {
//     console.log(results); // results contains rows returned by server
//   });
// };
// module.exports = test;
