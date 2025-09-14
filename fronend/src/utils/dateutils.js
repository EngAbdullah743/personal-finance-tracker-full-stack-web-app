import { DATE_FORMATS } from './constants';

/**
 * Format date for display
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  switch (format) {
    case DATE_FORMATS.SHORT:
      return dateObj.toLocaleDateString('en-US');
    
    case DATE_FORMATS.LONG:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
    case DATE_FORMATS.API:
      return dateObj.toISOString().split('T')[0];
    
    case DATE_FORMATS.DISPLAY:
    default:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  }
};

/**
 * Format date with relative time (Today, Yesterday, etc.)
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = dateObj.toDateString() === today.toDateString();
  const isYesterday = dateObj.toDateString() === yesterday.toDateString();
  
  if (isToday) {
    return 'Today';
  } else if (isYesterday) {
    return 'Yesterday';
  } else {
    return formatDate(dateObj);
  }
};

/**
 * Get month name
 */
export const getMonthName = (month, short = false) => {
  const months = short 
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['January', 'February', 'March', 'April', 'May', 'June', 
       'July', 'August', 'September', 'October', 'November', 'December'];
  
  return months[month - 1] || '';
};

/**
 * Get start and end of month
 */
export const getMonthRange = (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  
  return {
    start: startDate,
    end: endDate,
    startFormatted: startDate.toISOString().split('T')[0],
    endFormatted: endDate.toISOString().split('T')[0]
  };
};

/**
 * Get current month range
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  return getMonthRange(now.getMonth() + 1, now.getFullYear());
};

/**
 * Get last N months
 */
export const getLastNMonths = (n = 6) => {
  const months = [];
  const today = new Date();
  
  for (let i = 0; i < n; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      name: getMonthName(date.getMonth() + 1),
      short: getMonthName(date.getMonth() + 1, true),
      date: date
    });
  }
  
  return months.reverse();
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Check if date is in current month
 */
export const isCurrentMonth = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  
  return dateObj.getMonth() === today.getMonth() && 
         dateObj.getFullYear() === today.getFullYear();
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj < today;
};

/**
 * Get quarter from date
 */
export const getQuarter = (date) => {
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  return Math.ceil(month / 3);
};

/**
 * Get week number
 */
export const getWeekNumber = (date) => {
  const dateObj = new Date(date);
  const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const pastDaysOfYear = (dateObj - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

/**
 * Add days to date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add months to date
 */
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Get date presets for filtering
 */
export const getDatePresets = () => {
  const today = new Date();
  const presets = [
    {
      label: 'Today',
      startDate: new Date(today),
      endDate: new Date(today)
    },
    {
      label: 'Yesterday',
      startDate: addDays(today, -1),
      endDate: addDays(today, -1)
    },
    {
      label: 'This Week',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()),
      endDate: today
    },
    {
      label: 'Last Week',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 1)
    },
    {
      label: 'This Month',
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: today
    },
    {
      label: 'Last Month',
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), 0)
    },
    {
      label: 'Last 30 Days',
      startDate: addDays(today, -29),
      endDate: today
    },
    {
      label: 'Last 90 Days',
      startDate: addDays(today, -89),
      endDate: today
    },
    {
      label: 'This Quarter',
      startDate: new Date(today.getFullYear(), (getQuarter(today) - 1) * 3, 1),
      endDate: today
    },
    {
      label: 'This Year',
      startDate: new Date(today.getFullYear(), 0, 1),
      endDate: today
    },
    {
      label: 'Last Year',
      startDate: new Date(today.getFullYear() - 1, 0, 1),
      endDate: new Date(today.getFullYear() - 1, 11, 31)
    }
  ];

  return presets.map(preset => ({
    ...preset,
    startDateFormatted: preset.startDate.toISOString().split('T')[0],
    endDateFormatted: preset.endDate.toISOString().split('T')[0]
  }));
};

/**
 * Parse date string safely
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Format time
 */
export const formatTime = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  });
};

/**
 * Get age of date (how long ago)
 */
export const getDateAge = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = new Date(date);
  const diffMs = now - dateObj;
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
};
