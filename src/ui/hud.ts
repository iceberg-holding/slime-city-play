import { TOWER } from '../sim/tower';
import type { InputController, ActionName } from '../input/input';
import { mountable } from '../sim/mission';
import type { GameEvent, GameState } from '../sim/types';
import { VEHICLES } from '../sim/vehicles';
import { levelText, onLangChange, t } from './i18n';
import { levelDef } from '../sim/levels';
import { raceReady } from '../sim/race';
import { isClassic, onClassicChange, type SettingsPanel } from './settings';

export function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export class Hud {
  el: HTMLDivElement;
  private compassEl: HTMLDivElement;
  private compassArrow: HTMLElement;
  private partsEl: HTMLDivElement;
  private carryEl: HTMLDivElement;
  private timeEl: HTMLDivElement;
  private hintEl: HTMLDivElement;
  private blocksEl: HTMLDivElement;
  private shapeBtn: HTMLButtonElement;
  private rideBtn: HTMLButtonElement;
  private toastEl: HTMLDivElement;
  private trickEl: HTMLDivElement;
  private toastTimer = 0;
  private trickTimer = 0;
  private labels: { el: HTMLElement; key: 'sticky' | 'bouncy' | 'jump' | 'block' }[] = [];
  private shape: 'cube' | 'ramp' = 'cube';
  private lastShown = '';

  private tapHintEl: HTMLDivElement;
  private tapHintTimer = 0;

  constructor(input: InputController, settings: SettingsPanel) {
    this.el = document.createElement('div');
    this.el.className = 'screen hud';
    this.el.innerHTML = `
      <div class="hud-top">
        <div class="hud-left">
          <div class="pill parts"><span class="wrench-icon">🔧</span><span class="v"></span><span class="carry"></span></div>
          <div class="hint"></div>
        </div>
        <div class="hud-right"><div class="pill time"></div></div>
      </div>
      <div class="tap-hint"></div><div class="controls-tip"></div>
      <div class="gate-compass" hidden><span>➤</span></div>
      <div class="toast"></div>
      <div class="trick"></div>
      <button class="ride-btn" data-a="interact"></button>
      <div class="buttons">
        <button class="act act-sticky" data-a="sticky"><span class="ic"></span><span class="lb"></span></button>
        <button class="act act-bouncy" data-a="bouncy"><span class="ic"></span><span class="lb"></span></button>
        <button class="act act-jump" data-a="jump"><span class="ic">⤒</span><span class="lb"></span></button>
        <div class="block-group">
          <button class="act act-block" data-a="place"><span class="ic"></span><span class="lb"></span><span class="count"></span></button>
          <button class="shape-btn" data-a="toggleShape"></button>
        </div>
      </div>`;
    document.body.appendChild(this.el);
    const q = <T extends HTMLElement>(s: string) => this.el.querySelector(s) as T;
    this.compassEl = q('.gate-compass');
    this.compassArrow = q('.gate-compass span');
    this.partsEl = q('.parts .v');
    this.carryEl = q('.parts .carry');
    this.timeEl = q('.time');
    this.hintEl = q('.hint');
    this.blocksEl = q('.act-block .count');
    this.shapeBtn = q('.shape-btn');
    this.rideBtn = q('.ride-btn');
    this.toastEl = q('.toast');
    this.trickEl = q('.trick');
    this.tapHintEl = q('.tap-hint');
    q('.hud-right').prepend(settings.gearButton());
    const applyClassic = (v: boolean) => {
      input.classic = v;
      this.el.classList.toggle('classic', v);
      this.el.classList.toggle('modern', !v);
    };
    applyClassic(isClassic());
    onClassicChange(applyClassic);
    this.labels = [
      { el: q('.act-sticky .lb'), key: 'sticky' },
      { el: q('.act-bouncy .lb'), key: 'bouncy' },
      { el: q('.act-jump .lb'), key: 'jump' },
      { el: q('.act-block .lb'), key: 'block' },
    ];
    this.el.querySelectorAll<HTMLButtonElement>('button[data-a]').forEach((b) => {
      const a = b.dataset.a as ActionName;
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        b.classList.add('down');
        input.press(a);
      });
      const up = () => {
        b.classList.remove('down');
        input.release(a);
      };
      b.addEventListener('pointerup', up);
      b.addEventListener('pointerleave', up);
      b.addEventListener('pointercancel', up);
      b.addEventListener('contextmenu', (e) => e.preventDefault());
    });
    onLangChange(() => {
      this.lastShown = '';
      this.refreshText();
    });
    this.refreshText();
  }

  private refreshText() {
    const s = t();
    for (const l of this.labels) l.el.textContent = s[l.key];
    this.shapeBtn.textContent = this.shape === 'cube' ? `■ ${s.cube}` : `◢ ${s.ramp}`;
    this.tapHintEl.textContent = s.tapHint;
    this.el.querySelector('.controls-tip')!.textContent = window.matchMedia('(pointer: coarse)').matches ? 'Left thumb: move · Drag: look · Sticky / Bouncy: shoot' : s.desktopHelp;
  }

  /** Remind touch players how the right half works (modern layout only). */
  showTapHint() {
    this.tapHintTimer = 4;
    this.tapHintEl.classList.add('on');
  }

  show(v: boolean) {
    this.el.style.display = v ? '' : 'none';
    if (v) this.lastShown = '';
  }

  /** Drop popups left over from a previous game. */
  clearPopups() {
    this.toastTimer = this.trickTimer = 0;
    this.toastEl.classList.remove('on');
    this.trickEl.classList.remove('on');
  }

  update(state: GameState, playerId: number, dt: number, camYaw: number) {
    const p = state.players.find((x) => x.id === playerId);
    if (!p) return;
    const s = t();
    const garage = state.garages[0];
    const total = garage ? VEHICLES[garage.vehicle].parts.length : 0;
    const delivered = garage ? garage.delivered.length : 0;
    const carrying = state.pickups.filter((pk) => pk.status === 'carried' && pk.carrier === p.id).length;
    const def = levelDef(state.level), L2 = levelText(), harbor = state.world.theme === 'harbor';
    const nearLift = def.tower && Math.hypot(p.pos.x - TOWER.liftX, p.pos.z - TOWER.z) < 3;
    const canMount = mountable(state, p) !== null;
    const riding = p.riding !== null;
    let hint = s.hintFind;
    const ready = raceReady(state);
    if (carrying > 0) hint = s.hintBring;
    else if (garage?.built && !ready && def.race) hint = s.hintLight;
    else if (garage?.built) hint = riding ? s.hintRide : s.hintMount;
    if (harbor) hint = carrying > 0 ? L2.hintBring : garage?.built ? L2.hintMount : L2.hintFind;
    const gateOpen = !!def.race && state.race.phase === 'open';
    if (gateOpen) hint = s.hintGate;
    this.compassEl.hidden = !gateOpen || !riding;
    if (gateOpen && riding) {
      // Camera looks along (-sin(yaw), -cos(yaw)); CSS rotation is clockwise.
      const g = def.race!.gateAt;
      const angle = Math.atan2(g.x - p.pos.x, p.pos.z - g.z) + camYaw;
      this.compassArrow.style.transform = `rotate(${angle - Math.PI / 2}rad)`;
      this.compassEl.title = s.hintGate;
      this.compassEl.setAttribute('aria-label', s.hintGate);
    }
    if (state.race.phase === 'racing') hint = harbor ? L2.race : 'Race! ↑ Forward · steer around green pyshki';
    if (state.race.phase === 'racing') {
      this.toastTimer = 0; this.toastEl.classList.remove('on');
      this.trickTimer = 0; this.trickEl.classList.remove('on');
      this.tapHintEl.classList.remove('on');
    }
    const clock = state.race.phase === 'racing' ? state.race.remaining : state.time;
    const shown = [delivered, carrying, formatTime(clock), state.blocks.length, p.shape, hint, canMount, riding, nearLift].join('|');
    if (shown !== this.lastShown) {
      this.lastShown = shown;
      this.partsEl.textContent = `${delivered}/${total}`;
      this.carryEl.textContent = carrying ? `+${carrying}` : '';
      this.timeEl.textContent = formatTime(clock);
      this.hintEl.textContent = hint;
      this.blocksEl.textContent = `${p.stats.maxBlocks - state.blocks.length}`;
      this.rideBtn.style.display = canMount || riding || nearLift ? '' : 'none';
      this.rideBtn.textContent = nearLift && !riding ? (document.documentElement.lang === 'ru' ? '↕ Лифт' : '↕ Elevator') : riding ? `${s.exit}` : garage?.vehicle === 'scooter' ? `🛴 ${L2.ride}` : `🏍 ${s.ride}`;
      this.el.classList.toggle('riding', riding);
      if (p.shape !== this.shape) {
        this.shape = p.shape;
        this.refreshText();
      }
    }
    if (this.tapHintTimer > 0) {
      this.tapHintTimer -= dt;
      if (this.tapHintTimer <= 0) this.tapHintEl.classList.remove('on');
    }
    if (this.toastTimer > 0) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) this.toastEl.classList.remove('on');
    }
    if (this.trickTimer > 0) {
      this.trickTimer -= dt;
      if (this.trickTimer <= 0) this.trickEl.classList.remove('on');
    }
  }

  toast(msg: string, time = 1.2) {
    this.toastEl.textContent = msg;
    this.toastEl.classList.remove('on');
    void this.toastEl.offsetWidth;
    this.toastEl.classList.add('on');
    this.toastTimer = time;
  }

  private trick(name: string) {
    const s = t();
    this.trickEl.innerHTML = '';
    const big = document.createElement('div');
    big.textContent = s.trick;
    const small = document.createElement('div');
    small.className = 'trick-name';
    small.textContent = s.tricks[name] ?? name;
    this.trickEl.append(big, small);
    this.trickEl.classList.remove('on');
    void this.trickEl.offsetWidth;
    this.trickEl.classList.add('on');
    this.trickTimer = 1.6;
  }

  onEvents(events: GameEvent[], state: GameState, playerId: number) {
    const s = t();
    if (state.race.phase === 'racing') return;
    for (const e of events) {
      const mine = e.who === playerId;
      const names = state.garages[0]?.vehicle === 'scooter' ? levelText().parts : s.partNames;
      if (e.type === 'pickup' && mine) this.toast(`${s.got} ${names[e.info ?? ''] ?? e.info}`, 1.6);
      else if (e.type === 'deliver' && mine) {
        const g = state.garages[0];
        if (e.info === 'flashlight' && g.built) this.toast(s.headlightOn, 2.2);
        else this.toast(`${s.delivered} ${g.delivered.length}/${VEHICLES[g.vehicle].parts.length}`, 1.4);
      } else if (e.type === 'built') this.toast(e.info === 'scooter' ? levelText().built : s.built, 2.2);
      else if (e.type === 'trick' && mine) this.trick(e.info ?? '');
      else if (e.type === 'glue') this.toast(s.glued, 0.9);
      else if (e.type === 'bonk' && mine) this.toast(s.bonk, 0.7);
      else if (e.type === 'noroom' && mine) this.toast(s.noRoom, 0.9);
    }
  }
}
