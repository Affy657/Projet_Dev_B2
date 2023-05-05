import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './PropertyDetails.css';

function PropertyDetails() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/properties/${propertyId}`);
      setProperty(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="property-details-loading">Chargement...</div>;
  }

  if (!property) {
    return <div className="property-details-not-found">Offre non trouvée.</div>;
  }

  return (
    <div className="property-details">
      <h2>{property.title}</h2>
      <img src={property.imageUrl} alt={property.title} />
      <p>{property.description}</p>
      <p>Prix: {property.price} €</p>
    </div>
  );
}

export default PropertyDetails;
