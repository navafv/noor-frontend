/* NEW FILE: src/components/ThemeToggle.jsx */
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 text-muted-foreground hover:bg-accent rounded-full"
      aria-label="Toggle theme"
    >
      {theme === 'light' && <Sun className="h-5 w-5" />}
      {theme === 'dark' && <Moon className="h-5 w-5" />}
      {theme === 'system' && <Laptop className="h-5 w-5" />}
    </button>
  );
}

export default ThemeToggle;