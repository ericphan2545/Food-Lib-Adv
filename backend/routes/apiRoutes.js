const express = require('express');
const foodController = require('../controllers/foodController');
const favoritesController = require('../controllers/favoritesController');
const mealPlanController = require('../controllers/mealPlanController');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

// Food & Recipe endpoints
router.get('/foods', foodController.getAllFoods);
router.get('/foods/:id', foodController.getFoodById);
router.get('/recipes', foodController.getAllRecipes);
router.get('/recipes/:name', foodController.getRecipeByName);
router.get('/recipes/search', foodController.searchRecipes);

// Favorites endpoints
router.get('/favorites', requireLogin, favoritesController.getFavorites);
router.post('/favorites/add', requireLogin, favoritesController.addFavorite);
router.post('/favorites/remove', requireLogin, favoritesController.removeFavorite);
router.post('/favorites/toggle', requireLogin, favoritesController.toggleFavorite);

// Meal Plan endpoints
router.get('/meal-plans', requireLogin, mealPlanController.getMealPlan);
router.post('/meal-plans/update', requireLogin, mealPlanController.updateMealPlan);
router.post('/meal-plans/save-meal', requireLogin, mealPlanController.saveMeal);
router.post('/meal-plans/remove-meal', requireLogin, mealPlanController.removeMeal);
router.post('/meal-plans/calculate-bmi', requireLogin, mealPlanController.calculateBMI);
router.post('/meal-plans/auto-generate', requireLogin, mealPlanController.autoGenerateMeals);

module.exports = router;
