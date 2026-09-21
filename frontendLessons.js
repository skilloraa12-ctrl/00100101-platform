// Frontend — the course that combines HTML, CSS and JavaScript into real,
// interactive UI patterns instead of teaching each language in isolation.
// A subset of lessons are "milestones": the exact code the learner submits
// becomes a permanent part of the growing "Мій сайт" project (see
// FRONTEND_MAIN_MILESTONES / FRONTEND_CSS_MILESTONES / FRONTEND_JS_MILESTONES
// below and their wiring in App.jsx's renderProjectHtml/Css/Js and
// handleComplete). Every milestone requires a FIXED class name (never an id
// the learner invents), exactly like the existing html-41/html-42/css-*/js-41..44
// milestones from the HTML/CSS/JS courses — that's what lets a later CSS or
// JS milestone reliably target markup an earlier HTML milestone produced,
// regardless of the learner's own wording inside it.
export const FRONTEND_LESSONS = [
  {
    id: "frontend-1",
    title: "Від одного файлу до трьох: підключення style.css і script.js",
    theory:
      "Досі кожен урок жив в одному ізольованому вікні редактора. Реальний сайт — це МІНІМУМ три файли: index.html (структура), style.css (вигляд), script.js (поведінка) — саме та трійця, яку зрештою побачиш у вкладках «Мій сайт». Одна з головних навичок Frontend-розробника — правильно ЗВ'ЯЗАТИ ці файли між собою.\n\nCSS підключають тегом <link rel=\"stylesheet\" href=\"style.css\"> усередині <head> — рядок читається ДО того, як браузер намалює сторінку, тому стилі застосовуються одразу, без «спалаху» невідформатованого контенту.\n\nJS підключають тегом <script src=\"script.js\">, і місце має значення: якщо поставити його в head без додаткових атрибутів, браузер ЗУПИНИТЬ побудову сторінки, доки не завантажить і не виконає скрипт — на повільному з'єднанні сторінка «зависає» порожньою. Атрибут defer виправляє це: браузер завантажує script.js ПАРАЛЕЛЬНО з рештою сторінки, а виконує лише після того, як увесь HTML вже розібраний — тому <script src=\"script.js\" defer></script> можна безпечно лишати в head, і це сучасний стандарт.\n\nІснує ще async (завантажує паралельно, але виконує ОДРАЗУ як тільки завантажиться, не чекаючи решти HTML) — придатний для незалежних скриптів на кшталт лічильників аналітики, але не для коду, що звертається до елементів сторінки (там потрібен саме defer, бо elements мають вже існувати).",
    examples: [
      { title: "Правильне підключення обох файлів", code: `<head>\n  <link rel="stylesheet" href="style.css">\n  <script src="script.js" defer></script>\n</head>`, explain: "link для CSS і script з defer для JS можуть спокійно лежати РАЗОМ у head — defer гарантує, що script.js виконається вже після побудови сторінки." },
      { title: "Без defer — ризиковано в head", code: `<head>\n  <script src="script.js"></script>\n</head>\n<body>\n  <button id="btn">Клік</button>\n</body>`, explain: "Без defer скрипт виконається ДО появи #btn у DOM — document.getElementById('btn') поверне null, і код впаде з помилкою." },
    ],
    presentation: [
      { title: "Три файли одного сайту", points: ["index.html — структура, style.css — вигляд, script.js — поведінка", "link rel=\"stylesheet\" підключає CSS у head", "script src підключає JS — з defer, якщо він лежить у head"] },
      { title: "Навіщо defer", points: ["Без нього браузер зупиняє побудову сторінки на час завантаження JS", "defer завантажує паралельно, виконує ПІСЛЯ побудови HTML", "async виконує одразу по завантаженню — для незалежного коду"] },
    ],
    task: 'У head додай <link rel="stylesheet" href="style.css">, і в тому самому head — <script src="script.js" defer></script>.',
    starter: "<html>\n<head>\n\n</head>\n<body>\n</body>\n</html>",
    hints: [
      'link rel="stylesheet" href="style.css" — самозакривний тег, без вмісту.',
      'script src="script.js" defer — потрібен саме атрибут defer, без нього тег теж технічно правильний, але тут перевіряється саме він.',
      '<head>\n  <link rel="stylesheet" href="style.css">\n  <script src="script.js" defer></script>\n</head>',
    ],
    solution: `<html>\n<head>\n  <link rel="stylesheet" href="style.css">\n  <script src="script.js" defer></script>\n</head>\n<body>\n</body>\n</html>`,
    type: "html",
    check: (doc) => {
      const link = doc.querySelector('link[rel="stylesheet"]');
      if (!link || link.getAttribute("href") !== "style.css") return { pass: false, message: 'Потрібен <link rel="stylesheet" href="style.css">.' };
      const script = doc.querySelector("script[src]");
      if (!script || script.getAttribute("src") !== "script.js") return { pass: false, message: 'Потрібен <script src="script.js">.' };
      if (!script.hasAttribute("defer")) return { pass: false, message: "Тег script має атрибут defer — без нього JS виконався б ще до готовності сторінки." };
      return { pass: true, message: "Тепер твої три файли зв'язані правильно — саме так підключені HTML, CSS і JS твого власного сайту в «Мій сайт»." };
    },
  },
  {
    id: "frontend-2",
    title: "Flexbox: ряд і стовпець",
    theory:
      "Flexbox — інструмент CSS для розташування елементів В ОДНОМУ НАПРЯМКУ (рядок або стовпець), що вирішує задачу, яка раніше вимагала незручних float чи table-верстки. display: flex перетворює елемент на flex-контейнер — усі його прямі діти одразу вишиковуються в ряд, навіть без жодної додаткової властивості.\n\nflex-direction визначає напрямок: row (за замовчуванням, зліва направо) чи column (згори вниз). Це ОДНА властивість повністю перемикає всю логіку розташування — не потрібно чіпати самі елементи.\n\nflex-wrap: wrap дозволяє елементам ПЕРЕНОСИТИСЬ на новий рядок, коли не вистачає місця — без wrap за замовчуванням (nowrap) flex стискає всі елементи в один рядок, навіть якщо вони через це стають нечитабельно вузькими.\n\nFlexbox — перший з двох головних інструментів сучасної верстки (другий, CSS Grid, — за кілька уроків). Flexbox найкраще підходить саме для ОДНОВИМІРНОГО розташування (ряд або стовпець); коли потрібна повноцінна ДВОВИМІРНА сітка (рядки Й стовпці одночасно), обирають Grid.",
    previewHTML: `<div class="row"><div>1</div><div>2</div><div>3</div></div>`,
    examples: [
      { title: "Ряд елементів", code: `.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n}`, explain: "display: flex вмикає Flexbox, flex-direction: row вишиковує дітей у ряд, flex-wrap: wrap дозволяє перенос на мобільних екранах." },
      { title: "Стовпець замість ряду", code: `.sidebar {\n  display: flex;\n  flex-direction: column;\n}`, explain: "Та сама display: flex, лише column замість row — і елементи йдуть згори вниз." },
    ],
    presentation: [
      { title: "Flexbox базово", points: ["display: flex перетворює елемент на flex-контейнер", "flex-direction: row (за замовчуванням) чи column", "Прямі діти вишиковуються автоматично, без float"] },
      { title: "flex-wrap", points: ["За замовчуванням елементи стискаються в один рядок", "flex-wrap: wrap дозволяє перенос на новий рядок", "Критично для адаптивності на вузьких екранах"] },
    ],
    task: "Стилізуй .row: display: flex, flex-direction: row, flex-wrap: wrap.",
    starter: "",
    hints: ["Три властивості в одному правилі .row.", "display: flex — обов'язкова перша властивість, без неї решта не діють.", ".row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n}"],
    solution: `.row {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n}`,
    type: "css",
    tests: [
      { re: /\.row\s*{[^}]*display\s*:\s*flex/i, msg: ".row має мати display: flex." },
      { re: /\.row\s*{[^}]*flex-direction\s*:\s*row/i, msg: ".row має мати flex-direction: row." },
      { re: /\.row\s*{[^}]*flex-wrap\s*:\s*wrap/i, msg: ".row має мати flex-wrap: wrap." },
    ],
  },
  {
    id: "frontend-3",
    title: "Flexbox: вирівнювання й відступи",
    theory:
      "justify-content вирівнює елементи ВЗДОВЖ головної осі (для row — по горизонталі): flex-start (за замовчуванням, притиснуті до початку), center (по центру), space-between (перший і останній притиснуті до країв, решта розподілена рівномірно між ними) — саме space-between типовий для навігаційного меню: лого зліва, посилання розкидані по всій ширині.\n\nalign-items вирівнює елементи ПОПЕРЕК головної осі (для row — по вертикалі): center найчастіше потрібен, щоб текст різної висоти в одному рядку виглядав вирівняним по центру, а не «по нижньому краю», як буває за замовчуванням (stretch).\n\ngap задає відстань МІЖ елементами flex-контейнера, не зачіпаючи відстань від контейнера до його країв (це робить padding самого контейнера). До появи gap для Flexbox доводилось хитрувати з margin на кожному елементі окремо й компенсувати зайвий відступ з країв — gap вирішив це одним рядком.\n\nРазом display: flex + justify-content + align-items + gap — це, напевно, найчастіша комбінація властивостей у реальному CSS: рядок навігації, ряд кнопок, картка з іконкою й текстом поруч — усе це один і той самий шаблон.",
    previewHTML: `<div class="nav-row"><a href="#">Головна</a><a href="#">Каталог</a><a href="#">Контакти</a></div>`,
    examples: [
      { title: "Навігаційний рядок", code: `.nav-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}`, explain: "space-between розкидає посилання по всій ширині, align-items: center вирівнює їх по вертикалі, gap додає мінімальний відступ, навіть якщо посилання опиняться поруч." },
      { title: "Центрування по обох осях", code: `.hero-flex {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`, explain: "justify-content і align-items разом центрують вміст і по горизонталі, і по вертикалі — класичний спосіб центрувати щось усередині блока." },
    ],
    presentation: [
      { title: "Дві осі вирівнювання", points: ["justify-content — вздовж головної осі (для row: горизонталь)", "align-items — поперек головної осі (для row: вертикаль)", "space-between, center — найпоширеніші значення"] },
      { title: "gap", points: ["Відстань МІЖ елементами, без впливу на краї контейнера", "Замінює незручні margin на кожному елементі окремо", "Працює і для Flexbox, і для Grid"] },
    ],
    task: "Стилізуй .nav-row: display: flex, justify-content: space-between, align-items: center, gap.",
    starter: "",
    hints: ["Чотири властивості в одному правилі .nav-row.", "justify-content: space-between розкидає посилання по краях і рівномірно між ними.", ".nav-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}"],
    solution: `.nav-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}`,
    type: "css",
    tests: [
      { re: /\.nav-row\s*{[^}]*display\s*:\s*flex/i, msg: ".nav-row має мати display: flex." },
      { re: /\.nav-row\s*{[^}]*justify-content\s*:\s*space-between/i, msg: ".nav-row має мати justify-content: space-between." },
      { re: /\.nav-row\s*{[^}]*align-items\s*:\s*center/i, msg: ".nav-row має мати align-items: center." },
      { re: /\.nav-row\s*{[^}]*gap\s*:\s*[^;]+;/i, msg: ".nav-row має мати gap." },
    ],
  },
  {
    id: "frontend-4",
    title: "Проєкт: FAQ-акордеон — розмітка",
    theory:
      "Перший з трьох уроків, де ти будуєш FAQ-акордеон — блок частих запитань, де відповідь ПРИХОВАНА, доки не клікнеш на запитання. Це справжній, часто зустрічаний елемент реальних сайтів (сторінки підтримки, умови доставки, тарифи), і код звідси стане частиною ТВОГО сайту в «Мій сайт», поруч із секціями з html-уроків.\n\nСтруктура: контейнер <section class=\"faq\">, усередині — кілька <div class=\"faq-item\">, кожен з яких містить <button class=\"faq-question\"> (саме запитання, клікабельне) і <div class=\"faq-answer\"> (текст відповіді, поки що завжди видимий — це виправить наступний CSS-урок).\n\nЧОМУ саме button, а не div чи span для запитання? button — семантично клікабельний елемент: він автоматично отримує клавіатурну доступність (Tab + Enter/Space активують його) БЕЗ жодного додаткового коду, на відміну від div, якому довелось би вручну дописувати tabindex і обробник клавіші. Це той самий принцип доступності, що вже застосовувався в html-курсі.\n\nФіксовані класи .faq / .faq-item / .faq-question / .faq-answer — не випадковість: наступний CSS-урок і JS-урок орієнтуються САМЕ на ці назви, незалежно від того, які конкретно запитання ти напишеш.",
    examples: [
      { title: "FAQ з двома питаннями", code: `<section class="faq">\n  <div class="faq-item">\n    <button class="faq-question">Як оформити замовлення?</button>\n    <div class="faq-answer">Додай товар у кошик і натисни «Оформити».</div>\n  </div>\n  <div class="faq-item">\n    <button class="faq-question">Скільки триває доставка?</button>\n    <div class="faq-answer">Зазвичай 2-3 робочі дні по місту.</div>\n  </div>\n</section>`, explain: "Кожен .faq-item — самодостатня пара: запитання-кнопка й відповідь одразу під нею." },
    ],
    presentation: [
      { title: "Анатомія акордеону", points: ["Контейнер .faq, усередині — кілька .faq-item", "Кожен .faq-item: .faq-question (button) + .faq-answer (div)", "button — клавіатурна доступність БЕЗ додаткового коду"] },
      { title: "Що далі", points: ["Наступний урок — CSS: приховати відповіді за замовчуванням", "Потім — JS: клік на запитання відкриває відповідь", "Фіксовані класи дозволяють CSS/JS знайти саме ці блоки"] },
    ],
    task: 'Створи в main <section class="faq"> з щонайменше 3 <div class="faq-item">, кожен з <button class="faq-question"> (текст запитання) і <div class="faq-answer"> (текст відповіді).',
    starter: "",
    hints: [
      'Зовнішній контейнер — <section class="faq">.',
      'Кожен .faq-item містить .faq-question (button) і .faq-answer (div), у такому порядку.',
      '<section class="faq">\n  <div class="faq-item">\n    <button class="faq-question">Питання?</button>\n    <div class="faq-answer">Відповідь.</div>\n  </div>\n  ...\n</section>',
    ],
    solution: `<section class="faq">\n  <div class="faq-item">\n    <button class="faq-question">Як оформити замовлення?</button>\n    <div class="faq-answer">Додай товар у кошик і натисни «Оформити замовлення».</div>\n  </div>\n  <div class="faq-item">\n    <button class="faq-question">Скільки триває доставка?</button>\n    <div class="faq-answer">Зазвичай 2-3 робочі дні по місту, 5-7 днів по країні.</div>\n  </div>\n  <div class="faq-item">\n    <button class="faq-question">Чи можна повернути товар?</button>\n    <div class="faq-answer">Так, протягом 14 днів з моменту отримання.</div>\n  </div>\n</section>`,
    type: "html",
    check: (doc) => {
      const faq = doc.querySelector("section.faq");
      if (!faq) return { pass: false, message: 'Потрібна <section class="faq">.' };
      const items = faq.querySelectorAll(":scope > div.faq-item");
      if (items.length < 3) return { pass: false, message: `Потрібно щонайменше 3 <div class="faq-item">, зараз: ${items.length}.` };
      for (const item of items) {
        const q = item.querySelector("button.faq-question");
        if (!q || !q.textContent.trim()) return { pass: false, message: "Кожен .faq-item має містити <button class=\"faq-question\"> з текстом." };
        const a = item.querySelector("div.faq-answer");
        if (!a || !a.textContent.trim()) return { pass: false, message: "Кожен .faq-item має містити <div class=\"faq-answer\"> з текстом." };
      }
      return { pass: true, message: "Розмітка готова. Наступний урок CSS сховає відповіді, а JS навчить їх відкриватись за кліком." };
    },
  },
  {
    id: "frontend-5",
    title: "Проєкт: FAQ-акордеон — стилі",
    theory:
      "Другий урок акордеону: сховай відповіді за замовчуванням, і покажи їх лише для .faq-item, який отримав клас .open (цей клас додасть JS у наступному уроці). Це стандартний CSS-патерн «керування станом через клас»: сам HTML не змінюється, лише один клас на батьківському елементі перемикає видимість дочірнього.\n\ndisplay: none повністю прибирає елемент з розкладки сторінки — на відміну від visibility: hidden (елемент лишається невидимим, але й далі займає своє місце), display: none звільняє простір, ніби елемента взагалі немає.\n\n.faq-item.open .faq-answer — це СЕЛЕКТОР НАЩАДКА з двома класами: спершу .faq-item.open (елемент з ОБОМА класами одночасно, без пробілу між ними), потім пробіл і .faq-answer (будь-який нащадок усередині нього). Без пробілу між .faq-item і .open селектор означав би зовсім інше.\n\nДодай трохи стилю самій кнопці-запитанню (.faq-question), щоб вона виглядала клікабельною: cursor: pointer змінює курсор на «руку» при наведенні — важлива візуальна підказка, що елемент можна натиснути.",
    previewHTML: `<div class="faq-item"><button class="faq-question">Питання?</button><div class="faq-answer">Відповідь.</div></div><div class="faq-item open"><button class="faq-question">Друге питання?</button><div class="faq-answer">Видима відповідь.</div></div>`,
    examples: [
      { title: "Приховані відповіді, крім .open", code: `.faq-answer {\n  display: none;\n}\n\n.faq-item.open .faq-answer {\n  display: block;\n}\n\n.faq-question {\n  cursor: pointer;\n}`, explain: "Перший .faq-item (без класу open) ховає відповідь; другий (.faq-item.open) показує її через більш точний селектор." },
    ],
    presentation: [
      { title: "Керування станом через клас", points: [".faq-answer { display: none; } — сховано за замовчуванням", ".faq-item.open .faq-answer — показано, лише якщо є клас open", "HTML не змінюється — лише клас на батьківському елементі"] },
      { title: "Що далі", points: ["Наступний урок — делегування подій (загальна тема)", "Потім JS-урок навчить кнопку ДОДАВАТИ клас open по кліку", "cursor: pointer — підказка, що елемент клікабельний"] },
    ],
    task: "Сховай .faq-answer (display: none), покажи його для .faq-item.open .faq-answer (display: block), і додай .faq-question { cursor: pointer; }.",
    starter: "",
    hints: [
      ".faq-answer { display: none; } — базовий стан, схований.",
      ".faq-item.open .faq-answer (без пробілу між faq-item і open, з пробілом перед faq-answer) { display: block; }",
      ".faq-answer {\n  display: none;\n}\n.faq-item.open .faq-answer {\n  display: block;\n}\n.faq-question {\n  cursor: pointer;\n}",
    ],
    solution: `.faq-answer {\n  display: none;\n}\n\n.faq-item.open .faq-answer {\n  display: block;\n}\n\n.faq-question {\n  cursor: pointer;\n}`,
    type: "css",
    tests: [
      { re: /\.faq-answer\s*{[^}]*display\s*:\s*none/i, msg: ".faq-answer має мати display: none." },
      { re: /\.faq-item\.open\s+\.faq-answer\s*{[^}]*display\s*:\s*block/i, msg: ".faq-item.open .faq-answer має мати display: block." },
      { re: /\.faq-question\s*{[^}]*cursor\s*:\s*pointer/i, msg: ".faq-question має мати cursor: pointer." },
    ],
  },
  {
    id: "frontend-6",
    title: "Делегування подій: один обробник на список",
    theory:
      "Якщо підписати обробник кліку на КОЖЕН окремий пункт списку, код стає крихким: додаси новий пункт пізніше — забудеш підписати йому обробник, і він мовчки не спрацює. Делегування подій вирішує це елегантно: підписуєшся ОДИН РАЗ на БАТЬКІВСЬКИЙ контейнер, а всередині обробника визначаєш, по чому саме клікнули.\n\nПрацює це завдяки «спливанню» подій (event bubbling): клік на дочірньому елементі автоматично «спливає» вгору по дереву DOM аж до document, спрацьовуючи по дорозі на кожному предку, що має свій обробник. event.target — САМЕ ТОЙ елемент, по якому реально клікнули (може бути глибоко вкладеним), а this/контейнер, на якому висить обробник, лишається незмінним.\n\nevent.target.closest(\"li\") піднімається від event.target ВГОРУ по дереву, доки не знайде найближчого предка, що відповідає селектору \"li\" (або сам event.target, якщо він уже підходить) — це рятує, якщо всередині li є ще вкладені теги (span, іконка), по яких теж міг статись клік.\n\nДелегування особливо важливе для елементів, що З'ЯВЛЯЮТЬСЯ ДИНАМІЧНО (додаються через JS уже ПІСЛЯ початкового завантаження сторінки) — обробник на батьківському контейнері спрацює для НИХ теж, автоматично, без потреби підписувати новий обробник на кожен новий елемент.",
    domTemplate: `<ul class="menu"><li>Головна</li><li>Про нас</li><li>Контакти</li></ul>`,
    example: { code: `document.querySelector(".menu").addEventListener("click", (event) => {\n  const item = event.target.closest("li");\n  if (!item) return;\n  document.querySelectorAll(".menu li").forEach((li) => li.classList.remove("active"));\n  item.classList.add("active");\n});`, explain: "Один обробник на .menu ловить клік по БУДЬ-ЯКОМУ <li> всередині — навіть якщо їх додати пізніше через JS." },
    task: 'Підпишись ОДНИМ обробником на .menu: при кліку знайди клікнутий <li> через event.target.closest("li"), прибери клас "active" з УСІХ <li>, потім додай його клікнутому.',
    starter: "// document.querySelector(\".menu\").addEventListener(\"click\", (event) => {\n//   const item = event.target.closest(\"li\");\n//   ...\n// });\n",
    hints: [
      "closest(\"li\") може повернути null, якщо клікнули повз список — перевір це першим рядком.",
      "Прибери \"active\" з УСІХ li ПЕРЕД тим, як додати новий, інакше активними лишаться одразу кілька.",
      "document.querySelector(\".menu\").addEventListener(\"click\", (event) => {\n  const item = event.target.closest(\"li\");\n  if (!item) return;\n  document.querySelectorAll(\".menu li\").forEach((li) => li.classList.remove(\"active\"));\n  item.classList.add(\"active\");\n});",
    ],
    solution: `document.querySelector(".menu").addEventListener("click", (event) => {\n  const item = event.target.closest("li");\n  if (!item) return;\n  document.querySelectorAll(".menu li").forEach((li) => li.classList.remove("active"));\n  item.classList.add("active");\n});`,
    type: "js",
    testCode: `const items = document.querySelectorAll('.menu li');\nif (items.length < 3) return {pass:false, message:"Пункти .menu li не знайдені."};\nitems[0].click();\nawait new Promise(r => setTimeout(r, 0));\nif (!items[0].classList.contains('active')) return {pass:false, message:"Клік по пункту має додати йому клас 'active'."};\nitems[1].click();\nawait new Promise(r => setTimeout(r, 0));\nif (items[0].classList.contains('active')) return {pass:false, message:"Попередній пункт має втратити 'active', коли обрано новий."};\nif (!items[1].classList.contains('active')) return {pass:false, message:"Новий обраний пункт має отримати 'active'."};\nreturn {pass:true, message:"Один обробник на батьківському контейнері — і працює для будь-якої кількості пунктів, навіть доданих пізніше."};`,
  },
  {
    id: "frontend-7",
    title: "Проєкт: FAQ-акордеон — інтерактивність",
    theory:
      "Останній з трьох уроків FAQ: застосуй делегування подій із попереднього уроку до .faq. По кліку на .faq-question знайди його БАТЬКІВСЬКИЙ .faq-item (closest працює і вгору по дереву, шукаючи ПРЕДКА, а не лише саму кнопку) і перемкни на ньому клас \"open\".\n\nclassList.toggle(\"open\") — зручніший за ручний if/else: якщо клас ВЖЕ є — прибирає його, якщо немає — додає. Це саме та поведінка, що потрібна акордеону: клік по відкритому питанню має його ЗАКРИТИ, а не лишити відкритим назавжди.\n\nОпціонально (для «класичного» акордеону, де відкрите завжди лише ОДНЕ питання) можна СПОЧАТКУ прибрати \"open\" з УСІХ .faq-item, а вже ПОТІМ toggle для клікнутого — але базова версія без цього теж повністю робоча: кілька відповідей можуть бути розгорнуті одночасно, що теж прийнятний варіант UX.\n\nПеревір: питання, по якому клікнули, має ЗМІНИТИ стан (закрите → відкрите, або навпаки) — саме тому тест клікає ДВІЧІ по тому самому питанню й очікує, що воно повернеться у вихідний стан.",
    domTemplate: `<section class="faq"><div class="faq-item"><button class="faq-question">Питання 1?</button><div class="faq-answer">Відповідь 1.</div></div><div class="faq-item"><button class="faq-question">Питання 2?</button><div class="faq-answer">Відповідь 2.</div></div></section>`,
    example: { code: `document.querySelector(".faq").addEventListener("click", (event) => {\n  const question = event.target.closest(".faq-question");\n  if (!question) return;\n  const item = question.closest(".faq-item");\n  item.classList.toggle("open");\n});`, explain: "closest(\".faq-question\") ловить клік саме по кнопці запитання, а другий closest(\".faq-item\") піднімається до батьківського блока, на якому й перемикається клас." },
    task: 'Підпишись ОДНИМ обробником на .faq: при кліку на .faq-question (через closest) знайди батьківський .faq-item (event.target.closest(".faq-question").closest(".faq-item")) і виклич classList.toggle("open") на ньому.',
    starter: "// document.querySelector(\".faq\").addEventListener(\"click\", (event) => {\n//   const question = event.target.closest(\".faq-question\");\n//   ...\n// });\n",
    hints: [
      "Спочатку знайди question = event.target.closest(\".faq-question\"); якщо null — вийди (return).",
      "item = question.closest(\".faq-item\"); item.classList.toggle(\"open\")",
      "document.querySelector(\".faq\").addEventListener(\"click\", (event) => {\n  const question = event.target.closest(\".faq-question\");\n  if (!question) return;\n  const item = question.closest(\".faq-item\");\n  item.classList.toggle(\"open\");\n});",
    ],
    solution: `document.querySelector(".faq").addEventListener("click", (event) => {\n  const question = event.target.closest(".faq-question");\n  if (!question) return;\n  const item = question.closest(".faq-item");\n  item.classList.toggle("open");\n});`,
    type: "js",
    testCode: `const firstQuestion = document.querySelector('.faq-item .faq-question');\nconst firstItem = document.querySelector('.faq-item');\nif (!firstQuestion || !firstItem) return {pass:false, message:".faq-item/.faq-question не знайдені."};\nfirstQuestion.click();\nawait new Promise(r => setTimeout(r, 0));\nif (!firstItem.classList.contains('open')) return {pass:false, message:"Клік по запитанню має додати класу 'open' батьківському .faq-item."};\nfirstQuestion.click();\nawait new Promise(r => setTimeout(r, 0));\nif (firstItem.classList.contains('open')) return {pass:false, message:"Повторний клік має ПРИБРАТИ клас 'open' (toggle, а не завжди add)."};\nreturn {pass:true, message:"Готово — FAQ-акордеон твого сайту тепер по-справжньому відкривається й закривається за кліком."};`,
  },
  {
    id: "frontend-8",
    title: "CSS Grid: базова сітка",
    theory:
      "CSS Grid — інструмент для ДВОВИМІРНОЇ верстки: рядки Й стовпці одночасно, на відміну від однонапрямкового Flexbox. display: grid перетворює елемент на grid-контейнер, а grid-template-columns визначає, скільки стовпців буде й якої вони ширини.\n\nrepeat(2, 1fr) — скорочення для \"1fr 1fr\": створює 2 стовпці ОДНАКОВОЇ ширини. fr (fraction, «частка») — спеціальна одиниця Grid: ділить вільний простір на частки пропорційно вказаним числам, а не в пікселях чи відсотках — тому сітка автоматично підлаштовується під ширину контейнера.\n\nКоли елементів БІЛЬШЕ, ніж стовпців (наприклад, 4 елементи в сітці з 2 стовпцями), Grid САМ переносить надлишок на НОВИЙ РЯДОК — на відміну від Flexbox, де для цього потрібен був окремий flex-wrap.\n\ngap працює в Grid так само, як у Flexbox: одна властивість замінює margin на кожному елементі, і однаково діє і між рядками, і між стовпцями. Найпоширеніший, «типовий» приклад використання Grid у реальних сайтах — саме сітка карток товарів чи послуг, де repeat() і gap разом дають акуратну, рівномірну розкладку буквально за два рядки CSS.",
    previewHTML: `<div class="grid-demo"><div>1</div><div>2</div><div>3</div><div>4</div></div>`,
    examples: [
      { title: "Сітка з 2 стовпців", code: `.grid-demo {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}`, explain: "4 елементи автоматично розкладуться у 2 рядки по 2 стовпці — Grid сам переносить надлишок." },
      { title: "Нерівні стовпці", code: `.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n}`, explain: "Перший стовпець — фіксовані 200px (наприклад, sidebar), другий — усе, що лишилось (1fr)." },
    ],
    presentation: [
      { title: "Grid проти Flexbox", points: ["Flexbox — один напрямок (ряд АБО стовпець)", "Grid — два виміри одночасно (рядки Й стовпці)", "Grid сам переносить надлишок елементів на новий рядок"] },
      { title: "repeat() і fr", points: ["repeat(2, 1fr) = \"1fr 1fr\" — 2 однакові стовпці", "fr ділить вільний простір пропорційно, адаптивно", "gap працює так само, як у Flexbox"] },
    ],
    task: "Стилізуй .grid-demo: display: grid, grid-template-columns: repeat(2, 1fr), gap.",
    starter: "",
    hints: ["display: grid — перша й обов'язкова властивість.", "repeat(2, 1fr) створює 2 стовпці однакової ширини.", ".grid-demo {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}"],
    solution: `.grid-demo {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}`,
    type: "css",
    tests: [
      { re: /\.grid-demo\s*{[^}]*display\s*:\s*grid/i, msg: ".grid-demo має мати display: grid." },
      { re: /\.grid-demo\s*{[^}]*grid-template-columns\s*:\s*repeat\(\s*2\s*,\s*1fr\s*\)/i, msg: ".grid-demo має мати grid-template-columns: repeat(2, 1fr)." },
      { re: /\.grid-demo\s*{[^}]*gap\s*:\s*[^;]+;/i, msg: ".grid-demo має мати gap." },
    ],
  },
  {
    id: "frontend-9",
    title: "CSS Grid: іменовані області",
    theory:
      "grid-template-areas дозволяє описати макет сторінки буквально «намалювавши» його текстом: кожен рядок у лапках — це один рядок сітки, а слова в ньому — назви областей, які там мають опинитись. Однакова назва в кількох клітинках поспіль об'єднує їх в один блок.\n\ngrid-area на дочірньому елементі каже: «я — саме ця іменована область» — назва має ТОЧНО збігатись зі словом у grid-template-areas. Порядок елементів у HTML більше НЕ визначає їхнє розташування на екрані — розташування повністю задає CSS, що дуже зручно для адаптивності: на мобільному можна повністю переставити макет, лише переписавши grid-template-areas, без зміни жодного рядка HTML.\n\nКласичний макет \"header header\" / \"sidebar main\" / \"footer footer\" — це header і footer розтягнуті на всю ширину (двічі повторена назва в рядку), а sidebar і main ділять середній рядок навпіл.\n\nЦей прийом особливо цінний для СКЛАДНИХ макетів (адмін-панелі, дашборди), де просто repeat()-сітки вже не досить — колонки мають РІЗНУ роль, а не просто однакову ширину.",
    previewHTML: `<div class="layout"><div class="lh">Header</div><div class="ls">Sidebar</div><div class="lm">Main</div><div class="lf">Footer</div></div>`,
    examples: [
      { title: "Класичний макет з sidebar", code: `.layout {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n}\n.lh { grid-area: header; }\n.ls { grid-area: sidebar; }\n.lm { grid-area: main; }\n.lf { grid-area: footer; }`, explain: "header і footer розтягнуті на обидва стовпці (повторена назва), sidebar і main ділять середній рядок." },
    ],
    presentation: [
      { title: "grid-template-areas", points: ["Кожен рядок у лапках — рядок сітки", "Однакова назва поспіль об'єднує клітинки в один блок", "«Малює» макет текстом, читабельно без коментарів"] },
      { title: "grid-area", points: ["На дочірньому елементі — назва відповідної області", "Розташування задає CSS, а не порядок у HTML", "Зручно міняти макет для адаптивності без зміни HTML"] },
    ],
    task: 'Створи .layout з display: grid і grid-template-areas: "header header" / "sidebar main" / "footer footer" (три рядки в лапках), і задай .lh, .ls, .lm, .lf відповідні grid-area.',
    starter: "",
    hints: [
      'grid-template-areas: "header header"\\n    "sidebar main"\\n    "footer footer"; — три рядки в лапках, кожен на новому рядку.',
      "Кожен клас (.lh/.ls/.lm/.lf) отримує СВОЮ властивість grid-area з відповідною назвою.",
      '.layout {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n}\n.lh { grid-area: header; }\n.ls { grid-area: sidebar; }\n.lm { grid-area: main; }\n.lf { grid-area: footer; }',
    ],
    solution: `.layout {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n}\n.lh { grid-area: header; }\n.ls { grid-area: sidebar; }\n.lm { grid-area: main; }\n.lf { grid-area: footer; }`,
    type: "css",
    tests: [
      { re: /\.layout\s*{[^}]*display\s*:\s*grid/i, msg: ".layout має мати display: grid." },
      { re: /grid-template-areas\s*:\s*"header header"\s*"sidebar main"\s*"footer footer"/i, msg: 'grid-template-areas має бути "header header" "sidebar main" "footer footer" (три рядки).' },
      { re: /\.lh\s*{[^}]*grid-area\s*:\s*header/i, msg: ".lh має мати grid-area: header." },
      { re: /\.ls\s*{[^}]*grid-area\s*:\s*sidebar/i, msg: ".ls має мати grid-area: sidebar." },
      { re: /\.lm\s*{[^}]*grid-area\s*:\s*main/i, msg: ".lm має мати grid-area: main." },
      { re: /\.lf\s*{[^}]*grid-area\s*:\s*footer/i, msg: ".lf має мати grid-area: footer." },
    ],
  },
  {
    id: "frontend-10",
    title: "Респонсивні зображення: srcset і sizes",
    theory:
      "Один і той самий src=\"photo.jpg\" завантажується ОДНАКОВО важким на величезному моніторі й на маленькому телефоні — хоча телефону вистачило б зображення вчетверо меншого розміру. srcset дозволяє запропонувати браузеру КІЛЬКА варіантів того самого зображення різної ширини, а браузер сам обере, який завантажити.\n\nФормат srcset: список \"файл ширина_в_w\" через кому — 400w означає «це зображення завширшки 400 пікселів» (w — не одиниця виміру CSS, а спеціальний дескриптор ширини лише для srcset).\n\nsizes каже браузеру, ЯКОГО РОЗМІРУ буде показане зображення НА СТОРІНЦІ за різних умов екрана — (max-width: 600px) 400px означає «на екранах до 600px зображення займає 400px», а останнє значення без умови (800px) — це варіант «за замовчуванням» для всіх решти екранів.\n\nМаючи ОБИДВА атрибути, браузер сам вираховує: «на цьому екрані зображення покаже 400px → візьму варіант 400w, він найближчий і найлегший» — javaScript чи сервер для цього не потрібні. src лишається обов'язковим як запасний варіант для браузерів, що не підтримують srcset (таких практично не лишилось, але стандарт вимагає резерву).",
    examples: [
      { title: "Зображення з двома варіантами розміру", code: `<img\n  src="photo-800.jpg"\n  srcset="photo-400.jpg 400w, photo-800.jpg 800w"\n  sizes="(max-width: 600px) 400px, 800px"\n  alt="Товар на білому фоні">`, explain: "На вузьких екранах (до 600px) браузер завантажить легший photo-400.jpg замість повного photo-800.jpg." },
    ],
    presentation: [
      { title: "srcset", points: ["Список варіантів того самого зображення різної ширини", "Формат: \"файл ширина_w\" через кому", "Браузер сам обирає найдоречніший варіант"] },
      { title: "sizes", points: ["Каже, якого розміру буде зображення НА СТОРІНЦІ", "(max-width: 600px) 400px, 800px — умова, потім значення за замовчуванням", "Разом з srcset дає економію трафіку без жодного JS"] },
    ],
    task: 'Створи <img> з src="photo-800.jpg", srcset="photo-400.jpg 400w, photo-800.jpg 800w", sizes="(max-width: 600px) 400px, 800px" і alt з описом.',
    starter: "",
    hints: [
      'srcset — рядок з двома варіантами через кому, кожен з дескриптором ширини (400w, 800w).',
      'sizes визначає розмір НА СТОРІНЦІ за умовою екрана.',
      '<img src="photo-800.jpg" srcset="photo-400.jpg 400w, photo-800.jpg 800w" sizes="(max-width: 600px) 400px, 800px" alt="Товар на білому фоні">',
    ],
    solution: `<img src="photo-800.jpg" srcset="photo-400.jpg 400w, photo-800.jpg 800w" sizes="(max-width: 600px) 400px, 800px" alt="Товар на білому фоні">`,
    type: "html",
    check: (doc) => {
      const img = doc.querySelector("img");
      if (!img) return { pass: false, message: "Потрібен <img>." };
      const srcset = img.getAttribute("srcset") || "";
      if (!srcset.includes("400w") || !srcset.includes("800w")) return { pass: false, message: "srcset має містити обидва варіанти: 400w і 800w." };
      const sizes = img.getAttribute("sizes") || "";
      if (!sizes.includes("600px")) return { pass: false, message: "sizes має містити умову для max-width: 600px." };
      if (!img.getAttribute("alt")) return { pass: false, message: "img має мати непорожній alt." };
      return { pass: true, message: "Тепер мобільні пристрої завантажують легший файл — швидший сайт БЕЗ жодного рядка JavaScript." };
    },
  },
  {
    id: "frontend-11",
    title: "Проєкт: галерея зображень — розмітка",
    theory:
      "Перший з трьох уроків галереї: сітка мініатюр, яку в наступному JS-уроці ти зробиш клікабельною (лайтбокс — збільшене зображення поверх сторінки). Структура проста: контейнер <section class=\"gallery\">, усередині — кілька <img class=\"gallery-item\">.\n\nКожен <img> обов'язково потребує alt — тут особливо важливо, бо в лайтбоксі (наступний JS-урок) саме src клікнутого зображення визначає, ЩО показати збільшеним; без валідного src посилання лайтбокс показуватиме биту картинку.\n\nЧому саме img напряму як .gallery-item, а не img усередині окремого div, як у картках товарів (html-42)? Для галереї МІНІМАЛЬНА структура — сам img — цілком достатня: CSS Grid (наступний урок) може стилізувати сітку прямо з img, без зайвої обгортки, коли немає підпису чи ціни під кожним зображенням.",
    examples: [
      { title: "Галерея з 4 зображень", code: `<section class="gallery">\n  <img class="gallery-item" src="photo1.jpg" alt="Захід сонця над морем">\n  <img class="gallery-item" src="photo2.jpg" alt="Гори у тумані">\n  <img class="gallery-item" src="photo3.jpg" alt="Ліс восени">\n  <img class="gallery-item" src="photo4.jpg" alt="Місто вночі">\n</section>`, explain: "Чотири однакові за структурою .gallery-item — CSS Grid розкладе їх у рівну сітку наступним уроком." },
    ],
    presentation: [
      { title: "Мінімальна структура галереї", points: ["Контейнер .gallery, усередині — кілька .gallery-item (img)", "Кожен img потребує src і непорожній alt", "Наступні уроки: CSS-сітка, потім JS-лайтбокс"] },
    ],
    task: 'Створи в main <section class="gallery"> з щонайменше 4 <img class="gallery-item"> (кожен з src і alt).',
    starter: "",
    hints: [
      'Зовнішній контейнер — <section class="gallery">.',
      "Кожен img — клас gallery-item, src і alt обов'язкові.",
      '<section class="gallery">\n  <img class="gallery-item" src="a.jpg" alt="Опис">\n  ...\n</section>',
    ],
    solution: `<section class="gallery">\n  <img class="gallery-item" src="photo1.jpg" alt="Захід сонця над морем">\n  <img class="gallery-item" src="photo2.jpg" alt="Гори у тумані">\n  <img class="gallery-item" src="photo3.jpg" alt="Ліс восени">\n  <img class="gallery-item" src="photo4.jpg" alt="Нічне місто">\n</section>`,
    type: "html",
    check: (doc) => {
      const gallery = doc.querySelector("section.gallery");
      if (!gallery) return { pass: false, message: 'Потрібна <section class="gallery">.' };
      const items = gallery.querySelectorAll(":scope > img.gallery-item");
      if (items.length < 4) return { pass: false, message: `Потрібно щонайменше 4 <img class="gallery-item">, зараз: ${items.length}.` };
      for (const img of items) {
        if (!img.getAttribute("src") || !img.getAttribute("alt")) return { pass: false, message: "Кожен .gallery-item має мати src і непорожній alt." };
      }
      return { pass: true, message: "Сітка мініатюр готова. Наступний CSS-урок розкладе їх рівною сіткою, а JS — додасть лайтбокс." };
    },
  },
  {
    id: "frontend-12",
    title: "Проєкт: галерея зображень — стилі й hover",
    theory:
      "Другий урок галереї: перетвори .gallery на CSS Grid (як в уроці про базову сітку) і додай ефект наведення (hover) на мініатюри — стандартна ознака «це можна клікнути» в будь-якій сучасній галереї.\n\nobject-fit: cover на самих <img> вирішує типову проблему сітки зображень: якщо фото мають РІЗНІ пропорції (одне квадратне, інше витягнуте), задане через CSS width/height обрізає їх НЕРІВНОМІРНО, спотворюючи пропорції. object-fit: cover заповнює задану рамку, обрізаючи зайве, але НЕ розтягуючи зображення — так усі мініатюри виглядають однаково акуратно, хай оригінали й різні за формою.\n\n:hover — псевдоклас, що застосовує стиль, ПОКИ курсор наведений на елемент (для сенсорних екранів без миші hover просто ніколи не спрацьовує, і це нормально — це «бонусний» ефект, а не критична функціональність). transform: scale(1.05) трохи збільшує зображення (на 5%), transition (детальніше — за кілька уроків) робить це збільшення ПЛАВНИМ, а не миттєвим стрибком.",
    previewHTML: `<div class="gallery"><img class="gallery-item" src="a.jpg" alt="1"><img class="gallery-item" src="b.jpg" alt="2"><img class="gallery-item" src="c.jpg" alt="3"></div>`,
    examples: [
      { title: "Сітка й hover-ефект", code: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n\n.gallery-item {\n  width: 100%;\n  height: 150px;\n  object-fit: cover;\n  cursor: pointer;\n}\n\n.gallery-item:hover {\n  transform: scale(1.05);\n}`, explain: "object-fit: cover робить усі мініатюри однаково акуратними, hover трохи збільшує ту, на яку навела курсор." },
    ],
    presentation: [
      { title: "object-fit: cover", points: ["Заповнює задану рамку, обрізаючи зайве", "НЕ розтягує зображення непропорційно", "Стандартний вибір для сіток з фото різних пропорцій"] },
      { title: ":hover ефект", points: [":hover застосовується, поки курсор наведений", "transform: scale() трохи збільшує елемент", "Візуальна підказка «це клікабельне зображення»"] },
    ],
    task: "Стилізуй .gallery (display: grid, grid-template-columns: repeat(3, 1fr), gap), .gallery-item (object-fit: cover, cursor: pointer) і .gallery-item:hover (transform: scale з числом більшим за 1).",
    starter: "",
    hints: [
      "Три окремі правила: .gallery, .gallery-item, .gallery-item:hover.",
      "object-fit: cover обов'язково на самому .gallery-item, не на .gallery.",
      ".gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n.gallery-item {\n  object-fit: cover;\n  cursor: pointer;\n}\n.gallery-item:hover {\n  transform: scale(1.05);\n}",
    ],
    solution: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n\n.gallery-item {\n  width: 100%;\n  height: 150px;\n  object-fit: cover;\n  cursor: pointer;\n}\n\n.gallery-item:hover {\n  transform: scale(1.05);\n}`,
    type: "css",
    tests: [
      { re: /\.gallery\s*{[^}]*display\s*:\s*grid/i, msg: ".gallery має мати display: grid." },
      { re: /\.gallery\s*{[^}]*grid-template-columns\s*:\s*repeat\(\s*3\s*,\s*1fr\s*\)/i, msg: ".gallery має мати grid-template-columns: repeat(3, 1fr)." },
      { re: /\.gallery-item\s*{[^}]*object-fit\s*:\s*cover/i, msg: ".gallery-item має мати object-fit: cover." },
      { re: /\.gallery-item:hover\s*{[^}]*transform\s*:\s*scale/i, msg: ".gallery-item:hover має мати transform: scale(...)." },
    ],
  },
  {
    id: "frontend-13",
    title: "Проєкт: галерея зображень — лайтбокс",
    theory:
      "Фінальний урок галереї: клік на мініатюру відкриває ЛАЙТБОКС — темний оверлей на весь екран зі збільшеним зображенням і кнопкою закриття. Це патерн, зустрічний у майже кожній сучасній фотогалереї в інтернеті.\n\nОскільки лайтбокс не існує в HTML заздалегідь, весь патерн такий самий, як у back-to-top кнопці (js-41): createElement, задати потрібні атрибути/клас, appendChild у document.body. Ключова відмінність тут — картинку ВСЕРЕДИНІ лайтбоксу треба створити ЗАНОВО з src саме ТІЄЇ мініатюри, по якій клікнули (event.target.src, якщо делегування підписане на .gallery).\n\nКнопка закриття (.lightbox-close) видаляє лайтбокс зі сторінки через remove() — цей метод прибирає елемент з DOM повністю, на відміну від приховування через display: none (тут лайтбокс не потрібен взагалі, доки не клікнули на нове зображення — простіше створювати заново щоразу).\n\nДелегування (з окремого уроку) тут доречне так само, як і в акордеоні: один обробник на .gallery ловить клік по БУДЬ-ЯКІЙ мініатюрі, а event.target усередині обробника — це і є клікнутий <img>, з якого береться .src.",
    domTemplate: `<section class="gallery"><img class="gallery-item" src="photo1.jpg" alt="Перше фото"><img class="gallery-item" src="photo2.jpg" alt="Друге фото"></section>`,
    example: { code: `document.querySelector(".gallery").addEventListener("click", (event) => {\n  if (!event.target.classList.contains("gallery-item")) return;\n  const overlay = document.createElement("div");\n  overlay.className = "lightbox";\n  const bigImg = document.createElement("img");\n  bigImg.src = event.target.src;\n  const closeBtn = document.createElement("button");\n  closeBtn.className = "lightbox-close";\n  closeBtn.textContent = "✕";\n  closeBtn.addEventListener("click", () => overlay.remove());\n  overlay.appendChild(bigImg);\n  overlay.appendChild(closeBtn);\n  document.body.appendChild(overlay);\n});`, explain: "Клік по мініатюрі створює новий overlay з великим зображенням і кнопкою закриття, яка видаляє весь overlay через remove()." },
    task: 'Підпишись на .gallery: при кліку на елемент з класом "gallery-item" створи <div class="lightbox"> з великим <img> (src = event.target.src) і <button class="lightbox-close">, що видаляє lightbox через remove(). Додай lightbox у document.body.',
    starter: "// document.querySelector(\".gallery\").addEventListener(\"click\", (event) => {\n//   if (!event.target.classList.contains(\"gallery-item\")) return;\n//   ...\n// });\n",
    hints: [
      "Перевір event.target.classList.contains(\"gallery-item\") — якщо клікнули повз мініатюру, нічого не роби.",
      "createElement для overlay, img усередині нього (src з event.target.src) і button з class=\"lightbox-close\", що по кліку викликає overlay.remove().",
      "document.querySelector(\".gallery\").addEventListener(\"click\", (event) => {\n  if (!event.target.classList.contains(\"gallery-item\")) return;\n  const overlay = document.createElement(\"div\");\n  overlay.className = \"lightbox\";\n  const bigImg = document.createElement(\"img\");\n  bigImg.src = event.target.src;\n  const closeBtn = document.createElement(\"button\");\n  closeBtn.className = \"lightbox-close\";\n  closeBtn.textContent = \"✕\";\n  closeBtn.addEventListener(\"click\", () => overlay.remove());\n  overlay.appendChild(bigImg);\n  overlay.appendChild(closeBtn);\n  document.body.appendChild(overlay);\n});",
    ],
    solution: `document.querySelector(".gallery").addEventListener("click", (event) => {\n  if (!event.target.classList.contains("gallery-item")) return;\n  const overlay = document.createElement("div");\n  overlay.className = "lightbox";\n  const bigImg = document.createElement("img");\n  bigImg.src = event.target.src;\n  const closeBtn = document.createElement("button");\n  closeBtn.className = "lightbox-close";\n  closeBtn.textContent = "✕";\n  closeBtn.addEventListener("click", () => overlay.remove());\n  overlay.appendChild(bigImg);\n  overlay.appendChild(closeBtn);\n  document.body.appendChild(overlay);\n});`,
    type: "js",
    testCode: `const thumbs = document.querySelectorAll('.gallery-item');\nif (thumbs.length < 2) return {pass:false, message:".gallery-item не знайдені."};\nthumbs[0].click();\nawait new Promise(r => setTimeout(r, 0));\nconst overlay = document.querySelector('.lightbox');\nif (!overlay) return {pass:false, message:"Клік по мініатюрі має створити .lightbox."};\nconst bigImg = overlay.querySelector('img');\nif (!bigImg || !bigImg.src.includes('photo1.jpg')) return {pass:false, message:"Зображення в лайтбоксі має мати src клікнутої мініатюри (photo1.jpg)."};\nconst closeBtn = overlay.querySelector('.lightbox-close');\nif (!closeBtn) return {pass:false, message:"Потрібна кнопка .lightbox-close всередині лайтбоксу."};\ncloseBtn.click();\nawait new Promise(r => setTimeout(r, 0));\nif (document.querySelector('.lightbox')) return {pass:false, message:"Клік по .lightbox-close має ВИДАЛИТИ лайтбокс зі сторінки."};\nreturn {pass:true, message:"Готово — галерея твого сайту тепер відкриває збільшене фото за кліком, точно як у справжніх фотогалереях."};`,
  },
  {
    id: "frontend-14",
    title: "Lazy loading: завантаження зображень за потребою",
    theory:
      "На довгій сторінці з десятками зображень браузер за замовчуванням завантажує ВСІ одразу, навіть ті, що глибоко внизу й користувач, можливо, ніколи до них не долистає — марна витрата трафіку й часу завантаження. Атрибут loading=\"lazy\" відкладає завантаження зображення, ДОКИ воно не наблизиться до видимої області екрана.\n\nЦе НАТИВНА можливість браузера — жодного JavaScript чи бібліотек не потрібно, достатньо одного атрибута на тегу img. Підтримується всіма сучасними браузерами вже кілька років.\n\nВажливе застереження: loading=\"lazy\" НЕ варто ставити на зображення, які видно одразу при завантаженні сторінки (наприклад, у hero-секції) — для них lazy loading лише СПОВІЛЬНИТЬ появу, бо браузер спочатку має визначити, що елемент близько до екрана. lazy має сенс лише для зображень, розташованих НИЖЧЕ початкового екрана.\n\nІснує ще протилежне значення — loading=\"eager\" (завантажити одразу, за замовчуванням) — його рідко пишуть явно, бо це поведінка браузера й без атрибута, але деякі стилі коду вказують його явно для наочності, що це свідомий вибір, а не забутий атрибут.",
    examples: [
      { title: "Зображення нижче видимої області", code: `<img src="footer-banner.jpg" alt="Банер унизу сторінки" loading="lazy">`, explain: "Це зображення завантажиться лише тоді, коли користувач прогорне сторінку достатньо близько до нього." },
      { title: "Hero-зображення — БЕЗ lazy", code: `<img src="hero.jpg" alt="Головне зображення" loading="eager">`, explain: "Видиме одразу при завантаженні — lazy тут лише сповільнив би появу." },
    ],
    presentation: [
      { title: "loading=\"lazy\"", points: ["Відкладає завантаження, доки зображення не наблизиться до екрана", "Нативна можливість браузера — без JS чи бібліотек", "Економить трафік на довгих сторінках з багатьма фото"] },
      { title: "Коли НЕ використовувати", points: ["Ніколи для зображень, видимих одразу (hero, шапка)", "Там lazy лише сповільнює появу", "Має сенс лише нижче початкового екрана"] },
    ],
    task: 'Створи <img> з src="footer-banner.jpg", alt з описом, і loading="lazy".',
    starter: "",
    hints: ['loading — окремий атрибут, значення "lazy" в лапках.', "Не забудь непорожній alt.", '<img src="footer-banner.jpg" alt="Банер унизу сторінки" loading="lazy">'],
    solution: `<img src="footer-banner.jpg" alt="Банер унизу сторінки" loading="lazy">`,
    type: "html",
    check: (doc) => {
      const img = doc.querySelector("img");
      if (!img) return { pass: false, message: "Потрібен <img>." };
      if (img.getAttribute("loading") !== "lazy") return { pass: false, message: 'Потрібен атрибут loading="lazy".' };
      if (!img.getAttribute("alt")) return { pass: false, message: "img має мати непорожній alt." };
      return { pass: true, message: "loading=\"lazy\" — один атрибут, який економить трафік на будь-якій сторінці з багатьма зображеннями." };
    },
  },
  {
    id: "frontend-15",
    title: "fieldset, legend і autocomplete у формах",
    theory:
      "fieldset групує ПОВ'ЯЗАНІ поля форми в один візуальний і семантичний блок (наприклад, «контактні дані»: ім'я + email), а legend — заголовок цієї групи, перший видимий текст усередині fieldset. Скрінрідер оголошує legend ПЕРЕД кожним полем усередині — тому людина, що не бачить форму, розуміє КОНТЕКСТ («контактні дані: ім'я»), а не просто «ім'я» без пояснення, до чого воно.\n\nautocomplete підказує браузеру, ЯКОГО типу дані очікуються в конкретному полі, щоб браузер міг ЗАПРОПОНУВАТИ автозаповнення зі збережених даних користувача: autocomplete=\"name\" для імені, autocomplete=\"email\" для пошти, autocomplete=\"tel\" для телефону. Це дрібниця, яка суттєво прискорює заповнення форми на мобільних пристроях, де набирати текст незручно.\n\nБез autocomplete браузер намагається вгадати тип поля сам (за допомогою name чи type), і часто вгадує правильно — але явний atomcomplete прибирає будь-яку двозначність і працює надійніше, особливо для нестандартно названих полів.\n\nfieldset за замовчуванням має власну рамку (border) — це стиль браузера за замовчуванням, який пізніше можна прибрати чи змінити своїм CSS, як і будь-який інший елемент.",
    examples: [
      { title: "Група контактних полів", code: `<fieldset>\n  <legend>Контактні дані</legend>\n  <label for="fname">Ім'я</label>\n  <input id="fname" type="text" autocomplete="name">\n  <label for="femail">Email</label>\n  <input id="femail" type="email" autocomplete="email">\n</fieldset>`, explain: "legend оголошується скрінрідером перед кожним полем усередині — контекст «контактні дані» не губиться." },
    ],
    presentation: [
      { title: "fieldset + legend", points: ["Групують ПОВ'ЯЗАНІ поля форми разом", "legend — заголовок групи, перший текст усередині", "Скрінрідер оголошує legend перед кожним полем групи"] },
      { title: "autocomplete", points: ["Підказує браузеру ТИП очікуваних даних", "\"name\", \"email\", \"tel\" — найпоширеніші значення", "Прискорює заповнення форми на мобільних"] },
    ],
    task: 'Створи <fieldset> з <legend>Контактні дані</legend>, і всередині — input з autocomplete="name" та input type="email" з autocomplete="email".',
    starter: "",
    hints: [
      "legend — ПЕРШИЙ елемент усередині fieldset.",
      "Обидва input мають свій autocomplete: name і email відповідно.",
      '<fieldset>\n  <legend>Контактні дані</legend>\n  <input type="text" autocomplete="name">\n  <input type="email" autocomplete="email">\n</fieldset>',
    ],
    solution: `<fieldset>\n  <legend>Контактні дані</legend>\n  <label for="fname">Ім'я</label>\n  <input id="fname" type="text" autocomplete="name">\n  <label for="femail">Email</label>\n  <input id="femail" type="email" autocomplete="email">\n</fieldset>`,
    type: "html",
    check: (doc) => {
      const fs = doc.querySelector("fieldset");
      if (!fs) return { pass: false, message: "Потрібен <fieldset>." };
      const legend = fs.querySelector("legend");
      if (!legend || legend.textContent.trim() !== "Контактні дані") return { pass: false, message: 'Потрібен <legend>Контактні дані</legend> усередині fieldset.' };
      const nameInput = fs.querySelector('input[autocomplete="name"]');
      if (!nameInput) return { pass: false, message: 'Потрібен input з autocomplete="name".' };
      const emailInput = fs.querySelector('input[type="email"][autocomplete="email"]');
      if (!emailInput) return { pass: false, message: 'Потрібен input type="email" з autocomplete="email".' };
      return { pass: true, message: "fieldset/legend і autocomplete разом роблять форму зрозумілішою і для скрінрідера, і для автозаповнення браузера." };
    },
  },
  {
    id: "frontend-16",
    title: "Проєкт: контактна форма — розмітка",
    theory:
      "Перший з трьох уроків форми зворотного зв'язку з валідацією — реальнішої за просту форму з html-8, бо тут перевіряється не одне поле, а декілька, з ЗВОРОТНИМ ЗВ'ЯЗКОМ про помилку чи успіх.\n\nСтруктура: <section class=\"contact-form\">, усередині — <form>, у формі — поле імені (input type=\"text\", клас \"name-input\"), поле пошти (input type=\"email\", клас \"email-input\"), кнопка відправки (button type=\"submit\"), і ПОРОЖНІЙ <p class=\"form-message\"></p> для майбутнього повідомлення (наступні уроки заповнять його текстом і кольором).\n\nОбидва input мають required — це вбудована HTML-валідація: браузер сам заблокує відправку форми з порожнім обов'язковим полем, показавши стандартну підказку, ще ДО того, як спрацює будь-який JS. Це «перша лінія захисту», а JS-валідація (третій урок) — «друга лінія», яка додає ВЛАСНЕ, кастомне повідомлення замість браузерного.\n\nФіксовані класи .contact-form / .name-input / .email-input / .form-message — знову ж, для наступних CSS і JS уроків, незалежно від того, як саме ти сформулюєш підписи (label) полів.",
    examples: [
      { title: "Форма зворотного зв'язку", code: `<section class="contact-form">\n  <form>\n    <label for="c-name">Ім'я</label>\n    <input id="c-name" class="name-input" type="text" required>\n    <label for="c-email">Email</label>\n    <input id="c-email" class="email-input" type="email" required>\n    <button type="submit">Надіслати</button>\n    <p class="form-message"></p>\n  </form>\n</section>`, explain: "form-message спочатку ПОРОЖНІЙ — JS-урок заповнить його текстом лише після спроби відправки." },
    ],
    presentation: [
      { title: "Структура форми", points: [".contact-form > form з іменем, поштою, кнопкою submit", "Обидва input — required (вбудована HTML-валідація)", "Порожній .form-message — заповнюється лише JS-ом"] },
      { title: "Що далі", points: ["CSS-урок додасть стилі станів помилки/успіху", "JS-урок додасть власну валідацію й повідомлення", "Фіксовані класи — щоб наступні уроки знайшли ці поля"] },
    ],
    task: 'Створи в main <section class="contact-form"> з <form> усередині: input class="name-input" type="text" required, input class="email-input" type="email" required, button type="submit", і порожній p class="form-message".',
    starter: "",
    hints: [
      "form лежить усередині section.contact-form.",
      "Обидва input — required; p.form-message лишається без тексту.",
      '<section class="contact-form">\n  <form>\n    <input class="name-input" type="text" required>\n    <input class="email-input" type="email" required>\n    <button type="submit">Надіслати</button>\n    <p class="form-message"></p>\n  </form>\n</section>',
    ],
    solution: `<section class="contact-form">\n  <form>\n    <label for="c-name">Ім'я</label>\n    <input id="c-name" class="name-input" type="text" required>\n    <label for="c-email">Email</label>\n    <input id="c-email" class="email-input" type="email" required>\n    <button type="submit">Надіслати</button>\n    <p class="form-message"></p>\n  </form>\n</section>`,
    type: "html",
    check: (doc) => {
      const section = doc.querySelector("section.contact-form");
      if (!section) return { pass: false, message: 'Потрібна <section class="contact-form">.' };
      const form = section.querySelector("form");
      if (!form) return { pass: false, message: "Усередині .contact-form потрібна <form>." };
      const nameInput = form.querySelector("input.name-input");
      if (!nameInput || !nameInput.hasAttribute("required")) return { pass: false, message: 'Потрібен input class="name-input" з required.' };
      const emailInput = form.querySelector('input.email-input[type="email"]');
      if (!emailInput || !emailInput.hasAttribute("required")) return { pass: false, message: 'Потрібен input class="email-input" type="email" з required.' };
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return { pass: false, message: 'Потрібна button type="submit".' };
      const msg = form.querySelector("p.form-message");
      if (!msg) return { pass: false, message: 'Потрібен порожній <p class="form-message">.' };
      return { pass: true, message: "Форма готова. Наступний CSS-урок додасть стилі для стану помилки й успіху, JS — саму логіку валідації." };
    },
  },
  {
    id: "frontend-17",
    title: "Проєкт: контактна форма — стани помилки й успіху",
    theory:
      "Другий урок форми: підготуй ДВА візуальні стани для .form-message — .error (щось пішло не так, зазвичай червоний) і .success (усе гаразд, зазвичай зелений). JS у наступному уроці буде лише ДОДАВАТИ потрібний клас — весь ВИГЛЯД визначає CSS, а не JS.\n\nЦе розділення відповідальності — гарна практика: JS вирішує ЩО сталось (помилка чи успіх) і ЯКИЙ текст показати, а CSS вирішує ЯК це виглядає (колір, фон, іконка). Якщо пізніше захочеш змінити відтінок червоного — правиш лише CSS, не чіпаючи логіку JS.\n\n.form-message.error і .form-message.success — обидва селектори БЕЗ пробілу між .form-message і класом стану (елемент має ОБИДВА класи одночасно: базовий form-message і стан error АБО success).\n\nДодай трохи padding і border-radius для обох станів, щоб повідомлення виглядало як помітний, акуратний блок, а не просто кольоровий текст урозрив з рештою форми.",
    previewHTML: `<p class="form-message error">Заповніть усі поля.</p><p class="form-message success">Дякуємо за звернення!</p>`,
    examples: [
      { title: "Стилі для error і success", code: `.form-message.error {\n  color: #b91c1c;\n  background-color: #fee2e2;\n  padding: 8px 12px;\n  border-radius: 6px;\n}\n\n.form-message.success {\n  color: #15803d;\n  background-color: #dcfce7;\n  padding: 8px 12px;\n  border-radius: 6px;\n}`, explain: "Обидва стани мають однакову структуру стилю (padding, border-radius), але різний колір — червоний для помилки, зелений для успіху." },
    ],
    presentation: [
      { title: "Розділення відповідальності", points: ["JS вирішує ЩО сталось і ЯКИЙ текст показати", "CSS вирішує ЯК це виглядає (колір, фон)", "Зміна кольору не потребує зміни JS-коду"] },
      { title: "Два стани", points: [".form-message.error — зазвичай червоний, для помилки", ".form-message.success — зазвичай зелений, для успіху", "Обидва класи БЕЗ пробілу — елемент має ОБИДВА класи одночасно"] },
    ],
    task: "Створи .form-message.error (color, background-color) і .form-message.success (color, background-color).",
    starter: "",
    hints: [
      "Обидва селектори: .form-message.error і .form-message.success, БЕЗ пробілу.",
      "Кожен потребує і color, і background-color.",
      ".form-message.error {\n  color: #b91c1c;\n  background-color: #fee2e2;\n}\n.form-message.success {\n  color: #15803d;\n  background-color: #dcfce7;\n}",
    ],
    solution: `.form-message.error {\n  color: #b91c1c;\n  background-color: #fee2e2;\n  padding: 8px 12px;\n  border-radius: 6px;\n}\n\n.form-message.success {\n  color: #15803d;\n  background-color: #dcfce7;\n  padding: 8px 12px;\n  border-radius: 6px;\n}`,
    type: "css",
    tests: [
      { re: /\.form-message\.error\s*{[^}]*color\s*:\s*[^;]+;/i, msg: ".form-message.error має мати color." },
      { re: /\.form-message\.error\s*{[^}]*background-color\s*:\s*[^;]+;/i, msg: ".form-message.error має мати background-color." },
      { re: /\.form-message\.success\s*{[^}]*color\s*:\s*[^;]+;/i, msg: ".form-message.success має мати color." },
      { re: /\.form-message\.success\s*{[^}]*background-color\s*:\s*[^;]+;/i, msg: ".form-message.success має мати background-color." },
    ],
  },
  {
    id: "frontend-18",
    title: "Проєкт: контактна форма — валідація",
    theory:
      "Останній урок форми: перехопи подію submit, перевір поля власною логікою (не покладаючись лише на браузерну required), і покажи ВІДПОВІДНЕ повідомлення в .form-message з потрібним класом.\n\nevent.preventDefault() у обробнику submit ОБОВ'ЯЗКОВИЙ: без нього браузер спробує РЕАЛЬНО відправити форму (перезавантаживши сторінку чи перейшовши за action), а в нас немає реального сервера, що приймає ці дані — форма існує лише в межах цього уроку.\n\nВалідація: ім'я не порожнє (після .trim()) І email містить символ \"@\" (проста, але типова перевірка формату без складних регулярних виразів). Якщо ХОЧА Б ОДНА умова не виконана — .form-message отримує текст помилки й клас \"error\" (а клас \"success\", якщо він раптом лишився з попередньої спроби, потрібно ПРИБРАТИ, інакше обидва кольори змішаються).\n\nЯкщо все гаразд — текст успіху, клас \"success\" (з прибиранням \"error\"), і ОЧИЩЕННЯ обох полів через .value = \"\" — так форма готова до нового заповнення, а не показує вже надіслані дані.",
    domTemplate: `<section class="contact-form"><form><input class="name-input" type="text" required><input class="email-input" type="email" required><button type="submit">Надіслати</button><p class="form-message"></p></form></section>`,
    example: { code: `document.querySelector(".contact-form form").addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = document.querySelector(".name-input").value.trim();\n  const email = document.querySelector(".email-input").value.trim();\n  const message = document.querySelector(".form-message");\n  if (name === "" || !email.includes("@")) {\n    message.textContent = "Перевірте, будь ласка, ім'я та email.";\n    message.classList.remove("success");\n    message.classList.add("error");\n    return;\n  }\n  message.textContent = "Дякуємо! Ми зв'яжемось з вами найближчим часом.";\n  message.classList.remove("error");\n  message.classList.add("success");\n  document.querySelector(".name-input").value = "";\n  document.querySelector(".email-input").value = "";\n});`, explain: "preventDefault() зупиняє реальну відправку; далі — власна перевірка й потрібний клас на .form-message." },
    task: 'Підпишись на submit форми (з event.preventDefault()). Якщо name-input порожній (після trim) або email-input не містить "@" — покажи текст помилки в .form-message з класом "error" (прибравши "success"). Інакше — текст успіху з класом "success" (прибравши "error") і очисти обидва поля.',
    starter: "// document.querySelector(\".contact-form form\").addEventListener(\"submit\", (event) => {\n//   event.preventDefault();\n//   ...\n// });\n",
    hints: [
      "event.preventDefault() — перший рядок обробника, інакше форма спробує реально відправитись.",
      "Перевір ОБИДВІ умови: name === \"\" АБО !email.includes(\"@\") — якщо хоч одна хибна, це помилка.",
      "document.querySelector(\".contact-form form\").addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const name = document.querySelector(\".name-input\").value.trim();\n  const email = document.querySelector(\".email-input\").value.trim();\n  const message = document.querySelector(\".form-message\");\n  if (name === \"\" || !email.includes(\"@\")) {\n    message.textContent = \"Перевірте, будь ласка, ім'я та email.\";\n    message.classList.remove(\"success\");\n    message.classList.add(\"error\");\n    return;\n  }\n  message.textContent = \"Дякуємо! Ми зв'яжемось з вами найближчим часом.\";\n  message.classList.remove(\"error\");\n  message.classList.add(\"success\");\n  document.querySelector(\".name-input\").value = \"\";\n  document.querySelector(\".email-input\").value = \"\";\n});",
    ],
    solution: `document.querySelector(".contact-form form").addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = document.querySelector(".name-input").value.trim();\n  const email = document.querySelector(".email-input").value.trim();\n  const message = document.querySelector(".form-message");\n  if (name === "" || !email.includes("@")) {\n    message.textContent = "Перевірте, будь ласка, ім'я та email.";\n    message.classList.remove("success");\n    message.classList.add("error");\n    return;\n  }\n  message.textContent = "Дякуємо! Ми зв'яжемось з вами найближчим часом.";\n  message.classList.remove("error");\n  message.classList.add("success");\n  document.querySelector(".name-input").value = "";\n  document.querySelector(".email-input").value = "";\n});`,
    type: "js",
    testCode: `const form = document.querySelector('.contact-form form');\nconst nameInput = document.querySelector('.name-input');\nconst emailInput = document.querySelector('.email-input');\nconst message = document.querySelector('.form-message');\nif (!form || !nameInput || !emailInput || !message) return {pass:false, message:"Елементи форми не знайдені."};\nnameInput.value = '';\nemailInput.value = 'bad-email';\nform.dispatchEvent(new Event('submit', {cancelable: true}));\nawait new Promise(r => setTimeout(r, 0));\nif (!message.classList.contains('error')) return {pass:false, message:"З порожнім ім'ям і некоректним email має з'явитись клас 'error'."};\nnameInput.value = 'Оксана';\nemailInput.value = 'oksana@example.com';\nform.dispatchEvent(new Event('submit', {cancelable: true}));\nawait new Promise(r => setTimeout(r, 0));\nif (!message.classList.contains('success')) return {pass:false, message:"З коректними даними має з'явитись клас 'success'."};\nif (message.classList.contains('error')) return {pass:false, message:"Клас 'error' має бути ПРИБРАНИЙ після успішної відправки."};\nif (nameInput.value !== '' || emailInput.value !== '') return {pass:false, message:"Поля мають очиститись після успішної відправки."};\nreturn {pass:true, message:"Форма твого сайту тепер по-справжньому перевіряє дані й дає зрозумілий відгук — без жодного реального сервера."};`,
  },
  {
    id: "frontend-19",
    title: "Доступність: aria-label для іконок-посилань",
    theory:
      "Посилання чи кнопка, що складається лише з іконки (наприклад, значок Facebook без підпису «Facebook»), для скрінрідера звучить як «посилання» — без жодного пояснення, куди воно веде. aria-label вирішує це, надаючи ТЕКСТОВУ альтернативу, яку прочитає скрінрідер, хоча візуально на сторінці її не видно.\n\naria-label НЕ замінює видимий текст — якщо текст УЖЕ є (наприклад, кнопка з написом «Купити»), додатковий aria-label лише ЗАПЛУТАЄ, бо скрінрідер прочитає aria-label ЗАМІСТЬ видимого тексту. aria-label призначений САМЕ для елементів БЕЗ власного текстового вмісту: іконки, символи, зображення-посилання.\n\nЦе один з набору ARIA-атрибутів (Accessible Rich Internet Applications) — стандарту, який доповнює звичайний HTML додатковою інформацією для допоміжних технологій, коли самої розмітки недостатньо.\n\nПравило-орієнтир: якщо прибрати ВЕСЬ CSS і всі іконки-шрифти/зображення, чи залишиться зрозуміло, куди веде посилання, читаючи ЛИШЕ текст? Якщо ні — потрібен aria-label.",
    examples: [
      { title: "Іконка-посилання без видимого тексту", code: `<a href="https://facebook.com" aria-label="Facebook">📘</a>\n<a href="https://instagram.com" aria-label="Instagram">📷</a>`, explain: "Емодзі-іконки самі по собі нічого не кажуть скрінрідеру — aria-label дає точну назву соцмережі." },
    ],
    presentation: [
      { title: "Коли потрібен aria-label", points: ["Елемент БЕЗ власного видимого тексту (іконка, символ)", "Дає скрінрідеру текстову альтернативу", "НЕ дублюй його, якщо видимий текст уже є"] },
    ],
    task: 'Створи два <a href="..."> з іконками замість тексту, кожне з aria-label ("Facebook" і "Instagram" відповідно).',
    starter: "",
    hints: [
      'aria-label — рядок у лапках, точна назва того, куди веде посилання.',
      "Обидва посилання мають href і aria-label, текст усередині — просто символ чи емодзі.",
      '<a href="https://facebook.com" aria-label="Facebook">📘</a>\n<a href="https://instagram.com" aria-label="Instagram">📷</a>',
    ],
    solution: `<a href="https://facebook.com" aria-label="Facebook">📘</a>\n<a href="https://instagram.com" aria-label="Instagram">📷</a>`,
    type: "html",
    check: (doc) => {
      const links = doc.querySelectorAll("a[aria-label]");
      if (links.length < 2) return { pass: false, message: "Потрібні щонайменше 2 посилання з aria-label." };
      const labels = Array.from(links).map((a) => a.getAttribute("aria-label"));
      if (!labels.includes("Facebook") || !labels.includes("Instagram")) return { pass: false, message: 'Потрібні aria-label="Facebook" і aria-label="Instagram".' };
      for (const a of links) {
        if (!a.getAttribute("href")) return { pass: false, message: "Кожне посилання має мати href." };
      }
      return { pass: true, message: "Тепер скрінрідер точно назве, куди веде кожна іконка — не просто «посилання» без контексту." };
    },
  },
  {
    id: "frontend-20",
    title: "Skip-link: перейти одразу до основного вмісту",
    theory:
      "Користувач, що керує сторінкою лише клавіатурою (Tab), змушений пройти ЧЕРЕЗ усі посилання шапки (лого, кожен пункт меню), перш ніж дістатись до основного вмісту — на кожній сторінці сайту, щоразу. Skip-link («посилання-пропуск») — перший фокусований елемент на сторінці, що дозволяє одним Enter перестрибнути прямо до <main>.\n\nSkip-link зазвичай ВІЗУАЛЬНО прихований (винесений за межі екрана через CSS), доки НЕ отримає фокус клавіатурою — тоді він раптово з'являється зверху сторінки. Мишкою його ніхто не побачить, і це нормально: він призначений САМЕ для клавіатурної навігації.\n\nЦе МАЄ бути ПЕРШИЙ елемент усередині body — інакше сенс втрачається: якщо перед ним є ще 10 посилань шапки, Tab однаково доведеться натиснути 10 разів, перш ніж дістатись до skip-link.\n\nhref=\"#main-content\" посилається на id елемента, до якого веде перехід (зазвичай сам <main>) — той самий принцип якорів (#id), що вже застосовувався для внутрішньої навігації сторінкою в html-курсі.",
    examples: [
      { title: "Skip-link перед основним вмістом", code: `<body>\n  <a class="skip-link" href="#main-content">Перейти до основного вмісту</a>\n  <header>...</header>\n  <main id="main-content">...</main>\n</body>`, explain: "skip-link — ПЕРШИЙ елемент у body, ще ДО header — Tab одразу пропонує його користувачу клавіатури." },
    ],
    presentation: [
      { title: "Навіщо skip-link", points: ["Дозволяє клавіатурному користувачу пропустити шапку", "Має бути ПЕРШИМ елементом у body", "Візуально прихований, доки не отримає фокус"] },
    ],
    task: 'Створи <main id="main-content"> з будь-яким текстом, і ПЕРЕД ним — <a class="skip-link" href="#main-content">Перейти до основного вмісту</a> як перший елемент body.',
    starter: "<body>\n\n</body>",
    hints: [
      "skip-link має бути ПЕРШИМ дочірнім елементом body.",
      "href має точно збігатись з id тега main.",
      '<body>\n  <a class="skip-link" href="#main-content">Перейти до основного вмісту</a>\n  <main id="main-content">Вміст сторінки.</main>\n</body>',
    ],
    solution: `<body>\n  <a class="skip-link" href="#main-content">Перейти до основного вмісту</a>\n  <main id="main-content">Вміст сторінки.</main>\n</body>`,
    type: "html",
    check: (doc) => {
      const body = doc.body;
      const first = body?.firstElementChild;
      if (!first || first.tagName !== "A" || !first.classList.contains("skip-link")) return { pass: false, message: 'Перший елемент body має бути <a class="skip-link">.' };
      if (first.getAttribute("href") !== "#main-content") return { pass: false, message: 'skip-link має href="#main-content".' };
      const main = doc.querySelector("main#main-content");
      if (!main) return { pass: false, message: 'Потрібен <main id="main-content">.' };
      return { pass: true, message: "Тепер клавіатурний користувач одним Enter пропускає шапку й одразу потрапляє до основного вмісту." };
    },
  },
  {
    id: "frontend-21",
    title: "Проєкт: таби — розмітка",
    theory:
      "Перший з трьох уроків табів (вкладок) — патерну, що показує РІЗНИЙ вміст ПО ЧЕРЗІ в тому самому місці сторінки, перемикаючись кнопками зверху (опис товару / характеристики / відгуки — типовий приклад на сторінці товару).\n\nСтруктура з двох частин: <div class=\"tab-buttons\"> з кількома <button class=\"tab-button\"> (кожен з атрибутом data-tab, що вказує, ЯКУ панель відкривати), і <div class=\"tab-panels\"> з кількома <div class=\"tab-panel\"> (кожен з атрибутом data-panel, що збігається з відповідним data-tab).\n\ndata-* атрибути (з html-курсу) — саме той інструмент, що зв'язує кнопку з ЇЇ панеллю без хардкоджених id: data-tab=\"1\" на кнопці й data-panel=\"1\" на панелі означають «ця кнопка відкриває саме цю панель».\n\nПерша кнопка й перша панель одразу отримують клас \"active\" (позначаючи «вкладка, яка видима зараз») — усі інші панелі поки без active (наступний CSS-урок сховає їх).",
    examples: [
      { title: "Таби з трьома вкладками", code: `<section class="tabs">\n  <div class="tab-buttons">\n    <button class="tab-button active" data-tab="1">Опис</button>\n    <button class="tab-button" data-tab="2">Характеристики</button>\n    <button class="tab-button" data-tab="3">Відгуки</button>\n  </div>\n  <div class="tab-panels">\n    <div class="tab-panel active" data-panel="1">Опис товару.</div>\n    <div class="tab-panel" data-panel="2">Вага, розміри, матеріал.</div>\n    <div class="tab-panel" data-panel="3">Відгуки покупців.</div>\n  </div>\n</section>`, explain: "data-tab на кнопці й data-panel на панелі з однаковим значенням — ось і весь зв'язок між ними." },
    ],
    presentation: [
      { title: "Структура табів", points: [".tab-buttons з кількома .tab-button (data-tab)", ".tab-panels з кількома .tab-panel (data-panel)", "Перша кнопка й панель — одразу з класом active"] },
    ],
    task: 'Створи в main <section class="tabs"> з <div class="tab-buttons"> (3 <button class="tab-button" data-tab="N">, перша з класом active) і <div class="tab-panels"> (3 <div class="tab-panel" data-panel="N">, перша з класом active).',
    starter: "",
    hints: [
      "data-tab кнопки й data-panel відповідної панелі мають СПІВПАДАТИ (\"1\", \"2\", \"3\").",
      "Активний стан ЛИШЕ на першій кнопці й першій панелі.",
      '<section class="tabs">\n  <div class="tab-buttons">\n    <button class="tab-button active" data-tab="1">Опис</button>\n    <button class="tab-button" data-tab="2">Характеристики</button>\n    <button class="tab-button" data-tab="3">Відгуки</button>\n  </div>\n  <div class="tab-panels">\n    <div class="tab-panel active" data-panel="1">Текст 1</div>\n    <div class="tab-panel" data-panel="2">Текст 2</div>\n    <div class="tab-panel" data-panel="3">Текст 3</div>\n  </div>\n</section>',
    ],
    solution: `<section class="tabs">\n  <div class="tab-buttons">\n    <button class="tab-button active" data-tab="1">Опис</button>\n    <button class="tab-button" data-tab="2">Характеристики</button>\n    <button class="tab-button" data-tab="3">Відгуки</button>\n  </div>\n  <div class="tab-panels">\n    <div class="tab-panel active" data-panel="1">Детальний опис товару.</div>\n    <div class="tab-panel" data-panel="2">Вага 1.2кг, розміри 30x20x5см.</div>\n    <div class="tab-panel" data-panel="3">Чудовий товар, рекомендую!</div>\n  </div>\n</section>`,
    type: "html",
    check: (doc) => {
      const tabs = doc.querySelector("section.tabs");
      if (!tabs) return { pass: false, message: 'Потрібна <section class="tabs">.' };
      const buttons = tabs.querySelectorAll(".tab-buttons > button.tab-button");
      if (buttons.length < 3) return { pass: false, message: "Потрібно щонайменше 3 .tab-button." };
      const panels = tabs.querySelectorAll(".tab-panels > div.tab-panel");
      if (panels.length < 3) return { pass: false, message: "Потрібно щонайменше 3 .tab-panel." };
      const activeButtons = tabs.querySelectorAll(".tab-button.active");
      if (activeButtons.length !== 1) return { pass: false, message: "Рівно ОДНА кнопка має клас active." };
      const activePanels = tabs.querySelectorAll(".tab-panel.active");
      if (activePanels.length !== 1) return { pass: false, message: "Рівно ОДНА панель має клас active." };
      for (const btn of buttons) {
        if (!btn.getAttribute("data-tab")) return { pass: false, message: "Кожна .tab-button потребує data-tab." };
      }
      for (const panel of panels) {
        if (!panel.getAttribute("data-panel")) return { pass: false, message: "Кожна .tab-panel потребує data-panel." };
      }
      return { pass: true, message: "Розмітка табів готова. Наступний CSS сховає неактивні панелі, а JS навчить кнопки перемикати їх." };
    },
  },
  {
    id: "frontend-22",
    title: "Проєкт: таби — активний стан",
    theory:
      "Другий урок табів: сховай усі .tab-panel, крім тієї, що має клас .active — той самий принцип «керування станом через клас», що вже застосовувався у FAQ-акордеоні (.faq-answer/.open), лише тут стан називається \"active\", а не \"open\".\n\n.tab-panel { display: none; } ховає ВСІ панелі за замовчуванням, а .tab-panel.active { display: block; } — точніший селектор (два класи одночасно) — показує лише активну. Оскільки CSS застосовує ОБИДВА правила до кожного елемента, а специфічніший селектор (з двома класами) переважає загальніший — усе працює саме так, як задумано.\n\nДодай стиль і для АКТИВНОЇ КНОПКИ (.tab-button.active) — інакше користувач бачить контент нової вкладки, але кнопка, по якій він щойно клікнув, візуально нічим не відрізняється від решти. Найпростіше — background-color і/або font-weight.\n\nЦе завершує ВІЗУАЛЬНУ частину табів — JS у наступному уроці лише переставлятиме клас active з однієї кнопки й панелі на іншу, а весь зовнішній вигляд уже готовий і чекає.",
    previewHTML: `<div class="tab-buttons"><button class="tab-button active">Опис</button><button class="tab-button">Відгуки</button></div><div class="tab-panels"><div class="tab-panel active">Активна панель.</div><div class="tab-panel">Прихована панель.</div></div>`,
    examples: [
      { title: "Показ лише активної панелі", code: `.tab-panel {\n  display: none;\n}\n\n.tab-panel.active {\n  display: block;\n}\n\n.tab-button.active {\n  background-color: #1d4ed8;\n  color: white;\n}`, explain: "Активна панель показана (display: block), решта сховані; активна кнопка виділена кольором." },
    ],
    presentation: [
      { title: "Той самий принцип, що й акордеон", points: [".tab-panel { display: none; } — сховано за замовчуванням", ".tab-panel.active — показано, лише з класом active", "Активна кнопка теж має власний виділений стиль"] },
    ],
    task: "Сховай .tab-panel (display: none), покажи .tab-panel.active (display: block), і стилізуй .tab-button.active (background-color).",
    starter: "",
    hints: [
      ".tab-panel { display: none; } — базовий стан для ВСІХ панелей.",
      ".tab-panel.active (без пробілу) { display: block; } — точніший селектор перекриває загальний.",
      ".tab-panel {\n  display: none;\n}\n.tab-panel.active {\n  display: block;\n}\n.tab-button.active {\n  background-color: #1d4ed8;\n}",
    ],
    solution: `.tab-panel {\n  display: none;\n}\n\n.tab-panel.active {\n  display: block;\n}\n\n.tab-button.active {\n  background-color: #1d4ed8;\n  color: white;\n}`,
    type: "css",
    tests: [
      { re: /\.tab-panel\s*{[^}]*display\s*:\s*none/i, msg: ".tab-panel має мати display: none." },
      { re: /\.tab-panel\.active\s*{[^}]*display\s*:\s*block/i, msg: ".tab-panel.active має мати display: block." },
      { re: /\.tab-button\.active\s*{[^}]*background-color\s*:\s*[^;]+;/i, msg: ".tab-button.active має мати background-color." },
    ],
  },
  {
    id: "frontend-23",
    title: "Transition: плавні переходи між станами",
    theory:
      "Без transition будь-яка зміна CSS-властивості (колір, розмір, положення) відбувається МИТТЄВО, одним кадром — навіть якщо зміна викликана :hover чи класом, доданим через JS. transition каже браузеру: «коли ця властивість зміниться, роби це ПЛАВНО, за вказаний час», перетворюючи різкий стрибок на анімацію.\n\nСинтаксис: transition: властивість тривалість [функція];. transition: transform 0.3s ease; означає «якщо зміниться transform — анімуй це плавно за 0.3 секунди з природним прискоренням/сповільненням (ease)». Можна анімувати кілька властивостей одразу через кому, або просто написати transition: all 0.3s — анімувати БУДЬ-ЯКУ властивість, що зміниться.\n\nВАЖЛИВО: transition пишеться на ПОЧАТКОВОМУ стані елемента (звичайному правилі), а НЕ на :hover чи .active — CSS застосовує transition з базового правила АВТОМАТИЧНО в обидва боки: і коли властивість змінюється (при наведенні), і коли повертається назад (коли миша йде геть).\n\nНе кожну властивість можна плавно анімувати (наприклад, display: none↔block — миттєвий перемикач, без проміжних станів) — але transform, opacity, color, background-color — усі анімуються плавно й це найпоширеніші кандидати для transition у реальних сайтах.",
    previewHTML: `<button class="btn">Наведи курсор</button>`,
    examples: [
      { title: "Плавне збільшення кнопки при наведенні", code: `.btn {\n  background-color: #1d4ed8;\n  transition: transform 0.3s ease, background-color 0.3s ease;\n}\n\n.btn:hover {\n  transform: scale(1.1);\n  background-color: #1e40af;\n}`, explain: "transition пишеться на .btn (базовому стані), а не на .btn:hover — тому анімація плавна і при наведенні, і при відведенні курсора." },
    ],
    presentation: [
      { title: "transition", points: ["Без нього зміни CSS-властивостей — миттєві", "Синтаксис: transition: властивість тривалість функція;", "Пишеться на БАЗОВОМУ стані, а не на :hover"] },
    ],
    task: "Стилізуй .btn: базовий стан з transition (transform і/або background-color, 0.3s), і .btn:hover зі зміненим transform.",
    starter: "",
    hints: [
      "transition пишеться в .btn (базовому правилі), не в .btn:hover.",
      ".btn:hover має РЕАЛЬНО змінювати transform, щоб transition було що анімувати.",
      ".btn {\n  transition: transform 0.3s ease;\n}\n.btn:hover {\n  transform: scale(1.1);\n}",
    ],
    solution: `.btn {\n  background-color: #1d4ed8;\n  transition: transform 0.3s ease, background-color 0.3s ease;\n}\n\n.btn:hover {\n  transform: scale(1.1);\n  background-color: #1e40af;\n}`,
    type: "css",
    tests: [
      { re: /\.btn\s*{[^}]*transition\s*:\s*[^;]+;/i, msg: ".btn (базовий стан) має мати transition." },
      { re: /\.btn:hover\s*{[^}]*transform\s*:\s*[^;]+;/i, msg: ".btn:hover має мати transform." },
    ],
  },
  {
    id: "frontend-24",
    title: "Проєкт: таби — перемикання вкладок",
    theory:
      "Останній урок табів: клік на .tab-button має ОДНОЧАСНО зробити дві речі — перемкнути активну кнопку (прибрати active з усіх кнопок, додати клікнутій), і показати ВІДПОВІДНУ панель (за співпадінням data-tab кнопки з data-panel панелі), сховавши решту.\n\ndataset — зручний спосіб читати data-* атрибути з JS: елемент з data-tab=\"2\" у HTML доступний в JS як element.dataset.tab (без \"data-\", у camelCase для складених назв) і одразу повертає РЯДОК \"2\".\n\nЛогіка: querySelectorAll(\".tab-panel\").forEach(panel => panel.classList.toggle(\"active\", panel.dataset.panel === clickedTab)) — другий аргумент toggle() (булеве значення) явно каже, ДОДАТИ клас (true) чи ПРИБРАТИ (false), замість звичайного перемикання туди-сюди — зручно, коли треба виставити ТОЧНИЙ стан для КОЖНОГО елемента списку за одну ітерацію.\n\nДелегування (з окремого уроку) тут теж доречне: один обробник на .tab-buttons, а не окремий на кожну кнопку.",
    domTemplate: `<section class="tabs"><div class="tab-buttons"><button class="tab-button active" data-tab="1">Опис</button><button class="tab-button" data-tab="2">Відгуки</button></div><div class="tab-panels"><div class="tab-panel active" data-panel="1">Опис товару.</div><div class="tab-panel" data-panel="2">Відгуки покупців.</div></div></section>`,
    example: { code: `document.querySelector(".tab-buttons").addEventListener("click", (event) => {\n  const button = event.target.closest(".tab-button");\n  if (!button) return;\n  const target = button.dataset.tab;\n  document.querySelectorAll(".tab-button").forEach((b) => b.classList.toggle("active", b === button));\n  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === target));\n});`, explain: "toggle(\"active\", умова) виставляє клас у ТОЧНИЙ стан (true/false) для кожної кнопки й панелі за один прохід." },
    task: 'Підпишись на .tab-buttons: при кліку на .tab-button знайди клікнуту кнопку (closest), прочитай її button.dataset.tab, потім для ВСІХ .tab-button виставь active лише клікнутій, а для ВСІХ .tab-panel — active лише тій, чий dataset.panel збігається з button.dataset.tab.',
    starter: "// document.querySelector(\".tab-buttons\").addEventListener(\"click\", (event) => {\n//   const button = event.target.closest(\".tab-button\");\n//   ...\n// });\n",
    hints: [
      "button.dataset.tab читає значення data-tab як рядок.",
      "classList.toggle(\"active\", булеве_значення) явно виставляє стан, замість перемикання туди-сюди.",
      "document.querySelector(\".tab-buttons\").addEventListener(\"click\", (event) => {\n  const button = event.target.closest(\".tab-button\");\n  if (!button) return;\n  const target = button.dataset.tab;\n  document.querySelectorAll(\".tab-button\").forEach((b) => b.classList.toggle(\"active\", b === button));\n  document.querySelectorAll(\".tab-panel\").forEach((panel) => panel.classList.toggle(\"active\", panel.dataset.panel === target));\n});",
    ],
    solution: `document.querySelector(".tab-buttons").addEventListener("click", (event) => {\n  const button = event.target.closest(".tab-button");\n  if (!button) return;\n  const target = button.dataset.tab;\n  document.querySelectorAll(".tab-button").forEach((b) => b.classList.toggle("active", b === button));\n  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === target));\n});`,
    type: "js",
    testCode: `const buttons = document.querySelectorAll('.tab-button');\nconst panels = document.querySelectorAll('.tab-panel');\nif (buttons.length < 2 || panels.length < 2) return {pass:false, message:".tab-button/.tab-panel не знайдені."};\nbuttons[1].click();\nawait new Promise(r => setTimeout(r, 0));\nif (!buttons[1].classList.contains('active')) return {pass:false, message:"Клікнута кнопка має отримати клас 'active'."};\nif (buttons[0].classList.contains('active')) return {pass:false, message:"Попередня кнопка має втратити клас 'active'."};\nconst activePanel = document.querySelector('.tab-panel.active');\nif (!activePanel || activePanel.dataset.panel !== buttons[1].dataset.tab) return {pass:false, message:"Панель з data-panel, що збігається з data-tab клікнутої кнопки, має стати активною."};\nconst activePanels = document.querySelectorAll('.tab-panel.active');\nif (activePanels.length !== 1) return {pass:false, message:"Рівно ОДНА панель має бути активною одночасно."};\nreturn {pass:true, message:"Таби твого сайту тепер по-справжньому перемикаються — кнопка і відповідна панель завжди синхронізовані."};`,
  },
  {
    id: "frontend-25",
    title: "Custom properties: власні змінні в CSS",
    theory:
      "Custom properties (CSS-змінні) дозволяють оголосити значення ОДИН РАЗ під власною назвою (--назва: значення;) і потім використовувати його в БУДЬ-ЯКІЙ кількості правил через var(--назва) — змінивши значення в ОДНОМУ місці, оновлюєш усі правила, що на нього посилаються.\n\nЗмінні зазвичай оголошують у псевдокласі :root — він відповідає кореневому елементу документа (<html>), тому змінна, оголошена там, доступна ГЛОБАЛЬНО, у будь-якому іншому правилі сторінки — на кшталт «глобальних налаштувань» для всього сайту.\n\nНа відміну від препроцесорних змінних (Sass, LESS, що існували раніше), CSS custom properties — це РЕАЛЬНА можливість браузера, доступна БЕЗ жодної збірки чи компіляції, і що важливо — її можна ЗМІНЮВАТИ ДИНАМІЧНО через JavaScript (document.documentElement.style.setProperty(...)) прямо під час роботи сторінки, без перезавантаження CSS-файлу.\n\nТипове застосування — палітра кольорів бренду (--primary-color, --accent-color) чи, як у наступному уроці цього курсу, перемикання світлої/темної теми: одна змінна --bg-color, значення якої різне для звичайного стану й для [data-theme=\"dark\"].",
    previewHTML: `<div class="card">Картка з акцентним кольором</div>`,
    examples: [
      { title: "Змінна кольору, використана в кількох місцях", code: `:root {\n  --accent: #1d4ed8;\n}\n\n.card {\n  color: var(--accent);\n  border: 2px solid var(--accent);\n}`, explain: "Значення --accent визначене ОДИН раз у :root, а .card використовує його ДВІЧІ — зміни --accent і обидва місця оновляться разом." },
    ],
    presentation: [
      { title: "Custom properties", points: ["--назва: значення; оголошується зазвичай у :root", "var(--назва) використовує значення будь-де на сторінці", "Реальна можливість браузера — без препроцесорів чи збірки"] },
    ],
    task: "Оголоси --accent у :root (будь-яке значення кольору), і використай var(--accent) у .card для color та border.",
    starter: "",
    hints: [
      ":root { --accent: значення; } — оголошення ГЛОБАЛЬНОЇ змінної.",
      "var(--accent) підставляє це значення в БУДЬ-ЯКОМУ іншому правилі.",
      ":root {\n  --accent: #1d4ed8;\n}\n.card {\n  color: var(--accent);\n  border: 2px solid var(--accent);\n}",
    ],
    solution: `:root {\n  --accent: #1d4ed8;\n}\n\n.card {\n  color: var(--accent);\n  border: 2px solid var(--accent);\n}`,
    type: "css",
    tests: [
      { re: /:root\s*{[^}]*--accent\s*:\s*[^;]+;/i, msg: ":root має оголошувати --accent." },
      { re: /\.card\s*{[^}]*color\s*:\s*var\(\s*--accent\s*\)/i, msg: ".card має мати color: var(--accent)." },
      { re: /\.card\s*{[^}]*border\s*:[^;]*var\(\s*--accent\s*\)/i, msg: ".card має мати border, що використовує var(--accent)." },
    ],
  },
  {
    id: "frontend-26",
    title: "Медіа-запити: mobile-first підхід",
    theory:
      "Медіа-запит @media (умова) { правила } застосовує правила ЛИШЕ за виконання умови — найчастіше умова про ширину екрана. Mobile-first — стратегія написання CSS, за якою БАЗОВІ (без медіа-запитів) правила описують МОБІЛЬНИЙ вигляд, а @media (min-width: ...) ДОДАЄ зміни для ширших екранів.\n\nЧому саме так, а не навпаки (спочатку десктоп, звужувати для мобільних)? Мобільний трафік сьогодні часто переважає, і простіше ДОДАВАТИ складність (більше колонок, більший шрифт) для великих екранів, ніж ВІДНІМАТИ її для маленьких. min-width означає «від цієї ширини Й ШИРШЕ» — природний напрямок для нарощування.\n\nТипові контрольні точки (breakpoints): 768px (планшети), 1024px (невеликі ноутбуки) — не жорсткі стандарти, а орієнтовні межі, підібрані під конкретний дизайн, а не якесь магічне число.\n\nВажливо: медіа-запит МОЖЕ перевизначити БУДЬ-ЯКУ CSS-властивість, не лише розмір шрифту — кількість колонок сітки, напрямок flex (row↔column), навіть display: none↔block для показу/приховування цілих блоків залежно від ширини екрана.",
    previewHTML: `<div class="box">Адаптивний блок</div>`,
    examples: [
      { title: "Базовий мобільний стиль + розширення для планшетів", code: `.box {\n  font-size: 14px;\n  padding: 12px;\n}\n\n@media (min-width: 768px) {\n  .box {\n    font-size: 18px;\n    padding: 24px;\n  }\n}`, explain: "На вузьких екранах діє лише базове правило; від 768px і ширше медіа-запит перевизначає font-size і padding на більші." },
    ],
    presentation: [
      { title: "Mobile-first", points: ["Базові правила (без медіа-запиту) — для мобільних", "@media (min-width: ...) додає зміни для ширших екранів", "Простіше додавати складність, ніж віднімати її"] },
    ],
    task: "Стилізуй .box базово (font-size, padding) для мобільних, і додай @media (min-width: 768px), що перевизначає обидві властивості на більші значення.",
    starter: "",
    hints: [
      "Базове правило .box — БЕЗ медіа-запиту, для мобільних.",
      "@media (min-width: 768px) { .box { ... } } — окремий блок з перевизначеними властивостями.",
      ".box {\n  font-size: 14px;\n  padding: 12px;\n}\n@media (min-width: 768px) {\n  .box {\n    font-size: 18px;\n    padding: 24px;\n  }\n}",
    ],
    solution: `.box {\n  font-size: 14px;\n  padding: 12px;\n}\n\n@media (min-width: 768px) {\n  .box {\n    font-size: 18px;\n    padding: 24px;\n  }\n}`,
    type: "css",
    tests: [
      { re: /\.box\s*{[^}]*font-size\s*:\s*[^;]+;/i, msg: ".box має мати font-size." },
      { re: /@media\s*\(\s*min-width\s*:\s*768px\s*\)\s*{[^]*?\.box\s*{[^}]*font-size\s*:\s*[^;]+;/i, msg: "@media (min-width: 768px) має перевизначати font-size у .box." },
      { re: /@media\s*\(\s*min-width\s*:\s*768px\s*\)\s*{[^]*?\.box\s*{[^}]*padding\s*:\s*[^;]+;/i, msg: "@media (min-width: 768px) має перевизначати padding у .box." },
    ],
  },
  {
    id: "frontend-27",
    title: "Проєкт: перемикач теми — розмітка",
    theory:
      "Перший з трьох уроків перемикача світлої/темної теми — одна з найпопулярніших фіч сучасних сайтів. Розмітка тут МІНІМАЛЬНА: <section class=\"theme-toggle\"> з однією <button id=\"theme-toggle-btn\">.\n\nЧому button з id, а не з класом, як решта milestone-елементів? Перемикач теми — елемент, який на сторінці рівно ОДИН (на відміну від карток чи FAQ-питань, яких може бути кілька) — тому id тут доречний і навіть точніший, ніж клас: він явно каже «це унікальний елемент, а не один із багатьох».\n\nПочатковий текст кнопки — «🌙 Темна тема» (пропозиція УВІМКНУТИ темну тему, бо за замовчуванням сайт світлий) — JS у третьому уроці буде змінювати цей текст на «☀️ Світла тема», коли тема вже темна, щоб кнопка завжди пропонувала ПРОТИЛЕЖНИЙ до поточного стан.\n\nЦе один із НЕБАГАТЬОХ milestone-уроків, де HTML-частина настільки коротка — уся СПРАВЖНЯ робота (палітра кольорів, збереження вибору) відбудеться в наступних CSS і JS уроках.",
    examples: [
      { title: "Кнопка перемикача теми", code: `<section class="theme-toggle">\n  <button id="theme-toggle-btn">🌙 Темна тема</button>\n</section>`, explain: "Мінімальна розмітка — уся логіка теми з'явиться в наступних двох уроках." },
    ],
    presentation: [
      { title: "Мінімальна розмітка", points: ["section.theme-toggle з однією button#theme-toggle-btn", "id тут доречний — елемент дійсно унікальний на сторінці", "Текст «🌙 Темна тема» пропонує УВІМКНУТИ темну тему"] },
    ],
    task: 'Створи в main <section class="theme-toggle"> з <button id="theme-toggle-btn">🌙 Темна тема</button>.',
    starter: "",
    hints: [
      "section отримує клас theme-toggle, кнопка — id theme-toggle-btn (не клас).",
      "Текст кнопки — точно «🌙 Темна тема».",
      '<section class="theme-toggle">\n  <button id="theme-toggle-btn">🌙 Темна тема</button>\n</section>',
    ],
    solution: `<section class="theme-toggle">\n  <button id="theme-toggle-btn">🌙 Темна тема</button>\n</section>`,
    type: "html",
    check: (doc) => {
      const section = doc.querySelector("section.theme-toggle");
      if (!section) return { pass: false, message: 'Потрібна <section class="theme-toggle">.' };
      const btn = section.querySelector("#theme-toggle-btn");
      if (!btn) return { pass: false, message: 'Усередині потрібна <button id="theme-toggle-btn">.' };
      if (!btn.textContent.includes("Темна тема")) return { pass: false, message: 'Текст кнопки має містити «Темна тема».' };
      return { pass: true, message: "Готово. Наступний CSS-урок підготує палітру кольорів для обох тем." };
    },
  },
  {
    id: "frontend-28",
    title: "Проєкт: перемикач теми — палітра кольорів",
    theory:
      "Другий урок теми: використай custom properties (з окремого уроку) для ДВОХ наборів кольорів — світлого (за замовчуванням, у :root) і темного (коли на <html> з'явиться атрибут data-theme=\"dark\"). Це найелегантніший спосіб реалізувати перемикач теми — БЕЗ дублювання цілих CSS-файлів для кожної теми.\n\n:root визначає --bg-color і --text-color для СВІТЛОЇ теми (стан за замовчуванням). Селектор [data-theme=\"dark\"] — атрибутний селектор (той самий тип, що вже застосовувався для input[type=\"email\"]) — перевизначає ТІ САМІ ЗМІННІ новими значеннями, коли на <html> стоїть цей атрибут.\n\nbody { background-color: var(--bg-color); color: var(--text-color); } — сам body ніколи не змінюється: він завжди просто «читає» ПОТОЧНІ значення змінних. Коли JS (наступний урок) додасть data-theme=\"dark\" на <html>, змінні автоматично оновляться, а body підхопить нові значення БЕЗ жодного додаткового CSS-правила для body.\n\nЦе ключова перевага custom properties перед звичайними значеннями: одна зміна атрибута на <html> каскадно оновлює ВЕСЬ сайт, що використовує var(--bg-color)/var(--text-color), а не лише один конкретний елемент.",
    previewHTML: `<body><div class="theme-demo">Приклад тексту</div></body>`,
    examples: [
      { title: "Дві теми через одні змінні", code: `:root {\n  --bg-color: #ffffff;\n  --text-color: #1e293b;\n}\n\n[data-theme="dark"] {\n  --bg-color: #0f172a;\n  --text-color: #f1f5f9;\n}\n\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n}`, explain: "body завжди читає ПОТОЧНІ значення змінних — які саме значення діють, залежить лише від того, чи є на <html> атрибут data-theme=\"dark\"." },
    ],
    presentation: [
      { title: "Дві теми — одні змінні", points: [":root — світла тема (за замовчуванням)", "[data-theme=\"dark\"] перевизначає ТІ САМІ змінні", "body просто читає var(...) — жодних дублікатів правил"] },
    ],
    task: 'Оголоси --bg-color і --text-color у :root (світла тема), перевизнач обидві у [data-theme="dark"] (темна тема), і застосуй var(--bg-color)/var(--text-color) у body.',
    starter: "",
    hints: [
      "Обидві змінні мають бути оголошені і в :root, і в [data-theme=\"dark\"] — з РІЗНИМИ значеннями.",
      "body використовує var() для ОБОХ властивостей: background-color і color.",
      ':root {\n  --bg-color: #ffffff;\n  --text-color: #1e293b;\n}\n[data-theme="dark"] {\n  --bg-color: #0f172a;\n  --text-color: #f1f5f9;\n}\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n}',
    ],
    solution: `:root {\n  --bg-color: #ffffff;\n  --text-color: #1e293b;\n}\n\n[data-theme="dark"] {\n  --bg-color: #0f172a;\n  --text-color: #f1f5f9;\n}\n\nbody {\n  background-color: var(--bg-color);\n  color: var(--text-color);\n}`,
    type: "css",
    tests: [
      { re: /:root\s*{[^}]*--bg-color\s*:\s*[^;]+;[^}]*--text-color\s*:\s*[^;]+;/i, msg: ":root має оголошувати --bg-color і --text-color." },
      { re: /\[data-theme=["']dark["']\]\s*{[^}]*--bg-color\s*:\s*[^;]+;[^}]*--text-color\s*:\s*[^;]+;/i, msg: '[data-theme="dark"] має перевизначати --bg-color і --text-color.' },
      { re: /body\s*{[^}]*background-color\s*:\s*var\(\s*--bg-color\s*\)/i, msg: "body має мати background-color: var(--bg-color)." },
      { re: /body\s*{[^}]*color\s*:\s*var\(\s*--text-color\s*\)/i, msg: "body має мати color: var(--text-color)." },
    ],
  },
  {
    id: "frontend-29",
    title: "Проєкт: перемикач теми — toggle і localStorage",
    theory:
      "Останній урок теми: клік на кнопку перемикає data-theme на <html> між \"dark\" і відсутністю атрибута, ЗБЕРІГАЄ вибір у localStorage, і оновлює текст кнопки на протилежний.\n\ndocument.documentElement — це і є тег <html> (documentElement — властивість document, що завжди повертає кореневий елемент сторінки). setAttribute/removeAttribute на ньому додають чи прибирають data-theme=\"dark\" — а CSS з попереднього уроку одразу реагує на цю зміну.\n\nlocalStorage.setItem(\"theme\", \"dark\") зберігає вибір користувача так, щоб він НЕ ЗГАДУВАВСЯ при кожному новому відвідуванні сторінки (у реальному застосунку — при кожному перезавантаженні; у цій пісочниці localStorage працює через ізольований in-memory shim з тим самим API, тому логіку читання/запису можна тренувати так само, як зі справжнім localStorage).\n\nПеревірка поточного стану перед перемиканням: якщо document.documentElement.getAttribute(\"data-theme\") === \"dark\" — вимикаємо (removeAttribute + localStorage \"light\" + текст «🌙 Темна тема»); інакше — вмикаємо (setAttribute + localStorage \"dark\" + текст «☀️ Світла тема»).",
    domTemplate: `<section class="theme-toggle"><button id="theme-toggle-btn">🌙 Темна тема</button></section>`,
    example: { code: `const btn = document.querySelector("#theme-toggle-btn");\nbtn.addEventListener("click", () => {\n  const isDark = document.documentElement.getAttribute("data-theme") === "dark";\n  if (isDark) {\n    document.documentElement.removeAttribute("data-theme");\n    localStorage.setItem("theme", "light");\n    btn.textContent = "🌙 Темна тема";\n  } else {\n    document.documentElement.setAttribute("data-theme", "dark");\n    localStorage.setItem("theme", "dark");\n    btn.textContent = "☀️ Світла тема";\n  }\n});`, explain: "Кожен клік перевіряє ПОТОЧНИЙ стан і перемикає на протилежний — і в атрибуті на <html>, і в localStorage, і в тексті кнопки." },
    task: 'Підпишись на клік по #theme-toggle-btn: якщо document.documentElement має data-theme="dark" — прибери атрибут, збережи localStorage.setItem("theme", "light") і онови текст кнопки на "🌙 Темна тема"; інакше — постав data-theme="dark", збережи "dark" і онови текст на "☀️ Світла тема".',
    starter: "// const btn = document.querySelector(\"#theme-toggle-btn\");\n// btn.addEventListener(\"click\", () => {\n//   ...\n// });\n",
    hints: [
      "Перевір ПОТОЧНИЙ стан ПЕРШИМ рядком: document.documentElement.getAttribute(\"data-theme\") === \"dark\".",
      "Три дії в кожній гілці: атрибут на documentElement, localStorage.setItem, і btn.textContent.",
      "const btn = document.querySelector(\"#theme-toggle-btn\");\nbtn.addEventListener(\"click\", () => {\n  const isDark = document.documentElement.getAttribute(\"data-theme\") === \"dark\";\n  if (isDark) {\n    document.documentElement.removeAttribute(\"data-theme\");\n    localStorage.setItem(\"theme\", \"light\");\n    btn.textContent = \"🌙 Темна тема\";\n  } else {\n    document.documentElement.setAttribute(\"data-theme\", \"dark\");\n    localStorage.setItem(\"theme\", \"dark\");\n    btn.textContent = \"☀️ Світла тема\";\n  }\n});",
    ],
    solution: `const btn = document.querySelector("#theme-toggle-btn");\nbtn.addEventListener("click", () => {\n  const isDark = document.documentElement.getAttribute("data-theme") === "dark";\n  if (isDark) {\n    document.documentElement.removeAttribute("data-theme");\n    localStorage.setItem("theme", "light");\n    btn.textContent = "🌙 Темна тема";\n  } else {\n    document.documentElement.setAttribute("data-theme", "dark");\n    localStorage.setItem("theme", "dark");\n    btn.textContent = "☀️ Світла тема";\n  }\n});`,
    type: "js",
    testCode: `const btn = document.querySelector('#theme-toggle-btn');\nif (!btn) return {pass:false, message:"#theme-toggle-btn не знайдено."};\nbtn.click();\nawait new Promise(r => setTimeout(r, 0));\nif (document.documentElement.getAttribute('data-theme') !== 'dark') return {pass:false, message:"Після кліку document.documentElement має отримати data-theme=\\"dark\\"."};\nif (localStorage.getItem('theme') !== 'dark') return {pass:false, message:"localStorage має зберегти 'theme' зі значенням 'dark'."};\nif (!btn.textContent.includes('Світла')) return {pass:false, message:"Текст кнопки має змінитись на пропозицію світлої теми."};\nbtn.click();\nawait new Promise(r => setTimeout(r, 0));\nif (document.documentElement.hasAttribute('data-theme')) return {pass:false, message:"Повторний клік має ПРИБРАТИ атрибут data-theme."};\nif (localStorage.getItem('theme') !== 'light') return {pass:false, message:"localStorage має оновитись на 'light'."};\nreturn {pass:true, message:"Перемикач теми твого сайту тепер реально працює і пам'ятає вибір користувача."};`,
  },
  {
    id: "frontend-30",
    title: "Keyframe-анімації: @keyframes",
    theory:
      "transition (попередній урок) анімує перехід МІЖ двома станами (звичайний → :hover). @keyframes дозволяє описати БІЛЬШ СКЛАДНУ анімацію з декількома проміжними кроками — і, головне, вона може запускатись САМА, без потреби в :hover чи зміні класу.\n\n@keyframes ім'я { from { ... } to { ... } } (або 0%/50%/100% для більшої кількості кроків) визначає, як виглядає елемент на кожному етапі анімації. from = 0%, to = 100% — прості скорочення для найпростішого випадку «з одного стану в інший».\n\nВластивість animation на елементі підключає визначену анімацію: animation: fadeIn 0.5s ease; означає «виконай анімацію fadeIn за 0.5 секунди». Це аналог transition за синтаксисом, але animation прив'язується до @keyframes за ІМ'ЯМ, а не до конкретної властивості.\n\nТипове застосування — поява елемента при завантаженні сторінки (fade-in: opacity від 0 до 1) чи індикатор завантаження, що обертається нескінченно (animation: spin 1s linear infinite; — infinite означає «без зупинки», linear — рівномірна швидкість без прискорення).",
    previewHTML: `<div class="fade">Цей текст плавно з'являється</div>`,
    examples: [
      { title: "Плавна поява елемента", code: `@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n.fade {\n  animation: fadeIn 0.5s ease;\n}`, explain: "@keyframes fadeIn визначає ЩО відбувається (opacity 0 → 1), .fade каже, ЯКИЙ елемент і ЯК ДОВГО це триває." },
    ],
    presentation: [
      { title: "@keyframes проти transition", points: ["transition — перехід між двома станами (напр. :hover)", "@keyframes — самостійна анімація з кроками from/to", "animation підключає @keyframes за ім'ям до елемента"] },
    ],
    task: "Створи @keyframes з ім'ям fadeIn (from opacity: 0, to opacity: 1), і застосуй .fade { animation: fadeIn з тривалістю }.",
    starter: "",
    hints: [
      "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } — саме таке ім'я перевіряється.",
      ".fade { animation: fadeIn 0.5s ease; } — має посилатись на ІМ'Я fadeIn.",
      "@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.fade {\n  animation: fadeIn 0.5s ease;\n}",
    ],
    solution: `@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n.fade {\n  animation: fadeIn 0.5s ease;\n}`,
    type: "css",
    tests: [
      { re: /@keyframes\s+fadeIn\s*{[^}]*from\s*{[^}]*opacity\s*:\s*0/i, msg: "@keyframes fadeIn має мати from { opacity: 0; }." },
      { re: /@keyframes\s+fadeIn\s*{[^]*?to\s*{[^}]*opacity\s*:\s*1/i, msg: "@keyframes fadeIn має мати to { opacity: 1; }." },
      { re: /\.fade\s*{[^}]*animation\s*:\s*fadeIn/i, msg: ".fade має мати animation: fadeIn з тривалістю." },
    ],
  },
  {
    id: "frontend-31",
    title: "Debounce: не реагувати на КОЖНЕ натискання клавіші",
    theory:
      "Поле пошуку з живим фільтруванням («шукає, поки друкуєш») наївно реалізоване викликало б фільтрацію на КОЖНЕ натискання клавіші — при швидкому наборі це десятки зайвих викликів за секунду, часто марних (проміжні стани введення, а не фінальний запит). Debounce («затримка») відкладає виклик функції, ДОКИ користувач не ЗУПИНИТЬСЯ друкувати на вказаний час.\n\nМеханізм: debounce(fn, delay) повертає НОВУ функцію-обгортку, яка при КОЖНОМУ виклику спершу СКАСОВУЄ попередній запланований виклик (clearTimeout) і планує НОВИЙ (setTimeout) — тому реальний виклик fn() відбудеться лише один раз, через delay мілісекунд ПІСЛЯ ОСТАННЬОГО виклику обгортки.\n\nЦе класична, універсальна функція вищого порядку (функція, що повертає функцію) — той самий debounce підходить і для пошуку, і для валідації форми «на льоту», і для обробки resize вікна, де теж не варто реагувати на КОЖЕН піксель зміни розміру.\n\nЗамикання (closure) — ключова техніка тут: змінна timeoutId, оголошена ВСЕРЕДИНІ debounce, «запам'ятовується» поверненою функцією між викликами, хоча сама debounce() виконалась і завершилась лише один раз, при створенні обгортки.",
    domTemplate: `<input class="search-input"><p class="search-log"></p>`,
    example: { code: `function debounce(fn, delay) {\n  let timeoutId;\n  return function (...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn(...args), delay);\n  };\n}\n\nconst log = document.querySelector(".search-log");\nconst handleSearch = debounce((value) => {\n  log.textContent = "Шукаю: " + value;\n}, 300);\n\ndocument.querySelector(".search-input").addEventListener("input", (event) => {\n  handleSearch(event.target.value);\n});`, explain: "handleSearch викликається на КОЖНЕ натискання, але fn (реальний пошук) — лише через 300мс після ОСТАННЬОГО з них." },
    task: 'Напиши debounce(fn, delay), що повертає функцію-обгортку зі скиданням таймера через clearTimeout/setTimeout. Використай його для .search-input: на подію "input" виклич debounce-обгортку навколо функції, що записує "Шукаю: значення" у .search-log.',
    starter: "function debounce(fn, delay) {\n  // твій код тут\n}\n\n// const log = document.querySelector(\".search-log\");\n// const handleSearch = debounce((value) => {\n//   log.textContent = \"Шукаю: \" + value;\n// }, 300);\n// document.querySelector(\".search-input\").addEventListener(\"input\", (event) => {\n//   handleSearch(event.target.value);\n// });\n",
    hints: [
      "debounce повертає ФУНКЦІЮ (не викликає fn напряму) — усередині цієї функції clearTimeout(попереднього) і новий setTimeout.",
      "timeoutId оголошується ЗА МЕЖАМИ поверненої функції, щоб зберігатись між викликами (замикання).",
      "function debounce(fn, delay) {\n  let timeoutId;\n  return function (...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn(...args), delay);\n  };\n}\n\nconst log = document.querySelector(\".search-log\");\nconst handleSearch = debounce((value) => {\n  log.textContent = \"Шукаю: \" + value;\n}, 300);\n\ndocument.querySelector(\".search-input\").addEventListener(\"input\", (event) => {\n  handleSearch(event.target.value);\n});",
    ],
    solution: `function debounce(fn, delay) {\n  let timeoutId;\n  return function (...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn(...args), delay);\n  };\n}\n\nconst log = document.querySelector(".search-log");\nconst handleSearch = debounce((value) => {\n  log.textContent = "Шукаю: " + value;\n}, 300);\n\ndocument.querySelector(".search-input").addEventListener("input", (event) => {\n  handleSearch(event.target.value);\n});`,
    type: "js",
    testCode: `if (typeof debounce !== 'function') return {pass:false, message:"Функція debounce(fn, delay) не знайдена."};\nconst input = document.querySelector('.search-input');\nconst log = document.querySelector('.search-log');\nif (!input || !log) return {pass:false, message:".search-input/.search-log не знайдені."};\ninput.value = 'a';\ninput.dispatchEvent(new Event('input'));\ninput.value = 'ab';\ninput.dispatchEvent(new Event('input'));\ninput.value = 'abc';\ninput.dispatchEvent(new Event('input'));\nawait new Promise(r => setTimeout(r, 50));\nif (log.textContent.includes('abc')) return {pass:false, message:"До завершення затримки .search-log НЕ мав ще оновитись (debounce ще не спрацював)."};\nawait new Promise(r => setTimeout(r, 400));\nif (!log.textContent.includes('abc')) return {pass:false, message:"Після завершення затримки .search-log має показати ОСТАННЄ значення 'abc', а не проміжні."};\nreturn {pass:true, message:"debounce виконав функцію лише ОДИН раз, з останнім значенням — а не тричі на кожне натискання."};`,
  },
  {
    id: "frontend-32",
    title: "Плавна прокрутка до розділу за кліком",
    theory:
      "Меню сайту з посиланнями на власні розділи (\"Про нас\", \"Контакти\") часто ведуть до якорів (#about, #contact) — за замовчуванням браузер перестрибує до них МИТТЄВО, різким стрибком. Метод scrollIntoView({ behavior: \"smooth\" }) на ЦІЛЬОВОМУ елементі робить цей перехід плавним — той самий принцип, що вже застосовувався в кнопці «Догори» (js-41), лише там прокручували до самого верху сторінки (window.scrollTo), а тут — до КОНКРЕТНОГО елемента.\n\nВажливо викликати event.preventDefault() у обробнику кліку на посиланні-якорі — інакше браузер СПОЧАТКУ виконає свій стандартний, миттєвий перехід за href, а вже ПОТІМ (чи одночасно) спрацює твій JS, і результат стане непередбачуваним чи просто \"смикне\" сторінку двічі.\n\nЦільовий елемент знаходять за href самого посилання: посилання href=\"#section2\" вказує на елемент з id=\"section2\" — тому document.querySelector(link.getAttribute(\"href\")) одразу знаходить ПРАВИЛЬНИЙ елемент, незалежно від того, скільки таких посилань на сторінці і куди саме кожне з них веде.\n\nЦя техніка — основа «одностроінкового» (single-page) навігаційного меню: усі розділи технічно лежать на ОДНІЙ сторінці, а меню лише плавно прокручує до потрібного місця, без жодного реального переходу на іншу URL-адресу.",
    domTemplate: `<nav><a href="#section2" class="nav-link">До секції 2</a></nav><section id="section2">Секція 2</section>`,
    example: { code: `document.querySelector(".nav-link").addEventListener("click", (event) => {\n  event.preventDefault();\n  const targetId = event.currentTarget.getAttribute("href");\n  document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });\n});`, explain: "preventDefault зупиняє миттєвий перехід, а scrollIntoView зі behavior: \"smooth\" плавно прокручує до потрібної секції." },
    task: 'Підпишись на клік по .nav-link: виклич event.preventDefault(), прочитай href посилання (event.currentTarget.getAttribute("href")), знайди відповідний елемент через querySelector і виклич на ньому scrollIntoView({ behavior: "smooth" }).',
    starter: "// document.querySelector(\".nav-link\").addEventListener(\"click\", (event) => {\n//   event.preventDefault();\n//   ...\n// });\n",
    hints: [
      "event.currentTarget — це елемент, на якому ВИСИТЬ обробник (саме посилання), на відміну від event.target.",
      "getAttribute(\"href\") поверне рядок виду \"#section2\" — його МОЖНА передати напряму в querySelector.",
      "document.querySelector(\".nav-link\").addEventListener(\"click\", (event) => {\n  event.preventDefault();\n  const targetId = event.currentTarget.getAttribute(\"href\");\n  document.querySelector(targetId).scrollIntoView({ behavior: \"smooth\" });\n});",
    ],
    solution: `document.querySelector(".nav-link").addEventListener("click", (event) => {\n  event.preventDefault();\n  const targetId = event.currentTarget.getAttribute("href");\n  document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });\n});`,
    type: "js",
    testCode: `const link = document.querySelector('.nav-link');\nconst target = document.querySelector('#section2');\nif (!link || !target) return {pass:false, message:".nav-link/#section2 не знайдені."};\nlet calledOn = null;\nlet calledWith = null;\nconst orig = Element.prototype.scrollIntoView;\nElement.prototype.scrollIntoView = function(opts) { calledOn = this; calledWith = opts; };\nlink.click();\nawait new Promise(r => setTimeout(r, 0));\nElement.prototype.scrollIntoView = orig;\nif (calledOn !== target) return {pass:false, message:"scrollIntoView має бути викликаний саме на #section2."};\nif (!calledWith || calledWith.behavior !== 'smooth') return {pass:false, message:'scrollIntoView має бути викликаний з { behavior: "smooth" }.'};\nreturn {pass:true, message:"Тепер посилання меню плавно прокручують до потрібного розділу тієї самої сторінки."};`,
  },
  {
    id: "frontend-33",
    title: "Проєкт: відгуки — розмітка",
    theory:
      "Перший з трьох уроків блоку відгуків з кнопкою «Показати ще» — типовий патерн ПРОГРЕСИВНОГО РОЗКРИТТЯ контенту: показати лише КІЛЬКА елементів одразу, а решту — за запитом, щоб не перевантажувати сторінку одразу всім масивом даних.\n\nСтруктура: <section class=\"testimonials\">, усередині — щонайменше 6 <div class=\"testimonial\">, з яких ОСТАННІ 3 одразу мають ДОДАТКОВИЙ клас \"hidden\" (наступний CSS-урок сховає саме їх), і <button class=\"show-more\">Показати ще</button> ПІСЛЯ всіх відгуків.\n\nКожен .testimonial містить текст відгуку (p) і, за бажанням, ім'я автора (наприклад, у другому p чи в span) — мінімум одна вимога: непорожній текстовий вміст.\n\nЦей патерн економить і місце на екрані, і час завантаження (якщо зображення чи аватари клієнтів завантажуються лише для видимих карток) — хоча в цьому спрощеному варіанті всі відгуки вже в HTML, лише приховані CSS-ом, справжня «лінива» версія довантажувала б додаткові відгуки з сервера при кліку.",
    examples: [
      { title: "6 відгуків, 3 приховані одразу", code: `<section class="testimonials">\n  <div class="testimonial"><p>Чудовий сервіс!</p></div>\n  <div class="testimonial"><p>Швидка доставка.</p></div>\n  <div class="testimonial"><p>Рекомендую всім.</p></div>\n  <div class="testimonial hidden"><p>Дуже задоволений.</p></div>\n  <div class="testimonial hidden"><p>Найкраща якість.</p></div>\n  <div class="testimonial hidden"><p>Буду замовляти ще.</p></div>\n  <button class="show-more">Показати ще</button>\n</section>`, explain: "Перші 3 .testimonial видимі одразу, останні 3 мають додатковий клас hidden — CSS сховає саме їх." },
    ],
    presentation: [
      { title: "Прогресивне розкриття", points: ["Показати кілька елементів одразу, решту — за запитом", "Останні .testimonial одразу мають клас hidden", ".show-more — кнопка ПІСЛЯ всіх відгуків"] },
    ],
    task: 'Створи в main <section class="testimonials"> з щонайменше 6 <div class="testimonial"> (текст відгуку в p кожного), де ОСТАННІ 3 мають додатковий клас "hidden", і <button class="show-more">Показати ще</button> в кінці.',
    starter: "",
    hints: [
      "Перші 3 .testimonial — БЕЗ hidden, останні 3 — З класом hidden (два класи: \"testimonial hidden\").",
      ".show-more — ОСТАННІЙ елемент усередині .testimonials.",
      '<section class="testimonials">\n  <div class="testimonial"><p>Текст 1</p></div>\n  <div class="testimonial"><p>Текст 2</p></div>\n  <div class="testimonial"><p>Текст 3</p></div>\n  <div class="testimonial hidden"><p>Текст 4</p></div>\n  <div class="testimonial hidden"><p>Текст 5</p></div>\n  <div class="testimonial hidden"><p>Текст 6</p></div>\n  <button class="show-more">Показати ще</button>\n</section>',
    ],
    solution: `<section class="testimonials">\n  <div class="testimonial"><p>Чудовий сервіс, все швидко й якісно!</p></div>\n  <div class="testimonial"><p>Доставка прийшла раніше обіцяного терміну.</p></div>\n  <div class="testimonial"><p>Рекомендую всім друзям і знайомим.</p></div>\n  <div class="testimonial hidden"><p>Дуже задоволений покупкою, дякую!</p></div>\n  <div class="testimonial hidden"><p>Найкраща якість за такою ціною.</p></div>\n  <div class="testimonial hidden"><p>Буду замовляти ще не раз.</p></div>\n  <button class="show-more">Показати ще</button>\n</section>`,
    type: "html",
    check: (doc) => {
      const section = doc.querySelector("section.testimonials");
      if (!section) return { pass: false, message: 'Потрібна <section class="testimonials">.' };
      const all = section.querySelectorAll(":scope > div.testimonial");
      if (all.length < 6) return { pass: false, message: `Потрібно щонайменше 6 <div class="testimonial">, зараз: ${all.length}.` };
      for (const t of all) {
        if (!t.textContent.trim()) return { pass: false, message: "Кожен .testimonial має містити текст." };
      }
      const hidden = section.querySelectorAll(":scope > div.testimonial.hidden");
      if (hidden.length < 3) return { pass: false, message: 'Щонайменше 3 .testimonial мають додатковий клас "hidden".' };
      const btn = section.querySelector(":scope > button.show-more");
      if (!btn || !btn.textContent.trim()) return { pass: false, message: 'Потрібна <button class="show-more"> у кінці секції.' };
      return { pass: true, message: "Розмітка готова. Наступний CSS сховає позначені відгуки, а JS покаже їх за кліком на кнопку." };
    },
  },
  {
    id: "frontend-34",
    title: "Проєкт: відгуки — приховані картки",
    theory:
      "Другий урок: сховай усі елементи з класом .hidden. Тут той самий інструмент, що вже застосовувався тричі (FAQ, таби) — .hidden { display: none; } — але тепер клас НАЗИВАЄТЬСЯ інакше й НЕ комбінується з батьківським класом (немає потреби в .testimonial.hidden — досить просто .hidden, бо цей клас з самого початку означає «приховано», незалежно від того, на якому елементі він стоїть).\n\nЦе робить .hidden УНІВЕРСАЛЬНИМ допоміжним класом (utility class) — його теоретично можна перевикористати для приховування БУДЬ-ЯКОГО елемента на сторінці, не лише .testimonial, просто додавши цей самий клас.\n\nДодай трохи стилю самим карткам відгуків (.testimonial) — padding, border-radius, background-color — щоб вони виглядали як акуратні картки, а не голий текст.\n\nКнопку .show-more теж варто стилізувати (cursor: pointer, padding) — вона поки НІЧОГО не робить (це виправить наступний, останній JS-урок), але має виглядати клікабельною вже зараз.",
    previewHTML: `<div class="testimonial"><p>Видимий відгук</p></div><div class="testimonial hidden"><p>Прихований відгук</p></div><button class="show-more">Показати ще</button>`,
    examples: [
      { title: "Універсальний .hidden і стилі картки", code: `.hidden {\n  display: none;\n}\n\n.testimonial {\n  padding: 16px;\n  border-radius: 8px;\n  background-color: #f8fafc;\n}\n\n.show-more {\n  cursor: pointer;\n  padding: 8px 16px;\n}`, explain: ".hidden не прив'язаний до .testimonial — це самостійний, перевикористовуваний допоміжний клас." },
    ],
    presentation: [
      { title: "Utility-клас", points: [".hidden { display: none; } — самостійний, БЕЗ прив'язки до .testimonial", "Можна перевикористати для будь-якого елемента", "JS у наступному уроці буде ПРИБИРАТИ цей клас"] },
    ],
    task: "Створи .hidden (display: none), стилізуй .testimonial (padding, border-radius, background-color) і .show-more (cursor: pointer, padding).",
    starter: "",
    hints: [
      ".hidden — самостійне правило, БЕЗ .testimonial попереду.",
      ".testimonial і .show-more — окремі правила з візуальними стилями.",
      ".hidden {\n  display: none;\n}\n.testimonial {\n  padding: 16px;\n  border-radius: 8px;\n  background-color: #f8fafc;\n}\n.show-more {\n  cursor: pointer;\n  padding: 8px 16px;\n}",
    ],
    solution: `.hidden {\n  display: none;\n}\n\n.testimonial {\n  padding: 16px;\n  border-radius: 8px;\n  background-color: #f8fafc;\n}\n\n.show-more {\n  cursor: pointer;\n  padding: 8px 16px;\n}`,
    type: "css",
    tests: [
      { re: /\.hidden\s*{[^}]*display\s*:\s*none/i, msg: ".hidden має мати display: none." },
      { re: /\.testimonial\s*{[^}]*padding\s*:\s*[^;]+;/i, msg: ".testimonial має мати padding." },
      { re: /\.testimonial\s*{[^}]*background-color\s*:\s*[^;]+;/i, msg: ".testimonial має мати background-color." },
      { re: /\.show-more\s*{[^}]*cursor\s*:\s*pointer/i, msg: ".show-more має мати cursor: pointer." },
    ],
  },
  {
    id: "frontend-35",
    title: "Проєкт: відгуки — «Показати ще»",
    theory:
      "Останній урок відгуків: клік на .show-more прибирає клас .hidden з УСІХ прихованих відгуків одночасно, і ховає саму кнопку (бо показувати вже нічого — усі відгуки видимі).\n\nquerySelectorAll(\".hidden\").forEach(el => el.classList.remove(\"hidden\")) — простий і прямий спосіб показати ВСІ приховані елементи за один прохід, без потреби рахувати, скільки їх і які саме.\n\nПісля показу решти відгуків сама кнопка «Показати ще» втрачає сенс — приховай ЇЇ теж (event.target.style.display = \"none\" чи event.target.remove()), щоб інтерфейс не показував користувачу дію, яка вже нічого не змінить.\n\nЦе завершує весь блок відгуків: HTML визначив, ЩО показати спочатку, а що приховати; CSS визначив, ЯК саме виглядає приховування; JS з'єднав ці дві частини одним кліком користувача.",
    domTemplate: `<section class="testimonials"><div class="testimonial">Видимий 1</div><div class="testimonial hidden">Прихований 1</div><div class="testimonial hidden">Прихований 2</div><button class="show-more">Показати ще</button></section>`,
    example: { code: `document.querySelector(".show-more").addEventListener("click", (event) => {\n  document.querySelectorAll(".testimonials .hidden").forEach((el) => el.classList.remove("hidden"));\n  event.target.style.display = "none";\n});`, explain: "forEach прибирає клас hidden з УСІХ прихованих відгуків одразу, а сама кнопка ховається після кліку, бо більше нічого показувати." },
    task: 'Підпишись на клік по .show-more: прибери клас "hidden" з УСІХ .testimonials .hidden через forEach, і сховай саму кнопку (event.target.style.display = "none").',
    starter: "// document.querySelector(\".show-more\").addEventListener(\"click\", (event) => {\n//   ...\n// });\n",
    hints: [
      "querySelectorAll(\".testimonials .hidden\") знаходить УСІ приховані відгуки одразу.",
      "forEach(el => el.classList.remove(\"hidden\")) прибирає клас у кожного знайденого елемента.",
      "document.querySelector(\".show-more\").addEventListener(\"click\", (event) => {\n  document.querySelectorAll(\".testimonials .hidden\").forEach((el) => el.classList.remove(\"hidden\"));\n  event.target.style.display = \"none\";\n});",
    ],
    solution: `document.querySelector(".show-more").addEventListener("click", (event) => {\n  document.querySelectorAll(".testimonials .hidden").forEach((el) => el.classList.remove("hidden"));\n  event.target.style.display = "none";\n});`,
    type: "js",
    testCode: `const btn = document.querySelector('.show-more');\nconst hiddenBefore = document.querySelectorAll('.testimonials .hidden');\nif (!btn || hiddenBefore.length < 2) return {pass:false, message:".show-more/.hidden не знайдені."};\nbtn.click();\nawait new Promise(r => setTimeout(r, 0));\nconst hiddenAfter = document.querySelectorAll('.testimonials .hidden');\nif (hiddenAfter.length !== 0) return {pass:false, message:"Усі .hidden мають зникнути після кліку на 'Показати ще'."};\nif (btn.style.display !== 'none') return {pass:false, message:"Сама кнопка 'Показати ще' має сховатись після кліку (style.display = 'none')."};\nreturn {pass:true, message:"Готово — усі відгуки твого сайту тепер видимі за один клік, а кнопка коректно ховається, коли більше нічого показувати."};`,
  },
  {
    id: "frontend-36",
    title: "Фінальний проєкт: підготуй і опублікуй свій сайт",
    theory:
      "Останній крок усього напрямку Frontend — і всієї трійці HTML/CSS/JS курсів разом: твій сайт у «Мій сайт» уже РЕАЛЬНО ПРАЦЮЄ (структура, стилі, інтерактивні компоненти) — залишилось зробити його доступним БУДЬ-КОМУ в інтернеті, а не лише тобі в цьому редакторі.\n\nGitHub Pages — безкоштовний хостинг статичних сайтів (HTML/CSS/JS БЕЗ бекенду) прямо з GitHub-репозиторію. Шлях: (1) на вкладці «Мій сайт» натисни «Завантажити сайт» — отримаєш три файли: index.html, style.css, script.js; (2) створи новий репозиторій на github.com (кнопка «New»); (3) завантаж усі три файли через веб-інтерфейс GitHub (кнопка «Add file» → «Upload files», перетягни файли мишею — без жодних git-команд у терміналі); (4) у Settings → Pages вибери Source: Deploy from a branch, гілку main, папку / (root) → Save; (5) через хвилину-дві сайт стане доступний за адресою на кшталт https://твій-нікнейм.github.io/назва-репозиторію/.\n\nКритично важливо: файл ГОЛОВНОЇ сторінки МАЄ називатись ТОЧНО index.html (маленькими літерами) — GitHub Pages (як і будь-який веб-сервер) шукає САМЕ цю назву за замовчуванням, коли хтось відкриває корінь сайту без вказання конкретної сторінки.\n\nЦе — справжня публікація: результат буде видимий у Google, ним можна поділитись посиланням у резюме чи портфоліо, і саме так виглядає найпростіший, БЕЗКОШТОВНИЙ шлях від коду в редакторі до сайту в реальному інтернеті.",
    examples: [
      { title: "Мінімальний index.html, готовий для GitHub Pages", code: `<!DOCTYPE html>\n<html lang="uk">\n<head>\n  <meta charset="UTF-8">\n  <title>Мій сайт</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Ласкаво просимо</h1>\n  <footer><p>Автор: Твоє ім'я</p></footer>\n  <script src="script.js" defer></script>\n</body>\n</html>`, explain: "Файл називається ТОЧНО index.html — саме цю назву GitHub Pages (і будь-який веб-сервер) відкриває за замовчуванням." },
    ],
    presentation: [
      { title: "Шлях від коду до реального сайту", points: ["Завантаж index.html/style.css/script.js кнопкою на «Мій сайт»", "Створи репозиторій на GitHub, завантаж файли через веб-інтерфейс", "Settings → Pages → Deploy from branch → main → / (root)"] },
      { title: "Результат", points: ["Сайт стає доступний за https://нікнейм.github.io/репозиторій/", "Індексується Google, можна додати в резюме чи портфоліо", "index.html — обов'язкова точна назва головного файлу"] },
      { title: "Шлях за 16 напрямків", points: ["HTML — структура, CSS — вигляд, JS — поведінка", "Frontend — усі три разом у реальних, інтерактивних компонентах", "Тепер це не навчальна вправа — це сайт, доступний будь-кому в інтернеті"] },
    ],
    task: 'Створи повний, готовий до публікації index.html: <!DOCTYPE html>, <html lang="uk">, <head> з <title> (непорожній) і <link rel="stylesheet" href="style.css">, <body> з будь-яким заголовком і <footer>, що містить твоє ім\'я чи псевдонім, і <script src="script.js" defer></script> перед закриттям body.',
    starter: "",
    hints: [
      "Не забудь усі частини: DOCTYPE, head з title і link, body з footer, script з defer.",
      "footer має містити НЕПОРОЖНІЙ текст (твоє ім'я чи псевдонім) — саме так підписують авторство сторінки.",
      '<!DOCTYPE html>\n<html lang="uk">\n<head>\n  <meta charset="UTF-8">\n  <title>Мій сайт</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Ласкаво просимо</h1>\n  <footer><p>Автор: Твоє ім\'я</p></footer>\n  <script src="script.js" defer></script>\n</body>\n</html>',
    ],
    solution: `<!DOCTYPE html>\n<html lang="uk">\n<head>\n  <meta charset="UTF-8">\n  <title>Мій сайт</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Ласкаво просимо на мій сайт</h1>\n  <footer><p>Автор: Оксана Петренко</p></footer>\n  <script src="script.js" defer></script>\n</body>\n</html>`,
    type: "html",
    check: (doc, raw) => {
      if (!/<!DOCTYPE html>/i.test(raw)) return { pass: false, message: "Потрібен <!DOCTYPE html> на самому початку файлу." };
      const title = doc.querySelector("title");
      if (!title || !title.textContent.trim()) return { pass: false, message: "Потрібен непорожній <title>." };
      const link = doc.querySelector('link[rel="stylesheet"][href="style.css"]');
      if (!link) return { pass: false, message: 'Потрібен <link rel="stylesheet" href="style.css">.' };
      const footer = doc.querySelector("footer");
      if (!footer || !footer.textContent.trim()) return { pass: false, message: "Потрібен <footer> з непорожнім текстом (твоє ім'я чи псевдонім)." };
      const script = doc.querySelector('script[src="script.js"]');
      if (!script || !script.hasAttribute("defer")) return { pass: false, message: 'Потрібен <script src="script.js" defer>.' };
      return { pass: true, message: "Готово! Це і є index.html, готовий для GitHub Pages — завантаж свій реальний сайт кнопкою «Завантажити сайт» на сторінці «Мій сайт» і опублікуй його насправді." };
    },
  },
];

// Milestone lessons whose submitted code EXTENDS the same growing "Мій сайт"
// project that HTML_LESSONS/CSS_LESSONS/JS_LESSONS milestones already feed
// (see HEADER_MILESTONE/MAIN_MILESTONES/CSS_MILESTONES/JS_MILESTONES in
// App.jsx). Kept as separate arrays (rather than merged into the existing
// ones) because completion here is tracked under progress.completed.frontend,
// not .html/.css/.javascript — see handleComplete's isHtmlMilestone/etc.
export const FRONTEND_MAIN_MILESTONES = ["frontend-4", "frontend-11", "frontend-16", "frontend-21", "frontend-27", "frontend-33"];
export const FRONTEND_CSS_MILESTONES = ["frontend-5", "frontend-12", "frontend-17", "frontend-22", "frontend-28", "frontend-34"];
export const FRONTEND_JS_MILESTONES = ["frontend-7", "frontend-13", "frontend-18", "frontend-24", "frontend-29", "frontend-35"];
