// Python Data Science — the eleventh Python direction. Same intro + 20
// lessons structure. Where 📊 Data Analysis stopped at DESCRIBING data
// (mean, median, groups, correlation), this direction goes one step
// further: building small predictive models — linear regression and
// k-means clustering — completely FROM SCRATCH using only math/random/
// statistics. Real projects reach for numpy/pandas/scikit-learn, but
// those are large compiled packages this sandbox's Pyodide build can't
// fetch (confirmed directly: `import numpy` fails with "await
// pyodide.loadPackage('numpy') in JavaScript", and this app's checker
// never calls loadPackage). Building the formulas by hand is not just a
// workaround here — it's genuinely how you understand what scikit-learn
// does UNDER the hood, so the install guide at the end shows the exact
// same regression/clustering translated into real numpy/sklearn calls.
export const PYTHON_DATA_SCIENCE_LESSONS = [
  {
    id: "py-datascience-intro",
    title: "Що це? — Data Science",
    type: "intro",
    theory:
      "Python Data Science — це напрямок про ПРОГНОЗУВАННЯ, а не лише опис. 📊 Data Analysis навчив рахувати середнє, знаходити викиди й групувати дані за категоріями — усе це описує те, що ВЖЕ сталося. Data Science йде далі: будує МОДЕЛЬ, яка передбачає нове значення (яка буде ціна будинку такої площі?) або знаходить приховану структуру в даних (які будинки схожі між собою?).\n\nУ реальних проєктах для цього беруть numpy, pandas і scikit-learn. Тут вони НЕ підключаються з тієї самої причини, що й pandas у Data Analysis і sqlite3 у Databases: це великі скомпільовані пакети, які довелось би завантажити з заблокованого в цій пісочниці CDN (перевірено напряму — import numpy падає з помилкою про await pyodide.loadPackage(), якого немає в цьому застосунку). Тому всі 20 уроків будують лінійну регресію й кластеризацію k-means «на пальцях» — рядок за рядком, формула за формулою, без жодної готової ML-бібліотеки. Це не гірше за scikit-learn — це показує, ЩО САМЕ відбувається всередині, коли викликаєш LinearRegression().fit().\n\nЩо знадобиться з попередніх напрямків: statistics.mean/stdev і кореляція (📊 Data Analysis), списки й функції (Python Core), робота з класами не потрібна — усе на функціях. Що буде після 20 уроків: повний, робочий house_price_predictor.py — лінійна регресія для прогнозу ціни будинку за площею, k-means для сегментації будинків на «бюджетні» й «преміум», з install-гайдом переходу на справжній numpy/scikit-learn.",
    presentation: [
      { title: "Data Science — коротко", points: ["Крок від опису даних до ПРОГНОЗУВАННЯ — лінійна регресія й кластеризація", "numpy/pandas/scikit-learn не потрібні — все будується вручну через формули", "Наприкінці — як той самий код виглядає на справжньому scikit-learn"] },
      { title: "Результат", points: ["20 уроків: train/test split → регресія → метрики якості → кластеризація", "Фінал: house_price_predictor.py — прогноз ціни й сегментація будинків", "Потрібне знання statistics (📊 Data Analysis) і функцій (🐍 Python Core)"] },
    ],
  },
  {
    id: "py-datascience-1",
    title: "Розбиття на тренувальні й тестові дані",
    type: "python",
    theory:
      "Перше правило будь-якого прогнозування: НІКОЛИ не перевіряй модель на тих самих даних, на яких вона навчалась — це як здавати іспит з відповідями на руках. Дані ділять на train (тренувальні, на них модель вчиться) і test (тестові, на них перевіряють, чи справді модель узагальнює, а не просто «запам'ятала» приклади):\n\nimport random\n\nrandom.seed(1)\nshuffled = houses[:]\nrandom.shuffle(shuffled)\n\nsplit_idx = int(len(shuffled) * 0.8)\ntrain = shuffled[:split_idx]\ntest = shuffled[split_idx:]\n\nrandom.seed(1) робить перемішування ВІДТВОРЮВАНИМ — той самий код завжди дасть той самий поділ, що критично для перевірки правильності рішення.",
    examples: [
      { title: "80/20 розбиття", code: `import random\n\nhouses = [\n    {"area": 40, "price": 60},\n    {"area": 55, "price": 82},\n    {"area": 70, "price": 100},\n    {"area": 85, "price": 120},\n    {"area": 100, "price": 145},\n    {"area": 120, "price": 175},\n]\n\nrandom.seed(1)\nshuffled = houses[:]\nrandom.shuffle(shuffled)\n\nsplit_idx = int(len(shuffled) * 0.8)\ntrain = shuffled[:split_idx]\ntest = shuffled[split_idx:]\n\nprint(len(train), len(test))`, explain: "6 будинків → 4 у train (80%), 2 у test (20%) — з фіксованим random.seed(1) для відтворюваності." },
    ],
    task: `Дано houses (6 будинків). Постав random.seed(1), перемішай копію houses через random.shuffle(), поділи на train (перші 80%) і test (решта). Виведи len(train) і len(test) через один print().`,
    starter: `import random\n\nhouses = [\n    {"area": 40, "price": 60},\n    {"area": 55, "price": 82},\n    {"area": 70, "price": 100},\n    {"area": 85, "price": 120},\n    {"area": 100, "price": 145},\n    {"area": 120, "price": 175},\n]\n\n# random.seed(1)\n# shuffled = houses[:]\n# random.shuffle(shuffled)\n\n# split_idx = int(len(shuffled) * 0.8)\n# train = shuffled[:split_idx]\n# test = shuffled[split_idx:]\n\n# print(len(train), len(test))\n`,
    hints: [`random.seed(1) ПЕРЕД random.shuffle(shuffled) — інакше поділ щоразу буде інший.`, `split_idx = int(len(shuffled) * 0.8); train = shuffled[:split_idx]; test = shuffled[split_idx:]`, `random.seed(1)\nshuffled = houses[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain = shuffled[:split_idx]\ntest = shuffled[split_idx:]\nprint(len(train), len(test))`],
    solution: `import random\n\nhouses = [\n    {"area": 40, "price": 60},\n    {"area": 55, "price": 82},\n    {"area": 70, "price": 100},\n    {"area": 85, "price": 120},\n    {"area": 100, "price": 145},\n    {"area": 120, "price": 175},\n]\n\nrandom.seed(1)\nshuffled = houses[:]\nrandom.shuffle(shuffled)\n\nsplit_idx = int(len(shuffled) * 0.8)\ntrain = shuffled[:split_idx]\ntest = shuffled[split_idx:]\n\nprint(len(train), len(test))`,
    testCode: `if "train" not in globals() or "test" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні train і test."}\nelif len(train) != 4 or len(test) != 2:\n    __result__ = {"pass": False, "message": "При random.seed(1) train має містити 4 будинки, test — 2."}\nelif not any(h["area"] == 100 for h in test):\n    __result__ = {"pass": False, "message": "З random.seed(1) test має містити будинок з area=100 — перевір, чи seed() викликаний ПЕРЕД shuffle()."}\nelif not any("4 2" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи len(train) і len(test) разом: print(len(train), len(test))."}\nelse:\n    __result__ = {"pass": True, "message": "train/test split — перше правило: модель ніколи не перевіряють на даних, які вона вже бачила."}`,
  },
  {
    id: "py-datascience-2",
    title: "Нормалізація Min-Max",
    type: "python",
    theory:
      "Якщо одна ознака виміряна в тисячах (площа будинку), а інша в одиницях (кількість кімнат), моделі, засновані на відстані (наприклад, кластеризація), несправедливо надають перевагу ознаці з великими числами. Min-max нормалізація масштабує будь-яку ознаку в діапазон [0, 1]:\n\ndef min_max_normalize(values):\n    mn, mx = min(values), max(values)\n    return [(v - mn) / (mx - mn) for v in values]\n\nareas = [h[\"area\"] for h in houses]\nnorm = min_max_normalize(areas)\nprint(norm)\n\nНайменше значення завжди стає 0.0, найбільше — 1.0, решта — пропорційно між ними.",
    examples: [
      { title: "min_max_normalize()", code: `houses = [{"area": 40}, {"area": 55}, {"area": 70}, {"area": 85}, {"area": 100}, {"area": 120}]\n\ndef min_max_normalize(values):\n    mn, mx = min(values), max(values)\n    return [(v - mn) / (mx - mn) for v in values]\n\nareas = [h["area"] for h in houses]\nnorm = min_max_normalize(areas)\nprint([round(n, 4) for n in norm])`, explain: "Найменша площа (40) стає 0.0, найбільша (120) — 1.0." },
    ],
    task: `Напиши min_max_normalize(values), що масштабує список у [0, 1] за формулою (v - min) / (max - min). Застосуй до areas з houses і виведи округлений до 4 знаків результат.`,
    starter: `houses = [{"area": 40}, {"area": 55}, {"area": 70}, {"area": 85}, {"area": 100}, {"area": 120}]\n\ndef min_max_normalize(values):\n    # твій код тут\n    pass\n\nareas = [h["area"] for h in houses]\nnorm = min_max_normalize(areas)\nprint([round(n, 4) for n in norm])\n`,
    hints: [`mn, mx = min(values), max(values)`, `return [(v - mn) / (mx - mn) for v in values]`, `def min_max_normalize(values):\n    mn, mx = min(values), max(values)\n    return [(v - mn) / (mx - mn) for v in values]`],
    solution: `houses = [{"area": 40}, {"area": 55}, {"area": 70}, {"area": 85}, {"area": 100}, {"area": 120}]\n\ndef min_max_normalize(values):\n    mn, mx = min(values), max(values)\n    return [(v - mn) / (mx - mn) for v in values]\n\nareas = [h["area"] for h in houses]\nnorm = min_max_normalize(areas)\nprint([round(n, 4) for n in norm])`,
    testCode: `if "min_max_normalize" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція min_max_normalize(values)."}\nelif min_max_normalize([40, 120]) != [0.0, 1.0]:\n    __result__ = {"pass": False, "message": "min_max_normalize([40, 120]) має дати [0.0, 1.0]."}\nelif not any("0.1875" in l for l in __logs):\n    __result__ = {"pass": False, "message": "norm має містити 0.1875 (для area=55) — виведи округлений результат."}\nelse:\n    __result__ = {"pass": True, "message": "Min-max — найпростіший спосіб зробити ознаки порівнюваними одна з одною."}`,
  },
  {
    id: "py-datascience-3",
    title: "Стандартизація (z-score)",
    type: "python",
    theory:
      "Інший спосіб масштабування — z-score (стандартизація): скільки стандартних відхилень значення відстоїть від середнього. На відміну від min-max, результат НЕ обмежений діапазоном [0, 1] і краще підходить, коли в даних можуть бути майбутні значення за межами поточного min/max:\n\nimport statistics\n\ndef z_score(values):\n    mean = statistics.mean(values)\n    std = statistics.stdev(values)\n    return [(v - mean) / std for v in values]\n\nareas = [h[\"area\"] for h in houses]\nprint([round(z, 4) for z in z_score(areas)])\n\nПісля z-score середнє нових значень завжди ≈ 0, а стандартне відхилення ≈ 1.",
    examples: [
      { title: "z_score()", code: `import statistics\n\nhouses = [{"area": 40}, {"area": 55}, {"area": 70}, {"area": 85}, {"area": 100}, {"area": 120}]\n\ndef z_score(values):\n    mean = statistics.mean(values)\n    std = statistics.stdev(values)\n    return [(v - mean) / std for v in values]\n\nareas = [h["area"] for h in houses]\nprint([round(z, 4) for z in z_score(areas)])`, explain: "Найменша площа дає від'ємний z-score, найбільша — додатний, середня — близько 0." },
    ],
    task: `Напиши z_score(values) за формулою (v - mean) / stdev. Застосуй до areas з houses і виведи округлений до 4 знаків результат.`,
    starter: `import statistics\n\nhouses = [{"area": 40}, {"area": 55}, {"area": 70}, {"area": 85}, {"area": 100}, {"area": 120}]\n\ndef z_score(values):\n    # твій код тут\n    pass\n\nareas = [h["area"] for h in houses]\nprint([round(z, 4) for z in z_score(areas)])\n`,
    hints: [`mean = statistics.mean(values); std = statistics.stdev(values)`, `return [(v - mean) / std for v in values]`, `def z_score(values):\n    mean = statistics.mean(values)\n    std = statistics.stdev(values)\n    return [(v - mean) / std for v in values]`],
    solution: `import statistics\n\nhouses = [{"area": 40}, {"area": 55}, {"area": 70}, {"area": 85}, {"area": 100}, {"area": 120}]\n\ndef z_score(values):\n    mean = statistics.mean(values)\n    std = statistics.stdev(values)\n    return [(v - mean) / std for v in values]\n\nareas = [h["area"] for h in houses]\nprint([round(z, 4) for z in z_score(areas)])`,
    testCode: `if "z_score" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція z_score(values)."}\nelif not any("-1.3021" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Перше значення (area=40) має дати z-score приблизно -1.3021."}\nelse:\n    __result__ = {"pass": True, "message": "z-score — масштабування, що зберігає інформацію про викиди (на відміну від min-max)."}`,
  },
  {
    id: "py-datascience-4",
    title: "Коваріація: чи рухаються дві змінні разом",
    type: "python",
    theory:
      "Коваріація показує, чи РАЗОМ змінюються дві величини: якщо зі зростанням площі майже завжди зростає й ціна — коваріація додатна; якщо навпаки — від'ємна; якщо зв'язку немає — близька до нуля:\n\ndef covariance(xs, ys):\n    mx = sum(xs) / len(xs)\n    my = sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\nareas = [h[\"area\"] for h in houses]\nprices = [h[\"price\"] for h in houses]\nprint(f\"{covariance(areas, prices):.2f}\")\n\nЦе перший з двох будівельних блоків лінійної регресії (другий — variance, у наступних уроках).",
    examples: [
      { title: "covariance()", code: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\ndef covariance(xs, ys):\n    mx = sum(xs) / len(xs)\n    my = sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\nareas = [h["area"] for h in houses]\nprices = [h["price"] for h in houses]\nprint(f"{covariance(areas, prices):.2f}")`, explain: "Додатна коваріація (1237.33) — площа й ціна зростають РАЗОМ." },
    ],
    task: `Напиши covariance(xs, ys) за формулою. Застосуй до areas і prices з houses. Виведи f"{covariance(areas, prices):.2f}".`,
    starter: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\ndef covariance(xs, ys):\n    # твій код тут\n    pass\n\nareas = [h["area"] for h in houses]\nprices = [h["price"] for h in houses]\n# print(f"{covariance(areas, prices):.2f}")\n`,
    hints: [`mx = sum(xs) / len(xs); my = sum(ys) / len(ys)`, `return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)`, `def covariance(xs, ys):\n    mx = sum(xs) / len(xs)\n    my = sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)`],
    solution: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\ndef covariance(xs, ys):\n    mx = sum(xs) / len(xs)\n    my = sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\nareas = [h["area"] for h in houses]\nprices = [h["price"] for h in houses]\nprint(f"{covariance(areas, prices):.2f}")`,
    testCode: `if "covariance" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція covariance(xs, ys)."}\nelif not any("1237.33" in l for l in __logs):\n    __result__ = {"pass": False, "message": "covariance(areas, prices) має дати 1237.33."}\nelse:\n    __result__ = {"pass": True, "message": "Коваріація — перша цеглинка лінійної регресії: наскільки узгоджено рухаються дві величини."}`,
  },
  {
    id: "py-datascience-5",
    title: "Кореляція вручну: перевір себе через statistics",
    type: "python",
    theory:
      "У 📊 Data Analysis кореляцію рахували готовою statistics.correlation(). Тепер побудуємо ту саму формулу вручну: кореляція = коваріація, поділена на добуток стандартних відхилень обох змінних. Результат завжди в межах [-1, 1] — на відміну від коваріації, яка залежить від одиниць вимірювання:\n\nimport statistics\n\ndef correlation(xs, ys):\n    cov = covariance(xs, ys)\n    return cov / (statistics.stdev(xs) * statistics.stdev(ys))\n\nprint(correlation(areas, prices))\nprint(statistics.correlation(areas, prices))  # має збігтись\n\nЯкщо ручна формула правильна, обидва рядки виведуть майже те саме число — хороший спосіб перевірити себе.",
    examples: [
      { title: "Ручна кореляція = statistics.correlation()", code: `import statistics\n\nhouses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\nareas = [h["area"] for h in houses]\nprices = [h["price"] for h in houses]\n\ndef covariance(xs, ys):\n    mx = sum(xs) / len(xs)\n    my = sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\ndef correlation(xs, ys):\n    cov = covariance(xs, ys)\n    return cov / (statistics.stdev(xs) * statistics.stdev(ys))\n\nprint(f"{correlation(areas, prices):.4f}")\nprint(f"{statistics.correlation(areas, prices):.4f}")`, explain: "0.9988 в обох рядках — ручна формула правильна." },
    ],
    task: `Напиши correlation(xs, ys), що ділить covariance(xs, ys) на добуток statistics.stdev(xs) і statistics.stdev(ys). Виведи correlation(areas, prices) і statistics.correlation(areas, prices), обидва з точністю :.4f.`,
    starter: `import statistics\n\nhouses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\nareas = [h["area"] for h in houses]\nprices = [h["price"] for h in houses]\n\ndef covariance(xs, ys):\n    mx = sum(xs) / len(xs)\n    my = sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\ndef correlation(xs, ys):\n    # твій код тут\n    pass\n\n# print(f"{correlation(areas, prices):.4f}")\n# print(f"{statistics.correlation(areas, prices):.4f}")\n`,
    hints: [`cov = covariance(xs, ys)`, `return cov / (statistics.stdev(xs) * statistics.stdev(ys))`, `def correlation(xs, ys):\n    cov = covariance(xs, ys)\n    return cov / (statistics.stdev(xs) * statistics.stdev(ys))`],
    solution: `import statistics\n\nhouses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\nareas = [h["area"] for h in houses]\nprices = [h["price"] for h in houses]\n\ndef covariance(xs, ys):\n    mx = sum(xs) / len(xs)\n    my = sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\ndef correlation(xs, ys):\n    cov = covariance(xs, ys)\n    return cov / (statistics.stdev(xs) * statistics.stdev(ys))\n\nprint(f"{correlation(areas, prices):.4f}")\nprint(f"{statistics.correlation(areas, prices):.4f}")`,
    testCode: `if "correlation" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція correlation(xs, ys)."}\nelif abs(correlation(areas, prices) - statistics.correlation(areas, prices)) > 0.001:\n    __result__ = {"pass": False, "message": "correlation(areas, prices) має збігатись зі statistics.correlation(areas, prices)."}\nelif not any("0.9988" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Обидва результати мають дорівнювати приблизно 0.9988."}\nelse:\n    __result__ = {"pass": True, "message": "Ручна формула збіглась із бібліотечною — кореляція правильно побудована з коваріації."}`,
  },
  {
    id: "py-datascience-6",
    title: "Нахил лінії регресії (slope)",
    type: "python",
    theory:
      "Лінійна регресія шукає ПРЯМУ ЛІНІЮ, яка найкраще проходить крізь точки даних: price = slope * area + intercept. Нахил (slope) показує, на скільки в середньому змінюється price при збільшенні area на одиницю — рахується як коваріація, поділена на дисперсію (variance) x:\n\ndef variance(xs):\n    mx = sum(xs) / len(xs)\n    return sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n\nslope = covariance(areas, prices) / variance(areas)\nprint(f\"{slope:.4f}\")\n\nvariance(xs) — це те саме, що statistics.stdev(xs) ** 2, тільки виражене через ту саму формулу, що й covariance, для симетрії.",
    examples: [
      { title: "slope = cov / var", code: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\nareas = [h["area"] for h in houses]\nprices = [h["price"] for h in houses]\n\ndef covariance(xs, ys):\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\ndef variance(xs):\n    mx = sum(xs) / len(xs)\n    return sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n\nslope = covariance(areas, prices) / variance(areas)\nprint(f"{slope:.4f}")`, explain: "slope ≈ 1.4277 — кожен додатковий м² площі в середньому додає 1.4277 до ціни." },
    ],
    task: `Напиши variance(xs) за формулою. Порахуй slope = covariance(areas, prices) / variance(areas) (covariance вже дано в starter). Виведи f"{slope:.4f}".`,
    starter: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\nareas = [h["area"] for h in houses]\nprices = [h["price"] for h in houses]\n\ndef covariance(xs, ys):\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\ndef variance(xs):\n    # твій код тут\n    pass\n\n# slope = covariance(areas, prices) / variance(areas)\n# print(f"{slope:.4f}")\n`,
    hints: [`mx = sum(xs) / len(xs)`, `return sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)`, `def variance(xs):\n    mx = sum(xs) / len(xs)\n    return sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n\nslope = covariance(areas, prices) / variance(areas)\nprint(f"{slope:.4f}")`],
    solution: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\nareas = [h["area"] for h in houses]\nprices = [h["price"] for h in houses]\n\ndef covariance(xs, ys):\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\ndef variance(xs):\n    mx = sum(xs) / len(xs)\n    return sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n\nslope = covariance(areas, prices) / variance(areas)\nprint(f"{slope:.4f}")`,
    testCode: `if "variance" not in globals() or "slope" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні функція variance(xs) і змінна slope."}\nelif not any("1.4277" in l for l in __logs):\n    __result__ = {"pass": False, "message": "slope має бути приблизно 1.4277."}\nelse:\n    __result__ = {"pass": True, "message": "Нахил регресії — коваріація, поділена на дисперсію: серце формули найменших квадратів."}`,
  },
  {
    id: "py-datascience-7",
    title: "Точка перетину (intercept)",
    type: "python",
    theory:
      "Другий параметр прямої лінії — intercept (де лінія перетинає вісь Y, тобто прогнозована ціна при area = 0). Формула гарантує, що лінія проходить крізь ТОЧКУ СЕРЕДНІХ значень (mean_x, mean_y):\n\nmean_x = sum(areas) / len(areas)\nmean_y = sum(prices) / len(prices)\nintercept = mean_y - slope * mean_x\nprint(f\"{intercept:.4f}\")\n\nРазом slope та intercept повністю визначають лінію: price = slope * area + intercept — саме ці два числа scikit-learn ховає всередині LinearRegression().coef_ і .intercept_.",
    examples: [
      { title: "intercept = mean_y - slope * mean_x", code: `areas = [40, 55, 70, 85, 100, 120]\nprices = [60, 82, 100, 120, 145, 175]\nslope = 1.4276923076923076\n\nmean_x = sum(areas) / len(areas)\nmean_y = sum(prices) / len(prices)\nintercept = mean_y - slope * mean_x\nprint(f"{intercept:.4f}")`, explain: "intercept ≈ 1.8308 — прогноз ціни для гіпотетичного будинку площею 0 м² (сама лінія, не реальна точка)." },
    ],
    task: `Дано areas, prices, slope. Порахуй mean_x, mean_y і intercept = mean_y - slope * mean_x. Виведи f"{intercept:.4f}".`,
    starter: `areas = [40, 55, 70, 85, 100, 120]\nprices = [60, 82, 100, 120, 145, 175]\nslope = 1.4276923076923076\n\n# mean_x = sum(areas) / len(areas)\n# mean_y = sum(prices) / len(prices)\n# intercept = mean_y - slope * mean_x\n# print(f"{intercept:.4f}")\n`,
    hints: [`mean_x = sum(areas) / len(areas); mean_y = sum(prices) / len(prices)`, `intercept = mean_y - slope * mean_x`, `mean_x = sum(areas) / len(areas)\nmean_y = sum(prices) / len(prices)\nintercept = mean_y - slope * mean_x\nprint(f"{intercept:.4f}")`],
    solution: `areas = [40, 55, 70, 85, 100, 120]\nprices = [60, 82, 100, 120, 145, 175]\nslope = 1.4276923076923076\n\nmean_x = sum(areas) / len(areas)\nmean_y = sum(prices) / len(prices)\nintercept = mean_y - slope * mean_x\nprint(f"{intercept:.4f}")`,
    testCode: `if "intercept" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна intercept."}\nelif not any("1.8308" in l for l in __logs):\n    __result__ = {"pass": False, "message": "intercept має бути приблизно 1.8308."}\nelse:\n    __result__ = {"pass": True, "message": "intercept гарантує, що лінія регресії проходить крізь точку середніх значень (mean_x, mean_y)."}`,
  },
  {
    id: "py-datascience-8",
    title: "Функція predict()",
    type: "python",
    theory:
      "Маючи slope та intercept, прогноз для БУДЬ-ЯКОЇ нової площі — це одна лінія коду. Загорни це у функцію predict(), щоб можна було прогнозувати для будинків, яких ще немає в даних:\n\ndef predict(area, slope, intercept):\n    return slope * area + intercept\n\nprint(f\"{predict(65, slope, intercept):.2f}\")\n\nПлоща 65 м² відсутня серед навчальних даних (є лише 40, 55, 70, 85, 100, 120) — це справжня ЕКСТРАПОЛЯЦІЯ, головна причина, чому регресію взагалі будують.",
    examples: [
      { title: "predict() для нової площі", code: `slope = 1.4276923076923076\nintercept = 1.8307692307692491\n\ndef predict(area, slope, intercept):\n    return slope * area + intercept\n\nprint(f"{predict(65, slope, intercept):.2f}")`, explain: "predict(65, ...) ≈ 94.63 — модель ще НЕ бачила площу 65, але прогнозує ціну на основі знайденої закономірності." },
    ],
    task: `Дано slope, intercept. Напиши predict(area, slope, intercept), що повертає slope * area + intercept. Виведи f"{predict(65, slope, intercept):.2f}".`,
    starter: `slope = 1.4276923076923076\nintercept = 1.8307692307692491\n\ndef predict(area, slope, intercept):\n    # твій код тут\n    pass\n\n# print(f"{predict(65, slope, intercept):.2f}")\n`,
    hints: [`return slope * area + intercept`, `Одна лінія коду — формула прямої лінії з попередніх двох уроків.`, `def predict(area, slope, intercept):\n    return slope * area + intercept\n\nprint(f"{predict(65, slope, intercept):.2f}")`],
    solution: `slope = 1.4276923076923076\nintercept = 1.8307692307692491\n\ndef predict(area, slope, intercept):\n    return slope * area + intercept\n\nprint(f"{predict(65, slope, intercept):.2f}")`,
    testCode: `if "predict" not in globals() or not callable(predict):\n    __result__ = {"pass": False, "message": "Потрібна функція predict(area, slope, intercept)."}\nelif abs(predict(65, slope, intercept) - 94.63) > 0.1:\n    __result__ = {"pass": False, "message": "predict(65, slope, intercept) має бути приблизно 94.63."}\nelif not any("94.63" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи результат через print()."}\nelse:\n    __result__ = {"pass": True, "message": "predict() — модель, готова до використання: прогноз для будь-якої нової площі за одну лінію коду."}`,
  },
  {
    id: "py-datascience-9",
    title: "Залишки (residuals): наскільки модель помилилась",
    type: "python",
    theory:
      "Залишок (residual) — різниця між РЕАЛЬНИМ і ПРОГНОЗОВАНИМ значенням для кожної точки даних: residual = actual - predicted. Якщо модель ідеальна — усі залишки дорівнюють 0; чим гірша модель, тим більші залишки:\n\npreds = [predict(a, slope, intercept) for a in areas]\nresiduals = [y - p for y, p in zip(prices, preds)]\nprint([round(r, 2) for r in residuals])\nprint(f\"{sum(residuals):.6f}\")\n\nЦікава властивість регресії найменших квадратів: сума ВСІХ залишків завжди ≈ 0 — позитивні й негативні помилки взаємно компенсуються.",
    examples: [
      { title: "residuals і їх сума ≈ 0", code: `areas = [40, 55, 70, 85, 100, 120]\nprices = [60, 82, 100, 120, 145, 175]\nslope, intercept = 1.4276923076923076, 1.8307692307692491\n\ndef predict(area):\n    return slope * area + intercept\n\npreds = [predict(a) for a in areas]\nresiduals = [y - p for y, p in zip(prices, preds)]\nprint([round(r, 2) for r in residuals])\nprint(f"{sum(residuals):.6f}")`, explain: "Перший залишок ≈ 1.06 (модель трохи занизила прогноз), сума всіх ≈ 0.000000." },
    ],
    task: `Дано areas, prices, slope, intercept, predict(). Порахуй preds для всіх areas і residuals = actual - predicted. Виведи округлені до 2 знаків residuals і f"{sum(residuals):.6f}".`,
    starter: `areas = [40, 55, 70, 85, 100, 120]\nprices = [60, 82, 100, 120, 145, 175]\nslope, intercept = 1.4276923076923076, 1.8307692307692491\n\ndef predict(area):\n    return slope * area + intercept\n\n# preds = [predict(a) for a in areas]\n# residuals = [y - p for y, p in zip(prices, preds)]\n# print([round(r, 2) for r in residuals])\n# print(f"{sum(residuals):.6f}")\n`,
    hints: [`preds = [predict(a) for a in areas]`, `residuals = [y - p for y, p in zip(prices, preds)]`, `preds = [predict(a) for a in areas]\nresiduals = [y - p for y, p in zip(prices, preds)]\nprint([round(r, 2) for r in residuals])\nprint(f"{sum(residuals):.6f}")`],
    solution: `areas = [40, 55, 70, 85, 100, 120]\nprices = [60, 82, 100, 120, 145, 175]\nslope, intercept = 1.4276923076923076, 1.8307692307692491\n\ndef predict(area):\n    return slope * area + intercept\n\npreds = [predict(a) for a in areas]\nresiduals = [y - p for y, p in zip(prices, preds)]\nprint([round(r, 2) for r in residuals])\nprint(f"{sum(residuals):.6f}")`,
    testCode: `if "residuals" not in globals() or len(residuals) != 6:\n    __result__ = {"pass": False, "message": "residuals має містити 6 значень (по одному на кожен будинок)."}\nelif abs(sum(residuals)) > 0.01:\n    __result__ = {"pass": False, "message": "Сума residuals має бути близькою до 0 — перевір, що це actual - predicted, а не навпаки."}\nelif abs(residuals[0] - 1.06) > 0.1:\n    __result__ = {"pass": False, "message": "Перший залишок (area=40) має бути приблизно 1.06."}\nelse:\n    __result__ = {"pass": True, "message": "Залишки, що сумуються майже в 0, — математична гарантія методу найменших квадратів."}`,
  },
  {
    id: "py-datascience-10",
    title: "MSE — середньоквадратична помилка",
    type: "python",
    theory:
      "Одне число, що узагальнює якість моделі: Mean Squared Error — середнє квадратів усіх залишків. Піднесення до квадрата робить великі помилки НЕПРОПОРЦІЙНО важливішими за малі (помилка вдвічі більша дає вчетверо більший внесок у MSE):\n\nmse = sum(r ** 2 for r in residuals) / len(residuals)\nprint(f\"{mse:.2f}\")\n\nMSE — те, що scikit-learn називає mean_squared_error(y_true, y_pred), і те, що більшість алгоритмів регресії намагаються МІНІМІЗУВАТИ під час навчання.",
    examples: [
      { title: "MSE з residuals", code: `residuals = [1.06, 1.65, -1.77, -3.18, 0.4, 1.85]\n\nmse = sum(r ** 2 for r in residuals) / len(residuals)\nprint(f"{mse:.2f}")`, explain: "MSE ≈ 3.45 — середнє квадратів шести залишків." },
    ],
    task: `Дано residuals (6 значень). Порахуй mse = sum(r ** 2 for r in residuals) / len(residuals). Виведи f"{mse:.2f}".`,
    starter: `residuals = [1.0615384615384473, 1.6461538461538368, -1.7692307692307736, -3.184615384615398, 0.39999999999997726, 1.8461538461538396]\n\n# mse = sum(r ** 2 for r in residuals) / len(residuals)\n# print(f"{mse:.2f}")\n`,
    hints: [`sum(r ** 2 for r in residuals) — сума квадратів залишків.`, `Поділи суму на len(residuals) — це і є mse.`, `mse = sum(r ** 2 for r in residuals) / len(residuals)\nprint(f"{mse:.2f}")`],
    solution: `residuals = [1.0615384615384473, 1.6461538461538368, -1.7692307692307736, -3.184615384615398, 0.39999999999997726, 1.8461538461538396]\n\nmse = sum(r ** 2 for r in residuals) / len(residuals)\nprint(f"{mse:.2f}")`,
    testCode: `if "mse" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна mse."}\nelif abs(mse - 3.45) > 0.05:\n    __result__ = {"pass": False, "message": "mse має бути приблизно 3.45."}\nelif not any("3.45" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи mse через print()."}\nelse:\n    __result__ = {"pass": True, "message": "MSE — те саме число, яке більшість ML-алгоритмів мінімізують під час навчання."}`,
  },
  {
    id: "py-datascience-11",
    title: "RMSE — корінь із MSE",
    type: "python",
    theory:
      "MSE вимірюється в КВАДРАТНИХ одиницях (якщо ціна в тис. $, то MSE — у тис. $ у квадраті), що важко інтуїтивно зрозуміти. Root Mean Squared Error повертає результат в ОРИГІНАЛЬНІ одиниці, беручи квадратний корінь:\n\nimport math\n\nrmse = math.sqrt(mse)\nprint(f\"{rmse:.2f}\")\n\nRMSE ≈ 1.86 означає: у середньому прогноз моделі відхиляється від реальної ціни приблизно на 1.86 (тих самих одиниць, що й price) — набагато зрозуміліше за «3.45 у квадратних одиницях».",
    examples: [
      { title: "RMSE = sqrt(MSE)", code: `import math\n\nmse = 3.4457\nrmse = math.sqrt(mse)\nprint(f"{rmse:.2f}")`, explain: "RMSE ≈ 1.86 — та сама точність, але в звичних, а не квадратних одиницях." },
    ],
    task: `Дано mse = 3.4457. Порахуй rmse = math.sqrt(mse). Виведи f"{rmse:.2f}".`,
    starter: `import math\n\nmse = 3.4457\n\n# rmse = math.sqrt(mse)\n# print(f"{rmse:.2f}")\n`,
    hints: [`import math на початку файлу.`, `rmse = math.sqrt(mse)`, `import math\n\nmse = 3.4457\nrmse = math.sqrt(mse)\nprint(f"{rmse:.2f}")`],
    solution: `import math\n\nmse = 3.4457\n\nrmse = math.sqrt(mse)\nprint(f"{rmse:.2f}")`,
    testCode: `if "rmse" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна rmse."}\nelif abs(rmse - 1.86) > 0.05:\n    __result__ = {"pass": False, "message": "rmse має бути приблизно 1.86 (корінь з 3.4457)."}\nelse:\n    __result__ = {"pass": True, "message": "RMSE — та сама точність моделі, але в звичних одиницях замість квадратних."}`,
  },
  {
    id: "py-datascience-12",
    title: "R² — наскільки добре модель пояснює дані",
    type: "python",
    theory:
      "R² (коефіцієнт детермінації) відповідає на питання «наскільки краще моя модель за банальне вгадування середнім значенням?». Формула порівнює суму квадратів залишків МОДЕЛІ (SS_res) із сумою квадратів відхилень від СЕРЕДНЬОГО (SS_tot):\n\nmean_y = sum(prices) / len(prices)\nss_res = sum(r ** 2 for r in residuals)\nss_tot = sum((y - mean_y) ** 2 for y in prices)\nr2 = 1 - ss_res / ss_tot\nprint(f\"{r2:.4f}\")\n\nR² = 1 означає ідеальну модель; R² = 0 означає «не краще за середнє»; R² близько 0.9977 (як тут) означає, що модель пояснює 99.77% розкиду цін.",
    examples: [
      { title: "R² близько до 1 — сильна модель", code: `prices = [60, 82, 100, 120, 145, 175]\nresiduals = [1.06, 1.65, -1.77, -3.18, 0.4, 1.85]\n\nmean_y = sum(prices) / len(prices)\nss_res = sum(r ** 2 for r in residuals)\nss_tot = sum((y - mean_y) ** 2 for y in prices)\nr2 = 1 - ss_res / ss_tot\nprint(f"{r2:.4f}")`, explain: "R² ≈ 0.9977 — модель пояснює майже весь розкид цін через площу." },
    ],
    task: `Дано prices, residuals. Порахуй mean_y, ss_res, ss_tot і r2 = 1 - ss_res / ss_tot. Виведи f"{r2:.4f}".`,
    starter: `prices = [60, 82, 100, 120, 145, 175]\nresiduals = [1.06, 1.65, -1.77, -3.18, 0.4, 1.85]\n\n# mean_y = sum(prices) / len(prices)\n# ss_res = sum(r ** 2 for r in residuals)\n# ss_tot = sum((y - mean_y) ** 2 for y in prices)\n# r2 = 1 - ss_res / ss_tot\n# print(f"{r2:.4f}")\n`,
    hints: [`mean_y = sum(prices) / len(prices)`, `ss_res = sum(r ** 2 for r in residuals); ss_tot = sum((y - mean_y) ** 2 for y in prices)`, `mean_y = sum(prices) / len(prices)\nss_res = sum(r ** 2 for r in residuals)\nss_tot = sum((y - mean_y) ** 2 for y in prices)\nr2 = 1 - ss_res / ss_tot\nprint(f"{r2:.4f}")`],
    solution: `prices = [60, 82, 100, 120, 145, 175]\nresiduals = [1.06, 1.65, -1.77, -3.18, 0.4, 1.85]\n\nmean_y = sum(prices) / len(prices)\nss_res = sum(r ** 2 for r in residuals)\nss_tot = sum((y - mean_y) ** 2 for y in prices)\nr2 = 1 - ss_res / ss_tot\nprint(f"{r2:.4f}")`,
    testCode: `if "r2" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна r2."}\nelif abs(r2 - 0.9977) > 0.005:\n    __result__ = {"pass": False, "message": "r2 має бути приблизно 0.9977."}\nelse:\n    __result__ = {"pass": True, "message": "R² близько 1 — модель пояснює майже весь розкид цін через площу будинку."}`,
  },
  {
    id: "py-datascience-13",
    title: "Навчання й оцінка: train окремо, test окремо",
    type: "python",
    theory:
      "Тепер об'єднаємо train/test split (урок 1) з регресією: модель НАВЧАЄТЬСЯ лише на train, а MSE рахується лише на test — даних, які модель ЖОДНОГО РАЗУ не бачила під час навчання. Це і є справжня перевірка, чи модель узагальнює, а не просто підлаштувалась під конкретні приклади:\n\ndef fit(data):\n    xs = [r[\"area\"] for r in data]\n    ys = [r[\"price\"] for r in data]\n    slope = covariance(xs, ys) / variance(xs)\n    intercept = sum(ys) / len(ys) - slope * (sum(xs) / len(xs))\n    return slope, intercept\n\nslope, intercept = fit(train)\ntest_preds = [predict(r[\"area\"], slope, intercept) for r in test]\ntest_mse = sum((r[\"price\"] - p) ** 2 for r, p in zip(test, test_preds)) / len(test)\nprint(f\"{test_mse:.2f}\")",
    examples: [
      { title: "fit(train), оцінка на test", code: `import random\n\nhouses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\nrandom.seed(1)\nshuffled = houses[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\ndef covariance(xs, ys):\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\ndef variance(xs):\n    mx = sum(xs) / len(xs)\n    return sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n\ndef fit(data):\n    xs = [r["area"] for r in data]\n    ys = [r["price"] for r in data]\n    slope = covariance(xs, ys) / variance(xs)\n    intercept = sum(ys) / len(ys) - slope * (sum(xs) / len(xs))\n    return slope, intercept\n\ndef predict(area, slope, intercept):\n    return slope * area + intercept\n\nslope, intercept = fit(train)\ntest_preds = [predict(r["area"], slope, intercept) for r in test]\ntest_mse = sum((r["price"] - p) ** 2 for r, p in zip(test, test_preds)) / len(test)\nprint(f"{test_mse:.2f}")`, explain: "test_mse ≈ 3.08 — модель, навчена лише на 4 будинках, все одно добре прогнозує 2 приховані." },
    ],
    task: `Дано houses, covariance(), variance(), predict() (усе в starter). Напиши fit(data), що повертає (slope, intercept). Зроби train/test split (як в уроці 1), навчи модель на train, порахуй test_mse на test. Виведи f"{test_mse:.2f}".`,
    starter: `import random\n\nhouses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\nrandom.seed(1)\nshuffled = houses[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\ndef covariance(xs, ys):\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\ndef variance(xs):\n    mx = sum(xs) / len(xs)\n    return sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n\ndef predict(area, slope, intercept):\n    return slope * area + intercept\n\ndef fit(data):\n    # твій код тут: xs, ys, slope, intercept\n    pass\n\n# slope, intercept = fit(train)\n# test_preds = [predict(r["area"], slope, intercept) for r in test]\n# test_mse = sum((r["price"] - p) ** 2 for r, p in zip(test, test_preds)) / len(test)\n# print(f"{test_mse:.2f}")\n`,
    hints: [`xs = [r["area"] for r in data]; ys = [r["price"] for r in data]`, `slope = covariance(xs, ys) / variance(xs); intercept = sum(ys)/len(ys) - slope*(sum(xs)/len(xs)); return slope, intercept`, `def fit(data):\n    xs = [r["area"] for r in data]\n    ys = [r["price"] for r in data]\n    slope = covariance(xs, ys) / variance(xs)\n    intercept = sum(ys) / len(ys) - slope * (sum(xs) / len(xs))\n    return slope, intercept`],
    solution: `import random\n\nhouses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\nrandom.seed(1)\nshuffled = houses[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\ndef covariance(xs, ys):\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n\ndef variance(xs):\n    mx = sum(xs) / len(xs)\n    return sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n\ndef predict(area, slope, intercept):\n    return slope * area + intercept\n\ndef fit(data):\n    xs = [r["area"] for r in data]\n    ys = [r["price"] for r in data]\n    slope = covariance(xs, ys) / variance(xs)\n    intercept = sum(ys) / len(ys) - slope * (sum(xs) / len(xs))\n    return slope, intercept\n\nslope, intercept = fit(train)\ntest_preds = [predict(r["area"], slope, intercept) for r in test]\ntest_mse = sum((r["price"] - p) ** 2 for r, p in zip(test, test_preds)) / len(test)\nprint(f"{test_mse:.2f}")`,
    testCode: `if "fit" not in globals() or "test_mse" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні функція fit(data) і змінна test_mse."}\nelif abs(test_mse - 3.08) > 0.1:\n    __result__ = {"pass": False, "message": "test_mse має бути приблизно 3.08 (навчання на train, оцінка на test)."}\nelse:\n    __result__ = {"pass": True, "message": "Модель навчена лише на train і все одно добре прогнозує ПРИХОВАНІ дані test — ознака реального узагальнення."}`,
  },
  {
    id: "py-datascience-14",
    title: "Евклідова відстань між точками",
    type: "python",
    theory:
      "Кластеризація групує СХОЖІ точки разом — а «схожість» вимірюється відстанню. Евклідова відстань між двома точками (x1, y1) і (x2, y2) — це теорема Піфагора у вигляді функції:\n\nimport math\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\nprint(f\"{euclidean_distance((40, 60), (120, 175)):.4f}\")\n\nЦе єдина «формула схожості», яка знадобиться для k-means у наступних чотирьох уроках.",
    examples: [
      { title: "euclidean_distance()", code: `import math\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\nprint(f"{euclidean_distance((40, 60), (120, 175)):.4f}")`, explain: "Відстань між найдешевшим і найдорожчим будинком (за площею й ціною) ≈ 140.09." },
    ],
    task: `Напиши euclidean_distance(a, b), де a і b — кортежі (x, y), за формулою sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2). Виведи f"{euclidean_distance((40, 60), (120, 175)):.4f}".`,
    starter: `import math\n\ndef euclidean_distance(a, b):\n    # твій код тут\n    pass\n\n# print(f"{euclidean_distance((40, 60), (120, 175)):.4f}")\n`,
    hints: [`(a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 — сума квадратів різниць по кожній координаті.`, `math.sqrt(...) навколо суми.`, `def euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\nprint(f"{euclidean_distance((40, 60), (120, 175)):.4f}")`],
    solution: `import math\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\nprint(f"{euclidean_distance((40, 60), (120, 175)):.4f}")`,
    testCode: `if "euclidean_distance" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція euclidean_distance(a, b)."}\nelif abs(euclidean_distance((0, 0), (3, 4)) - 5.0) > 0.001:\n    __result__ = {"pass": False, "message": "euclidean_distance((0, 0), (3, 4)) має дати 5.0 (класичний трикутник 3-4-5)."}\nelif not any("140.0893" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи euclidean_distance((40, 60), (120, 175)) — має бути 140.0893."}\nelse:\n    __result__ = {"pass": True, "message": "Евклідова відстань — єдина формула «схожості», потрібна для кластеризації k-means."}`,
  },
  {
    id: "py-datascience-15",
    title: "K-means крок 1: призначення точок до центроїдів",
    type: "python",
    theory:
      "K-means ділить точки на k груп (кластерів), кожна навколо свого центру (центроїда). Перший крок: для КОЖНОЇ точки знайти найБЛИЖЧИЙ центроїд і запам'ятати його номер:\n\ndef assign(points, centroids):\n    assignments = []\n    for p in points:\n        distances = [euclidean_distance(p, c) for c in centroids]\n        assignments.append(distances.index(min(distances)))\n    return assignments\n\npoints = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\ncentroids = [(40, 60), (120, 175)]\nprint(assign(points, centroids))\n\ndistances.index(min(distances)) знаходить ІНДЕКС найменшої відстані — тобто номер найближчого центроїда.",
    examples: [
      { title: "assign() — до якого центроїда ближче", code: `import math\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\ndef assign(points, centroids):\n    assignments = []\n    for p in points:\n        distances = [euclidean_distance(p, c) for c in centroids]\n        assignments.append(distances.index(min(distances)))\n    return assignments\n\npoints = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\ncentroids = [(40, 60), (120, 175)]\nprint(assign(points, centroids))`, explain: "[0, 0, 0, 1, 1, 1] — три менші будинки ближче до центроїда 0, три більші — до центроїда 1." },
    ],
    task: `Дано euclidean_distance() (в starter). Напиши assign(points, centroids), що для кожної точки повертає індекс найближчого центроїда. Застосуй до points і centroids = [(40, 60), (120, 175)]. Виведи результат.`,
    starter: `import math\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\ndef assign(points, centroids):\n    # твій код тут\n    pass\n\npoints = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\ncentroids = [(40, 60), (120, 175)]\n# print(assign(points, centroids))\n`,
    hints: [`Для кожної точки p: distances = [euclidean_distance(p, c) for c in centroids]`, `assignments.append(distances.index(min(distances)))`, `def assign(points, centroids):\n    assignments = []\n    for p in points:\n        distances = [euclidean_distance(p, c) for c in centroids]\n        assignments.append(distances.index(min(distances)))\n    return assignments\n\nprint(assign(points, centroids))`],
    solution: `import math\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\ndef assign(points, centroids):\n    assignments = []\n    for p in points:\n        distances = [euclidean_distance(p, c) for c in centroids]\n        assignments.append(distances.index(min(distances)))\n    return assignments\n\npoints = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\ncentroids = [(40, 60), (120, 175)]\nprint(assign(points, centroids))`,
    testCode: `if "assign" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція assign(points, centroids)."}\nelif assign(points, centroids) != [0, 0, 0, 1, 1, 1]:\n    __result__ = {"pass": False, "message": "assign(points, centroids) має повернути [0, 0, 0, 1, 1, 1]."}\nelse:\n    __result__ = {"pass": True, "message": "Крок присвоєння — кожна точка приєднується до найближчого центроїда за евклідовою відстанню."}`,
  },
  {
    id: "py-datascience-16",
    title: "K-means крок 2: перерахунок центроїдів",
    type: "python",
    theory:
      "Після присвоєння точок кожен центроїд ПЕРЕСУВАЄТЬСЯ у середину свого кластера — рахується як середнє (mean) координат усіх точок, приписаних до нього:\n\ndef recompute(points, assignments, k):\n    new_centroids = []\n    for i in range(k):\n        cluster_points = [p for p, a in zip(points, assignments) if a == i]\n        mx = sum(p[0] for p in cluster_points) / len(cluster_points)\n        my = sum(p[1] for p in cluster_points) / len(cluster_points)\n        new_centroids.append((mx, my))\n    return new_centroids\n\nassignments = [0, 0, 0, 1, 1, 1]\nprint(recompute(points, assignments, 2))\n\nЦентроїд — це просто середня точка свого кластера, тому формула та сама, що для середнього арифметичного.",
    examples: [
      { title: "recompute() — центроїд стає середньою точкою", code: `points = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\nassignments = [0, 0, 0, 1, 1, 1]\n\ndef recompute(points, assignments, k):\n    new_centroids = []\n    for i in range(k):\n        cluster_points = [p for p, a in zip(points, assignments) if a == i]\n        mx = sum(p[0] for p in cluster_points) / len(cluster_points)\n        my = sum(p[1] for p in cluster_points) / len(cluster_points)\n        new_centroids.append((mx, my))\n    return new_centroids\n\nprint([(round(c[0], 2), round(c[1], 2)) for c in recompute(points, assignments, 2)])`, explain: "Новий центроїд 0 — (55.0, 80.67), середина трьох менших будинків; центроїд 1 — (101.67, 146.67)." },
    ],
    task: `Дано points, assignments = [0, 0, 0, 1, 1, 1]. Напиши recompute(points, assignments, k), що повертає новий центроїд для кожного кластера як середню точку. Виведи округлений до 2 знаків результат.`,
    starter: `points = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\nassignments = [0, 0, 0, 1, 1, 1]\n\ndef recompute(points, assignments, k):\n    # твій код тут\n    pass\n\n# print([(round(c[0], 2), round(c[1], 2)) for c in recompute(points, assignments, 2)])\n`,
    hints: [`cluster_points = [p for p, a in zip(points, assignments) if a == i] — точки для кластера i.`, `mx = sum(p[0] for p in cluster_points) / len(cluster_points); my = аналогічно для p[1].`, `def recompute(points, assignments, k):\n    new_centroids = []\n    for i in range(k):\n        cluster_points = [p for p, a in zip(points, assignments) if a == i]\n        mx = sum(p[0] for p in cluster_points) / len(cluster_points)\n        my = sum(p[1] for p in cluster_points) / len(cluster_points)\n        new_centroids.append((mx, my))\n    return new_centroids`],
    solution: `points = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\nassignments = [0, 0, 0, 1, 1, 1]\n\ndef recompute(points, assignments, k):\n    new_centroids = []\n    for i in range(k):\n        cluster_points = [p for p, a in zip(points, assignments) if a == i]\n        mx = sum(p[0] for p in cluster_points) / len(cluster_points)\n        my = sum(p[1] for p in cluster_points) / len(cluster_points)\n        new_centroids.append((mx, my))\n    return new_centroids\n\nprint([(round(c[0], 2), round(c[1], 2)) for c in recompute(points, assignments, 2)])`,
    testCode: `if "recompute" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція recompute(points, assignments, k)."}\nelse:\n    result = recompute(points, assignments, 2)\n    if abs(result[0][0] - 55.0) > 0.01 or abs(result[0][1] - 80.67) > 0.01:\n        __result__ = {"pass": False, "message": "Перший новий центроїд має бути приблизно (55.0, 80.67)."}\n    elif abs(result[1][0] - 101.67) > 0.01 or abs(result[1][1] - 146.67) > 0.01:\n        __result__ = {"pass": False, "message": "Другий новий центроїд має бути приблизно (101.67, 146.67)."}\n    else:\n        __result__ = {"pass": True, "message": "Кожен центроїд пересунувся у середину свого кластера — половина циклу k-means зроблена."}`,
  },
  {
    id: "py-datascience-17",
    title: "K-means крок 3: повний цикл до збіжності",
    type: "python",
    theory:
      "Об'єднай assign() і recompute() у ЦИКЛ: присвой точки, пересунь центроїди, повтори. Коли центроїди перестають змінюватись — алгоритм ЗБІГСЯ (converged), і можна зупинитись раніше за максимальну кількість ітерацій:\n\ndef kmeans(points, k, centroids, iterations=10):\n    for _ in range(iterations):\n        assignments = assign(points, centroids)\n        new_centroids = recompute(points, assignments, k)\n        if new_centroids == centroids:\n            break\n        centroids = new_centroids\n    return centroids, assignments\n\nfinal_centroids, final_assignments = kmeans(points, 2, [(40, 60), (120, 175)])\nprint(final_assignments)",
    examples: [
      { title: "kmeans() — повний алгоритм", code: `import math\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\ndef assign(points, centroids):\n    return [min(range(len(centroids)), key=lambda i: euclidean_distance(p, centroids[i])) for p in points]\n\ndef recompute(points, assignments, k):\n    new_centroids = []\n    for i in range(k):\n        cluster_points = [p for p, a in zip(points, assignments) if a == i]\n        new_centroids.append((sum(p[0] for p in cluster_points) / len(cluster_points), sum(p[1] for p in cluster_points) / len(cluster_points)))\n    return new_centroids\n\ndef kmeans(points, k, centroids, iterations=10):\n    for _ in range(iterations):\n        assignments = assign(points, centroids)\n        new_centroids = recompute(points, assignments, k)\n        if new_centroids == centroids:\n            break\n        centroids = new_centroids\n    return centroids, assignments\n\npoints = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\nfinal_centroids, final_assignments = kmeans(points, 2, [(40, 60), (120, 175)])\nprint(final_assignments)`, explain: "Алгоритм збігається вже за 1-2 ітерації для цих чітко розділених будинків." },
    ],
    task: `Дано assign() і recompute() (в starter). Напиши kmeans(points, k, centroids, iterations=10), що циклічно викликає assign() і recompute() до збіжності (new_centroids == centroids) або iterations разів. Виклич kmeans(points, 2, [(40, 60), (120, 175)]) і виведи final_assignments.`,
    starter: `import math\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\ndef assign(points, centroids):\n    assignments = []\n    for p in points:\n        distances = [euclidean_distance(p, c) for c in centroids]\n        assignments.append(distances.index(min(distances)))\n    return assignments\n\ndef recompute(points, assignments, k):\n    new_centroids = []\n    for i in range(k):\n        cluster_points = [p for p, a in zip(points, assignments) if a == i]\n        mx = sum(p[0] for p in cluster_points) / len(cluster_points)\n        my = sum(p[1] for p in cluster_points) / len(cluster_points)\n        new_centroids.append((mx, my))\n    return new_centroids\n\ndef kmeans(points, k, centroids, iterations=10):\n    # твій код тут\n    pass\n\npoints = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\n# final_centroids, final_assignments = kmeans(points, 2, [(40, 60), (120, 175)])\n# print(final_assignments)\n`,
    hints: [`У циклі: assignments = assign(points, centroids); new_centroids = recompute(points, assignments, k)`, `if new_centroids == centroids: break — інакше centroids = new_centroids і продовжуй.`, `def kmeans(points, k, centroids, iterations=10):\n    for _ in range(iterations):\n        assignments = assign(points, centroids)\n        new_centroids = recompute(points, assignments, k)\n        if new_centroids == centroids:\n            break\n        centroids = new_centroids\n    return centroids, assignments`],
    solution: `import math\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\ndef assign(points, centroids):\n    assignments = []\n    for p in points:\n        distances = [euclidean_distance(p, c) for c in centroids]\n        assignments.append(distances.index(min(distances)))\n    return assignments\n\ndef recompute(points, assignments, k):\n    new_centroids = []\n    for i in range(k):\n        cluster_points = [p for p, a in zip(points, assignments) if a == i]\n        mx = sum(p[0] for p in cluster_points) / len(cluster_points)\n        my = sum(p[1] for p in cluster_points) / len(cluster_points)\n        new_centroids.append((mx, my))\n    return new_centroids\n\ndef kmeans(points, k, centroids, iterations=10):\n    for _ in range(iterations):\n        assignments = assign(points, centroids)\n        new_centroids = recompute(points, assignments, k)\n        if new_centroids == centroids:\n            break\n        centroids = new_centroids\n    return centroids, assignments\n\npoints = [(40, 60), (55, 82), (70, 100), (85, 120), (100, 145), (120, 175)]\nfinal_centroids, final_assignments = kmeans(points, 2, [(40, 60), (120, 175)])\nprint(final_assignments)`,
    testCode: `if "kmeans" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція kmeans(points, k, centroids, iterations=10)."}\nelif "final_assignments" not in globals() or final_assignments != [0, 0, 0, 1, 1, 1]:\n    __result__ = {"pass": False, "message": "final_assignments має бути [0, 0, 0, 1, 1, 1]."}\nelif abs(final_centroids[0][0] - 55.0) > 0.01 or abs(final_centroids[1][0] - 101.67) > 0.01:\n    __result__ = {"pass": False, "message": "final_centroids мають збігтись з (55.0, 80.67) і (101.67, 146.67)."}\nelse:\n    __result__ = {"pass": True, "message": "Повний k-means: присвоєння + перерахунок у циклі до збіжності — той самий алгоритм, що в scikit-learn."}`,
  },
  {
    id: "py-datascience-18",
    title: "Інженерія ознак: price_per_sqm",
    type: "python",
    theory:
      "Інженерія ознак (feature engineering) — створення НОВИХ, більш інформативних показників з наявних даних. Ціна за квадратний метр часто цінніша за саму ціну: вона показує, чи будинок дорогий ЗА СВОЇМ РОЗМІРОМ, а не просто великий:\n\nfor h in houses:\n    h[\"price_per_sqm\"] = h[\"price\"] / h[\"area\"]\n\nfor h in houses:\n    print(f\"{h['area']} м²: {h['price_per_sqm']:.4f}\")\n\nЦікаво: у цьому наборі даних менші будинки МАЮТЬ ВИЩУ ціну за м² — типова закономірність нерухомості (економія на масштабі для великих об'єктів).",
    examples: [
      { title: "price_per_sqm як нова ознака", code: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n]\n\nfor h in houses:\n    h["price_per_sqm"] = h["price"] / h["area"]\n\nfor h in houses:\n    print(f"{h['area']} м²: {h['price_per_sqm']:.4f}")`, explain: "40 м² коштує 1.5 за м², а 70 м² — лише 1.4286 за м²: більший будинок дешевший ЗА КВАДРАТ." },
    ],
    task: `Дано houses (6 будинків). Додай кожному словнику ключ price_per_sqm = price / area. Виведи f"{h['area']} м²: {h['price_per_sqm']:.4f}" для кожного будинку.`,
    starter: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\n# for h in houses:\n#     h["price_per_sqm"] = h["price"] / h["area"]\n\n# for h in houses:\n#     print(f"{h['area']} м²: {h['price_per_sqm']:.4f}")\n`,
    hints: [`for h in houses: h["price_per_sqm"] = h["price"] / h["area"]`, `Потім окремим циклом виведи кожен результат.`, `for h in houses:\n    h["price_per_sqm"] = h["price"] / h["area"]\n\nfor h in houses:\n    print(f"{h['area']} м²: {h['price_per_sqm']:.4f}")`],
    solution: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\nfor h in houses:\n    h["price_per_sqm"] = h["price"] / h["area"]\n\nfor h in houses:\n    print(f"{h['area']} м²: {h['price_per_sqm']:.4f}")`,
    testCode: `if not all("price_per_sqm" in h for h in houses):\n    __result__ = {"pass": False, "message": "Кожен будинок має отримати ключ price_per_sqm."}\nelif abs(houses[0]["price_per_sqm"] - 1.5) > 0.001:\n    __result__ = {"pass": False, "message": "Для area=40, price=60 price_per_sqm має бути 1.5."}\nelif not any("1.4286" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи price_per_sqm для кожного будинку — має з'явитись 1.4286 (для area=70)."}\nelse:\n    __result__ = {"pass": True, "message": "Інженерія ознак — часто найважливіший крок: правильна нова ознака дає більше, ніж складніша модель."}`,
  },
  {
    id: "py-datascience-19",
    title: "Об'єднання регресії й кластеризації в один звіт",
    type: "python",
    theory:
      "Регресія й кластеризація відповідають на РІЗНІ питання: регресія прогнозує ЧИСЛО (яка буде ціна?), кластеризація знаходить ГРУПИ (які будинки схожі?). Об'єднаємо обидва в один звіт: для кожного сегмента (кластера) покажемо середню ціну за м² — це показує, чи «преміум» сегмент справді дорожчий ЗА КВАДРАТНИЙ МЕТР, а не просто складається з більших будинків:\n\ndef segment_report(houses, assignments, k):\n    report = {}\n    for i in range(k):\n        segment = [h for h, a in zip(houses, assignments) if a == i]\n        pps = [h[\"price\"] / h[\"area\"] for h in segment]\n        report[i] = {\"count\": len(segment), \"avg_price_per_sqm\": sum(pps) / len(pps)}\n    return report\n\nfor seg_id, info in segment_report(houses, [0, 0, 0, 1, 1, 1], 2).items():\n    print(f\"Сегмент {seg_id}: {info['count']} буд., {info['avg_price_per_sqm']:.4f} за м²\")",
    examples: [
      { title: "segment_report() — регресія + кластеризація разом", code: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\nassignments = [0, 0, 0, 1, 1, 1]\n\ndef segment_report(houses, assignments, k):\n    report = {}\n    for i in range(k):\n        segment = [h for h, a in zip(houses, assignments) if a == i]\n        pps = [h["price"] / h["area"] for h in segment]\n        report[i] = {"count": len(segment), "avg_price_per_sqm": sum(pps) / len(pps)}\n    return report\n\nfor seg_id, info in segment_report(houses, assignments, 2).items():\n    print(f"Сегмент {seg_id}: {info['count']} буд., {info['avg_price_per_sqm']:.4f} за м²")`, explain: "Сегмент 0 (менші будинки) має ВИЩУ ціну за м² (1.4732), ніж сегмент 1 (1.4400) — інсайт, недоступний із самої регресії." },
    ],
    task: `Дано houses, assignments = [0, 0, 0, 1, 1, 1]. Напиши segment_report(houses, assignments, k), що для кожного сегмента рахує count і avg_price_per_sqm. Виведи звіт по обох сегментах.`,
    starter: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\nassignments = [0, 0, 0, 1, 1, 1]\n\ndef segment_report(houses, assignments, k):\n    # твій код тут\n    pass\n\n# for seg_id, info in segment_report(houses, assignments, 2).items():\n#     print(f"Сегмент {seg_id}: {info['count']} буд., {info['avg_price_per_sqm']:.4f} за м²")\n`,
    hints: [`segment = [h for h, a in zip(houses, assignments) if a == i] — будинки цього сегмента.`, `pps = [h["price"] / h["area"] for h in segment]; report[i] = {"count": len(segment), "avg_price_per_sqm": sum(pps) / len(pps)}`, `def segment_report(houses, assignments, k):\n    report = {}\n    for i in range(k):\n        segment = [h for h, a in zip(houses, assignments) if a == i]\n        pps = [h["price"] / h["area"] for h in segment]\n        report[i] = {"count": len(segment), "avg_price_per_sqm": sum(pps) / len(pps)}\n    return report`],
    solution: `houses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\nassignments = [0, 0, 0, 1, 1, 1]\n\ndef segment_report(houses, assignments, k):\n    report = {}\n    for i in range(k):\n        segment = [h for h, a in zip(houses, assignments) if a == i]\n        pps = [h["price"] / h["area"] for h in segment]\n        report[i] = {"count": len(segment), "avg_price_per_sqm": sum(pps) / len(pps)}\n    return report\n\nfor seg_id, info in segment_report(houses, assignments, 2).items():\n    print(f"Сегмент {seg_id}: {info['count']} буд., {info['avg_price_per_sqm']:.4f} за м²")`,
    testCode: `if "segment_report" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція segment_report(houses, assignments, k)."}\nelse:\n    report = segment_report(houses, assignments, 2)\n    if report[0]["count"] != 3 or abs(report[0]["avg_price_per_sqm"] - 1.4732) > 0.001:\n        __result__ = {"pass": False, "message": "Сегмент 0 має містити 3 будинки з avg_price_per_sqm ≈ 1.4732."}\n    elif not any("1.4732" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи звіт по сегментах через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Регресія прогнозує число, кластеризація знаходить групи — разом вони дають повнішу картину, ніж кожен метод окремо."}`,
  },
  {
    id: "py-datascience-20",
    title: "Фінальний проєкт: прогноз ціни й сегментація будинків",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків у одному робочому скрипті: fit_linear_regression() для прогнозу ціни за площею, і kmeans() для сегментації будинків на групи. Це і є повний прогнозний аналіз, обіцяний ще на вступній сторінці «Що це?».\n\nСаме ці дві ідеї (регресія й кластеризація) — фундамент, на якому побудований scikit-learn: LinearRegression() усередині рахує ту саму формулу cov/var, а KMeans() виконує той самий цикл assign→recompute, тільки швидше (на C) і з кращою ініціалізацією центроїдів.",
    examples: [
      { title: "Повний пайплайн: регресія + кластеризація", code: `def fit_linear_regression(data):\n    xs = [r["area"] for r in data]\n    ys = [r["price"] for r in data]\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n    var = sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n    slope = cov / var\n    intercept = my - slope * mx\n    return slope, intercept\n\nslope, intercept = fit_linear_regression(houses)\nprint(f"Прогноз для area=75: {slope * 75 + intercept:.2f}")`, explain: "Одна функція замінює 6 попередніх уроків про регресію (коваріація, дисперсія, нахил, перетин)." },
    ],
    task: `Дано houses і готові функції fit_linear_regression(data), euclidean_distance(a, b), kmeans(points, k, centroids, iterations=10) (у starter). Порахуй slope, intercept = fit_linear_regression(houses), виведи f"Прогноз для area=75: {slope * 75 + intercept:.2f}". Потім виклич kmeans на points = [(h["area"], h["price"]) for h in houses] з centroids = [(40, 60), (120, 175)] і виведи фінальні центроїди, округлені до 2 знаків.`,
    starter: `import math\n\nhouses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\ndef fit_linear_regression(data):\n    xs = [r["area"] for r in data]\n    ys = [r["price"] for r in data]\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n    var = sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n    slope = cov / var\n    intercept = my - slope * mx\n    return slope, intercept\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\ndef kmeans(points, k, centroids, iterations=10):\n    for _ in range(iterations):\n        assignments = []\n        for p in points:\n            distances = [euclidean_distance(p, c) for c in centroids]\n            assignments.append(distances.index(min(distances)))\n        new_centroids = []\n        for i in range(k):\n            cluster_points = [p for p, a in zip(points, assignments) if a == i]\n            new_centroids.append((sum(p[0] for p in cluster_points) / len(cluster_points), sum(p[1] for p in cluster_points) / len(cluster_points)))\n        if new_centroids == centroids:\n            break\n        centroids = new_centroids\n    return centroids, assignments\n\n# slope, intercept = fit_linear_regression(houses)\n# print(f"Прогноз для area=75: {slope * 75 + intercept:.2f}")\n\n# points = [(h["area"], h["price"]) for h in houses]\n# final_centroids, final_assignments = kmeans(points, 2, [(40, 60), (120, 175)])\n# print([(round(c[0], 2), round(c[1], 2)) for c in final_centroids])\n`,
    hints: [`slope, intercept = fit_linear_regression(houses); print(f"Прогноз для area=75: {slope * 75 + intercept:.2f}")`, `points = [(h["area"], h["price"]) for h in houses]; final_centroids, final_assignments = kmeans(points, 2, [(40, 60), (120, 175)])`, `slope, intercept = fit_linear_regression(houses)\nprint(f"Прогноз для area=75: {slope * 75 + intercept:.2f}")\n\npoints = [(h["area"], h["price"]) for h in houses]\nfinal_centroids, final_assignments = kmeans(points, 2, [(40, 60), (120, 175)])\nprint([(round(c[0], 2), round(c[1], 2)) for c in final_centroids])`],
    solution: `import math\n\nhouses = [\n    {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},\n    {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},\n]\n\ndef fit_linear_regression(data):\n    xs = [r["area"] for r in data]\n    ys = [r["price"] for r in data]\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)\n    var = sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)\n    slope = cov / var\n    intercept = my - slope * mx\n    return slope, intercept\n\ndef euclidean_distance(a, b):\n    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)\n\ndef kmeans(points, k, centroids, iterations=10):\n    for _ in range(iterations):\n        assignments = []\n        for p in points:\n            distances = [euclidean_distance(p, c) for c in centroids]\n            assignments.append(distances.index(min(distances)))\n        new_centroids = []\n        for i in range(k):\n            cluster_points = [p for p, a in zip(points, assignments) if a == i]\n            new_centroids.append((sum(p[0] for p in cluster_points) / len(cluster_points), sum(p[1] for p in cluster_points) / len(cluster_points)))\n        if new_centroids == centroids:\n            break\n        centroids = new_centroids\n    return centroids, assignments\n\nslope, intercept = fit_linear_regression(houses)\nprint(f"Прогноз для area=75: {slope * 75 + intercept:.2f}")\n\npoints = [(h["area"], h["price"]) for h in houses]\nfinal_centroids, final_assignments = kmeans(points, 2, [(40, 60), (120, 175)])\nprint([(round(c[0], 2), round(c[1], 2)) for c in final_centroids])`,
    testCode: `if "final_centroids" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна final_centroids (результат kmeans)."}\nelif not any("108.91" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Прогноз для area=75 має бути 108.91."}\nelif abs(final_centroids[0][0] - 55.0) > 0.01 or abs(final_centroids[1][0] - 101.67) > 0.01:\n    __result__ = {"pass": False, "message": "final_centroids мають бути приблизно (55.0, 80.67) і (101.67, 146.67)."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Регресія й кластеризація з нуля — той самий фундамент, на якому побудований scikit-learn."}`,
    finalProject: {
      techs: ["Python 3", "math", "statistics", "random", "list/dict comprehension"],
      skills: [
        "Train/test split для чесної перевірки моделі",
        "Нормалізація ознак: min-max і z-score",
        "Лінійна регресія з нуля: коваріація, дисперсія, slope, intercept",
        "Метрики якості: MSE, RMSE, R²",
        "Евклідова відстань і кластеризація k-means з нуля",
        "Інженерія ознак і об'єднання регресії з кластеризацією у звіт",
      ],
      structure:
        "house_price_predictor.py\n  ├── fit_linear_regression(data)   # навчання: slope, intercept\n  ├── predict(area, slope, intercept)  # прогноз ціни\n  ├── evaluate(model, test)          # MSE, RMSE, R² на test\n  ├── kmeans(points, k, centroids)    # сегментація на групи\n  └── segment_report(houses, assignments)  # регресія + кластери разом",
      code: `import math
import random


def covariance(xs, ys):
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (len(xs) - 1)


def variance(xs):
    mx = sum(xs) / len(xs)
    return sum((x - mx) ** 2 for x in xs) / (len(xs) - 1)


def fit_linear_regression(data):
    xs = [r["area"] for r in data]
    ys = [r["price"] for r in data]
    slope = covariance(xs, ys) / variance(xs)
    intercept = sum(ys) / len(ys) - slope * (sum(xs) / len(xs))
    return slope, intercept


def predict(area, slope, intercept):
    return slope * area + intercept


def evaluate(slope, intercept, data):
    residuals = [r["price"] - predict(r["area"], slope, intercept) for r in data]
    mean_y = sum(r["price"] for r in data) / len(data)
    mse = sum(res ** 2 for res in residuals) / len(residuals)
    rmse = math.sqrt(mse)
    ss_tot = sum((r["price"] - mean_y) ** 2 for r in data)
    r2 = 1 - sum(res ** 2 for res in residuals) / ss_tot
    return {"mse": mse, "rmse": rmse, "r2": r2}


def euclidean_distance(a, b):
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)


def kmeans(points, k, centroids, iterations=10):
    for _ in range(iterations):
        assignments = [
            min(range(len(centroids)), key=lambda i: euclidean_distance(p, centroids[i]))
            for p in points
        ]
        new_centroids = []
        for i in range(k):
            cluster = [p for p, a in zip(points, assignments) if a == i]
            new_centroids.append((sum(p[0] for p in cluster) / len(cluster), sum(p[1] for p in cluster) / len(cluster)))
        if new_centroids == centroids:
            break
        centroids = new_centroids
    return centroids, assignments


def segment_report(houses, assignments, k):
    report = {}
    for i in range(k):
        segment = [h for h, a in zip(houses, assignments) if a == i]
        pps = [h["price"] / h["area"] for h in segment]
        report[i] = {"count": len(segment), "avg_price_per_sqm": sum(pps) / len(pps)}
    return report


if __name__ == "__main__":
    houses = [
        {"area": 40, "price": 60}, {"area": 55, "price": 82}, {"area": 70, "price": 100},
        {"area": 85, "price": 120}, {"area": 100, "price": 145}, {"area": 120, "price": 175},
    ]

    random.seed(1)
    shuffled = houses[:]
    random.shuffle(shuffled)
    split_idx = int(len(shuffled) * 0.8)
    train, test = shuffled[:split_idx], shuffled[split_idx:]

    slope, intercept = fit_linear_regression(train)
    metrics = evaluate(slope, intercept, test)
    print(f"Модель: price = {slope:.2f} * area + {intercept:.2f}")
    print(f"RMSE на test: {metrics['rmse']:.2f}, R²: {metrics['r2']:.4f}")

    points = [(h["area"], h["price"]) for h in houses]
    final_centroids, assignments = kmeans(points, 2, [(40, 60), (120, 175)])
    for seg_id, info in segment_report(houses, assignments, 2).items():
        print(f"Сегмент {seg_id}: {info['count']} буд., {info['avg_price_per_sqm']:.2f} за м²")`,
      runCommand: "python house_price_predictor.py",
      installGuide: {
        intro:
          "math, statistics і random вбудовані в реальний Python — нічого встановлювати не потрібно, щоб запустити ЦЕЙ код локально. numpy/scikit-learn дають те саме в 1-2 рядки замість 20 уроків формул — але тепер зрозуміло, ЩО саме вони рахують всередині.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text: "Зайди на python.org/downloads і встанови останню версію. Windows: галочка «Add python.exe to PATH».",
            code: null,
          },
          {
            title: "2. Встанови numpy й scikit-learn",
            text: "Для реальних проєктів — швидша, перевірена реалізація тих самих формул:",
            code: "pip install numpy scikit-learn",
          },
          {
            title: "3. Порівняй: та сама регресія на scikit-learn",
            text:
              "LinearRegression().fit() рахує ті самі cov/var зсередини — тільки на C, тому в тисячі разів швидше на великих даних.",
            code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans

X = np.array([[40], [55], [70], [85], [100], [120]])
y = np.array([60, 82, 100, 120, 145, 175])

model = LinearRegression().fit(X, y)
print(model.coef_, model.intercept_)
print(model.predict([[75]]))

kmeans = KMeans(n_clusters=2, random_state=1).fit(np.column_stack([X, y]))
print(kmeans.cluster_centers_)`,
          },
          {
            title: "4. Запусти скрипт",
            text: "Обидва варіанти (з нуля чи scikit-learn) дають той самий прогноз і ті самі сегменти.",
            code: "python house_price_predictor.py",
          },
        ],
      },
      improvements: [
        "Перейти на numpy/scikit-learn для великих датасетів і складніших моделей (поліноміальна регресія, дерева рішень)",
        "Додати k-means++ ініціалізацію центроїдів замість фіксованих початкових точок",
        "Побудувати множинну регресію (кілька ознак одразу: площа + кімнати + поверх)",
        "Додати крос-валідацію (кілька різних train/test розбиттів) для надійнішої оцінки якості",
      ],
      nextLevel:
        "Далі — 🤖 AI / Machine Learning: регресія й кластеризація — навчання БЕЗ вчителя й з простими формулами; наступний рівень — класифікація з учителем, метрики точності (precision/recall) і перші кроки в бік нейронних мереж.",
    },
  },
];
