const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper to calculate isPremium
function checkPremiumStatus(user) {
  const now = new Date();

  // Check premium subscription
  if (user.plan === "premium" && user.premium_end && now <= user.premium_end) {
    return true;
  }

  // Check trial period
  if (user.plan === "trial" && user.trial_end && now <= user.trial_end) {
    return false; // trial user is not premium
  }

  return false;
}

// Register
exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "User registered successfully" });
  });
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    // Check if user is premium (trial or paid)
    const isPremium = checkPremiumStatus(user);

    if (user.isPremium !== isPremium) {
      db.query(
        "UPDATE users SET isPremium = ? WHERE id = ?",
        [isPremium, user.id],
        (err) => {
          if (err) console.error("Failed to update isPremium:", err);
        }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email,name:user.name, isPremium },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
  token,
  isPremium,
  trialStart: user.trial_start,
  trialEnd: user.trial_end,
  premiumStart: user.premium_start,
  premiumEnd: user.premium_end
});

  });
};
