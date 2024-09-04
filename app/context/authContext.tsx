'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Define a type for the user with all the information
interface User {
  id: string;
  username: string;
  email: string;
  telegramId: string;
  role: string;
}

// Define a type for the decoded token
interface DecodedToken {
  id: string;
  username: string;
  email: string;
  telegramId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize user state from localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUser({
          id: decodedToken.id,
          username: decodedToken.username,
          email: decodedToken.email,
          telegramId: decodedToken.telegramId,
          role: decodedToken.role
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        // Optionally clear invalid token
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
