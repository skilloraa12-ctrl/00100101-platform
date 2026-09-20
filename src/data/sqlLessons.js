// SQL — the one course (besides Python/TypeScript) whose code runs for REAL:
// every query executes against an actual SQLite database compiled to
// WebAssembly (sql.js, self-hosted at /sql/sql-wasm.js + /sql/sql-wasm.wasm),
// via runSqlCheck in App.jsx. Each lesson gets a FRESH in-memory database
// built from its own setupSql before the learner's query runs — real syntax
// errors, real constraint violations, real query results, not pattern
// matching against the text the learner typed.
//
// Most lessons share one running "shop" schema/dataset (products, customers,
// orders) so JOINs/subqueries/reports feel like one real database, not
// disconnected exercises. A handful of lessons (CREATE TABLE, INSERT,
// UPDATE, DELETE, constraints, ALTER TABLE, transactions, self-join) use
// their own small, focused schemas since they're about MODIFYING data/
// structure, or need a data shape the shop tables don't have (a self-
// referencing employees table, nullable comments, bank-account balances).
const SHOP_SETUP_SQL = `
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL, stock INTEGER);
INSERT INTO products (id, name, category, price, stock) VALUES
  (1, 'Кобзар', 'Книги', 250, 12),
  (2, 'Тіні забутих предків', 'Книги', 180, 5),
  (3, 'Навушники JBL', 'Електроніка', 1200, 8),
  (4, 'Смартфон Xiaomi', 'Електроніка', 8500, 3),
  (5, 'Футболка бавовняна', 'Одяг', 350, 20),
  (6, 'Джинси класичні', 'Одяг', 900, 10);

CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
INSERT INTO customers (id, name, city) VALUES
  (1, 'Олена Коваль', 'Київ'),
  (2, 'Андрій Бондар', 'Львів'),
  (3, 'Марія Гнатюк', 'Одеса'),
  (4, 'Іван Ткач', 'Київ'),
  (5, 'Тарас Мельник', 'Дніпро');

CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, quantity INTEGER, order_date TEXT);
INSERT INTO orders (id, customer_id, product_id, quantity, order_date) VALUES
  (1, 1, 1, 2, '2024-01-05'),
  (2, 1, 3, 1, '2024-01-10'),
  (3, 2, 5, 3, '2024-01-12'),
  (4, 3, 4, 1, '2024-02-01'),
  (5, 4, 2, 2, '2024-02-03'),
  (6, 1, 1, 1, '2024-02-15'),
  (7, 2, 3, 2, '2024-03-01'),
  (8, 3, 5, 1, '2024-03-05');
`;

export const SQL_LESSONS = [
  {
    id: "sql-intro",
    title: "Що це? — SQL",
    type: "intro",
    theory:
      "SQL (Structured Query Language) — мова для роботи з РЕЛЯЦІЙНИМИ базами даних: даними, організованими у таблиці зі стовпцями й рядками, як у величезній, суворо структурованій електронній таблиці. На відміну від Python чи TypeScript, SQL не описує ПОСЛІДОВНІСТЬ дій — він описує, ЩО саме потрібно отримати чи змінити, а сама база даних вирішує, як це зробити найефективніше.\n\nБудь-який реальний застосунок — інтернет-магазин, соцмережа, банківський додаток — десь усередині зберігає дані саме в таблицях і звертається до них через SQL: список товарів, замовлення клієнтів, повідомлення користувачів. Це РОБОЧИЙ інструмент, з яким стикається практично кожен розробник, незалежно від того, пише він фронтенд, бекенд чи аналізує дані.\n\nУ цьому курсі кожен запит виконується по-справжньому: у браузері працює реальна SQLite (та сама база даних, що вбудована в мільйони застосунків), скомпільована у WebAssembly. Немає жодної імітації — синтаксична помилка в запиті дасть справжню помилку від бази даних, а правильний запит поверне справжню таблицю результатів.\n\nЩо ти отримаєш після цього курсу: впевнене читання й написання SQL-запитів — від базового SELECT до JOIN, підзапитів, CTE, віконних функцій і транзакцій — і фінальний звіт по невеликому «магазину» з клієнтами, товарами й замовленнями, який ти збереш власними запитами, крок за кроком.",
    presentation: [
      { title: "SQL коротко", points: ["Мова для роботи з таблицями реляційних баз даних", "Описує ЩО отримати, а не ЯК саме це зробити", "Використовується практично в кожному реальному застосунку"] },
      { title: "Результат", points: ["Понад 30 уроків, кожен додає нову можливість", "Фінал: звіт по магазину — клієнти, товари, замовлення", "Кожен запит реально виконується в SQLite (WebAssembly) у браузері"] },
    ],
  },
  {
    id: "sql-1",
    title: "SELECT: усі стовпці й конкретні стовпці",
    type: "sql",
    theory:
      "SELECT — перша й найважливіша команда SQL: вона ВИБИРАЄ дані з таблиці, нічого в ній не змінюючи. Найпростіша форма — SELECT * FROM таблиця; — зірочка означає «усі стовпці», а FROM вказує, з якої саме таблиці брати дані. Крапка з комою в кінці позначає завершення запиту.\n\nЯкщо потрібні НЕ всі стовпці, а лише деякі — їх перелічують через кому замість зірочки: SELECT name, price FROM products; поверне лише назву й ціну кожного товару, ігноруючи інші стовпці таблиці (category, stock тощо). Порядок перелічених стовпців у запиті визначає порядок стовпців у результаті — необов'язково той самий, що в таблиці.\n\nУ цьому курсі є готова таблиця products (товари: id, name, category, price, stock), customers (клієнти: id, name, city) і orders (замовлення: id, customer_id, product_id, quantity, order_date) — цей самий «магазин» використовуватиметься в більшості наступних уроків, аж до фінального звіту.",
    examples: [
      { title: "Усі стовпці", code: `SELECT * FROM products;`, explain: "Поверне всі 6 товарів з усіма стовпцями: id, name, category, price, stock." },
      { title: "Конкретні стовпці", code: `SELECT name, price FROM products;`, explain: "Поверне лише назву й ціну — решта стовпців у результат не потрапляє." },
    ],
    task: "Вибери лише стовпці name і price з таблиці products.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "SELECT, потім через кому імена потрібних стовпців, потім FROM і назва таблиці.",
      "Стовпці саме name і price, у такому порядку не обов'язково, головне — обидва присутні.",
      `SELECT name, price FROM products;`,
    ],
    solution: `SELECT name, price FROM products;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату — перевір SELECT ... FROM products;"};\nconst cols = execResult[0].columns.map(c => c.toLowerCase());\nif (cols.length !== 2 || !cols.includes('name') || !cols.includes('price')) return {pass:false, message:"Вибери рівно два стовпці: name і price."};\nif (execResult[0].values.length !== 6) return {pass:false, message:"Має повернутись 6 рядків — усі товари (зараз: " + execResult[0].values.length + ")."};\nreturn {pass:true, message:"SELECT з конкретними стовпцями — основа будь-якого запиту: не завжди потрібні ВСІ дані з таблиці."};`,
  },
  {
    id: "sql-2",
    title: "WHERE: фільтрація рядків",
    type: "sql",
    theory:
      "WHERE додає до SELECT умову: у результат потраплять лише ті рядки, для яких умова істинна. SELECT * FROM products WHERE price > 500; поверне лише товари, дорожчі за 500 — решта відфільтровується ще ДО того, як результат сформується.\n\nОператори порівняння в SQL звичні: = (дорівнює, не == як у JS), != або <> (не дорівнює), >, <, >=, <=. Для тексту працює те саме порівняння: WHERE category = 'Книги' знайде рядки, де category ТОЧНО дорівнює рядку 'Книги' (в одинарних лапках — стандарт SQL для текстових значень).\n\nКілька умов об'єднують через AND (усі умови мають бути істинними) чи OR (достатньо хоча б однієї): WHERE price > 500 AND category = 'Електроніка' — і дорожче за 500, і саме електроніка. Дужки допомагають, коли AND і OR змішані в одному виразі, щоб уникнути неоднозначності про порядок обчислення.",
    examples: [
      { title: "Фільтр за числом", code: `SELECT * FROM products WHERE price > 500;`, explain: "Поверне лише товари, дорожчі за 500: навушники JBL, смартфон Xiaomi, джинси." },
      { title: "Кілька умов через AND", code: `SELECT * FROM products WHERE category = 'Електроніка' AND stock < 10;`, explain: "Обидві умови мають виконуватись одночасно — категорія Електроніка, і на складі менше 10 штук." },
    ],
    task: "Вибери всі товари (усі стовпці), ціна яких більша за 500.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "SELECT * FROM products WHERE ...",
      "Умова: price > 500",
      `SELECT * FROM products WHERE price > 500;`,
    ],
    solution: `SELECT * FROM products WHERE price > 500;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst rows = execResult[0].values;\nif (rows.length !== 3) return {pass:false, message:"Має бути 3 товари, дорожчі за 500 (зараз: " + rows.length + ")."};\nconst priceIdx = execResult[0].columns.map(c=>c.toLowerCase()).indexOf('price');\nif (priceIdx === -1 || !rows.every(r => r[priceIdx] > 500)) return {pass:false, message:"Усі рядки мають мати price > 500."};\nreturn {pass:true, message:"WHERE — головний інструмент фільтрації: без нього SELECT завжди повертав би геть усі рядки таблиці."};`,
  },
  {
    id: "sql-3",
    title: "ORDER BY і LIMIT",
    type: "sql",
    theory:
      "За замовчуванням SQL НЕ гарантує жодного конкретного порядку рядків у результаті — щоб відсортувати, використовують ORDER BY: SELECT name, price FROM products ORDER BY price; відсортує товари за ціною ЗА ЗРОСТАННЯМ (найдешевші першими) — це поведінка за замовчуванням (ASC, можна не писати явно). Щоб сортувати за СПАДАННЯМ, додають DESC: ORDER BY price DESC.\n\nLIMIT обмежує КІЛЬКІСТЬ рядків у результаті: SELECT * FROM products ORDER BY price DESC LIMIT 3; поверне лише 3 найдорожчі товари. Це особливо корисно в парі з ORDER BY — типовий патерн «топ-N»: топ-3 найдорожчі товари, топ-5 найактивніших клієнтів тощо.\n\nПорядок ключових слів у запиті фіксований: SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ... — саме в такій послідовності, навіть якщо якийсь із блоків пропущено. WHERE фільтрує рядки ДО сортування, тому можна поєднувати фільтр і сортування в одному запиті.",
    examples: [
      { title: "Сортування за спаданням", code: `SELECT name, price FROM products ORDER BY price DESC;`, explain: "Найдорожчий товар (Смартфон Xiaomi) буде першим у результаті." },
      { title: "Топ-N разом з LIMIT", code: `SELECT name, price FROM products ORDER BY price DESC LIMIT 3;`, explain: "Лише 3 найдорожчі товари — LIMIT застосовується ПІСЛЯ сортування." },
    ],
    task: "Вибери name і price трьох НАЙДОРОЖЧИХ товарів, відсортованих за спаданням ціни.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "ORDER BY price DESC сортує від найдорожчого до найдешевшого.",
      "LIMIT 3 в самому кінці запиту обмежує кількість рядків.",
      `SELECT name, price FROM products ORDER BY price DESC LIMIT 3;`,
    ],
    solution: `SELECT name, price FROM products ORDER BY price DESC LIMIT 3;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst rows = execResult[0].values;\nif (rows.length !== 3) return {pass:false, message:"Має бути рівно 3 рядки (зараз: " + rows.length + ")."};\nif (rows[0][0] !== 'Смартфон Xiaomi') return {pass:false, message:"Перший рядок (найдорожчий) має бути 'Смартфон Xiaomi'."};\nif (rows[2][0] !== 'Джинси класичні') return {pass:false, message:"Третій рядок має бути 'Джинси класичні' (900 — третя за ціною позиція)."};\nreturn {pass:true, message:"ORDER BY + LIMIT — типовий патерн «топ-N», один із найчастіших запитів у реальних звітах."};`,
  },
  {
    id: "sql-4",
    title: "NULL і COALESCE: відсутні значення",
    type: "sql",
    theory:
      "NULL у SQL означає «значення відсутнє» — це не порожній рядок '' і не число 0, а спеціальна позначка «тут нічого немає». Головна пастка: NULL = NULL НЕ дає true, а дає невизначеність (ні true, ні false) — тому для перевірки на відсутність значення використовують спеціальний синтаксис IS NULL чи IS NOT NULL, а не звичайне порівняння =.\n\nCOALESCE(значення1, значення2, ...) повертає ПЕРШЕ значення зі списку, яке НЕ є NULL: COALESCE(comment, 'Без коментаря') поверне сам comment, якщо він є, і рядок 'Без коментаря', якщо comment дорівнює NULL. Це рятує від NULL, що «просочується» далі в код застосунку чи у вивід звіту, де його краще замінити на щось зрозуміліше для людини.\n\nIFNULL(значення, запасне) — коротший варіант COALESCE рівно для ДВОХ аргументів, специфічний саме для SQLite (COALESCE стандартний для всього SQL і приймає будь-яку кількість аргументів) — обидва варіанти тут повністю взаємозамінні для випадку з двома значеннями.",
    examples: [
      { title: "COALESCE замінює NULL", code: `SELECT customer_name, COALESCE(comment, 'Без коментаря') AS comment\nFROM feedback;`, explain: "Там, де comment дорівнює NULL, у результаті з'явиться 'Без коментаря' замість порожнього значення." },
    ],
    task: "Виведи customer_name і comment, замінивши NULL на 'Без коментаря' через COALESCE.",
    setupSql: `CREATE TABLE feedback (id INTEGER PRIMARY KEY, customer_name TEXT, comment TEXT);\nINSERT INTO feedback (id, customer_name, comment) VALUES\n  (1, 'Олена Коваль', 'Дуже гарний товар, рекомендую!'),\n  (2, 'Андрій Бондар', NULL),\n  (3, 'Марія Гнатюк', NULL);`,
    starter: `-- твій запит тут\n`,
    hints: [
      "COALESCE(comment, 'Без коментаря') AS comment",
      "Псевдонім AS comment обов'язковий — так стовпець і перевіряється.",
      `SELECT customer_name, COALESCE(comment, 'Без коментаря') AS comment\nFROM feedback;`,
    ],
    solution: `SELECT customer_name, COALESCE(comment, 'Без коментаря') AS comment\nFROM feedback;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst nameIdx = cols.indexOf('customer_name');\nconst commentIdx = cols.indexOf('comment');\nif (nameIdx === -1 || commentIdx === -1) return {pass:false, message:"Потрібні стовпці customer_name і comment."};\nconst rows = execResult[0].values;\nif (rows.length !== 3) return {pass:false, message:"Має бути 3 рядки."};\nconst andriy = rows.find(r => r[nameIdx] === 'Андрій Бондар');\nif (!andriy || andriy[commentIdx] !== 'Без коментаря') return {pass:false, message:"Для Андрія Бондаря (NULL) comment має стати 'Без коментаря'."};\nconst olena = rows.find(r => r[nameIdx] === 'Олена Коваль');\nif (!olena || !olena[commentIdx].includes('гарний')) return {pass:false, message:"Для Олени Коваль справжній коментар не мав змінитись."};\nreturn {pass:true, message:"COALESCE — надійний спосіб підмінити NULL на зрозуміле значення прямо в запиті."};`,
  },
  {
    id: "sql-5",
    title: "Агрегатні функції: COUNT, SUM, AVG, MIN, MAX",
    type: "sql",
    theory:
      "Агрегатні функції обчислюють ОДНЕ значення з набору рядків, а не повертають рядки як є: COUNT(*) — кількість рядків, SUM(стовпець) — сума значень, AVG(стовпець) — середнє, MIN/MAX — мінімум і максимум. SELECT COUNT(*) FROM products; поверне одне число — скільки всього товарів у таблиці.\n\nМожна обчислити кілька агрегатів в ОДНОМУ запиті: SELECT COUNT(*), AVG(price) FROM products; — результат буде ОДНИМ рядком з двома значеннями. Псевдонім (аліас) через AS дає результату зрозуміле ім'я стовпця: SELECT COUNT(*) AS total, AVG(price) AS avg_price FROM products; — без AS стовпець мав би незручну технічну назву на кшталт COUNT(*).\n\nВажливо розуміти різницю: SELECT price FROM products; поверне 6 окремих рядків (по одному на товар), а SELECT AVG(price) FROM products; поверне ОДИН рядок з одним числом — агрегатна функція «згортає» багато значень в одне. Це стає особливо важливим далі в цьому курсі, де AVG/COUNT/SUM рахуватимуться ОКРЕМО для кожної групи через GROUP BY.",
    examples: [
      { title: "Кілька агрегатів разом", code: `SELECT COUNT(*) AS total, AVG(price) AS avg_price FROM products;`, explain: "Один рядок результату: total=6 (шість товарів), avg_price — середня ціна всіх товарів." },
      { title: "MIN і MAX", code: `SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products;`, explain: "Одним запитом дізнаємось і найдешевший, і найдорожчий товар — без ручного перебору." },
    ],
    task: "Порахуй загальну кількість товарів (COUNT) як total і середню ціну (AVG) як avg_price в одному запиті.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "SELECT COUNT(*) AS total, AVG(price) AS avg_price FROM products;",
      "AS дає результату зручне ім'я стовпця — саме total і avg_price тут і перевіряються.",
      `SELECT COUNT(*) AS total, AVG(price) AS avg_price FROM products;`,
    ],
    solution: `SELECT COUNT(*) AS total, AVG(price) AS avg_price FROM products;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst row = execResult[0].values[0];\nconst totalIdx = cols.indexOf('total');\nconst avgIdx = cols.indexOf('avg_price');\nif (totalIdx === -1 || avgIdx === -1) return {pass:false, message:"Потрібні псевдоніми (AS) саме total і avg_price."};\nif (row[totalIdx] !== 6) return {pass:false, message:"total має дорівнювати 6 (зараз: " + row[totalIdx] + ")."};\nif (Math.abs(row[avgIdx] - 1896.6666666666667) > 0.1) return {pass:false, message:"avg_price має дорівнювати приблизно 1896.67 (зараз: " + row[avgIdx] + ")."};\nreturn {pass:true, message:"Агрегатні функції — основа будь-якої статистики й звітів: підсумки без ручного перебору рядків."};`,
  },
  {
    id: "sql-6",
    title: "Числові функції: ROUND, ABS",
    type: "sql",
    theory:
      "ROUND(число, кількість_знаків) округлює число до вказаної кількості знаків після коми: ROUND(1896.6666, 2) дає 1896.67 — звичайне математичне округлення (0.5 і вище округлюється вгору). Без другого аргументу ROUND(число) округлює до цілого: ROUND(1896.6666) дає 1897.\n\nABS(число) повертає абсолютне значення — прибирає знак мінус, якщо він є: ABS(-15) і ABS(15) обидва дають 15. Це часто потрібно для різниці двох величин, коли важливо лише НАСКІЛЬКИ вони відрізняються, а не яка саме більша.\n\nОбидві функції особливо корисні разом з агрегатами: AVG(price) сам по собі часто повертає число з довгим «хвостом» десяткових знаків (1896.6666666...) — ROUND(AVG(price), 2) перетворює це на зручні для показу людині 1896.67.",
    examples: [
      { title: "ROUND з агрегатом", code: `SELECT ROUND(AVG(price), 2) AS avg_price_rounded FROM products;`, explain: "Замість довгого 1896.666666... — акуратне 1896.67." },
    ],
    task: "Порахуй середню ціну товарів, округлену до 2 знаків після коми (ROUND), як avg_price_rounded.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "ROUND(AVG(price), 2)",
      "Псевдонім AS avg_price_rounded.",
      `SELECT ROUND(AVG(price), 2) AS avg_price_rounded FROM products;`,
    ],
    solution: `SELECT ROUND(AVG(price), 2) AS avg_price_rounded FROM products;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst idx = cols.indexOf('avg_price_rounded');\nif (idx === -1) return {pass:false, message:"Потрібен стовпець avg_price_rounded."};\nconst val = execResult[0].values[0][idx];\nif (Math.abs(val - 1896.67) > 0.005) return {pass:false, message:"avg_price_rounded має дорівнювати приблизно 1896.67 (зараз: " + val + ")."};\nreturn {pass:true, message:"ROUND перетворює довгі десяткові дроби на зручні для показу людині числа."};`,
  },
  {
    id: "sql-7",
    title: "CAST: перетворення типів",
    type: "sql",
    theory:
      "CAST(значення AS тип) явно перетворює значення з одного типу на інший: CAST(price AS INTEGER) перетворює дробове число на ціле, CAST(id AS TEXT) перетворює число на текст. Це відрізняється від ROUND — CAST до INTEGER не округлює математично, а ВІДКИДАЄ дробову частину (обрізає в напрямку нуля): CAST(1896.99 AS INTEGER) дає 1896, а не 1897.\n\nCAST корисний, коли типи не збігаються там, де це важливо: конкатенація (||) очікує текст, тож число іноді доводиться явно перетворити через CAST(число AS TEXT) перед об'єднанням з рядком (хоча SQLite й сам часто справляється з таким перетворенням автоматично, явний CAST прибирає будь-яку двозначність).\n\nВажливо запам'ятати різницю з попереднього уроку: ROUND(x, 0) округлює за математичними правилами (0.5 і вище — вгору), а CAST(x AS INTEGER) просто відкидає все після коми, незалежно від того, яка там цифра — це різна поведінка для тих самих вхідних чисел.",
    examples: [
      { title: "CAST відкидає дробову частину", code: `SELECT CAST(AVG(price) AS INTEGER) AS avg_price_int FROM products;`, explain: "1896.6666... стає 1896 (відкинуто, а не округлено до 1897)." },
    ],
    task: "Виведи середню ціну товарів як ЦІЛЕ число через CAST(... AS INTEGER), псевдонім avg_price_int.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "CAST(AVG(price) AS INTEGER)",
      "На відміну від ROUND, CAST відкидає дробову частину, не округлює.",
      `SELECT CAST(AVG(price) AS INTEGER) AS avg_price_int FROM products;`,
    ],
    solution: `SELECT CAST(AVG(price) AS INTEGER) AS avg_price_int FROM products;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst idx = cols.indexOf('avg_price_int');\nif (idx === -1) return {pass:false, message:"Потрібен стовпець avg_price_int."};\nconst val = execResult[0].values[0][idx];\nif (val !== 1896) return {pass:false, message:"avg_price_int має дорівнювати 1896 (відкинута дробова частина), зараз: " + val + "."};\nreturn {pass:true, message:"CAST до INTEGER відкидає дробову частину — інша поведінка, ніж математичне округлення ROUND."};`,
  },
  {
    id: "sql-8",
    title: "GROUP BY: агрегація по групах",
    type: "sql",
    theory:
      "GROUP BY розбиває рядки на ГРУПИ за значенням одного чи кількох стовпців, і кожна агрегатна функція в SELECT обчислюється ОКРЕМО для кожної групи, а не для всієї таблиці одразу. SELECT category, COUNT(*) AS cnt FROM products GROUP BY category; поверне ПО ОДНОМУ рядку на кожну унікальну категорію — Книги, Електроніка, Одяг — з кількістю товарів у кожній.\n\nЦе, мабуть, найпотужніша ідея в базовому SQL: замість «порахуй усе разом» GROUP BY дозволяє «порахуй ОКРЕМО для кожного значення категорії/клієнта/дня». SELECT category, AVG(price) AS avg_price FROM products GROUP BY category; дасть середню ціну ОКРЕМО для книг, окремо для електроніки, окремо для одягу — не одне загальне число.\n\nВажливе правило: у SELECT разом з GROUP BY можна вказувати лише стовпці, за якими групуємо (category), і агрегатні функції (COUNT, AVG...) — НЕ можна додати туди звичайний стовпець на кшталт name, бо для одного значення category в групі може бути декілька РІЗНИХ name, і SQL не знає, яке саме з них показати.",
    examples: [
      { title: "Кількість товарів по категоріях", code: `SELECT category, COUNT(*) AS cnt FROM products GROUP BY category;`, explain: "Три рядки результату — по одному на кожну категорію — замість одного загального COUNT(*)." },
      { title: "Середня ціна по категоріях", code: `SELECT category, AVG(price) AS avg_price FROM products GROUP BY category;`, explain: "AVG рахується ОКРЕМО в межах кожної групи category, а не для всієї таблиці разом." },
    ],
    task: "Порахуй кількість товарів (COUNT, псевдонім cnt) у КОЖНІЙ категорії.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "SELECT category, COUNT(*) AS cnt FROM products GROUP BY category;",
      "GROUP BY йде після FROM (і після WHERE, якби воно було).",
      `SELECT category, COUNT(*) AS cnt FROM products GROUP BY category;`,
    ],
    solution: `SELECT category, COUNT(*) AS cnt FROM products GROUP BY category;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst catIdx = cols.indexOf('category');\nconst cntIdx = cols.indexOf('cnt');\nif (catIdx === -1 || cntIdx === -1) return {pass:false, message:"Потрібні стовпці category і cnt (псевдонім AS cnt)."};\nconst rows = execResult[0].values;\nif (rows.length !== 3) return {pass:false, message:"Має бути 3 рядки — по одному на категорію (зараз: " + rows.length + ")."};\nif (!rows.every(r => r[cntIdx] === 2)) return {pass:false, message:"У кожній категорії має бути рівно 2 товари."};\nreturn {pass:true, message:"GROUP BY — «порахуй окремо для кожного значення» — основа практично будь-якого звіту."};`,
  },
  {
    id: "sql-9",
    title: "HAVING: фільтрація вже згрупованих даних",
    type: "sql",
    theory:
      "WHERE фільтрує ОКРЕМІ РЯДКИ ще до групування, а HAVING фільтрує вже ГОТОВІ ГРУПИ — після того, як GROUP BY й агрегатні функції відпрацювали. Тому в HAVING (на відміну від WHERE) можна використовувати результат агрегатної функції: SELECT category, AVG(price) AS avg_price FROM products GROUP BY category HAVING AVG(price) > 500; — залишить лише ті категорії, де СЕРЕДНЯ ціна більша за 500.\n\nСпроба написати WHERE AVG(price) > 500 дасть помилку — на момент виконання WHERE агрегати для груп ще не обчислені (WHERE відпрацьовує РАНІШЕ за GROUP BY). Це і є ключова відмінність, яку варто запам'ятати: WHERE — до групування, для окремих рядків; HAVING — після групування, для готових груп.\n\nПорядок ключових слів у повному запиті: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ... — саме в такій послідовності. WHERE і HAVING можна використовувати РАЗОМ в одному запиті: WHERE відфільтрує рядки до групування, HAVING — групи після нього.",
    examples: [
      { title: "HAVING з агрегатом", code: `SELECT category, AVG(price) AS avg_price\nFROM products\nGROUP BY category\nHAVING AVG(price) > 500;`, explain: "Категорія Книги (середня 215) відсіється — HAVING лишить лише Електроніку й Одяг, де середня ціна вища за 500." },
    ],
    task: "Знайди категорії (category, avg_price), де СЕРЕДНЯ ціна товарів більша за 500.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "GROUP BY category спочатку, HAVING після нього.",
      "HAVING AVG(price) > 500 — саме HAVING, не WHERE, бо умова стосується агрегату.",
      `SELECT category, AVG(price) AS avg_price\nFROM products\nGROUP BY category\nHAVING AVG(price) > 500;`,
    ],
    solution: `SELECT category, AVG(price) AS avg_price\nFROM products\nGROUP BY category\nHAVING AVG(price) > 500;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst catIdx = cols.indexOf('category');\nif (catIdx === -1) return {pass:false, message:"Потрібен стовпець category."};\nconst rows = execResult[0].values;\nif (rows.length !== 2) return {pass:false, message:"Має лишитись рівно 2 категорії (зараз: " + rows.length + ")."};\nconst cats = rows.map(r => r[catIdx]).sort();\nif (JSON.stringify(cats) !== JSON.stringify(['Електроніка','Одяг'])) return {pass:false, message:"Мають лишитись саме 'Електроніка' і 'Одяг' — Книги відсіюються (середня 215 < 500)."};\nreturn {pass:true, message:"HAVING фільтрує ГРУПИ після агрегації — WHERE тут би просто не спрацював."};`,
  },
  {
    id: "sql-10",
    title: "CREATE TABLE і типи даних",
    type: "sql",
    theory:
      "CREATE TABLE створює нову, порожню таблицю: перелічуються імена стовпців і тип даних кожного. У SQLite (та базі, що працює в цьому курсі) основні типи — INTEGER (ціле число), REAL (дробове число), TEXT (текст), і кожному стовпцю можна одразу додати обмеження, як-от PRIMARY KEY.\n\nCREATE TABLE reviews (id INTEGER PRIMARY KEY, product_id INTEGER, rating INTEGER, comment TEXT); — таблиця відгуків: id (первинний ключ, унікальний ідентифікатор кожного рядка), product_id (посилання на товар), rating (оцінка, число), comment (текст відгуку). PRIMARY KEY автоматично гарантує унікальність і НЕ NULL для цього стовпця.\n\nЦе перший урок, де запит не ВИБИРАЄ дані, а ЗМІНЮЄ структуру бази — після CREATE TABLE запит не повертає рядків результату (побачиш «Запит виконано, рядків не повернуто» у блоці результату), але таблиця з'являється в базі, і до неї вже можна звертатись наступними запитами.",
    examples: [
      { title: "Створення таблиці з чотирма стовпцями", code: `CREATE TABLE reviews (\n  id INTEGER PRIMARY KEY,\n  product_id INTEGER,\n  rating INTEGER,\n  comment TEXT\n);`, explain: "Порожня таблиця готова приймати рядки — жодних даних ще немає, лише структура." },
    ],
    task: "Створи таблицю reviews зі стовпцями: id (INTEGER PRIMARY KEY), product_id (INTEGER), rating (INTEGER), comment (TEXT).",
    setupSql: "",
    starter: `-- твій CREATE TABLE тут\n`,
    hints: [
      "CREATE TABLE reviews (стовпець1 тип1, стовпець2 тип2, ...);",
      "id INTEGER PRIMARY KEY — саме так позначається первинний ключ.",
      `CREATE TABLE reviews (\n  id INTEGER PRIMARY KEY,\n  product_id INTEGER,\n  rating INTEGER,\n  comment TEXT\n);`,
    ],
    solution: `CREATE TABLE reviews (\n  id INTEGER PRIMARY KEY,\n  product_id INTEGER,\n  rating INTEGER,\n  comment TEXT\n);`,
    testCode: `let info;\ntry { info = db.exec("PRAGMA table_info(reviews);"); } catch (e) { return {pass:false, message:"Таблиця reviews не створена: " + e.message}; }\nif (!info.length) return {pass:false, message:"Таблиця reviews не створена."};\nconst cols = info[0].values.map(r => String(r[1]).toLowerCase());\nfor (const need of ['id','product_id','rating','comment']) {\n  if (!cols.includes(need)) return {pass:false, message:"Бракує стовпця " + need + "."};\n}\nreturn {pass:true, message:"CREATE TABLE — перший крок будь-якої бази даних: спочатку структура, потім дані."};`,
  },
  {
    id: "sql-11",
    title: "ALTER TABLE: зміна структури існуючої таблиці",
    type: "sql",
    theory:
      "CREATE TABLE створює структуру один раз, але реальні застосунки з часом ростуть — з'являється потреба додати новий стовпець до вже існуючої таблиці з даними. ALTER TABLE ... ADD COLUMN робить це, не втрачаючи наявні рядки: ALTER TABLE products ADD COLUMN discount REAL DEFAULT 0; додає стовпець discount до вже наповненої таблиці products, і кожен існуючий рядок одразу отримує значення 0 (з DEFAULT).\n\nSQLite (на відміну від деяких інших баз) має обмежену підтримку ALTER TABLE — можна додати стовпець (ADD COLUMN) чи перейменувати таблицю/стовпець, але складніші зміни (як-от переставити стовпці місцями) вимагають створити нову таблицю з потрібною структурою, скопіювати дані, і замінити стару.\n\nНовий стовпець без DEFAULT отримав би NULL для всіх існуючих рядків — саме тому DEFAULT 0 тут важливий: без нього довелося б окремо оновлювати кожен рядок через UPDATE після ALTER TABLE, щоб позбутись NULL.",
    examples: [
      { title: "Додавання стовпця з DEFAULT", code: `ALTER TABLE products ADD COLUMN discount REAL DEFAULT 0;`, explain: "Усі 6 існуючих товарів одразу отримають discount = 0, жоден рядок не зникає і не ламається." },
    ],
    task: "Додай до таблиці products новий стовпець discount (REAL, DEFAULT 0) через ALTER TABLE.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій ALTER TABLE тут\n`,
    hints: [
      "ALTER TABLE products ADD COLUMN discount REAL DEFAULT 0;",
      "DEFAULT 0 гарантує, що існуючі рядки не отримають NULL.",
      `ALTER TABLE products ADD COLUMN discount REAL DEFAULT 0;`,
    ],
    solution: `ALTER TABLE products ADD COLUMN discount REAL DEFAULT 0;`,
    testCode: `let info;\ntry { info = db.exec("PRAGMA table_info(products);"); } catch (e) { return {pass:false, message:"Помилка: " + e.message}; }\nconst cols = info[0].values.map(r => String(r[1]).toLowerCase());\nif (!cols.includes('discount')) return {pass:false, message:"Стовпець discount не знайдено в products."};\nconst res = db.exec("SELECT discount FROM products LIMIT 1;");\nif (res[0].values[0][0] !== 0) return {pass:false, message:"discount має мати значення за замовчуванням 0."};\nreturn {pass:true, message:"ALTER TABLE ADD COLUMN — так структура таблиці росте разом із застосунком, не втрачаючи вже наявні дані."};`,
  },
  {
    id: "sql-12",
    title: "INSERT INTO: додавання рядків",
    type: "sql",
    theory:
      "INSERT INTO додає новий рядок у вже існуючу таблицю: INSERT INTO notes (title) VALUES ('Купити хліб'); — перелічуємо, В ЯКІ стовпці вставляємо (у дужках після імені таблиці), і ЯКІ значення (у VALUES, у тому самому порядку). Стовпці, не перелічені явно (наприклад, id з AUTOINCREMENT чи стовпець зі значенням DEFAULT), заповняться автоматично.\n\nМожна вставити ОДРАЗУ кілька рядків одним запитом, перелічивши кілька груп значень через кому: INSERT INTO notes (title) VALUES ('Перше'), ('Друге'), ('Третє'); — це ефективніше за три окремі INSERT.\n\nЯкщо стовпець при створенні таблиці мав DEFAULT (значення за замовчуванням, як done INTEGER DEFAULT 0), і його НЕ вказати в INSERT — SQL підставить це значення сам, без жодної додаткової дії з боку запиту.",
    examples: [
      { title: "Один рядок", code: `INSERT INTO notes (title) VALUES ('Купити хліб');`, explain: "done автоматично отримає значення за замовчуванням (0), бо не був вказаний явно." },
      { title: "Кілька рядків одразу", code: `INSERT INTO notes (title) VALUES ('Перше'), ('Друге');`, explain: "Один запит — два нових рядки." },
    ],
    task: "Додай у таблицю notes (title TEXT, done INTEGER DEFAULT 0) один новий рядок з title = 'Купити хліб'.",
    setupSql: `CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT, done INTEGER DEFAULT 0);`,
    starter: `-- твій INSERT тут\n`,
    hints: [
      "INSERT INTO notes (title) VALUES ('...');",
      "done можна не вказувати — спрацює DEFAULT 0.",
      `INSERT INTO notes (title) VALUES ('Купити хліб');`,
    ],
    solution: `INSERT INTO notes (title) VALUES ('Купити хліб');`,
    testCode: `let res;\ntry { res = db.exec("SELECT title, done FROM notes;"); } catch (e) { return {pass:false, message:"Помилка читання notes: " + e.message}; }\nif (!res.length || res[0].values.length !== 1) return {pass:false, message:"У notes має бути рівно один рядок."};\nconst [title, done] = res[0].values[0];\nif (title !== 'Купити хліб') return {pass:false, message:"title має дорівнювати 'Купити хліб' (зараз: '" + title + "')."};\nif (done !== 0) return {pass:false, message:"done має бути 0 (значення за замовчуванням), якщо ти не вказував(-ла) його явно."};\nreturn {pass:true, message:"INSERT INTO — так дані потрапляють у базу: рядок за рядком або пачками."};`,
  },
  {
    id: "sql-13",
    title: "UPDATE: зміна існуючих рядків",
    type: "sql",
    theory:
      "UPDATE змінює значення в УЖЕ ІСНУЮЧИХ рядках: UPDATE notes SET done = 1 WHERE id = 2; — SET визначає, ЯКИЙ стовпець і на ЯКЕ значення змінити, WHERE визначає, ЯКІ САМЕ рядки зачепити. Без WHERE запит оновив би АБСОЛЮТНО ВСІ рядки таблиці — одна з найнебезпечніших помилок у SQL, тому WHERE у UPDATE практично завжди обов'язковий за змістом (хай і не за синтаксисом).\n\nМожна оновити ОДРАЗУ кілька стовпців одним SET через кому: UPDATE notes SET done = 1, title = 'Готово' WHERE id = 2; — обидва стовпці зміняться в одному й тому самому рядку одночасно.\n\nWHERE у UPDATE працює за тим самим принципом, що й у SELECT — можна фільтрувати за будь-якою умовою, не лише за id: UPDATE products SET stock = stock - 1 WHERE id = 3; — до речі, тут праворуч від = можна використовувати ПОТОЧНЕ значення стовпця (stock - 1), а не лише буквальне число.",
    examples: [
      { title: "Оновлення одного рядка", code: `UPDATE notes SET done = 1 WHERE id = 2;`, explain: "Лише рядок з id = 2 зміниться — решта лишаться без змін." },
      { title: "Оновлення відносно поточного значення", code: `UPDATE products SET stock = stock - 1 WHERE id = 3;`, explain: "stock зменшиться на 1 від поточного значення — типово для «продали один товар»." },
    ],
    task: "У таблиці notes (уже містить 3 рядки: id=1 'Купити хліб', id=2 'Погуляти', id=3 'Прочитати книгу', усі done=0) познач рядок з id=2 виконаним (done = 1).",
    setupSql: `CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT, done INTEGER DEFAULT 0);\nINSERT INTO notes (id, title, done) VALUES (1, 'Купити хліб', 0), (2, 'Погуляти', 0), (3, 'Прочитати книгу', 0);`,
    starter: `-- твій UPDATE тут\n`,
    hints: [
      "UPDATE notes SET done = 1 WHERE id = 2;",
      "Без WHERE оновились би ВСІ рядки — тут потрібен лише один.",
      `UPDATE notes SET done = 1 WHERE id = 2;`,
    ],
    solution: `UPDATE notes SET done = 1 WHERE id = 2;`,
    testCode: `let res;\ntry { res = db.exec("SELECT id, done FROM notes ORDER BY id;"); } catch (e) { return {pass:false, message:"Помилка читання notes: " + e.message}; }\nconst rows = res[0].values;\nconst byId = Object.fromEntries(rows.map(r => [r[0], r[1]]));\nif (byId[2] !== 1) return {pass:false, message:"Рядок з id=2 має мати done=1."};\nif (byId[1] !== 0 || byId[3] !== 0) return {pass:false, message:"Рядки id=1 і id=3 мають лишитись done=0 — UPDATE без WHERE зачепив би їх теж."};\nreturn {pass:true, message:"UPDATE з WHERE — точкова зміна конкретних рядків, а не всієї таблиці."};`,
  },
  {
    id: "sql-14",
    title: "DELETE: видалення рядків",
    type: "sql",
    theory:
      "DELETE FROM видаляє рядки з таблиці: DELETE FROM notes WHERE done = 0; видалить усі невиконані нотатки, лишивши лише ті, де done = 1. Так само, як з UPDATE, WHERE тут критично важливий — DELETE FROM notes; (без WHERE) видалить УСІ рядки таблиці, лишивши її порожньою (сама таблиця й далі існує, зникають лише дані).\n\nDELETE видаляє ЦІЛІ РЯДКИ, а не окремі значення в них — не можна «видалити лише один стовпець» через DELETE (для цього використовують UPDATE зі значенням NULL, якщо стовпець це дозволяє, або ALTER TABLE, щоб прибрати сам стовпець зі структури).\n\nНа практиці DELETE — одна з найризикованіших команд SQL саме через легкість забути WHERE, тому в реальних проєктах перед масовим видаленням часто спочатку виконують той самий запит як SELECT, щоб побачити, ЩО САМЕ буде видалено, і лише потім змінюють SELECT на DELETE.",
    examples: [
      { title: "Видалення за умовою", code: `DELETE FROM notes WHERE done = 0;`, explain: "Видаляться лише невиконані нотатки — виконані (done = 1) залишаться в таблиці." },
    ],
    task: "У таблиці notes (3 рядки: id=1 done=0, id=2 done=1, id=3 done=0) видали всі НЕВИКОНАНІ нотатки (done = 0).",
    setupSql: `CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT, done INTEGER DEFAULT 0);\nINSERT INTO notes (id, title, done) VALUES (1, 'Купити хліб', 0), (2, 'Погуляти', 1), (3, 'Прочитати книгу', 0);`,
    starter: `-- твій DELETE тут\n`,
    hints: [
      "DELETE FROM notes WHERE done = 0;",
      "Лишитись має лише рядок з id=2 (done=1).",
      `DELETE FROM notes WHERE done = 0;`,
    ],
    solution: `DELETE FROM notes WHERE done = 0;`,
    testCode: `let res;\ntry { res = db.exec("SELECT id, done FROM notes;"); } catch (e) { return {pass:false, message:"Помилка читання notes: " + e.message}; }\nconst rows = res.length ? res[0].values : [];\nif (rows.length !== 1) return {pass:false, message:"Має лишитись рівно 1 рядок (зараз: " + rows.length + ")."};\nif (rows[0][0] !== 2 || rows[0][1] !== 1) return {pass:false, message:"Рядок, що лишився, має бути id=2, done=1."};\nreturn {pass:true, message:"DELETE FROM ... WHERE — прибирає лише ті рядки, що відповідають умові, решта лишається недоторканою."};`,
  },
  {
    id: "sql-15",
    title: "Транзакції: BEGIN, COMMIT, ROLLBACK",
    type: "sql",
    theory:
      "Транзакція — це група операцій, яка виконується як ОДНЕ ціле: або застосовуються ВСІ зміни всередині неї, або ЖОДНА. BEGIN відкриває транзакцію, COMMIT завершує її й НАЗАВЖДИ зберігає всі зміни, ROLLBACK скасовує ВСЕ, що відбулось усередині транзакції, ніби її й не було.\n\nЦе критично важливо для операцій, що складаються з КІЛЬКОХ кроків, де важливо, щоб або всі кроки відбулись, або жоден: переказ грошей між рахунками — списати з одного (UPDATE) і зарахувати на інший (UPDATE) — якщо перший крок відбувся, а другий впав через помилку, гроші просто зникли б. Транзакція гарантує: якщо щось пішло не так, ROLLBACK поверне обидва рахунки до стану ДО початку операції.\n\nБез явного BEGIN кожен окремий запит у SQLite зазвичай виконується у власній «неявній» транзакції — саме тому попередні уроки з UPDATE/DELETE й так спрацьовували коректно. Явний BEGIN потрібен саме тоді, коли КІЛЬКА окремих запитів мають або всі спрацювати, або жоден.",
    examples: [
      { title: "COMMIT зберігає, ROLLBACK скасовує", code: `BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;\n\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 2;\nROLLBACK;`, explain: "Рахунок 1 назавжди втратить 100 (COMMIT), рахунок 2 лишиться незмінним, ніби UPDATE і не відбувався (ROLLBACK)." },
    ],
    task: "Рахунок А (id=1): зменш баланс на 100 у транзакції й зафіксуй (COMMIT). Рахунок Б (id=2): зменш баланс на 100 у транзакції, але скасуй (ROLLBACK).",
    setupSql: `CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT, balance REAL);\nINSERT INTO accounts (id, name, balance) VALUES (1, 'Рахунок А', 1000), (2, 'Рахунок Б', 1000);`,
    starter: `-- твої BEGIN/UPDATE/COMMIT і BEGIN/UPDATE/ROLLBACK тут\n`,
    hints: [
      "Дві окремі транзакції: перша закінчується COMMIT, друга — ROLLBACK.",
      "BEGIN; UPDATE ...; COMMIT; (для id=1) і те саме з ROLLBACK для id=2.",
      `BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;\n\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 2;\nROLLBACK;`,
    ],
    solution: `BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;\n\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 2;\nROLLBACK;`,
    testCode: `let res;\ntry { res = db.exec("SELECT id, balance FROM accounts ORDER BY id;"); } catch (e) { return {pass:false, message:"Помилка: " + e.message}; }\nconst byId = Object.fromEntries(res[0].values.map(r => [r[0], r[1]]));\nif (byId[1] !== 900) return {pass:false, message:"Рахунок А (id=1) має мати balance=900 після COMMIT (зараз: " + byId[1] + ")."};\nif (byId[2] !== 1000) return {pass:false, message:"Рахунок Б (id=2) має лишитись balance=1000 — ROLLBACK мав скасувати зміну (зараз: " + byId[2] + ")."};\nreturn {pass:true, message:"COMMIT зберігає зміни назавжди, ROLLBACK повертає все, ніби транзакції й не було."};`,
  },
  {
    id: "sql-16",
    title: "Обмеження: PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT",
    type: "sql",
    theory:
      "Обмеження (constraints) — правила, які база даних ПРИМУСОВО стежить, щоб дані лишались коректними, незалежно від того, який саме код їх вставляє. PRIMARY KEY гарантує, що значення стовпця унікальне й ніколи не NULL — це «головний ідентифікатор» рядка. NOT NULL забороняє залишати стовпець порожнім (без значення) при INSERT.\n\nUNIQUE схожий на PRIMARY KEY (значення не може повторюватись), але на відміну від нього таблиця може мати кілька UNIQUE-стовпців (а PRIMARY KEY зазвичай один): email TEXT UNIQUE — жодні два рядки не можуть мати однаковий email. DEFAULT задає значення, яке підставляється автоматично, якщо стовпець не вказано при INSERT (як і в уроці про додавання рядків раніше).\n\nГоловна цінність обмежень — вони спрацьовують НА РІВНІ БАЗИ ДАНИХ, а не лише в коді застосунку: навіть якщо якийсь код десь забуде перевірити email на дублікат, сама база відхилить такий INSERT з помилкою. Це останній рубіж захисту цілісності даних, коли всі інші перевірки чомусь не спрацювали.",
    examples: [
      { title: "Таблиця з кількома обмеженнями", code: `CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE,\n  role TEXT DEFAULT 'user'\n);`, explain: "email обов'язковий (NOT NULL) і унікальний (UNIQUE); role отримає 'user', якщо не вказаний явно." },
    ],
    task: "Створи таблицю users: id (INTEGER PRIMARY KEY), email (TEXT NOT NULL UNIQUE), role (TEXT DEFAULT 'user').",
    setupSql: "",
    starter: `-- твій CREATE TABLE тут\n`,
    hints: [
      "email TEXT NOT NULL UNIQUE — обидва слова в цьому порядку.",
      "role TEXT DEFAULT 'user' — значення за замовчуванням у лапках.",
      `CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE,\n  role TEXT DEFAULT 'user'\n);`,
    ],
    solution: `CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE,\n  role TEXT DEFAULT 'user'\n);`,
    testCode: `try { db.exec("PRAGMA table_info(users);"); } catch (e) { return {pass:false, message:"Таблиця users не створена."}; }\ntry {\n  db.run("INSERT INTO users (id, email) VALUES (1, 'a@mail.com');");\n} catch (e) {\n  return {pass:false, message:"Не вдалося вставити коректний рядок: " + e.message};\n}\nlet dupFailed = false;\ntry { db.run("INSERT INTO users (id, email) VALUES (2, 'a@mail.com');"); } catch (e) { dupFailed = true; }\nif (!dupFailed) return {pass:false, message:"email має бути UNIQUE — повторний email не мав пройти."};\nlet nullFailed = false;\ntry { db.run("INSERT INTO users (id, email) VALUES (3, NULL);"); } catch (e) { nullFailed = true; }\nif (!nullFailed) return {pass:false, message:"email має бути NOT NULL — NULL не мав пройти."};\nconst res = db.exec("SELECT role FROM users WHERE id = 1;");\nif (!res.length || res[0].values[0][0] !== 'user') return {pass:false, message:"role має отримати значення за замовчуванням 'user'."};\nreturn {pass:true, message:"Обмеження працюють на рівні самої бази даних — жодна вставка чи оновлення не обійде їх."};`,
  },
  {
    id: "sql-17",
    title: "CREATE INDEX: прискорення пошуку",
    type: "sql",
    theory:
      "Без індексу база даних, щоб знайти потрібні рядки за WHERE, змушена переглянути КОЖЕН рядок таблиці одна за одною (full table scan) — прийнятно для таблиці з кількома рядками, як тут, але критично повільно для мільйона рядків. CREATE INDEX створює додаткову, окрему структуру даних (щось на кшталт змісту книги), що дозволяє базі одразу «перестрибнути» до потрібних рядків за значенням індексованого стовпця.\n\nCREATE INDEX idx_orders_customer ON orders (customer_id); створює індекс з іменем idx_orders_customer на стовпці customer_id таблиці orders — тепер запити на кшталт WHERE customer_id = 3 чи JOIN за цим стовпцем можуть виконуватись значно швидше, особливо коли рядків стають тисячі чи мільйони.\n\nІндекс — це компроміс, а не «завжди вмикай»: він прискорює ЧИТАННЯ (SELECT/WHERE/JOIN), але трохи сповільнює ЗАПИС (INSERT/UPDATE/DELETE), бо базі доводиться оновлювати не лише саму таблицю, а й індекс. У реальних проєктах індекси створюють саме на стовпцях, за якими ЧАСТО фільтрують чи з'єднують таблиці (як customer_id тут), а не на кожному стовпці підряд.",
    examples: [
      { title: "Індекс на стовпці зовнішнього ключа", code: `CREATE INDEX idx_orders_customer ON orders (customer_id);`, explain: "Прискорює будь-який запит, що фільтрує чи з'єднує orders за customer_id." },
    ],
    task: "Створи індекс idx_orders_customer на стовпці customer_id таблиці orders.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій CREATE INDEX тут\n`,
    hints: [
      "CREATE INDEX ім'я_індексу ON таблиця (стовпець);",
      "Ім'я саме idx_orders_customer — так воно і перевіряється.",
      `CREATE INDEX idx_orders_customer ON orders (customer_id);`,
    ],
    solution: `CREATE INDEX idx_orders_customer ON orders (customer_id);`,
    testCode: `let res;\ntry { res = db.exec("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='orders';"); } catch (e) { return {pass:false, message:"Помилка: " + e.message}; }\nconst names = res.length ? res[0].values.map(r => r[0]) : [];\nif (!names.includes('idx_orders_customer')) return {pass:false, message:"Індекс idx_orders_customer на orders не знайдено."};\nreturn {pass:true, message:"CREATE INDEX — непомітний для результату запиту, але критичний для швидкості на великих таблицях."};`,
  },
  {
    id: "sql-18",
    title: "INNER JOIN: об'єднання двох таблиць",
    type: "sql",
    theory:
      "Реальні дані рідко лежать в одній таблиці — замовлення (orders) посилаються на клієнтів (customers) через customer_id, а не дублюють ім'я клієнта в кожному рядку. JOIN об'єднує рядки з ДВОХ таблиць за умовою збігу: SELECT customers.name, orders.order_date FROM orders INNER JOIN customers ON orders.customer_id = customers.id; — для кожного замовлення знайде відповідного клієнта за id.\n\nКлючове слово саме ON визначає, ЯК саме зіставляти рядки двох таблиць: orders.customer_id = customers.id означає «customer_id із замовлення повинен дорівнювати id клієнта». INNER JOIN поверне рядок лише тоді, коли збіг ЗНАЙДЕНО в обох таблицях — замовлення без відповідного клієнта (чи клієнт без жодного замовлення) до результату НЕ потрапить.\n\nЗвернення через customers.name і orders.order_date (ім'я_таблиці.ім'я_стовпця) потрібне, коли в різних з'єднаних таблицях можуть бути стовпці з однаковими іменами (наприклад, і orders, і customers мають id) — так SQL точно знає, з якої таблиці брати значення.",
    examples: [
      { title: "JOIN замовлень і клієнтів", code: `SELECT customers.name, orders.order_date\nFROM orders\nINNER JOIN customers ON orders.customer_id = customers.id;`, explain: "Кожен рядок результату — одне замовлення разом з іменем клієнта, який його зробив." },
    ],
    task: "Виведи ім'я клієнта (customers.name) і дату замовлення (orders.order_date) для кожного замовлення, об'єднавши orders і customers через INNER JOIN.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "FROM orders INNER JOIN customers ON orders.customer_id = customers.id",
      "У SELECT: customers.name, orders.order_date",
      `SELECT customers.name, orders.order_date\nFROM orders\nINNER JOIN customers ON orders.customer_id = customers.id;`,
    ],
    solution: `SELECT customers.name, orders.order_date\nFROM orders\nINNER JOIN customers ON orders.customer_id = customers.id;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nif (execResult[0].values.length !== 8) return {pass:false, message:"Має бути 8 рядків — по одному на кожне замовлення (зараз: " + execResult[0].values.length + ")."};\nreturn {pass:true, message:"INNER JOIN — так пов'язані таблиці 'зустрічаються' в одному результаті: замовлення знаходять свого клієнта за id."};`,
  },
  {
    id: "sql-19",
    title: "LEFT JOIN: зберегти рядки без збігу",
    type: "sql",
    theory:
      "INNER JOIN показує рядок лише тоді, коли збіг знайдено В ОБОХ таблицях — клієнт без жодного замовлення просто зникає з результату. LEFT JOIN розв'язує це: він зберігає УСІ рядки ЛІВОЇ таблиці (тієї, що йде одразу після FROM), навіть якщо для них НЕМАЄ пари в правій — стовпці з правої таблиці тоді заповнюються NULL.\n\nSELECT customers.name, orders.id FROM customers LEFT JOIN orders ON customers.id = orders.customer_id; — поверне УСІХ клієнтів, включно з тими, хто ще нічого не замовляв (для них orders.id буде NULL). Порядок тут важливий: FROM customers LEFT JOIN orders означає «customers — ліва (головна) таблиця», не навпаки.\n\nКомбінація LEFT JOIN + GROUP BY + COUNT — типовий патерн «скільки замовлень у КОЖНОГО клієнта, включно з тими, у кого 0»: COUNT(orders.id) порахує реальні замовлення (NULL не рахується), а не COUNT(*), який порахував би НАВІТЬ рядки без жодного замовлення як 1 через сам факт існування рядка клієнта.",
    examples: [
      { title: "Усі клієнти, включно з тими без замовлень", code: `SELECT customers.name, COUNT(orders.id) AS order_count\nFROM customers\nLEFT JOIN orders ON customers.id = orders.customer_id\nGROUP BY customers.id;`, explain: "Клієнт без жодного замовлення все одно потрапить у результат, з order_count = 0." },
    ],
    task: "Виведи ім'я КОЖНОГО клієнта і кількість його замовлень (order_count) — включно з тими, хто ще нічого не замовляв.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "FROM customers LEFT JOIN orders ON customers.id = orders.customer_id",
      "COUNT(orders.id) — саме поле orders, не COUNT(*) — інакше рядки без замовлень теж рахувались би як 1.",
      `SELECT customers.name, COUNT(orders.id) AS order_count\nFROM customers\nLEFT JOIN orders ON customers.id = orders.customer_id\nGROUP BY customers.id;`,
    ],
    solution: `SELECT customers.name, COUNT(orders.id) AS order_count\nFROM customers\nLEFT JOIN orders ON customers.id = orders.customer_id\nGROUP BY customers.id;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst nameIdx = cols.indexOf('name');\nconst cntIdx = cols.indexOf('order_count');\nif (nameIdx === -1 || cntIdx === -1) return {pass:false, message:"Потрібні стовпці name і order_count."};\nconst rows = execResult[0].values;\nif (rows.length !== 5) return {pass:false, message:"Має бути 5 клієнтів (зараз: " + rows.length + ") — усі, включно з тим, хто нічого не замовляв."};\nconst taras = rows.find(r => r[nameIdx] === 'Тарас Мельник');\nif (!taras || taras[cntIdx] !== 0) return {pass:false, message:"Тарас Мельник має мати order_count = 0 — у нього немає замовлень."};\nreturn {pass:true, message:"LEFT JOIN зберігає рядки БЕЗ пари — це і відрізняє його від INNER JOIN."};`,
  },
  {
    id: "sql-20",
    title: "Self-JOIN: таблиця з'єднується сама з собою",
    type: "sql",
    theory:
      "Іноді рядки ОДНІЄЇ таблиці посилаються на ІНШІ рядки цієї самої таблиці — типовий приклад: співробітник (employees) має manager_id, що посилається на id ІНШОГО співробітника з ТІЄЇ Ж таблиці employees. Щоб побачити ім'я керівника поруч з іменем співробітника, таблицю потрібно з'єднати САМУ З СОБОЮ — це і називається self-join.\n\nОскільки таблиця в такому JOIN одна й та сама, обом «копіям» потрібні РІЗНІ псевдоніми (аліаси), щоб SQL міг їх розрізняти: FROM employees e LEFT JOIN employees m ON e.manager_id = m.id — e (employee, сам співробітник) і m (manager, його керівник) це УМОВНІ, обрані нами імена для тієї самої таблиці employees.\n\nLEFT JOIN тут обраний навмисно: директорка (Оксана) не має керівника (manager_id = NULL) — INNER JOIN просто прибрав би її рядок з результату, а LEFT JOIN збереже його, з manager_name = NULL, показуючи, що в неї немає керівника, а не приховуючи цей факт.",
    examples: [
      { title: "Self-JOIN з псевдонімами", code: `SELECT e.name AS employee, m.name AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;`, explain: "e і m — це ОДНА Й ТА САМА таблиця employees, розрізнена лише псевдонімами." },
    ],
    task: "Виведи ім'я співробітника (employee) та ім'я його керівника (manager_name), об'єднавши employees саму з собою через LEFT JOIN.",
    setupSql: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER);\nINSERT INTO employees (id, name, manager_id) VALUES\n  (1, 'Оксана (директорка)', NULL),\n  (2, 'Богдан', 1),\n  (3, 'Софія', 1),\n  (4, 'Микита', 2);`,
    starter: `-- твій запит тут\n`,
    hints: [
      "FROM employees e LEFT JOIN employees m ON e.manager_id = m.id",
      "SELECT e.name AS employee, m.name AS manager_name",
      `SELECT e.name AS employee, m.name AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;`,
    ],
    solution: `SELECT e.name AS employee, m.name AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst empIdx = cols.indexOf('employee');\nconst mgrIdx = cols.indexOf('manager_name');\nif (empIdx === -1 || mgrIdx === -1) return {pass:false, message:"Потрібні стовпці employee і manager_name."};\nconst rows = execResult[0].values;\nif (rows.length !== 4) return {pass:false, message:"Має бути 4 рядки — усі співробітники (зараз: " + rows.length + ")."};\nconst mykyta = rows.find(r => r[empIdx] === 'Микита');\nif (!mykyta || mykyta[mgrIdx] !== 'Богдан') return {pass:false, message:"Керівник Микити має бути 'Богдан'."};\nconst oksana = rows.find(r => r[empIdx] === 'Оксана (директорка)');\nif (!oksana || oksana[mgrIdx] !== null) return {pass:false, message:"У Оксани немає керівника — manager_name має бути NULL."};\nreturn {pass:true, message:"Self-JOIN — той самий JOIN, лише з двома псевдонімами для однієї таблиці, щоб розрізнити 'себе' і 'керівника'."};`,
  },
  {
    id: "sql-21",
    title: "JOIN трьох таблиць",
    type: "sql",
    theory:
      "JOIN не обмежений двома таблицями — можна з'єднати ОДРАЗУ три (чи більше), додавши ще один JOIN ... ON: SELECT ... FROM orders JOIN customers ON ... JOIN products ON ... — кожен наступний JOIN додає ще одну умову зіставлення. INNER JOIN (без слова INNER — воно типове за замовчуванням, можна писати просто JOIN) працює так само, як раніше, лише тепер об'єднує три джерела даних в один результат.\n\nЦе саме те, що потрібно для реального звіту про замовлення: сама таблиця orders має лише ID (customer_id, product_id) — жодних імен чи назв. Щоб побачити ім'я КЛІЄНТА і назву ТОВАРУ поруч, потрібні одразу customers (для імені) і products (для назви й ціни) — orders виступає «сполучною ланкою» між ними.\n\nЯкщо в SELECT потрібно обчислення на основі стовпців з РІЗНИХ таблиць (products.price * orders.quantity — сума замовлення), це працює так само, як звичайна арифметика, лише значення беруться з уже об'єднаного результату JOIN.",
    examples: [
      { title: "Три таблиці разом", code: `SELECT customers.name, products.name, products.price * orders.quantity AS total\nFROM orders\nJOIN customers ON orders.customer_id = customers.id\nJOIN products ON orders.product_id = products.id;`, explain: "Ім'я клієнта, назва товару й сума замовлення (ціна × кількість) — усе поруч в одному рядку результату." },
    ],
    task: "Виведи ім'я клієнта (customers.name), назву товару (products.name) і суму замовлення total (products.price * orders.quantity) для кожного замовлення.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "Два JOIN: спочатку до customers, потім до products.",
      "total = products.price * orders.quantity, з псевдонімом AS total.",
      `SELECT customers.name, products.name, products.price * orders.quantity AS total\nFROM orders\nJOIN customers ON orders.customer_id = customers.id\nJOIN products ON orders.product_id = products.id;`,
    ],
    solution: `SELECT customers.name, products.name, products.price * orders.quantity AS total\nFROM orders\nJOIN customers ON orders.customer_id = customers.id\nJOIN products ON orders.product_id = products.id;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst rows = execResult[0].values;\nif (rows.length !== 8) return {pass:false, message:"Має бути 8 рядків — по одному на кожне замовлення (зараз: " + rows.length + ")."};\nconst first = rows.find(r => r[0] === 'Олена Коваль' && r[1] === 'Кобзар' && r[2] === 500);\nif (!first) return {pass:false, message:"Має знайтись рядок: Олена Коваль, Кобзар, total=500 (250 × 2)."};\nreturn {pass:true, message:"Три об'єднані таблиці — так у реальних звітах з'являються ІМЕНА й НАЗВИ замість голих ID."};`,
  },
  {
    id: "sql-22",
    title: "Підзапити (subqueries)",
    type: "sql",
    theory:
      "Підзапит — це SELECT УСЕРЕДИНІ іншого запиту, у дужках: результат внутрішнього запиту використовується зовнішнім. SELECT name FROM products WHERE id NOT IN (SELECT product_id FROM orders); — внутрішній запит (SELECT product_id FROM orders) повертає список ID товарів, які ХОЧА Б РАЗ замовляли, а зовнішній знаходить товари, ID яких У ЦЬОМУ списку НЕМАЄ.\n\nIN перевіряє, чи значення входить у список (з підзапиту чи перелічене вручну через кому): WHERE category IN ('Книги', 'Одяг') — категорія дорівнює одному з двох варіантів. NOT IN — протилежне: значення НЕ входить у список.\n\nПідзапити особливо корисні, коли питання природно формулюється у два кроки: «спочатку знайди ВСІ товари, які замовляли — тепер знайди товари, яких У ЦЬОМУ списку НЕМАЄ» — саме так думає людина, і SQL дозволяє записати цю думку майже дослівно, замість одного складного JOIN із додатковими умовами.",
    examples: [
      { title: "NOT IN з підзапитом", code: `SELECT name FROM products\nWHERE id NOT IN (SELECT product_id FROM orders);`, explain: "Товари, ID яких ЖОДНОГО РАЗУ не з'явився в orders.product_id — тобто товари, які ще ніхто не замовляв." },
    ],
    task: "Знайди назви товарів (name), які ЖОДНОГО РАЗУ не замовляли — використай NOT IN і підзапит до orders.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "Внутрішній запит: SELECT product_id FROM orders",
      "WHERE id NOT IN (...)",
      `SELECT name FROM products\nWHERE id NOT IN (SELECT product_id FROM orders);`,
    ],
    solution: `SELECT name FROM products\nWHERE id NOT IN (SELECT product_id FROM orders);`,
    testCode: `if (!execResult.length || execResult[0].values.length !== 1) return {pass:false, message:"Має знайтись рівно один товар, який ніколи не замовляли."};\nif (execResult[0].values[0][0] !== 'Джинси класичні') return {pass:false, message:"Це має бути 'Джинси класичні' (зараз: '" + execResult[0].values[0][0] + "')."};\nreturn {pass:true, message:"Підзапит у NOT IN — типовий спосіб знайти 'те, чого немає в іншій таблиці'."};`,
  },
  {
    id: "sql-23",
    title: "EXISTS: перевірка існування пов'язаних рядків",
    type: "sql",
    theory:
      "EXISTS перевіряє, чи підзапит повертає ХОЧА Б ОДИН рядок — не ЩО САМЕ він повертає, а сам факт, що там щось є: WHERE EXISTS (SELECT 1 FROM orders WHERE orders.customer_id = customers.id) — 'існує хоча б одне замовлення для цього клієнта'. У SELECT 1 усередині EXISTS конкретне значення не має значення (можна написати SELECT * чи навіть SELECT NULL) — важливий лише факт наявності рядка.\n\nЦе КОРЕЛЬОВАНИЙ підзапит — на відміну від підзапиту з попереднього уроку (виконується один раз, незалежно від зовнішнього запиту), корельований підзапит звертається до стовпця ЗОВНІШНЬОГО запиту (customers.id) і виконується ОКРЕМО для КОЖНОГО рядка зовнішньої таблиці — «для цього конкретного клієнта чи існує його замовлення?».\n\nEXISTS часто ефективніший за NOT IN на великих таблицях і коректніше поводиться з NULL-значеннями (NOT IN з підзапитом, що містить хоча б один NULL, може несподівано повернути ПОРОЖНІЙ результат — пастка, якої EXISTS уникає). NOT EXISTS — природна протилежність: «немає жодного пов'язаного рядка».",
    examples: [
      { title: "EXISTS з корельованим підзапитом", code: `SELECT name FROM customers c\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`, explain: "Поверне лише клієнтів, для яких існує хоча б один рядок в orders — Тарас Мельник (без замовлень) не потрапить у результат." },
    ],
    task: "Знайди імена клієнтів (name), які зробили хоча б одне замовлення, використавши EXISTS з корельованим підзапитом до orders.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)",
      "Потрібен псевдонім для customers (наприклад, c), щоб звернутись до c.id усередині підзапиту.",
      `SELECT name FROM customers c\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
    ],
    solution: `SELECT name FROM customers c\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst rows = execResult[0].values;\nif (rows.length !== 4) return {pass:false, message:"Має бути 4 клієнти із замовленнями (зараз: " + rows.length + ")."};\nif (rows.some(r => r[0] === 'Тарас Мельник')) return {pass:false, message:"Тарас Мельник не робив замовлень — його не має бути в результаті."};\nreturn {pass:true, message:"EXISTS перевіряє лише факт наявності пов'язаного рядка — і коректно працює для кожного клієнта окремо (корельований підзапит)."};`,
  },
  {
    id: "sql-24",
    title: "UNION і UNION ALL: об'єднання результатів двох запитів",
    type: "sql",
    theory:
      "UNION об'єднує результати ДВОХ (чи більше) окремих SELECT-запитів в один список рядків — за умови, що обидва запити повертають ОДНАКОВУ кількість стовпців сумісних типів. SELECT name, 'дорого' AS price_group FROM products WHERE price > 1000 UNION SELECT name, 'дешево' AS price_group FROM products WHERE price < 200; — два різні запити, об'єднані в один результат.\n\nUNION (без ALL) додатково прибирає ПОВНІ ДУБЛІКАТИ рядків з підсумкового результату — якщо обидва запити випадково повернули б однаковий рядок, у результаті він з'явиться лише ОДИН раз. UNION ALL натомість зберігає геть УСІ рядки з обох запитів, включно з повторами, — і працює швидше, бо не витрачає час на пошук дублікатів.\n\nІмена стовпців у підсумковому результаті беруться з ПЕРШОГО запиту — якщо другий запит назвав стовпці інакше, ці імена просто ігноруються. Кожен окремий SELECT, з'єднаний через UNION, може мати власний WHERE, але ORDER BY можна застосувати лише ОДИН РАЗ — у самому кінці, до всього об'єднаного результату.",
    examples: [
      { title: "UNION з двома фільтрованими запитами", code: `SELECT name, 'дорого' AS price_group FROM products WHERE price > 1000\nUNION\nSELECT name, 'дешево' AS price_group FROM products WHERE price < 200;`, explain: "Один список з 'дорогих' і 'дешевих' товарів, кожен зі своєю міткою price_group." },
    ],
    task: "Об'єднай через UNION дві вибірки: товари з price > 1000 (з міткою price_group = 'дорого') і товари з price < 200 (з міткою price_group = 'дешево').",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "Два SELECT з різними WHERE, з'єднані UNION.",
      "У кожному SELECT: name і текстовий літерал AS price_group.",
      `SELECT name, 'дорого' AS price_group FROM products WHERE price > 1000\nUNION\nSELECT name, 'дешево' AS price_group FROM products WHERE price < 200;`,
    ],
    solution: `SELECT name, 'дорого' AS price_group FROM products WHERE price > 1000\nUNION\nSELECT name, 'дешево' AS price_group FROM products WHERE price < 200;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst rows = execResult[0].values;\nif (rows.length !== 3) return {pass:false, message:"Має бути 3 рядки: 2 дорогих товари + 1 дешевий (зараз: " + rows.length + ")."};\nconst expensive = rows.filter(r => r[1] === 'дорого').length;\nconst cheap = rows.filter(r => r[1] === 'дешево').length;\nif (expensive !== 2 || cheap !== 1) return {pass:false, message:"Має бути 2 рядки 'дорого' і 1 рядок 'дешево'."};\nreturn {pass:true, message:"UNION об'єднує результати кількох SELECT-ів у один список — головна вимога: однакова кількість стовпців сумісних типів."};`,
  },
  {
    id: "sql-25",
    title: "CTE (WITH): іменований тимчасовий результат",
    type: "sql",
    theory:
      "CTE (Common Table Expression) — це запит, оголошений заздалегідь через WITH ім'я AS (...), яким потім можна користуватись у ГОЛОВНОМУ запиті, як звичайною таблицею: WITH product_totals AS (SELECT ... GROUP BY ...) SELECT * FROM product_totals WHERE ...; — спочатку виконується внутрішній запит (даючи йому ім'я product_totals), а потім головний запит звертається до нього за цим іменем.\n\nГоловна цінність CTE — ЧИТАБЕЛЬНІСТЬ: складний запит з кількома рівнями (спочатку згрупувати й порахувати суми, потім відфільтрувати результат за цією сумою) стає в рази зрозумілішим, розбитий на іменовані кроки, а не втиснутий в один суцільний вкладений підзапит. Технічно CTE й вкладений підзапит у дужках часто дають однаковий результат — різниця здебільшого в тому, наскільки легко ЛЮДИНІ прочитати запит.\n\nCTE існує лише на час виконання ОДНОГО запиту — не зберігається в базі даних, на відміну від VIEW. Якщо той самий проміжний результат потрібен ЧАСТО в різних запитах — має сенс VIEW; якщо лише РАЗ, для одного конкретного, складного запиту — CTE зручніший і не «засмічує» базу даних постійними об'єктами.",
    examples: [
      { title: "CTE з подальшою фільтрацією", code: `WITH product_totals AS (\n  SELECT products.id, products.name, SUM(products.price * orders.quantity) AS total\n  FROM orders\n  JOIN products ON orders.product_id = products.id\n  GROUP BY products.id\n)\nSELECT name, total FROM product_totals WHERE total > 1000;`, explain: "product_totals — це проміжний результат, до якого головний запит звертається, як до звичайної таблиці." },
    ],
    task: "За допомогою CTE product_totals порахуй SUM(price * quantity) по кожному товару, потім у головному запиті залиши лише товари з total > 1000.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит з WITH тут\n`,
    hints: [
      "WITH product_totals AS ( SELECT ... GROUP BY products.id )",
      "Головний запит: SELECT name, total FROM product_totals WHERE total > 1000;",
      `WITH product_totals AS (\n  SELECT products.id, products.name, SUM(products.price * orders.quantity) AS total\n  FROM orders\n  JOIN products ON orders.product_id = products.id\n  GROUP BY products.id\n)\nSELECT name, total FROM product_totals WHERE total > 1000;`,
    ],
    solution: `WITH product_totals AS (\n  SELECT products.id, products.name, SUM(products.price * orders.quantity) AS total\n  FROM orders\n  JOIN products ON orders.product_id = products.id\n  GROUP BY products.id\n)\nSELECT name, total FROM product_totals WHERE total > 1000;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst rows = execResult[0].values;\nif (rows.length !== 3) return {pass:false, message:"Має бути 3 товари з total > 1000 (зараз: " + rows.length + ")."};\nconst names = rows.map(r => r[0]).sort();\nif (JSON.stringify(names) !== JSON.stringify(['Навушники JBL','Смартфон Xiaomi','Футболка бавовняна'])) return {pass:false, message:"Мають бути саме ці три товари: Навушники JBL, Смартфон Xiaomi, Футболка бавовняна."};\nreturn {pass:true, message:"CTE (WITH) робить складний, багатокроковий запит читабельним — крок за кроком, з іменем для кожного проміжного результату."};`,
  },
  {
    id: "sql-26",
    title: "CASE WHEN: умовна логіка в запиті",
    type: "sql",
    theory:
      "CASE WHEN додає в SELECT умовну логіку — «якщо..., то..., інакше...» — прямо всередині запиту, без окремого коду навколо. CASE WHEN price > 1000 THEN 'дорого' ELSE 'доступно' END AS price_level — для кожного рядка перевіряє умову і повертає одне з двох значень, END завершує вираз.\n\nМожна перевірити кілька умов послідовно: CASE WHEN price > 1000 THEN 'дорого' WHEN price > 300 THEN 'середньо' ELSE 'доступно' END — умови перевіряються ПО ПОРЯДКУ зверху вниз, спрацьовує ПЕРША, що виявилась істинною, решта ігноруються. ELSE (необов'язковий) — значення, якщо жодна умова не підійшла.\n\nCASE WHEN зручний, коли потрібно перетворити «сире» число чи дату на зрозумілу текстову категорію просто в результаті запиту — не змінюючи саму таблицю й не обробляючи це окремо в коді застосунку після отримання даних.",
    examples: [
      { title: "Проста умова", code: `SELECT name, price,\n  CASE WHEN price > 1000 THEN 'дорого' ELSE 'доступно' END AS price_level\nFROM products;`, explain: "Кожен товар отримує текстову мітку залежно від ціни — усе в одному запиті." },
    ],
    task: "Для кожного товару виведи name, price і price_level: 'дорого', якщо price > 1000, інакше 'доступно'.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "CASE WHEN price > 1000 THEN 'дорого' ELSE 'доступно' END AS price_level",
      "Псевдонім AS price_level обов'язковий — саме він перевіряється.",
      `SELECT name, price,\n  CASE WHEN price > 1000 THEN 'дорого' ELSE 'доступно' END AS price_level\nFROM products;`,
    ],
    solution: `SELECT name, price,\n  CASE WHEN price > 1000 THEN 'дорого' ELSE 'доступно' END AS price_level\nFROM products;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst levelIdx = cols.indexOf('price_level');\nif (levelIdx === -1) return {pass:false, message:"Потрібен стовпець price_level (псевдонім AS price_level)."};\nconst rows = execResult[0].values;\nif (rows.length !== 6) return {pass:false, message:"Має бути 6 рядків — усі товари."};\nconst expensive = rows.filter(r => r[levelIdx] === 'дорого').length;\nif (expensive !== 2) return {pass:false, message:"Має бути рівно 2 товари з міткою 'дорого' (зараз: " + expensive + ")."};\nreturn {pass:true, message:"CASE WHEN — умовна логіка прямо в SQL-запиті, без окремої обробки результату в коді."};`,
  },
  {
    id: "sql-27",
    title: "Рядкові функції: LENGTH, SUBSTR, конкатенація",
    type: "sql",
    theory:
      "SQL має вбудовані функції для роботи з текстом: LENGTH(текст) повертає кількість символів, SUBSTR(текст, від, скільки) вирізає частину рядка (позиції рахуються з 1, а не з 0, на відміну від JS/Python), || об'єднує (конкатенує) кілька рядків в один: 'Привіт' || ', ' || 'світ' дасть 'Привіт, світ'.\n\nВарто знати одну практичну особливість: UPPER() і LOWER() у базовій SQLite (без додаткових розширень) коректно змінюють регістр лише для ЛАТИНИЦІ — на кириличному тексті вони можуть не спрацювати. LENGTH, SUBSTR, || і REPLACE натомість коректно працюють з будь-яким текстом, включно з українським.\n\nКомбінувати функції можна прямо в одному виразі: name || ' (' || LENGTH(name) || ' символів)' AS label — конкатенація тексту, виклику функції LENGTH і ще тексту в одному рядку, результат стає одним текстовим значенням у стовпці label.",
    examples: [
      { title: "Конкатенація й LENGTH разом", code: `SELECT name || ' (' || LENGTH(name) || ' символів)' AS label\nFROM products;`, explain: "Наприклад, 'Кобзар' перетвориться на 'Кобзар (6 символів)' — усе одним виразом." },
    ],
    task: "Для кожного товару виведи один стовпець label у форматі 'назва (N символів)', використовуючи || і LENGTH.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "name || ' (' || LENGTH(name) || ' символів)'",
      "Один стовпець результату з псевдонімом AS label.",
      `SELECT name || ' (' || LENGTH(name) || ' символів)' AS label\nFROM products;`,
    ],
    solution: `SELECT name || ' (' || LENGTH(name) || ' символів)' AS label\nFROM products;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst labelIdx = cols.indexOf('label');\nif (labelIdx === -1) return {pass:false, message:"Потрібен стовпець label (псевдонім AS label)."};\nconst rows = execResult[0].values;\nconst kobzar = rows.find(r => String(r[labelIdx]).startsWith('Кобзар'));\nif (!kobzar) return {pass:false, message:"Має бути рядок, що починається з 'Кобзар'."};\nif (kobzar[labelIdx] !== 'Кобзар (6 символів)') return {pass:false, message:"Очікувалось 'Кобзар (6 символів)' (зараз: '" + kobzar[labelIdx] + "')."};\nreturn {pass:true, message:"|| і LENGTH працюють коректно з будь-яким текстом — на відміну від UPPER/LOWER на кирилиці без розширень."};`,
  },
  {
    id: "sql-28",
    title: "Функції дат: фільтрація за періодом",
    type: "sql",
    theory:
      "У SQLite дати найчастіше зберігають як звичайний ТЕКСТ у форматі 'РРРР-ММ-ДД' (наприклад, '2024-02-15') — саме тому текстове порівняння (>, <, BETWEEN) прекрасно працює для дат у цьому форматі: рядки природно сортуються в хронологічному порядку. strftime(формат, дата) дає більше контролю: strftime('%Y-%m', order_date) поверне лише рік і місяць, наприклад '2024-02'.\n\nSELECT * FROM orders WHERE strftime('%Y-%m', order_date) = '2024-02'; знайде всі замовлення саме за лютий 2024 — незалежно від конкретного дня місяця. Основні коди формату: %Y — рік (4 цифри), %m — місяць (2 цифри), %d — день.\n\nАльтернативний спосіб для того самого результату — BETWEEN з межами дат: WHERE order_date BETWEEN '2024-02-01' AND '2024-02-29'; — обидва підходи дають однаковий результат для цього конкретного випадку, але strftime гнучкіший, коли потрібна лише ЧАСТИНА дати (тільки місяць, тільки рік, тільки день тижня).",
    examples: [
      { title: "Фільтр за місяцем через strftime", code: `SELECT * FROM orders\nWHERE strftime('%Y-%m', order_date) = '2024-02';`, explain: "Знайде всі замовлення за лютий 2024, незалежно від конкретного дня." },
    ],
    task: "Знайди всі замовлення (усі стовпці) за лютий 2024, використавши strftime('%Y-%m', order_date) = '2024-02'.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "strftime('%Y-%m', order_date) дає рядок 'РРРР-ММ'.",
      "Порівняй цей рядок з '2024-02'.",
      `SELECT * FROM orders\nWHERE strftime('%Y-%m', order_date) = '2024-02';`,
    ],
    solution: `SELECT * FROM orders\nWHERE strftime('%Y-%m', order_date) = '2024-02';`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nif (execResult[0].values.length !== 3) return {pass:false, message:"Має бути 3 замовлення за лютий 2024 (зараз: " + execResult[0].values.length + ")."};\nreturn {pass:true, message:"strftime дозволяє фільтрувати за будь-якою частиною дати — не лише за повною датою цілком."};`,
  },
  {
    id: "sql-29",
    title: "Віконні функції: ROW_NUMBER() OVER",
    type: "sql",
    theory:
      "Віконна функція (window function) обчислює значення для КОЖНОГО рядка окремо, дивлячись на «вікно» пов'язаних рядків навколо нього — на відміну від GROUP BY, вона НЕ схлопує рядки в одну групу, кожен рядок лишається на місці. ROW_NUMBER() OVER (...) присвоює кожному рядку послідовний номер.\n\nPARTITION BY всередині OVER ділить рядки на групи (так само, як GROUP BY), але для КОЖНОЇ групи нумерація починається заново з 1: ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) — у кожній категорії товари пронумеровані окремо, від найдорожчого (номер 1) до найдешевшого, а не наскрізно по всій таблиці.\n\nORDER BY всередині OVER (не плутати із загальним ORDER BY запиту) визначає порядок, за яким присвоюються номери в межах кожного вікна — тут за спаданням ціни, тому номер 1 завжди позначає найдорожчий товар СВОЄЇ категорії.",
    examples: [
      { title: "Нумерація в межах категорії", code: `SELECT name, category, price,\n  ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category\nFROM products;`, explain: "У кожній категорії найдорожчий товар отримає rank_in_category = 1, наступний за ціною — 2, і так окремо для кожної категорії." },
    ],
    task: "Пронумеруй товари в межах КОЖНОЇ категорії за спаданням ціни, використавши ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) як rank_in_category.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC)",
      "Псевдонім AS rank_in_category.",
      `SELECT name, category, price,\n  ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category\nFROM products;`,
    ],
    solution: `SELECT name, category, price,\n  ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category\nFROM products;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst nameIdx = cols.indexOf('name');\nconst rankIdx = cols.indexOf('rank_in_category');\nif (rankIdx === -1) return {pass:false, message:"Потрібен стовпець rank_in_category."};\nconst rows = execResult[0].values;\nif (rows.length !== 6) return {pass:false, message:"Має бути 6 рядків — усі товари, не згруповані (зараз: " + rows.length + ")."};\nconst xiaomi = rows.find(r => r[nameIdx] === 'Смартфон Xiaomi');\nif (!xiaomi || xiaomi[rankIdx] !== 1) return {pass:false, message:"Смартфон Xiaomi (найдорожчий в Електроніці) має мати rank_in_category = 1."};\nconst jbl = rows.find(r => r[nameIdx] === 'Навушники JBL');\nif (!jbl || jbl[rankIdx] !== 2) return {pass:false, message:"Навушники JBL мають мати rank_in_category = 2 (другий за ціною в Електроніці)."};\nreturn {pass:true, message:"ROW_NUMBER() OVER (PARTITION BY ...) нумерує рядки в межах кожної групи окремо, не схлопуючи їх, як це робить GROUP BY."};`,
  },
  {
    id: "sql-30",
    title: "Віконні функції: агрегати з PARTITION BY",
    type: "sql",
    theory:
      "Звичайні агрегатні функції (AVG, SUM) з GROUP BY схлопують рядки в одну підсумкову групу — деталі окремих рядків зникають. AVG(price) OVER (PARTITION BY category) робить інакше: рахує те саме середнє ОКРЕМО для кожної категорії, але ПОКАЗУЄ його поруч з КОЖНИМ окремим товаром, не втрачаючи жодного рядка деталізації.\n\nSELECT name, category, price, AVG(price) OVER (PARTITION BY category) AS avg_in_category FROM products; поверне усі 6 товарів (а не 3 групи, як дав би GROUP BY), і кожен рядок покаже, крім своєї власної ціни, ще й середню ціну ВСІЄЇ своєї категорії — зручно, коли треба порівняти конкретний товар із середнім по його групі, не втрачаючи інформацію про сам товар.\n\nЦе загальний принцип: GROUP BY відповідає на питання «яке підсумкове значення для кожної групи» (і показує лише ці підсумки), а віконна функція з PARTITION BY відповідає на питання «яке підсумкове значення для групи ЦЬОГО рядка, показане поруч із самим рядком» — деталі й підсумок одночасно, в одному результаті.",
    examples: [
      { title: "Середнє по категорії поруч з кожним товаром", code: `SELECT name, category, price,\n  AVG(price) OVER (PARTITION BY category) AS avg_in_category\nFROM products;`, explain: "6 рядків (не 3, як дав би GROUP BY) — кожен товар бачить середню ціну своєї категорії поруч зі своєю власною ціною." },
    ],
    task: "Виведи name, category, price і avg_in_category (середня ціна В МЕЖАХ категорії товару, AVG(price) OVER (PARTITION BY category)) — не втрачаючи жодного окремого товару.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій запит тут\n`,
    hints: [
      "AVG(price) OVER (PARTITION BY category) AS avg_in_category",
      "Результат має мати 6 рядків, а не 3 — на відміну від GROUP BY.",
      `SELECT name, category, price,\n  AVG(price) OVER (PARTITION BY category) AS avg_in_category\nFROM products;`,
    ],
    solution: `SELECT name, category, price,\n  AVG(price) OVER (PARTITION BY category) AS avg_in_category\nFROM products;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst nameIdx = cols.indexOf('name');\nconst avgIdx = cols.indexOf('avg_in_category');\nif (avgIdx === -1) return {pass:false, message:"Потрібен стовпець avg_in_category."};\nconst rows = execResult[0].values;\nif (rows.length !== 6) return {pass:false, message:"Має бути 6 рядків — усі товари, без схлопування GROUP BY (зараз: " + rows.length + ")."};\nconst jbl = rows.find(r => r[nameIdx] === 'Навушники JBL');\nif (!jbl || Math.abs(jbl[avgIdx] - 4850) > 0.01) return {pass:false, message:"avg_in_category для Навушників JBL (категорія Електроніка) має дорівнювати 4850."};\nreturn {pass:true, message:"PARTITION BY без GROUP BY — підсумок групи поруч з кожним окремим рядком, а не замість нього."};`,
  },
  {
    id: "sql-31",
    title: "CREATE VIEW: збережений запит",
    type: "sql",
    theory:
      "VIEW (представлення) — це ЗБЕРЕЖЕНИЙ запит, до якого можна звертатись, як до звичайної таблиці, не переписуючи весь SELECT щоразу: CREATE VIEW order_summary AS SELECT ... FROM ... JOIN ...; — тепер SELECT * FROM order_summary; поверне той самий результат, що й весь довгий запит усередині CREATE VIEW.\n\nVIEW НЕ зберігає копію даних — це просто «ім'я» для запиту: щоразу, коли до нього звертаються, база даних виконує вихідний SELECT заново проти АКТУАЛЬНИХ даних таблиць. Якщо в orders з'явиться нове замовлення, order_summary одразу покаже й його — без жодного додаткового оновлення самого VIEW.\n\nVIEW особливо корисний для складних запитів (кілька JOIN, підзапити, агрегація), якими користуються часто: замість того щоб копіювати той самий довгий SELECT у десяток різних місць коду, його описують ОДИН РАЗ як VIEW, а далі просто звертаються до нього за коротким іменем. VIEW і CTE з попереднього блоку уроків вирішують схожу задачу (іменований проміжний результат) — різниця в тому, що VIEW зберігається в базі НАЗАВЖДИ, а CTE існує лише на час одного запиту.",
    examples: [
      { title: "VIEW зі складним запитом усередині", code: `CREATE VIEW order_summary AS\nSELECT customers.name AS customer, products.name AS product, products.price * orders.quantity AS total\nFROM orders\nJOIN customers ON orders.customer_id = customers.id\nJOIN products ON orders.product_id = products.id;`, explain: "Після цього SELECT * FROM order_summary; поверне готовий, уже об'єднаний результат." },
    ],
    task: "Створи VIEW order_summary з полями customer (ім'я клієнта), product (назва товару), total (ціна × кількість) — об'єднавши orders, customers, products.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій CREATE VIEW тут\n`,
    hints: [
      "CREATE VIEW order_summary AS SELECT ... (той самий запит, що й в уроці про об'єднання трьох таблиць, з іншими псевдонімами).",
      "customer і product — псевдоніми через AS, не буквальні customers.name/products.name.",
      `CREATE VIEW order_summary AS\nSELECT customers.name AS customer, products.name AS product, products.price * orders.quantity AS total\nFROM orders\nJOIN customers ON orders.customer_id = customers.id\nJOIN products ON orders.product_id = products.id;`,
    ],
    solution: `CREATE VIEW order_summary AS\nSELECT customers.name AS customer, products.name AS product, products.price * orders.quantity AS total\nFROM orders\nJOIN customers ON orders.customer_id = customers.id\nJOIN products ON orders.product_id = products.id;`,
    testCode: `let res;\ntry { res = db.exec("SELECT * FROM order_summary;"); } catch (e) { return {pass:false, message:"VIEW order_summary не створено: " + e.message}; }\nif (!res.length || res[0].values.length !== 8) return {pass:false, message:"order_summary має повертати 8 рядків — по одному на кожне замовлення."};\nconst cols = res[0].columns.map(c=>c.toLowerCase());\nif (!cols.includes('customer') || !cols.includes('product') || !cols.includes('total')) return {pass:false, message:"order_summary має мати стовпці customer, product, total."};\nreturn {pass:true, message:"VIEW — збережений запит: звертаєшся до нього як до звичайної таблиці, а дані завжди актуальні."};`,
  },
  {
    id: "sql-32",
    title: "Фінальний проєкт: звіт по магазину",
    type: "sql",
    theory:
      "Останній крок: зібрати ВСЕ, що було зроблено в цьому курсі, в один цілісний звіт — SELECT, WHERE, ORDER BY/LIMIT, агрегати, GROUP BY, JOIN трьох таблиць — усе разом, в одному запиті: для КОЖНОГО клієнта, який зробив хоча б одне замовлення, порахувати кількість замовлень і загальну суму витрат, відсортувавши за спаданням суми.\n\nЛогіка запиту: об'єднати orders з customers і products (як в уроці про JOIN трьох таблиць), згрупувати за клієнтом (GROUP BY customers.id, як в уроці про GROUP BY), порахувати COUNT(*) замовлень і SUM(price * quantity) загальної суми для кожної групи, і відсортувати результат за сумою — ORDER BY total_spent DESC (як в уроці про ORDER BY).\n\nЦе і є звіт, обіцяний ще на вступній сторінці «Що це?» — реальний, практичний запит, який комбінує все вивчене: не одна ізольована техніка, а їхня сумісна робота в одному запиті, так само, як виглядають запити в реальних застосунках.",
    examples: [
      { title: "Повний звіт", code: `SELECT customers.name AS customer,\n  COUNT(orders.id) AS order_count,\n  SUM(products.price * orders.quantity) AS total_spent\nFROM orders\nJOIN customers ON orders.customer_id = customers.id\nJOIN products ON orders.product_id = products.id\nGROUP BY customers.id\nORDER BY total_spent DESC;`, explain: "JOIN трьох таблиць, GROUP BY по клієнту, два агрегати одразу, сортування за результатом — усе в одному запиті." },
    ],
    task: "Виведи для кожного клієнта, що зробив хоча б одне замовлення: ім'я (customer), кількість замовлень (order_count), загальну суму витрат (total_spent), відсортовано за спаданням суми.",
    setupSql: SHOP_SETUP_SQL,
    starter: `-- твій фінальний запит тут\n`,
    hints: [
      "JOIN orders з customers і products, потім GROUP BY customers.id.",
      "COUNT(orders.id) AS order_count, SUM(products.price * orders.quantity) AS total_spent, ORDER BY total_spent DESC.",
      `SELECT customers.name AS customer,\n  COUNT(orders.id) AS order_count,\n  SUM(products.price * orders.quantity) AS total_spent\nFROM orders\nJOIN customers ON orders.customer_id = customers.id\nJOIN products ON orders.product_id = products.id\nGROUP BY customers.id\nORDER BY total_spent DESC;`,
    ],
    solution: `SELECT customers.name AS customer,\n  COUNT(orders.id) AS order_count,\n  SUM(products.price * orders.quantity) AS total_spent\nFROM orders\nJOIN customers ON orders.customer_id = customers.id\nJOIN products ON orders.product_id = products.id\nGROUP BY customers.id\nORDER BY total_spent DESC;`,
    testCode: `if (!execResult.length) return {pass:false, message:"Запит не повернув результату."};\nconst cols = execResult[0].columns.map(c=>c.toLowerCase());\nconst custIdx = cols.indexOf('customer');\nconst totalIdx = cols.indexOf('total_spent');\nif (custIdx === -1 || totalIdx === -1) return {pass:false, message:"Потрібні стовпці customer і total_spent."};\nconst rows = execResult[0].values;\nif (rows.length !== 4) return {pass:false, message:"Має бути 4 клієнти (ті, хто робив замовлення), зараз: " + rows.length + "."};\nif (rows[0][custIdx] !== 'Марія Гнатюк') return {pass:false, message:"Перший рядок (найбільша сума) має бути Марія Гнатюк."};\nif (Math.abs(rows[0][totalIdx] - 8850) > 0.01) return {pass:false, message:"Сума для Марії Гнатюк має дорівнювати 8850 (зараз: " + rows[0][totalIdx] + ")."};\nif (rows[rows.length-1][custIdx] !== 'Іван Ткач') return {pass:false, message:"Останній рядок (найменша сума) має бути Іван Ткач."};\nreturn {pass:true, message:"Готово! Це і є завершений звіт по магазину — зібраний тобою крок за кроком за весь курс."};`,
    finalProject: {
      techs: ["SQL (SQLite)", "SELECT/WHERE/ORDER BY", "GROUP BY/HAVING", "JOIN (INNER/LEFT/self)", "підзапити/EXISTS/CTE", "UNION", "віконні функції", "транзакції", "VIEW"],
      skills: [
        "Вибірка й фільтрація даних (SELECT, WHERE, ORDER BY, LIMIT, NULL/COALESCE)",
        "Агрегація та групування (COUNT/SUM/AVG, GROUP BY, HAVING, віконні функції)",
        "Зміна даних і структури (INSERT/UPDATE/DELETE, CREATE/ALTER TABLE, обмеження, індекси, транзакції)",
        "Об'єднання таблиць (INNER/LEFT/self-JOIN, JOIN трьох таблиць)",
        "Підзапити, EXISTS, UNION, CTE, CASE WHEN",
        "Рядкові, числові й датові функції, CAST, збережені запити через VIEW",
      ],
      structure:
        "shop.db\n  ├── products (id, name, category, price, stock)\n  ├── customers (id, name, city)\n  ├── orders (id, customer_id, product_id, quantity, order_date)\n  ├── VIEW order_summary          # клієнт + товар + сума на кожне замовлення\n  └── звіт: клієнт, order_count, total_spent (ORDER BY total_spent DESC)",
      code: `SELECT customers.name AS customer,
  COUNT(orders.id) AS order_count,
  SUM(products.price * orders.quantity) AS total_spent
FROM orders
JOIN customers ON orders.customer_id = customers.id
JOIN products ON orders.product_id = products.id
GROUP BY customers.id
ORDER BY total_spent DESC;`,
      runCommand: "sqlite3 shop.db < shop.sql",
      installGuide: {
        intro: "Щоб запустити ці запити на власному комп'ютері поза браузером, потрібна лише сама SQLite — офіційна командна утиліта sqlite3, без жодних додаткових мов чи фреймворків.",
        steps: [
          { title: "Встанови SQLite", text: "На macOS/Linux sqlite3 зазвичай уже встановлена; на Windows завантаж sqlite-tools з sqlite.org/download.html." },
          { title: "Збережи схему й дані", text: "Скопіюй CREATE TABLE + INSERT команди з уроків цього курсу у файл shop.sql." },
          { title: "Створи базу даних", code: "sqlite3 shop.db < shop.sql" },
          { title: "Виконай запит", code: "sqlite3 shop.db \"SELECT customers.name, COUNT(orders.id) FROM orders JOIN customers ON orders.customer_id = customers.id GROUP BY customers.id;\"" },
        ],
      },
      improvements: [
        "Додати таблицю reviews (з уроку про CREATE TABLE) і пов'язати її з products",
        "Порахувати найпопулярніший товар (найбільша сумарна quantity) через ROW_NUMBER()",
        "Обгорнути звіт у VIEW customer_report для повторного використання",
        "Додати транзакцію для оформлення нового замовлення (списати stock і додати рядок в orders атомарно)",
      ],
      nextLevel:
        "Далі — курс Backend: та сама база даних shop.db підключається до реального сервера (Node.js/Express чи Python/FastAPI), і звіт, який досі виконувався вручну, стає відповіддю на HTTP-запит на кшталт GET /api/customers/report.",
    },
  },
];
