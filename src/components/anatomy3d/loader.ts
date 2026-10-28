import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import * as THREE from 'three';

import { anatomyStructures } from '@/data/anatomy3d';
import { breadcrumb } from '@/lib/crashGuard';
import type { AnatomyLayer, AnatomyModel } from '@/data/anatomyTypes';

export type DetailLevel = 'yuksek' | 'standart';

/* eslint-disable @typescript-eslint/no-require-imports */
const LAYER_ASSETS: Record<AnatomyModel, Record<DetailLevel, Record<AnatomyLayer, number>>> = {
  erkek: {
    yuksek: {
      deri: require('../../../assets/anatomy/erkek/yuksek/deri.bin'),
      kas: require('../../../assets/anatomy/erkek/yuksek/kas.bin'),
      iskelet: require('../../../assets/anatomy/erkek/yuksek/iskelet.bin'),
      organ: require('../../../assets/anatomy/erkek/yuksek/organ.bin'),
      damar: require('../../../assets/anatomy/erkek/yuksek/damar.bin'),
      sinir: require('../../../assets/anatomy/erkek/yuksek/sinir.bin'),
    },
    standart: {
      deri: require('../../../assets/anatomy/erkek/standart/deri.bin'),
      kas: require('../../../assets/anatomy/erkek/standart/kas.bin'),
      iskelet: require('../../../assets/anatomy/erkek/standart/iskelet.bin'),
      organ: require('../../../assets/anatomy/erkek/standart/organ.bin'),
      damar: require('../../../assets/anatomy/erkek/standart/damar.bin'),
      sinir: require('../../../assets/anatomy/erkek/standart/sinir.bin'),
    },
  },
  kadin: {
    yuksek: {
      deri: require('../../../assets/anatomy/kadin/yuksek/deri.bin'),
      kas: require('../../../assets/anatomy/kadin/yuksek/kas.bin'),
      iskelet: require('../../../assets/anatomy/kadin/yuksek/iskelet.bin'),
      organ: require('../../../assets/anatomy/kadin/yuksek/organ.bin'),
      damar: require('../../../assets/anatomy/kadin/yuksek/damar.bin'),
      sinir: require('../../../assets/anatomy/kadin/yuksek/sinir.bin'),
    },
    standart: {
      deri: require('../../../assets/anatomy/kadin/standart/deri.bin'),
      kas: require('../../../assets/anatomy/kadin/standart/kas.bin'),
      iskelet: require('../../../assets/anatomy/kadin/standart/iskelet.bin'),
      organ: require('../../../assets/anatomy/kadin/standart/organ.bin'),
      damar: require('../../../assets/anatomy/kadin/standart/damar.bin'),
      sinir: require('../../../assets/anatomy/kadin/standart/sinir.bin'),
    },
  },
};
/* eslint-enable @typescript-eslint/no-require-imports */

export type StructureRange = {
  id: number;
  vertexStart: number;
  vertexCount: number;
  indexStart: number;
  indexCount: number;
  center: THREE.Vector3;
  radius: number;
  /** Tamamen ayrık görünümde yapının kayma vektörü (explode = 1 iken) */
  explode: THREE.Vector3;
};

/** Ayrık görünüm: kayma vektörleri int16 olarak saklanır, gölgelendiricide bu ölçekle çarpılır */
export const EXPLODE_SCALE = 32;
/** Parçalar bu noktadan uzaklaşır (gövde ortası) */
const EXPLODE_CENTER_Y = 7.7;
/** Dış katmanlar daha çok, iç katmanlar daha az kayar; böylece iç içe katmanlar da birbirinden ayrılır */
const EXPLODE_LAYER: Record<AnatomyLayer, number> = { deri: 1.5, kas: 1.15, damar: 1.0, sinir: 1.0, organ: 0.85, iskelet: 0.7 };

/**
 * Yapının merkezden uzaklığıyla orantılı kayma: yüzeye yakın yapılar derindekilerden daha çok uzaklaşır,
 * kol/bacaklar yana, ön ve arka kaslar öne/arkaya açılır. Dikeyde daha az yayılır ki beden ekrana sığsın.
 */
function explodeVector(layer: AnatomyLayer, center: THREE.Vector3): THREE.Vector3 {
  const k = EXPLODE_LAYER[layer] * 1.7;
  return new THREE.Vector3(center.x * k, (center.y - EXPLODE_CENTER_Y) * 0.3 * k, center.z * k);
}

export type LoadedLayer = {
  layer: AnatomyLayer;
  geometry: THREE.BufferGeometry;
  /** Köşe → yapı id'si (dokunulan üçgenden yapıyı bulmak için) */
  structureOfVertex: Uint16Array;
  ranges: StructureRange[];
};

type Header = {
  scale: [number, number, number];
  offset: [number, number, number];
  /** f: kas lif yönü (yapının en uzun ekseni) */
  structures: { s: number; vc: number; ic: number; i32: boolean; f?: [number, number, number] }[];
};

async function readAsset(layer: AnatomyLayer, moduleId: number): Promise<ArrayBuffer> {
  const asset = Asset.fromModule(moduleId);
  if (Platform.OS === 'web') {
    const res = await fetch(asset.uri);
    return res.arrayBuffer();
  }
  breadcrumb(`${layer}: dosya hazırlanıyor`);
  await asset.downloadAsync();
  breadcrumb(`${layer}: dosya okunuyor`);
  return new File(asset.localUri ?? asset.uri).arrayBuffer();
}

/** Başlık yalnızca ASCII içerir; TextDecoder her motorda olmadığı için elle çözülür */
function asciiDecode(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return s;
}

const align4 = (n: number) => (n + 3) & ~3;

/** Kaynak modelde gövdenin ön-arka merkezi z ≈ 1; dönme ekseni ortada olsun diye kaydırılır */
const Z_SHIFT = -1.0;

export function parseLayer(layer: AnatomyLayer, buffer: ArrayBuffer): LoadedLayer {
  const view = new DataView(buffer);
  const magic = asciiDecode(new Uint8Array(buffer, 0, 4));
  if (magic !== 'ANT2') throw new Error(`Geçersiz anatomi dosyası: ${layer}`);
  const headerLen = view.getUint32(4, true);
  const header = JSON.parse(asciiDecode(new Uint8Array(buffer, 8, headerLen)).trim().replace(/\0+$/, '')) as Header;

  const totalV = header.structures.reduce((s, x) => s + x.vc, 0);
  const totalI = header.structures.reduce((s, x) => s + x.ic, 0);
  const positions = new Float32Array(totalV * 3);
  // Küçük nitelikler 4 bayta hizalı tutulur: iOS'un OpenGL katmanı hizasız köşe verisini her karede işlemcide
  // yeniden paketler ve milyonlarca köşede ekran donar. Bu yüzden normaller 4 bileşenli, ortam gölgesi lif yönüyle
  // aynı pakette (xyz = lif, w = gölge) ve ayırma vektörü 4 bileşenlidir.
  const normals = new Int8Array(totalV * 4);
  const fiberAo = new Int8Array(totalV * 4);
  const explode = new Int16Array(totalV * 4);
  const colors = new Float32Array(totalV * 3);
  const indices = new Uint32Array(totalI);
  const structureOfVertex = new Uint16Array(totalV);
  const ranges: StructureRange[] = [];
  const [sx, sy, sz] = header.scale;
  const [ox, oy, oz0] = header.offset;
  const oz = oz0 + Z_SHIFT;
  const color = new THREE.Color();

  let off = 8 + headerLen;
  let v0 = 0;
  let i0 = 0;
  for (const st of header.structures) {
    const q = new Int16Array(buffer, off, st.vc * 3);
    off += align4(st.vc * 6);
    const n8 = new Int8Array(buffer, off, st.vc * 3);
    off += align4(st.vc * 3);
    const ao8 = new Uint8Array(buffer, off, st.vc);
    off += align4(st.vc);
    const ind = st.i32 ? new Uint32Array(buffer, off, st.ic) : new Uint16Array(buffer, off, st.ic);
    off += align4(st.ic * (st.i32 ? 4 : 2));

    color.set(anatomyStructures[st.s].color);
    const fx = st.f ? Math.round(st.f[0] * 127) : 0;
    const fy = st.f ? Math.round(st.f[1] * 127) : 0;
    const fz = st.f ? Math.round(st.f[2] * 127) : 0;
    let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let k = 0; k < st.vc; k++) {
      const x = q[k * 3] * sx + ox;
      const y = q[k * 3 + 1] * sy + oy;
      const z = q[k * 3 + 2] * sz + oz;
      const at = (v0 + k) * 3;
      positions[at] = x;
      positions[at + 1] = y;
      positions[at + 2] = z;
      colors[at] = color.r;
      colors[at + 1] = color.g;
      colors[at + 2] = color.b;
      const a4 = (v0 + k) * 4;
      normals[a4] = n8[k * 3];
      normals[a4 + 1] = n8[k * 3 + 1];
      normals[a4 + 2] = n8[k * 3 + 2];
      fiberAo[a4] = fx;
      fiberAo[a4 + 1] = fy;
      fiberAo[a4 + 2] = fz;
      fiberAo[a4 + 3] = ao8[k] >> 1;
      structureOfVertex[v0 + k] = st.s;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    for (let k = 0; k < st.ic; k++) indices[i0 + k] = ind[k] + v0;

    const sphere = new THREE.Box3(new THREE.Vector3(minX, minY, minZ), new THREE.Vector3(maxX, maxY, maxZ)).getBoundingSphere(new THREE.Sphere());
    const ex = explodeVector(layer, sphere.center);
    const qx = Math.round((ex.x / EXPLODE_SCALE) * 32767);
    const qy = Math.round((ex.y / EXPLODE_SCALE) * 32767);
    const qz = Math.round((ex.z / EXPLODE_SCALE) * 32767);
    for (let k = v0 * 4; k < (v0 + st.vc) * 4; k += 4) {
      explode[k] = qx;
      explode[k + 1] = qy;
      explode[k + 2] = qz;
    }
    ranges.push({ id: st.s, vertexStart: v0, vertexCount: st.vc, indexStart: i0, indexCount: st.ic, center: sphere.center, radius: sphere.radius, explode: ex });
    v0 += st.vc;
    i0 += st.ic;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  // Normaller, ortam gölgesi ve lif yönü dosyada hazır gelir (telefonda hesaplanmaz)
  // Gölgelendiricide normal vec3 olarak okunur; 4. bileşen yalnızca hizalama içindir
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 4, true));
  geometry.setAttribute('fiberAo', new THREE.BufferAttribute(fiberAo, 4, true));
  geometry.setAttribute('explodeDir', new THREE.BufferAttribute(explode, 4, true));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeBoundingSphere();
  return { layer, geometry, structureOfVertex, ranges };
}

/**
 * Tek bir yapının geometrisini katman geometrisinden ayırır (röntgen modunda tek başına çizmek için).
 * Ayrık görünümdeki kayma burada yoktur; ağın konumu (mesh.position) ile verilir.
 */
export function extractStructure(layer: LoadedLayer, range: StructureRange): THREE.BufferGeometry {
  const idx = layer.geometry.getIndex()!;
  const indices = new Uint32Array(range.indexCount);
  for (let k = 0; k < range.indexCount; k++) indices[k] = idx.getX(range.indexStart + k) - range.vertexStart;
  const g = new THREE.BufferGeometry();
  for (const name of ['position', 'normal', 'fiberAo']) {
    const a = layer.geometry.getAttribute(name) as THREE.BufferAttribute;
    const arr = a.array as Float32Array | Int8Array | Uint8Array;
    g.setAttribute(name, new THREE.BufferAttribute(arr.slice(range.vertexStart * a.itemSize, (range.vertexStart + range.vertexCount) * a.itemSize), a.itemSize, a.normalized));
  }
  g.setIndex(new THREE.BufferAttribute(indices, 1));
  return g;
}

export type LayerHit = { structureId: number; distance: number; point: THREE.Vector3 };

const _sphere = new THREE.Sphere();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _p = new THREE.Vector3();
const _center = new THREE.Vector3();
const _ray = new THREE.Ray();

/**
 * Işının katmanda çarptığı en yakın yapı. three.js'in tüm üçgenleri tarayan raycast'i milyonlarca üçgende
 * telefonda yavaş kalır; önce yapıların sınır küreleri elenir, yalnızca adayların üçgenleri test edilir.
 */
export function raycastLayer(layer: LoadedLayer, ray: THREE.Ray, maxDistance = Infinity, explode = 0): LayerHit | null {
  const pos = layer.geometry.getAttribute('position').array as Float32Array;
  const idx = layer.geometry.getIndex()!.array as Uint32Array;
  // Yakından uzağa sırala; daha yakın bir çarpma bulunduysa uzak adaylar atlanır
  const candidates: { r: StructureRange; d: number }[] = [];
  for (const r of layer.ranges) {
    _sphere.set(_center.copy(r.center).addScaledVector(r.explode, explode), r.radius);
    if (!ray.intersectsSphere(_sphere)) continue;
    candidates.push({ r, d: Math.max(0, ray.origin.distanceTo(r.center) - r.radius) });
  }
  candidates.sort((x, y) => x.d - y.d);
  let best: LayerHit | null = null;
  let bestT = maxDistance;
  for (const { r, d } of candidates) {
    if (d > bestT) break;
    const end = r.indexStart + r.indexCount;
    // Yapı kaydırılmışsa ışını ters yönde kaydırıp orijinal üçgenlerle test et
    _ray.copy(ray);
    _ray.origin.addScaledVector(r.explode, -explode);
    for (let t = r.indexStart; t < end; t += 3) {
      _a.fromArray(pos, idx[t] * 3);
      _b.fromArray(pos, idx[t + 1] * 3);
      _c.fromArray(pos, idx[t + 2] * 3);
      if (!_ray.intersectTriangle(_a, _b, _c, false, _p)) continue;
      const dist = _p.distanceTo(_ray.origin);
      if (dist < bestT) {
        bestT = dist;
        best = { structureId: r.id, distance: dist, point: _p.clone().addScaledVector(r.explode, explode) };
      }
    }
  }
  return best;
}

const cache = new Map<string, Promise<LoadedLayer>>();

/** Katmanı bir kez indirir/çözer; sonraki çağrılar aynı sonucu döner */
export function loadLayer(layer: AnatomyLayer, model: AnatomyModel, detail: DetailLevel): Promise<LoadedLayer> {
  const prefix = `${model}/${detail}/`;
  const key = prefix + layer;
  // Model veya detay seviyesi değiştiyse eskisinin verisini bellekte tutma
  for (const k of cache.keys()) if (!k.startsWith(prefix)) cache.delete(k);
  let p = cache.get(key);
  if (!p) {
    p = readAsset(layer, LAYER_ASSETS[model][detail][layer]).then((buf) => {
      breadcrumb(`${layer}: çözülüyor (${Math.round(buf.byteLength / 1024)} KB)`);
      const data = parseLayer(layer, buf);
      breadcrumb(`${layer}: çözüldü`);
      return data;
    });
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return p;
}
