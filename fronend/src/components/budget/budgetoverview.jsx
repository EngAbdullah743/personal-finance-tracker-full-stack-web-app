import React, { useState, useEffect } from 'react';
import { budgetService } from '../../services/budgetservice';
import BudgetForm from './budgetform';
import BudgetProgress from './budgetprogress';
import Modal from '../common/modal';
import LoadingSpinner from '../common/loadingspinner';
import ErrorMessage from '../common/errormessage';
import toast from 'react-hot-toast';

const BudgetOverview = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadBudgets();
  }, [selectedMonth, selectedYear]);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      setError(null);

      const [budgetData, progressData, summaryData] = await Promise.all([
        budgetService.getAll(selectedMonth, selectedYear),
        budgetService.getProgress(selectedMonth, selectedYear),
        budgetService.getSummary(selectedMonth, selectedYear)
      ]);

      setBudgets(budgetData);
      setBudgetProgress(progressData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = () => {
    setEditingBudget(null);
    setShowModal(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetService.delete(id);
        toast.success('Budget deleted successfully');
        loadBudgets();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleFormSubmit = async (budgetData) => {
    try {
      const dataWithDate = {
        ...budgetData,
        month: selectedMonth,
        year: selectedYear
      };

      if (editingBudget) {
        await budgetService.update(editingBudget._id, dataWithDate);
        toast.success('Budget updated successfully');
      } else {
        await budgetService.create(dataWithDate);
        toast.success('Budget created successfully');
      }

      setShowModal(false);
      setEditingBudget(null);
      loadBudgets();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadBudgets} />;
  }

  return (
    <div className="budget-overview">
      <div className="page-header">
        <h1>Budget Overview</h1>
        <div className="header-actions">
          <div className="month-selector">
            <select
              value={`${selectedMonth}-${selectedYear}`}
              onChange={(e) => {
                const [month, year] = e.target.value.split('-');
                handleMonthChange(parseInt(month), parseInt(year));
              }}
              className="form-input"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const currentYear = new Date().getFullYear();
                return (
                  <option key={`${month}-${currentYear}`} value={`${month}-${currentYear}`}>
                    {getMonthName(month)} {currentYear}
                  </option>
                );
              })}
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const nextYear = new Date().getFullYear() + 1;
                return (
                  <option key={`${month}-${nextYear}`} value={`${month}-${nextYear}`}>
                    {getMonthName(month)} {nextYear}
                  </option>
                );
              })}
            </select>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleCreateBudget}
          >
            + Add Budget
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="budget-summary">
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-value">
              {formatCurrency(summary.totalBudget)}
            </div>
            <div className="summary-label">Total Budget</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">
              {formatCurrency(summary.totalSpent)}
            </div>
            <div className="summary-label">Total Spent</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">
              {formatCurrency(summary.totalRemaining)}
            </div>
            <div className="summary-label">Remaining</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">
              {summary.totalCategories || 0}
            </div>
            <div className="summary-label">Categories</div>
          </div>
        </div>

        <div className="budget-status">
          <div className="status-item good">
            <span className="status-count">{summary.goodCount || 0}</span>
            <span className="status-label">On Track</span>
          </div>
          <div className="status-item warning">
            <span className="status-count">{summary.warningCount || 0}</span>
            <span className="status-label">Warning</span>
          </div>
          <div className="status-item exceeded">
            <span className="status-count">{summary.exceededCount || 0}</span>
            <span className="status-label">Exceeded</span>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="budget-content">
        {budgetProgress.length > 0 ? (
          <BudgetProgress 
            budgets={budgetProgress} 
            showAll={true}
            onEdit={handleEditBudget}
            onDelete={handleDeleteBudget}
          />
        ) : (
          <div className="no-budgets">
            <div className="empty-state">
              <h3>No budgets for {getMonthName(selectedMonth)} {selectedYear}</h3>
              <p>Create your first budget to start tracking your spending limits</p>
              <button 
                className="btn btn-primary"
                onClick={handleCreateBudget}
              >
                Create Budget
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="budget-tips">
        <h3>💡 Budget Tips</h3>
        <ul>
          <li>Set realistic budget limits based on your historical spending</li>
          <li>Review and adjust your budgets monthly</li>
          <li>Use the warning threshold (80%) to stay on track</li>
          <li>Consider seasonal variations in your spending</li>
        </ul>
      </div>

      {/* Modal for Add/Edit Budget */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Budget' : 'Create Budget'}
        size="medium"
      >
        <BudgetForm
          budget={editingBudget}
          month={selectedMonth}
          year={selectedYear}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingBudget(null);
          }}
          existingBudgets={budgets}
        />
      </Modal>
    </div>
  );
};

export default BudgetOverview;
