"""
BodyParts3D OBJ dosyalarını isimlendirme kurallarına göre yapılara eşler ve
mapping.json yazar. Kullanım:

    python3 scripts/anatomy/classify.py <bodyparts3d_dir> <cikti.json>

<bodyparts3d_dir> içinde isa_BP3D_4.0_obj_99/ klasörü ve isa_element_parts.txt bulunmalı.
"""

import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from names import classify  # noqa: E402

src, out = sys.argv[1], sys.argv[2]
obj_dir = os.path.join(src, 'isa_BP3D_4.0_obj_99')

# Başlığında isim olmayan dosyalar için is-a listesindeki kavram isimleri (en özelden genele)
concepts = {}
with open(os.path.join(src, 'isa_element_parts.txt')) as f:
    next(f)
    for line in f:
        _, name, fid = line.rstrip('\n').split('\t')
        concepts.setdefault(fid, []).append(name)

mapping = []
skipped = []
for fn in sorted(os.listdir(obj_dir)):
    if not fn.endswith('.obj'):
        continue
    fid = fn[:-4]
    name, bounds = '', None
    with open(os.path.join(obj_dir, fn)) as f:
        for line in f:
            if not line.startswith('#'):
                break
            if line.startswith('# English name'):
                name = line.split(':', 1)[1].strip()
            elif line.startswith('# Bounds'):
                nums = [float(x) for x in re.findall(r'-?\d+\.\d+', line)]
                bounds = nums

    result = classify(name) if name else 'UNMATCHED'
    if result == 'UNMATCHED':
        # İsimsiz parça: is-a kavramlarından eşleşen ilkini kullan
        for cname in reversed(concepts.get(fid, [])):
            r = classify(cname)
            if r not in ('UNMATCHED', None):
                result = r
                name = name or cname
                break
    if result in ('UNMATCHED', None):
        skipped.append((fid, name))
        continue

    la, tr, layer, kind, side = result
    # Tarafı isimden çıkarılamayan çift yapılarda merkezden karar ver (+x = hastanın solu)
    if side is None and bounds and layer in ('kas', 'iskelet') and not name:
        cx = (bounds[0] + bounds[3]) / 2
        if abs(cx) > 15:
            side = 'L' if cx > 0 else 'R'
    mapping.append({'file': fid, 'name': name, 'la': la, 'tr': tr, 'layer': layer, 'kind': kind, 'side': side})

json.dump(mapping, open(out, 'w'), ensure_ascii=False, indent=0)
print(f'{len(mapping)} parça eşlendi, {len(skipped)} atlandı: {skipped}')
