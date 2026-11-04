// Build 6 PowerPoint decks (3 variants x UA/EN) from the mockup screenshots.
// node deck.cjs  ->  ../dist/<variant>/Allergy-Workflow-Variant-N-<Name>-UA.pptx / -EN.pptx
const path = require("path");
const pptxgen = require("pptxgenjs");
const SKILL = "/root/.claude/skills/synced/fdada73e-2402-4858-afc7-b5a127985215_966de724-5d79-4308-bb13-dfa69dcc5275/pptx";
const { applyTheme } = require(SKILL + "/scripts/apply_theme.js");

const DIST = path.join(__dirname, "..", "dist");
const THEME = {
  name: "Allergy Workflow",
  headFontFace: "Calibri", bodyFontFace: "Calibri",
  colors: { dk1: "10212F", lt1: "FFFFFF", dk2: "536679", lt2: "F4F7FB", accent1: "1E62D0", accent2: "174FAB", accent3: "16845F", accent4: "9A620D", accent5: "B42318", accent6: "D7E2EC", hlink: "1E62D0", folHlink: "174FAB" }
};
const HEX = { blue: "1E62D0", ink: "10212F", muted: "536679", canvas: "F4F7FB", line: "D7E2EC", soft: "E6EEFB", red: "B42318", redSoft: "FDECEA", green: "16845F", white: "FFFFFF" };

const VARIANTS = [
  { id: "v1-clear", num: 1, name: "Clear",
    title: ["Сучасний, але простий", "Modern and simple"],
    about: ["Класичний CRM-стиль у нинішніх кольорах програми: біле бокове меню, чіткі таблиці, компактні картки, рівні кути.", "Classic CRM look in the app's current colors: white side menu, clean tables, compact cards, square corners."],
    traits: [["Компактно: більше даних на екрані", "Compact: more data on screen"], ["Звично для тих, хто працював у CRM", "Familiar to anyone who has used a CRM"], ["Календар мінімальний: наступний прийом через +7 днів", "Minimal calendar: next visit at +7 days"]],
    cal: ["Лише пацієнти на імунотерапії та їхній наступний прийом (останній укол + 7 днів). Червоним позначено тих, хто запізнюється.", "Only immunotherapy patients and their next visit (last shot + 7 days). Late patients are red."] },
  { id: "v2-airy", num: 2, name: "Airy",
    title: ["Сучасний, легший", "Modern and lighter"],
    about: ["Ті самі білі й сині кольори, але легше: більше повітря, м'які картки з тінню, округлі кнопки. Поля для введення лишаються прямими.", "Same white and blue colors, but lighter: more white space, soft cards with shadow, round buttons. Input boxes stay square."],
    traits: [["Спокійний, «повітряний» вигляд", "Calm, airy look"], ["Округлі кнопки, м'які тіні", "Round buttons, soft shadows"], ["Календар на 3 вкладки: «козир» для замовника", "3-tab calendar: the trump card for the client"]],
    cal: ["Календар із 3 вкладок: записи пацієнтів, графік роботи, нотатки з кольорами важливості. Термінові нотатки з'являються на дашборді.", "A 3-tab calendar: patient appointments, staff schedule, color-coded notes. Urgent notes also show on the Dashboard."] },
  { id: "v3-easy", num: 3, name: "Easy",
    title: ["Максимально просто", "As simple as possible"],
    about: ["Для неуважного й непідготовленого користувача: великий шрифт для слабкого зору, плашка «What to do now» на кожному екрані, головна кнопка пульсує.", "For a distracted, non-technical user: large low-vision font, a 'What to do now' bar on every screen, the main button pulses."],
    traits: [["Підказка «що робити зараз» на кожному екрані", "A 'what to do now' hint on every screen"], ["Великі кнопки й поля, легко натиснути", "Big buttons and fields, easy to tap"], ["Календар мінімальний, з великими елементами", "Minimal calendar with large elements"]],
    cal: ["Як у варіанті 1, але все більше: пацієнти на імунотерапії та наступний прийом через +7 днів.", "As in variant 1, but larger: immunotherapy patients and their next visit at +7 days."] }
];

const SECTIONS = [
  ["01-login", ["Вхід", "Sign in"], ["Форма на порожньому сірому фоні, під нею список демо-логінів.", "A lone form on an empty grey page with a list of demo logins."], ["Панель з назвою і форма поруч", "Кнопка «око» показує пароль", "Демо-логіни прибрано"], ["Brand panel next to the form", "An eye button shows the password", "Demo logins removed"]],
  ["02-menu", ["Меню", "Menu"], ["9–10 пунктів в одному рядку, обрізаються. Settings відкривається в новій вкладці.", "9–10 items in one row, cut off. Settings opens in a new tab."], ["Бокове меню з групами", "Settings має своє підменю", "Планшет: іконки; телефон: кнопка Menu"], ["Side menu with groups", "Settings has its own submenu", "Tablet: icons; phone: a Menu button"]],
  ["03-dashboard", ["Дашборд", "Dashboard"], ["16 однакових плиток. Не зрозуміло, що важливе.", "16 identical tiles. Unclear what matters."], ["Зверху «Needs attention» з кольорами", "4 головні цифри", "Статуси однією смугою, натискання відкриває список"], ["'Needs attention' first, color-coded", "4 key numbers", "One status strip, click opens the list"]],
  ["04-patients", ["Пацієнти", "Patients"], ["13 кнопок-статусів, деякі двічі. Одне поле пошуку і кнопка «Apply».", "13 status buttons, some twice. One search box and an Apply button."], ["Окремі поля: Name, E-mail, Phone", "Збіги з першої букви", "Одна кнопка «Filter» зі списком"], ["Separate Name, E-mail, Phone boxes", "Matches from the first letter", "One Filter button with a list"]],
  ["07-calendar", ["Календар", "Calendar"], ["Порожня сітка. Не видно, навіщо вона і як щось додати.", "An empty grid. Unclear what it is for or how to add anything."], null, null],
  ["08-new-patient", ["Новий пацієнт", "New Patient"], ["~20 полів підряд, без зірочок і підказок. Дата мовою браузера.", "~20 fields in a row, no stars, no help. Date picker in the browser language."], ["4 пронумеровані блоки", "«*» обов'язкові, «to discuss» на погодження", "«?» біля кожного поля, дата англійською"], ["4 numbered blocks", "* required, 'to discuss' to confirm", "? on every field, English date picker"]],
  ["11-test-panel", ["Test Panel", "Test Panel"], ["Таблиця панелі алергенів.", "The allergen panel grid."], ["Структуру не змінювали (домовленість)", "Оновлено шрифти й поля", "Кольори ті самі"], ["Layout unchanged (agreed)", "Fonts and fields refreshed", "Same colors"]],
  ["12-my-profile", ["Профіль лікаря", "Doctor profile"], ["Довга сторінка, не видно, що обов'язкове. NPI має 12 полів.", "A long page; unclear what is required. NPI has 12 fields."], ["Прогрес «2 з 3»: ім'я, клініка, підпис", "Клініки тегами, видалення з підтвердженням", "NPI необов'язковий, деталі сховані"], ["'2 of 3' progress: name, clinic, signature", "Clinics as tags; removing asks first", "NPI optional, details hidden"]],
  ["13-antigens", ["Antigens", "Antigens"], ["150 рядків, Save і Archive у кожному. Archive без питання.", "150 rows, Save and Archive on each. Archive without asking."], ["Розділ розгортається натисканням", "Пошук і редагування олівцем", "Архів лише після підтвердження"], ["Section opens with a tap", "Search and pencil edit", "Archive only after confirming"]],
  ["14-accounts", ["Акаунти", "Accounts"], ["Скидання пароля й деактивація одним кліком.", "Password reset and deactivation in one click."], ["Таблиця зі статусом", "Скидання пароля перепитує", "Деактивація: треба вписати слово"], ["A table with status", "Password reset asks first", "Deactivation: type a word to confirm"]],
  ["15a-settings-vitus", ["Settings", "Settings"], ["Одна довга сторінка, відкривається в новій вкладці.", "One long page that opens in a new tab."], ["Підменю в боковому меню", "Кожен пункт — окрема картка", "Upload і Roll back з підтвердженням"], ["A submenu in the side menu", "Each item is its own card", "Upload and Roll back ask first"]],
  ["16-training", ["Навчання (новий розділ)", "Training (new)"], ["Розділу не було.", "Did not exist."], ["6 коротких уроків з прогресом", "«Show me» підсвічує потрібну кнопку", "Можна пройти за 10 хвилин"], ["6 short lessons with progress", "'Show me' highlights the button", "Takes about 10 minutes"]],
  ["17-confirm", ["Підтвердження дій", "Action confirmation"], ["Небезпечні дії виконувались одним кліком.", "Risky actions happened in one click."], ["Білий екран, червоне питання", "«Ні» сіра, «Так» червона", "Однаково на всіх пристроях"], ["White screen, red question", "'No' grey, 'Yes' red", "The same on every device"]]
];
const GALLERIES = {
  "04-patients": [["Пацієнти: пошук і фільтр", "Patients: search and filter"], [["05-patients-search", "Збіги з першої букви", "Matches from the first letter"], ["06-patients-filter", "Вікно Filter", "Filter window"]]],
  "08-new-patient": [["Новий пацієнт: підказки й помилки", "New Patient: help and errors"], [["09-help", "Підказка «?»", "The ? help"], ["10-new-patient-errors", "Помилки під полем, дата англійською", "Errors under the field, English date"]]],
  "07-calendar": [["Календар: графік і нотатки", "Calendar: schedule and notes"], [["07-calendar-schedule", "Графік роботи", "Staff schedule"], ["07-calendar-notes", "Нотатки з кольорами", "Color-coded notes"]]],
  "16-training": [["Навчання: «Show me»", "Training: 'Show me'"], [["16-training", "Список уроків", "Lesson list"], ["18-training-show-me", "Підсвічена кнопка", "Highlighted button"]]]
};
const SETTINGS = [["15a-settings-vitus", "VitusSource"], ["15b-settings-reminders", "Workflow Reminders"], ["15c-settings-notifications", "Workflow Notifications"], ["15d-settings-immuno", "Immunotherapy"], ["15e-settings-templates", "Document Templates"], ["15f-settings-facilities", "Facilities & Doctors"]];
const CHANGES = [
  ["Бокове меню замість обрізаного верхнього рядка", "Side menu instead of the cut-off top bar"],
  ["Settings — підменю, без нової вкладки", "Settings as a submenu, no new tab"],
  ["Пошук пацієнта: 3 поля, збіги з першої букви", "Patient search: 3 boxes, matches from the first letter"],
  ["Одна кнопка «Filter» замість 13", "One Filter button instead of 13"],
  ["Дашборд починається з «Needs attention»", "Dashboard starts with 'Needs attention'"],
  ["«*» біля обов'язкових полів, «?» біля кожного", "* on required fields, ? on every field"],
  ["Вибір дати завжди англійською", "Date picker always in English"],
  ["Профіль лікаря: 3 обов'язкові кроки з прогресом", "Doctor profile: 3 required steps with progress"],
  ["Червоне підтвердження перед кожною небезпечною дією", "A red confirmation before every risky action"],
  ["Новий розділ Training з уроками", "New Training section with lessons"]
];
const QUESTIONS = [
  ["Які поля нового пацієнта обов'язкові і чи блокують вони збереження?", "Which New Patient fields are required, and do they block saving?"],
  ["Календар: потрібні графік і нотатки чи досить наступного прийому?", "Calendar: are schedule and notes needed, or only the next visit?"],
  ["Наступний візит = останній укол + 7 днів. Чи правильно для всіх?", "Next visit = last shot + 7 days. Right for everyone?"],
  ["Профіль лікаря: обов'язкові лише ім'я, клініка й підпис?", "Doctor profile: only name, clinic and signature required?"],
  ["Реакція 3–5 мм: «не значуща» чи «позитивна»? Яке правило?", "A 3–5 mm reaction: 'not significant' or 'positive'? Which rule?"]
];
const L = {
  sub: ["Візуальна концепція · Allergy Workflow", "Visual concept · Allergy Workflow"],
  variant: n => [`Варіант ${n} з 3`, `Variant ${n} of 3`],
  about: ["Про цей варіант", "About this variant"],
  unchanged: ["Що не змінюється", "What stays the same"],
  unchangedList: [["Кольори: білий фон і той самий синій", "Colors: white background and the same blue"], ["Структура: ті самі розділи й поля", "Structure: same sections and fields"], ["Test Panel: без змін", "Test Panel: unchanged"]],
  login: ["Вхід у живий макет", "Live mockup sign-in"],
  changes: ["10 головних змін", "10 key changes"],
  before: ["Було", "Before"], now: ["Стало", "Now"],
  dev: [["Комп'ютер", "Desktop"], ["Планшет", "Tablet"], ["Телефон", "Phone"]],
  settingsAll: ["Settings: кожен пункт окремо", "Settings: each item on its own"],
  safety: ["Захист від помилок", "Mistake protection"],
  safetyItems: [[["Червоне питання", "Red question"], ["Кожне «Видалити», «Зберегти», «Архівувати» перепитує", "Every Delete, Save and Archive asks first"]], [["Кружечок «?»", "The ? circle"], ["Біля кожного поля: що вписати і приклад", "On every field: what to type and an example"]], [["Зірочка «*»", "The * star"], ["Позначає обов'язкові поля", "Marks required fields"]], [["Розділ Training", "Training section"], ["Уроки з кнопкою «Show me»", "Lessons with a 'Show me' button"]]],
  questions: ["Питання до замовника", "Questions for the client"],
  next: ["Наступні кроки", "Next steps"],
  nextList: [["Замовник обирає один з 3 варіантів", "The client picks one of the 3 variants"], ["Відповідаємо на 5 питань (обов'язкові поля, календар)", "We answer the 5 questions (required fields, calendar)"], ["Переносимо обраний варіант у справжню програму", "We move the chosen variant into the real app"], ["Паралельно виправляємо помилки з аудиту", "In parallel we fix the issues from the audit"]],
  footer: "Allergy Workflow · Visual concept · 11/2026",
  sections: [["Вступ", "Intro"], ["Розділи програми", "App sections"], ["Підсумок", "Summary"]]
};

function imgSize(file) { const d = require("fs").readFileSync(file); // JPEG SOF parse
  let i = 2; while (i < d.length) { if (d[i] !== 0xFF) { i++; continue; } const m = d[i + 1], len = d.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC3) return { h: d.readUInt16BE(i + 5), w: d.readUInt16BE(i + 7) }; i += 2 + len; } return { w: 1440, h: 900 }; }

async function build(v, li) {
  const t = a => a[li];
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = `Allergy Workflow — ${t(v.title)}`;
  pres.author = "Allergy Workflow";
  const C = pres.SchemeColor;
  const shot = (k, d) => path.join(DIST, v.id, "shots", `${k}-${d}.jpg`);
  const has = k => require("fs").existsSync(shot(k, "desktop"));

  pres.defineSlideMaster({ title: "Title", background: { color: HEX.blue },
    objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.6, y: 2.2, w: 6.2, h: 1.9, fontSize: 44, bold: true, color: C.background1, valign: "top", margin: 0 }, text: "" } },
              { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 4.25, w: 6.0, h: 1.4, fontSize: 18, color: C.background1, valign: "top", margin: 0 }, text: "" } }] });
  pres.defineSlideMaster({ title: "Content", background: { color: HEX.white },
    objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 10.6, h: 0.75, fontSize: 32, bold: true, color: C.text1, valign: "middle", margin: 0 }, text: "" } },
              { text: { text: L.footer, options: { x: 0.6, y: 7.08, w: 8, h: 0.3, fontSize: 10, color: C.text2, margin: 0 } } }],
    slideNumber: { x: 12.2, y: 7.08, w: 0.6, h: 0.3, fontSize: 10, color: HEX.muted, align: "right" } });

  const content = (title, sec) => { const s = pres.addSlide({ masterName: "Content", sectionTitle: t(L.sections[sec]) }); s.addText(title, { placeholder: "title" }); return s; };
  const numDot = (s, n, x, y) => { s.addShape(pres.shapes.OVAL, { x, y, w: 0.5, h: 0.5, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: "Section number" }); s.addText(String(n).padStart(2, "0"), { x, y, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true }); };
  const framed = (s, file, x, y, h, dev, cap) => {
    const { w: pw, h: ph } = imgSize(file); const w = h * pw / ph;
    const pad = dev === "desktop" ? 0.04 : dev === "tablet" ? 0.09 : 0.08;
    s.addShape(dev === "desktop" ? pres.shapes.RECTANGLE : pres.shapes.ROUNDED_RECTANGLE, { x: x - pad, y: y - pad, w: w + 2 * pad, h: h + 2 * pad, fill: { color: dev === "desktop" ? HEX.line : "1B1F24" }, line: { color: dev === "desktop" ? HEX.line : "1B1F24" }, rectRadius: dev === "desktop" ? undefined : 0.12, shadow: { type: "outer", color: "10212F", opacity: 0.18, blur: 8, offset: 3, angle: 90 } });
    s.addImage({ path: file, x, y, w, h, altText: cap || dev });
    if (cap) s.addText(cap, { x: x - 0.2, y: y + h + 0.1, w: w + 0.4, h: 0.3, fontSize: 11, color: C.text2, align: "center", margin: 0, isTextBox: true });
    return w;
  };
  const triple = (s, key, y, h) => { // desktop + tablet + phone, centered
    const ws = ["desktop", "tablet", "phone"].map(d => { const z = imgSize(shot(key, d)); return h * z.w / z.h; });
    const gap = 0.45, total = ws.reduce((a, b) => a + b, 0) + gap * 2; let x = (13.333 - total) / 2;
    ["desktop", "tablet", "phone"].forEach((d, i) => { framed(s, shot(key, d), x, y, h, d, t(L.dev[i])); x += ws[i] + gap; });
  };

  // 1. Title
  pres.addSection({ title: t(L.sections[0]) });
  let s = pres.addSlide({ masterName: "Title", sectionTitle: t(L.sections[0]) });
  s.addText(t(L.variant(v.num)).toUpperCase(), { x: 0.6, y: 1.55, w: 6, h: 0.4, fontSize: 14, bold: true, color: C.background1, charSpacing: 3, margin: 0, isTextBox: true });
  s.addText(t(v.title), { placeholder: "title" });
  s.addText(t(L.sub), { placeholder: "body" });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.15, y: 1.25, w: 5.68, h: 3.55 + 0.08, fill: { color: HEX.white }, line: { color: HEX.white }, shadow: { type: "outer", color: "000000", opacity: 0.3, blur: 14, offset: 6, angle: 90 } });
  s.addImage({ path: shot("03-dashboard", "desktop"), x: 7.19, y: 1.29, w: 5.6, h: 3.5, altText: "Dashboard, desktop" });
  { const z = imgSize(shot("03-dashboard", "phone")); const ph = 3.4, pw = ph * z.w / z.h;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 11.55 - 0.08, y: 3.45 - 0.08, w: pw + 0.16, h: ph + 0.16, fill: { color: "1B1F24" }, line: { color: "1B1F24" }, rectRadius: 0.14 });
    s.addImage({ path: shot("03-dashboard", "phone"), x: 11.55, y: 3.45, w: pw, h: ph, altText: "Dashboard, phone" }); }

  // 2. About
  s = content(t(L.about), 0);
  s.addText(t(v.about), { x: 0.6, y: 1.35, w: 6.1, h: 1.3, fontSize: 18, color: C.text1, valign: "top", margin: 0, isTextBox: true });
  v.traits.forEach((tr, i) => {
    const y = 2.95 + i * 0.85;
    s.addShape(pres.shapes.OVAL, { x: 0.6, y, w: 0.42, h: 0.42, fill: { color: C.accent1 }, line: { color: C.accent1 } });
    s.addText("✓", { x: 0.6, y, w: 0.42, h: 0.42, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(t(tr), { x: 1.2, y: y - 0.04, w: 5.5, h: 0.5, fontSize: 16, color: C.text1, valign: "middle", margin: 0, isTextBox: true });
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 1.35, w: 5.43, h: 2.7, fill: { color: HEX.canvas }, line: { color: HEX.canvas } });
  s.addText(t(L.unchanged), { x: 7.6, y: 1.55, w: 4.9, h: 0.4, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  s.addText(L.unchangedList.map((x, i, a) => ({ text: t(x), options: { bullet: true, breakLine: i < a.length - 1 } })), { x: 7.6, y: 2.05, w: 4.9, h: 1.8, fontSize: 15, color: C.text1, paraSpaceAfter: 6, valign: "top", margin: 0, isTextBox: true });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 4.35, w: 5.43, h: 2.25, fill: { color: HEX.soft }, line: { color: HEX.soft } });
  s.addText(t(L.login), { x: 7.6, y: 4.55, w: 4.9, h: 0.4, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
  s.addText([{ text: "Login:  ", options: { color: HEX.muted } }, { text: "admin", options: { bold: true, fontFace: "Courier New", breakLine: true } }, { text: "Password:  ", options: { color: HEX.muted } }, { text: "Demo2026!", options: { bold: true, fontFace: "Courier New" } }], { x: 7.6, y: 5.05, w: 4.9, h: 0.9, fontSize: 18, color: C.text1, margin: 0, valign: "top", isTextBox: true });
  s.addText(t(["Файли: mockup-desktop / tablet / phone.html", "Files: mockup-desktop / tablet / phone.html"]), { x: 7.6, y: 6.0, w: 4.9, h: 0.35, fontSize: 12, color: C.text2, margin: 0, isTextBox: true });

  // 3. Changes
  s = content(t(L.changes), 0);
  CHANGES.forEach((c, i) => {
    const col = i < 5 ? 0 : 1, row = i % 5, x = 0.6 + col * 6.2, y = 1.45 + row * 1.08;
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.55, h: 0.55, fill: { color: C.accent1 }, line: { color: C.accent1 } });
    s.addText(String(i + 1), { x, y, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(t(c), { x: x + 0.75, y: y - 0.1, w: 5.2, h: 0.75, fontSize: 16, color: C.text1, valign: "middle", margin: 0, isTextBox: true });
  });

  // 4. Sections
  pres.addSection({ title: t(L.sections[1]) });
  SECTIONS.forEach(([key, title, was, nowUa, nowEn], i) => {
    s = content(t(title), 1);
    numDot(s, i + 1, 11.9, 0.47);
    const now = key === "07-calendar" ? [t(v.cal)] : (li === 0 ? nowUa : nowEn);
    // Before / Now strip
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 4.1, h: 1.55, fill: { color: HEX.canvas }, line: { color: HEX.line } });
    s.addText(t(L.before).toUpperCase(), { x: 0.8, y: 1.42, w: 3.7, h: 0.3, fontSize: 11, bold: true, color: C.text2, charSpacing: 2, margin: 0, isTextBox: true });
    s.addText(t(was), { x: 0.8, y: 1.75, w: 3.7, h: 1.0, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true });
    s.addShape(pres.shapes.RECTANGLE, { x: 4.9, y: 1.3, w: 7.83, h: 1.55, fill: { color: HEX.soft }, line: { color: HEX.soft } });
    s.addText(t(L.now).toUpperCase(), { x: 5.1, y: 1.42, w: 7.4, h: 0.3, fontSize: 11, bold: true, color: C.accent1, charSpacing: 2, margin: 0, isTextBox: true });
    if (now.length === 1) s.addText(now[0], { x: 5.1, y: 1.75, w: 7.4, h: 1.0, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true });
    else s.addText(now.map((x, j, a) => ({ text: x, options: { bullet: true, breakLine: j < a.length - 1 } })), { x: 5.1, y: 1.75, w: 7.4, h: 1.0, fontSize: 14, color: C.text1, valign: "top", paraSpaceAfter: 2, margin: 0, isTextBox: true });
    triple(s, key, 3.15, 3.35);
    // extra gallery slide
    const g = GALLERIES[key];
    if (g && g[1].every(([k]) => has(k))) {
      s = content(t(g[0]), 1); numDot(s, i + 1, 11.9, 0.47);
      g[1].forEach(([k, cu, ce], j) => framed(s, shot(k, "desktop"), 0.75 + j * 6.15, 1.55, 3.6 * 900 / 1440 * 1.6, "desktop", li === 0 ? cu : ce));
    }
    if (key === "15a-settings-vitus") {
      s = content(t(L.settingsAll), 1); numDot(s, i + 1, 11.9, 0.47);
      SETTINGS.forEach(([k, cap], j) => { const col = j % 3, row = Math.floor(j / 3); framed(s, shot(k, "desktop"), 0.75 + col * 4.07, 1.45 + row * 2.85, 2.2, "desktop", cap); });
    }
  });

  // 5. Summary
  pres.addSection({ title: t(L.sections[2]) });
  s = content(t(L.safety), 2);
  L.safetyItems.forEach(([h, d], i) => {
    const y = 1.45 + i * 1.3;
    s.addShape(pres.shapes.OVAL, { x: 0.6, y, w: 0.6, h: 0.6, fill: { color: i === 0 ? C.accent5 : C.accent1 }, line: { color: i === 0 ? C.accent5 : C.accent1 } });
    s.addText(["!", "?", "*", "i"][i], { x: 0.6, y, w: 0.6, h: 0.6, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(t(h), { x: 1.4, y: y - 0.05, w: 5, h: 0.4, fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true });
    s.addText(t(d), { x: 1.4, y: y + 0.35, w: 5.2, h: 0.5, fontSize: 14, color: C.text2, margin: 0, valign: "top", isTextBox: true });
  });
  framed(s, shot("17-confirm", "desktop"), 6.95, 1.5, 3.6, "desktop", null);

  s = content(t(L.questions), 2);
  QUESTIONS.forEach((q, i) => {
    const y = 1.45 + i * 1.05;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 12.13, h: 0.85, fill: { color: i % 2 ? HEX.white : HEX.canvas }, line: { color: HEX.line } });
    s.addText(String(i + 1), { x: 0.8, y, w: 0.5, h: 0.85, fontSize: 22, bold: true, color: C.accent5, valign: "middle", margin: 0, isTextBox: true });
    s.addText(t(q), { x: 1.4, y, w: 11.1, h: 0.85, fontSize: 17, color: C.text1, valign: "middle", margin: 0, isTextBox: true });
  });

  s = pres.addSlide({ masterName: "Title", sectionTitle: t(L.sections[2]) });
  s.addText(t(L.next), { placeholder: "title" });
  s.addText(L.nextList.map((x, i, a) => ({ text: t(x), options: { bullet: { type: "number" }, breakLine: i < a.length - 1 } })), { x: 7.0, y: 2.2, w: 5.7, h: 3.2, fontSize: 18, color: C.background1, paraSpaceAfter: 10, valign: "top", margin: 0, isTextBox: true });
  s.addText(t(L.sub), { placeholder: "body" });

  const out = path.join(DIST, v.id, `Allergy-Workflow-Variant-${v.num}-${v.name}-${li === 0 ? "UA" : "EN"}.pptx`);
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("wrote", path.basename(out));
}

(async () => { for (const v of VARIANTS) for (const li of [0, 1]) await build(v, li); })();
