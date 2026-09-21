// Python OOP — the second Python direction. Same structure as Python Core:
// an "intro" lesson followed by 20 real "python" lessons (executed for real
// via Pyodide), building step by step toward one cumulative project — this
// time rewriting the Python Core to-do organizer as classes and objects.
export const PYTHON_OOP_LESSONS = [
  {
    id: "py-oop-intro",
    title: "Що це? — Python OOP",
    type: "intro",
    theory:
      "Python OOP (Object-Oriented Programming, об'єктно-орієнтоване програмування) — це не нова мова і не нові команди, а ІНШИЙ СПОСІБ організовувати код, який уже знайомий із Python Core. Замість окремих функцій (add_task, complete_task, stats), що працюють над окремим списком словників, дані та поведінка об'єднуються РАЗОМ в одну сутність — клас.\n\nУ Python клас — це «креслення» (blueprint), яке описує, які дані матиме об'єкт (атрибути) і що він уміє робити (методи). Наприклад, замість словника {\"name\": \"Купити хліб\", \"done\": False} і окремої функції complete_task(tasks, i), буде клас Task із власним методом task.complete(). Це не просто інша форма запису — так організований код великих програм: ігор (Player, Enemy), вебзастосунків (User, Order), баз даних (Model) — усюди, де є «сутності» зі своєю поведінкою.\n\nЩо саме тут використовуватиметься: class, __init__ (конструктор), self, методи, __str__, успадкування (inheritance) і поліморфізм — базовий словник ООП, який знадобиться в Game Development (клас Player, Enemy), Backend (клас User, Order) і практично всюди далі. Це вже другий крок після Python Core, тож активно застосовуватимуться списки, цикли, функції та f-рядки з попереднього напрямку — без них тут нікуди.\n\nЩо потрібно ПЕРЕД початком: пройдений (або хоча б знайомий) 🐍 Python Core — списки, словники, функції, f-рядки. Що буде після 20 уроків: той самий консольний органайзер справ, але переписаний в ООП-стилі — з класами Task, UrgentTask (успадкування) і Organizer, зібраний так само крок за кроком, урок за уроком.",
    presentation: [
      { title: "Python OOP — коротко", points: ["Не нова мова — новий спосіб організації того самого коду", "Дані (атрибути) + поведінка (методи) об'єднані в один клас", "Ключові слова: class, __init__, self, успадкування"] },
      { title: "Результат", points: ["20 уроків, кожен додає нову можливість класу", "Фінал: той самий органайзер, переписаний через Task, UrgentTask, Organizer", "Потрібне знання Python Core: списки, словники, функції, f-рядки"] },
    ],
  },
  {
    id: "py-oop-1",
    title: "Класи та об'єкти",
    type: "python",
    theory:
      "Клас — це шаблон, за яким створюють об'єкти (їх ще називають екземплярами, instances). Оголошується словом class і, за угодою, ім'я класу пишуть з великої літери: class Task: — на відміну від змінних і функцій (snake_case), класи в Python завжди PascalCase.\n\ntask = Task() створює ОБ'ЄКТ (екземпляр) класу Task — конкретну «річ», зроблену за цим шаблоном. Кожному об'єкту можна на льоту призначити власний атрибут (дані, що йому належать) через крапку: task.name = \"Купити хліб\". Це прямий аналог object/class у JavaScript, тільки з окремим ключовим словом class і явним створенням через дужки Task().\n\nЯкщо тіло класу поки порожнє, пишуть pass — так само, як у функціях без реалізації.",
    examples: [
      { title: "Найпростіший клас", code: `class Task:\n    pass\n\ntask = Task()\ntask.name = "Купити хліб"\nprint(task.name)`, explain: "Task() створює новий об'єкт; task.name = ... додає йому атрибут «на льоту»." },
    ],
    task: `Оголоси порожній клас Task (з pass), створи об'єкт task = Task(), признач task.name = "Купити хліб" і виведи task.name.`,
    starter: `class Task:\n    pass\n\ntask = Task()\n# task.name = ...\n# print(task.name)\n`,
    hints: [`Тіло класу без вмісту вимагає pass.`, `Атрибут об'єкта призначається через крапку: task.name = "...".`, `class Task:\n    pass\n\ntask = Task()\ntask.name = "Купити хліб"\nprint(task.name)`],
    solution: `class Task:\n    pass\n\ntask = Task()\ntask.name = "Купити хліб"\nprint(task.name)`,
    testCode: `if "Task" not in globals() or not isinstance(Task, type):\n    __result__ = {"pass": False, "message": "Потрібен клас з іменем Task."}\nelif "task" not in globals() or not isinstance(task, Task):\n    __result__ = {"pass": False, "message": "Створи об'єкт task = Task()."}\nelif getattr(task, "name", None) != "Купити хліб":\n    __result__ = {"pass": False, "message": "task.name має дорівнювати рядку «Купити хліб»."}\nelse:\n    __result__ = {"pass": True, "message": "Це і є основа ООП: клас — шаблон, об'єкт — конкретна річ, зроблена за цим шаблоном."}`,
  },
  {
    id: "py-oop-2",
    title: "__init__ — конструктор",
    type: "python",
    theory:
      "Ручне призначення task.name = ... після кожного Task() незручно й ненадійно — легко забути. __init__ — спеціальний метод («конструктор»), який Python викликає АВТОМАТИЧНО одразу під час створення об'єкта: def __init__(self, name):.\n\nПерший параметр self завжди присутній у методах класу й позначає «цей самий об'єкт, що зараз створюється». self.name = name всередині __init__ зберігає значення параметра name як атрибут саме цього об'єкта. Тепер можна писати Task(\"Купити хліб\") — і name одразу передасться в об'єкт.\n\n__init__ — це той самий принцип, що конструктор класу в інших мовах (constructor у JS-класах), тільки з обов'язковим явним параметром self.",
    examples: [
      { title: "__init__ з одним параметром", code: `class Task:\n    def __init__(self, name):\n        self.name = name\n\ntask = Task("Купити хліб")\nprint(task.name)`, explain: "Task(\"Купити хліб\") автоматично викликає __init__, і self.name = name зберігає значення." },
    ],
    task: `Допиши __init__(self, name), який зберігає self.name = name. Створи task = Task("Зробити домашку") і виведи task.name.`,
    starter: `class Task:\n    def __init__(self, name):\n        # твій код тут\n        pass\n\ntask = Task("Зробити домашку")\nprint(task.name)\n`,
    hints: [`Усередині __init__: self.name = name`, `Прибери pass, коли додаси реальний код.`, `class Task:\n    def __init__(self, name):\n        self.name = name`],
    solution: `class Task:\n    def __init__(self, name):\n        self.name = name\n\ntask = Task("Зробити домашку")\nprint(task.name)`,
    testCode: `if "Task" not in globals() or not isinstance(Task, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Task з __init__."}\nelse:\n    probe = Task("Тест")\n    if getattr(probe, "name", None) != "Тест":\n        __result__ = {"pass": False, "message": "Task(\\"Тест\\").name має дорівнювати «Тест» — перевір __init__."}\n    elif not any("Зробити домашку" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи task.name через print()."}\n    else:\n        __result__ = {"pass": True, "message": "__init__ — автоматичний конструктор: більше не треба вручну призначати атрибути після створення об'єкта."}`,
  },
  {
    id: "py-oop-3",
    title: "Кілька атрибутів екземпляра",
    type: "python",
    theory:
      "__init__ може приймати скільки завгодно параметрів, і кожен зберігати у власний атрибут об'єкта. Так само, як словник з Python Core мав два ключі (\"name\" і \"done\"), клас Task матиме два атрибути: self.name і self.done.\n\nЗручно одразу задавати значення за замовчуванням для параметрів, яких може не бути при створенні: def __init__(self, name, done=False): — тоді Task(\"Купити хліб\") без другого аргументу автоматично отримає done=False.",
    examples: [
      { title: "Два атрибути й значення за замовчуванням", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\ntask = Task("Купити хліб")\nprint(task.name)\nprint(task.done)`, explain: "done=False спрацьовує автоматично, якщо другий аргумент не переданий." },
    ],
    task: `Допиши __init__(self, name, done=False), що зберігає self.name і self.done. Створи task = Task("Погуляти") (без другого аргументу) і виведи обидва атрибути.`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        # твій код тут\n        pass\n\ntask = Task("Погуляти")\nprint(task.name)\nprint(task.done)\n`,
    hints: [`Два рядки: self.name = name та self.done = done.`, `Не додавай нічого зайвого — просто збережи обидва параметри.`, `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\ntask = Task("Погуляти")\nprint(task.name)\nprint(task.done)`,
    testCode: `if "Task" not in globals() or not isinstance(Task, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Task."}\nelse:\n    probe = Task("Тест")\n    if getattr(probe, "name", None) != "Тест" or getattr(probe, "done", "MISSING") is not False:\n        __result__ = {"pass": False, "message": "Task(\\"Тест\\") без другого аргументу має мати name=\\"Тест\\" і done=False."}\n    elif not any(l.strip() == "False" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи task.done окремим print() — у виводі має з'явитись False."}\n    else:\n        __result__ = {"pass": True, "message": "Значення за замовчуванням (done=False) роблять створення об'єкта коротшим і безпечнішим."}`,
  },
  {
    id: "py-oop-4",
    title: "Методи: поведінка об'єкта",
    type: "python",
    theory:
      "Метод — це функція, оголошена ВСЕРЕДИНІ класу; вона описує, що об'єкт УМІЄ РОБИТИ. Перший параметр методу завжди self — так метод отримує доступ до атрибутів саме того об'єкта, на якому його викликали.\n\ndef complete(self):\n    self.done = True\n\nВиклик виглядає як task.complete() — БЕЗ аргументу self, Python підставляє його автоматично (self — це і є task у момент виклику). Це ключова відмінність від функцій Python Core: замість complete_task(tasks, 0) тепер task.complete() — дія «прив'язана» до самого об'єкта.",
    examples: [
      { title: "Метод complete()", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def complete(self):\n        self.done = True\n\ntask = Task("Купити хліб")\ntask.complete()\nprint(task.done)`, explain: "task.complete() змінює done саме в цьому об'єкті — self усередині методу і є task." },
    ],
    task: `Додай метод complete(self), який встановлює self.done = True. Створи task = Task("Купити хліб"), виклич task.complete() і виведи task.done.`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def complete(self):\n        # твій код тут\n        pass\n\ntask = Task("Купити хліб")\ntask.complete()\nprint(task.done)\n`,
    hints: [`Усередині complete: self.done = True`, `Виклик методу: task.complete() — без аргументів у дужках.`, `def complete(self):\n    self.done = True`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def complete(self):\n        self.done = True\n\ntask = Task("Купити хліб")\ntask.complete()\nprint(task.done)`,
    testCode: `if "Task" not in globals() or not isinstance(Task, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Task із методом complete."}\nelse:\n    probe = Task("Тест")\n    if not hasattr(probe, "complete") or not callable(probe.complete):\n        __result__ = {"pass": False, "message": "Потрібен метод complete(self)."}\n    else:\n        probe.complete()\n        if probe.done is not True:\n            __result__ = {"pass": False, "message": "Після task.complete() атрибут done має стати True."}\n        elif not any(l.strip() == "True" for l in __logs):\n            __result__ = {"pass": False, "message": "Виведи task.done через print() — має з'явитись True."}\n        else:\n            __result__ = {"pass": True, "message": "task.complete() — поведінка, прив'язана прямо до об'єкта, а не окрема функція над ним."}`,
  },
  {
    id: "py-oop-5",
    title: "Метод, що повертає значення",
    type: "python",
    theory:
      "Методи, як і звичайні функції, можуть мати return. Метод status(self) поверне текстове представлення стану задачі, замість того щоб самому вирішувати, друкувати щось чи ні — це залишає викликаючому коду свободу самому вирішити, що робити з результатом (вивести, зберегти, порівняти).\n\ndef status(self):\n    return \"виконано\" if self.done else \"в роботі\"\n\nЦе той самий принцип, що count_tasks() чи stats() із Python Core — тільки тепер метод «знає» про стан об'єкта сам, без параметрів ззовні (не treba передавати tasks — все вже є в self).",
    examples: [
      { title: "Метод status()", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def status(self):\n        return "виконано" if self.done else "в роботі"\n\ntask = Task("Купити хліб", done=True)\nprint(task.status())`, explain: "status() нічого не друкує сам — повертає рядок, який потім виводить print()." },
    ],
    task: `Додай метод status(self), що повертає "виконано" якщо self.done True, інакше "в роботі". Створи task = Task("Купити хліб", done=True) і виведи task.status().`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def status(self):\n        # твій код тут\n        pass\n\ntask = Task("Купити хліб", done=True)\nprint(task.status())\n`,
    hints: [`Тернарний вираз: return "виконано" if self.done else "в роботі"`, `Метод має саме ПОВЕРТАТИ рядок, а не друкувати його.`, `def status(self):\n    return "виконано" if self.done else "в роботі"`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def status(self):\n        return "виконано" if self.done else "в роботі"\n\ntask = Task("Купити хліб", done=True)\nprint(task.status())`,
    testCode: `if "Task" not in globals() or not isinstance(Task, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Task із методом status."}\nelse:\n    done_probe = Task("Тест", done=True)\n    pending_probe = Task("Тест", done=False)\n    if not hasattr(done_probe, "status") or not callable(done_probe.status):\n        __result__ = {"pass": False, "message": "Потрібен метод status(self)."}\n    elif done_probe.status() != "виконано" or pending_probe.status() != "в роботі":\n        __result__ = {"pass": False, "message": "status() має повертати «виконано» для done=True і «в роботі» для done=False."}\n    elif not any("виконано" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи результат task.status() через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Метод сам вирішує, ЩО повернути, а виклик коду вирішує, ЩО з цим робити далі."}`,
  },
  {
    id: "py-oop-6",
    title: "__str__: як об'єкт друкується",
    type: "python",
    theory:
      "Спробуй print(task) без методу __str__ — побачиш щось на кшталт <__main__.Task object at 0x...>, зовсім не корисно. __str__(self) — спеціальний метод, що визначає, ЯК саме об'єкт перетворюється на рядок під час print() чи f-рядка.\n\ndef __str__(self):\n    mark = \"[x]\" if self.done else \"[ ]\"\n    return f\"{mark} {self.name}\"\n\nТепер print(task) сам викличе __str__ і покаже зрозумілий рядок — той самий формат \"[x]/[ ] назва\", що був у Python Core, тільки тепер об'єкт сам «знає», як себе показати.",
    examples: [
      { title: "__str__ у дії", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\ntask = Task("Купити хліб", done=True)\nprint(task)`, explain: "print(task) автоматично викликає __str__ — вручну task.__str__() писати не треба." },
    ],
    task: `Додай метод __str__(self), що повертає "[x] назва" якщо done True, інакше "[ ] назва". Створи task = Task("Погуляти", done=False) і виведи print(task) напряму (без .status() чи .name).`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def __str__(self):\n        # твій код тут\n        pass\n\ntask = Task("Погуляти", done=False)\nprint(task)\n`,
    hints: [`mark = "[x]" if self.done else "[ ]"`, `return f"{mark} {self.name}"`, `def __str__(self):\n    mark = "[x]" if self.done else "[ ]"\n    return f"{mark} {self.name}"`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\ntask = Task("Погуляти", done=False)\nprint(task)`,
    testCode: `if "Task" not in globals() or not isinstance(Task, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Task із методом __str__."}\nelse:\n    probe = Task("Тест", done=True)\n    if str(probe) != "[x] Тест":\n        __result__ = {"pass": False, "message": "str(Task(\\"Тест\\", done=True)) має дорівнювати «[x] Тест»."}\n    elif not any("[ ] Погуляти" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи print(task) напряму — у виводі має бути «[ ] Погуляти»."}\n    else:\n        __result__ = {"pass": True, "message": "__str__ дозволяє print(task) одразу показувати зрозумілий формат — без окремого виклику методу."}`,
  },
  {
    id: "py-oop-7",
    title: "Список об'єктів",
    type: "python",
    theory:
      "Список може містити об'єкти так само легко, як рядки чи словники з Python Core: tasks = [Task(\"Купити хліб\"), Task(\"Погуляти\", done=True)]. Цикл for task in tasks: тепер дає не словник, а справжній об'єкт Task на кожному кроці — з усіма його методами.\n\nЗавдяки __str__ з попереднього уроку, print(task) усередині циклу одразу дає гарний, зрозумілий вивід — без ручного формування рядка щоразу.",
    examples: [
      { title: "Цикл по списку об'єктів", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\ntasks = [Task("Купити хліб"), Task("Погуляти", done=True)]\nfor task in tasks:\n    print(task)`, explain: "print(task) у циклі викликає __str__ для кожного об'єкта окремо." },
    ],
    task: `Створи список tasks із трьох об'єктів Task (різні назви, хоча б один з done=True). Виведи кожен об'єкт окремим рядком через цикл for.`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\ntasks = [\n    # твої об'єкти Task тут\n]\n\n# for task in tasks:\n#     print(task)\n`,
    hints: [`Task("Купити хліб"), Task("Погуляти", done=True), Task("Прочитати книгу") — приклад трьох об'єктів.`, `for task in tasks: print(task)`, `tasks = [Task("Купити хліб"), Task("Погуляти", done=True), Task("Прочитати книгу")]\nfor task in tasks:\n    print(task)`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\ntasks = [Task("Купити хліб"), Task("Погуляти", done=True), Task("Прочитати книгу")]\nfor task in tasks:\n    print(task)`,
    testCode: `if "tasks" not in globals() or not isinstance(tasks, list) or len(tasks) < 3:\n    __result__ = {"pass": False, "message": "tasks має бути списком щонайменше з 3 об'єктів Task."}\nelif not all(isinstance(t, Task) for t in tasks):\n    __result__ = {"pass": False, "message": "Усі елементи tasks мають бути об'єктами Task."}\nelif not any("[x]" in l for l in __logs) or not any("[ ]" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має бути виведено і виконану ([x]), і невиконану ([ ]) задачу."}\nelse:\n    __result__ = {"pass": True, "message": "Список об'єктів працює так само, як список словників у Python Core — тільки тепер кожен елемент «розумніший»."}`,
  },
  {
    id: "py-oop-8",
    title: "Клас Organizer: контейнер для задач",
    type: "python",
    theory:
      "Замість того щоб тримати список tasks окремою змінною, логічно створити ще один клас — Organizer, чий __init__ одразу заводить порожній список: def __init__(self): self.tasks = [].\n\nЦе ключова ідея ООП: один об'єкт (organizer) відповідає за весь список задач і за дії над ним, а кожен окремий Task відповідає лише за себе. Дані (self.tasks) і майбутня поведінка над ними (методи, які додамо в наступних уроках) тепер будуть в одному місці.",
    examples: [
      { title: "Organizer з порожнім списком", code: `class Organizer:\n    def __init__(self):\n        self.tasks = []\n\norganizer = Organizer()\nprint(organizer.tasks)\nprint(len(organizer.tasks))`, explain: "self.tasks = [] у __init__ гарантує, що КОЖЕН новий Organizer отримує свій ВЛАСНИЙ порожній список." },
    ],
    task: `Оголоси клас Organizer з __init__(self), що створює self.tasks = []. Створи organizer = Organizer() і виведи organizer.tasks та len(organizer.tasks).`,
    starter: `class Organizer:\n    def __init__(self):\n        # твій код тут\n        pass\n\norganizer = Organizer()\nprint(organizer.tasks)\nprint(len(organizer.tasks))\n`,
    hints: [`self.tasks = [] — порожній список одразу під час створення.`, `Нічого більше в __init__ поки не потрібно.`, `class Organizer:\n    def __init__(self):\n        self.tasks = []`],
    solution: `class Organizer:\n    def __init__(self):\n        self.tasks = []\n\norganizer = Organizer()\nprint(organizer.tasks)\nprint(len(organizer.tasks))`,
    testCode: `if "Organizer" not in globals() or not isinstance(Organizer, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Organizer."}\nelse:\n    probe = Organizer()\n    if not hasattr(probe, "tasks") or not isinstance(probe.tasks, list) or len(probe.tasks) != 0:\n        __result__ = {"pass": False, "message": "Organizer().tasks має бути порожнім списком одразу після створення."}\n    elif not any(l.strip() == "0" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи len(organizer.tasks) — має бути 0."}\n    else:\n        __result__ = {"pass": True, "message": "Organizer тепер відповідає за весь список задач — саме він буде «мозком» органайзера."}`,
  },
  {
    id: "py-oop-9",
    title: "Метод add_task",
    type: "python",
    theory:
      "Додамо Organizer'у метод add_task(self, name), що створює НОВИЙ об'єкт Task усередині себе й додає його у self.tasks:\n\ndef add_task(self, name):\n    self.tasks.append(Task(name))\n\nВиклик стає простим: organizer.add_task(\"Купити хліб\") — сам Organizer уже знає, як створити Task і куди його покласти. Той, хто викликає add_task, взагалі не має знати про існування класу Task — це деталь реалізації, схована всередині Organizer.",
    examples: [
      { title: "add_task створює Task сам", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\nprint(organizer.tasks[0])`, explain: "add_task ховає деталь, що всередині створюється саме об'єкт Task." },
    ],
    task: `Додай метод add_task(self, name) до Organizer, що створює Task(name) і додає його в self.tasks. Створи organizer, виклич organizer.add_task("Купити хліб") і виведи organizer.tasks[0].`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n\n    def add_task(self, name):\n        # твій код тут\n        pass\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\nprint(organizer.tasks[0])\n`,
    hints: [`self.tasks.append(Task(name)) — створити Task і одразу додати в список.`, `Метод нічого не повертає, лише змінює self.tasks.`, `def add_task(self, name):\n    self.tasks.append(Task(name))`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\nprint(organizer.tasks[0])`,
    testCode: `if "Organizer" not in globals() or "Task" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні класи Task і Organizer."}\nelse:\n    probe = Organizer()\n    if not hasattr(probe, "add_task") or not callable(probe.add_task):\n        __result__ = {"pass": False, "message": "Потрібен метод add_task(self, name)."}\n    else:\n        probe.add_task("Тест")\n        if len(probe.tasks) != 1 or not isinstance(probe.tasks[0], Task) or probe.tasks[0].name != "Тест":\n            __result__ = {"pass": False, "message": "Після add_task(\\"Тест\\") у self.tasks має з'явитись один об'єкт Task з name=\\"Тест\\"."}\n        elif not any("Купити хліб" in l for l in __logs):\n            __result__ = {"pass": False, "message": "Виведи organizer.tasks[0] — має показати «[ ] Купити хліб»."}\n        else:\n            __result__ = {"pass": True, "message": "add_task ховає деталь створення Task — той, хто ним керує, працює лише з простим викликом методу."}`,
  },
  {
    id: "py-oop-10",
    title: "Метод complete_task за індексом",
    type: "python",
    theory:
      "Тепер Organizer.complete_task(self, index) має дістати потрібний Task зі свого списку й викликати вже готовий метод .complete() (з 4-го уроку) на ньому:\n\ndef complete_task(self, index):\n    self.tasks[index].complete()\n\nЦе показує силу ООП: Organizer не переписує логіку «позначення виконаним» самостійно — він просто просить сам об'єкт Task зробити це. Кожен клас відповідає лише за свою частину роботи.",
    examples: [
      { title: "complete_task делегує роботу Task", code: `organizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.complete_task(0)\nprint(organizer.tasks[0])`, explain: "complete_task не змінює done напряму — він викликає task.complete(), який уже вміє це робити." },
    ],
    task: `Додай метод complete_task(self, index), що викликає self.tasks[index].complete(). Додай одну задачу, познач її виконаною через organizer.complete_task(0) і виведи organizer.tasks[0].`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n\n    def complete_task(self, index):\n        # твій код тут\n        pass\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.complete_task(0)\nprint(organizer.tasks[0])\n`,
    hints: [`self.tasks[index] дістає потрібний об'єкт Task.`, `На ньому виклич уже готовий метод: .complete()`, `def complete_task(self, index):\n    self.tasks[index].complete()`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n\n    def complete_task(self, index):\n        self.tasks[index].complete()\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.complete_task(0)\nprint(organizer.tasks[0])`,
    testCode: `if "Organizer" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Organizer."}\nelse:\n    probe = Organizer()\n    probe.add_task("Тест")\n    if not hasattr(probe, "complete_task") or not callable(probe.complete_task):\n        __result__ = {"pass": False, "message": "Потрібен метод complete_task(self, index)."}\n    else:\n        probe.complete_task(0)\n        if probe.tasks[0].done is not True:\n            __result__ = {"pass": False, "message": "Після complete_task(0) tasks[0].done має стати True."}\n        elif not any("[x] Купити хліб" in l for l in __logs):\n            __result__ = {"pass": False, "message": "Виведи organizer.tasks[0] — має показати «[x] Купити хліб»."}\n        else:\n            __result__ = {"pass": True, "message": "Organizer делегує роботу самому Task — так класи співпрацюють, а не дублюють логіку одне одного."}`,
  },
  {
    id: "py-oop-11",
    title: "Метод list_tasks",
    type: "python",
    theory:
      "list_tasks(self) виводить усі задачі — практично те саме, що list_tasks(tasks) із Python Core, тільки тепер це метод Organizer, який працює з self.tasks, а не з окремим параметром:\n\ndef list_tasks(self):\n    for task in self.tasks:\n        print(task)\n\nЗавдяки __str__ із 6-го уроку, print(task) усередині цього циклу вже й так дає гарний формат — методу list_tasks не треба знати ПРО ЩО саме друкувати, він просто довіряє це кожному об'єкту Task.",
    examples: [
      { title: "list_tasks використовує __str__", code: `organizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.add_task("Погуляти")\norganizer.complete_task(0)\norganizer.list_tasks()`, explain: "list_tasks не форматує рядок сам — це вже вміє __str__ кожного Task." },
    ],
    task: `Додай метод list_tasks(self), що виводить кожну задачу з self.tasks окремим print(task). Додай дві задачі, познач одну виконаною і виклич organizer.list_tasks().`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n    def complete_task(self, index):\n        self.tasks[index].complete()\n\n    def list_tasks(self):\n        # твій код тут\n        pass\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.add_task("Погуляти")\norganizer.complete_task(0)\norganizer.list_tasks()\n`,
    hints: [`for task in self.tasks: print(task)`, `Метод нічого не повертає — лише друкує.`, `def list_tasks(self):\n    for task in self.tasks:\n        print(task)`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n    def complete_task(self, index):\n        self.tasks[index].complete()\n\n    def list_tasks(self):\n        for task in self.tasks:\n            print(task)\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.add_task("Погуляти")\norganizer.complete_task(0)\norganizer.list_tasks()`,
    testCode: `has_done = any("[x]" in l for l in __logs)\nhas_pending = any("[ ]" in l for l in __logs)\nif "Organizer" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Organizer із методом list_tasks."}\nelif not (has_done and has_pending):\n    __result__ = {"pass": False, "message": "list_tasks() має вивести і виконану ([x]), і невиконану ([ ]) задачу."}\nelse:\n    __result__ = {"pass": True, "message": "Тепер Organizer уміє показати весь список — так само зручно, як у Python Core, але через метод."}`,
  },
  {
    id: "py-oop-12",
    title: "Метод stats",
    type: "python",
    theory:
      "stats(self) рахує виконані задачі так само, як в 17-му уроці Python Core, тільки тепер звертається до self.tasks і до атрибута task.done кожного об'єкта:\n\ndef stats(self):\n    done = len([t for t in self.tasks if t.done])\n    return f\"Виконано {done} з {len(self.tasks)}\"\n\nЗверни увагу: t.done (атрибут об'єкта, БЕЗ дужок) — це не те саме, що t.complete() (метод, З дужками). Атрибут — це ДАНІ, метод — це ДІЯ.",
    examples: [
      { title: "stats() рахує через list comprehension", code: `organizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.add_task("Погуляти")\norganizer.complete_task(0)\nprint(organizer.stats())`, explain: "t.done — атрибут (дані), а не виклик методу — тому без дужок." },
    ],
    task: `Додай метод stats(self), що повертає "Виконано X з Y". Додай дві задачі, познач одну виконаною і виведи organizer.stats().`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n    def complete_task(self, index):\n        self.tasks[index].complete()\n    def list_tasks(self):\n        for task in self.tasks:\n            print(task)\n\n    def stats(self):\n        # твій код тут\n        pass\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.add_task("Погуляти")\norganizer.complete_task(0)\nprint(organizer.stats())\n`,
    hints: [`done = len([t for t in self.tasks if t.done])`, `return f"Виконано {done} з {len(self.tasks)}"`, `def stats(self):\n    done = len([t for t in self.tasks if t.done])\n    return f"Виконано {done} з {len(self.tasks)}"`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n    def complete_task(self, index):\n        self.tasks[index].complete()\n    def list_tasks(self):\n        for task in self.tasks:\n            print(task)\n\n    def stats(self):\n        done = len([t for t in self.tasks if t.done])\n        return f"Виконано {done} з {len(self.tasks)}"\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.add_task("Погуляти")\norganizer.complete_task(0)\nprint(organizer.stats())`,
    testCode: `if "Organizer" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Organizer із методом stats."}\nelif not any("Виконано 1 з 2" in l for l in __logs):\n    __result__ = {"pass": False, "message": "organizer.stats() має вивести «Виконано 1 з 2»."}\nelse:\n    __result__ = {"pass": True, "message": "Тепер Organizer має всі чотири ключові методи: add_task, complete_task, list_tasks, stats."}`,
  },
  {
    id: "py-oop-13",
    title: "Атрибути класу vs атрибути екземпляра",
    type: "python",
    theory:
      "Досі всі атрибути (self.name, self.done, self.tasks) належали КОНКРЕТНОМУ об'єкту — це атрибути екземпляра. Але буває потрібне значення, СПІЛЬНЕ для всіх об'єктів класу одразу — атрибут класу, оголошений прямо в тілі класу, поза __init__:\n\nclass Task:\n    total_created = 0  # атрибут класу — один на весь клас\n\n    def __init__(self, name):\n        self.name = name  # атрибут екземпляра — свій для кожного об'єкта\n        Task.total_created += 1\n\nЗвернення Task.total_created (через ім'я класу) змінює значення, спільне для ВСІХ об'єктів — зручно для лічильників на кшталт «скільки всього задач коли-небудь створено».",
    examples: [
      { title: "Лічильник created на рівні класу", code: `class Task:\n    total_created = 0\n\n    def __init__(self, name):\n        self.name = name\n        Task.total_created += 1\n\nt1 = Task("Купити хліб")\nt2 = Task("Погуляти")\nprint(Task.total_created)`, explain: "Task.total_created зростає з КОЖНИМ новим об'єктом, а не скидається для кожного окремо." },
    ],
    task: `Додай атрибут класу total_created = 0 і в __init__ збільшуй його на 1 (Task.total_created += 1) при кожному створенні. Створи 3 об'єкти Task і виведи Task.total_created.`,
    starter: `class Task:\n    total_created = 0\n\n    def __init__(self, name):\n        self.name = name\n        # твій код тут\n\nTask("Купити хліб")\nTask("Погуляти")\nTask("Прочитати книгу")\nprint(Task.total_created)\n`,
    hints: [`Task.total_created += 1 — звернення через ім'я класу, не self.`, `Цей рядок додається в __init__ після self.name = name.`, `def __init__(self, name):\n    self.name = name\n    Task.total_created += 1`],
    solution: `class Task:\n    total_created = 0\n\n    def __init__(self, name):\n        self.name = name\n        Task.total_created += 1\n\nTask("Купити хліб")\nTask("Погуляти")\nTask("Прочитати книгу")\nprint(Task.total_created)`,
    testCode: `if "Task" not in globals() or not isinstance(Task, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Task."}\nelif getattr(Task, "total_created", 0) != 3:\n    __result__ = {"pass": False, "message": "Task.total_created має дорівнювати 3 після створення трьох об'єктів."}\nelif not any(l.strip() == "3" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи Task.total_created через print() — має з'явитись 3."}\nelse:\n    __result__ = {"pass": True, "message": "Атрибут класу — це спільна пам'ять для всіх об'єктів одразу, на відміну від self.-атрибутів, унікальних для кожного."}`,
  },
  {
    id: "py-oop-14",
    title: "Інкапсуляція: атрибути з префіксом _",
    type: "python",
    theory:
      "У Python немає справжніх «приватних» атрибутів (як private у деяких інших мовах) — це питання ДОМОВЛЕНОСТІ (конвенції), а не жорсткого механізму захисту. Префікс з одного підкреслення (_id) сигналізує іншим розробникам: «це внутрішня деталь реалізації, не чіпай ззовні напряму» — хоча технічно доступ усе одно можливий.\n\nclass Task:\n    def __init__(self, name):\n        self._id = generate_id()  # \"приватний\" за домовленістю\n        self.name = name\n\nЦе називається інкапсуляція — приховування внутрішніх деталей об'єкта й надання доступу до них тільки через методи, а не напряму. У наступному уроці побачимо, як @property робить це ще елегантніше.",
    examples: [
      { title: "Атрибут з префіксом _", code: `class Task:\n    def __init__(self, name):\n        self._name = name  # "приватний" за домовленістю\n\n    def get_name(self):\n        return self._name\n\ntask = Task("Купити хліб")\nprint(task.get_name())`, explain: "_name сигналізує «не звертайся напряму», хоча task._name технічно все одно спрацює." },
    ],
    task: `Перейменуй збереження імені на self._name (з підкресленням) у __init__. Додай метод get_name(self), що повертає self._name. Створи task = Task("Погуляти") і виведи task.get_name().`,
    starter: `class Task:\n    def __init__(self, name):\n        # збережи як self._name\n        pass\n\n    def get_name(self):\n        # поверни self._name\n        pass\n\ntask = Task("Погуляти")\nprint(task.get_name())\n`,
    hints: [`self._name = name — з одним підкресленням спереду.`, `get_name повертає те саме значення: return self._name`, `def __init__(self, name):\n    self._name = name\n\ndef get_name(self):\n    return self._name`],
    solution: `class Task:\n    def __init__(self, name):\n        self._name = name\n\n    def get_name(self):\n        return self._name\n\ntask = Task("Погуляти")\nprint(task.get_name())`,
    testCode: `if "Task" not in globals() or not isinstance(Task, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Task."}\nelse:\n    probe = Task("Тест")\n    if getattr(probe, "_name", None) != "Тест":\n        __result__ = {"pass": False, "message": "Ім'я має зберігатись саме в self._name (з підкресленням)."}\n    elif not hasattr(probe, "get_name") or probe.get_name() != "Тест":\n        __result__ = {"pass": False, "message": "get_name() має повертати значення self._name."}\n    elif not any("Погуляти" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи task.get_name() через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Префікс _ — сигнал іншим розробникам «звертайся через метод, а не напряму»."}`,
  },
  {
    id: "py-oop-15",
    title: "@property: атрибут, що обчислюється",
    type: "python",
    theory:
      "get_name() з попереднього уроку працює, але викликати його треба з дужками — task.get_name(), а не task.name, хоча за замістом це «просто атрибут». Декоратор @property дозволяє оформити МЕТОД так, щоб він виглядав і використовувався як звичайний атрибут — без дужок:\n\n@property\ndef label(self):\n    return f\"[x] {self.name}\" if self.done else f\"[ ] {self.name}\"\n\nТепер task.label (БЕЗ дужок!) обчислює значення щоразу заново — зручно для \"віртуальних\" атрибутів, які насправді є результатом обчислення, а не збереженим значенням.",
    examples: [
      { title: "@property для обчислюваного label", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    @property\n    def label(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\ntask = Task("Купити хліб", done=True)\nprint(task.label)`, explain: "task.label — без дужок! — хоча label насправді метод." },
    ],
    task: `Додай властивість label через @property, що повертає "[x] назва"/"[ ] назва" (як __str__ раніше). Створи task = Task("Погуляти", done=True) і виведи task.label (без дужок).`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    @property\n    def label(self):\n        # твій код тут\n        pass\n\ntask = Task("Погуляти", done=True)\nprint(task.label)\n`,
    hints: [`Той самий трюк, що в __str__: mark = "[x]" if self.done else "[ ]"`, `return f"{mark} {self.name}"`, `@property\ndef label(self):\n    mark = "[x]" if self.done else "[ ]"\n    return f"{mark} {self.name}"`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\n    @property\n    def label(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\ntask = Task("Погуляти", done=True)\nprint(task.label)`,
    testCode: `if "Task" not in globals() or not isinstance(Task, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Task."}\nelse:\n    probe = Task("Тест", done=True)\n    if probe.label != "[x] Тест":\n        __result__ = {"pass": False, "message": "task.label (без дужок) має повертати «[x] Тест» для done=True."}\n    elif not any("[x] Погуляти" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи task.label через print() — має бути «[x] Погуляти»."}\n    else:\n        __result__ = {"pass": True, "message": "@property робить обчислюваний метод невідрізненним ззовні від звичайного атрибута."}`,
  },
  {
    id: "py-oop-16",
    title: "Успадкування: базовий клас і підклас",
    type: "python",
    theory:
      "Успадкування дозволяє створити НОВИЙ клас на основі вже існуючого, автоматично отримавши всі його атрибути й методи, і додавши (або змінивши) щось своє. Синтаксис: class UrgentTask(Task): — у дужках вказується БАЗОВИЙ клас (батьківський).\n\nclass UrgentTask(Task):\n    pass\n\nurgent = UrgentTask(\"Здати проєкт\")  # UrgentTask сам ще не має __init__ — використовується __init__ від Task\nprint(urgent.name)  # успадковано від Task\n\nUrgentTask УЖЕ вміє все, що вміє Task (name, done, complete(), __str__), хоча жодного коду в UrgentTask ще не написано — усе успадковано.",
    examples: [
      { title: "Порожній підклас успадковує все", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n\nclass UrgentTask(Task):\n    pass\n\nurgent = UrgentTask("Здати проєкт")\nurgent.complete()\nprint(urgent.name, urgent.done)`, explain: "UrgentTask не описує жодного власного методу, але користується __init__ і complete() від Task." },
    ],
    task: `Оголоси клас UrgentTask(Task) (успадкований, поки без власного коду — pass). Створи urgent = UrgentTask("Здати проєкт"), виклич urgent.complete() і виведи urgent.name та urgent.done.`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n\n# class UrgentTask(...):\n#     ...\n\nurgent = UrgentTask("Здати проєкт")\nurgent.complete()\nprint(urgent.name)\nprint(urgent.done)\n`,
    hints: [`Базовий клас вказується в дужках: class UrgentTask(Task):`, `Якщо власного коду ще немає — тіло класу це pass.`, `class UrgentTask(Task):\n    pass`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n\nclass UrgentTask(Task):\n    pass\n\nurgent = UrgentTask("Здати проєкт")\nurgent.complete()\nprint(urgent.name)\nprint(urgent.done)`,
    testCode: `if "UrgentTask" not in globals() or not isinstance(UrgentTask, type):\n    __result__ = {"pass": False, "message": "Потрібен клас UrgentTask."}\nelif "Task" not in globals() or not issubclass(UrgentTask, Task):\n    __result__ = {"pass": False, "message": "UrgentTask має успадковувати Task: class UrgentTask(Task):"}\nelse:\n    probe = UrgentTask("Тест")\n    probe.complete()\n    if probe.name != "Тест" or probe.done is not True:\n        __result__ = {"pass": False, "message": "UrgentTask має успадкувати __init__ і complete() від Task без змін."}\n    elif not any(l.strip() == "True" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи urgent.done — має бути True після complete()."}\n    else:\n        __result__ = {"pass": True, "message": "UrgentTask отримав усю поведінку Task безкоштовно — саме в цьому сила успадкування."}`,
  },
  {
    id: "py-oop-17",
    title: "super() і власний __init__ підкласу",
    type: "python",
    theory:
      "UrgentTask може мати ВЛАСНИЙ __init__, що додає щось нове (наприклад, priority), не втрачаючи логіку батьківського класу. super().__init__(...) викликає __init__ БАТЬКІВСЬКОГО класу з середини дочірнього — так не доводиться дублювати self.name = name і self.done = done:\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)   # виконує Task.__init__\n        self.priority = priority  # і додає своє власне\n\nЦе стандартний патерн розширення класу: викликати super().__init__() першим рядком, а потім дописувати те, чого не було в батьківському класі.",
    examples: [
      { title: "super().__init__() + власний атрибут", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)\n        self.priority = priority\n\nurgent = UrgentTask("Здати проєкт", priority="високий")\nprint(urgent.name)\nprint(urgent.priority)`, explain: "super().__init__(name) виконує всю логіку Task, а self.priority — вже власна деталь UrgentTask." },
    ],
    task: `Додай UrgentTask свій __init__(self, name, priority), що викликає super().__init__(name) і зберігає self.priority = priority. Створи urgent = UrgentTask("Здати проєкт", "високий") і виведи urgent.name та urgent.priority.`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        # твій код тут\n        pass\n\nurgent = UrgentTask("Здати проєкт", "високий")\nprint(urgent.name)\nprint(urgent.priority)\n`,
    hints: [`Перший рядок: super().__init__(name)`, `Другий рядок: self.priority = priority`, `def __init__(self, name, priority):\n    super().__init__(name)\n    self.priority = priority`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)\n        self.priority = priority\n\nurgent = UrgentTask("Здати проєкт", "високий")\nprint(urgent.name)\nprint(urgent.priority)`,
    testCode: `if "UrgentTask" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас UrgentTask."}\nelse:\n    probe = UrgentTask("Тест", "низький")\n    if probe.name != "Тест" or getattr(probe, "priority", None) != "низький":\n        __result__ = {"pass": False, "message": "UrgentTask(\\"Тест\\", \\"низький\\") має мати name=\\"Тест\\" (через super()) і priority=\\"низький\\"."}\n    elif not any("високий" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи urgent.priority через print() — має з'явитись «високий»."}\n    else:\n        __result__ = {"pass": True, "message": "super().__init__() — стандартний спосіб розширити батьківський клас, не дублюючи його код."}`,
  },
  {
    id: "py-oop-18",
    title: "Перевизначення методів (override)",
    type: "python",
    theory:
      "Підклас може не лише ДОДАВАТИ нові атрибути/методи, а й ПЕРЕВИЗНАЧАТИ (override) успадковані — просто описавши метод з тим самим іменем заново. UrgentTask перевизначить __str__, щоб показувати ще й пріоритет:\n\nclass UrgentTask(Task):\n    def __str__(self):\n        base = super().__str__()   # можна викликати ще й батьківську версію\n        return f\"{base} (терміново, {self.priority})\"\n\nПри виклику print(urgent) Python автоматично використає ВЕРСІЮ __str__ саме з UrgentTask, а не з Task — це і є перевизначення.",
    examples: [
      { title: "Перевизначений __str__ з викликом super()", code: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)\n        self.priority = priority\n    def __str__(self):\n        base = super().__str__()\n        return f"{base} (терміново, {self.priority})"\n\nurgent = UrgentTask("Здати проєкт", "високий")\nprint(urgent)`, explain: "super().__str__() перевикористовує логіку Task, а не дублює mark = ... заново." },
    ],
    task: `Додай UrgentTask метод __str__(self), що бере base = super().__str__() і повертає f"{base} (терміново, {self.priority})". Виведи print(urgent).`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)\n        self.priority = priority\n\n    def __str__(self):\n        # твій код тут\n        pass\n\nurgent = UrgentTask("Здати проєкт", "високий")\nprint(urgent)\n`,
    hints: [`base = super().__str__() — виклик батьківської версії методу.`, `return f"{base} (терміново, {self.priority})"`, `def __str__(self):\n    base = super().__str__()\n    return f"{base} (терміново, {self.priority})"`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)\n        self.priority = priority\n\n    def __str__(self):\n        base = super().__str__()\n        return f"{base} (терміново, {self.priority})"\n\nurgent = UrgentTask("Здати проєкт", "високий")\nprint(urgent)`,
    testCode: `if "UrgentTask" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас UrgentTask."}\nelse:\n    probe = UrgentTask("Тест", "низький")\n    text = str(probe)\n    if "[ ] Тест" not in text or "низький" not in text or "терміново" not in text:\n        __result__ = {"pass": False, "message": "str(urgent) має містити і базовий формат Task ([ ] Тест), і слово «терміново», і пріоритет."}\n    elif not any("терміново" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи print(urgent) — у виводі має бути слово «терміново»."}\n    else:\n        __result__ = {"pass": True, "message": "Перевизначення дозволяє підкласу поводитись інакше, лишаючись сумісним із рештою коду, що очікує звичайний Task."}`,
  },
  {
    id: "py-oop-19",
    title: "Поліморфізм: однаковий виклик, різна поведінка",
    type: "python",
    theory:
      "Поліморфізм («багато форм») — це коли ОДИН і той самий виклик (print(task) чи task.complete()) працює правильно для об'єктів РІЗНИХ класів, якщо вони пов'язані успадкуванням. Organizer.list_tasks() з 11-го уроку викликає print(task) для кожного елемента self.tasks — і йому байдуже, це звичайний Task чи UrgentTask.\n\ntasks = [Task(\"Купити хліб\"), UrgentTask(\"Здати проєкт\", \"високий\")]\nfor task in tasks:\n    print(task)  # для Task — звичайний формат, для UrgentTask — з «терміново» і пріоритетом\n\nCаме тому Organizer, написаний ще в 11-му уроці, НЕ потребує жодних змін, щоб працювати з новим класом UrgentTask — це і є практична користь поліморфізму.",
    examples: [
      { title: "Список зі змішаних типів об'єктів", code: `tasks = [Task("Купити хліб"), UrgentTask("Здати проєкт", "високий")]\nfor task in tasks:\n    print(task)`, explain: "Той самий цикл і той самий print(task) автоматично викликають ПРАВИЛЬНУ версію __str__ для кожного типу." },
    ],
    task: `Створи список tasks із одного звичайного Task і одного UrgentTask. Виведи обидва через один і той самий цикл for task in tasks: print(task).`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)\n        self.priority = priority\n    def __str__(self):\n        base = super().__str__()\n        return f"{base} (терміново, {self.priority})"\n\ntasks = [\n    # один Task і один UrgentTask тут\n]\n\n# for task in tasks:\n#     print(task)\n`,
    hints: [`Task("Купити хліб") і UrgentTask("Здати проєкт", "високий") — приклад двох об'єктів.`, `Список: tasks = [Task(...), UrgentTask(...)]`, `tasks = [Task("Купити хліб"), UrgentTask("Здати проєкт", "високий")]\nfor task in tasks:\n    print(task)`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)\n        self.priority = priority\n    def __str__(self):\n        base = super().__str__()\n        return f"{base} (терміново, {self.priority})"\n\ntasks = [Task("Купити хліб"), UrgentTask("Здати проєкт", "високий")]\nfor task in tasks:\n    print(task)`,
    testCode: `if "tasks" not in globals() or len(tasks) < 2:\n    __result__ = {"pass": False, "message": "tasks має містити щонайменше 2 об'єкти."}\nelif not any(isinstance(t, UrgentTask) for t in tasks) or not any(type(t) is Task for t in tasks):\n    __result__ = {"pass": False, "message": "У списку має бути і звичайний Task, і UrgentTask."}\nelif not any("терміново" in l for l in __logs) or not any(("Купити хліб" in l and "терміново" not in l) for l in __logs):\n    __result__ = {"pass": False, "message": "Цикл має вивести обидва об'єкти — звичайний формат для Task і розширений для UrgentTask."}\nelse:\n    __result__ = {"pass": True, "message": "Один цикл, один print(task) — і кожен об'єкт сам «знає», як правильно себе показати. Це і є поліморфізм."}`,
  },
  {
    id: "py-oop-20",
    title: "Фінальний проєкт: ООП-органайзер",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків в одну систему: клас Task (з __init__, complete(), __str__), клас UrgentTask (успадкування, super(), перевизначений __str__) і клас Organizer (add_task, complete_task, list_tasks, stats), що працює з обома типами задач одночасно завдяки поліморфізму.\n\nЦе той самий органайзер справ, що й у фіналі Python Core, — та сама поведінка ззовні (додати, позначити виконаним, показати список, порахувати статистику), але зовсім інша внутрішня організація: не окремі функції над списком словників, а об'єкти, що самі відповідають за себе.",
    examples: [
      { title: "Organizer працює з UrgentTask без жодних змін", code: `organizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.tasks.append(UrgentTask("Здати проєкт", "високий"))\norganizer.complete_task(0)\norganizer.list_tasks()\nprint(organizer.stats())`, explain: "list_tasks() і stats() написані ще в 11-12 уроках і не змінювались — поліморфізм робить решту роботи." },
    ],
    task: `Зібери фінальну версію: Organizer з add_task, complete_task, list_tasks, stats. Додай один Task через add_task("Купити хліб") і один UrgentTask("Здати проєкт", "високий") напряму в organizer.tasks. Познач перший виконаним, виведи список і статистику.`,
    starter: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)\n        self.priority = priority\n    def __str__(self):\n        base = super().__str__()\n        return f"{base} (терміново, {self.priority})"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n    def complete_task(self, index):\n        self.tasks[index].complete()\n    def list_tasks(self):\n        for task in self.tasks:\n            print(task)\n\n    def stats(self):\n        # твій код тут: поверни рядок "Виконано X з Y"\n        pass\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.tasks.append(UrgentTask("Здати проєкт", "високий"))\norganizer.complete_task(0)\n\norganizer.list_tasks()\nprint(organizer.stats())\n`,
    hints: [`stats() — той самий код, що й у 12-му уроці: done = len([t for t in self.tasks if t.done])`, `return f"Виконано {done} з {len(self.tasks)}"`, `def stats(self):\n    done = len([t for t in self.tasks if t.done])\n    return f"Виконано {done} з {len(self.tasks)}"`],
    solution: `class Task:\n    def __init__(self, name, done=False):\n        self.name = name\n        self.done = done\n    def complete(self):\n        self.done = True\n    def __str__(self):\n        mark = "[x]" if self.done else "[ ]"\n        return f"{mark} {self.name}"\n\nclass UrgentTask(Task):\n    def __init__(self, name, priority):\n        super().__init__(name)\n        self.priority = priority\n    def __str__(self):\n        base = super().__str__()\n        return f"{base} (терміново, {self.priority})"\n\nclass Organizer:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, name):\n        self.tasks.append(Task(name))\n    def complete_task(self, index):\n        self.tasks[index].complete()\n    def list_tasks(self):\n        for task in self.tasks:\n            print(task)\n\n    def stats(self):\n        done = len([t for t in self.tasks if t.done])\n        return f"Виконано {done} з {len(self.tasks)}"\n\norganizer = Organizer()\norganizer.add_task("Купити хліб")\norganizer.tasks.append(UrgentTask("Здати проєкт", "високий"))\norganizer.complete_task(0)\n\norganizer.list_tasks()\nprint(organizer.stats())`,
    testCode: `if "Organizer" not in globals() or "UrgentTask" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні класи Organizer, Task і UrgentTask."}\nelif len(organizer.tasks) != 2:\n    __result__ = {"pass": False, "message": "organizer.tasks має містити рівно 2 задачі."}\nelif organizer.stats() != "Виконано 1 з 2":\n    __result__ = {"pass": False, "message": "organizer.stats() має повернути «Виконано 1 з 2»."}\nelif not any("Виконано 1 з 2" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи organizer.stats() через print()."}\nelif not any("терміново" in l for l in __logs):\n    __result__ = {"pass": False, "message": "list_tasks() має показати і UrgentTask із позначкою «терміново»."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Той самий органайзер, що й у Python Core, тепер побудований на класах, успадкуванні та поліморфізмі."}`,
    finalProject: {
      techs: ["Python 3", "class", "__init__/self", "успадкування (inheritance)", "super()", "@property", "поліморфізм"],
      skills: [
        "Класи, об'єкти та конструктор __init__",
        "Методи та атрибути екземпляра й класу",
        "__str__ для читабельного виводу об'єктів",
        "Інкапсуляція через _ і @property",
        "Успадкування, super() і перевизначення методів",
        "Поліморфізм: однаковий код працює з різними класами",
      ],
      structure:
        "organizer_oop.py\n  ├── class Task            # base: name, done, complete(), __str__\n  ├── class UrgentTask(Task) # успадковує Task, додає priority\n  └── class Organizer       # add_task, complete_task, list_tasks, stats",
      code: `class Task:
    def __init__(self, name, done=False):
        self.name = name
        self.done = done

    def complete(self):
        self.done = True

    def __str__(self):
        mark = "[x]" if self.done else "[ ]"
        return f"{mark} {self.name}"


class UrgentTask(Task):
    def __init__(self, name, priority):
        super().__init__(name)
        self.priority = priority

    def __str__(self):
        base = super().__str__()
        return f"{base} (терміново, {self.priority})"


class Organizer:
    def __init__(self):
        self.tasks = []

    def add_task(self, name):
        self.tasks.append(Task(name))

    def complete_task(self, index):
        self.tasks[index].complete()

    def list_tasks(self):
        for task in self.tasks:
            print(task)

    def stats(self):
        done = len([t for t in self.tasks if t.done])
        return f"Виконано {done} з {len(self.tasks)}"


organizer = Organizer()
organizer.add_task("Купити хліб")
organizer.tasks.append(UrgentTask("Здати проєкт", "високий"))
organizer.complete_task(0)

organizer.list_tasks()
print(organizer.stats())`,
      runCommand: "python organizer_oop.py",
      improvements: [
        "Додати клас RecurringTask(Task) для повторюваних задач (щодня/щотижня)",
        "Зберігати задачі у файл через метод Organizer.save_to_file()",
        "Додати власний виняток (Exception) TaskNotFoundError замість голого IndexError",
        "Використати абстрактний базовий клас (abc.ABC), щоб гарантувати, що кожен підклас Task реалізує власний __str__",
      ],
      nextLevel:
        "Далі — 🎮 Game Development: той самий принцип класів (Player, Enemy, Bullet) і успадкування (Enemy → BossEnemy) лежить в основі практично кожної гри на Pygame — game loop оновлює й малює об'єкти так само, як Organizer керує задачами.",
    },
  },
];
