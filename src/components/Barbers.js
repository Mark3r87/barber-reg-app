/**
 * File: Barbers.js
 * 
 * The Barbers component is a React functional component that displays a list of barbers.
 * 
 * It uses the useState and useEffect hooks to manage state and side effects.
 * 
 * The component fetches the list of barbers from an API and displays them. Each barber's details are 
 * fetched individually.
 * 
 * The component consists of the following child components and functions:
 * - A map function that generates a list of div elements, each representing a barber.
 * 
 * The component returns a JSX element that displays a header and a list of barbers. Each barber is 
 * displayed with their image, name, description, location, specialties, contact information, rating, 
 * and services offered.
 * 
 * The component does not take any props and does not have any side effects or dependencies other 
 * than the initial data fetch.
 * 
 * The component is exported as a default export from the module.
 */

import React, { useEffect, useState } from 'react';
import './Barbers.css';

function Barbers() {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/barbers')
      .then(response => response.json())
      .then(data => {
        const promises = data.map(barber =>
          fetch(`http://localhost:8080/api/barbers/${barber.id}`)
            .then(response => response.json())
            .then(description => ({ ...barber, description: description.description }))
        );
        Promise.all(promises).then(setBarbers);
      });
  }, []);

  return (
    <div>
      <h1 className="barbers-header">Meet Our Barbers</h1>
      <div className="barbers-container">
      {barbers.map((barber, index) => (
        <div key={index} className="barber-card">
          <img src={barber.image} alt={barber.name} className="barber-image" />
          <h2>{barber.name}</h2>
          <p>{barber.description}</p>
          <p>{barber.location}</p>
          <p>Specialties: {barber.specialties.join(', ')}</p>
          <p>Contact: {barber.contactInformation}</p>
          <p>Rating: {barber.rating}</p>
          <p>Services Offered: {barber.servicesOffered.join(', ')}</p>
        </div>
       ))}
       </div>
     </div>
   );
 }

export default Barbers;