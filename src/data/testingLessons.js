// Testing — same reasoning as Backend's mini-Express and Full Stack's
// mini-git/mini-shell: a real testing library (Jest, Vitest) is a Node CLI
// tool with its own module system and can't run inside a browser sandbox,
// so this course self-hosts a SMALL but GENUINELY FUNCTIONING test runner
// (createTestRunner in MINI_TEST_SOURCE below) with the EXACT SAME syntax
// as real Jest/Vitest — it, expect, matchers, mocks, beforeEach/afterEach —
// so everything learned here transfers directly to a real project; only the
// runner itself is a simplified stand-in, and that's disclosed in lesson 2.
// Structure: an intro, then 16 "js" lessons (plus one "react" lesson that
// reuses the React course's Babel/React harness to test a component),
// building toward a final project — a full test suite for a small module.
const MINI_TEST_SOURCE = `
function createTestRunner() {
  const results = [];
  const pending = [];
  const beforeEachFns = [];
  const afterEachFns = [];

  function beforeEach(fn) { beforeEachFns.push(fn); }
  function afterEach(fn) { afterEachFns.push(fn); }

  function it(name, testFn) {
    beforeEachFns.forEach((f) => f());
    function finish(err) {
      afterEachFns.forEach((f) => f());
      results.push({ name, pass: !err, error: err ? String(err.message || err) : null });
    }
    try {
      const ret = testFn();
      if (ret && typeof ret.then === 'function') {
        pending.push(ret.then(() => finish(null), (e) => finish(e)));
      } else {
        finish(null);
      }
    } catch (e) {
      finish(e);
    }
  }
  const test = it;

  function describe(name, fn) { fn(); }

  function expect(actual) {
    const matchers = {
      toBe(expected) {
        if (!Object.is(actual, expected)) throw new Error('Очікував ' + JSON.stringify(expected) + ', отримав ' + JSON.stringify(actual));
      },
      toEqual(expected) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('Очікував ' + JSON.stringify(expected) + ', отримав ' + JSON.stringify(actual));
      },
      toBeTruthy() {
        if (!actual) throw new Error('Очікував істинне значення, отримав ' + JSON.stringify(actual));
      },
      toBeFalsy() {
        if (actual) throw new Error('Очікував хибне значення, отримав ' + JSON.stringify(actual));
      },
      toBeNull() {
        if (actual !== null) throw new Error('Очікував null, отримав ' + JSON.stringify(actual));
      },
      toBeUndefined() {
        if (actual !== undefined) throw new Error('Очікував undefined, отримав ' + JSON.stringify(actual));
      },
      toContain(item) {
        const ok = (typeof actual === 'string' || Array.isArray(actual)) && actual.includes(item);
        if (!ok) throw new Error('Очікував, що ' + JSON.stringify(actual) + ' міститиме ' + JSON.stringify(item));
      },
      toThrow() {
        if (typeof actual !== 'function') throw new Error('toThrow() очікує функцію без аргументів');
        let threw = false;
        try { actual(); } catch (e) { threw = true; }
        if (!threw) throw new Error('Очікував, що функція кине помилку, але вона виконалась без помилок');
      },
    };
    matchers.not = {
      toBe(expected) { if (Object.is(actual, expected)) throw new Error('Очікував, що значення НЕ дорівнюватиме ' + JSON.stringify(expected)); },
      toEqual(expected) { if (JSON.stringify(actual) === JSON.stringify(expected)) throw new Error('Очікував, що значення НЕ дорівнюватиме ' + JSON.stringify(expected)); },
      toContain(item) { const ok = (typeof actual === 'string' || Array.isArray(actual)) && actual.includes(item); if (ok) throw new Error('Очікував, що значення НЕ міститиме ' + JSON.stringify(item)); },
    };
    return matchers;
  }

  function fn(impl) {
    function mockFn(...args) {
      mockFn.mock.calls.push(args);
      return impl ? impl.apply(this, args) : undefined;
    }
    mockFn.mock = { calls: [] };
    mockFn.mockImplementation = (newImpl) => { impl = newImpl; return mockFn; };
    return mockFn;
  }

  async function flush() { await Promise.all(pending); }

  return { it, test, describe, expect, beforeEach, afterEach, fn, results, flush };
}

// Wraps a REAL function so a test's assertions can prove it actually got
// CALLED (not just that the expected value happens to match by coincidence)
// — used only in the seed data of this course, never inside a real project.
function spy(realFn) {
  function wrapped(...args) {
    wrapped.calls.push(args);
    return realFn.apply(this, args);
  }
  wrapped.calls = [];
  return wrapped;
}
`;

function harnessWith(seed) {
  return (
    MINI_TEST_SOURCE +
    "\nconst runner = createTestRunner();\nconst { it, test, describe, expect, beforeEach, afterEach, fn } = runner;\n" +
    (seed || "")
  );
}

// The one lesson (testing-16) that tests a React component reuses the React
// course's own harness pieces (render/tick) verbatim, combined with the
// mini-test engine above — its lesson.type is "react" so App.jsx runs it
// through the real Babel JSX transpile, exactly like any React course lesson.
const REACT_TEST_HARNESS_PREFIX = `
const { useState } = React;
function render(element) {
  const rootEl = document.getElementById('root');
  if (!window.__reactRoot) window.__reactRoot = ReactDOM.createRoot(rootEl);
  window.__reactRoot.render(element);
}
function tick(ms) { return new Promise((resolve) => setTimeout(resolve, ms || 0)); }
`;

export const TESTING_LESSONS = [
  {
    id: "testing-intro",
    title: "Що це? — Тестування",
    type: "intro",
    theory:
      "Досі в кожному курсі перевірку робила платформа: ти писала код, а прихована функція за лаштунками звіряла результат. Цей курс — про те, як писати ТАКІ Ж перевірки самостійно, для власного коду. Тестування — це код, що автоматично перевіряє ІНШИЙ код: замість того щоб щоразу вручну відкривати застосунок і клікати, аби переконатись, що функція досі працює правильно, пишеться тест — і він виконується за секунди, скільки завгодно разів, після КОЖНОЇ зміни коду.\n\nНайпоширеніші інструменти для цього в JavaScript-екосистемі — Jest і Vitest. Синтаксис, який ти вивчиш у цьому курсі (it, expect, toBe, describe), — це ТОЧНО ТОЙ САМИЙ синтаксис, що й у Jest/Vitest у реальному проєкті; сам механізм запуску тут — спрощений, самостійно написаний двигун (справжній Jest — це окремий npm-пакет з власною консольною утилітою, яку неможливо запустити прямо в браузері), але команди, які ти пишеш, переносяться 1-в-1.\n\nНавіщо це на практиці: тести ловлять регресії — ситуацію, коли зміна в одному місці коду ламає щось в іншому, про що розробник міг і не думати в момент зміни. У командній розробці тести — це ще й «жива документація»: новий член команди читає тести й одразу розуміє, як саме має поводитись код. Курс — 16 уроків від першого it()/expect() до тестування React-компонента й повного тестового набору для модуля.",
    presentation: [
      { title: "Тестування коротко", points: ["Код, що автоматично перевіряє ІНШИЙ код", "Той самий синтаксис, що й у реальних Jest/Vitest", "Ловить регресії — коли зміна в одному місці ламає інше"] },
      { title: "Навіщо це вчити", points: ["Обов'язковий навик у більшості серйозних проєктів і вакансій", "Тести — жива документація того, як має поводитись код", "Курс завершується тестуванням React-компонента й повним тестовим набором"] },
    ],
  },
  {
    id: "testing-1",
    title: "Перший тест: it() і expect().toBe()",
    type: "js",
    harness: harnessWith(`const sum = spy(function sum(a, b) { return a + b; });`),
    theory:
      "Тест складається з двох частин: it(\"опис\", функція) реєструє тест з ЛЮДСЬКОЧИТАБЕЛЬНОЮ назвою того, що перевіряється, а всередині функції expect(значення).toBe(очікуване) звіряє РЕАЛЬНИЙ результат з ОЧІКУВАНИМ. Якщо вони не збігаються, тест автоматично вважається провальним (fail) — і саме на це й розраховано: тест, що завжди проходить незалежно від коду, марний.\n\ntoBe перевіряє точну рівність (===) — годиться для чисел, рядків, boolean. it(\"...\", () => {...}) — стрілочна функція, як усюди в цьому курсі; назва тесту пишеться так, щоб читалась як речення: \"додає два додатні числа\", а не просто \"тест 1\".\n\nУ цьому курсі функція, яку тестуєш, уже готова (у прихованому «сетапі» уроку) — твоя задача лише НАПИСАТИ ТЕСТ на неї, а не саму функцію. Це і є типова робота з тестуванням: функція sum(a, b) уже існує в проєкті, і потрібно довести тестом, що вона працює правильно.",
    examples: [
      { title: "Перший тест", code: `it("додає два додатні числа", () => {\n  expect(sum(2, 3)).toBe(5);\n});`, explain: "expect(sum(2,3)) — реальний результат виклику; .toBe(5) — очікуване значення. Якщо sum поверне щось інше, тест впаде." },
    ],
    task: "Функція sum(a, b) уже визначена. Напиши тест через it(), що перевіряє: sum(2, 3) дорівнює 5.",
    starter: `// sum(a, b) вже існує — просто напиши тест на неї\n\nit("додає два числа", () => {\n  // твій код тут\n});\n`,
    hints: [
      "Усередині it() виклич expect(sum(2, 3)).",
      ".toBe(5) — очікуваний результат.",
      `it("додає два числа", () => {\n  expect(sum(2, 3)).toBe(5);\n});`,
    ],
    solution: `it("додає два числа", () => {\n  expect(sum(2, 3)).toBe(5);\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібно написати хоча б один тест через it()."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nif (sum.calls.length === 0) return {pass:false, message:"Тест має реально викликати функцію sum(...)."};\nreturn {pass:true, message:"it() + expect().toBe() — основа будь-якого тесту: описова назва плюс порівняння реального й очікуваного значення."};`,
  },
  {
    id: "testing-2",
    title: "toEqual: порівняння об'єктів і масивів",
    type: "js",
    harness: harnessWith(`const makeUser = spy(function makeUser(name) { return { name, active: true }; });`),
    theory:
      "toBe перевіряє === — для об'єктів і масивів це означає «це РІВНО ТОЙ САМИЙ об'єкт у пам'яті», а не «однаковий за вмістом». { a: 1 } !== { a: 1 } навіть якщо вони виглядають ідентично — це два РІЗНІ об'єкти. Тому toBe для об'єктів і масивів майже завжди дає неочікуваний провал тесту, навіть коли код насправді працює правильно.\n\nДля порівняння ВМІСТУ (глибокої рівності — кожне поле однакове, незалежно від того, чи це той самий об'єкт у пам'яті) використовують toEqual: expect(makeUser(\"Оля\")).toEqual({ name: \"Оля\", active: true }) — порівнюються ЗНАЧЕННЯ полів, а не посилання в пам'яті.\n\nПравило вибору: toBe — для примітивів (число, рядок, boolean, null, undefined). toEqual — для об'єктів і масивів. Переплутати їх — одна з найпоширеніших помилок новачків у тестуванні.",
    examples: [
      { title: "toEqual для об'єкта", code: `it("створює активного користувача", () => {\n  expect(makeUser("Оля")).toEqual({ name: "Оля", active: true });\n});`, explain: "toBe тут дав би хибний провал — makeUser щоразу повертає НОВИЙ об'єкт, навіть з однаковим вмістом." },
    ],
    task: 'Функція makeUser(name) вже визначена, повертає { name, active: true }. Напиши тест: makeUser("Оля") дорівнює (toEqual) { name: "Оля", active: true }.',
    starter: `it("створює активного користувача", () => {\n  // твій код тут\n});\n`,
    hints: [
      "Для об'єктів завжди toEqual, не toBe.",
      'expect(makeUser("Оля")).toEqual({ name: "Оля", active: true });',
      `it("створює активного користувача", () => {\n  expect(makeUser("Оля")).toEqual({ name: "Оля", active: true });\n});`,
    ],
    solution: `it("створює активного користувача", () => {\n  expect(makeUser("Оля")).toEqual({ name: "Оля", active: true });\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен хоча б один тест."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nif (makeUser.calls.length === 0) return {pass:false, message:"Тест має викликати makeUser(...)."};\nreturn {pass:true, message:"toEqual порівнює ВМІСТ об'єкта чи масиву; toBe для них майже завжди дасть хибний провал."};`,
  },
  {
    id: "testing-3",
    title: "toBeTruthy, toBeFalsy, toBeNull, toBeUndefined",
    type: "js",
    harness: harnessWith(`const findUser = spy(function findUser(id) { return id === 1 ? { id: 1, name: "Іван" } : null; });`),
    theory:
      "Іноді важливий не ТОЧНИЙ результат, а лише те, істинне значення чи хибне. toBeTruthy() проходить для будь-якого значення, що поводиться як true в умові if (об'єкт, непорожній рядок, ненульове число); toBeFalsy() — навпаки, для false, 0, \"\", null, undefined, NaN.\n\ntoBeNull() перевіряє СТРОГО значення null — не просто «хибне», а саме null (на відміну від toBeFalsy(), яке пропустить і 0, і \"\", і undefined теж). toBeUndefined() так само строго перевіряє саме undefined — типовий випадок: функція, що НІЧОГО не знайшла, часто повертає null (навмисно, як явний «нічого немає») або undefined (значення просто не було встановлено) — і це РІЗНІ речі, які варто розрізняти в тесті.\n\nВибір конкретного матчера — це частина того, ЩО САМЕ тест документує: toBeNull() каже читачу тесту «тут очікується явне відсутнє значення», тоді як toBeFalsy() каже лише «тут щось хибне, байдуже що саме» — перший варіант зазвичай точніший і кращий стиль.",
    examples: [
      { title: "toBeNull для «нічого не знайдено»", code: `it("повертає null, якщо користувача немає", () => {\n  expect(findUser(999)).toBeNull();\n});\nit("повертає користувача за id", () => {\n  expect(findUser(1)).toBeTruthy();\n});`, explain: "toBeNull() точно перевіряє відсутність результату; toBeTruthy() лише каже, що результат «є щось»." },
    ],
    task: "Функція findUser(id) вже визначена. Напиши два тести: findUser(999) дорівнює null (toBeNull), findUser(1) — істинне значення (toBeTruthy).",
    starter: `it("повертає null, якщо користувача немає", () => {\n  // твій код тут\n});\nit("повертає користувача за id", () => {\n  // твій код тут\n});\n`,
    hints: [
      "expect(findUser(999)).toBeNull();",
      "expect(findUser(1)).toBeTruthy();",
      `it("повертає null, якщо користувача немає", () => {\n  expect(findUser(999)).toBeNull();\n});\nit("повертає користувача за id", () => {\n  expect(findUser(1)).toBeTruthy();\n});`,
    ],
    solution: `it("повертає null, якщо користувача немає", () => {\n  expect(findUser(999)).toBeNull();\n});\nit("повертає користувача за id", () => {\n  expect(findUser(1)).toBeTruthy();\n});`,
    testCode: `await runner.flush();\nif (runner.results.length < 2) return {pass:false, message:"Потрібні два тести."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nif (findUser.calls.length < 2) return {pass:false, message:"Обидва тести мають реально викликати findUser(...)."};\nreturn {pass:true, message:"toBeNull()/toBeUndefined() точніші за toBeFalsy() — вони документують САМЕ те значення, що очікується."};`,
  },
  {
    id: "testing-4",
    title: "toContain: перевірка вмісту",
    type: "js",
    harness: harnessWith(`const tags = spy(function tags(post) { return post.tags; });\nconst post = { tags: ["react", "javascript", "frontend"] };`),
    theory:
      "toContain перевіряє, що масив МІСТИТЬ конкретний елемент (не порівнюючи весь масив цілком, як toEqual, а лише перевіряючи присутність ОДНОГО значення десь усередині): expect([\"a\", \"b\", \"c\"]).toContain(\"b\") — пройде, незалежно від позиції \"b\" у масиві чи довжини масиву.\n\nТой самий матчер працює і для рядків, перевіряючи ПІДРЯДОК: expect(\"Привіт, світе!\").toContain(\"світе\") — пройде. Це особливо корисно, коли точний повний текст неважливий чи може змінюватись (наприклад, повідомлення про помилку з динамічною датою), а важлива лише присутність КЛЮЧОВОЇ частини.\n\ntoContain — менш строгий за toEqual, і саме тому кращий вибір, коли тест не повинен «ламатись» від несуттєвих змін (додався новий тег у масив — тест з toEqual впав би, тест з toContain на конкретний тег — ні).",
    examples: [
      { title: "toContain для масиву", code: `it("список містить тег javascript", () => {\n  expect(tags(post)).toContain("javascript");\n});`, explain: "Тест не зламається, якщо до масиву tags додадуть ще один тег — перевіряється лише присутність конкретного значення." },
    ],
    task: 'post.tags — масив тегів. Функція tags(post) вже визначена. Напиши тест: tags(post) містить "javascript".',
    starter: `it("список містить тег javascript", () => {\n  // твій код тут\n});\n`,
    hints: [
      "expect(tags(post)).toContain(\"javascript\");",
      "toContain для масиву перевіряє присутність елемента, не весь масив цілком.",
      `it("список містить тег javascript", () => {\n  expect(tags(post)).toContain("javascript");\n});`,
    ],
    solution: `it("список містить тег javascript", () => {\n  expect(tags(post)).toContain("javascript");\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен тест."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nif (tags.calls.length === 0) return {pass:false, message:"Тест має викликати tags(post)."};\nreturn {pass:true, message:"toContain перевіряє присутність елемента чи підрядка — менш крихкий за toEqual, коли точний повний вміст неважливий."};`,
  },
  {
    id: "testing-5",
    title: "toThrow: тестування помилок",
    type: "js",
    harness: harnessWith(`const divide = spy(function divide(a, b) {\n  if (b === 0) throw new Error("Ділення на нуль");\n  return a / b;\n});`),
    theory:
      "Іноді ПРАВИЛЬНА поведінка функції — кинути помилку (наприклад, при некоректних вхідних даних) — і це так само важливо протестувати, як і звичайний успішний результат. toThrow() перевіряє, що функція, ЯКЩО її викликати, кидає помилку.\n\nКлючова деталь синтаксису: у expect() передають НЕ виклик функції (divide(5, 0)), а САМУ функцію, ОБГОРНУТУ в стрілочну функцію без аргументів: expect(() => divide(5, 0)).toThrow(). Якби передати divide(5, 0) напряму, помилка кинулась би ОДРАЗУ, під час обчислення аргумента для expect(), ще до виклику toThrow() — і весь тест впав би з незрозумілою помилкою замість чіткого результату перевірки.\n\nЦе один з небагатьох матчерів, що вимагає саме ТАКОЇ обгортки — стрілочна функція «відкладає» виклик до моменту, коли toThrow() сам вирішить його викликати і перехопити помилку зсередини.",
    examples: [
      { title: "toThrow з обгорткою", code: `it("кидає помилку при діленні на нуль", () => {\n  expect(() => divide(5, 0)).toThrow();\n});\nit("ділить нормально", () => {\n  expect(divide(10, 2)).toBe(5);\n});`, explain: "Перший тест передає ФУНКЦІЮ (() => divide(5, 0)), не результат виклику — інакше помилка кинулась би зарано." },
    ],
    task: "Функція divide(a, b) вже визначена (кидає помилку при b=0). Напиши тест: divide(5, 0) кидає помилку (toThrow, з обгорткою у стрілочну функцію).",
    starter: `it("кидає помилку при діленні на нуль", () => {\n  // твій код тут — не забудь обгортку () => ...\n});\n`,
    hints: [
      "expect(() => divide(5, 0)).toThrow(); — саме так, з обгорткою.",
      "Без стрілочної функції помилка кинулась би ще до виклику toThrow().",
      `it("кидає помилку при діленні на нуль", () => {\n  expect(() => divide(5, 0)).toThrow();\n});`,
    ],
    solution: `it("кидає помилку при діленні на нуль", () => {\n  expect(() => divide(5, 0)).toThrow();\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен тест."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nreturn {pass:true, message:"toThrow() вимагає передати САМУ функцію (через стрілочну обгортку), а не результат її виклику."};`,
  },
  {
    id: "testing-6",
    title: "not: заперечення матчера",
    type: "js",
    harness: harnessWith(`const clean = spy(function clean(str) { return str.trim().toLowerCase(); });`),
    theory:
      "Будь-який матчер можна ЗАПЕРЕЧИТИ, вставивши .not перед ним: expect(value).not.toBe(5) пройде, якщо value НЕ дорівнює 5. Це працює так само для toEqual, toContain — .not інвертує результат перевірки.\n\n.not корисний, коли важливо довести, що щось НЕ сталось: функція очищення тексту НЕ повинна лишати зайві пробіли, список НЕ повинен містити видалений елемент, стан НЕ повинен дорівнювати початковому після зміни. Формулювання «має НЕ бути X» часто природніше саме через .not, ніж через складнішу позитивну перевірку.\n\nВажливо не зловживати .not — тест, що перевіряє лише «не дорівнює X», значно слабший за тест, що перевіряє «дорівнює КОНКРЕТНОМУ Y» (адже «не 5» лишає нескінченно багато варіантів, які пройшли б тест, включно з абсолютно неправильними). .not найкраще працює РАЗОМ із позитивною перевіркою, а не замість неї.",
    examples: [
      { title: ".not.toBe()", code: `it("прибирає зайві пробіли з країв", () => {\n  const result = clean("  Привіт  ");\n  expect(result).not.toBe("  Привіт  ");\n  expect(result).toBe("привіт");\n});`, explain: "Перша перевірка доводить, що щось ЗМІНИЛОСЬ; друга — що змінилось саме ПРАВИЛЬНО. Разом вони сильніші, ніж будь-яка сама по собі." },
    ],
    task: 'Функція clean(str) вже визначена (trim + toLowerCase). Напиши тест: clean("  Привіт  ") НЕ дорівнює "  Привіт  " (not.toBe), і дорівнює "привіт" (toBe).',
    starter: `it("прибирає зайві пробіли й приводить до нижнього регістру", () => {\n  const result = clean("  Привіт  ");\n  // твій код тут: дві перевірки\n});\n`,
    hints: [
      "expect(result).not.toBe(\"  Привіт  \");",
      "expect(result).toBe(\"привіт\");",
      `it("прибирає зайві пробіли й приводить до нижнього регістру", () => {\n  const result = clean("  Привіт  ");\n  expect(result).not.toBe("  Привіт  ");\n  expect(result).toBe("привіт");\n});`,
    ],
    solution: `it("прибирає зайві пробіли й приводить до нижнього регістру", () => {\n  const result = clean("  Привіт  ");\n  expect(result).not.toBe("  Привіт  ");\n  expect(result).toBe("привіт");\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен тест."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nreturn {pass:true, message:".not інвертує будь-який матчер — найсильніший, коли доповнює позитивну перевірку, а не замінює її."};`,
  },
  {
    id: "testing-7",
    title: "Кілька тестів і describe",
    type: "js",
    harness: harnessWith(`const isValidAge = spy(function isValidAge(age) { return age >= 0 && age <= 120; });`),
    theory:
      "Одну функцію зазвичай перевіряють НЕ ОДНИМ тестом, а кількома, кожен з яких доводить ОКРЕМИЙ аспект поведінки: «працює для звичайного випадку», «працює для межового значення», «відхиляє некоректний вхід». Кожен it() — незалежний: провал одного НЕ впливає на виконання інших.\n\ndescribe(\"назва групи\", () => { it(...); it(...); }) групує ПОВ'ЯЗАНІ тести під спільною назвою — не змінює логіку перевірки, лише структурує вивід і читабельність: усі тести про isValidAge зручно бачити РАЗОМ, під заголовком \"isValidAge\", а не розкидані серед тестів інших функцій.\n\nОсобливо важливі межові випадки (edge cases): не лише «звичайні» значення, а й межі допустимого діапазону (0 і 120 у прикладі нижче) — саме на межах найчастіше ховаються реальні баги (помилка на одиницю, \"off-by-one\").",
    examples: [
      { title: "describe групує тести", code: `describe("isValidAge", () => {\n  it("приймає звичайний вік", () => {\n    expect(isValidAge(25)).toBeTruthy();\n  });\n  it("приймає межове значення 0", () => {\n    expect(isValidAge(0)).toBeTruthy();\n  });\n  it("відхиляє від'ємний вік", () => {\n    expect(isValidAge(-1)).toBeFalsy();\n  });\n});`, explain: "Три незалежні тести під однією назвою групи — кожен перевіряє ОКРЕМИЙ аспект: звичайний випадок, межу, некоректний вхід." },
    ],
    task: "Функція isValidAge(age) вже визначена. Всередині describe(\"isValidAge\", ...) напиши три тести: 25 — валідний, 0 — валідний (межа), -1 — невалідний.",
    starter: `describe("isValidAge", () => {\n  // три it() тут\n});\n`,
    hints: [
      "it(\"приймає звичайний вік\", () => { expect(isValidAge(25)).toBeTruthy(); });",
      "Не забудь межове значення 0 і некоректне -1.",
      `describe("isValidAge", () => {\n  it("приймає звичайний вік", () => {\n    expect(isValidAge(25)).toBeTruthy();\n  });\n  it("приймає межове значення 0", () => {\n    expect(isValidAge(0)).toBeTruthy();\n  });\n  it("відхиляє від'ємний вік", () => {\n    expect(isValidAge(-1)).toBeFalsy();\n  });\n});`,
    ],
    solution: `describe("isValidAge", () => {\n  it("приймає звичайний вік", () => {\n    expect(isValidAge(25)).toBeTruthy();\n  });\n  it("приймає межове значення 0", () => {\n    expect(isValidAge(0)).toBeTruthy();\n  });\n  it("відхиляє від'ємний вік", () => {\n    expect(isValidAge(-1)).toBeFalsy();\n  });\n});`,
    testCode: `await runner.flush();\nif (runner.results.length < 3) return {pass:false, message:"Потрібні три тести."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nif (isValidAge.calls.length < 3) return {pass:false, message:"Усі три тести мають реально викликати isValidAge(...)."};\nreturn {pass:true, message:"describe групує пов'язані тести; межові випадки (0, максимум, некоректний вхід) ловлять найбільше реальних багів."};`,
  },
  {
    id: "testing-8",
    title: "beforeEach: підготовка перед кожним тестом",
    type: "js",
    harness: harnessWith(`function createCart() {\n  return { items: [], total: 0, add(price) { this.items.push(price); this.total += price; } };\n}\nlet cart;`),
    theory:
      "Якщо кілька тестів потребують ОДНАКОВОГО початкового стану (наприклад, «порожній кошик» перед кожною перевіркою), дублювати створення цього стану в КОЖНОМУ it() — і багато повторюваного коду, і ризик, що один тест випадково вплине на стан наступного (якщо об'єкт спільний і не перестворюється). beforeEach(() => {...}) вирішує це: функція всередині виконується автоматично ПЕРЕД КОЖНИМ it() у файлі.\n\nТиповий патерн: beforeEach(() => { cart = createCart(); }) — кожен тест починається зі СВІЖОГО, щойно створеного кошика, незалежно від того, що робили попередні тести. Це гарантує ІЗОЛЬОВАНІСТЬ тестів один від одного — результат одного тесту ніколи не залежить від порядку виконання чи побічних ефектів іншого.\n\nЗмінна (тут cart) оголошується ЗОВНІ (let cart;, без початкового значення), а присвоюється саме всередині beforeEach — так кожен it() бачить АКТУАЛЬНЕ, щойно підготовлене значення.",
    examples: [
      { title: "Свіжий кошик перед кожним тестом", code: `beforeEach(() => {\n  cart = createCart();\n});\n\nit("починається порожнім", () => {\n  expect(cart.items.length).toBe(0);\n});\nit("додає товар", () => {\n  cart.add(100);\n  expect(cart.total).toBe(100);\n});`, explain: "Другий тест не бачить впливу першого — beforeEach пересворює cart перед КОЖНИМ it(), тому 'додає товар' теж починає з порожнього кошика." },
    ],
    task: "createCart() уже визначена. Через beforeEach створюй свіжий cart перед кожним тестом. Напиши тести: cart.items.length дорівнює 0; після cart.add(100) cart.total дорівнює 100.",
    starter: `beforeEach(() => {\n  // твій код тут\n});\n\nit("починається порожнім", () => {\n  // твій код тут\n});\nit("додає товар", () => {\n  // твій код тут\n});\n`,
    hints: [
      "beforeEach(() => { cart = createCart(); });",
      "У другому тесті спочатку cart.add(100), потім перевірка cart.total.",
      `beforeEach(() => {\n  cart = createCart();\n});\n\nit("починається порожнім", () => {\n  expect(cart.items.length).toBe(0);\n});\nit("додає товар", () => {\n  cart.add(100);\n  expect(cart.total).toBe(100);\n});`,
    ],
    solution: `beforeEach(() => {\n  cart = createCart();\n});\n\nit("починається порожнім", () => {\n  expect(cart.items.length).toBe(0);\n});\nit("додає товар", () => {\n  cart.add(100);\n  expect(cart.total).toBe(100);\n});`,
    testCode: `await runner.flush();\nif (runner.results.length < 2) return {pass:false, message:"Потрібні два тести."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nreturn {pass:true, message:"beforeEach гарантує свіжий, ізольований стан перед КОЖНИМ тестом — результат одного тесту ніколи не впливає на інший."};`,
  },
  {
    id: "testing-9",
    title: "afterEach: прибирання після тесту",
    type: "js",
    harness: harnessWith(`function subscribe() { window.__activeSubscriptions = (window.__activeSubscriptions || 0) + 1; return () => { window.__activeSubscriptions -= 1; }; }\nlet unsubscribe;`),
    theory:
      "afterEach(() => {...}) — дзеркальна протилежність beforeEach: функція виконується автоматично ПІСЛЯ КОЖНОГО it(), незалежно від того, пройшов тест чи провалився. Використовують для «прибирання» — скасування підписок, очищення таймерів, закриття з'єднань, які тест сам відкрив.\n\nБез afterEach ресурси, відкриті ОДНИМ тестом (підписка, таймер), могли б лишитись «висіти» й впливати на НАСТУПНІ тести чи навіть просто витікати (memory leak) протягом усього прогону тестів — той самий принцип, що й cleanup-функція useEffect із курсу React.\n\nТиповий парний патерн: beforeEach щось СТВОРЮЄ, afterEach те саме СКАСОВУЄ — subscribe() у прикладі нижче повертає функцію unsubscribe, яку зберігають і викликають саме в afterEach, гарантуючи, що кожен тест «прибирає за собою», навіть якщо сам тест впав з помилкою.",
    examples: [
      { title: "afterEach скасовує підписку", code: `afterEach(() => {\n  if (unsubscribe) unsubscribe();\n});\n\nit("підписка збільшує лічильник", () => {\n  unsubscribe = subscribe();\n  expect(window.__activeSubscriptions).toBe(1);\n});`, explain: "Після цього тесту afterEach викликає unsubscribe() — лічильник повертається до 0, і наступний тест починає з чистого стану." },
    ],
    task: "subscribe() уже визначена, повертає функцію відписки. Через afterEach викликай unsubscribe(), якщо вона є. Напиши тест: після subscribe() window.__activeSubscriptions дорівнює 1.",
    starter: `afterEach(() => {\n  // твій код тут\n});\n\nit("підписка збільшує лічильник", () => {\n  unsubscribe = subscribe();\n  // твій код тут\n});\n`,
    hints: [
      "afterEach(() => { if (unsubscribe) unsubscribe(); });",
      "expect(window.__activeSubscriptions).toBe(1);",
      `afterEach(() => {\n  if (unsubscribe) unsubscribe();\n});\n\nit("підписка збільшує лічильник", () => {\n  unsubscribe = subscribe();\n  expect(window.__activeSubscriptions).toBe(1);\n});`,
    ],
    solution: `afterEach(() => {\n  if (unsubscribe) unsubscribe();\n});\n\nit("підписка збільшує лічильник", () => {\n  unsubscribe = subscribe();\n  expect(window.__activeSubscriptions).toBe(1);\n});`,
    testCode: `window.__activeSubscriptions = 0;\nawait runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен тест."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nif (window.__activeSubscriptions !== 0) return {pass:false, message:"Після afterEach підписка має бути скасована (лічильник знову 0, зараз: " + window.__activeSubscriptions + ")."};\nreturn {pass:true, message:"afterEach прибирає за тестом незалежно від результату — так ресурси одного тесту ніколи не впливають на інші."};`,
  },
  {
    id: "testing-10",
    title: "Мок-функції: fn() і відстеження викликів",
    type: "js",
    harness: harnessWith(`function notifyUser(callback, message) { callback(message); }`),
    theory:
      "Іноді потрібно перевірити не РЕЗУЛЬТАТ функції, а те, ЩО САМЕ вона зробила з переданим їй аргументом-функцією (callback) — наприклад, чи викликала його, скільки разів, з якими аргументами. Для цього замість реальної функції передають мок (mock) — «підставну» функцію, створену через fn(), що запам'ятовує кожен свій виклик, нічого реального не роблячи.\n\nconst callback = fn() створює мок-функцію; callback.mock.calls — масив усіх викликів, де кожен елемент — масив аргументів ТОГО виклику. Після notifyUser(callback, \"Привіт\") можна перевірити: callback.mock.calls.length (скільки разів викликали) і callback.mock.calls[0][0] (перший аргумент першого виклику).\n\nЦе особливо корисно, коли реальна функція мала б побічний ефект, небажаний у тесті (надсилання справжнього email, запис у справжню базу) — мок дозволяє перевірити «чи МАЛА б відбутись ця дія», не виконуючи її насправді.",
    examples: [
      { title: "Мок-callback", code: `it("викликає callback з повідомленням", () => {\n  const callback = fn();\n  notifyUser(callback, "Привіт!");\n  expect(callback.mock.calls.length).toBe(1);\n  expect(callback.mock.calls[0][0]).toBe("Привіт!");\n});`, explain: "callback нічого реально не робить — лише запам'ятовує, що його викликали й з яким аргументом." },
    ],
    task: "notifyUser(callback, message) уже визначена, викликає callback(message). Напиши тест з моком: після notifyUser(callback, \"Привіт!\") мок викликаний рівно раз, з аргументом \"Привіт!\".",
    starter: `it("викликає callback з повідомленням", () => {\n  const callback = fn();\n  notifyUser(callback, "Привіт!");\n  // твій код тут: дві перевірки\n});\n`,
    hints: [
      "expect(callback.mock.calls.length).toBe(1);",
      "expect(callback.mock.calls[0][0]).toBe(\"Привіт!\"); — перший [0] це виклик, другий [0] це перший аргумент.",
      `it("викликає callback з повідомленням", () => {\n  const callback = fn();\n  notifyUser(callback, "Привіт!");\n  expect(callback.mock.calls.length).toBe(1);\n  expect(callback.mock.calls[0][0]).toBe("Привіт!");\n});`,
    ],
    solution: `it("викликає callback з повідомленням", () => {\n  const callback = fn();\n  notifyUser(callback, "Привіт!");\n  expect(callback.mock.calls.length).toBe(1);\n  expect(callback.mock.calls[0][0]).toBe("Привіт!");\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен тест."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nreturn {pass:true, message:"Мок-функція fn() запам'ятовує виклики (mock.calls) — дозволяє перевірити ЩО ВІДБУЛОСЬ, не виконуючи реальний побічний ефект."};`,
  },
  {
    id: "testing-11",
    title: "mockImplementation: підміна поведінки",
    type: "js",
    harness: harnessWith(`function getDiscount(priceApi, code) { const price = priceApi(code); return price > 100 ? price * 0.9 : price; }`),
    theory:
      "fn() без аргументів створює мок, що нічого не повертає (undefined) — цього достатньо, коли перевіряється лише сам факт виклику. Але часто функція, яку тестуєш, ВИКОРИСТОВУЄ результат замоканого виклику далі у своїй логіці — тоді потрібен мок, що повертає КОНКРЕТНЕ, контрольоване значення: const priceApi = fn(() => 150) — мок, що на будь-який виклик повертає 150.\n\nЦе дозволяє протестувати логіку функції ІЗОЛЬОВАНО від реального джерела даних (справжнього API, бази даних) — підставивши передбачуваний, повністю контрольований результат замість непередбачуваного реального. getDiscount у прикладі нижче не робить жодного реального запиту в тесті — мок просто «прикидається» API, повертаючи те значення, яке потрібно для перевірки конкретного сценарію.\n\nmockImplementation(newFn) дозволяє ЗМІНИТИ поведінку мока ПІСЛЯ його створення — корисно, коли той самий мок має по-різному поводитись у різних тестах (наприклад, спершу повернути звичайну ціну, потім — ціну з знижкою).",
    examples: [
      { title: "Мок із контрольованим результатом", code: `it("застосовує знижку 10% для дорогих товарів", () => {\n  const priceApi = fn(() => 200);\n  expect(getDiscount(priceApi, "X1")).toBe(180);\n});\nit("не застосовує знижку для дешевих товарів", () => {\n  const priceApi = fn(() => 50);\n  expect(getDiscount(priceApi, "X2")).toBe(50);\n});`, explain: "Обидва тести повністю контролюють, що поверне priceApi, — жодного реального API, жодної непередбачуваності." },
    ],
    task: "getDiscount(priceApi, code) уже визначена. Напиши тест: мок priceApi повертає 200 через fn(() => 200), getDiscount(priceApi, \"X1\") дорівнює 180.",
    starter: `it("застосовує знижку 10% для дорогих товарів", () => {\n  // твій код тут\n});\n`,
    hints: [
      "const priceApi = fn(() => 200);",
      "expect(getDiscount(priceApi, \"X1\")).toBe(180);",
      `it("застосовує знижку 10% для дорогих товарів", () => {\n  const priceApi = fn(() => 200);\n  expect(getDiscount(priceApi, "X1")).toBe(180);\n});`,
    ],
    solution: `it("застосовує знижку 10% для дорогих товарів", () => {\n  const priceApi = fn(() => 200);\n  expect(getDiscount(priceApi, "X1")).toBe(180);\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен тест."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nreturn {pass:true, message:"Мок із контрольованим результатом (fn(() => значення)) дозволяє протестувати логіку ІЗОЛЬОВАНО від реального джерела даних."};`,
  },
  {
    id: "testing-12",
    title: "Тестування асинхронного коду",
    type: "js",
    harness: harnessWith(`function fetchUserName(id) {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve(id === 1 ? "Оля" : "Невідомий"), 10);\n  });\n}`),
    theory:
      "Функція, що повертає Promise (наприклад, результат мережевого запиту), не може перевірятись синхронно — значення ще не готове в момент виклику. it() підтримує це напряму: якщо ФУНКЦІЯ ТЕСТУ сама async, і всередині є await, тест дочекається завершення перед тим, як вважати його пройденим чи провальним.\n\nСинтаксис: it(\"опис\", async () => { const result = await fetchUserName(1); expect(result).toBe(\"Оля\"); }) — той самий expect().toBe(), просто ПІСЛЯ await реального асинхронного виклику. Це ТОЧНО ТОЙ САМИЙ синтаксис, що й у реальному Jest/Vitest для асинхронних тестів.\n\nПоширена помилка новачків — забути async/await узагалі: it(\"...\", () => { const result = fetchUserName(1); expect(result).toBe(\"Оля\"); }) — тут result був би самим об'єктом Promise, а не рядком \"Оля\", і тест завжди провалювався б незалежно від реальної правильності функції.",
    examples: [
      { title: "Асинхронний тест", code: `it("повертає ім'я користувача за id", async () => {\n  const result = await fetchUserName(1);\n  expect(result).toBe("Оля");\n});`, explain: "async перед () => і await перед викликом — без обох тест перевірить сам об'єкт Promise, а не реальний результат." },
    ],
    task: "fetchUserName(id) уже визначена, повертає Promise. Напиши АСИНХРОННИЙ тест: fetchUserName(1) дозволяється (resolve) значенням \"Оля\".",
    starter: `it("повертає ім'я користувача за id", async () => {\n  // твій код тут: await + expect\n});\n`,
    hints: [
      "Функція тесту має бути async () => { ... }.",
      "const result = await fetchUserName(1); expect(result).toBe(\"Оля\");",
      `it("повертає ім'я користувача за id", async () => {\n  const result = await fetchUserName(1);\n  expect(result).toBe("Оля");\n});`,
    ],
    solution: `it("повертає ім'я користувача за id", async () => {\n  const result = await fetchUserName(1);\n  expect(result).toBe("Оля");\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен тест."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nreturn {pass:true, message:"async/await у тесті — той самий синтаксис, що й будь-де ще в JS; runner.flush() (за лаштунками) дочекався завершення перед перевіркою результату."};`,
  },
  {
    id: "testing-13",
    title: "Arrange-Act-Assert: структура тесту",
    type: "js",
    harness: harnessWith(`function applyCoupon(cart, coupon) {\n  if (coupon === "SAVE10") cart.total *= 0.9;\n  return cart;\n}`),
    theory:
      "Добре структурований тест зазвичай має ТРИ чіткі частини, навіть якщо це не позначено окремими коментарями: Arrange (підготувати вхідні дані), Act (виконати дію, яку тестуємо), Assert (перевірити результат). Змішування цих частин (наприклад, підготовка даних розкидана поміж кількома expect()) робить тест важче читати й розуміти при провалі.\n\nAAA — не спеціальна функція чи синтаксис React/Jest, а просто СТИЛЬ організації коду тесту: спершу все, що потрібно для сценарію (об'єкт кошика, купон), потім рівно одна дія (виклик applyCoupon), потім перевірка результату. Це полегшує читання тесту як «речення»: «маючи кошик на 100 і купон SAVE10, після застосування купона сума стає 90».\n\nОдин тест — зазвичай один Act (одна дія, що тестується), навіть якщо Assert-перевірок кілька. Тест, що виконує КІЛЬКА непов'язаних дій і потім перевіряє все відразу, важче діагностувати при провалі — незрозуміло, ЯКА САМЕ з дій зламалась.",
    examples: [
      { title: "AAA-структура", code: `it("застосовує купон SAVE10", () => {\n  // Arrange\n  const cart = { total: 100 };\n  const coupon = "SAVE10";\n\n  // Act\n  const result = applyCoupon(cart, coupon);\n\n  // Assert\n  expect(result.total).toBe(90);\n});`, explain: "Три чіткі блоки — навіть без коментарів досвідчене око бачить підготовку, дію і перевірку окремо." },
    ],
    task: "applyCoupon(cart, coupon) уже визначена. Напиши тест за AAA-структурою: cart = {total: 100}, застосуй купон \"SAVE10\", перевір result.total дорівнює 90.",
    starter: `it("застосовує купон SAVE10", () => {\n  // Arrange\n\n  // Act\n\n  // Assert\n});\n`,
    hints: [
      "Arrange: const cart = { total: 100 };",
      "Act: const result = applyCoupon(cart, \"SAVE10\"); Assert: expect(result.total).toBe(90);",
      `it("застосовує купон SAVE10", () => {\n  const cart = { total: 100 };\n  const coupon = "SAVE10";\n\n  const result = applyCoupon(cart, coupon);\n\n  expect(result.total).toBe(90);\n});`,
    ],
    solution: `it("застосовує купон SAVE10", () => {\n  const cart = { total: 100 };\n  const coupon = "SAVE10";\n\n  const result = applyCoupon(cart, coupon);\n\n  expect(result.total).toBe(90);\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен тест."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nreturn {pass:true, message:"Arrange-Act-Assert — стиль, що робить тест читабельним як речення: підготовка, дія, перевірка."};`,
  },
  {
    id: "testing-14",
    title: "TDD: спочатку тест, потім код",
    type: "js",
    harness: harnessWith(`function formatPrice(cents) {\n  return "₴" + (cents / 100).toFixed(2);\n}`),
    theory:
      "Test-Driven Development (TDD) — практика писати ТЕСТ ще ДО того, як написана сама функція. Цикл називається red-green-refactor: (1) red — пишеш тест на функцію, якої ще немає чи яка ще не працює правильно — тест ПРОВАЛюється (червоний); (2) green — пишеш МІНІМАЛЬНИЙ код, що робить тест зеленим; (3) refactor — покращуєш код, не змінюючи поведінку, доки всі тести лишаються зеленими.\n\nПеревага цього підходу: тест написаний ДО реалізації змушує чітко сформулювати, ЯКА САМЕ поведінка очікується, ще до того, як почалось написання коду — це часто виявляє неоднозначності в задачі раніше, ніж вони стали б багом. Крім того, TDD гарантує, що КОЖЕН рядок коду написаний ЗАРАДИ конкретного тесту, що його вимагає — не лишається «мертвого» коду, який ніхто не перевіряв.\n\nУ цьому уроці formatPrice(cents) вже написана правильно (щоб можна було перевірити тест) — але саме ЗАВДАННЯ в дусі TDD: спершу сформулювати тестом, ЩО ОЧІКУЄТЬСЯ (₴1.50 для 150 центів), а вже потім (у реальному TDD-циклі) писати чи виправляти реалізацію під цей тест.",
    examples: [
      { title: "Тест, що описує очікувану поведінку", code: `it("форматує ціну у гривнях з двома знаками", () => {\n  expect(formatPrice(150)).toBe("₴1.50");\n});\nit("форматує нуль", () => {\n  expect(formatPrice(0)).toBe("₴0.00");\n});`, explain: "У реальному TDD ці тести написані ПЕРШИМИ — і formatPrice тоді ще не існувала б, або існувала б неправильно; ваша мета — писати код, доки обидва тести не стануть зеленими." },
    ],
    task: "formatPrice(cents) уже визначена (переводить копійки у форматовану гривню). Напиши два тести: formatPrice(150) дорівнює \"₴1.50\", formatPrice(0) дорівнює \"₴0.00\".",
    starter: `it("форматує ціну у гривнях з двома знаками", () => {\n  // твій код тут\n});\nit("форматує нуль", () => {\n  // твій код тут\n});\n`,
    hints: [
      "expect(formatPrice(150)).toBe(\"₴1.50\");",
      "expect(formatPrice(0)).toBe(\"₴0.00\");",
      `it("форматує ціну у гривнях з двома знаками", () => {\n  expect(formatPrice(150)).toBe("₴1.50");\n});\nit("форматує нуль", () => {\n  expect(formatPrice(0)).toBe("₴0.00");\n});`,
    ],
    solution: `it("форматує ціну у гривнях з двома знаками", () => {\n  expect(formatPrice(150)).toBe("₴1.50");\n});\nit("форматує нуль", () => {\n  expect(formatPrice(0)).toBe("₴0.00");\n});`,
    testCode: `await runner.flush();\nif (runner.results.length < 2) return {pass:false, message:"Потрібні два тести."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nreturn {pass:true, message:"red-green-refactor: тест спершу описує ОЧІКУВАНУ поведінку, і лише потім пишеться чи виправляється код, що робить його зеленим."};`,
  },
  {
    id: "testing-15",
    title: "Тестування React-компонента",
    type: "react",
    harness: REACT_TEST_HARNESS_PREFIX + "\n" + MINI_TEST_SOURCE + "\nconst runner = createTestRunner();\nconst { it, test, describe, expect, beforeEach, afterEach, fn } = runner;\n",
    theory:
      "Усе, вивчене про тестування, застосовується й до React-компонентів — з однією відмінністю: замість виклику функції напряму компонент СПОЧАТКУ рендериться (render(<Component/>)), а вже потім перевіряється РЕЗУЛЬТАТ у DOM через querySelector, так само, як у самому курсі React.\n\nТиповий тест компонента: відрендерити його, знайти потрібний елемент, перевірити його текст чи стан, іноді — симулювати взаємодію (клік) і перевірити, що DOM ОНОВИВСЯ відповідно. Це поєднання двох курсів: expect().toBe() з тестування плюс querySelector/click із React.\n\nУ реальному проєкті для цього використовують React Testing Library (бібліотеку поверх Jest/Vitest, спеціалізовану саме на тестуванні React-компонентів, з зручнішими помічниками за сирий querySelector) — але базовий принцип «відрендерити → знайти елемент → перевірити» лишається той самий, який ти щойно застосувала напряму через DOM.",
    examples: [
      { title: "Тест компонента-лічильника", code: `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nit("починається з 0 і збільшується при кліку", async () => {\n  render(<Counter />);\n  await tick(0);\n  const p = document.querySelector("#root p");\n  expect(p.textContent).toBe("Рахунок: 0");\n\n  document.querySelector("#root button").click();\n  await tick(0);\n  expect(document.querySelector("#root p").textContent).toBe("Рахунок: 1");\n});`, explain: "render() + querySelector — той самий підхід, що й у курсі React, тепер обгорнутий у it()/expect() з курсу тестування." },
    ],
    task: "Створи компонент Counter() з useState(0) (як у прикладі) і напиши тест: після рендеру текст \"Рахунок: 0\", після кліку по кнопці — \"Рахунок: 1\".",
    starter: `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nit("починається з 0 і збільшується при кліку", async () => {\n  // твій код тут\n});\n`,
    hints: [
      "render(<Counter />); await tick(0); — так само, як у курсі React.",
      "Перевір текст ДО кліку і ПІСЛЯ document.querySelector('#root button').click() (з новим await tick(0) між ними).",
      `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nit("починається з 0 і збільшується при кліку", async () => {\n  render(<Counter />);\n  await tick(0);\n  const p = document.querySelector("#root p");\n  expect(p.textContent).toBe("Рахунок: 0");\n\n  document.querySelector("#root button").click();\n  await tick(0);\n  expect(document.querySelector("#root p").textContent).toBe("Рахунок: 1");\n});`,
    ],
    solution: `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nit("починається з 0 і збільшується при кліку", async () => {\n  render(<Counter />);\n  await tick(0);\n  const p = document.querySelector("#root p");\n  expect(p.textContent).toBe("Рахунок: 0");\n\n  document.querySelector("#root button").click();\n  await tick(0);\n  expect(document.querySelector("#root p").textContent).toBe("Рахунок: 1");\n});`,
    testCode: `await runner.flush();\nif (runner.results.length === 0) return {pass:false, message:"Потрібен тест через it()."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nreturn {pass:true, message:"Тестування React-компонента — render() + querySelector з курсу React, обгорнуті в it()/expect() з курсу тестування. Два курси, одна навичка."};`,
  },
  {
    id: "testing-16",
    title: "Фінальний проєкт: тестовий набір для модуля",
    type: "js",
    harness: harnessWith(`const validateEmail = spy(function validateEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n});\nconst calculateTotal = spy(function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price * item.qty, 0);\n});\nconst getInitials = spy(function getInitials(fullName) {\n  return fullName.trim().split(/\\s+/).map(w => w[0].toUpperCase()).join("");\n});`),
    theory:
      "Останній урок об'єднує все вивчене: три готові функції (validateEmail, calculateTotal, getInitials) — і задача написати ПОВНИЙ тестовий набір для них, використовуючи describe для групування, кілька it() на функцію (звичайний випадок + межовий випадок), toBe/toEqual/toBeFalsy залежно від типу результату.\n\nХороший тестовий набір для функції зазвичай покриває: (1) типовий «щасливий шлях» — звичайні коректні дані; (2) межові чи проблемні випадки — порожній вхід, некоректний формат, нуль. Саме ці три функції обрані навмисно: validateEmail — перевірка формату (правильний/неправильний email), calculateTotal — обчислення на масиві (звичайний список і порожній масив), getInitials — обробка тексту (звичайне ім'я).\n\nЦе завершує курс: 16 уроків від першого it()/expect() до тестування React-компонента й повного, самостійно написаного тестового набору для реального модуля — той самий набір навичок, який очікують у будь-якому серйозному JavaScript-проєкті.",
    examples: [],
    task: "Напиши тестовий набір (describe + кілька it()) для трьох функцій: validateEmail (валідний і невалідний email), calculateTotal (масив товарів і порожній масив), getInitials (звичайне ім'я).",
    starter: `describe("validateEmail", () => {\n  // тести тут\n});\n\ndescribe("calculateTotal", () => {\n  // тести тут\n});\n\ndescribe("getInitials", () => {\n  // тести тут\n});\n`,
    hints: [
      "validateEmail(\"a@b.com\") має бути toBeTruthy(), validateEmail(\"не email\") — toBeFalsy().",
      "calculateTotal([{price:10,qty:2},{price:5,qty:1}]) дорівнює 25 (toBe); calculateTotal([]) дорівнює 0. getInitials(\"Іван Петренко\") дорівнює \"ІП\" (toBe).",
      `describe("validateEmail", () => {\n  it("приймає коректний email", () => {\n    expect(validateEmail("a@b.com")).toBeTruthy();\n  });\n  it("відхиляє некоректний email", () => {\n    expect(validateEmail("не email")).toBeFalsy();\n  });\n});\n\ndescribe("calculateTotal", () => {\n  it("рахує суму товарів", () => {\n    expect(calculateTotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }])).toBe(25);\n  });\n  it("повертає 0 для порожнього списку", () => {\n    expect(calculateTotal([])).toBe(0);\n  });\n});\n\ndescribe("getInitials", () => {\n  it("бере перші літери імені й прізвища", () => {\n    expect(getInitials("Іван Петренко")).toBe("ІП");\n  });\n});`,
    ],
    solution: `describe("validateEmail", () => {\n  it("приймає коректний email", () => {\n    expect(validateEmail("a@b.com")).toBeTruthy();\n  });\n  it("відхиляє некоректний email", () => {\n    expect(validateEmail("не email")).toBeFalsy();\n  });\n});\n\ndescribe("calculateTotal", () => {\n  it("рахує суму товарів", () => {\n    expect(calculateTotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }])).toBe(25);\n  });\n  it("повертає 0 для порожнього списку", () => {\n    expect(calculateTotal([])).toBe(0);\n  });\n});\n\ndescribe("getInitials", () => {\n  it("бере перші літери імені й прізвища", () => {\n    expect(getInitials("Іван Петренко")).toBe("ІП");\n  });\n});`,
    testCode: `await runner.flush();\nif (runner.results.length < 5) return {pass:false, message:"Потрібно щонайменше 5 тестів (по кілька на кожну з трьох функцій)."};\nconst failed = runner.results.filter(r => !r.pass);\nif (failed.length > 0) return {pass:false, message:'Тест "' + failed[0].name + '" не пройшов: ' + failed[0].error};\nif (validateEmail.calls.length === 0 || calculateTotal.calls.length === 0 || getInitials.calls.length === 0) return {pass:false, message:"Тести мають реально викликати всі три функції: validateEmail, calculateTotal, getInitials."};\nreturn {pass:true, message:"Повний тестовий набір готовий — describe для групування, кілька it() на функцію, звичайні й межові випадки. Це базовий, але справжній workflow тестування в реальному проєкті."};`,
    finalProject: {
      techs: ["Jest / Vitest", "describe/it/expect", "Mock-функції"],
      skills: [
        "Матчери: toBe, toEqual, toBeTruthy/Falsy, toContain, toThrow",
        "beforeEach/afterEach для ізольованого стану",
        "Мок-функції (fn()) для перевірки викликів і підміни залежностей",
        "Асинхронне тестування (async/await у тесті)",
        "Arrange-Act-Assert і TDD (red-green-refactor)",
        "Тестування React-компонентів через рендер + DOM",
      ],
      structure: `my-project/\n├── src/\n│   └── utils.js\n├── src/\n│   └── utils.test.js\n├── package.json\n└── vitest.config.js`,
      code: `// src/utils.js
export function validateEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getInitials(fullName) {
  return fullName.trim().split(/\\s+/).map((w) => w[0].toUpperCase()).join("");
}

// src/utils.test.js
import { describe, it, expect } from "vitest";
import { validateEmail, calculateTotal, getInitials } from "./utils.js";

describe("validateEmail", () => {
  it("приймає коректний email", () => {
    expect(validateEmail("a@b.com")).toBe(true);
  });
  it("відхиляє некоректний email", () => {
    expect(validateEmail("не email")).toBe(false);
  });
});

describe("calculateTotal", () => {
  it("рахує суму товарів", () => {
    expect(calculateTotal([{ price: 10, qty: 2 }])).toBe(20);
  });
});`,
      runCommand: "npm create vite@latest my-project -- --template vanilla\ncd my-project && npm install -D vitest && npx vitest",
      installGuide: {
        intro: "Той самий тестовий синтаксис, який ти щойно писала, — це реальний, готовий до запуску Vitest-проєкт.",
        steps: [
          { title: "1. Встанови Vitest у будь-який проєкт", code: "npm install -D vitest" },
          { title: "2. Додай скрипт у package.json", code: `"scripts": { "test": "vitest" }` },
          { title: "3. Створи файл *.test.js поруч із кодом, що тестуєш", text: "Vitest автоматично знаходить усі файли з суфіксом .test.js чи .spec.js." },
          { title: "4. Запусти тести", code: "npm test", text: "Vitest покаже, скільки тестів пройшло, скільки провалилось, і точну причину кожного провалу." },
        ],
      },
      improvements: [
        "Додати тест на межові випадки: email без @, порожній масив товарів, ім'я з одним словом",
        "Налаштувати автоматичний запуск тестів при кожному коміті (той самий GitHub Actions workflow з курсу Full Stack)",
        "Виміряти покриття коду тестами (code coverage) через vitest --coverage",
        "Перейти на React Testing Library для зручнішого тестування компонентів замість сирого querySelector",
      ],
      nextLevel: "Наступний крок — застосувати тестування до власного pet-проєкту: перш ніж додавати нову функцію, спробуй написати тест на неї ЗАЗДАЛЕГІДЬ (TDD) і подивись, як це змінює сам процес розробки.",
    },
  },
];
