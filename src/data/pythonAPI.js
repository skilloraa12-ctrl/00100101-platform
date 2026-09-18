// Python API Development — the seventh Python direction. Same intro + 20
// lessons structure, building step by step toward a small REST-style Task
// API. A real API server (Flask/FastAPI) binds a socket and listens for
// live HTTP connections — something no browser sandbox can do (there is no
// raw socket API in WASM/JS). So instead of a live server, these lessons
// build a genuine miniature routing framework in plain Python (Request/
// Response objects, a route table, a dispatcher, path parameters) and
// simulate incoming requests as direct function calls — the exact same
// routing/dispatch logic real frameworks use internally, just without the
// socket layer underneath it. The code maps directly onto Flask/FastAPI
// route handlers once installed and run locally.
export const PYTHON_API_LESSONS = [
  {
    id: "py-api-intro",
    title: "Що це? — API Development",
    type: "intro",
    theory:
      "Python API Development — це напрямок про створення власного API (Application Programming Interface) — інтерфейсу, через який ІНШІ програми (мобільний застосунок, сайт, інший сервер) отримують і надсилають дані твоєму серверу, не через сторінку в браузері, а через структуровані запити й відповіді у форматі JSON.\n\nВАЖЛИВО чесно попередити: справжній API-сервер (на Flask, FastAPI чи Django) відкриває мережевий порт і РЕАЛЬНО слухає вхідні HTTP-з'єднання — цього браузерна пісочниця технічно не може зробити (немає низькорівневого доступу до сокетів). Тому ці 20 уроків будують СПРАВЖНІЙ маршрутизатор (router) на чистому Python — той самий механізм, що працює ВСЕРЕДИНІ Flask чи FastAPI: таблицю маршрутів, розбір шляху з параметрами, диспетчеризацію запиту до потрібного обробника. «Запити» тут — це прямі виклики функцій (app.handle_request(\"GET\", \"/tasks\")) замість реальних HTTP-з'єднань, але сама логіка маршрутизації ідентична тій, що працює в промислових фреймворках.\n\nЦе вирішує задачу «як сервер розуміє, ЩО саме прислав клієнт і що йому відповісти»: розбір методу (GET/POST/PUT/DELETE) і шляху (/tasks/5), пошук відповідного обробника, виконання дії (читання/запис даних) і формування відповіді зі статус-кодом (200, 404, 400) та тілом у форматі JSON.\n\nЩо знадобиться з попередніх напрямків: класи (Python OOP) для Request/Response/App, словники й списки (Python Core) для маршрутів і «бази даних» у пам'яті. Що буде після 20 уроків: повний Task API — REST-подібний інтерфейс для списку задач (той самий органайзер із Python Core!) із GET/POST/PUT/DELETE, валідацією й журналом запитів.",
    presentation: [
      { title: "API Development — коротко", points: ["Request → маршрутизація → обробник → Response — той самий механізм, що всередині Flask/FastAPI", "Тут запити — прямі виклики функцій, бо в пісочниці немає доступу до мережевих сокетів", "Той самий Task API з цих уроків переноситься на Flask/FastAPI майже без змін"] },
      { title: "Результат", points: ["20 уроків, кожен додає нову можливість API", "Фінал: Task API з GET/POST/PUT/DELETE для списку задач", "Потрібне знання класів (Python OOP) і словників/списків (Python Core)"] },
    ],
  },
  {
    id: "py-api-1",
    title: "API: дані замість сторінки",
    type: "python",
    theory:
      "Звичайний сайт повертає HTML-сторінку, яку показує браузер. API повертає ДАНІ — здебільшого у форматі JSON (JavaScript Object Notation), який легко читають і люди, і програми: {\"name\": \"Купити хліб\", \"done\": false}. Це та сама структура, що й Python-словник, лише записана як текст для передачі мережею.\n\nЗапит до API складається з методу (GET — отримати дані, POST — створити, PUT — оновити, DELETE — видалити) і шляху (/tasks, /tasks/5). Відповідь має статус-код (200 — усе добре, 404 — не знайдено, 400 — помилка в запиті) і тіло з даними.",
    examples: [
      { title: "API-дані як словник Python", code: `task = {"id": 1, "name": "Купити хліб", "done": False}\nstatus = 200\nprint(f"Статус: {status}")\nprint(task)`, explain: "Це і є «форма» відповіді API — статус-код окремо, дані окремо." },
    ],
    task: `Створи словник task = {"id": 1, "name": "Купити хліб", "done": False} і status = 200. Виведи f"Статус: {status}" і task.`,
    starter: `# task = {"id": 1, "name": "Купити хліб", "done": False}\n# status = 200\n# print(f"Статус: {status}")\n# print(task)\n`,
    hints: [`Словник task — з полями id, name, done.`, `status — просто число 200.`, `task = {"id": 1, "name": "Купити хліб", "done": False}\nstatus = 200\nprint(f"Статус: {status}")\nprint(task)`],
    solution: `task = {"id": 1, "name": "Купити хліб", "done": False}\nstatus = 200\nprint(f"Статус: {status}")\nprint(task)`,
    testCode: `if "task" not in globals() or task.get("name") != "Купити хліб":\n    __result__ = {"pass": False, "message": "task має містити ключ name зі значенням «Купити хліб»."}\nelif not any("Статус: 200" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи «Статус: 200» через f-рядок."}\nelse:\n    __result__ = {"pass": True, "message": "Статус-код окремо від даних — так побудована відповідь БУДЬ-якого API, від найпростішого до промислового."}`,
  },
  {
    id: "py-api-2",
    title: "JSON: серіалізація даних",
    type: "python",
    theory:
      "Модуль json (стандартна бібліотека) перетворює Python-об'єкти (словники, списки) у текстовий рядок JSON і навпаки. json.dumps(об'єкт) — перетворює Python → JSON-текст (serialize); json.loads(текст) — навпаки, JSON-текст → Python (deserialize):\n\nimport json\n\ntask = {\"id\": 1, \"name\": \"Купити хліб\"}\ntext = json.dumps(task)\nprint(text)          # '{\"id\": 1, \"name\": \"Купити хліб\"}'\nprint(type(text))    # <class 'str'> — тепер це просто текст!\n\nresult = json.loads(text)\nprint(result == task)  # True — розібраний назад у словник",
    examples: [
      { title: "dumps і loads — туди і назад", code: `import json\n\ntask = {"id": 1, "name": "Купити хліб"}\ntext = json.dumps(task)\nprint(text)\n\nresult = json.loads(text)\nprint(result == task)`, explain: "text — звичайний рядок; саме такий рядок реально передається мережею між клієнтом і сервером." },
    ],
    task: `Дано task = {"id": 1, "name": "Купити хліб"}. Перетвори його на текст через json.dumps(task), виведи text. Розбери text назад через json.loads() у result, виведи result == task.`,
    starter: `import json\n\ntask = {"id": 1, "name": "Купити хліб"}\n\n# text = json.dumps(task)\n# print(text)\n# result = json.loads(text)\n# print(result == task)\n`,
    hints: [`text = json.dumps(task) — Python → JSON-текст.`, `result = json.loads(text) — JSON-текст → Python назад.`, `text = json.dumps(task)\nprint(text)\nresult = json.loads(text)\nprint(result == task)`],
    solution: `import json\n\ntask = {"id": 1, "name": "Купити хліб"}\n\ntext = json.dumps(task)\nprint(text)\nresult = json.loads(text)\nprint(result == task)`,
    testCode: `if "text" not in globals() or not isinstance(text, str):\n    __result__ = {"pass": False, "message": "text має бути рядком — результатом json.dumps()."}\nelif "result" not in globals() or result != task:\n    __result__ = {"pass": False, "message": "result (після json.loads) має дорівнювати оригінальному task."}\nelif not any(l.strip() == "True" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи result == task — має бути True."}\nelse:\n    __result__ = {"pass": True, "message": "dumps/loads — той міст, через який дані переходять з Python-словника в текст мережею і назад."}`,
  },
  {
    id: "py-api-3",
    title: "Клас Response",
    type: "python",
    theory:
      "Оформимо відповідь API як клас — так само, як Task чи Snake раніше: атрибути status (код) і body (дані), і метод to_json(), що серіалізує body в JSON-текст:\n\nimport json\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\n    def to_json(self):\n        return json.dumps(self.body, ensure_ascii=False)\n\nresponse = Response(200, {\"name\": \"Купити хліб\"})\nprint(response.status)\nprint(response.to_json())",
    examples: [
      { title: "Клас Response", code: `import json\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n    def to_json(self):\n        return json.dumps(self.body, ensure_ascii=False)\n\nresponse = Response(200, {"name": "Купити хліб"})\nprint(response.status)\nprint(response.to_json())`, explain: "response.status — число; response.to_json() — готовий JSON-текст для відправки." },
    ],
    task: `Оголоси клас Response(self, status, body) з методом to_json(self), що повертає json.dumps(self.body, ensure_ascii=False). Створи response = Response(200, {"name": "Купити хліб"}) і виведи response.status та response.to_json().`,
    starter: `import json\n\nclass Response:\n    def __init__(self, status, body):\n        # твій код тут\n        pass\n\n    def to_json(self):\n        # твій код тут\n        pass\n\nresponse = Response(200, {"name": "Купити хліб"})\nprint(response.status)\nprint(response.to_json())\n`,
    hints: [`self.status = status; self.body = body`, `to_json повертає json.dumps(self.body, ensure_ascii=False)`, `def __init__(self, status, body):\n    self.status = status\n    self.body = body\n\ndef to_json(self):\n    return json.dumps(self.body, ensure_ascii=False)`],
    solution: `import json\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\n    def to_json(self):\n        return json.dumps(self.body, ensure_ascii=False)\n\nresponse = Response(200, {"name": "Купити хліб"})\nprint(response.status)\nprint(response.to_json())`,
    testCode: `if "Response" not in globals() or not isinstance(Response, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Response."}\nelse:\n    probe = Response(404, {"error": "тест"})\n    if probe.status != 404 or probe.body != {"error": "тест"}:\n        __result__ = {"pass": False, "message": "Response(404, {...}).status і .body мають зберігати передані значення."}\n    elif "тест" not in probe.to_json():\n        __result__ = {"pass": False, "message": "to_json() має повернути JSON-рядок із вмістом body."}\n    elif not any(l.strip() == "200" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи response.status — має бути 200."}\n    else:\n        __result__ = {"pass": True, "message": "Response — та сама структура, яку повертає будь-який реальний обробник у Flask чи FastAPI."}`,
  },
  {
    id: "py-api-4",
    title: "Клас Request",
    type: "python",
    theory:
      "Дзеркально до Response, вхідний запит опишемо класом Request: method (\"GET\", \"POST\"...), path (\"/tasks\"), і додатково params (параметри шляху, поки порожній словник) та body (дані запиту, за замовчуванням None):\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\nparams or {} — типовий трюк: якщо params не передали (None), використати порожній словник замість None — щоб пізніше можна було спокійно писати request.params.get(\"id\") без перевірки на None.",
    examples: [
      { title: "Клас Request", code: `class Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\nreq = Request("GET", "/tasks")\nprint(req.method, req.path)\nprint(req.params)`, explain: "req.params — порожній словник {}, а не None, навіть якщо params не передавали при створенні." },
    ],
    task: `Оголоси клас Request(self, method, path, params=None, body=None), що зберігає всі чотири значення (params або {}, якщо не передано). Створи req = Request("GET", "/tasks") і виведи req.method, req.path, req.params.`,
    starter: `class Request:\n    def __init__(self, method, path, params=None, body=None):\n        # твій код тут\n        pass\n\nreq = Request("GET", "/tasks")\nprint(req.method)\nprint(req.path)\nprint(req.params)\n`,
    hints: [`self.method = method; self.path = path`, `self.params = params or {}; self.body = body`, `self.method = method\nself.path = path\nself.params = params or {}\nself.body = body`],
    solution: `class Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\nreq = Request("GET", "/tasks")\nprint(req.method)\nprint(req.path)\nprint(req.params)`,
    testCode: `if "Request" not in globals() or not isinstance(Request, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Request."}\nelse:\n    probe = Request("GET", "/tasks")\n    if probe.method != "GET" or probe.path != "/tasks" or probe.params != {}:\n        __result__ = {"pass": False, "message": "Request(\\"GET\\", \\"/tasks\\") без params має мати params == {}."}\n    elif not any("/tasks" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи req.path через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Request і Response — дві сторони одного обміну: що прийшло і що піде у відповідь."}`,
  },
  {
    id: "py-api-5",
    title: "Обробник запиту (handler)",
    type: "python",
    theory:
      "Обробник (handler) — звичайна функція, що приймає Request і повертає Response — саме те, що в реальному Flask написав би розробник для кожного маршруту:\n\ndef get_tasks(request):\n    tasks = [{\"id\": 1, \"name\": \"Купити хліб\"}]\n    return Response(200, tasks)\n\nresponse = get_tasks(Request(\"GET\", \"/tasks\"))\nprint(response.status)\nprint(response.to_json())\n\nОбробник не знає нічого про мережу чи маршрутизацію — лише «отримав запит, повернув відповідь», так само, як звичайна функція.",
    examples: [
      { title: "Обробник get_tasks", code: `def get_tasks(request):\n    tasks = [{"id": 1, "name": "Купити хліб"}]\n    return Response(200, tasks)\n\nresponse = get_tasks(Request("GET", "/tasks"))\nprint(response.status)\nprint(response.to_json())`, explain: "Обробник — просто функція request → response, без жодних деталей про те, ЯК запит потрапив сюди." },
    ],
    task: `Напиши get_tasks(request), що повертає Response(200, tasks) зі списком tasks = [{"id": 1, "name": "Купити хліб"}]. Виклич get_tasks(Request("GET", "/tasks")) і виведи response.status та response.to_json().`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n    def to_json(self):\n        import json\n        return json.dumps(self.body, ensure_ascii=False)\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef get_tasks(request):\n    # твій код тут\n    pass\n\nresponse = get_tasks(Request("GET", "/tasks"))\nprint(response.status)\nprint(response.to_json())\n`,
    hints: [`tasks = [{"id": 1, "name": "Купити хліб"}]`, `return Response(200, tasks)`, `def get_tasks(request):\n    tasks = [{"id": 1, "name": "Купити хліб"}]\n    return Response(200, tasks)`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n    def to_json(self):\n        import json\n        return json.dumps(self.body, ensure_ascii=False)\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef get_tasks(request):\n    tasks = [{"id": 1, "name": "Купити хліб"}]\n    return Response(200, tasks)\n\nresponse = get_tasks(Request("GET", "/tasks"))\nprint(response.status)\nprint(response.to_json())`,
    testCode: `if "get_tasks" not in globals() or not callable(get_tasks):\n    __result__ = {"pass": False, "message": "Потрібна функція get_tasks(request)."}\nelse:\n    r = get_tasks(Request("GET", "/tasks"))\n    if r.status != 200 or not isinstance(r.body, list):\n        __result__ = {"pass": False, "message": "get_tasks() має повернути Response(200, [...]) зі списком задач."}\n    elif not any(l.strip() == "200" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи response.status — має бути 200."}\n    else:\n        __result__ = {"pass": True, "message": "Обробник — це і є код, який пише розробник API; усе інше (маршрутизація) станеться автоматично в наступних уроках."}`,
  },
  {
    id: "py-api-6",
    title: "Таблиця маршрутів",
    type: "python",
    theory:
      "Замість того щоб викликати get_tasks() напряму, реальний сервер має ЗНАЙТИ потрібний обробник за методом і шляхом запиту. Заведемо словник routes, де ключ — кортеж (метод, шлях), а значення — сама функція-обробник:\n\nroutes = {\n    (\"GET\", \"/tasks\"): get_tasks,\n}\n\nhandler = routes[(\"GET\", \"/tasks\")]\nresponse = handler(Request(\"GET\", \"/tasks\"))\n\nЦе той самий принцип, що callback-функції в Python Desktop — тільки функцію дістають не напряму з коду, а з таблиці за ключем.",
    examples: [
      { title: "Пошук обробника за ключем", code: `routes = {("GET", "/tasks"): get_tasks}\n\nmethod, path = "GET", "/tasks"\nhandler = routes[(method, path)]\nresponse = handler(Request(method, path))\nprint(response.status)`, explain: "routes[(method, path)] дістає ПОТРІБНУ функцію без жодного if/elif на кожен маршрут." },
    ],
    task: `Дано routes = {("GET", "/tasks"): get_tasks}. Дістань handler = routes[("GET", "/tasks")], виклич handler(Request("GET", "/tasks")) і виведи response.status.`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef get_tasks(request):\n    return Response(200, [{"id": 1, "name": "Купити хліб"}])\n\nroutes = {("GET", "/tasks"): get_tasks}\n\n# handler = routes[("GET", "/tasks")]\n# response = handler(Request("GET", "/tasks"))\n# print(response.status)\n`,
    hints: [`routes[("GET", "/tasks")] — ключ це саме КОРТЕЖ (метод, шлях).`, `handler(Request(...)) — виклик знайденої функції.`, `handler = routes[("GET", "/tasks")]\nresponse = handler(Request("GET", "/tasks"))\nprint(response.status)`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef get_tasks(request):\n    return Response(200, [{"id": 1, "name": "Купити хліб"}])\n\nroutes = {("GET", "/tasks"): get_tasks}\n\nhandler = routes[("GET", "/tasks")]\nresponse = handler(Request("GET", "/tasks"))\nprint(response.status)`,
    testCode: `if not any(l.strip() == "200" for l in __logs):\n    __result__ = {"pass": False, "message": "response.status має бути 200 — обробник знайдено й викликано правильно."}\nelse:\n    __result__ = {"pass": True, "message": "routes[(method, path)] — таблиця, за якою сервер миттєво знаходить потрібний обробник серед сотень маршрутів."}`,
  },
  {
    id: "py-api-7",
    title: "Клас App: реєстрація маршрутів",
    type: "python",
    theory:
      "Оформимо все в клас App — так само, як Organizer чи Game раніше: він тримає routes у собі й надає метод add_route(method, path, handler), щоб не збирати словник вручну:\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n\napp = App()\napp.add_route(\"GET\", \"/tasks\", get_tasks)\nprint(app.routes)",
    examples: [
      { title: "App реєструє маршрути", code: `class App:\n    def __init__(self):\n        self.routes = {}\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n\napp = App()\napp.add_route("GET", "/tasks", get_tasks)\nprint(len(app.routes))`, explain: "app.add_route() ховає деталь, що routes — це словник із кортежним ключем." },
    ],
    task: `Оголоси клас App(self) з self.routes = {} і методом add_route(self, method, path, handler), що записує self.routes[(method, path)] = handler. Створи app = App(), зареєструй app.add_route("GET", "/tasks", get_tasks) і виведи len(app.routes).`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ndef get_tasks(request):\n    return Response(200, [])\n\nclass App:\n    def __init__(self):\n        # твій код тут\n        pass\n\n    def add_route(self, method, path, handler):\n        # твій код тут\n        pass\n\napp = App()\napp.add_route("GET", "/tasks", get_tasks)\nprint(len(app.routes))\n`,
    hints: [`self.routes = {} в __init__.`, `self.routes[(method, path)] = handler в add_route.`, `def __init__(self):\n    self.routes = {}\n\ndef add_route(self, method, path, handler):\n    self.routes[(method, path)] = handler`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ndef get_tasks(request):\n    return Response(200, [])\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n\napp = App()\napp.add_route("GET", "/tasks", get_tasks)\nprint(len(app.routes))`,
    testCode: `if "App" not in globals() or not isinstance(App, type):\n    __result__ = {"pass": False, "message": "Потрібен клас App."}\nelse:\n    probe = App()\n    probe.add_route("GET", "/x", get_tasks)\n    if probe.routes.get(("GET", "/x")) is not get_tasks:\n        __result__ = {"pass": False, "message": "add_route(\\"GET\\", \\"/x\\", handler) має зберегти handler за ключем (\\"GET\\", \\"/x\\")."}\n    elif not any(l.strip() == "1" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи len(app.routes) — має бути 1."}\n    else:\n        __result__ = {"pass": True, "message": "App.add_route() — те, що в реальному Flask ховається за декоратором @app.route(...)."}`,
  },
  {
    id: "py-api-8",
    title: "Диспетчеризація й 404 Not Found",
    type: "python",
    theory:
      "Додамо App метод handle_request(method, path), що шукає обробник у self.routes і викликає його — а якщо маршруту немає, повертає Response(404, ...), а не аварійно завершується помилкою KeyError:\n\ndef handle_request(self, method, path):\n    handler = self.routes.get((method, path))\n    if handler is None:\n        return Response(404, {\"error\": \"Маршрут не знайдено\"})\n    return handler(Request(method, path))\n\n.get(...) замість [...] — знайомий трюк із Python Core: повертає None замість помилки, якщо ключа немає.",
    examples: [
      { title: "handle_request з обробкою 404", code: `app = App()\napp.add_route("GET", "/tasks", get_tasks)\n\nresponse = app.handle_request("GET", "/unknown")\nprint(response.status)\nprint(response.body)`, explain: "Неіснуючий маршрут дає 404 з поясненням, а не помилку KeyError, що зупинила б увесь сервер." },
    ],
    task: `Додай App метод handle_request(self, method, path): знайди handler через self.routes.get(...), якщо None — поверни Response(404, {"error": "Маршрут не знайдено"}), інакше виклич handler(Request(method, path)). Виклич app.handle_request("GET", "/unknown") і виведи response.status та response.body.`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef get_tasks(request):\n    return Response(200, [])\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n\n    def handle_request(self, method, path):\n        # твій код тут\n        pass\n\napp = App()\napp.add_route("GET", "/tasks", get_tasks)\n\nresponse = app.handle_request("GET", "/unknown")\nprint(response.status)\nprint(response.body)\n`,
    hints: [`handler = self.routes.get((method, path))`, `if handler is None: return Response(404, {"error": "Маршрут не знайдено"})`, `def handle_request(self, method, path):\n    handler = self.routes.get((method, path))\n    if handler is None:\n        return Response(404, {"error": "Маршрут не знайдено"})\n    return handler(Request(method, path))`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef get_tasks(request):\n    return Response(200, [])\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n\n    def handle_request(self, method, path):\n        handler = self.routes.get((method, path))\n        if handler is None:\n            return Response(404, {"error": "Маршрут не знайдено"})\n        return handler(Request(method, path))\n\napp = App()\napp.add_route("GET", "/tasks", get_tasks)\n\nresponse = app.handle_request("GET", "/unknown")\nprint(response.status)\nprint(response.body)`,
    testCode: `if "App" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас App із методом handle_request."}\nelse:\n    probe = App()\n    probe.add_route("GET", "/tasks", get_tasks)\n    ok = probe.handle_request("GET", "/tasks")\n    missing = probe.handle_request("GET", "/unknown")\n    if ok.status != 200:\n        __result__ = {"pass": False, "message": "handle_request(\\"GET\\", \\"/tasks\\") має повернути статус 200."}\n    elif missing.status != 404:\n        __result__ = {"pass": False, "message": "handle_request на неіснуючому шляху має повернути статус 404."}\n    elif not any(l.strip() == "404" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи response.status для /unknown — має бути 404."}\n    else:\n        __result__ = {"pass": True, "message": "handle_request() — серце будь-якого веб-фреймворка: знайти обробник або ввічливо повідомити, що його немає."}`,
  },
  {
    id: "py-api-9",
    title: "Динамічні параметри шляху",
    type: "python",
    theory:
      "Шлях /tasks/5 не можна зареєструвати як точний рядок — 5 щоразу різне. Реальні API описують такий маршрут як /tasks/<id>, де <id> — ЗМІННА частина. Напишемо функцію match_route(pattern, path), що звіряє шаблон із реальним шляхом і повертає словник знайдених параметрів (або None, якщо не збігається):\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split(\"/\")\n    path_parts = path.split(\"/\")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith(\"<\") and p.endswith(\">\"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nzip(pattern_parts, path_parts) проходить по ОБОХ списках одночасно, парами — той самий принцип, що enumerate() у Python Core, тільки для двох списків замість одного.",
    examples: [
      { title: "match_route розбирає параметри", code: `def match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nprint(match_route("/tasks/<id>", "/tasks/5"))\nprint(match_route("/tasks/<id>", "/other/5"))`, explain: "Перший виклик знаходить {'id': '5'}; другий — None, бо «tasks» не збігається з «other»." },
    ],
    task: `Напиши match_route(pattern, path) за прикладом. Виведи match_route("/tasks/<id>", "/tasks/5") (має бути {"id": "5"}) і match_route("/tasks/<id>", "/other/5") (має бути None).`,
    starter: `def match_route(pattern, path):\n    # твій код тут\n    pass\n\nprint(match_route("/tasks/<id>", "/tasks/5"))\nprint(match_route("/tasks/<id>", "/other/5"))\n`,
    hints: [`pattern_parts = pattern.split("/"); path_parts = path.split("/")`, `for p, a in zip(pattern_parts, path_parts): if p.startswith("<") ... elif p != a: return None`, `def match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params`],
    solution: `def match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nprint(match_route("/tasks/<id>", "/tasks/5"))\nprint(match_route("/tasks/<id>", "/other/5"))`,
    testCode: `if "match_route" not in globals() or not callable(match_route):\n    __result__ = {"pass": False, "message": "Потрібна функція match_route(pattern, path)."}\nelif match_route("/tasks/<id>", "/tasks/5") != {"id": "5"}:\n    __result__ = {"pass": False, "message": "match_route(\\"/tasks/<id>\\", \\"/tasks/5\\") має повернути {\\"id\\": \\"5\\"}."}\nelif match_route("/tasks/<id>", "/other/5") is not None:\n    __result__ = {"pass": False, "message": "match_route(\\"/tasks/<id>\\", \\"/other/5\\") має повернути None — шляхи не збігаються."}\nelif not any("'id': '5'" in l or '"id": "5"' in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи результат обох викликів match_route()."}\nelse:\n    __result__ = {"pass": True, "message": "match_route() — спрощена версія того, що робить Flask/FastAPI, коли ти пишеш @app.route(\\"/tasks/<id>\\")."}`,
  },
  {
    id: "py-api-10",
    title: "Диспетчеризація з параметрами шляху",
    type: "python",
    theory:
      "Онови handle_request, щоб він перебирав ВСІ зареєстровані маршрути й перевіряв кожен через match_route(), а не шукав ТОЧНИЙ збіг словника:\n\ndef handle_request(self, method, path):\n    for (r_method, pattern), handler in self.routes.items():\n        if r_method != method:\n            continue\n        params = match_route(pattern, path)\n        if params is not None:\n            return handler(Request(method, path, params))\n    return Response(404, {\"error\": \"Маршрут не знайдено\"})\n\nТепер маршрут /tasks/<id> реально «зловить» запит на /tasks/5, /tasks/42 — будь-яке число (чи навіть текст) замість <id>.",
    examples: [
      { title: "handle_request із динамічними маршрутами", code: `def get_task(request):\n    return Response(200, {"id": request.params["id"]})\n\napp = App()\napp.add_route("GET", "/tasks/<id>", get_task)\n\nresponse = app.handle_request("GET", "/tasks/5")\nprint(response.body)`, explain: "request.params[\"id\"] містить «5» — значення, витягнуте з реального шляху запиту." },
    ],
    task: `Онови App.handle_request(self, method, path): пройди по self.routes.items(), для кожного (r_method, pattern) із method==r_method перевір match_route(pattern, path); якщо params не None — виклич handler(Request(method, path, params)). Якщо нічого не знайдено — Response(404, ...). Зареєструй "/tasks/<id>" на get_task, виклич app.handle_request("GET", "/tasks/5") і виведи response.body.`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\ndef get_task(request):\n    return Response(200, {"id": request.params["id"]})\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n\n    def handle_request(self, method, path):\n        # твій код тут\n        pass\n\napp = App()\napp.add_route("GET", "/tasks/<id>", get_task)\n\nresponse = app.handle_request("GET", "/tasks/5")\nprint(response.body)\n`,
    hints: [`for (r_method, pattern), handler in self.routes.items(): if r_method != method: continue`, `params = match_route(pattern, path); if params is not None: return handler(Request(method, path, params))`, `def handle_request(self, method, path):\n    for (r_method, pattern), handler in self.routes.items():\n        if r_method != method:\n            continue\n        params = match_route(pattern, path)\n        if params is not None:\n            return handler(Request(method, path, params))\n    return Response(404, {"error": "Маршрут не знайдено"})`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\ndef get_task(request):\n    return Response(200, {"id": request.params["id"]})\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n\n    def handle_request(self, method, path):\n        for (r_method, pattern), handler in self.routes.items():\n            if r_method != method:\n                continue\n            params = match_route(pattern, path)\n            if params is not None:\n                return handler(Request(method, path, params))\n        return Response(404, {"error": "Маршрут не знайдено"})\n\napp = App()\napp.add_route("GET", "/tasks/<id>", get_task)\n\nresponse = app.handle_request("GET", "/tasks/5")\nprint(response.body)`,
    testCode: `if "app" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен об'єкт app із робочим handle_request."}\nelse:\n    r = app.handle_request("GET", "/tasks/5")\n    if r.status != 200 or r.body.get("id") != "5":\n        __result__ = {"pass": False, "message": "handle_request(\\"GET\\", \\"/tasks/5\\") має знайти маршрут /tasks/<id> і передати id=\\"5\\"."}\n    elif not any("5" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи response.body через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Тепер один зареєстрований маршрут /tasks/<id> обслуговує БУДЬ-який id — 5, 42, 100 — без окремого запису для кожного."}`,
  },
  {
    id: "py-api-11",
    title: "GET /tasks: список задач",
    type: "python",
    theory:
      "Заведемо «базу даних» просто як список словників у пам'яті (як у фіналі Python Core) — tasks_db. Обробник get_tasks(request) повертає ввесь список:\n\ntasks_db = [\n    {\"id\": 1, \"name\": \"Купити хліб\", \"done\": False},\n    {\"id\": 2, \"name\": \"Погуляти\", \"done\": True},\n]\n\ndef get_tasks(request):\n    return Response(200, tasks_db)\n\nЦе найпростіший можливий CRUD-обробник: жодної фільтрації чи параметрів, просто «поверни все, що є».",
    examples: [
      { title: "GET /tasks повертає весь список", code: `tasks_db = [{"id": 1, "name": "Купити хліб", "done": False}]\n\ndef get_tasks(request):\n    return Response(200, tasks_db)\n\napp = App()\napp.add_route("GET", "/tasks", get_tasks)\n\nresponse = app.handle_request("GET", "/tasks")\nprint(response.status)\nprint(len(response.body))`, explain: "response.body — це ТОЙ САМИЙ список tasks_db, переданий як дані відповіді." },
    ],
    task: `Дано tasks_db = [{"id": 1, "name": "Купити хліб", "done": False}, {"id": 2, "name": "Погуляти", "done": True}]. Напиши get_tasks(request), що повертає Response(200, tasks_db). Зареєструй маршрут GET /tasks, виклич app.handle_request("GET", "/tasks") і виведи len(response.body).`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n    def handle_request(self, method, path):\n        for (r_method, pattern), handler in self.routes.items():\n            if r_method != method:\n                continue\n            params = match_route(pattern, path)\n            if params is not None:\n                return handler(Request(method, path, params))\n        return Response(404, {"error": "Маршрут не знайдено"})\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef get_tasks(request):\n    # твій код тут\n    pass\n\napp = App()\napp.add_route("GET", "/tasks", get_tasks)\n\nresponse = app.handle_request("GET", "/tasks")\nprint(len(response.body))\n`,
    hints: [`return Response(200, tasks_db)`, `Обробник не потребує параметрів — повертає ввесь список одразу.`, `def get_tasks(request):\n    return Response(200, tasks_db)`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n    def handle_request(self, method, path):\n        for (r_method, pattern), handler in self.routes.items():\n            if r_method != method:\n                continue\n            params = match_route(pattern, path)\n            if params is not None:\n                return handler(Request(method, path, params))\n        return Response(404, {"error": "Маршрут не знайдено"})\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef get_tasks(request):\n    return Response(200, tasks_db)\n\napp = App()\napp.add_route("GET", "/tasks", get_tasks)\n\nresponse = app.handle_request("GET", "/tasks")\nprint(len(response.body))`,
    testCode: `if "app" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен робочий об'єкт app."}\nelse:\n    r = app.handle_request("GET", "/tasks")\n    if r.status != 200 or len(r.body) != 2:\n        __result__ = {"pass": False, "message": "GET /tasks має повернути статус 200 і список з 2 задач."}\n    elif not any(l.strip() == "2" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи len(response.body) — має бути 2."}\n    else:\n        __result__ = {"pass": True, "message": "GET /tasks — перший справжній маршрут майбутнього Task API."}`,
  },
  {
    id: "py-api-12",
    title: "GET /tasks/<id>: одна задача",
    type: "python",
    theory:
      "get_task(request) читає id з request.params (з 10-го уроку) і шукає відповідну задачу в tasks_db. Оскільки id у шляху завжди РЯДОК (\"5\"), а в базі id — ЧИСЛО (5), потрібне явне перетворення int():\n\ndef get_task(request):\n    task_id = int(request.params[\"id\"])\n    task = next((t for t in tasks_db if t[\"id\"] == task_id), None)\n    if task is None:\n        return Response(404, {\"error\": \"Задачу не знайдено\"})\n    return Response(200, task)\n\nnext(генератор, значення_за_замовчуванням) — компактний спосіб знайти ПЕРШИЙ елемент, що задовольняє умову, або None, якщо такого немає — без явного циклу for з break.",
    examples: [
      { title: "get_task шукає за id", code: `def get_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Задачу не знайдено"})\n    return Response(200, task)\n\napp.add_route("GET", "/tasks/<id>", get_task)\nresponse = app.handle_request("GET", "/tasks/2")\nprint(response.body)`, explain: "int(request.params['id']) обов'язковий — інакше '2' (рядок) ніколи не дорівнюватиме 2 (число) у порівнянні." },
    ],
    task: `Напиши get_task(request): task_id = int(request.params["id"]), знайди task через next(), поверни Response(404, ...) якщо не знайдено, інакше Response(200, task). Зареєструй маршрут і виклич app.handle_request("GET", "/tasks/2"), виведи response.body.`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n    def handle_request(self, method, path):\n        for (r_method, pattern), handler in self.routes.items():\n            if r_method != method:\n                continue\n            params = match_route(pattern, path)\n            if params is not None:\n                return handler(Request(method, path, params))\n        return Response(404, {"error": "Маршрут не знайдено"})\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef get_task(request):\n    # твій код тут\n    pass\n\napp = App()\napp.add_route("GET", "/tasks/<id>", get_task)\n\nresponse = app.handle_request("GET", "/tasks/2")\nprint(response.body)\n`,
    hints: [`task_id = int(request.params["id"])`, `task = next((t for t in tasks_db if t["id"] == task_id), None)`, `def get_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Задачу не знайдено"})\n    return Response(200, task)`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n    def handle_request(self, method, path):\n        for (r_method, pattern), handler in self.routes.items():\n            if r_method != method:\n                continue\n            params = match_route(pattern, path)\n            if params is not None:\n                return handler(Request(method, path, params))\n        return Response(404, {"error": "Маршрут не знайдено"})\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef get_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Задачу не знайдено"})\n    return Response(200, task)\n\napp = App()\napp.add_route("GET", "/tasks/<id>", get_task)\n\nresponse = app.handle_request("GET", "/tasks/2")\nprint(response.body)`,
    testCode: `if "app" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен робочий об'єкт app."}\nelse:\n    ok = app.handle_request("GET", "/tasks/2")\n    missing = app.handle_request("GET", "/tasks/99")\n    if ok.status != 200 or ok.body.get("name") != "Погуляти":\n        __result__ = {"pass": False, "message": "GET /tasks/2 має повернути задачу «Погуляти»."}\n    elif missing.status != 404:\n        __result__ = {"pass": False, "message": "GET /tasks/99 (неіснуючий id) має повернути статус 404."}\n    elif not any("Погуляти" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи response.body для /tasks/2."}\n    else:\n        __result__ = {"pass": True, "message": "GET /tasks/<id> — другий базовий маршрут, з правильною обробкою і знайденого, і відсутнього id."}`,
  },
  {
    id: "py-api-13",
    title: "POST /tasks: створення задачі",
    type: "python",
    theory:
      "POST-запит зазвичай несе ДАНІ в тілі запиту (request.body) — те, що клієнт хоче створити. create_task(request) читає ім'я нової задачі з request.body, генерує новий id (максимальний наявний + 1) і додає в tasks_db:\n\ndef create_task(request):\n    new_id = max(t[\"id\"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {\"id\": new_id, \"name\": request.body[\"name\"], \"done\": False}\n    tasks_db.append(task)\n    return Response(201, task)\n\nСтатус 201 (Created) — стандартний код для «щось успішно СТВОРЕНО», на відміну від 200 (просто «успішно»).",
    examples: [
      { title: "create_task додає нову задачу", code: `def create_task(request):\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)\n\napp.add_route("POST", "/tasks", create_task)\nreq = Request("POST", "/tasks", body={"name": "Прочитати книгу"})\nresponse = app.handle_request("POST", "/tasks")\nprint(response.status)`, explain: "Новий id обчислюється автоматично — клієнту не треба (і не можна) вказувати його самому." },
    ],
    task: `Напиши create_task(request), що додає нову задачу з request.body["name"] у tasks_db з новим id (max+1 або 1, якщо база порожня) і done=False, повертає Response(201, task). Зареєструй POST /tasks. Створи req = Request("POST", "/tasks", body={"name": "Прочитати книгу"}), виклич create_task(req) напряму і виведи response.status та len(tasks_db).`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef create_task(request):\n    # твій код тут\n    pass\n\nreq = Request("POST", "/tasks", body={"name": "Прочитати книгу"})\nresponse = create_task(req)\nprint(response.status)\nprint(len(tasks_db))\n`,
    hints: [`new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1`, `task = {"id": new_id, "name": request.body["name"], "done": False}; tasks_db.append(task); return Response(201, task)`, `def create_task(request):\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef create_task(request):\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)\n\nreq = Request("POST", "/tasks", body={"name": "Прочитати книгу"})\nresponse = create_task(req)\nprint(response.status)\nprint(len(tasks_db))`,
    testCode: `if "tasks_db" not in globals() or len(tasks_db) != 3:\n    __result__ = {"pass": False, "message": "tasks_db має містити 3 задачі після create_task."}\nelif tasks_db[-1]["id"] != 3 or tasks_db[-1]["name"] != "Прочитати книгу":\n    __result__ = {"pass": False, "message": "Нова задача має мати id=3 і name=\\"Прочитати книгу\\"."}\nelif not any(l.strip() == "201" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи response.status — має бути 201 (Created)."}\nelse:\n    __result__ = {"pass": True, "message": "POST /tasks — третій базовий маршрут: тепер API вміє не лише читати, а й створювати дані."}`,
  },
  {
    id: "py-api-14",
    title: "PUT /tasks/<id>: оновлення задачі",
    type: "python",
    theory:
      "update_task(request) поєднує 12-й урок (пошук за id) і 13-й (дані з request.body): знаходить задачу, і якщо вона є — оновлює її поля значеннями з тіла запиту:\n\ndef update_task(request):\n    task_id = int(request.params[\"id\"])\n    task = next((t for t in tasks_db if t[\"id\"] == task_id), None)\n    if task is None:\n        return Response(404, {\"error\": \"Задачу не знайдено\"})\n    task[\"name\"] = request.body.get(\"name\", task[\"name\"])\n    task[\"done\"] = request.body.get(\"done\", task[\"done\"])\n    return Response(200, task)\n\nrequest.body.get(\"name\", task[\"name\"]) — якщо в тілі запиту немає поля name, лишає СТАРЕ значення замість помилки — часткове оновлення (не обов'язково передавати ВСІ поля).",
    examples: [
      { title: "update_task оновлює наявну задачу", code: `def update_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Задачу не знайдено"})\n    task["name"] = request.body.get("name", task["name"])\n    task["done"] = request.body.get("done", task["done"])\n    return Response(200, task)\n\nreq = Request("PUT", "/tasks/1", params={"id": "1"}, body={"done": True})\nresponse = update_task(req)\nprint(response.body)`, explain: "Передано лише done — name лишається тим самим, що й був, завдяки .get() зі значенням за замовчуванням." },
    ],
    task: `Напиши update_task(request) за прикладом: знайди задачу за id, онови name/done лише переданими полями (.get(..., старе значення)), поверни 404 якщо не знайдено. Виклич update_task з params={"id": "1"} і body={"done": True}, виведи response.body.`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef update_task(request):\n    # твій код тут\n    pass\n\nreq = Request("PUT", "/tasks/1", params={"id": "1"}, body={"done": True})\nresponse = update_task(req)\nprint(response.body)\n`,
    hints: [`task_id = int(request.params["id"]); знайди через next() як у 12-му уроці.`, `task["name"] = request.body.get("name", task["name"]); task["done"] = request.body.get("done", task["done"])`, `def update_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Задачу не знайдено"})\n    task["name"] = request.body.get("name", task["name"])\n    task["done"] = request.body.get("done", task["done"])\n    return Response(200, task)`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef update_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Задачу не знайдено"})\n    task["name"] = request.body.get("name", task["name"])\n    task["done"] = request.body.get("done", task["done"])\n    return Response(200, task)\n\nreq = Request("PUT", "/tasks/1", params={"id": "1"}, body={"done": True})\nresponse = update_task(req)\nprint(response.body)`,
    testCode: `if "tasks_db" not in globals() or tasks_db[0]["done"] is not True or tasks_db[0]["name"] != "Купити хліб":\n    __result__ = {"pass": False, "message": "Задача з id=1 має мати done=True (оновлено) і name=\\"Купити хліб\\" (без змін)."}\nelif not any(l.strip() == "404" for l in __logs) is False and not any("Купити хліб" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи response.body — має містити «Купити хліб»."}\nelse:\n    __result__ = {"pass": True, "message": "PUT /tasks/<id> — часткове оновлення: змінюється лише те поле, яке передали, решта лишається."}`,
  },
  {
    id: "py-api-15",
    title: "DELETE /tasks/<id>: видалення задачі",
    type: "python",
    theory:
      "delete_task(request) знаходить задачу за id (як і раніше) і, якщо знайдена, видаляє її зі списку через .remove(). Успішне видалення зазвичай повертає статус 204 (No Content) — «усе добре, але повертати нема чого»:\n\ndef delete_task(request):\n    task_id = int(request.params[\"id\"])\n    task = next((t for t in tasks_db if t[\"id\"] == task_id), None)\n    if task is None:\n        return Response(404, {\"error\": \"Задачу не знайдено\"})\n    tasks_db.remove(task)\n    return Response(204, None)\n\nlist.remove(елемент) видаляє ПЕРШИЙ елемент списку, що дорівнює переданому значенню — тут task уже посилається на конкретний словник у tasks_db, тож remove() однозначно прибирає саме його.",
    examples: [
      { title: "delete_task видаляє задачу", code: `def delete_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Задачу не знайдено"})\n    tasks_db.remove(task)\n    return Response(204, None)\n\nreq = Request("DELETE", "/tasks/1", params={"id": "1"})\nresponse = delete_task(req)\nprint(response.status)\nprint(len(tasks_db))`, explain: "Після видалення довжина tasks_db зменшується на 1, а response.body — None (204 не повертає даних)." },
    ],
    task: `Напиши delete_task(request) за прикладом: знайди задачу, видали через .remove(), поверни Response(204, None), або 404 якщо не знайдено. Виклич delete_task з params={"id": "1"}, виведи response.status і len(tasks_db).`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef delete_task(request):\n    # твій код тут\n    pass\n\nreq = Request("DELETE", "/tasks/1", params={"id": "1"})\nresponse = delete_task(req)\nprint(response.status)\nprint(len(tasks_db))\n`,
    hints: [`task_id = int(request.params["id"]); знайди через next()`, `tasks_db.remove(task), потім return Response(204, None)`, `def delete_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Задачу не знайдено"})\n    tasks_db.remove(task)\n    return Response(204, None)`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef delete_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Задачу не знайдено"})\n    tasks_db.remove(task)\n    return Response(204, None)\n\nreq = Request("DELETE", "/tasks/1", params={"id": "1"})\nresponse = delete_task(req)\nprint(response.status)\nprint(len(tasks_db))`,
    testCode: `if "tasks_db" not in globals() or len(tasks_db) != 1:\n    __result__ = {"pass": False, "message": "tasks_db має містити рівно 1 задачу після видалення."}\nelif tasks_db[0]["id"] != 2:\n    __result__ = {"pass": False, "message": "Задача з id=2 має лишитись, а id=1 — зникнути."}\nelif not any(l.strip() == "204" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи response.status — має бути 204."}\nelse:\n    __result__ = {"pass": True, "message": "DELETE /tasks/<id> — останній базовий CRUD-маршрут: тепер API вміє читати, створювати, оновлювати й видаляти."}`,
  },
  {
    id: "py-api-16",
    title: "Валідація: 400 Bad Request",
    type: "python",
    theory:
      "Що, якщо клієнт надішле POST без поля name? request.body[\"name\"] викличе KeyError. Замість аварійного завершення, перевіримо дані ЗАЗДАЛЕГІДЬ і повернемо статус 400 (Bad Request) — «твій запит некоректний, а не наша помилка»:\n\ndef create_task(request):\n    if \"name\" not in request.body or not request.body[\"name\"].strip():\n        return Response(400, {\"error\": \"Поле name обов'язкове\"})\n    new_id = max(t[\"id\"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {\"id\": new_id, \"name\": request.body[\"name\"], \"done\": False}\n    tasks_db.append(task)\n    return Response(201, task)\n\n400 і 404 — обидва «помилки клієнта» (4xx), але означають різне: 404 — «такого не існує», 400 — «твій запит сам по собі неправильний».",
    examples: [
      { title: "create_task із валідацією", code: `def create_task(request):\n    if "name" not in request.body or not request.body["name"].strip():\n        return Response(400, {"error": "Поле name обов'язкове"})\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)\n\nreq = Request("POST", "/tasks", body={})\nresponse = create_task(req)\nprint(response.status)`, explain: "Порожнє тіло запиту (без name) дає 400, а не помилку KeyError, що зупинила б увесь сервер." },
    ],
    task: `Онови create_task(request): якщо "name" немає в request.body або request.body["name"].strip() порожній — поверни Response(400, {"error": "Поле name обов'язкове"}). Виклич create_task з body={} (без name) і виведи response.status.`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ntasks_db = []\n\ndef create_task(request):\n    # твій код тут: перевірка name, потім створення задачі\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)\n\nreq = Request("POST", "/tasks", body={})\nresponse = create_task(req)\nprint(response.status)\n`,
    hints: [`if "name" not in request.body or not request.body["name"].strip(): return Response(400, {"error": "..."})`, `Цей рядок додається ПЕРШИМ, перед створенням нового id.`, `def create_task(request):\n    if "name" not in request.body or not request.body["name"].strip():\n        return Response(400, {"error": "Поле name обов'язкове"})\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ntasks_db = []\n\ndef create_task(request):\n    if "name" not in request.body or not request.body["name"].strip():\n        return Response(400, {"error": "Поле name обов'язкове"})\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)\n\nreq = Request("POST", "/tasks", body={})\nresponse = create_task(req)\nprint(response.status)`,
    testCode: `if not any(l.strip() == "400" for l in __logs):\n    __result__ = {"pass": False, "message": "response.status має бути 400 — тіло запиту без поля name некоректне."}\nelif "tasks_db" in globals() and len(tasks_db) != 0:\n    __result__ = {"pass": False, "message": "Задача НЕ має бути створена, якщо валідація не пройшла."}\nelse:\n    __result__ = {"pass": True, "message": "Валідація перед створенням даних — обов'язковий крок будь-якого надійного API."}`,
  },
  {
    id: "py-api-17",
    title: "Журнал запитів (middleware-подібний хук)",
    type: "python",
    theory:
      "Додамо App журнал: список self.log, куди handle_request записує кожен запит ПЕРЕД його обробкою — той самий принцип, що log_action() в Automation, тільки для запитів API:\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n        self.log = []\n\n    def handle_request(self, method, path):\n        self.log.append(f\"{method} {path}\")\n        # ... решта логіки пошуку й виклику обробника\n\nУ реальних фреймворках такий код називають middleware — «проміжний шар», що виконується для КОЖНОГО запиту, незалежно від конкретного маршруту (логування, перевірка автентифікації, вимірювання часу відповіді).",
    examples: [
      { title: "App веде журнал усіх запитів", code: `app = App()\napp.add_route("GET", "/tasks", lambda r: Response(200, []))\n\napp.handle_request("GET", "/tasks")\napp.handle_request("GET", "/unknown")\n\nprint(app.log)`, explain: "self.log росте з КОЖНИМ запитом, незалежно від того, чи маршрут існує." },
    ],
    task: `Додай App атрибут self.log = [] в __init__, і в handle_request(self, method, path) — ПЕРШИМ рядком — self.log.append(f"{method} {path}"). Виклич два запити і виведи app.log.`,
    starter: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n        # твій код тут: self.log\n\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n\n    def handle_request(self, method, path):\n        # твій код тут: запиши в лог\n        handler = self.routes.get((method, path))\n        if handler is None:\n            return Response(404, {"error": "Маршрут не знайдено"})\n        return handler(None)\n\napp = App()\napp.add_route("GET", "/tasks", lambda r: Response(200, []))\n\napp.handle_request("GET", "/tasks")\napp.handle_request("GET", "/unknown")\n\nprint(app.log)\n`,
    hints: [`self.log = [] в __init__.`, `self.log.append(f"{method} {path}") — перший рядок handle_request.`, `def __init__(self):\n    self.routes = {}\n    self.log = []\n\ndef handle_request(self, method, path):\n    self.log.append(f"{method} {path}")\n    ...`],
    solution: `class Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n        self.log = []\n\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n\n    def handle_request(self, method, path):\n        self.log.append(f"{method} {path}")\n        handler = self.routes.get((method, path))\n        if handler is None:\n            return Response(404, {"error": "Маршрут не знайдено"})\n        return handler(None)\n\napp = App()\napp.add_route("GET", "/tasks", lambda r: Response(200, []))\n\napp.handle_request("GET", "/tasks")\napp.handle_request("GET", "/unknown")\n\nprint(app.log)`,
    testCode: `if "app" not in globals() or app.log != ["GET /tasks", "GET /unknown"]:\n    __result__ = {"pass": False, "message": "app.log має містити ['GET /tasks', 'GET /unknown'] — по одному запису на кожен запит."}\nelif not any("/unknown" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи app.log через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Журнал запитів записується для КОЖНОГО виклику, навіть якщо маршрут не знайдено — middleware не знає наперед результат обробки."}`,
  },
  {
    id: "py-api-18",
    title: "Заголовки відповіді",
    type: "python",
    theory:
      "Окрім статусу й тіла, справжня HTTP-відповідь має заголовки (headers) — метадані про саму відповідь. Найважливіший для API — Content-Type: application/json, що каже клієнту «тіло цієї відповіді — це JSON, розбирай його відповідно». Додамо headers як словник у Response:\n\nclass Response:\n    def __init__(self, status, body, headers=None):\n        self.status = status\n        self.body = body\n        self.headers = headers or {\"Content-Type\": \"application/json\"}\n\nЗа замовчуванням Content-Type виставляється сам — тому окремим обробникам не треба вказувати його щоразу вручну.",
    examples: [
      { title: "Response із заголовками за замовчуванням", code: `class Response:\n    def __init__(self, status, body, headers=None):\n        self.status = status\n        self.body = body\n        self.headers = headers or {"Content-Type": "application/json"}\n\nresponse = Response(200, {"ok": True})\nprint(response.headers)`, explain: "headers або {} за замовчуванням — той самий трюк, що й params у Request." },
    ],
    task: `Онови Response(self, status, body, headers=None): self.headers = headers or {"Content-Type": "application/json"}. Створи response = Response(200, {"ok": True}) (без headers) і виведи response.headers.`,
    starter: `class Response:\n    def __init__(self, status, body, headers=None):\n        self.status = status\n        self.body = body\n        # твій код тут\n        pass\n\nresponse = Response(200, {"ok": True})\nprint(response.headers)\n`,
    hints: [`self.headers = headers or {"Content-Type": "application/json"}`, `Той самий принцип, що й self.params = params or {} у Request.`, `self.headers = headers or {"Content-Type": "application/json"}`],
    solution: `class Response:\n    def __init__(self, status, body, headers=None):\n        self.status = status\n        self.body = body\n        self.headers = headers or {"Content-Type": "application/json"}\n\nresponse = Response(200, {"ok": True})\nprint(response.headers)`,
    testCode: `if "Response" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас Response."}\nelse:\n    probe = Response(200, {"ok": True})\n    if probe.headers.get("Content-Type") != "application/json":\n        __result__ = {"pass": False, "message": "response.headers має містити Content-Type: application/json за замовчуванням."}\n    elif not any("application/json" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи response.headers через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Content-Type — те, що каже клієнту, ЯК саме розбирати тіло відповіді."}`,
  },
  {
    id: "py-api-19",
    title: "Об'єднання: клас TaskAPI",
    type: "python",
    theory:
      "Зберемо ВСІ обробники (get_tasks, get_task, create_task, update_task, delete_task) і реєстрацію маршрутів в одну функцію build_task_api(), що повертає готовий, повністю налаштований App:\n\ndef build_task_api():\n    app = App()\n    app.add_route(\"GET\", \"/tasks\", get_tasks)\n    app.add_route(\"GET\", \"/tasks/<id>\", get_task)\n    app.add_route(\"POST\", \"/tasks\", create_task)\n    app.add_route(\"PUT\", \"/tasks/<id>\", update_task)\n    app.add_route(\"DELETE\", \"/tasks/<id>\", delete_task)\n    return app\n\nТепер запуск усього API — один виклик: app = build_task_api().",
    examples: [
      { title: "build_task_api() налаштовує все за раз", code: `app = build_task_api()\nprint(len(app.routes))`, explain: "5 маршрутів зареєстровано одним викликом — жодної ручної реєстрації в основному коді." },
    ],
    task: `Напиши build_task_api(), що створює App() і реєструє всі 5 маршрутів (GET /tasks, GET /tasks/<id>, POST /tasks, PUT /tasks/<id>, DELETE /tasks/<id>) на відповідні обробники (вже написані в стартовому коді). Виклич app = build_task_api() і виведи len(app.routes).`,
    starter: `class Response:\n    def __init__(self, status, body, headers=None):\n        self.status = status\n        self.body = body\n        self.headers = headers or {"Content-Type": "application/json"}\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n        self.log = []\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n    def handle_request(self, method, path, body=None):\n        self.log.append(f"{method} {path}")\n        for (r_method, pattern), handler in self.routes.items():\n            if r_method != method:\n                continue\n            params = match_route(pattern, path)\n            if params is not None:\n                return handler(Request(method, path, params, body))\n        return Response(404, {"error": "Маршрут не знайдено"})\n\ntasks_db = [{"id": 1, "name": "Купити хліб", "done": False}]\n\ndef get_tasks(request):\n    return Response(200, tasks_db)\ndef get_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    return Response(200, task) if task else Response(404, {"error": "Не знайдено"})\ndef create_task(request):\n    if "name" not in request.body or not request.body["name"].strip():\n        return Response(400, {"error": "Поле name обов'язкове"})\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)\ndef update_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Не знайдено"})\n    task["name"] = request.body.get("name", task["name"])\n    task["done"] = request.body.get("done", task["done"])\n    return Response(200, task)\ndef delete_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Не знайдено"})\n    tasks_db.remove(task)\n    return Response(204, None)\n\ndef build_task_api():\n    # твій код тут\n    pass\n\napp = build_task_api()\nprint(len(app.routes))\n`,
    hints: [`app = App(), потім 5 викликів app.add_route(...)`, `app.add_route("GET", "/tasks", get_tasks) — і так само для решти чотирьох.`, `def build_task_api():\n    app = App()\n    app.add_route("GET", "/tasks", get_tasks)\n    app.add_route("GET", "/tasks/<id>", get_task)\n    app.add_route("POST", "/tasks", create_task)\n    app.add_route("PUT", "/tasks/<id>", update_task)\n    app.add_route("DELETE", "/tasks/<id>", delete_task)\n    return app`],
    solution: `class Response:\n    def __init__(self, status, body, headers=None):\n        self.status = status\n        self.body = body\n        self.headers = headers or {"Content-Type": "application/json"}\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n        self.log = []\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n    def handle_request(self, method, path, body=None):\n        self.log.append(f"{method} {path}")\n        for (r_method, pattern), handler in self.routes.items():\n            if r_method != method:\n                continue\n            params = match_route(pattern, path)\n            if params is not None:\n                return handler(Request(method, path, params, body))\n        return Response(404, {"error": "Маршрут не знайдено"})\n\ntasks_db = [{"id": 1, "name": "Купити хліб", "done": False}]\n\ndef get_tasks(request):\n    return Response(200, tasks_db)\ndef get_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    return Response(200, task) if task else Response(404, {"error": "Не знайдено"})\ndef create_task(request):\n    if "name" not in request.body or not request.body["name"].strip():\n        return Response(400, {"error": "Поле name обов'язкове"})\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)\ndef update_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Не знайдено"})\n    task["name"] = request.body.get("name", task["name"])\n    task["done"] = request.body.get("done", task["done"])\n    return Response(200, task)\ndef delete_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Не знайдено"})\n    tasks_db.remove(task)\n    return Response(204, None)\n\ndef build_task_api():\n    app = App()\n    app.add_route("GET", "/tasks", get_tasks)\n    app.add_route("GET", "/tasks/<id>", get_task)\n    app.add_route("POST", "/tasks", create_task)\n    app.add_route("PUT", "/tasks/<id>", update_task)\n    app.add_route("DELETE", "/tasks/<id>", delete_task)\n    return app\n\napp = build_task_api()\nprint(len(app.routes))`,
    testCode: `if "build_task_api" not in globals() or not callable(build_task_api):\n    __result__ = {"pass": False, "message": "Потрібна функція build_task_api()."}\nelif "app" not in globals() or len(app.routes) != 5:\n    __result__ = {"pass": False, "message": "app.routes має містити рівно 5 маршрутів."}\nelif not any(l.strip() == "5" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(app.routes) — має бути 5."}\nelse:\n    __result__ = {"pass": True, "message": "build_task_api() — публічний інтерфейс: один виклик, і весь API готовий до роботи."}`,
  },
  {
    id: "py-api-20",
    title: "Фінальний проєкт: Task API",
    type: "python",
    theory:
      "Останній крок — прогнати через повний Task API послідовність запитів (як реальний клієнт): створити задачу, отримати список, оновити одну, видалити іншу — і показати журнал усіх запитів. Це і є Task API, обіцяний ще на вступній сторінці «Що це?».\n\nЦей самий код (Request, Response, App, match_route, обробники) переноситься у справжній Flask-застосунок майже без змін структури — лише сокет-рівень (@app.route, request.get_json(), app.run()) додається зверху; сама логіка маршрутизації й обробки лишається ідентичною.",
    examples: [
      { title: "Послідовність запитів до Task API", code: `app = build_task_api()\n\ncreate = app.handle_request("POST", "/tasks", body={"name": "Прочитати книгу"})\nall_tasks = app.handle_request("GET", "/tasks")\nupdated = app.handle_request("PUT", "/tasks/1", body={"done": True})\ndeleted = app.handle_request("DELETE", "/tasks/2")\n\nprint(create.status, all_tasks.status, updated.status, deleted.status)\nprint(app.log)`, explain: "Чотири різні запити підряд, і кожен обробляється незалежно, зі своїм статусом." },
    ],
    task: `Виклич app.handle_request(...) для: POST /tasks (body={"name": "Прочитати книгу"}), GET /tasks, PUT /tasks/1 (body={"done": True}), DELETE /tasks/2. Виведи всі чотири статус-коди в одному рядку і app.log наостанок.`,
    starter: `class Response:\n    def __init__(self, status, body, headers=None):\n        self.status = status\n        self.body = body\n        self.headers = headers or {"Content-Type": "application/json"}\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n        self.log = []\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n    def handle_request(self, method, path, body=None):\n        self.log.append(f"{method} {path}")\n        for (r_method, pattern), handler in self.routes.items():\n            if r_method != method:\n                continue\n            params = match_route(pattern, path)\n            if params is not None:\n                return handler(Request(method, path, params, body))\n        return Response(404, {"error": "Маршрут не знайдено"})\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef get_tasks(request):\n    return Response(200, tasks_db)\ndef get_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    return Response(200, task) if task else Response(404, {"error": "Не знайдено"})\ndef create_task(request):\n    if "name" not in request.body or not request.body["name"].strip():\n        return Response(400, {"error": "Поле name обов'язкове"})\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)\ndef update_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Не знайдено"})\n    task["name"] = request.body.get("name", task["name"])\n    task["done"] = request.body.get("done", task["done"])\n    return Response(200, task)\ndef delete_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Не знайдено"})\n    tasks_db.remove(task)\n    return Response(204, None)\n\ndef build_task_api():\n    app = App()\n    app.add_route("GET", "/tasks", get_tasks)\n    app.add_route("GET", "/tasks/<id>", get_task)\n    app.add_route("POST", "/tasks", create_task)\n    app.add_route("PUT", "/tasks/<id>", update_task)\n    app.add_route("DELETE", "/tasks/<id>", delete_task)\n    return app\n\napp = build_task_api()\n\n# твій код тут\n`,
    hints: [`create = app.handle_request("POST", "/tasks", body={"name": "Прочитати книгу"})`, `all_tasks = app.handle_request("GET", "/tasks"); updated = app.handle_request("PUT", "/tasks/1", body={"done": True}); deleted = app.handle_request("DELETE", "/tasks/2")`, `create = app.handle_request("POST", "/tasks", body={"name": "Прочитати книгу"})\nall_tasks = app.handle_request("GET", "/tasks")\nupdated = app.handle_request("PUT", "/tasks/1", body={"done": True})\ndeleted = app.handle_request("DELETE", "/tasks/2")\nprint(create.status, all_tasks.status, updated.status, deleted.status)\nprint(app.log)`],
    solution: `class Response:\n    def __init__(self, status, body, headers=None):\n        self.status = status\n        self.body = body\n        self.headers = headers or {"Content-Type": "application/json"}\n\nclass Request:\n    def __init__(self, method, path, params=None, body=None):\n        self.method = method\n        self.path = path\n        self.params = params or {}\n        self.body = body\n\ndef match_route(pattern, path):\n    pattern_parts = pattern.split("/")\n    path_parts = path.split("/")\n    if len(pattern_parts) != len(path_parts):\n        return None\n    params = {}\n    for p, a in zip(pattern_parts, path_parts):\n        if p.startswith("<") and p.endswith(">"):\n            params[p[1:-1]] = a\n        elif p != a:\n            return None\n    return params\n\nclass App:\n    def __init__(self):\n        self.routes = {}\n        self.log = []\n    def add_route(self, method, path, handler):\n        self.routes[(method, path)] = handler\n    def handle_request(self, method, path, body=None):\n        self.log.append(f"{method} {path}")\n        for (r_method, pattern), handler in self.routes.items():\n            if r_method != method:\n                continue\n            params = match_route(pattern, path)\n            if params is not None:\n                return handler(Request(method, path, params, body))\n        return Response(404, {"error": "Маршрут не знайдено"})\n\ntasks_db = [\n    {"id": 1, "name": "Купити хліб", "done": False},\n    {"id": 2, "name": "Погуляти", "done": True},\n]\n\ndef get_tasks(request):\n    return Response(200, tasks_db)\ndef get_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    return Response(200, task) if task else Response(404, {"error": "Не знайдено"})\ndef create_task(request):\n    if "name" not in request.body or not request.body["name"].strip():\n        return Response(400, {"error": "Поле name обов'язкове"})\n    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1\n    task = {"id": new_id, "name": request.body["name"], "done": False}\n    tasks_db.append(task)\n    return Response(201, task)\ndef update_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Не знайдено"})\n    task["name"] = request.body.get("name", task["name"])\n    task["done"] = request.body.get("done", task["done"])\n    return Response(200, task)\ndef delete_task(request):\n    task_id = int(request.params["id"])\n    task = next((t for t in tasks_db if t["id"] == task_id), None)\n    if task is None:\n        return Response(404, {"error": "Не знайдено"})\n    tasks_db.remove(task)\n    return Response(204, None)\n\ndef build_task_api():\n    app = App()\n    app.add_route("GET", "/tasks", get_tasks)\n    app.add_route("GET", "/tasks/<id>", get_task)\n    app.add_route("POST", "/tasks", create_task)\n    app.add_route("PUT", "/tasks/<id>", update_task)\n    app.add_route("DELETE", "/tasks/<id>", delete_task)\n    return app\n\napp = build_task_api()\n\ncreate = app.handle_request("POST", "/tasks", body={"name": "Прочитати книгу"})\nall_tasks = app.handle_request("GET", "/tasks")\nupdated = app.handle_request("PUT", "/tasks/1", body={"done": True})\ndeleted = app.handle_request("DELETE", "/tasks/2")\n\nprint(create.status, all_tasks.status, updated.status, deleted.status)\nprint(app.log)`,
    testCode: `if "app" not in globals() or len(app.log) != 4:\n    __result__ = {"pass": False, "message": "app.log має містити рівно 4 записи — по одному на кожен запит."}\nelif "create" not in globals() or create.status != 201:\n    __result__ = {"pass": False, "message": "create.status має дорівнювати 201."}\nelif "deleted" not in globals() or deleted.status != 204:\n    __result__ = {"pass": False, "message": "deleted.status має дорівнювати 204."}\nelif len(tasks_db) != 2:\n    __result__ = {"pass": False, "message": "tasks_db має містити 2 задачі: одну лишилась з видалених двох, плюс нова створена."}\nelif not any("201" in l and "200" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи всі чотири статус-коди в одному рядку."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Повний Task API: маршрутизація, CRUD, валідація й журнал запитів — усе з нуля, крок за кроком за 20 уроків."}`,
    finalProject: {
      techs: ["Python 3", "class (Request, Response, App)", "json", "REST-подібна маршрутизація", "динамічні параметри шляху"],
      skills: [
        "Серіалізація даних через модуль json",
        "Об'єктне представлення запиту й відповіді (Request/Response)",
        "Таблиця маршрутів і диспетчеризація (handle_request)",
        "Розбір динамічних сегментів шляху (/tasks/<id>)",
        "CRUD-операції: GET/POST/PUT/DELETE з правильними статус-кодами",
        "Валідація вхідних даних і журнал запитів",
      ],
      structure:
        "task_api.py\n  ├── class Request / Response   # вхід і вихід кожного обробника\n  ├── match_route(pattern, path)  # розбір /tasks/<id>\n  ├── class App                   # routes, log, add_route, handle_request\n  ├── get_tasks / get_task         # GET-обробники\n  ├── create_task                  # POST + валідація\n  ├── update_task / delete_task    # PUT / DELETE\n  └── build_task_api()              # збирає й реєструє все",
      code: `import json


class Response:
    def __init__(self, status, body, headers=None):
        self.status = status
        self.body = body
        self.headers = headers or {"Content-Type": "application/json"}

    def to_json(self):
        return json.dumps(self.body, ensure_ascii=False)


class Request:
    def __init__(self, method, path, params=None, body=None):
        self.method = method
        self.path = path
        self.params = params or {}
        self.body = body


def match_route(pattern, path):
    pattern_parts = pattern.split("/")
    path_parts = path.split("/")
    if len(pattern_parts) != len(path_parts):
        return None
    params = {}
    for p, a in zip(pattern_parts, path_parts):
        if p.startswith("<") and p.endswith(">"):
            params[p[1:-1]] = a
        elif p != a:
            return None
    return params


class App:
    def __init__(self):
        self.routes = {}
        self.log = []

    def add_route(self, method, path, handler):
        self.routes[(method, path)] = handler

    def handle_request(self, method, path, body=None):
        self.log.append(f"{method} {path}")
        for (r_method, pattern), handler in self.routes.items():
            if r_method != method:
                continue
            params = match_route(pattern, path)
            if params is not None:
                return handler(Request(method, path, params, body))
        return Response(404, {"error": "Маршрут не знайдено"})


tasks_db = [
    {"id": 1, "name": "Купити хліб", "done": False},
    {"id": 2, "name": "Погуляти", "done": True},
]


def get_tasks(request):
    return Response(200, tasks_db)


def get_task(request):
    task_id = int(request.params["id"])
    task = next((t for t in tasks_db if t["id"] == task_id), None)
    if task is None:
        return Response(404, {"error": "Задачу не знайдено"})
    return Response(200, task)


def create_task(request):
    if "name" not in request.body or not request.body["name"].strip():
        return Response(400, {"error": "Поле name обов'язкове"})
    new_id = max(t["id"] for t in tasks_db) + 1 if tasks_db else 1
    task = {"id": new_id, "name": request.body["name"], "done": False}
    tasks_db.append(task)
    return Response(201, task)


def update_task(request):
    task_id = int(request.params["id"])
    task = next((t for t in tasks_db if t["id"] == task_id), None)
    if task is None:
        return Response(404, {"error": "Задачу не знайдено"})
    task["name"] = request.body.get("name", task["name"])
    task["done"] = request.body.get("done", task["done"])
    return Response(200, task)


def delete_task(request):
    task_id = int(request.params["id"])
    task = next((t for t in tasks_db if t["id"] == task_id), None)
    if task is None:
        return Response(404, {"error": "Задачу не знайдено"})
    tasks_db.remove(task)
    return Response(204, None)


def build_task_api():
    app = App()
    app.add_route("GET", "/tasks", get_tasks)
    app.add_route("GET", "/tasks/<id>", get_task)
    app.add_route("POST", "/tasks", create_task)
    app.add_route("PUT", "/tasks/<id>", update_task)
    app.add_route("DELETE", "/tasks/<id>", delete_task)
    return app


if __name__ == "__main__":
    app = build_task_api()
    create = app.handle_request("POST", "/tasks", body={"name": "Прочитати книгу"})
    print(create.status, create.to_json())`,
      runCommand: "python task_api.py",
      installGuide: {
        intro:
          "Тут запити були прямими викликами функцій — жодного реального мережевого порту. Щоб цей самий Task API відповідав на СПРАВЖНІ HTTP-запити (з браузера, Postman, іншого сервера), встанови Flask і додай тонкий шар поверх уже готової логіки.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text:
              "Зайди на python.org/downloads і встанови останню версію. Windows: обов'язково постав галочку «Add python.exe to PATH». (Детальні кроки для кожної ОС — в уроках напрямку Game Development.)",
            code: null,
          },
          {
            title: "2. Встанови Flask",
            text: "Flask — найпростіший спосіб отримати РЕАЛЬНИЙ HTTP-сервер поверх тієї самої логіки маршрутизації.",
            code: "pip install flask",
          },
          {
            title: "3. Обгорни обробники в Flask-маршрути",
            text:
              "Логіка кожного обробника (get_tasks, create_task тощо) лишається БЕЗ ЗМІН — просто виклич її з реального Flask-маршруту замість власного handle_request().",
            code: `from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/tasks", methods=["GET"])
def flask_get_tasks():
    return jsonify(tasks_db)

@app.route("/tasks", methods=["POST"])
def flask_create_task():
    r = create_task(Request("POST", "/tasks", body=request.get_json()))
    return jsonify(r.body), r.status

if __name__ == "__main__":
    app.run(debug=True)`,
          },
          {
            title: "4. Запусти сервер і перевір у браузері",
            text:
              "Виконай файл — Flask підніме реальний сервер на localhost:5000. Відкрий http://localhost:5000/tasks у браузері (для GET) або надішли запит через curl/Postman для POST/PUT/DELETE.",
            code: "python task_api.py\n\n# в іншому терміналі:\ncurl http://localhost:5000/tasks",
          },
        ],
      },
      improvements: [
        "Перейти на FastAPI для автоматичної валідації даних і документації API (Swagger UI) з коробки",
        "Замінити tasks_db (список у пам'яті) на справжню базу даних (SQLite через напрямок Databases)",
        "Додати автентифікацію (API-ключ або токен), щоб не кожен міг змінювати дані",
        "Додати пагінацію для GET /tasks, коли задач стає дуже багато",
      ],
      nextLevel:
        "Далі — 🐍 Backend Development: API — лише частина серверної розробки; наступний крок об'єднує маршрутизацію з базами даних, автентифікацією й бізнес-логікою у повноцінний backend-застосунок.",
    },
  },
];
