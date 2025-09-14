import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../context/transactioncontext';
import TransactionFilters from './transactionfilters';
import TransactionItem from './transactionitem';
import TransactionForm from './transactionform';
import Modal from '../common/modal';
import LoadingSpinner from '../common/loadingspinner';
import ErrorMessage from '../common/errormessage';
import toast from 'react-hot-toast';

const TransactionList = () => {
  const {
    transactions,
    loading,
    error,
    pagination,
    filters,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters
  } = useTransactions();

  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState(new Set());
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, filters]);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        // Error handling is done in context
      }
    }
  };

  const handleFormSubmit = async (transactionData) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, transactionData);
      } else {
        await createTransaction(transactionData);
      }
      setShowModal(false);
      setEditingTransaction(null);
    } catch (error) {
      // Error handling is done in context
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTransactions.size === 0) {
      toast.error('No transactions selected');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedTransactions.size} transaction(s)?`;
    if (window.confirm(confirmMessage)) {
      try {
        const deletePromises = Array.from(selectedTransactions).map(id => 
          deleteTransaction(id)
        );
        await Promise.all(deletePromises);
        setSelectedTransactions(new Set());
        toast.success(`${selectedTransactions.size} transaction(s) deleted`);
      } catch (error) {
        toast.error('Failed to delete some transactions');
      }
    }
  };

  const handleSelectTransaction = (id) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTransactions.size === transactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(transactions.map(t => t._id)));
    }
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newOrder);
    
    // Apply sorting to current transactions
    const sorted = [...transactions].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      if (field === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (field === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (newOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Update transactions would need to be handled differently in a real app
    // For now, we'll just update the sort state and let the backend handle it
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => fetchTransactions()} />;
  }

  return (
    <div className="transaction-list-container">
      <div className="page-header">
        <h1>Transactions</h1>
        <button 
          className="btn btn-primary"
          onClick={handleAddTransaction}
        >
          + Add Transaction
        </button>
      </div>

      <TransactionFilters />

      <div className="transaction-actions">
        <div className="bulk-actions">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={selectedTransactions.size === transactions.length && transactions.length > 0}
              onChange={handleSelectAll}
            />
            Select All
          </label>
          
          {selectedTransactions.size > 0 && (
            <button 
              className="btn btn-danger btn-sm"
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedTransactions.size})
            </button>
          )}
        </div>

        <div className="sort-options">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
            <option value="description">Description</option>
          </select>
        </div>
      </div>

      <div className="transaction-list">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction._id}
              transaction={transaction}
              isSelected={selectedTransactions.has(transaction._id)}
              onSelect={handleSelectTransaction}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          ))
        ) : (
          <div className="no-transactions">
            <div className="empty-state">
              <h3>No transactions found</h3>
              <p>Start by adding your first transaction</p>
              <button 
                className="btn btn-primary"
                onClick={handleAddTransaction}
              >
                Add Transaction
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-outline"
            disabled={pagination.current === 1}
            onClick={() => handlePageChange(pagination.current - 1)}
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.current} of {pagination.pages}
          </span>
          
          <button
            className="btn btn-outline"
            disabled={pagination.current === pagination.pages}
            onClick={() => handlePageChange(pagination.current + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for Add/Edit Transaction */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        size="medium"
      >
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingTransaction(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default TransactionList;
