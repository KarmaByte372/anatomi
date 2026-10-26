import { allCards, getDeck, MIXED_DECK_ID, WEAK_DECK_ID, type DeckCard } from './decks';
import { sample, shuffle } from './random';

export const STUDY_SESSION_SIZE = 20;
export const QUIZ_SIZE = 10;

/** Deste id'sine göre kart havuzu (zayıf kartlar progress'ten gelir) */
export function cardPool(deckId: string, weakCards: DeckCard[]): DeckCard[] {
  if (deckId === MIXED_DECK_ID) return allCards;
  if (deckId === WEAK_DECK_ID) return weakCards;
  return getDeck(deckId)?.cards ?? [];
}

/** Düşük kutudaki (az bilinen) kartları öne alarak çalışma oturumu oluşturur */
export function buildStudySession(pool: DeckCard[], boxOf: (id: string) => number): DeckCard[] {
  return shuffle(pool)
    .sort((a, b) => boxOf(a.id) - boxOf(b.id))
    .slice(0, STUDY_SESSION_SIZE);
}

export type QuizQuestion = {
  card: DeckCard;
  options: string[];
};

/** Çeldiricileri önce aynı desteden, yetmezse tüm kartlardan seçer */
export function buildQuiz(pool: DeckCard[], size = QUIZ_SIZE): QuizQuestion[] {
  return sample(pool, size).map((card) => {
    const distractors = new Set<string>();
    const pick = (cards: DeckCard[]) => {
      for (const c of shuffle(cards)) {
        if (distractors.size >= 3) break;
        if (c.a !== card.a) distractors.add(c.a);
      }
    };
    pick(getDeck(card.deckId)?.cards ?? []);
    if (distractors.size < 3) pick(allCards);
    return { card, options: shuffle([card.a, ...distractors]) };
  });
}
