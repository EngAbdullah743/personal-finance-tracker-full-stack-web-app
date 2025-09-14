import React from 'react';

const ErrorMessage = ({ 
  message, 
  type = 'error',
  onRetry = null,
  onDismiss = null,
  showIcon = true,
  className = ''
}) => {
  const getIcon = (type) => {
    const icons = {
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅'
    };
    return icons[type] || icons.error;
  };

  const getTypeClass = (type) => {
    const classes = {
      error: 'error-message-error',
      warning: 'error-message-warning',
      info: 'error-message-info',
      success: 'error-message-success'
    };
    return classes[type] || classes.error;
  };

  if (!message) return null;

  return (
    <div className={`error-message ${getTypeClass(type)} ${className}`}>
      <div className="error-content">
        {showIcon && (
          <span className="error-icon">
            {getIcon(type)}
          </span>
        )}
        
        <div className="error-text">
          {typeof message === 'string' ? (
            <p>{message}</p>
          ) : (
            message
          )}
        </div>
      </div>
      
      {(onRetry || onDismiss) && (
        <div className="error-actions">
          {onRetry && (
            <button
              className="btn btn-outline btn-sm"
              onClick={onRetry}
            >
              Try Again
            </button>
          )}
          
          {onDismiss && (
            <button
              className="error-dismiss"
              onClick={onDismiss}
              aria-label="Dismiss message"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
