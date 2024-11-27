import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./register.css";

const RegisterVolunteer = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
    Name: '',
    Birthday: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/volunteer/register', formData);
      navigate('/volunteer/login'); // Redirect to login page after successful registration
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div>
      <h1>Register as a Volunteer</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Birthday:</label>
          <input
            type="date"
            name="Birthday"
            value={formData.Birthday}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="registerButton" type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterVolunteer;
