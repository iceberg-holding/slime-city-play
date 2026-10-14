import * as THREE from 'three';
import './style.css';
import { InputController } from './input/input';
import { unlockAudio } from './render/audio';
import { buildCharacter, type CharacterRig } from './render/character';
import { GameView } from './render/view';
import { DT } from './sim/constants';
import { createGame, fire, makeCollider, placeBlock, step } from './sim/step';
import { emptyInput, type GameState, type InputCommand, type Look, type ProjectileKind } from './sim/types';
import { CreatorScreen } from './ui/creator';
import { Hud } from './ui/hud';
import { getLang, setLang } from './ui/i18n';
import { WinScreen } from './ui/win';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: dpr < 1.5, powerPreference: 'high-performance' });
renderer.setPixelRatio(dpr);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
setLang(getLang());

type Mode = 'creator' | 'play' | 'won';
let mode: Mode = 'creator';
let state: GameState | null = null;
let view: GameView | null = null;
let playerId = 0;
let acc = 0;
let ghostTimer = 0;
let paused = false;

const input = new InputController(canvas);
const hud = new Hud(input);
hud.show(false);

// --- Character preview scene for the creator ---
const preview = new THREE.Scene();
preview.background = new THREE.Color(0x9fd8ff);
const previewCam = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
preview.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.8));
const pSun = new THREE.DirectionalLight(0xffffff, 1.6);
pSun.position.set(3, 6, 4);
preview.add(pSun);
const pedestal = new THREE.Mesh(
  new THREE.CylinderGeometry(1.1, 1.25, 0.3, 24),
  new THREE.MeshLambertMaterial({ color: 0xff70a6 }),
);
pedestal.position.y = -0.15;
preview.add(pedestal);
const turntable = new THREE.Group();
preview.add(turntable);
let previewRig: CharacterRig | null = null;
function setPreview(look: Look) {
  if (previewRig) turntable.remove(previewRig.root);
  previewRig = buildCharacter(look);
  previewRig.root.rotation.y = Math.PI; // face the camera
  turntable.add(previewRig.root);
}

const creator = new CreatorScreen(setPreview, (look) => startGame(look));
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
  creator.show(true);
  document.body.classList.remove('playing');
}

function startGame(look: Look) {
  unlockAudio();
  state = createGame((Date.now() & 0xffff) ^ 0x5eed, look);
  playerId = state.players[0].id;
  view = new GameView(state, window.innerWidth / window.innerHeight);
  input.camYaw = 0;
  input.camPitch = 0.4;
  input.reset();
  input.enabled = true;
  acc = 0;
  mode = 'play';
  creator.show(false);
  win.show(false);
  hud.show(true);
  document.body.classList.add('playing');
  resize();
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  previewCam.aspect = w / h;
  // keep the hero in the upper part of the screen above the lock panel
  const portrait = h > w;
  previewCam.position.set(0, portrait ? 0.2 : 1.1, portrait ? 7.2 : 5.2);
  previewCam.lookAt(0, portrait ? -0.6 : 1.1, 0);
  if (!portrait) previewCam.setViewOffset(w, h, w * 0.18, 0, w, h);
  else previewCam.setViewOffset(w, h, 0, h * 0.2, w, h);
  previewCam.updateProjectionMatrix();
  if (view) {
    view.camera.aspect = w / h;
    view.camera.fov = portrait ? 72 : 62;
    view.camera.updateProjectionMatrix();
  }
}
window.addEventListener('resize', resize);
resize();

function simStep(cmd: InputCommand) {
  if (!state || !view) return;
  if (cmd.place || cmd.toggleShape) ghostTimer = 2.5;
  step(state, { [playerId]: cmd }, DT);
  view.handleEvents(state.events);
  hud.onEvents(state.events, state, playerId);
  if (state.status === 'won' && mode === 'play') {
    mode = 'won';
    input.enabled = false;
    input.reset();
    win.open(state.winTime);
  }
}

let last = performance.now();
function frame(now: number) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (mode === 'creator') {
    turntable.rotation.y += dt * 0.6;
    if (previewRig) previewRig.head.rotation.z = Math.sin(now / 500) * 0.05;
    renderer.render(preview, previewCam);
    return;
  }
  if (!state || !view) return;
  if (!paused) {
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
  view.sync(state, input.camYaw, input.camPitch, dt, playerId, ghostTimer > 0 && mode === 'play');
  hud.update(state, playerId, dt);
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
  start(look: Look = creator.look) {
    startGame(look);
  },
  showCreator,
  setPaused(v: boolean) {
    paused = v;
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
  collectAll() {
    const p = state?.players[0];
    if (!state || !p) return;
    for (const d of state.donuts) {
      if (d.collected) continue;
      api.teleport(d.pos.x, d.pos.y - 0.9, d.pos.z);
      api.tick(1);
    }
  },
};
window.__game = api;
