const mysql = require('mysql');
const db = mysql.createConnection({
     host: "localhost",
  user: "root",
  password: "",
  database: "affiliate_saas"
})
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

module.exports = db;