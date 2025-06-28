import React, { useEffect, useState } from 'react';
import '../styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  const handleRefresh = () => {
    console.log("🔁 Refresh button clicked");
    fetch('http://localhost:8000/refresh-missing', {
      method: 'POST'
    })
    .then(res => {
      console.log("✅ Got response from backend:", res.status);
      return res.json();
    })
      .then(data => {
        const existing = data.notifications || [];

        console.log("📦 Data from /refresh-missing:", data);
        const missing = data.missing || [];
        const trendWarnings = missing.map(product => ({
          message: `⚠️ Product '${product}' is trending but missing in inventory.`,
          date: new Date().toISOString()
        }));
        setNotifications(prev => [...trendWarnings, ...existing]);
      })
      .catch(err => console.error('Refresh failed:', err));
  };


  useEffect(() => {
    fetch('http://localhost:5000/api/notifications')
      .then(res => res.json())

      .then(data => {
        const existing = data.notifications || [];
        setNotifications(existing);

        const lastRun = localStorage.getItem("lastTrendCheck");
        const now = new Date();
        const isSameDay = lastRun && new Date(lastRun).toDateString() === now.toDateString();

        const fetchMissing = () => {
          fetch('http://localhost:8000/refresh-missing', {
            method: 'POST'
          })
            .then(res => res.json())
            .then(data => {
              const missing = data.missing || [];
              const trendWarnings = missing.map(product => ({
                message: `⚠️ Product '${product}' is trending but missing in inventory.`,
                date: new Date().toISOString()
              }));
              setNotifications(prev => [...trendWarnings, ...prev]);
            })
            .catch(err => console.error('Refresh failed:', err));
        };

        if (!isSameDay) {
          fetch('http://localhost:8000/check-trends')
            .then(res => res.json())
            .then(trendData => {
              const missing = trendData["products trending now but missing in dataset"] || [];
              const trendWarnings = missing.map(product => ({
                message: `⚠️ Product '${product}' is trending but missing in inventory.`,
                date: new Date().toISOString()
              }));
              localStorage.setItem("lastTrendCheck", now.toISOString());
              setNotifications(prev => [...trendWarnings, ...prev]);
            })
            .catch(err => console.error('Error fetching trends:', err));
        } else {
          fetchMissing();
        }
      })

      // .then(data => setNotifications(data.notifications || []))
      .catch(err => console.error('Error fetching notifications:', err));
  }, []);

  return (
    <div className="notification-box">
      <h2 className="notification-title">Notifications</h2>
      <button
        className="mb-4 px-4 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600"
        onClick={handleRefresh}
      >
        🔁 Refresh
      </button>
      {notifications.length === 0 ? (
        <p className="notification-empty">No notifications yet.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((note, index) => (
            <li key={index} className="notification-item">
              {note.message}
              <span className="notification-date">
                {new Date(note.date).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
