/**
 * File: ToastContext.jsx
 * Description: Auto-generated documentation for ToastContext.jsx
 * Date: 2026-07-21
 */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
const ToastContext = createContext(null);
let toastId = 0;
export /**
 * Function ToastProvider
 * @param {any} props
 * @returns {any}
 */
function ToastProvider({
  children
}) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});
  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++toastId;
    setToasts(prev => [...prev.slice(-4), {
      id,
      message,
      type,
      exiting: false
    }]);
    timersRef.current[id] = setTimeout(() => {
      // Start exit animation
      setToasts(prev => prev.map(t => t.id === id ? {
        ...t,
        exiting: true
      } : t));
      // Remove after animation
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
        delete timersRef.current[id];
      }, 300);
    }, duration);
    return id;
  }, []);
  const dismissToast = useCallback(id => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts(prev => prev.map(t => t.id === id ? {
      ...t,
      exiting: true
    } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);
  return <ToastContext.Provider value={{
    showToast,
    dismissToast
  }}>
      {children}
      {/* Toast Container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast, index) => <div key={toast.id} className={`toast-item toast-${toast.type} ${toast.exiting ? 'toast-exit' : ''}`} style={{
        '--toast-index': index
      }} onClick={() => dismissToast(toast.id)} role="alert">
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : 'ℹ'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>)}
      </div>
    </ToastContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export /**
 * Arrow Function useToast
 * @returns {any}
 */
const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};