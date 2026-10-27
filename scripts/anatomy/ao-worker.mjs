/**
 * Köşe başına ortam gölgesi (ambient occlusion) hesaplar; build.mjs tarafından iş parçacığı olarak çalıştırılır.
 * Her köşeden normal yönündeki yarım küreye ışın atılır; yakın engellere çarpan ışınlar köşeyi karartır.
 */
import { parentPort, workerData } from 'node:worker_threads';
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';

const { positions, normals, indices, start, end, rays, radius } = workerData;

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setIndex(new THREE.BufferAttribute(indices, 1));
const bvh = new MeshBVH(geometry);

// Kosinüs ağırlıklı, katmanlı (stratified) yarım küre örnekleri (yerel uzayda, z = normal)
const golden = Math.PI * (3 - Math.sqrt(5));
const dirs = [];
for (let i = 0; i < rays; i++) {
  const r = Math.sqrt((i + 0.5) / rays);
  const a = i * golden;
  dirs.push([r * Math.cos(a), r * Math.sin(a), Math.sqrt(Math.max(0, 1 - r * r))]);
}

const ray = new THREE.Ray();
const n = new THREE.Vector3();
const t1 = new THREE.Vector3();
const t2 = new THREE.Vector3();
const eps = radius * 0.01;

/** Normalin bir tarafındaki yarım kürenin kapalılık oranı (0 = açık, 1 = tamamen kapalı) */
function occlusion(px, py, pz, sign, rot) {
  let occ = 0;
  for (let i = 0; i < rays; i++) {
    const [lx0, ly0, lz] = dirs[i];
    // Her köşede örnekleri farklı açıyla döndür (bantlaşmayı önler)
    const lx = lx0 * Math.cos(rot) - ly0 * Math.sin(rot);
    const ly = lx0 * Math.sin(rot) + ly0 * Math.cos(rot);
    ray.direction.set(
      sign * (t1.x * lx + t2.x * ly + n.x * lz),
      sign * (t1.y * lx + t2.y * ly + n.y * lz),
      sign * (t1.z * lx + t2.z * ly + n.z * lz),
    );
    ray.origin.set(px + ray.direction.x * eps + sign * n.x * eps, py + ray.direction.y * eps + sign * n.y * eps, pz + ray.direction.z * eps + sign * n.z * eps);
    const hit = bvh.raycastFirst(ray, THREE.DoubleSide, 0, radius);
    if (hit) occ += 1 - hit.distance / radius;
  }
  return occ / rays;
}

const out = new Uint8Array(end - start);
for (let v = start; v < end; v++) {
  const px = positions[v * 3];
  const py = positions[v * 3 + 1];
  const pz = positions[v * 3 + 2];
  n.set(normals[v * 3], normals[v * 3 + 1], normals[v * 3 + 2]);
  if (n.lengthSq() < 1e-8) {
    out[v - start] = 255;
    continue;
  }
  n.normalize();
  t1.set(Math.abs(n.x) < 0.9 ? 1 : 0, Math.abs(n.x) < 0.9 ? 0 : 1, 0).cross(n).normalize();
  t2.copy(n).cross(t1);
  const rot = ((v * 2654435761) % 6283) / 1000;
  let occ = occlusion(px, py, pz, 1, rot);
  // Ters dönük normal (kapalı ağın içine bakıyor) ise öbür yarım küreyi kullan
  if (occ > 0.85) occ = Math.min(occ, occlusion(px, py, pz, -1, rot));
  const visibility = Math.pow(1 - occ, 1.4);
  out[v - start] = Math.round(Math.max(0, Math.min(1, visibility)) * 255);
  if ((v - start) % 20000 === 0) parentPort.postMessage({ progress: v - start });
}
parentPort.postMessage({ done: out }, [out.buffer]);
