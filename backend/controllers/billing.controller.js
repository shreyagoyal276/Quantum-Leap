const Billing = require('../models/billing.model.js');

const addBillingEntry = async (req, res) => {
  const { name, quantity, unit, price } = req.body;

  try {
    const entry = new Billing({
      name,
      quantity,
      unit,
      price
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Error saving billing entry' });
  }
};

const getBillingHistory = async (req, res) => {
  try {
    const history = await Billing.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching billing history' });
  }
};

module.exports = {
  addBillingEntry,
  getBillingHistory
};
