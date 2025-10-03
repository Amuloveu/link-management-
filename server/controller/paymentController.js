const axios = require("axios");
const db = require("../config/db");

const FLW_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

// ----------------- INIT PAYMENT -----------------
exports.initPayment = async (req, res) => {
  try {
    const { id, email, name } = req.user;
    const tx_ref = `SaaS-${id}-${Date.now()}`;
    const amount = 10; // fixed amount

    // Insert into payments table as pending
    const insertSql = `INSERT INTO payments (user_id, amount, currency, status, reference, created_at) 
                       VALUES (?, ?, ?, 'pending', ?, NOW())`;
    db.query(insertSql, [id, amount, "USD", tx_ref], async (err) => {
      if (err) return res.status(500).json({ message: "DB insert failed", details: err.message });

      // Prepare Flutterwave payload
      const payload = {
        tx_ref,
        amount,
        currency: "USD",
        redirect_url: `http://localhost:5173/verify?tx_ref=${tx_ref}`, // frontend verify page
        payment_options: "card,mobilemoney,ussd",
        customer: { email, name: name || "User" },
        meta: { userId: id },
      };

      try {
        const response = await axios.post(
          "https://api.flutterwave.com/v3/payments",
          payload,
          { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}`, "Content-Type": "application/json" } }
        );
        return res.json({ paymentLink: response.data.data.link });
      } catch (err) {
        console.error("Flutterwave init error:", err.response?.data || err.message);
        return res.status(500).json({
          message: "Flutterwave payment init failed",
          details: err.response?.data || err.message,
        });
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------- VERIFY PAYMENT -----------------
exports.verifyPayment = async (req, res) => {
  try {
    const { transaction_id, tx_ref } = req.query;
    if (!transaction_id || !tx_ref)
      return res.status(400).json({ message: "Missing transaction_id or tx_ref" });

    // Verify with Flutterwave
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` } }
    );

    const data = response.data.data;
    if (data.status === "successful" && data.amount === 10 && data.currency === "USD") {
      const userId = data.meta.userId;

      // 1️⃣ Update payment status
      const updatePaymentSql = `UPDATE payments SET status='successful' WHERE reference=?`;
      db.query(updatePaymentSql, [tx_ref], (err) => {
        if (err) return res.status(500).json({ message: "Payment update failed", details: err.message });

        // 2️⃣ Upgrade user to premium
        const updateUserSql = `UPDATE users 
                               SET plan='premium', 
                                   premium_start=NOW(), 
                                   premium_end=DATE_ADD(NOW(), INTERVAL 1 MONTH), 
                                   isPremium=1 
                               WHERE id=?`;
        db.query(updateUserSql, [userId], (err) => {
          if (err) return res.status(500).json({ message: "User plan update failed", details: err.message });

          return res.json({ message: "Payment verified ✅ User upgraded to premium" });
        });
      });
    } else {
      return res.status(400).json({ message: "Payment failed or incomplete" });
    }
  } catch (err) {
    console.error("Payment verify error:", err.response?.data || err.message);
    return res.status(500).json({ message: "Server error", details: err.response?.data || err.message });
  }
};
