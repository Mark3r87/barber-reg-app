/**
 * File: BarberProfile.js
 * 
 * The BarberProfile component is a React functional component that displays the profile of a barber.
 * 
 * It uses the useState and useEffect hooks to manage state and side effects. It also uses the 
 * useParams and useNavigate hooks from react-router-dom for routing.
 * 
 * The component fetches the barber's details and services from an API and displays them. It also 
 * provides functionality to add, update, and remove services.
 * 
 * The component consists of several child components and functions:
 * - ServiceComponent: A child component that displays a service and provides functionality to update 
 * and remove the service.
 * - formatServiceType: A helper function that formats a service type string for display.
 * - handleMyScheduleClick: A function that navigates to the barber's schedule page.
 * - handleEditProfileClick: A function that navigates to the barber's profile edit page.
 * - handleDurationChange: A function that updates the duration of a service in the state.
 * - handleSaveClick: A function that saves the updated duration of a service to the API.
 * - updateServiceDuration: A function that sends a request to the API to update the duration of a 
 * service.
 * - handleRemoveClick: A function that removes a service by sending a request to the API.
 * - handleAddClick: A function that adds a new service by sending a request to the API.
 * 
 * The component returns a JSX element that displays the barber's details, services, and buttons to 
 * navigate to other pages or modify the services.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BarberProfile.css';

const API_BASE_URL = 'http://localhost:8080/api';

const barberId = localStorage.getItem('barberId');

const api = axios.create({
  baseURL: API_BASE_URL,
});

const TypeOfService = {
    HAIRCUT: 'HAIRCUT',
    BEARD: 'BEARD',
    HAIRCUT_AND_BEARD: 'HAIRCUT_AND_BEARD',
    HAIRCOLOR: 'HAIRCOLOR',
    BEARD_AND_HAIRCUT_AND_HAIRCOLOR: 'BEARD_AND_HAIRCUT_AND_HAIRCOLOR',
};

const formatServiceType = (serviceType) => {
    return serviceType
      .split('_') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' '); 
  };

  const ServiceComponent = ({ service, handleDurationChange, handleSaveClick, handleRemoveClick }) => (
    <div className="service-component">
      <div className="service-details">
        <h3>{formatServiceType(service.service)}</h3>
        <label>
          Default Duration:
          <select value={service.defaultDurationInMinutes} onChange={(e) => handleDurationChange(service.id, e)}>
            {[15, 30, 45, 60, 75, 90, 105, 120, 145, 160, 175, 190].map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </label>
        <div className="service-buttons">
          <button onClick={() => handleSaveClick(service.id)}>Save</button>
          <button onClick={() => handleRemoveClick(service.id)}>Remove Service</button>
        </div>
      </div>
    </div>
  );

 

  

const BarberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const barberId = Number(id);
  const [barber, setBarber] = useState(null);
  const [services, setServices] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedServiceType, setSelectedServiceType] = useState(TypeOfService.HAIRCUT);
  const [newServiceDuration, setNewServiceDuration] = useState(30);

  const handleMyScheduleClick = () => {
    navigate(`/my-schedule/${barberId}`, { state: { barberId, token } }); 
  };
  const handleEditProfileClick = () => {
    navigate(`/edit-barber-profile/${barberId}`, { state: { barberId, token } });
  };


  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.get(`/barbers/${barberId}`)
      .then(response => {
        setBarber(response.data);
      })
      .catch(handleError);

    api.get(`/barbers/${barberId}/barberservs`)
      .then(response => {
        setServices(response.data);
      })
      .catch(handleError);
  }, [barberId, token]);

  const handleError = (error) => {
    if (error.response.status === 403) {
      const refreshToken = localStorage.getItem('refreshToken');
      api.post('/refresh', { token: refreshToken })
        .then(response => {
          setToken(response.data.newToken);
          localStorage.setItem('token', response.data.newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.newToken}`;
          return api.get(`/barbers/${barberId}`);
        })
        .then(response => {
          setBarber(response.data);
        })
        .catch(console.error);
    }
  };

  const handleDurationChange = (id, event) => {
    const newDuration = Number(event.target.value);
    let newServices = [...services];
    const index = newServices.findIndex(service => service.id === id);
    newServices[index] = {...newServices[index], defaultDurationInMinutes: newDuration};
    setServices(newServices);
  };

  const handleSaveClick = (id) => {
    const service = services.find(service => service.id === id);
    updateServiceDuration(id, service.defaultDurationInMinutes);
  };

  const updateServiceDuration = (id, newDuration) => {
    const serviceToUpdate = services.find(service => service.id === id);
    api.put(`/barbers/${barberId}/barberservs/${id}`, { 
      service: serviceToUpdate.service,
      defaultDurationInMinutes: newDuration 
    })
    .then(response => {
      let newServices = [...services];
      const index = newServices.findIndex(service => service.id === id);
      newServices[index] = response.data;
      setServices(newServices);
    })
    .catch(handleError);
  };
  

  const handleRemoveClick = (id) => {
    api.delete(`/barbers/${barberId}/barberservs/${id}`)
      .then(() => {
        setServices(services.filter(service => service.id !== id));
      })
      .catch(handleError);
  };

  const handleAddClick = () => {
    const existingService = services.find(service => service.service === selectedServiceType);
    if (existingService) {
      alert('This service already exists.');
      return;
    }



    const newService = {
      service: selectedServiceType,
      defaultDurationInMinutes: newServiceDuration,
    };
    api.post(`/barbers/${barberId}/barberservs`, newService)
      .then(response => {
        setServices([...services, response.data]);
      })
      .catch(handleError);
  };

  if (barber === null) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
    <h1>{barber.name}</h1>
      <p>Location: {barber.location}</p>
      <p>Contact Information: {barber.contactInformation}</p>
      <p>Rating: {barber.rating}</p>
      <div className="barber-buttons">
        <button onClick={handleEditProfileClick}>Edit Profile</button>
        <button onClick={handleMyScheduleClick}>My Schedule</button>
      </div>
      <h2>Services</h2>
      {services.length > 0 ? (
        services.map(service => (
          <ServiceComponent 
            key={service.id} 
            service={service} 
            handleDurationChange={handleDurationChange} 
            handleSaveClick={handleSaveClick} 
            handleRemoveClick={handleRemoveClick}
          />
        ))
      ) : (
        <h3>No services found</h3>
        
      )}
      
      <h2 className="add-service-header">Add new service</h2>
      <div className="add-service-section">
        <select value={selectedServiceType} onChange={(e) => setSelectedServiceType(e.target.value)}>
          {Object.values(TypeOfService).map((serviceType) => (
            <option key={serviceType} value={serviceType}>{formatServiceType(serviceType)}</option>
          ))}
        </select>
        <select value={newServiceDuration} onChange={(e) => setNewServiceDuration(Number(e.target.value))}>
          {[15, 30, 45, 60, 75, 90, 105, 120, 145, 160, 175, 190].map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        <button onClick={handleAddClick}>Add Service</button>
      </div>
    </div>
  );
};

export default BarberProfile;
