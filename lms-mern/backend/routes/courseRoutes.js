const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCreatedCourses,
  addCourseReview,
} = require('../controllers/courseController');
const {
  createLesson,
  getLessonsForCourse,
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('instructor', 'admin'), createCourse);

router.get(
  '/instructor/my-courses',
  protect,
  authorize('instructor', 'admin'),
  getMyCreatedCourses
);

router
  .route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.post('/:id/reviews', protect, authorize('student'), addCourseReview);

router
  .route('/:courseId/lessons')
  .get(getLessonsForCourse)
  .post(protect, authorize('instructor', 'admin'), createLesson);

module.exports = router;
