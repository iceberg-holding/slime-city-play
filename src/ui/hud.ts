import type { InputController, ActionName } from '../input/input';
import { DONUT_COUNT, MAX_BLOCKS } from '../sim/constants';
import type { GameEvent, GameState } from '../sim/types';
import { onLangChange, t } from './i18n';

export function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export class Hud {
  el: HTMLDivElement;
  private donutsEl: HTMLDivElement;
  private timeEl: HTMLDivElement;
  private blocksEl: HTMLDivElement;
  private shapeBtn: HTMLButtonElement;
  private toastEl: HTMLDivElement;
  private toastTimer = 0;
  private labels: { el: HTMLElement; key: 'sticky' | 'bouncy' | 'jump' | 'block' }[] = [];
  private shape: 'cube' | 'ramp' = 'cube';
  private lastShown = '';

  constructor(input: InputController) {
    this.el = document.createElement('div');
    this.el.className = 'screen hud';
    this.el.innerHTML = `
      <div class="hud-top">
        <div class="pill donuts"><span class="donut-icon"></span><span class="v"></span></div>
        <div class="pill time"></div>
      </div>
      <div class="toast"></div>
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
    this.donutsEl = q('.donuts .v');
    this.timeEl = q('.time');
    this.blocksEl = q('.act-block .count');
    this.shapeBtn = q('.shape-btn');
    this.toastEl = q('.toast');
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
    onLangChange(() => this.refreshText());
    this.refreshText();
  }

  private refreshText() {
    const s = t();
    for (const l of this.labels) l.el.textContent = s[l.key];
    this.shapeBtn.textContent = this.shape === 'cube' ? `■ ${s.cube}` : `◢ ${s.ramp}`;
  }

  show(v: boolean) {
    this.el.style.display = v ? '' : 'none';
  }

  update(state: GameState, playerId: number, dt: number) {
    const p = state.players.find((x) => x.id === playerId);
    if (!p) return;
    const shown = `${p.donuts}|${formatTime(state.time)}|${state.blocks.length}|${p.shape}`;
    if (shown !== this.lastShown) {
      this.lastShown = shown;
      this.donutsEl.textContent = `${p.donuts}/${DONUT_COUNT}`;
      this.timeEl.textContent = formatTime(state.time);
      this.blocksEl.textContent = `${MAX_BLOCKS - state.blocks.length}`;
      if (p.shape !== this.shape) {
        this.shape = p.shape;
        this.refreshText();
      }
    }
    if (this.toastTimer > 0) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) this.toastEl.classList.remove('on');
    }
  }

  toast(msg: string, time = 1.2) {
    this.toastEl.textContent = msg;
    this.toastEl.classList.remove('on');
    void this.toastEl.offsetWidth;
    this.toastEl.classList.add('on');
    this.toastTimer = time;
  }

  onEvents(events: GameEvent[], state: GameState, playerId: number) {
    const s = t();
    for (const e of events) {
      if (e.type === 'donut' && e.who === playerId) {
        const p = state.players.find((x) => x.id === playerId)!;
        this.toast(`${s.donut} ${p.donuts}/${DONUT_COUNT}`, 1.6);
      } else if (e.type === 'glue') this.toast(s.glued, 0.9);
      else if (e.type === 'bonk' && e.who === playerId) this.toast(s.bonk, 0.7);
      else if (e.type === 'noroom' && e.who === playerId) this.toast(s.noRoom, 0.9);
    }
  }
}
