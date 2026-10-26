import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, SectionTitle } from '@/components/ui';
import type { IconName } from '@/data/types';
import { appVersion, callSupport, CONTACT_EMAIL, CONTACT_PHONE, emailSupport } from '@/lib/contact';
import { useProgress } from '@/lib/progress';
import { DEPARTMENTS, useSettings } from '@/lib/settings';
import { colors } from '@/theme';

export default function SettingsScreen() {
  const { department, setDepartment } = useSettings();
  const { reset } = useProgress();

  function confirmReset() {
    const run = () => reset();
    if (Platform.OS === 'web') {
      if (window.confirm('Tüm kart ilerlemesi ve test skorları silinsin mi?')) run();
      return;
    }
    Alert.alert('İlerlemeyi sıfırla', 'Tüm kart ilerlemesi ve test skorları silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sıfırla', style: 'destructive', onPress: run },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionTitle>Bölümüm</SectionTitle>
      <Card style={{ gap: 4, paddingVertical: 8 }}>
        {DEPARTMENTS.map((d) => (
          <Pressable key={d.id} onPress={() => setDepartment(d.id)} style={styles.radioRow} accessibilityRole="radio" accessibilityState={{ checked: department === d.id }}>
            <Ionicons name={department === d.id ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{d.label}</Text>
              <Text style={styles.rowText}>{d.description}</Text>
            </View>
          </Pressable>
        ))}
      </Card>

      <SectionTitle>Öğretim üyeleri</SectionTitle>
      <Card style={styles.list}>
        <Row icon="school-outline" title="Akademisyen paneli" text="İçeriği inceleyin, düzenleme talep edin" href="/akademisyen" />
        <Row icon="create-outline" title="Düzenleme talep et" text="Hata bildirin veya içerik önerin" href="/duzenleme" />
      </Card>

      <SectionTitle>İletişim</SectionTitle>
      <Card style={styles.list}>
        <Row icon="mail-outline" title="E-posta" text={CONTACT_EMAIL} onPress={emailSupport} />
        <Row icon="call-outline" title="Telefon" text={CONTACT_PHONE} onPress={callSupport} />
      </Card>

      <SectionTitle>Uygulama</SectionTitle>
      <Card style={styles.list}>
        <Row icon="information-circle-outline" title="Hakkında, kaynaklar ve lisanslar" href="/hakkinda" />
        <Row icon="shield-checkmark-outline" title="Gizlilik politikası" href="/gizlilik" />
        <Row icon="trash-outline" title="İlerlemeyi sıfırla" text="Kart kutuları ve test skorları silinir" onPress={confirmReset} danger />
      </Card>

      <Text style={styles.version}>Anatomi Rehberi · sürüm {appVersion}</Text>
    </ScrollView>
  );
}

function Row(props: { icon: IconName; title: string; text?: string; href?: Href; onPress?: () => void; danger?: boolean }) {
  const color = props.danger ? colors.danger : colors.text;
  return (
    <Pressable
      onPress={() => (props.href ? router.push(props.href) : props.onPress?.())}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
      accessibilityRole="button"
    >
      <Ionicons name={props.icon} size={20} color={props.danger ? colors.danger : colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color }]}>{props.title}</Text>
        {props.text ? <Text style={styles.rowText}>{props.text}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48 },
  list: { paddingVertical: 4 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  rowText: { fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 17 },
  version: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 24 },
});
