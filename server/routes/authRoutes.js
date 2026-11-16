
const express = require('express');
const router = express.Router();

const {
  registerStudent,
  loginStudent
} = require('../controllers/authController');

// Registration route
router.post('/register', registerStudent);

// Login route
router.post('/login', loginStudent);

module.exports = router;
