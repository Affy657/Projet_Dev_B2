import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './booking.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);


  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/offert/booking',{headers: {Authorization: window.localStorage.getItem('token')}});
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:3001/offert/booking/${bookingId}`, {
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
        .then(({ status, data }) => {
          if (status === 204) {
            setError(null);
            fetchBookings();
            return;
          }
          setError('Operation failed: ' + (data.error ?? 'unknown'));
        });
    } catch (error) {
      console.error('Error canceling booking:', error);
      setError('Operation failed: ' + (error.response.data.error ?? 'unknown'));
    }
  };

  const formatDate = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };

  return (
    <div className="booking-container">
      <Navbar />
      {error && <p className="redColor" style={{ padding: '.5rem 2rem' }}>{error}</p>}
      <ul className="booking-list">
        {[...bookings].reverse().map((booking) => {
          const startDate = new Date(booking.check_in);
          const endDate = new Date(booking.check_out);
          const intervalNotLessThanZero = 0 <= (startDate - Date.now()) / (1000 * 60 * 60 * 24);
          const interval = Math.round((startDate - Date.now()) / (1000 * 60 * 60 * 24));
          const isSoon = intervalNotLessThanZero && interval === 0;

          return (
            <li key={booking._id} className="booking-item">
              <div className="booking-info">
                <h2>{booking.offert.name} - {
                  startDate.getTime() > Date.now() ?
                    <span>{isSoon ? 'bientôt' : `dans ${interval} jours`}</span> :
                    <span>passé</span>
                }</h2>
                <p>Dates: {startDate.toLocaleDateString('fr-fr', formatDate)} - {endDate.toLocaleDateString('fr-fr', formatDate)}</p>
                <p>Nombre de voyageurs: {booking.guests}</p>
                <p></p>
              </div>
              {startDate.getTime() > Date.now() && (
                <button className="cancel-button" onClick={() => cancelBooking(booking._id)}>
                  Annuler la réservation
                </button>
              )}
            </li>
          )
        })}
      </ul>
      <Footer />
    </div>
  );
};

export default Booking;
