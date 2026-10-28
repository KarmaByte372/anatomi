"""Kadın modelinin köşe konumlarını üretir (build.mjs bunları okur).

    python3 scripts/anatomy/kadin/export.py <bodyparts3d_klasörü> <warp.npz> <organs_klasörü> <çıktı_klasörü>

- Erkek modeldeki her yapı (erkeğe özgü olanlar hariç) warp.py'nin ince plaka dönüşümüyle kadın bedenine taşınır.
- organs.py'nin çıkardığı kadına özgü yapılar ve kadın derisi eklenir (derinin kolları skin.py ile modelin pozuna getirilir).
- Kadın bedeni, uygulamada erkek modelle aynı yerde dursun diye ortalanır (ayaklar aynı zeminde).

Çıktı: positions.bin (float32, uygulama koordinatları), index.json {OBJ adı: [başlangıç, köşe sayısı]},
       extra/*.obj ve extra/yapilar.json (kadına özgü yapılar; ortalanmış).
"""
import json
import shutil
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from common import read_obj  # noqa: E402
from organs import write_obj  # noqa: E402
from skin import main as fix_skin_arms  # noqa: E402
from warp import TPS  # noqa: E402

# Kadın modelinde bulunmayan erkek yapıları (Latince adla)
MALE_ONLY = {
    'Corpus cavernosum penis', 'Corpus spongiosum penis', 'Glans penis', 'Ductus deferens', 'Epididymis',
    'Vesicula seminalis', 'Testis', 'Prostata', 'Urethra', 'Vv. dorsales penis', 'A. dorsalis penis',
    # Erkek derisi ve saçı yerine atlastaki kadın derisi kullanılır
    'Cutis', 'Auricula', 'Capilli',
}


def main(bp3d_dir, warp_npz, organs_dir, out_dir):
    out = Path(out_dir)
    if out.exists():
        shutil.rmtree(out)
    (out / 'extra').mkdir(parents=True)
    z = np.load(warp_npz)
    tps = TPS.__new__(TPS)
    tps.src, tps.w, tps.a = z['src'], z['w'], z['a']

    mapping = json.load(open(Path(bp3d_dir) / 'mapping.json'))
    obj_dir = Path(bp3d_dir) / 'isa_BP3D_4.0_obj_99'

    # Ortalamak için: erkek ve dönüştürülmüş kadın iskeletinin sınırları
    bones = [m['file'] for m in mapping if m['kind'] == 'bone']
    male_b = np.concatenate([read_obj(obj_dir / f'{f}.obj')[0] for f in bones])
    fem_b = tps(male_b[::5])
    shift = np.array([
        (male_b[:, 0].min() + male_b[:, 0].max()) / 2 - (fem_b[:, 0].min() + fem_b[:, 0].max()) / 2,
        male_b[:, 1].min() - fem_b[:, 1].min(),
        (male_b[:, 2].min() + male_b[:, 2].max()) / 2 - (fem_b[:, 2].min() + fem_b[:, 2].max()) / 2,
    ])
    print('ortalama kayması', shift.round(3))

    index = {}
    chunks = []
    offset = 0
    keep = [m for m in mapping if m['la'] not in MALE_ONLY]
    for k, m in enumerate(keep):
        v, _ = read_obj(obj_dir / f"{m['file']}.obj")
        w = (tps(v) + shift).astype(np.float32)
        index[m['file']] = [offset, len(w)]
        chunks.append(w.ravel())
        offset += w.size
        if k % 200 == 0:
            print(f'{k}/{len(keep)}')
    np.concatenate(chunks).tofile(out / 'positions.bin')
    json.dump(index, open(out / 'index.json', 'w'))

    meta = json.load(open(Path(organs_dir) / 'yapilar.json'))
    for m in meta:
        v, f = read_obj(Path(organs_dir) / f"{m['file']}.obj")
        write_obj(out / 'extra' / f"{m['file']}.obj", v + shift, f)
    json.dump(meta, open(out / 'extra' / 'yapilar.json', 'w'), ensure_ascii=False, indent=1)
    # Atlas derisinin yana açık kollarını modelin pozuna getir
    fix_skin_arms(bp3d_dir, out)
    print(f'{len(index)} erkek yapı dosyası taşındı, {len(meta)} kadına özgü yapı eklendi')


if __name__ == '__main__':
    main(*sys.argv[1:5])
