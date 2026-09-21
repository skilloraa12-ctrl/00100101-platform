// Python Full Project — the sixteenth and final Python direction. Same
// intro + 20 lessons structure, but with a different goal from the other
// 15: instead of introducing NEW techniques, this direction combines
// techniques from SEVERAL earlier directions (OOP, file persistence,
// password hashing, command routing, logging, statistics, backups) into
// ONE growing application, built lesson by lesson, exactly the way a real
// project accumulates features over time. By lesson 20 it's a complete,
// multi-user Task Manager CLI application — the capstone of all 16
// Python directions.
export const PYTHON_FULLPROJECT_LESSONS = [
  {
    id: "py-fullproject-intro",
    title: "Що це? — Python Full Project",
    type: "intro",
    theory:
      "Python Full Project — це завершальний напрямок, і він працює ІНАКШЕ за попередні 15: тут немає нової теми на кожен урок. Замість цього ОДИН застосунок — багатокористувацький менеджер задач (Task Manager) — росте від уроку до уроку, поєднуючи прийоми з УСІХ попередніх напрямків: класи (🐍 OOP), збереження у файл (⚙️ Automation, 🌐 API Development), хешування паролів (🔧 Backend Development), обробку помилок (🔐 Cybersecurity), статистику (📊 Data Analysis), резервні копії (🧰 DevOps).\n\nЦе те, як РЕАЛЬНІ проєкти насправді розробляються: не «вивчити всі теми, а потім написати проєкт», а «додавати одну можливість за раз до застосунку, що вже працює». Кожен урок додає ОДНУ нову функцію до Task Manager — і після кожного уроку застосунок залишається робочим, лише трохи потужнішим.\n\nЩо знадобиться з попередніх напрямків: буквально все — класи й методи, файли й JSON, хешування паролів, try/except, list comprehension, статистика, резервні копії. Що буде після 20 уроків: task_manager_app.py — повноцінний, багатокористувацький CLI-застосунок з реєстрацією, командами, збереженням стану, статистикою й резервним копіюванням, який об'єднує принципи ВСІХ 16 напрямків Python в один реальний проєкт.",
    presentation: [
      { title: "Full Project — коротко", points: ["ОДИН застосунок росте від уроку до уроку — не 20 окремих тем", "Поєднує ОСІ, файли, хешування, команди, статистику й бекапи з попередніх напрямків", "Так насправді розробляються реальні проєкти: можливість за можливістю"] },
      { title: "Результат", points: ["20 уроків: клас Task → менеджер → збереження → користувачі → команди → статистика", "Фінал: task_manager_app.py — повний багатокористувацький CLI-застосунок", "Підсумок усіх 16 напрямків Python в одному реальному проєкті"] },
    ],
  },
  {
    id: "py-fullproject-1",
    title: "Клас Task: перший будівельний блок",
    type: "python",
    theory:
      "Кожна задача — об'єкт з назвою, статусом виконання й пріоритетом (recap ООП з 🐍 Python OOP). Метод toggle() перемикає стан done між True й False:\n\nclass Task:\n    def __init__(self, title, priority=\"normal\", owner=None):\n        self.title = title\n        self.done = False\n        self.priority = priority\n        self.owner = owner\n\n    def toggle(self):\n        self.done = not self.done\n\ntask = Task(\"Buy milk\")\nprint(task.title, task.done, task.priority)\ntask.toggle()\nprint(task.done)",
    examples: [
      { title: "Task — перший клас застосунку", code: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title = title\n        self.done = False\n        self.priority = priority\n        self.owner = owner\n\n    def toggle(self):\n        self.done = not self.done\n\ntask = Task("Buy milk")\nprint(task.title, task.done, task.priority)\ntask.toggle()\nprint(task.done)`, explain: "Нова задача завжди починається з done=False; toggle() перемикає її на True (і назад, якщо викликати ще раз)." },
    ],
    task: `Напиши клас Task з __init__(title, priority="normal", owner=None) і методом toggle(). Створи task = Task("Buy milk"), виведи title/done/priority, виклич toggle() і виведи done знову.`,
    starter: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        # твій код тут\n        pass\n\n    def toggle(self):\n        # твій код тут\n        pass\n\n# task = Task("Buy milk")\n# print(task.title, task.done, task.priority)\n# task.toggle()\n# print(task.done)\n`,
    hints: [`__init__ зберігає title, done=False, priority, owner як атрибути self.`, `toggle: self.done = not self.done`, `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title = title\n        self.done = False\n        self.priority = priority\n        self.owner = owner\n\n    def toggle(self):\n        self.done = not self.done`],
    solution: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title = title\n        self.done = False\n        self.priority = priority\n        self.owner = owner\n\n    def toggle(self):\n        self.done = not self.done\n\ntask = Task("Buy milk")\nprint(task.title, task.done, task.priority)\ntask.toggle()\nprint(task.done)`,
    testCode: `if "Task" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Task."}\nelse:\n    t = Task("Test task")\n    if t.title != "Test task" or t.done != False or t.priority != "normal":\n        __result__ = {"pass": False, "message": "Нова задача має мати title='Test task', done=False, priority='normal' за замовчуванням."}\n    else:\n        t.toggle()\n        if t.done != True:\n            __result__ = {"pass": False, "message": "Після toggle() done має стати True."}\n        else:\n            __result__ = {"pass": True, "message": "Клас Task — перший будівельний блок застосунку, який росте всі наступні 19 уроків."}`,
  },
  {
    id: "py-fullproject-2",
    title: "Клас TaskManager: контейнер для задач",
    type: "python",
    theory:
      "Окремі об'єкти Task потрібно ЗБЕРІГАТИ разом — TaskManager тримає список усіх задач і вміє додавати нові:\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\nmanager.add_task(Task(\"Buy milk\"))\nmanager.add_task(Task(\"Clean house\", priority=\"low\"))\n\nprint(len(manager.tasks))\nprint(manager.tasks[0].title)",
    examples: [
      { title: "TaskManager — колекція задач", code: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title = title\n        self.done = False\n        self.priority = priority\n        self.owner = owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\nmanager.add_task(Task("Buy milk"))\nmanager.add_task(Task("Clean house", priority="low"))\n\nprint(len(manager.tasks))\nprint(manager.tasks[0].title)`, explain: "manager.tasks — звичайний список об'єктів Task, який росте з кожним add_task()." },
    ],
    task: `Дано Task (в starter). Напиши клас TaskManager з self.tasks=[] і add_task(task). Додай дві задачі. Виведи len(manager.tasks) і manager.tasks[0].title.`,
    starter: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title = title\n        self.done = False\n        self.priority = priority\n        self.owner = owner\n\nclass TaskManager:\n    def __init__(self):\n        # твій код тут\n        pass\n\n    def add_task(self, task):\n        # твій код тут\n        pass\n\n# manager = TaskManager()\n# manager.add_task(Task("Buy milk"))\n# manager.add_task(Task("Clean house", priority="low"))\n# print(len(manager.tasks))\n# print(manager.tasks[0].title)\n`,
    hints: [`__init__: self.tasks = []`, `add_task: self.tasks.append(task)`, `class TaskManager:\n    def __init__(self):\n        self.tasks = []\n\n    def add_task(self, task):\n        self.tasks.append(task)`],
    solution: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title = title\n        self.done = False\n        self.priority = priority\n        self.owner = owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\nmanager.add_task(Task("Buy milk"))\nmanager.add_task(Task("Clean house", priority="low"))\nprint(len(manager.tasks))\nprint(manager.tasks[0].title)`,
    testCode: `if "TaskManager" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас TaskManager."}\nelse:\n    m = TaskManager()\n    if m.tasks != []:\n        __result__ = {"pass": False, "message": "Новий TaskManager має починатись з порожнього self.tasks."}\n    else:\n        m.add_task(Task("A"))\n        m.add_task(Task("B"))\n        if len(m.tasks) != 2 or m.tasks[0].title != "A":\n            __result__ = {"pass": False, "message": "Після двох add_task() має бути 2 задачі у правильному порядку."}\n        else:\n            __result__ = {"pass": True, "message": "TaskManager тримає всі задачі разом — контейнер, навколо якого будується решта застосунку."}`,
  },
  {
    id: "py-fullproject-3",
    title: "Фільтрація задач за станом і пріоритетом",
    type: "python",
    theory:
      "Реальний список задач треба ФІЛЬТРУВАТИ: показати лише невиконані, лише термінові. Опціональні параметри (None за замовчуванням) дозволяють фільтрувати за БУДЬ-ЯКОЮ комбінацією умов:\n\ndef filter_tasks(tasks, done=None, priority=None):\n    result = tasks\n    if done is not None:\n        result = [t for t in result if t.done == done]\n    if priority is not None:\n        result = [t for t in result if t.priority == priority]\n    return result\n\nprint([t.title for t in filter_tasks(manager.tasks, done=False)])\nprint([t.title for t in filter_tasks(manager.tasks, priority=\"high\")])",
    examples: [
      { title: "filter_tasks() — гнучка фільтрація", code: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntasks = [Task("Buy milk"), Task("Clean house", "low"), Task("Fix bug", "high")]\ntasks[0].done = True\n\ndef filter_tasks(tasks, done=None, priority=None):\n    result = tasks\n    if done is not None:\n        result = [t for t in result if t.done == done]\n    if priority is not None:\n        result = [t for t in result if t.priority == priority]\n    return result\n\nprint([t.title for t in filter_tasks(tasks, done=False)])\nprint([t.title for t in filter_tasks(tasks, priority="high")])`, explain: "done=False показує 2 невиконані задачі; priority='high' показує лише 'Fix bug'." },
    ],
    task: `Дано tasks (3 задачі, перша вже done=True). Напиши filter_tasks(tasks, done=None, priority=None). Виведи результат для done=False і для priority="high".`,
    starter: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntasks = [Task("Buy milk"), Task("Clean house", "low"), Task("Fix bug", "high")]\ntasks[0].done = True\n\ndef filter_tasks(tasks, done=None, priority=None):\n    # твій код тут\n    pass\n\n# print([t.title for t in filter_tasks(tasks, done=False)])\n# print([t.title for t in filter_tasks(tasks, priority="high")])\n`,
    hints: [`Почни з result = tasks, потім звужуй його ПОСЛІДОВНО кожною умовою if вона не None.`, `if done is not None: result = [t for t in result if t.done == done]`, `def filter_tasks(tasks, done=None, priority=None):\n    result = tasks\n    if done is not None:\n        result = [t for t in result if t.done == done]\n    if priority is not None:\n        result = [t for t in result if t.priority == priority]\n    return result`],
    solution: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntasks = [Task("Buy milk"), Task("Clean house", "low"), Task("Fix bug", "high")]\ntasks[0].done = True\n\ndef filter_tasks(tasks, done=None, priority=None):\n    result = tasks\n    if done is not None:\n        result = [t for t in result if t.done == done]\n    if priority is not None:\n        result = [t for t in result if t.priority == priority]\n    return result\n\nprint([t.title for t in filter_tasks(tasks, done=False)])\nprint([t.title for t in filter_tasks(tasks, priority="high")])`,
    testCode: `if "filter_tasks" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція filter_tasks(tasks, done=None, priority=None)."}\nelse:\n    not_done = [t.title for t in filter_tasks(tasks, done=False)]\n    high = [t.title for t in filter_tasks(tasks, priority="high")]\n    if not_done != ["Clean house", "Fix bug"]:\n        __result__ = {"pass": False, "message": "filter_tasks(tasks, done=False) має дати ['Clean house', 'Fix bug']."}\n    elif high != ["Fix bug"]:\n        __result__ = {"pass": False, "message": "filter_tasks(tasks, priority='high') має дати ['Fix bug']."}\n    else:\n        __result__ = {"pass": True, "message": "Опціональні параметри дозволяють фільтрувати за будь-якою комбінацією умов однією функцією."}`,
  },
  {
    id: "py-fullproject-4",
    title: "Сортування задач за пріоритетом",
    type: "python",
    theory:
      "Пріоритети \"high\"/\"normal\"/\"low\" — це РЯДКИ, і сортувати їх за алфавітом безглуздо (\"high\" опинилось б ПЕРЕД \"low\", але \"normal\" теж перед \"low\" — незрозумілий порядок). Словник PRIORITY_ORDER перетворює кожен рядок на ЧИСЛО для сортування:\n\nPRIORITY_ORDER = {\"high\": 0, \"normal\": 1, \"low\": 2}\n\ndef sort_by_priority(tasks):\n    return sorted(tasks, key=lambda t: PRIORITY_ORDER[t.priority])\n\nfor t in sort_by_priority(tasks):\n    print(t.title, t.priority)\n\nsorted(..., key=lambda t: PRIORITY_ORDER[t.priority]) сортує за ЧИСЛОВИМ еквівалентом пріоритету — high (0) завжди опиняється першим.",
    examples: [
      { title: "sort_by_priority() — правильний порядок важливості", code: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntasks = [Task("Buy milk"), Task("Clean house", "low"), Task("Fix bug", "high")]\n\nPRIORITY_ORDER = {"high": 0, "normal": 1, "low": 2}\n\ndef sort_by_priority(tasks):\n    return sorted(tasks, key=lambda t: PRIORITY_ORDER[t.priority])\n\nfor t in sort_by_priority(tasks):\n    print(t.title, t.priority)`, explain: "Порядок виводу: Fix bug (high), Buy milk (normal), Clean house (low) — важливе завжди першим." },
    ],
    task: `Дано tasks, PRIORITY_ORDER. Напиши sort_by_priority(tasks). Виведи title кожної задачі у відсортованому порядку.`,
    starter: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntasks = [Task("Buy milk"), Task("Clean house", "low"), Task("Fix bug", "high")]\nPRIORITY_ORDER = {"high": 0, "normal": 1, "low": 2}\n\ndef sort_by_priority(tasks):\n    # твій код тут\n    pass\n\n# for t in sort_by_priority(tasks):\n#     print(t.title, t.priority)\n`,
    hints: [`sorted(tasks, key=lambda t: ...) — потрібна функція, що перетворює задачу на число для порівняння.`, `key=lambda t: PRIORITY_ORDER[t.priority]`, `def sort_by_priority(tasks):\n    return sorted(tasks, key=lambda t: PRIORITY_ORDER[t.priority])\n\nfor t in sort_by_priority(tasks):\n    print(t.title, t.priority)`],
    solution: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntasks = [Task("Buy milk"), Task("Clean house", "low"), Task("Fix bug", "high")]\nPRIORITY_ORDER = {"high": 0, "normal": 1, "low": 2}\n\ndef sort_by_priority(tasks):\n    return sorted(tasks, key=lambda t: PRIORITY_ORDER[t.priority])\n\nfor t in sort_by_priority(tasks):\n    print(t.title, t.priority)`,
    testCode: `if "sort_by_priority" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція sort_by_priority(tasks)."}\nelse:\n    order = [t.title for t in sort_by_priority(tasks)]\n    if order != ["Fix bug", "Buy milk", "Clean house"]:\n        __result__ = {"pass": False, "message": "Порядок має бути ['Fix bug', 'Buy milk', 'Clean house'] (high, normal, low)."}\n    else:\n        __result__ = {"pass": True, "message": "PRIORITY_ORDER перетворює рядки на числа саме для того, щоб сортування мало сенс."}`,
  },
  {
    id: "py-fullproject-5",
    title: "Збереження задач у JSON-файл",
    type: "python",
    theory:
      "Об'єкти Task живуть лише в пам'яті — при закритті програми вони ЗНИКНУТЬ, якщо не зберегти на диск. Кожен Task перетворюється на словник (task_to_dict), а список словників зберігається як JSON (recap ⚙️ Automation, 🌐 API Development):\n\nimport json\n\ndef task_to_dict(task):\n    return {\"title\": task.title, \"done\": task.done, \"priority\": task.priority, \"owner\": task.owner}\n\ndef save_tasks(tasks, path):\n    with open(path, \"w\") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)\n\nsave_tasks(tasks, \"fp_tasks.json\")\nprint(open(\"fp_tasks.json\").read())",
    examples: [
      { title: "save_tasks() — стан застосунку на диску", code: `import json\n\nclass Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntasks = [Task("Buy milk"), Task("Fix bug", "high")]\n\ndef task_to_dict(task):\n    return {"title": task.title, "done": task.done, "priority": task.priority, "owner": task.owner}\n\ndef save_tasks(tasks, path):\n    with open(path, "w") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)\n\nsave_tasks(tasks, "fp_tasks.json")\nprint(open("fp_tasks.json").read())`, explain: "Список об'єктів Task стає списком JSON-словників у файлі — стан застосунку тепер переживе перезапуск." },
    ],
    task: `Дано tasks (2 задачі). Напиши task_to_dict(task) і save_tasks(tasks, path). Збережи у "fp_tasks.json" і виведи вміст файлу.`,
    starter: `import json\n\nclass Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntasks = [Task("Buy milk"), Task("Fix bug", "high")]\n\ndef task_to_dict(task):\n    # твій код тут\n    pass\n\ndef save_tasks(tasks, path):\n    # твій код тут\n    pass\n\n# save_tasks(tasks, "fp_tasks.json")\n# print(open("fp_tasks.json").read())\n`,
    hints: [`task_to_dict: return {"title": task.title, "done": task.done, "priority": task.priority, "owner": task.owner}`, `save_tasks: json.dump([task_to_dict(t) for t in tasks], f) всередині with open(path, "w") as f:`, `def task_to_dict(task):\n    return {"title": task.title, "done": task.done, "priority": task.priority, "owner": task.owner}\n\ndef save_tasks(tasks, path):\n    with open(path, "w") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)`],
    solution: `import json\n\nclass Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntasks = [Task("Buy milk"), Task("Fix bug", "high")]\n\ndef task_to_dict(task):\n    return {"title": task.title, "done": task.done, "priority": task.priority, "owner": task.owner}\n\ndef save_tasks(tasks, path):\n    with open(path, "w") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)\n\nsave_tasks(tasks, "fp_tasks.json")\nprint(open("fp_tasks.json").read())`,
    testCode: `import os, json\nif "save_tasks" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція save_tasks(tasks, path)."}\nelif not os.path.exists("fp_tasks.json"):\n    __result__ = {"pass": False, "message": "Файл fp_tasks.json має бути створений."}\nelse:\n    data = json.load(open("fp_tasks.json"))\n    if len(data) != 2 or data[0]["title"] != "Buy milk" or data[1]["priority"] != "high":\n        __result__ = {"pass": False, "message": "Збережений JSON має містити обидві задачі з правильними полями."}\n    else:\n        __result__ = {"pass": True, "message": "Стан застосунку тепер на диску — переживе перезапуск програми."}`,
  },
  {
    id: "py-fullproject-6",
    title: "Завантаження задач із JSON-файлу",
    type: "python",
    theory:
      "Зворотна операція до збереження — завантаження: прочитати JSON і перетворити КОЖЕН словник назад в об'єкт Task:\n\ndef dict_to_task(d):\n    t = Task(d[\"title\"], priority=d[\"priority\"], owner=d.get(\"owner\"))\n    t.done = d[\"done\"]\n    return t\n\ndef load_tasks(path):\n    with open(path) as f:\n        data = json.load(f)\n    return [dict_to_task(d) for d in data]\n\nloaded = load_tasks(\"fp_tasks.json\")\nprint(len(loaded), loaded[0].title, loaded[0].done)\n\nЦе повний цикл (round-trip): save_tasks() → файл → load_tasks() відновлює РІВНО ті самі дані, що були збережені.",
    examples: [
      { title: "load_tasks() — відновлення об'єктів з файлу", code: `import json\n\nclass Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ndef task_to_dict(task):\n    return {"title": task.title, "done": task.done, "priority": task.priority, "owner": task.owner}\n\ndef save_tasks(tasks, path):\n    with open(path, "w") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)\n\ntasks = [Task("Buy milk"), Task("Fix bug", "high")]\ntasks[0].done = True\nsave_tasks(tasks, "fp_tasks2.json")\n\ndef dict_to_task(d):\n    t = Task(d["title"], priority=d["priority"], owner=d.get("owner"))\n    t.done = d["done"]\n    return t\n\ndef load_tasks(path):\n    with open(path) as f:\n        data = json.load(f)\n    return [dict_to_task(d) for d in data]\n\nloaded = load_tasks("fp_tasks2.json")\nprint(len(loaded), loaded[0].title, loaded[0].done)`, explain: "loaded[0].done == True — стан ПОВНІСТЮ відновлений, включно з тим, яка задача вже виконана." },
    ],
    task: `Дано task_to_dict(), save_tasks(), tasks (перша done=True), збережені у "fp_tasks2.json" (в starter). Напиши dict_to_task(d) і load_tasks(path). Завантаж і виведи len(loaded), loaded[0].title, loaded[0].done.`,
    starter: `import json\n\nclass Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ndef task_to_dict(task):\n    return {"title": task.title, "done": task.done, "priority": task.priority, "owner": task.owner}\n\ndef save_tasks(tasks, path):\n    with open(path, "w") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)\n\ntasks = [Task("Buy milk"), Task("Fix bug", "high")]\ntasks[0].done = True\nsave_tasks(tasks, "fp_tasks2.json")\n\ndef dict_to_task(d):\n    # твій код тут\n    pass\n\ndef load_tasks(path):\n    # твій код тут\n    pass\n\n# loaded = load_tasks("fp_tasks2.json")\n# print(len(loaded), loaded[0].title, loaded[0].done)\n`,
    hints: [`dict_to_task: створи Task(d["title"], priority=d["priority"], owner=d.get("owner")), потім встанови t.done = d["done"]`, `load_tasks: прочитай JSON через json.load(f), поверни [dict_to_task(d) for d in data]`, `def dict_to_task(d):\n    t = Task(d["title"], priority=d["priority"], owner=d.get("owner"))\n    t.done = d["done"]\n    return t\n\ndef load_tasks(path):\n    with open(path) as f:\n        data = json.load(f)\n    return [dict_to_task(d) for d in data]`],
    solution: `import json\n\nclass Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ndef task_to_dict(task):\n    return {"title": task.title, "done": task.done, "priority": task.priority, "owner": task.owner}\n\ndef save_tasks(tasks, path):\n    with open(path, "w") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)\n\ntasks = [Task("Buy milk"), Task("Fix bug", "high")]\ntasks[0].done = True\nsave_tasks(tasks, "fp_tasks2.json")\n\ndef dict_to_task(d):\n    t = Task(d["title"], priority=d["priority"], owner=d.get("owner"))\n    t.done = d["done"]\n    return t\n\ndef load_tasks(path):\n    with open(path) as f:\n        data = json.load(f)\n    return [dict_to_task(d) for d in data]\n\nloaded = load_tasks("fp_tasks2.json")\nprint(len(loaded), loaded[0].title, loaded[0].done)`,
    testCode: `if "load_tasks" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція load_tasks(path)."}\nelse:\n    loaded = load_tasks("fp_tasks2.json")\n    if len(loaded) != 2 or loaded[0].title != "Buy milk" or loaded[0].done != True:\n        __result__ = {"pass": False, "message": "load_tasks() має відновити 2 задачі, перша з done=True."}\n    elif loaded[1].priority != "high":\n        __result__ = {"pass": False, "message": "Друга задача має мати priority='high', відновлений з файлу."}\n    else:\n        __result__ = {"pass": True, "message": "Повний цикл збереження й завантаження — застосунок тепер пам'ятає стан між запусками."}`,
  },
  {
    id: "py-fullproject-7",
    title: "Хешування паролів для доступу (recap Backend)",
    type: "python",
    theory:
      "Багатокористувацький застосунок потребує автентифікації. Recap з 🔧 Backend Development і 🔐 Cybersecurity: паролі НІКОЛИ не зберігають відкритим текстом — лише солоний хеш:\n\nimport hashlib\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nsalt = \"fp_fixed_salt\"\nh1 = hash_password(\"secret123\", salt)\nh2 = hash_password(\"secret123\", salt)\nprint(h1 == h2)\nprint(len(h1))",
    examples: [
      { title: "hash_password() — та сама формула, новий контекст", code: `import hashlib\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nsalt = "fp_fixed_salt"\nh1 = hash_password("secret123", salt)\nh2 = hash_password("secret123", salt)\nprint(h1 == h2)\nprint(len(h1))`, explain: "Той самий пароль і сіль завжди дають однаковий хеш (h1 == h2), довжиною 64 символи." },
    ],
    task: `Напиши hash_password(password, salt). Виведи, чи h1 (для "secret123") дорівнює h2 (для того ж пароля й солі), і довжину хешу.`,
    starter: `import hashlib\n\ndef hash_password(password, salt):\n    # твій код тут\n    pass\n\n# salt = "fp_fixed_salt"\n# h1 = hash_password("secret123", salt)\n# h2 = hash_password("secret123", salt)\n# print(h1 == h2)\n# print(len(h1))\n`,
    hints: [`Склей salt і password ПЕРЕД хешуванням.`, `return hashlib.sha256((salt + password).encode()).hexdigest()`, `def hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nsalt = "fp_fixed_salt"\nh1 = hash_password("secret123", salt)\nh2 = hash_password("secret123", salt)\nprint(h1 == h2)\nprint(len(h1))`],
    solution: `import hashlib\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nsalt = "fp_fixed_salt"\nh1 = hash_password("secret123", salt)\nh2 = hash_password("secret123", salt)\nprint(h1 == h2)\nprint(len(h1))`,
    testCode: `if "hash_password" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція hash_password(password, salt)."}\nelif hash_password("secret123", "fp_fixed_salt") != hash_password("secret123", "fp_fixed_salt"):\n    __result__ = {"pass": False, "message": "Той самий пароль і сіль мають завжди давати однаковий хеш."}\nelif len(hash_password("secret123", "fp_fixed_salt")) != 64:\n    __result__ = {"pass": False, "message": "SHA-256 хеш завжди має довжину 64 символи."}\nelse:\n    __result__ = {"pass": True, "message": "Той самий принцип хешування з 🔧 Backend Development і 🔐 Cybersecurity, застосований у новому проєкті."}`,
  },
  {
    id: "py-fullproject-8",
    title: "Реєстрація й вхід користувача",
    type: "python",
    theory:
      "register() зберігає сіль і хеш нового користувача; login() перевіряє, чи введений пароль дає ТОЙ САМИЙ хеш:\n\nusers = {}\n\ndef register(username, password):\n    salt = \"fp_fixed_salt\"\n    users[username] = {\"salt\": salt, \"hash\": hash_password(password, salt)}\n\ndef login(username, password):\n    if username not in users:\n        return False\n    u = users[username]\n    return hash_password(password, u[\"salt\"]) == u[\"hash\"]\n\nregister(\"alice\", \"secret123\")\nprint(login(\"alice\", \"secret123\"))\nprint(login(\"alice\", \"wrong\"))",
    examples: [
      { title: "register() і login() разом", code: `import hashlib\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nusers = {}\n\ndef register(username, password):\n    salt = "fp_fixed_salt"\n    users[username] = {"salt": salt, "hash": hash_password(password, salt)}\n\ndef login(username, password):\n    if username not in users:\n        return False\n    u = users[username]\n    return hash_password(password, u["salt"]) == u["hash"]\n\nregister("alice", "secret123")\nprint(login("alice", "secret123"))\nprint(login("alice", "wrong"))`, explain: "Правильний пароль → True; неправильний → False, БЕЗ жодного разу порівняння сирих паролів." },
    ],
    task: `Дано hash_password() (в starter). Напиши register(username, password) і login(username, password). Зареєструй "alice" з "secret123". Виведи login("alice", "secret123") і login("alice", "wrong").`,
    starter: `import hashlib\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nusers = {}\n\ndef register(username, password):\n    # твій код тут\n    pass\n\ndef login(username, password):\n    # твій код тут\n    pass\n\n# register("alice", "secret123")\n# print(login("alice", "secret123"))\n# print(login("alice", "wrong"))\n`,
    hints: [`register: users[username] = {"salt": salt, "hash": hash_password(password, salt)} з фіксованою сіллю.`, `login: якщо username відсутній — False; інакше порівняй hash_password(password, u["salt"]) з u["hash"].`, `def register(username, password):\n    salt = "fp_fixed_salt"\n    users[username] = {"salt": salt, "hash": hash_password(password, salt)}\n\ndef login(username, password):\n    if username not in users:\n        return False\n    u = users[username]\n    return hash_password(password, u["salt"]) == u["hash"]`],
    solution: `import hashlib\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nusers = {}\n\ndef register(username, password):\n    salt = "fp_fixed_salt"\n    users[username] = {"salt": salt, "hash": hash_password(password, salt)}\n\ndef login(username, password):\n    if username not in users:\n        return False\n    u = users[username]\n    return hash_password(password, u["salt"]) == u["hash"]\n\nregister("alice", "secret123")\nprint(login("alice", "secret123"))\nprint(login("alice", "wrong"))`,
    testCode: `if "register" not in globals() or "login" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні функції register(username, password) і login(username, password)."}\nelif login("alice", "secret123") != True:\n    __result__ = {"pass": False, "message": "login('alice', 'secret123') має бути True після register."}\nelif login("alice", "wrong") != False:\n    __result__ = {"pass": False, "message": "login('alice', 'wrong') має бути False."}\nelif login("bob", "anything") != False:\n    __result__ = {"pass": False, "message": "login() для незареєстрованого користувача має бути False, не помилка."}\nelse:\n    __result__ = {"pass": True, "message": "Реєстрація й вхід — фундамент багатокористувацького застосунку, побудований на хешуванні з 🔧 Backend."}`,
  },
  {
    id: "py-fullproject-9",
    title: "Прив'язка задач до власника",
    type: "python",
    theory:
      "У багатокористувацькому застосунку кожна задача належить КОНКРЕТНОМУ користувачу. Поле owner (уже присутнє в класі Task з 1-го уроку) заповнюється при створенні:\n\ndef create_task_for_user(manager, username, title, priority=\"normal\"):\n    task = Task(title, priority=priority, owner=username)\n    manager.add_task(task)\n    return task\n\ntask = create_task_for_user(manager, \"alice\", \"Alice's task\")\nprint(task.owner)\nprint(task in manager.tasks)",
    examples: [
      { title: "create_task_for_user() — задача з власником", code: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\n\ndef create_task_for_user(manager, username, title, priority="normal"):\n    task = Task(title, priority=priority, owner=username)\n    manager.add_task(task)\n    return task\n\ntask = create_task_for_user(manager, "alice", "Alice's task")\nprint(task.owner)\nprint(task in manager.tasks)`, explain: "task.owner == 'alice' — задача одразу прив'язана до того, хто її створив, і додана в manager.tasks." },
    ],
    task: `Дано Task, TaskManager, manager (в starter). Напиши create_task_for_user(manager, username, title, priority="normal"). Виклич для "alice" з "Alice's task". Виведи task.owner і чи task у manager.tasks.`,
    starter: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\n\ndef create_task_for_user(manager, username, title, priority="normal"):\n    # твій код тут\n    pass\n\n# task = create_task_for_user(manager, "alice", "Alice's task")\n# print(task.owner)\n# print(task in manager.tasks)\n`,
    hints: [`Створи task = Task(title, priority=priority, owner=username)`, `manager.add_task(task), потім return task`, `def create_task_for_user(manager, username, title, priority="normal"):\n    task = Task(title, priority=priority, owner=username)\n    manager.add_task(task)\n    return task`],
    solution: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\n\ndef create_task_for_user(manager, username, title, priority="normal"):\n    task = Task(title, priority=priority, owner=username)\n    manager.add_task(task)\n    return task\n\ntask = create_task_for_user(manager, "alice", "Alice's task")\nprint(task.owner)\nprint(task in manager.tasks)`,
    testCode: `if "create_task_for_user" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція create_task_for_user(manager, username, title, priority='normal')."}\nelif task.owner != "alice":\n    __result__ = {"pass": False, "message": "task.owner має бути 'alice'."}\nelif task not in manager.tasks:\n    __result__ = {"pass": False, "message": "Задача має бути додана в manager.tasks."}\nelse:\n    __result__ = {"pass": True, "message": "Кожна задача тепер знає, ХТО її створив — основа для контролю доступу в наступному уроці."}`,
  },
  {
    id: "py-fullproject-10",
    title: "Контроль доступу: лише власник редагує свою задачу",
    type: "python",
    theory:
      "Recap з 🔧 Backend Development: користувач має право редагувати ЛИШЕ СВОЮ задачу. Проста перевірка порівнює owner задачі з username, що робить запит:\n\ndef can_edit(task, username):\n    return task.owner == username\n\nprint(can_edit(task, \"alice\"))\nprint(can_edit(task, \"bob\"))\n\nЦе та сама ідея, що 401/403 у 🌐 API Development: дія дозволена ЛИШЕ якщо особа, що намагається її виконати, — саме той, хто повинен мати доступ.",
    examples: [
      { title: "can_edit() — перевірка власника", code: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntask = Task("Alice's task", owner="alice")\n\ndef can_edit(task, username):\n    return task.owner == username\n\nprint(can_edit(task, "alice"))\nprint(can_edit(task, "bob"))`, explain: "alice (власник) може редагувати (True), bob (не власник) — не може (False)." },
    ],
    task: `Дано task (owner="alice"). Напиши can_edit(task, username). Виведи can_edit(task, "alice") і can_edit(task, "bob").`,
    starter: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntask = Task("Alice's task", owner="alice")\n\ndef can_edit(task, username):\n    # твій код тут\n    pass\n\n# print(can_edit(task, "alice"))\n# print(can_edit(task, "bob"))\n`,
    hints: [`Порівняй task.owner з username.`, `return task.owner == username`, `def can_edit(task, username):\n    return task.owner == username\n\nprint(can_edit(task, "alice"))\nprint(can_edit(task, "bob"))`],
    solution: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\ntask = Task("Alice's task", owner="alice")\n\ndef can_edit(task, username):\n    return task.owner == username\n\nprint(can_edit(task, "alice"))\nprint(can_edit(task, "bob"))`,
    testCode: `if "can_edit" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція can_edit(task, username)."}\nelif can_edit(task, "alice") != True or can_edit(task, "bob") != False:\n    __result__ = {"pass": False, "message": "can_edit(task, 'alice') має бути True, can_edit(task, 'bob') — False."}\nelse:\n    __result__ = {"pass": True, "message": "Контроль доступу за власником — та сама ідея, що 401/403 у REST API, застосована до задач."}`,
  },
  {
    id: "py-fullproject-11",
    title: "Розбір команд: текстовий інтерфейс",
    type: "python",
    theory:
      "CLI-застосунок керується текстовими командами (\"add Buy milk\", \"list\", \"done 2\"). Перший крок — розбір рядка на команду й аргументи:\n\ndef parse_command(line):\n    parts = line.strip().split(\" \", 1)\n    command = parts[0]\n    args = parts[1] if len(parts) > 1 else \"\"\n    return command, args\n\nprint(parse_command(\"add Buy milk\"))\nprint(parse_command(\"list\"))\n\nsplit(\" \", 1) ділить рядок МАКСИМУМ на 2 частини — команда й УСЕ інше як аргументи (важливо, щоб \"add Buy milk\" не розбилось на 3 окремі слова).",
    examples: [
      { title: "parse_command() — команда й аргументи окремо", code: `def parse_command(line):\n    parts = line.strip().split(" ", 1)\n    command = parts[0]\n    args = parts[1] if len(parts) > 1 else ""\n    return command, args\n\nprint(parse_command("add Buy milk"))\nprint(parse_command("list"))`, explain: "('add', 'Buy milk') — команда й аргументи розділені; ('list', '') — команда без аргументів дає порожній рядок." },
    ],
    task: `Напиши parse_command(line). Виведи parse_command("add Buy milk") і parse_command("list").`,
    starter: `def parse_command(line):\n    # твій код тут\n    pass\n\n# print(parse_command("add Buy milk"))\n# print(parse_command("list"))\n`,
    hints: [`line.strip().split(" ", 1) — split з обмеженням у 1 поділ.`, `command = parts[0]; args = parts[1] if len(parts) > 1 else ""`, `def parse_command(line):\n    parts = line.strip().split(" ", 1)\n    command = parts[0]\n    args = parts[1] if len(parts) > 1 else ""\n    return command, args`],
    solution: `def parse_command(line):\n    parts = line.strip().split(" ", 1)\n    command = parts[0]\n    args = parts[1] if len(parts) > 1 else ""\n    return command, args\n\nprint(parse_command("add Buy milk"))\nprint(parse_command("list"))`,
    testCode: `if "parse_command" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція parse_command(line)."}\nelif parse_command("add Buy milk") != ("add", "Buy milk"):\n    __result__ = {"pass": False, "message": "parse_command('add Buy milk') має дати ('add', 'Buy milk')."}\nelif parse_command("list") != ("list", ""):\n    __result__ = {"pass": False, "message": "parse_command('list') має дати ('list', '')."}\nelse:\n    __result__ = {"pass": True, "message": "Розбір команд — перший крок будь-якого текстового інтерфейсу, від git до цього Task Manager."}`,
  },
  {
    id: "py-fullproject-12",
    title: "Диспетчеризація команд через словник",
    type: "python",
    theory:
      "Recap ідеї роутингу з 🌐 API Development: замість довгого ланцюжка if/elif, словник COMMANDS зіставляє назву команди з ФУНКЦІЄЮ, що її виконує:\n\ndef cmd_add(manager, args):\n    manager.add_task(Task(args))\n    return f\"Added: {args}\"\n\ndef cmd_list(manager, args):\n    return \"\\n\".join(t.title for t in manager.tasks)\n\nCOMMANDS = {\"add\": cmd_add, \"list\": cmd_list}\n\ndef execute(manager, line):\n    command, args = parse_command(line)\n    handler = COMMANDS.get(command)\n    if handler is None:\n        return f\"Unknown command: {command}\"\n    return handler(manager, args)\n\nprint(execute(manager, \"add Buy milk\"))\nprint(execute(manager, \"foo bar\"))",
    examples: [
      { title: "execute() — словник команд замість if/elif", code: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\n\ndef parse_command(line):\n    parts = line.strip().split(" ", 1)\n    return parts[0], (parts[1] if len(parts) > 1 else "")\n\ndef cmd_add(manager, args):\n    manager.add_task(Task(args))\n    return f"Added: {args}"\n\ndef cmd_list(manager, args):\n    return "\\n".join(t.title for t in manager.tasks)\n\nCOMMANDS = {"add": cmd_add, "list": cmd_list}\n\ndef execute(manager, line):\n    command, args = parse_command(line)\n    handler = COMMANDS.get(command)\n    if handler is None:\n        return f"Unknown command: {command}"\n    return handler(manager, args)\n\nprint(execute(manager, "add Buy milk"))\nprint(execute(manager, "foo bar"))`, explain: "'Added: Buy milk' для відомої команди; 'Unknown command: foo' для невідомої — точно як роутер, що не знайшов маршрут." },
    ],
    task: `Дано Task, TaskManager, manager, parse_command() (в starter). Напиши cmd_add(), cmd_list(), COMMANDS, execute(). Виведи execute(manager, "add Buy milk") і execute(manager, "foo bar").`,
    starter: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\n\ndef parse_command(line):\n    parts = line.strip().split(" ", 1)\n    return parts[0], (parts[1] if len(parts) > 1 else "")\n\ndef cmd_add(manager, args):\n    # твій код тут\n    pass\n\ndef cmd_list(manager, args):\n    # твій код тут\n    pass\n\nCOMMANDS = {"add": cmd_add, "list": cmd_list}\n\ndef execute(manager, line):\n    # твій код тут\n    pass\n\n# print(execute(manager, "add Buy milk"))\n# print(execute(manager, "foo bar"))\n`,
    hints: [`cmd_add: manager.add_task(Task(args)); return f"Added: {args}"`, `execute: command, args = parse_command(line); handler = COMMANDS.get(command); якщо None — "Unknown command: ..."; інакше handler(manager, args)`, `def execute(manager, line):\n    command, args = parse_command(line)\n    handler = COMMANDS.get(command)\n    if handler is None:\n        return f"Unknown command: {command}"\n    return handler(manager, args)`],
    solution: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\n\ndef parse_command(line):\n    parts = line.strip().split(" ", 1)\n    return parts[0], (parts[1] if len(parts) > 1 else "")\n\ndef cmd_add(manager, args):\n    manager.add_task(Task(args))\n    return f"Added: {args}"\n\ndef cmd_list(manager, args):\n    return "\\n".join(t.title for t in manager.tasks)\n\nCOMMANDS = {"add": cmd_add, "list": cmd_list}\n\ndef execute(manager, line):\n    command, args = parse_command(line)\n    handler = COMMANDS.get(command)\n    if handler is None:\n        return f"Unknown command: {command}"\n    return handler(manager, args)\n\nprint(execute(manager, "add Buy milk"))\nprint(execute(manager, "foo bar"))`,
    testCode: `if "execute" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція execute(manager, line)."}\nelif execute(manager, "add Buy milk") != "Added: Buy milk":\n    __result__ = {"pass": False, "message": "execute(manager, 'add Buy milk') має дати 'Added: Buy milk'."}\nelif execute(manager, "foo bar") != "Unknown command: foo":\n    __result__ = {"pass": False, "message": "execute(manager, 'foo bar') має дати 'Unknown command: foo'."}\nelse:\n    __result__ = {"pass": True, "message": "Словник команд — та сама ідея роутингу з 🌐 API Development, застосована до текстового інтерфейсу."}`,
  },
  {
    id: "py-fullproject-13",
    title: "Обробка помилок: неіснуючий ID задачі",
    type: "python",
    theory:
      "Команда \"done 5\" впаде з IndexError, якщо задачі з індексом 5 не існує, або з ValueError, якщо аргумент — не число. Recap try/except з 🔐 Cybersecurity: перетворюємо технічну помилку на ЗРОЗУМІЛЕ повідомлення:\n\ndef cmd_done(manager, args):\n    try:\n        idx = int(args)\n        manager.tasks[idx].toggle()\n        return f\"Toggled task {idx}\"\n    except (ValueError, IndexError):\n        return \"Error: invalid task id\"\n\nprint(cmd_done(manager, \"0\"))\nprint(cmd_done(manager, \"999\"))\nprint(cmd_done(manager, \"abc\"))",
    examples: [
      { title: "cmd_done() — обробка двох різних помилок разом", code: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n    def toggle(self):\n        self.done = not self.done\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\nmanager.add_task(Task("Test"))\n\ndef cmd_done(manager, args):\n    try:\n        idx = int(args)\n        manager.tasks[idx].toggle()\n        return f"Toggled task {idx}"\n    except (ValueError, IndexError):\n        return "Error: invalid task id"\n\nprint(cmd_done(manager, "0"))\nprint(cmd_done(manager, "999"))\nprint(cmd_done(manager, "abc"))`, explain: "'0' успішно перемикає задачу; '999' (IndexError) і 'abc' (ValueError) ОБИДВА дають однакове зрозуміле повідомлення про помилку." },
    ],
    task: `Дано Task, TaskManager, manager з однією задачею (в starter). Напиши cmd_done(manager, args) за логікою вище. Виведи результат для "0", "999" і "abc".`,
    starter: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n    def toggle(self):\n        self.done = not self.done\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\nmanager.add_task(Task("Test"))\n\ndef cmd_done(manager, args):\n    # твій код тут\n    pass\n\n# print(cmd_done(manager, "0"))\n# print(cmd_done(manager, "999"))\n# print(cmd_done(manager, "abc"))\n`,
    hints: [`try: idx = int(args); manager.tasks[idx].toggle(); return f"Toggled task {idx}"`, `except (ValueError, IndexError): return "Error: invalid task id" — обидва типи помилок в ОДНОМУ except.`, `def cmd_done(manager, args):\n    try:\n        idx = int(args)\n        manager.tasks[idx].toggle()\n        return f"Toggled task {idx}"\n    except (ValueError, IndexError):\n        return "Error: invalid task id"`],
    solution: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n    def toggle(self):\n        self.done = not self.done\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\nmanager.add_task(Task("Test"))\n\ndef cmd_done(manager, args):\n    try:\n        idx = int(args)\n        manager.tasks[idx].toggle()\n        return f"Toggled task {idx}"\n    except (ValueError, IndexError):\n        return "Error: invalid task id"\n\nprint(cmd_done(manager, "0"))\nprint(cmd_done(manager, "999"))\nprint(cmd_done(manager, "abc"))`,
    testCode: `if "cmd_done" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція cmd_done(manager, args)."}\nelif cmd_done(manager, "999") != "Error: invalid task id":\n    __result__ = {"pass": False, "message": "cmd_done(manager, '999') (IndexError) має дати 'Error: invalid task id'."}\nelif cmd_done(manager, "abc") != "Error: invalid task id":\n    __result__ = {"pass": False, "message": "cmd_done(manager, 'abc') (ValueError) має дати ТЕ САМЕ повідомлення."}\nelse:\n    __result__ = {"pass": True, "message": "Обидва типи помилок дають ОДНЕ зрозуміле повідомлення — користувачу байдуже, ValueError це чи IndexError."}`,
  },
  {
    id: "py-fullproject-14",
    title: "Журналювання дій користувача",
    type: "python",
    theory:
      "Recap журналювання з 🧰 DevOps і 🔐 Cybersecurity: кожна дія користувача (додав задачу, виконав команду) записується в журнал — корисно для відлагодження й аудиту:\n\naction_log = []\n\ndef log_action(username, action):\n    action_log.append(f\"{username}: {action}\")\n\nlog_action(\"alice\", \"added task 'Buy milk'\")\nlog_action(\"bob\", \"completed task 2\")\n\nfor entry in action_log:\n    print(entry)",
    examples: [
      { title: "log_action() — журнал дій", code: `action_log = []\n\ndef log_action(username, action):\n    action_log.append(f"{username}: {action}")\n\nlog_action("alice", "added task 'Buy milk'")\nlog_action("bob", "completed task 2")\n\nfor entry in action_log:\n    print(entry)`, explain: "Кожен запис показує ХТО й ЩО зробив — журнал, готовий для перегляду адміністратором." },
    ],
    task: `Напиши log_action(username, action). Запиши дві дії: "alice" додала задачу, "bob" виконав задачу 2. Виведи весь журнал.`,
    starter: `action_log = []\n\ndef log_action(username, action):\n    # твій код тут\n    pass\n\n# log_action("alice", "added task 'Buy milk'")\n# log_action("bob", "completed task 2")\n\n# for entry in action_log:\n#     print(entry)\n`,
    hints: [`action_log.append(f"{username}: {action}")`, `Формат: "ім'я: дія"`, `def log_action(username, action):\n    action_log.append(f"{username}: {action}")\n\nlog_action("alice", "added task 'Buy milk'")\nlog_action("bob", "completed task 2")\n\nfor entry in action_log:\n    print(entry)`],
    solution: `action_log = []\n\ndef log_action(username, action):\n    action_log.append(f"{username}: {action}")\n\nlog_action("alice", "added task 'Buy milk'")\nlog_action("bob", "completed task 2")\n\nfor entry in action_log:\n    print(entry)`,
    testCode: `if "log_action" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція log_action(username, action)."}\nelif len(action_log) != 2 or "alice" not in action_log[0] or "bob" not in action_log[1]:\n    __result__ = {"pass": False, "message": "action_log має містити 2 записи: перший про alice, другий про bob."}\nelif not any("alice" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи весь журнал через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Журнал дій — той самий принцип з 🧰 DevOps, застосований до дій користувачів застосунку."}`,
  },
  {
    id: "py-fullproject-15",
    title: "Статистика виконання задач",
    type: "python",
    theory:
      "Recap статистики з 📊 Data Analysis: скільки задач виконано, скільки залишилось, і який відсоток прогресу:\n\ndef completion_stats(tasks):\n    total = len(tasks)\n    done = sum(1 for t in tasks if t.done)\n    percent = (done / total * 100) if total else 0\n    return {\"total\": total, \"done\": done, \"percent\": percent}\n\nprint(completion_stats(manager.tasks))\n\nПеревірка if total else 0 захищає від ділення на нуль, якщо задач взагалі немає — базовий, але важливий крайовий випадок.",
    examples: [
      { title: "completion_stats() — прогрес у цифрах", code: `class Task:\n    def __init__(self, title):\n        self.title, self.done = title, False\n\ntasks = [Task("a"), Task("b"), Task("c"), Task("d")]\ntasks[0].done = True\ntasks[1].done = True\n\ndef completion_stats(tasks):\n    total = len(tasks)\n    done = sum(1 for t in tasks if t.done)\n    percent = (done / total * 100) if total else 0\n    return {"total": total, "done": done, "percent": percent}\n\nprint(completion_stats(tasks))`, explain: "{'total': 4, 'done': 2, 'percent': 50.0} — половина задач виконана." },
    ],
    task: `Дано tasks (4 задачі, 2 done=True). Напиши completion_stats(tasks). Виведи результат.`,
    starter: `class Task:\n    def __init__(self, title):\n        self.title, self.done = title, False\n\ntasks = [Task("a"), Task("b"), Task("c"), Task("d")]\ntasks[0].done = True\ntasks[1].done = True\n\ndef completion_stats(tasks):\n    # твій код тут\n    pass\n\n# print(completion_stats(tasks))\n`,
    hints: [`total = len(tasks); done = sum(1 for t in tasks if t.done)`, `percent = (done / total * 100) if total else 0 — захист від ділення на нуль.`, `def completion_stats(tasks):\n    total = len(tasks)\n    done = sum(1 for t in tasks if t.done)\n    percent = (done / total * 100) if total else 0\n    return {"total": total, "done": done, "percent": percent}`],
    solution: `class Task:\n    def __init__(self, title):\n        self.title, self.done = title, False\n\ntasks = [Task("a"), Task("b"), Task("c"), Task("d")]\ntasks[0].done = True\ntasks[1].done = True\n\ndef completion_stats(tasks):\n    total = len(tasks)\n    done = sum(1 for t in tasks if t.done)\n    percent = (done / total * 100) if total else 0\n    return {"total": total, "done": done, "percent": percent}\n\nprint(completion_stats(tasks))`,
    testCode: `if "completion_stats" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція completion_stats(tasks)."}\nelif completion_stats(tasks) != {"total": 4, "done": 2, "percent": 50.0}:\n    __result__ = {"pass": False, "message": "completion_stats(tasks) має дати {'total': 4, 'done': 2, 'percent': 50.0}."}\nelif completion_stats([]) != {"total": 0, "done": 0, "percent": 0}:\n    __result__ = {"pass": False, "message": "completion_stats([]) має обробити порожній список без помилки ділення на нуль."}\nelse:\n    __result__ = {"pass": True, "message": "Статистика прогресу — той самий принцип з 📊 Data Analysis, застосований до задач користувача."}`,
  },
  {
    id: "py-fullproject-16",
    title: "Пошук прострочених нагадувань за датою",
    type: "python",
    theory:
      "Recap datetime з ⚙️ Automation: нагадування з датою виконання (due) вважається простроченим, якщо ця дата в МИНУЛОМУ відносно сьогодні:\n\nfrom datetime import date\n\ndef find_overdue(reminders, today):\n    today_obj = date.fromisoformat(today)\n    return [r[\"title\"] for r in reminders if date.fromisoformat(r[\"due\"]) < today_obj]\n\nreminders = [\n    {\"title\": \"Pay rent\", \"due\": \"2024-01-01\"},\n    {\"title\": \"Renew license\", \"due\": \"2030-01-01\"},\n]\n\nprint(find_overdue(reminders, \"2025-01-01\"))\n\ndate.fromisoformat() перетворює рядок \"РРРР-ММ-ДД\" на порівнюваний об'єкт дати — порівняння дат рядками напряму дало б хибний результат для деяких форматів.",
    examples: [
      { title: "find_overdue() — дати в минулому", code: `from datetime import date\n\nreminders = [\n    {"title": "Pay rent", "due": "2024-01-01"},\n    {"title": "Renew license", "due": "2030-01-01"},\n]\n\ndef find_overdue(reminders, today):\n    today_obj = date.fromisoformat(today)\n    return [r["title"] for r in reminders if date.fromisoformat(r["due"]) < today_obj]\n\nprint(find_overdue(reminders, "2025-01-01"))`, explain: "Лише 'Pay rent' (due 2024) прострочене відносно 2025 — 'Renew license' (due 2030) ще ні." },
    ],
    task: `Дано reminders. Напиши find_overdue(reminders, today). Виведи find_overdue(reminders, "2025-01-01").`,
    starter: `from datetime import date\n\nreminders = [\n    {"title": "Pay rent", "due": "2024-01-01"},\n    {"title": "Renew license", "due": "2030-01-01"},\n]\n\ndef find_overdue(reminders, today):\n    # твій код тут\n    pass\n\n# print(find_overdue(reminders, "2025-01-01"))\n`,
    hints: [`today_obj = date.fromisoformat(today)`, `[r["title"] for r in reminders if date.fromisoformat(r["due"]) < today_obj]`, `def find_overdue(reminders, today):\n    today_obj = date.fromisoformat(today)\n    return [r["title"] for r in reminders if date.fromisoformat(r["due"]) < today_obj]`],
    solution: `from datetime import date\n\nreminders = [\n    {"title": "Pay rent", "due": "2024-01-01"},\n    {"title": "Renew license", "due": "2030-01-01"},\n]\n\ndef find_overdue(reminders, today):\n    today_obj = date.fromisoformat(today)\n    return [r["title"] for r in reminders if date.fromisoformat(r["due"]) < today_obj]\n\nprint(find_overdue(reminders, "2025-01-01"))`,
    testCode: `if "find_overdue" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція find_overdue(reminders, today)."}\nelif find_overdue(reminders, "2025-01-01") != ["Pay rent"]:\n    __result__ = {"pass": False, "message": "find_overdue(reminders, '2025-01-01') має дати ['Pay rent']."}\nelse:\n    __result__ = {"pass": True, "message": "Порівняння дат через date.fromisoformat() — надійніше за порівняння рядків напряму."}`,
  },
  {
    id: "py-fullproject-17",
    title: "Резервна копія перед збереженням (recap DevOps)",
    type: "python",
    theory:
      "Recap 🧰 DevOps: ПЕРЕД перезаписом файлу задач роби резервну копію старої версії — якщо нова версія містить помилку, стару завжди можна відновити:\n\nimport os, shutil\n\ndef backup_and_save(tasks, path, backup_dir):\n    if os.path.exists(path):\n        os.makedirs(backup_dir, exist_ok=True)\n        shutil.copy(path, f\"{backup_dir}/{os.path.basename(path)}.bak\")\n    save_tasks(tasks, path)\n\nbackup_and_save(manager.tasks, \"fp_tasks3.json\", \"fp_backups\")\nprint(os.path.exists(\"fp_backups/fp_tasks3.json.bak\"))",
    examples: [
      { title: "backup_and_save() — безпечний перезапис", code: `import os, shutil, json\n\nclass Task:\n    def __init__(self, title):\n        self.title, self.done = title, False\n\ndef task_to_dict(task):\n    return {"title": task.title, "done": task.done}\n\ndef save_tasks(tasks, path):\n    with open(path, "w") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)\n\ndef backup_and_save(tasks, path, backup_dir):\n    if os.path.exists(path):\n        os.makedirs(backup_dir, exist_ok=True)\n        shutil.copy(path, f"{backup_dir}/{os.path.basename(path)}.bak")\n    save_tasks(tasks, path)\n\nsave_tasks([Task("old task")], "fp_tasks3.json")\nbackup_and_save([Task("old task"), Task("new task")], "fp_tasks3.json", "fp_backups")\nprint(os.path.exists("fp_backups/fp_tasks3.json.bak"))`, explain: "Стара версія (з однією задачею) збережена в fp_backups/, перш ніж новий вміст (з двома задачами) перезаписав оригінал." },
    ],
    task: `Дано task_to_dict(), save_tasks() (в starter). Створи "fp_tasks3.json" з однією задачею. Напиши backup_and_save(tasks, path, backup_dir). Виклич з новим списком задач. Виведи, чи бекап існує.`,
    starter: `import os, shutil, json\n\nclass Task:\n    def __init__(self, title):\n        self.title, self.done = title, False\n\ndef task_to_dict(task):\n    return {"title": task.title, "done": task.done}\n\ndef save_tasks(tasks, path):\n    with open(path, "w") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)\n\nsave_tasks([Task("old task")], "fp_tasks3.json")\n\ndef backup_and_save(tasks, path, backup_dir):\n    # твій код тут\n    pass\n\n# backup_and_save([Task("old task"), Task("new task")], "fp_tasks3.json", "fp_backups")\n# print(os.path.exists("fp_backups/fp_tasks3.json.bak"))\n`,
    hints: [`if os.path.exists(path): зроби бекап ПЕРЕД перезаписом.`, `os.makedirs(backup_dir, exist_ok=True); shutil.copy(path, f"{backup_dir}/{os.path.basename(path)}.bak"); потім save_tasks(tasks, path)`, `def backup_and_save(tasks, path, backup_dir):\n    if os.path.exists(path):\n        os.makedirs(backup_dir, exist_ok=True)\n        shutil.copy(path, f"{backup_dir}/{os.path.basename(path)}.bak")\n    save_tasks(tasks, path)`],
    solution: `import os, shutil, json\n\nclass Task:\n    def __init__(self, title):\n        self.title, self.done = title, False\n\ndef task_to_dict(task):\n    return {"title": task.title, "done": task.done}\n\ndef save_tasks(tasks, path):\n    with open(path, "w") as f:\n        json.dump([task_to_dict(t) for t in tasks], f)\n\nsave_tasks([Task("old task")], "fp_tasks3.json")\n\ndef backup_and_save(tasks, path, backup_dir):\n    if os.path.exists(path):\n        os.makedirs(backup_dir, exist_ok=True)\n        shutil.copy(path, f"{backup_dir}/{os.path.basename(path)}.bak")\n    save_tasks(tasks, path)\n\nbackup_and_save([Task("old task"), Task("new task")], "fp_tasks3.json", "fp_backups")\nprint(os.path.exists("fp_backups/fp_tasks3.json.bak"))`,
    testCode: `import os, json\nif "backup_and_save" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція backup_and_save(tasks, path, backup_dir)."}\nelif not os.path.exists("fp_backups/fp_tasks3.json.bak"):\n    __result__ = {"pass": False, "message": "Резервна копія fp_backups/fp_tasks3.json.bak має бути створена."}\nelse:\n    backup_data = json.load(open("fp_backups/fp_tasks3.json.bak"))\n    current_data = json.load(open("fp_tasks3.json"))\n    if len(backup_data) != 1 or len(current_data) != 2:\n        __result__ = {"pass": False, "message": "Бекап має містити СТАРУ версію (1 задача), поточний файл — НОВУ (2 задачі)."}\n    else:\n        __result__ = {"pass": True, "message": "Резервна копія робиться ПЕРЕД перезаписом — стару версію завжди можна відновити."}`,
  },
  {
    id: "py-fullproject-18",
    title: "Агрегований звіт по кількох користувачах",
    type: "python",
    theory:
      "У багатокористувацькому застосунку кожен користувач має СВІЙ TaskManager. Агрегований звіт застосовує completion_stats() до КОЖНОГО користувача окремо:\n\ndef aggregate_report(managers):\n    return {user: completion_stats(m.tasks) for user, m in managers.items()}\n\nmanagers = {\"alice\": tm_alice, \"bob\": tm_bob}\nprint(aggregate_report(managers))\n\nDictionary comprehension {user: ... for user, m in managers.items()} будує ЗВІТ по кожному користувачу за ОДИН прохід, без ручних циклів.",
    examples: [
      { title: "aggregate_report() — статистика по всіх користувачах", code: `class Task:\n    def __init__(self, title):\n        self.title, self.done = title, False\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\ndef completion_stats(tasks):\n    total = len(tasks)\n    done = sum(1 for t in tasks if t.done)\n    percent = (done / total * 100) if total else 0\n    return {"total": total, "done": done, "percent": percent}\n\ntm_alice = TaskManager()\ntm_alice.add_task(Task("a1"))\ntm_alice.add_task(Task("a2"))\ntm_alice.tasks[0].done = True\n\ntm_bob = TaskManager()\ntm_bob.add_task(Task("b1"))\n\ndef aggregate_report(managers):\n    return {user: completion_stats(m.tasks) for user, m in managers.items()}\n\nmanagers = {"alice": tm_alice, "bob": tm_bob}\nprint(aggregate_report(managers))`, explain: "alice: 50% (1 з 2), bob: 0% (0 з 1) — один звіт показує прогрес усіх користувачів одразу." },
    ],
    task: `Дано completion_stats(), tm_alice, tm_bob, managers (в starter). Напиши aggregate_report(managers). Виведи результат.`,
    starter: `class Task:\n    def __init__(self, title):\n        self.title, self.done = title, False\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\ndef completion_stats(tasks):\n    total = len(tasks)\n    done = sum(1 for t in tasks if t.done)\n    percent = (done / total * 100) if total else 0\n    return {"total": total, "done": done, "percent": percent}\n\ntm_alice = TaskManager()\ntm_alice.add_task(Task("a1"))\ntm_alice.add_task(Task("a2"))\ntm_alice.tasks[0].done = True\n\ntm_bob = TaskManager()\ntm_bob.add_task(Task("b1"))\n\nmanagers = {"alice": tm_alice, "bob": tm_bob}\n\ndef aggregate_report(managers):\n    # твій код тут\n    pass\n\n# print(aggregate_report(managers))\n`,
    hints: [`{user: ... for user, m in managers.items()} — dictionary comprehension по словнику managers.`, `return {user: completion_stats(m.tasks) for user, m in managers.items()}`, `def aggregate_report(managers):\n    return {user: completion_stats(m.tasks) for user, m in managers.items()}`],
    solution: `class Task:\n    def __init__(self, title):\n        self.title, self.done = title, False\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\ndef completion_stats(tasks):\n    total = len(tasks)\n    done = sum(1 for t in tasks if t.done)\n    percent = (done / total * 100) if total else 0\n    return {"total": total, "done": done, "percent": percent}\n\ntm_alice = TaskManager()\ntm_alice.add_task(Task("a1"))\ntm_alice.add_task(Task("a2"))\ntm_alice.tasks[0].done = True\n\ntm_bob = TaskManager()\ntm_bob.add_task(Task("b1"))\n\nmanagers = {"alice": tm_alice, "bob": tm_bob}\n\ndef aggregate_report(managers):\n    return {user: completion_stats(m.tasks) for user, m in managers.items()}\n\nprint(aggregate_report(managers))`,
    testCode: `if "aggregate_report" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція aggregate_report(managers)."}\nelse:\n    report = aggregate_report(managers)\n    if report["alice"]["percent"] != 50.0 or report["bob"]["percent"] != 0.0:\n        __result__ = {"pass": False, "message": "report['alice']['percent'] має бути 50.0, report['bob']['percent'] — 0.0."}\n    else:\n        __result__ = {"pass": True, "message": "Агрегований звіт по всіх користувачах одним викликом — так адміністратор бачить всю систему одразу."}`,
  },
  {
    id: "py-fullproject-19",
    title: "Інтеграційний тест: усе разом",
    type: "python",
    theory:
      "Останній крок ПЕРЕД фінальним проєктом — переконатись, що ВСІ частини (реєстрація, вхід, задачі з власником, команди) працюють РАЗОМ як єдиний потік, а не лише окремо:\n\nregister(\"carol\", \"pass123\")\nassert login(\"carol\", \"pass123\") == True\n\nmanager = TaskManager()\ntask = create_task_for_user(manager, \"carol\", \"Integration test task\")\nassert can_edit(task, \"carol\") == True\nassert can_edit(task, \"mallory\") == False\n\nresult = execute(manager, \"add Another task\")\nprint(result)\nprint(len(manager.tasks))",
    examples: [
      { title: "Повний потік від реєстрації до команди", code: `import hashlib\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nusers = {}\ndef register(username, password):\n    salt = "fp_fixed_salt"\n    users[username] = {"salt": salt, "hash": hash_password(password, salt)}\ndef login(username, password):\n    if username not in users:\n        return False\n    u = users[username]\n    return hash_password(password, u["salt"]) == u["hash"]\n\nclass Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\ndef create_task_for_user(manager, username, title, priority="normal"):\n    task = Task(title, priority=priority, owner=username)\n    manager.add_task(task)\n    return task\n\ndef can_edit(task, username):\n    return task.owner == username\n\ndef parse_command(line):\n    parts = line.strip().split(" ", 1)\n    return parts[0], (parts[1] if len(parts) > 1 else "")\n\ndef cmd_add(manager, args):\n    manager.add_task(Task(args))\n    return f"Added: {args}"\n\nCOMMANDS = {"add": cmd_add}\ndef execute(manager, line):\n    command, args = parse_command(line)\n    handler = COMMANDS.get(command)\n    return handler(manager, args) if handler else f"Unknown command: {command}"\n\nregister("carol", "pass123")\nassert login("carol", "pass123") == True\n\nmanager = TaskManager()\ntask = create_task_for_user(manager, "carol", "Integration test task")\nassert can_edit(task, "carol") == True\nassert can_edit(task, "mallory") == False\n\nresult = execute(manager, "add Another task")\nprint(result)\nprint(len(manager.tasks))`, explain: "Усі assert проходять БЕЗ помилок, а потім execute() успішно додає ще одну задачу — весь ланцюжок працює як одне ціле." },
    ],
    task: `Дано register(), login(), Task, TaskManager, create_task_for_user(), can_edit(), execute() (усе в starter). Виконай повний потік: зареєструй "carol", перевір вхід, створи задачу, перевір права доступу, виконай команду "add Another task". Виведи результат execute() і len(manager.tasks).`,
    starter: `import hashlib\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nusers = {}\ndef register(username, password):\n    salt = "fp_fixed_salt"\n    users[username] = {"salt": salt, "hash": hash_password(password, salt)}\ndef login(username, password):\n    if username not in users:\n        return False\n    u = users[username]\n    return hash_password(password, u["salt"]) == u["hash"]\n\nclass Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\ndef create_task_for_user(manager, username, title, priority="normal"):\n    task = Task(title, priority=priority, owner=username)\n    manager.add_task(task)\n    return task\n\ndef can_edit(task, username):\n    return task.owner == username\n\ndef parse_command(line):\n    parts = line.strip().split(" ", 1)\n    return parts[0], (parts[1] if len(parts) > 1 else "")\n\ndef cmd_add(manager, args):\n    manager.add_task(Task(args))\n    return f"Added: {args}"\n\nCOMMANDS = {"add": cmd_add}\ndef execute(manager, line):\n    command, args = parse_command(line)\n    handler = COMMANDS.get(command)\n    return handler(manager, args) if handler else f"Unknown command: {command}"\n\n# register("carol", "pass123")\n# assert login("carol", "pass123") == True\n\n# manager = TaskManager()\n# task = create_task_for_user(manager, "carol", "Integration test task")\n# assert can_edit(task, "carol") == True\n# assert can_edit(task, "mallory") == False\n\n# result = execute(manager, "add Another task")\n# print(result)\n# print(len(manager.tasks))\n`,
    hints: [`Виконуй КРОК ЗА КРОКОМ, точно як у прикладі: register → login → create_task_for_user → can_edit → execute.`, `assert перевіряє умову і зупиняє програму з помилкою, якщо вона хибна — корисно для перевірки припущень.`, `register("carol", "pass123")\nassert login("carol", "pass123") == True\n\nmanager = TaskManager()\ntask = create_task_for_user(manager, "carol", "Integration test task")\nassert can_edit(task, "carol") == True\nassert can_edit(task, "mallory") == False\n\nresult = execute(manager, "add Another task")\nprint(result)\nprint(len(manager.tasks))`],
    solution: `import hashlib\n\ndef hash_password(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nusers = {}\ndef register(username, password):\n    salt = "fp_fixed_salt"\n    users[username] = {"salt": salt, "hash": hash_password(password, salt)}\ndef login(username, password):\n    if username not in users:\n        return False\n    u = users[username]\n    return hash_password(password, u["salt"]) == u["hash"]\n\nclass Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\ndef create_task_for_user(manager, username, title, priority="normal"):\n    task = Task(title, priority=priority, owner=username)\n    manager.add_task(task)\n    return task\n\ndef can_edit(task, username):\n    return task.owner == username\n\ndef parse_command(line):\n    parts = line.strip().split(" ", 1)\n    return parts[0], (parts[1] if len(parts) > 1 else "")\n\ndef cmd_add(manager, args):\n    manager.add_task(Task(args))\n    return f"Added: {args}"\n\nCOMMANDS = {"add": cmd_add}\ndef execute(manager, line):\n    command, args = parse_command(line)\n    handler = COMMANDS.get(command)\n    return handler(manager, args) if handler else f"Unknown command: {command}"\n\nregister("carol", "pass123")\nassert login("carol", "pass123") == True\n\nmanager = TaskManager()\ntask = create_task_for_user(manager, "carol", "Integration test task")\nassert can_edit(task, "carol") == True\nassert can_edit(task, "mallory") == False\n\nresult = execute(manager, "add Another task")\nprint(result)\nprint(len(manager.tasks))`,
    testCode: `if "manager" not in globals() or len(manager.tasks) != 2:\n    __result__ = {"pass": False, "message": "manager.tasks має містити 2 задачі (Integration test task + Another task)."}\nelif not any("Added: Another task" in l for l in __logs):\n    __result__ = {"pass": False, "message": "execute() має вивести 'Added: Another task'."}\nelse:\n    __result__ = {"pass": True, "message": "Весь ланцюжок — реєстрація, вхід, задачі, права доступу, команди — працює РАЗОМ як єдиний застосунок."}`,
  },
  {
    id: "py-fullproject-20",
    title: "Фінальний проєкт: task_manager_app.py",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків (і, по суті, з усіх 16 напрямків Python) у task_manager_app.py: класи, збереження, автентифікація, команди, статистика й резервні копії РАЗОМ. Це і є застосунок, обіцяний ще на вступній сторінці «Що це?» — і кінець усього шляху Python у цій платформі.\n\nВід 🐍 Python Core до цього моменту: кожен напрямок додав СВІЙ прийом — і в цьому фінальному проєкті вони всі працюють РАЗОМ, в одному застосунку, точно так, як в реальній роботі розробника.",
    examples: [
      { title: "Повний цикл застосунку в одному виклику", code: `def run_session(manager, username, commands):\n    log = []\n    for line in commands:\n        result = execute(manager, line)\n        log.append(result)\n        log_action(username, line)\n    return log\n\nsession_log = run_session(manager, "carol", ["add Task A", "add Task B", "list"])\nfor line in session_log:\n    print(line)`, explain: "Один виклик run_session() виконує ЦІЛУ послідовність команд, логуючи кожну дію — так виглядав би реальний CLI-сеанс." },
    ],
    task: `Дано execute(), log_action(), manager, COMMANDS (з cmd_add і cmd_list) (усе в starter). Напиши run_session(manager, username, commands), що виконує кожну команду через execute(), логує її через log_action(), і повертає список результатів. Виклич з commands = ["add Task A", "add Task B", "list"]. Виведи весь session_log.`,
    starter: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\naction_log = []\n\ndef log_action(username, action):\n    action_log.append(f"{username}: {action}")\n\ndef parse_command(line):\n    parts = line.strip().split(" ", 1)\n    return parts[0], (parts[1] if len(parts) > 1 else "")\n\ndef cmd_add(manager, args):\n    manager.add_task(Task(args))\n    return f"Added: {args}"\n\ndef cmd_list(manager, args):\n    return "\\n".join(t.title for t in manager.tasks)\n\nCOMMANDS = {"add": cmd_add, "list": cmd_list}\n\ndef execute(manager, line):\n    command, args = parse_command(line)\n    handler = COMMANDS.get(command)\n    return handler(manager, args) if handler else f"Unknown command: {command}"\n\ndef run_session(manager, username, commands):\n    # твій код тут\n    pass\n\n# session_log = run_session(manager, "carol", ["add Task A", "add Task B", "list"])\n# for line in session_log:\n#     print(line)\n`,
    hints: [`log = []; для кожного line у commands: result = execute(manager, line); log.append(result); log_action(username, line)`, `Поверни log після циклу.`, `def run_session(manager, username, commands):\n    log = []\n    for line in commands:\n        result = execute(manager, line)\n        log.append(result)\n        log_action(username, line)\n    return log`],
    solution: `class Task:\n    def __init__(self, title, priority="normal", owner=None):\n        self.title, self.done, self.priority, self.owner = title, False, priority, owner\n\nclass TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, task):\n        self.tasks.append(task)\n\nmanager = TaskManager()\naction_log = []\n\ndef log_action(username, action):\n    action_log.append(f"{username}: {action}")\n\ndef parse_command(line):\n    parts = line.strip().split(" ", 1)\n    return parts[0], (parts[1] if len(parts) > 1 else "")\n\ndef cmd_add(manager, args):\n    manager.add_task(Task(args))\n    return f"Added: {args}"\n\ndef cmd_list(manager, args):\n    return "\\n".join(t.title for t in manager.tasks)\n\nCOMMANDS = {"add": cmd_add, "list": cmd_list}\n\ndef execute(manager, line):\n    command, args = parse_command(line)\n    handler = COMMANDS.get(command)\n    return handler(manager, args) if handler else f"Unknown command: {command}"\n\ndef run_session(manager, username, commands):\n    log = []\n    for line in commands:\n        result = execute(manager, line)\n        log.append(result)\n        log_action(username, line)\n    return log\n\nsession_log = run_session(manager, "carol", ["add Task A", "add Task B", "list"])\nfor line in session_log:\n    print(line)`,
    testCode: `if "run_session" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція run_session(manager, username, commands)."}\nelse:\n    if len(session_log) != 3 or session_log[0] != "Added: Task A" or "Task A" not in session_log[2]:\n        __result__ = {"pass": False, "message": "session_log має містити 3 результати, останній (list) — включати назви обох задач."}\n    elif len(action_log) != 3:\n        __result__ = {"pass": False, "message": "action_log має містити запис про кожну з 3 виконаних команд."}\n    else:\n        __result__ = {"pass": True, "message": "Готово! Класи, збереження, автентифікація, команди, статистика й бекапи — 16 напрямків Python об'єднані в один робочий застосунок."}`,
    finalProject: {
      techs: ["Python 3", "json", "hashlib", "os", "shutil", "datetime"],
      skills: [
        "ООП: класи Task і TaskManager з поведінкою й станом",
        "Персистентність: збереження/завантаження стану через JSON",
        "Автентифікація: реєстрація й вхід через солоне хешування",
        "Контроль доступу: перевірка власника перед редагуванням",
        "Командний інтерфейс: розбір і диспетчеризація команд через словник",
        "Операційна зрілість: журналювання, статистика, резервні копії",
      ],
      structure:
        "task_manager_app.py\n  ├── Task, TaskManager                # ООП-ядро застосунку\n  ├── save_tasks(...) / load_tasks(...)   # персистентність у JSON\n  ├── register(...) / login(...)            # автентифікація\n  ├── COMMANDS + execute(...)                 # командний інтерфейс\n  └── completion_stats(...) / backup_and_save(...)  # звітність і безпека даних",
      code: `import hashlib
import json
import os
import shutil


class Task:
    def __init__(self, title, priority="normal", owner=None):
        self.title = title
        self.done = False
        self.priority = priority
        self.owner = owner

    def toggle(self):
        self.done = not self.done


class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, task):
        self.tasks.append(task)


def task_to_dict(task):
    return {"title": task.title, "done": task.done, "priority": task.priority, "owner": task.owner}


def dict_to_task(d):
    t = Task(d["title"], priority=d["priority"], owner=d.get("owner"))
    t.done = d["done"]
    return t


def save_tasks(tasks, path):
    with open(path, "w") as f:
        json.dump([task_to_dict(t) for t in tasks], f)


def load_tasks(path):
    if not os.path.exists(path):
        return []
    with open(path) as f:
        return [dict_to_task(d) for d in json.load(f)]


def backup_and_save(tasks, path, backup_dir="backups"):
    if os.path.exists(path):
        os.makedirs(backup_dir, exist_ok=True)
        shutil.copy(path, f"{backup_dir}/{os.path.basename(path)}.bak")
    save_tasks(tasks, path)


users = {}


def hash_password(password, salt):
    return hashlib.sha256((salt + password).encode()).hexdigest()


def register(username, password):
    salt = os.urandom(8).hex()
    users[username] = {"salt": salt, "hash": hash_password(password, salt)}


def login(username, password):
    u = users.get(username)
    return u is not None and hash_password(password, u["salt"]) == u["hash"]


def can_edit(task, username):
    return task.owner == username


def completion_stats(tasks):
    total = len(tasks)
    done = sum(1 for t in tasks if t.done)
    return {"total": total, "done": done, "percent": (done / total * 100) if total else 0}


def parse_command(line):
    parts = line.strip().split(" ", 1)
    return parts[0], (parts[1] if len(parts) > 1 else "")


def cmd_add(manager, args, username):
    manager.add_task(Task(args, owner=username))
    return f"Added: {args}"


def cmd_list(manager, args, username):
    return "\\n".join(f"[{'x' if t.done else ' '}] {t.title}" for t in manager.tasks)


def cmd_stats(manager, args, username):
    return str(completion_stats(manager.tasks))


COMMANDS = {"add": cmd_add, "list": cmd_list, "stats": cmd_stats}


def execute(manager, line, username):
    command, args = parse_command(line)
    handler = COMMANDS.get(command)
    if handler is None:
        return f"Unknown command: {command}"
    return handler(manager, args, username)


if __name__ == "__main__":
    register("carol", "pass123")
    assert login("carol", "pass123")

    manager = TaskManager()
    manager.tasks = load_tasks("tasks.json")

    for line in ["add Buy milk", "add Finish report", "list", "stats"]:
        print(execute(manager, line, "carol"))

    backup_and_save(manager.tasks, "tasks.json")`,
      runCommand: "python task_manager_app.py",
      installGuide: {
        intro:
          "json, hashlib, os, shutil і datetime вбудовані в реальний Python — увесь застосунок запускається без жодної зовнішньої залежності.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text: "Зайди на python.org/downloads і встанови останню версію. Windows: галочка «Add python.exe to PATH».",
            code: null,
          },
          {
            title: "2. Збережи код і запусти",
            text: "Увесь застосунок — один файл, готовий до запуску без жодних pip install:",
            code: "python task_manager_app.py",
          },
          {
            title: "3. Наступний рівень: справжній інтерфейс",
            text:
              "Обгорни ту саму логіку (Task, TaskManager, execute) у Flask (🌐 API Development) для веб-інтерфейсу, або в tkinter (🖥️ Desktop Development) для графічного вікна — код ЯДРА застосунку лишається незмінним.",
            code: `from flask import Flask, request

app = Flask(__name__)
manager = TaskManager()

@app.route("/command", methods=["POST"])
def handle_command():
    line = request.json["line"]
    return {"result": execute(manager, line, "web_user")}`,
          },
          {
            title: "4. Постав постійне сховище",
            text: "Для реального продакшн-застосунку — база даних (🗄️ Databases) замість JSON-файлу.",
            code: "pip install flask",
          },
        ],
      },
      improvements: [
        "Замінити JSON-файл на справжню базу даних (SQLite/PostgreSQL) для одночасного доступу багатьох користувачів",
        "Додати веб-інтерфейс через Flask (🌐 API Development) або графічний через tkinter (🖥️ Desktop Development)",
        "Реалізувати повноцінну авторизацію з токенами сесій (🔧 Backend Development)",
        "Додати нагадування й дедлайни з реальними сповіщеннями",
      ],
      nextLevel:
        "Це був останній з 16 напрямків Python! Кожен з них — 🐍 Core, 🎮 GameDev, 🖥️ Desktop, ⚙️ Automation, 🕸️ Scraping, 🌐 API, 🔧 Backend, 🗄️ Databases, 📊 Data Analysis, 📈 Data Science, 🤖 AI/ML, 🔐 Cybersecurity, 🧪 Science, 🧰 DevOps і цей Full Project — додав СВІЙ прийом до інструментарію, яким тепер володієш. Наступний крок — обрати НАПРЯМОК, що найбільше зацікавив, і поглибитись у нього за межами цієї платформи: власний реальний проєкт, з реальними бібліотеками (numpy, Flask, scikit-learn), тепер зрозумілими зсередини.",
    },
  },
];
