import React, { useState } from "react";
import "./login.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginVolunteer: React.FC = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/api/volunteer/login', { Email, Password });
        const { role } = response.data; 
        const token = response.data.token;
        localStorage.setItem('token', token);
        const email = response.data.email;
        localStorage.setItem('email', email);
        
        if (role === 'volunteer') {
          navigate('/volunteer/login');
        } else {
          navigate('/volunteer');
        }
      } catch (err) {
        setError('Invalid email or password.');
      }
    };
    

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button className="loginButton" type="submit">Login</button>
        </form>
      </div>
    );
  };
  
  export default LoginVolunteer;
      