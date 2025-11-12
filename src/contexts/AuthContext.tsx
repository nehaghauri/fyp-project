import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'brand';
  twinName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'admin' | 'brand', name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('infiniServeUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'admin' | 'brand', name?: string) => {
    // Mock login - in real app, you'd call an API
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0], // Use provided name or email prefix
      email: email,
      role: role,
      twinName: role === 'user' ? `${name || email.split('@')[0]}'s Digital Twin` : undefined
    };

    setUser(mockUser);
    localStorage.setItem('infiniServeUser', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('infiniServeUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
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