const mongoose = require('mongoose');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isStrongPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Validate amount (positive number with max 2 decimal places)
const isValidAmount = (amount) => {
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  return amountRegex.test(amount.toString()) && parseFloat(amount) > 0;
};

// Validate date (not in future, not older than 5 years)
const isValidTransactionDate = (date) => {
  const transactionDate = new Date(date);
  const now = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(now.getFullYear() - 5);
  
  return transactionDate <= now && transactionDate >= fiveYearsAgo;
};

// Validate transaction category
const isValidCategory = (category) => {
  const validCategories = [
    'Food', 
    'Transportation', 
    'Entertainment', 
    'Healthcare', 
    'Education', 
    'Shopping', 
    'Bills', 
    'Rent', 
    'Salary', 
    'Freelance', 
    'Investment', 
    'Other'
  ];
  return validCategories.includes(category);
};

// Validate transaction type
const isValidTransactionType = (type) => {
  return ['income', 'expense'].includes(type);
};

// Validate month (1-12)
const isValidMonth = (month) => {
  const monthNum = parseInt(month);
  return monthNum >= 1 && monthNum <= 12;
};

// Validate year (reasonable range)
const isValidYear = (year) => {
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  return yearNum >= 2020 && yearNum <= (currentYear + 1);
};

// Sanitize string input (remove HTML tags and trim)
const sanitizeString = (str) => {
  return str.replace(/<[^>]*>?/gm, '').trim();
};

// Validate pagination parameters
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum))
  };
};

// Format currency amount
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Validate date range
const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }
  
  return start <= end;
};

module.exports = {
  isValidObjectId,
  isValidEmail,
  isStrongPassword,
  isValidAmount,
  isValidTransactionDate,
  isValidCategory,
  isValidTransactionType,
  isValidMonth,
  isValidYear,
  sanitizeString,
  validatePagination,
  formatCurrency,
  isValidDateRange
};
