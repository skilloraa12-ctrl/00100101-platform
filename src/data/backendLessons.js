// Backend — routing/middleware logic executes for REAL, just like every
// other course in this platform: there's no actual TCP server (impossible
// in a browser sandbox), so HTTP transport is simulated by a small,
// self-contained router (MINI_EXPRESS_SOURCE below) whose public API
// intentionally mirrors real Express almost 1:1 — app.get/post/put/delete,
// app.use, req.params/query/body/headers, res.status().json(). This is the
// same technique real Express apps are unit-tested with (call the handler
// directly, inspect a mock response) — the routing, param extraction,
// middleware order and error propagation genuinely execute; only the raw
// socket layer is mocked. The final project's install guide shows the
// unchanged real-Express translation of what was written here.
//
// Runs through the EXISTING JS sandbox (buildJsSandboxDoc's new `harness`
// parameter — see App.jsx): harness JS is prepended before the learner's
// code in the same scope, so learner code can call `app.get(...)` etc. on
// an already-created `app`, and testCode (closing over that same scope) can
// call `app.request(method, path, opts)` to simulate an incoming request.
const MINI_EXPRESS_SOURCE = `
function createApp() {
  const routes = [];
  const globalMiddlewares = [];
  const errorMiddlewares = [];
  function pathToRegex(pattern) {
    const keys = [];
    const regexStr = '^' + pattern.replace(/:[^/]+/g, (m) => { keys.push(m.slice(1)); return '([^/]+)'; }) + '$';
    return { regex: new RegExp(regexStr), keys };
  }
  function addRoute(method, pattern, handlers) {
    const { regex, keys } = pathToRegex(pattern);
    routes.push({ method, regex, keys, handlers });
  }
  const app = {
    get(p, ...h) { addRoute('GET', p, h); },
    post(p, ...h) { addRoute('POST', p, h); },
    put(p, ...h) { addRoute('PUT', p, h); },
    delete(p, ...h) { addRoute('DELETE', p, h); },
    use(mw) { if (mw.length === 4) errorMiddlewares.push(mw); else globalMiddlewares.push(mw); },
    request(method, path, opts) {
      opts = opts || {};
      const parts = path.split('?');
      const pathname = parts[0];
      const queryStr = parts[1];
      const query = {};
      if (queryStr) {
        queryStr.split('&').forEach((pair) => {
          const kv = pair.split('=');
          query[kv[0]] = decodeURIComponent(kv[1] || '');
        });
      }
      const headers = {};
      Object.keys(opts.headers || {}).forEach((k) => { headers[k.toLowerCase()] = opts.headers[k]; });
      const match = routes.find((r) => r.method === method && r.regex.test(pathname));
      const req = { method, path: pathname, query, params: {}, body: opts.body || {}, headers };
      const res = {
        statusCode: 200,
        _body: undefined,
        _ended: false,
        status(code) { this.statusCode = code; return this; },
        json(obj) { this._body = obj; this._ended = true; return this; },
        send(val) { this._body = val; this._ended = true; return this; },
        end() { this._ended = true; return this; },
      };
      if (!match) { res.status(404).json({ error: 'Not Found' }); return res; }
      const m = match.regex.exec(pathname);
      match.keys.forEach((k, i) => { req.params[k] = m[i + 1]; });
      const chain = globalMiddlewares.concat(match.handlers);
      let i = 0;
      function next(err) {
        if (res._ended) return;
        if (err) {
          const errFn = errorMiddlewares[0];
          if (errFn) { errFn(err, req, res, () => {}); }
          else { res.status(500).json({ error: err.message || 'Internal Server Error' }); }
          return;
        }
        const fn = chain[i++];
        if (!fn) return;
        try {
          fn(req, res, next);
        } catch (e) {
          next(e);
        }
      }
      next();
      return res;
    },
  };
  return app;
}
`;

function harnessWith(seed) {
  return MINI_EXPRESS_SOURCE + "\nconst app = createApp();\n" + (seed || "") + "\n";
}

const PRODUCTS_SEED = `let products = [
  { id: 1, name: 'Кобзар', category: 'Книги', price: 250 },
  { id: 2, name: 'Тіні забутих предків', category: 'Книги', price: 180 },
  { id: 3, name: 'Навушники JBL', category: 'Електроніка', price: 1200 },
  { id: 4, name: 'Смартфон Xiaomi', category: 'Електроніка', price: 8500 },
];`;

const CUSTOMERS_SEED = `let customers = [
  { id: 1, name: 'Олена Коваль', city: 'Київ' },
  { id: 2, name: 'Андрій Бондар', city: 'Львів' },
];`;

const ORDERS_SEED = `let orders = [
  { id: 1, customerId: 1, productId: 1, quantity: 2 },
  { id: 2, customerId: 1, productId: 3, quantity: 1 },
  { id: 3, customerId: 2, productId: 4, quantity: 1 },
];`;

const PING_ROUTE = `app.get('/ping', (req, res) => { res.status(200).json({ ok: true }); });\napp.get('/public', (req, res) => { res.status(200).json({ ok: true }); });`;

export const BACKEND_LESSONS = [
  {
    id: "backend-intro",
    title: "Що це? — Backend",
    type: "intro",
    theory:
      "Backend — це та частина застосунку, що працює на СЕРВЕРІ, а не в браузері користувача: приймає запити (від сайту, мобільного застосунку чи іншого сервера), опрацьовує їх (звертається до бази даних, перевіряє права доступу, рахує щось), і повертає відповідь. Курс SQL уже навчив працювати з даними НАПРЯМУ; Backend — про те, як ці самі дані стають доступні через мережу, за адресою на кшталт GET /api/products.\n\nУ реальному світі backend найчастіше пишуть на Node.js з фреймворком Express (чи схожими: Fastify, NestJS) або на інших мовах (Python/FastAPI, Go). У цьому курсі логіка маршрутизації й middleware виконується ПО-СПРАВЖНЬОМУ — так само, як реальні Express-застосунки тестують: обробник викликається напряму з підробленим запитом, а відповідь перевіряється. Це та сама техніка, що й у справжніх тестах (supertest тощо) — просто без реального мережевого сокета, який у браузерній пісочниці однаково неможливо відкрити.\n\nАПІ, побудований у цьому курсі, синтаксично ледь відрізняється від СПРАВЖНЬОГО Express: app.get/post/put/delete, app.use для middleware, req.params/query/body/headers, res.status().json() — усе це працює в реальному Express майже без змін. Фінальний проєкт покаже точний переклад написаного тут коду в реальний, запускний на Node.js сервер.\n\nЩо ти отримаєш після цього курсу: впевнене розуміння HTTP-методів, кодів статусу, маршрутів з параметрами, middleware, автентифікації через токен, валідації вхідних даних — і фінальний проєкт: міні REST API для того самого магазину з курсу SQL.",
    presentation: [
      { title: "Backend коротко", points: ["Код, що працює на сервері й відповідає на HTTP-запити", "У цьому курсі маршрутизація й middleware виконуються реально", "API тут майже ідентичний справжньому Express"] },
      { title: "Результат", points: ["Понад 20 уроків: маршрути, статус-коди, middleware, автентифікація", "Фінал: міні REST API для магазину з курсу SQL", "Кожен урок перевіряється реальними симульованими запитами"] },
    ],
  },
  {
    id: "backend-1",
    title: "GET-маршрут і базова відповідь",
    type: "js",
    harness: harnessWith(""),
    theory:
      "Сервер приймає запити за конкретними адресами (шляхами) і конкретними МЕТОДАМИ — GET, POST, PUT, DELETE — комбінація методу й шляху визначає, ЯКИЙ саме обробник (handler) відповість. app.get('/ping', (req, res) => {...}) реєструє обробник для GET-запитів саме на шлях /ping — жоден інший шлях чи метод його не викличе.\n\nОбробник отримує два об'єкти: req (request, сам запит — що прийшло від клієнта) і res (response, відповідь — те, що сервер відправить назад). res.status(200) встановлює код статусу відповіді (200 означає «успіх»), а res.json({...}) відправляє об'єкт, автоматично перетворений на текст JSON — саме так більшість сучасних API спілкуються з клієнтами.\n\nres.status(200).json({...}) — методи можна ЛАНЦЮЖКОМ (chain), бо status() повертає той самий об'єкт res, дозволяючи одразу викликати наступний метод на ньому. Це той самий принцип method chaining, що і в масивових методах JS (array.filter(...).map(...)).",
    examples: [
      { title: "Найпростіший маршрут", code: `app.get('/ping', (req, res) => {\n  res.status(200).json({ status: 'ok' });\n});`, explain: "GET-запит на /ping отримає у відповідь {status: 'ok'} з кодом 200." },
    ],
    task: "Створи GET-маршрут /ping, що повертає JSON {status: 'ok'} зі статусом 200.",
    starter: `// твій код тут\n`,
    hints: [
      "app.get('/ping', (req, res) => { ... });",
      "Усередині: res.status(200).json({ status: 'ok' });",
      `app.get('/ping', (req, res) => {\n  res.status(200).json({ status: 'ok' });\n});`,
    ],
    solution: `app.get('/ping', (req, res) => {\n  res.status(200).json({ status: 'ok' });\n});`,
    testCode: `const res = app.request('GET', '/ping');\nif (res.statusCode !== 200) return {pass:false, message:"Статус має бути 200 (зараз: " + res.statusCode + ")."};\nif (!res._body || res._body.status !== 'ok') return {pass:false, message:"Тіло відповіді має бути { status: 'ok' }."};\nreturn {pass:true, message:"app.get(шлях, обробник) — так реєструється маршрут, що відповідає на GET-запити за цим шляхом."};`,
  },
  {
    id: "backend-2",
    title: "Параметри маршруту: req.params",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED),
    theory:
      "Двокрапка в шляху (:id) позначає ЗМІННУ частину адреси — параметр маршруту: app.get('/products/:id', ...) реагує і на /products/1, і на /products/42, і на /products/будь-що. Значення цієї частини стає доступним усередині обробника через req.params.id — рядком, навіть якщо в URL було число (тому часто пишуть Number(req.params.id)).\n\nЦе саме той механізм, що дозволяє ОДНОМУ обробнику обслуговувати ЦІЛУ КОЛЕКЦІЮ ресурсів — не треба реєструвати окремий маршрут для кожного товару, досить одного шаблону з параметром.\n\nТиповий патерн: знайти запис за id серед наявних даних (products.find(p => p.id === id)), і якщо його НЕМАЄ — повернути 404 (Not Found), а не впасти з помилкою чи повернути порожню відповідь мовчки.",
    examples: [
      { title: "Пошук за параметром маршруту", code: `app.get('/products/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const product = products.find(p => p.id === id);\n  if (!product) {\n    res.status(404).json({ error: 'Not found' });\n  } else {\n    res.status(200).json(product);\n  }\n});`, explain: "req.params.id бере значення саме з ТІЄЇ частини URL, де в шаблоні стояло :id." },
    ],
    task: "Створи GET /products/:id, що повертає товар з таким id, або 404, якщо товару з таким id немає.",
    starter: `// твій код тут\n`,
    hints: [
      "req.params.id — рядок; перетвори його на число через Number(...).",
      "products.find(p => p.id === id) шукає товар; якщо не знайдено — 404.",
      `app.get('/products/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const product = products.find(p => p.id === id);\n  if (!product) {\n    res.status(404).json({ error: 'Not found' });\n  } else {\n    res.status(200).json(product);\n  }\n});`,
    ],
    solution: `app.get('/products/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const product = products.find(p => p.id === id);\n  if (!product) {\n    res.status(404).json({ error: 'Not found' });\n  } else {\n    res.status(200).json(product);\n  }\n});`,
    testCode: `const r1 = app.request('GET', '/products/3');\nif (r1.statusCode !== 200 || !r1._body || r1._body.name !== 'Навушники JBL') return {pass:false, message:"GET /products/3 має повернути товар 'Навушники JBL' зі статусом 200."};\nconst r2 = app.request('GET', '/products/999');\nif (r2.statusCode !== 404) return {pass:false, message:"GET /products/999 (неіснуючий товар) має повернути статус 404."};\nreturn {pass:true, message:"req.params.id — значення, витягнуте з ЧАСТИНИ шляху :id — головний спосіб передати 'який саме ресурс' у GET-запиті."};`,
  },
  {
    id: "backend-3",
    title: "Query-рядок: req.query",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED),
    theory:
      "Query-рядок — частина URL після знаку ? у форматі ключ=значення, розділених &: /products?category=Книги&sort=price. На відміну від req.params (частина самого ШЛЯХУ, завжди обов'язкова), query-параметри НЕОБОВ'ЯЗКОВІ й найчастіше використовуються для фільтрації, сортування чи пошуку — усе, що НЕ визначає, ЯКИЙ це ресурс, а лише УТОЧНЮЄ, які саме з них показати.\n\nУсередині обробника вони доступні через req.query — звичайний об'єкт, де кожен параметр із URL стає властивістю: req.query.category поверне 'Книги' для прикладу вище. Якщо параметр не переданий — req.query.category буде undefined, тому код часто перевіряє його наявність через if (req.query.category).\n\nRESTful API майже завжди підтримують фільтрацію колекцій саме через query-параметри, а не через окремі шляхи на кожен можливий фільтр — /products?category=Книги, а не /products/category/книги.",
    examples: [
      { title: "Фільтрація за query-параметром", code: `app.get('/products', (req, res) => {\n  if (req.query.category) {\n    res.status(200).json(products.filter(p => p.category === req.query.category));\n  } else {\n    res.status(200).json(products);\n  }\n});`, explain: "Без ?category=... повертає всі товари; з ним — лише ту категорію." },
    ],
    task: "Створи GET /products: якщо задано query-параметр category — поверни лише товари цієї категорії, інакше поверни всі товари.",
    starter: `// твій код тут\n`,
    hints: [
      "req.query.category — значення параметра з URL, undefined, якщо його немає.",
      "products.filter(p => p.category === req.query.category) для фільтрації.",
      `app.get('/products', (req, res) => {\n  if (req.query.category) {\n    res.status(200).json(products.filter(p => p.category === req.query.category));\n  } else {\n    res.status(200).json(products);\n  }\n});`,
    ],
    solution: `app.get('/products', (req, res) => {\n  if (req.query.category) {\n    res.status(200).json(products.filter(p => p.category === req.query.category));\n  } else {\n    res.status(200).json(products);\n  }\n});`,
    testCode: `const r1 = app.request('GET', '/products');\nif (!Array.isArray(r1._body) || r1._body.length !== 4) return {pass:false, message:"GET /products без query має повернути всі 4 товари."};\nconst r2 = app.request('GET', '/products?category=Книги');\nif (!Array.isArray(r2._body) || r2._body.length !== 2) return {pass:false, message:"GET /products?category=Книги має повернути 2 товари."};\nreturn {pass:true, message:"req.query — об'єкт з параметрами після ? у URL, найпоширеніший спосіб фільтрувати списки ресурсів."};`,
  },
  {
    id: "backend-4",
    title: "Коди статусу: успіх і заборона",
    type: "js",
    harness: harnessWith(""),
    theory:
      "Код статусу — тризначне число на початку HTTP-відповіді, що коротко повідомляє РЕЗУЛЬТАТ запиту ще до того, як клієнт прочитає тіло відповіді. Коди діляться на групи за першою цифрою: 2xx — успіх (200 OK — стандартний успіх, 201 Created — успішно СТВОРЕНО щось нове), 4xx — помилка З БОКУ КЛІЄНТА (400 Bad Request — некоректні дані, 401 Unauthorized — не авторизований, 403 Forbidden — авторизований, але немає прав, 404 Not Found — ресурс не існує), 5xx — помилка НА СЕРВЕРІ (500 Internal Server Error).\n\n401 і 403 часто плутають: 401 означає «я не знаю, хто ти» (потрібно залогінитись), 403 означає «я знаю, хто ти, але тобі це заборонено» (навіть залогінившись, доступу не буде). Обирати правильний код — не формальність: клієнтський код (сайт, застосунок) часто приймає РІЗНІ рішення залежно САМЕ від коду статусу, а не від тексту повідомлення.\n\nБраузер чи бібліотека типу fetch() не вважають запит \"невдалим\" через 4xx/5xx автоматично — це просто ЧИСЛО в відповіді, яке код клієнта сам вирішує, як інтерпретувати.",
    examples: [
      { title: "403 Forbidden за умовою", code: `app.get('/secret', (req, res) => {\n  if (req.query.token !== 'letmein') {\n    res.status(403).json({ error: 'Forbidden' });\n  } else {\n    res.status(200).json({ access: true });\n  }\n});`, explain: "Без правильного токена — 403 і жодного доступу до вмісту відповіді." },
    ],
    task: "Створи GET /secret: якщо query-параметр token не дорівнює 'letmein' — поверни 403 з {error: 'Forbidden'}, інакше 200 з {access: true}.",
    starter: `// твій код тут\n`,
    hints: [
      "req.query.token !== 'letmein' — умова для 403.",
      "res.status(403).json({ error: 'Forbidden' });",
      `app.get('/secret', (req, res) => {\n  if (req.query.token !== 'letmein') {\n    res.status(403).json({ error: 'Forbidden' });\n  } else {\n    res.status(200).json({ access: true });\n  }\n});`,
    ],
    solution: `app.get('/secret', (req, res) => {\n  if (req.query.token !== 'letmein') {\n    res.status(403).json({ error: 'Forbidden' });\n  } else {\n    res.status(200).json({ access: true });\n  }\n});`,
    testCode: `const r1 = app.request('GET', '/secret');\nif (r1.statusCode !== 403) return {pass:false, message:"Без token має повернутись 403."};\nconst r2 = app.request('GET', '/secret?token=letmein');\nif (r2.statusCode !== 200 || !r2._body || r2._body.access !== true) return {pass:false, message:"З правильним token має повернутись 200 і {access: true}."};\nreturn {pass:true, message:"Правильний код статусу — не формальність: клієнтський код часто вирішує, що робити далі, саме за ЦИМ числом."};`,
  },
  {
    id: "backend-5",
    title: "POST і тіло запиту: req.body",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED),
    theory:
      "GET-запити не мають тіла — усі дані передаються через URL (шлях і query). POST призначений саме для передачі ДАНИХ у тілі запиту: req.body — об'єкт з усім, що клієнт надіслав (найчастіше як JSON). Це стандартний спосіб СТВОРИТИ новий ресурс: POST /products з тілом {name: 'Кепка', price: 300}.\n\nОбробник читає потрібні поля з req.body так само, як зі звичайного об'єкта: req.body.name, req.body.price. У реальному Express тіло доводиться явно розпарсити через middleware express.json() (сирий запит спочатку приходить просто текстом) — у цьому курсі req.body вже готовий об'єкт, щоб зосередитись на логіці обробника.\n\nУспішне СТВОРЕННЯ нового ресурсу повертає код 201 Created (не звичайний 200) — і зазвичай У ТІЛІ відповіді сам щойно створений об'єкт, включно зі згенерованим id, щоб клієнт одразу знав, під яким ідентифікатором ресурс тепер існує.",
    examples: [
      { title: "Створення нового товару", code: `app.post('/products', (req, res) => {\n  const newProduct = { id: products.length + 1, name: req.body.name, price: req.body.price };\n  products.push(newProduct);\n  res.status(201).json(newProduct);\n});`, explain: "201 Created і сам новий об'єкт (з id) у тілі відповіді." },
    ],
    task: "Створи POST /products: додай новий товар { id: products.length + 1, name: req.body.name, price: req.body.price } у масив products, поверни його зі статусом 201.",
    starter: `// твій код тут\n`,
    hints: [
      "app.post('/products', (req, res) => { ... });",
      "const newProduct = { id: products.length + 1, name: req.body.name, price: req.body.price }; products.push(newProduct);",
      `app.post('/products', (req, res) => {\n  const newProduct = { id: products.length + 1, name: req.body.name, price: req.body.price };\n  products.push(newProduct);\n  res.status(201).json(newProduct);\n});`,
    ],
    solution: `app.post('/products', (req, res) => {\n  const newProduct = { id: products.length + 1, name: req.body.name, price: req.body.price };\n  products.push(newProduct);\n  res.status(201).json(newProduct);\n});`,
    testCode: `const before = products.length;\nconst res = app.request('POST', '/products', { body: { name: 'Кепка', price: 300 } });\nif (res.statusCode !== 201) return {pass:false, message:"Статус створення нового ресурсу має бути 201 (зараз: " + res.statusCode + ")."};\nif (products.length !== before + 1) return {pass:false, message:"Новий товар має додатись у масив products."};\nif (!res._body || res._body.name !== 'Кепка') return {pass:false, message:"Відповідь має містити щойно створений товар."};\nreturn {pass:true, message:"201 Created — статус саме для успішного СТВОРЕННЯ нового ресурсу, а не звичайний 200."};`,
  },
  {
    id: "backend-6",
    title: "Валідація вхідних даних",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED),
    theory:
      "Сервер НІКОЛИ не повинен сліпо довіряти даним від клієнта — навіть якщо власний сайт завжди надсилає коректні дані, будь-хто інший може надіслати запит напряму, з чим завгодно в тілі. Валідація — перевірка, що обов'язкові поля справді присутні (і мають очікуваний тип), ще ДО того, як дані потраплять у сховище.\n\nЯкщо перевірка не пройшла — сервер повертає 400 Bad Request з поясненням, ЩО саме не так, і ЗУПИНЯЄ виконання обробника (через return одразу після res.status(400).json(...) — інакше код продовжив би виконуватись і спробував би створити некоректний запис).\n\nЦе перший захисний рубіж — навіть якщо клієнтський код (форма на сайті) теж перевіряє дані, сервер ЗОБОВ'ЯЗАНИЙ перевірити їх ЗАНОВО, бо запит на сервер можна надіслати й НЕ через той сайт узагалі (напряму через код чи інструмент типу curl).",
    examples: [
      { title: "400 при відсутньому полі", code: `app.post('/products', (req, res) => {\n  if (!req.body.name) {\n    res.status(400).json({ error: 'name is required' });\n    return;\n  }\n  const newProduct = { id: products.length + 1, name: req.body.name, price: req.body.price || 0 };\n  products.push(newProduct);\n  res.status(201).json(newProduct);\n});`, explain: "return одразу після 400 зупиняє обробник — код нижче просто не виконається." },
    ],
    task: "Онови POST /products: якщо req.body.name відсутній — поверни 400 з {error: 'name is required'} і не створюй товар; інакше створи товар як раніше (price бери req.body.price, або 0, якщо не передано).",
    starter: `// твій код тут\n`,
    hints: [
      "if (!req.body.name) { res.status(400).json({...}); return; }",
      "return після 400 обов'язковий — інакше код продовжить виконуватись.",
      `app.post('/products', (req, res) => {\n  if (!req.body.name) {\n    res.status(400).json({ error: 'name is required' });\n    return;\n  }\n  const newProduct = { id: products.length + 1, name: req.body.name, price: req.body.price || 0 };\n  products.push(newProduct);\n  res.status(201).json(newProduct);\n});`,
    ],
    solution: `app.post('/products', (req, res) => {\n  if (!req.body.name) {\n    res.status(400).json({ error: 'name is required' });\n    return;\n  }\n  const newProduct = { id: products.length + 1, name: req.body.name, price: req.body.price || 0 };\n  products.push(newProduct);\n  res.status(201).json(newProduct);\n});`,
    testCode: `const before = products.length;\nconst r1 = app.request('POST', '/products', { body: {} });\nif (r1.statusCode !== 400) return {pass:false, message:"POST без name має повернути 400."};\nif (products.length !== before) return {pass:false, message:"Товар БЕЗ name не мав додатись у products."};\nconst r2 = app.request('POST', '/products', { body: { name: 'Кепка' } });\nif (r2.statusCode !== 201) return {pass:false, message:"POST з коректним name має повернути 201."};\nreturn {pass:true, message:"400 Bad Request — сигнал КЛІЄНТУ, що це ВІН надіслав некоректні дані, а не помилка сервера."};`,
  },
  {
    id: "backend-7",
    title: "PUT: оновлення ресурсу",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED),
    theory:
      "PUT призначений для ОНОВЛЕННЯ вже існуючого ресурсу за його ідентифікатором: PUT /products/1 з тілом {price: 300} змінює товар з id=1. На відміну від POST /products (створення НОВОГО, без відомого заздалегідь id), PUT завжди звертається до КОНКРЕТНОГО, вже існуючого ресурсу через req.params.id — той самий підхід, що й у GET /products/:id.\n\nЯкщо ресурс з таким id не існує — так само, як у GET, повертають 404: оновлювати те, чого немає, безглуздо. Якщо існує — знаходять запис, змінюють потрібні поля (тут — product.price = req.body.price), і повертають ОНОВЛЕНИЙ об'єкт з кодом 200 (не 201 — ресурс не СТВОРЕНО, а змінено).\n\nВажливо: зміна відбувається НАПРЯМУ на знайденому об'єкті (product.price = ...), а не через створення нового — оскільки product — це та сама референсна змінна, що й елемент масиву products, зміна її поля одразу відображається і в самому масиві.",
    examples: [
      { title: "Оновлення ціни товару", code: `app.put('/products/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const product = products.find(p => p.id === id);\n  if (!product) {\n    res.status(404).json({ error: 'Not found' });\n    return;\n  }\n  product.price = req.body.price;\n  res.status(200).json(product);\n});`, explain: "Зміна product.price напряму одразу оновлює й сам масив products, бо product — референс на той самий об'єкт." },
    ],
    task: "Створи PUT /products/:id: онови price товару за id (з req.body.price) і поверни оновлений товар зі статусом 200. Якщо товар не знайдено — 404.",
    starter: `// твій код тут\n`,
    hints: [
      "Знайди товар так само, як у GET /products/:id.",
      "product.price = req.body.price; потім res.status(200).json(product);",
      `app.put('/products/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const product = products.find(p => p.id === id);\n  if (!product) {\n    res.status(404).json({ error: 'Not found' });\n    return;\n  }\n  product.price = req.body.price;\n  res.status(200).json(product);\n});`,
    ],
    solution: `app.put('/products/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const product = products.find(p => p.id === id);\n  if (!product) {\n    res.status(404).json({ error: 'Not found' });\n    return;\n  }\n  product.price = req.body.price;\n  res.status(200).json(product);\n});`,
    testCode: `const res = app.request('PUT', '/products/1', { body: { price: 300 } });\nif (res.statusCode !== 200) return {pass:false, message:"PUT для існуючого товару має повернути 200."};\nif (!res._body || res._body.price !== 300) return {pass:false, message:"price у відповіді має стати 300."};\nconst check = products.find(p => p.id === 1);\nif (!check || check.price !== 300) return {pass:false, message:"Сам масив products має оновитись, не лише відповідь."};\nconst r404 = app.request('PUT', '/products/999', { body: { price: 1 } });\nif (r404.statusCode !== 404) return {pass:false, message:"PUT для неіснуючого товару має повернути 404."};\nreturn {pass:true, message:"PUT — стандартний метод для ОНОВЛЕННЯ вже існуючого ресурсу за його ідентифікатором."};`,
  },
  {
    id: "backend-8",
    title: "DELETE: видалення ресурсу",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED),
    theory:
      "DELETE видаляє ресурс за id — так само звертається до конкретного запису через req.params.id, як GET і PUT. Знайшовши ІНДЕКС потрібного елемента (не сам елемент, а його позицію в масиві — через findIndex, а не find), його прибирають з масиву методом splice(index, 1).\n\nУспішне видалення прийнято позначати кодом 204 No Content — «усе вдалося, але повертати нема чого» (на відміну від 200, де зазвичай ОЧІКУЄТЬСЯ якесь тіло відповіді). res.status(204).end() завершує відповідь без виклику json()/send() — саме end() підходить, коли тіла відповіді немає взагалі.\n\nЯк і в PUT, якщо ресурс з таким id не знайдено — 404, а не «тиха» відповідь 204: клієнт має чітко знати, ЩО САМЕ сталось — видалено щось реальне чи його просто ніколи не існувало.",
    examples: [
      { title: "Видалення за id", code: `app.delete('/products/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const index = products.findIndex(p => p.id === id);\n  if (index === -1) {\n    res.status(404).json({ error: 'Not found' });\n    return;\n  }\n  products.splice(index, 1);\n  res.status(204).end();\n});`, explain: "findIndex шукає ПОЗИЦІЮ елемента (-1, якщо не знайдено) — splice видаляє саме за цією позицією." },
    ],
    task: "Створи DELETE /products/:id: знайди ІНДЕКС товару через findIndex, видали його через splice, поверни статус 204 без тіла (res.end()). Якщо не знайдено — 404.",
    starter: `// твій код тут\n`,
    hints: [
      "const index = products.findIndex(p => p.id === id); if (index === -1) { ...404... }",
      "products.splice(index, 1); res.status(204).end();",
      `app.delete('/products/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const index = products.findIndex(p => p.id === id);\n  if (index === -1) {\n    res.status(404).json({ error: 'Not found' });\n    return;\n  }\n  products.splice(index, 1);\n  res.status(204).end();\n});`,
    ],
    solution: `app.delete('/products/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const index = products.findIndex(p => p.id === id);\n  if (index === -1) {\n    res.status(404).json({ error: 'Not found' });\n    return;\n  }\n  products.splice(index, 1);\n  res.status(204).end();\n});`,
    testCode: `const before = products.length;\nconst res = app.request('DELETE', '/products/2');\nif (res.statusCode !== 204) return {pass:false, message:"Успішне видалення має повернути статус 204 (зараз: " + res.statusCode + ")."};\nif (products.length !== before - 1) return {pass:false, message:"Товар має бути видалений з масиву products."};\nif (products.find(p => p.id === 2)) return {pass:false, message:"Товару з id=2 більше не має бути в products."};\nconst r404 = app.request('DELETE', '/products/999');\nif (r404.statusCode !== 404) return {pass:false, message:"DELETE неіснуючого товару має повернути 404."};\nreturn {pass:true, message:"204 No Content — успіх БЕЗ тіла відповіді, типово саме для DELETE."};`,
  },
  {
    id: "backend-9",
    title: "REST-конвенції: маршрути для колекції",
    type: "js",
    harness: harnessWith(CUSTOMERS_SEED),
    theory:
      "REST — це не технологія, а НАБІР УГОД про те, як має виглядати API, щоб будь-який розробник одразу зрозумів його логіку без документації. Головні угоди: шлях позначає РЕСУРС іменником у МНОЖИНІ (/products, /customers — не /getProduct чи /product), а ДІЮ над ним визначає HTTP-МЕТОД, а не слово в самому шляху (GET /products — отримати, POST /products — створити, а не /createProduct).\n\nОдин і той самий шлях /customers обслуговує ДВІ різні ситуації залежно від того, є параметр чи ні: GET /customers (без :id) повертає КОЛЕКЦІЮ — усіх клієнтів; GET /customers/:id повертає ОДИН конкретний запис. Це два ОКРЕМІ маршрути (app.get реєструється двічі, з різними шляхами), що разом покривають обидва випадки.\n\nДотримання цих угод — не формальність заради краси: клієнтський код, документація (Swagger/OpenAPI) і навіть інші розробники в команді покладаються САМЕ на ці передбачувані патерни, щоб здогадатись, як працює API, ще до того, як прочитають хоч рядок його коду.",
    examples: [
      { title: "Колекція і один запис — два маршрути", code: `app.get('/customers', (req, res) => {\n  res.status(200).json(customers);\n});\napp.get('/customers/:id', (req, res) => {\n  const customer = customers.find(c => c.id === Number(req.params.id));\n  if (!customer) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(customer);\n});`, explain: "Той самий іменник customers, множина — GET без параметра для списку, з параметром — для одного запису." },
    ],
    task: "Створи GET /customers (повертає масив усіх клієнтів) і GET /customers/:id (повертає одного клієнта за id, або 404, якщо не знайдено).",
    starter: `// твій код тут\n`,
    hints: [
      "Два ОКРЕМІ app.get: один без параметра, інший з :id.",
      "GET /customers повертає весь масив customers напряму.",
      `app.get('/customers', (req, res) => {\n  res.status(200).json(customers);\n});\napp.get('/customers/:id', (req, res) => {\n  const customer = customers.find(c => c.id === Number(req.params.id));\n  if (!customer) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(customer);\n});`,
    ],
    solution: `app.get('/customers', (req, res) => {\n  res.status(200).json(customers);\n});\napp.get('/customers/:id', (req, res) => {\n  const customer = customers.find(c => c.id === Number(req.params.id));\n  if (!customer) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(customer);\n});`,
    testCode: `const r1 = app.request('GET', '/customers');\nif (!Array.isArray(r1._body) || r1._body.length !== 2) return {pass:false, message:"GET /customers має повернути масив із 2 клієнтів."};\nconst r2 = app.request('GET', '/customers/1');\nif (r2.statusCode !== 200 || !r2._body || r2._body.name !== 'Олена Коваль') return {pass:false, message:"GET /customers/1 має повернути Олену Коваль."};\nconst r3 = app.request('GET', '/customers/999');\nif (r3.statusCode !== 404) return {pass:false, message:"GET /customers/999 має повернути 404."};\nreturn {pass:true, message:"Множина в шляху (customers, не customer) і сам HTTP-метод — стандартна REST-конвенція, а не довільний вибір."};`,
  },
  {
    id: "backend-10",
    title: "Middleware: app.use і next()",
    type: "js",
    harness: harnessWith(PING_ROUTE),
    theory:
      "Middleware — функція (req, res, next), що виконується МІЖ отриманням запиту і фінальним обробником: логування, перевірка авторизації, обробка помилок — усе, що потрібно робити для БАГАТЬОХ (чи всіх) маршрутів одразу, а не дублювати в кожному обробнику окремо. app.use(fn) реєструє middleware ГЛОБАЛЬНО — для УСІХ наступних запитів, незалежно від шляху.\n\nТретій параметр, next, — функція, яку middleware ОБОВ'ЯЗКОВО має викликати, щоб передати керування ДАЛІ по ланцюжку (наступному middleware чи фінальному обробнику). Забутий виклик next() означає, що запит «зависає» — жоден наступний код так і не виконається, і клієнт ніколи не отримає відповіді.\n\nMiddleware НЕ обов'язково відповідає сам — найчастіше він щось РОБИТЬ (логує, перевіряє) і йде далі через next(); лише middleware, що ЗАВЕРШУЄ обробку самостійно (наприклад, забороняє доступ), не викликає next(), а одразу відправляє відповідь через res.status(...).json(...).",
    examples: [
      { title: "Логування кожного запиту", code: `app.use((req, res, next) => {\n  console.log('LOG: ' + req.method + ' ' + req.path);\n  next();\n});`, explain: "Спрацює для БУДЬ-ЯКОГО маршруту, зареєстрованого в цьому застосунку — не лише для одного конкретного." },
    ],
    task: "Додай глобальний middleware через app.use, що виводить у консоль рядок 'LOG: <METHOD> <path>' для кожного запиту (наприклад, 'LOG: GET /ping'), і обов'язково виклич next().",
    starter: `// твій код тут\n`,
    hints: [
      "app.use((req, res, next) => { ... });",
      "console.log('LOG: ' + req.method + ' ' + req.path); потім next();",
      `app.use((req, res, next) => {\n  console.log('LOG: ' + req.method + ' ' + req.path);\n  next();\n});`,
    ],
    solution: `app.use((req, res, next) => {\n  console.log('LOG: ' + req.method + ' ' + req.path);\n  next();\n});`,
    testCode: `const res = app.request('GET', '/ping');\nif (res.statusCode !== 200) return {pass:false, message:"Маршрут /ping має й далі працювати — не забув(-ла) виклик next()?"};\nif (!__logs.some(l => l.includes('LOG: GET /ping'))) return {pass:false, message:"У консолі має з'явитися рядок 'LOG: GET /ping'."};\nreturn {pass:true, message:"app.use реєструє middleware для УСІХ маршрутів; next() передає керування далі по ланцюжку."};`,
  },
  {
    id: "backend-11",
    title: "Порядок middleware",
    type: "js",
    harness: harnessWith(PING_ROUTE),
    theory:
      "Коли зареєстровано КІЛЬКА middleware через app.use, вони виконуються СУВОРО в порядку реєстрації — перший зареєстрований запускається першим, і лише ПІСЛЯ його next() запускається другий, і так далі, аж поки хтось не відповість або не дійде черга до фінального обробника маршруту.\n\nЦе робить порядок реєстрації частиною логіки програми, а не випадковістю: middleware перевірки автентифікації зазвичай реєструють РАНІШЕ за middleware, що читає дані користувача з бази (немає сенсу йти в базу за даними користувача, якщо він ще навіть не підтвердив, хто він) — «спочатку хто ти, потім що тобі показати».\n\nЯкщо будь-який middleware У ЛАНЦЮЖКУ не викличе next() (наприклад, бо сам відповів клієнту), усі НАСТУПНІ middleware й сам обробник маршруту просто НЕ виконаються — саме так одне-єдине «блокуюче» middleware (наприклад, перевірка авторизації з попереднього уроку) захищає ВСЕ, що йде після нього в ланцюжку.",
    examples: [
      { title: "Два middleware по черзі", code: `app.use((req, res, next) => { console.log('first'); next(); });\napp.use((req, res, next) => { console.log('second'); next(); });`, explain: "'first' завжди виведеться РАНІШЕ за 'second' — саме такий порядок їх реєстрації." },
    ],
    task: "Додай два middleware по черзі через app.use: перший виводить у консоль 'first', другий — 'second' (обидва обов'язково викликають next()).",
    starter: `// твій код тут\n`,
    hints: [
      "Два окремих app.use(...), один за одним у такому самому порядку, як мають виконуватись.",
      "Кожен: console.log('...'); next();",
      `app.use((req, res, next) => { console.log('first'); next(); });\napp.use((req, res, next) => { console.log('second'); next(); });`,
    ],
    solution: `app.use((req, res, next) => { console.log('first'); next(); });\napp.use((req, res, next) => { console.log('second'); next(); });`,
    testCode: `app.request('GET', '/ping');\nconst firstIdx = __logs.indexOf('first');\nconst secondIdx = __logs.indexOf('second');\nif (firstIdx === -1 || secondIdx === -1) return {pass:false, message:"Обидва middleware мають вивести свій лог ('first' і 'second')."};\nif (firstIdx > secondIdx) return {pass:false, message:"'first' має вивестись РАНІШЕ за 'second' — порядок реєстрації визначає порядок виконання."};\nreturn {pass:true, message:"Middleware виконуються СУВОРО в порядку реєстрації — кожен передає керування далі через next()."};`,
  },
  {
    id: "backend-12",
    title: "Middleware для одного маршруту (guard)",
    type: "js",
    harness: harnessWith(PING_ROUTE),
    theory:
      "app.use застосовує middleware до УСІХ маршрутів — але часто потрібно захистити лише ОДИН конкретний: app.get('/private', requireAuth, (req, res) => {...}) — третій (і будь-які подальші) аргумент між шляхом і фінальним обробником теж є middleware, застосованим ЛИШЕ до ЦЬОГО маршруту.\n\nТаку функцію-охоронця (guard) зазвичай оголошують ОКРЕМО, з власним іменем (function requireAuth(req, res, next) {...}) — так її можна повторно використати для декількох маршрутів, які потребують того самого захисту, не дублюючи логіку перевірки щоразу.\n\nreq.headers — об'єкт із заголовками запиту; типовий спосіб передати токен доступу — заголовок Authorization у форматі 'Bearer <токен>'. requireAuth перевіряє його значення: якщо неправильне чи відсутнє — 401 і жодного виклику next() (обробник маршруту так і не виконається); якщо правильне — next(), і керування передається далі, до самого обробника /private.",
    examples: [
      { title: "Guard лише для одного маршруту", code: `function requireAuth(req, res, next) {\n  if (req.headers.authorization !== 'Bearer secret123') {\n    res.status(401).json({ error: 'Unauthorized' });\n    return;\n  }\n  next();\n}\n\napp.get('/private', requireAuth, (req, res) => {\n  res.status(200).json({ secret: 'data' });\n});`, explain: "requireAuth стоїть МІЖ шляхом і фінальним обробником — саме так middleware прив'язують до ОДНОГО конкретного маршруту." },
    ],
    task: "Створи функцію requireAuth(req, res, next), що перевіряє req.headers.authorization === 'Bearer secret123' (інакше — 401, без next()). Застосуй її ЛИШЕ до GET /private, що повертає {secret: 'data'}.",
    starter: `// твій код тут\n`,
    hints: [
      "function requireAuth(req, res, next) { if (...не той токен...) { res.status(401)...; return; } next(); }",
      "app.get('/private', requireAuth, (req, res) => { ... });",
      `function requireAuth(req, res, next) {\n  if (req.headers.authorization !== 'Bearer secret123') {\n    res.status(401).json({ error: 'Unauthorized' });\n    return;\n  }\n  next();\n}\n\napp.get('/private', requireAuth, (req, res) => {\n  res.status(200).json({ secret: 'data' });\n});`,
    ],
    solution: `function requireAuth(req, res, next) {\n  if (req.headers.authorization !== 'Bearer secret123') {\n    res.status(401).json({ error: 'Unauthorized' });\n    return;\n  }\n  next();\n}\n\napp.get('/private', requireAuth, (req, res) => {\n  res.status(200).json({ secret: 'data' });\n});`,
    testCode: `const r1 = app.request('GET', '/private');\nif (r1.statusCode !== 401) return {pass:false, message:"Без заголовка Authorization /private має повернути 401."};\nconst r2 = app.request('GET', '/private', { headers: { Authorization: 'Bearer secret123' } });\nif (r2.statusCode !== 200 || !r2._body || r2._body.secret !== 'data') return {pass:false, message:"З правильним токеном /private має повернути 200 і {secret:'data'}."};\nconst r3 = app.request('GET', '/public');\nif (r3.statusCode !== 200) return {pass:false, message:"/public має й далі працювати без токена — requireAuth застосований лише до /private."};\nreturn {pass:true, message:"Middleware, переданий ЛИШЕ конкретному маршруту (не через app.use), захищає саме цей маршрут, не всі інші."};`,
  },
  {
    id: "backend-13",
    title: "Заголовки запиту: req.headers",
    type: "js",
    harness: harnessWith(""),
    theory:
      "Заголовки (headers) — метадані запиту, окремі від URL і тіла: інформація про клієнта, формат даних, версію, токени тощо. У реальному HTTP заголовки надсилаються окремими рядками (Content-Type: application/json, User-Agent: ..., X-Client-Version: 2.0) — req.headers збирає їх усі в один об'єкт.\n\nВажлива деталь: імена заголовків у req.headers завжди приводяться до НИЖНЬОГО РЕГІСТРУ, незалежно від того, яким регістром їх надіслав клієнт (X-Client-Version чи x-client-version — байдуже, у req.headers обидва стануть 'x-client-version'). Це офіційна поведінка HTTP (самі назви заголовків регістронезалежні) — код завжди звертається до них через нижній регістр: req.headers['x-client-version'].\n\nВласні (кастомні) заголовки з префіксом X- (чи без нього в сучасних API) часто використовують для даних, що не вписуються в стандартні заголовки: версія клієнтського застосунку, ідентифікатор запиту для трасування, внутрішні мітки.",
    examples: [
      { title: "Читання кастомного заголовка", code: `app.get('/version', (req, res) => {\n  const version = req.headers['x-client-version'];\n  res.status(200).json({ supported: version === '2.0' });\n});`, explain: "req.headers['x-client-version'] — ім'я заголовка завжди в нижньому регістрі, незалежно від того, як його надіслали." },
    ],
    task: "Створи GET /version: прочитай заголовок x-client-version і поверни {supported: true}, якщо він дорівнює '2.0', інакше {supported: false} (обидва варіанти зі статусом 200).",
    starter: `// твій код тут\n`,
    hints: [
      "req.headers['x-client-version'] — саме так, у нижньому регістрі, з квадратними дужками (дефіс у назві не дозволяє писати через крапку).",
      "res.status(200).json({ supported: version === '2.0' });",
      `app.get('/version', (req, res) => {\n  const version = req.headers['x-client-version'];\n  res.status(200).json({ supported: version === '2.0' });\n});`,
    ],
    solution: `app.get('/version', (req, res) => {\n  const version = req.headers['x-client-version'];\n  res.status(200).json({ supported: version === '2.0' });\n});`,
    testCode: `const r1 = app.request('GET', '/version', { headers: { 'x-client-version': '2.0' } });\nif (!r1._body || r1._body.supported !== true) return {pass:false, message:"Для версії 2.0 supported має бути true."};\nconst r2 = app.request('GET', '/version', { headers: { 'x-client-version': '1.0' } });\nif (!r2._body || r2._body.supported !== false) return {pass:false, message:"Для версії 1.0 supported має бути false."};\nreturn {pass:true, message:"req.headers — об'єкт із заголовками запиту; ключі завжди в нижньому регістрі, незалежно від регістру клієнта."};`,
  },
  {
    id: "backend-14",
    title: "Автентифікація через токен: POST /login",
    type: "js",
    harness: harnessWith(""),
    theory:
      "Класична схема автентифікації: клієнт надсилає логін і пароль ОДИН РАЗ на спеціальний маршрут (POST /login), а сервер, перевіривши їх, видає ТОКЕН — рядок, який клієнт далі додає до заголовка Authorization у КОЖНОМУ наступному запиті, замість повторної передачі пароля щоразу.\n\nУ реальних системах токен — це найчастіше JWT (JSON Web Token) — сам по собі містить закодовану інформацію (наприклад, ім'я користувача) і криптографічний підпис, що не дає його підробити. Тут для навчальної простоти токен — просто рядок 'tok-' + username, щоб зосередитись на ЛОГІЦІ (видати токен при успішному вході, відмовити при невдалому), а не на криптографії.\n\nПравильний код статусу для невдалого логіну — 401 Unauthorized (не 400 — дані НАДІСЛАНО коректно, просто вони не підійшли для входу, це різні ситуації). Токен, отриманий тут, — саме те значення, яке в наступних запитах піде в заголовок Authorization, як у 12-му уроці цього курсу з requireAuth.",
    examples: [
      { title: "Видача токена при вході", code: `app.post('/login', (req, res) => {\n  if (req.body.password === 'qwerty123') {\n    res.status(200).json({ token: 'tok-' + req.body.username });\n  } else {\n    res.status(401).json({ error: 'Invalid credentials' });\n  }\n});`, explain: "Токен видається лише при ПРАВИЛЬНОМУ паролі; неправильний — 401, без жодного токена." },
    ],
    task: "Створи POST /login: якщо req.body.password === 'qwerty123' — поверни 200 з {token: 'tok-' + req.body.username}, інакше 401 з {error: 'Invalid credentials'}.",
    starter: `// твій код тут\n`,
    hints: [
      "if (req.body.password === 'qwerty123') { ...200, token... } else { ...401... }",
      "'tok-' + req.body.username — конкатенація рядка з іменем користувача.",
      `app.post('/login', (req, res) => {\n  if (req.body.password === 'qwerty123') {\n    res.status(200).json({ token: 'tok-' + req.body.username });\n  } else {\n    res.status(401).json({ error: 'Invalid credentials' });\n  }\n});`,
    ],
    solution: `app.post('/login', (req, res) => {\n  if (req.body.password === 'qwerty123') {\n    res.status(200).json({ token: 'tok-' + req.body.username });\n  } else {\n    res.status(401).json({ error: 'Invalid credentials' });\n  }\n});`,
    testCode: `const r1 = app.request('POST', '/login', { body: { username: 'olena', password: 'qwerty123' } });\nif (r1.statusCode !== 200 || !r1._body || r1._body.token !== 'tok-olena') return {pass:false, message:"Правильний пароль має повернути токен 'tok-olena'."};\nconst r2 = app.request('POST', '/login', { body: { username: 'olena', password: 'wrong' } });\nif (r2.statusCode !== 401) return {pass:false, message:"Неправильний пароль має повернути 401."};\nreturn {pass:true, message:"Токен, виданий при вході, — саме те значення, яке клієнт далі передає в заголовку Authorization для доступу до захищених маршрутів."};`,
  },
  {
    id: "backend-15",
    title: "Хешування паролів: концепція",
    type: "js",
    harness: harnessWith(`function simpleHash(str) {\n  let h = 0;\n  for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) % 1000000007; }\n  return 'h' + h;\n}\nconst storedHash = simpleHash('qwerty123');`),
    theory:
      "Реальний backend НІКОЛИ не зберігає паролі користувачів у відкритому вигляді — якщо базу даних колись вкрадуть (а таке трапляється навіть у великих компаніях), відкриті паролі означають миттєвий доступ до ВСІХ акаунтів користувачів. Замість самого пароля зберігають його ХЕШ — результат односторонньої функції, з якої практично неможливо відновити оригінал.\n\nПри реєстрації сервер хешує пароль і зберігає лише хеш; при вході — хешує щойно введений пароль ЗАНОВО і порівнює ДВА ХЕШІ між собою (не самі паролі) — якщо хеші збігаються, паролі теж збігались. simpleHash тут — навчальна, спрощена демонстрація самого ПРИНЦИПУ (та сама функція завжди дає той самий результат для того самого рядка); реальні системи використовують bcrypt, argon2 чи scrypt — навмисно ПОВІЛЬНІ алгоритми з додаванням «солі» (унікального випадкового значення для кожного пароля), щоб ускладнити масовий підбір.\n\nГоловний висновок цього уроку не в конкретній функції хешування, а в ПРИНЦИПІ: порівнюй ХЕШІ, а не самі паролі, і ніколи не зберігай пароль так, щоб його можна було прочитати напряму з бази даних.",
    examples: [
      { title: "Порівняння хешів, не паролів", code: `app.post('/login2', (req, res) => {\n  if (simpleHash(req.body.password) === storedHash) {\n    res.status(200).json({ ok: true });\n  } else {\n    res.status(401).json({ error: 'Invalid credentials' });\n  }\n});`, explain: "storedHash уже готовий (нібито взятий з бази даних) — сервер порівнює ХЕШ введеного пароля з ним, а не сирий пароль." },
    ],
    task: "Створи POST /login2: порівняй simpleHash(req.body.password) зі storedHash (уже надано в пісочниці) — якщо збігається, 200 {ok: true}, інакше 401.",
    starter: `// твій код тут\n`,
    hints: [
      "simpleHash(req.body.password) === storedHash",
      "storedHash уже обчислений для правильного пароля 'qwerty123' — не потрібно рахувати його самостійно.",
      `app.post('/login2', (req, res) => {\n  if (simpleHash(req.body.password) === storedHash) {\n    res.status(200).json({ ok: true });\n  } else {\n    res.status(401).json({ error: 'Invalid credentials' });\n  }\n});`,
    ],
    solution: `app.post('/login2', (req, res) => {\n  if (simpleHash(req.body.password) === storedHash) {\n    res.status(200).json({ ok: true });\n  } else {\n    res.status(401).json({ error: 'Invalid credentials' });\n  }\n});`,
    testCode: `const r1 = app.request('POST', '/login2', { body: { password: 'qwerty123' } });\nif (r1.statusCode !== 200 || !r1._body || r1._body.ok !== true) return {pass:false, message:"Правильний пароль має повернути 200 {ok: true}."};\nconst r2 = app.request('POST', '/login2', { body: { password: 'wrong' } });\nif (r2.statusCode !== 401) return {pass:false, message:"Неправильний пароль має повернути 401."};\nreturn {pass:true, message:"Порівнюй ХЕШІ, а не самі паролі — так пароль користувача ніколи не існує в базі даних у відкритому вигляді."};`,
  },
  {
    id: "backend-16",
    title: "Обробка помилок: error-handling middleware",
    type: "js",
    harness: harnessWith(""),
    theory:
      "Якщо обробник маршруту кине помилку (throw new Error(...)) — наприклад, через несподівано некоректні дані чи збій у якійсь внутрішній операції — без спеціальної обробки застосунок просто впав би з незрозумілою відповіддю. Error-handling middleware ловить такі помилки й перетворює їх на охайну HTTP-відповідь.\n\nВідрізняється від звичайного middleware КІЛЬКІСТЮ параметрів: error-handling middleware приймає ЧОТИРИ аргументи — (err, req, res, next), а не три. Це не довільна угода — так побудований сам механізм: якщо десь у ланцюжку сталась помилка, керування автоматично передається САМЕ такому, 4-аргументному middleware, обходячи решту.\n\nТиповий error-handling middleware повертає 500 Internal Server Error з коротким описом: res.status(500).json({ error: err.message }) — err.message містить текст, переданий у new Error(...). Це останній рубіж захисту: навіть якщо десь у коді трапилась непередбачена помилка, клієнт отримає ОХАЙНУ відповідь, а не обірваний запит.",
    examples: [
      { title: "Обробник, що падає, і error middleware", code: `app.get('/risky', (req, res) => {\n  throw new Error('Щось зламалось');\n});\n\napp.use((err, req, res, next) => {\n  res.status(500).json({ error: err.message });\n});`, explain: "Помилка з /risky автоматично потрапляє в error-handling middleware (4 аргументи) завдяки самому механізму, без явного try/catch у самому обробнику." },
    ],
    task: "Створи GET /risky, що кидає throw new Error('Щось зламалось'), і глобальний error-handling middleware (err, req, res, next), що повертає 500 з {error: err.message}.",
    starter: `// твій код тут\n`,
    hints: [
      "app.get('/risky', (req, res) => { throw new Error('Щось зламалось'); });",
      "app.use((err, req, res, next) => { res.status(500).json({ error: err.message }); }); — САМЕ 4 параметри.",
      `app.get('/risky', (req, res) => {\n  throw new Error('Щось зламалось');\n});\n\napp.use((err, req, res, next) => {\n  res.status(500).json({ error: err.message });\n});`,
    ],
    solution: `app.get('/risky', (req, res) => {\n  throw new Error('Щось зламалось');\n});\n\napp.use((err, req, res, next) => {\n  res.status(500).json({ error: err.message });\n});`,
    testCode: `const res = app.request('GET', '/risky');\nif (res.statusCode !== 500) return {pass:false, message:"Статус має бути 500 (зараз: " + res.statusCode + ")."};\nif (!res._body || res._body.error !== 'Щось зламалось') return {pass:false, message:"Тіло відповіді має містити { error: 'Щось зламалось' }."};\nreturn {pass:true, message:"Error-handling middleware (4 аргументи) автоматично ловить помилки з обробників — без ручного try/catch у кожному з них окремо."};`,
  },
  {
    id: "backend-17",
    title: "Пагінація: limit і offset",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED),
    theory:
      "Коли колекція ресурсів велика (тисячі записів), повертати ВСЮ її одним запитом неефективно й повільно — пагінація дозволяє клієнту запитувати дані ЧАСТИНАМИ: /products?limit=10&offset=20 означає «10 записів, починаючи з 21-го» (offset — скільки пропустити з початку).\n\nУсередині обробника це напряму відповідає масивовому методу slice(offset, offset + limit) — той самий підхід, що вже знайомий з роботи з масивами: slice(20, 30) поверне записи з індексами 20-29.\n\nЗначення за замовчуванням важливі: якщо клієнт НЕ передав limit чи offset, розумно повернути ВСІ записи (чи перші N за замовчуванням) і offset = 0, а не падати з помилкою через відсутні query-параметри — Number(req.query.limit) || products.length дає саме таку поведінку (|| підставляє запасне значення, якщо ліва частина falsy — 0, undefined чи NaN).",
    examples: [
      { title: "limit і offset через slice", code: `app.get('/products', (req, res) => {\n  const limit = Number(req.query.limit) || products.length;\n  const offset = Number(req.query.offset) || 0;\n  res.status(200).json(products.slice(offset, offset + limit));\n});`, explain: "products.slice(offset, offset + limit) — стандартний спосіб 'нарізати' масив на сторінки." },
    ],
    task: "Створи GET /products із пагінацією: query-параметри limit і offset визначають, яку частину масиву products повернути (через slice).",
    starter: `// твій код тут\n`,
    hints: [
      "const limit = Number(req.query.limit) || products.length; const offset = Number(req.query.offset) || 0;",
      "products.slice(offset, offset + limit)",
      `app.get('/products', (req, res) => {\n  const limit = Number(req.query.limit) || products.length;\n  const offset = Number(req.query.offset) || 0;\n  res.status(200).json(products.slice(offset, offset + limit));\n});`,
    ],
    solution: `app.get('/products', (req, res) => {\n  const limit = Number(req.query.limit) || products.length;\n  const offset = Number(req.query.offset) || 0;\n  res.status(200).json(products.slice(offset, offset + limit));\n});`,
    testCode: `const r1 = app.request('GET', '/products?limit=2&offset=1');\nif (!Array.isArray(r1._body) || r1._body.length !== 2) return {pass:false, message:"limit=2&offset=1 має повернути рівно 2 товари."};\nif (r1._body[0].name !== 'Тіні забутих предків') return {pass:false, message:"Перший товар при offset=1 має бути 'Тіні забутих предків' (другий у масиві, індекс 1)."};\nconst r2 = app.request('GET', '/products');\nif (!Array.isArray(r2._body) || r2._body.length !== 4) return {pass:false, message:"Без limit/offset має повернутись усі 4 товари."};\nreturn {pass:true, message:"limit/offset + slice — стандартний і простий спосіб 'нарізати' велику колекцію на сторінки."};`,
  },
  {
    id: "backend-18",
    title: "Пошук через query-параметр",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED),
    theory:
      "Пошук за текстом — ще один типовий query-параметр: /products?search=смартфон повертає товари, чия назва МІСТИТЬ цей підрядок (не обов'язково збігається ПОВНІСТЮ). toLowerCase() з обох боків порівняння робить пошук РЕГІСТРОНЕЗАЛЕЖНИМ — 'Смартфон' і 'смартфон' мають знаходитись однаково.\n\nname.toLowerCase().includes(search.toLowerCase()) — типовий патерн: обидва рядки приводять до одного регістру ПЕРЕД порівнянням, а includes() перевіряє входження підрядка в будь-якому місці, а не лише збіг з початку.\n\nЯк і з фільтрацією за категорією раніше, пошук — НЕОБОВ'ЯЗКОВИЙ query-параметр: якщо search не передано, повертають усі записи без жодної фільтрації.",
    examples: [
      { title: "Регістронезалежний пошук підрядка", code: `app.get('/products', (req, res) => {\n  if (req.query.search) {\n    const term = req.query.search.toLowerCase();\n    res.status(200).json(products.filter(p => p.name.toLowerCase().includes(term)));\n  } else {\n    res.status(200).json(products);\n  }\n});`, explain: "toLowerCase() з обох боків — пошук працює однаково для 'Смартфон', 'смартфон' чи 'СМАРТФОН'." },
    ],
    task: "Створи GET /products: якщо задано query-параметр search — поверни товари, чия name МІСТИТЬ цей підрядок (регістронезалежно), інакше всі товари.",
    starter: `// твій код тут\n`,
    hints: [
      "req.query.search.toLowerCase() і product.name.toLowerCase().includes(...)",
      "Не забудь обробити випадок, коли search взагалі не передано.",
      `app.get('/products', (req, res) => {\n  if (req.query.search) {\n    const term = req.query.search.toLowerCase();\n    res.status(200).json(products.filter(p => p.name.toLowerCase().includes(term)));\n  } else {\n    res.status(200).json(products);\n  }\n});`,
    ],
    solution: `app.get('/products', (req, res) => {\n  if (req.query.search) {\n    const term = req.query.search.toLowerCase();\n    res.status(200).json(products.filter(p => p.name.toLowerCase().includes(term)));\n  } else {\n    res.status(200).json(products);\n  }\n});`,
    testCode: `const r1 = app.request('GET', '/products?search=смартфон');\nif (!Array.isArray(r1._body) || r1._body.length !== 1 || r1._body[0].name !== 'Смартфон Xiaomi') return {pass:false, message:"Пошук 'смартфон' має знайти рівно 'Смартфон Xiaomi'."};\nconst r2 = app.request('GET', '/products');\nif (!Array.isArray(r2._body) || r2._body.length !== 4) return {pass:false, message:"Без search має повернутись усі 4 товари."};\nreturn {pass:true, message:"toLowerCase() з обох боків порівняння — стандартний спосіб зробити текстовий пошук регістронезалежним."};`,
  },
  {
    id: "backend-19",
    title: "Обмеження частоти запитів (rate limiting)",
    type: "js",
    harness: harnessWith(PING_ROUTE + "\nlet requestCount = 0;"),
    theory:
      "Rate limiting захищає сервер від ПЕРЕВАНТАЖЕННЯ — навмисного (атака) чи випадкового (баг у клієнтському коді, що шле запити в циклі без паузи): після певної кількості запитів за проміжок часу сервер починає відповідати 429 Too Many Requests замість того, щоб обробляти запит як завжди.\n\nНайпростіша реалізація — лічильник у middleware: кожен запит збільшує requestCount, і якщо він перевищив межу — 429 без виклику next() (запит не потрапляє далі, до самого обробника). Реальні системи рахують запити за ВІКНО ЧАСУ (наприклад, 100 запитів за хвилину, з періодичним скиданням лічильника), а не назавжди — тут для простоти лічильник ніколи не скидається.\n\n429 — це 4xx-код (помилка з боку клієнта: «ти надсилаєш забагато запитів»), і часто супроводжується заголовком Retry-After, що підказує клієнту, через скільки секунд можна спробувати знову.",
    examples: [
      { title: "Лічильник запитів у middleware", code: `app.use((req, res, next) => {\n  requestCount++;\n  if (requestCount > 3) {\n    res.status(429).json({ error: 'Too Many Requests' });\n    return;\n  }\n  next();\n});`, explain: "Перші 3 запити пройдуть як завжди, четвертий і всі наступні отримають 429." },
    ],
    task: "Додай middleware, що збільшує requestCount на кожен запит; якщо requestCount перевищив 3 — поверни 429 з {error: 'Too Many Requests'} (без next()), інакше пропусти запит далі.",
    starter: `// твій код тут\n`,
    hints: [
      "requestCount++; if (requestCount > 3) { ...429...; return; } next();",
      "requestCount уже оголошено в пісочниці — просто використовуй його.",
      `app.use((req, res, next) => {\n  requestCount++;\n  if (requestCount > 3) {\n    res.status(429).json({ error: 'Too Many Requests' });\n    return;\n  }\n  next();\n});`,
    ],
    solution: `app.use((req, res, next) => {\n  requestCount++;\n  if (requestCount > 3) {\n    res.status(429).json({ error: 'Too Many Requests' });\n    return;\n  }\n  next();\n});`,
    testCode: `const codes = [];\nfor (let i = 0; i < 4; i++) { codes.push(app.request('GET', '/ping').statusCode); }\nif (codes[0] !== 200 || codes[1] !== 200 || codes[2] !== 200) return {pass:false, message:"Перші 3 запити мають пройти зі статусом 200 (отримано: " + JSON.stringify(codes) + ")."};\nif (codes[3] !== 429) return {pass:false, message:"4-й запит має отримати 429 Too Many Requests (отримано: " + codes[3] + ")."};\nreturn {pass:true, message:"Rate limiting захищає сервер від перевантаження — 429 сигналізує клієнту 'зачекай, ти надсилаєш забагато запитів'."};`,
  },
  {
    id: "backend-20",
    title: "In-memory сховище: масив як 'база даних'",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED),
    theory:
      "Увесь цей курс дані зберігались у ЗВИЧАЙНОМУ МАСИВІ JS (products) — це і є «in-memory» (в оперативній пам'яті) сховище: швидко, просто, зручно для навчання, але ТИМЧАСОВО — щойно сервер перезапуститься, весь масив обнулиться до початкового стану, і всі зміни, зроблені через POST/PUT/DELETE, зникнуть назавжди.\n\nСаме тому курс SQL — не окрема, не пов'язана тема: реальний backend майже завжди зберігає дані в СПРАВЖНІЙ базі даних (SQLite, PostgreSQL, MongoDB), а не в змінній масиву — обробник POST /products, замість products.push(...), робив би щось на кшталт INSERT INTO products (...) VALUES (...) з курсу SQL, і дані пережили б перезапуск сервера.\n\nЦей урок — міст між двома курсами: та сама ЛОГІКА обробника (перевір дані, збережи запис, поверни результат) лишається однаковою незалежно від того, ЩО САМЕ зберігає дані — масив у пам'яті чи реальна база. products.push(...) сьогодні, db.exec('INSERT INTO ...') — у реальному проєкті.",
    examples: [
      { title: "Зміни в масиві живуть, доки живе сервер", code: `app.get('/products/count', (req, res) => {\n  res.status(200).json({ count: products.length });\n});\napp.post('/products', (req, res) => {\n  products.push({ id: products.length + 1, name: req.body.name });\n  res.status(201).json({ ok: true });\n});`, explain: "Після POST лічильник /products/count одразу покаже на 1 більше — зміни в масиві видно одразу всім наступним запитам, ПОКИ сервер працює." },
    ],
    task: "Створи GET /products/count (повертає {count: products.length}) і POST /products (додає {id: products.length + 1, name: req.body.name} у масив, повертає {ok: true} зі статусом 201).",
    starter: `// твій код тут\n`,
    hints: [
      "GET /products/count: res.status(200).json({ count: products.length });",
      "POST /products: products.push({...}); res.status(201).json({ ok: true });",
      `app.get('/products/count', (req, res) => {\n  res.status(200).json({ count: products.length });\n});\napp.post('/products', (req, res) => {\n  products.push({ id: products.length + 1, name: req.body.name });\n  res.status(201).json({ ok: true });\n});`,
    ],
    solution: `app.get('/products/count', (req, res) => {\n  res.status(200).json({ count: products.length });\n});\napp.post('/products', (req, res) => {\n  products.push({ id: products.length + 1, name: req.body.name });\n  res.status(201).json({ ok: true });\n});`,
    testCode: `const before = app.request('GET', '/products/count');\nif (!before._body || before._body.count !== 4) return {pass:false, message:"До POST count має бути 4."};\napp.request('POST', '/products', { body: { name: 'Кепка' } });\nconst after = app.request('GET', '/products/count');\nif (!after._body || after._body.count !== 5) return {pass:false, message:"Після POST count має стати 5 — зміни в масиві мають зберігатись між запитами, ПОКИ сервер (тут — пісочниця) не перезапущено."};\nreturn {pass:true, message:"Масив products тут грає роль тимчасової 'бази даних' — саме цю роль у реальному проєкті виконує SQLite/PostgreSQL з курсу SQL."};`,
  },
  {
    id: "backend-21",
    title: "Повний CRUD для одного ресурсу",
    type: "js",
    harness: harnessWith("let tasks = [];"),
    theory:
      "CRUD — Create, Read, Update, Delete — чотири базові операції, які майже КОЖЕН ресурс реального API підтримує в тій чи іншій формі: POST для створення, GET для читання (списку й одного запису), PUT для оновлення, DELETE для видалення. Досі кожен урок навчав ОДНУ з цих операцій окремо — цей урок збирає всі п'ять маршрутів РАЗОМ, для нового ресурсу tasks (задачі), з нуля.\n\nЦе саме той шаблон, який повторюється для БУДЬ-ЯКОГО ресурсу реального застосунку (products, customers, tasks, articles, comments — структура однакова, змінюються лише поля): GET /tasks (список), GET /tasks/:id (один), POST /tasks (створити), PUT /tasks/:id (оновити), DELETE /tasks/:id (видалити).\n\nЩойно цей шаблон засвоєно для ОДНОГО ресурсу — додати ще один (наприклад, articles) стає питанням копіювання структури й заміни назви поля, а не вигадування логіки заново.",
    examples: [
      { title: "П'ять маршрутів одного ресурсу", code: `app.get('/tasks', (req, res) => { res.status(200).json(tasks); });\napp.get('/tasks/:id', (req, res) => {\n  const task = tasks.find(t => t.id === Number(req.params.id));\n  if (!task) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(task);\n});\napp.post('/tasks', (req, res) => {\n  const task = { id: tasks.length + 1, title: req.body.title, done: false };\n  tasks.push(task);\n  res.status(201).json(task);\n});\napp.put('/tasks/:id', (req, res) => {\n  const task = tasks.find(t => t.id === Number(req.params.id));\n  if (!task) { res.status(404).json({ error: 'Not found' }); return; }\n  task.done = req.body.done;\n  res.status(200).json(task);\n});\napp.delete('/tasks/:id', (req, res) => {\n  const index = tasks.findIndex(t => t.id === Number(req.params.id));\n  if (index === -1) { res.status(404).json({ error: 'Not found' }); return; }\n  tasks.splice(index, 1);\n  res.status(204).end();\n});`, explain: "П'ять окремих маршрутів — той самий шаблон, що й у кожному з попередніх уроків, лише зібраний разом для нового ресурсу." },
    ],
    task: "Створи повний CRUD для ресурсу tasks (задачі, {id, title, done}): GET /tasks, GET /tasks/:id, POST /tasks (title з req.body, done: false), PUT /tasks/:id (оновлює done з req.body), DELETE /tasks/:id.",
    starter: `// твій код тут — п'ять маршрутів\n`,
    hints: [
      "Використай ту саму структуру, що й для products у попередніх уроках — лише для нового масиву tasks.",
      "POST створює { id: tasks.length + 1, title: req.body.title, done: false }; PUT оновлює лише done.",
      `app.get('/tasks', (req, res) => { res.status(200).json(tasks); });\napp.get('/tasks/:id', (req, res) => {\n  const task = tasks.find(t => t.id === Number(req.params.id));\n  if (!task) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(task);\n});\napp.post('/tasks', (req, res) => {\n  const task = { id: tasks.length + 1, title: req.body.title, done: false };\n  tasks.push(task);\n  res.status(201).json(task);\n});\napp.put('/tasks/:id', (req, res) => {\n  const task = tasks.find(t => t.id === Number(req.params.id));\n  if (!task) { res.status(404).json({ error: 'Not found' }); return; }\n  task.done = req.body.done;\n  res.status(200).json(task);\n});\napp.delete('/tasks/:id', (req, res) => {\n  const index = tasks.findIndex(t => t.id === Number(req.params.id));\n  if (index === -1) { res.status(404).json({ error: 'Not found' }); return; }\n  tasks.splice(index, 1);\n  res.status(204).end();\n});`,
    ],
    solution: `app.get('/tasks', (req, res) => { res.status(200).json(tasks); });\napp.get('/tasks/:id', (req, res) => {\n  const task = tasks.find(t => t.id === Number(req.params.id));\n  if (!task) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(task);\n});\napp.post('/tasks', (req, res) => {\n  const task = { id: tasks.length + 1, title: req.body.title, done: false };\n  tasks.push(task);\n  res.status(201).json(task);\n});\napp.put('/tasks/:id', (req, res) => {\n  const task = tasks.find(t => t.id === Number(req.params.id));\n  if (!task) { res.status(404).json({ error: 'Not found' }); return; }\n  task.done = req.body.done;\n  res.status(200).json(task);\n});\napp.delete('/tasks/:id', (req, res) => {\n  const index = tasks.findIndex(t => t.id === Number(req.params.id));\n  if (index === -1) { res.status(404).json({ error: 'Not found' }); return; }\n  tasks.splice(index, 1);\n  res.status(204).end();\n});`,
    testCode: `const created = app.request('POST', '/tasks', { body: { title: 'Купити хліб' } });\nif (created.statusCode !== 201 || !created._body || created._body.title !== 'Купити хліб') return {pass:false, message:"POST /tasks має створити задачу зі статусом 201."};\nconst list = app.request('GET', '/tasks');\nif (!Array.isArray(list._body) || list._body.length !== 1) return {pass:false, message:"GET /tasks має повернути масив з 1 задачею."};\nconst id = created._body.id;\nconst one = app.request('GET', '/tasks/' + id);\nif (one.statusCode !== 200) return {pass:false, message:"GET /tasks/:id має знайти щойно створену задачу."};\nconst updated = app.request('PUT', '/tasks/' + id, { body: { done: true } });\nif (!updated._body || updated._body.done !== true) return {pass:false, message:"PUT /tasks/:id має позначити задачу виконаною."};\nconst deleted = app.request('DELETE', '/tasks/' + id);\nif (deleted.statusCode !== 204) return {pass:false, message:"DELETE /tasks/:id має повернути 204."};\nconst listAfter = app.request('GET', '/tasks');\nif (!Array.isArray(listAfter._body) || listAfter._body.length !== 0) return {pass:false, message:"Після DELETE задач має лишитись 0."};\nreturn {pass:true, message:"П'ять маршрутів разом — GET (список і один), POST, PUT, DELETE — увесь життєвий цикл ресурсу, від створення до видалення."};`,
  },
  {
    id: "backend-22",
    title: "Вкладені ресурси: /customers/:id/orders",
    type: "js",
    harness: harnessWith(CUSTOMERS_SEED + "\n" + ORDERS_SEED),
    theory:
      "Іноді ресурс природно належить ІНШОМУ ресурсу — замовлення (orders) належать конкретному клієнту (customer). REST дозволяє відобразити цей зв'язок прямо в шляху: GET /customers/:id/orders — «усі замовлення ЦЬОГО клієнта», а не окремий маршрут на кшталт /orders?customerId=1.\n\nОбробник такого маршруту зазвичай робить ДВІ речі: спочатку перевіряє, що батьківський ресурс (клієнт) узагалі існує (інакше — 404, як завжди), а вже потім фільтрує дочірні записи (orders.filter(o => o.customerId === customerId)) за посиланням на цього клієнта.\n\nВкладеність у шляху не обов'язково означає вкладеність у САМИХ ДАНИХ — orders тут лишається окремим, звичайним масивом, який лише має поле customerId, що посилається на клієнта; це та сама структура, що й у таблицях orders/customers з курсу SQL, лише доступна тепер через HTTP-шлях, а не SQL-запит.",
    examples: [
      { title: "Замовлення конкретного клієнта", code: `app.get('/customers/:id/orders', (req, res) => {\n  const customerId = Number(req.params.id);\n  const customer = customers.find(c => c.id === customerId);\n  if (!customer) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(orders.filter(o => o.customerId === customerId));\n});`, explain: "Спочатку перевірка, що клієнт існує, потім фільтрація orders саме за ним." },
    ],
    task: "Створи GET /customers/:id/orders: якщо клієнт не знайдений — 404; інакше поверни всі замовлення (orders) цього клієнта.",
    starter: `// твій код тут\n`,
    hints: [
      "Спочатку знайди клієнта за req.params.id, як у 9-му уроці.",
      "orders.filter(o => o.customerId === customerId)",
      `app.get('/customers/:id/orders', (req, res) => {\n  const customerId = Number(req.params.id);\n  const customer = customers.find(c => c.id === customerId);\n  if (!customer) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(orders.filter(o => o.customerId === customerId));\n});`,
    ],
    solution: `app.get('/customers/:id/orders', (req, res) => {\n  const customerId = Number(req.params.id);\n  const customer = customers.find(c => c.id === customerId);\n  if (!customer) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(orders.filter(o => o.customerId === customerId));\n});`,
    testCode: `const r1 = app.request('GET', '/customers/1/orders');\nif (!Array.isArray(r1._body) || r1._body.length !== 2) return {pass:false, message:"Клієнт 1 (Олена) має мати 2 замовлення (зараз: " + (r1._body && r1._body.length) + ")."};\nconst r2 = app.request('GET', '/customers/999/orders');\nif (r2.statusCode !== 404) return {pass:false, message:"Неіснуючий клієнт має повернути 404."};\nreturn {pass:true, message:"Вкладений шлях (/customers/:id/orders) природно відображає зв'язок 'клієнт має багато замовлень' прямо в структурі URL."};`,
  },
  {
    id: "backend-23",
    title: "Фінальний проєкт: міні REST API для магазину",
    type: "js",
    harness: harnessWith(PRODUCTS_SEED + "\n" + CUSTOMERS_SEED + "\n" + ORDERS_SEED),
    theory:
      "Останній крок: зібрати ВСЕ, вивчене в цьому курсі, в один цілісний API для того самого магазину з курсу SQL — маршрути з параметрами, query-фільтрацію, POST зі створенням і валідацією, і захищений middleware маршрут, і вкладений ресурс — усе разом, як частини ОДНОГО застосунку, а не ізольовані вправи.\n\nЦе саме той API, обіцяний ще на вступній сторінці «Що це?»: GET /products (з фільтром за category), GET /products/:id, POST /products (захищений через requireAuth — лише з правильним токеном можна ДОДАВАТИ товари), GET /customers/:id/orders. Кожен маршрут — комбінація технік з попередніх уроків, а не щось нове.\n\nФінальний код нижче написаний на мові МІНІ-фреймворка цього курсу, але дивись на «Як запустити це на своєму комп'ютері» — там той самий код, переписаний на РЕАЛЬНОМУ Express, майже слово в слово: усе, що ти навчився писати тут, працює в справжньому Node.js-сервері практично без змін.",
    examples: [
      { title: "Захищений POST серед звичайних маршрутів", code: `function requireAuth(req, res, next) {\n  if (req.headers.authorization !== 'Bearer secret123') {\n    res.status(401).json({ error: 'Unauthorized' });\n    return;\n  }\n  next();\n}\n\napp.post('/products', requireAuth, (req, res) => {\n  if (!req.body.name) { res.status(400).json({ error: 'name is required' }); return; }\n  const p = { id: products.length + 1, name: req.body.name, category: req.body.category, price: req.body.price };\n  products.push(p);\n  res.status(201).json(p);\n});`, explain: "requireAuth (12-й урок) + валідація (6-й урок) + створення ресурсу (5-й урок) — усе в одному обробнику." },
    ],
    task: "Створи: GET /products (з опційним query category), GET /products/:id (404 якщо не знайдено), POST /products (захищений requireAuth, валідує name, інакше 400), GET /customers/:id/orders.",
    starter: `// твій код тут — увесь фінальний API\n`,
    hints: [
      "Це комбінація технік з 2, 3, 6, 9, 12 і 22 уроків — переглянь їх, якщо забув(-ла) якийсь шматок.",
      "requireAuth оголоси один раз, застосуй лише до POST /products (третім аргументом).",
      `function requireAuth(req, res, next) {\n  if (req.headers.authorization !== 'Bearer secret123') {\n    res.status(401).json({ error: 'Unauthorized' });\n    return;\n  }\n  next();\n}\n\napp.get('/products', (req, res) => {\n  if (req.query.category) {\n    res.status(200).json(products.filter(p => p.category === req.query.category));\n  } else {\n    res.status(200).json(products);\n  }\n});\n\napp.get('/products/:id', (req, res) => {\n  const product = products.find(p => p.id === Number(req.params.id));\n  if (!product) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(product);\n});\n\napp.post('/products', requireAuth, (req, res) => {\n  if (!req.body.name) { res.status(400).json({ error: 'name is required' }); return; }\n  const p = { id: products.length + 1, name: req.body.name, category: req.body.category, price: req.body.price };\n  products.push(p);\n  res.status(201).json(p);\n});\n\napp.get('/customers/:id/orders', (req, res) => {\n  const customerId = Number(req.params.id);\n  const customer = customers.find(c => c.id === customerId);\n  if (!customer) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(orders.filter(o => o.customerId === customerId));\n});`,
    ],
    solution: `function requireAuth(req, res, next) {\n  if (req.headers.authorization !== 'Bearer secret123') {\n    res.status(401).json({ error: 'Unauthorized' });\n    return;\n  }\n  next();\n}\n\napp.get('/products', (req, res) => {\n  if (req.query.category) {\n    res.status(200).json(products.filter(p => p.category === req.query.category));\n  } else {\n    res.status(200).json(products);\n  }\n});\n\napp.get('/products/:id', (req, res) => {\n  const product = products.find(p => p.id === Number(req.params.id));\n  if (!product) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(product);\n});\n\napp.post('/products', requireAuth, (req, res) => {\n  if (!req.body.name) { res.status(400).json({ error: 'name is required' }); return; }\n  const p = { id: products.length + 1, name: req.body.name, category: req.body.category, price: req.body.price };\n  products.push(p);\n  res.status(201).json(p);\n});\n\napp.get('/customers/:id/orders', (req, res) => {\n  const customerId = Number(req.params.id);\n  const customer = customers.find(c => c.id === customerId);\n  if (!customer) { res.status(404).json({ error: 'Not found' }); return; }\n  res.status(200).json(orders.filter(o => o.customerId === customerId));\n});`,
    testCode: `const r1 = app.request('GET', '/products?category=Книги');\nif (!Array.isArray(r1._body) || r1._body.length !== 2) return {pass:false, message:"GET /products?category=Книги має повернути 2 товари."};\nconst r2 = app.request('GET', '/products/3');\nif (r2.statusCode !== 200 || r2._body.name !== 'Навушники JBL') return {pass:false, message:"GET /products/3 має повернути 'Навушники JBL'."};\nconst r3 = app.request('POST', '/products', { body: { name: 'Кепка' } });\nif (r3.statusCode !== 401) return {pass:false, message:"POST /products без токена має повернути 401."};\nconst r4 = app.request('POST', '/products', { headers: { Authorization: 'Bearer secret123' }, body: {} });\nif (r4.statusCode !== 400) return {pass:false, message:"POST /products з токеном, але без name, має повернути 400."};\nconst r5 = app.request('POST', '/products', { headers: { Authorization: 'Bearer secret123' }, body: { name: 'Кепка', category: 'Одяг', price: 300 } });\nif (r5.statusCode !== 201 || !r5._body || r5._body.name !== 'Кепка') return {pass:false, message:"POST /products з токеном і коректними даними має повернути 201 і новий товар."};\nconst r6 = app.request('GET', '/customers/1/orders');\nif (!Array.isArray(r6._body) || r6._body.length !== 2) return {pass:false, message:"GET /customers/1/orders має повернути 2 замовлення."};\nreturn {pass:true, message:"Готово! Це і є завершений міні REST API для магазину — зібраний тобою крок за кроком за весь курс."};`,
    finalProject: {
      techs: ["HTTP-методи (GET/POST/PUT/DELETE)", "коди статусу", "middleware (глобальний і для маршруту)", "автентифікація через токен", "REST-конвенції", "Express (реальний еквівалент)"],
      skills: [
        "Маршрути з параметрами (:id) і query-рядком (фільтрація, пошук, пагінація)",
        "Коректні коди статусу (200/201/204/400/401/403/404/429/500)",
        "Middleware: глобальний (app.use), для одного маршруту, error-handling (4 аргументи)",
        "Валідація вхідних даних і автентифікація через токен",
        "Повний CRUD для ресурсу та вкладені ресурси (customers/:id/orders)",
        "REST-конвенції іменування маршрутів",
      ],
      structure:
        "server.js\n  ├── GET  /products             # список (?category=... опційно)\n  ├── GET  /products/:id         # один товар\n  ├── POST /products             # створення (requireAuth + валідація)\n  ├── GET  /customers/:id/orders # замовлення клієнта (вкладений ресурс)\n  └── requireAuth(req,res,next)  # middleware-охоронець",
      code: `function requireAuth(req, res, next) {
  if (req.headers.authorization !== 'Bearer secret123') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

app.get('/products', (req, res) => {
  if (req.query.category) {
    res.status(200).json(products.filter(p => p.category === req.query.category));
  } else {
    res.status(200).json(products);
  }
});

app.post('/products', requireAuth, (req, res) => {
  if (!req.body.name) { res.status(400).json({ error: 'name is required' }); return; }
  const p = { id: products.length + 1, name: req.body.name, price: req.body.price };
  products.push(p);
  res.status(201).json(p);
});`,
      runCommand: "npm install express && node server.js",
      installGuide: {
        intro: "Усе, написане в цьому курсі, працює в РЕАЛЬНОМУ Express майже без змін — синтаксис навмисно ідентичний. Ось той самий фінальний код, переписаний на справжній, запускний Node.js-сервер.",
        steps: [
          { title: "Встанови Node.js і створи проєкт", text: "Завантаж Node.js з nodejs.org, потім у порожній папці: npm init -y && npm install express" },
          { title: "Створи server.js", code: `const express = require('express');\nconst app = express();\napp.use(express.json());\n\nlet products = [\n  { id: 1, name: 'Кобзар', category: 'Книги', price: 250 },\n];\n\nfunction requireAuth(req, res, next) {\n  if (req.headers.authorization !== 'Bearer secret123') {\n    return res.status(401).json({ error: 'Unauthorized' });\n  }\n  next();\n}\n\napp.get('/products', (req, res) => {\n  res.json(products);\n});\n\napp.post('/products', requireAuth, (req, res) => {\n  if (!req.body.name) return res.status(400).json({ error: 'name is required' });\n  const p = { id: products.length + 1, ...req.body };\n  products.push(p);\n  res.status(201).json(p);\n});\n\napp.listen(3000, () => console.log('Сервер працює на http://localhost:3000'));` },
          { title: "Запусти сервер", code: "node server.js" },
          { title: "Перевір у іншому терміналі", code: "curl http://localhost:3000/products" },
        ],
      },
      improvements: [
        "Підключити справжню SQLite замість масиву в пам'яті (курс SQL — та сама структура products/customers/orders)",
        "Замінити токен-заглушку на справжній JWT (пакет jsonwebtoken)",
        "Додати express-validator для декларативної валідації замість ручних перевірок if",
        "Додати express-rate-limit замість власного лічильника",
      ],
      nextLevel:
        "Далі — курс Full Stack: той самий сервер розгортається в git-репозиторій, пакується в Docker-контейнер, і виставляється в інтернет через CI/CD — від коду на своєму комп'ютері до реального, доступного всім URL.",
    },
  },
];
