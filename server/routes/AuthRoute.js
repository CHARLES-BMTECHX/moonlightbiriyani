// routes/auth.js
const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/AuthController');
const { protect, admin } = require('../middleware/Auth');

// Public Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected Routes
router.use(protect);
router.get('/me', protect, getMe);
router.get('/users', admin, getAllUsers);           // Admin only
router.get('/users/:id', getUserById);              // Admin or self
router.put('/users/:id', updateUser);               // Admin or self
router.delete('/users/:id', admin, deleteUser);     // Admin only

module.exports = router;
