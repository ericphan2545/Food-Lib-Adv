// Food Database - Fetched from backend API
/**
 * Food Database - Central food data repository
 * NutriPlan Application
 */

let FOOD_DATABASE = [];

// Initialize food database from API
async function initializeFoodDatabase() {
  try {
    const response = await fetch('/api/foods');
    if (response.ok) {
      const data = await response.json();
      // Convert to the expected format if needed
      FOOD_DATABASE = data.map(food => ({
        id: food.foodId,
        name: food.name,
        emoji: food.emoji,
        calories: food.calories,
        carbs: food.carbs,
        protein: food.protein,
        fat: food.fat,
        fiber: food.fiber,
        category: food.category,
        meal: food.meal
      }));
      window.dispatchEvent(new CustomEvent('foodDatabaseLoaded'));
    } else {
      console.error('Failed to load food database');
    }
  } catch (error) {
    console.error('Error loading food database:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeFoodDatabase);
