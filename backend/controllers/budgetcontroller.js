const Budget = require('../models/budget');
const Transaction = require('../models/transaction');
const { validationResult } = require('express-validator');

// Create new budget
const createBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, limit, month, year } = req.body;

    // Check if budget already exists for this category/month/year
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category,
      month,
      year
    });

    if (existingBudget) {
      return res.status(400).json({ 
        message: 'Budget already exists for this category and month' 
      });
    }

    // Calculate current spending for this category/month/year
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const spentAmount = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          type: 'expense',
          category,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const spent = spentAmount.length > 0 ? spentAmount[0].total : 0;

    const budget = await Budget.create({
      user: req.user.id,
      category,
      limit,
      spent,
      month,
      year
    });

    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Budget already exists for this category and month' 
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get budgets with optional filtering
const getBudgets = async (req, res) => {
  try {
    const currentDate = new Date();
    const month = parseInt(req.query.month) || currentDate.getMonth() + 1;
    const year = parseInt(req.query.year) || currentDate.getFullYear();

    const budgets = await Budget.find({
      user: req.user.id,
      month,
      year
    }).sort({ category: 1 });

    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get budget progress with detailed breakdown
const getBudgetProgress = async (req, res) => {
  try {
    const currentDate = new Date();
    const month = parseInt(req.query.month) || currentDate.getMonth() + 1;
    const year = parseInt(req.query.year) || currentDate.getFullYear();

    const budgets = await Budget.find({
      user: req.user.id,
      month,
      year
    });

    const budgetProgress = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get actual spending for this category this month
        const actualSpending = await Transaction.aggregate([
          {
            $match: {
              user: req.user.id,
              type: 'expense',
              category: budget.category,
              date: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]);

        const spent = actualSpending.length > 0 ? actualSpending[0].total : 0;
        const transactionCount = actualSpending.length > 0 ? actualSpending[0].count : 0;
        const percentage = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;
        const remaining = budget.limit - spent;

        // Determine status
        let status = 'good';
        if (percentage >= 100) {
          status = 'exceeded';
        } else if (percentage >= 80) {
          status = 'warning';
        }

        return {
          ...budget.toObject(),
          actualSpent: spent,
          percentage,
          remaining: Math.max(0, remaining),
          status,
          transactionCount
        };
      })
    );

    res.json(budgetProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single budget
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update budget
const updateBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Update budget
    Object.assign(budget, req.body);
    await budget.save();

    res.json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Budget already exists for this category and month' 
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetProgress,
  getBudgetById,
  updateBudget,
  deleteBudget
};
