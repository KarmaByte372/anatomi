import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import * as THREE from 'three';

import { anatomyStructures } from '@/data/anatomy3d';
import { breadcrumb } from '@/lib/crashGuard';
import type { AnatomyLayer } from '@/data/anatomyTypes';

/* eslint-disable @typescript-eslint/no-require-imports */
const LAYER_ASSETS: Record<AnatomyLayer, number> = {
  deri: require('../../../assets/anatomy/deri.bin'),
  kas: require('../../../assets/anatomy/kas.bin'),
  iskelet: require('../../../assets/anatomy/iskelet.bin'),
  organ: require('../../../assets/anatomy/organ.bin'),
  damar: require('../../../assets/anatomy/damar.bin'),
  sinir: require('../../../assets/anatomy/sinir.bin'),
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
  structures: { s: number; vc: number; ic: number; i32: boolean }[];
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
  if (magic !== 'ANT1') throw new Error(`Geçersiz anatomi dosyası: ${layer}`);
  const headerLen = view.getUint32(4, true);
  const header = JSON.parse(asciiDecode(new Uint8Array(buffer, 8, headerLen)).trim().replace(/\0+$/, '')) as Header;

  const totalV = header.structures.reduce((s, x) => s + x.vc, 0);
  const totalI = header.structures.reduce((s, x) => s + x.ic, 0);
  const positions = new Float32Array(totalV * 3);
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
    const ind = st.i32 ? new Uint32Array(buffer, off, st.ic) : new Uint16Array(buffer, off, st.ic);
    off += align4(st.ic * (st.i32 ? 4 : 2));

    color.set(anatomyStructures[st.s].color);
    const box = new THREE.Box3();
    const p = new THREE.Vector3();
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
      structureOfVertex[v0 + k] = st.s;
      box.expandByPoint(p.set(x, y, z));
    }
    for (let k = 0; k < st.ic; k++) indices[i0 + k] = ind[k] + v0;

    const sphere = box.getBoundingSphere(new THREE.Sphere());
    ranges.push({ id: st.s, vertexStart: v0, vertexCount: st.vc, indexStart: i0, indexCount: st.ic, center: sphere.center, radius: sphere.radius });
    v0 += st.vc;
    i0 += st.ic;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return { layer, geometry, structureOfVertex, ranges };
}

/** Tek bir yapının geometrisini katman geometrisinden ayırır (röntgen modunda tek başına çizmek için) */
export function extractStructure(layer: LoadedLayer, range: StructureRange): THREE.BufferGeometry {
  const pos = layer.geometry.getAttribute('position') as THREE.BufferAttribute;
  const nrm = layer.geometry.getAttribute('normal') as THREE.BufferAttribute;
  const idx = layer.geometry.getIndex()!;
  const start = range.vertexStart * 3;
  const end = (range.vertexStart + range.vertexCount) * 3;
  const indices = new Uint32Array(range.indexCount);
  for (let k = 0; k < range.indexCount; k++) indices[k] = idx.getX(range.indexStart + k) - range.vertexStart;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute((pos.array as Float32Array).slice(start, end), 3));
  g.setAttribute('normal', new THREE.BufferAttribute((nrm.array as Float32Array).slice(start, end), 3));
  g.setIndex(new THREE.BufferAttribute(indices, 1));
  return g;
}

const cache = new Map<AnatomyLayer, Promise<LoadedLayer>>();

/** Katmanı bir kez indirir/çözer; sonraki çağrılar aynı sonucu döner */
export function loadLayer(layer: AnatomyLayer): Promise<LoadedLayer> {
  let p = cache.get(layer);
  if (!p) {
    p = readAsset(layer, LAYER_ASSETS[layer]).then((buf) => {
      breadcrumb(`${layer}: çözülüyor (${Math.round(buf.byteLength / 1024)} KB)`);
      const data = parseLayer(layer, buf);
      breadcrumb(`${layer}: çözüldü`);
      return data;
    });
    p.catch(() => cache.delete(layer));
    cache.set(layer, p);
  }
  return p;
}
