const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');


router.post('/add', clothingController.addItem);
router.get('/all', clothingController.getItems);
router.patch('/update/:id', clothingController.updateItem);
router.delete('/delete/:id', clothingController.deleteItem);
router.get('/notifications', clothingController.getClothingNotifications);

module.exports = router;
