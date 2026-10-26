import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button, Card, IconBadge, SectionTitle } from '@/components/ui';
import { topics } from '@/data/topics';
import { callSupport, CONTACT_EMAIL, CONTACT_PHONE, emailSupport, ISSUE_URL, openUrl } from '@/lib/contact';
import { useSettings } from '@/lib/settings';
import { colors } from '@/theme';

export default function ReviewerScreen() {
  const { reviewerMode, setReviewerMode } = useSettings();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.hero}>
        <Ionicons name="school" size={32} color={colors.accent} />
        <Text style={styles.heroTitle}>Öğretim üyeleri için içerik inceleme</Text>
        <Text style={styles.heroText}>
          Uygulamadaki konu anlatımları, klinik notlar, bilgi kartları, test soruları ve 3D model isimleri öğretim üyelerinin incelemesine açıktır.
          Düzeltilmesini veya eklenmesini istediğiniz her kısım için düzenleme talebi gönderebilirsiniz.
        </Text>
      </Card>

      <Card style={styles.toggleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.toggleTitle}>Akademisyen modu</Text>
          <Text style={styles.toggleText}>Açıkken her bölümün, kartın, test sorusunun ve 3D yapının yanında “Düzenleme talep et” bağlantısı görünür.</Text>
        </View>
        <Switch
          value={reviewerMode}
          onValueChange={setReviewerMode}
          trackColor={{ true: colors.accent, false: colors.border }}
          accessibilityLabel="Akademisyen modu"
        />
      </Card>

      <SectionTitle>Nasıl çalışır?</SectionTitle>
      <Card style={{ gap: 10 }}>
        <Step n={1} text="Akademisyen modunu açın ve incelemek istediğiniz konuya girin." />
        <Step n={2} text="Hatalı veya eksik gördüğünüz kısmın altındaki “Düzenleme talep et” bağlantısına dokunun." />
        <Step n={3} text="Önerinizi yazın. İçeriğin yeri ve mevcut metni e-postaya otomatik eklenir." />
        <Step n={4} text="Talepler ekibimizce değerlendirilir ve bir sonraki güncellemede uygulamaya yansıtılır." />
      </Card>

      <SectionTitle>İletişim</SectionTitle>
      <Card style={{ gap: 10 }}>
        <Pressable onPress={emailSupport} style={styles.contact} accessibilityRole="link">
          <Ionicons name="mail-outline" size={20} color={colors.primary} />
          <Text style={styles.contactText}>{CONTACT_EMAIL}</Text>
        </Pressable>
        <Pressable onPress={callSupport} style={styles.contact} accessibilityRole="link">
          <Ionicons name="call-outline" size={20} color={colors.primary} />
          <Text style={styles.contactText}>{CONTACT_PHONE}</Text>
        </Pressable>
        <Pressable onPress={() => openUrl(ISSUE_URL)} style={styles.contact} accessibilityRole="link">
          <Ionicons name="logo-github" size={20} color={colors.primary} />
          <Text style={styles.contactText}>GitHub üzerinden düzeltme bildir</Text>
        </Pressable>
        <Button title="Genel düzenleme talebi gönder" icon="create-outline" variant="secondary" onPress={() => router.push('/duzenleme')} />
      </Card>

      <SectionTitle>Konuları incele</SectionTitle>
      {topics.map((t) => (
        <Pressable
          key={t.id}
          onPress={() => {
            setReviewerMode(true);
            router.push(`/konu/${t.id}`);
          }}
          style={({ pressed }) => pressed && { opacity: 0.85 }}
        >
          <Card style={styles.topic}>
            <IconBadge icon={t.icon} color={t.color} size={36} />
            <View style={{ flex: 1 }}>
              <Text style={styles.topicTitle}>{t.title}</Text>
              <Text style={styles.topicMeta}>
                {t.sections.length} bölüm · {t.cards.length} kart · {t.mnemonics?.length ?? 0} ezber ipucu
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{n}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48, gap: 10 },
  hero: { gap: 8, alignItems: 'flex-start' },
  heroTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  heroText: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  toggleText: { fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 17 },
  step: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 12, fontWeight: '800', color: colors.accent },
  stepText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  contact: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  contactText: { fontSize: 15, fontWeight: '700', color: colors.text },
  topic: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  topicTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  topicMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
});
