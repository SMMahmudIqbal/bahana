import { BANGLISH_MAP } from '../data/banglishMap';
import type { Excuse } from '../types';

// Phonetic Bengali to Banglish conversion map
const BENGALI_TO_BANGLISH: Record<string, string> = {
  'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'ee', 'উ': 'u', 'ঊ': 'oo', 'ঋ': 'ri',
  'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
  'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
  'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
  'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
  'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': '',
  'া': 'a', 'ি': 'i', 'ী': 'ee', 'ু': 'u', 'ূ': 'oo', 'ৃ': 'ri',
  'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou', '্': '',
  '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9', '০': '0',
};

export function transliterateBengali(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += BENGALI_TO_BANGLISH[char] || char;
  }
  return result;
}

export function getExcuseText(excuse: Excuse, lang: 'bangla' | 'banglish'): string {
  if (lang === 'bangla') return excuse.text;
  if (excuse.textBanglish) return excuse.textBanglish;
  if (BANGLISH_MAP[excuse.id]?.text) return BANGLISH_MAP[excuse.id].text;
  return transliterateBengali(excuse.text);
}

export function getExcuseProTip(excuse: Excuse, lang: 'bangla' | 'banglish'): string {
  if (lang === 'bangla') return excuse.proTip;
  if (excuse.proTipBanglish) return excuse.proTipBanglish;
  if (BANGLISH_MAP[excuse.id]?.proTip) return BANGLISH_MAP[excuse.id].proTip;
  return transliterateBengali(excuse.proTip);
}

export function getExcuseTag(excuse: Excuse, lang: 'bangla' | 'banglish'): string {
  if (lang === 'bangla') return excuse.categoryTag;
  if (excuse.categoryTagBanglish) return excuse.categoryTagBanglish;
  if (BANGLISH_MAP[excuse.id]?.tag) return BANGLISH_MAP[excuse.id].tag;
  return transliterateBengali(excuse.categoryTag);
}
