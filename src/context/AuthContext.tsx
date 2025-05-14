




import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signup,
  login,
  logout as apiLogout,
  loadToken,
  saveToken,
  clearAuthToken,
} from '../services/auth';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'user' | 'supervisor';
  active_plan: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  register: (
    data: {
      first_name: string;
      last_name: string;
      email: string;
      mobile_number: string;
      password: string;
    }
  ) => Promise<void>;
  loginUser: (creds: { email: string; password: string }) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (token) {
        const stored = await AsyncStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored) as User);
      }
      setLoading(false);
    })();
  }, []);

  const register = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    password: string;
  }): Promise<void> => {
    const res = await signup(data);
    const { token, user: u } = res;
    await saveToken(token);
    await AsyncStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const loginUser = async (
    creds: { email: string; password: string }
  ): Promise<void> => {
    const res = await login(creds);
    const { token, user: u } = res;
    await saveToken(token);
    await AsyncStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const logoutUser = async (): Promise<void> => {
    await apiLogout();
    await AsyncStorage.multiRemove(['token', 'user']);
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => useContext(AuthContext);
