import React, { useState, useEffect } from 'react';
import { TRANSACTION_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const TransactionForm = ({ 
  transaction = null, 
  onSubmit, 
  onCancel, 
  initialType = 'expense' 
}) => {
  const [formData, setFormData] = useState({
    type: initialType,
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form data if editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        date: new Date(transaction.date).toISOString().split('T')[0]
      });
    }
  }, [transaction]);

  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (formData.amount > 999999.99) {
      newErrors.amount = 'Amount cannot exceed $999,999.99';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const transactionDate = new Date(formData.date);
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      
      if (transactionDate > now) {
        newErrors.date = 'Date cannot be in the future';
      } else if (transactionDate < oneYearAgo) {
        newErrors.date = 'Date cannot be more than a year ago';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        description: formData.description.trim()
      };

      await onSubmit(transactionData);
    } catch (error) {
      toast.error(error.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on transaction type
  const getAvailableCategories = () => {
    const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other'];
    const expenseCategories = Object.values(TRANSACTION_CATEGORIES).filter(
      cat => !incomeCategories.includes(cat)
    );

    return formData.type === 'income' ? incomeCategories : expenseCategories;
  };

  const availableCategories = getAvailableCategories();

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      {/* Transaction Type */}
      <div className="form-group">
        <label>Transaction Type</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
            />
            <span className="radio-text income">💰 Income</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
            />
            <span className="radio-text expense">💸 Expense</span>
          </label>
        </div>
      </div>

      {/* Amount */}
      <div className="form-group">
        <label htmlFor="amount">
          Amount <span className="required">*</span>
        </label>
        <div className="input-with-prefix">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            max="999999.99"
            step="0.01"
            required
            className={`form-input ${errors.amount ? 'error' : ''}`}
          />
        </div>
        {errors.amount && <span className="error-text">{errors.amount}</span>}
      </div>

      {/* Category */}
      <div className="form-group">
        <label htmlFor="category">
          Category <span className="required">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className={`form-input ${errors.category ? 'error' : ''}`}
        >
          <option value="">Select a category</option>
          {availableCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <span className="error-text">{errors.category}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">
          Description <span className="required">*</span>
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter transaction description"
          maxLength="200"
          required
          className={`form-input ${errors.description ? 'error' : ''}`}
        />
        <div className="input-help">
          {formData.description.length}/200 characters
        </div>
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      {/* Date */}
      <div className="form-group">
        <label htmlFor="date">
          Date <span className="required">*</span>
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className={`form-input ${errors.date ? 'error' : ''}`}
        />
        {errors.date && <span className="error-text">{errors.date}</span>}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Saving...
            </>
          ) : (
            transaction ? 'Update Transaction' : 'Add Transaction'
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
