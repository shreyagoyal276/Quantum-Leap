import React, { useState } from "react";
import axios from "axios";
import '../styles/ClothingBilling.css';

const ClothingBilling = ({ items, onBill }) => {
  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState("");

  const handleBill = async () => {
    const item = items.find(i => i._id === selected);
    const newQty = item.quantity.value - Number(qty);
    if (newQty < 0) return alert("Not enough stock");

    await axios.patch(`http://localhost:5000/api/clothing/update/${selected}`, {
      quantity: { value: newQty, unit: item.quantity.unit }
    }, { withCredentials: true });

    await axios.post("http://localhost:5000/api/clothing-billing/log", {
      itemId: item._id,
      itemName: item.name,
      quantityBilled: Number(qty),
      unit: item.quantity.unit
    }, { withCredentials: true });

    setQty("");
    setSelected("");
    onBill();
  };

  return (
    <div className="clothing-billing-container">
      <h2 className="billing-title">🧾 Bill Clothing Item</h2>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="billing-input"
      >
        <option value="">Select item</option>
        {items.map(item => (
          <option key={item._id} value={item._id}>
            {item.name} ({item.quantity.value} {item.quantity.unit})
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Quantity to bill"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        className="billing-input"
      />
      <button onClick={handleBill} className="billing-button">Bill</button>
    </div>
  );
};

export default ClothingBilling;
