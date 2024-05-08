/**
 * File: Header.js
 * 
 * The Header component is a React functional component that displays a header with navigation links.
 * 
 * It uses the useState and useEffect hooks to manage state and side effects. It also uses the 
 * useContext hook to access the AuthContext.
 * 
 * The component consists of the following child components and functions:
 * - A map function that generates a list of navigation links.
 * 
 * The component returns a JSX element that displays a header with a logo, a welcome message, and a 
 * navigation bar. The navigation bar includes links to the home page, the book appointment page, 
 * the barbers page, the about us page, and the user's profile page if the user is logged in.
 * 
 * The component does not take any props and does not have any side effects or dependencies other 
 * than the initial data fetch.
 * 
 * The component is exported as a default export from the module.
 */

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Logo/TheModernCut.webp';
import { AuthContext } from './auth/auth';

function Header() {
  const { isLoggedIn } = useContext(AuthContext);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isLoggedIn);
  const barberId = localStorage.getItem('barberId');

  useEffect(() => {
    setIsUserLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Welcome to the ModernCut barbershop</h1>
      </div>
      <nav>
        <ul className="navigation">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/book-appointment">Book Appointment</Link></li>
          <li><Link to="/barbers">Barbers</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
          {isUserLoggedIn && <li><Link to={`/barber/${barberId}`}>My Profile</Link></li>}
        </ul>
      </nav>
    </header>
  );
}

export default Header;