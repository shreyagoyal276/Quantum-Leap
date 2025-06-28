const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
    expires: 21600,
  },
  type: {
    type: String,
    enum: ['weather', 'festival', 'restock', 'trending'],
    default: 'weather',
  },
  relatedItem: { type: String },
});

module.exports = mongoose.model('Notification', notificationSchema);
