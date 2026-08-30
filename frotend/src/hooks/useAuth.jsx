import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext({ user: null, loading: true, login: async () => {}, register: async () => {}, logout: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api.me();
      if (data.authenticated) {
        setUser({ username: data.username, email: data.email });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (username, password) => {
    const data = await api.login(username, password);
    if (data.authenticated) setUser({ username: data.username, email: data.email || '' });
    return data;
  }, []);

  const register = useCallback(async (form) => {
    const data = await api.register(form);
    if (data.authenticated) setUser({ username: data.username, email: '' });
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
