/**
 * File: AuthContext.jsx
 * Description: Auto-generated documentation for AuthContext.jsx
 * Date: 2026-07-21
 */
import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export /**
 * Function AuthProvider
 * @param {any} props
 * @returns {any}
 */
function AuthProvider({
  children
}) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('UniShop_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', {
      email,
      password
    });
    const {
      token,
      user
    } = res.data;
    localStorage.setItem('UniShop_token', token);
    localStorage.setItem('UniShop_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);
  const register = useCallback(async (name, email, password) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password
    });
    const {
      token,
      user
    } = res.data;
    localStorage.setItem('UniShop_token', token);
    localStorage.setItem('UniShop_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem('UniShop_token');
    localStorage.removeItem('UniShop_user');
    setUser(null);
  }, []);
  const becomeSeller = useCallback(async () => {
    const res = await api.post('/auth/become-seller');
    const {
      token,
      user: updatedUser
    } = res.data;
    localStorage.setItem('UniShop_token', token);
    localStorage.setItem('UniShop_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  }, []);
  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller' || user?.role === 'admin'; // admins can access seller features
  const isCustomer = !!user; // all logged-in users can shop
  const isAuthenticated = !!user;
  return <AuthContext.Provider value={{
    user,
    setUser,
    login,
    register,
    logout,
    becomeSeller,
    isAdmin,
    isSeller,
    isCustomer,
    isAuthenticated
  }}>
      {children}
    </AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export /**
 * Arrow Function useAuth
 * @returns {any}
 */
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};