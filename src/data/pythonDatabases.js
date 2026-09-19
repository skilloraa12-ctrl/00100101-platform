// Python Databases — the ninth Python direction. Same intro + 20 lessons
// structure, building a small in-memory relational-style database engine
// from scratch, then persisting it to disk. The obvious real tool here is
// Python's built-in sqlite3 module — except it ISN'T actually built into
// Pyodide: it is "unvendored" from the standard library distribution and
// fetched as a separate package from the same jsdelivr CDN this sandbox's
// proxy blocks (the reason Pyodide itself had to be self-hosted). So,
// exactly like API Development built a real router instead of a real
// socket server, these lessons build a genuine miniature database engine
// (tables, primary keys, WHERE filtering, joins, GROUP BY, persistence to
// JSON) entirely in plain Python — the same relational concepts real
// databases use, taught by implementing them rather than importing them.
export const PYTHON_DATABASES_LESSONS = [
  {
    id: "py-databases-intro",
    title: "Що це? — Databases",
    type: "intro",
    theory:
      "Python Databases — це напрямок про те, як Python зберігає й дістає структуровані дані: таблиці, рядки, стовпці, первинні й зовнішні ключі, запити з умовами, об'єднання даних із кількох таблиць. Це прямий наступний крок після 🐍 Backend Development, де users_db і tasks_db були звичайними Python-словниками, що зникали при кожному перезапуску сервера.\n\nВАЖЛИВО чесно попередити: очевидний інструмент тут — вбудований модуль sqlite3, але він ФАКТИЧНО не входить у збірку Pyodide (\"unvendored\" — свідомо винесений як окремий пакет) і завантажується з того самого CDN, який заблокований проксі цього середовища (та сама причина, чому довелось самостійно хостити сам Pyodide). Тому ці 20 уроків будують СПРАВЖНІЙ, хоч і мінімальний, движок бази даних на чистому Python — таблиці, первинні ключі, фільтрація, об'єднання (JOIN), групування — той самий принцип, що лежить в основі sqlite3, PostgreSQL чи MySQL, тільки написаний власноруч, а не викликаний готовою бібліотекою.\n\nЦе вирішує задачу «як зберігати пов'язані дані так, щоб їх можна було надійно знаходити, оновлювати й пов'язувати одне з одним»: первинний ключ (унікальний ідентифікатор рядка), зовнішній ключ (посилання одного рядка на інший, в іншій таблиці), запити з умовами (WHERE), об'єднання таблиць (JOIN), групування й підрахунок (GROUP BY), і, нарешті, збереження всього на диск, щоб дані не зникали.\n\nЩо знадобиться з попередніх напрямків: списки й словники (Python Core), класи (Python OOP), робота з файлами й JSON (Automation, API Development). Що буде після 20 уроків: повна міні-СУБД (система керування базами даних) із таблицями Users і Tasks, зовнішнім ключем між ними, JOIN, GROUP BY і збереженням/завантаженням із файлу.",
    presentation: [
      { title: "Databases — коротко", points: ["Таблиці, первинні й зовнішні ключі, WHERE, JOIN, GROUP BY — реальні концепції реляційних баз даних", "sqlite3 не входить у збірку Pyodide (окремий пакет із того самого заблокованого CDN) — тому будуємо мінідвижок самі", "Той самий принцип лежить в основі sqlite3, PostgreSQL і будь-якої іншої реляційної бази"] },
      { title: "Результат", points: ["20 уроків, кожен додає нову можливість бази даних", "Фінал: міні-СУБД із таблицями Users і Tasks, JOIN і збереженням у файл", "Потрібне знання класів, файлів і JSON з попередніх напрямків"] },
    ],
  },
  {
    id: "py-databases-1",
    title: "Таблиця як список рядків",
    type: "python",
    theory:
      "У реляційній базі даних таблиця (table) — це впорядкована колекція рядків (rows) з однаковим набором стовпців (columns). У Python це вже добре знайома структура: список словників, де кожен словник — окремий рядок, а ключі словника — стовпці:\n\ntasks = [\n    {\"id\": 1, \"name\": \"Купити хліб\", \"done\": False},\n    {\"id\": 2, \"name\": \"Погуляти\", \"done\": True},\n]\n\nЦе та сама структура, що вже використовувалась у Python Core й API Development — тепер її формально називають «таблицею», а кожен елемент списку — «рядком».",
    examples: [
      { title: "Таблиця як список словників", code: `tasks = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\nprint(f"Рядків у таблиці: {len(tasks)}")\nprint(f"Стовпці: {list(tasks[0].keys())}")`, explain: "len(tasks) — кількість рядків; list(tasks[0].keys()) — назви стовпців першого рядка." },
    ],
    task: `Дано tasks — список із двох словників-рядків (id, name, done). Виведи f"Рядків у таблиці: {len(tasks)}" і f"Стовпці: {list(tasks[0].keys())}".`,
    starter: `tasks = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\n# print(f"Рядків у таблиці: {len(tasks)}")\n# print(f"Стовпці: {list(tasks[0].keys())}")\n`,
    hints: [`len(tasks) — кількість рядків.`, `list(tasks[0].keys()) — список назв стовпців.`, `print(f"Рядків у таблиці: {len(tasks)}")\nprint(f"Стовпці: {list(tasks[0].keys())}")`],
    solution: `tasks = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\nprint(f"Рядків у таблиці: {len(tasks)}")\nprint(f"Стовпці: {list(tasks[0].keys())}")`,
    testCode: `if not any("Рядків у таблиці: 2" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «Рядків у таблиці: 2»."}\nelif not any("id" in l and "name" in l and "done" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Стовпці мають містити id, name, done."}\nelse:\n    __result__ = {"pass": True, "message": "Таблиця — це список рядків з однаковими стовпцями; саме так реляційні бази зберігають дані під капотом."}`,
  },
  {
    id: "py-databases-2",
    title: "Первинний ключ (primary key)",
    type: "python",
    theory:
      "Первинний ключ (primary key, скорочено PK) — стовпець, значення якого УНІКАЛЬНЕ для кожного рядка й ніколи не повторюється — саме за ним рядок однозначно ідентифікують. Найпростіший спосіб генерувати PK — лічильник, що завжди зростає:\n\nnext_id = 1\n\ndef generate_id():\n    global next_id\n    new_id = next_id\n    next_id += 1\n    return new_id\n\nprint(generate_id())  # 1\nprint(generate_id())  # 2\n\nЦе той самий принцип, що new_id = max(...) + 1 з попередніх напрямків — тільки як окрема, перевикористовувана функція-генератор.",
    examples: [
      { title: "generate_id() дає зростаючий PK", code: `next_id = 1\n\ndef generate_id():\n    global next_id\n    new_id = next_id\n    next_id += 1\n    return new_id\n\nprint(generate_id())\nprint(generate_id())\nprint(generate_id())`, explain: "Кожен виклик повертає НАСТУПНЕ число — жодне значення ніколи не повториться." },
    ],
    task: `Дано next_id = 1. Напиши generate_id() за прикладом. Виклич її тричі підряд і виведи кожен результат.`,
    starter: `next_id = 1\n\ndef generate_id():\n    # твій код тут\n    pass\n\nprint(generate_id())\nprint(generate_id())\nprint(generate_id())\n`,
    hints: [`global next_id — щоб функція могла змінити зовнішню змінну.`, `new_id = next_id; next_id += 1; return new_id`, `def generate_id():\n    global next_id\n    new_id = next_id\n    next_id += 1\n    return new_id`],
    solution: `next_id = 1\n\ndef generate_id():\n    global next_id\n    new_id = next_id\n    next_id += 1\n    return new_id\n\nprint(generate_id())\nprint(generate_id())\nprint(generate_id())`,
    testCode: `results = [l.strip() for l in __logs if l.strip().isdigit()]\nif results != ["1", "2", "3"]:\n    __result__ = {"pass": False, "message": "Три виклики generate_id() мають дати 1, 2, 3 по черзі."}\nelse:\n    __result__ = {"pass": True, "message": "generate_id() — простий, але справжній спосіб гарантувати унікальність первинного ключа."}`,
  },
  {
    id: "py-databases-3",
    title: "Клас Table: метод insert",
    type: "python",
    theory:
      "Оформимо таблицю класом Table — так само, як App чи Organizer раніше: self.rows зберігає всі рядки, а self.next_id — власний лічильник PK для КОЖНОЇ таблиці окремо:\n\nclass Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n\n    def insert(self, data):\n        row = {\"id\": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n**data («розпакування словника») додає всі пари ключ-значення з data прямо в новий словник row, поруч із id — той самий трюк, що й **kwargs у функціях, тільки для об'єднання словників.",
    examples: [
      { title: "Table.insert() генерує id сам", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб", "done": False})\ntasks.insert({"name": "Погуляти", "done": True})\nprint(tasks.rows)`, explain: "Кожен insert() сам призначає наступний id — виклику не треба про нього дбати." },
    ],
    task: `Оголоси клас Table за прикладом. Створи tasks = Table(), виклич tasks.insert({"name": "Купити хліб", "done": False}) двічі з різними назвами і виведи tasks.rows.`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n\n    def insert(self, data):\n        # твій код тут\n        pass\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб", "done": False})\ntasks.insert({"name": "Погуляти", "done": True})\nprint(tasks.rows)\n`,
    hints: [`row = {"id": self.next_id, **data}`, `self.rows.append(row); self.next_id += 1; return row`, `def insert(self, data):\n    row = {"id": self.next_id, **data}\n    self.rows.append(row)\n    self.next_id += 1\n    return row`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб", "done": False})\ntasks.insert({"name": "Погуляти", "done": True})\nprint(tasks.rows)`,
    testCode: `if "Table" not in globals() or not isinstance(Table, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Table."}\nelse:\n    probe = Table()\n    r1 = probe.insert({"x": 1})\n    r2 = probe.insert({"x": 2})\n    if r1["id"] != 1 or r2["id"] != 2:\n        __result__ = {"pass": False, "message": "Перший insert() має дати id=1, другий — id=2."}\n    elif len(probe.rows) != 2:\n        __result__ = {"pass": False, "message": "self.rows має містити 2 рядки."}\n    elif not any("Купити хліб" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи tasks.rows через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Table.insert() автоматично призначає первинний ключ — так само, як реальна база даних із AUTOINCREMENT."}`,
  },
  {
    id: "py-databases-4",
    title: "Пошук рядка за id",
    type: "python",
    theory:
      "get_by_id(id) знаходить ОДИН конкретний рядок за первинним ключем — той самий next()-пошук, що вже застосовувався в 🌐 API Development:\n\ndef get_by_id(self, id):\n    return next((r for r in self.rows if r[\"id\"] == id), None)\n\ntask = tasks.get_by_id(2)\nprint(task)\n\nЯкщо рядка з таким id немає — get_by_id() поверне None, а не помилку, так само, як get_task у Task API.",
    examples: [
      { title: "get_by_id шукає єдиний рядок", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб"})\ntasks.insert({"name": "Погуляти"})\nprint(tasks.get_by_id(2))\nprint(tasks.get_by_id(99))`, explain: "Неіснуючий id дає None, а не помилку — безпечно перевіряти результат далі через if." },
    ],
    task: `Додай Table метод get_by_id(self, id) за прикладом. Створи tasks, додай дві задачі, виведи tasks.get_by_id(2) і tasks.get_by_id(99).`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def get_by_id(self, id):\n        # твій код тут\n        pass\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб"})\ntasks.insert({"name": "Погуляти"})\nprint(tasks.get_by_id(2))\nprint(tasks.get_by_id(99))\n`,
    hints: [`return next((r for r in self.rows if r["id"] == id), None)`, `next() з генератором і значенням за замовчуванням None.`, `def get_by_id(self, id):\n    return next((r for r in self.rows if r["id"] == id), None)`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб"})\ntasks.insert({"name": "Погуляти"})\nprint(tasks.get_by_id(2))\nprint(tasks.get_by_id(99))`,
    testCode: `if "Table" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Table із get_by_id."}\nelse:\n    probe = Table()\n    probe.insert({"name": "A"})\n    probe.insert({"name": "B"})\n    if probe.get_by_id(2)["name"] != "B" or probe.get_by_id(99) is not None:\n        __result__ = {"pass": False, "message": "get_by_id(2) має знайти рядок «B», get_by_id(99) — повернути None."}\n    elif not any("Погуляти" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи tasks.get_by_id(2) — має показати «Погуляти»."}\n    else:\n        __result__ = {"pass": True, "message": "get_by_id() — найпростіший і найшвидший спосіб дістати конкретний рядок, коли відомий його первинний ключ."}`,
  },
  {
    id: "py-databases-5",
    title: "SELECT WHERE: фільтрація за умовою",
    type: "python",
    theory:
      "select(condition) повертає ВСІ рядки, для яких функція condition дає True — condition тут сама передається як параметр (функція вищого порядку, як callback у Python Desktop):\n\ndef select(self, condition):\n    return [r for r in self.rows if condition(r)]\n\ndone_tasks = tasks.select(lambda r: r[\"done\"] == True)\nprint(done_tasks)\n\nЦе точний еквівалент SQL-запиту SELECT * FROM tasks WHERE done = true — тільки умова записана як Python lambda замість SQL-синтаксису.",
    examples: [
      { title: "select() як SQL WHERE", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def select(self, condition):\n        return [r for r in self.rows if condition(r)]\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб", "done": False})\ntasks.insert({"name": "Погуляти", "done": True})\n\ndone_tasks = tasks.select(lambda r: r["done"] == True)\nprint(done_tasks)`, explain: "select() із будь-якою умовою — від done == True до складніших виразів." },
    ],
    task: `Додай Table метод select(self, condition) за прикладом. Створи tasks з двома задачами (одна done=True), виклич tasks.select(lambda r: r["done"] == True) і виведи результат.`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def select(self, condition):\n        # твій код тут\n        pass\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб", "done": False})\ntasks.insert({"name": "Погуляти", "done": True})\n\ndone_tasks = tasks.select(lambda r: r["done"] == True)\nprint(done_tasks)\n`,
    hints: [`[r for r in self.rows if condition(r)]`, `condition — це функція, викликана на кожному рядку.`, `def select(self, condition):\n    return [r for r in self.rows if condition(r)]`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def select(self, condition):\n        return [r for r in self.rows if condition(r)]\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб", "done": False})\ntasks.insert({"name": "Погуляти", "done": True})\n\ndone_tasks = tasks.select(lambda r: r["done"] == True)\nprint(done_tasks)`,
    testCode: `if "done_tasks" not in globals() or len(done_tasks) != 1 or done_tasks[0]["name"] != "Погуляти":\n    __result__ = {"pass": False, "message": "done_tasks має містити рівно 1 задачу — «Погуляти» (done=True)."}\nelif not any("Погуляти" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи done_tasks через print()."}\nelse:\n    __result__ = {"pass": True, "message": "select() з умовою-функцією — те саме, що SELECT ... WHERE ... у справжньому SQL."}`,
  },
  {
    id: "py-databases-6",
    title: "UPDATE: зміна рядка за id",
    type: "python",
    theory:
      "update(id, changes) знаходить рядок за id (як у 4-му уроці) і оновлює лише ПЕРЕДАНІ поля, лишаючи решту без змін — той самий принцип часткового оновлення, що й PUT /tasks/<id> у 🌐 API Development:\n\ndef update(self, id, changes):\n    row = self.get_by_id(id)\n    if row is None:\n        return None\n    row.update(changes)\n    return row\n\ndict.update(інший_словник) — вбудований метод словника: додає/перезаписує КОЖНУ пару ключ-значення з іншого словника, не чіпаючи решту полів.",
    examples: [
      { title: "update() змінює лише передані поля", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n    def update(self, id, changes):\n        row = self.get_by_id(id)\n        if row is None:\n            return None\n        row.update(changes)\n        return row\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб", "done": False})\ntasks.update(1, {"done": True})\nprint(tasks.get_by_id(1))`, explain: "name лишається тим самим — update({\"done\": True}) не чіпає інші поля." },
    ],
    task: `Додай Table метод update(self, id, changes) за прикладом. Створи tasks з однією задачею, виклич tasks.update(1, {"done": True}) і виведи tasks.get_by_id(1).`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\n    def update(self, id, changes):\n        # твій код тут\n        pass\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб", "done": False})\ntasks.update(1, {"done": True})\nprint(tasks.get_by_id(1))\n`,
    hints: [`row = self.get_by_id(id); if row is None: return None`, `row.update(changes); return row`, `def update(self, id, changes):\n    row = self.get_by_id(id)\n    if row is None:\n        return None\n    row.update(changes)\n    return row`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\n    def update(self, id, changes):\n        row = self.get_by_id(id)\n        if row is None:\n            return None\n        row.update(changes)\n        return row\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб", "done": False})\ntasks.update(1, {"done": True})\nprint(tasks.get_by_id(1))`,
    testCode: `if "tasks" not in globals() or tasks.get_by_id(1)["done"] is not True or tasks.get_by_id(1)["name"] != "Купити хліб":\n    __result__ = {"pass": False, "message": "Задача з id=1 має мати done=True (оновлено) і name без змін."}\nelif not any("Купити хліб" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи tasks.get_by_id(1) через print()."}\nelse:\n    __result__ = {"pass": True, "message": "update() — часткова зміна рядка за id, з тим самим принципом, що PUT у REST API."}`,
  },
  {
    id: "py-databases-7",
    title: "DELETE: видалення рядка за id",
    type: "python",
    theory:
      "delete(id) знаходить рядок і видаляє його зі списку self.rows — повертає True/False залежно від того, чи справді щось видалено:\n\ndef delete(self, id):\n    row = self.get_by_id(id)\n    if row is None:\n        return False\n    self.rows.remove(row)\n    return True\n\nЦе той самий підхід, що DELETE /tasks/<id> у API Development — знайти, перевірити існування, видалити, повідомити про результат.",
    examples: [
      { title: "delete() із перевіркою результату", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n    def delete(self, id):\n        row = self.get_by_id(id)\n        if row is None:\n            return False\n        self.rows.remove(row)\n        return True\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб"})\nprint(tasks.delete(1))\nprint(tasks.delete(99))\nprint(len(tasks.rows))`, explain: "delete(1) видаляє й дає True; delete(99) (немає такого) дає False, не змінюючи таблицю." },
    ],
    task: `Додай Table метод delete(self, id) за прикладом. Створи tasks з однією задачею, виведи tasks.delete(1), tasks.delete(99), len(tasks.rows).`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\n    def delete(self, id):\n        # твій код тут\n        pass\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб"})\nprint(tasks.delete(1))\nprint(tasks.delete(99))\nprint(len(tasks.rows))\n`,
    hints: [`row = self.get_by_id(id); if row is None: return False`, `self.rows.remove(row); return True`, `def delete(self, id):\n    row = self.get_by_id(id)\n    if row is None:\n        return False\n    self.rows.remove(row)\n    return True`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\n    def delete(self, id):\n        row = self.get_by_id(id)\n        if row is None:\n            return False\n        self.rows.remove(row)\n        return True\n\ntasks = Table()\ntasks.insert({"name": "Купити хліб"})\nprint(tasks.delete(1))\nprint(tasks.delete(99))\nprint(len(tasks.rows))`,
    testCode: `if "tasks" not in globals() or len(tasks.rows) != 0:\n    __result__ = {"pass": False, "message": "Після delete(1) таблиця має стати порожньою."}\nelif not (any(l.strip() == "True" for l in __logs) and any(l.strip() == "False" for l in __logs)):\n    __result__ = {"pass": False, "message": "Виведи результати обох викликів delete() — True і False."}\nelse:\n    __result__ = {"pass": True, "message": "delete() повертає True/False — так виклик коду дізнається, чи справді щось видалено."}`,
  },
  {
    id: "py-databases-8",
    title: "Унікальність: перевірка перед insert",
    type: "python",
    theory:
      "Деякі стовпці мають бути УНІКАЛЬНИМИ — наприклад, email користувача не може повторюватись двічі. Додамо перевірку в insert(): якщо рядок із таким значенням поля вже існує — відмовити:\n\ndef insert_unique(self, data, unique_field):\n    exists = any(r[unique_field] == data[unique_field] for r in self.rows)\n    if exists:\n        raise ValueError(f\"Значення {unique_field}={data[unique_field]} вже існує\")\n    return self.insert(data)\n\nany(...) повертає True, якщо ХОЧА Б ОДИН елемент задовольняє умову — швидкий спосіб перевірити «чи є вже такий», не виписуючи явний цикл.",
    examples: [
      { title: "insert_unique() відмовляє в дублікаті", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def insert_unique(self, data, unique_field):\n        exists = any(r[unique_field] == data[unique_field] for r in self.rows)\n        if exists:\n            raise ValueError(f"Значення {unique_field}={data[unique_field]} вже існує")\n        return self.insert(data)\n\nusers = Table()\nusers.insert_unique({"email": "olena@example.com"}, "email")\ntry:\n    users.insert_unique({"email": "olena@example.com"}, "email")\nexcept ValueError as e:\n    print(e)`, explain: "Друга спроба з тим самим email викликає ValueError замість тихого дублювання." },
    ],
    task: `Додай Table метод insert_unique(self, data, unique_field) за прикладом. Створи users, додай email "olena@example.com" двічі — другий раз через try/except ValueError, виведи повідомлення про помилку.`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def insert_unique(self, data, unique_field):\n        # твій код тут\n        pass\n\nusers = Table()\nusers.insert_unique({"email": "olena@example.com"}, "email")\ntry:\n    users.insert_unique({"email": "olena@example.com"}, "email")\nexcept ValueError as e:\n    print(e)\n`,
    hints: [`exists = any(r[unique_field] == data[unique_field] for r in self.rows)`, `if exists: raise ValueError(f"Значення {unique_field}={data[unique_field]} вже існує")`, `def insert_unique(self, data, unique_field):\n    exists = any(r[unique_field] == data[unique_field] for r in self.rows)\n    if exists:\n        raise ValueError(f"Значення {unique_field}={data[unique_field]} вже існує")\n    return self.insert(data)`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def insert_unique(self, data, unique_field):\n        exists = any(r[unique_field] == data[unique_field] for r in self.rows)\n        if exists:\n            raise ValueError(f"Значення {unique_field}={data[unique_field]} вже існує")\n        return self.insert(data)\n\nusers = Table()\nusers.insert_unique({"email": "olena@example.com"}, "email")\ntry:\n    users.insert_unique({"email": "olena@example.com"}, "email")\nexcept ValueError as e:\n    print(e)`,
    testCode: `if "users" not in globals() or len(users.rows) != 1:\n    __result__ = {"pass": False, "message": "users.rows має містити рівно 1 рядок — другий insert мав бути відхилений."}\nelif not any("вже існує" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись повідомлення про те, що email вже існує."}\nelse:\n    __result__ = {"pass": True, "message": "Перевірка унікальності перед insert — те, що реальні бази роблять через UNIQUE constraint."}`,
  },
  {
    id: "py-databases-9",
    title: "Індекс: швидкий пошук за полем",
    type: "python",
    theory:
      "get_by_id() з 4-го уроку перебирає ВЕСЬ список — повільно для великої таблиці. Індекс — допоміжний словник {значення_поля: рядок}, що дозволяє знайти рядок МИТТЄВО, без перебору:\n\ndef build_index(self, field):\n    return {r[field]: r for r in self.rows}\n\nemail_index = users.build_index(\"email\")\nprint(email_index[\"olena@example.com\"])\n\nЦе прямий словниковий доступ (O(1) — миттєвий), а не лінійний перебір (O(n) — час росте з кількістю рядків) — той самий принцип, за яким реальні бази прискорюють пошук через індекси на диску.",
    examples: [
      { title: "build_index() для миттєвого пошуку", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def build_index(self, field):\n        return {r[field]: r for r in self.rows}\n\nusers = Table()\nusers.insert({"email": "olena@example.com", "name": "Олена"})\n\nemail_index = users.build_index("email")\nprint(email_index["olena@example.com"])`, explain: "email_index[\"olena@example.com\"] знаходить рядок напряму, без перебору всього списку." },
    ],
    task: `Додай Table метод build_index(self, field) за прикладом. Створи users з одним рядком, побудуй email_index = users.build_index("email") і виведи email_index["olena@example.com"].`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def build_index(self, field):\n        # твій код тут\n        pass\n\nusers = Table()\nusers.insert({"email": "olena@example.com", "name": "Олена"})\n\nemail_index = users.build_index("email")\nprint(email_index["olena@example.com"])\n`,
    hints: [`{r[field]: r for r in self.rows} — dict comprehension.`, `Ключ — значення поля, значення — сам рядок.`, `def build_index(self, field):\n    return {r[field]: r for r in self.rows}`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def build_index(self, field):\n        return {r[field]: r for r in self.rows}\n\nusers = Table()\nusers.insert({"email": "olena@example.com", "name": "Олена"})\n\nemail_index = users.build_index("email")\nprint(email_index["olena@example.com"])`,
    testCode: `if "email_index" not in globals() or "olena@example.com" not in email_index:\n    __result__ = {"pass": False, "message": "email_index має містити ключ \\"olena@example.com\\"."}\nelif email_index["olena@example.com"]["name"] != "Олена":\n    __result__ = {"pass": False, "message": "email_index[\\"olena@example.com\\"] має бути рядком із name=\\"Олена\\"."}\nelif not any("Олена" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи email_index[\\"olena@example.com\\"] через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Індекс — словник для миттєвого пошуку замість перебору всього списку щоразу."}`,
  },
  {
    id: "py-databases-10",
    title: "Клас Database: кілька таблиць разом",
    type: "python",
    theory:
      "Реальна база даних містить БАГАТО таблиць одночасно. Клас Database тримає словник self.tables — {ім'я_таблиці: об'єкт Table}:\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndb = Database()\nusers = db.create_table(\"users\")\ntasks = db.create_table(\"tasks\")\n\nprint(list(db.tables.keys()))\n\nТепер db.tables[\"users\"] і db.tables[\"tasks\"] — незалежні таблиці з власними рядками й лічильниками id, об'єднані в одну базу.",
    examples: [
      { title: "Database створює й зберігає таблиці", code: `class Database:\n    def __init__(self):\n        self.tables = {}\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndb = Database()\nusers = db.create_table("users")\ntasks = db.create_table("tasks")\nprint(list(db.tables.keys()))`, explain: "db.tables — центральний реєстр усіх таблиць бази даних." },
    ],
    task: `Оголоси клас Database за прикладом (Table уже визначено вище). Створи db = Database(), таблиці "users" і "tasks" через db.create_table(), виведи list(db.tables.keys()).`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n\n    def create_table(self, name):\n        # твій код тут\n        pass\n\ndb = Database()\nusers = db.create_table("users")\ntasks = db.create_table("tasks")\nprint(list(db.tables.keys()))\n`,
    hints: [`self.tables[name] = Table()`, `return self.tables[name]`, `def create_table(self, name):\n    self.tables[name] = Table()\n    return self.tables[name]`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndb = Database()\nusers = db.create_table("users")\ntasks = db.create_table("tasks")\nprint(list(db.tables.keys()))`,
    testCode: `if "Database" not in globals() or not isinstance(Database, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Database."}\nelif "db" not in globals() or set(db.tables.keys()) != {"users", "tasks"}:\n    __result__ = {"pass": False, "message": "db.tables має містити рівно \\"users\\" і \\"tasks\\"."}\nelif not any("users" in l and "tasks" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи list(db.tables.keys()) — має містити обидві назви."}\nelse:\n    __result__ = {"pass": True, "message": "Database — центральний реєстр усіх таблиць, з якого починається будь-яка справжня СУБД."}`,
  },
  {
    id: "py-databases-11",
    title: "Зовнішній ключ (foreign key)",
    type: "python",
    theory:
      "Зовнішній ключ (foreign key, FK) — поле в одній таблиці, що зберігає id рядка з ІНШОЇ таблиці — так рядки різних таблиць ПОВ'ЯЗУЮТЬСЯ між собою. Задача належить користувачу через owner_id:\n\nusers = db.create_table(\"users\")\ntasks = db.create_table(\"tasks\")\n\nolena = users.insert({\"name\": \"Олена\"})\ntasks.insert({\"name\": \"Купити хліб\", \"owner_id\": olena[\"id\"]})\n\ntask = tasks.rows[0]\nowner = users.get_by_id(task[\"owner_id\"])\nprint(owner[\"name\"])\n\nowner_id — це просто ЧИСЛО (те саме, що users.rows[0][\"id\"]), а не сам об'єкт користувача — так реальні бази зберігають зв'язки, не дублюючи дані користувача в кожній його задачі.",
    examples: [
      { title: "owner_id пов'язує задачу з користувачем", code: `users = db.create_table("users")\ntasks = db.create_table("tasks")\n\nolena = users.insert({"name": "Олена"})\ntasks.insert({"name": "Купити хліб", "owner_id": olena["id"]})\n\ntask = tasks.rows[0]\nowner = users.get_by_id(task["owner_id"])\nprint(owner["name"])`, explain: "task[\"owner_id\"] — просто число; users.get_by_id() перетворює його назад на повний рядок користувача." },
    ],
    task: `Дано db (уже з методом create_table і Table з get_by_id). Створи таблиці "users" і "tasks", додай користувача "Олена" й задачу "Купити хліб" з owner_id=olena["id"]. Знайди owner через users.get_by_id(task["owner_id"]) і виведи owner["name"].`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndb = Database()\nusers = db.create_table("users")\ntasks = db.create_table("tasks")\n\n# olena = users.insert({"name": "Олена"})\n# tasks.insert({"name": "Купити хліб", "owner_id": olena["id"]})\n\n# task = tasks.rows[0]\n# owner = users.get_by_id(task["owner_id"])\n# print(owner["name"])\n`,
    hints: [`olena = users.insert({"name": "Олена"})`, `tasks.insert({"name": "Купити хліб", "owner_id": olena["id"]})`, `task = tasks.rows[0]\nowner = users.get_by_id(task["owner_id"])\nprint(owner["name"])`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndb = Database()\nusers = db.create_table("users")\ntasks = db.create_table("tasks")\n\nolena = users.insert({"name": "Олена"})\ntasks.insert({"name": "Купити хліб", "owner_id": olena["id"]})\n\ntask = tasks.rows[0]\nowner = users.get_by_id(task["owner_id"])\nprint(owner["name"])`,
    testCode: `if "owner" not in globals() or owner["name"] != "Олена":\n    __result__ = {"pass": False, "message": "owner має бути рядком користувача з name=\\"Олена\\"."}\nelif not any("Олена" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи owner[\\"name\\"] через print()."}\nelse:\n    __result__ = {"pass": True, "message": "owner_id — зовнішній ключ: число, що вказує на конкретний рядок в іншій таблиці."}`,
  },
  {
    id: "py-databases-12",
    title: "JOIN: об'єднання двох таблиць",
    type: "python",
    theory:
      "join_tasks_with_owners() проходить по КОЖНІЙ задачі і додає до неї дані власника — так само, як SQL JOIN об'єднує рядки двох таблиць в один результат:\n\ndef join_tasks_with_owners(tasks, users):\n    result = []\n    for task in tasks.rows:\n        owner = users.get_by_id(task[\"owner_id\"])\n        result.append({**task, \"owner_name\": owner[\"name\"]})\n    return result\n\njoined = join_tasks_with_owners(tasks, users)\nprint(joined[0][\"owner_name\"])\n\n{**task, \"owner_name\": ...} створює НОВИЙ словник з усіма полями task ПЛЮС додаткове поле owner_name — той самий трюк розпакування словника, що й у insert().",
    examples: [
      { title: "JOIN об'єднує задачу й власника", code: `def join_tasks_with_owners(tasks, users):\n    result = []\n    for task in tasks.rows:\n        owner = users.get_by_id(task["owner_id"])\n        result.append({**task, "owner_name": owner["name"]})\n    return result\n\njoined = join_tasks_with_owners(tasks, users)\nfor row in joined:\n    print(row["name"], "-", row["owner_name"])`, explain: "Кожен рядок результату містить і дані задачі, і ім'я власника — з двох окремих таблиць одразу." },
    ],
    task: `Дано tasks і users (одна задача, один власник). Напиши join_tasks_with_owners(tasks, users) за прикладом. Виклич її й виведи joined[0]["owner_name"].`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\nusers = Table()\ntasks = Table()\nolena = users.insert({"name": "Олена"})\ntasks.insert({"name": "Купити хліб", "owner_id": olena["id"]})\n\ndef join_tasks_with_owners(tasks, users):\n    # твій код тут\n    pass\n\njoined = join_tasks_with_owners(tasks, users)\nprint(joined[0]["owner_name"])\n`,
    hints: [`for task in tasks.rows: owner = users.get_by_id(task["owner_id"])`, `result.append({**task, "owner_name": owner["name"]})`, `def join_tasks_with_owners(tasks, users):\n    result = []\n    for task in tasks.rows:\n        owner = users.get_by_id(task["owner_id"])\n        result.append({**task, "owner_name": owner["name"]})\n    return result`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\nusers = Table()\ntasks = Table()\nolena = users.insert({"name": "Олена"})\ntasks.insert({"name": "Купити хліб", "owner_id": olena["id"]})\n\ndef join_tasks_with_owners(tasks, users):\n    result = []\n    for task in tasks.rows:\n        owner = users.get_by_id(task["owner_id"])\n        result.append({**task, "owner_name": owner["name"]})\n    return result\n\njoined = join_tasks_with_owners(tasks, users)\nprint(joined[0]["owner_name"])`,
    testCode: `if "joined" not in globals() or joined[0].get("owner_name") != "Олена":\n    __result__ = {"pass": False, "message": "joined[0][\\"owner_name\\"] має дорівнювати \\"Олена\\"."}\nelif "name" not in joined[0]:\n    __result__ = {"pass": False, "message": "joined[0] має містити і поля задачі (name), і owner_name."}\nelif not any("Олена" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи joined[0][\\"owner_name\\"] через print()."}\nelse:\n    __result__ = {"pass": True, "message": "JOIN — об'єднання даних з двох таблиць в один результат, без якого реляційні бази втратили б сенс."}`,
  },
  {
    id: "py-databases-13",
    title: "Агрегатні функції: COUNT, SUM, AVG",
    type: "python",
    theory:
      "Агрегатні функції рахують ОДНЕ підсумкове значення з багатьох рядків — той самий принцип, що вже застосовувався в ⚙️ Automation і 🕷️ Web Scraping:\n\ndef count(self):\n    return len(self.rows)\n\ndef sum_field(self, field):\n    return sum(r[field] for r in self.rows)\n\ndef avg_field(self, field):\n    return self.sum_field(field) / self.count() if self.rows else 0\n\nprint(tasks.count())\nprint(tasks.avg_field(\"priority\"))\n\navg_field() перевикористовує sum_field() і count() — не дублюючи логіку підрахунку.",
    examples: [
      { title: "count/sum_field/avg_field на Table", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def count(self):\n        return len(self.rows)\n    def sum_field(self, field):\n        return sum(r[field] for r in self.rows)\n    def avg_field(self, field):\n        return self.sum_field(field) / self.count() if self.rows else 0\n\ntasks = Table()\ntasks.insert({"priority": 1})\ntasks.insert({"priority": 3})\ntasks.insert({"priority": 5})\nprint(tasks.count())\nprint(tasks.avg_field("priority"))`, explain: "avg_field() ділить суму на кількість — саме те, що AVG() робить у SQL." },
    ],
    task: `Додай Table методи count, sum_field, avg_field за прикладом. Створи tasks із трьома рядками (priority: 1, 3, 5), виведи tasks.count() і tasks.avg_field("priority").`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def count(self):\n        # твій код тут\n        pass\n\n    def sum_field(self, field):\n        # твій код тут\n        pass\n\n    def avg_field(self, field):\n        # твій код тут\n        pass\n\ntasks = Table()\ntasks.insert({"priority": 1})\ntasks.insert({"priority": 3})\ntasks.insert({"priority": 5})\nprint(tasks.count())\nprint(tasks.avg_field("priority"))\n`,
    hints: [`count: return len(self.rows)`, `sum_field: return sum(r[field] for r in self.rows)`, `def count(self):\n    return len(self.rows)\n\ndef sum_field(self, field):\n    return sum(r[field] for r in self.rows)\n\ndef avg_field(self, field):\n    return self.sum_field(field) / self.count() if self.rows else 0`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def count(self):\n        return len(self.rows)\n\n    def sum_field(self, field):\n        return sum(r[field] for r in self.rows)\n\n    def avg_field(self, field):\n        return self.sum_field(field) / self.count() if self.rows else 0\n\ntasks = Table()\ntasks.insert({"priority": 1})\ntasks.insert({"priority": 3})\ntasks.insert({"priority": 5})\nprint(tasks.count())\nprint(tasks.avg_field("priority"))`,
    testCode: `if "tasks" not in globals() or tasks.count() != 3:\n    __result__ = {"pass": False, "message": "tasks.count() має дорівнювати 3."}\nelif tasks.avg_field("priority") != 3.0:\n    __result__ = {"pass": False, "message": "tasks.avg_field(\\"priority\\") має дорівнювати 3.0 ((1+3+5)/3)."}\nelif not any(l.strip() == "3.0" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи tasks.avg_field(\\"priority\\") — має бути 3.0."}\nelse:\n    __result__ = {"pass": True, "message": "count/sum/avg — базові агрегатні функції, які реальний SQL надає готовими (COUNT, SUM, AVG)."}`,
  },
  {
    id: "py-databases-14",
    title: "GROUP BY: групування рядків",
    type: "python",
    theory:
      "group_by(field) розбиває рядки на групи за значенням поля — та сама схема-лічильник, що рахувала файли за типом в ⚙️ Automation, тільки тепер зберігає САМІ рядки, а не лише кількість:\n\ndef group_by(self, field):\n    groups = {}\n    for r in self.rows:\n        key = r[field]\n        groups.setdefault(key, []).append(r)\n    return groups\n\ngroups = tasks.group_by(\"owner_id\")\nfor owner_id, rows in groups.items():\n    print(owner_id, len(rows))\n\ndict.setdefault(ключ, []) повертає наявний список за ключем АБО створює новий порожній список, якщо ключа ще немає — і одразу повертає його для .append().",
    examples: [
      { title: "group_by() розбиває на групи", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def group_by(self, field):\n        groups = {}\n        for r in self.rows:\n            key = r[field]\n            groups.setdefault(key, []).append(r)\n        return groups\n\ntasks = Table()\ntasks.insert({"owner_id": 1, "name": "A"})\ntasks.insert({"owner_id": 1, "name": "B"})\ntasks.insert({"owner_id": 2, "name": "C"})\n\ngroups = tasks.group_by("owner_id")\nfor owner_id, rows in groups.items():\n    print(owner_id, len(rows))`, explain: "owner_id=1 має 2 задачі, owner_id=2 — 1 задачу, кожна група — окремий список рядків." },
    ],
    task: `Додай Table метод group_by(self, field) за прикладом. Створи tasks із трьома рядками (owner_id: 1, 1, 2), згрупуй за "owner_id" і виведи кожен owner_id разом із кількістю його задач.`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def group_by(self, field):\n        # твій код тут\n        pass\n\ntasks = Table()\ntasks.insert({"owner_id": 1, "name": "A"})\ntasks.insert({"owner_id": 1, "name": "B"})\ntasks.insert({"owner_id": 2, "name": "C"})\n\ngroups = tasks.group_by("owner_id")\nfor owner_id, rows in groups.items():\n    print(owner_id, len(rows))\n`,
    hints: [`groups = {}; for r in self.rows: key = r[field]`, `groups.setdefault(key, []).append(r)`, `def group_by(self, field):\n    groups = {}\n    for r in self.rows:\n        key = r[field]\n        groups.setdefault(key, []).append(r)\n    return groups`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def group_by(self, field):\n        groups = {}\n        for r in self.rows:\n            key = r[field]\n            groups.setdefault(key, []).append(r)\n        return groups\n\ntasks = Table()\ntasks.insert({"owner_id": 1, "name": "A"})\ntasks.insert({"owner_id": 1, "name": "B"})\ntasks.insert({"owner_id": 2, "name": "C"})\n\ngroups = tasks.group_by("owner_id")\nfor owner_id, rows in groups.items():\n    print(owner_id, len(rows))`,
    testCode: `if "groups" not in globals() or len(groups.get(1, [])) != 2 or len(groups.get(2, [])) != 1:\n    __result__ = {"pass": False, "message": "groups[1] має містити 2 задачі, groups[2] — 1 задачу."}\nelif not any("2" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи кожну групу з кількістю задач."}\nelse:\n    __result__ = {"pass": True, "message": "group_by() — так реальний SQL рахує «скільки задач у кожного користувача» одним запитом."}`,
  },
  {
    id: "py-databases-15",
    title: "ORDER BY: сортування результатів",
    type: "python",
    theory:
      "order_by(field, reverse=False) сортує рядки за значенням поля — той самий sorted() з key=, що вже застосовувався в 🕷️ Web Scraping:\n\ndef order_by(self, field, reverse=False):\n    return sorted(self.rows, key=lambda r: r[field], reverse=reverse)\n\nnewest_first = tasks.order_by(\"created_at\", reverse=True)\ncheapest_first = products.order_by(\"price\")\n\nreverse=True дає спадний порядок (від більшого до меншого) — той самий параметр, що й у звичайного sorted().",
    examples: [
      { title: "order_by() сортує за будь-яким полем", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def order_by(self, field, reverse=False):\n        return sorted(self.rows, key=lambda r: r[field], reverse=reverse)\n\ntasks = Table()\ntasks.insert({"name": "C", "priority": 3})\ntasks.insert({"name": "A", "priority": 1})\ntasks.insert({"name": "B", "priority": 2})\n\nfor t in tasks.order_by("priority"):\n    print(t["name"])`, explain: "Результат виводить A, B, C — у порядку зростання priority, а не в порядку вставки." },
    ],
    task: `Додай Table метод order_by(self, field, reverse=False) за прикладом. Створи tasks із трьома рядками (priority: 3, 1, 2, у такому порядку вставки), виведи назви в порядку order_by("priority").`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def order_by(self, field, reverse=False):\n        # твій код тут\n        pass\n\ntasks = Table()\ntasks.insert({"name": "C", "priority": 3})\ntasks.insert({"name": "A", "priority": 1})\ntasks.insert({"name": "B", "priority": 2})\n\nfor t in tasks.order_by("priority"):\n    print(t["name"])\n`,
    hints: [`sorted(self.rows, key=lambda r: r[field], reverse=reverse)`, `Повертає НОВИЙ відсортований список, не змінюючи self.rows.`, `def order_by(self, field, reverse=False):\n    return sorted(self.rows, key=lambda r: r[field], reverse=reverse)`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def order_by(self, field, reverse=False):\n        return sorted(self.rows, key=lambda r: r[field], reverse=reverse)\n\ntasks = Table()\ntasks.insert({"name": "C", "priority": 3})\ntasks.insert({"name": "A", "priority": 1})\ntasks.insert({"name": "B", "priority": 2})\n\nfor t in tasks.order_by("priority"):\n    print(t["name"])`,
    testCode: `names = [l.strip() for l in __logs if l.strip() in ("A", "B", "C")]\nif names != ["A", "B", "C"]:\n    __result__ = {"pass": False, "message": "Порядок виводу має бути A, B, C — за зростанням priority."}\nelse:\n    __result__ = {"pass": True, "message": "order_by() — сортування за будь-яким полем, без зміни оригінального порядку рядків у таблиці."}`,
  },
  {
    id: "py-databases-16",
    title: "Транзакції: усе або нічого",
    type: "python",
    theory:
      "Транзакція — група операцій, що мають виконатись УСІ разом, або ЖОДНА (атомарність): якщо посеред операцій станеться помилка, усі попередні зміни в цій транзакції скасовуються. Змоделюємо це через резервну копію стану ПЕРЕД операціями:\n\nimport copy\n\ndef run_transaction(table, operations):\n    backup = copy.deepcopy(table.rows)\n    try:\n        for op in operations:\n            op(table)\n    except Exception as e:\n        table.rows = backup\n        print(f\"Транзакцію скасовано: {e}\")\n\ncopy.deepcopy() створює ПОВНІСТЮ незалежну копію (включно з вкладеними списками й словниками) — просте присвоєння backup = table.rows дало б лише посилання на ТОЙ САМИЙ список, і зміни зіпсували б і копію теж.",
    examples: [
      { title: "run_transaction() відкочує зміни при помилці", code: `import copy\n\ndef run_transaction(table, operations):\n    backup = copy.deepcopy(table.rows)\n    try:\n        for op in operations:\n            op(table)\n    except Exception as e:\n        table.rows = backup\n        print(f"Транзакцію скасовано: {e}")\n\ndef bad_operation(table):\n    table.insert({"name": "Тимчасова"})\n    raise ValueError("Щось пішло не так")\n\ntasks = Table()\nrun_transaction(tasks, [bad_operation])\nprint(len(tasks.rows))`, explain: "Незважаючи на те, що insert() виконався, помилка ПІСЛЯ нього відкочує ВСЮ транзакцію — задача зникає." },
    ],
    task: `Напиши run_transaction(table, operations) за прикладом. Дано tasks (порожня) і bad_operation, що вставляє задачу й одразу кидає ValueError. Виклич run_transaction(tasks, [bad_operation]) і виведи len(tasks.rows) (має бути 0).`,
    starter: `import copy\n\nclass Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\ndef run_transaction(table, operations):\n    # твій код тут\n    pass\n\ndef bad_operation(table):\n    table.insert({"name": "Тимчасова"})\n    raise ValueError("Щось пішло не так")\n\ntasks = Table()\nrun_transaction(tasks, [bad_operation])\nprint(len(tasks.rows))\n`,
    hints: [`backup = copy.deepcopy(table.rows)`, `try: for op in operations: op(table)\nexcept Exception as e: table.rows = backup; print(f"Транзакцію скасовано: {e}")`, `def run_transaction(table, operations):\n    backup = copy.deepcopy(table.rows)\n    try:\n        for op in operations:\n            op(table)\n    except Exception as e:\n        table.rows = backup\n        print(f"Транзакцію скасовано: {e}")`],
    solution: `import copy\n\nclass Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\ndef run_transaction(table, operations):\n    backup = copy.deepcopy(table.rows)\n    try:\n        for op in operations:\n            op(table)\n    except Exception as e:\n        table.rows = backup\n        print(f"Транзакцію скасовано: {e}")\n\ndef bad_operation(table):\n    table.insert({"name": "Тимчасова"})\n    raise ValueError("Щось пішло не так")\n\ntasks = Table()\nrun_transaction(tasks, [bad_operation])\nprint(len(tasks.rows))`,
    testCode: `if "tasks" not in globals() or len(tasks.rows) != 0:\n    __result__ = {"pass": False, "message": "Після скасованої транзакції tasks.rows має лишитись порожнім."}\nelif not any("скасовано" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись повідомлення про скасування транзакції."}\nelif not any(l.strip() == "0" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(tasks.rows) — має бути 0."}\nelse:\n    __result__ = {"pass": True, "message": "Атомарність транзакцій захищає базу від «напівзроблених» змін, якщо посередині сталась помилка."}`,
  },
  {
    id: "py-databases-17",
    title: "Валідація схеми перед insert",
    type: "python",
    theory:
      "Схема (schema) таблиці описує, ЯКІ поля обов'язкові в кожному рядку. Додамо перевірку в insert(): якщо бракує обов'язкового поля — відмовити, а не створювати «неповний» рядок:\n\ndef insert_validated(self, data, required_fields):\n    missing = [f for f in required_fields if f not in data]\n    if missing:\n        raise ValueError(f\"Бракує обов'язкових полів: {missing}\")\n    return self.insert(data)\n\ntry:\n    tasks.insert_validated({\"done\": False}, required_fields=[\"name\", \"done\"])\nexcept ValueError as e:\n    print(e)\n\nmissing — список comprehension, що збирає ВСІ бракуючі поля одразу, а не зупиняється на першому знайденому.",
    examples: [
      { title: "insert_validated() перевіряє обов'язкові поля", code: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def insert_validated(self, data, required_fields):\n        missing = [f for f in required_fields if f not in data]\n        if missing:\n            raise ValueError(f"Бракує обов'язкових полів: {missing}")\n        return self.insert(data)\n\ntasks = Table()\ntry:\n    tasks.insert_validated({"done": False}, required_fields=["name", "done"])\nexcept ValueError as e:\n    print(e)\nprint(len(tasks.rows))`, explain: "Без поля name insert відхиляється повністю — жодного «наполовину заповненого» рядка." },
    ],
    task: `Додай Table метод insert_validated(self, data, required_fields) за прикладом. Виклич його з {"done": False} і required_fields=["name", "done"] (name бракує) через try/except, виведи повідомлення і len(tasks.rows).`,
    starter: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def insert_validated(self, data, required_fields):\n        # твій код тут\n        pass\n\ntasks = Table()\ntry:\n    tasks.insert_validated({"done": False}, required_fields=["name", "done"])\nexcept ValueError as e:\n    print(e)\nprint(len(tasks.rows))\n`,
    hints: [`missing = [f for f in required_fields if f not in data]`, `if missing: raise ValueError(f"Бракує обов'язкових полів: {missing}")`, `def insert_validated(self, data, required_fields):\n    missing = [f for f in required_fields if f not in data]\n    if missing:\n        raise ValueError(f"Бракує обов'язкових полів: {missing}")\n    return self.insert(data)`],
    solution: `class Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\n    def insert_validated(self, data, required_fields):\n        missing = [f for f in required_fields if f not in data]\n        if missing:\n            raise ValueError(f"Бракує обов'язкових полів: {missing}")\n        return self.insert(data)\n\ntasks = Table()\ntry:\n    tasks.insert_validated({"done": False}, required_fields=["name", "done"])\nexcept ValueError as e:\n    print(e)\nprint(len(tasks.rows))`,
    testCode: `if "tasks" not in globals() or len(tasks.rows) != 0:\n    __result__ = {"pass": False, "message": "tasks.rows має лишитись порожнім — вставка з відсутнім обов'язковим полем має бути відхилена."}\nelif not any("name" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Повідомлення про помилку має згадувати відсутнє поле name."}\nelse:\n    __result__ = {"pass": True, "message": "Валідація схеми — те, що не дає в базу потрапити рядкам без обов'язкових полів."}`,
  },
  {
    id: "py-databases-18",
    title: "Збереження бази у файл",
    type: "python",
    theory:
      "Дані в оперативній пам'яті зникають при завершенні програми — тому базу треба ЗБЕРІГАТИ на диск. save_to_file() серіалізує всі таблиці в JSON (з ⚙️ Automation і 🌐 API Development) і записує у файл:\n\nimport json\n\ndef save_to_file(db, filename):\n    data = {name: table.rows for name, table in db.tables.items()}\n    with open(filename, \"w\", encoding=\"utf-8\") as f:\n        json.dump(data, f, ensure_ascii=False)\n\nsave_to_file(db, \"database.json\")\n\njson.dump(об'єкт, файл) — те саме, що json.dumps() + запис у файл в одному виклику, без проміжної змінної-рядка.",
    examples: [
      { title: "save_to_file() зберігає всю базу", code: `import json\n\ndef save_to_file(db, filename):\n    data = {name: table.rows for name, table in db.tables.items()}\n    with open(filename, "w", encoding="utf-8") as f:\n        json.dump(data, f, ensure_ascii=False)\n\nsave_to_file(db, "database.json")\nprint(open("database.json").read())`, explain: "json.dump() пише прямо у файл, обходячи КОЖНУ таблицю бази." },
    ],
    task: `Дано db із таблицею "tasks" (одна задача). Напиши save_to_file(db, filename) за прикладом. Виклич save_to_file(db, "database.json") і виведи вміст файлу.`,
    starter: `import json\n\nclass Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndb = Database()\ntasks = db.create_table("tasks")\ntasks.insert({"name": "Купити хліб"})\n\ndef save_to_file(db, filename):\n    # твій код тут\n    pass\n\nsave_to_file(db, "database.json")\nprint(open("database.json").read())\n`,
    hints: [`data = {name: table.rows for name, table in db.tables.items()}`, `with open(filename, "w", encoding="utf-8") as f: json.dump(data, f, ensure_ascii=False)`, `def save_to_file(db, filename):\n    data = {name: table.rows for name, table in db.tables.items()}\n    with open(filename, "w", encoding="utf-8") as f:\n        json.dump(data, f, ensure_ascii=False)`],
    solution: `import json\n\nclass Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndb = Database()\ntasks = db.create_table("tasks")\ntasks.insert({"name": "Купити хліб"})\n\ndef save_to_file(db, filename):\n    data = {name: table.rows for name, table in db.tables.items()}\n    with open(filename, "w", encoding="utf-8") as f:\n        json.dump(data, f, ensure_ascii=False)\n\nsave_to_file(db, "database.json")\nprint(open("database.json").read())`,
    testCode: `import os\nif not os.path.exists("database.json"):\n    __result__ = {"pass": False, "message": "Файл database.json має бути створений."}\nelse:\n    content = open("database.json", encoding="utf-8").read()\n    if "Купити хліб" not in content or "tasks" not in content:\n        __result__ = {"pass": False, "message": "Файл має містити назву таблиці tasks і дані задачі."}\n    elif not any("Купити хліб" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи вміст database.json через print()."}\n    else:\n        __result__ = {"pass": True, "message": "save_to_file() — те, що перетворює тимчасову базу в пам'яті на постійне сховище на диску."}`,
  },
  {
    id: "py-databases-19",
    title: "Завантаження бази з файлу",
    type: "python",
    theory:
      "load_from_file() робить зворотну дію: читає JSON і відновлює всі таблиці бази — для КОЖНОЇ таблиці рядки завантажуються, а next_id виставляється на максимальний наявний id + 1 (щоб нові рядки не конфліктували зі старими):\n\ndef load_from_file(filename):\n    with open(filename, encoding=\"utf-8\") as f:\n        data = json.load(f)\n    db = Database()\n    for name, rows in data.items():\n        table = db.create_table(name)\n        table.rows = rows\n        table.next_id = max((r[\"id\"] for r in rows), default=0) + 1\n    return db\n\nmax(..., default=0) — важливо для ПОРОЖНЬОЇ таблиці: без default max() на порожньому генераторі викликав би помилку.",
    examples: [
      { title: "load_from_file() відновлює базу з диску", code: `def load_from_file(filename):\n    with open(filename, encoding="utf-8") as f:\n        data = json.load(f)\n    db = Database()\n    for name, rows in data.items():\n        table = db.create_table(name)\n        table.rows = rows\n        table.next_id = max((r["id"] for r in rows), default=0) + 1\n    return db\n\nloaded_db = load_from_file("database.json")\nprint(loaded_db.tables["tasks"].rows)\nprint(loaded_db.tables["tasks"].next_id)`, explain: "next_id продовжується з правильного числа — нові insert() не перезапишуть існуючі id." },
    ],
    task: `Дано вже збережений "database.json" з однією задачею (id=1). Напиши load_from_file(filename) за прикладом. Завантаж базу і виведи loaded_db.tables["tasks"].rows та loaded_db.tables["tasks"].next_id (має бути 2).`,
    starter: `import json\n\nclass Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndb = Database()\ntasks = db.create_table("tasks")\ntasks.insert({"name": "Купити хліб"})\nwith open("database.json", "w", encoding="utf-8") as f:\n    json.dump({name: t.rows for name, t in db.tables.items()}, f, ensure_ascii=False)\n\ndef load_from_file(filename):\n    # твій код тут\n    pass\n\nloaded_db = load_from_file("database.json")\nprint(loaded_db.tables["tasks"].rows)\nprint(loaded_db.tables["tasks"].next_id)\n`,
    hints: [`with open(filename, encoding="utf-8") as f: data = json.load(f)`, `for name, rows in data.items(): table = db.create_table(name); table.rows = rows; table.next_id = max((r["id"] for r in rows), default=0) + 1`, `def load_from_file(filename):\n    with open(filename, encoding="utf-8") as f:\n        data = json.load(f)\n    db = Database()\n    for name, rows in data.items():\n        table = db.create_table(name)\n        table.rows = rows\n        table.next_id = max((r["id"] for r in rows), default=0) + 1\n    return db`],
    solution: `import json\n\nclass Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndb = Database()\ntasks = db.create_table("tasks")\ntasks.insert({"name": "Купити хліб"})\nwith open("database.json", "w", encoding="utf-8") as f:\n    json.dump({name: t.rows for name, t in db.tables.items()}, f, ensure_ascii=False)\n\ndef load_from_file(filename):\n    with open(filename, encoding="utf-8") as f:\n        data = json.load(f)\n    db = Database()\n    for name, rows in data.items():\n        table = db.create_table(name)\n        table.rows = rows\n        table.next_id = max((r["id"] for r in rows), default=0) + 1\n    return db\n\nloaded_db = load_from_file("database.json")\nprint(loaded_db.tables["tasks"].rows)\nprint(loaded_db.tables["tasks"].next_id)`,
    testCode: `if "loaded_db" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція load_from_file(), що повертає готовий Database."}\nelif loaded_db.tables["tasks"].rows[0]["name"] != "Купити хліб":\n    __result__ = {"pass": False, "message": "Завантажена таблиця tasks має містити задачу «Купити хліб»."}\nelif loaded_db.tables["tasks"].next_id != 2:\n    __result__ = {"pass": False, "message": "next_id завантаженої таблиці має бути 2 (наступний вільний id)."}\nelif not any(l.strip() == "2" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи loaded_db.tables[\\"tasks\\"].next_id — має бути 2."}\nelse:\n    __result__ = {"pass": True, "message": "load_from_file() замикає цикл: дані пережили б навіть повний перезапуск програми."}`,
  },
  {
    id: "py-databases-20",
    title: "Фінальний проєкт: міні-СУБД",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків у повноцінну міні-СУБД: Database із таблицями users і tasks, зовнішній ключ owner_id, JOIN, GROUP BY, збереження й завантаження з файлу. Це і є міні-СУБД, обіцяна ще на вступній сторінці «Що це?».\n\nВесь цей код (Table, Database, JOIN, транзакції) описує ті самі концепції, що лежать в основі sqlite3, PostgreSQL чи MySQL — різниця лише в тому, що реальні бази роблять це швидше, надійніше й для мільйонів рядків, а не в 20 навчальних уроках.",
    examples: [
      { title: "Повний прогін міні-СУБД", code: `db = Database()\nusers = db.create_table("users")\ntasks = db.create_table("tasks")\n\nolena = users.insert({"name": "Олена"})\ntasks.insert({"name": "Купити хліб", "owner_id": olena["id"], "done": False})\ntasks.insert({"name": "Погуляти", "owner_id": olena["id"], "done": True})\n\njoined = join_tasks_with_owners(tasks, users)\nfor row in joined:\n    print(row["owner_name"], "-", row["name"])\n\nsave_to_file(db, "final_database.json")`, explain: "Одна база, дві пов'язані таблиці, JOIN для зручного перегляду й збереження на диск." },
    ],
    task: `Створи db із таблицями "users" і "tasks". Додай користувача "Олена" й дві її задачі (одна done=True). Виклич join_tasks_with_owners(tasks, users), виведи кожен рядок у форматі "owner_name - name", збережи базу через save_to_file(db, "final_database.json"), виведи чи файл існує (os.path.exists).`,
    starter: `import json, os\n\nclass Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndef join_tasks_with_owners(tasks, users):\n    result = []\n    for task in tasks.rows:\n        owner = users.get_by_id(task["owner_id"])\n        result.append({**task, "owner_name": owner["name"]})\n    return result\n\ndef save_to_file(db, filename):\n    data = {name: table.rows for name, table in db.tables.items()}\n    with open(filename, "w", encoding="utf-8") as f:\n        json.dump(data, f, ensure_ascii=False)\n\n# твій код тут\n`,
    hints: [`db = Database(); users = db.create_table("users"); tasks = db.create_table("tasks")`, `olena = users.insert({"name": "Олена"}); tasks.insert({"name": "...", "owner_id": olena["id"], "done": False}) (двічі)`, `joined = join_tasks_with_owners(tasks, users)\nfor row in joined:\n    print(f"{row['owner_name']} - {row['name']}")\nsave_to_file(db, "final_database.json")\nprint(os.path.exists("final_database.json"))`],
    solution: `import json, os\n\nclass Table:\n    def __init__(self):\n        self.rows = []\n        self.next_id = 1\n    def insert(self, data):\n        row = {"id": self.next_id, **data}\n        self.rows.append(row)\n        self.next_id += 1\n        return row\n    def get_by_id(self, id):\n        return next((r for r in self.rows if r["id"] == id), None)\n\nclass Database:\n    def __init__(self):\n        self.tables = {}\n    def create_table(self, name):\n        self.tables[name] = Table()\n        return self.tables[name]\n\ndef join_tasks_with_owners(tasks, users):\n    result = []\n    for task in tasks.rows:\n        owner = users.get_by_id(task["owner_id"])\n        result.append({**task, "owner_name": owner["name"]})\n    return result\n\ndef save_to_file(db, filename):\n    data = {name: table.rows for name, table in db.tables.items()}\n    with open(filename, "w", encoding="utf-8") as f:\n        json.dump(data, f, ensure_ascii=False)\n\ndb = Database()\nusers = db.create_table("users")\ntasks = db.create_table("tasks")\n\nolena = users.insert({"name": "Олена"})\ntasks.insert({"name": "Купити хліб", "owner_id": olena["id"], "done": False})\ntasks.insert({"name": "Погуляти", "owner_id": olena["id"], "done": True})\n\njoined = join_tasks_with_owners(tasks, users)\nfor row in joined:\n    print(f"{row['owner_name']} - {row['name']}")\n\nsave_to_file(db, "final_database.json")\nprint(os.path.exists("final_database.json"))`,
    testCode: `import os\nif "joined" not in globals() or len(joined) != 2:\n    __result__ = {"pass": False, "message": "joined має містити 2 задачі, обидві з owner_name «Олена»."}\nelif not all(r["owner_name"] == "Олена" for r in joined):\n    __result__ = {"pass": False, "message": "Обидві задачі мають належати «Олена»."}\nelif not os.path.exists("final_database.json"):\n    __result__ = {"pass": False, "message": "Файл final_database.json має бути створений через save_to_file()."}\nelif not any("Олена" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи кожен рядок joined у форматі «Олена - назва»."}\nelif not any(l.strip() == "True" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи os.path.exists(\\"final_database.json\\") — має бути True."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Міні-СУБД: таблиці, зовнішні ключі, JOIN і збереження на диск — усе з нуля, крок за кроком за 20 уроків."}`,
    finalProject: {
      techs: ["Python 3", "class (Table, Database)", "json", "dict/list comprehension", "copy.deepcopy"],
      skills: [
        "Таблиці, рядки, первинні й зовнішні ключі",
        "CRUD-операції (insert/select/update/delete) як методи класу",
        "Індекси для швидкого пошуку",
        "JOIN — об'єднання даних з кількох таблиць",
        "GROUP BY та агрегатні функції (COUNT/SUM/AVG)",
        "Транзакції (атомарність) і персистентність (збереження у файл)",
      ],
      structure:
        "mini_db.py\n  ├── class Table            # rows, next_id, insert/get_by_id/select/update/delete\n  │     ├── build_index / group_by / order_by\n  │     └── count / sum_field / avg_field\n  ├── class Database          # tables: {ім'я: Table}\n  ├── join_tasks_with_owners() # приклад JOIN двох таблиць\n  ├── save_to_file / load_from_file\n  └── run_transaction()         # атомарність операцій",
      code: `import json
import copy


class Table:
    def __init__(self):
        self.rows = []
        self.next_id = 1

    def insert(self, data):
        row = {"id": self.next_id, **data}
        self.rows.append(row)
        self.next_id += 1
        return row

    def get_by_id(self, id):
        return next((r for r in self.rows if r["id"] == id), None)

    def select(self, condition):
        return [r for r in self.rows if condition(r)]

    def update(self, id, changes):
        row = self.get_by_id(id)
        if row is None:
            return None
        row.update(changes)
        return row

    def delete(self, id):
        row = self.get_by_id(id)
        if row is None:
            return False
        self.rows.remove(row)
        return True

    def group_by(self, field):
        groups = {}
        for r in self.rows:
            groups.setdefault(r[field], []).append(r)
        return groups

    def order_by(self, field, reverse=False):
        return sorted(self.rows, key=lambda r: r[field], reverse=reverse)


class Database:
    def __init__(self):
        self.tables = {}

    def create_table(self, name):
        self.tables[name] = Table()
        return self.tables[name]


def join_tasks_with_owners(tasks, users):
    result = []
    for task in tasks.rows:
        owner = users.get_by_id(task["owner_id"])
        result.append({**task, "owner_name": owner["name"]})
    return result


def save_to_file(db, filename):
    data = {name: table.rows for name, table in db.tables.items()}
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


def load_from_file(filename):
    with open(filename, encoding="utf-8") as f:
        data = json.load(f)
    db = Database()
    for name, rows in data.items():
        table = db.create_table(name)
        table.rows = rows
        table.next_id = max((r["id"] for r in rows), default=0) + 1
    return db


if __name__ == "__main__":
    db = Database()
    users = db.create_table("users")
    tasks = db.create_table("tasks")

    olena = users.insert({"name": "Олена"})
    tasks.insert({"name": "Купити хліб", "owner_id": olena["id"], "done": False})
    tasks.insert({"name": "Погуляти", "owner_id": olena["id"], "done": True})

    for row in join_tasks_with_owners(tasks, users):
        print(f"{row['owner_name']} - {row['name']}")

    save_to_file(db, "final_database.json")`,
      runCommand: "python mini_db.py",
      installGuide: {
        intro:
          "sqlite3 вбудований у СПРАВЖНІЙ Python (просто не входить у Pyodide) — жодного pip install не потрібно, щоб перейти від цієї міні-СУБД до реального SQLite локально.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text:
              "Зайди на python.org/downloads і встанови останню версію. Windows: обов'язково постав галочку «Add python.exe to PATH». (Детальні кроки для кожної ОС — в уроках напрямку Game Development.)",
            code: null,
          },
          {
            title: "2. Перевір, що sqlite3 доступний",
            text: "У реальному Python sqlite3 вже вбудований — перевір це прямо в терміналі:",
            code: `python -c "import sqlite3; print(sqlite3.sqlite_version)"`,
          },
          {
            title: "3. Перейди від Table/Database до реального sqlite3",
            text:
              "Концепції з цих 20 уроків переносяться напряму: insert() → INSERT INTO, select() → SELECT ... WHERE, join_tasks_with_owners() → SQL JOIN. Різниця лише в синтаксисі запитів.",
            code: `import sqlite3

conn = sqlite3.connect("app.db")
cur = conn.cursor()
cur.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER,
        done INTEGER DEFAULT 0
    )
""")
cur.execute("INSERT INTO tasks (name, owner_id) VALUES (?, ?)", ("Купити хліб", 1))
conn.commit()

cur.execute("SELECT * FROM tasks WHERE owner_id = ?", (1,))
print(cur.fetchall())
conn.close()`,
          },
          {
            title: "4. Запусти скрипт",
            text: "sqlite3 сам створить файл app.db на диску — дані переживуть перезапуск програми без жодного save_to_file().",
            code: "python app.py",
          },
        ],
      },
      improvements: [
        "Перейти на реальний sqlite3 (чи PostgreSQL для великих проєктів) замість власного движка",
        "Додати каскадне видалення (при видаленні користувача видаляти й усі його задачі)",
        "Реалізувати повноцінний текстовий SQL-парсер поверх Table/Database (амбітне розширення)",
        "Додати блокування (locking) для безпечного одночасного доступу з кількох частин програми",
      ],
      nextLevel:
        "Далі — 📊 Data Analysis: маючи дані в таблицях (тепер уже зрозуміло, що це таке), наступний крок — аналізувати їх: фільтрувати, агрегувати й візуалізувати за допомогою Pandas.",
    },
  },
];
