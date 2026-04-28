const express = require('express');
const foodController = require('../controllers/foodController');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

router.get('/', foodController.listFoods);
router.get('/:id', foodController.getFood);
router.post('/', requireLogin, foodController.createFood);
router.put('/:id', requireLogin, foodController.updateFood);
router.delete('/:id', requireLogin, foodController.deleteFood);

module.exports = router;
