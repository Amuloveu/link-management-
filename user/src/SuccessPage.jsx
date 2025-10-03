// src/SuccessPage.jsx
export default function SuccessPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎉 Payment Successful!</h1>
      <p>Your account has been upgraded to <b>Pro</b>.</p>
      <a href="/dashboard">Go back to Dashboard</a>
    </div>
  );
}
