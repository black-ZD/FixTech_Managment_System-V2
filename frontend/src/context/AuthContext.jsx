import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { authAPI } from '../services/modules';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token    = localStorage.getItem('ft_access');
    const saved    = localStorage.getItem('ft_user');
    if (token && saved) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await authAPI.login({ username, password });
    localStorage.setItem('ft_access',  data.accessToken);
    localStorage.setItem('ft_refresh', data.refreshToken);
    localStorage.setItem('ft_user',    JSON.stringify(data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const refresh = localStorage.getItem('ft_refresh');
    try { await authAPI.logout({ refreshToken: refresh }); } catch {}
    localStorage.clear();
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
