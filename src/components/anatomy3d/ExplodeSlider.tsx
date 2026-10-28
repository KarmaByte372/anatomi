import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { colors } from '@/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  onDragChange?: (dragging: boolean) => void;
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Modeli parçalarına ayıran sürüklenebilir çubuk (0 = bütün beden, 1 = tamamen ayrık) */
export function ExplodeSlider({ value, onChange, onDragChange }: Props) {
  const [width, setWidth] = useState(1);
  const state = useRef({ start: 0, width: 1 });
  const callbacks = useRef({ onChange, onDragChange });
  useEffect(() => {
    callbacks.current = { onChange, onDragChange };
  });

  // PanResponder geri çağrıları ref'leri yalnızca dokunma olaylarında okur, render sırasında değil
  const responder = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          // Dokunulan noktaya atla, sonra parmağı izle
          const v = clamp01((e.nativeEvent.locationX - THUMB / 2) / state.current.width);
          state.current.start = v;
          callbacks.current.onDragChange?.(true);
          callbacks.current.onChange(v);
        },
        onPanResponderMove: (_, g) => callbacks.current.onChange(clamp01(state.current.start + g.dx / state.current.width)),
        onPanResponderRelease: () => callbacks.current.onDragChange?.(false),
        onPanResponderTerminate: () => callbacks.current.onDragChange?.(false),
      }),
    [],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.max(1, e.nativeEvent.layout.width - THUMB);
    state.current.width = w;
    setWidth(w);
  };

  return (
    <View style={styles.wrap}>
      <Ionicons name="body" size={16} color={colors.muted} />
      <View
        style={styles.trackArea}
        onLayout={onLayout}
        {...responder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel="Parçaları ayır"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => onChange(clamp01(value + (e.nativeEvent.actionName === 'increment' ? 0.1 : -0.1)))}
      >
        <View style={styles.track} pointerEvents="none">
          <View style={[styles.fill, { width: value * width + THUMB / 2 }]} />
        </View>
        <View style={[styles.thumb, { left: value * width }]} pointerEvents="none">
          <Ionicons name="git-network-outline" size={14} color="#fff" />
        </View>
      </View>
      <Text style={styles.label}>{value < 0.02 ? 'Ayır' : `%${Math.round(value * 100)}`}</Text>
    </View>
  );
}

const THUMB = 28;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card + 'F2',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  trackArea: { flex: 1, height: THUMB + 8, justifyContent: 'center' },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.primary },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: { width: 40, textAlign: 'right', fontSize: 12, fontWeight: '800', color: colors.text },
});
