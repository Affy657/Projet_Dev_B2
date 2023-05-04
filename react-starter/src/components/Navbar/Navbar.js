import React from 'react';
import './Navbar.css';
import SearchBar from './SearchBar/SearchBar';

function Navbar({ handleLogout }) {
  return (
    <div className="navbar">
      <div className="logo">React Airbnb</div>
      <div className="search-bar">
        <SearchBar />
      </div>
      <div className="dropdown">
        <span className="profile-icon">Profile</span>
        <div className="dropdown-content">
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
