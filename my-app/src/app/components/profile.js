import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    password: '',
    profilePicture: ''
  });

  useEffect(() => {
    // Fetch user data
    axios.get('/api/users/profile') // Corrected endpoint
      .then(response => {
        setUser({
          ...response.data,
          password: '' // Do not populate password field with fetched data
        });
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value || '' // Ensure value is never undefined
    }));
  };

  const handleFileChange = (e) => {
    setUser(prevState => ({
      ...prevState,
      profilePicture: e.target.files[0] || '' // Ensure value is never undefined
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('password', user.password);
    formData.append('profilePicture', user.profilePicture);

    axios.put(`/api/users/update/${user.id}`, formData) // Corrected endpoint
      .then(response => {
        console.log('User data updated successfully');
      })
      .catch(error => {
        console.error('There was an error updating the user data!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <label>
        Name:
        <input type="text" name="name" value={user.name} onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={user.password} onChange={handleChange} />
      </label>
      <label>
        Profile Picture:
        <input type="file" name="profilePicture" onChange={handleFileChange} />
      </label>
      <button type="submit">Confirm</button>
    </form>
  );
};

export default Profile;
