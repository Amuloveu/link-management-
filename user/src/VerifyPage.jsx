import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const  VerifyPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");
    const transaction_id = searchParams.get("transaction_id");

    if (!tx_ref || !transaction_id) {
      setMessage("Missing payment information.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/payment/verify?tx_ref=${tx_ref}&transaction_id=${transaction_id}`
        );

        if (res.data.message) {
          setMessage(res.data.message);
          setLoading(false);

          // redirect to success page after 2 seconds
          setTimeout(() => {
            navigate(`/success?tx_ref=${tx_ref}`);
          }, 2000);
        }
      } catch (err) {
        setMessage(err.response?.data?.message || "Payment verification failed");
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (         
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? <p>Verifying your payment...</p> : <p>{message}</p>}
    </div>
  );
};

export default  VerifyPage; 
