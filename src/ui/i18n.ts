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
    mission: 'Find 5 golden donuts!',
    desktopHelp: 'WASD move · drag to look · Space jump · Click/J sticky · Right-click/K bouncy · E block · Q cube/ramp',
    sticky: 'Sticky',
    bouncy: 'Bouncy',
    jump: 'Jump',
    block: 'Block',
    cube: 'Cube',
    ramp: 'Ramp',
    blocks: 'Blocks',
    donut: 'Donut!',
    glued: 'Glued!',
    bonk: 'Bonk!',
    noRoom: 'No room here',
    win: 'You did it!',
    winSub: 'All 5 golden donuts found!',
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
    mission: 'Найди 5 золотых пончиков!',
    desktopHelp: 'WASD — ходить · тяни мышью — смотреть · Пробел — прыжок · Клик/J — липкая · ПКМ/K — прыгучая · E — блок · Q — куб/рампа',
    sticky: 'Липкая',
    bouncy: 'Прыгучая',
    jump: 'Прыжок',
    block: 'Блок',
    cube: 'Куб',
    ramp: 'Рампа',
    blocks: 'Блоки',
    donut: 'Пончик!',
    glued: 'Приклеен!',
    bonk: 'Бум!',
    noRoom: 'Тут нет места',
    win: 'Ура, получилось!',
    winSub: 'Все 5 золотых пончиков найдены!',
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
