import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { privacyPolicy } from '@/data/privacy';
import { colors } from '@/theme';

export default function PrivacyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.updated}>Son güncelleme: {privacyPolicy.updated}</Text>
        {privacyPolicy.sections.map((s) => (
          <View key={s.title} style={styles.block}>
            <Text style={styles.h}>{s.title}</Text>
            <Text style={styles.p}>{s.body}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48 },
  card: { gap: 14 },
  updated: { fontSize: 12, color: colors.muted },
  block: { gap: 4 },
  h: { fontSize: 15, fontWeight: '800', color: colors.text },
  p: { fontSize: 14, color: colors.text, lineHeight: 21 },
});
