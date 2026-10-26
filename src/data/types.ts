import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type Section = {
  title: string;
  /** Paragraflar */
  body?: string[];
  /** Madde madde bilgiler */
  bullets?: string[];
};

export type Mnemonic = {
  title: string;
  /** Akılda tutma cümlesi / kısaltma */
  hook: string;
  /** Açılımı */
  explanation: string;
};

export type Flashcard = {
  q: string;
  a: string;
};

export type Topic = {
  id: string;
  title: string;
  icon: IconName;
  color: string;
  summary: string;
  sections: Section[];
  /** Ebelik açısından klinik notlar */
  clinical?: string[];
  mnemonics?: Mnemonic[];
  cards: Flashcard[];
};

export type BodyView = 'front' | 'back';

export type Region = {
  id: string;
  name: string;
  latin: string;
  view: BodyView;
  /** Bölgenin vücuttaki yeri */
  location: string;
  /** Altında / içinde bulunan önemli yapılar */
  structures: string[];
  clinical?: string;
};
