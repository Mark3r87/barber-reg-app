/**
 * File: LoginPage.js
 * 
 * The LoginPage component is a React functional component that provides a form for user login.
 * 
 * It uses the useState and useContext hooks to manage state and the AuthContext. It also uses the 
 * useNavigate hook from react-router-dom for routing.
 * 
 * The component consists of the following child components and functions:
 * - handleLogin: A function that sends a request to the API to authenticate the user. If the 
 * authentication is successful, it updates the local storage and the AuthContext, and navigates to 
 * the barber's profile page.
 * 
 * The component returns a JSX element that displays a form for user login. The form includes fields 
 * for entering the username and password, and a button for submitting the form.
 * 
 * The component does not take any props and does not have any side effects or dependencies other 
 * than the initial data fetch.
 * 
 * The component is exported as a default export from the module.
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth/auth'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { handleLogin: updateLoginState } = useContext(AuthContext); 

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const token = data.token;
      const barberId = data.barberId;
      localStorage.setItem('token', token);
      localStorage.setItem('barberId', barberId);

      updateLoginState(token, barberId); 

      navigate(`/barber/${barberId}`);
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <div>
      Login
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;