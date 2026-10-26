import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BodyMap } from '@/components/BodyMap';
import { EditRequestButton } from '@/components/EditRequestButton';
import { Card } from '@/components/ui';
import { getRegion } from '@/data/regions';
import { colors } from '@/theme';

export default function RegionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const region = getRegion(id);

  if (!region) {
    return (
      <View style={styles.center}>
        <Text>Bölge bulunamadı.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: region.name }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.map}>
            <BodyMap view={region.view} highlights={{ [region.id]: colors.highlight }} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.latin}>{region.latin}</Text>
            <Text style={styles.name}>{region.name}</Text>
            <Text style={styles.view}>{region.view === 'front' ? 'Ön yüz' : 'Arka yüz'}</Text>
          </View>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Nerede?</Text>
          <Text style={styles.text}>{region.location}</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Altındaki / içindeki yapılar</Text>
          {region.structures.map((s) => (
            <View key={s} style={styles.bullet}>
              <View style={styles.dot} />
              <Text style={styles.text}>{s}</Text>
            </View>
          ))}
        </Card>

        {region.clinical && (
          <Card style={[styles.card, styles.clinical]}>
            <View style={styles.clinicalHeader}>
              <Ionicons name="medkit" size={18} color={colors.accent} />
              <Text style={[styles.cardTitle, { color: colors.accent }]}>Klinik not</Text>
            </View>
            <Text style={styles.text}>{region.clinical}</Text>
          </Card>
        )}
        <EditRequestButton always label="Bu bölgede hata bildir" location={`Vücut bölgesi: ${region.latin}`} excerpt={`${region.latin} — ${region.name}`} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, gap: 12, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  map: { width: 110, height: 250 },
  latin: { fontSize: 22, fontWeight: '800', color: colors.primary },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  view: { fontSize: 13, color: colors.muted },
  card: { gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  text: { fontSize: 15, lineHeight: 22, color: colors.text, flex: 1 },
  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 8, backgroundColor: colors.primary },
  clinical: { borderLeftWidth: 4, borderLeftColor: colors.accent },
  clinicalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
