const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUser,
  deleteUser,
  getPlatformStats,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/stats/overview', getPlatformStats);
router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;
