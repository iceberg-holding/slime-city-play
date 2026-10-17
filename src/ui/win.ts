import type { Medal } from '../sim/levels';
import { formatTime } from './hud';
import { levelText, onLangChange, raceText, t } from './i18n';
import type { Best } from './records';

export type Outcome = 'failed' | 'next' | 'won' | 'complete';

/** What a finished race shows: medal, record and the extras collected on the way. */
export interface RaceSummary {
  medal: Medal;
  best: Best;
  newTime: boolean;
  stars: number;
  starsTotal: number;
  bonus: number;
  points: number;
  hits: number;
}

export const MEDAL_ICON: Record<Medal, string> = { gold: '🥇', silver: '🥈', bronze: '🥉' };

export class WinScreen {
  el: HTMLDivElement;
  private time = 0;
  private outcome: Outcome = 'won';
  private summary: RaceSummary | null = null;
  private level = 1;

  constructor(onAgain: () => void, onNewHero: () => void) {
    this.el = document.createElement('div');
    this.el.className = 'screen win';
    this.el.innerHTML = `
      <div class="win-card">
        <div class="win-icon">🏍️</div>
        <div class="win-title"></div>
        <div class="win-sub"></div>
        <div class="win-medal" hidden><span class="medal-icon"></span><span class="medal-name"></span></div>
        <div class="win-time"></div>
        <div class="win-best" hidden></div>
        <div class="win-stats" hidden></div>
        <div class="teaser" hidden>
          <div class="drone" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>
          <div class="car" aria-hidden="true"><b></b><u></u><i></i><i></i></div>
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
    const L = levelText(this.level === 3 ? 3 : 2), R = raceText(), o = this.outcome, sum = this.summary;
    const medal = q('.win-medal') as HTMLElement, best = q('.win-best') as HTMLElement, stats = q('.win-stats') as HTMLElement;
    medal.hidden = best.hidden = stats.hidden = !sum || o === 'failed';
    medal.className = `win-medal ${sum?.medal ?? ''}`;
    if (sum) {
      q('.medal-icon').textContent = MEDAL_ICON[sum.medal];
      q('.medal-name').textContent = R.medals[sum.medal];
      best.textContent = sum.newTime ? `${R.newBest} ${MEDAL_ICON[sum.best.medal]}` : `${R.best}: ${formatTime(sum.best.time)} ${MEDAL_ICON[sum.best.medal]}`;
      best.classList.toggle('record', sum.newTime);
      stats.innerHTML = '';
      for (const [icon, label, value] of [
        ['⭐', R.stars, `${sum.stars}/${sum.starsTotal}`],
        ['⏱', R.bonus, `+${Math.round(sum.bonus)}s`],
        ['🤸', R.points, `${sum.points}`],
      ]) {
        const chip = document.createElement('span');
        chip.className = 'stat';
        chip.title = label;
        chip.textContent = `${icon} ${value}`;
        stats.append(chip);
      }
    }
    q('.win-icon').textContent = o === 'next' ? '🏁' : o === 'failed' ? '⏱' : o === 'complete' ? (this.level === 3 ? '🚁' : '🛴') : '🏍️';
    (q('.teaser') as HTMLElement).hidden = o !== 'complete';
    // the teaser shows the next level's vehicle: the drone after level 2, a car after level 3
    (q('.drone') as HTMLElement).hidden = this.level === 3;
    (q('.car') as HTMLElement).hidden = this.level !== 3;
    this.el.classList.toggle('complete', o === 'complete');
    this.el.classList.toggle('level3', this.level === 3);
    if (o === 'next') {
      q('.win-title').textContent = R.finish;
      q('.win-sub').textContent = L.nextSub;
      q('.again').textContent = L.nextLevel;
    } else if (o === 'failed') {
      q('.win-title').textContent = R.timeUp;
      q('.win-sub').textContent = R.timeUpSub;
      q('.again').textContent = R.tryAgain;
    } else if (o === 'complete') {
      q('.win-title').textContent = L.complete;
      q('.win-sub').textContent = L.completeSub;
      // level 2 leads on to level 3; level 3 is the last one so far: fly again
      q('.again').textContent = this.level === 2 ? L.nextLevel : L.again;
      q('.teaser-title').textContent = L.teaser;
      q('.teaser-sub').textContent = L.teaserSub;
    }
  }

  open(time: number, outcome: Outcome = 'won', summary: RaceSummary | null = null, level = 1) {
    this.level = level;
    this.time = time;
    this.outcome = outcome;
    this.summary = summary;
    this.refresh();
    this.show(true);
  }

  show(v: boolean) {
    this.el.style.display = v ? '' : 'none';
  }
}
