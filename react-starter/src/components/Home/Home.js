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
      <p className="property-description">{property.description}</p>
      <p>Prix : {property.price.$numberDecimal}€ / nuit</p>
      <button>View Details</button>
    </div>
  );
}


export default function Home({ handleLogout }) {
  const [properties, setProperties] = useState([]);
  const [limit, setLimit] = useState(20);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false); 

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  function loadMoreProperties() {
    setLoading(true);
    axios
      .get("http://localhost:3001/offert", {
        params: { limit, skip: skip + limit }
      })
      .then((response) => {
        setProperties((prevProperties) => [...prevProperties, ...response.data]);
        setSkip((prevSkip) => prevSkip + limit);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching more properties:", error);
        setLoading(false);
      });
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
        <Navbar handleLogout={handleLogout} />
      <h1>Tema le site</h1>
      <div className="property-list">
        {properties.map((property) => (
          <Property key={property._id} property={property} />
        ))}
      </div>
      {loading && <div className="loading-indicator">Chargement...</div>}
      <button className="load-more-button" onClick={loadMoreProperties}>
        Charger plus d'offres
        </button>
        <button className="logout-button" onClick={handleLogout}>
        Déconnexion
        </button>
      <Footer />
    </div>
  );
}
