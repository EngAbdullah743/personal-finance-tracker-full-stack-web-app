// Transaction categories
const TRANSACTION_CATEGORIES = {
  FOOD: 'Food',
  TRANSPORTATION: 'Transportation', 
  ENTERTAINMENT: 'Entertainment',
  HEALTHCARE: 'Healthcare',
  EDUCATION: 'Education',
  SHOPPING: 'Shopping',
  BILLS: 'Bills',
  RENT: 'Rent',
  SALARY: 'Salary',
  FREELANCE: 'Freelance',
  INVESTMENT: 'Investment',
  OTHER: 'Other'
};

// Transaction types
const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Budget status
const BUDGET_STATUS = {
  GOOD: 'good',
  WARNING: 'warning',
  EXCEEDED: 'exceeded'
};

// Default pagination
const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
};

// Validation limits
const VALIDATION_LIMITS = {
  NAME: {
    MIN: 2,
    MAX: 50
  },
  DESCRIPTION: {
    MIN: 1,
    MAX: 200
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 999999.99
  },
  PASSWORD: {
    MIN: 6,
    MAX: 100
  }
};

// Date ranges
const DATE_RANGES = {
  MAX_PAST_YEARS: 5,
  MAX_FUTURE_YEARS: 1
};

// HTTP Status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages
const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  BUDGET_NOT_FOUND: 'Budget not found',
  BUDGET_ALREADY_EXISTS: 'Budget already exists for this category and month',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token has expired',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error'
};

// Success messages
const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'User logged in successfully',
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  BUDGET_CREATED: 'Budget created successfully',
  BUDGET_UPDATED: 'Budget updated successfully',
  BUDGET_DELETED: 'Budget deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  ACCOUNT_DELETED: 'Account deleted successfully'
};

// Email templates
const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password_reset',
  BUDGET_ALERT: 'budget_alert',
  MONTHLY_SUMMARY: 'monthly_summary'
};

// Budget alert thresholds
const BUDGET_THRESHOLDS = {
  WARNING: 80, // 80% of budget used
  DANGER: 100  // Budget exceeded
};

// Chart color scheme
const CHART_COLORS = {
  INCOME: '#10B981', // Green
  EXPENSE: '#EF4444', // Red
  CATEGORIES: [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#10B981', // Emerald
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F43F5E'  // Rose
  ]
};

// Default categories with icons (for frontend use)
const CATEGORY_ICONS = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Healthcare: '🏥',
  Education: '📚',
  Shopping: '🛒',
  Bills: '📄',
  Rent: '🏠',
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
  Other: '📦'
};

module.exports = {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
  BUDGET_STATUS,
  PAGINATION_DEFAULTS,
  VALIDATION_LIMITS,
  DATE_RANGES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  EMAIL_TEMPLATES,
  BUDGET_THRESHOLDS,
  CHART_COLORS,
  CATEGORY_ICONS
};
