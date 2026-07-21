/**
 * File: ThemeContext.jsx
 * Description: Auto-generated documentation for ThemeContext.jsx
 * Date: 2026-07-21
 */
import { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext();
export /**
 * Function ThemeProvider
 * @param {any} props
 * @returns {any}
 */
function ThemeProvider({
  children
}) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('unishop_theme');
      if (stored) return stored;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('unishop_theme', theme);
  }, [theme]);
  /**
 * Arrow Function toggleTheme
 * @returns {any}
 */
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  return <ThemeContext.Provider value={{
    theme,
    toggleTheme
  }}>
      {children}
    </ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export /**
 * Arrow Function useTheme
 * @returns {any}
 */
const useTheme = () => useContext(ThemeContext);