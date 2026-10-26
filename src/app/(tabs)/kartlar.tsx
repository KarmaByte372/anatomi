import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, IconBadge, ProgressBar, SectionTitle } from '@/components/ui';
import { allCards, decks, MIXED_DECK_ID, WEAK_DECK_ID } from '@/lib/decks';
import { LEARNED_BOX, useProgress } from '@/lib/progress';
import { colors } from '@/theme';

export default function CardsScreen() {
  const { learnedRatio, weakCards, boxOf } = useProgress();
  const unseen = allCards.filter((c) => boxOf(c.id) === 0).length;
  const learning = allCards.filter((c) => boxOf(c.id) > 1 && boxOf(c.id) < LEARNED_BOX).length;
  const learned = allCards.filter((c) => boxOf(c.id) >= LEARNED_BOX).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.explain}>
        <Text style={styles.explainTitle}>Nasıl çalışır?</Text>
        <Text style={styles.explainText}>
          Kartın önündeki soruyu oku, cevabı aklından söyle, sonra kartı çevir. Bildiysen “Bildim”e bas — kart bir üst kutuya geçer ve daha seyrek
          gelir. Bilemediysen kart başa döner ve sık sık karşına çıkar (aralıklı tekrar).
        </Text>
        <View style={styles.legend}>
          <Legend color={colors.border} label={`Yeni ${unseen}`} />
          <Legend color={colors.danger} label={`Zayıf ${weakCards.length}`} />
          <Legend color={colors.warning} label={`Öğreniliyor ${learning}`} />
          <Legend color={colors.success} label={`Öğrenildi ${learned}`} />
        </View>
      </Card>

      <View style={styles.row}>
        <BigButton icon="shuffle" color={colors.accent} title="Karışık" text="Tüm konulardan" onPress={() => router.push(`/calis/${MIXED_DECK_ID}`)} />
        <BigButton
          icon="refresh"
          color={colors.danger}
          title="Zayıflar"
          text={`${weakCards.length} kart`}
          onPress={() => router.push(`/calis/${WEAK_DECK_ID}`)}
        />
      </View>

      <SectionTitle>Desteler</SectionTitle>
      {decks.map((d) => {
        const ratio = learnedRatio(d.cards);
        return (
          <Pressable key={d.id} onPress={() => router.push(`/calis/${d.id}`)} style={({ pressed }) => pressed && { opacity: 0.85 }}>
            <Card style={styles.deck}>
              <IconBadge icon={d.icon} color={d.color} size={40} />
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.deckTitle}>{d.title}</Text>
                <ProgressBar value={ratio} color={d.color} />
                <Text style={styles.deckMeta}>
                  {d.cards.length} kart · %{Math.round(ratio * 100)} öğrenildi
                </Text>
              </View>
              <Ionicons name="play-circle" size={30} color={d.color} />
            </Card>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function BigButton(props: { icon: 'shuffle' | 'refresh'; color: string; title: string; text: string; onPress: () => void }) {
  return (
    <Pressable onPress={props.onPress} style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.85 }]}>
      <Card style={[styles.big, { backgroundColor: props.color }]}>
        <Ionicons name={props.icon} size={26} color="#fff" />
        <Text style={styles.bigTitle}>{props.title}</Text>
        <Text style={styles.bigText}>{props.text}</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 10 },
  explain: { gap: 8 },
  explainTitle: { fontWeight: '800', color: colors.text, fontSize: 15 },
  explainText: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: colors.text },
  row: { flexDirection: 'row', gap: 10, marginTop: 4 },
  big: { gap: 4 },
  bigTitle: { color: '#fff', fontWeight: '800', fontSize: 16, marginTop: 4 },
  bigText: { color: '#ffffffcc', fontSize: 12 },
  deck: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deckTitle: { fontWeight: '700', color: colors.text, fontSize: 15 },
  deckMeta: { fontSize: 12, color: colors.muted },
});
