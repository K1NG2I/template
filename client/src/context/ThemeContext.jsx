import { createContext, useContext, useState, useEffect } from 'react';
import { useConfig } from './ConfigContext';

const ThemeContext = createContext(null);

const DEFAULT_COLORS = {
  dark: {
    '--bg': '#2c2c2c',
    '--card': '#2c2c2c',
    '--accent': '#ECAA2F',
    '--muted': '#c7c7d7',
    '--primary': '#ffffff',
    '--nav-bg': '#2c2c2c',
    '--bg-secondary': '#222222',
    '--bg-tertiary': '#1a1a1a',
    '--border': 'rgba(255, 255, 255, 0.1)',
  },
  light: {
    '--bg': '#f5f5f5',
    '--card': '#ffffff',
    '--accent': '#d4942b',
    '--muted': '#555555',
    '--primary': '#1a1a1a',
    '--nav-bg': '#ffffff',
    '--bg-secondary': '#e8e8e8',
    '--bg-tertiary': '#d8d8d8',
    '--border': 'rgba(0, 0, 0, 0.1)',
  },
};

export function ThemeProvider({ children }) {
  const { config } = useConfig();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const colors = config?.colors?.[theme] || DEFAULT_COLORS[theme];
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
    const fontFamily = config?.fonts?.family || 'Inter, system-ui, -apple-system, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif';
    root.style.setProperty('--font-family', fontFamily);
    const link = config?.fonts?.googleFontLink;
    if (link) {
      let existing = document.querySelector('link[data-font="google"]');
      if (existing) {
        existing.href = link;
      } else {
        const el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = link;
        el.setAttribute('data-font', 'google');
        document.head.appendChild(el);
      }
    } else {
      const existing = document.querySelector('link[data-font="google"]');
      if (existing) existing.remove();
    }
  }, [config, theme]);

  function toggle() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
