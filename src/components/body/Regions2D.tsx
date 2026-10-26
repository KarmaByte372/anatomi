import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BodyMap, regionIdsForView } from '@/components/BodyMap';
import { Button, Card, Chip } from '@/components/ui';
import { getRegion } from '@/data/regions';
import type { BodyView, Region } from '@/data/types';
import { sample } from '@/lib/random';
import { colors } from '@/theme';

type Mode = 'explore' | 'name' | 'find';
type Question = { target: Region; options: Region[] };

function makeQuestion(view: BodyView, previous?: string): Question {
  const pool = regionIdsForView(view);
  const [targetId] = sample(
    pool.filter((id) => id !== previous),
    1,
  );
  const target = getRegion(targetId)!;
  const others = sample(
    pool.filter((id) => id !== targetId),
    3,
  ).map((id) => getRegion(id)!);
  return { target, options: sample([target, ...others], 4) };
}

/** Yüzey bölgeleri (regio ...) için 2D şema: keşfet ve iki ezber oyunu */
export function Regions2D() {
  const [view, setView] = useState<BodyView>('front');
  const [mode, setMode] = useState<Mode>('explore');
  const [selected, setSelected] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question>(() => makeQuestion('front'));
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const region = selected ? getRegion(selected) : undefined;

  function newQuestion(v = view) {
    setQuestion((q) => makeQuestion(v, q.target.id));
    setAnswer(null);
  }

  function changeView(v: BodyView) {
    setView(v);
    setSelected(null);
    newQuestion(v);
  }

  function changeMode(m: Mode) {
    setMode(m);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    newQuestion();
  }

  function submit(regionId: string) {
    if (answer) return;
    setAnswer(regionId);
    setScore((s) => ({ correct: s.correct + (regionId === question.target.id ? 1 : 0), total: s.total + 1 }));
  }

  const highlights = useMemo<Record<string, string>>(() => {
    if (mode === 'explore') return selected ? { [selected]: colors.highlight } : {};
    if (mode === 'name') {
      if (!answer) return { [question.target.id]: colors.highlight };
      return { [question.target.id]: answer === question.target.id ? colors.success : colors.danger };
    }
    if (!answer) return {};
    return answer === question.target.id ? { [answer]: colors.success } : { [answer]: colors.danger, [question.target.id]: colors.success };
  }, [mode, selected, answer, question]);

  const onMapPress = (id: string) => {
    if (mode === 'explore') setSelected(id);
    else if (mode === 'find') submit(id);
  };

  return (
    <View>
      <View style={styles.row}>
        <Chip label="Keşfet" active={mode === 'explore'} onPress={() => changeMode('explore')} />
        <Chip label="Adını bil" active={mode === 'name'} onPress={() => changeMode('name')} />
        <Chip label="Yerini bul" active={mode === 'find'} onPress={() => changeMode('find')} />
      </View>

      <View style={styles.viewToggle}>
        {(['front', 'back'] as const).map((v) => (
          <Pressable key={v} onPress={() => changeView(v)} style={[styles.toggleBtn, view === v && styles.toggleBtnActive]}>
            <Text style={[styles.toggleText, view === v && styles.toggleTextActive]}>{v === 'front' ? 'Ön yüz' : 'Arka yüz'}</Text>
          </Pressable>
        ))}
      </View>

      {mode !== 'explore' && (
        <Card style={styles.prompt}>
          <Text style={styles.score}>
            Skor: {score.correct} / {score.total}
          </Text>
          {mode === 'name' ? (
            <Text style={styles.promptText}>Vurgulanan bölgenin adı ne?</Text>
          ) : (
            <>
              <Text style={styles.promptText}>Bu bölgeyi şemada bul:</Text>
              <Text style={styles.promptTarget}>{question.target.latin}</Text>
              <Text style={styles.promptSub}>{question.target.name}</Text>
            </>
          )}
        </Card>
      )}

      <View style={styles.mapWrap}>
        <BodyMap view={view} highlights={highlights} onSelect={onMapPress} />
      </View>

      {mode === 'explore' &&
        (region ? (
          <Card style={styles.info}>
            <Text style={styles.latin}>{region.latin}</Text>
            <Text style={styles.name}>{region.name}</Text>
            <Text style={styles.location}>{region.location}</Text>
            <Button
              title="Detayları gör"
              icon="information-circle-outline"
              variant="secondary"
              onPress={() => router.push(`/bolge/${region.id}`)}
              style={{ marginTop: 10 }}
            />
          </Card>
        ) : (
          <Card>
            <View style={styles.hintRow}>
              <Ionicons name="hand-left-outline" size={20} color={colors.primary} />
              <Text style={styles.hint}>Bir bölgeye dokun; Latince ve Türkçe adını, altındaki yapıları gör.</Text>
            </View>
          </Card>
        ))}

      {mode === 'name' && (
        <View style={{ gap: 8 }}>
          {question.options.map((o) => {
            const isCorrect = o.id === question.target.id;
            const picked = answer === o.id;
            const bg = !answer ? colors.card : isCorrect ? colors.successSoft : picked ? colors.dangerSoft : colors.card;
            const border = !answer ? colors.border : isCorrect ? colors.success : picked ? colors.danger : colors.border;
            return (
              <Pressable key={o.id} onPress={() => submit(o.id)} style={[styles.option, { backgroundColor: bg, borderColor: border }]}>
                <Text style={styles.optionLatin}>{o.latin}</Text>
                <Text style={styles.optionName}>{o.name}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {mode !== 'explore' && answer && (
        <View style={{ gap: 8, marginTop: 12 }}>
          <Text style={[styles.feedback, { color: answer === question.target.id ? colors.success : colors.danger }]}>
            {answer === question.target.id ? 'Doğru! 🎉' : `Yanlış — doğrusu: ${question.target.latin} (${question.target.name})`}
          </Text>
          <Button title="Sonraki soru" icon="arrow-forward" onPress={() => newQuestion()} />
        </View>
      )}

      {mode === 'explore' && (
        <>
          <Text style={styles.listTitle}>{view === 'front' ? 'ÖN YÜZ BÖLGELERİ' : 'ARKA YÜZ BÖLGELERİ'}</Text>
          {regionIdsForView(view)
            .map((id) => getRegion(id)!)
            .map((r) => (
              <Pressable key={r.id} onPress={() => setSelected(r.id)} style={[styles.listItem, selected === r.id && styles.listItemActive]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listLatin}>{r.latin}</Text>
                  <Text style={styles.listName}>{r.name}</Text>
                </View>
                <Pressable hitSlop={8} onPress={() => router.push(`/bolge/${r.id}`)}>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </Pressable>
              </Pressable>
            ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  viewToggle: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 3, marginTop: 12 },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: colors.card },
  toggleText: { fontWeight: '600', color: colors.muted },
  toggleTextActive: { color: colors.text },
  prompt: { marginTop: 12, alignItems: 'center', gap: 2 },
  score: { fontSize: 12, color: colors.muted, alignSelf: 'flex-end' },
  promptText: { fontSize: 15, color: colors.text, fontWeight: '600' },
  promptTarget: { fontSize: 20, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  promptSub: { fontSize: 13, color: colors.muted },
  mapWrap: { height: 460, marginVertical: 12, alignItems: 'center' },
  info: { gap: 4 },
  latin: { fontSize: 20, fontWeight: '800', color: colors.primary },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  location: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  hintRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  hint: { flex: 1, color: colors.muted, fontSize: 14 },
  option: { borderWidth: 1.5, borderRadius: 12, padding: 12 },
  optionLatin: { fontWeight: '700', color: colors.text, fontSize: 15 },
  optionName: { color: colors.muted, fontSize: 13 },
  feedback: { fontWeight: '700', fontSize: 15, textAlign: 'center' },
  listTitle: { fontSize: 13, fontWeight: '700', color: colors.muted, marginTop: 24, marginBottom: 8 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4, backgroundColor: colors.card },
  listItemActive: { backgroundColor: colors.primarySoft },
  listLatin: { fontWeight: '700', color: colors.text },
  listName: { color: colors.muted, fontSize: 13 },
});
