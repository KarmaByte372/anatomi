# Yayın Rehberi (App Store + Google Play)

Uygulama Expo (SDK 58) ile yazıldı ve EAS ile bulutta derlenip mağazalara gönderilir; Mac veya Android Studio gerekmez.

## 1. Hesaplar (bir kez)
| Ne | Ücret | Not |
|---|---|---|
| [Expo hesabı](https://expo.dev/signup) | Ücretsiz | EAS derlemeleri için |
| [Apple Developer Program](https://developer.apple.com/programs/) | Yıllık 99 USD | Şirket adına açılacaksa D-U-N-S numarası gerekir |
| [Google Play Console](https://play.google.com/console) | Tek seferlik 25 USD | Yeni kişisel hesaplarda yayından önce 12 test kullanıcısıyla 14 günlük kapalı test zorunludur; kurumsal hesapta bu şart yoktur |

## 2. Projeyi EAS'e bağla
```bash
npx eas-cli@latest login
npx eas-cli@latest init          # app.json'a projectId ekler
```

## 3. Kimlikler
`app.json` içinde:
- iOS `bundleIdentifier` ve Android `package`: **com.digituva.anatomi**. Mağazaya bir kez yüklendikten sonra değiştirilemez; farklı bir kimlik istiyorsanız ilk derlemeden önce değiştirin.
- Sürüm: `version` (kullanıcıya görünen, ör. 1.0.0). Derleme numaraları EAS tarafından otomatik artırılır (`eas.json` → `autoIncrement`).

## 4. Test derlemesi
```bash
npx eas-cli@latest build --profile preview --platform android   # telefona kurulabilen .apk
npx eas-cli@latest build --profile production --platform ios     # TestFlight için
```

## 5. Mağaza derlemesi ve gönderim
```bash
npx eas-cli@latest build --profile production --platform all
npx eas-cli@latest submit --platform ios
npx eas-cli@latest submit --platform android
```
Android'de ilk yükleme Play Console üzerinden elle yapılmalıdır (sonrakiler `eas submit` ile otomatik).

## 6. Mağaza kayıtları
- Metinler, anahtar kelimeler, veri güvenliği yanıtları: `docs/magaza-metinleri.md`
- Gizlilik politikası: `docs/gizlilik-politikasi.md` dosyasını web sitenizde yayımlayın ve URL'yi iki mağazaya girin.
- Ekran görüntüleri: `docs/magaza-metinleri.md` sonundaki listeye göre.

## 7. Güncellemeler
- İçerik düzeltmeleri (metin/kart değişiklikleri) için yeni derleme yerine EAS Update ile anında güncelleme gönderilebilir: `npx eas-cli@latest update --channel production` (önce `npx expo install expo-updates` ve `eas update:configure` gerekir).
- 3D veri değiştiyse `scripts/anatomy/` betikleriyle yeniden üretip yeni derleme alın.

## Yayın öncesi kontrol listesi
- [ ] `npx tsc --noEmit` ve `npx expo lint` temiz
- [ ] `npx expo-doctor` temiz
- [ ] Gerçek iOS ve Android cihazda: 3D model açılıyor, döndürme/yakınlaştırma akıcı, düzenleme talebi e-postası açılıyor, telefon araması açılıyor
- [ ] İçerik bir öğretim üyesince gözden geçirildi
- [ ] Gizlilik politikası URL'si yayında
- [ ] Ekran görüntüleri ve mağaza metinleri hazır
