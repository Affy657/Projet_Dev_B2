import React, { useState, useRef } from 'react';
import axios from 'axios';

import './Register.css';

export default function Register({ onRegister, onError, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);

  function usernameHandler(evt) {
    if (loading) return;
    setUsername(evt.target.value);
    onError(null);
  }

  function passwordHandler(evt) {
    if (loading) return;
    setPassword(evt.target.value);
    onError(null);
  }

  function handlerSubmit(evt) {
    evt.preventDefault();
    if (loading) return;
    setLoading(true);

    axios
      .post('http://localhost:3001/auth/register', {
        username,
        password,
      })
      .then((response) => {
        onRegister();
      })
      .catch((e) => {
        console.error(e);
        console.log(e.response.status, e.response.data);
        if (e.response.data.error === 'Missing username') {
          onError("Veuillez entrer votre nom d'utilisateur");
        }

        if (e.response.data.error === 'Missing password') {
          onError('Veuillez entrer votre mot de passe');
        }

        if (e.response.data.error === 'Users already exist') {
          onError("L'utilisateur existe déjà");
        }

        setLoading(false);
        setPassword('');
        if (!passwordRef.current) return;
        passwordRef.current.value = '';
      });
  }
    return (
      <div className="register-wrapper">
        <form className="register-form">
          <h1>Create Account</h1>
          <label className="register-label">
            <p>Username</p>
            <input className="register-input" type="text" onChange={usernameHandler} />
          </label>
          <label className="register-label">
            <p>Password</p>
            <input className="register-input" ref={passwordRef} type="password" onChange={passwordHandler} />
          </label>
          <div>
            <button className="register-button" type="submit" onClick={handlerSubmit} onSubmit={handlerSubmit}>
              Register
            </button>
            {loading && (
              <p>Inscription en cours...</p>
            )}
          </div>
          <label>
            <div>
              <button className="login-button" type="button" onClick={onBackToLogin}>
                Login
              </button>
            </div>
          </label>
        </form>
      </div>
    );
  }
