"""Kadın modeli üretimi için ortak araçlar: dosya okuma ve erkek ↔ kadın kemik eşleştirmesi.

Koordinatlar uygulamadakiyle aynıdır (build.mjs): 1 birim = 10 cm, x = sol, y = yukarı, z = ön.
BodyParts3D (mm; +x sol, -y ön, +z yukarı) ve BoneHub STL'leri (mm; LPS: +x sol, +y arka, +z yukarı)
aynı eksen düzenini kullandığı için ikisi de (x, z, -y) / 100 ile dönüştürülür.
"""
import json
import struct
from pathlib import Path

import numpy as np

ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']


def read_obj(path):
    pos, idx = [], []
    with open(path) as f:
        for line in f:
            if line.startswith('v '):
                x, y, z = map(float, line.split()[1:4])
                pos.append((x / 100, z / 100, -y / 100))
            elif line.startswith('f '):
                vs = [int(t.split('/')[0]) - 1 for t in line.split()[1:]]
                for k in range(1, len(vs) - 1):
                    idx.append((vs[0], vs[k], vs[k + 1]))
    return np.array(pos, dtype=np.float64), np.array(idx, dtype=np.int64).reshape(-1, 3)


def read_stl(path):
    """İkili STL → (köşeler, üçgenler); tekrar eden köşeler birleştirilir."""
    data = Path(path).read_bytes()
    n = struct.unpack_from('<I', data, 80)[0]
    rec = np.frombuffer(data, dtype=np.dtype([('n', '<f4', 3), ('v', '<f4', (3, 3)), ('a', '<u2')]), count=n, offset=84)
    v = rec['v'].reshape(-1, 3).astype(np.float64)
    v = np.stack([v[:, 0] / 100, v[:, 2] / 100, -v[:, 1] / 100], axis=1)
    uniq, inv = np.unique(np.round(v, 6), axis=0, return_inverse=True)
    return uniq, inv.reshape(-1, 3)


def male_files(mapping):
    """(la, side) → OBJ dosya adları"""
    out = {}
    for m in mapping:
        out.setdefault((m['la'], m['side']), []).append(m['file'])
    return out


def bone_groups():
    """Eşleştirme grupları: (ad, BoneHub dosyaları, BodyParts3D yapıları [(la, side)])"""
    g = []
    sides = [('L', 'LEFT'), ('R', 'RIGHT')]
    skull = ['Os frontale', 'Os occipitale', 'Os sphenoidale', 'Os ethmoidale', 'Vomer']
    skull_lr = ['Os parietale', 'Os temporale', 'Maxilla', 'Os zygomaticum', 'Os nasale', 'Os lacrimale', 'Os palatinum', 'Concha nasalis inferior']
    g.append(('kafatasi', ['SKULL_CRANIAL_MAXILLA'], [(n, None) for n in skull] + [(n, s) for n in skull_lr for s in 'LR']))
    g.append(('mandibula', ['SKULL_MANDIBLE'], [('Mandibula', None)]))
    g.append(('sakrum', ['SACRUM'], [('Os sacrum', None)]))
    g.append(('sternum', ['STERNUM'], [('Manubrium sterni', None), ('Corpus sterni', None), ('Processus xiphoideus', None)]))
    g.append(('C1', ['VERTEBRA_C1'], [('Atlas (C1)', None)]))
    g.append(('C2', ['VERTEBRA_C2'], [('Axis (C2)', None)]))
    for i in range(3, 8):
        g.append((f'C{i}', [f'VERTEBRA_C{i}'], [(f'Vertebra cervicalis {ROMAN[i]}', None)]))
    for i in range(1, 13):
        g.append((f'T{i}', [f'VERTEBRA_T{i}'], [(f'Vertebra thoracica {ROMAN[i]}', None)]))
    # Kadında 6 bel omuru var (L6); bel bölgesi bütün olarak eşleştirilir
    g.append(('bel', [f'VERTEBRA_L{i}' for i in range(1, 7)], [(f'Vertebra lumbalis {ROMAN[i]}', None) for i in range(1, 6)]))
    for s, S in sides:
        for i in range(1, 13):
            g.append((f'kaburga{i}{s}', [f'RIB_{i}_{S}'], [(f'Costa {ROMAN[i]}', s)]))
        for bh, la in [('CLAVICLE', 'Clavicula'), ('SCAPULA', 'Scapula'), ('HUMERUS', 'Humerus'), ('RADIUS', 'Radius'), ('ULNA', 'Ulna'),
                       ('HIP', 'Os coxae'), ('FEMUR', 'Femur'), ('PATELLA', 'Patella'), ('TIBIA', 'Tibia'), ('FIBULA', 'Fibula'),
                       ('CAPITATE', 'Os capitatum'), ('HAMATE', 'Os hamatum'), ('LUNATE', 'Os lunatum'), ('PISIFORM', 'Os pisiforme'),
                       ('SCAPHOID', 'Os scaphoideum'), ('TRAPEZIUM', 'Os trapezium'), ('TRAPEZOID', 'Os trapezoideum'), ('TRIQUETRUM', 'Os triquetrum'),
                       ('CALCANEUS', 'Calcaneus'), ('CUBOID', 'Os cuboideum'), ('NAVICULAR', 'Os naviculare'), ('TALUS', 'Talus'),
                       ('INTERMEDIATE_CUNEIFORM', 'Os cuneiforme intermedium'), ('LATERAL_CUNEIFORM', 'Os cuneiforme laterale'),
                       ('MEDIAL_CUNEIFORM', 'Os cuneiforme mediale')]:
            g.append((f'{la}{s}', [f'{bh}_{S}'], [(la, s)]))
        for i in range(1, 6):
            g.append((f'metakarp{i}{s}', [f'METACARPAL_{i}_{S}'], [(f'Os metacarpi {ROMAN[i]}', s)]))
            g.append((f'metatars{i}{s}', [f'METATARSAL_{i}_{S}'], [(f'Os metatarsi {ROMAN[i]}', s)]))
            parts = ['proximalis', 'distalis'] + (['media'] if i > 1 else [])
            g.append((f'elparmak{i}{s}', [f'PHALANGE_HAND_{i}_{S}'], [(f'Phalanx {p} digiti {ROMAN[i]} manus', s) for p in parts]))
            g.append((f'ayakparmak{i}{s}', [f'PHALANGE_FOOT_{i}_{S}'], [(f'Phalanx {p} digiti {ROMAN[i]} pedis', s) for p in parts]))
    return g


def load_groups(bp3d_dir, bonehub_dir):
    mapping = json.load(open(Path(bp3d_dir) / 'mapping.json'))
    files = male_files(mapping)
    out = []
    for name, bh, male in bone_groups():
        fp, mp = [], []
        for b in bh:
            p = Path(bonehub_dir) / f'{b}.stl'
            if not p.exists():
                raise FileNotFoundError(p)
            fp.append(read_stl(p)[0])
        for key in male:
            if key not in files:
                raise KeyError(f'{name}: {key}')
            for f in files[key]:
                mp.append(read_obj(Path(bp3d_dir) / 'isa_BP3D_4.0_obj_99' / f'{f}.obj')[0])
        out.append((name, np.concatenate(mp), np.concatenate(fp)))
    return out
