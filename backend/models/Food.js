const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    // id dùng để tương thích với FOOD_DATABASE tĩnh bên client
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    emoji: { type: String, default: '🍽️' },
    calories: { type: Number, required: true, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    fat: { type: Number, default: 0, min: 0 },
    fiber: { type: Number, default: 0, min: 0 },
    category: {
      type: String,
      enum: ['carbs', 'protein', 'fat', 'fiber', 'balanced'],
      required: true,
    },
    meal: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'any'],
      default: 'any',
    },
    image: { type: String, default: '' },
    recipeCategory: { type: String, default: '' },
    time: { type: String, default: '' },
    difficulty: { type: String, default: '' },
    description: { type: String, default: '' },
    ingredients: { type: [String], default: [] },
    instructions: { type: [String], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Food', foodSchema);
