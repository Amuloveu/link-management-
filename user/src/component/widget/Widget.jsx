import React from "react";
import "./widget.css";

function Widget({ type, amount }) {
  const data = {
    clicks:    { title: "Today's Clicks", color: "#4caf50" },
    month:     { title: "This Month",     color: "#9c27b0" },
    links:     { title: "Total Links",    color: "#2196f3" },
    allClicks: { title: "All Clicks",     color: "#ff9800" }, // added allClicks
  };

  const info = data[type];

  return (
    <div className="widget" style={{ borderTop: `5px solid ${info.color}` }}>
      <h4>{info.title}</h4>
      <p>{amount || 0}</p>
    </div>
  );
}

export default Widget;
