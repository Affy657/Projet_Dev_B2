import React from "react";
import "./Navbar.css";
import SearchBar from "./SearchBar/SearchBar";
import { Link, useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Page d'accueil",
  "/add-offer": "Ajouter une offre",
  "/booking": "Mes réservations",
  "/offert" : "Offert"
};

export default function Navbar({ handleLogout }) {
  const location = useLocation();
  console.log()
  const pageTitle = pageTitles['/' + location.pathname.split('/').at(1)];

  return (
    <div className="navbar">
      <Link to="/" className="logo-link">
        <div className="logo">React Airbnb</div>
      </Link>
      <div className="search-bar">
        {location.pathname === "/" && <SearchBar />}
        {location.pathname !== "/" && <h2>{pageTitle}</h2>}
      </div>
      <div className="dropdown">
        <span className="material-symbols-outlined">
          menu
        </span>
        <div className="dropdown-content">
          <Link to="/add-offer">Mettre mon logement sur React Airbnb</Link>
          <Link to="/booking">Mes réservations</Link>
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
