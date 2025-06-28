import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/ClothingBillingHistory.css';

const ClothingBillingHistory = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/clothing-billing/all", { withCredentials: true })
      .then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="billing-history-container">
      <h2 className="billing-history-title">Billing History</h2>
      <div className="billing-history-table-wrapper">
        <table className="billing-history-table">
          <thead className="billing-history-header">
            <tr>
              <th className="center-text">Item</th>
              <th className="center-text">Qty</th>
              <th className="center-text">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="billing-history-row">
                <td className="center-text">{log.itemName}</td>
                <td className="center-text">{log.quantityBilled} {log.unit}</td>
                <td className="center-text">{new Date(log.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClothingBillingHistory;
