'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load current user on mount if token exists
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get<User>('/auth/me');
        setUser(res.data);
      } catch (err) {
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
      console.error('Guest login failed:', error);
      throw error;
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
      console.error('Demo login failed:', error);
      throw error;
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
