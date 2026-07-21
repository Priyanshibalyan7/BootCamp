const asyncHandler = require('express-async-handler');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const checkCourseOwnership = async (courseId, user) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }
  if (course.instructor.toString() !== user._id.toString() && user.role !== 'admin') {
    const err = new Error('Not authorized to modify lessons for this course');
    err.statusCode = 403;
    throw err;
  }
  return course;
};

// @desc    Create lesson under a course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (owner instructor, admin)
const createLesson = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await checkCourseOwnership(courseId, req.user);

  const { title, content, videoUrl, duration, order, resources, isPreview } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Please provide lesson title and content');
  }

  const lesson = await Lesson.create({
    course: courseId,
    title,
    content,
    videoUrl,
    duration,
    order: order ?? course.lessons.length,
    resources,
    isPreview,
  });

  course.lessons.push(lesson._id);
  await course.save();

  res.status(201).json({ success: true, data: lesson });
});

// @desc    Get all lessons for a course
// @route   GET /api/courses/:courseId/lessons
// @access  Public (preview) / Private (enrolled for full)
const getLessonsForCourse = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
  res.json({ success: true, count: lessons.length, data: lessons });
});

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private (enrolled students, owner, admin)
const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate('course', 'title instructor');
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (lesson.isPreview) {
    return res.json({ success: true, data: lesson });
  }

  // Check access: enrolled student, course owner, or admin
  const isOwner = lesson.course.instructor.toString() === req.user?._id?.toString();
  const isAdmin = req.user?.role === 'admin';

  if (!isOwner && !isAdmin) {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: lesson.course._id,
    });
    if (!enrollment) {
      res.status(403);
      throw new Error('You must be enrolled to access this lesson');
    }
  }

  res.json({ success: true, data: lesson });
});

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (owner instructor, admin)
const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate('course', 'instructor');
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (
    lesson.course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this lesson');
  }

  const fields = ['title', 'content', 'videoUrl', 'duration', 'order', 'resources', 'isPreview'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) lesson[field] = req.body[field];
  });

  const updated = await lesson.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (owner instructor, admin)
const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate('course', 'instructor');
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (
    lesson.course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this lesson');
  }

  await Course.findByIdAndUpdate(lesson.course._id, {
    $pull: { lessons: lesson._id },
  });
  await lesson.deleteOne();

  res.json({ success: true, message: 'Lesson deleted successfully' });
});

module.exports = {
  createLesson,
  getLessonsForCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
};
