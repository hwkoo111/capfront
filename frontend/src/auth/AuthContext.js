// AuthContext.jsx (또는 .js)

import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  const checkLoginStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/status', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
        setNickname(data.nickname);
      } else {
        setIsLoggedIn(false);
        setNickname('');
      }
    } catch {
      setIsLoggedIn(false);
      setNickname('');
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, nickname, setNickname, checkLoginStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
