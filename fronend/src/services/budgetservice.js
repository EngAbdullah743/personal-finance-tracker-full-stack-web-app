import api from './api';

export const budgetService = {
  // Create new budget
  create: async (budgetData) => {
    try {
      const response = await api.post('/budgets', budgetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get budgets for specific month/year
  getAll: async (month = null, year = null) => {
    try {
      const params = new URLSearchParams();
      
      if (month) params.append('month', month);
      if (year) params.append('year', year);

      const response = await api.get(`/budgets?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get budget progress with spending data
  getProgress: async (month = null, year = null) => {
    try {
      const params = new URLSearchParams();
      
      if (month) params.append('month', month);
      if (year) params.append('year', year);

      const response = await api.get(`/budgets/progress?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single budget by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update budget
  update: async (id, budgetData) => {
    try {
      const response = await api.put(`/budgets/${id}`, budgetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete budget
  delete: async (id) => {
    try {
      const response = await api.delete(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current month budgets
  getCurrentMonth: async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      
      return await budgetService.getProgress(month, year);
    } catch (error) {
      throw error;
    }
  },

  // Check if budget exists for category/month/year
  checkExists: async (category, month, year) => {
    try {
      const budgets = await budgetService.getAll(month, year);
      return budgets.some(budget => budget.category === category);
    } catch (error) {
      throw error;
    }
  },

  // Get budget summary
  getSummary: async (month = null, year = null) => {
    try {
      const budgets = await budgetService.getProgress(month, year);
      
      const summary = budgets.reduce((acc, budget) => {
        acc.totalBudget += budget.limit;
        acc.totalSpent += budget.actualSpent || budget.spent;
        acc.totalRemaining += budget.remaining;
        
        if (budget.status === 'exceeded') {
          acc.exceededCount++;
        } else if (budget.status === 'warning') {
          acc.warningCount++;
        } else {
          acc.goodCount++;
        }
        
        return acc;
      }, {
        totalBudget: 0,
        totalSpent: 0,
        totalRemaining: 0,
        exceededCount: 0,
        warningCount: 0,
        goodCount: 0,
        totalCategories: budgets.length
      });

      return summary;
    } catch (error) {
      throw error;
    }
  }
};
