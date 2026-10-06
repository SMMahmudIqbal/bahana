import React, { useState } from 'react';
import type { LanguageMode } from '../types';
import { RefreshCw, Copy, Check, MessageSquare, Send, Share2, Download } from 'lucide-react';
import { shareViaMessenger, shareViaWhatsApp, shareNative, copyToClipboard } from '../utils/share';

interface ActionButtonsProps {
  currentText: string;
  onGenerateNext: () => void;
  onExportCard: () => void;
  onPlayClickSound: () => void;
  onPlaySuccessSound: () => void;
  disabled?: boolean;
  language: LanguageMode;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentText,
  onGenerateNext,
  onExportCard,
  onPlayClickSound,
  onPlaySuccessSound,
  disabled = false,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [messengerNotified, setMessengerNotified] = useState(false);

  const handleCopy = async () => {
    onPlaySuccessSound();
    const ok = await copyToClipboard(currentText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleMessenger = () => {
    onPlaySuccessSound();
    const res = shareViaMessenger(currentText);
    if (res.type === 'copied') {
      setMessengerNotified(true);
      setTimeout(() => setMessengerNotified(false), 2800);
    }
  };

  const handleWhatsApp = () => {
    onPlaySuccessSound();
    shareViaWhatsApp(currentText);
  };

  const handleNativeShare = async () => {
    onPlaySuccessSound();
    await shareNative(currentText);
  };

  const handleGenerate = () => {
    onPlayClickSound();
    onGenerateNext();
  };

  return (
    <div className="w-full space-y-4 my-6">
      {/* Primary Generator Action Button */}
      <button
        onClick={handleGenerate}
        disabled={disabled}
        className="w-full group relative py-4 px-6 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-base sm:text-lg shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer select-none"
        aria-label="Generate new excuse"
      >
        <RefreshCw className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180 group-active:rotate-90" />
        <span>{language === 'banglish' ? 'Get New Bahana' : 'নতুন বাহানা নিন'}</span>
        <span className="hidden sm:inline-block ml-2 text-xs font-mono py-0.5 px-2 rounded bg-zinc-800 dark:bg-zinc-200 text-zinc-300 dark:text-zinc-700 font-normal">
          Space
        </span>
      </button>

      {/* Copy / Messenger feedback toast */}
      {(copied || messengerNotified) && (
        <div className="text-center py-1.5 px-3 rounded-lg bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium animate-fade-in flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>
            {messengerNotified
              ? language === 'banglish'
                ? 'Bahana copied! Opening Messenger...'
                : 'বাহানা কপি হয়েছে এবং মেসেঞ্জার ওপেন হচ্ছে!'
              : language === 'banglish'
              ? 'Bahana copied to clipboard! Send it right away.'
              : 'বাহানা কপি হয়েছে! এবার যাকে খুশি পাঠিয়ে দিন।'}
          </span>
        </div>
      )}

      {/* Secondary Quick Share Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
          title={language === 'banglish' ? 'Copy to clipboard' : 'ক্লিপবোর্ডে কপি করুন'}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>
            {copied
              ? language === 'banglish'
                ? 'Copied'
                : 'কপি হয়েছে'
              : language === 'banglish'
              ? 'Copy'
              : 'কপি করুন'}
          </span>
        </button>

        {/* Messenger Button */}
        <button
          onClick={handleMessenger}
          className="py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
          title="Send via Messenger"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messenger</span>
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
          title="Send via WhatsApp"
        >
          <Send className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>

        {/* Native Share / Other */}
        <button
          onClick={handleNativeShare}
          className="py-2.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
          title="Share to other apps"
        >
          <Share2 className="w-4 h-4" />
          <span>{language === 'banglish' ? 'Share' : 'অন্যত্র শেয়ার'}</span>
        </button>
      </div>

      {/* Export Card for Stories / Social Media */}
      <div className="pt-1 text-center">
        <button
          onClick={onExportCard}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1 px-2 rounded cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>
            {language === 'banglish'
              ? 'Download Aesthetic Story Card Image'
              : 'স্টোরির জন্য কার্ড ছবি হিসেবে ডাউনলোড করুন'}
          </span>
        </button>
      </div>
    </div>
  );
};
