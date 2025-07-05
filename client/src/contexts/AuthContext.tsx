import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI, setAuthToken, getAuthToken } from "../services/api";
import type { User, LoginForm, RegisterForm } from "../types";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.user);
        } catch (error) {
          // Token is invalid, remove it
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginForm) => {
    try {
      const response = await authAPI.login(data);
      setAuthToken(response.token);
      setUser(response.user);
      toast.success("Login successful!");
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (data: RegisterForm) => {
    try {
      const response = await authAPI.register(data);
      setAuthToken(response.token);
      setUser(response.user);
      toast.success("Registration successful! Welcome aboard!");
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
