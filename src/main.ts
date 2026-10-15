import * as THREE from 'three';
import './style.css';
import { InputController } from './input/input';
import { unlockAudio } from './render/audio';
import { buildCharacter, buildHeroPart, type CharacterRig } from './render/character';
import { AdaptiveResolution, SKY_HORIZON, addLights, buildSky, createRenderer, environment } from './render/env';
import { Kit, blobMaterial, geo, lathe } from './render/materials';
import { GameView } from './render/view';
import { DT } from './sim/constants';
import { HERO_SLOTS, heroStats, type HeroSlot } from './sim/hero';
import { findWalkPaths } from './sim/reach';
import { createGame, fire, makeCollider, placeBlock, step } from './sim/step';
import { emptyInput, type GameState, type InputCommand, type Look, type ProjectileKind } from './sim/types';
import { MISSION } from './sim/vehicles';
import { PLAYER_SPAWN } from './sim/world';
import { Bubbles } from './ui/bubbles';
import { CreatorScreen } from './ui/creator';
import { Hud } from './ui/hud';
import { getLang, setLang } from './ui/i18n';
import { SettingsPanel, isClassic, setClassic } from './ui/settings';
import { WinScreen } from './ui/win';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const renderer = createRenderer(canvas);
renderer.setSize(window.innerWidth, window.innerHeight, false);
const adaptive = new AdaptiveResolution(renderer);
setLang(getLang());

type Mode = 'creator' | 'play' | 'won';
let mode: Mode = 'creator';
let state: GameState | null = null;
let view: GameView | null = null;
let playerId = 0;
let acc = 0;
let ghostTimer = 0;
let paused = false;
let settingsOpen = false;
let winDelay = 0;

const input = new InputController(canvas);
const settings = new SettingsPanel((open) => {
  settingsOpen = open;
  input.reset();
});
const hud = new Hud(input, settings);
hud.show(false);
const bubbles = new Bubbles();
bubbles.show(false);

// --- Hero preview stage for the builder ---
const preview = new THREE.Scene();
preview.background = new THREE.Color(SKY_HORIZON);
preview.environment = environment(renderer);
preview.environmentIntensity = 0.6;
const previewCam = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
const previewSky = buildSky();
preview.add(previewSky);
const { sun: pSun } = addLights(preview, 1024);
pSun.position.set(3, 8, 5);
const stage = new Kit();
stage.add(
  lathe([
    [0.001, -0.32],
    [1.3, -0.32],
    [1.38, -0.26],
    [1.4, -0.12],
    [1.34, -0.03],
    [1.24, 0],
    [0.001, 0],
  ]),
  0xff7aa2,
  { finish: 'gloss' },
);
stage.add(geo.torus(1.3, 0.05, Math.PI * 2, 64), 0xffffff, { p: [0, -0.05, 0], r: [Math.PI / 2, 0, 0], finish: 'gloss' });
const stageMesh = stage.build(true);
preview.add(stageMesh);
const stageBlob = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6).rotateX(-Math.PI / 2), blobMaterial());
stageBlob.position.y = 0.01;
preview.add(stageBlob);
const turntable = new THREE.Group();
preview.add(turntable);
let previewRig: CharacterRig | null = null;
let pop = 0;
function setPreview(look: Look) {
  if (previewRig) {
    turntable.remove(previewRig.root);
    previewRig.root.traverse((o) => o instanceof THREE.Mesh && o.geometry.dispose());
  }
  previewRig = buildCharacter(look);
  previewRig.root.rotation.y = Math.PI; // face the camera
  turntable.add(previewRig.root);
  pop = 1;
}

// --- Builder card thumbnails: render each part once into a small image ---
const thumbScene = new THREE.Scene();
thumbScene.background = new THREE.Color(0xeef4ff);
thumbScene.environment = environment(renderer);
thumbScene.environmentIntensity = 0.7;
thumbScene.add(new THREE.HemisphereLight(0xffffff, 0xd8c8b0, 1.2));
const thumbSun = new THREE.DirectionalLight(0xffffff, 2.2);
thumbSun.position.set(2, 4, -5);
thumbScene.add(thumbSun);
const thumbCam = new THREE.PerspectiveCamera(30, 1, 0.01, 50);
const thumbs = new Map<string, string>();
const thumbCanvas = document.createElement('canvas');
thumbCanvas.width = thumbCanvas.height = 128;
function thumb(slot: HeroSlot, i: number): string {
  const key = `${slot}${i}`;
  const hit = thumbs.get(key);
  if (hit) return hit;
  const part = buildHeroPart(slot, i);
  thumbScene.add(part);
  const box = new THREE.Box3().setFromObject(part);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const dir = new THREE.Vector3(0.55, 0.3, -1).normalize();
  thumbCam.position.copy(center).addScaledVector(dir, (size / 2 / Math.tan((15 * Math.PI) / 180)) * 1.05);
  thumbCam.lookAt(center);
  const px = 128 / renderer.getPixelRatio();
  renderer.setScissorTest(true);
  renderer.setScissor(0, 0, px, px);
  renderer.setViewport(0, 0, px, px);
  renderer.render(thumbScene, thumbCam);
  const ctx = thumbCanvas.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.drawImage(canvas, 0, canvas.height - 128, 128, 128, 0, 0, 128, 128);
  const url = thumbCanvas.toDataURL('image/png');
  renderer.setScissorTest(false);
  const sz = renderer.getSize(new THREE.Vector2());
  renderer.setViewport(0, 0, sz.x, sz.y);
  thumbScene.remove(part);
  part.traverse((o) => o instanceof THREE.Mesh && o.geometry.dispose());
  thumbs.set(key, url);
  return url;
}

const creator = new CreatorScreen(setPreview, (look) => startGame(look), thumb);
creator.el.querySelector('.creator-top')?.prepend(settings.gearButton());
setPreview(creator.look);

const win = new WinScreen(
  () => startGame(creator.look),
  () => showCreator(),
);

function showCreator() {
  mode = 'creator';
  input.enabled = false;
  input.reset();
  win.show(false);
  hud.show(false);
  bubbles.show(false);
  bubbles.clear();
  creator.show(true);
  document.body.classList.remove('playing');
  resize();
}

function startGame(look: Look) {
  unlockAudio();
  state = createGame((Date.now() & 0xffff) ^ 0x5eed, look);
  playerId = state.players[0].id;
  view?.dispose();
  view = new GameView(state, window.innerWidth / window.innerHeight, renderer);
  input.camYaw = 0;
  input.camPitch = 0.4;
  input.reset();
  input.enabled = true;
  acc = 0;
  mode = 'play';
  winDelay = 0;
  creator.show(false);
  win.show(false);
  hud.show(true);
  bubbles.clear();
  bubbles.show(true);
  document.body.classList.add('playing');
  if (window.matchMedia?.('(pointer: coarse)').matches && !isClassic()) hud.showTapHint();
  adaptive.reset();
  resize();
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  previewCam.aspect = w / h;
  // keep the hero clear of the builder panel: above it in portrait, left of it in landscape
  const portrait = h > w * 1.05;
  if (portrait) {
    previewCam.position.set(0, 1.6, 9);
    previewCam.lookAt(0, 0.95, 0);
    previewCam.setViewOffset(w, h, 0, h * 0.3, w, h);
  } else {
    previewCam.position.set(0, 1.5, 5.6);
    previewCam.lookAt(0, 0.95, 0);
    previewCam.setViewOffset(w, h, w * 0.23, 0, w, h);
  }
  previewCam.updateProjectionMatrix();
  previewSky.position.copy(previewCam.position);
  if (view) {
    view.camera.aspect = w / h;
    view.camera.fov = h > w ? 72 : 62;
    view.camera.updateProjectionMatrix();
  }
}
window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => adaptive.reset());
resize();

function simStep(cmd: InputCommand) {
  if (!state || !view) return;
  if (cmd.place || cmd.toggleShape) ghostTimer = 2.5;
  step(state, { [playerId]: cmd }, DT);
  view.handleEvents(state.events);
  hud.onEvents(state.events, state, playerId);
  if (state.status === 'won' && mode === 'play') {
    mode = 'won';
    winDelay = 2.2; // let the trick popup play first
  }
}

/** While riding, swing the camera behind the vehicle unless the player is steering the camera. */
function followVehicle(dt: number) {
  const p = state?.players.find((x) => x.id === playerId);
  if (!state || !p || p.riding === null) return;
  const v = state.vehicles.find((x) => x.id === p.riding);
  if (!v || !v.grounded || performance.now() - input.lastLook < 1200) return;
  let d = v.yaw - input.camYaw;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  input.camYaw += d * Math.min(1, dt * 2.5 * Math.min(1, Math.abs(v.speed) / 3));
  input.camPitch += (0.3 - input.camPitch) * Math.min(1, dt * 2);
}

let last = performance.now();
function frame(now: number) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  adaptive.update(dt);
  if (mode === 'creator') {
    turntable.rotation.y += dt * 0.6;
    pop = Math.max(0, pop - dt * 3);
    const s = 1 + Math.sin(pop * Math.PI) * 0.08;
    turntable.scale.set(s, 2 - s, s);
    if (previewRig) previewRig.head.rotation.z = Math.sin(now / 500) * 0.05;
    renderer.render(preview, previewCam);
    return;
  }
  if (!state || !view) return;
  if (!paused && !settingsOpen) {
    acc += dt;
    let n = 0;
    while (acc >= DT && n < 6) {
      simStep(input.consume(DT));
      acc -= DT;
      n++;
    }
    if (n === 6) acc = 0;
  }
  ghostTimer -= dt;
  if (winDelay > 0) {
    winDelay -= dt;
    if (winDelay <= 0 && mode === 'won' && state) {
      input.enabled = false;
      input.reset();
      hud.show(false);
      bubbles.show(false);
      win.open(state.winTime);
    }
  }
  followVehicle(dt);
  view.sync(state, input.camYaw, input.camPitch, dt, playerId, ghostTimer > 0 && mode === 'play');
  hud.update(state, playerId, dt);
  const w = window.innerWidth;
  const h = window.innerHeight;
  const v = view;
  bubbles.update(state, (x, y, z) => v.toScreen(x, y, z, w, h), v.camera.position);
  renderer.render(view.scene, view.camera);
}
requestAnimationFrame(frame);

// --- Test hooks ---
declare global {
  interface Window {
    __game: unknown;
  }
}
const api = {
  get state() {
    return state;
  },
  get mode() {
    return mode;
  },
  get playerId() {
    return playerId;
  },
  get input() {
    return input;
  },
  get look() {
    return creator.look;
  },
  get view() {
    return view;
  },
  start(look: Look = creator.look) {
    startGame(look);
  },
  showCreator,
  /** hero builder: pick part `i` for slot 0..3 (head, body, legs, gun) */
  pickPart(slot: number, i: number) {
    creator.setPart(slot, i);
  },
  heroStats(look: Look = creator.look) {
    return heroStats(look);
  },
  slots: HERO_SLOTS,
  renderInfo() {
    return { ...renderer.info.render, geometries: renderer.info.memory.geometries, pixelRatio: renderer.getPixelRatio(), fps: adaptive.fps };
  },
  setPaused(v: boolean) {
    paused = v;
  },
  setClassic(v: boolean) {
    setClassic(v);
  },
  teleport(x: number, y: number, z: number) {
    const p = state?.players[0];
    if (!p) return;
    p.pos = { x, y, z };
    p.vel = { x: 0, y: 0, z: 0 };
    p.grounded = false;
  },
  setCamera(yaw: number, pitch = input.camPitch) {
    input.camYaw = yaw;
    input.camPitch = pitch;
  },
  fire(kind: ProjectileKind = 'sticky', yaw = input.camYaw) {
    const p = state?.players[0];
    if (state && p) fire(state, p, kind, yaw);
  },
  place(yaw = input.camYaw) {
    const p = state?.players[0];
    return state && p ? placeBlock(state, p, yaw, makeCollider(state)) : false;
  },
  /** run n sim ticks with an optional input */
  tick(n = 1, cmd: Partial<InputCommand> = {}) {
    for (let i = 0; i < n; i++) simStep({ ...emptyInput(input.camYaw), ...cmd });
  },
  /** walk-path check from the spawn to every mission part: true = reachable on foot */
  reach() {
    if (!state) return [];
    return findWalkPaths(makeCollider(state), state.world.half, PLAYER_SPAWN, MISSION.partSpots).map((p) => p !== null);
  },
  /** grab every bike part and bring it to the garage */
  collectAll() {
    if (!state) return;
    for (const pk of state.pickups) {
      if (pk.status !== 'world') continue;
      api.teleport(pk.pos.x, pk.pos.y - 0.9, pk.pos.z);
      api.tick(1);
    }
    const g = state.garages[0];
    api.teleport(g.x, 0, g.z);
    api.tick(2);
  },
  interact() {
    api.tick(1, { interact: true });
  },
};
window.__game = api;
