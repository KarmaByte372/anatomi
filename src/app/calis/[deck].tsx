import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EditRequestButton } from '@/components/EditRequestButton';
import { Button, Card, ProgressBar } from '@/components/ui';
import { deckTitle, getDeck, type DeckCard } from '@/lib/decks';
import { useProgress } from '@/lib/progress';
import { buildStudySession, cardPool } from '@/lib/session';
import { colors, radius } from '@/theme';

export default function StudyScreen() {
  const { deck: deckId } = useLocalSearchParams<{ deck: string }>();
  const { boxOf, rateCard, weakCards } = useProgress();
  const color = getDeck(deckId)?.color ?? colors.primary;

  // Oturum bir kez kurulur; kartlar puanlandıkça sıra değişmez
  const [session, setSession] = useState<DeckCard[]>(() => buildStudySession(cardPool(deckId, weakCards), boxOf));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);

  function restart() {
    setSession(buildStudySession(cardPool(deckId, weakCards), boxOf));
    setIndex(0);
    setKnown(0);
    setRevealed(false);
  }

  function answer(isKnown: boolean) {
    rateCard(session[index].id, isKnown);
    if (isKnown) setKnown((k) => k + 1);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  const header = <Stack.Screen options={{ title: deckTitle(deckId) }} />;

  if (session.length === 0) {
    return (
      <View style={styles.center}>
        {header}
        <Ionicons name="happy-outline" size={56} color={colors.success} />
        <Text style={styles.doneTitle}>Burada çalışılacak kart yok</Text>
        <Text style={styles.doneText}>Zayıf kartın kalmadı ya da deste boş. Başka bir desteye geç!</Text>
        <Button title="Destelere dön" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  if (index >= session.length) {
    const pct = Math.round((known / session.length) * 100);
    return (
      <View style={styles.center}>
        {header}
        <Ionicons name="trophy" size={64} color={colors.warning} />
        <Text style={styles.doneTitle}>Oturum bitti!</Text>
        <Text style={styles.doneText}>
          {session.length} karttan {known} tanesini bildin (%{pct}).
        </Text>
        <Text style={styles.doneText}>
          {pct >= 80 ? 'Harika gidiyorsun 💪' : pct >= 50 ? 'Güzel! Bir tur daha atınca oturacak.' : 'Sorun değil, tekrar ettikçe kalıcı olacak 🌱'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          <Button title="Bir tur daha" icon="refresh" color={color} onPress={restart} />
          <Button title="Bitir" variant="ghost" color={color} onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const card = session[index];
  return (
    <View style={styles.container}>
      {header}
      <View style={styles.progressRow}>
        <View style={{ flex: 1 }}>
          <ProgressBar value={index / session.length} color={color} />
        </View>
        <Text style={styles.counter}>
          {index + 1} / {session.length}
        </Text>
      </View>

      <Pressable onPress={() => setRevealed((r) => !r)} style={{ flex: 1 }}>
        <Card style={[styles.flashcard, { borderTopColor: color }]}>
          <Text style={styles.deckLabel}>{getDeck(card.deckId)?.title}</Text>
          <Text style={styles.question}>{card.q}</Text>
          {revealed ? (
            <View style={[styles.answerBox, { backgroundColor: color + '14' }]}>
              <Text style={[styles.answer, { color }]}>{card.a}</Text>
              <View style={{ alignItems: 'center', marginTop: 8 }}>
                <EditRequestButton always label="Kartta hata bildir" location={`Kart: ${getDeck(card.deckId)?.title ?? ''}`} excerpt={`${card.q} → ${card.a}`} />
              </View>
            </View>
          ) : (
            <View style={styles.tapHint}>
              <Ionicons name="eye-outline" size={20} color={colors.muted} />
              <Text style={styles.tapText}>Cevabı görmek için dokun</Text>
            </View>
          )}
        </Card>
      </Pressable>

      {revealed ? (
        <View style={styles.buttons}>
          <Button title="Bilemedim" icon="close" color={colors.danger} variant="secondary" onPress={() => answer(false)} style={{ flex: 1 }} />
          <Button title="Bildim" icon="checkmark" color={colors.success} onPress={() => answer(true)} style={{ flex: 1 }} />
        </View>
      ) : (
        <Button title="Cevabı göster" icon="eye-outline" color={color} onPress={() => setRevealed(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 6 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counter: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  flashcard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    borderTopWidth: 6,
    borderRadius: radius.lg,
    padding: 24,
  },
  deckLabel: { position: 'absolute', top: 16, fontSize: 12, color: colors.muted, fontWeight: '600' },
  question: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', lineHeight: 30 },
  answerBox: { borderRadius: radius.md, paddingVertical: 16, paddingHorizontal: 20, alignSelf: 'stretch' },
  answer: { fontSize: 20, fontWeight: '800', textAlign: 'center', lineHeight: 28 },
  tapHint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tapText: { color: colors.muted },
  buttons: { flexDirection: 'row', gap: 12 },
  doneTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 8 },
  doneText: { fontSize: 15, color: colors.muted, textAlign: 'center' },
});
