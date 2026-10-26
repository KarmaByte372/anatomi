import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, IconBadge, SectionTitle } from '@/components/ui';
import { decks, MIXED_DECK_ID } from '@/lib/decks';
import { useProgress } from '@/lib/progress';
import { QUIZ_SIZE } from '@/lib/session';
import { colors } from '@/theme';

function scoreColor(score: number | undefined): string {
  if (score === undefined) return colors.muted;
  if (score >= 80) return colors.success;
  if (score >= 50) return colors.warning;
  return colors.danger;
}

export default function QuizListScreen() {
  const { quizBest } = useProgress();
  const mixedBest = quizBest(MIXED_DECK_ID);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.push(`/test/${MIXED_DECK_ID}`)} style={({ pressed }) => pressed && { opacity: 0.9 }}>
        <Card style={styles.hero}>
          <Ionicons name="school" size={34} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Karışık deneme sınavı</Text>
            <Text style={styles.heroText}>
              Tüm konulardan {QUIZ_SIZE} çoktan seçmeli soru
              {mixedBest !== undefined ? ` · En iyi: %${mixedBest}` : ''}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </Card>
      </Pressable>

      <SectionTitle>Konu testleri</SectionTitle>
      {decks.map((d) => {
        const best = quizBest(d.id);
        return (
          <Pressable key={d.id} onPress={() => router.push(`/test/${d.id}`)} style={({ pressed }) => pressed && { opacity: 0.85 }}>
            <Card style={styles.row}>
              <IconBadge icon={d.icon} color={d.color} size={40} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{d.title}</Text>
                <Text style={styles.meta}>{Math.min(QUIZ_SIZE, d.cards.length)} soru</Text>
              </View>
              <View style={[styles.score, { borderColor: scoreColor(best) }]}>
                <Text style={[styles.scoreText, { color: scoreColor(best) }]}>{best !== undefined ? `%${best}` : '—'}</Text>
              </View>
            </Card>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 10 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#7C5CBF' },
  heroTitle: { color: '#fff', fontWeight: '800', fontSize: 17 },
  heroText: { color: '#ffffffd0', fontSize: 13, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontWeight: '700', color: colors.text, fontSize: 15 },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  score: { borderWidth: 2, borderRadius: 999, minWidth: 54, paddingVertical: 4, alignItems: 'center' },
  scoreText: { fontWeight: '800', fontSize: 13 },
});
