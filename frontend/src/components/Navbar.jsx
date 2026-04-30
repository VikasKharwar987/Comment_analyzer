import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Moon, Sun, ArrowLeft } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

export default function Navbar() {
  const [theme, toggleTheme] = useDarkMode();
  const location = useLocation();

  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface/80 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {isDashboard && (
              <Link 
                to="/"
                className="p-2 rounded-full hover:bg-background text-text-secondary hover:text-text transition-colors"
                aria-label="Back to posts"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <ShieldAlert className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-text">
                Toxicity Analyzer
              </span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-background text-text-secondary hover:text-text transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
