import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, ProgressBar } from '@/components/ui';
import { deckTitle, getDeck } from '@/lib/decks';
import { useProgress } from '@/lib/progress';
import { buildQuiz, cardPool, type QuizQuestion } from '@/lib/session';
import { colors } from '@/theme';

type Answer = { question: QuizQuestion; picked: string };

export default function QuizScreen() {
  const { deck: deckId } = useLocalSearchParams<{ deck: string }>();
  const { weakCards, recordQuiz, rateCard } = useProgress();
  const color = getDeck(deckId)?.color ?? '#7C5CBF';

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuiz(cardPool(deckId, weakCards)));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  const header = <Stack.Screen options={{ title: `Test · ${deckTitle(deckId)}` }} />;

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        {header}
        <Text style={styles.doneText}>Bu destede soru yok.</Text>
      </View>
    );
  }

  const finished = index >= questions.length;
  const correctCount = answers.filter((a) => a.picked === a.question.card.a).length;

  function choose(option: string) {
    if (picked) return;
    const q = questions[index];
    setPicked(option);
    setAnswers((a) => [...a, { question: q, picked: option }]);
    // Testteki cevap da kartın aralıklı tekrar kutusunu günceller
    rateCard(q.card.id, option === q.card.a);
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
      recordQuiz(deckId, Math.round((correctCount / questions.length) * 100));
    }
    setPicked(null);
    setIndex(nextIndex);
  }

  function restart() {
    setQuestions(buildQuiz(cardPool(deckId, weakCards)));
    setIndex(0);
    setAnswers([]);
    setPicked(null);
  }

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    const wrong = answers.filter((a) => a.picked !== a.question.card.a);
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {header}
        <Card style={styles.result}>
          <Ionicons name={pct >= 70 ? 'trophy' : 'ribbon'} size={56} color={pct >= 70 ? colors.warning : color} />
          <Text style={styles.resultScore}>%{pct}</Text>
          <Text style={styles.doneText}>
            {questions.length} sorudan {correctCount} doğru
          </Text>
        </Card>

        {wrong.length > 0 && (
          <>
            <Text style={styles.reviewTitle}>Yanlışların — bunları tekrar et</Text>
            {wrong.map((a) => (
              <Card key={a.question.card.id} style={styles.reviewCard}>
                <Text style={styles.reviewQ}>{a.question.card.q}</Text>
                <Text style={styles.reviewWrong}>✗ {a.picked}</Text>
                <Text style={styles.reviewRight}>✓ {a.question.card.a}</Text>
              </Card>
            ))}
          </>
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="Yeni test" icon="refresh" color={color} onPress={restart} style={{ flex: 1 }} />
          <Button title="Bitir" variant="ghost" color={color} onPress={() => router.back()} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    );
  }

  const q = questions[index];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {header}
      <View style={styles.progressRow}>
        <View style={{ flex: 1 }}>
          <ProgressBar value={index / questions.length} color={color} />
        </View>
        <Text style={styles.counter}>
          {index + 1} / {questions.length}
        </Text>
      </View>

      <Card style={styles.questionCard}>
        <Text style={styles.deckLabel}>{getDeck(q.card.deckId)?.title}</Text>
        <Text style={styles.question}>{q.card.q}</Text>
      </Card>

      {q.options.map((o, i) => {
        const isCorrect = o === q.card.a;
        const isPicked = o === picked;
        const bg = !picked ? colors.card : isCorrect ? colors.successSoft : isPicked ? colors.dangerSoft : colors.card;
        const border = !picked ? colors.border : isCorrect ? colors.success : isPicked ? colors.danger : colors.border;
        return (
          <Pressable key={o} onPress={() => choose(o)} style={[styles.option, { backgroundColor: bg, borderColor: border }]}>
            <View style={[styles.letter, { borderColor: border }]}>
              <Text style={styles.letterText}>{'ABCD'[i]}</Text>
            </View>
            <Text style={styles.optionText}>{o}</Text>
            {picked && isCorrect && <Ionicons name="checkmark-circle" size={22} color={colors.success} />}
            {picked && isPicked && !isCorrect && <Ionicons name="close-circle" size={22} color={colors.danger} />}
          </Pressable>
        );
      })}

      {picked && (
        <Button
          title={index + 1 >= questions.length ? 'Sonucu gör' : 'Sonraki soru'}
          icon="arrow-forward"
          color={color}
          onPress={next}
          style={{ marginTop: 6 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  counter: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  questionCard: { minHeight: 140, justifyContent: 'center', gap: 10, marginBottom: 6 },
  deckLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  question: { fontSize: 20, fontWeight: '700', color: colors.text, lineHeight: 28 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 12, padding: 14 },
  letter: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontWeight: '700', color: colors.text },
  optionText: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 21 },
  result: { alignItems: 'center', gap: 4, paddingVertical: 28 },
  resultScore: { fontSize: 44, fontWeight: '900', color: colors.text },
  doneText: { fontSize: 15, color: colors.muted, textAlign: 'center' },
  reviewTitle: { fontWeight: '800', color: colors.text, fontSize: 16, marginTop: 10 },
  reviewCard: { gap: 4 },
  reviewQ: { fontWeight: '700', color: colors.text },
  reviewWrong: { color: colors.danger },
  reviewRight: { color: colors.success, fontWeight: '600' },
});
