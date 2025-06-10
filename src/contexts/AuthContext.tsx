
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to retrieve user from localStorage", error);
        setUser(null);
      }
      // Adding a small delay to ensure any redirects or UI updates dependent on isLoading have a chance to process
      await new Promise(resolve => setTimeout(resolve, 50)); 
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);


  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    if (email === 'user@example.com' && pass === 'password') {
      const dummyUser: User = { id: '1', name: 'Test User', email: 'user@example.com' };
      setUser(dummyUser);
      localStorage.setItem('authUser', JSON.stringify(dummyUser));
      router.push('/dashboard');
    } else {
      alert('Invalid credentials. Use user@example.com and password.');
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('authUser');
    setIsLoading(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
