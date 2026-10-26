import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Card, Chip } from '@/components/ui';
import { callSupport, CONTACT_EMAIL, CONTACT_PHONE, sendEditRequest } from '@/lib/contact';
import { colors, radius } from '@/theme';

const KINDS = ['Hata / düzeltme', 'Eksik içerik', 'Öneri'];

export default function EditRequestScreen() {
  const params = useLocalSearchParams<{ location?: string; excerpt?: string }>();
  const [location, setLocation] = useState(params.location ?? '');
  const [kind, setKind] = useState(KINDS[0]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');

  async function send() {
    if (!message.trim()) {
      Alert.alert('Açıklama gerekli', 'Lütfen düzeltme önerinizi veya açıklamanızı yazın.');
      return;
    }
    const ok = await sendEditRequest({
      kind,
      location: location || 'Genel',
      excerpt: params.excerpt || undefined,
      message: message.trim(),
      name,
      title,
      institution,
    });
    if (ok) router.back();
    else Alert.alert('E-posta uygulaması açılamadı', `Talebinizi ${CONTACT_EMAIL} adresine gönderebilir veya ${CONTACT_PHONE} numarasını arayabilirsiniz.`);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>
          İçerikteki bir hatayı bildirin ya da düzeltme önerin. Talebiniz, içeriğin uygulamadaki yeri otomatik eklenerek {CONTACT_EMAIL} adresine
          e-posta olarak hazırlanır.
        </Text>

        <Field label="İçerik">
          <TextInput value={location} onChangeText={setLocation} placeholder="Ör. Pelvis › Obstetrik çaplar" placeholderTextColor={colors.muted} style={styles.input} />
        </Field>

        {params.excerpt ? (
          <Card style={styles.excerpt}>
            <Text style={styles.excerptLabel}>Mevcut metin</Text>
            <Text style={styles.excerptText}>{params.excerpt}</Text>
          </Card>
        ) : null}

        <Field label="Talep türü">
          <View style={styles.kinds}>
            {KINDS.map((k) => (
              <Chip key={k} label={k} active={kind === k} onPress={() => setKind(k)} />
            ))}
          </View>
        </Field>

        <Field label="Açıklama / önerilen düzeltme *">
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Doğrusu ne olmalı? Kaynak belirtebilirsiniz."
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical="top"
          />
        </Field>

        <Field label="Ad soyad (isteğe bağlı)">
          <TextInput value={name} onChangeText={setName} placeholderTextColor={colors.muted} style={styles.input} autoComplete="name" />
        </Field>
        <Field label="Unvan (isteğe bağlı)">
          <TextInput value={title} onChangeText={setTitle} placeholder="Ör. Dr. Öğr. Üyesi" placeholderTextColor={colors.muted} style={styles.input} />
        </Field>
        <Field label="Kurum / bölüm (isteğe bağlı)">
          <TextInput value={institution} onChangeText={setInstitution} placeholder="Ör. X Üniversitesi Ebelik Bölümü" placeholderTextColor={colors.muted} style={styles.input} />
        </Field>

        <Button title="E-posta ile gönder" icon="mail-outline" onPress={send} style={{ marginTop: 8 }} />

        <Pressable onPress={callSupport} style={styles.phone} accessibilityRole="button" accessibilityLabel={`Telefonla ara: ${CONTACT_PHONE}`}>
          <Ionicons name="call-outline" size={18} color={colors.accent} />
          <Text style={styles.phoneText}>Telefonla ulaşın: {CONTACT_PHONE}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48, gap: 6 },
  intro: { fontSize: 14, color: colors.muted, lineHeight: 20, marginBottom: 6 },
  field: { gap: 6, marginTop: 8 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  multiline: { minHeight: 120 },
  kinds: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  excerpt: { marginTop: 8, gap: 4, borderLeftWidth: 4, borderLeftColor: colors.warning },
  excerptLabel: { fontSize: 12, fontWeight: '700', color: colors.muted },
  excerptText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  phone: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  phoneText: { color: colors.accent, fontWeight: '700' },
});
