import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import Footer from "../Footer/Footer";

function Property({ property }) {
  return (
    <div className="property">
      <img src={property.images.picture_url} alt={property.name} />
      <h3>{property.name}</h3>
      <p>{property.description}</p>
      <p>Prix : {property.price.$numberDecimal}€ / nuit</p>
      <button>View Details</button>
    </div>
  );
}

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [limit, setLimit] = useState(20);
  const [skip, setSkip] = useState(0);

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  useEffect(() => {
    axios
      .get("http://localhost:3001/offert", {
        params: { limit, skip }
      }) 
      .then((response) => {
        setProperties(response.data);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
      });
  }, []);

  return (
    <div className="home">
        <Navbar /> 
      <h1>Tema le site</h1>
      <div className="property-list">
        {properties.map((property) => (
          <Property key={property._id} property={property} />
        ))}
      </div>
        <button className="logout-button" onClick={handleLogout}>
        Déconnexion
        </button>
      <Footer />
    </div>
  );
}
