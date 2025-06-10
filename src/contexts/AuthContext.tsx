
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { UserForClient } from '@/lib/auth'; // Import the new user type

// Interface for the user object from the backend (excluding passwordHash)
// This is now defined in @/lib/auth.ts as UserForClient
// interface User extends UserForClient {}


interface AuthContextType {
  user: UserForClient | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>; // Keep signature for now, will adapt
  logout: () => Promise<void>;
  // Potentially add register function here too
  // register: (name: string, email: string, pass: string, role?: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserForClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    // This effect will run on initial mount to check if a user session exists
    // (e.g., by calling the /api/auth/me endpoint)
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace localStorage with a call to your /api/auth/me endpoint
        // const response = await fetch('/api/auth/me');
        // if (response.ok) {
        //   const data = await response.json();
        //   setUser(data.user);
        // } else {
        //   setUser(null);
        //   // If on a protected route and not authenticated, redirect (middleware should also handle this)
        //   // but client-side check can be useful for immediate UI updates or specific logic.
        //   const protectedRoutes = ['/dashboard', '/profile', '/settings', /* add other protected routes */];
        //   if (protectedRoutes.includes(pathname)) {
        //      router.replace('/');
        //   }
        // }
        const storedUser = localStorage.getItem('authUser'); // Current dummy implementation
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to check auth status", error);
        setUser(null);
      }
      await new Promise(resolve => setTimeout(resolve, 50));
      setIsLoading(false);
    };
    checkAuthStatus();
  }, [pathname, router]); // Note: removed `router` from dependencies as it might cause loops in some Next.js versions if pathname changes frequently trigger router instance changes. Re-add if specific routing logic within this effect needs it.


  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // TODO: Replace this with a call to your /api/auth/login endpoint
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password: pass }),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     setUser(data.user);
    //     // router.push('/dashboard'); // Middleware should handle redirect on successful login
    //   } else {
    //     // Handle login error (e.g., display data.error)
    //     throw new Error(data.error || 'Login failed');
    //   }
    // } catch (error) {
    //   console.error('Login API call failed', error);
    //   // Propagate or handle error for UI display
    //   throw error; // Re-throw to be caught by the form handler
    // }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
    if (email === 'user@example.com' && pass === 'password') { // Dummy check
      const dummyUser: UserForClient = { id: '1', name: 'Test User', email: 'user@example.com', role: 'ADMIN', createdAt: new Date(), updatedAt: new Date() };
      setUser(dummyUser);
      localStorage.setItem('authUser', JSON.stringify(dummyUser)); // Persist dummy user
      
      // Check if daily scrum has been submitted
      const currentDate = new Date().toISOString().split('T')[0];
      const scrumSubmittedKey = `dailyScrumSubmitted_${currentDate}_${dummyUser.id}`;
      const hasSubmittedToday = localStorage.getItem(scrumSubmittedKey) === 'true';

      if (hasSubmittedToday) {
        router.push('/dashboard');
      } else {
        router.push('/daily-scrum');
      }

    } else {
      // alert('Invalid credentials. Use user@example.com and password.'); // Current error handling
      // Throw an error to be caught by the form handler
      setIsLoading(false);
      throw new Error('Invalid credentials. Please use user@example.com and password.');
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    // TODO: Replace this with a call to an /api/auth/logout endpoint (if you create one)
    //       or simply clear client-side state and cookie (if middleware handles cookie deletion).
    // try {
    //   await fetch('/api/auth/logout', { method: 'POST' }); // Example
    // } catch (error) {
    //   console.error("Logout API call failed", error);
    // }
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('authUser'); // Clear dummy user
    // Also, ensure the 'token' cookie is cleared. The server can do this,
    // or you can try to do it client-side (though httpOnly makes it server-only for deletion)
    // document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    router.push('/');
    // No need to setIsLoading(false) here if router.push unmounts the component
    // but to be safe, especially if there are delays or checks before unmount:
     await new Promise(resolve => setTimeout(resolve, 50)); // small delay to ensure navigation starts
    setIsLoading(false);
  };

  // const register = async (name, email, password, role) => {
  //   setIsLoading(true);
  //   // TODO: Implement call to /api/auth/register
  //   // Handle response and errors similar to login
  //   setIsLoading(false);
  // };

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
