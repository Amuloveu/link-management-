import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";  // 👈 import edit icon
import "./Link.css";
import Sidebar from "../../component/sidebar/Sidebar";

export default function Links() {
  const [links, setLinks] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:5000/api/links/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setLinks)
      .catch(console.error);
  }, [token]);

  return (
    <div className="links-container">
      <Sidebar />
      <h1>All Links</h1>
      <table className="links-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Clicks</th>
            <th>Status</th>
            <th>Created</th>
            <th>Edit</th> {/* 👈 new column */}
          </tr>
        </thead>
        <tbody>
          {links.map((l) => (
           
               <tr  onClick={() => navigate(`/links/${l.id}`)} key={l.id}>
              <td data-label="Title">{l.title}</td>
              <td data-label="Clicks">{l.clicks}</td>
              <td data-label="Status">
                {l.is_alive ? (
                  <span className="status ok">OK</span>
                ) : (
                  <span className="status broken">Broken</span>
                )}
              </td>
              <td data-label="Created">
                {new Date(l.created_at).toLocaleDateString()}
              </td>
              <td data-label="Edit">
                <FaEdit
                  className="edit-icon"
                  onClick={() => navigate(`/links/update/${l.id}`)} // 👈 navigate to edit page
                />
              </td>
            </tr>
        
          ))}
        </tbody>
      </table>
    </div>
  );
}
