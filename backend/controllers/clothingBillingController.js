const ClothingBilling = require('../models/ClothingBilling');

exports.Billing = async (req, res) => {
  try {
    const { itemId, itemName, quantityBilled, unit } = req.body;
    const newLog = new ClothingBilling({ itemId, itemName, quantityBilled, unit });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBillingHistory = async (req, res) => {
  try {
    const history = await ClothingBilling.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSalesData = async (req, res) => {
  try {
    const sales = await ClothingBilling.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          totalQuantity: { $sum: 1 } // or $sum: "$quantity" if it exists
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = sales.map(entry => ({
      date: entry._id,
      quantity: entry.totalQuantity,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

