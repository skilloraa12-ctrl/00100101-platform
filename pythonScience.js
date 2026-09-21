// Python Science & Research — the fourteenth Python direction. Same intro
// + 20 lessons structure. This direction is about NUMERICAL methods that
// scientists actually use daily: finding a derivative or integral without
// a formula, solving equations that can't be solved algebraically,
// estimating pi via random sampling, and simulating physical motion step
// by step. Real research code reaches for numpy/scipy — unavailable here
// for the same confirmed reason as every earlier direction (no compiled
// packages in this Pyodide build) — so every method here is the genuine,
// classic numerical-methods algorithm implemented directly in pure
// Python, exactly as it's taught in a numerical methods course before any
// library is introduced.
export const PYTHON_SCIENCE_LESSONS = [
  {
    id: "py-science-intro",
    title: "Що це? — Science & Research",
    type: "intro",
    theory:
      "Python Science & Research — це напрямок про ЧИСЕЛЬНІ методи: як знайти похідну функції без формули, порахувати інтеграл, який неможливо взяти аналітично, розв'язати рівняння, яке не розв'язується алгебраїчно, і змоделювати рух тіла крок за кроком. Це саме те, чим щодня займаються фізики, хіміки й інженери у своїх дослідженнях.\n\nУ реальних дослідженнях для цього беруть numpy/scipy — тут вони НЕ підключаються з тієї самої причини, що й у 📈 Data Science та 🤖 AI/ML (немає завантаження скомпільованих пакетів у цьому Pyodide). Але це НЕ проблема: усі алгоритми цього напрямку — метод скінченних різниць, трапецій, бісекції, Монте-Карло — це класичні чисельні методи, які викладають у курсі «Чисельні методи» ЩЕ ДО того, як показати scipy.optimize чи numpy.trapz. Ти будуєш саме той алгоритм, що працює всередині цих функцій.\n\nЩо знадобиться з попередніх напрямків: statistics.mean/stdev (📊 Data Analysis) для роботи з експериментальними вибірками, random.seed() для відтворюваного Монте-Карло (📈 Data Science). Що буде після 20 уроків: science_lab_toolkit.py — набір інструментів для чисельного диференціювання й інтегрування, пошуку коренів рівнянь, оцінки числа π методом Монте-Карло, і симуляції руху снаряда.",
    presentation: [
      { title: "Science & Research — коротко", points: ["Чисельні методи: похідна, інтеграл і корені рівнянь БЕЗ формул", "numpy/scipy не потрібні — ті самі класичні алгоритми з нуля", "Монте-Карло й симуляція руху — від випадковості до фізики"] },
      { title: "Результат", points: ["20 уроків: похибки → диференціювання → інтегрування → корені → Монте-Карло → фізика", "Фінал: science_lab_toolkit.py з повним набором чисельних методів", "Потрібне знання statistics (📊 Data Analysis) і random.seed (📈 Data Science)"] },
    ],
  },
  {
    id: "py-science-1",
    title: "Значущі цифри й округлення результату",
    type: "python",
    theory:
      "У науці результат вимірювання ніколи не записують з усіма цифрами, які видав калькулятор — лише СТІЛЬКИ значущих цифр, скільки виправдано точністю вимірювання. round(value, n) округлює до n знаків ПІСЛЯ коми, що для більшості лабораторних вимірювань достатньо:\n\ndef round_measurement(value, decimals):\n    return round(value, decimals)\n\nprint(round_measurement(9.80665, 2))\nprint(round_measurement(3.14159265, 4))\n\nЗайві цифри (9.80665 замість 9.81) створюють ХИБНЕ враження точності, якої прилад насправді не забезпечує.",
    examples: [
      { title: "round() для значущих цифр", code: `def round_measurement(value, decimals):\n    return round(value, decimals)\n\nprint(round_measurement(9.80665, 2))\nprint(round_measurement(3.14159265, 4))`, explain: "9.80665 округлюється до 9.81 (2 знаки), 3.14159265 — до 3.1416 (4 знаки)." },
    ],
    task: `Напиши round_measurement(value, decimals). Виведи round_measurement(9.80665, 2) і round_measurement(3.14159265, 4).`,
    starter: `def round_measurement(value, decimals):\n    # твій код тут\n    pass\n\n# print(round_measurement(9.80665, 2))\n# print(round_measurement(3.14159265, 4))\n`,
    hints: [`Вбудована функція round(value, decimals) робить усю роботу.`, `return round(value, decimals)`, `def round_measurement(value, decimals):\n    return round(value, decimals)\n\nprint(round_measurement(9.80665, 2))\nprint(round_measurement(3.14159265, 4))`],
    solution: `def round_measurement(value, decimals):\n    return round(value, decimals)\n\nprint(round_measurement(9.80665, 2))\nprint(round_measurement(3.14159265, 4))`,
    testCode: `if "round_measurement" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція round_measurement(value, decimals)."}\nelif round_measurement(9.80665, 2) != 9.81:\n    __result__ = {"pass": False, "message": "round_measurement(9.80665, 2) має дати 9.81."}\nelif round_measurement(3.14159265, 4) != 3.1416:\n    __result__ = {"pass": False, "message": "round_measurement(3.14159265, 4) має дати 3.1416."}\nelse:\n    __result__ = {"pass": True, "message": "Округлення до значущих цифр — базова наукова гігієна: не показувати точність, якої немає насправді."}`,
  },
  {
    id: "py-science-2",
    title: "Абсолютна й відносна похибка",
    type: "python",
    theory:
      "Абсолютна похибка — просто РІЗНИЦЯ між виміряним і істинним (еталонним) значенням. Відносна похибка виражає ЦЮ РІЗНИЦЮ як частку від істинного значення — це дозволяє порівнювати точність вимірювань РІЗНОГО масштабу (міліметри й кілометри):\n\ndef absolute_error(measured, true_value):\n    return abs(measured - true_value)\n\ndef relative_error(measured, true_value):\n    return absolute_error(measured, true_value) / abs(true_value)\n\nprint(round(absolute_error(9.8, 9.81), 4))\nprint(round(relative_error(9.8, 9.81), 6))\n\n9.8 замість 9.81 (прискорення вільного падіння) — маленька абсолютна похибка (0.01), і ще менша відносна (0.001, тобто 0.1%).",
    examples: [
      { title: "absolute_error() і relative_error()", code: `def absolute_error(measured, true_value):\n    return abs(measured - true_value)\n\ndef relative_error(measured, true_value):\n    return absolute_error(measured, true_value) / abs(true_value)\n\nprint(round(absolute_error(9.8, 9.81), 4))\nprint(round(relative_error(9.8, 9.81), 6))`, explain: "Абсолютна похибка 0.01, відносна ≈0.00102 (близько 0.1% від істинного значення)." },
    ],
    task: `Напиши absolute_error(measured, true_value) і relative_error(measured, true_value). Виведи округлені результати для measured=9.8, true_value=9.81.`,
    starter: `def absolute_error(measured, true_value):\n    # твій код тут\n    pass\n\ndef relative_error(measured, true_value):\n    # твій код тут\n    pass\n\n# print(round(absolute_error(9.8, 9.81), 4))\n# print(round(relative_error(9.8, 9.81), 6))\n`,
    hints: [`absolute_error: return abs(measured - true_value)`, `relative_error: return absolute_error(measured, true_value) / abs(true_value)`, `def absolute_error(measured, true_value):\n    return abs(measured - true_value)\n\ndef relative_error(measured, true_value):\n    return absolute_error(measured, true_value) / abs(true_value)`],
    solution: `def absolute_error(measured, true_value):\n    return abs(measured - true_value)\n\ndef relative_error(measured, true_value):\n    return absolute_error(measured, true_value) / abs(true_value)\n\nprint(round(absolute_error(9.8, 9.81), 4))\nprint(round(relative_error(9.8, 9.81), 6))`,
    testCode: `if "absolute_error" not in globals() or "relative_error" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні функції absolute_error(measured, true_value) і relative_error(measured, true_value)."}\nelif abs(absolute_error(9.8, 9.81) - 0.01) > 0.0001:\n    __result__ = {"pass": False, "message": "absolute_error(9.8, 9.81) має бути 0.01."}\nelif abs(relative_error(9.8, 9.81) - 0.00102) > 0.0001:\n    __result__ = {"pass": False, "message": "relative_error(9.8, 9.81) має бути приблизно 0.00102."}\nelse:\n    __result__ = {"pass": True, "message": "Відносна похибка дозволяє порівнювати точність вимірювань РІЗНОГО масштабу на рівних умовах."}`,
  },
  {
    id: "py-science-3",
    title: "Чисельне диференціювання: похідна без формули",
    type: "python",
    theory:
      "Похідна показує, ЯК ШВИДКО змінюється функція. Якщо аналітична формула похідної невідома (чи занадто складна), її можна ОЦІНИТИ чисельно через метод центральних різниць — дуже маленький крок h вперед і назад:\n\ndef derivative(f, x, h=1e-5):\n    return (f(x + h) - f(x - h)) / (2 * h)\n\nf = lambda x: x ** 2\nprint(round(derivative(f, 3), 4))\n\nАналітична похідна x² дорівнює 2x, тому в точці x=3 очікується 6 — і чисельний метод дає результат, ПРАКТИЧНО невідрізнимий від точного.",
    examples: [
      { title: "derivative() — метод центральних різниць", code: `def derivative(f, x, h=1e-5):\n    return (f(x + h) - f(x - h)) / (2 * h)\n\nf = lambda x: x ** 2\nprint(round(derivative(f, 3), 4))`, explain: "derivative(f, 3) ≈ 6.0 — збігається з аналітичною похідною 2x у точці x=3, хоч формула похідної НІДЕ не використовувалась." },
    ],
    task: `Напиши derivative(f, x, h=1e-5) за формулою центральних різниць. Застосуй до f = lambda x: x ** 2 у точці x=3. Виведи округлений до 4 знаків результат.`,
    starter: `def derivative(f, x, h=1e-5):\n    # твій код тут\n    pass\n\nf = lambda x: x ** 2\n# print(round(derivative(f, 3), 4))\n`,
    hints: [`Формула центральних різниць: (f(x+h) - f(x-h)) / (2*h)`, `return (f(x + h) - f(x - h)) / (2 * h)`, `def derivative(f, x, h=1e-5):\n    return (f(x + h) - f(x - h)) / (2 * h)\n\nf = lambda x: x ** 2\nprint(round(derivative(f, 3), 4))`],
    solution: `def derivative(f, x, h=1e-5):\n    return (f(x + h) - f(x - h)) / (2 * h)\n\nf = lambda x: x ** 2\nprint(round(derivative(f, 3), 4))`,
    testCode: `if "derivative" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція derivative(f, x, h=1e-5)."}\nelif abs(derivative(f, 3) - 6.0) > 0.001:\n    __result__ = {"pass": False, "message": "derivative(f, 3) для f(x)=x**2 має бути приблизно 6.0."}\nelse:\n    __result__ = {"pass": True, "message": "Чисельне диференціювання оцінює похідну БЕЗ жодної аналітичної формули — лише два обчислення функції."}`,
  },
  {
    id: "py-science-4",
    title: "Чисельне інтегрування: метод трапецій",
    type: "python",
    theory:
      "Інтеграл — площа під графіком функції. Метод трапецій ділить область на n вузьких трапецій і сумує їхні площі — чим більше n, тим точніший результат:\n\ndef trapezoidal(f, a, b, n):\n    h = (b - a) / n\n    total = (f(a) + f(b)) / 2\n    for i in range(1, n):\n        total += f(a + i * h)\n    return total * h\n\ng = lambda x: x ** 2\nprint(round(trapezoidal(g, 0, 1, 100), 4))\n\nІнтеграл x² від 0 до 1 аналітично дорівнює 1/3 ≈ 0.3333 — метод трапецій зі 100 поділами дає результат, що майже точно збігається.",
    examples: [
      { title: "trapezoidal() — площа під x² від 0 до 1", code: `def trapezoidal(f, a, b, n):\n    h = (b - a) / n\n    total = (f(a) + f(b)) / 2\n    for i in range(1, n):\n        total += f(a + i * h)\n    return total * h\n\ng = lambda x: x ** 2\nprint(round(trapezoidal(g, 0, 1, 100), 4))`, explain: "trapezoidal(g, 0, 1, 100) ≈ 0.3334 — дуже близько до точного значення 1/3." },
    ],
    task: `Напиши trapezoidal(f, a, b, n) за формулою методу трапецій. Застосуй до g = lambda x: x ** 2 на [0, 1] з n=100. Виведи округлений до 4 знаків результат.`,
    starter: `def trapezoidal(f, a, b, n):\n    # твій код тут\n    pass\n\ng = lambda x: x ** 2\n# print(round(trapezoidal(g, 0, 1, 100), 4))\n`,
    hints: [`h = (b - a) / n — ширина кожної трапеції.`, `total = (f(a) + f(b)) / 2, потім додай f(a + i*h) для i від 1 до n-1, наприкінці помнож на h.`, `def trapezoidal(f, a, b, n):\n    h = (b - a) / n\n    total = (f(a) + f(b)) / 2\n    for i in range(1, n):\n        total += f(a + i * h)\n    return total * h`],
    solution: `def trapezoidal(f, a, b, n):\n    h = (b - a) / n\n    total = (f(a) + f(b)) / 2\n    for i in range(1, n):\n        total += f(a + i * h)\n    return total * h\n\ng = lambda x: x ** 2\nprint(round(trapezoidal(g, 0, 1, 100), 4))`,
    testCode: `if "trapezoidal" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція trapezoidal(f, a, b, n)."}\nelif abs(trapezoidal(g, 0, 1, 100) - 1/3) > 0.001:\n    __result__ = {"pass": False, "message": "trapezoidal(g, 0, 1, 100) для x**2 має бути близько 0.3333."}\nelse:\n    __result__ = {"pass": True, "message": "Метод трапецій рахує інтеграл, підсумовуючи багато вузьких смужок — база чисельного інтегрування."}`,
  },
  {
    id: "py-science-5",
    title: "Метод Сімпсона: точніше за трапеції",
    type: "python",
    theory:
      "Метод Сімпсона апроксимує функцію не прямими лініями (як трапеції), а ПАРАБОЛАМИ — це дає набагато точніший результат при тій самій кількості поділів, чергуючи ваги 4 і 2 для проміжних точок:\n\ndef simpson(f, a, b, n):\n    if n % 2 == 1:\n        n += 1\n    h = (b - a) / n\n    total = f(a) + f(b)\n    for i in range(1, n):\n        coef = 4 if i % 2 == 1 else 2\n        total += coef * f(a + i * h)\n    return total * h / 3\n\nprint(round(simpson(g, 0, 1, 100), 8))\n\nРезультат метода Сімпсона (0.33333333) майже ІДЕАЛЬНО збігається з точним 1/3 — набагато точніше за трапеції з тим самим n.",
    examples: [
      { title: "simpson() — параболічна апроксимація", code: `def simpson(f, a, b, n):\n    if n % 2 == 1:\n        n += 1\n    h = (b - a) / n\n    total = f(a) + f(b)\n    for i in range(1, n):\n        coef = 4 if i % 2 == 1 else 2\n        total += coef * f(a + i * h)\n    return total * h / 3\n\ng = lambda x: x ** 2\nprint(round(simpson(g, 0, 1, 100), 8))`, explain: "simpson(g, 0, 1, 100) = 0.33333333 — точність на кілька порядків краща за trapezoidal() з тим самим n." },
    ],
    task: `Напиши simpson(f, a, b, n) за формулою вище. Застосуй до g на [0, 1] з n=100. Виведи округлений до 8 знаків результат.`,
    starter: `g = lambda x: x ** 2\n\ndef simpson(f, a, b, n):\n    # твій код тут\n    pass\n\n# print(round(simpson(g, 0, 1, 100), 8))\n`,
    hints: [`Якщо n непарне, збільш на 1 (метод Сімпсона потребує парну кількість поділів).`, `total = f(a) + f(b); для i від 1 до n-1: coef = 4, якщо i непарне, інакше 2.`, `def simpson(f, a, b, n):\n    if n % 2 == 1:\n        n += 1\n    h = (b - a) / n\n    total = f(a) + f(b)\n    for i in range(1, n):\n        coef = 4 if i % 2 == 1 else 2\n        total += coef * f(a + i * h)\n    return total * h / 3`],
    solution: `g = lambda x: x ** 2\n\ndef simpson(f, a, b, n):\n    if n % 2 == 1:\n        n += 1\n    h = (b - a) / n\n    total = f(a) + f(b)\n    for i in range(1, n):\n        coef = 4 if i % 2 == 1 else 2\n        total += coef * f(a + i * h)\n    return total * h / 3\n\nprint(round(simpson(g, 0, 1, 100), 8))`,
    testCode: `if "simpson" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція simpson(f, a, b, n)."}\nelif abs(simpson(g, 0, 1, 100) - 1/3) > 0.00001:\n    __result__ = {"pass": False, "message": "simpson(g, 0, 1, 100) має бути дуже близько до 0.33333333."}\nelse:\n    __result__ = {"pass": True, "message": "Параболи апроксимують криву краще за прямі лінії — Сімпсон точніший за трапеції з тим самим n."}`,
  },
  {
    id: "py-science-6",
    title: "Метод бісекції: пошук кореня рівняння",
    type: "python",
    theory:
      "Не кожне рівняння розв'язується алгебраїчно (наприклад, x² = 2 → x = √2, ірраціональне число). Метод бісекції знаходить корінь ЧИСЕЛЬНО: якщо f(a) і f(b) мають РІЗНІ знаки, десь між ними є корінь — постійно ділимо відрізок навпіл, звужуючи межі:\n\ndef bisection(f, a, b, tol=1e-6):\n    while (b - a) / 2 > tol:\n        midpoint = (a + b) / 2\n        if f(a) * f(midpoint) < 0:\n            b = midpoint\n        else:\n            a = midpoint\n    return (a + b) / 2\n\nh = lambda x: x ** 2 - 2\nprint(round(bisection(h, 0, 2), 4))\n\nf(a) * f(midpoint) < 0 перевіряє, чи корінь знаходиться в ЛІВІЙ половині (протилежні знаки f(a) і f(midpoint)) — якщо так, звужуємо праву межу до midpoint.",
    examples: [
      { title: "bisection() — пошук √2 через x² - 2 = 0", code: `def bisection(f, a, b, tol=1e-6):\n    while (b - a) / 2 > tol:\n        midpoint = (a + b) / 2\n        if f(a) * f(midpoint) < 0:\n            b = midpoint\n        else:\n            a = midpoint\n    return (a + b) / 2\n\nh = lambda x: x ** 2 - 2\nprint(round(bisection(h, 0, 2), 4))`, explain: "bisection(h, 0, 2) ≈ 1.4142 — це і є √2, знайдений БЕЗ формули кореня, лише повторним діленням навпіл." },
    ],
    task: `Напиши bisection(f, a, b, tol=1e-6). Застосуй до h = lambda x: x ** 2 - 2 на відрізку [0, 2]. Виведи округлений до 4 знаків результат.`,
    starter: `h = lambda x: x ** 2 - 2\n\ndef bisection(f, a, b, tol=1e-6):\n    # твій код тут\n    pass\n\n# print(round(bisection(h, 0, 2), 4))\n`,
    hints: [`Цикл while (b - a) / 2 > tol: рахуй midpoint = (a + b) / 2.`, `if f(a) * f(midpoint) < 0: b = midpoint; else: a = midpoint`, `def bisection(f, a, b, tol=1e-6):\n    while (b - a) / 2 > tol:\n        midpoint = (a + b) / 2\n        if f(a) * f(midpoint) < 0:\n            b = midpoint\n        else:\n            a = midpoint\n    return (a + b) / 2`],
    solution: `h = lambda x: x ** 2 - 2\n\ndef bisection(f, a, b, tol=1e-6):\n    while (b - a) / 2 > tol:\n        midpoint = (a + b) / 2\n        if f(a) * f(midpoint) < 0:\n            b = midpoint\n        else:\n            a = midpoint\n    return (a + b) / 2\n\nprint(round(bisection(h, 0, 2), 4))`,
    testCode: `if "bisection" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція bisection(f, a, b, tol=1e-6)."}\nelif abs(bisection(h, 0, 2) - 1.41421) > 0.001:\n    __result__ = {"pass": False, "message": "bisection(h, 0, 2) для x**2-2 має бути приблизно 1.4142 (корінь з 2)."}\nelse:\n    __result__ = {"pass": True, "message": "Метод бісекції знаходить корінь БУДЬ-ЯКОГО рівняння, для якого немає алгебраїчної формули."}`,
  },
  {
    id: "py-science-7",
    title: "Метод Монте-Карло: оцінка числа π",
    type: "python",
    theory:
      "Метод Монте-Карло оцінює складні величини через ВИПАДКОВЕ семплювання. Класичний приклад: розкидай випадкові точки в квадраті [-1, 1] × [-1, 1] і порахуй частку точок ВСЕРЕДИНІ кола радіуса 1 — ця частка пов'язана з π:\n\nimport random\n\nrandom.seed(42)\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nprint(estimate_pi(1000))\n\nПлоща кола (πr²) поділена на площу квадрата (4r²) дає π/4 — тому множимо частку точок усередині на 4, щоб отримати оцінку π.",
    examples: [
      { title: "estimate_pi() — Монте-Карло для π", code: `import random\n\nrandom.seed(42)\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nprint(estimate_pi(1000))`, explain: "З random.seed(42) і 1000 точок оцінка дає 3.18 — близько до справжнього π≈3.14159, хоч і не точно (випадковість!)." },
    ],
    task: `Постав random.seed(42). Напиши estimate_pi(n) за формулою вище. Виклич estimate_pi(1000) і виведи результат.`,
    starter: `import random\n\nrandom.seed(42)\n\ndef estimate_pi(n):\n    # твій код тут\n    pass\n\n# print(estimate_pi(1000))\n`,
    hints: [`x = random.uniform(-1, 1); y = random.uniform(-1, 1) — випадкова точка в квадраті.`, `if x**2 + y**2 <= 1: inside += 1 — перевірка, чи точка всередині кола; наприкінці return 4 * inside / n.`, `def estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nprint(estimate_pi(1000))`],
    solution: `import random\n\nrandom.seed(42)\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nprint(estimate_pi(1000))`,
    testCode: `if "estimate_pi" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція estimate_pi(n)."}\nelif not any("3.18" in l for l in __logs):\n    __result__ = {"pass": False, "message": "З random.seed(42) estimate_pi(1000) має дати 3.18."}\nelse:\n    __result__ = {"pass": True, "message": "Монте-Карло перетворює ВИПАДКОВІСТЬ на оцінку точної математичної константи — потужна ідея чисельних методів."}`,
  },
  {
    id: "py-science-8",
    title: "Монте-Карло: точність зростає з кількістю точок",
    type: "python",
    theory:
      "Оцінка Монте-Карло НАБЛИЖАЄТЬСЯ до істинного значення зі збільшенням кількості випадкових точок (закон великих чисел). Порівняй похибку при n=1000 і n=10000:\n\nrandom.seed(42)\npi_1000 = estimate_pi(1000)\nrandom.seed(42)\npi_10000 = estimate_pi(10000)\n\nerror_1000 = abs(pi_1000 - math.pi)\nerror_10000 = abs(pi_10000 - math.pi)\nprint(error_10000 < error_1000)\n\nПовторний random.seed(42) ПЕРЕД кожним викликом гарантує, що обидва запуски починають з ТІЄЇ САМОЇ точки в послідовності випадкових чисел — це справедливе порівняння, а не випадковий збіг.",
    examples: [
      { title: "Більше точок — менша похибка", code: `import math, random\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nrandom.seed(42)\npi_1000 = estimate_pi(1000)\nrandom.seed(42)\npi_10000 = estimate_pi(10000)\n\nerror_1000 = abs(pi_1000 - math.pi)\nerror_10000 = abs(pi_10000 - math.pi)\nprint(error_10000 < error_1000)`, explain: "error_10000 < error_1000 (True) — у 10 разів більше точок дає помітно точнішу оцінку π." },
    ],
    task: `Дано estimate_pi() (в starter). Постав random.seed(42) і порахуй pi_1000 = estimate_pi(1000). Постав random.seed(42) знову і порахуй pi_10000 = estimate_pi(10000). Порахуй обидві похибки відносно math.pi. Виведи, чи error_10000 < error_1000.`,
    starter: `import math, random\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\n# random.seed(42)\n# pi_1000 = estimate_pi(1000)\n# random.seed(42)\n# pi_10000 = estimate_pi(10000)\n\n# error_1000 = abs(pi_1000 - math.pi)\n# error_10000 = abs(pi_10000 - math.pi)\n# print(error_10000 < error_1000)\n`,
    hints: [`random.seed(42) ПЕРЕД КОЖНИМ викликом estimate_pi(), щоб порівняння було справедливим.`, `error = abs(pi_estimate - math.pi)`, `random.seed(42)\npi_1000 = estimate_pi(1000)\nrandom.seed(42)\npi_10000 = estimate_pi(10000)\nerror_1000 = abs(pi_1000 - math.pi)\nerror_10000 = abs(pi_10000 - math.pi)\nprint(error_10000 < error_1000)`],
    solution: `import math, random\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nrandom.seed(42)\npi_1000 = estimate_pi(1000)\nrandom.seed(42)\npi_10000 = estimate_pi(10000)\n\nerror_1000 = abs(pi_1000 - math.pi)\nerror_10000 = abs(pi_10000 - math.pi)\nprint(error_10000 < error_1000)`,
    testCode: `if "error_1000" not in globals() or "error_10000" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні error_1000 і error_10000."}\nelif not (error_10000 < error_1000):\n    __result__ = {"pass": False, "message": "З random.seed(42) error_10000 має бути МЕНШОЮ за error_1000."}\nelif not any("True" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи порівняння — має бути True."}\nelse:\n    __result__ = {"pass": True, "message": "Закон великих чисел у дії: більше випадкових семплів — точніша оцінка Монте-Карло."}`,
  },
  {
    id: "py-science-9",
    title: "Кінематика: рух зі сталим прискоренням",
    type: "python",
    theory:
      "Перш ніж моделювати складний рух, згадаємо ТОЧНІ формули кінематики для сталого прискорення (можна порахувати напряму, без симуляції):\n\ndef velocity(v0, a, t):\n    return v0 + a * t\n\ndef position(x0, v0, a, t):\n    return x0 + v0 * t + 0.5 * a * t ** 2\n\nprint(velocity(0, 9.8, 2))\nprint(round(position(0, 0, 9.8, 2), 2))\n\nЦе вільне падіння з v0=0: за 2 секунди тіло розганяється до 19.6 м/с і пролітає 19.6 метрів — прямі формули, які пізніше порівняємо із чисельною симуляцією.",
    examples: [
      { title: "velocity() і position() для вільного падіння", code: `def velocity(v0, a, t):\n    return v0 + a * t\n\ndef position(x0, v0, a, t):\n    return x0 + v0 * t + 0.5 * a * t ** 2\n\nprint(velocity(0, 9.8, 2))\nprint(round(position(0, 0, 9.8, 2), 2))`, explain: "За t=2с при a=9.8: швидкість 19.6 м/с, пройдений шлях 19.6 м." },
    ],
    task: `Напиши velocity(v0, a, t) і position(x0, v0, a, t). Виведи velocity(0, 9.8, 2) і округлену до 2 знаків position(0, 0, 9.8, 2).`,
    starter: `def velocity(v0, a, t):\n    # твій код тут\n    pass\n\ndef position(x0, v0, a, t):\n    # твій код тут\n    pass\n\n# print(velocity(0, 9.8, 2))\n# print(round(position(0, 0, 9.8, 2), 2))\n`,
    hints: [`velocity: return v0 + a * t`, `position: return x0 + v0 * t + 0.5 * a * t ** 2`, `def velocity(v0, a, t):\n    return v0 + a * t\n\ndef position(x0, v0, a, t):\n    return x0 + v0 * t + 0.5 * a * t ** 2`],
    solution: `def velocity(v0, a, t):\n    return v0 + a * t\n\ndef position(x0, v0, a, t):\n    return x0 + v0 * t + 0.5 * a * t ** 2\n\nprint(velocity(0, 9.8, 2))\nprint(round(position(0, 0, 9.8, 2), 2))`,
    testCode: `if "velocity" not in globals() or "position" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні функції velocity(v0, a, t) і position(x0, v0, a, t)."}\nelif velocity(0, 9.8, 2) != 19.6:\n    __result__ = {"pass": False, "message": "velocity(0, 9.8, 2) має дати 19.6."}\nelif abs(position(0, 0, 9.8, 2) - 19.6) > 0.01:\n    __result__ = {"pass": False, "message": "position(0, 0, 9.8, 2) має дати 19.6."}\nelse:\n    __result__ = {"pass": True, "message": "Точні формули кінематики — база для порівняння з чисельною симуляцією руху далі."}`,
  },
  {
    id: "py-science-10",
    title: "Метод Ейлера: симуляція руху крок за кроком",
    type: "python",
    theory:
      "Не кожен рух має просту формулу (опір повітря, змінна сила). Метод Ейлера симулює рух МАЛЕНЬКИМИ кроками часу dt: на кожному кроці оновлюємо швидкість (за прискоренням), потім позицію (за швидкістю):\n\ndef simulate_fall(v0, a, dt, steps):\n    v, x = v0, 0.0\n    positions = [x]\n    for _ in range(steps):\n        v += a * dt\n        x += v * dt\n        positions.append(x)\n    return positions\n\nresult = simulate_fall(0, 9.8, 0.01, 200)\nprint(round(result[-1], 2))\n\nЗа 200 кроків по 0.01с (=2 секунди) результат МАЙЖЕ збігається з точною формулою position(0,0,9.8,2)=19.6 — невелика розбіжність через дискретизацію методу Ейлера.",
    examples: [
      { title: "simulate_fall() — метод Ейлера", code: `def simulate_fall(v0, a, dt, steps):\n    v, x = v0, 0.0\n    positions = [x]\n    for _ in range(steps):\n        v += a * dt\n        x += v * dt\n        positions.append(x)\n    return positions\n\nresult = simulate_fall(0, 9.8, 0.01, 200)\nprint(round(result[-1], 2))`, explain: "Після 200 кроків по 0.01с (=2с) симуляція дає ≈19.7 — близько до точних 19.6, з невеликою похибкою дискретизації." },
    ],
    task: `Напиши simulate_fall(v0, a, dt, steps) за методом Ейлера. Виклич simulate_fall(0, 9.8, 0.01, 200) і виведи округлену до 2 знаків останню позицію.`,
    starter: `def simulate_fall(v0, a, dt, steps):\n    # твій код тут\n    pass\n\n# result = simulate_fall(0, 9.8, 0.01, 200)\n# print(round(result[-1], 2))\n`,
    hints: [`v, x = v0, 0.0 на початку; positions = [x]`, `На кожному кроці: v += a * dt, потім x += v * dt, додай x у positions.`, `def simulate_fall(v0, a, dt, steps):\n    v, x = v0, 0.0\n    positions = [x]\n    for _ in range(steps):\n        v += a * dt\n        x += v * dt\n        positions.append(x)\n    return positions`],
    solution: `def simulate_fall(v0, a, dt, steps):\n    v, x = v0, 0.0\n    positions = [x]\n    for _ in range(steps):\n        v += a * dt\n        x += v * dt\n        positions.append(x)\n    return positions\n\nresult = simulate_fall(0, 9.8, 0.01, 200)\nprint(round(result[-1], 2))`,
    testCode: `if "simulate_fall" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція simulate_fall(v0, a, dt, steps)."}\nelse:\n    result = simulate_fall(0, 9.8, 0.01, 200)\n    if abs(result[-1] - 19.6) > 0.5:\n        __result__ = {"pass": False, "message": "Остання позиція після 200 кроків по 0.01с має бути близько 19.6-19.7."}\n    elif len(result) != 201:\n        __result__ = {"pass": False, "message": "positions має містити 201 значення (початкова позиція + 200 кроків)."}\n    else:\n        __result__ = {"pass": True, "message": "Метод Ейлера симулює рух МАЛЕНЬКИМИ кроками — працює навіть коли точної формули руху немає."}`,
  },
  {
    id: "py-science-11",
    title: "Траєкторія снаряда: рух у двох вимірах",
    type: "python",
    theory:
      "Розширимо метод Ейлера на ДВА виміри: снаряд, випущений під кутом, рухається одночасно по горизонталі (стала швидкість, без прискорення) й вертикалі (гравітація сповільнює підйом, потім прискорює падіння):\n\nimport math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory\n\ntraj = simulate_projectile(20, 45)\nprint(len(traj) > 0)\n\nЦикл while y >= 0 продовжує симуляцію, ПОКИ снаряд не впаде на землю (y стане від'ємним) — природна умова завершення без заздалегідь відомої кількості кроків.",
    examples: [
      { title: "simulate_projectile() — рух під кутом 45°", code: `import math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory\n\ntraj = simulate_projectile(20, 45)\nprint(len(traj) > 0)\nprint(round(traj[-1][0], 1))`, explain: "traj містить сотні точок (x, y) — повну траєкторію польоту снаряда від пострілу до падіння." },
    ],
    task: `Напиши simulate_projectile(v0, angle_deg, dt=0.01, g=9.8). Виклич simulate_projectile(20, 45). Виведи, чи траєкторія непорожня (len(traj) > 0).`,
    starter: `import math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    # твій код тут\n    pass\n\n# traj = simulate_projectile(20, 45)\n# print(len(traj) > 0)\n`,
    hints: [`angle = math.radians(angle_deg); vx = v0*cos(angle); vy = v0*sin(angle)`, `Цикл while y >= 0: оновлюй x += vx*dt, y += vy*dt, vy -= g*dt, додавай (x, y) у trajectory.`, `def simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory`],
    solution: `import math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory\n\ntraj = simulate_projectile(20, 45)\nprint(len(traj) > 0)`,
    testCode: `if "simulate_projectile" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція simulate_projectile(v0, angle_deg, dt=0.01, g=9.8)."}\nelse:\n    traj = simulate_projectile(20, 45)\n    if len(traj) < 100:\n        __result__ = {"pass": False, "message": "Траєкторія для v0=20, angle=45 має містити щонайменше сотні точок."}\n    elif traj[-1][1] >= 0:\n        __result__ = {"pass": False, "message": "Остання точка траєкторії має мати y < 0 (снаряд впав на землю)."}\n    else:\n        __result__ = {"pass": True, "message": "Симуляція у двох вимірах — горизонтальний рух незалежний від вертикального, гравітація впливає лише на y."}`,
  },
  {
    id: "py-science-12",
    title: "Максимальна висота й дальність польоту",
    type: "python",
    theory:
      "З повної траєкторії легко витягнути дві ключові характеристики: максимальну висоту (найбільше значення y серед усіх точок) і дальність польоту (координата x останньої точки, де снаряд впав):\n\nmax_height = max(p[1] for p in trajectory)\nmax_range = trajectory[-1][0]\nprint(round(max_height, 1), round(max_range, 1))\n\nДля v0=20 м/с під кутом 45° (оптимальний кут для максимальної дальності при рівних висотах старту й падіння) очікується висота ≈10.3м і дальність ≈41.0м.",
    examples: [
      { title: "Аналіз траєкторії: висота й дальність", code: `import math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory\n\ntrajectory = simulate_projectile(20, 45)\nmax_height = max(p[1] for p in trajectory)\nmax_range = trajectory[-1][0]\nprint(round(max_height, 1), round(max_range, 1))`, explain: "max_height ≈ 10.3, max_range ≈ 41.0 — снаряд, випущений під 45°, злітає майже на 10.3 метри й пролітає 41 метр." },
    ],
    task: `Дано simulate_projectile() (в starter). Порахуй trajectory = simulate_projectile(20, 45), max_height (найбільший y) і max_range (x останньої точки). Виведи обидва округлені до 1 знака.`,
    starter: `import math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory\n\n# trajectory = simulate_projectile(20, 45)\n# max_height = max(p[1] for p in trajectory)\n# max_range = trajectory[-1][0]\n# print(round(max_height, 1), round(max_range, 1))\n`,
    hints: [`max_height = max(p[1] for p in trajectory) — найбільший y серед усіх точок.`, `max_range = trajectory[-1][0] — x координата ОСТАННЬОЇ точки.`, `trajectory = simulate_projectile(20, 45)\nmax_height = max(p[1] for p in trajectory)\nmax_range = trajectory[-1][0]\nprint(round(max_height, 1), round(max_range, 1))`],
    solution: `import math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory\n\ntrajectory = simulate_projectile(20, 45)\nmax_height = max(p[1] for p in trajectory)\nmax_range = trajectory[-1][0]\nprint(round(max_height, 1), round(max_range, 1))`,
    testCode: `if "max_height" not in globals() or "max_range" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні max_height і max_range."}\nelif abs(max_height - 10.3) > 0.5:\n    __result__ = {"pass": False, "message": "max_height для v0=20, angle=45 має бути приблизно 10.3."}\nelif abs(max_range - 41.0) > 1.0:\n    __result__ = {"pass": False, "message": "max_range для v0=20, angle=45 має бути приблизно 41.0."}\nelse:\n    __result__ = {"pass": True, "message": "Максимальна висота й дальність — саме те, що фізики шукають у симуляції польоту снаряда чи ракети."}`,
  },
  {
    id: "py-science-13",
    title: "Одновибіркова t-статистика",
    type: "python",
    theory:
      "Уяви: серія вимірювань прискорення вільного падіння дала середнє трохи ІНШЕ за еталонні 9.81 — чи це РЕАЛЬНЕ відхилення, чи просто випадковий розкид вимірювань? t-статистика формалізує це питання, враховуючи розкид (stdev) і розмір вибірки (n):\n\nimport statistics, math\n\ndef t_statistic(sample, expected):\n    mean = statistics.mean(sample)\n    std = statistics.stdev(sample)\n    n = len(sample)\n    return (mean - expected) / (std / math.sqrt(n))\n\nsample = [9.78, 9.81, 9.79, 9.83, 9.80, 9.82]\nprint(round(t_statistic(sample, 9.81), 4))\n\nЧим БЛИЖЧЕ t до нуля, тим менш переконливим є відхилення вибірки від очікуваного значення.",
    examples: [
      { title: "t_statistic() — наскільки переконливе відхилення", code: `import statistics, math\n\ndef t_statistic(sample, expected):\n    mean = statistics.mean(sample)\n    std = statistics.stdev(sample)\n    n = len(sample)\n    return (mean - expected) / (std / math.sqrt(n))\n\nsample = [9.78, 9.81, 9.79, 9.83, 9.80, 9.82]\nprint(round(t_statistic(sample, 9.81), 4))`, explain: "t ≈ -0.6547 — близько до нуля, отже вибіркове середнє 9.805 НЕ сильно відрізняється від еталонних 9.81." },
    ],
    task: `Дано sample (6 вимірювань). Напиши t_statistic(sample, expected). Виведи округлений до 4 знаків t_statistic(sample, 9.81).`,
    starter: `import statistics, math\n\nsample = [9.78, 9.81, 9.79, 9.83, 9.80, 9.82]\n\ndef t_statistic(sample, expected):\n    # твій код тут\n    pass\n\n# print(round(t_statistic(sample, 9.81), 4))\n`,
    hints: [`mean = statistics.mean(sample); std = statistics.stdev(sample); n = len(sample)`, `return (mean - expected) / (std / math.sqrt(n))`, `def t_statistic(sample, expected):\n    mean = statistics.mean(sample)\n    std = statistics.stdev(sample)\n    n = len(sample)\n    return (mean - expected) / (std / math.sqrt(n))`],
    solution: `import statistics, math\n\nsample = [9.78, 9.81, 9.79, 9.83, 9.80, 9.82]\n\ndef t_statistic(sample, expected):\n    mean = statistics.mean(sample)\n    std = statistics.stdev(sample)\n    n = len(sample)\n    return (mean - expected) / (std / math.sqrt(n))\n\nprint(round(t_statistic(sample, 9.81), 4))`,
    testCode: `if "t_statistic" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція t_statistic(sample, expected)."}\nelif abs(t_statistic(sample, 9.81) - (-0.6547)) > 0.01:\n    __result__ = {"pass": False, "message": "t_statistic(sample, 9.81) має бути приблизно -0.6547."}\nelse:\n    __result__ = {"pass": True, "message": "t-статистика формалізує «наскільки переконливе відхилення», враховуючи і розкид даних, і розмір вибірки."}`,
  },
  {
    id: "py-science-14",
    title: "Інтерпретація t-статистики",
    type: "python",
    theory:
      "Проста евристика (без таблиць критичних значень): |t| < 2 зазвичай означає «відхилення НЕ переконливе» (могло статись випадково), |t| >= 2 — «варто звернути увагу, можливо є систематична похибка»:\n\ndef interpret_t(t):\n    return \"не переконливо\" if abs(t) < 2 else \"звернути увагу\"\n\nprint(interpret_t(-0.6547))\nprint(interpret_t(3.2))\n\nЦе спрощення (реальний t-тест враховує ще й СТУПЕНІ ВОЛІ й обраний рівень значущості), але напрям думки правильний: маленьке |t| — випадковість, велике — можлива системна проблема.",
    examples: [
      { title: "interpret_t() — проста евристика", code: `def interpret_t(t):\n    return "не переконливо" if abs(t) < 2 else "звернути увагу"\n\nprint(interpret_t(-0.6547))\nprint(interpret_t(3.2))`, explain: "t=-0.6547 (мале за модулем) → «не переконливо»; t=3.2 (велике) → «звернути увагу»." },
    ],
    task: `Напиши interpret_t(t) за евристикою |t| < 2. Виведи interpret_t(-0.6547) і interpret_t(3.2).`,
    starter: `def interpret_t(t):\n    # твій код тут\n    pass\n\n# print(interpret_t(-0.6547))\n# print(interpret_t(3.2))\n`,
    hints: [`abs(t) < 2 — перевір АБСОЛЮТНЕ значення t.`, `return "не переконливо" if abs(t) < 2 else "звернути увагу"`, `def interpret_t(t):\n    return "не переконливо" if abs(t) < 2 else "звернути увагу"\n\nprint(interpret_t(-0.6547))\nprint(interpret_t(3.2))`],
    solution: `def interpret_t(t):\n    return "не переконливо" if abs(t) < 2 else "звернути увагу"\n\nprint(interpret_t(-0.6547))\nprint(interpret_t(3.2))`,
    testCode: `if "interpret_t" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція interpret_t(t)."}\nelif interpret_t(-0.6547) != "не переконливо":\n    __result__ = {"pass": False, "message": "interpret_t(-0.6547) має дати 'не переконливо'."}\nelif interpret_t(3.2) != "звернути увагу":\n    __result__ = {"pass": False, "message": "interpret_t(3.2) має дати 'звернути увагу'."}\nelse:\n    __result__ = {"pass": True, "message": "Проста, але правильна ідея: маленьке |t| — випадковий розкид, велике — можлива системна похибка."}`,
  },
  {
    id: "py-science-15",
    title: "Перетворення одиниць виміру",
    type: "python",
    theory:
      "Наукові дані часто приходять у РІЗНИХ одиницях (метри й фути, Цельсій і Кельвін) — словник коефіцієнтів перетворення робить конвертацію систематичною й безпечною від помилок:\n\nUNIT_CONVERSIONS = {\n    (\"m\", \"cm\"): 100,\n    (\"cm\", \"m\"): 0.01,\n    (\"kg\", \"g\"): 1000,\n    (\"g\", \"kg\"): 0.001,\n}\n\ndef convert(value, from_unit, to_unit):\n    factor = UNIT_CONVERSIONS[(from_unit, to_unit)]\n    return value * factor\n\nprint(convert(2.5, \"m\", \"cm\"))\nprint(convert(500, \"g\", \"kg\"))",
    examples: [
      { title: "convert() через словник коефіцієнтів", code: `UNIT_CONVERSIONS = {\n    ("m", "cm"): 100,\n    ("cm", "m"): 0.01,\n    ("kg", "g"): 1000,\n    ("g", "kg"): 0.001,\n}\n\ndef convert(value, from_unit, to_unit):\n    factor = UNIT_CONVERSIONS[(from_unit, to_unit)]\n    return value * factor\n\nprint(convert(2.5, "m", "cm"))\nprint(convert(500, "g", "kg"))`, explain: "2.5 метра = 250 сантиметрів; 500 грамів = 0.5 кілограма." },
    ],
    task: `Дано UNIT_CONVERSIONS. Напиши convert(value, from_unit, to_unit). Виведи convert(2.5, "m", "cm") і convert(500, "g", "kg").`,
    starter: `UNIT_CONVERSIONS = {\n    ("m", "cm"): 100,\n    ("cm", "m"): 0.01,\n    ("kg", "g"): 1000,\n    ("g", "kg"): 0.001,\n}\n\ndef convert(value, from_unit, to_unit):\n    # твій код тут\n    pass\n\n# print(convert(2.5, "m", "cm"))\n# print(convert(500, "g", "kg"))\n`,
    hints: [`Ключ словника — кортеж (from_unit, to_unit).`, `factor = UNIT_CONVERSIONS[(from_unit, to_unit)]; return value * factor`, `def convert(value, from_unit, to_unit):\n    factor = UNIT_CONVERSIONS[(from_unit, to_unit)]\n    return value * factor`],
    solution: `UNIT_CONVERSIONS = {\n    ("m", "cm"): 100,\n    ("cm", "m"): 0.01,\n    ("kg", "g"): 1000,\n    ("g", "kg"): 0.001,\n}\n\ndef convert(value, from_unit, to_unit):\n    factor = UNIT_CONVERSIONS[(from_unit, to_unit)]\n    return value * factor\n\nprint(convert(2.5, "m", "cm"))\nprint(convert(500, "g", "kg"))`,
    testCode: `if "convert" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція convert(value, from_unit, to_unit)."}\nelif convert(2.5, "m", "cm") != 250:\n    __result__ = {"pass": False, "message": "convert(2.5, 'm', 'cm') має дати 250."}\nelif convert(500, "g", "kg") != 0.5:\n    __result__ = {"pass": False, "message": "convert(500, 'g', 'kg') має дати 0.5."}\nelse:\n    __result__ = {"pass": True, "message": "Словник коефіцієнтів робить перетворення одиниць систематичним — жодних вручну написаних формул для кожної пари."}`,
  },
  {
    id: "py-science-16",
    title: "Звіт експерименту: похибка й одиниці разом",
    type: "python",
    theory:
      "Об'єднай кілька прийомів у ЗВІТ ПРО ЕКСПЕРИМЕНТ: середнє й розкид вимірювань, похибка відносно еталону, і результат в ІНШИХ одиницях для зручності читання:\n\ndef experiment_report(sample, expected, from_unit, to_unit, factor):\n    mean = statistics.mean(sample)\n    err = relative_error(mean, expected)\n    converted = mean * factor\n    return f\"Середнє: {mean:.4f} {from_unit} ({converted:.2f} {to_unit}), похибка: {err:.4%}\"\n\nprint(experiment_report(sample, 9.81, \"m/s²\", \"cm/s²\", 100))",
    examples: [
      { title: "experiment_report() — повний звіт", code: `import statistics\n\ndef relative_error(measured, true_value):\n    return abs(measured - true_value) / abs(true_value)\n\ndef experiment_report(sample, expected, from_unit, to_unit, factor):\n    mean = statistics.mean(sample)\n    err = relative_error(mean, expected)\n    converted = mean * factor\n    return f"Середнє: {mean:.4f} {from_unit} ({converted:.2f} {to_unit}), похибка: {err:.4%}"\n\nsample = [9.78, 9.81, 9.79, 9.83, 9.80, 9.82]\nprint(experiment_report(sample, 9.81, "m/s²", "cm/s²", 100))`, explain: "Один рядок показує середнє в двох одиницях і відсоток похибки — усе, що потрібно для запису в лабораторний журнал." },
    ],
    task: `Дано relative_error(), sample (в starter). Напиши experiment_report(sample, expected, from_unit, to_unit, factor). Виклич experiment_report(sample, 9.81, "m/s²", "cm/s²", 100) і виведи результат.`,
    starter: `import statistics\n\nsample = [9.78, 9.81, 9.79, 9.83, 9.80, 9.82]\n\ndef relative_error(measured, true_value):\n    return abs(measured - true_value) / abs(true_value)\n\ndef experiment_report(sample, expected, from_unit, to_unit, factor):\n    # твій код тут\n    pass\n\n# print(experiment_report(sample, 9.81, "m/s²", "cm/s²", 100))\n`,
    hints: [`mean = statistics.mean(sample); err = relative_error(mean, expected); converted = mean * factor`, `return f"Середнє: {mean:.4f} {from_unit} ({converted:.2f} {to_unit}), похибка: {err:.4%}"`, `def experiment_report(sample, expected, from_unit, to_unit, factor):\n    mean = statistics.mean(sample)\n    err = relative_error(mean, expected)\n    converted = mean * factor\n    return f"Середнє: {mean:.4f} {from_unit} ({converted:.2f} {to_unit}), похибка: {err:.4%}"`],
    solution: `import statistics\n\nsample = [9.78, 9.81, 9.79, 9.83, 9.80, 9.82]\n\ndef relative_error(measured, true_value):\n    return abs(measured - true_value) / abs(true_value)\n\ndef experiment_report(sample, expected, from_unit, to_unit, factor):\n    mean = statistics.mean(sample)\n    err = relative_error(mean, expected)\n    converted = mean * factor\n    return f"Середнє: {mean:.4f} {from_unit} ({converted:.2f} {to_unit}), похибка: {err:.4%}"\n\nprint(experiment_report(sample, 9.81, "m/s²", "cm/s²", 100))`,
    testCode: `if "experiment_report" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція experiment_report(sample, expected, from_unit, to_unit, factor)."}\nelse:\n    report = experiment_report(sample, 9.81, "m/s²", "cm/s²", 100)\n    if "9.805" not in report:\n        __result__ = {"pass": False, "message": "Звіт має містити середнє 9.805."}\n    elif "980.5" not in report and "980.50" not in report:\n        __result__ = {"pass": False, "message": "Звіт має містити перетворене значення 980.50 cm/s²."}\n    elif not any("9.805" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи звіт через print()."}\n    else:\n        __result__ = {"pass": True, "message": "Звіт об'єднує статистику, похибку й одиниці виміру — так виглядає запис у реальному лабораторному журналі."}`,
  },
  {
    id: "py-science-17",
    title: "Порівняння точності: трапеції проти Сімпсона",
    type: "python",
    theory:
      "Перевір НАПРЯМУ, наскільки Сімпсон точніший за трапеції для ТІЄЇ САМОЇ кількості поділів n, порівнявши обидві похибки відносно точного аналітичного значення:\n\nexact = 1 / 3\ntrap_error = abs(trapezoidal(g, 0, 1, 10) - exact)\nsimp_error = abs(simpson(g, 0, 1, 10) - exact)\nprint(simp_error < trap_error)\n\nЦе показує ПРАКТИЧНУ причину, чому науковці обирають метод Сімпсона: та сама кількість обчислень функції, але значно менша похибка.",
    examples: [
      { title: "Порівняння похибок при n=10", code: `def trapezoidal(f, a, b, n):\n    h = (b - a) / n\n    total = (f(a) + f(b)) / 2\n    for i in range(1, n):\n        total += f(a + i * h)\n    return total * h\n\ndef simpson(f, a, b, n):\n    if n % 2 == 1:\n        n += 1\n    h = (b - a) / n\n    total = f(a) + f(b)\n    for i in range(1, n):\n        coef = 4 if i % 2 == 1 else 2\n        total += coef * f(a + i * h)\n    return total * h / 3\n\ng = lambda x: x ** 2\nexact = 1 / 3\ntrap_error = abs(trapezoidal(g, 0, 1, 10) - exact)\nsimp_error = abs(simpson(g, 0, 1, 10) - exact)\nprint(simp_error < trap_error)`, explain: "При n=10 похибка Сімпсона на порядки менша за похибку трапецій — та сама робота, кращий результат." },
    ],
    task: `Дано trapezoidal(), simpson(), g (в starter). Порахуй trap_error і simp_error для n=10 відносно exact = 1/3. Виведи, чи simp_error < trap_error.`,
    starter: `def trapezoidal(f, a, b, n):\n    h = (b - a) / n\n    total = (f(a) + f(b)) / 2\n    for i in range(1, n):\n        total += f(a + i * h)\n    return total * h\n\ndef simpson(f, a, b, n):\n    if n % 2 == 1:\n        n += 1\n    h = (b - a) / n\n    total = f(a) + f(b)\n    for i in range(1, n):\n        coef = 4 if i % 2 == 1 else 2\n        total += coef * f(a + i * h)\n    return total * h / 3\n\ng = lambda x: x ** 2\n\n# exact = 1 / 3\n# trap_error = abs(trapezoidal(g, 0, 1, 10) - exact)\n# simp_error = abs(simpson(g, 0, 1, 10) - exact)\n# print(simp_error < trap_error)\n`,
    hints: [`exact = 1 / 3 — точне аналітичне значення інтеграла x**2 від 0 до 1.`, `trap_error = abs(trapezoidal(g, 0, 1, 10) - exact); simp_error аналогічно з simpson().`, `exact = 1 / 3\ntrap_error = abs(trapezoidal(g, 0, 1, 10) - exact)\nsimp_error = abs(simpson(g, 0, 1, 10) - exact)\nprint(simp_error < trap_error)`],
    solution: `def trapezoidal(f, a, b, n):\n    h = (b - a) / n\n    total = (f(a) + f(b)) / 2\n    for i in range(1, n):\n        total += f(a + i * h)\n    return total * h\n\ndef simpson(f, a, b, n):\n    if n % 2 == 1:\n        n += 1\n    h = (b - a) / n\n    total = f(a) + f(b)\n    for i in range(1, n):\n        coef = 4 if i % 2 == 1 else 2\n        total += coef * f(a + i * h)\n    return total * h / 3\n\ng = lambda x: x ** 2\n\nexact = 1 / 3\ntrap_error = abs(trapezoidal(g, 0, 1, 10) - exact)\nsimp_error = abs(simpson(g, 0, 1, 10) - exact)\nprint(simp_error < trap_error)`,
    testCode: `if "trap_error" not in globals() or "simp_error" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні trap_error і simp_error."}\nelif not (simp_error < trap_error):\n    __result__ = {"pass": False, "message": "simp_error має бути МЕНШОЮ за trap_error при n=10."}\nelif not any("True" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи порівняння — має бути True."}\nelse:\n    __result__ = {"pass": True, "message": "Пряме порівняння похибок доводить: за ту саму ціну (n обчислень) Сімпсон дає кращий результат."}`,
  },
  {
    id: "py-science-18",
    title: "Перевірка методу бісекції на іншому рівнянні",
    type: "python",
    theory:
      "Головна перевага bisection() — вона працює для БУДЬ-ЯКОГО рівняння з відомим інтервалом зміни знаку, не лише для x²=2. Перевір на рівнянні x³ - x - 2 = 0:\n\ncubic = lambda x: x**3 - x - 2\nroot = bisection(cubic, 1, 2)\nprint(round(root, 4))\n\nЦе рівняння НЕ має простої алгебраїчної формули кореня (кубічні рівняння загального вигляду складні), але bisection() знаходить корінь ≈1.5214 так само легко, як і для x²=2.",
    examples: [
      { title: "bisection() на кубічному рівнянні", code: `def bisection(f, a, b, tol=1e-6):\n    while (b - a) / 2 > tol:\n        midpoint = (a + b) / 2\n        if f(a) * f(midpoint) < 0:\n            b = midpoint\n        else:\n            a = midpoint\n    return (a + b) / 2\n\ncubic = lambda x: x**3 - x - 2\nroot = bisection(cubic, 1, 2)\nprint(round(root, 4))`, explain: "root ≈ 1.5214 — корінь кубічного рівняння, знайдений тим самим універсальним методом." },
    ],
    task: `Дано bisection() (в starter). Знайди корінь cubic = lambda x: x**3 - x - 2 на відрізку [1, 2]. Виведи округлений до 4 знаків результат.`,
    starter: `def bisection(f, a, b, tol=1e-6):\n    while (b - a) / 2 > tol:\n        midpoint = (a + b) / 2\n        if f(a) * f(midpoint) < 0:\n            b = midpoint\n        else:\n            a = midpoint\n    return (a + b) / 2\n\ncubic = lambda x: x**3 - x - 2\n\n# root = bisection(cubic, 1, 2)\n# print(round(root, 4))\n`,
    hints: [`root = bisection(cubic, 1, 2) — та сама функція з уроку про √2.`, `print(round(root, 4))`, `root = bisection(cubic, 1, 2)\nprint(round(root, 4))`],
    solution: `def bisection(f, a, b, tol=1e-6):\n    while (b - a) / 2 > tol:\n        midpoint = (a + b) / 2\n        if f(a) * f(midpoint) < 0:\n            b = midpoint\n        else:\n            a = midpoint\n    return (a + b) / 2\n\ncubic = lambda x: x**3 - x - 2\n\nroot = bisection(cubic, 1, 2)\nprint(round(root, 4))`,
    testCode: `if "root" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна root."}\nelif abs(root - 1.5214) > 0.001:\n    __result__ = {"pass": False, "message": "root для x**3-x-2 на [1,2] має бути приблизно 1.5214."}\nelse:\n    __result__ = {"pass": True, "message": "Та сама функція bisection() працює для БУДЬ-ЯКОГО рівняння — універсальність чисельних методів."}`,
  },
  {
    id: "py-science-19",
    title: "Вплив кута на дальність польоту",
    type: "python",
    theory:
      "Використаємо симуляцію снаряда, щоб дослідити фізичний факт: дальність польоту МАКСИМАЛЬНА при куті 45° (за відсутності опору повітря) — перевір це, порівнявши дальність при 30°, 45° і 60°:\n\nranges = {}\nfor angle in [30, 45, 60]:\n    traj = simulate_projectile(20, angle)\n    ranges[angle] = traj[-1][0]\n\nprint(ranges[45] > ranges[30])\nprint(ranges[45] > ranges[60])\n\nЦікаво: 30° і 60° дають ПРИБЛИЗНО однакову (симетрично меншу) дальність — властивість sin(2θ) у формулі дальності.",
    examples: [
      { title: "45° дає максимальну дальність", code: `import math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory\n\nranges = {}\nfor angle in [30, 45, 60]:\n    traj = simulate_projectile(20, angle)\n    ranges[angle] = traj[-1][0]\n\nprint(ranges[45] > ranges[30])\nprint(ranges[45] > ranges[60])`, explain: "Обидва порівняння True — 45° дійсно дає найбільшу дальність з трьох перевірених кутів." },
    ],
    task: `Дано simulate_projectile() (в starter). Порахуй ranges для кутів [30, 45, 60] з v0=20. Виведи, чи ranges[45] більший за ranges[30] і ranges[60].`,
    starter: `import math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory\n\n# ranges = {}\n# for angle in [30, 45, 60]:\n#     traj = simulate_projectile(20, angle)\n#     ranges[angle] = traj[-1][0]\n\n# print(ranges[45] > ranges[30])\n# print(ranges[45] > ranges[60])\n`,
    hints: [`Цикл for angle in [30, 45, 60]: traj = simulate_projectile(20, angle); ranges[angle] = traj[-1][0]`, `Порівняй ranges[45] з ranges[30] і ranges[60] окремо.`, `ranges = {}\nfor angle in [30, 45, 60]:\n    traj = simulate_projectile(20, angle)\n    ranges[angle] = traj[-1][0]\n\nprint(ranges[45] > ranges[30])\nprint(ranges[45] > ranges[60])`],
    solution: `import math\n\ndef simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):\n    angle = math.radians(angle_deg)\n    vx = v0 * math.cos(angle)\n    vy = v0 * math.sin(angle)\n    x, y = 0.0, 0.0\n    trajectory = [(x, y)]\n    while y >= 0:\n        x += vx * dt\n        y += vy * dt\n        vy -= g * dt\n        trajectory.append((x, y))\n    return trajectory\n\nranges = {}\nfor angle in [30, 45, 60]:\n    traj = simulate_projectile(20, angle)\n    ranges[angle] = traj[-1][0]\n\nprint(ranges[45] > ranges[30])\nprint(ranges[45] > ranges[60])`,
    testCode: `if "ranges" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна ranges (словник)."}\nelif not (ranges[45] > ranges[30] and ranges[45] > ranges[60]):\n    __result__ = {"pass": False, "message": "ranges[45] має бути БІЛЬШИМ за ranges[30] і ranges[60]."}\nelse:\n    __result__ = {"pass": True, "message": "Симуляція підтверджує класичний фізичний факт: 45° дає максимальну дальність польоту."}`,
  },
  {
    id: "py-science-20",
    title: "Фінальний проєкт: лабораторний набір інструментів",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків у science_lab_toolkit.py: чисельне диференціювання й інтегрування, пошук коренів, Монте-Карло, і симуляція руху снаряда. Це і є набір інструментів, обіцяний ще на вступній сторінці «Що це?».\n\nСаме ці алгоритми (метод трапецій/Сімпсона, бісекція, метод Ейлера) лежать в основі функцій scipy.integrate, scipy.optimize.bisect і scipy.integrate.odeint — ти щойно побудував їхню внутрішню логіку вручну.",
    examples: [
      { title: "Повний набір чисельних методів разом", code: `report = {\n    "integral": round(simpson(lambda x: x**2, 0, 1, 100), 6),\n    "root": round(bisection(lambda x: x**2 - 2, 0, 2), 4),\n    "pi_estimate": estimate_pi(1000),\n}\nprint(report)`, explain: "Один звіт об'єднує результати трьох незалежних чисельних методів — інтегрування, пошук кореня, Монте-Карло." },
    ],
    task: `Дано simpson(), bisection(), estimate_pi() (усе в starter, з random.seed(42) вже застосованим). Побудуй словник report з ключами "integral" (simpson для x**2 на [0,1], n=100, округлено до 6), "root" (bisection для x**2-2 на [0,2], округлено до 4) і "pi_estimate" (estimate_pi(1000)). Виведи report.`,
    starter: `import math, random\n\nrandom.seed(42)\n\ndef simpson(f, a, b, n):\n    if n % 2 == 1:\n        n += 1\n    h = (b - a) / n\n    total = f(a) + f(b)\n    for i in range(1, n):\n        coef = 4 if i % 2 == 1 else 2\n        total += coef * f(a + i * h)\n    return total * h / 3\n\ndef bisection(f, a, b, tol=1e-6):\n    while (b - a) / 2 > tol:\n        midpoint = (a + b) / 2\n        if f(a) * f(midpoint) < 0:\n            b = midpoint\n        else:\n            a = midpoint\n    return (a + b) / 2\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\n# report = {\n#     "integral": round(simpson(lambda x: x**2, 0, 1, 100), 6),\n#     "root": round(bisection(lambda x: x**2 - 2, 0, 2), 4),\n#     "pi_estimate": estimate_pi(1000),\n# }\n# print(report)\n`,
    hints: [`"integral": round(simpson(lambda x: x**2, 0, 1, 100), 6)`, `"root": round(bisection(lambda x: x**2 - 2, 0, 2), 4); "pi_estimate": estimate_pi(1000)`, `report = {\n    "integral": round(simpson(lambda x: x**2, 0, 1, 100), 6),\n    "root": round(bisection(lambda x: x**2 - 2, 0, 2), 4),\n    "pi_estimate": estimate_pi(1000),\n}\nprint(report)`],
    solution: `import math, random\n\nrandom.seed(42)\n\ndef simpson(f, a, b, n):\n    if n % 2 == 1:\n        n += 1\n    h = (b - a) / n\n    total = f(a) + f(b)\n    for i in range(1, n):\n        coef = 4 if i % 2 == 1 else 2\n        total += coef * f(a + i * h)\n    return total * h / 3\n\ndef bisection(f, a, b, tol=1e-6):\n    while (b - a) / 2 > tol:\n        midpoint = (a + b) / 2\n        if f(a) * f(midpoint) < 0:\n            b = midpoint\n        else:\n            a = midpoint\n    return (a + b) / 2\n\ndef estimate_pi(n):\n    inside = 0\n    for _ in range(n):\n        x = random.uniform(-1, 1)\n        y = random.uniform(-1, 1)\n        if x**2 + y**2 <= 1:\n            inside += 1\n    return 4 * inside / n\n\nreport = {\n    "integral": round(simpson(lambda x: x**2, 0, 1, 100), 6),\n    "root": round(bisection(lambda x: x**2 - 2, 0, 2), 4),\n    "pi_estimate": estimate_pi(1000),\n}\nprint(report)`,
    testCode: `if "report" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна змінна report."}\nelif abs(report["integral"] - 1/3) > 0.0001:\n    __result__ = {"pass": False, "message": "report['integral'] має бути близько 0.333333."}\nelif abs(report["root"] - 1.4142) > 0.001:\n    __result__ = {"pass": False, "message": "report['root'] має бути близько 1.4142."}\nelif abs(report["pi_estimate"] - 3.18) > 0.01:\n    __result__ = {"pass": False, "message": "report['pi_estimate'] з random.seed(42) має бути 3.18."}\nelse:\n    __result__ = {"pass": True, "message": "Готово! Диференціювання, інтегрування, пошук коренів і Монте-Карло разом — повний набір чисельних методів з нуля."}`,
    finalProject: {
      techs: ["Python 3", "math", "random", "statistics"],
      skills: [
        "Похибки вимірювань: абсолютна й відносна, значущі цифри",
        "Чисельне диференціювання й інтегрування (трапеції, Сімпсон)",
        "Пошук коренів рівнянь методом бісекції",
        "Метод Монте-Карло для оцінки складних величин",
        "Симуляція фізичного руху методом Ейлера",
        "Базова статистична перевірка гіпотез (t-статистика)",
      ],
      structure:
        "science_lab_toolkit.py\n  ├── derivative(f, x) / trapezoidal(f, a, b, n) / simpson(...)  # аналіз функцій\n  ├── bisection(f, a, b)                                          # корені рівнянь\n  ├── estimate_pi(n)                                                # Монте-Карло\n  ├── simulate_projectile(v0, angle)                                 # фізична симуляція\n  └── t_statistic(sample, expected)                                    # статистика експерименту",
      code: `import math
import random
import statistics


def derivative(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)


def simpson(f, a, b, n):
    if n % 2 == 1:
        n += 1
    h = (b - a) / n
    total = f(a) + f(b)
    for i in range(1, n):
        coef = 4 if i % 2 == 1 else 2
        total += coef * f(a + i * h)
    return total * h / 3


def bisection(f, a, b, tol=1e-6):
    while (b - a) / 2 > tol:
        midpoint = (a + b) / 2
        if f(a) * f(midpoint) < 0:
            b = midpoint
        else:
            a = midpoint
    return (a + b) / 2


def estimate_pi(n):
    inside = 0
    for _ in range(n):
        x = random.uniform(-1, 1)
        y = random.uniform(-1, 1)
        if x ** 2 + y ** 2 <= 1:
            inside += 1
    return 4 * inside / n


def simulate_projectile(v0, angle_deg, dt=0.01, g=9.8):
    angle = math.radians(angle_deg)
    vx = v0 * math.cos(angle)
    vy = v0 * math.sin(angle)
    x, y = 0.0, 0.0
    trajectory = [(x, y)]
    while y >= 0:
        x += vx * dt
        y += vy * dt
        vy -= g * dt
        trajectory.append((x, y))
    return trajectory


def t_statistic(sample, expected):
    mean = statistics.mean(sample)
    std = statistics.stdev(sample)
    return (mean - expected) / (std / math.sqrt(len(sample)))


if __name__ == "__main__":
    print("Похідна x^2 у x=3:", round(derivative(lambda x: x ** 2, 3), 4))
    print("Інтеграл x^2 на [0,1]:", round(simpson(lambda x: x ** 2, 0, 1, 100), 6))
    print("Корінь x^2=2:", round(bisection(lambda x: x ** 2 - 2, 0, 2), 4))

    random.seed(42)
    print("Оцінка pi (Монте-Карло):", estimate_pi(10000))

    traj = simulate_projectile(20, 45)
    max_height = max(p[1] for p in traj)
    max_range = traj[-1][0]
    print(f"Снаряд: висота {max_height:.1f}м, дальність {max_range:.1f}м")

    sample = [9.78, 9.81, 9.79, 9.83, 9.80, 9.82]
    print("t-статистика вимірювань g:", round(t_statistic(sample, 9.81), 4))`,
      runCommand: "python science_lab_toolkit.py",
      installGuide: {
        intro:
          "math, random і statistics вбудовані в реальний Python — нічого встановлювати не потрібно, щоб запустити ЦЕЙ код локально. numpy/scipy дають ті самі методи готовими функціями, коли знадобиться швидкість на великих наукових розрахунках.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text: "Зайди на python.org/downloads і встанови останню версію. Windows: галочка «Add python.exe to PATH».",
            code: null,
          },
          {
            title: "2. (Опційно) встанови numpy й scipy",
            text: "Для великих наукових розрахунків — ті самі методи, оптимізовані на низькому рівні:",
            code: "pip install numpy scipy",
          },
          {
            title: "3. Порівняй: ті самі методи на scipy",
            text:
              "scipy.integrate.quad(), scipy.optimize.bisect() і numpy.random виконують ТОЙ САМИЙ принцип — трапеції/Сімпсон, бісекцію, семплювання — лише швидше на С.",
            code: `from scipy import integrate, optimize
import numpy as np

result, _ = integrate.quad(lambda x: x**2, 0, 1)
print(result)

root = optimize.bisect(lambda x: x**2 - 2, 0, 2)
print(root)`,
          },
          {
            title: "4. Запусти скрипт",
            text: "Обидва варіанти (з нуля чи scipy) дають той самий результат для кожного методу.",
            code: "python science_lab_toolkit.py",
          },
        ],
      },
      improvements: [
        "Перейти на scipy для великих обчислень — оптимізовані C-реалізації тих самих алгоритмів",
        "Додати опір повітря до симуляції снаряда (нелінійне рівняння руху)",
        "Реалізувати метод Рунге-Кутта (точніший за Ейлера) для симуляції руху",
        "Додати повноцінний t-тест зі ступенями волі й p-значенням",
      ],
      nextLevel:
        "Далі — 🧰 DevOps / System Administration: від наукових обчислень до автоматизації серверів — Python як універсальний інструмент для будь-якої технічної задачі.",
    },
  },
];
