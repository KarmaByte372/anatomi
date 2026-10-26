import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Platform } from 'react-native';

import { appVersion, CONTACT_EMAIL } from './contact';

/**
 * 3D görüntüleyici için çökme koruması ve hata raporlama.
 *
 * - 3D başlatılmadan önce "bekliyor" işareti yazılır, ilk kare çizilince silinir.
 *   İşaret bir sonraki açılışta hâlâ duruyorsa uygulama 3D açılırken kapanmıştır
 *   (yerel çökme); bu durumda 3D otomatik açılmaz.
 * - Uygulamayı kapatan JS hataları kaydedilir ve rapora eklenir.
 */
const PENDING_KEY = 'anatomi-3d-pending';
const LAST_ERROR_KEY = 'anatomi-last-error';

export async function mark3DPending() {
  await AsyncStorage.setItem(PENDING_KEY, String(Date.now())).catch(() => {});
}

export async function clear3DPending() {
  await AsyncStorage.removeItem(PENDING_KEY).catch(() => {});
}

export async function did3DCrashLastTime(): Promise<boolean> {
  return (await AsyncStorage.getItem(PENDING_KEY).catch(() => null)) !== null;
}

export async function recordError(error: unknown, context: string) {
  const e = error instanceof Error ? error : new Error(String(error));
  const text = `[${context}] ${e.name}: ${e.message}\n${(e.stack ?? '').split('\n').slice(0, 8).join('\n')}`;
  await AsyncStorage.setItem(LAST_ERROR_KEY, text).catch(() => {});
}

export async function getLastError(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_ERROR_KEY).catch(() => null);
}

export function errorText(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

function deviceInfo(): string {
  const c = Platform.constants as { Model?: string; Manufacturer?: string; Release?: string } | undefined;
  const model = [c?.Manufacturer, c?.Model].filter(Boolean).join(' ');
  return `${Platform.OS} ${c?.Release ?? Platform.Version}${model ? ` · ${model}` : ''}`;
}

/** Hata raporunu e-posta taslağı olarak açar */
export async function sendErrorReport(details: string) {
  const last = await getLastError();
  const body = [
    'Uygulamada bir hata oluştu. (İsterseniz ne yaparken olduğunu buraya yazın.)',
    '',
    `Sürüm: ${appVersion}`,
    `Cihaz: ${deviceInfo()}`,
    '',
    'Hata:',
    details,
    last && last !== details ? `\nSon kaydedilen hata:\n${last}` : '',
  ].join('\n');
  const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('[Anatomi Rehberi] Hata raporu')}&body=${encodeURIComponent(body)}`;
  return Linking.openURL(url).catch(() => false);
}

type ErrorUtilsType = {
  getGlobalHandler: () => (error: unknown, isFatal?: boolean) => void;
  setGlobalHandler: (handler: (error: unknown, isFatal?: boolean) => void) => void;
};

let installed = false;

/** Uygulamayı kapatacak JS hatalarını, kapanmadan önce kaydeder */
export function installGlobalErrorRecorder() {
  const eu = (globalThis as { ErrorUtils?: ErrorUtilsType }).ErrorUtils;
  if (installed || !eu) return;
  installed = true;
  const previous = eu.getGlobalHandler();
  eu.setGlobalHandler((error, isFatal) => {
    if (!isFatal) {
      previous(error, isFatal);
      return;
    }
    recordError(error, 'fatal').finally(() => previous(error, isFatal));
  });
}
