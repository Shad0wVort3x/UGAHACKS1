import React, { useState, useContext, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion as m } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Login.css'; 

function Login(props) {
  const { userData, setUser, setIsLoggedIn } = useContext(UserContext); // Use setUser instead of setUserData
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    console.log("storedUserData:", storedUserData);
    try {
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        console.log("parsed userData:", userData);
        setUser(userData); // Use setUser instead of setUserData
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
    }
  }, [setUser, setIsLoggedIn]); // Use setUser instead of setUserData

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', formData); // Ensure the endpoint is correct
      const userData = response.data;
      setUser({
        token: response.data.token,
        user: response.data.user,
      }); // Use setUser instead of setUserData
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsLoggedIn(true);
      navigate('/');
      props.setTrigger(false);
    } catch (err) {
      console.error('Login failed: ', err);
      alert(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  return (props.trigger) ? (
    <m.div className="login"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="login-inner">
        <button className="popup-close nav-close" onClick={() => props.setTrigger(false)}>
          <FaTimes />
        </button>
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <label>
            <input
              type="email"
              id="email"
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
              id="password"
              name="password"
              placeholder="PASSWORD"
              className="placeholder"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <div className="login-horizontal-line"></div>
          <button
            type="submit"
            id="submit-login-button"
            className="submit-button"
          >
            Login
          </button>
        </form>
        {props.children}
      </div>
    </m.div>
  ) : "";
}

export default Login;