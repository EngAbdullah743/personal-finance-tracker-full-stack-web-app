import React, { useState } from 'react';
import { useTransactions } from '../../context/transactioncontext';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../transactions/transactionform';
import Modal from '../common/modal';

const QuickActions = () => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const { createTransaction } = useTransactions();
  const navigate = useNavigate();

  const handleAddIncome = () => {
    setTransactionType('income');
    setShowTransactionModal(true);
  };

  const handleAddExpense = () => {
    setTransactionType('expense');
    setShowTransactionModal(true);
  };

  const handleTransactionSubmit = async (transactionData) => {
    try {
      await createTransaction({
        ...transactionData,
        type: transactionType
      });
      setShowTransactionModal(false);
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const quickActions = [
    {
      id: 'add-income',
      title: 'Add Income',
      description: 'Record your earnings',
      icon: '💰',
      color: 'green',
      onClick: handleAddIncome
    },
    {
      id: 'add-expense',
      title: 'Add Expense',
      description: 'Track your spending',
      icon: '💸',
      color: 'red',
      onClick: handleAddExpense
    },
    {
      id: 'view-transactions',
      title: 'View Transactions',
      description: 'See all your records',
      icon: '📋',
      color: 'blue',
      onClick: () => navigate('/transactions')
    },
    {
      id: 'manage-budgets',
      title: 'Manage Budgets',
      description: 'Set spending limits',
      icon: '🎯',
      color: 'purple',
      onClick: () => navigate('/budgets')
    }
  ];

  return (
    <>
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className={`quick-action-card ${action.color}`}
              onClick={action.onClick}
            >
              <div className="quick-action-icon">
                {action.icon}
              </div>
              <div className="quick-action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title={`Add ${transactionType === 'income' ? 'Income' : 'Expense'}`}
        size="medium"
      >
        <TransactionForm
          onSubmit={handleTransactionSubmit}
          onCancel={() => setShowTransactionModal(false)}
          initialType={transactionType}
        />
      </Modal>
    </>
  );
};

export default QuickActions;
