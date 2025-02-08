import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('/api/tokenIsValid', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((isValid) => {
                    if (isValid) {
                        fetch('/api/user', {
                            headers: {
                                'Authorization': token,
                            },
                        })
                            .then((res) => res.json())
                            .then((data) => setUser(data));
                    }
                });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;