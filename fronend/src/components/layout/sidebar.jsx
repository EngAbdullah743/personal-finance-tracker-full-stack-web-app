import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authcontext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: '📊',
      description: 'Overview of your finances'
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: '💳',
      description: 'Manage income and expenses'
    },
    {
      name: 'Budgets',
      path: '/budgets',
      icon: '🎯',
      description: 'Set and track spending limits'
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: '📈',
      description: 'Detailed financial analysis'
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: '🏷️',
      description: 'Organize your transactions'
    }
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">💰</div>
            <div className="brand-info">
              <h2>Finance Tracker</h2>
              <p>Personal Finance Manager</p>
            </div>
          </div>
          
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-greeting">
            <span className="greeting-text">{getGreeting()},</span>
            <span className="user-name">{user?.name?.split(' ')[0]}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-title">Main</h3>
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    onClick={handleLinkClick}
                    end={item.path === '/'}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <div className="nav-content">
                      <span className="nav-name">{item.name}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-section">
            <h3 className="nav-title">Tools</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink
                  to="/calculator"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={handleLinkClick}
                >
                  <span className="nav-icon">🧮</span>
                  <div className="nav-content">
                    <span className="nav-name">Calculator</span>
                    <span className="nav-description">Financial calculators</span>
                  </div>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/export"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={handleLinkClick}
                >
                  <span className="nav-icon">📤</span>
                  <div className="nav-content">
                    <span className="nav-name">Export</span>
                    <span className="nav-description">Download your data</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="footer-stats">
            <div className="stat-item">
              <span className="stat-label">This Month</span>
              <span className="stat-value">$0.00</span>
            </div>
          </div>
          
          <div className="footer-links">
            <NavLink to="/settings" className="footer-link" onClick={handleLinkClick}>
              <span className="link-icon">⚙️</span>
              Settings
            </NavLink>
            <NavLink to="/help" className="footer-link" onClick={handleLinkClick}>
              <span className="link-icon">❓</span>
              Help
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
