import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthAPI } from '../api/phpAdapter';
import { currentUser as defaultUser } from '../data';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, handle: string, email: string, password: string) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        const parsed = JSON.parse(savedUser);
        setUser({
          ...parsed,
          id: String(parsed.id),
        });
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthAPI.login(email, password);
      const authenticatedUser: User = {
        id: String(response.user.id),
        name: response.user.name,
        handle: response.user.handle,
        email: response.user.email,
        avatar: response.user.avatar || '👤',
        bio: response.user.bio || '',
        verified: !!response.user.verified,
        premium: !!response.user.premium,
        followers: response.user.followers || 0,
        following: response.user.following || 0,
        posts: response.user.posts || 0,
        joinedDate: response.user.joinedDate || 'September 2026',
      };
      
      setToken(response.token);
      setUser(authenticatedUser);
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please check backend connection.');
    }
  };

  const register = async (name: string, handle: string, email: string, password: string) => {
    try {
      const response = await AuthAPI.register(name, handle, email, password);
      const registeredUser: User = {
        id: String(response.user.id),
        name: response.user.name,
        handle: response.user.handle,
        email: response.user.email,
        avatar: response.user.avatar || '👤',
        bio: response.user.bio || '',
        verified: false,
        premium: false,
        followers: 0,
        following: 0,
        posts: 0,
        joinedDate: 'September 2026',
      };
      
      setToken(response.token);
      setUser(registeredUser);
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(registeredUser));
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed. Please check backend connection.');
    }
  };

  const loginAsDemo = () => {
    const demoToken = 'demo-token-' + Date.now();
    setToken(demoToken);
    setUser(defaultUser);
    localStorage.setItem('auth_token', demoToken);
    localStorage.setItem('auth_user', JSON.stringify(defaultUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        loginAsDemo,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

