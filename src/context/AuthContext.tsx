import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, OtpDeliveryResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: { email: string; phone?: string; password?: string; name: string; role: UserRole; universityOrCompany?: string; targetRole?: string }) => Promise<void>;
  requestOtp: (data: {
    identifier?: string;
    email?: string;
    phone?: string;
    purpose?: 'login' | 'register';
    name?: string;
    password?: string;
    role?: UserRole;
    universityOrCompany?: string;
    targetRole?: string;
  }) => Promise<OtpDeliveryResponse & { identifier: string; userName?: string }>;
  verifyOtp: (data: { identifier: string; code: string; purpose?: 'login' | 'register' }) => Promise<{ user: User; token: string }>;
  loginWithCredentialsAndOtp: (identifier: string, password: string) => Promise<OtpDeliveryResponse & { identifier: string; userName?: string }>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('skillbridge_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token invalid
        localStorage.removeItem('skillbridge_token');
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to fetch user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      // Auto demo login initially for seamless instant experience
      demoLogin('student').catch(() => setIsLoading(false));
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('skillbridge_token', data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithCredentialsAndOtp = async (identifier: string, password: string) => {
    const res = await fetch('/api/auth/login-with-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }
    return data;
  };

  const requestOtp = async (payload: {
    identifier?: string;
    email?: string;
    phone?: string;
    purpose?: 'login' | 'register';
    name?: string;
    password?: string;
    role?: UserRole;
    universityOrCompany?: string;
    targetRole?: string;
  }) => {
    const res = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to dispatch verification code');
    }
    return data;
  };

  const verifyOtp = async (payload: { identifier: string; code: string; purpose?: 'login' | 'register' }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('skillbridge_token', data.token);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    email: string;
    phone?: string;
    password?: string;
    name: string;
    role: UserRole;
    universityOrCompany?: string;
    targetRole?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('skillbridge_token', data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Demo login failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('skillbridge_token', data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('skillbridge_token');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!token) return;
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }
    setUser(data.user);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        requestOtp,
        verifyOtp,
        loginWithCredentialsAndOtp,
        demoLogin,
        logout,
        updateProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
