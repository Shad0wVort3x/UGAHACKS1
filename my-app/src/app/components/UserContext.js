import { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      setUserData(prev => ({
        ...prev,
        token: token,
      }));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;