import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import LoginPage from './LoginPage';
import RegisterOrgPage from './RegisterOrgPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterOrgPage />} />
      </Routes>
    </Router>
  );
};

export default App;
