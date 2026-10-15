import type { GameState } from '../sim/types';
import { flightPhrase, t } from './i18n';

type Project = (x: number, y: number, z: number) => { x: number; y: number } | null;

/** Speech bubbles above pyshki (DOM labels, positioned from the 3D view each frame). */
export class Bubbles {
  private root: HTMLDivElement;
  private els = new Map<number, { el: HTMLDivElement; text: string }>();

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'bubbles';
    document.body.appendChild(this.root);
  }

  show(v: boolean) {
    this.root.style.display = v ? '' : 'none';
  }

  clear() {
    this.root.innerHTML = '';
    this.els.clear();
  }

  update(state: GameState, project: Project, camPos: { x: number; y: number; z: number }) {
    const s = t();
    const live = new Set<number>();
    for (const c of state.creatures) {
      const glued = c.stuck > 0;
      if (!glued && c.talk <= 0) continue;
      const dist = Math.hypot(c.pos.x - camPos.x, c.pos.y - camPos.y, c.pos.z - camPos.z);
      if (dist > 22) continue;
      const sp = project(c.pos.x, c.pos.y + 1.2 + (c.id % 3) * 0.32, c.pos.z); // staggered so a crowd's bubbles overlap less
      if (!sp) continue;
      live.add(c.id);
      const text = glued ? 'z z z' : c.phrase >= 100 ? flightPhrase(c.phrase - 100) : s.phrases[c.phrase % s.phrases.length];
      let b = this.els.get(c.id);
      if (!b) {
        const el = document.createElement('div');
        el.className = 'bubble';
        el.appendChild(document.createElement('span')); // inner span pops; the outer div is positioned
        this.root.appendChild(el);
        b = { el, text: '' };
        this.els.set(c.id, b);
      }
      if (b.text !== text) {
        b.text = text;
        const inner = b.el.firstChild as HTMLSpanElement;
        inner.textContent = text;
        b.el.classList.toggle('zzz', glued);
        inner.classList.remove('pop');
        void inner.offsetWidth;
        inner.classList.add('pop');
      }
      const scale = Math.max(0.85, Math.min(1.1, 9 / dist));
      const fade = glued ? 1 : Math.min(1, c.talk / 0.3);
      b.el.style.transform = `translate(${sp.x}px, ${sp.y}px) translate(-50%, -100%) scale(${scale.toFixed(3)})`;
      b.el.style.opacity = fade.toFixed(2);
      b.el.style.zIndex = String(1000 - Math.round(dist * 10));
    }
    for (const [id, b] of this.els) {
      if (live.has(id)) continue;
      b.el.remove();
      this.els.delete(id);
    }
  }
}
