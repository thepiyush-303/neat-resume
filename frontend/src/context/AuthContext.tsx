import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  login: () => {},
  logout: () => {},
  loading: true,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data } = await axios.post(
              `${api.defaults.baseURL || 'http://localhost:5000'}/api/auth/refresh`,
              {},
              { withCredentials: true }
            );
            setAccessToken(data.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            setUser(null);
            setAccessToken(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await api.post('/api/auth/refresh');
        setAccessToken(data.accessToken);
        const userRes = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        setUser(userRes.data);
      } catch (e) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading, isAuthenticated: !!accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
