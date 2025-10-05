import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./edit.css"; // Import the CSS

const Edit = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [linkData, setLinkData] = useState({ title: "", url: "" });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/links/${linkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLinkData({ title: res.data.title, url: res.data.url });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [linkId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinkData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/links/${linkId}`, linkData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Link updated successfully");
        navigate(`/links/${linkId}`);
      })
      .catch((err) => {
        console.error(err);
        alert( err.response?.data?.message);
      });
  };

  if (loading)
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container">
      <div className="card">
        <h2>Edit Link</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={linkData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>URL</label>
            <input
              type="url"
              name="url"
              value={linkData.url}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Update </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
