import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Kit, geo } from './materials';

// Renderer setup, image-based lighting, sky and adaptive resolution.

export const SKY_TOP = 0x248eff;
export const SKY_HORIZON = 0x70c8ff;

const MAX_DPR = 2.5;

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

/** Gradient sky dome + a few puffy clouds. Follows the camera. */
export function buildSky(): THREE.Group {
  const root = new THREE.Group();
  const g = new THREE.SphereGeometry(150, 32, 16);
  const pos = g.attributes.position;
  const top = new THREE.Color(SKY_TOP);
  const hor = new THREE.Color(SKY_HORIZON);
  const c = new THREE.Color();
  const col = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = Math.max(0, pos.getY(i) / 150);
    c.copy(hor).lerp(top, Math.pow(t, 0.6));
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dome = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
  dome.renderOrder = -10;
  root.add(dome);

  const kit = new Kit();
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rnd();
    const d = 105 + rnd() * 25;
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    const y = 30 + rnd() * 25;
    const n = 3 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const r = 5 + rnd() * 5;
      kit.add(geo.sphere(1, 14, 10), 0xffffff, { p: [x + (k - n / 2) * 6 * Math.cos(a + 1.57), y + rnd() * 3, z + (k - n / 2) * 6 * Math.sin(a + 1.57)], s: [r * 1.3, r * 0.75, r], finish: 'glow' });
    }
  }
  const clouds = kit.build(false);
  clouds.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.material = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, transparent: true, opacity: 0.92, depthWrite: false });
      o.renderOrder = -9;
    }
  });
  root.add(clouds);
  return root;
}

export interface Lights {
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
}

export function addLights(scene: THREE.Scene, shadowSize: number): Lights {
  const hemi = new THREE.HemisphereLight(0xdcefff, 0xf3dfc0, 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff4e2, 2.6);
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
      this.max = Math.max(next, this.ratio - 0.125); // don't climb back to a ratio that was too slow
    }
    else if (this.fps > 58 && this.ratio < this.max) next = Math.min(this.max, this.ratio + 0.125);
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
