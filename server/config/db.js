const mysql = require('mysql');
  require('dotenv').config()
const db = mysql.createConnection({
     host: process.env.HOST || "localhost",
  user: process.env.USER||"root",
  password:process.env.PASSWORD || "",
  database: process.env.DATABASE || "affiliate_saas"
})
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

module.exports = db;