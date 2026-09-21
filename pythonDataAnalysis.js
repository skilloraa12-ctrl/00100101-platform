// Python Data Analysis — the tenth Python direction. Same intro + 20
// lessons structure, building a small but genuine data-analysis workflow:
// loading tabular data, descriptive statistics, cleaning, grouping,
// correlation, and a final text report. The library most people reach for
// here is pandas — but like sqlite3 in Databases, pandas is a large
// compiled package that would need fetching from the same jsdelivr CDN
// this sandbox's proxy blocks, so it isn't installed here. That said,
// almost everything in this direction needs NO workaround at all: Python's
// built-in statistics module (mean/median/mode/stdev) and csv module are
// genuine stdlib and work exactly as they would with pandas underneath —
// only the install note for pandas itself is deferred to the final guide.
export const PYTHON_DATA_ANALYSIS_LESSONS = [
  {
    id: "py-dataanalysis-intro",
    title: "Що це? — Data Analysis",
    type: "intro",
    theory:
      "Python Data Analysis — це напрямок про пошук сенсу у великих наборах даних: продажі за місяць, оцінки студентів, показники сенсорів. Замість того щоб дивитись на тисячі рядків очима, пишуть скрипт, який рахує суму, середнє, знаходить найпоширеніші значення й показує головне за секунди.\n\nНайпопулярніший інструмент для цього в реальному світі — бібліотека pandas. Вона НЕ входить у ці 20 уроків одразу: pandas — великий, скомпільований пакет, який довелось би завантажити з того самого CDN, що заблокований у цій браузерній пісочниці (та сама причина, чому довелось самостійно хостити сам Pyodide). Але добра новина: майже все в цьому напрямку не потребує жодного обхідного шляху — вбудований модуль statistics (mean, median, mode, stdev) і вже знайомий csv (з Automation і Web Scraping) працюють тут по-справжньому, без жодних симуляцій. Наприкінці — install-гайд, як перейти на pandas локально, коли базові принципи вже зрозумілі.\n\nЦе вирішує задачу «як витягнути сенс із сирих даних»: описова статистика (середнє, медіана, розкид), очищення «брудних» даних (пропуски, некоректні значення), фільтрація й групування за категоріями, пошук найважливішого («яка категорія приносить найбільше»), і, зрештою, — читабельний звіт для людини, а не купа чисел.\n\nЩо знадобиться з попередніх напрямків: списки й словники (Python Core), робота з файлами й CSV (Automation, Web Scraping), а з 🗄️ Databases — group_by і сортування, які тут застосовуються до статистики, а не до рядків бази. Що буде після 20 уроків: повний аналіз набору даних про продажі — очищення, статистика, групування за категоріями, кореляція і фінальний текстовий звіт.",
    presentation: [
      { title: "Data Analysis — коротко", points: ["Описова статистика, очищення даних, групування, кореляція — реальні прийоми аналізу", "pandas не потрібен для базових принципів — вбудований statistics і csv справжні й повністю робочі", "Наприкінці — як перейти на pandas локально, коли базові прийоми вже зрозумілі"] },
      { title: "Результат", points: ["20 уроків, кожен додає новий прийом аналізу", "Фінал: повний звіт по датасету продажів — статистика, групування, кореляція", "Потрібне знання файлів/CSV (Automation) і групування (Databases)"] },
    ],
  },
  {
    id: "py-dataanalysis-1",
    title: "Завантаження табличних даних",
    type: "python",
    theory:
      "Дані для аналізу зазвичай приходять як список словників — той самий формат, що вже використовувався в 🗄️ Databases: кожен словник — один рядок спостережень, ключі — назви показників:\n\nsales = [\n    {\"product\": \"Ноутбук\", \"category\": \"Електроніка\", \"price\": 25000},\n    {\"product\": \"Мишка\", \"category\": \"Електроніка\", \"price\": 300},\n    {\"product\": \"Стіл\", \"category\": \"Меблі\", \"price\": 4500},\n]\n\nЦе НАБІР ДАНИХ (dataset) — саме таку структуру пізніше очищують, фільтрують і аналізують. У реальних проєктах такі дані найчастіше завантажують із CSV-файлу через csv.DictReader (модуль csv, знайомий з Automation).",
    examples: [
      { title: "Набір даних як список словників", code: `sales = [\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Стіл", "category": "Меблі", "price": 4500},\n]\n\nprint(f"Рядків: {len(sales)}")\nprint(f"Перший запис: {sales[0]}")`, explain: "len(sales) — кількість спостережень; sales[0] — перший рядок цілком." },
    ],
    task: `Дано sales — список із трьох словників (product, category, price). Виведи f"Рядків: {len(sales)}" і f"Перший запис: {sales[0]}".`,
    starter: `sales = [\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Стіл", "category": "Меблі", "price": 4500},\n]\n\n# print(f"Рядків: {len(sales)}")\n# print(f"Перший запис: {sales[0]}")\n`,
    hints: [`len(sales) — кількість елементів списку.`, `sales[0] — перший словник цілком.`, `print(f"Рядків: {len(sales)}")\nprint(f"Перший запис: {sales[0]}")`],
    solution: `sales = [\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Стіл", "category": "Меблі", "price": 4500},\n]\n\nprint(f"Рядків: {len(sales)}")\nprint(f"Перший запис: {sales[0]}")`,
    testCode: `if not any("Рядків: 3" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «Рядків: 3»."}\nelif not any("Ноутбук" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведений перший запис має містити «Ноутбук»."}\nelse:\n    __result__ = {"pass": True, "message": "Список словників — стандартна форма табличних даних для аналізу в чистому Python."}`,
  },
  {
    id: "py-dataanalysis-2",
    title: "Перший огляд: head() і стовпці",
    type: "python",
    theory:
      "Перед будь-яким аналізом варто ШВИДКО глянути на дані: перші кілька рядків і повний список стовпців — саме це в pandas робить df.head(). Напишемо власний аналог:\n\ndef head(data, n=3):\n    return data[:n]\n\ndef columns(data):\n    return list(data[0].keys()) if data else []\n\nfor row in head(sales, 2):\n    print(row)\nprint(columns(sales))\n\ndata[:n] — зріз списку, той самий інструмент, що вже застосовувався для рядків тексту в Python Core.",
    examples: [
      { title: "head() і columns() як у pandas", code: `def head(data, n=3):\n    return data[:n]\n\ndef columns(data):\n    return list(data[0].keys()) if data else []\n\nfor row in head(sales, 2):\n    print(row)\nprint(columns(sales))`, explain: "head(sales, 2) показує лише перші 2 рядки — не всю таблицю одразу." },
    ],
    task: `Напиши head(data, n=3), що повертає data[:n], і columns(data), що повертає list(data[0].keys()) (або [] для порожніх даних). Виклич head(sales, 2) у циклі й виведи columns(sales).`,
    starter: `sales = [\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Стіл", "category": "Меблі", "price": 4500},\n]\n\ndef head(data, n=3):\n    # твій код тут\n    pass\n\ndef columns(data):\n    # твій код тут\n    pass\n\nfor row in head(sales, 2):\n    print(row)\nprint(columns(sales))\n`,
    hints: [`head: return data[:n]`, `columns: return list(data[0].keys()) if data else []`, `def head(data, n=3):\n    return data[:n]\n\ndef columns(data):\n    return list(data[0].keys()) if data else []`],
    solution: `sales = [\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Стіл", "category": "Меблі", "price": 4500},\n]\n\ndef head(data, n=3):\n    return data[:n]\n\ndef columns(data):\n    return list(data[0].keys()) if data else []\n\nfor row in head(sales, 2):\n    print(row)\nprint(columns(sales))`,
    testCode: `if "head" not in globals() or len(head(sales, 2)) != 2:\n    __result__ = {"pass": False, "message": "head(sales, 2) має повернути рівно 2 рядки."}\nelif "columns" not in globals() or set(columns(sales)) != {"product", "category", "price"}:\n    __result__ = {"pass": False, "message": "columns(sales) має повернути ['product', 'category', 'price']."}\nelif not any("price" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи columns(sales)."}\nelse:\n    __result__ = {"pass": True, "message": "head() і columns() — перше, що варто зробити з будь-яким новим набором даних."}`,
  },
  {
    id: "py-dataanalysis-3",
    title: "Мінімум і максимум",
    type: "python",
    theory:
      "min() і max() — вбудовані функції Python, що вже застосовувались раніше; для списку словників їм потрібен параметр key, що каже, ЯКЕ саме поле порівнювати:\n\ncheapest = min(sales, key=lambda r: r[\"price\"])\nmost_expensive = max(sales, key=lambda r: r[\"price\"])\n\nprint(cheapest[\"product\"])\nprint(most_expensive[\"product\"])\n\nБез key=... min()/max() намагались би порівняти самі СЛОВНИКИ між собою, що викликало б помилку — key= каже, ЗА ЯКИМ значенням проводити порівняння.",
    examples: [
      { title: "min/max за ключем", code: `sales = [\n    {"product": "Ноутбук", "price": 25000},\n    {"product": "Мишка", "price": 300},\n    {"product": "Стіл", "price": 4500},\n]\n\ncheapest = min(sales, key=lambda r: r["price"])\nmost_expensive = max(sales, key=lambda r: r["price"])\nprint(cheapest["product"])\nprint(most_expensive["product"])`, explain: "key=lambda r: r['price'] каже min()/max(), за яким полем шукати." },
    ],
    task: `Дано sales (три товари з price). Знайди cheapest = min(sales, key=lambda r: r["price"]) і most_expensive = max(sales, key=...). Виведи cheapest["product"] і most_expensive["product"].`,
    starter: `sales = [\n    {"product": "Ноутбук", "price": 25000},\n    {"product": "Мишка", "price": 300},\n    {"product": "Стіл", "price": 4500},\n]\n\n# cheapest = min(sales, key=lambda r: r["price"])\n# most_expensive = max(sales, key=lambda r: r["price"])\n# print(cheapest["product"])\n# print(most_expensive["product"])\n`,
    hints: [`min(sales, key=lambda r: r["price"])`, `max() з тим самим key.`, `cheapest = min(sales, key=lambda r: r["price"])\nmost_expensive = max(sales, key=lambda r: r["price"])\nprint(cheapest["product"])\nprint(most_expensive["product"])`],
    solution: `sales = [\n    {"product": "Ноутбук", "price": 25000},\n    {"product": "Мишка", "price": 300},\n    {"product": "Стіл", "price": 4500},\n]\n\ncheapest = min(sales, key=lambda r: r["price"])\nmost_expensive = max(sales, key=lambda r: r["price"])\nprint(cheapest["product"])\nprint(most_expensive["product"])`,
    testCode: `if "cheapest" not in globals() or cheapest["product"] != "Мишка":\n    __result__ = {"pass": False, "message": "cheapest має бути «Мишка» (найдешевший товар)."}\nelif "most_expensive" not in globals() or most_expensive["product"] != "Ноутбук":\n    __result__ = {"pass": False, "message": "most_expensive має бути «Ноутбук» (найдорожчий товар)."}\nelif not any("Мишка" in l for l in __logs) or not any("Ноутбук" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи обидва результати."}\nelse:\n    __result__ = {"pass": True, "message": "min/max з key= — базовий інструмент для «найбільше/найменше» в будь-якому наборі даних."}`,
  },
  {
    id: "py-dataanalysis-4",
    title: "Середнє значення (mean)",
    type: "python",
    theory:
      "Модуль statistics (вбудований у Python) містить готові функції для описової статистики — mean() рахує середнє арифметичне:\n\nimport statistics\n\nprices = [r[\"price\"] for r in sales]\naverage = statistics.mean(prices)\nprint(f\"Середня ціна: {average:.2f}\")\n\nЦе те саме, що sum(prices) / len(prices) із попередніх напрямків, тільки готовою функцією — і вона краще обробляє граничні випадки (наприклад, повертає правильний тип для дуже великих чисел).",
    examples: [
      { title: "statistics.mean()", code: `import statistics\n\nsales = [{"price": 100}, {"price": 200}, {"price": 300}]\nprices = [r["price"] for r in sales]\naverage = statistics.mean(prices)\nprint(f"Середня ціна: {average:.2f}")`, explain: "mean([100, 200, 300]) дає 200 — те саме, що sum()/len(), але готовою функцією." },
    ],
    task: `Дано sales із трьома товарами (price: 100, 200, 300). Порахуй prices (list comprehension) і average = statistics.mean(prices). Виведи f"Середня ціна: {average:.2f}".`,
    starter: `import statistics\n\nsales = [{"price": 100}, {"price": 200}, {"price": 300}]\n\n# prices = [r["price"] for r in sales]\n# average = statistics.mean(prices)\n# print(f"Середня ціна: {average:.2f}")\n`,
    hints: [`prices = [r["price"] for r in sales]`, `average = statistics.mean(prices)`, `prices = [r["price"] for r in sales]\naverage = statistics.mean(prices)\nprint(f"Середня ціна: {average:.2f}")`],
    solution: `import statistics\n\nsales = [{"price": 100}, {"price": 200}, {"price": 300}]\n\nprices = [r["price"] for r in sales]\naverage = statistics.mean(prices)\nprint(f"Середня ціна: {average:.2f}")`,
    testCode: `if not any("Середня ціна: 200.00" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «Середня ціна: 200.00»."}\nelse:\n    __result__ = {"pass": True, "message": "statistics.mean() — готова, перевірена функція для середнього значення."}`,
  },
  {
    id: "py-dataanalysis-5",
    title: "Медіана: стійкіша до викидів",
    type: "python",
    theory:
      "Медіана — значення РІВНО ПОСЕРЕДИНІ відсортованого набору даних. На відміну від середнього, медіана не «тягнеться» до аномально великих чи малих значень (викидів) — якщо один товар коштує в 100 разів дорожче за решту, середнє «підскочить», а медіана майже не зміниться:\n\nimport statistics\n\nprices = [100, 200, 300, 400, 100000]\nprint(statistics.mean(prices))    # сильно «перекошене» одним викидом\nprint(statistics.median(prices))  # набагато стабільніше",
    examples: [
      { title: "mean проти median з викидом", code: `import statistics\n\nprices = [100, 200, 300, 400, 100000]\nprint(statistics.mean(prices))\nprint(statistics.median(prices))`, explain: "Медіана (300) набагато краще відображає «типову» ціну, ніж середнє, спотворене одним аномальним значенням." },
    ],
    task: `Дано prices = [100, 200, 300, 400, 100000]. Виведи statistics.mean(prices) і statistics.median(prices).`,
    starter: `import statistics\n\nprices = [100, 200, 300, 400, 100000]\n\n# print(statistics.mean(prices))\n# print(statistics.median(prices))\n`,
    hints: [`statistics.mean(prices)`, `statistics.median(prices)`, `print(statistics.mean(prices))\nprint(statistics.median(prices))`],
    solution: `import statistics\n\nprices = [100, 200, 300, 400, 100000]\n\nprint(statistics.mean(prices))\nprint(statistics.median(prices))`,
    testCode: `if not any(l.strip() == "300" for l in __logs):\n    __result__ = {"pass": False, "message": "Медіана [100, 200, 300, 400, 100000] має дорівнювати 300."}\nelse:\n    __result__ = {"pass": True, "message": "Медіана лишається стабільною навіть коли одне значення сильно відрізняється від решти — на відміну від середнього."}`,
  },
  {
    id: "py-dataanalysis-6",
    title: "Мода: найпоширеніше значення",
    type: "python",
    theory:
      "Мода — значення, що зустрічається НАЙЧАСТІШЕ в наборі даних. Корисно для категоріальних (нечислових) даних — наприклад, яка категорія товару найпопулярніша:\n\nimport statistics\n\ncategories = [\"Електроніка\", \"Меблі\", \"Електроніка\", \"Одяг\", \"Електроніка\"]\nmost_common = statistics.mode(categories)\nprint(most_common)\n\nНа відміну від mean()/median(), mode() працює з БУДЬ-якими значеннями, що можна порівняти на рівність — не лише з числами.",
    examples: [
      { title: "statistics.mode() для категорій", code: `import statistics\n\ncategories = ["Електроніка", "Меблі", "Електроніка", "Одяг", "Електроніка"]\nmost_common = statistics.mode(categories)\nprint(most_common)`, explain: "«Електроніка» зустрічається тричі — частіше за решту, тому вона й мода." },
    ],
    task: `Дано categories = ["Електроніка", "Меблі", "Електроніка", "Одяг", "Електроніка"]. Виведи statistics.mode(categories).`,
    starter: `import statistics\n\ncategories = ["Електроніка", "Меблі", "Електроніка", "Одяг", "Електроніка"]\n\n# print(statistics.mode(categories))\n`,
    hints: [`statistics.mode(categories)`, `mode() працює і з рядками, не лише з числами.`, `print(statistics.mode(categories))`],
    solution: `import statistics\n\ncategories = ["Електроніка", "Меблі", "Електроніка", "Одяг", "Електроніка"]\n\nprint(statistics.mode(categories))`,
    testCode: `if not any("Електроніка" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Мода має бути «Електроніка» — вона зустрічається найчастіше."}\nelse:\n    __result__ = {"pass": True, "message": "mode() працює для категорій так само добре, як для чисел."}`,
  },
  {
    id: "py-dataanalysis-7",
    title: "Стандартне відхилення: наскільки розкидані дані",
    type: "python",
    theory:
      "Стандартне відхилення (standard deviation) показує, наскільки СИЛЬНО значення розкидані навколо середнього. Мале значення — дані близькі одне до одного; велике — сильно розкидані:\n\nimport statistics\n\nstable_prices = [100, 102, 98, 101, 99]\nvolatile_prices = [50, 150, 20, 200, 80]\n\nprint(statistics.stdev(stable_prices))    # маленьке число\nprint(statistics.stdev(volatile_prices))  # значно більше\n\nОбидва набори можуть мати ОДНАКОВЕ середнє, але зовсім різний розкид — stdev показує саме цю відмінність.",
    examples: [
      { title: "stdev показує розкид даних", code: `import statistics\n\nstable_prices = [100, 102, 98, 101, 99]\nvolatile_prices = [50, 150, 20, 200, 80]\n\nprint(round(statistics.stdev(stable_prices), 1))\nprint(round(statistics.stdev(volatile_prices), 1))`, explain: "Стабільні ціни дають маленьке stdev; мінливі — значно більше, навіть з подібним середнім." },
    ],
    task: `Дано stable_prices = [100, 102, 98, 101, 99] і volatile_prices = [50, 150, 20, 200, 80]. Виведи round(statistics.stdev(...), 1) для обох.`,
    starter: `import statistics\n\nstable_prices = [100, 102, 98, 101, 99]\nvolatile_prices = [50, 150, 20, 200, 80]\n\n# print(round(statistics.stdev(stable_prices), 1))\n# print(round(statistics.stdev(volatile_prices), 1))\n`,
    hints: [`statistics.stdev(список)`, `round(значення, 1) для одного знака після крапки.`, `print(round(statistics.stdev(stable_prices), 1))\nprint(round(statistics.stdev(volatile_prices), 1))`],
    solution: `import statistics\n\nstable_prices = [100, 102, 98, 101, 99]\nvolatile_prices = [50, 150, 20, 200, 80]\n\nprint(round(statistics.stdev(stable_prices), 1))\nprint(round(statistics.stdev(volatile_prices), 1))`,
    testCode: `import statistics\nstable_std = round(statistics.stdev([100, 102, 98, 101, 99]), 1)\nvolatile_std = round(statistics.stdev([50, 150, 20, 200, 80]), 1)\nif not any(str(stable_std) in l for l in __logs) or not any(str(volatile_std) in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи обидва округлені stdev-значення."}\nelif volatile_std <= stable_std:\n    __result__ = {"pass": False, "message": "volatile_prices мають дати значно БІЛЬШИЙ stdev, ніж stable_prices."}\nelse:\n    __result__ = {"pass": True, "message": "stdev показує розкид навколо середнього — ключова метрика, яку не дає саме лише mean()."}`,
  },
  {
    id: "py-dataanalysis-8",
    title: "Пропущені значення",
    type: "python",
    theory:
      "Реальні дані рідко бувають ідеальними — деякі значення можуть бути відсутні (None). Перед аналізом їх треба знайти й вирішити, що робити: пропустити рядок чи підставити значення за замовчуванням:\n\nsales = [{\"price\": 100}, {\"price\": None}, {\"price\": 300}]\n\nvalid_prices = [r[\"price\"] for r in sales if r[\"price\"] is not None]\nprint(valid_prices)\nprint(f\"Пропущено значень: {len(sales) - len(valid_prices)}\")\n\nПеревірка is not None (а не просто if r[\"price\"]) важлива: ціна 0 — теж «falsy» значення в Python, але це РЕАЛЬНЕ число, а не пропуск.",
    examples: [
      { title: "Фільтрація пропущених значень", code: `sales = [{"price": 100}, {"price": None}, {"price": 300}, {"price": 0}]\n\nvalid_prices = [r["price"] for r in sales if r["price"] is not None]\nprint(valid_prices)\nprint(f"Пропущено значень: {len(sales) - len(valid_prices)}")`, explain: "0 залишається у valid_prices (це справжня ціна), а None — прибирається." },
    ],
    task: `Дано sales = [{"price": 100}, {"price": None}, {"price": 300}, {"price": 0}]. Створи valid_prices через list comprehension з умовою is not None. Виведи valid_prices і f"Пропущено значень: {len(sales) - len(valid_prices)}".`,
    starter: `sales = [{"price": 100}, {"price": None}, {"price": 300}, {"price": 0}]\n\n# valid_prices = [r["price"] for r in sales if r["price"] is not None]\n# print(valid_prices)\n# print(f"Пропущено значень: {len(sales) - len(valid_prices)}")\n`,
    hints: [`[r["price"] for r in sales if r["price"] is not None]`, `is not None, а не просто if r["price"] — інакше 0 теж пропаде.`, `valid_prices = [r["price"] for r in sales if r["price"] is not None]\nprint(valid_prices)\nprint(f"Пропущено значень: {len(sales) - len(valid_prices)}")`],
    solution: `sales = [{"price": 100}, {"price": None}, {"price": 300}, {"price": 0}]\n\nvalid_prices = [r["price"] for r in sales if r["price"] is not None]\nprint(valid_prices)\nprint(f"Пропущено значень: {len(sales) - len(valid_prices)}")`,
    testCode: `if "valid_prices" not in globals() or valid_prices != [100, 300, 0]:\n    __result__ = {"pass": False, "message": "valid_prices має дорівнювати [100, 300, 0] — 0 лишається, None прибирається."}\nelif not any("Пропущено значень: 1" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «Пропущено значень: 1»."}\nelse:\n    __result__ = {"pass": True, "message": "is not None коректно відрізняє «немає даних» від справжнього нуля."}`,
  },
  {
    id: "py-dataanalysis-9",
    title: "Очищення «брудних» даних",
    type: "python",
    theory:
      "Значення часто приходять текстом, навіть коли мають бути числами — особливо з CSV чи веб-форм: \"25000\", \" 300 \" (із зайвим пробілом), чи взагалі \"н/д\". Напишемо clean_price(), що обробляє це через try/except (з Python Core):\n\ndef clean_price(value):\n    try:\n        return float(str(value).strip())\n    except ValueError:\n        return None\n\nprint(clean_price(\" 300 \"))\nprint(clean_price(\"н/д\"))\n\n.strip() прибирає зайві пробіли ПЕРЕД спробою перетворення — інакше навіть коректне число з пробілом викликало б ValueError.",
    examples: [
      { title: "clean_price() обробляє «брудні» значення", code: `def clean_price(value):\n    try:\n        return float(str(value).strip())\n    except ValueError:\n        return None\n\nprint(clean_price(" 300 "))\nprint(clean_price("н/д"))\nprint(clean_price(25000))`, explain: "Некоректний текст дає None замість аварійного завершення; число (навіть з пробілами) перетворюється правильно." },
    ],
    task: `Напиши clean_price(value) за прикладом. Виведи clean_price(" 300 "), clean_price("н/д"), clean_price(25000).`,
    starter: `def clean_price(value):\n    # твій код тут\n    pass\n\nprint(clean_price(" 300 "))\nprint(clean_price("н/д"))\nprint(clean_price(25000))\n`,
    hints: [`try: return float(str(value).strip())`, `except ValueError: return None`, `def clean_price(value):\n    try:\n        return float(str(value).strip())\n    except ValueError:\n        return None`],
    solution: `def clean_price(value):\n    try:\n        return float(str(value).strip())\n    except ValueError:\n        return None\n\nprint(clean_price(" 300 "))\nprint(clean_price("н/д"))\nprint(clean_price(25000))`,
    testCode: `if "clean_price" not in globals() or not callable(clean_price):\n    __result__ = {"pass": False, "message": "Потрібна функція clean_price(value)."}\nelif clean_price(" 300 ") != 300.0 or clean_price("н/д") is not None or clean_price(25000) != 25000.0:\n    __result__ = {"pass": False, "message": "clean_price повинна коректно очищати числа й давати None для некоректного тексту."}\nelif not any(l.strip() == "300.0" for l in __logs) or not any(l.strip() == "None" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи всі три результати."}\nelse:\n    __result__ = {"pass": True, "message": "Очищення даних — зазвичай найбільша частина роботи будь-якого реального аналізу."}`,
  },
  {
    id: "py-dataanalysis-10",
    title: "Фільтрація рядків за умовою",
    type: "python",
    theory:
      "Маючи чисті дані, легко відфільтрувати потрібні спостереження — той самий list comprehension, що вже застосовувався в кількох попередніх напрямках:\n\nexpensive = [r for r in sales if r[\"price\"] > 1000]\nelectronics = [r for r in sales if r[\"category\"] == \"Електроніка\"]\n\nМожна комбінувати кілька умов через and:\n\nexpensive_electronics = [r for r in sales if r[\"price\"] > 1000 and r[\"category\"] == \"Електроніка\"]",
    examples: [
      { title: "Комбінована фільтрація", code: `sales = [\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Диван", "category": "Меблі", "price": 15000},\n]\n\nexpensive_electronics = [r for r in sales if r["price"] > 1000 and r["category"] == "Електроніка"]\nprint([r["product"] for r in expensive_electronics])`, explain: "Умова з and вимагає ОБИДВІ частини одразу — і категорію, і ціну." },
    ],
    task: `Дано sales із трьома товарами. Створи expensive_electronics — товари з price > 1000 і category == "Електроніка". Виведи [r["product"] for r in expensive_electronics].`,
    starter: `sales = [\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Диван", "category": "Меблі", "price": 15000},\n]\n\n# expensive_electronics = [r for r in sales if ...]\n# print([r["product"] for r in expensive_electronics])\n`,
    hints: [`[r for r in sales if r["price"] > 1000 and r["category"] == "Електроніка"]`, `Обидві умови поєднуються через and.`, `expensive_electronics = [r for r in sales if r["price"] > 1000 and r["category"] == "Електроніка"]\nprint([r["product"] for r in expensive_electronics])`],
    solution: `sales = [\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Диван", "category": "Меблі", "price": 15000},\n]\n\nexpensive_electronics = [r for r in sales if r["price"] > 1000 and r["category"] == "Електроніка"]\nprint([r["product"] for r in expensive_electronics])`,
    testCode: `if "expensive_electronics" not in globals() or len(expensive_electronics) != 1 or expensive_electronics[0]["product"] != "Ноутбук":\n    __result__ = {"pass": False, "message": "expensive_electronics має містити лише «Ноутбук»."}\nelif not any("Ноутбук" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи результат через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Комбіновані умови у фільтрі — так аналітик відповідає на конкретні питання про дані."}`,
  },
  {
    id: "py-dataanalysis-11",
    title: "Групування з підрахунком суми",
    type: "python",
    theory:
      "revenue_by_category() групує продажі за категорією й одразу рахує СУМУ (не просто список рядків, як group_by у Databases) — та сама схема-накопичувач:\n\ndef revenue_by_category(sales):\n    result = {}\n    for r in sales:\n        cat = r[\"category\"]\n        result[cat] = result.get(cat, 0) + r[\"price\"]\n    return result\n\nrevenue = revenue_by_category(sales)\nfor cat, total in revenue.items():\n    print(f\"{cat}: {total}\")",
    examples: [
      { title: "revenue_by_category сумує по групах", code: `sales = [\n    {"category": "Електроніка", "price": 25000},\n    {"category": "Електроніка", "price": 300},\n    {"category": "Меблі", "price": 15000},\n]\n\ndef revenue_by_category(sales):\n    result = {}\n    for r in sales:\n        cat = r["category"]\n        result[cat] = result.get(cat, 0) + r["price"]\n    return result\n\nrevenue = revenue_by_category(sales)\nfor cat, total in revenue.items():\n    print(f"{cat}: {total}")`, explain: "Електроніка накопичує суму з ДВОХ товарів (25000 + 300), Меблі — з одного." },
    ],
    task: `Дано sales з трьома товарами (дві категорії). Напиши revenue_by_category(sales) за прикладом. Виведи кожну категорію з сумою.`,
    starter: `sales = [\n    {"category": "Електроніка", "price": 25000},\n    {"category": "Електроніка", "price": 300},\n    {"category": "Меблі", "price": 15000},\n]\n\ndef revenue_by_category(sales):\n    # твій код тут\n    pass\n\nrevenue = revenue_by_category(sales)\nfor cat, total in revenue.items():\n    print(f"{cat}: {total}")\n`,
    hints: [`result = {}; for r in sales: cat = r["category"]`, `result[cat] = result.get(cat, 0) + r["price"]`, `def revenue_by_category(sales):\n    result = {}\n    for r in sales:\n        cat = r["category"]\n        result[cat] = result.get(cat, 0) + r["price"]\n    return result`],
    solution: `sales = [\n    {"category": "Електроніка", "price": 25000},\n    {"category": "Електроніка", "price": 300},\n    {"category": "Меблі", "price": 15000},\n]\n\ndef revenue_by_category(sales):\n    result = {}\n    for r in sales:\n        cat = r["category"]\n        result[cat] = result.get(cat, 0) + r["price"]\n    return result\n\nrevenue = revenue_by_category(sales)\nfor cat, total in revenue.items():\n    print(f"{cat}: {total}")`,
    testCode: `if "revenue" not in globals() or revenue.get("Електроніка") != 25300 or revenue.get("Меблі") != 15000:\n    __result__ = {"pass": False, "message": "revenue має бути {'Електроніка': 25300, 'Меблі': 15000}."}\nelif not any("25300" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи суму по кожній категорії."}\nelse:\n    __result__ = {"pass": True, "message": "revenue_by_category() — базовий приклад «групування з агрегацією», серце будь-якого бізнес-звіту."}`,
  },
  {
    id: "py-dataanalysis-12",
    title: "Пошук найважливішого: топ-категорія",
    type: "python",
    theory:
      "Маючи revenue_by_category() (11-й урок), легко знайти категорію з НАЙБІЛЬШИМ доходом через max() з key= — той самий інструмент, що знаходив найдорожчий товар у 3-му уроці, тільки тепер застосований до словника:\n\ntop_category = max(revenue.items(), key=lambda item: item[1])\nprint(f\"Найприбутковіша категорія: {top_category[0]} ({top_category[1]})\")\n\nrevenue.items() дає пари (категорія, сума); key=lambda item: item[1] каже порівнювати саме за сумою (другим елементом пари), а не за назвою категорії.",
    examples: [
      { title: "Топ-категорія через max(items())", code: `revenue = {"Електроніка": 25300, "Меблі": 15000, "Одяг": 2000}\n\ntop_category = max(revenue.items(), key=lambda item: item[1])\nprint(f"Найприбутковіша категорія: {top_category[0]} ({top_category[1]})")`, explain: "top_category — кортеж (назва, сума); [0] — назва, [1] — сума." },
    ],
    task: `Дано revenue = {"Електроніка": 25300, "Меблі": 15000, "Одяг": 2000}. Знайди top_category через max(revenue.items(), key=...). Виведи f"Найприбутковіша категорія: {top_category[0]} ({top_category[1]})".`,
    starter: `revenue = {"Електроніка": 25300, "Меблі": 15000, "Одяг": 2000}\n\n# top_category = max(revenue.items(), key=lambda item: item[1])\n# print(f"Найприбутковіша категорія: {top_category[0]} ({top_category[1]})")\n`,
    hints: [`max(revenue.items(), key=lambda item: item[1])`, `item[1] — друге значення пари (сума).`, `top_category = max(revenue.items(), key=lambda item: item[1])\nprint(f"Найприбутковіша категорія: {top_category[0]} ({top_category[1]})")`],
    solution: `revenue = {"Електроніка": 25300, "Меблі": 15000, "Одяг": 2000}\n\ntop_category = max(revenue.items(), key=lambda item: item[1])\nprint(f"Найприбутковіша категорія: {top_category[0]} ({top_category[1]})")`,
    testCode: `if not any("Електроніка" in l and "25300" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись, що найприбутковіша категорія — Електроніка (25300)."}\nelse:\n    __result__ = {"pass": True, "message": "max() з key= на .items() — швидкий спосіб знайти «переможця» серед агрегованих груп."}`,
  },
  {
    id: "py-dataanalysis-13",
    title: "Сортування за кількома критеріями",
    type: "python",
    theory:
      "sorted() може сортувати одразу за КІЛЬКОМА полями — key повертає КОРТЕЖ, і Python порівнює елементи кортежу по черзі: спершу за першим, при рівності — за другим:\n\nsorted_sales = sorted(sales, key=lambda r: (r[\"category\"], -r[\"price\"]))\n\nЦе сортує спершу за категорією (за алфавітом), а ВСЕРЕДИНІ кожної категорії — за ціною від більшої до меншої (мінус перед r[\"price\"] «перевертає» звичайний порядок зростання на спадання, без reverse=True для всього списку).",
    examples: [
      { title: "Сортування за категорією, потім за ціною", code: `sales = [\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Диван", "category": "Меблі", "price": 15000},\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n]\n\nsorted_sales = sorted(sales, key=lambda r: (r["category"], -r["price"]))\nfor r in sorted_sales:\n    print(r["category"], r["product"], r["price"])`, explain: "Спершу йде Електроніка (за алфавітом раніше Меблів), а всередині неї — від дорожчого до дешевшого." },
    ],
    task: `Дано sales із трьох товарів. Відсортуй через sorted(sales, key=lambda r: (r["category"], -r["price"])) і виведи кожен рядок як "category product price".`,
    starter: `sales = [\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Диван", "category": "Меблі", "price": 15000},\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n]\n\n# sorted_sales = sorted(sales, key=lambda r: (r["category"], -r["price"]))\n# for r in sorted_sales:\n#     print(r["category"], r["product"], r["price"])\n`,
    hints: [`key=lambda r: (r["category"], -r["price"]) — кортеж із двох критеріїв.`, `Мінус перед price дає спадний порядок лише для ціни.`, `sorted_sales = sorted(sales, key=lambda r: (r["category"], -r["price"]))\nfor r in sorted_sales:\n    print(r["category"], r["product"], r["price"])`],
    solution: `sales = [\n    {"product": "Мишка", "category": "Електроніка", "price": 300},\n    {"product": "Диван", "category": "Меблі", "price": 15000},\n    {"product": "Ноутбук", "category": "Електроніка", "price": 25000},\n]\n\nsorted_sales = sorted(sales, key=lambda r: (r["category"], -r["price"]))\nfor r in sorted_sales:\n    print(r["category"], r["product"], r["price"])`,
    testCode: `products_order = [l.split()[1] for l in __logs if l.strip() and len(l.split()) >= 2]\nif products_order[:2] != ["Ноутбук", "Мишка"]:\n    __result__ = {"pass": False, "message": "Усередині Електроніки Ноутбук (25000) має йти ПЕРЕД Мишкою (300)."}\nelse:\n    __result__ = {"pass": True, "message": "Сортування кортежем — так дані впорядковують за кількома критеріями одним викликом sorted()."}`,
  },
  {
    id: "py-dataanalysis-14",
    title: "Частка від загального (відсотки)",
    type: "python",
    theory:
      "Абсолютні числа (25300 грн доходу) складно порівнювати без контексту — відсоток від загальної суми дає зрозумілішу картину:\n\ntotal_revenue = sum(revenue.values())\n\nfor cat, amount in revenue.items():\n    percent = amount / total_revenue * 100\n    print(f\"{cat}: {percent:.1f}%\")\n\nsum(revenue.values()) підсумовує ВСІ значення словника одразу — той самий прийом, що вже застосовувався для підрахунку статистики файлів в Automation.",
    examples: [
      { title: "Частка кожної категорії від загального доходу", code: `revenue = {"Електроніка": 25300, "Меблі": 15000, "Одяг": 2000}\n\ntotal_revenue = sum(revenue.values())\nfor cat, amount in revenue.items():\n    percent = amount / total_revenue * 100\n    print(f"{cat}: {percent:.1f}%")`, explain: "Сума всіх відсотків завжди дає рівно 100% (з точністю до округлення)." },
    ],
    task: `Дано revenue = {"Електроніка": 25300, "Меблі": 15000, "Одяг": 2000}. Порахуй total_revenue = sum(revenue.values()). Виведи кожну категорію з відсотком у форматі "category: X.X%".`,
    starter: `revenue = {"Електроніка": 25300, "Меблі": 15000, "Одяг": 2000}\n\n# total_revenue = sum(revenue.values())\n# for cat, amount in revenue.items():\n#     percent = amount / total_revenue * 100\n#     print(f"{cat}: {percent:.1f}%")\n`,
    hints: [`total_revenue = sum(revenue.values())`, `percent = amount / total_revenue * 100`, `total_revenue = sum(revenue.values())\nfor cat, amount in revenue.items():\n    percent = amount / total_revenue * 100\n    print(f"{cat}: {percent:.1f}%")`],
    solution: `revenue = {"Електроніка": 25300, "Меблі": 15000, "Одяг": 2000}\n\ntotal_revenue = sum(revenue.values())\nfor cat, amount in revenue.items():\n    percent = amount / total_revenue * 100\n    print(f"{cat}: {percent:.1f}%")`,
    testCode: `if not any("%" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має бути виведено відсоткове значення (символ %)."}\nelif not any("Електроніка" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи кожну категорію з відсотком."}\nelse:\n    __result__ = {"pass": True, "message": "Відсотки від загального — так абсолютні числа перетворюють на зрозумілу картину частин цілого."}`,
  },
  {
    id: "py-dataanalysis-15",
    title: "Кореляція: чи пов'язані дві величини",
    type: "python",
    theory:
      "Кореляція показує, чи ЗМІНЮЮТЬСЯ РАЗОМ дві величини: коли одна зростає, чи зростає (чи спадає) інша. Проста реалізація — коефіцієнт кореляції Пірсона через statistics.correlation() (доступний у Python 3.10+):\n\nimport statistics\n\nprices = [100, 200, 300, 400]\nquantities_sold = [50, 40, 25, 10]\n\ncorrelation = statistics.correlation(prices, quantities_sold)\nprint(round(correlation, 2))\n\nЗначення від -1 до 1: близько до -1 означає «що дорожче, то менше купують» (обернений зв'язок), близько до 1 — «зростають разом», близько до 0 — зв'язку майже немає.",
    examples: [
      { title: "correlation() між ціною і продажами", code: `import statistics\n\nprices = [100, 200, 300, 400]\nquantities_sold = [50, 40, 25, 10]\n\ncorrelation = statistics.correlation(prices, quantities_sold)\nprint(round(correlation, 2))`, explain: "Від'ємна кореляція показує: що вища ціна, то менше купують — типова закономірність попиту." },
    ],
    task: `Дано prices = [100, 200, 300, 400] і quantities_sold = [50, 40, 25, 10]. Порахуй correlation = statistics.correlation(prices, quantities_sold) і виведи round(correlation, 2).`,
    starter: `import statistics\n\nprices = [100, 200, 300, 400]\nquantities_sold = [50, 40, 25, 10]\n\n# correlation = statistics.correlation(prices, quantities_sold)\n# print(round(correlation, 2))\n`,
    hints: [`statistics.correlation(список1, список2)`, `round(значення, 2) для двох знаків після крапки.`, `correlation = statistics.correlation(prices, quantities_sold)\nprint(round(correlation, 2))`],
    solution: `import statistics\n\nprices = [100, 200, 300, 400]\nquantities_sold = [50, 40, 25, 10]\n\ncorrelation = statistics.correlation(prices, quantities_sold)\nprint(round(correlation, 2))`,
    testCode: `if "correlation" not in globals() or correlation >= 0:\n    __result__ = {"pass": False, "message": "correlation має бути ВІД'ЄМНИМ числом — що вища ціна, то менше продажів."}\nelse:\n    __result__ = {"pass": True, "message": "Кореляція — інструмент, що показує зв'язок між величинами, не пояснюючи ЧОМУ він існує."}`,
  },
  {
    id: "py-dataanalysis-16",
    title: "Зведена таблиця: сума, кількість і середнє разом",
    type: "python",
    theory:
      "Зведена таблиця (pivot table) — один звіт, що показує ОДРАЗУ кілька агрегатних показників по кожній групі: суму, кількість, середнє. Об'єднаємо все з попередніх уроків в один словник на категорію:\n\ndef pivot(sales):\n    groups = {}\n    for r in sales:\n        cat = r[\"category\"]\n        groups.setdefault(cat, []).append(r[\"price\"])\n    return {\n        cat: {\"total\": sum(prices), \"count\": len(prices), \"avg\": sum(prices) / len(prices)}\n        for cat, prices in groups.items()\n    }\n\nЦе dict comprehension (компактний запис словника, аналогічний list comprehension) — для кожної групи одразу рахує всі три показники.",
    examples: [
      { title: "pivot() дає total/count/avg разом", code: `sales = [\n    {"category": "Електроніка", "price": 25000},\n    {"category": "Електроніка", "price": 300},\n    {"category": "Меблі", "price": 15000},\n]\n\ndef pivot(sales):\n    groups = {}\n    for r in sales:\n        cat = r["category"]\n        groups.setdefault(cat, []).append(r["price"])\n    return {\n        cat: {"total": sum(prices), "count": len(prices), "avg": sum(prices) / len(prices)}\n        for cat, prices in groups.items()\n    }\n\nresult = pivot(sales)\nprint(result["Електроніка"])`, explain: "Одна структура даних одразу дає total, count і avg — не треба рахувати кожен показник окремим циклом." },
    ],
    task: `Дано sales із трьома товарами (дві категорії). Напиши pivot(sales) за прикладом. Виведи result["Електроніка"].`,
    starter: `sales = [\n    {"category": "Електроніка", "price": 25000},\n    {"category": "Електроніка", "price": 300},\n    {"category": "Меблі", "price": 15000},\n]\n\ndef pivot(sales):\n    # твій код тут\n    pass\n\nresult = pivot(sales)\nprint(result["Електроніка"])\n`,
    hints: [`groups = {}; for r in sales: groups.setdefault(r["category"], []).append(r["price"])`, `return {cat: {"total": sum(prices), "count": len(prices), "avg": sum(prices)/len(prices)} for cat, prices in groups.items()}`, `def pivot(sales):\n    groups = {}\n    for r in sales:\n        cat = r["category"]\n        groups.setdefault(cat, []).append(r["price"])\n    return {\n        cat: {"total": sum(prices), "count": len(prices), "avg": sum(prices) / len(prices)}\n        for cat, prices in groups.items()\n    }`],
    solution: `sales = [\n    {"category": "Електроніка", "price": 25000},\n    {"category": "Електроніка", "price": 300},\n    {"category": "Меблі", "price": 15000},\n]\n\ndef pivot(sales):\n    groups = {}\n    for r in sales:\n        cat = r["category"]\n        groups.setdefault(cat, []).append(r["price"])\n    return {\n        cat: {"total": sum(prices), "count": len(prices), "avg": sum(prices) / len(prices)}\n        for cat, prices in groups.items()\n    }\n\nresult = pivot(sales)\nprint(result["Електроніка"])`,
    testCode: `if "result" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція pivot(sales)."}\nelif result["Електроніка"] != {"total": 25300, "count": 2, "avg": 12650.0}:\n    __result__ = {"pass": False, "message": "result['Електроніка'] має бути {'total': 25300, 'count': 2, 'avg': 12650.0}."}\nelif not any("25300" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи result[\\"Електроніка\\"] через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Зведена таблиця — один звіт замість трьох окремих обчислень для кожного показника."}`,
  },
  {
    id: "py-dataanalysis-17",
    title: "Виявлення викидів",
    type: "python",
    theory:
      "Викид (outlier) — значення, що СИЛЬНО відрізняється від решти й може вказувати на помилку введення даних (чи справді унікальний випадок). Простий спосіб знайти викиди — порівняти кожне значення із середнім і стандартним відхиленням (з 7-го уроку):\n\nimport statistics\n\ndef find_outliers(values, threshold=2):\n    avg = statistics.mean(values)\n    std = statistics.stdev(values)\n    return [v for v in values if abs(v - avg) > threshold * std]\n\nprices = [100, 105, 98, 102, 99, 101, 5000]\nprint(find_outliers(prices))\n\nabs(v - avg) > threshold * std — значення вважається викидом, якщо воно ВІДДАЛЕНЕ від середнього більш ніж на threshold стандартних відхилень.",
    examples: [
      { title: "find_outliers() шукає аномалії", code: `import statistics\n\ndef find_outliers(values, threshold=2):\n    avg = statistics.mean(values)\n    std = statistics.stdev(values)\n    return [v for v in values if abs(v - avg) > threshold * std]\n\nprices = [100, 105, 98, 102, 99, 101, 5000]\nprint(find_outliers(prices))`, explain: "5000 суттєво відрізняється від решти близьких значень — знаходиться як викид." },
    ],
    task: `Напиши find_outliers(values, threshold=2) за прикладом. Дано prices = [100, 105, 98, 102, 99, 101, 5000]. Виведи find_outliers(prices).`,
    starter: `import statistics\n\ndef find_outliers(values, threshold=2):\n    # твій код тут\n    pass\n\nprices = [100, 105, 98, 102, 99, 101, 5000]\nprint(find_outliers(prices))\n`,
    hints: [`avg = statistics.mean(values); std = statistics.stdev(values)`, `return [v for v in values if abs(v - avg) > threshold * std]`, `def find_outliers(values, threshold=2):\n    avg = statistics.mean(values)\n    std = statistics.stdev(values)\n    return [v for v in values if abs(v - avg) > threshold * std]`],
    solution: `import statistics\n\ndef find_outliers(values, threshold=2):\n    avg = statistics.mean(values)\n    std = statistics.stdev(values)\n    return [v for v in values if abs(v - avg) > threshold * std]\n\nprices = [100, 105, 98, 102, 99, 101, 5000]\nprint(find_outliers(prices))`,
    testCode: `if "find_outliers" not in globals() or not callable(find_outliers):\n    __result__ = {"pass": False, "message": "Потрібна функція find_outliers(values, threshold=2)."}\nelif find_outliers([100, 105, 98, 102, 99, 101, 5000]) != [5000]:\n    __result__ = {"pass": False, "message": "find_outliers([100, 105, 98, 102, 99, 101, 5000]) має повернути [5000]."}\nelif not any("5000" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи результат find_outliers через print()."}\nelse:\n    __result__ = {"pass": True, "message": "find_outliers() — простий, але справжній спосіб знайти аномальні значення в даних."}`,
  },
  {
    id: "py-dataanalysis-18",
    title: "Генерація текстового звіту",
    type: "python",
    theory:
      "Об'єднаємо всі попередні прийоми в ОДНУ функцію, що формує читабельний звіт — багаторядковий текст, зібраний зі списку рядків через \"\\n\".join():\n\ndef generate_report(sales):\n    lines = []\n    lines.append(f\"Товарів: {len(sales)}\")\n    lines.append(f\"Загальний дохід: {sum(r['price'] for r in sales)}\")\n    lines.append(f\"Середня ціна: {statistics.mean(r['price'] for r in sales):.2f}\")\n    return \"\\n\".join(lines)\n\nprint(generate_report(sales))\n\n\"\\n\".join(список_рядків) склеює всі рядки списку в один текст, вставляючи перенос рядка МІЖ кожною парою — компактніше за ручні print() один за одним.",
    examples: [
      { title: "generate_report() формує звіт", code: `import statistics\n\nsales = [\n    {"price": 25000},\n    {"price": 300},\n    {"price": 15000},\n]\n\ndef generate_report(sales):\n    lines = []\n    lines.append(f"Товарів: {len(sales)}")\n    lines.append(f"Загальний дохід: {sum(r['price'] for r in sales)}")\n    lines.append(f"Середня ціна: {statistics.mean(r['price'] for r in sales):.2f}")\n    return "\\n".join(lines)\n\nprint(generate_report(sales))`, explain: "\"\\n\".join(lines) робить із трьох рядків один багаторядковий текст." },
    ],
    task: `Дано sales із трьома товарами. Напиши generate_report(sales) за прикладом. Виведи generate_report(sales).`,
    starter: `import statistics\n\nsales = [\n    {"price": 25000},\n    {"price": 300},\n    {"price": 15000},\n]\n\ndef generate_report(sales):\n    # твій код тут\n    pass\n\nprint(generate_report(sales))\n`,
    hints: [`lines = []; lines.append(f"Товарів: {len(sales)}")`, `"\\n".join(lines) наприкінці, після заповнення всіх рядків.`, `def generate_report(sales):\n    lines = []\n    lines.append(f"Товарів: {len(sales)}")\n    lines.append(f"Загальний дохід: {sum(r['price'] for r in sales)}")\n    lines.append(f"Середня ціна: {statistics.mean(r['price'] for r in sales):.2f}")\n    return "\\n".join(lines)`],
    solution: `import statistics\n\nsales = [\n    {"price": 25000},\n    {"price": 300},\n    {"price": 15000},\n]\n\ndef generate_report(sales):\n    lines = []\n    lines.append(f"Товарів: {len(sales)}")\n    lines.append(f"Загальний дохід: {sum(r['price'] for r in sales)}")\n    lines.append(f"Середня ціна: {statistics.mean(r['price'] for r in sales):.2f}")\n    return "\\n".join(lines)\n\nprint(generate_report(sales))`,
    testCode: `content = "".join(__logs)\nif "Товарів: 3" not in content or "Загальний дохід: 40300" not in content:\n    __result__ = {"pass": False, "message": "Звіт має містити «Товарів: 3» і «Загальний дохід: 40300»."}\nelse:\n    __result__ = {"pass": True, "message": "generate_report() — фінальна форма аналізу: не сирі числа, а читабельний текст для людини."}`,
  },
  {
    id: "py-dataanalysis-19",
    title: "Збереження звіту у файл",
    type: "python",
    theory:
      "Звіт варто ЗБЕРЕГТИ, а не лише вивести на екран — та сама техніка запису файлів, що вже застосовувалась в ⚙️ Automation:\n\nreport = generate_report(sales)\n\nwith open(\"report.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(report)\n\nprint(\"Звіт збережено у report.txt\")\n\nТепер звіт можна відкрити будь-яким текстовим редактором, надіслати колезі поштою чи прикріпити до автоматичного щоденного листа.",
    examples: [
      { title: "Збереження звіту у файл", code: `report = "Товарів: 3\\nЗагальний дохід: 40300"\n\nwith open("report.txt", "w", encoding="utf-8") as f:\n    f.write(report)\n\nprint("Звіт збережено у report.txt")\nprint(open("report.txt").read())`, explain: "Файл report.txt тепер містить точно той самий текст, що й виведений на екран." },
    ],
    task: `Дано report = "Товарів: 3\\nЗагальний дохід: 40300". Збережи його у файл "report.txt". Виведи "Звіт збережено у report.txt" і вміст файлу.`,
    starter: `report = "Товарів: 3\\nЗагальний дохід: 40300"\n\n# with open("report.txt", "w", encoding="utf-8") as f:\n#     f.write(report)\n\n# print("Звіт збережено у report.txt")\n# print(open("report.txt").read())\n`,
    hints: [`with open("report.txt", "w", encoding="utf-8") as f: f.write(report)`, `Потім прочитай файл назад через open("report.txt").read().`, `with open("report.txt", "w", encoding="utf-8") as f:\n    f.write(report)\nprint("Звіт збережено у report.txt")\nprint(open("report.txt").read())`],
    solution: `report = "Товарів: 3\\nЗагальний дохід: 40300"\n\nwith open("report.txt", "w", encoding="utf-8") as f:\n    f.write(report)\n\nprint("Звіт збережено у report.txt")\nprint(open("report.txt").read())`,
    testCode: `import os\nif not os.path.exists("report.txt"):\n    __result__ = {"pass": False, "message": "Файл report.txt має бути створений."}\nelse:\n    content = open("report.txt", encoding="utf-8").read()\n    if "40300" not in content:\n        __result__ = {"pass": False, "message": "Файл має містити текст звіту з «40300»."}\n    elif not any("збережено" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи підтвердження «Звіт збережено у report.txt»."}\n    else:\n        __result__ = {"pass": True, "message": "Звіт на диску — те, що робить аналіз даних корисним і ПІСЛЯ завершення скрипта."}`,
  },
  {
    id: "py-dataanalysis-20",
    title: "Фінальний проєкт: повний аналіз продажів",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків: очищення «брудних» цін, описова статистика (mean/median/stdev), групування з доходом за категорією, топ-категорія, кореляція ціни й кількості, і фінальний звіт, збережений у файл. Це і є повний аналіз продажів, обіцяний ще на вступній сторінці «Що це?».\n\nВесь цей код (статистика, групування, звіт) переноситься на pandas майже напряму: statistics.mean() → df['price'].mean(), revenue_by_category() → df.groupby('category')['price'].sum() — лише синтаксис компактніший, принцип ідентичний.",
    examples: [
      { title: "Повний аналіз з очищенням і звітом", code: `raw_sales = [\n    {"category": "Електроніка", "price": "25000"},\n    {"category": "Електроніка", "price": " 300 "},\n    {"category": "Меблі", "price": "н/д"},\n]\n\nsales = []\nfor r in raw_sales:\n    price = clean_price(r["price"])\n    if price is not None:\n        sales.append({"category": r["category"], "price": price})\n\nprint(len(sales))`, explain: "Рядок з «н/д» відкидається — залишаються лише коректні спостереження." },
    ],
    task: `Дано raw_sales із трьома записами (одна ціна некоректна — "н/д"). Використовуючи clean_price() (з 9-го уроку, вже в стартовому коді), очисти дані в sales (лише валідні). Виведи len(sales) і generate_report(sales) (з 18-го уроку, вже в стартовому коді).`,
    starter: `import statistics\n\ndef clean_price(value):\n    try:\n        return float(str(value).strip())\n    except ValueError:\n        return None\n\ndef generate_report(sales):\n    lines = []\n    lines.append(f"Товарів: {len(sales)}")\n    lines.append(f"Загальний дохід: {sum(r['price'] for r in sales):.2f}")\n    lines.append(f"Середня ціна: {statistics.mean(r['price'] for r in sales):.2f}")\n    return "\\n".join(lines)\n\nraw_sales = [\n    {"category": "Електроніка", "price": "25000"},\n    {"category": "Електроніка", "price": " 300 "},\n    {"category": "Меблі", "price": "н/д"},\n]\n\n# sales = []\n# for r in raw_sales:\n#     price = clean_price(r["price"])\n#     if price is not None:\n#         sales.append({"category": r["category"], "price": price})\n\n# print(len(sales))\n# print(generate_report(sales))\n`,
    hints: [`sales = []; for r in raw_sales: price = clean_price(r["price"])`, `if price is not None: sales.append({"category": r["category"], "price": price})`, `sales = []\nfor r in raw_sales:\n    price = clean_price(r["price"])\n    if price is not None:\n        sales.append({"category": r["category"], "price": price})\nprint(len(sales))\nprint(generate_report(sales))`],
    solution: `import statistics\n\ndef clean_price(value):\n    try:\n        return float(str(value).strip())\n    except ValueError:\n        return None\n\ndef generate_report(sales):\n    lines = []\n    lines.append(f"Товарів: {len(sales)}")\n    lines.append(f"Загальний дохід: {sum(r['price'] for r in sales):.2f}")\n    lines.append(f"Середня ціна: {statistics.mean(r['price'] for r in sales):.2f}")\n    return "\\n".join(lines)\n\nraw_sales = [\n    {"category": "Електроніка", "price": "25000"},\n    {"category": "Електроніка", "price": " 300 "},\n    {"category": "Меблі", "price": "н/д"},\n]\n\nsales = []\nfor r in raw_sales:\n    price = clean_price(r["price"])\n    if price is not None:\n        sales.append({"category": r["category"], "price": price})\n\nprint(len(sales))\nprint(generate_report(sales))`,
    testCode: `if "sales" not in globals() or len(sales) != 2:\n    __result__ = {"pass": False, "message": "sales має містити рівно 2 валідних записи (третій відкинуто через «н/д»)."}\nelif not any(l.strip() == "2" for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(sales) — має бути 2."}\nelif not any("25300" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Звіт має показати загальний дохід 25300.00 (25000 + 300)."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Повний аналіз: очищення, статистика, звіт — усе з нуля, крок за кроком за 20 уроків."}`,
    finalProject: {
      techs: ["Python 3", "statistics", "csv", "list/dict comprehension", "sorted() + lambda"],
      skills: [
        "Описова статистика: mean, median, mode, stdev",
        "Очищення «брудних» і пропущених даних",
        "Фільтрація та сортування за кількома критеріями",
        "Групування з агрегацією (сума, кількість, середнє)",
        "Проста кореляція між двома величинами",
        "Виявлення викидів і генерація текстового звіту",
      ],
      structure:
        "sales_analysis.py\n  ├── clean_price(value)          # очищення «брудних» цін\n  ├── revenue_by_category(sales)   # групування з сумою\n  ├── pivot(sales)                  # total/count/avg разом\n  ├── find_outliers(values)          # виявлення аномалій\n  └── generate_report(sales)          # фінальний текстовий звіт",
      code: `import statistics


def clean_price(value):
    try:
        return float(str(value).strip())
    except ValueError:
        return None


def revenue_by_category(sales):
    result = {}
    for r in sales:
        cat = r["category"]
        result[cat] = result.get(cat, 0) + r["price"]
    return result


def find_outliers(values, threshold=2):
    avg = statistics.mean(values)
    std = statistics.stdev(values)
    return [v for v in values if abs(v - avg) > threshold * std]


def generate_report(sales):
    prices = [r["price"] for r in sales]
    revenue = revenue_by_category(sales)
    top_category = max(revenue.items(), key=lambda item: item[1])

    lines = [
        f"Товарів: {len(sales)}",
        f"Загальний дохід: {sum(prices):.2f}",
        f"Середня ціна: {statistics.mean(prices):.2f}",
        f"Медіана ціни: {statistics.median(prices):.2f}",
        f"Найприбутковіша категорія: {top_category[0]} ({top_category[1]:.2f})",
    ]
    return "\\n".join(lines)


if __name__ == "__main__":
    raw_sales = [
        {"category": "Електроніка", "price": "25000"},
        {"category": "Електроніка", "price": " 300 "},
        {"category": "Меблі", "price": "н/д"},
        {"category": "Меблі", "price": "15000"},
    ]

    sales = []
    for r in raw_sales:
        price = clean_price(r["price"])
        if price is not None:
            sales.append({"category": r["category"], "price": price})

    report = generate_report(sales)
    print(report)

    with open("report.txt", "w", encoding="utf-8") as f:
        f.write(report)`,
      runCommand: "python sales_analysis.py",
      installGuide: {
        intro:
          "statistics і csv вбудовані в реальний Python — нічого встановлювати не потрібно, щоб запустити ЦЕЙ код локально. pandas додатково потрібен лише тоді, коли працюєш із СПРАВДІ великими файлами (сотні тисяч рядків) і хочеш компактніший синтаксис.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text: "Зайди на python.org/downloads і встанови останню версію. Windows: галочка «Add python.exe to PATH».",
            code: null,
          },
          {
            title: "2. (Опційно) встанови pandas для великих датасетів",
            text: "Для файлів на десятки тисяч рядків і зручнішого синтаксису:",
            code: "pip install pandas",
          },
          {
            title: "3. Порівняй: той самий аналіз на pandas",
            text:
              "Принцип ідентичний — лише синтаксис компактніший. Дані з CSV читаються одразу в структуру, схожу на список словників, тільки з готовими методами статистики.",
            code: `import pandas as pd

df = pd.read_csv("sales.csv")
print(df["price"].mean())
print(df.groupby("category")["price"].sum())
print(df.corr(numeric_only=True))`,
          },
          {
            title: "4. Запусти скрипт",
            text: "Обидва варіанти (чистий Python чи pandas) дають той самий результат — звіт з'явиться і в консолі, і у файлі report.txt.",
            code: "python sales_analysis.py",
          },
        ],
      },
      improvements: [
        "Перейти на pandas для дуже великих файлів (сотні тисяч+ рядків) — набагато швидше за чисті цикли Python",
        "Додати візуалізацію (графіки) через matplotlib замість текстового звіту",
        "Читати дані напряму з CSV-файлу через csv.DictReader замість списку словників у коді",
        "Додати експорт звіту в CSV чи Excel для подальшої роботи в таблицях",
      ],
      nextLevel:
        "Далі — 📈 Data Science: описова статистика — лише перший крок; наступний рівень — побудова моделей, які не просто ОПИСУЮТЬ дані, а роблять ПРОГНОЗИ на їх основі.",
    },
  },
];
