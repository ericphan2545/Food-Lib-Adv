const MealPlan = require('../models/MealPlan');
const Food = require('../models/Food');

// Get or create meal plan for user
exports.getMealPlan = async (req, res) => {
  try {
    let mealPlan = await MealPlan.findOne({ userId: req.session.user.id });
    
    if (!mealPlan) {
      mealPlan = await MealPlan.create({ userId: req.session.user.id });
    }

    res.json(mealPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update meal plan data
exports.updateMealPlan = async (req, res) => {
  try {
    const { userData, mealPlan, currentWeek, previousWeekFoods } = req.body;

    let plan = await MealPlan.findOne({ userId: req.session.user.id });
    if (!plan) {
      plan = new MealPlan({ userId: req.session.user.id });
    }

    if (userData) plan.userData = userData;
    if (mealPlan) plan.mealPlan = mealPlan;
    if (currentWeek !== undefined) plan.currentWeek = currentWeek;
    if (previousWeekFoods) plan.previousWeekFoods = previousWeekFoods;

    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save meal to specific slot
exports.saveMeal = async (req, res) => {
  try {
    const { week, day, meal, foodId } = req.body;

    let plan = await MealPlan.findOne({ userId: req.session.user.id });
    if (!plan) {
      plan = new MealPlan({ userId: req.session.user.id });
    }

    const weekKey = `week${week}`;
    if (!plan.mealPlan.get(weekKey)) {
      plan.mealPlan.set(weekKey, {
        monday: { breakfast: null, lunch: null, dinner: null },
        tuesday: { breakfast: null, lunch: null, dinner: null },
        wednesday: { breakfast: null, lunch: null, dinner: null },
        thursday: { breakfast: null, lunch: null, dinner: null },
        friday: { breakfast: null, lunch: null, dinner: null },
        saturday: { breakfast: null, lunch: null, dinner: null },
        sunday: { breakfast: null, lunch: null, dinner: null },
      });
    }

    if (foodId) {
      const food = await Food.findOne({ foodId: foodId });
      if (food) {
        const weekData = plan.mealPlan.get(weekKey);
        weekData[day][meal] = {
          id: food.foodId,
          name: food.name,
          emoji: food.emoji,
          calories: food.calories,
          carbs: food.carbs,
          protein: food.protein,
          fat: food.fat,
          fiber: food.fiber,
          category: food.category,
          meal: food.meal,
        };
        plan.mealPlan.set(weekKey, weekData);
      }
    } else {
      const weekData = plan.mealPlan.get(weekKey);
      weekData[day][meal] = null;
      plan.mealPlan.set(weekKey, weekData);
    }

    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove meal from slot
exports.removeMeal = async (req, res) => {
  try {
    const { week, day, meal } = req.body;

    let plan = await MealPlan.findOne({ userId: req.session.user.id });
    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    const weekKey = `week${week}`;
    const weekData = plan.mealPlan.get(weekKey);
    if (weekData) {
      weekData[day][meal] = null;
      plan.mealPlan.set(weekKey, weekData);
      await plan.save();
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Calculate BMI and nutrition
exports.calculateBMI = async (req, res) => {
  try {
    const { age, height, weight, gender, activityLevel } = req.body;

    if (!age || !height || !weight || !gender || !activityLevel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
    
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    const tdee = Math.round(bmr * (multipliers[activityLevel] || 1.2));
    const targetCalories = Math.round(tdee * 0.9);

    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Thiếu cân';
    else if (bmi < 24.9) bmiCategory = 'Bình thường';
    else if (bmi < 29.9) bmiCategory = 'Thừa cân';
    else bmiCategory = 'Béo phì';

    res.json({
      bmi: parseFloat(bmi),
      bmiCategory,
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Auto generate meals
exports.autoGenerateMeals = async (req, res) => {
  try {
    const { week, targetCalories } = req.body;

    if (!targetCalories) {
      return res.status(400).json({ error: 'Target calories required' });
    }

    let plan = await MealPlan.findOne({ userId: req.session.user.id });
    if (!plan) {
      plan = new MealPlan({ userId: req.session.user.id });
    }

    const weekKey = `week${week}`;
    const allFoods = await Food.find();
    const usedFoods = new Set(plan.previousWeekFoods);
    const weeklyUsage = {};
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const meals = ['breakfast', 'lunch', 'dinner'];

    if (!plan.mealPlan.get(weekKey)) {
      plan.mealPlan.set(weekKey, {
        monday: { breakfast: null, lunch: null, dinner: null },
        tuesday: { breakfast: null, lunch: null, dinner: null },
        wednesday: { breakfast: null, lunch: null, dinner: null },
        thursday: { breakfast: null, lunch: null, dinner: null },
        friday: { breakfast: null, lunch: null, dinner: null },
        saturday: { breakfast: null, lunch: null, dinner: null },
        sunday: { breakfast: null, lunch: null, dinner: null },
      });
    }

    const weekData = plan.mealPlan.get(weekKey);

    days.forEach((day) => {
      meals.forEach((mealType) => {
        let availableFoods = allFoods.filter(
          (f) => (weeklyUsage[f.foodId] || 0) < 2 && !usedFoods.has(f.foodId)
        );

        if (availableFoods.length === 0) {
          availableFoods = allFoods.filter((f) => (weeklyUsage[f.foodId] || 0) < 2);
        }

        const currentDayMeals = weekData[day];
        const usedCategories = Object.values(currentDayMeals)
          .filter((m) => m)
          .map((m) => m.category);

        let prioritized = availableFoods.filter((f) => !usedCategories.includes(f.category));
        if (prioritized.length === 0) prioritized = availableFoods;

        if (prioritized.length > 0) {
          const selected = prioritized[Math.floor(Math.random() * prioritized.length)];
          weekData[day][mealType] = {
            id: selected.foodId,
            name: selected.name,
            emoji: selected.emoji,
            calories: selected.calories,
            carbs: selected.carbs,
            protein: selected.protein,
            fat: selected.fat,
            fiber: selected.fiber,
            category: selected.category,
            meal: selected.meal,
          };
          weeklyUsage[selected.foodId] = (weeklyUsage[selected.foodId] || 0) + 1;
        }
      });
    });

    plan.mealPlan.set(weekKey, weekData);
    await plan.save();

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
