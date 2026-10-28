import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Card, SectionTitle } from '@/components/ui';
import { appVersion, CONTACT_EMAIL, CONTACT_PHONE, openUrl, REPO_URL } from '@/lib/contact';
import { colors } from '@/theme';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Anatomi Rehberi</Text>
        <Text style={styles.p}>
          Ebelik, hemşirelik ve diğer sağlık bölümlerindeki öğrencilerin anatomi dersine çalışması için hazırlanmış bir tekrar uygulamasıdır: konu
          anlatımları, klinik notlar, ezber ipuçları, aralıklı tekrarlı bilgi kartları, testler ve 3D anatomi modeli içerir.
        </Text>
        <Text style={styles.meta}>Sürüm {appVersion}</Text>
      </Card>

      <SectionTitle>Açık kaynak</SectionTitle>
      <Card style={styles.card}>
        <Text style={styles.p}>
          Anatomi Rehberi açık kaynaklıdır. Kaynak kodu MIT, ders içeriği ve 3D veri CC BY 4.0 lisansıyla yayımlanır: kaynak göstermek koşuluyla
          kullanabilir, değiştirebilir ve paylaşabilirsiniz. Katkılarınızı bekliyoruz.
        </Text>
        <Pressable onPress={() => openUrl(REPO_URL)} accessibilityRole="link">
          <Text style={styles.contact}>{REPO_URL.replace('https://', '')}</Text>
        </Pressable>
      </Card>

      <SectionTitle>Önemli uyarı</SectionTitle>
      <Card style={[styles.card, styles.warning]}>
        <Text style={styles.p}>
          Bu uygulama eğitim amaçlıdır ve ders kitabının ya da öğretim üyelerinin anlatımının yerini tutmaz. Sayısal değerler (ör. pelvis çapları)
          kaynaklara göre küçük farklılıklar gösterebilir; sınavlarda dersinizin kaynakları esastır. Klinik karar vermek için kullanılmamalıdır.
        </Text>
      </Card>

      <SectionTitle>Kaynaklar ve lisanslar</SectionTitle>
      <Card style={styles.card}>
        <Text style={styles.h}>3D anatomi modeli</Text>
        <Text style={styles.p}>
          Erkek model: BodyParts3D, © The Database Center for Life Science, Creative Commons Atıf 4.0 Uluslararası (CC BY 4.0) lisansı ile
          kullanılmıştır. Model, mobil cihazlarda çalışması için sadeleştirilmiş ve yapı isimleri Latince/Türkçe olarak eşlenmiştir.
        </Text>
        <Text style={styles.p}>
          Kadın model: Kemik yapısı ve beden şekli ABD Ulusal Tıp Kütüphanesi Visible Human Projesi&apos;nin kadın bağışçısından alınmıştır.
          İskelet: BoneHub – Visible Human 3D Models (H. Alavi, M. Asseln, Twente Üniversitesi; Andreassen ve ark. 2023, Denver Üniversitesi), CC BY 4.0.
          Rahim, tüpler, yumurtalıklar, rahim bağları, vajina, meme ve deri: Human Reference Atlas (HuBMAP; K. Browne, H. Schlehlein), CC BY 4.0.
          Kaslar, damarlar, sinirler ve diğer organlar erkek modelden kadın iskeletine uyarlanmıştır; şekilleri yaklaşık olarak kabul edilmelidir.
        </Text>
        <Text style={styles.h}>Terminoloji</Text>
        <Text style={styles.p}>Latince isimlerde Terminologia Anatomica esas alınmıştır.</Text>
        <Text style={styles.h}>Açık kaynak yazılımlar</Text>
        <Text style={styles.p}>Expo, React Native, three.js (MIT), Ionicons (MIT) ve diğer açık kaynak kütüphaneler kullanılmıştır.</Text>
      </Card>

      <SectionTitle>İletişim</SectionTitle>
      <Card style={styles.card}>
        <Text style={styles.p}>İçerik düzeltmeleri ve öneriler için:</Text>
        <Text style={styles.contact}>{CONTACT_EMAIL}</Text>
        <Text style={styles.contact}>{CONTACT_PHONE}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48 },
  card: { gap: 8 },
  warning: { borderLeftWidth: 4, borderLeftColor: colors.warning },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  h: { fontSize: 14, fontWeight: '800', color: colors.text, marginTop: 4 },
  p: { fontSize: 14, color: colors.text, lineHeight: 21 },
  meta: { fontSize: 12, color: colors.muted },
  contact: { fontSize: 15, fontWeight: '700', color: colors.primary },
});
