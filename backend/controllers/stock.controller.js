const Stock = require("../models/Stock.js");
const Notification = require("../models/notification.model.js");

// Get all stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stocks" });
  }
};

// Restock: Add or update stocks (treat different expiry as separate items)
const restockItems = async (req, res) => {
  try {
    const items = req.body;

    for (const item of items) {
      const existing = await Stock.findOne({
        name: item.name,
        unit: item.unit,
        expiry: item.expiry,
      });

      if (existing) {
        existing.quantity += parseInt(item.quantity);
        await existing.save();
      } else {
        const newItem = new Stock(item);
        await newItem.save();
      }
    }

    res.json({ message: "Stocks updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to restock items" });
  }
};

// Get restock recommendations and create notifications
const getRestockRecommendations = async (req, res) => {
  try {
    const stocks = await Stock.find();

    const today = new Date();
    const grouped = {};

    for (const item of stocks) {
      const isExpired = new Date(item.expiry) < today;
      const key = `${item.name}-${item.unit}`;

      if (!grouped[key]) {
        grouped[key] = {
          name: item.name,
          unit: item.unit,
          totalQuantity: 0,
        };
      }

      grouped[key].totalQuantity += isExpired ? 0 : item.quantity;
    }

    const threshold = 25;
    const recommendations = Object.values(grouped).filter(
      (item) => item.totalQuantity < threshold
    );

    // 🔔 Check for new low-stock items and create notifications
    for (const item of recommendations) {
      const relatedItemKey = `${item.name}-${item.unit}`;
      const exists = await Notification.findOne({
        type: "restock",
        relatedItem: relatedItemKey,
      });

      if (!exists) {
        await Notification.create({
          type: "restock",
          message: `📦 Low stock: Restock ${item.name} (${item.unit}) soon.`,
          relatedItem: relatedItemKey,
        });

        console.log(
          `🔔 New restock notification created for ${relatedItemKey}`
        );
      }
    }

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate recommendations" });
  }
};

// Notify when grouped stock is low
const notifyRestockRecommendations = async (req, res) => {
  try {
    const stocks = await Stock.find();
    const today = new Date();
    const grouped = {};

    for (const item of stocks) {
      const isExpired = new Date(item.expiry) < today;
      const key = `${item.name}-${item.unit}`;

      if (!grouped[key]) {
        grouped[key] = {
          name: item.name,
          unit: item.unit,
          totalQuantity: 0,
        };
      }

      grouped[key].totalQuantity += isExpired ? 0 : item.quantity;
    }

    const threshold = 25;

    for (const entry of Object.values(grouped)) {
      if (entry.totalQuantity < threshold) {
        const message = `📦 Low stock alert: ${entry.name} (${entry.unit}) total is below 25. Consider restocking.`;

        const exists = await Notification.findOne({ message });
        if (!exists) {
          await Notification.create({ message });
          console.log("🔔 Restock Notification Created:", message);
        }
      }
    }

    res
      .status(200)
      .json({ message: "Restock notifications generated successfully." });
  } catch (err) {
    console.error("Restock notify error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to generate restock notifications." });
  }
};

// Add quantity to stock
const addStock = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    await Stock.findByIdAndUpdate(id, { $inc: { quantity: amount } });
    res.status(200).json({ message: "Stock increased" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to stock" });
  }
};

// Remove quantity from stock
const removeStock = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    await Stock.findByIdAndUpdate(id, { $inc: { quantity: -amount } });
    res.status(200).json({ message: "Stock reduced" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from stock" });
  }
};

// Delete a stock item
const deleteStock = async (req, res) => {
  const { id } = req.params;
  try {
    await Stock.findByIdAndDelete(id);
    res.status(200).json({ message: "Stock deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete stock" });
  }
};

module.exports = {
  getStocks,
  restockItems,
  getRestockRecommendations,
  addStock,
  removeStock,
  deleteStock,
};
