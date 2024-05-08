/**
 * File: BookAppointment.js
 * 
 * The BookAppointment component is a React functional component that provides a form for booking an 
 * appointment.
 * 
 * It uses the useState and useEffect hooks to manage state and side effects.
 * 
 * The component fetches the list of barbers and their services from an API and displays them in 
 * 
 * select elements. It also fetches the available timeslots for the selected barber and date.
 * 
 * The component consists of several child components and functions:
 * - formatServiceType: A helper function that formats a service type string for display.
 * - fetchTimeSlots: A function that fetches the available timeslots for the selected barber and date.
 * - bookAppointment: A function that sends a request to the API to book an appointment.
 * 
 * The component returns a JSX element that displays a form for booking an appointment. The form 
 * includes fields for selecting a barber, a service, a date, a time, and entering the client's 
 * name and phone number. It also includes a button for submitting the form.
 * 
 * The component does not take any props and does not have any side effects or dependencies other 
 * than the initial data fetch.
 * 
 * The component is exported as a default export from the module.
 */

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [barberServices, setBarberServices] = useState([]);

  const formatServiceType = (serviceType) => {
    return serviceType
      .split('_') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
      .join(' '); 
  };

  const fetchTimeSlots = async () => {
    if (selectedBarber) {
      try {
        const response = await fetch(`http://localhost:8080/api/barbers/${selectedBarber}/workingschedules`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const timeslotsForSelectedDate = data.filter(schedule => new Date(schedule.date).toDateString() === selectedDate.toDateString()).map(schedule => schedule.timeSlots).flat();
        setTimeslots(timeslotsForSelectedDate);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    }
  };

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/barbers'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBarbers(data); 
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };
  
    fetchBarbers();
  }, []);

  useEffect(() => {
    fetchTimeSlots();
  }, [selectedDate, selectedBarber]);

  useEffect(() => {
    const fetchBarberServices = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/barbers/${selectedBarber}/barberservs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBarberServices(data);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    if (selectedBarber) {
      fetchBarberServices();
    }
  }, [selectedBarber]);

  const bookAppointment = async () => {
    const service = barberServices.find(service => service.id === selectedService);
    const serviceDuration = service ? service.duration : 0;

    const appointment = {
      barberId: selectedBarber,
      service: selectedService,
      date: selectedDate.toISOString(),
      time: selectedTime,
      clientName: clientName,
      clientPhone: clientPhone
    };

    const timeslotDuration = 30;
    const numberOfTimeslots = Math.ceil(serviceDuration / timeslotDuration);

    const index = timeslots.indexOf(selectedTime);
    if (index !== -1) {
      timeslots.splice(index, numberOfTimeslots);
    }

    try {
      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchTimeSlots();
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  return (
    <div className="booking-container">
      <h2>Book Your Appointment</h2>
      <div className="input-group">
        <label htmlFor="barber">Choose a barber:</label>
        <select
          id="barber"
          value={selectedBarber}
          onChange={(e) => setSelectedBarber(e.target.value)}
        >
          <option value="">Any specialist</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="service">Choose a service:</label>
        <select
          id="service"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">Select a service</option>
          {barberServices.map((service) => (
            <option key={service.id} value={service.service}>
              {formatServiceType(service.service)}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM d, yyyy"
          minDate={new Date()}
          className="date-picker"
        />
      </div>
      <div className="input-group">
        <label htmlFor="time">Choose a time:</label>
        <select
          id="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          {timeslots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="clientName">Name:</label>
        <input
          id="clientName"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div className="input-group">
        <label htmlFor="clientPhone">Phone:</label>
        <input
          id="clientPhone"
          type="text"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
      <div className="input-group button-group">
        <button onClick={bookAppointment}>Book Appointment</button>
      </div>
    </div>
  );
}

export default BookAppointment;