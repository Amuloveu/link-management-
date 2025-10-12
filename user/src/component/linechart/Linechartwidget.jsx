// import React, { useMemo, useState } from "react";
// import {
//   VictoryChart,
//   VictoryLine,
//   VictoryAxis,
//   VictoryTooltip,
//   VictoryVoronoiContainer,
// } from "victory";

// export default function LineChartWidget({ timeline }) {
//   const [range, setRange] = useState("7d");

//   const data = useMemo(() => {
//     if (!timeline || !timeline.length) return [];

//     const grouped = {};
//     timeline.forEach((t) => {
//       if (!t?.day) return;
//       const d = new Date(t.day);
//       if (isNaN(d)) return;

//       const key = d.toISOString().split("T")[0];
//       if (!grouped[key]) grouped[key] = { day: d, clicksPerDay: 0, linksPerDay: 0 };
//       grouped[key].clicksPerDay += t.clicksPerDay || 0;
//       grouped[key].linksPerDay += t.linksPerDay || 0;
//     });

//     return Object.values(grouped).sort((a, b) => a.day - b.day);
//   }, [timeline]);

//   if (!data.length) return <p>No data available</p>;

//   // Calculate visible range for X-axis
//   const rangeDays = { "7d": 7, "30d": 30, "1y": 365, all: data.length }[range];
//   const visibleData = data.slice(-rangeDays);
//   const xDomainStart = visibleData[0].day;
//   const xDomainEnd = visibleData[visibleData.length - 1].day;

//   return (
//     <div style={{ width: "100%", overflowX: "auto", border: "1px solid #ccc" }}>
//       <div style={{ marginBottom: 12, textAlign: "center" }}>
//         <button onClick={() => setRange("7d")}>Last 7 Days</button>
//         <button onClick={() => setRange("30d")} style={{ marginLeft: 8 }}>
//           Last 30 Days
//         </button>
//         <button onClick={() => setRange("1y")} style={{ marginLeft: 8 }}>
//           Last Year
//         </button>
//         <button onClick={() => setRange("all")} style={{ marginLeft: 8 }}>
//           Lifetime
//         </button>
//       </div>

//       <div style={{ minWidth: 700, maxWidth: "100%", padding: 8 }}>
//         <VictoryChart
//           width={700} // Fixed width
//           height={400}
//           scale={{ x: "time" }}
//           domain={{ x: [xDomainStart, xDomainEnd] }}
//           containerComponent={
//             <VictoryVoronoiContainer
//               labels={({ datum }) =>
//                 datum
//                   ? `${datum.day.toLocaleDateString()}\nClicks: ${datum.clicksPerDay}\nLinks: ${datum.linksPerDay}`
//                   : ""
//               }
//               labelComponent={<VictoryTooltip cornerRadius={4} flyoutPadding={8} />}
//             />
//           }
//         >
//           <VictoryAxis
//             fixLabelOverlap
//             tickFormat={(t) =>
//               t instanceof Date
//                 ? t.toLocaleDateString("en-US", { month: "short", day: "numeric" })
//                 : ""
//             }
//             style={{ tickLabels: { angle: -25, fontSize: 10, padding: 5 } }}
//           />
//           <VictoryAxis dependentAxis />
//           <VictoryLine
//             data={data}
//             x="day"
//             y="clicksPerDay"
//             style={{ data: { stroke: "#4caf50" } }}
//           />
//           <VictoryLine
//             data={data}
//             x="day"
//             y="linksPerDay"
//             style={{ data: { stroke: "#2196f3" } }}
//           />
//         </VictoryChart>

//         <div style={{ display: "flex", justifyContent: "center", marginTop: 6, gap: 16 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//             <div style={{ width: 10, height: 10, background: "#4caf50" }} />
//             <span style={{ fontSize: 12 }}>Clicks</span>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//             <div style={{ width: 10, height: 10, background: "#2196f3" }} />
//             <span style={{ fontSize: 12 }}>Links</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";

export default function LineChartWidget({ timeline }) {
  const [range, setRange] = useState("7d");
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(700);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const data = useMemo(() => {
    if (!timeline?.length) return [];
    const grouped = {};
    timeline.forEach((t) => {
      if (!t?.day) return;
      const d = new Date(t.day);
      if (isNaN(d)) return;
      const key = d.toISOString().split("T")[0];
      if (!grouped[key]) grouped[key] = { day: d, clicksPerDay: 0, linksPerDay: 0 };
      grouped[key].clicksPerDay += t.clicksPerDay || 0;
      grouped[key].linksPerDay += t.linksPerDay || 0;
    });
    return Object.values(grouped).sort((a, b) => a.day - b.day);
  }, [timeline]);

  if (!data.length) return <p style={{ textAlign: "center" }}>No data available</p>;

  const rangeMap = { "7d": 7, "30d": 30, "1y": 365, all: data.length };
  const visibleData = data.slice(-rangeMap[range]);

  const chartWidth = containerWidth;
  const COLORS = { clicks: "var(--accent)", links: "#2196f3" };

  return (
    <div style={{ width: "100%" }} ref={containerRef}>
      {/* Range Buttons */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        {["7d", "30d", "1y", "all"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              margin: "0 4px",
              padding: "6px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: range === r ? "var(--accent)" : "var(--panel)",
              color: range === r ? "#00110b" : "var(--text)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {r === "7d"
              ? "Last 7 Days"
              : r === "30d"
              ? "Last 30 Days"
              : r === "1y"
              ? "Last Year"
              : "Lifetime"}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div
        style={{
          overflowX: "auto",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: 8,
          background: "var(--panel)",
        }}
      >
        <VictoryChart
          width={chartWidth}
          height={350}
          scale={{ x: "time" }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) =>
                datum
                  ? `${datum.day.toLocaleDateString()}\nClicks: ${datum.clicksPerDay}\nLinks: ${datum.linksPerDay}`
                  : ""
              }
              labelComponent={<VictoryTooltip cornerRadius={4} flyoutPadding={6} />}
            />
          }
        >
          <VictoryAxis
            fixLabelOverlap
            tickFormat={(t) =>
              t instanceof Date ? t.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""
            }
            style={{
              tickLabels: { angle: -25, fontSize: 10, padding: 6, fill: "var(--text)" },
              grid: { stroke: "rgba(255,255,255,0.05)" },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 10, fill: "var(--text)" },
              grid: { stroke: "rgba(255,255,255,0.05)" },
            }}
          />

          <VictoryLine
            data={visibleData}
            x="day"
            y="clicksPerDay"
            interpolation="monotoneX"
            style={{ data: { stroke: COLORS.clicks, strokeWidth: 3 } }}
          />
          <VictoryLine
            data={visibleData}
            x="day"
            y="linksPerDay"
            interpolation="monotoneX"
            style={{ data: { stroke: COLORS.links, strokeWidth: 3 } }}
          />
        </VictoryChart>

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8, gap: 20 }}>
          {Object.entries(COLORS).map(([key, color]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 14, background: color, borderRadius: 4 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
