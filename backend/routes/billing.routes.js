const express = require('express');
const { addBillingEntry, getBillingHistory } = require('../controllers/billing.controller.js');

const router = express.Router();

router.post('/', addBillingEntry);
router.get('/history', getBillingHistory);

module.exports = router;
