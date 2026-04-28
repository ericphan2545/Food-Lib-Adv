const express = require('express');
const aiMealAdviceController = require('../controllers/aiMealAdviceController');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

// Tư vấn AI theo nguyên liệu + BMI (yêu cầu login để tránh lạm dụng API key)
router.post('/advice', requireLogin, aiMealAdviceController.getAdvice);
router.get('/history', requireLogin, aiMealAdviceController.getHistory);

module.exports = router;

