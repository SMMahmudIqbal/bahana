import React from 'react';
import type { LanguageMode } from '../types';
import { Volume2, VolumeX, Moon, Sun, Bookmark, Plus } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  savedCount: number;
  onOpenFavorites: () => void;
  onOpenAddModal: () => void;
  language: LanguageMode;
  onToggleLanguage: (lang: LanguageMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  isDark,
  onToggleTheme,
  savedCount,
  onOpenFavorites,
  onOpenAddModal,
  language,
  onToggleLanguage,
}) => {
  return (
    <header className="w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold text-lg select-none shadow-sm">
            বা
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-zinc-900 dark:text-zinc-100 m-0">
                {language === 'bangla' ? 'বাহানা' : 'Bahana'}
              </h1>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                v1.3
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              the excuse generator
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher (বাংলা / Banglish) */}
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium mr-0.5 sm:mr-1">
            <button
              onClick={() => onToggleLanguage('bangla')}
              className={`px-2 py-1 rounded-lg transition-all ${
                language === 'bangla'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="বাংলা ভাষা"
            >
              বাংলা
            </button>
            <button
              onClick={() => onToggleLanguage('banglish')}
              className={`px-2 py-1 rounded-lg transition-all font-mono ${
                language === 'banglish'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="Banglish (Romanized)"
            >
              Banglish
            </button>
          </div>

          {/* Add Excuse */}
          <button
            onClick={onOpenAddModal}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors flex items-center gap-1.5"
            title={language === 'bangla' ? 'নতুন বাহানা যোগ করুন' : 'Add custom excuse'}
            aria-label="Add custom excuse"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">
              {language === 'bangla' ? 'বাহানা লিখুন' : 'Add'}
            </span>
          </button>

          {/* Favorites List */}
          <button
            onClick={onOpenFavorites}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors relative"
            title={language === 'bangla' ? 'পছন্দের বাহানা তালিকা' : 'Saved excuses'}
            aria-label="Saved excuses"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-mono font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            title={soundEnabled ? 'শব্দ বন্ধ করুন' : 'শব্দ চালু করুন'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            title={isDark ? 'লাইট মোড' : 'ডার্ক মোড'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
