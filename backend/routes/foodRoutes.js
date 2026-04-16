const express = require('express');
const foodController = require('../controllers/foodController');

const router = express.Router();

router.get('/', foodController.listFoods);
router.get('/:id', foodController.getFood);
router.post('/', foodController.createFood);

module.exports = router;
