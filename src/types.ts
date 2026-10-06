export type LanguageMode = 'bangla' | 'banglish';

export type Situation = 
  | 'all'
  | 'late_class'
  | 'late_office'
  | 'missed_call'
  | 'skipped_adda'
  | 'deadline_miss'
  | 'money_delay'
  | 'family_event';

export type Recipient = 
  | 'all'
  | 'friend'
  | 'boss'
  | 'teacher'
  | 'crush'
  | 'parents'
  | 'colleague';

export type RiskLevel = 'কম' | 'মাঝারি' | 'চরম ঝুঁকিপূর্ণ';

export interface Excuse {
  id: string;
  text: string;
  textBanglish?: string;
  situation: Situation;
  recipient: Recipient;
  believability: number; // 0 - 100 percentage
  risk: RiskLevel;
  proTip: string;
  proTipBanglish?: string;
  categoryTag: string;
  categoryTagBanglish?: string;
  isCustom?: boolean;
}

export interface SituationOption {
  id: Situation;
  label: string;
  shortLabel: string;
  labelBanglish: string;
  shortLabelBanglish: string;
}

export interface RecipientOption {
  id: Recipient;
  label: string;
  shortLabel: string;
  labelBanglish: string;
  shortLabelBanglish: string;
}
