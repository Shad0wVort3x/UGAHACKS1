import React, { useState, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion as m } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Register.css';

function Register(props) {
  const { setUser, setIsLoggedIn } = useContext(UserContext); // ✅ Use setUser instead of setUserData
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/register', formData);

      // Show alert after successful registration
      alert('Registration successful! Please log in to access your account.');

      // Redirect to login page after successful registration
      navigate('/login');
      props.setTrigger(false); // Close the registration modal
    } catch (err) {
      console.error('Registration failed: ', err);
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (props.trigger) ? (
    <m.div className="register"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="register-inner">
        <button className="popup-close nav-close" onClick={() => props.setTrigger(false)}>
          <FaTimes />
        </button>
        <h3>Register</h3>
        <form onSubmit={handleRegister}>
          <label>
            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              className="placeholder"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              className="placeholder"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            <input
              type="text"
              name="name"
              placeholder="NAME"
              className="placeholder"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <div className="register-horizontal-line"></div>
          <button
            type="submit"
            id="submit-register-button"
            className="submit-button"
          >
            Register
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        {props.children}
      </div>
    </m.div>
  ) : "";
}

export default Register;
