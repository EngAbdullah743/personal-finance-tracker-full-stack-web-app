import React, { useState, useEffect } from 'react';
import { TRANSACTION_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const BudgetForm = ({ 
  budget = null, 
  month, 
  year, 
  onSubmit, 
  onCancel, 
  existingBudgets = [] 
}) => {
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form data if editing
  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        limit: budget.limit.toString()
      });
    }
  }, [budget]);

  // Get available categories (excluding ones that already have budgets)
  const getAvailableCategories = () => {
    const expenseCategories = Object.values(TRANSACTION_CATEGORIES).filter(
      cat => !['Salary', 'Freelance', 'Investment'].includes(cat)
    );

    if (budget) {
      // When editing, include the current budget's category
      return expenseCategories;
    }

    // When creating, exclude categories that already have budgets
    const usedCategories = existingBudgets.map(b => b.category);
    return expenseCategories.filter(cat => !usedCategories.includes(cat));
  };

  const validateForm = () => {
    const newErrors = {};

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    } else if (!budget && existingBudgets.some(b => b.category === formData.category)) {
      newErrors.category = 'Budget already exists for this category';
    }

    // Limit validation
    if (!formData.limit || formData.limit <= 0) {
      newErrors.limit = 'Budget limit must be greater than 0';
    } else if (formData.limit > 999999.99) {
      newErrors.limit = 'Budget limit cannot exceed $999,999.99';
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
      const budgetData = {
        category: formData.category,
        limit: parseFloat(formData.limit)
      };

      await onSubmit(budgetData);
    } catch (error) {
      toast.error(error.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = getAvailableCategories();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get suggested budget amount based on historical data
  const getSuggestedAmount = (category) => {
    // This would typically come from analyzing past transactions
    // For now, we'll provide some default suggestions
    const suggestions = {
      'Food': 600,
      'Transportation': 200,
      'Entertainment': 150,
      'Healthcare': 100,
      'Education': 50,
      'Shopping': 300,
      'Bills': 400,
      'Rent': 1200,
      'Other': 100
    };
    return suggestions[category] || 200;
  };

  const handleSuggestionClick = () => {
    if (formData.category) {
      const suggested = getSuggestedAmount(formData.category);
      setFormData(prev => ({
        ...prev,
        limit: suggested.toString()
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      <div className="form-header">
        <p>
          Creating budget for <strong>{monthNames[month - 1]} {year}</strong>
        </p>
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
          disabled={!!budget} // Disable category selection when editing
        >
          <option value="">Select a category</option>
          {availableCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <span className="error-text">{errors.category}</span>}
        
        {!budget && availableCategories.length === 0 && (
          <div className="form-help">
            All categories already have budgets for this month.
          </div>
        )}
      </div>

      {/* Budget Limit */}
      <div className="form-group">
        <label htmlFor="limit">
          Budget Limit <span className="required">*</span>
        </label>
        <div className="input-with-prefix">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="limit"
            name="limit"
            value={formData.limit}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            max="999999.99"
            step="0.01"
            required
            className={`form-input ${errors.limit ? 'error' : ''}`}
          />
        </div>
        {errors.limit && <span className="error-text">{errors.limit}</span>}
        
        {formData.category && !budget && (
          <div className="form-help">
            <span>Suggested amount: ${getSuggestedAmount(formData.category)}</span>
            <button
              type="button"
              className="btn btn-link"
              onClick={handleSuggestionClick}
            >
              Use suggestion
            </button>
          </div>
        )}
      </div>

      {/* Budget Tips */}
      <div className="budget-tips-form">
        <h4>💡 Budgeting Tips:</h4>
        <ul>
          <li>Start with 80% of your historical spending for this category</li>
          <li>Leave room for unexpected expenses</li>
          <li>Review and adjust monthly based on your needs</li>
          <li>Consider seasonal variations (holidays, back-to-school, etc.)</li>
        </ul>
      </div>

      {/* Preview */}
      {formData.category && formData.limit && (
        <div className="budget-preview">
          <h4>Budget Preview</h4>
          <div className="preview-item">
            <span>Category:</span>
            <span>{formData.category}</span>
          </div>
          <div className="preview-item">
            <span>Monthly Limit:</span>
            <span>${parseFloat(formData.limit || 0).toFixed(2)}</span>
          </div>
          <div className="preview-item">
            <span>Daily Average:</span>
            <span>${(parseFloat(formData.limit || 0) / 30).toFixed(2)}</span>
          </div>
          <div className="preview-item">
            <span>Weekly Average:</span>
            <span>${(parseFloat(formData.limit || 0) / 4).toFixed(2)}</span>
          </div>
        </div>
      )}

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
          disabled={loading || availableCategories.length === 0}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Saving...
            </>
          ) : (
            budget ? 'Update Budget' : 'Create Budget'
          )}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
