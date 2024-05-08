/**
 * File: MySchedule.js
 * 
 * The MySchedule component is a React functional component that displays a barber's schedule.
 * 
 * It uses the useState and useEffect hooks to manage state and side effects.
 * 
 * The component fetches the barber's working schedules from an API and displays them in a calendar.
 *  It also provides functionality to add and remove working schedules.
 * 
 * The component consists of several child components and functions:
 * - handleSelect: A function that adds or removes a working schedule when a timeslot is selected in 
 * the calendar.
 * - slotPropGetter: A function that sets the background color of the timeslots in the calendar based
 *  on whether they are part of a working schedule.
 * - Event: A child component that is used to customize the appearance of the events in the calendar.
 * 
 * The component returns a JSX element that displays a calendar with the barber's working schedules 
 * and inputs to set the start and end times of the calendar view.
 * 
 * The component does not take any props and does not have any side effects or dependencies other 
 * than the initial data fetch.
 * 
 * The component is exported as a default export from the module.
 */

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './MySchedule.css';

const localizer = momentLocalizer(moment);

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const MySchedule = ({ location }) => {
    const state = location ? location.state : {};
    const token = state.token || localStorage.getItem('token');
    const barberId = state.barberId || localStorage.getItem('barberId');
  const [events, setEvents] = useState([]);
  const [minTime, setMinTime] = useState(moment('8:00am', 'h:mma').toDate());
  const [maxTime, setMaxTime] = useState(moment('6:00pm', 'h:mma').toDate());

  useEffect(() => {
    api.get(`/barbers/${barberId}/workingschedules`)
    .then(response => {
      const fetchedEvents = response.data.map(schedule => ({
        ...schedule,
        start: moment(`${schedule.date} ${schedule.timeSlots[0]}`, 'YYYY-MM-DD HH:mm').toDate(),
        end: moment(`${schedule.date} ${schedule.timeSlots[schedule.timeSlots.length - 1]}`, 'YYYY-MM-DD HH:mm').add(30, 'minutes').toDate(),
        title: '',
        resourceId: 1
      }));
  
      setEvents(fetchedEvents);
    })
    .catch(error => {
      console.error('Error fetching schedules:', error);
    });
  }, []); 
  
  const handleSelect = ({ start, end }) => {
    const timeSlots = [];
    for (let time = moment(start); time.isBefore(moment(end)); time.add(30, 'minutes')) {
      timeSlots.push(time.format('HH:mm'));
    }
  

    const newSchedule = {
      date: moment(start).format('YYYY-MM-DD'), 
      timeSlots: timeSlots,
      barberId: barberId
    };
  
api.get(`/barbers/${barberId}/workingschedules`)
.then(response => {
  const selectedSchedule = response.data.find(schedule =>
    moment(schedule.date).isSame(moment(start), 'day') &&
    timeSlots.every(slot => schedule.timeSlots.includes(slot)) &&
    schedule.timeSlots.every(slot => timeSlots.includes(slot)) 
  );
  

  if (selectedSchedule) {
    api.delete(`/barbers/${barberId}/workingschedules/${selectedSchedule.id}`)
    .then(response => {
      console.log('Schedule deleted successfully');
      setEvents(events => events.filter(event => event.id !== selectedSchedule.id));
    })
    .catch(error => {
      console.error('Error deleting schedule:', error);
      alert('Error deleting schedule. Please try again.');
    });
  } else {
    api.post(`/barbers/${barberId}/workingschedules`, newSchedule, {
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Schedule saved successfully');
      setEvents([...events, { ...newSchedule, id: response.data.id, start, end, title: '', resourceId: 1 }]);
    })
    .catch(error => {
      console.error('Error saving schedule:', error);
    });
  }
})
.catch(error => {
  console.error('Error fetching schedules:', error);
});
  };
  const slotPropGetter = date => {
    const index = events.findIndex(event =>
      +event.start === +date && event.resourceId === 1
    );

    if (index !== -1) {
      return {
        style: {
          backgroundColor: 'darkgray',
        },
      };
    } else {
      return {
        style: {
          backgroundColor: 'white',
        },
      };
    }
  };

  const Event = () => null;

  return (
    <div style={{ height: 500 }}>
      <div>
        <label>Start Time:</label>
        <input type="time" value={moment(minTime).format('HH:mm')} onChange={e => setMinTime(moment(e.target.value, 'HH:mm').toDate())} />
        <label>End Time:</label>
        <input type="time" value={moment(maxTime).format('HH:mm')} onChange={e => setMaxTime(moment(e.target.value, 'HH:mm').toDate())} />
      </div>
      <Calendar
        className="my-schedule"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        min={minTime}
        max={maxTime}
        step={30}
        timeslots={1}
        selectable
        onSelectSlot={handleSelect}
        components={{
          event: Event,
        }}
        resources={[{ resourceId: 1 }]}
        resourceIdAccessor="resourceId"
        slotPropGetter={slotPropGetter}
      />
    </div>
  );
};

export default MySchedule;