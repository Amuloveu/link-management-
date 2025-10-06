// src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import './login.css'
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    const { token, isPremium } = res.data;
    localStorage.setItem("token", token);

    // ✅ Decide where to go based on backend info
   if (res.data.trialEnd && new Date(res.data.trialEnd) > new Date()) {
  navigate("/dashboard"); // still on trial
} else if (res.data.isPremium) {
  navigate("/dashboard");
} else {
  navigate("/pay");
}

  } catch (err) {
    setMessage(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="login-container" style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      <p>if you don't have an account, <Link to='/register'> register</Link></p> 
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
