import React from 'react';
import type { Situation, Recipient, LanguageMode } from '../types';
import { SITUATIONS, RECIPIENTS } from '../data/excuses';
import { SlidersHorizontal, Users } from 'lucide-react';

interface FilterBarProps {
  currentSituation: Situation;
  onSelectSituation: (s: Situation) => void;
  currentRecipient: Recipient;
  onSelectRecipient: (r: Recipient) => void;
  language: LanguageMode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentSituation,
  onSelectSituation,
  currentRecipient,
  onSelectRecipient,
  language,
}) => {
  const currentSitObj = SITUATIONS.find((s) => s.id === currentSituation);
  const currentSitLabel =
    language === 'banglish' ? currentSitObj?.labelBanglish : currentSitObj?.label;

  const currentRecObj = RECIPIENTS.find((r) => r.id === currentRecipient);
  const currentRecLabel =
    language === 'banglish' ? currentRecObj?.labelBanglish : currentRecObj?.label;

  return (
    <div className="w-full space-y-3.5 my-4">
      {/* Situation Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium px-1">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {language === 'banglish' ? 'Select Situation' : 'পরিস্থিতি নির্বাচন'}
          </span>
          <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
            {currentSitLabel}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
          {SITUATIONS.map((s) => {
            const isActive = currentSituation === s.id;
            const label = language === 'banglish' ? s.shortLabelBanglish : s.shortLabel;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSituation(s.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipient Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium px-1">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {language === 'banglish' ? 'Target Person' : 'কাকে বলবেন'}
          </span>
          <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
            {currentRecLabel}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
          {RECIPIENTS.map((r) => {
            const isActive = currentRecipient === r.id;
            const label = language === 'banglish' ? r.shortLabelBanglish : r.shortLabel;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRecipient(r.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
