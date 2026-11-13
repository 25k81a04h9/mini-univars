import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount, BearAvatarType } from '../types';
import { safeParseResponse } from '../utils/api';

interface AuthContextType {
  currentUser: UserAccount | null;
  token: string | null;
  isLoading: boolean;
  register: (data: {
    name: string;
    nickname?: string;
    email: string;
    password: string;
    avatar: BearAvatarType;
    avatarUrl?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('olu_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem('olu_auth_token');
    if (!savedToken) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      const parsed = await safeParseResponse<{ user: UserAccount }>(res);

      if (parsed.ok && parsed.data?.user) {
        setCurrentUser(parsed.data.user);
        setToken(savedToken);
      } else if (res.status === 401) {
        localStorage.removeItem('olu_auth_token');
        setToken(null);
        setCurrentUser(null);
      } else {
        console.warn('Session refresh notice:', parsed.error);
      }
    } catch (err) {
      console.warn('Session refresh notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const register = async (data: {
    name: string;
    nickname?: string;
    email: string;
    password: string;
    avatar: BearAvatarType;
    avatarUrl?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const parsed = await safeParseResponse<{ token: string; user: UserAccount }>(res);
      if (!parsed.ok || !parsed.data?.token) {
        return { success: false, error: parsed.error || 'Registration failed' };
      }

      localStorage.setItem('olu_auth_token', parsed.data.token);
      setToken(parsed.data.token);
      setCurrentUser(parsed.data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const parsed = await safeParseResponse<{ token: string; user: UserAccount }>(res);
      if (!parsed.ok || !parsed.data?.token) {
        return { success: false, error: parsed.error || 'Login failed' };
      }

      localStorage.setItem('olu_auth_token', parsed.data.token);
      setToken(parsed.data.token);
      setCurrentUser(parsed.data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('olu_auth_token');
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isLoading,
        register,
        login,
        logout,
        refreshUser,
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
