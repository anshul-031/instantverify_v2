"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './use-auth-store';
import { loginUser, logoutUser } from '@/lib/services/auth';

export function useAuth() {
  const router = useRouter();
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, redirect?: string) => {
    try {
      const userData = await loginUser(email, password);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push(redirect || '/verify');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('user');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    refreshAuth: checkAuth,
  };
}