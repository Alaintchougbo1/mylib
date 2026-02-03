'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/services/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      api.getMe().then((userData) => {
        setUser(userData);
        setLoading(false);
      }).catch(() => {
        Cookies.remove('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    const data = await api.login(email, password);
    console.log('Login successful, data:', data);

    Cookies.set('token', data.token, { expires: 7, sameSite: 'lax' });
    setUser(data.user);

    const redirectUrl = data.user.role === 'ROLE_ADMIN' ? '/admin' : '/livres';
    console.log('Redirecting to:', redirectUrl);

    // Forcer la redirection avec un léger délai pour s'assurer que tout est sauvegardé
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 100);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  const isAdmin = () => {
    return user?.role === 'ROLE_ADMIN';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
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
