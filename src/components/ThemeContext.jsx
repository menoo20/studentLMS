import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Available themes: 'light', 'blackGold', 'vibrantGradient'
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-blackGold', 'theme-vibrantGradient');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'blackGold';
      if (prev === 'blackGold') return 'vibrantGradient';
      return 'light';
    });
  };

  // Helper function to get theme-specific styles
  const getThemeStyles = (lightStyle, blackGoldStyle, vibrantStyle) => {
    if (theme === 'blackGold') return blackGoldStyle;
    if (theme === 'vibrantGradient') return vibrantStyle;
    return lightStyle;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getThemeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
