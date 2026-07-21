const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Enroll logged in student into a course
// @route   POST /api/enrollments/:courseId
// @access  Private (student)
const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existing = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });
  if (existing) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
  });

  course.enrolledStudents.push(req.user._id);
  await course.save();

  await User.findByIdAndUpdate(req.user._id, {
    $push: { enrolledCourses: courseId },
  });

  res.status(201).json({ success: true, data: enrollment });
});

// @desc    Get all enrollments for the logged in student
// @route   GET /api/enrollments/my-courses
// @access  Private (student)
const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate({
    path: 'course',
    select: 'title thumbnail category level instructor lessons',
    populate: { path: 'instructor', select: 'name' },
  });

  res.json({ success: true, count: enrollments.length, data: enrollments });
});

// @desc    Get enrollment status/progress for a specific course
// @route   GET /api/enrollments/:courseId/status
// @access  Private (student)
const getEnrollmentStatus = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });

  res.json({ success: true, data: enrollment || null });
});

// @desc    Mark a lesson as completed and update progress
// @route   PUT /api/enrollments/:courseId/complete-lesson/:lessonId
// @access  Private (student)
const markLessonComplete = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.params;

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found. Please enroll first.');
  }

  const course = await Course.findById(courseId);
  const totalLessons = course.lessons.length;

  if (!enrollment.completedLessons.some((l) => l.toString() === lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  enrollment.progress =
    totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

  if (enrollment.progress >= 100) {
    enrollment.completed = true;
    enrollment.completedAt = new Date();
  }

  await enrollment.save();

  res.json({ success: true, data: enrollment });
});

// @desc    Get all students enrolled in a course (for instructor)
// @route   GET /api/enrollments/course/:courseId/students
// @access  Private (owner instructor, admin)
const getCourseEnrollments = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view enrollments for this course');
  }

  const enrollments = await Enrollment.find({ course: req.params.courseId }).populate(
    'student',
    'name email avatar'
  );

  res.json({ success: true, count: enrollments.length, data: enrollments });
});

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentStatus,
  markLessonComplete,
  getCourseEnrollments,
};
