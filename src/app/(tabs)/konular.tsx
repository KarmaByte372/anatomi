import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, IconBadge, ProgressBar } from '@/components/ui';
import { topics } from '@/data/topics';
import type { Topic } from '@/data/types';
import { getDeck } from '@/lib/decks';
import { useProgress } from '@/lib/progress';
import { DEPARTMENTS, PRIORITY_TOPICS, useSettings } from '@/lib/settings';
import { normalize } from '@/lib/text';
import { colors } from '@/theme';

function matches(topic: Topic, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  const haystack = [
    topic.title,
    topic.summary,
    ...topic.sections.flatMap((s) => [s.title, ...(s.body ?? []), ...(s.bullets ?? [])]),
    ...topic.cards.flatMap((c) => [c.q, c.a]),
  ].join(' ');
  return normalize(haystack).includes(q);
}

export default function TopicsScreen() {
  const [query, setQuery] = useState('');
  const { learnedRatio } = useProgress();
  const { department } = useSettings();
  const dep = department ?? 'ebelik';
  const badge = DEPARTMENTS.find((d) => d.id === dep)!.label.split(' ')[0].toLocaleUpperCase('tr');
  const data = topics.filter((t) => matches(t, query.trim()));

  return (
    <FlatList
      data={data}
      keyExtractor={(t) => t.id}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Konu veya terim ara (ör. uterus, diafram)"
            placeholderTextColor={colors.muted}
            style={styles.input}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>“{query}” için sonuç bulunamadı.</Text>}
      renderItem={({ item }) => {
        const ratio = learnedRatio(getDeck(item.id)?.cards ?? []);
        return (
          <Pressable onPress={() => router.push(`/konu/${item.id}`)} style={({ pressed }) => pressed && { opacity: 0.85 }}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <IconBadge icon={item.icon} color={item.color} />
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    {PRIORITY_TOPICS[dep].includes(item.id) && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.summary} numberOfLines={2}>
                    {item.summary}
                  </Text>
                </View>
              </View>
              <View style={styles.progressRow}>
                <View style={{ flex: 1 }}>
                  <ProgressBar value={ratio} color={item.color} />
                </View>
                <Text style={styles.progressText}>%{Math.round(ratio * 100)}</Text>
              </View>
            </Card>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 12 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  input: { flex: 1, paddingVertical: 11, fontSize: 15, color: colors.text },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 30 },
  card: { gap: 12 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, flexShrink: 1 },
  badge: { backgroundColor: colors.primarySoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800', color: colors.primary },
  summary: { fontSize: 13, color: colors.muted, marginTop: 2, lineHeight: 18 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressText: { fontSize: 12, color: colors.muted, width: 36, textAlign: 'right' },
});
