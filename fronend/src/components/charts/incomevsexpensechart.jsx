import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IncomeVsExpenseChart = ({ data = [] }) => {
  const processData = () => {
    // Group data by type (income/expense)
    const grouped = data.reduce((acc, item) => {
      const type = item._id;
      acc[type] = item.total;
      return acc;
    }, {});

    return [
      {
        name: 'This Month',
        income: grouped.income || 0,
        expense: grouped.expense || 0,
        savings: (grouped.income || 0) - (grouped.expense || 0)
      }
    ];
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(value));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <div className="tooltip-content">
            <p style={{ color: '#10B981' }}>
              Income: {formatCurrency(data.income)}
            </p>
            <p style={{ color: '#EF4444' }}>
              Expenses: {formatCurrency(data.expense)}
            </p>
            <p style={{ color: data.savings >= 0 ? '#10B981' : '#EF4444' }}>
              Net: {data.savings >= 0 ? '+' : '-'}{formatCurrency(data.savings)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartData = processData();
  const hasData = chartData[0].income > 0 || chartData[0].expense > 0;

  if (!hasData) {
    return (
      <div className="chart-empty">
        <p>No financial data available</p>
        <small>Add income and expense transactions to see comparison</small>
      </div>
    );
  }

  const maxValue = Math.max(chartData[0].income, chartData[0].expense);
  const yAxisMax = Math.ceil(maxValue * 1.2 / 1000) * 1000; // Round up to nearest thousand

  return (
    <div className="income-vs-expense-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name"
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={formatCurrency}
            domain={[0, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="income"
            fill="#10B981"
            name="Income"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
          <Bar
            dataKey="expense"
            fill="#EF4444"
            name="Expenses"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-summary">
        <div className="summary-row">
          <div className="summary-item income">
            <div className="summary-icon">💰</div>
            <div className="summary-text">
              <span className="summary-label">Total Income</span>
              <span className="summary-value">{formatCurrency(chartData[0].income)}</span>
            </div>
          </div>
          
          <div className="summary-item expense">
            <div className="summary-icon">💸</div>
            <div className="summary-text">
              <span className="summary-label">Total Expenses</span>
              <span className="summary-value">{formatCurrency(chartData[0].expense)}</span>
            </div>
          </div>
        </div>

        <div className="summary-row">
          <div className={`summary-item savings ${chartData[0].savings >= 0 ? 'positive' : 'negative'}`}>
            <div className="summary-icon">
              {chartData[0].savings >= 0 ? '💎' : '⚠️'}
            </div>
            <div className="summary-text">
              <span className="summary-label">Net Savings</span>
              <span className="summary-value">
                {chartData[0].savings >= 0 ? '+' : '-'}{formatCurrency(chartData[0].savings)}
              </span>
            </div>
          </div>
          
          <div className="summary-item ratio">
            <div className="summary-icon">📊</div>
            <div className="summary-text">
              <span className="summary-label">Savings Rate</span>
              <span className="summary-value">
                {chartData[0].income > 0 
                  ? `${((chartData[0].savings / chartData[0].income) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Indicator */}
      <div className="financial-health">
        {chartData[0].savings >= 0 ? (
          <div className="health-indicator positive">
            <span className="indicator-icon">✅</span>
            <span className="indicator-text">
              Great! You're saving money this month.
            </span>
          </div>
        ) : (
          <div className="health-indicator negative">
            <span className="indicator-icon">⚠️</span>
            <span className="indicator-text">
              You're spending more than you earn this month.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeVsExpenseChart;
