const express = require('express');
const profileController = require('../controllers/profileController');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireLogin, profileController.getProfile);
router.put('/', requireLogin, profileController.updateProfile);

module.exports = router;
