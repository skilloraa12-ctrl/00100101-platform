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
  "Форми": ["form", "input", "label", "button", "select", "option", "textarea", "fieldset", "legend", "datalist", "output", "progress", "meter"],
  "Типи input": ["text", "password", "email", "number", "date", "time", "checkbox", "radio", "file", "range", "color", "search", "tel", "url", "hidden"],
  "Семантика": ["header", "nav", "main", "section", "article", "footer", "aside"],
  "Списки": ["ul", "ol", "li", "dl"],
  "Таблиці": ["table", "tr", "th", "td"],
  "Медіа": ["img", "video", "audio", "picture"],
  "Текст": ["strong", "em", "mark", "code", "pre", "blockquote"],
  "Структура документа": ["html", "head", "title", "base", "link", "meta", "script", "style", "noscript"],
  "Текстова семантика": ["b", "i", "small", "del", "ins", "s", "u", "sub", "sup", "abbr", "cite", "q", "kbd", "samp", "var", "time", "data", "bdi", "bdo", "ruby", "rt", "rp", "dfn", "wbr", "br", "hr"],
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
  const [selected, setSelected] = useState("range");
  const [openGroups, setOpenGroups] = useState({ "Форми": true, "Типи input": true });

  return (
    <div className="flex gap-6">
      <div className="w-52 shrink-0 hidden md:block">
        {Object.entries(REF_NAV).map(([group, items]) => (
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
      <div className="flex-1 min-w-0">
        <TermPageV2 termId={selected} />
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
