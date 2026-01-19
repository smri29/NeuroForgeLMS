// src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Define the shape of a User
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
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('neuroforge_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('neuroforge_token', userData.token);
    localStorage.setItem('neuroforge_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('neuroforge_token');
    localStorage.removeItem('neuroforge_user');
    setUser(null);
    window.location.href = '/login'; // Hard redirect to clear state
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};