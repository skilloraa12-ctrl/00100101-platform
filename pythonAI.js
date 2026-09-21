// Python AI / Machine Learning — the twelfth Python direction. Same intro +
// 20 lessons structure. Where 📈 Data Science predicted a NUMBER (linear
// regression) and found groups without labels (k-means), this direction
// is about CLASSIFICATION with a teacher: every training example already
// has a known 0/1 answer, and the model learns to predict that answer for
// new, unseen examples. Like every prior "no library" direction, this is
// built entirely from scratch with math/random only — no numpy, no
// scikit-learn, no tensorflow (all unavailable for the same confirmed
// reason: `import numpy` fails because this app's Pyodide checker never
// calls loadPackage()). Logistic regression trained by hand-written
// gradient descent is, in fact, precisely what a "neuron" in a neural
// network does — this direction is the real, unsimplified first step
// toward deep learning, not a toy version of it.
export const PYTHON_AI_LESSONS = [
  {
    id: "py-ai-intro",
    title: "Що це? — AI / Machine Learning",
    type: "intro",
    theory:
      "Python AI / Machine Learning — це напрямок про навчання МОДЕЛІ РОЗРІЗНЯТИ категорії, маючи приклади з відомими відповідями. 📈 Data Science прогнозував ЧИСЛО (яка буде ціна?) і шукав групи БЕЗ підказок (k-means). Тут інакше: кожен приклад для навчання вже має мітку 0 або 1 (склав/не склав, спам/не спам), і модель вчиться передбачати ЦЮ мітку для нових, ще не бачених прикладів — це називається навчання З УЧИТЕЛЕМ (supervised learning).\n\nЯк і всюди в цих 16 напрямках, де потрібна «важка» бібліотека — numpy, scikit-learn, tensorflow тут НЕ підключаються: перевірено напряму, що import numpy падає з тією самою помилкою, що й у 📈 Data Science (await pyodide.loadPackage(), якого немає в цьому застосунку). Тому логістична регресія — модель для класифікації — будується вручну: сигмоїда, функція втрат, градієнтний спуск, цикл навчання. Це НЕ спрощена версія машинного навчання — це буквально те, що робить один «нейрон» у нейронній мережі, лише без модного слова.\n\nЩо знадобиться з попередніх напрямків: списки й функції (Python Core), formules коваріації/дисперсії й train/test split (📈 Data Science) — сама логістична регресія використовує ті самі принципи навчання й оцінки, тільки для КАТЕГОРІЙ замість чисел. Що буде після 20 уроків: student_pass_predictor.py — модель, що прогнозує «склав/не склав» за годинами підготовки, навчена градієнтним спуском і оцінена через precision/recall/F1, разом з альтернативним k-NN підходом для порівняння.",
    presentation: [
      { title: "AI / Machine Learning — коротко", points: ["Навчання З УЧИТЕЛЕМ: кожен приклад має відому мітку (0 або 1)", "Логістична регресія й k-NN будуються вручну — numpy/scikit-learn недоступні", "Градієнтний спуск — те, що робить один «нейрон» нейронної мережі"] },
      { title: "Результат", points: ["20 уроків: k-NN → сигмоїда → градієнтний спуск → метрики якості класифікації", "Фінал: student_pass_predictor.py — прогноз «склав/не склав» з precision/recall/F1", "Потрібне знання functions (🐍 Python Core) і train/test split (📈 Data Science)"] },
    ],
  },
  {
    id: "py-ai-1",
    title: "Класифікація: мітки замість чисел",
    type: "python",
    theory:
      "У регресії (📈 Data Science) відповідь — будь-яке число (ціна будинку). У класифікації відповідь — ОДНА З КІЛЬКОХ КАТЕГОРІЙ, найчастіше закодована як 0 і 1 (не склав / склав, не спам / спам). Мітки (labels) — ЗАЗДАЛЕГІДЬ відомі відповіді для навчальних прикладів:\n\nstudents = [\n    {\"hours\": 1, \"passed\": 0},\n    {\"hours\": 2, \"passed\": 0},\n    {\"hours\": 3, \"passed\": 0},\n    {\"hours\": 4, \"passed\": 1},\n    {\"hours\": 5, \"passed\": 1},\n    {\"hours\": 6, \"passed\": 1},\n]\n\nlabels = [s[\"passed\"] for s in students]\nprint(labels)\n\nМодель навчається на ЦИХ парах (hours → passed) і потім прогнозує passed для НОВИХ значень hours, яких не було в даних.",
    examples: [
      { title: "Дані з мітками 0/1", code: `students = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\nlabels = [s["passed"] for s in students]\nprint(labels)\nprint(f"Склали: {sum(labels)} з {len(labels)}")`, explain: "labels = [0, 0, 0, 1, 1, 1] — рівно половина склала (3 з 6)." },
    ],
    task: `Дано students (6 записів з hours і passed). Порахуй labels = [s["passed"] for s in students]. Виведи labels і f"Склали: {sum(labels)} з {len(labels)}".`,
    starter: `students = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\n# labels = [s["passed"] for s in students]\n# print(labels)\n# print(f"Склали: {sum(labels)} з {len(labels)}")\n`,
    hints: [`labels = [s["passed"] for s in students] — list comprehension.`, `sum(labels) рахує кількість одиниць (бо True/1 підсумовуються як числа).`, `labels = [s["passed"] for s in students]\nprint(labels)\nprint(f"Склали: {sum(labels)} з {len(labels)}")`],
    solution: `students = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\nlabels = [s["passed"] for s in students]\nprint(labels)\nprint(f"Склали: {sum(labels)} з {len(labels)}")`,
    testCode: `if "labels" not in globals() or labels != [0, 0, 0, 1, 1, 1]:\n    __result__ = {"pass": False, "message": "labels має дорівнювати [0, 0, 0, 1, 1, 1]."}\nelif not any("Склали: 3 з 6" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Має вивестись «Склали: 3 з 6»."}\nelse:\n    __result__ = {"pass": True, "message": "Мітки 0/1 — фундамент навчання з учителем: модель вчиться на ВІДОМИХ відповідях."}`,
  },
  {
    id: "py-ai-2",
    title: "k-NN: пошук найближчих сусідів",
    type: "python",
    theory:
      "Метод k найближчих сусідів (k-Nearest Neighbors) — найпростіший спосіб класифікації: щоб передбачити мітку для нової точки, знайди k НАЙСХОЖІШИХ прикладів у навчальних даних і подивись, яка мітка в них переважає. «Схожість» тут — відстань за ознакою (hours):\n\ndef distance(query, hours):\n    return abs(query - hours)\n\nsorted_students = sorted(students, key=lambda s: distance(3.2, s[\"hours\"]))\nfor s in sorted_students:\n    print(s[\"hours\"], s[\"passed\"])\n\nsorted(..., key=...) впорядковує студентів від НАЙБЛИЖЧОГО до query=3.2 до найдальшого.",
    examples: [
      { title: "Сортування за відстанню до query", code: `students = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef distance(query, hours):\n    return abs(query - hours)\n\nsorted_students = sorted(students, key=lambda s: distance(3.2, s["hours"]))\nfor s in sorted_students:\n    print(s["hours"], s["passed"])`, explain: "Найближчий до 3.2 — hours=3 (відстань 0.2), потім hours=4 (відстань 0.8)." },
    ],
    task: `Дано students, distance(query, hours). Відсортуй students за відстанню до query=3.2 через sorted(students, key=lambda s: distance(3.2, s["hours"])). Виведи hours і passed кожного студента в новому порядку.`,
    starter: `students = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef distance(query, hours):\n    return abs(query - hours)\n\n# sorted_students = sorted(students, key=lambda s: distance(3.2, s["hours"]))\n# for s in sorted_students:\n#     print(s["hours"], s["passed"])\n`,
    hints: [`sorted(students, key=lambda s: distance(3.2, s["hours"])) — сортує за зростанням відстані.`, `Цикл for s in sorted_students: print(s["hours"], s["passed"])`, `sorted_students = sorted(students, key=lambda s: distance(3.2, s["hours"]))\nfor s in sorted_students:\n    print(s["hours"], s["passed"])`],
    solution: `students = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef distance(query, hours):\n    return abs(query - hours)\n\nsorted_students = sorted(students, key=lambda s: distance(3.2, s["hours"]))\nfor s in sorted_students:\n    print(s["hours"], s["passed"])`,
    testCode: `if "sorted_students" not in globals() or sorted_students[0]["hours"] != 3:\n    __result__ = {"pass": False, "message": "Найближчий до query=3.2 студент має мати hours=3."}\nelif sorted_students[-1]["hours"] != 6:\n    __result__ = {"pass": False, "message": "Найдальший студент (hours=6) має бути в кінці списку."}\nelse:\n    __result__ = {"pass": True, "message": "Сортування за відстанню — перший крок k-NN: знайти, хто НАЙСХОЖІШИЙ на нову точку."}`,
  },
  {
    id: "py-ai-3",
    title: "k-NN: мажоритарне голосування",
    type: "python",
    theory:
      "Другий крок k-NN: взяти k НАЙБЛИЖЧИХ сусідів (не всіх!) і подивитись, яка мітка серед них ЧАСТІШЕ зустрічається — це і є прогноз:\n\ndef knn_predict(query, data, k):\n    sorted_data = sorted(data, key=lambda s: abs(query - s[\"hours\"]))\n    neighbors = sorted_data[:k]\n    votes = [n[\"passed\"] for n in neighbors]\n    return 1 if votes.count(1) > votes.count(0) else 0\n\nprint(knn_predict(3.2, students, 3))\n\nvotes.count(1) > votes.count(0) — просте мажоритарне голосування; при рівності голосів (лише для парного k) функція повертає 0.",
    examples: [
      { title: "knn_predict() — повний метод k-NN", code: `students = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef knn_predict(query, data, k):\n    sorted_data = sorted(data, key=lambda s: abs(query - s["hours"]))\n    neighbors = sorted_data[:k]\n    votes = [n["passed"] for n in neighbors]\n    return 1 if votes.count(1) > votes.count(0) else 0\n\nprint(knn_predict(3.2, students, 3))`, explain: "3 найближчих до 3.2: hours 3(0), 4(1), 2(0) → голоси [0, 1, 0] → більшість 0 → прогноз 0 (не склав)." },
    ],
    task: `Напиши knn_predict(query, data, k), що бере k найближчих сусідів і повертає мітку з більшістю голосів. Виклич knn_predict(3.2, students, 3) і виведи результат.`,
    starter: `students = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef knn_predict(query, data, k):\n    # твій код тут\n    pass\n\n# print(knn_predict(3.2, students, 3))\n`,
    hints: [`sorted_data = sorted(data, key=lambda s: abs(query - s["hours"])); neighbors = sorted_data[:k]`, `votes = [n["passed"] for n in neighbors]; return 1 if votes.count(1) > votes.count(0) else 0`, `def knn_predict(query, data, k):\n    sorted_data = sorted(data, key=lambda s: abs(query - s["hours"]))\n    neighbors = sorted_data[:k]\n    votes = [n["passed"] for n in neighbors]\n    return 1 if votes.count(1) > votes.count(0) else 0\n\nprint(knn_predict(3.2, students, 3))`],
    solution: `students = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef knn_predict(query, data, k):\n    sorted_data = sorted(data, key=lambda s: abs(query - s["hours"]))\n    neighbors = sorted_data[:k]\n    votes = [n["passed"] for n in neighbors]\n    return 1 if votes.count(1) > votes.count(0) else 0\n\nprint(knn_predict(3.2, students, 3))`,
    testCode: `if "knn_predict" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція knn_predict(query, data, k)."}\nelif knn_predict(3.2, students, 3) != 0:\n    __result__ = {"pass": False, "message": "knn_predict(3.2, students, 3) має повернути 0."}\nelif knn_predict(5.5, students, 3) != 1:\n    __result__ = {"pass": False, "message": "knn_predict(5.5, students, 3) має повернути 1 (усі три найближчі сусіди склали)."}\nelse:\n    __result__ = {"pass": True, "message": "k-NN — найпростіший класифікатор: жодного навчання, лише пошук схожих прикладів і голосування."}`,
  },
  {
    id: "py-ai-4",
    title: "Сигмоїда: перетворення числа в ймовірність",
    type: "python",
    theory:
      "k-NN не дає ЙМОВІРНОСТІ — лише готову мітку. Логістична регресія натомість прогнозує число від 0 до 1 (наскільки модель ВПЕВНЕНА), використовуючи сигмоїду — функцію, що «стискає» будь-яке число (від -∞ до +∞) у діапазон (0, 1):\n\nimport math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\nprint(sigmoid(0))     # рівно посередині\nprint(round(sigmoid(2), 4))  # велике додатне z → ближче до 1\n\nsigmoid(0) завжди дорівнює точно 0.5 — «модель не має жодної підказки», а великі додатні z дають ймовірність, близьку до 1.",
    examples: [
      { title: "sigmoid()", code: `import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\nprint(sigmoid(0))\nprint(round(sigmoid(2), 4))\nprint(round(sigmoid(-2), 4))`, explain: "sigmoid(0) = 0.5, sigmoid(2) ≈ 0.8808 (впевнено «так»), sigmoid(-2) ≈ 0.1192 (впевнено «ні»)." },
    ],
    task: `Напиши sigmoid(z) = 1 / (1 + math.exp(-z)). Виведи sigmoid(0) і округлений до 4 знаків sigmoid(2).`,
    starter: `import math\n\ndef sigmoid(z):\n    # твій код тут\n    pass\n\n# print(sigmoid(0))\n# print(round(sigmoid(2), 4))\n`,
    hints: [`math.exp(-z) — експонента від'ємного z.`, `return 1 / (1 + math.exp(-z))`, `def sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\nprint(sigmoid(0))\nprint(round(sigmoid(2), 4))`],
    solution: `import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\nprint(sigmoid(0))\nprint(round(sigmoid(2), 4))`,
    testCode: `if "sigmoid" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція sigmoid(z)."}\nelif abs(sigmoid(0) - 0.5) > 0.0001:\n    __result__ = {"pass": False, "message": "sigmoid(0) має дорівнювати рівно 0.5."}\nelif not any("0.8808" in l for l in __logs):\n    __result__ = {"pass": False, "message": "sigmoid(2) округлено до 4 знаків має бути 0.8808."}\nelse:\n    __result__ = {"pass": True, "message": "Сигмоїда — серце логістичної регресії: перетворює будь-яке число на ймовірність від 0 до 1."}`,
  },
  {
    id: "py-ai-5",
    title: "Гіпотеза логістичної регресії",
    type: "python",
    theory:
      "Гіпотеза — формула, за якою модель РАХУЄ ймовірність для конкретного прикладу: спочатку лінійна комбінація (як у регресії — w * x + b), потім сигмоїда стискає результат у ймовірність:\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\nprint(round(hypothesis(4, 1, -3), 4))\n\nw і b — це ті самі «навчувані параметри», що slope та intercept у лінійній регресії, тільки тепер вони йдуть ПІД сигмоїду, а не напряму дають відповідь.",
    examples: [
      { title: "hypothesis() — лінійна частина + сигмоїда", code: `import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\nprint(round(hypothesis(4, 1, -3), 4))`, explain: "w=1, b=-3, x=4 → z=1, sigmoid(1) ≈ 0.7311 — модель на 73% впевнена, що це «так»." },
    ],
    task: `Дано sigmoid() (в starter). Напиши hypothesis(x, w, b) = sigmoid(w * x + b). Виведи округлений до 4 знаків hypothesis(4, 1, -3).`,
    starter: `import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    # твій код тут\n    pass\n\n# print(round(hypothesis(4, 1, -3), 4))\n`,
    hints: [`Спочатку лінійна частина: w * x + b`, `return sigmoid(w * x + b)`, `def hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\nprint(round(hypothesis(4, 1, -3), 4))`],
    solution: `import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\nprint(round(hypothesis(4, 1, -3), 4))`,
    testCode: `if "hypothesis" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція hypothesis(x, w, b)."}\nelif not any("0.7311" in l for l in __logs):\n    __result__ = {"pass": False, "message": "hypothesis(4, 1, -3) округлено до 4 знаків має бути 0.7311."}\nelse:\n    __result__ = {"pass": True, "message": "Гіпотеза — те, що модель РАХУЄ для будь-якого прикладу: лінійна комбінація під сигмоїдою."}`,
  },
  {
    id: "py-ai-6",
    title: "Функція втрат: бінарна крос-ентропія",
    type: "python",
    theory:
      "Щоб НАВЧИТИ модель, потрібно число, що показує, наскільки вона ПОМИЛЯЄТЬСЯ — функція втрат (loss). Для класифікації використовують бінарну крос-ентропію (log loss): вона СИЛЬНО карає впевнену, але НЕПРАВИЛЬНУ відповідь:\n\ndef loss(w, b, data):\n    total = 0\n    for s in data:\n        p = hypothesis(s[\"hours\"], w, b)\n        y = s[\"passed\"]\n        total += -(y * math.log(p) + (1 - y) * math.log(1 - p))\n    return total / len(data)\n\nprint(round(loss(0, 0, students), 4))\n\nПри w=0, b=0 модель ще НІЧОГО не знає — sigmoid(0)=0.5 для всіх, тому початкова втрата = -log(0.5) ≈ 0.6931 (природний логарифм 2).",
    examples: [
      { title: "loss() — початкова втрата ненавченої моделі", code: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef loss(w, b, data):\n    total = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        y = s["passed"]\n        total += -(y * math.log(p) + (1 - y) * math.log(1 - p))\n    return total / len(data)\n\nprint(round(loss(0, 0, students), 4))`, explain: "loss(0, 0, students) ≈ 0.6931 — «максимальна невизначеність», модель ще нічого не навчилась." },
    ],
    task: `Дано sigmoid(), hypothesis(), students (в starter). Напиши loss(w, b, data) за формулою бінарної крос-ентропії. Виведи округлений до 4 знаків loss(0, 0, students).`,
    starter: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef loss(w, b, data):\n    # твій код тут\n    pass\n\n# print(round(loss(0, 0, students), 4))\n`,
    hints: [`Для кожного s: p = hypothesis(s["hours"], w, b), y = s["passed"]`, `total += -(y * math.log(p) + (1 - y) * math.log(1 - p)); поверни total / len(data)`, `def loss(w, b, data):\n    total = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        y = s["passed"]\n        total += -(y * math.log(p) + (1 - y) * math.log(1 - p))\n    return total / len(data)`],
    solution: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef loss(w, b, data):\n    total = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        y = s["passed"]\n        total += -(y * math.log(p) + (1 - y) * math.log(1 - p))\n    return total / len(data)\n\nprint(round(loss(0, 0, students), 4))`,
    testCode: `if "loss" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція loss(w, b, data)."}\nelif not any("0.6931" in l for l in __logs):\n    __result__ = {"pass": False, "message": "loss(0, 0, students) округлено до 4 знаків має бути 0.6931 (природний логарифм 2)."}\nelse:\n    __result__ = {"pass": True, "message": "Функція втрат — число, яке градієнтний спуск буде намагатись ЗМЕНШИТИ на кожному кроці навчання."}`,
  },
  {
    id: "py-ai-7",
    title: "Градієнт: у який бік рухати w і b",
    type: "python",
    theory:
      "Градієнт показує, У ЯКОМУ НАПРЯМІ й НАСКІЛЬКИ треба змінити w та b, щоб зменшити втрату. Для логістичної регресії з крос-ентропією формула виявляється НЕОЧІКУВАНО простою — така сама, як для лінійної регресії, тільки помилка тепер (ймовірність - реальна мітка):\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s[\"hours\"], w, b)\n        error = p - s[\"passed\"]\n        dw += error * s[\"hours\"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\nprint(gradients(0, 0, students))\n\nВід'ємний dw означає: щоб зменшити втрату, w треба ЗБІЛЬШИТИ (рухатись у бік, протилежний градієнту, — саме тому в оновленні w -= lr * dw).",
    examples: [
      { title: "gradients() при w=0, b=0", code: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndw, db = gradients(0, 0, students)\nprint(dw, db)`, explain: "dw=-0.75, db=0.0 — модель ще нічого не знає (w=0,b=0), градієнт показує рухати w у ПЛЮС." },
    ],
    task: `Дано sigmoid(), hypothesis(), students (в starter). Напиши gradients(w, b, data), що повертає (dw, db). Виклич gradients(0, 0, students) і виведи dw, db.`,
    starter: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    # твій код тут\n    pass\n\n# dw, db = gradients(0, 0, students)\n# print(dw, db)\n`,
    hints: [`Для кожного s: p = hypothesis(...), error = p - s["passed"]; накопичуй dw += error*s["hours"], db += error`, `Після циклу поділи обидва на n = len(data).`, `def gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n`],
    solution: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndw, db = gradients(0, 0, students)\nprint(dw, db)`,
    testCode: `if "gradients" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція gradients(w, b, data)."}\nelse:\n    dw_r, db_r = gradients(0, 0, students)\n    if abs(dw_r - (-0.75)) > 0.001 or abs(db_r - 0.0) > 0.001:\n        __result__ = {"pass": False, "message": "gradients(0, 0, students) має дати (-0.75, 0.0)."}\n    elif not any("-0.75" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи dw і db через print(dw, db)."}\n    else:\n        __result__ = {"pass": True, "message": "Градієнт — компас, що показує, у який бік і наскільки рухати w та b, щоб зменшити помилку."}`,
  },
  {
    id: "py-ai-8",
    title: "Один крок градієнтного спуску",
    type: "python",
    theory:
      "Маючи градієнт, ОНОВИ параметри в напрямку, ПРОТИЛЕЖНОМУ градієнту (тому й «спуск» — рухаємось до мінімуму втрати), масштабуючи крок швидкістю навчання (learning rate):\n\nlr = 0.1\ndw, db = gradients(w, b, students)\nw = w - lr * dw\nb = b - lr * db\nprint(w, b)\nprint(round(loss(w, b, students), 4))\n\nПісля ОДНОГО кроку від w=0,b=0: w стає 0.075, а втрата падає з 0.6931 до приблизно 0.6475 — модель вже трохи «розумніша».",
    examples: [
      { title: "Один крок оновлення параметрів", code: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef loss(w, b, data):\n    total = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        y = s["passed"]\n        total += -(y * math.log(p) + (1 - y) * math.log(1 - p))\n    return total / len(data)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\nw, b = 0, 0\nlr = 0.1\ndw, db = gradients(w, b, students)\nw = w - lr * dw\nb = b - lr * db\nprint(round(w, 4), round(b, 4))\nprint(round(loss(w, b, students), 4))`, explain: "w=0.075, b=0.0, а втрата зменшилась з 0.6931 до 0.6475 — крок у правильному напрямку." },
    ],
    task: `Дано sigmoid(), hypothesis(), loss(), gradients(), students (в starter). Постав w=0, b=0, lr=0.1. Зроби ОДИН крок: обчисли gradients(), онови w і b. Виведи округлені до 4 знаків w, b і loss(w, b, students).`,
    starter: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef loss(w, b, data):\n    total = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        y = s["passed"]\n        total += -(y * math.log(p) + (1 - y) * math.log(1 - p))\n    return total / len(data)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\nw, b = 0, 0\nlr = 0.1\n\n# dw, db = gradients(w, b, students)\n# w = w - lr * dw\n# b = b - lr * db\n# print(round(w, 4), round(b, 4))\n# print(round(loss(w, b, students), 4))\n`,
    hints: [`dw, db = gradients(w, b, students)`, `w = w - lr * dw; b = b - lr * db`, `dw, db = gradients(w, b, students)\nw = w - lr * dw\nb = b - lr * db\nprint(round(w, 4), round(b, 4))\nprint(round(loss(w, b, students), 4))`],
    solution: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef loss(w, b, data):\n    total = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        y = s["passed"]\n        total += -(y * math.log(p) + (1 - y) * math.log(1 - p))\n    return total / len(data)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\nw, b = 0, 0\nlr = 0.1\n\ndw, db = gradients(w, b, students)\nw = w - lr * dw\nb = b - lr * db\nprint(round(w, 4), round(b, 4))\nprint(round(loss(w, b, students), 4))`,
    testCode: `if abs(w - 0.075) > 0.001 or abs(b - 0.0) > 0.001:\n    __result__ = {"pass": False, "message": "Після одного кроку w має бути 0.075, b — 0.0."}\nelif not any("0.6475" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Втрата після кроку округлено до 4 знаків має бути 0.6475."}\nelse:\n    __result__ = {"pass": True, "message": "Втрата зменшилась з 0.6931 до 0.6475 за один крок — саме так навчається будь-яка модель градієнтним спуском."}`,
  },
  {
    id: "py-ai-9",
    title: "Повний цикл навчання (epochs)",
    type: "python",
    theory:
      "Один крок ледь помітно покращує модель. Щоб дійсно НАВЧИТИ її, крок повторюють ТИСЯЧІ разів (кожен повний прохід по даних — це одна епоха):\n\ndef train(data, epochs=2000, lr=0.1):\n    w, b = 0, 0\n    for _ in range(epochs):\n        dw, db = gradients(w, b, data)\n        w -= lr * dw\n        b -= lr * db\n    return w, b\n\nw, b = train(students)\nprint(round(w, 4), round(b, 4))\n\nПісля 2000 епох w і b стабілізуються (перестають суттєво змінюватись) — модель ЗБІГЛАСЬ і готова до використання.",
    examples: [
      { title: "train() — повний цикл на 2000 епох", code: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndef train(data, epochs=2000, lr=0.1):\n    w, b = 0, 0\n    for _ in range(epochs):\n        dw, db = gradients(w, b, data)\n        w -= lr * dw\n        b -= lr * db\n    return w, b\n\nw, b = train(students)\nprint(round(w, 4), round(b, 4))`, explain: "w ≈ 2.2637, b ≈ -7.7039 — модель тепер РІЗКО розрізняє малі й великі hours (велике |w|)." },
    ],
    task: `Дано sigmoid(), hypothesis(), gradients(), students (в starter). Напиши train(data, epochs=2000, lr=0.1), що повторює крок оновлення epochs разів, починаючи з w=0, b=0. Виклич train(students) і виведи округлені до 4 знаків w, b.`,
    starter: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndef train(data, epochs=2000, lr=0.1):\n    # твій код тут\n    pass\n\n# w, b = train(students)\n# print(round(w, 4), round(b, 4))\n`,
    hints: [`w, b = 0, 0 на початку`, `for _ in range(epochs): dw, db = gradients(w, b, data); w -= lr*dw; b -= lr*db`, `def train(data, epochs=2000, lr=0.1):\n    w, b = 0, 0\n    for _ in range(epochs):\n        dw, db = gradients(w, b, data)\n        w -= lr * dw\n        b -= lr * db\n    return w, b`],
    solution: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndef train(data, epochs=2000, lr=0.1):\n    w, b = 0, 0\n    for _ in range(epochs):\n        dw, db = gradients(w, b, data)\n        w -= lr * dw\n        b -= lr * db\n    return w, b\n\nw, b = train(students)\nprint(round(w, 4), round(b, 4))`,
    testCode: `if "train" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція train(data, epochs=2000, lr=0.1)."}\nelif abs(w - 2.2637) > 0.01 or abs(b - (-7.7039)) > 0.01:\n    __result__ = {"pass": False, "message": "Після навчання w має бути приблизно 2.2637, b — приблизно -7.7039."}\nelse:\n    __result__ = {"pass": True, "message": "2000 маленьких кроків — і модель ЗБІГЛАСЬ: тепер вона різко розрізняє малі й великі hours."}`,
  },
  {
    id: "py-ai-10",
    title: "Прогноз: ймовірність і класифікація за порогом",
    type: "python",
    theory:
      "Навчена модель дає ЙМОВІРНІСТЬ (число від 0 до 1), а не готову мітку. Щоб отримати мітку, порівнюють ймовірність із ПОРОГОМ (найчастіше 0.5):\n\ndef predict(x, w, b, threshold=0.5):\n    p = hypothesis(x, w, b)\n    return 1 if p >= threshold else 0\n\nfor hours in [3, 3.5, 4]:\n    print(hours, round(hypothesis(hours, w, b), 4), predict(hours, w, b))\n\nЦікаво: hours=3 дає ймовірність 0.2864 (< 0.5 → 0), а hours=3.5 вже дає 0.5546 (≥ 0.5 → 1) — прогноз ПЕРЕМИКАЄТЬСЯ десь між ними.",
    examples: [
      { title: "predict() з порогом 0.5", code: `import math\n\nw, b = 2.263724108429097, -7.703904480281582\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef predict(x, w, b, threshold=0.5):\n    p = hypothesis(x, w, b)\n    return 1 if p >= threshold else 0\n\nfor hours in [3, 3.5, 4]:\n    print(hours, round(hypothesis(hours, w, b), 4), predict(hours, w, b))`, explain: "3 → 0.2864 → 0; 3.5 → 0.5546 → 1; 4 → 0.7943 → 1 — прогноз перемикається між 3 і 3.5 годинами." },
    ],
    task: `Дано sigmoid(), hypothesis(), навчені w, b (в starter). Напиши predict(x, w, b, threshold=0.5). У циклі для hours у [3, 3.5, 4] виведи hours, округлену hypothesis і predict.`,
    starter: `import math\n\nw, b = 2.263724108429097, -7.703904480281582\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef predict(x, w, b, threshold=0.5):\n    # твій код тут\n    pass\n\n# for hours in [3, 3.5, 4]:\n#     print(hours, round(hypothesis(hours, w, b), 4), predict(hours, w, b))\n`,
    hints: [`p = hypothesis(x, w, b)`, `return 1 if p >= threshold else 0`, `def predict(x, w, b, threshold=0.5):\n    p = hypothesis(x, w, b)\n    return 1 if p >= threshold else 0\n\nfor hours in [3, 3.5, 4]:\n    print(hours, round(hypothesis(hours, w, b), 4), predict(hours, w, b))`],
    solution: `import math\n\nw, b = 2.263724108429097, -7.703904480281582\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef predict(x, w, b, threshold=0.5):\n    p = hypothesis(x, w, b)\n    return 1 if p >= threshold else 0\n\nfor hours in [3, 3.5, 4]:\n    print(hours, round(hypothesis(hours, w, b), 4), predict(hours, w, b))`,
    testCode: `if "predict" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція predict(x, w, b, threshold=0.5)."}\nelif predict(3, w, b) != 0 or predict(4, w, b) != 1:\n    __result__ = {"pass": False, "message": "predict(3, w, b) має бути 0, predict(4, w, b) — 1."}\nelif not any("0.5546" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Для hours=3.5 hypothesis округлено має бути 0.5546."}\nelse:\n    __result__ = {"pass": True, "message": "Поріг 0.5 перетворює ЙМОВІРНІСТЬ моделі на готову мітку 0 чи 1."}`,
  },
  {
    id: "py-ai-11",
    title: "Матриця плутанини (confusion matrix)",
    type: "python",
    theory:
      "Проста accuracy («скільки прогнозів правильні») не завжди достатня. Матриця плутанини розкладає результат на 4 випадки: True Positive (правильно «так»), True Negative (правильно «ні»), False Positive (помилково «так»), False Negative (помилково «ні»):\n\ndef confusion_matrix(actual, predicted):\n    tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\n    tn = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 0)\n    fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\n    fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\n    return tp, tn, fp, fn\n\nactual =    [0, 0, 0, 1, 1, 1]\npredicted = [0, 0, 1, 1, 1, 0]\nprint(confusion_matrix(actual, predicted))",
    examples: [
      { title: "confusion_matrix() — 4 типи результатів", code: `def confusion_matrix(actual, predicted):\n    tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\n    tn = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 0)\n    fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\n    fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\n    return tp, tn, fp, fn\n\nactual =    [0, 0, 0, 1, 1, 1]\npredicted = [0, 0, 1, 1, 1, 0]\nprint(confusion_matrix(actual, predicted))`, explain: "(2, 2, 1, 1) — 2 правильних «так», 2 правильних «ні», 1 хибна тривога (FP), 1 пропуск (FN)." },
    ],
    task: `Дано actual, predicted (6 значень кожен). Напиши confusion_matrix(actual, predicted), що повертає (tp, tn, fp, fn). Виведи результат.`,
    starter: `actual =    [0, 0, 0, 1, 1, 1]\npredicted = [0, 0, 1, 1, 1, 0]\n\ndef confusion_matrix(actual, predicted):\n    # твій код тут\n    pass\n\n# print(confusion_matrix(actual, predicted))\n`,
    hints: [`tp: a==1 і p==1; tn: a==0 і p==0; fp: a==0 і p==1; fn: a==1 і p==0 — усі через sum(1 for ... if ...).`, `Поверни кортеж (tp, tn, fp, fn) у ЦЬОМУ порядку.`, `def confusion_matrix(actual, predicted):\n    tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\n    tn = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 0)\n    fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\n    fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\n    return tp, tn, fp, fn`],
    solution: `actual =    [0, 0, 0, 1, 1, 1]\npredicted = [0, 0, 1, 1, 1, 0]\n\ndef confusion_matrix(actual, predicted):\n    tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\n    tn = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 0)\n    fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\n    fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\n    return tp, tn, fp, fn\n\nprint(confusion_matrix(actual, predicted))`,
    testCode: `if "confusion_matrix" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція confusion_matrix(actual, predicted)."}\nelif confusion_matrix(actual, predicted) != (2, 2, 1, 1):\n    __result__ = {"pass": False, "message": "confusion_matrix(actual, predicted) має повернути (2, 2, 1, 1)."}\nelse:\n    __result__ = {"pass": True, "message": "TP/TN/FP/FN — 4 числа, з яких рахуються ВСІ метрики якості класифікації."}`,
  },
  {
    id: "py-ai-12",
    title: "Accuracy: проста, але не завжди чесна метрика",
    type: "python",
    theory:
      "Accuracy — частка ПРАВИЛЬНИХ прогнозів серед усіх: (TP + TN) / загальна кількість. Проста й зрозуміла, але оманлива, якщо класи НЕЗБАЛАНСОВАНІ (наприклад, 95% листів — не спам: модель, що завжди каже «не спам», матиме 95% accuracy, нічого корисного не роблячи):\n\ntp, tn, fp, fn = 2, 2, 1, 1\naccuracy = (tp + tn) / (tp + tn + fp + fn)\nprint(round(accuracy, 4))",
    examples: [
      { title: "accuracy = (TP + TN) / всього", code: `tp, tn, fp, fn = 2, 2, 1, 1\naccuracy = (tp + tn) / (tp + tn + fp + fn)\nprint(round(accuracy, 4))`, explain: "accuracy ≈ 0.6667 — з 6 прогнозів 4 правильні (2 TP + 2 TN)." },
    ],
    task: `Дано tp, tn, fp, fn = 2, 2, 1, 1. Порахуй accuracy = (tp + tn) / (tp + tn + fp + fn). Виведи округлений до 4 знаків результат.`,
    starter: `tp, tn, fp, fn = 2, 2, 1, 1\n\n# accuracy = (tp + tn) / (tp + tn + fp + fn)\n# print(round(accuracy, 4))\n`,
    hints: [`Чисельник — сума ПРАВИЛЬНИХ прогнозів: tp + tn.`, `Знаменник — усі 4 числа разом.`, `accuracy = (tp + tn) / (tp + tn + fp + fn)\nprint(round(accuracy, 4))`],
    solution: `tp, tn, fp, fn = 2, 2, 1, 1\n\naccuracy = (tp + tn) / (tp + tn + fp + fn)\nprint(round(accuracy, 4))`,
    testCode: `if "accuracy" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна accuracy."}\nelif abs(accuracy - 0.6667) > 0.001:\n    __result__ = {"pass": False, "message": "accuracy має бути приблизно 0.6667."}\nelse:\n    __result__ = {"pass": True, "message": "Accuracy проста для розуміння, але оманлива при незбалансованих класах — саме тому далі йдуть precision і recall."}`,
  },
  {
    id: "py-ai-13",
    title: "Precision і Recall: обережна модель проти агресивної",
    type: "python",
    theory:
      "Precision відповідає: «з усіх, кого модель назвала ПОЗИТИВНИМИ, скільки насправді такі?» — важливо, коли ХИБНА ТРИВОГА дорога. Recall відповідає: «з усіх СПРАВЖНІХ позитивних, скільки модель ЗНАЙШЛА?» — важливо, коли ПРОПУСК дорогий:\n\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\n\nactual =    [1, 1, 1, 1, 0, 0, 0, 0]\npredicted = [1, 1, 0, 0, 0, 0, 0, 0]\n# tp=2, fp=0, fn=2 → precision=1.0 (жодної хибної тривоги), recall=0.5 (пропустила половину)\n\nМодель тут ДУЖЕ обережна: коли каже «так» — завжди права (precision=1.0), але пропускає половину реальних позитивних (recall=0.5).",
    examples: [
      { title: "Обережна модель: precision=1.0, recall=0.5", code: `actual =    [1, 1, 1, 1, 0, 0, 0, 0]\npredicted = [1, 1, 0, 0, 0, 0, 0, 0]\n\ntp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\nfp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\nfn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\n\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nprint(f"precision={precision:.4f}, recall={recall:.4f}")`, explain: "precision=1.0000 (жодної хибної тривоги), recall=0.5000 (модель пропустила 2 з 4 реальних «так»)." },
    ],
    task: `Дано actual, predicted (8 значень). Порахуй tp, fp, fn (як в уроці про confusion matrix), потім precision = tp / (tp + fp) і recall = tp / (tp + fn). Виведи f"precision={precision:.4f}, recall={recall:.4f}".`,
    starter: `actual =    [1, 1, 1, 1, 0, 0, 0, 0]\npredicted = [1, 1, 0, 0, 0, 0, 0, 0]\n\n# tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\n# fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\n# fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\n\n# precision = tp / (tp + fp)\n# recall = tp / (tp + fn)\n# print(f"precision={precision:.4f}, recall={recall:.4f}")\n`,
    hints: [`tp, fp, fn — три підрахунки через sum(1 for ... if ...), як у попередньому уроці.`, `precision = tp / (tp + fp); recall = tp / (tp + fn)`, `tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\nfp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\nfn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nprint(f"precision={precision:.4f}, recall={recall:.4f}")`],
    solution: `actual =    [1, 1, 1, 1, 0, 0, 0, 0]\npredicted = [1, 1, 0, 0, 0, 0, 0, 0]\n\ntp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\nfp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\nfn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\n\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nprint(f"precision={precision:.4f}, recall={recall:.4f}")`,
    testCode: `if "precision" not in globals() or "recall" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні precision і recall."}\nelif abs(precision - 1.0) > 0.001 or abs(recall - 0.5) > 0.001:\n    __result__ = {"pass": False, "message": "precision має бути 1.0, recall — 0.5 для цього прикладу."}\nelse:\n    __result__ = {"pass": True, "message": "Обережна модель: коли каже «так» — завжди права (precision=1.0), але пропускає половину реальних випадків (recall=0.5)."}`,
  },
  {
    id: "py-ai-14",
    title: "F1-міра: баланс precision і recall",
    type: "python",
    theory:
      "Precision і recall часто СУПЕРЕЧАТЬ одне одному: підвищуючи одне (наприклад, знижуючи поріг класифікації), зазвичай знижуєш інше. F1-міра — гармонійне середнє обох, що дає ОДНЕ число для порівняння моделей:\n\nf1 = 2 * precision * recall / (precision + recall)\nprint(round(f1, 4))\n\nГармонійне (а не звичайне) середнє обране навмисно: F1 близький до НАЙМЕНШОГО з двох чисел — модель не може «сховати» слабкий recall за високим precision.",
    examples: [
      { title: "F1 = гармонійне середнє precision і recall", code: `precision, recall = 1.0, 0.5\n\nf1 = 2 * precision * recall / (precision + recall)\nprint(round(f1, 4))`, explain: "F1 ≈ 0.6667 — ближче до слабшого recall=0.5, ніж до сильнішого precision=1.0 (звичайне середнє дало б 0.75)." },
    ],
    task: `Дано precision = 1.0, recall = 0.5. Порахуй f1 = 2 * precision * recall / (precision + recall). Виведи округлений до 4 знаків результат.`,
    starter: `precision, recall = 1.0, 0.5\n\n# f1 = 2 * precision * recall / (precision + recall)\n# print(round(f1, 4))\n`,
    hints: [`Формула гармонійного середнього: 2 * a * b / (a + b).`, `f1 = 2 * precision * recall / (precision + recall)`, `f1 = 2 * precision * recall / (precision + recall)\nprint(round(f1, 4))`],
    solution: `precision, recall = 1.0, 0.5\n\nf1 = 2 * precision * recall / (precision + recall)\nprint(round(f1, 4))`,
    testCode: `if "f1" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна f1."}\nelif abs(f1 - 0.6667) > 0.001:\n    __result__ = {"pass": False, "message": "f1 має бути приблизно 0.6667."}\nelse:\n    __result__ = {"pass": True, "message": "F1 ближче до слабшого з двох показників — модель не може сховати провал в одному за успіхом в іншому."}`,
  },
  {
    id: "py-ai-15",
    title: "Train/test split для класифікації",
    type: "python",
    theory:
      "Той самий принцип, що й у 📈 Data Science: модель НАВЧАЄТЬСЯ на train, а перевіряється на test — даних, яких вона не бачила. Формула розбиття ідентична, лише дані тепер з мітками замість цін:\n\nimport random\n\nrandom.seed(1)\nshuffled = students[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\nprint(len(train), len(test))\n\nrandom.seed(1) на тому самому за розміром списку (6 елементів) завжди дає ТОЙ САМИЙ порядок перемішування, незалежно від того, що саме зберігається в записах.",
    examples: [
      { title: "80/20 розбиття для класифікації", code: `import random\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\nrandom.seed(1)\nshuffled = students[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\nprint(len(train), len(test))\nprint(test)`, explain: "train — 4 студенти, test — 2 (hours=5 і hours=2) — той самий порядок перемішування, що й для будинків у Data Science." },
    ],
    task: `Дано students (6 записів). Постав random.seed(1), перемішай копію, поділи на train (80%) і test (20%). Виведи len(train), len(test) і test.`,
    starter: `import random\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\n# random.seed(1)\n# shuffled = students[:]\n# random.shuffle(shuffled)\n# split_idx = int(len(shuffled) * 0.8)\n# train, test = shuffled[:split_idx], shuffled[split_idx:]\n\n# print(len(train), len(test))\n# print(test)\n`,
    hints: [`random.seed(1) ПЕРЕД shuffle().`, `split_idx = int(len(shuffled) * 0.8); train, test = shuffled[:split_idx], shuffled[split_idx:]`, `random.seed(1)\nshuffled = students[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\nprint(len(train), len(test))\nprint(test)`],
    solution: `import random\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\n\nrandom.seed(1)\nshuffled = students[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\nprint(len(train), len(test))\nprint(test)`,
    testCode: `if "train" not in globals() or "test" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні train і test."}\nelif len(train) != 4 or len(test) != 2:\n    __result__ = {"pass": False, "message": "При random.seed(1) train має містити 4, test — 2 записи."}\nelif not any(s["hours"] == 5 for s in test):\n    __result__ = {"pass": False, "message": "З random.seed(1) test має містити студента з hours=5."}\nelse:\n    __result__ = {"pass": True, "message": "Той самий train/test принцип працює для класифікації так само, як і для регресії."}`,
  },
  {
    id: "py-ai-16",
    title: "Оцінка моделі на test через усі метрики разом",
    type: "python",
    theory:
      "Тепер об'єднаємо все: НАВЧИ модель лише на train, спрогнозуй мітки для test, і порахуй confusion matrix + accuracy на ПРИХОВАНИХ даних — це чесна перевірка якості:\n\nw, b = train_model(train)\npreds = [predict(s[\"hours\"], w, b) for s in test]\nactual = [s[\"passed\"] for s in test]\n\ntp, tn, fp, fn = confusion_matrix(actual, preds)\naccuracy = (tp + tn) / len(actual)\nprint(round(accuracy, 4))",
    examples: [
      { title: "Повна оцінка на test", code: `import math, random\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\nrandom.seed(1)\nshuffled = students[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndef train_model(data, epochs=2000, lr=0.1):\n    w, b = 0, 0\n    for _ in range(epochs):\n        dw, db = gradients(w, b, data)\n        w -= lr * dw\n        b -= lr * db\n    return w, b\n\ndef predict(x, w, b):\n    return 1 if hypothesis(x, w, b) >= 0.5 else 0\n\nw, b = train_model(train)\npreds = [predict(s["hours"], w, b) for s in test]\nactual = [s["passed"] for s in test]\n\ntp = sum(1 for a, p in zip(actual, preds) if a == 1 and p == 1)\ntn = sum(1 for a, p in zip(actual, preds) if a == 0 and p == 0)\naccuracy = (tp + tn) / len(actual)\nprint(round(accuracy, 4))`, explain: "accuracy = 1.0 — модель, навчена лише на 4 прикладах, правильно класифікувала ОБИДВА приховані тестові приклади." },
    ],
    task: `Дано sigmoid(), hypothesis(), gradients(), train_model(), predict(), train, test (в starter). Спрогнозуй preds для test, порахуй tp, tn і accuracy = (tp + tn) / len(actual). Виведи округлену до 4 знаків accuracy.`,
    starter: `import math, random\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\nrandom.seed(1)\nshuffled = students[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndef train_model(data, epochs=2000, lr=0.1):\n    w, b = 0, 0\n    for _ in range(epochs):\n        dw, db = gradients(w, b, data)\n        w -= lr * dw\n        b -= lr * db\n    return w, b\n\ndef predict(x, w, b):\n    return 1 if hypothesis(x, w, b) >= 0.5 else 0\n\nw, b = train_model(train)\n\n# preds = [predict(s["hours"], w, b) for s in test]\n# actual = [s["passed"] for s in test]\n# tp = sum(1 for a, p in zip(actual, preds) if a == 1 and p == 1)\n# tn = sum(1 for a, p in zip(actual, preds) if a == 0 and p == 0)\n# accuracy = (tp + tn) / len(actual)\n# print(round(accuracy, 4))\n`,
    hints: [`preds = [predict(s["hours"], w, b) for s in test]; actual = [s["passed"] for s in test]`, `tp і tn через sum(1 for ... if ...); accuracy = (tp + tn) / len(actual)`, `preds = [predict(s["hours"], w, b) for s in test]\nactual = [s["passed"] for s in test]\ntp = sum(1 for a, p in zip(actual, preds) if a == 1 and p == 1)\ntn = sum(1 for a, p in zip(actual, preds) if a == 0 and p == 0)\naccuracy = (tp + tn) / len(actual)\nprint(round(accuracy, 4))`],
    solution: `import math, random\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\nrandom.seed(1)\nshuffled = students[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndef train_model(data, epochs=2000, lr=0.1):\n    w, b = 0, 0\n    for _ in range(epochs):\n        dw, db = gradients(w, b, data)\n        w -= lr * dw\n        b -= lr * db\n    return w, b\n\ndef predict(x, w, b):\n    return 1 if hypothesis(x, w, b) >= 0.5 else 0\n\nw, b = train_model(train)\n\npreds = [predict(s["hours"], w, b) for s in test]\nactual = [s["passed"] for s in test]\ntp = sum(1 for a, p in zip(actual, preds) if a == 1 and p == 1)\ntn = sum(1 for a, p in zip(actual, preds) if a == 0 and p == 0)\naccuracy = (tp + tn) / len(actual)\nprint(round(accuracy, 4))`,
    testCode: `if "accuracy" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна accuracy."}\nelif abs(accuracy - 1.0) > 0.001:\n    __result__ = {"pass": False, "message": "accuracy на test має дорівнювати 1.0 (модель класифікує обидва тестові приклади правильно)."}\nelse:\n    __result__ = {"pass": True, "message": "Модель, навчена лише на train, правильно класифікує ПРИХОВАНІ тестові приклади — ознака реального навчання."}`,
  },
  {
    id: "py-ai-17",
    title: "Нормалізація ознак перед навчанням",
    type: "python",
    theory:
      "Градієнтний спуск чутливий до МАСШТАБУ ознак: якщо одна ознака — сотні, а інша — одиниці, крок навчання, який добре працює для однієї, може бути занадто великим або малим для іншої. Нормалізація (min-max, як у 📈 Data Science) масштабує ознаку в [0, 1] ПЕРЕД навчанням:\n\ndef min_max_normalize(values):\n    mn, mx = min(values), max(values)\n    return [(v - mn) / (mx - mn) for v in values]\n\nhours = [s[\"hours\"] for s in students]\nnorm_hours = min_max_normalize(hours)\nprint(norm_hours)\n\nЦя вправа з 📈 Data Science точно так само застосовується тут — і взагалі до БУДЬ-ЯКОГО алгоритму, що навчається градієнтним спуском.",
    examples: [
      { title: "min_max_normalize() перед навчанням", code: `students = [{"hours": 1}, {"hours": 2}, {"hours": 3}, {"hours": 4}, {"hours": 5}, {"hours": 6}]\n\ndef min_max_normalize(values):\n    mn, mx = min(values), max(values)\n    return [(v - mn) / (mx - mn) for v in values]\n\nhours = [s["hours"] for s in students]\nnorm_hours = min_max_normalize(hours)\nprint(norm_hours)`, explain: "hours=1 стає 0.0, hours=6 стає 1.0 — модель тепер навчається на однаково масштабованих числах." },
    ],
    task: `Напиши min_max_normalize(values). Застосуй до hours = [s["hours"] for s in students]. Виведи результат.`,
    starter: `students = [{"hours": 1}, {"hours": 2}, {"hours": 3}, {"hours": 4}, {"hours": 5}, {"hours": 6}]\n\ndef min_max_normalize(values):\n    # твій код тут\n    pass\n\n# hours = [s["hours"] for s in students]\n# norm_hours = min_max_normalize(hours)\n# print(norm_hours)\n`,
    hints: [`mn, mx = min(values), max(values)`, `return [(v - mn) / (mx - mn) for v in values]`, `def min_max_normalize(values):\n    mn, mx = min(values), max(values)\n    return [(v - mn) / (mx - mn) for v in values]\n\nhours = [s["hours"] for s in students]\nnorm_hours = min_max_normalize(hours)\nprint(norm_hours)`],
    solution: `students = [{"hours": 1}, {"hours": 2}, {"hours": 3}, {"hours": 4}, {"hours": 5}, {"hours": 6}]\n\ndef min_max_normalize(values):\n    mn, mx = min(values), max(values)\n    return [(v - mn) / (mx - mn) for v in values]\n\nhours = [s["hours"] for s in students]\nnorm_hours = min_max_normalize(hours)\nprint(norm_hours)`,
    testCode: `if "min_max_normalize" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція min_max_normalize(values)."}\nelif min_max_normalize([1, 6]) != [0.0, 1.0]:\n    __result__ = {"pass": False, "message": "min_max_normalize([1, 6]) має дати [0.0, 1.0]."}\nelif "norm_hours" not in globals() or norm_hours[0] != 0.0 or norm_hours[-1] != 1.0:\n    __result__ = {"pass": False, "message": "norm_hours має починатись з 0.0 і закінчуватись 1.0."}\nelse:\n    __result__ = {"pass": True, "message": "Нормалізація перед навчанням — практика, що застосовується до БУДЬ-якого алгоритму на градієнтному спуску."}`,
  },
  {
    id: "py-ai-18",
    title: "Межа рішення (decision boundary)",
    type: "python",
    theory:
      "Межа рішення — точна межа, де модель ПЕРЕМИКАЄТЬСЯ з прогнозу 0 на прогноз 1: там, де hypothesis(x) = 0.5, тобто де w*x + b = 0 (сигмоїда від 0 завжди дорівнює 0.5):\n\nboundary = -b / w\nprint(round(boundary, 4))\n\nДля навченої моделі (w ≈ 2.2637, b ≈ -7.7039) межа — приблизно 3.4032 години: менше цього — модель прогнозує «не склав», більше — «склав».",
    examples: [
      { title: "boundary = -b / w", code: `w, b = 2.263724108429097, -7.703904480281582\n\nboundary = -b / w\nprint(round(boundary, 4))`, explain: "boundary ≈ 3.4032 — рівно посередині між hours=3 (не склав) і hours=3.5 (склав) з попередніх уроків." },
    ],
    task: `Дано w, b (навчені параметри). Порахуй boundary = -b / w. Виведи округлений до 4 знаків результат.`,
    starter: `w, b = 2.263724108429097, -7.703904480281582\n\n# boundary = -b / w\n# print(round(boundary, 4))\n`,
    hints: [`w * x + b = 0 → x = -b / w`, `boundary = -b / w`, `boundary = -b / w\nprint(round(boundary, 4))`],
    solution: `w, b = 2.263724108429097, -7.703904480281582\n\nboundary = -b / w\nprint(round(boundary, 4))`,
    testCode: `if "boundary" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна boundary."}\nelif abs(boundary - 3.4032) > 0.01:\n    __result__ = {"pass": False, "message": "boundary має бути приблизно 3.4032."}\nelse:\n    __result__ = {"pass": True, "message": "Межа рішення — точна точка, де модель змінює свою відповідь із 0 на 1."}`,
  },
  {
    id: "py-ai-19",
    title: "k-NN проти логістичної регресії: порівняння",
    type: "python",
    theory:
      "Для однієї й тієї самої точки запиту k-NN і логістична регресія можуть дати ОДНАКОВИЙ або РІЗНИЙ прогноз — корисно порівняти обидва підходи на practice:\n\nprint(knn_predict(3.2, students, 3))\nprint(predict(3.2, w, b))\n\nk-NN не потребує НАВЧАННЯ (лише збереження даних і пошук під час прогнозу), а логістична регресія потребує навчання ЗАЗДАЛЕГІДЬ, але потім прогнозує миттєво (лише одна формула) — практичний компроміс між простотою і швидкістю прогнозу.",
    examples: [
      { title: "Порівняння двох методів на query=3.2", code: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\nw, b = 2.263724108429097, -7.703904480281582\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef predict(x, w, b):\n    return 1 if sigmoid(w * x + b) >= 0.5 else 0\n\ndef knn_predict(query, data, k):\n    sorted_data = sorted(data, key=lambda s: abs(query - s["hours"]))\n    votes = [n["passed"] for n in sorted_data[:k]]\n    return 1 if votes.count(1) > votes.count(0) else 0\n\nknn_result = knn_predict(3.2, students, 3)\nlog_reg_result = predict(3.2, w, b)\nprint(f"k-NN: {knn_result}, логістична регресія: {log_reg_result}")`, explain: "Обидва методи погоджуються: 0 (не склав) для query=3.2 — хороший знак, що обидва підходи узгоджені." },
    ],
    task: `Дано knn_predict(), predict(), students, w, b (в starter). Порахуй knn_result = knn_predict(3.2, students, 3) і log_reg_result = predict(3.2, w, b). Виведи f"k-NN: {knn_result}, логістична регресія: {log_reg_result}".`,
    starter: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\nw, b = 2.263724108429097, -7.703904480281582\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef predict(x, w, b):\n    return 1 if sigmoid(w * x + b) >= 0.5 else 0\n\ndef knn_predict(query, data, k):\n    sorted_data = sorted(data, key=lambda s: abs(query - s["hours"]))\n    votes = [n["passed"] for n in sorted_data[:k]]\n    return 1 if votes.count(1) > votes.count(0) else 0\n\n# knn_result = knn_predict(3.2, students, 3)\n# log_reg_result = predict(3.2, w, b)\n# print(f"k-NN: {knn_result}, логістична регресія: {log_reg_result}")\n`,
    hints: [`knn_result = knn_predict(3.2, students, 3)`, `log_reg_result = predict(3.2, w, b)`, `knn_result = knn_predict(3.2, students, 3)\nlog_reg_result = predict(3.2, w, b)\nprint(f"k-NN: {knn_result}, логістична регресія: {log_reg_result}")`],
    solution: `import math\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\nw, b = 2.263724108429097, -7.703904480281582\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef predict(x, w, b):\n    return 1 if sigmoid(w * x + b) >= 0.5 else 0\n\ndef knn_predict(query, data, k):\n    sorted_data = sorted(data, key=lambda s: abs(query - s["hours"]))\n    votes = [n["passed"] for n in sorted_data[:k]]\n    return 1 if votes.count(1) > votes.count(0) else 0\n\nknn_result = knn_predict(3.2, students, 3)\nlog_reg_result = predict(3.2, w, b)\nprint(f"k-NN: {knn_result}, логістична регресія: {log_reg_result}")`,
    testCode: `if "knn_result" not in globals() or "log_reg_result" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні knn_result і log_reg_result."}\nelif knn_result != 0 or log_reg_result != 0:\n    __result__ = {"pass": False, "message": "Обидва методи мають дати 0 для query=3.2."}\nelse:\n    __result__ = {"pass": True, "message": "Два зовсім різні алгоритми погодились — хороший знак, що дані дійсно розділені за годинами підготовки."}`,
  },
  {
    id: "py-ai-20",
    title: "Фінальний проєкт: прогноз «склав/не склав»",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків у student_pass_predictor.py: train/test split, навчання логістичної регресії градієнтним спуском, оцінка через confusion matrix/accuracy/precision/recall/F1, і k-NN для порівняння. Це і є повний класифікатор, обіцяний ще на вступній сторінці «Що це?».\n\nСаме ЦЕ (сигмоїда + лінійна комбінація + градієнтний спуск) — той самий будівельний блок, з якого складаються нейронні мережі: один «нейрон» — це буквально hypothesis(x, w, b), а «навчання мережі» — той самий градієнтний спуск, тільки одразу для тисяч w і b.",
    examples: [
      { title: "Повний пайплайн класифікації", code: `w, b = train_model(train)\npreds = [predict(s["hours"], w, b) for s in test]\nactual = [s["passed"] for s in test]\n\ntp, tn, fp, fn = confusion_matrix(actual, preds)\naccuracy = (tp + tn) / len(actual)\nprint(f"Accuracy на test: {accuracy:.4f}")`, explain: "Одна функція confusion_matrix() замінює ручний підрахунок TP/TN/FP/FN із кількох попередніх уроків." },
    ],
    task: `Дано train, test, sigmoid(), hypothesis(), gradients(), train_model(), predict(), confusion_matrix(), knn_predict() (усе в starter). Навчи модель на train, спрогнозуй на test, порахуй accuracy. Також порахуй knn_result = knn_predict(3.2, students, 3). Виведи f"Accuracy на test: {accuracy:.4f}" і knn_result.`,
    starter: `import math, random\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\nrandom.seed(1)\nshuffled = students[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndef train_model(data, epochs=2000, lr=0.1):\n    w, b = 0, 0\n    for _ in range(epochs):\n        dw, db = gradients(w, b, data)\n        w -= lr * dw\n        b -= lr * db\n    return w, b\n\ndef predict(x, w, b):\n    return 1 if hypothesis(x, w, b) >= 0.5 else 0\n\ndef confusion_matrix(actual, predicted):\n    tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\n    tn = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 0)\n    fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\n    fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\n    return tp, tn, fp, fn\n\ndef knn_predict(query, data, k):\n    sorted_data = sorted(data, key=lambda s: abs(query - s["hours"]))\n    votes = [n["passed"] for n in sorted_data[:k]]\n    return 1 if votes.count(1) > votes.count(0) else 0\n\n# w, b = train_model(train)\n# preds = [predict(s["hours"], w, b) for s in test]\n# actual = [s["passed"] for s in test]\n# tp, tn, fp, fn = confusion_matrix(actual, preds)\n# accuracy = (tp + tn) / len(actual)\n# print(f"Accuracy на test: {accuracy:.4f}")\n\n# knn_result = knn_predict(3.2, students, 3)\n# print(knn_result)\n`,
    hints: [`w, b = train_model(train); preds = [predict(s["hours"], w, b) for s in test]; actual = [s["passed"] for s in test]`, `tp, tn, fp, fn = confusion_matrix(actual, preds); accuracy = (tp + tn) / len(actual)`, `w, b = train_model(train)\npreds = [predict(s["hours"], w, b) for s in test]\nactual = [s["passed"] for s in test]\ntp, tn, fp, fn = confusion_matrix(actual, preds)\naccuracy = (tp + tn) / len(actual)\nprint(f"Accuracy на test: {accuracy:.4f}")\n\nknn_result = knn_predict(3.2, students, 3)\nprint(knn_result)`],
    solution: `import math, random\n\nstudents = [\n    {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},\n    {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},\n]\nrandom.seed(1)\nshuffled = students[:]\nrandom.shuffle(shuffled)\nsplit_idx = int(len(shuffled) * 0.8)\ntrain, test = shuffled[:split_idx], shuffled[split_idx:]\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\ndef hypothesis(x, w, b):\n    return sigmoid(w * x + b)\n\ndef gradients(w, b, data):\n    dw = db = 0\n    for s in data:\n        p = hypothesis(s["hours"], w, b)\n        error = p - s["passed"]\n        dw += error * s["hours"]\n        db += error\n    n = len(data)\n    return dw / n, db / n\n\ndef train_model(data, epochs=2000, lr=0.1):\n    w, b = 0, 0\n    for _ in range(epochs):\n        dw, db = gradients(w, b, data)\n        w -= lr * dw\n        b -= lr * db\n    return w, b\n\ndef predict(x, w, b):\n    return 1 if hypothesis(x, w, b) >= 0.5 else 0\n\ndef confusion_matrix(actual, predicted):\n    tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\n    tn = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 0)\n    fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)\n    fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)\n    return tp, tn, fp, fn\n\ndef knn_predict(query, data, k):\n    sorted_data = sorted(data, key=lambda s: abs(query - s["hours"]))\n    votes = [n["passed"] for n in sorted_data[:k]]\n    return 1 if votes.count(1) > votes.count(0) else 0\n\nw, b = train_model(train)\npreds = [predict(s["hours"], w, b) for s in test]\nactual = [s["passed"] for s in test]\ntp, tn, fp, fn = confusion_matrix(actual, preds)\naccuracy = (tp + tn) / len(actual)\nprint(f"Accuracy на test: {accuracy:.4f}")\n\nknn_result = knn_predict(3.2, students, 3)\nprint(knn_result)`,
    testCode: `if "accuracy" not in globals() or "knn_result" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні accuracy і knn_result."}\nelif abs(accuracy - 1.0) > 0.001:\n    __result__ = {"pass": False, "message": "accuracy на test має дорівнювати 1.0."}\nelif knn_result != 0:\n    __result__ = {"pass": False, "message": "knn_result для query=3.2 має бути 0."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Логістична регресія й k-NN з нуля — той самий будівельний блок, з якого складаються нейронні мережі."}`,
    finalProject: {
      techs: ["Python 3", "math", "random", "list/dict comprehension"],
      skills: [
        "Класифікація з учителем: мітки 0/1 замість чисел",
        "k-NN: класифікація без навчання, лише пошук схожих прикладів",
        "Логістична регресія: сигмоїда, гіпотеза, крос-ентропія",
        "Градієнтний спуск: градієнти, крок оновлення, цикл епох",
        "Оцінка класифікатора: confusion matrix, accuracy, precision, recall, F1",
        "Межа рішення й порівняння різних алгоритмів на одних даних",
      ],
      structure:
        "student_pass_predictor.py\n  ├── sigmoid(z), hypothesis(x, w, b)   # модель\n  ├── gradients(w, b, data)             # похідні для навчання\n  ├── train_model(data, epochs, lr)      # градієнтний спуск\n  ├── confusion_matrix(actual, predicted) # TP/TN/FP/FN\n  └── knn_predict(query, data, k)          # альтернативний класифікатор",
      code: `import math
import random


def sigmoid(z):
    return 1 / (1 + math.exp(-z))


def hypothesis(x, w, b):
    return sigmoid(w * x + b)


def gradients(w, b, data):
    dw = db = 0
    for s in data:
        p = hypothesis(s["hours"], w, b)
        error = p - s["passed"]
        dw += error * s["hours"]
        db += error
    n = len(data)
    return dw / n, db / n


def train_model(data, epochs=2000, lr=0.1):
    w, b = 0, 0
    for _ in range(epochs):
        dw, db = gradients(w, b, data)
        w -= lr * dw
        b -= lr * db
    return w, b


def predict(x, w, b, threshold=0.5):
    return 1 if hypothesis(x, w, b) >= threshold else 0


def confusion_matrix(actual, predicted):
    tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)
    tn = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 0)
    fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)
    fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)
    return tp, tn, fp, fn


def evaluate(w, b, data):
    preds = [predict(s["hours"], w, b) for s in data]
    actual = [s["passed"] for s in data]
    tp, tn, fp, fn = confusion_matrix(actual, preds)
    accuracy = (tp + tn) / len(actual)
    precision = tp / (tp + fp) if (tp + fp) else 0
    recall = tp / (tp + fn) if (tp + fn) else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0
    return {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1}


def knn_predict(query, data, k):
    sorted_data = sorted(data, key=lambda s: abs(query - s["hours"]))
    votes = [n["passed"] for n in sorted_data[:k]]
    return 1 if votes.count(1) > votes.count(0) else 0


if __name__ == "__main__":
    students = [
        {"hours": 1, "passed": 0}, {"hours": 2, "passed": 0}, {"hours": 3, "passed": 0},
        {"hours": 4, "passed": 1}, {"hours": 5, "passed": 1}, {"hours": 6, "passed": 1},
    ]

    random.seed(1)
    shuffled = students[:]
    random.shuffle(shuffled)
    split_idx = int(len(shuffled) * 0.8)
    train, test = shuffled[:split_idx], shuffled[split_idx:]

    w, b = train_model(train)
    metrics = evaluate(w, b, test)
    print(f"Модель: w={w:.2f}, b={b:.2f}")
    print(f"Accuracy: {metrics['accuracy']:.2f}, Precision: {metrics['precision']:.2f}, Recall: {metrics['recall']:.2f}, F1: {metrics['f1']:.2f}")

    new_student_hours = 3.2
    print(f"k-NN прогноз для {new_student_hours} год: {knn_predict(new_student_hours, students, 3)}")
    print(f"Логістична регресія для {new_student_hours} год: {predict(new_student_hours, w, b)}")`,
      runCommand: "python student_pass_predictor.py",
      installGuide: {
        intro:
          "math і random вбудовані в реальний Python — нічого встановлювати не потрібно, щоб запустити ЦЕЙ код локально. scikit-learn дає ту саму логістичну регресію в 2 рядки, а tensorflow/pytorch — коли знадобляться справжні нейронні мережі з тисячами параметрів.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text: "Зайди на python.org/downloads і встанови останню версію. Windows: галочка «Add python.exe to PATH».",
            code: null,
          },
          {
            title: "2. Встанови scikit-learn",
            text: "Для реальних проєктів — та сама логістична регресія, тільки швидша й з десятками готових алгоритмів:",
            code: "pip install scikit-learn",
          },
          {
            title: "3. Порівняй: та сама класифікація на scikit-learn",
            text:
              "LogisticRegression().fit() всередині виконує ТОЙ САМИЙ градієнтний спуск — тільки оптимізованіший і для будь-якої кількості ознак одразу.",
            code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

X = [[1], [2], [3], [4], [5], [6]]
y = [0, 0, 0, 1, 1, 1]

model = LogisticRegression().fit(X, y)
print(model.predict([[3.2]]))
print(model.predict_proba([[3.2]]))`,
          },
          {
            title: "4. Наступний крок — нейронні мережі",
            text:
              "torch.nn.Linear + torch.sigmoid — це буквально hypothesis(x, w, b) із цього напрямку, тільки з тисячами w одразу замість одного.",
            code: "pip install torch",
          },
        ],
      },
      improvements: [
        "Перейти на scikit-learn для реальних проєктів з багатьма ознаками одразу",
        "Додати регуляризацію (L2), щоб модель не «перенавчалась» на малих даних",
        "Реалізувати багатокласову класифікацію (більше за 2 категорії) через softmax",
        "Спробувати перший шар справжньої нейронної мережі на PyTorch чи TensorFlow",
      ],
      nextLevel:
        "Далі — 🔐 Cybersecurity: ті самі навички аналізу даних і патернів застосовуються для пошуку вразливостей і аномальної поведінки в системах.",
    },
  },
];
