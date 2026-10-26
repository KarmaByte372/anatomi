# Anatomi Rehberi

Ebelik, hemşirelik ve diğer sağlık bölümlerindeki öğrenciler için anatomi çalışma uygulaması (Expo / React Native). Hesap veya sunucu gerektirmez; tüm ilerleme cihazda saklanır.

## Neler var?

- **3D anatomi modeli**: Gerçek insan vücudu verisinden (BodyParts3D) üretilmiş, 1.000'den fazla ayrı yapıdan oluşan model: tüm kemikler, ~150 kas, kalp odacıkları ve kapakları, sindirim organları, damarlar, beyin kıvrımları, göz.
  - Katmanlar: deri (saydam/opak), kaslar, iskelet, organlar, damarlar, sinir sistemi — açıp kapatarak deriden kemiğe in.
  - Tek parmakla döndür, iki parmakla yakınlaştır/kaydır (webde fare tekerleği veya +/− düğmeleri).
  - Dokunduğun yapının Latince ve Türkçe adı, tarafı (sağ/sol) ve ilgili ders konusu görünür.
  - Arama (ör. "femur", "kalp", "levator") ve **röntgen modu**: seçilen yapı tek başına opak kalır, gerisi saydamlaşır.
  - *Adını bil* / *Yerini bul* oyunları açık katmanlardaki yapılarla oynanır.
- **Vücut bölgeleri (2D)**: Ön ve arka yüzde ~50 yüzey bölgesi (regio …) için şema ve aynı ezber oyunları.
- **Konular**: 16 ayrıntılı konu: terminoloji, iskelet, eklemler, kaslar, dolaşım, solunum, sindirim, üriner sistem, kadın üreme sistemi, pelvis ve pelvis tabanı, meme ve laktasyon, fetal dolaşım ve fetal kafatası, erkek üreme sistemi, sinir sistemi, endokrin sistem, duyu organları. Her konuda ebelik notları ve Türkçe ezber ipuçları var.
- **Kartlar**: 300'den fazla bilgi kartı, aralıklı tekrar (Leitner kutuları) ile çalışılır. "Zayıf kartlar" destesi bilemediklerini tekrar ettirir.
- **Test**: Konu testleri ve karışık deneme sınavı; yanlışları sonda gösterir ve en iyi skoru saklar.
- Ana sayfada günlük seri, ilerleme, "günün ezber ipucu" ve seçilen bölüme göre öncelikli konular (ilk açılışta bölüm seçilir).
- **Öğretim üyeleri için**: Akademisyen paneli ve akademisyen modu. Açıkken her konu bölümü, klinik not, ezber ipucu ve bilgi kartının yanında "Düzenleme talep et" görünür. Talep, içeriğin yeri ve mevcut metni eklenmiş olarak duzenleme@digituva.com adresine e-posta olarak hazırlanır; telefon: +90 850 307 3587. Öğrenciler de kart, test sorusu ve 3D isimlerinde "Hata bildir" diyebilir.
- Ayarlar: bölüm değiştirme, ilerlemeyi sıfırlama, iletişim, hakkında/lisanslar, gizlilik politikası.

İlerleme cihazda (AsyncStorage) saklanır, internet gerekmez.

## Çalıştırma

```bash
npm install
npx expo start
```

Telefonda **Expo Go** uygulamasıyla QR kodu okut. Web'de denemek için `npx expo start --web`.

Kontroller: `npm run typecheck`, `npm run lint` ve `npx expo-doctor`.

## Mağazaya yayın
- Adım adım rehber: [`docs/yayin-rehberi.md`](docs/yayin-rehberi.md) (EAS ile App Store + Google Play)
- Mağaza açıklamaları, anahtar kelimeler, veri güvenliği yanıtları: [`docs/magaza-metinleri.md`](docs/magaza-metinleri.md)
- Gizlilik politikası (web'de yayımlanmalı): [`docs/gizlilik-politikasi.md`](docs/gizlilik-politikasi.md)
- Paket kimliği: `com.digituva.anatomi` (iOS ve Android)

## Yapı

```
src/app/            Expo Router ekranları (sekmeler, konu, bölge, kart çalışma, test)
src/data/topics/    Konu içerikleri (bölümler, klinik notlar, ezber ipuçları, kartlar)
src/data/regions.ts Vücut bölgeleri
src/components/     3D model (three.js + expo-gl), 2D şema (SVG) ve ortak arayüz bileşenleri
src/lib/            Desteler, aralıklı tekrar/ilerleme, test oluşturma
```

### 3D veriyi yeniden üretmek

`assets/anatomy/*.bin` ve `src/data/anatomy3d.ts` betiklerle üretilir:

```bash
# BodyParts3D is-a arşivini ve isa_element_parts.txt dosyasını bir klasöre indir:
# https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/
python3 scripts/anatomy/classify.py <klasör> mapping.json   # parça → yapı (Latince/Türkçe isimler: scripts/anatomy/names.py)
node scripts/anatomy/build.mjs <klasör> mapping.json        # sadeleştirme + ikili dosyalar
```

3D veri: *BodyParts3D, © The Database Center for Life Science, CC BY 4.0*. Veri seti bir erkek bedenine dayandığı için kadın iç üreme organları modelde yoktur; bunlar konularda ve 2D şemada anlatılır.

Yeni bilgi eklemek için ilgili `src/data/topics/*.ts` dosyasındaki `cards` dizisine `{ q: 'Soru', a: 'Cevap' }` eklemek yeterli.

## Açık kaynak ve lisans

Anatomi Rehberi açık kaynaklıdır:
- **Kaynak kod**: MIT
- **Ders içeriği ve 3D veri** (`src/data/`, `assets/`): CC BY 4.0 — kaynak göstermek koşuluyla serbestçe kullanılabilir, değiştirilebilir, paylaşılabilir.

Ayrıntılar [`LICENSE`](LICENSE) dosyasında. Katkı vermek için [`CONTRIBUTING.md`](CONTRIBUTING.md); öğretim üyeleri içerik düzeltmelerini GitHub'daki **İçerik düzeltme** formuyla veya duzenleme@digituva.com adresiyle iletebilir.

> İçerik ders tekrarı içindir; sayısal değerler (pelvis çapları vb.) kaynaklara göre küçük farklar gösterebilir. Ders kitabın ve hocanın anlattıkları esastır.
