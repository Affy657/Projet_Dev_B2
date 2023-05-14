import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { FilterContext } from "../../lib/filterContext";

import './PropertyDetails.css';

function PropertyDetails() {
  const filters = useContext(FilterContext);
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/offert/${propertyId}`);
        setProperty(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property details:', error);
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const handleClickBook = () => {
    setLoading(true);
    axios.post(`http://localhost:3001/offert/${propertyId}/book`, {
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      guests: filters.guests
    }, {
      headers: {
        Authorization: window.localStorage.getItem('token')
      }
    })
      .then((response) => {
        setLoading(false);
        if (response.data.bookId) {
          console.log('/booking');
          navigate('/booking');
        }
      })
  }

  if (loading) {  
    return(   
    <div className="property-details">
     <div className="property-details-loading">
      <Navbar />
      Chargement...
      </div>
      <Footer />
      </div>
    );
  }

  if (!property) {
    return <div className="property-details-not-found">Offre non trouvée.</div>;
  }

return (
  <div className="property-details">
    <Navbar />
    <div className="property-details-content">
      <h2 className="property-details-title">{property.name}</h2>
      <img className="property-details-image" src={property.images.picture_url} alt={property.title} />
      <p className="property-details-description">{property.description}</p>
      <p className="property-details-price">Prix: {property.price.$numberDecimal} €</p>
      <button className="property-details-book" onClick={handleClickBook}>Réserver</button>
    </div>
    <Footer />
  </div>
);

}

export default PropertyDetails;
