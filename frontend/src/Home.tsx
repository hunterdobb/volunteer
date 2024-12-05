import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  const [volunteerDropdown, setVolunteerDropdown] = useState(false);
  const [organizationDropdown, setOrganizationDropdown] = useState(false);

  useEffect(() => {
    document.title = 'Volunteer Hub';
  }, []);

  const toggleVolunteerDropdown = () => {
    console.log("Volunteer dropdown clicked!");
    setVolunteerDropdown(!volunteerDropdown);
    setOrganizationDropdown(false); // Close other dropdown
  };

  const toggleOrganizationDropdown = () => {
    console.log("Organization dropdown clicked!");
    setOrganizationDropdown(!organizationDropdown);
    setVolunteerDropdown(false); // Close other dropdown
  };

  return (
    <div className="home-container">
      <h1>Welcome to Volunteer Hub</h1>
      
      {/* Debugging state 
      <div>
        <p>Volunteer Dropdown: {volunteerDropdown.toString()}</p>
        <p>Organization Dropdown: {organizationDropdown.toString()}</p>
      </div> */}
      
      <div className="options-container">
        <div className="option">
          <h2 onClick={toggleVolunteerDropdown}>Volunteer</h2>
          {volunteerDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%', // Position directly below the parent
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#c7c3ca',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                padding: '10px',
                zIndex: 1000,
                width: '150px', // Fixed width for consistency
              }}
            >
              <Link to="/volunteer/login" style={{ display: 'block', padding: '8px 12px', color: '#0b0b0b', textDecoration: 'none' }}>Login</Link>
              <Link to="/volunteer/register" style={{ display: 'block', padding: '8px 12px', color: '#0b0b0b', textDecoration: 'none' }}>Register</Link>
            </div>
          )}
        </div>
        <div className="option">
          <h2 onClick={toggleOrganizationDropdown}>Organization</h2>
          {organizationDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%', // Position directly below the parent
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#c7c3ca',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                padding: '10px',
                zIndex: 1000,
                width: '150px', // Fixed width for consistency
              }}
            >
              <Link to="/organization/login" style={{ display: 'block', padding: '8px 12px', color: '#0b0b0b', textDecoration: 'none' }}>Login</Link>
              <Link to="/organization/register" style={{ display: 'block', padding: '8px 12px', color: '#0b0b0b', textDecoration: 'none' }}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
