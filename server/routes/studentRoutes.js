
const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const {
  getStudentProfile
} = require('../controllers/studentController');

// Protected student profile route
router.get('/profile', protect, getStudentProfile);

module.exports = router;
