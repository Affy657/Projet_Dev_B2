
import React, { useState } from 'react';
import './AddOffer.css';

function AddOffer() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    // TODO: Envoyer les données à votre API ou votre base de données

    console.log({
      title,
      description,
      pricePerNight,
      address,
      imageUrl,
    });

    setTitle('');
    setDescription('');
    setPricePerNight('');
    setAddress('');
    setImageUrl('');
  }

  return (
    <div className="add-offer-wrapper">
      <form className="add-offer-form" onSubmit={handleSubmit}>
        <h1>Ajouter une offre</h1>
        <label className="add-offer-label">
          <p>Titre</p>
          <input
            className="add-offer-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label className="add-offer-label">
          <p>Description</p>
          <textarea
            className="add-offer-input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </label>
        <label className="add-offer-label">
          <p>Adresse</p>
          <input
            className="add-offer-input"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
          />
        </label>
        <label className="add-offer-label">
          <p>URL de l'image</p>
          <input
            className="add-offer-input"
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            required
          />
        </label>
        <label className="add-offer-label">
          <p>Prix par nuit (€)</p>
          <input
            className="add-offer-input"
            type="number"
            value={pricePerNight}
            onChange={(event) => setPricePerNight(event.target.value)}
            required
          />
        </label>
        <button className="add-offer-button" type="submit">
          Ajouter l'offre
        </button>
      </form>
    </div>
  );
}

export default AddOffer;
