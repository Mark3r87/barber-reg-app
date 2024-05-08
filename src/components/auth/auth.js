/**
 * File: auth.js
 * 
 * This file exports two main elements: AuthContext and AuthProvider.
 * 
 * - AuthContext: A React context that can be used by components to access and modify the 
 * authentication state.
 * 
 * - AuthProvider: A React component that provides the authentication state to its children. It uses 
 * the useState and useEffect hooks to manage the state and respond to changes in the local storage.
 * 
 * The AuthProvider component manages the following states:
 * - isLoggedIn: A boolean indicating whether the user is logged in. It is initially set to the 
 * presence of a 'token' item in the local storage.
 * - role: The role of the user. It is initially set to the 'role' item in the local storage.
 * 
 * The AuthProvider component also provides the following methods:
 * - handleLogin(token, barberId, userRole): A method that logs the user in. It updates the local 
 * storage and the state variables.
 * - logout(): A method that logs the user out. It clears the local storage and the state variables.
 * 
 * The AuthProvider component listens for changes in the local storage to keep the state in sync when 
 * multiple tabs or windows are open.
 */
import React, { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role')); 

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setRole(localStorage.getItem('role')); 
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); 

  const handleLogin = (token, barberId, userRole) => { 
    localStorage.setItem('token', token);
    localStorage.setItem('barberId', barberId);
    localStorage.setItem('role', userRole); 
    setIsLoggedIn(true); 
    setRole(userRole); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('barberId');
    localStorage.removeItem('role'); 
    setIsLoggedIn(false);
    setRole(null); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, handleLogin, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};

