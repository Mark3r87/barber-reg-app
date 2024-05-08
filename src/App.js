/**
 * File: App.js
 * 
 * The App component is a React functional component that serves as the root component of the 
 * application.
 * 
 * It uses the BrowserRouter from react-router-dom to enable routing in the application.
 * 
 * The component consists of the following child components:
 * - AuthProvider: A context provider that provides authentication-related functionalities to its 
 * children.
 * - Router: A component that enables routing in the application.
 * - Header: A component that displays the header of the application.
 * - Routes: A component that defines the routes of the application.
 * - Footer: A component that displays the footer of the application.
 * 
 * The Routes component has the following routes:
 * - "/": The main page of the application.
 * - "/book-appointment": The page for booking an appointment.
 * - "/barbers": The page that displays a list of barbers.
 * - "/about-us": The page that displays information about the company.
 * - "/loginPage": The login page.
 * - "/barber/:id": The profile page of a barber.
 * - "/my-schedule/:barberId": The schedule page of a barber.
 * - "/edit-barber-profile/:barberId": The page for editing a barber's profile.
 * - "/register-barber": The page for registering a new barber.
 * 
 * The component returns a JSX element that displays the header, the content determined by the current route, and the footer.
 * 
 * The component does not take any props and does not have any side effects or dependencies.
 * 
 * The component is exported as a default export from the module.
 */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './Logo/TheModernCut.webp';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import BookAppointment from './components/BookAppointment';
import Barbers from './components/Barbers';
import AboutUs from './components/AboutUs';
import Main from './components/Main';
import LoginPage from './components/LoginPage'; 
import BarberProfile from './components/BarberProfile'; 
import MySchedule from './components/MySchedule';
import { AuthProvider } from './components/auth/auth'; 
import EditBarberProfile from './components/EditBarberProfile';
import RegisterBarber from './components/RegisterBarber';

function App() {
  return (
    <AuthProvider>  
      <Router>
        <div className="container">
          <Header />
          <div className="body-content">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/barbers" element={<Barbers />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/loginPage" element={<LoginPage />} /> 
              <Route path="/barber/:id" element={<BarberProfile />} /> 
              <Route path="/my-schedule/:barberId" element={<MySchedule />} />
              <Route path="/edit-barber-profile/:barberId" element={<EditBarberProfile />} /> 
              <Route path="/register-barber" element={<RegisterBarber />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

