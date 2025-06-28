import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/ClothingNotifications.css';

const ClothingNotifications = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/clothing/notifications", { withCredentials: true })
      .then((res) => setAlerts(res.data));
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="notification-box">
      <h2 className="notification-title">Notifications</h2>
      <ul className="notification-list">
        {alerts.map((n, i) => (
          <li key={i}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClothingNotifications;
