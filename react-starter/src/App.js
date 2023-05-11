import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import Home from '../src/components/Home/Home.js';
import Login from './components/login/login.js';
import Register from '../src/components/Register/Register.js';
import PropertyDetails from './components/PropertyDetails/PropertyDetails';
import AddOffer from './components/AddOffer/AddOffer';
import Booking from './components/booking/booking';
import { differedDate } from './utils';
import { filterReducer, FilterContext, FilterDispatchContext } from './lib/filterContext';

import {
  createBrowserRouter,
  RouterProvider,
  //Route,
  //Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "offert/:propertyId",
    element: <PropertyDetails />,
  },
  {
    path: "/add-offer",
    element: <AddOffer />,
  },
  {
    path: "/booking",
    element: <Booking />,
  },
]);

function App() {
  const [token, setToken] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [filterParams, filterParamsDispatch] = useReducer(filterReducer, {
    checkIn: differedDate(1).toDateString(),
    checkOut: differedDate(8).toDateString(),
    guests: 1,
    query: ''
  })

  function handlerError(error) {
    console.log('app.js', error);
    setLoginError(error);
  }

  function handleToken(token) {
    localStorage.setItem('token', token);
    console.log('Token saved : %s', token);
    setToken(token)
  }
  
  function handleRegister() {
    setRegistering(!registering);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || token === '') {
      setToken(null);
      return;
    }

    setToken(token);
  }, []);

  if(!token) {
    return (
      <>
        {loginError && (<h1 style={{color: 'red'}}>{loginError}</h1>)}
        {!registering ? (
          <Login
            setToken={handleToken}
            onError={handlerError}
            onRegister={handleRegister}
          />
        ) : (
          <Register
            onRegister={handleRegister}
            onError={handlerError}
            onBackToLogin={handleRegister}
          />
        )}
      </>
    )
  }

  return (
    <>
      <FilterContext.Provider value={filterParams}>
        <FilterDispatchContext.Provider value={filterParamsDispatch}>
          <RouterProvider router={router} />
        </FilterDispatchContext.Provider>
      </FilterContext.Provider>
    </>
  );
}

export default App;
