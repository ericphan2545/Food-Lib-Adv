const express = require('express');
const foodController = require('../controllers/foodController');

const router = express.Router();

router.get('/', foodController.listFoods);
router.get('/:id', foodController.getFood);
router.post('/', foodController.createFood);
router.put('/:id', foodController.updateFood);
router.delete('/:id', foodController.deleteFood);

module.exports = router;
