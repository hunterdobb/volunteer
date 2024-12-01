import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import LoginOrg from './LoginOrg';
import RegisterOrg from './RegisterOrg';
import LoginVolunteer from './LoginVolunteer';
import RegisterVolunteer from './RegisterVolunteer';
import OrganizationHome from './pages/OrganizationHome';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/organization/login" element={<LoginOrg />} />
        <Route path="/organization/register" element={<RegisterOrg />} />
        <Route path="/volunteer/login" element={<LoginVolunteer />} />
        <Route path="/volunteer/register" element={<RegisterVolunteer />} />
        <Route path="/organization" element={<OrganizationHome />} />   
      </Routes>
    </Router>
  );
};

export default App;
