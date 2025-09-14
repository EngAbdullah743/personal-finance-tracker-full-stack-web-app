import React, { useState } from 'react';
import { useTransactions } from '../../context/transactioncontext';
import { TRANSACTION_CATEGORIES } from '../../utils/constants';

const TransactionFilters = () => {
  const { filters, setFilters, clearFilters, searchTransactions } = useTransactions();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
      page: 1 // Reset to first page when filtering
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (filters.search.trim()) {
      searchTransactions(filters.search.trim(), filters);
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    setShowAdvanced(false);
  };

  const getDatePresets = () => {
    const today = new Date();
    const presets = [
      {
        label: 'This Month',
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: today
      },
      {
        label: 'Last Month',
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        endDate: new Date(today.getFullYear(), today.getMonth(), 0)
      },
      {
        label: 'Last 30 Days',
        startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        endDate: today
      },
      {
        label: 'Last 90 Days',
        startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
        endDate: today
      }
    ];

    return presets.map(preset => ({
      ...preset,
      startDate: preset.startDate.toISOString().split('T')[0],
      endDate: preset.endDate.toISOString().split('T')[0]
    }));
  };

  const handleDatePreset = (startDate, endDate) => {
    setFilters({
      ...filters,
      startDate,
      endDate,
      page: 1
    });
  };

  const hasActiveFilters = () => {
    return filters.type || filters.category || filters.startDate || filters.endDate || filters.search;
  };

  return (
    <div className="transaction-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <div className="filter-actions">
          <button
            className="btn btn-link"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
          {hasActiveFilters() && (
            <button
              className="btn btn-link clear-filters"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="filters-content">
        {/* Search */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-input search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </div>
        </form>

        {/* Quick Filters */}
        <div className="quick-filters">
          <div className="filter-group">
            <label>Type:</label>
            <div className="filter-options">
              <button
                className={`filter-btn ${filters.type === '' ? 'active' : ''}`}
                onClick={() => handleFilterChange('type', '')}
              >
                All
              </button>
              <button
                className={`filter-btn income ${filters.type === 'income' ? 'active' : ''}`}
                onClick={() => handleFilterChange('type', 'income')}
              >
                Income
              </button>
              <button
                className={`filter-btn expense ${filters.type === 'expense' ? 'active' : ''}`}
                onClick={() => handleFilterChange('type', 'expense')}
              >
                Expenses
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-input"
            >
              <option value="">All Categories</option>
              {Object.values(TRANSACTION_CATEGORIES).map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="advanced-filters">
            {/* Date Range */}
            <div className="filter-group date-range">
              <label>Date Range:</label>
              <div className="date-inputs">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="form-input"
                  placeholder="Start Date"
                />
                <span className="date-separator">to</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="form-input"
                  placeholder="End Date"
                />
              </div>
            </div>

            {/* Date Presets */}
            <div className="filter-group">
              <label>Quick Dates:</label>
              <div className="date-presets">
                {getDatePresets().map((preset, index) => (
                  <button
                    key={index}
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDatePreset(preset.startDate, preset.endDate)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Range */}
            <div className="filter-group">
              <label>Amount Range:</label>
              <div className="amount-inputs">
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    value={filters.minAmount || ''}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    placeholder="Min"
                    min="0"
                    step="0.01"
                    className="form-input"
                  />
                </div>
                <span className="amount-separator">to</span>
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    value={filters.maxAmount || ''}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    placeholder="Max"
                    min="0"
                    step="0.01"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="active-filters">
          <span>Active filters:</span>
          {filters.type && (
            <span className="filter-tag">
              Type: {filters.type}
              <button onClick={() => handleFilterChange('type', '')}>×</button>
            </span>
          )}
          {filters.category && (
            <span className="filter-tag">
              Category: {filters.category}
              <button onClick={() => handleFilterChange('category', '')}>×</button>
            </span>
          )}
          {filters.startDate && (
            <span className="filter-tag">
              From: {filters.startDate}
              <button onClick={() => handleFilterChange('startDate', '')}>×</button>
            </span>
          )}
          {filters.endDate && (
            <span className="filter-tag">
              To: {filters.endDate}
              <button onClick={() => handleFilterChange('endDate', '')}>×</button>
            </span>
          )}
          {filters.search && (
            <span className="filter-tag">
              Search: "{filters.search}"
              <button onClick={() => handleFilterChange('search', '')}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
