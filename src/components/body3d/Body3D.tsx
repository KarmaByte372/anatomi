import { Ionicons } from '@expo/vector-icons';
import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';
import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import * as THREE from 'three';

import { colors } from '@/theme';
import { BODY_CENTER_Y, BODY_HEIGHT, buildBody, COLORS, type BodyModel } from './model';

/** Kamera: hedef nokta etrafında dönen (yaw) ve uzaklığı değişen yörünge kamerası */
type CameraState = { yaw: number; pitch: number; distance: number; targetY: number };

const MIN_DIST = 4;
const MAX_DIST = 34;
const HOME: CameraState = { yaw: 0, pitch: 0.08, distance: 31, targetY: BODY_CENTER_Y };
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export type Body3DHandle = { focus: (regionId: string) => void };

type Props = {
  /** Bölge id → vurgu rengi */
  highlights?: Record<string, string>;
  onSelect?: (regionId: string) => void;
  /** Değiştiğinde (key ile) kamera bu bölgeye döner ve yakınlaşır */
  focus?: { id: string; key: number } | null;
  /** Kullanıcı modeli döndürürken true; üstteki ScrollView'ü kilitlemek için */
  onInteractingChange?: (interacting: boolean) => void;
  height?: number;
};

function facingLabel(yaw: number): string {
  const a = ((yaw % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  if (a < Math.PI / 4 || a > (7 * Math.PI) / 4) return 'Ön yüz';
  if (a < (3 * Math.PI) / 4) return 'Sol yan';
  if (a < (5 * Math.PI) / 4) return 'Arka yüz';
  return 'Sağ yan';
}

export function Body3D({ highlights = {}, onSelect, focus, onInteractingChange, height = 460 }: Props) {
  const model = useMemo<BodyModel>(() => buildBody(), []);
  const size = useRef({ width: 1, height: 1 });
  const camera = useRef(new THREE.PerspectiveCamera(32, 1, 0.1, 200));
  // Gerçek (çizilen) ve hedef kamera durumu; her karede hedefe doğru yumuşakça yaklaşır
  const current = useRef<CameraState>({ ...HOME });
  const goal = useRef<CameraState>({ ...HOME });
  const callbacks = useRef({ onSelect, onInteractingChange });
  useEffect(() => {
    callbacks.current = { onSelect, onInteractingChange };
  });
  const [facing, setFacing] = useState('Ön yüz');

  // Vurguları malzemelere uygula
  useEffect(() => {
    for (const [id, meshes] of model.regionMeshes) {
      const color = highlights[id];
      for (const mesh of meshes) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.color.set(color ?? COLORS.skin);
        mat.emissive.set(color ? new THREE.Color(color).multiplyScalar(0.25) : new THREE.Color(0, 0, 0));
      }
    }
  }, [highlights, model]);

  useEffect(() => {
    if (!focus) return;
    const info = model.regionInfo.get(focus.id);
    if (!info) return;
    // En kısa yoldan dön
    const from = goal.current.yaw;
    let delta = info.yaw - (((from % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    goal.current = { yaw: from + delta, pitch: 0.12, distance: 12, targetY: info.center.y };
  }, [focus, model]);

  function pick(x: number, y: number) {
    const { width, height: h } = size.current;
    const ndc = new THREE.Vector2((x / width) * 2 - 1, -(y / h) * 2 + 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, camera.current);
    const hit = raycaster.intersectObjects(model.pickables, false)[0];
    const region = hit?.object.userData.region as string | undefined;
    if (region) callbacks.current.onSelect?.(region);
  }

  function zoomBy(factor: number) {
    goal.current.distance = clamp(goal.current.distance * factor, MIN_DIST, MAX_DIST);
  }

  // Dokunma hareketleri: tek parmak döndür (yatay) / kaydır (dikey), iki parmak yakınlaştır, kısa dokunuş seç
  const gesture = useRef({ startX: 0, startY: 0, time: 0, moved: false, pinchDist: 0, pinchStart: 0, last: { dx: 0, dy: 0 } });
  // PanResponder geri çağrıları ref'leri yalnızca dokunma olaylarında okur, render sırasında değil
  const responder = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e: GestureResponderEvent) => {
          const g = gesture.current;
          g.startX = e.nativeEvent.locationX;
          g.startY = e.nativeEvent.locationY;
          g.time = e.nativeEvent.timestamp;
          g.moved = false;
          g.pinchDist = 0;
          g.last = { dx: 0, dy: 0 };
          callbacks.current.onInteractingChange?.(true);
        },
        onPanResponderMove: (e, state) => {
          const g = gesture.current;
          const touches = e.nativeEvent.touches;
          if (touches && touches.length >= 2) {
            const d = Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
            if (!g.pinchDist) {
              g.pinchDist = d;
              g.pinchStart = goal.current.distance;
            } else {
              goal.current.distance = clamp((g.pinchStart * g.pinchDist) / d, MIN_DIST, MAX_DIST);
              current.current.distance = goal.current.distance;
            }
            g.moved = true;
            g.last = { dx: state.dx, dy: state.dy };
            return;
          }
          if (g.pinchDist) return; // pinch bittikten sonra kalan tek parmak hareketini yok say
          const ddx = state.dx - g.last.dx;
          const ddy = state.dy - g.last.dy;
          g.last = { dx: state.dx, dy: state.dy };
          if (Math.abs(state.dx) + Math.abs(state.dy) > 6) g.moved = true;
          const k = goal.current.distance / MAX_DIST;
          goal.current.yaw -= ddx * 0.012;
          goal.current.targetY = clamp(goal.current.targetY + ddy * 0.035 * Math.max(k, 0.25), 0.5, BODY_HEIGHT - 0.5);
          current.current.yaw = goal.current.yaw;
          current.current.targetY = goal.current.targetY;
        },
        onPanResponderRelease: (e) => {
          const g = gesture.current;
          callbacks.current.onInteractingChange?.(false);
          if (!g.moved && e.nativeEvent.timestamp - g.time < 400) pick(g.startX, g.startY);
        },
        onPanResponderTerminate: () => callbacks.current.onInteractingChange?.(false),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model],
  );

  // Web'de fare tekerleği ile yakınlaştırma
  const containerRef = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => {
    const node = containerRef.current as unknown as HTMLElement | null;
    if (!node || typeof node.addEventListener !== 'function') return;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      zoomBy(ev.deltaY > 0 ? 1.1 : 1 / 1.1);
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, []);

  const frame = useRef<number | null>(null);
  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  function onContextCreate(gl: ExpoWebGLRenderingContext) {
    const width = gl.drawingBufferWidth;
    const heightPx = gl.drawingBufferHeight;
    // expo-gl gerçek bir canvas sağlamaz; three.js'in beklediği alanlarla sahte bir canvas veriyoruz
    const webCanvas = (gl as unknown as { canvas?: HTMLCanvasElement }).canvas;
    const canvas =
      webCanvas && typeof webCanvas.addEventListener === 'function'
        ? webCanvas
        : ({
            width,
            height: heightPx,
            style: {},
            addEventListener: () => {},
            removeEventListener: () => {},
            clientWidth: width,
            clientHeight: heightPx,
          } as unknown as HTMLCanvasElement);

    // expo-gl'in desteklemediği pixelStorei parametreleri için uyarıları sustur
    const pixelStorei = gl.pixelStorei.bind(gl);
    gl.pixelStorei = (pname: number, param: number | boolean) => {
      if (pname === gl.UNPACK_FLIP_Y_WEBGL || pname === gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL || pname === gl.UNPACK_COLORSPACE_CONVERSION_WEBGL) return;
      pixelStorei(pname, param as number);
    };

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl as unknown as WebGL2RenderingContext, antialias: true });
    renderer.setPixelRatio(1);
    renderer.setSize(width, heightPx, false);
    renderer.setClearColor(new THREE.Color(colors.bg), 1);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9c2b8, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(6, 14, 12);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.7);
    rim.position.set(-8, 6, -10);
    scene.add(rim);

    // Zemin gölgesi yerine yumuşak bir disk
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 48),
      new THREE.MeshBasicMaterial({ color: colors.border, transparent: true, opacity: 0.7 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.02;
    scene.add(floor);
    scene.add(model.group);

    const cam = camera.current;
    cam.aspect = width / heightPx;
    cam.updateProjectionMatrix();

    let lastFacing = '';
    const render = () => {
      const c = current.current;
      const t = goal.current;
      const k = 0.18;
      c.yaw += (t.yaw - c.yaw) * k;
      c.pitch += (t.pitch - c.pitch) * k;
      c.distance += (t.distance - c.distance) * k;
      c.targetY += (t.targetY - c.targetY) * k;

      const target = new THREE.Vector3(0, c.targetY, 0);
      cam.position.set(
        target.x + Math.sin(c.yaw) * Math.cos(c.pitch) * c.distance,
        target.y + Math.sin(c.pitch) * c.distance,
        target.z + Math.cos(c.yaw) * Math.cos(c.pitch) * c.distance,
      );
      cam.lookAt(target);
      renderer.render(scene, cam);
      gl.endFrameEXP();

      const f = facingLabel(c.yaw);
      if (f !== lastFacing) {
        lastFacing = f;
        setFacing(f);
      }
      frame.current = requestAnimationFrame(render);
    };
    render();
  }

  const onLayout = (e: LayoutChangeEvent) => {
    size.current = { width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height };
  };

  const rotateTo = (yaw: number) => {
    const from = goal.current.yaw;
    let delta = yaw - (((from % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    goal.current.yaw = from + delta;
  };

  return (
    <View style={[styles.wrap, { height }]}>
      <View ref={containerRef} style={StyleSheet.absoluteFill} onLayout={onLayout} {...responder.panHandlers}>
        <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
      </View>

      <View style={styles.facing} pointerEvents="none">
        <Text style={styles.facingText}>{facing}</Text>
      </View>

      <View style={styles.zoom}>
        <RoundButton icon="add" onPress={() => zoomBy(1 / 1.4)} />
        <RoundButton icon="remove" onPress={() => zoomBy(1.4)} />
        <RoundButton icon="scan-outline" onPress={() => (goal.current = { ...HOME, yaw: Math.round(goal.current.yaw / (2 * Math.PI)) * 2 * Math.PI })} />
      </View>

      <View style={styles.views}>
        <SmallButton label="Ön" onPress={() => rotateTo(0)} />
        <SmallButton label="Sol" onPress={() => rotateTo(Math.PI / 2)} />
        <SmallButton label="Arka" onPress={() => rotateTo(Math.PI)} />
        <SmallButton label="Sağ" onPress={() => rotateTo((3 * Math.PI) / 2)} />
      </View>
    </View>
  );
}

function RoundButton({ icon, onPress }: { icon: 'add' | 'remove' | 'scan-outline'; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.round, pressed && { opacity: 0.7 }]} hitSlop={4}>
      <Ionicons name={icon} size={20} color={colors.text} />
    </Pressable>
  );
}

function SmallButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.small, pressed && { opacity: 0.7 }]}>
      <Text style={styles.smallText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', borderRadius: 18, overflow: 'hidden', backgroundColor: colors.bg },
  facing: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.card + 'E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  facingText: { fontSize: 12, fontWeight: '700', color: colors.muted },
  zoom: { position: 'absolute', right: 10, top: 10, gap: 8 },
  round: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  views: { position: 'absolute', bottom: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  smallText: { fontSize: 12, fontWeight: '700', color: colors.text },
});
