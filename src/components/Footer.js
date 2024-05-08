/**
 * File: Footer.js
 * 
 * The Footer component is a React functional component that displays a footer with login/logout 
 * functionality and social media links.
 * 
 * It uses the useState and useEffect hooks to manage state and side effects. It also uses the 
 * useContext hook to access the AuthContext.
 * 
 * The component consists of the following child components and functions:
 * - handleLogout: A function that logs out the user and navigates to the home page.
 * 
 * The component returns a JSX element that displays a footer with a login/logout button, a register
 *  new barber link, and social media icons. The displayed elements depend on whether the user is 
 * logged in.
 * 
 * The component does not take any props and does not have any side effects or dependencies other
 *  than the initial data fetch.
 * 
 * The component is exported as a default export from the module.
 */

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth/auth';

function Footer() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    setIsUserLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <footer className="footer">
      <div className="login-social-media">
        {isUserLoggedIn ? (
          <>
            <button onClick={handleLogout}>Log Out</button>
            <a href="/register-barber">Register New Barber</a>
          </>
        ) : (
          <a href="/LoginPage">Log In</a>
        )}
        <div className="social-media-icons">
          <a href="#" className="fa fa-facebook"></a>
          <a href="#" className="fa fa-instagram"></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;