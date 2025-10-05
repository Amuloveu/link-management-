// const fs = require('fs');
// const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require("node-cron");
const checkLinkAlive = require("./helper/helper");
const db = require("./config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);
require('dotenv').config();
const requestIp = require('request-ip');

const authRoute = require('./routes/authRoute');
const linkRoute = require('./routes/linkRoute');
const clickRoute = require('./routes/clickRoute');
const paymentRoute = require('./routes/paymentRoute');
const dashboard = require('./routes/dashboardRoute');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set("trust proxy", 1); // trust ngrok proxy
app.use(requestIp.mw());  

app.use('/api/auth', authRoute);
app.use('/api/links', linkRoute);
app.use('/r', clickRoute);
app.use('/api/payment', paymentRoute);
app.use('/api', dashboard);

// Limit concurrent link checks to avoid server overload
const pLimit = require("p-limit");
const limit = pLimit(5); // check 5 links at a time

// Run every minute: "0 * * * * *"
cron.schedule("0 * * * * *", async () => {
  console.log("Running scheduled link re-check...");
  try {
    const links = await query("SELECT id, url FROM links");

    await Promise.all(
      links.map(link =>
        limit(async () => {
          try {
            const alive = await checkLinkAlive(link.url);
            await query(
              "UPDATE links SET is_alive=?, last_checked=NOW() WHERE id=?",
              [alive ? 1 : 0, link.id]
            );
            console.log(`${link.url} -> ${alive ? "alive" : "dead"}`);
          } catch (err) {
            console.error("Failed to check link:", link.url, err.message);
          }
        })
      )
    );
  } catch (err) {
    console.error("Failed to fetch links for cron job:", err.message);
  }
});

// const httpsOptions = {
//   key:  fs.readFileSync(__dirname + '/cert/key.pem'),
//   cert: fs.readFileSync(__dirname + '/cert/cert.pem')
// };

const PORT = process.env.PORT || 5000;
/*https.createServer(httpsOptions, app)*/
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ HTTPS server running at http://localhost:${PORT}`);
});
