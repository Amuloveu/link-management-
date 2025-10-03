const db = require("../config/db");
const geoip = require("geoip-lite");
const requestIp = require("request-ip");
const checkLinkAlive = require("../helper/helper"); // your helper

const redirectLink = async (req, res) => {
  const { alias } = req.params;

  db.query("SELECT * FROM links WHERE alias = ?", [alias], async (err, results) => {
    if (err) return res.status(500).send("Server error");
    if (!results.length) return res.status(404).send("Link not found");

    const link = results[0];

    // 1. Check if link is alive
    const alive = await checkLinkAlive(link.url);
    if (!alive) {
      return res.status(410).send("This link is broken, please update it");
    }

    // 2. Get client IP
    let ip = req.query.ip || requestIp.getClientIp(req) || "0.0.0.0";
    if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";

    // 3. Device detection
    const ua = req.get("User-Agent") || "";
    let device = /mobile/i.test(ua)
      ? "Mobile"
      : /tablet/i.test(ua)
      ? "Tablet"
      : "Desktop";

    // 4. Geo lookup
    const geo = geoip.lookup(ip) || {};
    const country = geo.country || "Unknown";
    const city = geo.city || "Unknown";

    // 5. Referrer
    let referrer = req.get("Referer") || req.query.utm_source || "Direct";

    // 6. Store click info
    const clickSql = `
      INSERT INTO clicks
        (link_id, referrer, device, ip_address, country, city)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(clickSql, [link.id, referrer, device, ip, country, city], (insertErr) => {
      if (insertErr) console.error("Click insert error:", insertErr);
    });

    // 7. Update total clicks
    db.query("UPDATE links SET clicks = clicks + 1 WHERE id = ?", [link.id], (updateErr) => {
      if (updateErr) console.error("Update clicks error:", updateErr);
    });

    // 8. Redirect
    res.redirect(link.url);
  });
};

module.exports = { redirectLink };
