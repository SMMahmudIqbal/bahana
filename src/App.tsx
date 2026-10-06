import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Situation, Recipient, Excuse, LanguageMode } from './types';
import { INITIAL_EXCUSES, SITUATIONS, RECIPIENTS } from './data/excuses';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ExcuseCard } from './components/ExcuseCard';
import { ActionButtons } from './components/ActionButtons';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { AddExcuseModal } from './components/AddExcuseModal';
import { CardExporter } from './components/CardExporter';
import { RadarTicker } from './components/RadarTicker';
import { playTactileClick, playSuccessChime, playPanicSound } from './utils/audio';
import { copyToClipboard, shareViaMessenger, shareViaWhatsApp } from './utils/share';
import { getExcuseText } from './utils/transliterate';
import { Zap, ShieldCheck, Keyboard } from 'lucide-react';

export function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('bahana_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Language state (bangla / banglish)
  const [language, setLanguage] = useState<LanguageMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bahana_language');
      if (saved === 'banglish' || saved === 'bangla') return saved;
    }
    return 'bangla';
  });

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bahana_sound');
      return saved ? saved === 'true' : true;
    }
    return true;
  });

  // Excuses database state (including user-created)
  const [customExcuses, setCustomExcuses] = useState<Excuse[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bahana_custom_excuses');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Saved / Bookmarked excuses
  const [savedExcuses, setSavedExcuses] = useState<Excuse[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bahana_saved');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Session usage counter
  const [generatedCount, setGeneratedCount] = useState<number>(1);

  // Selection states
  const [situation, setSituation] = useState<Situation>('all');
  const [recipient, setRecipient] = useState<Recipient>('all');
  const [isAnimating, setIsAnimating] = useState(false);

  // Modals state
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporterOpen, setIsExporterOpen] = useState(false);

  // Combine default and custom excuses
  const allExcuses = useMemo(() => {
    return [...customExcuses, ...INITIAL_EXCUSES];
  }, [customExcuses]);

  // Current Excuse
  const [currentExcuse, setCurrentExcuse] = useState<Excuse>(() => {
    return INITIAL_EXCUSES[Math.floor(Math.random() * INITIAL_EXCUSES.length)];
  });

  // Apply dark theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bahana_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bahana_theme', 'light');
    }
  }, [isDark]);

  // Save language mode
  useEffect(() => {
    localStorage.setItem('bahana_language', language);
  }, [language]);

  // Save sound setting
  useEffect(() => {
    localStorage.setItem('bahana_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Save bookmarks
  useEffect(() => {
    localStorage.setItem('bahana_saved', JSON.stringify(savedExcuses));
  }, [savedExcuses]);

  // Save custom excuses
  useEffect(() => {
    localStorage.setItem('bahana_custom_excuses', JSON.stringify(customExcuses));
  }, [customExcuses]);

  // Filter available excuses
  const filteredExcuses = useMemo(() => {
    return allExcuses.filter((excuse) => {
      const matchesSituation = situation === 'all' || excuse.situation === situation;
      const matchesRecipient = recipient === 'all' || excuse.recipient === recipient;
      return matchesSituation && matchesRecipient;
    });
  }, [allExcuses, situation, recipient]);

  // Generator function
  const getRandomExcuse = useCallback(() => {
    const pool = filteredExcuses.length > 0 ? filteredExcuses : allExcuses;
    if (pool.length === 1) {
      return pool[0];
    }
    // Filter out current excuse if possible
    const candidates = pool.filter((e) => e.id !== currentExcuse.id);
    const selectedPool = candidates.length > 0 ? candidates : pool;
    const randomIndex = Math.floor(Math.random() * selectedPool.length);
    return selectedPool[randomIndex];
  }, [filteredExcuses, allExcuses, currentExcuse.id]);

  const handleGenerateNext = useCallback(() => {
    setIsAnimating(true);
    setGeneratedCount((c) => c + 1);
    setTimeout(() => {
      const next = getRandomExcuse();
      setCurrentExcuse(next);
      setIsAnimating(false);
    }, 150);
  }, [getRandomExcuse]);

  // Instant High-Believability Panic Generator
  const handlePanicGenerate = useCallback(() => {
    playPanicSound(soundEnabled);
    setIsAnimating(true);
    setGeneratedCount((c) => c + 1);
    setTimeout(() => {
      const topSafe = allExcuses
        .filter((e) => e.believability >= 94)
        .sort(() => 0.5 - Math.random());
      if (topSafe.length > 0) {
        setCurrentExcuse(topSafe[0]);
      } else {
        handleGenerateNext();
      }
      setIsAnimating(false);
    }, 150);
  }, [allExcuses, handleGenerateNext, soundEnabled]);

  // Bookmark toggle
  const isCurrentSaved = savedExcuses.some((e) => e.id === currentExcuse.id);

  const handleToggleSave = useCallback(() => {
    if (isCurrentSaved) {
      setSavedExcuses((prev) => prev.filter((e) => e.id !== currentExcuse.id));
    } else {
      playSuccessChime(soundEnabled);
      setSavedExcuses((prev) => [currentExcuse, ...prev]);
    }
  }, [currentExcuse, isCurrentSaved, soundEnabled]);

  // Current active text (Bangla or Banglish)
  const activeExcuseText = useMemo(() => {
    return getExcuseText(currentExcuse, language);
  }, [currentExcuse, language]);

  // Keyboard shortcut listener for pro power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in textarea or input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        playTactileClick(soundEnabled);
        handleGenerateNext();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        playSuccessChime(soundEnabled);
        copyToClipboard(activeExcuseText);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        playSuccessChime(soundEnabled);
        shareViaMessenger(activeExcuseText);
      } else if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        playSuccessChime(soundEnabled);
        shareViaWhatsApp(activeExcuseText);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleToggleSave();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handlePanicGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerateNext, handleToggleSave, handlePanicGenerate, activeExcuseText, soundEnabled]);

  const handleRemoveSaved = (id: string) => {
    setSavedExcuses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearAllSaved = () => {
    setSavedExcuses([]);
  };

  const handleAddCustomExcuse = (newExcuse: Excuse) => {
    setCustomExcuses((prev) => [newExcuse, ...prev]);
    setCurrentExcuse(newExcuse);
    playSuccessChime(soundEnabled);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* Minimal Header with Banglish Switcher */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((v) => !v)}
        savedCount={savedExcuses.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        language={language}
        onToggleLanguage={(lang) => {
          setLanguage(lang);
          playTactileClick(soundEnabled);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 sm:py-8 flex flex-col justify-between">
        <div className="w-full">
          {/* Humorous Live Dhaka Radar Ticker */}
          <RadarTicker language={language} />

          {/* Top Banner & Session Counter */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {language === 'banglish'
                ? '100% Authentic Bangladeshi Excuses'
                : 'বাঙালি জীবনের ১০০% খাঁটি অজুহাত'}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                {language === 'banglish'
                  ? 'One-tap reliable excuses for any situation or person'
                  : 'পরিস্থিতি বা লক্ষ্য অনুযায়ী এক ক্লিকে নির্ভরযোগ্য বাহানা'}
              </span>
              <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">·</span>
              <span className="hidden sm:inline font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                {language === 'banglish'
                  ? `Used: ${generatedCount.toString().padStart(2, '0')}`
                  : `ব্যবহৃত বাহানা: ${generatedCount.toString().padStart(2, '0')}টি`}
              </span>
            </div>
          </div>

          {/* Filter Bar (Situation & Recipient) */}
          <FilterBar
            currentSituation={situation}
            onSelectSituation={(s) => {
              setSituation(s);
              playTactileClick(soundEnabled);
            }}
            currentRecipient={recipient}
            onSelectRecipient={(r) => {
              setRecipient(r);
              playTactileClick(soundEnabled);
            }}
            language={language}
          />

          {/* Hero Excuse Card */}
          <ExcuseCard
            excuse={currentExcuse}
            isSaved={isCurrentSaved}
            onToggleSave={handleToggleSave}
            isAnimating={isAnimating}
            language={language}
          />

          {/* Primary & Quick Action Buttons */}
          <ActionButtons
            currentText={activeExcuseText}
            onGenerateNext={handleGenerateNext}
            onExportCard={() => setIsExporterOpen(true)}
            onPlayClickSound={() => playTactileClick(soundEnabled)}
            onPlaySuccessSound={() => playSuccessChime(soundEnabled)}
            disabled={isAnimating}
            language={language}
          />

          {/* Emergency Safe Excuse (Panic Mode) & Hotkeys Info */}
          <div className="mt-2 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                {language === 'banglish'
                  ? 'Urgent incoming call right now?'
                  : 'জরুরি মুহূর্তে তাৎক্ষণিক অজুহাত প্রয়োজন?'}
              </span>
            </div>
            <button
              onClick={handlePanicGenerate}
              className="w-full sm:w-auto text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>
                {language === 'banglish' ? 'Panic Mode (Safe Excuse)' : 'প্যানিক মোড (নিরাপদ বাহানা)'}
              </span>
              <span className="hidden sm:inline font-mono text-[10px] text-zinc-400 ml-1">[P]</span>
            </button>
          </div>

          {/* Desktop Keyboard Shortcuts Ribbon */}
          <div className="hidden sm:flex items-center justify-center gap-4 mt-4 py-2 px-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5 text-zinc-400" />
              {language === 'banglish' ? 'Hotkeys:' : 'কিবোর্ড শর্টকাট:'}
            </span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">Space</kbd> {language === 'banglish' ? 'New' : 'নতুন'}</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">C</kbd> {language === 'banglish' ? 'Copy' : 'কপি'}</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">M</kbd> Messenger</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">S</kbd> {language === 'banglish' ? 'Save' : 'সেভ'}</span>
          </div>
        </div>

        {/* Minimalist Authentic Footer with Developer Credit */}
        <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 text-center text-xs text-zinc-400 dark:text-zinc-500 space-y-4">
          <div className="flex items-center justify-center gap-4 text-[11px] font-mono">
            <span>
              {language === 'banglish'
                ? `Total Bahana: ${allExcuses.length}`
                : `মোট বাহানা: ${allExcuses.length}টি`}
            </span>
            <span>
              {language === 'banglish'
                ? `Situations: ${SITUATIONS.length - 1}`
                : `পরিস্থিতি: ${SITUATIONS.length - 1}টি`}
            </span>
            <span>
              {language === 'banglish'
                ? `Recipients: ${RECIPIENTS.length - 1}`
                : `শ্রোতা: ${RECIPIENTS.length - 1}টি`}
            </span>
          </div>

          <p className="leading-relaxed max-w-md mx-auto">
            {language === 'banglish'
              ? 'Crafted reflecting real Bangladeshi everyday life. No offenses, purely survival excuses.'
              : 'খাঁটি বাংলাদেশি বাস্তবতার আলোকে তৈরি। কোনো অপরাধ নয়, শুধু দৈনন্দিন বেঁচে থাকার নিরুপায় বাহানা।'}
          </p>

          {/* Developer Credit Signature */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-850 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                Developed by{' '}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold tracking-wide">
                  S. M. Mahmud Iqbal
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                Dhaka, Bangladesh
              </span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-medium text-zinc-700 dark:text-zinc-300">
                v1.3 Banglish Edition
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedExcuses={savedExcuses}
        onRemoveExcuse={handleRemoveSaved}
        onClearAll={handleClearAllSaved}
        language={language}
      />

      {/* Add Custom Excuse Modal */}
      <AddExcuseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddExcuse={handleAddCustomExcuse}
      />

      {/* Story Card Image Exporter Modal */}
      <CardExporter
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
        excuse={currentExcuse}
        language={language}
      />
    </div>
  );
}

export default App;
