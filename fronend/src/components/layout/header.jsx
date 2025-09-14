import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/authcontext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuToggle, showMobileMenu }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${showMobileMenu ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className="header-brand">
          <h1 className="brand-name">Finance Tracker</h1>
          <span className="brand-subtitle">{getCurrentDate()}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button
            className="header-btn"
            onClick={() => navigate('/transactions/new')}
            title="Add Transaction"
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Add Transaction</span>
          </button>

          <div className="user-menu-container" ref={userMenuRef}>
            <button
              className="user-menu-toggle"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <div className="user-avatar">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="avatar-image"
                  />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-email">{user?.email}</span>
              </div>
              <span className={`dropdown-arrow ${showUserMenu ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="user-details">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                  </div>
                </div>
                
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={handleProfile}
                  >
                    <span className="item-icon">👤</span>
                    Profile Settings
                  </button>
                  
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate('/export');
                      setShowUserMenu(false);
                    }}
                  >
                    <span className="item-icon">📊</span>
                    Export Data
                  </button>
                  
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate('/help');
                      setShowUserMenu(false);
                    }}
                  >
                    <span className="item-icon">❓</span>
                    Help & Support
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <span className="item-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
