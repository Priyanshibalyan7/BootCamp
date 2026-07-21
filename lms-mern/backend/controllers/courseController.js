const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// @desc    Get all published courses (with search/filter/pagination)
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { keyword, category, level, page = 1, limit = 9 } = req.query;

  const query = { published: true };

  if (keyword) {
    query.title = { $regex: keyword, $options: 'i' };
  }
  if (category) query.category = category;
  if (level) query.level = level;

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .populate('instructor', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  res.json({
    success: true,
    count: courses.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: courses,
  });
});

// @desc    Get single course by slug or id
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name avatar bio')
    .populate({
      path: 'lessons',
      options: { sort: { order: 1 } },
    })
    .populate('ratings.user', 'name avatar');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.json({ success: true, data: course });
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (instructor, admin)
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, shortDescription, category, level, price, thumbnail, tags } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Please provide title, description and category');
  }

  const course = await Course.create({
    title,
    description,
    shortDescription,
    category,
    level,
    price: price || 0,
    thumbnail: thumbnail || undefined,
    tags: tags || [],
    instructor: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: { createdCourses: course._id },
  });

  res.status(201).json({ success: true, data: course });
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (owner instructor, admin)
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this course');
  }

  const fields = [
    'title',
    'description',
    'shortDescription',
    'category',
    'level',
    'price',
    'thumbnail',
    'tags',
    'published',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) course[field] = req.body[field];
  });

  const updated = await course.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (owner instructor, admin)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this course');
  }

  await Lesson.deleteMany({ course: course._id });
  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();

  res.json({ success: true, message: 'Course deleted successfully' });
});

// @desc    Get courses created by logged in instructor
// @route   GET /api/courses/instructor/my-courses
// @access  Private (instructor, admin)
const getMyCreatedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, count: courses.length, data: courses });
});

// @desc    Add a rating/review to a course
// @route   POST /api/courses/:id/reviews
// @access  Private (enrolled students)
const addCourseReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: course._id,
  });
  if (!enrollment) {
    res.status(403);
    throw new Error('You must be enrolled to review this course');
  }

  const alreadyReviewed = course.ratings.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    alreadyReviewed.rating = rating;
    alreadyReviewed.comment = comment;
  } else {
    course.ratings.push({ user: req.user._id, rating, comment });
  }

  course.calculateAverageRating();
  await course.save();

  res.status(201).json({ success: true, data: course.ratings });
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCreatedCourses,
  addCourseReview,
};
