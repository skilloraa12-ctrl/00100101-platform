// Python Automation — the fifth Python direction. Same intro + 20 lessons
// structure, building step by step toward a real File Organizer script.
// Unlike Game Development and Desktop Development, this direction needs NO
// caveat about a missing window: file and folder operations are genuine
// Python I/O against Pyodide's own virtual filesystem (Emscripten's MEMFS)
// — open(), os, shutil all behave exactly as they would on a real disk.
// The one thing worth knowing: that filesystem persists across lessons
// within a single browser session (it's part of the Python runtime, not
// the per-check namespace), so every lesson works inside its own uniquely
// named file/folder and never assumes a clean slate.
export const PYTHON_AUTOMATION_LESSONS = [
  {
    id: "py-automation-intro",
    title: "Що це? — Automation",
    type: "intro",
    theory:
      "Python Automation — це напрямок про автоматизацію рутинних задач: перейменування сотень файлів, сортування завантажень по папках, регулярне створення звітів, очищення старих логів. Замість того, щоб робити одне й те саме вручну щодня, пишеться скрипт, який робить це за секунди.\n\nНа відміну від Game Development чи Desktop Development, тут НЕ ПОТРІБНО жодних застережень про відсутність вікна: робота з файлами й папками — це справжні, повноцінні операції введення-виведення, які виконуються по-справжньому навіть у цій браузерній пісочниці (Python тут має власну віртуальну файлову систему). Код, написаний і перевірений тут, запрацює на реальних файлах так само, як і в реальному Python.\n\nPython тут відкриває, читає, записує й видаляє файли (open, модуль os), переміщує й копіює їх (модуль shutil), перевіряє розширення й будує шляхи, а також обробляє помилки, коли щось пішло не так (файл не знайдено, немає прав). Це вирішує задачу «зробити комп'ютер за мене» для будь-якої задачі, що повторюється: сортування завантажень, перейменування пакету фотографій, резервне копіювання, очищення тимчасових файлів.\n\nЩо знадобиться з попередніх напрямків: функції, цикли, списки, словники, try/except — усе з Python Core. Що буде після 20 уроків: повний скрипт-органайзер файлів — File Organizer, що сканує папку, сортує файли по підпапках за типом, веде журнал дій і показує підсумкову статистику.",
    presentation: [
      { title: "Automation — коротко", points: ["Робота з файлами й папками — справжня, без жодних застережень", "open(), модуль os, модуль shutil — основні інструменти", "Той самий скрипт працюватиме однаково і тут, і на реальному диску"] },
      { title: "Результат", points: ["20 уроків, кожен додає нову дію автоматизації", "Фінал: File Organizer — скрипт-сортувальник файлів по папках", "Потрібне знання функцій, циклів і try/except із Python Core"] },
    ],
  },
  {
    id: "py-automation-1",
    title: "Робота з файлами: запис",
    type: "python",
    theory:
      "Автоматизація часто починається з файлів: замість друку на екран, результат зберігають у файл, щоб він лишився після завершення скрипта. Функція open(ім'я, режим) відкриває файл; режим \"w\" (write) створює новий файл або ПЕРЕЗАПИСУЄ наявний з нуля.\n\nЗручніше й безпечніше використовувати конструкцію with — вона сама закриває файл, навіть якщо станеться помилка всередині блоку:\n\nwith open(\"notes.txt\", \"w\") as f:\n    f.write(\"Перший запис\\n\")\n\nf.write(...) записує рядок у файл; символ \\n усередині рядка — це перехід на новий рядок (те саме, що natural новий рядок у консолі).",
    examples: [
      { title: "Запис у файл через with", code: `with open("notes.txt", "w") as f:\n    f.write("Перший запис\\n")\n    f.write("Другий запис\\n")\n\nprint("Файл записано")`, explain: "Блок with сам закриває файл після виходу; двічі f.write() додає два рядки." },
    ],
    task: `Створи файл "notes.txt" через open(..., "w") у блоці with і запиши в нього рядок "Перший запис\\n". Виведи "Файл записано" після блоку.`,
    starter: `# with open("notes.txt", "w") as f:\n#     f.write(...)\n\n# print("Файл записано")\n`,
    hints: [`with open("notes.txt", "w") as f: — і не забудь двокрапку.`, `f.write("Перший запис\\n") усередині блоку, з відступом.`, `with open("notes.txt", "w") as f:\n    f.write("Перший запис\\n")\n\nprint("Файл записано")`],
    solution: `with open("notes.txt", "w") as f:\n    f.write("Перший запис\\n")\n\nprint("Файл записано")`,
    testCode: `import os\nif not os.path.exists("notes.txt"):\n    __result__ = {"pass": False, "message": "Файл notes.txt має бути створений."}\nelse:\n    content = open("notes.txt").read()\n    if "Перший запис" not in content:\n        __result__ = {"pass": False, "message": "Файл має містити рядок «Перший запис»."}\n    elif not any("Файл записано" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи «Файл записано» через print()."}\n    else:\n        __result__ = {"pass": True, "message": "open() з режимом \\"w\\" — перший інструмент автоматизації: результат роботи скрипта лишається на диску."}`,
  },
  {
    id: "py-automation-2",
    title: "Читання файлів",
    type: "python",
    theory:
      "Щоб прочитати вміст файлу, той самий open() відкривають у режимі \"r\" (read, і саме він за замовчуванням, якщо режим не вказано). f.read() повертає ВЕСЬ вміст файлу одним рядком:\n\nwith open(\"notes.txt\") as f:\n    content = f.read()\n    print(content)\n\nОскільки файл спершу треба СТВОРИТИ (як у 1-му уроці), а потім прочитати, обидві дії можна виконати послідовно в одному скрипті: спершу записати, потім — окремим блоком with — прочитати.",
    examples: [
      { title: "Запис, потім читання", code: `with open("log.txt", "w") as f:\n    f.write("Скрипт запущено")\n\nwith open("log.txt") as f:\n    content = f.read()\n\nprint(content)`, explain: "Два окремих блоки with — один для запису, інший для читання того самого файлу." },
    ],
    task: `Спершу запиши у файл "log.txt" рядок "Скрипт запущено" (режим "w"). Потім прочитай файл (open без другого аргументу означає "r") у змінну content і виведи content.`,
    starter: `with open("log.txt", "w") as f:\n    f.write("Скрипт запущено")\n\n# with open("log.txt") as f:\n#     content = f.read()\n\n# print(content)\n`,
    hints: [`open("log.txt") без режиму — за замовчуванням це читання ("r").`, `content = f.read() усередині блоку with.`, `with open("log.txt") as f:\n    content = f.read()\nprint(content)`],
    solution: `with open("log.txt", "w") as f:\n    f.write("Скрипт запущено")\n\nwith open("log.txt") as f:\n    content = f.read()\n\nprint(content)`,
    testCode: `if not any("Скрипт запущено" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Прочитаний і виведений вміст файлу має містити «Скрипт запущено»."}\nelse:\n    __result__ = {"pass": True, "message": "read() повертає весь вміст файлу одним рядком — базова операція будь-якого скрипта автоматизації."}`,
  },
  {
    id: "py-automation-3",
    title: "Дозапис: режим append",
    type: "python",
    theory:
      "Режим \"a\" (append) ДОДАЄ текст у КІНЕЦЬ наявного файлу, не стираючи те, що там уже було — на відміну від \"w\", який перезаписує файл з нуля. Це зручно для журналів (логів): кожна нова подія додається, а не замінює попередні.\n\nwith open(\"log.txt\", \"a\") as f:\n    f.write(\"Нова подія\\n\")\n\nЯкщо файл ще не існує, \"a\" створить його — так само, як \"w\".",
    examples: [
      { title: "append не стирає попередній вміст", code: `with open("events.txt", "w") as f:\n    f.write("Подія 1\\n")\n\nwith open("events.txt", "a") as f:\n    f.write("Подія 2\\n")\n\nprint(open("events.txt").read())`, explain: "Після append() у файлі лишаються ОБИДВІ події — 1 і 2, а не тільки остання." },
    ],
    task: `Запиши "Подія 1\\n" у файл "events.txt" через "w", потім додай "Подія 2\\n" через "a" (append). Виведи повний вміст файлу — має бути обидва рядки.`,
    starter: `with open("events.txt", "w") as f:\n    f.write("Подія 1\\n")\n\n# with open("events.txt", "a") as f:\n#     f.write("Подія 2\\n")\n\n# print(open("events.txt").read())\n`,
    hints: [`Режим "a" замість "w" для дозапису.`, `f.write("Подія 2\\n") — новий рядок додається в кінець.`, `with open("events.txt", "a") as f:\n    f.write("Подія 2\\n")\nprint(open("events.txt").read())`],
    solution: `with open("events.txt", "w") as f:\n    f.write("Подія 1\\n")\n\nwith open("events.txt", "a") as f:\n    f.write("Подія 2\\n")\n\nprint(open("events.txt").read())`,
    testCode: `content = "".join(__logs)\nif "Подія 1" not in content or "Подія 2" not in content:\n    __result__ = {"pass": False, "message": "У виведеному вмісті мають бути ОБИДВІ події — режим \\"a\\" не стирає попередній запис."}\nelse:\n    __result__ = {"pass": True, "message": "append — режим, яким ведуть журнали: кожен новий рядок додається, а не замінює попередній."}`,
  },
  {
    id: "py-automation-4",
    title: "Модуль os: список файлів у папці",
    type: "python",
    theory:
      "Модуль os — стандартна бібліотека Python для роботи з файловою системою. os.listdir(шлях) повертає список імен усіх файлів і папок за вказаним шляхом (якщо шлях не вказано — у поточній робочій папці):\n\nimport os\nos.makedirs(\"my_folder\", exist_ok=True)\nprint(os.listdir(\"my_folder\"))\n\nexist_ok=True в os.makedirs означає «не викликати помилку, якщо папка вже існує» — корисно, коли скрипт може запускатись повторно.",
    examples: [
      { title: "Створення папки і список її вмісту", code: `import os\n\nos.makedirs("demo_folder", exist_ok=True)\nwith open("demo_folder/file1.txt", "w") as f:\n    f.write("тест")\n\nprint(os.listdir("demo_folder"))`, explain: "os.listdir() показує все, що зараз лежить у папці — тут один файл." },
    ],
    task: `Створи папку "demo_folder" (os.makedirs, exist_ok=True), запиши файл "demo_folder/file1.txt" з будь-яким текстом, і виведи os.listdir("demo_folder").`,
    starter: `import os\n\nos.makedirs("demo_folder", exist_ok=True)\n\n# with open("demo_folder/file1.txt", "w") as f:\n#     f.write(...)\n\n# print(os.listdir("demo_folder"))\n`,
    hints: [`Шлях до файлу всередині папки пишеться через "/": "demo_folder/file1.txt"`, `os.listdir("demo_folder") поверне список імен файлів у цій папці.`, `with open("demo_folder/file1.txt", "w") as f:\n    f.write("тест")\nprint(os.listdir("demo_folder"))`],
    solution: `import os\n\nos.makedirs("demo_folder", exist_ok=True)\n\nwith open("demo_folder/file1.txt", "w") as f:\n    f.write("тест")\n\nprint(os.listdir("demo_folder"))`,
    testCode: `import os\nif not os.path.exists("demo_folder"):\n    __result__ = {"pass": False, "message": "Папка demo_folder має бути створена."}\nelif "file1.txt" not in os.listdir("demo_folder"):\n    __result__ = {"pass": False, "message": "У demo_folder має з'явитися файл file1.txt."}\nelif not any("file1.txt" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи os.listdir(\\"demo_folder\\") — має містити «file1.txt»."}\nelse:\n    __result__ = {"pass": True, "message": "os.listdir() — те, чим будь-який скрипт-автоматизація «оглядає» вміст папки перед обробкою."}`,
  },
  {
    id: "py-automation-5",
    title: "os.path: перевірка існування та розширення",
    type: "python",
    theory:
      "Перед тим як щось робити з файлом, безпечніше перевірити, що він справді існує: os.path.exists(шлях) повертає True/False. os.path.splitext(ім'я) розбиває ім'я файлу на (назва, розширення) — саме розширення (.txt, .jpg, .csv) визначає, в яку підпапку піде файл у майбутньому органайзері.\n\nname, ext = os.path.splitext(\"photo.jpg\")\nprint(name)  # \"photo\"\nprint(ext)   # \".jpg\" — з крапкою на початку",
    examples: [
      { title: "splitext розділяє ім'я і розширення", code: `import os\n\nname, ext = os.path.splitext("photo.jpg")\nprint(name)\nprint(ext)\nprint(os.path.exists("photo.jpg"))`, explain: "ext завжди містить крапку на початку — саме так, як записують розширення." },
    ],
    task: `Дано filename = "report.pdf". Розклади його на name, ext через os.path.splitext(filename) і виведи обидва. Виведи os.path.exists(filename) (буде False, бо такого файлу немає).`,
    starter: `import os\n\nfilename = "report.pdf"\n\n# name, ext = os.path.splitext(filename)\n# print(name)\n# print(ext)\n# print(os.path.exists(filename))\n`,
    hints: [`os.path.splitext(filename) повертає кортеж (name, ext).`, `Розпакування: name, ext = os.path.splitext(filename)`, `name, ext = os.path.splitext(filename)\nprint(name)\nprint(ext)\nprint(os.path.exists(filename))`],
    solution: `import os\n\nfilename = "report.pdf"\n\nname, ext = os.path.splitext(filename)\nprint(name)\nprint(ext)\nprint(os.path.exists(filename))`,
    testCode: `if not any(l.strip() == "report" for l in __logs):\n    __result__ = {"pass": False, "message": "name має дорівнювати «report» без розширення."}\nelif not any(l.strip() == ".pdf" for l in __logs):\n    __result__ = {"pass": False, "message": "ext має дорівнювати «.pdf» — з крапкою на початку."}\nelif not any(l.strip() == "False" for l in __logs):\n    __result__ = {"pass": False, "message": "os.path.exists для неіснуючого файлу має вивести False."}\nelse:\n    __result__ = {"pass": True, "message": "splitext() — саме той інструмент, яким органайзер визначатиме, до якої папки належить файл."}`,
  },
  {
    id: "py-automation-6",
    title: "os.path.join: побудова шляхів правильно",
    type: "python",
    theory:
      "Замість того щоб вручну склеювати шлях через + і \"/\" (що на Windows працює інакше, ніж на macOS/Linux — там роздільник \\\\), os.path.join(...) сам будує правильний шлях для поточної операційної системи:\n\nfolder = \"sorted\"\nfilename = \"photo.jpg\"\npath = os.path.join(folder, filename)\nprint(path)  # \"sorted/photo.jpg\" (або \"sorted\\\\photo.jpg\" на Windows)\n\nЦе звичка, яку варто виробити одразу — код зі шляхами, побудованими вручну через +, часто «ламається» при перенесенні з одної ОС на іншу.",
    examples: [
      { title: "os.path.join будує шлях", code: `import os\n\nfolder = "sorted"\nfilename = "photo.jpg"\npath = os.path.join(folder, filename)\nprint(path)`, explain: "join() сам вставляє правильний роздільник між частинами шляху." },
    ],
    task: `Дано folder = "sorted" і filename = "photo.jpg". Побудуй path через os.path.join(folder, filename) і виведи path.`,
    starter: `import os\n\nfolder = "sorted"\nfilename = "photo.jpg"\n\n# path = os.path.join(folder, filename)\n# print(path)\n`,
    hints: [`os.path.join(folder, filename) — саме в такому порядку.`, `Результат: "sorted/photo.jpg"`, `path = os.path.join(folder, filename)\nprint(path)`],
    solution: `import os\n\nfolder = "sorted"\nfilename = "photo.jpg"\n\npath = os.path.join(folder, filename)\nprint(path)`,
    testCode: `import os\nexpected = os.path.join("sorted", "photo.jpg")\nif not any(expected in l for l in __logs):\n    __result__ = {"pass": False, "message": "path має бути результатом os.path.join(\\"sorted\\", \\"photo.jpg\\")."}\nelse:\n    __result__ = {"pass": True, "message": "os.path.join() працює правильно на будь-якій операційній системі — на відміну від ручного склеювання рядків."}`,
  },
  {
    id: "py-automation-7",
    title: "Копіювання файлів: shutil.copy",
    type: "python",
    theory:
      "Модуль shutil (shell utilities) містить готові функції для типових файлових операцій, яких немає напряму в os. shutil.copy(джерело, призначення) копіює файл — оригінал лишається на місці, з'являється його копія:\n\nimport shutil\nshutil.copy(\"original.txt\", \"backup.txt\")\n\nЦе часто перший крок будь-якого скрипта резервного копіювання — перш ніж щось видаляти чи переміщувати, зробити копію.",
    examples: [
      { title: "Копіювання файлу", code: `import shutil\n\nwith open("original.txt", "w") as f:\n    f.write("важливі дані")\n\nshutil.copy("original.txt", "backup.txt")\n\nprint(open("backup.txt").read())`, explain: "backup.txt отримує ТОЧНУ копію вмісту original.txt; сам original.txt лишається незмінним." },
    ],
    task: `Створи файл "original.txt" із текстом "важливі дані". Скопіюй його в "backup.txt" через shutil.copy(). Виведи вміст "backup.txt".`,
    starter: `import shutil\n\nwith open("original.txt", "w") as f:\n    f.write("важливі дані")\n\n# shutil.copy("original.txt", "backup.txt")\n\n# print(open("backup.txt").read())\n`,
    hints: [`shutil.copy(джерело, призначення) — два аргументи.`, `Після copy() обидва файли існують окремо.`, `shutil.copy("original.txt", "backup.txt")\nprint(open("backup.txt").read())`],
    solution: `import shutil\n\nwith open("original.txt", "w") as f:\n    f.write("важливі дані")\n\nshutil.copy("original.txt", "backup.txt")\n\nprint(open("backup.txt").read())`,
    testCode: `import os\nif not os.path.exists("backup.txt"):\n    __result__ = {"pass": False, "message": "Файл backup.txt має бути створений через shutil.copy()."}\nelif not os.path.exists("original.txt"):\n    __result__ = {"pass": False, "message": "original.txt має лишитись на місці — copy() не видаляє оригінал."}\nelif not any("важливі дані" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведений вміст backup.txt має бути «важливі дані»."}\nelse:\n    __result__ = {"pass": True, "message": "shutil.copy() — перший крок будь-якого резервного копіювання: зробити копію, перш ніж щось міняти."}`,
  },
  {
    id: "py-automation-8",
    title: "Переміщення файлів: shutil.move",
    type: "python",
    theory:
      "shutil.move(джерело, призначення) ПЕРЕМІЩУЄ файл — на відміну від copy(), оригінал зникає зі старого місця. Саме move() і є основною дією майбутнього File Organizer: переносити файл із загальної купи в потрібну підпапку.\n\nimport shutil\nos.makedirs(\"images\", exist_ok=True)\nshutil.move(\"photo.jpg\", \"images/photo.jpg\")\n\nПісля move() photo.jpg більше не існує в старому місці — лише в images/.",
    examples: [
      { title: "Переміщення файлу в підпапку", code: `import os, shutil\n\nos.makedirs("images", exist_ok=True)\nwith open("photo.jpg", "w") as f:\n    f.write("дані картинки")\n\nshutil.move("photo.jpg", "images/photo.jpg")\n\nprint(os.path.exists("photo.jpg"))\nprint(os.path.exists("images/photo.jpg"))`, explain: "Після move() файл існує ЛИШЕ за новим шляхом — старого вже немає." },
    ],
    task: `Створи папку "images" і файл "photo.jpg". Перемісти "photo.jpg" в "images/photo.jpg" через shutil.move(). Виведи os.path.exists("photo.jpg") (False) і os.path.exists("images/photo.jpg") (True).`,
    starter: `import os, shutil\n\nos.makedirs("images", exist_ok=True)\nwith open("photo.jpg", "w") as f:\n    f.write("дані картинки")\n\n# shutil.move("photo.jpg", "images/photo.jpg")\n\n# print(os.path.exists("photo.jpg"))\n# print(os.path.exists("images/photo.jpg"))\n`,
    hints: [`shutil.move(джерело, призначення)`, `Після move перевір обидва шляхи через os.path.exists().`, `shutil.move("photo.jpg", "images/photo.jpg")\nprint(os.path.exists("photo.jpg"))\nprint(os.path.exists("images/photo.jpg"))`],
    solution: `import os, shutil\n\nos.makedirs("images", exist_ok=True)\nwith open("photo.jpg", "w") as f:\n    f.write("дані картинки")\n\nshutil.move("photo.jpg", "images/photo.jpg")\n\nprint(os.path.exists("photo.jpg"))\nprint(os.path.exists("images/photo.jpg"))`,
    testCode: `import os\nif os.path.exists("photo.jpg"):\n    __result__ = {"pass": False, "message": "Після move() photo.jpg у старому місці більше не має існувати."}\nelif not os.path.exists("images/photo.jpg"):\n    __result__ = {"pass": False, "message": "Файл має з'явитися за новим шляхом images/photo.jpg."}\nelif not (any(l.strip() == "False" for l in __logs) and any(l.strip() == "True" for l in __logs)):\n    __result__ = {"pass": False, "message": "Виведи обидва os.path.exists() — False для старого шляху, True для нового."}\nelse:\n    __result__ = {"pass": True, "message": "shutil.move() — саме та дія, якою File Organizer сортуватиме файли по підпапках."}`,
  },
  {
    id: "py-automation-9",
    title: "Видалення файлів: безпечно",
    type: "python",
    theory:
      "os.remove(шлях) видаляє файл — НЕЗВОРОТНО, файл не потрапляє в кошик, як при видаленні мишею. Тому перед видаленням ЗАВЖДИ варто перевірити існування файлу через os.path.exists(), щоб не отримати помилку FileNotFoundError на неіснуючому файлі:\n\nif os.path.exists(\"temp.txt\"):\n    os.remove(\"temp.txt\")\n    print(\"Видалено\")\nelse:\n    print(\"Файл не знайдено\")",
    examples: [
      { title: "Безпечне видалення з перевіркою", code: `import os\n\nwith open("temp.txt", "w") as f:\n    f.write("тимчасові дані")\n\nif os.path.exists("temp.txt"):\n    os.remove("temp.txt")\n    print("Видалено")\n\nprint(os.path.exists("temp.txt"))`, explain: "Перевірка перед видаленням — звичка, яка захищає скрипт від аварійного завершення." },
    ],
    task: `Створи файл "temp.txt". Перевір os.path.exists("temp.txt"), і якщо існує — видали через os.remove() і виведи "Видалено". Наостанок виведи os.path.exists("temp.txt") (має бути False).`,
    starter: `import os\n\nwith open("temp.txt", "w") as f:\n    f.write("тимчасові дані")\n\n# if os.path.exists("temp.txt"):\n#     os.remove("temp.txt")\n#     print("Видалено")\n\n# print(os.path.exists("temp.txt"))\n`,
    hints: [`if os.path.exists("temp.txt"): всередині — os.remove("temp.txt") і print("Видалено")`, `Останній print() — уже ПОЗА if, щоб перевірити результат.`, `if os.path.exists("temp.txt"):\n    os.remove("temp.txt")\n    print("Видалено")\nprint(os.path.exists("temp.txt"))`],
    solution: `import os\n\nwith open("temp.txt", "w") as f:\n    f.write("тимчасові дані")\n\nif os.path.exists("temp.txt"):\n    os.remove("temp.txt")\n    print("Видалено")\n\nprint(os.path.exists("temp.txt"))`,
    testCode: `import os\nif os.path.exists("temp.txt"):\n    __result__ = {"pass": False, "message": "Файл temp.txt має бути видалений наприкінці."}\nelif not any("Видалено" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «Видалено»."}\nelif not any(l.strip() == "False" for l in __logs):\n    __result__ = {"pass": False, "message": "Останній os.path.exists() має вивести False."}\nelse:\n    __result__ = {"pass": True, "message": "os.remove() — незворотна дія, тому перевірка існування перед нею — не формальність, а захист від помилки."}`,
  },
  {
    id: "py-automation-10",
    title: "Фільтрація файлів за розширенням",
    type: "python",
    theory:
      "Маючи список файлів (os.listdir()), можна відфільтрувати лише потрібні за допомогою list comprehension і методу рядка .endswith(): \"photo.jpg\".endswith(\".jpg\") поверне True.\n\nfiles = [\"a.txt\", \"b.jpg\", \"c.txt\", \"d.png\"]\ntxt_files = [f for f in files if f.endswith(\".txt\")]\nprint(txt_files)  # ['a.txt', 'c.txt']\n\nЦе той самий list comprehension, що фільтрував невиконані задачі в Python Core — тільки умова тепер про розширення файлу, а не про булеве поле.",
    examples: [
      { title: "Фільтрація за розширенням", code: `files = ["a.txt", "b.jpg", "c.txt", "d.png"]\ntxt_files = [f for f in files if f.endswith(".txt")]\nprint(txt_files)`, explain: "endswith() перевіряє, чи рядок закінчується вказаним суфіксом — саме розширенням файлу." },
    ],
    task: `Дано files = ["a.txt", "b.jpg", "c.txt", "d.png"]. Через list comprehension створи txt_files — лише файли, що закінчуються на ".txt". Виведи txt_files.`,
    starter: `files = ["a.txt", "b.jpg", "c.txt", "d.png"]\n\n# txt_files = [... for ... in files if ...]\n# print(txt_files)\n`,
    hints: [`[f for f in files if f.endswith(".txt")]`, `Умова f.endswith(".txt") лишає лише текстові файли.`, `txt_files = [f for f in files if f.endswith(".txt")]\nprint(txt_files)`],
    solution: `files = ["a.txt", "b.jpg", "c.txt", "d.png"]\n\ntxt_files = [f for f in files if f.endswith(".txt")]\nprint(txt_files)`,
    testCode: `if "txt_files" not in globals() or txt_files != ["a.txt", "c.txt"]:\n    __result__ = {"pass": False, "message": "txt_files має дорівнювати ['a.txt', 'c.txt']."}\nelse:\n    __result__ = {"pass": True, "message": "endswith() + list comprehension — швидкий спосіб дістати лише потрібні файли з великого списку."}`,
  },
  {
    id: "py-automation-11",
    title: "Функція: визначити цільову папку за розширенням",
    type: "python",
    theory:
      "Напишемо функцію get_target_folder(filename), що повертає назву папки, в яку варто покласти файл, залежно від його розширення — серце логіки будь-якого органайзера файлів:\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    folders = {\n        \".jpg\": \"images\", \".png\": \"images\",\n        \".txt\": \"documents\", \".pdf\": \"documents\",\n        \".mp3\": \"audio\",\n    }\n    return folders.get(ext, \"other\")\n\nfolders.get(ext, \"other\") повертає \"other\", якщо розширення немає серед відомих — так функція не «падає» на невідомому типі файлу, а дає розумне значення за замовчуванням.",
    examples: [
      { title: "get_target_folder визначає папку", code: `import os\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    folders = {".jpg": "images", ".png": "images", ".txt": "documents", ".pdf": "documents", ".mp3": "audio"}\n    return folders.get(ext, "other")\n\nprint(get_target_folder("photo.JPG"))\nprint(get_target_folder("archive.zip"))`, explain: ".lower() робить перевірку нечутливою до регістру: .JPG теж розпізнається як зображення; невідомий .zip дає «other»." },
    ],
    task: `Напиши get_target_folder(filename), що визначає розширення (у нижньому регістрі) і повертає відповідну папку зі словника {".jpg": "images", ".png": "images", ".txt": "documents", ".pdf": "documents", ".mp3": "audio"}, або "other" якщо розширення невідоме. Виведи get_target_folder("photo.JPG") і get_target_folder("archive.zip").`,
    starter: `import os\n\ndef get_target_folder(filename):\n    # твій код тут\n    pass\n\nprint(get_target_folder("photo.JPG"))\nprint(get_target_folder("archive.zip"))\n`,
    hints: [`ext = os.path.splitext(filename)[1].lower()`, `folders.get(ext, "other") — другий аргумент get() це значення за замовчуванням.`, `def get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    folders = {".jpg": "images", ".png": "images", ".txt": "documents", ".pdf": "documents", ".mp3": "audio"}\n    return folders.get(ext, "other")`],
    solution: `import os\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    folders = {".jpg": "images", ".png": "images", ".txt": "documents", ".pdf": "documents", ".mp3": "audio"}\n    return folders.get(ext, "other")\n\nprint(get_target_folder("photo.JPG"))\nprint(get_target_folder("archive.zip"))`,
    testCode: `if "get_target_folder" not in globals() or not callable(get_target_folder):\n    __result__ = {"pass": False, "message": "Потрібна функція get_target_folder(filename)."}\nelif get_target_folder("photo.JPG") != "images" or get_target_folder("archive.zip") != "other":\n    __result__ = {"pass": False, "message": "get_target_folder(\\"photo.JPG\\") має повернути «images», get_target_folder(\\"archive.zip\\") — «other»."}\nelif not any("images" in l for l in __logs) or not any("other" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи обидва результати функції."}\nelse:\n    __result__ = {"pass": True, "message": "Ця функція — «мозок» органайзера: вирішує, куди піде КОЖЕН файл, лише за його розширенням."}`,
  },
  {
    id: "py-automation-12",
    title: "Сортування одного файлу в потрібну папку",
    type: "python",
    theory:
      "Об'єднаємо 8-й і 11-й уроки: функція sort_file(filename), що визначає цільову папку через get_target_folder(), створює її (якщо не існує) і переміщує туди файл:\n\ndef sort_file(filename):\n    folder = get_target_folder(filename)\n    os.makedirs(folder, exist_ok=True)\n    shutil.move(filename, os.path.join(folder, filename))\n\nЦе перша функція, що реально «сортує» — решта уроків лише готували для неї інструменти.",
    examples: [
      { title: "sort_file() переміщує файл автоматично", code: `import os, shutil\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    return {".jpg": "images", ".txt": "documents"}.get(ext, "other")\n\ndef sort_file(filename):\n    folder = get_target_folder(filename)\n    os.makedirs(folder, exist_ok=True)\n    shutil.move(filename, os.path.join(folder, filename))\n\nwith open("photo.jpg", "w") as f:\n    f.write("дані")\nsort_file("photo.jpg")\nprint(os.path.exists("images/photo.jpg"))`, explain: "Один виклик sort_file() — і файл уже у правильній папці, навіть якщо її ще не існувало." },
    ],
    task: `Напиши sort_file(filename): визнач folder через get_target_folder(filename), створи папку (exist_ok=True), перемісти файл через shutil.move(). Створи "photo.jpg", виклич sort_file("photo.jpg") і виведи os.path.exists("images/photo.jpg").`,
    starter: `import os, shutil\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    return {".jpg": "images", ".txt": "documents"}.get(ext, "other")\n\ndef sort_file(filename):\n    # твій код тут\n    pass\n\nwith open("photo.jpg", "w") as f:\n    f.write("дані")\nsort_file("photo.jpg")\nprint(os.path.exists("images/photo.jpg"))\n`,
    hints: [`folder = get_target_folder(filename)`, `os.makedirs(folder, exist_ok=True), потім shutil.move(filename, os.path.join(folder, filename))`, `def sort_file(filename):\n    folder = get_target_folder(filename)\n    os.makedirs(folder, exist_ok=True)\n    shutil.move(filename, os.path.join(folder, filename))`],
    solution: `import os, shutil\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    return {".jpg": "images", ".txt": "documents"}.get(ext, "other")\n\ndef sort_file(filename):\n    folder = get_target_folder(filename)\n    os.makedirs(folder, exist_ok=True)\n    shutil.move(filename, os.path.join(folder, filename))\n\nwith open("photo.jpg", "w") as f:\n    f.write("дані")\nsort_file("photo.jpg")\nprint(os.path.exists("images/photo.jpg"))`,
    testCode: `import os\nif "sort_file" not in globals() or not callable(sort_file):\n    __result__ = {"pass": False, "message": "Потрібна функція sort_file(filename)."}\nelif not os.path.exists("images/photo.jpg"):\n    __result__ = {"pass": False, "message": "Після sort_file(\\"photo.jpg\\") файл має опинитись за шляхом images/photo.jpg."}\nelif os.path.exists("photo.jpg"):\n    __result__ = {"pass": False, "message": "photo.jpg не має лишитись у старому місці — move(), а не copy()."}\nelif not any(l.strip() == "True" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи os.path.exists(\\"images/photo.jpg\\") — має бути True."}\nelse:\n    __result__ = {"pass": True, "message": "sort_file() — одна функція, що виконує повний цикл: визначити папку, створити її, перемістити файл."}`,
  },
  {
    id: "py-automation-13",
    title: "Обробка всіх файлів у папці циклом",
    type: "python",
    theory:
      "Реальна автоматизація обробляє не один файл, а ВСІ файли в папці одразу. Пройдемо циклом по os.listdir() і викличемо sort_file() для кожного — точно так само, як цикл for обробляв кожну задачу в списку в Python Core:\n\nfor filename in os.listdir(\"inbox\"):\n    sort_file(os.path.join(\"inbox\", filename))\n\nВажливо: перевірити, що це файл, а не підпапка (os.path.isfile()), інакше спроба «відсортувати» вже наявну папку зламає логіку.",
    examples: [
      { title: "Цикл сортує всі файли підряд", code: `import os\n\nos.makedirs("inbox", exist_ok=True)\nfor name in ["a.txt", "b.jpg"]:\n    with open(os.path.join("inbox", name), "w") as f:\n        f.write("дані")\n\nfor filename in os.listdir("inbox"):\n    path = os.path.join("inbox", filename)\n    if os.path.isfile(path):\n        sort_file(path)\n\nprint(os.listdir("."))`, explain: "os.path.isfile() пропускає підпапки, якщо вони раптом опиняться серед елементів inbox." },
    ],
    task: `Дано папка "inbox" із файлами "a.txt" і "b.jpg" (уже створені). Пройди циклом по os.listdir("inbox"), для кожного filename перевір os.path.isfile() і виклич sort_file(шлях). Виведи os.listdir(".") наостанок.`,
    starter: `import os, shutil\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    return {".jpg": "images", ".txt": "documents"}.get(ext, "other")\n\ndef sort_file(filename):\n    folder = get_target_folder(filename)\n    os.makedirs(folder, exist_ok=True)\n    shutil.move(filename, os.path.join(folder, os.path.basename(filename)))\n\nos.makedirs("inbox", exist_ok=True)\nfor name in ["a.txt", "b.jpg"]:\n    with open(os.path.join("inbox", name), "w") as f:\n        f.write("дані")\n\n# for filename in os.listdir("inbox"):\n#     ...\n\n# print(os.listdir("."))\n`,
    hints: [`for filename in os.listdir("inbox"):`, `path = os.path.join("inbox", filename); if os.path.isfile(path): sort_file(path)`, `for filename in os.listdir("inbox"):\n    path = os.path.join("inbox", filename)\n    if os.path.isfile(path):\n        sort_file(path)\nprint(os.listdir("."))`],
    solution: `import os, shutil\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    return {".jpg": "images", ".txt": "documents"}.get(ext, "other")\n\ndef sort_file(filename):\n    folder = get_target_folder(filename)\n    os.makedirs(folder, exist_ok=True)\n    shutil.move(filename, os.path.join(folder, os.path.basename(filename)))\n\nos.makedirs("inbox", exist_ok=True)\nfor name in ["a.txt", "b.jpg"]:\n    with open(os.path.join("inbox", name), "w") as f:\n        f.write("дані")\n\nfor filename in os.listdir("inbox"):\n    path = os.path.join("inbox", filename)\n    if os.path.isfile(path):\n        sort_file(path)\n\nprint(os.listdir("."))`,
    testCode: `import os\nif not os.path.exists("documents/a.txt"):\n    __result__ = {"pass": False, "message": "a.txt має опинитись у documents/ після циклу сортування."}\nelif not os.path.exists("images/b.jpg"):\n    __result__ = {"pass": False, "message": "b.jpg має опинитись у images/ після циклу сортування."}\nelse:\n    __result__ = {"pass": True, "message": "Цикл по os.listdir() — та сама механіка, якою реальний скрипт обробляє папку з сотнями файлів за раз."}`,
  },
  {
    id: "py-automation-14",
    title: "Журнал дій (лог-файл)",
    type: "python",
    theory:
      "Гарна автоматизація ЗАПИСУЄ, що саме вона зробила — журнал (лог) дозволяє потім перевірити, що сталось, навіть без відкритого вікна консолі. Додамо функцію log_action(message), що дозаписує рядок у \"organizer_log.txt\" з режимом \"a\" (з 3-го уроку):\n\ndef log_action(message):\n    with open(\"organizer_log.txt\", \"a\") as f:\n        f.write(message + \"\\n\")\n\nВиклик log_action(\"Переміщено photo.jpg в images/\") додає один рядок історії дій — так само, як print(), тільки назавжди зберігається у файлі.",
    examples: [
      { title: "log_action веде історію", code: `def log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")\n\nlog_action("Переміщено a.txt")\nlog_action("Переміщено b.jpg")\n\nprint(open("organizer_log.txt").read())`, explain: "Кожен виклик log_action() додає новий рядок, не стираючи попередні (режим append)." },
    ],
    task: `Напиши log_action(message), що дозаписує message + "\\n" у "organizer_log.txt". Виклич її двічі з різними повідомленнями, потім виведи весь вміст файлу.`,
    starter: `def log_action(message):\n    # твій код тут\n    pass\n\nlog_action("Переміщено a.txt")\nlog_action("Переміщено b.jpg")\n\nprint(open("organizer_log.txt").read())\n`,
    hints: [`with open("organizer_log.txt", "a") as f: f.write(message + "\\n")`, `Режим "a", не "w" — інакше другий виклик стере перший.`, `def log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")`],
    solution: `def log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")\n\nlog_action("Переміщено a.txt")\nlog_action("Переміщено b.jpg")\n\nprint(open("organizer_log.txt").read())`,
    testCode: `content = "".join(__logs)\nif "Переміщено a.txt" not in content or "Переміщено b.jpg" not in content:\n    __result__ = {"pass": False, "message": "Журнал має містити ОБИДВА записи — log_action() використовує режим append."}\nelse:\n    __result__ = {"pass": True, "message": "Журнал дій — те, за чим потім можна перевірити, що саме зробив скрипт, навіть якщо він давно завершився."}`,
  },
  {
    id: "py-automation-15",
    title: "Обробка помилок: файл не знайдено",
    type: "python",
    theory:
      "Якщо спробувати перемістити файл, якого насправді немає, shutil.move() викличе FileNotFoundError і скрипт аварійно зупиниться. Захистимо sort_file() через try/except, щоб один «поганий» файл не зупиняв обробку всіх інших:\n\ndef sort_file(filename):\n    try:\n        folder = get_target_folder(filename)\n        os.makedirs(folder, exist_ok=True)\n        shutil.move(filename, os.path.join(folder, os.path.basename(filename)))\n    except FileNotFoundError:\n        print(f\"Файл не знайдено: {filename}\")\n\nЦе той самий принцип, що complete_task() з try/except у Python Core — помилка одного елемента не має зупиняти обробку решти.",
    examples: [
      { title: "try/except у sort_file()", code: `def sort_file(filename):\n    try:\n        shutil.move(filename, "images/" + filename)\n    except FileNotFoundError:\n        print(f"Файл не знайдено: {filename}")\n\nsort_file("no_such_file.jpg")`, explain: "Замість аварійного завершення програма друкує повідомлення й продовжує роботу." },
    ],
    task: `Напиши sort_file(filename), що обгортає shutil.move("...", "images/" + filename) у try/except FileNotFoundError, друкуючи f"Файл не знайдено: {filename}". Виклич sort_file("no_such_file.jpg") (файлу не існує).`,
    starter: `import shutil\n\ndef sort_file(filename):\n    # твій код тут: try/except навколо shutil.move\n    shutil.move(filename, "images/" + filename)\n\nsort_file("no_such_file.jpg")\n`,
    hints: [`try: shutil.move(filename, "images/" + filename)`, `except FileNotFoundError: print(f"Файл не знайдено: {filename}")`, `def sort_file(filename):\n    try:\n        shutil.move(filename, "images/" + filename)\n    except FileNotFoundError:\n        print(f"Файл не знайдено: {filename}")`],
    solution: `import shutil\n\ndef sort_file(filename):\n    try:\n        shutil.move(filename, "images/" + filename)\n    except FileNotFoundError:\n        print(f"Файл не знайдено: {filename}")\n\nsort_file("no_such_file.jpg")`,
    testCode: `if not any("Файл не знайдено" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись повідомлення «Файл не знайдено: ...» замість аварійного завершення."}\nelse:\n    __result__ = {"pass": True, "message": "try/except захищає весь цикл обробки: один відсутній файл більше не зупиняє решту."}`,
  },
  {
    id: "py-automation-16",
    title: "Статистика: скільки файлів якого типу",
    type: "python",
    theory:
      "Порахуємо, скільки файлів пішло в кожну папку — словник stats зі структурою {папка: кількість}, що росте під час обробки. .get(key, 0) повертає 0, якщо ключа ще немає — зручно для лічильника, що починається «з нуля» для кожного нового типу:\n\nstats = {}\nfor folder in [\"images\", \"documents\", \"images\"]:\n    stats[folder] = stats.get(folder, 0) + 1\n\nprint(stats)  # {'images': 2, 'documents': 1}",
    examples: [
      { title: "Підрахунок через словник-лічильник", code: `folders_used = ["images", "documents", "images", "audio", "documents"]\n\nstats = {}\nfor folder in folders_used:\n    stats[folder] = stats.get(folder, 0) + 1\n\nprint(stats)`, explain: ".get(folder, 0) дає 0 для нового ключа замість помилки KeyError." },
    ],
    task: `Дано folders_used = ["images", "documents", "images", "audio", "documents"]. Порахуй stats — словник {папка: кількість} через .get(key, 0) + 1. Виведи stats.`,
    starter: `folders_used = ["images", "documents", "images", "audio", "documents"]\n\nstats = {}\n# for folder in folders_used:\n#     ...\n\n# print(stats)\n`,
    hints: [`for folder in folders_used: stats[folder] = stats.get(folder, 0) + 1`, `.get(folder, 0) — 0, якщо ключа folder ще немає в stats.`, `for folder in folders_used:\n    stats[folder] = stats.get(folder, 0) + 1\nprint(stats)`],
    solution: `folders_used = ["images", "documents", "images", "audio", "documents"]\n\nstats = {}\nfor folder in folders_used:\n    stats[folder] = stats.get(folder, 0) + 1\n\nprint(stats)`,
    testCode: `if "stats" not in globals() or stats != {"images": 2, "documents": 2, "audio": 1}:\n    __result__ = {"pass": False, "message": "stats має дорівнювати {'images': 2, 'documents': 2, 'audio': 1}."}\nelse:\n    __result__ = {"pass": True, "message": "Словник-лічильник — точно те, чим File Organizer покаже підсумок роботи: скільки файлів якого типу оброблено."}`,
  },
  {
    id: "py-automation-17",
    title: "Функція organize_folder(): все разом",
    type: "python",
    theory:
      "Зберемо цикл (13-й урок), сортування (12-й), лог (14-й) і статистику (16-й) в одну функцію organize_folder(path), що повертає готову статистику:\n\ndef organize_folder(path):\n    stats = {}\n    for filename in os.listdir(path):\n        full_path = os.path.join(path, filename)\n        if not os.path.isfile(full_path):\n            continue\n        folder = get_target_folder(filename)\n        os.makedirs(folder, exist_ok=True)\n        shutil.move(full_path, os.path.join(folder, filename))\n        log_action(f\"Переміщено {filename} у {folder}/\")\n        stats[folder] = stats.get(folder, 0) + 1\n    return stats\n\ncontinue пропускає решту тіла циклу для ЦІЄЇ ітерації й одразу переходить до наступного елемента — зручно для «пропустити й далі», без вкладеного if/else.",
    examples: [
      { title: "organize_folder() повертає статистику", code: `stats = organize_folder("inbox2")\nprint(stats)`, explain: "Один виклик — і функція сама пройшла по всій папці, розсортувала файли й порахувала статистику." },
    ],
    task: `Напиши organize_folder(path), що об'єднує цикл, сортування, лог і статистику (як у прикладі). Створи папку "inbox2" з файлами "x.txt" і "y.jpg", виклич organize_folder("inbox2") і виведи результат.`,
    starter: `import os, shutil\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    return {".jpg": "images", ".txt": "documents"}.get(ext, "other")\n\ndef log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")\n\ndef organize_folder(path):\n    # твій код тут\n    pass\n\nos.makedirs("inbox2", exist_ok=True)\nfor name in ["x.txt", "y.jpg"]:\n    with open(os.path.join("inbox2", name), "w") as f:\n        f.write("дані")\n\nstats = organize_folder("inbox2")\nprint(stats)\n`,
    hints: [`stats = {}; for filename in os.listdir(path): full_path = os.path.join(path, filename)`, `if not os.path.isfile(full_path): continue — інакше продовжуй сортувати, логувати, рахувати.`, `def organize_folder(path):\n    stats = {}\n    for filename in os.listdir(path):\n        full_path = os.path.join(path, filename)\n        if not os.path.isfile(full_path):\n            continue\n        folder = get_target_folder(filename)\n        os.makedirs(folder, exist_ok=True)\n        shutil.move(full_path, os.path.join(folder, filename))\n        log_action(f"Переміщено {filename} у {folder}/")\n        stats[folder] = stats.get(folder, 0) + 1\n    return stats`],
    solution: `import os, shutil\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    return {".jpg": "images", ".txt": "documents"}.get(ext, "other")\n\ndef log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")\n\ndef organize_folder(path):\n    stats = {}\n    for filename in os.listdir(path):\n        full_path = os.path.join(path, filename)\n        if not os.path.isfile(full_path):\n            continue\n        folder = get_target_folder(filename)\n        os.makedirs(folder, exist_ok=True)\n        shutil.move(full_path, os.path.join(folder, filename))\n        log_action(f"Переміщено {filename} у {folder}/")\n        stats[folder] = stats.get(folder, 0) + 1\n    return stats\n\nos.makedirs("inbox2", exist_ok=True)\nfor name in ["x.txt", "y.jpg"]:\n    with open(os.path.join("inbox2", name), "w") as f:\n        f.write("дані")\n\nstats = organize_folder("inbox2")\nprint(stats)`,
    testCode: `import os\nif "organize_folder" not in globals() or not callable(organize_folder):\n    __result__ = {"pass": False, "message": "Потрібна функція organize_folder(path)."}\nelif "stats" not in globals() or stats.get("documents") != 1 or stats.get("images") != 1:\n    __result__ = {"pass": False, "message": "stats має показати рівно по 1 файлу в documents і images."}\nelif not os.path.exists("documents/x.txt") or not os.path.exists("images/y.jpg"):\n    __result__ = {"pass": False, "message": "Файли мають реально опинитись у своїх підпапках."}\nelse:\n    __result__ = {"pass": True, "message": "organize_folder() — це вже практично весь File Organizer в одній функції."}`,
  },
  {
    id: "py-automation-18",
    title: "Підсумковий звіт",
    type: "python",
    theory:
      "Наостанок покажемо статистику у зрозумілому вигляді, а не сирим словником — пройдемо по stats.items() (пари ключ-значення одразу) і виведемо кожну папку з кількістю файлів:\n\nfor folder, count in stats.items():\n    print(f\"{folder}: {count} файл(ів)\")\n\nprint(f\"Усього оброблено: {sum(stats.values())}\")\n\nstats.items() дає одразу і ключ, і значення в циклі — так само, як enumerate() давав індекс і елемент у Python Core.",
    examples: [
      { title: "Звіт по stats.items()", code: `stats = {"images": 2, "documents": 1}\n\nfor folder, count in stats.items():\n    print(f"{folder}: {count} файл(ів)")\n\nprint(f"Усього оброблено: {sum(stats.values())}")`, explain: "sum(stats.values()) підсумовує всі кількості одразу, без ручного лічильника." },
    ],
    task: `Дано stats = {"images": 2, "documents": 1, "audio": 1}. Виведи кожну папку в форматі "papka: N файл(ів)" через stats.items(), а наостанок "Усього оброблено: N" через sum(stats.values()).`,
    starter: `stats = {"images": 2, "documents": 1, "audio": 1}\n\n# for folder, count in stats.items():\n#     ...\n\n# print(f"Усього оброблено: {sum(stats.values())}")\n`,
    hints: [`for folder, count in stats.items(): print(f"{folder}: {count} файл(ів)")`, `sum(stats.values()) підсумовує всі значення словника.`, `for folder, count in stats.items():\n    print(f"{folder}: {count} файл(ів)")\nprint(f"Усього оброблено: {sum(stats.values())}")`],
    solution: `stats = {"images": 2, "documents": 1, "audio": 1}\n\nfor folder, count in stats.items():\n    print(f"{folder}: {count} файл(ів)")\n\nprint(f"Усього оброблено: {sum(stats.values())}")`,
    testCode: `if not any("Усього оброблено: 4" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Підсумковий рядок має бути «Усього оброблено: 4»."}\nelif sum(1 for l in __logs if "файл" in l) < 3:\n    __result__ = {"pass": False, "message": "Кожна папка зі stats має бути виведена окремим рядком."}\nelse:\n    __result__ = {"pass": True, "message": "Звіт наостанок — те, що показує людині: скрипт справді щось зробив, і саме це."}`,
  },
  {
    id: "py-automation-19",
    title: "Заголовок логу з датою запуску",
    type: "python",
    theory:
      "Гарний журнал починається з позначки, КОЛИ саме скрипт запускався — модуль datetime дає поточну дату й час:\n\nfrom datetime import datetime\n\nnow = datetime.now()\nlog_action(f\"--- Запуск {now.strftime('%Y-%m-%d %H:%M')} ---\")\n\n.strftime(формат) перетворює дату на рядок за вказаним шаблоном: %Y — рік, %m — місяць, %d — день, %H:%M — години:хвилини.",
    examples: [
      { title: "Позначка часу в лозі", code: `from datetime import datetime\n\ndef log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")\n\nnow = datetime.now()\nlog_action(f"--- Запуск {now.strftime('%Y-%m-%d')} ---")\nprint(open("organizer_log.txt").read())`, explain: "strftime('%Y-%m-%d') завжди дає дату в форматі РРРР-ММ-ДД, незалежно від того, коли саме запущено скрипт." },
    ],
    task: `Імпортуй datetime з модуля datetime. Отримай now = datetime.now() і через log_action() запиши рядок f"--- Запуск {now.strftime('%Y-%m-%d')} ---". Виведи вміст файлу "organizer_log.txt".`,
    starter: `def log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")\n\n# from datetime import datetime\n# now = ...\n# log_action(...)\n\n# print(open("organizer_log.txt").read())\n`,
    hints: [`from datetime import datetime, потім now = datetime.now()`, `now.strftime('%Y-%m-%d') дає рядок з датою.`, `from datetime import datetime\nnow = datetime.now()\nlog_action(f"--- Запуск {now.strftime('%Y-%m-%d')} ---")\nprint(open("organizer_log.txt").read())`],
    solution: `def log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")\n\nfrom datetime import datetime\nnow = datetime.now()\nlog_action(f"--- Запуск {now.strftime('%Y-%m-%d')} ---")\n\nprint(open("organizer_log.txt").read())`,
    testCode: `if not any("Запуск" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Журнал має містити рядок «--- Запуск ... ---»."}\nelse:\n    __result__ = {"pass": True, "message": "Позначка часу в журналі — те, що дозволяє потім відрізнити, коли саме скрипт запускався востаннє."}`,
  },
  {
    id: "py-automation-20",
    title: "Фінальний проєкт: File Organizer",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків в один цілісний скрипт: запис/читання файлів, os і shutil, get_target_folder(), sort_file() і organize_folder() з try/except, журнал дій із позначкою часу і підсумкова статистика. Це і є File Organizer, обіцяний ще на вступній сторінці «Що це?».\n\nЦей скрипт можна взяти майже без змін і запустити на реальній папці «Завантаження» на своєму комп'ютері — усе, що тут працювало на віртуальній файловій системі браузера, працює так само на справжньому диску.",
    examples: [
      { title: "Повний прогін organize_folder()", code: `os.makedirs("downloads_demo", exist_ok=True)\nfor name in ["a.txt", "b.jpg", "c.mp3"]:\n    with open(os.path.join("downloads_demo", name), "w") as f:\n        f.write("дані")\n\nstats = organize_folder("downloads_demo")\nfor folder, count in stats.items():\n    print(f"{folder}: {count} файл(ів)")\nprint(f"Усього оброблено: {sum(stats.values())}")`, explain: "Три різні типи файлів автоматично розійдуться по трьох різних підпапках за один виклик." },
    ],
    task: `Створи папку "downloads_demo" із файлами "a.txt", "b.jpg", "c.mp3". Виклич organize_folder("downloads_demo"), виведи звіт по кожній папці (folder: N файл(ів)) і підсумок "Усього оброблено: N".`,
    starter: `import os, shutil\nfrom datetime import datetime\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    folders = {".jpg": "images", ".png": "images", ".txt": "documents", ".pdf": "documents", ".mp3": "audio"}\n    return folders.get(ext, "other")\n\ndef log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")\n\ndef organize_folder(path):\n    stats = {}\n    for filename in os.listdir(path):\n        full_path = os.path.join(path, filename)\n        if not os.path.isfile(full_path):\n            continue\n        folder = get_target_folder(filename)\n        os.makedirs(folder, exist_ok=True)\n        try:\n            shutil.move(full_path, os.path.join(folder, filename))\n        except FileNotFoundError:\n            log_action(f"Файл не знайдено: {filename}")\n            continue\n        log_action(f"Переміщено {filename} у {folder}/")\n        stats[folder] = stats.get(folder, 0) + 1\n    return stats\n\nos.makedirs("downloads_demo", exist_ok=True)\nfor name in ["a.txt", "b.jpg", "c.mp3"]:\n    with open(os.path.join("downloads_demo", name), "w") as f:\n        f.write("дані")\n\n# твій код тут: виклич organize_folder і виведи звіт\n`,
    hints: [`stats = organize_folder("downloads_demo")`, `for folder, count in stats.items(): print(f"{folder}: {count} файл(ів)")`, `stats = organize_folder("downloads_demo")\nfor folder, count in stats.items():\n    print(f"{folder}: {count} файл(ів)")\nprint(f"Усього оброблено: {sum(stats.values())}")`],
    solution: `import os, shutil\nfrom datetime import datetime\n\ndef get_target_folder(filename):\n    ext = os.path.splitext(filename)[1].lower()\n    folders = {".jpg": "images", ".png": "images", ".txt": "documents", ".pdf": "documents", ".mp3": "audio"}\n    return folders.get(ext, "other")\n\ndef log_action(message):\n    with open("organizer_log.txt", "a") as f:\n        f.write(message + "\\n")\n\ndef organize_folder(path):\n    stats = {}\n    for filename in os.listdir(path):\n        full_path = os.path.join(path, filename)\n        if not os.path.isfile(full_path):\n            continue\n        folder = get_target_folder(filename)\n        os.makedirs(folder, exist_ok=True)\n        try:\n            shutil.move(full_path, os.path.join(folder, filename))\n        except FileNotFoundError:\n            log_action(f"Файл не знайдено: {filename}")\n            continue\n        log_action(f"Переміщено {filename} у {folder}/")\n        stats[folder] = stats.get(folder, 0) + 1\n    return stats\n\nos.makedirs("downloads_demo", exist_ok=True)\nfor name in ["a.txt", "b.jpg", "c.mp3"]:\n    with open(os.path.join("downloads_demo", name), "w") as f:\n        f.write("дані")\n\nstats = organize_folder("downloads_demo")\nfor folder, count in stats.items():\n    print(f"{folder}: {count} файл(ів)")\nprint(f"Усього оброблено: {sum(stats.values())}")`,
    testCode: `import os\nif "organize_folder" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція organize_folder."}\nelif not (os.path.exists("documents/a.txt") and os.path.exists("images/b.jpg") and os.path.exists("audio/c.mp3")):\n    __result__ = {"pass": False, "message": "Усі три файли мають опинитись у своїх підпапках: documents, images, audio."}\nelif not any("Усього оброблено: 3" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Підсумковий рядок має бути «Усього оброблено: 3»."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Повний File Organizer: сортування, журнал, обробка помилок і звіт — усе з нуля, крок за кроком за 20 уроків."}`,
    finalProject: {
      techs: ["Python 3", "open() / with", "модуль os", "модуль shutil", "модуль datetime", "try/except"],
      skills: [
        "Читання, запис і дозапис файлів",
        "Робота з os: listdir, path.exists, path.join, makedirs",
        "Копіювання й переміщення файлів через shutil",
        "Фільтрація файлів за розширенням",
        "Обробка помилок файлових операцій (try/except)",
        "Журналювання дій і підсумкова статистика",
      ],
      structure:
        "file_organizer.py\n  ├── get_target_folder(filename)  # розширення → назва папки\n  ├── log_action(message)          # дозапис у журнал\n  ├── organize_folder(path)        # головна функція: сканує, сортує, рахує\n  └── organizer_log.txt             # журнал дій (створюється автоматично)",
      code: `import os
import shutil
from datetime import datetime


def get_target_folder(filename):
    ext = os.path.splitext(filename)[1].lower()
    folders = {
        ".jpg": "images", ".png": "images",
        ".txt": "documents", ".pdf": "documents",
        ".mp3": "audio",
    }
    return folders.get(ext, "other")


def log_action(message):
    with open("organizer_log.txt", "a") as f:
        f.write(message + "\\n")


def organize_folder(path):
    stats = {}
    for filename in os.listdir(path):
        full_path = os.path.join(path, filename)
        if not os.path.isfile(full_path):
            continue

        folder = get_target_folder(filename)
        os.makedirs(folder, exist_ok=True)

        try:
            shutil.move(full_path, os.path.join(folder, filename))
        except FileNotFoundError:
            log_action(f"Файл не знайдено: {filename}")
            continue

        log_action(f"Переміщено {filename} у {folder}/")
        stats[folder] = stats.get(folder, 0) + 1

    return stats


if __name__ == "__main__":
    now = datetime.now()
    log_action(f"--- Запуск {now.strftime('%Y-%m-%d %H:%M')} ---")

    stats = organize_folder("downloads_demo")

    for folder, count in stats.items():
        print(f"{folder}: {count} файл(ів)")
    print(f"Усього оброблено: {sum(stats.values())}")`,
      runCommand: "python file_organizer.py",
      installGuide: {
        intro:
          "Тут скрипт сортував файли у віртуальній файловій системі браузера — а не на реальному диску. Щоб цей самий скрипт розібрав твою РЕАЛЬНУ папку «Завантаження», потрібен лише звичайний Python — жодних додаткових бібліотек не встановлюється, os/shutil/datetime вбудовані.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text:
              "Зайди на python.org/downloads і встанови останню версію. Windows: обов'язково постав галочку «Add python.exe to PATH». (Детальні кроки для кожної ОС — в уроках напрямку Game Development.)",
            code: null,
          },
          {
            title: "2. Перевір встановлення",
            text: "Відкрий термінал і виконай:",
            code: "python --version",
          },
          {
            title: "3. Збережи скрипт",
            text:
              "Створи файл file_organizer.py з фінальним кодом вище. Заміни рядок organize_folder(\"downloads_demo\") на реальний шлях до потрібної папки, наприклад organize_folder(\"C:/Users/Ім'я/Downloads\") на Windows або organize_folder(\"/Users/ім'я/Downloads\") на macOS.",
            code: null,
          },
          {
            title: "4. ВАЖЛИВО: спершу протестуй на копії",
            text:
              "shutil.move() переміщує файли НЕЗВОРОТНО. Перш ніж запускати на реальній папці «Завантаження», варто скопіювати кілька тестових файлів в окрему пробну папку й запустити скрипт на ній — щоб переконатись, що сортування працює саме так, як очікується.",
            code: null,
          },
          {
            title: "5. Запусти скрипт",
            text: "Виконай файл — за секунди всі файли з указаної папки розійдуться по підпапках images/, documents/, audio/, other/.",
            code: "python file_organizer.py",
          },
        ],
      },
      improvements: [
        "Запускати скрипт автоматично за розкладом (Windows: Task Scheduler, macOS/Linux: cron)",
        "Додати більше типів файлів і розширень у словник folders",
        "Питати підтвердження в користувача перед переміщенням кожного файлу",
        "Замінити фіксований словник розширень на файл конфігурації (JSON), який можна редагувати без зміни коду",
      ],
      nextLevel:
        "Далі — 🕷️ Web Scraping: той самий принцип «зібрати дані автоматично й обробити їх скриптом» тепер застосовується не до файлів на диску, а до сторінок в інтернеті.",
    },
  },
];
