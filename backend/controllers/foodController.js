const Food = require('../models/Food');
const Recipe = require('../models/Recipe');

// Get all foods
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ foodId: 1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get food by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findOne({ foodId: req.params.id });
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get recipe by name
exports.getRecipeByName = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ name: req.params.name });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search recipes by filters
exports.searchRecipes = async (req, res) => {
  try {
    const { search, category, difficulty, time } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (category && category !== 'Tất cả') {
      query.category = category;
    }
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    
    if (time && time !== 'all') {
      const parseTime = (timeString) => {
        const match = timeString.match(/(\d+)/);
        return match ? parseInt(match[0]) : 0;
      };
      
      if (time === 'under_30') {
        query.$expr = { $lt: [{ $toInt: { $arrayElemAt: [{ $split: ['$time', ' '] }, 0] } }, 30] };
      } else if (time === '30_60') {
        query.$expr = { 
          $and: [
            { $gte: [{ $toInt: { $arrayElemAt: [{ $split: ['$time', ' '] }, 0] } }, 30] },
            { $lte: [{ $toInt: { $arrayElemAt: [{ $split: ['$time', ' '] }, 0] } }, 60] }
          ] 
        };
      } else if (time === 'over_60') {
        query.$expr = { $gt: [{ $toInt: { $arrayElemAt: [{ $split: ['$time', ' '] }, 0] } }, 60] };
      }
    }
    
    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
