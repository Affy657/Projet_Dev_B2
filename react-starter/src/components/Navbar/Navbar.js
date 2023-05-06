import React from "react";
import "./Navbar.css";
import SearchBar from "./SearchBar/SearchBar";
import { Link } from "react-router-dom";

export default function Navbar({ handleLogout }) {
  return (
    <div className="navbar">
      <Link to="/" className="logo-link">
        <div className="logo">React Airbnb</div>
      </Link>
      <div className="search-bar">
        <SearchBar />
      </div>
      <div className="dropdown">
        <span className="profile-icon">Profile</span>
        <div className="dropdown-content">
          <Link to="/add-offer">Mettre mon logement sur React Airbnb</Link>
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
