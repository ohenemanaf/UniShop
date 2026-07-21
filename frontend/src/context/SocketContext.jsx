/**
 * File: SocketContext.jsx
 * Description: Auto-generated documentation for SocketContext.jsx
 * Date: 2026-07-21
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
const SocketContext = createContext();
export /**
 * Function SocketProvider
 * @param {any} props
 * @returns {any}
 */
function SocketProvider({
  children
}) {
  const {
    isAuthenticated
  } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }
    const token = localStorage.getItem('UniShop_token');
    if (!token) return;

    // Use localhost:3001 or window.location for PROD
    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3001', {
      auth: {
        token
      }
    });
    newSocket.on('connect', () => {
      console.log('Connected to socket.io server');
    });
    newSocket.on('new_order', data => {
      console.log('Received new order notification:', data);
      setNotifications(prev => [data, ...prev]);
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  /**
 * Arrow Function clearNotifications
 * @returns {any}
 */
  const clearNotifications = () => setNotifications([]);
  return <SocketContext.Provider value={{
    socket,
    notifications,
    clearNotifications
  }}>
      {children}
    </SocketContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export /**
 * Function useSocket
 * @returns {any}
 */
function useSocket() {
  return useContext(SocketContext);
}