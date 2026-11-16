
require('dotenv').config();
const studentRoutes = require('./routes/studentRoutes');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json());
////authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Test API route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'School Students Registration API is running'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
