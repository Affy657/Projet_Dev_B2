import { useState, useEffect, useRef, useContext } from 'react';
import './SearchBar.css';
import axios from 'axios';
import useSWR from 'swr';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { differedDate } from '../../../utils.js';
import { FilterContext, FilterDispatchContext } from '../../../lib/filterContext';
import 'react-day-picker/dist/style.css';

const SearchBar = () => {
  const filter = useContext(FilterContext);
  const filterDispatch = useContext(FilterDispatchContext);
  const [searchTerm, setSearchTerm] = useState(filter.query);
  const [checkIn, setCheckIn] = useState(new Date(filter.checkIn));
  const [checkOut, setCheckOut] = useState(new Date(filter.checkOut));
  const [guests, setGuests] = useState(filter.guests);
  const [locationSuggestionIsOpen, setLocationSuggestionIsOpen] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');
  const checkInRef = useRef();
  const locationInputRef = useRef();

  useEffect(() => {
    const timeOutId = setTimeout(() => setDisplayMessage(searchTerm), 500);
    return () => clearTimeout(timeOutId);
  }, [searchTerm]);

  const handleChangeLocation = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const handleOpenLocationSuggestion = (e) => {
    e.preventDefault();
    setLocationSuggestionIsOpen(true);
    locationInputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filterNew = { checkIn, checkOut, guests };

    if (searchTerm !== '') {
      filterNew.query = searchTerm;
    }

    filterDispatch(filterNew)
  };

  const onSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setLocationSuggestionIsOpen(false);
    checkInRef.current.focus();
  };

  const increaseGuests = () => {
    setGuests(guests + 1);
  };
  
  const decreaseGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };
  
  return (
    <>
      <form className="bar" onSubmit={handleSubmit}>
        <div className="location">
          <p>Destination</p>
          <input
            ref={locationInputRef}
            type="text"
            value={searchTerm}
            placeholder="Rechercher une destination"
            onChange={handleChangeLocation}
            onClick={handleOpenLocationSuggestion}
          />
          
          {locationSuggestionIsOpen && displayMessage !== '' && (
            <Suggestion query={displayMessage} onSuggestionClick={onSuggestionClick} />
          )}
        </div>
        <div className="check-in">
          <p>Arrivée</p>
          <input
            type="text"
            placeholder="Quand ?"
            ref={checkInRef}
            value={checkIn.toLocaleDateString('fr-fr', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className="check-out">
          <p>Départ</p>
          <input
            type="text"
            placeholder="Quand ?"
            value={checkOut.toLocaleDateString('fr-fr', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div className="guests">
          <p>Voyageurs</p>
          <div className="guests-controls">
            <button
              type="button"
              className="guests-decrease"
              onClick={decreaseGuests}
              disabled={guests <= 1}
            >
              -
            </button>
            <span className="guests-count">{guests}</span>
            <button
              type="button"
              className="guests-decrease"
              onClick={increaseGuests}
            >
              +
            </button>
          </div>
          <button
            type="submit"
            className="material-symbols-outlined search-button"
            value="Submit"
           >
            search
          </button>
        </div>  
      </form>
    </>
  );
};

const fetcher = ([url, query, limit]) => axios.get(url, { params: { query, limit }}).then((res) => res.data);

const Suggestion = function Suggestion({ query, onSuggestionClick }) {
  const { data, error, isLoading } = useSWR(
    ['http://localhost:3001/offert/suggestion', query, 5],
    fetcher
  );

  if (query === '') {
    return null;
  }

  if (isLoading) {
    return <div className="suggestion-dropdown">
      <h4>Loading...</h4>;
      </div>
  }

  if (error) {
    return <div className="suggestion-dropdown"> 
     <h3>Error : {isLoading}</h3>;
    </div>
  }

  console.log(data, error, isLoading);

  return (
    <>
      {data.length > 0 && (
        <div className="suggestion-dropdown">
          {data.map((suggestion) => (
            <div key={suggestion} onClick={() => onSuggestionClick(suggestion)}>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </>
  );
  
};

export default SearchBar;
