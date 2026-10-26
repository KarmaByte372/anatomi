import { ScrollView, StyleSheet, Text } from 'react-native';

import { Card, SectionTitle } from '@/components/ui';
import { appVersion, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/contact';
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
          BodyParts3D, © The Database Center for Life Science, Creative Commons Atıf 4.0 Uluslararası (CC BY 4.0) lisansı ile kullanılmıştır.
          Model, mobil cihazlarda çalışması için sadeleştirilmiş ve yapı isimleri Latince/Türkçe olarak eşlenmiştir. Veri seti erkek bir bedene
          dayandığından kadın iç üreme organlarını içermez.
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
