// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS file we created

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const loginData = {
      username: formData.get('username'),
      password: formData.get('password')
    };

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', loginData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setSuccess('Login successful!');
        setError('');
        navigate('/sessions');
      }
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.message || err.message));
      setSuccess('');
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <div className="loginHeader">
          <h1 className="loginTitle">Welcome Back</h1>
          <p className="loginSubtitle">Please sign in to continue</p>
        </div>

        {error && <div className="errorAlert">{error}</div>}
        {success && <div className="successAlert">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="formField">
            <input
              className="inputField"
              required
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className="formField">
            <input
              className="inputField"
              required
              name="password"
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="submitButton"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;