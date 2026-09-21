// Python Web Scraping — the sixth Python direction. Same intro + 20 lessons
// structure, building step by step toward a Book Scraper that parses HTML,
// cleans and filters data, and saves results to CSV. One honest caveat,
// same spirit as Game Development and Desktop Development: real scraping
// fetches live pages over the network with requests + BeautifulSoup, but
// this sandbox's outbound network is proxied/CORS-restricted and can't
// install extra packages (the same jsdelivr block that forced Pyodide
// itself to be self-hosted). So these lessons work on HTML already
// "downloaded" into a Python string, and parse it with html.parser —
// genuine Python stdlib, no network, no extra install — which teaches the
// real parsing logic that transfers directly onto requests.get(url).text
// once run locally with requests + bs4 installed.
export const PYTHON_SCRAPING_LESSONS = [
  {
    id: "py-scraping-intro",
    title: "Що це? — Web Scraping",
    type: "intro",
    theory:
      "Python Web Scraping — це напрямок про автоматизоване отримання даних із вебсторінок: назви й ціни товарів, заголовки новин, курси валют — усе, що показано на сторінці, але не має готового API для завантаження. Скрипт завантажує HTML-код сторінки (так само, як це робить браузер) і ВИТЯГУЄ з нього потрібні дані.\n\nВАЖЛИВО чесно попередити: справжній скрапінг зазвичай завантажує сторінку через бібліотеку requests (запит по мережі до реального сайту) і розбирає HTML бібліотекою BeautifulSoup. У цій браузерній пісочниці мережеві запити до довільних сайтів обмежені (проксі й CORS-політика браузера), а встановити BeautifulSoup через pip тут не можна (з тієї ж причини, чому довелось самостійно хостити сам Pyodide — блокування зовнішніх CDN). Тому ці 20 уроків працюють із HTML, який уже «завантажений» у звичайний текстовий рядок Python (так, ніби requests.get(url).text уже відпрацював), і розбирають його вбудованим у стандартну бібліотеку html.parser — без жодних зовнішніх пакетів. Сама логіка розбору — справжня, і переноситься на реальний сайт після встановлення requests і beautifulsoup4 локально.\n\nЦе вирішує задачу «дістати структуровані дані з неструктурованої сторінки»: пошук потрібних тегів, читання їхніх атрибутів і тексту, очищення отриманих даних (прибрати зайві пробіли, символи валюти), фільтрація й сортування результатів, і збереження в зручному форматі — CSV-файл, який відкривається в Excel чи Google Таблицях.\n\nЩо знадобиться з попередніх напрямків: цикли, списки, словники, list comprehension і try/except із Python Core, а з Automation — робота з файлами (там же і буде записаний результат). Що буде після 20 уроків: повний Book Scraper — парсить каталог книг із HTML, очищує ціни, фільтрує й сортує результати, рахує статистику і зберігає все в CSV-файл.",
    presentation: [
      { title: "Web Scraping — коротко", points: ["Отримання структурованих даних зі сторінок, у яких немає готового API", "Тут HTML уже «завантажений» у рядок — розбирає його стандартний html.parser, без мережі й без зовнішніх пакетів", "Та сама логіка розбору переноситься на requests + BeautifulSoup після встановлення локально"] },
      { title: "Результат", points: ["20 уроків, кожен додає нову дію розбору чи обробки даних", "Фінал: Book Scraper — парсинг, очищення, фільтрація, статистика, CSV", "Потрібне знання списків/словників/try-except (Core) і роботи з файлами (Automation)"] },
    ],
  },
  {
    id: "py-scraping-1",
    title: "Проблема ручного пошуку в HTML",
    type: "python",
    theory:
      "Найпростіша (і найгірша) ідея — шукати потрібний текст у HTML вручну, через .find() і зрізи рядка. .find(підрядок) повертає ІНДЕКС першого входження підрядка (або -1, якщо не знайдено):\n\nhtml = \"<h3>Python Crash Course</h3>\"\nstart = html.find(\"<h3>\") + len(\"<h3>\")\nend = html.find(\"</h3>\")\ntitle = html[start:end]\n\nЦе ПРАЦЮЄ для одного простого прикладу, але «ламається» від найменшої зміни розмітки (зайвий пробіл, атрибут у тегу, вкладений тег) — саме тому далі знадобиться справжній HTML-парсер, а не ручний пошук підрядків.",
    examples: [
      { title: "Ручний пошук через find() і зрізи", code: `html = "<h3>Python Crash Course</h3>"\nstart = html.find("<h3>") + len("<h3>")\nend = html.find("</h3>")\ntitle = html[start:end]\nprint(title)`, explain: "Спрацьовує тут, але для сторінки з десятками схожих тегів такий підхід швидко стає неможливим підтримувати." },
    ],
    task: `Дано html = "<h3>Fluent Python</h3>". Знайди позицію після "<h3>" (start) і позицію "</h3>" (end), виріж title = html[start:end] і виведи title.`,
    starter: `html = "<h3>Fluent Python</h3>"\n\n# start = html.find("<h3>") + len("<h3>")\n# end = html.find("</h3>")\n# title = html[start:end]\n# print(title)\n`,
    hints: [`start = html.find("<h3>") + len("<h3>") — одразу ПІСЛЯ відкриваючого тегу.`, `end = html.find("</h3>") — позиція ПОЧАТКУ закриваючого тегу.`, `start = html.find("<h3>") + len("<h3>")\nend = html.find("</h3>")\ntitle = html[start:end]\nprint(title)`],
    solution: `html = "<h3>Fluent Python</h3>"\n\nstart = html.find("<h3>") + len("<h3>")\nend = html.find("</h3>")\ntitle = html[start:end]\nprint(title)`,
    testCode: `if not any(l.strip() == "Fluent Python" for l in __logs):\n    __result__ = {"pass": False, "message": "title має дорівнювати рівно «Fluent Python», без тегів навколо."}\nelse:\n    __result__ = {"pass": True, "message": "Працює для одного простого рядка — але уяви той самий пошук на сторінці з сотнею схожих тегів. Далі — інструмент, зроблений саме для цього."}`,
  },
  {
    id: "py-scraping-2",
    title: "html.parser: справжній розбір HTML",
    type: "python",
    theory:
      "html.parser.HTMLParser — вбудований у стандартну бібліотеку Python клас, спеціально створений для розбору HTML. Замість ручного пошуку підрядків, ти створюєш ВЛАСНИЙ клас, що успадковує HTMLParser (той самий принцип успадкування з Python OOP), і перевизначаєш метод handle_starttag(self, tag, attrs) — Python сам викликає його для КОЖНОГО відкриваючого тегу під час розбору:\n\nfrom html.parser import HTMLParser\n\nclass TagPrinter(HTMLParser):\n    def handle_starttag(self, tag, attrs):\n        print(f\"Тег: {tag}\")\n\nparser = TagPrinter()\nparser.feed(\"<div><h3>Текст</h3></div>\")\n\nparser.feed(html) запускає розбір — і для кожного знайденого тега автоматично викликається handle_starttag().",
    examples: [
      { title: "handle_starttag викликається автоматично", code: `from html.parser import HTMLParser\n\nclass TagPrinter(HTMLParser):\n    def handle_starttag(self, tag, attrs):\n        print(f"Тег: {tag}")\n\nparser = TagPrinter()\nparser.feed("<div><h3>Текст</h3></div>")`, explain: "feed() запускає розбір; handle_starttag() спрацьовує окремо для div і для h3 — по одному разу на кожен тег." },
    ],
    task: `Оголоси клас TagPrinter(HTMLParser) з методом handle_starttag(self, tag, attrs), що виводить f"Тег: {tag}". Виклич parser.feed("<div><h3>Текст</h3></div>").`,
    starter: `from html.parser import HTMLParser\n\nclass TagPrinter(HTMLParser):\n    def handle_starttag(self, tag, attrs):\n        # твій код тут\n        pass\n\nparser = TagPrinter()\nparser.feed("<div><h3>Текст</h3></div>")\n`,
    hints: [`print(f"Тег: {tag}") усередині handle_starttag.`, `feed() сам викличе handle_starttag для кожного тега.`, `def handle_starttag(self, tag, attrs):\n    print(f"Тег: {tag}")`],
    solution: `from html.parser import HTMLParser\n\nclass TagPrinter(HTMLParser):\n    def handle_starttag(self, tag, attrs):\n        print(f"Тег: {tag}")\n\nparser = TagPrinter()\nparser.feed("<div><h3>Текст</h3></div>")`,
    testCode: `if not any("div" in l for l in __logs) or not any("h3" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Мають бути виведені обидва теги — і div, і h3."}\nelse:\n    __result__ = {"pass": True, "message": "HTMLParser сам проходить по всій розмітці й викликає твій код на кожному тегу — надійніше за ручний пошук підрядків."}`,
  },
  {
    id: "py-scraping-3",
    title: "handle_data: текст усередині тега",
    type: "python",
    theory:
      "handle_data(self, data) — ще один метод, який HTMLParser викликає автоматично, цього разу для ТЕКСТУ (не тегів): усього, що знаходиться між відкриваючим і закриваючим тегом.\n\nclass TextPrinter(HTMLParser):\n    def handle_data(self, data):\n        text = data.strip()\n        if text:\n            print(text)\n\ndata.strip() прибирає зайві пробіли й переноси рядків (та сама .strip(), що й у Python Core) — без неї handle_data() виводив би й порожні «текстові» шматки між тегами.",
    examples: [
      { title: "handle_data знаходить текст", code: `from html.parser import HTMLParser\n\nclass TextPrinter(HTMLParser):\n    def handle_data(self, data):\n        text = data.strip()\n        if text:\n            print(text)\n\nparser = TextPrinter()\nparser.feed("<h3>Fluent Python</h3>")`, explain: "Перевірка if text: пропускає порожні шматки (переноси рядків, пробіли між тегами)." },
    ],
    task: `Оголоси клас TextPrinter(HTMLParser) з handle_data(self, data), що виводить data.strip(), якщо він не порожній. Виклич parser.feed("<h3>Fluent Python</h3>").`,
    starter: `from html.parser import HTMLParser\n\nclass TextPrinter(HTMLParser):\n    def handle_data(self, data):\n        # твій код тут\n        pass\n\nparser = TextPrinter()\nparser.feed("<h3>Fluent Python</h3>")\n`,
    hints: [`text = data.strip(), потім if text: print(text)`, `Без перевірки на порожній рядок вивелося б і сміття з пробілів.`, `def handle_data(self, data):\n    text = data.strip()\n    if text:\n        print(text)`],
    solution: `from html.parser import HTMLParser\n\nclass TextPrinter(HTMLParser):\n    def handle_data(self, data):\n        text = data.strip()\n        if text:\n            print(text)\n\nparser = TextPrinter()\nparser.feed("<h3>Fluent Python</h3>")`,
    testCode: `if not any("Fluent Python" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись текст «Fluent Python» — вміст усередині h3."}\nelse:\n    __result__ = {"pass": True, "message": "handle_data() дає доступ саме до ТЕКСТУ, а не до тегів — другий будівельний блок парсера."}`,
  },
  {
    id: "py-scraping-4",
    title: "Атрибути тегів: перетворення на словник",
    type: "python",
    theory:
      "attrs у handle_starttag(self, tag, attrs) — це список пар (ім'я, значення) для атрибутів тега: <p class=\"price\"> дасть attrs = [('class', 'price')]. Список пар легко перетворити на словник функцією dict():\n\ndef handle_starttag(self, tag, attrs):\n    attrs_dict = dict(attrs)\n    css_class = attrs_dict.get(\"class\")\n    print(css_class)\n\ndict(attrs) перетворює [('class', 'price')] на {'class': 'price'} — після цього значення можна дістати звичним .get(\"class\") (з захистом від відсутнього ключа, як у Python Core).",
    examples: [
      { title: "dict(attrs) дає доступ по імені атрибута", code: `from html.parser import HTMLParser\n\nclass ClassPrinter(HTMLParser):\n    def handle_starttag(self, tag, attrs):\n        attrs_dict = dict(attrs)\n        css_class = attrs_dict.get("class")\n        if css_class:\n            print(f"{tag}.{css_class}")\n\nparser = ClassPrinter()\nparser.feed('<p class="price">$29.99</p>')`, explain: "attrs_dict.get(\"class\") повертає None, якщо атрибута class немає — тому перевірка if css_class: перед друком." },
    ],
    task: `Оголоси клас ClassPrinter(HTMLParser) з handle_starttag(self, tag, attrs): перетвори attrs у attrs_dict через dict(), дістань css_class = attrs_dict.get("class"), і якщо він є — виведи f"{tag}.{css_class}". Виклич parser.feed('<p class="price">$29.99</p>').`,
    starter: `from html.parser import HTMLParser\n\nclass ClassPrinter(HTMLParser):\n    def handle_starttag(self, tag, attrs):\n        # твій код тут\n        pass\n\nparser = ClassPrinter()\nparser.feed('<p class="price">$29.99</p>')\n`,
    hints: [`attrs_dict = dict(attrs)`, `css_class = attrs_dict.get("class"), потім if css_class: print(f"{tag}.{css_class}")`, `attrs_dict = dict(attrs)\ncss_class = attrs_dict.get("class")\nif css_class:\n    print(f"{tag}.{css_class}")`],
    solution: `from html.parser import HTMLParser\n\nclass ClassPrinter(HTMLParser):\n    def handle_starttag(self, tag, attrs):\n        attrs_dict = dict(attrs)\n        css_class = attrs_dict.get("class")\n        if css_class:\n            print(f"{tag}.{css_class}")\n\nparser = ClassPrinter()\nparser.feed('<p class="price">$29.99</p>')`,
    testCode: `if not any("p.price" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «p.price» — тег і його клас, розділені крапкою."}\nelse:\n    __result__ = {"pass": True, "message": "dict(attrs) — так із будь-якого тега дістають конкретний атрибут (class, href, src) на ім'я."}`,
  },
  {
    id: "py-scraping-5",
    title: "Стан парсера: який тег зараз обробляється",
    type: "python",
    theory:
      "handle_starttag() і handle_data() спрацьовують ОКРЕМО, у різні моменти — але щоб знати, ЧИЙ саме текст прийшов у handle_data(), парсер має «пам'ятати», у якому тегу він щойно був. Для цього заводять атрибут self.current_tag, який handle_starttag() оновлює:\n\nclass TitlePrinter(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n\n    def handle_data(self, data):\n        if self.current_tag == \"h3\":\n            print(data.strip())\n\nsuper().__init__() тут ОБОВ'ЯЗКОВИЙ (як у Python OOP) — без нього сам HTMLParser не ініціалізується правильно.",
    examples: [
      { title: "self.current_tag пам'ятає контекст", code: `from html.parser import HTMLParser\n\nclass TitlePrinter(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n\n    def handle_data(self, data):\n        if self.current_tag == "h3":\n            print(data.strip())\n\nparser = TitlePrinter()\nparser.feed("<div><h3>Заголовок</h3><p>Опис</p></div>")`, explain: "Текст «Опис» НЕ виводиться, бо на той момент self.current_tag дорівнює «p», а не «h3»." },
    ],
    task: `Оголоси клас TitlePrinter(HTMLParser) з __init__ (super().__init__(); self.current_tag = None), handle_starttag (оновлює self.current_tag), і handle_data (друкує текст ЛИШЕ якщо current_tag == "h3"). Виклич parser.feed("<div><h3>Заголовок</h3><p>Опис</p></div>").`,
    starter: `from html.parser import HTMLParser\n\nclass TitlePrinter(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n\n    def handle_starttag(self, tag, attrs):\n        # твій код тут\n        pass\n\n    def handle_data(self, data):\n        # твій код тут\n        pass\n\nparser = TitlePrinter()\nparser.feed("<div><h3>Заголовок</h3><p>Опис</p></div>")\n`,
    hints: [`У handle_starttag: self.current_tag = tag`, `У handle_data: if self.current_tag == "h3": print(data.strip())`, `def handle_starttag(self, tag, attrs):\n    self.current_tag = tag\n\ndef handle_data(self, data):\n    if self.current_tag == "h3":\n        print(data.strip())`],
    solution: `from html.parser import HTMLParser\n\nclass TitlePrinter(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n\n    def handle_data(self, data):\n        if self.current_tag == "h3":\n            print(data.strip())\n\nparser = TitlePrinter()\nparser.feed("<div><h3>Заголовок</h3><p>Опис</p></div>")`,
    testCode: `if any("Опис" in l for l in __logs):\n    __result__ = {"pass": False, "message": "«Опис» НЕ має вивестись — current_tag на той момент дорівнює «p», а не «h3»."}\nelif not any("Заголовок" in l for l in __logs):\n    __result__ = {"pass": False, "message": "«Заголовок» має вивестись — саме він усередині h3."}\nelse:\n    __result__ = {"pass": True, "message": "self.current_tag — «пам'ять» парсера: без неї handle_data() не знав би, звідки прийшов текст."}`,
  },
  {
    id: "py-scraping-6",
    title: "Витягування заголовків книг",
    type: "python",
    theory:
      "Об'єднаємо все в BookParser: список self.titles, куди потрапляє КОЖЕН заголовок (текст усередині h3), знайдений парсером — саме так, як append() наповнював список задач у Python Core:\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.titles = []\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n\n    def handle_data(self, data):\n        text = data.strip()\n        if text and self.current_tag == \"h3\":\n            self.titles.append(text)\n\nЗверни увагу на text and ... на початку — без цієї перевірки в titles потрапили б і порожні рядки з пробілів між тегами (HTMLParser не скидає current_tag автоматично на закриваючому тегу, тож «залипає» на h3 до наступного відкриваючого тега).",
    examples: [
      { title: "self.titles накопичує всі заголовки", code: `SAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3></div>\n<div class="product"><h3>Fluent Python</h3></div>\n"""\n\nparser = BookParser()\nparser.feed(SAMPLE_HTML)\nprint(parser.titles)`, explain: "Кожен новий h3 додає ще один елемент у self.titles — так само, як tasks.append() у Python Core." },
    ],
    task: `Допиши BookParser: self.titles = [] в __init__, і в handle_data додай text = data.strip() у self.titles, якщо text не порожній і current_tag == "h3". Розбери SAMPLE_HTML (два продукти з h3-заголовками) і виведи parser.titles.`,
    starter: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        # твій код тут: self.titles\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n\n    def handle_data(self, data):\n        # твій код тут\n        pass\n\nSAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3></div>\n<div class="product"><h3>Fluent Python</h3></div>\n"""\n\nparser = BookParser()\nparser.feed(SAMPLE_HTML)\nprint(parser.titles)\n`,
    hints: [`self.titles = [] в __init__.`, `text = data.strip(); if text and self.current_tag == "h3": self.titles.append(text)`, `def handle_data(self, data):\n    text = data.strip()\n    if text and self.current_tag == "h3":\n        self.titles.append(text)`],
    solution: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.titles = []\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n\n    def handle_data(self, data):\n        text = data.strip()\n        if text and self.current_tag == "h3":\n            self.titles.append(text)\n\nSAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3></div>\n<div class="product"><h3>Fluent Python</h3></div>\n"""\n\nparser = BookParser()\nparser.feed(SAMPLE_HTML)\nprint(parser.titles)`,
    testCode: `if "BookParser" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас BookParser."}\nelse:\n    probe = BookParser()\n    probe.feed(SAMPLE_HTML)\n    if probe.titles != ["Python Crash Course", "Fluent Python"]:\n        __result__ = {"pass": False, "message": "parser.titles має дорівнювати ['Python Crash Course', 'Fluent Python']."}\n    elif not any("Python Crash Course" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи parser.titles через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Тепер парсер збирає ВСІ заголовки зі сторінки в один список, а не лише перший."}`,
  },
  {
    id: "py-scraping-7",
    title: "Витягування ціни за класом атрибута",
    type: "python",
    theory:
      "Ціни в SAMPLE_HTML лежать у <p class=\"price\">$29.99</p> — тепер потрібне І ім'я тега (p), І значення його атрибута (class=\"price\"), щоб не переплутати з іншими p-тегами на сторінці. Заведемо self.current_class поруч із self.current_tag (з 4-го і 5-го уроків разом):\n\ndef handle_starttag(self, tag, attrs):\n    self.current_tag = tag\n    self.current_class = dict(attrs).get(\"class\")\n\ndef handle_data(self, data):\n    if self.current_tag == \"p\" and self.current_class == \"price\":\n        self.prices.append(data.strip())",
    examples: [
      { title: "Перевірка і тега, і класу одночасно", code: `parser = BookParser()\nparser.feed('<p class="price">$29.99</p><p class="description">Опис</p>')\nprint(parser.prices)`, explain: "Другий <p> (з class=\"description\") НЕ потрапляє в prices — умова перевіряє саме class == \"price\"." },
    ],
    task: `Додай self.current_class і self.prices у BookParser. У handle_starttag онови current_class через dict(attrs).get("class"). У handle_data додай текст у self.prices, якщо tag=="p" і class=="price". Розбери '<p class="price">$29.99</p><p class="description">Опис</p>' і виведи parser.prices.`,
    starter: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.prices = []\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        # твій код тут: онови self.current_class\n\n    def handle_data(self, data):\n        # твій код тут\n        pass\n\nparser = BookParser()\nparser.feed('<p class="price">$29.99</p><p class="description">Опис</p>')\nprint(parser.prices)\n`,
    hints: [`self.current_class = dict(attrs).get("class")`, `if self.current_tag == "p" and self.current_class == "price": self.prices.append(data.strip())`, `def handle_starttag(self, tag, attrs):\n    self.current_tag = tag\n    self.current_class = dict(attrs).get("class")\n\ndef handle_data(self, data):\n    if self.current_tag == "p" and self.current_class == "price":\n        self.prices.append(data.strip())`],
    solution: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.prices = []\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        self.current_class = dict(attrs).get("class")\n\n    def handle_data(self, data):\n        if self.current_tag == "p" and self.current_class == "price":\n            self.prices.append(data.strip())\n\nparser = BookParser()\nparser.feed('<p class="price">$29.99</p><p class="description">Опис</p>')\nprint(parser.prices)`,
    testCode: `if "BookParser" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас BookParser."}\nelse:\n    probe = BookParser()\n    probe.feed('<p class="price">$29.99</p><p class="description">Опис</p>')\n    if probe.prices != ["$29.99"]:\n        __result__ = {"pass": False, "message": "parser.prices має містити лише «$29.99», без опису."}\n    elif not any("29.99" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи parser.prices через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Перевірка і тега, і класу одночасно — так парсер відрізняє потрібний <p> від усіх інших p-тегів на сторінці."}`,
  },
  {
    id: "py-scraping-8",
    title: "Об'єднання title і price в один запис",
    type: "python",
    theory:
      "Окремі списки titles і prices незручні — важко бути впевненим, що елемент з індексом 3 в обох списках стосується ОДНІЄЇ книги. Краще одразу збирати self.items — список словників {\"title\": ..., \"price\": ...}, як список задач-словників у Python Core.\n\nЗаведемо self.current_title, що запам'ятовує останній знайдений заголовок, і додаємо повний запис у self.items щойно зустрінеться відповідна ціна:\n\ndef handle_data(self, data):\n    text = data.strip()\n    if not text:\n        return\n    if self.current_tag == \"h3\":\n        self.current_title = text\n    elif self.current_tag == \"p\" and self.current_class == \"price\":\n        self.items.append({\"title\": self.current_title, \"price\": text})",
    examples: [
      { title: "self.items збирає пари title+price", code: `parser = BookParser()\nparser.feed('<h3>Fluent Python</h3><p class="price">$44.99</p>')\nprint(parser.items)`, explain: "current_title запам'ятовується при зустрічі h3, і використовується щойно знайдеться відповідна ціна." },
    ],
    task: `Онови BookParser: self.current_title = None і self.items = [] в __init__. У handle_data: якщо tag=="h3" — онови current_title; якщо tag=="p" і class=="price" — додай {"title": current_title, "price": text} у self.items. Розбери '<h3>Fluent Python</h3><p class="price">$44.99</p>' і виведи parser.items.`,
    starter: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.current_title = None\n        self.items = []\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        self.current_class = dict(attrs).get("class")\n\n    def handle_data(self, data):\n        text = data.strip()\n        # твій код тут\n        pass\n\nparser = BookParser()\nparser.feed('<h3>Fluent Python</h3><p class="price">$44.99</p>')\nprint(parser.items)\n`,
    hints: [`if self.current_tag == "h3": self.current_title = text`, `elif self.current_tag == "p" and self.current_class == "price": self.items.append({"title": self.current_title, "price": text})`, `if self.current_tag == "h3":\n    self.current_title = text\nelif self.current_tag == "p" and self.current_class == "price":\n    self.items.append({"title": self.current_title, "price": text})`],
    solution: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.current_title = None\n        self.items = []\n\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        self.current_class = dict(attrs).get("class")\n\n    def handle_data(self, data):\n        text = data.strip()\n        if not text:\n            return\n        if self.current_tag == "h3":\n            self.current_title = text\n        elif self.current_tag == "p" and self.current_class == "price":\n            self.items.append({"title": self.current_title, "price": text})\n\nparser = BookParser()\nparser.feed('<h3>Fluent Python</h3><p class="price">$44.99</p>')\nprint(parser.items)`,
    testCode: `if "BookParser" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас BookParser."}\nelse:\n    probe = BookParser()\n    probe.feed('<h3>Fluent Python</h3><p class="price">$44.99</p>')\n    if probe.items != [{"title": "Fluent Python", "price": "$44.99"}]:\n        __result__ = {"pass": False, "message": "parser.items має містити один запис: {'title': 'Fluent Python', 'price': '$44.99'}."}\n    elif not any("Fluent Python" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи parser.items через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Один список словників замість двох окремих списків — тепер title і price гарантовано належать одній книзі."}`,
  },
  {
    id: "py-scraping-9",
    title: "Повний розбір: кілька товарів підряд",
    type: "python",
    theory:
      "Перевіримо BookParser на повноцінному прикладі з кількома товарами підряд — саме так виглядав би реальний HTML каталогу. Жодних змін у самому класі не потрібно: та сама логіка з 8-го уроку однаково правильно обробить і один товар, і сто.\n\nSAMPLE_HTML = \"\"\"\n<div class=\"product\"><h3>Python Crash Course</h3><p class=\"price\">$29.99</p></div>\n<div class=\"product\"><h3>Fluent Python</h3><p class=\"price\">$44.99</p></div>\n<div class=\"product\"><h3>Automate the Boring Stuff</h3><p class=\"price\">$24.99</p></div>\n\"\"\"",
    examples: [
      { title: "Той самий парсер, три товари", code: `SAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3><p class="price">$29.99</p></div>\n<div class="product"><h3>Fluent Python</h3><p class="price">$44.99</p></div>\n"""\n\nparser = BookParser()\nparser.feed(SAMPLE_HTML)\nprint(len(parser.items))\nfor item in parser.items:\n    print(item)`, explain: "len(parser.items) підтверджує, що знайдено рівно стільки товарів, скільки й на сторінці." },
    ],
    task: `Розбери SAMPLE_HTML (три товари, вже заданий у стартовому коді) через BookParser. Виведи len(parser.items) і кожен запис окремим рядком у циклі for.`,
    starter: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.current_title = None\n        self.items = []\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        self.current_class = dict(attrs).get("class")\n    def handle_data(self, data):\n        text = data.strip()\n        if not text:\n            return\n        if self.current_tag == "h3":\n            self.current_title = text\n        elif self.current_tag == "p" and self.current_class == "price":\n            self.items.append({"title": self.current_title, "price": text})\n\nSAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3><p class="price">$29.99</p></div>\n<div class="product"><h3>Fluent Python</h3><p class="price">$44.99</p></div>\n<div class="product"><h3>Automate the Boring Stuff</h3><p class="price">$24.99</p></div>\n"""\n\nparser = BookParser()\nparser.feed(SAMPLE_HTML)\n\n# твій код тут\n`,
    hints: [`print(len(parser.items))`, `for item in parser.items: print(item)`, `print(len(parser.items))\nfor item in parser.items:\n    print(item)`],
    solution: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.current_title = None\n        self.items = []\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        self.current_class = dict(attrs).get("class")\n    def handle_data(self, data):\n        text = data.strip()\n        if not text:\n            return\n        if self.current_tag == "h3":\n            self.current_title = text\n        elif self.current_tag == "p" and self.current_class == "price":\n            self.items.append({"title": self.current_title, "price": text})\n\nSAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3><p class="price">$29.99</p></div>\n<div class="product"><h3>Fluent Python</h3><p class="price">$44.99</p></div>\n<div class="product"><h3>Automate the Boring Stuff</h3><p class="price">$24.99</p></div>\n"""\n\nparser = BookParser()\nparser.feed(SAMPLE_HTML)\n\nprint(len(parser.items))\nfor item in parser.items:\n    print(item)`,
    testCode: `if "parser" not in globals() or len(parser.items) != 3:\n    __result__ = {"pass": False, "message": "parser.items має містити рівно 3 записи — по одному на кожен товар у SAMPLE_HTML."}\nelif not any(l.strip() == "3" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(parser.items) — має бути 3."}\nelse:\n    __result__ = {"pass": True, "message": "Той самий парсер працює однаково на будь-якій кількості товарів — саме тому парсинг надійніший за ручний пошук."}`,
  },
  {
    id: "py-scraping-10",
    title: "Очищення ціни: рядок у число",
    type: "python",
    theory:
      "Зараз price зберігається як рядок \"$29.99\" — незручно для сортування чи обчислень. Приберемо символ $ через .replace() і перетворимо решту на float() (дробове число):\n\nprice_str = \"$29.99\"\nprice = float(price_str.replace(\"$\", \"\"))\nprint(price)  # 29.99 (справжнє число, не рядок)\n\n.replace(\"$\", \"\") замінює символ $ на порожній рядок — фактично прибирає його; float() перетворює результат («29.99») у число з плаваючою крапкою.",
    examples: [
      { title: "Очищення ціни в число", code: `price_str = "$29.99"\nprice = float(price_str.replace("$", ""))\nprint(price)\nprint(type(price))`, explain: "type(price) підтверджує, що це вже <class 'float'>, а не рядок." },
    ],
    task: `Дано price_str = "$44.99". Прибери символ $ через .replace() і перетвори результат на float. Виведи price і type(price).`,
    starter: `price_str = "$44.99"\n\n# price = float(price_str.replace("$", ""))\n# print(price)\n# print(type(price))\n`,
    hints: [`price_str.replace("$", "") прибирає символ $.`, `float(...) обгортає результат заміни.`, `price = float(price_str.replace("$", ""))\nprint(price)\nprint(type(price))`],
    solution: `price_str = "$44.99"\n\nprice = float(price_str.replace("$", ""))\nprint(price)\nprint(type(price))`,
    testCode: `if "price" not in globals() or price != 44.99 or not isinstance(price, float):\n    __result__ = {"pass": False, "message": "price має дорівнювати числу 44.99 (float), не рядку."}\nelif not any("44.99" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи price через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Тепер price — справжнє число, з яким можна порівнювати, сортувати й рахувати середнє."}`,
  },
  {
    id: "py-scraping-11",
    title: "Очищення всіх зібраних цін одразу",
    type: "python",
    theory:
      "Застосуємо очищення з 10-го уроку до КОЖНОГО запису в parser.items — циклом for, що змінює значення прямо в кожному словнику:\n\nfor item in parser.items:\n    item[\"price\"] = float(item[\"price\"].replace(\"$\", \"\"))\n\nОскільки item у циклі — це ПОСИЛАННЯ на той самий словник, що лежить у списку (а не копія), зміна item[\"price\"] всередині циклу дійсно оновлює оригінальні записи в parser.items.",
    examples: [
      { title: "Очищення цін у списку словників", code: `items = [{"title": "Book A", "price": "$10.00"}, {"title": "Book B", "price": "$20.50"}]\n\nfor item in items:\n    item["price"] = float(item["price"].replace("$", ""))\n\nprint(items)`, explain: "Кожен словник у списку items змінюється НАПРЯМУ — новий список створювати не треба." },
    ],
    task: `Дано items = [{"title": "Book A", "price": "$10.00"}, {"title": "Book B", "price": "$20.50"}]. Пройди циклом for і заміни item["price"] на float-число (без $). Виведи items.`,
    starter: `items = [{"title": "Book A", "price": "$10.00"}, {"title": "Book B", "price": "$20.50"}]\n\n# for item in items:\n#     item["price"] = ...\n\n# print(items)\n`,
    hints: [`for item in items: item["price"] = float(item["price"].replace("$", ""))`, `item — посилання на словник у списку, зміна відбувається напряму.`, `for item in items:\n    item["price"] = float(item["price"].replace("$", ""))\nprint(items)`],
    solution: `items = [{"title": "Book A", "price": "$10.00"}, {"title": "Book B", "price": "$20.50"}]\n\nfor item in items:\n    item["price"] = float(item["price"].replace("$", ""))\n\nprint(items)`,
    testCode: `if "items" not in globals() or items[0]["price"] != 10.0 or items[1]["price"] != 20.5:\n    __result__ = {"pass": False, "message": "Обидві ціни мають стати числами: 10.0 і 20.5."}\nelif not any(isinstance(l, str) and "10.0" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи items через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Один цикл очищує всі зібрані ціни одразу — готово до сортування й обчислень."}`,
  },
  {
    id: "py-scraping-12",
    title: "Фільтрація за ціною",
    type: "python",
    theory:
      "Маючи числові ціни, легко відфільтрувати лише потрібні товари через list comprehension (той самий інструмент, що фільтрував невиконані задачі в Python Core):\n\ncheap_books = [item for item in items if item[\"price\"] < 20]\nprint(cheap_books)\n\nУмова item[\"price\"] < 20 працює ЛИШЕ тому, що price — число (float), а не рядок «$10.00» — порівняння рядків із числами дало б помилку чи неправильний результат.",
    examples: [
      { title: "Фільтрація дешевих книг", code: `items = [{"title": "Book A", "price": 10.0}, {"title": "Book B", "price": 25.0}, {"title": "Book C", "price": 15.0}]\n\ncheap_books = [item["title"] for item in items if item["price"] < 20]\nprint(cheap_books)`, explain: "У результат потрапляють лише назви книг дешевших за 20 — Book A і Book C." },
    ],
    task: `Дано items = [{"title": "Book A", "price": 10.0}, {"title": "Book B", "price": 25.0}, {"title": "Book C", "price": 15.0}]. Створи cheap_books — список НАЗВ книг, де price < 20, через list comprehension. Виведи cheap_books.`,
    starter: `items = [{"title": "Book A", "price": 10.0}, {"title": "Book B", "price": 25.0}, {"title": "Book C", "price": 15.0}]\n\n# cheap_books = [... for ... in items if ...]\n# print(cheap_books)\n`,
    hints: [`[item["title"] for item in items if item["price"] < 20]`, `Вираз — item["title"], умова — item["price"] < 20`, `cheap_books = [item["title"] for item in items if item["price"] < 20]\nprint(cheap_books)`],
    solution: `items = [{"title": "Book A", "price": 10.0}, {"title": "Book B", "price": 25.0}, {"title": "Book C", "price": 15.0}]\n\ncheap_books = [item["title"] for item in items if item["price"] < 20]\nprint(cheap_books)`,
    testCode: `if "cheap_books" not in globals() or cheap_books != ["Book A", "Book C"]:\n    __result__ = {"pass": False, "message": "cheap_books має дорівнювати ['Book A', 'Book C']."}\nelse:\n    __result__ = {"pass": True, "message": "Той самий list comprehension, що фільтрував задачі в Python Core, тепер фільтрує результати скрапінгу."}`,
  },
  {
    id: "py-scraping-13",
    title: "Сортування результатів",
    type: "python",
    theory:
      "sorted(список, key=функція) сортує елементи за значенням, яке повертає функція key для КОЖНОГО елемента — не сам елемент напряму (адже словники не можна порівняти «за замовчуванням»):\n\nsorted_items = sorted(items, key=lambda item: item[\"price\"])\n\nlambda item: item[\"price\"] — коротка анонімна функція («бери елемент, поверни його ціну») — той самий принцип, що й callback-функції в Python Desktop, тільки записаний в один рядок. За замовчуванням сортує за зростанням; reverse=True — за спаданням.",
    examples: [
      { title: "Сортування за ціною", code: `items = [{"title": "Book A", "price": 25.0}, {"title": "Book B", "price": 10.0}, {"title": "Book C", "price": 15.0}]\n\nsorted_items = sorted(items, key=lambda item: item["price"])\nfor item in sorted_items:\n    print(item["title"], item["price"])`, explain: "Книги виводяться від найдешевшої до найдорожчої, хоча в оригінальному списку йшли в іншому порядку." },
    ],
    task: `Дано items = [{"title": "Book A", "price": 25.0}, {"title": "Book B", "price": 10.0}, {"title": "Book C", "price": 15.0}]. Відсортуй за price через sorted(items, key=lambda item: item["price"]) і виведи кожну назву в порядку сортування.`,
    starter: `items = [{"title": "Book A", "price": 25.0}, {"title": "Book B", "price": 10.0}, {"title": "Book C", "price": 15.0}]\n\n# sorted_items = sorted(items, key=lambda item: item["price"])\n# for item in sorted_items:\n#     print(item["title"])\n`,
    hints: [`sorted(items, key=lambda item: item["price"])`, `lambda item: item["price"] — функція, що дістає ціну з кожного словника.`, `sorted_items = sorted(items, key=lambda item: item["price"])\nfor item in sorted_items:\n    print(item["title"])`],
    solution: `items = [{"title": "Book A", "price": 25.0}, {"title": "Book B", "price": 10.0}, {"title": "Book C", "price": 15.0}]\n\nsorted_items = sorted(items, key=lambda item: item["price"])\nfor item in sorted_items:\n    print(item["title"])`,
    testCode: `if len(__logs) < 3 or __logs[0].strip() != "Book B" or __logs[-1].strip() != "Book A":\n    __result__ = {"pass": False, "message": "Порядок виводу має бути Book B (10.0), Book C (15.0), Book A (25.0) — від дешевшої до дорожчої."}\nelse:\n    __result__ = {"pass": True, "message": "sorted() з key= — стандартний спосіб упорядкувати список словників за будь-яким полем."}`,
  },
  {
    id: "py-scraping-14",
    title: "Статистика: середня ціна",
    type: "python",
    theory:
      "Порахуємо середню ціну серед зібраних товарів — sum() підсумовує всі значення, len() дає кількість, ділення дає середнє:\n\nprices = [item[\"price\"] for item in items]\naverage = sum(prices) / len(prices)\nprint(f\"Середня ціна: {average:.2f}\")\n\n{average:.2f} усередині f-рядка форматує число рівно з двома знаками після крапки — зручно для грошових сум (29.9900001 стане 29.99).",
    examples: [
      { title: "Середня ціна з округленням", code: `items = [{"price": 10.0}, {"price": 20.0}, {"price": 15.0}]\n\nprices = [item["price"] for item in items]\naverage = sum(prices) / len(prices)\nprint(f"Середня ціна: {average:.2f}")`, explain: "\":.2f\" — формат «число з двома знаками після крапки», а не спосіб щось округлити вручну." },
    ],
    task: `Дано items = [{"price": 10.0}, {"price": 20.0}, {"price": 15.0}]. Порахуй prices (list comprehension), average = sum/len, виведи f"Середня ціна: {average:.2f}".`,
    starter: `items = [{"price": 10.0}, {"price": 20.0}, {"price": 15.0}]\n\n# prices = [item["price"] for item in items]\n# average = sum(prices) / len(prices)\n# print(f"Середня ціна: {average:.2f}")\n`,
    hints: [`prices = [item["price"] for item in items]`, `average = sum(prices) / len(prices)`, `prices = [item["price"] for item in items]\naverage = sum(prices) / len(prices)\nprint(f"Середня ціна: {average:.2f}")`],
    solution: `items = [{"price": 10.0}, {"price": 20.0}, {"price": 15.0}]\n\nprices = [item["price"] for item in items]\naverage = sum(prices) / len(prices)\nprint(f"Середня ціна: {average:.2f}")`,
    testCode: `if not any("Середня ціна: 15.00" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «Середня ціна: 15.00» ((10+20+15)/3 = 15)."}\nelse:\n    __result__ = {"pass": True, "message": "sum() / len() — базова статистика, яку варто рахувати після будь-якого скрапінгу з числовими даними."}`,
  },
  {
    id: "py-scraping-15",
    title: "Модуль csv: запис результатів",
    type: "python",
    theory:
      "Модуль csv (стандартна бібліотека, як і html.parser) записує дані в CSV-файл — таблицю, що відкривається в Excel чи Google Таблицях. csv.writer(file) дає об'єкт writer, у якого writerow(список) записує ОДИН рядок таблиці:\n\nimport csv\n\nwith open(\"books.csv\", \"w\", newline=\"\") as f:\n    writer = csv.writer(f)\n    writer.writerow([\"title\", \"price\"])       # заголовок таблиці\n    for item in items:\n        writer.writerow([item[\"title\"], item[\"price\"]])\n\nnewline=\"\" в open() — технічна деталь, яку csv-модуль просить вказувати завжди, щоб рядки в різних ОС не дублювались зайвими переносами.",
    examples: [
      { title: "Запис списку словників у CSV", code: `import csv\n\nitems = [{"title": "Book A", "price": 10.0}, {"title": "Book B", "price": 20.0}]\n\nwith open("books.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["title", "price"])\n    for item in items:\n        writer.writerow([item["title"], item["price"]])\n\nprint(open("books.csv").read())`, explain: "Перший writerow() записує заголовки колонок; решта — по одному рядку на товар." },
    ],
    task: `Дано items = [{"title": "Book A", "price": 10.0}, {"title": "Book B", "price": 20.0}]. Запиши "books.csv" через csv.writer: перший рядок — заголовки ["title", "price"], далі по рядку на кожен item. Виведи вміст файлу.`,
    starter: `import csv\n\nitems = [{"title": "Book A", "price": 10.0}, {"title": "Book B", "price": 20.0}]\n\n# with open("books.csv", "w", newline="") as f:\n#     writer = csv.writer(f)\n#     writer.writerow(["title", "price"])\n#     for item in items:\n#         writer.writerow([...])\n\n# print(open("books.csv").read())\n`,
    hints: [`writer.writerow(["title", "price"]) — заголовок таблиці першим рядком.`, `writer.writerow([item["title"], item["price"]]) усередині циклу.`, `with open("books.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["title", "price"])\n    for item in items:\n        writer.writerow([item["title"], item["price"]])\nprint(open("books.csv").read())`],
    solution: `import csv\n\nitems = [{"title": "Book A", "price": 10.0}, {"title": "Book B", "price": 20.0}]\n\nwith open("books.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["title", "price"])\n    for item in items:\n        writer.writerow([item["title"], item["price"]])\n\nprint(open("books.csv").read())`,
    testCode: `import os\nif not os.path.exists("books.csv"):\n    __result__ = {"pass": False, "message": "Файл books.csv має бути створений."}\nelse:\n    content = open("books.csv").read()\n    if "title" not in content or "Book A" not in content or "10.0" not in content:\n        __result__ = {"pass": False, "message": "Файл має містити заголовок і обидва товари з цінами."}\n    elif not any("Book A" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи вміст books.csv через print()."}\n    else:\n        __result__ = {"pass": True, "message": "CSV — стандартний формат для передачі результатів скрапінгу далі: в Excel, у базу даних, у інший скрипт."}`,
  },
  {
    id: "py-scraping-16",
    title: "Модуль csv: читання назад",
    type: "python",
    theory:
      "csv.reader(file) читає CSV-файл назад як список рядків, де кожен рядок — це список значень (рядків-текстів, навіть якщо там записані числа). Це корисно для перевірки, що файл справді записався правильно:\n\nimport csv\n\nwith open(\"books.csv\") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(row)\n\nКожен row — звичайний список Python: перший рядок буде ['title', 'price'] (заголовок), далі — по товару.",
    examples: [
      { title: "Читання CSV назад", code: `import csv\n\nwith open("books.csv") as f:\n    reader = csv.reader(f)\n    rows = list(reader)\n\nprint(rows[0])\nprint(rows[1])`, explain: "list(reader) перетворює reader на звичайний список рядків, з яким уже можна працювати як завгодно." },
    ],
    task: `Файл "books.csv" уже записаний (стартовий код). Прочитай його через csv.reader(), збери всі рядки в rows = list(reader), виведи rows[0] (заголовок) і rows[1] (перший товар).`,
    starter: `import csv\n\nwith open("books.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["title", "price"])\n    writer.writerow(["Fluent Python", "44.99"])\n\n# with open("books.csv") as f:\n#     reader = csv.reader(f)\n#     rows = list(reader)\n\n# print(rows[0])\n# print(rows[1])\n`,
    hints: [`reader = csv.reader(f), потім rows = list(reader)`, `rows[0] — заголовок, rows[1] — перший товар.`, `with open("books.csv") as f:\n    reader = csv.reader(f)\n    rows = list(reader)\nprint(rows[0])\nprint(rows[1])`],
    solution: `import csv\n\nwith open("books.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["title", "price"])\n    writer.writerow(["Fluent Python", "44.99"])\n\nwith open("books.csv") as f:\n    reader = csv.reader(f)\n    rows = list(reader)\n\nprint(rows[0])\nprint(rows[1])`,
    testCode: `if "rows" not in globals() or rows[0] != ["title", "price"] or rows[1] != ["Fluent Python", "44.99"]:\n    __result__ = {"pass": False, "message": "rows[0] має бути заголовком, rows[1] — записом про Fluent Python."}\nelif not any("Fluent Python" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи rows[1] через print()."}\nelse:\n    __result__ = {"pass": True, "message": "csv.reader() замикає цикл: записали дані — прочитали назад — переконались, що все збереглось правильно."}`,
  },
  {
    id: "py-scraping-17",
    title: "Обробка помилок: некоректна ціна",
    type: "python",
    theory:
      "Реальні сторінки не завжди «чисті» — іноді замість ціни трапляється текст «Немає в наявності» чи порожній рядок, і float(...) на ньому викличе ValueError. Захистимо очищення через try/except, пропускаючи товари з некоректною ціною, а не зупиняючи весь скрапінг:\n\ndef clean_price(price_str):\n    try:\n        return float(price_str.replace(\"$\", \"\"))\n    except ValueError:\n        return None\n\nprices = [clean_price(p) for p in raw_prices]\nvalid_prices = [p for p in prices if p is not None]",
    examples: [
      { title: "clean_price повертає None замість помилки", code: `def clean_price(price_str):\n    try:\n        return float(price_str.replace("$", ""))\n    except ValueError:\n        return None\n\nprint(clean_price("$29.99"))\nprint(clean_price("Немає в наявності"))`, explain: "Другий виклик не «падає» з помилкою — просто повертає None, який можна відфільтрувати пізніше." },
    ],
    task: `Напиши clean_price(price_str), що повертає float ціну (без $) або None, якщо перетворення не вдалось (try/except ValueError). Виведи clean_price("$29.99") і clean_price("Немає в наявності").`,
    starter: `def clean_price(price_str):\n    # твій код тут\n    pass\n\nprint(clean_price("$29.99"))\nprint(clean_price("Немає в наявності"))\n`,
    hints: [`try: return float(price_str.replace("$", ""))`, `except ValueError: return None`, `def clean_price(price_str):\n    try:\n        return float(price_str.replace("$", ""))\n    except ValueError:\n        return None`],
    solution: `def clean_price(price_str):\n    try:\n        return float(price_str.replace("$", ""))\n    except ValueError:\n        return None\n\nprint(clean_price("$29.99"))\nprint(clean_price("Немає в наявності"))`,
    testCode: `if "clean_price" not in globals() or not callable(clean_price):\n    __result__ = {"pass": False, "message": "Потрібна функція clean_price(price_str)."}\nelif clean_price("$29.99") != 29.99 or clean_price("Немає в наявності") is not None:\n    __result__ = {"pass": False, "message": "clean_price(\\"$29.99\\") має повернути 29.99, а на некоректному тексті — None."}\nelif not any("29.99" in l for l in __logs) or not any(l.strip() == "None" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи обидва результати виклику функції."}\nelse:\n    __result__ = {"pass": True, "message": "try/except захищає весь скрапінг від одного «брудного» значення серед сотень нормальних."}`,
  },
  {
    id: "py-scraping-18",
    title: "Ввічливість скрапера: затримки й обмеження",
    type: "python",
    theory:
      "Реальний скрапер звертається до сайту БАГАТО разів — і якщо робити це занадто швидко, це може перевантажити сервер сайту (це вважається неввічливим, а на деяких сайтах — і забороненим). Тому між запитами роблять паузу через time.sleep(секунди), і поважають правила сайту, описані у файлі /robots.txt (текстовий файл, який каже, які сторінки можна скрапити, а які — ні).\n\nimport time\n\nfor url in urls:\n    # тут був би запит requests.get(url)\n    time.sleep(1)  # пауза між запитами\n\nУ цьому уроці мережевих запитів немає (як і в усьому напрямку), тому пауза буде символічною (0.01 секунди) — лише щоб побачити синтаксис time.sleep().",
    examples: [
      { title: "Пауза між обробкою елементів", code: `import time\n\nurls = ["/page1", "/page2", "/page3"]\n\nfor url in urls:\n    print(f"Обробка {url}")\n    time.sleep(0.01)\n\nprint("Готово")`, explain: "У реальному скрапері тут був би реальний мережевий запит; time.sleep() дає серверу «перепочити» між ними." },
    ],
    task: `Дано urls = ["/page1", "/page2", "/page3"]. Пройди циклом for, виведи f"Обробка {url}" і виклич time.sleep(0.01) для кожного. Наостанок виведи "Готово".`,
    starter: `import time\n\nurls = ["/page1", "/page2", "/page3"]\n\n# for url in urls:\n#     print(f"Обробка {url}")\n#     time.sleep(0.01)\n\n# print("Готово")\n`,
    hints: [`import time — на самому початку.`, `time.sleep(0.01) усередині циклу, після print().`, `for url in urls:\n    print(f"Обробка {url}")\n    time.sleep(0.01)\nprint("Готово")`],
    solution: `import time\n\nurls = ["/page1", "/page2", "/page3"]\n\nfor url in urls:\n    print(f"Обробка {url}")\n    time.sleep(0.01)\n\nprint("Готово")`,
    testCode: `if sum(1 for l in __logs if "Обробка" in l) != 3:\n    __result__ = {"pass": False, "message": "Мають бути виведені 3 рядки «Обробка ...» — по одному на кожен url."}\nelif not any("Готово" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Наостанок має вивестись «Готово»."}\nelse:\n    __result__ = {"pass": True, "message": "time.sleep() між запитами — ознака ввічливого скрапера, який не перевантажує чужий сервер."}`,
  },
  {
    id: "py-scraping-19",
    title: "Функція scrape_html(): усе в одному виклику",
    type: "python",
    theory:
      "Зберемо парсинг (BookParser), очищення (clean_price) в одну функцію scrape_html(html), що повертає ГОТОВИЙ список словників із числовими цінами — саме так виглядав би публічний інтерфейс справжнього скрапера:\n\ndef scrape_html(html):\n    parser = BookParser()\n    parser.feed(html)\n    items = []\n    for item in parser.items:\n        price = clean_price(item[\"price\"])\n        if price is not None:\n            items.append({\"title\": item[\"title\"], \"price\": price})\n    return items\n\nВиклик стає простим: books = scrape_html(html) — ніхто ззовні не має знати про BookParser чи clean_price.",
    examples: [
      { title: "scrape_html ховає всю складність", code: `books = scrape_html(SAMPLE_HTML)\nprint(books)`, explain: "Одна функція повертає готові, очищені дані — усе інше сховано всередині." },
    ],
    task: `Напиши scrape_html(html), що розбирає HTML через BookParser, очищує кожну ціну через clean_price(), і повертає список {"title", "price"} лише для товарів з коректною ціною. Виклич scrape_html(SAMPLE_HTML) і виведи результат.`,
    starter: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.current_title = None\n        self.items = []\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        self.current_class = dict(attrs).get("class")\n    def handle_data(self, data):\n        text = data.strip()\n        if not text:\n            return\n        if self.current_tag == "h3":\n            self.current_title = text\n        elif self.current_tag == "p" and self.current_class == "price":\n            self.items.append({"title": self.current_title, "price": text})\n\ndef clean_price(price_str):\n    try:\n        return float(price_str.replace("$", ""))\n    except ValueError:\n        return None\n\ndef scrape_html(html):\n    # твій код тут\n    pass\n\nSAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3><p class="price">$29.99</p></div>\n<div class="product"><h3>Fluent Python</h3><p class="price">$44.99</p></div>\n"""\n\nbooks = scrape_html(SAMPLE_HTML)\nprint(books)\n`,
    hints: [`parser = BookParser(); parser.feed(html)`, `Пройди циклом по parser.items, очищуй ціну через clean_price(), додавай у новий список лише якщо price is not None.`, `def scrape_html(html):\n    parser = BookParser()\n    parser.feed(html)\n    items = []\n    for item in parser.items:\n        price = clean_price(item["price"])\n        if price is not None:\n            items.append({"title": item["title"], "price": price})\n    return items`],
    solution: `from html.parser import HTMLParser\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.current_title = None\n        self.items = []\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        self.current_class = dict(attrs).get("class")\n    def handle_data(self, data):\n        text = data.strip()\n        if not text:\n            return\n        if self.current_tag == "h3":\n            self.current_title = text\n        elif self.current_tag == "p" and self.current_class == "price":\n            self.items.append({"title": self.current_title, "price": text})\n\ndef clean_price(price_str):\n    try:\n        return float(price_str.replace("$", ""))\n    except ValueError:\n        return None\n\ndef scrape_html(html):\n    parser = BookParser()\n    parser.feed(html)\n    items = []\n    for item in parser.items:\n        price = clean_price(item["price"])\n        if price is not None:\n            items.append({"title": item["title"], "price": price})\n    return items\n\nSAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3><p class="price">$29.99</p></div>\n<div class="product"><h3>Fluent Python</h3><p class="price">$44.99</p></div>\n"""\n\nbooks = scrape_html(SAMPLE_HTML)\nprint(books)`,
    testCode: `if "scrape_html" not in globals() or not callable(scrape_html):\n    __result__ = {"pass": False, "message": "Потрібна функція scrape_html(html)."}\nelif "books" not in globals() or books != [{"title": "Python Crash Course", "price": 29.99}, {"title": "Fluent Python", "price": 44.99}]:\n    __result__ = {"pass": False, "message": "scrape_html(SAMPLE_HTML) має повернути обидва товари з числовими цінами."}\nelif not any("29.99" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи books через print()."}\nelse:\n    __result__ = {"pass": True, "message": "scrape_html() — публічний інтерфейс скрапера: один виклик, готові чисті дані на виході."}`,
  },
  {
    id: "py-scraping-20",
    title: "Фінальний проєкт: Book Scraper",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків в один скрипт: парсинг (BookParser), очищення (clean_price, scrape_html), фільтрацію та сортування (list comprehension, sorted), статистику (sum/len) і збереження результату в CSV (модуль csv). Це і є Book Scraper, обіцяний ще на вступній сторінці «Що це?».\n\nЦей самий код, підключений до requests.get(url).text замість SAMPLE_HTML, розбере будь-яку реальну сторінку з подібною структурою HTML — парсинг, очищення й аналіз даних лишаються ідентичними.",
    examples: [
      { title: "Повний прогін: від HTML до CSV", code: `books = scrape_html(SAMPLE_HTML)\ncheap = [b for b in books if b["price"] < 30]\nsorted_books = sorted(books, key=lambda b: b["price"])\naverage = sum(b["price"] for b in books) / len(books)\n\nprint(f"Знайдено книг: {len(books)}")\nprint(f"Дешевших за 30: {len(cheap)}")\nprint(f"Середня ціна: {average:.2f}")`, explain: "Один прогін — і всі метрики про каталог книг готові." },
    ],
    task: `Виклич scrape_html(SAMPLE_HTML) (3 книги, вже в стартовому коді). Порахуй cheap (ціна < 30), average (середня ціна), запиши результати в "books.csv" (title, price для КОЖНОЇ книги), і виведи "Знайдено книг: N", "Дешевших за 30: N", f"Середня ціна: {average:.2f}".`,
    starter: `from html.parser import HTMLParser\nimport csv\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.current_title = None\n        self.items = []\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        self.current_class = dict(attrs).get("class")\n    def handle_data(self, data):\n        text = data.strip()\n        if not text:\n            return\n        if self.current_tag == "h3":\n            self.current_title = text\n        elif self.current_tag == "p" and self.current_class == "price":\n            self.items.append({"title": self.current_title, "price": text})\n\ndef clean_price(price_str):\n    try:\n        return float(price_str.replace("$", ""))\n    except ValueError:\n        return None\n\ndef scrape_html(html):\n    parser = BookParser()\n    parser.feed(html)\n    items = []\n    for item in parser.items:\n        price = clean_price(item["price"])\n        if price is not None:\n            items.append({"title": item["title"], "price": price})\n    return items\n\nSAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3><p class="price">$29.99</p></div>\n<div class="product"><h3>Fluent Python</h3><p class="price">$44.99</p></div>\n<div class="product"><h3>Automate the Boring Stuff</h3><p class="price">$24.99</p></div>\n"""\n\nbooks = scrape_html(SAMPLE_HTML)\n\n# твій код тут\n`,
    hints: [`cheap = [b for b in books if b["price"] < 30]`, `average = sum(b["price"] for b in books) / len(books)`, `with open("books.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["title", "price"])\n    for b in books:\n        writer.writerow([b["title"], b["price"]])\nprint(f"Знайдено книг: {len(books)}")\nprint(f"Дешевших за 30: {len(cheap)}")\nprint(f"Середня ціна: {average:.2f}")`],
    solution: `from html.parser import HTMLParser\nimport csv\n\nclass BookParser(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.current_tag = None\n        self.current_class = None\n        self.current_title = None\n        self.items = []\n    def handle_starttag(self, tag, attrs):\n        self.current_tag = tag\n        self.current_class = dict(attrs).get("class")\n    def handle_data(self, data):\n        text = data.strip()\n        if not text:\n            return\n        if self.current_tag == "h3":\n            self.current_title = text\n        elif self.current_tag == "p" and self.current_class == "price":\n            self.items.append({"title": self.current_title, "price": text})\n\ndef clean_price(price_str):\n    try:\n        return float(price_str.replace("$", ""))\n    except ValueError:\n        return None\n\ndef scrape_html(html):\n    parser = BookParser()\n    parser.feed(html)\n    items = []\n    for item in parser.items:\n        price = clean_price(item["price"])\n        if price is not None:\n            items.append({"title": item["title"], "price": price})\n    return items\n\nSAMPLE_HTML = """\n<div class="product"><h3>Python Crash Course</h3><p class="price">$29.99</p></div>\n<div class="product"><h3>Fluent Python</h3><p class="price">$44.99</p></div>\n<div class="product"><h3>Automate the Boring Stuff</h3><p class="price">$24.99</p></div>\n"""\n\nbooks = scrape_html(SAMPLE_HTML)\n\ncheap = [b for b in books if b["price"] < 30]\naverage = sum(b["price"] for b in books) / len(books)\n\nwith open("books.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["title", "price"])\n    for b in books:\n        writer.writerow([b["title"], b["price"]])\n\nprint(f"Знайдено книг: {len(books)}")\nprint(f"Дешевших за 30: {len(cheap)}")\nprint(f"Середня ціна: {average:.2f}")`,
    testCode: `import os\nif "books" not in globals() or len(books) != 3:\n    __result__ = {"pass": False, "message": "books має містити рівно 3 книги."}\nelif not os.path.exists("books.csv"):\n    __result__ = {"pass": False, "message": "Файл books.csv має бути створений."}\nelif not any("Знайдено книг: 3" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «Знайдено книг: 3»."}\nelif not any("Дешевших за 30: 2" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «Дешевших за 30: 2» (29.99 і 24.99 — обидва менші за 30)."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Повний Book Scraper: парсинг, очищення, фільтрація, статистика й CSV — усе з нуля, крок за кроком за 20 уроків."}`,
    finalProject: {
      techs: ["Python 3", "html.parser.HTMLParser", "csv", "list comprehension", "sorted() + lambda", "try/except"],
      skills: [
        "Розбір HTML через успадкування HTMLParser (handle_starttag/handle_data)",
        "Читання атрибутів тегів (dict(attrs))",
        "Очищення й перетворення тексту на число з обробкою помилок",
        "Фільтрація та сортування списків словників",
        "Базова статистика (сума, середнє)",
        "Збереження й читання результатів через модуль csv",
      ],
      structure:
        "book_scraper.py\n  ├── class BookParser(HTMLParser)  # розбирає HTML у список {title, price}\n  ├── clean_price(price_str)        # рядок → число, або None\n  ├── scrape_html(html)              # парсинг + очищення в один виклик\n  └── books.csv                       # результат (створюється автоматично)",
      code: `from html.parser import HTMLParser
import csv


class BookParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current_tag = None
        self.current_class = None
        self.current_title = None
        self.items = []

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        self.current_class = dict(attrs).get("class")

    def handle_data(self, data):
        text = data.strip()
        if self.current_tag == "h3":
            self.current_title = text
        elif self.current_tag == "p" and self.current_class == "price":
            self.items.append({"title": self.current_title, "price": text})


def clean_price(price_str):
    try:
        return float(price_str.replace("$", ""))
    except ValueError:
        return None


def scrape_html(html):
    parser = BookParser()
    parser.feed(html)
    items = []
    for item in parser.items:
        price = clean_price(item["price"])
        if price is not None:
            items.append({"title": item["title"], "price": price})
    return items


if __name__ == "__main__":
    # У реальному проєкті тут був би:
    # import requests
    # html = requests.get("https://example.com/books").text
    html = SAMPLE_HTML

    books = scrape_html(html)
    cheap = [b for b in books if b["price"] < 30]
    average = sum(b["price"] for b in books) / len(books)

    with open("books.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["title", "price"])
        for b in books:
            writer.writerow([b["title"], b["price"]])

    print(f"Знайдено книг: {len(books)}")
    print(f"Дешевших за 30: {len(cheap)}")
    print(f"Середня ціна: {average:.2f}")`,
      runCommand: "python book_scraper.py",
      installGuide: {
        intro:
          "Тут парсився HTML, уже покладений у рядок SAMPLE_HTML. Щоб скрапер розбирав РЕАЛЬНІ сторінки з інтернету, додатково потрібні requests (завантаження сторінки) і, за бажанням, beautifulsoup4 (зручніший за html.parser синтаксис пошуку). Обидва встановлюються через pip.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text:
              "Зайди на python.org/downloads і встанови останню версію. Windows: обов'язково постав галочку «Add python.exe to PATH». (Детальні кроки для кожної ОС — в уроках напрямку Game Development.)",
            code: null,
          },
          {
            title: "2. Встанови requests (і, за бажанням, beautifulsoup4)",
            text:
              "requests — бібліотека для завантаження сторінок по мережі; без неї HTML доведеться копіювати вручну, як у цих уроках.",
            code: "pip install requests\npip install beautifulsoup4",
          },
          {
            title: "3. Заміни SAMPLE_HTML на реальний запит",
            text:
              "У фінальному коді рядок html = SAMPLE_HTML заміни на реальне завантаження сторінки. ВАЖЛИВО: скрап тільки ті сайти, для яких це дозволено (перевір /robots.txt сайту й умови використання) — і онов select-логіку (handle_starttag/handle_data) під РЕАЛЬНУ структуру тегів того сайту, вона майже напевно інша, ніж у навчальному прикладі.",
            code: "import requests\n\nresponse = requests.get(\"https://example.com/books\")\nhtml = response.text",
          },
          {
            title: "4. Запусти скрипт",
            text: "Виконай файл — результат з'явиться і в консолі, і у файлі books.csv поруч зі скриптом.",
            code: "python book_scraper.py",
          },
        ],
      },
      improvements: [
        "Перейти на requests + BeautifulSoup для зручнішого пошуку елементів (select(), find_all())",
        "Обробити пагінацію — кілька сторінок каталогу підряд, а не одну",
        "Додати кешування вже завантажених сторінок, щоб не завантажувати їх повторно",
        "Перевіряти /robots.txt сайту автоматично перед скрапінгом (модуль urllib.robotparser)",
      ],
      nextLevel:
        "Далі — 🌐 API Development: замість того щоб «видирати» дані з чужого HTML, наступний крок — створити ВЛАСНИЙ API, який віддає дані іншим програмам у зручному, структурованому форматі (JSON) без потреби в парсингу взагалі.",
    },
  },
];
