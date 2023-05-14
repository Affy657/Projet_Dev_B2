import React, { useState, useEffect, useContext, useReducer } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import { FilterContext } from '../../lib/filterContext';

function Property({ property }) {
  return (
    <div className="property">
      <img src={property.images.picture_url} alt={property.name} />
      <h3>{property.name}</h3>
      <p className="property-description">{property.description}</p>
      <div className="price-dropdown">
        <p> {Math.floor(property.price.$numberDecimal)} € par nuit</p>
        {!property.isAvailable && <span className="material-symbols-outlined">cancel</span>}
        {!property.isAvailable && <div className="price-dropdown-content">
          <p>Cet offre n&apos;est pas disponible entre votre arrivé et départ</p>
        </div>}
      </div>
    </div>
  );
}

function offertsReducer(offerts, action) {
  switch (action.type) {
    case 'new':
        return [...action.offerts];
    case 'update':
        return [...offerts, ...action.offerts];
    default:
        return [...action.offerts]
  }
}

export default function Home() {
  const filters = useContext(FilterContext)
  const [offerts, offertsDispatch] = useReducer(offertsReducer, []);
  const [skipParams, setSkipParams] = useState(0);
  const [requestOffertLoading, setRequestOffertLoading] = useState(true);
  
  const limitParams = 20;

  useEffect(() => {
    setSkipParams(() => 0);
    offertsDispatch({type: 'new', offerts: []});
    setRequestOffertLoading(true);
  }, [filters]);

  useEffect(() => {
    setRequestOffertLoading(true);

    const controller = new AbortController();
    axios
      .get("http://localhost:3001/offert", {
        params: { limit: limitParams, skip: skipParams, ...filters },
        signal: controller.signal
      }) 
      .then((response) => {
        offertsDispatch({type: 'update', offerts: response.data});
        setRequestOffertLoading(false);
      })
      .catch((error) => {
        if (error.code === "ERR_CANCELED") {
          console.log('[📡] API GET /offert abborted: CANCELED');
          return;
        }
        if (error.code === "ERR_NETWORK") {
          console.log('[📡] API GET /offert Network Error: Maybe request aborted');
        }
        console.error("Error fetching properties:", error);
        setRequestOffertLoading(false);
      });

      return () => controller.abort();
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
        {offerts.map((offert) => <Link key={offert._id} to={`/offert/${offert._id}`}>            
            <Property property={offert} />  
        </Link>)}
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
