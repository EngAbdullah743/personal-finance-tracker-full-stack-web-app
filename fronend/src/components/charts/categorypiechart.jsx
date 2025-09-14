import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CATEGORY_ICONS } from '../../utils/constants';

const CategoryPieChart = ({ data = [] }) => {
  // Color palette for categories
  const COLORS = [
    '#3B82F6', 
    '#8B5CF6', 
    '#F59E0B', 
    '#EF4444', 
    '#10B981', 
    '#F97316', 
    '#06B6D4', 
    '#84CC16', 
    '#EC4899', 
    '#6366F1', 
    '#14B8A6', 
    '#F43F5E'  
  ];

  const processData = () => {
    return data.map((item, index) => ({
      name: item._id,
      value: item.total,
      count: item.count,
      color: COLORS[index % COLORS.length],
      icon: CATEGORY_ICONS[item._id] || '📦'
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalSpending = processedData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / totalSpending) * 100).toFixed(1);
      
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">
            {data.icon} {data.name}
          </p>
          <p className="tooltip-value">
            Amount: {formatCurrency(data.value)}
          </p>
          <p className="tooltip-percentage">
            {percentage}% of total spending
          </p>
          <p className="tooltip-count">
            {data.count} transaction{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    const totalSpending = processedData.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="pie-legend">
        {payload.map((entry, index) => {
          const percentage = ((entry.payload.value / totalSpending) * 100).toFixed(1);
          return (
            <div key={index} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="legend-icon">{entry.payload.icon}</span>
              <span className="legend-text">
                {entry.value} ({percentage}%)
              </span>
              <span className="legend-amount">
                {formatCurrency(entry.payload.value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const processedData = processData();

  if (processedData.length === 0) {
    return (
      <div className="chart-empty">
        <p>No spending data available</p>
        <small>Add some expense transactions to see category breakdown</small>
      </div>
    );
  }

  return (
    <div className="category-pie-chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      <CustomLegend payload={processedData} />
      
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Total Categories:</span>
          <span className="summary-value">{processedData.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Spending:</span>
          <span className="summary-value">
            {formatCurrency(processedData.reduce((sum, item) => sum + item.value, 0))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Top Category:</span>
          <span className="summary-value">
            {processedData.length > 0 ? (
              <>
                {processedData[0].icon} {processedData[0].name}
              </>
            ) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
