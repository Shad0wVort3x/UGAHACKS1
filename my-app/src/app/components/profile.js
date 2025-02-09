import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    password: '',
    profilePicture: '',
  });

  const [initialData, setInitialData] = useState({}); // Store initial user data
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    const userData = localStorage.getItem('userData');
  
    if (!userData) {
      setError('No user token found, please log in again.');
      return;
    }
  
    const parsedUserData = JSON.parse(userData);
    const token = parsedUserData?.token;
    const userId = parsedUserData?.user?._id || parsedUserData?.user?.id;
  
    if (!token || !userId) {
      setError('Invalid user data, please log in again.');
      return;
    }
  
    console.log("🔹 Using Token:", token);
    console.log("🔹 Fetching Profile for UserID:", userId);
  
    axios.get(`http://localhost:3001/api/users/profile/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      console.log("✅ Profile Data:", response.data);
      setUser(response.data);
      setInitialData(response.data);
    })
    .catch(error => {
      console.error("❌ Error loading user data:", error.response || error);
      if (error.response?.status === 401) {
        console.warn("🚨 Unauthorized - Possible Invalid or Expired Token");
      }
      setError(error.response?.data?.message || 'Failed to load profile.');
    });
  }, []);
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser(prevState => ({
      ...prevState,
      profilePicture: file || prevState.profilePicture
    }));
  };

  const validateRequiredFields = () => {
    if (!user.name) {
      setError('Name is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRequiredFields()) return;

    try {
      const userData = localStorage.getItem('userData');
      const token = userData ? JSON.parse(userData)?.token : null;
      if (!token) throw new Error('No authentication token found.');

      const userId = user.id;
      if (!userId) throw new Error('User ID is missing.');

      const formData = new FormData();
      formData.append('name', user.name);
      
      if (user.password) {
        formData.append('password', user.password);
      }
      
      if (user.profilePicture && user.profilePicture instanceof File) {
        formData.append('profilePicture', user.profilePicture);
      }

      console.log("🔹 Using Token for Update:", token);
      console.log("🔹 Updating Profile for UserID:", userId);

      const response = await axios.put(`http://localhost:3001/api/users/profile/${userId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Profile updated successfully');
      setError(null);
      setUser(response.data); // Update user data with the response
      localStorage.setItem('userData', JSON.stringify({ token, user: response.data })); // Update localStorage
    } catch (error) {
      console.error('Failed to update profile:', error.response || error);
      setError(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleCancel = () => {
    setUser(initialData); // Reset the form data to initial values
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <label>
        Name:
        <input type="text" name="name" value={user.name} onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" placeholder="Enter new password" onChange={handleChange} />
      </label>
      <label>
        Profile Picture:
        <input type="file" name="profilePicture" onChange={handleFileChange} />
      </label>
      <button type="submit">Confirm</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default Profile;
