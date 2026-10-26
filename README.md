# Anatomi Rehberi

Ebelik öğrencileri için anatomi çalışma uygulaması (Expo / React Native).

## Neler var?

- **Vücut haritası**: Ön ve arka yüzde ~50 bölgeye dokunarak Latince ve Türkçe adını, altındaki yapıları ve ebelik/klinik notlarını gör.
  - *Adını bil*: Vurgulanan bölgenin adını 4 seçenek arasından bul.
  - *Yerini bul*: Adı verilen bölgeye haritada dokun.
- **Konular**: 16 ayrıntılı konu: terminoloji, iskelet, eklemler, kaslar, dolaşım, solunum, sindirim, üriner sistem, kadın üreme sistemi, pelvis ve pelvis tabanı, meme ve laktasyon, fetal dolaşım ve fetal kafatası, erkek üreme sistemi, sinir sistemi, endokrin sistem, duyu organları. Her konuda ebelik notları ve Türkçe ezber ipuçları var.
- **Kartlar**: 300'den fazla bilgi kartı, aralıklı tekrar (Leitner kutuları) ile çalışılır. "Zayıf kartlar" destesi bilemediklerini tekrar ettirir.
- **Test**: Konu testleri ve karışık deneme sınavı; yanlışları sonda gösterir ve en iyi skoru saklar.
- Ana sayfada günlük seri, ilerleme ve "günün ezber ipucu".

İlerleme cihazda (AsyncStorage) saklanır, internet gerekmez.

## Çalıştırma

```bash
npm install
npx expo start
```

Telefonda **Expo Go** uygulamasıyla QR kodu okut. Web'de denemek için `npx expo start --web`.

Kontroller: `npm run typecheck` ve `npm run lint`.

## Yapı

```
src/app/            Expo Router ekranları (sekmeler, konu, bölge, kart çalışma, test)
src/data/topics/    Konu içerikleri (bölümler, klinik notlar, ezber ipuçları, kartlar)
src/data/regions.ts Vücut bölgeleri
src/components/     Vücut haritası (SVG) ve ortak arayüz bileşenleri
src/lib/            Desteler, aralıklı tekrar/ilerleme, test oluşturma
```

Yeni bilgi eklemek için ilgili `src/data/topics/*.ts` dosyasındaki `cards` dizisine `{ q: 'Soru', a: 'Cevap' }` eklemek yeterli.

> İçerik ders tekrarı içindir; sayısal değerler (pelvis çapları vb.) kaynaklara göre küçük farklar gösterebilir. Ders kitabın ve hocanın anlattıkları esastır.
