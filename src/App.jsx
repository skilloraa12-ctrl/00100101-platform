import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Home as HomeIcon, BookOpen, Library, Hash, Globe, Languages, Trophy,
  Search, Play, RotateCcw, CheckCircle2, XCircle, Lightbulb, ChevronRight,
  ChevronLeft, Circle, CheckCircle, Menu, X, Terminal, Code2, Flame, Star, Info
} from "lucide-react";

/* =========================================================================
   DATA LAYER
   Every lesson/entry below is real content — no placeholders pretending to
   be lessons. This is a starter set (HTML: 9, CSS: 5, JavaScript: 5) built
   to the exact schema described in README.md, so you can extend every
   course toward 100 blocks yourself by copying the shape of an existing
   lesson. See README.md → "Як додати новий урок".
   ========================================================================= */

const HTML_LESSONS = [
  {
    id: "html-1",
    title: "Що таке HTML",
    theory:
      "HTML (HyperText Markup Language) — це мова розмітки, якою описують структуру вебсторінки. Це не мова програмування: тут немає обчислень чи логіки, тільки теги, які кажуть браузеру, що є що на сторінці — заголовок, абзац, посилання, зображення. Кожен тег зазвичай має відкриваючу <тег> і закриваючу </тег> частину, а текст або інші теги лежать між ними.",
    example: { code: `<h1>Привіт, світ!</h1>`, explain: "Тег <h1> — головний заголовок сторінки. Браузер покаже його великим жирним текстом." },
    task: 'Створи заголовок першого рівня (тег h1) з текстом "Привіт, світ!".',
    starter: "",
    hints: [
      "Заголовок першого рівня створюється тегом <h1>.",
      "Не забудь закриваючий тег </h1> — без нього розмітка неповна.",
      "Приклад: <h1>Привіт, світ!</h1>",
    ],
    solution: `<h1>Привіт, світ!</h1>`,
    type: "html",
    check: (doc) => {
      const h1 = doc.querySelector("h1");
      if (!h1) return { pass: false, message: "Не знайдено тег <h1>. Додай заголовок першого рівня." };
      if (h1.textContent.trim() !== "Привіт, світ!")
        return { pass: false, message: `Текст усередині <h1> має бути точно "Привіт, світ!" (зараз: "${h1.textContent.trim()}").` };
      return { pass: true, message: "Тег h1 використовується для головного заголовка сторінки — саме це ти щойно створила." };
    },
  },
  {
    id: "html-2",
    title: "Структура документа",
    theory:
      "Кожна повноцінна HTML-сторінка має скелет: <html> — корінь документа, <head> — службова частина (заголовок вкладки, підключення стилів, метадані — не видима на сторінці), <body> — усе, що бачить користувач. Тег <title> всередині <head> задає назву вкладки браузера.",
    example: {
      code: `<html>\n  <head>\n    <title>Моя сторінка</title>\n  </head>\n  <body>\n    <h1>Привіт!</h1>\n  </body>\n</html>`,
      explain: "head не показується на сторінці, а body — показується повністю.",
    },
    task: 'Побудуй повний скелет документа: <html>, <head> з <title>Моя сторінка</title>, і <body> з будь-яким заголовком h1.',
    starter: "",
    hints: [
      "Потрібні три обов'язкові теги: html, head, body.",
      "Тег title лежить усередині head, а не body.",
      "Приклад: <html><head><title>Моя сторінка</title></head><body><h1>Привіт</h1></body></html>",
    ],
    solution: `<html>\n  <head>\n    <title>Моя сторінка</title>\n  </head>\n  <body>\n    <h1>Привіт!</h1>\n  </body>\n</html>`,
    type: "html",
    check: (doc, raw) => {
      const hasHtml = /<html[\s>]/i.test(raw);
      const hasHead = /<head[\s>]/i.test(raw);
      const hasBody = /<body[\s>]/i.test(raw);
      if (!hasHtml || !hasHead || !hasBody)
        return { pass: false, message: "Потрібні всі три теги: <html>, <head> та <body>." };
      const title = doc.querySelector("title");
      if (!title || title.textContent.trim() !== "Моя сторінка")
        return { pass: false, message: 'Тег <title> має містити рівно "Моя сторінка".' };
      if (!doc.body || !doc.body.querySelector("h1"))
        return { pass: false, message: "У <body> має бути хоча б один <h1>." };
      return { pass: true, message: "Ось базовий скелет будь-якої HTML-сторінки. Тепер ти завжди знатимеш, з чого починати." };
    },
  },
  {
    id: "html-3",
    title: "Заголовки h1–h6",
    theory:
      "HTML має шість рівнів заголовків: від <h1> (найважливіший, зазвичай один на сторінку) до <h6> (найменш важливий). Це не просто розмір шрифту — це структура змісту, за якою орієнтуються і читачі, і пошукові системи, і програми для людей з порушенням зору.",
    example: { code: `<h1>Розділ</h1>\n<h2>Підрозділ</h2>`, explain: "h2 логічно вкладений у h1 — це підпункт." },
    task: "Створи h1 з текстом «Мій блог» і h2 з текстом «Перший запис».",
    starter: "",
    hints: [
      "Потрібні два теги: h1 і h2, кожен з власним текстом.",
      "Порядок: спочатку h1, потім h2.",
      "Приклад: <h1>Мій блог</h1><h2>Перший запис</h2>",
    ],
    solution: `<h1>Мій блог</h1>\n<h2>Перший запис</h2>`,
    type: "html",
    check: (doc) => {
      const h1 = doc.querySelector("h1");
      const h2 = doc.querySelector("h2");
      if (!h1 || h1.textContent.trim() !== "Мій блог") return { pass: false, message: 'Потрібен <h1>Мій блог</h1>.' };
      if (!h2 || h2.textContent.trim() !== "Перший запис") return { pass: false, message: 'Потрібен <h2>Перший запис</h2>.' };
      return { pass: true, message: "Рівні заголовків задають ієрархію змісту сторінки — саме так її читають скрінрідери." };
    },
  },
  {
    id: "html-4",
    title: "Абзаци та посилання",
    theory:
      "Тег <p> — це абзац тексту. Тег <a> — посилання, воно обов'язково має атрибут href з адресою переходу. Атрибути пишуться всередині відкриваючого тега у форматі ім'я=\"значення\".",
    example: { code: `<p>Читай далі на <a href="https://example.com">example.com</a>.</p>`, explain: "href — обов'язковий атрибут посилання." },
    task: 'Створи абзац (p), а всередині нього посилання (a) з href="https://example.com" і текстом "Приклад".',
    starter: "",
    hints: [
      "Спочатку відкрий <p>, всередині нього розмісти <a href=\"...\">.",
      "Текст посилання має бути точно «Приклад».",
      'Приклад: <p><a href="https://example.com">Приклад</a></p>',
    ],
    solution: `<p><a href="https://example.com">Приклад</a></p>`,
    type: "html",
    check: (doc) => {
      const p = doc.querySelector("p");
      if (!p) return { pass: false, message: "Потрібен тег <p>." };
      const a = p.querySelector("a");
      if (!a) return { pass: false, message: "Усередині <p> потрібне посилання <a>." };
      if (!a.getAttribute("href")) return { pass: false, message: "У <a> відсутній атрибут href." };
      if (a.textContent.trim() !== "Приклад") return { pass: false, message: 'Текст посилання має бути "Приклад".' };
      return { pass: true, message: "href каже браузеру, куди веде посилання — без нього <a> нікуди не веде." };
    },
  },
  {
    id: "html-5",
    title: "Зображення",
    theory:
      "Тег <img> не має закриваючого тега — це «порожній» елемент. Атрибут src вказує шлях до файлу зображення, а alt — текстовий опис на випадок, якщо картинка не завантажиться, або для людей, які користуються скрінрідером. alt — не декоративний, а обов'язковий для доступності.",
    example: { code: `<img src="cat.jpg" alt="Рудий кіт спить на дивані">`, explain: "alt описує зміст картинки словами." },
    task: 'Додай зображення з src="cat.jpg" та alt="Кіт".',
    starter: "",
    hints: ["img — самозакривний тег, без </img>.", "Потрібні обидва атрибути: src і alt.", 'Приклад: <img src="cat.jpg" alt="Кіт">'],
    solution: `<img src="cat.jpg" alt="Кіт">`,
    type: "html",
    check: (doc) => {
      const img = doc.querySelector("img");
      if (!img) return { pass: false, message: "Потрібен тег <img>." };
      if (img.getAttribute("src") !== "cat.jpg") return { pass: false, message: 'src має дорівнювати "cat.jpg".' };
      if (img.getAttribute("alt") !== "Кіт") return { pass: false, message: 'alt має дорівнювати "Кіт".' };
      return { pass: true, message: "alt важливий не лише для доступності — Google теж читає його, щоб зрозуміти зображення." };
    },
  },
  {
    id: "html-6",
    title: "Списки",
    theory:
      "Маркований список — <ul> (unordered list), нумерований — <ol> (ordered list). Кожен пункт усередині — тег <li> (list item).",
    example: { code: `<ul>\n  <li>Хліб</li>\n  <li>Молоко</li>\n</ul>`, explain: "Кожен <li> — окремий пункт списку." },
    task: "Створи маркований список (ul) із трьома пунктами (li) на власний вибір.",
    starter: "",
    hints: ["Список — ul, пункти всередині — li.", "Пунктів має бути рівно 3.", "Приклад: <ul><li>Один</li><li>Два</li><li>Три</li></ul>"],
    solution: `<ul>\n  <li>Один</li>\n  <li>Два</li>\n  <li>Три</li>\n</ul>`,
    type: "html",
    check: (doc) => {
      const ul = doc.querySelector("ul");
      if (!ul) return { pass: false, message: "Потрібен тег <ul>." };
      const items = ul.querySelectorAll("li");
      if (items.length !== 3) return { pass: false, message: `Потрібно рівно 3 пункти <li>, зараз: ${items.length}.` };
      return { pass: true, message: "ul/li — базова структура будь-якого списку в HTML." };
    },
  },
  {
    id: "html-7",
    title: "div, span та атрибути",
    theory:
      "<div> і <span> самі по собі нічого не означають — це універсальні контейнери для групування вмісту, щоб потім стилізувати чи керувати ними через CSS/JS. div — блоковий (займає весь рядок), span — рядковий (тільки під свій вміст). Атрибути class і id дозволяють «позначити» елемент для CSS та JavaScript: id — унікальний на сторінці, class — можна повторювати.",
    example: { code: `<div class="card">\n  <span id="label">Нове</span>\n</div>`, explain: 'class="card" і id="label" — це «гачки» для CSS/JS.' },
    task: 'Створи <div class="card">, а всередині нього <span id="label"> з будь-яким текстом.',
    starter: "",
    hints: ['div має атрибут class="card".', 'span усередині div має атрибут id="label".', '<div class="card"><span id="label">Текст</span></div>'],
    solution: `<div class="card">\n  <span id="label">Нове</span>\n</div>`,
    type: "html",
    check: (doc) => {
      const div = doc.querySelector("div.card");
      if (!div) return { pass: false, message: 'Потрібен <div class="card">.' };
      const span = div.querySelector("span#label");
      if (!span) return { pass: false, message: 'Усередині div потрібен <span id="label">.' };
      return { pass: true, message: "class і span — не одне й те саме: class можна давати кільком елементам, id — лише одному." };
    },
  },
  {
    id: "html-8",
    title: "Форми: input, label, button",
    theory:
      "Форми збирають дані від користувача. <label> підписує поле (і клікабельний, якщо пов'язаний через for/id), <input> — поле вводу (type=\"text\" для тексту), <button> — кнопка дії.",
    example: {
      code: `<label for="name">Ім'я:</label>\n<input id="name" type="text">\n<button>Відправити</button>`,
      explain: 'for у label збігається з id в input — клік по підпису фокусує поле.',
    },
    task: 'Створи label з for="email", input типу text з id="email", і button з текстом "Відправити".',
    starter: "",
    hints: [
      'for у label має дорівнювати id у input: "email".',
      'input має атрибут type="text".',
      '<label for="email">Email</label><input id="email" type="text"><button>Відправити</button>',
    ],
    solution: `<label for="email">Email</label>\n<input id="email" type="text">\n<button>Відправити</button>`,
    type: "html",
    check: (doc) => {
      const label = doc.querySelector('label[for="email"]');
      if (!label) return { pass: false, message: 'Потрібен <label for="email">.' };
      const input = doc.querySelector('input#email[type="text"]');
      if (!input) return { pass: false, message: 'Потрібен <input id="email" type="text">.' };
      const btn = doc.querySelector("button");
      if (!btn || btn.textContent.trim() !== "Відправити") return { pass: false, message: 'Потрібна <button>Відправити</button>.' };
      return { pass: true, message: "for + id зв'язують підпис із полем — це і доступність, і зручність кліку." };
    },
  },
  {
    id: "html-9",
    title: "Фінальний проєкт: семантична сторінка",
    theory:
      "Семантичні теги описують не лише зовнішній вигляд, а й роль блоку: <header> — шапка, <nav> — навігація, <main> — головний унікальний вміст сторінки (один на сторінку), <footer> — підвал. Це допомагає браузерам, пошуковикам і скрінрідерам розуміти структуру, а не лише «купу div-ів».",
    example: {
      code: `<header>\n  <nav><a href="#">Головна</a></nav>\n</header>\n<main>\n  <h1>Заголовок</h1>\n</main>\n<footer>© 2026</footer>`,
      explain: "Кожен блок має свою чітку роль.",
    },
    task: "Зібери сторінку з header (містить nav), main (містить h1) і footer.",
    starter: "",
    hints: [
      "Потрібні всі чотири теги: header, nav, main, footer.",
      "nav має бути всередині header, h1 — всередині main.",
      "<header><nav><a href=\"#\">Меню</a></nav></header><main><h1>Заголовок</h1></main><footer>Підвал</footer>",
    ],
    solution: `<header>\n  <nav><a href="#">Меню</a></nav>\n</header>\n<main>\n  <h1>Заголовок</h1>\n</main>\n<footer>© 2026</footer>`,
    type: "html",
    check: (doc) => {
      const header = doc.querySelector("header");
      if (!header || !header.querySelector("nav")) return { pass: false, message: "header має містити nav." };
      const main = doc.querySelector("main");
      if (!main || !main.querySelector("h1")) return { pass: false, message: "main має містити h1." };
      if (!doc.querySelector("footer")) return { pass: false, message: "Потрібен footer." };
      return { pass: true, message: "Це вже структура справжньої сторінки. Наступна зупинка — CSS, щоб оживити її вигляд." };
    },
  },
  {
    id: "html-10",
    title: "Коментарі в HTML",
    theory:
      "Коментар <!-- ... --> не показується на сторінці — браузер повністю його ігнорує. Коментарі лишають нотатки для себе чи колег: чому щось зроблено саме так, або TODO — що доробити пізніше.",
    example: { code: `<!-- TODO: додати меню -->\n<p>Готовий вміст</p>`, explain: "Коментар видно лише в коді, не на сторінці." },
    task: 'Додай HTML-коментар зі словом "TODO" всередині, а також будь-який абзац (p).',
    starter: "",
    hints: ["Коментар відкривається <!-- і закривається -->.", 'Слово TODO має бути всередині коментаря.', '<!-- TODO: написати текст --><p>Текст</p>'],
    solution: `<!-- TODO: написати текст -->\n<p>Текст</p>`,
    type: "html",
    check: (doc, raw) => {
      if (!/<!--[\s\S]*TODO[\s\S]*-->/i.test(raw)) return { pass: false, message: "Потрібен коментар <!-- --> зі словом TODO всередині." };
      if (!doc.querySelector("p")) return { pass: false, message: "Додай ще й тег <p>." };
      return { pass: true, message: "Коментарі не впливають на те, що бачить користувач — лише на те, що бачить розробник у коді." };
    },
  },
  {
    id: "html-11",
    title: "Таблиці",
    theory:
      "Таблиця будується з <table>, рядків <tr> (table row), заголовкових комірок <th> (table header) і звичайних комірок <td> (table data). th зазвичай лежить у першому рядку й позначає назви колонок.",
    example: {
      code: `<table>\n  <tr><th>Товар</th><th>Ціна</th></tr>\n  <tr><td>Хліб</td><td>25</td></tr>\n</table>`,
      explain: "Перший рядок — заголовки (th), другий — дані (td).",
    },
    task: 'Створи таблицю з рядком заголовків (th): "Ім\'я" і "Вік", і одним рядком даних (td) із будь-якими значеннями.',
    starter: "",
    hints: ["Потрібні tr з двома th і tr з двома td.", 'Текст заголовків має бути точно "Ім\'я" і "Вік".', "<table>\n  <tr><th>Ім'я</th><th>Вік</th></tr>\n  <tr><td>Оля</td><td>20</td></tr>\n</table>"],
    solution: `<table>\n  <tr><th>Ім'я</th><th>Вік</th></tr>\n  <tr><td>Оля</td><td>20</td></tr>\n</table>`,
    type: "html",
    check: (doc) => {
      const ths = Array.from(doc.querySelectorAll("th")).map((t) => t.textContent.trim());
      if (ths.length < 2) return { pass: false, message: "Потрібно щонайменше два <th>." };
      if (!ths.includes("Ім'я") || !ths.includes("Вік")) return { pass: false, message: "th мають містити точно «Ім'я» і «Вік»." };
      const tds = doc.querySelectorAll("td");
      if (tds.length < 2) return { pass: false, message: "Потрібен рядок даних із двома <td>." };
      return { pass: true, message: "table/tr/th/td — стандартна структура будь-якої HTML-таблиці." };
    },
  },
  {
    id: "html-12",
    title: "Розширені форми: select і checkbox",
    theory:
      "select дає випадний список — кожен варіант оформлюється тегом <option>. input type=\"checkbox\" — прапорець, який можна вмикати/вимикати незалежно від інших.",
    example: {
      code: `<select>\n  <option>Київ</option>\n  <option>Львів</option>\n</select>\n<input type="checkbox"> Погоджуюсь`,
      explain: "select групує варіанти вибору, checkbox — незалежний перемикач.",
    },
    task: "Створи select щонайменше з двома option, і окремо input type=\"checkbox\".",
    starter: "",
    hints: ["select має містити хоча б два <option>.", 'checkbox: <input type="checkbox">', '<select><option>А</option><option>Б</option></select><input type="checkbox">'],
    solution: `<select>\n  <option>Київ</option>\n  <option>Львів</option>\n</select>\n<input type="checkbox">`,
    type: "html",
    check: (doc) => {
      const select = doc.querySelector("select");
      if (!select || select.querySelectorAll("option").length < 2) return { pass: false, message: "select має містити щонайменше два option." };
      if (!doc.querySelector('input[type="checkbox"]')) return { pass: false, message: 'Потрібен <input type="checkbox">.' };
      return { pass: true, message: "select і checkbox — два різні способи дати користувачу вибір: один варіант чи кілька незалежних." };
    },
  },
  {
    id: "html-13",
    title: "Доступність: aria-label",
    theory:
      "Коли кнопка чи посилання містить лише іконку без тексту, скрінрідер не має що прочитати. Атрибут aria-label додає прихований текстовий опис саме для програм читання з екрана — на вигляд сторінки він не впливає.",
    example: { code: `<button aria-label="Закрити">✕</button>`, explain: "Візуально видно тільки ✕, але скрінрідер скаже «Закрити»." },
    task: 'Створи button з aria-label="Закрити".',
    starter: "",
    hints: ["Атрибут пишеться в лапках: aria-label=\"...\"", 'Значення має бути точно "Закрити".', '<button aria-label="Закрити">✕</button>'],
    solution: `<button aria-label="Закрити">✕</button>`,
    type: "html",
    check: (doc) => {
      const btn = doc.querySelector("button[aria-label]");
      if (!btn) return { pass: false, message: "Потрібна кнопка з атрибутом aria-label." };
      if (btn.getAttribute("aria-label").trim() !== "Закрити") return { pass: false, message: 'aria-label має дорівнювати "Закрити".' };
      return { pass: true, message: "aria-атрибути — це місток між твоїм інтерфейсом і людьми, які користуються скрінрідером." };
    },
  },
  {
    id: "html-14",
    title: "Мета-теги та viewport",
    theory:
      "У <head> лежать службові meta-теги. <meta charset=\"UTF-8\"> каже браузеру, в якому кодуванні текст (без нього кирилиця може зламатися). <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> вмикає коректний масштаб на мобільних — без нього сторінка на телефоні виглядає як зменшена десктопна версія.",
    example: {
      code: `<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n</head>`,
      explain: "Обидва meta-теги майже завжди присутні на реальних сайтах.",
    },
    task: "Додай у head обидва meta-теги: charset UTF-8 і viewport.",
    starter: "",
    hints: ['charset: <meta charset="UTF-8">', 'viewport: <meta name="viewport" content="width=device-width, initial-scale=1">', "Обидва теги лежать всередині <head>."],
    solution: `<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n</head>`,
    type: "html",
    check: (doc, raw) => {
      if (!/charset\s*=\s*["']?UTF-8/i.test(raw)) return { pass: false, message: 'Потрібен <meta charset="UTF-8">.' };
      if (!/name\s*=\s*["']viewport["']/i.test(raw)) return { pass: false, message: 'Потрібен <meta name="viewport" ...>.' };
      return { pass: true, message: "Без viewport мобільний браузер вважатиме, що екран 980px завширшки, і зменшить усе під нього." };
    },
  },
  {
    id: "html-15",
    title: "Фінальний проєкт 2: сторінка з таблицею та формою",
    theory: "Об'єднай усе, що вивчила в цьому курсі: семантичну структуру, таблицю та форму — в одну сторінку.",
    example: { code: `<main>\n  <table><tr><th>Товар</th></tr></table>\n  <form><input type="text"></form>\n</main>`, explain: "Різні теги співіснують у одному main." },
    task: "У межах <main> розмісти і <table> з хоча б одним <th>, і <form> з хоча б одним <input>.",
    starter: "",
    hints: ["Обидва елементи — table і form — мають бути всередині main.", "table потребує хоча б одного th.", "<main><table><tr><th>Колонка</th></tr></table><form><input type=\"text\"></form></main>"],
    solution: `<main>\n  <table><tr><th>Товар</th></tr></table>\n  <form><input type="text"></form>\n</main>`,
    type: "html",
    check: (doc) => {
      const main = doc.querySelector("main");
      if (!main) return { pass: false, message: "Потрібен <main>." };
      if (!main.querySelector("table th")) return { pass: false, message: "У main потрібна таблиця з хоча б одним th." };
      if (!main.querySelector("form input")) return { pass: false, message: "У main потрібна форма з хоча б одним input." };
      return { pass: true, message: "Це вже фрагмент, схожий на реальну сторінку адмін-панелі чи каталогу товарів." };
    },
  },
];

const CSS_LESSONS = [
  {
    id: "css-1",
    title: "Селектори та кольори",
    theory:
      "CSS стилізує HTML через правила виду селектор { властивість: значення; }. Селектор p застосується до всіх <p>, .card — до всіх елементів з class=\"card\", #title — до елемента з id=\"title\". Колір тексту задає color, колір фону — background-color.",
    previewHTML: `<p class="lead">Привіт, я абзац з класом lead.</p>`,
    example: { code: `.lead {\n  color: #1d4ed8;\n  background-color: #eff6ff;\n}`, explain: "Селектор за класом застосує стиль до будь-якого елемента з class=\"lead\"." },
    task: 'Напиши правило для .lead, яке задає color та background-color (будь-які значення).',
    starter: "",
    hints: ["Селектор класу починається з крапки: .lead", "Потрібні обидві властивості: color і background-color.", ".lead {\n  color: blue;\n  background-color: #eee;\n}"],
    solution: `.lead {\n  color: #1d4ed8;\n  background-color: #eff6ff;\n}`,
    type: "css",
    tests: [
      { re: /\.lead\s*{[^}]*color\s*:\s*[^;]+;/i, msg: "Правило .lead має задавати color." },
      { re: /\.lead\s*{[^}]*background-color\s*:\s*[^;]+;/i, msg: "Правило .lead має задавати background-color." },
    ],
  },
  {
    id: "css-2",
    title: "Box model: margin, padding, width",
    theory:
      "Кожен HTML-елемент — прямокутник із чотирьох шарів: content (вміст), padding (внутрішній відступ, між вмістом і рамкою), border (рамка), margin (зовнішній відступ, від інших елементів). width/height задають розмір content-області.",
    previewHTML: `<div class="box">Блок</div>`,
    example: { code: `.box {\n  width: 200px;\n  padding: 10px;\n  margin: 20px;\n  background: #fde68a;\n}`, explain: "margin штовхає сусідні елементи, padding — розширює простір усередині." },
    task: "Створи блок шириною 200px та додай йому зовнішній відступ (margin) 20px.",
    starter: "",
    hints: ["Селектор — .box", "Потрібні властивості width: 200px і margin: 20px.", ".box {\n  width: 200px;\n  margin: 20px;\n}"],
    solution: `.box {\n  width: 200px;\n  margin: 20px;\n  background: #fde68a;\n}`,
    type: "css",
    tests: [
      { re: /\.box\s*{[^}]*width\s*:\s*200px\s*;/i, msg: "Потрібно width: 200px у .box." },
      { re: /\.box\s*{[^}]*margin\s*:\s*20px\s*;/i, msg: "Потрібно margin: 20px у .box." },
    ],
  },
  {
    id: "css-3",
    title: "Flexbox",
    theory:
      "display: flex перетворює елемент на flex-контейнер — його прямі діти вишиковуються в ряд (за замовчуванням горизонтально). justify-content керує вирівнюванням по головній осі, gap додає відступ між елементами без margin.",
    previewHTML: `<div class="row"><div class="item">1</div><div class="item">2</div><div class="item">3</div></div>`,
    example: { code: `.row {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n}`, explain: "Три .item стануть у ряд по центру з відступом 12px." },
    task: "Зроби .row flex-контейнером (display: flex) з gap: 12px.",
    starter: "",
    hints: ["Потрібна властивість display: flex.", "Додай ще gap: 12px.", ".row {\n  display: flex;\n  gap: 12px;\n}"],
    solution: `.row {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n}`,
    type: "css",
    tests: [
      { re: /\.row\s*{[^}]*display\s*:\s*flex\s*;/i, msg: "Потрібно display: flex у .row." },
      { re: /\.row\s*{[^}]*gap\s*:\s*12px\s*;/i, msg: "Потрібно gap: 12px у .row." },
    ],
  },
  {
    id: "css-4",
    title: "Позиціонування",
    theory:
      "position: relative зсуває елемент відносно його звичайного місця, не виймаючи інших елементів з потоку. position: absolute виймає елемент з потоку і позиціонує його відносно найближчого предка з position, відмінним від static (найчастіше — relative-батька).",
    previewHTML: `<div class="frame"><div class="badge">NEW</div></div>`,
    example: { code: `.frame { position: relative; }\n.badge {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}`, explain: "badge приліпає до кутка frame." },
    task: "Зроби .frame position: relative, а .badge — position: absolute з top: 8px і right: 8px.",
    starter: "",
    hints: [".frame має position: relative.", ".badge має position: absolute з top і right.", ".frame { position: relative; }\n.badge { position: absolute; top: 8px; right: 8px; }"],
    solution: `.frame { position: relative; }\n.badge {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}`,
    type: "css",
    tests: [
      { re: /\.frame\s*{[^}]*position\s*:\s*relative\s*;/i, msg: ".frame має бути position: relative." },
      { re: /\.badge\s*{[^}]*position\s*:\s*absolute\s*;/i, msg: ".badge має бути position: absolute." },
    ],
  },
  {
    id: "css-5",
    title: "Фінальний проєкт: стилізуй картку",
    theory: "Об'єднай усе, що вивчила: box model, кольори, flexbox і border-radius для заокруглень.",
    previewHTML: `<div class="card"><h3>Заголовок картки</h3><p>Опис картки українською.</p></div>`,
    example: { code: `.card {\n  padding: 16px;\n  border-radius: 12px;\n  background: white;\n}`, explain: "border-radius заокруглює кути." },
    task: "Додай .card: padding, background (будь-який колір), і border-radius не менше 8px.",
    starter: "",
    hints: ["Потрібні три властивості: padding, background, border-radius.", "border-radius задається в px, наприклад 12px.", ".card {\n  padding: 16px;\n  background: #f8fafc;\n  border-radius: 12px;\n}"],
    solution: `.card {\n  padding: 16px;\n  background: #f8fafc;\n  border-radius: 12px;\n}`,
    type: "css",
    tests: [
      { re: /\.card\s*{[^}]*padding\s*:\s*[^;]+;/i, msg: "Потрібен padding у .card." },
      { re: /\.card\s*{[^}]*background\s*:\s*[^;]+;/i, msg: "Потрібен background у .card." },
      { re: /\.card\s*{[^}]*border-radius\s*:\s*[^;]+;/i, msg: "Потрібен border-radius у .card." },
    ],
  },
  {
    id: "css-6",
    title: "Типографіка",
    theory:
      "font-size задає розмір шрифту, font-weight — товщину (normal, bold, або число 100–900), line-height — висоту рядка (впливає на читабельність довгого тексту).",
    previewHTML: `<p class="text">Текст, який стане зручніше читати після стилізації.</p>`,
    example: { code: `.text {\n  font-size: 18px;\n  font-weight: 600;\n  line-height: 1.6;\n}`, explain: "line-height: 1.6 — рядок у 1.6 раза вищий за розмір шрифту." },
    task: "Задай .text: font-size, font-weight і line-height (будь-які розумні значення).",
    starter: "",
    hints: ["Потрібні всі три властивості.", "font-size у px, line-height можна без одиниць.", ".text {\n  font-size: 18px;\n  font-weight: 600;\n  line-height: 1.6;\n}"],
    solution: `.text {\n  font-size: 18px;\n  font-weight: 600;\n  line-height: 1.6;\n}`,
    type: "css",
    tests: [
      { re: /\.text\s*{[^}]*font-size\s*:\s*[^;]+;/i, msg: "Потрібен font-size у .text." },
      { re: /\.text\s*{[^}]*font-weight\s*:\s*[^;]+;/i, msg: "Потрібен font-weight у .text." },
      { re: /\.text\s*{[^}]*line-height\s*:\s*[^;]+;/i, msg: "Потрібен line-height у .text." },
    ],
  },
  {
    id: "css-7",
    title: "Псевдоклас :hover",
    theory:
      "селектор:hover застосовує стиль, поки курсор миші над елементом — без жодного JavaScript. Це основа для кнопок, які «відповідають» на наведення.",
    previewHTML: `<button class="btn">Наведи курсор</button>`,
    example: { code: `.btn:hover {\n  background-color: #1d4ed8;\n}`, explain: "Фон зміниться лише під час наведення." },
    task: "Додай правило .btn:hover, яке змінює background-color.",
    starter: "",
    hints: ["Двокрапка перед hover: .btn:hover", "Властивість — background-color.", ".btn:hover {\n  background-color: #1d4ed8;\n}"],
    solution: `.btn {\n  padding: 8px 16px;\n}\n.btn:hover {\n  background-color: #1d4ed8;\n}`,
    type: "css",
    tests: [{ re: /\.btn:hover\s*{[^}]*background-color\s*:\s*[^;]+;/i, msg: "Потрібне правило .btn:hover з background-color." }],
  },
  {
    id: "css-8",
    title: "CSS Grid",
    theory:
      "display: grid перетворює елемент на сітковий контейнер. grid-template-columns описує кількість і ширину колонок: наприклад 1fr 1fr 1fr — три однакові колонки, що діляться доступний простір.",
    previewHTML: `<div class="grid"><div class="cell">1</div><div class="cell">2</div><div class="cell">3</div></div>`,
    example: { code: `.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 8px;\n}`, explain: "Три клітинки стануть у три рівні колонки." },
    task: "Зроби .grid grid-контейнером (display: grid) із grid-template-columns на 3 колонки.",
    starter: "",
    hints: ["Потрібна властивість display: grid.", "grid-template-columns: 1fr 1fr 1fr задає три рівні колонки.", ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n}"],
    solution: `.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 8px;\n}`,
    type: "css",
    tests: [
      { re: /\.grid\s*{[^}]*display\s*:\s*grid\s*;/i, msg: "Потрібно display: grid у .grid." },
      { re: /\.grid\s*{[^}]*grid-template-columns\s*:\s*[^;]+;/i, msg: "Потрібен grid-template-columns у .grid." },
    ],
  },
  {
    id: "css-9",
    title: "Transition: плавні переходи",
    theory:
      "transition каже браузеру плавно анімувати зміну властивості замість миттєвого стрибка. transition: background-color 0.3s означає: якщо background-color зміниться (наприклад, на :hover), анімуй це за 0.3 секунди.",
    previewHTML: `<button class="btn2">Наведи</button>`,
    example: { code: `.btn2 {\n  background-color: #334155;\n  transition: background-color 0.3s;\n}\n.btn2:hover {\n  background-color: #1d4ed8;\n}`, explain: "Зміна кольору стане плавною, а не миттєвою." },
    task: "Додай .btn2 з transition (будь-яка властивість і тривалість) і .btn2:hover, що змінює якусь властивість.",
    starter: "",
    hints: ["transition пишеться в .btn2, а не в :hover.", "Формат: transition: властивість тривалість;", ".btn2 {\n  transition: background-color 0.3s;\n}\n.btn2:hover {\n  background-color: #1d4ed8;\n}"],
    solution: `.btn2 {\n  background-color: #334155;\n  transition: background-color 0.3s;\n}\n.btn2:hover {\n  background-color: #1d4ed8;\n}`,
    type: "css",
    tests: [
      { re: /\.btn2\s*{[^}]*transition\s*:\s*[^;]+;/i, msg: "Потрібен transition у .btn2." },
      { re: /\.btn2:hover\s*{[^}]*:\s*[^;]+;/i, msg: "Потрібне правило .btn2:hover з якоюсь властивістю." },
    ],
  },
];

const JS_LESSONS = [
  {
    id: "js-1",
    title: "Змінні та типи даних",
    theory:
      "let створює змінну, значення якої можна змінювати; const — змінну, яку не можна переприсвоїти. Основні типи: string (текст у лапках), number (число), boolean (true/false).",
    example: { code: `let city = "Черкаси";\nconst year = 2026;\nconsole.log(city, year);`, explain: "console.log виводить значення в консоль." },
    task: 'Створи змінну let name зі своїм ім\'ям (рядок) і const age = 25 (число).',
    starter: "// Напиши свій код тут\n",
    hints: ["Використай let для name і const для age.", "name — рядок у лапках, age — число без лапок.", 'let name = "Оксана";\nconst age = 25;'],
    solution: `let name = "Оксана";\nconst age = 25;\nconsole.log(name, age);`,
    type: "js",
    testCode: `if (typeof name === 'undefined') return {pass:false, message:"Змінна name не знайдена."};\nif (typeof name !== 'string') return {pass:false, message:"name має бути рядком (string)."};\nif (typeof age === 'undefined') return {pass:false, message:"Змінна age не знайдена."};\nif (age !== 25) return {pass:false, message:"age має дорівнювати 25."};\nreturn {pass:true, message:"let дозволяє змінювати значення пізніше, const — ні. Обирай залежно від задачі."};`,
  },
  {
    id: "js-2",
    title: "Функції",
    theory:
      "Функція — це шматок коду, який можна викликати повторно з різними вхідними значеннями (параметрами). function sum(a, b) { return a + b; } — оголошення, sum(2, 3) — виклик. return повертає результат назовні.",
    example: { code: `function double(x) {\n  return x * 2;\n}\nconsole.log(double(5)); // 10`, explain: "double(5) поверне 10." },
    task: "Напиши функцію sum(a, b), яка повертає суму a і b.",
    starter: "function sum(a, b) {\n  // твій код\n}\n",
    hints: ["Не забудь return.", "sum(2, 3) має повернути 5.", "function sum(a, b) {\n  return a + b;\n}"],
    solution: `function sum(a, b) {\n  return a + b;\n}`,
    type: "js",
    testCode: `if (typeof sum !== 'function') return {pass:false, message:"Функція sum не знайдена."};\nif (sum(2,3) !== 5) return {pass:false, message:"sum(2, 3) має повертати 5, отримано: " + sum(2,3)};\nif (sum(-1,1) !== 0) return {pass:false, message:"sum(-1, 1) має повертати 0."};\nreturn {pass:true, message:"Функції — головний спосіб уникати повторення коду."};`,
  },
  {
    id: "js-3",
    title: "Масиви та цикли",
    theory:
      "Масив — впорядкований список значень: const colors = ['red', 'green', 'blue']. Цикл for перебирає елементи: for (let i = 0; i < colors.length; i++) { ... }. colors[i] звертається до елемента за індексом (з 0).",
    example: { code: `const nums = [1, 2, 3];\nfor (let i = 0; i < nums.length; i++) {\n  console.log(nums[i]);\n}`, explain: "Виведе 1, 2, 3 — кожне на новому рядку." },
    task: "Створи масив colors із трьох рядків-кольорів, і за допомогою for-циклу виведи кожен у консоль.",
    starter: "const colors = [];\n// твій цикл тут\n",
    hints: ["Спочатку заповни масив трьома рядками.", "Цикл: for (let i = 0; i < colors.length; i++)", 'const colors = ["red", "green", "blue"];\nfor (let i = 0; i < colors.length; i++) {\n  console.log(colors[i]);\n}'],
    solution: `const colors = ["red", "green", "blue"];\nfor (let i = 0; i < colors.length; i++) {\n  console.log(colors[i]);\n}`,
    type: "js",
    testCode: `if (typeof colors === 'undefined') return {pass:false, message:"Масив colors не знайдено."};\nif (!Array.isArray(colors) || colors.length !== 3) return {pass:false, message:"colors має містити рівно 3 елементи."};\nif (__logs.length < 3) return {pass:false, message:"Цикл має вивести (console.log) щонайменше 3 значення."};\nreturn {pass:true, message:"colors.length дає довжину масиву — саме те, що обмежує цикл."};`,
  },
  {
    id: "js-4",
    title: "Робота з DOM",
    theory:
      "DOM (Document Object Model) — це представлення HTML-сторінки, з яким JavaScript може працювати: знаходити елементи й змінювати їх. document.getElementById('id') знаходить елемент за id, .textContent змінює його текст.",
    domTemplate: `<p id="title">Старий текст</p>`,
    example: { code: `document.getElementById("title").textContent = "Новий текст";`, explain: "Знаходить елемент з id=\"title\" і замінює його текст." },
    task: 'На сторінці є <p id="title">. Зміни його textContent на "Новий текст".',
    starter: "// document.getElementById(...)\n",
    hints: ['Спочатку знайди елемент: document.getElementById("title")', "Потім зміни .textContent", 'document.getElementById("title").textContent = "Новий текст";'],
    solution: `document.getElementById("title").textContent = "Новий текст";`,
    type: "js",
    testCode: `const el = document.getElementById('title');\nif (!el) return {pass:false, message:"Елемент #title зник із сторінки."};\nif (el.textContent.trim() !== 'Новий текст') return {pass:false, message:'textContent має дорівнювати "Новий текст" (зараз: "' + el.textContent.trim() + '").'};\nreturn {pass:true, message:"Так JavaScript оживляє статичний HTML — змінює його вже після завантаження."};`,
  },
  {
    id: "js-5",
    title: "Події: click",
    theory:
      "addEventListener('click', функція) підписує елемент на подію кліка — функція виконається щоразу, коли користувач натисне. Це основа будь-якої інтерактивності: кнопок, форм, ігор.",
    domTemplate: `<button id="btn">Натисни</button><p id="out">0</p>`,
    example: { code: `let count = 0;\ndocument.getElementById("btn").addEventListener("click", () => {\n  count++;\n  document.getElementById("out").textContent = count;\n});`, explain: "Кожен клік по кнопці збільшує count і оновлює текст." },
    task: 'Зроби так, щоб кожен клік по кнопці #btn збільшував число в #out на 1, починаючи з 0.',
    starter: "let count = 0;\n// document.getElementById(\"btn\").addEventListener(...)\n",
    hints: ["Підпишись через addEventListener('click', ...)", "Не забудь оновити #out.textContent усередині обробника.", 'let count = 0;\ndocument.getElementById("btn").addEventListener("click", () => {\n  count++;\n  document.getElementById("out").textContent = count;\n});'],
    solution: `let count = 0;\ndocument.getElementById("btn").addEventListener("click", () => {\n  count++;\n  document.getElementById("out").textContent = count;\n});`,
    type: "js",
    testCode: `const btn = document.getElementById('btn');\nconst out = document.getElementById('out');\nif (!btn || !out) return {pass:false, message:"Елементи #btn або #out зникли."};\nbtn.click(); btn.click();\nawait new Promise(r => setTimeout(r, 0));\nif (out.textContent.trim() !== '2') return {pass:false, message:'Після 2 кліків #out має показувати "2" (зараз: "' + out.textContent.trim() + '").'};\nreturn {pass:true, message:"Саме так кнопки на реальних сайтах реагують на клік."};`,
  },
  {
    id: "js-6",
    title: "Умови: if / else",
    theory:
      "if (умова) { ... } else { ... } виконує один із двох блоків залежно від того, істинна умова чи ні. Умова — будь-який вираз, що дає true або false, наприклад age >= 18.",
    example: { code: `function checkAge(age) {\n  if (age >= 18) {\n    return "дорослий";\n  } else {\n    return "неповнолітній";\n  }\n}`, explain: "checkAge(20) поверне «дорослий», checkAge(10) — «неповнолітній»." },
    task: 'Напиши функцію checkAge(age), яка повертає "дорослий", якщо age >= 18, інакше "неповнолітній".',
    starter: "function checkAge(age) {\n  // твій код\n}\n",
    hints: ["Використай if / else з умовою age >= 18.", "Обидва блоки мають повертати рядок через return.", 'function checkAge(age) {\n  if (age >= 18) {\n    return "дорослий";\n  } else {\n    return "неповнолітній";\n  }\n}'],
    solution: `function checkAge(age) {\n  if (age >= 18) {\n    return "дорослий";\n  } else {\n    return "неповнолітній";\n  }\n}`,
    type: "js",
    testCode: `if (typeof checkAge !== 'function') return {pass:false, message:"Функція checkAge не знайдена."};\nif (checkAge(20) !== 'дорослий') return {pass:false, message:"checkAge(20) має повертати «дорослий»."};\nif (checkAge(10) !== 'неповнолітній') return {pass:false, message:"checkAge(10) має повертати «неповнолітній»."};\nif (checkAge(18) !== 'дорослий') return {pass:false, message:"checkAge(18) — межове значення, теж «дорослий» (>=18)."};\nreturn {pass:true, message:"if/else — базовий спосіб розгалужувати логіку залежно від даних."};`,
  },
  {
    id: "js-7",
    title: "Об'єкти",
    theory:
      "Об'єкт групує пов'язані дані під іменованими властивостями: const user = { name: 'Оля', age: 20 }. Доступ до властивості — через крапку: user.name.",
    example: { code: `const user = { name: "Оля", age: 20 };\nconsole.log(user.name);`, explain: "Виведе «Оля»." },
    task: 'Створи const user з властивостями name (рядок) та age (число).',
    starter: "// const user = { ... }\n",
    hints: ["Синтаксис об'єкта: { ключ: значення, ключ: значення }", "name — рядок у лапках, age — число.", 'const user = { name: "Оля", age: 20 };'],
    solution: `const user = { name: "Оля", age: 20 };`,
    type: "js",
    testCode: `if (typeof user === 'undefined') return {pass:false, message:"Об'єкт user не знайдено."};\nif (typeof user !== 'object' || user === null) return {pass:false, message:"user має бути об'єктом."};\nif (typeof user.name !== 'string') return {pass:false, message:"user.name має бути рядком."};\nif (typeof user.age !== 'number') return {pass:false, message:"user.age має бути числом."};\nreturn {pass:true, message:"Об'єкти зручні саме тим, що групують пов'язані дані під одним іменем."};`,
  },
  {
    id: "js-8",
    title: "Методи масивів: map і filter",
    theory:
      ".map(fn) створює новий масив, застосувавши fn до кожного елемента. .filter(fn) створює новий масив лише з елементів, для яких fn повертає true. Обидва не змінюють оригінальний масив.",
    example: { code: `const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled); // [2, 4, 6]`, explain: "map перетворює кожен елемент." },
    task: "Маючи const nums = [1, 2, 3, 4], створи doubled через .map (кожне число ×2) і evens через .filter (лише парні).",
    starter: "const nums = [1, 2, 3, 4];\n// const doubled = ...\n// const evens = ...\n",
    hints: [".map(n => n * 2) подвоює кожен елемент.", ".filter(n => n % 2 === 0) лишає лише парні.", "const doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);"],
    solution: `const nums = [1, 2, 3, 4];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);`,
    type: "js",
    testCode: `if (typeof doubled === 'undefined') return {pass:false, message:"Масив doubled не знайдено."};\nif (JSON.stringify(doubled) !== JSON.stringify([2,4,6,8])) return {pass:false, message:"doubled має бути [2, 4, 6, 8]."};\nif (typeof evens === 'undefined') return {pass:false, message:"Масив evens не знайдено."};\nif (JSON.stringify(evens) !== JSON.stringify([2,4])) return {pass:false, message:"evens має бути [2, 4]."};\nreturn {pass:true, message:"map і filter — два з найчастіше вживаних методів масивів у реальному коді."};`,
  },
  {
    id: "js-9",
    title: "Фінальний міні-проєкт: список справ",
    theory:
      "Об'єднаємо все: DOM, події та створення елементів. document.createElement('li') створює новий елемент у пам'яті, list.appendChild(li) додає його на сторінку.",
    domTemplate: `<input id="todo-input"><button id="todo-add">Додати</button><ul id="todo-list"></ul>`,
    example: {
      code: `document.getElementById("todo-add").addEventListener("click", () => {\n  const input = document.getElementById("todo-input");\n  const li = document.createElement("li");\n  li.textContent = input.value;\n  document.getElementById("todo-list").appendChild(li);\n  input.value = "";\n});`,
      explain: "Клік по кнопці бере поточне значення поля, створює <li> й додає у список.",
    },
    task: 'При кліку на #todo-add: створи <li> з текстом із #todo-input, додай його в #todo-list, і очисти поле вводу.',
    starter: "document.getElementById(\"todo-add\").addEventListener(\"click\", () => {\n  // твій код\n});\n",
    hints: [
      "Спочатку прочитай значення: document.getElementById('todo-input').value",
      "Створи елемент: document.createElement('li'), задай li.textContent, додай через list.appendChild(li).",
      "Не забудь очистити поле в кінці: input.value = '';",
    ],
    solution: `document.getElementById("todo-add").addEventListener("click", () => {\n  const input = document.getElementById("todo-input");\n  const li = document.createElement("li");\n  li.textContent = input.value;\n  document.getElementById("todo-list").appendChild(li);\n  input.value = "";\n});`,
    type: "js",
    testCode: `const input = document.getElementById('todo-input');\nconst btn = document.getElementById('todo-add');\nconst list = document.getElementById('todo-list');\nif (!input || !btn || !list) return {pass:false, message:"Елементи форми зникли зі сторінки."};\ninput.value = "Купити хліб";\nbtn.click();\nawait new Promise(r => setTimeout(r, 0));\nconst items = list.querySelectorAll('li');\nif (items.length !== 1) return {pass:false, message:"Після кліку в списку має з'явитись рівно 1 пункт (зараз: " + items.length + ")."};\nif (items[0].textContent.trim() !== "Купити хліб") return {pass:false, message:"Текст пункту списку має відповідати введеному значенню."};\nreturn {pass:true, message:"Це основа будь-якого списку справ чи форми коментарів: зчитати ввід, оновити DOM, очистити поле."};`,
  },
];

const ENGLISH_LESSONS = [
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

const COURSES = [
  { id: "html", title: "HTML", subtitle: "твоя перша вебсторінка", lessons: HTML_LESSONS, status: "available", accent: "amber" },
  { id: "css", title: "CSS", subtitle: "стилі та вигляд сторінки", lessons: CSS_LESSONS, status: "available", accent: "teal" },
  { id: "javascript", title: "JavaScript", subtitle: "твій перший інтерактивний застосунок", lessons: JS_LESSONS, status: "available", accent: "sky" },
  { id: "english", title: "English for IT", subtitle: "англійська для програмування", lessons: ENGLISH_LESSONS, status: "available", accent: "fuchsia" },
  { id: "frontend", title: "Frontend", subtitle: "повноцінний frontend", lessons: [], status: "planned", accent: "violet" },
  { id: "python", title: "Python", subtitle: "власна програма на Python", lessons: [], status: "planned", accent: "emerald" },
  { id: "sql", title: "SQL", subtitle: "власна база даних", lessons: [], status: "planned", accent: "rose" },
  { id: "backend", title: "Backend", subtitle: "власний сервер + API", lessons: [], status: "planned", accent: "orange" },
  { id: "fullstack", title: "Full Stack", subtitle: "повноцінний власний продукт", lessons: [], status: "planned", accent: "stone" },
];

const SYMBOLS = [
  { cat: "Основні символи", sym: ".", en: "Period / dot", ua: "Крапка", langs: "JS, Python, CSS", example: "user.name", explain: "Звертання до властивості об'єкта або методу (у JS/Python) чи десяткова крапка в числах." },
  { cat: "Основні символи", sym: ",", en: "Comma", ua: "Кома", langs: "усюди", example: "sum(1, 2)", explain: "Розділяє елементи списку, аргументи функції." },
  { cat: "Основні символи", sym: ";", en: "Semicolon", ua: "Крапка з комою", langs: "JS, SQL, CSS", example: "let x = 5;", explain: "Завершує інструкцію (в JS часто необов'язкова, але рекомендована)." },
  { cat: "Основні символи", sym: ":", en: "Colon", ua: "Двокрапка", langs: "CSS, JS, Python", example: "color: red;", explain: "У CSS розділяє властивість і значення; у Python починає блок (if x:)." },
  { cat: "Основні символи", sym: "'  \"  `", en: "Quotes / backtick", ua: "Лапки / зворотні лапки", langs: "JS, Python", example: "`Привіт, ${name}`", explain: "Лапки позначають рядок (string). Зворотні лапки в JS дозволяють вставляти змінні через ${...}." },
  { cat: "Дужки", sym: "()", en: "Parentheses", ua: "Круглі дужки", langs: "усюди", example: "sum(2, 3)", explain: "Виклик функції або групування виразу для зміни порядку обчислень." },
  { cat: "Дужки", sym: "[]", en: "Square brackets", ua: "Квадратні дужки", langs: "JS, Python", example: "colors[0]", explain: "Створення масиву або доступ до елемента за індексом." },
  { cat: "Дужки", sym: "{}", en: "Curly braces", ua: "Фігурні дужки", langs: "JS, CSS, Python", example: "function() { }", explain: "Тіло функції/умови/циклу в JS, або блок правила в CSS." },
  { cat: "Дужки", sym: "<>", en: "Angle brackets", ua: "Кутові дужки", langs: "HTML", example: "<div></div>", explain: "Відкривають і закривають HTML-теги." },
  { cat: "Оператори", sym: "=", en: "Assignment operator", ua: "Оператор присвоєння", langs: "JS, Python, SQL", example: "let x = 10;", explain: "Присвоює значення праворуч змінній ліворуч." },
  { cat: "Оператори", sym: "==", en: "Equality (loose)", ua: "Оператор рівності (нестрогий)", langs: "JS", example: "5 == '5' // true", explain: "Порівнює значення, ігноруючи тип — у JS краще уникати, використовуй ===." },
  { cat: "Оператори", sym: "===", en: "Strict equality", ua: "Строга рівність", langs: "JS", example: "5 === '5' // false", explain: "Порівнює і значення, і тип. Рекомендований варіант у JS." },
  { cat: "Оператори", sym: "!=  !==", en: "Inequality", ua: "Нерівність", langs: "JS", example: "x !== 5", explain: "Перевіряє, що значення відрізняються." },
  { cat: "Оператори", sym: ">  <", en: "Greater / less than", ua: "Більше / менше", langs: "усюди", example: "age > 18", explain: "Порівняння чисел (і не тільки)." },
  { cat: "Оператори", sym: ">=  <=", en: "Greater/less or equal", ua: "Більше-або-дорівнює / менше-або-дорівнює", langs: "усюди", example: "age >= 18", explain: "Включає рівність у порівняння." },
  { cat: "Оператори", sym: "&&", en: "Logical AND", ua: "Логічне «І»", langs: "JS", example: "a && b", explain: "Істина, лише якщо обидві умови істинні." },
  { cat: "Оператори", sym: "||", en: "Logical OR", ua: "Логічне «АБО»", langs: "JS", example: "a || b", explain: "Істина, якщо хоча б одна умова істинна." },
  { cat: "Оператори", sym: "??", en: "Nullish coalescing", ua: "Оператор нульового злиття", langs: "JS", example: "value ?? 'за замовчуванням'", explain: "Повертає праве значення, тільки якщо ліве null або undefined." },
  { cat: "Оператори", sym: "+  -  *  /  %", en: "Arithmetic operators", ua: "Арифметичні оператори", langs: "усюди", example: "10 % 3 // 1", explain: "% (модуль) повертає залишок від ділення." },
  { cat: "Спеціальні символи", sym: "@", en: "At sign", ua: "Знак «at»", langs: "CSS, Python", example: "@media (max-width: 600px)", explain: "У CSS починає спеціальні правила (медіа-запити тощо)." },
  { cat: "Спеціальні символи", sym: "#", en: "Hash / ID selector", ua: "Решітка / селектор за ID", langs: "CSS, HTML", example: "#header { }", explain: "У CSS вибирає елемент за атрибутом id." },
  { cat: "Спеціальні символи", sym: "$", en: "Dollar sign", ua: "Знак долара", langs: "JS (шаблонні рядки)", example: "`Привіт, ${name}`", explain: "У поєднанні з {} вставляє змінну в рядок у зворотних лапках." },
  { cat: "Спеціальні символи", sym: "&", en: "Ampersand", ua: "Амперсанд", langs: "HTML, JS", example: "&nbsp;", explain: "У HTML починає спецсимвол (entity), наприклад нерозривний пробіл." },
  { cat: "Спеціальні символи", sym: "_", en: "Underscore", ua: "Підкреслення", langs: "усюди", example: "user_name", explain: "Часто використовується в іменах змінних (snake_case), особливо в Python." },
  { cat: "Спеціальні символи", sym: "/", en: "Slash / comment", ua: "Коса риска / коментар", langs: "JS, CSS", example: "// коментар", explain: "// починає однорядковий коментар у JS. /* ... */ — багаторядковий у JS та CSS." },
  { cat: "Спеціальні символи", sym: "%", en: "Percent / white-space", ua: "Відсоток / пробіл (у різних контекстах)", langs: "CSS, HTML", example: "width: 100%;", explain: "У CSS одиниця відносного розміру." },
  { cat: "Пробіл", sym: "␣ (пробіл)", en: "Space", ua: "Пробіл", langs: "HTML: &nbsp; · CSS: white-space · JS/Python: ' '", example: "&nbsp;", explain: "У HTML звичайні пробіли схлопуються в один; &nbsp; вставляє нерозривний пробіл. У JS/Python пробіл — просто символ ' ' у рядку." },
  { cat: "Складені оператори", sym: "+=  -=  *=  /=  %=", en: "Compound assignment", ua: "Складене присвоєння", langs: "JS, Python", example: "x += 5; // те саме, що x = x + 5", explain: "Скорочений запис: спочатку виконує операцію, потім присвоює результат тій самій змінній." },
  { cat: "Складені оператори", sym: "++  --", en: "Increment / decrement", ua: "Інкремент / декремент", langs: "JS", example: "i++; // те саме, що i = i + 1", explain: "Збільшує або зменшує число на 1. Часто використовується в циклах for." },
  { cat: "Складені оператори", sym: "=>", en: "Arrow function", ua: "Стрілкова функція", langs: "JS", example: "const double = x => x * 2;", explain: "Коротший запис функції. () => {} — функція без параметрів." },
  { cat: "Складені оператори", sym: "...", en: "Spread / rest", ua: "Оператор розгортання / збору", langs: "JS", example: "const copy = [...arr];", explain: "Розгортає масив/об'єкт на окремі елементи (spread), або збирає кілька аргументів в один масив (rest)." },
  { cat: "Складені оператори", sym: "typeof", en: "typeof operator", ua: "Оператор визначення типу", langs: "JS", example: "typeof 5 // 'number'", explain: "Повертає рядок з назвою типу значення." },
  { cat: "Складені оператори", sym: "instanceof", en: "instanceof operator", ua: "Оператор перевірки класу", langs: "JS", example: "arr instanceof Array", explain: "Перевіряє, чи об'єкт створений певним класом/конструктором." },
  { cat: "Escape-послідовності", sym: "\\n", en: "Newline", ua: "Символ нового рядка", langs: "JS, Python", example: "\"Рядок 1\\nРядок 2\"", explain: "Переносить текст на новий рядок усередині рядкового значення." },
  { cat: "Escape-послідовності", sym: "\\t", en: "Tab", ua: "Символ табуляції", langs: "JS, Python", example: "\"Ім'я:\\tОля\"", explain: "Вставляє горизонтальний відступ (таб) усередині рядка." },
  { cat: "Escape-послідовності", sym: "\\\\", en: "Escaped backslash", ua: "Екранована зворотна коса риска", langs: "JS, Python", example: "\"C:\\\\Users\"", explain: "Щоб вивести саму \\, її потрібно \"екранувати\" ще однією \\ перед нею." },
  { cat: "Escape-послідовності", sym: "\\\"", en: "Escaped quote", ua: "Екранована лапка", langs: "JS, Python", example: "\"Вона сказала \\\"привіт\\\"\"", explain: "Дозволяє вставити лапку всередину рядка, обмеженого такими самими лапками." },
  { cat: "CSS-комбінатори", sym: "A B", en: "Descendant combinator", ua: "Комбінатор нащадка", langs: "CSS", example: "div p { color: red; }", explain: "Вибирає всі <p> усередині <div>, на будь-якій глибині вкладеності." },
  { cat: "CSS-комбінатори", sym: "A > B", en: "Child combinator", ua: "Комбінатор прямої дитини", langs: "CSS", example: "div > p { color: red; }", explain: "Вибирає лише <p>, які є прямими дітьми <div> (не онуками)." },
  { cat: "CSS-комбінатори", sym: "A + B", en: "Adjacent sibling", ua: "Сусідній елемент одразу після", langs: "CSS", example: "h1 + p { margin-top: 0; }", explain: "Вибирає <p>, що йде одразу після <h1> на одному рівні вкладеності." },
  { cat: "CSS-комбінатори", sym: "A ~ B", en: "General sibling", ua: "Будь-який наступний сусідній елемент", langs: "CSS", example: "h1 ~ p { color: gray; }", explain: "Вибирає всі <p>, що йдуть після <h1> на тому самому рівні (не обов'язково одразу)." },
  { cat: "CSS-комбінатори", sym: "*", en: "Universal selector", ua: "Універсальний селектор", langs: "CSS", example: "* { box-sizing: border-box; }", explain: "Застосовує стиль до взагалі всіх елементів на сторінці." },
  { cat: "HTML-специфічні", sym: "<!DOCTYPE html>", en: "Doctype declaration", ua: "Оголошення типу документа", langs: "HTML", example: "<!DOCTYPE html>", explain: "Перший рядок будь-якої HTML5-сторінки — каже браузеру працювати в стандартному режимі, а не в застарілому «quirks mode»." },
  { cat: "HTML-специфічні", sym: "<!-- -->", en: "HTML comment", ua: "HTML-коментар", langs: "HTML", example: "<!-- це не видно на сторінці -->", explain: "Усе між <!-- і --> браузер повністю ігнорує." },
  { cat: "HTML-специфічні", sym: "</>", en: "Self-closing slash", ua: "Слеш самозакривного тега", langs: "HTML", example: "<img src=\"x.jpg\" />", explain: "У деяких тегах без пари (img, br, input) слеш перед > необов'язковий у HTML5, але часто пишеться для ясності." },
  { cat: "Бітові оператори", sym: "&", en: "Bitwise AND", ua: "Бітове «І»", langs: "JS", example: "5 & 3 // 1", explain: "Порівнює числа побітово. Рідко потрібен у звичайному коді — частіше зустрічається як && (логічне «і») або &nbsp; в HTML." },
  { cat: "Бітові оператори", sym: "|", en: "Bitwise OR", ua: "Бітове «АБО»", langs: "JS", example: "5 | 2 // 7", explain: "Побітове АБО. Не плутай з || (логічне АБО між умовами)." },
  { cat: "Бітові оператори", sym: "^", en: "Bitwise XOR", ua: "Виключне АБО (XOR)", langs: "JS", example: "5 ^ 1 // 4", explain: "Істина в біті, лише якщо рівно один з двох бітів істинний." },
  { cat: "Бітові оператори", sym: "<<  >>  >>>", en: "Bit shift", ua: "Побітовий зсув", langs: "JS", example: "1 << 3 // 8", explain: "Зсуває біти числа вліво/вправо — рідко потрібно поза низькорівневими задачами." },
  { cat: "Python-специфічні", sym: "//", en: "Floor division", ua: "Цілочисельне ділення", langs: "Python", example: "7 // 2 # 3", explain: "Ділить і відкидає дробову частину (округлює вниз). У JS/CSS // означає коментар — символ той самий, значення різне." },
  { cat: "Python-специфічні", sym: ":=", en: "Walrus operator", ua: "«Моржовий» оператор", langs: "Python", example: "if (n := len(data)) > 10: ...", explain: "Присвоює значення змінній прямо всередині виразу (наприклад, умови if)." },
  { cat: "Python-специфічні", sym: "@decorator", en: "Decorator", ua: "Декоратор", langs: "Python", example: "@staticmethod\ndef fn(): ...", explain: "Обгортає функцію чи метод, додаючи йому поведінку, не змінюючи сам код усередині." },
  { cat: "Python-специфічні", sym: "'''  \"\"\"", en: "Triple quotes", ua: "Потрійні лапки", langs: "Python", example: "\"\"\"Багаторядковий\nтекст\"\"\"", explain: "Дозволяють рядок з кількох рядків тексту або docstring-документацію функції." },
  { cat: "SQL-специфічні", sym: "<>", en: "Not equal (SQL)", ua: "Не дорівнює (SQL)", langs: "SQL", example: "WHERE age <> 18", explain: "Стандартний SQL-варіант «не дорівнює» (у JS натомість пишуть !=)." },
  { cat: "SQL-специфічні", sym: "||", en: "String concatenation (SQL)", ua: "З'єднання рядків (SQL)", langs: "SQL", example: "first_name || ' ' || last_name", explain: "У SQL || склеює рядки; у JS/Python той самий символ подвоєний (||) означає логічне АБО — контекст все вирішує." },
  { cat: "SQL-специфічні", sym: "::", en: "Type cast (PostgreSQL)", ua: "Приведення типу (PostgreSQL)", langs: "SQL", example: "'123'::integer", explain: "Перетворює значення на вказаний тип прямо в запиті." },
  { cat: "SQL-специфічні", sym: "--", en: "SQL line comment", ua: "Однорядковий коментар SQL", langs: "SQL", example: "-- це коментар, а не мінус", explain: "У SQL -- починає коментар до кінця рядка (не плутай з відніманням)." },
  { cat: "SQL-специфічні", sym: "/* */", en: "SQL block comment", ua: "Багаторядковий коментар SQL", langs: "SQL, CSS, JS", example: "/* коментар\nна кілька рядків */", explain: "Той самий синтаксис блокового коментаря працює в SQL, CSS і JS." },
  { cat: "Оператори", sym: "!", en: "Logical NOT", ua: "Логічне заперечення", langs: "JS", example: "!isActive", explain: "Обертає логічне значення на протилежне: true стає false, і навпаки. Часто використовується в умовах: if (!user) — «якщо користувача немає»." },
  { cat: "Оператори", sym: "?:", en: "Ternary operator", ua: "Тернарний оператор", langs: "JS", example: "age >= 18 ? 'дорослий' : 'дитина'", explain: "Скорочений запис if/else в одному виразі: умова ? значенняЯкщоІстина : значенняЯкщоХибно. Зручно для короткого присвоєння змінної залежно від умови." },
  { cat: "Складені оператори", sym: "?.", en: "Optional chaining", ua: "Опціональне звертання", langs: "JS", example: "user?.address?.city", explain: "Безпечно звертається до вкладеної властивості об'єкта — якщо щось по дорозі (user або address) виявиться undefined чи null, поверне undefined замість помилки «Cannot read properties of undefined»." },
  { cat: "CSS-комбінатори", sym: "!important", en: "Important declaration", ua: "Позначка найвищого пріоритету", langs: "CSS", example: "color: red !important;", explain: "Робить конкретне CSS-правило пріоритетнішим за майже всі інші, навіть якщо вони специфічніші. Використовувати обережно — зловживання ускладнює подальшу підтримку стилів." },
  { cat: "CSS-комбінатори", sym: "::", en: "Pseudo-element (double colon)", ua: "Псевдоелемент (подвійна двокрапка)", langs: "CSS", example: "p::first-line { color: red; }", explain: "Подвійна двокрапка позначає псевдоелемент — частину елемента, якої немає в HTML (::before, ::after, ::first-line). Одинарна двокрапка : натомість позначає псевдоклас — стан елемента (:hover, :focus)." },
  { cat: "Термінал/Bash", sym: "|", en: "Pipe", ua: "Канал (труба)", langs: "Bash, Linux", example: "cat file.txt | grep 'text'", explain: "Передає результат виконання лівої команди як вхідні дані для правої команди. Дозволяє з'єднувати прості команди в один конвеєр обробки даних." },
  { cat: "Термінал/Bash", sym: ">  >>", en: "Redirect", ua: "Перенаправлення виводу", langs: "Bash, Linux", example: "echo 'hi' > file.txt", explain: "> записує вивід команди у файл, повністю перезаписуючи його вміст. >> дописує вивід у кінець файлу, не видаляючи те, що там уже було." },
  { cat: "Термінал/Bash", sym: "&&", en: "Command chain (on success)", ua: "Ланцюжок команд (якщо успішно)", langs: "Bash, Linux", example: "cd my-app && npm start", explain: "Виконує другу команду, лише якщо перша команда завершилась без помилки (код виходу 0). Якщо перша команда провалилась, друга не запуститься взагалі." },
  { cat: "Термінал/Bash", sym: "~", en: "Home directory", ua: "Домашня директорія", langs: "Bash, Linux", example: "cd ~/projects", explain: "Скорочення для шляху до домашньої директорії поточного користувача (напр. /home/oksana). Економить набір повного шляху щоразу." },
  { cat: "Regex", sym: "^  $", en: "Anchors", ua: "Якорі початку й кінця рядка", langs: "Regex (JS, Python)", example: "/^abc$/", explain: "^ означає «має починатись з цього місця», $ означає «має закінчуватись тут». Разом /^abc$/ вимагає, щоб увесь рядок дорівнював рівно «abc», а не просто містив цю підпослідовність." },
  { cat: "Regex", sym: "\\d  \\w  \\s", en: "Character classes", ua: "Класи символів", langs: "Regex (JS, Python)", example: "/\\d{3}-\\d{4}/", explain: "\\d відповідає будь-якій цифрі 0-9, \\w — будь-якій букві/цифрі/підкресленню, \\s — будь-якому пробільному символу (пробіл, таб, новий рядок). Приклад ловить номер формату «123-4567»." },
  { cat: "Regex", sym: "[abc]", en: "Character set", ua: "Набір символів", langs: "Regex (JS, Python)", example: "/[aeiou]/", explain: "Відповідає рівно одному символу з переліченого набору в квадратних дужках. [aeiou] знайде першу голосну літеру в рядку; [^aeiou] — навпаки, будь-який символ, крім голосних." },
  { cat: "Git", sym: "HEAD", en: "HEAD reference", ua: "Вказівник на поточний коміт", langs: "Git", example: "git reset HEAD~1", explain: "HEAD завжди вказує на коміт, на якому зараз стоїть твоя робоча гілка. HEAD~1 означає «на один коміт раніше за поточний» — корисно для скасування останнього коміту." },
  { cat: "HTML: Документ", sym: "<html>", en: "Root element", ua: "Кореневий елемент", langs: "HTML", example: '<html lang="uk">...</html>', explain: "Обгортає весь документ — усі інші елементи вкладені в нього." },
  { cat: "HTML: Документ", sym: "<head>", en: "Document head", ua: "Заголовок документа", langs: "HTML", example: "<head>...</head>", explain: "Контейнер для метаданих сторінки: title, meta, link, style, script — нічого з цього не видно на сторінці напряму." },
  { cat: "HTML: Документ", sym: "<body>", en: "Document body", ua: "Тіло документа", langs: "HTML", example: "<body>...</body>", explain: "Містить увесь видимий вміст сторінки — текст, зображення, форми тощо." },
  { cat: "HTML: Документ", sym: "<title>", en: "Document title", ua: "Заголовок вкладки", langs: "HTML", example: "<title>Моя сторінка</title>", explain: "Задає текст, що показується в заголовку вкладки браузера й у результатах пошуку." },
  { cat: "HTML: Документ", sym: "<meta>", en: "Metadata", ua: "Метадані", langs: "HTML", example: '<meta charset="UTF-8">', explain: "Задає метадані документа: кодування, опис для SEO, налаштування viewport для мобільних." },
  { cat: "HTML: Документ", sym: "<link>", en: "External resource link", ua: "Підключення ресурсу", langs: "HTML", example: '<link rel="stylesheet" href="style.css">', explain: "Підключає зовнішній файл — найчастіше CSS-стилі чи favicon." },
  { cat: "HTML: Документ", sym: "<style>", en: "Embedded styles", ua: "Вбудовані стилі", langs: "HTML", example: "<style>p { color: red; }</style>", explain: "Вбудовує CSS-правила прямо в документ без окремого файлу." },
  { cat: "HTML: Документ", sym: "<script>", en: "Script", ua: "Скрипт", langs: "HTML", example: '<script src="app.js"></script>', explain: "Вбудовує або підключає JavaScript-код для сторінки." },
  { cat: "HTML: Документ", sym: "<base>", en: "Base URL", ua: "Базова адреса", langs: "HTML", example: '<base href="https://example.com/">', explain: "Задає базову URL-адресу для всіх відносних посилань на сторінці." },
  { cat: "HTML: Документ", sym: "<noscript>", en: "No-script fallback", ua: "Запасний вміст без JS", langs: "HTML", example: "<noscript>Увімкніть JavaScript</noscript>", explain: "Показує вміст лише якщо JavaScript у браузері вимкнено чи не підтримується." },
  { cat: "HTML: Семантика", sym: "<header>", en: "Header", ua: "Шапка", langs: "HTML", example: "<header>...</header>", explain: "Вступна частина сторінки чи секції — зазвичай лого, назва, навігація." },
  { cat: "HTML: Семантика", sym: "<nav>", en: "Navigation", ua: "Навігація", langs: "HTML", example: "<nav><a href=\"/\">Головна</a></nav>", explain: "Блок навігаційних посилань — головне меню, хлібні крихти, пагінація." },
  { cat: "HTML: Семантика", sym: "<main>", en: "Main content", ua: "Основний вміст", langs: "HTML", example: "<main>...</main>", explain: "Унікальний основний вміст сторінки — лише один <main> на документ." },
  { cat: "HTML: Семантика", sym: "<section>", en: "Section", ua: "Розділ", langs: "HTML", example: "<section><h2>Про нас</h2>...</section>", explain: "Тематичний розділ сторінки, зазвичай зі своїм заголовком." },
  { cat: "HTML: Семантика", sym: "<article>", en: "Article", ua: "Стаття", langs: "HTML", example: "<article>...</article>", explain: "Самодостатній блок вмісту, що має сенс окремо від сторінки — стаття блогу, коментар, картка товару." },
  { cat: "HTML: Семантика", sym: "<aside>", en: "Aside", ua: "Бічна панель", langs: "HTML", example: "<aside>...</aside>", explain: "Вміст, побічно пов'язаний з основним — сайдбар, реклама, пов'язані посилання." },
  { cat: "HTML: Семантика", sym: "<footer>", en: "Footer", ua: "Підвал", langs: "HTML", example: "<footer>© 2024</footer>", explain: "Завершальна частина сторінки чи секції — авторські права, контакти, посилання." },
  { cat: "HTML: Семантика", sym: "<address>", en: "Address", ua: "Контактна інформація", langs: "HTML", example: "<address>Київ, Україна</address>", explain: "Контактна інформація автора чи власника документа/статті." },
  { cat: "HTML: Семантика", sym: "<h1>...<h6>", en: "Headings", ua: "Заголовки", langs: "HTML", example: "<h1>Головний заголовок</h1>", explain: "Заголовки шести рівнів важливості, h1 — найважливіший. Формують структуру документа." },
  { cat: "HTML: Семантика", sym: "<p>", en: "Paragraph", ua: "Абзац", langs: "HTML", example: "<p>Текст абзацу.</p>", explain: "Блок звичайного текстового абзацу." },
  { cat: "HTML: Семантика", sym: "<hr>", en: "Thematic break", ua: "Тематичний розрив", langs: "HTML", example: "<hr>", explain: "Позначає тематичний розрив між блоками контенту, типово показується горизонтальною лінією." },

  { cat: "HTML: Текст", sym: "<strong>", en: "Strong importance", ua: "Сильна важливість", langs: "HTML", example: "<strong>Увага!</strong>", explain: "Позначає текст, що має смислову важливість — типово жирний шрифт." },
  { cat: "HTML: Текст", sym: "<b>", en: "Bold (stylistic)", ua: "Жирний (стилістично)", langs: "HTML", example: "<b>ключове слово</b>", explain: "Виділяє текст жирним без смислового значення важливості — просто стилістично." },
  { cat: "HTML: Текст", sym: "<em>", en: "Emphasis", ua: "Смисловий наголос", langs: "HTML", example: "<em>дуже</em> важливо", explain: "Позначає смисловий наголос на слові — типово курсив." },
  { cat: "HTML: Текст", sym: "<i>", en: "Italic (stylistic)", ua: "Курсив (стилістично)", langs: "HTML", example: "<i>Panthera leo</i>", explain: "Курсив для іншого тону мовлення (терміни, назви) без смислового наголосу." },
  { cat: "HTML: Текст", sym: "<mark>", en: "Highlight", ua: "Виділення маркером", langs: "HTML", example: "<mark>знайдений текст</mark>", explain: "Виділяє текст жовтим маркером — наприклад результати пошуку." },
  { cat: "HTML: Текст", sym: "<small>", en: "Small print", ua: "Дрібний друк", langs: "HTML", example: "<small>© 2024</small>", explain: "Дрібний друк — застереження, copyright, юридичні примітки." },
  { cat: "HTML: Текст", sym: "<del>", en: "Deleted text", ua: "Видалений текст", langs: "HTML", example: "<del>стара ціна</del>", explain: "Позначає видалений з документа текст — типово закреслений." },
  { cat: "HTML: Текст", sym: "<ins>", en: "Inserted text", ua: "Доданий текст", langs: "HTML", example: "<ins>нова ціна</ins>", explain: "Позначає доданий до документа текст — типово підкреслений." },
  { cat: "HTML: Текст", sym: "<s>", en: "Strikethrough", ua: "Закреслений (неактуальний)", langs: "HTML", example: "<s>виконано</s>", explain: "Текст, що більше не актуальний, але лишається в документі для контексту." },
  { cat: "HTML: Текст", sym: "<u>", en: "Underline", ua: "Підкреслення", langs: "HTML", example: "<u>підкреслено</u>", explain: "Підкреслює текст без особливого смислового значення." },
  { cat: "HTML: Текст", sym: "<sub>", en: "Subscript", ua: "Нижній індекс", langs: "HTML", example: "H<sub>2</sub>O", explain: "Робить текст нижнім індексом — хімічні формули, математичні індекси." },
  { cat: "HTML: Текст", sym: "<sup>", en: "Superscript", ua: "Верхній індекс", langs: "HTML", example: "x<sup>2</sup>", explain: "Робить текст верхнім індексом — математичні степені, виноски." },
  { cat: "HTML: Текст", sym: "<abbr>", en: "Abbreviation", ua: "Скорочення", langs: "HTML", example: '<abbr title="HyperText Markup Language">HTML</abbr>', explain: "Скорочення з розшифровкою через title, показується підказкою." },
  { cat: "HTML: Текст", sym: "<blockquote>", en: "Block quotation", ua: "Блок-цитата", langs: "HTML", example: "<blockquote>Текст цитати</blockquote>", explain: "Розгорнута цитата з іншого джерела, виділена окремим блоком." },
  { cat: "HTML: Текст", sym: "<q>", en: "Inline quotation", ua: "Вбудована цитата", langs: "HTML", example: "<q>коротка цитата</q>", explain: "Коротка вбудована цитата — браузер сам додає лапки." },
  { cat: "HTML: Текст", sym: "<cite>", en: "Citation", ua: "Назва твору", langs: "HTML", example: "<cite>Кобзар</cite>", explain: "Позначає назву творчої роботи — книги, статті, фільму." },
  { cat: "HTML: Текст", sym: "<code>", en: "Code", ua: "Код", langs: "HTML", example: "<code>const x = 5;</code>", explain: "Позначає фрагмент програмного коду, моноширинний шрифт." },
  { cat: "HTML: Текст", sym: "<pre>", en: "Preformatted text", ua: "Форматований текст", langs: "HTML", example: "<pre>  збережені\n  пробіли</pre>", explain: "Зберігає пробіли й переноси рядків так, як написано в коді." },
  { cat: "HTML: Текст", sym: "<kbd>", en: "Keyboard input", ua: "Введення з клавіатури", langs: "HTML", example: "<kbd>Ctrl</kbd>+<kbd>C</kbd>", explain: "Позначає натискання клавіш чи їх комбінацій у документації." },
  { cat: "HTML: Текст", sym: "<samp>", en: "Sample output", ua: "Приклад виводу програми", langs: "HTML", example: "<samp>Готово!</samp>", explain: "Позначає приклад виводу програми чи команди." },
  { cat: "HTML: Текст", sym: "<var>", en: "Variable", ua: "Змінна", langs: "HTML", example: "<var>x</var> + <var>y</var>", explain: "Позначає назву змінної в математичному чи програмному контексті." },
  { cat: "HTML: Текст", sym: "<time>", en: "Date/time", ua: "Дата чи час", langs: "HTML", example: '<time datetime="2024-03-15">15 березня</time>', explain: "Дата/час у машинозчитуваному форматі через datetime." },
  { cat: "HTML: Текст", sym: "<data>", en: "Machine value", ua: "Машинозчитуване значення", langs: "HTML", example: '<data value="101">Товар</data>', explain: "Зв'язує текст з машинозчитуваним значенням через атрибут value." },
  { cat: "HTML: Текст", sym: "<br>", en: "Line break", ua: "Перенос рядка", langs: "HTML", example: "Рядок 1<br>Рядок 2", explain: "Примусовий перенос рядка всередині тексту." },
  { cat: "HTML: Текст", sym: "<wbr>", en: "Word break opportunity", ua: "Можливе місце переносу", langs: "HTML", example: "супер<wbr>довге<wbr>слово", explain: "Підказує браузеру можливе місце переносу довгого слова." },
  { cat: "HTML: Текст", sym: "<span>", en: "Inline container", ua: "Рядковий контейнер", langs: "HTML", example: '<span class="hl">текст</span>', explain: "Універсальний рядковий контейнер без семантики, для стилізації частини тексту." },
  { cat: "HTML: Текст", sym: "<div>", en: "Block container", ua: "Блоковий контейнер", langs: "HTML", example: '<div class="card">...</div>', explain: "Універсальний блоковий контейнер без семантики, для групування й стилізації." },
  { cat: "HTML: Посилання", sym: "<a href>", en: "Anchor / hyperlink", ua: "Гіперпосилання", langs: "HTML", example: '<a href="https://example.com">лінк</a>', explain: "Створює гіперпосилання на іншу сторінку, файл чи розділ." },
  { cat: "HTML: Посилання", sym: "target", en: "Link target", ua: "Місце відкриття посилання", langs: "HTML", example: 'target="_blank"', explain: "Визначає, де відкрити посилання: _self (типово), _blank (нова вкладка)." },
  { cat: "HTML: Посилання", sym: "download", en: "Download attribute", ua: "Атрибут завантаження", langs: "HTML", example: "<a href=\"file.pdf\" download>Завантажити</a>", explain: "Змушує браузер завантажити файл замість відкриття в вкладці." },
  { cat: "HTML: Посилання", sym: "rel", en: "Link relationship", ua: "Тип зв'язку посилання", langs: "HTML", example: 'rel="noopener noreferrer"', explain: "Вказує тип зв'язку між сторінками — важливо для безпеки з target=_blank." },
  { cat: "HTML: Посилання", sym: "hreflang", en: "Hreflang attribute", ua: "Мова цільового документа", langs: "HTML", example: 'hreflang="en"', explain: "Вказує мову документа, на який веде посилання." },
  { cat: "HTML: Посилання", sym: "_self / _blank / _parent / _top", en: "Target values", ua: "Значення target", langs: "HTML", example: 'target="_blank"', explain: "_self — те саме вікно, _blank — нова вкладка, _parent/_top — для фреймів." },
  { cat: "HTML: Посилання", sym: "nofollow / noopener / noreferrer", en: "Rel security values", ua: "Значення rel для безпеки", langs: "HTML", example: 'rel="noopener noreferrer"', explain: "noopener блокує доступ нової вкладки до window.opener, noreferrer також приховує джерело переходу, nofollow каже пошуковикам не переходити за посиланням." },

  { cat: "HTML: Зображення", sym: "<img>", en: "Image", ua: "Зображення", langs: "HTML", example: '<img src="cat.jpg" alt="Кіт">', explain: "Вставляє зображення на сторінку, самозакривний тег." },
  { cat: "HTML: Зображення", sym: "src / alt", en: "Source / alt text", ua: "Джерело / альтернативний текст", langs: "HTML", example: 'alt="Опис зображення"', explain: "src — шлях до файлу, alt — текстовий опис для доступності й SEO, обов'язковий." },
  { cat: "HTML: Зображення", sym: "width / height", en: "Width / height", ua: "Ширина / висота", langs: "HTML", example: 'width="300" height="150"', explain: "Резервують місце під зображення до його завантаження, запобігаючи «стрибкам» сторінки." },
  { cat: "HTML: Зображення", sym: "srcset / sizes", en: "Responsive image sources", ua: "Адаптивні джерела зображення", langs: "HTML", example: 'srcset="small.jpg 480w, big.jpg 800w"', explain: "Дозволяють браузеру обрати найкращий варіант зображення залежно від розміру екрана." },
  { cat: "HTML: Зображення", sym: "loading", en: "Loading strategy", ua: "Стратегія завантаження", langs: "HTML", example: 'loading="lazy"', explain: "lazy відкладає завантаження зображення, поки користувач не докрутить до нього." },
  { cat: "HTML: Зображення", sym: "decoding / fetchpriority", en: "Decoding / priority hints", ua: "Підказки декодування й пріоритету", langs: "HTML", example: 'decoding="async" fetchpriority="high"', explain: "Підказують браузеру, як декодувати зображення й наскільки терміново його завантажувати." },
  { cat: "HTML: Зображення", sym: "crossorigin / referrerpolicy", en: "CORS / referrer settings", ua: "Налаштування CORS і referrer", langs: "HTML", example: 'crossorigin="anonymous"', explain: "Керують режимом кросдоменного запиту й тим, яку інформацію про джерело передавати серверу." },
  { cat: "HTML: Зображення", sym: "ismap / usemap", en: "Server/client image map", ua: "Серверна/клієнтська карта зображення", langs: "HTML", example: 'usemap="#regions"', explain: "usemap пов'язує зображення з клікабельною картою <map>, ismap — застаріла серверна версія." },
  { cat: "HTML: Медіа", sym: "<picture>", en: "Picture", ua: "Адаптивне зображення", langs: "HTML", example: "<picture><source srcset=\"big.jpg\" media=\"(min-width: 800px)\"><img src=\"small.jpg\" alt=\"...\"></picture>", explain: "Показує різні версії зображення залежно від розміру екрана чи формату." },
  { cat: "HTML: Медіа", sym: "<source>", en: "Media source", ua: "Джерело медіа", langs: "HTML", example: '<source src="movie.webm" type="video/webm">', explain: "Альтернативне джерело для video/audio/picture — браузер обирає перше підтримуване." },
  { cat: "HTML: Медіа", sym: "<figure>", en: "Figure", ua: "Ілюстрація з підписом", langs: "HTML", example: "<figure><img ...><figcaption>Підпис</figcaption></figure>", explain: "Групує самодостатній контент (зображення, діаграму) з підписом figcaption." },
  { cat: "HTML: Медіа", sym: "<figcaption>", en: "Figure caption", ua: "Підпис до ілюстрації", langs: "HTML", example: "<figcaption>Мал. 1</figcaption>", explain: "Підпис до вмісту figure." },
  { cat: "HTML: Медіа", sym: "<audio>", en: "Audio player", ua: "Аудіоплеєр", langs: "HTML", example: '<audio controls src="song.mp3"></audio>', explain: "Вбудований аудіоплеєр без сторонніх плагінів." },
  { cat: "HTML: Медіа", sym: "controls / autoplay / loop / muted / preload", en: "Media playback attributes", ua: "Атрибути відтворення медіа", langs: "HTML", example: "controls autoplay muted loop", explain: "Керують показом контролів, автозапуском (потребує muted), повтором і попереднім завантаженням." },
  { cat: "HTML: Медіа", sym: "<video>", en: "Video player", ua: "Відеоплеєр", langs: "HTML", example: '<video controls src="movie.mp4"></video>', explain: "Вбудований відеоплеєр з елементами керування." },
  { cat: "HTML: Медіа", sym: "poster / playsinline", en: "Video poster / inline playback", ua: "Заглушка відео / вбудоване відтворення", langs: "HTML", example: 'poster="preview.jpg" playsinline', explain: "poster — зображення до запуску відео, playsinline — програвати в межах сторінки на мобільних, не на весь екран." },
  { cat: "HTML: Медіа", sym: "<track>", en: "Text track", ua: "Текстова доріжка", langs: "HTML", example: '<track kind="subtitles" src="subs.vtt" srclang="uk">', explain: "Додає субтитри чи підписи до video/audio у форматі WebVTT." },
  { cat: "HTML: Медіа", sym: "kind / srclang / label / default", en: "Track attributes", ua: "Атрибути доріжки", langs: "HTML", example: 'kind="captions" srclang="uk" label="Українська" default', explain: "kind — тип доріжки, srclang — мова, label — назва в меню, default — увімкнена спочатку." },
  { cat: "HTML: Вбудований вміст", sym: "<iframe>", en: "Inline frame", ua: "Вбудований фрейм", langs: "HTML", example: '<iframe src="https://example.com" title="демо"></iframe>', explain: "Вбудовує іншу HTML-сторінку всередину поточної." },
  { cat: "HTML: Вбудований вміст", sym: "sandbox / allow", en: "Iframe security", ua: "Обмеження iframe", langs: "HTML", example: 'sandbox="allow-scripts"', explain: "sandbox обмежує можливості вбудованого документа, allow дозволяє конкретні API (камера, повноекранний режим)." },
  { cat: "HTML: Вбудований вміст", sym: "srcdoc", en: "Inline iframe document", ua: "Вбудований HTML для iframe", langs: "HTML", example: '<iframe srcdoc="<p>Привіт</p>"></iframe>', explain: "Вставляє HTML прямо в iframe без окремого файлу." },
  { cat: "HTML: Вбудований вміст", sym: "<embed>", en: "Embedded resource", ua: "Вбудований ресурс", langs: "HTML", example: '<embed src="file.pdf" type="application/pdf">', explain: "Вбудовує зовнішній ресурс (PDF, застарілий плагін-контент), без запасного вмісту." },
  { cat: "HTML: Вбудований вміст", sym: "<object> / <param>", en: "Object embed", ua: "Вбудований об'єкт", langs: "HTML", example: '<object data="file.pdf">Резерв</object>', explain: "Вбудовує ресурс з можливістю показати резервний вміст, param задає параметри для нього." },

  { cat: "HTML: Списки", sym: "<ul>", en: "Unordered list", ua: "Маркований список", langs: "HTML", example: "<ul><li>Пункт</li></ul>", explain: "Список без нумерації, елементи позначені маркерами." },
  { cat: "HTML: Списки", sym: "<ol>", en: "Ordered list", ua: "Нумерований список", langs: "HTML", example: "<ol><li>Пункт</li></ol>", explain: "Список з автоматичною нумерацією елементів." },
  { cat: "HTML: Списки", sym: "<li>", en: "List item", ua: "Елемент списку", langs: "HTML", example: "<li>Пункт списку</li>", explain: "Один елемент маркованого чи нумерованого списку." },
  { cat: "HTML: Списки", sym: "<dl>", en: "Description list", ua: "Список визначень", langs: "HTML", example: "<dl><dt>HTML</dt><dd>Мова розмітки</dd></dl>", explain: "Список пар термін-визначення (dt/dd)." },
  { cat: "HTML: Списки", sym: "<dt> / <dd>", en: "Term / description", ua: "Термін / опис", langs: "HTML", example: "<dt>Термін</dt><dd>Опис</dd>", explain: "dt — термін, dd — його опис, обидва всередині dl." },
  { cat: "HTML: Списки", sym: "<menu>", en: "Menu list", ua: "Список команд", langs: "HTML", example: "<menu><li><button>Дія</button></li></menu>", explain: "Семантична альтернатива ul для списку команд/дій." },
  { cat: "HTML: Таблиці", sym: "<table>", en: "Table", ua: "Таблиця", langs: "HTML", example: "<table>...</table>", explain: "Створює таблицю для табличних даних." },
  { cat: "HTML: Таблиці", sym: "<caption>", en: "Table caption", ua: "Підпис таблиці", langs: "HTML", example: "<caption>Продажі за 2024</caption>", explain: "Заголовок/підпис таблиці, перший дочірній елемент table." },
  { cat: "HTML: Таблиці", sym: "<thead> / <tbody> / <tfoot>", en: "Table sections", ua: "Секції таблиці", langs: "HTML", example: "<thead>...</thead><tbody>...</tbody>", explain: "Групують рядки таблиці на шапку, тіло й підвал." },
  { cat: "HTML: Таблиці", sym: "<tr>", en: "Table row", ua: "Рядок таблиці", langs: "HTML", example: "<tr><td>1</td></tr>", explain: "Один рядок таблиці." },
  { cat: "HTML: Таблиці", sym: "<th>", en: "Table header cell", ua: "Заголовна комірка", langs: "HTML", example: "<th>Назва</th>", explain: "Заголовна комірка таблиці — жирний текст, по центру." },
  { cat: "HTML: Таблиці", sym: "<td>", en: "Table data cell", ua: "Комірка з даними", langs: "HTML", example: "<td>Значення</td>", explain: "Звичайна комірка таблиці з даними." },
  { cat: "HTML: Таблиці", sym: "<colgroup> / <col>", en: "Column group", ua: "Група колонок", langs: "HTML", example: '<colgroup><col style="background:#eee"></colgroup>', explain: "Дозволяють стилізувати цілі колонки таблиці без класу на кожній комірці." },
  { cat: "HTML: Таблиці", sym: "colspan / rowspan", en: "Cell span", ua: "Об'єднання комірок", langs: "HTML", example: 'colspan="2"', explain: "Розтягує комірку на кілька колонок (colspan) чи рядків (rowspan)." },
  { cat: "HTML: Таблиці", sym: "scope / headers / abbr", en: "Table accessibility attrs", ua: "Атрибути доступності таблиці", langs: "HTML", example: 'scope="col"', explain: "Пов'язують комірки даних із заголовками для скрінрідерів (scope, headers) чи дають скорочену назву заголовка (abbr)." },
  { cat: "HTML: Форми", sym: "<form>", en: "Form", ua: "Форма", langs: "HTML", example: '<form action="/submit" method="post">...</form>', explain: "Контейнер для елементів вводу, що відправляються на сервер." },
  { cat: "HTML: Форми", sym: "<input>", en: "Input field", ua: "Поле вводу", langs: "HTML", example: '<input type="text" name="username">', explain: "Універсальне поле вводу, тип задається атрибутом type." },
  { cat: "HTML: Форми", sym: "<label>", en: "Form label", ua: "Підпис поля", langs: "HTML", example: '<label for="email">Email</label>', explain: "Підпис до поля форми, клік по label фокусує пов'язане поле." },
  { cat: "HTML: Форми", sym: "<textarea>", en: "Textarea", ua: "Багаторядкове поле", langs: "HTML", example: "<textarea rows=\"4\"></textarea>", explain: "Багаторядкове текстове поле вводу." },
  { cat: "HTML: Форми", sym: "<button>", en: "Button", ua: "Кнопка", langs: "HTML", example: '<button type="submit">Надіслати</button>', explain: "Кнопка для відправки форми, скидання чи довільної дії." },
  { cat: "HTML: Форми", sym: "<select> / <option>", en: "Select dropdown", ua: "Випадаючий список", langs: "HTML", example: "<select><option>Варіант</option></select>", explain: "Випадаючий список з варіантами вибору option." },
  { cat: "HTML: Форми", sym: "<optgroup>", en: "Option group", ua: "Група опцій", langs: "HTML", example: '<optgroup label="Фрукти"><option>Яблуко</option></optgroup>', explain: "Групує пов'язані option усередині select." },
  { cat: "HTML: Форми", sym: "<datalist>", en: "Datalist", ua: "Список підказок", langs: "HTML", example: '<input list="colors"><datalist id="colors">...</datalist>', explain: "Список автопідказок для input, не блокує довільне введення." },
  { cat: "HTML: Форми", sym: "<output>", en: "Calculation result", ua: "Результат обчислення", langs: "HTML", example: "<output>42</output>", explain: "Показує результат обчислення чи дії користувача." },
  { cat: "HTML: Форми", sym: "<progress>", en: "Progress bar", ua: "Індикатор прогресу", langs: "HTML", example: '<progress value="70" max="100"></progress>', explain: "Показує прогрес виконання задачі, наприклад завантаження." },
  { cat: "HTML: Форми", sym: "<meter>", en: "Meter gauge", ua: "Вимірювальна шкала", langs: "HTML", example: '<meter value="0.6"></meter>', explain: "Показує значення в межах відомого діапазону — заряд, рейтинг, використання." },
  { cat: "HTML: Форми", sym: "<fieldset> / <legend>", en: "Field group", ua: "Група полів", langs: "HTML", example: "<fieldset><legend>Адреса</legend>...</fieldset>", explain: "Групує пов'язані поля форми з підписом-заголовком legend." },
  { cat: "HTML: Форми", sym: "action / method", en: "Form target/method", ua: "Адреса й метод форми", langs: "HTML", example: 'action="/submit" method="post"', explain: "action — куди відправити дані, method — HTTP-метод (get чи post)." },
  { cat: "HTML: Форми", sym: "enctype / autocomplete / novalidate", en: "Form submission attrs", ua: "Атрибути відправки форми", langs: "HTML", example: 'enctype="multipart/form-data"', explain: "enctype — формат даних (потрібен multipart для файлів), autocomplete — автозаповнення, novalidate — вимкнути валідацію браузера." },

  { cat: "HTML: Типи input", sym: "text / password / email / tel / url / search", en: "Text-like input types", ua: "Текстові типи input", langs: "HTML", example: 'type="email"', explain: "Текстові поля з різною валідацією й клавіатурою на мобільних: email перевіряє формат, password приховує символи." },
  { cat: "HTML: Типи input", sym: "number / range", en: "Numeric input types", ua: "Числові типи input", langs: "HTML", example: 'type="number" min="0" max="100"', explain: "number — поле для числа зі стрілками, range — повзунок вибору числа в діапазоні." },
  { cat: "HTML: Типи input", sym: "date / time / datetime-local / month / week", en: "Date/time input types", ua: "Типи дати й часу", langs: "HTML", example: 'type="date"', explain: "Вбудовані календарі й вибір часу браузером без сторонніх бібліотек." },
  { cat: "HTML: Типи input", sym: "checkbox / radio", en: "Choice input types", ua: "Типи вибору", langs: "HTML", example: 'type="checkbox"', explain: "checkbox — незалежний прапорець, radio — вибір одного з групи однакового name." },
  { cat: "HTML: Типи input", sym: "file / color", en: "File / color picker", ua: "Файл / вибір кольору", langs: "HTML", example: 'type="file" accept="image/*"', explain: "file відкриває вибір файлу з диска, color — палітру вибору кольору." },
  { cat: "HTML: Типи input", sym: "submit / reset / button / image", en: "Button-like input types", ua: "Кнопкові типи input", langs: "HTML", example: 'type="submit"', explain: "submit відправляє форму, reset скидає поля, button — довільна дія через JS, image — кнопка-зображення." },
  { cat: "HTML: Типи input", sym: "hidden", en: "Hidden input", ua: "Прихований input", langs: "HTML", example: '<input type="hidden" name="id" value="42">', explain: "Приховане поле, що відправляється з формою, але не видно користувачу." },
  { cat: "HTML: Атрибути input", sym: "placeholder / value / name", en: "Basic input attrs", ua: "Базові атрибути input", langs: "HTML", example: 'placeholder="Введіть ім\'я"', explain: "placeholder — підказка в порожньому полі, value — поточне значення, name — ключ для відправки даних." },
  { cat: "HTML: Атрибути input", sym: "required / disabled / readonly", en: "Input state attrs", ua: "Атрибути стану input", langs: "HTML", example: "required disabled", explain: "required — форма не відправиться без заповнення, disabled — поле неактивне, readonly — видно, але не редагується." },
  { cat: "HTML: Атрибути input", sym: "min / max / step", en: "Numeric constraints", ua: "Числові обмеження", langs: "HTML", example: 'min="0" max="10" step="0.5"', explain: "Обмежують діапазон і крок для числових полів і range." },
  { cat: "HTML: Атрибути input", sym: "minlength / maxlength", en: "Length constraints", ua: "Обмеження довжини", langs: "HTML", example: 'maxlength="20"', explain: "Мінімальна й максимальна кількість символів для текстового поля." },
  { cat: "HTML: Атрибути input", sym: "pattern", en: "Validation pattern", ua: "Шаблон валідації", langs: "HTML", example: 'pattern="[0-9]{4}"', explain: "Regex-шаблон, якому має відповідати значення поля." },
  { cat: "HTML: Атрибути input", sym: "autofocus / autocomplete", en: "Focus / autofill attrs", ua: "Атрибути фокусу й автозаповнення", langs: "HTML", example: 'autofocus autocomplete="off"', explain: "autofocus фокусує поле при завантаженні сторінки, autocomplete керує автозаповненням браузера." },
  { cat: "HTML: Атрибути input", sym: "multiple", en: "Multiple values", ua: "Кілька значень", langs: "HTML", example: '<input type="file" multiple>', explain: "Дозволяє обрати кілька файлів чи email-адрес в одному полі." },
  { cat: "HTML: Атрибути input", sym: "accept", en: "Accepted file types", ua: "Дозволені типи файлів", langs: "HTML", example: 'accept="image/png, image/jpeg"', explain: "Обмежує, які типи файлів можна обрати в type=\"file\"." },
  { cat: "HTML: Атрибути input", sym: "checked", en: "Checked state", ua: "Стан позначено", langs: "HTML", example: "<input type=\"checkbox\" checked>", explain: "Позначає checkbox чи radio як обраний за замовчуванням." },
  { cat: "HTML: Атрибути input", sym: "form / formaction / formmethod", en: "Form association attrs", ua: "Атрибути прив'язки до форми", langs: "HTML", example: 'form="myform"', explain: "Прив'язують поле/кнопку до форми поза межами DOM-вкладеності, чи перевизначають дію конкретної кнопки." },
  { cat: "HTML: Атрибути input", sym: "list", en: "Datalist reference", ua: "Посилання на datalist", langs: "HTML", example: 'list="colors"', explain: "Зв'язує input зі списком підказок <datalist> за id." },
  { cat: "HTML: Атрибути input", sym: "size / width / height", en: "Visual size attrs", ua: "Атрибути візуального розміру", langs: "HTML", example: 'size="20"', explain: "size — ширина текстового поля в символах, width/height — розмір для type=image." },
  { cat: "HTML: Атрибути input", sym: "dirname", en: "Text direction submission", ua: "Відправка напрямку тексту", langs: "HTML", example: 'dirname="comment.dir"', explain: "Відправляє разом з формою напрямок введеного тексту (ltr/rtl)." },
  { cat: "HTML: Форми", sym: "select: multiple / size", en: "Select multi-select", ua: "Множинний вибір select", langs: "HTML", example: "<select multiple size=\"4\">", explain: "multiple дозволяє обрати кілька опцій, size — скільки рядків видно одразу." },
  { cat: "HTML: Форми", sym: "textarea: rows / cols / wrap", en: "Textarea sizing", ua: "Розмір textarea", langs: "HTML", example: 'rows="4" cols="40"', explain: "rows/cols задають видимий розмір поля, wrap керує переносом тексту при відправці." },
  { cat: "HTML: Форми", sym: "button: type", en: "Button type", ua: "Тип кнопки", langs: "HTML", example: 'type="button"', explain: "submit (типово всередині form), reset чи button — визначає поведінку кнопки." },
  { cat: "HTML: Форми", sym: "formenctype / formnovalidate / formtarget", en: "Button form overrides", ua: "Перевизначення форми кнопкою", langs: "HTML", example: 'formnovalidate', explain: "Дозволяють одній кнопці в формі перевизначити enctype/validation/target лише для себе." },

  { cat: "HTML: Інтерактивність", sym: "<dialog>", en: "Dialog", ua: "Діалогове вікно", langs: "HTML", example: '<dialog id="d">Вміст</dialog>', explain: "Вбудований елемент модального/немодального діалогу, показується через showModal()/show()." },
  { cat: "HTML: Інтерактивність", sym: "<details> / <summary>", en: "Disclosure widget", ua: "Розкривна панель", langs: "HTML", example: "<details><summary>Заголовок</summary>Вміст</details>", explain: "Розкривна панель без JS — summary клікабельний заголовок, details — контейнер, що розгортається." },
  { cat: "HTML: Інтерактивність", sym: "<template>", en: "Template", ua: "Шаблон", langs: "HTML", example: '<template id="t"><li></li></template>', explain: "Розмітка, що не рендериться одразу — клонується через JS скільки завгодно разів." },
  { cat: "HTML: Інтерактивність", sym: "<slot>", en: "Slot", ua: "Слот", langs: "HTML", example: "<slot></slot>", explain: "Місце-заповнювач у веб-компонентах (Shadow DOM) для вставленого ззовні контенту." },
  { cat: "HTML: Інтерактивність", sym: "<canvas>", en: "Canvas", ua: "Полотно", langs: "HTML", example: '<canvas id="c" width="300" height="150"></canvas>', explain: "Порожнє полотно для малювання графіки/анімацій через JavaScript." },
  { cat: "HTML: Глобальні атрибути", sym: "id / class", en: "ID / class", ua: "Ідентифікатор / клас", langs: "HTML", example: 'id="header" class="card active"', explain: "id — унікальний ідентифікатор елемента, class — один чи кілька класів для CSS/JS." },
  { cat: "HTML: Глобальні атрибути", sym: "style / title", en: "Inline style / tooltip", ua: "Вбудований стиль / підказка", langs: "HTML", example: 'style="color: red;" title="Підказка"', explain: "style — CSS прямо на елементі, title — текст спливаючої підказки при наведенні." },
  { cat: "HTML: Глобальні атрибути", sym: "lang / dir", en: "Language / direction", ua: "Мова / напрямок тексту", langs: "HTML", example: 'lang="uk" dir="ltr"', explain: "lang — мова вмісту елемента, dir — напрямок тексту (ltr/rtl)." },
  { cat: "HTML: Глобальні атрибути", sym: "hidden", en: "Hidden", ua: "Прихований", langs: "HTML", example: "<div hidden>...</div>", explain: "Приховує елемент повністю, як display: none." },
  { cat: "HTML: Глобальні атрибути", sym: "tabindex / accesskey", en: "Keyboard navigation attrs", ua: "Атрибути клавіатурної навігації", langs: "HTML", example: 'tabindex="0"', explain: "tabindex керує порядком фокусування клавішею Tab, accesskey — гаряча клавіша для елемента." },
  { cat: "HTML: Глобальні атрибути", sym: "contenteditable / draggable / spellcheck", en: "Editing behavior attrs", ua: "Атрибути поведінки редагування", langs: "HTML", example: "contenteditable=\"true\"", explain: "contenteditable робить елемент редагованим прямо на сторінці, draggable дозволяє перетягування, spellcheck — перевірку орфографії." },
  { cat: "HTML: Глобальні атрибути", sym: "data-*", en: "Custom data attribute", ua: "Власний data-атрибут", langs: "HTML", example: 'data-user-id="42"', explain: "Довільний атрибут для зберігання даних, читається в JS через element.dataset." },
  { cat: "HTML: Глобальні атрибути", sym: "translate / slot / part / inert", en: "Advanced global attrs", ua: "Розширені глобальні атрибути", langs: "HTML", example: 'translate="no"', explain: "translate — чи перекладати вміст автоперекладачем, slot/part — для веб-компонентів, inert — вимикає взаємодію з елементом і його нащадками." },
  { cat: "HTML: ARIA", sym: "role", en: "ARIA role", ua: "Роль елемента", langs: "HTML/ARIA", example: 'role="button"', explain: "Явно задає роль елемента для скрінрідерів, коли семантика HTML-тега недостатня." },
  { cat: "HTML: ARIA", sym: "aria-label / aria-labelledby", en: "Accessible name", ua: "Доступна назва елемента", langs: "HTML/ARIA", example: 'aria-label="Закрити"', explain: "Задають назву елемента для скрінрідерів напряму (aria-label) чи через id іншого елемента (aria-labelledby)." },
  { cat: "HTML: ARIA", sym: "aria-describedby", en: "Accessible description", ua: "Доступний опис елемента", langs: "HTML/ARIA", example: 'aria-describedby="hint"', explain: "Пов'язує елемент з детальнішим описом в іншому місці сторінки." },
  { cat: "HTML: ARIA", sym: "aria-hidden", en: "Hide from accessibility tree", ua: "Приховати від дерева доступності", langs: "HTML/ARIA", example: 'aria-hidden="true"', explain: "Приховує елемент від скрінрідерів, залишаючи видимим візуально (напр. декоративні іконки)." },
  { cat: "HTML: ARIA", sym: "aria-live", en: "Live region", ua: "Жива область оновлень", langs: "HTML/ARIA", example: 'aria-live="polite"', explain: "Повідомляє скрінрідеру озвучувати зміни в цій області автоматично, без переходу фокусу." },
  { cat: "HTML: ARIA", sym: "aria-expanded", en: "Expanded state", ua: "Стан розгорнуто/згорнуто", langs: "HTML/ARIA", example: 'aria-expanded="false"', explain: "Показує, чи розгорнутий елемент — випадаюче меню, акордеон." },
  { cat: "HTML: ARIA", sym: "aria-current", en: "Current item", ua: "Поточний елемент", langs: "HTML/ARIA", example: 'aria-current="page"', explain: "Позначає поточний активний елемент у наборі — поточну сторінку в навігації, крок у майстрі." },
  { cat: "HTML: ARIA", sym: "aria-disabled", en: "Disabled state (ARIA)", ua: "Стан вимкнено (ARIA)", langs: "HTML/ARIA", example: 'aria-disabled="true"', explain: "Повідомляє скрінрідеру, що елемент вимкнено, навіть якщо він візуально не заблокований HTML-атрибутом disabled." },
  { cat: "HTML: ARIA", sym: "aria-selected / aria-checked / aria-pressed", en: "Selection state attrs", ua: "Атрибути стану вибору", langs: "HTML/ARIA", example: 'aria-selected="true"', explain: "Позначають стан вибору для вкладок/списків (selected), чекбоксів (checked) чи кнопок-перемикачів (pressed)." },
  { cat: "HTML: ARIA", sym: "aria-haspopup / aria-controls", en: "Popup/control relation attrs", ua: "Атрибути зв'язку з попапом", langs: "HTML/ARIA", example: 'aria-haspopup="menu"', explain: "aria-haspopup каже, що елемент відкриває меню/діалог, aria-controls вказує id елемента, яким керує." },
  { cat: "HTML: ARIA", sym: "aria-valuemin / aria-valuemax / aria-valuenow / aria-valuetext", en: "Range value attrs", ua: "Атрибути значення діапазону", langs: "HTML/ARIA", example: 'aria-valuenow="50"', explain: "Описують поточне значення й межі для повзунків, прогрес-барів — власних (не нативних) віджетів." },
  { cat: "HTML: ARIA", sym: "aria-required / aria-invalid / aria-readonly", en: "Form validation ARIA attrs", ua: "ARIA-атрибути валідації форми", langs: "HTML/ARIA", example: 'aria-required="true"', explain: "Повідомляють скрінрідеру про обов'язковість, помилку валідації чи режим лише для читання поля форми." },
  { cat: "HTML: ARIA", sym: "aria-modal / aria-atomic / aria-busy", en: "State/behavior ARIA attrs", ua: "ARIA-атрибути стану й поведінки", langs: "HTML/ARIA", example: 'aria-modal="true"', explain: "aria-modal позначає модальне вікно, aria-atomic — озвучувати всю область live-region цілком, aria-busy — область ще оновлюється." },

  { cat: "SVG: Елементи", sym: "<svg>", en: "SVG root", ua: "Корінь SVG", langs: "SVG", example: '<svg viewBox="0 0 100 100">...</svg>', explain: "Кореневий елемент векторної графіки, задає систему координат через viewBox." },
  { cat: "SVG: Елементи", sym: "<rect>", en: "Rectangle", ua: "Прямокутник", langs: "SVG", example: '<rect x="10" y="10" width="80" height="60" />', explain: "Малює прямокутник, rx/ry заокруглюють кути." },
  { cat: "SVG: Елементи", sym: "<circle>", en: "Circle", ua: "Коло", langs: "SVG", example: '<circle cx="50" cy="50" r="40" />', explain: "Малює коло за центром (cx, cy) і радіусом r." },
  { cat: "SVG: Елементи", sym: "<ellipse>", en: "Ellipse", ua: "Еліпс", langs: "SVG", example: '<ellipse cx="50" cy="50" rx="40" ry="20" />', explain: "Малює еліпс з двома радіусами rx/ry." },
  { cat: "SVG: Елементи", sym: "<line>", en: "Line", ua: "Лінія", langs: "SVG", example: '<line x1="0" y1="0" x2="100" y2="100" />', explain: "Малює пряму лінію між двома точками." },
  { cat: "SVG: Елементи", sym: "<polyline>", en: "Polyline", ua: "Ламана лінія", langs: "SVG", example: '<polyline points="0,0 50,50 100,0" />', explain: "Малює незамкнену ламану лінію через список точок." },
  { cat: "SVG: Елементи", sym: "<polygon>", en: "Polygon", ua: "Багатокутник", langs: "SVG", example: '<polygon points="50,0 100,100 0,100" />', explain: "Малює замкнений багатокутник через список точок." },
  { cat: "SVG: Елементи", sym: "<path>", en: "Path", ua: "Довільний контур", langs: "SVG", example: '<path d="M10 10 L90 90" />', explain: "Найгнучкіший елемент — малює будь-яку фігуру через команди в атрибуті d." },
  { cat: "SVG: Елементи", sym: "<g>", en: "Group", ua: "Група", langs: "SVG", example: '<g fill="red">...</g>', explain: "Групує кілька елементів, щоб застосувати до них спільні атрибути чи трансформацію." },
  { cat: "SVG: Елементи", sym: "<defs>", en: "Definitions", ua: "Визначення", langs: "SVG", example: "<defs><linearGradient id=\"g1\">...</linearGradient></defs>", explain: "Контейнер для елементів, що не рендеряться напряму, а використовуються через посилання (градієнти, маски)." },
  { cat: "SVG: Елементи", sym: "<symbol>", en: "Symbol", ua: "Символ", langs: "SVG", example: '<symbol id="icon">...</symbol>', explain: "Визначає перевикористовуваний графічний елемент, схожий на defs, але з власним viewBox." },
  { cat: "SVG: Елементи", sym: "<use>", en: "Use reference", ua: "Використання посилання", langs: "SVG", example: '<use href="#icon" x="10" y="10" />', explain: "Вставляє копію раніше визначеного елемента (symbol, g) за посиланням." },
  { cat: "SVG: Елементи", sym: "<text>", en: "Text", ua: "Текст", langs: "SVG", example: '<text x="10" y="20">Привіт</text>', explain: "Малює текст у координатах SVG." },
  { cat: "SVG: Елементи", sym: "<tspan>", en: "Text span", ua: "Фрагмент тексту", langs: "SVG", example: '<text><tspan fill="red">Ч</tspan>ервоний</text>', explain: "Дозволяє стилізувати чи позиціювати частину тексту всередині text." },
  { cat: "SVG: Елементи", sym: "<textPath>", en: "Text on path", ua: "Текст уздовж контуру", langs: "SVG", example: '<text><textPath href="#curve">Текст</textPath></text>', explain: "Розташовує текст уздовж вказаного path." },
  { cat: "SVG: Елементи", sym: "<image>", en: "SVG image", ua: "Зображення в SVG", langs: "SVG", example: '<image href="photo.jpg" width="100" height="100" />', explain: "Вставляє растрове зображення всередину SVG." },
  { cat: "SVG: Елементи", sym: "<pattern>", en: "Pattern fill", ua: "Візерунок заливки", langs: "SVG", example: '<pattern id="p" width="10" height="10">...</pattern>', explain: "Визначає повторюваний візерунок, який можна використати як fill." },
  { cat: "SVG: Елементи", sym: "<linearGradient>", en: "Linear gradient", ua: "Лінійний градієнт", langs: "SVG", example: '<linearGradient id="g"><stop offset="0%" stop-color="red"/></linearGradient>', explain: "Визначає лінійний перехід кольорів для fill/stroke." },
  { cat: "SVG: Елементи", sym: "<radialGradient>", en: "Radial gradient", ua: "Радіальний градієнт", langs: "SVG", example: '<radialGradient id="g">...</radialGradient>', explain: "Визначає радіальний (від центру) перехід кольорів." },
  { cat: "SVG: Елементи", sym: "<stop>", en: "Gradient stop", ua: "Точка градієнта", langs: "SVG", example: '<stop offset="50%" stop-color="blue" />', explain: "Задає колір у певній точці градієнта." },
  { cat: "SVG: Елементи", sym: "<clipPath>", en: "Clip path", ua: "Область обрізання", langs: "SVG", example: '<clipPath id="c"><circle .../></clipPath>', explain: "Визначає форму, якою обрізається вміст іншого елемента." },
  { cat: "SVG: Елементи", sym: "<mask>", en: "Mask", ua: "Маска", langs: "SVG", example: '<mask id="m">...</mask>', explain: "Визначає маску прозорості на основі яскравості вмісту." },
  { cat: "SVG: Елементи", sym: "<filter>", en: "Filter container", ua: "Контейнер фільтра", langs: "SVG", example: '<filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>', explain: "Контейнер для ефектів обробки зображення (розмиття, тінь, кольорокорекція)." },
  { cat: "SVG: Елементи", sym: "<marker>", en: "Marker", ua: "Маркер лінії", langs: "SVG", example: '<marker id="arrow">...</marker>', explain: "Визначає фігуру (наприклад стрілку), що ставиться на кінці/початку path чи line." },
  { cat: "SVG: Елементи", sym: "<foreignObject>", en: "Foreign object", ua: "Чужорідний вміст", langs: "SVG", example: '<foreignObject width="100" height="50"><div xmlns="...">HTML</div></foreignObject>', explain: "Дозволяє вставити звичайний HTML усередину SVG." },
  { cat: "SVG: Елементи", sym: "<switch>", en: "Conditional switch", ua: "Умовний перемикач", langs: "SVG", example: "<switch>...</switch>", explain: "Показує перший дочірній елемент, що відповідає умові (напр. підтримка функції)." },
  { cat: "SVG: Елементи", sym: "<view>", en: "View", ua: "Точка перегляду", langs: "SVG", example: '<view id="v1" viewBox="0 0 50 50" />', explain: "Визначає іменований фрагмент SVG, на який можна перейти через URL-якір." },
  { cat: "SVG: Елементи", sym: "<title> / <desc> / <metadata>", en: "Accessibility/metadata elements", ua: "Елементи доступності й метаданих", langs: "SVG", example: "<title>Логотип</title>", explain: "title/desc дають текстовий опис для скрінрідерів, metadata — довільні структуровані дані." },
  { cat: "SVG: Елементи", sym: "<style> / <script>", en: "SVG style/script", ua: "Стилі й скрипти в SVG", langs: "SVG", example: "<style>circle { fill: red; }</style>", explain: "Ті самі можливості, що в HTML, але всередині SVG-документа." },
  { cat: "SVG: Елементи", sym: "<a>", en: "SVG link", ua: "Посилання в SVG", langs: "SVG", example: '<a href="#"><circle .../></a>', explain: "Робить вкладені SVG-елементи клікабельним посиланням." },
  { cat: "SVG: Анімація", sym: "<animate>", en: "Animate attribute", ua: "Анімація атрибута", langs: "SVG", example: '<animate attributeName="r" from="10" to="40" dur="1s" />', explain: "Анімує значення атрибута елемента з часом, без CSS/JS." },
  { cat: "SVG: Анімація", sym: "<animateMotion> / <mpath>", en: "Motion path animation", ua: "Анімація руху по контуру", langs: "SVG", example: "<animateMotion dur=\"3s\"><mpath href=\"#path\"/></animateMotion>", explain: "Переміщує елемент уздовж заданого path з часом." },
  { cat: "SVG: Анімація", sym: "<animateTransform>", en: "Animate transform", ua: "Анімація трансформації", langs: "SVG", example: '<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />', explain: "Анімує transform (обертання, масштаб, зсув) з часом." },
  { cat: "SVG: Анімація", sym: "<set>", en: "Set attribute", ua: "Встановити атрибут", langs: "SVG", example: '<set attributeName="fill" to="red" begin="1s" />', explain: "Миттєво змінює значення атрибута в заданий момент часу, без плавного переходу." },
  { cat: "SVG: Анімація", sym: "<discard>", en: "Discard element", ua: "Видалити елемент", langs: "SVG", example: '<discard begin="5s" />', explain: "Видаляє елемент з DOM у заданий момент, звільняючи пам'ять для довгих анімацій." },
  { cat: "SVG: Заливка", sym: "<hatch> / <hatchpath>", en: "Hatch pattern", ua: "Штрихова заливка", langs: "SVG", example: "<hatch id=\"h\"><hatchpath .../></hatch>", explain: "Визначає заливку у вигляді паралельних штрихів (експериментальна можливість)." },
  { cat: "SVG: Фільтри", sym: "feGaussianBlur / feDropShadow", en: "Blur / drop shadow filters", ua: "Фільтри розмиття й тіні", langs: "SVG", example: '<feGaussianBlur stdDeviation="3" />', explain: "Найпоширеніші фільтри: розмиття та тінь від об'єкта." },
  { cat: "SVG: Фільтри", sym: "feColorMatrix / feComponentTransfer / feFuncR/G/B/A", en: "Color manipulation filters", ua: "Фільтри обробки кольору", langs: "SVG", example: '<feColorMatrix type="saturate" values="0" />', explain: "Змінюють кольори зображення — насиченість, канали, ефекти на кшталт чорно-білого." },
  { cat: "SVG: Фільтри", sym: "feBlend / feComposite / feMerge / feMergeNode", en: "Compositing filters", ua: "Фільтри змішування шарів", langs: "SVG", example: '<feMerge><feMergeNode in="SourceGraphic"/></feMerge>', explain: "Об'єднують кілька шарів ефекту в один результат." },
  { cat: "SVG: Фільтри", sym: "feOffset / feMorphology / feConvolveMatrix / feDisplacementMap", en: "Distortion filters", ua: "Фільтри спотворення", langs: "SVG", example: '<feOffset dx="5" dy="5" />', explain: "Зсувають, потовщують/потоншують чи спотворюють форму зображення." },
  { cat: "SVG: Фільтри", sym: "feFlood / feTile / feImage / feTurbulence", en: "Fill/texture filters", ua: "Фільтри заливки й текстури", langs: "SVG", example: '<feTurbulence baseFrequency="0.05" />', explain: "Заповнюють область кольором, повторюваним фрагментом чи згенерованим шумом (для текстур)." },
  { cat: "SVG: Фільтри", sym: "feDiffuseLighting / feSpecularLighting / feDistantLight / fePointLight / feSpotLight", en: "Lighting filters", ua: "Фільтри освітлення", langs: "SVG", example: '<feDiffuseLighting>...</feDiffuseLighting>', explain: "Симулюють освітлення 3D-подібних поверхонь на основі карти висот." },

  { cat: "SVG: Атрибути", sym: "viewBox / xmlns / preserveAspectRatio", en: "SVG viewport attrs", ua: "Атрибути області перегляду", langs: "SVG", example: 'viewBox="0 0 100 100"', explain: "viewBox задає систему координат, xmlns — простір імен (обов'язковий для inline SVG), preserveAspectRatio — як масштабувати при невідповідності пропорцій." },
  { cat: "SVG: Атрибути", sym: "width / height", en: "SVG dimensions", ua: "Розміри SVG", langs: "SVG", example: 'width="200" height="100"', explain: "Розмір SVG-елемента на сторінці (може відрізнятись від координат viewBox)." },
  { cat: "SVG: Атрибути", sym: "x / y / cx / cy", en: "Position attrs", ua: "Атрибути позиції", langs: "SVG", example: 'cx="50" cy="50"', explain: "x/y — координати лівого верхнього кута (rect, image), cx/cy — координати центру (circle, ellipse)." },
  { cat: "SVG: Атрибути", sym: "r / rx / ry", en: "Radius attrs", ua: "Атрибути радіуса", langs: "SVG", example: 'r="40"', explain: "r — радіус кола, rx/ry — радіуси еліпса чи заокруглення кутів прямокутника." },
  { cat: "SVG: Атрибути", sym: "x1 / y1 / x2 / y2", en: "Line coordinates", ua: "Координати лінії", langs: "SVG", example: 'x1="0" y1="0" x2="100" y2="100"', explain: "Координати початку й кінця лінії чи вісі градієнта." },
  { cat: "SVG: Атрибути", sym: "d", en: "Path data", ua: "Дані контуру", langs: "SVG", example: 'd="M10 10 L90 90 Z"', explain: "Опис форми контуру через команди: M (рух), L (лінія), C (крива), Z (замкнути)." },
  { cat: "SVG: Атрибути", sym: "points", en: "Points list", ua: "Список точок", langs: "SVG", example: 'points="0,0 50,50 100,0"', explain: "Список координат для polyline чи polygon." },
  { cat: "SVG: Атрибути", sym: "fill / fill-opacity / fill-rule", en: "Fill attrs", ua: "Атрибути заливки", langs: "SVG", example: 'fill="red" fill-opacity="0.5"', explain: "fill — колір заливки, fill-opacity — її прозорість, fill-rule — як визначати внутрішню область складних фігур." },
  { cat: "SVG: Атрибути", sym: "stroke / stroke-width / stroke-opacity", en: "Stroke attrs", ua: "Атрибути контуру", langs: "SVG", example: 'stroke="black" stroke-width="2"', explain: "Колір, товщина й прозорість обвідної лінії фігури." },
  { cat: "SVG: Атрибути", sym: "stroke-dasharray / stroke-dashoffset", en: "Dashed stroke attrs", ua: "Атрибути пунктирної лінії", langs: "SVG", example: 'stroke-dasharray="5,5"', explain: "Задають пунктирний малюнок лінії й зсув початку пунктиру (часто для анімації малювання)." },
  { cat: "SVG: Атрибути", sym: "stroke-linecap / stroke-linejoin / stroke-miterlimit", en: "Stroke joint attrs", ua: "Атрибути з'єднань лінії", langs: "SVG", example: 'stroke-linecap="round"', explain: "Керують формою кінців лінії (linecap) і з'єднань кутів (linejoin)." },
  { cat: "SVG: Атрибути", sym: "transform", en: "SVG transform", ua: "Трансформація SVG", langs: "SVG", example: 'transform="rotate(45 50 50)"', explain: "Обертає, масштабує чи зсуває SVG-елемент, як CSS transform." },
  { cat: "SVG: Атрибути", sym: "patternUnits / gradientUnits", en: "Fill unit systems", ua: "Системи одиниць заливки", langs: "SVG", example: 'gradientUnits="userSpaceOnUse"', explain: "Визначають, в яких координатах вимірюються розміри патерну чи градієнта." },
  { cat: "SVG: Атрибути", sym: "clip-path / mask", en: "Clip/mask reference", ua: "Посилання на обрізання/маску", langs: "SVG", example: 'clip-path="url(#c)"', explain: "Застосовують раніше визначений clipPath чи mask до елемента." },
  { cat: "SVG: Атрибути", sym: "marker-start / marker-mid / marker-end", en: "Marker placement attrs", ua: "Атрибути розміщення маркера", langs: "SVG", example: 'marker-end="url(#arrow)"', explain: "Вказують, який marker поставити на початку, посередині чи в кінці лінії/контуру." },
  { cat: "SVG: Атрибути", sym: "opacity", en: "Opacity", ua: "Прозорість", langs: "SVG", example: 'opacity="0.5"', explain: "Загальна прозорість усього елемента (і заливки, і контуру разом)." },

  { cat: "CSS: Box model", sym: "width / height", en: "Width / height", ua: "Ширина / висота", langs: "CSS", example: "width: 200px; height: 100px;", explain: "Задають розмір контенту елемента." },
  { cat: "CSS: Box model", sym: "min-width / max-width / min-height / max-height", en: "Size constraints", ua: "Обмеження розміру", langs: "CSS", example: "max-width: 600px;", explain: "Обмежують мінімальний і максимальний розмір елемента, корисно для адаптивності." },
  { cat: "CSS: Box model", sym: "margin", en: "Margin", ua: "Зовнішній відступ", langs: "CSS", example: "margin: 10px 20px;", explain: "Простір поза рамкою елемента, між ним і сусідами." },
  { cat: "CSS: Box model", sym: "margin-top / -right / -bottom / -left", en: "Margin sides", ua: "Відступи по сторонах", langs: "CSS", example: "margin-top: 10px;", explain: "Задають зовнішній відступ з конкретної сторони окремо." },
  { cat: "CSS: Box model", sym: "padding", en: "Padding", ua: "Внутрішній відступ", langs: "CSS", example: "padding: 16px;", explain: "Простір між контентом елемента і його рамкою." },
  { cat: "CSS: Box model", sym: "padding-top / -right / -bottom / -left", en: "Padding sides", ua: "Внутрішні відступи по сторонах", langs: "CSS", example: "padding-left: 8px;", explain: "Задають внутрішній відступ з конкретної сторони окремо." },
  { cat: "CSS: Box model", sym: "box-sizing", en: "Box sizing", ua: "Модель розрахунку розміру", langs: "CSS", example: "box-sizing: border-box;", explain: "border-box — width/height включають padding+border; content-box — типова поведінка без них." },
  { cat: "CSS: Box model", sym: "box-decoration-break", en: "Box decoration break", ua: "Розбиття декорації блоку", langs: "CSS", example: "box-decoration-break: clone;", explain: "Керує, як виглядає фон/рамка елемента, розбитого на кілька рядків чи колонок." },
  { cat: "CSS: Display", sym: "display", en: "Display", ua: "Тип відображення", langs: "CSS", example: "display: flex;", explain: "Визначає, як елемент бере участь у макеті сторінки — блок, рядок, flex, grid тощо." },
  { cat: "CSS: Display", sym: "block / inline / inline-block", en: "Basic display values", ua: "Базові значення display", langs: "CSS", example: "display: inline-block;", explain: "block — на весь рядок з нового рядка, inline — у потоці тексту, inline-block — у потоці, але з розмірами як у block." },
  { cat: "CSS: Display", sym: "none", en: "Display none", ua: "Приховати повністю", langs: "CSS", example: "display: none;", explain: "Повністю прибирає елемент з макету — місце під нього не резервується." },
  { cat: "CSS: Display", sym: "table / table-row / table-cell", en: "Table display values", ua: "Значення display для таблиць", langs: "CSS", example: "display: table-cell;", explain: "Дозволяють будь-якому елементу поводитись як частина таблиці без реальних тегів table/tr/td." },
  { cat: "CSS: Display", sym: "flow-root / contents", en: "Layout containment values", ua: "Значення керування потоком", langs: "CSS", example: "display: flow-root;", explain: "flow-root створює новий блоковий контекст форматування (заміна clearfix-хаку), contents прибирає власну рамку елемента, лишаючи його дітей у потоці." },
  { cat: "CSS: Позиціювання", sym: "position", en: "Position", ua: "Позиціювання", langs: "CSS", example: "position: absolute;", explain: "Визначає метод позиціювання елемента: static, relative, absolute, fixed, sticky." },
  { cat: "CSS: Позиціювання", sym: "static / relative", en: "Static / relative position", ua: "Статичне / відносне позиціювання", langs: "CSS", example: "position: relative;", explain: "static — типова поведінка, relative — зсув відносно власного нормального положення." },
  { cat: "CSS: Позиціювання", sym: "absolute / fixed", en: "Absolute / fixed position", ua: "Абсолютне / фіксоване позиціювання", langs: "CSS", example: "position: absolute; top: 0;", explain: "absolute — відносно найближчого позиціонованого предка, fixed — відносно вікна браузера, не рухається при скролі." },
  { cat: "CSS: Позиціювання", sym: "sticky", en: "Sticky position", ua: "Липке позиціювання", langs: "CSS", example: "position: sticky; top: 0;", explain: "Елемент поводиться як relative, поки не досягне заданого краю при скролі, потім «прилипає» як fixed." },
  { cat: "CSS: Позиціювання", sym: "top / right / bottom / left / inset", en: "Offset properties", ua: "Властивості зміщення", langs: "CSS", example: "top: 10px; left: 0;", explain: "Задають зміщення позиціонованого елемента від відповідного краю, inset — скорочення для всіх чотирьох одразу." },
  { cat: "CSS: Позиціювання", sym: "z-index", en: "Z-index", ua: "Порядок накладання", langs: "CSS", example: "z-index: 10;", explain: "Визначає порядок елементів по осі глибини — більше число зверху (лише для позиціонованих елементів)." },
  { cat: "CSS: Overflow", sym: "overflow", en: "Overflow", ua: "Переповнення контенту", langs: "CSS", example: "overflow: auto;", explain: "Керує вмістом, що не влазить у розмір елемента: visible, hidden, scroll, auto." },
  { cat: "CSS: Overflow", sym: "overflow-x / overflow-y", en: "Axis-specific overflow", ua: "Переповнення по осі", langs: "CSS", example: "overflow-y: scroll;", explain: "Керують переповненням окремо по горизонталі й вертикалі." },
  { cat: "CSS: Overflow", sym: "text-overflow", en: "Text overflow", ua: "Обрізання тексту", langs: "CSS", example: "text-overflow: ellipsis;", explain: "Показує три крапки (ellipsis) чи обрізає (clip) текст, що не влазить у рядок." },
  { cat: "CSS: Layout", sym: "float / clear", en: "Float / clear", ua: "Обтікання / очищення", langs: "CSS", example: "float: left; clear: both;", explain: "float обтікає елемент текстом (застарілий підхід до макетів), clear забороняє сусідам обтікати." },
  { cat: "CSS: Layout", sym: "visibility", en: "Visibility", ua: "Видимість", langs: "CSS", example: "visibility: hidden;", explain: "Приховує елемент, але місце під нього лишається зарезервованим (на відміну від display: none)." },

  { cat: "CSS: Flexbox", sym: "flex-direction / flex-wrap / flex-flow", en: "Flex axis/wrap", ua: "Напрямок і перенос flex", langs: "CSS", example: "flex-direction: column;", explain: "flex-direction задає напрямок головної осі (ряд/стовпчик), flex-wrap дозволяє перенос елементів на новий рядок." },
  { cat: "CSS: Flexbox", sym: "justify-content", en: "Justify content", ua: "Вирівнювання по головній осі", langs: "CSS", example: "justify-content: space-between;", explain: "Розподіляє вільний простір між flex-елементами вздовж головної осі." },
  { cat: "CSS: Flexbox", sym: "align-items / align-self", en: "Align items/self", ua: "Вирівнювання по поперечній осі", langs: "CSS", example: "align-items: center;", explain: "align-items вирівнює всі елементи по поперечній осі, align-self перевизначає це для одного елемента." },
  { cat: "CSS: Flexbox", sym: "align-content", en: "Align content", ua: "Вирівнювання рядків flex", langs: "CSS", example: "align-content: space-around;", explain: "Розподіляє простір між рядками flex-контейнера, коли їх кілька (при flex-wrap)." },
  { cat: "CSS: Flexbox", sym: "flex-grow / flex-shrink / flex-basis / flex", en: "Flex item sizing", ua: "Розмір flex-елемента", langs: "CSS", example: "flex: 1 1 200px;", explain: "flex-grow — наскільки елемент росте, flex-shrink — наскільки стискається, flex-basis — базовий розмір; flex — скорочення всіх трьох." },
  { cat: "CSS: Flexbox", sym: "order", en: "Order", ua: "Порядок елемента", langs: "CSS", example: "order: -1;", explain: "Змінює візуальний порядок flex/grid-елемента без зміни порядку в HTML." },
  { cat: "CSS: Flexbox", sym: "gap / row-gap / column-gap", en: "Gap", ua: "Проміжок між елементами", langs: "CSS", example: "gap: 10px;", explain: "Задає відступ між елементами flex/grid-контейнера без потреби в margin." },
  { cat: "CSS: Grid", sym: "grid-template-columns / grid-template-rows", en: "Grid template axes", ua: "Шаблон колонок/рядків grid", langs: "CSS", example: "grid-template-columns: 1fr 2fr 1fr;", explain: "Задають кількість і розмір колонок чи рядків сітки." },
  { cat: "CSS: Grid", sym: "grid-template-areas", en: "Grid template areas", ua: "Іменовані області grid", langs: "CSS", example: '"header header" "sidebar content"', explain: "Дозволяє визначити макет через текстову схему з іменованими областями." },
  { cat: "CSS: Grid", sym: "grid-auto-columns / grid-auto-rows / grid-auto-flow", en: "Implicit grid tracks", ua: "Неявні треки grid", langs: "CSS", example: "grid-auto-flow: dense;", explain: "Керують розміром і напрямком заповнення доріжок, які не задані явно в template." },
  { cat: "CSS: Grid", sym: "grid-column / grid-row", en: "Grid item placement", ua: "Розміщення елемента в grid", langs: "CSS", example: "grid-column: span 2;", explain: "Визначає, в яких колонках/рядках сітки розташований елемент." },
  { cat: "CSS: Grid", sym: "grid-area", en: "Grid area shorthand", ua: "Скорочення для grid-area", langs: "CSS", example: "grid-area: header;", explain: "Скорочений запис позиції елемента — або ім'я з grid-template-areas, або 4 лінії одразу." },
  { cat: "CSS: Grid", sym: "place-items / place-content / place-self", en: "Combined alignment", ua: "Комбіноване вирівнювання", langs: "CSS", example: "place-items: center;", explain: "Скорочення, що задає одразу і align-*, і justify-* властивості." },
  { cat: "CSS: Функції розміру", sym: "repeat() / minmax() / fit-content()", en: "Grid sizing functions", ua: "Функції розміру для grid", langs: "CSS", example: "grid-template-columns: repeat(3, minmax(100px, 1fr));", explain: "repeat() повторює шаблон колонок, minmax() задає діапазон розміру, fit-content() обмежує розмір під вміст." },
  { cat: "CSS: Функції розміру", sym: "auto-fit / auto-fill", en: "Auto grid columns", ua: "Автоматичні колонки grid", langs: "CSS", example: "repeat(auto-fit, minmax(150px, 1fr))", explain: "Автоматично визначають кількість колонок залежно від доступного простору." },
  { cat: "CSS: Функції розміру", sym: "calc()", en: "Calc function", ua: "Функція обчислення", langs: "CSS", example: "width: calc(100% - 40px);", explain: "Обчислює значення з різних одиниць виміру прямо в CSS." },
  { cat: "CSS: Функції розміру", sym: "min() / max() / clamp()", en: "Comparison functions", ua: "Функції порівняння", langs: "CSS", example: "font-size: clamp(1rem, 2vw, 2rem);", explain: "min/max обирають менше/більше значення, clamp() тримає значення в межах min-переважне-max — зручно для адаптивних розмірів." },

  { cat: "CSS: Кольори", sym: "color", en: "Text color", ua: "Колір тексту", langs: "CSS", example: "color: #7c3aed;", explain: "Задає колір тексту елемента." },
  { cat: "CSS: Кольори", sym: "background-color", en: "Background color", ua: "Колір фону", langs: "CSS", example: "background-color: white;", explain: "Задає суцільний колір фону елемента." },
  { cat: "CSS: Кольори", sym: "background-image / background-size / background-position", en: "Background image attrs", ua: "Атрибути фонового зображення", langs: "CSS", example: "background-size: cover;", explain: "Підключають зображення як фон, керують його масштабом і позицією." },
  { cat: "CSS: Кольори", sym: "background-repeat / background-attachment", en: "Background tiling/scroll", ua: "Повторення й прокрутка фону", langs: "CSS", example: "background-repeat: no-repeat;", explain: "repeat керує повторенням фонового зображення, attachment — чи фон прокручується разом зі сторінкою (fixed для паралаксу)." },
  { cat: "CSS: Кольори", sym: "background-clip / background-origin", en: "Background box reference", ua: "Область відліку фону", langs: "CSS", example: "background-clip: padding-box;", explain: "Визначають, від якого шару блоку (border/padding/content) рахується фон." },
  { cat: "CSS: Кольори", sym: "background", en: "Background shorthand", ua: "Скорочення фону", langs: "CSS", example: "background: #fff url(bg.png) no-repeat center / cover;", explain: "Скорочений запис усіх background-* властивостей одним рядком." },
  { cat: "CSS: Кольори", sym: "background-blend-mode / mix-blend-mode", en: "Blend modes", ua: "Режими змішування кольорів", langs: "CSS", example: "mix-blend-mode: multiply;", explain: "Визначають, як кольори елемента змішуються з тим, що під ним (як шари в Photoshop)." },
  { cat: "CSS: Кольори", sym: "accent-color", en: "Accent color", ua: "Акцентний колір", langs: "CSS", example: "accent-color: #7c3aed;", explain: "Задає колір нативних елементів форми — checkbox, radio, range." },
  { cat: "CSS: Функції кольору", sym: "rgb() / rgba()", en: "RGB color function", ua: "Функція кольору RGB", langs: "CSS", example: "rgba(14, 165, 233, 0.5)", explain: "Задає колір через канали червоний/зелений/синій, з опціональною прозорістю a." },
  { cat: "CSS: Функції кольору", sym: "hsl() / hsla()", en: "HSL color function", ua: "Функція кольору HSL", langs: "CSS", example: "hsl(262, 83%, 58%)", explain: "Задає колір через тон/насиченість/яскравість — зручно для варіацій одного відтінку." },
  { cat: "CSS: Функції кольору", sym: "oklch() / oklab()", en: "Modern color functions", ua: "Сучасні функції кольору", langs: "CSS", example: "oklch(60% 0.15 280)", explain: "Новіші кольорові простори з перцептивно рівномірними переходами — краще для градієнтів." },
  { cat: "CSS: Функції кольору", sym: "currentColor / transparent", en: "Keyword colors", ua: "Ключові слова кольору", langs: "CSS", example: "border-color: currentColor;", explain: "currentColor успадковує поточний колір тексту, transparent — повністю прозорий." },
  { cat: "CSS: Градієнти", sym: "linear-gradient()", en: "Linear gradient", ua: "Лінійний градієнт", langs: "CSS", example: "linear-gradient(90deg, red, blue)", explain: "Плавний перехід кольорів під заданим кутом." },
  { cat: "CSS: Градієнти", sym: "radial-gradient()", en: "Radial gradient", ua: "Радіальний градієнт", langs: "CSS", example: "radial-gradient(circle, red, blue)", explain: "Плавний перехід кольорів від центру назовні." },
  { cat: "CSS: Градієнти", sym: "conic-gradient()", en: "Conic gradient", ua: "Конічний градієнт", langs: "CSS", example: "conic-gradient(red, yellow, green)", explain: "Перехід кольорів по колу навколо центральної точки — зручно для діаграм." },
  { cat: "CSS: Градієнти", sym: "repeating-linear-gradient() / repeating-radial-gradient()", en: "Repeating gradients", ua: "Повторювані градієнти", langs: "CSS", example: "repeating-linear-gradient(45deg, red 0 10px, blue 10px 20px)", explain: "Повторюють шаблон градієнта — зручно для смугастих текстур." },
  { cat: "CSS: Рамки", sym: "border", en: "Border shorthand", ua: "Скорочення рамки", langs: "CSS", example: "border: 2px solid black;", explain: "Скорочений запис товщини, стилю й кольору рамки одразу." },
  { cat: "CSS: Рамки", sym: "border-width / border-style / border-color", en: "Border components", ua: "Компоненти рамки", langs: "CSS", example: "border-style: dashed;", explain: "Задають товщину, стиль лінії й колір рамки окремо." },
  { cat: "CSS: Рамки", sym: "border-top / -right / -bottom / -left", en: "Border sides", ua: "Рамка по сторонах", langs: "CSS", example: "border-bottom: 1px solid #ccc;", explain: "Задають рамку лише з однієї сторони елемента." },
  { cat: "CSS: Рамки", sym: "border-radius", en: "Border radius", ua: "Заокруглення кутів", langs: "CSS", example: "border-radius: 8px;", explain: "Заокруглює кути елемента, 50% робить коло/еліпс." },
  { cat: "CSS: Рамки", sym: "border-image", en: "Border image", ua: "Зображення як рамка", langs: "CSS", example: "border-image: url(frame.png) 30 round;", explain: "Використовує зображення замість суцільного кольору для рамки." },
  { cat: "CSS: Рамки", sym: "none / dotted / dashed / solid / double", en: "Border style values", ua: "Значення стилю рамки", langs: "CSS", example: "border-style: double;", explain: "Різні візуальні стилі лінії рамки." },
  { cat: "CSS: Тіні", sym: "box-shadow", en: "Box shadow", ua: "Тінь блоку", langs: "CSS", example: "box-shadow: 0 4px 10px rgba(0,0,0,0.2);", explain: "Додає тінь навколо елемента — зсув, розмиття, розширення, колір." },
  { cat: "CSS: Тіні", sym: "text-shadow", en: "Text shadow", ua: "Тінь тексту", langs: "CSS", example: "text-shadow: 1px 1px 2px black;", explain: "Додає тінь під текстом." },
  { cat: "CSS: Курсор", sym: "cursor", en: "Cursor", ua: "Курсор миші", langs: "CSS", example: "cursor: pointer;", explain: "Змінює вигляд курсора при наведенні на елемент: pointer, grab, not-allowed тощо." },

  { cat: "CSS: Текст", sym: "font-family", en: "Font family", ua: "Гарнітура шрифту", langs: "CSS", example: "font-family: 'Segoe UI', sans-serif;", explain: "Список шрифтів у порядку пріоритету, останній — типово запасна категорія (sans-serif, serif, monospace)." },
  { cat: "CSS: Текст", sym: "font-size / font-weight / font-style", en: "Basic font attrs", ua: "Базові атрибути шрифту", langs: "CSS", example: "font-size: 18px; font-weight: bold;", explain: "Розмір, жирність (100-900) і стиль (normal/italic) шрифту." },
  { cat: "CSS: Текст", sym: "font-variant / font-stretch / font-size-adjust", en: "Advanced font attrs", ua: "Розширені атрибути шрифту", langs: "CSS", example: "font-variant: small-caps;", explain: "Керують капітелями, шириною накреслення й вирівнюванням розміру між різними шрифтами." },
  { cat: "CSS: Текст", sym: "font", en: "Font shorthand", ua: "Скорочення шрифту", langs: "CSS", example: "font: italic bold 16px/1.5 sans-serif;", explain: "Скорочений запис усіх font-* властивостей одним рядком." },
  { cat: "CSS: Текст", sym: "line-height", en: "Line height", ua: "Висота рядка", langs: "CSS", example: "line-height: 1.5;", explain: "Висота рядка тексту — впливає на міжрядковий інтервал і читабельність." },
  { cat: "CSS: Текст", sym: "letter-spacing / word-spacing", en: "Character/word spacing", ua: "Міжсимвольний/міжслівний інтервал", langs: "CSS", example: "letter-spacing: 1px;", explain: "Керують відстанню між символами чи словами." },
  { cat: "CSS: Текст", sym: "text-align / text-align-last", en: "Text alignment", ua: "Вирівнювання тексту", langs: "CSS", example: "text-align: center;", explain: "Вирівнює текст по горизонталі: left, center, right, justify." },
  { cat: "CSS: Текст", sym: "text-indent", en: "Text indent", ua: "Відступ першого рядка", langs: "CSS", example: "text-indent: 2em;", explain: "Задає відступ першого рядка абзацу." },
  { cat: "CSS: Текст", sym: "text-transform", en: "Text transform", ua: "Перетворення регістру", langs: "CSS", example: "text-transform: uppercase;", explain: "Перетворює регістр тексту: uppercase, lowercase, capitalize." },
  { cat: "CSS: Текст", sym: "text-decoration", en: "Text decoration", ua: "Оздоблення тексту", langs: "CSS", example: "text-decoration: underline wavy red;", explain: "Скорочення лінії, стилю, кольору й товщини підкреслення/закреслення тексту." },
  { cat: "CSS: Текст", sym: "text-decoration-line / -style / -color / -thickness", en: "Text decoration parts", ua: "Компоненти оздоблення тексту", langs: "CSS", example: "text-decoration-line: underline;", explain: "Окремі частини text-decoration: лінія, стиль, колір, товщина." },
  { cat: "CSS: Текст", sym: "text-wrap / white-space", en: "Text wrapping", ua: "Перенос тексту", langs: "CSS", example: "white-space: nowrap;", explain: "Керують переносом рядків і збереженням пробілів/переносів у тексті." },
  { cat: "CSS: Текст", sym: "word-break / overflow-wrap / hyphens", en: "Word breaking", ua: "Розбиття слів", langs: "CSS", example: "overflow-wrap: break-word;", explain: "Керують переносом довгих слів, що не влазять у рядок, і автоматичним переносом за складами." },
  { cat: "CSS: Текст", sym: "vertical-align", en: "Vertical align", ua: "Вертикальне вирівнювання", langs: "CSS", example: "vertical-align: middle;", explain: "Вертикальне вирівнювання inline/table-cell елементів відносно рядка." },
  { cat: "CSS: Текст", sym: "normal / bold / bolder / lighter / 100-900", en: "Font-weight values", ua: "Значення жирності шрифту", langs: "CSS", example: "font-weight: 600;", explain: "Числові (100-900) чи ключові значення жирності накреслення шрифту." },
  { cat: "CSS: Списки", sym: "list-style", en: "List style shorthand", ua: "Скорочення стилю списку", langs: "CSS", example: "list-style: square inside;", explain: "Скорочений запис типу маркера, позиції й зображення маркера списку." },
  { cat: "CSS: Списки", sym: "list-style-type", en: "List marker type", ua: "Тип маркера списку", langs: "CSS", example: "list-style-type: decimal;", explain: "Тип маркера: disc, circle, square, decimal, lower-alpha тощо." },
  { cat: "CSS: Списки", sym: "list-style-position / list-style-image", en: "Marker position/image", ua: "Позиція/зображення маркера", langs: "CSS", example: "list-style-position: inside;", explain: "position — маркер всередині чи зовні тексту, image — власне зображення замість стандартного маркера." },
  { cat: "CSS: Об'єкти й зображення", sym: "object-fit / object-position", en: "Object fit/position", ua: "Заповнення/позиція об'єкта", langs: "CSS", example: "object-fit: cover;", explain: "Керують, як зображення/відео вписується в задані розміри контейнера." },
  { cat: "CSS: Об'єкти й зображення", sym: "image-rendering", en: "Image rendering", ua: "Рендеринг зображення", langs: "CSS", example: "image-rendering: pixelated;", explain: "Керує алгоритмом масштабування зображення — важливо для піксель-арту." },

  { cat: "CSS: Transform", sym: "transform", en: "Transform", ua: "Трансформація", langs: "CSS", example: "transform: rotate(15deg) scale(1.1);", explain: "Обертає, масштабує, зсуває чи нахиляє елемент без впливу на сусідні елементи." },
  { cat: "CSS: Transform", sym: "translate() / translateX/Y/Z() / translate3d()", en: "Translate functions", ua: "Функції зсуву", langs: "CSS", example: "transform: translateX(20px);", explain: "Зсувають елемент по осях X/Y/Z, не впливаючи на потік документа." },
  { cat: "CSS: Transform", sym: "scale() / scaleX/Y/Z() / scale3d()", en: "Scale functions", ua: "Функції масштабування", langs: "CSS", example: "transform: scale(1.5);", explain: "Масштабують елемент — 1 без змін, більше 1 збільшує." },
  { cat: "CSS: Transform", sym: "rotate() / rotateX/Y/Z() / rotate3d()", en: "Rotate functions", ua: "Функції обертання", langs: "CSS", example: "transform: rotate(45deg);", explain: "Обертають елемент на заданий кут навколо осі." },
  { cat: "CSS: Transform", sym: "skew() / skewX() / skewY()", en: "Skew functions", ua: "Функції нахилу", langs: "CSS", example: "transform: skewX(10deg);", explain: "Нахиляють елемент по осях, створюючи ефект паралелограма." },
  { cat: "CSS: Transform", sym: "matrix() / matrix3d()", en: "Matrix function", ua: "Матрична функція", langs: "CSS", example: "transform: matrix(1, 0, 0, 1, 20, 10);", explain: "Задає складну 2D/3D трансформацію однією матрицею — рідко пишеться вручну." },
  { cat: "CSS: Transform", sym: "transform-origin", en: "Transform origin", ua: "Точка трансформації", langs: "CSS", example: "transform-origin: top left;", explain: "Точка, відносно якої відбувається трансформація (типово центр елемента)." },
  { cat: "CSS: Transform", sym: "transform-style / perspective / backface-visibility", en: "3D transform context", ua: "Контекст 3D-трансформації", langs: "CSS", example: "transform-style: preserve-3d;", explain: "Керують 3D-простором для вкладених трансформованих елементів і видимістю зворотної сторони." },
  { cat: "CSS: Transition", sym: "transition", en: "Transition shorthand", ua: "Скорочення переходу", langs: "CSS", example: "transition: background 0.3s ease;", explain: "Скорочений запис плавної зміни властивості: що, як довго, з якою кривою, з якою затримкою." },
  { cat: "CSS: Transition", sym: "transition-property / -duration", en: "Transition target/duration", ua: "Ціль і тривалість переходу", langs: "CSS", example: "transition-duration: 0.5s;", explain: "Яку властивість анімувати і скільки часу займає перехід." },
  { cat: "CSS: Transition", sym: "transition-timing-function", en: "Transition easing", ua: "Крива швидкості переходу", langs: "CSS", example: "transition-timing-function: ease-in-out;", explain: "Крива прискорення/сповільнення переходу: linear, ease, cubic-bezier()." },
  { cat: "CSS: Transition", sym: "transition-delay", en: "Transition delay", ua: "Затримка переходу", langs: "CSS", example: "transition-delay: 0.2s;", explain: "Час очікування перед початком переходу." },
  { cat: "CSS: Анімація", sym: "animation", en: "Animation shorthand", ua: "Скорочення анімації", langs: "CSS", example: "animation: pulse 1.5s infinite;", explain: "Скорочений запис усіх animation-* властивостей одним рядком." },
  { cat: "CSS: Анімація", sym: "animation-name / -duration / -delay", en: "Animation identity/timing", ua: "Ідентифікація й час анімації", langs: "CSS", example: "animation-name: pulse;", explain: "Ім'я @keyframes-правила, тривалість одного циклу й затримка перед стартом." },
  { cat: "CSS: Анімація", sym: "animation-timing-function / -iteration-count", en: "Animation easing/repeat", ua: "Крива швидкості й повтори анімації", langs: "CSS", example: "animation-iteration-count: infinite;", explain: "Крива прискорення й кількість повторів циклу (infinite — нескінченно)." },
  { cat: "CSS: Анімація", sym: "animation-direction / -fill-mode / -play-state", en: "Animation playback control", ua: "Керування відтворенням анімації", langs: "CSS", example: "animation-fill-mode: forwards;", explain: "direction — вперед/назад/по черзі, fill-mode — стан до/після анімації, play-state — пауза/відтворення." },
  { cat: "CSS: Анімація", sym: "@keyframes", en: "Keyframes rule", ua: "Правило ключових кадрів", langs: "CSS", example: "@keyframes pulse { 0% {opacity:1;} 100% {opacity:0;} }", explain: "Описує кроки анімації у відсотках (або from/to) для animation-name." },
  { cat: "CSS: Анімація", sym: "from / to", en: "Keyframe shortcuts", ua: "Скорочення для 0%/100%", langs: "CSS", example: "@keyframes fade { from {opacity:0;} to {opacity:1;} }", explain: "Скорочені назви для 0% і 100% у @keyframes." },

  { cat: "CSS: @-правила", sym: "@media", en: "Media query", ua: "Медіа-запит", langs: "CSS", example: "@media (max-width: 600px) { ... }", explain: "Застосовує стилі лише за певної умови — найчастіше розміру екрана." },
  { cat: "CSS: @-правила", sym: "@supports", en: "Feature query", ua: "Запит підтримки можливості", langs: "CSS", example: "@supports (display: grid) { ... }", explain: "Застосовує стилі лише якщо браузер підтримує вказану CSS-можливість." },
  { cat: "CSS: @-правила", sym: "@font-face", en: "Font face", ua: "Підключення шрифту", langs: "CSS", example: "@font-face { font-family: 'Custom'; src: url(font.woff2); }", explain: "Підключає власний файл шрифту для використання через font-family." },
  { cat: "CSS: @-правила", sym: "@import", en: "Import rule", ua: "Імпорт стилів", langs: "CSS", example: "@import url('reset.css');", explain: "Імпортує стилі з іншого CSS-файлу, має бути першим правилом у файлі." },
  { cat: "CSS: @-правила", sym: "@container", en: "Container query", ua: "Запит контейнера", langs: "CSS", example: "@container (min-width: 400px) { ... }", explain: "Застосовує стилі залежно від розміру батьківського контейнера, а не всього вікна." },
  { cat: "CSS: @-правила", sym: "@layer", en: "Cascade layer", ua: "Шар каскаду", langs: "CSS", example: "@layer base, components, utilities;", explain: "Групує стилі в іменовані шари з явним порядком пріоритету в каскаді." },
  { cat: "CSS: @-правила", sym: "@page / @charset / @namespace", en: "Misc at-rules", ua: "Інші @-правила", langs: "CSS", example: "@page { margin: 2cm; }", explain: "@page — стилі для друку, @charset — кодування файлу, @namespace — простір імен для XML/SVG-селекторів." },
  { cat: "CSS: Медіа-фічі", sym: "prefers-color-scheme", en: "Color scheme preference", ua: "Перевага кольорової теми", langs: "CSS", example: "@media (prefers-color-scheme: dark) { ... }", explain: "Визначає, чи користувач обрав темну тему в налаштуваннях ОС." },
  { cat: "CSS: Медіа-фічі", sym: "prefers-reduced-motion", en: "Reduced motion preference", ua: "Перевага зменшеного руху", langs: "CSS", example: "@media (prefers-reduced-motion: reduce) { ... }", explain: "Дозволяє прибрати чи зменшити анімації для користувачів, чутливих до руху." },
  { cat: "CSS: Медіа-фічі", sym: "hover / pointer", en: "Input capability features", ua: "Можливості пристрою вводу", langs: "CSS", example: "@media (hover: hover) { ... }", explain: "Визначають, чи пристрій підтримує наведення й який тип вказівника (миша, тач)." },
  { cat: "CSS: Медіа-фічі", sym: "orientation / aspect-ratio / resolution", en: "Screen geometry features", ua: "Геометрія екрана", langs: "CSS", example: "@media (orientation: landscape) { ... }", explain: "Орієнтація екрана, співвідношення сторін і роздільна здатність пристрою." },
  { cat: "CSS: Селектори", sym: "*", en: "Universal selector", ua: "Універсальний селектор", langs: "CSS", example: "* { box-sizing: border-box; }", explain: "Застосовує стиль до всіх елементів на сторінці." },
  { cat: "CSS: Селектори", sym: "[attr] / [attr=value]", en: "Attribute selectors", ua: "Селектори за атрибутом", langs: "CSS", example: 'a[target="_blank"] { }', explain: "Вибирають елементи за наявністю чи значенням атрибута." },
  { cat: "CSS: Селектори", sym: "[attr^=] [attr$=] [attr*=]", en: "Attribute substring selectors", ua: "Селектори підрядка атрибута", langs: "CSS", example: 'a[href^="https"] { }', explain: "Вибирають за початком (^=), кінцем ($=) чи будь-яким входженням (*=) значення атрибута." },
  { cat: "CSS: Псевдокласи", sym: ":focus-visible / :focus-within", en: "Advanced focus pseudo-classes", ua: "Розширені псевдокласи фокусу", langs: "CSS", example: "button:focus-visible { outline: 2px solid; }", explain: "focus-visible — фокус лише при клавіатурній навігації, focus-within — фокус десь усередині елемента." },
  { cat: "CSS: Псевдокласи", sym: ":is() / :where()", en: "Selector list pseudo-classes", ua: "Псевдокласи списку селекторів", langs: "CSS", example: ":is(h1, h2, h3) { }", explain: "Групують кілька селекторів в один; :where() має нульову специфічність, :is() — специфічність найскладнішого." },
  { cat: "CSS: Псевдокласи", sym: ":has()", en: "Parent/relational pseudo-class", ua: "Батьківський псевдоклас", langs: "CSS", example: "div:has(> img) { }", explain: "Вибирає елемент, якщо всередині нього є елемент, що відповідає селектору — «батьківський» селектор." },
  { cat: "CSS: Псевдокласи", sym: ":empty / :root / :target", en: "Structural pseudo-classes", ua: "Структурні псевдокласи", langs: "CSS", example: ":empty { display: none; }", explain: "empty — елемент без вмісту, root — кореневий елемент документа, target — елемент з активним URL-якорем." },
  { cat: "CSS: Псевдокласи", sym: ":fullscreen / :modal / :open", en: "UI state pseudo-classes", ua: "Псевдокласи стану інтерфейсу", langs: "CSS", example: ":fullscreen { background: black; }", explain: "Позначають елемент у повноекранному режимі, модальному стані чи відкритий dialog/details." },
  { cat: "CSS: Псевдокласи", sym: ":valid / :invalid / :in-range / :out-of-range", en: "Form validation pseudo-classes", ua: "Псевдокласи валідації форми", langs: "CSS", example: "input:invalid { border-color: red; }", explain: "Стилізують поля форми залежно від результату вбудованої валідації." },
  { cat: "CSS: Псевдоелементи", sym: "::marker", en: "List marker pseudo-element", ua: "Псевдоелемент маркера списку", langs: "CSS", example: "li::marker { color: red; }", explain: "Дозволяє стилізувати маркер елемента списку окремо від тексту." },
  { cat: "CSS: Псевдоелементи", sym: "::placeholder", en: "Placeholder pseudo-element", ua: "Псевдоелемент плейсхолдера", langs: "CSS", example: "input::placeholder { color: gray; }", explain: "Стилізує текст-підказку в порожньому полі вводу." },
  { cat: "CSS: Псевдоелементи", sym: "::backdrop", en: "Backdrop pseudo-element", ua: "Псевдоелемент фону-підкладки", langs: "CSS", example: "dialog::backdrop { background: rgba(0,0,0,.5); }", explain: "Стилізує затемнений фон позаду відкритого dialog чи елемента в fullscreen." },
  { cat: "CSS: Псевдоелементи", sym: "::file-selector-button", en: "File input button pseudo-element", ua: "Кнопка вибору файлу", langs: "CSS", example: "input[type=file]::file-selector-button { }", explain: "Стилізує вбудовану кнопку «Обрати файл» у input type=file." },

  { cat: "CSS: Фільтри", sym: "filter", en: "Filter", ua: "Фільтр", langs: "CSS", example: "filter: blur(5px) brightness(1.2);", explain: "Застосовує графічні ефекти (розмиття, яскравість, контраст) до елемента цілком." },
  { cat: "CSS: Фільтри", sym: "backdrop-filter", en: "Backdrop filter", ua: "Фільтр підкладки", langs: "CSS", example: "backdrop-filter: blur(10px);", explain: "Застосовує фільтр до того, що знаходиться ПОЗАДУ елемента — ефект матового скла." },
  { cat: "CSS: Фільтри", sym: "blur() / brightness() / contrast()", en: "Basic filter functions", ua: "Базові функції фільтра", langs: "CSS", example: "filter: contrast(150%);", explain: "Розмиває, змінює яскравість чи контраст елемента." },
  { cat: "CSS: Фільтри", sym: "grayscale() / sepia() / invert() / saturate() / hue-rotate()", en: "Color filter functions", ua: "Кольорові функції фільтра", langs: "CSS", example: "filter: grayscale(100%);", explain: "Змінюють кольори елемента — чорно-білий, сепія, інверсія, насиченість, зсув відтінку." },
  { cat: "CSS: Фільтри", sym: "drop-shadow()", en: "Drop shadow filter", ua: "Фільтр тіні", langs: "CSS", example: "filter: drop-shadow(0 4px 6px rgba(0,0,0,.3));", explain: "Тінь, що повторює реальну форму елемента (на відміну від box-shadow, що завжди прямокутна)." },
  { cat: "CSS: Маска й обрізання", sym: "mask / mask-image", en: "Mask properties", ua: "Властивості маски", langs: "CSS", example: "mask-image: url(shape.svg);", explain: "Обрізають видиму частину елемента за формою маски на основі прозорості/яскравості." },
  { cat: "CSS: Маска й обрізання", sym: "clip-path", en: "Clip path", ua: "Шлях обрізання", langs: "CSS", example: "clip-path: circle(50%);", explain: "Обрізає елемент за геометричною фігурою — коло, багатокутник, довільний контур." },
  { cat: "CSS: Маска й обрізання", sym: "circle() / ellipse() / inset() / polygon() / path()", en: "Clip-path shape functions", ua: "Функції фігур для clip-path", langs: "CSS", example: "clip-path: polygon(50% 0%, 0% 100%, 100% 100%);", explain: "Задають конкретну геометричну форму обрізання." },
  { cat: "CSS: Взаємодія", sym: "pointer-events", en: "Pointer events", ua: "Події вказівника", langs: "CSS", example: "pointer-events: none;", explain: "none робить елемент «прозорим» для кліків — вони проходять крізь нього до елементів під ним." },
  { cat: "CSS: Взаємодія", sym: "user-select", en: "User select", ua: "Виділення тексту користувачем", langs: "CSS", example: "user-select: none;", explain: "Дозволяє чи забороняє виділення тексту елемента мишею." },
  { cat: "CSS: Взаємодія", sym: "resize", en: "Resize", ua: "Зміна розміру елемента", langs: "CSS", example: "resize: vertical;", explain: "Дозволяє користувачу вручну змінювати розмір елемента (типово textarea)." },
  { cat: "CSS: Взаємодія", sym: "touch-action", en: "Touch action", ua: "Дія дотику", langs: "CSS", example: "touch-action: pan-y;", explain: "Керує, які жести дотику (скрол, зум) браузер обробляє сам, а які передає JS." },
  { cat: "CSS: Взаємодія", sym: "caret-color", en: "Caret color", ua: "Колір курсора вводу", langs: "CSS", example: "caret-color: red;", explain: "Задає колір миготливого текстового курсора в полі вводу." },
  { cat: "CSS: Контент", sym: "content", en: "Content", ua: "Контент псевдоелемента", langs: "CSS", example: "content: '→';", explain: "Задає вміст, що вставляється через ::before/::after — обов'язковий для їх появи." },
  { cat: "CSS: Контент", sym: "attr()", en: "Attr function", ua: "Функція значення атрибута", langs: "CSS", example: "content: attr(data-tooltip);", explain: "Вставляє значення HTML-атрибута елемента прямо в CSS content." },
  { cat: "CSS: Лічильники", sym: "counter-reset / counter-increment", en: "CSS counters", ua: "CSS-лічильники", langs: "CSS", example: "counter-reset: section; counter-increment: section;", explain: "Створюють і збільшують CSS-лічильник для автоматичної нумерації елементів." },
  { cat: "CSS: Лічильники", sym: "counter() / counters()", en: "Counter functions", ua: "Функції лічильника", langs: "CSS", example: "content: counter(section) '. ';", explain: "Виводять значення лічильника в content, counters() — для вкладених лічильників." },
  { cat: "CSS: Скрол", sym: "scroll-behavior", en: "Scroll behavior", ua: "Поведінка прокрутки", langs: "CSS", example: "scroll-behavior: smooth;", explain: "smooth робить прокрутку до якорів/через JS плавною замість миттєвої." },
  { cat: "CSS: Скрол", sym: "scroll-snap-type / scroll-snap-align", en: "Scroll snapping", ua: "Прилипання прокрутки", langs: "CSS", example: "scroll-snap-type: x mandatory;", explain: "Змушують прокрутку зупинятись рівно на заданих елементах — карусель, слайдер." },
  { cat: "CSS: Скрол", sym: "scroll-margin / scroll-padding", en: "Scroll offset", ua: "Відступ прокрутки", langs: "CSS", example: "scroll-margin-top: 60px;", explain: "Компенсують фіксовану шапку при переході до якоря чи snap-елемента." },
  { cat: "CSS: Скрол", sym: "overscroll-behavior", en: "Overscroll behavior", ua: "Поведінка за межами прокрутки", langs: "CSS", example: "overscroll-behavior: contain;", explain: "Забороняє прокрутці «протікати» до батьківського елемента чи сторінки в цілому." },
  { cat: "CSS: Колонки", sym: "columns / column-count / column-width", en: "Multi-column layout", ua: "Багатоколонковий текст", langs: "CSS", example: "columns: 3;", explain: "Розбиває текст на кілька газетних колонок автоматично." },
  { cat: "CSS: Колонки", sym: "column-gap / column-rule / column-span", en: "Column styling", ua: "Стилізація колонок", langs: "CSS", example: "column-rule: 1px solid #ccc;", explain: "Проміжок між колонками, роздільна лінія між ними й елемент, що розтягується на всі колонки." },
  { cat: "CSS: Таблиці", sym: "border-collapse / border-spacing", en: "Table border model", ua: "Модель рамок таблиці", langs: "CSS", example: "border-collapse: collapse;", explain: "collapse об'єднує суміжні рамки комірок в одну лінію, spacing задає відступ між ними при separate." },
  { cat: "CSS: Таблиці", sym: "caption-side / empty-cells / table-layout", en: "Table display control", ua: "Керування відображенням таблиці", langs: "CSS", example: "table-layout: fixed;", explain: "table-layout: fixed прискорює рендеринг великих таблиць з фіксованою шириною колонок." },
  { cat: "CSS: Контур", sym: "outline / outline-offset", en: "Outline", ua: "Контур", langs: "CSS", example: "outline: 2px solid blue; outline-offset: 2px;", explain: "Лінія навколо елемента, що не впливає на layout (на відміну від border) — часто для стану :focus." },
  { cat: "CSS: Інше", sym: "appearance", en: "Appearance", ua: "Природний вигляд елемента", langs: "CSS", example: "appearance: none;", explain: "none прибирає стандартний ОС-вигляд елементів форми (checkbox, select) для повної кастомізації." },
  { cat: "CSS: Інше", sym: "isolation", en: "Isolation", ua: "Ізоляція стекінг-контексту", langs: "CSS", example: "isolation: isolate;", explain: "Створює новий stacking context, ізолюючи mix-blend-mode/z-index елемента від решти сторінки." },
  { cat: "CSS: Інше", sym: "will-change", en: "Will change", ua: "Підказка про майбутню зміну", langs: "CSS", example: "will-change: transform;", explain: "Підказує браузеру заздалегідь оптимізувати рендеринг властивості, що скоро зміниться (анімація)." },
  { cat: "CSS: Інше", sym: "writing-mode / direction", en: "Text direction/writing mode", ua: "Напрямок і режим письма", langs: "CSS", example: "writing-mode: vertical-rl;", explain: "Керують напрямком тексту й вертикальним/горизонтальним режимом письма (для East Asian мов)." },

  { cat: "CSS: Одиниці виміру", sym: "px / pt / pc / in / cm / mm", en: "Absolute units", ua: "Абсолютні одиниці", langs: "CSS", example: "width: 16px;", explain: "Фіксовані одиниці, що не залежать від контексту — px найпоширеніша для екранів." },
  { cat: "CSS: Одиниці виміру", sym: "% / em / rem", en: "Relative size units", ua: "Відносні одиниці розміру", langs: "CSS", example: "font-size: 1.2rem;", explain: "% — відносно батька, em — відносно шрифту поточного елемента, rem — відносно кореневого <html>." },
  { cat: "CSS: Одиниці виміру", sym: "vw / vh / vmin / vmax", en: "Viewport units", ua: "Одиниці вікна перегляду", langs: "CSS", example: "height: 100vh;", explain: "Відсоток від ширини/висоти вікна браузера — зручно для елементів на весь екран." },
  { cat: "CSS: Одиниці виміру", sym: "svw/svh / lvw/lvh / dvw/dvh", en: "Dynamic viewport units", ua: "Динамічні одиниці вікна", langs: "CSS", example: "height: 100dvh;", explain: "Враховують зникнення адресного рядка на мобільних (dvh = справжня видима висота)." },
  { cat: "CSS: Одиниці виміру", sym: "ch / ex / cap / ic / lh", en: "Font-relative units", ua: "Одиниці відносно шрифту", langs: "CSS", example: "width: 40ch;", explain: "ch — ширина символу '0' поточного шрифту, lh — висота рядка, зручно для читабельної ширини тексту." },
  { cat: "CSS: Одиниці виміру", sym: "deg / grad / rad / turn", en: "Angle units", ua: "Одиниці кута", langs: "CSS", example: "transform: rotate(0.5turn);", explain: "Одиниці для кутів у rotate/gradient — градуси, градіани, радіани, повні оберти." },
  { cat: "CSS: Одиниці виміру", sym: "s / ms", en: "Time units", ua: "Одиниці часу", langs: "CSS", example: "transition-duration: 300ms;", explain: "Секунди й мілісекунди для transition/animation." },
  { cat: "CSS: Змінні", sym: "--variable", en: "Custom property", ua: "Власна властивість (змінна)", langs: "CSS", example: "--main-color: #7c3aed;", explain: "Оголошує CSS-змінну, зазвичай на :root для глобального доступу." },
  { cat: "CSS: Змінні", sym: "var()", en: "Var function", ua: "Функція читання змінної", langs: "CSS", example: "color: var(--main-color, black);", explain: "Читає значення CSS-змінної, з опціональним запасним значенням." },
  { cat: "CSS: Значення", sym: "inherit / initial / unset / revert", en: "CSS-wide keywords", ua: "Глобальні ключові слова CSS", langs: "CSS", example: "color: inherit;", explain: "inherit бере значення від батька, initial — стандартне значення браузера, unset/revert — скидають до природного стану." },
  { cat: "CSS: Специфічність", sym: "!important", en: "Important flag", ua: "Позначка найвищого пріоритету", langs: "CSS", example: "color: red !important;", explain: "Робить правило пріоритетнішим за майже все інше — використовувати обережно." },
  { cat: "CSS: Логічні властивості", sym: "margin-inline / padding-inline / margin-block / padding-block", en: "Logical spacing properties", ua: "Логічні властивості відступів", langs: "CSS", example: "margin-inline: 10px;", explain: "Відступи відносно напрямку письма (inline/block), а не фіксованих left/right — коректно працюють з rtl-мовами." },
  { cat: "CSS: Логічні властивості", sym: "inset-inline / inset-block", en: "Logical position offsets", ua: "Логічні зміщення позиції", langs: "CSS", example: "inset-inline-start: 0;", explain: "Зміщення позиціонованого елемента відносно напрямку письма замість фіксованих left/right/top/bottom." },

  { cat: "JS: Змінні", sym: "let", en: "let declaration", ua: "Оголошення let", langs: "JS", example: "let count = 0;", explain: "Оголошує змінну з блоковою областю видимості, яку можна змінювати." },
  { cat: "JS: Змінні", sym: "const", en: "const declaration", ua: "Оголошення const", langs: "JS", example: "const PI = 3.14;", explain: "Оголошує константу з блоковою областю видимості — посилання не можна перепризначити." },
  { cat: "JS: Змінні", sym: "var", en: "var declaration", ua: "Оголошення var (застаріле)", langs: "JS", example: "var x = 5;", explain: "Застаріле оголошення змінної з функціональною (не блоковою) областю видимості — уникай на користь let/const." },
  { cat: "JS: Керування потоком", sym: "if / else / else if", en: "Conditional statements", ua: "Умовні оператори", langs: "JS", example: "if (x > 0) { } else { }", explain: "Виконує блок коду залежно від умови." },
  { cat: "JS: Керування потоком", sym: "switch / case / default", en: "Switch statement", ua: "Оператор switch", langs: "JS", example: "switch (x) { case 1: break; default: }", explain: "Порівнює значення з кількома варіантами — альтернатива довгому ланцюжку if/else if." },
  { cat: "JS: Керування потоком", sym: "for", en: "For loop", ua: "Цикл for", langs: "JS", example: "for (let i = 0; i < 5; i++) { }", explain: "Класичний цикл з лічильником: ініціалізація, умова, крок." },
  { cat: "JS: Керування потоком", sym: "for...of", en: "For-of loop", ua: "Цикл for...of", langs: "JS", example: "for (const item of array) { }", explain: "Перебирає значення ітерованого об'єкта — масиву, рядка, Map, Set." },
  { cat: "JS: Керування потоком", sym: "for...in", en: "For-in loop", ua: "Цикл for...in", langs: "JS", example: "for (const key in obj) { }", explain: "Перебирає перелічувані ключі об'єкта (для масивів краще for...of)." },
  { cat: "JS: Керування потоком", sym: "while / do...while", en: "While loops", ua: "Цикли while", langs: "JS", example: "while (x < 10) { x++; }", explain: "while перевіряє умову перед кожною ітерацією, do...while — після, тому виконається хоча б раз." },
  { cat: "JS: Керування потоком", sym: "break / continue", en: "Loop control", ua: "Керування циклом", langs: "JS", example: "if (x === 5) break;", explain: "break повністю зупиняє цикл, continue пропускає поточну ітерацію й переходить до наступної." },
  { cat: "JS: Функції", sym: "function", en: "Function declaration", ua: "Оголошення функції", langs: "JS", example: "function sum(a, b) { return a + b; }", explain: "Класичне оголошення іменованої функції." },
  { cat: "JS: Функції", sym: "=> (arrow function)", en: "Arrow function", ua: "Стрілкова функція", langs: "JS", example: "const double = x => x * 2;", explain: "Коротший синтаксис функції, не має власного this — бере його з контексту, де оголошена." },
  { cat: "JS: Функції", sym: "return", en: "Return statement", ua: "Оператор повернення", langs: "JS", example: "return a + b;", explain: "Завершує виконання функції й повертає значення викликаючому коду." },
  { cat: "JS: Функції", sym: "async / await", en: "Async/await", ua: "Асинхронна функція / очікування", langs: "JS", example: "async function load() { const data = await fetch(url); }", explain: "async позначає функцію, що повертає Promise; await призупиняє її до вирішення Promise." },
  { cat: "JS: Функції", sym: "arguments", en: "Arguments object", ua: "Об'єкт аргументів", langs: "JS", example: "function f() { console.log(arguments); }", explain: "Масивоподібний об'єкт усіх аргументів усередині звичайної функції (недоступний у стрілкових)." },
  { cat: "JS: Функції", sym: "call() / apply() / bind()", en: "Function context methods", ua: "Методи контексту функції", langs: "JS", example: "fn.call(obj, arg1);", explain: "Керують значенням this при виклику функції: call/apply викликають одразу, bind повертає нову функцію." },
  { cat: "JS: Класи", sym: "class / constructor", en: "Class declaration", ua: "Оголошення класу", langs: "JS", example: "class User { constructor(name) { this.name = name; } }", explain: "Синтаксичний цукор над прототипним наслідуванням; constructor викликається при new." },
  { cat: "JS: Класи", sym: "extends / super", en: "Class inheritance", ua: "Наслідування класу", langs: "JS", example: "class Admin extends User { constructor() { super(); } }", explain: "extends задає батьківський клас, super викликає його конструктор/методи." },
  { cat: "JS: Класи", sym: "static / get / set", en: "Class modifiers", ua: "Модифікатори класу", langs: "JS", example: "static create() { }", explain: "static — метод класу, а не екземпляра; get/set створюють обчислювані властивості." },
  { cat: "JS: Класи", sym: "#privateField", en: "Private class field", ua: "Приватне поле класу", langs: "JS", example: "class C { #secret = 1; }", explain: "Поле з # доступне лише всередині самого класу, недоступне ззовні." },
  { cat: "JS: Модулі", sym: "import / export", en: "Module import/export", ua: "Імпорт/експорт модуля", langs: "JS", example: "export default App; import App from './App';", explain: "Підключають і роблять доступним код з інших файлів (ES-модулі)." },
  { cat: "JS: Модулі", sym: "export default / export { }", en: "Export styles", ua: "Способи експорту", langs: "JS", example: "export { a, b };", explain: "default — один головний експорт файлу, іменований export — кілька експортів за назвою." },
  { cat: "JS: Помилки", sym: "try / catch / finally", en: "Error handling", ua: "Обробка помилок", langs: "JS", example: "try { risky(); } catch (e) { console.error(e); }", explain: "try виконує код, catch ловить помилку, finally виконується завжди, незалежно від результату." },
  { cat: "JS: Помилки", sym: "throw", en: "Throw statement", ua: "Оператор throw", langs: "JS", example: "throw new Error('Щось пішло не так');", explain: "Генерує помилку, яку можна впіймати через try/catch." },
  { cat: "JS: Помилки", sym: "Error / TypeError / RangeError", en: "Error types", ua: "Типи помилок", langs: "JS", example: "throw new TypeError('Очікувалось число');", explain: "Вбудовані класи помилок для різних ситуацій: загальна, невірний тип, значення поза межами." },
  { cat: "JS: Інше", sym: "typeof", en: "Typeof operator", ua: "Оператор визначення типу", langs: "JS", example: "typeof 5 // 'number'", explain: "Повертає рядок з назвою типу значення." },
  { cat: "JS: Інше", sym: "instanceof", en: "Instanceof operator", ua: "Оператор перевірки класу", langs: "JS", example: "arr instanceof Array", explain: "Перевіряє, чи об'єкт створений певним класом/конструктором." },
  { cat: "JS: Інше", sym: "new", en: "New operator", ua: "Оператор new", langs: "JS", example: "new Date()", explain: "Створює новий екземпляр об'єкта на основі функції-конструктора чи класу." },
  { cat: "JS: Інше", sym: "delete", en: "Delete operator", ua: "Оператор delete", langs: "JS", example: "delete obj.prop;", explain: "Видаляє властивість з об'єкта." },
  { cat: "JS: Інше", sym: "this", en: "This keyword", ua: "Ключове слово this", langs: "JS", example: "this.name = 'Оля';", explain: "Посилається на контекст виконання — об'єкт, якому належить метод (залежить від способу виклику)." },
  { cat: "JS: Інше", sym: "debugger", en: "Debugger statement", ua: "Оператор debugger", langs: "JS", example: "debugger;", explain: "Зупиняє виконання коду в цій точці, якщо відкриті інструменти розробника." },

  { cat: "JS: Масиви", sym: "push() / pop() / shift() / unshift()", en: "Array add/remove methods", ua: "Методи додавання/видалення масиву", langs: "JS", example: "arr.push(5);", explain: "push/pop додають і видаляють елемент з кінця масиву, unshift/shift — з початку." },
  { cat: "JS: Масиви", sym: "slice() / splice()", en: "Array slice/splice", ua: "Вирізання/вставка масиву", langs: "JS", example: "arr.splice(1, 2, 'нове');", explain: "slice повертає копію частини масиву без зміни оригіналу, splice видаляє/вставляє елементи, змінюючи оригінал." },
  { cat: "JS: Масиви", sym: "map() / filter() / reduce()", en: "Array transform methods", ua: "Методи трансформації масиву", langs: "JS", example: "arr.map(x => x * 2);", explain: "map перетворює кожен елемент, filter залишає ті, що проходять умову, reduce згортає масив в одне значення." },
  { cat: "JS: Масиви", sym: "forEach()", en: "Array forEach", ua: "Перебір масиву forEach", langs: "JS", example: "arr.forEach(x => console.log(x));", explain: "Виконує функцію для кожного елемента масиву, нічого не повертає." },
  { cat: "JS: Масиви", sym: "find() / findIndex()", en: "Array find methods", ua: "Методи пошуку в масиві", langs: "JS", example: "arr.find(x => x > 5);", explain: "Повертають перший елемент (find) чи його індекс (findIndex), що відповідає умові." },
  { cat: "JS: Масиви", sym: "includes() / indexOf()", en: "Array search methods", ua: "Методи перевірки наявності", langs: "JS", example: "arr.includes(5);", explain: "includes перевіряє наявність значення (true/false), indexOf повертає його індекс чи -1." },
  { cat: "JS: Масиви", sym: "some() / every()", en: "Array test methods", ua: "Методи перевірки умови масиву", langs: "JS", example: "arr.every(x => x > 0);", explain: "some — чи хоча б один елемент проходить умову, every — чи всі елементи проходять." },
  { cat: "JS: Масиви", sym: "sort() / reverse()", en: "Array sort/reverse", ua: "Сортування/розворот масиву", langs: "JS", example: "arr.sort((a, b) => a - b);", explain: "Сортують чи розвертають масив на місці (змінюючи оригінал)." },
  { cat: "JS: Масиви", sym: "join() / concat()", en: "Array join/concat", ua: "Об'єднання масиву", langs: "JS", example: "arr.join(', ');", explain: "join перетворює масив у рядок з роздільником, concat об'єднує кілька масивів в новий." },
  { cat: "JS: Масиви", sym: "flat() / flatMap()", en: "Array flatten methods", ua: "Методи розгортання масиву", langs: "JS", example: "[[1,2],[3]].flat();", explain: "Розгортають вкладені масиви на один рівень, flatMap робить це разом з map." },
  { cat: "JS: Масиви", sym: "Array.isArray() / Array.from()", en: "Array static methods", ua: "Статичні методи Array", langs: "JS", example: "Array.from({length: 5}, (_, i) => i);", explain: "isArray перевіряє тип, from створює масив з ітерованого об'єкта чи по функції-генератору." },
  { cat: "JS: Об'єкти", sym: "Object.keys() / Object.values() / Object.entries()", en: "Object introspection", ua: "Огляд об'єкта", langs: "JS", example: "Object.entries(obj);", explain: "Повертають масив ключів, значень чи пар [ключ, значення] об'єкта." },
  { cat: "JS: Об'єкти", sym: "Object.assign()", en: "Object assign", ua: "Об'єднання об'єктів", langs: "JS", example: "Object.assign({}, obj1, obj2);", explain: "Копіює властивості з одного чи кількох об'єктів у цільовий." },
  { cat: "JS: Об'єкти", sym: "Object.freeze() / Object.seal()", en: "Object immutability", ua: "Незмінність об'єкта", langs: "JS", example: "Object.freeze(config);", explain: "freeze повністю забороняє зміни об'єкта, seal забороняє додавання/видалення властивостей, але дозволяє змінювати існуючі." },
  { cat: "JS: Об'єкти", sym: "Object.fromEntries()", en: "Object from entries", ua: "Об'єкт зі списку пар", langs: "JS", example: "Object.fromEntries([['a', 1]]);", explain: "Створює об'єкт зі списку пар [ключ, значення] — зворотне до Object.entries()." },
  { cat: "JS: Рядки", sym: "length / charAt() / indexOf()", en: "String basics", ua: "Основи рядків", langs: "JS", example: "'text'.charAt(0);", explain: "length — довжина рядка, charAt — символ за індексом, indexOf — позиція підрядка." },
  { cat: "JS: Рядки", sym: "slice() / substring() / split()", en: "String extraction methods", ua: "Методи вирізання рядка", langs: "JS", example: "'a,b,c'.split(',');", explain: "slice/substring вирізають частину рядка, split розбиває рядок на масив за роздільником." },
  { cat: "JS: Рядки", sym: "includes() / startsWith() / endsWith()", en: "String search methods", ua: "Методи пошуку в рядку", langs: "JS", example: "'hello'.startsWith('he');", explain: "Перевіряють наявність підрядка, початок чи кінець рядка." },
  { cat: "JS: Рядки", sym: "replace() / replaceAll()", en: "String replace", ua: "Заміна в рядку", langs: "JS", example: "'aaa'.replaceAll('a', 'b');", explain: "replace замінює перше входження (чи всі, якщо з regex /g), replaceAll — завжди всі входження." },
  { cat: "JS: Рядки", sym: "trim() / toLowerCase() / toUpperCase()", en: "String normalization", ua: "Нормалізація рядка", langs: "JS", example: "'  Hi  '.trim();", explain: "Прибирають пробіли по краях, змінюють регістр рядка." },
  { cat: "JS: Рядки", sym: "padStart() / padEnd()", en: "String padding", ua: "Доповнення рядка", langs: "JS", example: "'5'.padStart(2, '0');", explain: "Доповнюють рядок символами до потрібної довжини — зручно для форматування (напр. '05')." },
  { cat: "JS: Рядки", sym: "template literals `${}`", en: "Template literals", ua: "Шаблонні рядки", langs: "JS", example: "`Привіт, ${name}!`", explain: "Рядки в зворотних лапках з можливістю вставляти вирази через ${}." },
  { cat: "JS: Числа", sym: "Number.isInteger() / Number.isNaN()", en: "Number checks", ua: "Перевірки числа", langs: "JS", example: "Number.isInteger(5.0);", explain: "Надійно перевіряють, чи значення ціле число чи NaN (на відміну від глобального isNaN)." },
  { cat: "JS: Числа", sym: "parseInt() / parseFloat()", en: "Parse number functions", ua: "Функції розбору числа", langs: "JS", example: "parseInt('42px');", explain: "Перетворюють рядок на число, ігноруючи текст після числа." },
  { cat: "JS: Числа", sym: "toFixed() / toPrecision()", en: "Number formatting", ua: "Форматування числа", langs: "JS", example: "(3.14159).toFixed(2);", explain: "Округлюють число до заданої кількості знаків після коми чи значущих цифр, повертають рядок." },
  { cat: "JS: Math", sym: "Math.round() / Math.floor() / Math.ceil()", en: "Rounding functions", ua: "Функції округлення", langs: "JS", example: "Math.round(4.5);", explain: "round округлює за правилами, floor завжди вниз, ceil завжди вгору." },
  { cat: "JS: Math", sym: "Math.max() / Math.min()", en: "Max/min functions", ua: "Функції максимуму/мінімуму", langs: "JS", example: "Math.max(1, 5, 3);", explain: "Повертають найбільше чи найменше з переданих чисел." },
  { cat: "JS: Math", sym: "Math.random()", en: "Random number", ua: "Випадкове число", langs: "JS", example: "Math.random();", explain: "Повертає випадкове число від 0 (включно) до 1 (виключно)." },
  { cat: "JS: Math", sym: "Math.abs() / Math.pow() / Math.sqrt()", en: "Math operations", ua: "Математичні операції", langs: "JS", example: "Math.sqrt(16);", explain: "Модуль числа, піднесення до степеня, квадратний корінь." },
  { cat: "JS: Дата", sym: "new Date() / Date.now()", en: "Date creation", ua: "Створення дати", langs: "JS", example: "const now = new Date();", explain: "Створює об'єкт дати/часу; Date.now() повертає час у мілісекундах з 1970 року (timestamp)." },
  { cat: "JS: Дата", sym: "getFullYear() / getMonth() / getDate()", en: "Date component getters", ua: "Отримання частин дати", langs: "JS", example: "date.getFullYear();", explain: "Повертають рік, місяць (0-11!) і день місяця з об'єкта Date." },
  { cat: "JS: JSON", sym: "JSON.parse() / JSON.stringify()", en: "JSON conversion", ua: "Перетворення JSON", langs: "JS", example: "JSON.parse('{\"a\":1}');", explain: "parse перетворює JSON-рядок на об'єкт, stringify — об'єкт на JSON-рядок." },

  { cat: "JS: DOM пошук", sym: "getElementById() / querySelector()", en: "Single element selectors", ua: "Пошук одного елемента", langs: "JS", example: "document.querySelector('.card');", explain: "Знаходять один елемент за id чи CSS-селектором (querySelector — за будь-яким селектором)." },
  { cat: "JS: DOM пошук", sym: "querySelectorAll() / getElementsByClassName()", en: "Multiple element selectors", ua: "Пошук кількох елементів", langs: "JS", example: "document.querySelectorAll('.item');", explain: "Знаходять усі елементи, що відповідають селектору чи класу." },
  { cat: "JS: DOM пошук", sym: "closest() / matches()", en: "Ancestor/match checks", ua: "Перевірка предка/відповідності", langs: "JS", example: "el.closest('.card');", explain: "closest шукає найближчого предка (чи сам елемент) за селектором, matches перевіряє відповідність селектору." },
  { cat: "JS: DOM створення", sym: "createElement() / createTextNode()", en: "DOM creation methods", ua: "Методи створення DOM", langs: "JS", example: "document.createElement('div');", explain: "Створюють новий DOM-елемент чи текстовий вузол програмно." },
  { cat: "JS: DOM створення", sym: "cloneNode()", en: "Clone node", ua: "Клонування вузла", langs: "JS", example: "el.cloneNode(true);", explain: "Створює копію елемента; true клонує і всіх нащадків." },
  { cat: "JS: DOM вміст", sym: "innerHTML / textContent", en: "Content properties", ua: "Властивості вмісту", langs: "JS", example: "el.textContent = 'Привіт';", explain: "innerHTML парсить рядок як HTML (обережно з XSS), textContent вставляє чистий текст." },
  { cat: "JS: DOM вміст", sym: "value", en: "Value property", ua: "Властивість значення", langs: "JS", example: "input.value = 'текст';", explain: "Читає/задає значення поля вводу форми." },
  { cat: "JS: DOM атрибути", sym: "getAttribute() / setAttribute()", en: "Attribute methods", ua: "Методи атрибутів", langs: "JS", example: "el.setAttribute('data-id', '5');", explain: "Читають і задають будь-який HTML-атрибут елемента." },
  { cat: "JS: DOM атрибути", sym: "removeAttribute() / hasAttribute()", en: "Attribute removal/check", ua: "Видалення/перевірка атрибута", langs: "JS", example: "el.hasAttribute('disabled');", explain: "Видаляють атрибут чи перевіряють його наявність." },
  { cat: "JS: DOM класи", sym: "classList.add() / .remove() / .toggle()", en: "ClassList methods", ua: "Методи classList", langs: "JS", example: "el.classList.toggle('active');", explain: "Додають, видаляють чи перемикають CSS-клас елемента." },
  { cat: "JS: DOM класи", sym: "classList.contains()", en: "ClassList check", ua: "Перевірка classList", langs: "JS", example: "el.classList.contains('active');", explain: "Перевіряє, чи має елемент вказаний клас." },
  { cat: "JS: DOM стиль", sym: "style / getComputedStyle()", en: "Style access", ua: "Доступ до стилів", langs: "JS", example: "getComputedStyle(el).color;", explain: "style змінює інлайн-стилі елемента, getComputedStyle читає фактично застосовані стилі (з CSS-файлів теж)." },
  { cat: "JS: DOM дерево", sym: "parentNode / children / childNodes", en: "DOM tree navigation", ua: "Навігація деревом DOM", langs: "JS", example: "el.parentNode;", explain: "parentNode/children дають доступ до батьківського й дочірніх елементів." },
  { cat: "JS: DOM дерево", sym: "nextElementSibling / previousElementSibling", en: "Sibling navigation", ua: "Навігація до сусідів", langs: "JS", example: "el.nextElementSibling;", explain: "Дають доступ до сусіднього елемента того самого рівня вкладеності." },
  { cat: "JS: DOM дерево", sym: "appendChild() / append() / prepend()", en: "Insert child methods", ua: "Методи вставки дочірнього елемента", langs: "JS", example: "parent.append(child);", explain: "Додають елемент у кінець (append) чи на початок (prepend) списку дітей." },
  { cat: "JS: DOM дерево", sym: "before() / after() / insertBefore()", en: "Insert sibling methods", ua: "Методи вставки сусіднього елемента", langs: "JS", example: "el.after(newEl);", explain: "Вставляють новий елемент до чи після поточного, на тому самому рівні." },
  { cat: "JS: DOM дерево", sym: "remove() / removeChild()", en: "Remove methods", ua: "Методи видалення", langs: "JS", example: "el.remove();", explain: "Видаляють елемент з DOM." },
  { cat: "JS: DOM дерево", sym: "replaceWith() / replaceChild()", en: "Replace methods", ua: "Методи заміни", langs: "JS", example: "el.replaceWith(newEl);", explain: "Замінюють елемент іншим у DOM." },

  { cat: "JS: Події", sym: "addEventListener() / removeEventListener()", en: "Event listener methods", ua: "Методи слухачів подій", langs: "JS", example: "btn.addEventListener('click', handler);", explain: "Підписують чи відписують функцію-обробник від події елемента." },
  { cat: "JS: Події", sym: "click / dblclick / mousedown / mouseup", en: "Mouse click events", ua: "Події кліку миші", langs: "JS", example: "el.addEventListener('click', fn);", explain: "Найпоширеніші події натискання мишею." },
  { cat: "JS: Події", sym: "mouseenter / mouseleave / mouseover / mouseout", en: "Mouse hover events", ua: "Події наведення миші", langs: "JS", example: "el.addEventListener('mouseenter', fn);", explain: "enter/leave не спливають до дітей, over/out — спливають; спрацьовують при наведенні/відведенні курсора." },
  { cat: "JS: Події", sym: "keydown / keyup / keypress", en: "Keyboard events", ua: "Події клавіатури", langs: "JS", example: "document.addEventListener('keydown', fn);", explain: "Спрацьовують при натисканні й відпусканні клавіші." },
  { cat: "JS: Події", sym: "input / change", en: "Form input events", ua: "Події вводу форми", langs: "JS", example: "input.addEventListener('input', fn);", explain: "input спрацьовує при кожній зміні значення, change — коли поле втрачає фокус після зміни." },
  { cat: "JS: Події", sym: "submit / reset", en: "Form submit events", ua: "Події відправки форми", langs: "JS", example: "form.addEventListener('submit', fn);", explain: "Спрацьовують при відправці чи скиданні форми." },
  { cat: "JS: Події", sym: "focus / blur", en: "Focus events", ua: "Події фокусу", langs: "JS", example: "input.addEventListener('blur', fn);", explain: "focus — елемент отримав фокус, blur — втратив." },
  { cat: "JS: Події", sym: "load / DOMContentLoaded", en: "Page load events", ua: "Події завантаження сторінки", langs: "JS", example: "document.addEventListener('DOMContentLoaded', fn);", explain: "DOMContentLoaded спрацьовує, коли HTML розібраний (без чекання картинок), load — коли завантажено все." },
  { cat: "JS: Події", sym: "scroll / resize", en: "Scroll/resize events", ua: "Події прокрутки/зміни розміру", langs: "JS", example: "window.addEventListener('scroll', fn);", explain: "Спрацьовують при прокрутці сторінки чи зміні розміру вікна." },
  { cat: "JS: Події", sym: "drag / dragstart / dragover / drop", en: "Drag and drop events", ua: "Події перетягування", langs: "JS", example: "el.addEventListener('drop', fn);", explain: "Набір подій для реалізації drag-and-drop функціоналу." },
  { cat: "JS: Об'єкт події", sym: "event.target / event.currentTarget", en: "Event target properties", ua: "Властивості цілі події", langs: "JS", example: "e.target.classList.add('clicked');", explain: "target — елемент, на якому подія трапилась, currentTarget — на якому висить обробник." },
  { cat: "JS: Об'єкт події", sym: "preventDefault()", en: "Prevent default", ua: "Скасувати типову дію", langs: "JS", example: "e.preventDefault();", explain: "Скасовує типову поведінку браузера — напр. перехід за посиланням чи відправку форми." },
  { cat: "JS: Об'єкт події", sym: "stopPropagation()", en: "Stop propagation", ua: "Зупинити спливання", langs: "JS", example: "e.stopPropagation();", explain: "Зупиняє подальше спливання події до батьківських елементів." },
  { cat: "JS: Об'єкт події", sym: "key / code / ctrlKey / shiftKey", en: "Keyboard event properties", ua: "Властивості клавіатурної події", langs: "JS", example: "if (e.key === 'Enter') { }", explain: "key — назва натиснутої клавіші, ctrlKey/shiftKey — чи затиснута модифікатор-клавіша." },
  { cat: "JS: Промиси", sym: "Promise", en: "Promise", ua: "Проміс", langs: "JS", example: "new Promise((resolve, reject) => { });", explain: "Об'єкт, що представляє результат асинхронної операції — виконано, відхилено чи в очікуванні." },
  { cat: "JS: Промиси", sym: "then() / catch() / finally()", en: "Promise chaining", ua: "Ланцюжок промісів", langs: "JS", example: "fetch(url).then(r => r.json()).catch(e => {});", explain: "then обробляє успіх, catch — помилку, finally виконується в будь-якому разі." },
  { cat: "JS: Промиси", sym: "Promise.all() / Promise.race()", en: "Promise combinators", ua: "Комбінатори промісів", langs: "JS", example: "await Promise.all([p1, p2]);", explain: "all чекає завершення всіх промісів, race повертає результат найшвидшого з них." },
  { cat: "JS: Fetch", sym: "fetch()", en: "Fetch function", ua: "Функція fetch", langs: "JS", example: "const res = await fetch('/api/users');", explain: "Виконує HTTP-запит і повертає Promise з відповіддю." },
  { cat: "JS: Fetch", sym: "response.json() / response.text()", en: "Response body methods", ua: "Методи читання тіла відповіді", langs: "JS", example: "const data = await res.json();", explain: "Асинхронно перетворюють тіло відповіді на об'єкт JSON чи текст." },
  { cat: "JS: Таймери", sym: "setTimeout() / clearTimeout()", en: "Timeout timer", ua: "Одноразовий таймер", langs: "JS", example: "setTimeout(() => alert('Привіт'), 1000);", explain: "Виконує функцію один раз через заданий час (мс); clearTimeout скасовує заплановане виконання." },
  { cat: "JS: Таймери", sym: "setInterval() / clearInterval()", en: "Interval timer", ua: "Повторюваний таймер", langs: "JS", example: "setInterval(() => tick(), 1000);", explain: "Повторно виконує функцію через рівні проміжки часу, поки не буде зупинена clearInterval." },

  { cat: "JS: Оператори", sym: "typeof / instanceof", en: "Type check operators", ua: "Оператори перевірки типу", langs: "JS", example: "typeof x === 'string'", explain: "typeof повертає рядок з типом примітиву, instanceof перевіряє клас об'єкта." },
  { cat: "JS: Оператори", sym: "&& / || / !", en: "Logical operators", ua: "Логічні оператори", langs: "JS", example: "a && b || c", explain: "&& — і (обидва істинні), || — або (хоч один істинний), ! — заперечення." },
  { cat: "JS: Оператори", sym: "??", en: "Nullish coalescing", ua: "Оператор нульового злиття", langs: "JS", example: "value ?? 'за замовчуванням'", explain: "Повертає праве значення, лише якщо ліве null або undefined (на відміну від ||, що спрацює й на 0/'')." },
  { cat: "JS: Оператори", sym: "?. (optional chaining)", en: "Optional chaining", ua: "Опціональне звертання", langs: "JS", example: "user?.address?.city", explain: "Безпечно звертається до вкладеної властивості, повертає undefined замість помилки, якщо щось по дорозі відсутнє." },
  { cat: "JS: Оператори", sym: "== / ===", en: "Equality operators", ua: "Оператори рівності", langs: "JS", example: "5 === '5' // false", explain: "== порівнює зі зведенням типів, === — строго, без зведення (рекомендований варіант)." },
  { cat: "JS: Оператори", sym: "... (spread/rest)", en: "Spread/rest operator", ua: "Оператор розгортання/збору", langs: "JS", example: "const copy = [...arr];", explain: "Розгортає масив/об'єкт на окремі елементи (spread) чи збирає аргументи в масив (rest)." },
  { cat: "JS: Оператори", sym: "?: (ternary)", en: "Ternary operator", ua: "Тернарний оператор", langs: "JS", example: "age >= 18 ? 'дорослий' : 'дитина'", explain: "Скорочений if/else в одному виразі." },
  { cat: "JS: Оператори", sym: "+= -= *= /= %=", en: "Compound assignment", ua: "Складене присвоєння", langs: "JS", example: "x += 5;", explain: "Виконує операцію й одразу присвоює результат тій самій змінній." },
  { cat: "JS: Оператори", sym: "&&= / ||= / ??=", en: "Logical assignment", ua: "Логічне присвоєння", langs: "JS", example: "config.debug ??= false;", explain: "Присвоюють значення лише за певної логічної умови поточного значення змінної." },
  { cat: "JS: Деструктуризація", sym: "const { a, b } = obj", en: "Object destructuring", ua: "Деструктуризація об'єкта", langs: "JS", example: "const { name, age } = user;", explain: "Витягує властивості об'єкта в окремі змінні одним рядком." },
  { cat: "JS: Деструктуризація", sym: "const [a, b] = arr", en: "Array destructuring", ua: "Деструктуризація масиву", langs: "JS", example: "const [first, second] = arr;", explain: "Витягує елементи масиву в окремі змінні за позицією." },
  { cat: "JS: Set", sym: "Set", en: "Set collection", ua: "Колекція Set", langs: "JS", example: "new Set([1, 2, 2, 3]);", explain: "Колекція унікальних значень — дублікати автоматично ігноруються." },
  { cat: "JS: Set", sym: "add() / has() / delete()", en: "Set methods", ua: "Методи Set", langs: "JS", example: "set.add(5); set.has(5);", explain: "Додають значення, перевіряють наявність чи видаляють його з Set." },
  { cat: "JS: Map", sym: "Map", en: "Map collection", ua: "Колекція Map", langs: "JS", example: "new Map([['a', 1]]);", explain: "Колекція пар ключ-значення, де ключем може бути будь-який тип (на відміну від звичайного об'єкта)." },
  { cat: "JS: Map", sym: "get() / set() / has()", en: "Map methods", ua: "Методи Map", langs: "JS", example: "map.set('key', 'value');", explain: "Задають, читають чи перевіряють наявність пари ключ-значення в Map." },
  { cat: "JS: Ітератори", sym: "Symbol.iterator", en: "Iterator protocol", ua: "Протокол ітератора", langs: "JS", example: "obj[Symbol.iterator] = function* () { };", explain: "Робить об'єкт ітерованим — сумісним з for...of, spread, деструктуризацією." },
  { cat: "JS: Генератори", sym: "function* / yield", en: "Generator function", ua: "Функція-генератор", langs: "JS", example: "function* gen() { yield 1; yield 2; }", explain: "Функція, що може призупиняти виконання через yield і повертати кілька значень послідовно." },
  { cat: "JS: Symbol", sym: "Symbol()", en: "Symbol primitive", ua: "Примітив Symbol", langs: "JS", example: "const id = Symbol('id');", explain: "Створює унікальне, незмінне значення — часто для прихованих ключів об'єкта." },
  { cat: "JS: Reflect/Proxy", sym: "Proxy", en: "Proxy object", ua: "Об'єкт Proxy", langs: "JS", example: "new Proxy(target, handler);", explain: "Перехоплює й перевизначає базові операції над об'єктом (читання, запис, виклик)." },

  { cat: "JS: Сховище", sym: "localStorage / sessionStorage", en: "Web storage", ua: "Веб-сховище браузера", langs: "JS", example: "localStorage.setItem('theme', 'dark');", explain: "localStorage зберігає дані без терміну дії, sessionStorage — лише на час вкладки." },
  { cat: "JS: Сховище", sym: "getItem() / setItem() / removeItem()", en: "Storage methods", ua: "Методи сховища", langs: "JS", example: "localStorage.getItem('theme');", explain: "Читають, записують чи видаляють значення зі сховища за ключем." },
  { cat: "JS: Console", sym: "console.log() / console.error() / console.warn()", en: "Console output methods", ua: "Методи виводу в консоль", langs: "JS", example: "console.log('Дебаг:', value);", explain: "Виводять повідомлення в консоль розробника різного рівня важливості." },
  { cat: "JS: Console", sym: "console.table() / console.group()", en: "Console formatting methods", ua: "Методи форматування консолі", langs: "JS", example: "console.table(users);", explain: "table показує масив об'єктів як таблицю, group групує повідомлення у згорнутий блок." },
  { cat: "JS: Canvas API", sym: "getContext('2d')", en: "Canvas context", ua: "Контекст малювання canvas", langs: "JS", example: "const ctx = canvas.getContext('2d');", explain: "Повертає об'єкт для малювання на canvas — усі методи малювання викликаються на ньому." },
  { cat: "JS: Canvas API", sym: "fillRect() / strokeRect() / clearRect()", en: "Canvas rectangle methods", ua: "Методи прямокутника canvas", langs: "JS", example: "ctx.fillRect(10, 10, 100, 50);", explain: "Малюють заповнений, обведений чи очищають прямокутну область." },
  { cat: "JS: Canvas API", sym: "beginPath() / moveTo() / lineTo() / arc()", en: "Canvas path methods", ua: "Методи контуру canvas", langs: "JS", example: "ctx.arc(50, 50, 40, 0, Math.PI * 2);", explain: "Будують довільний контур для малювання ліній, кривих і дуг." },
  { cat: "JS: Web APIs", sym: "AbortController", en: "Abort controller", ua: "Контролер скасування", langs: "JS", example: "const c = new AbortController(); fetch(url, {signal: c.signal});", explain: "Дозволяє скасувати fetch-запит чи іншу асинхронну операцію." },
  { cat: "JS: Web APIs", sym: "IntersectionObserver", en: "Intersection observer", ua: "Спостерігач перетину", langs: "JS", example: "new IntersectionObserver(callback);", explain: "Відстежує, коли елемент з'являється/зникає у видимій області екрана — для лінивого завантаження, анімацій при скролі." },
  { cat: "JS: Web APIs", sym: "MutationObserver", en: "Mutation observer", ua: "Спостерігач змін DOM", langs: "JS", example: "new MutationObserver(callback).observe(el, {childList: true});", explain: "Відстежує зміни в DOM-дереві — додавання/видалення елементів, зміну атрибутів." },
  { cat: "JS: Web APIs", sym: "ResizeObserver", en: "Resize observer", ua: "Спостерігач зміни розміру", langs: "JS", example: "new ResizeObserver(callback).observe(el);", explain: "Відстежує зміну розміру конкретного елемента (не всього вікна)." },
  { cat: "JS: Web APIs", sym: "navigator.clipboard", en: "Clipboard API", ua: "API буфера обміну", langs: "JS", example: "navigator.clipboard.writeText('текст');", explain: "Дозволяє читати чи записувати текст у системний буфер обміну." },
  { cat: "JS: Web APIs", sym: "navigator.geolocation", en: "Geolocation API", ua: "API геолокації", langs: "JS", example: "navigator.geolocation.getCurrentPosition(fn);", explain: "Отримує поточні координати користувача (з його дозволу)." },
  { cat: "JS: Web APIs", sym: "requestAnimationFrame()", en: "Animation frame request", ua: "Запит кадру анімації", langs: "JS", example: "requestAnimationFrame(draw);", explain: "Планує виконання функції перед наступним перемальовуванням екрана — для плавних JS-анімацій." },
  { cat: "JS: Web APIs", sym: "Worker", en: "Web worker", ua: "Веб-воркер", langs: "JS", example: "new Worker('worker.js');", explain: "Запускає JS-код у фоновому потоці, не блокуючи основний UI-потік." },

  { cat: "Frontend: Фреймворки", sym: "React", en: "React library", ua: "Бібліотека React", langs: "Frontend", example: "npm create vite@latest -- --template react", explain: "Найпопулярніша бібліотека для побудови інтерфейсів через компоненти й JSX (саме на ній зроблена ця платформа)." },
  { cat: "Frontend: Фреймворки", sym: "Vue.js", en: "Vue framework", ua: "Фреймворк Vue", langs: "Frontend", example: "npm create vue@latest", explain: "Прогресивний фреймворк з простим входом і однофайловими компонентами (.vue)." },
  { cat: "Frontend: Фреймворки", sym: "Angular", en: "Angular framework", ua: "Фреймворк Angular", langs: "Frontend", example: "ng new my-app", explain: "Повноцінний фреймворк від Google з TypeScript за замовчуванням, для великих корпоративних застосунків." },
  { cat: "Frontend: Фреймворки", sym: "Svelte", en: "Svelte framework", ua: "Фреймворк Svelte", langs: "Frontend", example: "npm create svelte@latest", explain: "Компілює компоненти у чистий JS без віртуального DOM — швидший рантайм, менший бандл." },
  { cat: "Frontend: Фреймворки", sym: "Next.js / Nuxt", en: "Meta-frameworks", ua: "Мета-фреймворки", langs: "Frontend", example: "npx create-next-app", explain: "Надбудови над React (Next.js) і Vue (Nuxt) з готовою маршрутизацією, SSR і оптимізаціями." },
  { cat: "Frontend: React", sym: "JSX", en: "JSX syntax", ua: "Синтаксис JSX", langs: "React", example: "const el = <div className=\"box\">Привіт</div>;", explain: "Синтаксичне розширення JS, що дозволяє писати HTML-подібну розмітку прямо в коді компонента." },
  { cat: "Frontend: React", sym: "Props", en: "Props", ua: "Властивості компонента", langs: "React", example: "<Button label=\"OK\" />", explain: "Дані, передані батьківським компонентом дочірньому — тільки для читання." },
  { cat: "Frontend: React", sym: "useState()", en: "useState hook", ua: "Хук useState", langs: "React", example: "const [count, setCount] = useState(0);", explain: "Додає компоненту локальний стан, що зберігається між рендерами." },
  { cat: "Frontend: React", sym: "useEffect()", en: "useEffect hook", ua: "Хук useEffect", langs: "React", example: "useEffect(() => { fetchData(); }, []);", explain: "Виконує побічний ефект (запит, підписку) після рендеру компонента." },
  { cat: "Frontend: React", sym: "useContext()", en: "useContext hook", ua: "Хук useContext", langs: "React", example: "const theme = useContext(ThemeContext);", explain: "Читає значення з React Context без прокидання props через кожен рівень компонентів." },
  { cat: "Frontend: React", sym: "useRef()", en: "useRef hook", ua: "Хук useRef", langs: "React", example: "const inputRef = useRef(null);", explain: "Зберігає мутабельне значення (чи посилання на DOM-елемент), що не викликає повторний рендер при зміні." },
  { cat: "Frontend: React", sym: "useMemo() / useCallback()", en: "Memoization hooks", ua: "Хуки мемоізації", langs: "React", example: "const value = useMemo(() => compute(x), [x]);", explain: "Кешують результат обчислення чи посилання на функцію між рендерами для оптимізації." },
  { cat: "Frontend: React", sym: "Fragment / <>...</>", en: "Fragment", ua: "Фрагмент", langs: "React", example: "<>\\n  <A/><B/>\\n</>", explain: "Групує кілька елементів без зайвого DOM-вузла-обгортки." },
  { cat: "Frontend: React Router", sym: "Routes / Route / Link", en: "React Router basics", ua: "Основи React Router", langs: "React", example: "<Route path=\"/about\" element={<About />} />", explain: "Задають маршрути SPA і клікабельні посилання між ними без перезавантаження сторінки." },
  { cat: "Frontend: React Router", sym: "useNavigate() / useParams()", en: "React Router hooks", ua: "Хуки React Router", langs: "React", example: "const { id } = useParams();", explain: "navigate програмно переходить на інший маршрут, params читає динамічні частини URL." },
  { cat: "Frontend: TypeScript", sym: "TypeScript", en: "TypeScript language", ua: "Мова TypeScript", langs: "Frontend", example: "let age: number = 25;", explain: "Надбудова над JS зі статичною типізацією — помилки типів ловляться до запуску коду." },
  { cat: "Frontend: TypeScript", sym: "interface / type", en: "Type definitions", ua: "Визначення типів", langs: "TypeScript", example: "interface User { name: string; age: number; }", explain: "Описують форму об'єкта чи значення для перевірки типів." },
  { cat: "Frontend: Стилізація", sym: "TailwindCSS", en: "Tailwind CSS", ua: "Tailwind CSS", langs: "Frontend", example: '<div class="flex gap-4 p-2">...</div>', explain: "Утилітарний CSS-фреймворк — стилі задаються готовими класами прямо в розмітці (використаний у цьому проєкті)." },
  { cat: "Frontend: Стилізація", sym: "Sass / SCSS", en: "Sass preprocessor", ua: "Препроцесор Sass", langs: "Frontend", example: "$primary: #7c3aed;", explain: "Розширює CSS змінними, вкладеністю, міксинами — компілюється у звичайний CSS." },
  { cat: "Frontend: Стейт-менеджмент", sym: "Redux / Redux Toolkit", en: "Redux state management", ua: "Керування станом Redux", langs: "Frontend", example: "const store = configureStore({ reducer });", explain: "Централізоване сховище стану застосунку з передбачуваними оновленнями через actions/reducers." },
  { cat: "Frontend: Стейт-менеджмент", sym: "Zustand", en: "Zustand store", ua: "Сховище Zustand", langs: "Frontend", example: "const useStore = create((set) => ({ count: 0 }));", explain: "Легша альтернатива Redux для керування станом React-застосунку без зайвого шаблонного коду." },
  { cat: "Frontend: Стейт-менеджмент", sym: "React Query / SWR", en: "Server state libraries", ua: "Бібліотеки серверного стану", langs: "Frontend", example: "const { data } = useQuery('users', fetchUsers);", explain: "Керують кешуванням, повторним запитом і синхронізацією даних із сервера." },

  { cat: "Frontend: Інструменти збірки", sym: "Vite", en: "Vite build tool", ua: "Інструмент збірки Vite", langs: "Frontend", example: "npm run dev", explain: "Сучасний швидкий інструмент збірки з миттєвим hot-reload (використаний у цьому проєкті)." },
  { cat: "Frontend: Інструменти збірки", sym: "Webpack", en: "Webpack bundler", ua: "Збирач Webpack", langs: "Frontend", example: "webpack.config.js", explain: "Найпоширеніший (хоч і повільніший за Vite) бандлер модулів з великою екосистемою плагінів." },
  { cat: "Frontend: Інструменти збірки", sym: "Babel", en: "Babel compiler", ua: "Компілятор Babel", langs: "Frontend", example: ".babelrc", explain: "Перетворює сучасний JS/JSX на код, сумісний зі старішими браузерами." },
  { cat: "Frontend: Інструменти збірки", sym: "ESLint / Prettier", en: "Linter/formatter", ua: "Лінтер/форматер коду", langs: "Frontend", example: "npx eslint . --fix", explain: "ESLint знаходить проблеми в коді за правилами, Prettier автоматично форматує стиль коду." },
  { cat: "Frontend: Пакетні менеджери", sym: "npm / yarn / pnpm", en: "Package managers", ua: "Пакетні менеджери", langs: "Frontend", example: "npm install react", explain: "Встановлюють і керують залежностями проєкту з реєстру npm." },
  { cat: "Frontend: Тестування", sym: "Jest / Vitest", en: "Test runners", ua: "Раннери тестів", langs: "Frontend", example: "test('sum works', () => { expect(sum(1,2)).toBe(3); });", explain: "Запускають unit-тести й перевіряють результати через матчери (expect...toBe)." },
  { cat: "Frontend: Тестування", sym: "Cypress / Playwright", en: "E2E testing tools", ua: "Інструменти end-to-end тестування", langs: "Frontend", example: "await page.click('button');", explain: "Автоматизують реальний браузер для тестування застосунку так, як його використовує людина." },
  { cat: "Frontend: Тестування", sym: "Testing Library", en: "Testing Library", ua: "Бібліотека Testing Library", langs: "Frontend", example: "screen.getByText('Привіт');", explain: "Тестує компоненти так, як їх бачить користувач — через текст і ролі, а не внутрішню структуру." },
  { cat: "Frontend: Концепції", sym: "DOM / Virtual DOM", en: "DOM concepts", ua: "Концепції DOM", langs: "Frontend", example: "—", explain: "DOM — представлення сторінки як дерева об'єктів; Virtual DOM (React) — легка копія в пам'яті для швидкого порівняння змін." },
  { cat: "Frontend: Концепції", sym: "SPA / MPA", en: "App architecture types", ua: "Типи архітектури застосунку", langs: "Frontend", example: "—", explain: "SPA — один HTML-файл, навігація через JS без перезавантаження; MPA — кожна сторінка окремий запит на сервер." },
  { cat: "Frontend: Концепції", sym: "SSR / SSG / CSR", en: "Rendering strategies", ua: "Стратегії рендерингу", langs: "Frontend", example: "—", explain: "SSR рендерить HTML на сервері під кожен запит, SSG — заздалегідь під час збірки, CSR — у браузері після завантаження JS." },
  { cat: "Frontend: Концепції", sym: "Hydration", en: "Hydration", ua: "Гідратація", langs: "Frontend", example: "—", explain: "Процес «оживлення» статичного HTML з сервера — прикріплення JS-обробників подій на клієнті." },
  { cat: "Frontend: Концепції", sym: "PWA", en: "Progressive Web App", ua: "Прогресивний веб-застосунок", langs: "Frontend", example: "manifest.json", explain: "Веб-сайт, що поводиться як нативний застосунок — офлайн-робота, іконка на екрані, push-сповіщення." },
  { cat: "Frontend: Концепції", sym: "Web Components / Shadow DOM", en: "Web components", ua: "Веб-компоненти", langs: "Frontend", example: "customElements.define('my-el', MyElement);", explain: "Нативний браузерний спосіб створювати перевикористовувані компоненти з ізольованим DOM/CSS." },
  { cat: "Frontend: Доступність", sym: "a11y (Accessibility)", en: "Accessibility", ua: "Доступність", langs: "Frontend", example: "aria-label=\"Закрити\"", explain: "Практики, що роблять сайт зручним для людей з інвалідністю — скрінрідери, клавіатурна навігація." },
  { cat: "Frontend: SEO/продуктивність", sym: "Core Web Vitals", en: "Core Web Vitals", ua: "Основні веб-показники", langs: "Frontend", example: "—", explain: "Метрики Google для оцінки якості UX сторінки: швидкість завантаження, стабільність макету, інтерактивність." },

  { cat: "Python: Ключові слова", sym: "def", en: "Function definition", ua: "Оголошення функції", langs: "Python", example: "def greet(name):\n    return f'Привіт, {name}'", explain: "Оголошує функцію." },
  { cat: "Python: Ключові слова", sym: "if / elif / else", en: "Conditional statements", ua: "Умовні оператори", langs: "Python", example: "if x > 0:\n    print('positive')", explain: "Виконує блок коду залежно від умови; двокрапка й відступи замість фігурних дужок." },
  { cat: "Python: Ключові слова", sym: "for / in", en: "For loop", ua: "Цикл for", langs: "Python", example: "for x in range(5):\n    print(x)", explain: "Перебирає елементи ітерованого об'єкта — списку, рядка, range." },
  { cat: "Python: Ключові слова", sym: "while", en: "While loop", ua: "Цикл while", langs: "Python", example: "while x < 10:\n    x += 1", explain: "Виконує блок, поки умова істинна." },
  { cat: "Python: Ключові слова", sym: "break / continue / pass", en: "Loop control", ua: "Керування циклом", langs: "Python", example: "if x == 5:\n    break", explain: "break зупиняє цикл, continue переходить до наступної ітерації, pass — «нічого не роби» (заглушка)." },
  { cat: "Python: Ключові слова", sym: "try / except / finally / raise", en: "Exception handling", ua: "Обробка винятків", langs: "Python", example: "try:\n    risky()\nexcept ValueError as e:\n    print(e)", explain: "try виконує код, except ловить винятки, finally виконується завжди, raise генерує виняток." },
  { cat: "Python: Ключові слова", sym: "class", en: "Class definition", ua: "Оголошення класу", langs: "Python", example: "class User:\n    def __init__(self, name):\n        self.name = name", explain: "Оголошує клас для об'єктно-орієнтованого програмування." },
  { cat: "Python: Ключові слова", sym: "import / from ... import", en: "Import statements", ua: "Оператори імпорту", langs: "Python", example: "from math import sqrt", explain: "Підключають модулі чи окремі імена з них." },
  { cat: "Python: Ключові слова", sym: "lambda", en: "Lambda function", ua: "Лямбда-функція", langs: "Python", example: "square = lambda x: x ** 2", explain: "Анонімна однорядкова функція." },
  { cat: "Python: Ключові слова", sym: "yield", en: "Yield statement", ua: "Оператор yield", langs: "Python", example: "def gen():\n    yield 1\n    yield 2", explain: "Робить функцію генератором — призупиняє виконання й повертає значення по одному." },
  { cat: "Python: Ключові слова", sym: "with / as", en: "Context manager", ua: "Контекстний менеджер", langs: "Python", example: "with open('f.txt') as f:\n    data = f.read()", explain: "Автоматично звільняє ресурс (файл, з'єднання) після виконання блоку, навіть при помилці." },
  { cat: "Python: Ключові слова", sym: "and / or / not", en: "Logical operators", ua: "Логічні оператори", langs: "Python", example: "if a and not b:", explain: "Логічне і, або, заперечення — пишуться словами, а не &&/||/!." },
  { cat: "Python: Ключові слова", sym: "is / in", en: "Identity/membership operators", ua: "Оператори тотожності/належності", langs: "Python", example: "if x is None: ...\nif y in lst:", explain: "is перевіряє тотожність об'єктів (не значення), in перевіряє належність елемента колекції." },
  { cat: "Python: Ключові слова", sym: "global / nonlocal", en: "Scope keywords", ua: "Ключові слова області видимості", langs: "Python", example: "def f():\n    global count\n    count += 1", explain: "Дозволяють змінювати змінну із зовнішньої (global) чи охоплюючої (nonlocal) області видимості." },
  { cat: "Python: Ключові слова", sym: "async / await", en: "Async keywords", ua: "Асинхронні ключові слова", langs: "Python", example: "async def fetch():\n    await asyncio.sleep(1)", explain: "Оголошують і очікують асинхронні корутини (потрібен asyncio)." },
  { cat: "Python: Літерали", sym: "True / False / None", en: "Literals", ua: "Літерали", langs: "Python", example: "if value is None:", explain: "True/False — булеві значення, None — відсутність значення (аналог null/undefined)." },
  { cat: "Python: Типи даних", sym: "int / float / complex / bool", en: "Numeric types", ua: "Числові типи", langs: "Python", example: "x = 5; y = 3.14", explain: "Ціле, дробове, комплексне число й булеве значення." },
  { cat: "Python: Типи даних", sym: "str", en: "String type", ua: "Рядковий тип", langs: "Python", example: "s = 'привіт'", explain: "Рядковий тип — незмінна послідовність символів." },
  { cat: "Python: Типи даних", sym: "list", en: "List type", ua: "Тип список", langs: "Python", example: "lst = [1, 2, 3]", explain: "Впорядкована змінювана колекція елементів." },
  { cat: "Python: Типи даних", sym: "tuple", en: "Tuple type", ua: "Тип кортеж", langs: "Python", example: "t = (1, 2, 3)", explain: "Впорядкована незмінювана колекція елементів." },
  { cat: "Python: Типи даних", sym: "set / frozenset", en: "Set types", ua: "Типи множина", langs: "Python", example: "s = {1, 2, 3}", explain: "Колекція унікальних елементів без порядку; frozenset — незмінна версія." },
  { cat: "Python: Типи даних", sym: "dict", en: "Dictionary type", ua: "Тип словник", langs: "Python", example: "d = {'name': 'Оля'}", explain: "Колекція пар ключ-значення." },
  { cat: "Python: Типи даних", sym: "range", en: "Range type", ua: "Тип range", langs: "Python", example: "range(0, 10, 2)", explain: "Ефективна послідовність чисел для циклів — не створює весь список у пам'яті одразу." },
  { cat: "Python: F-рядки", sym: "f'{}'", en: "F-string", ua: "Форматований рядок", langs: "Python", example: "f'Привіт, {name}! Тобі {age} років.'", explain: "Вставляє значення змінних і виразів прямо в рядок через {}." },
  { cat: "Python: Списки", sym: "[x for x in y]", en: "List comprehension", ua: "Генератор списку", langs: "Python", example: "squares = [x**2 for x in range(10)]", explain: "Компактний спосіб створити список на основі ітерованого об'єкта, опціонально з умовою." },
  { cat: "Python: Функції", sym: "*args / **kwargs", en: "Variadic arguments", ua: "Змінна кількість аргументів", langs: "Python", example: "def f(*args, **kwargs): ...", explain: "*args збирає позиційні аргументи в кортеж, **kwargs — іменовані в словник." },
  { cat: "Python: Декоратори", sym: "@decorator", en: "Decorator", ua: "Декоратор", langs: "Python", example: "@staticmethod\ndef fn(): ...", explain: "Обгортає функцію/метод, додаючи поведінку, не змінюючи її код." },
  { cat: "Python: ООП", sym: "self", en: "Self reference", ua: "Посилання на екземпляр", langs: "Python", example: "def __init__(self, name):\n    self.name = name", explain: "Перший параметр методу класу — посилання на сам об'єкт (аналог this у JS)." },
  { cat: "Python: ООП", sym: "@property / @classmethod / @staticmethod", en: "Method decorators", ua: "Декоратори методів", langs: "Python", example: "@property\ndef age(self): return self._age", explain: "property робить метод доступним як атрибут, classmethod отримує клас замість self, staticmethod не потребує ні того, ні іншого." },

  { cat: "Python: Вбудовані функції", sym: "print()", en: "Print function", ua: "Функція виводу", langs: "Python", example: "print('Привіт', 'світ', sep=', ')", explain: "Виводить значення в консоль." },
  { cat: "Python: Вбудовані функції", sym: "len()", en: "Length function", ua: "Функція довжини", langs: "Python", example: "len([1, 2, 3])", explain: "Повертає кількість елементів у послідовності чи колекції." },
  { cat: "Python: Вбудовані функції", sym: "type() / isinstance()", en: "Type check functions", ua: "Функції перевірки типу", langs: "Python", example: "isinstance(x, int)", explain: "type повертає тип об'єкта, isinstance перевіряє належність до типу (включно з підкласами)." },
  { cat: "Python: Вбудовані функції", sym: "range()", en: "Range function", ua: "Функція range", langs: "Python", example: "range(0, 10, 2)", explain: "Створює послідовність чисел для циклів: початок, кінець (не включно), крок." },
  { cat: "Python: Вбудовані функції", sym: "enumerate()", en: "Enumerate function", ua: "Функція enumerate", langs: "Python", example: "for i, val in enumerate(lst):", explain: "Додає індекс до кожного елемента при переборі — зручно замість ручного лічильника." },
  { cat: "Python: Вбудовані функції", sym: "zip()", en: "Zip function", ua: "Функція zip", langs: "Python", example: "for a, b in zip(list1, list2):", explain: "Об'єднує кілька ітерованих об'єктів попарно в один." },
  { cat: "Python: Вбудовані функції", sym: "map() / filter()", en: "Map/filter functions", ua: "Функції map/filter", langs: "Python", example: "list(map(str.upper, words))", explain: "map застосовує функцію до кожного елемента, filter лишає ті, що проходять умову." },
  { cat: "Python: Вбудовані функції", sym: "sorted() / reversed()", en: "Sort/reverse functions", ua: "Функції сортування/розвороту", langs: "Python", example: "sorted(lst, key=len)", explain: "Повертають новий відсортований чи розвернутий список, не змінюючи оригінал." },
  { cat: "Python: Вбудовані функції", sym: "sum() / min() / max()", en: "Aggregation functions", ua: "Функції агрегації", langs: "Python", example: "sum([1, 2, 3])", explain: "Обчислюють суму, мінімум чи максимум значень у послідовності." },
  { cat: "Python: Вбудовані функції", sym: "abs() / round() / pow() / divmod()", en: "Math functions", ua: "Математичні функції", langs: "Python", example: "round(3.14159, 2)", explain: "Модуль числа, округлення, піднесення до степеня, частка й залишок ділення одразу." },
  { cat: "Python: Вбудовані функції", sym: "int() / float() / str() / bool()", en: "Type conversion functions", ua: "Функції перетворення типу", langs: "Python", example: "int('42')", explain: "Перетворюють значення на відповідний тип." },
  { cat: "Python: Вбудовані функції", sym: "list() / tuple() / set() / dict()", en: "Collection constructors", ua: "Конструктори колекцій", langs: "Python", example: "list('abc')", explain: "Створюють відповідну колекцію з ітерованого об'єкта." },
  { cat: "Python: Вбудовані функції", sym: "input()", en: "Input function", ua: "Функція вводу", langs: "Python", example: "name = input('Введи ім'я: ')", explain: "Читає рядок, введений користувачем у консолі." },
  { cat: "Python: Вбудовані функції", sym: "open()", en: "Open function", ua: "Функція відкриття файлу", langs: "Python", example: "with open('file.txt') as f: ...", explain: "Відкриває файл для читання чи запису." },
  { cat: "Python: Вбудовані функції", sym: "any() / all()", en: "Any/all functions", ua: "Функції any/all", langs: "Python", example: "all(x > 0 for x in nums)", explain: "any — чи хоч один елемент істинний, all — чи всі елементи істинні." },
  { cat: "Python: Вбудовані функції", sym: "id() / hash()", en: "Identity/hash functions", ua: "Функції ідентичності/хешу", langs: "Python", example: "id(obj)", explain: "id повертає унікальний ідентифікатор об'єкта в пам'яті, hash — хеш-значення для незмінних об'єктів." },
  { cat: "Python: Вбудовані функції", sym: "dir() / vars()", en: "Introspection functions", ua: "Функції інтроспекції", langs: "Python", example: "dir(obj)", explain: "dir показує список атрибутів/методів об'єкта, vars — словник його атрибутів." },
  { cat: "Python: Вбудовані функції", sym: "super()", en: "Super function", ua: "Функція super", langs: "Python", example: "super().__init__()", explain: "Звертається до методів батьківського класу з дочірнього." },
  { cat: "Python: Рядки", sym: "split() / join()", en: "String split/join", ua: "Розбиття/об'єднання рядка", langs: "Python", example: "'a,b,c'.split(',')", explain: "split розбиває рядок на список за роздільником, join — об'єднує список у рядок." },
  { cat: "Python: Рядки", sym: "strip() / lstrip() / rstrip()", en: "String trim methods", ua: "Методи обрізання рядка", langs: "Python", example: "'  text  '.strip()", explain: "Прибирають пробіли з обох країв, лише зліва чи лише справа." },
  { cat: "Python: Рядки", sym: "lower() / upper() / capitalize() / title()", en: "String case methods", ua: "Методи регістру рядка", langs: "Python", example: "'hello'.title()", explain: "Змінюють регістр символів рядка різними способами." },
  { cat: "Python: Рядки", sym: "replace() / find() / count()", en: "String search/replace", ua: "Пошук/заміна в рядку", langs: "Python", example: "'abcabc'.count('a')", explain: "Замінюють підрядок, шукають його позицію чи рахують кількість входжень." },
  { cat: "Python: Рядки", sym: "startswith() / endswith()", en: "String prefix/suffix check", ua: "Перевірка початку/кінця рядка", langs: "Python", example: "'file.py'.endswith('.py')", explain: "Перевіряють, чи рядок починається/закінчується заданим підрядком." },
  { cat: "Python: Списки", sym: "append() / extend() / insert()", en: "List add methods", ua: "Методи додавання в список", langs: "Python", example: "lst.append(5)", explain: "append додає один елемент у кінець, extend додає всі елементи з іншого списку, insert — за індексом." },
  { cat: "Python: Списки", sym: "remove() / pop() / clear()", en: "List remove methods", ua: "Методи видалення зі списку", langs: "Python", example: "lst.pop(0)", explain: "remove видаляє перше входження значення, pop — елемент за індексом (типово останній), clear — усе." },
  { cat: "Python: Списки", sym: "sort() / reverse()", en: "List in-place sort", ua: "Сортування списку на місці", langs: "Python", example: "lst.sort(reverse=True)", explain: "Сортують чи розвертають список на місці (на відміну від sorted()/reversed())." },
  { cat: "Python: Словники", sym: "keys() / values() / items()", en: "Dict view methods", ua: "Методи огляду словника", langs: "Python", example: "for k, v in d.items():", explain: "Повертають ключі, значення чи пари ключ-значення словника." },
  { cat: "Python: Словники", sym: "get() / setdefault()", en: "Dict safe access", ua: "Безпечний доступ до словника", langs: "Python", example: "d.get('key', 'default')", explain: "get повертає значення без помилки, якщо ключа немає; setdefault ще й встановлює його." },
  { cat: "Python: Множини", sym: "union() / intersection() / difference()", en: "Set operations", ua: "Операції над множинами", langs: "Python", example: "a.intersection(b)", explain: "Об'єднання, перетин чи різниця двох множин." },

  { cat: "Python: Магічні методи", sym: "__init__", en: "Constructor method", ua: "Метод-конструктор", langs: "Python", example: "def __init__(self, name):\n    self.name = name", explain: "Викликається автоматично при створенні нового екземпляра класу." },
  { cat: "Python: Магічні методи", sym: "__str__ / __repr__", en: "String representation methods", ua: "Методи текстового представлення", langs: "Python", example: "def __str__(self): return f'User({self.name})'", explain: "__str__ — зручне представлення для print(), __repr__ — однозначне для розробника/дебагу." },
  { cat: "Python: Магічні методи", sym: "__len__ / __getitem__ / __setitem__", en: "Container protocol methods", ua: "Методи протоколу контейнера", langs: "Python", example: "def __len__(self): return len(self.items)", explain: "Дозволяють об'єкту працювати з len(), індексацією obj[i] і присвоєнням obj[i] = x." },
  { cat: "Python: Магічні методи", sym: "__iter__ / __next__", en: "Iterator protocol methods", ua: "Методи протоколу ітератора", langs: "Python", example: "def __iter__(self): return self", explain: "Роблять об'єкт сумісним з for-циклом і функцією iter()." },
  { cat: "Python: Магічні методи", sym: "__eq__ / __lt__ / __gt__", en: "Comparison methods", ua: "Методи порівняння", langs: "Python", example: "def __eq__(self, other): return self.id == other.id", explain: "Визначають поведінку операторів порівняння (==, <, >) для власних об'єктів." },
  { cat: "Python: Магічні методи", sym: "__add__ / __sub__ / __mul__", en: "Arithmetic methods", ua: "Методи арифметичних операцій", langs: "Python", example: "def __add__(self, other): return Vector(self.x+other.x)", explain: "Дозволяють використовувати +, -, * зі своїми об'єктами (перевантаження операторів)." },
  { cat: "Python: Магічні методи", sym: "__enter__ / __exit__", en: "Context manager methods", ua: "Методи контекстного менеджера", langs: "Python", example: "def __enter__(self): return self", explain: "Роблять об'єкт сумісним з оператором with — виконуються при вході/виході з блоку." },
  { cat: "Python: Магічні методи", sym: "__call__", en: "Callable method", ua: "Метод виклику як функції", langs: "Python", example: "def __call__(self, x): return x * 2", explain: "Дозволяє викликати екземпляр класу як функцію: instance(x)." },
  { cat: "Python: Винятки", sym: "ValueError / TypeError", en: "Common exception types", ua: "Поширені типи винятків", langs: "Python", example: "raise ValueError('Некоректне значення')", explain: "ValueError — правильний тип, неправильне значення; TypeError — операція над непідходящим типом." },
  { cat: "Python: Винятки", sym: "KeyError / IndexError", en: "Lookup exceptions", ua: "Винятки пошуку", langs: "Python", example: "d['missing_key']  # KeyError", explain: "KeyError — відсутній ключ словника, IndexError — індекс поза межами списку." },
  { cat: "Python: Винятки", sym: "FileNotFoundError / PermissionError", en: "File exceptions", ua: "Винятки роботи з файлами", langs: "Python", example: "open('missing.txt')  # FileNotFoundError", explain: "Виникають при проблемах доступу до файлів." },
  { cat: "Python: Винятки", sym: "ZeroDivisionError", en: "Division by zero error", ua: "Ділення на нуль", langs: "Python", example: "1 / 0  # ZeroDivisionError", explain: "Виникає при спробі ділення на нуль." },
  { cat: "Python: Винятки", sym: "assert", en: "Assert statement", ua: "Оператор assert", langs: "Python", example: "assert x > 0, 'x має бути додатним'", explain: "Перевіряє умову й викликає AssertionError, якщо вона хибна — корисно для тестів і перевірки інваріантів." },
  { cat: "Python: Файли", sym: "read() / readline() / readlines()", en: "File read methods", ua: "Методи читання файлу", langs: "Python", example: "content = f.read()", explain: "Читають увесь файл, один рядок чи всі рядки списком." },
  { cat: "Python: Файли", sym: "write() / writelines()", en: "File write methods", ua: "Методи запису у файл", langs: "Python", example: "f.write('текст')", explain: "Записують текст у відкритий файл." },
  { cat: "Python: Pathlib", sym: "Path()", en: "Path object", ua: "Об'єкт шляху", langs: "Python", example: "from pathlib import Path\nPath('folder/file.txt')", explain: "Сучасний об'єктний спосіб роботи зі шляхами файлової системи." },
  { cat: "Python: Типізація", sym: "Optional / Union / list[int]", en: "Type hints", ua: "Підказки типів", langs: "Python", example: "def f(x: int | None) -> str: ...", explain: "Необов'язкові підказки типів для параметрів і повернення функції, перевіряються зовнішніми інструментами (mypy)." },
  { cat: "Python: Дата-класи", sym: "@dataclass", en: "Dataclass decorator", ua: "Декоратор dataclass", langs: "Python", example: "@dataclass\nclass Point:\n    x: int\n    y: int", explain: "Автоматично генерує __init__, __repr__, __eq__ для класу-контейнера даних." },

  { cat: "Python: Стандартна бібліотека", sym: "math", en: "Math module", ua: "Модуль math", langs: "Python", example: "import math\nmath.sqrt(16)", explain: "Математичні функції: корінь, тригонометрія, логарифми, константи pi/e." },
  { cat: "Python: Стандартна бібліотека", sym: "random", en: "Random module", ua: "Модуль random", langs: "Python", example: "import random\nrandom.choice([1, 2, 3])", explain: "Генерує випадкові числа, обирає випадковий елемент, перемішує список." },
  { cat: "Python: Стандартна бібліотека", sym: "datetime", en: "Datetime module", ua: "Модуль datetime", langs: "Python", example: "from datetime import datetime\ndatetime.now()", explain: "Робота з датами й часом: поточний час, різниця, форматування." },
  { cat: "Python: Стандартна бібліотека", sym: "json", en: "JSON module", ua: "Модуль json", langs: "Python", example: "json.dumps({'a': 1})", explain: "Перетворює між Python-об'єктами та JSON-рядками (loads/dumps)." },
  { cat: "Python: Стандартна бібліотека", sym: "os / os.path", en: "OS module", ua: "Модуль os", langs: "Python", example: "os.listdir('.')", explain: "Взаємодія з операційною системою — файли, директорії, змінні середовища." },
  { cat: "Python: Стандартна бібліотека", sym: "sys", en: "Sys module", ua: "Модуль sys", langs: "Python", example: "sys.argv", explain: "Доступ до параметрів і функцій, специфічних для інтерпретатора Python — аргументи командного рядка, версія." },
  { cat: "Python: Стандартна бібліотека", sym: "re", en: "Regex module", ua: "Модуль регулярних виразів", langs: "Python", example: "re.findall(r'\\d+', text)", explain: "Пошук і обробка тексту через регулярні вирази." },
  { cat: "Python: Стандартна бібліотека", sym: "collections", en: "Collections module", ua: "Модуль collections", langs: "Python", example: "from collections import Counter\nCounter(items)", explain: "Спеціалізовані контейнери: Counter (лічильник), defaultdict, deque (черга), namedtuple." },
  { cat: "Python: Стандартна бібліотека", sym: "itertools", en: "Itertools module", ua: "Модуль itertools", langs: "Python", example: "itertools.permutations([1,2,3])", explain: "Ефективні інструменти для ітерацій: комбінації, перестановки, нескінченні послідовності." },
  { cat: "Python: Стандартна бібліотека", sym: "functools", en: "Functools module", ua: "Модуль functools", langs: "Python", example: "from functools import reduce\nreduce(lambda a,b: a+b, nums)", explain: "Функціональні інструменти: reduce (згортка), lru_cache (кешування), partial (часткове застосування)." },
  { cat: "Python: Стандартна бібліотека", sym: "csv", en: "CSV module", ua: "Модуль csv", langs: "Python", example: "csv.reader(file)", explain: "Читання й запис CSV-файлів (таблиць з роздільником-комою)." },
  { cat: "Python: Стандартна бібліотека", sym: "sqlite3", en: "SQLite module", ua: "Модуль sqlite3", langs: "Python", example: "conn = sqlite3.connect('db.sqlite')", explain: "Вбудована робота з файловою базою даних SQLite без встановлення сервера." },
  { cat: "Python: Стандартна бібліотека", sym: "asyncio", en: "Asyncio module", ua: "Модуль asyncio", langs: "Python", example: "asyncio.run(main())", explain: "Асинхронне програмування — паралельне виконання корутин без потоків." },
  { cat: "Python: Стандартна бібліотека", sym: "unittest / pytest", en: "Testing frameworks", ua: "Фреймворки тестування", langs: "Python", example: "def test_sum():\n    assert sum([1,2]) == 3", explain: "Пишуть і запускають автоматизовані тести коду." },
  { cat: "Python: Пакування", sym: "pip", en: "Pip package manager", ua: "Пакетний менеджер pip", langs: "Python", example: "pip install requests", explain: "Встановлює сторонні бібліотеки з PyPI." },
  { cat: "Python: Пакування", sym: "venv", en: "Virtual environment", ua: "Віртуальне середовище", langs: "Python", example: "python -m venv venv", explain: "Ізольоване середовище з власними залежностями для кожного проєкту." },
  { cat: "Python: Пакування", sym: "requirements.txt / pyproject.toml", en: "Dependency files", ua: "Файли залежностей", langs: "Python", example: "requests==2.31.0", explain: "Файли, що фіксують список залежностей проєкту з версіями." },
  { cat: "Python: Веб-фреймворки", sym: "Flask", en: "Flask framework", ua: "Фреймворк Flask", langs: "Python", example: "@app.route('/')\ndef home(): return 'Привіт'", explain: "Мінімалістичний веб-фреймворк для швидкого старту." },
  { cat: "Python: Веб-фреймворки", sym: "Django", en: "Django framework", ua: "Фреймворк Django", langs: "Python", example: "python manage.py runserver", explain: "Повноцінний фреймворк «з батарейками» — ORM, адмінка, автентифікація з коробки." },
  { cat: "Python: Веб-фреймворки", sym: "FastAPI", en: "FastAPI framework", ua: "Фреймворк FastAPI", langs: "Python", example: "@app.get('/users')\nasync def get_users(): ...", explain: "Сучасний асинхронний фреймворк з автоматичною валідацією й документацією API." },
  { cat: "Python: Дані/ML", sym: "Pandas / NumPy", en: "Data science libraries", ua: "Бібліотеки для аналізу даних", langs: "Python", example: "pd.DataFrame(data)", explain: "Pandas — робота з табличними даними, NumPy — швидкі обчислення над масивами чисел." },

  { cat: "SQL: SELECT", sym: "SELECT / FROM", en: "Select/from clauses", ua: "Вибірка даних", langs: "SQL", example: "SELECT name, age FROM users;", explain: "SELECT задає колонки для вибірки, FROM — з якої таблиці." },
  { cat: "SQL: SELECT", sym: "SELECT * / SELECT DISTINCT", en: "Select variants", ua: "Варіанти вибірки", langs: "SQL", example: "SELECT DISTINCT city FROM users;", explain: "* вибирає всі колонки, DISTINCT прибирає повторювані рядки з результату." },
  { cat: "SQL: SELECT", sym: "WHERE", en: "Where clause", ua: "Умова фільтрації", langs: "SQL", example: "SELECT * FROM users WHERE age > 18;", explain: "Фільтрує рядки за умовою до групування." },
  { cat: "SQL: SELECT", sym: "ORDER BY / ASC / DESC", en: "Order by clause", ua: "Сортування результату", langs: "SQL", example: "ORDER BY age DESC;", explain: "Сортує результат за колонкою, за зростанням (типово) чи спаданням." },
  { cat: "SQL: SELECT", sym: "LIMIT / OFFSET", en: "Limit/offset clauses", ua: "Обмеження/зсув вибірки", langs: "SQL", example: "LIMIT 10 OFFSET 20;", explain: "Обмежують кількість рядків і пропускають перші N — для пагінації." },
  { cat: "SQL: SELECT", sym: "AS", en: "Alias keyword", ua: "Псевдонім", langs: "SQL", example: "SELECT name AS full_name FROM users;", explain: "Задає тимчасове ім'я для колонки чи таблиці в запиті." },
  { cat: "SQL: Фільтрація", sym: "AND / OR / NOT", en: "Logical operators", ua: "Логічні оператори", langs: "SQL", example: "WHERE age > 18 AND city = 'Київ';", explain: "Комбінують кілька умов у WHERE." },
  { cat: "SQL: Фільтрація", sym: "IN / NOT IN", en: "In operator", ua: "Оператор IN", langs: "SQL", example: "WHERE city IN ('Київ', 'Львів');", explain: "Перевіряє, чи значення входить у заданий список." },
  { cat: "SQL: Фільтрація", sym: "BETWEEN", en: "Between operator", ua: "Оператор BETWEEN", langs: "SQL", example: "WHERE age BETWEEN 18 AND 65;", explain: "Перевіряє, чи значення в заданому діапазоні (включно)." },
  { cat: "SQL: Фільтрація", sym: "LIKE / ILIKE", en: "Pattern matching", ua: "Пошук за шаблоном", langs: "SQL", example: "WHERE name LIKE 'О%';", explain: "Шукає текст за шаблоном: % — будь-які символи, _ — один символ. ILIKE — без урахування регістру (PostgreSQL)." },
  { cat: "SQL: Фільтрація", sym: "IS NULL / IS NOT NULL", en: "Null checks", ua: "Перевірка на NULL", langs: "SQL", example: "WHERE email IS NULL;", explain: "Перевіряють відсутність значення — = NULL не працює, потрібно саме IS NULL." },
  { cat: "SQL: Фільтрація", sym: "EXISTS / NOT EXISTS", en: "Exists operator", ua: "Оператор EXISTS", langs: "SQL", example: "WHERE EXISTS (SELECT 1 FROM orders WHERE user_id = users.id);", explain: "Перевіряє, чи підзапит повертає хоч один рядок." },
  { cat: "SQL: Агрегація", sym: "COUNT() / SUM() / AVG()", en: "Aggregate functions", ua: "Агрегатні функції", langs: "SQL", example: "SELECT COUNT(*) FROM users;", explain: "Рахують кількість рядків, суму чи середнє значення колонки." },
  { cat: "SQL: Агрегація", sym: "MIN() / MAX()", en: "Min/max functions", ua: "Функції мінімуму/максимуму", langs: "SQL", example: "SELECT MAX(price) FROM products;", explain: "Повертають найменше чи найбільше значення колонки." },
  { cat: "SQL: Групування", sym: "GROUP BY", en: "Group by clause", ua: "Групування", langs: "SQL", example: "SELECT city, COUNT(*) FROM users GROUP BY city;", explain: "Групує рядки за значенням колонки для застосування агрегатних функцій до кожної групи." },
  { cat: "SQL: Групування", sym: "HAVING", en: "Having clause", ua: "Фільтрація груп", langs: "SQL", example: "GROUP BY city HAVING COUNT(*) > 10;", explain: "Фільтрує результат ПІСЛЯ групування — WHERE не може працювати з агрегатними функціями." },
  { cat: "SQL: JOIN", sym: "INNER JOIN", en: "Inner join", ua: "Внутрішнє з'єднання", langs: "SQL", example: "SELECT * FROM orders JOIN users ON orders.user_id = users.id;", explain: "Повертає лише рядки, що мають відповідність в обох таблицях." },
  { cat: "SQL: JOIN", sym: "LEFT JOIN", en: "Left join", ua: "Ліве з'єднання", langs: "SQL", example: "SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id;", explain: "Повертає всі рядки лівої таблиці, навіть без відповідності в правій (NULL замість неї)." },
  { cat: "SQL: JOIN", sym: "RIGHT JOIN / FULL JOIN", en: "Right/full join", ua: "Праве/повне з'єднання", langs: "SQL", example: "SELECT * FROM a FULL JOIN b ON a.id = b.id;", explain: "RIGHT — усі рядки правої таблиці, FULL — усі рядки з обох, з NULL там, де немає відповідності." },
  { cat: "SQL: JOIN", sym: "CROSS JOIN", en: "Cross join", ua: "Декартів добуток", langs: "SQL", example: "SELECT * FROM colors CROSS JOIN sizes;", explain: "Комбінує кожен рядок однієї таблиці з кожним рядком іншої (декартів добуток)." },
  { cat: "SQL: JOIN", sym: "ON / USING", en: "Join condition", ua: "Умова з'єднання", langs: "SQL", example: "JOIN orders USING (user_id);", explain: "Задають умову, за якою пов'язуються рядки таблиць у JOIN." },
  { cat: "SQL: Набори", sym: "UNION / UNION ALL", en: "Union operator", ua: "Оператор об'єднання", langs: "SQL", example: "SELECT city FROM a UNION SELECT city FROM b;", explain: "Об'єднує результати двох запитів; UNION прибирає дублікати, UNION ALL — ні (швидше)." },
  { cat: "SQL: Набори", sym: "INTERSECT / EXCEPT", en: "Intersect/except operators", ua: "Перетин/різниця результатів", langs: "SQL", example: "SELECT id FROM a INTERSECT SELECT id FROM b;", explain: "Повертають рядки, спільні для обох запитів (INTERSECT) чи лише в першому, але не в другому (EXCEPT)." },

  { cat: "SQL: Зміна даних", sym: "INSERT INTO", en: "Insert statement", ua: "Додавання рядка", langs: "SQL", example: "INSERT INTO users (name, age) VALUES ('Оля', 25);", explain: "Додає новий рядок у таблицю." },
  { cat: "SQL: Зміна даних", sym: "UPDATE / SET", en: "Update statement", ua: "Оновлення рядків", langs: "SQL", example: "UPDATE users SET age = 26 WHERE id = 1;", explain: "Змінює значення колонок у рядках, що відповідають умові WHERE." },
  { cat: "SQL: Зміна даних", sym: "DELETE FROM", en: "Delete statement", ua: "Видалення рядків", langs: "SQL", example: "DELETE FROM users WHERE id = 1;", explain: "Видаляє рядки, що відповідають умові WHERE (без WHERE — усі рядки!)." },
  { cat: "SQL: Зміна даних", sym: "RETURNING", en: "Returning clause", ua: "Повернення результату", langs: "SQL", example: "INSERT INTO users (name) VALUES ('Оля') RETURNING id;", explain: "Повертає значення вставлених/оновлених/видалених рядків (PostgreSQL)." },
  { cat: "SQL: Структура", sym: "CREATE TABLE", en: "Create table", ua: "Створення таблиці", langs: "SQL", example: "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);", explain: "Створює нову таблицю з описом колонок і їх типів." },
  { cat: "SQL: Структура", sym: "ALTER TABLE", en: "Alter table", ua: "Зміна структури таблиці", langs: "SQL", example: "ALTER TABLE users ADD COLUMN email TEXT;", explain: "Додає, видаляє чи змінює колонки в існуючій таблиці." },
  { cat: "SQL: Структура", sym: "DROP TABLE / TRUNCATE TABLE", en: "Drop/truncate table", ua: "Видалення таблиці/даних", langs: "SQL", example: "DROP TABLE old_logs;", explain: "DROP видаляє таблицю повністю зі структурою, TRUNCATE лише очищає всі дані, лишаючи структуру." },
  { cat: "SQL: Структура", sym: "PRIMARY KEY", en: "Primary key constraint", ua: "Первинний ключ", langs: "SQL", example: "id SERIAL PRIMARY KEY", explain: "Унікальний ідентифікатор рядка, автоматично індексується." },
  { cat: "SQL: Структура", sym: "FOREIGN KEY / REFERENCES", en: "Foreign key constraint", ua: "Зовнішній ключ", langs: "SQL", example: "user_id INTEGER REFERENCES users(id)", explain: "Забезпечує зв'язок з рядком в іншій таблиці й цілісність даних." },
  { cat: "SQL: Структура", sym: "UNIQUE / NOT NULL / DEFAULT", en: "Column constraints", ua: "Обмеження колонки", langs: "SQL", example: "email TEXT UNIQUE NOT NULL DEFAULT ''", explain: "UNIQUE забороняє дублікати, NOT NULL — порожні значення, DEFAULT задає значення за замовчуванням." },
  { cat: "SQL: Структура", sym: "CHECK", en: "Check constraint", ua: "Обмеження перевірки", langs: "SQL", example: "age INTEGER CHECK (age >= 0)", explain: "Обмежує допустимі значення колонки власною умовою." },
  { cat: "SQL: Індекси/в'юхи", sym: "CREATE INDEX", en: "Create index", ua: "Створення індексу", langs: "SQL", example: "CREATE INDEX idx_email ON users(email);", explain: "Прискорює пошук за колонкою, ціною додаткового місця й повільнішого запису." },
  { cat: "SQL: Індекси/в'юхи", sym: "CREATE VIEW", en: "Create view", ua: "Створення представлення", langs: "SQL", example: "CREATE VIEW active_users AS SELECT * FROM users WHERE active = true;", explain: "Зберігає запит як віртуальну таблицю, яку можна використовувати як звичайну." },
  { cat: "SQL: Транзакції", sym: "BEGIN / COMMIT / ROLLBACK", en: "Transaction control", ua: "Керування транзакціями", langs: "SQL", example: "BEGIN;\nUPDATE ...;\nCOMMIT;", explain: "BEGIN починає транзакцію, COMMIT зберігає зміни, ROLLBACK скасовує їх усі." },
  { cat: "SQL: Транзакції", sym: "SAVEPOINT", en: "Savepoint", ua: "Точка збереження", langs: "SQL", example: "SAVEPOINT sp1;", explain: "Проміжна точка в транзакції, до якої можна відкотитись, не скасовуючи всю транзакцію." },
  { cat: "SQL: Права доступу", sym: "GRANT / REVOKE", en: "Permission control", ua: "Керування правами доступу", langs: "SQL", example: "GRANT SELECT ON users TO analyst;", explain: "Надають чи забирають права на таблицю/базу в конкретного користувача/ролі." },
  { cat: "SQL: CTE", sym: "WITH", en: "Common table expression", ua: "Спільний табличний вираз", langs: "SQL", example: "WITH recent AS (SELECT * FROM orders WHERE date > '2024-01-01')\nSELECT * FROM recent;", explain: "Іменований тимчасовий результат запиту, зручний для розбиття складних запитів на читабельні частини." },
  { cat: "SQL: Віконні функції", sym: "OVER / PARTITION BY", en: "Window function clause", ua: "Секція віконної функції", langs: "SQL", example: "ROW_NUMBER() OVER (PARTITION BY city ORDER BY age)", explain: "OVER перетворює агрегатну функцію на віконну (не схлопує рядки), PARTITION BY групує вікно." },
  { cat: "SQL: Віконні функції", sym: "ROW_NUMBER() / RANK() / DENSE_RANK()", en: "Ranking functions", ua: "Функції рангування", langs: "SQL", example: "RANK() OVER (ORDER BY score DESC)", explain: "Присвоюють порядковий номер/ранг кожному рядку в межах вікна." },
  { cat: "SQL: Віконні функції", sym: "LAG() / LEAD()", en: "Lag/lead functions", ua: "Функції попереднього/наступного рядка", langs: "SQL", example: "LAG(price) OVER (ORDER BY date)", explain: "Повертають значення з попереднього (LAG) чи наступного (LEAD) рядка вікна — зручно для порівняння з попереднім періодом." },
  { cat: "SQL: Умовні вирази", sym: "CASE WHEN THEN ELSE END", en: "Case expression", ua: "Умовний вираз CASE", langs: "SQL", example: "CASE WHEN age < 18 THEN 'дитина' ELSE 'дорослий' END", explain: "SQL-еквівалент if/else всередині запиту." },
  { cat: "SQL: Умовні вирази", sym: "COALESCE() / NULLIF()", en: "Null handling functions", ua: "Функції обробки NULL", langs: "SQL", example: "COALESCE(nickname, name, 'Аноним')", explain: "COALESCE повертає перше не-NULL значення зі списку, NULLIF повертає NULL, якщо два значення рівні." },

  { cat: "SQL: Рядкові функції", sym: "CONCAT() / ||", en: "String concatenation", ua: "З'єднання рядків", langs: "SQL", example: "first_name || ' ' || last_name", explain: "Об'єднують кілька рядків в один; у PostgreSQL || і CONCAT() роблять те саме." },
  { cat: "SQL: Рядкові функції", sym: "UPPER() / LOWER()", en: "Case functions", ua: "Функції регістру", langs: "SQL", example: "UPPER(name)", explain: "Перетворюють рядок у верхній чи нижній регістр." },
  { cat: "SQL: Рядкові функції", sym: "LENGTH() / SUBSTRING()", en: "Length/substring functions", ua: "Функції довжини/підрядка", langs: "SQL", example: "SUBSTRING(name FROM 1 FOR 3)", explain: "Повертають довжину рядка чи його частину." },
  { cat: "SQL: Рядкові функції", sym: "TRIM() / LTRIM() / RTRIM()", en: "Trim functions", ua: "Функції обрізання пробілів", langs: "SQL", example: "TRIM('  text  ')", explain: "Прибирають пробіли з обох країв, зліва чи справа рядка." },
  { cat: "SQL: Числові функції", sym: "ROUND() / CEIL() / FLOOR()", en: "Rounding functions", ua: "Функції округлення", langs: "SQL", example: "ROUND(price, 2)", explain: "Округлюють число до заданої кількості знаків, вгору чи вниз." },
  { cat: "SQL: Числові функції", sym: "ABS() / POWER() / SQRT()", en: "Math functions", ua: "Математичні функції", langs: "SQL", example: "SQRT(area)", explain: "Модуль числа, піднесення до степеня, квадратний корінь." },
  { cat: "SQL: Дата й час", sym: "CURRENT_DATE / CURRENT_TIMESTAMP / NOW()", en: "Current date/time", ua: "Поточна дата/час", langs: "SQL", example: "SELECT NOW();", explain: "Повертають поточну дату чи момент часу на сервері БД." },
  { cat: "SQL: Дата й час", sym: "EXTRACT() / DATE_PART()", en: "Date extraction functions", ua: "Функції витягування дати", langs: "SQL", example: "EXTRACT(YEAR FROM order_date)", explain: "Витягують конкретну частину дати — рік, місяць, день, годину." },
  { cat: "SQL: Дата й час", sym: "DATE_TRUNC()", en: "Date truncation", ua: "Обрізання дати", langs: "SQL", example: "DATE_TRUNC('month', order_date)", explain: "Обрізає дату до вказаної точності — зручно для групування за місяцем/днем." },
  { cat: "SQL: Дата й час", sym: "INTERVAL", en: "Interval type", ua: "Тип інтервалу", langs: "SQL", example: "order_date + INTERVAL '7 days'", explain: "Представляє проміжок часу — можна додавати/віднімати від дат." },
  { cat: "SQL: Приведення типу", sym: "CAST() / ::type", en: "Type casting", ua: "Приведення типу", langs: "SQL", example: "'123'::integer", explain: "Явно перетворюють значення на інший тип даних." },
  { cat: "SQL: PostgreSQL типи", sym: "SERIAL / BIGSERIAL", en: "Auto-increment types", ua: "Типи з автоінкрементом", langs: "PostgreSQL", example: "id SERIAL PRIMARY KEY", explain: "Ціле число, що автоматично збільшується при кожній вставці — типово для первинних ключів." },
  { cat: "SQL: PostgreSQL типи", sym: "INTEGER / BIGINT / SMALLINT", en: "Integer types", ua: "Цілочисельні типи", langs: "PostgreSQL", example: "age INTEGER", explain: "Цілі числа різного розміру діапазону." },
  { cat: "SQL: PostgreSQL типи", sym: "NUMERIC / DECIMAL / REAL", en: "Decimal types", ua: "Дробові типи", langs: "PostgreSQL", example: "price NUMERIC(10, 2)", explain: "Числа з плаваючою чи фіксованою комою — NUMERIC точний, для грошей." },
  { cat: "SQL: PostgreSQL типи", sym: "TEXT / VARCHAR / CHAR", en: "Text types", ua: "Текстові типи", langs: "PostgreSQL", example: "name VARCHAR(100)", explain: "TEXT — необмежений текст, VARCHAR(n) — з обмеженням довжини, CHAR — фіксованої довжини." },
  { cat: "SQL: PostgreSQL типи", sym: "DATE / TIME / TIMESTAMP / TIMESTAMPTZ", en: "Date/time types", ua: "Типи дати й часу", langs: "PostgreSQL", example: "created_at TIMESTAMPTZ", explain: "Зберігають дату, час чи обидва разом; TZ-варіант враховує часовий пояс." },
  { cat: "SQL: PostgreSQL типи", sym: "BOOLEAN", en: "Boolean type", ua: "Логічний тип", langs: "PostgreSQL", example: "active BOOLEAN DEFAULT true", explain: "Зберігає true/false." },
  { cat: "SQL: PostgreSQL типи", sym: "JSON / JSONB", en: "JSON types", ua: "JSON-типи", langs: "PostgreSQL", example: "metadata JSONB", explain: "Зберігають JSON-документ у колонці; JSONB — бінарний, швидший для запитів і індексації." },
  { cat: "SQL: PostgreSQL типи", sym: "UUID", en: "UUID type", ua: "Тип UUID", langs: "PostgreSQL", example: "id UUID DEFAULT gen_random_uuid()", explain: "Універсальний унікальний ідентифікатор — альтернатива SERIAL, не розкриває кількість записів." },
  { cat: "SQL: PostgreSQL типи", sym: "ARRAY", en: "Array type", ua: "Тип масив", langs: "PostgreSQL", example: "tags TEXT[]", explain: "Зберігає масив значень в одній колонці — специфічна можливість PostgreSQL." },

  { cat: "Backend: HTTP методи", sym: "GET", en: "GET method", ua: "Метод GET", langs: "HTTP", example: "GET /users/42", explain: "Отримує дані, не змінюючи стан сервера — найпоширеніший метод." },
  { cat: "Backend: HTTP методи", sym: "POST", en: "POST method", ua: "Метод POST", langs: "HTTP", example: "POST /users", explain: "Створює новий ресурс, відправляє дані в тілі запиту." },
  { cat: "Backend: HTTP методи", sym: "PUT / PATCH", en: "Update methods", ua: "Методи оновлення", langs: "HTTP", example: "PATCH /users/42", explain: "PUT повністю замінює ресурс, PATCH оновлює лише вказані поля." },
  { cat: "Backend: HTTP методи", sym: "DELETE", en: "Delete method", ua: "Метод DELETE", langs: "HTTP", example: "DELETE /users/42", explain: "Видаляє ресурс за вказаною адресою." },
  { cat: "Backend: HTTP статуси", sym: "200 / 201 / 204", en: "Success status codes", ua: "Коди успіху", langs: "HTTP", example: "201 Created", explain: "200 — успіх, 201 — успішно створено, 204 — успіх без вмісту у відповіді." },
  { cat: "Backend: HTTP статуси", sym: "301 / 302 / 304", en: "Redirect status codes", ua: "Коди перенаправлення", langs: "HTTP", example: "301 Moved Permanently", explain: "301 — постійне перенаправлення, 302 — тимчасове, 304 — вміст не змінився (кеш)." },
  { cat: "Backend: HTTP статуси", sym: "400 / 401 / 403", en: "Client error codes", ua: "Коди помилок клієнта", langs: "HTTP", example: "401 Unauthorized", explain: "400 — невірний запит, 401 — не авторизований, 403 — доступ заборонено." },
  { cat: "Backend: HTTP статуси", sym: "404 / 409 / 422", en: "More client error codes", ua: "Ще коди помилок клієнта", langs: "HTTP", example: "404 Not Found", explain: "404 — не знайдено, 409 — конфлікт стану, 422 — дані не пройшли валідацію." },
  { cat: "Backend: HTTP статуси", sym: "429", en: "Too many requests", ua: "Забагато запитів", langs: "HTTP", example: "429 Too Many Requests", explain: "Клієнт перевищив ліміт запитів (rate limiting)." },
  { cat: "Backend: HTTP статуси", sym: "500 / 502 / 503", en: "Server error codes", ua: "Коди помилок сервера", langs: "HTTP", example: "500 Internal Server Error", explain: "500 — внутрішня помилка сервера, 502 — поганий шлюз, 503 — сервіс недоступний." },
  { cat: "Backend: HTTP заголовки", sym: "Content-Type", en: "Content type header", ua: "Заголовок типу вмісту", langs: "HTTP", example: "Content-Type: application/json", explain: "Вказує формат тіла запиту/відповіді." },
  { cat: "Backend: HTTP заголовки", sym: "Authorization", en: "Authorization header", ua: "Заголовок авторизації", langs: "HTTP", example: "Authorization: Bearer <token>", explain: "Передає токен/облікові дані для автентифікації запиту." },
  { cat: "Backend: HTTP заголовки", sym: "Cache-Control", en: "Cache control header", ua: "Заголовок керування кешем", langs: "HTTP", example: "Cache-Control: no-cache", explain: "Керує кешуванням відповіді браузером і проміжними серверами." },
  { cat: "Backend: HTTP заголовки", sym: "Access-Control-Allow-Origin", en: "CORS header", ua: "Заголовок CORS", langs: "HTTP", example: "Access-Control-Allow-Origin: *", explain: "Дозволяє браузеру робити крос-доменні запити до цього сервера." },
  { cat: "Backend: API", sym: "REST", en: "REST architecture", ua: "Архітектура REST", langs: "Backend", example: "GET /api/users/42", explain: "Архітектурний стиль API через HTTP-методи й ресурси, ідентифіковані URL." },
  { cat: "Backend: API", sym: "GraphQL", en: "GraphQL query language", ua: "Мова запитів GraphQL", langs: "Backend", example: "{ user(id: 1) { name email } }", explain: "Клієнт сам описує, які саме поля даних йому потрібні, в одному запиті." },
  { cat: "Backend: API", sym: "WebSocket", en: "WebSocket protocol", ua: "Протокол WebSocket", langs: "Backend", example: "new WebSocket('wss://...')", explain: "Постійне двостороннє з'єднання для обміну даними в реальному часі (чати, ігри)." },
  { cat: "Backend: API", sym: "Webhook", en: "Webhook", ua: "Вебхук", langs: "Backend", example: "POST https://mysite.com/webhook", explain: "Сервер сам відправляє HTTP-запит іншому сервісу, коли трапляється подія." },

  { cat: "Backend: Node.js", sym: "require() / module.exports", en: "CommonJS modules", ua: "Модулі CommonJS", langs: "Node.js", example: "module.exports = router;", explain: "Старіша система модулів Node.js для підключення й експорту коду між файлами." },
  { cat: "Backend: Node.js", sym: "process.env", en: "Environment variables", ua: "Змінні середовища", langs: "Node.js", example: "process.env.PORT", explain: "Доступ до змінних середовища — конфігурації, секретів, що не повинні бути в коді." },
  { cat: "Backend: Node.js", sym: "fs / path", en: "Filesystem/path modules", ua: "Модулі файлової системи/шляхів", langs: "Node.js", example: "fs.readFileSync('data.json');", explain: "Вбудовані модулі для роботи з файлами й побудови коректних шляхів." },
  { cat: "Backend: Express", sym: "app.get() / app.post()", en: "Express route methods", ua: "Методи маршрутів Express", langs: "Node.js", example: "app.get('/users', (req, res) => { });", explain: "Реєструють обробник для запитів певного HTTP-методу на вказаному шляху." },
  { cat: "Backend: Express", sym: "req / res", en: "Request/response objects", ua: "Об'єкти запиту/відповіді", langs: "Node.js", example: "res.json({ ok: true });", explain: "req містить дані вхідного запиту, res — методи для формування відповіді." },
  { cat: "Backend: Express", sym: "req.params / req.query / req.body", en: "Request data sources", ua: "Джерела даних запиту", langs: "Node.js", example: "const { id } = req.params;", explain: "params — частини URL (/users/:id), query — параметри після ?, body — дані з тіла запиту." },
  { cat: "Backend: Express", sym: "res.json() / res.status()", en: "Response methods", ua: "Методи відповіді", langs: "Node.js", example: "res.status(404).json({ error: 'Not found' });", explain: "Відправляють JSON-відповідь і задають HTTP-код статусу." },
  { cat: "Backend: Express", sym: "middleware / next()", en: "Middleware pattern", ua: "Патерн middleware", langs: "Node.js", example: "app.use((req, res, next) => { next(); });", explain: "Функція, що обробляє запит перед основним обробником і передає керування далі через next()." },
  { cat: "Backend: Автентифікація", sym: "JWT (JSON Web Token)", en: "JWT", ua: "JSON Web Token", langs: "Backend", example: "Authorization: Bearer eyJhbGc...", explain: "Самодостатній підписаний токен для передачі перевіреної інформації про користувача без сесії на сервері." },
  { cat: "Backend: Автентифікація", sym: "OAuth 2.0", en: "OAuth protocol", ua: "Протокол OAuth", langs: "Backend", example: "—", explain: "Стандартний протокол делегованої авторизації — вхід через Google/GitHub без передачі пароля сайту." },
  { cat: "Backend: Автентифікація", sym: "session / cookie", en: "Session-based auth", ua: "Автентифікація через сесії", langs: "Backend", example: "Set-Cookie: sessionId=abc123", explain: "Сервер зберігає стан сесії, клієнт лише передає ідентифікатор через cookie." },
  { cat: "Backend: Безпека паролів", sym: "bcrypt / argon2", en: "Password hashing", ua: "Хешування паролів", langs: "Backend", example: "bcrypt.hash(password, 10);", explain: "Односторонньо хешують паролі перед збереженням у БД — навіть при витоку бази паролі неможливо відновити напряму." },
  { cat: "Backend: Безпека", sym: "CORS", en: "Cross-origin resource sharing", ua: "Обмін ресурсами між доменами", langs: "Backend", example: "app.use(cors());", explain: "Механізм, що дозволяє чи забороняє браузеру робити запити з одного домену до API іншого." },
  { cat: "Backend: Безпека", sym: "CSRF / XSS", en: "Common web vulnerabilities", ua: "Поширені веб-вразливості", langs: "Backend", example: "—", explain: "CSRF — підроблений запит від імені авторизованого користувача, XSS — впровадження шкідливого скрипта на сторінку." },
  { cat: "Backend: Безпека", sym: "Rate Limiting", en: "Rate limiting", ua: "Обмеження частоти запитів", langs: "Backend", example: "express-rate-limit", explain: "Обмежує кількість запитів від одного клієнта за проміжок часу — захист від зловживань і DDoS." },

  { cat: "Backend: Бази даних", sym: "SQL / NoSQL", en: "Database paradigms", ua: "Парадигми баз даних", langs: "Backend", example: "—", explain: "SQL — реляційні бази з таблицями й строгою схемою, NoSQL — документні/ключ-значення бази з гнучкою структурою." },
  { cat: "Backend: Бази даних", sym: "PostgreSQL / MySQL", en: "Relational databases", ua: "Реляційні бази даних", langs: "Backend", example: "psql -U user -d mydb", explain: "Найпопулярніші відкриті реляційні СУБД." },
  { cat: "Backend: Бази даних", sym: "MongoDB", en: "MongoDB", ua: "MongoDB", langs: "Backend", example: "db.users.find({ age: { $gt: 18 } });", explain: "Документна NoSQL-база, зберігає дані як JSON-подібні документи." },
  { cat: "Backend: Бази даних", sym: "Redis", en: "Redis", ua: "Redis", langs: "Backend", example: "SET key value EX 60", explain: "База даних ключ-значення в оперативній пам'яті — для кешування, сесій, черг." },
  { cat: "Backend: ORM", sym: "ORM (Object-Relational Mapping)", en: "ORM concept", ua: "Концепція ORM", langs: "Backend", example: "User.findAll();", explain: "Дозволяє працювати з БД через об'єкти й методи коду замість написання сирого SQL." },
  { cat: "Backend: ORM", sym: "Prisma / Sequelize / TypeORM", en: "Node.js ORMs", ua: "ORM для Node.js", langs: "Node.js", example: "await prisma.user.create({ data: { name: 'Оля' } });", explain: "Найпоширеніші ORM-бібліотеки для роботи з БД у Node.js-проєктах." },
  { cat: "Backend: ORM", sym: "SQLAlchemy", en: "SQLAlchemy ORM", ua: "SQLAlchemy для Python", langs: "Python", example: "session.query(User).filter_by(id=1).first()", explain: "Найпоширеніший ORM для Python, використовується в Flask/FastAPI-проєктах." },
  { cat: "Backend: Черги", sym: "RabbitMQ / Kafka", en: "Message queues", ua: "Черги повідомлень", langs: "Backend", example: "—", explain: "Дозволяють сервісам обмінюватись повідомленнями асинхронно, не чекаючи одразу на відповідь." },
  { cat: "Backend: Кешування", sym: "Cache-Control / TTL", en: "Caching concepts", ua: "Концепції кешування", langs: "Backend", example: "Cache-Control: max-age=3600", explain: "TTL (time to live) визначає, скільки часу кешоване значення лишається дійсним." },
  { cat: "Backend: Сервери", sym: "Nginx / Apache", en: "Web servers", ua: "Веб-сервери", langs: "Backend", example: "nginx.conf", explain: "Обробляють HTTP-запити, часто як reverse proxy перед застосунком і для роздачі статичних файлів." },
  { cat: "DevOps: Docker", sym: "Dockerfile", en: "Dockerfile", ua: "Dockerfile", langs: "DevOps", example: "FROM node:20\nCOPY . .\nRUN npm install\nCMD [\"npm\", \"start\"]", explain: "Опис того, як зібрати образ контейнера для застосунку крок за кроком." },
  { cat: "DevOps: Docker", sym: "docker build / docker run", en: "Docker commands", ua: "Команди Docker", langs: "DevOps", example: "docker run -p 3000:3000 myapp", explain: "build збирає образ з Dockerfile, run запускає контейнер із нього." },
  { cat: "DevOps: Docker", sym: "docker-compose", en: "Docker Compose", ua: "Docker Compose", langs: "DevOps", example: "docker-compose up", explain: "Запускає й керує кількома пов'язаними контейнерами (застосунок + БД + кеш) одним файлом конфігурації." },
  { cat: "DevOps: CI/CD", sym: "CI/CD", en: "Continuous integration/deployment", ua: "Безперервна інтеграція/доставка", langs: "DevOps", example: "—", explain: "Автоматичне тестування (CI) і розгортання (CD) коду при кожній зміні в репозиторії." },
  { cat: "DevOps: CI/CD", sym: "GitHub Actions", en: "GitHub Actions", ua: "GitHub Actions", langs: "DevOps", example: ".github/workflows/ci.yml", explain: "Вбудований у GitHub інструмент автоматизації — запускає тести, збірку, деплой при push/PR." },
  { cat: "DevOps: Деплой", sym: "Vercel / Netlify", en: "Frontend hosting platforms", ua: "Платформи хостингу фронтенду", langs: "DevOps", example: "vercel deploy", explain: "Хмарні платформи для швидкого деплою фронтенд-застосунків прямо з git-репозиторію." },
  { cat: "DevOps: Деплой", sym: "AWS / Azure / Google Cloud", en: "Cloud providers", ua: "Хмарні провайдери", langs: "DevOps", example: "—", explain: "Найбільші хмарні платформи для розміщення будь-якої backend-інфраструктури." },

  { cat: "Git", sym: "git init / git clone", en: "Repo creation commands", ua: "Команди створення репозиторію", langs: "Git", example: "git clone https://github.com/user/repo.git", explain: "init створює новий репозиторій, clone копіює існуючий з віддаленого сервера." },
  { cat: "Git", sym: "git status", en: "Status command", ua: "Команда статусу", langs: "Git", example: "git status", explain: "Показує стан робочої директорії — які файли змінені, додані, не відстежуються." },
  { cat: "Git", sym: "git add", en: "Add command", ua: "Команда додавання", langs: "Git", example: "git add file.js", explain: "Додає зміни у файлі до індексу (staging area) перед комітом." },
  { cat: "Git", sym: "git commit", en: "Commit command", ua: "Команда коміту", langs: "Git", example: "git commit -m 'Опис змін'", explain: "Зберігає проіндексовані зміни як новий знімок історії з повідомленням." },
  { cat: "Git", sym: "git push / git pull", en: "Push/pull commands", ua: "Команди відправки/отримання", langs: "Git", example: "git push origin main", explain: "push відправляє локальні коміти на віддалений сервер, pull забирає й зливає зміни звідти." },
  { cat: "Git", sym: "git fetch", en: "Fetch command", ua: "Команда отримання без злиття", langs: "Git", example: "git fetch origin", explain: "Забирає зміни з віддаленого репозиторію, не зливаючи їх автоматично (на відміну від pull)." },
  { cat: "Git", sym: "git branch", en: "Branch command", ua: "Команда гілок", langs: "Git", example: "git branch feature-x", explain: "Показує список гілок чи створює нову." },
  { cat: "Git", sym: "git checkout / git switch", en: "Switch branch commands", ua: "Команди перемикання гілки", langs: "Git", example: "git switch feature-x", explain: "Перемикають робочу директорію на іншу гілку чи коміт." },
  { cat: "Git", sym: "git merge", en: "Merge command", ua: "Команда злиття", langs: "Git", example: "git merge feature-x", explain: "Зливає зміни з іншої гілки в поточну, зберігаючи повну історію." },
  { cat: "Git", sym: "git rebase", en: "Rebase command", ua: "Команда перебазування", langs: "Git", example: "git rebase main", explain: "Переносить коміти поточної гілки на нову базу, створюючи лінійну історію." },
  { cat: "Git", sym: "git log / git diff", en: "History/diff commands", ua: "Команди історії/різниці", langs: "Git", example: "git log --oneline", explain: "log показує історію комітів, diff — конкретні зміни в рядках коду." },
  { cat: "Git", sym: "git reset", en: "Reset command", ua: "Команда скидання", langs: "Git", example: "git reset --hard HEAD~1", explain: "Переміщує поточну гілку назад до вказаного коміту, з опціональним скиданням змін у файлах." },
  { cat: "Git", sym: "git stash", en: "Stash command", ua: "Команда тимчасового сховища", langs: "Git", example: "git stash", explain: "Тимчасово відкладає незакомічені зміни, щоб повернутись до чистої робочої директорії." },
  { cat: "Git", sym: "git remote", en: "Remote command", ua: "Команда віддаленого репозиторію", langs: "Git", example: "git remote add origin <url>", explain: "Керує посиланнями на віддалені репозиторії." },
  { cat: "Git", sym: ".gitignore", en: "Gitignore file", ua: "Файл виключень git", langs: "Git", example: "node_modules/\n.env", explain: "Список файлів і папок, які git не повинен відстежувати." },
  { cat: "GitHub", sym: "Pull Request", en: "Pull request", ua: "Запит на злиття", langs: "GitHub", example: "—", explain: "Пропозиція злити зміни з однієї гілки в іншу, з можливістю рев'ю коду перед прийняттям." },
  { cat: "GitHub", sym: "Issue", en: "Issue tracker item", ua: "Задача/баг-репорт", langs: "GitHub", example: "—", explain: "Запис для відстеження задач, багів чи пропозицій у репозиторії." },
  { cat: "GitHub", sym: "Fork", en: "Fork repository", ua: "Форк репозиторію", langs: "GitHub", example: "—", explain: "Особиста копія чужого репозиторію для внесення змін без прямого доступу до оригіналу." },
  { cat: "GitHub", sym: "GitHub Actions", en: "GitHub Actions workflow", ua: "Робочий процес GitHub Actions", langs: "GitHub", example: "on: push", explain: "Автоматизує тести, збірку й деплой при подіях у репозиторії (push, pull request)." },

  { cat: "Термінал/Linux", sym: "pwd / cd", en: "Navigation commands", ua: "Команди навігації", langs: "Linux", example: "cd projects/app", explain: "pwd показує поточну директорію, cd переходить в іншу." },
  { cat: "Термінал/Linux", sym: "ls", en: "List directory", ua: "Список файлів", langs: "Linux", example: "ls -la", explain: "Показує вміст директорії; -la показує все, включно з прихованими файлами, у детальному форматі." },
  { cat: "Термінал/Linux", sym: "mkdir / touch", en: "Create commands", ua: "Команди створення", langs: "Linux", example: "mkdir new-folder", explain: "mkdir створює директорію, touch — порожній файл." },
  { cat: "Термінал/Linux", sym: "cp / mv", en: "Copy/move commands", ua: "Команди копіювання/переміщення", langs: "Linux", example: "cp file.txt backup/", explain: "cp копіює файл/папку, mv переміщує чи перейменовує." },
  { cat: "Термінал/Linux", sym: "rm", en: "Remove command", ua: "Команда видалення", langs: "Linux", example: "rm -rf old-folder", explain: "Видаляє файли; -r для директорій рекурсивно, -f без підтвердження (обережно!)." },
  { cat: "Термінал/Linux", sym: "cat / less / head / tail", en: "File view commands", ua: "Команди перегляду файлу", langs: "Linux", example: "tail -f log.txt", explain: "cat виводить весь файл, less — з прокруткою, head/tail — перші/останні рядки." },
  { cat: "Термінал/Linux", sym: "grep", en: "Grep command", ua: "Команда пошуку тексту", langs: "Linux", example: "grep 'error' log.txt", explain: "Шукає рядки, що відповідають шаблону, у файлах чи виводі команди." },
  { cat: "Термінал/Linux", sym: "find", en: "Find command", ua: "Команда пошуку файлів", langs: "Linux", example: "find . -name '*.js'", explain: "Шукає файли й директорії за іменем, типом чи іншими критеріями." },
  { cat: "Термінал/Linux", sym: "chmod / chown", en: "Permission commands", ua: "Команди прав доступу", langs: "Linux", example: "chmod +x script.sh", explain: "chmod змінює права доступу до файлу, chown — власника." },
  { cat: "Термінал/Linux", sym: "sudo", en: "Sudo command", ua: "Команда підвищення прав", langs: "Linux", example: "sudo apt install curl", explain: "Виконує команду з правами адміністратора (root)." },
  { cat: "Термінал/Linux", sym: "curl / wget", en: "Download commands", ua: "Команди завантаження", langs: "Linux", example: "curl -O https://example.com/file.zip", explain: "Виконують HTTP-запити з командного рядка чи завантажують файли." },
  { cat: "Термінал/Linux", sym: "ssh / scp", en: "Remote connection commands", ua: "Команди віддаленого з'єднання", langs: "Linux", example: "ssh user@server.com", explain: "ssh підключається до віддаленого сервера, scp копіює файли через таке з'єднання." },
  { cat: "Термінал/Linux", sym: "ps / kill / top", en: "Process management commands", ua: "Команди керування процесами", langs: "Linux", example: "kill -9 1234", explain: "ps показує процеси, kill завершує за id, top показує їх у реальному часі з використанням ресурсів." },
  { cat: "Термінал/Linux", sym: "tar / zip / unzip", en: "Archive commands", ua: "Команди архівації", langs: "Linux", example: "tar -xzf archive.tar.gz", explain: "Створюють і розпаковують архіви файлів." },
  { cat: "Термінал/Linux", sym: "env / export", en: "Environment commands", ua: "Команди середовища", langs: "Linux", example: "export PATH=$PATH:/new/dir", explain: "env показує змінні середовища, export задає нову змінну для поточної сесії." },
  { cat: "Full Stack: Архітектура", sym: "Client-Server", en: "Client-server model", ua: "Модель клієнт-сервер", langs: "Full Stack", example: "—", explain: "Браузер (клієнт) надсилає запити серверу, сервер обробляє й повертає дані." },
  { cat: "Full Stack: Архітектура", sym: "Frontend ↔ Backend ↔ Database", en: "Full stack layers", ua: "Шари повного стеку", langs: "Full Stack", example: "—", explain: "Класична схема: інтерфейс користувача → серверна логіка й API → зберігання даних." },
  { cat: "Full Stack: Архітектура", sym: "Microservices", en: "Microservices architecture", ua: "Мікросервісна архітектура", langs: "Full Stack", example: "—", explain: "Розбиває застосунок на незалежні маленькі сервіси замість одного великого (моноліту)." },
  { cat: "Full Stack: Архітектура", sym: "Load Balancing", en: "Load balancing", ua: "Балансування навантаження", langs: "Full Stack", example: "—", explain: "Розподіляє вхідні запити між кількома серверами для стабільності й швидкодії." },
  { cat: "Full Stack: Середовище", sym: ".env", en: "Environment file", ua: "Файл змінних середовища", langs: "Full Stack", example: "DATABASE_URL=postgres://...", explain: "Зберігає конфігурацію й секрети окремо від коду, не потрапляє в git (додається в .gitignore)." },

];

const LIBRARY_HTML = [
  { name: "<a>", desc: "Посилання на інший ресурс.", syntax: '<a href="url">текст</a>', attrs: "href, target", pitfalls: "Забутий href — посилання нікуди не веде." },
  { name: "<div>", desc: "Універсальний блоковий контейнер.", syntax: "<div>...</div>", attrs: "class, id", pitfalls: "Зловживання div замість семантичних тегів." },
  { name: "<span>", desc: "Універсальний рядковий контейнер.", syntax: "<span>...</span>", attrs: "class, id", pitfalls: "Використання замість div там, де потрібен блоковий елемент." },
  { name: "<p>", desc: "Абзац тексту.", syntax: "<p>...</p>", attrs: "class", pitfalls: "Вкладання блокових елементів (наприклад div) усередину p — недопустимо." },
  { name: "<h1>–<h6>", desc: "Заголовки шести рівнів важливості.", syntax: "<h1>...</h1>", attrs: "class", pitfalls: "Пропуск рівнів (h1 одразу в h4) ламає структуру для скрінрідерів." },
  { name: "<img>", desc: "Зображення. Самозакривний тег.", syntax: '<img src="..." alt="...">', attrs: "src, alt, width, height", pitfalls: "Відсутній alt — проблема з доступністю та SEO.", guide: "html-img" },
  { name: "<button>", desc: "Кнопка дії.", syntax: "<button>...</button>", attrs: "type, disabled", pitfalls: "type за замовчуванням submit — усередині <form> може випадково відправити форму." },
  { name: "<form>", desc: "Контейнер для елементів вводу даних.", syntax: '<form action="..." method="post">...</form>', attrs: "action, method", pitfalls: "Забутий method — за замовчуванням GET, дані потраплять в URL.", guide: "html-form" },
  { name: "<input>", desc: "Поле вводу.", syntax: '<input type="text">', attrs: "type, name, value, placeholder", pitfalls: "Немає прив'язаного label — гірша доступність.", guide: "html-input" },
  { name: "<label>", desc: "Підпис до поля форми.", syntax: '<label for="id">...</label>', attrs: "for", pitfalls: "for не збігається з id відповідного input.", guide: "html-label" },
  { name: "<ul> / <ol> / <li>", desc: "Маркований / нумерований список і пункт списку.", syntax: "<ul><li>...</li></ul>", attrs: "class", pitfalls: "li поза ul/ol не має сенсу.", guide: "html-list" },
  { name: "<header>", desc: "Шапка сторінки або секції.", syntax: "<header>...</header>", attrs: "class", pitfalls: "Плутають з <head> (службовою частиною документа) — це різні теги.", guide: "html-header" },
  { name: "<nav>", desc: "Блок навігаційних посилань.", syntax: "<nav>...</nav>", attrs: "class", pitfalls: "Використання nav для будь-якого списку посилань, а не лише навігації.", guide: "html-nav" },
  { name: "<main>", desc: "Головний унікальний вміст сторінки. Має бути один на сторінку.", syntax: "<main>...</main>", attrs: "class", pitfalls: "Кілька <main> на одній сторінці — помилка розмітки.", guide: "html-main" },
  { name: "<footer>", desc: "Підвал сторінки або секції.", syntax: "<footer>...</footer>", attrs: "class", pitfalls: "—", guide: "html-footer" },
  { name: "<section>", desc: "Тематична секція вмісту, зазвичай із власним заголовком.", syntax: "<section>...</section>", attrs: "class", pitfalls: "Використання замість div без тематичного сенсу.", guide: "html-section" },
  { name: "<article>", desc: "Самодостатній блок вмісту (пост, картка товару, коментар).", syntax: "<article>...</article>", attrs: "class", pitfalls: "—" },
  { name: "<aside>", desc: "Побічний вміст: бічна панель, реклама, пов'язані посилання.", syntax: "<aside>...</aside>", attrs: "class", pitfalls: "—" },
  { name: "<select> / <option>", desc: "Випадний список вибору.", syntax: "<select><option>А</option></select>", attrs: "multiple, disabled, name", pitfalls: "—" },
  { name: "<textarea>", desc: "Багаторядкове текстове поле.", syntax: "<textarea rows=\"4\"></textarea>", attrs: "rows, cols, maxlength, placeholder", pitfalls: "Початковий текст пишеться між тегами, а не через value." },
  { name: "<table> / <tr> / <td> / <th>", desc: "Таблиця, рядок, звичайна й заголовкова комірка.", syntax: "<table><tr><th>А</th><td>1</td></tr></table>", attrs: "colspan, rowspan", pitfalls: "Використання таблиць для верстки сторінки замість даних." },
  { name: "<video> / <audio>", desc: "Відео- та аудіоплеєр з елементами керування.", syntax: '<video src="a.mp4" controls></video>', attrs: "controls, autoplay, loop, muted", pitfalls: "autoplay без muted блокується більшістю браузерів." },
  { name: "<iframe>", desc: "Вбудовує іншу сторінку всередину поточної.", syntax: '<iframe src="url"></iframe>', attrs: "src, width, height, sandbox", pitfalls: "Без sandbox вбудована сторінка має повний доступ до можливостей браузера." },
  { name: "<svg>", desc: "Векторна графіка прямо в HTML.", syntax: '<svg viewBox="0 0 100 100">...</svg>', attrs: "viewBox, width, height", pitfalls: "—" },
  { name: "<canvas>", desc: "Полотно для малювання через JavaScript.", syntax: "<canvas id=\"c\"></canvas>", attrs: "width, height", pitfalls: "Сам по собі порожній — малювання відбувається лише через JS." },
  { name: "<details> / <summary>", desc: "Розкривний блок «показати ще» без JavaScript.", syntax: "<details><summary>Заголовок</summary>Текст</details>", attrs: "open", pitfalls: "—" },
  { name: "<figure> / <figcaption>", desc: "Ілюстрація (зображення, код, діаграма) з підписом.", syntax: "<figure><img src=\"x.jpg\"><figcaption>Підпис</figcaption></figure>", attrs: "class", pitfalls: "—" },
  { name: "<blockquote> / <cite>", desc: "Розгорнута цитата й посилання на її джерело.", syntax: "<blockquote>Текст<cite>Автор</cite></blockquote>", attrs: "cite (URL джерела)", pitfalls: "—" },
  { name: "<time>", desc: "Дата/час у форматі, зрозумілому і людині, і машині.", syntax: '<time datetime="2026-09-16">16 вересня</time>', attrs: "datetime", pitfalls: "—" },
  { name: "<meta>", desc: "Метадані сторінки: кодування, viewport, опис для пошуковиків.", syntax: '<meta name="viewport" content="width=device-width, initial-scale=1">', attrs: "charset, name, content", pitfalls: "Забутий viewport ламає вигляд на мобільних." },
  { name: "<link>", desc: "Підключає зовнішній ресурс (CSS-файл, іконку, шрифт).", syntax: '<link rel="stylesheet" href="style.css">', attrs: "rel, href, type", pitfalls: "—" },
  { name: "<dialog>", desc: "Вбудоване модальне чи звичайне діалогове вікно.", syntax: "<dialog open>Текст</dialog>", attrs: "open", pitfalls: "Без атрибута open і без showModal() з JS діалог невидимий." },
  { name: "<picture>", desc: "Різні версії зображення для різних розмірів екрана.", syntax: '<picture><source srcset="big.jpg" media="(min-width: 800px)"><img src="small.jpg"></picture>', attrs: "srcset, media", pitfalls: "img усередині обов'язковий як запасний варіант." },
  { name: "<progress>", desc: "Візуальний індикатор прогресу виконання задачі.", syntax: '<progress value="70" max="100"></progress>', attrs: "value, max", pitfalls: "Без value — індетермінований (анімація очікування)." },
  { name: "<meter>", desc: "Вимірювальна шкала для відомого діапазону (не прогрес).", syntax: '<meter value="6" min="0" max="10"></meter>', attrs: "value, min, max, low, high, optimum", pitfalls: "Не для показу процесу завантаження — для цього є <progress>." },
  { name: "<fieldset> / <legend>", desc: "Групує пов'язані поля форми під спільним підписом.", syntax: "<fieldset><legend>Адреса</legend>...</fieldset>", attrs: "disabled", pitfalls: "—" },
  { name: "<datalist>", desc: "Список підказок автодоповнення для input.", syntax: '<input list="opts"><datalist id="opts"><option value="Київ"></datalist>', attrs: "id (зв'язується через list у input)", pitfalls: "—" },
  { name: "<output>", desc: "Показує результат обчислення чи дії форми.", syntax: '<output name="result">42</output>', attrs: "for, name", pitfalls: "—" },
  { name: "<abbr>", desc: "Абревіатура чи скорочення з розшифровкою в підказці.", syntax: '<abbr title="HyperText Markup Language">HTML</abbr>', attrs: "title", pitfalls: "—" },
  { name: "<address>", desc: "Контактна інформація автора сторінки чи статті.", syntax: "<address>Пишіть: mail@example.com</address>", attrs: "class", pitfalls: "Не для довільних поштових адрес — лише для контактів." },
  { name: "<code> / <pre>", desc: "Фрагмент коду та блок з коду зі збереженими пробілами/переносами.", syntax: "<pre><code>function f() {}</code></pre>", attrs: "class", pitfalls: "code без pre не зберігає переноси рядків." },
  { name: "data-* атрибути", desc: "Власні дані на елементі для JS, без впливу на вигляд.", syntax: '<div data-user-id="42">', attrs: "будь-яке ім'я після data-", pitfalls: "Читаються в JS через el.dataset.userId (camelCase)." },
];

const LIBRARY_CSS = [
  { name: "margin", desc: "Зовнішній відступ від сусідніх елементів.", syntax: "margin: 10px;", attrs: "top/right/bottom/left окремо або скорочено", pitfalls: "Плутають з padding." },
  { name: "padding", desc: "Внутрішній відступ між вмістом і рамкою елемента.", syntax: "padding: 10px;", attrs: "top/right/bottom/left", pitfalls: "—" },
  { name: "width / height", desc: "Ширина та висота елемента.", syntax: "width: 200px;", attrs: "px, %, em, rem, vw/vh", pitfalls: "За замовчуванням не враховує padding/border (box-sizing: content-box)." },
  { name: "display", desc: "Тип відображення елемента: block, inline, flex, grid, none.", syntax: "display: flex;", attrs: "block, inline, flex, grid, none", pitfalls: "display: none повністю прибирає елемент з розмітки (не те саме, що visibility: hidden)." },
  { name: "position", desc: "Спосіб позиціонування: static, relative, absolute, fixed, sticky.", syntax: "position: relative;", attrs: "static, relative, absolute, fixed, sticky", pitfalls: "absolute без relative-батька позиціонується відносно всієї сторінки." },
  { name: "color", desc: "Колір тексту.", syntax: "color: #1d4ed8;", attrs: "назва, hex, rgb, hsl", pitfalls: "Плутають з background-color." },
  { name: "background", desc: "Фон елемента (колір, картинка тощо).", syntax: "background: #f5f5f5;", attrs: "background-color, background-image", pitfalls: "—" },
  { name: "font-size", desc: "Розмір шрифту.", syntax: "font-size: 16px;", attrs: "px, em, rem, %", pitfalls: "rem відносно кореня документа, em — відносно батька; легко переплутати." },
  { name: "border", desc: "Рамка навколо елемента.", syntax: "border: 1px solid #ccc;", attrs: "ширина, стиль, колір", pitfalls: "—" },
  { name: "border-radius", desc: "Заокруглення кутів.", syntax: "border-radius: 8px;", attrs: "px, %", pitfalls: "50% на квадратному елементі дає коло." },
  { name: "flex", desc: "display: flex вмикає гнучкий контейнер для дочірніх елементів.", syntax: "display: flex; gap: 8px;", attrs: "justify-content, align-items, gap", pitfalls: "flex стосується прямих дітей, а не всіх нащадків.", guide: "css-flexbox" },
  { name: "grid", desc: "display: grid вмикає сітковий контейнер.", syntax: "display: grid; grid-template-columns: 1fr 1fr;", attrs: "grid-template-columns/rows, gap", pitfalls: "—" },
  { name: "gap", desc: "Відступ між елементами у flex/grid-контейнері.", syntax: "gap: 12px;", attrs: "px", pitfalls: "Не працює без display: flex або grid." },
  { name: "media query", desc: "Умовні стилі залежно від розміру екрана.", syntax: "@media (max-width: 600px) { ... }", attrs: "max-width, min-width", pitfalls: "Порядок правил має значення — пізніше правило перекриває раніше." },
  { name: "justify-content / align-items", desc: "Вирівнювання елементів у flex/grid-контейнері.", syntax: "justify-content: center; align-items: center;", attrs: "flex-start, center, space-between...", pitfalls: "justify — по головній осі, align — по поперечній; легко переплутати при flex-direction: column." },
  { name: "transition", desc: "Плавна анімація зміни властивості (напр. на :hover).", syntax: "transition: background-color 0.3s ease;", attrs: "властивість, тривалість, timing-function, затримка", pitfalls: "Без вказаної властивості transition: all анімує геть усе — важче для продуктивності." },
  { name: "transform", desc: "Зсув, поворот або масштабування елемента без впливу на layout.", syntax: "transform: rotate(15deg) scale(1.1);", attrs: "translate(), rotate(), scale(), skew()", pitfalls: "—" },
  { name: "z-index", desc: "Порядок нашарування елементів, що перекриваються.", syntax: "z-index: 10;", attrs: "будь-яке ціле число", pitfalls: "Працює лише коли position не static." },
  { name: "opacity", desc: "Прозорість усього елемента (0 — невидимий, 1 — повністю видимий).", syntax: "opacity: 0.5;", attrs: "0 до 1", pitfalls: "На відміну від display: none, елемент лишається клікабельним." },
  { name: "box-shadow", desc: "Тінь навколо елемента.", syntax: "box-shadow: 0 4px 12px rgba(0,0,0,0.2);", attrs: "зсув X, зсув Y, розмиття, колір", pitfalls: "—" },
  { name: "overflow", desc: "Що робити з вмістом, який не вміщається в елемент.", syntax: "overflow: auto;", attrs: "visible, hidden, scroll, auto", pitfalls: "overflow: hidden іноді ховає потрібний вміст (напр. тінь дочірнього елемента)." },
  { name: "line-height", desc: "Висота рядка тексту — впливає на читабельність.", syntax: "line-height: 1.5;", attrs: "без одиниці (множник), px, %", pitfalls: "—" },
  { name: "text-align", desc: "Горизонтальне вирівнювання тексту всередині елемента.", syntax: "text-align: center;", attrs: "left, right, center, justify", pitfalls: "—" },
  { name: "box-sizing", desc: "Чи входять padding/border у вказану width.", syntax: "box-sizing: border-box;", attrs: "content-box (за замовч.), border-box", pitfalls: "Багато хто ставить * { box-sizing: border-box; } глобально на початку проєкту." },
  { name: "cursor", desc: "Вигляд курсора миші над елементом.", syntax: "cursor: pointer;", attrs: "pointer, default, not-allowed, grab", pitfalls: "Забутий cursor: pointer на клікабельному div — виглядає не інтерактивним." },
  { name: "content", desc: "Вставляє вміст через ::before / ::after (лише для псевдоелементів).", syntax: "content: '→';", attrs: "текст, attr(), лічильники", pitfalls: "Без content ::before/::after не рендериться взагалі." },
  { name: "flex-direction", desc: "Напрямок, у якому вишиковуються елементи flex-контейнера.", syntax: "flex-direction: column;", attrs: "row, row-reverse, column, column-reverse", pitfalls: "При column: justify-content керує вертикаллю, align-items — горизонталлю (осі міняються місцями)." },
  { name: "align-self", desc: "Перевизначає align-items для одного конкретного елемента.", syntax: "align-self: flex-end;", attrs: "auto, flex-start, center, stretch", pitfalls: "Працює лише на дітях flex/grid-контейнера." },
  { name: "grid-template-areas", desc: "Іменує ділянки сітки текстовою «картою» — дуже наочно.", syntax: 'grid-template-areas: "header header" "sidebar content";', attrs: "рядки в лапках", pitfalls: "Кількість слів у кожному рядку має збігатись із кількістю колонок." },
  { name: ":not() / :is() / :has()", desc: "Логічні псевдокласи для складніших селекторів.", syntax: "li:not(:last-child) { margin-bottom: 8px; }", attrs: "приймають список селекторів", pitfalls: ":has() підтримується не в усіх старих браузерах." },
  { name: "custom properties (--var)", desc: "Власні CSS-змінні, які можна переозначати в різних місцях.", syntax: ":root { --main-color: #1d4ed8; } .btn { color: var(--main-color); }", attrs: "будь-яке ім'я з --", pitfalls: "Регістрозалежні: --Color і --color — різні змінні." },
  { name: "clamp()", desc: "Значення, яке автоматично тримається в межах між мінімумом і максимумом.", syntax: "font-size: clamp(1rem, 2vw, 2rem);", attrs: "мінімум, бажане, максимум", pitfalls: "Зручно для адаптивної типографіки без media query." },
  { name: "aspect-ratio", desc: "Задає співвідношення сторін елемента (напр. відео 16:9).", syntax: "aspect-ratio: 16 / 9;", attrs: "ширина / висота", pitfalls: "Сучасна заміна старого «трюку» з padding-top у відсотках." },
  { name: "filter", desc: "Візуальні ефекти без зміни розмітки (розмиття, яскравість тощо).", syntax: "filter: blur(4px) brightness(1.2);", attrs: "blur(), brightness(), grayscale()...", pitfalls: "Впливає на продуктивність при анімації великих елементів." },
  { name: "backdrop-filter", desc: "Розмиває/змінює те, що ПІД напівпрозорим елементом.", syntax: "backdrop-filter: blur(10px);", attrs: "ті самі функції, що й filter", pitfalls: "Елемент має бути напівпрозорим (мати opacity або background з альфа-каналом), щоб ефект був видимий." },
  { name: "will-change", desc: "Підказка браузеру заздалегідь оптимізувати анімацію властивості.", syntax: "will-change: transform;", attrs: "назва властивості", pitfalls: "Зловживання (на все підряд) шкодить продуктивності, а не покращує." },
  { name: "object-fit", desc: "Як img/video заповнює свою рамку, якщо пропорції не збігаються.", syntax: "object-fit: cover;", attrs: "cover, contain, fill, none", pitfalls: "Працює лише разом із заданими width/height на елементі." },
];

const LIBRARY_JS = [
  { name: "let / const", desc: "Оголошення змінних: let — можна змінювати, const — ні.", syntax: "let x = 1; const y = 2;", attrs: "—", pitfalls: "const не робить об'єкт незмінним — забороняє лише переприсвоєння самої змінної." },
  { name: "function", desc: "Оголошення функції.", syntax: "function name(params) { return ...; }", attrs: "параметри, return", pitfalls: "Забутий return — функція поверне undefined." },
  { name: "Array", desc: "Впорядкований список значень.", syntax: "const arr = [1, 2, 3];", attrs: ".length, [index], .push(), .map()", pitfalls: "Індексація з 0, а не з 1.", guide: "js-array" },
  { name: "Object", desc: "Набір пар ключ-значення.", syntax: "const user = { name: 'Оля', age: 20 };", attrs: "крапкова або дужкова нотація доступу", pitfalls: "user.name і user['name'] — однакові, але друге корисне з динамічними ключами.", guide: "js-object" },
  { name: "for", desc: "Цикл із лічильником.", syntax: "for (let i = 0; i < n; i++) { ... }", attrs: "ініціалізація; умова; крок", pitfalls: "Забутий i++ призводить до нескінченного циклу." },
  { name: "if / else", desc: "Умовне виконання коду.", syntax: "if (x > 0) { ... } else { ... }", attrs: "—", pitfalls: "= замість === усередині умови — це помилка присвоєння, а не порівняння." },
  { name: "document.querySelector", desc: "Знаходить перший елемент за CSS-селектором.", syntax: "document.querySelector('.card')", attrs: "—", pitfalls: "Поверне null, якщо елемент не знайдено — звернення до .textContent на null впаде з помилкою." },
  { name: "addEventListener", desc: "Підписує елемент на подію (клік, введення тощо).", syntax: "el.addEventListener('click', fn)", attrs: "тип події, функція-обробник", pitfalls: "—" },
  { name: "fetch", desc: "Робить мережевий запит (наприклад, до API).", syntax: "fetch(url).then(r => r.json())", attrs: "—", pitfalls: "fetch не кидає помилку на статуси 4xx/5xx — треба перевіряти response.ok вручну." },
  { name: "async / await", desc: "Синтаксис для зручнішої роботи з асинхронним кодом (Promise).", syntax: "async function load() { const data = await fetch(url); }", attrs: "—", pitfalls: "await працює лише всередині async-функції." },
  { name: "try / catch", desc: "Обробка помилок у коді.", syntax: "try { ... } catch (e) { console.log(e.message); }", attrs: "—", pitfalls: "—" },
  { name: "class", desc: "Шаблон для створення об'єктів зі спільною поведінкою.", syntax: "class User { constructor(name) { this.name = name; } }", attrs: "constructor, методи", pitfalls: "—" },
  { name: "map / filter / reduce", desc: "Три головні методи трансформації масивів без циклів.", syntax: "arr.map(x => x*2).filter(x => x>2)", attrs: "приймають функцію-колбек", pitfalls: "map і filter повертають НОВИЙ масив — оригінал не змінюється." },
  { name: "spread ...", desc: "Розгортає масив/об'єкт на окремі елементи.", syntax: "const copy = [...arr]; const merged = {...a, ...b};", attrs: "—", pitfalls: "Робить лише поверхневу (shallow) копію — вкладені об'єкти лишаються спільними." },
  { name: "деструктуризація", desc: "Дістає значення з масиву/об'єкта в окремі змінні.", syntax: "const { name, age } = user; const [a, b] = arr;", attrs: "—", pitfalls: "—" },
  { name: "==  vs  ===", desc: "Нестрога проти строгої рівності.", syntax: "5 == '5' // true\n5 === '5' // false", attrs: "—", pitfalls: "Використовуй === майже завжди — == має несподівані приведення типів." },
  { name: "Promise", desc: "Об'єкт, що представляє результат асинхронної операції в майбутньому.", syntax: "new Promise((resolve, reject) => {...})", attrs: ".then(), .catch(), .finally()", pitfalls: "Забутий .catch() — необроблена помилка Promise падає мовчки в консоль." },
  { name: "setTimeout", desc: "Виконує код один раз через вказаний час.", syntax: "setTimeout(() => {...}, 1000);", attrs: "функція, мілісекунди", pitfalls: "Час — це мінімум затримки, а не гарантія (браузер може затримати ще більше)." },
  { name: "JSON.stringify / parse", desc: "Перетворення між JS-об'єктом і текстовим JSON.", syntax: "JSON.stringify(obj); JSON.parse(text)", attrs: "—", pitfalls: "stringify пропускає функції та undefined-властивості." },
  { name: "localStorage", desc: "Зберігає дані в браузері між сесіями (лише рядки).", syntax: "localStorage.setItem('key', 'value')", attrs: "getItem, setItem, removeItem", pitfalls: "Зберігає лише рядки — об'єкти треба JSON.stringify перед записом." },
  { name: "Map / Set", desc: "Map — пари ключ-значення з будь-яким типом ключа; Set — унікальні значення.", syntax: "const m = new Map(); const s = new Set([1,2,2]);", attrs: ".set/.get/.has (Map), .add/.has (Set)", pitfalls: "На відміну від Object, ключі Map зберігають порядок і можуть бути будь-якого типу." },
  { name: "optional chaining ?.", desc: "Безпечний доступ до вкладеної властивості, яка може не існувати.", syntax: "user?.address?.city", attrs: "—", pitfalls: "Поверне undefined замість помилки, якщо якась ланка в ланцюжку відсутня." },
  { name: "nullish coalescing ??", desc: "Підставляє значення за замовчуванням лише для null/undefined.", syntax: "const name = input ?? 'Гість';", attrs: "—", pitfalls: "На відміну від ||, не спрацьовує на 0, '' чи false — це часто саме те, що потрібно." },
  { name: "arrow function", desc: "Коротший синтаксис функції; не має власного this.", syntax: "const sum = (a, b) => a + b;", attrs: "—", pitfalls: "Через відсутність власного this не підходить як метод об'єкта, де потрібен this." },
  { name: "template literals", desc: "Рядки у зворотних лапках з підстановкою змінних.", syntax: "`Привіт, ${name}! У тебе ${count} повідомлень.`", attrs: "${вираз} усередині", pitfalls: "Працює лише в зворотних лапках `, не в звичайних лапках." },
  { name: "closures", desc: "Функція «пам'ятає» змінні з того місця, де вона була створена.", syntax: "function counter() { let n = 0; return () => ++n; }", attrs: "—", pitfalls: "Часте джерело витоків пам'яті при необережному використанні в циклах." },
  { name: "this", desc: "Посилання на об'єкт, у контексті якого викликана функція.", syntax: "const obj = { name: 'A', greet() { return this.name; } };", attrs: "—", pitfalls: "Значення this залежить від СПОСОБУ виклику функції, а не від місця її оголошення (крім стрілкових функцій)." },
  { name: "hoisting", desc: "Оголошення var і function «піднімаються» на початок області видимості.", syntax: "console.log(x); var x = 5; // undefined, не помилка", attrs: "—", pitfalls: "let/const теж «піднімаються», але недоступні до самого оголошення («temporal dead zone»)." },
  { name: "generator function*", desc: "Функція, яка може призупинятись і повертати кілька значень по черзі.", syntax: "function* gen() { yield 1; yield 2; }", attrs: "yield", pitfalls: "—" },
  { name: "Symbol", desc: "Унікальний і незмінний примітив, часто для «прихованих» ключів об'єкта.", syntax: "const id = Symbol('id');", attrs: "—", pitfalls: "Кожен Symbol() унікальний, навіть з однаковим описом." },
  { name: "WeakMap / WeakSet", desc: "Як Map/Set, але не заважають збирачу сміття видаляти невикористані об'єкти-ключі.", syntax: "const cache = new WeakMap();", attrs: "лише об'єкти як ключі", pitfalls: "Не можна перебрати forEach — немає гарантії, що об'єкт ще існує." },
  { name: "Array.from", desc: "Створює справжній масив із чогось масивоподібного чи ітерованого.", syntax: "Array.from({length: 5}, (_, i) => i)", attrs: "джерело, необов'язкова map-функція", pitfalls: "Часто плутають з простим new Array(5) — той не має map-параметра." },
];

const LIBRARY_PYTHON = [
  { name: "def", desc: "Оголошення функції.", syntax: "def greet(name):\n    return f'Привіт, {name}'", attrs: "параметри, значення за замовчуванням", pitfalls: "Відступи (звичайно 4 пробіли) — частина синтаксису, а не стилю." },
  { name: "list / dict / tuple / set", desc: "Чотири основні колекції Python з різною поведінкою.", syntax: "lst=[1,2]; d={'a':1}; t=(1,2); s={1,2}", attrs: "—", pitfalls: "tuple незмінна після створення; list — змінна.", guide: "py-list" },
  { name: "for ... in", desc: "Цикл, що перебирає елементи будь-якої колекції.", syntax: "for item in [1, 2, 3]:\n    print(item)", attrs: "—", pitfalls: "На відміну від JS, тут немає класичного for(;;) — лише for...in по ітерованому." },
  { name: "if / elif / else", desc: "Умовне розгалуження.", syntax: "if x > 0:\n    ...\nelif x == 0:\n    ...\nelse:\n    ...", attrs: "—", pitfalls: "Двокрапка обов'язкова, дужки навколо умови — ні." },
  { name: "list comprehension", desc: "Стислий спосіб створити список за один рядок.", syntax: "squares = [x**2 for x in range(10)]", attrs: "необов'язковий if у кінці", pitfalls: "Занадто складна логіка всередині погіршує читабельність — тоді краще звичайний цикл." },
  { name: "class", desc: "Оголошення класу.", syntax: "class Dog:\n    def __init__(self, name):\n        self.name = name", attrs: "self — перший параметр кожного методу", pitfalls: "Забутий self у визначенні методу — типова помилка новачків." },
  { name: "try / except", desc: "Обробка помилок (виключень).", syntax: "try:\n    risky()\nexcept ValueError as e:\n    print(e)", attrs: "except може вказувати конкретний тип помилки", pitfalls: "Голий except: ловить взагалі все, включно з Ctrl+C — краще уникати." },
  { name: "with open()", desc: "Безпечно відкриває файл і автоматично закриває його.", syntax: "with open('file.txt') as f:\n    data = f.read()", attrs: "'r', 'w', 'a' — режими читання/запису/додавання", pitfalls: "Без with можна забути f.close()." },
  { name: "f-рядки", desc: "Форматовані рядки з підстановкою змінних прямо в тексті.", syntax: "f'Мені {age} років'", attrs: "будь-який вираз у {}", pitfalls: "Літера f обов'язкова перед лапками." },
  { name: "import", desc: "Підключення модуля чи конкретних функцій з нього.", syntax: "import math\nfrom random import choice", attrs: "as для псевдоніма (import numpy as np)", pitfalls: "—" },
  { name: "*args / **kwargs", desc: "Довільна кількість позиційних / іменованих аргументів функції.", syntax: "def f(*args, **kwargs):\n    print(args, kwargs)", attrs: "—", pitfalls: "Імена умовні — важлива саме зірочка (*, **), а не слово args." },
  { name: "self", desc: "Посилання на конкретний екземпляр класу всередині його методів.", syntax: "def greet(self):\n    return self.name", attrs: "—", pitfalls: "self передається автоматично — не вказується при виклику obj.greet()." },
];

const LIBRARY_SQL = [
  { name: "SELECT ... FROM", desc: "Вибирає колонки з таблиці.", syntax: "SELECT name, age FROM users;", attrs: "* — усі колонки", pitfalls: "SELECT * зручний для дослідження, але повільніший і крихкіший у продакшн-коді.", guide: "sql-select" },
  { name: "WHERE", desc: "Фільтрує рядки за умовою.", syntax: "SELECT * FROM users WHERE age >= 18;", attrs: "AND, OR, NOT, IN, LIKE, BETWEEN", pitfalls: "WHERE не бачить аліасів, заданих у тому самому SELECT." },
  { name: "JOIN ... ON", desc: "Об'єднує рядки з двох таблиць за спільним ключем.", syntax: "SELECT * FROM orders\nJOIN users ON orders.user_id = users.id;", attrs: "INNER, LEFT, RIGHT, FULL", pitfalls: "Забутий ON дає декартів добуток — усі можливі комбінації рядків." },
  { name: "GROUP BY", desc: "Групує рядки для підрахунку агрегатних значень.", syntax: "SELECT city, COUNT(*) FROM users GROUP BY city;", attrs: "—", pitfalls: "Кожна колонка в SELECT, що не в агрегатній функції, має бути в GROUP BY." },
  { name: "ORDER BY", desc: "Сортує результат запиту.", syntax: "SELECT * FROM users ORDER BY age DESC;", attrs: "ASC (за замовч.), DESC", pitfalls: "—" },
  { name: "CREATE TABLE", desc: "Створює нову таблицю з визначеною структурою.", syntax: "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(50)\n);", attrs: "типи колонок, обмеження (constraints)", pitfalls: "—" },
  { name: "PRIMARY KEY / FOREIGN KEY", desc: "Унікальний ключ рядка / посилання на рядок іншої таблиці.", syntax: "user_id INTEGER REFERENCES users(id)", attrs: "—", pitfalls: "FOREIGN KEY захищає від видалення пов'язаного рядка, поки на нього є посилання." },
  { name: "INSERT INTO", desc: "Додає новий рядок у таблицю.", syntax: "INSERT INTO users (name, age) VALUES ('Оля', 25);", attrs: "—", pitfalls: "Порядок значень має відповідати порядку вказаних колонок." },
  { name: "UPDATE ... SET", desc: "Змінює значення в існуючих рядках.", syntax: "UPDATE users SET age = 26 WHERE id = 1;", attrs: "—", pitfalls: "UPDATE без WHERE змінює АБСОЛЮТНО ВСІ рядки таблиці." },
  { name: "DELETE FROM", desc: "Видаляє рядки з таблиці.", syntax: "DELETE FROM users WHERE id = 1;", attrs: "—", pitfalls: "DELETE без WHERE видаляє всі рядки — так само небезпечно, як UPDATE без WHERE." },
  { name: "COUNT / SUM / AVG", desc: "Агрегатні функції для підрахунку по групі рядків.", syntax: "SELECT AVG(age) FROM users;", attrs: "MIN(), MAX() теж агрегатні", pitfalls: "Агрегатні функції ігнорують NULL-значення при підрахунку." },
  { name: "NULL", desc: "Позначення відсутності значення — не те саме, що 0 чи порожній рядок.", syntax: "WHERE email IS NULL", attrs: "IS NULL, IS NOT NULL", pitfalls: "age = NULL ніколи не істинне — потрібно саме IS NULL." },
];

/* =========================================================================
   TERM GUIDES — рich, step-by-step explanations with code + result for each
   step, in the "Масив (Array)" slide format. Each guide is linked to a
   library entry via `guide` on that entry. This is a starter set — more
   terms will be converted to this format over time (see README).
   ========================================================================= */

/* =========================================================================
   TERM_PAGES_V2 — richer reference format: badge+title, "Що це",
   "Для чого", синтаксис, таблиця атрибутів, ЖИВИЙ приклад (рендериться в
   iframe), типові помилки, пов'язані елементи. Heavier than TERM_GUIDES —
   used for a starter set of HTML form/input terms; see README for how to
   add more.
   ========================================================================= */

const REF_NAV = {
  HTML: {
    "Форми": ["form", "input", "label", "button", "select", "option", "optgroup", "textarea", "fieldset", "legend", "datalist", "output", "progress", "meter"],
    "Типи input": ["text", "password", "email", "number", "date", "time", "checkbox", "radio", "file", "range", "color", "search", "tel", "url", "hidden"],
    "Семантика": ["header", "nav", "main", "section", "article", "footer", "aside", "address", "hgroup", "search-landmark"],
    "Заголовки й абзаци": ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
    "Списки": ["ul", "ol", "li", "dl", "dt", "dd"],
    "Таблиці": ["table", "tr", "th", "td", "caption", "thead", "tbody", "tfoot", "colgroup", "col"],
    "Медіа": ["img", "video", "audio", "picture", "iframe", "embed", "object", "figure", "figcaption", "source", "track", "map", "area"],
    "Текст": ["strong", "em", "mark", "code", "pre", "blockquote"],
    "Структура документа": ["html", "head", "body", "title", "base", "link", "meta", "script", "style", "noscript"],
    "Текстова семантика": ["b", "i", "small", "del", "ins", "s", "u", "sub", "sup", "abbr", "cite", "q", "kbd", "samp", "var", "time", "data", "bdi", "bdo", "ruby", "rt", "rp", "dfn", "wbr", "br", "hr"],
    "Інтерактивність і графіка": ["dialog", "details", "summary", "template", "slot", "canvas", "svg"],
    "Інше": ["a", "div", "span", "menu"],
    "Застарілі (уникай)": ["font", "center", "big", "strike", "tt", "acronym", "applet", "basefont", "dir", "frame", "frameset", "noframes"],
  },
  CSS: {
    "Селектори і псевдо": ["css-selectors", "css-pseudo-classes", "css-pseudo-elements"],
    "Box model і layout": ["css-box-model", "css-position", "css-display-overflow", "css-flexbox", "css-grid"],
    "Кольори, фон, рамки": ["css-colors-gradients", "css-background", "css-borders", "css-shadows"],
    "Текст і списки": ["css-text", "css-lists"],
    "Одиниці, змінні, функції": ["css-units", "css-variables", "css-calc-clamp", "css-logical-properties"],
    "Transform і анімація": ["css-transform", "css-animation-transition"],
    "Візуальні ефекти": ["css-filter-backdrop", "css-mask-clip", "css-object-fit"],
    "Взаємодія та інше": ["css-cursor-interaction", "css-scroll", "css-columns-table", "css-content-counters", "css-misc-properties"],
    "@-правила": ["css-at-rules"],
  },
  JavaScript: {
    "Основи": ["js-variables", "js-control-flow", "js-functions", "js-operators", "js-destructuring"],
    "Класи та модулі": ["js-classes", "js-modules", "js-errors"],
    "Масиви, об'єкти, рядки": ["js-arrays", "js-objects", "js-strings"],
    "Числа, дати, JSON": ["js-numbers-math", "js-dates", "js-json"],
    "DOM": ["js-dom-select", "js-dom-manipulate"],
    "Події": ["js-events"],
    "Асинхронність": ["js-promises", "js-async-await", "js-fetch", "js-timers"],
    "Колекції та ітератори": ["js-sets-maps", "js-iterators-generators", "js-proxy-reflect"],
    "Web APIs та інше": ["js-storage", "js-regex", "js-console", "js-canvas", "js-web-apis"],
  },
  "English for IT": {
    "Код-рев'ю": ["eng-lgtm", "eng-nitpick", "eng-blocker", "eng-request-changes"],
    "Зустрічі та командна робота": ["eng-standup", "eng-sync", "eng-follow-up", "eng-eta"],
    "Email, Slack і терміни": ["eng-asap-fyi", "eng-per-my-last", "eng-false-friends", "eng-boilerplate", "eng-edge-case", "eng-tech-debt", "eng-rubber-duck", "eng-spaghetti-code"],
  },
  Frontend: {
    "Архітектура": ["fe-spa-mpa", "fe-rendering-strategies", "fe-virtual-dom"],
    "React": ["fe-react-basics", "fe-react-hooks", "fe-state-management"],
    "Інструменти": ["fe-build-tools", "fe-typescript", "fe-testing", "fe-package-managers"],
    "Компоненти та якість": ["fe-web-components", "fe-pwa", "fe-accessibility", "fe-performance"],
  },
  Python: {
    "Основи": ["py-variables-types", "py-control-flow", "py-functions", "py-fstrings"],
    "Класи та помилки": ["py-classes", "py-exceptions", "py-decorators"],
    "Колекції": ["py-comprehensions", "py-lists", "py-dicts", "py-sets-tuples", "py-strings"],
    "Функції та типізація": ["py-builtin-functions", "py-type-hints", "py-dataclasses"],
    "Файли та модулі": ["py-files", "py-modules-imports", "py-venv-pip"],
    "Асинхронність": ["py-async"],
    "Стандартна бібліотека": ["py-stdlib-collections", "py-stdlib-itertools-functools", "py-stdlib-datetime", "py-stdlib-os-sys", "py-stdlib-json-csv", "py-stdlib-re", "py-stdlib-math-random"],
    "Тестування та веб": ["py-testing", "py-web-frameworks", "py-sqlite"],
  },
  SQL: {
    "Вибірка даних": ["sql-select-where", "sql-filtering", "sql-aggregation-grouping"],
    "З'єднання таблиць": ["sql-joins", "sql-set-operators", "sql-cte"],
    "Зміна даних і структури": ["sql-insert-update-delete", "sql-create-alter-table", "sql-constraints"],
    "Продуктивність і надійність": ["sql-index-views", "sql-transactions", "sql-window-functions"],
    "Функції в запитах": ["sql-case-coalesce", "sql-string-functions", "sql-number-functions"],
    "Дата, типи, доступ": ["sql-date-functions", "sql-type-casting", "sql-data-types", "sql-permissions"],
  },
  Backend: {
    "HTTP основи": ["backend-http-methods", "backend-http-status-codes", "backend-http-headers"],
    "Стилі API": ["backend-rest", "backend-graphql", "backend-websocket-webhook"],
    "Node.js та Express": ["backend-nodejs-modules", "backend-express-routing", "backend-express-middleware"],
    "Автентифікація та безпека": ["backend-auth", "backend-password-hashing", "backend-security"],
    "Обмеження, бази даних, ORM": ["backend-rate-limiting", "backend-sql-vs-nosql", "backend-orm"],
    "Кеш, черги, сервери": ["backend-caching", "backend-message-queues", "backend-web-servers"],
  },
  "Full Stack": {},
};

const TERM_PAGES_V2 = {
  range: {
    badge: "HTML",
    title: '<input type="range">',
    whatIsIt: 'Елемент <input type="range"> створює повзунок, який дозволяє користувачу вибрати число в певному діапазоні. Це зручно для налаштування параметрів, наприклад гучності, яскравості, ціни або будь-якого значення.',
    useCases: ["вибір числових значень", "налаштування параметрів", "керування гучністю, яскравістю, температурою тощо"],
    syntax: `<input type="range" min="0" max="100" step="1" value="50">`,
    attributes: [
      { name: "min", desc: "мінімальне значення (за замовчуванням 0)" },
      { name: "max", desc: "максимальне значення (за замовчуванням 100)" },
      { name: "step", desc: "крок зміни значення (за замовчуванням 1)" },
      { name: "value", desc: "початкове значення (за замовчуванням min)" },
      { name: "disabled", desc: "блокує взаємодію" },
      { name: "name", desc: "ім'я поля для форми" },
    ],
    example: `<label for="volume">Гучність: <span id="value">50</span></label>
<input type="range" id="volume" min="0" max="100" step="1" value="50">
<script>
  const slider = document.getElementById('volume');
  const value = document.getElementById('value');
  slider.oninput = () => { value.textContent = slider.value; };
<\/script>`,
    pitfalls: [
      "Не вказано min або max — можна випадково отримати неочікуваний діапазон.",
      "step не підходить для типу даних (напр. 0.5 для того, що має бути цілим числом).",
      "Забуто додати value — повзунок стартує з мінімуму, а не з бажаного значення.",
    ],
    related: ["input", "label", "form", "JS події", "CSS"],
  },
  checkbox: {
    badge: "HTML",
    title: '<input type="checkbox">',
    whatIsIt: 'Елемент <input type="checkbox"> створює прапорець — незалежний перемикач "увімкнено/вимкнено". На відміну від radio, кожен checkbox працює сам по собі, навіть якщо їх кілька поруч.',
    useCases: ["згода з умовами використання", "прапорці «запам'ятати мене»", "вибір кількох варіантів із списку (фільтри)"],
    syntax: `<input type="checkbox" checked>`,
    attributes: [
      { name: "checked", desc: "позначений заздалегідь (за замовчуванням вимкнено)" },
      { name: "disabled", desc: "блокує взаємодію" },
      { name: "required", desc: "форма не відправиться, поки не позначено" },
      { name: "name", desc: "ім'я поля для форми" },
      { name: "value", desc: "значення, яке відправиться, якщо позначено" },
    ],
    example: `<label><input type="checkbox" id="agree"> Погоджуюсь з умовами</label>
<p id="status">Не погоджено</p>
<script>
  const box = document.getElementById('agree');
  const status = document.getElementById('status');
  box.onchange = () => {
    status.textContent = box.checked ? "Погоджено!" : "Не погоджено";
  };
<\/script>`,
    pitfalls: [
      "Читання значення через .value замість .checked — checkbox завжди має value='on', важливий саме стан checked.",
      "Немає label — менша область кліку і гірша доступність.",
    ],
    related: ["input", "label", "form", "radio"],
  },
  email: {
    badge: "HTML",
    title: '<input type="email">',
    whatIsIt: 'Елемент <input type="email"> — текстове поле з вбудованою базовою перевіркою формату email (наявність @ і домену). Браузер сам підсвічує помилку, не даючи відправити форму з неправильним форматом.',
    useCases: ["форми входу й реєстрації", "розсилки й підписки", "контактні форми"],
    syntax: `<input type="email" required placeholder="you@example.com">`,
    attributes: [
      { name: "required", desc: "поле обов'язкове для заповнення" },
      { name: "placeholder", desc: "сірий текст-підказка, поки поле порожнє" },
      { name: "multiple", desc: "дозволяє ввести кілька адрес через кому" },
      { name: "pattern", desc: "власний regex-шаблон для додаткової перевірки" },
    ],
    example: `<label for="mail">Email:</label>
<input type="email" id="mail" required placeholder="you@example.com">
<button id="check">Перевірити</button>
<p id="result"></p>
<script>
  document.getElementById('check').onclick = () => {
    const el = document.getElementById('mail');
    document.getElementById('result').textContent =
      el.checkValidity() ? "Формат правильний" : "Некоректний email";
  };
<\/script>`,
    pitfalls: [
      "Валідація browser'а базова — перевіряє лише формат, не те, що email реально існує.",
      "Не заміняє серверну перевірку — валідацію в браузері завжди можна обійти.",
    ],
    related: ["input", "label", "form", "required"],
  },
  button: {
    badge: "HTML",
    title: "<button>",
    whatIsIt: "button — клікабельна кнопка дії. Може запускати JS-функцію, відправляти форму (type=\"submit\") або скидати її (type=\"reset\") — залежно від атрибута type.",
    useCases: ["відправка форми", "запуск дії через JavaScript (onclick)", "будь-яка клікабельна дія в інтерфейсі"],
    syntax: `<button type="button">Натисни мене</button>`,
    attributes: [
      { name: "type", desc: "button (нічого не робить сама), submit (відправляє форму), reset (скидає форму)" },
      { name: "disabled", desc: "робить кнопку неактивною" },
      { name: "form", desc: "прив'язує кнопку до форми за id, навіть якщо вона поза нею" },
    ],
    example: `<button id="counter" type="button">Клікнуто: 0</button>
<script>
  let count = 0;
  const btn = document.getElementById('counter');
  btn.onclick = () => {
    count++;
    btn.textContent = "Клікнуто: " + count;
  };
<\/script>`,
    pitfalls: [
      "Забутий type=\"button\" усередині <form> — за замовчуванням type дорівнює submit, і кнопка випадково відправляє форму.",
      "Використання <div onclick> замість <button> — гірше для доступності й клавіатурної навігації.",
    ],
    related: ["form", "input", "JS події"],
  },
  form: {
    badge: "HTML",
    title: "<form>",
    whatIsIt: "form — контейнер, що збирає дані з полів усередині себе (input, select, textarea) і відправляє їх разом: на сервер за адресою action, або в обробку JavaScript через подію submit.",
    useCases: ["форми входу й реєстрації", "пошук на сайті", "оформлення замовлення", "будь-яке групове введення даних"],
    syntax: `<form action="/submit" method="post">...</form>`,
    attributes: [
      { name: "action", desc: "адреса, куди відправляються дані форми" },
      { name: "method", desc: "GET або POST — спосіб відправки" },
      { name: "novalidate", desc: "вимикає вбудовану браузерну валідацію" },
      { name: "autocomplete", desc: "дозволяє/забороняє автозаповнення браузером" },
    ],
    example: `<form id="myForm">
  <input type="text" id="name" placeholder="Ім'я" required>
  <button type="submit">Відправити</button>
</form>
<p id="out"></p>
<script>
  document.getElementById('myForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    document.getElementById('out').textContent = "Привіт, " + name + "!";
  });
<\/script>`,
    pitfalls: [
      "Забутий method — за замовчуванням GET, і дані потраплять прямо в адресний рядок URL.",
      "Немає e.preventDefault() в обробнику submit — сторінка перезавантажиться, JS-логіка не встигне спрацювати.",
    ],
    related: ["input", "button", "label", "JS події"],
  },
  text: {
    badge: "HTML",
    title: '<input type="text">',
    whatIsIt: 'Найпростіше й найуживаніше текстове поле — приймає будь-який однорядковий текст без спеціального формату чи перевірки.',
    useCases: ["ім'я, прізвище, назва", "пошукові поля", "будь-який короткий довільний текст"],
    syntax: `<input type="text" placeholder="Введи текст">`,
    attributes: [
      { name: "placeholder", desc: "сірий текст-підказка, поки поле порожнє" },
      { name: "maxlength", desc: "максимальна кількість символів" },
      { name: "pattern", desc: "regex-шаблон для власної перевірки формату" },
      { name: "readonly", desc: "видно, але не можна редагувати" },
      { name: "value", desc: "початкове значення поля" },
    ],
    example: `<label for="name">Ім'я:</label>
<input type="text" id="name" maxlength="20">
<p id="count">0 / 20</p>
<script>
  const el = document.getElementById('name');
  el.oninput = () => {
    document.getElementById('count').textContent = el.value.length + " / 20";
  };
<\/script>`,
    pitfalls: [
      "Немає maxlength там, де довжина важлива — можна ввести будь-яку кількість символів.",
      "Покладатись лише на клієнтську валідацію — завжди перевіряй ще й на сервері.",
    ],
    related: ["input", "label", "form", "maxlength"],
  },
  password: {
    badge: "HTML",
    title: '<input type="password">',
    whatIsIt: 'Як текстове поле, але символи приховуються крапками чи зірочками під час вводу — щоб пароль не побачили через плече.',
    useCases: ["форми входу", "зміна пароля", "будь-яке конфіденційне поле вводу"],
    syntax: `<input type="password" minlength="8" required>`,
    attributes: [
      { name: "minlength", desc: "мінімальна довжина пароля" },
      { name: "required", desc: "поле обов'язкове" },
      { name: "autocomplete", desc: "'current-password' або 'new-password' — підказка браузеру" },
    ],
    example: `<label for="pwd">Пароль:</label>
<input type="password" id="pwd" minlength="8">
<button id="toggle" type="button">👁 Показати</button>
<script>
  const el = document.getElementById('pwd');
  document.getElementById('toggle').onclick = () => {
    el.type = el.type === 'password' ? 'text' : 'password';
  };
<\/script>`,
    pitfalls: [
      "Приховування символів — не шифрування: пароль однаково йде в мережу як звичайний текст (потрібен ще HTTPS).",
      "Занадто короткий minlength не захищає користувача — краще додати підказку про надійність пароля.",
    ],
    related: ["input", "label", "form", "required"],
  },
  number: {
    badge: "HTML",
    title: '<input type="number">',
    whatIsIt: 'Поле лише для чисел, зі стрілками збільшення/зменшення значення. Браузер не дає ввести літери.',
    useCases: ["кількість товару в кошику", "вік, кількість осіб", "будь-яке числове значення з межами"],
    syntax: `<input type="number" min="1" max="10" step="1" value="1">`,
    attributes: [
      { name: "min / max", desc: "мінімальне й максимальне допустиме значення" },
      { name: "step", desc: "крок зміни при натисканні стрілок" },
      { name: "value", desc: "початкове значення" },
    ],
    example: `<label for="qty">Кількість:</label>
<input type="number" id="qty" min="1" max="10" value="1">
<p id="total"></p>
<script>
  const el = document.getElementById('qty');
  const upd = () => { document.getElementById('total').textContent = "Разом: " + (el.value * 25) + " грн"; };
  el.oninput = upd; upd();
<\/script>`,
    pitfalls: [
      "Значення з number завжди приходить рядком у деяких контекстах — не забувай Number(el.value) при обчисленнях.",
      "Не працює для дуже великих чисел чи номерів телефону — для них краще type=\"text\" з pattern.",
    ],
    related: ["input", "label", "min", "max"],
  },
  date: {
    badge: "HTML",
    title: '<input type="date">',
    whatIsIt: 'Вбудований календар для вибору дати — браузер сам малює зручний віджет вибору, без сторонніх бібліотек.',
    useCases: ["дата народження", "бронювання/резервація", "фільтр за періодом"],
    syntax: `<input type="date" min="2020-01-01" max="2030-12-31">`,
    attributes: [
      { name: "min / max", desc: "межі допустимих дат" },
      { name: "value", desc: "початкова дата у форматі РРРР-ММ-ДД" },
    ],
    example: `<label for="bday">Дата народження:</label>
<input type="date" id="bday">
<p id="out"></p>
<script>
  document.getElementById('bday').onchange = (e) => {
    document.getElementById('out').textContent = "Обрано: " + e.target.value;
  };
<\/script>`,
    pitfalls: [
      "Формат value завжди РРРР-ММ-ДД незалежно від того, як дата показується користувачу — легко наплутати при обробці в JS.",
      "Вигляд віджета календаря відрізняється між браузерами — не можна точно контролювати стилі всередині нього.",
    ],
    related: ["input", "label", "min", "max"],
  },
  radio: {
    badge: "HTML",
    title: '<input type="radio">',
    whatIsIt: 'Перемикач, що дозволяє вибрати рівно ОДИН варіант з групи. Усі input з однаковим атрибутом name утворюють одну групу — вибір одного знімає позначку з інших.',
    useCases: ["вибір тарифного плану", "опитування з одним варіантом відповіді", "будь-який вибір «або-або»"],
    syntax: `<input type="radio" name="plan" value="free" checked>`,
    attributes: [
      { name: "name", desc: "об'єднує кілька radio в одну групу" },
      { name: "checked", desc: "позначений заздалегідь" },
      { name: "value", desc: "значення, яке відправиться при виборі саме цього варіанту" },
    ],
    example: `<label><input type="radio" name="plan" value="free" checked> Безкоштовно</label>
<label><input type="radio" name="plan" value="pro"> Pro</label>
<p id="out">Обрано: free</p>
<script>
  document.querySelectorAll('input[name=plan]').forEach(r => {
    r.onchange = () => { document.getElementById('out').textContent = "Обрано: " + r.value; };
  });
<\/script>`,
    pitfalls: [
      "Різні name у групі — кожен radio стає незалежним, і можна позначити кілька одразу (втрачається сенс «або-або»).",
      "Немає жодного checked — спочатку не вибрано жодного варіанту, форма може відправитись без значення.",
    ],
    related: ["input", "label", "checkbox", "form"],
  },
  file: {
    badge: "HTML",
    title: '<input type="file">',
    whatIsIt: 'Відкриває системний діалог вибору файлу з диска користувача — для завантаження зображень, документів тощо.',
    useCases: ["завантаження аватара", "прикріплення документів", "форми з вкладеннями"],
    syntax: `<input type="file" accept="image/*">`,
    attributes: [
      { name: "accept", desc: "обмежує типи файлів (напр. image/*, .pdf)" },
      { name: "multiple", desc: "дозволяє вибрати кілька файлів одразу" },
    ],
    example: `<input type="file" id="f" accept="image/*">
<p id="name">Файл не обрано</p>
<script>
  document.getElementById('f').onchange = (e) => {
    const file = e.target.files[0];
    document.getElementById('name').textContent = file ? file.name : "Файл не обрано";
  };
<\/script>`,
    pitfalls: [
      "Значення .value для file — лише умовний шлях з міркувань безпеки; реальний файл дістають через .files[0].",
      "accept — лише підказка браузеру, не справжня перевірка безпеки; сервер має перевіряти тип файлу теж.",
    ],
    related: ["input", "form", "FormData"],
  },
  color: {
    badge: "HTML",
    title: '<input type="color">',
    whatIsIt: 'Відкриває системну палітру вибору кольору й повертає значення у форматі HEX (#rrggbb).',
    useCases: ["налаштування теми оформлення", "редактори й конструктори", "будь-який вибір кольору користувачем"],
    syntax: `<input type="color" value="#1d4ed8">`,
    attributes: [{ name: "value", desc: "початковий колір у форматі #rrggbb" }],
    example: `<label for="c">Колір фону:</label>
<input type="color" id="c" value="#1d4ed8">
<div id="box" style="width:100px;height:40px;background:#1d4ed8;margin-top:8px;"></div>
<script>
  document.getElementById('c').oninput = (e) => {
    document.getElementById('box').style.background = e.target.value;
  };
<\/script>`,
    pitfalls: [
      "Значення завжди HEX — якщо потрібен rgba() з прозорістю, доведеться конвертувати самостійно.",
      "Вигляд самої палітри залежить від ОС і браузера — стилізувати кнопку можна, вміст палітри — ні.",
    ],
    related: ["input", "label", "CSS"],
  },
  label: {
    badge: "HTML",
    title: "<label>",
    whatIsIt: "Текстовий підпис, пов'язаний із конкретним полем форми через атрибут for (або обгортанням). Клік по підпису одразу фокусує чи перемикає поле — зручність і доступність в одному.",
    useCases: ["підпис до будь-якого поля форми", "збільшення клікабельної області чекбоксів/радіо", "доступність для скрінрідерів"],
    syntax: `<label for="email">Email:</label>`,
    attributes: [{ name: "for", desc: "id поля, з яким пов'язаний підпис" }],
    example: `<label for="mail">Email:</label>
<input type="email" id="mail">
<p style="font-size:13px;color:#666">Клікни на слово "Email:" вище →</p>`,
    pitfalls: [
      "for не збігається з id відповідного input — зв'язок не працює, клік по підпису нічого не робить.",
      "Немає label взагалі — гірша доступність і менша область кліку, особливо на мобільних.",
    ],
    related: ["input", "form", "checkbox"],
  },
  select: {
    badge: "HTML",
    title: "<select>",
    whatIsIt: "Випадний список вибору одного (або кількох, з multiple) варіантів. Кожен варіант — окремий тег option усередині.",
    useCases: ["вибір міста, країни", "фільтри й сортування", "будь-який вибір з обмеженого списку"],
    syntax: `<select><option value="kyiv">Київ</option></select>`,
    attributes: [
      { name: "multiple", desc: "дозволяє вибрати кілька варіантів" },
      { name: "required", desc: "поле обов'язкове" },
      { name: "disabled", desc: "блокує взаємодію" },
    ],
    example: `<label for="city">Місто:</label>
<select id="city">
  <option value="kyiv">Київ</option>
  <option value="lviv">Львів</option>
  <option value="odesa">Одеса</option>
</select>
<p id="out"></p>
<script>
  document.getElementById('city').onchange = (e) => {
    document.getElementById('out').textContent = "Обрано: " + e.target.value;
  };
<\/script>`,
    pitfalls: [
      "Забутий value в option — відправиться текст усередині тега замість очікуваного значення.",
      "select виглядає майже неможливо стилізувати повністю через CSS — для складного дизайну часто роблять кастомний випадний список на div.",
    ],
    related: ["option", "label", "form"],
  },
  textarea: {
    badge: "HTML",
    title: "<textarea>",
    whatIsIt: "Багаторядкове текстове поле — на відміну від input, дозволяє вводити текст з переносами рядків (коментарі, повідомлення, опис).",
    useCases: ["коментарі", "повідомлення в чаті/формі зворотного зв'язку", "будь-який довгий текст"],
    syntax: `<textarea rows="4" placeholder="Твій коментар..."></textarea>`,
    attributes: [
      { name: "rows / cols", desc: "видима висота (у рядках) і ширина (у символах)" },
      { name: "maxlength", desc: "максимальна кількість символів" },
      { name: "placeholder", desc: "текст-підказка, поки поле порожнє" },
    ],
    example: `<textarea id="msg" rows="3" maxlength="100" placeholder="Твій коментар..."></textarea>
<p id="count">0 / 100</p>
<script>
  const el = document.getElementById('msg');
  el.oninput = () => { document.getElementById('count').textContent = el.value.length + " / 100"; };
<\/script>`,
    pitfalls: [
      "Початковий текст пишеться МІЖ тегами <textarea>...</textarea>, а не через атрибут value, як у input.",
      "Немає maxlength там, де є обмеження на сервері — користувач дізнається про перевищення лише після відправки.",
    ],
    related: ["label", "form", "input"],
  },
  fieldset: {
    badge: "HTML",
    title: "<fieldset>",
    whatIsIt: "Групує пов'язані поля форми візуальною рамкою під спільним підписом (через <legend>). Допомагає і візуально, і для скрінрідерів зрозуміти, що кілька полів стосуються однієї теми.",
    useCases: ["групування адреси (вулиця, місто, індекс)", "розділення довгої форми на секції", "групування radio/checkbox одного питання"],
    syntax: `<fieldset><legend>Адреса</legend>...</fieldset>`,
    attributes: [{ name: "disabled", desc: "блокує взаємодію з усіма полями всередині одразу" }],
    example: `<fieldset>
  <legend>Контакти</legend>
  <label for="n">Ім'я: <input id="n" type="text"></label><br>
  <label for="e">Email: <input id="e" type="email"></label>
</fieldset>`,
    pitfalls: ["Використання без <legend> — губиться сенс групування для скрінрідерів.", "Занадто дрібне групування (по одному полю) — зайва візуальна рамка без користі."],
    related: ["legend", "form", "input"],
  },
  legend: {
    badge: "HTML",
    title: "<legend>",
    whatIsIt: "Підпис для <fieldset> — має бути першим елементом усередині нього. Показується як заголовок групи полів, часто врізаний прямо в рамку fieldset.",
    useCases: ["назва групи полів форми", "заголовок секції форми"],
    syntax: `<fieldset><legend>Текст</legend>...</fieldset>`,
    attributes: [{ name: "—", desc: "власних атрибутів не має" }],
    example: `<fieldset>
  <legend>Спосіб оплати</legend>
  <label><input type="radio" name="pay" checked> Карта</label><br>
  <label><input type="radio" name="pay"> Готівка</label>
</fieldset>`,
    pitfalls: ["Розміщення не першим елементом у fieldset — браузер може показати його не так, як очікується."],
    related: ["fieldset", "form"],
  },
  datalist: {
    badge: "HTML",
    title: "<datalist>",
    whatIsIt: "Список підказок автодоповнення для input — на відміну від select, дозволяє й ввести власне значення, не лише обрати із запропонованих.",
    useCases: ["підказки міст/країн з можливістю ввести своє", "автодоповнення пошуку", "довгий список варіантів без випадного меню"],
    syntax: `<input list="opts"><datalist id="opts"><option value="Київ"></datalist>`,
    attributes: [{ name: "id", desc: "зв'язується з атрибутом list відповідного input" }],
    example: `<label for="city">Місто:</label>
<input list="cities" id="city">
<datalist id="cities">
  <option value="Київ"></option>
  <option value="Львів"></option>
  <option value="Одеса"></option>
</datalist>`,
    pitfalls: ["Очікування, що datalist обмежує ввід, як select — насправді користувач може ввести будь-що інше."],
    related: ["input", "select", "form"],
  },
  output: {
    badge: "HTML",
    title: "<output>",
    whatIsIt: "Показує результат обчислення чи дії форми — семантично позначає, що цей текст саме результат, а не звичайний вміст.",
    useCases: ["результат калькулятора всередині форми", "сума кошика, що оновлюється", "будь-який обчислений результат форми"],
    syntax: `<output name="result" for="a b">0</output>`,
    attributes: [
      { name: "for", desc: "id полів, від яких залежить результат" },
      { name: "name", desc: "ім'я поля для форми" },
    ],
    example: `<input type="number" id="a" value="2"> +
<input type="number" id="b" value="3"> =
<output id="result">5</output>
<script>
  const upd = () => {
    document.getElementById('result').textContent =
      Number(document.getElementById('a').value) + Number(document.getElementById('b').value);
  };
  document.getElementById('a').oninput = upd;
  document.getElementById('b').oninput = upd;
<\/script>`,
    pitfalls: ["Використання звичайного <span> замість <output> там, де саме показується результат — втрачається семантика для допоміжних технологій."],
    related: ["form", "input"],
  },
  progress: {
    badge: "HTML",
    title: "<progress>",
    whatIsIt: "Візуальний індикатор прогресу виконання задачі, що змінюється в часі (завантаження файлу, виконання кроків).",
    useCases: ["прогрес завантаження файлу", "покроковий майстер (крок 3 з 5)", "індикатор виконання довгої операції"],
    syntax: `<progress value="70" max="100"></progress>`,
    attributes: [
      { name: "value", desc: "поточне значення прогресу" },
      { name: "max", desc: "максимальне значення (100% за замовчуванням = 1)" },
    ],
    example: `<progress id="p" value="30" max="100"></progress>
<button type="button" id="go">+10%</button>
<script>
  document.getElementById('go').onclick = () => {
    const p = document.getElementById('p');
    p.value = Math.min(100, p.value + 10);
  };
<\/script>`,
    pitfalls: ["Плутають з <meter> — progress саме для процесу, що рухається до завершення, а не для статичного виміру."],
    related: ["meter", "form"],
  },
  meter: {
    badge: "HTML",
    title: "<meter>",
    whatIsIt: "Вимірювальна шкала для відомого діапазону значень (не процес, а статичний вимір) — наприклад заповненість диска чи оцінка.",
    useCases: ["рівень заряду батареї", "оцінка/рейтинг", "заповненість сховища"],
    syntax: `<meter value="6" min="0" max="10"></meter>`,
    attributes: [
      { name: "value", desc: "поточне значення" },
      { name: "min / max", desc: "межі шкали" },
      { name: "low / high / optimum", desc: "пороги для кольорового позначення (низько/високо/оптимально)" },
    ],
    example: `<label for="m">Заряд батареї:</label>
<meter id="m" value="0.7" min="0" max="1"></meter>`,
    pitfalls: ["Використання для показу прогресу довгої задачі — для цього призначений саме <progress>, не meter."],
    related: ["progress"],
  },
  search: {
    badge: "HTML",
    title: '<input type="search">',
    whatIsIt: "Текстове поле, спеціалізоване під пошук — у деяких браузерах додає кнопку «×» для швидкого очищення поля.",
    useCases: ["пошук на сайті", "фільтр у таблиці/списку"],
    syntax: `<input type="search" placeholder="Пошук...">`,
    attributes: [{ name: "placeholder", desc: "текст-підказка в полі" }],
    example: `<input type="search" id="s" placeholder="Пошук товарів...">
<p id="out"></p>
<script>
  document.getElementById('s').oninput = (e) => {
    document.getElementById('out').textContent = "Шукаємо: " + e.target.value;
  };
<\/script>`,
    pitfalls: ["Очікування вбудованої логіки пошуку — type=\"search\" лише про вигляд поля, саму фільтрацію треба писати в JS."],
    related: ["input", "form"],
  },
  tel: {
    badge: "HTML",
    title: '<input type="tel">',
    whatIsIt: "Текстове поле для номера телефону. На відміну від number, дозволяє символи +, -, дужки — і на мобільних викликає цифрову клавіатуру.",
    useCases: ["номер телефону в формі", "контактні дані"],
    syntax: `<input type="tel" pattern="[0-9+\\-() ]+">`,
    attributes: [{ name: "pattern", desc: "власний regex-шаблон формату номера" }],
    example: `<label for="phone">Телефон:</label>
<input type="tel" id="phone" placeholder="+380...">`,
    pitfalls: ["Немає вбудованої валідації формату — на відміну від email, tel завжди приймає будь-який текст без власного pattern."],
    related: ["input", "pattern", "form"],
  },
  url: {
    badge: "HTML",
    title: '<input type="url">',
    whatIsIt: "Текстове поле з базовою перевіркою, що введене схоже на адресу вебсайту (має протокол на кшталт https://).",
    useCases: ["посилання на портфоліо/сайт", "поле для URL у формі профілю"],
    syntax: `<input type="url" placeholder="https://example.com">`,
    attributes: [{ name: "placeholder", desc: "приклад формату в полі" }],
    example: `<label for="site">Сайт:</label>
<input type="url" id="site" placeholder="https://example.com">`,
    pitfalls: ["Забутий протокол (https://) на початку — браузер вважає значення невалідним URL."],
    related: ["input", "form"],
  },
  hidden: {
    badge: "HTML",
    title: '<input type="hidden">',
    whatIsIt: "Невидиме поле форми — користувач його не бачить, але воно все одно відправляється разом з формою. Використовується для службових даних.",
    useCases: ["ID користувача чи товару", "CSRF-токен", "будь-які службові дані форми"],
    syntax: `<input type="hidden" name="userId" value="42">`,
    attributes: [
      { name: "name", desc: "ім'я поля" },
      { name: "value", desc: "значення, яке відправиться" },
    ],
    example: `<form>
  <input type="hidden" name="userId" value="42">
  <input type="text" name="comment" placeholder="Коментар">
  <button type="submit">Відправити</button>
</form>`,
    pitfalls: ["hidden не є способом захисту даних — значення легко побачити у вихідному коді сторінки, не для секретів."],
    related: ["input", "form"],
  },
  ul: {
    badge: "HTML",
    title: "<ul>",
    whatIsIt: "Маркований список — кожен пункт позначається маркером (крапкою), а не номером. Пункти — теги <li> усередині.",
    useCases: ["меню навігації", "список особливостей товару", "будь-який перелік без важливого порядку"],
    syntax: `<ul><li>Пункт</li></ul>`,
    attributes: [{ name: "—", desc: "стилізується через CSS list-style" }],
    example: `<ul>
  <li>Хліб</li>
  <li>Молоко</li>
  <li>Яйця</li>
</ul>`,
    pitfalls: ["li поза ul/ol — втрачається сенс і правильна семантика списку."],
    related: ["li", "ol", "nav"],
  },
  ol: {
    badge: "HTML",
    title: "<ol>",
    whatIsIt: "Нумерований список — кожен пункт автоматично отримує порядковий номер. Використовується, коли порядок пунктів важливий.",
    useCases: ["покрокова інструкція", "рейтинг/топ", "будь-який перелік, де важливий порядок"],
    syntax: `<ol><li>Крок</li></ol>`,
    attributes: [
      { name: "start", desc: "з якого числа починати нумерацію" },
      { name: "reversed", desc: "нумерація у зворотному порядку" },
    ],
    example: `<ol start="1">
  <li>Розігрій духовку</li>
  <li>Змішай інгредієнти</li>
  <li>Випікай 20 хвилин</li>
</ol>`,
    pitfalls: ["Використання ul там, де порядок пунктів насправді важливий (напр. інструкція) — семантично мало б бути ol."],
    related: ["li", "ul"],
  },
  li: {
    badge: "HTML",
    title: "<li>",
    whatIsIt: "Один пункт списку — обов'язково всередині <ul>, <ol> або <menu>. Поза списком не має сенсу.",
    useCases: ["будь-який окремий пункт маркованого чи нумерованого списку"],
    syntax: `<li>Текст пункту</li>`,
    attributes: [{ name: "value", desc: "(лише в ol) власний номер для цього пункту" }],
    example: `<ul>
  <li>Перший пункт</li>
  <li>Другий пункт</li>
</ul>`,
    pitfalls: ["Вкладання блокових елементів неправильно чи розміщення li поза ul/ol — невалідна розмітка."],
    related: ["ul", "ol"],
  },
  dl: {
    badge: "HTML",
    title: "<dl> / <dt> / <dd>",
    whatIsIt: "Список визначень: dl — контейнер, dt — термін, dd — його опис/визначення. Пара dt+dd може повторюватись кілька разів.",
    useCases: ["словник термінів", "FAQ (питання-відповідь)", "список характеристик товару (назва-значення)"],
    syntax: `<dl><dt>Термін</dt><dd>Опис</dd></dl>`,
    attributes: [{ name: "—", desc: "власних атрибутів не мають" }],
    example: `<dl>
  <dt>HTML</dt>
  <dd>Мова розмітки вебсторінок</dd>
  <dt>CSS</dt>
  <dd>Мова стилів для оформлення</dd>
</dl>`,
    pitfalls: ["Використання dl для звичайного списку без пар термін-опис — тоді краще підходить ul/ol."],
    related: ["ul", "ol"],
  },
  table: {
    badge: "HTML",
    title: "<table>",
    whatIsIt: "Структура для табличних даних — рядків і колонок. Складається з tr (рядки), у яких лежать th (заголовки) чи td (звичайні комірки).",
    useCases: ["порівняння тарифів/цін", "фінансові звіти", "будь-які дані у форматі рядків/колонок"],
    syntax: `<table><tr><th>Заголовок</th></tr></table>`,
    attributes: [{ name: "—", desc: "стилізується через CSS (border-collapse тощо)" }],
    example: `<table border="1">
  <tr><th>Товар</th><th>Ціна</th></tr>
  <tr><td>Хліб</td><td>25 грн</td></tr>
  <tr><td>Молоко</td><td>40 грн</td></tr>
</table>`,
    pitfalls: ["Використання table для верстки макета сторінки замість реальних даних — застаріла й погана практика."],
    related: ["tr", "th", "td"],
  },
  tr: {
    badge: "HTML",
    title: "<tr>",
    whatIsIt: "Один рядок таблиці (table row) — містить комірки th чи td.",
    useCases: ["кожен рядок будь-якої таблиці"],
    syntax: `<tr><td>...</td></tr>`,
    attributes: [{ name: "—", desc: "власних атрибутів не має" }],
    example: `<table border="1">
  <tr><td>Рядок 1</td></tr>
  <tr><td>Рядок 2</td></tr>
</table>`,
    pitfalls: ["tr поза table — невалідна розмітка."],
    related: ["table", "td", "th"],
  },
  th: {
    badge: "HTML",
    title: "<th>",
    whatIsIt: "Заголовкова комірка таблиці — позначає назву колонки чи рядка. За замовчуванням показується жирним і по центру.",
    useCases: ["заголовки колонок таблиці", "заголовки рядків"],
    syntax: `<th scope="col">Назва</th>`,
    attributes: [{ name: "scope", desc: "'col' чи 'row' — яку вісь описує заголовок (для доступності)" }],
    example: `<table border="1">
  <tr><th scope="col">Ім'я</th><th scope="col">Вік</th></tr>
  <tr><td>Оля</td><td>25</td></tr>
</table>`,
    pitfalls: ["Використання td замість th для заголовків — втрачається семантика й доступність для скрінрідерів."],
    related: ["table", "tr", "td"],
  },
  td: {
    badge: "HTML",
    title: "<td>",
    whatIsIt: "Звичайна комірка з даними таблиці (table data) — на відміну від th, не заголовкова.",
    useCases: ["будь-яке значення в таблиці"],
    syntax: `<td>Значення</td>`,
    attributes: [
      { name: "colspan", desc: "комірка займає кілька колонок" },
      { name: "rowspan", desc: "комірка займає кілька рядків" },
    ],
    example: `<table border="1">
  <tr><td colspan="2">Об'єднана комірка</td></tr>
  <tr><td>А</td><td>Б</td></tr>
</table>`,
    pitfalls: ["Використання td для заголовків замість th."],
    related: ["table", "tr", "th"],
  },
  img: {
    badge: "HTML",
    title: "<img>",
    whatIsIt: "Вставляє зображення на сторінку. Самозакривний тег — без </img>. Атрибути визначають, яке зображення, як воно завантажується і що показати, якщо файл не завантажиться.",
    useCases: ["фото товарів", "ілюстрації статей", "аватари користувачів"],
    syntax: `<img src="cat.jpg" alt="Опис зображення">`,
    attributes: [
      { name: "src", desc: "адреса файлу зображення" },
      { name: "alt", desc: "текстовий опис — обов'язковий для доступності" },
      { name: "width / height", desc: "розміри — резервують місце до завантаження" },
      { name: "loading", desc: "'lazy' відкладає завантаження, поки не докрутиш до картинки" },
    ],
    example: `<img src="https://picsum.photos/300/150" alt="Випадкове зображення" width="300" height="150">`,
    pitfalls: ["Відсутній alt — проблема з доступністю та SEO.", "Немає width/height — сторінка «стрибає» під час завантаження зображення."],
    related: ["picture", "figure"],
  },
  video: {
    badge: "HTML",
    title: "<video>",
    whatIsIt: "Вбудований відеоплеєр з елементами керування — без сторонніх плагінів, підтримується всіма сучасними браузерами.",
    useCases: ["відео на сторінці продукту", "навчальні відео", "фонове відео дизайну"],
    syntax: `<video src="movie.mp4" controls></video>`,
    attributes: [
      { name: "controls", desc: "показує панель керування (плей/пауза/гучність)" },
      { name: "autoplay", desc: "автозапуск (майже завжди потребує muted)" },
      { name: "loop", desc: "повторення відео по колу" },
      { name: "poster", desc: "зображення-заглушка, поки відео не запущено" },
    ],
    example: `<video controls width="300" poster="https://picsum.photos/300/150">
  <source src="movie.mp4" type="video/mp4">
  Твій браузер не підтримує video.
</video>`,
    pitfalls: ["autoplay без muted блокується більшістю браузерів."],
    related: ["audio", "source"],
  },
  audio: {
    badge: "HTML",
    title: "<audio>",
    whatIsIt: "Вбудований аудіоплеєр — так само, як video, але без відеодоріжки.",
    useCases: ["подкасти", "фонова музика", "звукові ефекти інтерфейсу"],
    syntax: `<audio src="song.mp3" controls></audio>`,
    attributes: [
      { name: "controls", desc: "показує панель керування" },
      { name: "loop", desc: "повторення по колу" },
      { name: "muted", desc: "звук вимкнено спочатку" },
    ],
    example: `<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  Твій браузер не підтримує audio.
</audio>`,
    pitfalls: ["Автовідтворення звуку без дії користувача — погана практика й часто блокується браузером."],
    related: ["video", "source"],
  },
  picture: {
    badge: "HTML",
    title: "<picture>",
    whatIsIt: "Дозволяє показувати різні версії зображення залежно від розміру екрана чи формату, який підтримує браузер. img усередині — обов'язковий запасний варіант.",
    useCases: ["адаптивні зображення під різні екрани", "сучасні формати (webp) з запасним jpg"],
    syntax: `<picture><source srcset="big.jpg" media="(min-width: 800px)"><img src="small.jpg" alt="..."></picture>`,
    attributes: [{ name: "—", desc: "логіка через вкладені <source>" }],
    example: `<picture>
  <source srcset="https://picsum.photos/600/300" media="(min-width: 600px)">
  <img src="https://picsum.photos/300/150" alt="Адаптивне зображення">
</picture>`,
    pitfalls: ["Забутий img усередині — немає запасного варіанту для браузерів, що не підтримують picture."],
    related: ["img", "source"],
  },
  header: {
    badge: "HTML",
    title: "<header>",
    whatIsIt: "Семантичний блок для шапки сторінки чи секції — зазвичай логотип, назва, навігація.",
    useCases: ["шапка сайту", "заголовок статті чи картки"],
    syntax: `<header>...</header>`,
    attributes: [{ name: "—", desc: "семантичний тег без власних атрибутів" }],
    example: `<header>
  <h1>Мій сайт</h1>
  <nav><a href="#">Головна</a></nav>
</header>`,
    pitfalls: ["Плутають з <head> (службовою частиною документа) — це різні теги."],
    related: ["nav", "main", "footer"],
  },
  nav: {
    badge: "HTML",
    title: "<nav>",
    whatIsIt: "Позначає блок з основними навігаційними посиланнями сайту — саме навігацію, а не будь-яку довільну групу посилань.",
    useCases: ["головне меню сайту", "хлібні крихти", "пагінація"],
    syntax: `<nav>...</nav>`,
    attributes: [{ name: "—", desc: "семантичний тег без власних атрибутів" }],
    example: `<nav>
  <a href="#">Головна</a> |
  <a href="#">Про нас</a> |
  <a href="#">Контакти</a>
</nav>`,
    pitfalls: ["Використання nav для будь-якого списку посилань, а не лише навігації."],
    related: ["header", "a"],
  },
  main: {
    badge: "HTML",
    title: "<main>",
    whatIsIt: "Головний унікальний вміст сторінки — те, що відрізняє її від інших сторінок сайту. Має бути один на сторінку.",
    useCases: ["контент статті", "основний вміст будь-якої сторінки"],
    syntax: `<main>...</main>`,
    attributes: [{ name: "—", desc: "семантичний тег без власних атрибутів" }],
    example: `<main>
  <h1>Заголовок статті</h1>
  <p>Основний текст...</p>
</main>`,
    pitfalls: ["Кілька <main> на одній сторінці — помилка розмітки."],
    related: ["header", "footer"],
  },
  section: {
    badge: "HTML",
    title: "<section>",
    whatIsIt: "Групує тематично пов'язаний вміст, зазвичай зі своїм заголовком. На відміну від div, має смислове значення.",
    useCases: ["блок «Про нас»", "розділ «Відгуки»", "тематична частина довгої сторінки"],
    syntax: `<section>...</section>`,
    attributes: [{ name: "—", desc: "семантичний тег без власних атрибутів" }],
    example: `<section>
  <h2>Наші послуги</h2>
  <p>Опис послуг...</p>
</section>`,
    pitfalls: ["Використання замість div без тематичного сенсу — якщо немає заголовка, ймовірно, треба div."],
    related: ["article", "div"],
  },
  article: {
    badge: "HTML",
    title: "<article>",
    whatIsIt: "Самодостатній блок вмісту, що має сенс сам по собі, окремо від решти сторінки — пост, картка товару, коментар.",
    useCases: ["пост у блозі", "картка товару", "коментар користувача"],
    syntax: `<article>...</article>`,
    attributes: [{ name: "—", desc: "семантичний тег без власних атрибутів" }],
    example: `<article>
  <h2>Заголовок посту</h2>
  <p>Текст посту...</p>
</article>`,
    pitfalls: ["Використання для вмісту, що не має сенсу окремо від контексту сторінки — тоді краще section."],
    related: ["section"],
  },
  footer: {
    badge: "HTML",
    title: "<footer>",
    whatIsIt: "Блок наприкінці сторінки чи секції: контакти, копірайт, посилання на соцмережі.",
    useCases: ["підвал сайту", "копірайт і юридична інформація"],
    syntax: `<footer>...</footer>`,
    attributes: [{ name: "—", desc: "семантичний тег без власних атрибутів" }],
    example: `<footer>
  <p>© 2026 Мій сайт</p>
</footer>`,
    pitfalls: ["—"],
    related: ["header", "main"],
  },
  aside: {
    badge: "HTML",
    title: "<aside>",
    whatIsIt: "Побічний вміст, пов'язаний з основним, але не критичний для його розуміння — бічна панель, реклама, пов'язані посилання.",
    useCases: ["бічна панель з пов'язаними статтями", "реклама", "виноски"],
    syntax: `<aside>...</aside>`,
    attributes: [{ name: "—", desc: "семантичний тег без власних атрибутів" }],
    example: `<aside>
  <h3>Пов'язані статті</h3>
  <ul><li><a href="#">Стаття 1</a></li></ul>
</aside>`,
    pitfalls: ["Використання для критично важливого вмісту, без якого сторінка втрачає сенс — aside саме для побічного."],
    related: ["main", "section"],
  },
  strong: {
    badge: "HTML",
    title: "<strong>",
    whatIsIt: "Смислове виділення важливого тексту — за замовчуванням показується жирним, але сенс саме у важливості, а не лише вигляді.",
    useCases: ["важливе попередження в тексті", "ключове слово в реченні"],
    syntax: `<strong>Важливо</strong>`,
    attributes: [{ name: "—", desc: "текстовий тег без власних атрибутів" }],
    example: `<p><strong>Увага:</strong> перевір дані перед відправкою.</p>`,
    pitfalls: ["Використання лише заради жирного вигляду, без реальної важливості — тоді краще CSS font-weight."],
    related: ["em", "b"],
  },
  em: {
    badge: "HTML",
    title: "<em>",
    whatIsIt: "Смисловий наголос на слові чи фразі — за замовчуванням курсивом, але сенс саме в наголосі, а не лише вигляді.",
    useCases: ["наголос на слові в реченні", "зміна змісту через інтонацію"],
    syntax: `<em>наголос</em>`,
    attributes: [{ name: "—", desc: "текстовий тег без власних атрибутів" }],
    example: `<p>Я <em>справді</em> хочу це зробити.</p>`,
    pitfalls: ["Використання лише заради курсиву, без реального смислового наголосу — тоді краще CSS font-style."],
    related: ["strong", "i"],
  },
  mark: {
    badge: "HTML",
    title: "<mark>",
    whatIsIt: "Виділяє текст маркером, як хайлайтером — привертає увагу до частини тексту, релевантної в поточному контексті.",
    useCases: ["підсвітка результатів пошуку", "виділення ключових слів"],
    syntax: `<mark>виділений текст</mark>`,
    attributes: [{ name: "—", desc: "текстовий тег без власних атрибутів" }],
    example: `<p>Знайдено: React — <mark>популярна</mark> бібліотека JavaScript.</p>`,
    pitfalls: ["Зловживання на весь текст втрачає ефект виділення."],
    related: ["strong"],
  },
  code: {
    badge: "HTML",
    title: "<code>",
    whatIsIt: "Фрагмент програмного коду в тексті — показується моноширинним шрифтом. Для блоку коду з кількома рядками поєднується з <pre>.",
    useCases: ["назва змінної чи функції в тексті", "команда терміналу в реченні"],
    syntax: `<code>const x = 5;</code>`,
    attributes: [{ name: "—", desc: "текстовий тег без власних атрибутів" }],
    example: `<p>Використай <code>console.log()</code> для виводу.</p>`,
    pitfalls: ["Використання для звичайного тексту, не пов'язаного з кодом."],
    related: ["pre"],
  },
  pre: {
    badge: "HTML",
    title: "<pre>",
    whatIsIt: "Текст, що зберігає всі пробіли й переноси рядків як написано — на відміну від звичайного HTML, де вони схлопуються.",
    useCases: ["блоки коду (разом з <code>)", "ASCII-арт", "текст із точним форматуванням"],
    syntax: `<pre><code>function f() {}</code></pre>`,
    attributes: [{ name: "—", desc: "текстовий тег без власних атрибутів" }],
    example: `<pre><code>function sum(a, b) {
  return a + b;
}</code></pre>`,
    pitfalls: ["code без pre не зберігає переноси рядків — довгий фрагмент коду зіллється в один рядок."],
    related: ["code"],
  },
  blockquote: {
    badge: "HTML",
    title: "<blockquote>",
    whatIsIt: "Розгорнута цитата з іншого джерела — на відміну від <q> (коротка цитата в рядку), виділяється як окремий блок.",
    useCases: ["цитата з статті чи книги", "відгук клієнта"],
    syntax: `<blockquote cite="url">Текст<cite>Автор</cite></blockquote>`,
    attributes: [{ name: "cite", desc: "URL джерела цитати" }],
    example: `<blockquote>
  <p>Найкращий спосіб навчитись програмувати — писати код щодня.</p>
  <cite>— Невідомий автор</cite>
</blockquote>`,
    pitfalls: ["Використання для тексту, що не є цитатою, лише заради відступу — тоді краще CSS margin."],
    related: ["cite", "q"],
  },
  html: {
    badge: "HTML",
    title: "<html>",
    whatIsIt: "Кореневий елемент кожного HTML-документа — усі інші елементи вкладені в нього. Атрибут lang повідомляє браузеру, скрінрідерам і пошуковим системам, якою мовою написаний вміст сторінки.",
    useCases: ["обов'язковий корінь будь-якого HTML-документа", "вказує мову сторінки через lang (доступність, SEO, перевірка орфографії)"],
    syntax: `<html lang="uk">...</html>`,
    attributes: [
      { name: "lang", desc: "мова вмісту сторінки, напр. \"uk\", \"en\" — важливо для скрінрідерів і пошукових систем" },
      { name: "dir", desc: "напрямок тексту: ltr (типово) або rtl" },
    ],
    example: `<p>Кожна HTML-сторінка має таку структуру:</p>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">&lt;!DOCTYPE html&gt;
&lt;html lang="uk"&gt;
  &lt;head&gt;...&lt;/head&gt;
  &lt;body&gt;...&lt;/body&gt;
&lt;/html&gt;</pre>`,
    pitfalls: [
      "Забутий lang — гірша доступність для скрінрідерів і неправильна перевірка орфографії браузером.",
      "Контент, розміщений поза <html> (до чи після) — браузер сам виправить, але це помилка розмітки.",
    ],
    related: ["head", "meta", "title"],
  },
  head: {
    badge: "HTML",
    title: "<head>",
    whatIsIt: "Контейнер для метаданих документа — інформації, яка не відображається безпосередньо на сторінці: заголовок вкладки, підключення стилів і скриптів, favicon, налаштування для пошукових систем і соцмереж.",
    useCases: ["підключення CSS-файлів і скриптів", "налаштування title, favicon, viewport", "метадані для SEO та соцмереж"],
    syntax: `<head>\n  <meta charset="UTF-8">\n  <title>Назва сторінки</title>\n</head>`,
    attributes: [],
    example: `<p>Типовий вміст &lt;head&gt;:</p>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width"&gt;
  &lt;title&gt;Моя сторінка&lt;/title&gt;
  &lt;link rel="stylesheet" href="style.css"&gt;
&lt;/head&gt;</pre>`,
    pitfalls: [
      "Вміст, який має бути видимим (текст, зображення), випадково поставлений у <head> — браузер його не покаже.",
      "Відсутній <meta charset> — можливі проблеми з кодуванням кирилиці.",
    ],
    related: ["html", "title", "meta", "link"],
  },
  title: {
    badge: "HTML",
    title: "<title>",
    whatIsIt: "Задає назву документа, яка показується в заголовку вкладки браузера, у результатах пошуку та при додаванні сторінки в закладки. Обов'язковий елемент у <head>, може містити лише текст.",
    useCases: ["назва вкладки браузера", "заголовок у результатах пошукової видачі", "назва при збереженні в закладки"],
    syntax: `<title>Назва сторінки</title>`,
    attributes: [],
    example: `<div style="border:1px solid #ccc;border-radius:8px 8px 0 0;overflow:hidden;max-width:260px;font-family:sans-serif;">
  <div style="background:#e5e5e5;padding:6px 10px;font-size:12px;display:flex;align-items:center;gap:6px;">
    <span style="width:8px;height:8px;border-radius:50%;background:#ccc;"></span>
    Про нас — 00100101
  </div>
  <div style="padding:14px;font-size:13px;color:#555;">&lt;title&gt;Про нас — 00100101&lt;/title&gt;</div>
</div>
<p style="font-size:13px;color:#666;">Так виглядає вкладка браузера з таким &lt;title&gt;.</p>`,
    pitfalls: [
      "Занадто довгий title — пошукові системи обрізають його в видачі.",
      "Однаковий title на всіх сторінках сайту — погано для SEO і навігації користувача.",
      "HTML-теги всередині <title> — вони не обробляються, покажуться як текст.",
    ],
    related: ["head", "meta"],
  },
  base: {
    badge: "HTML",
    title: "<base>",
    whatIsIt: "Задає базову URL-адресу, відносно якої браузер обчислює всі відносні посилання (href, src) на сторінці. Може бути лише один <base> у документі, розміщується в <head>.",
    useCases: ["один базовий шлях для всіх відносних посилань сторінки", "зручно, коли сторінка переміщується між середовищами (dev/prod)"],
    syntax: `<base href="https://example.com/docs/">`,
    attributes: [
      { name: "href", desc: "базова URL-адреса для всіх відносних посилань" },
      { name: "target", desc: "типовий target для всіх посилань і форм (напр. \"_blank\")" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">&lt;head&gt;
  &lt;base href="https://example.com/docs/"&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;!-- реально веде на https://example.com/docs/page2 --&gt;
  &lt;a href="page2"&gt;Сторінка 2&lt;/a&gt;
&lt;/body&gt;</pre>`,
    pitfalls: [
      "Два <base> в документі — браузер врахує лише перший.",
      "Забутий <base>, коли на нього розраховують відносні шляхи — посилання ламаються при переміщенні сторінки.",
    ],
    related: ["a", "link"],
  },
  link: {
    badge: "HTML",
    title: "<link>",
    whatIsIt: "Підключає до документа зовнішній ресурс: найчастіше CSS-файл, а також favicon, шрифти чи попереднє завантаження ресурсів. Розміщується в <head>, не має закриваючого тегу.",
    useCases: ["підключення файлу стилів", "favicon сайту", "підключення шрифтів (напр. Google Fonts)", "preload/prefetch ресурсів"],
    syntax: `<link rel="stylesheet" href="style.css">`,
    attributes: [
      { name: "rel", desc: "тип зв'язку: stylesheet, icon, preload, canonical тощо" },
      { name: "href", desc: "шлях до підключеного ресурсу" },
      { name: "type", desc: "MIME-тип ресурсу, напр. \"text/css\"" },
      { name: "media", desc: "для яких пристроїв застосовувати стиль, напр. \"print\"" },
      { name: "crossorigin", desc: "режим CORS-запиту для ресурсу" },
    ],
    example: `<link rel="stylesheet" href="data:text/css,.box{width:60px;height:60px;background:#0ea5e9;border-radius:8px}">
<div class="box"></div>
<p style="font-size:13px;color:#666;">Стиль підключено через &lt;link&gt; (тут — data-URL замість файлу).</p>`,
    pitfalls: [
      "Неправильний rel (напр. \"style\" замість \"stylesheet\") — браузер проігнорує ресурс.",
      "Підключення favicon без rel=\"icon\" — деякі браузери не підхоплять іконку.",
    ],
    related: ["head", "meta", "style"],
  },
  meta: {
    badge: "HTML",
    title: "<meta>",
    whatIsIt: "Задає метадані документа, які не мають візуального представлення: кодування символів, опис для пошукових систем, налаштування масштабування на мобільних, теги для соцмереж (Open Graph). Розміщується в <head>.",
    useCases: ["вказати кодування (charset)", "адаптивність на мобільних (viewport)", "опис сторінки для SEO", "превʼю для соцмереж (Open Graph)"],
    syntax: `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">`,
    attributes: [
      { name: "charset", desc: "кодування символів документа, майже завжди \"UTF-8\"" },
      { name: "name", desc: "тип метаданих: viewport, description, author тощо" },
      { name: "content", desc: "значення метаданих, вказаних у name або http-equiv" },
      { name: "http-equiv", desc: "емулює HTTP-заголовок, напр. refresh чи content-security-policy" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;meta name="description" content="Навчальна платформа програмування"&gt;</pre>
<p style="font-size:13px;color:#666;">Ці рядки не видно на сторінці, але вони критично важливі для коректного відображення й SEO.</p>`,
    pitfalls: [
      "Відсутній viewport — на мобільних сторінка масштабується як десктопна, дрібний текст.",
      "Неправильний або відсутній charset — кирилиця показується «кракозябрами».",
      "Занадто довгий description — пошукові системи обрізають його в результатах.",
    ],
    related: ["head", "title", "link"],
  },
  script: {
    badge: "HTML",
    title: "<script>",
    whatIsIt: "Вбудовує або підключає JavaScript-код, який виконується браузером. Може містити код прямо всередині тега або посилатись на зовнішній файл через src.",
    useCases: ["додати інтерактивність сторінці", "підключити зовнішню бібліотеку чи файл скрипта", "маніпуляції з DOM після завантаження сторінки"],
    syntax: `<script src="app.js" defer></script>`,
    attributes: [
      { name: "src", desc: "шлях до зовнішнього файлу скрипта" },
      { name: "type", desc: "тип скрипта, напр. \"module\" для ES-модулів" },
      { name: "defer", desc: "виконати скрипт після парсингу HTML, у порядку підключення" },
      { name: "async", desc: "завантажити й виконати скрипт асинхронно, як тільки готовий" },
    ],
    example: `<p id="out">Завантаження...</p>
<script>
  document.getElementById('out').textContent = 'Скрипт виконався і змінив текст!';
<\/script>`,
    pitfalls: [
      "<script> без defer/async у <head> блокує рендеринг сторінки до його завантаження.",
      "Звернення до DOM-елемента, якого ще немає (скрипт до елемента в розмітці) — елемент буде null.",
      "Підключення скрипта з ненадійного джерела — ризик XSS.",
    ],
    related: ["style", "noscript"],
  },
  style: {
    badge: "HTML",
    title: "<style>",
    whatIsIt: "Вбудовує CSS-правила прямо в документ, без окремого файлу. Зазвичай розміщується в <head>, застосовується до всієї сторінки за вказаними селекторами.",
    useCases: ["локальні стилі для однієї сторінки", "швидкий прототип без окремого CSS-файлу", "критичні стилі, вбудовані для швидшого першого рендеру"],
    syntax: `<style>\n  .box { width: 60px; height: 60px; background: #7c3aed; }\n</style>`,
    attributes: [
      { name: "media", desc: "для яких пристроїв застосовувати стилі, напр. \"print\"" },
      { name: "type", desc: "тип вмісту, типово \"text/css\" (можна не вказувати)" },
    ],
    example: `<style>
  .box { width: 60px; height: 60px; background: #7c3aed; border-radius: 8px; transition: transform 0.2s; }
  .box:hover { transform: rotate(20deg); }
</style>
<div class="box"></div>`,
    pitfalls: [
      "Багато <style> блоків розкидано по сторінці — важко підтримувати, краще один файл CSS.",
      "Однакові селектори в різних <style> — правило, яке йде пізніше, переможе (каскад).",
    ],
    related: ["link", "css-flexbox"],
  },
  noscript: {
    badge: "HTML",
    title: "<noscript>",
    whatIsIt: "Показує альтернативний вміст, якщо в браузері користувача вимкнено або не підтримується JavaScript. Якщо скрипти працюють — вміст <noscript> просто ігнорується.",
    useCases: ["повідомлення \"увімкніть JavaScript\" для сторінок, що без нього не працюють", "запасний вміст для пошукових ботів без JS"],
    syntax: `<noscript>Для роботи сайту потрібен JavaScript.</noscript>`,
    attributes: [],
    example: `<p>У цьому браузері JavaScript увімкнено, тому вміст нижче звичайно НЕ показується:</p>
<noscript>
  <p style="color:red;">Будь ласка, увімкніть JavaScript для роботи сайту.</p>
</noscript>
<p style="font-size:13px;color:#666;">(Перевірити можна, вимкнувши JS у налаштуваннях браузера.)</p>`,
    pitfalls: [
      "Покладатись, що <noscript> побачить хтось із увімкненим JS — він призначений саме для випадку, коли JS вимкнено.",
      "Забутий <noscript> на SPA-сайтах — користувач без JS бачить порожню сторінку без пояснень.",
    ],
    related: ["script"],
  },

  b: {
    badge: "HTML",
    title: "<b>",
    whatIsIt: "Виділяє текст жирним шрифтом без додаткового семантичного значення — просто стилістичне виділення (напр. ключові слова в рецепті), на відміну від <strong>, який означає важливість.",
    useCases: ["ключові слова в тексті без особливої важливості", "назви продуктів у оглядах", "стилістичне виділення без семантики"],
    syntax: `<b>жирний текст</b>`,
    attributes: [],
    example: `<p>У рецепті потрібні <b>борошно</b>, <b>цукор</b> і <b>яйця</b>.</p>`,
    pitfalls: [
      "Використання <b> там, де текст справді важливий — тоді правильніше <strong>.",
      "Зловживання <b> замість CSS font-weight для суто візуального стилю поза текстовим контентом.",
    ],
    related: ["strong", "i", "mark"],
  },
  i: {
    badge: "HTML",
    title: "<i>",
    whatIsIt: "Виділяє текст курсивом для позначення іншого тону мовлення: технічні терміни, думки, назви кораблів, іншомовні фрази. На відміну від <em>, не означає смислового наголосу.",
    useCases: ["наукові назви видів (лат.)", "іншомовні слова та фрази", "думки персонажа в художньому тексті", "назви суден, літаків"],
    syntax: `<i>термін чи фраза</i>`,
    attributes: [],
    example: `<p>Вид <i>Panthera leo</i> також відомий як лев.</p>
<p>Це було <i>déjà vu</i> — я вже бачив цю сцену.</p>`,
    pitfalls: [
      "Використання <i> для смислового наголосу — для цього призначений <em>.",
      "Курсив лише заради вигляду поза текстовим контентом — краще CSS font-style: italic.",
    ],
    related: ["em", "b", "cite"],
  },
  small: {
    badge: "HTML",
    title: "<small>",
    whatIsIt: "Позначає дрібний друк: застереження, авторські права, юридичні примітки — текст другорядного значення, який традиційно друкують меншим шрифтом.",
    useCases: ["copyright у футері сайту", "застереження та дрібні примітки", "умови акції дрібним шрифтом"],
    syntax: `<small>© 2024 Компанія. Усі права захищено.</small>`,
    attributes: [],
    example: `<p>Товар зі знижкою 50%.</p>
<p><small>* Знижка діє лише на товари зі складу, до 31 грудня.</small></p>`,
    pitfalls: [
      "Використання <small> лише для зменшення розміру шрифту без відповідного змісту (застереження) — тоді краще CSS.",
      "Вкладання великих блоків тексту в <small> — семантично призначений для коротких приміток.",
    ],
    related: ["p", "footer"],
  },
  del: {
    badge: "HTML",
    title: "<del>",
    whatIsIt: "Позначає текст, який було видалено з документа — браузер типово показує його закресленим. Часто використовується разом з <ins> для показу історії змін, наприклад старої й нової ціни.",
    useCases: ["стара ціна при знижці", "показ видалених фрагментів у режимі відстеження змін", "закреслені пункти в списку завдань"],
    syntax: `<del>стара ціна</del> <ins>нова ціна</ins>`,
    attributes: [
      { name: "cite", desc: "URL документа, що пояснює причину видалення" },
      { name: "datetime", desc: "дата й час видалення" },
    ],
    example: `<p>Ціна: <del>1200 грн</del> <ins>899 грн</ins></p>`,
    pitfalls: [
      "Плутанина з <s> — <del> означає саме видалення/зміну змісту, а <s> — те, що більше не актуальне чи не вірне.",
      "Використання лише заради закресленого стилю без реального сенсу видалення — тоді CSS text-decoration.",
    ],
    related: ["ins", "s"],
  },
  ins: {
    badge: "HTML",
    title: "<ins>",
    whatIsIt: "Позначає текст, доданий до документа — браузер типово підкреслює його. Часто йде в парі з <del> для наочного показу того, що змінилось (стара/нова ціна, редакторські правки).",
    useCases: ["нова ціна поруч зі старою", "показ доданого тексту в режимі відстеження змін"],
    syntax: `<del>стара ціна</del> <ins>нова ціна</ins>`,
    attributes: [
      { name: "cite", desc: "URL документа, що пояснює причину додавання" },
      { name: "datetime", desc: "дата й час додавання" },
    ],
    example: `<p>Було: <del>Зустріч у понеділок</del></p>
<p>Стало: <ins>Зустріч у середу</ins></p>`,
    pitfalls: [
      "Використання <ins> просто для підкреслення тексту без сенсу «додавання» — краще CSS text-decoration: underline.",
      "Підкреслений текст легко сплутати з посиланням — обережно з візуальним стилем.",
    ],
    related: ["del", "u"],
  },
  s: {
    badge: "HTML",
    title: "<s>",
    whatIsIt: "Позначає текст, який більше не є правильним чи актуальним, але не видалений з документа — наприклад стара ціна, що більше не діє, чи виконаний пункт списку. На відміну від <del>, не означає редакційне видалення.",
    useCases: ["стара ціна, що більше не актуальна", "виконані пункти списку завдань", "застарілі дані, залишені для контексту"],
    syntax: `<s>застарілий текст</s>`,
    attributes: [],
    example: `<ul>
  <li><s>Купити молоко</s></li>
  <li>Купити хліб</li>
</ul>`,
    pitfalls: [
      "Плутанина з <del> — <s> для «більше не актуально», <del> для «видалено з документа».",
      "Використання суто заради закресленого вигляду тексту — тоді CSS text-decoration: line-through.",
    ],
    related: ["del", "ins"],
  },
  u: {
    badge: "HTML",
    title: "<u>",
    whatIsIt: "Підкреслює текст без особливого смислового значення — типово для позначення власних назв, орфографічних анотацій, або нестандартного тексту (напр. підкреслення технічного терміна в науковому тексті).",
    useCases: ["позначення орфографічних помилок для перевірки", "власні назви за традицією деяких мов", "нестандартний текст, що виділяється підкресленням"],
    syntax: `<u>підкреслений текст</u>`,
    attributes: [],
    example: `<p>Слово <u>нащьо</u> написане з помилкою.</p>`,
    pitfalls: [
      "Підкреслений текст легко сплутати з посиланням — використовуй обережно поза посиланнями.",
      "Використання <u> для наголосу замість <em>/<strong> — семантично неправильно.",
    ],
    related: ["ins", "s"],
  },
  sub: {
    badge: "HTML",
    title: "<sub>",
    whatIsIt: "Робить текст нижнім індексом — зменшеним і зсунутим нижче базової лінії рядка. Використовується в хімічних формулах, математичних виразах, виносках.",
    useCases: ["хімічні формули (H2O)", "математичні індекси (a1, xn)", "виноски-посилання в тексті"],
    syntax: `H<sub>2</sub>O`,
    attributes: [],
    example: `<p>Формула води: H<sub>2</sub>O</p>
<p>Вуглекислий газ: CO<sub>2</sub></p>`,
    pitfalls: [
      "Використання <sub> для звичайного зменшення шрифту без сенсу індексу — краще CSS font-size.",
      "Вкладання великих фрагментів тексту в <sub> — погана читабельність.",
    ],
    related: ["sup"],
  },
  sup: {
    badge: "HTML",
    title: "<sup>",
    whatIsIt: "Робить текст верхнім індексом — зменшеним і піднятим над базовою лінією рядка. Використовується в математичних степенях, виносках, скорочених позначеннях на кшталт 1-го, 2-го тощо.",
    useCases: ["математичні степені (x2, 10³)", "виноски в тексті (текст¹)", "скорочення порядкових числівників"],
    syntax: `x<sup>2</sup>`,
    attributes: [],
    example: `<p>Площа кола: πr<sup>2</sup></p>
<p>Це твердження вимагає уточнення<sup>1</sup>.</p>`,
    pitfalls: [
      "Використання <sup> лише для зменшення шрифту без сенсу степеня чи виноски — краще CSS.",
      "Надлишкове використання ускладнює читання довгих текстів.",
    ],
    related: ["sub"],
  },
  abbr: {
    badge: "HTML",
    title: "<abbr>",
    whatIsIt: "Позначає скорочення чи абревіатуру. Атрибут title містить повну розшифровку, яка показується як підказка при наведенні курсора — корисно для доступності й розуміння тексту.",
    useCases: ["скорочення з розшифровкою при наведенні (HTML, CSS, SQL)", "офіційні абревіатури організацій", "покращення доступності для читачів, незнайомих зі скороченням"],
    syntax: `<abbr title="HyperText Markup Language">HTML</abbr>`,
    attributes: [{ name: "title", desc: "повна розшифровка скорочення, показується як підказка" }],
    example: `<p>Наведи курсор на <abbr title="HyperText Markup Language">HTML</abbr>, щоб побачити розшифровку.</p>`,
    pitfalls: [
      "Відсутній title — скорочення втрачає сенс для незнайомих із ним читачів.",
      "На тач-екранах підказка title не з'являється при дотику — не покладайся лише на abbr для критичної інформації.",
    ],
    related: ["dfn", "title"],
  },
  cite: {
    badge: "HTML",
    title: "<cite>",
    whatIsIt: "Позначає назву творчої роботи — книги, статті, фільму, пісні, наукової праці. Часто використовується разом із <blockquote> для вказання джерела цитати.",
    useCases: ["назва книги чи статті в тексті", "джерело цитати в <blockquote>", "посилання на назву фільму, пісні, картини"],
    syntax: `<cite>Кобзар</cite>, Тарас Шевченко`,
    attributes: [],
    example: `<blockquote>
  <p>Учітесь, читайте, і чужому научайтесь, й свого не цурайтесь.</p>
  <footer>— <cite>Кобзар</cite>, Тарас Шевченко</footer>
</blockquote>`,
    pitfalls: [
      "Використання <cite> для імені автора-людини — <cite> призначений саме для назви твору, а не автора.",
      "Плутанина з <q>/<blockquote> — <cite> позначає лише назву джерела, не сам текст цитати.",
    ],
    related: ["blockquote", "q"],
  },
  q: {
    badge: "HTML",
    title: "<q>",
    whatIsIt: "Позначає коротку вбудовану в текст цитату — браузер сам додає лапки навколо неї (на відміну від <blockquote>, що виділяє цитату окремим блоком).",
    useCases: ["коротка цитата в середині речення", "пряма мова персонажа в художньому тексті"],
    syntax: `<q>Текст цитати</q>`,
    attributes: [{ name: "cite", desc: "URL джерела цитати" }],
    example: `<p>Як казав вчитель: <q>Практика — найкращий спосіб навчитись.</q></p>`,
    pitfalls: [
      "Ручне додавання лапок всередині <q> — браузер додає їх сам, вийде подвійно.",
      "Використання <q> для довгих цитат — для цього краще <blockquote>.",
    ],
    related: ["blockquote", "cite"],
  },
  kbd: {
    badge: "HTML",
    title: "<kbd>",
    whatIsIt: "Позначає введення користувача з клавіатури — назви клавіш чи їх комбінації. Типово відображається моноширинним шрифтом, часто стилізується як маленька кнопка клавіші.",
    useCases: ["документація гарячих клавіш (Ctrl+C)", "інструкції з натискання клавіш у туторіалах"],
    syntax: `Натисни <kbd>Ctrl</kbd> + <kbd>C</kbd>`,
    attributes: [],
    example: `<style>
  kbd { background: #eee; border: 1px solid #bbb; border-radius: 4px; padding: 2px 6px; font-family: monospace; box-shadow: 0 1px 0 #bbb; }
</style>
<p>Скопіюй виділений текст: <kbd>Ctrl</kbd> + <kbd>C</kbd></p>`,
    pitfalls: [
      "Використання <kbd> для звичайного коду замість <code> — вони мають різний сенс.",
      "Без CSS-стилізації <kbd> виглядає як звичайний моноширинний текст — легко пропустити в інструкції.",
    ],
    related: ["code", "samp"],
  },

  samp: {
    badge: "HTML",
    title: "<samp>",
    whatIsIt: "Позначає приклад виводу програми чи системи — те, що видала команда, скрипт або пристрій. Типово моноширинний шрифт, як і <code>, але означає саме вивід, а не сам код.",
    useCases: ["показ виводу команди в терміналі", "повідомлення про помилку від програми", "результат виконання функції в документації"],
    syntax: `<samp>Файл успішно збережено.</samp>`,
    attributes: [],
    example: `<p>Команда: <code>ls</code></p>
<p>Вивід: <samp>index.html  style.css  script.js</samp></p>`,
    pitfalls: [
      "Плутанина з <code> — <code> для самого коду, <samp> для того, що цей код вивів.",
      "Використання для введення користувача — для цього призначений <kbd>.",
    ],
    related: ["code", "kbd", "pre"],
  },
  var: {
    badge: "HTML",
    title: "<var>",
    whatIsIt: "Позначає назву змінної в математичному виразі чи в програмному контексті. Типово відображається курсивом, семантично відрізняється від <i>, оскільки означає саме змінну.",
    useCases: ["змінні в математичних формулах (x, y, n)", "назви параметрів у документації функцій"],
    syntax: `<var>x</var> + <var>y</var> = 10`,
    attributes: [],
    example: `<p>Формула площі прямокутника: <var>S</var> = <var>a</var> × <var>b</var></p>`,
    pitfalls: [
      "Використання <var> для звичайного курсиву без сенсу змінної — тоді <i> або CSS.",
      "Плутанина з <code> — <var> саме для назви змінної, а не фрагмента коду.",
    ],
    related: ["code", "i"],
  },
  time: {
    badge: "HTML",
    title: "<time>",
    whatIsIt: "Позначає дату, час або тривалість у машинозчитуваному форматі через атрибут datetime, при цьому текст усередині може бути в зручному для людини вигляді. Допомагає браузерам і пошуковим системам розпізнавати дати.",
    useCases: ["дата публікації статті", "час події в календарі", "тривалість відео чи треку"],
    syntax: `<time datetime="2024-03-15">15 березня 2024</time>`,
    attributes: [
      { name: "datetime", desc: "машинозчитувана дата/час у форматі ISO 8601, напр. \"2024-03-15\"" },
    ],
    example: `<p>Стаття опублікована: <time datetime="2024-03-15">15 березня 2024</time></p>
<p>Тривалість відео: <time datetime="PT15M">15 хвилин</time></p>`,
    pitfalls: [
      "Відсутній або неправильний формат datetime — браузери й пошукові боти не зможуть розпізнати дату.",
      "Довільний текстовий формат дати без datetime — втрачається головна перевага елемента.",
    ],
    related: ["data"],
  },
  data: {
    badge: "HTML",
    title: "<data>",
    whatIsIt: "Зв'язує людинозрозумілий текст із машинозчитуваним значенням через атрибут value — наприклад, назву товару з його артикулом, який може використати скрипт чи пошуковик.",
    useCases: ["артикул товару поруч із назвою", "код країни поруч із назвою", "будь-яке значення, яке скрипти мають читати окремо від тексту"],
    syntax: `<data value="12345">Клавіатура механічна</data>`,
    attributes: [{ name: "value", desc: "машинозчитуване значення, пов'язане з текстом усередині" }],
    example: `<ul>
  <li><data value="101">Клавіатура механічна</data></li>
  <li><data value="102">Мишка бездротова</data></li>
</ul>`,
    pitfalls: [
      "Для дат і часу краще використовувати <time>, а не <data> — він спеціалізований.",
      "Value без реального використання скриптом — тоді <data> не дає переваги над звичайним <span>.",
    ],
    related: ["time"],
  },
  bdi: {
    badge: "HTML",
    title: "<bdi>",
    whatIsIt: "Ізолює фрагмент тексту від напрямку сусіднього тексту — корисно, коли на сторінці змішуються мови з різним напрямком письма (напр. українська й арабська/іврит) і потрібно, щоб вставлений текст не «зламав» напрямок навколишнього.",
    useCases: ["імена користувачів невідомою мовою в списках/коментарях", "змішування мов з різним напрямком письма на одній сторінці"],
    syntax: `<bdi>שלום</bdi>`,
    attributes: [],
    example: `<p>Користувач <bdi>مرحبا</bdi> залишив коментар о 14:00.</p>
<p style="font-size:13px;color:#666;">Без &lt;bdi&gt; текст справа-наліво міг би зсунути порядок сусідніх слів.</p>`,
    pitfalls: [
      "Плутанина з <bdo> — <bdi> ізолює напрямок, а <bdo> примусово його змінює.",
      "Забутий <bdi> навколо контенту користувача невідомої мови — верстка може «поїхати» при змішуванні напрямків.",
    ],
    related: ["bdo"],
  },
  bdo: {
    badge: "HTML",
    title: "<bdo>",
    whatIsIt: "Примусово перевизначає напрямок відображення тексту — зліва направо (ltr) чи справа наліво (rtl), незалежно від того, якою мовою написаний текст.",
    useCases: ["демонстрація тексту в протилежному напрямку в навчальних цілях", "спеціальні випадки форматування текстів мов з rtl"],
    syntax: `<bdo dir="rtl">Текст справа наліво</bdo>`,
    attributes: [{ name: "dir", desc: "напрямок відображення: ltr або rtl" }],
    example: `<p><bdo dir="rtl">Цей текст показано справа наліво</bdo></p>`,
    pitfalls: [
      "Використання <bdo> замість атрибута lang/dir на <html> для загального напрямку сторінки — <bdo> для локальних фрагментів.",
      "Забування, що це саме примусова зміна, а не автоматичне визначення напрямку (для цього <bdi>).",
    ],
    related: ["bdi"],
  },
  ruby: {
    badge: "HTML",
    title: "<ruby>",
    whatIsIt: "Разом із <rt> і <rp> показує ruby-анотації — маленькі пояснювальні підписи над чи поруч з основним текстом, типово для транскрипції ієрогліфів у східноазійських мовах (напр. фуригана в японській).",
    useCases: ["фуригана для японських ієрогліфів", "транскрипція вимови складних слів", "пояснювальні підписи над текстом"],
    syntax: `<ruby>漢字<rt>かんじ</rt></ruby>`,
    attributes: [],
    example: `<p style="font-size:24px;"><ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby></p>
<p style="font-size:13px;color:#666;">Маленький підпис зверху — вимова ієрогліфів.</p>`,
    pitfalls: [
      "Використання поза мовами, де прийняті ruby-анотації — рідко потрібне для звичайних текстів.",
      "Забутий <rp> — у браузерах без підтримки ruby текст може виглядати незрозуміло без дужок-запасного варіанту.",
    ],
    related: ["rt", "rp"],
  },
  rt: {
    badge: "HTML",
    title: "<rt>",
    whatIsIt: "Містить саму ruby-анотацію (пояснювальний текст) всередині елемента <ruby> — те, що показується маленьким підписом над чи поруч з основним текстом.",
    useCases: ["текст вимови всередині <ruby>", "транскрипція чи переклад окремого символа/слова"],
    syntax: `<ruby>字<rt>じ</rt></ruby>`,
    attributes: [],
    example: `<p style="font-size:24px;"><ruby>水<rt>みず</rt></ruby></p>`,
    pitfalls: [
      "<rt> поза <ruby> не має сенсу — завжди використовується як дочірній елемент.",
      "Занадто довгий текст у <rt> — ruby-анотації призначені для коротких підписів.",
    ],
    related: ["ruby", "rp"],
  },
  rp: {
    badge: "HTML",
    title: "<rp>",
    whatIsIt: "Задає запасні дужки навколо ruby-анотації для браузерів, які не підтримують <ruby> — без цієї підтримки текст в <rp> показується як звичайні дужки, а сучасні браузери його приховують.",
    useCases: ["запасне відображення ruby-анотацій у старих браузерах"],
    syntax: `<ruby>字<rp>(</rp><rt>じ</rt><rp>)</rp></ruby>`,
    attributes: [],
    example: `<p style="font-size:24px;"><ruby>本<rp>(</rp><rt>ほん</rt><rp>)</rp></ruby></p>
<p style="font-size:13px;color:#666;">У сучасних браузерах дужки з &lt;rp&gt; приховані — видно лише маленький підпис.</p>`,
    pitfalls: [
      "Забутий <rp> — у браузерах без підтримки ruby текст злипається без роздільників.",
      "<rp> має сенс лише в парі з <rt> всередині <ruby>.",
    ],
    related: ["ruby", "rt"],
  },
  dfn: {
    badge: "HTML",
    title: "<dfn>",
    whatIsIt: "Позначає термін, що визначається саме в цьому місці тексту — тобто це місце, де слово вперше пояснюється. Типово показується курсивом, семантично відрізняється від простого виділення.",
    useCases: ["перше визначення терміна в статті чи документації", "глосарії та словники термінів"],
    syntax: `<dfn>HTML</dfn> — мова розмітки гіпертексту.`,
    attributes: [{ name: "title", desc: "можна вказати визначення, якщо термін не є прямим текстом всередині" }],
    example: `<p><dfn>API</dfn> — набір правил, за якими одна програма може звертатись до іншої.</p>`,
    pitfalls: [
      "Використання <dfn> кожного разу, коли термін згадується, а не лише при першому визначенні.",
      "Плутанина з <abbr> — <dfn> позначає визначення терміна, а не скорочення.",
    ],
    related: ["abbr"],
  },
  wbr: {
    badge: "HTML",
    title: "<wbr>",
    whatIsIt: "Підказує браузеру можливе місце для переносу довгого слова чи URL, якщо воно не влазить у рядок. Сам по собі перенос не примусовий — спрацьовує лише за потреби.",
    useCases: ["перенос довгих URL чи назв файлів у вузьких блоках", "довгі слова без пробілів, що ламають верстку"],
    syntax: `супер<wbr>довге<wbr>слово`,
    attributes: [],
    example: `<div style="width:120px;border:1px solid #ccc;padding:6px;font-family:monospace;font-size:13px;">
  https://example.com/<wbr>дуже/<wbr>довгий/<wbr>шлях/<wbr>до/<wbr>файлу
</div>`,
    pitfalls: [
      "Плутанина з <br> — <wbr> лише пропонує можливе місце розриву, не примусовий перенос рядка.",
      "Зайве розставляння <wbr> по всьому тексту замість лише проблемних довгих слів.",
    ],
    related: ["br"],
  },
  br: {
    badge: "HTML",
    title: "<br>",
    whatIsIt: "Вставляє примусовий перенос рядка всередині тексту — використовується там, де розрив рядка є частиною змісту (адреса, вірш), а не просто для візуального відступу.",
    useCases: ["новий рядок у поштовій адресі", "переноси рядків у поезії чи піснях"],
    syntax: `Рядок перший<br>Рядок другий`,
    attributes: [],
    example: `<p>
  Компанія 00100101<br>
  вул. Прикладна, 1<br>
  Київ, Україна
</p>`,
    pitfalls: [
      "Використання декількох <br><br> замість CSS margin для відступів між блоками — погана практика.",
      "<br> для розділення структурних блоків замість <p> чи <div> — семантично неправильно.",
    ],
    related: ["wbr", "hr"],
  },
  hr: {
    badge: "HTML",
    title: "<hr>",
    whatIsIt: "Позначає тематичний розрив між блоками контенту — наприклад, зміну теми в статті чи розділ між секціями. Браузер типово показує його горизонтальною лінією, але семантичне значення важливіше за вигляд.",
    useCases: ["розділення розділів статті", "візуальний розрив між тематично різним контентом", "розділювач у списку новин"],
    syntax: `<p>Перший розділ.</p>\n<hr>\n<p>Другий розділ.</p>`,
    attributes: [],
    example: `<p>Перша новина дня...</p>
<hr>
<p>Друга новина дня...</p>`,
    pitfalls: [
      "Використання <hr> просто для декоративної лінії без сенсу розриву теми — тоді CSS border.",
      "Багато <hr> поспіль замість реальної структури секцій.",
    ],
    related: ["section", "br"],
  },

  iframe: {
    badge: "HTML",
    title: "<iframe>",
    whatIsIt: "Вбудовує іншу HTML-сторінку всередину поточної — окремий документ у своєму «вікні» на сторінці. Використовується для вбудованих карт, відео з YouTube, віджетів, реклами.",
    useCases: ["вбудоване відео з YouTube", "карта Google Maps на сторінці контактів", "віджети сторонніх сервісів"],
    syntax: `<iframe src="https://example.com" width="300" height="150"></iframe>`,
    attributes: [
      { name: "src", desc: "URL вбудованої сторінки" },
      { name: "width / height", desc: "розміри вбудованого вікна" },
      { name: "sandbox", desc: "обмежує можливості вбудованого документа (без нього — повний доступ)" },
      { name: "loading", desc: "'lazy' відкладає завантаження, поки не докрутиш до iframe" },
      { name: "title", desc: "текстовий опис для доступності — обов'язковий" },
    ],
    example: `<iframe srcdoc="<h3>Вбудований документ</h3><p>Це окрема HTML-сторінка всередині iframe.</p>" title="приклад" style="width:100%;height:100px;border:1px solid #ccc;border-radius:6px;"></iframe>`,
    pitfalls: [
      "Без sandbox вбудована сторінка має повний доступ до можливостей браузера — ризик безпеки для стороннього вмісту.",
      "Відсутній title — проблема з доступністю для скрінрідерів.",
      "Забагато iframe на сторінці сповільнює завантаження.",
    ],
    related: ["embed", "object"],
  },
  embed: {
    badge: "HTML",
    title: "<embed>",
    whatIsIt: "Вбудовує зовнішній ресурс (зображення, PDF, застарілий плагін-контент), який обробляється відповідним плагіном браузера. Самозакривний тег, без резервного вмісту на відміну від <object>.",
    useCases: ["вбудовування PDF-файлу", "застарілий мультимедійний контент через плагіни"],
    syntax: `<embed src="file.pdf" type="application/pdf" width="300" height="200">`,
    attributes: [
      { name: "src", desc: "адреса вбудованого ресурсу" },
      { name: "type", desc: "MIME-тип ресурсу" },
      { name: "width / height", desc: "розміри вбудованого вікна" },
    ],
    example: `<embed src="https://picsum.photos/300/150" type="image/jpeg" width="300" height="150">`,
    pitfalls: [
      "Немає запасного вмісту, якщо ресурс не завантажиться — на відміну від <object>.",
      "У сучасних застосунках частіше варто <img>, <video> чи <iframe> замість <embed>.",
    ],
    related: ["object", "iframe"],
  },
  object: {
    badge: "HTML",
    title: "<object>",
    whatIsIt: "Вбудовує зовнішній ресурс (PDF, зображення, інший HTML-документ) з можливістю показати резервний вміст усередині тега, якщо ресурс не завантажиться — на відміну від <embed>.",
    useCases: ["вбудовування PDF з текстом-заміною", "зображення з резервним описом", "вбудовування інших HTML-документів"],
    syntax: `<object data="file.pdf" type="application/pdf">Резервний текст</object>`,
    attributes: [
      { name: "data", desc: "адреса вбудованого ресурсу" },
      { name: "type", desc: "MIME-тип ресурсу" },
      { name: "width / height", desc: "розміри вбудованого вікна" },
    ],
    example: `<object data="does-not-exist.pdf" type="application/pdf" width="300" height="60" style="border:1px solid #ccc;">
  <p style="padding:8px;">Не вдалося завантажити PDF — це резервний вміст.</p>
</object>`,
    pitfalls: [
      "Забутий резервний вміст усередині — тоді при помилці користувач бачить порожнє місце.",
      "Непослідовна підтримка типів файлів у різних браузерах.",
    ],
    related: ["embed", "iframe"],
  },
  figure: {
    badge: "HTML",
    title: "<figure>",
    whatIsIt: "Групує самодостатній контент (зображення, діаграму, код, цитату) разом із підписом <figcaption>. Семантично позначає, що вміст можна перемістити в інше місце статті без втрати сенсу.",
    useCases: ["зображення з підписом", "діаграма чи графік зі стислим поясненням", "блок коду з підписом-поясненням"],
    syntax: `<figure>\n  <img src="chart.png" alt="...">\n  <figcaption>Підпис до зображення</figcaption>\n</figure>`,
    attributes: [],
    example: `<figure style="text-align:center;">
  <img src="https://picsum.photos/300/150" alt="Випадкове зображення" style="border-radius:6px;">
  <figcaption style="font-size:13px;color:#666;margin-top:6px;">Мал. 1 — приклад ілюстрації</figcaption>
</figure>`,
    pitfalls: [
      "Використання <figure> для будь-якого зображення без сенсу «ілюстрації» — не завжди потрібне, іноді досить <img>.",
      "Figcaption не обов'язковий, але без нього <figure> втрачає головну перевагу.",
    ],
    related: ["figcaption", "img"],
  },
  figcaption: {
    badge: "HTML",
    title: "<figcaption>",
    whatIsIt: "Підпис до вмісту <figure> — може стояти першим або останнім дочірнім елементом. Пов'язує текстовий опис із зображенням, діаграмою чи іншим самодостатнім блоком.",
    useCases: ["підпис під зображенням", "джерело чи автор ілюстрації", "пояснення до графіка"],
    syntax: `<figure>\n  <img src="..." alt="...">\n  <figcaption>Опис</figcaption>\n</figure>`,
    attributes: [],
    example: `<figure style="text-align:center;">
  <img src="https://picsum.photos/300/150" alt="Фото" style="border-radius:6px;">
  <figcaption style="font-size:13px;color:#666;margin-top:6px;">Фото: Unsplash</figcaption>
</figure>`,
    pitfalls: [
      "<figcaption> поза <figure> не має сенсу — завжди дочірній елемент <figure>.",
      "Кілька <figcaption> в одному <figure> — дозволяється лише один.",
    ],
    related: ["figure"],
  },
  source: {
    badge: "HTML",
    title: "<source>",
    whatIsIt: "Вказує альтернативне джерело медіафайлу всередині <video>, <audio> чи <picture> — браузер сам обирає перший підтримуваний варіант із кількох. Самозакривний тег.",
    useCases: ["кілька форматів відео/аудіо (mp4, webm) для сумісності", "різні розміри зображення в <picture> під різні екрани"],
    syntax: `<video controls>\n  <source src="movie.webm" type="video/webm">\n  <source src="movie.mp4" type="video/mp4">\n</video>`,
    attributes: [
      { name: "src", desc: "адреса медіафайлу (для video/audio)" },
      { name: "srcset", desc: "адреса зображення (для picture)" },
      { name: "type", desc: "MIME-тип файлу — браузер обирає перший, який підтримує" },
      { name: "media", desc: "медіа-умова для picture, напр. мінімальна ширина екрана" },
    ],
    example: `<audio controls>
  <source src="song.ogg" type="audio/ogg">
  <source src="song.mp3" type="audio/mpeg">
  Твій браузер не підтримує audio.
</audio>`,
    pitfalls: [
      "<source> завжди йде до запасного контенту (img чи тексту), а не після нього.",
      "Неправильний порядок <source> — браузер бере перший підтримуваний, тож найкращий формат вказуй першим.",
    ],
    related: ["video", "audio", "picture", "track"],
  },
  track: {
    badge: "HTML",
    title: "<track>",
    whatIsIt: "Додає текстову доріжку до <video> чи <audio> — субтитри, підписи для людей з вадами слуху, або розділи-глави. Файл доріжки має формат WebVTT.",
    useCases: ["субтитри іншою мовою", "підписи для людей з вадами слуху", "розділи-глави у відео"],
    syntax: `<video controls>\n  <source src="movie.mp4">\n  <track kind="subtitles" src="subs-uk.vtt" srclang="uk" label="Українська" default>\n</video>`,
    attributes: [
      { name: "kind", desc: "тип доріжки: subtitles, captions, chapters, descriptions" },
      { name: "src", desc: "адреса файлу доріжки у форматі WebVTT" },
      { name: "srclang", desc: "мова доріжки, напр. \"uk\"" },
      { name: "label", desc: "назва, яку бачить користувач у меню вибору" },
      { name: "default", desc: "ця доріжка увімкнена за замовчуванням" },
    ],
    example: `<video controls width="300" poster="https://picsum.photos/300/150">
  <source src="movie.mp4" type="video/mp4">
  <track kind="captions" src="captions-uk.vtt" srclang="uk" label="Українська" default>
  Твій браузер не підтримує video.
</video>`,
    pitfalls: [
      "Файл .vtt з неправильним форматом (без заголовка WEBVTT) — браузер проігнорує доріжку.",
      "Немає жодного <track> — відео недоступне для людей з вадами слуху.",
    ],
    related: ["video", "audio", "source"],
  },
  map: {
    badge: "HTML",
    title: "<map>",
    whatIsIt: "Визначає інтерактивну карту зображення — набір клікабельних областей (<area>) поверх картинки. Пов'язується із зображенням через атрибут usemap.",
    useCases: ["клікабельні регіони на географічній карті", "інтерактивна схема чи інфографіка"],
    syntax: `<img src="map.jpg" usemap="#regions">\n<map name="regions">\n  <area shape="rect" coords="0,0,100,100" href="#" alt="Регіон 1">\n</map>`,
    attributes: [{ name: "name", desc: "ім'я карти, на яке посилається usemap зображення" }],
    example: `<img src="https://picsum.photos/300/150" usemap="#demo" alt="Демозображення" style="border-radius:6px;">
<map name="demo">
  <area shape="rect" coords="0,0,150,150" href="#" alt="Ліва половина" title="Ліва половина">
  <area shape="rect" coords="150,0,300,150" href="#" alt="Права половина" title="Права половина">
</map>
<p style="font-size:13px;color:#666;">Наведи курсор на ліву й праву половину зображення.</p>`,
    pitfalls: [
      "Координати area не збігаються з реальним розміром зображення — клікабельна зона зміщена.",
      "Забутий usemap на <img> — карта області визначена, але не прив'язана до зображення.",
    ],
    related: ["area", "img"],
  },
  area: {
    badge: "HTML",
    title: "<area>",
    whatIsIt: "Визначає одну клікабельну область всередині <map> — форму (прямокутник, коло, багатокутник) з координатами й посиланням. Самозакривний тег.",
    useCases: ["клікабельний регіон на інтерактивній карті", "область-посилання на частину зображення"],
    syntax: `<area shape="circle" coords="50,50,40" href="#" alt="Опис області">`,
    attributes: [
      { name: "shape", desc: "форма області: rect, circle, poly, default" },
      { name: "coords", desc: "координати форми, залежать від shape" },
      { name: "href", desc: "адреса переходу при кліку" },
      { name: "alt", desc: "текстовий опис — обов'язковий для доступності" },
    ],
    example: `<img src="https://picsum.photos/300/150" usemap="#demo2" alt="Демозображення" style="border-radius:6px;">
<map name="demo2">
  <area shape="circle" coords="150,75,60" href="#" alt="Центральна область" title="Центральна область">
</map>`,
    pitfalls: [
      "Відсутній alt — область недоступна для скрінрідерів.",
      "<area> без <map> не має сенсу — завжди дочірній елемент <map>.",
    ],
    related: ["map", "img"],
  },

  dialog: {
    badge: "HTML",
    title: "<dialog>",
    whatIsIt: "Вбудований елемент модального чи немодального діалогового вікна — браузер сам керує його показом/приховуванням і навіть затемненням фону для модального режиму, без сторонніх бібліотек.",
    useCases: ["модальні вікна підтвердження", "спливаючі форми (логін, підписка)", "сповіщення, які потребують дії користувача"],
    syntax: `<dialog id="d">Вміст діалогу</dialog>\n<script>document.getElementById('d').showModal();<\/script>`,
    attributes: [
      { name: "open", desc: "діалог видимий (додається автоматично методами show/showModal)" },
    ],
    example: `<button id="openBtn">Відкрити діалог</button>
<dialog id="myDialog" style="border-radius:8px;border:1px solid #ccc;padding:16px;">
  <p>Це модальне вікно!</p>
  <button id="closeBtn">Закрити</button>
</dialog>
<script>
  const dialog = document.getElementById('myDialog');
  document.getElementById('openBtn').onclick = () => dialog.showModal();
  document.getElementById('closeBtn').onclick = () => dialog.close();
<\/script>`,
    pitfalls: [
      "show() відкриває немодальний діалог (фон клікабельний), а showModal() — модальний із затемненням.",
      "Забутий close() у кнопці всередині — діалог не закриється без явного виклику.",
    ],
    related: ["button"],
  },
  details: {
    badge: "HTML",
    title: "<details>",
    whatIsIt: "Створює розкривний блок — панель, яку можна згорнути й розгорнути кліком, без жодного JavaScript. Заголовок панелі задається через <summary>.",
    useCases: ["розділ «Часті запитання» (FAQ)", "додаткові подробиці, приховані за замовчуванням", "згортні секції в довгих документах"],
    syntax: `<details>\n  <summary>Заголовок</summary>\n  Прихований вміст\n</details>`,
    attributes: [{ name: "open", desc: "панель розгорнута за замовчуванням" }],
    example: `<details>
  <summary>Що таке HTML?</summary>
  <p>HTML — мова розмітки гіпертексту, основа будь-якої веб-сторінки.</p>
</details>`,
    pitfalls: [
      "Стилізація <summary> по-різному в різних браузерах (маркер трикутника) — варто явно керувати через CSS.",
      "Забутий <summary> — тоді браузер показує стандартний текст «Details» замість власного заголовка.",
    ],
    related: ["summary"],
  },
  summary: {
    badge: "HTML",
    title: "<summary>",
    whatIsIt: "Задає видимий заголовок для <details> — текст, на який клікають, щоб розгорнути чи згорнути панель. Має бути першим дочірнім елементом <details>.",
    useCases: ["заголовок розкривної панелі FAQ", "клікабельний ярлик згорнутого блоку"],
    syntax: `<details>\n  <summary>Клікни мене</summary>\n  Вміст\n</details>`,
    attributes: [],
    example: `<details open>
  <summary>Натисни, щоб згорнути</summary>
  <p>Цей блок відкритий за замовчуванням (атрибут open).</p>
</details>`,
    pitfalls: [
      "<summary> поза <details> не має сенсу — завжди перший дочірній елемент.",
      "Кілька <summary> в одному <details> — використовується лише перший.",
    ],
    related: ["details"],
  },
  template: {
    badge: "HTML",
    title: "<template>",
    whatIsIt: "Зберігає розмітку, яка не рендериться й не виконується браузером одразу — її вміст можна клонувати через JavaScript і вставляти на сторінку скільки завгодно разів. Корисно для повторюваних блоків (картки, рядки таблиці).",
    useCases: ["шаблон картки товару, що клонується для кожного елемента списку", "повторювані рядки таблиці, згенеровані з даних"],
    syntax: `<template id="t"><li class="item"></li></template>\n<script>\n  const clone = document.getElementById('t').content.cloneNode(true);\n<\/script>`,
    attributes: [],
    example: `<ul id="list"></ul>
<template id="itemTemplate">
  <li style="padding:4px 0;">🍎 Товар</li>
</template>
<script>
  const tpl = document.getElementById('itemTemplate');
  const list = document.getElementById('list');
  for (let i = 0; i < 3; i++) {
    const clone = tpl.content.cloneNode(true);
    list.appendChild(clone);
  }
<\/script>`,
    pitfalls: [
      "Вміст <template> не видно на сторінці, поки його явно не клонувати й не вставити через JS — це не звичайний прихований блок (display:none).",
      "Скрипти й зображення всередині <template> не завантажуються, поки контент не активовано.",
    ],
    related: ["script", "slot"],
  },
  slot: {
    badge: "HTML",
    title: "<slot>",
    whatIsIt: "Використовується у веб-компонентах (Shadow DOM) як місце-заповнювач — куди підставляється контент, переданий ззовні компонента. Дозволяє створювати компоненти з кастомізованим вмістом, як діти в React.",
    useCases: ["кастомні елементи з вставленим ззовні вмістом (напр. <my-card>Текст</my-card>)", "перевикористовувані веб-компоненти з гнучким контентом"],
    syntax: `<template id="t"><div class="card"><slot></slot></div></template>`,
    attributes: [{ name: "name", desc: "іменований слот — для кількох різних місць вставки контенту" }],
    example: `<my-card>Привіт зі слота!</my-card>
<script>
  class MyCard extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = '<div style="border:1px solid #ccc;border-radius:8px;padding:10px;"><slot></slot></div>';
    }
  }
  customElements.define('my-card', MyCard);
<\/script>`,
    pitfalls: [
      "<slot> працює лише всередині Shadow DOM веб-компонента, не в звичайному HTML.",
      "Забутий вміст усередині кастомного тега — слот покаже запасний вміст (якщо він заданий) або нічого.",
    ],
    related: ["template"],
  },
  canvas: {
    badge: "HTML",
    title: "<canvas>",
    whatIsIt: "Порожнє полотно, на якому можна малювати графіку, анімації чи ігри через JavaScript (2D Canvas API або WebGL). Сам по собі тег не показує нічого — весь вміст малюється кодом.",
    useCases: ["графіки й діаграми, намальовані кодом", "прості ігри в браузері", "редактори зображень онлайн"],
    syntax: `<canvas id="c" width="300" height="150"></canvas>\n<script>\n  const ctx = document.getElementById('c').getContext('2d');\n<\/script>`,
    attributes: [
      { name: "width", desc: "ширина полотна в пікселях (типово 300)" },
      { name: "height", desc: "висота полотна в пікселях (типово 150)" },
    ],
    example: `<canvas id="myCanvas" width="300" height="100" style="border:1px solid #ccc;"></canvas>
<script>
  const ctx = document.getElementById('myCanvas').getContext('2d');
  ctx.fillStyle = '#7c3aed';
  ctx.fillRect(20, 20, 100, 60);
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath();
  ctx.arc(200, 50, 30, 0, Math.PI * 2);
  ctx.fill();
<\/script>`,
    pitfalls: [
      "Зміна width/height через CSS замість атрибутів — розтягує намальоване, а не змінює роздільну здатність.",
      "Малювання без перевірки, що canvas завантажився в DOM — скрипт до елемента поверне null.",
    ],
    related: ["svg", "script"],
  },
  svg: {
    badge: "HTML",
    title: "<svg>",
    whatIsIt: "Векторна графіка прямо в HTML — фігури описуються математично (координати, криві), тому масштабуються без втрати якості на будь-яких екранах. На відміну від canvas, елементи SVG — це справжні DOM-вузли, доступні для стилізації CSS і подій.",
    useCases: ["іконки, що чітко виглядають на будь-якому масштабі", "діаграми й графіки з інтерактивністю", "логотипи й ілюстрації"],
    syntax: `<svg width="100" height="100" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" fill="teal" />\n</svg>`,
    attributes: [
      { name: "viewBox", desc: "визначає систему координат і область видимості SVG" },
      { name: "width / height", desc: "розмір SVG на сторінці" },
      { name: "fill", desc: "колір заливки фігури (можна на кожному елементі)" },
      { name: "stroke", desc: "колір і товщина контуру фігури" },
    ],
    example: `<svg width="200" height="100" viewBox="0 0 200 100">
  <rect x="10" y="10" width="80" height="60" fill="#7c3aed" rx="8" />
  <circle cx="150" cy="40" r="30" fill="#0ea5e9" />
  <text x="10" y="90" font-size="14" fill="#333">SVG-текст</text>
</svg>`,
    pitfalls: [
      "Забутий viewBox — SVG може погано масштабуватись під різні розміри контейнера.",
      "Плутанина з <canvas> — SVG підходить для чіткої векторної графіки й доступу через DOM/CSS, а canvas — для піксельного малювання й анімацій із великою кількістю об'єктів.",
    ],
    related: ["canvas"],
  },

  a: {
    badge: "HTML",
    title: "<a>",
    whatIsIt: "Створює гіперпосилання — найважливіший елемент вебу, що дозволяє переходити між сторінками, файлами, розділами сторінки чи запускати email/телефонні дії.",
    useCases: ["перехід на іншу сторінку чи сайт", "перехід до розділу цієї ж сторінки (якір)", "посилання mailto:/tel: для email і дзвінків", "завантаження файлу"],
    syntax: `<a href="https://example.com">Текст посилання</a>`,
    attributes: [
      { name: "href", desc: "адреса переходу — URL, #якір, mailto:, tel:" },
      { name: "target", desc: "де відкрити: \"_blank\" — нова вкладка" },
      { name: "rel", desc: "тип зв'язку, напр. \"noopener noreferrer\" для безпеки з target=_blank" },
      { name: "download", desc: "змушує браузер завантажити файл замість відкриття" },
    ],
    example: `<a href="https://example.com" target="_blank" rel="noopener noreferrer">Відкрити example.com</a>
<br><a href="#top">До початку сторінки</a>
<br><a href="mailto:hello@example.com">Написати листа</a>`,
    pitfalls: [
      "target=\"_blank\" без rel=\"noopener\" — потенційна вразливість (нова вкладка має доступ до window.opener).",
      "href=\"#\" чи href=\"javascript:void(0)\" замість <button> для дій без переходу — семантично неправильно.",
      "Порожній текст посилання чи лише іконка без aria-label — проблема з доступністю.",
    ],
    related: ["button", "nav"],
  },
  div: {
    badge: "HTML",
    title: "<div>",
    whatIsIt: "Універсальний блоковий контейнер без власного семантичного значення — використовується для групування елементів заради стилізації чи структури розмітки, коли жоден семантичний тег (section, article тощо) не підходить.",
    useCases: ["групування елементів для CSS-стилізації (напр. flex/grid контейнер)", "обгортка для JS-компонента", "структурні блоки, що не мають семантичного значення"],
    syntax: `<div class="card">Вміст</div>`,
    attributes: [],
    example: `<div style="display:flex;gap:10px;">
  <div style="background:#7c3aed;color:white;padding:10px;border-radius:6px;">Блок 1</div>
  <div style="background:#0ea5e9;color:white;padding:10px;border-radius:6px;">Блок 2</div>
</div>`,
    pitfalls: [
      "Зловживання <div> замість семантичних тегів (<header>, <nav>, <section>) — гірше для SEO й доступності.",
      "Надмірна вкладеність div-ів («divitis») ускладнює читання й стилізацію розмітки.",
    ],
    related: ["span", "section"],
  },
  span: {
    badge: "HTML",
    title: "<span>",
    whatIsIt: "Універсальний рядковий (inline) контейнер без власного семантичного значення — використовується, щоб виділити частину тексту для стилізації чи маніпуляцій через JS, не розриваючи рядок.",
    useCases: ["виділення кольором частини слова чи речення", "обгортка для іконки в тексті", "динамічний текст, що оновлюється через JS"],
    syntax: `Текст з <span class="highlight">виділеним словом</span>.`,
    attributes: [],
    example: `<p>Цей текст містить <span style="color:#7c3aed;font-weight:bold;">виділене слово</span> посеред речення.</p>`,
    pitfalls: [
      "Використання <span> замість <strong>/<em>, коли є смислове значення виділення — тоді семантичні теги кращі.",
      "div всередині span чи інші блокові елементи в inline-контейнері — невалідна вкладеність.",
    ],
    related: ["div", "strong", "em"],
  },
  menu: {
    badge: "HTML",
    title: "<menu>",
    whatIsIt: "Семантично альтернатива <ul> для списку команд чи дій — за замовчуванням у браузерах виглядає ідентично звичайному списку, але позначає саме набір дій (напр. панель інструментів чи контекстне меню), а не просто перелік.",
    useCases: ["список дій/команд у панелі інструментів", "контекстне меню з опціями"],
    syntax: `<menu>\n  <li><button>Копіювати</button></li>\n  <li><button>Вставити</button></li>\n</menu>`,
    attributes: [],
    example: `<menu style="display:flex;gap:8px;list-style:none;padding:0;">
  <li><button>Зберегти</button></li>
  <li><button>Видалити</button></li>
  <li><button>Поділитись</button></li>
</menu>`,
    pitfalls: [
      "Використання <menu> для звичайного текстового списку — тоді краще <ul>, бо <menu> семантично означає саме дії.",
      "Обмежена й непослідовна підтримка деяких можливостей <menu> (напр. toolbar-типу) у браузерах.",
    ],
    related: ["ul", "li", "button"],
  },

  font: {
    badge: "HTML (застаріло)",
    title: "<font> (уникай)",
    whatIsIt: "Застарілий тег для задання шрифту, кольору й розміру тексту прямо в розмітці. Повністю замінений CSS-властивостями font-family, color, font-size — не використовуй у нових проєктах.",
    useCases: ["лише для розуміння старого коду — у нових проєктах не застосовується"],
    syntax: `<font color="red" size="4">текст</font> <span style="color:#888;">(не використовуй)</span>`,
    attributes: [
      { name: "color", desc: "колір тексту — замінено CSS color" },
      { name: "size", desc: "розмір шрифту (1-7) — замінено CSS font-size" },
      { name: "face", desc: "назва шрифту — замінено CSS font-family" },
    ],
    example: `<p style="color:red;font-size:18px;">Так робимо сьогодні: через CSS замість &lt;font&gt;.</p>`,
    pitfalls: [
      "<font> взагалі не підтримується стандартом HTML5 — використовуй CSS.",
      "Змішування стилю й розмітки ускладнює підтримку сторінки.",
    ],
    related: [],
  },
  center: {
    badge: "HTML (застаріло)",
    title: "<center> (уникай)",
    whatIsIt: "Застарілий тег для центрування вмісту. Замінений CSS-властивостями text-align: center (для тексту) або margin: 0 auto / display: flex (для блоків).",
    useCases: ["лише для розуміння старого коду"],
    syntax: `<center>текст</center> <span style="color:#888;">(не використовуй)</span>`,
    attributes: [],
    example: `<p style="text-align:center;">Так центрують текст сьогодні: text-align: center.</p>`,
    pitfalls: ["Замінюй на CSS text-align/margin/flexbox замість <center>."],
    related: ["css-flexbox"],
  },
  big: {
    badge: "HTML (застаріло)",
    title: "<big> (уникай)",
    whatIsIt: "Застарілий тег, що збільшував розмір тексту на один крок. Замінений CSS font-size.",
    useCases: ["лише для розуміння старого коду"],
    syntax: `<big>більший текст</big> <span style="color:#888;">(не використовуй)</span>`,
    attributes: [],
    example: `<p style="font-size:1.2em;">Так збільшують текст сьогодні: font-size у CSS.</p>`,
    pitfalls: ["<big> видалений зі стандарту HTML5 — використовуй CSS font-size."],
    related: ["small"],
  },
  strike: {
    badge: "HTML (застаріло)",
    title: "<strike> (уникай)",
    whatIsIt: "Застарілий тег закресленого тексту. Замінений семантичним <s> (якщо текст більше не актуальний) або <del> (якщо видалений), чи CSS text-decoration.",
    useCases: ["лише для розуміння старого коду"],
    syntax: `<strike>текст</strike> <span style="color:#888;">(використовуй &lt;s&gt; або &lt;del&gt;)</span>`,
    attributes: [],
    example: `<p><s>Так робимо сьогодні: через &lt;s&gt; замість &lt;strike&gt;.</s></p>`,
    pitfalls: ["Замінюй <strike> на <s> (неактуально) чи <del> (видалено) залежно від сенсу."],
    related: ["s", "del"],
  },
  tt: {
    badge: "HTML (застаріло)",
    title: "<tt> (уникай)",
    whatIsIt: "Застарілий тег моноширинного («друкарського») тексту. Замінений семантичними <code>, <kbd>, <samp> залежно від сенсу, або CSS font-family: monospace.",
    useCases: ["лише для розуміння старого коду"],
    syntax: `<tt>моноширинний текст</tt> <span style="color:#888;">(використовуй &lt;code&gt;)</span>`,
    attributes: [],
    example: `<p><code>Так робимо сьогодні: через &lt;code&gt; замість &lt;tt&gt;.</code></p>`,
    pitfalls: ["<tt> видалений зі стандарту — обери семантичний замінник (<code>, <kbd>, <samp>)."],
    related: ["code", "kbd", "samp"],
  },
  acronym: {
    badge: "HTML (застаріло)",
    title: "<acronym> (уникай)",
    whatIsIt: "Застарілий тег для абревіатур і акронімів. Повністю замінений <abbr>, який охоплює обидва випадки.",
    useCases: ["лише для розуміння старого коду"],
    syntax: `<acronym title="...">HTML</acronym> <span style="color:#888;">(використовуй &lt;abbr&gt;)</span>`,
    attributes: [{ name: "title", desc: "розшифровка — тепер атрибут <abbr>" }],
    example: `<p><abbr title="HyperText Markup Language">HTML</abbr> — так робимо сьогодні.</p>`,
    pitfalls: ["Завжди використовуй <abbr> замість <acronym> — останній видалений зі стандарту."],
    related: ["abbr"],
  },
  applet: {
    badge: "HTML (застаріло)",
    title: "<applet> (уникай)",
    whatIsIt: "Застарілий тег для вбудовування Java-аплетів у сторінку. Java-аплети більше не підтримуються жодним сучасним браузером через проблеми безпеки й продуктивності.",
    useCases: ["лише для розуміння дуже старого коду (кінець 1990-х — початок 2000-х)"],
    syntax: `<applet code="App.class" width="200" height="200"></applet> <span style="color:#888;">(не використовуй)</span>`,
    attributes: [],
    example: `<p style="font-size:13px;color:#666;">Сучасна заміна — &lt;canvas&gt;, &lt;iframe&gt; чи веб-компоненти на JavaScript, залежно від задачі.</p>`,
    pitfalls: ["<applet> повністю видалений зі стандарту й не підтримується жодним сучасним браузером."],
    related: ["canvas", "iframe"],
  },
  basefont: {
    badge: "HTML (застаріло)",
    title: "<basefont> (уникай)",
    whatIsIt: "Застарілий тег, що задавав шрифт, розмір і колір за замовчуванням для всього документа. Замінений CSS-правилами на елементі body чи :root.",
    useCases: ["лише для розуміння старого коду"],
    syntax: `<basefont size="3" color="black"> <span style="color:#888;">(не використовуй)</span>`,
    attributes: [],
    example: `<p style="font-size:13px;color:#666;">Сучасна заміна: body { font-family: ...; font-size: ...; color: ...; } у CSS.</p>`,
    pitfalls: ["<basefont> видалений зі стандарту HTML5 — використовуй CSS на body чи :root."],
    related: ["font"],
  },
  dir: {
    badge: "HTML (застаріло)",
    title: "<dir> (уникай)",
    whatIsIt: "Застарілий тег для списку директорій (файлів і тек). Функціонально замінений звичайним <ul>.",
    useCases: ["лише для розуміння старого коду"],
    syntax: `<dir><li>файл.txt</li></dir> <span style="color:#888;">(використовуй &lt;ul&gt;)</span>`,
    attributes: [],
    example: `<ul><li>файл.txt</li><li>папка/</li></ul>`,
    pitfalls: ["<dir> видалений зі стандарту — завжди використовуй <ul> для списків."],
    related: ["ul"],
  },
  frame: {
    badge: "HTML (застаріло)",
    title: "<frame> (уникай)",
    whatIsIt: "Застарілий тег для одного з декількох незалежних вікон у складі <frameset> — сторінка ділилась на кілька окремих HTML-документів. Повністю замінений <iframe> для вбудовування чи CSS-макетами (flex/grid) для розділення на секції.",
    useCases: ["лише для розуміння старих сайтів кінця 1990-х"],
    syntax: `<frame src="menu.html"> <span style="color:#888;">(не використовуй, дивись &lt;iframe&gt;)</span>`,
    attributes: [],
    example: `<p style="font-size:13px;color:#666;">Сучасна заміна: &lt;iframe&gt; для вбудовування однієї сторінки або CSS grid/flex для макета з кількох секцій.</p>`,
    pitfalls: ["<frame>/<frameset> ламали навігацію, закладки й доступність — тому видалені зі стандарту."],
    related: ["iframe", "frameset"],
  },
  frameset: {
    badge: "HTML (застаріло)",
    title: "<frameset> (уникай)",
    whatIsIt: "Застарілий тег, що замінював <body> й ділив вікно браузера на кілька <frame> — незалежних HTML-документів. Повністю видалений зі стандарту HTML5, замінений <iframe> або CSS grid/flex макетами.",
    useCases: ["лише для розуміння старих сайтів кінця 1990-х"],
    syntax: `<frameset cols="25%,75%"><frame src="menu.html"><frame src="content.html"></frameset> <span style="color:#888;">(не використовуй)</span>`,
    attributes: [],
    example: `<p style="font-size:13px;color:#666;">Сучасна заміна: CSS grid-template-columns для розділення сторінки на колонки в межах одного документа.</p>`,
    pitfalls: [
      "<frameset> замінював <body>, тому документ не міг мати звичайний вміст сторінки — це й стало однією з причин відмови від нього.",
      "Проблеми з SEO, закладками й доступністю змусили відмовитись від фреймів на користь <iframe> й CSS-макетів.",
    ],
    related: ["frame", "iframe"],
  },
  noframes: {
    badge: "HTML (застаріло)",
    title: "<noframes> (уникай)",
    whatIsIt: "Застарілий тег, що показував запасний вміст у браузерах, які не підтримували <frameset>. Втратив сенс разом із видаленням фреймів зі стандарту HTML5.",
    useCases: ["лише для розуміння старого коду"],
    syntax: `<noframes>Ваш браузер не підтримує фрейми.</noframes> <span style="color:#888;">(не використовуй)</span>`,
    attributes: [],
    example: `<p style="font-size:13px;color:#666;">Сучасна заміна фреймів — &lt;iframe&gt; чи CSS-макети, тому &lt;noframes&gt; більше не потрібен.</p>`,
    pitfalls: ["Немає сенсу без <frameset>, який сам видалений зі стандарту."],
    related: ["frameset", "noscript"],
  },

  body: {
    badge: "HTML",
    title: "<body>",
    whatIsIt: "Містить увесь видимий вміст HTML-документа — текст, зображення, форми, будь-які інші елементи. На сторінці може бути лише один <body>, одразу після <head>.",
    useCases: ["обгортка для всього видимого вмісту сторінки", "місце для глобальних класів теми (напр. dark-mode) через body.classList"],
    syntax: `<body>\n  <h1>Заголовок</h1>\n  <p>Текст</p>\n</body>`,
    attributes: [
      { name: "onload", desc: "застарілий спосіб виконати JS після завантаження сторінки — краще addEventListener" },
      { name: "class / id", desc: "глобальні атрибути, часто використовуються для перемикання теми" },
    ],
    example: `<body style="background:white;color:#111;font-family:sans-serif;">
  <h1>Заголовок сторінки</h1>
  <p>Це видимий вміст усередині body.</p>
</body>`,
    pitfalls: [
      "Вміст поза <body> (напр. текст прямо в <html>) — браузер сам виправить структуру, але це помилка розмітки.",
      "Кілька <body> в одному документі — недопустимо, браузер врахує лише перший.",
    ],
    related: ["html", "head"],
  },
  address: {
    badge: "HTML",
    title: "<address>",
    whatIsIt: "Позначає контактну інформацію автора чи власника документа або найближчого предка <article> — адресу, email, телефон. Не призначений для довільних поштових адрес у тексті статті (наприклад, адреси в бізнес-каталозі).",
    useCases: ["контакти в підвалі сайту", "інформація про автора статті", "контактні дані компанії на сторінці «Про нас»"],
    syntax: `<address>\n  Написати: <a href="mailto:info@example.com">info@example.com</a>\n</address>`,
    attributes: [],
    example: `<address style="font-style:normal;">
  00100101 Platform<br>
  Київ, Україна<br>
  <a href="mailto:hello@example.com">hello@example.com</a>
</address>`,
    pitfalls: [
      "Використання <address> для будь-якої поштової адреси в тексті (напр. адреси в списку філій магазину) — семантично призначений саме для контактів автора/сайту.",
      "Типово курсив — легко сплутати з <i>, хоча сенс зовсім інший.",
    ],
    related: ["footer", "a"],
  },
  h1: {
    badge: "HTML",
    title: "<h1>...<h6>",
    whatIsIt: "Шість рівнів заголовків за важливістю: <h1> — найважливіший (зазвичай один на сторінку, головна назва), <h6> — найменш важливий. Формують структуру документа й «зміст» для скрінрідерів і пошукових систем.",
    useCases: ["h1 — головна назва сторінки/статті", "h2 — назви основних розділів", "h3-h6 — вкладені підрозділи"],
    syntax: `<h1>Головний заголовок</h1>\n<h2>Розділ</h2>\n<h3>Підрозділ</h3>`,
    attributes: [],
    example: `<h1 style="margin:0;">Головний заголовок (h1)</h1>
<h2 style="margin:8px 0 0;color:#555;">Розділ (h2)</h2>
<h3 style="margin:6px 0 0;color:#777;font-size:16px;">Підрозділ (h3)</h3>`,
    pitfalls: [
      "Кілька <h1> на сторінці чи пропуск рівнів (h1 → h4, минаючи h2/h3) — плутає структуру для скрінрідерів і SEO.",
      "Вибір рівня заголовка через бажаний розмір шрифту замість реальної ієрархії — для розміру краще CSS font-size.",
    ],
    related: ["p", "section", "article"],
  },
  h2: {
    badge: "HTML",
    title: "<h2>",
    whatIsIt: "Заголовок другого рівня — типово позначає основний розділ усередині сторінки чи статті, вкладений у <h1>.",
    useCases: ["назва розділу статті", "заголовок секції на лендінгу"],
    syntax: `<h2>Назва розділу</h2>`,
    attributes: [],
    example: `<h1 style="margin:0;">Стаття</h1>
<h2 style="margin-top:10px;">Перший розділ</h2>
<p>Текст розділу.</p>`,
    pitfalls: ["Пропуск h1 і використання h2 як найвищого рівня — ламає логічну ієрархію заголовків."],
    related: ["h1", "section"],
  },
  h3: {
    badge: "HTML",
    title: "<h3>",
    whatIsIt: "Заголовок третього рівня — підрозділ усередині розділу, позначеного <h2>.",
    useCases: ["підпункт усередині розділу статті", "заголовок картки в списку карток"],
    syntax: `<h3>Назва підрозділу</h3>`,
    attributes: [],
    example: `<h2 style="margin:0;">Розділ</h2>
<h3 style="margin-top:8px;color:#555;">Підрозділ</h3>
<p>Текст підрозділу.</p>`,
    pitfalls: ["Використання h3 без h2 вище по документу — розриває логічну структуру заголовків."],
    related: ["h2", "h4"],
  },
  h4: {
    badge: "HTML",
    title: "<h4>",
    whatIsIt: "Заголовок четвертого рівня — використовується рідше, для глибоко вкладених підрозділів усередині <h3>.",
    useCases: ["дрібний підзаголовок усередині довгого технічного документа"],
    syntax: `<h4>Дрібний підзаголовок</h4>`,
    attributes: [],
    example: `<h3 style="margin:0;">Підрозділ</h3>
<h4 style="margin-top:6px;color:#666;font-size:15px;">Ще глибший рівень</h4>`,
    pitfalls: ["Глибока вкладеність (h4 і нижче) часто означає, що варто переглянути структуру документа на простішу."],
    related: ["h3", "h5"],
  },
  h5: {
    badge: "HTML",
    title: "<h5>",
    whatIsIt: "Заголовок п'ятого рівня — рідкісний, для дуже глибокої ієрархії підрозділів у великих документах чи довідниках.",
    useCases: ["підзаголовок глибокого рівня в об'ємній документації"],
    syntax: `<h5>Заголовок п'ятого рівня</h5>`,
    attributes: [],
    example: `<h5 style="margin:0;font-size:14px;color:#777;">Заголовок п'ятого рівня</h5>`,
    pitfalls: ["На практиці рідко потрібен — зазвичай сигнал, що варто спростити структуру сторінки."],
    related: ["h4", "h6"],
  },
  h6: {
    badge: "HTML",
    title: "<h6>",
    whatIsIt: "Найнижчий, шостий рівень заголовка — використовується вкрай рідко, для найглибше вкладених підрозділів.",
    useCases: ["найдрібніший підзаголовок у складній технічній документації"],
    syntax: `<h6>Заголовок шостого рівня</h6>`,
    attributes: [],
    example: `<h6 style="margin:0;font-size:13px;color:#888;text-transform:uppercase;">Заголовок шостого рівня</h6>`,
    pitfalls: ["Використання h6 лише заради дрібного шрифту — для цього краще CSS, а не семантичний заголовок."],
    related: ["h5", "h1"],
  },
  p: {
    badge: "HTML",
    title: "<p>",
    whatIsIt: "Позначає абзац звичайного тексту — один із найпоширеніших елементів HTML. Браузер автоматично додає відступи зверху й знизу між абзацами.",
    useCases: ["абзаци статті чи опису", "будь-який блок текстового вмісту"],
    syntax: `<p>Текст абзацу.</p>`,
    attributes: [],
    example: `<p>Перший абзац тексту з якимось змістом.</p>
<p>Другий абзац, візуально відокремлений відступом від першого.</p>`,
    pitfalls: [
      "Вкладання блокових елементів (<div>, <table>) усередину <p> — недопустимо, браузер автоматично закриє <p> раніше.",
      "Використання порожніх <p></p> чи <br><br> для відступів замість margin у CSS.",
    ],
    related: ["h1", "span", "div"],
  },
  hgroup: {
    badge: "HTML",
    title: "<hgroup>",
    whatIsIt: "Групує заголовок (<h1>-<h6>) разом із підзаголовком чи гаслом, щоб позначити їх як єдиний смисловий блок — наприклад, назву статті й дату чи автора під нею.",
    useCases: ["заголовок статті з підзаголовком", "назва сторінки разом зі слоганом"],
    syntax: `<hgroup>\n  <h1>Головна назва</h1>\n  <p>Підзаголовок або гасло</p>\n</hgroup>`,
    attributes: [],
    example: `<hgroup>
  <h1 style="margin:0;">00100101</h1>
  <p style="margin:2px 0 0;color:#666;">Від першого символу до Full Stack</p>
</hgroup>`,
    pitfalls: [
      "Рідко використовується — багато розробників просто ставлять <h1> і <p> поруч без обгортки; hgroup доречний саме коли важливо явно позначити їх як єдину смислову групу.",
    ],
    related: ["h1", "p"],
  },
  "search-landmark": {
    badge: "HTML",
    title: "<search>",
    whatIsIt: "Новий семантичний елемент (з 2023) для позначення блоку пошуку на сторінці — форми пошуку разом з полями фільтрації. Раніше для цього доводилось використовувати <div role=\"search\">.",
    useCases: ["форма пошуку в шапці сайту", "блок фільтрів каталогу товарів"],
    syntax: `<search>\n  <form role="search">\n    <input type="search" placeholder="Пошук...">\n  </form>\n</search>`,
    attributes: [],
    example: `<search style="display:block;">
  <form onsubmit="return false;" style="display:flex;gap:6px;">
    <input type="search" placeholder="Що шукаєш?" style="padding:6px 10px;border:1px solid #ccc;border-radius:6px;flex:1;">
    <button style="padding:6px 12px;border:none;border-radius:6px;background:#7c3aed;color:white;">Знайти</button>
  </form>
</search>`,
    pitfalls: [
      "Новий елемент — старіші браузери можуть не мати спеціальної семантики, але візуально й функціонально він поводиться як звичайний блок.",
      "Не замінює <input type=\"search\"> всередині — це обгортка для всього блоку пошуку/фільтрів, а не самого поля.",
    ],
    related: ["form", "input"],
  },
  caption: {
    badge: "HTML",
    title: "<caption>",
    whatIsIt: "Задає заголовок/підпис для всієї таблиці — має бути першим дочірнім елементом <table>. Допомагає користувачам і скрінрідерам зрозуміти, про що таблиця, без читання самих даних.",
    useCases: ["назва таблиці зі статистикою", "опис вмісту складної таблиці для доступності"],
    syntax: `<table>\n  <caption>Продажі за 2024 рік</caption>\n  ...\n</table>`,
    attributes: [],
    example: `<table style="border-collapse:collapse;width:100%;">
  <caption style="font-weight:bold;margin-bottom:6px;">Продажі за квартал</caption>
  <tr><th style="border:1px solid #ccc;padding:4px;">Місяць</th><th style="border:1px solid #ccc;padding:4px;">Сума</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px;">Січень</td><td style="border:1px solid #ccc;padding:4px;">1000</td></tr>
</table>`,
    pitfalls: [
      "caption не першим елементом усередині table — невалідна розмітка, браузер може проігнорувати.",
      "Використання окремого <p> над таблицею замість <caption> — втрачається семантичний зв'язок із таблицею.",
    ],
    related: ["table", "thead"],
  },
  thead: {
    badge: "HTML",
    title: "<thead>",
    whatIsIt: "Групує рядки заголовка таблиці окремо від основних даних (<tbody>). Допомагає браузеру (при друку) повторювати шапку на кожній сторінці, і дає чітку семантичну структуру таблиці.",
    useCases: ["шапка таблиці з назвами колонок", "фіксована шапка при прокрутці великої таблиці (разом з CSS)"],
    syntax: `<table>\n  <thead><tr><th>Ім'я</th><th>Вік</th></tr></thead>\n  <tbody>...</tbody>\n</table>`,
    attributes: [],
    example: `<table style="border-collapse:collapse;width:100%;">
  <thead style="background:#f4f4f4;">
    <tr><th style="border:1px solid #ccc;padding:4px;">Ім'я</th><th style="border:1px solid #ccc;padding:4px;">Вік</th></tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ccc;padding:4px;">Оля</td><td style="border:1px solid #ccc;padding:4px;">25</td></tr>
  </tbody>
</table>`,
    pitfalls: [
      "thead без tbody — таблиця все одно працює, але втрачається явний поділ шапки й даних.",
      "Кілька thead в одній таблиці — недопустимо, лише один.",
    ],
    related: ["tbody", "tfoot", "table"],
  },
  tbody: {
    badge: "HTML",
    title: "<tbody>",
    whatIsIt: "Групує основні рядки даних таблиці, окремо від шапки (<thead>) і підвалу (<tfoot>). Якщо не вказаний явно, браузер все одно створює неявний tbody навколо звичайних рядків.",
    useCases: ["основний блок даних таблиці", "кілька tbody в одній таблиці для логічного групування рядків (напр. по категоріях)"],
    syntax: `<table>\n  <thead>...</thead>\n  <tbody><tr><td>1</td></tr></tbody>\n</table>`,
    attributes: [],
    example: `<table style="border-collapse:collapse;">
  <tbody>
    <tr><td style="border:1px solid #ccc;padding:4px;">Рядок 1</td></tr>
    <tr><td style="border:1px solid #ccc;padding:4px;">Рядок 2</td></tr>
  </tbody>
</table>`,
    pitfalls: ["Плутанина: tbody не обов'язковий явно, але корисний для стилізації (CSS-селектори по tbody) і для кількох логічних груп рядків."],
    related: ["thead", "tfoot"],
  },
  tfoot: {
    badge: "HTML",
    title: "<tfoot>",
    whatIsIt: "Групує підсумкові рядки таблиці — суми, середні значення, примітки. Семантично і за замовчуванням у браузерах показується внизу таблиці, навіть якщо в розмітці стоїть перед tbody.",
    useCases: ["рядок «Разом» з підсумковою сумою", "примітки чи легенда під таблицею"],
    syntax: `<table>\n  <tbody>...</tbody>\n  <tfoot><tr><td>Разом: 1000</td></tr></tfoot>\n</table>`,
    attributes: [],
    example: `<table style="border-collapse:collapse;width:100%;">
  <tbody>
    <tr><td style="border:1px solid #ccc;padding:4px;">Товар А</td><td style="border:1px solid #ccc;padding:4px;">500</td></tr>
    <tr><td style="border:1px solid #ccc;padding:4px;">Товар Б</td><td style="border:1px solid #ccc;padding:4px;">700</td></tr>
  </tbody>
  <tfoot style="font-weight:bold;background:#f4f4f4;">
    <tr><td style="border:1px solid #ccc;padding:4px;">Разом</td><td style="border:1px solid #ccc;padding:4px;">1200</td></tr>
  </tfoot>
</table>`,
    pitfalls: ["Забутий tfoot для підсумкового рядка — використання звичайного tr у tbody втрачає семантику й можливість стилізувати підсумок окремо."],
    related: ["thead", "tbody"],
  },
  colgroup: {
    badge: "HTML",
    title: "<colgroup>",
    whatIsIt: "Групує елементи <col> для застосування стилів чи атрибутів до цілих колонок таблиці одразу, без потреби ставити клас на кожну комірку кожного рядка.",
    useCases: ["виділити кольором усю колонку таблиці", "задати ширину колонок наперед"],
    syntax: `<table>\n  <colgroup>\n    <col style="background:#eee">\n    <col>\n  </colgroup>\n  ...\n</table>`,
    attributes: [{ name: "span", desc: "скільки колонок охоплює colgroup, якщо не перелічені col по одному" }],
    example: `<table style="border-collapse:collapse;width:100%;">
  <colgroup>
    <col style="background:#ede9fe;">
    <col>
  </colgroup>
  <tr><td style="border:1px solid #ccc;padding:4px;">Виділена колонка</td><td style="border:1px solid #ccc;padding:4px;">Звичайна</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px;">Ще рядок</td><td style="border:1px solid #ccc;padding:4px;">Дані</td></tr>
</table>`,
    pitfalls: ["colgroup має йти одразу після caption (якщо є) і перед thead/tbody — неправильний порядок ламає розмітку."],
    related: ["col", "table"],
  },
  col: {
    badge: "HTML",
    title: "<col>",
    whatIsIt: "Описує стиль чи ширину однієї конкретної колонки таблиці всередині <colgroup>. Самозакривний тег, не містить вмісту.",
    useCases: ["задати фіксовану ширину конкретній колонці", "виділити кольором лише одну колонку"],
    syntax: `<colgroup>\n  <col span="2" style="background:yellow;">\n</colgroup>`,
    attributes: [{ name: "span", desc: "скільки послідовних колонок охоплює цей col" }],
    example: `<table style="border-collapse:collapse;">
  <colgroup>
    <col style="width:150px;background:#fef9c3;">
    <col style="width:80px;">
  </colgroup>
  <tr><td style="border:1px solid #ccc;padding:4px;">Широка й жовта</td><td style="border:1px solid #ccc;padding:4px;">Вузька</td></tr>
</table>`,
    pitfalls: ["col впливає лише на обмежений набір CSS-властивостей (ширина, фон, видимість) — не можна стилізувати текст усередині комірок через col."],
    related: ["colgroup", "table"],
  },
  dt: {
    badge: "HTML",
    title: "<dt>",
    whatIsIt: "Позначає термін усередині списку визначень <dl> — слово чи фразу, яку далі пояснює <dd>. Може йти кілька <dt> підряд перед одним <dd>, якщо в них спільне визначення.",
    useCases: ["термін у глосарії", "назва питання в FAQ (з dd як відповіддю)"],
    syntax: `<dl>\n  <dt>HTML</dt>\n  <dd>Мова розмітки гіпертексту</dd>\n</dl>`,
    attributes: [],
    example: `<dl>
  <dt style="font-weight:bold;">CSS</dt>
  <dd style="margin-left:20px;margin-bottom:8px;">Мова стилів для оформлення сторінок.</dd>
  <dt style="font-weight:bold;">JS</dt>
  <dd style="margin-left:20px;">Мова програмування для інтерактивності сторінок.</dd>
</dl>`,
    pitfalls: ["dt поза <dl> не має сенсу — завжди дочірній елемент списку визначень."],
    related: ["dd", "dl"],
  },
  dd: {
    badge: "HTML",
    title: "<dd>",
    whatIsIt: "Містить опис/визначення терміна, заданого попереднім <dt>, усередині списку визначень <dl>. Типово має відступ зліва.",
    useCases: ["визначення терміна в глосарії", "відповідь на питання в FAQ"],
    syntax: `<dl>\n  <dt>Термін</dt>\n  <dd>Опис терміна</dd>\n</dl>`,
    attributes: [],
    example: `<dl>
  <dt style="font-weight:bold;">API</dt>
  <dd style="margin-left:20px;">Набір правил, за якими програми звертаються одна до одної.</dd>
</dl>`,
    pitfalls: ["dd без відповідного dt перед ним — втрачається сенс «визначення чого саме»."],
    related: ["dt", "dl"],
  },
  optgroup: {
    badge: "HTML",
    title: "<optgroup>",
    whatIsIt: "Групує пов'язані елементи <option> усередині <select> під спільним підписом — зручно, коли список варіантів довгий і логічно ділиться на категорії.",
    useCases: ["групування країн за континентами у випадаючому списку", "категорії товарів у фільтрі"],
    syntax: `<select>\n  <optgroup label="Фрукти">\n    <option>Яблуко</option>\n  </optgroup>\n</select>`,
    attributes: [
      { name: "label", desc: "підпис групи, показується напівжирним і некликабельним у списку" },
      { name: "disabled", desc: "вимикає всі опції всередині групи одразу" },
    ],
    example: `<select style="padding:6px;border-radius:6px;">
  <optgroup label="Фрукти">
    <option>Яблуко</option>
    <option>Банан</option>
  </optgroup>
  <optgroup label="Овочі">
    <option>Морква</option>
    <option>Огірок</option>
  </optgroup>
</select>`,
    pitfalls: ["Забутий label — група показується без підпису, користувач не розуміє логіку поділу."],
    related: ["select", "option"],
  },
  "eng-lgtm": {
    badge: "English",
    title: "LGTM",
    whatIsIt: "Скорочення від \"Looks Good To Me\" — стандартна фраза в код-рев'ю, якою підтверджують, що зміни в pull request виглядають нормально й можна їх зливати (merge). Одна з найпоширеніших абревіатур у GitHub/GitLab коментарях.",
    useCases: ["коментар до pull request, коли зміни схвалені", "швидка відповідь у чаті на питання «як тобі мій код?»"],
    syntax: `LGTM! 👍`,
    attributes: [
      { name: "LGTM", desc: "загальне схвалення — «виглядає добре»" },
      { name: "SGTM", desc: "\"Sounds Good To Me\" — те саме, але про пропозицію/план, не код" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>Колега в PR:</b> "I fixed the null check in the login form."<br>
  <b>Твоя відповідь:</b> "LGTM, thanks for the quick fix!"
</p>`,
    pitfalls: [
      "LGTM не означає «я уважно все перевірив» — часто його пишуть навіть після поверхневого перегляду, тому не варто покладатись лише на нього для критичного коду.",
      "У формальних код-рев'ю краще додати конкретний коментар, а не лише LGTM без пояснень.",
    ],
    related: ["eng-nitpick", "eng-request-changes"],
  },
  "eng-nitpick": {
    badge: "English",
    title: "nit / nitpick",
    whatIsIt: "Дрібне, необов'язкове зауваження в код-рев'ю — стиль коду, назва змінної, форматування. Позначаючи коментар як \"nit\", рецензент дає зрозуміти, що це не блокує злиття, лише пропозиція.",
    useCases: ["коментар у PR про незначну деталь, яку не обов'язково виправляти", "відділення важливих зауважень від косметичних"],
    syntax: `nit: consider renaming "data" to "userData" for clarity`,
    attributes: [
      { name: "nit:", desc: "префікс коментаря, що сигналізує «це необов'язково»" },
      { name: "nitpicking", desc: "дієслово — прискіпуватись до дрібниць" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>Коментар у PR:</b> "nit: maybe use camelCase here instead of snake_case, but not blocking."
</p>`,
    pitfalls: [
      "Забагато nit-коментарів без чіткого позначення nit: може виглядати як блокуючі зауваження й сповільнити злиття PR.",
      "Плутанина з noSQL чи іншими термінами через схожість звучання — nit тут не пов'язаний з базами даних.",
    ],
    related: ["eng-lgtm", "eng-blocker"],
  },
  "eng-blocker": {
    badge: "English",
    title: "blocker",
    whatIsIt: "Проблема, яка заважає просуванню роботи — задачу, реліз чи PR не можна завершити, поки blocker не вирішений. Часто згадується на стендапах: «What are your blockers?»",
    useCases: ["на щоденному стендапі — повідомити, що заважає прогресу", "позначити критичну помилку в PR, яку ОБОВ'ЯЗКОВО треба виправити перед злиттям"],
    syntax: `I'm blocked on the API not returning the right data.`,
    attributes: [
      { name: "blocker", desc: "іменник — перешкода, що зупиняє роботу" },
      { name: "I'm blocked on...", desc: "фраза — «мене зупиняє...»" },
      { name: "unblock", desc: "дієслово — усунути перешкоду, розблокувати" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>На стендапі:</b> "No blockers on my side today."<br>
  <b>Або:</b> "I'm blocked on the design review — waiting for feedback from the team."
</p>`,
    pitfalls: [
      "Не варто називати blocker дрібну незручність — це слово має вагу й сигналізує реальну зупинку роботи.",
      "«I'm blocking» (без -ed) означає «я блокую когось іншого» — протилежне значення до «I'm blocked» (мене блокують).",
    ],
    related: ["eng-standup", "eng-eta"],
  },
  "eng-request-changes": {
    badge: "English",
    title: "request changes",
    whatIsIt: "Формальна дія в код-рев'ю (напр. на GitHub) — рецензент вимагає конкретних змін перед тим, як PR можна буде злити. Сильніше за просто коментар: PR не зливається, поки автор не внесе правки або рецензент не змінить рішення.",
    useCases: ["коли в PR є реальна проблема (баг, вразливість), що потребує виправлення", "формальний статус рев'ю на GitHub/GitLab"],
    syntax: `Requesting changes: please add error handling for the API call.`,
    attributes: [
      { name: "Request changes", desc: "статус рев'ю — «вимагаю змін»" },
      { name: "Approve", desc: "протилежний статус — «схвалюю»" },
      { name: "Comment", desc: "нейтральний статус — просто коментар без формального рішення" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>У рев'ю PR:</b> "Requesting changes — this endpoint doesn't validate user input, which could lead to a security issue."
</p>`,
    pitfalls: [
      "Requesting changes без пояснення причини — фруструє автора PR; завжди додавай конкретний коментар, ЩО саме треба змінити.",
      "Плутанина з «change request» — це інший термін, що частіше означає формальний запит на зміну вимог проєкту, не код-рев'ю дію.",
    ],
    related: ["eng-lgtm", "eng-nitpick"],
  },
  "eng-standup": {
    badge: "English",
    title: "standup",
    whatIsIt: "Коротка щоденна зустріч команди (зазвичай 10-15 хвилин), де кожен відповідає на три питання: що робив учора, що робитиме сьогодні, чи є перешкоди (blockers). Назва походить від традиції проводити її стоячи, щоб не затягувати.",
    useCases: ["щоденна синхронізація команди в Agile/Scrum", "коротке звітування про прогрес без довгої наради"],
    syntax: `Yesterday I finished the login form. Today I'll work on validation. No blockers.`,
    attributes: [
      { name: "daily standup", desc: "повна назва зустрічі" },
      { name: "async standup", desc: "письмовий варіант — кожен пише статус у чат замість зустрічі" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>На стендапі:</b> "Yesterday I fixed the CSS bug on the checkout page. Today I'm starting on the payment integration. No blockers so far."
</p>`,
    pitfalls: [
      "Стендап не для детального обговорення рішень — довгі технічні дискусії варто перенести на окрему зустріч («let's take this offline»).",
      "«Standup» без контексту команда може сплутати з жанром гумору stand-up comedy — контекст зазвичай рятує.",
    ],
    related: ["eng-blocker", "eng-sync"],
  },
  "eng-sync": {
    badge: "English",
    title: "sync (up) / let's sync",
    whatIsIt: "Коротка зустріч чи розмова для узгодження статусу, рішення чи наступних кроків — «синхронізуватись». Часто пропонується, коли обговорення в чаті затягується й простіше поговорити напряму.",
    useCases: ["запросити колегу на коротку розмову для узгодження деталей", "регулярна зустріч 1-on-1 з менеджером"],
    syntax: `Can we sync up quickly about the API design?`,
    attributes: [
      { name: "let's sync", desc: "пропозиція коротко обговорити щось" },
      { name: "1-on-1 sync", desc: "регулярна особиста зустріч зі своїм менеджером" },
      { name: "quick sync", desc: "підкреслює, що розмова буде короткою" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>У Slack:</b> "This is getting long in the thread — can we sync up for 10 minutes tomorrow morning?"
</p>`,
    pitfalls: [
      "«Sync» тут не пов'язаний з технічною синхронізацією даних — контекст (зустріч vs код) зазвичай зрозумілий, але варто уточнювати в неоднозначних ситуаціях.",
    ],
    related: ["eng-standup", "eng-follow-up"],
  },
  "eng-follow-up": {
    badge: "English",
    title: "follow up",
    whatIsIt: "Дія — нагадати чи продовжити тему пізніше, після того як щось було обговорено чи відкладено. Часто вживається як «I'll follow up» (я нагадаю пізніше) чи «following up on...» (продовжуючи тему...).",
    useCases: ["нагадати про питання, на яке ще не відповіли", "продовжити обговорення після зустрічі листом-підсумком"],
    syntax: `Following up on my previous message — any updates on this?`,
    attributes: [
      { name: "follow up (дієслово)", desc: "нагадати/продовжити тему пізніше" },
      { name: "follow-up (іменник/прикметник)", desc: "\"a follow-up email\" — лист-нагадування" },
      { name: "as a follow-up to...", desc: "«продовжуючи тему...» на початку повідомлення" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>Email:</b> "Hi team, just following up on the deployment schedule we discussed last week. Any updates?"
</p>`,
    pitfalls: [
      "«Follow up» пишеться окремо як дієслово (I'll follow up), але через дефіс як іменник/прикметник (a follow-up meeting) — часто плутають.",
    ],
    related: ["eng-sync", "eng-fyi"],
  },
  "eng-eta": {
    badge: "English",
    title: "ETA",
    whatIsIt: "Скорочення від \"Estimated Time of Arrival\" — очікуваний час завершення задачі чи доставки. У розробці найчастіше означає «коли це буде готово».",
    useCases: ["питання менеджера про орієнтовний термін завершення задачі", "оцінка часу перед плануванням спринту"],
    syntax: `What's the ETA on the bug fix?`,
    attributes: [
      { name: "What's the ETA?", desc: "«Коли орієнтовно буде готово?»" },
      { name: "No ETA yet", desc: "«Поки не можу назвати точний термін»" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>Менеджер:</b> "What's the ETA on the payment bug?"<br>
  <b>Відповідь:</b> "ETA is end of day tomorrow, I still need to test the edge cases."
</p>`,
    pitfalls: [
      "Занадто оптимістична ETA без урахування тестування й рев'ю — краще закладати запас часу.",
      "ETA — саме ОРІЄНТОВНИЙ термін, не тверда обіцянка; для точних дедлайнів використовують інші слова (deadline, due date).",
    ],
    related: ["eng-blocker", "eng-standup"],
  },
  "fe-spa-mpa": {
    badge: "Frontend",
    title: "SPA vs MPA",
    whatIsIt: "Дві архітектури веб-застосунків. SPA (Single Page Application) — один HTML-файл, навігація між «сторінками» відбувається через JavaScript без перезавантаження. MPA (Multi Page Application) — кожна сторінка окремий запит на сервер з повним перезавантаженням.",
    useCases: ["SPA — інтерактивні застосунки (дашборди, соцмережі, цей проєкт)", "MPA — контентні сайти, блоги, інтернет-магазини, де важливе SEO кожної сторінки"],
    syntax: `// SPA: клієнтська маршрутизація
<Route path="/profile" element={<Profile />} />`,
    attributes: [
      { name: "SPA", desc: "швидка навігація без перезавантаження, складніше SEO, більший початковий бандл JS" },
      { name: "MPA", desc: "просте SEO з коробки, повне перезавантаження при переході, простіша ментальна модель" },
      { name: "Клієнтська маршрутизація", desc: "JS-бібліотека (напр. React Router) імітує навігацію, змінюючи URL і рендер без запиту на сервер" },
    ],
    example: `<div style="font-family:sans-serif;font-size:14px;">
  <p><b>SPA:</b> Перехід між "сторінками" — миттєво, JS підміняє вміст.</p>
  <p><b>MPA:</b> Перехід між сторінками — новий HTTP-запит, білий екран на мить, новий HTML.</p>
</div>`,
    pitfalls: [
      "SPA без SSR/SSG погано індексується пошуковиками, якщо не докласти зусиль (пошукові боти повинні виконати JS).",
      "Великий SPA-бандл сповільнює перше завантаження — вирішується code-splitting і лінивим завантаженням.",
      "MPA і SPA не взаємовиключні — сучасні мета-фреймворки (Next.js, Nuxt) поєднують переваги обох.",
    ],
    related: ["fe-rendering-strategies"],
  },
  "fe-rendering-strategies": {
    badge: "Frontend",
    title: "SSR, SSG, CSR, ISR",
    whatIsIt: "Стратегії визначають, ДЕ і КОЛИ генерується HTML сторінки. CSR — у браузері після завантаження JS. SSR — на сервері під кожен запит. SSG — заздалегідь під час збірки. ISR — SSG, що періодично оновлюється у фоні.",
    useCases: ["CSR — внутрішні дашборди, де SEO не критичне", "SSR — сторінки, що часто змінюються й потребують SEO (каталог товарів)", "SSG — блоги, документація, лендінги зі стабільним контентом"],
    syntax: `// Next.js: SSG приклад
export async function getStaticProps() {
  return { props: { data: await fetchData() } };
}`,
    attributes: [
      { name: "CSR (Client-Side Rendering)", desc: "браузер завантажує порожній HTML + JS, JS рендерить вміст" },
      { name: "SSR (Server-Side Rendering)", desc: "сервер генерує повний HTML під кожен запит — швидший перший показ, більше навантаження на сервер" },
      { name: "SSG (Static Site Generation)", desc: "HTML генерується один раз під час збірки — найшвидша роздача, підходить для стабільного контенту" },
      { name: "ISR (Incremental Static Regeneration)", desc: "SSG-сторінка, що періодично перегенеровується у фоні без повної пересборки сайту" },
    ],
    example: `<div style="font-family:sans-serif;font-size:14px;">
  <p><b>CSR:</b> Порожня сторінка → завантаження JS → рендер. Повільніший перший показ.</p>
  <p><b>SSR/SSG:</b> Готовий HTML одразу з сервера. Швидший перший показ, краще для SEO.</p>
</div>`,
    pitfalls: [
      "SSR збільшує навантаження на сервер — кожен запит вимагає рендерингу React/Vue на бекенді.",
      "SSG не підходить для дуже часто змінюваних даних (напр. курс валют у реальному часі) без ISR чи client-side оновлення.",
      "Плутанина SSR з простим MPA — SSR все ще «гідратує» сторінку JS-ом на клієнті для інтерактивності (React/Vue), на відміну від класичного серверного рендерингу без JS.",
    ],
    related: ["fe-spa-mpa"],
  },
  "fe-virtual-dom": {
    badge: "Frontend",
    title: "Virtual DOM",
    whatIsIt: "Легка копія реального DOM у пам'яті JavaScript. Коли стан компонента змінюється, фреймворк (React) спершу оновлює Virtual DOM, порівнює зі попередньою версією (diffing) і застосовує до РЕАЛЬНОГО DOM лише мінімальні необхідні зміни.",
    useCases: ["пояснює, чому React ефективно оновлює складні інтерфейси", "основа концепції декларативного UI (\"опиши, як має виглядати\" замість ручного керування DOM)"],
    syntax: `// Декларативно (React) — просто опиши бажаний стан
{count > 0 && <span>{count}</span>}`,
    attributes: [
      { name: "Virtual DOM", desc: "об'єкт у пам'яті, що описує структуру UI" },
      { name: "Reconciliation (узгодження)", desc: "процес порівняння старого й нового Virtual DOM" },
      { name: "Diffing", desc: "алгоритм пошуку мінімальної різниці між двома деревами" },
      { name: "Real DOM update", desc: "фактична зміна реальної сторінки — найповільніша частина, тому її мінімізують" },
    ],
    example: `<div style="font-family:sans-serif;font-size:14px;">
  <p>1. Стан змінюється → 2. Новий Virtual DOM створюється →</p>
  <p>3. Порівняння зі старим Virtual DOM → 4. Лише РІЗНИЦЯ застосовується до реального DOM</p>
</div>`,
    pitfalls: [
      "Virtual DOM НЕ завжди швидший за пряму роботу з DOM — це компроміс для зручності розробки складних UI, не абсолютна оптимізація.",
      "Сучасні фреймворки (Svelte, Solid) взагалі обходяться без Virtual DOM, компілюючи код у прямі DOM-операції — Virtual DOM не єдиний підхід.",
    ],
    related: ["fe-react-basics"],
  },
  "py-variables-types": {
    badge: "Python",
    title: "Змінні й типи даних",
    whatIsIt: "У Python не потрібно оголошувати тип змінної явно — вона визначається автоматично при присвоєнні значення (динамічна типізація). Основні типи: int (ціле), float (дробове), str (рядок), bool (логічне), list, tuple, set, dict.",
    useCases: ["зберігання будь-яких даних без явного оголошення типу", "перевірка типу значення перед обробкою", "перетворення між типами (int(), str(), float())"],
    syntax: `age = 25\nname = "Оля"\nis_admin = True`,
    attributes: [
      { name: "int / float", desc: "ціле й дробове число" },
      { name: "str", desc: "рядок — незмінна послідовність символів" },
      { name: "bool", desc: "True / False (з великої літери!)" },
      { name: "list / tuple", desc: "list — змінюваний список, tuple — незмінюваний" },
      { name: "dict / set", desc: "dict — пари ключ-значення, set — унікальні елементи без порядку" },
      { name: "type(x)", desc: "повертає тип значення x" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">age = 25
name = "Оля"
print(type(age))   # &lt;class 'int'&gt;
print(type(name))  # &lt;class 'str'&gt;
print(f"{name} має {age} років")</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">&lt;class 'int'&gt;
&lt;class 'str'&gt;
Оля має 25 років</pre>`,
    pitfalls: [
      "На відміну від JS, True/False пишуться з ВЕЛИКОЇ літери в Python (true/false — помилка).",
      "Ціле ділення / завжди повертає float у Python 3 (5 / 2 = 2.5), для цілого результату потрібно //.",
      "Змінні в Python — це посилання, тому list1 = list2 не копіює список, а створює друге ім'я для того самого об'єкта.",
    ],
    related: ["py-fstrings", "py-lists"],
  },
  "py-control-flow": {
    badge: "Python",
    title: "if/elif/else, for, while",
    whatIsIt: "Керування потоком виконання коду в Python через відступи (indentation) замість фігурних дужок — блок коду визначається однаковим рівнем відступу, зазвичай 4 пробіли.",
    useCases: ["умовне виконання коду залежно від значення", "перебір елементів списку чи іншої колекції", "повторення дій, поки виконується умова"],
    syntax: `if age >= 18:\n    print("Дорослий")\nelif age >= 13:\n    print("Підліток")\nelse:\n    print("Дитина")`,
    attributes: [
      { name: "if / elif / else", desc: "умовні розгалуження; elif — скорочення від 'else if'" },
      { name: "for x in iterable:", desc: "перебирає елементи списку, рядка, range тощо" },
      { name: "while умова:", desc: "виконує блок, поки умова істинна" },
      { name: "break / continue / pass", desc: "перервати цикл / пропустити ітерацію / нічого не робити (заглушка)" },
      { name: "Відступи (4 пробіли)", desc: "визначають межі блоку коду — ЗАМІНА фігурних дужок" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">for i in range(5):
    if i % 2 == 0:
        continue
    print(f"Непарне: {i}")</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Непарне: 1
Непарне: 3</pre>`,
    pitfalls: [
      "Неправильний відступ (змішування пробілів і табів чи різна кількість пробілів у блоці) — IndentationError, найчастіша помилка новачків.",
      "Забута двокрапка : в кінці рядка if/for/while — SyntaxError.",
      "range(5) дає числа 0,1,2,3,4 — 5 НЕ включається, часте джерело помилок «off by one».",
    ],
    related: ["py-functions"],
  },
  "py-functions": {
    badge: "Python",
    title: "def, lambda, *args/**kwargs",
    whatIsIt: "def оголошує функцію. lambda створює анонімну однорядкову функцію. *args збирає довільну кількість позиційних аргументів у кортеж, **kwargs — довільну кількість іменованих аргументів у словник.",
    useCases: ["виділення повторюваної логіки в окрему функцію", "коротка функція для передачі як аргумент (sorted, map, filter)", "функція з гнучкою кількістю аргументів"],
    syntax: `def greet(name, greeting="Привіт"):\n    return f"{greeting}, {name}!"\n\nsquare = lambda x: x ** 2`,
    attributes: [
      { name: "def name(params):", desc: "оголошує функцію" },
      { name: "return", desc: "завершує функцію й повертає значення (без return — повертає None)" },
      { name: "параметр=значення", desc: "значення за замовчуванням, якщо аргумент не переданий" },
      { name: "lambda args: expr", desc: "анонімна однорядкова функція" },
      { name: "*args", desc: "збирає позиційні аргументи в кортеж" },
      { name: "**kwargs", desc: "збирає іменовані аргументи в словник" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">def total(*numbers, **options):
    result = sum(numbers)
    if options.get("double"):
        result *= 2
    return result

print(total(1, 2, 3, double=True))</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">12</pre>`,
    pitfalls: [
      "Змінюваний об'єкт (список) як значення параметра за замовчуванням (def f(items=[])) — ця сама заглушка спільна між усіма викликами, часте джерело багів.",
      "Плутанина порядку: спершу звичайні параметри, потім *args, потім **kwargs — інший порядок дає SyntaxError.",
    ],
    related: ["py-control-flow", "py-classes"],
  },
  "sql-select-where": {
    badge: "SQL",
    title: "SELECT, WHERE, ORDER BY, LIMIT",
    whatIsIt: "SELECT — основа кожного SQL-запиту, обирає колонки для вибірки з таблиці. WHERE фільтрує рядки за умовою, ORDER BY сортує результат, LIMIT обмежує кількість повернутих рядків.",
    useCases: ["вибірка конкретних колонок замість усіх даних", "фільтрація рядків за умовою", "пагінація результатів (LIMIT + OFFSET)"],
    syntax: `SELECT name, age FROM users\nWHERE age > 18\nORDER BY age DESC\nLIMIT 10;`,
    attributes: [
      { name: "SELECT * / SELECT col1, col2", desc: "* вибирає всі колонки, або перелічуй конкретні" },
      { name: "FROM table", desc: "з якої таблиці вибираємо дані" },
      { name: "WHERE умова", desc: "фільтрує рядки ДО групування" },
      { name: "ORDER BY col ASC/DESC", desc: "сортує результат за зростанням (типово) чи спаданням" },
      { name: "LIMIT n OFFSET m", desc: "обмежує кількість рядків і пропускає перші m — для пагінації" },
      { name: "DISTINCT", desc: "прибирає повторювані рядки з результату" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT name, age FROM users
WHERE age >= 18
ORDER BY age DESC
LIMIT 3;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">name</th><th style="border:1px solid #ccc;padding:4px 10px;">age</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Іван</td><td style="border:1px solid #ccc;padding:4px 10px;">42</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Оля</td><td style="border:1px solid #ccc;padding:4px 10px;">25</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Марія</td><td style="border:1px solid #ccc;padding:4px 10px;">19</td></tr>
</table>`,
    pitfalls: [
      "WHERE не може використовувати результат агрегатної функції (COUNT, SUM) — для фільтрації груп потрібен HAVING.",
      "Забутий ORDER BY — порядок рядків результату не гарантований жодним стандартом SQL.",
      "SELECT * зручний для дослідження, але в продакшн-коді краще перелічувати конкретні колонки — стабільніше й ефективніше.",
    ],
    related: ["sql-filtering", "sql-aggregation-grouping"],
  },
  "sql-filtering": {
    badge: "SQL",
    title: "AND, OR, IN, BETWEEN, LIKE, IS NULL",
    whatIsIt: "Оператори для побудови складних умов фільтрації у WHERE — комбінування кількох умов, перевірка входження в список, діапазон значень, пошук за текстовим шаблоном, перевірка відсутності значення.",
    useCases: ["фільтрація за кількома критеріями одночасно (AND/OR)", "перевірка, чи значення входить у список варіантів (IN)", "пошук тексту за частковим збігом (LIKE)", "знаходження рядків з відсутнім значенням (IS NULL)"],
    syntax: `WHERE city IN ('Київ', 'Львів')\n  AND age BETWEEN 18 AND 65\n  AND name LIKE 'О%';`,
    attributes: [
      { name: "AND / OR / NOT", desc: "комбінують кілька умов у WHERE" },
      { name: "IN (список)", desc: "перевіряє, чи значення входить у заданий список" },
      { name: "BETWEEN a AND b", desc: "перевіряє, чи значення в діапазоні (включно з краями)" },
      { name: "LIKE 'шаблон'", desc: "пошук за текстовим шаблоном: % — будь-які символи, _ — один символ" },
      { name: "IS NULL / IS NOT NULL", desc: "перевіряють відсутність значення — оператор = NULL НЕ працює" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT name, email FROM users
WHERE email IS NULL
   OR name LIKE 'О%';</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">name</th><th style="border:1px solid #ccc;padding:4px 10px;">email</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Оля</td><td style="border:1px solid #ccc;padding:4px 10px;">olya@mail.com</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Богдан</td><td style="border:1px solid #ccc;padding:4px 10px;">NULL</td></tr>
</table>`,
    pitfalls: [
      "WHERE email = NULL НІКОЛИ не спрацює — NULL не дорівнює нічому, навіть самому собі; завжди потрібен IS NULL.",
      "LIKE без % на обох кінцях шукає точну відповідність, а не входження підрядка — 'О%' знаходить лише те, що ПОЧИНАЄТЬСЯ з 'О'.",
    ],
    related: ["sql-select-where"],
  },
  "sql-aggregation-grouping": {
    badge: "SQL",
    title: "COUNT, SUM, AVG, GROUP BY, HAVING",
    whatIsIt: "Агрегатні функції обчислюють одне значення з набору рядків — кількість, суму, середнє. GROUP BY групує рядки за значенням колонки для застосування агрегації до кожної групи окремо. HAVING фільтрує вже ЗГРУПОВАНІ результати.",
    useCases: ["підрахунок кількості замовлень на кожного клієнта", "сума продажів за кожен місяць", "знаходження груп, що перевищують певний поріг (напр. клієнти з 5+ замовленнями)"],
    syntax: `SELECT city, COUNT(*) as total\nFROM users\nGROUP BY city\nHAVING COUNT(*) > 10;`,
    attributes: [
      { name: "COUNT(*) / COUNT(col)", desc: "кількість рядків / кількість НЕ-NULL значень у колонці" },
      { name: "SUM() / AVG()", desc: "сума й середнє значення числової колонки" },
      { name: "MIN() / MAX()", desc: "найменше й найбільше значення" },
      { name: "GROUP BY col", desc: "групує рядки за значенням колонки — агрегатні функції рахують ОКРЕМО для кожної групи" },
      { name: "HAVING умова", desc: "фільтрує групи ПІСЛЯ агрегації — WHERE тут не підходить" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT city, COUNT(*) as total, AVG(age) as avg_age
FROM users
GROUP BY city
HAVING COUNT(*) > 1;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">city</th><th style="border:1px solid #ccc;padding:4px 10px;">total</th><th style="border:1px solid #ccc;padding:4px 10px;">avg_age</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Київ</td><td style="border:1px solid #ccc;padding:4px 10px;">15</td><td style="border:1px solid #ccc;padding:4px 10px;">29.4</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Львів</td><td style="border:1px solid #ccc;padding:4px 10px;">8</td><td style="border:1px solid #ccc;padding:4px 10px;">33.1</td></tr>
</table>`,
    pitfalls: [
      "Колонка в SELECT, якої немає ні в GROUP BY, ні в агрегатній функції — помилка (чи непередбачувана поведінка) у більшості СУБД.",
      "Плутанина WHERE і HAVING — WHERE фільтрує рядки ДО групування, HAVING — групи ПІСЛЯ, з доступом до результатів COUNT/SUM тощо.",
      "COUNT(col) пропускає NULL-значення, а COUNT(*) рахує ВСІ рядки — різні результати для колонок з пропусками.",
    ],
    related: ["sql-select-where", "sql-window-functions"],
  },
  "css-selectors": {
    badge: "CSS",
    title: "Селектори",
    whatIsIt: "Селектори визначають, до яких HTML-елементів застосовується CSS-правило. Від простого (за тегом, класом, id) до складних комбінацій (нащадок, прямий нащадок, сусід) — селектор завжди йде перед фігурними дужками { }.",
    useCases: ["стилізація всіх елементів певного тегу", "стилізація за класом чи id", "стилізація елементів залежно від їх положення в розмітці"],
    syntax: `селектор { властивість: значення; }`,
    attributes: [
      { name: "p", desc: "усі елементи <p> (за тегом)" },
      { name: ".card", desc: "усі елементи з class=\"card\" (за класом)" },
      { name: "#header", desc: "єдиний елемент з id=\"header\" (за id)" },
      { name: "div p", desc: "усі <p> всередині <div>, на будь-якій глибині (нащадок)" },
      { name: "div > p", desc: "лише <p>, що прямі діти <div> (прямий нащадок)" },
      { name: "h1 + p", desc: "перший <p> одразу після <h1> (сусід)" },
      { name: "a, button", desc: "одночасно і <a>, і <button> (перелік через кому)" },
    ],
    example: `<style>
  .box { padding: 8px; margin-bottom: 6px; border-radius: 6px; color: white; }
  .box.red { background: #ef4444; }
  .box.blue { background: #3b82f6; }
  div > .box { border: 2px solid gold; }
</style>
<div>
  <p class="box red">Червоний бокс (клас .red)</p>
  <p class="box blue">Синій бокс (клас .blue), з золотою рамкою бо прямий нащадок div</p>
</div>`,
    pitfalls: [
      "Плутанина між div p (усі нащадки) і div > p (лише прямі діти) — часто впливає невірно на глибоко вкладені елементи.",
      "Надмірно специфічні селектори (напр. div.container ul li a.link) ускладнюють перевизначення стилів пізніше.",
      "Заплутування # (id, унікальний) і . (class, можна повторювати) — id має вищий пріоритет у каскаді.",
    ],
    related: ["css-flexbox", "css-pseudo-classes"],
  },
  "css-box-model": {
    badge: "CSS",
    title: "Box Model (модель блоку)",
    whatIsIt: "Кожен елемент на сторінці — прямокутний блок, що складається з чотирьох шарів: контент, padding (внутрішній відступ), border (рамка), margin (зовнішній відступ). Розуміння цієї моделі — основа будь-якої верстки.",
    useCases: ["контроль розмірів і відступів будь-якого елемента", "створення карток, кнопок, контейнерів з правильними відступами", "вирівнювання елементів через margin"],
    syntax: `.box {\n  width: 200px;\n  padding: 16px;\n  border: 2px solid #333;\n  margin: 10px;\n  box-sizing: border-box;\n}`,
    attributes: [
      { name: "width / height", desc: "розмір самого контенту (без padding/border, якщо box-sizing: content-box)" },
      { name: "padding", desc: "внутрішній відступ між контентом і рамкою" },
      { name: "border", desc: "рамка навколо padding" },
      { name: "margin", desc: "зовнішній відступ між цим елементом і сусідніми" },
      { name: "box-sizing", desc: "border-box — width/height включають padding+border (рекомендовано); content-box — типова поведінка без них" },
    ],
    example: `<style>
  .demo { box-sizing: border-box; width: 220px; padding: 16px; margin: 10px; border: 3px solid #7c3aed; background: #ede9fe; border-radius: 6px; }
</style>
<div class="demo">width: 220px включає padding і border завдяки box-sizing: border-box.</div>`,
    pitfalls: [
      "Забутий box-sizing: border-box — розмір елемента непередбачувано збільшується на padding+border.",
      "Схлопування зовнішніх margin (margin collapse) двох сусідніх блокових елементів по вертикалі — підсумковий відступ не сума, а більше з двох значень.",
      "margin: auto центрує блок лише якщо в нього є явна width і display: block.",
    ],
    related: ["css-flexbox", "css-selectors"],
  },
  "css-flexbox": {
    badge: "CSS",
    title: "Flexbox",
    whatIsIt: "Одновимірна система макетування — розташовує елементи в ряд або стовпчик, з гнучким розподілом простору, вирівнюванням і зміною порядку. Найпростіший спосіб центрувати елемент чи зробити рівномірні картки.",
    useCases: ["центрування елементів по вертикалі й горизонталі", "навігаційні панелі, ряди кнопок", "рівномірний розподіл карток чи колонок"],
    syntax: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 10px;\n}`,
    attributes: [
      { name: "display: flex", desc: "вмикає flex-контейнер для прямих дітей" },
      { name: "flex-direction", desc: "row (типово) — в ряд, column — у стовпчик" },
      { name: "justify-content", desc: "вирівнювання по головній осі: center, space-between, flex-end..." },
      { name: "align-items", desc: "вирівнювання по поперечній осі: center, stretch, flex-start..." },
      { name: "gap", desc: "відступ між елементами-дітьми" },
      { name: "flex-wrap", desc: "wrap — дозволяє елементам переноситись на новий рядок" },
    ],
    example: `<style>
  .row { display: flex; justify-content: space-between; align-items: center; gap: 10px; background: #f4f4f4; padding: 10px; border-radius: 6px; }
  .item { background: #0ea5e9; color: white; padding: 10px 16px; border-radius: 6px; }
</style>
<div class="row">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>`,
    pitfalls: [
      "Плутанина justify-content (головна вісь) і align-items (поперечна вісь) — залежить від flex-direction.",
      "Забутий gap і використання margin на кожному елементі замість нього — більше коду для того самого результату.",
      "align-items: stretch (типова поведінка) розтягує елементи по висоті, що не завжди очікувано.",
    ],
    related: ["css-grid", "css-box-model"],
  },
  "css-grid": {
    badge: "CSS",
    title: "CSS Grid",
    whatIsIt: "Двовимірна система макетування — керує рядками й колонками одночасно, на відміну від flexbox (лише один напрямок). Ідеальна для складних макетів сторінки: шапка, бічна панель, контент, підвал.",
    useCases: ["макет сторінки з колонками й рядками", "галереї зображень з рівними комірками", "складні адаптивні макети без зайвих обгорток"],
    syntax: `.grid {\n  display: grid;\n  grid-template-columns: 1fr 2fr;\n  gap: 10px;\n}`,
    attributes: [
      { name: "display: grid", desc: "вмикає grid-контейнер для прямих дітей" },
      { name: "grid-template-columns", desc: "кількість і ширина колонок, напр. \"1fr 1fr 1fr\" — три рівні" },
      { name: "grid-template-rows", desc: "кількість і висота рядків" },
      { name: "gap", desc: "відступ між комірками (по рядках і колонках)" },
      { name: "grid-column / grid-row", desc: "на дочірньому елементі — скільки комірок він займає" },
      { name: "grid-template-areas", desc: "макет через текстову схему з іменованими областями (напр. \"header header\" \"sidebar content\")" },
      { name: "repeat() / minmax()", desc: "repeat(3, 1fr) — повторити шаблон колонок, minmax(100px, 1fr) — діапазон розміру доріжки" },
      { name: "auto-fit / auto-fill", desc: "автоматична кількість колонок залежно від доступного простору: repeat(auto-fit, minmax(150px, 1fr))" },
      { name: "fit-content()", desc: "обмежує розмір доріжки під реальний вміст, але не більше заданого максимуму" },
    ],
    example: `<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 8px; }
  .cell { background: #7c3aed; color: white; padding: 16px; text-align: center; border-radius: 6px; }
  .cell.wide { grid-column: span 2; background: #0ea5e9; }
</style>
<div class="grid">
  <div class="cell wide">span 2 колонки</div>
  <div class="cell">3</div>
  <div class="cell">4</div>
  <div class="cell">5</div>
</div>`,
    pitfalls: [
      "Плутанина grid і flexbox — grid для двовимірних макетів (рядки+колонки), flexbox для одновимірних (ряд або стовпчик).",
      "Одиниця fr (fraction) — частка вільного простору, не плутати з відсотками чи px.",
      "Забутий gap і використання margin на комірках — може зламати рівність ширини колонок.",
    ],
    related: ["css-flexbox", "css-box-model"],
  },
  "css-pseudo-classes": {
    badge: "CSS",
    title: "Псевдокласи (:hover, :nth-child...)",
    whatIsIt: "Псевдокласи вибирають елементи залежно від їх стану чи положення, яких немає в самій HTML-розмітці — наведення курсору, фокус, перший/останній дочірній елемент тощо. Записуються через одну двокрапку.",
    useCases: ["стилі при наведенні курсору чи фокусі", "чергування кольорів рядків таблиці (зебра)", "стилізація першого чи останнього елемента списку"],
    syntax: `a:hover { color: red; }\nli:nth-child(2n) { background: #f4f4f4; }`,
    attributes: [
      { name: ":hover", desc: "поки курсор наведений на елемент" },
      { name: ":focus", desc: "поки елемент у фокусі (напр. поле вводу)" },
      { name: ":active", desc: "у момент кліку/натискання" },
      { name: ":first-child / :last-child", desc: "перший/останній дочірній елемент серед братів" },
      { name: ":nth-child(n)", desc: "елемент за номером чи формулою, напр. 2n — парні" },
      { name: ":not(селектор)", desc: "усі елементи, що НЕ відповідають вказаному селектору" },
      { name: ":disabled / :checked", desc: "стан форм-елементів" },
    ],
    example: `<style>
  button { padding: 8px 16px; background: #7c3aed; color: white; border: none; border-radius: 6px; cursor: pointer; }
  button:hover { background: #6d28d9; }
  button:active { transform: scale(0.97); }
  ul li:nth-child(2n) { background: #f4f4f4; }
</style>
<button>Наведи на мене</button>
<ul style="margin-top:10px;padding-left:20px;">
  <li>Рядок 1</li><li>Рядок 2 (парний, сірий)</li><li>Рядок 3</li><li>Рядок 4 (парний, сірий)</li>
</ul>`,
    pitfalls: [
      "Плутанина :nth-child(2) (другий елемент, будь-якого типу) з :nth-of-type(2) (другий елемент саме цього тегу серед братів).",
      "Стилі :hover не спрацьовують на тач-екранах так само, як на десктопі — варто не покладатись лише на них для критичного функціоналу.",
      "Забутий порядок LVHA (:link, :visited, :hover, :active) для посилань — неправильний порядок ламає каскад.",
    ],
    related: ["css-pseudo-elements", "css-selectors"],
  },
  "css-pseudo-elements": {
    badge: "CSS",
    title: "Псевдоелементи (::before, ::after...)",
    whatIsIt: "Псевдоелементи дозволяють стилізувати чи навіть створювати «віртуальні» частини елемента, яких немає в розмітці — наприклад, вставити декоративний вміст перед текстом чи виділити першу літеру абзацу. Записуються через дві двокрапки.",
    useCases: ["декоративні іконки чи символи без зайвого HTML", "лічильники й нумерація списків", "виділення першої літери чи рядка абзацу"],
    syntax: `.quote::before { content: "«"; }\n.quote::after { content: "»"; }`,
    attributes: [
      { name: "::before", desc: "вставляє віртуальний вміст перед контентом елемента" },
      { name: "::after", desc: "вставляє віртуальний вміст після контенту елемента" },
      { name: "content", desc: "обов'язковий для ::before/::after — текст, символ або порожній рядок \"\"" },
      { name: "::first-letter", desc: "стилізує першу літеру блокового елемента" },
      { name: "::first-line", desc: "стилізує перший рядок тексту" },
      { name: "::selection", desc: "стилізує виділений користувачем текст" },
    ],
    example: `<style>
  .badge { position: relative; padding: 8px 16px 8px 28px; background: #ede9fe; border-radius: 6px; display: inline-block; }
  .badge::before { content: "✓"; position: absolute; left: 10px; color: #7c3aed; font-weight: bold; }
  .fancy::first-letter { font-size: 1.8em; color: #7c3aed; font-weight: bold; }
</style>
<span class="badge">Виконано</span>
<p class="fancy">Перша літера цього абзацу збільшена через ::first-letter.</p>`,
    pitfalls: [
      "Забутий content — без нього ::before/::after взагалі не з'являться, навіть з іншими стилями.",
      "::before/::after не працюють на елементах без вмісту в деяких контекстах (напр. <img>, <input>).",
      "Зловживання псевдоелементами для контенту, що має семантичне значення — краще реальна розмітка для важливого тексту.",
    ],
    related: ["css-pseudo-classes"],
  },
  "css-colors-gradients": {
    badge: "CSS",
    title: "Кольори й градієнти",
    whatIsIt: "CSS підтримує кілька форматів запису кольору (назва, hex, rgb, hsl) та функції для плавних переходів між кольорами (градієнти) — для фонів, обводок, тіней.",
    useCases: ["фон кнопок і карток", "плавні переходи кольору (градієнтні банери, кнопки)", "напівпрозорі накладки поверх зображень"],
    syntax: `.box {\n  color: #7c3aed;\n  background: rgba(0, 0, 0, 0.5);\n  background: linear-gradient(90deg, #7c3aed, #0ea5e9);\n}`,
    attributes: [
      { name: "#rrggbb", desc: "шістнадцятковий формат, напр. #7c3aed" },
      { name: "rgb(r, g, b)", desc: "через числа 0-255 для кожного каналу" },
      { name: "rgba(r, g, b, a)", desc: "те саме, плюс прозорість (0-1)" },
      { name: "hsl(h, s%, l%)", desc: "за тоном (0-360), насиченістю й яскравістю — зручно для варіацій одного кольору" },
      { name: "linear-gradient()", desc: "лінійний перехід між кількома кольорами під кутом" },
      { name: "radial-gradient()", desc: "перехід кольорів від центру назовні по колу/еліпсу" },
    ],
    example: `<style>
  .swatch { display: inline-block; width: 80px; height: 50px; border-radius: 6px; margin: 4px; color: white; font-size: 11px; text-align: center; line-height: 50px; }
</style>
<div class="swatch" style="background:#7c3aed;">#7c3aed</div>
<div class="swatch" style="background:rgba(14,165,233,0.7);">rgba()</div>
<div class="swatch" style="background:linear-gradient(90deg,#7c3aed,#ec4899);">gradient</div>
<div class="swatch" style="background:radial-gradient(circle,#0ea5e9,#0c4a6e);">radial</div>`,
    pitfalls: [
      "rgba/hsla прозорість (0-1) можна сплутати з відсотками — 0.5 означає 50%, а не 0.5%.",
      "Градієнт без вказаного кута/напрямку (напр. лише linear-gradient(red, blue)) типово йде згори вниз — не завжди очікувано.",
      "Низький контраст кольору тексту й фону — проблема доступності, варто перевіряти співвідношення контрастності.",
    ],
    related: ["css-box-model"],
  },
  "css-transform": {
    badge: "CSS",
    title: "transform",
    whatIsIt: "Властивість transform змінює форму, розмір чи положення елемента — обертання, масштабування, зсув, нахил — без впливу на розташування сусідніх елементів (на відміну від зміни width/margin).",
    useCases: ["анімовані ефекти при наведенні (збільшення картки)", "обертання іконок", "позиціювання елементів через translate замість margin"],
    syntax: `.box { transform: rotate(15deg) scale(1.1); }`,
    attributes: [
      { name: "translate(x, y)", desc: "зсуває елемент по осях X/Y, не впливаючи на потік документа" },
      { name: "rotate(deg)", desc: "обертає елемент на вказаний кут" },
      { name: "scale(n)", desc: "масштабує елемент (1 — без змін, 1.5 — на 50% більше)" },
      { name: "skew(deg)", desc: "нахиляє елемент по осях" },
      { name: "transform-origin", desc: "точка, відносно якої відбувається трансформація (типово центр)" },
    ],
    example: `<style>
  .card { width: 100px; height: 60px; background: #7c3aed; color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: transform 0.3s; }
  .card:hover { transform: rotate(-4deg) scale(1.1); }
</style>
<div class="card">Наведи на мене</div>`,
    pitfalls: [
      "transform не впливає на layout сусідніх елементів — на відміну від зміни width/margin, елементи навколо не зсуваються.",
      "Кілька трансформацій в одному значенні (rotate + scale) застосовуються в порядку запису — це впливає на результат.",
      "Анімація transform без transition чи @keyframes відбувається миттєво, без плавності.",
    ],
    related: ["css-animation-transition"],
  },
  "css-animation-transition": {
    badge: "CSS",
    title: "transition і animation",
    whatIsIt: "transition плавно змінює значення властивості між двома станами (напр. звичайний і :hover). animation дозволяє задати складнішу послідовність кроків через @keyframes, що може повторюватись автоматично, без потреби в події.",
    useCases: ["плавна зміна кольору/розміру при hover (transition)", "автоматичні анімації-заставки, спінери завантаження (animation)", "анімовані підказки й переходи між станами інтерфейсу"],
    syntax: `.btn { transition: background 0.3s ease; }\n@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }\n.dot { animation: pulse 1.5s infinite; }`,
    attributes: [
      { name: "transition-property", desc: "яку властивість анімувати (напр. background, transform)" },
      { name: "transition-duration", desc: "тривалість переходу, напр. 0.3s" },
      { name: "transition-timing-function", desc: "крива швидкості: ease, linear, ease-in-out..." },
      { name: "@keyframes", desc: "описує кроки анімації у відсотках (0%, 50%, 100%)" },
      { name: "animation-duration / animation-iteration-count", desc: "тривалість одного циклу й кількість повторів (infinite — нескінченно)" },
      { name: "animation-fill-mode", desc: "forwards — лишити стан останнього кадру, backwards — застосувати стан першого кадру до старту, both — обидва" },
      { name: "animation-direction", desc: "normal, reverse, alternate (туди-сюди), alternate-reverse" },
      { name: "animation-play-state", desc: "running / paused — керує відтворенням, напр. пауза при наведенні" },
    ],
    example: `<style>
  .btn { padding: 10px 20px; background: #7c3aed; color: white; border: none; border-radius: 6px; transition: background 0.3s ease, transform 0.3s ease; }
  .btn:hover { background: #0ea5e9; transform: translateY(-3px); }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
  .dot { width: 14px; height: 14px; border-radius: 50%; background: #ef4444; display: inline-block; margin-left: 12px; animation: pulse 1.5s infinite; }
</style>
<button class="btn">Наведи на мене</button><span class="dot"></span>`,
    pitfalls: [
      "transition спрацьовує лише при реальній зміні значення властивості (напр. через :hover чи JS) — сам по собі нічого не анімує.",
      "Анімація властивостей layout (width, height, top) гірша для продуктивності, ніж transform/opacity — варто віддавати перевагу останнім.",
      "Забутий animation-fill-mode — після завершення анімація може «стрибнути» назад до початкового стану.",
    ],
    related: ["css-transform"],
  },
  "css-at-rules": {
    badge: "CSS",
    title: "@-правила (@media, @keyframes, @font-face...)",
    whatIsIt: "@-правила — особливі інструкції CSS, що не описують стиль елемента напряму, а задають умови (адаптивність), імпорти, анімації чи підключення шрифтів. Починаються з символу @.",
    useCases: ["адаптивна верстка під різні розміри екрана (@media)", "власна анімація (@keyframes)", "підключення кастомного шрифту (@font-face)", "імпорт іншого CSS-файлу (@import)"],
    syntax: `@media (max-width: 600px) {\n  .box { flex-direction: column; }\n}`,
    attributes: [
      { name: "@media", desc: "застосовує стилі лише за певної умови, напр. ширини екрана" },
      { name: "@keyframes", desc: "описує кроки для animation" },
      { name: "@font-face", desc: "підключає власний файл шрифту" },
      { name: "@import", desc: "імпортує стилі з іншого CSS-файлу (на початку файлу)" },
      { name: "@supports", desc: "застосовує стилі лише якщо браузер підтримує вказану властивість" },
      { name: "@container", desc: "застосовує стилі залежно від розміру БАТЬКІВСЬКОГО контейнера, а не всього вікна" },
      { name: "@layer", desc: "групує стилі в іменовані шари з явним порядком пріоритету в каскаді" },
      { name: "@scope", desc: "обмежує дію селекторів усередині CSS лише певною гілкою DOM-дерева" },
    ],
    example: `<style>
  .responsive { display: flex; gap: 8px; background: #f4f4f4; padding: 10px; border-radius: 6px; }
  .responsive div { background: #7c3aed; color: white; padding: 10px; border-radius: 6px; flex: 1; text-align: center; }
  @media (max-width: 300px) {
    .responsive { flex-direction: column; }
  }
</style>
<div class="responsive"><div>1</div><div>2</div><div>3</div></div>
<p style="font-size:13px;color:#666;">Зменш ширину вікна (чи iframe) менше 300px — колонки стануть рядком.</p>`,
    pitfalls: [
      "@import сповільнює завантаження сторінки, якщо йде не першим правилом у файлі — браузер має завантажити його послідовно.",
      "Плутанина max-width і min-width у @media — max-width спрацьовує до вказаної ширини, min-width — від неї.",
      "@keyframes без анімаційного імені, застосованого через animation, не робить нічого — вони мають бути пов'язані.",
    ],
    related: ["css-animation-transition", "css-flexbox"],
  },

  "css-position": {
    badge: "CSS",
    title: "position",
    whatIsIt: "Властивість position визначає, як саме елемент позиціюється в макеті сторінки: за звичайним потоком документа чи за явними координатами top/right/bottom/left. Значення static, relative, absolute, fixed і sticky поводяться кардинально по-різному.",
    useCases: ["спливаючі підказки й модальні вікна (absolute/fixed)", "шапка, що прилипає при скролі (sticky)", "невеликий зсув елемента без впливу на сусідів (relative)", "бейджі й лічильники поверх картки (absolute всередині relative-контейнера)"],
    syntax: `.box {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}`,
    attributes: [
      { name: "static", desc: "типова поведінка — елемент у звичайному потоці, top/left не діють" },
      { name: "relative", desc: "зсувається відносно власного нормального положення, місце під нього лишається" },
      { name: "absolute", desc: "позиціюється відносно найближчого предка з position, відмінним від static" },
      { name: "fixed", desc: "позиціюється відносно вікна браузера, не рухається при скролі" },
      { name: "sticky", desc: "поводиться як relative, поки не досягне заданого краю, потім «прилипає» як fixed" },
      { name: "z-index", desc: "порядок накладання позиціонованих елементів по осі глибини" },
    ],
    example: `<div style="position:relative;height:100px;background:#f4f4f4;border-radius:6px;">
  <div style="position:absolute;top:8px;right:8px;background:#ef4444;color:white;padding:2px 8px;border-radius:10px;font-size:12px;">NEW</div>
  <p style="padding:12px;">Картка товару з бейджем у кутку.</p>
</div>`,
    pitfalls: [
      "absolute без position: relative на батьку — елемент позиціюється відносно всієї сторінки, а не контейнера.",
      "Забутий z-index при накладанні кількох позиціонованих елементів — порядок непередбачуваний.",
      "sticky не спрацює, якщо в батька overflow: hidden/auto — липкість «зникає».",
    ],
    related: ["css-box-model", "css-display-overflow"],
  },
  "css-display-overflow": {
    badge: "CSS",
    title: "display і overflow",
    whatIsIt: "display визначає, як елемент бере участь у макеті — блок, рядок, flex, grid чи взагалі не показується. overflow керує вмістом, що не влазить у задані розміри елемента — обрізати, показати скрол чи дозволити виходити за межі.",
    useCases: ["приховати елемент повністю (display: none)", "зробити рядковий елемент блоковим для власних розмірів (inline-block)", "область з прокруткою для довгого списку (overflow: auto)", "обрізаний текст в один рядок з трьома крапками"],
    syntax: `.box {\n  display: inline-block;\n  overflow-y: auto;\n  max-height: 150px;\n}`,
    attributes: [
      { name: "block / inline / inline-block", desc: "block — на весь рядок, inline — у потоці тексту, inline-block — у потоці, але з власними розмірами" },
      { name: "flex / grid", desc: "вмикають flex/grid-контейнер для прямих дітей" },
      { name: "none", desc: "повністю прибирає елемент з макету, без резервування місця" },
      { name: "overflow: visible / hidden / scroll / auto", desc: "показати вихід за межі, обрізати, завжди показувати скрол чи лише за потреби" },
      { name: "overflow-x / overflow-y", desc: "керують переповненням окремо по горизонталі й вертикалі" },
      { name: "text-overflow: ellipsis", desc: "показує три крапки замість тексту, що не влазить у рядок (разом з white-space: nowrap)" },
    ],
    example: `<div style="max-height:80px;overflow-y:auto;border:1px solid #ccc;padding:8px;border-radius:6px;">
  <p>Рядок 1</p><p>Рядок 2</p><p>Рядок 3</p><p>Рядок 4</p><p>Рядок 5</p>
</div>
<p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:150px;border:1px solid #ccc;padding:4px;margin-top:8px;">Дуже довгий текст, що обрізається</p>`,
    pitfalls: [
      "display: none прибирає елемент з дерева доступності — скрінрідери його теж не бачать, на відміну від visibility: hidden.",
      "text-overflow: ellipsis не спрацює без white-space: nowrap і заданої ширини одночасно.",
      "overflow: hidden на батьку може випадково обрізати tooltip/dropdown дитини.",
    ],
    related: ["css-position", "css-flexbox", "css-grid"],
  },
  "css-units": {
    badge: "CSS",
    title: "Одиниці виміру",
    whatIsIt: "CSS підтримує кілька типів одиниць: абсолютні (px), відносні до батька чи шрифту (%, em, rem), відносні до вікна перегляду (vw, vh) і спеціальні (deg для кутів, s/ms для часу). Вибір одиниці впливає на те, як елемент масштабується в різних умовах.",
    useCases: ["px для чіткого фіксованого розміру (рамки, тіні)", "rem для розмірів шрифту, що масштабуються разом з налаштуваннями користувача", "vw/vh для елементів на весь екран", "% для адаптивної ширини відносно контейнера"],
    syntax: `.box {\n  width: 50%;\n  padding: 1rem;\n  font-size: 1.2em;\n  height: 100vh;\n}`,
    attributes: [
      { name: "px", desc: "фіксований піксель — не масштабується з налаштуваннями шрифту браузера" },
      { name: "% ", desc: "відсоток від розміру батьківського елемента" },
      { name: "em", desc: "відносно розміру шрифту ПОТОЧНОГО елемента — накопичується при вкладеності" },
      { name: "rem", desc: "відносно розміру шрифту кореневого <html> — передбачуваніший за em" },
      { name: "vw / vh", desc: "1% ширини/висоти вікна браузера відповідно" },
      { name: "deg / s / ms", desc: "кути для transform/gradient, час для transition/animation" },
    ],
    example: `<div style="font-size:16px;">
  <div style="font-size:1.5em;background:#ede9fe;padding:8px;border-radius:6px;">1.5em від батька (16px) = 24px</div>
  <div style="font-size:1.5rem;background:#dbeafe;padding:8px;border-radius:6px;margin-top:6px;">1.5rem від кореня документа</div>
</div>`,
    pitfalls: [
      "em накопичується при вкладених елементах з різним font-size — розмір стає непередбачуваним, rem безпечніший.",
      "100vh на мобільних не враховує адресний рядок браузера — краще dvh для справжньої видимої висоти.",
      "Змішування px і % в одному розрахунку розміру ускладнює передбачення підсумкового значення.",
    ],
    related: ["css-box-model", "css-calc-clamp"],
  },

  "css-background": {
    badge: "CSS",
    title: "background-image / background-*",
    whatIsIt: "Набір властивостей background-* керує фоновим зображенням елемента окремо від суцільного кольору: яке зображення, як масштабоване, де розташоване, чи повторюється і чи прокручується разом зі сторінкою.",
    useCases: ["фонове зображення секції героя на головній сторінці", "іконки як фон замість <img> (спрайти)", "паралакс-ефект через background-attachment: fixed"],
    syntax: `.hero {\n  background-image: url('bg.jpg');\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n}`,
    attributes: [
      { name: "background-image", desc: "адреса зображення (чи градієнт) як фон" },
      { name: "background-size", desc: "cover заповнює весь контейнер обрізаючи, contain — вписує повністю" },
      { name: "background-position", desc: "позиція зображення в контейнері, напр. center, top right" },
      { name: "background-repeat", desc: "no-repeat вимикає повторення, repeat-x/y — лише по одній осі" },
      { name: "background-attachment", desc: "fixed — фон не рухається при скролі сторінки (паралакс)" },
      { name: "background-clip / background-origin", desc: "від якого шару блоку (border/padding/content) рахується область фону" },
    ],
    example: `<div style="height:120px;background-image:url('https://picsum.photos/400/200');background-size:cover;background-position:center;border-radius:8px;display:flex;align-items:center;justify-content:center;">
  <span style="background:rgba(0,0,0,0.5);color:white;padding:8px 16px;border-radius:6px;">Текст поверх фону</span>
</div>`,
    pitfalls: [
      "Забутий background-size — зображення показується в реальному розмірі й може обрізатись некрасиво.",
      "background-repeat типово repeat — забутий no-repeat дублює зображення плиткою.",
      "Погана читабельність тексту поверх фото без напівпрозорої підкладки чи затемнення.",
    ],
    related: ["css-colors-gradients", "css-object-fit"],
  },
  "css-borders": {
    badge: "CSS",
    title: "border і border-radius",
    whatIsIt: "border малює лінію навколо елемента — товщину, стиль і колір можна задати одразу скороченням чи окремо для кожної сторони. border-radius заокруглює кути, значення 50% перетворює квадрат на коло.",
    useCases: ["рамка навколо картки чи поля вводу", "заокруглені кути кнопок і карток", "коло з квадратного div (border-radius: 50%)", "рамка лише знизу як розділювач"],
    syntax: `.card {\n  border: 1px solid #ccc;\n  border-radius: 8px;\n}`,
    attributes: [
      { name: "border-width / border-style / border-color", desc: "товщина, стиль лінії (solid, dashed, dotted...) і колір окремо" },
      { name: "border-top / -right / -bottom / -left", desc: "рамка лише з однієї сторони" },
      { name: "border-radius", desc: "заокруглення кутів; можна задати кожен кут окремо через border-*-radius" },
      { name: "border-image", desc: "використовує зображення замість суцільної лінії для рамки" },
      { name: "solid / dashed / dotted / double", desc: "найпоширеніші стилі лінії рамки" },
      { name: "groove / ridge / inset / outset", desc: "рамки з ефектом об'єму (рідше використовуються)" },
    ],
    example: `<div style="display:flex;gap:12px;flex-wrap:wrap;">
  <div style="width:60px;height:60px;border:2px solid #7c3aed;border-radius:8px;"></div>
  <div style="width:60px;height:60px;border:2px solid #0ea5e9;border-radius:50%;"></div>
  <div style="width:60px;height:60px;border-bottom:3px solid #ef4444;"></div>
  <div style="width:60px;height:60px;border:4px groove #999;"></div>
  <div style="width:60px;height:60px;border:4px ridge #999;"></div>
</div>`,
    pitfalls: [
      "border додає до реального розміру елемента, якщо не box-sizing: border-box.",
      "border-radius: 50% дає коло лише на квадратному елементі — на прямокутному вийде еліпс.",
      "Забутий border-color — за замовчуванням використовується поточний колір тексту (currentColor), не завжди очікувано.",
    ],
    related: ["css-box-model", "css-shadows"],
  },
  "css-shadows": {
    badge: "CSS",
    title: "box-shadow і text-shadow",
    whatIsIt: "box-shadow додає тінь навколо всього елемента-блоку, text-shadow — під текстом. Обидва задаються зсувом по X/Y, розмиттям, опціональним розширенням і кольором.",
    useCases: ["тінь під картками для ефекту підняття над сторінкою", "тінь при наведенні для інтерактивного відгуку", "контрастний текст поверх фото через text-shadow", "внутрішня тінь (inset) для вдавленого вигляду поля"],
    syntax: `.card {\n  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);\n}`,
    attributes: [
      { name: "offset-x / offset-y", desc: "зсув тіні по горизонталі й вертикалі" },
      { name: "blur-radius", desc: "розмиття країв тіні — більше значення, м'якіша тінь" },
      { name: "spread-radius", desc: "розширює чи звужує тінь відносно форми елемента" },
      { name: "color", desc: "колір тіні, зазвичай напівпрозорий чорний" },
      { name: "inset", desc: "робить тінь внутрішньою замість зовнішньої" },
    ],
    example: `<div style="display:flex;gap:16px;padding:10px;">
  <div style="width:80px;height:60px;background:white;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.2);"></div>
  <div style="width:80px;height:60px;background:#eee;border-radius:8px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.3);"></div>
</div>
<p style="color:white;background:#333;padding:10px;text-shadow:1px 1px 2px black;border-radius:6px;">Текст з тінню</p>`,
    pitfalls: [
      "Занадто темна чи непрозора тінь виглядає різко — краще низька непрозорість (0.1-0.25).",
      "Кілька важких box-shadow на багатьох елементах можуть сповільнити рендеринг при скролі/анімації.",
      "Забутий color — тінь використовує колір тексту елемента, що рідко буває бажаним.",
    ],
    related: ["css-borders", "css-colors-gradients"],
  },

  "css-text": {
    badge: "CSS",
    title: "Текстові властивості",
    whatIsIt: "Група властивостей, що керують виглядом тексту: шрифт, вага, міжрядковий інтервал, вирівнювання, перетворення регістру, оздоблення (підкреслення) і поведінка переносу довгих слів.",
    useCases: ["базове форматування абзаців і заголовків", "аккуратний перенос довгого тексту без виходу за межі контейнера", "капіталізація заголовків через text-transform"],
    syntax: `.text {\n  font-family: sans-serif;\n  font-size: 16px;\n  line-height: 1.5;\n  text-align: center;\n}`,
    attributes: [
      { name: "font-family / font-size / font-weight", desc: "гарнітура, розмір (100-900) і жирність шрифту" },
      { name: "font-style / font-variant", desc: "italic/oblique — курсив, small-caps — капітель (маленькі великі літери)" },
      { name: "line-height", desc: "висота рядка — впливає на міжрядковий інтервал і читабельність" },
      { name: "text-align", desc: "вирівнювання: left, center, right, justify" },
      { name: "letter-spacing / word-spacing", desc: "відстань між символами чи словами" },
      { name: "text-transform", desc: "uppercase, lowercase, capitalize — перетворення регістру" },
      { name: "text-decoration", desc: "підкреслення/закреслення тексту, з кольором і стилем лінії" },
      { name: "white-space / word-break / overflow-wrap", desc: "керують переносом рядків і довгих слів" },
    ],
    example: `<p style="font-family:sans-serif;line-height:1.6;text-align:center;letter-spacing:0.5px;">
  Приклад тексту з міжрядковим інтервалом 1.6 і невеликим letter-spacing.
</p>
<p style="text-transform:uppercase;text-decoration:underline wavy #7c3aed;">великі літери й хвиляста підкреслена лінія</p>`,
    pitfalls: [
      "Занизький line-height (менше 1.2) робить багаторядковий текст важким для читання.",
      "text-align: justify без hyphens: auto створює нерівні пробіли між словами.",
      "Довгий текст без word-break/overflow-wrap може вийти за межі вузького контейнера.",
    ],
    related: ["css-lists", "css-selectors"],
  },
  "css-lists": {
    badge: "CSS",
    title: "list-style",
    whatIsIt: "Група властивостей list-style-* керує зовнішнім виглядом маркерів списку <ul>/<ol> — тип маркера (кружечок, число, власне зображення), його позиція відносно тексту й повна заміна на власне зображення.",
    useCases: ["прибрати стандартні маркери для навігаційного меню", "власна нумерація списку кроків", "маркер-іконка замість стандартної крапки"],
    syntax: `ul {\n  list-style-type: square;\n  list-style-position: inside;\n}`,
    attributes: [
      { name: "list-style-type", desc: "тип маркера: disc, circle, square, decimal, lower-alpha, none..." },
      { name: "list-style-position", desc: "inside — маркер всередині блоку тексту, outside (типово) — зовні" },
      { name: "list-style-image", desc: "власне зображення замість стандартного маркера" },
      { name: "list-style", desc: "скорочення трьох властивостей одним рядком" },
    ],
    example: `<ul style="list-style-type:none;padding:0;">
  <li style="padding-left:20px;position:relative;margin-bottom:4px;">
    <span style="position:absolute;left:0;color:#7c3aed;">✓</span> Пункт зі своєю іконкою
  </li>
  <li style="padding-left:20px;position:relative;">
    <span style="position:absolute;left:0;color:#7c3aed;">✓</span> Другий пункт
  </li>
</ul>`,
    pitfalls: [
      "list-style: none прибирає маркери, але не padding-left — список все ще має зайвий відступ зліва.",
      "Забутий list-style-position — маркер може виходити за межі контейнера з overflow: hidden.",
    ],
    related: ["css-text"],
  },
  "css-object-fit": {
    badge: "CSS",
    title: "object-fit і object-position",
    whatIsIt: "object-fit керує тим, як зображення чи відео вписується в задані розміри свого блоку — обрізається, вписується повністю чи розтягується. object-position задає, яка частина медіа лишається видимою при обрізанні.",
    useCases: ["однакового розміру превʼю фото в галереї без спотворення пропорцій", "аватар-коло без розтягнутого обличчя", "відео на весь контейнер без чорних смуг"],
    syntax: `img {\n  width: 200px;\n  height: 200px;\n  object-fit: cover;\n}`,
    attributes: [
      { name: "cover", desc: "заповнює весь контейнер, обрізаючи зайве, зберігаючи пропорції" },
      { name: "contain", desc: "вписує зображення повністю, можуть лишитись порожні поля" },
      { name: "fill", desc: "розтягує зображення точно під розміри контейнера (спотворює пропорції)" },
      { name: "object-position", desc: "яка частина зображення лишається видимою при cover, напр. \"top\"" },
    ],
    example: `<div style="display:flex;gap:10px;">
  <img src="https://picsum.photos/300/150" style="width:100px;height:100px;object-fit:cover;border-radius:6px;" alt="cover">
  <img src="https://picsum.photos/300/150" style="width:100px;height:100px;object-fit:contain;background:#eee;border-radius:6px;" alt="contain">
</div>`,
    pitfalls: [
      "object-fit не працює без явно заданих width і height на елементі.",
      "fill спотворює пропорції зображення — рідко бажаний результат для фото.",
    ],
    related: ["css-background", "css-box-model"],
  },

  "css-variables": {
    badge: "CSS",
    title: "Custom properties (--змінні)",
    whatIsIt: "CSS-змінні (custom properties) дозволяють зберегти значення один раз і використовувати його в багатьох місцях через var(). Оголошуються з подвійним дефісом на початку, зазвичай на :root для глобального доступу, і можуть перевизначатись для будь-якого піддерева елементів.",
    useCases: ["єдина палітра кольорів проєкту, яку легко змінити в одному місці", "перемикання теми (світла/темна) через перевизначення змінних", "повторювані значення відступів чи розмірів шрифту"],
    syntax: `:root {\n  --main-color: #7c3aed;\n}\n.box { color: var(--main-color); }`,
    attributes: [
      { name: "--назва: значення", desc: "оголошення змінної — назва довільна, значення будь-яке CSS-значення" },
      { name: "var(--назва)", desc: "читає значення змінної" },
      { name: "var(--назва, запасне)", desc: "друге значення — запасне, якщо змінна не визначена" },
      { name: ":root", desc: "псевдоклас кореневого елемента, типове місце для глобальних змінних" },
    ],
    example: `<style>
  :root { --accent: #7c3aed; }
  .btn { background: var(--accent); color: white; padding: 8px 16px; border: none; border-radius: 6px; }
  .btn.alt { --accent: #0ea5e9; }
</style>
<button class="btn">Звичайна</button>
<button class="btn alt">Перевизначена змінна</button>`,
    pitfalls: [
      "CSS-змінні (на відміну від Sass-змінних) — це справжні runtime-значення, доступні й змінювані через JavaScript (element.style.setProperty).",
      "Змінна, оголошена всередині селектора, доступна лише в межах цього елемента й нащадків, не глобально.",
      "Друкарська помилка в назві змінної не викликає помилку CSS — просто властивість тихо не застосується.",
    ],
    related: ["css-calc-clamp", "css-at-rules"],
  },
  "css-calc-clamp": {
    badge: "CSS",
    title: "calc(), min(), max(), clamp()",
    whatIsIt: "Математичні CSS-функції дозволяють обчислювати значення прямо в стилях, комбінуючи різні одиниці виміру. calc() виконує арифметику, min()/max() обирають менше/більше з варіантів, а clamp() тримає значення в заданих межах — ідеально для адаптивних розмірів без медіа-запитів.",
    useCases: ["ширина колонки мінус фіксований відступ (calc(100% - 40px))", "адаптивний розмір шрифту без @media (clamp)", "відступ, що не менший і не більший заданих меж"],
    syntax: `.box {\n  width: calc(100% - 40px);\n  font-size: clamp(1rem, 2vw + 0.5rem, 2rem);\n}`,
    attributes: [
      { name: "calc(a + b)", desc: "виконує арифметику з різними одиницями, напр. calc(100% - 20px)" },
      { name: "min(a, b)", desc: "обирає менше з переданих значень" },
      { name: "max(a, b)", desc: "обирає більше з переданих значень" },
      { name: "clamp(min, preferred, max)", desc: "тримає значення в межах min-max, за замовчуванням — preferred" },
    ],
    example: `<div style="width:calc(100% - 40px);margin:0 auto;padding:10px;background:#f4f4f4;border-radius:6px;">
  <p style="font-size:clamp(14px, 4vw, 22px);">Цей текст масштабується плавно між 14px і 22px залежно від ширини екрана.</p>
</div>`,
    pitfalls: [
      "Пробіли навколо + і - в calc() обов'язкові (calc(100% - 10px), не calc(100%-10px)) — інакше правило зламається.",
      "clamp() з неправильним порядком аргументів (min > max) дає непередбачуваний результат.",
      "Забагато вкладених calc()/var() ускладнює читання й дебаг стилів.",
    ],
    related: ["css-units", "css-variables"],
  },
  "css-logical-properties": {
    badge: "CSS",
    title: "Логічні властивості (margin-inline, inset-block...)",
    whatIsIt: "Логічні властивості задають відступи й позицію відносно напрямку письма (inline — горизонтальний потік тексту, block — вертикальний), а не фіксованих сторін left/right/top/bottom. Це критично важливо для коректної роботи з мовами, де текст іде справа наліво (арабська, іврит).",
    useCases: ["сайт, що підтримує кілька мов з різним напрямком письма", "компоненти бібліотек, які мають однаково коректно виглядати в ltr і rtl", "сучасна заміна margin-left/right на margin-inline-start/end"],
    syntax: `.box {\n  margin-inline: 16px;\n  padding-block: 8px;\n}`,
    attributes: [
      { name: "margin-inline / padding-inline", desc: "відступи по горизонтальному напрямку письма (замість left/right)" },
      { name: "margin-block / padding-block", desc: "відступи по вертикальному напрямку письма (замість top/bottom)" },
      { name: "inset-inline-start / inset-inline-end", desc: "позиція відносно початку/кінця напрямку письма, а не фіксовано left/right" },
      { name: "border-inline / border-block", desc: "рамка по відповідному напрямку" },
    ],
    example: `<div dir="ltr" style="margin-inline:20px;padding:10px;background:#ede9fe;border-radius:6px;margin-bottom:8px;">dir="ltr": відступ зліва</div>
<div dir="rtl" style="margin-inline:20px;padding:10px;background:#dbeafe;border-radius:6px;">dir="rtl": той самий код, відступ автоматично справа</div>`,
    pitfalls: [
      "Змішування логічних (margin-inline) і фізичних (margin-left) властивостей для того самого відступу — можуть конфліктувати.",
      "Не всі старі браузери підтримують логічні властивості — перевіряй сумісність для критичних проєктів.",
    ],
    related: ["css-box-model", "css-position"],
  },

  "css-filter-backdrop": {
    badge: "CSS",
    title: "filter і backdrop-filter",
    whatIsIt: "filter застосовує графічні ефекти (розмиття, яскравість, відтінки сірого) до самого елемента й усього його вмісту. backdrop-filter натомість застосовує ефект до того, що знаходиться ПОЗАДУ елемента — класичний приклад: ефект матового скла (glassmorphism).",
    useCases: ["чорно-білий ефект для неактивних елементів", "розмитий фон під напівпрозорою панеллю навігації", "затемнення/освітлення зображення при наведенні", "тінь, що повторює форму зображення (drop-shadow)"],
    syntax: `.glass {\n  backdrop-filter: blur(10px);\n  background: rgba(255,255,255,0.2);\n}`,
    attributes: [
      { name: "blur(px)", desc: "розмиває вміст елемента" },
      { name: "brightness() / contrast()", desc: "змінюють яскравість чи контраст" },
      { name: "grayscale() / sepia() / invert()", desc: "чорно-білий, сепія, інверсія кольорів (0-100%)" },
      { name: "drop-shadow()", desc: "тінь, що повторює реальну форму елемента (не прямокутник, як box-shadow)" },
      { name: "backdrop-filter", desc: "той самий набір функцій, але для фону ПОЗАДУ елемента" },
    ],
    example: `<div style="position:relative;height:120px;background-image:url('https://picsum.photos/400/200');background-size:cover;border-radius:8px;overflow:hidden;">
  <div style="position:absolute;bottom:10px;left:10px;right:10px;padding:10px;background:rgba(255,255,255,0.2);backdrop-filter:blur(8px);border-radius:6px;color:white;font-size:14px;">
    Ефект матового скла (backdrop-filter: blur)
  </div>
</div>`,
    pitfalls: [
      "Плутанина filter і backdrop-filter — filter змінює сам елемент, backdrop-filter — те, що позаду нього.",
      "backdrop-filter вимагає, щоб фон елемента був напівпрозорим (rgba з альфа-каналом), інакше ефекту не видно.",
      "Багато фільтрів на великих елементах можуть знижувати продуктивність на слабких пристроях.",
    ],
    related: ["css-mask-clip", "css-shadows"],
  },
  "css-mask-clip": {
    badge: "CSS",
    title: "mask і clip-path",
    whatIsIt: "clip-path обрізає елемент за геометричною формою — колом, багатокутником чи довільним контуром, показуючи лише частину всередині фігури. mask робить подібне, але на основі прозорості/яскравості зображення-маски, а не простої геометрії.",
    useCases: ["зображення у формі шестикутника чи зірки замість прямокутника", "плавна поява елемента через анімацію clip-path", "складні форми вирізу з градієнтною маскою (плавне зникнення країв)"],
    syntax: `.hex {\n  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);\n}`,
    attributes: [
      { name: "circle() / ellipse()", desc: "обрізає елемент по колу чи еліпсу" },
      { name: "polygon()", desc: "обрізає за довільним багатокутником через список точок" },
      { name: "inset()", desc: "обрізає прямокутну область з відступами від країв" },
      { name: "mask-image", desc: "використовує зображення/градієнт як маску прозорості" },
    ],
    example: `<div style="display:flex;gap:16px;">
  <img src="https://picsum.photos/150/150" style="width:100px;height:100px;clip-path:circle(50%);" alt="circle">
  <img src="https://picsum.photos/150/150" style="width:100px;height:100px;clip-path:polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);" alt="star-ish">
</div>`,
    pitfalls: [
      "clip-path: circle(50%) на прямокутному елементі дає еліпс, а не коло — потрібен квадратний елемент.",
      "Анімація clip-path з різною кількістю точок у полігоні не інтерполюється плавно.",
      "Обрізаний clip-path вміст все ще займає своє місце в макеті — не впливає на layout сусідів.",
    ],
    related: ["css-filter-backdrop", "css-transform"],
  },
  "css-cursor-interaction": {
    badge: "CSS",
    title: "cursor, pointer-events, user-select",
    whatIsIt: "Група властивостей керує тим, як користувач взаємодіє з елементом мишею й вибором тексту: який курсор показувати, чи реагує елемент на кліки, чи можна виділити його текст.",
    useCases: ["курсор-рука на клікабельних елементах без <a>/<button>", "заблокований елемент, крізь який клік проходить до того, що під ним", "заборона виділення тексту на іконках чи кнопках"],
    syntax: `.disabled {\n  pointer-events: none;\n  cursor: not-allowed;\n}`,
    attributes: [
      { name: "cursor", desc: "pointer, grab, not-allowed, text, wait, crosshair — вигляд курсора при наведенні" },
      { name: "pointer-events: none", desc: "клік/наведення проходить крізь елемент до того, що під ним" },
      { name: "user-select", desc: "none забороняє виділення тексту елемента мишею" },
      { name: "touch-action", desc: "керує, які жести дотику браузер обробляє сам (для мобільних)" },
    ],
    example: `<div style="display:flex;gap:10px;">
  <button style="cursor:pointer;padding:8px 16px;border:1px solid #ccc;border-radius:6px;background:white;">pointer</button>
  <button style="cursor:not-allowed;opacity:0.5;padding:8px 16px;border:1px solid #ccc;border-radius:6px;background:#eee;" disabled>not-allowed</button>
  <span style="cursor:grab;padding:8px 16px;border:1px dashed #999;border-radius:6px;">grab</span>
</div>`,
    pitfalls: [
      "pointer-events: none також блокує події для скрінрідерів і клавіатурної навігації — використовуй обережно.",
      "cursor: pointer на елементі без реальної дії (не посилання/кнопка) вводить користувача в оману.",
    ],
    related: ["css-filter-backdrop", "css-pseudo-classes"],
  },

  "css-scroll": {
    badge: "CSS",
    title: "scroll-behavior і scroll-snap",
    whatIsIt: "scroll-behavior вмикає плавну анімовану прокрутку до якорів замість миттєвого стрибка. scroll-snap змушує прокрутку зупинятись рівно на заданих елементах — основа для каруселей і слайдерів без жодного JavaScript.",
    useCases: ["плавний перехід до розділу сторінки за посиланням-якорем", "карусель зображень, що клацає по одному слайду за раз", "горизонтальний список карток з чіткою зупинкою на кожній"],
    syntax: `html { scroll-behavior: smooth; }\n.carousel {\n  display: flex;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n}\n.slide { scroll-snap-align: start; }`,
    attributes: [
      { name: "scroll-behavior: smooth", desc: "плавна анімована прокрутка замість миттєвої (для якорів і JS scrollTo)" },
      { name: "scroll-snap-type", desc: "вмикає прилипання прокрутки по осі x чи y, mandatory — завжди зупиняється рівно" },
      { name: "scroll-snap-align", desc: "на дочірньому елементі — до якого краю він прилипає (start, center, end)" },
      { name: "scroll-margin / scroll-padding", desc: "компенсують фіксовану шапку при переході до якоря чи snap-елемента" },
    ],
    example: `<div style="display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:8px;padding:8px;border:1px solid #ccc;border-radius:6px;">
  <div style="min-width:80%;scroll-snap-align:start;background:#7c3aed;color:white;padding:20px;border-radius:6px;text-align:center;">Слайд 1</div>
  <div style="min-width:80%;scroll-snap-align:start;background:#0ea5e9;color:white;padding:20px;border-radius:6px;text-align:center;">Слайд 2</div>
  <div style="min-width:80%;scroll-snap-align:start;background:#10b981;color:white;padding:20px;border-radius:6px;text-align:center;">Слайд 3</div>
</div>
<p style="font-size:13px;color:#666;">Прокрути горизонтально — зупинка чітко на кожному слайді.</p>`,
    pitfalls: [
      "scroll-snap-type: mandatory може заважати звичайній вільній прокрутці, якщо застосований необдумано на весь layout.",
      "Забутий scroll-snap-align на дочірніх елементах — контейнер має snap-type, але нічого не прилипає.",
      "scroll-behavior: smooth ігнорується для prefers-reduced-motion — це навмисна поведінка для доступності.",
    ],
    related: ["css-flexbox", "css-position"],
  },
  "css-columns-table": {
    badge: "CSS",
    title: "columns і border-collapse",
    whatIsIt: "columns розбиває текстовий вміст на кілька газетних колонок автоматично, без ручного поділу на блоки. border-collapse керує тим, як з'єднуються рамки сусідніх комірок таблиці — окремо чи однією спільною лінією.",
    useCases: ["газетна верстка довгого тексту в кілька колонок", "акуратна таблиця з тонкими спільними рамками замість подвійних"],
    syntax: `.article { columns: 3; column-gap: 24px; }\ntable { border-collapse: collapse; }`,
    attributes: [
      { name: "columns / column-count / column-width", desc: "кількість колонок чи бажана ширина однієї колонки" },
      { name: "column-gap", desc: "проміжок між колонками" },
      { name: "column-rule", desc: "роздільна лінія між колонками, як border" },
      { name: "border-collapse", desc: "collapse об'єднує сусідні рамки комірок в одну лінію, separate — типова поведінка" },
      { name: "border-spacing", desc: "відступ між комірками при border-collapse: separate" },
    ],
    example: `<div style="columns:2;column-gap:20px;column-rule:1px solid #ccc;font-size:13px;">
  <p>Це довгий текст, який автоматично розбивається на дві колонки завдяки властивості columns, без жодних додаткових обгорток у HTML.</p>
</div>
<table style="border-collapse:collapse;margin-top:10px;font-size:13px;">
  <tr><td style="border:1px solid #ccc;padding:6px;">1</td><td style="border:1px solid #ccc;padding:6px;">2</td></tr>
  <tr><td style="border:1px solid #ccc;padding:6px;">3</td><td style="border:1px solid #ccc;padding:6px;">4</td></tr>
</table>`,
    pitfalls: [
      "columns погано контролює, ДЕ саме розіб'ється контент — для точного контролю потрібен break-inside: avoid на блоках.",
      "Забутий border-collapse: collapse — у таблиці подвійні рамки між сусідніми комірками.",
    ],
    related: ["css-box-model", "css-flexbox"],
  },
  "css-content-counters": {
    badge: "CSS",
    title: "content, counter-reset, counter-increment",
    whatIsIt: "CSS-лічильники автоматично нумерують елементи без ручного проставляння чисел у HTML — corisно для розділів документації, кастомних списків. content разом з attr() також дозволяє вставляти значення HTML-атрибута прямо в стилі.",
    useCases: ["автоматична нумерація розділів статті (1. 1.1. 1.2. 2. ...)", "власний стиль нумерації списку замість стандартного ol", "показ значення data-атрибута як підказки через content: attr()"],
    syntax: `body { counter-reset: section; }\nh2::before {\n  counter-increment: section;\n  content: counter(section) ". ";\n}`,
    attributes: [
      { name: "counter-reset", desc: "створює й обнуляє лічильник з заданим ім'ям" },
      { name: "counter-increment", desc: "збільшує лічильник на 1 кожного разу, коли зустрічається селектор" },
      { name: "counter(назва)", desc: "виводить поточне значення лічильника в content" },
      { name: "counters(назва, роздільник)", desc: "виводить вкладені лічильники з роздільником, напр. \"1.2.3\"" },
      { name: "attr(назва)", desc: "вставляє значення HTML-атрибута елемента прямо в content" },
    ],
    example: `<style>
  .list { counter-reset: item; list-style: none; padding: 0; }
  .list li { counter-increment: item; }
  .list li::before { content: counter(item) ") "; color: #7c3aed; font-weight: bold; }
</style>
<ul class="list">
  <li>Перший пункт</li>
  <li>Другий пункт</li>
  <li>Третій пункт</li>
</ul>`,
    pitfalls: [
      "counter-reset потрібен на спільному предку, інакше лічильник створюється заново для кожного елемента.",
      "Забутий counter-increment — числа не збільшуються, завжди показують стартове значення.",
    ],
    related: ["css-pseudo-elements", "css-lists"],
  },
  "css-misc-properties": {
    badge: "CSS",
    title: "outline, appearance, isolation, will-change",
    whatIsIt: "Збірка корисних, але рідше згадуваних властивостей: outline — контур навколо елемента, що не впливає на layout (типово для :focus), appearance прибирає нативний ОС-вигляд елементів форми, isolation ізолює stacking context, will-change підказує браузеру заздалегідь оптимізувати рендеринг.",
    useCases: ["видима рамка фокуса для клавіатурної навігації (outline)", "повна кастомізація вигляду select/checkbox (appearance: none)", "оптимізація продуктивності перед складною анімацією (will-change)"],
    syntax: `button:focus-visible {\n  outline: 2px solid #7c3aed;\n  outline-offset: 2px;\n}`,
    attributes: [
      { name: "outline / outline-offset", desc: "контур навколо елемента й відступ від його країв, не впливає на розмір блоку" },
      { name: "appearance: none", desc: "прибирає нативний вигляд ОС для select/checkbox/radio, відкриваючи повну кастомізацію через CSS" },
      { name: "isolation: isolate", desc: "створює новий stacking context, ізолюючи z-index/mix-blend-mode від решти сторінки" },
      { name: "will-change", desc: "підказує браузеру заздалегідь оптимізувати рендеринг властивості, що скоро анімується" },
      { name: "writing-mode", desc: "керує напрямком тексту — горизонтальний чи вертикальний (для East Asian мов)" },
    ],
    example: `<button style="padding:8px 16px;border:1px solid #ccc;border-radius:6px;outline:2px solid #7c3aed;outline-offset:3px;">Кнопка з видимим outline</button>
<select style="appearance:none;padding:8px 30px 8px 12px;border:1px solid #ccc;border-radius:6px;margin-left:10px;background:white;">
  <option>Кастомізований select</option>
</select>`,
    pitfalls: [
      "Видалення outline через outline: none без заміни на власний стиль фокуса — серйозна проблема доступності для клавіатурної навігації.",
      "appearance: none на select прибирає й стрілку — доведеться домальовувати власну через фон чи псевдоелемент.",
      "will-change на занадто багатьох елементах витрачає пам'ять браузера замість покращення продуктивності.",
    ],
    related: ["css-pseudo-classes", "css-cursor-interaction"],
  },

  "js-variables": {
    badge: "JS",
    title: "let, const, var",
    whatIsIt: "Три способи оголосити змінну в JavaScript. let і const мають блокову область видимості (доступні лише всередині { } де оголошені), var — застарілий спосіб із функціональною областю видимості, що часто призводить до несподіваних багів.",
    useCases: ["const для значень, що не будуть перепризначені (більшість випадків)", "let для лічильників циклів і значень, що змінюються", "var — уникати в новому коді, лишається лише в старій кодовій базі"],
    syntax: `let count = 0;\nconst PI = 3.14;\nvar old = "уникай";`,
    attributes: [
      { name: "const", desc: "не можна перепризначити змінну (сам об'єкт/масив усередині все ще можна змінювати)" },
      { name: "let", desc: "можна перепризначувати, блокова область видимості" },
      { name: "var", desc: "функціональна область видимості, підіймається (hoisting) з undefined — джерело багів" },
      { name: "TDZ (temporal dead zone)", desc: "let/const недоступні до рядка оголошення, на відміну від var" },
    ],
    example: `<p id="out"></p>
<script>
  const out = document.getElementById('out');
  const arr = [1, 2, 3];
  arr.push(4); // масив можна змінювати, навіть якщо оголошений const
  let count = 0;
  count += 1;
  out.textContent = 'arr: ' + arr.join(',') + ' | count: ' + count;
<\/script>`,
    pitfalls: [
      "const не робить значення незмінним — забороняє лише перепризначення самої змінної, вміст масиву/об'єкта можна міняти.",
      "var у циклі з setTimeout/замиканнями дає однакове значення для всіх ітерацій — let вирішує цю проблему.",
      "Використання змінної до let/const оголошення (навіть у тому ж блоці) — ReferenceError через temporal dead zone.",
    ],
    related: ["js-destructuring", "js-functions"],
  },
  "js-control-flow": {
    badge: "JS",
    title: "if/else, switch, цикли",
    whatIsIt: "Конструкції керування потоком виконання коду: умовні розгалуження (if/else, switch) і цикли (for, for...of, for...in, while, do...while) для повторення дій.",
    useCases: ["умовний рендер чи логіка залежно від стану", "перебір масиву чи об'єкта", "повторення дії, поки виконується умова"],
    syntax: `for (const item of arr) {\n  if (item > 5) continue;\n  console.log(item);\n}`,
    attributes: [
      { name: "if / else if / else", desc: "виконує блок залежно від умови" },
      { name: "switch / case / default", desc: "порівнює значення з кількома варіантами" },
      { name: "for", desc: "класичний цикл з лічильником: ініціалізація; умова; крок" },
      { name: "for...of", desc: "перебирає ЗНАЧЕННЯ ітерованого об'єкта (масив, рядок, Map, Set)" },
      { name: "for...in", desc: "перебирає перелічувані КЛЮЧІ об'єкта (для масивів краще for...of)" },
      { name: "while / do...while", desc: "виконують блок, поки умова істинна; do...while виконає хоча б раз" },
      { name: "break / continue", desc: "break зупиняє цикл повністю, continue пропускає поточну ітерацію" },
    ],
    example: `<ul id="list"></ul>
<script>
  const nums = [1, 2, 3, 4, 5];
  const list = document.getElementById('list');
  for (const n of nums) {
    if (n % 2 === 0) continue;
    const li = document.createElement('li');
    li.textContent = 'Непарне: ' + n;
    list.appendChild(li);
  }
<\/script>`,
    pitfalls: [
      "for...in для масивів перебирає індекси як рядки й може захопити успадковані властивості — для масивів завжди краще for...of.",
      "Забутий break у switch — виконання «провалюється» в наступний case (fall-through), часто ненавмисно.",
      "Нескінченний цикл через забуту зміну умови (напр. забутий i++ у while).",
    ],
    related: ["js-variables", "js-functions"],
  },
  "js-functions": {
    badge: "JS",
    title: "Функції та стрілкові функції",
    whatIsIt: "Функції — багаторазово використовувані блоки коду. function оголошує класичну функцію зі своїм this, стрілкова функція => коротша й не має власного this — бере його з навколишнього контексту.",
    useCases: ["виділення повторюваної логіки в одну назву", "callback-функції для методів масивів (map, filter)", "стрілкові функції для коротких однорядкових операцій"],
    syntax: `function sum(a, b) {\n  return a + b;\n}\nconst double = x => x * 2;`,
    attributes: [
      { name: "function name() {}", desc: "класичне оголошення функції, піднімається (можна викликати до оголошення)" },
      { name: "=> (стрілкова функція)", desc: "коротший синтаксис, немає власного this/arguments" },
      { name: "return", desc: "завершує функцію й повертає значення (без return — повертає undefined)" },
      { name: "параметри за замовчуванням", desc: "function f(x = 10) {} — значення, якщо аргумент не переданий" },
      { name: "async function", desc: "функція, що повертає Promise, дозволяє використовувати await усередині" },
    ],
    example: `<p id="out"></p>
<script>
  const greet = (name = 'Гостю') => \`Привіт, \${name}!\`;
  function double(x) { return x * 2; }
  document.getElementById('out').textContent = greet('Оля') + ' | double(5) = ' + double(5);
<\/script>`,
    pitfalls: [
      "Стрілкова функція як метод об'єкта втрачає доступ до this цього об'єкта — тоді потрібна звичайна function.",
      "Забутий return у функції — вона мовчки поверне undefined замість очікуваного значення.",
      "Плутанина arguments (доступний лише у звичайних function) з rest-параметрами (...args, працюють скрізь).",
    ],
    related: ["js-variables", "js-classes"],
  },
  "js-operators": {
    badge: "JS",
    title: "Оператори (порівняння, логічні, ??, ?.)",
    whatIsIt: "JavaScript має кілька категорій операторів: порівняння (== vs ===), логічні (&&, ||, !), оператор нульового злиття (??) для запасних значень, і опціональне звертання (?.) для безпечного доступу до вкладених властивостей.",
    useCases: ["строге порівняння значень без зведення типів (===)", "значення за замовчуванням лише для null/undefined (??)", "безпечне читання глибоко вкладеної властивості без помилки (?.)"],
    syntax: `const city = user?.address?.city ?? 'Невідомо';`,
    attributes: [
      { name: "== / ===", desc: "== порівнює зі зведенням типів, === строго без зведення — завжди обирай ===" },
      { name: "&& / || / !", desc: "логічне і / або / заперечення" },
      { name: "?? (nullish coalescing)", desc: "запасне значення лише якщо ліве null/undefined (0 і '' лишаються як є, на відміну від ||)" },
      { name: "?. (optional chaining)", desc: "безпечно звертається до вкладеної властивості, повертає undefined замість помилки" },
      { name: "?: (ternary)", desc: "скорочений if/else в одному виразі: умова ? так : ні" },
      { name: "... (spread/rest)", desc: "розгортає масив/об'єкт (spread) чи збирає аргументи в масив (rest)" },
    ],
    example: `<p id="out"></p>
<script>
  const user = { name: 'Оля', address: null };
  const city = user.address?.city ?? 'Місто не вказане';
  const age = 0;
  const shownAge = age ?? 18; // 0, бо ?? реагує лише на null/undefined
  document.getElementById('out').textContent = city + ' | вік: ' + shownAge;
<\/script>`,
    pitfalls: [
      "Використання || замість ?? для запасних значень — 0, '', false помилково замінюються запасним значенням.",
      "== замість === — несподівані результати зведення типів (напр. '' == 0 дає true).",
      "Забутий ?. перед зверненням до потенційно відсутньої вкладеної властивості — TypeError у рантаймі.",
    ],
    related: ["js-destructuring", "js-variables"],
  },
  "js-destructuring": {
    badge: "JS",
    title: "Деструктуризація { } та [ ]",
    whatIsIt: "Деструктуризація дозволяє витягти властивості об'єкта чи елементи масиву в окремі змінні одним рядком, замість звернення до кожної властивості окремо через крапку чи індекс.",
    useCases: ["витягнути кілька властивостей об'єкта відповіді API", "розпакувати параметри функції прямо в сигнатурі", "поміняти місцями значення двох змінних"],
    syntax: `const { name, age } = user;\nconst [first, second] = arr;`,
    attributes: [
      { name: "const { a, b } = obj", desc: "витягує властивості a і b з об'єкта obj у змінні з такими самими іменами" },
      { name: "const { a: newName } = obj", desc: "перейменовує змінну при деструктуризації" },
      { name: "const [a, b] = arr", desc: "витягує елементи масиву за позицією" },
      { name: "const { a = 10 } = obj", desc: "значення за замовчуванням, якщо властивості немає" },
      { name: "...rest", desc: "збирає решту властивостей/елементів в новий об'єкт/масив" },
    ],
    example: `<p id="out"></p>
<script>
  const user = { name: 'Оля', age: 25, city: 'Київ' };
  const { name, age, ...rest } = user;
  const [first, , third] = ['a', 'b', 'c'];
  document.getElementById('out').textContent =
    name + ', ' + age + ' | rest: ' + JSON.stringify(rest) + ' | third: ' + third;
<\/script>`,
    pitfalls: [
      "Деструктуризація властивості, якої немає в об'єкті, дає undefined, а не помилку — легко пропустити помилку в назві.",
      "Деструктуризація null/undefined напряму (const {a} = null) кидає TypeError.",
    ],
    related: ["js-operators", "js-arrays"],
  },

  "js-classes": {
    badge: "JS",
    title: "class, constructor, extends",
    whatIsIt: "class — синтаксичний цукор над прототипним наслідуванням JavaScript, зручний спосіб описати «шаблон» для створення однотипних об'єктів з даними (полями) і поведінкою (методами).",
    useCases: ["модель даних з поведінкою (напр. клас User з методами)", "наслідування спільної логіки між схожими сутностями", "інкапсуляція внутрішнього стану через приватні поля"],
    syntax: `class User {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return \`Привіт, \${this.name}\`;\n  }\n}`,
    attributes: [
      { name: "constructor", desc: "спеціальний метод, що викликається автоматично при new ClassName()" },
      { name: "extends / super", desc: "extends задає батьківський клас, super() викликає його конструктор" },
      { name: "static", desc: "метод/поле належить самому класу, а не окремому екземпляру" },
      { name: "get / set", desc: "створюють обчислювану властивість, що виглядає як звичайне поле" },
      { name: "#privateField", desc: "поле з #, доступне лише всередині самого класу" },
    ],
    example: `<p id="out"></p>
<script>
  class Animal {
    constructor(name) { this.name = name; }
    speak() { return this.name + ' видає звук'; }
  }
  class Dog extends Animal {
    speak() { return super.speak() + ' (гав!)'; }
  }
  const d = new Dog('Рекс');
  document.getElementById('out').textContent = d.speak();
<\/script>`,
    pitfalls: [
      "Забутий super() у конструкторі дочірнього класу — ReferenceError при спробі використати this.",
      "Стрілкові функції як методи класу поводяться інакше з this, ніж звичайні методи — плутанина при наслідуванні.",
      "class — це не «справжні» класи як у Java, а прототипне наслідування з іншим синтаксисом.",
    ],
    related: ["js-functions", "js-modules"],
  },
  "js-modules": {
    badge: "JS",
    title: "import / export",
    whatIsIt: "ES-модулі дозволяють розділити код на окремі файли й підключати потрібні частини одна в одну — export робить щось доступним ззовні файлу, import підключає це в іншому файлі.",
    useCases: ["розділення великого застосунку на логічні файли", "перевикористання функцій/компонентів між файлами", "підключення сторонніх бібліотек з npm"],
    syntax: `// utils.js\nexport function sum(a, b) { return a + b; }\n\n// main.js\nimport { sum } from './utils.js';`,
    attributes: [
      { name: "export", desc: "робить іменований експорт доступним для імпорту в інших файлах" },
      { name: "export default", desc: "один головний експорт файлу — імпортується без фігурних дужок і під будь-яким ім'ям" },
      { name: "import { a, b } from '...'", desc: "підключає конкретні іменовані експорти" },
      { name: "import * as ns from '...'", desc: "підключає всі експорти файлу як один об'єкт-простір імен" },
      { name: "import()", desc: "динамічний імпорт — повертає Promise, завантажує модуль лише коли потрібно" },
    ],
    example: `<p id="out">Модулі перевіряються під час збірки (Vite), у прикладі показано лише синтаксис:</p>
<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">// math.js
export const PI = 3.14;
export default function square(x) { return x * x; }

// main.js
import square, { PI } from './math.js';
console.log(square(4), PI); // 16 3.14</pre>`,
    pitfalls: [
      "Змішування CommonJS (require/module.exports, Node.js) з ES-модулями (import/export) в одному файлі — не поєднуються напряму.",
      "export default і export {} — різний синтаксис імпорту, легко переплутати фігурні дужки.",
      "Циклічні імпорти (файли, що імпортують один одного) можуть давати undefined замість очікуваного значення.",
    ],
    related: ["js-classes"],
  },
  "js-errors": {
    badge: "JS",
    title: "try/catch, throw, Error",
    whatIsIt: "Механізм обробки помилок: try виконує потенційно небезпечний код, catch ловить помилку, якщо вона сталась, finally виконується завжди. throw дозволяє самому згенерувати помилку.",
    useCases: ["обробка помилок мережевого запиту", "валідація вхідних даних з власними повідомленнями", "запобігання падінню всього застосунку через одну помилку"],
    syntax: `try {\n  riskyOperation();\n} catch (e) {\n  console.error(e.message);\n} finally {\n  cleanup();\n}`,
    attributes: [
      { name: "try / catch / finally", desc: "try — небезпечний код, catch — обробка помилки, finally — виконується завжди" },
      { name: "throw", desc: "генерує помилку, яку можна впіймати вище через try/catch" },
      { name: "Error / TypeError / RangeError", desc: "вбудовані класи помилок для різних ситуацій" },
      { name: "e.message / e.name", desc: "текст помилки й назва її типу всередині об'єкта помилки" },
    ],
    example: `<p id="out"></p>
<script>
  function divide(a, b) {
    if (b === 0) throw new Error('Ділення на нуль!');
    return a / b;
  }
  try {
    document.getElementById('out').textContent = divide(10, 0);
  } catch (e) {
    document.getElementById('out').textContent = 'Помилка: ' + e.message;
  }
<\/script>`,
    pitfalls: [
      "try/catch не ловить помилки в асинхронному коді без await (напр. усередині setTimeout чи неочікуваного Promise).",
      "Порожній catch (е) {} приховує реальну помилку — мінімум залоговуй її через console.error.",
      "throw довільного значення (не Error) втрачає stack trace — завжди throw new Error(...).",
    ],
    related: ["js-functions"],
  },

  "js-arrays": {
    badge: "JS",
    title: "Методи масивів",
    whatIsIt: "Масив — впорядкована колекція значень з багатим набором вбудованих методів: зміна вмісту (push, splice), трансформація (map, filter, reduce), пошук (find, includes) і сортування.",
    useCases: ["перетворення списку даних з API в потрібний формат (map)", "фільтрація елементів за умовою (filter)", "підрахунок суми чи згортання в одне значення (reduce)"],
    syntax: `const doubled = [1, 2, 3].map(x => x * 2);\nconst evens = [1, 2, 3, 4].filter(x => x % 2 === 0);`,
    attributes: [
      { name: "push() / pop() / shift() / unshift()", desc: "додають/видаляють елементи з кінця чи початку масиву" },
      { name: "map()", desc: "створює новий масив, перетворивши кожен елемент" },
      { name: "filter()", desc: "створює новий масив лише з елементів, що проходять умову" },
      { name: "reduce()", desc: "згортає весь масив в одне значення (суму, об'єкт тощо)" },
      { name: "find() / findIndex()", desc: "повертають перший елемент (чи індекс), що відповідає умові" },
      { name: "includes() / indexOf()", desc: "перевіряють наявність значення чи повертають його індекс" },
      { name: "sort() / reverse()", desc: "сортують чи розвертають масив НА МІСЦІ (змінюють оригінал)" },
      { name: "slice() / splice()", desc: "slice — копія частини без зміни оригіналу, splice — видаляє/вставляє, змінюючи оригінал" },
    ],
    example: `<p id="out"></p>
<script>
  const nums = [5, 12, 8, 3, 20];
  const doubled = nums.map(x => x * 2);
  const big = nums.filter(x => x > 10);
  const total = nums.reduce((sum, x) => sum + x, 0);
  document.getElementById('out').innerHTML =
    'подвоєні: ' + doubled.join(',') + '<br>більше 10: ' + big.join(',') + '<br>сума: ' + total;
<\/script>`,
    pitfalls: [
      "sort() без функції-компаратора сортує ЯК РЯДКИ навіть для чисел (напр. [10, 2, 1] стане [1, 10, 2]) — потрібен (a,b) => a-b.",
      "map()/filter() створюють НОВИЙ масив, forEach — ні; переплутати легко, якщо очікуєш результат від forEach.",
      "splice() змінює оригінальний масив на місці — легко випадково зламати дані, які використовуються деінде.",
    ],
    related: ["js-destructuring", "js-objects"],
  },
  "js-objects": {
    badge: "JS",
    title: "Методи об'єктів",
    whatIsIt: "Object.* — статичні методи для роботи з об'єктами: отримання ключів/значень, копіювання властивостей, заборона змін. Об'єкти — основна структура даних для пар ключ-значення в JS.",
    useCases: ["перебір усіх властивостей об'єкта", "об'єднання кількох об'єктів в один (напр. налаштувань)", "незмінна конфігурація через Object.freeze"],
    syntax: `const merged = Object.assign({}, defaults, options);\nObject.keys(obj).forEach(key => console.log(key));`,
    attributes: [
      { name: "Object.keys() / Object.values()", desc: "повертають масив ключів чи значень об'єкта" },
      { name: "Object.entries()", desc: "повертає масив пар [ключ, значення] — зручно для перебору через for...of" },
      { name: "Object.assign()", desc: "копіює властивості з одного чи кількох об'єктів у цільовий" },
      { name: "Object.freeze()", desc: "забороняє будь-які зміни об'єкта (глибина — лише перший рівень)" },
      { name: "Object.fromEntries()", desc: "створює об'єкт зі списку пар [ключ, значення] — зворотне до entries()" },
      { name: "spread { ...obj }", desc: "розгортає властивості об'єкта — зручний спосіб копіювати чи об'єднувати" },
    ],
    example: `<p id="out"></p>
<script>
  const user = { name: 'Оля', age: 25 };
  const updated = { ...user, age: 26, city: 'Київ' };
  const entries = Object.entries(updated).map(([k, v]) => k + '=' + v).join(', ');
  document.getElementById('out').textContent = entries;
<\/script>`,
    pitfalls: [
      "Object.assign()/spread роблять ПОВЕРХНЕВУ копію — вкладені об'єкти все ще спільні між оригіналом і копією.",
      "Object.freeze() забороняє зміни лише на першому рівні — вкладені об'єкти всередині можна змінювати.",
      "Порядок властивостей у Object.keys() для числових ключів не завжди збігається з порядком додавання.",
    ],
    related: ["js-arrays", "js-destructuring"],
  },
  "js-strings": {
    badge: "JS",
    title: "Методи рядків і шаблонні літерали",
    whatIsIt: "Рядки в JavaScript незмінні (immutable) — усі методи повертають НОВИЙ рядок, не змінюючи оригінал. Шаблонні літерали в зворотних лапках дозволяють вставляти змінні прямо в текст через ${}.",
    useCases: ["форматування тексту з вставленими змінними (template literals)", "обробка користувацького вводу (trim, toLowerCase)", "розбиття рядка на частини чи пошук підрядка"],
    syntax: `const msg = \`Привіт, \${name}! У тебе \${count} повідомлень.\`;`,
    attributes: [
      { name: "Template literal (у зворотних лапках)", desc: "шаблонний рядок з ${вираз} усередині — вставляє результат виразу прямо в текст" },
      { name: "split() / join()", desc: "розбиває рядок на масив за роздільником / об'єднує масив у рядок" },
      { name: "trim()", desc: "прибирає пробіли з обох країв рядка" },
      { name: "includes() / startsWith() / endsWith()", desc: "перевіряють наявність підрядка чи початок/кінець рядка" },
      { name: "replace() / replaceAll()", desc: "замінюють перше (чи з /g) або всі входження підрядка" },
      { name: "slice() / substring()", desc: "вирізають частину рядка за індексами" },
      { name: "toUpperCase() / toLowerCase()", desc: "змінюють регістр усього рядка" },
      { name: "padStart() / padEnd()", desc: "доповнюють рядок символами до потрібної довжини" },
    ],
    example: `<p id="out"></p>
<script>
  const name = 'оля';
  const formatted = name.charAt(0).toUpperCase() + name.slice(1);
  const greeting = \`Привіт, \${formatted}! Сьогодні \${new Date().getDate()} число.\`;
  document.getElementById('out').textContent = greeting;
<\/script>`,
    pitfalls: [
      "Методи рядків НЕ змінюють оригінал (рядки незмінні) — результат треба зберегти в змінну, str.trim() саму str не змінить.",
      "replace() без прапорця /g замінює лише ПЕРШЕ входження — для всіх потрібен replaceAll() чи regex з /g.",
      "Порівняння рядків з різним регістром (===) завжди false — спочатку привести до одного регістру.",
    ],
    related: ["js-arrays", "js-regex"],
  },

  "js-numbers-math": {
    badge: "JS",
    title: "Number і Math",
    whatIsIt: "Number.* методи перевіряють і форматують числа, Math.* — вбудований об'єкт з математичними функціями: округлення, випадкові числа, тригонометрія, корінь і степінь.",
    useCases: ["округлення ціни до 2 знаків після коми", "випадкове число для гри чи випадкового вибору елемента", "перевірка, чи введене значення дійсно число"],
    syntax: `Math.round(4.5); // 5\nNumber.isInteger(5); // true\n(3.14159).toFixed(2); // "3.14"`,
    attributes: [
      { name: "Math.round() / floor() / ceil()", desc: "округлення: за правилами, завжди вниз, завжди вгору" },
      { name: "Math.max() / Math.min()", desc: "найбільше/найменше з переданих чисел" },
      { name: "Math.random()", desc: "випадкове число від 0 (включно) до 1 (виключно)" },
      { name: "Math.abs() / Math.pow() / Math.sqrt()", desc: "модуль, степінь, квадратний корінь" },
      { name: "Number.isInteger() / Number.isNaN()", desc: "надійні перевірки типу числа (краще за глобальний isNaN)" },
      { name: "parseInt() / parseFloat()", desc: "перетворюють рядок на число, ігноруючи текст після числа" },
      { name: "toFixed()", desc: "округлює до N знаків після коми, повертає РЯДОК" },
    ],
    example: `<p id="out"></p>
<script>
  const price = 19.999;
  const rounded = price.toFixed(2);
  const randomItem = Math.floor(Math.random() * 3); // 0, 1 або 2
  document.getElementById('out').textContent =
    'Ціна: $' + rounded + ' | Випадковий індекс: ' + randomItem;
<\/script>`,
    pitfalls: [
      "0.1 + 0.2 !== 0.3 через особливості представлення дробових чисел у пам'яті — для грошей краще працювати в копійках (цілих числах).",
      "toFixed() повертає РЯДОК, а не число — '5.00' + 1 дасть '5.001' замість очікуваного додавання.",
      "parseInt('08') без другого аргументу (системи числення) інколи давав несподівані результати в старих рушіях — краще завжди parseInt(x, 10).",
    ],
    related: ["js-strings"],
  },
  "js-dates": {
    badge: "JS",
    title: "Date",
    whatIsIt: "Вбудований об'єкт Date для роботи з датою й часом — створення, читання окремих частин (рік, місяць, день), обчислення різниці, форматування для показу користувачу.",
    useCases: ["показати поточну дату чи час на сторінці", "обчислити кількість днів між двома датами", "форматувати дату у зручний для читання вигляд"],
    syntax: `const now = new Date();\nconst formatted = now.toLocaleDateString('uk-UA');`,
    attributes: [
      { name: "new Date()", desc: "створює об'єкт поточної дати/часу; можна передати рядок чи числа для конкретної дати" },
      { name: "Date.now()", desc: "повертає поточний час у мілісекундах з 1 січня 1970 (timestamp), як число" },
      { name: "getFullYear() / getMonth() / getDate()", desc: "рік, місяць (0-11!) і число місяця" },
      { name: "getHours() / getMinutes() / getSeconds()", desc: "години, хвилини, секунди" },
      { name: "toLocaleDateString() / toLocaleTimeString()", desc: "форматують дату/час відповідно до локалі (напр. 'uk-UA')" },
      { name: "getTime()", desc: "повертає timestamp у мілісекундах — зручно для обчислення різниці між датами" },
    ],
    example: `<p id="out"></p>
<script>
  const now = new Date();
  const birthday = new Date('2000-01-01');
  const daysDiff = Math.floor((now - birthday) / (1000 * 60 * 60 * 24));
  document.getElementById('out').textContent =
    'Сьогодні: ' + now.toLocaleDateString('uk-UA') + ' | Днів з 2000 року: ' + daysDiff;
<\/script>`,
    pitfalls: [
      "getMonth() повертає місяць від 0 (січень) до 11 (грудень) — часта помилка «off by one» при показі місяця.",
      "Віднімання двох Date напряму (date2 - date1) дає різницю в мілісекундах, а не в зручних одиницях — треба ділити.",
      "new Date('рядок') залежить від формату рядка — надійніше передавати ISO-формат 'YYYY-MM-DD'.",
    ],
    related: ["js-numbers-math"],
  },
  "js-json": {
    badge: "JS",
    title: "JSON.parse() і JSON.stringify()",
    whatIsIt: "JSON (JavaScript Object Notation) — текстовий формат обміну даними. stringify() перетворює JS-об'єкт/масив на JSON-рядок (для відправки на сервер чи збереження), parse() робить зворотне — перетворює JSON-рядок назад на об'єкт.",
    useCases: ["відправка даних форми на сервер через fetch", "збереження об'єкта в localStorage (яке зберігає лише рядки)", "читання відповіді API у форматі JSON"],
    syntax: `const json = JSON.stringify(user);\nconst obj = JSON.parse(json);`,
    attributes: [
      { name: "JSON.stringify(value)", desc: "перетворює об'єкт/масив на JSON-рядок" },
      { name: "JSON.stringify(value, null, 2)", desc: "третій аргумент — відступ для читабельного форматування" },
      { name: "JSON.parse(text)", desc: "розбирає JSON-рядок назад в об'єкт/масив JavaScript" },
    ],
    example: `<pre id="out" style="font-size:13px;"></pre>
<script>
  const user = { name: 'Оля', age: 25, hobbies: ['код', 'книги'] };
  const json = JSON.stringify(user, null, 2);
  const parsed = JSON.parse(json);
  document.getElementById('out').textContent = json + '\\n\\nparsed.name = ' + parsed.name;
<\/script>`,
    pitfalls: [
      "JSON.stringify() пропускає функції, undefined і Symbol — вони просто зникають з результату.",
      "JSON.parse() кидає SyntaxError на невалідному JSON — обгортай у try/catch при розборі зовнішніх даних.",
      "Дати перетворюються stringify() на рядок, а parse() НЕ перетворює їх назад на Date автоматично.",
    ],
    related: ["js-objects", "js-fetch"],
  },

  "js-dom-select": {
    badge: "JS",
    title: "Пошук елементів у DOM",
    whatIsIt: "Методи document для знаходження HTML-елементів на сторінці, щоб потім читати чи змінювати їх через JavaScript. querySelector/querySelectorAll — найгнучкіші, приймають будь-який CSS-селектор.",
    useCases: ["знайти елемент за id для зміни його вмісту", "знайти всі елементи певного класу для навішування обробників", "перевірити, чи елемент відповідає певному селектору"],
    syntax: `const el = document.querySelector('.card');\nconst all = document.querySelectorAll('.item');`,
    attributes: [
      { name: "getElementById()", desc: "знаходить один елемент за id (без #), найшвидший спосіб" },
      { name: "querySelector()", desc: "знаходить перший елемент, що відповідає будь-якому CSS-селектору" },
      { name: "querySelectorAll()", desc: "знаходить УСІ елементи за селектором, повертає NodeList" },
      { name: "getElementsByClassName()", desc: "застаріліший спосіб, повертає «живу» HTMLCollection за класом" },
      { name: "closest()", desc: "шукає найближчого предка (чи сам елемент), що відповідає селектору" },
    ],
    example: `<div class="card">
  <p>Картка товару</p>
</div>
<button id="btn">Знайти й підсвітити</button>
<script>
  document.getElementById('btn').onclick = () => {
    const card = document.querySelector('.card');
    card.style.background = '#fef08a';
  };
<\/script>`,
    pitfalls: [
      "querySelectorAll() повертає СТАТИЧНИЙ NodeList — не оновлюється автоматично, якщо DOM змінюється після виклику.",
      "querySelector() повертає лише ПЕРШИЙ елемент, навіть якщо селектор відповідає кільком — для всіх потрібен querySelectorAll.",
      "Виклик querySelector до того, як елемент з'явився в DOM (напр. скрипт у <head> без defer) — поверне null.",
    ],
    related: ["js-dom-manipulate", "js-events"],
  },
  "js-dom-manipulate": {
    badge: "JS",
    title: "Зміна DOM (створення, вміст, класи)",
    whatIsIt: "Набір методів для програмної зміни сторінки: створення нових елементів, зміна тексту/HTML, керування CSS-класами, вставка й видалення елементів з дерева документа.",
    useCases: ["динамічно додати новий елемент у список", "перемкнути CSS-клас для показу/приховування блоку", "оновити текст лічильника чи статусу"],
    syntax: `const li = document.createElement('li');\nli.textContent = 'Новий пункт';\nlist.appendChild(li);`,
    attributes: [
      { name: "createElement()", desc: "створює новий DOM-елемент, який ще не вставлений на сторінку" },
      { name: "textContent / innerHTML", desc: "textContent — чистий текст (безпечно), innerHTML — парсить рядок як HTML" },
      { name: "appendChild() / append() / prepend()", desc: "вставляють елемент у кінець чи на початок списку дітей" },
      { name: "remove()", desc: "видаляє елемент з DOM" },
      { name: "classList.add() / .remove() / .toggle()", desc: "додають, видаляють чи перемикають CSS-клас" },
      { name: "setAttribute() / getAttribute()", desc: "задають чи читають будь-який HTML-атрибут" },
    ],
    example: `<button id="add">Додати пункт</button>
<ul id="list"></ul>
<script>
  let count = 0;
  document.getElementById('add').onclick = () => {
    count++;
    const li = document.createElement('li');
    li.textContent = 'Пункт ' + count;
    li.classList.add('item');
    document.getElementById('list').appendChild(li);
  };
<\/script>`,
    pitfalls: [
      "innerHTML з користувацьким вводом без екранування — вразливість XSS; для тексту завжди textContent.",
      "Створення елементів у циклі без DocumentFragment — кожен appendChild викликає перемальовування сторінки, повільно для великих списків.",
      "classList.toggle() без другого аргументу перемикає стан — якщо потрібно точно «додати», краще classList.add().",
    ],
    related: ["js-dom-select", "js-events"],
  },

  "js-events": {
    badge: "JS",
    title: "addEventListener і об'єкт події",
    whatIsIt: "Події — спосіб реагувати на дії користувача (клік, введення, наведення) чи браузера (завантаження сторінки). addEventListener підписує функцію-обробник, яка отримує об'єкт події з деталями того, що сталось.",
    useCases: ["реакція на клік по кнопці", "валідація поля форми при кожному введенні", "закриття модального вікна по кліку поза ним"],
    syntax: `button.addEventListener('click', (e) => {\n  console.log('Клікнули по', e.target);\n});`,
    attributes: [
      { name: "addEventListener(type, fn)", desc: "підписує функцію на подію вказаного типу" },
      { name: "removeEventListener(type, fn)", desc: "відписує обробник (потрібне те саме посилання на функцію)" },
      { name: "click / input / change / submit", desc: "найпоширеніші події: клік, зміна поля, втрата фокусу з новим значенням, відправка форми" },
      { name: "keydown / keyup", desc: "натискання й відпускання клавіші клавіатури" },
      { name: "e.target", desc: "елемент, на якому подія фактично трапилась" },
      { name: "e.preventDefault()", desc: "скасовує типову дію браузера (напр. перезавантаження при submit форми)" },
      { name: "e.stopPropagation()", desc: "зупиняє спливання події до батьківських елементів" },
    ],
    example: `<form id="form" style="display:flex;gap:8px;">
  <input id="name" placeholder="Ім'я" style="padding:6px;border:1px solid #ccc;border-radius:6px;">
  <button type="submit">Надіслати</button>
</form>
<p id="out"></p>
<script>
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    document.getElementById('out').textContent = 'Привіт, ' + (name || 'незнайомцю') + '!';
  });
<\/script>`,
    pitfalls: [
      "Забутий e.preventDefault() у обробнику submit — сторінка перезавантажується, JS-логіка не встигає спрацювати.",
      "Анонімна стрілкова функція в addEventListener не можна потім прибрати через removeEventListener — потрібне іменоване посилання.",
      "Навішування обробника на кожен елемент списку замість одного на батька (делегування подій) — гірше для продуктивності на великих списках.",
    ],
    related: ["js-dom-select", "js-dom-manipulate"],
  },

  "js-promises": {
    badge: "JS",
    title: "Promise",
    whatIsIt: "Promise представляє результат асинхронної операції, яка ще не завершилась — успішно (resolved) чи з помилкою (rejected). Дозволяє писати асинхронний код через .then()/.catch() замість вкладених callback-функцій.",
    useCases: ["обгортка над асинхронною операцією (напр. таймер, запит)", "виконання кількох незалежних асинхронних операцій паралельно", "послідовний ланцюжок залежних асинхронних кроків"],
    syntax: `fetch(url)\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`,
    attributes: [
      { name: "new Promise((resolve, reject) => {})", desc: "створює проміс вручну — resolve() для успіху, reject() для помилки" },
      { name: "then()", desc: "викликається, коли проміс успішно виконався, отримує результат" },
      { name: "catch()", desc: "викликається при помилці/reject у будь-якому місці ланцюжка" },
      { name: "finally()", desc: "виконується завжди, незалежно від успіху чи помилки" },
      { name: "Promise.all()", desc: "чекає завершення ВСІХ промісів, падає якщо хоч один відхилений" },
      { name: "Promise.race()", desc: "повертає результат НАЙШВИДШОГО з промісів" },
    ],
    example: `<p id="out">Завантаження...</p>
<script>
  function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
  }
  delay(1000, 'Готово!')
    .then(result => { document.getElementById('out').textContent = result; })
    .catch(err => { document.getElementById('out').textContent = 'Помилка: ' + err; });
<\/script>`,
    pitfalls: [
      "Забутий .catch() — помилка проміса «губиться» мовчки (unhandled promise rejection).",
      "Промісний ланцюжок без return усередині .then() ламає послідовність — наступний .then() отримає undefined замість результату.",
      "Promise.all() падає одразу, щойно ОДИН проміс відхилений — навіть якщо решта успішні; для стійкості до часткових помилок краще allSettled().",
    ],
    related: ["js-async-await", "js-fetch"],
  },
  "js-async-await": {
    badge: "JS",
    title: "async / await",
    whatIsIt: "Синтаксичний цукор над Promise — дозволяє писати асинхронний код так, ніби він синхронний, без ланцюжків .then(). async позначає функцію, що завжди повертає Promise; await призупиняє виконання до вирішення проміса.",
    useCases: ["послідовні асинхронні кроки без вкладених .then()", "обробка помилок через звичний try/catch замість .catch()", "паралельне виконання кількох запитів через Promise.all з await"],
    syntax: `async function loadUser() {\n  const res = await fetch('/api/user');\n  const data = await res.json();\n  return data;\n}`,
    attributes: [
      { name: "async function", desc: "позначає функцію як асинхронну — вона завжди повертає Promise" },
      { name: "await", desc: "призупиняє виконання функції, поки Promise не вирішиться; доступний лише всередині async-функції" },
      { name: "try / catch з await", desc: "ловить помилки await так само, як звичайні синхронні винятки" },
    ],
    example: `<p id="out">Завантаження...</p>
<script>
  function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
  }
  async function run() {
    try {
      const result = await delay(1000, 'Дані завантажено!');
      document.getElementById('out').textContent = result;
    } catch (e) {
      document.getElementById('out').textContent = 'Помилка: ' + e.message;
    }
  }
  run();
<\/script>`,
    pitfalls: [
      "await поза async-функцією — SyntaxError (крім top-level await у сучасних ES-модулях).",
      "Послідовні await для незалежних операцій виконуються по черзі, а не паралельно — для паралельності потрібен Promise.all з await.",
      "Забутий await перед асинхронним викликом — функція повертає Promise замість реального значення.",
    ],
    related: ["js-promises", "js-fetch"],
  },
  "js-fetch": {
    badge: "JS",
    title: "fetch()",
    whatIsIt: "Вбудована функція для виконання HTTP-запитів з браузера — заміна старому XMLHttpRequest. Повертає Promise з об'єктом Response, з якого потім асинхронно читається тіло (JSON, текст тощо).",
    useCases: ["завантажити дані з API при завантаженні сторінки", "відправити дані форми на сервер (POST)", "завантажити й показати список товарів"],
    syntax: `const res = await fetch('/api/users');\nconst users = await res.json();`,
    attributes: [
      { name: "fetch(url)", desc: "виконує GET-запит за замовчуванням, повертає Promise<Response>" },
      { name: "fetch(url, { method, headers, body })", desc: "другий аргумент задає метод, заголовки й тіло запиту" },
      { name: "response.ok / response.status", desc: "ok — true для статусів 200-299, status — числовий код відповіді" },
      { name: "response.json() / response.text()", desc: "асинхронно читають тіло відповіді як JSON чи текст" },
    ],
    example: `<button id="load">Завантажити дані</button>
<pre id="out" style="font-size:12px;"></pre>
<script>
  document.getElementById('load').onclick = async () => {
    document.getElementById('out').textContent = 'Завантаження...';
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const data = await res.json();
      document.getElementById('out').textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      document.getElementById('out').textContent = 'Помилка мережі: ' + e.message;
    }
  };
<\/script>`,
    pitfalls: [
      "fetch() НЕ кидає помилку на статуси 404/500 — лише на справжні мережеві збої; статус треба перевіряти через response.ok самостійно.",
      "Забутий await перед .json() — отримаєш Promise замість реальних даних.",
      "POST-запит без Content-Type: application/json у headers — сервер може не розпізнати JSON у тілі.",
    ],
    related: ["js-promises", "js-async-await", "js-json"],
  },
  "js-timers": {
    badge: "JS",
    title: "setTimeout, setInterval, requestAnimationFrame",
    whatIsIt: "Функції для запланованого виконання коду: setTimeout — один раз через заданий час, setInterval — повторно через рівні проміжки, requestAnimationFrame — синхронізовано з частотою оновлення екрана, ідеально для плавних анімацій.",
    useCases: ["затримка перед виконанням дії", "оновлення лічильника чи годинника щосекунди", "плавна JS-анімація без «розривів» кадрів"],
    syntax: `const id = setTimeout(() => console.log('Привіт'), 1000);\nclearTimeout(id);`,
    attributes: [
      { name: "setTimeout(fn, ms)", desc: "виконує fn один раз через ms мілісекунд, повертає id для скасування" },
      { name: "clearTimeout(id)", desc: "скасовує заплановане setTimeout виконання" },
      { name: "setInterval(fn, ms)", desc: "повторно виконує fn кожні ms мілісекунд, поки не зупинено" },
      { name: "clearInterval(id)", desc: "зупиняє повторення setInterval" },
      { name: "requestAnimationFrame(fn)", desc: "плавно синхронізує виконання з частотою кадрів браузера — краще за setInterval для анімацій" },
    ],
    example: `<p id="clock">00:00</p>
<script>
  let seconds = 0;
  const clockEl = document.getElementById('clock');
  const id = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    clockEl.textContent = m + ':' + s;
    if (seconds >= 5) clearInterval(id);
  }, 1000);
<\/script>`,
    pitfalls: [
      "Забутий clearInterval() — таймер продовжує працювати навіть після того, як елемент чи компонент видалено (витік пам'яті).",
      "setTimeout(fn, 0) не виконується миттєво — стає в чергу після поточного синхронного коду й мікрозадач.",
      "Анімації через setInterval сіпаються на слабких пристроях — для плавності краще requestAnimationFrame.",
    ],
    related: ["js-promises"],
  },

  "js-sets-maps": {
    badge: "JS",
    title: "Set і Map",
    whatIsIt: "Set — колекція УНІКАЛЬНИХ значень (дублікати автоматично ігноруються). Map — колекція пар ключ-значення, де ключем може бути будь-який тип (на відміну від звичайного об'єкта, де ключі завжди рядки).",
    useCases: ["видалення дублікатів зі списку (через Set)", "лічильник входжень чи кеш з довільними ключами (через Map)", "зберігання додаткових даних, прив'язаних до DOM-елементів чи об'єктів"],
    syntax: `const unique = new Set([1, 2, 2, 3]);\nconst map = new Map();\nmap.set('key', 'value');`,
    attributes: [
      { name: "new Set(iterable)", desc: "створює множину, автоматично прибираючи дублікати" },
      { name: "add() / has() / delete()", desc: "додають значення, перевіряють наявність, видаляють з Set" },
      { name: "new Map(entries)", desc: "створює колекцію пар ключ-значення з будь-яким типом ключа" },
      { name: "set() / get() / has() / delete()", desc: "записують, читають, перевіряють, видаляють пару в Map" },
      { name: "size", desc: "кількість елементів (властивість, не метод — без дужок)" },
      { name: "[...set] / [...map]", desc: "spread перетворює Set/Map назад у масив для роботи зі звичними методами" },
    ],
    example: `<p id="out"></p>
<script>
  const nums = [1, 2, 2, 3, 3, 3];
  const unique = [...new Set(nums)];

  const inventory = new Map();
  inventory.set('яблука', 10);
  inventory.set('банани', 5);

  document.getElementById('out').innerHTML =
    'Унікальні: ' + unique.join(',') + '<br>Яблук: ' + inventory.get('яблука');
<\/script>`,
    pitfalls: [
      "Set.size і Map.size — це ВЛАСТИВОСТІ, не методи; size() з дужками дасть помилку.",
      "Об'єкти в Set порівнюються за посиланням, не за вмістом — два різні об'єкти з однаковими полями вважаються різними.",
      "JSON.stringify() не працює напряму з Map/Set — спершу потрібно перетворити на масив чи об'єкт.",
    ],
    related: ["js-arrays", "js-objects"],
  },
  "js-iterators-generators": {
    badge: "JS",
    title: "Ітератори й генератори (function*, yield)",
    whatIsIt: "Протокол ітератора робить об'єкт сумісним з for...of і spread. Генератори — спеціальні функції (function*), що можуть призупиняти виконання через yield і повертати значення одне за одним, замість обчислення всіх одразу.",
    useCases: ["власна логіка перебору для нестандартної структури даних", "генерація потенційно нескінченної послідовності (напр. чисел Фібоначчі) без обчислення всієї одразу", "лінива обробка великих наборів даних по одному елементу"],
    syntax: `function* range(start, end) {\n  for (let i = start; i <= end; i++) yield i;\n}\nfor (const n of range(1, 3)) console.log(n);`,
    attributes: [
      { name: "function* name() {}", desc: "оголошує функцію-генератор" },
      { name: "yield значення", desc: "призупиняє виконання й повертає значення викликаючому коду" },
      { name: "Symbol.iterator", desc: "спеціальний метод, що робить об'єкт сумісним з for...of" },
      { name: "generator.next()", desc: "продовжує виконання генератора до наступного yield, повертає { value, done }" },
    ],
    example: `<p id="out"></p>
<script>
  function* countTo(n) {
    for (let i = 1; i <= n; i++) yield i;
  }
  const results = [];
  for (const num of countTo(5)) {
    results.push(num);
  }
  document.getElementById('out').textContent = 'Згенеровано: ' + results.join(', ');
<\/script>`,
    pitfalls: [
      "Виклик функції-генератора не виконує її тіло одразу — повертає об'єкт-ітератор, код виконується лише при переборі (for...of чи .next()).",
      "Генератор можна перебрати лише ОДИН раз — після завершення потрібно створити новий виклик функції.",
    ],
    related: ["js-arrays"],
  },
  "js-proxy-reflect": {
    badge: "JS",
    title: "Proxy і Reflect",
    whatIsIt: "Proxy дозволяє перехопити й перевизначити базові операції над об'єктом — читання, запис, виклик методу, перевірку властивості. Reflect надає ті самі базові операції у вигляді звичайних функцій — часто використовується всередині Proxy-обробників.",
    useCases: ["логування чи валідація при зверненні до властивостей об'єкта", "реактивність (напр. як влаштований Vue 3 «під капотом»)", "об'єкти зі значенням за замовчуванням для відсутніх ключів"],
    syntax: `const proxy = new Proxy(target, {\n  get(obj, prop) {\n    console.log('Читання:', prop);\n    return obj[prop];\n  }\n});`,
    attributes: [
      { name: "new Proxy(target, handler)", desc: "створює обгортку над об'єктом target з перехопленими операціями через handler" },
      { name: "get(obj, prop)", desc: "перехоплює читання властивості obj[prop]" },
      { name: "set(obj, prop, value)", desc: "перехоплює запис значення у властивість" },
      { name: "Reflect.get() / Reflect.set()", desc: "стандартна реалізація базової операції — зручно викликати всередині власного handler" },
    ],
    example: `<p id="out"></p>
<script>
  const user = { name: 'Оля' };
  const logged = new Proxy(user, {
    get(obj, prop) {
      console.log('Прочитано:', prop);
      return Reflect.get(obj, prop);
    }
  });
  document.getElementById('out').textContent = 'Ім\\'я: ' + logged.name + ' (деталі логування — у консолі браузера)';
<\/script>`,
    pitfalls: [
      "Proxy рідко потрібен у звичайних застосунках — переважно для бібліотек/фреймворків; надмірне використання ускладнює дебаг.",
      "Не всі операції автоматично перехоплюються — для повної консистентності handler часто делегує до Reflect.*.",
    ],
    related: ["js-objects"],
  },

  "js-storage": {
    badge: "JS",
    title: "localStorage і sessionStorage",
    whatIsIt: "Вбудоване сховище браузера для збереження даних у вигляді рядків між перезавантаженнями сторінки. localStorage зберігає дані без терміну дії, sessionStorage — лише поки відкрита вкладка.",
    useCases: ["збереження теми оформлення (світла/темна)", "збереження прогресу користувача без бекенду", "кешування даних форми між сесіями"],
    syntax: `localStorage.setItem('theme', 'dark');\nconst theme = localStorage.getItem('theme');`,
    attributes: [
      { name: "setItem(key, value)", desc: "зберігає значення за ключем (лише рядки!)" },
      { name: "getItem(key)", desc: "читає значення за ключем, null якщо немає" },
      { name: "removeItem(key)", desc: "видаляє конкретний запис" },
      { name: "clear()", desc: "видаляє ВСІ записи цього сховища для поточного домену" },
      { name: "sessionStorage", desc: "той самий API, але дані зникають при закритті вкладки" },
    ],
    example: `<button id="save">Зберегти ім'я</button>
<input id="name" placeholder="Твоє ім'я" style="padding:6px;border:1px solid #ccc;border-radius:6px;">
<p id="out"></p>
<script>
  const saved = localStorage.getItem('demo_name');
  if (saved) document.getElementById('out').textContent = 'Збережено раніше: ' + saved;
  document.getElementById('save').onclick = () => {
    const name = document.getElementById('name').value;
    localStorage.setItem('demo_name', name);
    document.getElementById('out').textContent = 'Збережено: ' + name;
  };
<\/script>`,
    pitfalls: [
      "localStorage зберігає лише РЯДКИ — об'єкти/масиви потрібно перетворювати через JSON.stringify()/JSON.parse().",
      "Дані localStorage доступні лише для одного домену й не синхронізуються між пристроями.",
      "localStorage синхронний і блокує основний потік — не варто зберігати там великі обсяги даних.",
    ],
    related: ["js-json"],
  },
  "js-regex": {
    badge: "JS",
    title: "Регулярні вирази (RegExp)",
    whatIsIt: "Регулярні вирази описують шаблон тексту для пошуку, перевірки чи заміни — потужний, але лаконічний спосіб працювати з рядками за складнішими правилами, ніж прості includes()/indexOf().",
    useCases: ["перевірка формату email чи телефону", "пошук і заміна всіх входжень шаблону в тексті", "розбиття рядка за складним роздільником"],
    syntax: `const re = /\\d{3}-\\d{4}/;\nconst isValid = re.test('123-4567');`,
    attributes: [
      { name: "/pattern/flags", desc: "літерал регулярного виразу; g — глобальний пошук, i — без урахування регістру" },
      { name: "test()", desc: "перевіряє, чи рядок відповідає шаблону, повертає true/false" },
      { name: "exec() / match()", desc: "повертають деталі знайденого збігу" },
      { name: "replace(regex, replacement)", desc: "замінює знайдені збіги в рядку (потрібен /g для всіх входжень)" },
      { name: "\\d \\w \\s", desc: "цифра, буква/цифра/підкреслення, пробільний символ" },
      { name: "^ $ * + ? {}", desc: "початок/кінець рядка, повторення 0+/1+/0-1 раз, точна кількість повторень" },
    ],
    example: `<input id="email" placeholder="you@example.com" style="padding:6px;border:1px solid #ccc;border-radius:6px;width:200px;">
<p id="out"></p>
<script>
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  document.getElementById('email').oninput = (e) => {
    const valid = re.test(e.target.value);
    document.getElementById('out').textContent = valid ? '✓ Схоже на email' : '✗ Невірний формат';
    document.getElementById('out').style.color = valid ? 'green' : 'red';
  };
<\/script>`,
    pitfalls: [
      "Забутий прапорець /g у replace() — замінює лише ПЕРШЕ входження замість усіх.",
      "Складні регулярні вирази важко читати й підтримувати — для простих перевірок форматів варто розглянути прості string-методи.",
      "Регулярний вираз без ^ і $ перевіряє наявність підрядка ДЕСЬ у тексті, а не відповідність усього рядка цілком.",
    ],
    related: ["js-strings"],
  },
  "js-console": {
    badge: "JS",
    title: "console.log і інші методи консолі",
    whatIsIt: "Вбудований об'єкт console для виводу повідомлень у консоль розробника браузера — основний інструмент дебагу JavaScript-коду.",
    useCases: ["швидка перевірка значення змінної під час розробки", "виведення помилок і попереджень окремо від звичайних логів", "групування пов'язаних повідомлень для наочності"],
    syntax: `console.log('Значення:', value);\nconsole.error('Щось пішло не так');`,
    attributes: [
      { name: "console.log()", desc: "звичайний вивід — приймає кілька аргументів через кому" },
      { name: "console.error() / console.warn()", desc: "виводять повідомлення як помилку (червоне) чи попередження (жовте)" },
      { name: "console.table()", desc: "показує масив об'єктів у вигляді зручної таблиці" },
      { name: "console.group() / console.groupEnd()", desc: "групують кілька повідомлень у згорнутий блок" },
      { name: "console.time() / console.timeEnd()", desc: "вимірюють, скільки часу зайняв блок коду" },
    ],
    example: `<button id="run">Запустити приклад (відкрий консоль браузера!)</button>
<p style="font-size:13px;color:#666;">Результат буде в консолі розробника (F12), не на сторінці.</p>
<script>
  document.getElementById('run').onclick = () => {
    console.log('Звичайний лог');
    console.warn('Це попередження');
    console.table([{ name: 'Оля', age: 25 }, { name: 'Іван', age: 30 }]);
  };
<\/script>`,
    pitfalls: [
      "Забуті console.log() у продакшн-коді засмічують консоль користувача й можуть трохи впливати на продуктивність.",
      "console.log(об'єкт) показує ПОСИЛАННЯ на об'єкт — якщо об'єкт зміниться пізніше, у консолі побачиш вже ЗМІНЕНИЙ стан, а не той, що був на момент логування.",
    ],
    related: [],
  },
  "js-canvas": {
    badge: "JS",
    title: "Canvas API",
    whatIsIt: "JavaScript API для малювання графіки на елементі <canvas> — фігури, лінії, зображення, текст. Усе малювання відбувається через контекст (getContext), отриманий від canvas-елемента.",
    useCases: ["графіки й діаграми, намальовані кодом", "прості 2D-ігри в браузері", "інтерактивні візуалізації даних"],
    syntax: `const ctx = canvas.getContext('2d');\nctx.fillRect(10, 10, 100, 50);`,
    attributes: [
      { name: "getContext('2d')", desc: "повертає об'єкт для малювання — усі методи викликаються на ньому" },
      { name: "fillRect() / strokeRect()", desc: "малюють заповнений чи обведений прямокутник" },
      { name: "beginPath() / moveTo() / lineTo()", desc: "будують довільний контур з ліній" },
      { name: "arc()", desc: "малює дугу чи повне коло" },
      { name: "fillStyle / strokeStyle", desc: "колір заливки й контуру для наступних операцій малювання" },
      { name: "clearRect()", desc: "очищає прямокутну область — потрібно для кожного кадру анімації" },
    ],
    example: `<canvas id="c" width="280" height="100" style="border:1px solid #ccc;border-radius:6px;"></canvas>
<script>
  const ctx = document.getElementById('c').getContext('2d');
  ctx.fillStyle = '#7c3aed';
  ctx.fillRect(20, 20, 80, 60);
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath();
  ctx.arc(200, 50, 30, 0, Math.PI * 2);
  ctx.fill();
<\/script>`,
    pitfalls: [
      "Зміна розміру canvas через CSS (width/height у стилях) розтягує намальоване замість зміни роздільної здатності — розміри треба міняти через атрибути width/height.",
      "Для анімації потрібно самому очищати попередній кадр (clearRect) і перемальовувати — canvas не робить це автоматично.",
    ],
    related: [],
  },
  "js-web-apis": {
    badge: "JS",
    title: "IntersectionObserver, MutationObserver, Clipboard та інші Web API",
    whatIsIt: "Браузер надає багато вбудованих API поза межами «чистого» JavaScript: спостереження за появою елементів на екрані, зміною DOM, буфер обміну, геолокація. Дозволяють реалізувати складну поведінку без сторонніх бібліотек.",
    useCases: ["лінива загрузка зображень при прокручуванні (IntersectionObserver)", "кнопка «Скопіювати» (Clipboard API)", "реакція на динамічні зміни в DOM від сторонньої бібліотеки (MutationObserver)"],
    syntax: `const observer = new IntersectionObserver((entries) => {\n  entries.forEach(e => { if (e.isIntersecting) console.log('Видно!'); });\n});\nobserver.observe(el);`,
    attributes: [
      { name: "IntersectionObserver", desc: "відстежує, коли елемент з'являється/зникає у видимій області екрана" },
      { name: "MutationObserver", desc: "відстежує зміни в DOM-дереві (додавання/видалення елементів, зміну атрибутів)" },
      { name: "navigator.clipboard.writeText()", desc: "копіює текст у системний буфер обміну (потребує дозволу браузера)" },
      { name: "navigator.geolocation.getCurrentPosition()", desc: "отримує поточні координати користувача (з дозволу)" },
      { name: "ResizeObserver", desc: "відстежує зміну розміру конкретного елемента" },
    ],
    example: `<button id="copy">Скопіювати текст</button>
<p id="out"></p>
<script>
  document.getElementById('copy').onclick = async () => {
    try {
      await navigator.clipboard.writeText('Привіт з 00100101!');
      document.getElementById('out').textContent = 'Скопійовано в буфер обміну!';
    } catch (e) {
      document.getElementById('out').textContent = 'Не вдалось скопіювати (потрібен дозвіл браузера)';
    }
  };
<\/script>`,
    pitfalls: [
      "Багато сучасних Web API (Clipboard, Geolocation) потребують HTTPS і явного дозволу користувача — не працюють у небезпечному контексті.",
      "Забутий observer.disconnect() для IntersectionObserver/MutationObserver — витік пам'яті, якщо елемент видалено, а спостереження триває.",
    ],
    related: ["js-events"],
  },

  "eng-asap-fyi": {
    badge: "English",
    title: "ASAP, FYI та інші офісні абревіатури",
    whatIsIt: "Абревіатури, які постійно зустрічаються в робочому листуванні: ASAP (As Soon As Possible — якнайшвидше), FYI (For Your Information — для інформації), EOD (End Of Day — до кінця дня), WFH (Work From Home — робота з дому).",
    useCases: ["позначити терміновість запиту (ASAP)", "поділитись інформацією без потреби відповідати (FYI)", "домовитись про дедлайн (EOD)"],
    syntax: `FYI, I've updated the API docs. Please review ASAP — we need this by EOD.`,
    attributes: [
      { name: "ASAP", desc: "As Soon As Possible — якнайшвидше" },
      { name: "FYI", desc: "For Your Information — для довідки, не потребує дії" },
      { name: "EOD / EOW", desc: "End Of Day / End Of Week — до кінця дня/тижня" },
      { name: "WFH", desc: "Work From Home — робота з дому" },
      { name: "OOO", desc: "Out Of Office — поза офісом/у відпустці" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>Slack:</b> "FYI — the staging server will be down for maintenance tonight. I'll be OOO tomorrow, back on Thursday."
</p>`,
    pitfalls: [
      "Надмірне використання ASAP у кожному повідомленні знецінює реальну терміновість — використовуй, лише коли справді критично.",
      "FYI на початку речення сигналізує «дія не потрібна» — плутанина, якщо насправді очікується відповідь.",
    ],
    related: ["eng-per-my-last", "eng-follow-up"],
  },
  "eng-per-my-last": {
    badge: "English",
    title: "Per my last email / As mentioned",
    whatIsIt: "Ввічливо-пасивно-агресивна фраза, якою нагадують, що інформація вже надавалась раніше (в попередньому листі), натякаючи, що співрозмовник міг би просто перечитати. Популярний мем в англомовному офісному спілкуванні.",
    useCases: ["коли доводиться повторювати те, що вже було написано", "формальне нагадування без прямого звинувачення"],
    syntax: `Per my last email, the deployment is scheduled for Friday.`,
    attributes: [
      { name: "Per my last email", desc: "«як я вже писав у попередньому листі»" },
      { name: "As mentioned above/previously", desc: "нейтральніший варіант тієї самої ідеї" },
      { name: "As discussed", desc: "«як ми вже обговорювали» (усно чи на зустрічі)" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>Email:</b> "Per my last email, the API keys need to be rotated before the release. Let me know if you have questions."
</p>`,
    pitfalls: [
      "«Per my last email» звучить пасивно-агресивно для носіїв мови — у нейтральному спілкуванні краще «As mentioned» чи просто повторити інформацію без натяку.",
    ],
    related: ["eng-asap-fyi", "eng-follow-up"],
  },
  "eng-false-friends": {
    badge: "English",
    title: "«Хибні друзі перекладача» (actually, eventually...)",
    whatIsIt: "Англійські слова, схожі на українські за звучанням, але з іншим значенням — часте джерело помилок. Actually означає «насправді» (не «актуально»), eventually — «зрештою/врешті-решт» (не «евентуально/можливо»).",
    useCases: ["уникнення поширених помилок у робочому листуванні", "точніше формулювання думки англійською"],
    syntax: `Actually, the bug is in the backend, not the frontend.`,
    attributes: [
      { name: "actually", desc: "насправді (НЕ «актуально» — те буде \"currently relevant\" чи \"topical\")" },
      { name: "eventually", desc: "зрештою, врешті-решт (НЕ «можливо» — те буде \"possibly\" чи \"maybe\")" },
      { name: "sympathetic", desc: "співчутливий (НЕ «симпатичний» — те буде \"nice\" чи \"cute\")" },
      { name: "accurate", desc: "точний (НЕ «акуратний» — те буде \"neat\" чи \"tidy\")" },
      { name: "magazine", desc: "журнал (НЕ «магазин» — те буде \"shop\" чи \"store\")" },
    ],
    example: `<p style="font-family:sans-serif;">
  ❌ "This feature is actually relevant for the release." (мається на увазі «наразі актуальна»)<br>
  ✅ "This feature is currently relevant for the release."<br><br>
  ✅ Правильне вживання actually: "I thought the bug was in the frontend, but actually it's in the backend."
</p>`,
    pitfalls: [
      "Найчастіша помилка — вживати actually у значенні «актуально», хоча воно означає «насправді, у дійсності».",
      "eventually НЕ означає «евентуально» (можливо) — навпаки, підкреслює, що щось точно станеться, просто пізніше.",
    ],
    related: ["eng-boilerplate"],
  },
  "eng-boilerplate": {
    badge: "English",
    title: "boilerplate",
    whatIsIt: "Стандартний, шаблонний код чи текст, який повторюється в багатьох місцях майже без змін — наприклад, базова структура компонента чи типові налаштування проєкту.",
    useCases: ["опис повторюваної структури коду, яку копіюють у кожен новий файл/компонент", "шаблонний текст документів (умови використання тощо)"],
    syntax: `This is just boilerplate code — copy it into every new component.`,
    attributes: [
      { name: "boilerplate code", desc: "шаблонний код, що повторюється майже без змін" },
      { name: "boilerplate text", desc: "стандартний текст (юридичний, документація)" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>У PR коментарі:</b> "Most of this file is React boilerplate — the actual logic is in the last 10 lines."
</p>`,
    pitfalls: ["Не плутати з «шаблонізатором» (template engine) — boilerplate стосується самого повторюваного КОДУ/ТЕКСТУ, а не інструменту для його генерації."],
    related: ["eng-edge-case", "eng-tech-debt"],
  },
  "eng-edge-case": {
    badge: "English",
    title: "edge case",
    whatIsIt: "Рідкісна, гранична ситуація на межі допустимих умов програми — те, що легко забути протестувати. Наприклад: порожній масив, від'ємне число там, де очікують лише додатні, дуже довгий рядок.",
    useCases: ["обговорення тестування — які граничні випадки треба перевірити", "пояснення причини бага, що трапляється рідко"],
    syntax: `Did you handle the edge case where the array is empty?`,
    attributes: [
      { name: "edge case", desc: "рідкісна гранична ситуація" },
      { name: "corner case", desc: "синонім, іноді для ще рідкіснішого перетину кількох умов" },
      { name: "happy path", desc: "протилежність — типовий, очікуваний сценарій без ускладнень" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>У код-рев'ю:</b> "What happens if the user submits the form with an empty string? That's an edge case we should handle."
</p>`,
    pitfalls: ["Плутанина edge case (рідкісна, але можлива ситуація) з bug (реальна помилка) — edge case стає багом, лише якщо його не обробили правильно."],
    related: ["eng-boilerplate"],
  },
  "eng-tech-debt": {
    badge: "English",
    title: "tech(nical) debt",
    whatIsIt: "Метафора для позначення «швидких» рішень у коді, які працюють зараз, але створюють додаткову роботу в майбутньому — як фінансовий борг з відсотками. Свідомий чи вимушений компроміс між швидкістю зараз і якістю пізніше.",
    useCases: ["пояснення, чому код варто переписати пізніше", "обговорення пріоритетів: нова фіча vs виправлення старих компромісів"],
    syntax: `We took on some tech debt to ship this feature faster — we'll need to refactor it later.`,
    attributes: [
      { name: "tech debt / technical debt", desc: "накопичені компроміси якості коду заради швидкості" },
      { name: "pay down tech debt", desc: "«виплатити борг» — витратити час на рефакторинг" },
      { name: "accrue debt", desc: "«накопичувати борг» — продовжувати додавати компроміси" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>На плануванні:</b> "This quarter we should allocate time to pay down some of the tech debt in the payments module."
</p>`,
    pitfalls: ["Tech debt — це не завжди «поганий код»; іноді це свідомий, обґрунтований компроміс, задокументований для майбутнього виправлення."],
    related: ["eng-boilerplate", "eng-edge-case"],
  },
  "eng-rubber-duck": {
    badge: "English",
    title: "rubber duck debugging",
    whatIsIt: "Техніка дебагу: пояснюєш проблему вголос (навіть іграшковій гумовій качечці на столі), і часто саме процес формулювання допомагає самостійно знайти рішення, ще до того, як хтось відповість.",
    useCases: ["пояснення методу, коли просиш колегу «просто послухати» проблему", "самостійний дебаг через проговорювання коду вголос"],
    syntax: `I solved it just by explaining the bug to you — classic rubber duck debugging!`,
    attributes: [
      { name: "rubber duck debugging", desc: "техніка пояснення проблеми вголос для самостійного пошуку рішення" },
      { name: "rubber ducking", desc: "розмовний скорочений варіант того самого" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>У чаті з колегою:</b> "Can I rubber duck this issue with you for 5 minutes? I don't need you to fix it, just listen."
</p>`,
    pitfalls: ["Не сприймай буквально — не обов'язкова справжня качечка, ідея в самому процесі промовляння проблеми вголос комусь (чи навіть предмету)."],
    related: ["eng-blocker"],
  },
  "eng-spaghetti-code": {
    badge: "English",
    title: "spaghetti code",
    whatIsIt: "Неформальний термін для заплутаного, погано структурованого коду з великою кількістю переплетених залежностей — важко відстежити логіку, як розплутати спагеті на тарілці.",
    useCases: ["опис коду, що потребує рефакторингу через заплутану структуру", "аргумент за необхідність переписати старий модуль"],
    syntax: `This function has become spaghetti code — it's doing five different things at once.`,
    attributes: [
      { name: "spaghetti code", desc: "заплутаний, погано структурований код" },
      { name: "clean code", desc: "протилежність — акуратний, добре організований код" },
    ],
    example: `<p style="font-family:sans-serif;">
  <b>У код-рев'ю:</b> "This controller has turned into spaghetti code — let's split it into smaller functions."
</p>`,
    pitfalls: ["Термін неформальний — не варто використовувати в офіційній документації чи звітах, лише в розмовному контексті з командою."],
    related: ["eng-tech-debt"],
  },

  "fe-react-basics": {
    badge: "Frontend",
    title: "React: компоненти, JSX, props",
    whatIsIt: "React будує інтерфейс з незалежних, перевикористовуваних компонентів — функцій, що повертають розмітку через JSX (HTML-подібний синтаксис прямо в JS). Дані передаються «згори вниз» через props — властивості, доступні лише для читання всередині компонента.",
    useCases: ["розбиття складного UI на менші перевикористовувані частини", "передача даних від батьківського компонента до дочірнього", "побудова інтерфейсу цієї самої платформи (написана на React)"],
    syntax: `function Greeting({ name }) {\n  return <h1>Привіт, {name}!</h1>;\n}\n<Greeting name="Оля" />`,
    attributes: [
      { name: "Компонент", desc: "функція, що повертає JSX — «шматочок» інтерфейсу" },
      { name: "JSX", desc: "синтаксичне розширення, що дозволяє писати HTML-подібну розмітку в JS-файлі" },
      { name: "Props", desc: "дані, передані батьківським компонентом — лише для читання" },
      { name: "{вираз}", desc: "фігурні дужки в JSX вставляють результат будь-якого JS-виразу" },
      { name: "children", desc: "спеціальний prop — вміст, вкладений МІЖ відкриваючим і закриваючим тегом компонента" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:12px;">function Card({ title, children }) {
  return (
    &lt;div className="card"&gt;
      &lt;h3&gt;{title}&lt;/h3&gt;
      {children}
    &lt;/div&gt;
  );
}

&lt;Card title="Приклад картки"&gt;
  Вміст картки через children
&lt;/Card&gt;</pre>
<p style="font-size:12px;color:#666;margin:6px 0;">↓ що це рендерить на сторінці:</p>
<div style="border:1px solid #ccc;padding:10px;border-radius:6px;max-width:220px;">
  <h3 style="margin:0 0 6px;">Приклад картки</h3>
  Вміст картки через children
</div>`,
    pitfalls: [
      "Спроба ЗМІНИТИ props усередині дочірнього компонента — вони лише для читання, для змінюваного стану потрібен useState.",
      "Забутий унікальний key при рендері списку компонентів через map() — React попереджає в консолі й може неправильно оновлювати список.",
      "JSX вимагає ОДИН кореневий елемент (чи Fragment <></>) — два сусідні теги без обгортки викличуть помилку.",
    ],
    related: ["fe-react-hooks", "fe-virtual-dom"],
  },
  "fe-react-hooks": {
    badge: "Frontend",
    title: "React Hooks: useState, useEffect",
    whatIsIt: "Хуки дозволяють функціональним компонентам мати власний стан і побічні ефекти (запити, підписки) — до їх появи це було можливо лише в класових компонентах. useState додає локальний стан, useEffect виконує код після рендеру.",
    useCases: ["зберігання значення поля вводу чи лічильника (useState)", "завантаження даних з API при монтуванні компонента (useEffect)", "підписка на подію з відпискою при розмонтуванні"],
    syntax: `const [count, setCount] = useState(0);\nuseEffect(() => {\n  document.title = \`Кліків: \${count}\`;\n}, [count]);`,
    attributes: [
      { name: "useState(initial)", desc: "повертає [значення, функція-сеттер]; виклик сеттера викликає повторний рендер" },
      { name: "useEffect(fn, deps)", desc: "виконує fn після рендеру; deps — масив залежностей, що визначає коли повторно запускати" },
      { name: "useEffect(fn, [])", desc: "порожній масив залежностей — ефект виконається лише один раз, при монтуванні" },
      { name: "return () => {}", desc: "функція очищення всередині useEffect — виконується перед наступним ефектом чи розмонтуванням" },
      { name: "useContext / useRef / useMemo", desc: "інші поширені хуки: читання контексту, мутабельне значення, кешування обчислення" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:12px;">function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log('Змінилось на', count);
  }, [count]);
  return &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
    Клікнуто: {count}
  &lt;/button&gt;;
}</pre>
<p style="font-size:12px;color:#666;margin:6px 0;">↓ той самий результат (тут без React, для наочності):</p>
<button id="btn" style="padding:8px 16px;border:1px solid #ccc;border-radius:6px;background:white;cursor:pointer;">Клікнуто: 0</button>
<script>
  let count = 0;
  document.getElementById('btn').onclick = function() {
    count++;
    this.textContent = 'Клікнуто: ' + count;
    console.log('Змінилось на', count);
  };
<\/script>`,
    pitfalls: [
      "Виклик хуків усередині if/for/вкладених функцій — заборонено; хуки мають викликатись завжди в однаковому порядку на кожному рендері.",
      "Забутий масив залежностей у useEffect — ефект виконується ПІСЛЯ КОЖНОГО рендеру, часто ненавмисно.",
      "Пряма зміна стану (count++) замість setCount(count + 1) — React не помітить зміну й не перерендерить компонент.",
    ],
    related: ["fe-react-basics", "js-promises"],
  },
  "fe-state-management": {
    badge: "Frontend",
    title: "Керування станом (Context, Redux, Zustand)",
    whatIsIt: "Коли дані потрібні багатьом компонентам у різних частинах дерева, передавати їх через props («prop drilling») стає незручно. Бібліотеки керування станом дають централізоване сховище, доступне будь-якому компоненту напряму.",
    useCases: ["дані користувача (авторизація), потрібні в шапці, сайдбарі й профілі одночасно", "кошик покупок, доступний з будь-якої сторінки", "тема оформлення (світла/темна) для всього застосунку"],
    syntax: `const ThemeContext = React.createContext('light');\n// глибоко вкладений компонент:\nconst theme = useContext(ThemeContext);`,
    attributes: [
      { name: "React Context", desc: "вбудований спосіб передати дані без props на кожному рівні — для нечастих оновлень" },
      { name: "Redux / Redux Toolkit", desc: "централізоване сховище з передбачуваними оновленнями через actions/reducers — для великих застосунків" },
      { name: "Zustand", desc: "легша альтернатива Redux, менше шаблонного коду" },
      { name: "prop drilling", desc: "проблема, яку вирішує керування станом — передача props через багато проміжних рівнів, які самі їх не використовують" },
    ],
    example: `<div style="font-family:sans-serif;font-size:14px;">
  <p><b>Без керування станом:</b> App → Layout → Sidebar → UserMenu (props йдуть через усі рівні)</p>
  <p><b>З Context/Zustand:</b> UserMenu читає дані напряму зі сховища, минаючи Layout і Sidebar</p>
</div>`,
    pitfalls: [
      "Використання глобального стану для ВСЬОГО, навіть локальних дрібниць (стан одного поля форми) — зайва складність, локальний useState часто достатній.",
      "Context перерендерює ВСІХ підписників при будь-якій зміні значення — для великих/частих оновлень краще Zustand/Redux з точковою підпискою.",
    ],
    related: ["fe-react-hooks"],
  },

  "fe-build-tools": {
    badge: "Frontend",
    title: "Інструменти збірки (Vite, Webpack, Babel)",
    whatIsIt: "Інструменти збірки перетворюють вихідний код розробника (JSX, TypeScript, сучасний JS, модулі) на файли, які реально можуть виконати браузери — об'єднують (bundling), мінімізують і транспілюють код у старіший, сумісніший синтаксис.",
    useCases: ["об'єднання десятків файлів проєкту в кілька оптимізованих файлів для продакшену", "миттєве оновлення сторінки при зміні коду під час розробки (HMR)", "підтримка старіших браузерів через транспіляцію сучасного JS"],
    syntax: `npm run dev    # локальний сервер розробки\nnpm run build  # продакшн-збірка`,
    attributes: [
      { name: "Vite", desc: "сучасний швидкий інструмент (використаний у цьому проєкті) — миттєвий старт завдяки ES-модулям у браузері під час розробки" },
      { name: "Webpack", desc: "найпоширеніший (хоч і повільніший за Vite) бандлер з великою екосистемою плагінів" },
      { name: "Babel", desc: "перетворює сучасний JS/JSX на код, сумісний зі старішими браузерами" },
      { name: "Bundling", desc: "об'єднання багатьох файлів/модулів в один чи кілька файлів для браузера" },
      { name: "HMR (Hot Module Replacement)", desc: "оновлює змінений код у браузері без повного перезавантаження сторінки" },
      { name: "Tree shaking", desc: "видаляє з фінального бандла код, який ніде не використовується" },
    ],
    example: `<div style="font-family:sans-serif;font-size:14px;">
  <p>1. Пишеш код у <code>src/App.jsx</code> (JSX, сучасний JS)</p>
  <p>2. Vite перетворює його «на льоту» під час розробки чи одним разом для продакшену</p>
  <p>3. Браузер отримує готовий, оптимізований JS/CSS/HTML</p>
</div>`,
    pitfalls: [
      "Дуже великий фінальний бандл (як цей проєкт — усе в одному App.jsx) сповільнює перше завантаження — рішення: code splitting, динамічний import().",
      "Різні інструменти збірки мають різні формати конфігурації — код, що працює з Webpack, не завжди напряму переноситься на Vite без адаптації.",
    ],
    related: ["fe-package-managers"],
  },
  "fe-typescript": {
    badge: "Frontend",
    title: "TypeScript",
    whatIsIt: "Надбудова над JavaScript, що додає статичну типізацію — типи змінних, параметрів функцій і повернених значень перевіряються ДО запуску коду. Компілюється у звичайний JavaScript, який виконує браузер.",
    useCases: ["ловити помилки типів на етапі написання коду, а не в рантаймі", "автодоповнення й підказки в редакторі для складних об'єктів API", "документування форми даних через типи/інтерфейси"],
    syntax: `function sum(a: number, b: number): number {\n  return a + b;\n}\ninterface User { name: string; age: number; }`,
    attributes: [
      { name: "type / interface", desc: "описують форму об'єкта чи значення" },
      { name: "string / number / boolean", desc: "базові примітивні типи" },
      { name: "Array<T> / T[]", desc: "типізований масив, напр. string[] — масив рядків" },
      { name: "?", desc: "робить властивість опціональною: age?: number" },
      { name: "any / unknown", desc: "any відключає перевірку типів (уникай), unknown — безпечніша альтернатива" },
      { name: "extends / implements", desc: "розширення типів/інтерфейсів для класів" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">interface User {
  name: string;
  age: number;
  email?: string; // опціонально
}

function greet(user: User): string {
  return \`Привіт, \${user.name}!\`;
}

greet({ name: 'Оля', age: 25 }); // ✓ OK
greet({ name: 'Оля' }); // ✗ Помилка: бракує age</pre>`,
    pitfalls: [
      "Зловживання any для «швидкого вирішення» помилок типів зводить нанівець усю користь TypeScript.",
      "TypeScript перевіряє типи лише під час КОМПІЛЯЦІЇ — у рантаймі типів вже немає, неправильні дані з зовнішнього API все одно можуть пройти непоміченими.",
      "Типи інтерфейсів і фактична структура відповіді сервера можуть розійтися з часом, якщо не синхронізувати їх свідомо.",
    ],
    related: ["fe-build-tools"],
  },
  "fe-testing": {
    badge: "Frontend",
    title: "Тестування (Jest, Cypress, Testing Library)",
    whatIsIt: "Автоматизовані тести перевіряють, що код працює правильно, без ручної перевірки кожного разу. Unit-тести (Jest/Vitest) перевіряють окремі функції/компоненти ізольовано, E2E-тести (Cypress/Playwright) — весь застосунок так, як його використовує реальний користувач.",
    useCases: ["перевірка, що функція повертає правильний результат для різних вхідних даних", "автоматична перевірка ключових сценаріїв (логін, оформлення замовлення) перед релізом", "запобігання регресіям — старий функціонал ненавмисно не зламався"],
    syntax: `test('sum adds numbers', () => {\n  expect(sum(2, 3)).toBe(5);\n});`,
    attributes: [
      { name: "Jest / Vitest", desc: "раннери unit-тестів — запускають тести й перевіряють результати через матчери" },
      { name: "expect().toBe()", desc: "перевіряє, що фактичний результат точно дорівнює очікуваному" },
      { name: "Testing Library", desc: "тестує компоненти так, як їх бачить користувач — через текст і ролі, не внутрішню структуру" },
      { name: "Cypress / Playwright", desc: "автоматизують реальний браузер для E2E-тестування повного сценарію користувача" },
      { name: "mock", desc: "підміна реальної залежності (API-запиту) фейковою для ізольованого тестування" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">// unit-тест функції
test('formats price correctly', () => {
  expect(formatPrice(19.99)).toBe('$19.99');
});

// тест компонента (Testing Library)
test('shows greeting after click', () => {
  render(&lt;Button /&gt;);
  fireEvent.click(screen.getByText('Привіт'));
  expect(screen.getByText('Клікнуто!')).toBeInTheDocument();
});</pre>`,
    pitfalls: [
      "Тестування внутрішньої реалізації компонента (напр. приватного стану) замість того, що бачить користувач — тести ламаються при рефакторингу, навіть якщо поведінка не змінилась.",
      "Відсутність тестів для критичних сценаріїв (оплата, авторизація) — найдорожче місце для регресії.",
      "E2E-тести повільніші за unit-тести — не варто покривати ними абсолютно все, краще піраміда тестів (багато unit, менше E2E).",
    ],
    related: [],
  },

  "fe-web-components": {
    badge: "Frontend",
    title: "Web Components (Custom Elements, Shadow DOM)",
    whatIsIt: "Нативна браузерна технологія для створення перевикористовуваних компонентів БЕЗ жодного фреймворку — власні HTML-теги (Custom Elements) з ізольованими стилями й розміткою (Shadow DOM), що не конфліктують з рештою сторінки.",
    useCases: ["бібліотека компонентів, що працює в будь-якому проєкті незалежно від фреймворку", "віджети сторонніх сервісів (напр. чат-боти), вбудовані на чужі сайти", "ізоляція стилів одного компонента від решти CSS сторінки"],
    syntax: `customElements.define('my-card', class extends HTMLElement {\n  connectedCallback() {\n    this.attachShadow({ mode: 'open' }).innerHTML = '<p>Привіт</p>';\n  }\n});`,
    attributes: [
      { name: "customElements.define()", desc: "реєструє новий HTML-тег з власною поведінкою" },
      { name: "class extends HTMLElement", desc: "визначає поведінку кастомного елемента" },
      { name: "connectedCallback()", desc: "викликається, коли елемент з'являється в DOM" },
      { name: "attachShadow({ mode: 'open' })", desc: "створює ізольований Shadow DOM — власний піддокумент зі своїми стилями" },
      { name: "<slot>", desc: "місце-заповнювач у Shadow DOM для контенту, переданого ззовні" },
    ],
    example: `<my-badge>Новий</my-badge>
<script>
  class MyBadge extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = \`
        <style>
          span { background: #7c3aed; color: white; padding: 4px 10px; border-radius: 10px; font-size: 12px; }
        </style>
        <span><slot></slot></span>
      \`;
    }
  }
  customElements.define('my-badge', MyBadge);
<\/script>`,
    pitfalls: [
      "Стилі всередині Shadow DOM повністю ізольовані — глобальний CSS сторінки на них НЕ впливає, що зручно, але заплутує при першому знайомстві.",
      "Web Components мають менш зручний за React/Vue API для складного стану й реактивності — часто використовуються для окремих незалежних віджетів, не цілих застосунків.",
    ],
    related: ["fe-react-basics"],
  },
  "fe-pwa": {
    badge: "Frontend",
    title: "PWA (Progressive Web App)",
    whatIsIt: "Веб-застосунок, що поводиться як нативний мобільний додаток — можна встановити на головний екран, він працює офлайн (частково), може надсилати push-сповіщення. Досягається через Service Worker і файл маніфесту.",
    useCases: ["застосунок, доступний офлайн після першого відвідування", "встановлення сайту на головний екран телефону без App Store", "push-сповіщення без нативного застосунку"],
    syntax: `// manifest.json
{ "name": "Моя PWA", "icons": [...], "start_url": "/", "display": "standalone" }`,
    attributes: [
      { name: "manifest.json", desc: "файл з метаданими застосунку: назва, іконки, кольори, точка входу" },
      { name: "Service Worker", desc: "скрипт, що працює у фоні окремо від сторінки — кешує ресурси, перехоплює мережеві запити" },
      { name: "Cache API", desc: "дозволяє Service Worker зберігати відповіді запитів для роботи офлайн" },
      { name: "display: standalone", desc: "застосунок відкривається без адресного рядка браузера, як нативний" },
    ],
    example: `<div style="font-family:sans-serif;font-size:14px;">
  <p>1. Браузер знаходить manifest.json → пропонує «Встановити застосунок»</p>
  <p>2. Service Worker кешує основні файли при першому відвідуванні</p>
  <p>3. Наступного разу застосунок відкривається навіть без інтернету (з кешу)</p>
</div>`,
    pitfalls: [
      "PWA потребує HTTPS (окрім localhost) — Service Worker не реєструється на незахищеному з'єднанні.",
      "Забутий план оновлення кешу Service Worker — користувачі можуть застрягти зі старою версією застосунку.",
      "iOS історично має обмежену підтримку деяких PWA-можливостей порівняно з Android.",
    ],
    related: [],
  },
  "fe-accessibility": {
    badge: "Frontend",
    title: "Доступність (a11y)",
    whatIsIt: "a11y (скорочення від accessibility — між 'a' і 'y' одинадцять букв) — практики, що роблять сайт зручним для людей з інвалідністю: користувачів скрінрідерів, людей, що не використовують мишу, людей з порушенням зору.",
    useCases: ["скрінрідер коректно озвучує вміст сторінки", "повна навігація сайтом лише клавіатурою (Tab, Enter)", "достатній колірний контраст для людей з порушенням зору"],
    syntax: `<button aria-label="Закрити">✕</button>\n<img src="cat.jpg" alt="Руда кішка на дивані">`,
    attributes: [
      { name: "alt", desc: "текстовий опис зображення для скрінрідерів — обов'язковий" },
      { name: "aria-label", desc: "задає доступну назву елемента, коли візуального тексту немає" },
      { name: "семантичні теги", desc: "<button>, <nav>, <header> замість <div> з обробниками — скрінрідери розуміють їх сенс" },
      { name: "tabindex", desc: "керує порядком фокусування клавішею Tab" },
      { name: "контраст кольорів", desc: "достатня різниця яскравості між текстом і фоном (WCAG рекомендує мінімум 4.5:1)" },
    ],
    example: `<button style="padding:8px;border:none;border-radius:6px;background:#7c3aed;color:white;" aria-label="Закрити вікно">✕</button>
<p style="font-size:13px;color:#666;margin-top:8px;">Без aria-label скрінрідер прочитав би лише символ «✕» без пояснення дії.</p>`,
    pitfalls: [
      "div з onClick замість <button> — недоступний з клавіатури й невидимий для скрінрідерів як інтерактивний елемент.",
      "Відсутній alt на змістовних зображеннях — інформація повністю втрачається для користувачів скрінрідерів.",
      "Занадто низький контраст тексту (світло-сірий на білому) — нечитабельно для людей з порушенням зору.",
    ],
    related: [],
  },
  "fe-performance": {
    badge: "Frontend",
    title: "Продуктивність і Core Web Vitals",
    whatIsIt: "Core Web Vitals — метрики Google для оцінки якості користувацького досвіду сторінки: швидкість завантаження, стабільність макету під час завантаження, швидкість реакції на взаємодію.",
    useCases: ["оцінка реальної швидкості сайту для користувачів", "фактор ранжування в пошуковій видачі Google", "виявлення проблем продуктивності перед релізом"],
    syntax: `// Виміряти в DevTools → Lighthouse чи PageSpeed Insights`,
    attributes: [
      { name: "LCP (Largest Contentful Paint)", desc: "час до показу найбільшого видимого елемента — має бути до 2.5с" },
      { name: "CLS (Cumulative Layout Shift)", desc: "наскільки макет «стрибає» під час завантаження — має бути мінімальним" },
      { name: "INP (Interaction to Next Paint)", desc: "швидкість реакції інтерфейсу на дії користувача" },
      { name: "code splitting", desc: "розбиття JS-бандла на менші частини, що завантажуються лише коли потрібні" },
      { name: "lazy loading", desc: "відкладене завантаження зображень/компонентів, поки користувач до них не докрутить" },
    ],
    example: `<div style="font-family:sans-serif;font-size:14px;">
  <p>❌ Погано: зображення без width/height → сторінка «стрибає» (CLS) при завантаженні</p>
  <p>✅ Добре: <code>&lt;img width="300" height="150" loading="lazy"&gt;</code> — місце зарезервоване заздалегідь</p>
</div>`,
    pitfalls: [
      "Оптимізація заради самих метрик без реального покращення досвіду користувача — метрики мають бути засобом, не самоціллю.",
      "Забуті width/height на зображеннях — найпоширеніша причина поганого CLS.",
      "Занадто великий JS-бандл без code splitting сповільнює LCP навіть на швидкому інтернеті.",
    ],
    related: ["fe-build-tools"],
  },
  "fe-package-managers": {
    badge: "Frontend",
    title: "Пакетні менеджери (npm, yarn, pnpm)",
    whatIsIt: "Інструменти для встановлення, оновлення й керування залежностями проєкту — бібліотеками з реєстру npm. package.json описує, які пакети потрібні, package-lock.json (чи аналог) фіксує ТОЧНІ версії для відтворюваності.",
    useCases: ["встановлення бібліотек (React, Vite) для проєкту", "запуск скриптів проєкту (dev, build, test)", "фіксація точних версій залежностей для команди"],
    syntax: `npm install react\nnpm run dev\nnpm install --save-dev vite`,
    attributes: [
      { name: "npm", desc: "стандартний пакетний менеджер Node.js, йде в комплекті" },
      { name: "yarn / pnpm", desc: "альтернативи з іншими підходами до швидкості й дискового простору (pnpm економить місце через спільні залежності)" },
      { name: "package.json", desc: "список залежностей проєкту й скриптів (dev, build, test)" },
      { name: "package-lock.json", desc: "фіксує точні версії всіх залежностей (включно з вкладеними) для відтворюваної збірки" },
      { name: "node_modules", desc: "папка, куди фактично встановлюються всі залежності — не комітиться в git" },
      { name: "dependencies / devDependencies", desc: "робочі залежності проєкту / потрібні лише для розробки (тести, збірка)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1"
  }
}</pre>`,
    pitfalls: [
      "Комітити node_modules у git — величезна, непотрібна папка; завжди в .gitignore, package-lock.json відновить її через npm install.",
      "Змішування npm і yarn в одному проєкті (два різні lock-файли) — може призвести до розбіжностей версій між розробниками.",
      "^ перед версією (напр. ^18.3.1) дозволяє мінорні оновлення автоматично — іноді призводить до несподіваних змін поведінки.",
    ],
    related: ["fe-build-tools"],
  },

  "py-classes": {
    badge: "Python",
    title: "class, __init__, self",
    whatIsIt: "Класи в Python описують шаблон для створення об'єктів з даними й поведінкою. __init__ — спеціальний метод-конструктор, що викликається автоматично при створенні об'єкта. self — перший параметр кожного методу, посилання на сам об'єкт.",
    useCases: ["модель даних з поведінкою (напр. клас User)", "наслідування спільної логіки між схожими класами", "інкапсуляція внутрішнього стану об'єкта"],
    syntax: `class User:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f"Привіт, {self.name}"`,
    attributes: [
      { name: "class Name:", desc: "оголошує клас" },
      { name: "__init__(self, ...)", desc: "конструктор — викликається автоматично при User(...)" },
      { name: "self", desc: "перший параметр методу — посилання на сам об'єкт (аналог this)" },
      { name: "class Child(Parent):", desc: "наслідування від батьківського класу" },
      { name: "super().__init__()", desc: "викликає конструктор батьківського класу" },
      { name: "@property / @staticmethod / @classmethod", desc: "спеціальні декоратори методів" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} видає звук"

class Dog(Animal):
    def speak(self):
        return super().speak() + " (Гав!)"

d = Dog("Рекс")
print(d.speak())</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Рекс видає звук (Гав!)</pre>`,
    pitfalls: [
      "Забутий self як перший параметр методу — TypeError при виклику.",
      "self.name = name всередині __init__ — забутий self. попереду (просто name = name) створює ЛОКАЛЬНУ змінну, а не атрибут об'єкта.",
      "Плутанина instance-атрибутів (self.x, унікальні для кожного об'єкта) і class-атрибутів (спільні для всіх екземплярів класу).",
    ],
    related: ["py-functions", "py-dataclasses"],
  },
  "py-exceptions": {
    badge: "Python",
    title: "try/except/finally, raise",
    whatIsIt: "Механізм обробки помилок: try виконує потенційно небезпечний код, except ловить конкретний тип винятку, finally виконується завжди. raise дозволяє самому згенерувати виняток.",
    useCases: ["обробка помилки ділення на нуль чи відсутнього ключа словника", "валідація вхідних даних з власними повідомленнями про помилку", "гарантоване закриття ресурсу (файлу) навіть при помилці"],
    syntax: `try:\n    result = 10 / divisor\nexcept ZeroDivisionError:\n    print("Ділення на нуль!")\nfinally:\n    print("Завершено")`,
    attributes: [
      { name: "try / except / finally", desc: "try — небезпечний код, except — обробка, finally — виконується завжди" },
      { name: "except Тип as e:", desc: "ловить конкретний тип винятку, e — об'єкт помилки з деталями" },
      { name: "raise", desc: "генерує виняток, можна з власним повідомленням: raise ValueError('текст')" },
      { name: "ValueError / TypeError / KeyError", desc: "поширені вбудовані типи винятків" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Помилка: ділення на нуль"

print(divide(10, 2))
print(divide(10, 0))</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">5.0
Помилка: ділення на нуль</pre>`,
    pitfalls: [
      "Порожній except: (без вказання типу) ловить взагалі ВСІ винятки, включно з тими, що не мали б ловитись — краще завжди вказувати конкретний тип.",
      "raise довільного значення (не через Exception-клас) — заборонено в Python 3, на відміну від деяких інших мов.",
    ],
    related: ["py-classes"],
  },
  "py-fstrings": {
    badge: "Python",
    title: "f-рядки (f-strings)",
    whatIsIt: "Форматовані рядкові літерали (з 'f' перед лапками) дозволяють вставляти значення змінних і вирази прямо в текст через фігурні дужки {} — найзручніший спосіб форматування рядків у сучасному Python.",
    useCases: ["вставка значень змінних у повідомлення користувачу", "форматування чисел (округлення, ширина поля)", "виконання виразів прямо всередині рядка"],
    syntax: `name = "Оля"\nage = 25\nprint(f"{name} має {age} років")`,
    attributes: [
      { name: "f\"текст {змінна}\"", desc: "вставляє значення змінної прямо в рядок" },
      { name: "f\"{вираз}\"", desc: "усередині {} можна писати будь-який Python-вираз, не лише змінну" },
      { name: "f\"{value:.2f}\"", desc: "форматування — тут округлення до 2 знаків після коми" },
      { name: "f\"{value=}\"", desc: "показує і назву змінної, і її значення (зручно для дебагу)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">price = 19.999
name = "Оля"
print(f"{name} купила товар за {price:.2f} грн")
print(f"Сума з ПДВ: {price * 1.2:.2f}")</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Оля купила товар за 20.00 грн
Сума з ПДВ: 24.00</pre>`,
    pitfalls: [
      "f-рядки з'явились у Python 3.6 — у старішому коді (чи середовищах) можна зустріти .format() чи % — теж працюють, але менш зручні.",
      "Забута літера f перед лапками — фігурні дужки {} просто виведуться як текст, а не обчислений вираз.",
    ],
    related: ["py-strings"],
  },

  "py-comprehensions": {
    badge: "Python",
    title: "List/dict/set comprehension",
    whatIsIt: "Компактний спосіб створити новий список, словник чи множину на основі ітерованого об'єкта в одному рядку — заміна циклу for з append(), часто вважається більш «pythonic» стилем.",
    useCases: ["перетворення кожного елемента списку (аналог map)", "фільтрація елементів за умовою (аналог filter)", "швидке створення словника з двох списків чи пар"],
    syntax: `squares = [x**2 for x in range(5)]\nevens = [x for x in range(10) if x % 2 == 0]`,
    attributes: [
      { name: "[expr for x in iterable]", desc: "list comprehension — створює новий список" },
      { name: "[expr for x in iterable if cond]", desc: "з фільтрацією — лише елементи, що проходять умову" },
      { name: "{k: v for ...}", desc: "dict comprehension — створює словник" },
      { name: "{expr for x in iterable}", desc: "set comprehension — створює множину унікальних значень" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">nums = [5, 12, 8, 3, 20]
squares = [x**2 for x in nums if x > 5]
print(squares)

word_lengths = {w: len(w) for w in ["кіт", "собака", "миша"]}
print(word_lengths)</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">[144, 64, 400]
{'кіт': 3, 'собака': 6, 'миша': 4}</pre>`,
    pitfalls: [
      "Занадто складна логіка (кілька вкладених циклів чи умов) у comprehension — читабельність падає, краще звичайний цикл for.",
      "List comprehension створює ВЕСЬ список одразу в пам'яті — для великих даних краще генератор (expr for x in iterable) без квадратних дужок.",
    ],
    related: ["py-lists", "py-dicts"],
  },
  "py-lists": {
    badge: "Python",
    title: "Методи списків (list)",
    whatIsIt: "list — впорядкована змінювана колекція елементів будь-якого типу. Має багатий набір вбудованих методів для додавання, видалення, сортування й пошуку елементів.",
    useCases: ["зберігання впорядкованого набору однотипних чи різнотипних даних", "накопичення результатів у циклі", "сортування даних за певним критерієм"],
    syntax: `fruits = ["яблуко", "банан"]\nfruits.append("вишня")\nfruits.sort()`,
    attributes: [
      { name: "append(x) / insert(i, x)", desc: "додають елемент у кінець чи за вказаним індексом" },
      { name: "remove(x) / pop(i)", desc: "remove видаляє перше входження значення, pop — за індексом (типово останній)" },
      { name: "sort() / sorted()", desc: "sort() сортує НА МІСЦІ, sorted() повертає НОВИЙ відсортований список" },
      { name: "reverse()", desc: "розвертає список на місці" },
      { name: "index(x) / count(x)", desc: "повертають позицію першого входження чи кількість входжень значення" },
      { name: "list[i:j]", desc: "зрізи (slicing) — частина списку з індексу i до j (не включно)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">nums = [5, 2, 8, 1, 9]
nums.sort()
print(nums)
print(nums[1:3])
nums.append(100)
print(nums)</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">[1, 2, 5, 8, 9]
[2, 5]
[1, 2, 5, 8, 9, 100]</pre>`,
    pitfalls: [
      "sort() змінює список НА МІСЦІ й повертає None — nums = nums.sort() затре список значенням None.",
      "Копіювання списку через new_list = old_list створює лише ДРУГЕ ІМ'Я для того самого списку — для копії потрібен old_list.copy() чи old_list[:].",
    ],
    related: ["py-comprehensions", "py-sets-tuples"],
  },
  "py-dicts": {
    badge: "Python",
    title: "Методи словників (dict)",
    whatIsIt: "dict — колекція пар ключ-значення, де ключі унікальні. З Python 3.7+ словники зберігають порядок вставки елементів. Один з найважливіших типів даних Python — використовується для представлення JSON-подібних структур.",
    useCases: ["зберігання пов'язаних даних за іменованими ключами (напр. дані користувача)", "підрахунок входжень (частотний словник)", "швидкий пошук значення за ключем"],
    syntax: `user = {"name": "Оля", "age": 25}\nuser["city"] = "Київ"`,
    attributes: [
      { name: "d[key] / d.get(key, default)", desc: "d[key] кидає помилку, якщо ключа немає; get() безпечно повертає default" },
      { name: "keys() / values() / items()", desc: "повертають ключі, значення чи пари (ключ, значення)" },
      { name: "update(other_dict)", desc: "об'єднує інший словник у поточний, перезаписуючи спільні ключі" },
      { name: "pop(key)", desc: "видаляє ключ і повертає його значення" },
      { name: "setdefault(key, default)", desc: "повертає значення ключа, а якщо його немає — встановлює default і повертає його" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">user = {"name": "Оля", "age": 25}
user["city"] = "Київ"

for key, value in user.items():
    print(f"{key}: {value}")

print(user.get("email", "немає email"))</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">name: Оля
age: 25
city: Київ
немає email</pre>`,
    pitfalls: [
      "Звернення до неіснуючого ключа через d[key] кидає KeyError — для безпечного доступу завжди d.get(key, default).",
      "Ключами словника можуть бути лише НЕЗМІНЮВАНІ типи (рядки, числа, кортежі) — список як ключ викличе TypeError.",
    ],
    related: ["py-lists", "py-comprehensions"],
  },

  "py-sets-tuples": {
    badge: "Python",
    title: "set і tuple",
    whatIsIt: "set — колекція УНІКАЛЬНИХ елементів без певного порядку, з методами теоретико-множинних операцій (об'єднання, перетин). tuple — впорядкована НЕЗМІНЮВАНА послідовність, схожа на список, але після створення її не можна змінити.",
    useCases: ["видалення дублікатів зі списку (через set)", "перевірка спільних/унікальних елементів двох колекцій", "незмінювані координати чи пари значень (tuple), напр. (x, y)"],
    syntax: `unique = set([1, 2, 2, 3])\npoint = (10, 20)`,
    attributes: [
      { name: "set(iterable)", desc: "створює множину, прибираючи дублікати" },
      { name: "union() / intersection() / difference()", desc: "об'єднання, перетин, різниця двох множин" },
      { name: "add() / remove()", desc: "додають чи видаляють елемент з множини" },
      { name: "(a, b, c)", desc: "літерал кортежу — круглі дужки (часто опціональні)" },
      { name: "розпакування", desc: "x, y = point — розпаковує кортеж в окремі змінні" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)  # перетин
print(a | b)  # об'єднання

point = (10, 20)
x, y = point
print(f"x={x}, y={y}")</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">{3, 4}
{1, 2, 3, 4, 5, 6}
x=10, y=20</pre>`,
    pitfalls: [
      "Порожній {} створює СЛОВНИК, а не множину — для порожньої множини потрібен явний виклик set().",
      "Спроба змінити елемент tuple (point[0] = 5) — TypeError, кортежі незмінювані.",
      "Множини не зберігають порядок і не підтримують індексацію (set[0] — помилка).",
    ],
    related: ["py-lists", "py-dicts"],
  },
  "py-strings": {
    badge: "Python",
    title: "Методи рядків (str)",
    whatIsIt: "Рядки в Python незмінні (immutable) — усі методи повертають НОВИЙ рядок, не змінюючи оригінал. Багатий набір методів для розбиття, пошуку, заміни й форматування тексту.",
    useCases: ["обробка й очищення користувацького вводу", "розбиття рядка на частини за роздільником", "перевірка формату чи вмісту рядка"],
    syntax: `text = "  Привіт, Світ!  "\ncleaned = text.strip().lower()`,
    attributes: [
      { name: "strip() / lstrip() / rstrip()", desc: "прибирають пробіли з обох країв, зліва чи справа" },
      { name: "split(sep) / join(list)", desc: "split розбиває рядок на список, join об'єднує список у рядок" },
      { name: "lower() / upper() / capitalize()", desc: "змінюють регістр рядка" },
      { name: "replace(old, new)", desc: "замінює всі входження підрядка" },
      { name: "startswith() / endswith()", desc: "перевіряють початок/кінець рядка" },
      { name: "in", desc: "оператор перевірки наявності підрядка: 'кіт' in 'кошеня'" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">text = "html,css,javascript"
langs = text.split(",")
print(langs)
print(", ".join(langs).upper())
print("css" in text)</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">['html', 'css', 'javascript']
HTML, CSS, JAVASCRIPT
True</pre>`,
    pitfalls: [
      "Методи рядків НЕ змінюють оригінал (рядки незмінні) — text.strip() саму text не змінить, треба присвоїти результат.",
      "'5' + 5 кидає TypeError — Python не робить автоматичне зведення типів, як JavaScript; потрібно явно str(5) чи int('5').",
    ],
    related: ["py-fstrings"],
  },
  "py-builtin-functions": {
    badge: "Python",
    title: "Вбудовані функції (len, range, enumerate, zip...)",
    whatIsIt: "Функції, доступні в Python завжди, без import — базовий інструментарій для роботи з довжиною, послідовностями чисел, перебором з індексом, об'єднанням кількох ітерованих об'єктів.",
    useCases: ["отримання довжини колекції", "генерація послідовності чисел для циклу", "перебір з одночасним індексом і значенням", "паралельний перебір двох списків"],
    syntax: `for i, name in enumerate(names):\n    print(i, name)`,
    attributes: [
      { name: "len(x)", desc: "кількість елементів у послідовності чи колекції" },
      { name: "range(start, stop, step)", desc: "генерує послідовність чисел для циклу" },
      { name: "enumerate(iterable)", desc: "додає індекс до кожного елемента при переборі" },
      { name: "zip(a, b)", desc: "об'єднує кілька ітерованих об'єктів попарно" },
      { name: "sorted(iterable, key=...)", desc: "повертає новий відсортований список" },
      { name: "sum() / min() / max()", desc: "сума, мінімум, максимум значень послідовності" },
      { name: "map() / filter()", desc: "застосовують функцію до кожного елемента / лишають елементи за умовою" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">names = ["Оля", "Іван", "Марія"]
ages = [25, 30, 28]

for name, age in zip(names, ages):
    print(f"{name}: {age}")

print(sorted(ages, reverse=True))</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Оля: 25
Іван: 30
Марія: 28
[30, 28, 25]</pre>`,
    pitfalls: [
      "range(5) НЕ включає 5 — генерує 0,1,2,3,4, часте джерело помилок «off by one».",
      "zip() зупиняється на КОРОТШОМУ з переданих ітерованих об'єктів — якщо списки різної довжини, зайві елементи просто відкидаються.",
      "map()/filter() у Python 3 повертають ІТЕРАТОР, а не список — для списку потрібно обгорнути в list(...).",
    ],
    related: ["py-comprehensions", "py-lists"],
  },

  "py-files": {
    badge: "Python",
    title: "Робота з файлами (open, with)",
    whatIsIt: "open() відкриває файл для читання чи запису. Конструкція with автоматично закриває файл після виконання блоку, навіть якщо станеться помилка — надійніший спосіб, ніж вручну викликати close().",
    useCases: ["читання конфігурації чи даних з текстового файлу", "запис результатів роботи скрипта у файл", "обробка CSV чи логів рядок за рядком"],
    syntax: `with open("data.txt", "r") as f:\n    content = f.read()`,
    attributes: [
      { name: "open(path, mode)", desc: "відкриває файл; mode: 'r' читання, 'w' запис (перезаписує), 'a' додавання" },
      { name: "with ... as f:", desc: "гарантує закриття файлу після блоку, навіть при помилці" },
      { name: "read() / readline() / readlines()", desc: "читають увесь файл, один рядок чи всі рядки списком" },
      { name: "write(text)", desc: "записує текст у файл (режим 'w' чи 'a')" },
      { name: "for line in f:", desc: "перебирає файл рядок за рядком — ефективно для великих файлів" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;"># Запис
with open("notes.txt", "w") as f:
    f.write("Перший рядок\\n")
    f.write("Другий рядок")

# Читання
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Перший рядок
Другий рядок</pre>`,
    pitfalls: [
      "open() без with вимагає ручного f.close() — забутий close() лишає файл заблокованим чи дані незбереженими.",
      "Режим 'w' ПОВНІСТЮ ОЧИЩАЄ існуючий файл перед записом — для додавання в кінець потрібен режим 'a'.",
      "Читання дуже великого файлу через read() одразу — займає багато пам'яті; краще перебір по рядках.",
    ],
    related: ["py-exceptions"],
  },
  "py-modules-imports": {
    badge: "Python",
    title: "import, модулі й пакети",
    whatIsIt: "import підключає код з інших файлів (модулів) чи стандартної бібліотеки. Модуль — це просто .py файл, пакет — папка з модулями й файлом __init__.py.",
    useCases: ["підключення стандартної бібліотеки (math, random, datetime)", "розділення великого проєкту на логічні файли", "підключення сторонніх бібліотек, встановлених через pip"],
    syntax: `import math\nfrom datetime import datetime\nfrom mymodule import my_function`,
    attributes: [
      { name: "import module", desc: "підключає весь модуль — звернення через module.function()" },
      { name: "from module import name", desc: "підключає конкретне ім'я — звернення напряму, без префіксу" },
      { name: "import module as alias", desc: "підключає з коротшим псевдонімом, напр. import numpy as np" },
      { name: "from module import *", desc: "підключає ВСЕ з модуля напряму (зазвичай не рекомендується)" },
      { name: "__name__ == '__main__'", desc: "перевіряє, чи файл запущено напряму, а не імпортовано" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">import math
from datetime import datetime

print(math.sqrt(16))
print(datetime.now().year)</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (рік — приклад):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">4.0
2026</pre>`,
    pitfalls: [
      "from module import * забруднює простір імен і ускладнює розуміння, звідки взялась та чи інша назва — краще явний імпорт конкретних імен.",
      "Циклічні імпорти (два модулі імпортують один одного) можуть викликати ImportError.",
    ],
    related: ["py-venv-pip"],
  },
  "py-decorators": {
    badge: "Python",
    title: "Декоратори (@decorator)",
    whatIsIt: "Декоратор — функція, що обгортає іншу функцію/метод, додаючи їй поведінку без зміни її власного коду. Записується через @ перед оголошенням функції.",
    useCases: ["вимірювання часу виконання функції", "логування викликів функції", "кешування результатів (@lru_cache)", "спеціальні методи класу (@property, @staticmethod)"],
    syntax: `def my_decorator(func):\n    def wrapper(*args, **kwargs):\n        print("До виклику")\n        result = func(*args, **kwargs)\n        print("Після виклику")\n        return result\n    return wrapper\n\n@my_decorator\ndef greet():\n    print("Привіт!")`,
    attributes: [
      { name: "@decorator", desc: "застосовує decorator до функції нижче — те саме, що func = decorator(func)" },
      { name: "@property", desc: "робить метод доступним як атрибут (без дужок виклику)" },
      { name: "@staticmethod / @classmethod", desc: "метод без self / метод, що отримує клас замість self" },
      { name: "@functools.lru_cache", desc: "кешує результати функції для однакових аргументів" },
      { name: "*args, **kwargs у wrapper", desc: "дозволяють декоратору працювати з функціями будь-якої сигнатури" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">def loud(func):
    def wrapper(*args):
        print(f"Виклик {func.__name__}")
        return func(*args)
    return wrapper

@loud
def add(a, b):
    return a + b

print(add(2, 3))</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Виклик add
5</pre>`,
    pitfalls: [
      "Декоратор без *args, **kwargs у wrapper не зможе обгорнути функції з іншою кількістю параметрів.",
      "Забутий import functools і @functools.wraps(func) — обгорнута функція втрачає своє ім'я й docstring для інструментів інтроспекції.",
    ],
    related: ["py-classes", "py-functions"],
  },

  "py-type-hints": {
    badge: "Python",
    title: "Підказки типів (type hints)",
    whatIsIt: "Необов'язкові анотації типів для змінних, параметрів і повернених значень функцій. Python НЕ перевіряє їх під час виконання — вони лише документація й підказки для інструментів (mypy, IDE), що ловлять помилки типів ДО запуску коду.",
    useCases: ["документування очікуваних типів параметрів функції", "автодоповнення й підказки в редакторі коду", "ловля помилок типів статичним аналізатором (mypy) до запуску"],
    syntax: `def greet(name: str, age: int = 18) -> str:\n    return f"{name}, {age} років"`,
    attributes: [
      { name: "param: type", desc: "анотація типу параметра функції" },
      { name: "-> type", desc: "анотація типу повернутого значення" },
      { name: "list[int] / dict[str, int]", desc: "типізовані колекції (Python 3.9+)" },
      { name: "Optional[X] / X | None", desc: "значення може бути вказаного типу або None" },
      { name: "Union[X, Y] / X | Y", desc: "значення може бути одним з кількох типів" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">def total_price(items: list[float], discount: float = 0) -> float:
    subtotal = sum(items)
    return subtotal * (1 - discount)

print(total_price([10.0, 20.0, 5.0], discount=0.1))</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">31.5</pre>`,
    pitfalls: [
      "Type hints НЕ примушують правильність типів у рантаймі — total_price('текст') виконається без помилки, доки код не спробує щось з ним зробити.",
      "Для реальної перевірки типів потрібен окремий інструмент (mypy) — самі підказки лише документація без встановленого лінтера.",
    ],
    related: ["py-dataclasses"],
  },
  "py-dataclasses": {
    badge: "Python",
    title: "@dataclass",
    whatIsIt: "Декоратор, що автоматично генерує __init__, __repr__ і __eq__ для класів, які переважно зберігають дані — економить написання шаблонного коду порівняно зі звичайним класом.",
    useCases: ["класи-контейнери для структурованих даних (напр. координати, налаштування)", "заміна звичайних класів, де потрібні лише поля без складної логіки"],
    syntax: `from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int`,
    attributes: [
      { name: "@dataclass", desc: "автоматично генерує __init__, __repr__, __eq__ на основі анотацій полів" },
      { name: "поле: тип = значення", desc: "оголошення поля з опціональним значенням за замовчуванням" },
      { name: "@dataclass(frozen=True)", desc: "робить екземпляри незмінюваними (як tuple)" },
      { name: "field(default_factory=list)", desc: "безпечне значення за замовчуванням для змінюваних типів (список, словник)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p1 = Point(10, 20)
p2 = Point(10, 20)
print(p1)
print(p1 == p2)</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Point(x=10, y=20)
True</pre>`,
    pitfalls: [
      "Звичайний клас порівнює об'єкти за ІДЕНТИЧНІСТЮ (той самий об'єкт у пам'яті), dataclass — за ЗНАЧЕННЯМИ полів — це і є головна перевага для порівняння двох 'однакових' об'єктів.",
      "Змінюваний тип (list) як значення за замовчуванням напряму (items: list = []) — помилка, потрібен field(default_factory=list).",
    ],
    related: ["py-classes", "py-type-hints"],
  },
  "py-async": {
    badge: "Python",
    title: "async/await, asyncio",
    whatIsIt: "Асинхронне програмування дозволяє виконувати багато операцій вводу-виводу (мережеві запити, читання файлів) паралельно в одному потоці, не блокуючи виконання, поки чекаємо відповіді. async визначає корутину, await очікує її завершення.",
    useCases: ["одночасне виконання багатьох мережевих запитів без блокування", "веб-сервери, що обробляють багато з'єднань одночасно (FastAPI)", "операції, де більшість часу йде на очікування (I/O-bound задачі)"],
    syntax: `import asyncio\n\nasync def fetch_data():\n    await asyncio.sleep(1)\n    return "Дані"\n\nasyncio.run(fetch_data())`,
    attributes: [
      { name: "async def", desc: "оголошує корутину — функцію, що можна призупиняти" },
      { name: "await", desc: "очікує завершення асинхронної операції, не блокуючи інші задачі" },
      { name: "asyncio.run(coro)", desc: "запускає корутину як точку входу в асинхронний код" },
      { name: "asyncio.gather(*coros)", desc: "виконує кілька корутин ПАРАЛЕЛЬНО, чекає на всі" },
      { name: "asyncio.sleep(sec)", desc: "неблокуюча затримка (на відміну від time.sleep)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">import asyncio

async def download(name, delay):
    await asyncio.sleep(delay)
    print(f"{name} завантажено")

async def main():
    await asyncio.gather(
        download("Файл 1", 1),
        download("Файл 2", 0.5)
    )

asyncio.run(main())</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (Файл 2 швидший, тому перший):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Файл 2 завантажено
Файл 1 завантажено</pre>`,
    pitfalls: [
      "await поза async def — SyntaxError; асинхронний код можна викликати лише з іншого асинхронного контексту чи через asyncio.run().",
      "asyncio не дає справжнього паралелізму для CPU-інтенсивних задач (обчислення) — лише для I/O-очікування; для CPU-задач потрібні процеси (multiprocessing).",
      "Послідовні await замість asyncio.gather() виконуються ПО ЧЕРЗІ, а не одночасно — втрачається сенс асинхронності.",
    ],
    related: ["js-async-await"],
  },

  "py-stdlib-collections": {
    badge: "Python",
    title: "collections: Counter, defaultdict, deque",
    whatIsIt: "Модуль collections надає спеціалізовані контейнери, що розширюють можливості звичайних list/dict: Counter рахує входження елементів, defaultdict автоматично створює значення за замовчуванням для нових ключів, deque — ефективна черга з обох кінців.",
    useCases: ["підрахунок частоти слів чи елементів у тексті (Counter)", "групування даних без перевірки наявності ключа (defaultdict)", "черга з ефективним додаванням/видаленням з обох кінців (deque)"],
    syntax: `from collections import Counter\nCounter(["a", "b", "a", "c", "a"])`,
    attributes: [
      { name: "Counter(iterable)", desc: "рахує входження кожного елемента, .most_common(n) — топ-N найчастіших" },
      { name: "defaultdict(list)", desc: "словник, що автоматично створює порожній список для нового ключа замість KeyError" },
      { name: "deque", desc: "двостороння черга — appendleft()/popleft() ефективні на відміну від звичайного списку" },
      { name: "namedtuple", desc: "легкий незмінюваний клас-контейнер із іменованими полями" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">from collections import Counter

words = "кіт собака кіт папуга кіт собака".split()
counts = Counter(words)
print(counts.most_common(2))</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">[('кіт', 3), ('собака', 2)]</pre>`,
    pitfalls: [
      "Спроба звернутись до неіснуючого ключа звичайного dict кидає KeyError — саме цю проблему вирішує defaultdict, автоматично створюючи значення.",
      "deque ефективний для операцій з КІНЦІВ, але не для довільного доступу за індексом посередині — для цього звичайний список швидший.",
    ],
    related: ["py-dicts", "py-stdlib-itertools-functools"],
  },
  "py-stdlib-itertools-functools": {
    badge: "Python",
    title: "itertools і functools",
    whatIsIt: "itertools надає ефективні інструменти для роботи з ітераціями — комбінації, перестановки, нескінченні послідовності. functools — функціональні інструменти: reduce (згортка), lru_cache (кешування), partial (часткове застосування аргументів).",
    useCases: ["генерація всіх комбінацій/перестановок елементів", "згортання списку в одне значення (аналог reduce в JS)", "кешування результатів «важкої» функції для повторних викликів з тими самими аргументами"],
    syntax: `from itertools import combinations\nfrom functools import reduce, lru_cache`,
    attributes: [
      { name: "itertools.combinations(iterable, r)", desc: "усі комбінації по r елементів, без урахування порядку" },
      { name: "itertools.permutations(iterable)", desc: "усі перестановки елементів" },
      { name: "itertools.chain(a, b)", desc: "об'єднує кілька ітерованих об'єктів в один потік" },
      { name: "functools.reduce(fn, iterable)", desc: "згортає послідовність в одне значення через послідовне застосування fn" },
      { name: "@functools.lru_cache", desc: "кешує результати функції — повторний виклик з тими самими аргументами миттєвий" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">from functools import reduce
from itertools import combinations

nums = [1, 2, 3, 4]
total = reduce(lambda a, b: a + b, nums)
print(total)

pairs = list(combinations([1, 2, 3], 2))
print(pairs)</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">10
[(1, 2), (1, 3), (2, 3)]</pre>`,
    pitfalls: [
      "Функції itertools повертають ІТЕРАТОРИ, а не списки — для списку потрібно обгорнути в list(...), і перебрати їх можна лише ОДИН раз.",
      "reduce() без початкового значення на порожній послідовності кидає TypeError.",
    ],
    related: ["py-stdlib-collections", "py-comprehensions"],
  },
  "py-stdlib-datetime": {
    badge: "Python",
    title: "datetime",
    whatIsIt: "Модуль datetime для роботи з датою й часом — створення, форматування, обчислення різниці між датами. datetime.now() повертає поточну дату/час, timedelta представляє проміжок часу.",
    useCases: ["показ поточної дати/часу", "обчислення кількості днів між двома датами", "форматування дати у зручний для читання вигляд"],
    syntax: `from datetime import datetime, timedelta\nnow = datetime.now()`,
    attributes: [
      { name: "datetime.now()", desc: "повертає поточну дату й час" },
      { name: "strftime(format)", desc: "форматує дату в рядок за шаблоном, напр. '%d.%m.%Y'" },
      { name: "strptime(text, format)", desc: "розбирає рядок у дату за шаблоном (зворотне до strftime)" },
      { name: "timedelta(days=7)", desc: "представляє проміжок часу — можна додавати/віднімати від дат" },
      { name: "date() / time()", desc: "лише дата чи лише час без другої частини" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">from datetime import datetime, timedelta

now = datetime(2024, 3, 15)
formatted = now.strftime("%d.%m.%Y")
next_week = now + timedelta(days=7)

print(formatted)
print(next_week.strftime("%d.%m.%Y"))</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">15.03.2024
22.03.2024</pre>`,
    pitfalls: [
      "datetime.now() не враховує часовий пояс за замовчуванням («наївний» об'єкт) — для проєктів з кількома часовими поясами потрібен datetime.now(timezone.utc).",
      "Віднімання двох datetime дає timedelta, а не кількість днів напряму — потрібно .days для отримання числа.",
    ],
    related: [],
  },

  "py-stdlib-os-sys": {
    badge: "Python",
    title: "os, sys, pathlib",
    whatIsIt: "os надає взаємодію з операційною системою — файли, директорії, змінні середовища. sys — доступ до параметрів інтерпретатора (аргументи командного рядка, версія). pathlib — сучасний об'єктний спосіб роботи зі шляхами файлової системи.",
    useCases: ["читання списку файлів у директорії", "читання аргументів, переданих скрипту з командного рядка", "побудова кросплатформних шляхів до файлів"],
    syntax: `import os\nfrom pathlib import Path\nos.listdir(".")`,
    attributes: [
      { name: "os.listdir(path)", desc: "повертає список файлів/папок у вказаній директорії" },
      { name: "os.path.join(a, b)", desc: "коректно з'єднує частини шляху для будь-якої ОС" },
      { name: "os.environ", desc: "словник змінних середовища" },
      { name: "sys.argv", desc: "список аргументів, переданих скрипту з командного рядка" },
      { name: "Path(path)", desc: "об'єктний спосіб роботи зі шляхом — .exists(), .name, / для з'єднання" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">from pathlib import Path

p = Path("data") / "users.json"
print(p)
print(p.suffix)
print(p.parent)</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">data/users.json
.json
data</pre>`,
    pitfalls: [
      "Ручне з'єднання шляхів через + \"/\" замість os.path.join() чи Path — ламається на Windows, де роздільник інший (\\).",
      "os.environ['KEY'] кидає помилку, якщо змінної немає — безпечніше os.environ.get('KEY', 'default').",
    ],
    related: ["py-files"],
  },
  "py-stdlib-json-csv": {
    badge: "Python",
    title: "json і csv",
    whatIsIt: "Модуль json перетворює між Python-об'єктами й JSON-рядками — для роботи з API чи конфігураційними файлами. csv читає й записує табличні дані у форматі CSV (значення через кому).",
    useCases: ["читання відповіді API у форматі JSON", "збереження даних застосунку у файл і назад", "імпорт/експорт табличних даних (напр. з Excel)"],
    syntax: `import json\ndata = json.loads('{"name": "Оля"}')\njson.dumps(data)`,
    attributes: [
      { name: "json.loads(text)", desc: "розбирає JSON-рядок у Python-об'єкт (dict/list)" },
      { name: "json.dumps(obj)", desc: "перетворює Python-об'єкт на JSON-рядок" },
      { name: "json.load(file) / json.dump(obj, file)", desc: "ті самі операції, але напряму з файлом" },
      { name: "csv.reader(file)", desc: "читає CSV-файл рядок за рядком як списки" },
      { name: "csv.DictReader(file)", desc: "читає CSV, де кожен рядок — словник з іменами колонок як ключами" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">import json

data = {"name": "Оля", "age": 25, "langs": ["Python", "SQL"]}
json_text = json.dumps(data, ensure_ascii=False)
print(json_text)

parsed = json.loads(json_text)
print(parsed["langs"][0])</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">{"name": "Оля", "age": 25, "langs": ["Python", "SQL"]}
Python</pre>`,
    pitfalls: [
      "Забутий ensure_ascii=False — кирилиця перетворюється на \\uXXXX escape-послідовності замість читабельного тексту.",
      "json.loads() кидає JSONDecodeError на невалідному JSON — обгортай у try/except при розборі зовнішніх даних.",
    ],
    related: ["py-files"],
  },
  "py-stdlib-re": {
    badge: "Python",
    title: "re (регулярні вирази)",
    whatIsIt: "Модуль re для пошуку, перевірки й заміни тексту за шаблоном — потужніший за прості string-методи для складних правил (email, телефони, витягування частин тексту).",
    useCases: ["перевірка формату введених даних (email, телефон)", "витягування конкретних частин тексту за шаблоном", "масова заміна тексту за складним правилом"],
    syntax: `import re\nre.findall(r"\\d+", "є 5 котів і 3 собаки")`,
    attributes: [
      { name: "re.match() / re.search()", desc: "match перевіряє з ПОЧАТКУ рядка, search шукає ДЕ ЗАВГОДНО в рядку" },
      { name: "re.findall(pattern, text)", desc: "повертає список УСІХ знайдених збігів" },
      { name: "re.sub(pattern, repl, text)", desc: "замінює всі знайдені збіги на repl" },
      { name: "re.compile(pattern)", desc: "заздалегідь компілює шаблон для повторного використання (швидше)" },
      { name: "\\\\d \\\\w \\\\s", desc: "цифра, буква/цифра/підкреслення, пробільний символ" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">import re

text = "Зв'яжіться: oksana@example.com або ivan@test.ua"
emails = re.findall(r"[\\w.]+@[\\w.]+", text)
print(emails)</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">['oksana@example.com', 'ivan@test.ua']</pre>`,
    pitfalls: [
      "Рядок шаблону БЕЗ префікса r (raw string) — зворотні слеші можуть інтерпретуватись як escape-послідовності Python, а не regex; завжди пиши r\"pattern\".",
      "re.match() перевіряє лише ПОЧАТОК рядка — для пошуку будь-де в тексті потрібен re.search().",
    ],
    related: ["py-strings"],
  },
  "py-stdlib-math-random": {
    badge: "Python",
    title: "math і random",
    whatIsIt: "math надає математичні функції — корінь, тригонометрія, логарифми, константи (pi, e). random генерує випадкові числа, обирає випадковий елемент чи перемішує список.",
    useCases: ["обчислення квадратного кореня, степеня, тригонометричних функцій", "випадковий вибір елемента чи число для гри", "перемішування списку (напр. питань у тесті)"],
    syntax: `import math, random\nmath.sqrt(16)\nrandom.choice(["орел", "решка"])`,
    attributes: [
      { name: "math.sqrt() / math.pow()", desc: "квадратний корінь, піднесення до степеня" },
      { name: "math.ceil() / math.floor()", desc: "округлення вгору/вниз до цілого" },
      { name: "math.pi / math.e", desc: "математичні константи" },
      { name: "random.randint(a, b)", desc: "випадкове ціле число від a до b ВКЛЮЧНО" },
      { name: "random.choice(seq)", desc: "випадковий елемент з послідовності" },
      { name: "random.shuffle(list)", desc: "перемішує список НА МІСЦІ" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">import math, random

print(math.sqrt(144))
print(round(math.pi, 2))

options = ["А", "Б", "В"]
random.shuffle(options)
print(options)  # порядок буде випадковим</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (порядок варіантів випадковий):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">12.0
3.14
['Б', 'А', 'В']</pre>`,
    pitfalls: [
      "random.randint(a, b) включає ОБИДВА краї діапазону, на відміну від range(), де кінець не включений — часта плутанина.",
      "math.sqrt() кидає ValueError для від'ємних чисел — для комплексних результатів потрібен модуль cmath.",
    ],
    related: [],
  },

  "py-testing": {
    badge: "Python",
    title: "unittest і pytest",
    whatIsIt: "Автоматизовані тести перевіряють, що код працює правильно, без ручної перевірки щоразу. unittest — вбудований у Python модуль тестування, pytest — популярніша стороння бібліотека з простішим синтаксисом.",
    useCases: ["перевірка, що функція повертає правильний результат для різних вхідних даних", "запобігання регресіям при зміні коду", "документування очікуваної поведінки через тести"],
    syntax: `def test_sum():\n    assert sum([1, 2, 3]) == 6`,
    attributes: [
      { name: "assert умова", desc: "кидає AssertionError, якщо умова хибна — основа pytest-тестів" },
      { name: "def test_*():", desc: "pytest автоматично знаходить функції, що починаються з test_" },
      { name: "unittest.TestCase", desc: "базовий клас для тестів у вбудованому unittest" },
      { name: "self.assertEqual(a, b)", desc: "метод unittest для перевірки рівності" },
      { name: "@pytest.fixture", desc: "готує повторювані дані/об'єкти для кількох тестів" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">def add(a, b):
    return a + b

def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2

# Запуск: pytest test_file.py</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання pytest:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">test_file.py::test_add_positive PASSED
test_file.py::test_add_negative PASSED
2 passed in 0.01s</pre>`,
    pitfalls: [
      "Тести без перевірки граничних випадків (порожній список, від'ємні числа, None) — найпоширеніша прогалина в покритті.",
      "Тест, що залежить від порядку виконання інших тестів — крихкий, тести мають бути незалежними один від одного.",
    ],
    related: ["py-functions"],
  },
  "py-web-frameworks": {
    badge: "Python",
    title: "Flask, Django, FastAPI",
    whatIsIt: "Веб-фреймворки для створення бекенду на Python. Flask — мінімалістичний, для швидкого старту. Django — повноцінний «з батарейками» (ORM, адмінка, автентифікація з коробки). FastAPI — сучасний асинхронний з автоматичною документацією API.",
    useCases: ["Flask — маленькі API чи прототипи", "Django — великі застосунки з адмінкою й складною бізнес-логікою", "FastAPI — швидкі, добре задокументовані REST API з валідацією даних"],
    syntax: `from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/users")\nasync def get_users():\n    return {"users": []}`,
    attributes: [
      { name: "@app.route() (Flask)", desc: "реєструє обробник для вказаного URL" },
      { name: "@app.get() / @app.post() (FastAPI)", desc: "реєструють обробники для конкретних HTTP-методів" },
      { name: "models.py, views.py (Django)", desc: "типова структура Django-застосунку: моделі даних і обробники запитів" },
      { name: "BaseModel (FastAPI/Pydantic)", desc: "автоматична валідація й серіалізація даних запиту" },
      { name: "manage.py runserver (Django)", desc: "запускає локальний сервер розробки Django" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">from fastapi import FastAPI

app = FastAPI()

@app.get("/hello/{name}")
async def hello(name: str):
    return {"message": f"Привіт, {name}!"}

# GET /hello/Оля → {"message": "Привіт, Оля!"}</pre>`,
    pitfalls: [
      "Django ORM-запити в циклі без select_related/prefetch_related — проблема N+1 запитів, сильно сповільнює застосунок.",
      "Flask сам по собі не має вбудованої структури для великих проєктів — на відміну від Django, організацію коду треба продумувати самостійно.",
    ],
    related: ["py-async", "sql-select"],
  },
  "py-venv-pip": {
    badge: "Python",
    title: "venv, pip, requirements.txt",
    whatIsIt: "venv створює ізольоване віртуальне середовище для проєкту — власні залежності, що не конфліктують з іншими проєктами чи системним Python. pip встановлює пакети з PyPI. requirements.txt фіксує список залежностей проєкту.",
    useCases: ["ізоляція залежностей одного проєкту від інших", "встановлення сторонніх бібліотек (requests, pandas, Django)", "відтворення точного середовища на іншому комп'ютері чи сервері"],
    syntax: `python -m venv venv\nsource venv/bin/activate\npip install requests`,
    attributes: [
      { name: "python -m venv venv", desc: "створює нове віртуальне середовище в папці venv" },
      { name: "source venv/bin/activate", desc: "активує середовище (Windows: venv\\\\Scripts\\\\activate)" },
      { name: "pip install package", desc: "встановлює пакет з PyPI у поточне активне середовище" },
      { name: "pip freeze > requirements.txt", desc: "зберігає список усіх встановлених пакетів з версіями" },
      { name: "pip install -r requirements.txt", desc: "встановлює всі залежності зі списку одразу" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;"># requirements.txt
flask==3.0.0
requests==2.31.0

# Встановлення всіх залежностей одразу:
# pip install -r requirements.txt</pre>`,
    pitfalls: [
      "Встановлення пакетів БЕЗ активованого venv — потрапляють у глобальний Python, конфліктуючи між проєктами.",
      "Забутий requirements.txt чи pyproject.toml — інший розробник (чи сервер) не зможе відтворити точне середовище.",
      "Комітити саму папку venv/ у git — величезна й непотрібна; лише requirements.txt має бути в репозиторії.",
    ],
    related: ["py-modules-imports"],
  },
  "py-sqlite": {
    badge: "Python",
    title: "sqlite3",
    whatIsIt: "Вбудований модуль для роботи з SQLite — файловою базою даних, що не потребує окремого сервера. Ідеально для невеликих проєктів, прототипів і локального зберігання даних.",
    useCases: ["локальне зберігання даних застосунку без встановлення сервера БД", "прототипування перед переходом на «дорослу» БД (PostgreSQL)", "аналіз даних у скриптах без зовнішніх залежностей"],
    syntax: `import sqlite3\nconn = sqlite3.connect("app.db")\ncursor = conn.cursor()`,
    attributes: [
      { name: "sqlite3.connect(path)", desc: "відкриває (чи створює) файл бази даних" },
      { name: "cursor.execute(sql)", desc: "виконує SQL-запит" },
      { name: "cursor.fetchall() / fetchone()", desc: "повертають усі рядки результату чи лише один" },
      { name: "conn.commit()", desc: "зберігає зміни (INSERT/UPDATE/DELETE) у базі" },
      { name: "? як плейсхолдер", desc: "безпечна підстановка значень у запит, захищає від SQL-ін'єкцій" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">import sqlite3

conn = sqlite3.connect(":memory:")  # тимчасова БД у пам'яті
cur = conn.cursor()
cur.execute("CREATE TABLE users (id INTEGER, name TEXT)")
cur.execute("INSERT INTO users VALUES (?, ?)", (1, "Оля"))
conn.commit()

cur.execute("SELECT * FROM users")
print(cur.fetchall())</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">[(1, 'Оля')]</pre>`,
    pitfalls: [
      "Вставка значень через f-рядок напряму в SQL (f\"INSERT ... VALUES ({name})\") замість плейсхолдера ? — серйозна вразливість SQL-ін'єкції.",
      "Забутий conn.commit() — зміни (INSERT/UPDATE) виконуються, але не зберігаються в файл бази.",
      "SQLite не підходить для високого навантаження з багатьма одночасними записами — для цього потрібна повноцінна СУБД (PostgreSQL/MySQL).",
    ],
    related: ["sql-select", "py-files"],
  },

  "sql-joins": {
    badge: "SQL",
    title: "INNER, LEFT, RIGHT, FULL, CROSS JOIN",
    whatIsIt: "JOIN об'єднує рядки з двох чи більше таблиць за спільним ключем. Різні типи JOIN визначають, які рядки лишаються в результаті, якщо відповідності немає в одній з таблиць.",
    useCases: ["показ замовлень разом з ім'ям клієнта (з іншої таблиці)", "показ УСІХ клієнтів, включно з тими, хто ще не зробив замовлення (LEFT JOIN)", "об'єднання кожного рядка з кожним для комбінацій (CROSS JOIN)"],
    syntax: `SELECT users.name, orders.total\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id;`,
    attributes: [
      { name: "INNER JOIN", desc: "лише рядки, що мають відповідність В ОБОХ таблицях" },
      { name: "LEFT JOIN", desc: "усі рядки лівої таблиці, навіть без відповідності (NULL замість даних з правої)" },
      { name: "RIGHT JOIN", desc: "усі рядки правої таблиці, навіть без відповідності зліва" },
      { name: "FULL JOIN", desc: "усі рядки з ОБОХ таблиць, з NULL там, де немає відповідності" },
      { name: "CROSS JOIN", desc: "декартів добуток — кожен рядок однієї таблиці з кожним рядком іншої" },
      { name: "ON умова", desc: "задає, за якою колонкою пов'язуються таблиці" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (Марія ще не робила замовлень):</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">name</th><th style="border:1px solid #ccc;padding:4px 10px;">total</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Оля</td><td style="border:1px solid #ccc;padding:4px 10px;">450</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Іван</td><td style="border:1px solid #ccc;padding:4px 10px;">1200</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Марія</td><td style="border:1px solid #ccc;padding:4px 10px;">NULL</td></tr>
</table>`,
    pitfalls: [
      "INNER JOIN замість LEFT JOIN, коли потрібні ВСІ рядки лівої таблиці — рядки без відповідності просто зникають з результату.",
      "Забута умова ON — випадковий CROSS JOIN (декартів добуток) з величезною кількістю рядків результату.",
      "JOIN за колонкою без індексу на великих таблицях — суттєво сповільнює запит.",
    ],
    related: ["sql-select-where"],
  },
  "sql-set-operators": {
    badge: "SQL",
    title: "UNION, INTERSECT, EXCEPT",
    whatIsIt: "Об'єднують результати ДВОХ ОКРЕМИХ запитів (з однаковою кількістю й типами колонок) в один результат — за принципом теорії множин: об'єднання, перетин, різниця.",
    useCases: ["об'єднання даних з двох схожих таблиць (напр. архівних і поточних замовлень)", "знаходження спільних записів у двох вибірках", "знаходження записів, що є в одній вибірці, але відсутні в іншій"],
    syntax: `SELECT city FROM customers\nUNION\nSELECT city FROM suppliers;`,
    attributes: [
      { name: "UNION", desc: "об'єднує результати двох запитів, прибираючи дублікати" },
      { name: "UNION ALL", desc: "те саме, але БЕЗ прибирання дублікатів — швидше" },
      { name: "INTERSECT", desc: "лише рядки, що є в ОБОХ результатах одночасно" },
      { name: "EXCEPT", desc: "рядки з першого запиту, яких НЕМАЄ в другому" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT city FROM customers
INTERSECT
SELECT city FROM suppliers;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (міста, де є і клієнти, і постачальники):</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">city</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Київ</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Одеса</td></tr>
</table>`,
    pitfalls: [
      "Кількість і ТИПИ колонок в обох запитах мають ЗБІГАТИСЯ — інакше помилка.",
      "UNION (не ALL) прибирає дублікати, що вимагає додаткового сортування/порівняння — на великих даних UNION ALL значно швидший, якщо дублікати не проблема.",
    ],
    related: ["sql-joins"],
  },
  "sql-cte": {
    badge: "SQL",
    title: "WITH (Common Table Expression)",
    whatIsIt: "CTE — іменований тимчасовий результат запиту, що існує лише в межах одного запиту. Дозволяє розбити складний запит на читабельні логічні частини, кожна з яких може посилатись на попередню.",
    useCases: ["розбиття складного запиту на кілька читабельних кроків", "перевикористання одного підзапиту кілька разів в основному запиті", "рекурсивні запити (напр. ієрархія категорій)"],
    syntax: `WITH recent_orders AS (\n  SELECT * FROM orders WHERE created_at > '2024-01-01'\n)\nSELECT * FROM recent_orders WHERE total > 100;`,
    attributes: [
      { name: "WITH name AS (запит)", desc: "оголошує іменований тимчасовий результат" },
      { name: "WITH RECURSIVE", desc: "дозволяє CTE посилатись на саму себе — для ієрархічних даних (дерева, графи)" },
      { name: "кілька CTE через кому", desc: "можна оголосити декілька CTE в одному WITH, розділених комою" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">WITH big_orders AS (
  SELECT user_id, total
  FROM orders
  WHERE total > 500
)
SELECT users.name, big_orders.total
FROM users
JOIN big_orders ON users.id = big_orders.user_id;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">name</th><th style="border:1px solid #ccc;padding:4px 10px;">total</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Іван</td><td style="border:1px solid #ccc;padding:4px 10px;">1200</td></tr>
</table>`,
    pitfalls: [
      "CTE в більшості СУБД не кешується автоматично — якщо запит важкий і використовується кілька разів, іноді ефективніша тимчасова таблиця.",
      "WITH RECURSIVE без умови зупинки (WHERE, що обмежує глибину) може призвести до нескінченного циклу.",
    ],
    related: ["sql-select-where", "sql-window-functions"],
  },
  "sql-insert-update-delete": {
    badge: "SQL",
    title: "INSERT, UPDATE, DELETE",
    whatIsIt: "Команди для зміни даних у таблиці. INSERT додає нові рядки, UPDATE змінює існуючі, DELETE видаляє. Усі, крім INSERT, зазвичай потребують WHERE — без нього зміна застосується до ВСІХ рядків таблиці.",
    useCases: ["додавання нового користувача чи замовлення", "оновлення статусу замовлення після оплати", "видалення застарілих чи тестових записів"],
    syntax: `INSERT INTO users (name, age) VALUES ('Оля', 25);\nUPDATE users SET age = 26 WHERE id = 1;\nDELETE FROM users WHERE id = 1;`,
    attributes: [
      { name: "INSERT INTO table (cols) VALUES (...)", desc: "додає новий рядок з указаними значеннями" },
      { name: "UPDATE table SET col = value WHERE ...", desc: "оновлює колонки рядків, що відповідають умові" },
      { name: "DELETE FROM table WHERE ...", desc: "видаляє рядки, що відповідають умові" },
      { name: "RETURNING *", desc: "повертає змінені/вставлені/видалені рядки одразу (PostgreSQL)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">UPDATE users
SET age = age + 1
WHERE name = 'Оля'
RETURNING name, age;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">name</th><th style="border:1px solid #ccc;padding:4px 10px;">age</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Оля</td><td style="border:1px solid #ccc;padding:4px 10px;">26</td></tr>
</table>
<p style="font-size:12px;color:#ef4444;margin-top:6px;">1 row updated</p>`,
    pitfalls: [
      "UPDATE чи DELETE БЕЗ WHERE застосовується до ВСІХ рядків таблиці — одна з найнебезпечніших помилок у SQL, завжди перевіряй WHERE перед виконанням.",
      "INSERT без переліку колонок покладається на порядок стовпців таблиці — крихко, якщо структура таблиці зміниться.",
      "Немає «скасувати» після COMMIT — важливі зміни варто робити всередині транзакції з можливістю ROLLBACK.",
    ],
    related: ["sql-select-where", "sql-transactions"],
  },
  "sql-create-alter-table": {
    badge: "SQL",
    title: "CREATE TABLE, ALTER TABLE, DROP",
    whatIsIt: "CREATE TABLE створює нову таблицю з описом колонок і їх типів. ALTER TABLE змінює структуру існуючої таблиці — додає, видаляє чи змінює колонки. DROP видаляє таблицю повністю.",
    useCases: ["створення нової таблиці для нової сутності проєкту", "додавання нової колонки до існуючої таблиці", "видалення застарілої таблиці чи колонки"],
    syntax: `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL\n);\nALTER TABLE users ADD COLUMN email TEXT;`,
    attributes: [
      { name: "CREATE TABLE name (...)", desc: "створює таблицю з описом колонок і обмежень" },
      { name: "ALTER TABLE ... ADD COLUMN", desc: "додає нову колонку до існуючої таблиці" },
      { name: "ALTER TABLE ... DROP COLUMN", desc: "видаляє колонку" },
      { name: "ALTER TABLE ... RENAME TO", desc: "перейменовує таблицю" },
      { name: "DROP TABLE", desc: "видаляє таблицю ПОВНІСТЮ разом з даними" },
      { name: "TRUNCATE TABLE", desc: "очищає всі дані таблиці, лишаючи структуру" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2)
);

ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT true;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат: таблиця products створена з 4 колонками (id, name, price, in_stock)</p>`,
    pitfalls: [
      "DROP TABLE видаляє дані НЕЗВОРОТНО без підтвердження — завжди перевіряй назву таблиці двічі.",
      "ALTER TABLE на великій таблиці в продакшені може заблокувати її на час виконання — плануй такі зміни на період низького навантаження.",
    ],
    related: ["sql-constraints", "sql-data-types"],
  },
  "sql-constraints": {
    badge: "SQL",
    title: "PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK",
    whatIsIt: "Обмеження (constraints) гарантують цілісність даних на рівні бази даних — заборонена вставка некоректних значень, навіть якщо застосунок «забув» перевірити щось самостійно.",
    useCases: ["унікальний ідентифікатор рядка (PRIMARY KEY)", "зв'язок між таблицями зі збереженням цілісності (FOREIGN KEY)", "заборона дублікатів email (UNIQUE)", "обов'язкове поле (NOT NULL)"],
    syntax: `CREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  total NUMERIC CHECK (total >= 0)\n);`,
    attributes: [
      { name: "PRIMARY KEY", desc: "унікальний ідентифікатор рядка, автоматично індексується" },
      { name: "FOREIGN KEY / REFERENCES", desc: "забезпечує, що значення посилається на існуючий рядок іншої таблиці" },
      { name: "UNIQUE", desc: "забороняє дублікати значень у колонці" },
      { name: "NOT NULL", desc: "забороняє порожні (NULL) значення" },
      { name: "CHECK (умова)", desc: "обмежує допустимі значення власною умовою" },
      { name: "DEFAULT значення", desc: "значення за замовчуванням, якщо не вказано при вставці" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 0)
);

INSERT INTO users (email, age) VALUES ('a@test.com', -5);
-- ПОМИЛКА: new row violates check constraint</pre>`,
    pitfalls: [
      "Забуті constraints і покладання лише на перевірку в коді застосунку — некоректні дані можуть потрапити напряму через інший сервіс чи ручний запит.",
      "FOREIGN KEY без визначеної поведінки ON DELETE (CASCADE/SET NULL/RESTRICT) — видалення батьківського рядка може несподівано впасти з помилкою.",
    ],
    related: ["sql-create-alter-table"],
  },
  "sql-index-views": {
    badge: "SQL",
    title: "INDEX, VIEW",
    whatIsIt: "INDEX — окрема структура даних, що прискорює пошук рядків за колонкою (як зміст у книзі). VIEW — збережений запит, що поводиться як віртуальна таблиця: спрощує повторне використання складної логіки вибірки.",
    useCases: ["прискорення пошуку за колонкою, яку часто фільтрують (WHERE, JOIN)", "приховування складного запиту за простою назвою (VIEW)", "обмеження доступу користувача лише до певних колонок через VIEW"],
    syntax: `CREATE INDEX idx_users_email ON users(email);\nCREATE VIEW active_users AS\n  SELECT * FROM users WHERE is_active = true;`,
    attributes: [
      { name: "CREATE INDEX name ON table(col)", desc: "створює індекс для прискорення пошуку за колонкою" },
      { name: "CREATE UNIQUE INDEX", desc: "індекс, що також забороняє дублікати значень" },
      { name: "CREATE VIEW name AS SELECT ...", desc: "зберігає запит під іменем, яке можна використовувати як таблицю" },
      { name: "DROP INDEX / DROP VIEW", desc: "видаляють індекс чи представлення" },
      { name: "EXPLAIN ANALYZE", desc: "показує, чи використовується індекс у конкретному запиті" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">CREATE VIEW big_spenders AS
  SELECT name, SUM(total) as spent
  FROM orders JOIN users ON orders.user_id = users.id
  GROUP BY name
  HAVING SUM(total) > 1000;

SELECT * FROM big_spenders;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">name</th><th style="border:1px solid #ccc;padding:4px 10px;">spent</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Іван</td><td style="border:1px solid #ccc;padding:4px 10px;">1200</td></tr>
</table>`,
    pitfalls: [
      "Індекси на КОЖНІЙ колонці уповільнюють INSERT/UPDATE/DELETE — кожна зміна даних оновлює всі індекси; додавай лише за потреби.",
      "VIEW не зберігає дані фізично (окрім MATERIALIZED VIEW) — кожен запит до неї виконує оригінальний запит заново.",
    ],
    related: ["sql-select-where", "sql-aggregation-grouping"],
  },
  "sql-transactions": {
    badge: "SQL",
    title: "BEGIN, COMMIT, ROLLBACK",
    whatIsIt: "Транзакція групує кілька операцій в одну атомарну одиницю — вони АБО всі виконуються успішно (COMMIT), АБО жодна (ROLLBACK). Критично важливо для операцій, де проміжний збій не має лишити дані в суперечливому стані.",
    useCases: ["переказ грошей між рахунками (списання + зарахування мають статись разом)", "скасування змін при помилці посеред серії операцій", "групування кількох INSERT/UPDATE в одну логічну одиницю"],
    syntax: `BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;`,
    attributes: [
      { name: "BEGIN / START TRANSACTION", desc: "починає транзакцію" },
      { name: "COMMIT", desc: "зберігає всі зміни транзакції назавжди" },
      { name: "ROLLBACK", desc: "скасовує всі зміни від початку транзакції" },
      { name: "SAVEPOINT", desc: "проміжна точка, до якої можна відкотитись частково, не скасовуючи всю транзакцію" },
      { name: "ACID", desc: "властивості надійних транзакцій: атомарність, узгодженість, ізольованість, тривкість" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- перевірка: якщо баланс від'ємний — скасувати
ROLLBACK; -- або COMMIT;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (ROLLBACK):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">ROLLBACK
Жодна зі змін не застосована — баланси лишились попередніми</pre>`,
    pitfalls: [
      "Довгі відкриті транзакції блокують рядки для інших запитів — тримай транзакції короткими.",
      "Забутий COMMIT — зміни видно лише в поточному з'єднанні, доки транзакцію не завершено явно.",
      "Без транзакції збій посеред кількох пов'язаних операцій лишає дані в суперечливому стані (наприклад гроші списані, але не зараховані).",
    ],
    related: ["sql-insert-update-delete"],
  },
  "sql-window-functions": {
    badge: "SQL",
    title: "OVER, ROW_NUMBER, RANK, PARTITION BY",
    whatIsIt: "Віконні функції обчислюють значення для кожного рядка, спираючись на групу пов'язаних рядків («вікно»), АЛЕ, на відміну від GROUP BY, не схлопують рядки в один — кожен рядок лишається окремим у результаті.",
    useCases: ["нумерація рядків у межах групи (напр. рейтинг товарів у категорії)", "обчислення накопичувальної суми (running total)", "порівняння рядка з попереднім/наступним (LAG/LEAD)"],
    syntax: `SELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rnk\nFROM employees;`,
    attributes: [
      { name: "OVER (PARTITION BY col ORDER BY col)", desc: "визначає вікно — групу рядків і порядок для обчислення" },
      { name: "ROW_NUMBER()", desc: "порядковий номер рядка в межах вікна, завжди унікальний" },
      { name: "RANK() / DENSE_RANK()", desc: "ранг рядка; RANK лишає прогалини після однакових значень, DENSE_RANK — ні" },
      { name: "LAG() / LEAD()", desc: "значення попереднього/наступного рядка у вікні" },
      { name: "SUM()/AVG() OVER (...)", desc: "агрегатна функція, обчислена як накопичувальна чи по вікну, без схлопування рядків" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT name, department, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rnk
FROM employees;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">name</th><th style="border:1px solid #ccc;padding:4px 10px;">department</th><th style="border:1px solid #ccc;padding:4px 10px;">salary</th><th style="border:1px solid #ccc;padding:4px 10px;">rnk</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Іван</td><td style="border:1px solid #ccc;padding:4px 10px;">IT</td><td style="border:1px solid #ccc;padding:4px 10px;">50000</td><td style="border:1px solid #ccc;padding:4px 10px;">1</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Оля</td><td style="border:1px solid #ccc;padding:4px 10px;">IT</td><td style="border:1px solid #ccc;padding:4px 10px;">42000</td><td style="border:1px solid #ccc;padding:4px 10px;">2</td></tr>
</table>`,
    pitfalls: [
      "Плутанина з GROUP BY — віконні функції НЕ зменшують кількість рядків результату, на відміну від агрегації з групуванням.",
      "Забутий PARTITION BY, коли потрібне обчислення ОКРЕМО для кожної групи — без нього вікно охоплює всю таблицю одразу.",
      "WHERE не може фільтрувати за результатом віконної функції напряму — потрібен підзапит чи CTE.",
    ],
    related: ["sql-cte", "sql-aggregation-grouping"],
  },
  "sql-case-coalesce": {
    badge: "SQL",
    title: "CASE WHEN, COALESCE, NULLIF",
    whatIsIt: "CASE WHEN — умовний вираз у SQL, схожий на if/else, що повертає різне значення залежно від умови. COALESCE повертає перше НЕ-NULL значення зі списку. NULLIF повертає NULL, якщо два значення рівні.",
    useCases: ["перетворення числового кода в читабельний текст (напр. статус замовлення)", "підстановка значення за замовчуванням замість NULL (COALESCE)", "уникнення ділення на нуль (NULLIF)"],
    syntax: `SELECT name,\n  CASE WHEN age >= 18 THEN 'дорослий' ELSE 'неповнолітній' END as category\nFROM users;`,
    attributes: [
      { name: "CASE WHEN ... THEN ... ELSE ... END", desc: "умовний вираз — повертає значення залежно від першої істинної умови" },
      { name: "COALESCE(a, b, c)", desc: "повертає перше НЕ-NULL значення зі списку аргументів" },
      { name: "NULLIF(a, b)", desc: "повертає NULL, якщо a дорівнює b, інакше повертає a" },
      { name: "CASE col WHEN val THEN ...", desc: "коротка форма CASE для порівняння однієї колонки з кількома значеннями" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT name,
  COALESCE(nickname, name) as display_name,
  CASE
    WHEN age < 18 THEN 'дитина'
    WHEN age < 65 THEN 'дорослий'
    ELSE 'пенсіонер'
  END as category
FROM users;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">name</th><th style="border:1px solid #ccc;padding:4px 10px;">display_name</th><th style="border:1px solid #ccc;padding:4px 10px;">category</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Іван</td><td style="border:1px solid #ccc;padding:4px 10px;">Іван</td><td style="border:1px solid #ccc;padding:4px 10px;">дорослий</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Оля</td><td style="border:1px solid #ccc;padding:4px 10px;">Ол</td><td style="border:1px solid #ccc;padding:4px 10px;">дорослий</td></tr>
</table>`,
    pitfalls: [
      "Забутий ELSE в CASE — рядки, що не потрапили в жодну умову, отримують NULL замість очікуваного значення.",
      "Порівняння з NULL через звичайне = замість IS NULL всередині WHEN — умова ніколи не спрацює.",
      "COALESCE перевіряє аргументи по черзі й зупиняється на першому НЕ-NULL — порядок аргументів важливий.",
    ],
    related: ["sql-filtering"],
  },
  "sql-string-functions": {
    badge: "SQL",
    title: "CONCAT, UPPER, LOWER, TRIM, SUBSTRING",
    whatIsIt: "Вбудовані функції для обробки текстових значень прямо в запиті — об'єднання рядків, зміна регістру, видалення пробілів, вирізання підрядка, заміна тексту.",
    useCases: ["об'єднання імені й прізвища в одне поле (CONCAT)", "нормалізація регістру перед порівнянням (UPPER/LOWER)", "видалення зайвих пробілів з введених користувачем даних (TRIM)"],
    syntax: `SELECT CONCAT(first_name, ' ', last_name) as full_name,\n  UPPER(email) as email_upper\nFROM users;`,
    attributes: [
      { name: "CONCAT(a, b, ...) / ||", desc: "об'єднує кілька рядків в один" },
      { name: "UPPER() / LOWER()", desc: "переводить текст у верхній/нижній регістр" },
      { name: "TRIM() / LTRIM() / RTRIM()", desc: "видаляє пробіли з обох боків / зліва / справа" },
      { name: "SUBSTRING(str, start, length)", desc: "вирізає частину рядка з позиції start довжиною length" },
      { name: "REPLACE(str, from, to)", desc: "замінює всі входження підрядка from на to" },
      { name: "LENGTH() / CHAR_LENGTH()", desc: "довжина рядка в символах" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT
  CONCAT(UPPER(LEFT(name, 1)), LOWER(SUBSTRING(name, 2))) as formatted,
  LENGTH(name) as len
FROM users;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (вхід: 'ОЛЯ'):</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">formatted</th><th style="border:1px solid #ccc;padding:4px 10px;">len</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Оля</td><td style="border:1px solid #ccc;padding:4px 10px;">3</td></tr>
</table>`,
    pitfalls: [
      "Позиції в SUBSTRING рахуються з 1, а не з 0, на відміну від більшості мов програмування.",
      "Різні СУБД мають різний синтаксис конкатенації: || у PostgreSQL/SQLite, CONCAT() у MySQL, + у SQL Server.",
      "Порівняння рядків без нормалізації регістру (UPPER/LOWER) — 'Оля' і 'оля' вважаються різними значеннями.",
    ],
    related: ["sql-filtering"],
  },
  "sql-number-functions": {
    badge: "SQL",
    title: "ROUND, CEIL, FLOOR, ABS, MOD",
    whatIsIt: "Вбудовані математичні функції для обробки числових значень прямо в запиті — округлення, знаходження залишку від ділення, модуля, найближчого цілого вгору чи вниз.",
    useCases: ["округлення ціни до 2 знаків після коми (ROUND)", "пагінація через залишок від ділення (MOD)", "гарантія додатного значення незалежно від знаку (ABS)"],
    syntax: `SELECT ROUND(price, 2) as rounded,\n  CEIL(price) as ceiling,\n  FLOOR(price) as floor\nFROM products;`,
    attributes: [
      { name: "ROUND(num, decimals)", desc: "округлює число до вказаної кількості знаків після коми" },
      { name: "CEIL() / CEILING()", desc: "округлює вгору до найближчого цілого" },
      { name: "FLOOR()", desc: "округлює вниз до найближчого цілого" },
      { name: "ABS()", desc: "повертає модуль (абсолютне значення) числа" },
      { name: "MOD(a, b) / a % b", desc: "залишок від цілочисельного ділення a на b" },
      { name: "POWER(base, exp) / SQRT()", desc: "піднесення до степеня й квадратний корінь" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT name, price,
  ROUND(price, 0) as rounded,
  price % 10 as remainder
FROM products;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">name</th><th style="border:1px solid #ccc;padding:4px 10px;">price</th><th style="border:1px solid #ccc;padding:4px 10px;">rounded</th><th style="border:1px solid #ccc;padding:4px 10px;">remainder</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">Книга</td><td style="border:1px solid #ccc;padding:4px 10px;">149.99</td><td style="border:1px solid #ccc;padding:4px 10px;">150</td><td style="border:1px solid #ccc;padding:4px 10px;">9.99</td></tr>
</table>`,
    pitfalls: [
      "ROUND без другого аргументу округлює до цілого — легко забути й отримати неочікувану втрату точності.",
      "Ділення двох цілих чисел (INTEGER / INTEGER) у деяких СУБД повертає ціле число без залишку — потрібно явно привести один з операндів до дробового типу.",
      "Плаваюча точка (FLOAT) не гарантує точності для грошових розрахунків — для цього краще NUMERIC/DECIMAL.",
    ],
    related: ["sql-data-types"],
  },
  "sql-date-functions": {
    badge: "SQL",
    title: "NOW, DATE_TRUNC, EXTRACT, INTERVAL",
    whatIsIt: "Вбудовані функції для роботи з датами й часом прямо в запиті — отримання поточного часу, округлення дати до одиниці (місяць, рік), витягування частини дати (рік, день тижня), додавання/віднімання часових проміжків.",
    useCases: ["групування замовлень по місяцях (DATE_TRUNC)", "фільтрація записів за останні 7 днів (INTERVAL)", "витягування року чи дня тижня з дати (EXTRACT)"],
    syntax: `SELECT DATE_TRUNC('month', created_at) as month, COUNT(*)\nFROM orders\nWHERE created_at > NOW() - INTERVAL '30 days'\nGROUP BY month;`,
    attributes: [
      { name: "NOW() / CURRENT_DATE", desc: "поточні дата й час / лише поточна дата" },
      { name: "DATE_TRUNC('unit', date)", desc: "округлює дату вниз до вказаної одиниці (день, місяць, рік)" },
      { name: "EXTRACT(unit FROM date)", desc: "витягує частину дати: рік, місяць, день, день тижня тощо" },
      { name: "date + INTERVAL '7 days'", desc: "додає/віднімає часовий проміжок до дати" },
      { name: "AGE(date1, date2)", desc: "повертає різницю між двома датами як інтервал" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as orders_count
FROM orders
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY month
ORDER BY month;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<table style="border-collapse:collapse;font-size:13px;">
  <tr style="background:#eee;"><th style="border:1px solid #ccc;padding:4px 10px;">month</th><th style="border:1px solid #ccc;padding:4px 10px;">orders_count</th></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">2024-07-01</td><td style="border:1px solid #ccc;padding:4px 10px;">42</td></tr>
  <tr><td style="border:1px solid #ccc;padding:4px 10px;">2024-08-01</td><td style="border:1px solid #ccc;padding:4px 10px;">58</td></tr>
</table>`,
    pitfalls: [
      "Синтаксис функцій дат сильно відрізняється між СУБД (DATE_TRUNC у PostgreSQL, DATE_FORMAT у MySQL) — код не завжди портативний.",
      "Порівняння дат без урахування часового поясу (timezone) — сервер і клієнт можуть бути в різних поясах, що зсуває результат фільтрації.",
      "Зберігання дати як TEXT замість DATE/TIMESTAMP — втрачаються всі переваги функцій дат і правильного сортування.",
    ],
    related: ["sql-data-types"],
  },
  "sql-type-casting": {
    badge: "SQL",
    title: "CAST, ::type",
    whatIsIt: "Явне перетворення значення з одного типу даних в інший — наприклад, текст у число, чи число у текст. Без явного приведення деякі порівняння чи операції можуть спрацювати неочікувано або викинути помилку.",
    useCases: ["перетворення текстового поля на число для математичних операцій", "форматування числа чи дати як тексту для виводу", "порівняння значень різних типів у WHERE"],
    syntax: `SELECT CAST(price AS INTEGER) FROM products;\nSELECT price::INTEGER FROM products; -- скорочений синтаксис PostgreSQL`,
    attributes: [
      { name: "CAST(value AS type)", desc: "стандартний SQL-синтаксис явного перетворення типу" },
      { name: "value::type", desc: "скорочений синтаксис приведення типу (PostgreSQL)" },
      { name: "TO_CHAR(date, format)", desc: "форматує дату чи число як текст за шаблоном" },
      { name: "TO_NUMBER(text) / TO_DATE(text)", desc: "перетворюють текст у число чи дату" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">SELECT '42' :: INTEGER + 8 as result;
-- result: 50

SELECT CAST('2024-01-15' AS DATE) as parsed_date;
-- parsed_date: 2024-01-15</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання: 50 та 2024-01-15 відповідно</p>`,
    pitfalls: [
      "Приведення тексту, що не відповідає формату числа/дати, кидає помилку виконання запиту — варто перевіряти дані заздалегідь.",
      "Неявне приведення типів (СУБД робить це автоматично) не завжди дає очікуваний результат — краще привести тип явно.",
      "Втрата точності при приведенні дробового числа до цілого (CAST AS INTEGER) — значення обрізається чи округлюється залежно від СУБД.",
    ],
    related: ["sql-data-types"],
  },
  "sql-data-types": {
    badge: "SQL",
    title: "INTEGER, TEXT, BOOLEAN, NUMERIC, TIMESTAMP",
    whatIsIt: "Кожна колонка таблиці має тип даних, що визначає, які значення в ній можна зберігати і як вони порівнюються й сортуються. Правильний вибір типу — основа коректної й ефективної бази даних.",
    useCases: ["вибір INTEGER для лічильників чи ідентифікаторів", "вибір NUMERIC/DECIMAL для грошових сум (точність)", "вибір TIMESTAMP для дати й часу події"],
    syntax: `CREATE TABLE products (\n  id INTEGER,\n  name TEXT,\n  price NUMERIC(10, 2),\n  in_stock BOOLEAN,\n  created_at TIMESTAMP\n);`,
    attributes: [
      { name: "INTEGER / BIGINT / SERIAL", desc: "цілі числа; SERIAL — автоінкрементний ідентифікатор" },
      { name: "NUMERIC(p, s) / DECIMAL", desc: "точні дробові числа — для грошей, на відміну від FLOAT" },
      { name: "TEXT / VARCHAR(n) / CHAR(n)", desc: "текстові типи: без обмеження, з обмеженням довжини, фіксованої довжини" },
      { name: "BOOLEAN", desc: "true/false — для прапорців типу is_active" },
      { name: "DATE / TIMESTAMP / TIMESTAMPTZ", desc: "дата / дата+час / дата+час з часовим поясом" },
      { name: "JSON / JSONB", desc: "зберігання структурованих JSON-даних прямо в колонці (сучасні СУБД)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат: таблиця orders створена з правильними типами для кожного поля</p>`,
    pitfalls: [
      "FLOAT/REAL для грошей — накопичена похибка округлення з часом; завжди NUMERIC/DECIMAL для фінансових даних.",
      "VARCHAR без ліміту довжини там, де довжина насправді обмежена (напр. код країни) — втрачена можливість валідації на рівні БД.",
      "TIMESTAMP без часового поясу (TIMESTAMPTZ) у застосунку з користувачами з різних поясів — плутанина при відображенні часу.",
    ],
    related: ["sql-create-alter-table", "sql-type-casting"],
  },
  "sql-permissions": {
    badge: "SQL",
    title: "GRANT, REVOKE, ROLE",
    whatIsIt: "Керування правами доступу до бази даних — хто може читати, змінювати чи адмініструвати які таблиці. GRANT надає права, REVOKE забирає. ROLE — іменований набір прав, який можна призначити кільком користувачам.",
    useCases: ["надання застосунку лише прав читання й запису, без прав видалення таблиць", "створення окремої ролі для аналітиків з доступом лише на читання", "обмеження доступу до чутливих таблиць (напр. таблиця з паролями)"],
    syntax: `GRANT SELECT, INSERT, UPDATE ON orders TO app_user;\nREVOKE DELETE ON orders FROM app_user;`,
    attributes: [
      { name: "GRANT права ON об'єкт TO роль/користувач", desc: "надає вказані права на таблицю/схему користувачу чи ролі" },
      { name: "REVOKE права ON об'єкт FROM ...", desc: "забирає раніше надані права" },
      { name: "CREATE ROLE name", desc: "створює нову роль — іменований набір прав" },
      { name: "GRANT role TO user", desc: "призначає роль користувачу — той отримує всі її права" },
      { name: "принцип найменших привілеїв", desc: "надавай лише ті права, що дійсно потрібні для задачі, не більше" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">CREATE ROLE analyst;
GRANT SELECT ON orders, users TO analyst;
GRANT analyst TO maria;

-- Марія тепер може ЛИШЕ читати orders і users,
-- не може змінювати чи видаляти дані</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат: роль analyst створена й призначена користувачу maria з правами лише на читання</p>`,
    pitfalls: [
      "Надання прав SUPERUSER чи повного доступу застосунку «про всяк випадок» — серйозний ризик безпеки, якщо застосунок буде скомпрометований.",
      "Забуте REVOKE після завершення тимчасового доступу — права накопичуються й ускладнюють аудит безпеки.",
      "Один спільний користувач БД для всіх сервісів замість окремих ролей — неможливо відстежити, хто саме зробив зміну.",
    ],
    related: ["sql-create-alter-table"],
  },
  "backend-http-methods": {
    badge: "Backend",
    title: "GET, POST, PUT, PATCH, DELETE",
    whatIsIt: "HTTP-методи вказують намір запиту щодо ресурсу на сервері. Це основа REST API — кожен метод має свою семантику, яку варто дотримуватись, щоб API поводився передбачувано.",
    useCases: ["отримання даних без зміни стану сервера (GET)", "створення нового ресурсу (POST)", "повна чи часткова заміна існуючого ресурсу (PUT/PATCH)", "видалення ресурсу (DELETE)"],
    syntax: `GET /users/42 HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer <token>`,
    attributes: [
      { name: "GET", desc: "отримує дані, не змінює стан сервера — безпечний і ідемпотентний" },
      { name: "POST", desc: "створює новий ресурс чи виконує дію; НЕ ідемпотентний (повторний виклик створює дублікат)" },
      { name: "PUT", desc: "повністю замінює ресурс — ідемпотентний (повторний виклик дає той самий результат)" },
      { name: "PATCH", desc: "оновлює лише вказані поля ресурсу, не чіпаючи решту" },
      { name: "DELETE", desc: "видаляє ресурс — зазвичай ідемпотентний" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">fetch('/api/users/42', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ age: 26 })
});</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (відповідь сервера):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">HTTP/1.1 200 OK
Content-Type: application/json

{"id": 42, "name": "Оля", "age": 26}</pre>`,
    pitfalls: [
      "Використання GET для дій, що змінюють стан сервера (напр. GET /delete-user/42) — ламає кешування, префетчинг і семантику протоколу.",
      "POST замість PUT/PATCH там, де операція насправді ідемпотентна — ускладнює повторні спроби при збоях мережі.",
      "Надсилання тіла запиту (body) з GET — багато серверів і проксі його ігнорують чи відкидають.",
    ],
    related: ["backend-http-status-codes", "backend-rest"],
  },
  "backend-http-status-codes": {
    badge: "Backend",
    title: "Коди статусу: 2xx, 3xx, 4xx, 5xx",
    whatIsIt: "Кожна HTTP-відповідь містить трицифровий код статусу, що повідомляє клієнту результат запиту. Перша цифра визначає категорію: 2xx — успіх, 3xx — перенаправлення, 4xx — помилка клієнта, 5xx — помилка сервера.",
    useCases: ["сигналізація успіху операції (200, 201, 204)", "повідомлення клієнту про його помилку — невірні дані, відсутність прав (400, 401, 403, 404)", "сигналізація про збій на сервері (500, 502, 503)"],
    syntax: `HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{"error": "User not found"}`,
    attributes: [
      { name: "200 / 201 / 204", desc: "успіх / успішно створено / успіх без вмісту у відповіді" },
      { name: "301 / 302 / 304", desc: "постійне перенаправлення / тимчасове / вміст не змінився (кеш)" },
      { name: "400 / 401 / 403", desc: "невірний запит / не авторизований / доступ заборонено" },
      { name: "404 / 409 / 422", desc: "не знайдено / конфлікт стану / дані не пройшли валідацію" },
      { name: "429", desc: "клієнт перевищив ліміт запитів (rate limiting)" },
      { name: "500 / 502 / 503", desc: "внутрішня помилка сервера / поганий шлюз / сервіс недоступний" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">const res = await fetch('/api/users/999');
console.log(res.status, res.ok);</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (користувача 999 не існує):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">404 false</pre>`,
    pitfalls: [
      "Повернення 200 OK разом з {\"error\": \"...\"} у тілі — клієнтський код, що перевіряє лише статус, не помітить помилку.",
      "Плутанина 401 і 403 — 401 означає «ти не залогінений», 403 означає «ти залогінений, але доступу нема».",
      "Ігнорування коду статусу у фронтенд-коді (перевірка лише response.json() без res.ok) — помилки сервера непомітно проходять як успіх.",
    ],
    related: ["backend-http-methods", "backend-http-headers"],
  },
  "backend-http-headers": {
    badge: "Backend",
    title: "Content-Type, Authorization, Cache-Control, CORS",
    whatIsIt: "HTTP-заголовки — метадані, що супроводжують запит чи відповідь: формат даних, автентифікація, правила кешування, дозволи на крос-доменні запити.",
    useCases: ["вказання формату тіла запиту/відповіді (Content-Type)", "передача токена автентифікації (Authorization)", "керування кешуванням у браузері й проксі (Cache-Control)", "дозвіл крос-доменних запитів з фронтенду на інший домен (CORS)"],
    syntax: `POST /api/orders HTTP/1.1\nContent-Type: application/json\nAuthorization: Bearer eyJhbGc...\nCache-Control: no-cache`,
    attributes: [
      { name: "Content-Type", desc: "вказує формат тіла запиту/відповіді, напр. application/json чи multipart/form-data" },
      { name: "Authorization", desc: "передає токен/облікові дані для автентифікації запиту (Bearer <token>)" },
      { name: "Cache-Control", desc: "керує кешуванням відповіді браузером і проміжними серверами (no-cache, max-age=3600)" },
      { name: "Access-Control-Allow-Origin", desc: "дозволяє браузеру робити крос-доменні запити до цього сервера (CORS)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">curl -H "Authorization: Bearer abc123" \\
     -H "Content-Type: application/json" \\
     https://api.example.com/orders</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (заголовки відповіді сервера):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: https://myapp.com
Cache-Control: private, max-age=60</pre>`,
    pitfalls: [
      "Забутий Content-Type — сервер може неправильно розпарсити тіло запиту або відхилити його повністю.",
      "Access-Control-Allow-Origin: * на API з приватними даними та Authorization — потенційна вразливість, дозволяє будь-якому сайту читати відповідь.",
      "Кешування відповідей з приватними/чутливими даними без Cache-Control: private — дані можуть залишитись у спільному/проксі-кеші.",
    ],
    related: ["backend-http-status-codes", "backend-security"],
  },
  "backend-rest": {
    badge: "Backend",
    title: "REST (Representational State Transfer)",
    whatIsIt: "REST — архітектурний стиль побудови API, де кожен ресурс має свій URL, а дії над ним виконуються через стандартні HTTP-методи (GET/POST/PUT/DELETE). Це не протокол і не бібліотека, а набір принципів.",
    useCases: ["побудова публічного API для мобільного застосунку чи фронтенду", "стандартизований, передбачуваний спосіб доступу до ресурсів", "кешування відповідей на рівні HTTP (браузер, CDN, проксі)"],
    syntax: `GET    /api/users        - список користувачів\nGET    /api/users/42     - один користувач\nPOST   /api/users        - створити користувача\nPATCH  /api/users/42     - оновити користувача\nDELETE /api/users/42     - видалити користувача`,
    attributes: [
      { name: "Ресурс (resource)", desc: "сутність, ідентифікована URL, напр. /users, /orders/17" },
      { name: "Без стану (stateless)", desc: "кожен запит містить усю інформацію, потрібну для обробки — сервер не зберігає стан клієнта між запитами" },
      { name: "Вкладені ресурси", desc: "напр. /users/42/orders — замовлення конкретного користувача" },
      { name: "Query-параметри", desc: "?page=2&limit=20 — для фільтрації, пагінації, сортування" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">GET /api/users/42/orders?status=paid&limit=5</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">200 OK
[
  { "id": 101, "total": 450, "status": "paid" },
  { "id": 98,  "total": 1200, "status": "paid" }
]</pre>`,
    pitfalls: [
      "Дієслова в URL замість іменників (/getUser замість GET /users/42) — суперечить самій ідеї REST, де дію вже задає HTTP-метод.",
      "Зберігання стану сесії користувача на сервері між запитами (замість токена в кожному запиті) — порушує принцип stateless, ускладнює масштабування.",
      "Ігнорування HTTP-кешування там, де воно доречне (GET-запити зі стабільними даними) — зайве навантаження на сервер.",
    ],
    related: ["backend-http-methods", "backend-graphql"],
  },
  "backend-graphql": {
    badge: "Backend",
    title: "GraphQL",
    whatIsIt: "GraphQL — мова запитів для API, де клієнт сам описує, які саме поля даних йому потрібні, в одному запиті, замість того щоб сервер диктував фіксовану структуру відповіді для кожного ендпоінту.",
    useCases: ["уникнення over-fetching — отримання лише потрібних полів, а не всього об'єкта", "об'єднання даних з кількох пов'язаних сутностей в один запит замість кількох REST-викликів", "мобільні застосунки з обмеженим трафіком, де важлива економія даних"],
    syntax: `query {\n  user(id: 1) {\n    name\n    orders {\n      total\n    }\n  }\n}`,
    attributes: [
      { name: "query", desc: "запит на читання даних — аналог GET у REST" },
      { name: "mutation", desc: "запит на зміну даних — аналог POST/PUT/DELETE у REST" },
      { name: "schema", desc: "опис усіх доступних типів даних і запитів у API, перевіряється при кожному запиті" },
      { name: "resolver", desc: "функція на сервері, що знає, як отримати дані для конкретного поля схеми" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">query {
  user(id: 1) {
    name
    email
  }
}</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">{
  "data": {
    "user": { "name": "Оля", "email": "olya@mail.com" }
  }
}</pre>`,
    pitfalls: [
      "Один величезний запит з глибокою вкладеністю (N+1 у резолверах) може створити непередбачуване навантаження на базу даних.",
      "GraphQL завжди повертає 200 OK, навіть при помилці — деталі помилки треба шукати в полі errors відповіді, а не в HTTP-статусі.",
      "HTTP-кешування (як у REST GET) не працює з коробки — усі запити зазвичай йдуть через POST на один ендпоінт.",
    ],
    related: ["backend-rest"],
  },
  "backend-websocket-webhook": {
    badge: "Backend",
    title: "WebSocket, Webhook",
    whatIsIt: "WebSocket — постійне двостороннє з'єднання між клієнтом і сервером для обміну даними в реальному часі. Webhook — протилежний до звичайного API підхід: сервер сам відправляє HTTP-запит іншому сервісу, коли трапляється подія, замість того щоб чекати запиту від клієнта.",
    useCases: ["чати й сповіщення в реальному часі (WebSocket)", "живе оновлення даних без постійного опитування (WebSocket)", "сповіщення зовнішнього сервісу про подію: оплату, новий коміт (Webhook)"],
    syntax: `// WebSocket (клієнт)\nconst ws = new WebSocket('wss://api.example.com');\nws.onmessage = (event) => console.log(event.data);\n\n// Webhook (сервер отримує подію)\napp.post('/webhook/payment', (req, res) => { ... });`,
    attributes: [
      { name: "new WebSocket(url)", desc: "відкриває постійне з'єднання з сервером" },
      { name: "ws.send() / ws.onmessage", desc: "надсилає повідомлення / обробляє вхідні повідомлення від сервера" },
      { name: "ws.onopen / ws.onclose", desc: "обробники подій відкриття та закриття з'єднання" },
      { name: "Webhook URL", desc: "адреса на твоєму сервері, яку зовнішній сервіс викликає при події (напр. Stripe, GitHub)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">const ws = new WebSocket('wss://chat.example.com');
ws.onopen = () => ws.send('Привіт!');
ws.onmessage = (e) => console.log('Отримано:', e.data);</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (у консолі, коли сервер відповідає):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Отримано: Сервер отримав твоє повідомлення!</pre>`,
    pitfalls: [
      "WebSocket-з'єднання, що не перепідключається при розриві мережі — застосунок «тихо» перестає отримувати оновлення.",
      "Webhook-ендпоінт без перевірки підпису/секрету запиту — будь-хто може підробити подію (напр. фейкову оплату).",
      "Webhook-обробник, що виконує довгу роботу синхронно — зовнішній сервіс може вважати доставку невдалою через тайм-аут і повторно надіслати подію.",
    ],
    related: ["backend-rest", "backend-security"],
  },
  "backend-nodejs-modules": {
    badge: "Backend",
    title: "require/module.exports, process.env, fs/path",
    whatIsIt: "Node.js виконує JavaScript поза браузером і додає власне середовище виконання: систему модулів для розбиття коду на файли, доступ до змінних середовища й файлової системи — того, чого немає у звичайному JS у браузері.",
    useCases: ["розбиття серверного коду на окремі файли/модулі", "конфігурація застосунку через змінні середовища (порт, секрети, URL бази даних)", "читання/запис файлів, побудова кросплатформних шляхів"],
    syntax: `// math.js\nmodule.exports = { add: (a, b) => a + b };\n\n// index.js\nconst { add } = require('./math');\nconsole.log(add(2, 3));`,
    attributes: [
      { name: "module.exports", desc: "визначає, що саме файл-модуль експортує для використання в інших файлах" },
      { name: "require('./file')", desc: "підключає інший модуль за відносним чи пакетним шляхом" },
      { name: "process.env.NAME", desc: "доступ до змінної середовища — конфігурації, що не повинна бути в коді" },
      { name: "fs.readFileSync(path)", desc: "синхронно читає вміст файлу" },
      { name: "path.join(...)", desc: "будує коректний шлях до файлу незалежно від ОС (Windows/Linux/Mac)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
console.log(data.users.length);</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">3</pre>`,
    pitfalls: [
      "Захардкоджені секрети/паролі прямо в коді замість process.env — потрапляють у git-історію й видно кожному з доступом до репозиторію.",
      "Ручна конкатенація шляхів через '/' (напр. dir + '/' + file) замість path.join — ламається на Windows, де роздільник інший.",
      "fs.readFileSync у коді, що обробляє HTTP-запити — блокує весь процес Node.js на час читання файлу; для серверів краще асинхронний fs.promises.",
    ],
    related: ["backend-express-routing"],
  },
  "backend-express-routing": {
    badge: "Backend",
    title: "app.get()/app.post(), req/res, params/query/body",
    whatIsIt: "Express — мінімалістичний веб-фреймворк для Node.js. Маршрути (routes) реєструють обробники для конкретного HTTP-методу й шляху; об'єкти req і res представляють вхідний запит і вихідну відповідь відповідно.",
    useCases: ["реєстрація обробника для конкретного ендпоінту API", "читання параметрів URL, query-рядка чи тіла запиту", "формування JSON-відповіді з потрібним статус-кодом"],
    syntax: `app.get('/users/:id', (req, res) => {\n  const { id } = req.params;\n  res.json({ id, name: 'Оля' });\n});`,
    attributes: [
      { name: "app.get() / app.post() / ...", desc: "реєструють обробник для запитів певного HTTP-методу на вказаному шляху" },
      { name: "req.params", desc: "динамічні частини URL, напр. /users/:id → req.params.id" },
      { name: "req.query", desc: "параметри після ? у URL, напр. ?page=2 → req.query.page" },
      { name: "req.body", desc: "дані з тіла запиту (потребує middleware express.json())" },
      { name: "res.json() / res.status()", desc: "відправляють JSON-відповідь і задають HTTP-код статусу" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (GET /users/42, користувача немає):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">404 { "error": "Not found" }</pre>`,
    pitfalls: [
      "Читання req.body без підключеного middleware express.json() — body лишається undefined.",
      "Плутанина req.params і req.query — params завжди з визначеної частини шляху (:id), query — довільні ?key=value.",
      "Забутий return перед res.status(...).json(...) в умові — код виконується далі й намагається відправити відповідь двічі, що кидає помилку.",
    ],
    related: ["backend-nodejs-modules", "backend-express-middleware"],
  },
  "backend-express-middleware": {
    badge: "Backend",
    title: "Middleware, next()",
    whatIsIt: "Middleware — функція, що виконується МІЖ отриманням запиту й фінальним обробником маршруту. Має доступ до req/res і вирішує: обробити запит самостійно, змінити його і передати далі через next(), чи перервати ланцюжок.",
    useCases: ["логування кожного вхідного запиту", "перевірка автентифікації перед доступом до захищених маршрутів", "парсинг тіла запиту (express.json()) перед тим, як воно дійде до обробника", "централізована обробка помилок"],
    syntax: `app.use((req, res, next) => {\n  console.log(\`\${req.method} \${req.url}\`);\n  next();\n});`,
    attributes: [
      { name: "app.use(fn)", desc: "підключає middleware до всіх маршрутів (чи до вказаного префіксу шляху)" },
      { name: "(req, res, next) => {}", desc: "сигнатура middleware-функції — три параметри, третій викликає наступну ланку" },
      { name: "next()", desc: "передає керування наступному middleware чи обробнику маршруту" },
      { name: "next(err)", desc: "передає керування одразу в обробник помилок, минаючи звичайні middleware" },
      { name: "порядок підключення", desc: "middleware виконуються В ПОРЯДКУ реєстрації — це критично для автентифікації, логування тощо" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">function requireAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No token' });
  }
  next();
}

app.get('/profile', requireAuth, (req, res) => {
  res.json({ name: 'Оля' });
});</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (GET /profile без заголовка Authorization):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">401 { "error": "No token" }</pre>`,
    pitfalls: [
      "Забутий виклик next() у middleware — запит «зависає» назавжди, клієнт ніколи не отримує відповідь.",
      "Виклик next() ПІСЛЯ res.send()/res.json() — призводить до помилки «Cannot set headers after they are sent».",
      "Middleware автентифікації, підключений ПІСЛЯ маршруту, який має захищати — маршрут лишається публічним.",
    ],
    related: ["backend-express-routing", "backend-auth"],
  },
  "backend-auth": {
    badge: "Backend",
    title: "JWT, OAuth 2.0, сесії/cookie",
    whatIsIt: "Три поширені способи перевірити, хто робить запит. Сесії — сервер зберігає стан і видає клієнту ідентифікатор у cookie. JWT — самодостатній підписаний токен, що містить дані користувача, без стану на сервері. OAuth 2.0 — стандартний протокол делегованої авторизації (напр. «Увійти через Google»).",
    useCases: ["традиційний вхід через логін/пароль з сесією в cookie", "stateless-автентифікація для API, що масштабується на кілька серверів (JWT)", "вхід через сторонній сервіс без передачі пароля твоєму сайту (OAuth)"],
    syntax: `// Сесія\nSet-Cookie: sessionId=abc123; HttpOnly; Secure\n\n// JWT\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIs...`,
    attributes: [
      { name: "session / cookie", desc: "сервер зберігає стан сесії, клієнт лише передає ідентифікатор через cookie" },
      { name: "JWT (JSON Web Token)", desc: "самодостатній підписаний токен: header.payload.signature — сервер перевіряє підпис, не звертаючись до БД" },
      { name: "OAuth 2.0", desc: "стандартний протокол делегованої авторизації через сторонній сервіс (Google, GitHub)" },
      { name: "refresh token", desc: "довготривалий токен для отримання нового access-токена без повторного логіну" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">// Перевірка JWT на сервері
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (протермінований токен):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">401 { "error": "Invalid token" }</pre>`,
    pitfalls: [
      "Зберігання JWT у звичайному localStorage — вразливо до XSS: шкідливий скрипт може прочитати токен і вкрасти сесію.",
      "JWT без строку дії (exp) чи без можливості відкликати — вкрадений токен лишається дійсним назавжди.",
      "Cookie сесії без HttpOnly і Secure — доступна JavaScript-коду (ризик XSS) і може передаватись по незашифрованому HTTP.",
    ],
    related: ["backend-password-hashing", "backend-security"],
  },
  "backend-password-hashing": {
    badge: "Backend",
    title: "bcrypt, argon2",
    whatIsIt: "Хешування паролів — одностороннє перетворення пароля перед збереженням у базі даних. На відміну від шифрування, хеш неможливо «розшифрувати» назад — навіть якщо база даних витече, реальні паролі лишаються захищеними.",
    useCases: ["безпечне збереження паролів користувачів у базі даних", "перевірка пароля при вході без зберігання оригінального значення", "захист від наслідків витоку бази даних"],
    syntax: `const bcrypt = require('bcrypt');\n\nconst hash = await bcrypt.hash(password, 10);\nconst isValid = await bcrypt.compare(inputPassword, hash);`,
    attributes: [
      { name: "bcrypt.hash(password, rounds)", desc: "хешує пароль з заданою кількістю раундів (складність, вища — повільніше й безпечніше)" },
      { name: "bcrypt.compare(password, hash)", desc: "перевіряє, чи відповідає введений пароль збереженому хешу" },
      { name: "сіль (salt)", desc: "випадкові дані, додані до пароля перед хешуванням — вбудовані в bcrypt автоматично, захищають від rainbow-таблиць" },
      { name: "argon2", desc: "сучасніший алгоритм хешування, переможець Password Hashing Competition, стійкіший до GPU-атак" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">const hash = await bcrypt.hash('mySecret123', 10);
console.log(hash);

const ok = await bcrypt.compare('mySecret123', hash);
console.log(ok);</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">$2b$10$N9qo8uLOickgx2ZMRZoMye...
true</pre>`,
    pitfalls: [
      "Зберігання паролів у відкритому вигляді чи через MD5/SHA1 (швидкі хеш-функції, легко зламати перебором) — НІКОЛИ не використовуй для паролів.",
      "Власна реалізація хешування замість перевіреної бібліотеки (bcrypt/argon2) — легко припуститись критичної помилки в криптографії.",
      "Занадто малий rounds/cost параметр — хешування стає надто швидким і вразливим до перебору на сучасному обладнанні.",
    ],
    related: ["backend-auth"],
  },
  "backend-security": {
    badge: "Backend",
    title: "CORS, CSRF, XSS",
    whatIsIt: "Три ключові концепції веб-безпеки. CORS — механізм браузера, що дозволяє/забороняє запити між різними доменами. CSRF — атака, коли шкідливий сайт змушує браузер жертви виконати дію від її імені. XSS — впровадження шкідливого скрипта на сторінку через невалідований ввід.",
    useCases: ["налаштування, які домени можуть звертатись до твого API (CORS)", "захист форм і дій від підробки запитів (CSRF-токени)", "екранування користувацького вводу перед виводом на сторінку (захист від XSS)"],
    syntax: `// CORS у Express\nconst cors = require('cors');\napp.use(cors({ origin: 'https://myapp.com' }));`,
    attributes: [
      { name: "CORS (Cross-Origin Resource Sharing)", desc: "браузерний механізм, що дозволяє чи забороняє запити з одного домену до API іншого" },
      { name: "CSRF (Cross-Site Request Forgery)", desc: "шкідливий сайт відправляє запит від імені залогіненого користувача, використовуючи його cookie" },
      { name: "CSRF-токен", desc: "унікальне значення у формі, яке має підтвердити, що запит справді прийшов з твого сайту" },
      { name: "XSS (Cross-Site Scripting)", desc: "впровадження шкідливого JavaScript через невалідований ввід (коментар, ім'я, параметр URL)" },
      { name: "екранування вводу (escaping)", desc: "перетворення спецсимволів (<, >, &) у безпечний текст перед виводом на сторінку" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">// Небезпечно: XSS-вразливість
element.innerHTML = userComment;

// Безпечно: текст, не HTML
element.textContent = userComment;</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (userComment = "&lt;img src=x onerror=alert(1)&gt;"):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">innerHTML: скрипт виконується (XSS!)
textContent: показано як звичайний текст, безпечно</pre>`,
    pitfalls: [
      "innerHTML з даними від користувача без санітизації — класична XSS-вразливість, шкідливий скрипт виконується в браузері жертви.",
      "CORS з Access-Control-Allow-Origin: * разом з credentials: true (cookie) — браузер це заборонить, і правильно, бо це небезпечна комбінація.",
      "Форми/дії без CSRF-захисту на сайтах, що покладаються на cookie-автентифікацію — уразливі до підробки запитів зі стороннього сайту.",
    ],
    related: ["backend-auth", "backend-http-headers"],
  },
  "backend-rate-limiting": {
    badge: "Backend",
    title: "Rate Limiting",
    whatIsIt: "Rate limiting обмежує кількість запитів, які клієнт (за IP, токеном чи користувачем) може зробити за проміжок часу. Захищає сервер від перевантаження, зловживань і частини атак типу brute-force чи DDoS.",
    useCases: ["захист ендпоінту логіну від перебору паролів (brute-force)", "обмеження безкоштовного тарифу API до N запитів на хвилину", "запобігання перевантаженню сервера через масові автоматизовані запити"],
    syntax: `const rateLimit = require('express-rate-limit');\n\napp.use('/api/', rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n}));`,
    attributes: [
      { name: "windowMs", desc: "тривалість вікна підрахунку запитів у мілісекундах" },
      { name: "max", desc: "максимальна кількість запитів від одного клієнта за вікно" },
      { name: "ключ ідентифікації", desc: "зазвичай IP-адреса чи ID користувача/API-токена — за чим саме рахуються запити" },
      { name: "429 Too Many Requests", desc: "статус-код, яким сервер відповідає, коли ліміт перевищено" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">const limiter = rateLimit({ windowMs: 60000, max: 5 });
app.post('/login', limiter, loginHandler);

// 6-та спроба входу за хвилину з одного IP:</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">429 Too Many Requests
{ "error": "Забагато спроб. Спробуй пізніше." }</pre>`,
    pitfalls: [
      "Обмеження лише за IP-адресою — не працює коректно для користувачів за спільним NAT (офіс, мобільний оператор) чи за проксі.",
      "Занадто жорсткий ліміт на легітимні дії (напр. автозбереження форми) — псує досвід реальних користувачів.",
      "Rate limiting лише на клієнті (фронтенді) без дублювання на сервері — легко обійти прямим запитом до API.",
    ],
    related: ["backend-security", "backend-http-status-codes"],
  },
  "backend-sql-vs-nosql": {
    badge: "Backend",
    title: "SQL vs NoSQL",
    whatIsIt: "Дві принципово різні парадигми баз даних. SQL (реляційні) зберігають дані в таблицях з жорсткою, заздалегідь визначеною схемою й зв'язками між таблицями. NoSQL — узагальнена назва для баз з гнучкою структурою: документні, ключ-значення, графові тощо.",
    useCases: ["SQL — фінансові дані, замовлення, будь-що зі складними зв'язками й вимогами до цілісності", "NoSQL (документні) — гнучкі, змінні за структурою дані: профілі, каталоги товарів з різними атрибутами", "NoSQL (ключ-значення) — кеш, сесії, лічильники, дані, що потребують надшвидкого доступу"],
    syntax: `-- SQL (PostgreSQL)\nSELECT * FROM users WHERE age > 18;\n\n// NoSQL (MongoDB)\ndb.users.find({ age: { $gt: 18 } });`,
    attributes: [
      { name: "SQL: жорстка схема", desc: "структура таблиць визначена заздалегідь, зміна вимагає міграції" },
      { name: "SQL: ACID-транзакції", desc: "надійні гарантії цілісності при кількох пов'язаних змінах" },
      { name: "NoSQL: гнучка схема", desc: "документи в одній колекції можуть мати різну структуру полів" },
      { name: "NoSQL: горизонтальне масштабування", desc: "багато NoSQL-баз спроєктовані для легшого розподілу на кілька серверів" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">// PostgreSQL: чітка схема
CREATE TABLE users (id SERIAL, name TEXT, age INT);

// MongoDB: гнучкий документ
db.users.insertOne({ name: "Оля", age: 25, hobbies: ["читання"] });</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат: обидва підходи валідні — вибір залежить від структури й вимог даних проєкту</p>`,
    pitfalls: [
      "Вибір NoSQL «бо модно», коли дані насправді реляційні (замовлення, платежі, звіти) — доводиться руками реалізовувати те, що SQL дає з коробки.",
      "Вибір SQL для даних із дуже мінливою, непередбачуваною структурою — постійні міграції схеми ускладнюють розробку.",
      "Відсутність валідації структури в NoSQL «бо гнучка схема» — документи поступово стають несумісними одне з одним.",
    ],
    related: ["sql-data-types", "backend-orm"],
  },
  "backend-orm": {
    badge: "Backend",
    title: "ORM (Prisma, Sequelize, SQLAlchemy)",
    whatIsIt: "ORM (Object-Relational Mapping) дозволяє працювати з базою даних через об'єкти й методи мови програмування, замість написання сирого SQL вручну. Бібліотека сама генерує SQL-запити на основі викликів коду.",
    useCases: ["швидша розробка типових CRUD-операцій без написання SQL вручну", "автоматична валідація типів даних на рівні коду до звернення до БД", "легша підтримка кількох СУБД без переписування запитів"],
    syntax: `// Prisma (Node.js)\nconst user = await prisma.user.create({\n  data: { name: 'Оля', age: 25 }\n});`,
    attributes: [
      { name: "model / schema", desc: "опис структури таблиці як об'єкта/класу в коді застосунку" },
      { name: "create() / findMany() / update() / delete()", desc: "типові методи ORM, що генерують відповідний SQL" },
      { name: "міграції (migrations)", desc: "версійовані файли змін схеми БД, що застосовуються послідовно" },
      { name: "relations / include", desc: "опис зв'язків між таблицями й автоматичне підтягування пов'язаних даних (замість ручного JOIN)" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">const usersWithOrders = await prisma.user.findMany({
  where: { age: { gt: 18 } },
  include: { orders: true },
});
console.log(usersWithOrders[0].orders.length);</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">3</pre>`,
    pitfalls: [
      "Виклик ORM-запиту в циклі замість одного запиту з include/join — класична проблема N+1 запитів, різко сповільнює застосунок.",
      "Повна відмова від сирого SQL «бо є ORM» — складні аналітичні запити (агрегація, вікна) часто зручніше й ефективніше писати напряму.",
      "Застосунок в продакшені зі схемою, не синхронізованою через міграції — розбіжність між кодом і реальною структурою бази.",
    ],
    related: ["backend-sql-vs-nosql", "sql-create-alter-table"],
  },
  "backend-caching": {
    badge: "Backend",
    title: "Redis, Cache-Control, TTL",
    whatIsIt: "Кешування зберігає результат «дорогої» операції (запит до БД, важкі обчислення), щоб наступного разу віддати готову відповідь миттєво, без повторного обчислення. Redis — найпоширеніша база даних ключ-значення в оперативній пам'яті для кешування.",
    useCases: ["кешування результатів частих, але рідко змінюваних запитів до БД", "зберігання сесій користувачів для швидкого доступу", "лічильники, черги, rate-limiting — усе, що потребує швидкого доступу"],
    syntax: `SET user:42 '{"name":"Оля"}' EX 60\nGET user:42`,
    attributes: [
      { name: "SET key value", desc: "зберігає значення за ключем" },
      { name: "GET key", desc: "отримує значення за ключем" },
      { name: "EX seconds / TTL", desc: "час життя ключа в секундах — після цього запис автоматично видаляється" },
      { name: "DEL key", desc: "явно видаляє ключ з кешу (інвалідація)" },
      { name: "Cache-Control: max-age", desc: "HTTP-заголовок, що вказує браузеру/проксі, скільки секунд можна використовувати кешовану відповідь" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">async function getUser(id) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);
  await redis.set(\`user:\${id}\`, JSON.stringify(user), 'EX', 60);
  return user;
}</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (другий виклик за ту саму хвилину):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Перший виклик: ~45ms (запит до БД)
Другий виклик: ~1ms (з кешу Redis)</pre>`,
    pitfalls: [
      "Кешування даних без TTL чи стратегії інвалідації — користувачі бачать застарілі дані невизначено довго.",
      "Кешування ПЕРЕД оновленням у БД замість ПІСЛЯ — кеш і база розходяться, якщо запис у БД зазнає невдачі.",
      "Занадто короткий TTL для «дорогих» запитів — кеш майже не дає користі, а накладні витрати лишаються.",
    ],
    related: ["backend-http-headers"],
  },
  "backend-message-queues": {
    badge: "Backend",
    title: "RabbitMQ, Kafka",
    whatIsIt: "Черги повідомлень дозволяють сервісам обмінюватись даними асинхронно: один сервіс кладе повідомлення в чергу й одразу продовжує роботу, а інший забирає й обробляє його коли завгодно, не блокуючи відправника.",
    useCases: ["відправка листа/сповіщення без затримки основного запиту користувача", "розподіл важких завдань (обробка відео, генерація звіту) між кількома воркерами", "розв'язка сервісів між собою — один сервіс не падає, якщо інший тимчасово недоступний"],
    syntax: `// Producer\nchannel.sendToQueue('emails', Buffer.from(JSON.stringify({ to, subject })));\n\n// Consumer\nchannel.consume('emails', (msg) => {\n  sendEmail(JSON.parse(msg.content));\n  channel.ack(msg);\n});`,
    attributes: [
      { name: "producer (видавець)", desc: "сервіс, що кладе повідомлення в чергу" },
      { name: "consumer (споживач)", desc: "сервіс, що забирає й обробляє повідомлення з черги" },
      { name: "queue (черга)", desc: "буфер повідомлень, що чекають на обробку" },
      { name: "ack (acknowledge)", desc: "підтвердження, що повідомлення успішно оброблено — інакше воно повернеться в чергу" },
      { name: "Kafka: topic / partition", desc: "Kafka організовує повідомлення в іменовані потоки (topics), розділені на partition для паралельної обробки" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">app.post('/orders', async (req, res) => {
  const order = await db.orders.create(req.body);
  await channel.sendToQueue('send-receipt', Buffer.from(order.id));
  res.status(201).json(order); // не чекає відправки листа
});</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">201 Created (відповідь клієнту миттєво)
Лист із чеком надсилається окремим consumer'ом у фоні</pre>`,
    pitfalls: [
      "Забутий ack() у consumer — повідомлення вважається необробленим і повертається в чергу, обробляючись повторно й нескінченно.",
      "Обробник consumer'а, що не витримує повторної обробки одного повідомлення (не ідемпотентний) — дублікати листів/дій при збоях мережі.",
      "Черга без обмеження розміру чи dead-letter queue для повідомлень, що постійно падають — вони можуть накопичуватись назавжди.",
    ],
    related: ["backend-caching"],
  },
  "backend-web-servers": {
    badge: "Backend",
    title: "Nginx, Apache",
    whatIsIt: "Веб-сервери приймають вхідні HTTP-запити й вирішують, що з ними робити: віддати статичний файл, перенаправити на інший сервер (reverse proxy) чи розподілити навантаження між кількома застосунками (load balancing).",
    useCases: ["роздача статичних файлів (HTML, CSS, JS, зображення) напряму, без застосунку", "reverse proxy — прийом запитів і передача їх Node.js/Python-застосунку за лаштунками", "балансування навантаження між кількома копіями застосунку", "термінація HTTPS (SSL/TLS) перед застосунком"],
    syntax: `server {\n  listen 80;\n  location / {\n    proxy_pass http://localhost:3000;\n  }\n}`,
    attributes: [
      { name: "listen", desc: "порт, який сервер слухає для вхідних з'єднань" },
      { name: "location", desc: "блок правил для конкретного шляху URL" },
      { name: "proxy_pass", desc: "перенаправляє запит на інший сервер/порт (reverse proxy до застосунку)" },
      { name: "root / static files", desc: "директорія, звідки сервер напряму роздає статичні файли" },
      { name: "upstream", desc: "група серверів застосунку для балансування навантаження між ними" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">server {
  listen 80;
  server_name myapp.com;

  location /static/ {
    root /var/www/myapp;
  }

  location /api/ {
    proxy_pass http://localhost:3000;
  }
}</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат: запити на /static/ Nginx віддає файлом напряму (швидко), запити на /api/ передає Node.js-застосунку</p>`,
    pitfalls: [
      "Роздача статичних файлів через сам застосунок (Node.js/Python) замість Nginx — застосунок значно повільніший у цій ролі, ніж спеціалізований веб-сервер.",
      "Забутий proxy_pass заголовок Host чи X-Forwarded-For — застосунок за проксі не бачить реальну IP-адресу чи домен клієнта.",
      "Відсутність термінації HTTPS на рівні веб-сервера — кожен застосунок мусить сам займатись сертифікатами.",
    ],
    related: ["backend-http-headers"],
  },
  "fullstack-git-basics": {
    badge: "Full Stack",
    title: "git init/clone, git status/add/commit",
    whatIsIt: "Git — система контролю версій, що фіксує знімки історії твого коду. Ці команди — базовий цикл роботи: створити/скопіювати репозиторій, побачити, що змінилось, підготувати зміни й зберегти їх як коміт.",
    useCases: ["початок нового проєкту (init) чи копіювання існуючого (clone)", "перевірка, які файли змінені перед комітом", "збереження логічно завершеного шматка роботи як окремого коміту"],
    syntax: `git init\ngit clone https://github.com/user/repo.git\ngit status\ngit add file.js\ngit commit -m "Опис змін"`,
    attributes: [
      { name: "git init", desc: "створює новий, порожній репозиторій у поточній директорії" },
      { name: "git clone <url>", desc: "копіює існуючий репозиторій з віддаленого сервера разом з усією історією" },
      { name: "git status", desc: "показує стан робочої директорії — які файли змінені, додані, не відстежуються" },
      { name: "git add <file>", desc: "додає зміни у файлі до індексу (staging area) перед комітом" },
      { name: "git commit -m '...'", desc: "зберігає проіндексовані зміни як новий знімок історії з повідомленням" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">echo "console.log('hi')" > app.js
git add app.js
git commit -m "Add hello world script"
git status</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">[main a1b2c3d] Add hello world script
 1 file changed, 1 insertion(+)
On branch main
nothing to commit, working tree clean</pre>`,
    pitfalls: [
      "git add . без перегляду git status — можна випадково закомітити секрети, node_modules чи тимчасові файли.",
      "Коміт без git add — зміни лишаються незбереженими, git commit без -a чи попереднього add нічого не закомітить.",
      "Розпливчасті повідомлення комітів (напр. 'fix', 'update') — ускладнюють читання історії пізніше.",
    ],
    related: ["fullstack-git-branching", "fullstack-git-remote"],
  },
  "fullstack-git-branching": {
    badge: "Full Stack",
    title: "git branch, checkout/switch, merge, rebase",
    whatIsIt: "Гілки (branches) дозволяють розробляти нову функціональність окремо від основного коду, не заважаючи іншим. Merge і rebase — два способи об'єднати зміни з однієї гілки в іншу.",
    useCases: ["ізольована розробка нової фічі без ризику зламати робочий код у main", "паралельна робота кількох розробників над різними задачами", "об'єднання завершеної роботи назад в основну гілку"],
    syntax: `git branch feature-x\ngit switch feature-x\n# ...робота...\ngit switch main\ngit merge feature-x`,
    attributes: [
      { name: "git branch <name>", desc: "створює нову гілку (чи без аргументів — показує список існуючих)" },
      { name: "git switch <name> / git checkout <name>", desc: "перемикає робочу директорію на іншу гілку" },
      { name: "git merge <branch>", desc: "зливає зміни з іншої гілки в поточну, зберігаючи повну історію обох" },
      { name: "git rebase <branch>", desc: "переносить коміти поточної гілки на нову базу, створюючи лінійну історію" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">git switch -c feature-login
echo "// login form" >> app.js
git commit -am "Add login form"
git switch main
git merge feature-login</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання:</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">Updating a1b2c3d..e4f5g6h
Fast-forward
 app.js | 1 +
 1 file changed, 1 insertion(+)</pre>`,
    pitfalls: [
      "Rebase гілки, яку вже бачили інші розробники (спільна гілка) — переписує історію, викликаючи конфлікти в усіх, хто вже з неї тягнув.",
      "Робота напряму в main без окремої гілки для фічі — ускладнює відкат, якщо щось піде не так.",
      "Забутий switch назад у main перед merge — злиття виконається не в ту гілку, яку планувалось.",
    ],
    related: ["fullstack-git-basics", "fullstack-git-history-undo"],
  },
  "fullstack-git-remote": {
    badge: "Full Stack",
    title: "git push/pull, git fetch, git remote",
    whatIsIt: "Ці команди синхронізують локальний репозиторій з віддаленим (напр. на GitHub) — відправляють локальні коміти на сервер чи забирають звідти чужі зміни.",
    useCases: ["відправка локальних комітів на GitHub для збереження й спільної роботи", "отримання свіжих змін від колег перед продовженням роботи", "перевірка, які зміни з'явились віддалено, без автоматичного злиття"],
    syntax: `git remote add origin https://github.com/user/repo.git\ngit push origin main\ngit pull origin main\ngit fetch origin`,
    attributes: [
      { name: "git remote add <name> <url>", desc: "додає посилання на віддалений репозиторій під заданим іменем (типово origin)" },
      { name: "git push <remote> <branch>", desc: "відправляє локальні коміти на віддалений сервер" },
      { name: "git pull <remote> <branch>", desc: "забирає зміни з віддаленого репозиторію й одразу зливає їх у поточну гілку" },
      { name: "git fetch <remote>", desc: "забирає зміни з віддаленого репозиторію, НЕ зливаючи їх автоматично" },
    ],
    example: `<pre style="background:#f4f4f4;padding:10px;border-radius:6px;font-size:13px;">git fetch origin
git log HEAD..origin/main --oneline
git pull origin main</pre>
<p style="font-size:12px;color:#666;margin-top:6px;">Результат виконання (є 2 нових коміти на сервері):</p>
<pre style="background:#111;color:#0f0;padding:10px;border-radius:6px;font-size:13px;">e4f5g6h Fix header bug
d3e4f5g Update README
Fast-forward: main -> origin/main</pre>`,
    pitfalls: [
      "git pull без попереднього fetch/перегляду змін — може несподівано злити конфліктні чи небажані зміни прямо в робочу директорію.",
      "git push у спільну гілку без git pull перед цим — сервер відхилить push, якщо там уже є нові коміти, яких немає локально.",
      "Забутий git push після кількох локальних комітів — робота існує лише на одній машині, легко втратити при збої диска.",
    ],
    related: ["fullstack-git-basics", "fullstack-github"],
  },

};

const TERM_GUIDES = {
  "js-promise": {
    accent: "violet",
    titleEn: "Promise",
    titleUa: "Проміс",
    intro: "Promise — об'єкт, що представляє результат асинхронної операції, якого ще немає зараз, але буде пізніше: успішно (resolve) або з помилкою (reject).",
    simple: "Promise — це обіцянка: «я поверну результат пізніше, коли він буде готовий».",
    steps: [
      { title: "Створення проміса", code: `const promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("Готово!"), 1000);\n});`, resultLabel: "Що станеться:", result: `Через 1 секунду проміс перейде в стан "виконано" зі значенням "Готово!".` },
      { title: "Обробка результату через .then()", code: `promise.then(result => {\n  console.log(result);\n});`, resultLabel: "Результат у консолі (через 1с):", result: `Готово!` },
      { title: "fetch() повертає проміс", code: `fetch("/api/users")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));`, resultLabel: "Що станеться:", result: `Запит піде на сервер; коли прийде відповідь — дані виведуться в консоль. Якщо мережа впала — спрацює .catch().` },
      { title: "Той самий код через async/await", code: `async function loadUsers() {\n  const response = await fetch("/api/users");\n  const data = await response.json();\n  console.log(data);\n}`, resultLabel: "Що станеться:", result: `Той самий результат, але код читається зверху вниз, як синхронний.`, note: "await можна використовувати лише всередині функції, оголошеної як async." },
    ],
    usage: ["запити до сервера (fetch, axios)", "завантаження файлів", "будь-яка операція, що займає час: таймери, читання файлів, запити до бази"],
  },
  "css-grid": {
    accent: "teal",
    titleEn: "CSS Grid",
    titleUa: "Сітка Grid",
    intro: "CSS Grid — двовимірна система розкладки: на відміну від flexbox (один ряд або одна колонка), grid одразу керує і рядками, і колонками.",
    simple: "grid — це таблиця для розкладки будь-якого вмісту, не лише тексту.",
    steps: [
      { title: "Три рівні колонки", code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}`, resultLabel: "Що станеться:", result: `Дочірні елементи розподіляться по 3 рівних колонках з відступом 12px між ними.` },
      { title: "Елемент на кілька колонок", code: `.featured {\n  grid-column: 1 / 3;\n}`, resultLabel: "Що станеться:", result: `Цей елемент розтягнеться на перші дві колонки замість однієї.` },
      { title: "Адаптивні колонки без media query", code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n}`, resultLabel: "Що станеться:", result: `Кількість колонок автоматично підлаштується під ширину екрана — кожна колонка не менше 200px.`, note: "auto-fit + minmax() — найпопулярніший спосіб зробити адаптивну сітку карток без жодного @media." },
    ],
    usage: ["сітка карток товарів", "макет усієї сторінки (шапка/сайдбар/контент/підвал)", "галереї зображень", "будь-яке розташування в рядках і колонках одночасно"],
  },
  "git-merge-conflict": {
    accent: "red",
    titleEn: "Merge conflict",
    titleUa: "Конфлікт злиття",
    intro: "Конфлікт виникає, коли Git не може автоматично об'єднати зміни — наприклад, той самий рядок файлу змінили по-різному в двох гілках.",
    simple: "конфлікт — це коли Git не знає, яку з двох версій рядка лишити, і питає тебе.",
    steps: [
      { title: "Спроба злиття", code: `git checkout main\ngit merge feature`, resultLabel: "Що станеться:", result: `CONFLICT (content): Merge conflict in app.js\nAutomatic merge failed; fix conflicts and then commit the result.` },
      { title: "Git позначає конфлікт у файлі", code: `<<<<<<< HEAD\nconst title = "Головна";\n=======\nconst title = "Домашня сторінка";\n>>>>>>> feature`, resultLabel: "Що це означає:", result: `Між <<<<<<< HEAD і ======= — твоя версія з main. Між ======= і >>>>>>> feature — версія з іншої гілки.` },
      { title: "Вирішення конфлікту", code: `const title = "Головна сторінка"; // обрали й об'єднали вручну`, resultLabel: "Дія:", result: `Видали маркери <<<<<<<, =======, >>>>>>>, залиш той варіант (чи новий), який правильний.` },
      { title: "Завершення злиття", code: `git add app.js\ngit commit`, resultLabel: "Що станеться:", result: `Git зафіксує вирішений конфлікт як новий коміт злиття, і merge завершиться успішно.` },
    ],
    usage: ["злиття гілок кількох розробників, що правили один файл", "rebase, що зачепив ті самі рядки", "pull, коли локальні й віддалені зміни перетинаються"],
  },
  "terminal-grep": {
    accent: "yellow",
    titleEn: "grep",
    titleUa: "Пошук тексту",
    intro: "grep шукає рядки, що відповідають шаблону, у файлі чи потоці даних. Назва — historical: Global Regular Expression Print.",
    simple: "grep знаходить, у яких рядках файлу зустрічається потрібний текст.",
    steps: [
      { title: "Простий пошук у файлі", code: `grep "TODO" app.js`, resultLabel: "Результат:", result: `Виведе кожен рядок файлу app.js, що містить слово "TODO".` },
      { title: "Пошук у всіх файлах директорії", code: `grep -r "TODO" src/`, resultLabel: "Результат:", result: `Той самий пошук, але рекурсивно по всіх файлах усередині src/, з іменем файлу перед кожним збігом.` },
      { title: "Пошук без урахування регістру", code: `grep -i "error" log.txt`, resultLabel: "Результат:", result: `Знайде і "error", і "Error", і "ERROR" — регістр більше не має значення.` },
      { title: "Комбінація з pipe", code: `cat log.txt | grep "500"`, resultLabel: "Результат:", result: `Спочатку виводить увесь файл, потім grep фільтрує лише рядки з "500" (наприклад, помилки сервера).` },
    ],
    usage: ["пошук TODO/FIXME по всьому проєкту", "фільтрація логів сервера за кодом помилки", "перевірка, чи є рядок у конфігураційному файлі"],
  },
  "http-cors": {
    accent: "cyan",
    titleEn: "CORS",
    titleUa: "Міждоменні запити",
    intro: "CORS (Cross-Origin Resource Sharing) — механізм безпеки браузера, що обмежує запити з одного домену до API на іншому домені, якщо сервер явно їх не дозволив.",
    simple: "CORS — це дозвіл від сервера: «так, іншим сайтам можна робити до мене запити».",
    steps: [
      { title: "Типова помилка в консолі", code: `// Запит з https://mysite.com до https://api.other.com`, resultLabel: "Помилка в консолі браузера:", result: `Access to fetch at 'https://api.other.com' from origin 'https://mysite.com' has been blocked by CORS policy` },
      { title: "Чому це сталось", code: `// Сервер api.other.com не додав потрібний заголовок`, resultLabel: "Причина:", result: `Сервер не повернув заголовок Access-Control-Allow-Origin, що дозволяв би саме твій домен робити запити.` },
      { title: "Як сервер це виправляє", code: `// На сервері (приклад для Express):\nres.header("Access-Control-Allow-Origin", "https://mysite.com");`, resultLabel: "Що станеться:", result: `Тепер браузер дозволить сторінці з mysite.com отримувати відповіді від цього сервера.`, note: "CORS налаштовується на СЕРВЕРІ, а не в браузері — з клієнтського коду цю помилку не обійти." },
    ],
    usage: ["фронтенд на одному домені звертається до API на іншому", "локальна розробка (localhost) проти продакшн API", "публічні API, що навмисно дозволяють запити з будь-якого домену (Access-Control-Allow-Origin: *)"],
  },
  "regex-flags": {
    accent: "pink",
    titleEn: "Regex flags",
    titleUa: "Прапорці регулярних виразів",
    intro: "Флаги змінюють поведінку регулярного виразу цілком: скільки збігів шукати, враховувати регістр чи ні, як працюють ^ і $.",
    simple: "флаг — це маленька літера після виразу, що вмикає додаткову поведінку пошуку.",
    steps: [
      { title: "Без флага g — лише перший збіг", code: `const re = /cat/;\nconsole.log("cat cat cat".replace(re, "dog"));`, resultLabel: "Результат:", result: `dog cat cat` },
      { title: "З флагом g — усі збіги", code: `const re = /cat/g;\nconsole.log("cat cat cat".replace(re, "dog"));`, resultLabel: "Результат:", result: `dog dog dog` },
      { title: "Флаг i — без урахування регістру", code: `const re = /cat/i;\nconsole.log(re.test("CAT"));`, resultLabel: "Результат:", result: `true`, note: "Без флага i /cat/.test('CAT') повернув би false." },
      { title: "Комбінація флагів", code: `const re = /cat/gi;\nconsole.log("Cat CAT cat".replace(re, "dog"));`, resultLabel: "Результат:", result: `dog dog dog`, note: "Флаги можна комбінувати в будь-якому порядку: gi те саме, що ig." },
    ],
    usage: ["заміна всіх входжень слова в тексті (g)", "пошук незалежно від регістру введення користувача (i)", "валідація багаторядкового тексту (m)"],
  },
  "vscode-command-palette": {
    accent: "amber",
    titleEn: "Command Palette",
    titleUa: "Палітра команд",
    intro: "Палітра команд — центральний спосіб виконати будь-яку дію VS Code без миші: перейменувати файл, змінити тему, встановити розширення, запустити задачу.",
    simple: "Ctrl+Shift+P відкриває пошук по всіх можливих командах редактора.",
    steps: [
      { title: "Відкрити палітру", code: `// Ctrl + Shift + P`, resultLabel: "Що станеться:", result: `Зверху з'явиться поле пошуку з написом ">" — тепер можна вводити назву будь-якої команди.` },
      { title: "Знайти команду", code: `// Введи: "Format Document"`, resultLabel: "Що станеться:", result: `Список звузиться до команд, що містять ці слова. Enter — виконає обрану.` },
      { title: "Швидке перемикання теми", code: `// Введи: "Color Theme"`, resultLabel: "Що станеться:", result: `З'явиться список усіх встановлених кольорових тем із живим попереднім переглядом при наведенні.` },
      { title: "Без Shift — швидке відкриття файлу", code: `// Ctrl + P (без Shift)`, resultLabel: "Різниця:", result: `Ctrl+P шукає файли за назвою; Ctrl+Shift+P шукає команди редактора — легко переплутати через схожість комбінацій.` },
    ],
    usage: ["форматування файлу без збереженого шорткату", "перемикання теми чи налаштувань", "встановлення розширень пошуком за назвою", "запуск задач (build, test) без термінала"],
  },
  "py-try-except": {
    accent: "lime",
    titleEn: "try / except",
    titleUa: "Обробка винятків",
    intro: "try/except перехоплює помилки під час виконання, щоб програма не «впала» повністю, а могла обробити проблему й продовжити роботу.",
    simple: "try — «спробуй це», except — «якщо не вийшло, зроби ось що».",
    steps: [
      { title: "Без обробки — програма падає", code: `age = int("двадцять")\nprint(age)`, resultLabel: "Результат:", result: `ValueError: invalid literal for int() with base 10: 'двадцять'`, note: "Програма зупиняється тут — рядок print(age) ніколи не виконається." },
      { title: "З обробкою — програма продовжує", code: `try:\n    age = int("двадцять")\nexcept ValueError:\n    print("Це не число!")\n    age = 0`, resultLabel: "Результат:", result: `Це не число!` },
      { title: "Обробка різних помилок окремо", code: `try:\n    result = 10 / user_input\nexcept ZeroDivisionError:\n    print("Не можна ділити на нуль")\nexcept ValueError:\n    print("Введи число")`, resultLabel: "Що станеться:", result: `Кожен тип помилки обробляється своїм повідомленням — залежно від того, що саме пішло не так.` },
      { title: "finally — виконується завжди", code: `try:\n    f = open("data.txt")\nfinally:\n    f.close()`, resultLabel: "Що станеться:", result: `f.close() виконається завжди — і якщо все пройшло добре, і якщо сталась помилка.` },
    ],
    usage: ["валідація введення користувача", "робота з файлами, які можуть не існувати", "мережеві запити, які можуть обірватись", "будь-яка операція, що може провалитись непередбачувано"],
  },
  "sql-groupby": {
    accent: "cyan",
    titleEn: "GROUP BY + HAVING",
    titleUa: "Групування та фільтр груп",
    intro: "GROUP BY об'єднує рядки з однаковим значенням колонки в групи для підрахунку агрегатів. HAVING фільтрує вже готові групи — на відміну від WHERE, що фільтрує рядки до групування.",
    simple: "GROUP BY рахує підсумки по групах; HAVING відсіює групи за результатом підрахунку.",
    steps: [
      { title: "Групування без фільтра", code: `SELECT city, COUNT(*) AS total\nFROM users\nGROUP BY city;`, resultLabel: "Що поверне:", result: `Список міст з кількістю користувачів у кожному — по одному рядку на кожне унікальне місто.` },
      { title: "WHERE — фільтр ДО групування", code: `SELECT city, COUNT(*) AS total\nFROM users\nWHERE age >= 18\nGROUP BY city;`, resultLabel: "Що поверне:", result: `Те саме, але рахує лише повнолітніх користувачів — фільтрація сталась до підрахунку.` },
      { title: "HAVING — фільтр ПІСЛЯ групування", code: `SELECT city, COUNT(*) AS total\nFROM users\nGROUP BY city\nHAVING COUNT(*) > 100;`, resultLabel: "Що поверне:", result: `Лише міста, де total (кількість користувачів) більше 100 — фільтр застосовується вже до результату підрахунку.`, note: "WHERE не може використати COUNT(*), бо на момент його виконання групи ще не існують — тому й потрібен окремий HAVING." },
    ],
    usage: ["звіти «топ міст за кількістю клієнтів»", "знайти категорії товарів із продажами вище певного порогу", "будь-яка аналітика на кшталт «групи, де щось перевищує N»"],
  },
  "html-img": {
    accent: "orange",
    titleEn: "Img",
    titleUa: "Зображення",
    intro: "img вставляє зображення на сторінку. Це самозакривний тег (без </img>), і в нього немає «поведінки» — лише атрибути, що визначають, яке зображення й як його показати.",
    simple: "img — це рамка, куди браузер вставляє картинку за вказаною адресою.",
    steps: [
      { title: "Базове зображення", code: `<img src="cat.jpg" alt="Рудий кіт на підвіконні">`, resultLabel: "Що з'явиться:", result: `Картинка на сторінці. Якщо файл не завантажиться — покажеться текст з alt замість неї.` },
      { title: "Розміри наперед — проти «стрибків» сторінки", code: `<img src="cat.jpg" alt="Кіт" width="400" height="300">`, resultLabel: "Що станеться:", result: `Браузер одразу резервує місце під картинку розміром 400×300, ще до її завантаження — сторінка не «підстрибує».` },
      { title: "Лінива підвантаженість", code: `<img src="cat.jpg" alt="Кіт" loading="lazy">`, resultLabel: "Що станеться:", result: `Зображення завантажиться лише тоді, коли користувач докрутить майже до нього — економить трафік на довгих сторінках.` },
    ],
    usage: ["фото товарів", "ілюстрації в статтях", "аватари користувачів", "будь-яке растрове зображення на сторінці"],
  },
  "js-reduce": {
    accent: "violet",
    titleEn: "reduce()",
    titleUa: "Згортання масиву",
    intro: "reduce() проходить по всьому масиву й «згортає» його в одне підсумкове значення — суму, максимум, новий об'єкт чи що завгодно. Це найгнучкіший, але й найскладніший для розуміння метод масивів.",
    simple: "reduce() перетворює цілий масив на одне число, рядок чи об'єкт.",
    steps: [
      { title: "Сума всіх чисел", code: `const nums = [1, 2, 3, 4];\nconst sum = nums.reduce((acc, x) => acc + x, 0);\nconsole.log(sum);`, resultLabel: "Результат:", result: `10`, note: "acc (акумулятор) — це проміжний підсумок, що переноситься з ітерації в ітерацію. 0 — початкове значення acc." },
      { title: "Як це відбувається покроково", code: `// acc=0, x=1 → acc=1\n// acc=1, x=2 → acc=3\n// acc=3, x=3 → acc=6\n// acc=6, x=4 → acc=10`, resultLabel: "Пояснення:", result: `Кожен виклик функції отримує попередній acc і поточний елемент, повертає новий acc.` },
      { title: "Знайти максимум", code: `const max = nums.reduce((acc, x) => x > acc ? x : acc);\nconsole.log(max);`, resultLabel: "Результат:", result: `4`, note: "Без початкового значення acc — перший елемент масиву стає стартовим acc." },
      { title: "Згорнути масив в об'єкт", code: `const counts = ["a", "b", "a"].reduce((acc, x) => {\n  acc[x] = (acc[x] || 0) + 1;\n  return acc;\n}, {});\nconsole.log(counts);`, resultLabel: "Результат:", result: `▼ {a: 2, b: 1}` },
    ],
    usage: ["підрахунок суми/середнього в кошику покупок", "групування даних за категорією", "перетворення масиву в об'єкт чи Map", "будь-яке «згортання» списку в одне значення"],
  },
  "css-position": {
    accent: "teal",
    titleEn: "position",
    titleUa: "Позиціонування",
    intro: "position визначає, як саме браузер розташовує елемент: у звичайному потоці сторінки чи «виривається» з нього для точного контролю координат.",
    simple: "position каже елементу, відносно чого рахувати свої top/left/right/bottom.",
    steps: [
      { title: "static — типова поведінка", code: `.box {\n  position: static;\n}`, resultLabel: "Що станеться:", result: `Елемент стоїть у звичайному потоці сторінки. top/left/right/bottom не діють.` },
      { title: "relative — зсув від свого місця", code: `.box {\n  position: relative;\n  top: 10px;\n  left: 10px;\n}`, resultLabel: "Що станеться:", result: `Елемент зсунеться на 10px вниз і вправо від того місця, де мав би бути — але простір під нього все одно зарезервовано.` },
      { title: "absolute — відносно найближчого relative-предка", code: `.parent { position: relative; }\n.child {\n  position: absolute;\n  top: 0;\n  right: 0;\n}`, resultLabel: "Що станеться:", result: `.child приліпить до правого верхнього кута .parent, повністю вийшовши зі звичайного потоку.`, note: "Якщо в жодного предка немає position: relative, absolute орієнтується на всю сторінку." },
      { title: "fixed — прилипає до вікна браузера", code: `.box {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n}`, resultLabel: "Що станеться:", result: `Елемент лишається на тому самому місці екрана навіть під час прокручування сторінки.` },
      { title: "sticky — прилипає під час скролу", code: `.box {\n  position: sticky;\n  top: 0;\n}`, resultLabel: "Що станеться:", result: `Елемент рухається як звичайний, поки не досягне top: 0, а потім «прилипає» й далі скролиться разом зі сторінкою.` },
    ],
    usage: ["фіксована шапка сайту зверху", "бейдж чи іконка в кутку картки", "модальні вікна поверх усього вмісту", "sticky-заголовки таблиць чи секцій меню"],
  },
  "html-table": {
    accent: "orange",
    titleEn: "Table",
    titleUa: "Таблиця",
    intro: "table — це структура для табличних даних: рядків і колонок. thead/tbody групують рядки за роллю, th позначає заголовки, td — звичайні комірки.",
    simple: "table — це сітка з рядків і колонок для показу структурованих даних.",
    steps: [
      { title: "Базова таблиця", code: `<table>\n  <tr>\n    <th>Товар</th><th>Ціна</th>\n  </tr>\n  <tr>\n    <td>Хліб</td><td>25</td>\n  </tr>\n</table>`, resultLabel: "Що з'явиться:", result: `Товар | Ціна\nХліб  | 25` },
      { title: "З групуванням thead/tbody", code: `<table>\n  <thead>\n    <tr><th>Товар</th><th>Ціна</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Хліб</td><td>25</td></tr>\n  </tbody>\n</table>`, resultLabel: "Що станеться:", result: `Візуально так само, але браузер і CSS тепер розрізняють «шапку» й «тіло» таблиці — зручно для стилізації.` },
      { title: "Об'єднання комірок", code: `<tr>\n  <td colspan="2">Займає 2 колонки</td>\n</tr>`, resultLabel: "Що станеться:", result: `Одна комірка розтягнеться на ширину двох сусідніх колонок.`, note: "rowspan робить те саме, але по вертикалі — для рядків." },
    ],
    usage: ["таблиці цін чи порівняння тарифів", "розклади й календарі", "фінансові звіти", "будь-які дані у форматі рядків/колонок"],
  },
  "git-rebase": {
    accent: "red",
    titleEn: "git rebase",
    titleUa: "Перебазування гілки",
    intro: "git rebase переносить коміти твоєї гілки на нову базову точку, роблячи історію лінійною — на відміну від merge, який додає окремий «коміт злиття».",
    simple: "rebase переписує історію так, ніби ти почала гілку з найновішого коду, а не старого.",
    steps: [
      { title: "Типова ситуація", code: `# Ти в гілці feature, main оновився з часу,\n# коли ти від неї відгалузилась`, resultLabel: "Проблема:", result: `Твоя feature-гілка «відстала» від main — в ній немає нових комітів з main.` },
      { title: "Виконуємо rebase", code: `git checkout feature\ngit rebase main`, resultLabel: "Що станеться:", result: `Git «переграває» кожен твій коміт з feature поверх найновішого стану main, ніби ти щойно відгалузилась.` },
      { title: "Порівняння з merge", code: `git merge main   # додає окремий merge-коміт\ngit rebase main  # переписує історію, без merge-коміту`, resultLabel: "Різниця:", result: `merge зберігає реальний хід подій (з розгалуженнями); rebase дає чисту, лінійну історію, але переписує хеші комітів.`, note: "Ніколи не роби rebase гілки, яку вже бачили інші люди (спільну, запушену) — це поламає їхню історію." },
    ],
    usage: ["почистити історію feature-гілки перед pull request", "синхронізувати гілку з main без зайвих merge-комітів", "інтерактивний rebase для об'єднання/редагування кількох комітів"],
  },
  "terminal-chmod": {
    accent: "yellow",
    titleEn: "chmod",
    titleUa: "Права доступу до файлу",
    intro: "У Linux/macOS кожен файл має права доступу: хто може його читати (r), змінювати (w) і виконувати (x). chmod змінює ці права.",
    simple: "chmod каже системі, хто і що може робити з файлом.",
    steps: [
      { title: "Дозволити виконання файлу", code: `chmod +x script.sh`, resultLabel: "Що станеться:", result: `Файл script.sh стає виконуваним — тепер його можна запустити командою ./script.sh.` },
      { title: "Перевірити поточні права", code: `ls -l script.sh`, resultLabel: "Результат:", result: `-rwxr-xr-x 1 user user 120 Sep 16 script.sh`, note: "rwx означає read+write+execute для власника; далі йдуть права групи й усіх інших." },
      { title: "Забрати право на виконання", code: `chmod -x script.sh`, resultLabel: "Що станеться:", result: `Файл перестає бути виконуваним — запуск ./script.sh поверне «Permission denied».` },
    ],
    usage: ["зробити свій скрипт (deploy.sh, build.sh) запускним", "налаштування прав на сервері", "виправлення помилки «Permission denied» при запуску файлу"],
  },
  "http-put-patch": {
    accent: "cyan",
    titleEn: "PUT vs PATCH",
    titleUa: "PUT проти PATCH",
    intro: "Обидва методи оновлюють існуючий ресурс на сервері, але по-різному: PUT очікує повний новий об'єкт, PATCH — лише ті поля, які треба змінити.",
    simple: "PUT — заміни все повністю; PATCH — онови лише вказане.",
    steps: [
      { title: "PUT — повна заміна", code: `PUT /users/5\n{ "name": "Оля", "age": 26, "city": "Київ" }`, resultLabel: "Що станеться:", result: `Користувач 5 повністю замінюється цими даними. Якщо забути поле city — воно зникне (стане порожнім).` },
      { title: "PATCH — часткове оновлення", code: `PATCH /users/5\n{ "age": 26 }`, resultLabel: "Що станеться:", result: `Зміниться лише поле age. Усі інші поля (name, city) лишаться такими, якими були.` },
      { title: "Коли що використовувати", code: `// Оновлюєш увесь профіль одразу → PUT\n// Змінюєш лише один параметр (напр. статус) → PATCH`, resultLabel: "Правило:", result: `PATCH безпечніший для часткових змін — менше шансів випадково стерти дані, яких не мала торкатись.` },
    ],
    usage: ["форма редагування повного профілю користувача (PUT)", "швидка зміна одного поля, напр. статусу замовлення (PATCH)", "REST API для будь-якого ресурсу, що можна оновлювати"],
  },
  "regex-lookahead": {
    accent: "pink",
    titleEn: "Lookahead",
    titleUa: "Випередження",
    intro: "Lookahead (?=...) перевіряє, що йде далі в рядку, не включаючи це в сам знайдений збіг. Це дозволяє шукати щось «перед умовою», не «захоплюючи» саму умову.",
    simple: "lookahead — це «перевір, що там далі, але не забирай це з собою».",
    steps: [
      { title: "Знайти число перед словом «грн»", code: `const re = /\\d+(?=грн)/;\nconsole.log("100грн".match(re)[0]);`, resultLabel: "Результат:", result: `100`, note: "У збіг потрапило лише число, а не слово «грн» — саме в цьому суть lookahead." },
      { title: "Без lookahead — для порівняння", code: `const re2 = /\\d+грн/;\nconsole.log("100грн".match(re2)[0]);`, resultLabel: "Результат:", result: `100грн`, note: "Звичайна група захоплює і число, і саме слово «грн» разом." },
      { title: "Негативний lookahead (?!...)", code: `const re3 = /\\d+(?!грн)/;\nconsole.log("100USD".match(re3)[0]);`, resultLabel: "Результат:", result: `100`, note: "(?!грн) означає «далі НЕ йде грн» — спрацює для 100USD, але не для 100грн." },
    ],
    usage: ["валідація пароля (є цифра, ЩЕ є велика літера, обидва — не захоплюючи їх окремо)", "витягування числа перед конкретною одиницею виміру", "складніші правила пошуку, де порядок символів важливий, а частина шаблону не має входити в результат"],
  },
  "vscode-multicursor": {
    accent: "amber",
    titleEn: "Multi-cursor editing",
    titleUa: "Редагування кількома курсорами",
    intro: "Ctrl+D дозволяє виділити наступне входження того самого слова й редагувати всі однакові місця одночасно — дуже швидше за ручну заміну кожного вручну.",
    simple: "Ctrl+D додає ще один курсор на наступному однаковому слові.",
    steps: [
      { title: "Виділи слово", code: `const price = 100;\nconst total = price * 2;`, resultLabel: "Дія:", result: `Двічі клікни на слово "price" у першому рядку, щоб виділити його.` },
      { title: "Натисни Ctrl+D", code: `// Ctrl + D`, resultLabel: "Що станеться:", result: `З'явиться ДРУГИЙ курсор на наступному входженні слова "price" — тепер обидва виділені одночасно.` },
      { title: "Редагуй одразу всюди", code: `// Просто почни друкувати нове ім'я\nconst cost = 100;\nconst total = cost * 2;`, resultLabel: "Результат:", result: `Обидва входження "price" замінились на "cost" одночасно, одним рухом.`, note: "Продовжуй тиснути Ctrl+D, щоб додавати ще курсори на наступні входження того самого слова." },
    ],
    usage: ["перейменування змінної в межах кількох рядків без пошуку/заміни", "редагування списку схожих рядків одночасно", "швидке додавання однакового префікса/суфікса до кількох рядків"],
  },
  "py-comprehension": {
    accent: "lime",
    titleEn: "List comprehension",
    titleUa: "Стиснене створення списку",
    intro: "List comprehension — компактний спосіб створити новий список за один рядок, замість циклу for з append().",
    simple: "це цикл for і append(), стиснуті в один вираз у квадратних дужках.",
    steps: [
      { title: "Звичайний цикл (довгий спосіб)", code: `squares = []\nfor x in range(5):\n    squares.append(x**2)\nprint(squares)`, resultLabel: "Результат:", result: `[0, 1, 4, 9, 16]` },
      { title: "Те саме через comprehension", code: `squares = [x**2 for x in range(5)]\nprint(squares)`, resultLabel: "Результат:", result: `[0, 1, 4, 9, 16]`, note: "Той самий результат, в одному рядку замість чотирьох." },
      { title: "З умовою if", code: `evens = [x for x in range(10) if x % 2 == 0]\nprint(evens)`, resultLabel: "Результат:", result: `[0, 2, 4, 6, 8]` },
      { title: "Коли НЕ використовувати", code: `# Якщо логіка складна — краще звичайний цикл\nresult = [complex_transform(x) for x in data if check_a(x) if check_b(x)]`, resultLabel: "Порада:", result: `Занадто довгий/складний comprehension важче читати, ніж звичайний цикл — тоді краще розгорнути назад у for.` },
    ],
    usage: ["швидке перетворення чи фільтрація списку", "обробка даних з файлу чи API в один рядок", "заміна короткого циклу for + append()"],
  },
  "sql-join": {
    accent: "cyan",
    titleEn: "JOIN",
    titleUa: "Об'єднання таблиць",
    intro: "JOIN об'єднує рядки з двох таблиць за спільним ключем (зазвичай — зовнішнім ключем, що посилається на первинний ключ іншої таблиці).",
    simple: "JOIN зшиває дані з двох таблиць в один результат за спільним стовпцем.",
    steps: [
      { title: "INNER JOIN — лише збіги", code: `SELECT users.name, orders.total\nFROM users\nINNER JOIN orders ON users.id = orders.user_id;`, resultLabel: "Що поверне:", result: `Лише користувачів, у яких Є хоча б одне замовлення. Користувачі без замовлень не потраплять у результат.` },
      { title: "LEFT JOIN — усі з лівої таблиці", code: `SELECT users.name, orders.total\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id;`, resultLabel: "Що поверне:", result: `Усіх користувачів, навіть без жодного замовлення — для них orders.total буде NULL.` },
      { title: "Порівняння INNER і LEFT", code: `// INNER JOIN: тільки перетин двох таблиць\n// LEFT JOIN: усе з лівої таблиці + перетин`, resultLabel: "Різниця:", result: `INNER — «покажи тільки те, що є в обох»; LEFT — «покажи все з першої таблиці, і доклей дані з другої де є».` },
    ],
    usage: ["з'єднати замовлення з даними користувача", "звіти, що поєднують дані з кількох таблиць", "знайти записи БЕЗ пари в іншій таблиці (LEFT JOIN + WHERE ... IS NULL)"],
  },
  "html-input": {
    accent: "orange",
    titleEn: "Input",
    titleUa: "Поле вводу",
    intro: "input — універсальне поле для введення даних користувачем. Тип поля (text, email, checkbox...) задається атрибутом type і сильно змінює його поведінку й вигляд.",
    simple: "input — це коробочка, куди користувач щось вводить чи щось вибирає.",
    steps: [
      { title: "Текстове поле", code: `<input type="text" placeholder="Введи ім'я">`, resultLabel: "Що з'явиться:", result: `Порожнє поле для тексту із сірим текстом-підказкою всередині, поки нічого не введено.` },
      { title: "Поле email з валідацією", code: `<input type="email" required>`, resultLabel: "Що станеться:", result: `Браузер сам перевірить, що введено щось схоже на адресу email, і не дасть відправити форму, якщо ні.` },
      { title: "Чекбокс, позначений заздалегідь", code: `<input type="checkbox" checked>`, resultLabel: "Що з'явиться:", result: `Прапорець, який уже позначений (галочка стоїть) з першого показу сторінки.` },
      { title: "Читання значення в JavaScript", code: `const value = document.querySelector('input').value;\nconsole.log(value);`, resultLabel: "Результат у консолі:", result: `Те, що фактично ввів користувач у поле, рядком.` },
    ],
    usage: ["форми входу й реєстрації", "пошук на сайті", "фільтри товарів (чекбокси, радіо)", "будь-яке текстове чи числове введення"],
  },
  "html-label": {
    accent: "orange",
    titleEn: "Label",
    titleUa: "Підпис поля",
    intro: "label — текстовий підпис, пов'язаний із конкретним полем форми через атрибут for (або обгортанням). Клік по підпису одразу фокусує поле — це і зручність, і доступність.",
    simple: "label — це напис біля поля, клік по якому одразу ставить курсор у саме поле.",
    steps: [
      { title: "Зв'язок через for / id", code: `<label for="email">Email:</label>\n<input id="email" type="email">`, resultLabel: "Що станеться:", result: `Клік по слову «Email:» одразу активує (фокусує) поле вводу поруч.` },
      { title: "Обгортання замість for", code: `<label>\n  Email:\n  <input type="email">\n</label>`, resultLabel: "Що станеться:", result: `Той самий ефект — input усередині label пов'язується автоматично, навіть без id.` },
      { title: "Без label — погана практика", code: `Email: <input type="email">`, resultLabel: "Що станеться:", result: `Слово «Email:» — просто текст. Клік по ньому нічого не робить.`, note: "Скрінрідер не зможе оголосити призначення поля без прив'язаного label." },
    ],
    usage: ["будь-яке поле форми, де потрібен підпис", "доступність для людей, що користуються скрінрідером", "більша клікабельна область для чекбоксів і радіо на мобільних"],
  },
  "html-list": {
    accent: "orange",
    titleEn: "List",
    titleUa: "Список",
    intro: "ul (unordered list) — маркований список, ol (ordered list) — нумерований. Кожен окремий пункт — це тег li всередині одного з них.",
    simple: "список — це перелік пунктів, кожен на новому рядку, з маркером чи номером.",
    steps: [
      { title: "Маркований список", code: `<ul>\n  <li>Хліб</li>\n  <li>Молоко</li>\n</ul>`, resultLabel: "Що з'явиться:", result: `• Хліб\n• Молоко` },
      { title: "Нумерований список", code: `<ol>\n  <li>Перший крок</li>\n  <li>Другий крок</li>\n</ol>`, resultLabel: "Що з'явиться:", result: `1. Перший крок\n2. Другий крок` },
      { title: "Вкладений список", code: `<ul>\n  <li>Фрукти\n    <ul><li>Яблуко</li></ul>\n  </li>\n</ul>`, resultLabel: "Що з'явиться:", result: `Фрукти\n   • Яблуко`, note: "Вкладений ul/ol завжди має лежати всередині li батьківського списку, а не поруч із ним." },
    ],
    usage: ["меню навігації сайту", "списки покупок чи завдань", "кроки інструкції", "будь-який перелік однотипних пунктів"],
  },
  "html-header": {
    accent: "orange",
    titleEn: "Header",
    titleUa: "Шапка",
    intro: "header — семантичний блок для шапки сторінки чи окремої секції: зазвичай логотип, назва й навігація.",
    simple: "header — це верхня частина сторінки чи блоку з головною вступною інформацією.",
    steps: [
      { title: "Шапка всієї сторінки", code: `<header>\n  <h1>Мій сайт</h1>\n  <nav>...</nav>\n</header>`, resultLabel: "Що з'явиться:", result: `Назва сайту й меню зверху сторінки.` },
      { title: "Шапка окремої секції", code: `<article>\n  <header><h2>Заголовок статті</h2></header>\n  <p>Текст статті...</p>\n</article>`, resultLabel: "Що станеться:", result: `header можна використовувати не лише для всієї сторінки, а й усередині article чи section.`, note: "Не плутай з <head> — це зовсім інший, службовий тег усередині <html>, невидимий на сторінці." },
    ],
    usage: ["шапка сайту з логотипом і меню", "заголовок статті чи картки товару", "повторюваний верхній блок на кожній сторінці"],
  },
  "html-nav": {
    accent: "orange",
    titleEn: "Nav",
    titleUa: "Навігація",
    intro: "nav позначає блок з основними навігаційними посиланнями сайту — саме навігацію, а не будь-яку довільну групу посилань.",
    simple: "nav — це блок з посиланнями для переміщення сайтом.",
    steps: [
      { title: "Основне меню сайту", code: `<nav>\n  <a href="/">Головна</a>\n  <a href="/about">Про нас</a>\n</nav>`, resultLabel: "Що з'явиться:", result: `Список клікабельних посилань меню в ряд або стовпчик.` },
      { title: "Кілька nav на одній сторінці", code: `<nav aria-label="Головне меню">...</nav>\n<nav aria-label="Хлібні крихти">...</nav>`, resultLabel: "Що станеться:", result: `aria-label дозволяє скрінрідеру розрізнити, який саме nav він зараз оголошує.` },
    ],
    usage: ["головне меню сайту", "бічна навігація в документації", "хлібні крихти (breadcrumbs)", "пагінація списку сторінок"],
  },
  "html-main": {
    accent: "orange",
    titleEn: "Main",
    titleUa: "Головний вміст",
    intro: "main містить унікальний головний вміст сторінки — те, що відрізняє її від решти сторінок сайту. На сторінці має бути рівно один main.",
    simple: "main — це те головне, заради чого людина прийшла саме на цю сторінку.",
    steps: [
      { title: "Типова структура сторінки", code: `<body>\n  <header>...</header>\n  <main>\n    <h1>Стаття</h1>\n    <p>Текст...</p>\n  </main>\n  <footer>...</footer>\n</body>`, resultLabel: "Що станеться:", result: `Скрінрідер і пошуковик одразу розуміють, де саме головний вміст, минаючи повторювані на кожній сторінці header і footer.`, note: "Кілька <main> на одній сторінці — помилка розмітки, якої слід уникати." },
    ],
    usage: ["контент статті чи картки товару", "унікальний вміст кожної окремої сторінки", "посилання «пропустити до вмісту» для доступності"],
  },
  "html-footer": {
    accent: "orange",
    titleEn: "Footer",
    titleUa: "Підвал",
    intro: "footer — блок наприкінці сторінки чи секції: контакти, копірайт, посилання на соцмережі.",
    simple: "footer — це нижня частина сторінки з додатковою інформацією.",
    steps: [
      { title: "Підвал сторінки", code: `<footer>\n  <p>© 2026 Мій сайт</p>\n  <a href="/privacy">Політика конфіденційності</a>\n</footer>`, resultLabel: "Що з'явиться:", result: `Рядок копірайту й посилання внизу сторінки.` },
    ],
    usage: ["копірайт і юридична інформація", "контактні дані", "посилання на соцмережі", "підвал окремої картки чи статті"],
  },
  "html-section": {
    accent: "orange",
    titleEn: "Section",
    titleUa: "Секція",
    intro: "section групує тематично пов'язаний вміст, зазвичай зі своїм заголовком. На відміну від div, section має смислове значення для структури документа.",
    simple: "section — це тематичний блок сторінки зі своєю темою й заголовком.",
    steps: [
      { title: "Тематична секція", code: `<section>\n  <h2>Наші послуги</h2>\n  <p>Опис послуг...</p>\n</section>`, resultLabel: "Що станеться:", result: `Блок сприймається як окрема тематична частина сторінки, а не просто контейнер для стилів.`, note: "Якщо блоку не підходить заголовок — це, ймовірно, має бути div, а не section." },
    ],
    usage: ["блок «Про нас» на сайті", "розділ «Відгуки клієнтів»", "будь-яка тематична частина довгої сторінки"],
  },
  "js-array": {
    accent: "violet",
    titleEn: "Array",
    titleUa: "Масив",
    intro: "Масив — це структура даних, яка зберігає кілька значень в одному місці. Кожен елемент має свій індекс (починається з 0).",
    simple: "масив — це список, де можна зберігати багато значень.",
    steps: [
      { title: "Створення масиву", code: `const fruits = ["яблуко", "банан", "апельсин"];`, resultLabel: "Результат:", result: `▼ (3) ["яблуко", "банан", "апельсин"]\n   0: "яблуко"\n   1: "банан"\n   2: "апельсин"\n   length: 3` },
      { title: "Доступ до елементів", code: `console.log(fruits[0]); // яблуко\nconsole.log(fruits[1]); // банан\nconsole.log(fruits[2]); // апельсин`, resultLabel: "Результат у консолі:", result: `яблуко\nбанан\nапельсин` },
      { title: "Метод unshift() — додає елемент на початок", code: `fruits.unshift("груша");\nconsole.log(fruits);`, resultLabel: "Результат:", result: `▼ (4) ["груша", "яблуко", "банан", "апельсин"]\n   0: "груша"\n   1: "яблуко"\n   2: "банан"\n   3: "апельсин"\n   length: 4` },
      { title: "Метод map() — створює новий масив", code: `const upperFruits = fruits.map(fruit => fruit.toUpperCase());\nconsole.log(upperFruits);`, resultLabel: "Результат:", result: `▼ (4) ["ГРУША", "ЯБЛУКО", "БАНАН", "АПЕЛЬСИН"]\n   0: "ГРУША"\n   1: "ЯБЛУКО"\n   2: "БАНАН"\n   3: "АПЕЛЬСИН"\n   length: 4`, note: "map() не змінює оригінальний масив, а повертає новий." },
      { title: "Метод forEach() — перебирає елементи", code: `fruits.forEach(fruit => console.log(fruit));`, resultLabel: "Результат у консолі:", result: `груша\nяблуко\nбанан\nапельсин` },
    ],
    usage: ["списки товарів", "користувачі", "числа", "назви", "меню", "будь-які дані, які потрібно зберігати групою"],
  },
  "js-object": {
    accent: "sky",
    titleEn: "Object",
    titleUa: "Об'єкт",
    intro: "Об'єкт — це структура даних, яка групує пов'язані значення під іменованими властивостями (ключами), а не під числовими індексами, як масив.",
    simple: "об'єкт — це набір підписаних значень: «ім'я → значення».",
    steps: [
      { title: "Створення об'єкта", code: `const user = {\n  name: "Оля",\n  age: 25,\n  city: "Київ"\n};\nconsole.log(user);`, resultLabel: "Результат:", result: `▼ {name: "Оля", age: 25, city: "Київ"}\n   name: "Оля"\n   age: 25\n   city: "Київ"` },
      { title: "Доступ до властивостей", code: `console.log(user.name);\nconsole.log(user["age"]);`, resultLabel: "Результат у консолі:", result: `Оля\n25` },
      { title: "Object.keys() — усі ключі об'єкта", code: `console.log(Object.keys(user));`, resultLabel: "Результат:", result: `▼ (3) ["name", "age", "city"]\n   0: "name"\n   1: "age"\n   2: "city"` },
      { title: "Додавання нової властивості", code: `user.email = "olya@example.com";\nconsole.log(user);`, resultLabel: "Результат:", result: `▼ {name: "Оля", age: 25, city: "Київ", email: "olya@example.com"}`, note: "Об'єкти можна доповнювати новими властивостями будь-коли після створення." },
      { title: "Деструктуризація", code: `const { name, age } = user;\nconsole.log(name, age);`, resultLabel: "Результат у консолі:", result: `Оля 25` },
    ],
    usage: ["дані користувача", "налаштування застосунку", "відповіді API у форматі JSON", "конфігурація проєкту", "будь-які пов'язані дані під одним іменем"],
  },
  "css-flexbox": {
    accent: "teal",
    titleEn: "Flexbox",
    titleUa: "Флексбокс",
    intro: "Flexbox — спосіб розташувати елементи в ряд або колонку так, щоб вони гнучко ділили доступний простір між собою.",
    simple: "flexbox — це коли елементи вишиковуються в ряд і самі підлаштовуються під розмір екрана.",
    steps: [
      { title: "Вмикаємо flex-контейнер", code: `.row {\n  display: flex;\n}`, resultLabel: "Що станеться:", result: `Дочірні елементи .row вишикуються в ряд один за одним замість стовпчика.` },
      { title: "Відступ між елементами", code: `.row {\n  display: flex;\n  gap: 16px;\n}`, resultLabel: "Що станеться:", result: `Між кожною парою сусідніх елементів з'явиться відступ 16px.` },
      { title: "Вирівнювання по центру", code: `.row {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`, resultLabel: "Що станеться:", result: `Елементи стануть рівно по центру контейнера і горизонтально, і вертикально.` },
      { title: "Напрямок — колонка", code: `.row {\n  display: flex;\n  flex-direction: column;\n}`, resultLabel: "Що станеться:", result: `Елементи вишикуються один під одним замість ряду.`, note: "При column: justify-content керує вертикаллю, align-items — горизонталлю (осі міняються місцями)." },
      { title: "Перенесення рядків", code: `.row {\n  display: flex;\n  flex-wrap: wrap;\n}`, resultLabel: "Що станеться:", result: `Елементи, що не вміщаються в один рядок, переходять на новий замість стискання.` },
    ],
    usage: ["навігаційні меню", "картки товарів у ряд", "центрування будь-чого на сторінці", "панелі кнопок", "адаптивні макети сторінок"],
  },
  "html-form": {
    accent: "orange",
    titleEn: "Form",
    titleUa: "Форма",
    intro: "Форма — це спосіб зібрати дані від користувача (текст, вибір, файли) і відправити їх далі: на сервер або в обробку JavaScript.",
    simple: "форма — це набір полів, куди користувач щось вводить, і кнопка, яка це відправляє.",
    steps: [
      { title: "Базова форма", code: `<form>\n  <input type="text" name="username">\n  <button>Відправити</button>\n</form>`, resultLabel: "Що з'явиться на сторінці:", result: `Поле для тексту та кнопка «Відправити» поруч.` },
      { title: "Підпис через label", code: `<label for="username">Ім'я:</label>\n<input id="username" type="text">`, resultLabel: "Що станеться:", result: `Клік по тексту «Ім'я:» одразу ставить курсор у поле вводу.` },
      { title: "Обов'язкове поле", code: `<input type="email" required>`, resultLabel: "Що станеться:", result: `Форма не відправиться, поки поле email порожнє — браузер сам покаже підказку заповнити його.` },
      { title: "Група radio — вибір одного варіанту", code: `<input type="radio" name="plan" value="free"> Безкоштовно\n<input type="radio" name="plan" value="pro"> Pro`, resultLabel: "Що станеться:", result: `Можна вибрати лише один з двох варіантів.`, note: "Однакове ім'я name у обох input — ось що робить варіанти взаємовиключними." },
      { title: "Обробка відправки в JavaScript", code: `document.querySelector("form").addEventListener("submit", e => {\n  e.preventDefault();\n  console.log("Форму відправлено!");\n});`, resultLabel: "Результат у консолі:", result: `Форму відправлено!` },
    ],
    usage: ["форми входу й реєстрації", "пошук на сайті", "оформлення замовлення", "опитування та анкети", "будь-яке введення даних користувачем"],
  },
  "py-list": {
    accent: "lime",
    titleEn: "List",
    titleUa: "Список",
    intro: "list — це впорядкована змінювана колекція значень у Python, аналог масиву в JavaScript.",
    simple: "список — це набір значень підряд, які можна змінювати: додавати, видаляти, сортувати.",
    steps: [
      { title: "Створення списку", code: `fruits = ["яблуко", "банан", "апельсин"]\nprint(fruits)`, resultLabel: "Результат:", result: `['яблуко', 'банан', 'апельсин']` },
      { title: "Доступ за індексом", code: `print(fruits[0])\nprint(fruits[-1])`, resultLabel: "Результат:", result: `яблуко\nапельсин`, note: "-1 означає «останній елемент» — зручно, коли не хочеш рахувати довжину списку." },
      { title: "Додавання елемента", code: `fruits.append("груша")\nprint(fruits)`, resultLabel: "Результат:", result: `['яблуко', 'банан', 'апельсин', 'груша']` },
      { title: "List comprehension — новий список", code: `upper_fruits = [f.upper() for f in fruits]\nprint(upper_fruits)`, resultLabel: "Результат:", result: `['ЯБЛУКО', 'БАНАН', 'АПЕЛЬСИН', 'ГРУША']` },
      { title: "Перебір циклом for", code: `for fruit in fruits:\n    print(fruit)`, resultLabel: "Результат:", result: `яблуко\nбанан\nапельсин\nгруша` },
    ],
    usage: ["списки покупок чи завдань", "результати запитів до бази даних", "дані, зчитані з файлу чи API", "будь-яка впорядкована колекція значень"],
  },
  "sql-select": {
    accent: "cyan",
    titleEn: "SELECT",
    titleUa: "Вибірка даних",
    intro: "SELECT — головна команда SQL: вона читає й повертає дані з однієї чи кількох таблиць бази даних.",
    simple: "SELECT — це «покажи мені дані», з таблиці бази даних.",
    steps: [
      { title: "Вибрати всі колонки", code: `SELECT * FROM users;`, resultLabel: "Що поверне:", result: `Усі колонки й усі рядки таблиці users.` },
      { title: "Вибрати конкретні колонки", code: `SELECT name, age FROM users;`, resultLabel: "Що поверне:", result: `Лише колонки name і age для кожного рядка — решта колонок не показуються.` },
      { title: "Фільтр WHERE", code: `SELECT * FROM users\nWHERE age >= 18;`, resultLabel: "Що поверне:", result: `Лише ті рядки, де значення age дорівнює 18 або більше.` },
      { title: "Сортування ORDER BY", code: `SELECT * FROM users\nORDER BY age DESC;`, resultLabel: "Що поверне:", result: `Ті самі рядки, відсортовані від найстаршого користувача до наймолодшого.`, note: "DESC — за спаданням; ASC (за замовчуванням) — за зростанням." },
      { title: "Обмеження LIMIT", code: `SELECT * FROM users\nLIMIT 5;`, resultLabel: "Що поверне:", result: `Лише перші 5 рядків результату запиту.` },
    ],
    usage: ["звіти й аналітика", "пошук даних для сторінки сайту", "адмін-панелі", "будь-яке читання даних з бази даних"],
  },
};

const ENGLISH_WORDS = [
  { en: "variable", ua: "змінна", ex_en: "This variable stores the user's name.", ex_ua: "Ця змінна зберігає ім'я користувача." },
  { en: "function", ua: "функція", ex_en: "Call the function to get the result.", ex_ua: "Виклич функцію, щоб отримати результат." },
  { en: "array", ua: "масив", ex_en: "Loop through the array of items.", ex_ua: "Пройдись циклом по масиву елементів." },
  { en: "object", ua: "об'єкт", ex_en: "The object has three properties.", ex_ua: "Об'єкт має три властивості." },
  { en: "string", ua: "рядок (текстовий тип)", ex_en: "Convert the number to a string.", ex_ua: "Перетвори число на рядок." },
  { en: "boolean", ua: "логічний тип (true/false)", ex_en: "isActive is a boolean value.", ex_ua: "isActive — це логічне значення." },
  { en: "loop", ua: "цикл", ex_en: "Use a loop to repeat this action.", ex_ua: "Використай цикл, щоб повторити цю дію." },
  { en: "condition", ua: "умова", ex_en: "Check the condition before proceeding.", ex_ua: "Перевір умову перед тим, як продовжити." },
  { en: "error", ua: "помилка", ex_en: "The console shows an error message.", ex_ua: "Консоль показує повідомлення про помилку." },
  { en: "bug", ua: "баг / дефект у коді", ex_en: "We found a bug in the login form.", ex_ua: "Ми знайшли баг у формі входу." },
  { en: "repository", ua: "репозиторій", ex_en: "Clone the repository to your computer.", ex_ua: "Склонуй репозиторій на свій комп'ютер." },
  { en: "commit", ua: "коміт (збережена зміна в Git)", ex_en: "Write a clear commit message.", ex_ua: "Напиши зрозуміле повідомлення до коміту." },
  { en: "branch", ua: "гілка (у Git)", ex_en: "Create a new branch for this feature.", ex_ua: "Створи нову гілку для цієї функції." },
  { en: "merge", ua: "злиття гілок", ex_en: "Merge the branch into main.", ex_ua: "Злий гілку в основну (main)." },
  { en: "pull request", ua: "пул-реквест (запит на злиття)", ex_en: "Open a pull request for review.", ex_ua: "Відкрий пул-реквест на перевірку." },
  { en: "deploy", ua: "розгорнути (виклаcти застосунок у продакшн)", ex_en: "Deploy the app to the server.", ex_ua: "Розгорни застосунок на сервері." },
  { en: "server", ua: "сервер", ex_en: "The server responds to requests.", ex_ua: "Сервер відповідає на запити." },
  { en: "client", ua: "клієнт (браузер/застосунок користувача)", ex_en: "The client sends a request.", ex_ua: "Клієнт надсилає запит." },
  { en: "request", ua: "запит", ex_en: "Send a GET request to the API.", ex_ua: "Надішли GET-запит до API." },
  { en: "response", ua: "відповідь", ex_en: "The response contains JSON data.", ex_ua: "Відповідь містить дані у форматі JSON." },
  { en: "database", ua: "база даних", ex_en: "Store the users in a database.", ex_ua: "Зберігай користувачів у базі даних." },
  { en: "framework", ua: "фреймворк (каркас для розробки)", ex_en: "React is a frontend framework... actually a library.", ex_ua: "React — це frontend-бібліотека, часто звана й фреймворком." },
  { en: "library", ua: "бібліотека (готовий код для перевикористання)", ex_en: "This library helps with date formatting.", ex_ua: "Ця бібліотека допомагає з форматуванням дат." },
  { en: "dependency", ua: "залежність (пакет, від якого залежить проєкт)", ex_en: "Install the missing dependency.", ex_ua: "Встанови відсутню залежність." },
  { en: "syntax", ua: "синтаксис", ex_en: "There's a syntax error on line 12.", ex_ua: "На рядку 12 синтаксична помилка." },
  { en: "console", ua: "консоль", ex_en: "Open the console to see the output.", ex_ua: "Відкрий консоль, щоб побачити результат." },
  { en: "debug / debugging", ua: "налагодження / дебаг", ex_en: "I spent an hour debugging this function.", ex_ua: "Я витратила годину на налагодження цієї функції." },
  { en: "deploy vs deployment", ua: "розгорнути (дія) / розгортання (процес)", ex_en: "The deployment failed at 3am.", ex_ua: "Розгортання зламалось о третій ночі." },
  { en: "environment", ua: "середовище (development/production)", ex_en: "This bug only happens in production environment.", ex_ua: "Цей баг трапляється лише в продакшн-середовищі." },
  { en: "endpoint", ua: "кінцева точка (API)", ex_en: "This endpoint returns a list of users.", ex_ua: "Ця кінцева точка повертає список користувачів." },
  { en: "payload", ua: "тіло запиту/повідомлення", ex_en: "Check the request payload in DevTools.", ex_ua: "Перевір тіло запиту в DevTools." },
  { en: "cache / caching", ua: "кеш / кешування", ex_en: "Clear the browser cache and try again.", ex_ua: "Очисти кеш браузера і спробуй знову." },
  { en: "token", ua: "токен (наприклад, авторизації)", ex_en: "The session token has expired.", ex_ua: "Термін дії токена сесії закінчився." },
  { en: "session", ua: "сесія", ex_en: "The user's session ends after 30 minutes.", ex_ua: "Сесія користувача завершується через 30 хвилин." },
  { en: "middleware", ua: "проміжний обробник (middleware)", ex_en: "Add a middleware to check authentication.", ex_ua: "Додай middleware для перевірки автентифікації." },
  { en: "route / routing", ua: "маршрут / маршрутизація", ex_en: "Define a route for the login page.", ex_ua: "Визнач маршрут для сторінки входу." },
  { en: "state", ua: "стан (наприклад, компонента)", ex_en: "The component re-renders when state changes.", ex_ua: "Компонент перемальовується, коли стан змінюється." },
  { en: "props", ua: "властивості, що передаються компоненту", ex_en: "Pass the user's name as a prop.", ex_ua: "Передай ім'я користувача як prop." },
  { en: "component", ua: "компонент", ex_en: "This button is a reusable component.", ex_ua: "Ця кнопка — компонент багаторазового використання." },
  { en: "refactor / refactoring", ua: "рефакторинг (покращення коду без зміни поведінки)", ex_en: "This function needs refactoring.", ex_ua: "Ця функція потребує рефакторингу." },
  { en: "legacy code", ua: "застарілий код", ex_en: "We inherited a lot of legacy code.", ex_ua: "Ми успадкували багато застарілого коду." },
  { en: "breakpoint", ua: "точка зупинки (у дебагері)", ex_en: "Set a breakpoint on line 20.", ex_ua: "Постав точку зупинки на рядку 20." },
  { en: "callback", ua: "функція зворотного виклику", ex_en: "Pass a callback to run after loading.", ex_ua: "Передай callback, щоб виконати після завантаження." },
  { en: "asynchronous", ua: "асинхронний", ex_en: "Fetching data is an asynchronous operation.", ex_ua: "Отримання даних — асинхронна операція." },
  { en: "instance", ua: "екземпляр (класу/об'єкта)", ex_en: "Create a new instance of the User class.", ex_ua: "Створи новий екземпляр класу User." },
  { en: "inheritance", ua: "успадкування", ex_en: "This class uses inheritance from Animal.", ex_ua: "Цей клас використовує успадкування від Animal." },
  { en: "scope", ua: "область видимості", ex_en: "This variable is out of scope here.", ex_ua: "Ця змінна поза областю видимості тут." },
  { en: "null / undefined", ua: "порожнє значення / невизначене значення", ex_en: "The value is null because it wasn't set.", ex_ua: "Значення null, бо його не встановили." },
  { en: "immutable / mutable", ua: "незмінний / змінний", ex_en: "Strings in JavaScript are immutable.", ex_ua: "Рядки в JavaScript незмінні." },
];

const UKRAINIAN_TERMS = [
  { en: "function", correct: "функція", avoid: "фанкшн", note: "Не транслітеруй — вживай усталений переклад." },
  { en: "variable", correct: "змінна", avoid: "варіабл", note: "" },
  { en: "array", correct: "масив", avoid: "ерей", note: "" },
  { en: "loop", correct: "цикл", avoid: "луп", note: "" },
  { en: "condition", correct: "умова", avoid: "кондішн", note: "" },
  { en: "database", correct: "база даних", avoid: "датабейс", note: "" },
  { en: "server", correct: "сервер", avoid: "—", note: "Це усталене запозичення — нормально." },
  { en: "request", correct: "запит", avoid: "реквест", note: "" },
  { en: "response", correct: "відповідь", avoid: "респонс", note: "" },
  { en: "repository", correct: "репозиторій", avoid: "—", note: "Усталене запозичення, прийнятне в професійній мові." },
  { en: "branch", correct: "гілка", avoid: "бранч", note: "" },
  { en: "commit", correct: "коміт", avoid: "—", note: "Уже усталений термін у Git-спільноті — прийнятний." },
  { en: "deployment", correct: "розгортання", avoid: "деплоймент", note: "" },
  { en: "bug", correct: "баг / дефект", avoid: "—", note: "«Баг» усталене й прийнятне в розмовній технічній мові." },
  { en: "user interface", correct: "користувацький інтерфейс", avoid: "юзер інтерфейс", note: "" },
  { en: "button", correct: "кнопка", avoid: "батон", note: "" },
  { en: "developer", correct: "розробник / розробниця", avoid: "девелопер", note: "" },
  { en: "testing", correct: "тестування", avoid: "—", note: "" },
  { en: "front-end / back-end", correct: "фронтенд / бекенд", avoid: "—", note: "Усталені терміни без дефіса в розмовній мові — прийнятні." },
  { en: "component", correct: "компонент", avoid: "—", note: "" },
  { en: "framework", correct: "фреймворк", avoid: "—", note: "Усталене запозичення, кальки на кшталт «рамка» не прижилися." },
  { en: "cache", correct: "кеш", avoid: "кеша (сленг)", note: "" },
  { en: "endpoint", correct: "кінцева точка", avoid: "ендпоінт (у формальному тексті)", note: "В усному мовленні «ендпоінт» теж вживається." },
  { en: "route", correct: "маршрут", avoid: "роут", note: "" },
  { en: "state", correct: "стан", avoid: "стейт", note: "" },
  { en: "environment", correct: "середовище", avoid: "енвайронмент", note: "" },
  { en: "package", correct: "пакет", avoid: "—", note: "" },
  { en: "library", correct: "бібліотека", avoid: "—", note: "" },
  { en: "compile / compilation", correct: "компіляція", avoid: "—", note: "Усталений термін." },
  { en: "debug", correct: "налагодження / дебаг", avoid: "—", note: "«Дебаг» усталений і прийнятний у розмовній мові." },
  { en: "refactoring", correct: "рефакторинг", avoid: "—", note: "Усталений термін без хорошого короткого відповідника." },
  { en: "pull request", correct: "пул-реквест / запит на злиття", avoid: "—", note: "«Пул-реквест» усталений у Git-спільноті." },
  { en: "authentication", correct: "автентифікація", avoid: "аутентифікація (менш вживане)", note: "Обидва варіанти зустрічаються, «автентифікація» ближче до оригіналу." },
  { en: "authorization", correct: "авторизація", avoid: "—", note: "Не плутай з автентифікацією: авторизація — про права доступу." },
];

const ACHIEVEMENTS_DEF = [
  { id: "first-code", title: "Перший код", desc: "Виконай свій перший урок." },
  { id: "first-html", title: "Перший HTML", desc: "Заверши перший урок курсу HTML." },
  { id: "first-css", title: "Перший CSS", desc: "Заверши перший урок курсу CSS." },
  { id: "first-js", title: "Перший JavaScript", desc: "Заверши перший урок курсу JavaScript." },
  { id: "ten-lessons", title: "10 уроків", desc: "Заверши 10 уроків загалом." },
  { id: "html-master", title: "HTML пройдено", desc: "Заверши всі уроки HTML." },
  { id: "css-master", title: "CSS пройдено", desc: "Заверши всі уроки CSS." },
  { id: "js-master", title: "JavaScript пройдено", desc: "Заверши всі уроки JavaScript." },
  { id: "first-english", title: "Перше слово", desc: "Заверши перший урок English for IT." },
  { id: "english-master", title: "English for IT пройдено", desc: "Заверши всі уроки English for IT." },
];

// Де, крім самої платформи, можна виконувати завдання цього курсу — редактори,
// онлайн-пісочниці та середовища для локальної інсталяції. tag: безкоштовно /
// freemium (є безкоштовний рівень) / платно.
const TOOLS_BY_COURSE = {
  html: [
    { name: "VS Code + Live Server", tag: "безкоштовно", url: "https://code.visualstudio.com/", note: "локальний редактор з автооновленням у браузері" },
    { name: "CodePen", tag: "безкоштовно", url: "https://codepen.io", note: "онлайн-пісочниця HTML/CSS/JS" },
    { name: "StackBlitz", tag: "безкоштовно", url: "https://stackblitz.com", note: "повноцінне онлайн-середовище розробки" },
    { name: "JSFiddle", tag: "безкоштовно", url: "https://jsfiddle.net", note: "швидкі експерименти з розміткою" },
  ],
  css: [
    { name: "CodePen", tag: "безкоштовно", url: "https://codepen.io", note: "живий preview стилів" },
    { name: "VS Code + Live Server", tag: "безкоштовно", url: "https://code.visualstudio.com/", note: "локально, з автоперезавантаженням" },
    { name: "StackBlitz", tag: "безкоштовно", url: "https://stackblitz.com", note: "" },
  ],
  javascript: [
    { name: "Консоль браузера (DevTools)", tag: "безкоштовно", url: "https://developer.chrome.com/docs/devtools/", note: "F12 у будь-якому браузері" },
    { name: "CodePen", tag: "безкоштовно", url: "https://codepen.io", note: "" },
    { name: "StackBlitz", tag: "безкоштовно", url: "https://stackblitz.com", note: "" },
    { name: "Node.js (nodejs.org)", tag: "безкоштовно", url: "https://nodejs.org", note: "запуск JS локально, поза браузером" },
  ],
  english: [
    { name: "MDN Web Docs", tag: "безкоштовно", url: "https://developer.mozilla.org", note: "офіційна документація — читай саме її для практики" },
    { name: "freeCodeCamp Forum", tag: "безкоштовно", url: "https://forum.freecodecamp.org", note: "читай обговорення англійською" },
    { name: "DeepL / Google Translate", tag: "freemium", url: "https://www.deepl.com", note: "звіряй власний переклад термінів" },
    { name: "Grammarly", tag: "freemium", url: "https://www.grammarly.com", note: "якщо пишеш коментарі чи issue англійською" },
  ],
  frontend: [
    { name: "Node.js (nodejs.org)", tag: "безкоштовно", url: "https://nodejs.org", note: "потрібен для npm/Vite/React" },
    { name: "Vite (npm create vite@latest)", tag: "безкоштовно", url: "https://vitejs.dev", note: "сучасний інструмент збірки frontend-проєкту" },
    { name: "StackBlitz", tag: "безкоштовно", url: "https://stackblitz.com", note: "React/Vue в браузері без інсталяції" },
    { name: "CodeSandbox", tag: "freemium", url: "https://codesandbox.io", note: "" },
    { name: "Vercel", tag: "freemium", url: "https://vercel.com", note: "безкоштовний деплой frontend-проєкту" },
  ],
  python: [
    { name: "python.org (локальна інсталяція)", tag: "безкоштовно", url: "https://www.python.org/downloads/", note: "офіційний інтерпретатор" },
    { name: "VS Code + розширення Python", tag: "безкоштовно", url: "https://code.visualstudio.com/", note: "" },
    { name: "PyCharm Community", tag: "безкоштовно", url: "https://www.jetbrains.com/pycharm/", note: "версія Professional — платна" },
    { name: "Replit", tag: "freemium", url: "https://replit.com", note: "пише й запускає код прямо в браузері" },
    { name: "Google Colab", tag: "безкоштовно", url: "https://colab.research.google.com", note: "потребує Google-акаунт" },
  ],
  sql: [
    { name: "DB Browser for SQLite", tag: "безкоштовно", url: "https://sqlitebrowser.org", note: "локальна легка база для навчання" },
    { name: "SQLite Online", tag: "безкоштовно", url: "https://sqliteonline.com", note: "запити прямо в браузері, без інсталяції" },
    { name: "pgAdmin (PostgreSQL)", tag: "безкоштовно", url: "https://www.pgadmin.org", note: "для повноціннішої серверної СУБД" },
    { name: "MySQL Workbench", tag: "безкоштовно", url: "https://dev.mysql.com/downloads/workbench/", note: "" },
    { name: "Supabase", tag: "freemium", url: "https://supabase.com", note: "хмарна PostgreSQL-база з безкоштовним рівнем" },
  ],
  backend: [
    { name: "Node.js (nodejs.org)", tag: "безкоштовно", url: "https://nodejs.org", note: "локальний запуск сервера" },
    { name: "Replit", tag: "freemium", url: "https://replit.com", note: "сервер прямо в браузері" },
    { name: "Railway", tag: "freemium", url: "https://railway.app", note: "хмарний сервер + база даних" },
    { name: "Render", tag: "freemium", url: "https://render.com", note: "хостинг для API/сервера" },
    { name: "Docker Desktop", tag: "безкоштовно", url: "https://www.docker.com/products/docker-desktop/", note: "ізольоване середовище для сервера й бази" },
  ],
  fullstack: [
    { name: "Vercel", tag: "freemium", url: "https://vercel.com", note: "деплой frontend" },
    { name: "Railway", tag: "freemium", url: "https://railway.app", note: "деплой backend + база даних" },
    { name: "Render", tag: "freemium", url: "https://render.com", note: "альтернатива Railway" },
    { name: "Docker", tag: "безкоштовно", url: "https://www.docker.com", note: "запакувати весь проєкт разом" },
    { name: "GitHub", tag: "freemium", url: "https://github.com", note: "код, історія змін, автодеплой через Actions" },
  ],
};


/* =========================================================================
   CHEAT SHEETS — dense mousepad-style quick reference tables.
   Each entry is a [term, description] pair grouped by category.
   ========================================================================= */

const CHEATSHEETS = {
  js: {
    title: "JavaScript",
    groups: [
      { cat: "Масиви", items: [
        ["push(x)", "додає елемент x у кінець масиву"], ["pop()", "видаляє й повертає останній елемент масиву"],
        ["shift()", "видаляє й повертає перший елемент масиву"], ["unshift(x)", "додає елемент x на початок масиву"],
        ["slice(a,b)", "повертає копію частини масиву з індексу a до b (не включно)"], ["splice(i,n)", "видаляє n елементів з позиції i; може й вставляти нові на це місце"],
        ["map(fn)", "створює новий масив, застосувавши fn до кожного елемента"], ["filter(fn)", "створює новий масив лише з елементів, для яких fn повертає true"],
        ["reduce(fn,init)", "згортає весь масив в одне підсумкове значення (напр. суму)", "js-reduce"], ["forEach(fn)", "викликає fn для кожного елемента масиву, нічого не повертаючи"],
        ["find(fn)", "повертає перший елемент масиву, що задовольняє умову fn"], ["findIndex(fn)", "повертає індекс першого елемента, що задовольняє fn"],
        ["includes(x)", "перевіряє, чи є значення x серед елементів масиву"], ["indexOf(x)", "повертає індекс елемента x у масиві, або -1"],
        ["join(sep)", "перетворює масив на рядок, з'єднуючи елементи через sep"], ["concat(arr2)", "об'єднує два масиви в новий, не змінюючи оригінали"],
        ["sort(fn)", "сортує елементи масиву на місці (змінює оригінальний масив)"], ["reverse()", "розвертає порядок елементів масиву на місці"],
        ["flat()", "розгортає вкладені масиви на один рівень углиб"], ["some(fn)", "перевіряє, чи хоч один елемент масиву задовольняє fn"],
        ["every(fn)", "перевіряє, чи всі елементи масиву задовольняють fn"], ["Array.isArray(x)", "перевіряє, чи значення x є масивом"],
        ["Array.from(x)", "створює справжній масив з масивоподібного чи ітерованого об'єкта"], [".length", "кількість елементів у масиві"],
      ]},
      { cat: "Рядки", items: [
        [".length", "довжина рядка в символах"], ["toUpperCase()", "повертає копію рядка у верхньому регістрі"],
        ["toLowerCase()", "повертає копію рядка у нижньому регістрі"], ["trim()", "повертає копію рядка без пробілів по краях"],
        ["split(sep)", "розбиває рядок на масив підрядків за роздільником sep"], ["replace(a,b)", "замінює перший збіг підрядка a на b"],
        ["replaceAll(a,b)", "замінює всі збіги підрядка a на b у рядку"], ["includes(x)", "перевіряє, чи рядок містить підрядок x"],
        ["indexOf(x)", "повертає позицію підрядка x у рядку, або -1"], ["slice(a,b)", "повертає частину рядка від символу a до b"],
        ["substring(a,b)", "як slice, але не приймає від'ємних індексів"], ["charAt(i)", "повертає символ рядка за індексом i"],
        ["startsWith(x)", "перевіряє, чи рядок починається з x"], ["endsWith(x)", "перевіряє, чи рядок закінчується на x"],
        ["repeat(n)", "повертає рядок, повторений n разів підряд"], ["padStart(n,c)", "доповнює рядок символом c зліва до довжини n"],
        ["padEnd(n,c)", "доповнює рядок символом c справа до довжини n"], ["`${x}`", "вставляє значення змінної x прямо в текст рядка"],
      ]},
      { cat: "Об'єкти", items: [
        ["Object.keys(o)", "масив ключів"], ["Object.values(o)", "масив значень"],
        ["Object.entries(o)", "масив пар [ключ, значення]"], ["Object.assign(a,b)", "копіює властивості b в a"],
        ["Object.freeze(o)", "забороняє зміни об'єкта"], ["o.hasOwnProperty(k)", "чи має властивість k"],
        ["{...o}", "spread — копія об'єкта"], ["const {a,b} = o", "деструктуризація"],
        ["Object.fromEntries(arr)", "масив пар назад у об'єкт"], ["Object.create(proto)", "новий об'єкт із вказаним прототипом"],
        ["Object.is(a, b)", "точніша перевірка рівності, ніж ==="],
      ]},
      { cat: "Числа й Math", items: [
        ["Math.round(x)", "округлення до найближчого"], ["Math.floor(x)", "округлення вниз"],
        ["Math.ceil(x)", "округлення вгору"], ["Math.random()", "випадкове число 0–1"],
        ["Math.max(...)", "найбільше з чисел"], ["Math.min(...)", "найменше з чисел"],
        ["Math.abs(x)", "модуль числа"], ["Math.pow(x,y)", "x у степені y"],
        ["Math.sqrt(x)", "квадратний корінь"], ["parseInt(s)", "рядок у ціле число"],
        ["parseFloat(s)", "рядок у дробове число"], ["(x).toFixed(n)", "число з n знаками після коми"],
        ["Number.isInteger(x)", "чи x ціле число"], ["Number.isNaN(x)", "чи x саме NaN (надійніше за isNaN)"],
        ["Math.trunc(x)", "відкидає дробову частину без округлення"],
      ]},
      { cat: "Класи та ООП", items: [
        ["class X { }", "оголошення класу"], ["constructor(...)", "викликається при створенні new X()"],
        ["extends", "успадкування від батьківського класу"], ["super(...)", "виклик конструктора/методу батька"],
        ["static method()", "метод класу, а не екземпляра"], ["get / set", "геттер і сеттер властивості"],
        ["#privateField", "приватне поле, недоступне ззовні"], ["instanceof", "перевірка, чи об'єкт створений класом"],
      ]},
      { cat: "Помилки", items: [
        ["throw new Error('...')", "навмисно кинути помилку"], ["try / catch / finally", "перехопити й обробити помилку"],
        ["TypeError", "операція над неправильним типом значення"], ["ReferenceError", "звернення до неоголошеної змінної"],
        ["SyntaxError", "помилка синтаксису коду"], ["RangeError", "значення поза допустимим діапазоном"],
        ["error.message", "текст помилки"], ["error.stack", "стек викликів, де сталась помилка"],
      ]},
      { cat: "Ітератори та генератори", items: [
        ["for...of", "перебирає значення масиву/рядка/Map/Set"], ["for...in", "перебирає ключі об'єкта"],
        ["function* gen()", "функція-генератор"], ["yield", "повертає одне значення з генератора, призупиняючи його"],
        ["Symbol.iterator", "робить об'єкт сумісним з for...of"],
      ]},
      { cat: "Модулі", items: [
        ["export default", "єдиний головний експорт файлу"], ["export { a, b }", "іменовані експорти"],
        ["import x from './file'", "імпорт default-експорту"], ["import { a, b } from './file'", "імпорт іменованих експортів"],
        ["import * as ns from './file'", "імпорт усього як один об'єкт"],
      ]},
      { cat: "Інше корисне", items: [
        ["JSON.stringify(o)", "об'єкт у рядок JSON"], ["JSON.parse(s)", "рядок JSON у об'єкт"],
        ["typeof x", "тип значення рядком"], ["x instanceof Y", "чи x створений через Y"],
        ["a ?? b", "b, лише якщо a null/undefined"], ["a?.b", "безпечний доступ до властивості"],
        ["a ? b : c", "тернарний оператор"], ["console.table(arr)", "виводить масив таблицею"],
        ["try {} catch(e) {}", "обробка помилок"], ["async / await", "робота з асинхронним кодом"],
      ]},
      { cat: "DOM: пошук і створення", items: [
        ["document.querySelector(sel)", "перший елемент за CSS-селектором"], ["document.querySelectorAll(sel)", "усі елементи за селектором"],
        ["document.getElementById(id)", "елемент за id"], ["document.createElement(tag)", "новий елемент у пам'яті"],
        ["el.appendChild(child)", "додає елемент у кінець"], ["el.remove()", "видаляє елемент зі сторінки"],
        ["el.closest(sel)", "найближчий предок за селектором"], ["el.matches(sel)", "чи елемент відповідає селектору"],
      ]},
      { cat: "DOM: вміст і атрибути", items: [
        ["el.textContent", "текст усередині елемента"], ["el.innerHTML", "HTML-розмітка всередині елемента"],
        ["el.getAttribute(name)", "читає атрибут"], ["el.setAttribute(name, val)", "задає атрибут"],
        ["el.classList.add/remove/toggle", "керування CSS-класами"], ["el.style.property", "інлайн-стиль елемента"],
      ]},
      { cat: "Події", items: [
        ["el.addEventListener(type, fn)", "підписка на подію"], ["el.removeEventListener(type, fn)", "відписка від події"],
        ["event.preventDefault()", "скасовує стандартну дію браузера"], ["event.stopPropagation()", "зупиняє спливання події"],
        ["event.target", "елемент, на якому сталась подія"], ["'click' / 'input' / 'submit'", "найчастіші типи подій"],
        ["'keydown' / 'keyup'", "події клавіатури"], ["'DOMContentLoaded'", "HTML повністю завантажено й розібрано"],
      ]},
      { cat: "Promise, fetch, Map/Set", items: [
        ["fetch(url)", "робить HTTP-запит, повертає Promise", "js-promise"], ["promise.then(fn)", "виконується після успіху"],
        ["promise.catch(fn)", "виконується після помилки"], ["Promise.all([...])", "чекає на всі проміси одночасно"],
        ["new Map()", "колекція ключ-значення (ключ будь-якого типу)"], ["new Set()", "колекція унікальних значень"],
        ["localStorage.setItem/getItem", "збереження даних у браузері"],
      ]},
    ],
  },
  css: {
    title: "CSS",
    groups: [
      { cat: "Box model", items: [
        ["margin", "зовнішній відступ елемента від сусідніх елементів"], ["padding", "внутрішній відступ між вмістом елемента і його рамкою"],
        ["width / height", "ширина й висота елемента"], ["border", "рамка навколо елемента (товщина, стиль, колір)"],
        ["border-radius", "заокруглення кутів елемента"], ["box-sizing: border-box", "border і padding входять у вказану ширину, а не додаються зверху"],
        ["box-shadow", "тінь навколо елемента"], ["outline", "контур навколо елемента, що не впливає на його розмір і layout"],
      ]},
      { cat: "Layout", items: [
        ["display: flex", "перетворює елемент на гнучкий контейнер для його прямих дітей"], ["display: grid", "перетворює елемент на сітковий контейнер з рядками й колонками"],
        ["justify-content", "вирівнює дочірні елементи по головній осі flex/grid-контейнера"], ["align-items", "вирівнює дочірні елементи по поперечній осі контейнера"],
        ["flex-direction", "задає, чи йдуть flex-елементи рядком чи колонкою"], ["flex-wrap", "дозволяє елементам переноситись на новий рядок, якщо не вміщаються"],
        ["gap", "відступ між сусідніми елементами flex/grid-контейнера"], ["grid-template-columns", "кількість і ширина колонок grid-сітки"],
        ["grid-template-rows", "кількість і висота рядків grid-сітки"], ["position: relative/absolute/fixed/sticky", "спосіб, яким елемент позиціонується відносно сторінки чи батька", "css-position"],
        ["z-index", "порядок нашарування елементів, що перекриваються"], ["overflow", "що робити з вмістом елемента, який не вміщається в його межі"],
      ]},
      { cat: "Текст і шрифти", items: [
        ["color", "колір тексту всередині елемента"], ["font-size", "розмір шрифту тексту"],
        ["font-weight", "товщина (жирність) накреслення шрифту"], ["font-family", "гарнітура (назва) шрифту тексту"],
        ["line-height", "висота одного рядка тексту"], ["text-align", "горизонтальне вирівнювання тексту в елементі"],
        ["text-decoration", "підкреслення, закреслення чи надкреслення тексту"], ["text-transform", "автоматична зміна регістру тексту (ВЕЛИКІ, малі)"],
        ["letter-spacing", "відступ між сусідніми літерами тексту"],
      ]},
      { cat: "Фон і ефекти", items: [
        ["background", "колір або зображення фону елемента"], ["opacity", "прозорість усього елемента разом з його вмістом"],
        ["visibility: hidden", "приховує елемент, але лишає порожнє місце на його розмір"], ["display: none", "повністю прибирає елемент з розмітки, без залишеного місця"],
        ["cursor", "вигляд курсора миші, коли він над елементом"], ["transform", "зсув, поворот або масштабування елемента без зміни layout"],
        ["transition", "плавна анімація зміни значення властивості (напр. кольору на hover)"], ["filter", "візуальні фільтри на елементі (розмиття, яскравість, відтінки сірого)"],
      ]},
      { cat: "Селектори", items: [
        [".class", "за класом"], ["#id", "за ідентифікатором"],
        ["element", "за тегом"], [":hover", "під час наведення"],
        [":first-child / :last-child", "перша/остання дитина"], ["::before / ::after", "псевдоелементи"],
        ["@media (max-width: 600px)", "стилі під розмір екрана"], ["var(--x)", "CSS-змінна"],
        ["calc(100% - 20px)", "обчислення значення"],
      ]},
      { cat: "Box model (додатково)", items: [
        ["min-width / max-width", "мінімальна/максимальна ширина"], ["min-height / max-height", "мінімальна/максимальна висота"],
        ["aspect-ratio", "співвідношення сторін елемента"], ["box-decoration-break", "як box-shadow ділиться між рядками"],
      ]},
      { cat: "Псевдокласи (додатково)", items: [
        [":focus", "коли елемент у фокусі"], [":focus-visible", "фокус лише від клавіатури"],
        [":active", "у момент натискання"], [":visited", "відвідане посилання"],
        [":nth-child(n)", "n-та дитина за формулою"], [":not(selector)", "усе, крім вказаного"],
        [":is(a, b)", "спрощує групу селекторів"], [":where(a, b)", "як :is(), але без ваги специфічності"],
        [":has(selector)", "елемент, що містить вказане всередині"], [":empty", "елемент без вмісту"],
        [":checked", "позначений чекбокс/радіо"], [":disabled / :enabled", "стан поля форми"],
        [":required / :optional", "обов'язкове/необов'язкове поле"], [":valid / :invalid", "результат валідації форми"],
        [":root", "кореневий елемент (зазвичай html)"],
      ]},
      { cat: "Псевдоелементи (додатково)", items: [
        ["::first-letter", "перша літера тексту"], ["::first-line", "перший рядок тексту"],
        ["::selection", "виділений мишею текст"], ["::placeholder", "плейсхолдер у input"],
        ["::marker", "маркер пункту списку"],
      ]},
      { cat: "Одиниці виміру", items: [
        ["px", "пікселі — фіксований розмір"], ["%", "відсоток від батьківського елемента"],
        ["em", "відносно font-size батька"], ["rem", "відносно font-size кореня (html)"],
        ["vw / vh", "відсоток ширини/висоти вікна браузера"], ["ch", "ширина символу «0» поточного шрифту"],
        ["s / ms", "секунди/мілісекунди (для transition, animation)"], ["deg", "градуси (для rotate)"],
      ]},
      { cat: "Функції", items: [
        ["calc()", "обчислення значення (можна змішувати одиниці)"], ["min() / max()", "менше/більше з кількох значень"],
        ["clamp(min, val, max)", "значення в межах діапазону — для responsive"], ["rgb() / rgba()", "колір за компонентами (+прозорість)"],
        ["hsl()", "колір за відтінком/насиченістю/яскравістю"], ["linear-gradient()", "лінійний градієнт"],
        ["url()", "посилання на ресурс (зображення, шрифт)"], ["attr()", "бере значення атрибута HTML"],
      ]},
      { cat: "Логічні властивості", items: [
        ["margin-inline / margin-block", "відступи незалежно від напрямку письма"],
        ["padding-inline / padding-block", "те саме для padding"],
        ["inset", "скорочення для top+right+bottom+left"],
      ]},
      { cat: "@-правила", items: [
        ["@font-face", "підключення власного шрифту"], ["@supports", "стилі, якщо браузер підтримує властивість"],
        ["@container", "стилі залежно від розміру контейнера, не екрана"], ["@layer", "керування порядком каскаду стилів"],
      ]},
      { cat: "Grid детально", items: [
        ["grid-template-columns: repeat(3, 1fr)", "3 рівні колонки", "css-grid"], ["grid-template-areas", "іменовані ділянки сітки текстом"],
        ["grid-column: 1 / 3", "елемент займає з 1-ї по 3-тю колонку"], ["grid-row: span 2", "елемент займає 2 рядки"],
        ["place-items: center", "вирівнює і по горизонталі, і по вертикалі одразу"],
        ["minmax(100px, 1fr)", "розмір колонки від мінімуму до гнучкого максимуму"],
        ["auto-fit / auto-fill", "автоматична кількість колонок під ширину"],
      ]},
      { cat: "Transform-функції", items: [
        ["translate(x, y)", "зсув по X та Y"], ["translateX() / translateY()", "зсув по одній осі"],
        ["scale(n)", "масштабування (1 = 100%)"], ["rotate(deg)", "поворот на кут"],
        ["skew(deg)", "нахил (перекошування)"], ["matrix(...)", "усі трансформації однією матрицею"],
      ]},
      { cat: "Filter-функції", items: [
        ["blur(px)", "розмиття"], ["brightness(%)", "яскравість"], ["contrast(%)", "контраст"],
        ["grayscale(%)", "чорно-білий ефект"], ["drop-shadow(...)", "тінь за формою елемента (не прямокутна)"],
        ["hue-rotate(deg)", "зсув відтінку кольору"],
      ]},
      { cat: "Анімація", items: [
        ["@keyframes name { from {} to {} }", "оголошення кадрів анімації"],
        ["animation: name 2s infinite;", "застосування анімації до елемента"],
        ["animation-timing-function", "крива швидкості (ease, linear, cubic-bezier)"],
        ["animation-iteration-count: infinite", "нескінченне повторення"],
        ["animation-fill-mode: forwards", "лишає стан останнього кадру після завершення"],
      ]},
    ],
  },
  html: {
    title: "HTML",
    groups: [
      { cat: "Структура", items: [
        ["<html>", "кореневий елемент, що охоплює всю HTML-сторінку"], ["<head>", "службова частина документа — не відображається на сторінці"],
        ["<body>", "усе, що видно користувачу на сторінці"], ["<header>", "шапка сторінки або секції з логотипом чи навігацією"],
        ["<nav>", "блок навігаційних посилань сторінки"], ["<main>", "головний унікальний вміст сторінки, лише один на сторінку"], ["<footer>", "підвал сторінки або секції з контактами чи копірайтом"],
        ["<section>", "тематична секція вмісту зі своїм заголовком"], ["<article>", "самодостатній блок вмісту (пост, коментар, картка товару)"],
      ]},
      { cat: "Текст", items: [
        ["<h1>–<h6>", "заголовки шести рівнів важливості, від головного до найменшого"], ["<p>", "звичайний абзац тексту"],
        ["<strong>", "смислове виділення важливого тексту (за замовчуванням жирне)"], ["<em>", "смисловий наголос на слові (за замовчуванням курсив)"],
        ["<small>", "дрібний текст, зазвичай для приміток чи застережень"], ["<mark>", "виділення тексту маркером, як хайлайтером"],
        ["<code>", "фрагмент програмного коду в тексті"], ["<pre>", "текст, що зберігає всі пробіли й переноси рядків як написано"],
        ["<blockquote>", "розгорнута цитата з іншого джерела"], ["<br>", "примусовий перенос на новий рядок"], ["<hr>", "горизонтальна розділова лінія між частинами вмісту"],
      ]},
      { cat: "Списки й таблиці", items: [
        ["<ul>/<li>", "маркований список і кожен його пункт"], ["<ol>/<li>", "нумерований список і кожен його пункт"],
        ["<dl>/<dt>/<dd>", "список визначень: термін і його опис"], ["<table>", "контейнер табличних даних", "html-table"],
        ["<tr>", "один рядок таблиці"], ["<th>", "заголовкова комірка таблиці (назва колонки чи рядка)"], ["<td>", "звичайна комірка з даними таблиці"],
        ["<thead>/<tbody>/<tfoot>", "групи рядків таблиці: шапка, тіло, підсумковий рядок"],
      ]},
      { cat: "Форми та медіа", items: [
        ["<form>", "контейнер, що збирає й відправляє введені користувачем дані"], ["<input>", "поле вводу для тексту, числа, дати тощо"], ["<label>", "текстовий підпис до поля форми"],
        ["<button>", "кнопка, що запускає дію (відправку форми чи JS-функцію)"], ["<select>/<option>", "випадний список вибору й кожен його варіант"], ["<textarea>", "багаторядкове текстове поле форми"],
        ["<img>", "вставляє зображення на сторінку"], ["<video>", "вбудований відеоплеєр"], ["<audio>", "вбудований аудіоплеєр"],
        ["<iframe>", "вбудовує іншу веб-сторінку всередину поточної"], ["<svg>", "векторна графіка, що масштабується без втрати якості"], ["<canvas>", "порожнє полотно для малювання через JavaScript"],
      ]},
      { cat: "Інше", items: [
        ["<a href>", "посилання, що веде на іншу сторінку чи ресурс"], ["<div>", "універсальний блоковий контейнер для групування вмісту"], ["<span>", "універсальний рядковий контейнер усередині тексту"],
        ["<script>", "підключає або вбудовує JavaScript-код на сторінку"], ["<link>", "підключає зовнішній ресурс, найчастіше CSS-файл"], ["<meta>", "метадані сторінки: кодування, опис, viewport"],
        ["<details>/<summary>", "розкривний блок «показати ще» без потреби в JavaScript"], ["<figure>/<figcaption>", "ілюстрація (зображення, код, діаграма) разом з підписом до неї"],
      ]},
      { cat: "Метадані документа", items: [
        ["<title>", "назва вкладки браузера"], ["<base>", "базова адреса для всіх посилань"],
        ["<style>", "вбудовані CSS-стилі"], ["<noscript>", "вміст, якщо JS вимкнено"],
      ]},
      { cat: "Текст (додатково)", items: [
        ["<address>", "контактна інформація"], ["<hgroup>", "групує заголовок з підзаголовком"],
        ["<wbr>", "можливе місце переносу слова"], ["<ins>", "доданий текст"], ["<del>", "видалений текст"],
        ["<s>", "текст, що більше не актуальний"], ["<u>", "підкреслений текст"],
        ["<sub>", "нижній індекс"], ["<sup>", "верхній індекс"], ["<abbr>", "абревіатура з підказкою"],
        ["<cite>", "назва джерела/твору"], ["<q>", "коротка цитата в рядку"], ["<kbd>", "клавіша чи ввід користувача"],
        ["<samp>", "приклад виводу програми"], ["<var>", "змінна в математичному/коду тексті"],
        ["<time>", "дата чи час, зрозумілі машині"], ["<data>", "значення з машинним еквівалентом"],
        ["<bdi>/<bdo>", "ізоляція/перевизначення напрямку тексту"], ["<ruby>/<rt>/<rp>", "фонетичні підказки (East Asian)"],
        ["<dfn>", "означення терміна"],
      ]},
      { cat: "Форми (додатково)", items: [
        ["<optgroup>", "групує option у select"], ["<datalist>", "підказки автодоповнення для input"],
        ["<output>", "результат обчислення форми"], ["<progress>", "індикатор прогресу"],
        ["<meter>", "вимірювальна шкала (напр. заповненість)"], ["<fieldset>/<legend>", "групування полів форми з підписом"],
      ]},
      { cat: "Таблиці (додатково)", items: [
        ["<caption>", "підпис таблиці"], ["<colgroup>/<col>", "стилізація цілих колонок"],
      ]},
      { cat: "Медіа та вбудований вміст", items: [
        ["<picture>/<source>", "різні зображення під різні екрани"], ["<map>/<area>", "клікабельні зони на зображенні"],
        ["<embed>", "вбудований зовнішній вміст (плагін)"], ["<object>/<param>", "вбудований об'єкт з параметрами"],
        ["<track>", "субтитри для video/audio"],
      ]},
      { cat: "Інтерактивність і скрипти", items: [
        ["<dialog>", "модальне чи немодальне вікно"], ["<menu>", "список команд/опцій"],
        ["<template>", "розмітка, що не рендериться одразу"], ["<slot>", "місце вставки в Web Component"],
      ]},
      { cat: "Застарілі теги (уникай)", items: [
        ["<acronym>", "застаріло — використовуй <abbr>"], ["<applet>", "застаріло — Java-аплети більше не працюють"],
        ["<basefont>/<font>", "застаріло — стилізуй через CSS"], ["<big>", "застаріло — font-size у CSS"],
        ["<center>", "застаріло — text-align у CSS"], ["<dir>", "застаріло — використовуй <ul>"],
        ["<frame>/<frameset>/<noframes>", "застаріло — використовуй <iframe>"], ["<strike>", "застаріло — використовуй <s>"],
        ["<tt>", "застаріло — моноширинний текст через CSS"],
      ]},
      { cat: "Глобальні атрибути", items: [
        ["id", "унікальний ідентифікатор елемента"], ["class", "клас(и) для CSS/JS"],
        ["style", "інлайн-стилі прямо на елементі"], ["title", "підказка при наведенні"],
        ["lang", "мова вмісту елемента"], ["dir", "напрямок тексту (ltr/rtl)"],
        ["hidden", "приховує елемент"], ["tabindex", "порядок переходу по Tab"],
        ["contenteditable", "дозволяє редагувати вміст прямо на сторінці"], ["draggable", "дозволяє перетягування"],
        ["spellcheck", "перевірка орфографії браузером"], ["data-*", "власні дані елемента (data-user-id)"],
        ["aria-*", "атрибути доступності для скрінрідерів"], ["role", "роль елемента для допоміжних технологій"],
      ]},
      { cat: "ARIA (доступність)", items: [
        ["aria-label", "текстовий опис для скрінрідера"], ["aria-labelledby", "посилається на елемент з описом"],
        ["aria-describedby", "посилається на розгорнутий опис"], ["aria-hidden", "ховає елемент від скрінрідера"],
        ["aria-live", "оголошує зміни вмісту вголос"], ["aria-expanded", "стан розгорнуто/згорнуто"],
        ["aria-current", "позначає поточний пункт (напр. у меню)"], ["aria-disabled", "позначає елемент неактивним"],
        ["aria-selected", "позначає вибраний елемент"], ["aria-checked", "стан чекбокса/перемикача"],
        ["aria-controls", "яким елементом керує цей"], ["aria-haspopup", "чи відкриває спливаюче меню"],
      ]},
      { cat: "Типи input", items: [
        ["text", "звичайний однорядковий текст"], ["password", "текст, прихований крапками"],
        ["email", "з базовою валідацією формату email"], ["number", "лише числа, зі стрілками"],
        ["date / time", "вибір дати / часу через вбудований віджет"], ["checkbox", "прапорець, що вмикається незалежно"],
        ["radio", "перемикач — лише один в групі з однаковим name"], ["file", "вибір файлу з диска"],
        ["range", "повзунок для числа в діапазоні"], ["hidden", "невидиме поле, що все одно надсилається"],
        ["submit", "кнопка відправки форми"],
      ]},
      { cat: "Атрибути input", items: [
        ["placeholder", "сірий текст-підказка всередині поля"], ["required", "поле обов'язкове для відправки форми"],
        ["disabled", "поле неактивне й не надсилається"], ["readonly", "видно, але не можна редагувати"],
        ["min / max / step", "межі та крок для чисел/дат"], ["maxlength", "максимальна кількість символів"],
        ["pattern", "regex-шаблон для валідації"], ["autofocus", "фокус на полі одразу при завантаженні"],
        ["autocomplete", "дозволяє/забороняє автозаповнення браузером"],
      ]},
      { cat: "Атрибути посилань", items: [
        ["target=\"_blank\"", "відкрити в новій вкладці"], ["rel=\"noopener noreferrer\"", "безпека при target=_blank"],
        ["download", "посилання завантажує файл, а не відкриває"], ["hreflang", "мова сторінки, на яку веде посилання"],
      ]},
      { cat: "Атрибути таблиць", items: [
        ["colspan", "комірка займає кілька колонок"], ["rowspan", "комірка займає кілька рядків"],
        ["scope=\"col\"/\"row\"", "яку вісь описує заголовок th (для доступності)"],
      ]},
      { cat: "SVG базово", items: [
        ["<circle cx cy r>", "коло"], ["<rect x y width height>", "прямокутник"],
        ["<line x1 y1 x2 y2>", "лінія"], ["<path d=\"...\">", "довільна форма за командами"],
        ["fill", "колір заливки фігури"], ["stroke", "колір контуру фігури"],
      ]},
      { cat: "Canvas базово", items: [
        ["canvas.getContext('2d')", "отримати 2D-контекст для малювання"], ["ctx.fillRect(x,y,w,h)", "заповнений прямокутник"],
        ["ctx.beginPath() / stroke()", "почати й намалювати довільний контур"], ["ctx.fillText(text,x,y)", "намалювати текст"],
      ]},
    ],
  },
  git: {
    title: "Git",
    groups: [
      { cat: "Початок роботи", items: [
        ["git init", "створює новий порожній Git-репозиторій у поточній папці"], ["git clone <url>", "копіює віддалений репозиторій на твій комп'ютер"],
        ["git status", "показує, які файли змінені, додані чи ще не відстежуються"], ["git remote add origin <url>", "прив'язує локальний репозиторій до адреси на GitHub"],
      ]},
      { cat: "Зміни", items: [
        ["git add <file>", "додає конкретний файл у staging-область перед комітом"], ["git add .", "додає геть усі змінені файли у staging-область"],
        ["git commit -m \"...\"", "зберігає зміни зі staging як новий коміт з повідомленням"], ["git diff", "показує різницю між поточними змінами й останнім комітом"],
        ["git log", "показує історію всіх комітів гілки"], ["git reset <file>", "прибирає файл зі staging, не втрачаючи самі зміни"],
        ["git revert <hash>", "скасовує вказаний коміт, створюючи новий коміт з протилежними змінами"],
      ]},
      { cat: "Гілки й синхронізація", items: [
        ["git branch", "показує список усіх гілок репозиторію"], ["git branch <name>", "створює нову гілку з вказаним ім'ям"],
        ["git checkout <name>", "перемикає робочу директорію на вказану гілку"], ["git checkout -b <name>", "створює нову гілку й одразу перемикається на неї"],
        ["git merge <name>", "зливає зміни вказаної гілки в поточну", "git-merge-conflict"], ["git push", "надсилає локальні коміти на віддалений сервер"],
        ["git pull", "завантажує й одразу зливає зміни з віддаленого сервера"], ["git fetch", "завантажує зміни з сервера, не зливаючи їх у робочу гілку"],
        ["git stash", "тимчасово відкладає незакомічені зміни, щоб повернутись до них пізніше"],
      ]},
      { cat: "Просунуте", items: [
        ["git rebase <branch>", "переносить коміти поточної гілки на нову базу (чистіша, лінійна історія)", "git-rebase"],
        ["git cherry-pick <hash>", "переносить один конкретний коміт з іншої гілки в поточну"],
        ["git tag v1.0", "позначає конкретний коміт як версію релізу"], ["git reflog", "показує повну історію переміщень HEAD — рятує, якщо щось загубилось"],
        ["git config user.name/email", "налаштовує ім'я й email, що додаються до кожного коміту"],
        ["git blame <file>", "показує, хто і в якому коміті востаннє змінював кожен рядок файлу"],
        [".gitignore", "текстовий файл зі списком файлів/папок, які Git має ігнорувати (напр. node_modules)"],
      ]},
    ],
  },
  terminal: {
    title: "Термінал / Linux",
    groups: [
      { cat: "Навігація", items: [
        ["pwd", "показує повний шлях до поточної директорії"], ["ls", "показує список файлів і папок у поточній директорії"], ["cd <path>", "переходить у вказану директорію"],
        ["cd ..", "переходить на один рівень вище — в батьківську директорію"], ["mkdir <name>", "створює нову директорію з вказаним ім'ям"],
      ]},
      { cat: "Файли", items: [
        ["touch <file>", "створює новий порожній файл із вказаним ім'ям"], ["cat <file>", "виводить увесь вміст файлу прямо в термінал"],
        ["cp <a> <b>", "копіює файл a у нове місце чи під новим ім'ям b"], ["mv <a> <b>", "переміщує файл a в нове місце або перейменовує на b"], ["rm <file>", "видаляє вказаний файл безповоротно"],
        ["rm -r <dir>", "видаляє директорію разом з усім її вмістом рекурсивно"], ["chmod +x <file>", "додає файлу дозвіл на виконання як програми", "terminal-chmod"],
        ["chown user <file>", "змінює власника файлу на вказаного користувача"], ["tar -czf a.tar.gz dir/", "запаковує вказану директорію в стиснений архів"],
        ["unzip file.zip", "розпаковує вміст zip-архіву в поточну директорію"], ["head / tail <file>", "показує перші / останні рядки файлу, не відкриваючи його повністю"],
        ["less <file>", "відкриває файл для перегляду сторінками, зручно для великих логів"],
      ]},
      { cat: "Пошук і мережа", items: [
        ["grep <text> <file>", "пошук тексту у файлі", "terminal-grep"], ["find . -name \"*.js\"", "пошук файлів за іменем"],
        ["curl <url>", "HTTP-запит з терміналу"], ["wget <url>", "завантажити файл"], ["ssh user@host", "підключення до сервера"],
        ["scp file user@host:path", "копіювання файлу на віддалений сервер"],
      ]},
      { cat: "Процеси й система", items: [
        ["ps", "список процесів"], ["top", "монітор процесів у реальному часі"],
        ["kill <pid>", "завершити процес"], ["clear", "очистити екран"], ["history", "історія команд"],
        ["df -h", "вільне місце на диску"], ["du -sh <dir>", "розмір директорії"],
        ["whoami", "поточний користувач"], ["sudo <command>", "виконати команду від адміністратора"],
        ["export VAR=value", "встановити змінну середовища"], ["alias ll='ls -la'", "власний ярлик команди"],
      ]},
    ],
  },
  http: {
    title: "HTTP-статуси",
    groups: [
      { cat: "HTTP-методи", items: [
        ["GET", "запитує дані з сервера, не змінюючи нічого на ньому"], ["POST", "надсилає дані на сервер, щоб створити новий ресурс"],
        ["PUT", "повністю замінює існуючий ресурс новими даними"], ["PATCH", "частково оновлює окремі поля існуючого ресурсу", "http-put-patch"],
        ["DELETE", "видаляє вказаний ресурс на сервері"], ["HEAD", "як GET, але сервер повертає лише заголовки, без тіла відповіді"],
        ["OPTIONS", "запитує, які методи й заголовки підтримує ресурс (часто для CORS)"],
      ]},
      { cat: "Заголовки", items: [
        ["Content-Type", "вказує формат даних у тілі запиту чи відповіді (напр. application/json)"], ["Authorization", "передає токен чи облікові дані для автентифікації запиту"],
        ["Cache-Control", "задає правила кешування відповіді браузером"], ["Accept", "каже серверу, які формати відповіді клієнт готовий прийняти"],
        ["Set-Cookie", "сервер цим заголовком встановлює cookie у браузері користувача"], ["Access-Control-Allow-Origin", "визначає, з яких доменів дозволені CORS-запити до цього сервера", "http-cors"],
      ]},
      { cat: "2xx — успіх", items: [["200", "OK — сервер успішно обробив запит"], ["201", "Created — сервер успішно створив новий ресурс"], ["204", "No Content — запит успішний, але у відповіді немає тіла"]] },
      { cat: "3xx — перенаправлення", items: [["301", "Moved Permanently — ресурс назавжди переїхав на нову адресу"], ["302", "Found — ресурс тимчасово доступний за іншою адресою"], ["304", "Not Modified — ресурс не змінився, можна використати версію з кешу"]] },
      { cat: "4xx — помилка клієнта", items: [
        ["400", "Bad Request — сервер не зрозумів запит через некоректний формат"], ["401", "Unauthorized — для доступу потрібна автентифікація"],
        ["403", "Forbidden — сервер зрозумів запит, але забороняє доступ"], ["404", "Not Found — запитаний ресурс не існує на сервері"],
        ["405", "Method Not Allowed — цей HTTP-метод не підтримується для цього ресурсу"], ["409", "Conflict — запит суперечить поточному стану ресурсу"],
        ["422", "Unprocessable Entity — дані синтаксично коректні, але не пройшли валідацію"], ["429", "Too Many Requests — клієнт надіслав забагато запитів за короткий час"],
      ]},
      { cat: "5xx — помилка сервера", items: [
        ["500", "Internal Server Error — на сервері сталась неочікувана помилка"], ["502", "Bad Gateway — проміжний сервер отримав некоректну відповідь від іншого сервера"],
        ["503", "Service Unavailable — сервіс тимчасово не може обробляти запити (перевантаження чи обслуговування)"], ["504", "Gateway Timeout — сервер не дочекався відповіді від іншого сервера вчасно"],
      ]},
    ],
  },
  regex: {
    title: "Regex (регулярні вирази)",
    groups: [
      { cat: "Базові символи", items: [
        [".", "відповідає будь-якому одному символу, крім переносу рядка"], ["*", "попередній символ/група повторюється 0 або більше разів"], ["+", "попередній символ/група повторюється 1 або більше разів"],
        ["?", "попередній символ/група повторюється 0 або 1 раз (робить необов'язковим)"], ["^", "позначає початок рядка, з якого має починатись збіг"], ["$", "позначає кінець рядка, яким має закінчуватись збіг"],
      ]},
      { cat: "Класи символів", items: [
        ["\\d", "відповідає будь-якій одній цифрі від 0 до 9"], ["\\w", "відповідає будь-якій букві, цифрі або символу підкреслення"], ["\\s", "відповідає будь-якому пробільному символу (пробіл, таб, новий рядок)"],
        ["\\D / \\W / \\S", "протилежне до \\d / \\w / \\s — усе, що НЕ входить у ці класи"], ["[abc]", "відповідає одному з перелічених символів a, b або c"], ["[^abc]", "відповідає будь-якому символу, крім перелічених a, b, c"],
        ["[a-z]", "відповідає одному символу з діапазону від a до z"],
      ]},
      { cat: "Групи й флаги", items: [
        ["(abc)", "групує символи разом — можна повторювати як одне ціле чи витягувати окремо"], ["a|b", "відповідає або підвиразу a, або підвиразу b"],
        ["{2,4}", "попередній елемент повторюється від 2 до 4 разів"], ["{2,}", "попередній елемент повторюється 2 або більше разів, без верхньої межі"],
        ["(?:abc)", "групує символи без збереження результату для подальшого витягування"], ["/pattern/i", "флаг i — пошук без урахування регістру літер"],
        ["/pattern/g", "флаг g — знаходить усі збіги в рядку, а не лише перший", "regex-flags"], ["/pattern/m", "флаг m — ^ і $ працюють на межах кожного рядка, а не лише всього тексту"],
      ]},
      { cat: "Межі та випередження", items: [
        ["\\b", "позначає межу слова (перехід між буквою/цифрою і не-буквою)"], ["\\B", "позначає позицію, яка НЕ є межею слова"],
        ["(?=abc)", "вимагає, щоб далі йшло abc, але саме abc не входить у знайдений збіг (lookahead)", "regex-lookahead"], ["(?!abc)", "вимагає, щоб далі НЕ йшло abc"],
        ["(?<=abc)", "вимагає, щоб перед цим місцем стояло abc (lookbehind)"],
      ]},
    ],
  },
  shortcuts: {
    title: "VS Code — гарячі клавіші",
    groups: [
      { cat: "Файли й навігація", items: [
        ["Ctrl + S", "зберігає поточний відкритий файл"], ["Ctrl + P", "відкриває швидкий пошук файлу за назвою"],
        ["Ctrl + Shift + P", "відкриває палітру команд редактора", "vscode-command-palette"], ["Ctrl + `", "відкриває або закриває вбудований термінал"],
        ["Ctrl + B", "показує або ховає бічну панель з деревом файлів"], ["Ctrl + W", "закриває поточну відкриту вкладку файлу"],
        ["Ctrl + Tab", "перемикає фокус між уже відкритими файлами"], ["Ctrl + N", "створює новий порожній файл"],
      ]},
      { cat: "Редагування", items: [
        ["Ctrl + /", "закоментувати рядок"], ["Ctrl + D", "виділити наступний збіг", "vscode-multicursor"],
        ["Ctrl + Shift + K", "видалити рядок"], ["Alt + ↑ / ↓", "перемістити рядок"],
        ["F2", "перейменувати змінну всюди"], ["Ctrl + Space", "показати підказки автодоповнення"],
        ["Shift + Alt + ↓", "дублювати рядок вниз"], ["Ctrl + Enter", "новий рядок знизу, незалежно від позиції курсора"],
        ["Ctrl + Z / Ctrl + Y", "скасувати / повторити дію"],
      ]},
      { cat: "Пошук", items: [
        ["Ctrl + F", "пошук у файлі"], ["Ctrl + H", "заміна у файлі"], ["Ctrl + Shift + F", "пошук у всьому проєкті"],
        ["Ctrl + G", "перейти на рядок за номером"], ["Ctrl + Shift + O", "перейти до символу/функції у файлі"],
      ]},
    ],
  },
  python: {
    title: "Python",
    groups: [
      { cat: "Ключові слова", items: [
        ["def", "оголошує нову функцію з ім'ям і параметрами"], ["return", "повертає значення з функції назовні й завершує її виконання"],
        ["if / elif / else", "умовне розгалуження виконання коду"], ["for / while", "цикли: перебір колекції та повторення, поки умова істинна"],
        ["break / continue", "перериває цикл повністю / пропускає поточну ітерацію циклу"], ["class", "оголошує новий клас — шаблон для створення об'єктів"],
        ["import / from ... import", "підключає зовнішній модуль чи конкретні імена з нього"], ["try / except / finally", "перехоплює й обробляє помилки під час виконання", "py-try-except"],
        ["with", "контекстний менеджер, що автоматично звільняє ресурс (напр. закриває файл)"], ["lambda", "створює анонімну функцію прямо у виразі, в один рядок"],
        ["yield", "повертає одне значення з функції-генератора, призупиняючи її"], ["pass", "порожній оператор-заглушка там, де синтаксично потрібен блок коду"],
        ["global / nonlocal", "дозволяє змінювати змінну з глобальної / зовнішньої області видимості"], ["in / not in", "перевіряє, чи значення належить (не належить) колекції"],
        ["is / is not", "порівнює, чи це той самий об'єкт у пам'яті (не значення)"], ["and / or / not", "логічні оператори І / АБО / заперечення"],
      ]},
      { cat: "Типи даних", items: [
        ["int / float", "ціле число / число з рухомою комою (дробове)"], ["str", "рядок тексту"], ["bool", "логічний тип зі значеннями True або False"],
        ["list", "змінюваний впорядкований список елементів"], ["tuple", "незмінюваний після створення впорядкований список елементів"],
        ["dict", "словник пар ключ-значення для швидкого пошуку за ключем"], ["set", "колекція унікальних значень без визначеного порядку"],
        ["None", "спеціальне значення «нічого» — аналог null у JavaScript"],
      ]},
      { cat: "Рядки", items: [
        ["len(s)", "повертає довжину рядка або кількість елементів списку"], ["s.lower() / s.upper()", "повертає копію рядка в нижньому / верхньому регістрі"],
        ["s.strip()", "повертає копію рядка без пробілів на початку й у кінці"], ["s.split(sep)", "розбиває рядок на список підрядків за роздільником sep"],
        ["sep.join(list)", "з'єднує список рядків в один текст через роздільник sep"], ["s.replace(a, b)", "повертає рядок із заміненими всіма входженнями a на b"],
        ["s.startswith(x) / endswith(x)", "перевіряє, чи рядок починається / закінчується підрядком x"], ["f\"{x}\"", "f-рядок — вставляє значення змінної x прямо в текст рядка"],
      ]},
      { cat: "Списки й словники", items: [
        ["lst.append(x)", "додає елемент x у кінець списку lst"], ["lst.pop()", "видаляє й повертає останній елемент списку"],
        ["lst.sort()", "сортує список на місці, змінюючи оригінал"], ["sorted(lst)", "повертає новий відсортований список, не змінюючи оригінал"],
        ["[x for x in lst]", "list comprehension — стислий спосіб створити новий список за один рядок"],
        ["d.get(key, default)", "безпечно читає значення за ключем зі словника, з запасним значенням"], ["d.keys() / d.values() / d.items()", "повертає ключі / значення / пари ключ-значення словника"],
        ["range(n)", "генерує послідовність чисел від 0 до n-1 для циклу"], ["enumerate(lst)", "повертає пари (індекс, значення) під час перебору списку в циклі"],
        ["zip(a, b)", "паралельно перебирає два списки одночасно, елемент за елементом"],
      ]},
      { cat: "Функції та ООП", items: [
        ["*args", "довільна кількість позиційних аргументів"], ["**kwargs", "довільна кількість іменованих аргументів"],
        ["__init__(self)", "конструктор класу"], ["self", "посилання на поточний екземпляр"],
        ["super()", "доступ до батьківського класу"], ["@staticmethod / @classmethod", "методи, не прив'язані до екземпляра"],
        ["@property", "метод, який виглядає як звичайна властивість"],
      ]},
      { cat: "Помилки та стандартна бібліотека", items: [
        ["ValueError", "неправильне значення (правильний тип)"], ["TypeError", "операція над невідповідним типом"],
        ["KeyError", "ключа немає в словнику"], ["IndexError", "індексу немає в списку"],
        ["FileNotFoundError", "файл не знайдено"], ["raise", "навмисно викликати виняток"],
        ["import os / sys / json / math / random / datetime", "найуживаніші стандартні модулі"],
        ["open(path, mode)", "відкриває файл для читання/запису"],
      ]},
      { cat: "Comprehensions та ітерація", items: [
        ["[x for x in lst if cond]", "list comprehension з умовою", "py-comprehension"], ["{x for x in lst}", "set comprehension"],
        ["{k: v for k, v in items}", "dict comprehension"], ["map(fn, lst)", "застосовує функцію до кожного елемента"],
        ["filter(fn, lst)", "лишає елементи, де fn повертає True"], ["any(lst) / all(lst)", "хоч один / усі значення істинні"],
      ]},
      { cat: "Декоратори й контекст", items: [
        ["@decorator", "обгортає функцію додатковою поведінкою"], ["@dataclass", "автоматично генерує __init__ для класу"],
        ["with open(...) as f:", "контекстний менеджер — файл автоматично закриється"],
        ["__enter__ / __exit__", "методи для власного контекстного менеджера"],
      ]},
      { cat: "Асинхронність та модулі", items: [
        ["async def", "оголошення асинхронної функції"], ["await", "чекає результат асинхронної операції"],
        ["asyncio.run(main())", "запускає асинхронну програму"], ["pathlib.Path", "об'єктний спосіб роботи зі шляхами файлів"],
        ["itertools", "модуль для ефективної роботи з ітераторами"], ["collections.Counter", "підрахунок повторень елементів"],
      ]},
    ],
  },
  sql: {
    title: "SQL",
    groups: [
      { cat: "Базові команди", items: [
        ["SELECT", "вибирає й повертає дані з однієї чи кількох таблиць"], ["INSERT INTO", "додає новий рядок даних у таблицю"],
        ["UPDATE", "змінює значення в уже існуючих рядках таблиці"], ["DELETE FROM", "видаляє рядки з таблиці за умовою"],
        ["CREATE TABLE", "створює нову таблицю з визначеними колонками й типами"], ["ALTER TABLE", "змінює структуру існуючої таблиці (додає/видаляє колонки)"],
        ["DROP TABLE", "видаляє таблицю повністю разом з усіма її даними"],
      ]},
      { cat: "SELECT — уточнення", items: [
        ["FROM", "вказує, з якої таблиці вибирати дані"], ["WHERE", "фільтрує, які саме рядки таблиці включити в результат"],
        ["ORDER BY", "сортує рядки результату за вказаною колонкою"], ["GROUP BY", "групує рядки з однаковим значенням колонки для підрахунку агрегатів"],
        ["HAVING", "фільтрує вже згруповані рядки (на відміну від WHERE, що фільтрує до групування)", "sql-groupby"], ["LIMIT", "обмежує кількість рядків у результаті запиту"],
        ["DISTINCT", "прибирає рядки-дублікати з результату, лишаючи лише унікальні"], ["AS", "дає тимчасовий псевдонім колонці чи таблиці в запиті"],
      ]},
      { cat: "Умови", items: [
        ["AND / OR / NOT", "логічне поєднання умов"], ["IN (a, b, c)", "значення входить у список"],
        ["BETWEEN a AND b", "значення в діапазоні"], ["LIKE '%text%'", "пошук за шаблоном тексту"],
        ["IS NULL / IS NOT NULL", "перевірка на відсутність значення"],
      ]},
      { cat: "JOIN — об'єднання таблиць", items: [
        ["INNER JOIN", "лише рядки, що збігаються в обох таблицях", "sql-join"], ["LEFT JOIN", "усі рядки лівої таблиці + збіги"],
        ["RIGHT JOIN", "усі рядки правої таблиці + збіги"], ["FULL JOIN", "усі рядки з обох таблиць"],
        ["ON", "умова, за якою з'єднуються таблиці"],
      ]},
      { cat: "Агрегатні функції", items: [
        ["COUNT()", "кількість рядків"], ["SUM()", "сума значень"],
        ["AVG()", "середнє значення"], ["MIN() / MAX()", "мінімум / максимум"],
      ]},
      { cat: "Структура таблиці", items: [
        ["PRIMARY KEY", "унікальний ідентифікатор рядка"], ["FOREIGN KEY", "зв'язок з іншою таблицею"],
        ["NOT NULL", "поле обов'язкове до заповнення"], ["UNIQUE", "значення не повторюється в колонці"],
        ["DEFAULT", "значення за замовчуванням"], ["AUTO_INCREMENT / SERIAL", "автоматично зростаюче число"],
      ]},
      { cat: "Типи даних", items: [
        ["INT / INTEGER", "ціле число"], ["VARCHAR(n)", "текст обмеженої довжини"],
        ["TEXT", "текст необмеженої довжини"], ["BOOLEAN", "true/false"],
        ["DATE / TIMESTAMP", "дата / дата з часом"], ["DECIMAL / NUMERIC", "точне дробове число (для грошей)"],
      ]},
      { cat: "CTE та підзапити", items: [
        ["WITH x AS (...)", "тимчасовий іменований результат запиту (CTE)"],
        ["(SELECT ... ) AS sub", "підзапит, використаний як таблиця"],
        ["EXISTS (subquery)", "перевіряє, чи підзапит повернув хоч один рядок"],
      ]},
      { cat: "Віконні функції", items: [
        ["ROW_NUMBER() OVER (...)", "порядковий номер рядка у групі"], ["RANK() OVER (...)", "місце в рейтингу (з пропусками при рівності)"],
        ["PARTITION BY", "ділить рядки на групи для віконної функції"], ["LAG() / LEAD()", "значення попереднього / наступного рядка"],
      ]},
      { cat: "Транзакції", items: [
        ["BEGIN / START TRANSACTION", "почати транзакцію"], ["COMMIT", "зафіксувати всі зміни транзакції"],
        ["ROLLBACK", "скасувати всі зміни транзакції"],
      ]},
      { cat: "Індекси та в'юхи", items: [
        ["CREATE INDEX", "прискорює пошук за колонкою"], ["CREATE VIEW", "збережений запит, який можна використовувати як таблицю"],
        ["EXPLAIN", "показує, як СУБД виконуватиме запит"],
      ]},
      { cat: "Функції рядків і дат", items: [
        ["CONCAT(a, b)", "склеює рядки"], ["UPPER() / LOWER()", "регістр тексту"],
        ["LENGTH()", "довжина рядка"], ["TRIM()", "прибирає пробіли по краях"],
        ["NOW() / CURRENT_DATE", "поточна дата/час"], ["COALESCE(a, b)", "перше не-NULL значення"],
      ]},
    ],
  },
};



function defaultProgress() {
  return { completed: { html: [], css: [], javascript: [], english: [] }, xp: 0, unlocked: [] };
}

async function loadProgress() {
  try {
    const raw = localStorage.getItem("00100101-progress");
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* no saved progress yet */
  }
  return defaultProgress();
}

async function saveProgress(p) {
  try {
    localStorage.setItem("00100101-progress", JSON.stringify(p));
  } catch (e) {
    console.error("Не вдалося зберегти прогрес", e);
  }
}

function computeUnlocked(progress) {
  const total = Object.values(progress.completed).reduce((a, arr) => a + arr.length, 0);
  const unlocked = [];
  if (total >= 1) unlocked.push("first-code");
  if (progress.completed.html?.length >= 1) unlocked.push("first-html");
  if (progress.completed.css?.length >= 1) unlocked.push("first-css");
  if (progress.completed.javascript?.length >= 1) unlocked.push("first-js");
  if (total >= 10) unlocked.push("ten-lessons");
  if (progress.completed.html?.length === HTML_LESSONS.length) unlocked.push("html-master");
  if (progress.completed.css?.length === CSS_LESSONS.length) unlocked.push("css-master");
  if (progress.completed.javascript?.length === JS_LESSONS.length) unlocked.push("js-master");
  if (progress.completed.english?.length >= 1) unlocked.push("first-english");
  if (progress.completed.english?.length === ENGLISH_LESSONS.length) unlocked.push("english-master");
  return unlocked;
}

function parseHTMLDoc(code) {
  return new DOMParser().parseFromString(code, "text/html");
}

function buildJsSandboxDoc(code, testCode, domTemplate) {
  const safeCode = code || "";
  const safeTest = testCode || "return {pass:true,message:''}";
  return `<!DOCTYPE html><html><body>${domTemplate || '<div id="app"></div>'}<script>
(async function(){
  const __logs = [];
  const origLog = console.log;
  console.log = function(...args){
    __logs.push(args.map(a => { try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch(e){ return String(a); } }).join(' '));
    origLog.apply(console, args);
  };
  let testResult = { pass: false, message: 'Код ще не виконано.' };
  try {
    ${safeCode}
    try {
      testResult = await (async function(){ ${safeTest} })();
    } catch (e2) {
      testResult = { pass: false, message: 'Помилка в перевірці: ' + e2.message };
    }
  } catch (err) {
    parent.postMessage({ type: 'sandbox-result', logs: __logs, testResult: { pass: false, message: 'Помилка виконання коду: ' + err.message } }, '*');
    return;
  }
  parent.postMessage({ type: 'sandbox-result', logs: __logs, testResult }, '*');
})();
<\/script></body></html>`;
}

const ACCENT_MAP = {
  amber: { text: "text-amber-400", bg: "bg-amber-400", bgSoft: "bg-amber-950", border: "border-amber-800", ring: "ring-amber-400" },
  teal: { text: "text-teal-400", bg: "bg-teal-400", bgSoft: "bg-teal-950", border: "border-teal-800", ring: "ring-teal-400" },
  sky: { text: "text-sky-400", bg: "bg-sky-400", bgSoft: "bg-sky-950", border: "border-sky-800", ring: "ring-sky-400" },
  violet: { text: "text-violet-400", bg: "bg-violet-400", bgSoft: "bg-violet-950", border: "border-violet-800", ring: "ring-violet-400" },
  fuchsia: { text: "text-fuchsia-400", bg: "bg-fuchsia-400", bgSoft: "bg-fuchsia-950", border: "border-fuchsia-800", ring: "ring-fuchsia-400" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400", bgSoft: "bg-emerald-950", border: "border-emerald-800", ring: "ring-emerald-400" },
  rose: { text: "text-rose-400", bg: "bg-rose-400", bgSoft: "bg-rose-950", border: "border-rose-800", ring: "ring-rose-400" },
  orange: { text: "text-orange-400", bg: "bg-orange-400", bgSoft: "bg-orange-950", border: "border-orange-800", ring: "ring-orange-400" },
  stone: { text: "text-stone-400", bg: "bg-stone-400", bgSoft: "bg-stone-800", border: "border-stone-700", ring: "ring-stone-400" },
};

/* =========================================================================
   SMALL UI PIECES
   ========================================================================= */

function Logo({ size = "text-xl" }) {
  return (
    <span className={`font-mono ${size} tracking-tight text-amber-400`}>
      00100101
    </span>
  );
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors w-full text-left ${
        active ? "bg-stone-800 text-amber-400" : "text-stone-400 hover:text-stone-100 hover:bg-stone-900"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function CodeEditor({ value, onChange, placeholder }) {
  const taRef = useRef(null);
  const gutterRef = useRef(null);
  const lines = (value || "").split("\n").length;

  const onScroll = () => {
    if (gutterRef.current && taRef.current) gutterRef.current.scrollTop = taRef.current.scrollTop;
  };

  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = taRef.current;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = value.slice(0, start) + "  " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="flex border border-stone-800 rounded-md overflow-hidden bg-stone-950">
      <div
        ref={gutterRef}
        className="select-none text-right px-2 py-3 text-stone-600 font-mono text-sm bg-stone-900 overflow-hidden"
        style={{ lineHeight: "1.5rem" }}
      >
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        className="flex-1 bg-stone-950 text-stone-100 font-mono text-sm px-3 py-3 outline-none resize-none h-48"
        style={{ lineHeight: "1.5rem" }}
      />
    </div>
  );
}

/* =========================================================================
   LESSON VIEW
   ========================================================================= */

function LessonView({ course, lesson, isDone, onComplete, onNav }) {
  const [code, setCode] = useState(lesson.starter ?? "");
  const [result, setResult] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [previewDoc, setPreviewDoc] = useState("");
  const [consoleLogs, setConsoleLogs] = useState([]);
  const iframeRef = useRef(null);
  const listenerRef = useRef(null);

  useEffect(() => {
    setCode(lesson.starter ?? "");
    setResult(null);
    setHintLevel(0);
    setConsoleLogs([]);
    setPreviewDoc("");
  }, [lesson.id]);

  useEffect(() => {
    return () => {
      if (listenerRef.current) window.removeEventListener("message", listenerRef.current);
    };
  }, []);

  const runJs = (checking) => {
    if (listenerRef.current) window.removeEventListener("message", listenerRef.current);
    const handler = (e) => {
      if (!e.data || e.data.type !== "sandbox-result") return;
      setConsoleLogs(e.data.logs || []);
      if (checking) {
        setResult(e.data.testResult);
        if (e.data.testResult?.pass) onComplete(lesson.id);
      }
      window.removeEventListener("message", handler);
    };
    listenerRef.current = handler;
    window.addEventListener("message", handler);
    const doc = buildJsSandboxDoc(code, lesson.testCode, lesson.domTemplate);
    setPreviewDoc(doc);
  };

  const runHtml = () => {
    setPreviewDoc(`<!DOCTYPE html><html><body>${code}</body></html>`);
  };

  const runCss = () => {
    setPreviewDoc(`<!DOCTYPE html><html><head><style>${code}</style></head><body>${lesson.previewHTML}</body></html>`);
  };

  const handleRun = () => {
    if (lesson.type === "js") runJs(false);
    else if (lesson.type === "css") runCss();
    else runHtml();
  };

  const handleCheck = () => {
    if (lesson.type === "js") {
      runJs(true);
      return;
    }
    if (lesson.type === "html") {
      const doc = parseHTMLDoc(code);
      const r = lesson.check(doc, code);
      setResult(r);
      runHtml();
      if (r.pass) onComplete(lesson.id);
      return;
    }
    if (lesson.type === "css") {
      let firstFail = null;
      for (const t of lesson.tests) {
        if (!t.re.test(code)) {
          firstFail = t.msg;
          break;
        }
      }
      const r = firstFail ? { pass: false, message: firstFail } : { pass: true, message: "Кожне правило застосовується саме до того селектора, який ти вказала — так CSS і працює." };
      setResult(r);
      runCss();
      if (r.pass) onComplete(lesson.id);
      return;
    }
    if (lesson.type === "vocab") {
      const norm = (s) => s.trim().toLowerCase().replace(/['"ʼ’‘`]/g, "'").replace(/\s+/g, " ");
      const ok = lesson.accepted.map(norm).includes(norm(code));
      const r = ok
        ? { pass: true, message: "Саме так. Це слово ще не раз трапиться в документації чи повідомленнях про помилки." }
        : { pass: false, message: "Поки що не те слово. Перевір теорію вище або скористайся підказкою." };
      setResult(r);
      if (r.pass) onComplete(lesson.id);
    }
  };

  const handleReset = () => {
    setCode(lesson.starter ?? "");
    setResult(null);
    setConsoleLogs([]);
  };

  const idx = course.lessons.findIndex((l) => l.id === lesson.id);
  const prev = course.lessons[idx - 1];
  const next = course.lessons[idx + 1];
  const accent = ACCENT_MAP[course.accent];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-mono">
        <span>{course.title}</span>
        <span>/</span>
        <span>Урок {idx + 1} з {course.lessons.length}</span>
      </div>
      <h1 className="text-2xl font-semibold text-stone-100 mb-4">{lesson.title}</h1>

      <p className="text-stone-300 leading-relaxed mb-5">{lesson.theory}</p>

      <div className="mb-5">
        <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">Приклад</div>
        <pre className="bg-stone-900 border border-stone-800 rounded-md p-3 text-sm font-mono text-stone-200 overflow-x-auto">{lesson.example.code}</pre>
        <p className="text-sm text-stone-500 mt-2">{lesson.example.explain}</p>
      </div>

      <div className={`border ${accent.border} rounded-md p-3 mb-4 ${accent.bgSoft} bg-opacity-30`}>
        <div className={`text-xs uppercase tracking-wide ${accent.text} mb-1`}>Завдання</div>
        <p className="text-stone-100 text-sm">{lesson.task}</p>
      </div>

      {lesson.type === "vocab" ? (
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Твоя відповідь українською..."
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          className="w-full bg-stone-950 border border-stone-800 rounded-md px-3 py-3 text-stone-100 outline-none focus:border-amber-700 font-mono text-sm"
        />
      ) : (
        <CodeEditor value={code} onChange={setCode} placeholder="Пиши код тут..." />
      )}

      <div className="flex flex-wrap gap-2 mt-3 mb-4">
        {lesson.type !== "vocab" && (
          <button onClick={handleRun} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-md text-sm">
            <Play size={14} /> Запустити
          </button>
        )}
        <button onClick={handleCheck} className={`flex items-center gap-1.5 px-3 py-1.5 ${accent.bg} hover:opacity-90 text-stone-950 font-medium rounded-md text-sm`}>
          <CheckCircle2 size={14} /> Перевірити
        </button>
        <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-700 hover:bg-stone-900 text-stone-300 rounded-md text-sm">
          <RotateCcw size={14} /> Скинути
        </button>
      </div>

      {(lesson.type === "html" || lesson.type === "css") && previewDoc && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">Результат</div>
          <iframe title="preview" srcDoc={previewDoc} sandbox="allow-scripts" className="w-full h-40 bg-white rounded-md border border-stone-800" />
        </div>
      )}

      {lesson.type === "js" && consoleLogs.length > 0 && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide text-stone-500 mb-2 flex items-center gap-1.5"><Terminal size={12} /> Консоль</div>
          <div className="bg-stone-950 border border-stone-800 rounded-md p-3 font-mono text-sm text-emerald-400 space-y-1">
            {consoleLogs.map((l, i) => <div key={i}>{"> "}{l}</div>)}
          </div>
        </div>
      )}
      {lesson.type === "js" && previewDoc && lesson.domTemplate && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">Сторінка</div>
          <iframe title="dom-preview" srcDoc={previewDoc} sandbox="allow-scripts" className="w-full h-24 bg-white rounded-md border border-stone-800" />
        </div>
      )}

      {result && (
        <div className={`flex items-start gap-2 p-3 rounded-md mb-4 border ${result.pass ? "border-emerald-800 bg-emerald-950 bg-opacity-40" : "border-rose-800 bg-rose-950 bg-opacity-40"}`}>
          {result.pass ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" /> : <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />}
          <div className="text-sm">
            <div className={result.pass ? "text-emerald-300 font-medium" : "text-rose-300 font-medium"}>{result.pass ? "Правильно!" : "Поки що неправильно"}</div>
            <div className="text-stone-300 mt-0.5">{result.message}</div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="text-xs uppercase tracking-wide text-stone-500 mb-2 flex items-center gap-1.5"><Lightbulb size={12} /> Допомога</div>
        <div className="flex flex-wrap gap-2">
          {hintLevel < lesson.hints.length && (
            <button onClick={() => setHintLevel((h) => h + 1)} className="px-3 py-1.5 text-sm border border-stone-700 rounded-md text-stone-300 hover:bg-stone-900">
              Підказка {hintLevel + 1}
            </button>
          )}
          {hintLevel >= lesson.hints.length && hintLevel < lesson.hints.length + 1 && (
            <button onClick={() => setHintLevel((h) => h + 1)} className="px-3 py-1.5 text-sm border border-stone-700 rounded-md text-stone-300 hover:bg-stone-900">
              Показати рішення
            </button>
          )}
        </div>
        <div className="mt-2 space-y-2">
          {lesson.hints.slice(0, hintLevel).map((h, i) => (
            <div key={i} className="text-sm text-stone-400 bg-stone-900 rounded-md p-2 border border-stone-800">{h}</div>
          ))}
          {hintLevel > lesson.hints.length && (
            <pre className="text-sm text-stone-300 bg-stone-900 rounded-md p-2 border border-stone-800 font-mono overflow-x-auto">{lesson.solution}</pre>
          )}
        </div>
      </div>

      <WhereToPractice courseId={course.id} />

      <div className="flex items-center justify-between border-t border-stone-800 pt-4">
        <button
          disabled={!prev}
          onClick={() => prev && onNav(course.id, prev.id)}
          className="flex items-center gap-1 text-sm text-stone-400 disabled:opacity-30 hover:text-stone-100"
        >
          <ChevronLeft size={16} /> Попередній
        </button>
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          {isDone && <CheckCircle size={14} className="text-emerald-400" />}
        </div>
        <button
          disabled={!next}
          onClick={() => next && onNav(course.id, next.id)}
          className="flex items-center gap-1 text-sm text-stone-400 disabled:opacity-30 hover:text-stone-100"
        >
          Наступний <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

const TAG_STYLE = {
  "безкоштовно": "border-emerald-700 text-emerald-400 hover:bg-emerald-950",
  "freemium": "border-sky-700 text-sky-400 hover:bg-sky-950",
  "платно": "border-amber-700 text-amber-400 hover:bg-amber-950",
};

function ToolPill({ tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noreferrer"
      title={tool.note}
      className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs bg-stone-950 transition-colors ${TAG_STYLE[tool.tag] || "border-stone-700 text-stone-400"}`}
    >
      {tool.name} <span className="opacity-70">· {tool.tag}</span>
    </a>
  );
}

function WhereToPractice({ courseId }) {
  const tools = TOOLS_BY_COURSE[courseId];
  if (!tools || tools.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">Де ще можна виконувати завдання</div>
      <div className="flex flex-wrap gap-2">
        {tools.map((t) => <ToolPill key={t.name} tool={t} />)}
      </div>
      <p className="text-xs text-stone-600 mt-2">Це не питання «або-або»: платформа перевіряє твій код тут-таки, а ці інструменти корисні, коли захочеш попрацювати локально або показати проєкт комусь поза чатом.</p>
    </div>
  );
}

/* =========================================================================
   COURSE PAGE (sidebar of lessons + lesson view)
   ========================================================================= */

function CoursePage({ course, lessonId, progress, onComplete, onNav }) {
  if (course.status === "planned") {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-mono">
          <span>Курси</span><span>/</span><span>{course.title}</span>
        </div>
        <h1 className="text-2xl font-semibold text-stone-100 mb-3">{course.title}</h1>
        <p className="text-stone-400 mb-4">{course.subtitle}</p>
        <div className="border border-stone-800 rounded-md p-4 bg-stone-900 mb-6">
          <p className="text-stone-300 text-sm leading-relaxed">
            Цей курс — наступний етап платформи 00100101 і ще не наповнений уроками. Він не позначений
            фейковим прогресом чи заглушками — чесніше показати порожню секцію, ніж вдавати завершені уроки.
          </p>
          <p className="text-stone-400 text-sm leading-relaxed mt-2">
            Структура даних для уроків однакова для всіх курсів (див. README.md → «Як додати новий урок»).
            Скопіюй формат уроку з HTML/CSS/JavaScript і додай сюди власний контент — платформа одразу
            підхопить перевірку, прогрес і бібліотеку для нового курсу.
          </p>
        </div>
        <WhereToPractice courseId={course.id} />
      </div>
    );
  }

  const done = new Set(progress.completed[course.id] || []);
  const lesson = course.lessons.find((l) => l.id === lessonId) || course.lessons[0];
  const accent = ACCENT_MAP[course.accent];

  return (
    <div className="flex gap-8">
      <div className="w-56 shrink-0 hidden md:block">
        <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">{course.title} · {done.size}/{course.lessons.length}</div>
        <div className="w-full h-1.5 bg-stone-800 rounded-full mb-4 overflow-hidden">
          <div className={`h-full ${accent.bg}`} style={{ width: `${(done.size / course.lessons.length) * 100}%` }} />
        </div>
        <div className="space-y-0.5">
          {course.lessons.map((l, i) => {
            const isDone = done.has(l.id);
            const isActive = l.id === lesson.id;
            return (
              <button
                key={l.id}
                onClick={() => onNav(course.id, l.id)}
                className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                  isActive ? "bg-stone-800 text-stone-100" : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"
                }`}
              >
                {isDone ? <CheckCircle size={14} className="text-emerald-400 shrink-0" /> : <Circle size={14} className="text-stone-700 shrink-0" />}
                <span className="truncate">{String(i + 1).padStart(2, "0")}. {l.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      <LessonView
        course={course}
        lesson={lesson}
        isDone={done.has(lesson.id)}
        onComplete={onComplete}
        onNav={onNav}
      />
    </div>
  );
}

/* =========================================================================
   HOME
   ========================================================================= */

function Home({ progress, onGo }) {
  const total = Object.values(progress.completed).reduce((a, arr) => a + arr.length, 0);
  return (
    <div className="max-w-3xl">
      <Logo size="text-4xl" />
      <h1 className="text-2xl md:text-3xl font-semibold text-stone-100 mt-4 mb-2 leading-snug">
        Від першого символу до власного Full Stack продукту.
      </h1>
      <p className="text-stone-400 mb-8">
        Українська навчальна платформа програмування: читай теорію, пиши справжній код прямо в браузері,
        отримуй автоматичну перевірку — і рухайся власним шляхом.
      </p>

      <div className="flex items-center gap-4 mb-8 text-sm text-stone-400">
        <div className="flex items-center gap-1.5"><Flame size={14} className="text-amber-400" /> {progress.xp} XP</div>
        <div className="flex items-center gap-1.5"><Star size={14} className="text-amber-400" /> {progress.unlocked?.length || 0} досягнень</div>
        <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400" /> {total} уроків завершено</div>
      </div>

      <div className="text-xs uppercase tracking-wide text-stone-500 mb-3">Навчальний шлях</div>
      <div className="space-y-2 mb-8">
        {COURSES.map((c) => {
          const accent = ACCENT_MAP[c.accent];
          const done = (progress.completed[c.id] || []).length;
          return (
            <button
              key={c.id}
              onClick={() => onGo(c.id)}
              className="w-full flex items-center justify-between border border-stone-800 hover:border-stone-700 rounded-md px-4 py-3 bg-stone-900 hover:bg-stone-900/70 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${accent.bg}`} />
                <div>
                  <div className="text-stone-100 text-sm font-medium">{c.title}</div>
                  <div className="text-stone-500 text-xs">{c.subtitle}</div>
                </div>
              </div>
              <div className="text-xs text-stone-500 font-mono shrink-0 ml-4">
                {c.status === "available" ? `${done}/${c.lessons.length}` : "у розробці"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onGo("english")} className="flex items-center gap-2 border border-violet-800 bg-violet-950 bg-opacity-30 rounded-md px-4 py-3 text-left hover:bg-opacity-50">
          <Globe size={18} className="text-violet-400" />
          <div>
            <div className="text-stone-100 text-sm font-medium">English for Developers</div>
            <div className="text-stone-500 text-xs">англійська для програмування</div>
          </div>
        </button>
        <button onClick={() => onGo("ukrainian")} className="flex items-center gap-2 border border-sky-800 bg-sky-950 bg-opacity-30 rounded-md px-4 py-3 text-left hover:bg-opacity-50">
          <Languages size={18} className="text-sky-400" />
          <div>
            <div className="text-stone-100 text-sm font-medium">Українська термінологія</div>
            <div className="text-stone-500 text-xs">правильні технічні терміни</div>
          </div>
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   LIBRARY / SYMBOLS / ENGLISH / UKRAINIAN / PROGRESS PAGES
   ========================================================================= */

const GUIDE_ACCENT = {
  violet: { badge: "bg-violet-500", text: "text-violet-300", border: "border-violet-800", box: "bg-violet-950 border-violet-800", iconBg: "bg-violet-950 border-violet-800", icon: "text-violet-400" },
  sky: { badge: "bg-sky-500", text: "text-sky-300", border: "border-sky-800", box: "bg-sky-950 border-sky-800", iconBg: "bg-sky-950 border-sky-800", icon: "text-sky-400" },
  teal: { badge: "bg-teal-500", text: "text-teal-300", border: "border-teal-800", box: "bg-teal-950 border-teal-800", iconBg: "bg-teal-950 border-teal-800", icon: "text-teal-400" },
  orange: { badge: "bg-orange-500", text: "text-orange-300", border: "border-orange-800", box: "bg-orange-950 border-orange-800", iconBg: "bg-orange-950 border-orange-800", icon: "text-orange-400" },
  lime: { badge: "bg-lime-500", text: "text-lime-300", border: "border-lime-800", box: "bg-lime-950 border-lime-800", iconBg: "bg-lime-950 border-lime-800", icon: "text-lime-400" },
  cyan: { badge: "bg-cyan-500", text: "text-cyan-300", border: "border-cyan-800", box: "bg-cyan-950 border-cyan-800", iconBg: "bg-cyan-950 border-cyan-800", icon: "text-cyan-400" },
  rose: { badge: "bg-rose-500", text: "text-rose-300", border: "border-rose-800", box: "bg-rose-950 border-rose-800", iconBg: "bg-rose-950 border-rose-800", icon: "text-rose-400" },
  amber: { badge: "bg-amber-500", text: "text-amber-300", border: "border-amber-800", box: "bg-amber-950 border-amber-800", iconBg: "bg-amber-950 border-amber-800", icon: "text-amber-400" },
  red: { badge: "bg-red-500", text: "text-red-300", border: "border-red-800", box: "bg-red-950 border-red-800", iconBg: "bg-red-950 border-red-800", icon: "text-red-400" },
  yellow: { badge: "bg-yellow-500", text: "text-yellow-300", border: "border-yellow-800", box: "bg-yellow-950 border-yellow-800", iconBg: "bg-yellow-950 border-yellow-800", icon: "text-yellow-400" },
  pink: { badge: "bg-pink-500", text: "text-pink-300", border: "border-pink-800", box: "bg-pink-950 border-pink-800", iconBg: "bg-pink-950 border-pink-800", icon: "text-pink-400" },
};
const STEP_CYCLE = ["violet", "teal", "sky", "rose", "amber", "cyan", "lime", "orange"];

function StepCard({ step, idx }) {
  const c = GUIDE_ACCENT[STEP_CYCLE[idx % STEP_CYCLE.length]];
  return (
    <div className={`border ${c.border} rounded-lg p-4 bg-stone-900`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-7 h-7 rounded-full ${c.badge} text-stone-950 text-sm font-bold flex items-center justify-center shrink-0`}>{idx + 1}</span>
        <h3 className="text-stone-100 font-medium text-sm">{step.title}</h3>
      </div>
      <pre className="bg-stone-950 rounded p-3 text-xs font-mono text-stone-200 overflow-x-auto mb-3 whitespace-pre">{step.code}</pre>
      <div className={`bg-stone-950 border-l-2 ${c.border} rounded p-3`}>
        <div className={`text-xs font-medium mb-1 ${c.text}`}>{step.resultLabel || "Результат:"}</div>
        <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap">{step.result}</pre>
      </div>
      {step.note && (
        <div className="mt-2 flex items-start gap-2 text-xs text-sky-300 bg-sky-950 bg-opacity-30 border border-sky-800 rounded p-2">
          <Info size={14} className="shrink-0 mt-0.5" /> {step.note}
        </div>
      )}
    </div>
  );
}

function TermGuidePage({ guideId, onBack }) {
  const guide = TERM_GUIDES[guideId];
  if (!guide) return null;
  const c = GUIDE_ACCENT[guide.accent];
  return (
    <div className="max-w-5xl">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-100 mb-4">
        <ChevronLeft size={16} /> Назад до бібліотеки
      </button>
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-xl border flex items-center justify-center shrink-0 ${c.iconBg}`}>
            <Code2 className={c.icon} size={26} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            {guide.titleUa} <span className={c.text}>({guide.titleEn})</span>
          </h1>
        </div>
        <div className={`border rounded-lg p-4 max-w-xs flex gap-3 ${c.box} bg-opacity-30`}>
          <Lightbulb className={`${c.icon} shrink-0`} size={20} />
          <div>
            <div className={`${c.text} text-sm font-semibold mb-1`}>Просто кажучи:</div>
            <div className="text-stone-300 text-sm">{guide.simple}</div>
          </div>
        </div>
      </div>

      <p className="text-stone-300 mb-6">{guide.intro}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {guide.steps.map((step, i) => <StepCard key={i} step={step} idx={i} />)}
      </div>

      <div className={`border-2 rounded-lg p-4 ${c.border} bg-opacity-20`} style={{}}>
        <div className={`flex items-center gap-2 mb-3 font-semibold ${c.text}`}>
          <Star size={18} /> Де використовують {guide.titleUa.toLowerCase()}?
        </div>
        <ul className="space-y-1">
          {guide.usage.map((u) => (
            <li key={u} className="text-stone-300 text-sm flex items-start gap-2">
              <span className={c.text}>•</span> {u}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ReferenceCard({ item, onOpenGuide }) {
  return (
    <div className="border border-stone-800 rounded-md p-3 bg-stone-900">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <code className="text-amber-400 font-mono text-sm">{item.name}</code>
      </div>
      <p className="text-stone-300 text-sm mb-2">{item.desc}</p>
      <pre className="text-xs font-mono text-stone-400 bg-stone-950 rounded px-2 py-1 overflow-x-auto mb-2">{item.syntax}</pre>
      <div className="text-xs text-stone-500">Атрибути/опції: {item.attrs}</div>
      {item.pitfalls && item.pitfalls !== "—" && <div className="text-xs text-rose-400 mt-1">Типова помилка: {item.pitfalls}</div>}
      {item.guide && (
        <button onClick={() => onOpenGuide(item.guide)} className="mt-2 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
          <BookOpen size={12} /> Детальніше, з прикладами →
        </button>
      )}
    </div>
  );
}

function TermPageV2({ termId }) {
  const term = TERM_PAGES_V2[termId];
  if (!term) return <div className="text-stone-500 text-sm">Цей термін ще не має повного опису.</div>;

  const demoDoc = `<!DOCTYPE html><html><head><style>
    body { font-family: sans-serif; padding: 16px; background: white; color: #111; }
    label { display: block; margin-bottom: 8px; }
  </style></head><body>${term.example}</body></html>`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2 py-1 text-xs font-mono rounded bg-violet-950 border border-violet-800 text-violet-300">{term.badge}</span>
        <h1 className="text-2xl font-mono font-bold text-stone-100">{term.title}</h1>
        <button
          onClick={() => navigator.clipboard && navigator.clipboard.writeText(term.title)}
          className="text-stone-500 hover:text-stone-300"
          title="Копіювати"
        >
          <Code2 size={16} />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold mb-2"><Info size={16} /> Що це</div>
            <p className="text-stone-300 text-sm leading-relaxed">{term.whatIsIt}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-2"><Star size={16} /> Для чого використовується</div>
            <ul className="space-y-1">
              {term.useCases.map((u) => (
                <li key={u} className="text-stone-300 text-sm flex items-start gap-2"><span className="text-amber-400">•</span>{u}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold mb-2"><Code2 size={16} /> Синтаксис</div>
            <pre className="bg-stone-950 border border-stone-800 rounded-md p-3 text-sm font-mono text-stone-200 overflow-x-auto">{term.syntax}</pre>
          </div>

          <div>
            <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold mb-2"><Library size={16} /> Основні атрибути</div>
            <div className="border border-stone-800 rounded-md overflow-hidden">
              {term.attributes.map((a, i) => (
                <div key={a.name} className={`flex gap-3 px-3 py-2 text-sm ${i % 2 ? "bg-stone-900" : "bg-stone-950"}`}>
                  <code className="text-amber-400 font-mono shrink-0 w-20">{a.name}</code>
                  <span className="text-stone-400">{a.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2"><Play size={16} /> Приклад</div>
            <pre className="bg-stone-950 border border-stone-800 rounded-md p-3 text-xs font-mono text-stone-200 overflow-x-auto whitespace-pre">{term.example}</pre>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-stone-300 text-sm font-semibold mb-2"><Play size={16} /> Результат</div>
            <iframe title="live-demo" srcDoc={demoDoc} sandbox="allow-scripts" className="w-full h-64 bg-white rounded-md border border-stone-800" />
          </div>

          <div className="border border-amber-800 bg-amber-950 bg-opacity-20 rounded-md p-3">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-2"><XCircle size={16} /> Типові помилки</div>
            <ul className="space-y-1.5">
              {term.pitfalls.map((p) => (
                <li key={p} className="text-stone-300 text-xs flex items-start gap-2"><span className="text-amber-400 shrink-0">•</span>{p}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-stone-400 text-sm font-semibold mb-2">Пов'язані елементи</div>
            <div className="flex flex-wrap gap-2">
              {term.related.map((r) => (
                <span key={r} className="px-2 py-1 text-xs font-mono rounded border border-sky-800 text-sky-400 bg-sky-950 bg-opacity-30">{r}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferencePage() {
  const sections = Object.keys(REF_NAV);
  const [section, setSection] = useState(null);
  const [selected, setSelected] = useState(null);
  const [openGroups, setOpenGroups] = useState({});

  const openSection = (name) => {
    setSection(name);
    const groups = REF_NAV[name];
    const groupNames = Object.keys(groups);
    setOpenGroups(groupNames.length ? { [groupNames[0]]: true } : {});
    const firstId = groupNames.flatMap((g) => groups[g]).find((id) => TERM_PAGES_V2[id]);
    setSelected(firstId || null);
  };

  const groups = section ? REF_NAV[section] : null;

  return (
    <div className="flex gap-6">
      <div className="w-56 shrink-0 hidden md:block">
        <div className="space-y-0.5 mb-4">
          {sections.map((name) => (
            <button
              key={name}
              onClick={() => openSection(name)}
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm font-medium flex items-center justify-between ${
                section === name ? "bg-stone-800 text-amber-400" : "text-stone-300 hover:bg-stone-900"
              }`}
            >
              {name}
              {Object.keys(REF_NAV[name]).length === 0 && <span className="text-[10px] text-stone-600 uppercase">скоро</span>}
            </button>
          ))}
        </div>

        {groups && (
          <div className="border-t border-stone-800 pt-3">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="mb-4">
                <button
                  onClick={() => setOpenGroups((g) => ({ ...g, [group]: !g[group] }))}
                  className="flex items-center justify-between w-full text-xs uppercase tracking-wide text-stone-500 mb-1.5"
                >
                  {group} <ChevronRight size={12} className={openGroups[group] ? "rotate-90" : ""} />
                </button>
                {openGroups[group] && (
                  <div className="space-y-0.5">
                    {items.map((id) => {
                      const has = !!TERM_PAGES_V2[id];
                      return (
                        <button
                          key={id}
                          disabled={!has}
                          onClick={() => has && setSelected(id)}
                          className={`w-full text-left px-2 py-1.5 rounded-md text-sm font-mono ${
                            selected === id && has ? "bg-stone-800 text-amber-400" : has ? "text-stone-300 hover:bg-stone-900" : "text-stone-700 cursor-default"
                          }`}
                        >
                          {id}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <p className="text-xs text-stone-600 mt-4">Сірі пункти ще не мають повного опису — додаються поступово.</p>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {!section && (
          <div className="text-stone-500 text-sm">
            <p className="mb-2">Обери розділ зліва, щоб побачити терміни.</p>
          </div>
        )}
        {section && !selected && (
          <div className="text-stone-500 text-sm">Розділ «{section}» ще в розробці — терміни додаються поступово.</div>
        )}
        {section && selected && <TermPageV2 termId={selected} />}
      </div>
    </div>
  );
}

function LibraryPage() {
  const [tab, setTab] = useState("html");
  const [openGuide, setOpenGuide] = useState(null);
  const data = { html: LIBRARY_HTML, css: LIBRARY_CSS, js: LIBRARY_JS, python: LIBRARY_PYTHON, sql: LIBRARY_SQL }[tab];

  if (openGuide) return <TermGuidePage guideId={openGuide} onBack={() => setOpenGuide(null)} />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-stone-100 mb-1 flex items-center gap-2"><Library size={22} className="text-amber-400" /> Бібліотека</h1>
      <p className="text-stone-500 text-sm mb-5">Довідник тегів, властивостей і концепцій — шукай і читай у будь-якому порядку. {data.length} записів у цьому розділі.</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {[["html", "HTML"], ["css", "CSS"], ["js", "JavaScript"], ["python", "Python"], ["sql", "SQL"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-3 py-1.5 rounded-md text-sm ${tab === id ? "bg-stone-800 text-amber-400" : "text-stone-400 hover:bg-stone-900"}`}>{label}</button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {data.map((item) => <ReferenceCard key={item.name} item={item} onOpenGuide={setOpenGuide} />)}
      </div>
    </div>
  );
}

function CheatSheetsPage() {
  const tabs = Object.keys(CHEATSHEETS);
  const [tab, setTab] = useState(tabs[0]);
  const [query, setQuery] = useState("");
  const [openGuide, setOpenGuide] = useState(null);
  const sheet = CHEATSHEETS[tab];

  const groups = useMemo(() => {
    if (!query.trim()) return sheet.groups;
    const q = query.toLowerCase();
    return sheet.groups
      .map((g) => ({ ...g, items: g.items.filter(([t, d]) => t.toLowerCase().includes(q) || d.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [sheet, query]);

  if (openGuide) return <TermGuidePage guideId={openGuide} onBack={() => setOpenGuide(null)} />;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-stone-100 mb-1 flex items-center gap-2"><Code2 size={22} className="text-amber-400" /> Шпаргалки</h1>
      <p className="text-stone-500 text-sm mb-5">Щільні довідкові таблиці — все важливе на одному екрані, як на коврику для миші. Підкреслені рядки розкриваються в детальний гайд.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((id) => (
          <button
            key={id}
            onClick={() => { setTab(id); setQuery(""); }}
            className={`px-3 py-1.5 rounded-md text-sm ${tab === id ? "bg-stone-800 text-amber-400" : "text-stone-400 hover:bg-stone-900"}`}
          >
            {CHEATSHEETS[id].title}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Пошук у шпаргалці ${sheet.title}...`}
        className="w-full mb-5 bg-stone-900 border border-stone-800 rounded-md px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
      />

      <div className="border border-stone-800 rounded-md bg-stone-950 p-4 space-y-5">
        {groups.map((g) => (
          <div key={g.cat}>
            <div className="text-xs uppercase tracking-wide text-amber-500 mb-2 pb-1 border-b border-stone-800">{g.cat}</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
              {g.items.map(([term, desc, guideId]) => (
                guideId ? (
                  <button
                    key={term}
                    onClick={() => setOpenGuide(guideId)}
                    className="flex items-baseline gap-2 py-0.5 text-sm border-b border-stone-900 text-left hover:bg-stone-900 rounded-sm"
                  >
                    <code className="text-amber-400 font-mono shrink-0 underline decoration-dotted underline-offset-2">{term}</code>
                    <span className="text-stone-500 text-xs">{desc}</span>
                  </button>
                ) : (
                  <div key={term} className="flex items-baseline gap-2 py-0.5 text-sm border-b border-stone-900">
                    <code className="text-amber-400 font-mono shrink-0">{term}</code>
                    <span className="text-stone-500 text-xs">{desc}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && <div className="text-sm text-stone-500">Нічого не знайдено за «{query}».</div>}
      </div>
    </div>
  );
}
const CAT_COLOR = {
  "Основні символи": "border-amber-800 text-amber-400 hover:bg-amber-950",
  "Дужки": "border-sky-800 text-sky-400 hover:bg-sky-950",
  "Оператори": "border-teal-800 text-teal-400 hover:bg-teal-950",
  "Спеціальні символи": "border-violet-800 text-violet-400 hover:bg-violet-950",
  "Пробіл": "border-stone-700 text-stone-400 hover:bg-stone-900",
  "Складені оператори": "border-rose-800 text-rose-400 hover:bg-rose-950",
  "Escape-послідовності": "border-fuchsia-800 text-fuchsia-400 hover:bg-fuchsia-950",
  "CSS-комбінатори": "border-emerald-800 text-emerald-400 hover:bg-emerald-950",
  "HTML-специфічні": "border-orange-800 text-orange-400 hover:bg-orange-950",
  "Бітові оператори": "border-indigo-800 text-indigo-400 hover:bg-indigo-950",
  "Python-специфічні": "border-lime-800 text-lime-400 hover:bg-lime-950",
  "SQL-специфічні": "border-cyan-800 text-cyan-400 hover:bg-cyan-950",
  "Термінал/Bash": "border-yellow-800 text-yellow-400 hover:bg-yellow-950",
  "Regex": "border-pink-800 text-pink-400 hover:bg-pink-950",
  "Git": "border-red-800 text-red-400 hover:bg-red-950",
};

function SymbolsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(SYMBOLS[0]);
  const cats = useMemo(() => {
    const filtered = SYMBOLS.filter((s) =>
      !query || s.sym.toLowerCase().includes(query.toLowerCase()) || s.en.toLowerCase().includes(query.toLowerCase()) || s.ua.toLowerCase().includes(query.toLowerCase())
    );
    const map = {};
    filtered.forEach((s) => { (map[s.cat] = map[s.cat] || []).push(s); });
    return map;
  }, [query]);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-stone-100 mb-1 flex items-center gap-2"><Hash size={22} className="text-amber-400" /> Символи</h1>
      <p className="text-stone-500 text-sm mb-4">Усі символи — по одному разу, без дублів. Натисни на плитку, щоб побачити пояснення внизу. {SYMBOLS.length} записів.</p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Наприклад: === або дужки"
        className="w-full mb-6 bg-stone-900 border border-stone-800 rounded-md px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
      />

      {Object.entries(cats).map(([cat, items]) => (
        <div key={cat} className="mb-5">
          <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">{cat}</div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((s) => (
              <button
                key={s.cat + s.sym}
                onClick={() => setSelected(s)}
                title={s.ua}
                className={`min-w-14 h-14 px-2 flex flex-col items-center justify-center border rounded-md bg-stone-950 font-mono transition-colors ${CAT_COLOR[s.cat] || "border-stone-700 text-stone-400"} ${selected === s ? "ring-2 ring-offset-2 ring-offset-stone-950 " + (ACCENT_MAP.amber.ring) : ""}`}
              >
                <span className="text-sm leading-tight text-center">{s.sym}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(cats).length === 0 && <div className="text-sm text-stone-500 mb-6">Нічого не знайдено за «{query}».</div>}

      {selected && (
        <div className="sticky bottom-4 mt-6 border-2 border-amber-700 rounded-lg p-4 bg-stone-900 shadow-lg">
          <div className="flex items-start justify-between gap-3 mb-2">
            <code className="text-amber-400 font-mono text-2xl">{selected.sym}</code>
            <span className="text-xs text-stone-500 shrink-0">{selected.langs}</span>
          </div>
          <div className="text-stone-100 font-medium">{selected.en}</div>
          <div className="text-stone-400 text-sm mb-2">{selected.ua}</div>
          <pre className="text-xs font-mono text-stone-300 bg-stone-950 rounded px-2 py-1.5 mb-2 overflow-x-auto">{selected.example}</pre>
          <p className="text-sm text-stone-400">{selected.explain}</p>
        </div>
      )}
    </div>
  );
}

function EnglishPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-stone-100 mb-1 flex items-center gap-2"><Globe size={22} className="text-violet-400" /> English for Developers</h1>
      <p className="text-stone-500 text-sm mb-5">Слова, які найчастіше зустрічаються в документації, помилках і код-рев'ю.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {ENGLISH_WORDS.map((w) => (
          <div key={w.en} className="border border-violet-900 border-opacity-40 rounded-md p-3 bg-stone-900">
            <div className="text-stone-100 font-medium">{w.en}</div>
            <div className="text-violet-400 text-sm mb-2">{w.ua}</div>
            <div className="text-xs text-stone-400 italic">"{w.ex_en}"</div>
            <div className="text-xs text-stone-500">{w.ex_ua}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UkrainianPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-stone-100 mb-1 flex items-center gap-2"><Languages size={22} className="text-sky-400" /> Українська для програмування</h1>
      <p className="text-stone-500 text-sm mb-5">Правильна технічна термінологія замість кальки з англійської.</p>
      <div className="space-y-2">
        {UKRAINIAN_TERMS.map((t) => (
          <div key={t.en} className="flex items-center gap-4 border border-stone-800 rounded-md p-3 bg-stone-900">
            <code className="text-stone-500 font-mono text-sm w-28 shrink-0">{t.en}</code>
            <div className="flex-1">
              <span className="text-emerald-400 text-sm">{t.correct}</span>
              {t.avoid !== "—" && <span className="text-rose-400 text-xs ml-3">уникай: {t.avoid}</span>}
              {t.note && <div className="text-xs text-stone-500 mt-0.5">{t.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressPage({ progress }) {
  const total = Object.values(progress.completed).reduce((a, arr) => a + arr.length, 0);
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-stone-100 mb-1 flex items-center gap-2"><Trophy size={22} className="text-amber-400" /> Мій прогрес</h1>
      <p className="text-stone-500 text-sm mb-6">{total} уроків завершено · {progress.xp} XP</p>

      <div className="space-y-3 mb-8">
        {COURSES.filter((c) => c.status === "available").map((c) => {
          const accent = ACCENT_MAP[c.accent];
          const done = (progress.completed[c.id] || []).length;
          return (
            <div key={c.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-stone-200">{c.title}</span>
                <span className="text-stone-500 font-mono text-xs">{done}/{c.lessons.length}</span>
              </div>
              <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <div className={`h-full ${accent.bg}`} style={{ width: `${(done / c.lessons.length) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs uppercase tracking-wide text-stone-500 mb-3">Досягнення</div>
      <div className="grid sm:grid-cols-2 gap-2">
        {ACHIEVEMENTS_DEF.map((a) => {
          const unlocked = (progress.unlocked || []).includes(a.id);
          return (
            <div key={a.id} className={`border rounded-md p-3 flex items-center gap-3 ${unlocked ? "border-amber-800 bg-amber-950 bg-opacity-20" : "border-stone-800 bg-stone-900 opacity-50"}`}>
              <Trophy size={18} className={unlocked ? "text-amber-400" : "text-stone-600"} />
              <div>
                <div className={`text-sm ${unlocked ? "text-stone-100" : "text-stone-500"}`}>{a.title}</div>
                <div className="text-xs text-stone-500">{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   SEARCH
   ========================================================================= */

function buildSearchIndex() {
  const idx = [];
  [...HTML_LESSONS, ...CSS_LESSONS, ...JS_LESSONS, ...ENGLISH_LESSONS].forEach((l) => {
    const courseId = HTML_LESSONS.includes(l) ? "html" : CSS_LESSONS.includes(l) ? "css" : JS_LESSONS.includes(l) ? "javascript" : "english";
    idx.push({ kind: "Урок", label: l.title, sub: l.theory.slice(0, 70) + "…", nav: { view: "course", courseId, lessonId: l.id } });
  });
  SYMBOLS.forEach((s) => idx.push({ kind: "Символ", label: `${s.sym} — ${s.ua}`, sub: s.en, nav: { view: "symbols" } }));
  [...LIBRARY_HTML, ...LIBRARY_CSS, ...LIBRARY_JS, ...LIBRARY_PYTHON, ...LIBRARY_SQL].forEach((l) => idx.push({ kind: "Бібліотека", label: l.name, sub: l.desc, nav: { view: "library" } }));
  ENGLISH_WORDS.forEach((w) => idx.push({ kind: "English", label: w.en, sub: w.ua, nav: { view: "english" } }));
  UKRAINIAN_TERMS.forEach((t) => idx.push({ kind: "Українська", label: t.correct, sub: t.en, nav: { view: "ukrainian" } }));
  Object.entries(CHEATSHEETS).forEach(([id, sheet]) => {
    sheet.groups.forEach((g) => g.items.forEach(([term, desc]) => {
      idx.push({ kind: `Шпаргалка ${sheet.title}`, label: term, sub: desc, nav: { view: "cheatsheets" } });
    }));
  });
  return idx;
}
const SEARCH_INDEX = buildSearchIndex();

function SearchOverlay({ query, setQuery, onClose, onNav }) {
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter((r) => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q)).slice(0, 20);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-stone-950 bg-opacity-90 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-md px-3 py-2 mb-3">
          <Search size={16} className="text-stone-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="div, margin, =, flex, TypeError, пробіл..."
            className="flex-1 bg-transparent outline-none text-stone-100 text-sm"
          />
          <button onClick={onClose}><X size={16} className="text-stone-500" /></button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-1">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => { onNav(r.nav); onClose(); }}
              className="w-full text-left flex items-start gap-3 px-3 py-2 rounded-md hover:bg-stone-900"
            >
              <span className="text-xs text-stone-500 font-mono w-20 shrink-0 pt-0.5">{r.kind}</span>
              <div>
                <div className="text-sm text-stone-100">{r.label}</div>
                <div className="text-xs text-stone-500">{r.sub}</div>
              </div>
            </button>
          ))}
          {query.trim() && results.length === 0 && <div className="text-sm text-stone-500 px-3 py-2">Нічого не знайдено.</div>}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   APP
   ========================================================================= */

export default function App() {
  const [view, setView] = useState("home");
  const [courseId, setCourseId] = useState("html");
  const [lessonId, setLessonId] = useState(HTML_LESSONS[0].id);
  const [progress, setProgress] = useState(defaultProgress());
  const [loaded, setLoaded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadProgress().then((p) => { setProgress(p); setLoaded(true); });
  }, []);

  const handleComplete = useCallback((id) => {
    setProgress((prev) => {
      const list = prev.completed[courseId] || [];
      if (list.includes(id)) return prev;
      const next = { ...prev, completed: { ...prev.completed, [courseId]: [...list, id] }, xp: prev.xp + 20 };
      next.unlocked = computeUnlocked(next);
      saveProgress(next);
      return next;
    });
  }, [courseId]);

  const goHome = () => setView("home");
  const goCourse = (cId, lId) => {
    const c = COURSES.find((x) => x.id === cId);
    setCourseId(cId);
    setLessonId(lId || c.lessons[0]?.id);
    setView("course");
    setSidebarOpen(false);
  };
  const goPage = (v) => { setView(v); setSidebarOpen(false); };

  const handleSearchNav = (nav) => {
    if (nav.view === "course") goCourse(nav.courseId, nav.lessonId);
    else setView(nav.view);
  };

  const course = COURSES.find((c) => c.id === courseId);

  if (!loaded) {
    return <div className="min-h-screen bg-stone-950 flex items-center justify-center"><Logo size="text-2xl" /></div>;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex">
      {/* Sidebar nav */}
      <aside className={`w-60 shrink-0 border-r border-stone-800 p-4 flex-col gap-1 fixed md:sticky top-0 h-screen bg-stone-950 z-40 ${sidebarOpen ? "flex" : "hidden md:flex"}`}>
        <button onClick={goHome} className="mb-6 flex items-center justify-between">
          <Logo />
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X size={18} className="text-stone-500" /></button>
        </button>
        <NavButton icon={HomeIcon} label="Головна" active={view === "home"} onClick={goHome} />
        <div className="text-xs uppercase tracking-wide text-stone-600 mt-4 mb-1 px-3">Курси</div>
        {COURSES.map((c) => (
          <NavButton key={c.id} icon={BookOpen} label={c.title} active={view === "course" && courseId === c.id} onClick={() => goCourse(c.id)} />
        ))}
        <div className="text-xs uppercase tracking-wide text-stone-600 mt-4 mb-1 px-3">Мова</div>
        <NavButton icon={Globe} label="English for Devs" active={view === "english"} onClick={() => goPage("english")} />
        <NavButton icon={Languages} label="Українська" active={view === "ukrainian"} onClick={() => goPage("ukrainian")} />
        <div className="text-xs uppercase tracking-wide text-stone-600 mt-4 mb-1 px-3">Довідка</div>
        <NavButton icon={Library} label="Бібліотека" active={view === "library"} onClick={() => goPage("library")} />
        <NavButton icon={Info} label="Новий довідник (бета)" active={view === "reference"} onClick={() => goPage("reference")} />
        <NavButton icon={Code2} label="Шпаргалки" active={view === "cheatsheets"} onClick={() => goPage("cheatsheets")} />
        <NavButton icon={Hash} label="Символи" active={view === "symbols"} onClick={() => goPage("symbols")} />
        <NavButton icon={Trophy} label="Мій прогрес" active={view === "progress"} onClick={() => goPage("progress")} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-stone-800 px-4 py-3 sticky top-0 bg-stone-950 z-30">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu size={20} className="text-stone-400" /></button>
          <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 flex-1 max-w-sm bg-stone-900 border border-stone-800 rounded-md px-3 py-1.5 text-sm text-stone-500 hover:border-stone-700">
            <Search size={14} /> Що ти шукаєш?
          </button>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-stone-500">
            <Flame size={14} className="text-amber-400" /> {progress.xp} XP
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {view === "home" && <Home progress={progress} onGo={(id) => (id === "english" || id === "ukrainian" ? goPage(id) : goCourse(id))} />}
          {view === "course" && <CoursePage course={course} lessonId={lessonId} progress={progress} onComplete={handleComplete} onNav={goCourse} />}
          {view === "library" && <LibraryPage />}
          {view === "reference" && <ReferencePage />}
          {view === "cheatsheets" && <CheatSheetsPage />}
          {view === "symbols" && <SymbolsPage />}
          {view === "english" && <EnglishPage />}
          {view === "ukrainian" && <UkrainianPage />}
          {view === "progress" && <ProgressPage progress={progress} />}
        </main>
      </div>

      {searchOpen && (
        <SearchOverlay
          query={searchQuery}
          setQuery={setSearchQuery}
          onClose={() => { setSearchOpen(false); setSearchQuery(""); }}
          onNav={handleSearchNav}
        />
      )}
    </div>
  );
}
