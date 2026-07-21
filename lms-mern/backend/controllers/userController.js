const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

// @desc    Update a user's role or active status
// @route   PUT /api/users/:id
// @access  Private (admin)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.role) user.role = req.body.role;
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;

  const updated = await user.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted successfully' });
});

// @desc    Get platform-wide statistics for admin dashboard
// @route   GET /api/users/stats/overview
// @access  Private (admin)
const getPlatformStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalInstructors = await User.countDocuments({ role: 'instructor' });
  const totalCourses = await Course.countDocuments();
  const publishedCourses = await Course.countDocuments({ published: true });
  const totalEnrollments = await Enrollment.countDocuments();

  res.json({
    success: true,
    data: {
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      publishedCourses,
      totalEnrollments,
    },
  });
});

module.exports = { getUsers, updateUser, deleteUser, getPlatformStats };
