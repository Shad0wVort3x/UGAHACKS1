import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import './Login.css';

function Login(props) {
  const { setUser, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:3001/api/login', formData);
      const userData = response.data;

      // ✅ Update UserContext on successful login
      setUser(userData.user);
      setIsLoggedIn(true);
      localStorage.setItem('userData', JSON.stringify(userData));

      navigate('/'); // Redirect to homepage
      props.setTrigger(false); // Close login modal
    } catch (err) {
      console.error('Login failed: ', err);
      alert(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  return (props.trigger) ? (
    <div className="login">
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  ) : null;
}

export default Login;
