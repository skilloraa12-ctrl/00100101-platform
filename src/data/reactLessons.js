// React — like TypeScript, this course runs REAL code: learner JSX is
// transpiled by a self-hosted Babel Standalone (see runReactTranspile in
// App.jsx) into plain React.createElement() calls, which then execute
// inside the same sandboxed iframe every "js"-family lesson already uses
// (buildJsSandboxDoc), with a real self-hosted React + ReactDOM (dev UMD
// builds at /react/react.development.js and /react/react-dom.development.js)
// loaded as classic <script> tags before the compiled code runs.
//
// REACT_HARNESS is prepended (unparsed — it's plain JS, not JSX) before the
// learner's compiled code in every lesson: it destructures the hooks used
// across the course, and provides small test-only helpers (render, tick,
// typeInto) that mirror what a real project's own entry file (main.jsx)
// would set up once, so lessons can focus on the component itself — same
// reasoning as the mini-Express harness in the Backend course.
const REACT_HARNESS = `
const { useState, useEffect, useRef, useMemo, useCallback, useContext, createContext, useReducer, Fragment, Component } = React;

function render(element) {
  const rootEl = document.getElementById('root');
  if (!window.__reactRoot) window.__reactRoot = ReactDOM.createRoot(rootEl);
  window.__reactRoot.render(element);
}

function unmountRoot() {
  if (window.__reactRoot) { window.__reactRoot.unmount(); window.__reactRoot = null; }
}

// A real React-controlled <input> ignores el.value = ... directly (React
// tracks the previous value via its own property descriptor) — this is the
// standard way to simulate real typing from outside React.
function typeInto(el, value) {
  const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  setter.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

function submitForm(form) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

// useEffect callbacks run AFTER the current script finishes and the browser
// gets a chance to paint — tick() yields control back to the event loop so
// testCode can reliably check state an effect has set.
function tick(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 0));
}
`;

function harnessWith(seed) {
  return REACT_HARNESS + "\n" + (seed || "");
}

export const REACT_LESSONS = [
  {
    id: "react-intro",
    title: "Що це? — React",
    type: "intro",
    theory:
      "React — це не мова програмування і не фреймворк у повному сенсі, а бібліотека JavaScript для побудови інтерфейсів користувача (UI) із НЕЗАЛЕЖНИХ, повторно використовуваних шматочків — компонентів. Замість того щоб вручну шукати елементи на сторінці (document.querySelector) і змінювати їх (як у курсі JavaScript), у React ти ОПИСУЄШ, яким має виглядати інтерфейс ЗАЛЕЖНО ВІД поточних даних (стану) — а React сам вираховує, що саме змінилось на сторінці, і оновлює лише ці місця. Це називається декларативний підхід, на противагу імперативному (крок-за-кроком «зроби це, потім те»).\n\nJSX — синтаксис, що дозволяє писати розмітку, схожу на HTML, прямо всередині JavaScript-файлу: const el = <h1>Привіт</h1>. Це НЕ рядок і не окремий шаблонний мова — JSX компілюється (інструментом на кшталт Babel, який реально працює в цьому курсі) у звичайні виклики функції React.createElement(\"h1\", null, \"Привіт\"). Тобто JSX — це просто зручніший спосіб писати те, що й так можна написати функціями, без жодної магії під капотом.\n\nReact сьогодні — фактично галузевий стандарт: більшість вакансій frontend-розробника в світі й в Україні згадують React явно. Він лежить в основі Next.js, React Native (мобільні застосунки), і використовується в продуктах Meta, Netflix, Airbnb та тисячах інших компаній. Цей курс — 23 уроки, кожен з яких виконує РЕАЛЬНИЙ React і РЕАЛЬНИЙ компілятор Babel (не імітацію), завершуючи повноцінним Todo-застосунком, зібраним крок за кроком.",
    presentation: [
      { title: "React коротко", points: ["Бібліотека для побудови UI з незалежних компонентів", "Декларативний підхід: описуєш РЕЗУЛЬТАТ, а не кроки його досягнення", "JSX — розмітка в JS-файлі, що компілюється в React.createElement()"] },
      { title: "Навіщо це вчити", points: ["Галузевий стандарт frontend-розробки — основа більшості вакансій", "Тут код виконується РЕАЛЬНИМ React і РЕАЛЬНИМ Babel, не імітацією", "Курс завершується власним Todo-застосунком з нуля"] },
    ],
  },
  {
    id: "react-1",
    title: "JSX: перший елемент",
    type: "react",
    harness: harnessWith(),
    theory:
      "JSX виглядає як HTML, але це JavaScript-вираз: const el = <h1>Привіт, React!</h1>. Кожен JSX-тег компілюється в виклик React.createElement(тип, пропси, діти) — компілятор Babel робить це автоматично, тому у власному коді writeElement писати вручну не потрібно ніколи.\n\nЩоб JSX реально з'явився на сторінці, його потрібно передати в ReactDOM: у реальному проєкті це виглядає як ReactDOM.createRoot(document.getElementById('root')).render(<App/>) — рівно один раз, у головному файлі застосунку (main.jsx чи index.js). У цьому курсі цей рядок уже написаний за тебе всередині функції render() — просто виклич render(твій JSX), і React відмалює його в блок «Сторінка» під редактором.\n\nВажливе правило: JSX-вираз має повернути РІВНО ОДИН кореневий елемент. <h1>А</h1><p>Б</p> без спільної обгортки — синтаксична помилка; потрібно загорнути в один тег (<div>...</div>) — про легший спосіб обійти це без зайвого div (Fragment) дізнаєшся пізніше в курсі.",
    examples: [
      { title: "Перший JSX-елемент", code: `render(<h1>Привіт, React!</h1>);`, explain: "render() — це наш тестовий хелпер (у реальному проєкті так виглядає точно один рядок у main.jsx), що монтує JSX у #root." },
      { title: "Кілька елементів під однією обгорткою", code: `render(\n  <div>\n    <h1>Заголовок</h1>\n    <p>Опис під заголовком.</p>\n  </div>\n);`, explain: "div тут — єдиний кореневий елемент; h1 і p — його діти." },
    ],
    task: 'Створи JSX-елемент <h1>Привіт, React!</h1> і зроби його видимим на сторінці через render().',
    starter: `// твій код тут\n`,
    hints: [
      "render() приймає JSX-вираз як аргумент — так само, як звичайну функцію.",
      "Текст усередині тегу — просто текст, без лапок і без {}.",
      `render(<h1>Привіт, React!</h1>);`,
    ],
    solution: `render(<h1>Привіт, React!</h1>);`,
    testCode: `await tick(0);\nconst h1 = document.querySelector('#root h1');\nif (!h1) return {pass:false, message:"Потрібен елемент <h1> всередині #root."};\nif (!h1.textContent.includes('Привіт, React!')) return {pass:false, message:'Текст h1 має містити "Привіт, React!".'};\nreturn {pass:true, message:"render(<h1>...</h1>) — саме так React вперше з'являється на сторінці: JSX-вираз, переданий у ReactDOM."};`,
  },
  {
    id: "react-2",
    title: "Вирази й атрибути в JSX",
    type: "react",
    harness: harnessWith(),
    theory:
      "Усередині JSX фігурні дужки {} вставляють БУДЬ-ЯКИЙ JavaScript-вираз: змінну, результат обчислення, виклик функції. <p>Привіт, {name}!</p> підставить поточне значення змінної name. Усередині {} не можна писати ІНСТРУКЦІЇ (if, for) — лише вирази, що повертають значення (тому для умов пізніше використовують тернарний оператор чи &&, а не if прямо в JSX).\n\nАтрибути HTML-тегів у JSX пишуться в camelCase, а не kebab-case: onclick → onClick, tabindex → tabIndex. Найпомітніший виняток — class перейменований на className (бо class — зарезервоване слово в JavaScript). Значення атрибута теж можна передати через {}: <div className={someVariable}>.\n\nАтрибут style в React приймає НЕ рядок CSS, а JS-ОБ'ЄКТ, де кожна властивість теж у camelCase (background-color → backgroundColor): <p style={{ color: 'red', fontSize: '20px' }}>. Подвійні фігурні дужки тут — це {} JSX-вставки, всередині якої ЛІТЕРАЛ ОБ'ЄКТА {color: 'red', ...} — а не спеціальний синтаксис.",
    examples: [
      { title: "Підстановка змінної й обчислення", code: `const name = "Марія";\nrender(<p>Привіт, {name}! Тут {2 + 2} завдання.</p>);`, explain: "Обидва {} — звичайні JS-вирази: перший підставляє змінну, другий обчислює 2+2 прямо в розмітці." },
      { title: "style як об'єкт", code: `const boxStyle = { color: "blue", fontWeight: "bold" };\nrender(<p style={boxStyle}>Синій жирний текст</p>);`, explain: "style завжди об'єкт з camelCase-ключами, ніколи не рядок CSS." },
    ],
    task: 'Створи змінну name зі своїм ім\'ям і об\'єкт style з color: "blue". Виведи <p style={style}>Привіт, {name}!</p>.',
    starter: `const name = ...;\nconst style = ...;\n\n// render(<p style={style}>Привіт, {name}!</p>);\n`,
    hints: [
      "style — це об'єкт у фігурних дужках: { color: 'blue' }.",
      'const style = { color: "blue" };',
      `const name = "Марія";\nconst style = { color: "blue" };\n\nrender(<p style={style}>Привіт, {name}!</p>);`,
    ],
    solution: `const name = "Марія";\nconst style = { color: "blue" };\n\nrender(<p style={style}>Привіт, {name}!</p>);`,
    testCode: `await tick(0);\nconst p = document.querySelector('#root p');\nif (!p) return {pass:false, message:"Потрібен елемент <p> всередині #root."};\nif (!p.textContent.includes('Привіт,')) return {pass:false, message:'Текст має містити "Привіт, " і твоє ім\\'я.'};\nif (p.style.color !== 'blue') return {pass:false, message:"style.color має бути blue."};\nreturn {pass:true, message:"{} вставляє будь-який JS-вираз у розмітку, а style завжди приймає об'єкт з camelCase-ключами."};`,
  },
  {
    id: "react-3",
    title: "Компоненти: функції, що повертають JSX",
    type: "react",
    harness: harnessWith(),
    theory:
      "Компонент у React — це звичайна JavaScript-функція, що повертає JSX. Єдина умова: ім'я функції-компонента має починатись з ВЕЛИКОЇ літери (Greeting, не greeting) — це не стилістична порада, а вимога: саме з великої літери React відрізняє «це компонент» від «це звичайний HTML-тег» усередині JSX.\n\nВикористовують компонент так само, як HTML-тег, але з великою літерою: <Greeting />. React викликає функцію Greeting, бере JSX, який вона повернула, і вставляє його на місце <Greeting />. Це і є вся суть «компонентів» — шматок UI, обгорнутий у функцію, який можна використати скільки завгодно разів у різних місцях.\n\nДані передаються В компонент через пропси (props) — єдиний аргумент функції-компонента, об'єкт з усіма атрибутами, переданими при виклику: <Greeting name=\"Оля\" /> → функція Greeting отримує props = { name: \"Оля\" }, і всередині можна написати props.name. Пропси — це «вхідні параметри» компонента, доступні для читання, але їх НІКОЛИ не можна змінювати всередині самого компонента (детальніше про це — за кілька уроків, коли з'явиться стан).",
    examples: [
      { title: "Компонент з пропсом", code: `function Greeting(props) {\n  return <p>Привіт, {props.name}!</p>;\n}\n\nrender(<Greeting name="Оля" />);`, explain: "props.name отримує значення з атрибута name=\"Оля\", переданого при використанні компонента." },
      { title: "Один компонент, кілька викликів", code: `function Greeting(props) {\n  return <p>Привіт, {props.name}!</p>;\n}\nrender(\n  <div>\n    <Greeting name="Оля" />\n    <Greeting name="Богдан" />\n  </div>\n);`, explain: "Той самий Greeting використано двічі з різними пропсами — саме тому компоненти повторно використовувані." },
    ],
    task: "Створи компонент Greeting(props), що повертає <p>Привіт, {props.name}!</p>. Виклич його з name=\"Тарас\".",
    starter: `function Greeting(props) {\n  // твій код тут\n}\n\n// render(<Greeting name="Тарас" />);\n`,
    hints: [
      "Функція компонента повертає JSX через return.",
      "props.name містить значення, передане в атрибуті name.",
      `function Greeting(props) {\n  return <p>Привіт, {props.name}!</p>;\n}\n\nrender(<Greeting name="Тарас" />);`,
    ],
    solution: `function Greeting(props) {\n  return <p>Привіт, {props.name}!</p>;\n}\n\nrender(<Greeting name="Тарас" />);`,
    testCode: `await tick(0);\nconst p = document.querySelector('#root p');\nif (!p) return {pass:false, message:"Потрібен елемент <p>, повернутий компонентом Greeting."};\nif (!p.textContent.includes('Тарас')) return {pass:false, message:'Текст має містити "Тарас".'};\nreturn {pass:true, message:"Компонент — це функція, ім'я якої з великої літери, що приймає props і повертає JSX."};`,
  },
  {
    id: "react-4",
    title: "props.children",
    type: "react",
    harness: harnessWith(),
    theory:
      "Усе, що написано МІЖ відкриваючим і закриваючим тегом компонента, автоматично потрапляє в спеціальний проп props.children: <Card><p>Вміст</p></Card> — усередині Card доступний props.children, що дорівнює JSX-дереву <p>Вміст</p>. Це саме той механізм, через який HTML-подібні теги (<div>...</div>) взагалі можуть щось містити всередині.\n\nchildren дозволяє писати компоненти-«обгортки» — Card, Modal, Layout — які самі не знають, ЩО саме всередині них буде, а лише додають спільне оформлення (рамку, відступи, тінь) навколо будь-якого вмісту: function Card(props) { return <div className=\"card\">{props.children}</div>; }.\n\nchildren — це такий самий проп, як і будь-який інший (просто заповнюється по-іншому, автоматично), тому його можна комбінувати зі звичайними пропсами: <Card title=\"Заголовок\">{props.children}</Card>, і всередині компонента читати і props.title, і props.children окремо.",
    examples: [
      { title: "Card-обгортка", code: `function Card(props) {\n  return <div className="card">{props.children}</div>;\n}\n\nrender(\n  <Card>\n    <h2>Заголовок картки</h2>\n    <p>Опис картки.</p>\n  </Card>\n);`, explain: "Card не знає заздалегідь, що саме всередині — h2 і p потрапляють у props.children і рендеряться на їхньому місці." },
    ],
    task: "Створи компонент Card(props), що повертає <div className=\"card\">{props.children}</div>. Використай його з <p>Вміст картки</p> усередині.",
    starter: `function Card(props) {\n  // твій код тут\n}\n\n// render(<Card><p>Вміст картки</p></Card>);\n`,
    hints: [
      "props.children автоматично містить усе, що написано між <Card> і </Card>.",
      'return <div className="card">{props.children}</div>;',
      `function Card(props) {\n  return <div className="card">{props.children}</div>;\n}\n\nrender(<Card><p>Вміст картки</p></Card>);`,
    ],
    solution: `function Card(props) {\n  return <div className="card">{props.children}</div>;\n}\n\nrender(<Card><p>Вміст картки</p></Card>);`,
    testCode: `await tick(0);\nconst card = document.querySelector('#root .card');\nif (!card) return {pass:false, message:'Потрібен елемент з className="card".'};\nconst p = card.querySelector('p');\nif (!p || !p.textContent.includes('Вміст картки')) return {pass:false, message:"Усередині .card має бути <p>Вміст картки</p>, передане через children."};\nreturn {pass:true, message:"props.children — це все, що написано МІЖ тегами компонента; саме так працюють будь-які компоненти-обгортки."};`,
  },
  {
    id: "react-5",
    title: "useState: перший стан",
    type: "react",
    harness: harnessWith(),
    theory:
      "Пропси — дані, що приходять ЗЗОВНІ компонента й ніколи не змінюються самим компонентом. Але UI часто повинен пам'ятати ВЛАСНІ дані, що змінюються з часом (лічильник, текст у полі, чи відкрите меню) — для цього існує useState, перший хук цього курсу.\n\nconst [count, setCount] = useState(0) — useState повертає МАСИВ з рівно двох елементів: поточне значення (count) і функцію для його ЗМІНИ (setCount). 0 — початкове значення, встановлюється лише один раз, при першому рендері. Синтаксис [count, setCount] — це звичайна деструктуризація масиву з попередніх курсів, не щось особливе для React.\n\nГоловне правило: стан НІКОЛИ не змінюють напряму (count = count + 1 — так робити НЕ можна, React про це не дізнається). Зміна відбувається ЛИШЕ через функцію-сеттер: setCount(count + 1). Виклик сеттера каже React: «стан змінився, перерендери компонент» — React викликає функцію компонента ЗНОВУ, цього разу useState() поверне НОВЕ значення count, і JSX перемалюється з оновленим числом.",
    examples: [
      { title: "Лічильник", code: `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\nrender(<Counter />);`, explain: "Кожен клік викликає setCount(count + 1) — React перерендерює Counter із новим значенням count." },
    ],
    task: "Створи компонент Counter() з useState(0), що показує <p>Рахунок: {count}</p> і кнопку <button onClick={...}>+1</button>, яка збільшує count на 1.",
    starter: `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      {/* твоя кнопка тут */}\n    </div>\n  );\n}\n\n// render(<Counter />);\n`,
    hints: [
      "onClick приймає ФУНКЦІЮ: onClick={() => setCount(count + 1)}, а не виклик одразу onClick={setCount(count+1)}.",
      "setCount(count + 1) — саме так змінюють стан, ніколи напряму count = count + 1.",
      `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nrender(<Counter />);`,
    ],
    solution: `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nrender(<Counter />);`,
    testCode: `await tick(0);\nconst p = document.querySelector('#root p');\nconst btn = document.querySelector('#root button');\nif (!p || !p.textContent.includes('Рахунок: 0')) return {pass:false, message:'Спочатку має бути "Рахунок: 0".'};\nif (!btn) return {pass:false, message:"Потрібна кнопка +1."};\nbtn.click();\nawait tick(0);\nif (!document.querySelector('#root p').textContent.includes('Рахунок: 1')) return {pass:false, message:'Після кліку має бути "Рахунок: 1".'};\nreturn {pass:true, message:"useState повертає [значення, функція-сеттер] — зміна лише через сеттер, ніколи напряму."};`,
  },
  {
    id: "react-6",
    title: "Обробники подій із аргументами",
    type: "react",
    harness: harnessWith(),
    theory:
      "onClick={handleClick} викликає handleClick БЕЗ аргументів при кліку — React сам передає туди об'єкт події, якщо функція його очікує. Але часто потрібно передати ВЛАСНИЙ аргумент (наприклад, id елемента, по якому клікнули) — для цього onClick обгортають у стрілочну функцію: onClick={() => handleClick(id)}. Обгортка потрібна саме тому, що onClick={handleClick(id)} (БЕЗ стрілки) викликав би handleClick ОДРАЗУ під час рендеру, а не при кліку — це одна з найпоширеніших помилок новачків.\n\nЦей патерн особливо важливий усередині списків, де кожен елемент має власний обробник із власним ідентифікатором: items.map(item => <button onClick={() => select(item.id)}>{item.title}</button>) — кожна кнопка «пам'ятає» СВІЙ item.id завдяки замиканню (closure) стрілочної функції.",
    examples: [
      { title: "Передача аргументу в обробник", code: `function FruitPicker() {\n  function handlePick(fruit) {\n    console.log("Обрано:", fruit);\n  }\n  return (\n    <div>\n      <button onClick={() => handlePick("Яблуко")}>Яблуко</button>\n      <button onClick={() => handlePick("Банан")}>Банан</button>\n    </div>\n  );\n}\nrender(<FruitPicker />);`, explain: "Стрілочна функція () => handlePick(\"Банан\") відкладає виклик до моменту кліку — без неї handlePick викликався б одразу при рендері." },
    ],
    task: 'Створи компонент FruitPicker() із двома кнопками "Яблуко" і "Банан". При кліку кожна викликає handlePick(fruit), що робить console.log("Обрано:", fruit).',
    starter: `function FruitPicker() {\n  function handlePick(fruit) {\n    console.log("Обрано:", fruit);\n  }\n  return (\n    <div>\n      {/* дві кнопки тут */}\n    </div>\n  );\n}\n\n// render(<FruitPicker />);\n`,
    hints: [
      'Кожна кнопка: onClick={() => handlePick("Яблуко")} і onClick={() => handlePick("Банан")}.',
      "Без стрілочної функції handlePick викликався б одразу при рендері, а не при кліку.",
      `function FruitPicker() {\n  function handlePick(fruit) {\n    console.log("Обрано:", fruit);\n  }\n  return (\n    <div>\n      <button onClick={() => handlePick("Яблуко")}>Яблуко</button>\n      <button onClick={() => handlePick("Банан")}>Банан</button>\n    </div>\n  );\n}\n\nrender(<FruitPicker />);`,
    ],
    solution: `function FruitPicker() {\n  function handlePick(fruit) {\n    console.log("Обрано:", fruit);\n  }\n  return (\n    <div>\n      <button onClick={() => handlePick("Яблуко")}>Яблуко</button>\n      <button onClick={() => handlePick("Банан")}>Банан</button>\n    </div>\n  );\n}\n\nrender(<FruitPicker />);`,
    testCode: `await tick(0);\nconst btns = document.querySelectorAll('#root button');\nif (btns.length < 2) return {pass:false, message:"Потрібні дві кнопки."};\nbtns[1].click();\nawait tick(0);\nif (!__logs.some(l => l.includes('Банан'))) return {pass:false, message:'Клік по другій кнопці має вивести в консоль щось із "Банан".'};\nreturn {pass:true, message:"Стрілочна обгортка () => handlePick(fruit) — стандартний спосіб передати власний аргумент в обробник події."};`,
  },
  {
    id: "react-7",
    title: "Контрольований input",
    type: "react",
    harness: harnessWith(),
    theory:
      "«Контрольований» input — це поле вводу, значення якого повністю визначається React-станом, а не власною внутрішньою пам'яттю браузера: <input value={text} onChange={e => setText(e.target.value)} />. Атрибут value ЗАВЖДИ показує поточне значення зі стану; кожне натискання клавіші викликає onChange, який ОНОВЛЮЄ стан новим значенням (e.target.value — те, що зараз у полі) — і React перерендерює input із цим новим value.\n\nЦе означає: React (а не DOM) є «єдиним джерелом правди» для того, що в полі — у будь-який момент можна прочитати text у коді компонента (наприклад, для валідації чи відправки форми), не звертаючись до DOM напряму (document.querySelector), як довелось би в звичайному JS.\n\nЯкщо передати value без onChange, React покаже попередження й поле стане «read-only» (не даватиме вводити текст) — value й onChange у контрольованого input йдуть завжди РАЗОМ.",
    examples: [
      { title: "Контрольоване поле", code: `function NameField() {\n  const [text, setText] = useState("");\n  return (\n    <div>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <p>Введено: {text}</p>\n    </div>\n  );\n}\nrender(<NameField />);`, explain: "e.target.value — поточний текст у полі в момент події onChange; він і стає новим значенням стану." },
    ],
    task: "Створи компонент NameField() з useState(''), контрольованим <input> і <p>Введено: {text}</p>, що показує поточний текст.",
    starter: `function NameField() {\n  const [text, setText] = useState("");\n  return (\n    <div>\n      {/* input і p тут */}\n    </div>\n  );\n}\n\n// render(<NameField />);\n`,
    hints: [
      "input має мати і value={text}, і onChange={e => setText(e.target.value)} одночасно.",
      "e.target.value — це рядок, який зараз у полі вводу.",
      `function NameField() {\n  const [text, setText] = useState("");\n  return (\n    <div>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <p>Введено: {text}</p>\n    </div>\n  );\n}\n\nrender(<NameField />);`,
    ],
    solution: `function NameField() {\n  const [text, setText] = useState("");\n  return (\n    <div>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <p>Введено: {text}</p>\n    </div>\n  );\n}\n\nrender(<NameField />);`,
    testCode: `await tick(0);\nconst input = document.querySelector('#root input');\nif (!input) return {pass:false, message:"Потрібен елемент <input>."};\ntypeInto(input, "Привіт");\nawait tick(0);\nconst p = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Введено: Привіт')) return {pass:false, message:'Після вводу тексту p має показувати "Введено: Привіт".'};\nreturn {pass:true, message:"value + onChange разом роблять React (а не DOM) джерелом правди для вмісту поля — саме так пишуть форми в реальних проєктах."};`,
  },
  {
    id: "react-8",
    title: "Умовний рендеринг",
    type: "react",
    harness: harnessWith(),
    theory:
      "Усередині JSX не можна написати if напряму (JSX приймає лише вирази, не інструкції), тому умовний вивід роблять через тернарний оператор: {loggedIn ? <p>Вітаємо!</p> : <p>Увійдіть.</p>} — якщо loggedIn істинне, рендериться перший варіант, інакше другий.\n\nКоли другого варіанту НЕМАЄ взагалі (нічого не показувати, якщо умова хибна), зручніший оператор && : {hasError && <p className=\"error\">Помилка!</p>} — якщо hasError хибне, вираз одразу повертає false, а React просто НІЧОГО не рендерить замість false (React ігнорує false, null, undefined у JSX). Якщо hasError істинне — рендериться <p>.\n\nОбидва підходи — це не спеціальний синтаксис React, а звичайні JS-оператори, що повертають ЗНАЧЕННЯ (JSX-елемент або false/null), яке потім опиняється всередині {} — той самий принцип, що й підстановка звичайної змінної з другого уроку.",
    examples: [
      { title: "Тернарний оператор", code: `function Status({ loggedIn }) {\n  return loggedIn ? <p>Вітаємо!</p> : <p>Увійдіть.</p>;\n}`, explain: "Рівно один з двох варіантів рендериться залежно від значення loggedIn." },
      { title: "&& для «показати або нічого»", code: `function Alert({ hasError }) {\n  return <div>{hasError && <p className="error">Помилка!</p>}</div>;\n}`, explain: "Якщо hasError хибне, && повертає false — React не рендерить нічого замість <p>." },
    ],
    task: "Створи компонент App() з useState(false) як loggedIn. Покажи <p>Вітаємо, користувачу!</p> якщо true, або <p>Будь ласка, увійдіть.</p> якщо false (тернарний оператор), і кнопку, що перемикає loggedIn.",
    starter: `function App() {\n  const [loggedIn, setLoggedIn] = useState(false);\n  return (\n    <div>\n      {/* тернарний оператор тут */}\n      <button onClick={() => setLoggedIn(!loggedIn)}>Увійти/Вийти</button>\n    </div>\n  );\n}\n\n// render(<App />);\n`,
    hints: [
      "{loggedIn ? <p>...</p> : <p>...</p>} — рівно один варіант рендериться.",
      "setLoggedIn(!loggedIn) — перемикає булеве значення на протилежне.",
      `function App() {\n  const [loggedIn, setLoggedIn] = useState(false);\n  return (\n    <div>\n      {loggedIn ? <p>Вітаємо, користувачу!</p> : <p>Будь ласка, увійдіть.</p>}\n      <button onClick={() => setLoggedIn(!loggedIn)}>Увійти/Вийти</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    ],
    solution: `function App() {\n  const [loggedIn, setLoggedIn] = useState(false);\n  return (\n    <div>\n      {loggedIn ? <p>Вітаємо, користувачу!</p> : <p>Будь ласка, увійдіть.</p>}\n      <button onClick={() => setLoggedIn(!loggedIn)}>Увійти/Вийти</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    testCode: `await tick(0);\nlet p = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Будь ласка, увійдіть')) return {pass:false, message:'Спочатку має бути "Будь ласка, увійдіть."'};\nconst btn = document.querySelector('#root button');\nbtn.click();\nawait tick(0);\np = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Вітаємо, користувачу')) return {pass:false, message:'Після кліку має бути "Вітаємо, користувачу!"'};\nreturn {pass:true, message:"Тернарний оператор всередині {} — стандартний спосіб показати ОДИН із двох варіантів залежно від стану."};`,
  },
  {
    id: "react-9",
    title: "Списки та key",
    type: "react",
    harness: harnessWith(),
    theory:
      "Щоб відрендерити масив даних як список JSX-елементів, використовують звичайний Array.prototype.map: {fruits.map(f => <li>{f}</li>)} — map повертає НОВИЙ масив JSX-елементів, і React рендерить кожен елемент цього масиву по черзі.\n\nКОЖЕН елемент списку МАЄ отримати спеціальний проп key — унікальний рядок чи число серед сусідніх елементів: {fruits.map(f => <li key={f}>{f}</li>)}. key НЕ з'являється в DOM і не видно на сторінці — це внутрішня «мітка» для React, яка дозволяє точно відстежити, який саме елемент масиву відповідає якому DOM-вузлу між рендерами (наприклад, коли елемент видаляють із середини списку — без key React міг би переплутати, який рядок видалити, і некоректно оновити DOM).\n\nІндекс масиву (fruits.map((f, i) => <li key={i}>)) працює як key, але вважається поганою практикою, якщо список може змінювати ПОРЯДОК чи мати елементи ВИДАЛЕНІ/ДОДАНІ не в кінці — краще використовувати стабільний унікальний ідентифікатор із самих даних (id, назва, якщо вона унікальна).",
    examples: [
      { title: "Список з key", code: `function FruitList() {\n  const fruits = ["Яблуко", "Банан", "Вишня"];\n  return (\n    <ul>\n      {fruits.map(f => <li key={f}>{f}</li>)}\n    </ul>\n  );\n}\nrender(<FruitList />);`, explain: "key={f} тут годиться, бо назви фруктів у цьому масиві унікальні між собою." },
    ],
    task: 'Створи компонент FruitList() з масивом ["Яблуко", "Банан", "Вишня"] і виведи їх як <ul><li key={f}>{f}</li></ul> через map.',
    starter: `function FruitList() {\n  const fruits = ["Яблуко", "Банан", "Вишня"];\n  return (\n    <ul>\n      {/* map тут */}\n    </ul>\n  );\n}\n\n// render(<FruitList />);\n`,
    hints: [
      "fruits.map(f => <li key={f}>{f}</li>) повертає масив із трьох <li>.",
      "key має бути на САМОМУ <li>, не на батьківському <ul>.",
      `function FruitList() {\n  const fruits = ["Яблуко", "Банан", "Вишня"];\n  return (\n    <ul>\n      {fruits.map(f => <li key={f}>{f}</li>)}\n    </ul>\n  );\n}\n\nrender(<FruitList />);`,
    ],
    solution: `function FruitList() {\n  const fruits = ["Яблуко", "Банан", "Вишня"];\n  return (\n    <ul>\n      {fruits.map(f => <li key={f}>{f}</li>)}\n    </ul>\n  );\n}\n\nrender(<FruitList />);`,
    testCode: `await tick(0);\nconst items = document.querySelectorAll('#root li');\nif (items.length !== 3) return {pass:false, message:"Має бути рівно три <li>."};\nconst texts = Array.from(items).map(li => li.textContent);\nif (!texts.includes('Яблуко') || !texts.includes('Банан') || !texts.includes('Вишня')) return {pass:false, message:"Список має містити Яблуко, Банан і Вишню."};\nreturn {pass:true, message:"map() перетворює масив даних на масив JSX-елементів; key на кожному <li> допомагає React відстежувати їх між рендерами."};`,
  },
  {
    id: "react-10",
    title: "Форми: onSubmit і preventDefault",
    type: "react",
    harness: harnessWith(),
    theory:
      "Звичайний HTML <form> при натисканні кнопки типу submit чи Enter в полі намагається ПЕРЕЗАВАНТАЖИТИ сторінку (відправити дані на сервер за замовчуванням) — у React-застосунку це майже завжди небажано, дані обробляють через JavaScript, без перезавантаження. Тому обробник onSubmit форми першим рядком практично завжди викликає e.preventDefault(): function handleSubmit(e) { e.preventDefault(); ... } — це скасовує стандартну поведінку браузера.\n\nПоєднання контрольованого input (урок 7) із формою — типовий патерн «додати елемент у список»: onSubmit зчитує поточне значення стану (не DOM!), додає новий елемент у масив через setItems([...items, newItem]), і очищає поле через setText(\"\"). Саме цей патерн лежить в основі фінального проєкту цього курсу.\n\nКнопка <button type=\"submit\"> всередині <form> автоматично викликає onSubmit форми при кліку чи Enter — окремий onClick на самій кнопці для цього не потрібен.",
    examples: [
      { title: "Форма з preventDefault", code: `function QuickForm() {\n  const [text, setText] = useState("");\n  const [items, setItems] = useState([]);\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    if (!text.trim()) return;\n    setItems([...items, text]);\n    setText("");\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <button type="submit">Додати</button>\n      <ul>{items.map(it => <li key={it}>{it}</li>)}</ul>\n    </form>\n  );\n}\nrender(<QuickForm />);`, explain: "e.preventDefault() зупиняє перезавантаження сторінки; далі — звичайна робота зі станом." },
    ],
    task: 'Створи компонент QuickForm() за зразком із прикладу: контрольований input, форма з onSubmit (preventDefault, додає текст у items, очищає text), список items.',
    starter: `function QuickForm() {\n  const [text, setText] = useState("");\n  const [items, setItems] = useState([]);\n\n  function handleSubmit(e) {\n    // твій код тут\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <button type="submit">Додати</button>\n      <ul>{items.map(it => <li key={it}>{it}</li>)}</ul>\n    </form>\n  );\n}\n\n// render(<QuickForm />);\n`,
    hints: [
      "Перший рядок handleSubmit завжди e.preventDefault().",
      "setItems([...items, text]); setText(''); — додати й очистити.",
      `function QuickForm() {\n  const [text, setText] = useState("");\n  const [items, setItems] = useState([]);\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    if (!text.trim()) return;\n    setItems([...items, text]);\n    setText("");\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <button type="submit">Додати</button>\n      <ul>{items.map(it => <li key={it}>{it}</li>)}</ul>\n    </form>\n  );\n}\n\nrender(<QuickForm />);`,
    ],
    solution: `function QuickForm() {\n  const [text, setText] = useState("");\n  const [items, setItems] = useState([]);\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    if (!text.trim()) return;\n    setItems([...items, text]);\n    setText("");\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <button type="submit">Додати</button>\n      <ul>{items.map(it => <li key={it}>{it}</li>)}</ul>\n    </form>\n  );\n}\n\nrender(<QuickForm />);`,
    testCode: `await tick(0);\nconst input = document.querySelector('#root input');\nconst form = document.querySelector('#root form');\nif (!input || !form) return {pass:false, message:"Потрібні <form> і <input> всередині нього."};\ntypeInto(input, "Молоко");\nsubmitForm(form);\nawait tick(0);\nconst items = document.querySelectorAll('#root li');\nif (items.length !== 1 || !items[0].textContent.includes('Молоко')) return {pass:false, message:'Після сабміту список має містити один пункт "Молоко".'};\nif (document.querySelector('#root input').value !== '') return {pass:false, message:"Після сабміту поле input має очиститись."};\nreturn {pass:true, message:"preventDefault() зупиняє перезавантаження сторінки; далі форма — звичайна робота зі станом, як і будь-де ще."};`,
  },
  {
    id: "react-11",
    title: "Підняття стану (lifting state up)",
    type: "react",
    harness: harnessWith(),
    theory:
      "Якщо ДВОМ різним компонентам потрібен доступ до ОДНОГО й того самого стану (наприклад, один показує число, інший — кнопки його зміни), стан не можна тримати в кожному окремо (вони «розсинхронізуються») — його піднімають у НАЙБЛИЖЧОГО спільного предка, а дочірнім компонентам передають значення й функцію-зміни через пропси. Це називається lifting state up («підняття стану вгору»).\n\nБатьківський компонент володіє useState; дочірні компоненти НІЧОГО не знають про useState — вони лише отримують value і onChange-подібні функції як звичайні пропси: <Display value={count} /> <Controls onIncrement={() => setCount(count + 1)} />. Дочірній компонент викликає отриману функцію, і оскільки це та сама функція-сеттер з батька — зміна стану в батьківському компоненті призводить до ПЕРЕРЕНДЕРУ обох дітей з новими пропсами.\n\nЦе ключовий патерн у React: дані «течуть» ВНИЗ через пропси, а події «спливають» ВГОРУ через функції, передані як пропси, — ніколи навпаки. Немає прямого способу дочірньому компоненту «дотягнутись» до стану батька, окрім як через передану функцію.",
    examples: [
      { title: "Спільний стан у двох дітях", code: `function Display({ count }) {\n  return <p>Рахунок: {count}</p>;\n}\nfunction Controls({ onIncrement }) {\n  return <button onClick={onIncrement}>+1</button>;\n}\nfunction App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <Display count={count} />\n      <Controls onIncrement={() => setCount(count + 1)} />\n    </div>\n  );\n}\nrender(<App />);`, explain: "Обидва компоненти НЕ мають власного useState — count живе лише в App, і саме тому Display завжди бачить актуальне значення." },
    ],
    task: "Створи App() зі станом count, компонент Display({count}), що показує <p>Рахунок: {count}</p>, і компонент Controls({onIncrement}) з кнопкою +1. З'єднай їх, як у прикладі.",
    starter: `function Display({ count }) {\n  // твій код тут\n}\nfunction Controls({ onIncrement }) {\n  // твій код тут\n}\nfunction App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      {/* Display і Controls тут */}\n    </div>\n  );\n}\n\n// render(<App />);\n`,
    hints: [
      "Display і Controls отримують дані ЛИШЕ через пропси — жодного власного useState у них.",
      "Controls викликає передану функцію onIncrement, а не власну логіку зміни стану.",
      `function Display({ count }) {\n  return <p>Рахунок: {count}</p>;\n}\nfunction Controls({ onIncrement }) {\n  return <button onClick={onIncrement}>+1</button>;\n}\nfunction App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <Display count={count} />\n      <Controls onIncrement={() => setCount(count + 1)} />\n    </div>\n  );\n}\n\nrender(<App />);`,
    ],
    solution: `function Display({ count }) {\n  return <p>Рахунок: {count}</p>;\n}\nfunction Controls({ onIncrement }) {\n  return <button onClick={onIncrement}>+1</button>;\n}\nfunction App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <Display count={count} />\n      <Controls onIncrement={() => setCount(count + 1)} />\n    </div>\n  );\n}\n\nrender(<App />);`,
    testCode: `await tick(0);\nlet p = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Рахунок: 0')) return {pass:false, message:'Спочатку має бути "Рахунок: 0".'};\nconst btn = document.querySelector('#root button');\nbtn.click();\nawait tick(0);\np = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Рахунок: 1')) return {pass:false, message:'Після кліку в Controls, Display має показати "Рахунок: 1".'};\nreturn {pass:true, message:"Стан живе в СПІЛЬНОМУ предку (App); Display і Controls отримують усе через пропси — це і є lifting state up."};`,
  },
  {
    id: "react-12",
    title: "useEffect: код при монтуванні",
    type: "react",
    harness: harnessWith(),
    theory:
      "Іноді компоненту потрібно виконати «побічну дію» (side effect), не пов'язану напряму з рендерингом JSX: завантажити дані з сервера, підписатись на подію, встановити таймер. Для цього існує useEffect(callback, deps) — callback виконається ПІСЛЯ того, як React відрендерив компонент і браузер встиг оновити екран (а не під час самого рендеру).\n\nДругий аргумент — масив залежностей (deps). Порожній масив [] означає «виконати callback РІВНО ОДИН РАЗ, одразу після першого рендеру (монтування), і більше ніколи» — типовий випадок для одноразового завантаження даних при відкритті компонента.\n\nВажливо: useEffect(() => { ... }, []) виконується АСИНХРОННО відносно основного коду — рядок одразу ПІСЛЯ render(<App/>) ще НЕ побачить результату ефекту, бо React ще не встиг його запустити. У тестах цього курсу для цього є хелпер tick() — await tick(50) дає React час виконати ефект перед перевіркою.",
    examples: [
      { title: "Ефект при монтуванні", code: `function App() {\n  const [loaded, setLoaded] = useState(false);\n\n  useEffect(() => {\n    setLoaded(true);\n  }, []);\n\n  return <p>{loaded ? "Завантажено" : "Завантаження..."}</p>;\n}\nrender(<App />);`, explain: "Порожній масив [] означає «один раз, при монтуванні». Одразу після рендеру ще видно «Завантаження...», і лише після ефекту — «Завантажено»." },
    ],
    task: 'Створи App() зі станом loaded (false) і useEffect(..., []), що встановлює loaded в true. Покажи "Завантаження..." або "Завантажено" залежно від loaded.',
    starter: `function App() {\n  const [loaded, setLoaded] = useState(false);\n\n  useEffect(() => {\n    // твій код тут\n  }, []);\n\n  return <p>{loaded ? "Завантажено" : "Завантаження..."}</p>;\n}\n\n// render(<App />);\n`,
    hints: [
      "Усередині useEffect виклич setLoaded(true).",
      "Порожній масив [] — другий аргумент useEffect — означає «один раз, при монтуванні».",
      `function App() {\n  const [loaded, setLoaded] = useState(false);\n\n  useEffect(() => {\n    setLoaded(true);\n  }, []);\n\n  return <p>{loaded ? "Завантажено" : "Завантаження..."}</p>;\n}\n\nrender(<App />);`,
    ],
    solution: `function App() {\n  const [loaded, setLoaded] = useState(false);\n\n  useEffect(() => {\n    setLoaded(true);\n  }, []);\n\n  return <p>{loaded ? "Завантажено" : "Завантаження..."}</p>;\n}\n\nrender(<App />);`,
    testCode: `await tick(50);\nconst p = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Завантажено')) return {pass:false, message:'Після useEffect текст має стати "Завантажено".'};\nreturn {pass:true, message:"useEffect(fn, []) виконує fn РІВНО ОДИН РАЗ після першого рендеру — типовий патерн для одноразової ініціалізації."};`,
  },
  {
    id: "react-13",
    title: "useEffect: масив залежностей",
    type: "react",
    harness: harnessWith(),
    theory:
      "Якщо в масиві залежностей useEffect(callback, [value]) вказано конкретні змінні, callback виконується не лише при першому рендері, а й КОЖНОГО РАЗУ, коли будь-яке значення в цьому масиві ЗМІНИЛОСЯ порівняно з попереднім рендером. Це дозволяє реагувати саме на ЗМІНУ конкретних даних, а не на будь-який рендер компонента взагалі.\n\nБез масиву залежностей ВЗАГАЛІ (useEffect(callback) без другого аргументу) callback виконувався б ПІСЛЯ КОЖНОГО рендеру — це рідко потрібно і легко призводить до нескінченних циклів, якщо ефект сам змінює стан, від якого залежить. Масив залежностей — це спосіб точно сказати React, ВІД ЧОГО саме залежить ефект.\n\nПравило, яке варто запам'ятати: до масиву залежностей включають КОЖНЕ значення зі стану чи пропсів, яке використовується всередині callback. Якщо цього не зробити, ефект «бачитиме» застаріле значення зі старого рендеру (це поширена помилка, яку статичний аналізатор ESLint зазвичай ловить у реальних проєктах).",
    examples: [
      { title: "Ефект залежить від count", code: `function App() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    window.__effectRuns = (window.__effectRuns || 0) + 1;\n  }, [count]);\n\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\nrender(<App />);`, explain: "Ефект виконується і при монтуванні (перший раз), і кожного разу, коли count змінюється — але НЕ при рендерах, де count лишився тим самим." },
    ],
    task: "Створи App() за зразком із прикладу: стан count, кнопка +1, useEffect([count]) що збільшує window.__effectRuns.",
    starter: `function App() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    // твій код тут\n  }, [count]);\n\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\n// render(<App />);\n`,
    hints: [
      "window.__effectRuns = (window.__effectRuns || 0) + 1; — так рахують кількість запусків ефекту в тестах.",
      "[count] у другому аргументі useEffect змушує ефект перезапускатись при кожній зміні count.",
      `function App() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    window.__effectRuns = (window.__effectRuns || 0) + 1;\n  }, [count]);\n\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    ],
    solution: `function App() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    window.__effectRuns = (window.__effectRuns || 0) + 1;\n  }, [count]);\n\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    testCode: `window.__effectRuns = 0;\nawait tick(50);\nif (window.__effectRuns !== 1) return {pass:false, message:"Після монтування ефект має запуститись рівно один раз (зараз: " + window.__effectRuns + ")."};\nconst btn = document.querySelector('#root button');\nbtn.click();\nawait tick(50);\nif (window.__effectRuns !== 2) return {pass:false, message:"Після зміни count ефект має запуститись ще раз, разом двічі (зараз: " + window.__effectRuns + ")."};\nreturn {pass:true, message:"[count] у другому аргументі означає: перезапускати ефект лише коли count справді змінився."};`,
  },
  {
    id: "react-14",
    title: "useEffect: функція очищення (cleanup)",
    type: "react",
    harness: harnessWith(),
    theory:
      "Якщо ефект щось ПІДКЛЮЧАЄ (таймер, підписку на подію, з'єднання) — його потрібно й ВІДКЛЮЧИТИ, коли компонент більше не потрібен (розмонтовується) чи перед наступним запуском того самого ефекту. Для цього callback, переданий у useEffect, може ПОВЕРНУТИ функцію очищення: useEffect(() => { /* підключити */ return () => { /* відключити */ }; }, []).\n\nФункція очищення викликається React автоматично у двох випадках: (1) прямо ПЕРЕД тим, як ефект запуститься ЗНОВУ (якщо залежності змінились), і (2) коли компонент РОЗМОНТОВУЄТЬСЯ (зникає зі сторінки повністю). Без очищення таймери й підписки продовжували б працювати навіть після того, як компонент зник — це називається «витік пам'яті» (memory leak) і є поширеною помилкою в реальних проєктах.\n\nТиповий приклад — setInterval: useEffect(() => { const id = setInterval(tick, 1000); return () => clearInterval(id); }, []) — таймер запускається при монтуванні й ГАРАНТОВАНО зупиняється при розмонтуванні, а не продовжує «цокати» в порожнечу.",
    examples: [
      { title: "Очищення при розмонтуванні", code: `function App() {\n  useEffect(() => {\n    window.__mounted = true;\n    return () => {\n      window.__cleanedUp = true;\n    };\n  }, []);\n  return <p>Компонент активний</p>;\n}\nrender(<App />);\n// пізніше: unmountRoot() викличе функцію очищення`, explain: "Функція, повернута з useEffect, — це і є cleanup; React викликає її сам при розмонтуванні компонента." },
    ],
    task: "Створи App() за зразком: useEffect встановлює window.__mounted = true і повертає функцію очищення, що встановлює window.__cleanedUp = true.",
    starter: `function App() {\n  useEffect(() => {\n    // встанови window.__mounted = true\n    return () => {\n      // встанови window.__cleanedUp = true\n    };\n  }, []);\n  return <p>Компонент активний</p>;\n}\n\n// render(<App />);\n`,
    hints: [
      "useEffect(() => { window.__mounted = true; return () => { window.__cleanedUp = true; }; }, [])",
      "Функція очищення — це те, що callback useEffect ПОВЕРТАЄ через return.",
      `function App() {\n  useEffect(() => {\n    window.__mounted = true;\n    return () => {\n      window.__cleanedUp = true;\n    };\n  }, []);\n  return <p>Компонент активний</p>;\n}\n\nrender(<App />);`,
    ],
    solution: `function App() {\n  useEffect(() => {\n    window.__mounted = true;\n    return () => {\n      window.__cleanedUp = true;\n    };\n  }, []);\n  return <p>Компонент активний</p>;\n}\n\nrender(<App />);`,
    testCode: `window.__mounted = false;\nwindow.__cleanedUp = false;\nawait tick(50);\nif (!window.__mounted) return {pass:false, message:"Після монтування window.__mounted має стати true."};\nif (window.__cleanedUp) return {pass:false, message:"Функція очищення ще НЕ мала викликатись — компонент ще змонтований."};\nunmountRoot();\nawait tick(50);\nif (!window.__cleanedUp) return {pass:false, message:"Після unmountRoot() функція очищення має встановити window.__cleanedUp = true."};\nreturn {pass:true, message:"Функція, повернута з useEffect, — cleanup; React викликає її автоматично при розмонтуванні компонента."};`,
  },
  {
    id: "react-15",
    title: "useRef: доступ до DOM-елемента",
    type: "react",
    harness: harnessWith(),
    theory:
      "useRef(initialValue) повертає об'єкт { current: initialValue }, що ЗБЕРІГАЄ значення між рендерами, але, на відміну від useState, ЗМІНА .current НЕ викликає перерендер компонента. Це робить useRef зручним для двох речей: (1) прямого доступу до реального DOM-вузла, і (2) зберігання «допоміжних» значень, які не мають впливати на UI напряму.\n\nЩоб отримати доступ до DOM-елемента, ref передають у спеціальний атрибут ref на JSX-тезі: const inputRef = useRef(null); <input ref={inputRef} /> — після рендеру inputRef.current стане РЕАЛЬНИМ DOM-вузлом <input> (тим самим, що повернув би document.querySelector), і з ним можна робити що завгодно напряму: inputRef.current.focus().\n\nТиповий патерн — автофокус поля при монтуванні компонента: useEffect(() => { inputRef.current.focus(); }, []) — ефект виконується після рендеру, коли inputRef.current уже гарантовано вказує на реальний DOM-елемент (до першого рендеру .current дорівнює null, тому звертатись до нього напряму під час самого рендеру — помилка).",
    examples: [
      { title: "Автофокус через ref", code: `function App() {\n  const inputRef = useRef(null);\n\n  useEffect(() => {\n    inputRef.current.focus();\n  }, []);\n\n  return <input ref={inputRef} placeholder="Я в фокусі при завантаженні" />;\n}\nrender(<App />);`, explain: "inputRef.current — реальний DOM-вузол після рендеру; .focus() — звичайний метод DOM, викликаний напряму." },
    ],
    task: "Створи App() з useRef(null) для input, useEffect([]) що викликає .focus() на ньому, і сам <input ref={inputRef} />.",
    starter: `function App() {\n  const inputRef = useRef(null);\n\n  useEffect(() => {\n    // твій код тут\n  }, []);\n\n  return <input ref={inputRef} />;\n}\n\n// render(<App />);\n`,
    hints: [
      "inputRef.current.focus() — виклич усередині useEffect, не під час самого рендеру.",
      "ref={inputRef} на самому <input> — так React прив'язує DOM-вузол до .current.",
      `function App() {\n  const inputRef = useRef(null);\n\n  useEffect(() => {\n    inputRef.current.focus();\n  }, []);\n\n  return <input ref={inputRef} />;\n}\n\nrender(<App />);`,
    ],
    solution: `function App() {\n  const inputRef = useRef(null);\n\n  useEffect(() => {\n    inputRef.current.focus();\n  }, []);\n\n  return <input ref={inputRef} />;\n}\n\nrender(<App />);`,
    testCode: `await tick(50);\nconst input = document.querySelector('#root input');\nif (!input) return {pass:false, message:"Потрібен елемент <input>."};\nif (document.activeElement !== input) return {pass:false, message:"Поле input має бути у фокусі після монтування (document.activeElement)."};\nreturn {pass:true, message:"ref={inputRef} + inputRef.current у useEffect — стандартний спосіб напряму керувати реальним DOM-вузлом, коли React-стану для цього недостатньо."};`,
  },
  {
    id: "react-16",
    title: "useMemo: кешування обчислень",
    type: "react",
    harness: harnessWith(),
    theory:
      "Компонент перерендерюється при КОЖНІЙ зміні будь-якого свого стану — і якщо всередині є важке обчислення (сортування великого масиву, складна математика), воно виконувалось би ЗНОВУ при кожному рендері, навіть якщо вхідні дані для нього не змінились. useMemo(calculateFn, deps) кешує РЕЗУЛЬТАТ обчислення і перераховує його лише тоді, коли щось у deps справді змінилось.\n\nconst total = useMemo(() => list.reduce((a, b) => a + b, 0), [list]) — при першому рендері calculateFn виконується, результат зберігається. При наступних рендерах, якщо list (за посиланням) той самий масив — useMemo одразу повертає ЗБЕРЕЖЕНИЙ результат, НЕ викликаючи calculateFn повторно. Лише коли list замінюють на НОВИЙ масив (наприклад, через spread [...list, x]) — обчислення виконується знову.\n\nВажливо не зловживати useMemo «про всяк випадок» — для дешевих обчислень (додати два числа) overhead від самого useMemo часто дорожчий, ніж просто порахувати заново. useMemo виправданий саме для дорогих обчислень чи великих масивів/об'єктів.",
    examples: [
      { title: "Мемоізована сума", code: `function App() {\n  const [list, setList] = useState([1, 2, 3]);\n  const [tick2, setTick2] = useState(0);\n\n  const total = useMemo(() => {\n    window.__computeCount = (window.__computeCount || 0) + 1;\n    return list.reduce((a, b) => a + b, 0);\n  }, [list]);\n\n  return (\n    <div>\n      <p>Сума: {total}</p>\n      <button onClick={() => setTick2(tick2 + 1)}>Оновити (не чіпає list)</button>\n      <button onClick={() => setList([...list, 10])}>Додати число в list</button>\n    </div>\n  );\n}\nrender(<App />);`, explain: "Клік по першій кнопці перерендерює App, але НЕ перераховує total (list той самий). Клік по другій — list новий масив, total рахується заново." },
    ],
    task: "Створи App() за зразком із прикладу: useMemo рахує суму list і рахує window.__computeCount, дві кнопки — одна міняє tick2 (не list), інша додає число в list.",
    starter: `function App() {\n  const [list, setList] = useState([1, 2, 3]);\n  const [tick2, setTick2] = useState(0);\n\n  const total = useMemo(() => {\n    // твій код тут: window.__computeCount++, поверни суму list\n  }, [list]);\n\n  return (\n    <div>\n      <p>Сума: {total}</p>\n      <button onClick={() => setTick2(tick2 + 1)}>Оновити</button>\n      <button onClick={() => setList([...list, 10])}>Додати</button>\n    </div>\n  );\n}\n\n// render(<App />);\n`,
    hints: [
      "window.__computeCount = (window.__computeCount || 0) + 1; всередині useMemo, ПЕРЕД return суми.",
      "list.reduce((a, b) => a + b, 0) — сума масиву.",
      `function App() {\n  const [list, setList] = useState([1, 2, 3]);\n  const [tick2, setTick2] = useState(0);\n\n  const total = useMemo(() => {\n    window.__computeCount = (window.__computeCount || 0) + 1;\n    return list.reduce((a, b) => a + b, 0);\n  }, [list]);\n\n  return (\n    <div>\n      <p>Сума: {total}</p>\n      <button onClick={() => setTick2(tick2 + 1)}>Оновити</button>\n      <button onClick={() => setList([...list, 10])}>Додати</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    ],
    solution: `function App() {\n  const [list, setList] = useState([1, 2, 3]);\n  const [tick2, setTick2] = useState(0);\n\n  const total = useMemo(() => {\n    window.__computeCount = (window.__computeCount || 0) + 1;\n    return list.reduce((a, b) => a + b, 0);\n  }, [list]);\n\n  return (\n    <div>\n      <p>Сума: {total}</p>\n      <button onClick={() => setTick2(tick2 + 1)}>Оновити</button>\n      <button onClick={() => setList([...list, 10])}>Додати</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    testCode: `window.__computeCount = 0;\nawait tick(0);\nif (window.__computeCount !== 1) return {pass:false, message:"Після першого рендеру обчислення має виконатись рівно один раз."};\nconst btns = document.querySelectorAll('#root button');\nbtns[0].click();\nawait tick(0);\nif (window.__computeCount !== 1) return {pass:false, message:"Клік, що НЕ чіпає list, не повинен перераховувати useMemo (computeCount має лишитись 1, зараз: " + window.__computeCount + ")."};\nbtns[1].click();\nawait tick(0);\nif (window.__computeCount !== 2) return {pass:false, message:"Клік, що змінює list, МАЄ перерахувати useMemo (computeCount має стати 2, зараз: " + window.__computeCount + ")."};\nreturn {pass:true, message:"useMemo перераховує значення лише коли залежності справді змінились за посиланням — а не при кожному рендері компонента."};`,
  },
  {
    id: "react-17",
    title: "useCallback: кешування функцій",
    type: "react",
    harness: harnessWith(),
    theory:
      "Кожного разу, коли компонент рендериться, усі функції, оголошені всередині нього (звичайні обробники подій), створюються ЗАНОВО — це нові об'єкти-функції в пам'яті, навіть якщо їхній код ідентичний попередньому рендеру. Зазвичай це не проблема, але коли така функція передається дочірньому компоненту, обгорнутому в React.memo (оптимізація, що пропускає перерендер, якщо пропси не змінились), НОВА функція щоразу означає «пропс змінився» — і оптимізація не спрацьовує.\n\nuseCallback(fn, deps) — це useMemo, спеціалізований саме для функцій: він повертає ТУ САМУ функцію (той самий об'єкт у пам'яті) між рендерами, доки залежності в deps не зміняться: const handleClick = useCallback(() => { ... }, []) — з порожнім масивом функція створюється ОДИН РАЗ і більше ніколи не змінюється (те саме посилання при кожному рендері).\n\nПеревірити це можна порівнянням посилань (===): дві функції з однаковим кодом, але створені окремо, НЕ рівні одна одній (fn1 === fn2 — false), а useCallback гарантує, що при однакових deps повертається САМЕ ТЕ САМЕ посилання.",
    examples: [
      { title: "Стабільне посилання на функцію", code: `function App() {\n  const [tick2, setTick2] = useState(0);\n\n  const handleClick = useCallback(() => {\n    console.log("клік");\n  }, []);\n\n  if (!window.__firstCallback) window.__firstCallback = handleClick;\n  window.__latestCallback = handleClick;\n\n  return <button onClick={() => setTick2(tick2 + 1)}>Оновити ({tick2})</button>;\n}\nrender(<App />);`, explain: "Незалежно від кількості рендерів, window.__firstCallback === window.__latestCallback лишається true, бо deps ([]) ніколи не змінюються." },
    ],
    task: "Створи App() за зразком: useCallback([]) для handleClick, збережи перше й останнє посилання у window.__firstCallback / window.__latestCallback, кнопка змінює tick2.",
    starter: `function App() {\n  const [tick2, setTick2] = useState(0);\n\n  const handleClick = useCallback(() => {\n    console.log("клік");\n  }, []);\n\n  // твій код тут: window.__firstCallback / window.__latestCallback\n\n  return <button onClick={() => setTick2(tick2 + 1)}>Оновити ({tick2})</button>;\n}\n\n// render(<App />);\n`,
    hints: [
      "if (!window.__firstCallback) window.__firstCallback = handleClick; — записується лише один раз.",
      "window.__latestCallback = handleClick; — перезаписується щоразу.",
      `function App() {\n  const [tick2, setTick2] = useState(0);\n\n  const handleClick = useCallback(() => {\n    console.log("клік");\n  }, []);\n\n  if (!window.__firstCallback) window.__firstCallback = handleClick;\n  window.__latestCallback = handleClick;\n\n  return <button onClick={() => setTick2(tick2 + 1)}>Оновити ({tick2})</button>;\n}\n\nrender(<App />);`,
    ],
    solution: `function App() {\n  const [tick2, setTick2] = useState(0);\n\n  const handleClick = useCallback(() => {\n    console.log("клік");\n  }, []);\n\n  if (!window.__firstCallback) window.__firstCallback = handleClick;\n  window.__latestCallback = handleClick;\n\n  return <button onClick={() => setTick2(tick2 + 1)}>Оновити ({tick2})</button>;\n}\n\nrender(<App />);`,
    testCode: `window.__firstCallback = null;\nwindow.__latestCallback = null;\nawait tick(0);\nconst btn = document.querySelector('#root button');\nbtn.click();\nawait tick(0);\nbtn.click();\nawait tick(0);\nif (typeof window.__firstCallback !== 'function') return {pass:false, message:"window.__firstCallback має бути функцією після рендеру."};\nif (window.__firstCallback !== window.__latestCallback) return {pass:false, message:"useCallback з [] має повертати ОДНЕ Й ТЕ САМЕ посилання на функцію при кожному рендері."};\nreturn {pass:true, message:"useCallback([]) гарантує, що функція НЕ пересворюється між рендерами — важливо для дочірніх компонентів, оптимізованих через React.memo."};`,
  },
  {
    id: "react-18",
    title: "Власні хуки (custom hooks)",
    type: "react",
    harness: harnessWith(),
    theory:
      "Власний хук — це звичайна JavaScript-функція, ім'я якої починається з use (за домовленістю, яку розуміє і сам React, і лінтери), що всередині використовує ВБУДОВАНІ хуки (useState, useEffect тощо) і повертає щось корисне для компонента. Це дозволяє ВИНЕСТИ повторювану логіку стану в окрему, повторно використовувану функцію — той самий принцип, що й звичайні функції, але спеціально для stateful-логіки.\n\nfunction useCounter(initial) { const [count, setCount] = useState(initial); const increment = () => setCount(c => c + 1); return { count, increment }; } — тепер БУДЬ-ЯКИЙ компонент може написати const { count, increment } = useCounter(0) і отримати повністю робочий лічильник, не дублюючи логіку useState щоразу заново.\n\nВажливо: власний хук не «ділиться» станом між компонентами, які його використовують — КОЖЕН виклик useCounter() створює СВІЙ ВЛАСНИЙ, незалежний useState. Це просто спосіб перевикористати КОД логіки, а не спільні дані (для спільних даних між компонентами — Context, наступний урок).",
    examples: [
      { title: "Власний хук useCounter", code: `function useCounter(initial) {\n  const [count, setCount] = useState(initial);\n  const increment = () => setCount(c => c + 1);\n  return { count, increment };\n}\n\nfunction App() {\n  const { count, increment } = useCounter(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={increment}>+1</button>\n    </div>\n  );\n}\nrender(<App />);`, explain: "useCounter повністю інкапсулює логіку лічильника — App просто споживає готовий результат." },
    ],
    task: "Створи власний хук useCounter(initial), що повертає {count, increment}. Використай його в App().",
    starter: `function useCounter(initial) {\n  // твій код тут\n}\n\nfunction App() {\n  const { count, increment } = useCounter(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={increment}>+1</button>\n    </div>\n  );\n}\n\n// render(<App />);\n`,
    hints: [
      "useCounter — це звичайна функція, що всередині викликає useState.",
      "increment = () => setCount(c => c + 1) — функція-оновлювач c => c+1 гарантує коректність навіть при кількох швидких кліках.",
      `function useCounter(initial) {\n  const [count, setCount] = useState(initial);\n  const increment = () => setCount(c => c + 1);\n  return { count, increment };\n}\n\nfunction App() {\n  const { count, increment } = useCounter(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={increment}>+1</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    ],
    solution: `function useCounter(initial) {\n  const [count, setCount] = useState(initial);\n  const increment = () => setCount(c => c + 1);\n  return { count, increment };\n}\n\nfunction App() {\n  const { count, increment } = useCounter(0);\n  return (\n    <div>\n      <p>Рахунок: {count}</p>\n      <button onClick={increment}>+1</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    testCode: `await tick(0);\nconst btn = document.querySelector('#root button');\nif (!btn) return {pass:false, message:"Потрібна кнопка +1."};\nbtn.click();\nbtn.click();\nawait tick(0);\nconst p = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Рахунок: 2')) return {pass:false, message:'Після двох кліків має бути "Рахунок: 2".'};\nreturn {pass:true, message:"useCounter — власний хук: звичайна функція з use-префіксом, що інкапсулює логіку useState для повторного використання."};`,
  },
  {
    id: "react-19",
    title: "Context: дані без «прокидання» пропсів",
    type: "react",
    harness: harnessWith(),
    theory:
      "Якщо дані потрібні глибоко вкладеному компоненту, а проміжні компоненти між ним і джерелом даних цих даних НЕ використовують — довелось би «прокидати» проп крізь КОЖЕН проміжний рівень лише для передачі далі (prop drilling), навіть якщо він там не потрібен. Context вирішує саме цю проблему: дозволяє «телепортувати» значення напряму від предка до будь-якого нащадка, без участі проміжних компонентів.\n\nconst ThemeContext = createContext('light') створює контекст із значенням за замовчуванням. <ThemeContext.Provider value=\"dark\">...</ThemeContext.Provider> — Provider «постачає» значення value усім нащадкам всередині нього, на будь-якій глибині вкладеності. Усередині БУДЬ-ЯКОГО нащадка (навіть через 10 рівнів компонентів) useContext(ThemeContext) поверне значення, надане найближчим Provider вище по дереву.\n\nContext найкраще підходить для дійсно «глобальних» для якоїсь частини дерева даних: тема оформлення, поточний користувач, мова інтерфейсу. Для звичайного зв'язку «батько-дитина» (один рівень) простіші пропси, як в уроці про lifting state up, зазвичай достатньо — Context потрібен саме тоді, коли рівнів багато.",
    examples: [
      { title: "Provider + useContext", code: `const ThemeContext = createContext("light");\n\nfunction Display() {\n  const theme = useContext(ThemeContext);\n  return <p>Тема: {theme}</p>;\n}\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value="dark">\n      <Display />\n    </ThemeContext.Provider>\n  );\n}\nrender(<App />);`, explain: "Display отримує значення \"dark\" напряму через useContext, не отримуючи його як звичайний проп від App." },
    ],
    task: "Створи createContext('light') як ThemeContext. Компонент Display() читає його через useContext і показує <p>Тема: {theme}</p>. App() обгортає Display у ThemeContext.Provider value=\"dark\".",
    starter: `const ThemeContext = createContext("light");\n\nfunction Display() {\n  // твій код тут\n}\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value="dark">\n      {/* Display тут */}\n    </ThemeContext.Provider>\n  );\n}\n\n// render(<App />);\n`,
    hints: [
      "useContext(ThemeContext) усередині Display поверне значення, надане найближчим Provider.",
      "return <p>Тема: {theme}</p>;",
      `const ThemeContext = createContext("light");\n\nfunction Display() {\n  const theme = useContext(ThemeContext);\n  return <p>Тема: {theme}</p>;\n}\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value="dark">\n      <Display />\n    </ThemeContext.Provider>\n  );\n}\n\nrender(<App />);`,
    ],
    solution: `const ThemeContext = createContext("light");\n\nfunction Display() {\n  const theme = useContext(ThemeContext);\n  return <p>Тема: {theme}</p>;\n}\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value="dark">\n      <Display />\n    </ThemeContext.Provider>\n  );\n}\n\nrender(<App />);`,
    testCode: `await tick(0);\nconst p = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Тема: dark')) return {pass:false, message:'Display має показати "Тема: dark", отримане через useContext.'};\nreturn {pass:true, message:"Context дозволяє передати значення напряму від Provider до будь-якого нащадка, без прокидання пропсів через кожен проміжний рівень."};`,
  },
  {
    id: "react-20",
    title: "useReducer: складніша логіка стану",
    type: "react",
    harness: harnessWith(),
    theory:
      "useState чудово підходить для простих незалежних значень, але коли зміна стану залежить від того, ЯКА САМЕ дія відбулась (не просто «нове значення», а «збільшити», «зменшити», «скинути»), логіка змін розпорошується по багатьох окремих setX-викликах. useReducer(reducer, initialState) централізує ВСІ можливі зміни стану в ОДНІЙ функції-reducer.\n\nreducer — це функція (state, action) => newState: отримує ПОТОЧНИЙ стан і «дію» (об'єкт з type, що описує, ЩО сталось), і повертає НОВИЙ стан: function reducer(state, action) { switch (action.type) { case 'increment': return { count: state.count + 1 }; ... } }. const [state, dispatch] = useReducer(reducer, { count: 0 }) — dispatch({ type: 'increment' }) викликає reducer із поточним state і цією дією, і React перерендерює компонент із новим станом, який reducer повернув.\n\nПеревага над кількома useState: уся ЛОГІКА того, як саме змінюється стан, зібрана в ОДНОМУ місці (reducer), а компонент лише «повідомляє про наміри» через dispatch, не знаючи деталей обчислення нового стану. Це той самий патерн, що лежить в основі бібліотек на кшталт Redux, лише вбудований прямо в React.",
    examples: [
      { title: "Reducer-лічильник", code: `function reducer(state, action) {\n  switch (action.type) {\n    case "increment":\n      return { count: state.count + 1 };\n    case "decrement":\n      return { count: state.count - 1 };\n    default:\n      return state;\n  }\n}\n\nfunction App() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n  return (\n    <div>\n      <p>Рахунок: {state.count}</p>\n      <button onClick={() => dispatch({ type: "increment" })}>+1</button>\n    </div>\n  );\n}\nrender(<App />);`, explain: "dispatch лише повідомляє ПРО НАМІР ('increment') — саме обчислення нового стану цілком усередині reducer." },
    ],
    task: "Створи reducer(state, action) з case 'increment'/'decrement' і App() з useReducer, що показує рахунок і кнопку +1.",
    starter: `function reducer(state, action) {\n  switch (action.type) {\n    // твої case тут\n    default:\n      return state;\n  }\n}\n\nfunction App() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n  return (\n    <div>\n      <p>Рахунок: {state.count}</p>\n      <button onClick={() => dispatch({ type: "increment" })}>+1</button>\n    </div>\n  );\n}\n\n// render(<App />);\n`,
    hints: [
      "case 'increment': return { count: state.count + 1 };",
      "dispatch({ type: 'increment' }) — сам компонент не обчислює нове значення, лише передає намір.",
      `function reducer(state, action) {\n  switch (action.type) {\n    case "increment":\n      return { count: state.count + 1 };\n    case "decrement":\n      return { count: state.count - 1 };\n    default:\n      return state;\n  }\n}\n\nfunction App() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n  return (\n    <div>\n      <p>Рахунок: {state.count}</p>\n      <button onClick={() => dispatch({ type: "increment" })}>+1</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    ],
    solution: `function reducer(state, action) {\n  switch (action.type) {\n    case "increment":\n      return { count: state.count + 1 };\n    case "decrement":\n      return { count: state.count - 1 };\n    default:\n      return state;\n  }\n}\n\nfunction App() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n  return (\n    <div>\n      <p>Рахунок: {state.count}</p>\n      <button onClick={() => dispatch({ type: "increment" })}>+1</button>\n    </div>\n  );\n}\n\nrender(<App />);`,
    testCode: `await tick(0);\nconst btn = document.querySelector('#root button');\nif (!btn) return {pass:false, message:"Потрібна кнопка +1."};\nbtn.click();\nbtn.click();\nawait tick(0);\nconst p = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Рахунок: 2')) return {pass:false, message:'Після двох кліків має бути "Рахунок: 2".'};\nreturn {pass:true, message:"useReducer централізує логіку змін стану в одній функції-reducer — компонент лише dispatch-ить наміри."};`,
  },
  {
    id: "react-21",
    title: "Fragment: без зайвого div",
    type: "react",
    harness: harnessWith(),
    theory:
      "З уроку 1 відомо, що JSX має повернути РІВНО ОДИН кореневий елемент — тому кілька сусідніх елементів завжди доводилось загортати в <div>. Але зайвий div іноді ЛОМАЄ семантику чи стилі (наприклад, усередині <table> дозволені лише конкретні теги, а зайвий div усередині <tr> — недійсний HTML).\n\nFragment вирішує це: <Fragment>елемент1<elemент2</Fragment> групує кілька елементів в ОДИН React-вузол для правил JSX, але НЕ створює жодного реального DOM-вузла — після рендеру елементи опиняються ПРЯМО серед дітей батька, без обгортки. У цьому курсі Fragment уже доступний через деструктуризацію з React (в harness).\n\nІснує коротший запис — порожні кутові дужки <>...</> — це те саме, що <Fragment>...</Fragment>, просто зручніший синтаксис. Єдине обмеження короткого запису: він не приймає key (для списків Fragment-ів потрібен повний запис <Fragment key={...}>).",
    examples: [
      { title: "Fragment без обгортки", code: `function App() {\n  return (\n    <>\n      <p>Перший абзац</p>\n      <p>Другий абзац</p>\n    </>\n  );\n}\nrender(<App />);`, explain: "Обидва <p> опиняються ПРЯМО всередині #root — жодного зайвого div між ними немає." },
    ],
    task: "Створи App(), що повертає <>...</> з двома абзацами <p>Перший абзац</p> і <p>Другий абзац</p>, без обгортки div.",
    starter: `function App() {\n  return (\n    <>\n      {/* твій код тут */}\n    </>\n  );\n}\n\n// render(<App />);\n`,
    hints: [
      "<>...</> — коротка форма Fragment, не створює реального DOM-вузла.",
      "Просто два <p> підряд, без div навколо них.",
      `function App() {\n  return (\n    <>\n      <p>Перший абзац</p>\n      <p>Другий абзац</p>\n    </>\n  );\n}\n\nrender(<App />);`,
    ],
    solution: `function App() {\n  return (\n    <>\n      <p>Перший абзац</p>\n      <p>Другий абзац</p>\n    </>\n  );\n}\n\nrender(<App />);`,
    testCode: `await tick(0);\nconst directParagraphs = document.querySelectorAll('#root > p');\nif (directParagraphs.length !== 2) return {pass:false, message:"Мають бути рівно два <p> ПРЯМО всередині #root, без обгортки div (Fragment не створює DOM-вузол)."};\nreturn {pass:true, message:"Fragment (<>...</>) групує елементи для правил JSX, не додаючи жодного зайвого DOM-вузла."};`,
  },
  {
    id: "react-22",
    title: "Error Boundary: перехоплення помилок",
    type: "react",
    harness: harnessWith(),
    theory:
      "Якщо будь-який компонент кидає помилку (throw) під час рендеру, за замовчуванням ВЕСЬ React-застосунок «падає» — екран стає порожнім. Error Boundary — компонент, що ЛОВИТЬ помилки своїх ДОЧІРНІХ компонентів і показує запасний UI замість того, щоб зламати все.\n\nНа відміну від усіх попередніх уроків, Error Boundary можна створити ЛИШЕ через клас-компонент (extends Component), не функцію — це один із небагатьох випадків у сучасному React, де класи все ще потрібні, бо хуків-еквівалентів для цього не існує. Обов'язкові частини: static getDerivedStateFromError(error) — повертає новий стан (наприклад, { hasError: true }) для наступного рендеру, і метод render(), що показує запасний UI, якщо hasError true, або this.props.children звичайним чином, якщо помилки не було.\n\nError Boundary ловить помилки лише ДОЧІРНІХ компонентів під час рендеру — не власні помилки в обробниках подій (для цього використовують звичайний try/catch усередині самого обробника) і не асинхронні помилки. Компонент огортає частину дерева: <ErrorBoundary><MightCrash /></ErrorBoundary> — якщо MightCrash впаде, решта застосунку поза ErrorBoundary продовжує працювати нормально.",
    examples: [
      { title: "Error Boundary ловить помилку дитини", code: `class ErrorBoundary extends Component {\n  constructor(props) {\n    super(props);\n    this.state = { hasError: false };\n  }\n  static getDerivedStateFromError(error) {\n    return { hasError: true };\n  }\n  render() {\n    if (this.state.hasError) {\n      return <p>Щось пішло не так.</p>;\n    }\n    return this.props.children;\n  }\n}\n\nfunction Buggy() {\n  throw new Error("Помилка!");\n}\n\nrender(\n  <ErrorBoundary>\n    <Buggy />\n  </ErrorBoundary>\n);`, explain: "Без ErrorBoundary Buggy зламав би весь рендер; з ним — показується запасний <p>, решта застосунку лишається живою." },
    ],
    task: "Створи клас ErrorBoundary за зразком (getDerivedStateFromError, render з умовою hasError) і оберни ним компонент Buggy(), що завжди кидає помилку.",
    starter: `class ErrorBoundary extends Component {\n  constructor(props) {\n    super(props);\n    this.state = { hasError: false };\n  }\n  static getDerivedStateFromError(error) {\n    // твій код тут\n  }\n  render() {\n    // твій код тут\n  }\n}\n\nfunction Buggy() {\n  throw new Error("Помилка!");\n}\n\n// render(<ErrorBoundary><Buggy /></ErrorBoundary>);\n`,
    hints: [
      "getDerivedStateFromError повертає { hasError: true } — саме цей об'єкт стане новим state.",
      "render(): if (this.state.hasError) return <p>Щось пішло не так.</p>; return this.props.children;",
      `class ErrorBoundary extends Component {\n  constructor(props) {\n    super(props);\n    this.state = { hasError: false };\n  }\n  static getDerivedStateFromError(error) {\n    return { hasError: true };\n  }\n  render() {\n    if (this.state.hasError) {\n      return <p>Щось пішло не так.</p>;\n    }\n    return this.props.children;\n  }\n}\n\nfunction Buggy() {\n  throw new Error("Помилка!");\n}\n\nrender(<ErrorBoundary><Buggy /></ErrorBoundary>);`,
    ],
    solution: `class ErrorBoundary extends Component {\n  constructor(props) {\n    super(props);\n    this.state = { hasError: false };\n  }\n  static getDerivedStateFromError(error) {\n    return { hasError: true };\n  }\n  render() {\n    if (this.state.hasError) {\n      return <p>Щось пішло не так.</p>;\n    }\n    return this.props.children;\n  }\n}\n\nfunction Buggy() {\n  throw new Error("Помилка!");\n}\n\nrender(<ErrorBoundary><Buggy /></ErrorBoundary>);`,
    testCode: `await tick(50);\nconst p = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Щось пішло не так')) return {pass:false, message:"ErrorBoundary має показати запасний текст замість того, щоб залишити #root порожнім після помилки Buggy."};\nreturn {pass:true, message:"ErrorBoundary (клас із getDerivedStateFromError) — єдиний спосіб перехопити помилку рендеру дочірнього компонента й показати запасний UI замість порожнього екрана."};`,
  },
  {
    id: "react-23",
    title: "Фінальний проєкт: Todo-застосунок",
    type: "react",
    harness: harnessWith(),
    theory:
      "Останній урок об'єднує все вивчене в один справжній застосунок: useState для списку задач і тексту поля, контрольований input, форма з onSubmit і preventDefault, рендеринг списку через map з key, умовний рендеринг (порожній стан «Задач ще немає»), і дві дії над кожним елементом — позначити виконаним (toggle) і видалити (remove).\n\nКлючова деталь роботи зі списками в React: масив НІКОЛИ не змінюють напряму (items.push(...) чи items[0].done = true — так робити не можна). Замість цього щоразу створюють НОВИЙ масив: додавання — [...items, newItem]; toggle — items.map(it => it.id === id ? {...it, done: !it.done} : it) (новий об'єкт лише для того елемента, що змінюється, решта — ті самі посилання); видалення — items.filter(it => it.id !== id). Це той самий принцип «незмінності» (immutability), що робить React здатним ефективно порівнювати «було / стало».\n\nЦе завершує курс: 23 уроки від першого JSX-елемента до застосунку, що вміє додавати, позначати виконаними й видаляти задачі — той самий набір навичок, з якого починається будь-який реальний React-проєкт.",
    examples: [],
    task: "Збери Todo-застосунок: форма додає задачу в items; список показує кожен пункт із можливістю клікнути (toggle done) і кнопкою «Видалити»; якщо items порожній — показати «Задач ще немає.».",
    starter: `function App() {\n  const [items, setItems] = useState([]);\n  const [text, setText] = useState("");\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    if (!text.trim()) return;\n    // додай новий елемент { id, text, done: false } в items, очисти text\n  }\n  function toggle(id) {\n    // онови items: перемкни done для елемента з цим id\n  }\n  function remove(id) {\n    // прибери з items елемент з цим id\n  }\n\n  return (\n    <div>\n      <form onSubmit={handleSubmit}>\n        <input value={text} onChange={e => setText(e.target.value)} placeholder="Нова задача" />\n        <button type="submit">Додати</button>\n      </form>\n      {items.length === 0 ? (\n        <p>Задач ще немає.</p>\n      ) : (\n        <ul>\n          {items.map(it => (\n            <li key={it.id}>\n              <span style={{ textDecoration: it.done ? "line-through" : "none" }} onClick={() => toggle(it.id)}>\n                {it.text}\n              </span>\n              <button onClick={() => remove(it.id)}>Видалити</button>\n            </li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n\n// render(<App />);\n`,
    hints: [
      "setItems([...items, { id: Date.now() + Math.random(), text, done: false }]); setText('');",
      "toggle: setItems(items.map(it => it.id === id ? { ...it, done: !it.done } : it)); remove: setItems(items.filter(it => it.id !== id));",
      `function App() {\n  const [items, setItems] = useState([]);\n  const [text, setText] = useState("");\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    if (!text.trim()) return;\n    setItems([...items, { id: Date.now() + Math.random(), text, done: false }]);\n    setText("");\n  }\n  function toggle(id) {\n    setItems(items.map(it => it.id === id ? { ...it, done: !it.done } : it));\n  }\n  function remove(id) {\n    setItems(items.filter(it => it.id !== id));\n  }\n\n  return (\n    <div>\n      <form onSubmit={handleSubmit}>\n        <input value={text} onChange={e => setText(e.target.value)} placeholder="Нова задача" />\n        <button type="submit">Додати</button>\n      </form>\n      {items.length === 0 ? (\n        <p>Задач ще немає.</p>\n      ) : (\n        <ul>\n          {items.map(it => (\n            <li key={it.id}>\n              <span style={{ textDecoration: it.done ? "line-through" : "none" }} onClick={() => toggle(it.id)}>\n                {it.text}\n              </span>\n              <button onClick={() => remove(it.id)}>Видалити</button>\n            </li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n\nrender(<App />);`,
    ],
    solution: `function App() {\n  const [items, setItems] = useState([]);\n  const [text, setText] = useState("");\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    if (!text.trim()) return;\n    setItems([...items, { id: Date.now() + Math.random(), text, done: false }]);\n    setText("");\n  }\n  function toggle(id) {\n    setItems(items.map(it => it.id === id ? { ...it, done: !it.done } : it));\n  }\n  function remove(id) {\n    setItems(items.filter(it => it.id !== id));\n  }\n\n  return (\n    <div>\n      <form onSubmit={handleSubmit}>\n        <input value={text} onChange={e => setText(e.target.value)} placeholder="Нова задача" />\n        <button type="submit">Додати</button>\n      </form>\n      {items.length === 0 ? (\n        <p>Задач ще немає.</p>\n      ) : (\n        <ul>\n          {items.map(it => (\n            <li key={it.id}>\n              <span style={{ textDecoration: it.done ? "line-through" : "none" }} onClick={() => toggle(it.id)}>\n                {it.text}\n              </span>\n              <button onClick={() => remove(it.id)}>Видалити</button>\n            </li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n\nrender(<App />);`,
    testCode: `await tick(0);\nlet p = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Задач ще немає')) return {pass:false, message:'Спочатку список порожній — має бути "Задач ще немає."'};\nconst input = document.querySelector('#root input');\nconst form = document.querySelector('#root form');\ntypeInto(input, "Купити хліб");\nsubmitForm(form);\nawait tick(0);\nlet lis = document.querySelectorAll('#root li');\nif (lis.length !== 1 || !lis[0].textContent.includes('Купити хліб')) return {pass:false, message:"Після додавання список має містити один пункт з текстом задачі."};\nconst span = lis[0].querySelector('span');\nspan.click();\nawait tick(0);\nlis = document.querySelectorAll('#root li');\nif (lis[0].querySelector('span').style.textDecoration !== 'line-through') return {pass:false, message:"Клік по тексту задачі має позначити її виконаною (line-through)."};\nconst delBtn = lis[0].querySelector('button');\ndelBtn.click();\nawait tick(0);\np = document.querySelector('#root p');\nif (!p || !p.textContent.includes('Задач ще немає')) return {pass:false, message:'Після видалення єдиної задачі список знову має показувати "Задач ще немає."'};\nreturn {pass:true, message:"Todo-застосунок готовий — контрольована форма, список із key, toggle і видалення через незмінні операції над масивом. Саме з цього набору навичок починається будь-який реальний React-проєкт."};`,
    finalProject: {
      techs: ["React 18", "JSX", "useState", "Vite"],
      skills: [
        "Компоненти й пропси",
        "Стан (useState) і контрольовані поля",
        "Обробка форм (onSubmit, preventDefault)",
        "Рендеринг списків через map і key",
        "Незмінні оновлення масивів (spread, map, filter)",
        "useEffect, useRef, useMemo, useCallback, Context, useReducer",
      ],
      structure: `todo-app/\n├── index.html\n├── package.json\n├── vite.config.js\n└── src/\n    ├── main.jsx\n    └── App.jsx`,
      code: `// src/App.jsx
import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setItems([...items, { id: Date.now(), text, done: false }]);
    setText("");
  }

  function toggle(id) {
    setItems(items.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  }

  function remove(id) {
    setItems(items.filter((it) => it.id !== id));
  }

  return (
    <div className="app">
      <h1>Мої задачі</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Нова задача"
        />
        <button type="submit">Додати</button>
      </form>
      {items.length === 0 ? (
        <p>Задач ще немає.</p>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              <span
                style={{ textDecoration: it.done ? "line-through" : "none" }}
                onClick={() => toggle(it.id)}
              >
                {it.text}
              </span>
              <button onClick={() => remove(it.id)}>Видалити</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      runCommand: "npm create vite@latest todo-app -- --template react\ncd todo-app && npm install && npm run dev",
      installGuide: {
        intro: "Той самий застосунок, який ти щойно зібрала урок за уроком, — це реальний, готовий до запуску React-проєкт. Ось як підняти його локально, поза платформою.",
        steps: [
          { title: "1. Встанови Node.js", text: "Завантаж LTS-версію з nodejs.org — вона включає npm, потрібний для наступних кроків." },
          { title: "2. Створи проєкт через Vite", code: "npm create vite@latest todo-app -- --template react" },
          { title: "3. Встанови залежності й заміни App.jsx", text: "Перейди в папку проєкту, встанови пакети, і встав код App.jsx та main.jsx з блоку вище.", code: "cd todo-app\nnpm install" },
          { title: "4. Запусти сервер розробки", code: "npm run dev", text: "Vite покаже локальну адресу (зазвичай http://localhost:5173) — відкрий її в браузері." },
        ],
      },
      improvements: [
        "Зберігати items у localStorage, щоб задачі не зникали після перезавантаження сторінки",
        "Додати редагування тексту існуючої задачі (подвійний клік → input)",
        "Додати фільтри: усі / активні / виконані",
        "Стилізувати через CSS-модуль чи Tailwind замість inline style",
      ],
      nextLevel: "Наступний крок — курс Full Stack: підключити цей інтерфейс до справжнього backend-сервера (курс Backend) замість локального useState, щоб задачі зберігались на сервері й були доступні з будь-якого пристрою.",
    },
  },
];
