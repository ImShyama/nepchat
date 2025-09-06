import { useState, useEffect } from 'react';
import { User } from '../types';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = 'your-google-client-id.googleusercontent.com';
const REDIRECT_URI = window.location.origin;
const SCOPE = 'openid profile email https://www.googleapis.com/auth/contacts.readonly';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For demo purposes, we'll simulate Google OAuth
      // In production, you'd implement the actual OAuth flow
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        isOnline: true
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('contacts');
    localStorage.removeItem('messages');
    setUser(null);
  };

  return {
    user,
    isLoading,
    error,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };
};