import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../styles/Billing.css';

const Billing = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/stocks")
      .then(res => res.json())
      .then(data => setStocks(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/billing/history")
      .then(res => res.json())
      .then(data => setBillingHistory(data));
  }, []);

  const handleAddToBill = () => {
    const item = stocks.find(i => i._id === selectedItem);
    if (!item || !quantity || !price) return;

    setBillItems([
      ...billItems,
      {
        id: item._id,
        name: item.name,
        quantity: parseInt(quantity),
        unit: item.unit,
        price: parseFloat(price),
        total: parseInt(quantity) * parseFloat(price)
      }
    ]);

    setSelectedItem('');
    setQuantity('');
    setPrice('');
  };

  const handleConfirmBill = async () => {
    if (billItems.length === 0) return;

    try {
      for (const item of billItems) {
        await fetch(`http://localhost:5000/api/stocks/${item.id}/remove`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: item.quantity }),
        });

        await fetch("http://localhost:5000/api/billing", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price
          })
        });
      }

      alert("Billing successful and stock updated");
      setBillItems([]);
      const res = await fetch("http://localhost:5000/api/billing/history");
      const updatedHistory = await res.json();
      setBillingHistory(updatedHistory);
    } catch (err) {
      console.error(err);
      alert("Error during billing");
    }
  };

  return (
    <div className="billing-page">
      <Navbar />
      <div className="billing-container">
        <h2 className="section-title">Billing Section</h2>

        <div className="input-grid">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="input-field"
          >
            <option value="">Select Item</option>
            {stocks.map(stock => (
              <option key={stock._id} value={stock._id}>
                {stock.name} ({stock.quantity} {stock.unit})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            className="input-field"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            className="input-field"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button onClick={handleAddToBill} className="add-button">
            Add to Bill
          </button>
        </div>

        {billItems.length > 0 && (
          <>
            <table className="billing-table">
              <thead>
                <tr className="table-header">
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {billItems.map((item, i) => (
                  <tr key={i} className="table-row">
                    <td>{item.name}</td>
                    <td>{item.quantity} {item.unit}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="total-section">
              <h3>Total: ₹{billItems.reduce((sum, i) => sum + i.total, 0)}</h3>
              <button onClick={handleConfirmBill} className="confirm-button">
                Confirm Billing
              </button>
            </div>
          </>
        )}

        <div className="history-section">
          <h2 className="section-title">Billing History</h2>
          {billingHistory.length === 0 ? (
            <p className="no-history">No billing records found.</p>
          ) : (
            <table className="billing-table">
              <thead>
                <tr className="table-header">
                  <th>S.No.</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((entry, index) => (
                  <tr key={entry._id} className="table-row">
                    <td>{index + 1}</td>
                    <td>{entry.name}</td>
                    <td>{entry.quantity}</td>
                    <td>{entry.unit}</td>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
