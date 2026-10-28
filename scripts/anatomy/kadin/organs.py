"""Kadına özgü yapıları Human Reference Atlas'tan (Visible Human Female) alıp kadın modelinin koordinatlarına taşır.

    python3 scripts/anatomy/kadin/organs.py <vh-f-united.glb> <bonehub_kadın_stl_klasörü> <çıktı_klasörü>

Atlas ve BoneHub iskeleti aynı bağışçıdan gelir; ortak kemikler (sakrum, kalça kemikleri, femur, omurlar)
üzerinden benzerlik dönüşümüyle hizalanır. Çıktı: <çıktı>/yapilar.json (isimler, katman, tür) ve her yapı için OBJ.
"""
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
import hra  # noqa: E402
from common import read_stl  # noqa: E402
from warp import apply, icp, umeyama  # noqa: E402

# Atlas düğümü → (Latince, Türkçe, tür, taraf)  — taraf None ise konumdan belirlenir
FEMALE = {
    'VH_F_fundus_of_uterus': ('Fundus uteri', 'Rahim tabanı (fundus)', 'genital', None),
    'VH_F_body_of_uterus': ('Corpus uteri', 'Rahim gövdesi', 'genital', None),
    'VH_F_anterior_wall_of_uterus': ('Paries anterior uteri', 'Rahim ön duvarı', 'genital', None),
    'VH_F_posterior_wall_of_uterus': ('Paries posterior uteri', 'Rahim arka duvarı', 'genital', None),
    'VH_F_lower_uterine_segment': ('Segmentum uteri inferius', 'Alt uterin segment', 'genital', None),
    'VH_F_cervix': ('Cervix uteri', 'Rahim boynu (serviks)', 'genital', None),
    'VH_F_cervicovaginal_junction': ('Junctio cervicovaginalis', 'Serviks–vajina birleşimi', 'genital', None),
    'VH_F_vagina': ('Vagina', 'Vajina (hazne)', 'genital', None),
    'VH_F_uterovesical_pouch': ('Excavatio vesicouterina', 'Vezikouterin çukur', 'genital', None),
    'VH_F_ampulla_of_uterine_tube_L': ('Ampulla tubae uterinae', 'Tüp ampullası', 'genital', 'L'),
    'VH_F_ampulla_of_uterine_tube_R': ('Ampulla tubae uterinae', 'Tüp ampullası', 'genital', 'R'),
    'VH_F_isthmus_of_fallopian_tube_L': ('Isthmus tubae uterinae', 'Tüp istmusu', 'genital', 'L'),
    'VH_F_isthmus_of_fallopian_tube_R': ('Isthmus tubae uterinae', 'Tüp istmusu', 'genital', 'R'),
    'VH_F_uterine_tube_infundibulum_L': ('Infundibulum tubae uterinae', 'Tüp infundibulumu', 'genital', 'L'),
    'VH_F_uterine_tube_infundibulum_R': ('Infundibulum tubae uterinae', 'Tüp infundibulumu', 'genital', 'R'),
    'VH_F_fibria_of_uterine_tube_L': ('Fimbriae tubae uterinae', 'Tüp saçakları (fimbriya)', 'genital', 'L'),
    'VH_F_fibria_of_uterine_tube_R': ('Fimbriae tubae uterinae', 'Tüp saçakları (fimbriya)', 'genital', 'R'),
    'VH_F_abdominal_ostium_of_uterine_tube': ('Ostium abdominale tubae uterinae', 'Tüpün karın ağzı', 'genital', None),
    'VH_F_left_ovary': ('Ovarium', 'Yumurtalık', 'ovary', 'L'),
    'VH_F_right_ovary': ('Ovarium', 'Yumurtalık', 'ovary', 'R'),
    'VH_F_mesovarium_L': ('Mesovarium', 'Mezovaryum', 'ligament', 'L'),
    'VH_F_mesovarium_R': ('Mesovarium', 'Mezovaryum', 'ligament', 'R'),
    'VH_F_left_round_ligament_of_uterus': ('Lig. teres uteri', 'Rahmin yuvarlak bağı', 'ligament', 'L'),
    'VH_F_right_round_ligament_of_uterus': ('Lig. teres uteri', 'Rahmin yuvarlak bağı', 'ligament', 'R'),
    'VH_F_left_cardinal_ligament_of_uterus': ('Lig. cardinale', 'Kardinal bağ (Mackenrodt)', 'ligament', 'L'),
    'VH_F_right_cardinal_ligament_of_uterus': ('Lig. cardinale', 'Kardinal bağ (Mackenrodt)', 'ligament', 'R'),
    'VH_F_left_uterosacral_ligament': ('Lig. uterosacrale', 'Uterosakral bağ', 'ligament', 'L'),
    'VH_F_right_uterosacral_ligament': ('Lig. uterosacrale', 'Uterosakral bağ', 'ligament', 'R'),
    'VH_F_suspensory_ligament_of_ovary_L': ('Lig. suspensorium ovarii', 'Yumurtalığı asan bağ', 'ligament', 'L'),
    'VH_F_suspensory_ligament_of_ovary_R': ('Lig. suspensorium ovarii', 'Yumurtalığı asan bağ', 'ligament', 'R'),
    'VH_F_ovarian_ligament_L': ('Lig. ovarii proprium', 'Yumurtalığın öz bağı', 'ligament', 'L'),
    'VH_F_ovarian_ligament_R': ('Lig. ovarii proprium', 'Yumurtalığın öz bağı', 'ligament', 'R'),
    'VH_F_mammary_lobes_L': ('Glandula mammaria', 'Meme bezi', 'breast', 'L'),
    'VH_F_mammary_lobes_R': ('Glandula mammaria', 'Meme bezi', 'breast', 'R'),
    'VH_F_nipple_L': ('Papilla mammaria', 'Meme başı', 'nipple', 'L'),
    'VH_F_nipple_R': ('Papilla mammaria', 'Meme başı', 'nipple', 'R'),
    'VH_F_areola_L': ('Areola mammae', 'Areola', 'nipple', 'L'),
    'VH_F_areola_R': ('Areola mammae', 'Areola', 'nipple', 'R'),
}
SKIN = 'VH_F_skin'

# Hizalama için ortak kemikler: atlas düğümleri ↔ BoneHub dosyaları
SHARED = [
    (['VH_F_sacrum', 'VH_F_coccyx'], ['SACRUM']),
    ([f'VH_F_{p}_compact_bone_L' for p in ('ilium', 'ischium', 'pubis')], ['HIP_LEFT']),
    ([f'VH_F_{p}_compact_bone_R' for p in ('ilium', 'ischium', 'pubis')], ['HIP_RIGHT']),
    *[([f'VH_F_lumbar_vertebra_{i}'], [f'VERTEBRA_L{i}']) for i in range(1, 7)],
]


def to_app(v):
    """Atlas: metre, x = sol, y = yukarı, z = ön → uygulama birimi (10 cm)"""
    return v * 10.0


def main(glb, bonehub_dir, out_dir):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    atlas = hra.load(glb)

    src, dst = [], []
    for nodes, files in SHARED:
        a = np.concatenate([to_app(atlas[n][0]) for n in nodes])
        b = np.concatenate([read_stl(Path(bonehub_dir) / f'{f}.stl')[0] for f in files])
        src.append(a)
        dst.append(b)
    # Önce kütle merkezleriyle kaba hizalama, sonra tüm ortak kemiklerde ICP
    T0 = umeyama(np.array([s.mean(0) for s in src]), np.array([d.mean(0) for d in dst]))
    T = icp(np.concatenate(src), np.concatenate(dst), T0, iters=60)
    print(f'atlas → kadın iskeleti: ölçek {T[0]:.3f}')
    for s, d, (nodes, _) in zip(src, dst, SHARED):
        print(f'  {nodes[0]:34s} merkez farkı {np.linalg.norm(apply(T, s).mean(0) - d.mean(0)) * 100:.1f} mm')

    meta = []
    for node, (la, tr, kind, side) in FEMALE.items():
        v, f = atlas[node]
        v = apply(T, to_app(v))
        if side is None and abs(v[:, 0].mean()) > 0.15:
            side = 'L' if v[:, 0].mean() > 0 else 'R'
        name = node.replace('VH_F_', '')
        write_obj(out / f'{name}.obj', v, f)
        meta.append({'file': name, 'la': la, 'tr': tr, 'layer': 'organ', 'kind': kind, 'side': side})
    v, f = atlas[SKIN]
    write_obj(out / 'skin.obj', apply(T, to_app(v)), f)
    meta.append({'file': 'skin', 'la': 'Cutis', 'tr': 'Deri', 'layer': 'deri', 'kind': 'skin', 'side': None})
    json.dump(meta, open(out / 'yapilar.json', 'w'), ensure_ascii=False, indent=1)
    print(f'{len(meta)} yapı yazıldı')


def write_obj(path, v, f):
    """Uygulama koordinatlarından BodyParts3D OBJ düzenine (mm; x, -z, y) geri çevirerek yazar; build.mjs aynı okuyucuyu kullanır"""
    with open(path, 'w') as fh:
        for x, y, z in v:
            fh.write(f'v {x * 100:.3f} {-z * 100:.3f} {y * 100:.3f}\n')
        for a, b, c in f:
            fh.write(f'f {a + 1} {b + 1} {c + 1}\n')


if __name__ == '__main__':
    main(*sys.argv[1:4])
