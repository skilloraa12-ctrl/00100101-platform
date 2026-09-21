// Python Core — the foundational Python direction. Structure per the spec:
// an "intro" lesson (type: "intro", no code/check — just orientation) followed
// by 20 real lessons (type: "python", executed for real via Pyodide/WASM in
// runPythonCheck), building step by step toward one cumulative project — a
// console to-do organizer — and ending with a "finalProject" reveal.
export const PYTHON_CORE_LESSONS = [
  {
    id: "py-core-intro",
    title: "Що це? — Python Core",
    type: "intro",
    theory:
      "Python Core — це фундамент: синтаксис самої мови Python, без якого жоден інший напрямок (ігри, автоматизація, аналіз даних, backend, AI) просто неможливий. Це не «ще один» напрямок серед шістнадцяти — це ЄДИНИЙ напрямок, з якого мають починати геть усі.\n\nPython тут виконує роль звичайної мови програмування: ти пишеш ІНСТРУКЦІЇ (код), Python-інтерпретатор виконує їх одна за одною, рядок за рядком, і видає результат. На цьому етапі не буде ігор, вебсайтів чи баз даних — лише сама мова: змінні, умови, цикли, функції, списки, словники — цеглинки, з яких будується АБСОЛЮТНО все інше.\n\nЦі знання застосовують УСЮДИ: Python OOP (наступний крок) організовує ці цеглинки в класи; Automation комбінує їх для роботи з файлами; Data Analysis та AI обробляють ними таблиці даних; Backend і API приймають ними запити від користувачів. Жодних зовнішніх бібліотек тут не знадобиться — лише сам Python, що вже вбудований у платформу.\n\nЩо потрібно ПЕРЕД початком: нічого, окрім бажання розібратись — це справді перший крок. Що ти отримаєш ПІСЛЯ 20 уроків: впевнене читання й написання Python-коду, і готовий консольний проєкт — особистий органайзер справ (список завдань із додаванням, позначенням виконаного, підрахунком статистики та збереженням у файл), зібраний поступово, урок за уроком, а не одним фінальним стрибком.",
    presentation: [
      { title: "Python Core — коротко", points: ["Фундамент для всіх інших 15 напрямків Python", "Синтаксис мови: змінні, умови, цикли, функції, структури даних", "Жодних зовнішніх бібліотек — лише сам Python"] },
      { title: "Результат", points: ["20 уроків, кожен додає нову можливість", "Фінал: власний консольний органайзер справ", "Код реально виконується в браузері (Pyodide), як у справжньому Python"] },
    ],
  },
  {
    id: "py-core-1",
    title: "Що таке Python і print()",
    type: "python",
    theory:
      "Python — інтерпретована мова програмування: код виконується рядок за рядком, без окремого етапу компіляції. Це робить Python зручним для навчання — написав рядок, одразу побачив результат, без зайвих кроків між ними.\n\nprint(...) — перша й найважливіша функція, з якою варто познайомитись: вона виводить будь-яке значення на екран (точніше, у stdout — стандартний потік виводу). print(\"Привіт\") виведе текст Привіт; print(2025) виведе число 2025; можна передати кілька значень через кому — print(\"Вік:\", 25) виведе Вік: 25, автоматично розділяючи їх пробілом.\n\nНа відміну від JavaScript, де рядки коду завершує (необов'язкова) крапка з комою, у Python КРАПКА З КОМОЮ в кінці рядка НЕ ПОТРІБНА взагалі — кожен новий рядок сам по собі є завершеною інструкцією. Це перша помітна відмінність синтаксису, яку варто запам'ятати одразу.\n\nУ пісочниці цієї платформи (як і в реальному Python) вивід print() з'являється в окремому блоці «Вивід» під кодом після натискання «Перевірити» чи «Запустити» — так само, як консоль у JS-курсі.",
    examples: [
      { title: "Базовий print", code: `print("Привіт, Python!")\nprint(2025)\nprint("Вік:", 25)`, explain: "Кожен print() виводить свій рядок; кілька значень через кому розділяються пробілом автоматично." },
      { title: "Без крапки з комою", code: `print("Перший рядок")\nprint("Другий рядок")\n# жодної ; в кінці — і не треба`, explain: "На відміну від JS, Python не використовує крапку з комою в кінці інструкції." },
    ],
    task: `Виведи рядок "Привіт, Python!" за допомогою print().`,
    starter: "# Напиши свій код тут\n",
    hints: [`print(...) приймає значення в дужках.`, `Рядок пишеться в лапках — одинарних чи подвійних, Python приймає обидва.`, `print("Привіт, Python!")`],
    solution: `print("Привіт, Python!")`,
    testCode: `if not any("Привіт" in l for l in __logs):\n    __result__ = {"pass": False, "message": "У виводі має з'явитися рядок зі словом «Привіт»."}\nelse:\n    __result__ = {"pass": True, "message": "print() — перший інструмент, який знадобиться в кожному наступному уроці, щоб побачити результат роботи коду."}`,
  },
  {
    id: "py-core-2",
    title: "Змінні та типи даних",
    type: "python",
    theory:
      "Змінна — це іменована комірка, у якій зберігається значення. На відміну від JS (де є let/const/var), у Python не пишуть жодного ключового слова — просто ім'я, знак = і значення: name = \"Олекса\". Python сам визначає тип значення під час присвоєння — це називається динамічна типізація.\n\nОсновні вбудовані типи: str — текст у лапках (\"Привіт\"), int — ціле число (16), float — дробове число (16.5), bool — логічне значення (True або False, обов'язково з великої літери). Дізнатися тип будь-якої змінної можна функцією type(x).\n\nІмена змінних у Python традиційно пишуть у стилі snake_case (task_name, is_done), а не camelCase, як у JS (taskName). Це просто угода в спільноті, а не правило мови, але дотримуватись її варто, щоб код виглядав «по-пітонячому».",
    examples: [
      { title: "Різні типи", code: `name = "Олекса"\nage = 16\nheight = 178.5\nis_student = True\n\nprint(type(name))\nprint(type(age))\nprint(type(height))\nprint(type(is_student))`, explain: "type() показує клас значення: <class 'str'>, <class 'int'>, <class 'float'>, <class 'bool'>." },
    ],
    task: `Створи змінну name зі своїм ім'ям (рядок) та змінну age зі своїм віком (ціле число). Виведи обидві змінні окремими print().`,
    starter: `name = ...\nage = ...\n\n# print(...)\n# print(...)\n`,
    hints: [`Рядок — у лапках, число — без лапок.`, `Два окремих виклики print(): один для name, один для age.`, `name = "Олекса"\nage = 16\nprint(name)\nprint(age)`],
    solution: `name = "Олекса"\nage = 16\nprint(name)\nprint(age)`,
    testCode: `if "name" not in globals() or not isinstance(name, str) or not name.strip():\n    __result__ = {"pass": False, "message": "Змінна name має бути непорожнім рядком."}\nelif "age" not in globals() or not isinstance(age, int) or isinstance(age, bool):\n    __result__ = {"pass": False, "message": "Змінна age має бути цілим числом (int)."}\nelif len(__logs) < 2:\n    __result__ = {"pass": False, "message": "Виведи обидві змінні — має бути щонайменше два рядки у виводі."}\nelse:\n    __result__ = {"pass": True, "message": "Дві змінні різних типів — це вже перші «цеглинки» майбутнього органайзера справ."}`,
  },
  {
    id: "py-core-3",
    title: "f-рядки: об'єднання тексту та змінних",
    type: "python",
    theory:
      "f-рядок (f-string) — це спосіб вставити значення змінних прямо всередину тексту. Досить поставити літеру f перед лапками, а всередині рядка написати ім'я змінної у фігурних дужках: f\"Мене звати {name}\". Python сам підставить значення на місце {name}.\n\nЦе набагато зручніше за додавання рядків через + (як у JS: \"Мене звати \" + name), бо не треба вручну перетворювати числа на рядки чи стежити за пробілами — f-рядок робить це сам. Всередині фігурних дужок можна писати не лише ім'я змінної, а й вираз: f\"Через рік мені буде {age + 1}\".",
    examples: [
      { title: "f-рядок з кількома змінними", code: `name = "Олекса"\nage = 16\nprint(f"Мене звати {name}, мені {age} років")`, explain: "Обидва значення підставляються в один текстовий рядок без ручної конкатенації." },
      { title: "Вираз усередині {}", code: `age = 16\nprint(f"Через рік мені буде {age + 1}")`, explain: "У фігурних дужках можна писати не лише змінну, а й обчислення." },
    ],
    task: `Виведи ОДНЕ речення, яке через f-рядок містить і ім'я, і вік, наприклад: "Мене звати Олекса, мені 16 років".`,
    starter: `name = "Олекса"\nage = 16\n\n# print(f"...")\n`,
    hints: [`Постав літеру f одразу перед лапками рядка.`, `Ім'я змінної всередині тексту бери у фігурні дужки: {name}.`, `print(f"Мене звати {name}, мені {age} років")`],
    solution: `name = "Олекса"\nage = 16\nprint(f"Мене звати {name}, мені {age} років")`,
    testCode: `combined = any(any(c.isdigit() for c in l) and any(c.isalpha() for c in l) for l in __logs)\nif not combined:\n    __result__ = {"pass": False, "message": "У виводі має бути ОДИН рядок, що містить і текст, і число — саме для цього й потрібен f-рядок."}\nelse:\n    __result__ = {"pass": True, "message": "f-рядки постійно знадобляться далі — саме ними органайзер друкуватиме задачі."}`,
  },
  {
    id: "py-core-4",
    title: "Списки: перша структура даних",
    type: "python",
    theory:
      "Список (list) — упорядкована колекція значень в одній змінній, у квадратних дужках через кому: tasks = [\"Купити хліб\", \"Зробити домашку\", \"Погуляти\"]. Це прямий аналог масиву (array) у JavaScript.\n\nДо елемента можна звернутись за індексом, який починається з 0: tasks[0] — перший елемент, tasks[1] — другий. len(tasks) повертає кількість елементів у списку. Саме список стане структурою даних, у якій органайзер зберігатиме всі задачі.",
    examples: [
      { title: "Створення та довжина", code: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\nprint(tasks)\nprint(len(tasks))`, explain: "print(tasks) виводить весь список одразу; len() — кількість елементів." },
      { title: "Доступ за індексом", code: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\nprint(tasks[0])`, explain: "Індексація починається з 0, як і в JS." },
    ],
    task: `Створи список tasks із трьома задачами-рядками і виведи весь список за допомогою print(tasks).`,
    starter: `tasks = [\n    # твої задачі тут\n]\n\n# print(tasks)\n`,
    hints: [`Список пишеться в квадратних дужках: [елемент1, елемент2, елемент3].`, `Кожен елемент — рядок у лапках.`, `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\nprint(tasks)`],
    solution: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\nprint(tasks)`,
    testCode: `if "tasks" not in globals() or not isinstance(tasks, list):\n    __result__ = {"pass": False, "message": "Створи змінну tasks зі списком (list)."}\nelif len(tasks) < 3:\n    __result__ = {"pass": False, "message": "У списку tasks має бути щонайменше 3 задачі."}\nelif not any(l.strip().startswith("[") for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи весь список одним print(tasks)."}\nelse:\n    __result__ = {"pass": True, "message": "Список tasks — це і є майбутня «база даних» органайзера справ."}`,
  },
  {
    id: "py-core-5",
    title: "Додавання елементів: .append()",
    type: "python",
    theory:
      "Список можна змінювати після створення. Метод .append(значення) додає новий елемент у КІНЕЦЬ списку: tasks.append(\"Новина задача\"). Це найпоширеніший спосіб наповнювати список поступово — саме так органайзер додаватиме нові задачі одну за одною, а не переписуючи список заново щоразу.\n\nЗверни увагу: tasks.append(...) нічого не повертає — він одразу змінює сам список tasks. Тому не треба писати tasks = tasks.append(...) (це «зламає» список, замінивши його на None).",
    examples: [
      { title: "append() у дії", code: `tasks = ["Купити хліб"]\ntasks.append("Зробити домашку")\nprint(tasks)`, explain: "Після append() список має вже 2 елементи замість одного." },
    ],
    task: `Список tasks уже містить дві задачі. Додай третю за допомогою tasks.append(...) і виведи оновлений список.`,
    starter: `tasks = ["Купити хліб", "Зробити домашку"]\n\n# tasks.append(...)\n# print(tasks)\n`,
    hints: [`.append(...) викликається на самому списку: tasks.append("Погуляти").`, `Після append() виклич print(tasks), щоб побачити результат.`, `tasks = ["Купити хліб", "Зробити домашку"]\ntasks.append("Погуляти")\nprint(tasks)`],
    solution: `tasks = ["Купити хліб", "Зробити домашку"]\ntasks.append("Погуляти")\nprint(tasks)`,
    testCode: `if "tasks" not in globals() or not isinstance(tasks, list):\n    __result__ = {"pass": False, "message": "Змінна tasks має залишитись списком."}\nelif len(tasks) < 3:\n    __result__ = {"pass": False, "message": "Додай третю задачу через tasks.append(...) — у списку має стати 3 елементи."}\nelif not any(l.strip().startswith("[") for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи оновлений список через print(tasks)."}\nelse:\n    __result__ = {"pass": True, "message": "append() — саме так органайзер прийматиме нові задачі одну за одною."}`,
  },
  {
    id: "py-core-6",
    title: "Умовні конструкції: if / else",
    type: "python",
    theory:
      "if перевіряє умову і виконує блок коду лише якщо вона істинна (True); else — запасний варіант, коли умова хибна (False). У Python БЛОК коду визначається не фігурними дужками (як у JS), а ВІДСТУПОМ (зазвичай 4 пробіли) — це важлива відмінність синтаксису.\n\nif len(tasks) == 0:\n    print(\"Список порожній\")\nelse:\n    print(\"Є задачі\")\n\nОператори порівняння такі самі, як у JS: ==, !=, <, >, <=, >=. Але замість && і || Python використовує слова and і or.",
    examples: [
      { title: "if / else за довжиною списку", code: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\nif len(tasks) == 0:\n    print("Список порожній")\nelse:\n    print(f"У списку {len(tasks)} задач(і)")`, explain: "Відступ (4 пробіли) визначає, що саме належить до блоку if, а що — до else." },
    ],
    task: `Список tasks уже заповнений. Напиши if/else: якщо список порожній — виведи "Список порожній", інакше виведи кількість задач у форматі "У списку 3 задач(і)" (число підстав через f-рядок).`,
    starter: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\n# if len(tasks) == 0:\n#     ...\n# else:\n#     ...\n`,
    hints: [`Умова: if len(tasks) == 0:`, `Не забудь однаковий відступ (4 пробіли) для рядків усередині if і всередині else.`, `if len(tasks) == 0:\n    print("Список порожній")\nelse:\n    print(f"У списку {len(tasks)} задач(і)")`],
    solution: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\nif len(tasks) == 0:\n    print("Список порожній")\nelse:\n    print(f"У списку {len(tasks)} задач(і)")`,
    testCode: `has_number = any(any(c.isdigit() for c in l) for l in __logs)\nif not has_number:\n    __result__ = {"pass": False, "message": "У виводі має бути число — кількість задач у списку (гілка else, бо tasks не порожній)."}\nelse:\n    __result__ = {"pass": True, "message": "if/else дозволить органайзеру по-різному реагувати на порожній і заповнений список."}`,
  },
  {
    id: "py-core-7",
    title: "Цикл for: обробка кожного елемента",
    type: "python",
    theory:
      "Цикл for проходить по кожному елементу списку (чи іншої колекції) по черзі: for task in tasks: print(task). Змінна task тут — це поточний елемент на кожному кроці; ім'я можна обрати будь-яке.\n\nЦе аналог for...of у JavaScript. На відміну від класичного for (i = 0; i < n; i++), тут не треба вручну керувати індексом чи умовою завершення — Python сам зупиниться, коли елементи в списку закінчаться.",
    examples: [
      { title: "for по списку", code: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\nfor task in tasks:\n    print(task)`, explain: "Кожен елемент списку виводиться окремим рядком — цикл виконується стільки разів, скільки елементів у списку." },
    ],
    task: `Виведи кожну задачу зі списку tasks окремим рядком за допомогою циклу for.`,
    starter: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\n# for task in tasks:\n#     print(task)\n`,
    hints: [`for task in tasks: — і не забудь двокрапку в кінці.`, `Рядок print(task) має мати відступ, бо він усередині циклу.`, `for task in tasks:\n    print(task)`],
    solution: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\nfor task in tasks:\n    print(task)`,
    testCode: `if len(__logs) < 3:\n    __result__ = {"pass": False, "message": "Має бути виведено щонайменше 3 рядки — по одному на кожну задачу зі списку."}\nelse:\n    __result__ = {"pass": True, "message": "Цикл for — головний інструмент, яким органайзер показуватиме всі задачі одразу."}`,
  },
  {
    id: "py-core-8",
    title: "enumerate(): нумерований список",
    type: "python",
    theory:
      "enumerate(tasks) під час циклу for одночасно дає і індекс, і сам елемент: for i, task in enumerate(tasks): print(i, task). За замовчуванням індекс i починається з 0, але можна почати з 1: enumerate(tasks, start=1) — зручно, коли задачі треба показати людині пронумерованими «1, 2, 3...», а не «0, 1, 2...».\n\nЦе значно зручніше за ручне ведення лічильника (як довелося б робити в JS без .map((t, i) => ...)).",
    examples: [
      { title: "Нумерація з 1", code: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\nfor i, task in enumerate(tasks, start=1):\n    print(f"{i}. {task}")`, explain: "start=1 робить нумерацію звичною для людини: 1, 2, 3, а не 0, 1, 2." },
    ],
    task: `Виведи задачі зі списку tasks у форматі "1. Купити хліб", "2. Зробити домашку" і т.д., використовуючи enumerate() з start=1.`,
    starter: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\n# for i, task in enumerate(tasks, start=1):\n#     print(f"{i}. {task}")\n`,
    hints: [`enumerate(tasks, start=1) дає пари (номер, задача).`, `У циклі пиши: for i, task in enumerate(tasks, start=1):`, `for i, task in enumerate(tasks, start=1):\n    print(f"{i}. {task}")`],
    solution: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\nfor i, task in enumerate(tasks, start=1):\n    print(f"{i}. {task}")`,
    testCode: `numbered = any(l.strip()[:1].isdigit() and "." in l for l in __logs if l.strip())\nif not numbered:\n    __result__ = {"pass": False, "message": "Кожен рядок має починатися з номера й крапки, наприклад «1. Купити хліб» — саме це й дає enumerate()."}\nelif len(__logs) < 3:\n    __result__ = {"pass": False, "message": "Мають бути пронумеровані всі задачі зі списку."}\nelse:\n    __result__ = {"pass": True, "message": "Саме так органайзер показуватиме список справ користувачу — з номерами."}`,
  },
  {
    id: "py-core-9",
    title: "Функції: def і параметри",
    type: "python",
    theory:
      "Функція — це іменований, багаторазово використовуваний шматок коду. Оголошується словом def, іменем, параметрами в дужках і двокрапкою: def add_task(tasks, name):. Тіло функції — з відступом, як і в if/for.\n\nПараметри (tasks, name) — це «вхідні дані», значення яких передають при виклику: add_task(tasks, \"Погуляти\"). Функції — головний спосіб уникнути повторення коду: замість того, щоб щоразу вручну писати tasks.append(...), можна один раз описати цю дію як функцію й потім просто викликати її.",
    examples: [
      { title: "Функція без return", code: `def add_task(tasks, name):\n    tasks.append(name)\n\ntasks = ["Купити хліб"]\nadd_task(tasks, "Зробити домашку")\nprint(tasks)`, explain: "Функція add_task приймає список і назву задачі, додає задачу в список — список змінюється «на місці», без return." },
    ],
    task: `Допиши тіло функції add_task(tasks, name), яка додає name у список tasks через .append(). Виклич add_task(tasks, "Зробити домашку") і виведи tasks.`,
    starter: `def add_task(tasks, name):\n    # твій код тут\n    pass\n\ntasks = ["Купити хліб"]\nadd_task(tasks, "Зробити домашку")\nprint(tasks)\n`,
    hints: [`Усередині функції: tasks.append(name).`, `Прибери рядок pass — він більше не потрібен, коли є справжній код.`, `def add_task(tasks, name):\n    tasks.append(name)\n\ntasks = ["Купити хліб"]\nadd_task(tasks, "Зробити домашку")\nprint(tasks)`],
    solution: `def add_task(tasks, name):\n    tasks.append(name)\n\ntasks = ["Купити хліб"]\nadd_task(tasks, "Зробити домашку")\nprint(tasks)`,
    testCode: `if "add_task" not in globals() or not callable(add_task):\n    __result__ = {"pass": False, "message": "Потрібна функція з іменем add_task."}\nelif "tasks" not in globals() or len(tasks) < 2:\n    __result__ = {"pass": False, "message": "Після виклику add_task(tasks, ...) у списку tasks має стати 2 елементи."}\nelse:\n    __result__ = {"pass": True, "message": "add_task() — перша «справжня» функція органайзера, яку викличемо ще багато разів."}`,
  },
  {
    id: "py-core-10",
    title: "Функції, що повертають значення: return",
    type: "python",
    theory:
      "return всередині функції завершує її виконання й передає значення назад туди, звідки функцію викликали. Це відрізняється від add_task() з попереднього уроку, яка нічого не повертала, а просто змінювала список.\n\ndef count_tasks(tasks):\n    return len(tasks)\n\nРезультат виклику можна одразу зберегти у змінну (total = count_tasks(tasks)) або вивести напряму (print(count_tasks(tasks))). Функції, що повертають значення, — це те, як Python-програми зазвичай отримують результати обчислень.",
    examples: [
      { title: "Функція з return", code: `def count_tasks(tasks):\n    return len(tasks)\n\ntasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\nprint(f"Задач: {count_tasks(tasks)}")`, explain: "count_tasks() повертає число, яке одразу підставляється в f-рядок." },
    ],
    task: `Напиши функцію count_tasks(tasks), яка повертає кількість задач (len(tasks)). Виведи результат у форматі "Задач: 3" через f-рядок.`,
    starter: `def count_tasks(tasks):\n    # твій код тут\n    pass\n\ntasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n# print(f"Задач: {...}")\n`,
    hints: [`Усередині функції напиши: return len(tasks)`, `Виклич функцію прямо всередині f-рядка: f"Задач: {count_tasks(tasks)}"`, `def count_tasks(tasks):\n    return len(tasks)\n\ntasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\nprint(f"Задач: {count_tasks(tasks)}")`],
    solution: `def count_tasks(tasks):\n    return len(tasks)\n\ntasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\nprint(f"Задач: {count_tasks(tasks)}")`,
    testCode: `if "count_tasks" not in globals() or not callable(count_tasks):\n    __result__ = {"pass": False, "message": "Потрібна функція з іменем count_tasks."}\nelif count_tasks(tasks) != 3:\n    __result__ = {"pass": False, "message": "count_tasks(tasks) має повертати число задач у списку (len(tasks))."}\nelif not any("3" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи результат count_tasks(tasks) у повідомленні."}\nelse:\n    __result__ = {"pass": True, "message": "return дозволяє функції не просто щось зробити, а й повернути готовий результат для подальшого використання."}`,
  },
  {
    id: "py-core-11",
    title: "Словники: задача як набір властивостей",
    type: "python",
    theory:
      "Досі задача була просто рядком тексту. Але справжній органайзер має пам'ятати ще й чи виконана вона. Словник (dict) — колекція пар ключ: значення у фігурних дужках: task = {\"name\": \"Купити хліб\", \"done\": False}. Це прямий аналог об'єкта ({}) у JavaScript.\n\nДоступ до значення — через ключ у квадратних дужках: task[\"name\"] поверне \"Купити хліб\", task[\"done\"] поверне False. Саме словник стане «формою» однієї задачі в органайзері — замість простого рядка.",
    examples: [
      { title: "Створення й читання словника", code: `task = {"name": "Купити хліб", "done": False}\nprint(task["name"])\nprint(task["done"])`, explain: "Ключі \"name\" і \"done\" — це «поля» однієї задачі; значення дістають через task[ключ]." },
    ],
    task: `Створи словник task із ключами "name" (рядок з назвою задачі) і "done" (False). Виведи task["name"] і task["done"] окремими print().`,
    starter: `task = {\n    "name": ...,\n    "done": ...,\n}\n\n# print(task["name"])\n# print(task["done"])\n`,
    hints: [`Ключі й значення розділяються двокрапкою: "name": "Купити хліб".`, `Значення для "done" — булеве False (без лапок).`, `task = {"name": "Купити хліб", "done": False}\nprint(task["name"])\nprint(task["done"])`],
    solution: `task = {"name": "Купити хліб", "done": False}\nprint(task["name"])\nprint(task["done"])`,
    testCode: `if "task" not in globals() or not isinstance(task, dict):\n    __result__ = {"pass": False, "message": "Створи словник task з ключами name і done."}\nelif "name" not in task or "done" not in task:\n    __result__ = {"pass": False, "message": "У словнику task мають бути ключі \\"name\\" і \\"done\\"."}\nelif task["done"] is not False:\n    __result__ = {"pass": False, "message": "task[\\"done\\"] має дорівнювати False — задача ще не виконана."}\nelif not any(l.strip() == "False" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи task[\\"done\\"] окремим print() — у виводі має з'явитися рядок False."}\nelse:\n    __result__ = {"pass": True, "message": "Тепер задача — не просто текст, а об'єкт із назвою і статусом виконання."}`,
  },
  {
    id: "py-core-12",
    title: "Список словників: повний список задач",
    type: "python",
    theory:
      "Об'єднаємо два попередні уроки: список (list) із минулих уроків тепер міститиме не рядки, а словники (dict) — кожен зі своєю назвою і статусом: tasks = [{\"name\": \"Купити хліб\", \"done\": False}, {\"name\": \"Погуляти\", \"done\": True}]. Це і є справжня структура даних майбутнього органайзера.\n\nУ циклі for task in tasks: змінна task на кожному кроці — це один словник, тому task[\"name\"] і task[\"done\"] доступні всередині циклу. Комбінуючи цикл з if/else, можна показати задачу по-різному залежно від того, виконана вона чи ні: \"[x] назва\" або \"[ ] назва\".",
    examples: [
      { title: "Цикл + умова всередині", code: `tasks = [\n    {"name": "Купити хліб", "done": False},\n    {"name": "Погуляти", "done": True},\n]\n\nfor task in tasks:\n    if task["done"]:\n        print(f"[x] {task['name']}")\n    else:\n        print(f"[ ] {task['name']}")`, explain: "Кожна задача виводиться з позначкою [x] (виконано) або [ ] (ще ні), залежно від task['done']." },
    ],
    task: `Список tasks містить словники з задачами. Виведи кожну задачу у форматі "[x] назва" якщо done True, або "[ ] назва" якщо done False.`,
    starter: `tasks = [\n    {"name": "Купити хліб", "done": False},\n    {"name": "Погуляти", "done": True},\n]\n\n# for task in tasks:\n#     if task["done"]:\n#         ...\n#     else:\n#         ...\n`,
    hints: [`Усередині циклу перевіряй: if task["done"]:`, `Формат рядка: f"[x] {task['name']}" або f"[ ] {task['name']}"`, `for task in tasks:\n    if task["done"]:\n        print(f"[x] {task['name']}")\n    else:\n        print(f"[ ] {task['name']}")`],
    solution: `tasks = [\n    {"name": "Купити хліб", "done": False},\n    {"name": "Погуляти", "done": True},\n]\n\nfor task in tasks:\n    if task["done"]:\n        print(f"[x] {task['name']}")\n    else:\n        print(f"[ ] {task['name']}")`,
    testCode: `has_done = any("[x]" in l for l in __logs)\nhas_pending = any("[ ]" in l for l in __logs)\nif not (has_done and has_pending):\n    __result__ = {"pass": False, "message": "Має бути і виконана задача (з [x]), і невиконана (з [ ]) — перевір, що умова if/else реагує на кожну задачу окремо."}\nelse:\n    __result__ = {"pass": True, "message": "Це вже практично те, як виглядатиме список справ у фінальному органайзері."}`,
  },
  {
    id: "py-core-13",
    title: "Позначення задачі виконаною",
    type: "python",
    theory:
      "Значення в словнику можна змінювати так само, як у змінній: task[\"done\"] = True перезаписує поле done без створення нового словника. Обгорнемо це у функцію complete_task(tasks, index), яка позначає виконаною задачу за її номером (індексом) у списку: tasks[index][\"done\"] = True.\n\nЦе саме той момент, коли задачі в органайзері переходять зі стану «в роботі» у стан «зроблено» — базова дія будь-якого to-do застосунку.",
    examples: [
      { title: "complete_task за індексом", code: `def complete_task(tasks, index):\n    tasks[index]["done"] = True\n\ntasks = [{"name": "Купити хліб", "done": False}]\ncomplete_task(tasks, 0)\nprint(tasks[0]["done"])`, explain: "tasks[index] дістає потрібний словник зі списку, а ['done'] = True змінює в ньому одне поле." },
    ],
    task: `Напиши функцію complete_task(tasks, index), яка встановлює tasks[index]["done"] = True. Виклич complete_task(tasks, 0), а потім виведи кожну задачу у форматі "[x]/[ ] назва", як у попередньому уроці.`,
    starter: `def complete_task(tasks, index):\n    # твій код тут\n    pass\n\ntasks = [\n    {"name": "Купити хліб", "done": False},\n    {"name": "Погуляти", "done": True},\n]\n\ncomplete_task(tasks, 0)\n\nfor task in tasks:\n    if task["done"]:\n        print(f"[x] {task['name']}")\n    else:\n        print(f"[ ] {task['name']}")\n`,
    hints: [`Усередині функції: tasks[index]["done"] = True`, `index — це номер задачі в списку (0 — перша).`, `def complete_task(tasks, index):\n    tasks[index]["done"] = True`],
    solution: `def complete_task(tasks, index):\n    tasks[index]["done"] = True\n\ntasks = [\n    {"name": "Купити хліб", "done": False},\n    {"name": "Погуляти", "done": True},\n]\n\ncomplete_task(tasks, 0)\n\nfor task in tasks:\n    if task["done"]:\n        print(f"[x] {task['name']}")\n    else:\n        print(f"[ ] {task['name']}")`,
    testCode: `if "complete_task" not in globals() or not callable(complete_task):\n    __result__ = {"pass": False, "message": "Потрібна функція з іменем complete_task."}\nelif "tasks" not in globals() or tasks[0]["done"] is not True:\n    __result__ = {"pass": False, "message": "Після complete_task(tasks, 0) перша задача має мати done == True."}\nelif any("[ ]" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Обидві задачі мають бути позначені як [x] — перша через complete_task, друга вже мала done=True."}\nelif not any("[x]" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи задачі у форматі [x]/[ ] назва, як у попередньому уроці."}\nelse:\n    __result__ = {"pass": True, "message": "Тепер органайзер уміє не лише показувати задачі, а й позначати їх виконаними."}`,
  },
  {
    id: "py-core-14",
    title: "Цикл while: обробка черги задач",
    type: "python",
    theory:
      "while повторює блок коду, поки умова істинна — на відміну від for, який завжди проходить по відомій наперед колекції, while може повторюватись, поки не виконається якась умова, наприклад «поки список не порожній»: while tasks: (порожній список у Python — це «хибне» значення, непорожній — «істинне»).\n\ntasks.pop(0) забирає й повертає ПЕРШИЙ елемент списку, одночасно видаляючи його зі списку — зручно, щоб «обробити» всі задачі по черзі, поки їх не залишиться. Так можна змоделювати чергу задач, які органайзер обробляє одну за одною.",
    examples: [
      { title: "Обробка черги через while", code: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\nwhile tasks:\n    current = tasks.pop(0)\n    print(f"Обробляю: {current}")\n\nprint("Черга порожня")`, explain: "Цикл виконується, поки в tasks лишаються елементи; pop(0) щоразу зменшує список." },
    ],
    task: `Використай цикл while, щоб забрати й вивести кожну задачу зі списку tasks через tasks.pop(0), поки список не стане порожнім.`,
    starter: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\n# while tasks:\n#     current = tasks.pop(0)\n#     print(current)\n`,
    hints: [`Умова циклу: while tasks: (спрацьовує, поки список непорожній).`, `Усередині: current = tasks.pop(0), потім print(current).`, `while tasks:\n    current = tasks.pop(0)\n    print(current)`],
    solution: `tasks = ["Купити хліб", "Зробити домашку", "Погуляти"]\n\nwhile tasks:\n    current = tasks.pop(0)\n    print(current)`,
    testCode: `if "tasks" not in globals():\n    __result__ = {"pass": False, "message": "Змінна tasks має існувати після циклу."}\nelif len(tasks) != 0:\n    __result__ = {"pass": False, "message": "Після циклу while список tasks має стати порожнім (усі задачі оброблено)."}\nelif len(__logs) < 3:\n    __result__ = {"pass": False, "message": "Кожна задача має бути виведена в процесі обробки — очікується 3 рядки виводу."}\nelse:\n    __result__ = {"pass": True, "message": "while — інструмент для ситуацій, коли наперед невідомо, скільки разів треба повторити дію."}`,
  },
  {
    id: "py-core-15",
    title: "Обробка помилок: try / except",
    type: "python",
    theory:
      "Якщо звернутись до неіснуючого індексу списку (наприклад tasks[10], коли задач лише 3), Python «падає» з помилкою IndexError і виконання зупиняється. try/except дозволяє перехопити таку помилку й ГІДНО відреагувати, замість аварійного завершення програми.\n\ntry:\n    ризикований_код\nexcept IndexError:\n    print(\"Такої задачі немає\")\n\nЦе особливо важливо для complete_task() з 13-го уроку: користувач органайзера може ввести неіснуючий номер задачі, і замість краху програма має ввічливо повідомити про помилку.",
    examples: [
      { title: "Перехоплення IndexError", code: `tasks = ["Купити хліб"]\n\ntry:\n    print(tasks[5])\nexcept IndexError:\n    print("Такої задачі немає")`, explain: "Замість аварійного завершення програма виводить зрозуміле повідомлення й продовжує роботу." },
    ],
    task: `Список tasks містить лише одну задачу. Спробуй вивести tasks[5] у блоці try, а в except IndexError виведи повідомлення "Такої задачі немає".`,
    starter: `tasks = ["Купити хліб"]\n\n# try:\n#     print(tasks[5])\n# except IndexError:\n#     print("Такої задачі немає")\n`,
    hints: [`Ризикований код (tasks[5]) розміщується всередині try:`, `except IndexError: перехоплює саме цю помилку.`, `try:\n    print(tasks[5])\nexcept IndexError:\n    print("Такої задачі немає")`],
    solution: `tasks = ["Купити хліб"]\n\ntry:\n    print(tasks[5])\nexcept IndexError:\n    print("Такої задачі немає")`,
    testCode: `if not any("немає" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має спрацювати except IndexError і вивести повідомлення про відсутню задачу."}\nelse:\n    __result__ = {"pass": True, "message": "try/except захистить органайзер від аварійного завершення при некоректному номері задачі."}`,
  },
  {
    id: "py-core-16",
    title: "Методи рядків: .strip() і .lower()",
    type: "python",
    theory:
      "Рядки мають вбудовані методи для очищення й нормалізації тексту. .strip() прибирає зайві пробіли (і переноси рядків) з початку й кінця рядка — корисно, коли текст введено користувачем і міг випадково містити пробіли: \"  Купити хліб  \".strip() → \"Купити хліб\".\n\n.lower() переводить весь текст у нижній регістр — зручно для порівняння без урахування регістру: \"ХЛІБ\".lower() == \"хліб\".lower() дасть True, навіть якщо оригінальні рядки написані по-різному. Ці два методи часто застосовують РАЗОМ одразу після отримання тексту від користувача, перш ніж його десь зберегти чи порівняти.",
    examples: [
      { title: "strip + lower разом", code: `raw = "  Купити ХЛІБ  "\nclean = raw.strip().lower()\nprint(f"'{raw}' -> '{clean}'")`, explain: "Методи можна поєднувати ланцюжком: .strip().lower() виконується зліва направо." },
    ],
    task: `Змінна raw містить рядок із зайвими пробілами й великими літерами. Створи змінну clean, застосувавши до raw .strip() і .lower(), та виведи clean.`,
    starter: `raw = "   Зробити ДОМАШКУ   "\n\n# clean = raw...\n# print(clean)\n`,
    hints: [`Можна викликати методи ланцюжком: raw.strip().lower()`, `Результат збережи в нову змінну clean.`, `raw = "   Зробити ДОМАШКУ   "\nclean = raw.strip().lower()\nprint(clean)`],
    solution: `raw = "   Зробити ДОМАШКУ   "\nclean = raw.strip().lower()\nprint(clean)`,
    testCode: `if "clean" not in globals() or not isinstance(clean, str):\n    __result__ = {"pass": False, "message": "Створи змінну clean зі значенням після .strip().lower()."}\nelif clean != clean.strip().lower() or clean != clean.lower() or clean.startswith(" ") or clean.endswith(" "):\n    __result__ = {"pass": False, "message": "clean має бути без пробілів по краях і повністю в нижньому регістрі."}\nelse:\n    __result__ = {"pass": True, "message": "Так органайзер очищатиме назви задач, які вводить користувач, перед збереженням."}`,
  },
  {
    id: "py-core-17",
    title: "Статистика: підрахунок виконаних задач",
    type: "python",
    theory:
      "Маючи список словників-задач, легко порахувати статистику простим циклом зі лічильником: заводимо змінну done_count = 0, і в циклі для кожної задачі з done == True збільшуємо її на 1 (done_count += 1 — те саме, що done_count = done_count + 1).\n\nЦе саме та функціональність («скільки виконано з усього») з початкового опису фінального проєкту органайзера — «підрахунок статистики».",
    examples: [
      { title: "Лічильник у циклі", code: `tasks = [\n    {"name": "Купити хліб", "done": True},\n    {"name": "Погуляти", "done": False},\n    {"name": "Прочитати книгу", "done": True},\n]\n\ndone_count = 0\nfor task in tasks:\n    if task["done"]:\n        done_count += 1\n\nprint(f"Виконано {done_count} з {len(tasks)}")`, explain: "done_count += 1 спрацьовує лише для задач із done == True." },
    ],
    task: `Порахуй, скільки задач у tasks виконано (done True), і виведи результат у форматі "Виконано 2 з 3".`,
    starter: `tasks = [\n    {"name": "Купити хліб", "done": True},\n    {"name": "Погуляти", "done": False},\n    {"name": "Прочитати книгу", "done": True},\n]\n\ndone_count = 0\n# for task in tasks:\n#     ...\n\n# print(f"Виконано {done_count} з {len(tasks)}")\n`,
    hints: [`У циклі перевіряй: if task["done"]:`, `Усередині if збільшуй лічильник: done_count += 1`, `done_count = 0\nfor task in tasks:\n    if task["done"]:\n        done_count += 1\nprint(f"Виконано {done_count} з {len(tasks)}")`],
    solution: `tasks = [\n    {"name": "Купити хліб", "done": True},\n    {"name": "Погуляти", "done": False},\n    {"name": "Прочитати книгу", "done": True},\n]\n\ndone_count = 0\nfor task in tasks:\n    if task["done"]:\n        done_count += 1\n\nprint(f"Виконано {done_count} з {len(tasks)}")`,
    testCode: `if "done_count" not in globals() or done_count != 2:\n    __result__ = {"pass": False, "message": "done_count має дорівнювати 2 — саме стільки задач мають done == True."}\nelif not any("2" in l and "3" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи повідомлення, що містить і кількість виконаних (2), і загальну кількість (3)."}\nelse:\n    __result__ = {"pass": True, "message": "Підрахунок статистики — саме те, що обіцяв фінальний проєкт органайзера."}`,
  },
  {
    id: "py-core-18",
    title: "List comprehension: короткий фільтр",
    type: "python",
    theory:
      "List comprehension — компактний спосіб побудувати новий список із наявного, часто замінюючи цикл for у кілька рядків одним виразом: pending = [t for t in tasks if not t[\"done\"]] створює список лише з невиконаних задач.\n\nЗагальна форма: [вираз for елемент in колекція if умова]. Це не обов'язкова конструкція (той самий результат можна отримати звичайним циклом for), але вона дуже поширена в реальному Python-коді, тож варто вміти її читати й писати.",
    examples: [
      { title: "Фільтрація одним рядком", code: `tasks = [\n    {"name": "Купити хліб", "done": True},\n    {"name": "Погуляти", "done": False},\n    {"name": "Прочитати книгу", "done": False},\n]\n\npending = [t["name"] for t in tasks if not t["done"]]\nprint(pending)`, explain: "pending міститиме тільки назви задач, у яких done == False." },
    ],
    task: `Використовуючи list comprehension, створи список pending з назвами всіх НЕвиконаних задач (де done == False), і виведи pending.`,
    starter: `tasks = [\n    {"name": "Купити хліб", "done": True},\n    {"name": "Погуляти", "done": False},\n    {"name": "Прочитати книгу", "done": False},\n]\n\n# pending = [... for ... in tasks if ...]\n# print(pending)\n`,
    hints: [`Форма: [вираз for елемент in tasks if умова]`, `Вираз — це t["name"], умова — not t["done"]`, `pending = [t["name"] for t in tasks if not t["done"]]\nprint(pending)`],
    solution: `tasks = [\n    {"name": "Купити хліб", "done": True},\n    {"name": "Погуляти", "done": False},\n    {"name": "Прочитати книгу", "done": False},\n]\n\npending = [t["name"] for t in tasks if not t["done"]]\nprint(pending)`,
    testCode: `if "pending" not in globals() or not isinstance(pending, list):\n    __result__ = {"pass": False, "message": "Створи список pending за допомогою list comprehension."}\nelif set(pending) != {"Погуляти", "Прочитати книгу"}:\n    __result__ = {"pass": False, "message": "pending має містити рівно ті дві задачі, у яких done == False."}\nelse:\n    __result__ = {"pass": True, "message": "List comprehension — швидкий спосіб дістати «лише невиконані задачі» для органайзера в один рядок."}`,
  },
  {
    id: "py-core-19",
    title: "Об'єднання функцій в органайзер",
    type: "python",
    theory:
      "Настав час зібрати ВСІ функції з попередніх уроків (add_task, complete_task, і нову list_tasks для показу) в одну узгоджену систему, що працює з однією спільною змінною tasks. Це і є суть програмування: маленькі перевірені частини поєднуються в більшу робочу систему.\n\nlist_tasks(tasks) виводить усі задачі у форматі з 12-го уроку ([x]/[ ] назва); add_task і complete_task лишаються такими самими, як раніше. Наступний, фінальний урок додасть до цього ще й функцію статистики — і зробить з цього завершену програму.",
    examples: [
      { title: "Три функції разом", code: `def add_task(tasks, name):\n    tasks.append({"name": name, "done": False})\n\ndef complete_task(tasks, index):\n    tasks[index]["done"] = True\n\ndef list_tasks(tasks):\n    for task in tasks:\n        mark = "[x]" if task["done"] else "[ ]"\n        print(f"{mark} {task['name']}")\n\ntasks = []\nadd_task(tasks, "Купити хліб")\nadd_task(tasks, "Погуляти")\ncomplete_task(tasks, 0)\nlist_tasks(tasks)`, explain: "Тепер add_task одразу створює задачу як словник {name, done}, а не приймає готовий рядок." },
    ],
    task: `Допиши функцію list_tasks(tasks), яка виводить кожну задачу у форматі "[x]/[ ] назва". Створи порожній список tasks, додай дві задачі через add_task, познач одну виконаною через complete_task, і виклич list_tasks(tasks).`,
    starter: `def add_task(tasks, name):\n    tasks.append({"name": name, "done": False})\n\ndef complete_task(tasks, index):\n    tasks[index]["done"] = True\n\ndef list_tasks(tasks):\n    # твій код тут\n    pass\n\ntasks = []\nadd_task(tasks, "Купити хліб")\nadd_task(tasks, "Погуляти")\ncomplete_task(tasks, 0)\nlist_tasks(tasks)\n`,
    hints: [`У list_tasks зроби цикл for task in tasks:`, `Використай той самий трюк, що й у 12-13 уроках: mark = "[x]" if task["done"] else "[ ]"`, `def list_tasks(tasks):\n    for task in tasks:\n        mark = "[x]" if task["done"] else "[ ]"\n        print(f"{mark} {task['name']}")`],
    solution: `def add_task(tasks, name):\n    tasks.append({"name": name, "done": False})\n\ndef complete_task(tasks, index):\n    tasks[index]["done"] = True\n\ndef list_tasks(tasks):\n    for task in tasks:\n        mark = "[x]" if task["done"] else "[ ]"\n        print(f"{mark} {task['name']}")\n\ntasks = []\nadd_task(tasks, "Купити хліб")\nadd_task(tasks, "Погуляти")\ncomplete_task(tasks, 0)\nlist_tasks(tasks)`,
    testCode: `if "list_tasks" not in globals() or not callable(list_tasks):\n    __result__ = {"pass": False, "message": "Потрібна функція list_tasks(tasks)."}\nelif "tasks" not in globals() or len(tasks) != 2:\n    __result__ = {"pass": False, "message": "У tasks мають бути рівно дві задачі, додані через add_task."}\nelif not any("[x]" in l for l in __logs) or not any("[ ]" in l for l in __logs):\n    __result__ = {"pass": False, "message": "list_tasks має вивести і виконану ([x]), і невиконану ([ ]) задачу."}\nelse:\n    __result__ = {"pass": True, "message": "Три функції разом — це вже практично весь органайзер. Залишився останній крок."}`,
  },
  {
    id: "py-core-20",
    title: "Фінальний проєкт: консольний органайзер справ",
    type: "python",
    theory:
      "Останній крок: додаємо функцію stats(tasks), яка рахує виконані задачі (як у 17-му уроці), і збираємо ВСЕ, що було зроблено за 20 уроків, в один цілісний скрипт: змінні й типи (2), f-рядки (3), списки (4-5), умови (6), цикли for/while (7-8, 14), функції з поверненням значень (9-10), словники (11-13), обробка помилок (15), методи рядків (16), статистика (17), list comprehension (18) і об'єднання функцій в систему (19).\n\nЦе і є органайзер справ, обіцяний ще на вступній сторінці «Що це?» — програма, що вміє додавати задачі, позначати їх виконаними, показувати список і рахувати статистику. Усе, що з ним відбувається на цьому уроці, є результатом рішень, які ти ухвалював(-ла) урок за уроком — а не одного великого стрибка в кінці.",
    examples: [
      { title: "stats() — остання відсутня частина", code: `def stats(tasks):\n    done = len([t for t in tasks if t["done"]])\n    return f"Виконано {done} з {len(tasks)}"\n\ntasks = [{"name": "Купити хліб", "done": True}, {"name": "Погуляти", "done": False}]\nprint(stats(tasks))`, explain: "stats() поєднує list comprehension (18) і f-рядок (3) в одному рядку коду." },
    ],
    task: `Допиши функцію stats(tasks), яка повертає рядок "Виконано X з Y". Потім, використовуючи ВСІ функції органайзера (add_task, complete_task, list_tasks, stats), додай 3 задачі, познач одну виконаною, виведи список задач і виведи статистику.`,
    starter: `def add_task(tasks, name):\n    tasks.append({"name": name, "done": False})\n\ndef complete_task(tasks, index):\n    tasks[index]["done"] = True\n\ndef list_tasks(tasks):\n    for task in tasks:\n        mark = "[x]" if task["done"] else "[ ]"\n        print(f"{mark} {task['name']}")\n\ndef stats(tasks):\n    # твій код тут: поверни рядок "Виконано X з Y"\n    pass\n\ntasks = []\nadd_task(tasks, "Купити хліб")\nadd_task(tasks, "Зробити домашку")\nadd_task(tasks, "Погуляти")\ncomplete_task(tasks, 0)\n\nlist_tasks(tasks)\nprint(stats(tasks))\n`,
    hints: [`У stats() порахуй done так само, як у 17-му уроці, потім поверни f-рядок.`, `return f"Виконано {done} з {len(tasks)}"`, `def stats(tasks):\n    done = len([t for t in tasks if t["done"]])\n    return f"Виконано {done} з {len(tasks)}"`],
    solution: `def add_task(tasks, name):\n    tasks.append({"name": name, "done": False})\n\ndef complete_task(tasks, index):\n    tasks[index]["done"] = True\n\ndef list_tasks(tasks):\n    for task in tasks:\n        mark = "[x]" if task["done"] else "[ ]"\n        print(f"{mark} {task['name']}")\n\ndef stats(tasks):\n    done = len([t for t in tasks if t["done"]])\n    return f"Виконано {done} з {len(tasks)}"\n\ntasks = []\nadd_task(tasks, "Купити хліб")\nadd_task(tasks, "Зробити домашку")\nadd_task(tasks, "Погуляти")\ncomplete_task(tasks, 0)\n\nlist_tasks(tasks)\nprint(stats(tasks))`,
    testCode: `if "stats" not in globals() or not callable(stats):\n    __result__ = {"pass": False, "message": "Потрібна функція stats(tasks), що повертає рядок статистики."}\nelif "tasks" not in globals() or len(tasks) != 3:\n    __result__ = {"pass": False, "message": "У tasks мають бути рівно 3 задачі, додані через add_task."}\nelif stats(tasks) != "Виконано 1 з 3":\n    __result__ = {"pass": False, "message": "stats(tasks) має повернути рядок «Виконано 1 з 3» — одна задача позначена виконаною з трьох."}\nelif not any("Виконано 1 з 3" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи результат stats(tasks) через print()."}\nelif not (any("[x]" in l for l in __logs) and any("[ ]" in l for l in __logs)):\n    __result__ = {"pass": False, "message": "list_tasks(tasks) має вивести і виконану, і невиконані задачі."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Це і є завершений консольний органайзер — зібраний тобою крок за кроком за 20 уроків."}`,
    finalProject: {
      techs: ["Python 3", "list", "dict", "функції (def/return)", "f-рядки", "list comprehension", "try/except"],
      skills: [
        "Змінні, типи даних і f-рядки",
        "Списки та словники як структури даних",
        "Умовні конструкції та цикли for/while",
        "Функції з параметрами й return-значеннями",
        "Обробка помилок через try/except",
        "List comprehension для фільтрації даних",
      ],
      structure:
        "organizer.py\n  ├── add_task(tasks, name)      # додати нову задачу\n  ├── complete_task(tasks, i)   # позначити задачу виконаною\n  ├── list_tasks(tasks)         # показати всі задачі\n  ├── stats(tasks)               # порахувати статистику\n  └── tasks = [...]              # список задач (дані програми)",
      code: `def add_task(tasks, name):
    tasks.append({"name": name, "done": False})

def complete_task(tasks, index):
    try:
        tasks[index]["done"] = True
    except IndexError:
        print("Такої задачі немає")

def list_tasks(tasks):
    for task in tasks:
        mark = "[x]" if task["done"] else "[ ]"
        print(f"{mark} {task['name']}")

def stats(tasks):
    done = len([t for t in tasks if t["done"]])
    return f"Виконано {done} з {len(tasks)}"

tasks = []
add_task(tasks, "Купити хліб")
add_task(tasks, "Зробити домашку")
add_task(tasks, "Погуляти")
complete_task(tasks, 0)

list_tasks(tasks)
print(stats(tasks))`,
      runCommand: "python organizer.py",
      improvements: [
        "Зберігати задачі у файл (наприклад, у форматі JSON), щоб вони не зникали після закриття програми",
        "Додати пріоритети задачам (низький / середній / високий)",
        "Зробити реальний інтерактивний ввід через input() у справжньому терміналі (у браузерній пісочниці немає stdin)",
        "Додати дедлайни та сортування за датою",
      ],
      nextLevel:
        "Далі — 🧠 Python OOP: ті самі функції (add_task, complete_task, list_tasks, stats) можна об'єднати в один клас Organizer, а кожну задачу — перетворити з словника на об'єкт класу Task. Це наступний, природний крок після Python Core.",
    },
  },
];
