import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

export default function Navbar() {
  const [theme, toggleTheme] = useDarkMode();
  const location = useLocation();

  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface/80 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {isDashboard && (
              <Link 
                to="/"
                className="p-1.5 rounded-full hover:bg-background text-text-secondary hover:text-text transition-colors flex-shrink-0"
                aria-label="Back to posts"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            )}
            <Link to="/" className="flex items-center gap-2 group min-w-0">
              <div className="p-0.5 sm:p-1 bg-primary/10 rounded-lg sm:rounded-xl group-hover:bg-primary/20 transition-all duration-300 flex-shrink-0">
                <img src="/logo.png" alt="Toxicity Analyzer Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="font-bold text-base sm:text-xl tracking-tight text-text truncate">
                Toxicity Analyzer
              </span>
            </Link>
          </div>
          
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full hover:bg-background text-text-secondary hover:text-text transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
