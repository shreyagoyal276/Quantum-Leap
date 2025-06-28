const mongoose = require('mongoose');

const clothingBillingSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', required: true },
  itemName: String,
  quantityBilled: Number,
  unit: String,
  billedBy: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClothingBilling', clothingBillingSchema);
