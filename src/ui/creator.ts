import { BASE_STATS, HERO_PARTS, HERO_SLOTS, PARTS_PER_SLOT, type HeroSlot, type HeroStats } from '../sim/hero';
import type { Look } from '../sim/types';
import { getLang, onLangChange, setLang, t } from './i18n';

const LOOK_KEY = 'slimecity.look';

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

/** Thumbnail provider: data URL of a rendered part. */
export type ThumbFn = (slot: HeroSlot, i: number) => string;

interface Chip {
  key: string;
  text: string;
  good: boolean;
}

/** Human-readable stat changes for one part. */
export function statChips(stats: Partial<HeroStats>): Chip[] {
  const out: Chip[] = [];
  const pct = (v: number) => `${v > 0 ? '+' : '−'}${Math.round(Math.abs(v) * 100)}%`;
  for (const [k, v] of Object.entries(stats) as [keyof HeroStats, number][]) {
    const base = BASE_STATS[k];
    switch (k) {
      case 'fireCooldown':
        out.push({ key: 'fireRate', text: pct(base / v - 1), good: v < base });
        break;
      case 'knockback':
      case 'stun':
        out.push({ key: k, text: pct(v - 1), good: v < 1 });
        break;
      case 'aimCone':
        out.push({ key: k, text: '▲', good: true });
        break;
      case 'aimRange':
        out.push({ key: k, text: `+${v - base} m`, good: true });
        break;
      case 'glueTime':
        out.push({ key: k, text: `+${(v - base).toFixed(1)} s`, good: true });
        break;
      case 'maxBlocks':
        out.push({ key: k, text: `+${v - base}`, good: true });
        break;
      case 'multishot':
        out.push({ key: k, text: `×${v}`, good: true });
        break;
      case 'personalSpace':
        out.push({ key: k, text: `+${v} m`, good: true });
        break;
      default:
        out.push({ key: k, text: pct(v - 1), good: v > 1 });
    }
  }
  return out;
}

/** Hero builder: pick head, body, legs and gun from cards. The 4-digit code is the look. */
export class CreatorScreen {
  el: HTMLDivElement;
  look: Look;
  private slot = 0;
  private tabs: HTMLButtonElement[] = [];
  private cardsEl: HTMLDivElement;
  private codeEl: HTMLDivElement;
  private quirkName: HTMLDivElement;
  private quirkText: HTMLDivElement;
  private chipsEl: HTMLDivElement;
  private texts: { el: HTMLElement; key: 'title' | 'subtitle' | 'random' | 'play' | 'code' | 'desktopHelp' | 'mission' }[] = [];
  private langBtn: HTMLButtonElement;

  constructor(
    private onChange: (look: Look) => void,
    private onPlay: (look: Look) => void,
    private thumb: ThumbFn,
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

    const panel = div('builder');
    const codeRow = div('code-row');
    const codeLabel = div('code-label');
    this.codeEl = div('code');
    const rnd = document.createElement('button');
    rnd.className = 'btn-small random-btn';
    rnd.addEventListener('click', () => this.randomize());
    codeRow.append(codeLabel, this.codeEl, rnd);
    this.texts.push({ el: codeLabel, key: 'code' }, { el: rnd, key: 'random' });

    const tabs = div('tabs');
    HERO_SLOTS.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'tab';
      b.addEventListener('click', () => this.selectSlot(i));
      tabs.appendChild(b);
      this.tabs.push(b);
    });
    this.cardsEl = div('cards');

    const quirk = div('quirk');
    this.quirkName = div('quirk-name');
    this.quirkText = div('quirk-text');
    this.chipsEl = div('chips');
    quirk.append(this.quirkName, this.quirkText, this.chipsEl);

    const play = document.createElement('button');
    play.className = 'btn btn-play';
    play.id = 'play-btn';
    play.addEventListener('click', () => this.onPlay(this.look));
    this.texts.push({ el: play, key: 'play' });

    const mission = div('mission');
    const help = div('help desktop-only');
    this.texts.push({ el: mission, key: 'mission' }, { el: help, key: 'desktopHelp' });

    panel.append(codeRow, tabs, this.cardsEl, quirk, play, mission, help);
    this.el.append(top, panel);
    document.body.appendChild(this.el);

    onLangChange(() => this.refresh());
    this.refresh();
  }

  private selectSlot(i: number) {
    this.slot = i;
    this.refresh();
  }

  setPart(slot: number, v: number) {
    const next = [...this.look] as Look;
    next[slot] = ((v % PARTS_PER_SLOT) + PARTS_PER_SLOT) % PARTS_PER_SLOT;
    this.look = next;
    saveLook(next);
    this.refresh();
    this.onChange(this.look);
  }

  randomize() {
    this.look = this.look.map(() => Math.floor(Math.random() * PARTS_PER_SLOT)) as Look;
    saveLook(this.look);
    this.refresh();
    this.onChange(this.look);
  }

  private refresh() {
    const s = t();
    for (const x of this.texts) x.el.textContent = s[x.key];
    this.langBtn.textContent = getLang() === 'en' ? 'EN · ru' : 'en · RU';
    this.codeEl.textContent = this.look.join('');

    HERO_SLOTS.forEach((slot, i) => {
      const b = this.tabs[i];
      b.classList.toggle('on', i === this.slot);
      b.innerHTML = '';
      const img = document.createElement('img');
      img.src = this.thumb(slot, this.look[i]);
      img.alt = '';
      const lb = document.createElement('span');
      lb.textContent = s.wheels[i];
      b.append(img, lb);
    });

    const slot = HERO_SLOTS[this.slot];
    this.cardsEl.innerHTML = '';
    HERO_PARTS[slot].forEach((def, i) => {
      const c = document.createElement('button');
      c.className = 'card' + (this.look[this.slot] === i ? ' on' : '');
      c.dataset.slot = slot;
      c.dataset.part = String(i);
      const img = document.createElement('img');
      img.src = this.thumb(slot, i);
      img.alt = '';
      const name = document.createElement('span');
      name.className = 'card-name';
      name.textContent = s.heroParts[def.id]?.[0] ?? def.id;
      const num = document.createElement('span');
      num.className = 'card-num';
      num.textContent = String(i);
      c.append(num, img, name);
      c.addEventListener('click', () => this.setPart(this.slot, i));
      this.cardsEl.appendChild(c);
    });

    const def = HERO_PARTS[slot][this.look[this.slot]];
    const [name, quirk] = s.heroParts[def.id] ?? [def.id, ''];
    this.quirkName.textContent = name;
    this.quirkText.textContent = quirk;
    this.chipsEl.innerHTML = '';
    const chips = statChips(def.stats);
    if (!chips.length) chips.push({ key: 'balanced', text: '✓', good: true });
    for (const ch of chips) {
      const el = document.createElement('span');
      el.className = 'chip ' + (ch.good ? 'good' : 'bad');
      el.textContent = `${s.stats[ch.key] ?? ch.key} ${ch.text}`;
      this.chipsEl.appendChild(el);
    }
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
