const express = require('express');
const { body, param } = require('express-validator');
const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetProgress
} = require('../controllers/budgetcontroller');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Create budget
router.post('/', [
  body('category').notEmpty().withMessage('Category is required'),
  body('limit').isFloat({ min: 0.01 }).withMessage('Budget limit must be greater than 0'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year').isInt({ min: 2020, max: 2050 }).withMessage('Year must be between 2020 and 2050')
], createBudget);

// Get budgets for current month or specified month/year
router.get('/', getBudgets);

// Get budget progress with spending data
router.get('/progress', getBudgetProgress);

// Get single budget
router.get('/:id', getBudgetById);

// Update budget
router.put('/:id', [
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('limit').optional().isFloat({ min: 0.01 }).withMessage('Budget limit must be greater than 0'),
  body('month').optional().isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year').optional().isInt({ min: 2020, max: 2050 }).withMessage('Year must be between 2020 and 2050')
], updateBudget);

// Delete budget
router.delete('/:id', deleteBudget);

module.exports = router;
