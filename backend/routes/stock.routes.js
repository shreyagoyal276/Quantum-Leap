const express = require('express');
const {
  getStocks,
  restockItems,
  getRestockRecommendations,
  addStock,
  removeStock,
  deleteStock,
} = require('../controllers/stock.controller');

const router = express.Router();

router.get('/', getStocks);
router.post('/restock', restockItems);
router.get('/recommendations', getRestockRecommendations);
router.patch('/:id/add', addStock);
router.patch('/:id/remove', removeStock);
router.delete('/:id', deleteStock);

module.exports = router;
