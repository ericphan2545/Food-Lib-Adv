const User = require('../models/User');

// Get user favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add favorite
exports.addFavorite = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId || !Number.isInteger(foodId) || foodId < 1) {
      return res.status(400).json({ error: 'Invalid food ID' });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.favorites.includes(foodId)) {
      user.favorites.push(foodId);
      await user.save();
    }

    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove favorite
exports.removeFavorite = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId || !Number.isInteger(foodId) || foodId < 1) {
      return res.status(400).json({ error: 'Invalid food ID' });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const index = user.favorites.indexOf(foodId);
    if (index > -1) {
      user.favorites.splice(index, 1);
      await user.save();
    }

    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId || !Number.isInteger(foodId) || foodId < 1) {
      return res.status(400).json({ error: 'Invalid food ID' });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const index = user.favorites.indexOf(foodId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(foodId);
    }
    await user.save();

    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
