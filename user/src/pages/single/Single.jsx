import { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import Sidebar from "../../component/sidebar/Sidebar";
import "./single.css";

export default function Single() {
  const { linkId } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // toggle states
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const [showAllReferrers, setShowAllReferrers] = useState(false);
  const [showAllDevices, setShowAllDevices] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

  const fetchLink = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://localhost:5000/api/links/${linkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLink(data);
    } catch (err) {
      console.error("Error fetching link:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLink();
    const interval = setInterval(fetchLink, 30000); // auto-refresh
    return () => clearInterval(interval);
  }, [linkId]);

  if (loading) return <div className="layout">Loading...</div>;
  if (!link) return <div className="layout">Link not found</div>;

  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        {/* ==== Link Info Table ==== */}
        <div className="link-info">
          <table>
            <thead>
              <tr>
                <th>Alias</th>
                <th>URL</th>
                <th>Shareable URL</th>
                <th>Total Clicks</th>
                <th>Created</th>
                <th className="action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{link.alias}</td>
                <td>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.url}
                  </a>
                  <span
                    className={`status-badge ${
                      link.is_alive ? "alive" : "broken"
                    }`}
                  >
                    {link.is_alive ? "Alive ✅" : "Broken ❌"}
                  </span>
                </td>
                <td>
                  <a href={link.shareable_url} target="_blank" rel="noreferrer">
                    {link.shareable_url}
                  </a>
                </td>
                <td>{link.clicks}</td>
                <td>{new Date(link.created_at).toLocaleDateString()}</td>
                <td className="action">
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/links/update/${link.id}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ==== Stats Section ==== */}
        <section className="stats">

          {/* Timeline */}
          <div className="stat-card">
            <h3>
              Timeline (Clicks per Day)
              {link.timeline.length > 5 && (
                <span
                  className="toggle-text"
                  onClick={() => setShowAllTimeline(!showAllTimeline)}
                >
                  {showAllTimeline ? "Show less" : "See all"}
                </span>
              )}
            </h3>
            <ul>
              {(showAllTimeline ? link.timeline : link.timeline.slice(0, 5)).map((t, i) => (
                <li key={i}>
                  <span>{new Date(t.day).toLocaleDateString()}</span>
                  <span className="clicks-badge">{t.clicks}</span>
                </li>
              ))}
              {link.timeline.length === 0 && <li>No clicks yet</li>}
            </ul>
          </div>

          {/* Referrers */}
          <div className="stat-card">
            <h3>
              Top Referrers
             
            </h3>
            <ul>
              {(showAllReferrers ? link.referrers : link.referrers.slice(0, 5)).map((r, i) => (
                <li key={i}>
                  {r.name || "Direct"}{" "}
                  <span className="clicks-badge">{r.value}</span>
                </li>
              ))}
              {link.referrers.length === 0 && <li>No referrers yet</li>}
            </ul>
             {link.referrers.length > 5 && (
                <span
                  className="toggle-text"
                  onClick={() => setShowAllReferrers(!showAllReferrers)}
                >
                  {showAllReferrers ? "Show less" : "See all"}
                </span>
              )}
          </div>

          {/* Devices */}
          <div className="stat-card">
            <h3>
              Devices
             
            </h3>
            <ul>
              {(showAllDevices ? link.devices : link.devices.slice(0, 5)).map((d, i) => (
                <li key={i}>
                  {d.name} <span className="clicks-badge">{d.value}</span>
                </li>
              ))}
              {link.devices.length === 0 && <li>No data yet</li>}
            </ul>
             {link.devices.length > 5 && (
                <span
                  className="toggle-text"
                  onClick={() => setShowAllDevices(!showAllDevices)}
                >
                  {showAllDevices ? "Show less" : "See all"}
                </span>
              )}
          </div>

          {/* Locations */}
          <div className="stat-card">
            <h3>
              Top Locations
              {link.locations.length > 5 && (
                <span
                  className="toggle-text"
                  onClick={() => setShowAllLocations(!showAllLocations)}
                >
                  {showAllLocations ? "Show less" : "See all"}
                </span>
              )}
            </h3>
            <ul>
              {(showAllLocations ? link.locations : link.locations.slice(0, 5)).map((loc, i) => (
                <li key={i}>
                  {loc.city ? `${loc.city}, ${loc.country}` : loc.country || "Unknown"}
                  <span className="clicks-badge">{loc.value}</span>
                </li>
              ))}
              {link.locations.length === 0 && <li>No location data yet</li>}
            </ul>
          </div>

        </section>
      </main>
    </div>
  );
}
