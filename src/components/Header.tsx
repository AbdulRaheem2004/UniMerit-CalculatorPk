import React from 'react';
import { GraduationCap, Moon, Sun, Languages, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  showRomanUrdu: boolean;
  toggleRomanUrdu: () => void;
  onOpenAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  showRomanUrdu,
  toggleRomanUrdu,
  onOpenAudit,
}) => {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-800 text-teal-50 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-lg text-zinc-900 dark:text-white">
                PakMerit
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 uppercase">
                2026 Engine
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Pakistani Universities Merit Calculator & 10-Year Cutoffs
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Authenticated Sources Button */}
          <button
            onClick={onOpenAudit}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 dark:text-teal-300 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 transition-colors border border-teal-200 dark:border-teal-800"
            title="View verified university citations and prospectus formulas"
          >
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="hidden md:inline">Verified Sources</span>
          </button>

          {/* Roman Urdu Toggle */}
          <button
            onClick={toggleRomanUrdu}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              showRomanUrdu
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700'
            }`}
            title="Toggle Roman Urdu student explanations"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showRomanUrdu ? 'Roman Urdu: ON' : 'Roman Urdu: OFF'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
