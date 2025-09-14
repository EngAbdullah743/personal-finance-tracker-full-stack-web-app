import api from './api';

export const transactionService = {
  // Create new transaction
  create: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get transactions with filters and pagination
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/transactions?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single transaction by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update transaction
  update: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete transaction
  delete: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction statistics
  getStats: async () => {
    try {
      const response = await api.get('/transactions/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get transactions for export
  getForExport: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('limit', '1000'); // Get more for export
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/transactions?${params.toString()}`);
      return response.data.transactions;
    } catch (error) {
      throw error;
    }
  },

  // Get recent transactions
  getRecent: async (limit = 5) => {
    try {
      const response = await api.get(`/transactions?limit=${limit}&page=1`);
      return response.data.transactions;
    } catch (error) {
      throw error;
    }
  },

  // Search transactions
  search: async (searchTerm, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('search', searchTerm);
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/transactions?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
