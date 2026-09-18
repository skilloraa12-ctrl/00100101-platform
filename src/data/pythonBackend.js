// Python Backend Development — the eighth Python direction. Same intro +
// 20 lessons structure, building on the Task API from API Development by
// adding authentication, authorization and configuration — the layers that
// turn a bare router into an actual backend. Unlike several earlier
// directions, everything here is genuine, unrestricted Python: password
// hashing (hashlib), secure tokens (secrets), environment configuration
// (os.environ) all work exactly the same in this sandbox as they would
// anywhere else — no simulation, no caveat needed.
export const PYTHON_BACKEND_LESSONS = [
  {
    id: "py-backend-intro",
    title: "Що це? — Backend Development",
    type: "intro",
    theory:
      "Python Backend Development — це напрямок про серверну частину сайтів і застосунків: усе, що відбувається НЕ у браузері користувача, а на сервері — бізнес-логіку, перевірку «хто ти такий» (автентифікація) і «що тобі можна» (авторизація), налаштування застосунку під різні середовища (розробка/продакшн). Це логічне продовження 🌐 API Development: там був маршрутизатор, тут — усе, що робить маршрутизатор БЕЗПЕЧНИМ і придатним для реального використання.\n\nНа відміну від кількох попередніх напрямків, тут НЕМАЄ жодних застережень: хешування паролів (hashlib), генерація безпечних токенів (secrets), змінні середовища (os.environ) — усе це стандартна бібліотека Python, яка працює тут так само, як і будь-де. Жодної мережі чи вікна не потрібно — лише логіка.\n\nЦе вирішує задачу «як зробити застосунок, яким можна реально користуватись, а не лише демонструвати»: реєстрація й вхід користувачів БЕЗ зберігання паролів у відкритому вигляді, токени сесій замість постійного вводу пароля, захист певних дій лише для авторизованих користувачів, і розділення коду на шари — обробники запитів окремо від бізнес-логіки (сервісний шар), щоб одне не заважало іншому.\n\nЩо знадобиться з попередніх напрямків: класи (Python OOP), Request/Response і маршрутизація (🌐 API Development) — цей напрямок додає до вже готового Task API справжню автентифікацію. Що буде після 20 уроків: Secure Task Backend — той самий Task API, тепер із реєстрацією, входом і захищеними маршрутами, доступними лише авторизованим користувачам.",
    presentation: [
      { title: "Backend Development — коротко", points: ["Автентифікація (хто ти), авторизація (що тобі можна), конфігурація середовища", "Хешування паролів, токени сесій, захищені маршрути — усе реальний, непроста Python-код", "Продовжує Task API з напрямку API Development, додаючи безпеку"] },
      { title: "Результат", points: ["20 уроків, кожен додає новий шар безпеки чи структури", "Фінал: Secure Task Backend із реєстрацією, входом і захищеними маршрутами", "Потрібне знання класів і Request/Response з API Development"] },
    ],
  },
  {
    id: "py-backend-1",
    title: "Шари застосунку: маршрут і бізнес-логіка",
    type: "python",
    theory:
      "У малому Task API з попереднього напрямку обробник маршруту (наприклад create_task) робив УСЕ одразу: перевіряв дані, створював запис, повертав відповідь. У реальному backend-застосунку ці відповідальності РОЗДІЛЯЮТЬ: бізнес-логіка (\"що саме відбувається зі даними\") живе окремо від того, ЯК прийшов запит.\n\ndef calculate_total(prices):    # бізнес-логіка: не знає нічого про HTTP\n    return sum(prices)\n\ndef handle_order_request(request):    # шар маршруту: викликає логіку\n    total = calculate_total(request.body[\"prices\"])\n    return {\"total\": total}\n\nПереваги: calculate_total() можна перевірити (протестувати) окремо, без жодного HTTP-запиту, і повторно використати будь-де в коді.",
    examples: [
      { title: "Логіка окремо від обробки запиту", code: `def calculate_total(prices):\n    return sum(prices)\n\ndef handle_order_request(request_body):\n    total = calculate_total(request_body["prices"])\n    return {"total": total}\n\nresult = handle_order_request({"prices": [10, 20, 30]})\nprint(result)`, explain: "calculate_total() можна викликати й перевірити незалежно від того, звідки взявся request_body." },
    ],
    task: `Напиши calculate_total(prices), що повертає sum(prices). Напиши handle_order_request(request_body), що викликає calculate_total(request_body["prices"]) і повертає {"total": ...}. Виклич handle_order_request({"prices": [10, 20, 30]}) і виведи результат.`,
    starter: `def calculate_total(prices):\n    # твій код тут\n    pass\n\ndef handle_order_request(request_body):\n    # твій код тут\n    pass\n\nresult = handle_order_request({"prices": [10, 20, 30]})\nprint(result)\n`,
    hints: [`calculate_total повертає sum(prices).`, `handle_order_request викликає calculate_total і повертає {"total": ...}.`, `def calculate_total(prices):\n    return sum(prices)\n\ndef handle_order_request(request_body):\n    total = calculate_total(request_body["prices"])\n    return {"total": total}`],
    solution: `def calculate_total(prices):\n    return sum(prices)\n\ndef handle_order_request(request_body):\n    total = calculate_total(request_body["prices"])\n    return {"total": total}\n\nresult = handle_order_request({"prices": [10, 20, 30]})\nprint(result)`,
    testCode: `if "calculate_total" not in globals() or calculate_total([10, 20, 30]) != 60:\n    __result__ = {"pass": False, "message": "calculate_total([10, 20, 30]) має повернути 60."}\nelif "result" not in globals() or result != {"total": 60}:\n    __result__ = {"pass": False, "message": "handle_order_request({\\"prices\\": [10, 20, 30]}) має повернути {\\"total\\": 60}."}\nelif not any("60" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи результат через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Розділення на логіку й обробку запиту — перший крок до застосунку, який легко тестувати й підтримувати."}`,
  },
  {
    id: "py-backend-2",
    title: "Чому паролі не можна зберігати відкрито",
    type: "python",
    theory:
      "Якщо зберігати пароль користувача просто рядком (\"qwerty123\") у базі даних, будь-хто, хто отримає доступ до цієї бази (зловмисник, витік даних), одразу побачить справжні паролі всіх користувачів. Замість цього зберігають ХЕШ пароля — результат односторонньої математичної функції, з якого НЕМОЖЛИВО відновити оригінальний пароль.\n\nimport hashlib\n\npassword = \"qwerty123\"\nhashed = hashlib.sha256(password.encode()).hexdigest()\nprint(hashed)\n\n.encode() перетворює рядок на байти (hashlib працює з байтами, не з текстом напряму); .hexdigest() повертає результат хешування як рядок із шістнадцяткових цифр.",
    examples: [
      { title: "Хешування пароля через sha256", code: `import hashlib\n\npassword = "qwerty123"\nhashed = hashlib.sha256(password.encode()).hexdigest()\nprint(hashed)\nprint(len(hashed))`, explain: "sha256 завжди дає рядок довжиною 64 символи, незалежно від довжини оригінального пароля." },
    ],
    task: `Дано password = "qwerty123". Обчисли hashed через hashlib.sha256(password.encode()).hexdigest(). Виведи hashed і len(hashed).`,
    starter: `import hashlib\n\npassword = "qwerty123"\n\n# hashed = hashlib.sha256(password.encode()).hexdigest()\n# print(hashed)\n# print(len(hashed))\n`,
    hints: [`.encode() перетворює рядок у байти перед хешуванням.`, `.hexdigest() повертає результат як текстовий рядок.`, `hashed = hashlib.sha256(password.encode()).hexdigest()\nprint(hashed)\nprint(len(hashed))`],
    solution: `import hashlib\n\npassword = "qwerty123"\n\nhashed = hashlib.sha256(password.encode()).hexdigest()\nprint(hashed)\nprint(len(hashed))`,
    testCode: `import hashlib\nif "hashed" not in globals() or hashed != hashlib.sha256("qwerty123".encode()).hexdigest():\n    __result__ = {"pass": False, "message": "hashed має дорівнювати hashlib.sha256(\\"qwerty123\\".encode()).hexdigest()."}\nelif not any(l.strip() == "64" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(hashed) — sha256 завжди дає 64 символи."}\nelse:\n    __result__ = {"pass": True, "message": "Хеш не можна «розхешувати» назад у пароль — саме тому його безпечно зберігати в базі даних."}`,
  },
  {
    id: "py-backend-3",
    title: "Сіль (salt): захист від готових таблиць хешів",
    type: "python",
    theory:
      "Проблема самого лише хешування: якщо два користувачі мають ОДНАКОВИЙ пароль, їхні хеші теж будуть однаковими — а зловмисники мають готові таблиці хешів популярних паролів (\"rainbow tables\"). Рішення — сіль (salt): унікальний випадковий рядок, доданий до пароля ПЕРЕД хешуванням, свій для кожного користувача.\n\nimport secrets\n\nsalt = secrets.token_hex(8)\nhashed = hashlib.sha256((salt + \"qwerty123\").encode()).hexdigest()\n\nsecrets.token_hex(8) генерує криптографічно надійний випадковий рядок із 16 шістнадцяткових символів (8 байтів) — саме для таких задач (не плутати зі звичайним random, який недостатньо непередбачуваний для безпеки).",
    examples: [
      { title: "Хешування з сіллю", code: `import hashlib, secrets\n\nsalt = secrets.token_hex(8)\npassword = "qwerty123"\nhashed = hashlib.sha256((salt + password).encode()).hexdigest()\n\nprint(len(salt))\nprint(len(hashed))`, explain: "Кожен виклик secrets.token_hex(8) дає РІЗНИЙ salt — тому навіть однакові паролі дадуть різні хеші." },
    ],
    task: `Згенеруй salt через secrets.token_hex(8). Обчисли hashed = hashlib.sha256((salt + "qwerty123").encode()).hexdigest(). Виведи len(salt) і len(hashed).`,
    starter: `import hashlib, secrets\n\n# salt = secrets.token_hex(8)\n# password = "qwerty123"\n# hashed = hashlib.sha256((salt + password).encode()).hexdigest()\n# print(len(salt))\n# print(len(hashed))\n`,
    hints: [`secrets.token_hex(8) дає рядок довжиною 16 символів.`, `Сіль додається ПЕРЕД паролем: (salt + password).encode()`, `salt = secrets.token_hex(8)\npassword = "qwerty123"\nhashed = hashlib.sha256((salt + password).encode()).hexdigest()\nprint(len(salt))\nprint(len(hashed))`],
    solution: `import hashlib, secrets\n\nsalt = secrets.token_hex(8)\npassword = "qwerty123"\nhashed = hashlib.sha256((salt + password).encode()).hexdigest()\nprint(len(salt))\nprint(len(hashed))`,
    testCode: `import hashlib\nif "salt" not in globals() or len(salt) != 16:\n    __result__ = {"pass": False, "message": "salt має бути рядком довжиною 16 символів (secrets.token_hex(8))."}\nelif "hashed" not in globals() or hashed != hashlib.sha256((salt + "qwerty123").encode()).hexdigest():\n    __result__ = {"pass": False, "message": "hashed має бути обчислений із salt + password РАЗОМ, у такому порядку."}\nelif not any(l.strip() == "16" for l in __logs) or not any(l.strip() == "64" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(salt) (16) і len(hashed) (64)."}\nelse:\n    __result__ = {"pass": True, "message": "Унікальна сіль для кожного користувача — те, що робить готові таблиці хешів марними проти твоєї бази."}`,
  },
  {
    id: "py-backend-4",
    title: "Реєстрація користувача",
    type: "python",
    theory:
      "Об'єднаємо 2-й і 3-й уроки в функцію register(username, password): генерує сіль, хешує пароль разом із нею, і зберігає користувача в users_db — словнику {username: {\"salt\": ..., \"password_hash\": ...}}:\n\nusers_db = {}\n\ndef register(username, password):\n    salt = secrets.token_hex(8)\n    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n    users_db[username] = {\"salt\": salt, \"password_hash\": password_hash}\n\nОригінальний пароль ніде НЕ зберігається — лише сіль і хеш. Навіть сам сервер більше «не знає» справжнього пароля користувача.",
    examples: [
      { title: "register() зберігає лише сіль і хеш", code: `import hashlib, secrets\n\nusers_db = {}\n\ndef register(username, password):\n    salt = secrets.token_hex(8)\n    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n    users_db[username] = {"salt": salt, "password_hash": password_hash}\n\nregister("olena", "qwerty123")\nprint(list(users_db["olena"].keys()))`, explain: "Ключі users_db['olena'] — лише salt і password_hash, оригінального пароля серед них немає." },
    ],
    task: `Дано users_db = {}. Напиши register(username, password) за прикладом. Виклич register("olena", "qwerty123") і виведи list(users_db["olena"].keys()) та "qwerty123" in str(users_db).`,
    starter: `import hashlib, secrets\n\nusers_db = {}\n\ndef register(username, password):\n    # твій код тут\n    pass\n\nregister("olena", "qwerty123")\nprint(list(users_db["olena"].keys()))\nprint("qwerty123" in str(users_db))\n`,
    hints: [`salt = secrets.token_hex(8)`, `password_hash = hashlib.sha256((salt + password).encode()).hexdigest()`, `users_db[username] = {"salt": salt, "password_hash": password_hash}`],
    solution: `import hashlib, secrets\n\nusers_db = {}\n\ndef register(username, password):\n    salt = secrets.token_hex(8)\n    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n    users_db[username] = {"salt": salt, "password_hash": password_hash}\n\nregister("olena", "qwerty123")\nprint(list(users_db["olena"].keys()))\nprint("qwerty123" in str(users_db))`,
    testCode: `if "register" not in globals() or not callable(register):\n    __result__ = {"pass": False, "message": "Потрібна функція register(username, password)."}\nelif "olena" not in users_db or "salt" not in users_db["olena"] or "password_hash" not in users_db["olena"]:\n    __result__ = {"pass": False, "message": "users_db[\\"olena\\"] має містити ключі salt і password_hash."}\nelif not any(l.strip() == "False" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи \\"qwerty123\\" in str(users_db) — має бути False, оригінальний пароль ніде не зберігається."}\nelse:\n    __result__ = {"pass": True, "message": "register() — так реальні сайти зберігають користувачів: без жодного сліду справжнього пароля."}`,
  },
  {
    id: "py-backend-5",
    title: "Перевірка пароля при вході",
    type: "python",
    theory:
      "Щоб перевірити пароль при вході, НЕ можна «розхешувати» збережений хеш — натомість беруть введений пароль, хешують його з ТІЄЮ САМОЮ сіллю, що зберігалась при реєстрації, і порівнюють результат зі збереженим хешем:\n\ndef check_password(username, password):\n    user = users_db.get(username)\n    if user is None:\n        return False\n    expected_hash = hashlib.sha256((user[\"salt\"] + password).encode()).hexdigest()\n    return expected_hash == user[\"password_hash\"]\n\nЯкщо пароль правильний — обчислений хеш ЗБІГАЄТЬСЯ зі збереженим (та сама сіль + той самий пароль дають той самий результат); якщо ні — не збігається.",
    examples: [
      { title: "check_password перевіряє без розшифрування", code: `def check_password(username, password):\n    user = users_db.get(username)\n    if user is None:\n        return False\n    expected_hash = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n    return expected_hash == user["password_hash"]\n\nprint(check_password("olena", "qwerty123"))\nprint(check_password("olena", "wrong_password"))`, explain: "Правильний пароль дає True, неправильний — False, і жодного разу пароль не «розшифровувався»." },
    ],
    task: `Напиши check_password(username, password) за прикладом. Дано вже зареєстрована "olena"/"qwerty123" (стартовий код). Виведи check_password("olena", "qwerty123") і check_password("olena", "wrong_password").`,
    starter: `import hashlib, secrets\n\nusers_db = {}\n\ndef register(username, password):\n    salt = secrets.token_hex(8)\n    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n    users_db[username] = {"salt": salt, "password_hash": password_hash}\n\nregister("olena", "qwerty123")\n\ndef check_password(username, password):\n    # твій код тут\n    pass\n\nprint(check_password("olena", "qwerty123"))\nprint(check_password("olena", "wrong_password"))\n`,
    hints: [`user = users_db.get(username); if user is None: return False`, `expected_hash = hashlib.sha256((user["salt"] + password).encode()).hexdigest(); return expected_hash == user["password_hash"]`, `def check_password(username, password):\n    user = users_db.get(username)\n    if user is None:\n        return False\n    expected_hash = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n    return expected_hash == user["password_hash"]`],
    solution: `import hashlib, secrets\n\nusers_db = {}\n\ndef register(username, password):\n    salt = secrets.token_hex(8)\n    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n    users_db[username] = {"salt": salt, "password_hash": password_hash}\n\nregister("olena", "qwerty123")\n\ndef check_password(username, password):\n    user = users_db.get(username)\n    if user is None:\n        return False\n    expected_hash = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n    return expected_hash == user["password_hash"]\n\nprint(check_password("olena", "qwerty123"))\nprint(check_password("olena", "wrong_password"))`,
    testCode: `if "check_password" not in globals() or not callable(check_password):\n    __result__ = {"pass": False, "message": "Потрібна функція check_password(username, password)."}\nelif check_password("olena", "qwerty123") is not True:\n    __result__ = {"pass": False, "message": "check_password(\\"olena\\", \\"qwerty123\\") має повернути True."}\nelif check_password("olena", "wrong_password") is not False:\n    __result__ = {"pass": False, "message": "check_password(\\"olena\\", \\"wrong_password\\") має повернути False."}\nelif not (any(l.strip() == "True" for l in __logs) and any(l.strip() == "False" for l in __logs)):\n    __result__ = {"pass": False, "message": "Виведи результати обох викликів — True і False."}\nelse:\n    __result__ = {"pass": True, "message": "check_password() — так вхід перевіряється без жодного разу «розшифрування» пароля."}`,
  },
  {
    id: "py-backend-6",
    title: "Функція login(): успіх чи помилка",
    type: "python",
    theory:
      "Обгорнемо check_password() у функцію login(), що повертає не просто True/False, а зрозумілий результат — словник із success і, за потреби, повідомленням про помилку:\n\ndef login(username, password):\n    if username not in users_db:\n        return {\"success\": False, \"error\": \"Користувача не знайдено\"}\n    if not check_password(username, password):\n        return {\"success\": False, \"error\": \"Неправильний пароль\"}\n    return {\"success\": True}\n\nДва РІЗНИХ повідомлення про помилку (немає користувача / неправильний пароль) зручні для налагодження, хоча в реальних застосунках з міркувань безпеки їх іноді навмисно об'єднують в одне (\"невірний логін або пароль\"), щоб не підказувати зловмиснику, чи існує такий username узагалі.",
    examples: [
      { title: "login() дає зрозумілий результат", code: `result = login("olena", "qwerty123")\nprint(result)\n\nresult2 = login("olena", "wrong")\nprint(result2)`, explain: "success: True/False одразу каже, чи вдалось увійти, а error пояснює причину невдачі." },
    ],
    task: `Напиши login(username, password) за прикладом (перевіряє наявність користувача і пароль). Дано вже зареєстровану "olena"/"qwerty123". Виведи login("olena", "qwerty123") і login("nobody", "x").`,
    starter: `import hashlib, secrets\n\nusers_db = {}\n\ndef register(username, password):\n    salt = secrets.token_hex(8)\n    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n    users_db[username] = {"salt": salt, "password_hash": password_hash}\n\ndef check_password(username, password):\n    user = users_db.get(username)\n    if user is None:\n        return False\n    expected_hash = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n    return expected_hash == user["password_hash"]\n\nregister("olena", "qwerty123")\n\ndef login(username, password):\n    # твій код тут\n    pass\n\nprint(login("olena", "qwerty123"))\nprint(login("nobody", "x"))\n`,
    hints: [`if username not in users_db: return {"success": False, "error": "Користувача не знайдено"}`, `if not check_password(username, password): return {"success": False, "error": "Неправильний пароль"}`, `def login(username, password):\n    if username not in users_db:\n        return {"success": False, "error": "Користувача не знайдено"}\n    if not check_password(username, password):\n        return {"success": False, "error": "Неправильний пароль"}\n    return {"success": True}`],
    solution: `import hashlib, secrets\n\nusers_db = {}\n\ndef register(username, password):\n    salt = secrets.token_hex(8)\n    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n    users_db[username] = {"salt": salt, "password_hash": password_hash}\n\ndef check_password(username, password):\n    user = users_db.get(username)\n    if user is None:\n        return False\n    expected_hash = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n    return expected_hash == user["password_hash"]\n\nregister("olena", "qwerty123")\n\ndef login(username, password):\n    if username not in users_db:\n        return {"success": False, "error": "Користувача не знайдено"}\n    if not check_password(username, password):\n        return {"success": False, "error": "Неправильний пароль"}\n    return {"success": True}\n\nprint(login("olena", "qwerty123"))\nprint(login("nobody", "x"))`,
    testCode: `if "login" not in globals() or not callable(login):\n    __result__ = {"pass": False, "message": "Потрібна функція login(username, password)."}\nelif login("olena", "qwerty123") != {"success": True}:\n    __result__ = {"pass": False, "message": "login(\\"olena\\", \\"qwerty123\\") має повернути {\\"success\\": True}."}\nelif login("nobody", "x").get("success") is not False:\n    __result__ = {"pass": False, "message": "login(\\"nobody\\", \\"x\\") має повернути success: False."}\nelif not any("success" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи обидва результати login()."}\nelse:\n    __result__ = {"pass": True, "message": "login() тепер повертає структурований результат, готовий стати відповіддю API."}`,
  },
  {
    id: "py-backend-7",
    title: "Токени сесій",
    type: "python",
    theory:
      "Якби застосунок вимагав пароль на КОЖЕН запит, це було б незручно й ризиковано. Замість цього після успішного входу видають токен сесії — випадковий унікальний рядок, який клієнт передає замість пароля в наступних запитах:\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ntoken = create_session(\"olena\")\nprint(len(token))\n\nsecrets.token_hex(16) генерує довший (32-символьний) випадковий рядок — токени сесій зазвичай довші за солі, бо саме вони «замінюють» пароль на певний час.",
    examples: [
      { title: "create_session видає токен", code: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ntoken = create_session("olena")\nprint(len(token))\nprint(sessions_db[token])`, explain: "sessions_db[token] дозволяє пізніше дізнатись, ЯКОМУ користувачу належить цей токен." },
    ],
    task: `Дано sessions_db = {}. Напиши create_session(username), що генерує token = secrets.token_hex(16), зберігає sessions_db[token] = username, повертає token. Виклич create_session("olena") і виведи len(token) та sessions_db[token].`,
    starter: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    # твій код тут\n    pass\n\ntoken = create_session("olena")\nprint(len(token))\nprint(sessions_db[token])\n`,
    hints: [`token = secrets.token_hex(16) — довший за сіль з 3-го уроку.`, `sessions_db[token] = username, потім return token`, `def create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token`],
    solution: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ntoken = create_session("olena")\nprint(len(token))\nprint(sessions_db[token])`,
    testCode: `if "create_session" not in globals() or not callable(create_session):\n    __result__ = {"pass": False, "message": "Потрібна функція create_session(username)."}\nelif "token" not in globals() or len(token) != 32:\n    __result__ = {"pass": False, "message": "token має бути рядком довжиною 32 символи (secrets.token_hex(16))."}\nelif sessions_db.get(token) != "olena":\n    __result__ = {"pass": False, "message": "sessions_db[token] має дорівнювати \\"olena\\"."}\nelif not any(l.strip() == "32" for l in __logs) or not any("olena" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(token) (32) і sessions_db[token] (\\"olena\\")."}\nelse:\n    __result__ = {"pass": True, "message": "Токен сесії — «тимчасовий перепустка» замість пароля на кожен наступний запит."}`,
  },
  {
    id: "py-backend-8",
    title: "Перевірка токена сесії",
    type: "python",
    theory:
      "get_current_user(token) читає sessions_db, щоб дізнатись, ЯКИЙ користувач стоїть за конкретним токеном — а якщо токена немає (неправильний чи прострочений) — повертає None:\n\ndef get_current_user(token):\n    return sessions_db.get(token)\n\nusername = get_current_user(token)\nif username is None:\n    print(\"Не авторизований\")\nelse:\n    print(f\"Ти — {username}\")\n\n.get() (замість [...]) знову рятує від помилки на неіснуючому токені — той самий трюк, що й у Python Core.",
    examples: [
      { title: "get_current_user за токеном", code: `def get_current_user(token):\n    return sessions_db.get(token)\n\nusername = get_current_user(token)\nprint(username)\n\nunknown = get_current_user("невірний_токен")\nprint(unknown)`, explain: "Правильний токен дає ім'я користувача; невідомий токен дає None, а не помилку." },
    ],
    task: `Напиши get_current_user(token), що повертає sessions_db.get(token). Дано вже створену сесію (стартовий код). Виведи get_current_user(token) і get_current_user("невірний_токен").`,
    starter: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ntoken = create_session("olena")\n\ndef get_current_user(token):\n    # твій код тут\n    pass\n\nprint(get_current_user(token))\nprint(get_current_user("невірний_токен"))\n`,
    hints: [`return sessions_db.get(token)`, `.get() поверне None, якщо ключа немає — без помилки.`, `def get_current_user(token):\n    return sessions_db.get(token)`],
    solution: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ntoken = create_session("olena")\n\ndef get_current_user(token):\n    return sessions_db.get(token)\n\nprint(get_current_user(token))\nprint(get_current_user("невірний_токен"))`,
    testCode: `if "get_current_user" not in globals() or not callable(get_current_user):\n    __result__ = {"pass": False, "message": "Потрібна функція get_current_user(token)."}\nelif get_current_user(token) != "olena":\n    __result__ = {"pass": False, "message": "get_current_user(token) має повернути \\"olena\\"."}\nelif get_current_user("невірний_токен") is not None:\n    __result__ = {"pass": False, "message": "get_current_user(\\"невірний_токен\\") має повернути None."}\nelif not any("olena" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи результат get_current_user(token) — має бути «olena»."}\nelse:\n    __result__ = {"pass": True, "message": "get_current_user() — те, що кожен захищений маршрут викликає ПЕРШИМ ділом, щоб дізнатись, хто робить запит."}`,
  },
  {
    id: "py-backend-9",
    title: "Захист маршруту: 401 Unauthorized",
    type: "python",
    theory:
      "Напишемо require_auth(token), що повертає користувача, ЯКЩО токен дійсний, або спеціальне значення-помилку, якщо ні — обробник маршруту одразу зможе відмовити в доступі:\n\ndef require_auth(token):\n    username = get_current_user(token)\n    if username is None:\n        return None, {\"status\": 401, \"error\": \"Потрібна автентифікація\"}\n    return username, None\n\nusername, error = require_auth(token)\nif error:\n    print(error)\nelse:\n    print(f\"Доступ дозволено: {username}\")\n\nПовернення ДВОХ значень (username, error) одразу — типовий патерн: або є результат, або є помилка, ніколи обидва одразу.",
    examples: [
      { title: "require_auth дає результат або помилку", code: `def require_auth(token):\n    username = get_current_user(token)\n    if username is None:\n        return None, {"status": 401, "error": "Потрібна автентифікація"}\n    return username, None\n\nusername, error = require_auth(token)\nprint(username, error)\n\nusername2, error2 = require_auth("bad_token")\nprint(username2, error2)`, explain: "Для дійсного токена error буде None; для недійсного — username буде None, а error міститиме статус 401." },
    ],
    task: `Напиши require_auth(token) за прикладом. Виклич require_auth(token) (дійсний) і require_auth("bad_token") (недійсний), виведи обидва результати.`,
    starter: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ndef get_current_user(token):\n    return sessions_db.get(token)\n\ntoken = create_session("olena")\n\ndef require_auth(token):\n    # твій код тут\n    pass\n\nusername, error = require_auth(token)\nprint(username, error)\n\nusername2, error2 = require_auth("bad_token")\nprint(username2, error2)\n`,
    hints: [`username = get_current_user(token)`, `if username is None: return None, {"status": 401, "error": "Потрібна автентифікація"}`, `def require_auth(token):\n    username = get_current_user(token)\n    if username is None:\n        return None, {"status": 401, "error": "Потрібна автентифікація"}\n    return username, None`],
    solution: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ndef get_current_user(token):\n    return sessions_db.get(token)\n\ntoken = create_session("olena")\n\ndef require_auth(token):\n    username = get_current_user(token)\n    if username is None:\n        return None, {"status": 401, "error": "Потрібна автентифікація"}\n    return username, None\n\nusername, error = require_auth(token)\nprint(username, error)\n\nusername2, error2 = require_auth("bad_token")\nprint(username2, error2)`,
    testCode: `if "require_auth" not in globals() or not callable(require_auth):\n    __result__ = {"pass": False, "message": "Потрібна функція require_auth(token)."}\nelse:\n    u, e = require_auth(token)\n    u2, e2 = require_auth("bad_token")\n    if u != "olena" or e is not None:\n        __result__ = {"pass": False, "message": "require_auth(token) з дійсним токеном має повернути (\\"olena\\", None)."}\n    elif u2 is not None or e2.get("status") != 401:\n        __result__ = {"pass": False, "message": "require_auth(\\"bad_token\\") має повернути (None, {\\"status\\": 401, ...})."}\n    elif not any("401" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи результат require_auth для недійсного токена — має містити 401."}\n    else:\n        __result__ = {"pass": True, "message": "require_auth() — це та сама «охорона», що стоїть перед КОЖНИМ захищеним маршрутом реального backend-застосунку."}`,
  },
  {
    id: "py-backend-10",
    title: "Захищений обробник маршруту",
    type: "python",
    theory:
      "Об'єднаємо require_auth() (9-й урок) з обробником маршруту з 🌐 API Development. Обробник спершу перевіряє авторизацію, і лише потім виконує саму дію:\n\ndef create_task_handler(request):\n    username, error = require_auth(request.headers.get(\"Authorization\"))\n    if error:\n        return Response(error[\"status\"], {\"error\": error[\"error\"]})\n    task = {\"name\": request.body[\"name\"], \"owner\": username}\n    return Response(201, task)\n\nrequest.headers.get(\"Authorization\") — токен зазвичай передають саме в заголовку Authorization, а не в тілі запиту (з 18-го уроку API Development).",
    examples: [
      { title: "Обробник із перевіркою авторизації", code: `class Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ndef create_task_handler(request):\n    username, error = require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], {"error": error["error"]})\n    task = {"name": request.body["name"], "owner": username}\n    return Response(201, task)\n\nreq = Request(headers={"Authorization": token}, body={"name": "Купити хліб"})\nresponse = create_task_handler(req)\nprint(response.status, response.body)`, explain: "Дійсний токен у заголовку Authorization дозволяє створити задачу з owner — власником." },
    ],
    task: `Напиши create_task_handler(request) за прикладом. Створи req = Request(headers={"Authorization": token}, body={"name": "Купити хліб"}), виклич create_task_handler(req), виведи response.status і response.body.`,
    starter: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ndef get_current_user(token):\n    return sessions_db.get(token)\n\ndef require_auth(token):\n    username = get_current_user(token)\n    if username is None:\n        return None, {"status": 401, "error": "Потрібна автентифікація"}\n    return username, None\n\ntoken = create_session("olena")\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ndef create_task_handler(request):\n    # твій код тут\n    pass\n\nreq = Request(headers={"Authorization": token}, body={"name": "Купити хліб"})\nresponse = create_task_handler(req)\nprint(response.status)\nprint(response.body)\n`,
    hints: [`username, error = require_auth(request.headers.get("Authorization"))`, `if error: return Response(error["status"], {"error": error["error"]})`, `def create_task_handler(request):\n    username, error = require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], {"error": error["error"]})\n    task = {"name": request.body["name"], "owner": username}\n    return Response(201, task)`],
    solution: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ndef get_current_user(token):\n    return sessions_db.get(token)\n\ndef require_auth(token):\n    username = get_current_user(token)\n    if username is None:\n        return None, {"status": 401, "error": "Потрібна автентифікація"}\n    return username, None\n\ntoken = create_session("olena")\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ndef create_task_handler(request):\n    username, error = require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], {"error": error["error"]})\n    task = {"name": request.body["name"], "owner": username}\n    return Response(201, task)\n\nreq = Request(headers={"Authorization": token}, body={"name": "Купити хліб"})\nresponse = create_task_handler(req)\nprint(response.status)\nprint(response.body)`,
    testCode: `if "create_task_handler" not in globals() or not callable(create_task_handler):\n    __result__ = {"pass": False, "message": "Потрібна функція create_task_handler(request)."}\nelif "response" not in globals() or response.status != 201 or response.body.get("owner") != "olena":\n    __result__ = {"pass": False, "message": "З дійсним токеном response.status має бути 201, а owner — \\"olena\\"."}\nelif not any("olena" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи response.body — має містити owner: olena."}\nelse:\n    __result__ = {"pass": True, "message": "Тепер обробник знає ХТО саме створив задачу — це і є повноцінна авторизація в дії."}`,
  },
  {
    id: "py-backend-11",
    title: "Авторизація за власником: 403 Forbidden",
    type: "python",
    theory:
      "401 (Unauthorized) означає «ти взагалі не увійшов»; 403 (Forbidden) — «ти увійшов, але тобі КОНКРЕТНО ЦЕ не можна». Типовий приклад — можна редагувати ЛИШЕ власну задачу:\n\ndef update_task_handler(request, task):\n    username, error = require_auth(request.headers.get(\"Authorization\"))\n    if error:\n        return Response(error[\"status\"], error)\n    if task[\"owner\"] != username:\n        return Response(403, {\"error\": \"Немає доступу до чужої задачі\"})\n    task[\"name\"] = request.body.get(\"name\", task[\"name\"])\n    return Response(200, task)\n\nСпочатку перевіряють автентифікацію (401), потім — авторизацію (403): дві РІЗНІ причини відмови, з різними кодами.",
    examples: [
      { title: "403 при спробі редагувати чужу задачу", code: `task = {"name": "Купити хліб", "owner": "olena"}\n\ndef update_task_handler(request, task):\n    username, error = require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    if task["owner"] != username:\n        return Response(403, {"error": "Немає доступу до чужої задачі"})\n    task["name"] = request.body.get("name", task["name"])\n    return Response(200, task)\n\nother_token = create_session("max")\nreq = Request(headers={"Authorization": other_token}, body={"name": "Зламано"})\nresponse = update_task_handler(req, task)\nprint(response.status)`, explain: "max увійшов (є токен), але задача належить olena — тому 403, а не 401." },
    ],
    task: `Напиши update_task_handler(request, task) за прикладом. Дано task = {"name": "Купити хліб", "owner": "olena"} і other_token = create_session("max"). Виклич update_task_handler з токеном max і виведи response.status (має бути 403).`,
    starter: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ndef get_current_user(token):\n    return sessions_db.get(token)\n\ndef require_auth(token):\n    username = get_current_user(token)\n    if username is None:\n        return None, {"status": 401, "error": "Потрібна автентифікація"}\n    return username, None\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ntask = {"name": "Купити хліб", "owner": "olena"}\nother_token = create_session("max")\n\ndef update_task_handler(request, task):\n    # твій код тут\n    pass\n\nreq = Request(headers={"Authorization": other_token}, body={"name": "Зламано"})\nresponse = update_task_handler(req, task)\nprint(response.status)\n`,
    hints: [`username, error = require_auth(...); if error: return Response(error["status"], error)`, `if task["owner"] != username: return Response(403, {"error": "Немає доступу до чужої задачі"})`, `def update_task_handler(request, task):\n    username, error = require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    if task["owner"] != username:\n        return Response(403, {"error": "Немає доступу до чужої задачі"})\n    task["name"] = request.body.get("name", task["name"])\n    return Response(200, task)`],
    solution: `import secrets\n\nsessions_db = {}\n\ndef create_session(username):\n    token = secrets.token_hex(16)\n    sessions_db[token] = username\n    return token\n\ndef get_current_user(token):\n    return sessions_db.get(token)\n\ndef require_auth(token):\n    username = get_current_user(token)\n    if username is None:\n        return None, {"status": 401, "error": "Потрібна автентифікація"}\n    return username, None\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ntask = {"name": "Купити хліб", "owner": "olena"}\nother_token = create_session("max")\n\ndef update_task_handler(request, task):\n    username, error = require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    if task["owner"] != username:\n        return Response(403, {"error": "Немає доступу до чужої задачі"})\n    task["name"] = request.body.get("name", task["name"])\n    return Response(200, task)\n\nreq = Request(headers={"Authorization": other_token}, body={"name": "Зламано"})\nresponse = update_task_handler(req, task)\nprint(response.status)`,
    testCode: `if "response" not in globals() or response.status != 403:\n    __result__ = {"pass": False, "message": "response.status має дорівнювати 403 — max намагається редагувати задачу olena."}\nelif task["name"] != "Купити хліб":\n    __result__ = {"pass": False, "message": "Задача НЕ має змінитись — доступ заборонено ще до зміни даних."}\nelif not any(l.strip() == "403" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи response.status — має бути 403."}\nelse:\n    __result__ = {"pass": True, "message": "401 і 403 — дві різні причини відмови: «ти не увійшов» і «тобі конкретно це не можна»."}`,
  },
  {
    id: "py-backend-12",
    title: "Конфігурація через змінні середовища",
    type: "python",
    theory:
      "Реальні застосунки НЕ зашивають секрети (паролі баз даних, ключі API) прямо в код — їх читають зі змінних середовища (environment variables) через модуль os. Це дозволяє мати РІЗНІ налаштування для розробки й для продакшн-сервера, не змінюючи сам код:\n\nimport os\n\nos.environ[\"APP_ENV\"] = \"development\"   # у реальності це встановлюється ЗОВНІ, не в коді\n\napp_env = os.environ.get(\"APP_ENV\", \"production\")\nprint(app_env)\n\nos.environ.get(ключ, значення_за_замовчуванням) — типовий патерн: якщо змінна не встановлена, використати безпечне значення за замовчуванням (тут — production, «безпечніший» режим).",
    examples: [
      { title: "Читання конфігурації зі середовища", code: `import os\n\nos.environ["APP_ENV"] = "development"\n\napp_env = os.environ.get("APP_ENV", "production")\nprint(app_env)\n\ndebug = os.environ.get("DEBUG", "false") == "true"\nprint(debug)`, explain: "DEBUG не встановлено — тому debug стає False через значення за замовчуванням \"false\"." },
    ],
    task: `Встанови os.environ["APP_ENV"] = "development". Прочитай app_env = os.environ.get("APP_ENV", "production") і debug = os.environ.get("DEBUG", "false") == "true". Виведи обидва.`,
    starter: `import os\n\nos.environ["APP_ENV"] = "development"\n\n# app_env = os.environ.get("APP_ENV", "production")\n# debug = os.environ.get("DEBUG", "false") == "true"\n# print(app_env)\n# print(debug)\n`,
    hints: [`os.environ.get("APP_ENV", "production") — значення за замовчуванням, якщо змінної немає.`, `debug — результат ПОРІВНЯННЯ рядка зі "true", а не сам рядок.`, `app_env = os.environ.get("APP_ENV", "production")\ndebug = os.environ.get("DEBUG", "false") == "true"\nprint(app_env)\nprint(debug)`],
    solution: `import os\n\nos.environ["APP_ENV"] = "development"\n\napp_env = os.environ.get("APP_ENV", "production")\ndebug = os.environ.get("DEBUG", "false") == "true"\nprint(app_env)\nprint(debug)`,
    testCode: `if "app_env" not in globals() or app_env != "development":\n    __result__ = {"pass": False, "message": "app_env має дорівнювати \\"development\\"."}\nelif "debug" not in globals() or debug is not False:\n    __result__ = {"pass": False, "message": "debug має бути False — змінна DEBUG не встановлена, значення за замовчуванням \\"false\\"."}\nelif not any("development" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи app_env через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Змінні середовища дозволяють одному й тому самому коду поводитись по-різному на різних серверах."}`,
  },
  {
    id: "py-backend-13",
    title: "Клас Config: конфігурація в одному місці",
    type: "python",
    theory:
      "Зберемо читання всіх налаштувань в один клас Config — щоб решта коду звертались до config.debug замість розкиданих os.environ.get() по всьому файлу:\n\nclass Config:\n    def __init__(self):\n        self.app_env = os.environ.get(\"APP_ENV\", \"production\")\n        self.debug = os.environ.get(\"DEBUG\", \"false\") == \"true\"\n        self.secret_key = os.environ.get(\"SECRET_KEY\", \"insecure-default-change-me\")\n\nconfig = Config()\nprint(config.app_env)\n\nЗначення \"insecure-default-change-me\" для secret_key — навмисно «промовисте» попередження: якщо цей рядок з'явиться в продакшні, розробник одразу зрозуміє, що забув налаштувати справжній секрет.",
    examples: [
      { title: "Config збирає всі налаштування", code: `import os\n\nclass Config:\n    def __init__(self):\n        self.app_env = os.environ.get("APP_ENV", "production")\n        self.debug = os.environ.get("DEBUG", "false") == "true"\n        self.secret_key = os.environ.get("SECRET_KEY", "insecure-default-change-me")\n\nconfig = Config()\nprint(config.app_env)\nprint(config.secret_key)`, explain: "Увесь код звертається до config.ЩОСЬ — жодного розкиданого os.environ.get() по всьому файлу." },
    ],
    task: `Оголоси клас Config(self) з app_env, debug, secret_key за прикладом. Створи config = Config() і виведи config.app_env та config.secret_key.`,
    starter: `import os\nos.environ.pop("APP_ENV", None)\nos.environ.pop("DEBUG", None)\nos.environ.pop("SECRET_KEY", None)\n\nclass Config:\n    def __init__(self):\n        # твій код тут\n        pass\n\nconfig = Config()\nprint(config.app_env)\nprint(config.secret_key)\n`,
    hints: [`self.app_env = os.environ.get("APP_ENV", "production")`, `self.debug = os.environ.get("DEBUG", "false") == "true"; self.secret_key = os.environ.get("SECRET_KEY", "insecure-default-change-me")`, `def __init__(self):\n    self.app_env = os.environ.get("APP_ENV", "production")\n    self.debug = os.environ.get("DEBUG", "false") == "true"\n    self.secret_key = os.environ.get("SECRET_KEY", "insecure-default-change-me")`],
    solution: `import os\nos.environ.pop("APP_ENV", None)\nos.environ.pop("DEBUG", None)\nos.environ.pop("SECRET_KEY", None)\n\nclass Config:\n    def __init__(self):\n        self.app_env = os.environ.get("APP_ENV", "production")\n        self.debug = os.environ.get("DEBUG", "false") == "true"\n        self.secret_key = os.environ.get("SECRET_KEY", "insecure-default-change-me")\n\nconfig = Config()\nprint(config.app_env)\nprint(config.secret_key)`,
    testCode: `if "Config" not in globals() or not isinstance(Config, type):\n    __result__ = {"pass": False, "message": "Потрібен клас Config."}\nelse:\n    probe = Config()\n    if probe.app_env != "production" or probe.debug is not False or probe.secret_key != "insecure-default-change-me":\n        __result__ = {"pass": False, "message": "Без встановлених змінних середовища Config має мати саме ці значення за замовчуванням."}\n    elif not any("insecure-default-change-me" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи config.secret_key."}\n    else:\n        __result__ = {"pass": True, "message": "Один клас Config — єдине місце, де застосунок «дізнається» про своє середовище."}`,
  },
  {
    id: "py-backend-14",
    title: "Логування рівнів: INFO та ERROR",
    type: "python",
    theory:
      "У 🕷️ Web Scraping й ⚙️ Automation журнал просто дозаписував рядки в файл. У backend-застосунках прийнято розрізняти РІВНІ важливості повідомлень — принаймні INFO (звичайна подія) і ERROR (щось пішло не так):\n\ndef log(level, message):\n    print(f\"[{level}] {message}\")\n\nlog(\"INFO\", \"Користувач olena увійшов\")\nlog(\"ERROR\", \"Не вдалося підключитися до бази даних\")\n\nУ реальному застосунку INFO-повідомлення можна вимкнути в продакшні (щоб не засмічувати логи), а ERROR — завжди показувати й, можливо, надсилати сповіщення розробнику.",
    examples: [
      { title: "log() із рівнями важливості", code: `def log(level, message):\n    print(f"[{level}] {message}")\n\nlog("INFO", "Користувач olena увійшов")\nlog("ERROR", "Не вдалося підключитися до бази даних")`, explain: "Однаковий формат [РІВЕНЬ] повідомлення полегшує пошук помилок серед тисяч рядків логів." },
    ],
    task: `Напиши log(level, message), що друкує f"[{level}] {message}". Виклич log("INFO", "Користувач olena увійшов") і log("ERROR", "Не вдалося підключитися до бази даних").`,
    starter: `def log(level, message):\n    # твій код тут\n    pass\n\nlog("INFO", "Користувач olena увійшов")\nlog("ERROR", "Не вдалося підключитися до бази даних")\n`,
    hints: [`print(f"[{level}] {message}")`, `f-рядок із двома підстановками — level і message.`, `def log(level, message):\n    print(f"[{level}] {message}")`],
    solution: `def log(level, message):\n    print(f"[{level}] {message}")\n\nlog("INFO", "Користувач olena увійшов")\nlog("ERROR", "Не вдалося підключитися до бази даних")`,
    testCode: `if not any("[INFO]" in l for l in __logs) or not any("[ERROR]" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Мають бути виведені рядки і з [INFO], і з [ERROR]."}\nelse:\n    __result__ = {"pass": True, "message": "Рівні логування — так у реальних логах відрізняють звичайну подію від справжньої проблеми."}`,
  },
  {
    id: "py-backend-15",
    title: "Обмеження частоти запитів (rate limiting)",
    type: "python",
    theory:
      "Щоб один користувач не міг «завалити» сервер тисячами запитів за секунду, ведуть лічильник запитів на кожного: request_counts. Якщо перевищено ліміт — відповідають 429 (Too Many Requests), а не обробляють запит:\n\nrequest_counts = {}\n\ndef check_rate_limit(username, limit=3):\n    request_counts[username] = request_counts.get(username, 0) + 1\n    if request_counts[username] > limit:\n        return False\n    return True\n\nЦе той самий словник-лічильник, що рахував статистику файлів в ⚙️ Automation — тільки тепер рахує запити на користувача.",
    examples: [
      { title: "check_rate_limit обмежує кількість запитів", code: `request_counts = {}\n\ndef check_rate_limit(username, limit=3):\n    request_counts[username] = request_counts.get(username, 0) + 1\n    if request_counts[username] > limit:\n        return False\n    return True\n\nfor i in range(5):\n    print(check_rate_limit("olena", limit=3))`, explain: "Перші 3 виклики дають True, далі — False, бо ліміт (3) перевищено." },
    ],
    task: `Дано request_counts = {}. Напиши check_rate_limit(username, limit=3) за прикладом. Виклич check_rate_limit("olena", limit=3) 5 разів підряд у циклі й виведи кожен результат.`,
    starter: `request_counts = {}\n\ndef check_rate_limit(username, limit=3):\n    # твій код тут\n    pass\n\nfor i in range(5):\n    print(check_rate_limit("olena", limit=3))\n`,
    hints: [`request_counts[username] = request_counts.get(username, 0) + 1`, `if request_counts[username] > limit: return False`, `def check_rate_limit(username, limit=3):\n    request_counts[username] = request_counts.get(username, 0) + 1\n    if request_counts[username] > limit:\n        return False\n    return True`],
    solution: `request_counts = {}\n\ndef check_rate_limit(username, limit=3):\n    request_counts[username] = request_counts.get(username, 0) + 1\n    if request_counts[username] > limit:\n        return False\n    return True\n\nfor i in range(5):\n    print(check_rate_limit("olena", limit=3))`,
    testCode: `expected = [True, True, True, False, False]\nresults = []\nfor l in __logs:\n    if l.strip() == "True":\n        results.append(True)\n    elif l.strip() == "False":\n        results.append(False)\nif results != expected:\n    __result__ = {"pass": False, "message": "Перші 3 виклики мають дати True, наступні — False (ліміт 3)."}\nelse:\n    __result__ = {"pass": True, "message": "Обмеження частоти запитів — захист сервера від перевантаження одним користувачем чи ботом."}`,
  },
  {
    id: "py-backend-16",
    title: "Клас AuthService: уся автентифікація в одному місці",
    type: "python",
    theory:
      "Зберемо register/login/require_auth в один клас AuthService — так само, як Organizer чи App раніше збирали пов'язану логіку разом:\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {\"salt\": salt, \"password_hash\": password_hash}\n\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        if user is None:\n            return {\"success\": False, \"error\": \"Користувача не знайдено\"}\n        expected = hashlib.sha256((user[\"salt\"] + password).encode()).hexdigest()\n        if expected != user[\"password_hash\"]:\n            return {\"success\": False, \"error\": \"Неправильний пароль\"}\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {\"success\": True, \"token\": token}",
    examples: [
      { title: "AuthService об'єднує все", code: `auth = AuthService()\nauth.register("olena", "qwerty123")\n\nresult = auth.login("olena", "qwerty123")\nprint(result["success"])\nprint(len(result["token"]))`, explain: "auth.login() одразу повертає готовий токен сесії при успішному вході." },
    ],
    task: `Оголоси клас AuthService за прикладом (register і login). Створи auth = AuthService(), зареєструй auth.register("olena", "qwerty123"), виклич result = auth.login("olena", "qwerty123") і виведи result["success"] та len(result["token"]).`,
    starter: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n\n    def register(self, username, password):\n        # твій код тут\n        pass\n\n    def login(self, username, password):\n        # твій код тут\n        pass\n\nauth = AuthService()\nauth.register("olena", "qwerty123")\n\nresult = auth.login("olena", "qwerty123")\nprint(result["success"])\nprint(len(result["token"]))\n`,
    hints: [`register: salt = secrets.token_hex(8); password_hash = hashlib.sha256((salt+password).encode()).hexdigest(); self.users_db[username] = {...}`, `login: перевір user, порівняй хеш, якщо успіх — створи token і поверни {"success": True, "token": token}`, `def login(self, username, password):\n    user = self.users_db.get(username)\n    if user is None:\n        return {"success": False, "error": "Користувача не знайдено"}\n    expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n    if expected != user["password_hash"]:\n        return {"success": False, "error": "Неправильний пароль"}\n    token = secrets.token_hex(16)\n    self.sessions_db[token] = username\n    return {"success": True, "token": token}`],
    solution: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {"salt": salt, "password_hash": password_hash}\n\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        if user is None:\n            return {"success": False, "error": "Користувача не знайдено"}\n        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n        if expected != user["password_hash"]:\n            return {"success": False, "error": "Неправильний пароль"}\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {"success": True, "token": token}\n\nauth = AuthService()\nauth.register("olena", "qwerty123")\n\nresult = auth.login("olena", "qwerty123")\nprint(result["success"])\nprint(len(result["token"]))`,
    testCode: `if "AuthService" not in globals() or not isinstance(AuthService, type):\n    __result__ = {"pass": False, "message": "Потрібен клас AuthService."}\nelse:\n    probe = AuthService()\n    probe.register("test_user", "pass1")\n    r = probe.login("test_user", "pass1")\n    if r.get("success") is not True or "token" not in r or len(r["token"]) != 32:\n        __result__ = {"pass": False, "message": "login() з правильним паролем має повернути success=True і 32-символьний token."}\n    elif not any(l.strip() == "True" for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи result[\\"success\\"] — має бути True."}\n    else:\n        __result__ = {"pass": True, "message": "AuthService — уся автентифікація застосунку в одному, легко перевикористовуваному класі."}`,
  },
  {
    id: "py-backend-17",
    title: "AuthService.require_auth",
    type: "python",
    theory:
      "Додамо AuthService методи get_current_user і require_auth — так само, як у 8-9 уроках, тільки тепер це методи КЛАСУ, а не окремі функції з глобальним sessions_db:\n\ndef get_current_user(self, token):\n    return self.sessions_db.get(token)\n\ndef require_auth(self, token):\n    username = self.get_current_user(token)\n    if username is None:\n        return None, {\"status\": 401, \"error\": \"Потрібна автентифікація\"}\n    return username, None\n\nТепер УВЕСЬ стан автентифікації (users_db, sessions_db) належить ОДНОМУ об'єкту auth, а не розкиданий по глобальних змінних — так реальні застосунки уникають конфліктів між різними частинами коду.",
    examples: [
      { title: "require_auth як метод AuthService", code: `auth = AuthService()\nauth.register("olena", "qwerty123")\nresult = auth.login("olena", "qwerty123")\ntoken = result["token"]\n\nusername, error = auth.require_auth(token)\nprint(username, error)`, explain: "auth.require_auth() працює з ВЛАСНИМ sessions_db, не чіпаючи глобальних змінних." },
    ],
    task: `Додай AuthService методи get_current_user(self, token) і require_auth(self, token) за прикладом. Зареєструй і залогінься як "olena", виклич auth.require_auth(token) і виведи результат.`,
    starter: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {"salt": salt, "password_hash": password_hash}\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        if user is None:\n            return {"success": False, "error": "Користувача не знайдено"}\n        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n        if expected != user["password_hash"]:\n            return {"success": False, "error": "Неправильний пароль"}\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {"success": True, "token": token}\n\n    def get_current_user(self, token):\n        # твій код тут\n        pass\n\n    def require_auth(self, token):\n        # твій код тут\n        pass\n\nauth = AuthService()\nauth.register("olena", "qwerty123")\nresult = auth.login("olena", "qwerty123")\ntoken = result["token"]\n\nusername, error = auth.require_auth(token)\nprint(username, error)\n`,
    hints: [`get_current_user: return self.sessions_db.get(token)`, `require_auth: username = self.get_current_user(token); if username is None: return None, {"status": 401, "error": "Потрібна автентифікація"}; return username, None`, `def get_current_user(self, token):\n    return self.sessions_db.get(token)\n\ndef require_auth(self, token):\n    username = self.get_current_user(token)\n    if username is None:\n        return None, {"status": 401, "error": "Потрібна автентифікація"}\n    return username, None`],
    solution: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {"salt": salt, "password_hash": password_hash}\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        if user is None:\n            return {"success": False, "error": "Користувача не знайдено"}\n        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n        if expected != user["password_hash"]:\n            return {"success": False, "error": "Неправильний пароль"}\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {"success": True, "token": token}\n\n    def get_current_user(self, token):\n        return self.sessions_db.get(token)\n\n    def require_auth(self, token):\n        username = self.get_current_user(token)\n        if username is None:\n            return None, {"status": 401, "error": "Потрібна автентифікація"}\n        return username, None\n\nauth = AuthService()\nauth.register("olena", "qwerty123")\nresult = auth.login("olena", "qwerty123")\ntoken = result["token"]\n\nusername, error = auth.require_auth(token)\nprint(username, error)`,
    testCode: `if "AuthService" not in globals():\n    __result__ = {"pass": False, "message": "Потрібен клас AuthService."}\nelse:\n    probe = AuthService()\n    probe.register("u", "p")\n    r = probe.login("u", "p")\n    u, e = probe.require_auth(r["token"])\n    if u != "u" or e is not None:\n        __result__ = {"pass": False, "message": "require_auth() із дійсним токеном має повернути (username, None)."}\n    elif not any("olena" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи результат auth.require_auth(token) для olena."}\n    else:\n        __result__ = {"pass": True, "message": "Тепер уся автентифікація живе в одному об'єкті auth — жодних глобальних змінних."}`,
  },
  {
    id: "py-backend-18",
    title: "Захищений TaskAPI із AuthService",
    type: "python",
    theory:
      "З'єднаємо AuthService із маршрутизацією з 🌐 API Development: create_task_handler тепер приймає ще й auth (сервіс автентифікації) і перевіряє токен ПЕРЕД створенням задачі:\n\ndef create_task_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get(\"Authorization\"))\n    if error:\n        return Response(error[\"status\"], error)\n    task = {\"id\": len(tasks_db) + 1, \"name\": request.body[\"name\"], \"owner\": username}\n    tasks_db.append(task)\n    return Response(201, task)\n\nОбробник ЯВНО отримує auth і tasks_db як параметри — жодних глобальних змінних, усе передається напряму, що робить код легшим для тестування.",
    examples: [
      { title: "Захищений обробник створення задачі", code: `tasks_db = []\nauth = AuthService()\nauth.register("olena", "qwerty123")\ntoken = auth.login("olena", "qwerty123")["token"]\n\ndef create_task_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    task = {"id": len(tasks_db) + 1, "name": request.body["name"], "owner": username}\n    tasks_db.append(task)\n    return Response(201, task)\n\nreq = Request(headers={"Authorization": token}, body={"name": "Купити хліб"})\nresponse = create_task_handler(req, auth, tasks_db)\nprint(response.status, response.body)`, explain: "Обробник не знає ПРО ЩО саме токен — він просто питає auth, чи він дійсний." },
    ],
    task: `Напиши create_task_handler(request, auth, tasks_db) за прикладом. Зареєструй і залогінься як "olena", виклич обробник із body={"name": "Купити хліб"}, виведи response.status і response.body.`,
    starter: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {"salt": salt, "password_hash": password_hash}\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {"success": True, "token": token}\n    def get_current_user(self, token):\n        return self.sessions_db.get(token)\n    def require_auth(self, token):\n        username = self.get_current_user(token)\n        if username is None:\n            return None, {"status": 401, "error": "Потрібна автентифікація"}\n        return username, None\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ntasks_db = []\nauth = AuthService()\nauth.register("olena", "qwerty123")\ntoken = auth.login("olena", "qwerty123")["token"]\n\ndef create_task_handler(request, auth, tasks_db):\n    # твій код тут\n    pass\n\nreq = Request(headers={"Authorization": token}, body={"name": "Купити хліб"})\nresponse = create_task_handler(req, auth, tasks_db)\nprint(response.status)\nprint(response.body)\n`,
    hints: [`username, error = auth.require_auth(request.headers.get("Authorization"))`, `if error: return Response(error["status"], error)`, `def create_task_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    task = {"id": len(tasks_db) + 1, "name": request.body["name"], "owner": username}\n    tasks_db.append(task)\n    return Response(201, task)`],
    solution: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {"salt": salt, "password_hash": password_hash}\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {"success": True, "token": token}\n    def get_current_user(self, token):\n        return self.sessions_db.get(token)\n    def require_auth(self, token):\n        username = self.get_current_user(token)\n        if username is None:\n            return None, {"status": 401, "error": "Потрібна автентифікація"}\n        return username, None\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ntasks_db = []\nauth = AuthService()\nauth.register("olena", "qwerty123")\ntoken = auth.login("olena", "qwerty123")["token"]\n\ndef create_task_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    task = {"id": len(tasks_db) + 1, "name": request.body["name"], "owner": username}\n    tasks_db.append(task)\n    return Response(201, task)\n\nreq = Request(headers={"Authorization": token}, body={"name": "Купити хліб"})\nresponse = create_task_handler(req, auth, tasks_db)\nprint(response.status)\nprint(response.body)`,
    testCode: `if "response" not in globals() or response.status != 201:\n    __result__ = {"pass": False, "message": "response.status має бути 201 — задача успішно створена авторизованим користувачем."}\nelif response.body.get("owner") != "olena":\n    __result__ = {"pass": False, "message": "task.owner має дорівнювати \\"olena\\"."}\nelif len(tasks_db) != 1:\n    __result__ = {"pass": False, "message": "tasks_db має містити рівно 1 задачу."}\nelif not any("olena" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи response.body — має містити owner: olena."}\nelse:\n    __result__ = {"pass": True, "message": "Тепер маршрутизація (API Development) і безпека (AuthService) працюють разом, без жодної глобальної змінної."}`,
  },
  {
    id: "py-backend-19",
    title: "Повний сценарій: реєстрація → вхід → захищений запит",
    type: "python",
    theory:
      "Прогонимо весь ланцюжок як реальний клієнт: зареєструватись, увійти, отримати токен, зробити захищений запит із цим токеном — і, для порівняння, спробувати той самий запит БЕЗ токена:\n\nauth = AuthService()\ntasks_db = []\n\nauth.register(\"olena\", \"qwerty123\")\nlogin_result = auth.login(\"olena\", \"qwerty123\")\ntoken = login_result[\"token\"]\n\nreq_ok = Request(headers={\"Authorization\": token}, body={\"name\": \"Купити хліб\"})\nreq_bad = Request(headers={}, body={\"name\": \"Зламано\"})\n\nresponse_ok = create_task_handler(req_ok, auth, tasks_db)\nresponse_bad = create_task_handler(req_bad, auth, tasks_db)\n\nprint(response_ok.status, response_bad.status)",
    examples: [
      { title: "Порівняння запиту з токеном і без", code: `auth = AuthService()\ntasks_db = []\nauth.register("olena", "qwerty123")\ntoken = auth.login("olena", "qwerty123")["token"]\n\nreq_ok = Request(headers={"Authorization": token}, body={"name": "Купити хліб"})\nreq_bad = Request(headers={}, body={"name": "Зламано"})\n\nresponse_ok = create_task_handler(req_ok, auth, tasks_db)\nresponse_bad = create_task_handler(req_bad, auth, tasks_db)\nprint(response_ok.status, response_bad.status)`, explain: "Один і той самий обробник дає РІЗНИЙ результат залежно від того, чи прийшов дійсний токен." },
    ],
    task: `Виконай повний сценарій за прикладом: зареєструй "olena", увійди, зроби req_ok (з токеном) і req_bad (без заголовків), виклич create_task_handler для обох, виведи response_ok.status і response_bad.status.`,
    starter: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {"salt": salt, "password_hash": password_hash}\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {"success": True, "token": token}\n    def get_current_user(self, token):\n        return self.sessions_db.get(token)\n    def require_auth(self, token):\n        username = self.get_current_user(token)\n        if username is None:\n            return None, {"status": 401, "error": "Потрібна автентифікація"}\n        return username, None\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ndef create_task_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    task = {"id": len(tasks_db) + 1, "name": request.body["name"], "owner": username}\n    tasks_db.append(task)\n    return Response(201, task)\n\n# твій код тут: повний сценарій\n`,
    hints: [`auth = AuthService(); tasks_db = []; auth.register("olena", "qwerty123"); token = auth.login("olena", "qwerty123")["token"]`, `req_ok = Request(headers={"Authorization": token}, body={"name": "Купити хліб"}); req_bad = Request(headers={}, body={"name": "Зламано"})`, `response_ok = create_task_handler(req_ok, auth, tasks_db)\nresponse_bad = create_task_handler(req_bad, auth, tasks_db)\nprint(response_ok.status, response_bad.status)`],
    solution: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {"salt": salt, "password_hash": password_hash}\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {"success": True, "token": token}\n    def get_current_user(self, token):\n        return self.sessions_db.get(token)\n    def require_auth(self, token):\n        username = self.get_current_user(token)\n        if username is None:\n            return None, {"status": 401, "error": "Потрібна автентифікація"}\n        return username, None\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ndef create_task_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    task = {"id": len(tasks_db) + 1, "name": request.body["name"], "owner": username}\n    tasks_db.append(task)\n    return Response(201, task)\n\nauth = AuthService()\ntasks_db = []\nauth.register("olena", "qwerty123")\ntoken = auth.login("olena", "qwerty123")["token"]\n\nreq_ok = Request(headers={"Authorization": token}, body={"name": "Купити хліб"})\nreq_bad = Request(headers={}, body={"name": "Зламано"})\n\nresponse_ok = create_task_handler(req_ok, auth, tasks_db)\nresponse_bad = create_task_handler(req_bad, auth, tasks_db)\nprint(response_ok.status, response_bad.status)`,
    testCode: `if "response_ok" not in globals() or response_ok.status != 201:\n    __result__ = {"pass": False, "message": "response_ok.status має бути 201 (з дійсним токеном)."}\nelif "response_bad" not in globals() or response_bad.status != 401:\n    __result__ = {"pass": False, "message": "response_bad.status має бути 401 (без токена)."}\nelif len(tasks_db) != 1:\n    __result__ = {"pass": False, "message": "tasks_db має містити рівно 1 задачу — запит без токена НЕ мав створити задачу."}\nelif not any("201" in l and "401" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи обидва статус-коди в одному рядку."}\nelse:\n    __result__ = {"pass": True, "message": "Один і той самий обробник, різна доля запиту — саме так авторизація захищає реальні дані."}`,
  },
  {
    id: "py-backend-20",
    title: "Фінальний проєкт: Secure Task Backend",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків: AuthService (реєстрація, вхід, хешування, токени), захищений create_task_handler, і додатковий get_tasks_handler, що повертає ЛИШЕ задачі поточного користувача (не всі задачі всіх користувачів). Це і є Secure Task Backend, обіцяний ще на вступній сторінці «Що це?».\n\nget_tasks_handler(request, auth, tasks_db) фільтрує tasks_db за owner == username — той самий list comprehension, що фільтрував задачі в Python Core, тепер захищає приватність даних між користувачами.",
    examples: [
      { title: "get_tasks_handler показує лише свої задачі", code: `def get_tasks_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    my_tasks = [t for t in tasks_db if t["owner"] == username]\n    return Response(200, my_tasks)\n\nreq = Request(headers={"Authorization": token})\nresponse = get_tasks_handler(req, auth, tasks_db)\nprint(response.body)`, explain: "my_tasks містить ЛИШЕ задачі, де owner збігається з поточним користувачем." },
    ],
    task: `Напиши get_tasks_handler(request, auth, tasks_db) за прикладом. Зареєструй "olena" і "max", кожен створює по одній задачі через create_task_handler, потім виклич get_tasks_handler від імені olena і виведи len(response.body) (має бути 1 — лише її задача).`,
    starter: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {"salt": salt, "password_hash": password_hash}\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {"success": True, "token": token}\n    def get_current_user(self, token):\n        return self.sessions_db.get(token)\n    def require_auth(self, token):\n        username = self.get_current_user(token)\n        if username is None:\n            return None, {"status": 401, "error": "Потрібна автентифікація"}\n        return username, None\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ndef create_task_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    task = {"id": len(tasks_db) + 1, "name": request.body["name"], "owner": username}\n    tasks_db.append(task)\n    return Response(201, task)\n\ndef get_tasks_handler(request, auth, tasks_db):\n    # твій код тут\n    pass\n\nauth = AuthService()\ntasks_db = []\n\nauth.register("olena", "pass1")\nolena_token = auth.login("olena", "pass1")["token"]\ncreate_task_handler(Request(headers={"Authorization": olena_token}, body={"name": "Купити хліб"}), auth, tasks_db)\n\nauth.register("max", "pass2")\nmax_token = auth.login("max", "pass2")["token"]\ncreate_task_handler(Request(headers={"Authorization": max_token}, body={"name": "Погуляти"}), auth, tasks_db)\n\nresponse = get_tasks_handler(Request(headers={"Authorization": olena_token}), auth, tasks_db)\nprint(len(response.body))\n`,
    hints: [`username, error = auth.require_auth(request.headers.get("Authorization")); if error: return Response(error["status"], error)`, `my_tasks = [t for t in tasks_db if t["owner"] == username]; return Response(200, my_tasks)`, `def get_tasks_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    my_tasks = [t for t in tasks_db if t["owner"] == username]\n    return Response(200, my_tasks)`],
    solution: `import hashlib, secrets\n\nclass AuthService:\n    def __init__(self):\n        self.users_db = {}\n        self.sessions_db = {}\n    def register(self, username, password):\n        salt = secrets.token_hex(8)\n        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()\n        self.users_db[username] = {"salt": salt, "password_hash": password_hash}\n    def login(self, username, password):\n        user = self.users_db.get(username)\n        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()\n        token = secrets.token_hex(16)\n        self.sessions_db[token] = username\n        return {"success": True, "token": token}\n    def get_current_user(self, token):\n        return self.sessions_db.get(token)\n    def require_auth(self, token):\n        username = self.get_current_user(token)\n        if username is None:\n            return None, {"status": 401, "error": "Потрібна автентифікація"}\n        return username, None\n\nclass Request:\n    def __init__(self, headers=None, body=None):\n        self.headers = headers or {}\n        self.body = body or {}\n\nclass Response:\n    def __init__(self, status, body):\n        self.status = status\n        self.body = body\n\ndef create_task_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    task = {"id": len(tasks_db) + 1, "name": request.body["name"], "owner": username}\n    tasks_db.append(task)\n    return Response(201, task)\n\ndef get_tasks_handler(request, auth, tasks_db):\n    username, error = auth.require_auth(request.headers.get("Authorization"))\n    if error:\n        return Response(error["status"], error)\n    my_tasks = [t for t in tasks_db if t["owner"] == username]\n    return Response(200, my_tasks)\n\nauth = AuthService()\ntasks_db = []\n\nauth.register("olena", "pass1")\nolena_token = auth.login("olena", "pass1")["token"]\ncreate_task_handler(Request(headers={"Authorization": olena_token}, body={"name": "Купити хліб"}), auth, tasks_db)\n\nauth.register("max", "pass2")\nmax_token = auth.login("max", "pass2")["token"]\ncreate_task_handler(Request(headers={"Authorization": max_token}, body={"name": "Погуляти"}), auth, tasks_db)\n\nresponse = get_tasks_handler(Request(headers={"Authorization": olena_token}), auth, tasks_db)\nprint(len(response.body))`,
    testCode: `if "get_tasks_handler" not in globals() or not callable(get_tasks_handler):\n    __result__ = {"pass": False, "message": "Потрібна функція get_tasks_handler."}\nelif "response" not in globals() or len(response.body) != 1:\n    __result__ = {"pass": False, "message": "get_tasks_handler для olena має повернути рівно 1 задачу — свою власну."}\nelif response.body[0]["owner"] != "olena":\n    __result__ = {"pass": False, "message": "Повернута задача має належати olena, не max."}\nelif len(tasks_db) != 2:\n    __result__ = {"pass": False, "message": "tasks_db загалом має містити 2 задачі — по одній від кожного користувача."}\nelif not any(l.strip() == "1" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(response.body) — має бути 1."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Secure Task Backend: хешування паролів, токени сесій, захищені маршрути й ізоляція даних між користувачами — усе з нуля, крок за кроком за 20 уроків."}`,
    finalProject: {
      techs: ["Python 3", "hashlib", "secrets", "os.environ", "class (AuthService)", "REST-подібна авторизація"],
      skills: [
        "Хешування паролів із сіллю (hashlib + secrets)",
        "Токени сесій замість повторного вводу пароля",
        "Автентифікація (401) і авторизація за власником (403)",
        "Конфігурація через змінні середовища (Config)",
        "Розділення шарів: маршрут, бізнес-логіка, сервіс автентифікації",
        "Ізоляція даних між користувачами (кожен бачить лише своє)",
      ],
      structure:
        "secure_backend.py\n  ├── class AuthService       # register, login, require_auth\n  ├── class Config             # налаштування зі середовища\n  ├── class Request / Response # з напрямку API Development\n  ├── create_task_handler       # захищене створення задачі\n  └── get_tasks_handler          # захищений список СВОЇХ задач",
      code: `import hashlib
import secrets
import os


class Config:
    def __init__(self):
        self.app_env = os.environ.get("APP_ENV", "production")
        self.debug = os.environ.get("DEBUG", "false") == "true"


class AuthService:
    def __init__(self):
        self.users_db = {}
        self.sessions_db = {}

    def register(self, username, password):
        salt = secrets.token_hex(8)
        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()
        self.users_db[username] = {"salt": salt, "password_hash": password_hash}

    def login(self, username, password):
        user = self.users_db.get(username)
        if user is None:
            return {"success": False, "error": "Користувача не знайдено"}
        expected = hashlib.sha256((user["salt"] + password).encode()).hexdigest()
        if expected != user["password_hash"]:
            return {"success": False, "error": "Неправильний пароль"}
        token = secrets.token_hex(16)
        self.sessions_db[token] = username
        return {"success": True, "token": token}

    def get_current_user(self, token):
        return self.sessions_db.get(token)

    def require_auth(self, token):
        username = self.get_current_user(token)
        if username is None:
            return None, {"status": 401, "error": "Потрібна автентифікація"}
        return username, None


class Request:
    def __init__(self, headers=None, body=None):
        self.headers = headers or {}
        self.body = body or {}


class Response:
    def __init__(self, status, body):
        self.status = status
        self.body = body


def create_task_handler(request, auth, tasks_db):
    username, error = auth.require_auth(request.headers.get("Authorization"))
    if error:
        return Response(error["status"], error)
    task = {"id": len(tasks_db) + 1, "name": request.body["name"], "owner": username}
    tasks_db.append(task)
    return Response(201, task)


def get_tasks_handler(request, auth, tasks_db):
    username, error = auth.require_auth(request.headers.get("Authorization"))
    if error:
        return Response(error["status"], error)
    my_tasks = [t for t in tasks_db if t["owner"] == username]
    return Response(200, my_tasks)


if __name__ == "__main__":
    auth = AuthService()
    tasks_db = []
    auth.register("olena", "qwerty123")
    token = auth.login("olena", "qwerty123")["token"]
    response = create_task_handler(
        Request(headers={"Authorization": token}, body={"name": "Купити хліб"}),
        auth, tasks_db,
    )
    print(response.status, response.body)`,
      runCommand: "python secure_backend.py",
      installGuide: {
        intro:
          "hashlib, secrets і os — усі вбудовані в Python, нічого встановлювати не треба. Щоб цей backend став реальним сервером, додай Flask (як у напрямку API Development) поверх уже готової логіки.",
        steps: [
          {
            title: "1. Встанови Python і Flask",
            text: "Python із python.org (Windows: галочка «Add to PATH»), потім Flask через pip.",
            code: "pip install flask",
          },
          {
            title: "2. НІКОЛИ не залишай значення за замовчуванням для секретів",
            text:
              "У реальному проєкті secret_key і будь-які паролі баз даних мають прийти зі змінних середовища (файл .env, налаштування хостингу) — значення на кшталт \"insecure-default-change-me\" мають існувати лише як попередження розробнику, ніколи в продакшні.",
            code: "export SECRET_KEY=\"справжній-випадковий-ключ\"\nexport APP_ENV=\"production\"",
          },
          {
            title: "3. Обгорни AuthService і обробники у Flask-маршрути",
            text: "Уся логіка (AuthService, create_task_handler) лишається БЕЗ ЗМІН — Flask лише передає їй реальні HTTP-запити.",
            code: `from flask import Flask, request, jsonify

app = Flask(__name__)
auth = AuthService()
tasks_db = []

@app.route("/register", methods=["POST"])
def flask_register():
    data = request.get_json()
    auth.register(data["username"], data["password"])
    return jsonify({"ok": True})

@app.route("/login", methods=["POST"])
def flask_login():
    data = request.get_json()
    return jsonify(auth.login(data["username"], data["password"]))`,
          },
          {
            title: "4. Запусти сервер",
            text: "Клієнт тепер реєструється, логіниться, отримує токен і передає його в заголовку Authorization кожного наступного запиту.",
            code: "python secure_backend.py",
          },
        ],
      },
      improvements: [
        "Перейти на bcrypt чи argon2 замість sha256 — спеціалізовані бібліотеки для паролів, навмисно повільні проти перебору",
        "Додати термін дії токена (expiration), а не безстрокову сесію",
        "Зберігати users_db і tasks_db в реальній базі даних (наступний напрямок — Databases), а не в пам'яті",
        "Додати ролі користувачів (admin/user) для складнішої авторизації, ніж просто «власник/не власник»",
      ],
      nextLevel:
        "Далі — 🗄️ Databases: users_db і tasks_db досі живуть у звичайних Python-словниках, що зникають при перезапуску. Наступний крок — зберігати ці самі дані в реальній базі (SQLite), яка переживає перезапуск сервера.",
    },
  },
];
