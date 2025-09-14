const User = require('../models/user');
const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const { validationResult } = require('express-validator');

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, avatar } = req.body;

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    const user = await User.findById(req.user.id).select('-password');
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Total transactions count
    const totalTransactions = await Transaction.countDocuments({ user: userId });

    // Total income and expenses (all time)
    const totalStats = await Transaction.aggregate([
      {
        $match: { user: userId }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Current year stats
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);
    
    const yearlyStats = await Transaction.aggregate([
      {
        $match: { 
          user: userId,
          date: { $gte: yearStart, $lte: yearEnd }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly breakdown for current year
    const monthlyBreakdown = await Transaction.aggregate([
      {
        $match: { 
          user: userId,
          date: { $gte: yearStart, $lte: yearEnd }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    // Top spending categories
    const topCategories = await Transaction.aggregate([
      {
        $match: { 
          user: userId,
          type: 'expense',
          date: { $gte: yearStart, $lte: yearEnd }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    // Active budgets count
    const activeBudgets = await Budget.countDocuments({
      user: userId,
      month: currentDate.getMonth() + 1,
      year: currentYear
    });

    // Budget performance
    const budgetPerformance = await Budget.aggregate([
      {
        $match: {
          user: userId,
          month: currentDate.getMonth() + 1,
          year: currentYear
        }
      },
      {
        $project: {
          category: 1,
          limit: 1,
          spent: 1,
          percentage: {
            $multiply: [
              { $divide: ['$spent', '$limit'] },
              100
            ]
          }
        }
      }
    ]);

    // Format the response
    const income = totalStats.find(stat => stat._id === 'income');
    const expense = totalStats.find(stat => stat._id === 'expense');
    
    const yearlyIncome = yearlyStats.find(stat => stat._id === 'income');
    const yearlyExpense = yearlyStats.find(stat => stat._id === 'expense');

    res.json({
      overview: {
        totalTransactions,
        totalIncome: income ? income.total : 0,
        totalExpenses: expense ? expense.total : 0,
        netWorth: (income ? income.total : 0) - (expense ? expense.total : 0)
      },
      currentYear: {
        income: yearlyIncome ? yearlyIncome.total : 0,
        expenses: yearlyExpense ? yearlyExpense.total : 0,
        savings: (yearlyIncome ? yearlyIncome.total : 0) - (yearlyExpense ? yearlyExpense.total : 0),
        transactionCount: (yearlyIncome ? yearlyIncome.count : 0) + (yearlyExpense ? yearlyExpense.count : 0)
      },
      monthlyTrends: monthlyBreakdown,
      topCategories,
      budgets: {
        active: activeBudgets,
        performance: budgetPerformance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all user's transactions
    await Transaction.deleteMany({ user: userId });
    
    // Delete all user's budgets
    await Budget.deleteMany({ user: userId });
    
    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  updateUserProfile,
  getUserStats,
  deleteUserAccount
};
