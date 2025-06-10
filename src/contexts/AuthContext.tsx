
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { UserForClient } from '@/lib/auth'; 

interface AuthContextType {
  user: UserForClient | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserForClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
          // Middleware handles redirection for protected routes
        }
      } catch (error) {
        console.error("Failed to check auth status", error);
        setUser(null);
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, [pathname]);


  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setFormError(''); // Assuming setFormError is available if called from a form context
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        
        // Check if daily scrum has been submitted for today
        try {
          const scrumCheckResponse = await fetch('/api/daily-scrum/me/today');
          if (scrumCheckResponse.ok) {
            const scrumData = await scrumCheckResponse.json();
            if (scrumData.log) { // Log exists
              router.push('/dashboard');
            } else { // No log for today
              router.push('/daily-scrum');
            }
          } else { // Error checking scrum, default to dashboard
            router.push('/dashboard');
          }
        } catch (scrumError) {
          console.error("Error checking daily scrum status:", scrumError);
          router.push('/dashboard'); // Default to dashboard on error
        }

      } else {
        setUser(null); // Clear user on failed login
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setUser(null);
      console.error('Login API call failed', error);
      setIsLoading(false);
      throw error; 
    }
    // setIsLoading(false); // Already handled in the happy/error paths or by navigation
  };
  
  // Placeholder for form error if this context were part of a form
  const [formError, setFormError] = useState(''); 


  const logout = async () => {
    setIsLoading(true);
    try {
      // Optional: Call a server endpoint to invalidate the session/token if necessary
      // await fetch('/api/auth/logout', { method: 'POST' }); 
    } catch (error) {
      console.error("Logout API call failed (if any)", error);
    }
    setUser(null);
    // Cookies are httpOnly, server should clear them.
    // Client-side, we just navigate. Middleware will deny access to protected routes.
    router.push('/'); 
    // A small delay might be needed if there are race conditions with state updates and navigation
    await new Promise(resolve => setTimeout(resolve, 50));
    setIsLoading(false);
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
