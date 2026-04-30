import { useState, useEffect } from 'react';

export default function useDarkMode() {
  const [theme, setTheme] = useState(() => {
    try {
      const item = window.localStorage.getItem('theme');
      return item ? item : 'light';
    } catch (error) {
      console.warn('Error reading theme from localStorage', error);
      return 'light';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Error setting theme to localStorage', error);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return [theme, toggleTheme];
}
