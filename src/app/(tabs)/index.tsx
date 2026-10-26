import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, IconBadge, ProgressBar, SectionTitle } from '@/components/ui';
import { topics } from '@/data/topics';
import type { IconName } from '@/data/types';
import { allCards, MIXED_DECK_ID, WEAK_DECK_ID } from '@/lib/decks';
import { useProgress } from '@/lib/progress';
import { dailyIndex } from '@/lib/random';
import { DEPARTMENTS, PRIORITY_TOPICS, useSettings } from '@/lib/settings';
import { colors, radius } from '@/theme';

const allMnemonics = topics.flatMap((t) => (t.mnemonics ?? []).map((m) => ({ ...m, topic: t })));

export default function HomeScreen() {
  const { learnedCount, weakCards, streak } = useProgress();
  const tip = allMnemonics[dailyIndex(allMnemonics.length)];
  const { department } = useSettings();
  const dep = department ?? 'ebelik';
  const priority = PRIORITY_TOPICS[dep].map((id) => topics.find((t) => t.id === id)!);
  const depLabel = DEPARTMENTS.find((d) => d.id === dep)!.label;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.hello}>Merhaba 👋</Text>
          <Pressable onPress={() => router.push('/ayarlar')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Ayarlar">
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>Bugün anatomiden ne çalışalım?</Text>

        <View style={styles.statsRow}>
          <Stat icon="flame" color={colors.warning} value={`${streak}`} label="gün seri" />
          <Stat icon="checkmark-circle" color={colors.success} value={`${learnedCount}`} label={`/ ${allCards.length} kart`} />
          <Stat icon="alert-circle" color={colors.danger} value={`${weakCards.length}`} label="zayıf kart" />
        </View>
        <ProgressBar value={learnedCount / allCards.length} color={colors.success} />

        <SectionTitle>Hızlı başla</SectionTitle>
        <View style={styles.grid}>
          <QuickAction
            icon="body"
            color={colors.primary}
            title="Vücut Haritası"
            text="1.000+ yapılı 3D anatomi modeli"
            onPress={() => router.navigate('/vucut')}
          />
          <QuickAction
            icon="albums"
            color={colors.accent}
            title="Karışık Kartlar"
            text="Tüm konulardan 20 kart"
            onPress={() => router.push(`/calis/${MIXED_DECK_ID}`)}
          />
          <QuickAction
            icon="refresh"
            color={colors.danger}
            title="Zayıf Kartlar"
            text={weakCards.length ? `${weakCards.length} kartı tekrar et` : 'Henüz zayıf kart yok'}
            onPress={() => router.push(`/calis/${WEAK_DECK_ID}`)}
          />
          <QuickAction
            icon="checkmark-done"
            color="#7C5CBF"
            title="Karışık Test"
            text="10 soruluk deneme"
            onPress={() => router.push(`/test/${MIXED_DECK_ID}`)}
          />
        </View>

        {tip && (
          <>
            <SectionTitle>Günün ezber ipucu</SectionTitle>
            <Card style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb" size={18} color={colors.warning} />
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              <Text style={styles.tipHook}>“{tip.hook}”</Text>
              <Text style={styles.tipExplanation}>{tip.explanation}</Text>
              <Pressable onPress={() => router.push(`/konu/${tip.topic.id}`)}>
                <Text style={[styles.link, { color: tip.topic.color }]}>{tip.topic.title} →</Text>
              </Pressable>
            </Card>
          </>
        )}

        <SectionTitle>{`${depLabel} için öncelikli konular`}</SectionTitle>
        {priority.map((t) => (
          <Pressable key={t.id} onPress={() => router.push(`/konu/${t.id}`)} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
            <Card style={styles.topicRow}>
              <IconBadge icon={t.icon} color={t.color} />
              <View style={{ flex: 1 }}>
                <Text style={styles.topicTitle}>{t.title}</Text>
                <Text style={styles.topicSummary} numberOfLines={2}>
                  {t.summary}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </Card>
          </Pressable>
        ))}
        <Pressable onPress={() => router.push('/akademisyen')} style={({ pressed }) => pressed && { opacity: 0.85 }}>
          <Card style={styles.academic}>
            <Ionicons name="school-outline" size={22} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.academicTitle}>Öğretim üyesi misiniz?</Text>
              <Text style={styles.academicText}>İçeriği inceleyin, düzenleme talep edin.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Card>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, color, value, label }: { icon: IconName; color: string; value: string; label: string }) {
  return (
    <Card style={styles.stat}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function QuickAction(props: { icon: IconName; color: string; title: string; text: string; onPress: () => void }) {
  return (
    <Pressable onPress={props.onPress} style={({ pressed }) => [styles.quick, pressed && { opacity: 0.85 }]}>
      <Card style={styles.quickCard}>
        <IconBadge icon={props.icon} color={props.color} size={40} />
        <Text style={styles.quickTitle}>{props.title}</Text>
        <Text style={styles.quickText}>{props.text}</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  academic: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, backgroundColor: colors.accentSoft },
  academicTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  academicText: { fontSize: 12, color: colors.muted, marginTop: 2 },
  hello: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.muted, marginTop: 4, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 2 },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quick: { width: '47%', flexGrow: 1 },
  quickCard: { gap: 6, minHeight: 130 },
  quickTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 4 },
  quickText: { fontSize: 12, color: colors.muted },
  tipCard: { gap: 8, borderLeftWidth: 4, borderLeftColor: colors.warning },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tipTitle: { fontWeight: '700', color: colors.text, fontSize: 15 },
  tipHook: { fontSize: 16, fontStyle: 'italic', color: colors.text, lineHeight: 22 },
  tipExplanation: { fontSize: 13, color: colors.muted, lineHeight: 19 },
  link: { fontWeight: '700', marginTop: 4 },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, borderRadius: radius.md },
  topicTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  topicSummary: { fontSize: 12, color: colors.muted, marginTop: 2 },
});
