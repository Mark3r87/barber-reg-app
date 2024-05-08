/**
 * File: RegisterBarber.js
 * 
 * The RegisterBarber component is a React functional component that provides a form for registering 
 * a new barber.
 * 
 * It uses the useState hook to manage the form data state.
 * 
 * The component consists of the following child components and functions:
 * - handleChange: A function that updates the form data state when an input field changes.
 * - handleSubmit: A function that sends a request to the API to register a new barber when the form 
 * is submitted.
 * 
 * The component returns a JSX element that displays a form for registering a new barber. The form 
 * includes fields for entering the first name, last name, email, password, and role of the new barber. It also includes a button for submitting the form.
 * 
 * The component does not take any props and does not have any side effects or dependencies other 
 * than the initial data fetch.
 * 
 * The component is exported as a default export from the module.
 */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

function RegisterBarber() {
  const location = useLocation();
  const state = location ? location.state : {};
  const token = state ? (state.token || localStorage.getItem('token')) : localStorage.getItem('token');

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="firstName" onChange={handleChange} placeholder="First Name" required />
      <input type="text" name="lastName" onChange={handleChange} placeholder="Last Name" required />
      <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
      <select name="role" onChange={handleChange} required>
        <option value="">Select a role</option>
        <option value="ADMIN">Admin</option>
        <option value="BARBER">Barber</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterBarber;
