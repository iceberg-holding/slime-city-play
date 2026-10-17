import { MEDAL_RANK, type Medal } from '../sim/levels';

// Per-level best run in localStorage: best time, best medal and most stars (each kept independently).

export interface Best {
  time: number;
  medal: Medal;
  stars: number;
}

const key = (level: number) => `slimecity.best.L${level}`;

export function loadBest(level: number): Best | null {
  try {
    const v = JSON.parse(localStorage.getItem(key(level)) ?? 'null');
    return v && typeof v.time === 'number' && v.medal in MEDAL_RANK ? v : null;
  } catch {
    return null;
  }
}

/** Store a finished run; returns the previous best and whether this run's time is a new record. */
export function saveRun(level: number, run: Best): { previous: Best | null; best: Best; newTime: boolean } {
  const previous = loadBest(level);
  const newTime = !previous || run.time < previous.time;
  const best: Best = previous
    ? {
        time: Math.min(previous.time, run.time),
        medal: MEDAL_RANK[run.medal] > MEDAL_RANK[previous.medal] ? run.medal : previous.medal,
        stars: Math.max(previous.stars, run.stars),
      }
    : run;
  try {
    localStorage.setItem(key(level), JSON.stringify(best));
  } catch {
    /* private mode */
  }
  return { previous, best, newTime };
}
