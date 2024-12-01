import { useState } from 'react';
//import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  const [volunteerDropdown, setVolunteerDropdown] = useState(false);
  const [organizationDropdown, setOrganizationDropdown] = useState(false);

  const toggleVolunteerDropdown = () => {
    setVolunteerDropdown(!volunteerDropdown);
    setOrganizationDropdown(false); // Close other dropdown
  };

  const toggleOrganizationDropdown = () => {
    setOrganizationDropdown(!organizationDropdown);
    setVolunteerDropdown(false); // Close other dropdown
  };

  return (
    <div className="home-container">
      <h1>Welcome to Volunteer Hub</h1>
      <div className="options-container">
        <div className="option">
          <h2 onClick={toggleVolunteerDropdown}>Volunteer</h2>
          {volunteerDropdown && (
            <div className="dropdown-menu">
              <a href="/volunteer/login">Login</a>
              <a href="/volunteer/register">Register</a>
            </div>
          )}
        </div>
        <div className="option">
          <h2 onClick={toggleOrganizationDropdown}>Organization</h2>
          {organizationDropdown && (
            <div className="dropdown-menu">
              <a href="/organization/login">Login</a>
              <a href="/organization/register">Register</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
