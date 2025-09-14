import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import { useTransactions } from '../../context/transactioncontext';
import { budgetService } from '../../services/budgetservice';
import StatsCard from './statscard';
import QuickActions from './quickactions';
import ExpenseChart from '../charts/expensechart';
import CategoryPieChart from '../charts/categorypiechart';
import IncomeVsExpenseChart from '../Charts/IncomeVsExpenseChart';
import BudgetProgress from '../budget/budgetprogress';
import LoadingSpinner from '../common/loadingspinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    transactions, 
    stats, 
    fetchStats, 
    getRecentTransactions,
    loading: transactionsLoading 
  } = useTransactions();
  
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load recent transactions
        const recent = await getRecentTransactions(5);
        setRecentTransactions(recent);
        
        // Load budget progress
        const budgets = await budgetService.getCurrentMonth();
        setBudgetProgress(budgets);
        
        // Load transaction stats
        await fetchStats();
        
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchStats, getRecentTransactions]);

  useEffect(() => {
    // Calculate dashboard stats from monthly data
    if (stats.monthly && stats.monthly.length > 0) {
      const income = stats.monthly.find(stat => stat._id === 'income');
      const expense = stats.monthly.find(stat => stat._id === 'expense');
      
      setDashboardStats({
        totalIncome: income ? income.total : 0,
        totalExpenses: expense ? expense.total : 0,
        netSavings: (income ? income.total : 0) - (expense ? expense.total : 0),
        transactionCount: (income ? income.count : 0) + (expense ? expense.count : 0)
      });
    }
  }, [stats]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading || transactionsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p className="dashboard-subtitle">Here's your financial overview for this month</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Income"
          value={formatCurrency(dashboardStats.totalIncome)}
          change="+12.5%"
          changeType="positive"
          icon="💰"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(dashboardStats.totalExpenses)}
          change="-2.3%"
          changeType="negative"
          icon="💸"
        />
        <StatsCard
          title="Net Savings"
          value={formatCurrency(dashboardStats.netSavings)}
          change="+8.2%"
          changeType={dashboardStats.netSavings >= 0 ? "positive" : "negative"}
          icon="💎"
        />
        <StatsCard
          title="Transactions"
          value={dashboardStats.transactionCount.toString()}
          change="+5"
          changeType="neutral"
          icon="📊"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container large">
          <h3>Expense Trends</h3>
          <ExpenseChart data={stats.trends} />
        </div>
        
        <div className="charts-row">
          <div className="chart-container">
            <h3>Spending by Category</h3>
            <CategoryPieChart data={stats.categories} />
          </div>
          
          <div className="chart-container">
            <h3>Income vs Expenses</h3>
            <IncomeVsExpenseChart data={stats.monthly} />
          </div>
        </div>
      </div>

      {/* Budget Progress & Recent Transactions */}
      <div className="dashboard-bottom">
        <div className="budget-section">
          <h3>Budget Progress</h3>
          <BudgetProgress budgets={budgetProgress} showAll={false} />
        </div>

        <div className="recent-transactions">
          <h3>Recent Transactions</h3>
          <div className="transaction-list">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction._id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-description">
                      {transaction.description}
                    </div>
                    <div className="transaction-category">
                      {transaction.category}
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-transactions">
                <p>No recent transactions found</p>
                <button className="btn-link">Add your first transaction</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
