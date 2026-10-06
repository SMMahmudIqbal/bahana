import React, { useState } from 'react';
import type { Excuse, LanguageMode } from '../types';
import { X, Trash2, Copy, Check, Bookmark } from 'lucide-react';
import { copyToClipboard } from '../utils/share';
import { getExcuseText } from '../utils/transliterate';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedExcuses: Excuse[];
  onRemoveExcuse: (id: string) => void;
  onClearAll: () => void;
  language: LanguageMode;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  savedExcuses,
  onRemoveExcuse,
  onClearAll,
  language,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (excuse: Excuse) => {
    const textToCopy = getExcuseText(excuse, language);
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopiedId(excuse.id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[85vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 m-0">
              {language === 'banglish' ? 'Saved Excuses' : 'সংরক্ষিত বাহানা'} ({savedExcuses.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {savedExcuses.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
              >
                {language === 'banglish' ? 'Clear All' : 'সব মুছুন'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {savedExcuses.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30 stroke-[1.5]" />
              <p className="text-sm">
                {language === 'banglish' ? 'No saved excuses yet' : 'এখনো কোনো বাহানা সেভ করা হয়নি'}
              </p>
              <p className="text-xs mt-1 text-zinc-500">
                {language === 'banglish'
                  ? 'Click bookmark icon to save your favorite excuses'
                  : 'পছন্দের বাহানা সেভ করে রাখতে বুকমার্ক আইকনে চাপুন'}
              </p>
            </div>
          ) : (
            savedExcuses.map((excuse) => {
              const text = getExcuseText(excuse, language);
              return (
                <div
                  key={excuse.id}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">
                    {text}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                      {language === 'banglish' ? 'Believability:' : 'বিশ্বাসযোগ্যতা:'} {excuse.believability}%
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(excuse)}
                        className="p-1.5 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
                        title={language === 'banglish' ? 'Copy' : 'কপি করুন'}
                      >
                        {copiedId === excuse.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px]">{language === 'banglish' ? 'Copied' : 'কপি হয়েছে'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{language === 'banglish' ? 'Copy' : 'কপি'}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onRemoveExcuse(excuse.id)}
                        className="p-1.5 rounded text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title={language === 'banglish' ? 'Delete' : 'মুছে ফেলুন'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
