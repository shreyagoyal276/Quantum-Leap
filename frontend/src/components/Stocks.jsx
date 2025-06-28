import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import StockGraph from './StockGraph';
import '../styles/Stocks.css';

const getColor = (qty) => {
  if (qty < 10) return 'low';
  if (qty < 25) return 'medium';
  return 'high';
};

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/stocks")
      .then(res => res.json())
      .then(data => setStocks(data))
      .catch(err => console.error("Failed to fetch stocks", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/stocks/recommendations")
      .then(res => res.json())
      .then(data => setRecommendations(data))
      .catch(err => console.error("Failed to fetch recommendations", err));
  }, []);

  const fetchStocks = () => {
    fetch("http://localhost:5000/api/stocks")
      .then(res => res.json())
      .then(data => setStocks(data))
      .catch(err => console.error("Failed to fetch stocks", err));
  };

  const handleAdd = async (id) => {
    const amount = prompt("How many items to add?");
    if (!amount || isNaN(amount)) return;

    try {
      await fetch(`http://localhost:5000/api/stocks/${id}/add`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(amount) }),
      });
      fetchStocks();
    } catch {
      alert("Error adding stock");
    }
  };

  const handleRemove = async (id) => {
    const amount = prompt("How many items to remove?");
    if (!amount || isNaN(amount)) return;

    try {
      await fetch(`http://localhost:5000/api/stocks/${id}/remove`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(amount) }),
      });
      fetchStocks();
    } catch {
      alert("Error removing stock");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(`http://localhost:5000/api/stocks/${id}`, { method: 'DELETE' });
      fetchStocks();
    } catch {
      alert("Error deleting stock");
    }
  };

  return (
    <div className="stocks-page">
      <Navbar />

      <div className="stocks-grid">
        <div className="stocks-graph">
          <StockGraph data={stocks} />
        </div>

        <div className="recommendations-panel">
          <h3 className="recommend-title">Restock Recommendations</h3>
          <ul className="recommend-list">
            {recommendations.length === 0 ? (
              <li className="recommend-empty">No restock needed</li>
            ) : (
              recommendations.map((stock, index) => (
                <li key={index} className="recommend-item">
                  {stock.name} - {stock.totalQuantity} {stock.unit}
                </li>
              ))
            )}
          </ul>
          <button onClick={() => navigate('/restock')} className="restock-btn">
            ➕ Restock
          </button>
        </div>
      </div>

      <div className="stocks-table-section">
        <h2 className="stocks-title">All Stocks</h2>
        <table className="stocks-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(({ _id, name, quantity, unit, expiry }, index) => (
              <tr key={_id}>
                <td>{index + 1}</td>
                <td>{name}</td>
                <td className={getColor(quantity)}>
                  {quantity} {unit}
                </td>
                <td>{expiry?.slice(0, 10)}</td>
                <td className="actions">
                  <button title="Add" onClick={() => handleAdd(_id)}><FaPlus /></button>
                  <button title="Remove" onClick={() => handleRemove(_id)}><FaMinus /></button>
                  <button title="Delete" onClick={() => handleDelete(_id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stocks;
