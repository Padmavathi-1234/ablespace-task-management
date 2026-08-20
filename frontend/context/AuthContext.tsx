'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { api, setAuthToken, clearAuthToken } from '@/lib/api';
import { User, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  guestLogin: (name?: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_GUEST_USER: User = {
  id: 'guest-1',
  fullName: 'Guest User',
  email: 'guest@ablespace.io',
  username: 'guest',
  title: 'Guest Member',
  avatarUrl: null,
  isGuest: true,
  theme: 'light',
  colorMode: 'blue',
};

const MOCK_DEMO_USER: User = {
  id: 'demo-1',
  fullName: 'Dexter Morgan',
  email: 'dexter@ablespace.io',
  username: 'dexter',
  title: 'Lead Architect',
  avatarUrl: null,
  isGuest: false,
  theme: 'light',
  colorMode: 'blue',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load current user on mount if token exists
  useEffect(() => {
    async function loadUser() {
      const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (token === 'mock-guest-token') {
        setUser(MOCK_GUEST_USER);
        setLoading(false);
        return;
      }

      if (token === 'mock-demo-token') {
        setUser(MOCK_DEMO_USER);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get<User>('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.warn('Failed to load user from backend /auth/me:', err);
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const guestLogin = async (name?: string) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/guest-login', { name });
      setAuthToken(res.data.accessToken);
      setUser(res.data.user);
    } catch (error) {
      console.warn('Backend API connection failed. Using fallback guest session:', error);
      toast.error('Failed to connect to backend server. Make sure NestJS backend is running on port 3001.');
      const fallbackUser: User = name
        ? { ...MOCK_GUEST_USER, fullName: name }
        : MOCK_GUEST_USER;
      setAuthToken('mock-guest-token');
      setUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/demo-login');
      setAuthToken(res.data.accessToken);
      setUser(res.data.user);
    } catch (error) {
      console.warn('Backend API connection failed. Using fallback demo session:', error);
      toast.error('Failed to connect to backend server. Make sure NestJS backend is running on port 3001.');
      setAuthToken('mock-demo-token');
      setUser(MOCK_DEMO_USER);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, guestLogin, demoLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
