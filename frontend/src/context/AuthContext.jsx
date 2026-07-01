import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { clearAuth, getStoredToken, getStoredUser, persistAuth } from '@/lib/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [initializing, setInitializing] = useState(true);
  const [authModal, setAuthModal] = useState(null);

  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    let active = true;

    async function bootstrapAuth() {
      const storedToken = getStoredToken();

      if (!storedToken) {
        if (active) {
          setUser(null);
          setToken(null);
          setInitializing(false);
        }
        return;
      }

      try {
        const { data } = await api.get('/api/auth/profile');
        if (active) {
          setUser(data.user);
          setToken(storedToken);
          persistAuth(storedToken, data.user);
        }
      } catch {
        if (active) {
          clearAuth();
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) {
          setInitializing(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      active = false;
    };
  }, []);

  const handleAuthSuccess = useCallback((nextToken, nextUser) => {
    persistAuth(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
    setAuthModal(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });

    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    handleAuthSuccess(data.token, data.user);
    return data;
  }, [handleAuthSuccess]);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);

    if (!data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    handleAuthSuccess(data.token, data.user);
    return data;
  }, [handleAuthSuccess]);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const openAuthModal = useCallback((mode) => {
    setAuthModal(mode);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated,
      authModal,
      login,
      register,
      logout,
      openAuthModal,
      closeAuthModal,
    }),
    [
      user,
      token,
      initializing,
      isAuthenticated,
      authModal,
      login,
      register,
      logout,
      openAuthModal,
      closeAuthModal,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
