import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { useSettings } from '@/lib/settings';
import { colors } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const tab = (title: string, icon: IconName, activeIcon: IconName) => ({
  title,
  tabBarIcon: ({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) => (
    <Ionicons name={focused ? activeIcon : icon} size={size} color={color as string} />
  ),
});

export default function TabsLayout() {
  const { department } = useSettings();
  // İlk açılışta bölüm seçimi
  if (!department) return <Redirect href="/hosgeldin" />;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text, fontWeight: '800', fontSize: 20 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ ...tab('Ana Sayfa', 'home-outline', 'home'), headerShown: false }} />
      <Tabs.Screen name="vucut" options={tab('Vücut Haritası', 'body-outline', 'body')} />
      <Tabs.Screen name="konular" options={tab('Konular', 'book-outline', 'book')} />
      <Tabs.Screen name="kartlar" options={tab('Kartlar', 'albums-outline', 'albums')} />
      <Tabs.Screen name="sinav" options={tab('Test', 'checkmark-done-outline', 'checkmark-done')} />
    </Tabs>
  );
}
