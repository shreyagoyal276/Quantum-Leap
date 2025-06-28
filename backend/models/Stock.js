const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  expiry: { type: Date, required: true },
});

module.exports = mongoose.model('Stock', stockSchema);
