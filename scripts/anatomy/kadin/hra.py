"""Human Reference Atlas (HuBMAP) GLB dosyasını okur: düğüm adı → dünya koordinatlarında üçgen ağ.

Kaynak: https://humanatlas.io/3d-reference-library — CC BY 4.0
"""
import json
import struct

import numpy as np

COMPONENT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
WIDTH = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}


def _matrix(node):
    if 'matrix' in node:
        return np.array(node['matrix'], dtype=np.float64).reshape(4, 4).T
    M = np.eye(4)
    if 'scale' in node:
        M = np.diag([*node['scale'], 1.0]) @ M
    if 'rotation' in node:
        x, y, z, w = node['rotation']
        R = np.array([
            [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
            [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
            [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)],
        ])
        Rm = np.eye(4)
        Rm[:3, :3] = R
        M = Rm @ M
    if 'translation' in node:
        T = np.eye(4)
        T[:3, 3] = node['translation']
        M = T @ M
    return M


def load(path):
    """{düğüm adı: (köşeler Nx3, üçgenler Mx3)}; köşeler GLB'nin dünya koordinatlarında"""
    data = open(path, 'rb').read()
    ln = struct.unpack_from('<I', data, 12)[0]
    gltf = json.loads(data[20:20 + ln])
    off = 20 + ln
    bin_len = struct.unpack_from('<I', data, off)[0]
    binary = memoryview(data)[off + 8:off + 8 + bin_len]

    def accessor(i):
        a = gltf['accessors'][i]
        bv = gltf['bufferViews'][a['bufferView']]
        dt = np.dtype(COMPONENT[a['componentType']])
        n = WIDTH[a['type']]
        start = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
        stride = bv.get('byteStride', 0)
        if stride and stride != dt.itemsize * n:
            raw = np.frombuffer(binary, dtype=np.uint8, count=stride * (a['count'] - 1) + dt.itemsize * n, offset=start)
            rows = np.lib.stride_tricks.as_strided(raw, shape=(a['count'], dt.itemsize * n), strides=(stride, 1))
            return np.frombuffer(rows.copy().tobytes(), dtype=dt).reshape(a['count'], n)
        return np.frombuffer(binary, dtype=dt, count=a['count'] * n, offset=start).reshape(a['count'], n)

    out = {}
    nodes = gltf['nodes']
    parent = {}
    for i, nd in enumerate(nodes):
        for c in nd.get('children', []):
            parent[c] = i

    def world(i):
        M = _matrix(nodes[i])
        while i in parent:
            i = parent[i]
            M = _matrix(nodes[i]) @ M
        return M

    for i, nd in enumerate(nodes):
        if 'mesh' not in nd:
            continue
        M = world(i)
        vs, fs, base = [], [], 0
        for prim in gltf['meshes'][nd['mesh']]['primitives']:
            if prim.get('mode', 4) != 4:
                continue
            p = accessor(prim['attributes']['POSITION']).astype(np.float64)
            p = p @ M[:3, :3].T + M[:3, 3]
            f = accessor(prim['indices']).reshape(-1, 3).astype(np.int64) if 'indices' in prim else np.arange(len(p)).reshape(-1, 3)
            vs.append(p)
            fs.append(f + base)
            base += len(p)
        if vs:
            out[nd.get('name', f'node{i}')] = (np.concatenate(vs), np.concatenate(fs))
    return out
