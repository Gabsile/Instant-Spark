import React, { useState, useEffect } from "react";

export default function FarmingTips() {
  const [tips, setTips] = useState([]);
  const [offline, setOffline] = useState(!navigator.onLine);

  // Default fallback tips (for first load or offline mode)
  const defaultTips = [
    { title: "Soil Care", content: "Use compost and mulch to keep soil healthy." },
    { title: "Drought-Resistant Crops", content: "Plant crops like sorghum, millet, or cowpeas." },
    { title: "Livestock Health", content: "Feed animals well and vaccinate them regularly." },
    { title: "Irrigation", content: "Use drip irrigation to save water." },
    { title: "Pest Control", content: "Use natural repellents and crop rotation to reduce pests." },
    { title: "Soil Health Monitoring", content: "Test soil nutrients and balance fertilizer use." },
  ];

  useEffect(() => {
    // Load offline or online data
    if (navigator.onLine) {
      fetch("http://localhost:5000/api/tips")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setTips(data);
            localStorage.setItem("farmingTips", JSON.stringify(data)); // save offline
          } else {
            setTips(defaultTips);
          }
        })
        .catch(() => loadOfflineTips());
    } else {
      loadOfflineTips();
    }

    // Track online/offline state
    window.addEventListener("offline", () => setOffline(true));
    window.addEventListener("online", () => setOffline(false));
  }, []);

  const loadOfflineTips = () => {
    const saved = localStorage.getItem("farmingTips");
    if (saved) {
      setTips(JSON.parse(saved));
    } else {
      setTips(defaultTips);
    }
  };

  return (
    <section className="tips">
      <h2>🌾 Farming Education Hub</h2>
      {offline && <p style={{ color: "orange" }}>Offline Mode – Showing Saved or Default Tips</p>}

      {tips.length === 0 ? (
        <p>Loading farming tips...</p>
      ) : (
        tips.map((tip, index) => (
          <div key={index} className="tip-card">
            <h3>{tip.title}</h3>
            <p>{tip.content}</p>
          </div>
        ))
      )}
    </section>
  );
}

