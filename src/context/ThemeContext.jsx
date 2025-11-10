/* NEW FILE: src/context/ThemeContext.jsx */
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 1. Check local storage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme;
    }
    // 2. Default to 'system'
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme(newTheme) {
      // Save preference to local storage
      localStorage.setItem('theme', newTheme);
      
      if (newTheme === 'system') {
        // Apply system theme
        root.classList.toggle('dark', isDarkQuery.matches);
      } else {
        // Apply light or dark
        root.classList.toggle('dark', newTheme === 'dark');
      }
    }

    applyTheme(theme);

    // Watch for system theme changes
    const handleChange = (e) => {
      if (theme === 'system') {
        root.classList.toggle('dark', e.matches);
      }
    };

    isDarkQuery.addEventListener('change', handleChange);
    return () => isDarkQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const contextValue = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;