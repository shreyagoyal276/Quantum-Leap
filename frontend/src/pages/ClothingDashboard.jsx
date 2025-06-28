import React, { useEffect, useState } from "react";
import axios from "axios";
import ClothingRestock from "../components/ClothingRestock";
import ClothingBilling from "../components/ClothingBilling";
import ClothingNotifications from "../components/ClothingNotifications";
import ClothingBillingHistory from "../components/ClothingBillingHistory";
import ClothingStockGraph from "../components/ClothingStockGraph";
import ClothingSalesGraph from "../components/ClothingSalesGraph";
import "../styles/ClothingDashboard.css";

const ClothingDashboard = () => {
  const [items, setItems] = useState([]);
  const [showInventory, setShowInventory] = useState(false);

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/api/clothing/all", {
      withCredentials: true,
    });
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="clothing-dashboard">
      <h1 className="dashboard-title">Clothing Inventory Dashboard</h1>

      <ClothingNotifications />
      <ClothingStockGraph items={items} />
      <ClothingSalesGraph />
      <ClothingRestock onRestock={fetchItems} />
      <ClothingBilling items={items} onBill={fetchItems} />
      <ClothingBillingHistory />

      <button className="inventory-button" onClick={() => setShowInventory(true)}>
        Inventory
      </button>

      {showInventory && (
        <div className="overlay">
          <div className="inventory-modal">
            <button className="close-button" onClick={() => setShowInventory(false)}>
              &times;
            </button>
            <h2 className="inventory-title">Full Clothing Inventory</h2>
            <div className="inventory-table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Restocked On</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        {item.quantity.value} {item.quantity.unit}
                      </td>
                      <td>{item.status}</td>
                      <td>{new Date(item.restockDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClothingDashboard;
