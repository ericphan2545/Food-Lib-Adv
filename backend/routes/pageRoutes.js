const express = require('express');
const pageController = require('../controllers/pageController');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireLogin, pageController.home);
router.get('/meal-planner', requireLogin, pageController.mealPlanner);
router.get('/favorites', requireLogin, pageController.favorites);

module.exports = router;

