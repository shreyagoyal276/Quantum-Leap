import React, { useState } from 'react';
import Navbar from './Navbar';
import '../styles/Restock.css';

const Restock = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ quantity: '', unit: 'Kg', expiry: '', name: '' });

  const handleAddItem = () => {
    const { quantity, unit, expiry, name } = newItem;

    if (!quantity || !expiry || !name) {
      alert("Please fill all fields: Name, Quantity, and Expiry.");
      return;
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert("Quantity should be a valid number greater than 0.");
      return;
    }

    const id = items.length + 1;
    setItems([...items, { id, name, quantity: parsedQuantity, unit, expiry }]);
    setNewItem({ quantity: '', unit: 'Kg', expiry: '', name: '' });
  };

  const handleUpdateItem = (id, delta) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, parseInt(item.quantity) + delta) }
        : item
    ));
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleConfirmRestock = async () => {
    if (!window.confirm("Are you sure you want to add these items to stock?")) return;

    try {
      const response = await fetch("http://localhost:5000/api/stocks/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items)
      });

      if (response.ok) {
        alert("Items successfully added to stocks");
        setItems([]);
      } else {
        alert("Failed to restock items");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while restocking");
    }
  };

  return (
    <div className="restock-wrapper">
      <Navbar />
      <div className="restock-container">
        <h2 className="restock-title">Restock Form</h2>

        <div className="restock-form">
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          />
          <select
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          >
            <option>Kg</option>
            <option>L</option>
            <option>Packets</option>
          </select>
          <input
            type="date"
            value={newItem.expiry}
            onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
          />
          <input
            type="text"
            placeholder="Assigned Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <button onClick={handleAddItem} className="add-item-btn">Add Item</button>
        </div>

        <table className="restock-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ id, name, quantity, unit, expiry }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{quantity} {unit}</td>
                <td>{expiry}</td>
                <td className="restock-actions">
                  <button onClick={() => handleUpdateItem(id, 1)} className="plus">+</button>
                  <button onClick={() => handleUpdateItem(id, -1)} className="minus">-</button>
                  <button onClick={() => handleDeleteItem(id)} className="delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length > 0 && (
          <div className="confirm-btn-wrapper">
            <button onClick={handleConfirmRestock} className="confirm-btn">
              Confirm Restock
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restock;
