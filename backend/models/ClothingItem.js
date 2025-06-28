const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['Pieces', 'Sets'], required: true }
  },
  restockDate: { type: Date, default: Date.now },
  assignedTo: { type: String, required: true },
  status: { type: String, enum: ['available', 'expired', 'discount'], default: 'available' },
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
