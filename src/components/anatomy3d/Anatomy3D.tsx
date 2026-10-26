import { Ionicons } from '@expo/vector-icons';
import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';
import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, PanResponder, Pressable, StyleSheet, Text, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import * as THREE from 'three';

import { anatomyStructures } from '@/data/anatomy3d';
import type { AnatomyLayer } from '@/data/anatomyTypes';
import { colors } from '@/theme';
import { extractStructure, loadLayer, type LoadedLayer } from './loader';

/** Hedef nokta etrafında dönen yörünge kamerası */
type CameraState = { yaw: number; pitch: number; distance: number; target: THREE.Vector3 };

const MIN_DIST = 0.6;
const MAX_DIST = 32;
const BODY_CENTER = new THREE.Vector3(0, 7.7, 0);
const home = (): CameraState => ({ yaw: 0, pitch: 0.05, distance: 31.5, target: BODY_CENTER.clone() });
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const ALL_LAYERS: AnatomyLayer[] = ['deri', 'kas', 'iskelet', 'organ', 'damar', 'sinir'];

type Props = {
  layers: AnatomyLayer[];
  /** Deri katmanının opaklığı (0–1) */
  skinOpacity?: number;
  /** Yarı saydam "hayalet" olarak çizilecek katmanlar (içteki yapıyı göstermek için) */
  ghost?: AnatomyLayer[];
  /** Röntgen modunda tek başına opak çizilecek yapı ve rengi */
  isolate?: { id: number; color: string } | null;
  /** Yapı id → vurgu rengi */
  highlights?: Record<number, string>;
  onSelect?: (structureId: number | null) => void;
  /** key değiştiğinde kamera bu yapıya döner */
  focus?: { id: number; key: number } | null;
  onInteractingChange?: (interacting: boolean) => void;
  /** Yeni yüklenen katman ilk kez başarıyla çizildiğinde */
  onReady?: () => void;
  /** GL başlatma veya çizim hatasında (bileşen kapanmaz, hata bildirilir) */
  onError?: (error: unknown) => void;
  height?: number;
};

function applyOpacity(meshes: Map<AnatomyLayer, THREE.Mesh>, ghost: string[], skinOpacity: number) {
  for (const [layer, mesh] of meshes) {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const opacity = ghost.includes(layer) ? 0.12 : layer === 'deri' ? skinOpacity : 1;
    mat.opacity = opacity;
    mat.transparent = opacity < 0.99;
    mat.depthWrite = opacity >= 0.99;
    mesh.renderOrder = opacity < 0.99 ? 10 : 0;
    mat.needsUpdate = true;
  }
}

function shortestYaw(from: number, to: number): number {
  const a = ((from % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  let d = to - a;
  if (d > Math.PI) d -= 2 * Math.PI;
  if (d < -Math.PI) d += 2 * Math.PI;
  return from + d;
}

function facingLabel(yaw: number): string {
  const a = ((yaw % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  if (a < Math.PI / 4 || a > (7 * Math.PI) / 4) return 'Ön';
  if (a < (3 * Math.PI) / 4) return 'Sol yan';
  if (a < (5 * Math.PI) / 4) return 'Arka';
  return 'Sağ yan';
}

export function Anatomy3D({ layers, skinOpacity = 1, ghost = [], isolate = null, highlights = {}, onSelect, focus, onInteractingChange, onReady, onError, height = 480 }: Props) {
  const size = useRef({ width: 1, height: 1 });
  const camera = useRef(new THREE.PerspectiveCamera(32, 1, 0.05, 200));
  const current = useRef<CameraState>(home());
  const goal = useRef<CameraState>(home());
  const dirty = useRef(true);
  /** Yeni bir katman sahneye eklendi; çizilince onReady bildirilir */
  const newLayerDrawn = useRef(false);
  const callbacks = useRef({ onSelect, onInteractingChange, onReady, onError });
  useEffect(() => {
    callbacks.current = { onSelect, onInteractingChange, onReady, onError };
  });

  // Sahne nesneleri (GL bağlamından bağımsız oluşturulur)
  const scene = useMemo(() => new THREE.Scene(), []);
  const meshes = useRef(new Map<AnatomyLayer, THREE.Mesh>());
  const loaded = useRef(new Map<AnatomyLayer, LoadedLayer>());
  const [loading, setLoading] = useState<AnatomyLayer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [facing, setFacing] = useState('Ön');
  const appliedHighlights = useRef<Record<number, string>>({});

  const rangeOf = (id: number) => {
    const s = anatomyStructures[id];
    const l = s && loaded.current.get(s.layer);
    return l?.ranges.find((r) => r.id === id);
  };

  // Vurguyu köşe renklerine uygula / eski vurguyu geri al
  function paint(id: number, colorHex: string | null) {
    const s = anatomyStructures[id];
    const layer = s && loaded.current.get(s.layer);
    const range = layer?.ranges.find((r) => r.id === id);
    if (!layer || !range) return;
    const attr = layer.geometry.getAttribute('color') as THREE.BufferAttribute;
    const c = new THREE.Color(colorHex ?? s.color);
    for (let v = range.vertexStart; v < range.vertexStart + range.vertexCount; v++) attr.setXYZ(v, c.r, c.g, c.b);
    attr.needsUpdate = true;
  }

  function applyHighlights() {
    const prev = appliedHighlights.current;
    for (const id of Object.keys(prev).map(Number)) if (!(id in highlights)) paint(id, null);
    for (const [id, col] of Object.entries(highlights)) if (prev[Number(id)] !== col) paint(Number(id), col);
    appliedHighlights.current = { ...highlights };
    dirty.current = true;
  }

  // Katmanları yükle ve görünürlüğü ayarla
  useEffect(() => {
    let cancelled = false;
    for (const layer of ALL_LAYERS) {
      const mesh = meshes.current.get(layer);
      if (mesh) mesh.visible = layers.includes(layer);
    }
    dirty.current = true;
    const missing = layers.filter((l) => !meshes.current.has(l));
    if (missing.length === 0) {
      // Katmanlar zaten yüklü: bir sonraki kare çizilince hazır say
      newLayerDrawn.current = true;
      return;
    }
    setLoading((s) => [...new Set([...s, ...missing])]);
    for (const layer of missing) {
      loadLayer(layer)
        .then((data) => {
          if (cancelled || meshes.current.has(layer)) return;
          const isSkin = layer === 'deri';
          const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: layer === 'iskelet' ? 0.8 : 0.6,
            metalness: 0,
            side: isSkin ? THREE.FrontSide : THREE.DoubleSide,
            transparent: isSkin,
            depthWrite: !isSkin,
          });
          const mesh = new THREE.Mesh(data.geometry, material);
          mesh.userData.layer = layer;
          // Saydam deri en son çizilsin
          mesh.renderOrder = isSkin ? 10 : 0;
          loaded.current.set(layer, data);
          meshes.current.set(layer, mesh);
          scene.add(mesh);
          newLayerDrawn.current = true;
          applyHighlights();
        })
        .catch((e: unknown) => {
          setError(String(e));
          callbacks.current.onError?.(e);
        })
        .finally(() => !cancelled && setLoading((s) => s.filter((l) => l !== layer)));
    }
    return () => {
      cancelled = true;
    };
    // applyHighlights yalnızca yeni yüklenen katmana uygulanır
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, scene]);

  // Deri opaklığı ve hayalet katmanlar
  const ghostKey = ghost.join(',');
  useEffect(() => {
    applyOpacity(meshes.current, ghostKey.split(','), skinOpacity);
    dirty.current = true;
  }, [skinOpacity, ghostKey, loading]);

  useEffect(applyHighlights, [highlights, loading]);

  // Seçilen yapıyı ayrı, opak bir ağ olarak çiz
  const isolated = useRef<THREE.Mesh | null>(null);
  const isoId = isolate?.id ?? null;
  const isoColor = isolate?.color ?? null;
  useEffect(() => {
    if (isolated.current) {
      scene.remove(isolated.current);
      isolated.current.geometry.dispose();
      (isolated.current.material as THREE.Material).dispose();
      isolated.current = null;
    }
    if (isoId !== null && isoColor) {
      const s = anatomyStructures[isoId];
      const layer = s && loaded.current.get(s.layer);
      const range = layer?.ranges.find((r) => r.id === isoId);
      if (layer && range) {
        const mesh = new THREE.Mesh(
          extractStructure(layer, range),
          new THREE.MeshStandardMaterial({ color: isoColor, roughness: 0.55, side: THREE.DoubleSide }),
        );
        mesh.userData.structure = isoId;
        isolated.current = mesh;
        scene.add(mesh);
      }
    }
    dirty.current = true;
  }, [isoId, isoColor, loading, scene]);

  useEffect(() => {
    if (!focus) return;
    let tries = 0;
    const tryFocus = () => {
      const r = rangeOf(focus.id);
      if (!r) {
        // Katman henüz yükleniyorsa kısa süre sonra tekrar dene
        if (tries++ < 40) timer = setTimeout(tryFocus, 150);
        return;
      }
      const dir = new THREE.Vector3(r.center.x, 0, r.center.z);
      // Orta hattaki yapılarda önden, yandakilerde dış taraftan bak
      const yaw = Math.abs(r.center.x) > 0.6 && Math.abs(r.center.x) > Math.abs(r.center.z) ? Math.atan2(dir.x, 0) : r.center.z < -0.5 ? Math.PI : 0;
      goal.current = {
        yaw: shortestYaw(goal.current.yaw, yaw),
        pitch: 0.1,
        distance: clamp(r.radius * 6, 3.5, 16),
        target: r.center.clone(),
      };
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    tryFocus();
    return () => clearTimeout(timer);
  }, [focus]);

  function pick(x: number, y: number) {
    const { width, height: h } = size.current;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2((x / width) * 2 - 1, -(y / h) * 2 + 1), camera.current);
    // Yarı saydam katmanlar dokunmayı engellemesin
    const targets = [...meshes.current.values()].filter((m) => m.visible && !(m.material as THREE.Material).transparent);
    if (isolated.current) targets.push(isolated.current);
    const hit = raycaster.intersectObjects(targets, false)[0];
    if (!hit || !hit.face) {
      callbacks.current.onSelect?.(null);
      return;
    }
    if (hit.object === isolated.current) {
      callbacks.current.onSelect?.(hit.object.userData.structure as number);
      return;
    }
    const data = loaded.current.get(hit.object.userData.layer as AnatomyLayer);
    if (data) callbacks.current.onSelect?.(data.structureOfVertex[hit.face.a]);
  }

  function zoomBy(factor: number) {
    goal.current.distance = clamp(goal.current.distance * factor, MIN_DIST, MAX_DIST);
  }

  // Dokunma: tek parmak döndür, iki parmak yakınlaştır + kaydır, kısa dokunuş seç
  const gesture = useRef({ x: 0, y: 0, time: 0, moved: false, pinch: 0, pinchStart: 0, cx: 0, cy: 0, last: { dx: 0, dy: 0 } });
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
          g.x = e.nativeEvent.locationX;
          g.y = e.nativeEvent.locationY;
          g.time = e.nativeEvent.timestamp;
          g.moved = false;
          g.pinch = 0;
          g.last = { dx: 0, dy: 0 };
          callbacks.current.onInteractingChange?.(true);
        },
        onPanResponderMove: (e, state) => {
          const g = gesture.current;
          const touches = e.nativeEvent.touches;
          if (touches && touches.length >= 2) {
            const d = Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
            const cx = (touches[0].pageX + touches[1].pageX) / 2;
            const cy = (touches[0].pageY + touches[1].pageY) / 2;
            if (!g.pinch) {
              g.pinch = d;
              g.pinchStart = goal.current.distance;
            } else {
              goal.current.distance = clamp((g.pinchStart * g.pinch) / d, MIN_DIST, MAX_DIST);
              // İki parmağın ortası hareket ettikçe modeli kaydır
              const cam = camera.current;
              const k = (goal.current.distance * 0.0016 * 400) / Math.max(size.current.height, 1);
              const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
              const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
              goal.current.target.addScaledVector(right, -(cx - g.cx) * k).addScaledVector(up, (cy - g.cy) * k);
              current.current.target.copy(goal.current.target);
              current.current.distance = goal.current.distance;
            }
            g.cx = cx;
            g.cy = cy;
            g.moved = true;
            dirty.current = true;
            return;
          }
          if (g.pinch) return;
          const ddx = state.dx - g.last.dx;
          const ddy = state.dy - g.last.dy;
          g.last = { dx: state.dx, dy: state.dy };
          if (Math.abs(state.dx) + Math.abs(state.dy) > 6) g.moved = true;
          goal.current.yaw -= ddx * 0.01;
          goal.current.pitch = clamp(goal.current.pitch + ddy * 0.008, -1.45, 1.45);
          current.current.yaw = goal.current.yaw;
          current.current.pitch = goal.current.pitch;
          dirty.current = true;
        },
        onPanResponderRelease: (e) => {
          const g = gesture.current;
          callbacks.current.onInteractingChange?.(false);
          if (!g.moved && e.nativeEvent.timestamp - g.time < 400) pick(g.x, g.y);
        },
        onPanResponderTerminate: () => callbacks.current.onInteractingChange?.(false),
      }),
    [],
  );

  // Web'de fare tekerleği ile yakınlaştırma
  const containerRef = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => {
    const node = containerRef.current as unknown as HTMLElement | null;
    if (!node || typeof node.addEventListener !== 'function') return;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      zoomBy(ev.deltaY > 0 ? 1.12 : 1 / 1.12);
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, []);

  const frame = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  function onContextCreate(gl: ExpoWebGLRenderingContext) {
    try {
      setupGL(gl);
    } catch (e) {
      callbacks.current.onError?.(e);
    }
  }

  function setupGL(gl: ExpoWebGLRenderingContext) {
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
            getContext: () => gl,
          } as unknown as HTMLCanvasElement);

    // expo-gl'in desteklemediği pixelStorei parametrelerinde uyarıları sustur
    const pixelStorei = gl.pixelStorei.bind(gl);
    gl.pixelStorei = (pname: number, param: number | boolean) => {
      if (pname === gl.UNPACK_FLIP_Y_WEBGL || pname === gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL || pname === gl.UNPACK_COLORSPACE_CONVERSION_WEBGL) return;
      pixelStorei(pname, param as number);
    };

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl as unknown as WebGL2RenderingContext, antialias: true });
    renderer.setPixelRatio(1);
    renderer.setSize(width, heightPx, false);
    renderer.setClearColor(new THREE.Color('#F7EFEA'), 1);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xcbb6aa, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.6);
    fill.position.set(-10, 4, -12);
    scene.add(fill);

    const cam = camera.current;
    cam.aspect = width / heightPx;
    cam.updateProjectionMatrix();

    let lastFacing = '';
    const render = () => {
      try {
        drawFrame();
      } catch (e) {
        // Çizim hatasında döngüyü durdur ve bildir; uygulama kapanmasın
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        frame.current = null;
        callbacks.current.onError?.(e);
      }
    };
    const drawFrame = () => {
      frame.current = requestAnimationFrame(render);
      const c = current.current;
      const t = goal.current;
      const k = 0.2;
      const moving =
        Math.abs(t.yaw - c.yaw) > 1e-4 ||
        Math.abs(t.pitch - c.pitch) > 1e-4 ||
        Math.abs(t.distance - c.distance) > 1e-4 ||
        c.target.distanceToSquared(t.target) > 1e-8;
      // Değişiklik yoksa çizme (pil tasarrufu)
      if (!moving && !dirty.current) return;
      dirty.current = false;
      c.yaw += (t.yaw - c.yaw) * k;
      c.pitch += (t.pitch - c.pitch) * k;
      c.distance += (t.distance - c.distance) * k;
      c.target.lerp(t.target, k);

      cam.position.set(
        c.target.x + Math.sin(c.yaw) * Math.cos(c.pitch) * c.distance,
        c.target.y + Math.sin(c.pitch) * c.distance,
        c.target.z + Math.cos(c.yaw) * Math.cos(c.pitch) * c.distance,
      );
      cam.lookAt(c.target);
      // Işık kamerayla birlikte döner; her açıdan aydınlık görünür
      key.position.copy(cam.position).add(new THREE.Vector3(4, 6, 0));
      renderer.render(scene, cam);
      gl.endFrameEXP();
      if (newLayerDrawn.current) {
        newLayerDrawn.current = false;
        callbacks.current.onReady?.();
      }

      const f = facingLabel(c.yaw);
      if (f !== lastFacing) {
        lastFacing = f;
        setFacing(f);
      }
    };
    dirty.current = true;
    render();
  }

  const onLayout = (e: LayoutChangeEvent) => {
    size.current = { width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height };
  };

  const rotateTo = (yaw: number) => {
    goal.current.yaw = shortestYaw(goal.current.yaw, yaw);
  };

  return (
    <View style={[styles.wrap, { height }]}>
      <View ref={containerRef} style={StyleSheet.absoluteFill} onLayout={onLayout} {...responder.panHandlers}>
        <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
      </View>

      <View style={styles.facing} pointerEvents="none">
        <Text style={styles.facingText}>{facing}</Text>
      </View>

      {(loading.length > 0 || error) && (
        <View style={styles.loading} pointerEvents="none">
          {error ? (
            <Text style={styles.loadingText}>Model yüklenemedi: {error}</Text>
          ) : (
            <>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingText}>3D model yükleniyor…</Text>
            </>
          )}
        </View>
      )}

      <View style={styles.zoom}>
        <RoundButton icon="add" onPress={() => zoomBy(1 / 1.4)} />
        <RoundButton icon="remove" onPress={() => zoomBy(1.4)} />
        <RoundButton
          icon="scan-outline"
          onPress={() => {
            goal.current = { ...home(), yaw: Math.round(goal.current.yaw / (2 * Math.PI)) * 2 * Math.PI };
          }}
        />
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
  wrap: { width: '100%', borderRadius: 18, overflow: 'hidden', backgroundColor: '#F7EFEA' },
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
  loading: {
    position: 'absolute',
    top: '42%',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card + 'EE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loadingText: { fontSize: 13, color: colors.muted, fontWeight: '600' },
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
