import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">React Airbnb</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a place"
          className="search-input"
        />
      </div>
      <div className="profile-icon">Profile</div>
    </div>
  );
}
