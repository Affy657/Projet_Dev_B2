import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Home.css";

function Property({ property }) {
  return (
    <div className="property">
      <img src={property.imageUrl} alt={property.title} />
      <h3>{property.title}</h3>
      <p>{property.description}</p>
      <p>Prix : {property.price}€ / nuit</p>
      <button>View Details</button>
    </div>
  );
}

export default function Home() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/properties") // remplacer ca par l'api
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
    </div>
  );
}
