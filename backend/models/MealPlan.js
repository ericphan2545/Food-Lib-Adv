const mongoose = require('mongoose');

const mealSlotSchema = new mongoose.Schema({
  id: Number,
  name: String,
  emoji: String,
  calories: Number,
  carbs: Number,
  protein: Number,
  fat: Number,
  fiber: Number,
  category: String,
  meal: String,
}, { _id: false });

const dayMealSchema = new mongoose.Schema({
  breakfast: { type: mealSlotSchema, default: null },
  lunch: { type: mealSlotSchema, default: null },
  dinner: { type: mealSlotSchema, default: null },
}, { _id: false });

const weekMealSchema = new mongoose.Schema({
  monday: dayMealSchema,
  tuesday: dayMealSchema,
  wednesday: dayMealSchema,
  thursday: dayMealSchema,
  friday: dayMealSchema,
  saturday: dayMealSchema,
  sunday: dayMealSchema,
}, { _id: false });

const mealPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userData: {
      gender: { type: String, default: null },
      age: { type: Number, default: null },
      height: { type: Number, default: null },
      weight: { type: Number, default: null },
      activityLevel: { type: String, default: null },
      bmi: { type: Number, default: null },
      tdee: { type: Number, default: null },
      targetCalories: { type: Number, default: null },
    },
    currentWeek: { type: Number, default: 1 },
    mealPlan: {
      type: Map,
      of: weekMealSchema,
      default: {},
    },
    previousWeekFoods: [{ type: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('MealPlan', mealPlanSchema);
