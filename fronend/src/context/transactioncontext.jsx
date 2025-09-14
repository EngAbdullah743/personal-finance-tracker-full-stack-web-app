import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { transactionService } from '../services/transactionservice';
import toast from 'react-hot-toast';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};

// Action types
const actionTypes = {
  FETCH_TRANSACTIONS_REQUEST: 'FETCH_TRANSACTIONS_REQUEST',
  FETCH_TRANSACTIONS_SUCCESS: 'FETCH_TRANSACTIONS_SUCCESS',
  FETCH_TRANSACTIONS_ERROR: 'FETCH_TRANSACTIONS_ERROR',
  CREATE_TRANSACTION_SUCCESS: 'CREATE_TRANSACTION_SUCCESS',
  UPDATE_TRANSACTION_SUCCESS: 'UPDATE_TRANSACTION_SUCCESS',
  DELETE_TRANSACTION_SUCCESS: 'DELETE_TRANSACTION_SUCCESS',
  FETCH_STATS_SUCCESS: 'FETCH_STATS_SUCCESS',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS'
};

// Initial state
const initialState = {
  transactions: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0
  },
  stats: {
    monthly: [],
    categories: [],
    trends: []
  },
  filters: {
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    search: '',
    page: 1,
    limit: 20
  }
};

// Reducer
const transactionReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TRANSACTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actionTypes.FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        transactions: action.payload.transactions,
        pagination: action.payload.pagination,
        error: null
      };

    case actionTypes.FETCH_TRANSACTIONS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        transactions: []
      };

    case actionTypes.CREATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };

    case actionTypes.UPDATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction._id === action.payload._id ? action.payload : transaction
        )
      };

    case actionTypes.DELETE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transaction._id !== action.payload
        )
      };

    case actionTypes.FETCH_STATS_SUCCESS:
      return {
        ...state,
        stats: action.payload
      };

    case actionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case actionTypes.CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...initialState.filters
        }
      };

    default:
      return state;
  }
};

// Provider component
export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Fetch transactions
  const fetchTransactions = useCallback(async (filters = {}) => {
    try {
      dispatch({ type: actionTypes.FETCH_TRANSACTIONS_REQUEST });
      
      const mergedFilters = { ...state.filters, ...filters };
      const data = await transactionService.getAll(mergedFilters);
      
      dispatch({
        type: actionTypes.FETCH_TRANSACTIONS_SUCCESS,
        payload: data
      });
    } catch (error) {
      dispatch({
        type: actionTypes.FETCH_TRANSACTIONS_ERROR,
        payload: error.message
      });
      toast.error(error.message);
    }
  }, [state.filters]);

  // Create transaction
  const createTransaction = useCallback(async (transactionData) => {
    try {
      const newTransaction = await transactionService.create(transactionData);
      
      dispatch({
        type: actionTypes.CREATE_TRANSACTION_SUCCESS,
        payload: newTransaction
      });
      
      toast.success('Transaction created successfully!');
      return newTransaction;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  // Update transaction
  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      const updatedTransaction = await transactionService.update(id, transactionData);
      
      dispatch({
        type: actionTypes.UPDATE_TRANSACTION_SUCCESS,
        payload: updatedTransaction
      });
      
      toast.success('Transaction updated successfully!');
      return updatedTransaction;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback(async (id) => {
    try {
      await transactionService.delete(id);
      
      dispatch({
        type: actionTypes.DELETE_TRANSACTION_SUCCESS,
        payload: id
      });
      
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const stats = await transactionService.getStats();
      
      dispatch({
        type: actionTypes.FETCH_STATS_SUCCESS,
        payload: stats
      });
    } catch (error) {
      toast.error('Failed to fetch statistics');
    }
  }, []);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({
      type: actionTypes.SET_FILTERS,
      payload: filters
    });
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_FILTERS });
  }, []);

  // Search transactions
  const searchTransactions = useCallback(async (searchTerm, filters = {}) => {
    try {
      dispatch({ type: actionTypes.FETCH_TRANSACTIONS_REQUEST });
      
      const data = await transactionService.search(searchTerm, filters);
      
      dispatch({
        type: actionTypes.FETCH_TRANSACTIONS_SUCCESS,
        payload: data
      });
    } catch (error) {
      dispatch({
        type: actionTypes.FETCH_TRANSACTIONS_ERROR,
        payload: error.message
      });
      toast.error(error.message);
    }
  }, []);

  // Get recent transactions
  const getRecentTransactions = useCallback(async (limit = 5) => {
    try {
      return await transactionService.getRecent(limit);
    } catch (error) {
      toast.error('Failed to fetch recent transactions');
      return [];
    }
  }, []);

  const value = {
    ...state,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchStats,
    setFilters,
    clearFilters,
    searchTransactions,
    getRecentTransactions
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
