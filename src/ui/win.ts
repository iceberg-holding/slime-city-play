import { formatTime } from './hud';
import { onLangChange, t } from './i18n';

export class WinScreen {
  el: HTMLDivElement;
  private time = 0;

  constructor(onAgain: () => void, onNewHero: () => void) {
    this.el = document.createElement('div');
    this.el.className = 'screen win';
    this.el.innerHTML = `
      <div class="win-card">
        <div class="win-donuts"><span class="donut-icon big"></span><span class="donut-icon big"></span><span class="donut-icon big"></span></div>
        <div class="win-title"></div>
        <div class="win-sub"></div>
        <div class="win-time"></div>
        <div class="win-buttons">
          <button class="btn btn-play again"></button>
          <button class="btn btn-secondary hero"></button>
        </div>
      </div>`;
    document.body.appendChild(this.el);
    this.el.querySelector('.again')!.addEventListener('click', onAgain);
    this.el.querySelector('.hero')!.addEventListener('click', onNewHero);
    onLangChange(() => this.refresh());
    this.show(false);
  }

  private refresh() {
    const s = t();
    const q = (c: string) => this.el.querySelector(c)!;
    q('.win-title').textContent = s.win;
    q('.win-sub').textContent = s.winSub;
    q('.win-time').textContent = `${s.time}: ${formatTime(this.time)}`;
    q('.again').textContent = s.again;
    q('.hero').textContent = s.newHero;
  }

  open(time: number) {
    this.time = time;
    this.refresh();
    this.show(true);
  }

  show(v: boolean) {
    this.el.style.display = v ? '' : 'none';
  }
}
