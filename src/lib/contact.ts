import Constants from 'expo-constants';
import { Linking, Platform } from 'react-native';

export const CONTACT_EMAIL = 'duzenleme@digituva.com';
export const CONTACT_PHONE = '+90 850 307 3587';
const PHONE_DIAL = '+908503073587';

export const appVersion = Constants.expoConfig?.version ?? '1.0.0';

export type EditRequest = {
  /** Talep türü (Hata / düzeltme, Eksik içerik, Öneri) */
  kind: string;
  /** İçeriğin uygulamadaki yeri, ör. "Konu: Pelvis › Obstetrik çaplar" */
  location: string;
  /** İlgili içeriğin kendisi (kart sorusu, madde vb.) */
  excerpt?: string;
  message: string;
  name?: string;
  title?: string;
  institution?: string;
};

export function buildEditRequestMail(r: EditRequest): { subject: string; body: string } {
  const subject = `[Anatomi Rehberi] ${r.kind}: ${r.location}`;
  const lines = [
    `Talep türü: ${r.kind}`,
    `İçerik: ${r.location}`,
    r.excerpt ? `Mevcut metin: "${r.excerpt}"` : null,
    '',
    'Açıklama / önerilen düzeltme:',
    r.message,
    '',
    `Ad soyad: ${r.name || '-'}`,
    `Unvan: ${r.title || '-'}`,
    `Kurum / bölüm: ${r.institution || '-'}`,
    '',
    `Uygulama sürümü: ${appVersion} (${Platform.OS})`,
  ];
  return { subject, body: lines.filter((l) => l !== null).join('\n') };
}

export async function sendEditRequest(r: EditRequest): Promise<boolean> {
  const { subject, body } = buildEditRequestMail(r);
  const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export function callSupport() {
  return Linking.openURL(`tel:${PHONE_DIAL}`).catch(() => false);
}

export function emailSupport() {
  return Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('[Anatomi Rehberi] İletişim')}`).catch(() => false);
}
