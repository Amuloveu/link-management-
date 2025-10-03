import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Checkout() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const startPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.post(
          "http://localhost:5000/api/payment/pay",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Redirect user to Flutterwave checkout page
        window.location.href = data.paymentLink;
      } catch (err) {
        setError(err.response?.data?.message || "Payment init failed");
      } finally {
        setLoading(false);
      }
    };

    startPayment();
  }, []);

  if (loading) return <p>Redirecting to payment page…</p>;
  if (error) return <p>Error: {error}</p>;
  return null;
}
