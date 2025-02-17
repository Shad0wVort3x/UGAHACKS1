import React, { useState, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion as m } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Use named import
import './Register.css';

function Register(props) {
  const { setUser, setIsLoggedIn } = useContext(UserContext); // ✅ Use setUser instead of setUserData
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/register', formData);
      const userData = response.data;

      // ✅ Correctly update UserContext
      setUser(userData.user);
      setIsLoggedIn(true);
      localStorage.setItem('userData', JSON.stringify(userData));

      navigate('/'); // Redirect to homepage
      props.setTrigger(false); // Close the registration modal
    } catch (err) {
      console.error('Registration failed: ', err);
      alert(err.response?.data?.msg || 'Registration failed. Please try again.');
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
        </form>
        {props.children}
      </div>
    </m.div>
  ) : "";
}

export default Register;