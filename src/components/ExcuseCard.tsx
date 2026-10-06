import React from 'react';
import type { Excuse, LanguageMode } from '../types';
import { SITUATIONS, RECIPIENTS } from '../data/excuses';
import { Bookmark, BookmarkCheck, Shield, Sparkles, Lightbulb } from 'lucide-react';
import { getExcuseText, getExcuseProTip, getExcuseTag } from '../utils/transliterate';

interface ExcuseCardProps {
  excuse: Excuse;
  isSaved: boolean;
  onToggleSave: () => void;
  isAnimating: boolean;
  language: LanguageMode;
}

export const ExcuseCard: React.FC<ExcuseCardProps> = ({
  excuse,
  isSaved,
  onToggleSave,
  isAnimating,
  language,
}) => {
  const situationObj = SITUATIONS.find((s) => s.id === excuse.situation);
  const situationLabel =
    language === 'banglish'
      ? situationObj?.labelBanglish || 'Jekono'
      : situationObj?.label || 'সাধারণ';

  const recipientObj = RECIPIENTS.find((r) => r.id === excuse.recipient);
  const recipientLabel =
    language === 'banglish'
      ? recipientObj?.labelBanglish || 'Shobai'
      : recipientObj?.label || 'সবার জন্য';

  const displayedText = getExcuseText(excuse, language);
  const displayedTip = getExcuseProTip(excuse, language);
  const displayedTag = getExcuseTag(excuse, language);

  // Risk badge styling
  const riskColor =
    excuse.risk === 'কম'
      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50'
      : excuse.risk === 'মাঝারি'
      ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50'
      : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50';

  const riskLabel =
    language === 'banglish'
      ? excuse.risk === 'কম'
        ? 'Low'
        : excuse.risk === 'মাঝারি'
        ? 'Medium'
        : 'Extreme'
      : excuse.risk;

  return (
    <div
      className={`w-full relative transition-all duration-300 transform ${
        isAnimating ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
        {/* Top Badges & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
              {situationLabel}
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
              {language === 'banglish' ? 'Target:' : 'লক্ষ্য:'} {recipientLabel}
            </span>
            {displayedTag && (
              <span className="hidden sm:inline-block text-[11px] font-mono px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500">
                {displayedTag}
              </span>
            )}
          </div>

          <button
            onClick={onToggleSave}
            className="p-2 -mr-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={isSaved ? 'Remove from saved' : 'Save to favorites'}
            aria-label="Bookmark excuse"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Excuse Main Typography */}
        <div className="relative my-4">
          <div className="text-zinc-300 dark:text-zinc-700 text-5xl font-serif select-none absolute -top-5 -left-2 sm:-left-4 pointer-events-none opacity-40">
            &ldquo;
          </div>
          <p
            className={`text-xl sm:text-2xl md:text-3xl font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed sm:leading-loose tracking-tight relative z-10 pl-2 ${
              language === 'banglish' ? 'font-sans' : ''
            }`}
          >
            {displayedText}
          </p>
        </div>

        {/* Believability and Risk Meter */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Believability */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'banglish' ? 'Believability' : 'বিশ্বাসযোগ্যতা'}
              </span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                {excuse.believability}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 dark:bg-zinc-200 rounded-full transition-all duration-500"
                style={{ width: `${excuse.believability}%` }}
              />
            </div>
          </div>

          {/* Risk Level */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium sm:hidden">
              <Shield className="w-3.5 h-3.5" />
              {language === 'banglish' ? 'Risk Level:' : 'ধরা খাওয়ার ঝুঁকি:'}
            </span>
            <div className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 ${riskColor}`}>
              <Shield className="w-3.5 h-3.5 hidden sm:inline" />
              <span>
                {language === 'banglish' ? 'Risk:' : 'ঝুঁকি:'} {riskLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Relatable Pro Tip / Commentary */}
        {displayedTip && (
          <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <Lightbulb className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium mr-1">
                {language === 'banglish' ? 'Pro Tip:' : 'টিপস:'}
              </strong>
              {displayedTip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
