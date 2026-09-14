import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';

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
  isInitialized: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  login: () => {},
  logout: () => {},
  loading: true,
  isInitialized: false,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

// Re-export api for backwards compatibility with existing page imports
export { api } from '../lib/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use a ref so interceptors always see the latest token without
  // being ejected and re-registered on every token change.
  const tokenRef = useRef<string | null>(null);
  tokenRef.current = accessToken;

  // Register interceptors once only (no accessToken in deps array)
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (tokenRef.current) {
          config.headers['Authorization'] = `Bearer ${tokenRef.current}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If the original request was already a refresh request, don't intercept it.
        if (originalRequest.url === '/api/auth/refresh') {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data } = await api.post('/api/auth/refresh');
            setAccessToken(data.accessToken);
            tokenRef.current = data.accessToken;
            originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch {
            setUser(null);
            setAccessToken(null);
            tokenRef.current = null;
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []); // ← empty deps: register once, use ref for current token

  const initAttempted = useRef(false);

  // Init: try silent refresh on app load
  useEffect(() => {
    if (initAttempted.current) return;
    initAttempted.current = true;

    const initializeAuth = async () => {
      try {
        const { data } = await api.post('/api/auth/refresh');
        setAccessToken(data.accessToken);
        tokenRef.current = data.accessToken;
        const userRes = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        setUser(userRes.data);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };
    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setAccessToken(token);
    tokenRef.current = token;
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Ignore logout API errors — clear state regardless
    }
    setAccessToken(null);
    tokenRef.current = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        loading,
        isInitialized,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
