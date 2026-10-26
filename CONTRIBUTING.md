# Katkıda bulunma

Anatomi Rehberi açık kaynaklıdır; öğretim üyelerinin, öğrencilerin ve geliştiricilerin katkılarına açıktır.

## Öğretim üyeleri: içerik düzeltmeleri
Kod bilmeniz gerekmez. Üç yol var:
1. **Uygulamadan**: Ayarlar › Akademisyen paneli › Akademisyen modunu açın; her bölümün altındaki “Düzenleme talep et” bağlantısı içeriğin yerini ekleyerek e-posta hazırlar.
2. **GitHub'dan**: [Issues › New issue › İçerik düzeltme](../../issues/new/choose) formunu doldurun.
3. **E-posta / telefon**: duzenleme@digituva.com · +90 850 307 3587

Lütfen mümkünse kaynak belirtin (ders kitabı, sayfa).

## İçerik nerede?
| İçerik | Dosya |
|---|---|
| Konu anlatımları, klinik notlar, ezber ipuçları, kartlar | `src/data/topics/*.ts` |
| 2D vücut bölgeleri | `src/data/regions.ts` |
| 3D yapıların Latince/Türkçe isimleri | `scripts/anatomy/names.py` (ardından 3D veriyi yeniden üretin, bkz. README) |

Kart eklemek için ilgili konunun `cards` dizisine `{ q: 'Soru', a: 'Cevap' }` eklemek yeterlidir. Test seçenekleri aynı konudaki diğer cevaplardan üretildiği için cevapları kısa ve aynı biçimde tutun.

## Geliştiriciler
```bash
npm install
npx expo start          # Expo Go ile telefonda dene
npx tsc --noEmit        # tip kontrolü
npx expo lint           # lint
```
- Paket eklerken `npx expo install <paket>` kullanın (SDK ile uyumlu sürüm).
- Rotalar `src/app/` altında (Expo Router); diğer kodlar `src/components`, `src/lib`.
- Pull request açmadan önce tip kontrolü ve lint temiz olmalı.

## Lisans
Katkılarınız, kod için MIT, içerik için CC BY 4.0 lisansıyla yayımlanır (bkz. `LICENSE`).
