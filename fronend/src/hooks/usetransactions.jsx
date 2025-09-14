import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionservice';
import toast from 'react-hot-toast';

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    search: '',
    ...initialFilters
  });

  const fetchTransactions = useCallback(async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = { ...filters, ...newFilters };
      const data = await transactionService.getAll(mergedFilters);
      
      setTransactions(data.transactions || []);
      setPagination(data.pagination || { current: 1, pages: 1, total: 0 });
      
      if (Object.keys(newFilters).length > 0) {
        setFilters(mergedFilters);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      const newTransaction = await transactionService.create(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transaction created successfully!');
      return newTransaction;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      const updatedTransaction = await transactionService.update(id, transactionData);
      setTransactions(prev => 
        prev.map(t => t._id === id ? updatedTransaction : t)
      );
      toast.success('Transaction updated successfully!');
      return updatedTransaction;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t._id !== id));
      toast.success('Transaction deleted successfully!');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, []);

  const searchTransactions = useCallback(async (searchTerm, searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await transactionService.search(searchTerm, {
        ...filters,
        ...searchFilters
      });
      
      setTransactions(data.transactions || []);
      setPagination(data.pagination || { current: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const exportTransactions = useCallback(async (exportFilters = {}) => {
    try {
      const data = await transactionService.getForExport({
        ...filters,
        ...exportFilters
      });
      
      // Convert to CSV
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, 'transactions.csv');
      
      toast.success('Transactions exported successfully!');
    } catch (err) {
      toast.error('Failed to export transactions');
    }
  }, [filters]);

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvRows = [headers.join(',')];
    
    data.forEach(transaction => {
      const row = [
        new Date(transaction.date).toLocaleDateString(),
        transaction.type,
        transaction.category,
        `"${transaction.description}"`,
        transaction.amount
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Auto-fetch when filters change
  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    pagination,
    filters,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    searchTransactions,
    exportTransactions,
    setFilters: (newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))
  };
};
