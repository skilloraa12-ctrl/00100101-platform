// Python Desktop Development — the fourth Python direction. Same intro + 20
// lessons structure, building step by step toward a small desktop-style
// counter app (Label + Buttons + Entry). Real windowed GUIs (Tkinter, the
// library built into Python) need a local display just like Pygame did in
// Game Development — there is no window and no mouse/keyboard inside this
// browser sandbox, and Tkinter itself isn't even part of Pyodide's stdlib
// build (it needs OS-level Tcl/Tk bindings the WASM build doesn't include).
// So the SAME event-driven pattern (widgets, callbacks, state, layout) is
// taught through text-rendered widgets and simulated clicks, exactly like
// Game Development simulated the game loop — real Python code that maps
// directly onto real Tkinter once run locally.
export const PYTHON_DESKTOP_LESSONS = [
  {
    id: "py-desktop-intro",
    title: "Що це? — Desktop Development",
    type: "intro",
    theory:
      "Python Desktop Development — це напрямок про застосунки з вікнами, кнопками й полями введення — програми, які запускають подвійним кліком по іконці, а не відкривають у браузері. Найпоширеніша бібліотека для цього — Tkinter, яка вбудована прямо в Python (не треба нічого встановлювати окремо через pip).\n\nВАЖЛИВО чесно попередити, так само як і в Game Development: справжнє вікно з кнопками не може відкритися прямо в цій браузерній пісочниці — тут немає ні вікна, ні миші, якою можна було б клацнути по кнопці в реальному часі. Більше того, сам Tkinter технічно відсутній у тому «зменшеному» Python, що працює в браузері (він вимагає системних бібліотек, яких немає у веб-версії). Тому ці 20 уроків навчають ТІЙ САМІЙ логіці, яка лежить в основі будь-якого десктопного застосунку (віджети, події, callback-функції, стан застосунку), через текстове представлення вікна — кожен віджет «малює» себе текстом, а клік по кнопці симулюється прямим викликом функції замість реального кліка мишею. Код — справжній Python, який переноситься у реальний Tkinter-застосунок після встановлення на комп'ютері.\n\nЦе вирішує задачу «як взагалі влаштований застосунок із кнопками зсередини»: подієво-орієнтоване програмування (event-driven programming) — код не виконується згори вниз один раз, а ЧЕКАЄ на дії користувача (клік, ввід тексту) і реагує на них через callback-функції; стан застосунку (дані, що змінюються від дій користувача); і компонування кількох віджетів (Label, Button, Entry) в одне вікно. Саме ці принципи використовують у Tkinter, PyQt, і навіть у вебфреймворках на кшталт React — лише спосіб «малювати» відрізняється.\n\nЩо знадобиться з попередніх напрямків: функції (особливо передача функції як значення — callback), а з Python OOP — класи, щоб акуратно описати кожен віджет і сам застосунок. Що буде після 20 уроків: повний текстовий «десктопний» Лічильник — з міткою, кількома кнопками, полем вводу для власного кроку рахунку, і обробкою помилок, зібраний крок за кроком.",
    presentation: [
      { title: "Desktop Development — коротко", points: ["Віджети, події, callback-функції, стан застосунку — та сама логіка, що й у Tkinter", "Тут вікно й кліки симулюються текстом, бо в браузерній пісочниці немає ні вікна, ні Tkinter", "Код — справжній Python, який переноситься у реальний Tkinter-застосунок локально"] },
      { title: "Результат", points: ["20 уроків, кожен додає новий віджет чи можливість", "Фінал: текстовий десктопний Лічильник із кнопками, міткою й полем вводу", "Потрібне знання функцій (callback) і класів (Python OOP)"] },
    ],
  },
  {
    id: "py-desktop-1",
    title: "Що таке десктопний застосунок? Події та callback",
    type: "python",
    theory:
      "Консольна програма (як у Python Core) виконується згори вниз один раз і завершується. Десктопний застосунок з вікном працює зовсім інакше: він ЧЕКАЄ на дії користувача (клік по кнопці, введення тексту) і щоразу викликає ПОТРІБНУ функцію у відповідь — це називається подієво-орієнтоване програмування (event-driven).\n\nФункція, яку викликають у відповідь на подію, називається callback («зворотний виклик»). У Python функцію можна передати як звичайне значення — параметром іншій функції, без дужок (без виклику!): передається саме ІМ'Я функції, а не результат її виконання.\n\ndef say_hello():\n    print(\"Привіт!\")\n\ncallback = say_hello   # передаємо функцію, ще НЕ викликаючи її\ncallback()             # а ось тут — викликаємо",
    examples: [
      { title: "Функція як значення", code: `def say_hello():\n    print("Привіт!")\n\ncallback = say_hello\ncallback()`, explain: "say_hello (без дужок) — це посилання на саму функцію; callback() — вже виклик." },
    ],
    task: `Оголоси функцію say_hello(), що друкує "Привіт!". Збережи її (без дужок) у змінну callback, потім виклич callback().`,
    starter: `def say_hello():\n    print("Привіт!")\n\n# callback = ...\n# callback()\n`,
    hints: [`callback = say_hello — без дужок, це посилання на функцію.`, `callback() — а тут виклик, уже з дужками.`, `callback = say_hello\ncallback()`],
    solution: `def say_hello():\n    print("Привіт!")\n\ncallback = say_hello\ncallback()`,
    testCode: `if not any("Привіт" in l for l in __logs):\n    __result__ = {"pass": False, "message": "callback() має викликати say_hello() і вивести «Привіт!»."}\nelse:\n    __result__ = {"pass": True, "message": "Передача функції як значення — основа того, як кнопка «знає», яку дію виконати при кліку."}`,
  },
  {
    id: "py-desktop-2",
    title: "Клас Label: текстовий віджет",
    type: "python",
    theory:
      "Label (мітка) — найпростіший віджет: просто показує текст, без жодної взаємодії. Опишемо його класом із атрибутом text і методом render(), що повертає текстове представлення (у реальному Tkinter замість render() Label сам малює себе на екрані):\n\nclass Label:\n    def __init__(self, text):\n        self.text = text\n\n    def render(self):\n        return f\"[Мітка: {self.text}]\"\n\nЦе прямий аналог task.__str__() з Python OOP — тільки тут render() викликається явно, а не автоматично через print().",
    examples: [
      { title: "Клас Label", code: `class Label:\n    def __init__(self, text):\n        self.text = text\n\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nlabel = Label("Привіт!")\nprint(label.render())`, explain: "render() повертає текстове представлення віджета — у реальному Tkinter це буде намальований прямокутник із текстом." },
    ],
    task: `Оголоси клас Label(self, text) з методом render(self), що повертає f"[Мітка: {self.text}]". Створи label = Label("Рахунок: 0") і виведи label.render().`,
    starter: `class Label:\n    def __init__(self, text):\n        self.text = text\n\n    def render(self):\n        # твій код тут\n        pass\n\nlabel = Label("Рахунок: 0")\nprint(label.render())\n`,
    hints: [`return f"[Мітка: {self.text}]"`, `render() лише формує й повертає рядок, нічого не друкує сам.`, `def render(self):\n    return f"[Мітка: {self.text}]"`],
    solution: `class Label:\n    def __init__(self, text):\n        self.text = text\n\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nlabel = Label("Рахунок: 0")\nprint(label.render())`,
    testCode: `if "Label" not in globals() or not isinstance(Label, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Label."}\nelse:\n    probe = Label("Тест")\n    if probe.render() != "[Мітка: Тест]":\n        __result__ = {"pass": False, "message": "Label(\\"Тест\\").render() має повернути «[Мітка: Тест]»."}\n    elif not any("Рахунок: 0" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи label.render() через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Label — найпростіший віджет: лише показує текст, без реакції на клік."}`,
  },
  {
    id: "py-desktop-3",
    title: "Клас Button: кнопка з callback",
    type: "python",
    theory:
      "Кнопка (Button), на відміну від Label, УМІЄ реагувати на клік — вона зберігає callback-функцію, яку викличе, коли по ній «клацнуть»:\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n\n    def render(self):\n        return f\"[Кнопка: {self.text}]\"\n\non_click — параметр, у який передають функцію (як у 1-му уроці, без дужок!) — саму дію ще НЕ виконують під час створення кнопки, лише запам'ятовують, ЩО робити пізніше.",
    examples: [
      { title: "Клас Button зберігає callback", code: `def on_click():\n    print("Клік!")\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n\nbutton = Button("Натисни мене", on_click)\nprint(button.render())`, explain: "Button(\"Натисни мене\", on_click) — функція on_click передається БЕЗ дужок, кнопка лише запам'ятовує її." },
    ],
    task: `Оголоси клас Button(self, text, on_click), що зберігає self.text і self.on_click, з методом render(self), що повертає f"[Кнопка: {self.text}]". Створи функцію greet(), що друкує "Привіт!", і кнопку button = Button("Привітай", greet). Виведи button.render().`,
    starter: `def greet():\n    print("Привіт!")\n\nclass Button:\n    def __init__(self, text, on_click):\n        # твій код тут\n        pass\n\n    def render(self):\n        # твій код тут\n        pass\n\nbutton = Button("Привітай", greet)\nprint(button.render())\n`,
    hints: [`self.text = text; self.on_click = on_click`, `render() повертає f"[Кнопка: {self.text}]"`, `def __init__(self, text, on_click):\n    self.text = text\n    self.on_click = on_click\n\ndef render(self):\n    return f"[Кнопка: {self.text}]"`],
    solution: `def greet():\n    print("Привіт!")\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n\nbutton = Button("Привітай", greet)\nprint(button.render())`,
    testCode: `if "Button" not in globals() or not isinstance(Button, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Button."}\nelse:\n    probe = Button("Тест", greet)\n    if probe.render() != "[Кнопка: Тест]" or probe.on_click is not greet:\n        __result__ = {"pass": False, "message": "Button(\\"Тест\\", greet).render() має повернути «[Кнопка: Тест]», а on_click зберегти саму функцію greet."}\n    elif not any("Привітай" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи button.render() через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Кнопка поки що НІЧОГО не робить сама — лише зберігає, ЩО зробити, коли настане клік."}`,
  },
  {
    id: "py-desktop-4",
    title: "Клік: виклик збереженого callback",
    type: "python",
    theory:
      "Додамо кнопці метод click(self), що виконує саме те, заради чого кнопка існує: викликає self.on_click() — функцію, яку запам'ятали в 3-му уроці. У реальному Tkinter цей метод спрацював би автоматично при натисканні мишею; тут ми «натискаємо» вручну, викликаючи click().\n\ndef click(self):\n    self.on_click()\n\nСаме через self.on_click() (З дужками!) callback НАРЕШТІ виконується — до цього моменту він просто «лежав» у пам'яті кнопки.",
    examples: [
      { title: "click() виконує callback", code: `def greet():\n    print("Привіт!")\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n    def click(self):\n        self.on_click()\n\nbutton = Button("Привітай", greet)\nbutton.click()`, explain: "button.click() симулює реальний клік мишею — і саме тепер друкується «Привіт!»." },
    ],
    task: `Додай Button метод click(self), що викликає self.on_click(). Створи button = Button("Привітай", greet) і виклич button.click().`,
    starter: `def greet():\n    print("Привіт!")\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n\n    def click(self):\n        # твій код тут\n        pass\n\nbutton = Button("Привітай", greet)\nbutton.click()\n`,
    hints: [`self.on_click() — виклик з дужками, на відміну від збереження без них.`, `Метод click нічого не повертає, лише викликає callback.`, `def click(self):\n    self.on_click()`],
    solution: `def greet():\n    print("Привіт!")\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n\n    def click(self):\n        self.on_click()\n\nbutton = Button("Привітай", greet)\nbutton.click()`,
    testCode: `if "Button" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Button."}\nelse:\n    calls = []\n    probe = Button("Тест", lambda: calls.append(1))\n    if not hasattr(probe, "click") or not callable(probe.click):\n        __result__ = {"pass": False, "message": "Потрібен метод click(self)."}\n    else:\n        probe.click()\n        if len(calls) != 1:\n            __result__ = {"pass": False, "message": "button.click() має викликати self.on_click() рівно один раз."}\n        elif not any("Привіт" in l for l in __logs):\n            __result__ = {"pass": False, "message": "button.click() з нашим greet-колбеком має вивести «Привіт!»."}\n        else:\n            __result__ = {"pass": True, "message": "click() — симуляція реального натискання мишею: викликає ту функцію, яку кнопка запам'ятала при створенні."}`,
  },
  {
    id: "py-desktop-5",
    title: "Стан застосунку: змінна, спільна для кількох дій",
    type: "python",
    theory:
      "Стан (state) застосунку — це дані, які можуть змінюватись від дій користувача й повинні «пам'ятатись» між кліками. Найпростіший приклад — лічильник count = 0, який кнопка збільшує.\n\nОскільки callback-функція (increment) має ЗМІНЮВАТИ count ззовні себе, потрібне ключове слово global, яке дозволяє функції змінювати змінну з глобальної області видимості, а не створювати свою локальну копію:\n\ncount = 0\n\ndef increment():\n    global count\n    count += 1\n\nБез global рядок count += 1 усередині функції викликав би помилку — Python вважав би count локальною змінною, ще не створеною.",
    examples: [
      { title: "global дозволяє змінювати зовнішню змінну", code: `count = 0\n\ndef increment():\n    global count\n    count += 1\n\nincrement()\nincrement()\nprint(count)`, explain: "Без global функція не змогла б змінити count, що існує ЗА межами самої функції." },
    ],
    task: `Дано count = 0. Напиши increment(), що через global count збільшує count на 1. Виклич increment() двічі і виведи count.`,
    starter: `count = 0\n\ndef increment():\n    # твій код тут\n    pass\n\nincrement()\nincrement()\nprint(count)\n`,
    hints: [`Перший рядок функції: global count`, `Другий рядок: count += 1`, `def increment():\n    global count\n    count += 1`],
    solution: `count = 0\n\ndef increment():\n    global count\n    count += 1\n\nincrement()\nincrement()\nprint(count)`,
    testCode: `if "count" not in globals() or count != 2:\n    __result__ = {"pass": False, "message": "count має дорівнювати 2 після двох викликів increment()."}\nelif not any(l.strip() == "2" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи count через print() — має бути 2."}\nelse:\n    __result__ = {"pass": True, "message": "global — те, що дозволяє callback-функції змінювати спільний стан застосунку, а не власну тимчасову копію."}`,
  },
  {
    id: "py-desktop-6",
    title: "Клас App: контейнер для стану й віджетів",
    type: "python",
    theory:
      "Замість того щоб тримати count окремою глобальною змінною (як у 5-му уроці), зручніше — так само, як Organizer чи Game раніше — зібрати ВЕСЬ стан застосунку в один клас App:\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\nself.widgets — список усіх віджетів вікна (Label, Button), у порядку, в якому вони мають з'явитися. Тепер жоден global не знадобиться — методи App змінюватимуть self.count напряму, як у Task чи Snake раніше.",
    examples: [
      { title: "App зберігає стан і список віджетів", code: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\napp = App()\nprint(app.count)\nprint(app.widgets)`, explain: "self.widgets поки порожній — віджети додамо в наступних уроках." },
    ],
    task: `Оголоси клас App(self) з __init__, що створює self.count = 0 і self.widgets = []. Створи app = App() і виведи app.count та app.widgets.`,
    starter: `class App:\n    def __init__(self):\n        # твій код тут\n        pass\n\napp = App()\nprint(app.count)\nprint(app.widgets)\n`,
    hints: [`self.count = 0`, `self.widgets = []`, `def __init__(self):\n    self.count = 0\n    self.widgets = []`],
    solution: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\napp = App()\nprint(app.count)\nprint(app.widgets)`,
    testCode: `if "App" not in globals() or not isinstance(App, type):\n    __result__ = {"pass": False, "message": "Потрібен клас App."}\nelse:\n    probe = App()\n    if probe.count != 0 or probe.widgets != []:\n        __result__ = {"pass": False, "message": "App().count має бути 0, App().widgets — порожнім списком."}\n    elif not any(l.strip() == "0" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи app.count — має бути 0."}\n    else:\n        __result__ = {"pass": True, "message": "App тепер відповідає за весь стан застосунку — так само, як Organizer чи Game раніше."}`,
  },
  {
    id: "py-desktop-7",
    title: "Метод App.render(): малюємо вікно",
    type: "python",
    theory:
      "render(self) малює все вікно текстом, проходячи по self.widgets і друкуючи render() кожного з них — той самий принцип, що й Game.render() у Game Development, тільки замість сітки клітинок — список віджетів згори вниз:\n\ndef render(self):\n    for widget in self.widgets:\n        print(widget.render())\n\nЦе не залежить від того, Label це чи Button — кожен віджет сам «знає», як себе показати (той самий поліморфізм із Python OOP).",
    examples: [
      { title: "render() показує всі віджети", code: `app = App()\napp.widgets.append(Label("Рахунок: 0"))\napp.widgets.append(Button("+1", lambda: None))\napp.render()`, explain: "render() не питає, ЯКОГО типу кожен віджет — просто викликає widget.render() для кожного." },
    ],
    task: `Додай App метод render(self), що друкує widget.render() для кожного widget з self.widgets. Додай у app.widgets Label("Рахунок: 0") і Button("+1", lambda: None), виклич app.render().`,
    starter: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\n    def render(self):\n        # твій код тут\n        pass\n\napp = App()\napp.widgets.append(Label("Рахунок: 0"))\napp.widgets.append(Button("+1", lambda: None))\napp.render()\n`,
    hints: [`for widget in self.widgets:`, `print(widget.render()) усередині циклу.`, `def render(self):\n    for widget in self.widgets:\n        print(widget.render())`],
    solution: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\n    def render(self):\n        for widget in self.widgets:\n            print(widget.render())\n\napp = App()\napp.widgets.append(Label("Рахунок: 0"))\napp.widgets.append(Button("+1", lambda: None))\napp.render()`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App із методом render."}\nelif not any("Мітка" in l for l in __logs) or not any("Кнопка" in l for l in __logs):\n    __result__ = {"pass": False, "message": "render() має показати і мітку, і кнопку — кожну своїм render()."}\nelse:\n    __result__ = {"pass": True, "message": "App.render() малює ВСЕ вікно одразу, не знаючи наперед, скільки й яких віджетів у ньому буде."}`,
  },
  {
    id: "py-desktop-8",
    title: "Метод App.increment()",
    type: "python",
    theory:
      "Замість глобальної функції increment() з 5-го уроку, зробимо її методом App — тепер вона змінює self.count напряму, без global (яке потрібне лише для глобальних змінних, а не для атрибутів self):\n\ndef increment(self):\n    self.count += 1\n\nЦе точно той самий підхід, що й complete() у Task чи step() у Game — метод класу міняє власний стан об'єкта.",
    examples: [
      { title: "increment() як метод App", code: `app = App()\napp.increment()\napp.increment()\nprint(app.count)`, explain: "self.count += 1 усередині методу не потребує global — self.count уже й так «власний» для app." },
    ],
    task: `Додай App метод increment(self), що збільшує self.count на 1. Створи app = App(), виклич app.increment() двічі і виведи app.count.`,
    starter: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\n    def increment(self):\n        # твій код тут\n        pass\n\napp = App()\napp.increment()\napp.increment()\nprint(app.count)\n`,
    hints: [`self.count += 1`, `Метод нічого не повертає — лише змінює self.count.`, `def increment(self):\n    self.count += 1`],
    solution: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\n    def increment(self):\n        self.count += 1\n\napp = App()\napp.increment()\napp.increment()\nprint(app.count)`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App із методом increment."}\nelse:\n    probe = App()\n    probe.increment(); probe.increment()\n    if probe.count != 2:\n        __result__ = {"pass": False, "message": "Після двох викликів increment() app.count має дорівнювати 2."}\n    elif not any(l.strip() == "2" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи app.count через print()."}\n    else:\n        __result__ = {"pass": True, "message": "increment() тепер живе всередині App — той самий підхід, що complete() в Task чи step() в Game."}`,
  },
  {
    id: "py-desktop-9",
    title: "Прив'язка кнопки до методу App",
    type: "python",
    theory:
      "Тепер об'єднаємо 3-й і 8-й уроки: кнопка «+1» передаватиме як callback не окрему функцію, а МЕТОД самого app — app.increment (без дужок!). Оскільки методи в Python — теж значення, які можна передавати, це працює так само, як зі звичайними функціями в 1-3 уроках:\n\napp = App()\nbutton = Button(\"+1\", app.increment)\nbutton.click()   # викличе app.increment()\nprint(app.count)\n\nПри виклику app.increment() методу вже «прив'язаний» до КОНКРЕТНОГО app — self підставляється автоматично, так само, як при звичайному виклику app.increment().",
    examples: [
      { title: "Метод app.increment як callback кнопки", code: `app = App()\nbutton = Button("+1", app.increment)\nbutton.click()\nbutton.click()\nprint(app.count)`, explain: "app.increment (без дужок) — посилання на метод, уже прив'язаний до app; click() викликає його." },
    ],
    task: `Створи app = App() і button = Button("+1", app.increment). Виклич button.click() двічі і виведи app.count.`,
    starter: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n    def increment(self):\n        self.count += 1\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def click(self):\n        self.on_click()\n\napp = App()\n# button = Button("+1", ...)\n# button.click()\n# button.click()\n# print(app.count)\n`,
    hints: [`button = Button("+1", app.increment) — метод БЕЗ дужок.`, `button.click() викличе app.increment() автоматично.`, `button = Button("+1", app.increment)\nbutton.click()\nbutton.click()\nprint(app.count)`],
    solution: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n    def increment(self):\n        self.count += 1\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def click(self):\n        self.on_click()\n\napp = App()\nbutton = Button("+1", app.increment)\nbutton.click()\nbutton.click()\nprint(app.count)`,
    testCode: `if "app" not in globals() or app.count != 2:\n    __result__ = {"pass": False, "message": "Після двох button.click() app.count має дорівнювати 2."}\nelif not any(l.strip() == "2" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи app.count через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Кнопка не знає, ЩО таке App — вона просто викликає callback, яким цього разу став метод конкретного об'єкта."}`,
  },
  {
    id: "py-desktop-10",
    title: "Кнопка decrement із межею",
    type: "python",
    theory:
      "Додамо App метод decrement(self), що зменшує count, але НЕ дає йому впасти нижче нуля — типова умова у реальних лічильниках:\n\ndef decrement(self):\n    if self.count > 0:\n        self.count -= 1\n\nЯкщо count уже 0, decrement() просто нічого не робить — тіло if не виконується. Це той самий принцип перевірки межі, що й hits_wall() у Game Development, тільки для одного числа замість координат.",
    examples: [
      { title: "decrement() з перевіркою", code: `app = App()\napp.decrement()\napp.decrement()\nprint(app.count)`, explain: "count не опускається нижче 0, навіть якщо decrement() викликати, коли рахунок уже 0." },
    ],
    task: `Додай App метод decrement(self), що зменшує self.count на 1, лише якщо self.count > 0. Створи app = App() і виклич app.decrement() двічі (з count=0), виведи app.count.`,
    starter: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\n    def decrement(self):\n        # твій код тут\n        pass\n\napp = App()\napp.decrement()\napp.decrement()\nprint(app.count)\n`,
    hints: [`if self.count > 0: self.count -= 1`, `Без if рахунок міг би стати від'ємним.`, `def decrement(self):\n    if self.count > 0:\n        self.count -= 1`],
    solution: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\n    def decrement(self):\n        if self.count > 0:\n            self.count -= 1\n\napp = App()\napp.decrement()\napp.decrement()\nprint(app.count)`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App із методом decrement."}\nelse:\n    probe = App()\n    probe.decrement(); probe.decrement()\n    if probe.count != 0:\n        __result__ = {"pass": False, "message": "app.count має лишитись 0 — decrement() не має опускати рахунок нижче нуля."}\n    elif not any(l.strip() == "0" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи app.count через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Перевірка межі в decrement() — те саме, що не давати змійці вилетіти за поле в Game Development."}`,
  },
  {
    id: "py-desktop-11",
    title: "Кнопка reset",
    type: "python",
    theory:
      "reset(self) — найпростіший метод: просто повертає count до початкового значення 0, незалежно від того, яким воно було:\n\ndef reset(self):\n    self.count = 0\n\nНа відміну від increment/decrement, тут не додається чи віднімається — значення просто ПЕРЕЗАПИСУЄТЬСЯ.",
    examples: [
      { title: "reset() обнуляє рахунок", code: `app = App()\napp.increment()\napp.increment()\napp.increment()\napp.reset()\nprint(app.count)`, explain: "Незалежно від того, яким був count (3), reset() завжди ставить його рівно на 0." },
    ],
    task: `Додай App метод reset(self), що встановлює self.count = 0. Виклич app.increment() тричі, потім app.reset(), і виведи app.count.`,
    starter: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n    def increment(self):\n        self.count += 1\n\n    def reset(self):\n        # твій код тут\n        pass\n\napp = App()\napp.increment()\napp.increment()\napp.increment()\napp.reset()\nprint(app.count)\n`,
    hints: [`self.count = 0 — пряме присвоєння, без -=.`, `Метод не перевіряє поточне значення — завжди обнуляє.`, `def reset(self):\n    self.count = 0`],
    solution: `class App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n    def increment(self):\n        self.count += 1\n\n    def reset(self):\n        self.count = 0\n\napp = App()\napp.increment()\napp.increment()\napp.increment()\napp.reset()\nprint(app.count)`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App із методом reset."}\nelse:\n    probe = App()\n    probe.increment(); probe.increment(); probe.increment()\n    probe.reset()\n    if probe.count != 0:\n        __result__ = {"pass": False, "message": "Після reset() app.count має дорівнювати 0, незалежно від попереднього значення."}\n    elif not any(l.strip() == "0" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи app.count через print()."}\n    else:\n        __result__ = {"pass": True, "message": "reset() — третя кнопка майбутнього застосунку, поруч із +1 і -1."}`,
  },
  {
    id: "py-desktop-12",
    title: "Мітка, синхронізована зі станом",
    type: "python",
    theory:
      "У реального Label у Tkinter є спосіб автоматично оновлювати текст, коли змінюються дані. Тут змоделюємо це просто: App матиме метод sync_label(self), що після кожної зміни count оновлює текст мітки:\n\ndef sync_label(self):\n    self.label.text = f\"Рахунок: {self.count}\"\n\nДля цього App має зберігати посилання на саму мітку окремим атрибутом self.label (а не лише в загальному списку self.widgets) — так до неї легко звернутися для оновлення.",
    examples: [
      { title: "sync_label() оновлює текст мітки", code: `app = App()\napp.label = Label("Рахунок: 0")\napp.increment()\napp.sync_label()\nprint(app.label.text)`, explain: "Після зміни app.count текст мітки оновлюється саме тим значенням через f-рядок." },
    ],
    task: `Додай App метод sync_label(self), що встановлює self.label.text = f"Рахунок: {self.count}". Створи app = App(), app.label = Label("Рахунок: 0"), виклич app.increment() і app.sync_label(), виведи app.label.text.`,
    starter: `class Label:\n    def __init__(self, text):\n        self.text = text\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n    def increment(self):\n        self.count += 1\n\n    def sync_label(self):\n        # твій код тут\n        pass\n\napp = App()\napp.label = Label("Рахунок: 0")\napp.increment()\napp.sync_label()\nprint(app.label.text)\n`,
    hints: [`self.label.text = f"Рахунок: {self.count}"`, `Звернення до self.label — атрибут, який ми додали app окремо.`, `def sync_label(self):\n    self.label.text = f"Рахунок: {self.count}"`],
    solution: `class Label:\n    def __init__(self, text):\n        self.text = text\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n    def increment(self):\n        self.count += 1\n\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n\napp = App()\napp.label = Label("Рахунок: 0")\napp.increment()\napp.sync_label()\nprint(app.label.text)`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App із методом sync_label."}\nelse:\n    probe = App()\n    probe.label = Label("Рахунок: 0")\n    probe.increment()\n    probe.sync_label()\n    if probe.label.text != "Рахунок: 1":\n        __result__ = {"pass": False, "message": "Після increment() і sync_label() label.text має стати «Рахунок: 1»."}\n    elif not any("Рахунок: 1" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи app.label.text через print()."}\n    else:\n        __result__ = {"pass": True, "message": "sync_label() — так інтерфейс «дізнається» про зміну даних і показує актуальне значення."}`,
  },
  {
    id: "py-desktop-13",
    title: "Об'єднання: increment оновлює й мітку",
    type: "python",
    theory:
      "Зручніше, щоб increment() САМ викликав sync_label() наприкінці — тоді користувачу (чи кнопці) не треба пам'ятати про два окремі виклики:\n\ndef increment(self):\n    self.count += 1\n    self.sync_label()\n\nТепер один виклик app.increment() одразу і змінює дані, і оновлює те, що видно на екрані — саме так реальні GUI-застосунки лишаються «синхронізованими» з даними.",
    examples: [
      { title: "increment() сам оновлює мітку", code: `app = App()\napp.label = Label("Рахунок: 0")\napp.increment()\napp.increment()\nprint(app.label.text)`, explain: "Не треба окремо викликати sync_label() — increment() робить це сам." },
    ],
    task: `Онови increment(self): після self.count += 1 додай виклик self.sync_label(). Виклич app.increment() двічі і виведи app.label.text.`,
    starter: `class Label:\n    def __init__(self, text):\n        self.text = text\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\n    def increment(self):\n        self.count += 1\n        # твій код тут: онови мітку\n\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n\napp = App()\napp.label = Label("Рахунок: 0")\napp.increment()\napp.increment()\nprint(app.label.text)\n`,
    hints: [`self.sync_label() — виклик одразу після self.count += 1.`, `Тепер це другий рядок методу increment.`, `def increment(self):\n    self.count += 1\n    self.sync_label()`],
    solution: `class Label:\n    def __init__(self, text):\n        self.text = text\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.widgets = []\n\n    def increment(self):\n        self.count += 1\n        self.sync_label()\n\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n\napp = App()\napp.label = Label("Рахунок: 0")\napp.increment()\napp.increment()\nprint(app.label.text)`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App."}\nelse:\n    probe = App()\n    probe.label = Label("Рахунок: 0")\n    probe.increment(); probe.increment()\n    if probe.label.text != "Рахунок: 2":\n        __result__ = {"pass": False, "message": "Після двох increment() label.text має стати «Рахунок: 2» — увесь механізм оновлення тепер усередині increment()."}\n    elif not any("Рахунок: 2" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи app.label.text через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Один виклик increment() — і дані, і те, що видно на екрані, завжди узгоджені."}`,
  },
  {
    id: "py-desktop-14",
    title: "Повне вікно: мітка й три кнопки разом",
    type: "python",
    theory:
      "Зберемо все в одному __init__: App одразу створює власну мітку й три кнопки (+1, -1, Скинути), прив'язані до відповідних методів, і додає їх усіх у self.widgets — щоб render() з 7-го уроку показав усе вікно одразу:\n\ndef __init__(self):\n    self.count = 0\n    self.label = Label(\"Рахунок: 0\")\n    self.widgets = [\n        self.label,\n        Button(\"+1\", self.increment),\n        Button(\"-1\", self.decrement),\n        Button(\"Скинути\", self.reset),\n    ]\n\nЗверни увагу: self.increment тут передається БЕЗ дужок (як у 9-му уроці) — усередині __init__, коли self уже існує, а методи ще не викликаються.",
    examples: [
      { title: "Повне вікно в __init__", code: `app = App()\napp.render()`, explain: "Одразу після створення app вікно містить мітку й три кнопки — усе завдяки __init__." },
    ],
    task: `Онови __init__(self): створи self.label = Label("Рахунок: 0") і self.widgets із міткою та трьома кнопками (+1→increment, -1→decrement, Скинути→reset). Створи app = App() і виклич app.render().`,
    starter: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n    def click(self):\n        self.on_click()\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        # твій код тут: self.label і self.widgets\n\n    def increment(self):\n        self.count += 1\n        self.sync_label()\n    def decrement(self):\n        if self.count > 0:\n            self.count -= 1\n        self.sync_label()\n    def reset(self):\n        self.count = 0\n        self.sync_label()\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n    def render(self):\n        for widget in self.widgets:\n            print(widget.render())\n\napp = App()\napp.render()\n`,
    hints: [`self.label = Label("Рахунок: 0")`, `self.widgets = [self.label, Button("+1", self.increment), Button("-1", self.decrement), Button("Скинути", self.reset)]`, `self.label = Label("Рахунок: 0")\nself.widgets = [\n    self.label,\n    Button("+1", self.increment),\n    Button("-1", self.decrement),\n    Button("Скинути", self.reset),\n]`],
    solution: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n    def click(self):\n        self.on_click()\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.label = Label("Рахунок: 0")\n        self.widgets = [\n            self.label,\n            Button("+1", self.increment),\n            Button("-1", self.decrement),\n            Button("Скинути", self.reset),\n        ]\n\n    def increment(self):\n        self.count += 1\n        self.sync_label()\n    def decrement(self):\n        if self.count > 0:\n            self.count -= 1\n        self.sync_label()\n    def reset(self):\n        self.count = 0\n        self.sync_label()\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n    def render(self):\n        for widget in self.widgets:\n            print(widget.render())\n\napp = App()\napp.render()`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App."}\nelse:\n    probe = App()\n    if len(probe.widgets) != 4:\n        __result__ = {"pass": False, "message": "app.widgets має містити рівно 4 елементи: мітку й три кнопки."}\n    elif not any("Мітка" in l for l in __logs) or __logs.count(next((l for l in __logs if "Кнопка" in l), "")) == 0:\n        __result__ = {"pass": False, "message": "render() має показати і мітку, і кнопки."}\n    elif sum(1 for l in __logs if "Кнопка" in l) != 3:\n        __result__ = {"pass": False, "message": "Мають бути рівно 3 кнопки: +1, -1, Скинути."}\n    else:\n        __result__ = {"pass": True, "message": "Повне вікно готове: одна мітка й три кнопки, кожна прив'язана до свого методу App."}`,
  },
  {
    id: "py-desktop-15",
    title: "Симуляція кліків користувача",
    type: "python",
    theory:
      "У реальному Tkinter користувач клікає мишею, коли захоче. Тут, без миші, задамо ЗАЗДАЛЕГІДЬ послідовність кліків — точно як зі списком moves у Game Development — і «натиснемо» кожну кнопку по черзі:\n\napp = App()\nclicks = [app.widgets[1], app.widgets[1], app.widgets[2]]  # +1, +1, -1\n\nfor button in clicks:\n    button.click()\n\nprint(app.label.text)\n\nКожен button.click() виконує саме той callback, що й реальний клік мишею — різниця лише в тому, ЩО «вирішує», коли клікати.",
    examples: [
      { title: "Заздалегідь задана послідовність кліків", code: `app = App()\nclicks = [app.widgets[1], app.widgets[1], app.widgets[2]]\n\nfor button in clicks:\n    button.click()\n\nprint(app.label.text)`, explain: "app.widgets[1] — це кнопка «+1» (індекс 1, бо 0 — мітка); [2] — кнопка «-1»." },
    ],
    task: `Дано app = App() (з 14-го уроку). Створи clicks = [app.widgets[1], app.widgets[1], app.widgets[2]] (двічі +1, раз -1), пройди циклом for і виклич button.click() для кожної. Виведи app.label.text.`,
    starter: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def click(self):\n        self.on_click()\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.label = Label("Рахунок: 0")\n        self.widgets = [self.label, Button("+1", self.increment), Button("-1", self.decrement), Button("Скинути", self.reset)]\n    def increment(self):\n        self.count += 1\n        self.sync_label()\n    def decrement(self):\n        if self.count > 0:\n            self.count -= 1\n        self.sync_label()\n    def reset(self):\n        self.count = 0\n        self.sync_label()\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n\napp = App()\n\n# clicks = [...]\n# for button in clicks:\n#     ...\n\n# print(app.label.text)\n`,
    hints: [`clicks = [app.widgets[1], app.widgets[1], app.widgets[2]]`, `for button in clicks: button.click()`, `clicks = [app.widgets[1], app.widgets[1], app.widgets[2]]\nfor button in clicks:\n    button.click()\nprint(app.label.text)`],
    solution: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def click(self):\n        self.on_click()\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.label = Label("Рахунок: 0")\n        self.widgets = [self.label, Button("+1", self.increment), Button("-1", self.decrement), Button("Скинути", self.reset)]\n    def increment(self):\n        self.count += 1\n        self.sync_label()\n    def decrement(self):\n        if self.count > 0:\n            self.count -= 1\n        self.sync_label()\n    def reset(self):\n        self.count = 0\n        self.sync_label()\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n\napp = App()\n\nclicks = [app.widgets[1], app.widgets[1], app.widgets[2]]\nfor button in clicks:\n    button.click()\n\nprint(app.label.text)`,
    testCode: `if "app" not in globals() or app.count != 1:\n    __result__ = {"pass": False, "message": "Після +1, +1, -1 app.count має дорівнювати 1."}\nelif not any("Рахунок: 1" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи app.label.text — має бути «Рахунок: 1»."}\nelse:\n    __result__ = {"pass": True, "message": "Список заздалегідь заданих кліків замінює мишу — та сама click()-логіка працює однаково."}`,
  },
  {
    id: "py-desktop-16",
    title: "Клас Entry: поле вводу",
    type: "python",
    theory:
      "Entry (поле вводу) дозволяє користувачу ввести текст. Без реальної клавіатури значення поля просто ВСТАНОВЛЮЄТЬСЯ напряму (як тестові дані), а не набирається по літері — але сама структура даних та сама, що була б і в реальному Tkinter:\n\nclass Entry:\n    def __init__(self, value=\"\"):\n        self.value = value\n\n    def render(self):\n        return f\"[Поле: {self.value}]\"\n\nПотім значення читають через entry.value — так само, як get() у реальному tkinter.Entry().",
    examples: [
      { title: "Клас Entry", code: `class Entry:\n    def __init__(self, value=""):\n        self.value = value\n    def render(self):\n        return f"[Поле: {self.value}]"\n\nentry = Entry()\nentry.value = "5"\nprint(entry.render())`, explain: "entry.value = \"5\" симулює те, що користувач набрав «5» на клавіатурі." },
    ],
    task: `Оголоси клас Entry(self, value="") з render(self), що повертає f"[Поле: {self.value}]". Створи entry = Entry(), встанови entry.value = "3" і виведи entry.render().`,
    starter: `class Entry:\n    def __init__(self, value=""):\n        self.value = value\n\n    def render(self):\n        # твій код тут\n        pass\n\nentry = Entry()\nentry.value = "3"\nprint(entry.render())\n`,
    hints: [`return f"[Поле: {self.value}]"`, `value="" за замовчуванням — поле може бути спершу порожнім.`, `def render(self):\n    return f"[Поле: {self.value}]"`],
    solution: `class Entry:\n    def __init__(self, value=""):\n        self.value = value\n\n    def render(self):\n        return f"[Поле: {self.value}]"\n\nentry = Entry()\nentry.value = "3"\nprint(entry.render())`,
    testCode: `if "Entry" not in globals() or not isinstance(Entry, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Entry."}\nelse:\n    probe = Entry()\n    if probe.value != "":\n        __result__ = {"pass": False, "message": "Entry() без аргументів має мати value=\\"\\" (порожній рядок) за замовчуванням."}\n    else:\n        probe.value = "тест"\n        if probe.render() != "[Поле: тест]":\n            __result__ = {"pass": False, "message": "render() має повернути «[Поле: тест]» після встановлення value."}\n        elif not any("[Поле: 3]" in l for l in __logs):\n            __result__ = {"pass": False, "message": "Виведи entry.render() — має бути «[Поле: 3]»."}\n        else:\n            __result__ = {"pass": True, "message": "Entry — той самий принцип «дані + render()», що й Label, тільки значення можна змінювати ззовні."}`,
  },
  {
    id: "py-desktop-17",
    title: "Кнопка, що читає значення з поля",
    type: "python",
    theory:
      "Зробимо кнопку «Додати крок», яка бере число з Entry (self.step_entry.value) і додає його до рахунку, а не завжди рівно 1:\n\ndef add_step(self):\n    step = int(self.step_entry.value)\n    self.count += step\n    self.sync_label()\n\nint(...) перетворює текстове значення поля (рядок \"3\") на справжнє число 3 — без цього перетворення self.count += step намагався б скласти число з рядком, що викличе помилку.",
    examples: [
      { title: "add_step() читає і перетворює текст", code: `app = App()\napp.step_entry = Entry("5")\napp.add_step()\nprint(app.count)`, explain: "int(app.step_entry.value) перетворює рядок «5» на число 5 перед додаванням." },
    ],
    task: `Додай App метод add_step(self), що бере step = int(self.step_entry.value), додає його до self.count і викликає self.sync_label(). Створи app.step_entry = Entry("5"), виклич app.add_step() і виведи app.count.`,
    starter: `class Entry:\n    def __init__(self, value=""):\n        self.value = value\n\nclass App:\n    def __init__(self):\n        self.count = 0\n\n    def add_step(self):\n        # твій код тут\n        pass\n\n    def sync_label(self):\n        pass\n\napp = App()\napp.step_entry = Entry("5")\napp.add_step()\nprint(app.count)\n`,
    hints: [`step = int(self.step_entry.value)`, `self.count += step, потім self.sync_label()`, `def add_step(self):\n    step = int(self.step_entry.value)\n    self.count += step\n    self.sync_label()`],
    solution: `class Entry:\n    def __init__(self, value=""):\n        self.value = value\n\nclass App:\n    def __init__(self):\n        self.count = 0\n\n    def add_step(self):\n        step = int(self.step_entry.value)\n        self.count += step\n        self.sync_label()\n\n    def sync_label(self):\n        pass\n\napp = App()\napp.step_entry = Entry("5")\napp.add_step()\nprint(app.count)`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App із методом add_step."}\nelse:\n    probe = App()\n    probe.sync_label = lambda: None\n    probe.step_entry = Entry("5")\n    probe.add_step()\n    if probe.count != 5:\n        __result__ = {"pass": False, "message": "Після add_step() з полем «5» app.count має дорівнювати 5."}\n    elif not any(l.strip() == "5" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи app.count через print()."}\n    else:\n        __result__ = {"pass": True, "message": "int() перетворює текст поля на число — без цього кроку рахунок і текст просто склеїлись би в один рядок."}`,
  },
  {
    id: "py-desktop-18",
    title: "Обробка помилки: некоректне число в полі",
    type: "python",
    theory:
      "Якщо користувач введе в поле не число (наприклад \"абв\"), int(\"абв\") викличе помилку ValueError і застосунок «впаде». Захистимо add_step() через try/except, так само, як у Python Core:\n\ndef add_step(self):\n    try:\n        step = int(self.step_entry.value)\n    except ValueError:\n        print(\"Введи число!\")\n        return\n    self.count += step\n    self.sync_label()\n\nreturn усередині except негайно завершує метод — далі self.count += step просто не виконається, якщо перетворення не вдалось.",
    examples: [
      { title: "try/except захищає add_step()", code: `app = App()\napp.step_entry = Entry("абв")\napp.add_step()\nprint(app.count)`, explain: "Замість аварійного завершення програма друкує повідомлення, а count лишається незмінним." },
    ],
    task: `Онови add_step(self): обгорни int(self.step_entry.value) у try/except ValueError, що друкує "Введи число!" і робить return. Створи app.step_entry = Entry("абв"), виклич app.add_step() і виведи app.count (має лишитись 0).`,
    starter: `class Entry:\n    def __init__(self, value=""):\n        self.value = value\n\nclass App:\n    def __init__(self):\n        self.count = 0\n\n    def add_step(self):\n        # твій код тут: try/except навколо int()\n        step = int(self.step_entry.value)\n        self.count += step\n        self.sync_label()\n\n    def sync_label(self):\n        pass\n\napp = App()\napp.step_entry = Entry("абв")\napp.add_step()\nprint(app.count)\n`,
    hints: [`try: step = int(self.step_entry.value)`, `except ValueError: print("Введи число!"); return`, `try:\n    step = int(self.step_entry.value)\nexcept ValueError:\n    print("Введи число!")\n    return\nself.count += step\nself.sync_label()`],
    solution: `class Entry:\n    def __init__(self, value=""):\n        self.value = value\n\nclass App:\n    def __init__(self):\n        self.count = 0\n\n    def add_step(self):\n        try:\n            step = int(self.step_entry.value)\n        except ValueError:\n            print("Введи число!")\n            return\n        self.count += step\n        self.sync_label()\n\n    def sync_label(self):\n        pass\n\napp = App()\napp.step_entry = Entry("абв")\napp.add_step()\nprint(app.count)`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App із методом add_step."}\nelse:\n    probe = App()\n    probe.sync_label = lambda: None\n    probe.step_entry = Entry("абв")\n    probe.add_step()\n    if probe.count != 0:\n        __result__ = {"pass": False, "message": "З некоректним текстом у полі app.count має лишитись 0 (незмінним)."}\n    elif not any("Введи число" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Має вивестись повідомлення «Введи число!»."}\n    else:\n        __result__ = {"pass": True, "message": "try/except захищає застосунок від краху через неправильний ввід користувача — обов'язкова звичка для будь-якого поля вводу."}`,
  },
  {
    id: "py-desktop-19",
    title: "Повне вікно з полем і кнопкою «Додати крок»",
    type: "python",
    theory:
      "Зберемо все у фінальний __init__: мітка, три кнопки з 14-го уроку, плюс поле self.step_entry і четверта кнопка «Додати крок», прив'язана до self.add_step:\n\nself.step_entry = Entry(\"1\")\nself.widgets = [\n    self.label,\n    Button(\"+1\", self.increment),\n    Button(\"-1\", self.decrement),\n    Button(\"Скинути\", self.reset),\n    self.step_entry,\n    Button(\"Додати крок\", self.add_step),\n]\n\nТепер вікно має мітку, три прості кнопки, поле вводу й кнопку, що використовує це поле — повний набір, як у реальному застосунку.",
    examples: [
      { title: "Повне вікно з полем", code: `app = App()\napp.render()`, explain: "render() покаже мітку, всі кнопки й поле вводу — усе, що додано в self.widgets." },
    ],
    task: `Онови __init__: додай self.step_entry = Entry("1") і додай його разом із кнопкою Button("Додати крок", self.add_step) у кінець self.widgets. Створи app = App() і виклич app.render().`,
    starter: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n    def click(self):\n        self.on_click()\n\nclass Entry:\n    def __init__(self, value=""):\n        self.value = value\n    def render(self):\n        return f"[Поле: {self.value}]"\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.label = Label("Рахунок: 0")\n        self.widgets = [\n            self.label,\n            Button("+1", self.increment),\n            Button("-1", self.decrement),\n            Button("Скинути", self.reset),\n        ]\n        # твій код тут: додай self.step_entry і кнопку "Додати крок"\n\n    def increment(self):\n        self.count += 1\n        self.sync_label()\n    def decrement(self):\n        if self.count > 0:\n            self.count -= 1\n        self.sync_label()\n    def reset(self):\n        self.count = 0\n        self.sync_label()\n    def add_step(self):\n        try:\n            step = int(self.step_entry.value)\n        except ValueError:\n            print("Введи число!")\n            return\n        self.count += step\n        self.sync_label()\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n    def render(self):\n        for widget in self.widgets:\n            print(widget.render())\n\napp = App()\napp.render()\n`,
    hints: [`self.step_entry = Entry("1")`, `self.widgets.append(self.step_entry); self.widgets.append(Button("Додати крок", self.add_step))`, `self.step_entry = Entry("1")\nself.widgets.append(self.step_entry)\nself.widgets.append(Button("Додати крок", self.add_step))`],
    solution: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n    def click(self):\n        self.on_click()\n\nclass Entry:\n    def __init__(self, value=""):\n        self.value = value\n    def render(self):\n        return f"[Поле: {self.value}]"\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.label = Label("Рахунок: 0")\n        self.widgets = [\n            self.label,\n            Button("+1", self.increment),\n            Button("-1", self.decrement),\n            Button("Скинути", self.reset),\n        ]\n        self.step_entry = Entry("1")\n        self.widgets.append(self.step_entry)\n        self.widgets.append(Button("Додати крок", self.add_step))\n\n    def increment(self):\n        self.count += 1\n        self.sync_label()\n    def decrement(self):\n        if self.count > 0:\n            self.count -= 1\n        self.sync_label()\n    def reset(self):\n        self.count = 0\n        self.sync_label()\n    def add_step(self):\n        try:\n            step = int(self.step_entry.value)\n        except ValueError:\n            print("Введи число!")\n            return\n        self.count += step\n        self.sync_label()\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n    def render(self):\n        for widget in self.widgets:\n            print(widget.render())\n\napp = App()\napp.render()`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App."}\nelse:\n    probe = App()\n    if len(probe.widgets) != 6:\n        __result__ = {"pass": False, "message": "app.widgets має містити рівно 6 елементів: мітку, 3 кнопки, поле, кнопку «Додати крок»."}\n    elif not any("Поле" in l for l in __logs):\n        __result__ = {"pass": False, "message": "render() має показати і поле вводу — рядок «[Поле: ...]»."}\n    elif sum(1 for l in __logs if "Кнопка" in l) != 4:\n        __result__ = {"pass": False, "message": "Мають бути рівно 4 кнопки: +1, -1, Скинути, Додати крок."}\n    else:\n        __result__ = {"pass": True, "message": "Повне вікно готове: мітка, три прості кнопки й поле з кнопкою, що його читає."}`,
  },
  {
    id: "py-desktop-20",
    title: "Фінальний проєкт: текстовий десктопний Лічильник",
    type: "python",
    theory:
      "Останній крок — прогнати через повний застосунок послідовність симульованих дій користувача (як у 15-му уроці): кілька кліків по +1, один по «Додати крок» із полем, один по -1, і вивести фінальний стан мітки. Це і є десктопний Лічильник, обіцяний ще на вступній сторінці «Що це?».\n\nВесь код — Label, Button, Entry, App з методами increment/decrement/reset/add_step/sync_label/render — переноситься у реальний Tkinter майже без змін: Label → tkinter.Label, Button → tkinter.Button(command=...), Entry → tkinter.Entry() з .get(), а render() замінюється на .pack() і реальне вікно.",
    examples: [
      { title: "Повна симуляція користувацьких дій", code: `app = App()\napp.widgets[1].click()   # +1\napp.widgets[1].click()   # +1\napp.step_entry.value = "10"\napp.widgets[5].click()   # Додати крок\napp.widgets[2].click()   # -1\n\nprint(app.label.text)`, explain: "Ланцюжок дій: 0 → 1 → 2 → (+10) → 12 → 11; фінальний текст мітки покаже 11." },
    ],
    task: `Створи app = App(). Виконай послідовність: двічі клікни app.widgets[1] (+1), встанови app.step_entry.value = "10" і клікни app.widgets[5] (Додати крок), потім клікни app.widgets[2] (-1). Виведи app.label.text.`,
    starter: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n    def click(self):\n        self.on_click()\n\nclass Entry:\n    def __init__(self, value=""):\n        self.value = value\n    def render(self):\n        return f"[Поле: {self.value}]"\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.label = Label("Рахунок: 0")\n        self.widgets = [\n            self.label,\n            Button("+1", self.increment),\n            Button("-1", self.decrement),\n            Button("Скинути", self.reset),\n        ]\n        self.step_entry = Entry("1")\n        self.widgets.append(self.step_entry)\n        self.widgets.append(Button("Додати крок", self.add_step))\n\n    def increment(self):\n        self.count += 1\n        self.sync_label()\n    def decrement(self):\n        if self.count > 0:\n            self.count -= 1\n        self.sync_label()\n    def reset(self):\n        self.count = 0\n        self.sync_label()\n    def add_step(self):\n        try:\n            step = int(self.step_entry.value)\n        except ValueError:\n            print("Введи число!")\n            return\n        self.count += step\n        self.sync_label()\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n    def render(self):\n        for widget in self.widgets:\n            print(widget.render())\n\napp = App()\n\n# твій код тут: послідовність дій\n`,
    hints: [`app.widgets[1].click() — двічі, для +1.`, `app.step_entry.value = "10", потім app.widgets[5].click() і app.widgets[2].click()`, `app.widgets[1].click()\napp.widgets[1].click()\napp.step_entry.value = "10"\napp.widgets[5].click()\napp.widgets[2].click()\nprint(app.label.text)`],
    solution: `class Label:\n    def __init__(self, text):\n        self.text = text\n    def render(self):\n        return f"[Мітка: {self.text}]"\n\nclass Button:\n    def __init__(self, text, on_click):\n        self.text = text\n        self.on_click = on_click\n    def render(self):\n        return f"[Кнопка: {self.text}]"\n    def click(self):\n        self.on_click()\n\nclass Entry:\n    def __init__(self, value=""):\n        self.value = value\n    def render(self):\n        return f"[Поле: {self.value}]"\n\nclass App:\n    def __init__(self):\n        self.count = 0\n        self.label = Label("Рахунок: 0")\n        self.widgets = [\n            self.label,\n            Button("+1", self.increment),\n            Button("-1", self.decrement),\n            Button("Скинути", self.reset),\n        ]\n        self.step_entry = Entry("1")\n        self.widgets.append(self.step_entry)\n        self.widgets.append(Button("Додати крок", self.add_step))\n\n    def increment(self):\n        self.count += 1\n        self.sync_label()\n    def decrement(self):\n        if self.count > 0:\n            self.count -= 1\n        self.sync_label()\n    def reset(self):\n        self.count = 0\n        self.sync_label()\n    def add_step(self):\n        try:\n            step = int(self.step_entry.value)\n        except ValueError:\n            print("Введи число!")\n            return\n        self.count += step\n        self.sync_label()\n    def sync_label(self):\n        self.label.text = f"Рахунок: {self.count}"\n    def render(self):\n        for widget in self.widgets:\n            print(widget.render())\n\napp = App()\n\napp.widgets[1].click()\napp.widgets[1].click()\napp.step_entry.value = "10"\napp.widgets[5].click()\napp.widgets[2].click()\n\nprint(app.label.text)`,
    testCode: `if "app" not in globals() or app.count != 11:\n    __result__ = {"pass": False, "message": "Після +1, +1, +10, -1 app.count має дорівнювати 11 (0→1→2→12→11)."}\nelif not any("Рахунок: 11" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи app.label.text — має бути «Рахунок: 11»."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Повний десктопний Лічильник: мітка, кнопки, поле вводу, стан і обробка помилок — усе з нуля, крок за кроком за 20 уроків."}`,
    finalProject: {
      techs: ["Python 3", "class (Label, Button, Entry, App)", "callback-функції", "методи як значення", "try/except"],
      skills: [
        "Подієво-орієнтоване програмування: callback-функції замість виконання згори вниз",
        "Передача функцій і методів як значень (без виклику)",
        "Стан застосунку, зібраний в одному класі (App)",
        "Синхронізація даних і того, що показано користувачу",
        "Обробка некоректного вводу (try/except ValueError)",
        "Компонування кількох віджетів в одне вікно",
      ],
      structure:
        "counter_app.py\n  ├── class Label            # текстовий віджет\n  ├── class Button           # текст + callback (on_click)\n  ├── class Entry            # поле вводу (value)\n  └── class App              # label, widgets, count\n        ├── increment/decrement/reset\n        ├── add_step()        # читає Entry, обробляє помилку\n        ├── sync_label()       # оновлює мітку після зміни count\n        └── render()           # малює вікно",
      code: `class Label:
    def __init__(self, text):
        self.text = text

    def render(self):
        return f"[Мітка: {self.text}]"


class Button:
    def __init__(self, text, on_click):
        self.text = text
        self.on_click = on_click

    def render(self):
        return f"[Кнопка: {self.text}]"

    def click(self):
        self.on_click()


class Entry:
    def __init__(self, value=""):
        self.value = value

    def render(self):
        return f"[Поле: {self.value}]"


class App:
    def __init__(self):
        self.count = 0
        self.label = Label("Рахунок: 0")
        self.widgets = [
            self.label,
            Button("+1", self.increment),
            Button("-1", self.decrement),
            Button("Скинути", self.reset),
        ]
        self.step_entry = Entry("1")
        self.widgets.append(self.step_entry)
        self.widgets.append(Button("Додати крок", self.add_step))

    def increment(self):
        self.count += 1
        self.sync_label()

    def decrement(self):
        if self.count > 0:
            self.count -= 1
        self.sync_label()

    def reset(self):
        self.count = 0
        self.sync_label()

    def add_step(self):
        try:
            step = int(self.step_entry.value)
        except ValueError:
            print("Введи число!")
            return
        self.count += step
        self.sync_label()

    def sync_label(self):
        self.label.text = f"Рахунок: {self.count}"

    def render(self):
        for widget in self.widgets:
            print(widget.render())


app = App()
app.render()
app.widgets[1].click()
print(app.label.text)`,
      runCommand: "python counter_app.py",
      installGuide: {
        intro:
          "Tkinter уже вбудований у стандартний Python — не потрібно ставити нічого через pip. Найчастіша складність — лише на Linux, де іноді треба довстановити системний пакет окремо.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text:
              "Зайди на python.org/downloads і встанови останню версію для своєї ОС. Windows: обов'язково постав галочку «Add python.exe to PATH» під час встановлення. macOS: офіційний інсталятор або brew install python. (Детальні кроки — в уроках напрямку Game Development, якщо вже проходив(-ла).)",
            code: null,
          },
          {
            title: "2. Перевір, що Tkinter доступний",
            text:
              "На Windows і macOS Tkinter уже входить у стандартну збірку Python. На Linux (Ubuntu/Debian) його іноді треба довстановити окремим системним пакетом:",
            code: "# перевірка (має відкритись маленьке тестове вікно):\npython -m tkinter\n\n# якщо на Linux видає помилку ModuleNotFoundError: No module named 'tkinter':\nsudo apt install python3-tk",
          },
          {
            title: "3. Збережи код і заміни render() на реальні tkinter-віджети",
            text:
              "Створи файл counter_app.py. Класи Label/Button/Entry з цього уроку — заготовка; заміни їх на реальні tkinter.Label, tkinter.Button(command=...), tkinter.Entry(), а render() — на .pack() усередині вікна tkinter.Tk(). Методи increment/decrement/reset/add_step лишаються АБСОЛЮТНО без змін — це і є вся користь від того, що логіка була написана окремо від відображення.",
            code: "import tkinter as tk\n\nroot = tk.Tk()\n# tk.Label(root, text=...).pack()\n# tk.Button(root, text=\"+1\", command=app.increment).pack()\nroot.mainloop()",
          },
          {
            title: "4. Запусти застосунок",
            text: "Виконай файл звичайною командою — має відкритися справжнє вікно з кнопками.",
            code: "python counter_app.py",
          },
        ],
      },
      improvements: [
        "Замінити текстові Label/Button/Entry на реальні tkinter.Label, tkinter.Button, tkinter.Entry",
        "Додати гарячі клавіші (наприклад, стрілки вгору/вниз для +1/-1)",
        "Зберігати останнє значення рахунку у файл і завантажувати його при старті",
        "Додати кілька лічильників в одному вікні (список App-подібних секцій)",
      ],
      nextLevel:
        "Далі — ⚙️ Automation: той самий принцип «маленька функція виконує одну дію» тепер застосовується не до кнопок, а до файлів і папок — автоматизація рутинних задач без будь-якого інтерфейсу взагалі.",
    },
  },
];
