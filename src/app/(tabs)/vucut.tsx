import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BodyMap, regionIdsForView } from '@/components/BodyMap';
import { Body3D } from '@/components/body3d/Body3D';
import { MODEL_REGION_IDS } from '@/components/body3d/model';
import { Button, Card, Chip } from '@/components/ui';
import { getRegion } from '@/data/regions';
import type { BodyView, Region } from '@/data/types';
import { sample } from '@/lib/random';
import { colors } from '@/theme';

type Mode = 'explore' | 'name' | 'find';
type Display = '3d' | '2d';

type Question = { target: Region; options: Region[] };

function regionPool(display: Display, view: BodyView): string[] {
  return display === '3d' ? MODEL_REGION_IDS : regionIdsForView(view);
}

function makeQuestion(pool: string[], previous?: string): Question {
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

export default function BodyScreen() {
  const [display, setDisplay] = useState<Display>('3d');
  const [view, setView] = useState<BodyView>('front');
  const [focus, setFocus] = useState<{ id: string; key: number } | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [mode, setMode] = useState<Mode>('explore');
  const [selected, setSelected] = useState<string | null>(null);

  const [question, setQuestion] = useState<Question>(() => makeQuestion(regionPool('3d', 'front')));
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const region = selected ? getRegion(selected) : undefined;

  const focusOn = (id: string) => setFocus((f) => ({ id, key: (f?.key ?? 0) + 1 }));

  function changeView(v: BodyView) {
    setView(v);
    setSelected(null);
    newQuestion(mode, display, v);
  }

  function changeDisplay(d: Display) {
    setDisplay(d);
    setSelected(null);
    newQuestion(mode, d, view);
  }

  function changeMode(m: Mode) {
    setMode(m);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    newQuestion(m, display, view);
  }

  function newQuestion(m = mode, d = display, v = view) {
    const q = makeQuestion(regionPool(d, v), question.target.id);
    setQuestion(q);
    setAnswer(null);
    // "Adını bil" modunda 3D kamera sorulan bölgeye döner
    if (m === 'name' && d === '3d') focusOn(q.target.id);
  }

  function submit(regionId: string) {
    if (answer) return;
    setAnswer(regionId);
    setScore((s) => ({ correct: s.correct + (regionId === question.target.id ? 1 : 0), total: s.total + 1 }));
    // Yanlış yeri seçtiyse doğru bölgeyi göster
    if (mode === 'find' && regionId !== question.target.id && display === '3d') focusOn(question.target.id);
  }

  const highlights = useMemo<Record<string, string>>(() => {
    if (mode === 'explore') return selected ? { [selected]: colors.highlight } : {};
    if (mode === 'name') {
      if (!answer) return { [question.target.id]: colors.highlight };
      return { [question.target.id]: answer === question.target.id ? colors.success : colors.danger };
    }
    // find: önce boş harita, cevaptan sonra doğru (yeşil) ve yanlış seçim (kırmızı)
    if (!answer) return {};
    return answer === question.target.id
      ? { [answer]: colors.success }
      : { [answer]: colors.danger, [question.target.id]: colors.success };
  }, [mode, selected, answer, question]);

  const onMapPress = (id: string) => {
    if (mode === 'explore') setSelected(id);
    else if (mode === 'find') submit(id);
  };

  const viewRegions = regionPool(display, view).map((id) => getRegion(id)!);

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={scrollEnabled}>
      <View style={styles.row}>
        <Chip label="Keşfet" active={mode === 'explore'} onPress={() => changeMode('explore')} />
        <Chip label="Adını bil" active={mode === 'name'} onPress={() => changeMode('name')} />
        <Chip label="Yerini bul" active={mode === 'find'} onPress={() => changeMode('find')} />
      </View>

      <View style={styles.viewToggle}>
        {(['3d', '2d'] as const).map((d) => (
          <Pressable key={d} onPress={() => changeDisplay(d)} style={[styles.toggleBtn, display === d && styles.toggleBtnActive]}>
            <Text style={[styles.toggleText, display === d && styles.toggleTextActive]}>{d === '3d' ? '3D model' : '2D şema'}</Text>
          </Pressable>
        ))}
      </View>

      {display === '2d' && (
        <View style={styles.viewToggle}>
          {(['front', 'back'] as const).map((v) => (
            <Pressable key={v} onPress={() => changeView(v)} style={[styles.toggleBtn, view === v && styles.toggleBtnActive]}>
              <Text style={[styles.toggleText, view === v && styles.toggleTextActive]}>{v === 'front' ? 'Ön yüz' : 'Arka yüz'}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {mode !== 'explore' && (
        <Card style={styles.prompt}>
          <Text style={styles.score}>
            Skor: {score.correct} / {score.total}
          </Text>
          {mode === 'name' ? (
            <Text style={styles.promptText}>Vurgulanan bölgenin adı ne?</Text>
          ) : (
            <>
              <Text style={styles.promptText}>Bu bölgeyi haritada bul:</Text>
              <Text style={styles.promptTarget}>{question.target.latin}</Text>
              <Text style={styles.promptSub}>{question.target.name}</Text>
            </>
          )}
        </Card>
      )}

      {display === '3d' ? (
        <View style={styles.viewer}>
          <Body3D highlights={highlights} onSelect={onMapPress} focus={focus} onInteractingChange={(b) => setScrollEnabled(!b)} />
          <Text style={styles.gestureHint}>Tek parmak: döndür / yukarı-aşağı kaydır · İki parmak: yakınlaştır · Dokun: bölge seç</Text>
        </View>
      ) : (
        <View style={styles.mapWrap}>
          <BodyMap view={view} highlights={highlights} onSelect={onMapPress} />
        </View>
      )}

      {mode === 'explore' &&
        (region ? (
          <Card style={styles.info}>
            <Text style={styles.latin}>{region.latin}</Text>
            <Text style={styles.name}>{region.name}</Text>
            <Text style={styles.location}>{region.location}</Text>
            <View style={styles.infoActions}>
              {display === '3d' && (
                <Button title="Yakınlaş" icon="locate-outline" variant="ghost" onPress={() => focusOn(region.id)} style={{ flex: 1 }} />
              )}
              <Button
                title="Detaylar"
                icon="information-circle-outline"
                variant="secondary"
                onPress={() => router.push(`/bolge/${region.id}`)}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ) : (
          <Card style={styles.info}>
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
          <Text style={styles.listTitle}>{display === '3d' ? 'TÜM BÖLGELER' : view === 'front' ? 'ÖN YÜZ BÖLGELERİ' : 'ARKA YÜZ BÖLGELERİ'}</Text>
          {viewRegions.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => {
                setSelected(r.id);
                if (display === '3d') focusOn(r.id);
              }}
              style={[styles.listItem, selected === r.id && styles.listItemActive]}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: 12,
    padding: 3,
    marginTop: 12,
  },
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
  viewer: { marginVertical: 12, gap: 6 },
  gestureHint: { fontSize: 11, color: colors.muted, textAlign: 'center' },
  infoActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: colors.card,
  },
  listItemActive: { backgroundColor: colors.primarySoft },
  listLatin: { fontWeight: '700', color: colors.text },
  listName: { color: colors.muted, fontSize: 13 },
});
