const express = require('express');
const { body } = require('express-validator');
const {
  updateUserProfile,
  deleteUserAccount,
  getUserStats
} = require('../controllers/usercontroller');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL')
], updateUserProfile);

// Get user statistics (total transactions, budgets, etc.)
router.get('/stats', getUserStats);

// Delete user account
router.delete('/account', deleteUserAccount);

module.exports = router;
