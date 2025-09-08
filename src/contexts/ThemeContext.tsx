import React, { useEffect, useState } from 'react';
import { ThemeContext, type Theme } from './theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to 'system'
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    // Get initial actual theme from DOM (set by the blocking script)
    if (typeof window !== 'undefined') {
      const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
      return currentTheme || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const updateActualTheme = () => {
      let newActualTheme: 'light' | 'dark';

      if (theme === 'system') {
        newActualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      } else {
        newActualTheme = theme;
      }

      setActualTheme(newActualTheme);

      // Apply theme to document root
      root.classList.remove('light', 'dark');
      root.classList.add(newActualTheme);
      root.setAttribute('data-theme', newActualTheme);

      // Also apply to body for good measure
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(newActualTheme);
    };

    // Update theme (this will handle theme changes after initial load)
    updateActualTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateActualTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Save theme to localStorage
    localStorage.setItem('theme', theme);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  const value = {
    theme,
    setTheme,
    actualTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
