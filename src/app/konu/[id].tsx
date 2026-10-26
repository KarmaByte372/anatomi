import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EditRequestButton } from '@/components/EditRequestButton';
import { Button, Card, IconBadge } from '@/components/ui';
import { getTopic } from '@/data/topics';
import type { Section } from '@/data/types';
import { useSettings } from '@/lib/settings';
import { colors, radius } from '@/theme';

export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = getTopic(id);
  const { reviewerMode } = useSettings();

  if (!topic) {
    return (
      <View style={styles.center}>
        <Text>Konu bulunamadı.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: topic.title }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, { backgroundColor: topic.color + '18' }]}>
          <IconBadge icon={topic.icon} color={topic.color} size={52} />
          <Text style={styles.heroTitle}>{topic.title}</Text>
          <Text style={styles.heroSummary}>{topic.summary}</Text>
          <View style={styles.actions}>
            <Button
              title={`Kartlar (${topic.cards.length})`}
              icon="albums-outline"
              color={topic.color}
              onPress={() => router.push(`/calis/${topic.id}`)}
              style={{ flex: 1 }}
            />
            <Button
              title="Test çöz"
              icon="checkmark-done-outline"
              variant="secondary"
              color={topic.color}
              onPress={() => router.push(`/test/${topic.id}`)}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {topic.sections.map((s, i) => (
          <SectionBlock key={s.title} section={s} color={topic.color} initiallyOpen={reviewerMode || i < 2} topicTitle={topic.title} />
        ))}

        {topic.clinical && topic.clinical.length > 0 && (
          <Card style={[styles.box, { borderLeftColor: colors.accent }]}>
            <View style={styles.boxHeader}>
              <Ionicons name="medkit" size={18} color={colors.accent} />
              <Text style={[styles.boxTitle, { color: colors.accent }]}>Klinik notlar</Text>
            </View>
            {topic.clinical.map((c) => (
              <View key={c}>
                <Bullet text={c} color={colors.accent} />
                <EditRequestButton location={`${topic.title} › Klinik notlar`} excerpt={c} />
              </View>
            ))}
          </Card>
        )}

        {topic.mnemonics && topic.mnemonics.length > 0 && (
          <Card style={[styles.box, { borderLeftColor: colors.warning }]}>
            <View style={styles.boxHeader}>
              <Ionicons name="bulb" size={18} color={colors.warning} />
              <Text style={[styles.boxTitle, { color: colors.warning }]}>Ezber ipuçları</Text>
            </View>
            {topic.mnemonics.map((m) => (
              <View key={m.title} style={styles.mnemonic}>
                <Text style={styles.mnemonicTitle}>{m.title}</Text>
                <Text style={styles.mnemonicHook}>“{m.hook}”</Text>
                <Text style={styles.mnemonicExplanation}>{m.explanation}</Text>
                <EditRequestButton location={`${topic.title} › Ezber ipucu: ${m.title}`} excerpt={`${m.hook} — ${m.explanation}`} />
              </View>
            ))}
          </Card>
        )}
        {reviewerMode && (
          <Card style={[styles.box, { borderLeftColor: topic.color }]}>
            <View style={styles.boxHeader}>
              <Ionicons name="albums-outline" size={18} color={topic.color} />
              <Text style={[styles.boxTitle, { color: topic.color }]}>Bilgi kartları ({topic.cards.length})</Text>
            </View>
            {topic.cards.map((c, i) => (
              <View key={c.q} style={styles.reviewCard}>
                <Text style={styles.reviewQ}>
                  {i + 1}. {c.q}
                </Text>
                <Text style={styles.reviewA}>{c.a}</Text>
                <EditRequestButton location={`${topic.title} › Kart ${i + 1}`} excerpt={`${c.q} → ${c.a}`} />
              </View>
            ))}
          </Card>
        )}

        <View style={styles.footer}>
          <EditRequestButton always location={topic.title} label="İçerikte hata mı gördün? Bildir" />
        </View>
      </ScrollView>
    </>
  );
}

function SectionBlock({ section, color, initiallyOpen, topicTitle }: { section: Section; color: string; initiallyOpen: boolean; topicTitle: string }) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <Card style={styles.section}>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.sectionHeader}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
      </Pressable>
      {open && (
        <View style={styles.sectionBody}>
          {section.body?.map((p) => (
            <Text key={p} style={styles.paragraph}>
              {p}
            </Text>
          ))}
          {section.bullets?.map((b) => (
            <Bullet key={b} text={b} color={color} />
          ))}
          <EditRequestButton location={`${topicTitle} › ${section.title}`} />
        </View>
      )}
    </Card>
  );
}

/** "Terim: açıklama" biçimindeki maddelerde terimi kalın gösterir */
function Bullet({ text, color }: { text: string; color: string }) {
  const idx = text.indexOf(': ');
  const hasTerm = idx > 0 && idx < 60;
  return (
    <View style={styles.bullet}>
      <View style={[styles.bulletDot, { backgroundColor: color }]} />
      <Text style={styles.bulletText}>
        {hasTerm ? (
          <>
            <Text style={styles.bold}>{text.slice(0, idx)}</Text>
            {text.slice(idx)}
          </>
        ) : (
          text
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, paddingBottom: 48, gap: 12 },
  hero: { borderRadius: radius.lg, padding: 18, gap: 8 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 4 },
  heroSummary: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  section: { paddingVertical: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  sectionBody: { paddingBottom: 10, gap: 8 },
  paragraph: { fontSize: 15, lineHeight: 22, color: colors.text },
  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  bulletText: { flex: 1, fontSize: 15, lineHeight: 22, color: colors.text },
  bold: { fontWeight: '700' },
  box: { gap: 10, borderLeftWidth: 4 },
  boxHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  boxTitle: { fontSize: 15, fontWeight: '800' },
  reviewCard: { gap: 2, paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  reviewQ: { fontWeight: '700', color: colors.text, fontSize: 14 },
  reviewA: { color: colors.muted, fontSize: 14 },
  footer: { alignItems: 'center', marginTop: 4 },
  mnemonic: { gap: 3, paddingTop: 4 },
  mnemonicTitle: { fontWeight: '700', color: colors.text },
  mnemonicHook: { fontStyle: 'italic', color: colors.text, fontSize: 15, lineHeight: 21 },
  mnemonicExplanation: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});
