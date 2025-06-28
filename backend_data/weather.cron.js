const axios = require('axios');
const cron = require('node-cron');
const Holidays = require('date-holidays');
const Notification = require('./models/notification.model.js');

const API_KEY = '27f32bb3dd7615d64dc459b67f61aaa0';
const CITY = 'Indore';
const COUNTRY = 'IN';

const checkWeatherAndNotify = async () => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`
    );
    const temp = res.data.main.temp;

    let message = null;
    if (temp > 35) {
      message = "it's hot! Restock summer items like drinks and coolers.";
    } else if (temp < 10) {
      message = 'Cold weather! Consider stocking warm snacks and beverages.';
    }

    if (message) {
      // Remove existing weather-related notifications
      await Notification.deleteMany({
        message: { $regex: /(hot|cold|weather)/i }
      });

      // Save the new weather notification
      await Notification.create({ message });
      console.log('✅ New weather notification created:', message);
    }

    return temp;
  } catch (err) {
    console.error('Error fetching weather:', err.message);
    return null;
  }
};

const checkFestivalNotifications = async () => {
  try {
    const hd = new Holidays('IN');
    const today = new Date();
    const upcoming = hd.getHolidays(today.getFullYear());

    for (const fest of upcoming) {
      const festDate = new Date(fest.date);
      const diff = (festDate - today) / (1000 * 60 * 60 * 24);

      if (diff >= 6 && diff <= 7) {
        const message = `${fest.name} is on ${fest.date}. Prepare stock early!`;

        const exists = await Notification.findOne({ message });
        if (!exists) {
          await Notification.create({ message });
          console.log('Festival notification created:', message);
        }
      }
    }
  } catch (err) {
    console.error('Error checking festival notifications:', err.message);
  }
};

// Every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('⏰ Running weather and festival check...');
  await checkWeatherAndNotify();
  await checkFestivalNotifications();
});

// Also export to allow frontend-triggered refresh if needed
module.exports = { checkWeatherAndNotify, checkFestivalNotifications };
