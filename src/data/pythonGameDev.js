// Python Game Development — the third Python direction. Same intro + 20
// lessons structure as Core/OOP, building step by step toward a playable
// text-rendered Snake game (grid drawn with characters, moves simulated by
// a fixed script of directions). Real windowed Pygame needs a local desktop
// Python install with a display — this browser sandbox has neither a window
// nor live keyboard input, so the SAME game logic (state, game loop,
// collisions, score) is taught through a text/ASCII renderer that runs and
// checks for real via Pyodide, exactly like Python Core/OOP. The intro is
// upfront about this trade-off.
export const PYTHON_GAMEDEV_LESSONS = [
  {
    id: "py-gamedev-intro",
    title: "Що це? — Game Development",
    type: "intro",
    theory:
      "Python Game Development — це напрямок про створення ігор: від найпростіших текстових симуляцій до повноцінних вікон з графікою, керуванням клавіатурою та анімацією (найпопулярніша бібліотека для цього — Pygame). Тут Python виконує роль «двигуна гри»: він рахує позиції об'єктів, перевіряє зіткнення, оновлює рахунок і малює кадр за кадром, десятки разів на секунду.\n\nВАЖЛИВО чесно попередити: реальне вікно Pygame з графікою й живим керуванням клавіатурою вимагає окремого встановленого Python на комп'ютері (pip install pygame) і не може відкритися прямо в цій браузерній пісочниці — тут немає ні вікна, ні клавіатури, з якою міг би взаємодіяти код у реальному часі. Тому ці 20 уроків навчають ТІЙ САМІЙ логіці, яка лежить в основі будь-якої гри (ігровий цикл, стан гри, зіткнення, рахунок), через текстовий рендер — гра «малюється» символами (#, *, .) прямо у виводі, а ходи задаються заздалегідь як список напрямків, а не з клавіатури. Уся логіка — справжній Python-код, який спокійно перенесеться у справжній Pygame-проєкт після встановлення бібліотеки локально.\n\nЦе вирішує задачу «як взагалі влаштована гра зсередини»: ігровий цикл (game loop), що повторюється кадр за кадром; стан гри (позиції, рахунок, прапорець «гру закінчено»); обробка вводу (тут — заздалегідь заданий список ходів замість клавіатури); перевірка зіткнень; і малювання поточного кадру. Саме ці принципи використовують у реальних проєктах на Pygame, Godot чи навіть Unity — лише мова й інструменти рендерингу відрізняються.\n\nЩо знадобиться з попередніх напрямків: списки й кортежі (координати), цикли, функції, а з Python OOP — класи (Snake, Game), щоб акуратно зберігати стан гри. Що буде після 20 уроків: повна текстова гра «Змійка» (Snake) — з рухом, їжею, зростанням, зіткненнями зі стінками й собою, рахунком і завершенням гри, зібрана крок за кроком.",
    presentation: [
      { title: "Game Development — коротко", points: ["Ігровий цикл, стан гри, зіткнення, рахунок — та сама логіка, що й у Pygame", "Тут гра малюється текстом (ASCII), бо в браузерній пісочниці немає вікна й клавіатури", "Код — справжній Python, який переноситься у реальний Pygame-проєкт локально"] },
      { title: "Результат", points: ["20 уроків, кожен додає нову механіку гри", "Фінал: текстова гра Змійка (Snake) з рахунком і Game Over", "Потрібне знання Python Core і Python OOP (класи Snake, Game)"] },
    ],
  },
  {
    id: "py-gamedev-1",
    title: "Що таке гра? Ігровий цикл",
    type: "python",
    theory:
      "З погляду програміста, будь-яка гра — це просто ЦИКЛ, що повторюється знову й знову, поки гра триває. На кожному повторенні (кожен такий прохід називають кадром, frame) відбувається одне й те саме: 1) прочитати ввід гравця, 2) оновити стан гри (позиції, рахунок), 3) намалювати поточний кадр. Це і називається ігровий цикл (game loop).\n\nУ реальному Pygame цей цикл виконується десятки разів на секунду, поки гравець не закриє вікно. Тут, без реального часу й клавіатури, змоделюємо найпростіший ігровий цикл — цикл for, що просто рахує кадри: for frame in range(5): print(f\"Кадр {frame}\"). Це вже структура, на яку в наступних уроках нашаровуватиметься справжня логіка гри.",
    examples: [
      { title: "Найпростіший ігровий цикл", code: `for frame in range(5):\n    print(f"Кадр {frame}")`, explain: "Кожен прохід циклу — це один «кадр» гри; у реальній грі тут відбувалось би оновлення й малювання." },
    ],
    task: `Виведи 5 кадрів у форматі "Кадр 0", "Кадр 1", ..., "Кадр 4" за допомогою циклу for і range(5).`,
    starter: `# for frame in range(5):\n#     print(...)\n`,
    hints: [`range(5) дає числа 0, 1, 2, 3, 4.`, `f"Кадр {frame}" підставляє номер кадру в текст.`, `for frame in range(5):\n    print(f"Кадр {frame}")`],
    solution: `for frame in range(5):\n    print(f"Кадр {frame}")`,
    testCode: `expected = [f"Кадр {i}" for i in range(5)]\nif __logs[:5] != expected:\n    __result__ = {"pass": False, "message": "Мають бути виведені рядки «Кадр 0» ... «Кадр 4» по порядку."}\nelse:\n    __result__ = {"pass": True, "message": "Це і є ігровий цикл у найпростішому вигляді — далі кожен «кадр» отримає справжній сенс."}`,
  },
  {
    id: "py-gamedev-2",
    title: "Позиція: координати (x, y)",
    type: "python",
    theory:
      "Будь-який об'єкт на ігровому полі (гравець, ворог, їжа) має позицію — пару чисел (x, y): x — стовпець (по горизонталі), y — рядок (по вертикалі). У Python зручно зберігати таку пару як кортеж (tuple): head = (2, 3).\n\nКортеж схожий на список, але пишеться круглими дужками й зазвичай не змінюється після створення — ідеально для координат, які завжди складаються рівно з двох чисел. Доступ — так само за індексом: head[0] — x, head[1] — y.",
    examples: [
      { title: "Кортеж-координата", code: `head = (2, 3)\nprint(head)\nprint(head[0])\nprint(head[1])`, explain: "head[0] — x (стовпець), head[1] — y (рядок)." },
    ],
    task: `Створи змінну head — кортеж (2, 3), що представляє позицію голови змійки. Виведи head, head[0] і head[1].`,
    starter: `# head = (2, 3)\n# print(head)\n# print(head[0])\n# print(head[1])\n`,
    hints: [`Кортеж пишеться в круглих дужках: (2, 3)`, `head[0] — перше число, head[1] — друге.`, `head = (2, 3)\nprint(head)\nprint(head[0])\nprint(head[1])`],
    solution: `head = (2, 3)\nprint(head)\nprint(head[0])\nprint(head[1])`,
    testCode: `if "head" not in globals() or tuple(head) != (2, 3):\n    __result__ = {"pass": False, "message": "head має бути кортежем (2, 3)."}\nelif not any(l.strip() == "2" for l in __logs) or not any(l.strip() == "3" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи окремо head[0] (2) і head[1] (3)."}\nelse:\n    __result__ = {"pass": True, "message": "Кортеж (x, y) — стандартний спосіб зберігати позицію на ігровому полі."}`,
  },
  {
    id: "py-gamedev-3",
    title: "Напрямок руху",
    type: "python",
    theory:
      "Напрямок руху теж зручно представити кортежем (dx, dy) — на скільки зміниться x і y за один крок. RIGHT = (1, 0) означає «x збільшується на 1, y не змінюється»; DOWN = (0, 1) — «y збільшується на 1» (у текстових сітках вниз зазвичай означає ЗБІЛЬШЕННЯ y, а не зменшення).\n\nЩоб порахувати НАСТУПНУ позицію голови, треба додати напрямок до поточної позиції по кожній координаті окремо: new_head = (head[0] + direction[0], head[1] + direction[1]).",
    examples: [
      { title: "Наступна позиція за напрямком", code: `head = (2, 3)\nRIGHT = (1, 0)\n\nnew_head = (head[0] + RIGHT[0], head[1] + RIGHT[1])\nprint(new_head)`, explain: "(2,3) + рух вправо (1,0) = (3,3) — x збільшився, y лишився той самий." },
    ],
    task: `Дано head = (2, 3) і DOWN = (0, 1). Порахуй new_head, додавши DOWN до head по кожній координаті, і виведи new_head.`,
    starter: `head = (2, 3)\nDOWN = (0, 1)\n\n# new_head = (...)\n# print(new_head)\n`,
    hints: [`new_head = (head[0] + DOWN[0], head[1] + DOWN[1])`, `Результат має бути (2, 4).`, `new_head = (head[0] + DOWN[0], head[1] + DOWN[1])\nprint(new_head)`],
    solution: `head = (2, 3)\nDOWN = (0, 1)\n\nnew_head = (head[0] + DOWN[0], head[1] + DOWN[1])\nprint(new_head)`,
    testCode: `if "new_head" not in globals() or tuple(new_head) != (2, 4):\n    __result__ = {"pass": False, "message": "new_head має дорівнювати (2, 4) — head (2,3) + DOWN (0,1)."}\nelse:\n    __result__ = {"pass": True, "message": "Додавання напрямку до позиції — основа руху в будь-якій грі з координатами."}`,
  },
  {
    id: "py-gamedev-4",
    title: "Змійка як список координат",
    type: "python",
    theory:
      "Змійка складається не з однієї точки, а з кількох — це список кортежів-координат, від голови до хвоста: snake = [(2, 2), (1, 2), (0, 2)] — перший елемент (snake[0]) завжди голова.\n\nТака структура даних прямо повторює те, як у Python Core список зберігав кілька задач: тут список зберігає кілька сегментів тіла змійки, і з ним працюють тими самими інструментами — len(), індексація, цикл for.",
    examples: [
      { title: "Список сегментів", code: `snake = [(2, 2), (1, 2), (0, 2)]\nprint(snake)\nprint(len(snake))\nprint(snake[0])`, explain: "snake[0] — голова змійки; len(snake) — її поточна довжина." },
    ],
    task: `Створи snake — список із трьох кортежів-координат: (2,2), (1,2), (0,2). Виведи snake, len(snake) і snake[0] (голову).`,
    starter: `# snake = [(2, 2), (1, 2), (0, 2)]\n# print(snake)\n# print(len(snake))\n# print(snake[0])\n`,
    hints: [`Список списків/кортежів: [(2,2), (1,2), (0,2)]`, `snake[0] — перший елемент, голова.`, `snake = [(2, 2), (1, 2), (0, 2)]\nprint(snake)\nprint(len(snake))\nprint(snake[0])`],
    solution: `snake = [(2, 2), (1, 2), (0, 2)]\nprint(snake)\nprint(len(snake))\nprint(snake[0])`,
    testCode: `if "snake" not in globals() or [tuple(s) for s in snake] != [(2,2),(1,2),(0,2)]:\n    __result__ = {"pass": False, "message": "snake має бути списком [(2,2), (1,2), (0,2)]."}\nelif not any(l.strip() == "3" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(snake) — має бути 3."}\nelse:\n    __result__ = {"pass": True, "message": "Список координат — тіло змійки від голови (перший елемент) до хвоста (останній)."}`,
  },
  {
    id: "py-gamedev-5",
    title: "Рух змійки: нова голова, старий хвіст",
    type: "python",
    theory:
      "Рух змійки — це не переміщення КОЖНОГО сегмента окремо, а простий трюк: додати нову голову спереду списку й прибрати останній сегмент (хвіст) ззаду. Результат виглядає так, ніби вся змійка «проповзла» на одну клітинку.\n\ndef move_snake(snake, direction):\n    head = snake[0]\n    new_head = (head[0] + direction[0], head[1] + direction[1])\n    new_snake = [new_head] + snake       # нова голова спереду\n    new_snake = new_snake[:-1]            # прибрати останній елемент (старий хвіст)\n    return new_snake\n\n[new_head] + snake створює НОВИЙ список (не змінює snake на місці) — стара змійка лишається недоторканою, а функція повертає результат.",
    examples: [
      { title: "move_snake", code: `def move_snake(snake, direction):\n    head = snake[0]\n    new_head = (head[0] + direction[0], head[1] + direction[1])\n    new_snake = [new_head] + snake\n    return new_snake[:-1]\n\nsnake = [(2, 2), (1, 2), (0, 2)]\nRIGHT = (1, 0)\nsnake = move_snake(snake, RIGHT)\nprint(snake)`, explain: "Після руху вправо: (3,2) стала новою головою, а (0,2) (старий хвіст) зник." },
    ],
    task: `Напиши move_snake(snake, direction), що додає нову голову спереду й прибирає останній елемент. Виклич її для snake = [(2,2),(1,2),(0,2)] з напрямком RIGHT = (1,0) і виведи результат.`,
    starter: `def move_snake(snake, direction):\n    head = snake[0]\n    new_head = (head[0] + direction[0], head[1] + direction[1])\n    # твій код тут: збери новий список і поверни його без останнього елемента\n    pass\n\nsnake = [(2, 2), (1, 2), (0, 2)]\nRIGHT = (1, 0)\nsnake = move_snake(snake, RIGHT)\nprint(snake)\n`,
    hints: [`new_snake = [new_head] + snake`, `return new_snake[:-1] — зріз без останнього елемента.`, `new_snake = [new_head] + snake\nreturn new_snake[:-1]`],
    solution: `def move_snake(snake, direction):\n    head = snake[0]\n    new_head = (head[0] + direction[0], head[1] + direction[1])\n    new_snake = [new_head] + snake\n    return new_snake[:-1]\n\nsnake = [(2, 2), (1, 2), (0, 2)]\nRIGHT = (1, 0)\nsnake = move_snake(snake, RIGHT)\nprint(snake)`,
    testCode: `if "move_snake" not in globals() or not callable(move_snake):\n    __result__ = {"pass": False, "message": "Потрібна функція move_snake(snake, direction)."}\nelse:\n    result = move_snake([(2,2),(1,2),(0,2)], (1,0))\n    result = [tuple(s) for s in result]\n    if result != [(3,2),(2,2),(1,2)]:\n        __result__ = {"pass": False, "message": "move_snake([(2,2),(1,2),(0,2)], (1,0)) має повернути [(3,2),(2,2),(1,2)]."}\n    elif not any("(3, 2)" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи результат руху — новий список має містити (3, 2) як голову."}\n    else:\n        __result__ = {"pass": True, "message": "Нова голова спереду, старий хвіст зникає — так рухається кожна змійка в будь-якій реалізації Snake."}`,
  },
  {
    id: "py-gamedev-6",
    title: "Малювання поля текстом",
    type: "python",
    theory:
      "Щоб «побачити» гру без справжньої графіки, намалюємо поле текстом: для кожного рядка сітки перевіряємо кожну клітинку — якщо в ній є сегмент змійки, друкуємо \"#\", інакше \".\". Проходимо по y (рядки) зовнішнім циклом, по x (стовпці) — внутрішнім.\n\ndef render(snake, width, height):\n    for y in range(height):\n        row = \"\"\n        for x in range(width):\n            row += \"#\" if (x, y) in snake else \".\"\n        print(row)\n\n(x, y) in snake перевіряє, чи є ця координата серед сегментів змійки — той самий оператор in, що й для перевірки задачі у списку в Python Core.",
    examples: [
      { title: "render() малює сітку", code: `def render(snake, width, height):\n    for y in range(height):\n        row = ""\n        for x in range(width):\n            row += "#" if (x, y) in snake else "."\n        print(row)\n\nsnake = [(2, 2)]\nrender(snake, 5, 5)`, explain: "Кожен рядок сітки — окремий print(); символ # з'являється лише там, де є сегмент змійки." },
    ],
    task: `Напиши render(snake, width, height), що малює сітку width×height символами "#" (сегмент змійки) і "." (порожньо). Виклич render для snake=[(2,2)] на полі 5×5.`,
    starter: `def render(snake, width, height):\n    for y in range(height):\n        row = ""\n        for x in range(width):\n            # твій код тут: додай "#" або "." до row\n            pass\n        print(row)\n\nsnake = [(2, 2)]\nrender(snake, 5, 5)\n`,
    hints: [`row += "#" if (x, y) in snake else "."`, `Використай ту саму умову для кожної клітинки в рядку.`, `row += "#" if (x, y) in snake else "."`],
    solution: `def render(snake, width, height):\n    for y in range(height):\n        row = ""\n        for x in range(width):\n            row += "#" if (x, y) in snake else "."\n        print(row)\n\nsnake = [(2, 2)]\nrender(snake, 5, 5)`,
    testCode: `if "render" not in globals() or not callable(render):\n    __result__ = {"pass": False, "message": "Потрібна функція render(snake, width, height)."}\nelif len(__logs) < 5:\n    __result__ = {"pass": False, "message": "Має бути виведено 5 рядків сітки (height=5)."}\nelif __logs[2] != "..#..":\n    __result__ = {"pass": False, "message": "Третій рядок сітки (y=2) має бути «..#..»."}\nelse:\n    __result__ = {"pass": True, "message": "Текстовий рендер — той самий принцип, що й піксельне малювання у Pygame, тільки символами замість кольорових прямокутників."}`,
  },
  {
    id: "py-gamedev-7",
    title: "Їжа: перевірка збігу позицій",
    type: "python",
    theory:
      "Їжа — теж просто координата: food = (3, 3). Щоб дізнатися, чи змійка щойно «з'їла» їжу, достатньо порівняти голову змійки з позицією їжі: snake[0] == food. Якщо кортежі рівні по обидва боках (і x, і y збігаються), Python поверне True.\n\nЦе той самий принцип порівняння, що й для чисел чи рядків — тільки тут порівнюються цілі кортежі одразу, а не окремі числа.",
    examples: [
      { title: "Перевірка з'їдання", code: `snake = [(3, 3), (2, 3)]\nfood = (3, 3)\n\nif snake[0] == food:\n    print("З'їдено!")\nelse:\n    print("Ще ні")`, explain: "snake[0] == food порівнює обидві координати одночасно." },
    ],
    task: `Дано snake = [(3,3),(2,3)] і food = (3,3). Перевір, чи snake[0] == food, і виведи "З'їдено!" якщо так, інакше "Ще ні".`,
    starter: `snake = [(3, 3), (2, 3)]\nfood = (3, 3)\n\n# if snake[0] == food:\n#     ...\n# else:\n#     ...\n`,
    hints: [`if snake[0] == food:`, `print("З'їдено!") в гілці if, print("Ще ні") в гілці else.`, `if snake[0] == food:\n    print("З'їдено!")\nelse:\n    print("Ще ні")`],
    solution: `snake = [(3, 3), (2, 3)]\nfood = (3, 3)\n\nif snake[0] == food:\n    print("З'їдено!")\nelse:\n    print("Ще ні")`,
    testCode: `if not any("З'їдено" in l for l in __logs):\n    __result__ = {"pass": False, "message": "snake[0] дорівнює food — має вивестись «З'їдено!»."}\nelse:\n    __result__ = {"pass": True, "message": "Порівняння кортежів — так гра дізнається, що голова змійки досягла їжі."}`,
  },
  {
    id: "py-gamedev-8",
    title: "Зростання: не прибирати хвіст",
    type: "python",
    theory:
      "У move_snake з 5-го уроку хвіст ЗАВЖДИ прибирався. Але коли змійка з'їдає їжу, вона має ВИРОСТИ — тобто хвіст цього разу прибирати НЕ треба. Додамо параметр grow:\n\ndef move_snake(snake, direction, grow=False):\n    head = snake[0]\n    new_head = (head[0] + direction[0], head[1] + direction[1])\n    new_snake = [new_head] + snake\n    if not grow:\n        new_snake = new_snake[:-1]\n    return new_snake\n\nЯкщо grow=True, зріз [:-1] просто не виконується — список лишається на один елемент довшим, ніж був.",
    examples: [
      { title: "move_snake із зростанням", code: `def move_snake(snake, direction, grow=False):\n    head = snake[0]\n    new_head = (head[0] + direction[0], head[1] + direction[1])\n    new_snake = [new_head] + snake\n    if not grow:\n        new_snake = new_snake[:-1]\n    return new_snake\n\nsnake = [(2, 2), (1, 2)]\nsnake = move_snake(snake, (1, 0), grow=True)\nprint(len(snake))`, explain: "grow=True зберігає весь попередній хвіст і додає нову голову — довжина зростає на 1." },
    ],
    task: `Онови move_snake, додавши параметр grow=False: якщо grow True — НЕ прибирай хвіст. Виклич move_snake([(2,2),(1,2)], (1,0), grow=True) і виведи довжину результату.`,
    starter: `def move_snake(snake, direction, grow=False):\n    head = snake[0]\n    new_head = (head[0] + direction[0], head[1] + direction[1])\n    new_snake = [new_head] + snake\n    # твій код тут: якщо не grow, прибери останній елемент\n    return new_snake\n\nsnake = [(2, 2), (1, 2)]\nsnake = move_snake(snake, (1, 0), grow=True)\nprint(len(snake))\n`,
    hints: [`if not grow: new_snake = new_snake[:-1]`, `Якщо grow True, цей рядок просто пропускається.`, `if not grow:\n    new_snake = new_snake[:-1]\nreturn new_snake`],
    solution: `def move_snake(snake, direction, grow=False):\n    head = snake[0]\n    new_head = (head[0] + direction[0], head[1] + direction[1])\n    new_snake = [new_head] + snake\n    if not grow:\n        new_snake = new_snake[:-1]\n    return new_snake\n\nsnake = [(2, 2), (1, 2)]\nsnake = move_snake(snake, (1, 0), grow=True)\nprint(len(snake))`,
    testCode: `if "move_snake" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція move_snake."}\nelse:\n    grown = move_snake([(2,2),(1,2)], (1,0), grow=True)\n    normal = move_snake([(2,2),(1,2)], (1,0), grow=False)\n    if len(grown) != 3 or len(normal) != 2:\n        __result__ = {"pass": False, "message": "З grow=True довжина має збільшитись до 3, з grow=False лишитись 2."}\n    elif not any(l.strip() == "3" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи довжину змійки після руху з grow=True — має бути 3."}\n    else:\n        __result__ = {"pass": True, "message": "Один прапорець grow — і та сама функція руху вміє і повзти, і рости."}`,
  },
  {
    id: "py-gamedev-9",
    title: "Рахунок: очки за їжу",
    type: "python",
    theory:
      "Рахунок (score) — звичайна змінна-лічильник, як done_count у Python Core: заводимо score = 0, і щоразу, коли змійка з'їдає їжу, збільшуємо score += 10 (чи будь-яке інше число очок за одну їжу).\n\nОб'єднаємо це з перевіркою з 7-го уроку: якщо голова збігається з їжею — рахунок росте І змійка росте (потрібен grow=True з 8-го уроку).",
    examples: [
      { title: "Рахунок росте разом зі змійкою", code: `score = 0\nsnake = [(3, 3), (2, 3)]\nfood = (3, 3)\n\nif snake[0] == food:\n    score += 10\n    print(f"Рахунок: {score}")`, explain: "score += 10 нараховує очки в той самий момент, коли перевіряється з'їдання." },
    ],
    task: `Дано score = 0, snake = [(3,3),(2,3)], food = (3,3). Якщо snake[0] == food, збільш score на 10 і виведи "Рахунок: 10".`,
    starter: `score = 0\nsnake = [(3, 3), (2, 3)]\nfood = (3, 3)\n\n# if snake[0] == food:\n#     score += 10\n#     print(f"Рахунок: {score}")\n`,
    hints: [`score += 10 всередині if.`, `print(f"Рахунок: {score}") — той самий f-рядок, що й у Python Core.`, `if snake[0] == food:\n    score += 10\n    print(f"Рахунок: {score}")`],
    solution: `score = 0\nsnake = [(3, 3), (2, 3)]\nfood = (3, 3)\n\nif snake[0] == food:\n    score += 10\n    print(f"Рахунок: {score}")`,
    testCode: `if "score" not in globals() or score != 10:\n    __result__ = {"pass": False, "message": "score має дорівнювати 10 після з'їдання їжі."}\nelif not any("Рахунок: 10" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи «Рахунок: 10» через f-рядок."}\nelse:\n    __result__ = {"pass": True, "message": "Той самий лічильник, що рахував виконані задачі в Python Core, тут рахує очки гравця."}`,
  },
  {
    id: "py-gamedev-10",
    title: "Зіткнення зі стінками поля",
    type: "python",
    theory:
      "Поле гри має межі: 0 <= x < width і 0 <= y < height. Якщо голова змійки виходить за ці межі — це зіткнення зі стіною, гру треба завершити.\n\ndef hits_wall(head, width, height):\n    x, y = head\n    return x < 0 or x >= width or y < 0 or y >= height\n\nx, y = head — це розпакування кортежу (tuple unpacking): одразу дістає обидва значення в окремі змінні, зручніше за head[0] і head[1] по черзі.",
    examples: [
      { title: "hits_wall() перевіряє межі", code: `def hits_wall(head, width, height):\n    x, y = head\n    return x < 0 or x >= width or y < 0 or y >= height\n\nprint(hits_wall((5, 2), 5, 5))\nprint(hits_wall((2, 2), 5, 5))`, explain: "x=5 на полі шириною 5 (стовпці 0..4) — уже за межею, тому True." },
    ],
    task: `Напиши hits_wall(head, width, height), що повертає True, якщо head виходить за межі поля width×height. Виведи hits_wall((5,2),5,5) і hits_wall((2,2),5,5).`,
    starter: `def hits_wall(head, width, height):\n    x, y = head\n    # твій код тут\n    pass\n\nprint(hits_wall((5, 2), 5, 5))\nprint(hits_wall((2, 2), 5, 5))\n`,
    hints: [`return x < 0 or x >= width or y < 0 or y >= height`, `Умова істинна, якщо ХОЧА Б ОДНА координата за межами.`, `def hits_wall(head, width, height):\n    x, y = head\n    return x < 0 or x >= width or y < 0 or y >= height`],
    solution: `def hits_wall(head, width, height):\n    x, y = head\n    return x < 0 or x >= width or y < 0 or y >= height\n\nprint(hits_wall((5, 2), 5, 5))\nprint(hits_wall((2, 2), 5, 5))`,
    testCode: `if "hits_wall" not in globals() or not callable(hits_wall):\n    __result__ = {"pass": False, "message": "Потрібна функція hits_wall(head, width, height)."}\nelif hits_wall((5,2),5,5) is not True or hits_wall((2,2),5,5) is not False:\n    __result__ = {"pass": False, "message": "hits_wall((5,2),5,5) має бути True, hits_wall((2,2),5,5) — False."}\nelif not (any(l.strip()=="True" for l in __logs) and any(l.strip()=="False" for l in __logs)):\n    __result__ = {"pass": False, "message": "Виведи результат обох викликів — і True, і False."}\nelse:\n    __result__ = {"pass": True, "message": "Перевірка меж поля — обов'язкова умова Game Over у будь-якій грі з обмеженим полем."}`,
  },
  {
    id: "py-gamedev-11",
    title: "Зіткнення з власним тілом",
    type: "python",
    theory:
      "Другий спосіб програти в Snake — врізатись у власне тіло. Перевірка проста: чи є голова серед решти сегментів (усіх, КРІМ самої голови): head in snake[1:].\n\nsnake[1:] — зріз (slice) списку БЕЗ першого елемента (без голови) — усе тіло, окрім самої голови. in перевіряє належність — той самий оператор, що й у 7-му уроці цього напрямку та в Python Core.",
    examples: [
      { title: "Перевірка зіткнення з тілом", code: `snake = [(2, 2), (3, 2), (2, 2)]  # голова знову на (2,2) — уже є в тілі\nhead = snake[0]\nprint(head in snake[1:])`, explain: "snake[1:] — усі сегменти, крім голови; head in ... перевіряє, чи голова там є." },
    ],
    task: `Дано snake = [(2,2),(3,2),(2,2)]. Перевір і виведи, чи snake[0] (голова) є серед snake[1:] (решти тіла).`,
    starter: `snake = [(2, 2), (3, 2), (2, 2)]\n\n# print(snake[0] in snake[1:])\n`,
    hints: [`snake[1:] — зріз без першого елемента.`, `in перевіряє належність: snake[0] in snake[1:]`, `print(snake[0] in snake[1:])`],
    solution: `snake = [(2, 2), (3, 2), (2, 2)]\n\nprint(snake[0] in snake[1:])`,
    testCode: `if not any(l.strip() == "True" for l in __logs):\n    __result__ = {"pass": False, "message": "snake[0] in snake[1:] має вивести True — голова збігається з одним із сегментів тіла."}\nelse:\n    __result__ = {"pass": True, "message": "snake[1:] і оператор in — так гра дізнається, що змійка вкусила саму себе."}`,
  },
  {
    id: "py-gamedev-12",
    title: "Прапорець Game Over",
    type: "python",
    theory:
      "Об'єднаємо дві перевірки зіткнень (стіна й тіло) з 10-го та 11-го уроків в один прапорець game_over: булеву змінну, яка стає True, щойно сталось будь-яке зіткнення.\n\ngame_over = hits_wall(head, width, height) or head in snake[1:]\n\nor повертає True, якщо ХОЧА Б ОДНА з двох умов істинна — рівно те, що потрібно: гра закінчується від СТІНИ АБО від власного ТІЛА.",
    examples: [
      { title: "game_over об'єднує дві умови", code: `def hits_wall(head, width, height):\n    x, y = head\n    return x < 0 or x >= width or y < 0 or y >= height\n\nsnake = [(5, 2), (4, 2)]\nhead = snake[0]\ngame_over = hits_wall(head, 5, 5) or head in snake[1:]\nprint(game_over)`, explain: "or перевіряє обидві причини Game Over одним виразом." },
    ],
    task: `Використовуючи готову hits_wall, порахуй game_over = hits_wall(head, 5, 5) or head in snake[1:] для snake=[(5,2),(4,2)] і виведи game_over.`,
    starter: `def hits_wall(head, width, height):\n    x, y = head\n    return x < 0 or x >= width or y < 0 or y >= height\n\nsnake = [(5, 2), (4, 2)]\nhead = snake[0]\n\n# game_over = ...\n# print(game_over)\n`,
    hints: [`game_over = hits_wall(head, 5, 5) or head in snake[1:]`, `Тут head=(5,2) — вихід за межі (width=5, стовпці 0..4).`, `game_over = hits_wall(head, 5, 5) or head in snake[1:]\nprint(game_over)`],
    solution: `def hits_wall(head, width, height):\n    x, y = head\n    return x < 0 or x >= width or y < 0 or y >= height\n\nsnake = [(5, 2), (4, 2)]\nhead = snake[0]\n\ngame_over = hits_wall(head, 5, 5) or head in snake[1:]\nprint(game_over)`,
    testCode: `if "game_over" not in globals() or game_over is not True:\n    __result__ = {"pass": False, "message": "game_over має бути True — голова (5,2) виходить за межі поля шириною 5."}\nelif not any(l.strip() == "True" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи game_over через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Один прапорець game_over, що об'єднує обидві причини поразки — саме це зупиняє ігровий цикл."}`,
  },
  {
    id: "py-gamedev-13",
    title: "Клас Snake",
    type: "python",
    theory:
      "З Python OOP уже відомо, як об'єднувати дані й поведінку в клас. Обгорнемо змійку в клас Snake: атрибут body (список сегментів) і метод move(direction, grow=False), що повторює логіку move_snake з 5-8 уроків, але тепер змінює self.body напряму.\n\nclass Snake:\n    def __init__(self, body):\n        self.body = body\n\n    def move(self, direction, grow=False):\n        head = self.body[0]\n        new_head = (head[0] + direction[0], head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\n@property head поверх self.body[0] зробить код ще зручнішим — додамо це просто зараз.",
    examples: [
      { title: "Клас Snake із властивістю head", code: `class Snake:\n    def __init__(self, body):\n        self.body = body\n\n    @property\n    def head(self):\n        return self.body[0]\n\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nsnake = Snake([(2, 2), (1, 2)])\nsnake.move((1, 0))\nprint(snake.head)`, explain: "snake.head (без дужок, через @property) завжди повертає поточну голову." },
    ],
    task: `Оголоси клас Snake із __init__(self, body), властивістю head (self.body[0]) і методом move(self, direction, grow=False), що повторює логіку з 5-8 уроків. Створи snake = Snake([(2,2),(1,2)]), виклич snake.move((1,0)) і виведи snake.head.`,
    starter: `class Snake:\n    def __init__(self, body):\n        self.body = body\n\n    @property\n    def head(self):\n        return self.body[0]\n\n    def move(self, direction, grow=False):\n        # твій код тут\n        pass\n\nsnake = Snake([(2, 2), (1, 2)])\nsnake.move((1, 0))\nprint(snake.head)\n`,
    hints: [`new_head = (self.head[0] + direction[0], self.head[1] + direction[1])`, `self.body = [new_head] + self.body, потім, якщо not grow, обріж останній елемент.`, `def move(self, direction, grow=False):\n    new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n    self.body = [new_head] + self.body\n    if not grow:\n        self.body = self.body[:-1]`],
    solution: `class Snake:\n    def __init__(self, body):\n        self.body = body\n\n    @property\n    def head(self):\n        return self.body[0]\n\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nsnake = Snake([(2, 2), (1, 2)])\nsnake.move((1, 0))\nprint(snake.head)`,
    testCode: `if "Snake" not in globals() or not isinstance(Snake, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Snake."}\nelse:\n    probe = Snake([(2,2),(1,2)])\n    probe.move((1,0))\n    if tuple(probe.head) != (3,2) or len(probe.body) != 2:\n        __result__ = {"pass": False, "message": "Після move((1,0)) snake.head має бути (3,2), а довжина body лишитись 2."}\n    elif not any("(3, 2)" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи snake.head після руху."}\n    else:\n        __result__ = {"pass": True, "message": "Тепер уся логіка руху живе всередині Snake — так само, як методи Task в Python OOP."}`,
  },
  {
    id: "py-gamedev-14",
    title: "Клас Game: стан усієї гри",
    type: "python",
    theory:
      "Так само, як Organizer керував списком задач у Python OOP, клас Game керуватиме всією грою: об'єктом Snake, позицією їжі, рахунком і прапорцем game_over — усе в одному місці.\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 2), (1, 2)])\n        self.food = (4, 2)\n        self.score = 0\n        self.game_over = False\n\nТепер game.snake, game.food, game.score — усе доступно через один об'єкт game, а не через окремі змінні, як у попередніх уроках.",
    examples: [
      { title: "Game зберігає весь стан", code: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 2), (1, 2)])\n        self.food = (4, 2)\n        self.score = 0\n        self.game_over = False\n\ngame = Game(5, 5)\nprint(game.snake.head)\nprint(game.food)\nprint(game.score)`, explain: "Один об'єкт game тримає ВЕСЬ стан гри — так простіше передавати його між функціями." },
    ],
    task: `Оголоси клас Game(self, width, height), що зберігає width, height, snake (новий Snake([(2,2),(1,2)])), food=(4,2), score=0, game_over=False. Створи game = Game(5,5) і виведи game.snake.head, game.food, game.score.`,
    starter: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n\nclass Game:\n    def __init__(self, width, height):\n        # твій код тут\n        pass\n\ngame = Game(5, 5)\nprint(game.snake.head)\nprint(game.food)\nprint(game.score)\n`,
    hints: [`self.width = width; self.height = height`, `self.snake = Snake([(2,2),(1,2)]); self.food = (4,2); self.score = 0; self.game_over = False`, `def __init__(self, width, height):\n    self.width = width\n    self.height = height\n    self.snake = Snake([(2, 2), (1, 2)])\n    self.food = (4, 2)\n    self.score = 0\n    self.game_over = False`],
    solution: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 2), (1, 2)])\n        self.food = (4, 2)\n        self.score = 0\n        self.game_over = False\n\ngame = Game(5, 5)\nprint(game.snake.head)\nprint(game.food)\nprint(game.score)`,
    testCode: `if "Game" not in globals() or not isinstance(Game, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Game."}\nelse:\n    probe = Game(5, 5)\n    if tuple(probe.snake.head) != (2,2) or tuple(probe.food) != (4,2) or probe.score != 0 or probe.game_over is not False:\n        __result__ = {"pass": False, "message": "Game(5,5) має створити snake з головою (2,2), food=(4,2), score=0, game_over=False."}\n    elif not any(l.strip() == "0" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи game.score — має бути 0."}\n    else:\n        __result__ = {"pass": True, "message": "Тепер увесь стан гри зібраний в одному об'єкті Game — так само, як Organizer зібрав усі задачі."}`,
  },
  {
    id: "py-gamedev-15",
    title: "Метод Game.render()",
    type: "python",
    theory:
      "Перенесемо функцію render() з 6-го уроку в метод класу Game — тепер вона малює сітку, використовуючи власний стан гри (self.snake.body, self.food, self.width, self.height), а не приймає все окремими параметрами:\n\ndef render(self):\n    for y in range(self.height):\n        row = \"\"\n        for x in range(self.width):\n            if (x, y) in self.snake.body:\n                row += \"#\"\n            elif (x, y) == self.food:\n                row += \"*\"\n            else:\n                row += \".\"\n        print(row)\n\nЗвернення до self.snake.body — це ланцюжок атрибутів: у game.snake лежить об'єкт Snake, а в НЬОГО вже є body.",
    examples: [
      { title: "render() малює і змійку, і їжу", code: `game = Game(5, 5)\ngame.render()`, explain: "# — сегменти змійки, * — їжа, . — порожня клітинка; усе з внутрішнього стану самого game." },
    ],
    task: `Додай Game метод render(self), що малює сітку self.width×self.height: "#" для сегментів self.snake.body, "*" для self.food, "." для решти. Виклич game.render() для game = Game(5, 5).`,
    starter: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 2), (1, 2)])\n        self.food = (4, 2)\n        self.score = 0\n        self.game_over = False\n\n    def render(self):\n        # твій код тут\n        pass\n\ngame = Game(5, 5)\ngame.render()\n`,
    hints: [`Зовнішній цикл по self.height, внутрішній — по self.width.`, `if (x, y) in self.snake.body: "#" elif (x, y) == self.food: "*" else: "."`, `def render(self):\n    for y in range(self.height):\n        row = ""\n        for x in range(self.width):\n            if (x, y) in self.snake.body:\n                row += "#"\n            elif (x, y) == self.food:\n                row += "*"\n            else:\n                row += "."\n        print(row)`],
    solution: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 2), (1, 2)])\n        self.food = (4, 2)\n        self.score = 0\n        self.game_over = False\n\n    def render(self):\n        for y in range(self.height):\n            row = ""\n            for x in range(self.width):\n                if (x, y) in self.snake.body:\n                    row += "#"\n                elif (x, y) == self.food:\n                    row += "*"\n                else:\n                    row += "."\n            print(row)\n\ngame = Game(5, 5)\ngame.render()`,
    testCode: `if "Game" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Game із методом render."}\nelif len(__logs) < 5:\n    __result__ = {"pass": False, "message": "render() має вивести 5 рядків сітки."}\nelif "#" not in "".join(__logs) or "*" not in "".join(__logs):\n    __result__ = {"pass": False, "message": "Сітка має містити і «#» (змійка), і «*» (їжа)."}\nelse:\n    __result__ = {"pass": True, "message": "render() тепер малює сітку прямо зі стану самого об'єкта game — нікуди не треба передавати параметри окремо."}`,
  },
  {
    id: "py-gamedev-16",
    title: "Метод Game.step(): один хід",
    type: "python",
    theory:
      "step(self, direction) виконує ОДИН крок гри: рухає змійку, перевіряє з'їдання їжі (з зростанням), перевіряє зіткнення. Це і є «тіло» ігрового циклу, обгорнуте в один метод:\n\ndef step(self, direction):\n    ate = self.snake.head == self.food or (\n        self.snake.head[0] + direction[0], self.snake.head[1] + direction[1]\n    ) == self.food\n    self.snake.move(direction, grow=ate)\n    if ate:\n        self.score += 10\n    if self.snake.head[0] < 0 or self.snake.head[0] >= self.width or self.snake.head[1] < 0 or self.snake.head[1] >= self.height:\n        self.game_over = True\n    if self.snake.head in self.snake.body[1:]:\n        self.game_over = True\n\nЗверни увагу: перевірка «з'їдено» рахується ще ДО руху — на позиції, куди голова ЩОЙНО переміститься, інакше зростання спрацює на крок пізніше.",
    examples: [
      { title: "step() рухає й перевіряє все за раз", code: `game = Game(5, 5)\ngame.food = (3, 2)  # прямо попереду голови (2,2)\ngame.step((1, 0))\nprint(game.snake.head)\nprint(game.score)`, explain: "Голова (2,2) рухається вправо в (3,2), збігається з food — рахунок зростає." },
    ],
    task: `Додай Game метод step(self, direction): порахуй next_head, перевір ate = next_head == self.food, виклич self.snake.move(direction, grow=ate), і якщо ate — додай 10 до self.score. Виклич game.step((1,0)) з food=(3,2) і виведи game.score.`,
    starter: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 2), (1, 2)])\n        self.food = (3, 2)\n        self.score = 0\n        self.game_over = False\n\n    def step(self, direction):\n        # твій код тут\n        pass\n\ngame = Game(5, 5)\ngame.step((1, 0))\nprint(game.score)\n`,
    hints: [`next_head = (self.snake.head[0] + direction[0], self.snake.head[1] + direction[1])`, `ate = next_head == self.food; self.snake.move(direction, grow=ate); if ate: self.score += 10`, `def step(self, direction):\n    head = self.snake.head\n    next_head = (head[0] + direction[0], head[1] + direction[1])\n    ate = next_head == self.food\n    self.snake.move(direction, grow=ate)\n    if ate:\n        self.score += 10`],
    solution: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 2), (1, 2)])\n        self.food = (3, 2)\n        self.score = 0\n        self.game_over = False\n\n    def step(self, direction):\n        head = self.snake.head\n        next_head = (head[0] + direction[0], head[1] + direction[1])\n        ate = next_head == self.food\n        self.snake.move(direction, grow=ate)\n        if ate:\n            self.score += 10\n\ngame = Game(5, 5)\ngame.step((1, 0))\nprint(game.score)`,
    testCode: `if "Game" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Game із методом step."}\nelse:\n    probe = Game(5, 5)\n    probe.step((1, 0))\n    if probe.score != 10:\n        __result__ = {"pass": False, "message": "Після step((1,0)) з food=(3,2) score має стати 10."}\n    elif tuple(probe.snake.head) != (3, 2):\n        __result__ = {"pass": False, "message": "Після step((1,0)) голова змійки має бути (3,2)."}\n    elif not any(l.strip() == "10" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи game.score — має бути 10."}\n    else:\n        __result__ = {"pass": True, "message": "step() — один повний хід гри: рух, перевірка їжі, оновлення рахунку, все за один виклик."}`,
  },
  {
    id: "py-gamedev-17",
    title: "Перевірка Game Over усередині step()",
    type: "python",
    theory:
      "Додамо в step() перевірку зіткнень з 10-го й 11-го уроків: якщо нова голова виходить за межі поля АБО потрапляє у власне тіло — self.game_over = True.\n\nhead = self.snake.head\nif head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:\n    self.game_over = True\nif head in self.snake.body[1:]:\n    self.game_over = True\n\nЦе робиться ПІСЛЯ self.snake.move(...), коли self.snake.head уже показує НОВУ (оновлену) позицію голови.",
    examples: [
      { title: "step() тепер завершує гру", code: `game = Game(3, 3)\ngame.step((1, 0))\ngame.step((1, 0))\ngame.step((1, 0))  # голова вилітає за межі поля шириною 3\nprint(game.game_over)`, explain: "Три кроки вправо на полі шириною 3 виводять голову за межі — game_over стає True." },
    ],
    task: `Додай у step(self, direction) перевірку меж поля й власного тіла ПІСЛЯ руху, встановлюючи self.game_over = True за потреби. Створи Game(3,3) і зроби 3 кроки (1,0) поспіль, потім виведи game.game_over.`,
    starter: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(0, 0)])\n        self.food = (99, 99)\n        self.score = 0\n        self.game_over = False\n\n    def step(self, direction):\n        self.snake.move(direction)\n        # твій код тут: перевір межі й тіло, онови self.game_over\n\ngame = Game(3, 3)\ngame.step((1, 0))\ngame.step((1, 0))\ngame.step((1, 0))\nprint(game.game_over)\n`,
    hints: [`head = self.snake.head, потім перевір head[0] < 0 or head[0] >= self.width or ...`, `if head in self.snake.body[1:]: self.game_over = True`, `head = self.snake.head\nif head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:\n    self.game_over = True\nif head in self.snake.body[1:]:\n    self.game_over = True`],
    solution: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(0, 0)])\n        self.food = (99, 99)\n        self.score = 0\n        self.game_over = False\n\n    def step(self, direction):\n        self.snake.move(direction)\n        head = self.snake.head\n        if head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:\n            self.game_over = True\n        if head in self.snake.body[1:]:\n            self.game_over = True\n\ngame = Game(3, 3)\ngame.step((1, 0))\ngame.step((1, 0))\ngame.step((1, 0))\nprint(game.game_over)`,
    testCode: `if "Game" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Game."}\nelse:\n    probe = Game(3, 3)\n    probe.step((1,0)); probe.step((1,0)); probe.step((1,0))\n    if probe.game_over is not True:\n        __result__ = {"pass": False, "message": "Після трьох кроків вправо на полі шириною 3 game_over має стати True."}\n    elif not any(l.strip() == "True" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи game.game_over — має бути True."}\n    else:\n        __result__ = {"pass": True, "message": "Тепер step() сам зупиняє гру при зіткненні — саме це робить кожен хід «повним» ходом гри."}`,
  },
  {
    id: "py-gamedev-18",
    title: "Ігровий цикл із заздалегідь заданими ходами",
    type: "python",
    theory:
      "У реальному Pygame напрямок приходить від клавіатури на кожному кадрі. Тут, без клавіатури, задамо ЗАЗДАЛЕГІДЬ список ходів — moves = [(1,0), (1,0), (0,1)] — і пройдемо по ньому циклом for, викликаючи game.step(direction) на кожному кроці, поки не скінчаться ходи АБО не настане game_over.\n\nfor move in moves:\n    if game.game_over:\n        break\n    game.step(move)\n\nbreak негайно зупиняє цикл — сенсу продовжувати ходи немає, якщо гра вже закінчилась.",
    examples: [
      { title: "Цикл ходів із break", code: `game = Game(5, 5)\nmoves = [(1, 0), (1, 0), (0, 1)]\n\nfor move in moves:\n    if game.game_over:\n        break\n    game.step(move)\n\nprint(game.snake.head)\nprint(game.score)`, explain: "Кожен елемент moves — один виклик step(); break зупиняє все раніше, якщо гра закінчилась." },
    ],
    task: `Дано moves = [(1,0), (1,0), (0,1)]. Пройди циклом for по moves, викликаючи game.step(move) для кожного (перевіряй game.game_over і став break, якщо True). Виведи game.snake.head і game.score після циклу.`,
    starter: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 2), (1, 2)])\n        self.food = (4, 4)\n        self.score = 0\n        self.game_over = False\n    def step(self, direction):\n        self.snake.move(direction)\n        head = self.snake.head\n        if head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:\n            self.game_over = True\n        if head in self.snake.body[1:]:\n            self.game_over = True\n\ngame = Game(5, 5)\nmoves = [(1, 0), (1, 0), (0, 1)]\n\n# for move in moves:\n#     ...\n\nprint(game.snake.head)\nprint(game.score)\n`,
    hints: [`for move in moves:`, `if game.game_over: break — інакше game.step(move)`, `for move in moves:\n    if game.game_over:\n        break\n    game.step(move)`],
    solution: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 2), (1, 2)])\n        self.food = (4, 4)\n        self.score = 0\n        self.game_over = False\n    def step(self, direction):\n        self.snake.move(direction)\n        head = self.snake.head\n        if head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:\n            self.game_over = True\n        if head in self.snake.body[1:]:\n            self.game_over = True\n\ngame = Game(5, 5)\nmoves = [(1, 0), (1, 0), (0, 1)]\n\nfor move in moves:\n    if game.game_over:\n        break\n    game.step(move)\n\nprint(game.snake.head)\nprint(game.score)`,
    testCode: `if "Game" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Game."}\nelse:\n    probe = Game(5, 5)\n    probe.food = (4, 4)\n    ms = [(1,0),(1,0),(0,1)]\n    for m in ms:\n        if probe.game_over:\n            break\n        probe.step(m)\n    expected_head = (4, 3)\n    if tuple(probe.snake.head) != expected_head:\n        __result__ = {"pass": False, "message": "Після трьох ходів (1,0),(1,0),(0,1) з голови (2,2) очікується позиція (4,3)."}\n    elif not any("(4, 3)" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи game.snake.head після циклу ходів."}\n    else:\n        __result__ = {"pass": True, "message": "Список заздалегідь заданих ходів замінює клавіатуру — та сама step()-логіка працює однаково."}`,
  },
  {
    id: "py-gamedev-19",
    title: "Повний кадр за кадром: рендер на кожному кроці",
    type: "python",
    theory:
      "Об'єднаємо цикл ходів (18-й урок) із рендером (15-й урок): на кожному кроці спершу малюємо поточний кадр, потім робимо хід — так виглядав би повноцінний ігровий цикл, якби кадри йшли один за одним у реальному часі:\n\nfor move in moves:\n    if game.game_over:\n        break\n    game.render()\n    print(f\"Рахунок: {game.score}\")\n    print(\"---\")\n    game.step(move)\n\nЦе і є повний game loop: рендер → пауза (у реальній грі) → крок → повторити, доки гра триває.",
    examples: [
      { title: "Рендер + крок у кожній ітерації", code: `game = Game(4, 4)\nmoves = [(1, 0), (1, 0)]\n\nfor move in moves:\n    if game.game_over:\n        break\n    game.render()\n    print("---")\n    game.step(move)`, explain: "Кожна ітерація показує кадр ДО ходу, потім виконує сам хід — так само, як реальний ігровий цикл." },
    ],
    task: `Дано game = Game(4,4) і moves = [(1,0), (1,0)]. У циклі for на кожному кроці: якщо не game_over — виклич game.render(), потім print("---"), потім game.step(move).`,
    starter: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(1, 1)])\n        self.food = (9, 9)\n        self.score = 0\n        self.game_over = False\n    def render(self):\n        for y in range(self.height):\n            row = ""\n            for x in range(self.width):\n                row += "#" if (x, y) in self.snake.body else "."\n            print(row)\n    def step(self, direction):\n        self.snake.move(direction)\n        head = self.snake.head\n        if head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:\n            self.game_over = True\n\ngame = Game(4, 4)\nmoves = [(1, 0), (1, 0)]\n\n# for move in moves:\n#     ...\n`,
    hints: [`for move in moves: if game.game_over: break`, `Усередині: game.render(); print("---"); game.step(move)`, `for move in moves:\n    if game.game_over:\n        break\n    game.render()\n    print("---")\n    game.step(move)`],
    solution: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(1, 1)])\n        self.food = (9, 9)\n        self.score = 0\n        self.game_over = False\n    def render(self):\n        for y in range(self.height):\n            row = ""\n            for x in range(self.width):\n                row += "#" if (x, y) in self.snake.body else "."\n            print(row)\n    def step(self, direction):\n        self.snake.move(direction)\n        head = self.snake.head\n        if head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:\n            self.game_over = True\n\ngame = Game(4, 4)\nmoves = [(1, 0), (1, 0)]\n\nfor move in moves:\n    if game.game_over:\n        break\n    game.render()\n    print("---")\n    game.step(move)`,
    testCode: `dash_count = sum(1 for l in __logs if l.strip() == "---")\ngrid_rows = [l for l in __logs if l.strip() != "---" and l.strip()]\nhash_rows = [l for l in grid_rows if "#" in l]\nif dash_count != 2:\n    __result__ = {"pass": False, "message": "Має бути рівно 2 роздільники «---» — по одному на кожен з двох кадрів."}\nelif len(grid_rows) < 8:\n    __result__ = {"pass": False, "message": "Кожен render() малює 4 рядки сітки — за два кадри має бути щонайменше 8 рядків виводу."}\nelif len(hash_rows) < 2:\n    __result__ = {"pass": False, "message": "У кожному з двох кадрів має бути рядок із «#» — позиція змійки."}\nelse:\n    __result__ = {"pass": True, "message": "Рендер → крок → рендер → крок — це і є справжній ігровий цикл, лише без реального часу між кадрами."}`,
  },
  {
    id: "py-gamedev-20",
    title: "Фінальний проєкт: текстова гра Змійка",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків: класи Snake і Game (рух, зростання, рендер, крок, зіткнення), список заздалегідь заданих ходів, повний ігровий цикл із рендером на кожному кроці, і фінальне повідомлення після завершення — або через game_over, або через вичерпання ходів.\n\nЦе і є гра «Змійка», обіцяна ще на вступній сторінці «Що це?» — та сама логіка (стан, рух, зіткнення, рахунок, ігровий цикл), що лежить в основі реального Pygame-проєкту, тільки намальована текстом замість пікселів.",
    examples: [
      { title: "Фінальне повідомлення після циклу", code: `for move in moves:\n    if game.game_over:\n        break\n    game.step(move)\n\nif game.game_over:\n    print(f"Гру закінчено. Рахунок: {game.score}")\nelse:\n    print(f"Ходи скінчились. Рахунок: {game.score}")`, explain: "Одне з двох повідомлень з'явиться залежно від того, чому цикл зупинився." },
    ],
    task: `Заверши гру: після циклу по moves виведи "Гру закінчено. Рахунок: X" якщо game.game_over, інакше "Ходи скінчились. Рахунок: X". Використай moves = [(1,0), (1,0), (1,0), (0,1)] на полі Game(4, 4) з food=(3,0) так, щоб перший крок з'їв їжу.`,
    starter: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 0), (1, 0)])\n        self.food = (3, 0)\n        self.score = 0\n        self.game_over = False\n    def render(self):\n        for y in range(self.height):\n            row = ""\n            for x in range(self.width):\n                if (x, y) in self.snake.body:\n                    row += "#"\n                elif (x, y) == self.food:\n                    row += "*"\n                else:\n                    row += "."\n            print(row)\n    def step(self, direction):\n        head = self.snake.head\n        next_head = (head[0] + direction[0], head[1] + direction[1])\n        ate = next_head == self.food\n        self.snake.move(direction, grow=ate)\n        if ate:\n            self.score += 10\n        head = self.snake.head\n        if head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:\n            self.game_over = True\n        if head in self.snake.body[1:]:\n            self.game_over = True\n\ngame = Game(4, 4)\nmoves = [(1, 0), (1, 0), (1, 0), (0, 1)]\n\nfor move in moves:\n    if game.game_over:\n        break\n    game.render()\n    print("---")\n    game.step(move)\n\n# твій код тут: фінальне повідомлення\n`,
    hints: [`if game.game_over: print(f"Гру закінчено. Рахунок: {game.score}")`, `else: print(f"Ходи скінчились. Рахунок: {game.score}")`, `if game.game_over:\n    print(f"Гру закінчено. Рахунок: {game.score}")\nelse:\n    print(f"Ходи скінчились. Рахунок: {game.score}")`],
    solution: `class Snake:\n    def __init__(self, body):\n        self.body = body\n    @property\n    def head(self):\n        return self.body[0]\n    def move(self, direction, grow=False):\n        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])\n        self.body = [new_head] + self.body\n        if not grow:\n            self.body = self.body[:-1]\n\nclass Game:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n        self.snake = Snake([(2, 0), (1, 0)])\n        self.food = (3, 0)\n        self.score = 0\n        self.game_over = False\n    def render(self):\n        for y in range(self.height):\n            row = ""\n            for x in range(self.width):\n                if (x, y) in self.snake.body:\n                    row += "#"\n                elif (x, y) == self.food:\n                    row += "*"\n                else:\n                    row += "."\n            print(row)\n    def step(self, direction):\n        head = self.snake.head\n        next_head = (head[0] + direction[0], head[1] + direction[1])\n        ate = next_head == self.food\n        self.snake.move(direction, grow=ate)\n        if ate:\n            self.score += 10\n        head = self.snake.head\n        if head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:\n            self.game_over = True\n        if head in self.snake.body[1:]:\n            self.game_over = True\n\ngame = Game(4, 4)\nmoves = [(1, 0), (1, 0), (1, 0), (0, 1)]\n\nfor move in moves:\n    if game.game_over:\n        break\n    game.render()\n    print("---")\n    game.step(move)\n\nif game.game_over:\n    print(f"Гру закінчено. Рахунок: {game.score}")\nelse:\n    print(f"Ходи скінчились. Рахунок: {game.score}")`,
    testCode: `if "Game" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні класи Game і Snake."}\nelif game.score != 10:\n    __result__ = {"pass": False, "message": "game.score має дорівнювати 10 — перший крок мав з'їсти їжу на (3,0)."}\nelif not any("Рахунок: 10" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи фінальне повідомлення з рахунком 10."}\nelif not (any("Гру закінчено" in l for l in __logs) or any("Ходи скінчились" in l for l in __logs)):\n    __result__ = {"pass": False, "message": "Фінальне повідомлення має бути «Гру закінчено...» або «Ходи скінчились...» залежно від game.game_over."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Повна текстова гра Змійка: рух, зростання, зіткнення, рахунок і завершення — все з нуля, крок за кроком за 20 уроків."}`,
    finalProject: {
      techs: ["Python 3", "class (Snake, Game)", "кортежі (x, y)", "list slicing", "@property", "ігровий цикл (for + break)"],
      skills: [
        "Представлення стану гри через координати й списки",
        "Ігровий цикл: рендер → крок → перевірка стану",
        "Рух і зростання об'єкта через маніпуляції зі списком",
        "Перевірка зіткнень (межі поля, власне тіло)",
        "Об'єднання стану гри в класи (Snake, Game)",
        "Рахунок і завершення гри (Game Over)",
      ],
      structure:
        "snake_game.py\n  ├── class Snake          # body, head, move(direction, grow)\n  ├── class Game           # snake, food, score, game_over\n  │     ├── render()        # малює сітку текстом\n  │     └── step(direction) # один хід: рух + їжа + зіткнення\n  └── moves = [...]         # заздалегідь заданий список ходів (немає клавіатури)",
      code: `class Snake:
    def __init__(self, body):
        self.body = body

    @property
    def head(self):
        return self.body[0]

    def move(self, direction, grow=False):
        new_head = (self.head[0] + direction[0], self.head[1] + direction[1])
        self.body = [new_head] + self.body
        if not grow:
            self.body = self.body[:-1]


class Game:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.snake = Snake([(2, 0), (1, 0)])
        self.food = (3, 0)
        self.score = 0
        self.game_over = False

    def render(self):
        for y in range(self.height):
            row = ""
            for x in range(self.width):
                if (x, y) in self.snake.body:
                    row += "#"
                elif (x, y) == self.food:
                    row += "*"
                else:
                    row += "."
            print(row)

    def step(self, direction):
        head = self.snake.head
        next_head = (head[0] + direction[0], head[1] + direction[1])
        ate = next_head == self.food
        self.snake.move(direction, grow=ate)
        if ate:
            self.score += 10

        head = self.snake.head
        if head[0] < 0 or head[0] >= self.width or head[1] < 0 or head[1] >= self.height:
            self.game_over = True
        if head in self.snake.body[1:]:
            self.game_over = True


game = Game(4, 4)
moves = [(1, 0), (1, 0), (1, 0), (0, 1)]

for move in moves:
    if game.game_over:
        break
    game.render()
    print("---")
    game.step(move)

if game.game_over:
    print(f"Гру закінчено. Рахунок: {game.score}")
else:
    print(f"Ходи скінчились. Рахунок: {game.score}")`,
      runCommand: "python snake_game.py",
      installGuide: {
        intro:
          "Тут гра малюється текстом, бо в браузерній пісочниці немає вікна й клавіатури. Щоб побачити ЦЕЙ ЖЕ код (або доопрацьований, зі справжньою графікою через Pygame) у справжньому вікні на своєму комп'ютері — встанови Python і Pygame за цими кроками. Це займає 10-15 хвилин.",
        steps: [
          {
            title: "1. Завантаж і встанови Python",
            text:
              "Зайди на офіційний сайт python.org/downloads і завантаж останню стабільну версію (3.11 або новішу) для своєї операційної системи.\n\nWindows: під час встановлення ОБОВ'ЯЗКОВО постав галочку «Add python.exe to PATH» внизу вікна інсталятора — без неї команда python не працюватиме в терміналі. Далі просто «Install Now».\n\nmacOS: підійде офіційний інсталятор з python.org, або через Homebrew (якщо він уже встановлений): brew install python.\n\nLinux (Ubuntu/Debian): Python зазвичай уже є в системі; якщо немає — онови пакети й встанови через термінал.",
            code: "# Linux (Ubuntu/Debian), якщо Python ще не встановлений:\nsudo apt update\nsudo apt install python3 python3-pip",
          },
          {
            title: "2. Перевір, що Python установився",
            text:
              "Відкрий термінал (Windows: PowerShell або cmd; macOS/Linux: застосунок «Термінал») і виконай команду нижче. Має вивестись номер версії, наприклад Python 3.12.1. Якщо система каже «команду не знайдено» — на macOS/Linux спробуй python3 замість python.",
            code: "python --version",
          },
          {
            title: "3. Перевір pip (менеджер пакетів Python)",
            text:
              "pip встановлюється РАЗОМ із Python автоматично — саме ним встановлюється pygame та будь-яка інша бібліотека. Перевір, що він теж на місці:",
            code: "pip --version",
          },
          {
            title: "4. Встанови Pygame",
            text:
              "Одна команда завантажить і встановить бібліотеку. Це займає 10-30 секунд залежно від інтернету. Якщо pip install не спрацює напряму — використай варіант через python -m pip, він гарантовано ставить пакет саме в ту версію Python, яку показала команда python --version.",
            code: "pip install pygame\n\n# якщо не спрацювало, спробуй:\npython -m pip install pygame",
          },
          {
            title: "5. Перевір, що pygame справді встановився",
            text:
              "Ця команда імпортує pygame прямо з терміналу й виводить його версію. Якщо номер версії з'явився без помилок — усе встановлено правильно.",
            code: `python -c "import pygame; print(pygame.ver)"`,
          },
          {
            title: "6. Збережи код і запусти гру",
            text:
              "Створи звичайний текстовий файл з іменем snake_game.py, встав туди фінальний код із цього уроку (з розділу «Фінальний код» вище) і виконай його командою запуску. Поки що вікно не відкриється — код так само малює текстом; це вихідна точка, щоб замінити render() на справжнє pygame.display, коли будеш готовий(-а) йти далі.",
            code: "python snake_game.py",
          },
          {
            title: "Типові проблеми",
            text:
              "«python не є внутрішньою чи зовнішньою командою» (Windows) — Python встановився без галочки «Add to PATH»; перевстанови інсталятор і постав галочку.\n\n«No module named pygame» — pip встановив пакет в іншу версію Python, ніж та, що запускає скрипт; використай python -m pip install pygame замість просто pip install pygame.\n\nРекомендація (не обов'язково): використовуй віртуальне середовище (venv), щоб пакети різних проєктів не змішувались одне з одним.",
            code: "python -m venv venv\n\n# активація:\n# Windows:\nvenv\\Scripts\\activate\n# macOS/Linux:\nsource venv/bin/activate\n\n# і вже всередині активованого середовища:\npip install pygame",
          },
        ],
      },
      improvements: [
        "Встановити pygame локально (pip install pygame) і замінити текстовий render() на реальне малювання прямокутників у вікні",
        "Прив'язати напрямок руху до клавіш замість заздалегідь заданого списку moves",
        "Додати випадкову появу нової їжі після кожного з'їдання (модуль random)",
        "Додати рівні складності (швидкість руху зростає з рахунком)",
      ],
      nextLevel:
        "Далі — 🖥️ Desktop Development: той самий принцип «клас, що тримає стан, і цикл подій» лежить в основі десктопних застосунків із вікнами й кнопками — тільки замість ігрового поля буде інтерфейс користувача.",
    },
  },
];
