import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from '../src/components/Dashboard/Dashboard';
import Preferences from '../src/components/Preferences/Preferences';
import Home from '../src/components/Home/Home.js';
import Login from './components/login/login.js';
import Register from '../src/components/Register/Register.js';
import PropertyDetails from './components/PropertyDetails/PropertyDetails';
import AddOffer from './components/AddOffer/AddOffer';

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
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "preferences",
    element: <Preferences />,
  },
  {
    path: "property/:propertyId",
    element: <PropertyDetails />,
  },
  {
    path: "/add-offer",
    element: <AddOffer />,
  },
]);

function App() {
  const [token, setToken] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [registering, setRegistering] = useState(false);

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

    if (!token || token == '') {
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
    <RouterProvider router={router} />
  );
}

export default App;
