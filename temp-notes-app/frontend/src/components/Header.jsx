import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="app-title">Notes App</div>
        <div className="profile-section">
          <button className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {user && user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
