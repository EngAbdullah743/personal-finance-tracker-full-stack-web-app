import React, { useState } from 'react';
import { CATEGORY_ICONS } from '../../utils/constants';

const TransactionItem = ({ 
  transaction, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    const transactionDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (transactionDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (transactionDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return transactionDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: transactionDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getCategoryIcon = (category) => {
    return CATEGORY_ICONS[category] || '📦';
  };

  const handleCheckboxChange = () => {
    onSelect(transaction._id);
  };

  const handleEdit = () => {
    onEdit(transaction);
    setShowActions(false);
  };

  const handleDelete = () => {
    onDelete(transaction._id);
    setShowActions(false);
  };

  return (
    <div 
      className={`transaction-item ${transaction.type} ${isSelected ? 'selected' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="transaction-left">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
          />
        </label>

        <div className="transaction-icon">
          {getCategoryIcon(transaction.category)}
        </div>

        <div className="transaction-details">
          <div className="transaction-description">
            {transaction.description}
          </div>
          <div className="transaction-meta">
            <span className="transaction-category">
              {transaction.category}
            </span>
            <span className="transaction-date">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>

      <div className="transaction-right">
        <div className={`transaction-amount ${transaction.type}`}>
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </div>

        <div className={`transaction-actions ${showActions ? 'show' : ''}`}>
          <button
            className="action-btn edit"
            onClick={handleEdit}
            title="Edit transaction"
          >
            ✏️
          </button>
          <button
            className="action-btn delete"
            onClick={handleDelete}
            title="Delete transaction"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
