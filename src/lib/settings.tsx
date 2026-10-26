import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Department = 'ebelik' | 'hemsirelik' | 'diger';

export const DEPARTMENTS: { id: Department; label: string; description: string }[] = [
  { id: 'ebelik', label: 'Ebelik', description: 'Pelvis, kadın üreme sistemi, fetal dolaşım ve doğum anatomisi öne çıkar.' },
  { id: 'hemsirelik', label: 'Hemşirelik', description: 'Dolaşım, solunum, enjeksiyon bölgeleri ve klinik uygulamalar öne çıkar.' },
  { id: 'diger', label: 'Diğer sağlık bölümleri', description: 'Fizyoterapi, paramedik, sağlık teknikerliği vb. için kas-iskelet ve sinir sistemi öne çıkar.' },
];

/** Bölüme göre ana sayfada öne çıkan konular */
export const PRIORITY_TOPICS: Record<Department, string[]> = {
  ebelik: ['pelvis', 'kadin-ureme', 'meme', 'fetal'],
  hemsirelik: ['dolasim', 'solunum', 'kas', 'uriner'],
  diger: ['iskelet', 'kas', 'eklemler', 'sinir'],
};

type Settings = {
  department: Department | null;
  /** Akademisyen modu: içerik üzerinde "Düzenleme talep et" düğmeleri görünür */
  reviewerMode: boolean;
};

const DEFAULTS: Settings = { department: null, reviewerMode: false };
const STORAGE_KEY = 'anatomi-settings-v1';

type SettingsContextValue = Settings & {
  setDepartment: (d: Department) => void;
  setReviewerMode: (on: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => {});
  }, [settings, ready]);

  const setDepartment = useCallback((department: Department) => setSettings((s) => ({ ...s, department })), []);
  const setReviewerMode = useCallback((reviewerMode: boolean) => setSettings((s) => ({ ...s, reviewerMode })), []);

  const value = useMemo(() => ({ ...settings, setDepartment, setReviewerMode }), [settings, setDepartment, setReviewerMode]);

  if (!ready) return null;
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
