import React from "react";
import "./Navbar.css";
import SearchBar from "./SearchBar/SearchBar";
import { Link } from "react-router-dom";

export default function Navbar({ handleLogout, showSearchBar = false }) {
  return (
    <div className="navbar">
      <Link to="/" className="logo-link">
        <div className="logo">React Airbnb</div>
      </Link>
      <div className="search-bar">
        {showSearchBar && <SearchBar />}
      </div>
      <div className="dropdown">
      <span className="material-symbols-outlined">
          menu
            </span>
        <div className="dropdown-content">
          <Link to="/add-offer">Mettre mon logement sur React Airbnb</Link>
          <Link to="/booking">Mes reservation</Link>
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
