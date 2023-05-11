import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import { FilterContext } from '../../lib/filterContext';
import { removeDuplicateObject } from '../../utils';

function Property({ property }) {
  return (
    <div className="property">
      <img src={property.images.picture_url} alt={property.name} />
      <h3>{property.name}</h3>
      <p className="property-description">{property.description}</p>
      <p> {Math.floor(property.price.$numberDecimal)} € par nuit</p>
    </div>
  );
}

export default function Home() {
  const filters = useContext(FilterContext)
  const [offerts, setOfferts] = useState([]);
  const [skipParams, setSkipParams] = useState(0);
  const [requestOffertLoading, setRequestOffertLoading] = useState(true);
  
  const limitParams = 20;

  useEffect(() => {
    setSkipParams(() => 0);
    setOfferts([]);
    setRequestOffertLoading(true);
  }, [filters]);

  useEffect(() => {
    setRequestOffertLoading(true);
    axios
      .get("http://localhost:3001/offert", {
        params: { limit: limitParams, skip: skipParams, ...filters },
      }) 
      .then((response) => {
        setOfferts((prev) => [...prev, ...response.data]);
        setRequestOffertLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setRequestOffertLoading(false);
      });
  }, [filters, skipParams]);

  function loadMoreProperties() {
      setSkipParams(skipParams + limitParams);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  }

  return (
    <div className="home">
      <Navbar handleLogout={handleLogout} showSearchBar={true} />
      <div className="property-list">
        {offerts.map((offert) => (
          <Link key={offert._id} to={`/offert/${offert._id}`}>            
            <Property key={offert._id} property={offert} />  
          </Link>
        ))}
      </div>
      {requestOffertLoading && (
        <div className="loading-indicator">Chargement...</div>
      )}
      <button className="load-more-button" onClick={loadMoreProperties}>
        Charger plus d'offres
      </button>
      <Footer />
    </div>
  );
}
