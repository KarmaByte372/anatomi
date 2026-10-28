"""Atlastaki kadın derisinin kollarını modelin pozuna getirir.

Atlas derisinde kollar yana açıktır; kadın modelinde ise kemik ve kaslar (erkek modelden taşındığı için) anatomik
pozisyondadır. Her kol omuz ekleminin etrafında döndürülüp boyca ölçeklenir: atlasın el ucu, modelin el kemiklerine
gelir. Koltuk altı ve omuzda geçiş yumuşak tutulur (gövde derisi yerinde kalır).

    python3 scripts/anatomy/kadin/skin.py <bodyparts3d_klasörü> <export_çıktı_klasörü>
"""
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from common import read_obj  # noqa: E402
from organs import write_obj  # noqa: E402

HAND = ['Os metacarpi II', 'Os metacarpi III', 'Os metacarpi IV', 'Phalanx proximalis digiti III manus']


def rotation_between(a, b):
    a = a / np.linalg.norm(a)
    b = b / np.linalg.norm(b)
    v = np.cross(a, b)
    c = float(a @ b)
    if np.linalg.norm(v) < 1e-9:
        return np.eye(3)
    vx = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
    return np.eye(3) + vx + vx @ vx / (1 + c)


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def main(bp3d_dir, out_dir):
    out = Path(out_dir)
    mapping = json.load(open(Path(bp3d_dir) / 'mapping.json'))
    index = json.load(open(out / 'index.json'))
    pos = np.fromfile(out / 'positions.bin', dtype=np.float32)

    def warped(la, side):
        ps = []
        for m in mapping:
            if m['la'] == la and m['side'] == side and m['file'] in index:
                s, n = index[m['file']]
                ps.append(pos[s:s + n * 3].reshape(-1, 3))
        return np.concatenate(ps).astype(np.float64)

    v, f = read_obj(out / 'extra' / 'skin.obj')
    v = v.copy()
    for side, sign in (('L', 1.0), ('R', -1.0)):
        hum = warped('Humerus', side)
        # Omuz eklemi: humerus başının merkezi (kemiğin en üst %8'i)
        top = hum[hum[:, 1] > np.percentile(hum[:, 1], 92)]
        pivot = top.mean(0)
        hand_t = np.concatenate([warped(la, side) for la in HAND]).mean(0)

        # Atlas derisinde elin ucu: o taraftaki en dıştaki köşeler
        lateral = v[:, 0] * sign
        hand_s = v[lateral > np.percentile(lateral, 99.7)].mean(0)
        hand_s[1] = v[lateral > np.percentile(lateral, 99.7)][:, 1].mean()

        src = hand_s - pivot
        dst = hand_t - pivot
        R = rotation_between(src, dst)
        k = np.linalg.norm(dst) / np.linalg.norm(src)
        axis = src / np.linalg.norm(src)

        rel = v - pivot
        t = rel @ axis / np.linalg.norm(src)  # omuzdan ele 0 → 1
        radial = np.linalg.norm(rel - np.outer(rel @ axis, axis), axis=1)
        on_side = (v[:, 0] * sign) > (pivot[0] * sign - 0.6)
        # Omuzdan uzaklaştıkça tam dönüş; kol ekseninden uzak (gövde) köşeler etkilenmez
        # Ele doğru kol kalınlaşır (açık parmaklar); izin verilen uzaklık t ile büyür
        w = smoothstep(0.02, 0.22, t) * smoothstep(1.1 + 0.9 * t, 0.7 + 0.7 * t, radial) * on_side
        moved = pivot + (R @ rel.T).T
        # Boyca ölçek yalnızca kol ekseni boyunca
        along = (moved - pivot) @ (dst / np.linalg.norm(dst))
        moved += np.outer(along * (k - 1), dst / np.linalg.norm(dst))
        v = v + w[:, None] * (moved - v)
        ang = np.degrees(np.arccos(np.clip(src @ dst / np.linalg.norm(src) / np.linalg.norm(dst), -1, 1)))
        print(f'{side} kolu: {ang:.0f}° döndürüldü, boy oranı {k:.2f}, {int((w > 0.01).sum())} köşe')
    write_obj(out / 'extra' / 'skin.obj', v, f)


if __name__ == '__main__':
    main(*sys.argv[1:3])
