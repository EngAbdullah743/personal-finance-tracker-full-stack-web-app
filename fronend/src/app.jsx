import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authcontext';
import { TransactionProvider } from './context/transactioncontext';
import ProtectedRoute from './components/Auth/protectedroute';
import Login from './components/Auth/login';
import Register from './components/Auth/register';
import Layout from './components/layout/layout';
import Dashboard from './components/dashboard/dashboard';
import TransactionList from './components/transactions/transactionlist';
import BudgetOverview from './components/budget/budgetoverview';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <div className="App">
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <Layout>
                    <TransactionList />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/budgets" element={
                <ProtectedRoute>
                  <Layout>
                    <BudgetOverview />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
