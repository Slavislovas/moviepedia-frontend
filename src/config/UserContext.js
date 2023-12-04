import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import apiUrls from './ApiConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Use local storage instead of cookies
  const initialAccessToken = localStorage.getItem('accessToken') || undefined;
  const initialRefreshToken = localStorage.getItem('refreshToken') || undefined;

  const [user, setUser] = useState({
    accessToken: initialAccessToken,
    refreshToken: initialRefreshToken,
    userId: initialAccessToken ? jwtDecode(initialAccessToken).sub : null,
    userRole: initialAccessToken ? jwtDecode(initialAccessToken).role : null,
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
        const newAccessToken = localStorage.getItem('accessToken') || undefined;
        const newRefreshToken = localStorage.getItem('refreshToken') || undefined;
  
        if (newAccessToken) {
          console.log("new access token");
          const decodedToken = parseToken(newAccessToken);
          setUser({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            userId: decodedToken.userId,
            userRole: decodedToken.userRole,
          });
        } else {
          // Handle the case when accessToken is removed or becomes invalid
          setUser({
            accessToken: undefined,
            refreshToken: undefined,
            userId: null,
            userRole: null,
          });
        }
    };
  
    // Attach the custom event listener
    window.addEventListener('storage', handleStorageChange);
  
    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (accessToken, refreshToken) => {
    // Use local storage instead of cookies
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    window.dispatchEvent(new Event('storage'));

    const decodedToken = parseToken(accessToken);
    setUser({
      accessToken,
      refreshToken,
      userId: decodedToken.userId,
      userRole: decodedToken.userRole,
    });
  };

  const logout = async (callDeleteApi=true) => {
    if (callDeleteApi){
      try {
        const logoutUrl = apiUrls.logout;
        console.log({refreshToken: localStorage.getItem('refreshToken')});
        await axios.delete(logoutUrl, { data: {refreshToken: localStorage.getItem('refreshToken')} });
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        // Remove items from local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
  
        // Reset user state
        setUser({
          accessToken: undefined,
          refreshToken: undefined,
          userId: null,
          userRole: null,
        });
        window.location.href = "/login";
    }
    } else{
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Reset user state
      setUser({
        accessToken: undefined,
        refreshToken: undefined,
        userId: null,
        userRole: null,
      });
    }
    window.dispatchEvent(new Event('storage'));
  };

  const parseToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return {
        userId: decodedToken.sub,
        userRole: decodedToken.role,
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return {};
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);