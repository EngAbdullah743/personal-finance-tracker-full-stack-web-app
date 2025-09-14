const { body, validationResult } = require('express-validator');

// Common validation rules
const validationRules = {
  // User validation rules
  userRegister: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],

  userLogin: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Transaction validation rules
  transaction: [
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Transaction type must be either income or expense'),
    
    body('amount')
      .isFloat({ min: 0.01, max: 999999.99 })
      .withMessage('Amount must be between 0.01 and 999999.99'),
    
    body('category')
      .isIn(['Food', 'Transportation', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Bills', 'Rent', 'Salary', 'Freelance', 'Investment', 'Other'])
      .withMessage('Invalid category'),
    
    body('description')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Description must be between 1 and 200 characters'),
    
    body('date')
      .isISO8601()
      .withMessage('Please provide a valid date')
      .custom((value) => {
        const date = new Date(value);
        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(now.getFullYear() + 1);
        
        if (date < oneYearAgo || date > oneYearFromNow) {
          throw new Error('Date must be within one year of current date');
        }
        return true;
      })
  ],

  // Budget validation rules
  budget: [
    body('category')
      .isIn(['Food', 'Transportation', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Bills', 'Rent', 'Other'])
      .withMessage('Invalid category'),
    
    body('limit')
      .isFloat({ min: 1, max: 999999.99 })
      .withMessage('Budget limit must be between 1 and 999999.99'),
    
    body('month')
      .isInt({ min: 1, max: 12 })
      .withMessage('Month must be between 1 and 12'),
    
    body('year')
      .isInt({ min: 2020, max: 2030 })
      .withMessage('Year must be between 2020 and 2030')
  ]
};

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

// Custom validation functions
const customValidations = {
  // Check if email is unique during registration
  isEmailUnique: async (email, userId = null) => {
    const User = require('../models/user');
    const query = { email: email.toLowerCase() };
    if (userId) {
      query._id = { $ne: userId };
    }
    
    const existingUser = await User.findOne(query);
    if (existingUser) {
      throw new Error('Email is already registered');
    }
    return true;
  },

  // Check if transaction belongs to user
  isTransactionOwner: async (transactionId, userId) => {
    const Transaction = require('../models/transaction');
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    if (transaction.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized access to transaction');
    }
    
    return true;
  },

  // Check if budget belongs to user
  isBudgetOwner: async (budgetId, userId) => {
    const Budget = require('../models/budget');
    const budget = await Budget.findById(budgetId);
    
    if (!budget) {
      throw new Error('Budget not found');
    }
    
    if (budget.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized access to budget');
    }
    
    return true;
  }
};

module.exports = {
  validationRules,
  handleValidationErrors,
  customValidations
};
