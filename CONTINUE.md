# CONTINUE.md — передача проєкту в Claude Code

Цей файл — інструкція для Claude Code (чи будь-кого, хто продовжує), щоб одразу
зрозуміти стан проєкту й що робити далі, без повторного пояснення від нуля.

## Що це за проєкт

**00100101** — українська навчальна платформа програмування (React + Vite).
Живе в `src/App.jsx` — один великий файл з усіма даними й компонентами
(навмисно, для простоти перегляду; можна розбити на модулі пізніше).

Запуск: `npm install && npm run dev`

## Поточний стан (станом на цю передачу)

- **Курси з реальною перевіркою**: HTML (15), CSS (9), JavaScript (9),
  English for IT (10) — теорія → приклад → завдання → перевірка коду.
- **Бібліотека**: 5 розділів (HTML 27, CSS 23, JS 22, Python 12, SQL 12) —
  компактні картки {name, desc, syntax, attrs, pitfalls}.
- **Шпаргалки**: 10 категорій (JS/CSS/HTML/Git/Термінал/HTTP/Regex/VS
  Code/Python/SQL) — щільні таблиці [термін, опис].
- **Символи**: ~95 унікальних символів, плитковий вигляд.
- **TERM_GUIDES** (34 записи) — середній формат: заголовок, "Просто кажучи",
  3-5 пронумерованих кроків (код + текстовий результат), "Де використовують".
  Список id: `js-promise, css-grid, git-merge-conflict, terminal-grep,
  http-cors, regex-flags, vscode-command-palette, py-try-except,
  sql-groupby, html-img, js-reduce, css-position, html-table, git-rebase,
  terminal-chmod, http-put-patch, regex-lookahead, vscode-multicursor,
  py-comprehension, sql-join, html-input, html-label, html-list,
  html-header, html-nav, html-main, html-footer, html-section, js-array,
  js-object, css-flexbox, html-form, py-list, sql-select`
- **TERM_PAGES_V2** (127 записів: 117 HTML + 10 CSS) — НАЙБАГАТШИЙ формат:
  бічна навігація, badge+назва, "Що це", "Для чого", синтаксис, таблиця
  атрибутів, **живий iframe-приклад** (реальний HTML+CSS+JS, що виконується),
  типові помилки, пов'язані елементи.
  - **HTML — повністю завершено** (117 записів, усе з попереднього
    бэклогу додано): форми/input-типи, семантика, списки, таблиці, медіа,
    структура документа (html/head/title/meta/...), текстова семантика
    (b/i/small/abbr/cite/time/...), медіа/вбудований вміст
    (iframe/figure/map/...), інтерактивність (dialog/details/canvas/svg),
    a/div/span/menu, і застарілі теги компактно з приміткою "уникай".
  - **CSS — розпочато** (10 записів, id з префіксом `css-`): css-selectors,
    css-box-model, css-flexbox, css-grid, css-pseudo-classes,
    css-pseudo-elements, css-colors-gradients, css-transform,
    css-animation-transition, css-at-rules. Кожен термін групує споріднені
    властивості (напр. `css-animation-transition` = і transition, і
    animation+@keyframes разом), як і радив попередній автор цього файлу.
    **Наступний крок**: розширити CSS-розділ — одиниці виміру (px/%/rem/vw),
    position, overflow, display (block/inline/none), text-властивості
    (font, line-height, text-align), background-властивості окремо від
    градієнтів, filter/backdrop-filter, custom properties (--змінні, var()),
    calc()/clamp(), логічні властивості (margin-inline тощо).

## Точна схема TERM_PAGES_V2 (найважливіший формат — саме його хоче користувач для всього)

```js
termId: {
  badge: "HTML",                    // мова/технологія
  title: '<input type="range">',    // назва, як показується заголовком
  whatIsIt: "Розгорнутий опис абзацом.",
  useCases: ["варіант 1", "варіант 2", "варіант 3"],
  syntax: `<приклад синтаксису>`,
  attributes: [
    { name: "min", desc: "опис атрибута" },
    // ...
  ],
  example: `<!-- повний робочий HTML+CSS+JS приклад -->
<label for="x">...</label>
<input ...>
<script>
  // реальний JS, що робить приклад інтерактивним
<\/script>`,                        // УВАГА: </script> у прикладі треба писати як <\/script>,
                                     // інакше зламає babel-парсинг рядка в самому App.jsx
  pitfalls: ["типова помилка 1", "типова помилка 2"],
  related: ["input", "label", "form"],
},
```

Після додавання нового терміна **обов'язково** додай його id у відповідну
групу `REF_NAV` (на початку файлу, поруч із `TERM_PAGES_V2`), інакше він не
з'явиться в бічній панелі:

```js
const REF_NAV = {
  "Форми": [...],
  "Типи input": [...],
  "Семантика": [...],
  "Списки": [...],
  "Таблиці": [...],
  "Медіа": [...],
  "Текст": [...],
  // додай нову групу сюди, якщо термін не влазить у наявні
};
```

## Що робити далі — backlog (з документів користувача)

Користувач дав повний список HTML5/CSS/JS/Python/SQL/Frontend/Backend
термінів і хоче **всі** їх у форматі TERM_PAGES_V2. Пріоритет: спочатку
дописати HTML повністю (✅ зроблено), потім по черзі інші розділи.

### HTML — ✅ завершено
Усі 117 термінів із попереднього бэклогу додані (структурні/службові
теги, текстова семантика, медіа/вбудований вміст, інтерактивність,
a/div/span/menu, застарілі теги). Глобальні атрибути й ARIA лишаються
лише в Шпаргалках (HTML → "Глобальні атрибути" / "ARIA"), не дублюються
в TERM_PAGES_V2 — так і планувалось.

### CSS — 🔶 у процесі (10 з ~orientovno 20-30 групованих термінів)
Уже зроблено (див. вище, id з префіксом `css-`): селектори, box model,
flexbox, grid, псевдокласи, псевдоелементи, кольори/градієнти, transform,
transition+animation, @-правила.

Залишилось (групувати споріднені властивості в один термін, як і раніше):
- одиниці виміру (px, %, rem, em, vw/vh, ch)
- position (static/relative/absolute/fixed/sticky) — детально, з живим
  демо кожного значення
- display (block/inline/inline-block/none) і overflow (visible/hidden/scroll/auto)
- текстові властивості (font-family/size/weight, line-height, text-align,
  letter-spacing, text-transform, white-space)
- background окремо від градієнтів (background-image/position/size/repeat)
- filter/backdrop-filter (blur, brightness, drop-shadow...)
- custom properties: `--змінна` і `var()`
- функції: `calc()`, `clamp()`, `min()`, `max()`
- логічні властивості (margin-inline, padding-block тощо) — компактно,
  можна одним терміном
- object-fit/object-position для медіа

Джерело — повний список властивостей у документах користувача (дуже
довгий, ~250 властивостей — не обов'язково кожна окремим live-демо).

### Наступні розділи (створити новий REF_NAV-розділ на кожен, за тим самим шаблоном)
- **JavaScript**: оператори, масиви/рядки/об'єкти методи, DOM API, events,
  Promise/async, класи, регулярні вирази.
- **Python**: keywords, вбудовані функції, магічні методи, стандартна
  бібліотека.
- **SQL**: команди, JOIN-и, віконні функції, типи даних PostgreSQL.
- **SVG**: елементи (`circle, rect, path, line, polygon, g, defs, use,
  linearGradient...`) і атрибути (`viewBox, fill, stroke, transform...`).
- **Backend/Node.js**: Express, middleware, JWT, bcrypt, ORM концепції —
  цього розділу в проєкті взагалі ще немає, доведеться створити з нуля
  (новий курс і/або нову категорію шпаргалки/довідника).
- **Frontend-екосистема**: React hooks (уже часково в Бібліотеці, не в
  TERM_PAGES_V2), Vue/Angular/Svelte/build tools — здебільшого це власні
  назви інструментів, не потребують детального "як писати", радше короткий
  каталог-довідник (див. чат: користувачці запропоновано окремий формат
  "просто список" для екосистемних назв без глибокого пояснення).

## Як перевіряти синтаксис без npm (корисно перед кожним комітом)

Файл дуже великий (JSX), тому `node --check` напряму не працює через JSX.
Технніка, яку я використовувала — обрізати ES-import рядки, замінити
іконки-заглушками, і перевірити лише секцію з даними (до першого JSX):

```bash
sed -e '1,6d' -e 's/^export default //' src/App.jsx > /tmp/check.js
sed -i '1i const React = {}; const useState=()=>{}, useEffect=()=>{}, useRef=()=>{}, useMemo=()=>{}, useCallback=()=>{};' /tmp/check.js
node --check /tmp/check.js
```

Очікувана помилка — `Unexpected token '<'` десь у районі функції `Logo`
(перше місце, де починається JSX). Якщо помилка з'явилась РАНІШЕ цього
місця — є справжня синтаксична помилка в даних, яку треба виправити.

Ще краще (якщо в Claude Code є мережа) — просто `npm run build`, яке
використовує справжній Vite/Babel і покаже точну помилку з номером рядка.

## Технічне обмеження, яке варто знати

Прогрес зберігається в `localStorage` браузера — персонально для кожного
пристрою, не синхронізується. Реальний бекенд/БД — поза межами цього
середовища (немає мережі для встановлення сервера), тому це свідомо
клієнтський застосунок.
