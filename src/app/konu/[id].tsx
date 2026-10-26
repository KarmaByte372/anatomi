import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, IconBadge } from '@/components/ui';
import { getTopic } from '@/data/topics';
import type { Section } from '@/data/types';
import { colors, radius } from '@/theme';

export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = getTopic(id);

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
          <SectionBlock key={s.title} section={s} color={topic.color} initiallyOpen={i < 2} />
        ))}

        {topic.clinical && topic.clinical.length > 0 && (
          <Card style={[styles.box, { borderLeftColor: colors.accent }]}>
            <View style={styles.boxHeader}>
              <Ionicons name="medkit" size={18} color={colors.accent} />
              <Text style={[styles.boxTitle, { color: colors.accent }]}>Ebelik / klinik notlar</Text>
            </View>
            {topic.clinical.map((c) => (
              <Bullet key={c} text={c} color={colors.accent} />
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
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </>
  );
}

function SectionBlock({ section, color, initiallyOpen }: { section: Section; color: string; initiallyOpen: boolean }) {
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
  mnemonic: { gap: 3, paddingTop: 4 },
  mnemonicTitle: { fontWeight: '700', color: colors.text },
  mnemonicHook: { fontStyle: 'italic', color: colors.text, fontSize: 15, lineHeight: 21 },
  mnemonicExplanation: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});
