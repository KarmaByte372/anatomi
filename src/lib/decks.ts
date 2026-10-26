import { topics } from '@/data/topics';
import { regions } from '@/data/regions';
import type { IconName } from '@/data/types';

export type DeckCard = {
  id: string;
  deckId: string;
  q: string;
  a: string;
};

export type Deck = {
  id: string;
  title: string;
  color: string;
  icon: IconName;
  cards: DeckCard[];
};

const topicDecks: Deck[] = topics.map((t) => ({
  id: t.id,
  title: t.title,
  color: t.color,
  icon: t.icon,
  cards: t.cards.map((c, i) => ({ id: `${t.id}-${i}`, deckId: t.id, q: c.q, a: c.a })),
}));

const regionDeck: Deck = {
  id: 'bolgeler',
  title: 'Vücut Bölgeleri (Latince)',
  color: '#AD7A5C',
  icon: 'man-outline',
  cards: regions.map((r) => ({
    id: `bolgeler-${r.id}`,
    deckId: 'bolgeler',
    q: `${r.latin} hangi bölgedir?`,
    a: r.name,
  })),
};

export const decks: Deck[] = [regionDeck, ...topicDecks];

export const allCards: DeckCard[] = decks.flatMap((d) => d.cards);

/** Özel desteler: tüm kartlar karışık ve zayıf kartlar (tekrar) */
export const MIXED_DECK_ID = 'karisik';
export const WEAK_DECK_ID = 'zayif';

export function getDeck(id: string): Deck | undefined {
  return decks.find((d) => d.id === id);
}

export function deckTitle(id: string): string {
  if (id === MIXED_DECK_ID) return 'Karışık (tüm konular)';
  if (id === WEAK_DECK_ID) return 'Zayıf kartlarım';
  return getDeck(id)?.title ?? 'Deste';
}
