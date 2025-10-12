import { useState } from "react";
import { useLocation } from "react-router-dom";
import './utm.css'
import Sidebar from "../../component/sidebar/Sidebar";

export default function Utm() {
  const location = useLocation();

  // The created link from Add Link page
  const createdLink = location.state?.link || "";
  const [utmLinks, setUtmLinks] = useState([]);
  const [customLink, setCustomLink] = useState(createdLink);

  // Predefined UTM sources
  const utmOptions = ["youtube", "facebook", "tiktok", "instagram", "twitter"];

  // Track checkboxes
  const [selectedSources, setSelectedSources] = useState([]);
  const [titles, setTitles] = useState({});

  const handleCheckboxChange = (source) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const handleTitleChange = (source, value) => {
    setTitles((prev) => ({ ...prev, [source]: value }));
  };

  const handleUTMInputChange = (source, value) => {
    setUtmLinks((prev) =>
      prev.map((link) =>
        link.source === source ? { ...link, url: value } : link
      )
    );
  };

  const generateUTMLinks = () => {
    const linkToUse = customLink || createdLink;
    if (!linkToUse) return alert("Please provide a link first.");
    
    const links = selectedSources.map((source) => ({
      source,
      title: titles[source] || source,
      url: `${linkToUse}?utm_source=${source}`,
    }));
    setUtmLinks(links);
  };

  return (
    <>
     <Sidebar/>
    <div className="utm-page">
     
      <h1>UTM Link Creator</h1>

      {/* Instructions */}
      <div className="utm-instructions">
        <h3>How to use this page</h3>
        <ol>
          <li>{createdLink ? "Your created link is below." : "Enter your link below."}</li>
          <li>Select the platform where you want to share it (YouTube, TikTok, etc.).</li>
          <li>Click <b>Generate</b> to create links with the platform name added.</li>
          <li>Copy the link and use it when posting.</li>
        </ol>
        <p>
          👉 <b>Tip:</b> If you want to share the same link on another platform later, just come back and generate again.
        </p>
      </div>

      {/* Link input */}
      <div className="created-link">
        <label>{createdLink ? "Created Link:" : "Enter Your Link:"}</label>
        <input
          type="text"
          readOnly={!!createdLink}
          value={customLink}
          onChange={(e) => setCustomLink(e.target.value)}
          placeholder="Enter your link here"
        />
      </div>

      {/* UTM checkboxes and titles */}
      <div className="utm-options">
        <h3>Select Platforms:</h3>
        {utmOptions.map((source) => (
          <div key={source} className="utm-option">
            <input
              type="checkbox"
              id={source}
              checked={selectedSources.includes(source)}
              onChange={() => handleCheckboxChange(source)}
            />
            <label htmlFor={source}>{source}</label>

            {selectedSources.includes(source) && (
              <input
                type="text"
                placeholder={`Title for ${source}`}
                value={titles[source] || ""}
                onChange={(e) => handleTitleChange(source, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <button className="generate-btn" onClick={generateUTMLinks}>
        Generate UTM Links
      </button>

      {utmLinks.length > 0 && (
        <div className="utm-result">
          <h3>Generated UTM Links:</h3>
          {utmLinks.map((link) => (
            <div key={link.source} className="utm-link-item">
              <strong>{link.title}:</strong>{" "}
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleUTMInputChange(link.source, e.target.value)}
              />
              <button onClick={() => navigator.clipboard.writeText(link.url)}>
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div></>
  );
}
