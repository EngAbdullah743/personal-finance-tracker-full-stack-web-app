import  useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetservice';
import toast from 'react-hot-toast';

export const useBudgets = (initialMonth = null, initialYear = null) => {
  const currentDate = new Date();
  const [budgets, setBudgets] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(initialMonth || currentDate.getMonth() + 1);
  const [year, setYear] = useState(initialYear || currentDate.getFullYear());

  const fetchBudgets = useCallback(async (selectedMonth = month, selectedYear = year) => {
    try {
      setLoading(true);
      setError(null);
      
      const [budgetData, progressData] = await Promise.all([
        budgetService.getAll(selectedMonth, selectedYear),
        budgetService.getProgress(selectedMonth, selectedYear)
      ]);
      
      setBudgets(budgetData);
      setBudgetProgress(progressData);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  const createBudget = useCallback(async (budgetData) => {
    try {
      const newBudget = await budgetService.create({
        ...budgetData,
        month,
        year
      });
      
      setBudgets(prev => [...prev, newBudget]);
      toast.success('Budget created successfully!');
      
      // Refresh progress data
      await fetchBudgets();
      
      return newBudget;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [month, year, fetchBudgets]);

  const updateBudget = useCallback(async (id, budgetData) => {
    try {
      const updatedBudget = await budgetService.update(id, budgetData);
      
      setBudgets(prev => 
        prev.map(b => b._id === id ? updatedBudget : b)
      );
      
      toast.success('Budget updated successfully!');
      
      // Refresh progress data
      await fetchBudgets();
      
      return updatedBudget;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [fetchBudgets]);

  const deleteBudget = useCallback(async (id) => {
    try {
      await budgetService.delete(id);
      
      setBudgets(prev => prev.filter(b => b._id !== id));
      setBudgetProgress(prev => prev.filter(b => b._id !== id));
      
      toast.success('Budget deleted successfully!');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  const getBudgetSummary = useCallback(async (selectedMonth = month, selectedYear = year) => {
    try {
      const summary = await budgetService.getSummary(selectedMonth, selectedYear);
      return summary;
    } catch (err) {
      toast.error('Failed to fetch budget summary');
      return {
        totalBudget: 0,
        totalSpent: 0,
        totalRemaining: 0,
        exceededCount: 0,
        warningCount: 0,
        goodCount: 0,
        totalCategories: 0
      };
    }
  }, [month, year]);

  const changeMonth = useCallback((newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
    fetchBudgets(newMonth, newYear);
  }, [fetchBudgets]);

  const getCurrentMonthBudgets = useCallback(async () => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      return await budgetService.getProgress(currentMonth, currentYear);
    } catch (err) {
      toast.error('Failed to fetch current month budgets');
      return [];
    }
  }, []);

  const checkBudgetAlerts = useCallback(() => {
    const alerts = budgetProgress.filter(budget => 
      budget.status === 'warning' || budget.status === 'exceeded'
    );
    
    return alerts;
  }, [budgetProgress]);

  const getBudgetUtilization = useCallback(() => {
    if (budgetProgress.length === 0) return 0;
    
    const totalBudget = budgetProgress.reduce((sum, budget) => sum + budget.limit, 0);
    const totalSpent = budgetProgress.reduce((sum, budget) => sum + (budget.actualSpent || budget.spent), 0);
    
    return totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  }, [budgetProgress]);

  // Auto-fetch when month/year changes
  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  return {
    budgets,
    budgetProgress,
    loading,
    error,
    month,
    year,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetSummary,
    changeMonth,
    getCurrentMonthBudgets,
    checkBudgetAlerts,
    getBudgetUtilization,
    refreshData: fetchBudgets
  };
};
