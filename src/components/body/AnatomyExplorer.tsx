import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Anatomy3D } from '@/components/anatomy3d/Anatomy3D';
import { Button, Card, Chip } from '@/components/ui';
import { anatomyStructures, LAYERS, layerLabel, searchText, sideLabel, topicForStructure } from '@/data/anatomyInfo';
import type { AnatomyLayer, AnatomyStructure } from '@/data/anatomyTypes';
import { getTopic } from '@/data/topics';
import { sample } from '@/lib/random';
import { normalize } from '@/lib/text';
import { colors } from '@/theme';

type Mode = 'explore' | 'name' | 'find';
type Question = { target: AnatomyStructure; options: AnatomyStructure[] };

const fullName = (s: AnatomyStructure) => {
  const side = sideLabel(s);
  return side ? `${s.tr} (${side.toLocaleLowerCase('tr')})` : s.tr;
};

function quizPool(layers: AnatomyLayer[]): AnatomyStructure[] {
  return anatomyStructures.filter((s) => s.layer !== 'deri' && layers.includes(s.layer));
}

function makeQuestion(layers: AnatomyLayer[], previous?: number): Question | null {
  const pool = quizPool(layers);
  if (pool.length < 4) return null;
  const [target] = sample(
    pool.filter((s) => s.id !== previous),
    1,
  );
  // Aynı Latince isimli (sağ/sol) yapılar seçeneklerde tekrar etmesin
  const others = sample(
    pool.filter((s) => s.la !== target.la),
    12,
  ).filter((s, i, arr) => arr.findIndex((x) => x.la === s.la) === i);
  return { target, options: sample([target, ...others.slice(0, 3)], 4) };
}

/** Gerçek anatomik veriden (BodyParts3D) 3D model: katmanlar, arama, keşfet ve ezber oyunları */
export function AnatomyExplorer({ onInteractingChange }: { onInteractingChange: (b: boolean) => void }) {
  const [layers, setLayers] = useState<AnatomyLayer[]>(['iskelet', 'kas']);
  const [skinSolid, setSkinSolid] = useState(false);
  const [mode, setMode] = useState<Mode>('explore');
  const [selected, setSelected] = useState<number | null>(null);
  const [focus, setFocus] = useState<{ id: number; key: number } | null>(null);
  /** Röntgen modu: odaklanılan yapı dışındaki her şey yarı saydam */
  const [xray, setXray] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const structure = selected !== null ? anatomyStructures[selected] : undefined;
  const focusOn = (id: number, seeThrough = true) => {
    setFocus((f) => ({ id, key: (f?.key ?? 0) + 1 }));
    setXray(seeThrough ? id : null);
  };

  function toggleLayer(l: AnatomyLayer) {
    const next = layers.includes(l) ? layers.filter((x) => x !== l) : [...layers, l];
    setLayers(next);
    setXray(null);
    if (mode !== 'explore') newQuestion(mode, next);
  }

  function newQuestion(m: Mode = mode, ls: AnatomyLayer[] = layers) {
    const q = makeQuestion(ls, question?.target.id);
    setQuestion(q);
    setAnswer(null);
    setXray(null);
    if (q && m === 'name') focusOn(q.target.id);
  }

  function changeMode(m: Mode) {
    setMode(m);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setXray(null);
    if (m !== 'explore') newQuestion(m);
  }

  function submit(id: number) {
    if (!question || answer !== null) return;
    setAnswer(id);
    // Sağ/sol karşılığı da doğru sayılır
    const ok = anatomyStructures[id].la === question.target.la;
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    if (!ok && mode === 'find') focusOn(question.target.id);
  }

  function select(id: number | null) {
    if (mode === 'explore') {
      setSelected(id);
      if (id === null) setXray(null);
    }
    else if (mode === 'find' && id !== null) submit(id);
  }

  function pickFromSearch(s: AnatomyStructure) {
    if (!layers.includes(s.layer)) setLayers((ls) => [...ls, s.layer]);
    setMode('explore');
    setSelected(s.id);
    focusOn(s.id);
    setQuery('');
  }

  const highlights = useMemo<Record<number, string>>(() => {
    if (mode === 'explore') return selected !== null ? { [selected]: colors.highlight } : {};
    if (!question) return {};
    const t = question.target.id;
    if (mode === 'name') {
      if (answer === null) return { [t]: colors.highlight };
      return { [t]: anatomyStructures[answer].la === question.target.la ? colors.success : colors.danger };
    }
    if (answer === null) return {};
    return anatomyStructures[answer].la === question.target.la ? { [answer]: colors.success } : { [answer]: colors.danger, [t]: colors.success };
  }, [mode, selected, answer, question]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    const hits = anatomyStructures.filter((s) => normalize(searchText(s)).includes(q));
    // İsmin başında geçenler önce
    const starts = (s: AnatomyStructure) => normalize(s.la).startsWith(q) || normalize(s.tr).startsWith(q);
    return [...hits.filter(starts), ...hits.filter((s) => !starts(s))].slice(0, 10);
  }, [query]);

  const topicId = structure ? topicForStructure(structure) : null;
  const correct = question && answer !== null && anatomyStructures[answer].la === question.target.la;

  return (
    <View>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Yapı ara (ör. femur, kalp, biceps)"
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
      {results.length > 0 && (
        <Card style={styles.results}>
          {results.map((s) => (
            <Pressable key={s.id} onPress={() => pickFromSearch(s)} style={styles.resultRow}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resultLa}>{s.la}</Text>
                <Text style={styles.resultTr}>
                  {fullName(s)} · {layerLabel(s.layer)}
                </Text>
              </View>
            </Pressable>
          ))}
        </Card>
      )}

      <View style={styles.layers}>
        {LAYERS.map((l) => {
          const on = layers.includes(l.id);
          return (
            <Pressable key={l.id} onPress={() => toggleLayer(l.id)} style={[styles.layerChip, on && { backgroundColor: l.color, borderColor: l.color }]}>
              <Ionicons name={l.icon} size={14} color={on ? '#fff' : l.color} />
              <Text style={[styles.layerText, on && { color: '#fff' }]}>{l.label}</Text>
            </Pressable>
          );
        })}
        {layers.includes('deri') && (
          <Pressable onPress={() => setSkinSolid((v) => !v)} style={styles.layerChip}>
            <Ionicons name={skinSolid ? 'eye' : 'eye-outline'} size={14} color={colors.muted} />
            <Text style={styles.layerText}>{skinSolid ? 'Deri opak' : 'Deri saydam'}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.modes}>
        <Chip label="Keşfet" active={mode === 'explore'} onPress={() => changeMode('explore')} />
        <Chip label="Adını bil" active={mode === 'name'} onPress={() => changeMode('name')} />
        <Chip label="Yerini bul" active={mode === 'find'} onPress={() => changeMode('find')} />
      </View>

      {mode !== 'explore' && (
        <Card style={styles.prompt}>
          <Text style={styles.score}>
            Skor: {score.correct} / {score.total}
          </Text>
          {!question ? (
            <Text style={styles.promptText}>Soru için en az bir katman (deri dışında) aç.</Text>
          ) : mode === 'name' ? (
            <Text style={styles.promptText}>Vurgulanan yapının adı ne?</Text>
          ) : (
            <>
              <Text style={styles.promptText}>Bu yapıya modelde dokun:</Text>
              <Text style={styles.promptTarget}>{question.target.la}</Text>
              <Text style={styles.promptSub}>{fullName(question.target)}</Text>
            </>
          )}
        </Card>
      )}

      <View style={{ marginTop: 12 }}>
        <Anatomy3D
          height={540}
          layers={layers}
          skinOpacity={skinSolid ? 1 : 0.3}
          ghost={xray !== null ? layers : []}
          isolate={xray !== null ? { id: xray, color: highlights[xray] ?? colors.highlight } : null}
          highlights={highlights}
          onSelect={select}
          focus={focus}
          onInteractingChange={onInteractingChange}
        />
        <Text style={styles.gestureHint}>Tek parmak: döndür · İki parmak: yakınlaştır ve kaydır · Dokun: yapıyı seç</Text>
      </View>

      {mode === 'explore' &&
        (structure ? (
          <Card style={styles.info}>
            <Text style={styles.latin}>{structure.la}</Text>
            <Text style={styles.name}>{fullName(structure)}</Text>
            <Text style={styles.meta}>{layerLabel(structure.layer)}</Text>
            {xray && (
              <Pressable onPress={() => setXray(null)} style={styles.xray}>
                <Ionicons name="eye-off-outline" size={14} color={colors.accent} />
                <Text style={styles.xrayText}>Röntgen modu açık · normal görünüme dön</Text>
              </Pressable>
            )}
            <View style={styles.infoActions}>
              <Button title="Yakınlaş" icon="locate-outline" variant="ghost" onPress={() => focusOn(structure.id)} style={{ flex: 1 }} />
              {topicId && (
                <Button
                  title={getTopic(topicId)?.title.split(' ')[0] ?? 'Konu'}
                  icon="book-outline"
                  variant="secondary"
                  onPress={() => router.push(`/konu/${topicId}`)}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </Card>
        ) : (
          <Card>
            <View style={styles.hintRow}>
              <Ionicons name="hand-left-outline" size={20} color={colors.primary} />
              <Text style={styles.hint}>
                Modelde bir yapıya dokun. Katmanları açıp kapatarak deriden kemiğe kadar in. Binden fazla yapı var.
              </Text>
            </View>
          </Card>
        ))}

      {mode === 'name' && question && (
        <View style={{ gap: 8, marginTop: 4 }}>
          {question.options.map((o) => {
            const isCorrect = o.la === question.target.la;
            const picked = answer === o.id;
            const bg = answer === null ? colors.card : isCorrect ? colors.successSoft : picked ? colors.dangerSoft : colors.card;
            const border = answer === null ? colors.border : isCorrect ? colors.success : picked ? colors.danger : colors.border;
            return (
              <Pressable key={o.id} onPress={() => submit(o.id)} style={[styles.option, { backgroundColor: bg, borderColor: border }]}>
                <Text style={styles.optionLatin}>{o.la}</Text>
                <Text style={styles.optionName}>{o.tr}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {mode !== 'explore' && question && answer !== null && (
        <View style={{ gap: 8, marginTop: 12 }}>
          <Text style={[styles.feedback, { color: correct ? colors.success : colors.danger }]}>
            {correct ? 'Doğru! 🎉' : `Yanlış — doğrusu: ${question.target.la} (${question.target.tr})`}
          </Text>
          <Button title="Sonraki soru" icon="arrow-forward" onPress={() => newQuestion()} />
        </View>
      )}

      <Text style={styles.credit}>3D veri: BodyParts3D, © The Database Center for Life Science (CC BY 4.0)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 15, color: colors.text },
  results: { marginTop: 6, paddingVertical: 6, gap: 2 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  resultLa: { fontWeight: '700', color: colors.text },
  resultTr: { fontSize: 12, color: colors.muted },
  layers: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  layerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  layerText: { fontSize: 12, fontWeight: '700', color: colors.text },
  modes: { flexDirection: 'row', gap: 8, marginTop: 12 },
  prompt: { marginTop: 12, alignItems: 'center', gap: 2 },
  score: { fontSize: 12, color: colors.muted, alignSelf: 'flex-end' },
  promptText: { fontSize: 15, color: colors.text, fontWeight: '600', textAlign: 'center' },
  promptTarget: { fontSize: 20, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  promptSub: { fontSize: 13, color: colors.muted },
  gestureHint: { fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 6, marginBottom: 10 },
  info: { gap: 3 },
  latin: { fontSize: 20, fontWeight: '800', color: colors.primary },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  meta: { fontSize: 13, color: colors.muted },
  xray: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  xrayText: { fontSize: 12, color: colors.accent, fontWeight: '700' },
  infoActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  hintRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  hint: { flex: 1, color: colors.muted, fontSize: 14, lineHeight: 20 },
  option: { borderWidth: 1.5, borderRadius: 12, padding: 12 },
  optionLatin: { fontWeight: '700', color: colors.text, fontSize: 15 },
  optionName: { color: colors.muted, fontSize: 13 },
  feedback: { fontWeight: '700', fontSize: 15, textAlign: 'center' },
  credit: { fontSize: 10, color: colors.muted, textAlign: 'center', marginTop: 16 },
});
