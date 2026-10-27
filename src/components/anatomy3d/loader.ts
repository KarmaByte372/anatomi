import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import * as THREE from 'three';

import { anatomyStructures } from '@/data/anatomy3d';
import { breadcrumb } from '@/lib/crashGuard';
import type { AnatomyLayer } from '@/data/anatomyTypes';

export type DetailLevel = 'yuksek' | 'standart';

/* eslint-disable @typescript-eslint/no-require-imports */
const LAYER_ASSETS: Record<DetailLevel, Record<AnatomyLayer, number>> = {
  yuksek: {
    deri: require('../../../assets/anatomy/yuksek/deri.bin'),
    kas: require('../../../assets/anatomy/yuksek/kas.bin'),
    iskelet: require('../../../assets/anatomy/yuksek/iskelet.bin'),
    organ: require('../../../assets/anatomy/yuksek/organ.bin'),
    damar: require('../../../assets/anatomy/yuksek/damar.bin'),
    sinir: require('../../../assets/anatomy/yuksek/sinir.bin'),
  },
  standart: {
    deri: require('../../../assets/anatomy/standart/deri.bin'),
    kas: require('../../../assets/anatomy/standart/kas.bin'),
    iskelet: require('../../../assets/anatomy/standart/iskelet.bin'),
    organ: require('../../../assets/anatomy/standart/organ.bin'),
    damar: require('../../../assets/anatomy/standart/damar.bin'),
    sinir: require('../../../assets/anatomy/standart/sinir.bin'),
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
};

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
  const normals = new Int8Array(totalV * 3);
  const ao = new Uint8Array(totalV);
  const fiber = new Int8Array(totalV * 3);
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
    normals.set(new Int8Array(buffer, off, st.vc * 3), v0 * 3);
    off += align4(st.vc * 3);
    ao.set(new Uint8Array(buffer, off, st.vc), v0);
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
      fiber[at] = fx;
      fiber[at + 1] = fy;
      fiber[at + 2] = fz;
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
    ranges.push({ id: st.s, vertexStart: v0, vertexCount: st.vc, indexStart: i0, indexCount: st.ic, center: sphere.center, radius: sphere.radius });
    v0 += st.vc;
    i0 += st.ic;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  // Normaller, ortam gölgesi ve lif yönü dosyada hazır gelir (telefonda hesaplanmaz)
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3, true));
  geometry.setAttribute('ao', new THREE.BufferAttribute(ao, 1, true));
  geometry.setAttribute('fiber', new THREE.BufferAttribute(fiber, 3, true));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeBoundingSphere();
  return { layer, geometry, structureOfVertex, ranges };
}

/** Tek bir yapının geometrisini katman geometrisinden ayırır (röntgen modunda tek başına çizmek için) */
export function extractStructure(layer: LoadedLayer, range: StructureRange): THREE.BufferGeometry {
  const idx = layer.geometry.getIndex()!;
  const indices = new Uint32Array(range.indexCount);
  for (let k = 0; k < range.indexCount; k++) indices[k] = idx.getX(range.indexStart + k) - range.vertexStart;
  const g = new THREE.BufferGeometry();
  for (const name of ['position', 'normal', 'ao', 'fiber']) {
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

/**
 * Işının katmanda çarptığı en yakın yapı. three.js'in tüm üçgenleri tarayan raycast'i milyonlarca üçgende
 * telefonda yavaş kalır; önce yapıların sınır küreleri elenir, yalnızca adayların üçgenleri test edilir.
 */
export function raycastLayer(layer: LoadedLayer, ray: THREE.Ray, maxDistance = Infinity): LayerHit | null {
  const pos = layer.geometry.getAttribute('position').array as Float32Array;
  const idx = layer.geometry.getIndex()!.array as Uint32Array;
  // Yakından uzağa sırala; daha yakın bir çarpma bulunduysa uzak adaylar atlanır
  const candidates: { r: StructureRange; d: number }[] = [];
  for (const r of layer.ranges) {
    _sphere.set(r.center, r.radius);
    if (!ray.intersectsSphere(_sphere)) continue;
    candidates.push({ r, d: Math.max(0, ray.origin.distanceTo(r.center) - r.radius) });
  }
  candidates.sort((x, y) => x.d - y.d);
  let best: LayerHit | null = null;
  let bestT = maxDistance;
  for (const { r, d } of candidates) {
    if (d > bestT) break;
    const end = r.indexStart + r.indexCount;
    for (let t = r.indexStart; t < end; t += 3) {
      _a.fromArray(pos, idx[t] * 3);
      _b.fromArray(pos, idx[t + 1] * 3);
      _c.fromArray(pos, idx[t + 2] * 3);
      if (!ray.intersectTriangle(_a, _b, _c, false, _p)) continue;
      const dist = _p.distanceTo(ray.origin);
      if (dist < bestT) {
        bestT = dist;
        best = { structureId: r.id, distance: dist, point: _p.clone() };
      }
    }
  }
  return best;
}

const cache = new Map<string, Promise<LoadedLayer>>();

/** Katmanı bir kez indirir/çözer; sonraki çağrılar aynı sonucu döner */
export function loadLayer(layer: AnatomyLayer, detail: DetailLevel): Promise<LoadedLayer> {
  const key = `${detail}/${layer}`;
  // Detay seviyesi değiştiyse eski seviyenin verisini bellekte tutma
  for (const k of cache.keys()) if (!k.startsWith(`${detail}/`)) cache.delete(k);
  let p = cache.get(key);
  if (!p) {
    p = readAsset(layer, LAYER_ASSETS[detail][layer]).then((buf) => {
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
