const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentStatus,
  markLessonComplete,
  getCourseEnrollments,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my-courses', protect, authorize('student'), getMyEnrollments);
router.post('/:courseId', protect, authorize('student'), enrollInCourse);
router.get('/:courseId/status', protect, getEnrollmentStatus);
router.put(
  '/:courseId/complete-lesson/:lessonId',
  protect,
  authorize('student'),
  markLessonComplete
);
router.get(
  '/course/:courseId/students',
  protect,
  authorize('instructor', 'admin'),
  getCourseEnrollments
);

module.exports = router;
