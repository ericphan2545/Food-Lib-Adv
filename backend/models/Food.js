const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    foodId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    emoji: { type: String },
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true },
    category: { type: String, required: true },
    meal: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);
