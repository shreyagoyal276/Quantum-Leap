const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  price: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Billing', billingSchema);
