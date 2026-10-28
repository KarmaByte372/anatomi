import * as THREE from 'three';

import type { AnatomyLayer } from '@/data/anatomyTypes';

import { EXPLODE_SCALE } from './loader';

/** Ayrık görünüm miktarı (0–1); tüm katman malzemeleri aynı değeri paylaşır, çubuk sürüklenince yalnızca bu değişir */
export const explodeUniform = { value: 0 };

/** Katmana göre yüzey: organlar ve damarlar ıslak/parlak, kemik mat, kaslarda lif dokusu */
const SURFACE: Record<AnatomyLayer, { roughness: number; fibers: number }> = {
  deri: { roughness: 0.62, fibers: 0 },
  kas: { roughness: 0.62, fibers: 1 },
  iskelet: { roughness: 0.78, fibers: 0 },
  organ: { roughness: 0.36, fibers: 0 },
  damar: { roughness: 0.32, fibers: 0 },
  sinir: { roughness: 0.42, fibers: 0 },
};

/**
 * MeshStandardMaterial'e iki ek:
 * - `fiberAo.w` köşe niteliği: önceden hesaplanmış ortam gölgesi (kas araları, kemik girintileri derinlik kazanır)
 * - `fiberAo.xyz` köşe niteliği: kasın uzun ekseni; yüzeye bu eksen boyunca ince lif çizgileri çizilir.
 *   Çizgiler uzaktan bakınca (piksel başına birden fazla lif düştüğünde) titreşmesin diye söner.
 */
export function createAnatomyMaterial(layer: AnatomyLayer, opts: { color?: THREE.ColorRepresentation; side?: THREE.Side } = {}): THREE.MeshStandardMaterial {
  const surface = SURFACE[layer];
  const material = new THREE.MeshStandardMaterial({
    vertexColors: opts.color === undefined,
    color: opts.color ?? 0xffffff,
    roughness: surface.roughness,
    metalness: 0,
    side: opts.side ?? THREE.DoubleSide,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.fiberStrength = { value: surface.fibers };
    shader.uniforms.explodeAmount = explodeUniform;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
attribute vec4 fiberAo;
attribute vec4 explodeDir;
uniform float explodeAmount;
varying float vAo;
varying vec3 vFiber;
varying vec3 vObjPos;
varying vec3 vObjNormal;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
vFiber = fiberAo.xyz;
vAo = fiberAo.w;
vObjPos = position;
vObjNormal = normal;
transformed += explodeDir.xyz * (${EXPLODE_SCALE.toFixed(1)} * explodeAmount);`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform float fiberStrength;
varying float vAo;
varying vec3 vFiber;
varying vec3 vObjPos;
varying vec3 vObjNormal;`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
float occ = vAo;
vec3 fiberTangent = vec3(0.0);
float fiberSlope = 0.0;
if (fiberStrength > 0.0 && dot(vFiber, vFiber) > 0.25) {
  vec3 f = normalize(vFiber);
  vec3 u = cross(f, normalize(vObjNormal));
  float lu = length(u);
  if (lu > 0.05) {
    u /= lu;
    // ~1,5 mm aralıklı lif demetleri; hafif dalgalanma ile doğal görünüm
    float along = dot(vObjPos, f);
    float coord = dot(vObjPos, u) * 420.0 + sin(along * 37.0) * 1.6 + sin(along * 11.0 + dot(vObjPos, u) * 60.0) * 0.8;
    float fade = clamp(1.6 - fwidth(coord) * 0.9, 0.0, 1.0);
    float s = 0.5 + 0.5 * sin(coord);
    float bundle = 0.5 + 0.5 * sin(coord * 0.23 + 1.7);
    diffuseColor.rgb *= 1.0 - fiberStrength * fade * (0.16 * s * s + 0.08 * bundle);
    // Lif kabartması: normal liflere dik yönde hafifçe eğilir, ışık açısına göre çizgiler parlar/kararır
    fiberTangent = u;
    fiberSlope = fiberStrength * fade * (0.35 * cos(coord) + 0.15 * cos(coord * 0.23 + 1.7));
  }
}`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
if (fiberSlope != 0.0) normal = normalize(normal + (mat3(viewMatrix) * fiberTangent) * fiberSlope);`,
      )
      .replace(
        '#include <aomap_fragment>',
        `#include <aomap_fragment>
occ = pow(occ, 1.25);
reflectedLight.indirectDiffuse *= occ;
reflectedLight.indirectSpecular *= occ;
reflectedLight.directDiffuse *= mix(1.0, occ, 0.6);
reflectedLight.directSpecular *= mix(1.0, occ, 0.5);`,
      );
  };
  // Aynı değiştirilmiş gölgelendirici tüm katmanlarda paylaşılsın, lif gücü uniform ile ayrışsın
  material.customProgramCacheKey = () => 'anatomy-v3';
  return material;
}
