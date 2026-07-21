const express = require('express');
const router = express.Router();
const {
  getLessonById,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/:id', protect, getLessonById);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLesson);

module.exports = router;
