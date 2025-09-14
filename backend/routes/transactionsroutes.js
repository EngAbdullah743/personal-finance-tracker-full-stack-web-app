const express = require('express');
const { body, query } = require('express-validator');
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/transactioncontroller');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Create transaction
router.post('/', [
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').trim().isLength({ min: 1, max: 200 }).withMessage('Description is required (max 200 chars)'),
  body('date').isISO8601().withMessage('Valid date is required')
], createTransaction);

// Get transactions with filters
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  query('category').optional().notEmpty().withMessage('Category cannot be empty'),
  query('startDate').optional().isISO8601().withMessage('Valid start date required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date required')
], getTransactions);

// Get transaction statistics
router.get('/stats', getTransactionStats);

// Get single transaction
router.get('/:id', getTransactionById);

// Update transaction
router.put('/:id', [
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('description').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Description must be 1-200 chars'),
  body('date').optional().isISO8601().withMessage('Valid date is required')
], updateTransaction);

// Delete transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
