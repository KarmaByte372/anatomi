import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnatomyModel } from '@/data/anatomyTypes';
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

export type ModelDetail = 'yuksek' | 'standart';

export const MODEL_DETAILS: { id: ModelDetail; label: string; description: string }[] = [
  { id: 'yuksek', label: 'Yüksek (önerilen)', description: 'En ince ayrıntı: 2,7 milyon üçgen, gerçekçi gölgeler ve kas lifleri. Yeni telefonlar için.' },
  { id: 'standart', label: 'Standart', description: 'Daha hafif model. Eski veya yavaş telefonlarda akıcı döner, daha az pil harcar.' },
];

type Settings = {
  department: Department | null;
  /** 3D model detayı; yüksek detayda kapanan cihazlarda otomatik olarak standarda iner */
  modelDetail: ModelDetail;
  /** 3D beden (kadın/erkek); seçilmediyse bölüme göre (ebelikte kadın) */
  bodyModel: AnatomyModel | null;
  /** Akademisyen modu: içerik üzerinde "Düzenleme talep et" düğmeleri görünür */
  reviewerMode: boolean;
};

const DEFAULTS: Settings = { department: null, modelDetail: 'yuksek', bodyModel: null, reviewerMode: false };
const STORAGE_KEY = 'anatomi-settings-v1';

type SettingsContextValue = Settings & {
  setDepartment: (d: Department) => void;
  setReviewerMode: (on: boolean) => void;
  setModelDetail: (d: ModelDetail) => void;
  setBodyModel: (m: AnatomyModel) => void;
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
  const setModelDetail = useCallback((modelDetail: ModelDetail) => setSettings((s) => ({ ...s, modelDetail })), []);
  const setBodyModel = useCallback((bodyModel: AnatomyModel) => setSettings((s) => ({ ...s, bodyModel })), []);

  const value = useMemo(
    () => ({ ...settings, setDepartment, setReviewerMode, setModelDetail, setBodyModel }),
    [settings, setDepartment, setReviewerMode, setModelDetail, setBodyModel],
  );

  if (!ready) return null;
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
