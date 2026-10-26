import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { allCards, type DeckCard } from './decks';

/**
 * Leitner kutuları ile aralıklı tekrar:
 * 0 = hiç çalışılmadı, 1 = bilinmedi, 2-4 = öğreniliyor, 5 = ezberlendi.
 * "Bildim" kartı bir üst kutuya taşır, "Bilemedim" 1. kutuya geri gönderir.
 */
export const MAX_BOX = 5;
export const LEARNED_BOX = 3;

type ProgressState = {
  boxes: Record<string, number>;
  quizBest: Record<string, number>;
  streak: number;
  lastStudyDay: string | null;
};

const EMPTY: ProgressState = { boxes: {}, quizBest: {}, streak: 0, lastStudyDay: null };
const STORAGE_KEY = 'anatomi-progress-v1';

function dayKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function nextStreak(state: ProgressState): Pick<ProgressState, 'streak' | 'lastStudyDay'> {
  const today = dayKey();
  if (state.lastStudyDay === today) return { streak: state.streak, lastStudyDay: today };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const continued = state.lastStudyDay === dayKey(yesterday);
  return { streak: continued ? state.streak + 1 : 1, lastStudyDay: today };
}

type ProgressContextValue = {
  boxOf: (cardId: string) => number;
  rateCard: (cardId: string, known: boolean) => void;
  recordQuiz: (deckId: string, percent: number) => void;
  quizBest: (deckId: string) => number | undefined;
  /** Kart dizisindeki öğrenilmiş kartların oranı (0–1) */
  learnedRatio: (cards: DeckCard[]) => number;
  learnedCount: number;
  weakCards: DeckCard[];
  /** Gösterilecek seri: bugün veya dün çalışıldıysa geçerli */
  streak: number;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const rateCard = useCallback((cardId: string, known: boolean) => {
    setState((s) => {
      const current = s.boxes[cardId] ?? 0;
      const box = known ? Math.min(MAX_BOX, Math.max(current, 1) + 1) : 1;
      return { ...s, ...nextStreak(s), boxes: { ...s.boxes, [cardId]: box } };
    });
  }, []);

  const recordQuiz = useCallback((deckId: string, percent: number) => {
    setState((s) => ({
      ...s,
      ...nextStreak(s),
      quizBest: { ...s.quizBest, [deckId]: Math.max(s.quizBest[deckId] ?? 0, percent) },
    }));
  }, []);

  const reset = useCallback(() => setState(EMPTY), []);

  const value = useMemo<ProgressContextValue>(() => {
    const boxOf = (id: string) => state.boxes[id] ?? 0;
    const learnedRatio = (cards: DeckCard[]) =>
      cards.length === 0 ? 0 : cards.filter((c) => boxOf(c.id) >= LEARNED_BOX).length / cards.length;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const streakAlive = state.lastStudyDay === dayKey() || state.lastStudyDay === dayKey(yesterday);

    return {
      boxOf,
      rateCard,
      recordQuiz,
      quizBest: (deckId) => state.quizBest[deckId],
      learnedRatio,
      learnedCount: allCards.filter((c) => boxOf(c.id) >= LEARNED_BOX).length,
      weakCards: allCards.filter((c) => boxOf(c.id) === 1),
      streak: streakAlive ? state.streak : 0,
      reset,
    };
  }, [state, rateCard, recordQuiz, reset]);

  // Kayıtlı ilerleme yüklenmeden ekranları gösterme; böylece oturumlar doğru kutularla kurulur
  if (!ready) return null;
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
