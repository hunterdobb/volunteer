import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./register.css";

const RegisterOrgPage = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
    Name: '',
    Type: '',
    Category: 0,
    Desc: '',
    Website: '',
    Location: '',
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
      await axios.post('http://localhost:5000/api/organization/register', formData);// TODO: figure this out
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div>
      <h1>Register as an Organization</h1>
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
          <label>Organization Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <select name="Type" value={formData.Type} onChange={handleChange}>
            <option value="Profit">Profit</option>
            <option value="Non-Profit">Non-Profit</option>
          </select>
        </div>
        <div>
          <label>Category:</label>
          <input
            type="number"
            name="Category"
            value={formData.Category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="Desc"
            value={formData.Desc}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Website:</label>
          <input
            type="text"
            name="Website"
            value={formData.Website}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="Location"
            value={formData.Location}
            onChange={handleChange}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="registerButton" type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterOrgPage;
