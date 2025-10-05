import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './new.css'
export default function New() {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    alias: "",
    
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/links/add", // ✅ your backend route
        formData, {
          headers : {Authorization:`Bearer ${token}`}
        } // important if using JWT cookie auth
      );

      alert(res.data.message);
    const shareable = res.data.link?.shareable_url || res.data.link?.url || res.data.link?.alias;
navigate("/links/utm", { state: { link: shareable, linkId: res.data.link?.id } });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding link");
    }
  };

  return (
    <div className="new-link">
      <h2>Add New Link</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Alias (optional)</label>
          <input
            name="alias"
            value={formData.alias}
            onChange={handleChange}
          />
        </div>

       
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
