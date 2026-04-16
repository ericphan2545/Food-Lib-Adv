const express = require('express');
const foodController = require('../controllers/foodController');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

router.get('/', foodController.listFoods);
router.get('/:id', foodController.getFood);
// Bug 4 fix: chặn user chưa đăng nhập tạo món mới
router.post('/', requireLogin, foodController.createFood);

module.exports = router;
