import React, { useState } from 'react';
import type { Situation, Recipient, Excuse } from '../types';
import { SITUATIONS, RECIPIENTS } from '../data/excuses';
import { X, Plus, Sparkles } from 'lucide-react';

interface AddExcuseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExcuse: (excuse: Excuse) => void;
}

export const AddExcuseModal: React.FC<AddExcuseModalProps> = ({
  isOpen,
  onClose,
  onAddExcuse,
}) => {
  const [text, setText] = useState('');
  const [situation, setSituation] = useState<Situation>('late_office');
  const [recipient, setRecipient] = useState<Recipient>('friend');
  const [proTip, setProTip] = useState('');
  const [believability, setBelievability] = useState(85);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newExcuse: Excuse = {
      id: `custom-${Date.now()}`,
      text: text.trim(),
      situation,
      recipient,
      believability: Number(believability),
      risk: believability > 85 ? 'কম' : believability > 70 ? 'মাঝারি' : 'চরম ঝুঁকিপূর্ণ',
      proTip: proTip.trim() || 'টিপস: আত্মবিশ্বাস বজায় রাখুন।',
      categoryTag: 'নিজস্ব বাহানা',
      isCustom: true,
    };

    onAddExcuse(newExcuse);
    setText('');
    setProTip('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 m-0">
              আপনার নিজস্ব বাহানা যোগ করুন
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              বাহানার বিবরণ
            </label>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="যেমন: দোস্ত, রিকশার চেইন পড়ে গেছিল আর আশপাশে কোনো মেকানিক ছিল না..."
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                পরিস্থিতি
              </label>
              <select
                value={situation}
                onChange={(e) => setSituation(e.target.value as Situation)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none"
              >
                {SITUATIONS.filter((s) => s.id !== 'all').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                কাকে দেবেন
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value as Recipient)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none"
              >
                {RECIPIENTS.filter((r) => r.id !== 'all').map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              বিশ্বাসযোগ্যতা স্তর ({believability}%)
            </label>
            <input
              type="range"
              min="50"
              max="99"
              value={believability}
              onChange={(e) => setBelievability(Number(e.target.value))}
              className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              বিশেষ পরামর্শ বা টিপস (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={proTip}
              onChange={(e) => setProTip(e.target.value)}
              placeholder="যেমন: বলার সময় মুখ একদম সিরিয়াস রাখতে হবে।"
              className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
