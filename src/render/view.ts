import * as THREE from 'three';
import { Collider } from '../sim/physics';
import type { GameEvent, GameState } from '../sim/types';
import { playEvent } from './audio';
import { buildCharacter, animateCharacter, type CharacterRig } from './character';
import { buildCity, wedgeGeometry, wedgeTransform } from './city';
import { buildCreature, type CreatureView } from './creature';
import { geo, mat } from './materials';
import { blockSolid } from '../sim/physics';
import { VEHICLES } from '../sim/vehicles';
import { buildPart, buildVehicle, type VehicleModel } from './vehicleModels';
import { computePlacement, makeCollider } from '../sim/step';

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

const BLOCK_COLORS = [0xff595e, 0xffca3a, 0x8ac926, 0x1982c4, 0x6a4c93, 0xff924c];

export class GameView {
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  private sun: THREE.DirectionalLight;
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
  private ghost: THREE.Mesh;
  private particles: Particle[] = [];
  private col: Collider;
  private camDist = 7;
  private time = 0;

  constructor(state: GameState, aspect: number) {
    this.camera = new THREE.PerspectiveCamera(62, aspect, 0.1, 160);
    this.scene.background = new THREE.Color(0x9fd8ff);
    this.scene.fog = new THREE.Fog(0x9fd8ff, 45, 110);
    this.scene.add(new THREE.HemisphereLight(0xdff3ff, 0x9a8f78, 1.6));
    this.sun = new THREE.DirectionalLight(0xffffff, 1.9);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    const sc = this.sun.shadow.camera;
    sc.left = -22;
    sc.right = 22;
    sc.top = 22;
    sc.bottom = -22;
    sc.near = 1;
    sc.far = 80;
    this.sun.shadow.bias = -0.0015;
    this.sun.shadow.normalBias = 0.03;
    this.scene.add(this.sun, this.sun.target);

    const city = buildCity(state.world);
    this.scene.add(city.root);
    this.col = new Collider([...state.world.solids, ...city.cameraBlockers]);

    const basic = (c: number, o = 1) =>
      new THREE.MeshLambertMaterial({ color: c, transparent: o < 1, opacity: o, depthWrite: o >= 1, flatShading: true });
    this.projectiles = new Pool(geo.sphere(), basic(0xffffff), 32);
    const padGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
    padGeo.translate(0, 0.5, 0);
    this.pads = new Pool(padGeo, basic(0xffffff), 8, true);
    this.cubes = new Pool(geo.box(), basic(0xffffff), 12, true);
    this.ramps = new Pool(wedgeGeometry(), basic(0xffffff), 12, true);
    this.splats = new Pool(geo.sphere(), basic(0xffffff, 0.85), 40);
    this.parts = new Pool(geo.box(), new THREE.MeshBasicMaterial({ color: 0xffffff }), 160);
    for (const p of [this.projectiles, this.pads, this.cubes, this.ramps, this.splats, this.parts]) this.scene.add(p.mesh);

    this.ghost = new THREE.Mesh(
      geo.box(),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, depthWrite: false }),
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
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 6, 24), new THREE.MeshBasicMaterial({ color: 0xffe066 }));
      halo.rotation.x = Math.PI / 2;
      halo.position.y = -0.55;
      const beam = makeBeam(0xffe066);
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
      noShadows(model.root);
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
          this.burst(e.x, e.y, e.z, 6, [0x6dff4a], 2.5, 0.1);
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

  /** Free GPU buffers (shared geometries are re-uploaded automatically if reused). */
  dispose() {
    this.scene.traverse((o) => {
      if (o instanceof THREE.InstancedMesh) o.dispose();
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    this.scene.clear();
  }

  /** Render-side sync. `playerId` is the local player the camera follows. */
  sync(state: GameState, camYaw: number, camPitch: number, dt: number, playerId?: number, ghostOn = false) {
    this.time += dt;
    const t = this.time;
    this.ensureEntities(state);

    for (const p of state.players) {
      const rig = this.players.get(p.id)!;
      rig.root.position.set(p.pos.x, p.pos.y, p.pos.z);
      rig.root.rotation.y = p.yaw;
      animateCharacter(rig, p.walkPhase, Math.hypot(p.vel.x, p.vel.z), !p.grounded, t);
      rig.inner.rotation.z = p.stun > 0 ? Math.sin(t * 40) * 0.15 : 0;
    }

    for (const c of state.creatures) {
      const v = this.creatures.get(c.id)!;
      v.root.position.set(c.pos.x, c.pos.y, c.pos.z);
      v.root.rotation.y = c.yaw;
      const stuck = c.stuck > 0;
      v.goo.visible = stuck;
      if (stuck) {
        const w = 1 + Math.sin(t * 6) * 0.04;
        v.goo.scale.set(1.7 * w, 1.5 / w, 1.7 * w);
        v.blob.scale.set(1, 1, 1);
        v.blob.position.y = 0;
      } else {
        const speed = Math.hypot(c.vel.x, c.vel.z);
        const k = Math.sin(t * (c.mode === 'crowd' ? 14 : 7) + c.id);
        const sq = 1 + k * 0.08 * Math.min(1, speed / 2 + 0.3);
        v.blob.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
        v.blob.position.y = c.grounded ? Math.max(0, k) * 0.12 * Math.min(1, speed) : 0;
      }
      for (const e of v.eyes) e.scale.y = Math.sin(t * 0.8 + c.id * 3) > 0.985 ? 0.15 : 1; // blink
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
      this.projectiles.push(p.pos.x, p.pos.y, p.pos.z, 0.36, 0.36, 0.36, c);
    }
    this.projectiles.end();

    this.pads.begin();
    for (const p of state.pads) {
      const sq = p.squish;
      const fade = Math.min(1, p.life / 2);
      const r = 2.4 * (1 + sq * 0.2) * (0.6 + 0.4 * fade);
      this.pads.push(p.pos.x, p.pos.y, p.pos.z, r, 0.22 * (1 - sq * 0.5) + 0.03 * Math.sin(t * 5 + p.id), r, 0xff5fa2);
    }
    this.pads.end();

    this.splats.begin();
    for (const s of state.splats) this.splats.push(s.pos.x, s.pos.y, s.pos.z, 0.7, 0.12, 0.7, 0x6dff4a);
    this.splats.end();

    this.cubes.begin();
    this.ramps.begin();
    for (const b of state.blocks) {
      const color = BLOCK_COLORS[b.id % BLOCK_COLORS.length];
      if (b.shape === 'cube') this.cubes.push(b.x + 0.5, b.y + 0.5, b.z + 0.5, 0.98, 0.98, 0.98, color);
      else {
        const w = wedgeTransform(blockSolid(b));
        this.ramps.push(w.x, w.y, w.z, w.sx, w.sy, w.sz, 0xffca3a, w.ry);
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
      this.sun.position.set(tx + 12, ty + 28, tz + 8);
      this.sun.target.position.set(tx, ty, tz);

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
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 40, 8, 1, true),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide }),
  );
  beam.geometry.translate(0, 20, 0);
  return beam;
}

function buildGarageProps(x: number, z: number, r: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.1, 6), mat(0x4361ee));
  floor.position.y = 0.05;
  floor.receiveShadow = true;
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.3, r - 0.3, 0.12, 6), mat(0xffd166));
  inner.position.y = 0.06;
  inner.receiveShadow = true;
  g.add(floor, inner);
  for (const x of [-r + 0.1, r - 0.1]) {
    const post = new THREE.Mesh(geo.cyl(6), mat(0xffffff));
    post.scale.set(0.14, 3.6, 0.14);
    post.position.set(x, 1.8, -r + 0.1);
    post.castShadow = true;
    g.add(post);
  }
  // arch with a banner over the garage pad
  const banner = new THREE.Mesh(geo.box(), mat(0xe63946));
  banner.scale.set(r * 2, 0.6, 0.15);
  banner.position.set(0, 3.3, -r + 0.1);
  banner.castShadow = true;
  g.add(banner);
  // wrench sign
  const sign = new THREE.Group();
  sign.position.set(0, 4.1, -r + 0.1);
  sign.add(new THREE.Mesh(geo.box(), mat(0xffffff)));
  sign.children[0].scale.set(1.2, 0.8, 0.1);
  const handle = new THREE.Mesh(geo.box(), mat(0x555566));
  handle.scale.set(0.15, 0.55, 0.12);
  handle.rotation.z = 0.7;
  const head = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.06, 4, 8, Math.PI * 1.5), mat(0x555566));
  head.position.set(-0.2, 0.2, 0);
  sign.add(handle, head);
  g.add(sign);
  return g;
}

function noShadows(o: THREE.Object3D) {
  o.traverse((c) => (c.castShadow = false));
}
