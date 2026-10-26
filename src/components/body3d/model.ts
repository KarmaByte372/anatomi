import * as THREE from 'three';

/**
 * Parametrik 3D insan modeli. Vücut; baş, gövde, kollar, bacaklar gibi
 * yüzeylerden oluşur. Her bölge bu yüzeylerin (u: çevre açısı, v: uzunluk)
 * aralığından kesilmiş bir "yama"dır; böylece bölgeler gövdeye tam oturur.
 *
 * Koordinatlar: y yukarı, model ~17 birim boyunda, yüz +z yönüne bakar.
 * Hastanın sağı -x tarafındadır. u = 0 ön yüz, u = π arka yüzdür.
 */

type Surface = (u: number, v: number) => THREE.Vector3;

const SKIN = new THREE.Color('#F2D1BC');
const BASE = new THREE.Color('#E9C3AC');
const LINE = new THREE.Color('#B98468');

export const BODY_CENTER_Y = 8.6;
export const BODY_HEIGHT = 17.2;

// ---------- Yüzey tanımları ----------

function ellipsoid(center: THREE.Vector3, rx: number, ry: number, rz: number): Surface {
  return (u, v) => {
    const phi = v * Math.PI; // 0 = alt kutup, π = üst kutup
    const r = Math.sin(phi);
    return new THREE.Vector3(center.x + rx * r * Math.sin(u), center.y - ry * Math.cos(phi), center.z + rz * r * Math.cos(u));
  };
}

/** Anahtar değerler arasında yumuşak geçişli enterpolasyon */
function keyframes(points: [number, number][]): (t: number) => number {
  return (t) => {
    if (t <= points[0][0]) return points[0][1];
    for (let i = 1; i < points.length; i++) {
      const [t1, y1] = points[i];
      const [t0, y0] = points[i - 1];
      if (t <= t1) {
        const k = (t - t0) / (t1 - t0);
        const s = k * k * (3 - 2 * k);
        return y0 + (y1 - y0) * s;
      }
    }
    return points[points.length - 1][1];
  };
}

/** Gövde: y yüksekliğine göre değişen eliptik kesit (v: 0 = alt, 1 = üst) */
const TORSO_Y0 = 7.9;
const TORSO_Y1 = 14.2;
// Alt uçta perineye doğru daralarak kapanır
const torsoRx = keyframes([
  [7.9, 0.35],
  [8.25, 1.1],
  [8.8, 1.62],
  [9.4, 1.78],
  [10.5, 1.45],
  [11.8, 1.6],
  [12.8, 1.75],
  [13.6, 1.9],
  [14.0, 1.2],
  [14.2, 0.55],
]);
const torsoRz = keyframes([
  [7.9, 0.3],
  [8.3, 0.8],
  [9.2, 1.1],
  [10.5, 0.95],
  [12.2, 1.15],
  [13.6, 0.95],
  [14.0, 0.7],
  [14.2, 0.45],
]);

export const torsoY = (v: number) => TORSO_Y0 + (TORSO_Y1 - TORSO_Y0) * v;
export const torsoV = (y: number) => (y - TORSO_Y0) / (TORSO_Y1 - TORSO_Y0);

const torso: Surface = (u, v) => {
  const y = torsoY(v);
  return new THREE.Vector3(torsoRx(y) * Math.sin(u), y, torsoRz(y) * Math.cos(u));
};

/** A'dan B'ye uzanan, yarıçapı değişen tüp (kol/bacak). v: 0 = proksimal (A), 1 = distal (B) */
function limb(a: THREE.Vector3, b: THREE.Vector3, radius: (v: number) => number, depth = 1): Surface {
  const axis = new THREE.Vector3().subVectors(b, a);
  const dir = axis.clone().normalize();
  // Kol/bacak yukarıdan aşağı uzandığı için yüzey normallerinin dışa bakması adına yan eksen -x seçilir
  const side = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
  if (side.x > 0) side.multiplyScalar(-1);
  const front = new THREE.Vector3(0, 0, 1);
  return (u, v) => {
    const r = radius(v);
    return a
      .clone()
      .addScaledVector(axis, v)
      .addScaledVector(side, r * Math.sin(u))
      .addScaledVector(front, r * depth * Math.cos(u));
  };
}

// ---------- Vücut parçaları (iki yanlı olanlar s = -1 sağ, +1 sol) ----------

const head = ellipsoid(new THREE.Vector3(0, 15.75, 0.05), 0.95, 1.2, 1.05);
const neck = limb(new THREE.Vector3(0, 14.95, 0), new THREE.Vector3(0, 13.9, 0), () => 0.5, 0.95);

const shoulder = (s: number) => ellipsoid(new THREE.Vector3(s * 1.98, 13.45, 0), 0.62, 0.62, 0.62);
const upperArm = (s: number) =>
  limb(new THREE.Vector3(s * 2.12, 13.4, 0), new THREE.Vector3(s * 2.42, 10.6, 0), keyframes([[0, 0.48], [0.4, 0.44], [1, 0.36]]));
const forearm = (s: number) =>
  limb(new THREE.Vector3(s * 2.42, 10.6, 0), new THREE.Vector3(s * 2.6, 8.25, 0.05), keyframes([[0, 0.37], [0.3, 0.38], [1, 0.25]]));
const hand = (s: number) => ellipsoid(new THREE.Vector3(s * 2.66, 7.72, 0.06), 0.3, 0.62, 0.15);

const thigh = (s: number) =>
  limb(new THREE.Vector3(s * 0.92, 9.1, 0), new THREE.Vector3(s * 0.74, 4.9, 0), keyframes([[0, 0.8], [0.5, 0.68], [1, 0.5]]));
const leg = (s: number) =>
  limb(new THREE.Vector3(s * 0.74, 4.9, 0), new THREE.Vector3(s * 0.7, 0.85, 0), keyframes([[0, 0.5], [0.28, 0.55], [0.8, 0.33], [1, 0.3]]));
const foot = (s: number) => ellipsoid(new THREE.Vector3(s * 0.72, 0.38, 0.35), 0.36, 0.34, 0.85);

// ---------- Bölge yamaları ----------

type Patch = {
  region: string;
  surface: Surface;
  u: [number, number];
  v: [number, number];
  /** Üst üste binen bölgeler (örn. meme) için yüzeyden dışarı itme */
  lift?: number;
};

const PI = Math.PI;
const FRONT: [number, number] = [-PI / 2, PI / 2];
const BACK: [number, number] = [PI / 2, (3 * PI) / 2];
const sides = [-1, 1] as const; // -1: hastanın sağı, +1: solu
/** Sağ (s=-1) için u aralığını aynalar */
const mirror = (s: number, [a, b]: [number, number]): [number, number] => (s === 1 ? [a, b] : [-b, -a]);
const backMirror = (s: number, [a, b]: [number, number]): [number, number] => (s === 1 ? [a, b] : [2 * PI - b, 2 * PI - a]);

const tv = (y0: number, y1: number): [number, number] => [torsoV(y0), torsoV(y1)];

const PATCHES: Patch[] = [
  // Baş - ön
  { region: 'frontalis', surface: head, u: [-1.0, 1.0], v: [0.64, 0.86] },
  ...sides.map((s): Patch => ({ region: 'orbitalis', surface: head, u: mirror(s, [0.16, 0.62]), v: [0.53, 0.64], lift: 0.01 })),
  { region: 'nasalis', surface: head, u: [-0.16, 0.16], v: [0.4, 0.62], lift: 0.01 },
  ...sides.map((s): Patch => ({ region: 'buccalis', surface: head, u: mirror(s, [0.26, 1.05]), v: [0.3, 0.53] })),
  { region: 'oralis', surface: head, u: [-0.26, 0.26], v: [0.28, 0.4] },
  { region: 'mentalis', surface: head, u: [-0.5, 0.5], v: [0.1, 0.28] },
  // Baş - arka
  { region: 'occipitalis', surface: head, u: [PI - 1.7, PI + 1.7], v: [0.12, 0.88] },
  // Boyun
  { region: 'cervicalis-anterior', surface: neck, u: [-1.3, 1.3], v: [0, 1] },
  { region: 'nuchalis', surface: neck, u: [PI - 1.3, PI + 1.3], v: [0, 1] },

  // Gövde - göğüs
  ...sides.map((s): Patch => ({ region: 'pectoralis', surface: torso, u: mirror(s, [0.12, 1.3]), v: tv(11.9, 13.7) })),
  { region: 'sternalis', surface: torso, u: [-0.12, 0.12], v: tv(11.9, 13.7) },
  ...sides.map((s): Patch => ({ region: 'mammaria', surface: torso, u: mirror(s, [0.3, 0.85]), v: tv(12.0, 12.9), lift: 0.03 })),
  // Gövde - karın (9 bölge). Satırlar yukarıdan aşağı, sütunlar sağdan sola.
  { region: 'hypochondriaca-dextra', surface: torso, u: [-1.35, -0.4], v: tv(11.0, 11.9) },
  { region: 'epigastrica', surface: torso, u: [-0.4, 0.4], v: tv(11.0, 11.9) },
  { region: 'hypochondriaca-sinistra', surface: torso, u: [0.4, 1.35], v: tv(11.0, 11.9) },
  { region: 'lateralis-dextra', surface: torso, u: [-1.35, -0.4], v: tv(10.0, 11.0) },
  { region: 'umbilicalis', surface: torso, u: [-0.4, 0.4], v: tv(10.0, 11.0) },
  { region: 'lateralis-sinistra', surface: torso, u: [0.4, 1.35], v: tv(10.0, 11.0) },
  { region: 'inguinalis-dextra', surface: torso, u: [-1.35, -0.4], v: tv(8.95, 10.0) },
  { region: 'pubica', surface: torso, u: [-0.4, 0.4], v: tv(8.95, 10.0) },
  { region: 'inguinalis-sinistra', surface: torso, u: [0.4, 1.35], v: tv(8.95, 10.0) },
  { region: 'urogenitalis', surface: torso, u: [-0.4, 0.4], v: tv(7.9, 8.95) },
  // Gövde - sırt
  ...sides.map((s): Patch => ({ region: 'scapularis', surface: torso, u: backMirror(s, [PI - 1.3, PI - 0.12]), v: tv(12.2, 13.7) })),
  { region: 'vertebralis', surface: torso, u: [PI - 0.12, PI + 0.12], v: tv(9.8, 13.7) },
  ...sides.map((s): Patch => ({ region: 'infrascapularis', surface: torso, u: backMirror(s, [PI - 1.3, PI - 0.12]), v: tv(11.2, 12.2) })),
  ...sides.map((s): Patch => ({ region: 'lumbalis', surface: torso, u: backMirror(s, [PI - 1.3, PI - 0.12]), v: tv(9.8, 11.2) })),
  { region: 'sacralis', surface: torso, u: [PI - 0.32, PI + 0.32], v: tv(9.0, 9.8) },
  ...sides.map((s): Patch => ({ region: 'glutealis', surface: torso, u: backMirror(s, [PI - 1.4, PI - 0.32]), v: tv(8.15, 9.8) })),
  { region: 'analis', surface: torso, u: [PI - 0.32, PI + 0.32], v: tv(7.9, 9.0) },

  // Kollar
  ...sides.flatMap((s): Patch[] => [
    { region: 'deltoidea', surface: shoulder(s), u: [-PI, PI], v: [0.25, 1] },
    { region: 'brachialis-anterior', surface: upperArm(s), u: FRONT, v: [0.08, 0.88] },
    { region: 'brachialis-posterior', surface: upperArm(s), u: BACK, v: [0.08, 0.88] },
    { region: 'cubitalis-anterior', surface: upperArm(s), u: FRONT, v: [0.88, 1] },
    { region: 'cubitalis-anterior', surface: forearm(s), u: FRONT, v: [0, 0.12] },
    { region: 'olecrani', surface: upperArm(s), u: BACK, v: [0.88, 1] },
    { region: 'olecrani', surface: forearm(s), u: BACK, v: [0, 0.12] },
    { region: 'antebrachialis-anterior', surface: forearm(s), u: FRONT, v: [0.12, 0.9] },
    { region: 'carpalis-anterior', surface: forearm(s), u: FRONT, v: [0.9, 1] },
    { region: 'antebrachialis-posterior', surface: forearm(s), u: BACK, v: [0.12, 1] },
    { region: 'palmaris', surface: hand(s), u: FRONT, v: [0, 1] },
    { region: 'dorsum-manus', surface: hand(s), u: BACK, v: [0, 1] },
  ]),

  // Bacaklar
  ...sides.flatMap((s): Patch[] => [
    { region: 'femoralis-anterior', surface: thigh(s), u: FRONT, v: [0.08, 0.88] },
    { region: 'femoralis-posterior', surface: thigh(s), u: BACK, v: [0.2, 0.88] },
    { region: 'genus-anterior', surface: thigh(s), u: FRONT, v: [0.88, 1] },
    { region: 'genus-anterior', surface: leg(s), u: FRONT, v: [0, 0.08] },
    { region: 'poplitea', surface: thigh(s), u: BACK, v: [0.88, 1] },
    { region: 'poplitea', surface: leg(s), u: BACK, v: [0, 0.08] },
    { region: 'cruralis-anterior', surface: leg(s), u: FRONT, v: [0.08, 0.9] },
    { region: 'suralis', surface: leg(s), u: BACK, v: [0.08, 0.9] },
    { region: 'talocruralis', surface: leg(s), u: [-PI, PI], v: [0.9, 1] },
    { region: 'dorsum-pedis', surface: foot(s), u: [-2.0, 2.0], v: [0.55, 1] },
    { region: 'calcanea', surface: foot(s), u: [PI - 1.0, PI + 1.0], v: [0.05, 0.8] },
  ]),
];

// ---------- Geometri üretimi ----------

function surfaceGeometry(surface: Surface, [u0, u1]: [number, number], [v0, v1]: [number, number], lift = 0, segU = 18, segV = 10) {
  const positions: number[] = [];
  const indices: number[] = [];
  for (let j = 0; j <= segV; j++) {
    for (let i = 0; i <= segU; i++) {
      const p = surface(u0 + ((u1 - u0) * i) / segU, v0 + ((v1 - v0) * j) / segV);
      positions.push(p.x, p.y, p.z);
    }
  }
  for (let j = 0; j < segV; j++) {
    for (let i = 0; i < segU; i++) {
      const a = j * (segU + 1) + i;
      const b = a + 1;
      const c = a + segU + 1;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  if (lift) {
    const pos = geo.getAttribute('position');
    const nrm = geo.getAttribute('normal');
    for (let k = 0; k < pos.count; k++) {
      pos.setXYZ(k, pos.getX(k) + nrm.getX(k) * lift, pos.getY(k) + nrm.getY(k) * lift, pos.getZ(k) + nrm.getZ(k) * lift);
    }
  }
  return geo;
}

/** Yüzey normali (sonlu farklar); kutuplarda dejenere olursa sıfır döner */
function normalAt(surface: Surface, u: number, v: number): THREE.Vector3 {
  const e = 1e-3;
  const du = surface(u + e, v).sub(surface(u - e, v));
  const dv = surface(u, Math.min(1, v + e)).sub(surface(u, Math.max(0, v - e)));
  const n = du.cross(dv);
  return n.lengthSq() > 1e-12 ? n.normalize() : n;
}

function outline(surface: Surface, [u0, u1]: [number, number], [v0, v1]: [number, number], lift: number) {
  const pts: THREE.Vector3[] = [];
  const n = 24;
  // Çizgiyi yüzeyin hafif dışına taşı ki bölgenin üstünde görünür kalsın
  const push = (u: number, v: number) => pts.push(surface(u, v).addScaledVector(normalAt(surface, u, v), 0.015 + lift));
  for (let i = 0; i <= n; i++) push(u0 + ((u1 - u0) * i) / n, v0);
  for (let i = 0; i <= n; i++) push(u1, v0 + ((v1 - v0) * i) / n);
  for (let i = n; i >= 0; i--) push(u0 + ((u1 - u0) * i) / n, v1);
  for (let i = n; i >= 0; i--) push(u0, v0 + ((v1 - v0) * i) / n);
  return new THREE.BufferGeometry().setFromPoints(pts);
}

export type RegionMeshes = Map<string, THREE.Mesh[]>;

export type RegionInfo = {
  /** Bölgenin ortalama konumu */
  center: THREE.Vector3;
  /** Bölgenin baktığı yön (kameranın döneceği açı, radyan) */
  yaw: number;
};

export type BodyModel = {
  group: THREE.Group;
  regionMeshes: RegionMeshes;
  pickables: THREE.Mesh[];
  regionInfo: Map<string, RegionInfo>;
};

export function buildBody(): BodyModel {
  const group = new THREE.Group();
  const baseMaterial = new THREE.MeshStandardMaterial({ color: BASE, roughness: 0.75, metalness: 0 });

  // Bölgelerin altında boşluk kalmasın diye tam (kapalı) taban yüzeyleri
  const fullParts: Surface[] = [head, neck, torso, ...sides.flatMap((s) => [shoulder(s), upperArm(s), forearm(s), hand(s), thigh(s), leg(s), foot(s)])];
  for (const surface of fullParts) {
    const mesh = new THREE.Mesh(surfaceGeometry(surface, [-PI, PI], [0, 1], -0.006, 32, 20), baseMaterial);
    group.add(mesh);
  }

  const lineMaterial = new THREE.LineBasicMaterial({ color: LINE });
  const regionMeshes: RegionMeshes = new Map();
  const sums = new Map<string, { pos: THREE.Vector3; nrm: THREE.Vector3; count: number }>();

  for (const patch of PATCHES) {
    const geo = surfaceGeometry(patch.surface, patch.u, patch.v, patch.lift ?? 0);
    const material = new THREE.MeshStandardMaterial({
      color: SKIN,
      roughness: 0.7,
      metalness: 0,
      polygonOffset: true,
      polygonOffsetFactor: -1 - (patch.lift ? 2 : 0),
      polygonOffsetUnits: -1,
    });
    const mesh = new THREE.Mesh(geo, material);
    mesh.userData.region = patch.region;
    group.add(mesh);
    group.add(new THREE.Line(outline(patch.surface, patch.u, patch.v, patch.lift ?? 0), lineMaterial));

    const list = regionMeshes.get(patch.region) ?? [];
    list.push(mesh);
    regionMeshes.set(patch.region, list);

    const pos = geo.getAttribute('position');
    const nrm = geo.getAttribute('normal');
    const sum = sums.get(patch.region) ?? { pos: new THREE.Vector3(), nrm: new THREE.Vector3(), count: 0 };
    for (let k = 0; k < pos.count; k++) {
      sum.pos.add(new THREE.Vector3(pos.getX(k), pos.getY(k), pos.getZ(k)));
      sum.nrm.add(new THREE.Vector3(nrm.getX(k), 0, nrm.getZ(k)));
    }
    sum.count += pos.count;
    sums.set(patch.region, sum);
  }

  const regionInfo = new Map<string, RegionInfo>();
  for (const [id, sum] of sums) {
    const center = sum.pos.divideScalar(sum.count);
    regionInfo.set(id, { center, yaw: Math.atan2(sum.nrm.x, sum.nrm.z) });
  }

  return { group, regionMeshes, pickables: [...regionMeshes.values()].flat(), regionInfo };
}

export const COLORS = { skin: SKIN, base: BASE };

/** 3D modelde çizili olan tüm bölgeler */
export const MODEL_REGION_IDS: string[] = [...new Set(PATCHES.map((p) => p.region))];
