const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Dashboard routes
router.get('/stats', getDashboardStats);

module.exports = router;
