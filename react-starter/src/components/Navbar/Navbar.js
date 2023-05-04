import React from "react";
import "./Navbar.css";
import SearchBar from "./SearchBar/SearchBar";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">React Airbnb</div>
      <div className="search-bar">
        <SearchBar />
      </div>
      <div className="profile-icon">Profile</div>
    </div>
  );
}
