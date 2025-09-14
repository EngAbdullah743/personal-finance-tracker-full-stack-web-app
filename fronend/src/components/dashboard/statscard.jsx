import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon,
  onClick 
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return '↗️';
      case 'negative':
        return '↘️';
      default:
        return '➡️';
    }
  };

  return (
    <div 
      className={`stats-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stats-card-header">
        <div className="stats-card-icon">
          {icon}
        </div>
        <div className="stats-card-title">
          {title}
        </div>
      </div>
      
      <div className="stats-card-content">
        <div className="stats-card-value">
          {value}
        </div>
        
        {change && (
          <div className={`stats-card-change ${getChangeColor(changeType)}`}>
            <span className="change-icon">
              {getChangeIcon(changeType)}
            </span>
            <span className="change-text">
              {change} from last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
