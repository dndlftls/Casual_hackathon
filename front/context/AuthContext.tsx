"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  nickname: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', tokenData);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    const checkUserStatus = async () => {
      // 서버 렌더링을 피하기 위해 window 객체 확인
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        // 이미 user 정보가 있으면, 불필요한 API 호출을 막습니다. (최적화)
        if (user) {
          setLoading(false);
          return;
        }

        try {
          const response = await axios.get(`/api/auth/verify`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (response.data.valid) {
            login(response.data.user, storedToken);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    
    checkUserStatus();
  }, [login, logout, user]); // user를 의존성 배열에 추가합니다.

  const value = { user, token, login, logout };

  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};