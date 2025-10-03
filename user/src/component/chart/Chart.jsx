// components/MapChart.jsx
import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function MapChart({ locations }) {
  // Filter locations with lat/lng if available or fallback to null
  const markers = locations
    .filter((loc) => loc.lat && loc.lng)
    .map((loc, i) => ({
      coordinates: [loc.lng, loc.lat],
      name: loc.city ? `${loc.city}, ${loc.country}` : loc.country,
      value: loc.value
    }));

  return (
    <div style={{ width: "100%", maxHeight: "400px", marginBottom: "2rem" }}>
      <ComposableMap projectionConfig={{ scale: 150 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e0e0e0"
                stroke="#fff"
              />
            ))
          }
        </Geographies>

        {markers.map((marker, i) => (
          <Marker key={i} coordinates={marker.coordinates}>
            <circle r={5} fill="#2563eb" stroke="#fff" strokeWidth={1.5} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
