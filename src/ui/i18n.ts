export type Lang = 'en' | 'ru';

const STRINGS = {
  en: {
    title: 'Slime City',
    subtitle: 'Spin the lock to build your hero!',
    code: 'Code',
    wheels: ['Head', 'Body', 'Legs', 'Gun'],
    parts: [
      ['Blocky', 'Smiley', 'Robot', 'Cat', 'Knight', 'Alien'],
      ['T-shirt', 'Hoodie', 'Armor', 'Tuxedo', 'Slime suit', 'Stripes'],
      ['Jeans', 'Shorts', 'Robo legs', 'Springs', 'Boots', 'Skates'],
      ['Blaster', 'Soaker', 'Bazooka', 'Bubble wand', 'Twin shot', 'Ray gun'],
    ],
    random: 'Random',
    play: 'Play',
    mission: 'Find 5 pit bike parts, build the bike and ride!',
    desktopHelp: 'WASD move · drag to look · Space jump · Click/J sticky · Right-click/K bouncy · E block · Q cube/ramp · F ride',
    sticky: 'Sticky',
    bouncy: 'Bouncy',
    jump: 'Jump',
    block: 'Block',
    cube: 'Cube',
    ramp: 'Ramp',
    blocks: 'Blocks',
    partNames: { frontWheel: 'Front wheel', rearWheel: 'Rear wheel', frame: 'Frame', handlebar: 'Handlebar', engine: 'Engine' } as Record<string, string>,
    got: 'Got it:',
    delivered: 'Bike parts',
    built: 'Pit bike ready!',
    ride: 'Ride',
    exit: 'Exit',
    trick: 'TRICK!',
    tricks: { flip: 'Backflip!', spin: 'Spin 360!' } as Record<string, string>,
    hintFind: 'Find the glowing bike parts!',
    hintBring: 'Bring the parts to the garage!',
    hintMount: 'Hop on your pit bike!',
    hintRide: 'Ride! Bounce off a pink slime pad for a trick!',
    glued: 'Glued!',
    bonk: 'Bonk!',
    noRoom: 'No room here',
    win: 'You did it!',
    winSub: 'You built a pit bike and rode it!',
    time: 'Time',
    again: 'Play again',
    newHero: 'New hero',
  },
  ru: {
    title: 'Слайм-Сити',
    subtitle: 'Покрути замок и собери героя!',
    code: 'Код',
    wheels: ['Голова', 'Тело', 'Ноги', 'Бластер'],
    parts: [
      ['Кубик', 'Смайлик', 'Робот', 'Кот', 'Рыцарь', 'Пришелец'],
      ['Футболка', 'Худи', 'Броня', 'Смокинг', 'Слайм-костюм', 'Тельняшка'],
      ['Джинсы', 'Шорты', 'Робоноги', 'Пружины', 'Сапоги', 'Ролики'],
      ['Бластер', 'Водомёт', 'Базука', 'Пузыри', 'Двустволка', 'Луч'],
    ],
    random: 'Случайно',
    play: 'Играть',
    mission: 'Найди 5 деталей питбайка, собери его и катайся!',
    desktopHelp: 'WASD — ходить · тяни мышью — смотреть · Пробел — прыжок · Клик/J — липкая · ПКМ/K — прыгучая · E — блок · Q — куб/рампа · F — сесть',
    sticky: 'Липкая',
    bouncy: 'Прыгучая',
    jump: 'Прыжок',
    block: 'Блок',
    cube: 'Куб',
    ramp: 'Рампа',
    blocks: 'Блоки',
    partNames: { frontWheel: 'Переднее колесо', rearWheel: 'Заднее колесо', frame: 'Рама', handlebar: 'Руль', engine: 'Мотор' } as Record<string, string>,
    got: 'Есть:',
    delivered: 'Детали',
    built: 'Питбайк готов!',
    ride: 'Сесть',
    exit: 'Слезть',
    trick: 'ТРЮК!',
    tricks: { flip: 'Сальто!', spin: 'Вертушка 360!' } as Record<string, string>,
    hintFind: 'Найди светящиеся детали байка!',
    hintBring: 'Неси детали в гараж!',
    hintMount: 'Садись на питбайк!',
    hintRide: 'Катайся! Прыгни с розовой слизи — будет трюк!',
    glued: 'Приклеен!',
    bonk: 'Бум!',
    noRoom: 'Тут нет места',
    win: 'Ура, получилось!',
    winSub: 'Ты собрал питбайк и прокатился!',
    time: 'Время',
    again: 'Ещё раз',
    newHero: 'Новый герой',
  },
};

export type Strings = (typeof STRINGS)['en'];

const KEY = 'slimecity.lang';
let lang: Lang = (() => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'ru' ? 'ru' : 'en';
  } catch {
    return 'en';
  }
})();
const listeners: (() => void)[] = [];

export function getLang(): Lang {
  return lang;
}

export function setLang(l: Lang) {
  lang = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* private mode */
  }
  document.documentElement.lang = l;
  listeners.forEach((f) => f());
}

export function onLangChange(f: () => void) {
  listeners.push(f);
}

export function t(): Strings {
  return STRINGS[lang];
}
