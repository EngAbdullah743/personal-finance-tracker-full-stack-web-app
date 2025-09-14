// Transaction categories
export const TRANSACTION_CATEGORIES = {
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
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Budget status
export const BUDGET_STATUS = {
  GOOD: 'good',
  WARNING: 'warning',
  EXCEEDED: 'exceeded'
};

// Chart colors
export const CHART_COLORS = {
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

// Category icons
export const CATEGORY_ICONS = {
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

// Currency settings
export const CURRENCY = {
  CODE: 'USD',
  SYMBOL: '$',
  LOCALE: 'en-US'
};

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  LONG: 'MMMM d, yyyy',
  API: 'yyyy-MM-dd',
  DISPLAY: 'MMM d, yyyy'
};

// Pagination settings
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMITS: [10, 20, 50, 100]
};

// Validation limits
export const VALIDATION = {
  NAME: { MIN: 2, MAX: 50 },
  DESCRIPTION: { MIN: 1, MAX: 200 },
  AMOUNT: { MIN: 0.01, MAX: 999999.99 },
  PASSWORD: { MIN: 6, MAX: 100 }
};

// API endpoints (relative to base URL)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile'
  },
  TRANSACTIONS: {
    BASE: '/transactions',
    STATS: '/transactions/stats'
  },
  BUDGETS: {
    BASE: '/budgets',
    PROGRESS: '/budgets/progress'
  },
  USERS: {
    PROFILE: '/users/profile',
    STATS: '/users/stats',
    DELETE: '/users/account'
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences'
};

// Theme settings
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Modal sizes
export const MODAL_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  FULLSCREEN: 'fullscreen'
};

// Breakpoints (must match CSS)
export const BREAKPOINTS = {
  XS: 480,
  SM: 768,
  MD: 1024,
  LG: 1200,
  XL: 1536
};

// Budget alert thresholds
export const BUDGET_THRESHOLDS = {
  WARNING: 80, // 80% of budget used
  DANGER: 100  // Budget exceeded
};

// File upload settings
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    CSV: ['text/csv', 'application/vnd.ms-excel'],
    EXCEL: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
  }
};

// Default user preferences
export const DEFAULT_PREFERENCES = {
  theme: THEMES.SYSTEM,
  currency: CURRENCY.CODE,
  dateFormat: DATE_FORMATS.SHORT,
  itemsPerPage: PAGINATION.DEFAULT_LIMIT,
  notifications: {
    budgetAlerts: true,
    transactionReminders: false,
    monthlyReports: true
  },
  dashboard: {
    showBudgetProgress: true,
    showRecentTransactions: true,
    showCharts: true,
    defaultChartType: 'line'
  }
};
