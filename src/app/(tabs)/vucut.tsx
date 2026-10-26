import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnatomyExplorer } from '@/components/body/AnatomyExplorer';
import { Regions2D } from '@/components/body/Regions2D';
import { colors } from '@/theme';

type Section = '3d' | '2d';

export default function BodyScreen() {
  const [section, setSection] = useState<Section>('3d');
  // 3D modeli döndürürken sayfa kaymasın
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={scrollEnabled} keyboardShouldPersistTaps="handled">
      <View style={styles.toggle}>
        {(['3d', '2d'] as const).map((s) => (
          <Pressable key={s} onPress={() => setSection(s)} style={[styles.toggleBtn, section === s && styles.toggleBtnActive]}>
            <Text style={[styles.toggleText, section === s && styles.toggleTextActive]}>{s === '3d' ? '3D Anatomi' : 'Vücut bölgeleri (2D)'}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ marginTop: 14 }}>{section === '3d' ? <AnatomyExplorer onInteractingChange={(b) => setScrollEnabled(!b)} /> : <Regions2D />}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  toggle: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 3 },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: colors.card },
  toggleText: { fontWeight: '700', color: colors.muted },
  toggleTextActive: { color: colors.text },
});
