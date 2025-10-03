import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../component/sidebar/Sidebar";
import Widget from "../../component/widget/Widget";
import LineChartWidget from "../../component/linechart/Linechartwidget";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./dash.scss";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = (val) => setIsOpen(val !== undefined ? val : !isOpen);

  const mapReferrerToPlatform = (referrer) => {
    if (!referrer || referrer === "unknown") return "Unknown";
    const r = referrer.toLowerCase();
    if (r.includes("youtube")) return "YouTube";
    if (r.includes("tiktok")) return "TikTok";
    if (r.includes("facebook")) return "Facebook";
    if (r.includes("instagram")) return "Instagram";
    if (r.includes("twitter")) return "Twitter";
    if (r.includes("linkedin")) return "LinkedIn";
    if (r.includes("reddit")) return "Reddit";
    if (r.includes("pinterest")) return "Pinterest";
    if (r.includes("snapchat")) return "Snapchat";
    if (r.includes("whatsapp")) return "WhatsApp";
    if (r.includes("telegram") || r.includes("t.me")) return "Telegram";
    if (r.includes("discord")) return "Discord";
    if (r.includes("quora")) return "Quora";
    if (r.includes("medium")) return "Medium";
    if (r.includes("tumblr")) return "Tumblr";
    if (r.includes("vimeo")) return "Vimeo";
    if (r.includes("twitch")) return "Twitch";
    if (r.includes("clubhouse")) return "Clubhouse";
    if (r.includes("slack")) return "Slack";
    if (r.includes("flickr")) return "Flickr";
    if (r.includes("github")) return "GitHub";
    if (r.includes("bit")) return "Bitly";
    if (r.includes("weibo")) return "Weibo";
    if (r.includes("vk")) return "VK";
    if (r.includes("ok")) return "Odnoklassniki";
    if (r.includes("line")) return "LINE";
    if (r.includes("xing")) return "XING";
    if (r.includes("myspace")) return "MySpace";
    if (r.includes("dailymotion")) return "Dailymotion";
    if (r.includes("foursquare")) return "Foursquare";
    if (r.includes("soundcloud")) return "SoundCloud";
    if (r.includes("behance")) return "Behance";
    if (r.includes("dribbble")) return "Dribbble";
    if (r.includes("meetup")) return "Meetup";
    if (r.includes("patreon")) return "Patreon";
    if (r.includes("stumbleupon")) return "StumbleUpon";
    if (r.includes("mix")) return "Mix";
    if (r.includes("tripadvisor")) return "TripAdvisor";
    if (r.includes("goodreads")) return "Goodreads";
    if (r.includes("wechat")) return "WeChat";
    if (r.includes("messenger")) return "Messenger";
    if (r.includes("mixcloud")) return "Mixcloud";
    if (r.includes("anchor")) return "Anchor";
    if (r.includes("kickstarter")) return "Kickstarter";
    if (r.includes("threads.net") || r.includes("threads")) return "Threads";
    if (r.includes("mastodon")) return "Mastodon";
    if (r.includes("truthsocial")) return "Truth Social";
    if (r.includes("parler")) return "Parler";
    if (r.includes("gab")) return "Gab";
    if (r.includes("rumble")) return "Rumble";
    return "Direct";
  };

  const [data, setData] = useState({
    todayClicks: 0,
    monthClicks: 0,
    totalLinks: 0,
    lastLinks: [],
    referrers: [],
    timeline: [],
    trialEnd: null,
    premiumEnd: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayPopup, setShowPayPopup] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { setError("You must be logged in"); setLoading(false); return; }
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("https://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
        setLoading(false);

        const now = new Date();
        const trialEnd = res.data.trialEnd ? new Date(res.data.trialEnd) : null;
        const premiumEnd = res.data.premiumEnd ? new Date(res.data.premiumEnd) : null;

        if ((trialEnd && now > trialEnd && !res.data.isPremium) || (premiumEnd && now > premiumEnd)) {
          setShowPayPopup(true);
        } else { setShowPayPopup(false); }
      } catch { setError("Could not load dashboard data"); setLoading(false); }
    };
    fetchDashboard();
  }, [token]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;

  const chartData = (() => {
    const grouped = {};
    data.referrers.forEach((r) => {
      const platform = mapReferrerToPlatform(r.name);
      grouped[platform] = (grouped[platform] || 0) + r.value;
    });
    return Object.keys(grouped).map((platform) => ({ name: platform, value: grouped[platform] }));
  })();

  const PLATFORM_COLORS = ["#FF0000","#69C9D0","#3b5998","#E1306C","#1DA1F2","#0077B5","#FF4500"];

  return (
    <div className="dashboard-layout">
      <Sidebar />
     
      <main className="dashboard">
        <div className="widgets">
          <Widget type="clicks" amount={data.todayClicks} />
          <Widget type="month" amount={data.monthClicks} />
          <Widget type="links" amount={data.totalLinks} />
        </div>

        <LineChartWidget timeline={data.timeline} />

        <div className="middle">
          <div className="left">
            <h3>Last 5 Links</h3>
            <table className="last-links">
              <thead><tr><th>Title</th><th>Clicks</th><th>Date</th></tr></thead>
              <tbody>
                {data.lastLinks.length===0 ? <tr><td colSpan={3}>No links yet</td></tr> :
                  data.lastLinks.map(link => <tr key={link.id}><td>{link.title}</td><td>{link.clicks}</td><td>{new Date(link.created_at).toLocaleDateString()}</td></tr>)
                }
              </tbody>
            </table>
          </div>

          <div className="right">
            <h3>Referrer Sources</h3>
            {chartData.length===0 ? <p>No referrer data</p> :
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label minAngle={3}>
                    {chartData.map((entry, i) => <Cell key={i} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            }
          </div>
        </div>

        {showPayPopup && (
          <div className="pay-popup">
            <div className="popup-content">
              <h2>Subscription Expired</h2>
              <p>Your trial or premium subscription has ended. Please make a payment to continue.</p>
              <button onClick={() => navigate("/pay")}>Pay Now</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
