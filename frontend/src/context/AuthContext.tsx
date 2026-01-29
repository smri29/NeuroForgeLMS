// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// Define User Shape
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void; // Login now just updates state
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token on load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    // 1. Save to Storage
    localStorage.setItem('user', JSON.stringify(userData));
    // 2. Update State
    setUser(userData);
    // ❌ REMOVED: navigate('/dashboard'); 
    // We now let the Component decide where to redirect!
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Optional: You can keep window.location.href here if you want a hard reset
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};