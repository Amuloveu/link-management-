// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // no token at all
  if (!token) return <Navigate to="/pay" replace />;

  // you can optimistically render while API checks, or
  // for a quick solution rely on the API call inside Dashboard.
  // But simplest redirect if no token:
  return children;
}
