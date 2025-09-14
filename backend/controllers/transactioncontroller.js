const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const { validationResult } = require('express-validator');

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date: new Date(date)
    });

    // Update budget spending if it's an expense
    if (type === 'expense') {
      const transactionDate = new Date(date);
      const month = transactionDate.getMonth() + 1;
      const year = transactionDate.getFullYear();

      await Budget.findOneAndUpdate(
        { 
          user: req.user.id, 
          category, 
          month, 
          year 
        },
        { $inc: { spent: amount } },
        { new: true }
      );
    }

    await transaction.populate('user', 'name email');
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get transactions with filtering and pagination
const getTransactions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { user: req.user.id };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    if (req.query.search) {
      filter.description = { $regex: req.query.search, $options: 'i' };
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single transaction
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const oldAmount = transaction.amount;
    const oldCategory = transaction.category;
    const oldType = transaction.type;
    const oldDate = transaction.date;

    // Update transaction
    Object.assign(transaction, req.body);
    if (req.body.date) {
      transaction.date = new Date(req.body.date);
    }
    
    await transaction.save();

    // Update budget calculations
    if (oldType === 'expense') {
      const oldMonth = oldDate.getMonth() + 1;
      const oldYear = oldDate.getFullYear();
      
      // Remove old amount from budget
      await Budget.findOneAndUpdate(
        { user: req.user.id, category: oldCategory, month: oldMonth, year: oldYear },
        { $inc: { spent: -oldAmount } }
      );
    }

    if (transaction.type === 'expense') {
      const newMonth = transaction.date.getMonth() + 1;
      const newYear = transaction.date.getFullYear();
      
      // Add new amount to budget
      await Budget.findOneAndUpdate(
        { user: req.user.id, category: transaction.category, month: newMonth, year: newYear },
        { $inc: { spent: transaction.amount } }
      );
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update budget if it was an expense
    if (transaction.type === 'expense') {
      const month = transaction.date.getMonth() + 1;
      const year = transaction.date.getFullYear();
      
      await Budget.findOneAndUpdate(
        { user: req.user.id, category: transaction.category, month, year },
        { $inc: { spent: -transaction.amount } }
      );
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get transaction statistics
const getTransactionStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Current month stats
    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
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

    // Category breakdown for current month
    const categoryStats = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Recent transactions (last 6 months for chart)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      monthly: monthlyStats,
      categories: categoryStats,
      trends: monthlyTrends
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
};
