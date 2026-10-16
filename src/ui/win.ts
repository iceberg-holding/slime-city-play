import { formatTime } from './hud';
import { levelText, onLangChange, t } from './i18n';

export type Outcome = 'failed' | 'next' | 'won' | 'complete';

export class WinScreen {
  el: HTMLDivElement;
  private time = 0;
  private outcome: Outcome = 'won';

  constructor(onAgain: () => void, onNewHero: () => void) {
    this.el = document.createElement('div');
    this.el.className = 'screen win';
    this.el.innerHTML = `
      <div class="win-card">
        <div class="win-icon">🏍️</div>
        <div class="win-title"></div>
        <div class="win-sub"></div>
        <div class="win-time"></div>
        <div class="teaser" hidden>
          <div class="drone" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>
          <div class="teaser-text"><div class="teaser-title"></div><div class="teaser-sub"></div></div>
        </div>
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
    const L = levelText(), o = this.outcome;
    q('.win-icon').textContent = o === 'next' ? '🏁' : o === 'failed' ? '⏱' : o === 'complete' ? '🛴' : '🏍️';
    (q('.teaser') as HTMLElement).hidden = o !== 'complete';
    this.el.classList.toggle('complete', o === 'complete');
    if (o === 'next') {
      q('.win-title').textContent = 'Finish!';
      q('.win-sub').textContent = L.nextSub;
      q('.again').textContent = L.nextLevel;
    } else if (o === 'failed') {
      q('.win-title').textContent = 'Time’s up';
      q('.win-sub').textContent = 'Steer around glued pyshki. Jump the ramps!';
      q('.again').textContent = 'Try again';
    } else if (o === 'complete') {
      q('.win-title').textContent = L.complete;
      q('.win-sub').textContent = L.completeSub;
      q('.again').textContent = L.again;
      q('.teaser-title').textContent = L.teaser;
      q('.teaser-sub').textContent = L.teaserSub;
    }
  }

  open(time: number, outcome: Outcome = 'won') {
    this.time = time;
    this.outcome = outcome;
    this.refresh();
    this.show(true);
  }

  show(v: boolean) {
    this.el.style.display = v ? '' : 'none';
  }
}
