import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useSettings } from '@/lib/settings';
import { colors } from '@/theme';

type Props = {
  /** İçeriğin uygulamadaki yeri (e-postada konu olarak kullanılır) */
  location: string;
  /** Düzeltilmesi istenen metin */
  excerpt?: string;
  /** true ise akademisyen modu kapalıyken de görünür */
  always?: boolean;
  label?: string;
};

/** Akademisyen modunda içeriğin yanında görünen "Düzenleme talep et" bağlantısı */
export function EditRequestButton({ location, excerpt, always = false, label = 'Düzenleme talep et' }: Props) {
  const { reviewerMode } = useSettings();
  if (!reviewerMode && !always) return null;
  // Akademisyen modunda her yerde aynı ifade kullanılır
  const text = reviewerMode ? 'Düzenleme talep et' : label;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${text}: ${location}`}
      hitSlop={6}
      onPress={() => router.push({ pathname: '/duzenleme', params: { location, excerpt: excerpt ?? '' } })}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.6 }]}
    >
      <Ionicons name="create-outline" size={14} color={colors.accent} />
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingVertical: 4 },
  text: { fontSize: 12, fontWeight: '700', color: colors.accent },
});
