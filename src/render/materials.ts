import * as THREE from 'three';

const cache = new Map<string, THREE.MeshLambertMaterial>();

/** Shared flat-shaded toy material per color. */
export function mat(color: number, opts: { emissive?: number; transparent?: number } = {}): THREE.MeshLambertMaterial {
  const key = `${color}|${opts.emissive ?? 0}|${opts.transparent ?? 1}`;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color, flatShading: true });
    if (opts.emissive) m.emissive = new THREE.Color(opts.emissive);
    if (opts.transparent !== undefined && opts.transparent < 1) {
      m.transparent = true;
      m.opacity = opts.transparent;
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

export const geo = {
  box: () => cached('box', () => new THREE.BoxGeometry(1, 1, 1)),
  sphere: () => cached('sphere', () => new THREE.IcosahedronGeometry(0.5, 1)),
  cyl: (n = 8) => cached('cyl' + n, () => new THREE.CylinderGeometry(0.5, 0.5, 1, n)),
  cone: (n = 8) => cached('cone' + n, () => new THREE.ConeGeometry(0.5, 1, n)),
  torus: () => cached('torus', () => new THREE.TorusGeometry(0.35, 0.16, 8, 16)),
};

/** Mesh helper: unit primitive scaled + positioned. */
export function part(g: THREE.BufferGeometry, color: number, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(g, mat(color));
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}
