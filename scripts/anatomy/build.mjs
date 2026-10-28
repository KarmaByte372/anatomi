/**
 * BodyParts3D OBJ dosyalarından uygulamanın 3D anatomi verisini üretir.
 *
 *   node scripts/anatomy/build.mjs <bodyparts3d_dir> <mapping.json> <kadın_klasörü> [erkek|kadin] [yuksek|standart]
 *
 * İki model üretilir:
 *   erkek – BodyParts3D'nin kendisi
 *   kadin – aynı yapılar kadın iskeletine oturtulmuş hâlde + kadına özgü yapılar (scripts/anatomy/kadin/ ile üretilen
 *           <kadın_klasörü>: positions.bin + index.json taşınmış köşeler, extra/ kadına özgü yapılar ve kadın derisi)
 *
 * Çıktılar:
 *   assets/anatomy/<model>/<detay>/<katman>.bin – iki detay seviyesi: yuksek (varsayılan) ve standart (zayıf cihazlar)
 *   src/data/anatomy3d.ts                       – iki modelin ortak yapı listesi (isimler, katman, renk, hangi modelde olduğu)
 *
 * İkili biçim (küçük endian):
 *   "ANT2" | uint32 headerLength | header JSON (4'e hizalı)
 *   her yapı için (her parça 4'e hizalı): int16 pozisyonlar [vc*3] | int8 normaller [vc*3] |
 *   uint8 ortam gölgesi [vc] | uint16|uint32 indeksler [ic]
 * Header: { scale, offset, structures: [{ s: yapı indeksi, vc, ic, i32, f?: kas lif yönü [x,y,z] }] }
 * Pozisyon = int16 * scale + offset (birim: 10 cm; model ~17 birim boyunda, y yukarı, +z ön)
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { Worker } from 'node:worker_threads';
import { MeshoptSimplifier } from 'meshoptimizer';

const [srcDir, mappingPath, femaleDir, onlyModel, onlyLod] = process.argv.slice(2);
const objDir = path.join(srcDir, 'isa_BP3D_4.0_obj_99');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const outDir = path.join(root, 'assets/anatomy');
fs.mkdirSync(outDir, { recursive: true });

const LAYERS = ['deri', 'kas', 'iskelet', 'organ', 'damar', 'sinir'];
// Katman başına üçgen bütçesi (yalnızca açık katmanlar çizilir). Kaynak: ~6,7 milyon üçgen
const LODS = {
  // İskelet tam çözünürlükte; varsayılan görünüm (kas + iskelet) ~1,4 milyon üçgen
  yuksek: { deri: 120000, kas: 750000, iskelet: Infinity, organ: 420000, damar: 450000, sinir: 300000 },
  // Zayıf cihazlar ve yüksek detayda kapanan telefonlar için; varsayılan görünüm ~270 bin üçgen
  standart: { deri: 45000, kas: 150000, iskelet: 115000, organ: 100000, damar: 80000, sinir: 90000 },
};
// Ortam gölgesi ışın sayısı ve yarıçapı (1 birim = 10 cm)
const AO_RAYS = 40;
const AO_RADIUS = { deri: 0.3, kas: 0.25, iskelet: 0.2, organ: 0.3, damar: 0.15, sinir: 0.15 };
const MIN_TRIS = 40;

// Renkler isimlendirme kurallarıyla aynı yerde tanımlı
const kindColors = JSON.parse(
  execFileSync('python3', ['-c', 'import json,sys; sys.path.insert(0, sys.argv[1]); from names import KIND_COLORS; print(json.dumps(KIND_COLORS))', path.join(root, 'scripts/anatomy')]).toString(),
);

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// ---- OBJ okuma ----
function readObj(file, dir = objDir) {
  const text = fs.readFileSync(path.join(dir, `${file}.obj`), 'utf8');
  const pos = [];
  const idx = [];
  for (const line of text.split('\n')) {
    if (line.startsWith('v ')) {
      const [, x, y, z] = line.trim().split(/\s+/).map(Number);
      // BodyParts3D (mm, z yukarı, -y ön, +x sol) → uygulama (y yukarı, +z ön), 1 birim = 10 cm
      pos.push(x / 100, z / 100, -y / 100);
    } else if (line.startsWith('f ')) {
      const vs = line.trim().split(/\s+/).slice(1).map((t) => parseInt(t.split('/')[0], 10) - 1);
      for (let k = 1; k + 1 < vs.length; k++) idx.push(vs[0], vs[k], vs[k + 1]);
    }
  }
  return { pos, idx };
}

// Kadın modeli: taşınmış köşeler (üçgenler BodyParts3D OBJ'sinden okunur) ve kadına özgü yapılar
const femaleIndex = JSON.parse(fs.readFileSync(path.join(femaleDir, 'index.json'), 'utf8'));
const femalePositions = new Float32Array(fs.readFileSync(path.join(femaleDir, 'positions.bin')).buffer.slice(0));
const femaleExtraDir = path.join(femaleDir, 'extra');
const femaleExtras = JSON.parse(fs.readFileSync(path.join(femaleExtraDir, 'yapilar.json'), 'utf8'));

/** Yapının bir parçasını modele göre okur */
function readPart(model, src) {
  if (src.extra) return readObj(src.file, femaleExtraDir);
  const o = readObj(src.file);
  if (model === 'kadin') {
    const [start, count] = femaleIndex[src.file];
    o.pos = Array.from(femalePositions.subarray(start, start + count * 3));
  }
  return o;
}

// ---- Yapılara gruplama (iki modelin birleşimi; id'ler modeller arasında ortak) ----
const structures = new Map(); // key -> { meta, parts: { erkek: [...], kadin: [...] } }
const keyOf = (m) => `${m.layer}|${m.la}|${m.side ?? ''}`;
for (const m of mapping) {
  const key = keyOf(m);
  if (!structures.has(key)) structures.set(key, { meta: m, parts: { erkek: [], kadin: [] } });
  const st = structures.get(key);
  st.parts.erkek.push({ file: m.file });
  if (femaleIndex[m.file]) st.parts.kadin.push({ file: m.file });
}
for (const m of femaleExtras) {
  const key = keyOf(m);
  if (!structures.has(key)) structures.set(key, { meta: m, parts: { erkek: [], kadin: [] } });
  structures.get(key).parts.kadin.push({ file: m.file, extra: true });
}

await MeshoptSimplifier.ready;

const meta = []; // src/data/anatomy3d.ts içeriği
const MODELS = ['erkek', 'kadin'];
for (const [, st] of structures) {
  const m = st.meta;
  const id = meta.length;
  st.id = id;
  const models = MODELS.filter((k) => st.parts[k].length > 0);
  meta.push({ id, la: m.la, tr: m.tr, layer: m.layer, kind: m.kind, side: m.side, color: variedColor(kindColors[m.kind], m.kind, id), ...(models.length === 1 ? { model: models[0] } : {}) });
}
console.log(`${meta.length} yapı (${meta.filter((x) => x.model === 'erkek').length} yalnızca erkek, ${meta.filter((x) => x.model === 'kadin').length} yalnızca kadın)`);

for (const model of MODELS) {
  if (onlyModel && model !== onlyModel) continue;
  await buildModel(model);
}

async function buildModel(model) {
  const perLayer = Object.fromEntries(LAYERS.map((l) => [l, []]));
  const gmin = [Infinity, Infinity, Infinity];
  const gmax = [-Infinity, -Infinity, -Infinity];

  console.log(`\n#### ${model}: yapılar okunuyor...`);
  for (const [, st] of structures) {
    const parts = st.parts[model];
    if (parts.length === 0) continue;
    const pos = [];
    const idx = [];
    for (const src of parts) {
      const o = readPart(model, src);
      const base = pos.length / 3;
      for (const v of o.pos) pos.push(v);
      for (const i of o.idx) idx.push(i + base);
    }
    for (let i = 0; i < pos.length; i += 3) {
      for (let a = 0; a < 3; a++) {
        gmin[a] = Math.min(gmin[a], pos[i + a]);
        gmax[a] = Math.max(gmax[a], pos[i + a]);
      }
    }
    const p32 = new Float32Array(pos);
    perLayer[st.meta.layer].push({ id: st.id, pos: p32, idx: new Uint32Array(idx), fiber: st.meta.kind === 'muscle' ? principalAxis(p32) : undefined });
  }

  const scale = gmax.map((v, a) => (v - gmin[a]) / 65000);
  const offset = gmin.map((v, a) => v + 32500 * scale[a]);

  for (const [lod, budget] of Object.entries(LODS)) {
    if (onlyLod && lod !== onlyLod) continue;
    const lodDir = path.join(outDir, model, lod);
    fs.mkdirSync(lodDir, { recursive: true });
    console.log(`\n== ${model} / ${lod} ==`);
    let totalTris = 0;
    for (const layer of LAYERS) {
      const items = perLayer[layer];
      const tris = items.reduce((s, it) => s + it.idx.length / 3, 0);
      const ratio = Math.min(1, budget[layer] / tris);
      const parts = items.map((it) => simplifyStructure(it, ratio));

      // Katmanın tamamı üzerinde ortam gölgesi (kas araları, kaburga boşlukları vb. birbirini gölgeler)
      const ao = await computeAO(parts, AO_RADIUS[layer]);

      const header = { scale, offset, structures: [] };
      const chunks = [];
      let layerTris = 0;
      let vBase = 0;
      for (let k = 0; k < parts.length; k++) {
        const { pos, nrm, idx } = parts[k];
        const vc = pos.length / 3;
        const q = new Int16Array(vc * 3);
        for (let i = 0; i < vc * 3; i++) q[i] = Math.round((pos[i] - offset[i % 3]) / scale[i % 3]);
        const n8 = new Int8Array(vc * 3);
        for (let i = 0; i < vc * 3; i++) n8[i] = Math.round(nrm[i] * 127);
        const a8 = ao.subarray(vBase, vBase + vc);
        vBase += vc;
        const i32 = vc > 65535;
        const ind = i32 ? new Uint32Array(idx) : new Uint16Array(idx);
        chunks.push(Buffer.from(q.buffer), pad(q.byteLength), Buffer.from(n8.buffer), pad(n8.byteLength), Buffer.from(a8), pad(a8.byteLength), Buffer.from(ind.buffer), pad(ind.byteLength));
        const entry = { s: items[k].id, vc, ic: ind.length, i32 };
        if (items[k].fiber) entry.f = items[k].fiber;
        header.structures.push(entry);
        layerTris += ind.length / 3;
      }

      const json = Buffer.from(JSON.stringify(header), 'utf8');
      const headerLen = Buffer.alloc(4);
      headerLen.writeUInt32LE(json.length + pad(json.length).length);
      const file = Buffer.concat([Buffer.from('ANT2'), headerLen, json, pad(json.length), ...chunks]);
      fs.writeFileSync(path.join(lodDir, `${layer}.bin`), file);
      totalTris += layerTris;
      console.log(`${layer.padEnd(8)} ${String(items.length).padStart(4)} yapı  ${String(tris).padStart(8)} → ${String(layerTris).padStart(7)} üçgen  ${(file.length / 1024 / 1024).toFixed(2)} MB`);
    }
    console.log(`Toplam ${totalTris} üçgen`);
  }
}

/** Yapıyı oranına göre sadeleştirir; yumuşak normalleri hesaplar */
function simplifyStructure(it, ratio) {
  const srcTris = it.idx.length / 3;
  const target = Math.max(MIN_TRIS, Math.round(srcTris * ratio));
  // Aynı konumdaki tekrar eden köşeleri birleştir; yoksa sadeleştirici dikişlerde takılır
  const weld = MeshoptSimplifier.generatePositionRemap(it.pos, 3);
  let indices = it.idx.map((i) => weld[i]);
  if (target < srcTris) {
    // Sınırlı hata ile sadeleştir. 'Permissive' açık (kapalı olmayan) ağlarda da kenar birleştirmeye izin verir;
    // hedefe ulaşılamazsa hata toleransı artırılır
    let [res] = MeshoptSimplifier.simplify(indices, it.pos, 3, target * 3, 0.01, ['Permissive', 'Prune']);
    if (res.length > target * 3 * 1.6) [res] = MeshoptSimplifier.simplify(indices, it.pos, 3, target * 3, 0.05, ['Permissive', 'Prune']);
    if (res.length >= 3) indices = res;
  }
  indices = new Uint32Array(indices);
  const [remap, unique] = MeshoptSimplifier.compactMesh(indices);
  const pos = new Float32Array(unique * 3);
  for (let old = 0; old < remap.length; old++) {
    const nw = remap[old];
    if (nw === 0xffffffff || nw >= unique) continue;
    pos[nw * 3] = it.pos[old * 3];
    pos[nw * 3 + 1] = it.pos[old * 3 + 1];
    pos[nw * 3 + 2] = it.pos[old * 3 + 2];
  }
  return { pos, nrm: vertexNormals(pos, indices), idx: indices };
}

/** Alan ağırlıklı köşe normalleri */
function vertexNormals(pos, idx) {
  const n = new Float32Array(pos.length);
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3;
    const b = idx[t + 1] * 3;
    const c = idx[t + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const o of [a, b, c]) {
      n[o] += nx;
      n[o + 1] += ny;
      n[o + 2] += nz;
    }
  }
  for (let i = 0; i < n.length; i += 3) {
    const l = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1;
    n[i] /= l;
    n[i + 1] /= l;
    n[i + 2] /= l;
  }
  return n;
}

/** Katmanın tüm yapılarını birleştirip ortam gölgesini iş parçacıklarında hesaplar (köşe başına 0–255) */
async function computeAO(parts, radius) {
  const vTotal = parts.reduce((s, p) => s + p.pos.length / 3, 0);
  const iTotal = parts.reduce((s, p) => s + p.idx.length, 0);
  const positions = new Float32Array(vTotal * 3);
  const normals = new Float32Array(vTotal * 3);
  const indices = new Uint32Array(iTotal);
  let v0 = 0;
  let i0 = 0;
  for (const p of parts) {
    positions.set(p.pos, v0 * 3);
    normals.set(p.nrm, v0 * 3);
    for (let k = 0; k < p.idx.length; k++) indices[i0 + k] = p.idx[k] + v0;
    v0 += p.pos.length / 3;
    i0 += p.idx.length;
  }
  const workers = os.availableParallelism();
  const per = Math.ceil(vTotal / workers);
  const ao = new Uint8Array(vTotal);
  const t0 = Date.now();
  await Promise.all(
    Array.from({ length: workers }, (_, w) => {
      const start = w * per;
      const end = Math.min(vTotal, start + per);
      if (start >= end) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('./ao-worker.mjs', import.meta.url), {
          workerData: { positions, normals, indices, start, end, rays: AO_RAYS, radius },
        });
        worker.on('message', (m) => {
          if (m.done) {
            ao.set(m.done, start);
            resolve();
          }
        });
        worker.on('error', reject);
      });
    }),
  );
  process.stdout.write(`  AO: ${vTotal} köşe, ${((Date.now() - t0) / 1000).toFixed(0)} sn\n`);
  return ao;
}

function pad(n) {
  return Buffer.alloc((4 - (n % 4)) % 4);
}

/** Yapının en uzun ekseni (kas liflerinin yaklaşık yönü), kovaryansın baskın özvektörü */
function principalAxis(pos) {
  const n = pos.length / 3;
  let mx = 0, my = 0, mz = 0;
  for (let i = 0; i < pos.length; i += 3) {
    mx += pos[i];
    my += pos[i + 1];
    mz += pos[i + 2];
  }
  mx /= n;
  my /= n;
  mz /= n;
  const c = [0, 0, 0, 0, 0, 0]; // xx xy xz yy yz zz
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i] - mx, y = pos[i + 1] - my, z = pos[i + 2] - mz;
    c[0] += x * x;
    c[1] += x * y;
    c[2] += x * z;
    c[3] += y * y;
    c[4] += y * z;
    c[5] += z * z;
  }
  let v = [0.3, 1, 0.2];
  for (let k = 0; k < 50; k++) {
    const w = [c[0] * v[0] + c[1] * v[1] + c[2] * v[2], c[1] * v[0] + c[3] * v[1] + c[4] * v[2], c[2] * v[0] + c[4] * v[1] + c[5] * v[2]];
    const l = Math.hypot(...w) || 1;
    v = w.map((x) => x / l);
  }
  return v.map((x) => Math.round(x * 1000) / 1000);
}

/** Aynı türdeki yapılar birbirinden ayırt edilsin diye renge küçük, sabit (id'ye bağlı) bir sapma ekler */
function variedColor(hex, kind, id) {
  const amount = { muscle: 1, tendon: 0.5, bone: 0.4, artery: 0.4, vein: 0.4 }[kind] ?? 0.5;
  const rnd = (k) => {
    const x = Math.sin((id + 1) * 12.9898 + k * 78.233) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  };
  let [h, s, l] = hexToHsl(hex);
  h = (h + rnd(1) * 0.015 * amount + 1) % 1;
  s = clamp01(s + rnd(2) * 0.07 * amount);
  l = clamp01(l + rnd(3) * 0.06 * amount);
  return hslToHex(h, s, l);
}

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function hslToHex(h, s, l) {
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// ---- TypeScript meta verisi ----
const ts = `// Bu dosya scripts/anatomy/build.mjs tarafından üretilir; elle düzenlemeyin.
// Kaynak: BodyParts3D, © The Database Center for Life Science, CC BY 4.0
import type { AnatomyStructure } from './anatomyTypes';

export const anatomyStructures: AnatomyStructure[] = ${JSON.stringify(meta, null, 0)
  .replace(/\},\{/g, '},\n  {')
  .replace(/^\[\{/, '[\n  {')
  .replace(/\}\]$/, '},\n]')};
`;
fs.writeFileSync(path.join(root, 'src/data/anatomy3d.ts'), ts);
console.log(`${meta.length} yapı src/data/anatomy3d.ts dosyasına yazıldı`);
