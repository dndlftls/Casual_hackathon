"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. 사용자 정보 타입을 정의합니다.
interface User {
  id: number;
  email: string;
  nickname: string;
}

// 2. Context에 저장될 데이터 타입을 수정합니다.
interface AuthContextType {
  user: User | null; // 이제 user는 객체이거나 null입니다.
  token: string | null;
  login: (userData: User, token: string) => void;
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

  // 3. login 함수가 사용자 객체와 토큰을 받도록 수정합니다.
  const login = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    // 실제 앱에서는 토큰을 localStorage나 httpOnly 쿠키에 저장합니다.
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = { user, token, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};