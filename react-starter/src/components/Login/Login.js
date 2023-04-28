import React, {useState, useRef} from 'react';
import axios from 'axios';

import './Login.css';

export default function Login({ setToken, onError, onRegister }) {
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

    axios.post('http://localhost:3001/auth/login', {
      username,
      password
    }).then((response) => {
      localStorage.setItem('user', JSON.stringify(response.data));
      setToken(response.data.user.token);
    }).catch((e) => {
      console.error(e);
      console.log(e.response.status, e.response.data);
      if (e.response.data.error == 'Missing username') {
        onError("Veuillez entrée votre nom d'utilisateur");
      }

      if (e.response.data.error == 'Missing password') {
        onError("Veuillez entrée votre mot de passe");
      }
 
      if (e.response.data.error == 'Bad password or username') {
        onError("L'utilisateur n'existe pas");
      }

      setLoading(false);
      setPassword('');
      if (!passwordRef.current) return;
      passwordRef.current.value = '';
    })
  }

  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form>
        <label>
          <p>Username</p>
          <input
            type="text"
            onChange={usernameHandler}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            ref={passwordRef}
            type="password"
            onChange={passwordHandler}
          />
        </label>
        <div>
          <button
            type="submit"
            onClick={handlerSubmit}
            onSubmit={handlerSubmit}
          >login</button>
          {loading && (
            <p>Connexion en cours...</p>
          )}
          
        </div>
          <label>
            <div>
              <button 
                type="button" 
                onClick={onRegister}
              >Register</button>
          </div>
        </label>
      </form>
    </div>
  )
}