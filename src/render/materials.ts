import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Shared "toy" look: a handful of PBR finishes driven by vertex colors, plus cached smooth primitives.
// Models are assembled with a Kit, which merges everything into one mesh per finish (few draw calls).

export type Finish = 'matte' | 'soft' | 'gloss' | 'metal' | 'glass' | 'glow' | 'rubber';

const finishes = new Map<Finish, THREE.Material>();

/** Shared vertex-colored material for a finish. */
export function finishMat(f: Finish): THREE.Material {
  let m = finishes.get(f);
  if (m) return m;
  switch (f) {
    case 'matte':
      m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82 });
      break;
    case 'soft':
      m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 });
      break;
    case 'rubber':
      m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
      break;
    case 'gloss':
      m = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12 });
      break;
    case 'metal':
      m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.28, metalness: 0.85 });
      break;
    case 'glass':
      m = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.6 });
      break;
    case 'glow':
      m = new THREE.MeshBasicMaterial({ vertexColors: true });
      break;
  }
  finishes.set(f, m);
  return m;
}

const cache = new Map<string, THREE.MeshStandardMaterial>();

/** Plain (non vertex-colored) material for one-off meshes. */
export function mat(color: number, opts: { rough?: number; metal?: number; emissive?: number; opacity?: number; gloss?: boolean } = {}) {
  const key = `${color}|${opts.rough ?? 0.55}|${opts.metal ?? 0}|${opts.emissive ?? 0}|${opts.opacity ?? 1}|${opts.gloss ?? false}`;
  let m = cache.get(key);
  if (!m) {
    const params = { color, roughness: opts.rough ?? 0.55, metalness: opts.metal ?? 0 };
    m = opts.gloss ? new THREE.MeshPhysicalMaterial({ ...params, clearcoat: 1, clearcoatRoughness: 0.1 }) : new THREE.MeshStandardMaterial(params);
    if (opts.emissive) m.emissive = new THREE.Color(opts.emissive);
    if (opts.opacity !== undefined && opts.opacity < 1) {
      m.transparent = true;
      m.opacity = opts.opacity;
      m.depthWrite = false;
    }
    cache.set(key, m);
  }
  return m;
}

const geoCache = new Map<string, THREE.BufferGeometry>();
function cached<T extends THREE.BufferGeometry>(key: string, make: () => T): T {
  let g = geoCache.get(key);
  if (!g) {
    g = make();
    geoCache.set(key, g);
  }
  return g as T;
}

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Smooth, high-segment primitives (cached by size). */
export const geo = {
  /** rounded box with real dimensions (corner radius defaults to 22% of the smallest side) */
  rbox: (w: number, h: number, d: number, r = Math.min(w, h, d) * 0.22, seg = 2) =>
    cached(`rb${r3(w)},${r3(h)},${r3(d)},${r3(r)},${seg}`, () => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, Math.min(w, h, d) / 2 - 0.001))),
  sphere: (r = 0.5, w = 24, h = 16) => cached(`sp${r3(r)},${w},${h}`, () => new THREE.SphereGeometry(r, w, h)),
  /** capsule along y, total height h */
  capsule: (r: number, h: number, seg = 16) => cached(`cap${r3(r)},${r3(h)},${seg}`, () => new THREE.CapsuleGeometry(r, Math.max(0.001, h - 2 * r), 6, seg)),
  cyl: (rt: number, rb: number, h: number, seg = 32) => cached(`cy${r3(rt)},${r3(rb)},${r3(h)},${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg)),
  torus: (R: number, r: number, arc = Math.PI * 2, seg = 32) =>
    cached(`to${r3(R)},${r3(r)},${r3(arc)},${seg}`, () => new THREE.TorusGeometry(R, r, 12, seg, arc)),
  cone: (r: number, h: number, seg = 24) => cached(`co${r3(r)},${r3(h)},${seg}`, () => new THREE.ConeGeometry(r, h, seg)),
  /** unit box (for instanced / scaled use) */
  box: () => cached('box', () => new THREE.BoxGeometry(1, 1, 1)),
};

/** Lathe from a 2D profile [radius, y][] with smooth normals. */
export function lathe(profile: [number, number][], seg = 40): THREE.BufferGeometry {
  return new THREE.LatheGeometry(
    profile.map(([x, y]) => new THREE.Vector2(x, y)),
    seg,
  );
}

type V3 = [number, number, number];
export interface KitOpts {
  p?: V3;
  /** Euler rotation, order YXZ (yaw, then local pitch, then roll) */
  r?: V3;
  s?: number | V3;
  finish?: Finish;
  /** cast shadows (default true) */
  cast?: boolean;
}

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler(0, 0, 0, 'YXZ'); // yaw first, then local pitch/roll
const tmpP = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const tmpC = new THREE.Color();

/** Collects primitives (geometry + color + transform + finish) and merges them into one mesh per finish. */
export class Kit {
  private buckets = new Map<string, THREE.BufferGeometry[]>();
  /** darken vertices near the ground (fake ambient occlusion) */
  groundAO = 0;

  add(g: THREE.BufferGeometry, color: number, o: KitOpts = {}): this {
    const s = o.s ?? 1;
    tmpE.set(...(o.r ?? [0, 0, 0]));
    tmpQ.setFromEuler(tmpE);
    tmpM.compose(tmpP.set(...(o.p ?? [0, 0, 0])), tmpQ, typeof s === 'number' ? tmpS.set(s, s, s) : tmpS.set(...s));
    return this.addMatrix(g, color, tmpM, o.finish ?? 'soft', o.cast ?? true);
  }

  addMatrix(g: THREE.BufferGeometry, color: number, m: THREE.Matrix4, finish: Finish = 'soft', cast = true): this {
    const c = g.index ? g.clone() : withIndex(g.clone());
    for (const name of Object.keys(c.attributes)) if (name !== 'position' && name !== 'normal') c.deleteAttribute(name);
    c.applyMatrix4(m);
    tmpC.set(color);
    const n = c.attributes.position.count;
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      col[i * 3] = tmpC.r;
      col[i * 3 + 1] = tmpC.g;
      col[i * 3 + 2] = tmpC.b;
    }
    c.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const key = `${finish}|${cast ? 1 : 0}`;
    let list = this.buckets.get(key);
    if (!list) this.buckets.set(key, (list = []));
    list.push(c);
    return this;
  }

  /** Merge into a group (one mesh per finish/shadow bucket). Optionally offsets AO by `aoBase` world height. */
  build(receive = true, aoBase = 0): THREE.Group {
    const root = new THREE.Group();
    for (const [key, list] of this.buckets) {
      const [finish, cast] = key.split('|');
      const merged = mergeGeometries(list, false);
      for (const g of list) g.dispose();
      if (!merged) continue;
      if (this.groundAO > 0) applyGroundAO(merged, this.groundAO, aoBase);
      merged.computeBoundingSphere();
      const mesh = new THREE.Mesh(merged, finishMat(finish as Finish));
      mesh.castShadow = cast === '1' && finish !== 'glow';
      mesh.receiveShadow = receive && finish !== 'glow';
      mesh.name = finish;
      root.add(mesh);
    }
    this.buckets.clear();
    return root;
  }
}

function withIndex(g: THREE.BufferGeometry): THREE.BufferGeometry {
  const n = g.attributes.position.count;
  const idx = new (n > 65535 ? Uint32Array : Uint16Array)(n);
  for (let i = 0; i < n; i++) idx[i] = i;
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  return g;
}

function applyGroundAO(g: THREE.BufferGeometry, strength: number, base: number) {
  const pos = g.attributes.position;
  const col = g.attributes.color;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) + base;
    const t = Math.min(1, Math.max(0, y / 1.4));
    const k = 1 - strength * (1 - t * t * (3 - 2 * t));
    col.setXYZ(i, col.getX(i) * k, col.getY(i) * k, col.getZ(i) * k);
  }
}

let blobTex: THREE.Texture | null = null;
/** Soft radial "contact shadow" texture. */
export function blobTexture(): THREE.Texture {
  if (blobTex) return blobTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  // Gaussian-like falloff: a firm core under the contact point that fades without a visible ring.
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    grd.addColorStop(t, `rgba(0,0,0,${(0.6 * Math.exp(-4.2 * t * t) * (1 - t * t)).toFixed(3)})`);
  }
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 128, 128);
  blobTex = new THREE.CanvasTexture(c);
  blobTex.colorSpace = THREE.NoColorSpace;
  return blobTex;
}

/** Material for contact shadow blobs (multiplies the ground darker). */
export function blobMaterial(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    map: blobTexture(),
    color: 0x22305a,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

let glowTex: THREE.Texture | null = null;
/** Soft white radial falloff for additive light glows (tint with the material color). */
export function glowTexture(): THREE.Texture {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    grd.addColorStop(t, `rgba(255,255,255,${(Math.exp(-3.5 * t * t) * (1 - t)).toFixed(3)})`);
  }
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}

/** Shared clock for animated materials (seconds); the view advances it. */
export const shaderTime = { value: 0 };

/**
 * Sea / pool water: standard PBR (keeps fog, shadows and env reflections) with procedural wave normals
 * in world space, a fresnel tint toward pale aqua at grazing angles and small sun sparkles. No textures.
 */
export function waterMaterial(color = 0x1fa8c4, opts: { scale?: number; sparkle?: number } = {}): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.12, metalness: 0.05, envMapIntensity: 1.2 });
  const scale = (opts.scale ?? 1).toFixed(3), sparkle = (opts.sparkle ?? 1).toFixed(3);
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = shaderTime;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWaterPos;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvWaterPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform float uTime;
varying vec3 vWaterPos;
vec2 waveGrad(vec2 p, float t) {
  vec2 g = vec2(0.0);
  g += vec2(0.9, 0.4) * cos(dot(p, vec2(0.9, 0.4)) * 0.55 + t * 1.3) * 0.5;
  g += vec2(-0.5, 0.85) * cos(dot(p, vec2(-0.5, 0.85)) * 0.9 + t * 1.7) * 0.3;
  g += vec2(0.2, -1.0) * cos(dot(p, vec2(0.2, -1.0)) * 1.7 + t * 2.3) * 0.16;
  g += vec2(-0.8, -0.6) * cos(dot(p, vec2(-0.8, -0.6)) * 3.1 + t * 3.1) * 0.08;
  return g;
}`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
vec2 wp = vWaterPos.xz * ${scale};
vec2 wg = waveGrad(wp, uTime) * 0.32;
vec3 wn = normalize(vec3(-wg.x, 1.0, -wg.y));
normal = normalize((viewMatrix * vec4(wn, 0.0)).xyz);
float fres = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.62, 0.9, 0.95), clamp(fres * 0.6 + wg.x * 0.25, 0.0, 0.55));
// lighter crests
diffuseColor.rgb += vec3(0.035, 0.06, 0.06) * smoothstep(0.15, 0.55, wg.x + wg.y) * smoothstep(80.0, 20.0, length(vViewPosition));`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
float glint = waveGrad(wp * 3.7 + 11.0, uTime * 1.6).x * waveGrad(wp * 2.3 - 7.0, uTime * 1.3).y;
// fade glints with distance so far water doesn't alias into white noise
float near = smoothstep(55.0, 12.0, length(vViewPosition));
totalEmissiveRadiance += vec3(1.0, 0.97, 0.88) * smoothstep(0.09, 0.13, glint) * 0.8 * near * ${sparkle};`);
  };
  m.customProgramCacheKey = () => `water${scale}${sparkle}`;
  return m;
}
