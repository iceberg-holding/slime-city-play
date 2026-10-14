import type { Look } from '../sim/types';
import { getLang, onLangChange, setLang, t } from './i18n';

const N = 6;
const LOOK_KEY = 'slimecity.look';
const mod = (v: number) => ((v % N) + N) % N;

export function loadLook(): Look {
  try {
    const s = localStorage.getItem(LOOK_KEY);
    if (s && /^[0-5]{4}$/.test(s)) return s.split('').map(Number) as Look;
  } catch {
    /* ignore */
  }
  return [0, 0, 0, 0];
}

function saveLook(look: Look) {
  try {
    localStorage.setItem(LOOK_KEY, look.join(''));
  } catch {
    /* ignore */
  }
}

/** Combination-lock character creator. */
export class CreatorScreen {
  el: HTMLDivElement;
  look: Look;
  private wheels: { strip: HTMLDivElement; label: HTMLDivElement; name: HTMLDivElement; offset: number }[] = [];
  private codeEl: HTMLDivElement;
  private texts: { el: HTMLElement; key: 'title' | 'subtitle' | 'random' | 'play' | 'code' | 'desktopHelp' | 'mission' }[] = [];
  private langBtn: HTMLButtonElement;

  constructor(
    private onChange: (look: Look) => void,
    private onPlay: (look: Look) => void,
  ) {
    this.look = loadLook();
    this.el = document.createElement('div');
    this.el.className = 'screen creator';

    const top = div('creator-top');
    const title = div('title');
    const sub = div('subtitle');
    this.langBtn = document.createElement('button');
    this.langBtn.className = 'lang-btn';
    this.langBtn.addEventListener('click', () => setLang(getLang() === 'en' ? 'ru' : 'en'));
    top.append(title, sub, this.langBtn);
    this.texts.push({ el: title, key: 'title' }, { el: sub, key: 'subtitle' });

    const panel = div('lock-panel');
    const codeRow = div('code-row');
    const codeLabel = div('code-label');
    this.codeEl = div('code');
    codeRow.append(codeLabel, this.codeEl);
    this.texts.push({ el: codeLabel, key: 'code' });

    const wheelsEl = div('wheels');
    for (let i = 0; i < 4; i++) wheelsEl.appendChild(this.makeWheel(i));

    const buttons = div('creator-buttons');
    const rnd = document.createElement('button');
    rnd.className = 'btn btn-secondary';
    rnd.addEventListener('click', () => this.randomize());
    const play = document.createElement('button');
    play.className = 'btn btn-play';
    play.id = 'play-btn';
    play.addEventListener('click', () => this.onPlay(this.look));
    buttons.append(rnd, play);
    this.texts.push({ el: rnd, key: 'random' }, { el: play, key: 'play' });

    const mission = div('mission');
    const help = div('help desktop-only');
    this.texts.push({ el: mission, key: 'mission' }, { el: help, key: 'desktopHelp' });

    panel.append(codeRow, wheelsEl, buttons, mission, help);
    this.el.append(top, panel);
    document.body.appendChild(this.el);

    onLangChange(() => this.refreshText());
    this.refreshText();
    this.refreshAll();
  }

  private makeWheel(i: number): HTMLDivElement {
    const col = div('wheel-col');
    const label = div('wheel-label');
    const up = document.createElement('button');
    up.className = 'wheel-arrow';
    up.textContent = '▲';
    up.addEventListener('click', () => this.spin(i, -1));
    const win = div('wheel');
    const strip = div('wheel-strip');
    win.appendChild(strip);
    const down = document.createElement('button');
    down.className = 'wheel-arrow';
    down.textContent = '▼';
    down.addEventListener('click', () => this.spin(i, 1));
    const name = div('wheel-name');
    col.append(label, up, win, down, name);

    // drag to spin
    let startY = 0;
    let dragging = false;
    let applied = 0;
    const STEP = 34;
    win.addEventListener('pointerdown', (e) => {
      dragging = true;
      startY = e.clientY;
      applied = 0;
      win.setPointerCapture(e.pointerId);
      strip.style.transition = 'none';
    });
    win.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dy = e.clientY - startY;
      const steps = Math.trunc(-dy / STEP);
      if (steps !== applied) {
        this.setPart(i, this.look[i] + (steps - applied), false);
        applied = steps;
      }
      this.wheels[i].offset = -dy - applied * STEP;
      this.renderWheel(i);
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      strip.style.transition = '';
      this.wheels[i].offset = 0;
      this.renderWheel(i);
    };
    win.addEventListener('pointerup', end);
    win.addEventListener('pointercancel', end);
    win.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.spin(i, e.deltaY > 0 ? 1 : -1);
      },
      { passive: false },
    );

    this.wheels.push({ strip, label, name, offset: 0 });
    return col;
  }

  private spin(i: number, d: number) {
    this.setPart(i, this.look[i] + d, true);
  }

  private setPart(i: number, v: number, animate: boolean) {
    const nv = mod(v);
    if (nv === this.look[i]) return;
    const next = [...this.look] as Look;
    next[i] = nv;
    this.look = next;
    saveLook(next);
    const w = this.wheels[i];
    if (animate) {
      w.strip.style.transition = 'none';
      w.offset = 0;
    }
    this.renderWheel(i);
    this.codeEl.textContent = this.look.join('');
    this.onChange(this.look);
  }

  randomize() {
    for (let i = 0; i < 4; i++) {
      this.look[i] = Math.floor(Math.random() * N);
    }
    this.look = [...this.look] as Look;
    saveLook(this.look);
    this.refreshAll();
    this.onChange(this.look);
  }

  private renderWheel(i: number) {
    const w = this.wheels[i];
    const v = this.look[i];
    w.strip.innerHTML = '';
    for (let k = -2; k <= 2; k++) {
      const d = div('digit' + (k === 0 ? ' current' : ''));
      d.textContent = String(mod(v + k));
      w.strip.appendChild(d);
    }
    w.strip.style.transform = `translateY(${-w.offset * 0.9}px)`;
    w.name.textContent = t().parts[i][v];
  }

  private refreshAll() {
    for (let i = 0; i < 4; i++) this.renderWheel(i);
    this.codeEl.textContent = this.look.join('');
  }

  private refreshText() {
    const s = t();
    for (const x of this.texts) x.el.textContent = s[x.key];
    this.wheels.forEach((w, i) => {
      w.label.textContent = s.wheels[i];
      w.name.textContent = s.parts[i][this.look[i]];
    });
    this.langBtn.textContent = getLang() === 'en' ? 'EN · ru' : 'en · RU';
  }

  show(v: boolean) {
    this.el.style.display = v ? '' : 'none';
  }
}

function div(cls: string): HTMLDivElement {
  const d = document.createElement('div');
  d.className = cls;
  return d;
}
