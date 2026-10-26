import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card } from '@/components/ui';
import type { IconName } from '@/data/types';
import { DEPARTMENTS, useSettings, type Department } from '@/lib/settings';
import { colors } from '@/theme';

const FEATURES: { icon: IconName; text: string }[] = [
  { icon: 'body-outline', text: '1.000+ yapılı 3D anatomi modeli' },
  { icon: 'book-outline', text: '16 konu, klinik notlar ve Türkçe ezber ipuçları' },
  { icon: 'albums-outline', text: '300+ bilgi kartı, aralıklı tekrar' },
  { icon: 'checkmark-done-outline', text: 'Konu testleri ve deneme sınavı' },
];

/** İlk açılış: bölüm seçimi ve kısa tanıtım */
export default function WelcomeScreen() {
  const { department, setDepartment } = useSettings();
  const [choice, setChoice] = useState<Department | null>(department);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Anatomi Rehberi</Text>
        <Text style={styles.subtitle}>Sağlık bilimleri öğrencileri için anatomi çalışma uygulaması</Text>

        <Card style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.feature}>
              <Ionicons name={f.icon} size={20} color={colors.primary} />
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.question}>Hangi bölümde okuyorsun?</Text>
        {DEPARTMENTS.map((d) => {
          const on = choice === d.id;
          return (
            <Pressable
              key={d.id}
              onPress={() => setChoice(d.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              style={[styles.option, on && styles.optionOn]}
            >
              <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={22} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>{d.label}</Text>
                <Text style={styles.optionText}>{d.description}</Text>
              </View>
            </Pressable>
          );
        })}

        <Button
          title="Başla"
          icon="arrow-forward"
          disabled={!choice}
          onPress={() => {
            if (!choice) return;
            setDepartment(choice);
            router.replace('/');
          }}
          style={{ marginTop: 12 }}
        />
        <Text style={styles.note}>
          Bölümünü daha sonra Ayarlar’dan değiştirebilirsin. Uygulama eğitim amaçlıdır; ders kitabın ve hocalarının anlatımı esastır.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20, paddingBottom: 40, gap: 10 },
  title: { fontSize: 30, fontWeight: '900', color: colors.primary, marginTop: 12 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 6 },
  features: { gap: 12 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureText: { fontSize: 14, color: colors.text, flex: 1 },
  question: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 14 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  optionOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  optionText: { fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 17 },
  note: { fontSize: 12, color: colors.muted, textAlign: 'center', lineHeight: 18, marginTop: 8 },
});
