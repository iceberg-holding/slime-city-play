import { buildSkyscraper } from './art/studio';
import { buildRooftop } from './rooftop';
import { TOWER } from '../sim/tower';
import * as THREE from 'three';
import { Collider, blockSolid } from '../sim/physics';
import { computePlacement, makeCollider } from '../sim/step';
import type { GameEvent, GameState } from '../sim/types';
import { VEHICLES } from '../sim/vehicles';
import { playEvent } from './audio';
import { animateCharacter, buildCharacter, type CharacterRig } from './character';
import { buildCity, wedge } from './city';
import { buildCreature, type CreatureView } from './creature';
import { SKY_HORIZON, addLights, buildSky, environment } from './env';
import { Kit, blobMaterial, geo } from './materials';
import { buildPart, buildVehicle, type VehicleModel } from './vehicleModels';

/** Instanced pool for dynamic, short-lived things. */
class Pool {
  mesh: THREE.InstancedMesh;
  private i = 0;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private e = new THREE.Euler();
  private v = new THREE.Vector3();
  private s = new THREE.Vector3();
  private c = new THREE.Color();
  constructor(g: THREE.BufferGeometry, material: THREE.Material, cap: number, shadow = false) {
    this.mesh = new THREE.InstancedMesh(g, material, cap);
    this.mesh.count = 0;
    this.mesh.castShadow = shadow;
    this.mesh.receiveShadow = shadow;
    this.mesh.frustumCulled = false;
    this.mesh.setColorAt(0, new THREE.Color(0xffffff));
  }
  begin() {
    this.i = 0;
  }
  push(x: number, y: number, z: number, sx: number, sy: number, sz: number, color: number, ry = 0, rx = 0) {
    if (this.i >= this.mesh.instanceMatrix.count) return;
    this.e.set(rx, ry, 0);
    this.q.setFromEuler(this.e);
    this.m.compose(this.v.set(x, y, z), this.q, this.s.set(sx, sy, sz));
    this.mesh.setMatrixAt(this.i, this.m);
    this.mesh.setColorAt(this.i, this.c.set(color));
    this.i++;
  }
  end() {
    this.mesh.count = this.i;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  max: number;
  color: number;
  size: number;
}

const BLOCK_COLORS = [0xff5d73, 0xffc93c, 0x5ee06a, 0x4d96ff, 0x9b5de5, 0xff9f1c];

const glossy = (opts: THREE.MeshPhysicalMaterialParameters = {}) =>
  new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08, ...opts });

export class GameView {
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  private sun: THREE.DirectionalLight;
  private sky: THREE.Group;
  private spray: THREE.Object3D | undefined;
  private players = new Map<number, CharacterRig>();
  private creatures = new Map<number, CreatureView>();
  private pickups = new Map<number, THREE.Group>();
  private vehicles = new Map<number, VehicleModel>();
  private garages = new Map<number, { model: VehicleModel; beam: THREE.Mesh }>();
  private lastYaw = new Map<number, number>();
  private projectiles: Pool;
  private pads: Pool;
  private cubes: Pool;
  private ramps: Pool;
  private splats: Pool;
  private parts: Pool;
  private shadows: Pool;
  private ghost: THREE.Mesh;
  private particles: Particle[] = [];
  private col: Collider;
  private camDist = 7;
  private time = 0;
  private lift = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.2, 24), new THREE.MeshStandardMaterial({ color: 0xffcf4a }));

  constructor(state: GameState, aspect: number, renderer: THREE.WebGLRenderer) {
    this.camera = new THREE.PerspectiveCamera(62, aspect, 0.1, 400);
    this.scene.background = new THREE.Color(SKY_HORIZON);
    this.scene.fog = new THREE.Fog(SKY_HORIZON, 55, 150);
    this.scene.environment = environment(renderer);
    this.scene.environmentIntensity = 0.55;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    this.sun = addLights(this.scene, coarse ? 1024 : 2048).sun;
    this.sky = buildSky();
    this.scene.add(this.sky);

    const city = buildCity(state.world);
    this.scene.add(city.root);
    this.scene.add(this.lift, buildRooftop());
    const tower = buildSkyscraper();
    tower.scale.setScalar(0.65);
    tower.position.set(26, 0, -26);
    this.scene.add(tower);
    // Remove the showcase-only elevator cabin: the sim owns the real platform.
    const cabin = tower.getObjectByName('showcase-cabin'); if (cabin) cabin.visible = false;
    this.scene.userData.studioTower = tower;
    this.spray = city.root.getObjectByName('spray');
    this.col = new Collider([...state.world.solids, ...city.cameraBlockers]);

    this.projectiles = new Pool(geo.sphere(0.5, 24, 16), glossy(), 32, true);
    const padGeo = new THREE.SphereGeometry(0.5, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    this.pads = new Pool(padGeo, glossy({ roughness: 0.18 }), 8, true);
    this.cubes = new Pool(geo.rbox(0.98, 0.98, 0.98, 0.14), glossy({ roughness: 0.35 }), 16, true);
    const rampGeo = wedge(0.98, 0.98, 0.98, 0.07);
    this.ramps = new Pool(rampGeo, glossy({ roughness: 0.35 }), 16, true);
    this.splats = new Pool(geo.sphere(0.5, 20, 10), glossy({ transparent: true, opacity: 0.85 }), 40);
    this.parts = new Pool(geo.sphere(0.5, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }), 160);
    const blobGeo = new THREE.PlaneGeometry(1, 1);
    blobGeo.rotateX(-Math.PI / 2);
    this.shadows = new Pool(blobGeo, blobMaterial(), 48);
    this.shadows.mesh.renderOrder = 2;
    for (const p of [this.projectiles, this.pads, this.cubes, this.ramps, this.splats, this.parts, this.shadows]) this.scene.add(p.mesh);

    this.ghost = new THREE.Mesh(
      geo.rbox(1, 1, 1, 0.14),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false }),
    );
    this.ghost.visible = false;
    this.scene.add(this.ghost);

    for (const pk of state.pickups) {
      const holder = new THREE.Group();
      const model = buildPart(pk.vehicle, pk.part);
      const spinner = new THREE.Group();
      model.position.y = -0.5;
      spinner.add(model);
      spinner.scale.setScalar(1.3);
      // glowing ring so parts read as collectibles
      const halo = new THREE.Mesh(geo.torus(0.75, 0.05, Math.PI * 2, 48), new THREE.MeshBasicMaterial({ color: 0xffe066 }));
      halo.rotation.x = Math.PI / 2;
      halo.position.y = -0.55;
      const beam = makeBeam(0xffe066);
      beam.position.y = -0.6;
      holder.add(spinner, halo, beam);
      noShadows(holder);
      this.scene.add(holder);
      this.pickups.set(pk.id, holder);
    }
    for (const g of state.garages) {
      this.scene.add(buildGarageProps(g.x, g.z, g.radius));
      const model = buildVehicle(
        g.vehicle,
        VEHICLES[g.vehicle].parts.map((p) => p.id),
      );
      model.root.position.set(g.x, 0.12, g.z);
      model.root.rotation.y = 0.6;
      this.scene.add(model.root);
      const beam = makeBeam(0x4cc9f0);
      beam.position.set(g.x, 0, g.z);
      this.scene.add(beam);
      this.garages.set(g.id, { model, beam });
    }
    this.sync(state, 0, 0.6, 0);
  }

  private ensureEntities(state: GameState) {
    for (const p of state.players) {
      if (!this.players.has(p.id)) {
        const rig = buildCharacter(p.look);
        this.scene.add(rig.root);
        this.players.set(p.id, rig);
      }
    }
    for (const c of state.creatures) {
      if (!this.creatures.has(c.id)) {
        const v = buildCreature(c.seed);
        this.scene.add(v.root);
        this.creatures.set(c.id, v);
      }
    }
  }

  handleEvents(events: GameEvent[]) {
    for (const e of events) {
      playEvent(e);
      switch (e.type) {
        case 'pickup':
        case 'deliver':
          this.burst(e.x, e.y, e.z, 24, [0xffd60a, 0xff6b00, 0xffffff], 6, 0.18);
          break;
        case 'built':
        case 'trick':
          this.burst(e.x, e.y, e.z, 40, [0xffd60a, 0xff70a6, 0x4cc9f0, 0x7ae582], 8, 0.2);
          break;
        case 'glue':
          this.burst(e.x, e.y, e.z, 16, [0x6dff4a, 0x38b000], 4, 0.15);
          break;
        case 'splat':
          this.burst(e.x, e.y, e.z, 6, e.y > 20 ? [0x50dfff, 0xffffff] : [0x6dff4a], 2.5, 0.1);
          break;
        case 'pad':
        case 'bounce':
          this.burst(e.x, e.y + 0.2, e.z, 12, [0xff70a6, 0xffc2e2], 5, 0.14);
          break;
        case 'bonk':
          this.burst(e.x, e.y, e.z, 10, [0xffffff, 0xfff275], 4, 0.14);
          break;
        case 'block':
          this.burst(e.x, e.y - 0.4, e.z, 8, [0xffffff], 2.5, 0.12);
          break;
        case 'noroom':
          this.burst(e.x, e.y, e.z, 6, [0xff3333], 2, 0.1);
          break;
      }
    }
  }

  private burst(x: number, y: number, z: number, n: number, colors: number[], speed: number, size: number) {
    for (let i = 0; i < n; i++) {
      if (this.particles.length > 150) this.particles.shift();
      const a = Math.random() * Math.PI * 2;
      const u = Math.random() * 0.8 + 0.2;
      this.particles.push({
        x,
        y,
        z,
        vx: Math.cos(a) * speed * u,
        vy: speed * (0.5 + Math.random()),
        vz: Math.sin(a) * speed * u,
        life: 0.7,
        max: 0.7,
        color: colors[i % colors.length],
        size,
      });
    }
  }

  /** Free GPU buffers (shared cached geometries are re-uploaded automatically if reused). */
  dispose() {
    this.scene.traverse((o) => {
      if (o instanceof THREE.InstancedMesh) o.dispose();
      else if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    this.scene.clear();
  }

  /** Screen position (CSS px) of a world point, or null if behind the camera. */
  toScreen(x: number, y: number, z: number, w: number, h: number): { x: number; y: number } | null {
    const v = new THREE.Vector3(x, y, z).project(this.camera);
    if (v.z > 1) return null;
    return { x: ((v.x + 1) / 2) * w, y: ((1 - v.y) / 2) * h };
  }

  /** Render-side sync. `playerId` is the local player the camera follows. */
  sync(state: GameState, camYaw: number, camPitch: number, dt: number, playerId?: number, ghostOn = false) {
    this.lift.position.set(TOWER.liftX, state.elevator.y - 0.1, TOWER.z);
    const tower = this.scene.userData.studioTower as THREE.Group;
    tower?.traverse(o => { if (o.userData.tick && o.visible) o.userData.tick(state.tick / 60); });
    this.time += dt;
    const t = this.time;
    this.ensureEntities(state);
    const ground = new Collider(state.world.solids, state.blocks.map(blockSolid));
    this.shadows.begin();
    const shadow = (x: number, y: number, z: number, size: number) => {
      const g = ground.groundAt(x, z, y + 0.3, 0.05);
      const k = Math.max(0, 1 - (y - g) / 6);
      if (k <= 0) return;
      const s = size * (0.6 + 0.4 * k);
      this.shadows.push(x, g + 0.03, z, s, 1, s, 0xffffff);
    };

    for (const p of state.players) {
      const rig = this.players.get(p.id)!;
      rig.root.position.set(p.pos.x, p.pos.y, p.pos.z);
      rig.root.rotation.y = p.yaw;
      animateCharacter(rig, p.walkPhase, Math.hypot(p.vel.x, p.vel.z), !p.grounded, t);
      rig.inner.rotation.z = p.stun > 0 ? Math.sin(t * 40) * 0.15 : 0;
      if (p.riding === null) shadow(p.pos.x, p.pos.y, p.pos.z, 1.1);
    }

    for (const c of state.creatures) {
      const v = this.creatures.get(c.id)!;
      v.root.position.set(c.pos.x, c.pos.y, c.pos.z);
      v.root.rotation.y = c.yaw;
      const stuck = c.stuck > 0;
      v.goo.visible = stuck;
      v.blob.traverse(o => {
        if (o.name === 'studio-eye') o.scale.y = stuck ? 0.12 : 1;
        if (o.name === 'studio-mouth') o.scale.y = c.talk > 0 && !stuck ? 1.5 : 1;
      });
      v.eyes.visible = !stuck;
      v.happy.visible = stuck;
      const talking = c.talk > 0 && !stuck;
      v.mouth.visible = talking;
      v.smile.visible = !talking;
      if (talking) v.mouth.scale.y = 0.6 + Math.abs(Math.sin(t * 16 + c.id)) * 0.8;
      if (stuck) {
        const w = 1 + Math.sin(t * 6) * 0.04;
        v.goo.scale.set(1.5 * w, 1.3 / w, 1.5 * w);
        const breathe = 1 + Math.sin(t * 2 + c.id) * 0.03;
        v.blob.scale.set(1, breathe, 1);
        v.blob.position.y = 0;
      } else {
        const speed = Math.hypot(c.vel.x, c.vel.z);
        const k = Math.sin(t * (c.mode === 'crowd' ? 12 : 7) + c.id);
        const talkWobble = talking ? Math.sin(t * 9) * 0.04 : 0;
        const sq = 1 + k * 0.09 * Math.min(1, speed / 2 + 0.3) + talkWobble;
        v.blob.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
        v.blob.position.y = c.grounded ? Math.max(0, k) * 0.12 * Math.min(1, speed) : 0;
        v.eyes.scale.y = Math.sin(t * 0.8 + c.id * 3) > 0.985 ? 0.15 : 1; // blink
      }
      shadow(c.pos.x, c.pos.y, c.pos.z, 1.4);
    }

    const me = state.players.find((p) => p.id === playerId) ?? state.players[0];
    const carrying = state.pickups.some((pk) => pk.status === 'carried' && pk.carrier === me?.id);
    for (const pk of state.pickups) {
      const h = this.pickups.get(pk.id)!;
      h.visible = pk.status !== 'delivered';
      h.position.set(pk.pos.x, pk.pos.y, pk.pos.z);
      const spinner = h.children[0];
      spinner.rotation.y = t * 2;
      const carried = pk.status === 'carried';
      spinner.position.y = carried ? 0 : Math.sin(t * 2 + pk.id) * 0.12;
      spinner.scale.setScalar(carried ? 0.6 : 1.3);
      h.children[1].visible = !carried;
      h.children[2].visible = !carried;
      if (pk.status === 'world') shadow(pk.pos.x, pk.pos.y - 0.6, pk.pos.z, 1.3);
    }

    for (const g of state.garages) {
      const gv = this.garages.get(g.id)!;
      gv.model.root.visible = !g.built;
      for (const [id, obj] of gv.model.parts) obj.visible = g.delivered.includes(id);
      gv.model.root.rotation.y = 0.6 + Math.sin(t * 0.7) * 0.25;
      const anyFree = state.vehicles.some((v) => v.rider === null);
      gv.beam.visible = carrying || (g.built && anyFree && me?.riding === null);
    }

    for (const v of state.vehicles) {
      let m = this.vehicles.get(v.id);
      if (!m) {
        m = buildVehicle(
          v.kind,
          VEHICLES[v.kind].parts.map((p) => p.id),
        );
        this.scene.add(m.root);
        this.vehicles.set(v.id, m);
      }
      m.root.position.set(v.pos.x, v.pos.y, v.pos.z);
      const prev = this.lastYaw.get(v.id) ?? v.yaw;
      this.lastYaw.set(v.id, v.yaw);
      const turn = dt > 0 ? (v.yaw - prev) / dt : 0;
      m.root.rotation.y = v.yaw;
      const lean = v.grounded ? Math.max(-0.45, Math.min(0.45, turn * 0.12 * Math.min(1, Math.abs(v.speed) / 5))) : 0;
      m.pivot.rotation.z += (lean - m.pivot.rotation.z) * Math.min(1, dt * 10);
      m.pivot.rotation.x = v.flip;
      for (const w of m.wheels) w.rotation.x -= (v.speed * dt) / 0.4;
      shadow(v.pos.x, v.pos.y, v.pos.z, 2.2);
    }

    for (const p of state.players) {
      const rig = this.players.get(p.id)!;
      const vm = p.riding !== null ? this.vehicles.get(p.riding) : undefined;
      if (vm) {
        if (rig.root.parent !== vm.seat) vm.seat.add(rig.root);
        rig.root.position.set(0, 0, 0);
        rig.root.rotation.set(0, 0, 0);
        rig.legL.rotation.x = rig.legR.rotation.x = 1.1;
        rig.armL.rotation.x = 1.3;
        rig.inner.position.y = 0;
      } else if (rig.root.parent !== this.scene) {
        this.scene.add(rig.root);
      }
    }

    this.projectiles.begin();
    for (const p of state.projectiles) {
      const c = p.kind === 'sticky' ? 0x6dff4a : 0xff70a6;
      const s = 0.36 * p.scale;
      this.projectiles.push(p.pos.x, p.pos.y, p.pos.z, s, s, s, c);
    }
    this.projectiles.end();

    this.pads.begin();
    for (const p of state.pads) {
      const sq = p.squish;
      const fade = Math.min(1, p.life / 2);
      const r = 2.4 * p.scale * (1 + sq * 0.2) * (0.6 + 0.4 * fade);
      this.pads.push(p.pos.x, p.pos.y, p.pos.z, r, 0.5 * (1 - sq * 0.5) + 0.06 * Math.sin(t * 5 + p.id), r, 0xff5fa2);
    }
    this.pads.end();

    this.splats.begin();
    for (const s of state.splats) this.splats.push(s.pos.x, s.pos.y, s.pos.z, 0.7, 0.12, 0.7, 0x6dff4a);
    this.splats.end();

    this.cubes.begin();
    this.ramps.begin();
    for (const b of state.blocks) {
      const color = BLOCK_COLORS[b.id % BLOCK_COLORS.length];
      if (b.shape === 'cube') this.cubes.push(b.x + 0.5, b.y + 0.5, b.z + 0.5, 1, 1, 1, color);
      else {
        const ry = b.dir === 0 ? 0 : b.dir === 2 ? Math.PI : b.dir === 1 ? -Math.PI / 2 : Math.PI / 2;
        this.ramps.push(b.x + 0.5, b.y + 0.01, b.z + 0.5, 1, 1, 1, 0xffc93c, ry);
      }
    }
    this.cubes.end();
    this.ramps.end();

    this.parts.begin();
    const keep: Particle[] = [];
    for (const p of this.particles) {
      p.life -= dt;
      if (p.life <= 0) continue;
      p.vy -= 15 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      const s = p.size * (p.life / p.max);
      this.parts.push(p.x, p.y, p.z, s, s, s, p.color, p.life * 8);
      keep.push(p);
    }
    this.particles = keep;
    this.parts.end();
    this.shadows.end();

    if (this.spray) {
      const k = 1 + Math.sin(t * 3) * 0.06;
      this.spray.scale.set(k, 0.5 / k, k);
    }

    // Camera follow
    if (me) {
      const tx = me.pos.x;
      const ty = me.pos.y + 1.6;
      const tz = me.pos.z;
      const dx = Math.sin(camYaw) * Math.cos(camPitch);
      const dy = Math.sin(camPitch);
      const dz = Math.cos(camYaw) * Math.cos(camPitch);
      const want = 7.5;
      const hit = this.col.raycast(tx, ty, tz, dx, dy, dz, want);
      const target = Math.max(1.2, Math.min(want, hit - 0.3));
      // pull in instantly, ease out
      this.camDist = target < this.camDist ? target : this.camDist + (target - this.camDist) * Math.min(1, dt * 4);
      this.camera.position.set(tx + dx * this.camDist, Math.max(0.3, ty + dy * this.camDist), tz + dz * this.camDist);
      this.camera.lookAt(tx, ty, tz);
      this.sun.position.set(tx + 14, ty + 30, tz + 10);
      this.sun.target.position.set(tx, ty, tz);
      this.sky.position.copy(this.camera.position);

      this.ghost.visible = ghostOn;
      if (ghostOn) this.updateGhost(state, me.id, camYaw);
    }
  }

  private updateGhost(state: GameState, pid: number, yaw: number) {
    const p = state.players.find((q) => q.id === pid)!;
    const pl = computePlacement(state, p, yaw, makeCollider(state));
    this.ghost.position.set(pl.x + 0.5, pl.y + 0.5, pl.z + 0.5);
    (this.ghost.material as THREE.MeshBasicMaterial).color.set(pl.ok ? 0xffffff : 0xff3333);
  }
}

function makeBeam(color: number): THREE.Mesh {
  const g = new THREE.CylinderGeometry(0.32, 0.45, 40, 24, 1, true);
  g.translate(0, 20, 0);
  // fade out toward the top
  const pos = g.attributes.position;
  const alpha = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const k = 1 - pos.getY(i) / 40;
    alpha.set([k, k, k], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(alpha, 3));
  return new THREE.Mesh(
    g,
    new THREE.MeshBasicMaterial({
      color,
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      fog: false,
    }),
  );
}

function buildGarageProps(x: number, z: number, r: number): THREE.Group {
  const k = new Kit();
  k.add(geo.cyl(r, r, 0.1, 48), 0x4d96ff, { p: [0, 0.05, 0], finish: 'gloss', cast: false });
  k.add(geo.cyl(r - 0.3, r - 0.3, 0.12, 48), 0xffd166, { p: [0, 0.06, 0], finish: 'gloss', cast: false });
  for (const px of [-r + 0.1, r - 0.1]) {
    k.add(geo.capsule(0.1, 3.7), 0xffffff, { p: [px, 1.8, -r + 0.1], finish: 'gloss' });
    k.add(geo.sphere(0.16), 0xff5d73, { p: [px, 3.7, -r + 0.1], finish: 'gloss' });
  }
  // banner over the garage pad
  k.add(geo.rbox(r * 2, 0.62, 0.16, 0.08), 0xff5d73, { p: [0, 3.3, -r + 0.1], finish: 'gloss' });
  // wrench sign
  k.add(geo.rbox(1.2, 0.8, 0.12, 0.2), 0xffffff, { p: [0, 4.1, -r + 0.1], finish: 'gloss' });
  for (const z of [-r + 0.02, -r + 0.18]) {
    k.add(geo.capsule(0.07, 0.6), 0x5a667a, { p: [0.05, 4.05, z], r: [0, 0, 0.7], finish: 'metal' });
    k.add(geo.torus(0.13, 0.05, Math.PI * 1.5, 20), 0x5a667a, { p: [-0.17, 4.25, z], finish: 'metal' });
  }
  const g = k.build();
  g.position.set(x, 0, z);
  return g;
}

function noShadows(o: THREE.Object3D) {
  o.traverse((c) => (c.castShadow = false));
}

