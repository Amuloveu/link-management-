// const db = require("../config/db");
// const util = require("util");
// const query = util.promisify(db.query).bind(db);
// const crypto = require("crypto");

// // Helper: generate random alias if not provided
// function generateAlias() {
//   return crypto.randomBytes(4).toString("hex"); // e.g., "9f1b2c3d"
// }

// // Add a new affiliate link
//  const addLink = (req, res) => {
//   const { title, url, alias, networkId } = req.body;
//   const userId = req.user.id;

//   if (!title || !url)
//     return res.status(400).json({ message: "Title and URL are required" });

//   const finalAlias = alias || generateAlias();
//   const finalNetworkId = networkId || 1; // default Amazon

//   const sql =
//     "INSERT INTO links (user_id, network_id, title, url, alias) VALUES (?, ?, ?, ?, ?)";
//   db.query(
//     sql,
//     [userId, finalNetworkId, title, url, finalAlias],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: err.message });
// const host = req.get("host"); // gets localhost:5000 in dev
// const protocol = req.protocol; // http or https
// const shareableUrl = `${protocol}://${host}/r/${finalAlias}`;
//       res.json({ message: "Link added successfully", shareableUrl });
//     }
//   );
// };

// // Get all links for the logged-in user
// const getAllLinks = (req, res) => {
//   const userId = req.user.id;
//   const { networkId } = req.query;

//   let sql = "SELECT * FROM links WHERE user_id = ?";
//   const params = [userId];

//   if (networkId) {
//     sql += " AND network_id = ?";
//     params.push(networkId);
//   }

//   db.query(sql, params, (err, results) => {
//     if (err) return res.status(500).json({ message: err.message });
//     res.json(results);
//   });
// };

// // Update link (title, URL, alias)
// const updateLink = (req, res) => {
//   const userId = req.user.id;
//   const { linkId } = req.params;
//   const { title, url, alias, networkId } = req.body;

//   const sql =
//     "UPDATE links SET title = ?, url = ?, alias = ?, network_id = ? WHERE id = ? AND user_id = ?";
//   db.query(
//     sql,
//     [title, url, alias, networkId, linkId, userId],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: err.message });
//       if (result.affectedRows === 0)
//         return res.status(404).json({ message: "Link not found" });
//       res.json({ message: "Link updated successfully" });
//     }
//   );
// };

// // Delete a link
// const deleteLink = (req, res) => {
//   const userId = req.user.id;
//   const { linkId } = req.params;

//   const sql = "DELETE FROM links WHERE id = ? AND user_id = ?";
//   db.query(sql, [linkId, userId], (err, result) => {
//     if (err) return res.status(500).json({ message: err.message });
//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: "Link not found" });
//     res.json({ message: "Link deleted successfully" });
//   });
// };

// // --- keep everything you already have above ---

// // ✅ NEW: get one link with full details & timeline
// const getLinkById = async (req, res) => {
//   const userId = req.user.id;
//   const { linkId } = req.params;

//   try {
//     const linkSql = `
//       SELECT id, title, url, alias, clicks, created_at
//       FROM links
//       WHERE id = ? AND user_id = ?
//     `;
//     const links = await query(linkSql, [linkId, userId]);
//     if (links.length === 0) {
//       return res.status(404).json({ message: "Link not found" });
//     }
//     const link = links[0];

//     const timelineSql = `
//       SELECT DATE(created_at) AS day, COUNT(*) AS clicks
//       FROM clicks
//       WHERE link_id = ?
//       GROUP BY DATE(created_at)
//       ORDER BY day
//     `;
//     const timeline = await query(timelineSql, [linkId]);

//     const referrersSql = `
//       SELECT referrer AS name, COUNT(*) AS value
//       FROM clicks
//       WHERE link_id = ?
//       GROUP BY referrer
//       ORDER BY value DESC
//     `;
//     const referrers = await query(referrersSql, [linkId]);

//     const devicesSql = `
//       SELECT device AS name, COUNT(*) AS value
//       FROM clicks
//       WHERE link_id = ?
//       GROUP BY device
//       ORDER BY value DESC
//     `;
//     const devices = await query(devicesSql, [linkId]);

//     res.json({
//       ...link,
//       timeline,
//       referrers,
//       devices
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {addLink,updateLink,getAllLinks,deleteLink,getLinkById};
const db = require("../config/db");
const util = require("util");
const crypto = require("crypto");
const fetch = require("node-fetch");
const checkLinkAlive = require("../helper/helper");
const query = util.promisify(db.query).bind(db);
const requestIp = require('request-ip');

// Generate random alias
function generateAlias() {
  return crypto.randomBytes(4).toString("hex");
}

// Add new link
const addLink = async (req, res) => {
  const { title, url, alias, networkId } = req.body;
  const userId = req.user.id;

  if (!title || !url) return res.status(400).json({ message: "Title and URL are required" });

  const finalAlias = alias || generateAlias();
  const finalNetworkId = networkId || 1;

  const sql = "INSERT INTO links (user_id, network_id, title, url, alias) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [userId, finalNetworkId, title, url, finalAlias], async (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    // ✅ Alive check
    const alive = await checkLinkAlive(url);
    await query("UPDATE links SET is_alive=?, last_checked=NOW() WHERE id=?", [alive ? 1 : 0, result.insertId]);

    // ✅ Generate shareable URL
    const BASE_URL = "https://ami-epidictic-unfamiliarly.ngrok-free.dev";
    //  const BASE_URL = 'https://localhost:5000'
    const shareableUrl = `${BASE_URL}/r/${finalAlias}`;

    // ✅ Save shareable URL in DB
    await query("UPDATE links SET shareable_url=? WHERE id=?", [shareableUrl, result.insertId]);

    // ✅ Return full link object so frontend can update immediately
    const [newLink] = await query("SELECT * FROM links WHERE id=?", [result.insertId]);

    res.json({ message: "Link added successfully", link: newLink });
  });
};


// Get all links for a user
const getAllLinks = (req, res) => {
  const userId = req.user.id;
  db.query(
  `SELECT id, title, url, alias, shareable_url, clicks, is_alive, last_checked, created_at
   FROM links WHERE user_id=? ORDER BY created_at DESC`,
  [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    }
  );
};

// Redirect handler with clicks, geo & device info

// Update link (title, URL, alias)
const updateLink = (req, res) => {
  const userId = req.user.id;
  const { linkId } = req.params;
  const { title, url, alias } = req.body;

  const sql =
    "UPDATE links SET title = ?, url = ?  WHERE id = ? AND user_id = ?";
  db.query(
    sql,
    [title, url,  linkId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Link not found" });
      res.json({ message: "Link updated successfully" });
    }
  );
};
// const handleRedirect = async (req, res) => {
//   const { alias } = req.params;
//   const [link] = await query("SELECT id,url FROM links WHERE alias=?", [alias]);
//   if (!link) return res.status(404).send("Not found");

//   // get real client IP
//   const ip = requestIp.getClientIp(req); // returns exact IP if possible

//   // simple device detection
//   const ua = req.headers["user-agent"] || "";
//   let device = "Unknown";
//   if (/mobile/i.test(ua)) device = "Mobile";
//   else if (/tablet/i.test(ua)) device = "Tablet";
//   else if (/windows|mac|linux/i.test(ua)) device = "Desktop";

//   const referrer = req.get("referer") || "Direct";

//   // geo lookup
//   let country = null, city = null;
//   try {
//     const r = await fetch(`https://ipapi.co/${ip}/json/`);
//     if (r.ok) {
//       const d = await r.json();
//       country = d.country_name;
//       city = d.city;
//     }
//   } catch {}

 
//   await query(
//     "INSERT INTO clicks (link_id, referrer, device, ip_address, country, city) VALUES (?, ?, ?, ?, ?, ?)",
//     [link.id, referrer, device, ip, country, city]
//   );

//   await query("UPDATE links SET clicks = clicks + 1 WHERE id=?", [link.id]);
//   res.redirect(link.url);
// };

// Single link details
const getLinkById = async (req, res) => {
  const userId = req.user.id;
  const { linkId } = req.params;
 
  try {
   const [link] = await query(
  `SELECT id, title, url, alias, shareable_url, clicks, is_alive, last_checked, created_at
   FROM links WHERE id=? AND user_id=?`,
  [linkId, userId]
);
    if (!link) return res.status(404).json({ message: "Link not found" });

    const timeline = await query(
      `SELECT DATE(created_at) AS day, COUNT(*) AS clicks
       FROM clicks WHERE link_id=? GROUP BY DATE(created_at) ORDER BY day`,
      [linkId]
    );

    const referrers = await query(
      `SELECT COALESCE(referrer,'Direct') AS name, COUNT(*) AS value
       FROM clicks WHERE link_id=? GROUP BY referrer ORDER BY value DESC`,
      [linkId]
    );

    const devices = await query(
      `SELECT device AS name, COUNT(*) AS value
       FROM clicks WHERE link_id=? GROUP BY device ORDER BY value DESC`,
      [linkId]
    );
 
    const locations = await query(
      `SELECT country, city, COUNT(*) AS value
       FROM clicks WHERE link_id=? GROUP BY country, city ORDER BY value DESC`,
      [linkId]
    );

    res.json({ ...link, timeline, referrers, devices, locations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Periodic re-check (every hour)
const cron = require("node-cron");
cron.schedule("0 * * * *", async () => {
  console.log("Running scheduled link re-check...");
  const links = await query("SELECT id, url FROM links");
  for (const l of links) {
    try {
      const alive = await checkLinkAlive(l.url);
      await query("UPDATE links SET is_alive=?, last_checked=NOW() WHERE id=?", [alive ? 1 : 0, l.id]);
    } catch (err) {
      console.error("Failed to check link:", l.url, err.message);
    }
  }
});

module.exports = {
  addLink,
  getAllLinks,
  getLinkById,
  // handleRedirect,
  updateLink
};
