import { nextLang, getLang, onLangChange, t } from './i18n';

const CLASSIC_KEY = 'slimecity.controls.v3.classicButtons';

let classic = (() => {
  try {
    return localStorage.getItem(CLASSIC_KEY) !== '0';
  } catch {
    return true;
  }
})();
const listeners: ((classic: boolean) => void)[] = [];

/** "Classic buttons": separate Sticky / Bouncy buttons instead of tap / double-tap on the right half. */
export function isClassic(): boolean {
  return classic;
}

export function setClassic(v: boolean) {
  classic = v;
  try {
    localStorage.setItem(CLASSIC_KEY, v ? '1' : '0');
  } catch {
    /* private mode */
  }
  listeners.forEach((f) => f(v));
}

export function onClassicChange(f: (classic: boolean) => void) {
  listeners.push(f);
}

/** Small modal with the control layout toggle and the language switch. */
export class SettingsPanel {
  el: HTMLDivElement;
  private title: HTMLDivElement;
  private label: HTMLSpanElement;
  private help: HTMLDivElement;
  private langLabel: HTMLSpanElement;
  private langBtn: HTMLButtonElement;
  private toggle: HTMLInputElement;
  private closeBtn: HTMLButtonElement;
  isOpen = false;

  constructor(private onOpenChange: (open: boolean) => void = () => {}) {
    this.el = document.createElement('div');
    this.el.className = 'screen settings';
    this.el.innerHTML = `
      <div class="settings-card">
        <div class="settings-title"></div>
        <label class="settings-row">
          <span class="settings-label"></span>
          <input type="checkbox" class="switch" />
        </label>
        <div class="settings-help"></div>
        <div class="settings-row">
          <span class="lang-label"></span>
          <button class="lang-btn settings-lang"></button>
        </div>
        <button class="btn btn-play settings-close"></button>
      </div>`;
    document.body.appendChild(this.el);
    const q = <T extends HTMLElement>(s: string) => this.el.querySelector(s) as T;
    this.title = q('.settings-title');
    this.label = q('.settings-label');
    this.help = q('.settings-help');
    this.langLabel = q('.lang-label');
    this.langBtn = q('.settings-lang');
    this.toggle = q('.switch');
    this.closeBtn = q('.settings-close');
    this.toggle.checked = classic;
    this.toggle.addEventListener('change', () => setClassic(this.toggle.checked));
    this.langBtn.addEventListener('click', () => nextLang());
    this.closeBtn.addEventListener('click', () => this.open(false));
    this.el.addEventListener('pointerdown', (e) => {
      if (e.target === this.el) this.open(false);
    });
    onLangChange(() => this.refresh());
    this.refresh();
    this.el.style.display = 'none';
  }

  /** A round gear button that opens this panel. */
  gearButton(): HTMLButtonElement {
    const b = document.createElement('button');
    b.className = 'gear-btn';
    b.setAttribute('aria-label', 'Settings');
    b.textContent = '⚙';
    b.addEventListener('pointerdown', (e) => e.stopPropagation());
    b.addEventListener('click', () => this.open(true));
    return b;
  }

  open(v: boolean) {
    this.isOpen = v;
    this.toggle.checked = classic;
    this.el.style.display = v ? '' : 'none';
    this.onOpenChange(v);
  }

  private refresh() {
    const s = t();
    this.title.textContent = s.settings;
    this.label.textContent = s.classic;
    this.help.textContent = s.classicHelp;
    this.langLabel.textContent = s.language;
    this.langBtn.textContent = 'EN · RU · PL · LT · DE (' + getLang().toUpperCase() + ')';
    this.closeBtn.textContent = s.close;
  }
}
