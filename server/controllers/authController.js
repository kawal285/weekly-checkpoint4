
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// Register a new student
const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      gender,
      password,
      confirmPassword
    } = req.body;

    // Check required fields
    if (!name || !email || !contact || !gender || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if email already exists
    const normalizedEmail = email.trim().toLowerCase();

    const existingStudent = await Student.findOne({
      email: normalizedEmail
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create student
    const student = await Student.create({
      name,
      email: normalizedEmail,
      contact,
      gender,
      password: hashedPassword
    });

    console.log('Student saved:', student._id);
console.log('Database:', Student.db.name);
console.log('Collection:', Student.collection.name);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        contact: student.contact,
        gender: student.gender
      }
    });

  } catch (error) {
    console.error('Registration error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};


const jwt = require('jsonwebtoken');

// Student login
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email and password'
      });
    }

    // Find student by email
    const student = await Student.findOne({
      email: email.trim().toLowerCase()
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};


module.exports = {
  registerStudent,
  loginStudent
};