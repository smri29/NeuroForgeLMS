// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  authUser, 
  forgotPassword, 
  resetPassword,
  getUsers 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Route for Registration (POST /api/users)
router.post('/', registerUser);

// Route for Login (POST /api/users/login)
router.post('/login', authUser);

// Route for Forgot Password (POST /api/users/forgot-password)
router.post('/forgot-password', forgotPassword);

// Route for Reset Password (POST /api/users/reset-password)
router.post('/reset-password', resetPassword);

// Route for Getting All Users (GET /api/users) - Admin Only
router.get('/', protect, admin, getUsers);

module.exports = router;