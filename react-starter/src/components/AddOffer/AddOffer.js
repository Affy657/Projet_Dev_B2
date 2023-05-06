import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./AddOffer.css";

function AddOffer() {
  const [offers, setOffers] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    const newOffer = {
      title: e.target.title.value,
      description: e.target.description.value,
      price: e.target.price.value,
      address: e.target.address.value,
      imageURL: e.target.imageURL.value,
    };
    setOffers([...offers, newOffer]);
  }

  return (
    <div className="add-offer">
      <Navbar />
      <div className="add-offer-content">
        <div className="offers-list">
          <h2>Mes offres</h2>
          {offers.length === 0 ? (
            <p>Vous n'avez pas encore d'offres.</p>
          ) : (
            <ul>
              {offers.map((offer, index) => (
                <li key={index}>
                  {offer.title} - {offer.price}€
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="add-offer-form-container">
          <h2>Ajouter une offre</h2>
          <form onSubmit={handleSubmit} className="add-offer-form">
            <label className="add-offer-label">Titre :</label>
            <input type="text" name="title" className="add-offer-input" />
            <label className="add-offer-label">Description :</label>
            <input type="text" name="description" className="add-offer-input" />
            <label className="add-offer-label">Prix par nuit :</label>
            <input type="number" name="price" className="add-offer-input" />
            <label className="add-offer-label">Adresse :</label>
            <input type="text" name="address" className="add-offer-input" />
            <label className="add-offer-label">URL de l'image :</label>
            <input type="text" name="imageURL" className="add-offer-input" />
            <button type="submit" className="add-offer-button">
              Ajouter l'offre
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddOffer;
