// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [customerId, setCustomerId] = useState(Cookies.get('customerId'));

    useEffect(() => {
        const handleCookieChange = () => {
            setCustomerId(Cookies.get('customerId'));
        };

        window.addEventListener('cookiechange', handleCookieChange);
        return () => {
            window.removeEventListener('cookiechange', handleCookieChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ customerId, setCustomerId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
