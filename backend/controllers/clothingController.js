const ClothingItem = require('../models/ClothingItem');

// Add new clothing item
exports.addItem = async (req, res) => {
  try {
    const item = new ClothingItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all clothing items
exports.getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update quantity
exports.updateItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    await ClothingItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Clothing Notifications (low stock, expired, weather-based)
exports.getClothingNotifications = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    const now = new Date();
    const notifications = [];

    items.forEach(item => {
      const expiryDate = new Date(item.restockDate);
      expiryDate.setMonth(expiryDate.getMonth() + 2);

      // 1. Expired
      if (now >= expiryDate && item.status !== 'expired') {
        notifications.push({
          message: `${item.name} is outdated. Please replace it.`,
          status: 'expired'
        });
      }

      // 2. Low stock
      if (item.quantity.value < 15) {
        notifications.push({
          message: `${item.name} is low in stock. Consider restocking.`,
          status: 'low'
        });
      }
    });

    // 3. Weather-based suggestion 
    const currentWeather = "summer"; // can replace with API 
    if (currentWeather === "summer") {
      notifications.push({
        message: `☀️ It's summer! Restock lightweight clothes like T-shirts & cotton wear.`,
        status: 'weather'
      });
    } else if (currentWeather === "rainy") {
      notifications.push({
        message: `🌧️ Rainy season ahead! Consider stocking raincoats & waterproof wear.`,
        status: 'weather'
      });
    }else if(currentWeather === "winter") {
      notifications.push({
        message: `🌧️ winter season ahead! Consider stocking Jackets & winter wears.`,
        status: 'weather'
      });
    }

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
