import React, { useState, useEffect } from 'react';
import type { LanguageMode } from '../types';
import { Radio } from 'lucide-react';

const RADAR_UPDATES_BN = [
  'শাহবাগ মোড়: ট্রাফিক সার্জেন্ট হাত তুলে রেখেছেন (জ্যাম স্কেল: ১০০/১০০)',
  'বিজয় সরণি: ভিআইপি মুভমেন্ট চলমান (বাহানার গ্রহণযোগ্যতা: সর্বোচ্চ)',
  'নীলক্ষেত: ফটোকপি মেশিনে কালি শেষ (অ্যাসাইনমেন্ট ঝুঁকি: ৯৮%)',
  'ফার্মগেট: বাসের হেলপার বাসের বাইরে ঝুলছে (চিপা লেভেল: এক্সট্রিম)',
  'বিকাশ সার্ভার: ট্রানজ্যাকশন টাইমআউট (মানিব্যাগ এখনও অক্ষত)',
  'উবার সিএনজি: ‘মামা আসতেছি’ বলে চালক গলির মোড়ে চা খাচ্ছেন',
  'মিরপুর ১০: রাস্তা খোঁড়াখুঁড়ির উৎসব শুরু হয়েছে (হাটার বিকল্প নেই)',
  'হাতিরঝিল: ওয়াটার ট্যাক্সির লাইনে ২০০ জন দাঁড়িয়ে',
];

const RADAR_UPDATES_EN = [
  'Shahbagh Mor: Traffic sergeant raised hand (Jam Scale: 100/100)',
  'Bijoy Shoroni: VIP convoy active (Bahana acceptance: 100%)',
  'Nilkhet: Photocopy machine ink finished (Assignment risk: 98%)',
  'Farmgate: Bus helper hanging outside (Chipa level: Extreme)',
  'bKash Server: Transaction timeout (Wallet still safe)',
  'Uber CNG: ‘Mama ashteci’ said driver sipping tea',
  'Mirpur 10: Road digging festival started (No option but walking)',
  'Hatirjheel: 200 people standing in Water Taxi queue',
];

interface RadarTickerProps {
  language: LanguageMode;
}

export const RadarTicker: React.FC<RadarTickerProps> = ({ language }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const updates = language === 'banglish' ? RADAR_UPDATES_EN : RADAR_UPDATES_BN;

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % updates.length);
        setFade(true);
      }, 250);
    }, 4500);

    return () => clearInterval(timer);
  }, [updates.length]);

  return (
    <div className="w-full mb-4 px-3 py-2 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 overflow-hidden shadow-xs">
      <div className="flex items-center gap-1.5 flex-shrink-0 text-zinc-900 dark:text-zinc-200 font-medium">
        <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
          {language === 'banglish' ? 'Live Radar' : 'লাইভ রাডার'}
        </span>
        <span className="text-zinc-300 dark:text-zinc-700">|</span>
      </div>

      <div
        className={`truncate transition-opacity duration-300 text-xs ${
          fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
        }`}
      >
        {updates[index % updates.length]}
      </div>
    </div>
  );
};
