import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

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

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Laptop;

  return (
    <button
      onClick={cycleTheme}
      className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full"
      aria-label="Toggle theme"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

export default ThemeToggle;