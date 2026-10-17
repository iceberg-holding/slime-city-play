export type Lang = 'en' | 'ru' | 'pl' | 'lt' | 'de';

const STRINGS = {
  en: {
    title: 'Slime City',
    subtitle: 'Build your hero!',
    code: 'Code',
    wheels: ['Head', 'Body', 'Legs', 'Gun'],
    heroParts: {
      cube: ['Cubehead', 'Thinks in squares. Glued pyshki stay stuck longer.'],
      bighead: ['Big Head', 'Huge head, huge ideas: bigger sticky blobs.'],
      robot: ['Robot', 'Beep-boop! Auto-aim locks on from farther away.'],
      cat: ['Cat', 'Always lands on its paws: way less dizzy after a shove.'],
      knight: ['Knight', 'Heavy helmet: pyshki push you less.'],
      alien: ['Alien', 'Antennas sense pyshki: wider auto-aim.'],
      tshirt: ['T-shirt', 'Light and breezy: a bit faster.'],
      hoodie: ['Hoodie', 'Deep pockets: carries 3 extra blocks.'],
      tank: ['Tank', 'Tank body: almost unpushable, but a bit slow.'],
      tuxedo: ['Tuxedo', 'So fancy that pyshki keep a polite distance.'],
      slimesuit: ['Slime suit', 'Extra boing on pink slime pads.'],
      stripes: ['Sailor', 'Born to ride: the pit bike goes faster.'],
      jeans: ['Jeans', 'Thick denim: pushed around a little less.'],
      shorts: ['Shorts', 'Air-cooled knees: faster!'],
      robolegs: ['Robo legs', 'Hydraulics: higher jump, slightly slower.'],
      springs: ['Springs', 'Boing! Much higher jump.'],
      boots: ['Boots', 'Stompy boots: hard to push, a bit slow.'],
      wheels: ['Wheels', 'Zoom! Super fast, but low jumps.'],
      blaster: ['Blaster', 'Trusty and balanced. Does what it says.'],
      rapid: ['Rapid', 'Pew-pew-pew! Rapid fire.'],
      bazooka: ['Bazooka', 'Giant blobs, slow reload.'],
      bubble: ['Bubble wand', 'Huge pink bounce pads.'],
      twin: ['Twin shot', 'Two blobs at once!'],
      ray: ['Ray gun', 'Long-range goo beam.'],
    } as Record<string, [string, string]>,
    stats: {
      speed: 'Speed',
      jump: 'Jump',
      knockback: 'Push',
      stun: 'Dizzy',
      fireRate: 'Fire rate',
      blobScale: 'Blob size',
      projSpeed: 'Range',
      aimRange: 'Aim range',
      aimCone: 'Wide aim',
      glueTime: 'Glue time',
      maxBlocks: 'Blocks',
      padLaunch: 'Pad boing',
      padScale: 'Pad size',
      multishot: 'Blobs',
      rideSpeed: 'Bike speed',
      personalSpace: 'Personal space',
      balanced: 'Balanced',
    } as Record<string, string>,
    random: 'Random',
    play: 'Play',
    mission: 'Find 6 pit bike parts, build the bike and ride!',
    desktopHelp: 'WASD move · drag to look · Space jump · Click/J sticky · Right-click/K bouncy · E block · Q cube/ramp · F ride',
    sticky: 'Sticky',
    bouncy: 'Bouncy',
    jump: 'Jump',
    block: 'Block',
    cube: 'Cube',
    ramp: 'Ramp',
    blocks: 'Blocks',
    partNames: { frontWheel: 'Front wheel', rearWheel: 'Rear wheel', frame: 'Frame', handlebar: 'Handlebar', engine: 'Engine', flashlight: 'Flashlight' } as Record<
      string,
      string
    >,
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
    hintGate: 'Ride through the green gate!',
    hintRide: 'Ride! Bounce off a pink slime pad for a trick!',
    hintLight: 'Gate locked, too dark! Find the flashlight (tower lift?)',
    headlightOn: 'Headlight on! The gate is open',
    hintPhrase: 'They say someone lost a flashlight upstairs…',
    glued: 'Glued!',
    bonk: 'Oof!',
    noRoom: 'No room here',
    win: 'You did it!',
    winSub: 'You built a pit bike and rode it!',
    time: 'Time',
    again: 'Play again',
    newHero: 'New hero',
    settings: 'Settings',
    classic: 'Classic buttons',
    classicHelp: 'Separate Sticky and Bouncy buttons instead of tap / double-tap on the right side.',
    language: 'Language',
    close: 'OK',
    tapHint: 'Tap = sticky · Double-tap = bouncy · Drag = look',
    phrases: [
      'How do I get to the library?',
      'Young man!',
      "Hey, you weren't in line!",
      'How much for the cucumbers?',
      'I just have a question!',
      'I was here first!',
      'Just a loaf of bread for me!',
      'So skinny! Eat something!',
      'No cutting in line!',
      'Got change for a fifty?',
      "Put a hat on, you'll catch a cold!",
      'Back in my day…',
      'Which bus is this?',
      'Homegrown cucumbers!',
      'And whose kid are you?',
      'Hot buns! Fresh buns!',
    ],
  },
  ru: {
    title: 'Слайм-Сити',
    subtitle: 'Собери своего героя!',
    code: 'Код',
    wheels: ['Голова', 'Тело', 'Ноги', 'Бластер'],
    heroParts: {
      cube: ['Кубоголов', 'Мыслит квадратно. Приклеенные пышки держатся дольше.'],
      bighead: ['Большая голова', 'Большая голова — большие кляксы: липкий шар крупнее.'],
      robot: ['Робот', 'Бип-буп! Автоприцел ловит издалека.'],
      cat: ['Кот', 'Всегда приземляется на лапы: почти не кружится голова.'],
      knight: ['Рыцарь', 'Тяжёлый шлем: пышки толкают слабее.'],
      alien: ['Пришелец', 'Антенны чуют пышек: автоприцел шире.'],
      tshirt: ['Футболка', 'Лёгкая и свежая: чуть быстрее.'],
      hoodie: ['Худи', 'Глубокие карманы: +3 блока.'],
      tank: ['Танк', 'Танковый корпус: почти не сдвинуть, но медленнее.'],
      tuxedo: ['Смокинг', 'Так элегантно, что пышки держат дистанцию.'],
      slimesuit: ['Слайм-костюм', 'Розовые лужи подкидывают выше.'],
      stripes: ['Тельняшка', 'Рождён гонять: питбайк быстрее.'],
      jeans: ['Джинсы', 'Плотная джинса: толкают чуть слабее.'],
      shorts: ['Шорты', 'Коленки проветриваются: быстрее!'],
      robolegs: ['Робоноги', 'Гидравлика: прыжок выше, шаг чуть медленнее.'],
      springs: ['Пружины', 'Бдыщ! Прыжок гораздо выше.'],
      boots: ['Сапоги', 'Топ-топ: трудно сдвинуть, но медленнее.'],
      wheels: ['Колёса', 'Вжух! Очень быстро, но прыжок ниже.'],
      blaster: ['Бластер', 'Надёжный и сбалансированный.'],
      rapid: ['Скорострел', 'Пиу-пиу-пиу! Быстрая стрельба.'],
      bazooka: ['Базука', 'Огромные кляксы, долгая перезарядка.'],
      bubble: ['Пузыри', 'Огромные розовые батуты.'],
      twin: ['Двустволка', 'Две кляксы сразу!'],
      ray: ['Луч', 'Дальнобойный слизе-луч.'],
    } as Record<string, [string, string]>,
    stats: {
      speed: 'Скорость',
      jump: 'Прыжок',
      knockback: 'Толчки',
      stun: 'Головокружение',
      fireRate: 'Скорострельность',
      blobScale: 'Размер кляксы',
      projSpeed: 'Дальность',
      aimRange: 'Дальность прицела',
      aimCone: 'Широкий прицел',
      glueTime: 'Время клея',
      maxBlocks: 'Блоки',
      padLaunch: 'Прыгучесть луж',
      padScale: 'Размер луж',
      multishot: 'Кляксы',
      rideSpeed: 'Скорость байка',
      personalSpace: 'Личное пространство',
      balanced: 'Сбалансировано',
    } as Record<string, string>,
    random: 'Случайно',
    play: 'Играть',
    mission: 'Найди 6 деталей питбайка, собери его и катайся!',
    desktopHelp:
      'WASD — ходить · тяни мышью — смотреть · Пробел — прыжок · Клик/J — липкая · ПКМ/K — прыгучая · E — блок · Q — куб/рампа · F — сесть',
    sticky: 'Липкая',
    bouncy: 'Прыгучая',
    jump: 'Прыжок',
    block: 'Блок',
    cube: 'Куб',
    ramp: 'Рампа',
    blocks: 'Блоки',
    partNames: { frontWheel: 'Переднее колесо', rearWheel: 'Заднее колесо', frame: 'Рама', handlebar: 'Руль', engine: 'Мотор', flashlight: 'Фонарик' } as Record<
      string,
      string
    >,
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
    hintGate: 'Езжай через зелёные ворота!',
    hintRide: 'Катайся! Прыгни с розовой слизи — будет трюк!',
    hintLight: 'Ворота закрыты, темно! Найди фонарик (лифт в башне?)',
    headlightOn: 'Фара горит! Ворота открыты',
    hintPhrase: 'Говорят, наверху кто-то фонарик потерял…',
    glued: 'Приклеен!',
    bonk: 'Ой!',
    noRoom: 'Тут нет места',
    win: 'Ура, получилось!',
    winSub: 'Ты собрал питбайк и прокатился!',
    time: 'Время',
    again: 'Ещё раз',
    newHero: 'Новый герой',
    settings: 'Настройки',
    classic: 'Классические кнопки',
    classicHelp: 'Отдельные кнопки «Липкая» и «Прыгучая» вместо тапа / двойного тапа справа.',
    language: 'Язык',
    close: 'ОК',
    tapHint: 'Тап — липкая · Двойной тап — прыгучая · Тяни — смотреть',
    phrases: [
      'Как пройти в библиотеку?',
      'Молодой человек!',
      'А вы тут не стояли!',
      'Почём огурцы?',
      'Я только спросить!',
      'Я за вами занимала!',
      'Мне только хлебушка!',
      'Худенький какой! Кушать надо!',
      'Куда без очереди?!',
      'А сдачи не будет?',
      'Шапку надень, простудишься!',
      'Вот в наше время…',
      'Это какой автобус?',
      'Огурчики свои, с дачи!',
      'А ты чей будешь?',
      'Пирожки горячие!',
    ],
  },
};

export type Strings = (typeof STRINGS)['en'];

const KEY = 'slimecity.lang';
let lang: Lang = (() => {
  try {
    const v = localStorage.getItem(KEY);
    return ['en', 'ru', 'pl', 'lt', 'de'].includes(v || '') ? v as Lang : 'en';
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
  return { ...STRINGS[lang === 'ru' ? 'ru' : 'en'], ...(lang === 'pl' || lang === 'lt' || lang === 'de' ? LEVEL1[lang] : {}), phrases: CHAT[lang], hintGate: GATE_HINT[lang] };
}

/** Level-1 mission texts for the languages without a full string table (the rest falls back to English). */
const LEVEL1: Record<'pl' | 'lt' | 'de', Partial<Strings>> = {
  pl: {
    mission: 'Znajdź 6 części motoru, zbuduj go i jedź!',
    partNames: { frontWheel: 'Przednie koło', rearWheel: 'Tylne koło', frame: 'Rama', handlebar: 'Kierownica', engine: 'Silnik', flashlight: 'Latarka' },
    got: 'Mam:', delivered: 'Części', built: 'Motor gotowy!', ride: 'Jedź', exit: 'Zsiądź',
    hintFind: 'Znajdź świecące części motoru!', hintBring: 'Zanieś części do garażu!', hintMount: 'Wskakuj na motor!',
    hintRide: 'Jedź! Odbij się od różowego glutu i zrób trik!',
    hintLight: 'Brama zamknięta, ciemno! Znajdź latarkę (winda w wieży?)',
    headlightOn: 'Reflektor świeci! Brama otwarta',
    hintPhrase: 'Podobno ktoś na górze zgubił latarkę…',
  },
  lt: {
    mission: 'Surask 6 motociklo dalis, surink jį ir važiuok!',
    partNames: { frontWheel: 'Priekinis ratas', rearWheel: 'Galinis ratas', frame: 'Rėmas', handlebar: 'Vairas', engine: 'Variklis', flashlight: 'Žibintuvėlis' },
    got: 'Turiu:', delivered: 'Dalys', built: 'Motociklas paruoštas!', ride: 'Važiuoti', exit: 'Nulipti',
    hintFind: 'Surask šviečiančias motociklo dalis!', hintBring: 'Nešk dalis į garažą!', hintMount: 'Sėsk ant motociklo!',
    hintRide: 'Važiuok! Atšok nuo rožinės gleivės ir padaryk triuką!',
    hintLight: 'Vartai uždaryti, tamsu! Surask žibintuvėlį (bokšto liftas?)',
    headlightOn: 'Žibintas dega! Vartai atviri',
    hintPhrase: 'Sako, viršuje kažkas pametė žibintuvėlį…',
  },
  de: {
    mission: 'Finde 6 Pitbike-Teile, bau das Bike und fahr los!',
    partNames: { frontWheel: 'Vorderrad', rearWheel: 'Hinterrad', frame: 'Rahmen', handlebar: 'Lenker', engine: 'Motor', flashlight: 'Taschenlampe' },
    got: 'Hab ich:', delivered: 'Teile', built: 'Pitbike fertig!', ride: 'Fahren', exit: 'Absteigen',
    hintFind: 'Finde die leuchtenden Bike-Teile!', hintBring: 'Bring die Teile zur Garage!', hintMount: 'Steig auf dein Pitbike!',
    hintRide: 'Fahr los! Spring von einem rosa Schleimkissen für einen Trick!',
    hintLight: 'Tor zu, zu dunkel! Finde die Taschenlampe (Turm-Aufzug?)',
    headlightOn: 'Scheinwerfer an! Das Tor ist offen',
    hintPhrase: 'Man sagt, oben hat jemand eine Taschenlampe verloren…',
  },
};

export const LANGS: Lang[] = ['en', 'ru', 'pl', 'lt', 'de'];
export function nextLang() { setLang(LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]); }
const CHAT: Record<Lang, string[]> = {
 en: STRINGS.en.phrases, ru: STRINGS.ru.phrases,
 pl: ['Którędy do biblioteki?', 'Ja tu stałam!', 'Ile kosztują ogórki?', 'Zjedz coś!', 'Ale miękkie bułeczki!', 'Masz drobne?'],
 lt: ['Kur biblioteka?', 'Aš čia stovėjau!', 'Kiek kainuoja agurkai?', 'Pavalgyk!', 'Kokios minkštos bandelės!', 'Ar turi smulkių?'],
 de: ['Wo ist die Bibliothek?', 'Ich war zuerst hier!', 'Was kosten die Gurken?', 'Iss etwas!', 'Frische Brötchen!', 'Hast du Kleingeld?'],
};
const FLIGHT: Record<Lang, string[]> = {
 en: ["That's it, I'm flying!", 'Hello birds, here I come!', 'Next stop: the moon!'],
 ru: ['Всё, я полетела!', 'Птичкам привет, скоро буду у вас!', 'Следующая остановка — Луна!'],
 pl: ['No to lecę!', 'Ptaki, zaraz do was dołączę!', 'Następny przystanek: Księżyc!'],
 lt: ['Viskas, aš skrendu!', 'Paukščiai, tuoj būsiu pas jus!', 'Kita stotelė — Mėnulis!'],
 de: ['Ich fliege los!', 'Hallo Vögel, ich komme!', 'Nächster Halt: der Mond!'],
};
export function flightPhrase(index: number) { return FLIGHT[lang][index % FLIGHT[lang].length]; }

const GATE_HINT: Record<Lang, string> = { en: 'Ride through the green gate!', ru: 'Езжай через зелёные ворота!', pl: 'Przejedź przez zieloną bramę!', lt: 'Važiuok pro žalius vartus!', de: 'Fahre durch das grüne Tor!' };

/** Level 2 (harbor scooter) and level-complete texts in every language. */
export interface LevelText { hintFind: string; hintBring: string; hintMount: string; built: string; race: string; complete: string; completeSub: string; teaser: string; teaserSub: string; again: string; parts: Record<string, string>; ride: string; nextLevel: string; nextSub: string;
  /** level 3: the hint pyshka's line, altitude button labels, gate and free-flight hints */
  hintPhrase?: string; up?: string; down?: string; hintGate?: string; hintFly?: string }
const LEVEL2: Record<Lang, LevelText> = {
  en: { hintFind: 'Harbor! Find the 4 scooter parts', hintBring: 'Bring the parts to the scooter shop!', hintMount: 'Hop on your scooter!', built: 'Scooter ready!', race: 'Race! ↑ Forward · coast road to the lighthouse', complete: 'Level 2 complete!', completeSub: 'You built a scooter and raced the coast!', teaser: 'Level 3: Drone', teaserSub: 'Coming soon — take to the skies!', again: 'Race again', parts: { frontWheel: 'Front wheel', rearWheel: 'Rear wheel', deck: 'Deck', handlebar: 'Handlebar' }, ride: 'Ride', nextLevel: 'Next level →', nextSub: 'Level 2 · Build a scooter at the harbor' },
  ru: { hintFind: 'Гавань! Найди 4 детали самоката', hintBring: 'Неси детали в мастерскую самокатов!', hintMount: 'Вставай на самокат!', built: 'Самокат готов!', race: 'Гонка! ↑ Вперёд · по берегу к маяку', complete: 'Уровень 2 пройден!', completeSub: 'Ты собрал самокат и промчался по побережью!', teaser: 'Уровень 3: Дрон', teaserSub: 'Скоро — взлетаем в небо!', again: 'Ещё заезд', parts: { frontWheel: 'Переднее колесо', rearWheel: 'Заднее колесо', deck: 'Дека', handlebar: 'Руль' }, ride: 'Ехать', nextLevel: 'Дальше →', nextSub: 'Уровень 2 · Собери самокат в гавани' },
  pl: { hintFind: 'Port! Znajdź 4 części hulajnogi', hintBring: 'Zanieś części do warsztatu hulajnóg!', hintMount: 'Wskakuj na hulajnogę!', built: 'Hulajnoga gotowa!', race: 'Wyścig! ↑ Naprzód · wybrzeżem do latarni', complete: 'Poziom 2 ukończony!', completeSub: 'Zbudowałeś hulajnogę i pognałeś wybrzeżem!', teaser: 'Poziom 3: Dron', teaserSub: 'Już wkrótce — w górę, w niebo!', again: 'Jeszcze raz', parts: { frontWheel: 'Przednie koło', rearWheel: 'Tylne koło', deck: 'Deska', handlebar: 'Kierownica' }, ride: 'Jedź', nextLevel: 'Dalej →', nextSub: 'Poziom 2 · Zbuduj hulajnogę w porcie' },
  lt: { hintFind: 'Uostas! Surask 4 paspirtuko dalis', hintBring: 'Nešk dalis į paspirtukų dirbtuvę!', hintMount: 'Lipk ant paspirtuko!', built: 'Paspirtukas paruoštas!', race: 'Lenktynės! ↑ Pirmyn · pakrante iki švyturio', complete: '2 lygis įveiktas!', completeSub: 'Surinkai paspirtuką ir nulėkei pakrante!', teaser: '3 lygis: Dronas', teaserSub: 'Jau greitai — kylame į dangų!', again: 'Dar kartą', parts: { frontWheel: 'Priekinis ratas', rearWheel: 'Galinis ratas', deck: 'Lenta', handlebar: 'Vairas' }, ride: 'Važiuoti', nextLevel: 'Toliau →', nextSub: '2 lygis · Surink paspirtuką uoste' },
  de: { hintFind: 'Hafen! Finde die 4 Rollerteile', hintBring: 'Bring die Teile zur Rollerwerkstatt!', hintMount: 'Steig auf deinen Roller!', built: 'Roller fertig!', race: 'Rennen! ↑ Vorwärts · die Küste entlang zum Leuchtturm', complete: 'Level 2 geschafft!', completeSub: 'Du hast einen Roller gebaut und die Küste bezwungen!', teaser: 'Level 3: Drohne', teaserSub: 'Bald — ab in die Lüfte!', again: 'Nochmal fahren', parts: { frontWheel: 'Vorderrad', rearWheel: 'Hinterrad', deck: 'Trittbrett', handlebar: 'Lenker' }, ride: 'Fahren', nextLevel: 'Weiter →', nextSub: 'Level 2 · Baue einen Roller am Hafen' },
};
/** Level 3 (old-town drone) texts in every language. */
const LEVEL3: Record<Lang, LevelText> = {
  en: { hintFind: 'Old town! Find the 6 drone parts', hintBring: 'Bring the parts to the drone workshop!', hintMount: 'Hop on your drone!', built: 'Drone ready!', race: 'Flight! ↑ Forward · ▲▼ altitude · fly through the rings', complete: 'Level 3 complete!', completeSub: 'You built a drone and flew over the old town!', teaser: 'Level 4: Car', teaserSub: 'Coming soon — buckle up!', again: 'Fly again',
    parts: { propFront: 'Front propellers', propRear: 'Rear propellers', frame: 'Frame', battery: 'Battery', camera: 'Camera', skids: 'Landing skids' }, ride: 'Fly', nextLevel: 'Next level →', nextSub: 'Level 3 · Build a drone in the old town',
    hintPhrase: 'Something buzzes up in the clock tower… a battery?', up: 'Up', down: 'Down', hintGate: 'Fly through the green gate!', hintFly: 'Fly! ▲ Up · ▼ Down · land anywhere' },
  ru: { hintFind: 'Старый город! Найди 6 деталей дрона', hintBring: 'Неси детали в мастерскую дронов!', hintMount: 'Вставай на дрон!', built: 'Дрон готов!', race: 'Полёт! ↑ Вперёд · ▲▼ высота · пролетай сквозь кольца', complete: 'Уровень 3 пройден!', completeSub: 'Ты собрал дрон и пролетел над старым городом!', teaser: 'Уровень 4: Машина', teaserSub: 'Скоро — пристегнись!', again: 'Ещё полёт',
    parts: { propFront: 'Передние пропеллеры', propRear: 'Задние пропеллеры', frame: 'Рама', battery: 'Батарейка', camera: 'Камера', skids: 'Полозья' }, ride: 'Лететь', nextLevel: 'Дальше →', nextSub: 'Уровень 3 · Собери дрон в старом городе',
    hintPhrase: 'Что-то жужжит в часовой башне… батарейка?', up: 'Вверх', down: 'Вниз', hintGate: 'Пролети через зелёные ворота!', hintFly: 'Лети! ▲ Вверх · ▼ Вниз · садись где хочешь' },
  pl: { hintFind: 'Stare miasto! Znajdź 6 części drona', hintBring: 'Zanieś części do warsztatu dronów!', hintMount: 'Wskakuj na drona!', built: 'Dron gotowy!', race: 'Lot! ↑ Naprzód · ▲▼ wysokość · leć przez obręcze', complete: 'Poziom 3 ukończony!', completeSub: 'Zbudowałeś drona i przeleciałeś nad starym miastem!', teaser: 'Poziom 4: Auto', teaserSub: 'Już wkrótce — zapnij pasy!', again: 'Leć jeszcze raz',
    parts: { propFront: 'Przednie śmigła', propRear: 'Tylne śmigła', frame: 'Rama', battery: 'Bateria', camera: 'Kamera', skids: 'Płozy' }, ride: 'Leć', nextLevel: 'Dalej →', nextSub: 'Poziom 3 · Zbuduj drona na starym mieście',
    hintPhrase: 'Coś bzyczy w wieży zegarowej… bateria?', up: 'W górę', down: 'W dół', hintGate: 'Przeleć przez zieloną bramę!', hintFly: 'Leć! ▲ W górę · ▼ W dół · ląduj, gdzie chcesz' },
  lt: { hintFind: 'Senamiestis! Surask 6 drono dalis', hintBring: 'Nešk dalis į dronų dirbtuvę!', hintMount: 'Lipk ant drono!', built: 'Dronas paruoštas!', race: 'Skrydis! ↑ Pirmyn · ▲▼ aukštis · skrisk pro žiedus', complete: '3 lygis įveiktas!', completeSub: 'Surinkai droną ir praskridai virš senamiesčio!', teaser: '4 lygis: Automobilis', teaserSub: 'Jau greitai — prisisek diržą!', again: 'Skristi dar kartą',
    parts: { propFront: 'Priekiniai sraigtai', propRear: 'Galiniai sraigtai', frame: 'Rėmas', battery: 'Baterija', camera: 'Kamera', skids: 'Nusileidimo pavažos' }, ride: 'Skristi', nextLevel: 'Toliau →', nextSub: '3 lygis · Surink droną senamiestyje',
    hintPhrase: 'Laikrodžio bokšte kažkas zyzia… baterija?', up: 'Aukštyn', down: 'Žemyn', hintGate: 'Praskrisk pro žalius vartus!', hintFly: 'Skrisk! ▲ Aukštyn · ▼ Žemyn · leistis gali bet kur' },
  de: { hintFind: 'Altstadt! Finde die 6 Drohnenteile', hintBring: 'Bring die Teile zur Drohnenwerkstatt!', hintMount: 'Steig auf deine Drohne!', built: 'Drohne fertig!', race: 'Flug! ↑ Vorwärts · ▲▼ Höhe · flieg durch die Ringe', complete: 'Level 3 geschafft!', completeSub: 'Du hast eine Drohne gebaut und bist über die Altstadt geflogen!', teaser: 'Level 4: Auto', teaserSub: 'Bald — anschnallen!', again: 'Nochmal fliegen',
    parts: { propFront: 'Vordere Propeller', propRear: 'Hintere Propeller', frame: 'Rahmen', battery: 'Akku', camera: 'Kamera', skids: 'Landekufen' }, ride: 'Fliegen', nextLevel: 'Weiter →', nextSub: 'Level 3 · Baue eine Drohne in der Altstadt',
    hintPhrase: 'Im Uhrturm summt etwas… ein Akku?', up: 'Hoch', down: 'Runter', hintGate: 'Flieg durch das grüne Tor!', hintFly: 'Flieg! ▲ Hoch · ▼ Runter · landen kannst du überall' },
};
/** Texts for level 2 (default) or 3 in the current language. */
export function levelText(level = 2): LevelText { return (level === 3 ? LEVEL3 : LEVEL2)[lang]; }

/** Race results, medals and bonus popups in every language. */
export interface RaceText { finish: string; timeUp: string; timeUpSub: string; tryAgain: string; medals: Record<'gold' | 'silver' | 'bronze', string>; best: string; newBest: string; stars: string; bonus: string; points: string; ring: string; star: string; hit: string; trick: string; bail: string; trickPhrases: string[]; race: string; trickNames: Record<'flip' | 'roll' | 'twist' | 'spin', string> }
const RACE_TEXT: Record<Lang, RaceText> = {
  en: { trickNames: { flip: 'Backflip', roll: 'Barrel roll', twist: 'Table twist', spin: 'Spin 360' }, finish: 'Finish!', timeUp: 'Time’s up', timeUpSub: 'Steer around glued pyshki. Jump the ramps!', tryAgain: 'Try again', medals: { gold: 'Gold', silver: 'Silver', bronze: 'Bronze' }, best: 'Best', newBest: 'New record!', stars: 'Stars', bonus: 'Bonus', points: 'Tricks', ring: 'Fire ring!', star: 'Star', hit: 'Gotcha!', trick: 'TRICK', bail: 'Wobbly landing!', race: 'Race! ↑ Forward · steer around green pyshki',
    trickPhrases: ['Grandma saw that!', 'Gravity who?', 'Like a flying pancake!', 'The pyshki applaud!', 'Pure butter!', 'Somebody call the circus!'] },
  ru: { trickNames: { flip: 'Сальто', roll: 'Бочка', twist: 'Вертолёт', spin: 'Вертушка 360' }, finish: 'Финиш!', timeUp: 'Время вышло', timeUpSub: 'Объезжай приклеенных пышек. Прыгай с трамплинов!', tryAgain: 'Ещё раз', medals: { gold: 'Золото', silver: 'Серебро', bronze: 'Бронза' }, best: 'Рекорд', newBest: 'Новый рекорд!', stars: 'Звёзды', bonus: 'Бонус', points: 'Трюки', ring: 'Огненное кольцо!', star: 'Звезда', hit: 'Попал!', trick: 'ТРЮК', bail: 'Кривое приземление!', race: 'Гонка! ↑ Вперёд · объезжай зелёных пышек',
    trickPhrases: ['Бабушка бы ахнула!', 'Гравитация? Не слышал!', 'Как блинчик в полёте!', 'Пышки аплодируют!', 'Как по маслу!', 'Зовите цирк!'] },
  pl: { trickNames: { flip: 'Salto', roll: 'Beczka', twist: 'Helikopter', spin: 'Obrót 360' }, finish: 'Meta!', timeUp: 'Koniec czasu', timeUpSub: 'Omijaj przyklejone pyszki. Skacz z ramp!', tryAgain: 'Jeszcze raz', medals: { gold: 'Złoto', silver: 'Srebro', bronze: 'Brąz' }, best: 'Rekord', newBest: 'Nowy rekord!', stars: 'Gwiazdki', bonus: 'Bonus', points: 'Triki', ring: 'Ogniste koło!', star: 'Gwiazdka', hit: 'Trafiony!', trick: 'TRIK', bail: 'Krzywe lądowanie!', race: 'Wyścig! ↑ Naprzód · omijaj zielone pyszki',
    trickPhrases: ['Babcia by zemdlała!', 'Grawitacja? Nie znam!', 'Jak latający naleśnik!', 'Pyszki biją brawo!', 'Gładko jak masło!', 'Dzwońcie po cyrk!'] },
  lt: { trickNames: { flip: 'Salto', roll: 'Statinė', twist: 'Sraigtasparnis', spin: 'Apsisukimas 360' }, finish: 'Finišas!', timeUp: 'Laikas baigėsi', timeUpSub: 'Apvažiuok priklijuotas spurgytes. Šok nuo rampų!', tryAgain: 'Dar kartą', medals: { gold: 'Auksas', silver: 'Sidabras', bronze: 'Bronza' }, best: 'Rekordas', newBest: 'Naujas rekordas!', stars: 'Žvaigždės', bonus: 'Premija', points: 'Triukai', ring: 'Ugnies žiedas!', star: 'Žvaigždė', hit: 'Pataikiau!', trick: 'TRIUKAS', bail: 'Kreivas nusileidimas!', race: 'Lenktynės! ↑ Pirmyn · apvažiuok žalias spurgytes',
    trickPhrases: ['Močiutė apalptų!', 'Gravitacija? Nežinau tokios!', 'Kaip skraidantis blynas!', 'Spurgytės ploja!', 'Kaip per sviestą!', 'Kvieskit cirką!'] },
  de: { trickNames: { flip: 'Rückwärtssalto', roll: 'Fassrolle', twist: 'Hubschrauber', spin: '360er-Dreh' }, finish: 'Ziel!', timeUp: 'Zeit um', timeUpSub: 'Fahr um festgeklebte Pyschki herum. Spring über die Rampen!', tryAgain: 'Nochmal', medals: { gold: 'Gold', silver: 'Silber', bronze: 'Bronze' }, best: 'Bestzeit', newBest: 'Neuer Rekord!', stars: 'Sterne', bonus: 'Bonus', points: 'Tricks', ring: 'Feuerring!', star: 'Stern', hit: 'Erwischt!', trick: 'TRICK', bail: 'Wackelige Landung!', race: 'Rennen! ↑ Vorwärts · fahr um die grünen Pyschki',
    trickPhrases: ['Oma hat das gesehen!', 'Schwerkraft? Nie gehört!', 'Wie ein fliegender Pfannkuchen!', 'Die Pyschki klatschen!', 'Butterweich!', 'Ruft den Zirkus!'] },
};
export function raceText(): RaceText { return RACE_TEXT[lang]; }
