/**
 * File: EditBarberProfile.js
 * 
 * The EditBarberProfile component is a React functional component that provides a form for 
 * editing a barber's profile and password.
 * 
 * It uses the useState and useEffect hooks to manage state and side effects. It also uses the 
 * useLocation hook from react-router-dom for accessing the state passed from the previous route.
 * 
 * The component fetches the barber's details from an API and displays them in the form. It also 
 * provides functionality to update the barber's details and password.
 * 
 * The component consists of several child components and functions:
 * - handleInputChange: A function that updates the barber's details in the state.
 * - handlePasswordChange: A function that updates the password data in the state.
 * - handleProfileSubmit: A function that sends a request to the API to update the barber's details.
 * - handlePasswordSubmit: A function that sends a request to the API to update the barber's password.
 * 
 * The component returns a JSX element that displays a form for editing the barber's profile and 
 * password. The form includes fields for the barber's name, location, and contact information, 
 * as well as fields for the current password, new password, and password confirmation. It also 
 * includes buttons for submitting the forms.
 * 
 * The component does not take any props and does not have any side effects or dependencies other 
 * than the initial data fetch.
 * 
 * The component is exported as a default export from the module.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const EditBarberProfile = () => {
  const location = useLocation();
  const state = location ? location.state : {};
  const token = state.token || localStorage.getItem('token');
  const barberId = state.barberId || localStorage.getItem('barberId');

  const [barberData, setBarberData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchBarberData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/barbers/${barberId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBarberData(response.data);
      } catch (error) {
        console.error('Error fetching barber data:', error);
      }
    };
    fetchBarberData();
  }, [barberId, token]);

  const handleInputChange = (event) => {
    setBarberData({
      ...barberData,
      [event.target.name]: event.target.value
    });
  };

  const handlePasswordChange = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value
    });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/barbers/${barberId}`, barberData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/user/${barberId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleProfileSubmit}>
        <input
          type="text"
          name="name"
          value={barberData.name || ''}
          onChange={handleInputChange}
          placeholder={barberData.name ? barberData.name : "New Name"}
        />
        <input
          type="text"
          name="location"
          value={barberData.location || ''}
          onChange={handleInputChange}
          placeholder={barberData.location ? barberData.location : "New Location"}
        />
        <input
          type="text"
          name="contactInformation"
          value={barberData.contactInformation || ''}
          onChange={handleInputChange}
          placeholder={barberData.contactInformation ? barberData.contactInformation : "New Contact Information"}
        />
        <button type="submit">Update Profile</button>
      </form>
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
          placeholder="Current Password"
        />
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          placeholder="New Password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          placeholder="Confirm New Password"
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default EditBarberProfile;
