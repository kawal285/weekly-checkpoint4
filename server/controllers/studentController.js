
const Student = require('../models/Student');

// Get logged-in student's profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId)
      .select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student profile retrieved successfully',
      student
    });

  } catch (error) {
    console.error('Profile error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve student profile'
    });
  }
};

module.exports = {
  getStudentProfile
};
