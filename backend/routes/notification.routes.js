const express = require("express");
const router = express.Router();
const Notification = require("../models/notification.model");
const {
  checkWeatherAndNotify,
} = require("../weather.cron");

router.get("/", async (req, res) => {
  try {
    const temp = await checkWeatherAndNotify();
    const notifications = await Notification.find().sort({ date: -1 });

    res.json({
      temperature: temp,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

exports.checkClothingExpiries = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    const now = new Date();

    const notifications = items.map(item => {
      const expiry = new Date(item.restockDate);
      expiry.setMonth(expiry.getMonth() + 2);

      if (now >= expiry) {
        return {
          id: item._id,
          name: item.name,
          status: 'expired',
          message: `${item.name} has expired. Consider replacing or discounting.`,
        };
      }

      const daysLeft = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7) {
        return {
          id: item._id,
          name: item.name,
          status: 'soon',
          message: `${item.name} will expire in ${daysLeft} days.`,
        };
      }

      return null;
    }).filter(Boolean);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = router;
