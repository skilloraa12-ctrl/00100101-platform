import { useState, useRef, useEffect } from 'react'
import { synthesizeSpeechWav } from './piperTts.js'

// Той самий захист, що й у DesignLab UA: мережевий/обчислювальний збій під
// час озвучення іноді не відхиляється з помилкою, а просто зависає без
// відповіді — звичайний try/catch це не ловить.
function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Таймаут озвучення')), ms)),
  ])
}

// Час "на читання" для беззвучного режиму.
function readingDuration(text) {
  return Math.min(6000, Math.max(2200, text.length * 55))
}

// Ключові слова сцени визначають, ЯКА картинка малюється — щоб урок
// запам'ятовувався не лише на слух/читанням, а й візуально: коли йдеться
// про кнопку, на екрані кнопка; коли про зображення — іконка картинки;
// коли про домен — адресний рядок і сервер. Не просто одна й та сама
// картинка сайту на всі сцени поспіль.
const FOCUS_RULES = [
  { id: 'button', words: ['кнопк', 'submit', 'клік', 'натисн'] },
  { id: 'image', words: ['зображен', 'картинк', 'фото', 'ілюстрац', ' img'] },
  { id: 'link', words: ['посилан', 'гіперпосилан', 'href', 'лінк', 'anchor'] },
  { id: 'form', words: ['форм', 'поле вводу', 'input', 'textarea', 'checkbox', 'radio'] },
  { id: 'list', words: ['списк', 'перелік', ' ul', ' ol', '<li', 'масив', '.append(', 'витягування ціни', 'повний розбір: кілька', 'очищення всіх зібраних', 'фільтрація за ціною', 'сортування результатів', 'фільтрація задач', 'пошук прострочених'] },
  { id: 'table', words: ['таблиц', 'колонк', '<table', '<tr', '<td', 'colspan', 'rowspan', 'group by', 'order by', 'select where', 'where:', 'join', 'union', 'підзапит', 'primary key', 'foreign key', 'транзакці', 'case when', 'обмеженн', 'unique,', 'перед insert', 'grid для', 'список визначень'] },
  { id: 'header', words: ['заголов', 'шапк', 'навігац', 'меню', 'логотип', 'h1', 'h2', 'h3'] },
  { id: 'footer', words: ['підвал', 'footer', 'контакти сайту'] },
  { id: 'domain', words: ['домен', 'адрес', 'url', 'сервер', 'хостинг', 'браузер', 'клієнт', 'http'] },
  { id: 'file-link', words: ['style.css', 'script.js', 'link rel', 'index.html', "зв'язати файли", 'три файли', 'підключення файл'] },
  { id: 'git', words: ['git init', 'git add', 'git commit', 'git log', 'git branch', 'git checkout', 'git merge', 'git diff', 'git push', 'git pull', 'git clone', 'git stash', 'git rebase', '.gitignore', 'репозиторі', 'pull request'] },
  { id: 'terminal', words: ['shell:', 'термінал', 'командний рядок', 'у консолі', 'cd —', 'touch —', 'cat —', 'rm —', 'chmod', 'розбір команд', 'текстовий інтерфейс'] },
  { id: 'container', words: ['docker'] },
  { id: 'box-model', words: ['box model', 'box-sizing', 'border-radius', 'border і border', 'display: block', '::before', '::after', 'кольори та одиниці виміру'] },
  { id: 'flexbox', words: ['flexbox', 'flex-grow', 'flex-shrink', 'flex-basis', 'flex-wrap'] },
  { id: 'position', words: ['позиціонування', 'position: static', 'position absolute', 'position fixed', 'position sticky', 'overflow та прокрутк'] },
  { id: 'shadow', words: ['box-shadow', 'text-shadow', 'тіні:'] },
  { id: 'responsive', words: ['медіазапит', 'media query', 'mobile-first', 'viewport units', 'адаптивності'] },
  { id: 'text-emphasis', words: ['смислові акценти', 'strong, em', 'small, del, ins', 'abbr і атрибут', 'коментарі в html'] },
  { id: 'seo-meta', words: ['seo та head', 'meta description', 'open graph', 'мета-теги'] },
  { id: 'media-player', words: ['audio і video', '<audio', '<video'] },
  { id: 'dom-tree', words: ['queryselector', 'createelement', 'element.style', 'innerhtml', 'textcontent', 'парсер', 'тег зараз обробляється', 'текст усередині тега', 'main, section, article', 'data-*, tabindex', 'блокові й рядкові'] },
  { id: 'file-io', words: ['запис файл', 'читання файл', 'json-файл', 'shutil.move', 'os.path', 'збереження бази у файл', 'завантаження бази з файл', 'резервна копія', 'лог-файл', 'дозапис', 'режим append', 'видалення файлів', 'сортування... папку', 'підсумковий звіт', 'сортування одного файлу'] },
  { id: 'http-request', words: ['обробник запиту', 'handler', 'get /', 'put /', 'delete /', 'delete:', '404 not found', 'диспетчериз', 'rest-конвенці', 'middleware'] },
  { id: 'auth-security', words: ['парол', 'хешуван', 'токен', 'авторизац', 'автентифікац', '401 unauthorized', '403 forbidden', 'систему дозволів', 'шифруван', 'сіль (salt)', 'checksum', 'підроблен', 'реєстрація користувача', 'реєстрація й вхід', 'authservice', 'require_auth', 'захищений', 'захищений маршрут', 'захищений обробник', 'контроль доступу', 'грубою силою', 'санітизаці', 'маскування', 'підозрілої активності', 'логування підозрілої', "прив'язка задач", 'журналювання дій'] },
  { id: 'stats-math', words: ['середнє значення', 'медіана', 'мода:', 'стандартне відхилен', 'кореляц', 'похибка', 'статистик', 't-статистик', 'монте-карло', 'мінімум і максимум', 'пропущені значення', 'групування з підрахунком', 'топ-категорія', 'сортування за кількома', 'частка від загального', 'текстового звіту', 'звіту у файл', 'стандартизаці', 'z-score', 'регресі', 'residuals', 'rmse', 'r²', 'евклідов', 'тренувальні й тестові', 'агрегований звіт', 'табличних даних', 'head() і стовпці', 'фільтрація рядків за умовою', 'кінематика', 'траєкторі', 'дальність польоту', 'максимальна висота', 'перетворення одиниць виміру', 'проти сімпсона', 'методу бісекції', 'вплив кута'] },
  { id: 'ml-model', words: ['k-nn', 'k-means', 'центроїд', 'градієнт', 'логістичної регресії', 'confusion matrix', 'accuracy:', 'precision і recall', 'decision boundary', 'нормалізація ознак', 'оцінка моделі'] },
  { id: 'monitoring', words: ['health check', 'моніторинг', 'ротація логів', 'відкат при', 'масштабован', 'сповіщен', 'резервне копіювання файлів', 'розгортання:', 'версій залежностей', 'валідація конфігурації'] },
  { id: 'type-system', words: ['interface:', 'discriminated union', 'intersection type', 'utility types', 'readonly та', 'перші типи'] },
  { id: 'game-loop', words: ['game.render', 'game.step', 'зіткненн', 'напрямок руху', 'зростання: не прибирати', 'список координат', 'рендер на кожному кроці', 'збіг позицій', 'перевірка збіг'] },
  { id: 'ui-component', words: ['usestate', 'useref', 'usereducer', "props.children", 'fragment:', 'context:', 'app.render', 'синхронізована зі станом', 'increment оновлює'] },
  // Поняття, спільні для Python/JS/SQL/Backend-курсів — щоб огляд пояснював
  // суть уроку, а не показував одну й ту саму картинку для всього не-HTML.
  { id: 'function', words: ['функці', 'def ', 'function', 'метод(', 'метод ', 'виклик функці', 'параметр', 'аргумент', 'return ', 'spread та rest', 'spread', 'rest оператор'] },
  { id: 'loop', words: ['цикл', 'for ', 'while ', 'ітера', 'перебира', 'перебір', 'enumerate', 'transition:', '@keyframes', 'keyframe-анімаці', 'debounce'] },
  { id: 'conditional', words: ['умовна конструкці', 'if ', 'else', 'розгалужен', 'перевірка умови', 'якщо виконується', 'логічні оператори', 'tobetruthy', 'tobefalsy', 'tobenull', 'arrange-act-assert', 'beforeeach'] },
  { id: 'variable', words: ['змінна', 'змінну', 'змінні', 'змінною', 'присвою', 'оголошення змінної'] },
  { id: 'dict-object', words: ['словник', 'ключ-значення', 'пара ключ', 'dictionary', 'json-об\'єкт', 'властивості об\'єкта', 'об\'єкти: основи'] },
  { id: 'class-oop', words: ['клас ', 'класу', 'класи', 'екземпляр', 'конструктор', 'успадкуван', 'self.', '__str__', 'інкапсуляці', '@property'] },
  { id: 'exception', words: ['виняток', 'винятк', 'помилку', 'try', 'except', 'обробка помилок'] },
  { id: 'string', words: ['рядок', 'рядка', 'рядки', 'рядком', 'текстовий рядок', 'конкатенац', 'символ рядка'] },
  { id: 'number', words: ['число', 'числа', 'математичн', 'обчислен', 'арифметич', 'округлен'] },
  { id: 'module', words: ['модул', 'імпорт', 'import ', 'бібліотек', 'пакет коду'] },
  { id: 'text', words: ['абзац', 'параграф', 'текст сторінки', 'речення'] },
]

function detectFocus(text, lessonType) {
  // English for IT — кожен урок це "термін: переклад/значення" з будь-якого
  // домену (Git, Python, SQL, Backend...). Ключові слова домену там часто
  // випадково збігаються з чужим фокусом (напр. "JS: prototype" схоже на
  // форму) — картка-переклад завжди точніша, ніж вгадування за словами.
  if (lessonType === 'vocab') return 'vocabulary'
  const norm = (text || '').toLowerCase()
  for (const rule of FOCUS_RULES) {
    if (rule.words.some((w) => norm.includes(w))) return rule.id
  }
  // Запасний варіант теж має відповідати курсу: розмітка html/head/body
  // доречна лише на HTML-курсі, для решти (Python/SQL/JS/CSS...) — нейтральна
  // картинка редактора коду без чужих тегів.
  return lessonType === 'html' ? 'html-doc' : 'generic-code'
}

// Короткий (~15с) анімований огляд уроку — портовано з DesignLab UA.
// БЕЗ жодного платного відео-API: збирається з уже наявних даних уроку
// (title/theory/presentation) і озвучується безкоштовним голосом сайту
// (Piper TTS, той самий, що й кнопка «Прослухати урок»). Працює однаково
// для будь-якого HTML-уроку без жодної ручної роботи.
function buildScenes(lesson) {
  const scenes = []
  const hook = (lesson.theory || '').match(/^.+?[.!?](?=\s|$)/)
  const hookText = hook ? hook[0].trim() : lesson.title
  scenes.push({ caption: hookText, focus: detectFocus(hookText + ' ' + lesson.title, lesson.type) })
  for (const slide of (lesson.presentation || []).slice(1, 3)) {
    if (slide.points && slide.points[0]) {
      scenes.push({ caption: slide.points[0], focus: detectFocus(slide.points[0] + ' ' + (slide.title || ''), lesson.type) })
    }
  }
  return scenes
}

// Рамка вікна браузера — однакова для всіх фокусів, для впізнаваності.
function Frame({ children }) {
  return (
    <svg viewBox="0 0 200 260" className="w-[78%] h-auto">
      <rect x="10" y="10" width="180" height="240" rx="10" fill="#1c1917" stroke="#44403c" />
      <rect x="10" y="10" width="180" height="26" rx="10" fill="#292524" />
      <circle cx="24" cy="23" r="4" fill="#f87171" />
      <circle cx="38" cy="23" r="4" fill="#fbbf24" />
      <circle cx="52" cy="23" r="4" fill="#4ade80" />
      <rect x="66" y="18" width="100" height="10" rx="5" fill="#44403c" />
      {children}
    </svg>
  )
}

function CodeMockup({ focus }) {
  if (focus === 'button') {
    return (
      <Frame>
        <rect x="20" y="50" width="160" height="80" rx="4" fill="#292524" />
        <rect x="55" y="140" width="90" height="38" rx="19" fill="#4ade80" />
        <text x="72" y="164" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#1c1917">Кнопка</text>
        <path d="M 150 155 L 168 168 L 158 170 L 163 182 L 156 185 L 151 173 L 143 180 Z" fill="#fbbf24" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
      </Frame>
    )
  }
  if (focus === 'image') {
    return (
      <Frame>
        <rect x="30" y="60" width="140" height="110" rx="6" fill="#292524" stroke="#57534e" />
        <circle cx="62" cy="90" r="10" fill="#fbbf24" />
        <path d="M 40 155 L 80 110 L 105 135 L 130 100 L 160 155 Z" fill="#57534e" />
        <rect x="55" y="188" width="90" height="10" rx="5" fill="#44403c" />
      </Frame>
    )
  }
  if (focus === 'link') {
    return (
      <Frame>
        <rect x="20" y="70" width="160" height="60" rx="4" fill="#292524" />
        <rect x="70" y="92" width="16" height="10" rx="5" fill="none" stroke="#4ade80" strokeWidth="4" />
        <rect x="82" y="102" width="16" height="10" rx="5" fill="none" stroke="#4ade80" strokeWidth="4" />
        <text x="55" y="160" fontFamily="monospace" fontSize="11" fill="#4ade80" textDecoration="underline">перейти за посиланням</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
      </Frame>
    )
  }
  if (focus === 'form') {
    return (
      <Frame>
        <rect x="30" y="54" width="140" height="22" rx="4" fill="#292524" stroke="#57534e" />
        <rect x="30" y="84" width="140" height="22" rx="4" fill="#292524" stroke="#57534e" />
        <rect x="30" y="114" width="140" height="34" rx="4" fill="#292524" stroke="#57534e" />
        <rect x="65" y="160" width="70" height="26" rx="13" fill="#4ade80" />
        <text x="80" y="177" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#1c1917">Надіслати</text>
      </Frame>
    )
  }
  if (focus === 'list') {
    return (
      <Frame>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <circle cx="38" cy={66 + i * 26} r="4" fill="#4ade80" />
            <rect x="50" y={61 + i * 26} width={110 - i * 15} height="9" rx="4" fill="#57534e" />
          </g>
        ))}
      </Frame>
    )
  }
  if (focus === 'table') {
    return (
      <Frame>
        <rect x="25" y="56" width="150" height="26" fill="#4ade80" opacity="0.85" />
        {[0, 1, 2].map((r) => (
          <rect key={r} x="25" y={82 + r * 24} width="150" height="24" fill={r % 2 === 0 ? '#292524' : '#1c1917'} stroke="#44403c" />
        ))}
        <line x1="75" y1="56" x2="75" y2="154" stroke="#44403c" />
        <line x1="125" y1="56" x2="125" y2="154" stroke="#44403c" />
      </Frame>
    )
  }
  if (focus === 'header') {
    return (
      <Frame>
        <rect x="20" y="46" width="160" height="30" rx="4" fill="#4ade80" opacity="0.85" />
        <circle cx="35" cy="61" r="7" fill="#1c1917" />
        <rect x="120" y="55" width="16" height="6" rx="3" fill="#1c1917" />
        <rect x="140" y="55" width="16" height="6" rx="3" fill="#1c1917" />
        <rect x="160" y="55" width="12" height="6" rx="3" fill="#1c1917" />
        <rect x="20" y="86" width="160" height="80" rx="4" fill="#292524" opacity="0.6" />
      </Frame>
    )
  }
  if (focus === 'footer') {
    return (
      <Frame>
        <rect x="20" y="50" width="160" height="120" rx="4" fill="#292524" opacity="0.4" />
        <rect x="20" y="182" width="160" height="40" rx="4" fill="#4ade80" opacity="0.85" />
        <circle cx="45" cy="202" r="6" fill="#1c1917" />
        <circle cx="65" cy="202" r="6" fill="#1c1917" />
        <circle cx="85" cy="202" r="6" fill="#1c1917" />
      </Frame>
    )
  }
  if (focus === 'domain') {
    return (
      <Frame>
        <rect x="24" y="52" width="152" height="24" rx="12" fill="#292524" stroke="#4ade80" strokeWidth="1.5" />
        <circle cx="40" cy="64" r="6" fill="none" stroke="#4ade80" strokeWidth="1.5" />
        <text x="54" y="68" fontFamily="monospace" fontSize="9" fill="#a8a29e">mysite.ua</text>
        <path d="M 100 100 L 100 130" stroke="#57534e" strokeWidth="2" />
        <path d="M 94 124 L 100 132 L 106 124" fill="none" stroke="#57534e" strokeWidth="2" />
        <rect x="70" y="130" width="60" height="44" rx="6" fill="#292524" stroke="#57534e" />
        <text x="80" y="156" fontFamily="monospace" fontSize="8" fill="#a8a29e">сервер</text>
      </Frame>
    )
  }
  if (focus === 'text') {
    return (
      <Frame>
        <text x="22" y="62" fontFamily="serif" fontSize="20" fill="#4ade80">¶</text>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="40" y={52 + i * 16} width={150 - (i === 4 ? 60 : 0)} height="8" rx="4" fill="#57534e" />
        ))}
      </Frame>
    )
  }
  if (focus === 'vocabulary') {
    return (
      <Frame>
        <rect x="30" y="50" width="140" height="54" rx="8" fill="#1c1917" stroke="#fbbf24" strokeWidth="2" />
        <text x="48" y="83" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#fbbf24">EN</text>
        <rect x="86" y="70" width="64" height="12" rx="4" fill="#44403c" />
        <path d="M 100 108 L 100 126 M 94 120 L 100 128 L 106 120" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="30" y="134" width="140" height="54" rx="8" fill="#1c1917" stroke="#4ade80" strokeWidth="2" />
        <text x="48" y="167" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#4ade80">UA</text>
        <rect x="86" y="154" width="64" height="12" rx="4" fill="#292524" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="22" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">термін → переклад і контекст</text>
      </Frame>
    )
  }
  if (focus === 'git') {
    return (
      <Frame>
        <circle cx="100" cy="60" r="10" fill="#1c1917" stroke="#4ade80" strokeWidth="2.5" />
        <path d="M 100 70 L 100 96" stroke="#57534e" strokeWidth="2.5" />
        <circle cx="100" cy="106" r="10" fill="#1c1917" stroke="#4ade80" strokeWidth="2.5" />
        <path d="M 100 116 L 100 142" stroke="#57534e" strokeWidth="2.5" />
        <circle cx="100" cy="152" r="10" fill="#1c1917" stroke="#fbbf24" strokeWidth="2.5" />
        <path d="M 100 106 L 150 130" stroke="#57534e" strokeWidth="2.5" />
        <circle cx="156" cy="136" r="10" fill="#1c1917" stroke="#60a5fa" strokeWidth="2.5" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="34" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">історія змін і гілки коду</text>
      </Frame>
    )
  }
  if (focus === 'terminal') {
    return (
      <Frame>
        <rect x="24" y="60" width="152" height="110" rx="6" fill="#0c0a09" stroke="#57534e" strokeWidth="1.5" />
        <text x="34" y="86" fontFamily="monospace" fontSize="11" fill="#4ade80">$</text>
        <rect x="48" y="78" width="90" height="10" rx="2" fill="#57534e" />
        <text x="34" y="112" fontFamily="monospace" fontSize="11" fill="#4ade80">$</text>
        <rect x="48" y="104" width="60" height="10" rx="2" fill="#57534e" />
        <text x="34" y="138" fontFamily="monospace" fontSize="11" fill="#4ade80">$</text>
        <rect x="48" y="130" width="3" height="12" fill="#4ade80" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="38" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">команди в командному рядку</text>
      </Frame>
    )
  }
  if (focus === 'container') {
    return (
      <Frame>
        <rect x="30" y="78" width="140" height="34" rx="6" fill="#292524" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
        <text x="46" y="100" fontFamily="monospace" fontSize="10" fill="#fbbf24">docker-compose</text>
        <path d="M 65 112 L 65 128 M 135 112 L 135 128" stroke="#57534e" strokeWidth="2" />
        <rect x="40" y="130" width="50" height="40" rx="4" fill="#1c1917" stroke="#60a5fa" strokeWidth="2" />
        <text x="52" y="154" fontFamily="monospace" fontSize="9" fill="#60a5fa">app</text>
        <rect x="110" y="130" width="50" height="40" rx="4" fill="#1c1917" stroke="#4ade80" strokeWidth="2" />
        <text x="118" y="154" fontFamily="monospace" fontSize="9" fill="#4ade80">db</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="24" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">кілька сервісів в одній системі</text>
      </Frame>
    )
  }
  if (focus === 'box-model') {
    return (
      <Frame>
        <rect x="26" y="56" width="148" height="128" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="30" y="68" fontFamily="monospace" fontSize="7" fill="#f87171">margin</text>
        <rect x="42" y="76" width="116" height="96" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="46" y="88" fontFamily="monospace" fontSize="7" fill="#fbbf24">border</text>
        <rect x="58" y="96" width="84" height="64" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 2" />
        <text x="62" y="108" fontFamily="monospace" fontSize="7" fill="#4ade80">padding</text>
        <rect x="74" y="116" width="52" height="30" fill="#60a5fa" opacity="0.6" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="22" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">шари навколо вмісту елемента</text>
      </Frame>
    )
  }
  if (focus === 'flexbox') {
    return (
      <Frame>
        <rect x="24" y="90" width="152" height="54" rx="6" fill="#1c1917" stroke="#57534e" strokeWidth="1.5" />
        <rect x="32" y="98" width="36" height="38" rx="4" fill="#4ade80" opacity="0.8" />
        <rect x="76" y="98" width="52" height="38" rx="4" fill="#fbbf24" opacity="0.8" />
        <rect x="136" y="98" width="30" height="38" rx="4" fill="#60a5fa" opacity="0.8" />
        <path d="M 24 158 L 176 158" stroke="#57534e" strokeWidth="1.5" />
        <path d="M 170 152 L 176 158 L 170 164" fill="none" stroke="#57534e" strokeWidth="1.5" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="18" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">елементи ділять простір у рядок</text>
      </Frame>
    )
  }
  if (focus === 'position') {
    return (
      <Frame>
        <rect x="34" y="70" width="120" height="100" rx="6" fill="#1c1917" stroke="#57534e" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x="46" y="86" width="60" height="36" rx="4" fill="#44403c" />
        <rect x="110" y="56" width="50" height="40" rx="4" fill="#fbbf24" stroke="#1c1917" strokeWidth="2" />
        <text x="116" y="80" fontFamily="monospace" fontSize="7" fontWeight="bold" fill="#1c1917">absolute</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="18" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">елемент виривається з потоку</text>
      </Frame>
    )
  }
  if (focus === 'shadow') {
    return (
      <Frame>
        <rect x="66" y="96" width="84" height="64" rx="8" fill="#000000" opacity="0.4" />
        <rect x="58" y="86" width="84" height="64" rx="8" fill="#1c1917" stroke="#fbbf24" strokeWidth="2" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="34" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">глибина через тінь</text>
      </Frame>
    )
  }
  if (focus === 'responsive') {
    return (
      <Frame>
        <rect x="30" y="70" width="60" height="100" rx="8" fill="#1c1917" stroke="#4ade80" strokeWidth="2" />
        <rect x="38" y="80" width="44" height="78" rx="2" fill="#292524" />
        <path d="M 94 120 L 106 120" stroke="#fbbf24" strokeWidth="2" />
        <rect x="110" y="86" width="70" height="50" rx="4" fill="#1c1917" stroke="#60a5fa" strokeWidth="2" />
        <rect x="116" y="92" width="58" height="38" rx="2" fill="#292524" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="18" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">той самий сайт на різних екранах</text>
      </Frame>
    )
  }
  if (focus === 'text-emphasis') {
    return (
      <Frame>
        <text x="30" y="90" fontFamily="serif" fontSize="18" fontWeight="bold" fill="#e7e5e4">Текст</text>
        <text x="30" y="122" fontFamily="serif" fontSize="18" fontStyle="italic" fill="#e7e5e4">Текст</text>
        <rect x="26" y="134" width="64" height="22" fill="#fbbf24" />
        <text x="30" y="151" fontFamily="serif" fontSize="18" fill="#1c1917">Текст</text>
        <text x="100" y="90" fontFamily="serif" fontSize="18" textDecoration="line-through" fill="#f87171">Текст</text>
        <text x="100" y="122" fontFamily="serif" fontSize="18" textDecoration="underline" fill="#4ade80">Текст</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="26" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">смисловий акцент у тексті</text>
      </Frame>
    )
  }
  if (focus === 'seo-meta') {
    return (
      <Frame>
        <rect x="24" y="64" width="152" height="86" rx="6" fill="#1c1917" stroke="#57534e" strokeWidth="1.5" />
        <circle cx="38" cy="80" r="6" fill="#4ade80" />
        <rect x="50" y="76" width="70" height="8" rx="3" fill="#57534e" />
        <rect x="32" y="96" width="120" height="12" rx="2" fill="#60a5fa" />
        <rect x="32" y="114" width="140" height="7" rx="2" fill="#44403c" />
        <rect x="32" y="126" width="110" height="7" rx="2" fill="#44403c" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="22" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">як сторінка виглядає в пошуку</text>
      </Frame>
    )
  }
  if (focus === 'media-player') {
    return (
      <Frame>
        <rect x="34" y="70" width="132" height="90" rx="8" fill="#1c1917" stroke="#57534e" strokeWidth="1.5" />
        <circle cx="100" cy="115" r="22" fill="#292524" stroke="#fbbf24" strokeWidth="2" />
        <path d="M 93 103 L 93 127 L 113 115 Z" fill="#fbbf24" />
        <rect x="34" y="166" width="132" height="6" rx="3" fill="#292524" />
        <rect x="34" y="166" width="50" height="6" rx="3" fill="#4ade80" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="30" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">аудіо чи відео просто в сторінці</text>
      </Frame>
    )
  }
  if (focus === 'dom-tree') {
    return (
      <Frame>
        <circle cx="100" cy="60" r="10" fill="#1c1917" stroke="#57534e" strokeWidth="2" />
        <path d="M 100 70 L 66 96 M 100 70 L 100 96 M 100 70 L 134 96" stroke="#57534e" strokeWidth="2" />
        <circle cx="66" cy="106" r="9" fill="#1c1917" stroke="#57534e" strokeWidth="2" />
        <circle cx="100" cy="106" r="9" fill="#1c1917" stroke="#fbbf24" strokeWidth="2.5" />
        <circle cx="134" cy="106" r="9" fill="#1c1917" stroke="#57534e" strokeWidth="2" />
        <path d="M 100 115 L 100 138" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="100" cy="148" r="9" fill="#1c1917" stroke="#fbbf24" strokeWidth="2.5" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="26" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">JS знаходить і змінює елемент</text>
      </Frame>
    )
  }
  if (focus === 'file-io') {
    return (
      <Frame>
        <path d="M 36 90 L 36 150 L 164 150 L 164 100 L 100 100 L 90 90 Z" fill="#292524" stroke="#fbbf24" strokeWidth="2" />
        <rect x="80" y="60" width="50" height="36" rx="3" fill="#1c1917" stroke="#4ade80" strokeWidth="2" />
        <rect x="88" y="68" width="34" height="5" fill="#4ade80" />
        <rect x="88" y="78" width="26" height="5" fill="#4ade80" opacity="0.6" />
        <path d="M 105 96 L 105 110 M 99 104 L 105 112 L 111 104" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="30" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">зберігає й читає з диска</text>
      </Frame>
    )
  }
  if (focus === 'http-request') {
    return (
      <Frame>
        <rect x="24" y="90" width="50" height="50" rx="6" fill="#1c1917" stroke="#60a5fa" strokeWidth="2" />
        <text x="34" y="119" fontFamily="monospace" fontSize="9" fill="#60a5fa">client</text>
        <rect x="126" y="90" width="50" height="50" rx="6" fill="#1c1917" stroke="#4ade80" strokeWidth="2" />
        <text x="134" y="119" fontFamily="monospace" fontSize="9" fill="#4ade80">server</text>
        <path d="M 76 104 L 124 104" stroke="#fbbf24" strokeWidth="2.5" />
        <path d="M 118 98 L 126 104 L 118 110" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
        <text x="82" y="100" fontFamily="monospace" fontSize="8" fill="#fbbf24">GET</text>
        <path d="M 124 130 L 76 130" stroke="#a8a29e" strokeWidth="2" />
        <path d="M 82 124 L 76 130 L 82 136" fill="none" stroke="#a8a29e" strokeWidth="2" />
        <text x="82" y="150" fontFamily="monospace" fontSize="8" fill="#a8a29e">200 OK</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="20" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">запит → відповідь сервера</text>
      </Frame>
    )
  }
  if (focus === 'auth-security') {
    return (
      <Frame>
        <rect x="68" y="110" width="64" height="56" rx="8" fill="#1c1917" stroke="#fbbf24" strokeWidth="2.5" />
        <path d="M 80 110 L 80 90 a 20 20 0 0 1 40 0 L 120 110" fill="none" stroke="#fbbf24" strokeWidth="5" />
        <circle cx="100" cy="134" r="7" fill="#fbbf24" />
        <rect x="97" y="138" width="6" height="16" fill="#fbbf24" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="30" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">захист доступу й даних</text>
      </Frame>
    )
  }
  if (focus === 'stats-math') {
    return (
      <Frame>
        <path d="M 30 180 L 170 180" stroke="#57534e" strokeWidth="2" />
        <path d="M 30 180 L 30 56" stroke="#57534e" strokeWidth="2" />
        <rect x="44" y="140" width="22" height="40" fill="#4ade80" />
        <rect x="76" y="110" width="22" height="70" fill="#fbbf24" />
        <rect x="108" y="90" width="22" height="90" fill="#60a5fa" />
        <rect x="140" y="130" width="22" height="50" fill="#f87171" />
        <path d="M 55 135 L 87 108 L 119 86 L 151 124" fill="none" stroke="#e7e5e4" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="20" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">числа розповідають історію даних</text>
      </Frame>
    )
  }
  if (focus === 'ml-model') {
    return (
      <Frame>
        <path d="M 30 180 L 170 180 M 30 180 L 30 56" stroke="#57534e" strokeWidth="2" />
        <path d="M 40 70 L 160 160" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 4" />
        <circle cx="60" cy="90" r="6" fill="#4ade80" />
        <circle cx="80" cy="70" r="6" fill="#4ade80" />
        <circle cx="100" cy="100" r="6" fill="#4ade80" />
        <circle cx="70" cy="150" r="6" fill="#f87171" />
        <circle cx="110" cy="160" r="6" fill="#f87171" />
        <circle cx="140" cy="140" r="6" fill="#f87171" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="22" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">модель вчиться розділяти дані</text>
      </Frame>
    )
  }
  if (focus === 'monitoring') {
    return (
      <Frame>
        <path d="M 50 130 A 50 50 0 0 1 150 130" fill="none" stroke="#292524" strokeWidth="10" />
        <path d="M 50 130 A 50 50 0 0 1 128 92" fill="none" stroke="#4ade80" strokeWidth="10" />
        <path d="M 100 130 L 128 98" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="130" r="6" fill="#fbbf24" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="18" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">стежить за станом системи</text>
      </Frame>
    )
  }
  if (focus === 'type-system') {
    return (
      <Frame>
        <rect x="34" y="92" width="60" height="36" rx="4" fill="#292524" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="48" y="115" fontFamily="monospace" fontSize="12" fill="#e7e5e4">age</text>
        <text x="98" y="115" fontFamily="monospace" fontSize="11" fill="#60a5fa">: number</text>
        <path d="M 50 128 L 50 140" stroke="#f87171" strokeWidth="2.5" />
        <text x="34" y="156" fontFamily="monospace" fontSize="10" fill="#f87171">"текст"? ✕</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="24" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">компілятор звіряє типи заздалегідь</text>
      </Frame>
    )
  }
  if (focus === 'game-loop') {
    return (
      <Frame>
        <rect x="40" y="60" width="120" height="120" fill="#1c1917" stroke="#57534e" strokeWidth="1.5" />
        {[1, 2, 3].map((i) => (
          <path key={'v' + i} d={`M ${40 + i * 30} 60 L ${40 + i * 30} 180`} stroke="#292524" strokeWidth="1" />
        ))}
        {[1, 2, 3].map((i) => (
          <path key={'h' + i} d={`M 40 ${60 + i * 30} L 160 ${60 + i * 30}`} stroke="#292524" strokeWidth="1" />
        ))}
        <rect x="100" y="90" width="28" height="28" fill="#4ade80" />
        <rect x="72" y="90" width="28" height="28" fill="#4ade80" opacity="0.5" />
        <rect x="44" y="90" width="28" height="28" fill="#4ade80" opacity="0.25" />
        <path d="M 72 104 L 50 104 M 56 98 L 50 104 L 56 110" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="20" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">кожен кадр оновлює позицію</text>
      </Frame>
    )
  }
  if (focus === 'ui-component') {
    return (
      <Frame>
        <rect x="30" y="70" width="70" height="56" rx="8" fill="#1c1917" stroke="#60a5fa" strokeWidth="2" />
        <text x="38" y="92" fontFamily="monospace" fontSize="9" fill="#60a5fa">Component</text>
        <circle cx="48" cy="108" r="6" fill="#fbbf24" />
        <text x="58" y="112" fontFamily="monospace" fontSize="8" fill="#fbbf24">state</text>
        <path d="M 104 98 L 128 98" stroke="#4ade80" strokeWidth="2.5" />
        <path d="M 122 92 L 130 98 L 122 104" fill="none" stroke="#4ade80" strokeWidth="2.5" />
        <rect x="132" y="78" width="40" height="40" rx="6" fill="#292524" stroke="#4ade80" strokeWidth="1.5" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="24" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">стан змінюється → екран оновлюється</text>
      </Frame>
    )
  }
  if (focus === 'function') {
    return (
      <Frame>
        <rect x="22" y="96" width="46" height="36" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
        <text x="36" y="119" fontFamily="monospace" fontSize="12" fill="#a8a29e">x</text>
        <path d="M 70 114 L 92 114 M 86 108 L 94 114 L 86 120" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="96" y="80" width="68" height="68" rx="10" fill="#1c1917" stroke="#4ade80" strokeWidth="2" />
        <text x="108" y="120" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#4ade80">f()</text>
        <path d="M 166 114 L 182 114 M 176 108 L 184 114 L 176 120" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="30" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">вхід → функція → результат</text>
      </Frame>
    )
  }
  if (focus === 'loop') {
    return (
      <Frame>
        <circle cx="100" cy="112" r="46" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="7 6" />
        <path d="M 100 64 L 108 76 L 92 76 Z" fill="#4ade80" />
        <rect x="78" y="96" width="44" height="32" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
        <text x="86" y="117" fontFamily="monospace" fontSize="10" fill="#fbbf24">i++</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="26" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">повторює дію для кожного</text>
      </Frame>
    )
  }
  if (focus === 'conditional') {
    return (
      <Frame>
        <path d="M 100 56 L 100 76" stroke="#57534e" strokeWidth="3" />
        <path d="M 68 92 L 100 68 L 132 92 L 100 116 Z" fill="#292524" stroke="#fbbf24" strokeWidth="2" />
        <text x="90" y="96" fontFamily="monospace" fontSize="10" fill="#fbbf24">if</text>
        <path d="M 100 116 L 62 146" stroke="#4ade80" strokeWidth="3" />
        <path d="M 100 116 L 138 146" stroke="#f87171" strokeWidth="3" />
        <rect x="32" y="146" width="58" height="26" rx="4" fill="#292524" stroke="#4ade80" strokeWidth="1.5" />
        <text x="46" y="163" fontFamily="monospace" fontSize="10" fill="#4ade80">так</text>
        <rect x="110" y="146" width="58" height="26" rx="4" fill="#292524" stroke="#f87171" strokeWidth="1.5" />
        <text x="128" y="163" fontFamily="monospace" fontSize="10" fill="#f87171">ні</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="24" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">вибір одного з двох шляхів</text>
      </Frame>
    )
  }
  if (focus === 'variable') {
    return (
      <Frame>
        <rect x="26" y="90" width="52" height="36" rx="4" fill="#292524" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="44" y="113" fontFamily="monospace" fontSize="14" fill="#fbbf24">x</text>
        <text x="86" y="113" fontFamily="monospace" fontSize="13" fill="#a8a29e">=</text>
        <rect x="112" y="90" width="58" height="36" rx="4" fill="#1c1917" stroke="#4ade80" strokeWidth="1.5" />
        <text x="134" y="113" fontFamily="monospace" fontSize="13" fill="#4ade80">5</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="22" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">змінна зберігає значення</text>
      </Frame>
    )
  }
  if (focus === 'dict-object') {
    return (
      <Frame>
        <rect x="26" y="56" width="148" height="128" rx="6" fill="#1c1917" stroke="#57534e" strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="36" y={70 + i * 36} width="52" height="22" rx="4" fill="#292524" />
            <text x="42" y={85 + i * 36} fontFamily="monospace" fontSize="8" fill="#fbbf24">ключ{i + 1}</text>
            <path d={`M 92 ${81 + i * 36} L 106 ${81 + i * 36}`} stroke="#57534e" strokeWidth="2" />
            <rect x="110" y={70 + i * 36} width="54" height="22" rx="4" fill="#1c1917" stroke="#4ade80" strokeWidth="1.5" />
            <text x="115" y={85 + i * 36} fontFamily="monospace" fontSize="8" fill="#4ade80">значення</text>
          </g>
        ))}
      </Frame>
    )
  }
  if (focus === 'class-oop') {
    return (
      <Frame>
        <rect x="55" y="48" width="90" height="48" rx="6" fill="#1c1917" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 3" />
        <text x="70" y="77" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#fbbf24">Клас</text>
        <path d="M 70 98 L 45 128 M 100 98 L 100 128 M 130 98 L 155 128" stroke="#57534e" strokeWidth="2" />
        <circle cx="45" cy="140" r="14" fill="#292524" stroke="#4ade80" strokeWidth="2" />
        <circle cx="100" cy="140" r="14" fill="#292524" stroke="#4ade80" strokeWidth="2" />
        <circle cx="155" cy="140" r="14" fill="#292524" stroke="#4ade80" strokeWidth="2" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="22" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">клас → декілька своїх об'єктів</text>
      </Frame>
    )
  }
  if (focus === 'exception') {
    return (
      <Frame>
        <path d="M 100 54 L 142 128 L 58 128 Z" fill="#292524" stroke="#f87171" strokeWidth="2.5" strokeLinejoin="round" />
        <text x="94" y="114" fontFamily="monospace" fontSize="22" fontWeight="bold" fill="#f87171">!</text>
        <path d="M 68 148 Q 100 170 132 148" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="18" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">помилку перехоплено й оброблено</text>
      </Frame>
    )
  }
  if (focus === 'string') {
    return (
      <Frame>
        {['П', 'р', 'и', 'в', 'і', 'т'].map((ch, i) => (
          <g key={i}>
            <rect x={24 + i * 24} y="92" width="20" height="26" rx="3" fill="#292524" stroke="#4ade80" strokeWidth="1.5" />
            <text x={30 + i * 24} y="110" fontFamily="monospace" fontSize="11" fill="#4ade80">{ch}</text>
          </g>
        ))}
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="18" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">рядок — послідовність символів</text>
      </Frame>
    )
  }
  if (focus === 'number') {
    return (
      <Frame>
        <rect x="40" y="50" width="120" height="30" rx="4" fill="#1c1917" stroke="#57534e" strokeWidth="1.5" />
        <text x="148" y="71" fontFamily="monospace" fontSize="14" fill="#4ade80" textAnchor="end">12</text>
        <rect x="40" y="92" width="34" height="30" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
        <text x="52" y="112" fontFamily="monospace" fontSize="12" fill="#e7e5e4">7</text>
        <rect x="83" y="92" width="34" height="30" rx="4" fill="#292524" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="95" y="112" fontFamily="monospace" fontSize="12" fill="#fbbf24">+</text>
        <rect x="126" y="92" width="34" height="30" rx="4" fill="#292524" stroke="#57534e" strokeWidth="1.5" />
        <text x="138" y="112" fontFamily="monospace" fontSize="12" fill="#e7e5e4">5</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="26" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">обчислення над числами</text>
      </Frame>
    )
  }
  if (focus === 'module') {
    return (
      <Frame>
        <rect x="80" y="70" width="80" height="70" rx="6" fill="#1c1917" stroke="#57534e" strokeWidth="1.5" />
        <text x="92" y="110" fontFamily="monospace" fontSize="10" fill="#a8a29e">main.py</text>
        <rect x="24" y="88" width="48" height="34" rx="6" fill="#292524" stroke="#4ade80" strokeWidth="2" />
        <text x="30" y="109" fontFamily="monospace" fontSize="9" fill="#4ade80">import</text>
        <path d="M 74 105 L 86 105 M 80 99 L 88 105 L 80 111" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="18" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">підключає готовий код ззовні</text>
      </Frame>
    )
  }
  if (focus === 'file-link') {
    return (
      <Frame>
        <rect x="20" y="50" width="48" height="34" rx="4" fill="#292524" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="28" y="71" fontFamily="monospace" fontSize="9" fill="#fbbf24">.html</text>
        <rect x="20" y="96" width="48" height="34" rx="4" fill="#292524" stroke="#4ade80" strokeWidth="1.5" />
        <text x="32" y="117" fontFamily="monospace" fontSize="9" fill="#4ade80">.css</text>
        <rect x="20" y="142" width="48" height="34" rx="4" fill="#292524" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="34" y="163" fontFamily="monospace" fontSize="9" fill="#60a5fa">.js</text>
        <path d="M 70 67 L 98 100" stroke="#fbbf24" strokeWidth="2" />
        <path d="M 70 113 L 98 108" stroke="#4ade80" strokeWidth="2" />
        <path d="M 70 159 L 98 118" stroke="#60a5fa" strokeWidth="2" />
        <rect x="100" y="70" width="76" height="76" rx="10" fill="#1c1917" stroke="#a8a29e" strokeWidth="2" />
        <text x="114" y="113" fontFamily="monospace" fontSize="11" fill="#e7e5e4">сайт</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" opacity="0.5" />
        <text x="24" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">три файли → одна сторінка</text>
      </Frame>
    )
  }
  if (focus === 'html-doc') {
    return (
      <Frame>
        <text x="22" y="56" fontFamily="monospace" fontSize="9" fill="#fbbf24">&lt;html&gt;</text>
        <text x="30" y="70" fontFamily="monospace" fontSize="9" fill="#fbbf24">&lt;head&gt;</text>
        <rect x="38" y="76" width="70" height="7" rx="3" fill="#57534e" />
        <text x="30" y="98" fontFamily="monospace" fontSize="9" fill="#fbbf24">&lt;/head&gt;</text>
        <text x="30" y="112" fontFamily="monospace" fontSize="9" fill="#fbbf24">&lt;body&gt;</text>
        <rect x="38" y="118" width="110" height="7" rx="3" fill="#78716c" />
        <rect x="38" y="130" width="90" height="7" rx="3" fill="#78716c" />
        <rect x="38" y="142" width="50" height="10" rx="5" fill="#4ade80" opacity="0.8" />
        <text x="30" y="168" fontFamily="monospace" fontSize="9" fill="#fbbf24">&lt;/body&gt;</text>
        <text x="22" y="182" fontFamily="monospace" fontSize="9" fill="#fbbf24">&lt;/html&gt;</text>
        <rect x="20" y="196" width="160" height="34" rx="4" fill="#292524" />
        <text x="30" y="217" fontFamily="monospace" fontSize="8" fill="#a8a29e">Результат у браузері ↓</text>
      </Frame>
    )
  }
  // Запасний варіант для будь-якого іншого курсу (Python, SQL, JS, CSS...) —
  // загальний редактор коду з консоллю, без чужорідних HTML-тегів.
  return (
    <Frame>
      <rect x="22" y="48" width="36" height="8" rx="4" fill="#fbbf24" />
      <rect x="62" y="48" width="54" height="8" rx="4" fill="#78716c" />
      <rect x="30" y="64" width="120" height="8" rx="4" fill="#78716c" />
      <rect x="30" y="80" width="90" height="8" rx="4" fill="#4ade80" />
      <rect x="22" y="104" width="30" height="8" rx="4" fill="#fbbf24" />
      <rect x="56" y="104" width="70" height="8" rx="4" fill="#78716c" />
      <rect x="30" y="120" width="60" height="8" rx="4" fill="#78716c" />
      <rect x="20" y="150" width="160" height="70" rx="4" fill="#0c0a09" stroke="#44403c" />
      <text x="30" y="168" fontFamily="monospace" fontSize="10" fill="#4ade80">&gt;</text>
      <rect x="42" y="162" width="100" height="8" rx="4" fill="#57534e" />
      <rect x="30" y="182" width="130" height="8" rx="4" fill="#57534e" opacity="0.6" />
      <text x="30" y="212" fontFamily="monospace" fontSize="8" fill="#a8a29e">Результат ↓</text>
    </Frame>
  )
}

export default function LessonReel({ lesson }) {
  const scenes = buildScenes(lesson)
  const [state, setState] = useState('idle') // idle | loading | playing | done
  const [sceneIndex, setSceneIndex] = useState(0)
  const [voiceOn, setVoiceOn] = useState(true)
  const audioRef = useRef(null)
  const blobUrlRef = useRef(null)
  const requestIdRef = useRef(0)
  const timeoutRef = useRef(null)
  // playScene читає ЦЕ, а не параметр функції чи замкнене значення стану —
  // інакше кнопка звуку, натиснута ПІД ЧАС відтворення, ніяк не впливала б
  // на наступні сцени (voiceOn із замикання застиг би на моменті старту).
  const voiceOnRef = useRef(true)

  function cleanup() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.onended = null; audioRef.current = null }
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
  }

  useEffect(() => () => cleanup(), [])

  // Кнопка звуку працює в будь-який момент, і навіть коли аудіо вже
  // грає — миттєво вмикає/вимикає його через .muted, без перезапуску сцени.
  function toggleVoice() {
    setVoiceOn((v) => {
      const next = !v
      voiceOnRef.current = next
      if (audioRef.current) audioRef.current.muted = !next
      return next
    })
  }

  async function playScene(i, myId) {
    if (i >= scenes.length) {
      if (myId === requestIdRef.current) { setState('done'); cleanup() }
      return
    }
    setSceneIndex(i)

    if (!voiceOnRef.current) {
      setState('playing')
      timeoutRef.current = setTimeout(() => { if (myId === requestIdRef.current) playScene(i + 1, myId) }, readingDuration(scenes[i].caption))
      return
    }

    setState('loading')
    try {
      const blob = await withTimeout(synthesizeSpeechWav(scenes[i].caption))
      if (myId !== requestIdRef.current) return
      cleanup()
      const url = URL.createObjectURL(blob)
      blobUrlRef.current = url
      const audio = new Audio(url)
      audio.muted = !voiceOnRef.current
      audioRef.current = audio
      audio.onended = () => { if (myId === requestIdRef.current) playScene(i + 1, myId) }
      audio.onerror = () => { if (myId === requestIdRef.current) playScene(i + 1, myId) }
      await audio.play()
      if (myId !== requestIdRef.current) return
      setState('playing')
    } catch {
      if (myId !== requestIdRef.current) return
      setState('playing')
      timeoutRef.current = setTimeout(() => { if (myId === requestIdRef.current) playScene(i + 1, myId) }, 2500)
    }
  }

  function start() {
    const myId = ++requestIdRef.current
    voiceOnRef.current = voiceOn
    playScene(0, myId)
  }

  function stop() {
    requestIdRef.current += 1
    cleanup()
    setState('idle')
    setSceneIndex(0)
  }

  if (scenes.length === 0) return null
  const scene = scenes[Math.min(sceneIndex, scenes.length - 1)]
  const isActive = state === 'playing' || state === 'loading'

  return (
    <div className="mb-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">🎬 Короткий огляд</div>
      <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-lg bg-stone-950 border border-stone-800 overflow-hidden flex items-center justify-center">
        <CodeMockup focus={isActive ? scene.focus : (scenes[0]?.focus || 'code')} />

        {isActive ? (
          <div className="absolute left-0 right-0 bottom-9 px-3.5">
            <p className="bg-black bg-opacity-80 text-white font-semibold text-[13px] leading-snug px-3 py-2.5 rounded-lg text-center">{scene.caption}</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-stone-950 bg-opacity-40">
            <p className="text-white font-bold text-[15px] leading-snug" style={{ textShadow: '0 1px 4px rgba(0,0,0,.6)' }}>{lesson.title}</p>
          </div>
        )}

        {isActive && (
          <div className="absolute left-0 right-0 bottom-3 flex justify-center gap-1.5">
            {scenes.map((_, i) => (
              <span key={i} className={'w-[18px] h-[3px] rounded-sm ' + (i === sceneIndex ? 'bg-amber-400' : i < sceneIndex ? 'bg-white/60' : 'bg-white/25')} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center gap-3 flex-wrap">
        <button
          onClick={toggleVoice}
          title={voiceOn ? 'Вимкнути звук' : 'Увімкнути звук'}
          aria-label={voiceOn ? 'Вимкнути звук' : 'Увімкнути звук'}
          className="px-2.5 py-1.5 border border-stone-700 hover:bg-stone-900 text-stone-300 rounded-md text-sm"
        >
          {voiceOn ? '🔊' : '🔇'}
        </button>
        {!isActive && state !== 'done' && (
          <button onClick={start} className="px-3 py-1.5 bg-amber-400 hover:opacity-90 text-stone-950 font-medium rounded-md text-sm">▶ Переглянути огляд</button>
        )}
        {state === 'done' && (
          <button onClick={start} className="px-3 py-1.5 border border-stone-700 hover:bg-stone-900 text-stone-300 rounded-md text-sm">↻ Переглянути ще раз</button>
        )}
        {isActive && (
          <button onClick={stop} className="px-3 py-1.5 border border-stone-700 hover:bg-stone-900 text-stone-300 rounded-md text-sm">⏹ Зупинити</button>
        )}
      </div>
    </div>
  )
}
