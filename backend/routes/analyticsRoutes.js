const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Analytics routes
router.get('/', getAnalyticsData);

module.exports = router;
