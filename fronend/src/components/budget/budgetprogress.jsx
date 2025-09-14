import React from 'react';
import { CATEGORY_ICONS } from '../../utils/constants';

const BudgetProgress = ({ 
  budgets = [], 
  showAll = false, 
  onEdit = null, 
  onDelete = null 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return '#10B981'; 
      case 'warning':
        return '#F59E0B'; 
      case 'exceeded':
        return '#EF4444'; 
      default:
        return '#6B7280'; 
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'good':
        return 'On Track';
      case 'warning':
        return 'Close to Limit';
      case 'exceeded':
        return 'Over Budget';
      default:
        return 'Unknown';
    }
  };

  const getCategoryIcon = (category) => {
    return CATEGORY_ICONS[category] || '📦';
  };

  const displayBudgets = showAll ? budgets : budgets.slice(0, 5);

  if (budgets.length === 0) {
    return (
      <div className="budget-progress-empty">
        <p>No budgets to display</p>
      </div>
    );
  }

  return (
    <div className="budget-progress">
      {displayBudgets.map((budget) => {
        const percentage = Math.min(budget.percentage || 0, 100);
        const isOverBudget = budget.percentage > 100;

        return (
          <div 
            key={budget._id} 
            className={`budget-progress-item ${budget.status}`}
          >
            <div className="budget-header">
              <div className="budget-category">
                <span className="category-icon">
                  {getCategoryIcon(budget.category)}
                </span>
                <span className="category-name">
                  {budget.category}
                </span>
              </div>
              
              <div className="budget-actions">
                <span className={`budget-status ${budget.status}`}>
                  {getStatusText(budget.status)}
                </span>
                
                {onEdit && onDelete && (
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(budget)}
                      title="Edit budget"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(budget._id)}
                      title="Delete budget"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="budget-amounts">
              <div className="amount-info">
                <span className="spent-amount">
                  {formatCurrency(budget.actualSpent || budget.spent)}
                </span>
                <span className="separator">of</span>
                <span className="limit-amount">
                  {formatCurrency(budget.limit)}
                </span>
              </div>
              
              <div className="remaining-amount">
                {budget.remaining > 0 ? (
                  <span className="remaining positive">
                    {formatCurrency(budget.remaining)} remaining
                  </span>
                ) : (
                  <span className="remaining negative">
                    {formatCurrency(Math.abs(budget.remaining))} over budget
                  </span>
                )}
              </div>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: getStatusColor(budget.status)
                }}
              />
              {isOverBudget && (
                <div 
                  className="progress-overflow"
                  style={{
                    width: `${Math.min(percentage - 100, 100)}%`
                  }}
                />
              )}
            </div>

            <div className="budget-details">
              <div className="percentage">
                <span className={`percentage-value ${budget.status}`}>
                  {Math.round(percentage)}%
                </span>
              </div>
              
              <div className="transaction-count">
                {budget.transactionCount || 0} transaction{(budget.transactionCount || 0) !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Warning message for over-budget categories */}
            {budget.status === 'exceeded' && (
              <div className="budget-warning">
                ⚠️ You've exceeded your budget by {formatCurrency(Math.abs(budget.remaining))}
              </div>
            )}

            {/* Warning message for categories approaching limit */}
            {budget.status === 'warning' && (
              <div className="budget-alert">
                🔸 You're approaching your budget limit
              </div>
            )}
          </div>
        );
      })}

      {!showAll && budgets.length > 5 && (
        <div className="show-more">
          <p>Showing {displayBudgets.length} of {budgets.length} budgets</p>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
