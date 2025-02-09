import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            setUser(parsedData.user);
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};
