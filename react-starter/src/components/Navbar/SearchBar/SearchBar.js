import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { differedDate } from '../../../utils';
import { DayPicker } from 'react-day-picker';
import { fr } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import './SearchBar.css';
import { FilterContext, FilterDispatchContext } from '../../../lib/filterContext';

const SearchBar = () => {
  const filter = useContext(FilterContext);
  const filterDispatch = useContext(FilterDispatchContext);
  const [searchTerm, setSearchTerm] = useState(filter.query);
  const [checkIn, setCheckIn] = useState(new Date(filter.checkIn));
  const [checkOut, setCheckOut] = useState(new Date(filter.checkOut));
  const [guests, setGuests] = useState(filter.guests);
  const [locationSuggestionIsOpen, setLocationSuggestionIsOpen] = useState(false);
  const [rangeDateIsOpen, setRangeDateIsOpen] = useState(false);
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
    setRangeDateIsOpen(false);
    locationInputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filterNew = { checkIn, checkOut, guests, query: searchTerm };

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

  const handleMouseLeaveForm = () => {
    setRangeDateIsOpen(false);
    setLocationSuggestionIsOpen(false);
  }

  const handleClickDate = () => {
    setRangeDateIsOpen(true);
    setLocationSuggestionIsOpen(false);
  }
  
const handleDateChange = (range) => {
  setCheckIn(range?.from || differedDate(1));
  setCheckOut((range?.to ?? range?.from) ?? differedDate(8));
}

  return (
    <>
      <form className="bar" onSubmit={handleSubmit} onMouseLeave={handleMouseLeaveForm}>
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
            onClick={handleClickDate}
          />
          {rangeDateIsOpen && (
            <RangeDatePicker checkIn={checkIn} checkOut={checkOut} onDateChange={handleDateChange} />
          )}
        </div>
        <div className="check-out">
          <p>Départ</p>
          <input
            type="text"
            placeholder="Quand ?"
            value={checkOut.toLocaleDateString('fr-fr', { year: 'numeric', month: 'numeric', day: 'numeric' })}
            onChange={(e) => setCheckOut(e.target.value)}
            onClick={handleClickDate}
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

function Suggestion({ query, onSuggestionClick }) {
  const { data, error, isLoading } = useSWR(
    ['http://localhost:3001/offert/suggestion', query, 5],
    fetcher
  );

  if (query === '') {
    return null;
  }

  if (isLoading) {
    return <div className="suggestion-dropdown">
      <h4>Loading...</h4>
      </div>
  }

  if (error) {
    return <div className="suggestion-dropdown"> 
     <h3>Error : {isLoading}</h3>;
    </div>
  }

  return (
    <>
      {data.length > 0 && (
        <div className="suggestion-dropdown">
          {data.map((suggestion, i) => (
            <>
              {i !== 0 && <hr />}
              <div key={suggestion} onClick={() => onSuggestionClick(suggestion)}>
                {suggestion}
              </div>
            </>
          ))}
        </div>
      )}
    </>
  );
  
};

function RangeDatePicker({ checkIn, checkOut, onDateChange }) {
  const range = {
    from: checkIn,
    to: checkOut
  };
    
  return (
    <div className="check-in-dropdown">
      <DayPicker
        locale={fr}
        mode="range"
        defaultMonth={checkIn}
        selected={range}
        onSelect={onDateChange}
        numberOfMonths={2}
        showOutsideDays
        fromDate={differedDate(1)}
      />  
    </div>
  )
}

export default SearchBar;
