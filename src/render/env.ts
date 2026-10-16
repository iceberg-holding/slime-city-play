import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Kit, geo } from './materials';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Renderer setup, image-based lighting, sky and adaptive resolution.

export const SKY_TOP = 0x2a7fea;
export const SKY_HORIZON = 0xbfe2f6;

const MAX_DPR = 2;

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const dpr = window.devicePixelRatio || 1;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: dpr < 2, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(dpr, MAX_DPR));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; // soft (vogel-disk PCF) in r18x, radius set per light
  return renderer;
}

let envTex: THREE.Texture | null = null;
/** Soft studio reflections for every PBR material (generated once, no assets). */
export function environment(renderer: THREE.WebGLRenderer): THREE.Texture {
  if (envTex) return envTex;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  envTex = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();
  return envTex;
}

export type SkyTheme = 'city' | 'harbor';

/** Zenith, mid sky, horizon haze (also the fog colour). The harbor sky is a touch more turquoise and sunnier. */
export function skyPalette(theme: SkyTheme = 'city') {
  return theme === 'harbor'
    ? { top: 0x1f7fe6, mid: 0x5cc2f5, horizon: 0xbfe9f2, sun: 0xfff1c4 }
    : { top: 0x2a7fea, mid: 0x6cbdf7, horizon: 0xbfe2f6, sun: 0xfff3d6 };
}

/** Direction the sun light comes from (matches the shadow-casting light offset in the view). */
export const SUN_DIR = new THREE.Vector3(14, 30, 10).normalize();

/** Gradient sky dome with a sun glow and disc, plus puffy clouds lit from above. Follows the camera. */
export function buildSky(theme: SkyTheme = 'city'): THREE.Group {
  const pal = skyPalette(theme);
  const root = new THREE.Group();
  const g = new THREE.SphereGeometry(150, 40, 20);
  const pos = g.attributes.position;
  const top = new THREE.Color(pal.top);
  const mid = new THREE.Color(pal.mid);
  const hor = new THREE.Color(pal.horizon);
  const sun = new THREE.Color(pal.sun);
  const c = new THREE.Color();
  const v = new THREE.Vector3();
  const col = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const t = Math.max(0, v.y);
    // horizon haze → mid blue by ~20° → deep zenith
    if (t < 0.3) c.copy(hor).lerp(mid, Math.pow(t / 0.3, 0.8));
    else c.copy(mid).lerp(top, Math.pow((t - 0.3) / 0.7, 0.9));
    const d = Math.max(0, v.dot(SUN_DIR));
    c.lerp(sun, Math.pow(d, 6) * 0.55 + Math.pow(d, 40) * 0.4);
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dome = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
  dome.renderOrder = -10;
  root.add(dome);

  const kit = new Kit();
  let s = theme === 'harbor' ? 11 : 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2 + rnd();
    const d = 100 + rnd() * 30;
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    const y = 26 + rnd() * 28;
    const n = 4 + Math.floor(rnd() * 4);
    for (let k = 0; k < n; k++) {
      const r = 4 + rnd() * 5 * (1 - Math.abs(k - n / 2) / n);
      const along = (k - n / 2) * 5.5;
      kit.add(geo.sphere(1, 10, 7), 0xffffff, {
        p: [x + along * Math.cos(a + 1.57), y + r * 0.25 + rnd() * 2, z + along * Math.sin(a + 1.57)],
        s: [r * 1.35, r * 0.7, r],
        finish: 'glow',
      });
    }
  }
  const clouds = kit.build(false);
  clouds.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    // light from above: bright tops, soft blue-grey bellies, warm rim toward the sun
    const n = o.geometry.attributes.normal, cc = o.geometry.attributes.color;
    const belly = new THREE.Color(0xc9d8ec), warm = new THREE.Color(0xfff4dc), tmp = new THREE.Color(), nv = new THREE.Vector3();
    for (let i = 0; i < cc.count; i++) {
      nv.fromBufferAttribute(n, i);
      tmp.copy(belly).lerp(new THREE.Color(0xffffff), THREE.MathUtils.smoothstep(nv.y, -0.6, 0.5));
      tmp.lerp(warm, Math.max(0, nv.dot(SUN_DIR)) * 0.35);
      cc.setXYZ(i, tmp.r, tmp.g, tmp.b);
    }
    // sun disc joins the cloud mesh (same unlit material, no extra draw call)
    const sunKit = new Kit();
    const disc = new THREE.CircleGeometry(6, 32);
    disc.lookAt(SUN_DIR.clone().negate());
    sunKit.add(disc, 0xfffbea, { p: SUN_DIR.clone().multiplyScalar(140).toArray() as [number, number, number], finish: 'glow' });
    const discMesh = sunKit.build(false).children[0] as THREE.Mesh;
    const merged = mergeGeometries([o.geometry, discMesh.geometry]);
    if (merged) { o.geometry.dispose(); o.geometry = merged; merged.computeBoundingSphere(); }
    discMesh.geometry.dispose();
    o.material = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, transparent: true, opacity: 0.95, depthWrite: false });
    o.renderOrder = -9;
  });
  root.add(clouds);
  return root;
}

export interface Lights {
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
}

export function addLights(scene: THREE.Scene, shadowSize: number): Lights {
  // cool sky fill against warm bounce from the ground keeps shadows blue and lit sides warm
  const hemi = new THREE.HemisphereLight(0xd2e8ff, 0xf6dcb8, 0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffeed6, 2.7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  const sc = sun.shadow.camera;
  sc.left = -24;
  sc.right = 24;
  sc.top = 24;
  sc.bottom = -24;
  sc.near = 1;
  sc.far = 90;
  sun.shadow.radius = 4;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);
  return { sun, hemi };
}

/** Lowers the pixel ratio when the frame rate drops under ~50 fps, and slowly raises it back when there's headroom. */
export class AdaptiveResolution {
  private frames = 0;
  private elapsed = 0;
  private max: number;
  private ratio: number;
  fps = 60;

  constructor(private renderer: THREE.WebGLRenderer) {
    this.max = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    this.ratio = this.max;
  }

  get pixelRatio() {
    return this.ratio;
  }

  update(dt: number) {
    this.frames++;
    this.elapsed += dt;
    if (this.elapsed < 1.5) return;
    this.fps = this.frames / this.elapsed;
    this.frames = 0;
    this.elapsed = 0;
    let next = this.ratio;
    if (this.fps < 50) {
      next = Math.max(0.75, this.ratio - (this.fps < 35 ? 0.5 : 0.25));
    }
    else if (this.fps > 56 && this.ratio < this.max) next = Math.min(this.max, this.ratio + 0.125);
    if (next !== this.ratio) {
      this.ratio = next;
      this.renderer.setPixelRatio(next);
      const size = this.renderer.getSize(new THREE.Vector2());
      this.renderer.setSize(size.x, size.y, false);
    }
  }

  /** e.g. after a tab switch — don't punish the resolution for a hitch */
  reset() {
    this.frames = 0;
    this.elapsed = 0;
  }
}
