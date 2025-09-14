import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExpenseChart = ({ data = [] }) => {
  // Process the data to create a chart-friendly format
  const processData = () => {
    const monthlyData = {};
    
    data.forEach(item => {
      const { _id: { year, month, type }, total } = item;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      
      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: getMonthName(month),
          year,
          income: 0,
          expense: 0,
          date: `${year}-${month.toString().padStart(2, '0')}`
        };
      }
      
      monthlyData[key][type] = total;
    });

    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-6); // Show last 6 months
  };

  const getMonthName = (month) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = processData();

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>No data available for chart</p>
        <small>Add some transactions to see your expense trends</small>
      </div>
    );
  }

  return (
    <div className="expense-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month"
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            name="Income"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color income"></div>
          <span>Income</span>
        </div>
        <div className="legend-item">
          <div className="legend-color expense"></div>
          <span>Expenses</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
