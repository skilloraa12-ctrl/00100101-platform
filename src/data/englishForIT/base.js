// eng-1 through eng-10 — the original English for IT lessons, unchanged.
// Kept isolated in its own module so the rest of the course (Python, SQL,
// Backend, Frontend, Full Stack, HTML, CSS, JavaScript) can be added without
// ever touching this file.
export const BASE_LESSONS = [
  {
    id: "eng-1",
    title: "Змінні та функції",
    theory:
      "variable (змінна), function (функція), array (масив), object (об'єкт) — чотири слова, які ти зустрінеш у першому ж рядку будь-якої документації. Читаючи код чи туторіал англійською, спочатку впізнавай ці базові іменники — решта тексту стає зрозумілішою навколо них.",
    example: { code: `// "Declare a variable to store the function's result."`, explain: "«Оголоси змінну, щоб зберегти результат функції» — типове речення з документації." },
    task: 'Введи український переклад слова "variable".',
    type: "vocab",
    accepted: ["змінна"],
    hints: ['Це слово ти вже бачила в уроках JavaScript.', 'Так називають те, що зберігає значення і може змінюватись.'],
    solution: "змінна",
  },
  {
    id: "eng-2",
    title: "Помилки та баги",
    theory:
      "bug (баг, дефект у коді), error (помилка), warning (попередження — не завжди критичне), exception (виняток — помилка, яку можна «зловити» й обробити). Розрізняй error і warning: перше зазвичай зупиняє виконання, друге — просто попереджає.",
    example: { code: `console.warn("Deprecated function used"); // попередження, код працює далі`, explain: "warn не зупиняє програму, на відміну від необробленої помилки." },
    task: 'Введи український переклад слова "bug".',
    type: "vocab",
    accepted: ["баг", "дефект", "баг / дефект", "баг (дефект)"],
    hints: ["Це слово вже усталене в українській розмовній технічній мові.", "Пишеться майже так само, як звучить англійською."],
    solution: "баг",
  },
  {
    id: "eng-3",
    title: "Умови та цикли",
    theory:
      "loop (цикл — повторення дій), condition (умова), boolean (логічний тип true/false), string (рядок, текстовий тип). Ці слова описують базові конструкції будь-якої мови програмування, не лише JS.",
    example: { code: `// "Use a loop to repeat the action until the condition is false."`, explain: "«Використай цикл, щоб повторювати дію, поки умова хибна.»" },
    task: 'Введи український переклад слова "loop".',
    type: "vocab",
    accepted: ["цикл"],
    hints: ["Це те, що повторюється, поки виконується умова.", "В JS це for, while."],
    solution: "цикл",
  },
  {
    id: "eng-4",
    title: "Git та контроль версій",
    theory:
      "repository (репозиторій), commit (коміт — збережена зміна), branch (гілка), merge (злиття), pull request (запит на злиття). Це словник, без якого неможливо працювати в команді через Git.",
    example: { code: `// "Open a pull request once your branch is ready to merge."`, explain: "«Відкрий пул-реквест, коли твоя гілка готова до злиття.»" },
    task: 'Введи український переклад слова "commit".',
    type: "vocab",
    accepted: ["коміт", "коміт (git)"],
    hints: ["Так називають кожну збережену зміну в історії Git.", "Термін уже усталений — не перекладається дослівно."],
    solution: "коміт",
  },
  {
    id: "eng-5",
    title: "Сервер і клієнт",
    theory:
      "server (сервер — відповідає на запити), client (клієнт — надсилає запити, наприклад браузер), request (запит), response (відповідь). Кожна взаємодія з інтернетом — це діалог client → request → server → response.",
    example: { code: `// "The client sends a request; the server sends back a response."`, explain: "«Клієнт надсилає запит; сервер надсилає у відповідь response.»" },
    task: 'Введи український переклад слова "request".',
    type: "vocab",
    accepted: ["запит"],
    hints: ["Це те, що клієнт надсилає серверу.", "Протилежне до response (відповідь)."],
    solution: "запит",
  },
  {
    id: "eng-6",
    title: "Бази даних",
    theory:
      "database (база даних), table (таблиця), record / row (запис/рядок), query (запит до бази даних — не плутай з HTTP request!). У SQL query — це, наприклад, весь текст SELECT * FROM users.",
    example: { code: `// "Write a query to fetch all records from the users table."`, explain: "«Напиши запит, щоб отримати всі записи з таблиці users.»" },
    task: 'Введи український переклад слова "database".',
    type: "vocab",
    accepted: ["база даних"],
    hints: ["Складається з двох слів.", "Те, де зберігаються таблиці з даними."],
    solution: "база даних",
  },
  {
    id: "eng-7",
    title: "Розгортання",
    theory:
      "deploy (розгорнути — дія), deployment (розгортання — процес), environment (середовище: development/production), production (реальне середовище, де застосунком користуються люди).",
    example: { code: `// "We deploy to production every Friday."`, explain: "«Ми розгортаємо в продакшн щопʼятниці.»" },
    task: 'Введи український переклад слова "deployment".',
    type: "vocab",
    accepted: ["розгортання"],
    hints: ["Це іменник — процес, а не дія.", "Дія «розгорнути» англійською — to deploy."],
    solution: "розгортання",
  },
  {
    id: "eng-8",
    title: "Читання помилок англійською",
    theory:
      "undefined означає «значення не задане». TypeError означає «неправильний тип значення» (наприклад, намагаєшся викликати число як функцію). Розпізнавання цих слів у тексті помилки — перший крок до її виправлення, навіть якщо решту повідомлення ще важко зрозуміти.",
    example: { code: `// TypeError: Cannot read properties of undefined`, explain: "«Не можу прочитати властивості undefined» — типова помилка, коли звертаєшся до неіснуючого об'єкта." },
    task: 'Введи український переклад слова "undefined".',
    type: "vocab",
    accepted: ["невизначено", "не визначено", "невизначене значення"],
    hints: ["Це те значення, яке має змінна, якій ще нічого не присвоїли.", "Дослівно: «не визначено»."],
    solution: "невизначено",
  },
  {
    id: "eng-9",
    title: "API та запити",
    theory:
      "endpoint (кінцева точка API — конкретна адреса запиту), payload (тіло запиту/відповіді — самі дані), header (заголовок запиту — метадані на кшталт типу вмісту чи токена авторизації).",
    example: { code: `// "This endpoint returns the payload as JSON."`, explain: "«Ця кінцева точка повертає дані у форматі JSON.»" },
    task: 'Введи український переклад слова "endpoint".',
    type: "vocab",
    accepted: ["кінцева точка"],
    hints: ["Складається з двох слів.", "Це конкретна адреса, за якою можна звернутись до API."],
    solution: "кінцева точка",
  },
  {
    id: "eng-10",
    title: "Фінал: фреймворки та бібліотеки",
    theory:
      "framework (фреймворк — задає структуру всього проєкту) і library (бібліотека — окремий інструмент, який ти підключаєш за потреби) — не синоніми: фреймворк керує твоїм кодом, а бібліотеку викликаєш ти сама.",
    example: { code: `// "React is often called a library, not a framework."`, explain: "React зазвичай називають бібліотекою, а не фреймворком — саме через цю різницю." },
    task: 'Введи український переклад слова "framework".',
    type: "vocab",
    accepted: ["фреймворк"],
    hints: ["Слово не перекладається — це усталене запозичення.", "Задає структуру всього проєкту, на відміну від бібліотеки."],
    solution: "фреймворк",
  },
];
