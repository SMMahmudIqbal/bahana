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
  'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': '',
  'া': 'a', 'ি': 'i', 'ী': 'ee', 'ু': 'u', 'ূ': 'oo', 'ৃ': 'ri',
  'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou', '্': '',
  '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9', '০': '0',
};

// Characters that must never survive into Banglish output. U+09BC is the
// nukta: the old fallback had no entry for it, so it passed through and
// rendered as stray dots (the bug in Rupai's screenshot). U+200C/U+200D are
// zero-width joiners that likewise add nothing readable.
const STRIP_CHARS = new Set(['\u09bc', '\u200c', '\u200d']);

export function transliterateBengali(text: string): string {
  let result = '';
  let afterHasanta = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (STRIP_CHARS.has(char)) continue;
    if (char === '্') {
      // Hasanta: the next consonant is a conjunct, joined directly with
      // no vowel of its own. Remember that, and emit nothing for the
      // hasanta itself.
      afterHasanta = true;
      continue;
    }
    if (afterHasanta) {
      // Minimal conjunct handling: ya-phala (hasanta + ya) is pronounced
      // "y", not "j", e.g. the second half of a conjunct. Other conjunct
      // consonants keep their bare mapping, which is already the joined
      // form the old fallback produced.
      if (char === 'য') {
        result += 'y';
        afterHasanta = false;
        continue;
      }
      afterHasanta = false;
    }
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
