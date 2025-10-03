const db = require("../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

function getUserStatus(user) {
  const now = new Date();

  // Check premium
  if (user.plan === "premium" && user.premium_end && now <= new Date(user.premium_end)) {
    return { status: "premium", isPremium: true };
  }

  // Check trial
  if (user.plan === "trial" && user.trial_end && now <= new Date(user.trial_end)) {
    return { status: "trial", isPremium: false };
  }

  // Expired
  return { status: "expired", isPremium: false };
}

exports.getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // ---------- Get user info ----------
    const userSql = `
      SELECT plan, trial_start, trial_end, premium_start, premium_end
      FROM users WHERE id = ?
    `;
    const users = await query(userSql, [userId]);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });
    const user = users[0];

    const { status, isPremium } = getUserStatus(user);

    // ---------- Totals ----------
    const totalsSql = `
      SELECT 
        (SELECT COUNT(*) FROM links WHERE user_id = ?) AS totalLinks,
        (SELECT COUNT(*) 
           FROM clicks c
           JOIN links l ON l.id = c.link_id
          WHERE l.user_id = ?) AS totalClicks,
        (SELECT COUNT(*) 
           FROM clicks c
           JOIN links l ON l.id = c.link_id
          WHERE l.user_id = ? AND DATE(c.created_at) = CURDATE()) AS todayClicks,
        (SELECT COUNT(*) 
           FROM clicks c
           JOIN links l ON l.id = c.link_id
          WHERE l.user_id = ? 
            AND MONTH(c.created_at) = MONTH(CURDATE()) 
            AND YEAR(c.created_at) = YEAR(CURDATE())
        ) AS monthClicks
    `;
    const totals = await query(totalsSql, [userId, userId, userId, userId]);

    // ---------- Last 5 links ----------
    const lastLinksSql = `
      SELECT id, title, clicks, created_at
      FROM links
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `;
    const lastLinks = await query(lastLinksSql, [userId]);

    // ---------- Referrers ----------
    const referrersSql = `
      SELECT c.referrer AS name, COUNT(*) AS value
      FROM clicks c
      JOIN links l ON l.id = c.link_id
      WHERE l.user_id = ?
      GROUP BY c.referrer
      ORDER BY value DESC
      LIMIT 5
    `;
    const referrers = await query(referrersSql, [userId]);

    // ---------- Timeline ----------
    const clicksPerDaySql = `
      SELECT DATE(c.created_at) AS day, COUNT(*) AS clicksPerDay
      FROM clicks c
      JOIN links l ON l.id = c.link_id
      WHERE l.user_id = ?
      GROUP BY DATE(c.created_at)
      ORDER BY day
    `;
    const clicksPerDay = await query(clicksPerDaySql, [userId]);

    const linksPerDaySql = `
      SELECT DATE(created_at) AS day, COUNT(*) AS linksPerDay
      FROM links
      WHERE user_id = ?
      GROUP BY DATE(created_at)
      ORDER BY day
    `;
    const linksPerDay = await query(linksPerDaySql, [userId]);

    const allDays = [
      ...new Set([
        ...clicksPerDay.map(r => r.day),
        ...linksPerDay.map(r => r.day)
      ])
    ].sort();

    let runningClicks = 0;
    let runningLinks = 0;
    const timeline = allDays.map(day => {
      const dayClicks = clicksPerDay.find(d => d.day === day)?.clicksPerDay || 0;
      const dayLinks = linksPerDay.find(d => d.day === day)?.linksPerDay || 0;
      runningClicks += dayClicks;
      runningLinks += dayLinks;
      return {
        day,
        clicksPerDay: dayClicks,
        totalClicks: runningClicks,
        linksPerDay: dayLinks,
        totalLinks: runningLinks
      };
    });

    // ---------- Return JSON ----------
    res.json({
      totalLinks: totals[0].totalLinks,
      totalClicks: totals[0].totalClicks || 0,
      todayClicks: totals[0].todayClicks || 0,
      monthClicks: totals[0].monthClicks || 0,
      lastLinks,
      referrers,
      timeline,
      trialEnd: user.trial_end,
      premiumEnd: user.premium_end,
      status,       // "trial", "premium", "expired"
      isPremium     // boolean
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
