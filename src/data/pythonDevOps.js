// Python DevOps / System Administration — the fifteenth Python direction.
// Same intro + 20 lessons structure. This direction is about the scripts
// that keep servers running: reading configuration, checking service
// health, watching resource usage, rotating logs, backing up data, and
// deploying safely with a rollback plan. Real ops tooling (psutil,
// Ansible, Docker SDKs) needs system access this browser sandbox simply
// doesn't have, so every "server" and "resource metric" here is realistic
// simulated data the learner builds — the same honest pattern used for
// every prior direction where a real external system wasn't reachable.
export const PYTHON_DEVOPS_LESSONS = [
  {
    id: "py-devops-intro",
    title: "Що це? — DevOps / System Administration",
    type: "intro",
    theory:
      "Python DevOps / System Administration — це напрямок про скрипти, які тримають сервери РОБОЧИМИ: читання конфігурації, перевірка стану сервісів, моніторинг ресурсів, резервне копіювання, і розгортання нового коду БЕЗПЕЧНО (з планом відкату, якщо щось піде не так).\n\nУ реальній роботі для цього використовують інструменти на кшталт psutil (реальні метрики CPU/пам'яті), Ansible, Docker SDK — вони потребують доступу до РЕАЛЬНОЇ операційної системи, якого немає в браузерній пісочниці. Тому «сервери» й «метрики» в цих 20 уроках — реалістичні змодельовані дані, які ти сам створюєш: та сама чесна практика, що вже застосовувалась там, де реальний зовнішній сервіс був недосяжний (⚙️ Automation, 🕸️ Web Scraping). Принципи — читання конфігурації, пороги для алертів, ротація логів, безпечне розгортання — ІДЕНТИЧНІ тому, що роблять реальні DevOps-скрипти на справжніх серверах.\n\nЩо знадобиться з попередніх напрямків: робота з файлами (⚙️ Automation), os.environ (🔧 Backend Development), обробка помилок try/except (🔐 Cybersecurity). Що буде після 20 уроків: server_ops_toolkit.py — інструментарій для перевірки стану серверів, моніторингу з алертами, резервного копіювання й безпечного розгортання з відкатом.",
    presentation: [
      { title: "DevOps — коротко", points: ["Конфігурація, моніторинг, резервні копії, безпечне розгортання", "Реальний доступ до ОС недоступний у браузері — реалістично змодельовані сервери й метрики", "Ті самі принципи, що в реальних DevOps-скриптах на справжніх серверах"] },
      { title: "Результат", points: ["20 уроків: конфігурація → моніторинг → алерти → бекапи → розгортання з відкатом", "Фінал: server_ops_toolkit.py з повним операційним циклом", "Потрібне знання файлів (⚙️ Automation) і try/except (🔐 Cybersecurity)"] },
    ],
  },
  {
    id: "py-devops-1",
    title: "Читання конфігурації сервера з файлу",
    type: "python",
    theory:
      "Сервери НІКОЛИ не мають налаштувань «зашитими» в код — конфігурація зберігається окремо (у файлі), щоб змінювати її БЕЗ переписування скрипта. Простий формат key=value легко розібрати вручну:\n\ndef parse_config(path):\n    config = {}\n    with open(path) as f:\n        for line in f:\n            line = line.strip()\n            if line and \"=\" in line:\n                key, value = line.split(\"=\", 1)\n                config[key.strip()] = value.strip()\n    return config\n\nwith open(\"server.conf\", \"w\") as f:\n    f.write(\"host=example.com\\nport=8080\\ndebug=false\\n\")\n\nprint(parse_config(\"server.conf\"))",
    examples: [
      { title: "parse_config() — розбір key=value файлу", code: `def parse_config(path):\n    config = {}\n    with open(path) as f:\n        for line in f:\n            line = line.strip()\n            if line and "=" in line:\n                key, value = line.split("=", 1)\n                config[key.strip()] = value.strip()\n    return config\n\nwith open("server.conf", "w") as f:\n    f.write("host=example.com\\nport=8080\\ndebug=false\\n")\n\nprint(parse_config("server.conf"))`, explain: "Файл конфігурації стає звичайним словником {'host': 'example.com', 'port': '8080', 'debug': 'false'}." },
    ],
    task: `Створи "server.conf" з вмістом "host=example.com\\nport=8080\\ndebug=false\\n". Напиши parse_config(path). Виведи результат.`,
    starter: `def parse_config(path):\n    # твій код тут\n    pass\n\n# with open("server.conf", "w") as f:\n#     f.write("host=example.com\\nport=8080\\ndebug=false\\n")\n\n# print(parse_config("server.conf"))\n`,
    hints: [`Цикл for line in f: розбирає файл рядок за рядком.`, `if "=" in line: key, value = line.split("=", 1); збережи config[key.strip()] = value.strip()`, `def parse_config(path):\n    config = {}\n    with open(path) as f:\n        for line in f:\n            line = line.strip()\n            if line and "=" in line:\n                key, value = line.split("=", 1)\n                config[key.strip()] = value.strip()\n    return config`],
    solution: `def parse_config(path):\n    config = {}\n    with open(path) as f:\n        for line in f:\n            line = line.strip()\n            if line and "=" in line:\n                key, value = line.split("=", 1)\n                config[key.strip()] = value.strip()\n    return config\n\nwith open("server.conf", "w") as f:\n    f.write("host=example.com\\nport=8080\\ndebug=false\\n")\n\nprint(parse_config("server.conf"))`,
    testCode: `if "parse_config" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція parse_config(path)."}\nelse:\n    config = parse_config("server.conf")\n    if config != {"host": "example.com", "port": "8080", "debug": "false"}:\n        __result__ = {"pass": False, "message": "parse_config('server.conf') має дати {'host': 'example.com', 'port': '8080', 'debug': 'false'}."}\n    else:\n        __result__ = {"pass": True, "message": "Конфігурація в окремому файлі — стандарт: змінюєш поведінку БЕЗ переписування коду."}`,
  },
  {
    id: "py-devops-2",
    title: "Змінні середовища для різних оточень",
    type: "python",
    theory:
      "Той самий код запускається у РІЗНИХ оточеннях (розробка, тестування, продакшн) з РІЗНИМИ налаштуваннями. Змінні середовища (recap із 🔧 Backend Development) дозволяють перемикати оточення БЕЗ зміни файлів конфігурації:\n\nimport os\n\nENVIRONMENTS = {\n    \"dev\": {\"DEVOPS_DEBUG\": \"true\", \"DEVOPS_DB_HOST\": \"localhost\"},\n    \"prod\": {\"DEVOPS_DEBUG\": \"false\", \"DEVOPS_DB_HOST\": \"prod-db.example.com\"},\n}\n\ndef load_environment(name):\n    os.environ.update(ENVIRONMENTS[name])\n\nload_environment(\"prod\")\nprint(os.environ[\"DEVOPS_DEBUG\"])\nprint(os.environ[\"DEVOPS_DB_HOST\"])",
    examples: [
      { title: "load_environment() — перемикання оточень", code: `import os\n\nENVIRONMENTS = {\n    "dev": {"DEVOPS_DEBUG": "true", "DEVOPS_DB_HOST": "localhost"},\n    "prod": {"DEVOPS_DEBUG": "false", "DEVOPS_DB_HOST": "prod-db.example.com"},\n}\n\ndef load_environment(name):\n    os.environ.update(ENVIRONMENTS[name])\n\nload_environment("prod")\nprint(os.environ["DEVOPS_DEBUG"])\nprint(os.environ["DEVOPS_DB_HOST"])`, explain: "load_environment('prod') робить os.environ['DEVOPS_DEBUG'] рівним 'false' — той самий код, інша поведінка." },
    ],
    task: `Дано ENVIRONMENTS. Напиши load_environment(name), що оновлює os.environ потрібними значеннями. Викликай для "prod". Виведи os.environ["DEVOPS_DEBUG"] і os.environ["DEVOPS_DB_HOST"].`,
    starter: `import os\n\nENVIRONMENTS = {\n    "dev": {"DEVOPS_DEBUG": "true", "DEVOPS_DB_HOST": "localhost"},\n    "prod": {"DEVOPS_DEBUG": "false", "DEVOPS_DB_HOST": "prod-db.example.com"},\n}\n\ndef load_environment(name):\n    # твій код тут\n    pass\n\n# load_environment("prod")\n# print(os.environ["DEVOPS_DEBUG"])\n# print(os.environ["DEVOPS_DB_HOST"])\n`,
    hints: [`os.environ.update(словник) додає/перезаписує кілька змінних одразу.`, `os.environ.update(ENVIRONMENTS[name])`, `def load_environment(name):\n    os.environ.update(ENVIRONMENTS[name])\n\nload_environment("prod")\nprint(os.environ["DEVOPS_DEBUG"])\nprint(os.environ["DEVOPS_DB_HOST"])`],
    solution: `import os\n\nENVIRONMENTS = {\n    "dev": {"DEVOPS_DEBUG": "true", "DEVOPS_DB_HOST": "localhost"},\n    "prod": {"DEVOPS_DEBUG": "false", "DEVOPS_DB_HOST": "prod-db.example.com"},\n}\n\ndef load_environment(name):\n    os.environ.update(ENVIRONMENTS[name])\n\nload_environment("prod")\nprint(os.environ["DEVOPS_DEBUG"])\nprint(os.environ["DEVOPS_DB_HOST"])`,
    testCode: `if "load_environment" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція load_environment(name)."}\nelif os.environ.get("DEVOPS_DEBUG") != "false":\n    __result__ = {"pass": False, "message": "Після load_environment('prod') os.environ['DEVOPS_DEBUG'] має бути 'false'."}\nelif os.environ.get("DEVOPS_DB_HOST") != "prod-db.example.com":\n    __result__ = {"pass": False, "message": "os.environ['DEVOPS_DB_HOST'] має бути 'prod-db.example.com'."}\nelse:\n    __result__ = {"pass": True, "message": "Змінні середовища дозволяють перемикати оточення БЕЗ жодної зміни в коді чи файлах конфігурації."}`,
  },
  {
    id: "py-devops-3",
    title: "Перевірка стану сервісу (health check)",
    type: "python",
    theory:
      "Health check — простий запит, що перевіряє, чи сервіс ЖИВИЙ і відповідає вчасно. Реальний health check робить HTTP-запит; тут відповідь сервера змодельована як словник:\n\ndef is_healthy(response):\n    return response[\"status_code\"] == 200 and response[\"latency_ms\"] < 500\n\ngood = {\"status_code\": 200, \"latency_ms\": 45}\nbad = {\"status_code\": 500, \"latency_ms\": 900}\n\nprint(is_healthy(good))\nprint(is_healthy(bad))\n\nОБИДВІ умови важливі: сервер може відповідати статусом 200, але НАДТО повільно (latency), що теж сигналізує про проблему.",
    examples: [
      { title: "is_healthy() — статус і затримка разом", code: `def is_healthy(response):\n    return response["status_code"] == 200 and response["latency_ms"] < 500\n\ngood = {"status_code": 200, "latency_ms": 45}\nbad = {"status_code": 500, "latency_ms": 900}\n\nprint(is_healthy(good))\nprint(is_healthy(bad))`, explain: "good — швидка відповідь 200 (True); bad — і статус помилки, і повільна відповідь (False)." },
    ],
    task: `Напиши is_healthy(response), що перевіряє status_code==200 і latency_ms<500. Виведи is_healthy(good) і is_healthy(bad).`,
    starter: `good = {"status_code": 200, "latency_ms": 45}\nbad = {"status_code": 500, "latency_ms": 900}\n\ndef is_healthy(response):\n    # твій код тут\n    pass\n\n# print(is_healthy(good))\n# print(is_healthy(bad))\n`,
    hints: [`Обидві умови мають виконуватись разом (and).`, `return response["status_code"] == 200 and response["latency_ms"] < 500`, `def is_healthy(response):\n    return response["status_code"] == 200 and response["latency_ms"] < 500\n\nprint(is_healthy(good))\nprint(is_healthy(bad))`],
    solution: `good = {"status_code": 200, "latency_ms": 45}\nbad = {"status_code": 500, "latency_ms": 900}\n\ndef is_healthy(response):\n    return response["status_code"] == 200 and response["latency_ms"] < 500\n\nprint(is_healthy(good))\nprint(is_healthy(bad))`,
    testCode: `if "is_healthy" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція is_healthy(response)."}\nelif is_healthy(good) != True or is_healthy(bad) != False:\n    __result__ = {"pass": False, "message": "is_healthy(good) має бути True, is_healthy(bad) — False."}\nelif is_healthy({"status_code": 200, "latency_ms": 600}) != False:\n    __result__ = {"pass": False, "message": "Статус 200, але латентність 600мс має все одно дати False (занадто повільно)."}\nelse:\n    __result__ = {"pass": True, "message": "Health check перевіряє і статус, і швидкість відповіді — обидва мають значення для реальної надійності."}`,
  },
  {
    id: "py-devops-4",
    title: "Моніторинг ресурсів: перевищення порогів",
    type: "python",
    theory:
      "Моніторинг ресурсів порівнює ПОТОЧНІ показники (CPU, пам'ять) з допустимими межами. Значення, що перевищують поріг, сигналізують про потенційну проблему:\n\ndef check_thresholds(metrics, thresholds):\n    return [key for key in metrics if metrics[key] > thresholds[key]]\n\nmetrics = {\"cpu\": 85, \"memory\": 60}\nTHRESHOLDS = {\"cpu\": 80, \"memory\": 90}\n\nprint(check_thresholds(metrics, THRESHOLDS))\n\nCPU на 85% перевищує поріг 80% (потрапляє у список), а пам'ять на 60% — у межах допустимого (не потрапляє).",
    examples: [
      { title: "check_thresholds() — які метрики перевищені", code: `def check_thresholds(metrics, thresholds):\n    return [key for key in metrics if metrics[key] > thresholds[key]]\n\nmetrics = {"cpu": 85, "memory": 60}\nTHRESHOLDS = {"cpu": 80, "memory": 90}\n\nprint(check_thresholds(metrics, THRESHOLDS))`, explain: "['cpu'] — лише CPU перевищив свій поріг (85 > 80), пам'ять у нормі (60 < 90)." },
    ],
    task: `Дано metrics, THRESHOLDS. Напиши check_thresholds(metrics, thresholds). Виведи результат.`,
    starter: `metrics = {"cpu": 85, "memory": 60}\nTHRESHOLDS = {"cpu": 80, "memory": 90}\n\ndef check_thresholds(metrics, thresholds):\n    # твій код тут\n    pass\n\n# print(check_thresholds(metrics, THRESHOLDS))\n`,
    hints: [`[key for key in metrics if ...] — list comprehension по ключах словника.`, `metrics[key] > thresholds[key] — порівняння відповідних значень.`, `def check_thresholds(metrics, thresholds):\n    return [key for key in metrics if metrics[key] > thresholds[key]]\n\nprint(check_thresholds(metrics, THRESHOLDS))`],
    solution: `metrics = {"cpu": 85, "memory": 60}\nTHRESHOLDS = {"cpu": 80, "memory": 90}\n\ndef check_thresholds(metrics, thresholds):\n    return [key for key in metrics if metrics[key] > thresholds[key]]\n\nprint(check_thresholds(metrics, THRESHOLDS))`,
    testCode: `if "check_thresholds" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція check_thresholds(metrics, thresholds)."}\nelif check_thresholds(metrics, THRESHOLDS) != ["cpu"]:\n    __result__ = {"pass": False, "message": "check_thresholds(metrics, THRESHOLDS) має дати ['cpu']."}\nelse:\n    __result__ = {"pass": True, "message": "Пороги перетворюють сирі числа на конкретний список проблем, що потребують уваги."}`,
  },
  {
    id: "py-devops-5",
    title: "Система сповіщень при перевищенні порогів",
    type: "python",
    theory:
      "Знайдені перевищення порогів мають призвести до КОНКРЕТНОЇ ДІЇ — сповіщення (у реальності: лист, повідомлення в Slack; тут — запис у список):\n\nalerts = []\n\ndef raise_alert(metric, value, threshold):\n    alerts.append(f\"ALERT: {metric} at {value}% (threshold {threshold}%)\")\n\nfor metric in check_thresholds(metrics, THRESHOLDS):\n    raise_alert(metric, metrics[metric], THRESHOLDS[metric])\n\nfor alert in alerts:\n    print(alert)",
    examples: [
      { title: "raise_alert() для кожної перевищеної метрики", code: `metrics = {"cpu": 85, "memory": 60}\nTHRESHOLDS = {"cpu": 80, "memory": 90}\n\ndef check_thresholds(metrics, thresholds):\n    return [key for key in metrics if metrics[key] > thresholds[key]]\n\nalerts = []\n\ndef raise_alert(metric, value, threshold):\n    alerts.append(f"ALERT: {metric} at {value}% (threshold {threshold}%)")\n\nfor metric in check_thresholds(metrics, THRESHOLDS):\n    raise_alert(metric, metrics[metric], THRESHOLDS[metric])\n\nfor alert in alerts:\n    print(alert)`, explain: "Один запис alerts: 'ALERT: cpu at 85% (threshold 80%)' — конкретне, дієве повідомлення." },
    ],
    task: `Дано metrics, THRESHOLDS, check_thresholds() (в starter). Напиши raise_alert(metric, value, threshold). Виклич для кожної перевищеної метрики. Виведи всі alerts.`,
    starter: `metrics = {"cpu": 85, "memory": 60}\nTHRESHOLDS = {"cpu": 80, "memory": 90}\n\ndef check_thresholds(metrics, thresholds):\n    return [key for key in metrics if metrics[key] > thresholds[key]]\n\nalerts = []\n\ndef raise_alert(metric, value, threshold):\n    # твій код тут\n    pass\n\n# for metric in check_thresholds(metrics, THRESHOLDS):\n#     raise_alert(metric, metrics[metric], THRESHOLDS[metric])\n\n# for alert in alerts:\n#     print(alert)\n`,
    hints: [`alerts.append(f"ALERT: {metric} at {value}% (threshold {threshold}%)")`, `Цикл for metric in check_thresholds(...): виклич raise_alert з відповідними значеннями.`, `def raise_alert(metric, value, threshold):\n    alerts.append(f"ALERT: {metric} at {value}% (threshold {threshold}%)")\n\nfor metric in check_thresholds(metrics, THRESHOLDS):\n    raise_alert(metric, metrics[metric], THRESHOLDS[metric])\n\nfor alert in alerts:\n    print(alert)`],
    solution: `metrics = {"cpu": 85, "memory": 60}\nTHRESHOLDS = {"cpu": 80, "memory": 90}\n\ndef check_thresholds(metrics, thresholds):\n    return [key for key in metrics if metrics[key] > thresholds[key]]\n\nalerts = []\n\ndef raise_alert(metric, value, threshold):\n    alerts.append(f"ALERT: {metric} at {value}% (threshold {threshold}%)")\n\nfor metric in check_thresholds(metrics, THRESHOLDS):\n    raise_alert(metric, metrics[metric], THRESHOLDS[metric])\n\nfor alert in alerts:\n    print(alert)`,
    testCode: `if "raise_alert" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція raise_alert(metric, value, threshold)."}\nelif len(alerts) != 1 or "cpu" not in alerts[0] or "85" not in alerts[0]:\n    __result__ = {"pass": False, "message": "alerts має містити рівно 1 запис про cpu at 85%."}\nelif not any("ALERT" in l and "cpu" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи кожен alert через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Поріг + сповіщення — саме так реальні системи моніторингу перетворюють цифри на дію."}`,
  },
  {
    id: "py-devops-6",
    title: "Агрегований звіт по кількох серверах",
    type: "python",
    theory:
      "Реальна інфраструктура — не один сервер, а ДЕСЯТКИ. Той самий принцип порогів застосовується до СПИСКУ серверів, щоб швидко знайти проблемні:\n\ndef servers_over_threshold(servers, threshold):\n    return [s[\"name\"] for s in servers if s[\"cpu\"] > threshold]\n\nservers = [\n    {\"name\": \"web1\", \"cpu\": 85},\n    {\"name\": \"web2\", \"cpu\": 40},\n    {\"name\": \"web3\", \"cpu\": 92},\n]\n\nprint(servers_over_threshold(servers, 80))",
    examples: [
      { title: "servers_over_threshold() — знайти проблемні сервери", code: `def servers_over_threshold(servers, threshold):\n    return [s["name"] for s in servers if s["cpu"] > threshold]\n\nservers = [\n    {"name": "web1", "cpu": 85},\n    {"name": "web2", "cpu": 40},\n    {"name": "web3", "cpu": 92},\n]\n\nprint(servers_over_threshold(servers, 80))`, explain: "['web1', 'web3'] — саме ці два сервери потребують уваги адміністратора, а не всі три відразу." },
    ],
    task: `Дано servers. Напиши servers_over_threshold(servers, threshold). Виведи servers_over_threshold(servers, 80).`,
    starter: `servers = [\n    {"name": "web1", "cpu": 85},\n    {"name": "web2", "cpu": 40},\n    {"name": "web3", "cpu": 92},\n]\n\ndef servers_over_threshold(servers, threshold):\n    # твій код тут\n    pass\n\n# print(servers_over_threshold(servers, 80))\n`,
    hints: [`[s["name"] for s in servers if s["cpu"] > threshold] — list comprehension.`, `Повертай саме НАЗВИ серверів, а не самі словники.`, `def servers_over_threshold(servers, threshold):\n    return [s["name"] for s in servers if s["cpu"] > threshold]\n\nprint(servers_over_threshold(servers, 80))`],
    solution: `servers = [\n    {"name": "web1", "cpu": 85},\n    {"name": "web2", "cpu": 40},\n    {"name": "web3", "cpu": 92},\n]\n\ndef servers_over_threshold(servers, threshold):\n    return [s["name"] for s in servers if s["cpu"] > threshold]\n\nprint(servers_over_threshold(servers, 80))`,
    testCode: `if "servers_over_threshold" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція servers_over_threshold(servers, threshold)."}\nelif servers_over_threshold(servers, 80) != ["web1", "web3"]:\n    __result__ = {"pass": False, "message": "servers_over_threshold(servers, 80) має дати ['web1', 'web3']."}\nelse:\n    __result__ = {"pass": True, "message": "Той самий принцип порогів масштабується з одного сервера на всю інфраструктуру."}`,
  },
  {
    id: "py-devops-7",
    title: "Ротація логів за розміром файлу",
    type: "python",
    theory:
      "Файли логів ростуть НЕСКІНЧЕННО, якщо їх не обмежувати. Ротація логів: коли файл перевищує допустимий розмір, старий вміст перейменовують (з номером), а поточний файл починають ПОРОЖНІМ:\n\nimport os\n\ndef rotate_if_needed(path, max_size):\n    if os.path.getsize(path) > max_size:\n        os.rename(path, path + \".1\")\n        open(path, \"w\").close()\n        return True\n    return False\n\nwith open(\"devops_app.log\", \"w\") as f:\n    f.write(\"x\" * 50)\n\nprint(rotate_if_needed(\"devops_app.log\", 20))\nprint(os.path.exists(\"devops_app.log.1\"))\nprint(os.path.getsize(\"devops_app.log\"))",
    examples: [
      { title: "rotate_if_needed() — ротація великого лога", code: `import os\n\ndef rotate_if_needed(path, max_size):\n    if os.path.getsize(path) > max_size:\n        os.rename(path, path + ".1")\n        open(path, "w").close()\n        return True\n    return False\n\nwith open("devops_app.log", "w") as f:\n    f.write("x" * 50)\n\nprint(rotate_if_needed("devops_app.log", 20))\nprint(os.path.exists("devops_app.log.1"))\nprint(os.path.getsize("devops_app.log"))`, explain: "50-байтний лог перевищує поріг 20 → перейменований у devops_app.log.1, новий devops_app.log — порожній (0 байтів)." },
    ],
    task: `Створи "devops_app.log" з 50 символами "x". Напиши rotate_if_needed(path, max_size). Виклич з max_size=20. Виведи результат, os.path.exists("devops_app.log.1") і новий розмір devops_app.log.`,
    starter: `import os\n\nwith open("devops_app.log", "w") as f:\n    f.write("x" * 50)\n\ndef rotate_if_needed(path, max_size):\n    # твій код тут\n    pass\n\n# print(rotate_if_needed("devops_app.log", 20))\n# print(os.path.exists("devops_app.log.1"))\n# print(os.path.getsize("devops_app.log"))\n`,
    hints: [`os.path.getsize(path) > max_size — перевір розмір ПЕРЕД ротацією.`, `os.rename(path, path + ".1") перейменовує старий файл; open(path, "w").close() створює новий порожній.`, `def rotate_if_needed(path, max_size):\n    if os.path.getsize(path) > max_size:\n        os.rename(path, path + ".1")\n        open(path, "w").close()\n        return True\n    return False`],
    solution: `import os\n\nwith open("devops_app.log", "w") as f:\n    f.write("x" * 50)\n\ndef rotate_if_needed(path, max_size):\n    if os.path.getsize(path) > max_size:\n        os.rename(path, path + ".1")\n        open(path, "w").close()\n        return True\n    return False\n\nprint(rotate_if_needed("devops_app.log", 20))\nprint(os.path.exists("devops_app.log.1"))\nprint(os.path.getsize("devops_app.log"))`,
    testCode: `import os\nif "rotate_if_needed" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція rotate_if_needed(path, max_size)."}\nelif not os.path.exists("devops_app.log.1"):\n    __result__ = {"pass": False, "message": "Файл devops_app.log.1 має бути створений після ротації."}\nelif os.path.getsize("devops_app.log") != 0:\n    __result__ = {"pass": False, "message": "Новий devops_app.log має бути порожнім (0 байтів) після ротації."}\nelse:\n    __result__ = {"pass": True, "message": "Ротація логів запобігає нескінченному росту файлів, зберігаючи стару історію під іншим ім'ям."}`,
  },
  {
    id: "py-devops-8",
    title: "Резервне копіювання файлів",
    type: "python",
    theory:
      "Резервна копія (backup) — знімок файлу на певний момент, збережений ОКРЕМО, щоб можна було відновити дані у випадку помилки чи втрати:\n\nimport os\n\ndef backup_file(path, backup_dir, tag):\n    os.makedirs(backup_dir, exist_ok=True)\n    with open(path) as f:\n        content = f.read()\n    backup_path = f\"{backup_dir}/{os.path.basename(path)}.{tag}.bak\"\n    with open(backup_path, \"w\") as f:\n        f.write(content)\n    return backup_path\n\nwith open(\"devops_data.txt\", \"w\") as f:\n    f.write(\"important data v1\")\n\nresult = backup_file(\"devops_data.txt\", \"devops_backups\", \"v1\")\nprint(result)\nprint(os.path.exists(result))",
    examples: [
      { title: "backup_file() — копія з тегом версії", code: `import os\n\ndef backup_file(path, backup_dir, tag):\n    os.makedirs(backup_dir, exist_ok=True)\n    with open(path) as f:\n        content = f.read()\n    backup_path = f"{backup_dir}/{os.path.basename(path)}.{tag}.bak"\n    with open(backup_path, "w") as f:\n        f.write(content)\n    return backup_path\n\nwith open("devops_data.txt", "w") as f:\n    f.write("important data v1")\n\nresult = backup_file("devops_data.txt", "devops_backups", "v1")\nprint(result)\nprint(os.path.exists(result))`, explain: "backup_file() створює devops_backups/devops_data.txt.v1.bak з тим самим вмістом — оригінал лишається недоторканим." },
    ],
    task: `Створи "devops_data.txt" з вмістом "important data v1". Напиши backup_file(path, backup_dir, tag). Виклич з backup_dir="devops_backups", tag="v1". Виведи шлях і чи файл існує.`,
    starter: `import os\n\nwith open("devops_data.txt", "w") as f:\n    f.write("important data v1")\n\ndef backup_file(path, backup_dir, tag):\n    # твій код тут\n    pass\n\n# result = backup_file("devops_data.txt", "devops_backups", "v1")\n# print(result)\n# print(os.path.exists(result))\n`,
    hints: [`os.makedirs(backup_dir, exist_ok=True) створює директорію, якщо її ще немає.`, `Прочитай оригінальний файл, запиши той самий вміст у backup_dir/os.path.basename(path).tag.bak`, `def backup_file(path, backup_dir, tag):\n    os.makedirs(backup_dir, exist_ok=True)\n    with open(path) as f:\n        content = f.read()\n    backup_path = f"{backup_dir}/{os.path.basename(path)}.{tag}.bak"\n    with open(backup_path, "w") as f:\n        f.write(content)\n    return backup_path`],
    solution: `import os\n\nwith open("devops_data.txt", "w") as f:\n    f.write("important data v1")\n\ndef backup_file(path, backup_dir, tag):\n    os.makedirs(backup_dir, exist_ok=True)\n    with open(path) as f:\n        content = f.read()\n    backup_path = f"{backup_dir}/{os.path.basename(path)}.{tag}.bak"\n    with open(backup_path, "w") as f:\n        f.write(content)\n    return backup_path\n\nresult = backup_file("devops_data.txt", "devops_backups", "v1")\nprint(result)\nprint(os.path.exists(result))`,
    testCode: `import os\nif "backup_file" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція backup_file(path, backup_dir, tag)."}\nelse:\n    result = backup_file("devops_data.txt", "devops_backups", "v1")\n    if not os.path.exists(result):\n        __result__ = {"pass": False, "message": "Файл резервної копії має бути створений."}\n    elif open(result).read() != "important data v1":\n        __result__ = {"pass": False, "message": "Вміст резервної копії має збігатись з оригіналом."}\n    else:\n        __result__ = {"pass": True, "message": "Резервна копія зберігає знімок даних на конкретний момент — основа відновлення після збою."}`,
  },
  {
    id: "py-devops-9",
    title: "Відновлення з найновішої резервної копії",
    type: "python",
    theory:
      "При відновленні зазвичай потрібна НАЙНОВІША резервна копія. Якщо копії зберігаються в порядку створення, найновіша — ОСТАННЯ в списку:\n\ndef restore_latest(backups):\n    return backups[-1][\"content\"]\n\nbackups = [\n    {\"tag\": \"v1\", \"content\": \"data v1\"},\n    {\"tag\": \"v2\", \"content\": \"data v2\"},\n    {\"tag\": \"v3\", \"content\": \"data v3\"},\n]\n\nprint(restore_latest(backups))\n\nУ реальній системі це визначається за timestamp файлу, а не порядком у списку — але сама ІДЕЯ («найновіше замінює все попереднє») та сама.",
    examples: [
      { title: "restore_latest() — остання копія перемагає", code: `def restore_latest(backups):\n    return backups[-1]["content"]\n\nbackups = [\n    {"tag": "v1", "content": "data v1"},\n    {"tag": "v2", "content": "data v2"},\n    {"tag": "v3", "content": "data v3"},\n]\n\nprint(restore_latest(backups))`, explain: "restore_latest(backups) повертає 'data v3' — найновішу з трьох резервних копій." },
    ],
    task: `Дано backups (3 записи у хронологічному порядку). Напиши restore_latest(backups). Виведи результат.`,
    starter: `backups = [\n    {"tag": "v1", "content": "data v1"},\n    {"tag": "v2", "content": "data v2"},\n    {"tag": "v3", "content": "data v3"},\n]\n\ndef restore_latest(backups):\n    # твій код тут\n    pass\n\n# print(restore_latest(backups))\n`,
    hints: [`backups[-1] — останній елемент списку (найновіший).`, `return backups[-1]["content"]`, `def restore_latest(backups):\n    return backups[-1]["content"]\n\nprint(restore_latest(backups))`],
    solution: `backups = [\n    {"tag": "v1", "content": "data v1"},\n    {"tag": "v2", "content": "data v2"},\n    {"tag": "v3", "content": "data v3"},\n]\n\ndef restore_latest(backups):\n    return backups[-1]["content"]\n\nprint(restore_latest(backups))`,
    testCode: `if "restore_latest" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція restore_latest(backups)."}\nelif restore_latest(backups) != "data v3":\n    __result__ = {"pass": False, "message": "restore_latest(backups) має повернути 'data v3'."}\nelse:\n    __result__ = {"pass": True, "message": "Відновлення завжди бере НАЙНОВІШУ копію — найважливіше правило будь-якої системи бекапів."}`,
  },
  {
    id: "py-devops-10",
    title: "Розгортання: послідовність кроків",
    type: "python",
    theory:
      "Розгортання нового коду — це ЧІТКА послідовність кроків (завантажити код, встановити залежності, застосувати міграції бази даних, перезапустити сервіс), кожен з яких логується:\n\ndef deploy(steps):\n    log = []\n    for step in steps:\n        log.append(f\"OK: {step}\")\n    return log\n\nsteps = [\"pull code\", \"install deps\", \"run migrations\", \"restart service\"]\nfor line in deploy(steps):\n    print(line)",
    examples: [
      { title: "deploy() — послідовне виконання кроків", code: `def deploy(steps):\n    log = []\n    for step in steps:\n        log.append(f"OK: {step}")\n    return log\n\nsteps = ["pull code", "install deps", "run migrations", "restart service"]\nfor line in deploy(steps):\n    print(line)`, explain: "Кожен крок логується окремим рядком 'OK: ...' — журнал розгортання, який можна переглянути пізніше." },
    ],
    task: `Дано steps (4 кроки). Напиши deploy(steps), що повертає лог з "OK: " для кожного кроку. Виведи весь лог.`,
    starter: `steps = ["pull code", "install deps", "run migrations", "restart service"]\n\ndef deploy(steps):\n    # твій код тут\n    pass\n\n# for line in deploy(steps):\n#     print(line)\n`,
    hints: [`log = []; для кожного step у steps: log.append(f"OK: {step}")`, `return log наприкінці функції.`, `def deploy(steps):\n    log = []\n    for step in steps:\n        log.append(f"OK: {step}")\n    return log\n\nfor line in deploy(steps):\n    print(line)`],
    solution: `steps = ["pull code", "install deps", "run migrations", "restart service"]\n\ndef deploy(steps):\n    log = []\n    for step in steps:\n        log.append(f"OK: {step}")\n    return log\n\nfor line in deploy(steps):\n    print(line)`,
    testCode: `if "deploy" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція deploy(steps)."}\nelif deploy(steps) != ["OK: pull code", "OK: install deps", "OK: run migrations", "OK: restart service"]:\n    __result__ = {"pass": False, "message": "deploy(steps) має дати список 'OK: ' для кожного з 4 кроків, у тому ж порядку."}\nelse:\n    __result__ = {"pass": True, "message": "Розгортання як послідовність логованих кроків — базова структура будь-якого deploy-скрипта."}`,
  },
  {
    id: "py-devops-11",
    title: "Відкат при невдалому кроці розгортання",
    type: "python",
    theory:
      "Якщо ОДИН крок розгортання провалюється (наприклад, міграція бази даних падає), продовжувати НЕБЕЗПЕЧНО — потрібно ЗУПИНИТИСЬ і почати відкат:\n\ndef deploy_with_rollback(steps):\n    log = []\n    for name, success in steps:\n        if not success:\n            log.append(f\"FAILED: {name}\")\n            log.append(\"ROLLBACK INITIATED\")\n            return log, False\n        log.append(f\"OK: {name}\")\n    log.append(\"DEPLOY SUCCESSFUL\")\n    return log, True\n\nsteps = [(\"pull code\", True), (\"install deps\", True), (\"run migrations\", False), (\"restart service\", True)]\nlog, success = deploy_with_rollback(steps)\nfor line in log:\n    print(line)\nprint(success)\n\nВАЖЛИВО: після невдалого кроку (\"run migrations\") функція ОДРАЗУ повертається — крок \"restart service\" НІКОЛИ не виконується.",
    examples: [
      { title: "deploy_with_rollback() — зупинка при першій невдачі", code: `def deploy_with_rollback(steps):\n    log = []\n    for name, success in steps:\n        if not success:\n            log.append(f"FAILED: {name}")\n            log.append("ROLLBACK INITIATED")\n            return log, False\n        log.append(f"OK: {name}")\n    log.append("DEPLOY SUCCESSFUL")\n    return log, True\n\nsteps = [("pull code", True), ("install deps", True), ("run migrations", False), ("restart service", True)]\nlog, success = deploy_with_rollback(steps)\nfor line in log:\n    print(line)\nprint(success)`, explain: "Лог зупиняється на 'FAILED: run migrations' і 'ROLLBACK INITIATED' — 'restart service' НІКОЛИ не з'являється в логу." },
    ],
    task: `Дано steps (з одним невдалим кроком). Напиши deploy_with_rollback(steps) за логікою вище. Виведи весь лог і success.`,
    starter: `steps = [("pull code", True), ("install deps", True), ("run migrations", False), ("restart service", True)]\n\ndef deploy_with_rollback(steps):\n    # твій код тут\n    pass\n\n# log, success = deploy_with_rollback(steps)\n# for line in log:\n#     print(line)\n# print(success)\n`,
    hints: [`Цикл for name, success in steps: якщо success є False — одразу залогуй FAILED і ROLLBACK, поверни (log, False).`, `Якщо крок вдалий — залогуй "OK: {name}" і продовж цикл; після циклу (усі вдалі) — "DEPLOY SUCCESSFUL", return (log, True).`, `def deploy_with_rollback(steps):\n    log = []\n    for name, success in steps:\n        if not success:\n            log.append(f"FAILED: {name}")\n            log.append("ROLLBACK INITIATED")\n            return log, False\n        log.append(f"OK: {name}")\n    log.append("DEPLOY SUCCESSFUL")\n    return log, True`],
    solution: `steps = [("pull code", True), ("install deps", True), ("run migrations", False), ("restart service", True)]\n\ndef deploy_with_rollback(steps):\n    log = []\n    for name, success in steps:\n        if not success:\n            log.append(f"FAILED: {name}")\n            log.append("ROLLBACK INITIATED")\n            return log, False\n        log.append(f"OK: {name}")\n    log.append("DEPLOY SUCCESSFUL")\n    return log, True\n\nlog, success = deploy_with_rollback(steps)\nfor line in log:\n    print(line)\nprint(success)`,
    testCode: `if "deploy_with_rollback" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція deploy_with_rollback(steps)."}\nelse:\n    log, success = deploy_with_rollback(steps)\n    if success != False:\n        __result__ = {"pass": False, "message": "success має бути False через невдалий крок 'run migrations'."}\n    elif "ROLLBACK INITIATED" not in log:\n        __result__ = {"pass": False, "message": "Лог має містити 'ROLLBACK INITIATED'."}\n    elif any("restart service" in line for line in log):\n        __result__ = {"pass": False, "message": "Крок 'restart service' НЕ мав виконатись після невдачі попереднього кроку."}\n    else:\n        __result__ = {"pass": True, "message": "Зупинка при першій невдачі — критично важливо: продовжувати розгортання після провалу небезпечно."}`,
  },
  {
    id: "py-devops-12",
    title: "Порівняння версій залежностей",
    type: "python",
    theory:
      "Перед оновленням залежності треба знати, чи НОВА версія дійсно новіша за поточну. Версії у форматі major.minor.patch порівнюються ПОКОМПОНЕНТНО, а не як рядки (\"2.10.0\" > \"2.9.0\", хоча рядково \"2.9.0\" > \"2.10.0\"!):\n\ndef parse_version(v):\n    return tuple(int(x) for x in v.split(\".\"))\n\ndef is_newer(v1, v2):\n    return parse_version(v1) > parse_version(v2)\n\nprint(is_newer(\"2.1.0\", \"2.0.9\"))\nprint(is_newer(\"1.9.9\", \"2.0.0\"))\n\ntuple(int(x) for x in v.split(\".\")) перетворює \"2.10.0\" на (2, 10, 0) — кортежі порівнюються ЕЛЕМЕНТ ЗА ЕЛЕМЕНТОМ, тому 10 коректно більше за 9.",
    examples: [
      { title: "is_newer() — правильне порівняння версій", code: `def parse_version(v):\n    return tuple(int(x) for x in v.split("."))\n\ndef is_newer(v1, v2):\n    return parse_version(v1) > parse_version(v2)\n\nprint(is_newer("2.1.0", "2.0.9"))\nprint(is_newer("1.9.9", "2.0.0"))\nprint(is_newer("2.10.0", "2.9.0"))`, explain: "is_newer('2.10.0', '2.9.0') правильно дає True — порівняння як РЯДКІВ дало б хибне False." },
    ],
    task: `Напиши parse_version(v) і is_newer(v1, v2). Виведи is_newer("2.1.0", "2.0.9") і is_newer("1.9.9", "2.0.0").`,
    starter: `def parse_version(v):\n    # твій код тут\n    pass\n\ndef is_newer(v1, v2):\n    # твій код тут\n    pass\n\n# print(is_newer("2.1.0", "2.0.9"))\n# print(is_newer("1.9.9", "2.0.0"))\n`,
    hints: [`parse_version: return tuple(int(x) for x in v.split("."))`, `is_newer: return parse_version(v1) > parse_version(v2)`, `def parse_version(v):\n    return tuple(int(x) for x in v.split("."))\n\ndef is_newer(v1, v2):\n    return parse_version(v1) > parse_version(v2)`],
    solution: `def parse_version(v):\n    return tuple(int(x) for x in v.split("."))\n\ndef is_newer(v1, v2):\n    return parse_version(v1) > parse_version(v2)\n\nprint(is_newer("2.1.0", "2.0.9"))\nprint(is_newer("1.9.9", "2.0.0"))`,
    testCode: `if "is_newer" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція is_newer(v1, v2)."}\nelif is_newer("2.1.0", "2.0.9") != True:\n    __result__ = {"pass": False, "message": "is_newer('2.1.0', '2.0.9') має бути True."}\nelif is_newer("1.9.9", "2.0.0") != False:\n    __result__ = {"pass": False, "message": "is_newer('1.9.9', '2.0.0') має бути False."}\nelif is_newer("2.10.0", "2.9.0") != True:\n    __result__ = {"pass": False, "message": "is_newer('2.10.0', '2.9.0') має бути True — порівняння ЧИСЕЛ, а не рядків."}\nelse:\n    __result__ = {"pass": True, "message": "Покомпонентне порівняння версій уникає класичної пастки з рядковим порівнянням чисел."}`,
  },
  {
    id: "py-devops-13",
    title: "Валідація конфігурації перед запуском",
    type: "python",
    theory:
      "Сервер, що запускається з НЕПОВНОЮ конфігурацією, може впасти в найгірший момент — краще перевірити ВСІ обов'язкові ключі ще ДО запуску:\n\nREQUIRED_KEYS = [\"host\", \"port\", \"debug\"]\n\ndef validate_config(config):\n    missing = [key for key in REQUIRED_KEYS if key not in config]\n    return len(missing) == 0, missing\n\nfull_config = {\"host\": \"example.com\", \"port\": \"8080\", \"debug\": \"false\"}\nbroken_config = {\"host\": \"example.com\"}\n\nprint(validate_config(full_config))\nprint(validate_config(broken_config))",
    examples: [
      { title: "validate_config() — перевірка обов'язкових ключів", code: `REQUIRED_KEYS = ["host", "port", "debug"]\n\ndef validate_config(config):\n    missing = [key for key in REQUIRED_KEYS if key not in config]\n    return len(missing) == 0, missing\n\nfull_config = {"host": "example.com", "port": "8080", "debug": "false"}\nbroken_config = {"host": "example.com"}\n\nprint(validate_config(full_config))\nprint(validate_config(broken_config))`, explain: "full_config → (True, []); broken_config → (False, ['port', 'debug']) — точно вказує, ЧОГО бракує." },
    ],
    task: `Дано REQUIRED_KEYS, full_config, broken_config. Напиши validate_config(config). Виведи результат для обох конфігурацій.`,
    starter: `REQUIRED_KEYS = ["host", "port", "debug"]\nfull_config = {"host": "example.com", "port": "8080", "debug": "false"}\nbroken_config = {"host": "example.com"}\n\ndef validate_config(config):\n    # твій код тут\n    pass\n\n# print(validate_config(full_config))\n# print(validate_config(broken_config))\n`,
    hints: [`missing = [key for key in REQUIRED_KEYS if key not in config]`, `return len(missing) == 0, missing — кортеж (валідно?, список відсутніх).`, `def validate_config(config):\n    missing = [key for key in REQUIRED_KEYS if key not in config]\n    return len(missing) == 0, missing`],
    solution: `REQUIRED_KEYS = ["host", "port", "debug"]\nfull_config = {"host": "example.com", "port": "8080", "debug": "false"}\nbroken_config = {"host": "example.com"}\n\ndef validate_config(config):\n    missing = [key for key in REQUIRED_KEYS if key not in config]\n    return len(missing) == 0, missing\n\nprint(validate_config(full_config))\nprint(validate_config(broken_config))`,
    testCode: `if "validate_config" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція validate_config(config)."}\nelif validate_config(full_config) != (True, []):\n    __result__ = {"pass": False, "message": "validate_config(full_config) має дати (True, [])."}\nelif validate_config(broken_config) != (False, ["port", "debug"]):\n    __result__ = {"pass": False, "message": "validate_config(broken_config) має дати (False, ['port', 'debug'])."}\nelse:\n    __result__ = {"pass": True, "message": "Валідація конфігурації ДО запуску виявляє проблему одразу, а не в найгірший момент у продакшні."}`,
  },
  {
    id: "py-devops-14",
    title: "Планувальник задач за інтервалом",
    type: "python",
    theory:
      "Реальні сервери виконують задачі ПЕРІОДИЧНО (резервне копіювання щоночі, health check щохвилини) — плановане, а не одноразове виконання. Проста модель: задача виконується кожні N \"тіків\" часу:\n\ndef run_scheduled_tasks(tasks, ticks):\n    results = []\n    for tick in range(1, ticks + 1):\n        for task in tasks:\n            if tick % task[\"interval\"] == 0:\n                results.append(f\"tick {tick}: {task['name']}\")\n    return results\n\ntasks = [{\"name\": \"backup\", \"interval\": 3}, {\"name\": \"healthcheck\", \"interval\": 2}]\nfor line in run_scheduled_tasks(tasks, 6):\n    print(line)\n\ntick % interval == 0 означає «настав час для цієї задачі знову» — на tick=6 виконуються ОБИДВІ задачі (6 ділиться і на 3, і на 2).",
    examples: [
      { title: "run_scheduled_tasks() — задачі за розкладом", code: `def run_scheduled_tasks(tasks, ticks):\n    results = []\n    for tick in range(1, ticks + 1):\n        for task in tasks:\n            if tick % task["interval"] == 0:\n                results.append(f"tick {tick}: {task['name']}")\n    return results\n\ntasks = [{"name": "backup", "interval": 3}, {"name": "healthcheck", "interval": 2}]\nfor line in run_scheduled_tasks(tasks, 6):\n    print(line)`, explain: "healthcheck запускається на тіках 2, 4, 6 (кожні 2), backup — на 3, 6 (кожні 3); на tick=6 виконуються обидві." },
    ],
    task: `Дано tasks. Напиши run_scheduled_tasks(tasks, ticks). Виклич з ticks=6. Виведи весь результат.`,
    starter: `tasks = [{"name": "backup", "interval": 3}, {"name": "healthcheck", "interval": 2}]\n\ndef run_scheduled_tasks(tasks, ticks):\n    # твій код тут\n    pass\n\n# for line in run_scheduled_tasks(tasks, 6):\n#     print(line)\n`,
    hints: [`Зовнішній цикл for tick in range(1, ticks + 1):, внутрішній for task in tasks:`, `if tick % task["interval"] == 0: додай f"tick {tick}: {task['name']}" у results.`, `def run_scheduled_tasks(tasks, ticks):\n    results = []\n    for tick in range(1, ticks + 1):\n        for task in tasks:\n            if tick % task["interval"] == 0:\n                results.append(f"tick {tick}: {task['name']}")\n    return results`],
    solution: `tasks = [{"name": "backup", "interval": 3}, {"name": "healthcheck", "interval": 2}]\n\ndef run_scheduled_tasks(tasks, ticks):\n    results = []\n    for tick in range(1, ticks + 1):\n        for task in tasks:\n            if tick % task["interval"] == 0:\n                results.append(f"tick {tick}: {task['name']}")\n    return results\n\nfor line in run_scheduled_tasks(tasks, 6):\n    print(line)`,
    testCode: `if "run_scheduled_tasks" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція run_scheduled_tasks(tasks, ticks)."}\nelif run_scheduled_tasks(tasks, 6) != ["tick 2: healthcheck", "tick 3: backup", "tick 4: healthcheck", "tick 6: backup", "tick 6: healthcheck"]:\n    __result__ = {"pass": False, "message": "run_scheduled_tasks(tasks, 6) не дав очікувану послідовність тіків."}\nelse:\n    __result__ = {"pass": True, "message": "Планувальник за інтервалом — база будь-якої системи типу cron: періодичне виконання без нагадувань вручну."}`,
  },
  {
    id: "py-devops-15",
    title: "Graceful shutdown: обробники завершення",
    type: "python",
    theory:
      "Коли сервер зупиняється, важливо ЗАВЕРШИТИ роботу акуратно (graceful shutdown): закрити з'єднання, зберегти стан, звільнити ресурси. Реєстрація функцій очищення дозволяє викликати ЇХ УСІ в ПРАВИЛЬНОМУ порядку (у зворотному до реєстрації — LIFO):\n\ncleanup_registry = []\n\ndef register_cleanup(fn):\n    cleanup_registry.append(fn)\n\ndef shutdown():\n    for fn in reversed(cleanup_registry):\n        fn()\n\norder = []\nregister_cleanup(lambda: order.append(\"close database\"))\nregister_cleanup(lambda: order.append(\"close cache\"))\n\nshutdown()\nprint(order)\n\nreversed(cleanup_registry) гарантує порядок LIFO (Last In, First Out) — ресурс, підключений ОСТАННІМ, закривається ПЕРШИМ, що уникає залежностей, зламаних невчасно.",
    examples: [
      { title: "shutdown() — очищення у зворотному порядку", code: `cleanup_registry = []\n\ndef register_cleanup(fn):\n    cleanup_registry.append(fn)\n\ndef shutdown():\n    for fn in reversed(cleanup_registry):\n        fn()\n\norder = []\nregister_cleanup(lambda: order.append("close database"))\nregister_cleanup(lambda: order.append("close cache"))\n\nshutdown()\nprint(order)`, explain: "order = ['close cache', 'close database'] — кеш (підключений останнім) закривається ПЕРШИМ." },
    ],
    task: `Напиши register_cleanup(fn) і shutdown(). Зареєструй дві функції очищення (додавання в order) і виклич shutdown(). Виведи order.`,
    starter: `cleanup_registry = []\norder = []\n\ndef register_cleanup(fn):\n    # твій код тут\n    pass\n\ndef shutdown():\n    # твій код тут\n    pass\n\n# register_cleanup(lambda: order.append("close database"))\n# register_cleanup(lambda: order.append("close cache"))\n\n# shutdown()\n# print(order)\n`,
    hints: [`register_cleanup: cleanup_registry.append(fn)`, `shutdown: for fn in reversed(cleanup_registry): fn()`, `def register_cleanup(fn):\n    cleanup_registry.append(fn)\n\ndef shutdown():\n    for fn in reversed(cleanup_registry):\n        fn()`],
    solution: `cleanup_registry = []\norder = []\n\ndef register_cleanup(fn):\n    cleanup_registry.append(fn)\n\ndef shutdown():\n    for fn in reversed(cleanup_registry):\n        fn()\n\nregister_cleanup(lambda: order.append("close database"))\nregister_cleanup(lambda: order.append("close cache"))\n\nshutdown()\nprint(order)`,
    testCode: `if "register_cleanup" not in globals() or "shutdown" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні функції register_cleanup(fn) і shutdown()."}\nelif order != ["close cache", "close database"]:\n    __result__ = {"pass": False, "message": "order має бути ['close cache', 'close database'] — зворотний порядок (LIFO)."}\nelse:\n    __result__ = {"pass": True, "message": "LIFO-порядок очищення — ресурс, підключений останнім, звільняється першим, уникаючи поламаних залежностей."}`,
  },
  {
    id: "py-devops-16",
    title: "Перевірка вільного місця на диску",
    type: "python",
    theory:
      "Диск, що заповнюється, — одна з найпоширеніших причин падіння серверів. Перевірка відсотка використання дозволяє попередити ДО того, як місце закінчиться повністю:\n\ndef disk_usage_percent(disk):\n    return disk[\"used_gb\"] / disk[\"total_gb\"] * 100\n\ndef is_disk_critical(disk, threshold=90):\n    return disk_usage_percent(disk) >= threshold\n\ndisk = {\"used_gb\": 450, \"total_gb\": 500}\nprint(disk_usage_percent(disk))\nprint(is_disk_critical(disk))\n\n450 з 500 ГБ — рівно 90% використання, що ДОСЯГАЄ порогу (>=), а не просто наближається до нього.",
    examples: [
      { title: "disk_usage_percent() і is_disk_critical()", code: `def disk_usage_percent(disk):\n    return disk["used_gb"] / disk["total_gb"] * 100\n\ndef is_disk_critical(disk, threshold=90):\n    return disk_usage_percent(disk) >= threshold\n\ndisk = {"used_gb": 450, "total_gb": 500}\nprint(disk_usage_percent(disk))\nprint(is_disk_critical(disk))`, explain: "90.0% використання точно ДОРІВНЮЄ порогу 90 — is_disk_critical() коректно повертає True завдяки >= (не просто >)." },
    ],
    task: `Дано disk. Напиши disk_usage_percent(disk) і is_disk_critical(disk, threshold=90). Виведи обидва результати.`,
    starter: `disk = {"used_gb": 450, "total_gb": 500}\n\ndef disk_usage_percent(disk):\n    # твій код тут\n    pass\n\ndef is_disk_critical(disk, threshold=90):\n    # твій код тут\n    pass\n\n# print(disk_usage_percent(disk))\n# print(is_disk_critical(disk))\n`,
    hints: [`disk_usage_percent: return disk["used_gb"] / disk["total_gb"] * 100`, `is_disk_critical: return disk_usage_percent(disk) >= threshold`, `def disk_usage_percent(disk):\n    return disk["used_gb"] / disk["total_gb"] * 100\n\ndef is_disk_critical(disk, threshold=90):\n    return disk_usage_percent(disk) >= threshold`],
    solution: `disk = {"used_gb": 450, "total_gb": 500}\n\ndef disk_usage_percent(disk):\n    return disk["used_gb"] / disk["total_gb"] * 100\n\ndef is_disk_critical(disk, threshold=90):\n    return disk_usage_percent(disk) >= threshold\n\nprint(disk_usage_percent(disk))\nprint(is_disk_critical(disk))`,
    testCode: `if "disk_usage_percent" not in globals() or "is_disk_critical" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні функції disk_usage_percent(disk) і is_disk_critical(disk, threshold=90)."}\nelif disk_usage_percent(disk) != 90.0:\n    __result__ = {"pass": False, "message": "disk_usage_percent(disk) для 450/500 має дати 90.0."}\nelif is_disk_critical(disk) != True:\n    __result__ = {"pass": False, "message": "is_disk_critical(disk) при рівно 90% і порозі 90 має бути True (>=, а не лише >)."}\nelse:\n    __result__ = {"pass": True, "message": "Перевірка вільного місця ДО того, як диск заповниться повністю, — запобігає одному з найпоширеніших збоїв серверів."}`,
  },
  {
    id: "py-devops-17",
    title: "Об'єднання журналів моніторингу й розгортання",
    type: "python",
    theory:
      "Реальні операційні події приходять з РІЗНИХ джерел (моніторинг, розгортання) у РІЗНИЙ час — для розслідування інциденту їх об'єднують в ОДИН хронологічний журнал:\n\ndef merge_logs(*logs):\n    combined = [event for log in logs for event in log]\n    return sorted(combined, key=lambda e: e[\"time\"])\n\nmonitoring = [{\"time\": 3, \"msg\": \"cpu high\"}]\ndeploy_log = [{\"time\": 1, \"msg\": \"deploy started\"}, {\"time\": 2, \"msg\": \"deploy finished\"}]\n\nfor event in merge_logs(monitoring, deploy_log):\n    print(event[\"time\"], event[\"msg\"])\n\n*logs (з зірочкою) приймає БУДЬ-ЯКУ кількість списків журналів — merge_logs(a, b, c) працює так само, як merge_logs(a, b).",
    examples: [
      { title: "merge_logs() — хронологічне об'єднання подій", code: `def merge_logs(*logs):\n    combined = [event for log in logs for event in log]\n    return sorted(combined, key=lambda e: e["time"])\n\nmonitoring = [{"time": 3, "msg": "cpu high"}]\ndeploy_log = [{"time": 1, "msg": "deploy started"}, {"time": 2, "msg": "deploy finished"}]\n\nfor event in merge_logs(monitoring, deploy_log):\n    print(event["time"], event["msg"])`, explain: "Події з ДВОХ різних журналів з'являються в ЄДИНІЙ хронологічній послідовності: 1, 2, 3." },
    ],
    task: `Дано monitoring, deploy_log. Напиши merge_logs(*logs). Виведи об'єднаний, відсортований за часом журнал.`,
    starter: `monitoring = [{"time": 3, "msg": "cpu high"}]\ndeploy_log = [{"time": 1, "msg": "deploy started"}, {"time": 2, "msg": "deploy finished"}]\n\ndef merge_logs(*logs):\n    # твій код тут\n    pass\n\n# for event in merge_logs(monitoring, deploy_log):\n#     print(event["time"], event["msg"])\n`,
    hints: [`combined = [event for log in logs for event in log] — «сплющує» всі списки в один.`, `sorted(combined, key=lambda e: e["time"]) сортує за часом.`, `def merge_logs(*logs):\n    combined = [event for log in logs for event in log]\n    return sorted(combined, key=lambda e: e["time"])`],
    solution: `monitoring = [{"time": 3, "msg": "cpu high"}]\ndeploy_log = [{"time": 1, "msg": "deploy started"}, {"time": 2, "msg": "deploy finished"}]\n\ndef merge_logs(*logs):\n    combined = [event for log in logs for event in log]\n    return sorted(combined, key=lambda e: e["time"])\n\nfor event in merge_logs(monitoring, deploy_log):\n    print(event["time"], event["msg"])`,
    testCode: `if "merge_logs" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція merge_logs(*logs)."}\nelse:\n    merged = merge_logs(monitoring, deploy_log)\n    times = [e["time"] for e in merged]\n    if times != [1, 2, 3]:\n        __result__ = {"pass": False, "message": "Об'єднаний журнал має бути відсортований за часом: [1, 2, 3]."}\n    elif len(merged) != 3:\n        __result__ = {"pass": False, "message": "Об'єднаний журнал має містити всі 3 події з обох джерел."}\n    else:\n        __result__ = {"pass": True, "message": "Хронологічне об'єднання журналів з різних джерел критично важливе для розслідування інцидентів."}`,
  },
  {
    id: "py-devops-18",
    title: "Проста автоматична масштабованість",
    type: "python",
    theory:
      "Автоматичне масштабування (autoscaling) додає сервери, коли навантаження ВИСОКЕ, і прибирає, коли навантаження НИЗЬКЕ (заощаджуючи гроші), ніколи не опускаючись нижче 1 сервера:\n\ndef autoscale(current_servers, load_percent, scale_up=80, scale_down=20):\n    if load_percent > scale_up:\n        return current_servers + 1\n    elif load_percent < scale_down and current_servers > 1:\n        return current_servers - 1\n    return current_servers\n\nprint(autoscale(3, 85))\nprint(autoscale(3, 10))\nprint(autoscale(1, 10))\n\nОстанній приклад (1 сервер, низьке навантаження) НЕ зменшує кількість нижче 1 — має завжди лишатись ХОЧА Б один сервер онлайн.",
    examples: [
      { title: "autoscale() — правило масштабування", code: `def autoscale(current_servers, load_percent, scale_up=80, scale_down=20):\n    if load_percent > scale_up:\n        return current_servers + 1\n    elif load_percent < scale_down and current_servers > 1:\n        return current_servers - 1\n    return current_servers\n\nprint(autoscale(3, 85))\nprint(autoscale(3, 10))\nprint(autoscale(1, 10))`, explain: "85% навантаження → 4 сервери (масштабування вгору); 10% при 3 серверах → 2 (вниз); 10% при 1 сервері → залишається 1 (мінімум)." },
    ],
    task: `Напиши autoscale(current_servers, load_percent, scale_up=80, scale_down=20). Виведи autoscale(3, 85), autoscale(3, 10) і autoscale(1, 10).`,
    starter: `def autoscale(current_servers, load_percent, scale_up=80, scale_down=20):\n    # твій код тут\n    pass\n\n# print(autoscale(3, 85))\n# print(autoscale(3, 10))\n# print(autoscale(1, 10))\n`,
    hints: [`if load_percent > scale_up: return current_servers + 1`, `elif load_percent < scale_down and current_servers > 1: return current_servers - 1; інакше return current_servers`, `def autoscale(current_servers, load_percent, scale_up=80, scale_down=20):\n    if load_percent > scale_up:\n        return current_servers + 1\n    elif load_percent < scale_down and current_servers > 1:\n        return current_servers - 1\n    return current_servers`],
    solution: `def autoscale(current_servers, load_percent, scale_up=80, scale_down=20):\n    if load_percent > scale_up:\n        return current_servers + 1\n    elif load_percent < scale_down and current_servers > 1:\n        return current_servers - 1\n    return current_servers\n\nprint(autoscale(3, 85))\nprint(autoscale(3, 10))\nprint(autoscale(1, 10))`,
    testCode: `if "autoscale" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція autoscale(current_servers, load_percent, scale_up=80, scale_down=20)."}\nelif autoscale(3, 85) != 4:\n    __result__ = {"pass": False, "message": "autoscale(3, 85) має дати 4 (масштабування вгору)."}\nelif autoscale(3, 10) != 2:\n    __result__ = {"pass": False, "message": "autoscale(3, 10) має дати 2 (масштабування вниз)."}\nelif autoscale(1, 10) != 1:\n    __result__ = {"pass": False, "message": "autoscale(1, 10) має ЗАЛИШИТИСЬ 1 — не можна опускатись нижче мінімуму."}\nelse:\n    __result__ = {"pass": True, "message": "Автоматичне масштабування балансує вартість і надійність, ніколи не опускаючись до нуля серверів."}`,
  },
  {
    id: "py-devops-19",
    title: "Повний health-check pipeline для кількох серверів",
    type: "python",
    theory:
      "Об'єднай is_healthy() з обробкою СПИСКУ серверів в один pipeline, що перевіряє КОЖЕН сервер і формує читабельний звіт:\n\ndef run_health_pipeline(servers):\n    report = []\n    for s in servers:\n        healthy = is_healthy(s)\n        report.append({\"name\": s[\"name\"], \"healthy\": healthy})\n    return report\n\nservers = [\n    {\"name\": \"web1\", \"status_code\": 200, \"latency_ms\": 45},\n    {\"name\": \"web2\", \"status_code\": 500, \"latency_ms\": 900},\n]\n\nfor entry in run_health_pipeline(servers):\n    print(entry[\"name\"], entry[\"healthy\"])",
    examples: [
      { title: "run_health_pipeline() — перевірка всіх серверів", code: `def is_healthy(response):\n    return response["status_code"] == 200 and response["latency_ms"] < 500\n\ndef run_health_pipeline(servers):\n    report = []\n    for s in servers:\n        healthy = is_healthy(s)\n        report.append({"name": s["name"], "healthy": healthy})\n    return report\n\nservers = [\n    {"name": "web1", "status_code": 200, "latency_ms": 45},\n    {"name": "web2", "status_code": 500, "latency_ms": 900},\n]\n\nfor entry in run_health_pipeline(servers):\n    print(entry["name"], entry["healthy"])`, explain: "web1 healthy=True, web2 healthy=False — один виклик перевіряє ВСІ сервери одразу." },
    ],
    task: `Дано is_healthy(), servers (в starter). Напиши run_health_pipeline(servers). Виведи ім'я й стан кожного сервера.`,
    starter: `def is_healthy(response):\n    return response["status_code"] == 200 and response["latency_ms"] < 500\n\nservers = [\n    {"name": "web1", "status_code": 200, "latency_ms": 45},\n    {"name": "web2", "status_code": 500, "latency_ms": 900},\n]\n\ndef run_health_pipeline(servers):\n    # твій код тут\n    pass\n\n# for entry in run_health_pipeline(servers):\n#     print(entry["name"], entry["healthy"])\n`,
    hints: [`Для кожного s у servers: healthy = is_healthy(s)`, `report.append({"name": s["name"], "healthy": healthy})`, `def run_health_pipeline(servers):\n    report = []\n    for s in servers:\n        healthy = is_healthy(s)\n        report.append({"name": s["name"], "healthy": healthy})\n    return report`],
    solution: `def is_healthy(response):\n    return response["status_code"] == 200 and response["latency_ms"] < 500\n\nservers = [\n    {"name": "web1", "status_code": 200, "latency_ms": 45},\n    {"name": "web2", "status_code": 500, "latency_ms": 900},\n]\n\ndef run_health_pipeline(servers):\n    report = []\n    for s in servers:\n        healthy = is_healthy(s)\n        report.append({"name": s["name"], "healthy": healthy})\n    return report\n\nfor entry in run_health_pipeline(servers):\n    print(entry["name"], entry["healthy"])`,
    testCode: `if "run_health_pipeline" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція run_health_pipeline(servers)."}\nelse:\n    report = run_health_pipeline(servers)\n    if report != [{"name": "web1", "healthy": True}, {"name": "web2", "healthy": False}]:\n        __result__ = {"pass": False, "message": "report має показати web1 healthy=True, web2 healthy=False."}\n    else:\n        __result__ = {"pass": True, "message": "Pipeline перевіряє ВСІ сервери одним викликом — саме так реальні системи моніторингу опитують інфраструктуру."}`,
  },
  {
    id: "py-devops-20",
    title: "Фінальний проєкт: інструментарій адміністрування сервера",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків у server_ops_toolkit.py: валідація конфігурації, health-check pipeline для всіх серверів, резервне копіювання й розгортання з відкатом. Це і є інструментарій, обіцяний ще на вступній сторінці «Що це?».\n\nСаме ці принципи — конфігурація окремо від коду, пороги для алертів, ротація логів, безпечне розгортання з відкатом — лежать в основі Ansible, Kubernetes і будь-якої серйозної DevOps-платформи.",
    examples: [
      { title: "Повний операційний цикл", code: `def run_ops_cycle(config, servers, deploy_steps):\n    valid, missing = validate_config(config)\n    if not valid:\n        return {"status": "aborted", "reason": f"missing config: {missing}"}\n\n    health = run_health_pipeline(servers)\n    unhealthy = [h["name"] for h in health if not h["healthy"]]\n\n    log, deploy_success = deploy_with_rollback(deploy_steps)\n\n    return {"status": "ok" if deploy_success else "rolled_back", "unhealthy": unhealthy, "deploy_log": log}\n\nprint(run_ops_cycle(full_config, servers, steps))`, explain: "Один виклик об'єднує валідацію, моніторинг і розгортання — саме так виглядає реальний скрипт CI/CD." },
    ],
    task: `Дано validate_config(), run_health_pipeline(), deploy_with_rollback(), full_config, servers, steps (усе в starter). Напиши run_ops_cycle(config, servers, deploy_steps), що повертає словник {"status", "unhealthy", "deploy_log"} за логікою вище (якщо конфігурація невалідна — {"status": "aborted", "reason": ...}). Виведи результат для full_config, servers (обидва здорові), steps (усі успішні).`,
    starter: `REQUIRED_KEYS = ["host", "port", "debug"]\nfull_config = {"host": "example.com", "port": "8080", "debug": "false"}\n\ndef validate_config(config):\n    missing = [key for key in REQUIRED_KEYS if key not in config]\n    return len(missing) == 0, missing\n\ndef is_healthy(response):\n    return response["status_code"] == 200 and response["latency_ms"] < 500\n\nservers = [\n    {"name": "web1", "status_code": 200, "latency_ms": 45},\n    {"name": "web2", "status_code": 200, "latency_ms": 60},\n]\n\ndef run_health_pipeline(servers):\n    report = []\n    for s in servers:\n        healthy = is_healthy(s)\n        report.append({"name": s["name"], "healthy": healthy})\n    return report\n\nsteps = [("pull code", True), ("install deps", True), ("restart service", True)]\n\ndef deploy_with_rollback(steps):\n    log = []\n    for name, success in steps:\n        if not success:\n            log.append(f"FAILED: {name}")\n            log.append("ROLLBACK INITIATED")\n            return log, False\n        log.append(f"OK: {name}")\n    log.append("DEPLOY SUCCESSFUL")\n    return log, True\n\ndef run_ops_cycle(config, servers, deploy_steps):\n    # твій код тут\n    pass\n\n# print(run_ops_cycle(full_config, servers, steps))\n`,
    hints: [`Спочатку valid, missing = validate_config(config); якщо not valid — поверни {"status": "aborted", "reason": f"missing config: {missing}"}`, `health = run_health_pipeline(servers); unhealthy = [h["name"] for h in health if not h["healthy"]]; log, deploy_success = deploy_with_rollback(deploy_steps)`, `def run_ops_cycle(config, servers, deploy_steps):\n    valid, missing = validate_config(config)\n    if not valid:\n        return {"status": "aborted", "reason": f"missing config: {missing}"}\n    health = run_health_pipeline(servers)\n    unhealthy = [h["name"] for h in health if not h["healthy"]]\n    log, deploy_success = deploy_with_rollback(deploy_steps)\n    return {"status": "ok" if deploy_success else "rolled_back", "unhealthy": unhealthy, "deploy_log": log}`],
    solution: `REQUIRED_KEYS = ["host", "port", "debug"]\nfull_config = {"host": "example.com", "port": "8080", "debug": "false"}\n\ndef validate_config(config):\n    missing = [key for key in REQUIRED_KEYS if key not in config]\n    return len(missing) == 0, missing\n\ndef is_healthy(response):\n    return response["status_code"] == 200 and response["latency_ms"] < 500\n\nservers = [\n    {"name": "web1", "status_code": 200, "latency_ms": 45},\n    {"name": "web2", "status_code": 200, "latency_ms": 60},\n]\n\ndef run_health_pipeline(servers):\n    report = []\n    for s in servers:\n        healthy = is_healthy(s)\n        report.append({"name": s["name"], "healthy": healthy})\n    return report\n\nsteps = [("pull code", True), ("install deps", True), ("restart service", True)]\n\ndef deploy_with_rollback(steps):\n    log = []\n    for name, success in steps:\n        if not success:\n            log.append(f"FAILED: {name}")\n            log.append("ROLLBACK INITIATED")\n            return log, False\n        log.append(f"OK: {name}")\n    log.append("DEPLOY SUCCESSFUL")\n    return log, True\n\ndef run_ops_cycle(config, servers, deploy_steps):\n    valid, missing = validate_config(config)\n    if not valid:\n        return {"status": "aborted", "reason": f"missing config: {missing}"}\n    health = run_health_pipeline(servers)\n    unhealthy = [h["name"] for h in health if not h["healthy"]]\n    log, deploy_success = deploy_with_rollback(deploy_steps)\n    return {"status": "ok" if deploy_success else "rolled_back", "unhealthy": unhealthy, "deploy_log": log}\n\nprint(run_ops_cycle(full_config, servers, steps))`,
    testCode: `if "run_ops_cycle" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція run_ops_cycle(config, servers, deploy_steps)."}\nelse:\n    result = run_ops_cycle(full_config, servers, steps)\n    if result.get("status") != "ok":\n        __result__ = {"pass": False, "message": "result['status'] має бути 'ok' для валідної конфігурації, здорових серверів і успішного розгортання."}\n    elif result.get("unhealthy") != []:\n        __result__ = {"pass": False, "message": "result['unhealthy'] має бути порожнім списком (обидва сервери здорові)."}\n    elif "DEPLOY SUCCESSFUL" not in result.get("deploy_log", []):\n        __result__ = {"pass": False, "message": "result['deploy_log'] має закінчуватись 'DEPLOY SUCCESSFUL'."}\n    else:\n        __result__ = {"pass": True, "message": "Готово! Валідація, моніторинг і розгортання разом — той самий цикл, що виконує будь-який реальний CI/CD-скрипт."}`,
    finalProject: {
      techs: ["Python 3", "os", "list/dict comprehension"],
      skills: [
        "Конфігурація серверів через файли й змінні середовища",
        "Health check і моніторинг ресурсів з пороговими алертами",
        "Ротація логів і резервне копіювання файлів",
        "Безпечне розгортання з автоматичним відкатом при невдачі",
        "Планування задач за інтервалом і graceful shutdown",
        "Автоматичне масштабування за навантаженням",
      ],
      structure:
        "server_ops_toolkit.py\n  ├── validate_config(config)          # перевірка перед запуском\n  ├── run_health_pipeline(servers)      # моніторинг усієї інфраструктури\n  ├── backup_file(...) / restore_latest(...)  # резервні копії\n  ├── deploy_with_rollback(steps)         # безпечне розгортання\n  └── run_ops_cycle(...)                    # весь цикл разом",
      code: `import os


REQUIRED_KEYS = ["host", "port", "debug"]


def validate_config(config):
    missing = [key for key in REQUIRED_KEYS if key not in config]
    return len(missing) == 0, missing


def is_healthy(response):
    return response["status_code"] == 200 and response["latency_ms"] < 500


def run_health_pipeline(servers):
    return [{"name": s["name"], "healthy": is_healthy(s)} for s in servers]


def check_thresholds(metrics, thresholds):
    return [key for key in metrics if metrics[key] > thresholds[key]]


def backup_file(path, backup_dir, tag):
    os.makedirs(backup_dir, exist_ok=True)
    with open(path) as f:
        content = f.read()
    backup_path = f"{backup_dir}/{os.path.basename(path)}.{tag}.bak"
    with open(backup_path, "w") as f:
        f.write(content)
    return backup_path


def deploy_with_rollback(steps):
    log = []
    for name, success in steps:
        if not success:
            log.append(f"FAILED: {name}")
            log.append("ROLLBACK INITIATED")
            return log, False
        log.append(f"OK: {name}")
    log.append("DEPLOY SUCCESSFUL")
    return log, True


def run_ops_cycle(config, servers, metrics, thresholds, deploy_steps):
    valid, missing = validate_config(config)
    if not valid:
        return {"status": "aborted", "reason": f"missing config: {missing}"}

    health = run_health_pipeline(servers)
    unhealthy = [h["name"] for h in health if not h["healthy"]]
    over_threshold = check_thresholds(metrics, thresholds)

    log, deploy_success = deploy_with_rollback(deploy_steps)

    return {
        "status": "ok" if deploy_success else "rolled_back",
        "unhealthy": unhealthy,
        "alerts": over_threshold,
        "deploy_log": log,
    }


if __name__ == "__main__":
    config = {"host": "example.com", "port": "8080", "debug": "false"}
    servers = [
        {"name": "web1", "status_code": 200, "latency_ms": 45},
        {"name": "web2", "status_code": 200, "latency_ms": 60},
    ]
    metrics = {"cpu": 55, "memory": 70}
    thresholds = {"cpu": 80, "memory": 90}
    steps = [("pull code", True), ("install deps", True), ("restart service", True)]

    result = run_ops_cycle(config, servers, metrics, thresholds, steps)
    print(result)

    backup_path = backup_file(__file__, "backups", "v1")
    print("Backed up config to:", backup_path)`,
      runCommand: "python server_ops_toolkit.py",
      installGuide: {
        intro:
          "os вбудований у реальний Python — нічого встановлювати не потрібно для базового прикладу. Для СПРАВЖНЬОГО моніторингу серверів і оркестрації знадобляться спеціалізовані інструменти.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text: "Зайди на python.org/downloads і встанови останню версію. Windows: галочка «Add python.exe to PATH».",
            code: null,
          },
          {
            title: "2. (Реальний моніторинг) встанови psutil",
            text: "Для СПРАВЖНІХ метрик CPU/пам'яті/диска замість змодельованих словників:",
            code: "pip install psutil",
          },
          {
            title: "3. Порівняй: реальні метрики на psutil",
            text:
              "psutil.cpu_percent() і psutil.virtual_memory() дають РЕАЛЬНІ показники системи, на якій запущено скрипт — той самий принцип порогів (check_thresholds) застосовується напряму.",
            code: `import psutil

metrics = {
    "cpu": psutil.cpu_percent(interval=1),
    "memory": psutil.virtual_memory().percent,
}
print(metrics)`,
          },
          {
            title: "4. (Оркестрація) Ansible для реальних серверів",
            text: "Для управління ДЕСЯТКАМИ реальних серверів одразу — Ansible виконує ту саму ідею deploy_with_rollback(), тільки через SSH на реальні машини.",
            code: "pip install ansible",
          },
        ],
      },
      improvements: [
        "Перейти на psutil для реальних метрик CPU/пам'яті/диска на власній машині",
        "Використати Ansible чи Kubernetes для оркестрації РЕАЛЬНИХ серверів",
        "Додати справжні сповіщення через email/Slack замість списку в пам'яті",
        "Реалізувати справжній cron-планувальник через модуль sched чи APScheduler",
      ],
      nextLevel:
        "Далі — 🚀 Python Full Project: об'єднання кількох напрямків в один завершений, реальний проєкт від початку до кінця — фінальний рівень цих 16 напрямків.",
    },
  },
];
