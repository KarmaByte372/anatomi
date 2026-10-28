"""Erkek modeli (BodyParts3D) kadın iskeletine (BoneHub, Visible Human Female) oturtan uzay dönüşümü.

    python3 scripts/anatomy/kadin/warp.py <bodyparts3d_klasörü> <bonehub_kadın_stl_klasörü> <çıktı.npz>

1. Her kemik grubu için erkek kemiği kadın kemiğine benzerlik dönüşümüyle (döndürme + ölçek + öteleme) hizalanır,
   ardından en yakın yüzey noktalarıyla ince ayar yapılır → (erkek noktası, kadın noktası) kontrol çiftleri.
2. Kadavra pozundaki farklar (eller uyluk önünde, ayaklar aşağı uzanmış) kasları bükmesin diye önkol, el ve ayak
   kemikleri kadının şeklini değil, bağlı oldukları kemiğin (humerus / tibia) dönüşümünü izler: poz erkek
   modelinki (anatomik pozisyon) kalır, boyut ve konum kadına uyar.
3. Kontrol çiftlerinden ince plaka eğrisi (thin-plate spline) kurulur; bütün yapılar (kas, damar, organ...) bu
   dönüşümle kadın bedenine taşınır.
"""
import sys
from pathlib import Path

import numpy as np
from scipy.spatial import cKDTree

sys.path.insert(0, str(Path(__file__).parent))
from common import load_groups  # noqa: E402

# Bu kemikler kadın şeklini değil, bağlı oldukları kemiğin dönüşümünü izler
FOLLOW = {
    'L': ('HumerusL', ['RadiusL', 'UlnaL', 'Os capitatumL', 'Os hamatumL', 'Os lunatumL', 'Os pisiformeL', 'Os scaphoideumL', 'Os trapeziumL',
                       'Os trapezoideumL', 'Os triquetrumL'] + [f'metakarp{i}L' for i in range(1, 6)] + [f'elparmak{i}L' for i in range(1, 6)]),
    'R': ('HumerusR', ['RadiusR', 'UlnaR', 'Os capitatumR', 'Os hamatumR', 'Os lunatumR', 'Os pisiformeR', 'Os scaphoideumR', 'Os trapeziumR',
                       'Os trapezoideumR', 'Os triquetrumR'] + [f'metakarp{i}R' for i in range(1, 6)] + [f'elparmak{i}R' for i in range(1, 6)]),
}
FOOT = ['Talus', 'Calcaneus', 'Os naviculare', 'Os cuboideum', 'Os cuneiforme mediale', 'Os cuneiforme intermedium', 'Os cuneiforme laterale']
for s in 'LR':
    FOLLOW['foot' + s] = ('Tibia' + s, [f'{b}{s}' for b in FOOT] + [f'metatars{i}{s}' for i in range(1, 6)] + [f'ayakparmak{i}{s}' for i in range(1, 6)])


def umeyama(src, dst, scale=True):
    """En küçük kareler benzerlik dönüşümü: dst ≈ c·R·src + t"""
    ms, md = src.mean(0), dst.mean(0)
    s, d = src - ms, dst - md
    U, S, Vt = np.linalg.svd(d.T @ s / len(src))
    D = np.eye(3)
    D[2, 2] = np.sign(np.linalg.det(U @ Vt))
    R = U @ D @ Vt
    c = (S * np.diag(D)).sum() / ((s ** 2).sum() / len(src)) if scale else 1.0
    return c, R, md - c * R @ ms


def apply(T, p):
    c, R, t = T
    return (c * (R @ p.T)).T + t


def compose(A, B):
    """A ∘ B"""
    ca, Ra, ta = A
    cb, Rb, tb = B
    return ca * cb, Ra @ Rb, ca * Ra @ tb + ta


def icp(src, dst, T0, iters=40):
    """Benzerlik dönüşümlü, iki yönlü ICP. Tek yönlü eşleştirmede ölçek küçülüp kemik karşı kemiğin içine
    çökebilir; her iterasyonda hem erkek→kadın hem kadın→erkek en yakın noktaları birlikte kullanılır.
    Kesik kemiklerde (ör. dirsek) kayma olmasın diye en uzak eşleşmeler atılır."""
    rng = np.random.default_rng(1)
    src = src[rng.choice(len(src), min(len(src), 6000), replace=False)]
    dst = dst[rng.choice(len(dst), min(len(dst), 6000), replace=False)]
    tree_d = cKDTree(dst)
    T = T0
    for _ in range(iters):
        cur = apply(T, src)
        d1, j = tree_d.query(cur)
        d2, i = cKDTree(cur).query(dst)
        a = np.concatenate([src, src[i]])
        b = np.concatenate([dst[j], dst])
        d = np.concatenate([d1, d2])
        keep = d < max(np.percentile(d, 85), 1e-6)
        T = umeyama(a[keep], b[keep])
    return T


def sample(p, n, seed=0):
    """Yüzeyde yaklaşık eşit aralıklı n nokta (en uzak nokta örneklemesi)"""
    if len(p) <= n:
        return p
    rng = np.random.default_rng(seed)
    cand = p[rng.choice(len(p), min(len(p), n * 20), replace=False)]
    out = [cand[0]]
    d = np.linalg.norm(cand - cand[0], axis=1)
    for _ in range(n - 1):
        k = int(d.argmax())
        out.append(cand[k])
        d = np.minimum(d, np.linalg.norm(cand - cand[k], axis=1))
    return np.array(out)


def n_controls(m):
    """Kemiğin büyüklüğüne göre kontrol noktası sayısı"""
    ext = np.linalg.norm(m.max(0) - m.min(0))
    return int(np.clip(ext * 22, 8, 160))


class TPS:
    """3B ince plaka eğrisi, φ(r) = r"""

    def __init__(self, src, dst, reg=1e-3):
        n = len(src)
        K = np.linalg.norm(src[:, None] - src[None], axis=2)
        P = np.hstack([np.ones((n, 1)), src])
        A = np.zeros((n + 4, n + 4))
        A[:n, :n] = K + reg * np.eye(n)
        A[:n, n:] = P
        A[n:, :n] = P.T
        b = np.zeros((n + 4, 3))
        b[:n] = dst
        sol = np.linalg.solve(A, b)
        self.src, self.w, self.a = src, sol[:n], sol[n:]

    def __call__(self, p, chunk=20000):
        out = np.empty_like(p)
        for i in range(0, len(p), chunk):
            q = p[i:i + chunk]
            K = np.linalg.norm(q[:, None] - self.src[None], axis=2)
            out[i:i + chunk] = K @ self.w + self.a[0] + q @ self.a[1:]
        return out


def build(bp3d_dir, bonehub_dir):
    groups = load_groups(bp3d_dir, bonehub_dir)
    by = {n: (m, f) for n, m, f in groups}
    cm = np.array([m.mean(0) for _, m, _ in groups])
    cf = np.array([f.mean(0) for _, _, f in groups])
    follower = {b for _, (_, bs) in FOLLOW.items() for b in bs}
    # Poz farkı olan uzuvlar küresel hizalamayı bozmasın
    core = [i for i, (n, _, _) in enumerate(groups) if n not in follower]
    G = umeyama(cm[core], cf[core])
    print(f'küresel ölçek {G[0]:.3f}')

    T = {}
    for n, m, f in groups:
        if n in follower:
            continue
        T[n] = icp(m, f, G)

    src, dst = [], []
    for n, m, f in groups:
        if n in follower:
            continue
        s = sample(m, n_controls(m))
        moved = apply(T[n], s)
        dist, j = cKDTree(f).query(moved)
        # Yakın yüzey noktasına çek (şekil farkı); uzaksa (kesik kemik) yalnızca benzerlik dönüşümü
        tgt = np.where((dist < 0.08)[:, None], f[j], moved)
        src.append(s)
        dst.append(tgt)
        print(f'{n:28s} ölçek {T[n][0]:.3f}  ortalama sapma {dist.mean() * 10:.1f} cm')
    for _, (parent, bs) in FOLLOW.items():
        for b in bs:
            m = by[b][0]
            s = sample(m, n_controls(m))
            src.append(s)
            dst.append(apply(T[parent], s))
    src = np.concatenate(src)
    dst = np.concatenate(dst)
    print(f'{len(src)} kontrol noktası')
    return src, dst


if __name__ == '__main__':
    bp3d_dir, bonehub_dir, out = sys.argv[1:4]
    src, dst = build(bp3d_dir, bonehub_dir)
    tps = TPS(src, dst)
    res = np.linalg.norm(tps(src) - dst, axis=1)
    print(f'TPS kontrol hatası: ortalama {res.mean() * 100:.1f} mm, en fazla {res.max() * 100:.1f} mm')
    np.savez(out, src=tps.src, w=tps.w, a=tps.a, ctrl_src=src, ctrl_dst=dst)
