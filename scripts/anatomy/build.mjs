/**
 * BodyParts3D OBJ dosyalarından uygulamanın 3D anatomi verisini üretir.
 *
 *   node scripts/anatomy/build.mjs <bodyparts3d_dir> <mapping.json>
 *
 * Çıktılar:
 *   assets/anatomy/<katman>.bin   – sadeleştirilmiş, int16'ya sıkıştırılmış ağlar
 *   src/data/anatomy3d.ts         – yapıların Latince/Türkçe isimleri, katman ve renkleri
 *
 * İkili biçim (küçük endian):
 *   "ANT1" | uint32 headerLength | header JSON (4'e hizalı)
 *   her yapı için: int16 pozisyonlar [vc*3] (4'e hizalı) + uint16|uint32 indeksler [ic] (4'e hizalı)
 * Header: { scale, offset, structures: [{ s: yapı indeksi, vc, ic, i32 }] }
 * Pozisyon = int16 * scale + offset (birim: 10 cm; model ~17 birim boyunda, y yukarı, +z ön)
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { MeshoptSimplifier } from 'meshoptimizer';

const [srcDir, mappingPath] = process.argv.slice(2);
const objDir = path.join(srcDir, 'isa_BP3D_4.0_obj_99');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const outDir = path.join(root, 'assets/anatomy');
fs.mkdirSync(outDir, { recursive: true });

const LAYERS = ['deri', 'kas', 'iskelet', 'organ', 'damar', 'sinir'];
// Katman başına üçgen bütçesi (yalnızca açık katmanlar çizilir; varsayılan kas+iskelet ~270 bin)
const BUDGET = { deri: 45000, kas: 150000, iskelet: 115000, organ: 100000, damar: 80000, sinir: 90000 };
const MIN_TRIS = 40;

// Renkler isimlendirme kurallarıyla aynı yerde tanımlı
const kindColors = JSON.parse(
  execFileSync('python3', ['-c', 'import json,sys; sys.path.insert(0, sys.argv[1]); from names import KIND_COLORS; print(json.dumps(KIND_COLORS))', path.join(root, 'scripts/anatomy')]).toString(),
);

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// ---- OBJ okuma ----
function readObj(file) {
  const text = fs.readFileSync(path.join(objDir, `${file}.obj`), 'utf8');
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

// ---- Yapılara gruplama ----
const structures = new Map(); // key -> {meta, files}
for (const m of mapping) {
  const key = `${m.layer}|${m.la}|${m.side ?? ''}`;
  if (!structures.has(key)) structures.set(key, { meta: m, files: [] });
  structures.get(key).files.push(m.file);
}

await MeshoptSimplifier.ready;

const meta = []; // src/data/anatomy3d.ts içeriği
const perLayer = Object.fromEntries(LAYERS.map((l) => [l, []]));
let gmin = [Infinity, Infinity, Infinity];
let gmax = [-Infinity, -Infinity, -Infinity];

console.log(`${structures.size} yapı okunuyor...`);
for (const [, { meta: m, files }] of structures) {
  const pos = [];
  const idx = [];
  for (const f of files) {
    const o = readObj(f);
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
  const id = meta.length;
  meta.push({ id, la: m.la, tr: m.tr, layer: m.layer, kind: m.kind, side: m.side, color: kindColors[m.kind] });
  perLayer[m.layer].push({ id, pos: new Float32Array(pos), idx: new Uint32Array(idx) });
}

const scale = gmax.map((v, a) => (v - gmin[a]) / 65000);
const offset = gmin.map((v, a) => v + 32500 * scale[a]);

let totalTris = 0;
for (const layer of LAYERS) {
  const items = perLayer[layer];
  const tris = items.reduce((s, it) => s + it.idx.length / 3, 0);
  const ratio = Math.min(1, BUDGET[layer] / tris);
  const chunks = [];
  const header = { scale, offset, structures: [] };
  let layerTris = 0;

  for (const it of items) {
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
    const p = new Float32Array(unique * 3);
    for (let old = 0; old < remap.length; old++) {
      const nw = remap[old];
      if (nw === 0xffffffff || nw >= unique) continue;
      p[nw * 3] = it.pos[old * 3];
      p[nw * 3 + 1] = it.pos[old * 3 + 1];
      p[nw * 3 + 2] = it.pos[old * 3 + 2];
    }
    const q = new Int16Array(unique * 3);
    for (let i = 0; i < unique * 3; i++) q[i] = Math.round((p[i] - offset[i % 3]) / scale[i % 3]);
    const i32 = unique > 65535;
    const ind = i32 ? new Uint32Array(indices) : new Uint16Array(indices);
    chunks.push(Buffer.from(q.buffer), pad(q.byteLength), Buffer.from(ind.buffer), pad(ind.byteLength));
    header.structures.push({ s: it.id, vc: unique, ic: ind.length, i32 });
    layerTris += ind.length / 3;
  }

  const json = Buffer.from(JSON.stringify(header), 'utf8');
  const headerLen = Buffer.alloc(4);
  headerLen.writeUInt32LE(json.length + pad(json.length).length);
  const file = Buffer.concat([Buffer.from('ANT1'), headerLen, json, pad(json.length), ...chunks]);
  fs.writeFileSync(path.join(outDir, `${layer}.bin`), file);
  totalTris += layerTris;
  console.log(`${layer.padEnd(8)} ${String(items.length).padStart(4)} yapı  ${String(tris).padStart(8)} → ${String(layerTris).padStart(6)} üçgen  ${(file.length / 1024 / 1024).toFixed(2)} MB`);
}
console.log(`Toplam ${totalTris} üçgen`);

function pad(n) {
  return Buffer.alloc((4 - (n % 4)) % 4);
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
