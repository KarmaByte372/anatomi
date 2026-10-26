import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ProgressProvider } from '@/lib/progress';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <ProgressProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontWeight: '700' },
          headerStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
          headerBackTitle: 'Geri',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="konu/[id]" options={{ title: 'Konu' }} />
        <Stack.Screen name="bolge/[id]" options={{ title: 'Bölge', presentation: 'modal' }} />
        <Stack.Screen name="calis/[deck]" options={{ title: 'Kart Çalış' }} />
        <Stack.Screen name="test/[deck]" options={{ title: 'Test' }} />
      </Stack>
    </ProgressProvider>
  );
}
