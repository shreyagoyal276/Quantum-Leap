const cron = require('node-cron');
const mongoose = require('mongoose');
const Stock = require('./models/Stock');
const Notification = require('./models/notification.model');

cron.schedule('0 */6 * * *', async () => { // after every six hours
  console.log('Cron check for low stock');

  const stocks = await Stock.find();
  const today = new Date();
  const grouped = {};

  for (const item of stocks) {
    const isExpired = new Date(item.expiry) < today;
    const key = `${item.name}-${item.unit}`;

    if (!grouped[key]) {
      grouped[key] = { name: item.name, unit: item.unit, totalQuantity: 0 };
    }

    grouped[key].totalQuantity += isExpired ? 0 : item.quantity;
  }

  const threshold = 25;
  const recommendations = Object.values(grouped).filter(
    item => item.totalQuantity < threshold
  );

  for (const item of recommendations) {
    const key = `${item.name}-${item.unit}`;
    const exists = await Notification.findOne({ type: 'restock', relatedItem: key });

    if (!exists) {
      await Notification.create({
        type: 'restock',
        message: `Restock ${item.name} (${item.unit}) soon.`,
        relatedItem: key,
      });
      console.log(`Notification created for ${key}`);
    }
  }
});
