import React, { useState } from "react";
import "./login.css";
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic, then navigate
        navigate('/personal'); // Or navigate to OrganizationPage based on user role(TODO: implement this logic)
      };
    
      return (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Login</button>
          </form>
        </div>
      );
    };
    
    export default LoginPage;
    
    
    
    
    
    
    
    