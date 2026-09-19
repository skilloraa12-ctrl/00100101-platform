// Python Cybersecurity — the thirteenth Python direction. Same intro + 20
// lessons structure. This direction is entirely DEFENSIVE and educational:
// no real network scanning, no attacking real systems — every "attack"
// (brute force, rainbow table) runs against toy data the learner creates
// themselves, to understand WHY defenses like salting and rate limiting
// exist. Everything here is genuine stdlib: hashlib and secrets need no
// workaround at all (unlike numpy/pandas/sqlite3 in earlier directions) —
// this is one of the few directions where the "no compiled packages"
// constraint of this sandbox simply doesn't bite.
export const PYTHON_SECURITY_LESSONS = [
  {
    id: "py-security-intro",
    title: "Що це? — Cybersecurity",
    type: "intro",
    theory:
      "Python Cybersecurity — це напрямок про ЗАХИСТ систем, а не про злам: як розпізнати слабкий пароль, чому «однаковий» хеш може бути небезпечним, чому один символ у вхідних даних може зруйнувати базу даних, і як Python допомагає це виявити ще до того, як цим скористається зловмисник.\n\nНа відміну від інших напрямків, тут НЕ потрібно жодних workaround'ів: hashlib (хешування) і secrets (криптографічно стійкі випадкові значення) — це справжній вбудований stdlib, який працює в цьому Pyodide так само, як у реальному Python. Усі «атаки» в цих уроках — навчальні: перебір словника з 5 паролів проти хешу, який сам учень щойно створив, а не реальний злам чужої системи.\n\nЩо знадобиться з попередніх напрямків: хешування паролів і сіль (🔧 Backend Development, де це вже розглядалось для реєстрації користувачів) — тут ці самі ідеї заглиблюються: ЧОМУ сіль зупиняє атаку з веселковою таблицею, а не просто \"так прийнято\". Що буде після 20 уроків: password_security_toolkit.py — інструмент, що оцінює складність паролів, хешує їх із сіллю, перевіряє цілісність файлів через checksum і формує звіт про слабкі паролі користувачів.",
    presentation: [
      { title: "Cybersecurity — коротко", points: ["Захист, а не злам: паролі, хешування, валідація вхідних даних", "hashlib і secrets — справжній stdlib, працює без жодних обхідних шляхів", "Усі \"атаки\" — навчальні, проти власних тестових даних"] },
      { title: "Результат", points: ["20 уроків: оцінка паролів → шифри → хешування+сіль → валідація → контроль доступу", "Фінал: password_security_toolkit.py з повним аудитом паролів", "Потрібне знання hashlib/secrets (🔧 Backend Development)"] },
    ],
  },
  {
    id: "py-security-1",
    title: "Оцінка складності пароля",
    type: "python",
    theory:
      "Перший захист — не пускати слабкі паролі взагалі. Проста система балів: перевір довжину, наявність великої літери, цифри й спеціального символу, кожен пункт додає бал:\n\ndef password_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if any(c.isupper() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in \"!@#$%^&*\" for c in password):\n        score += 1\n    return score\n\nprint(password_strength(\"password\"))\nprint(password_strength(\"Password1!\"))\n\nЧим більше різних ТИПІВ символів, тим складніше перебрати пароль грубою силою.",
    examples: [
      { title: "password_strength() — бальна система", code: `def password_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if any(c.isupper() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*" for c in password):\n        score += 1\n    return score\n\nprint(password_strength("password"))\nprint(password_strength("Password1!"))`, explain: "«password» набирає лише 1 бал (тільки довжина), «Password1!» — усі 4 (довжина, велика літера, цифра, спецсимвол)." },
    ],
    task: `Напиши password_strength(password) за формулою вище. Виведи password_strength("password") і password_strength("Password1!").`,
    starter: `def password_strength(password):\n    # твій код тут\n    pass\n\n# print(password_strength("password"))\n# print(password_strength("Password1!"))\n`,
    hints: [`Почни з score = 0, потім чотири окремі перевірки if.`, `any(c.isupper() for c in password) — чи є хоч ОДНА велика літера.`, `def password_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if any(c.isupper() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*" for c in password):\n        score += 1\n    return score`],
    solution: `def password_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if any(c.isupper() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*" for c in password):\n        score += 1\n    return score\n\nprint(password_strength("password"))\nprint(password_strength("Password1!"))`,
    testCode: `if "password_strength" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція password_strength(password)."}\nelif password_strength("password") != 1:\n    __result__ = {"pass": False, "message": "password_strength('password') має дати 1 (тільки довжина)."}\nelif password_strength("Password1!") != 4:\n    __result__ = {"pass": False, "message": "password_strength('Password1!') має дати 4 (усі критерії)."}\nelse:\n    __result__ = {"pass": True, "message": "Бальна система — простий, але корисний перший фільтр слабких паролів."}`,
  },
  {
    id: "py-security-2",
    title: "Виявлення поширених паролів",
    type: "python",
    theory:
      "Навіть довгий пароль небезпечний, якщо він у ТОП-СПИСКУ найпоширеніших (їх зламують за секунди, бо перевіряють у першу чергу):\n\nCOMMON_PASSWORDS = {\"123456\", \"password\", \"qwerty\", \"111111\", \"abc123\"}\n\ndef is_common(password):\n    return password.lower() in COMMON_PASSWORDS\n\nprint(is_common(\"Password1!\"))\nprint(is_common(\"123456\"))\n\n.lower() важливий: «Password» і «PASSWORD» так само небезпечні, як «password» — регістр не рятує від словникової атаки.",
    examples: [
      { title: "is_common() — перевірка проти чорного списку", code: `COMMON_PASSWORDS = {"123456", "password", "qwerty", "111111", "abc123"}\n\ndef is_common(password):\n    return password.lower() in COMMON_PASSWORDS\n\nprint(is_common("Password1!"))\nprint(is_common("123456"))`, explain: "«Password1!» унікальний (False), а «123456» — у топ-списку найпоширеніших (True)." },
    ],
    task: `Дано COMMON_PASSWORDS. Напиши is_common(password), що перевіряє password.lower() у множині. Виведи is_common("Password1!") і is_common("123456").`,
    starter: `COMMON_PASSWORDS = {"123456", "password", "qwerty", "111111", "abc123"}\n\ndef is_common(password):\n    # твій код тут\n    pass\n\n# print(is_common("Password1!"))\n# print(is_common("123456"))\n`,
    hints: [`password.lower() перетворює на нижній регістр перед перевіркою.`, `return password.lower() in COMMON_PASSWORDS`, `def is_common(password):\n    return password.lower() in COMMON_PASSWORDS\n\nprint(is_common("Password1!"))\nprint(is_common("123456"))`],
    solution: `COMMON_PASSWORDS = {"123456", "password", "qwerty", "111111", "abc123"}\n\ndef is_common(password):\n    return password.lower() in COMMON_PASSWORDS\n\nprint(is_common("Password1!"))\nprint(is_common("123456"))`,
    testCode: `if "is_common" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція is_common(password)."}\nelif is_common("Password1!") != False or is_common("123456") != True:\n    __result__ = {"pass": False, "message": "is_common('Password1!') має бути False, is_common('123456') — True."}\nelif is_common("QWERTY") != True:\n    __result__ = {"pass": False, "message": "is_common('QWERTY') теж має бути True — регістр не має значення."}\nelse:\n    __result__ = {"pass": True, "message": "Перевірка проти чорного списку — швидкий спосіб відсіяти найочевидніші слабкі паролі."}`,
  },
  {
    id: "py-security-3",
    title: "Цезарів шифр: шифрування зсувом",
    type: "python",
    theory:
      "Шифр Цезаря — найпростіший історичний шифр: кожна літера зсувається на фіксовану кількість позицій в алфавіті (A→D при зсуві 3). Це НЕ безпечно для реального захисту (зламується за хвилини), але добре демонструє саму ІДЕЮ шифрування:\n\ndef caesar_encrypt(text, shift):\n    result = \"\"\n    for ch in text:\n        if ch.isalpha():\n            base = ord(\"A\") if ch.isupper() else ord(\"a\")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\nprint(caesar_encrypt(\"Hello, World!\", 3))\n\n% 26 забезпечує «перехід по колу»: після Z знову йде A. Символи, що не є літерами (кома, знак оклику), залишаються без змін.",
    examples: [
      { title: "caesar_encrypt() зі зсувом 3", code: `def caesar_encrypt(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\nprint(caesar_encrypt("Hello, World!", 3))`, explain: "«Hello, World!» стає «Khoor, Zruog!» — кожна літера зсунута на 3 позиції, кома й знак оклику незмінні." },
    ],
    task: `Напиши caesar_encrypt(text, shift) за формулою вище. Виведи caesar_encrypt("Hello, World!", 3).`,
    starter: `def caesar_encrypt(text, shift):\n    # твій код тут\n    pass\n\n# print(caesar_encrypt("Hello, World!", 3))\n`,
    hints: [`if ch.isalpha(): визнач base = ord("A") якщо велика, інакше ord("a").`, `(ord(ch) - base + shift) % 26 + base — формула зсуву з переходом по колу.`, `def caesar_encrypt(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result`],
    solution: `def caesar_encrypt(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\nprint(caesar_encrypt("Hello, World!", 3))`,
    testCode: `if "caesar_encrypt" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція caesar_encrypt(text, shift)."}\nelif caesar_encrypt("Hello, World!", 3) != "Khoor, Zruog!":\n    __result__ = {"pass": False, "message": "caesar_encrypt('Hello, World!', 3) має дати 'Khoor, Zruog!'."}\nelse:\n    __result__ = {"pass": True, "message": "Шифр Цезаря — найпростіша ілюстрація ідеї шифрування, хоч і давно небезпечна для реального захисту."}`,
  },
  {
    id: "py-security-4",
    title: "Цезарів шифр: розшифрування",
    type: "python",
    theory:
      "Розшифрування Цезаря — те саме шифрування, тільки зі ЗВОРОТНИМ зсувом (від'ємним числом). % 26 у Python коректно обробляє від'ємні числа (завжди повертає результат у [0, 25]):\n\ndef caesar_decrypt(text, shift):\n    return caesar_encrypt(text, -shift)\n\nencrypted = caesar_encrypt(\"Hello, World!\", 3)\nprint(caesar_decrypt(encrypted, 3))\n\nЦе показує СИМЕТРИЧНІСТЬ шифру Цезаря: той самий ключ (число зсуву) використовується і для шифрування, і для розшифрування.",
    examples: [
      { title: "caesar_decrypt() через зворотний зсув", code: `def caesar_encrypt(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\ndef caesar_decrypt(text, shift):\n    return caesar_encrypt(text, -shift)\n\nencrypted = caesar_encrypt("Hello, World!", 3)\nprint(encrypted)\nprint(caesar_decrypt(encrypted, 3))`, explain: "caesar_decrypt(caesar_encrypt(text, 3), 3) завжди повертає ОРИГІНАЛЬНИЙ текст." },
    ],
    task: `Дано caesar_encrypt() (в starter). Напиши caesar_decrypt(text, shift) = caesar_encrypt(text, -shift). Зашифруй "Hello, World!" зсувом 3, потім розшифруй і виведи обидва рядки.`,
    starter: `def caesar_encrypt(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\ndef caesar_decrypt(text, shift):\n    # твій код тут\n    pass\n\n# encrypted = caesar_encrypt("Hello, World!", 3)\n# print(encrypted)\n# print(caesar_decrypt(encrypted, 3))\n`,
    hints: [`Розшифрування — це шифрування з ПРОТИЛЕЖНИМ знаком зсуву.`, `return caesar_encrypt(text, -shift)`, `def caesar_decrypt(text, shift):\n    return caesar_encrypt(text, -shift)\n\nencrypted = caesar_encrypt("Hello, World!", 3)\nprint(encrypted)\nprint(caesar_decrypt(encrypted, 3))`],
    solution: `def caesar_encrypt(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\ndef caesar_decrypt(text, shift):\n    return caesar_encrypt(text, -shift)\n\nencrypted = caesar_encrypt("Hello, World!", 3)\nprint(encrypted)\nprint(caesar_decrypt(encrypted, 3))`,
    testCode: `if "caesar_decrypt" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція caesar_decrypt(text, shift)."}\nelif caesar_decrypt("Khoor, Zruog!", 3) != "Hello, World!":\n    __result__ = {"pass": False, "message": "caesar_decrypt('Khoor, Zruog!', 3) має дати 'Hello, World!'."}\nelse:\n    __result__ = {"pass": True, "message": "Шифр Цезаря симетричний: той самий ключ шифрує й розшифровує."}`,
  },
  {
    id: "py-security-5",
    title: "XOR-шифр: інша ідея симетричного шифрування",
    type: "python",
    theory:
      "XOR (виключне АБО) має магічну властивість: (a XOR b) XOR b = a — застосувавши XOR з тим самим ключем ДВІЧІ, повертаєш оригінал. Це основа простого симетричного шифру:\n\ndef xor_cipher(text, key):\n    return \"\".join(\n        chr(ord(c) ^ ord(key[i % len(key)]))\n        for i, c in enumerate(text)\n    )\n\nencrypted = xor_cipher(\"Secret\", \"k\")\ndecrypted = xor_cipher(encrypted, \"k\")\nprint(decrypted)\n\nkey[i % len(key)] «зациклює» короткий ключ на весь текст — символ 0 тексту XOR-иться з символом 0 ключа, символ 1 — з символом 1, і так по колу.",
    examples: [
      { title: "xor_cipher() — шифрування й розшифрування ОДНІЄЮ функцією", code: `def xor_cipher(text, key):\n    return "".join(\n        chr(ord(c) ^ ord(key[i % len(key)]))\n        for i, c in enumerate(text)\n    )\n\nencrypted = xor_cipher("Secret", "k")\ndecrypted = xor_cipher(encrypted, "k")\nprint(decrypted)`, explain: "xor_cipher(xor_cipher(text, key), key) завжди повертає ОРИГІНАЛЬНИЙ текст — та сама функція для обох напрямків." },
    ],
    task: `Напиши xor_cipher(text, key) за формулою вище. Зашифруй "Secret" ключем "k", потім розшифруй ТІЄЮ Ж функцією і виведи результат.`,
    starter: `def xor_cipher(text, key):\n    # твій код тут\n    pass\n\n# encrypted = xor_cipher("Secret", "k")\n# decrypted = xor_cipher(encrypted, "k")\n# print(decrypted)\n`,
    hints: [`enumerate(text) дає (індекс, символ) для кожної літери.`, `ord(c) ^ ord(key[i % len(key)]) — XOR коду символу з кодом відповідного символу ключа.`, `def xor_cipher(text, key):\n    return "".join(\n        chr(ord(c) ^ ord(key[i % len(key)]))\n        for i, c in enumerate(text)\n    )`],
    solution: `def xor_cipher(text, key):\n    return "".join(\n        chr(ord(c) ^ ord(key[i % len(key)]))\n        for i, c in enumerate(text)\n    )\n\nencrypted = xor_cipher("Secret", "k")\ndecrypted = xor_cipher(encrypted, "k")\nprint(decrypted)`,
    testCode: `if "xor_cipher" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція xor_cipher(text, key)."}\nelse:\n    enc = xor_cipher("Secret", "k")\n    dec = xor_cipher(enc, "k")\n    if enc == "Secret":\n        __result__ = {"pass": False, "message": "Зашифрований текст НЕ має збігатись з оригіналом."}\n    elif dec != "Secret":\n        __result__ = {"pass": False, "message": "xor_cipher(xor_cipher('Secret', 'k'), 'k') має повернути 'Secret'."}\n    elif not any("Secret" in l for l in __logs):\n        __result__ = {"pass": False, "message": "Виведи розшифрований результат — має бути «Secret»."}\n    else:\n        __result__ = {"pass": True, "message": "XOR двічі з тим самим ключем повертає оригінал — та сама функція шифрує й розшифровує."}`,
  },
  {
    id: "py-security-6",
    title: "Хешування паролів: чому незворотне",
    type: "python",
    theory:
      "На відміну від шифрів (Цезаря, XOR), хеш-функція — ОДНОСТОРОННЯ: з паролю легко отримати хеш, але з хешу НЕМОЖЛИВО відновити пароль назад. Тому паролі НІКОЛИ не шифрують — їх ХЕШУЮТЬ:\n\nimport hashlib\n\ndef hash_password(password):\n    return hashlib.sha256(password.encode()).hexdigest()\n\nh1 = hash_password(\"password123\")\nh2 = hash_password(\"password123\")\nprint(h1 == h2)\nprint(len(h1))\n\nОДИН і той самий пароль ЗАВЖДИ дає ОДИН і той самий хеш (h1 == h2), і SHA-256 завжди повертає рядок довжиною 64 символи.",
    examples: [
      { title: "hash_password() — детерміноване хешування", code: `import hashlib\n\ndef hash_password(password):\n    return hashlib.sha256(password.encode()).hexdigest()\n\nh1 = hash_password("password123")\nh2 = hash_password("password123")\nprint(h1 == h2)\nprint(len(h1))`, explain: "h1 == h2 (True) — той самий вхід завжди дає той самий хеш; довжина завжди 64 (SHA-256)." },
    ],
    task: `Напиши hash_password(password) через hashlib.sha256(...).hexdigest(). Порахуй хеш "password123" двічі й порівняй результати. Виведи True/False порівняння і len() першого хешу.`,
    starter: `import hashlib\n\ndef hash_password(password):\n    # твій код тут\n    pass\n\n# h1 = hash_password("password123")\n# h2 = hash_password("password123")\n# print(h1 == h2)\n# print(len(h1))\n`,
    hints: [`password.encode() перетворює рядок у байти (потрібно для hashlib).`, `hashlib.sha256(...).hexdigest() дає хеш у вигляді рядка з шістнадцяткових цифр.`, `def hash_password(password):\n    return hashlib.sha256(password.encode()).hexdigest()\n\nh1 = hash_password("password123")\nh2 = hash_password("password123")\nprint(h1 == h2)\nprint(len(h1))`],
    solution: `import hashlib\n\ndef hash_password(password):\n    return hashlib.sha256(password.encode()).hexdigest()\n\nh1 = hash_password("password123")\nh2 = hash_password("password123")\nprint(h1 == h2)\nprint(len(h1))`,
    testCode: `if "hash_password" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція hash_password(password)."}\nelif hash_password("password123") != hash_password("password123"):\n    __result__ = {"pass": False, "message": "Той самий пароль має завжди давати той самий хеш."}\nelif len(hash_password("password123")) != 64:\n    __result__ = {"pass": False, "message": "SHA-256 хеш завжди має довжину 64 символи."}\nelif not any("True" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи порівняння h1 == h2 — має бути True."}\nelse:\n    __result__ = {"pass": True, "message": "Хешування односторонне: з хешу неможливо відновити пароль, на відміну від шифрів."}`,
  },
  {
    id: "py-security-7",
    title: "Сіль (salt): чому однаковий пароль дає різний хеш",
    type: "python",
    theory:
      "Проблема хешування БЕЗ солі: двоє користувачів з ОДНАКОВИМ паролем матимуть ОДНАКОВИЙ хеш у базі — зловмисник, зламавши один хеш, автоматично отримує пароль обох. Сіль — унікальний рядок, доданий ДО кожного пароля ПЕРЕД хешуванням:\n\ndef hash_with_salt(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nh1 = hash_with_salt(\"password\", \"aaa\")\nh2 = hash_with_salt(\"password\", \"bbb\")\nprint(h1 != h2)\n\nОДИН і той самий пароль з РІЗНОЮ сіллю дає РІЗНІ хеші — саме тому кожен користувач у базі даних отримує свою власну, унікальну сіль.",
    examples: [
      { title: "hash_with_salt() — різна сіль, різний хеш", code: `import hashlib\n\ndef hash_with_salt(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nh1 = hash_with_salt("password", "aaa")\nh2 = hash_with_salt("password", "bbb")\nh1_again = hash_with_salt("password", "aaa")\nprint(h1 != h2)\nprint(h1 == h1_again)`, explain: "Той самий пароль «password» з сіллю «aaa» й сіллю «bbb» дає РІЗНІ хеші — але однакова сіль завжди дає однаковий результат." },
    ],
    task: `Напиши hash_with_salt(password, salt). Порахуй хеш "password" із сіллю "aaa" та з сіллю "bbb". Виведи, чи вони РІЗНІ, і чи хеш з тією самою сіллю "aaa" повторюється однаково.`,
    starter: `import hashlib\n\ndef hash_with_salt(password, salt):\n    # твій код тут\n    pass\n\n# h1 = hash_with_salt("password", "aaa")\n# h2 = hash_with_salt("password", "bbb")\n# h1_again = hash_with_salt("password", "aaa")\n# print(h1 != h2)\n# print(h1 == h1_again)\n`,
    hints: [`Склей salt і password ПЕРЕД хешуванням: salt + password.`, `return hashlib.sha256((salt + password).encode()).hexdigest()`, `def hash_with_salt(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nh1 = hash_with_salt("password", "aaa")\nh2 = hash_with_salt("password", "bbb")\nh1_again = hash_with_salt("password", "aaa")\nprint(h1 != h2)\nprint(h1 == h1_again)`],
    solution: `import hashlib\n\ndef hash_with_salt(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nh1 = hash_with_salt("password", "aaa")\nh2 = hash_with_salt("password", "bbb")\nh1_again = hash_with_salt("password", "aaa")\nprint(h1 != h2)\nprint(h1 == h1_again)`,
    testCode: `if "hash_with_salt" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція hash_with_salt(password, salt)."}\nelif hash_with_salt("password", "aaa") == hash_with_salt("password", "bbb"):\n    __result__ = {"pass": False, "message": "Різна сіль має давати РІЗНІ хеші для того самого пароля."}\nelif hash_with_salt("password", "aaa") != hash_with_salt("password", "aaa"):\n    __result__ = {"pass": False, "message": "Однакова сіль і пароль мають завжди давати однаковий хеш."}\nelse:\n    __result__ = {"pass": True, "message": "Сіль перетворює однаковий пароль на РІЗНІ хеші — саме тому вона зберігається окремо для кожного користувача."}`,
  },
  {
    id: "py-security-8",
    title: "Атака грубою силою на хеш без солі",
    type: "python",
    theory:
      "Якщо зловмисник має ХЕШ (наприклад, витік бази даних) і словник поширених паролів, він може перебрати кожен кандидат, порахувати його хеш, і порівняти з викраденим:\n\ndef crack(candidates, target_hash):\n    for c in candidates:\n        if hashlib.sha256(c.encode()).hexdigest() == target_hash:\n            return c\n    return None\n\ncandidates = [\"123456\", \"password\", \"qwerty\", \"letmein\", \"admin123\"]\ntarget_hash = hashlib.sha256(\"qwerty\".encode()).hexdigest()\nprint(crack(candidates, target_hash))\n\nЦе НАВЧАЛЬНА демонстрація на власному, щойно створеному хеші — саме тому такий словниковий перебір і працює за долі секунди для слабких паролів.",
    examples: [
      { title: "crack() — словникова атака на хеш", code: `import hashlib\n\ndef crack(candidates, target_hash):\n    for c in candidates:\n        if hashlib.sha256(c.encode()).hexdigest() == target_hash:\n            return c\n    return None\n\ncandidates = ["123456", "password", "qwerty", "letmein", "admin123"]\ntarget_hash = hashlib.sha256("qwerty".encode()).hexdigest()\nprint(crack(candidates, target_hash))`, explain: "crack() знаходить «qwerty» за мілісекунди, перебравши лише 5 кандидатів зі словника." },
    ],
    task: `Дано candidates, target_hash (хеш "qwerty"). Напиши crack(candidates, target_hash), що перебирає кандидатів і повертає той, чий хеш збігається. Виведи результат.`,
    starter: `import hashlib\n\ncandidates = ["123456", "password", "qwerty", "letmein", "admin123"]\ntarget_hash = hashlib.sha256("qwerty".encode()).hexdigest()\n\ndef crack(candidates, target_hash):\n    # твій код тут\n    pass\n\n# print(crack(candidates, target_hash))\n`,
    hints: [`Цикл for c in candidates: порахуй hashlib.sha256(c.encode()).hexdigest()`, `Якщо хеш кандидата дорівнює target_hash — поверни c; інакше після циклу поверни None.`, `def crack(candidates, target_hash):\n    for c in candidates:\n        if hashlib.sha256(c.encode()).hexdigest() == target_hash:\n            return c\n    return None\n\nprint(crack(candidates, target_hash))`],
    solution: `import hashlib\n\ncandidates = ["123456", "password", "qwerty", "letmein", "admin123"]\ntarget_hash = hashlib.sha256("qwerty".encode()).hexdigest()\n\ndef crack(candidates, target_hash):\n    for c in candidates:\n        if hashlib.sha256(c.encode()).hexdigest() == target_hash:\n            return c\n    return None\n\nprint(crack(candidates, target_hash))`,
    testCode: `if "crack" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція crack(candidates, target_hash)."}\nelif crack(candidates, target_hash) != "qwerty":\n    __result__ = {"pass": False, "message": "crack(candidates, target_hash) має знайти 'qwerty'."}\nelif not any("qwerty" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи знайдений пароль через print()."}\nelse:\n    __result__ = {"pass": True, "message": "Хеш БЕЗ солі зламується словниковою атакою за мілісекунди для поширених паролів — саме тому потрібна сіль."}`,
  },
  {
    id: "py-security-9",
    title: "Чому сіль зупиняє атаку веселковою таблицею",
    type: "python",
    theory:
      "Веселкова таблиця (rainbow table) — заздалегідь порахований словник «хеш → пароль» для мільйонів поширених паролів. Це РОБИТЬ атаку миттєвою — але ЛИШЕ для хешів БЕЗ солі:\n\nrainbow = {hashlib.sha256(c.encode()).hexdigest(): c for c in candidates}\n\nsalted_hash = hash_with_salt(\"qwerty\", \"aaa\")\nunsalted_hash = hashlib.sha256(\"qwerty\".encode()).hexdigest()\n\nprint(rainbow.get(salted_hash))    # None — солоний хеш НЕ входить у готову таблицю\nprint(rainbow.get(unsalted_hash)) # 'qwerty' — миттєво знайдено\n\nВеселкова таблиця будується для СИРИХ паролів — щойно додається сіль, кожен ЗАЗДАЛЕГІДЬ порахований хеш стає марним, і зловмиснику довелось би рахувати ОКРЕМУ таблицю для кожної унікальної солі.",
    examples: [
      { title: "Сіль ламає готову веселкову таблицю", code: `import hashlib\n\ncandidates = ["123456", "password", "qwerty", "letmein", "admin123"]\n\ndef hash_with_salt(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nrainbow = {hashlib.sha256(c.encode()).hexdigest(): c for c in candidates}\n\nsalted_hash = hash_with_salt("qwerty", "aaa")\nunsalted_hash = hashlib.sha256("qwerty".encode()).hexdigest()\n\nprint(rainbow.get(salted_hash))\nprint(rainbow.get(unsalted_hash))`, explain: "Готова таблиця rainbow миттєво знаходить несолений хеш, але БЕЗСИЛА проти солоного." },
    ],
    task: `Дано candidates, hash_with_salt(), rainbow (готова таблиця). Порахуй salted_hash і unsalted_hash для "qwerty". Виведи rainbow.get(salted_hash) і rainbow.get(unsalted_hash).`,
    starter: `import hashlib\n\ncandidates = ["123456", "password", "qwerty", "letmein", "admin123"]\n\ndef hash_with_salt(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nrainbow = {hashlib.sha256(c.encode()).hexdigest(): c for c in candidates}\n\n# salted_hash = hash_with_salt("qwerty", "aaa")\n# unsalted_hash = hashlib.sha256("qwerty".encode()).hexdigest()\n\n# print(rainbow.get(salted_hash))\n# print(rainbow.get(unsalted_hash))\n`,
    hints: [`salted_hash = hash_with_salt("qwerty", "aaa")`, `unsalted_hash = hashlib.sha256("qwerty".encode()).hexdigest()`, `salted_hash = hash_with_salt("qwerty", "aaa")\nunsalted_hash = hashlib.sha256("qwerty".encode()).hexdigest()\nprint(rainbow.get(salted_hash))\nprint(rainbow.get(unsalted_hash))`],
    solution: `import hashlib\n\ncandidates = ["123456", "password", "qwerty", "letmein", "admin123"]\n\ndef hash_with_salt(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nrainbow = {hashlib.sha256(c.encode()).hexdigest(): c for c in candidates}\n\nsalted_hash = hash_with_salt("qwerty", "aaa")\nunsalted_hash = hashlib.sha256("qwerty".encode()).hexdigest()\n\nprint(rainbow.get(salted_hash))\nprint(rainbow.get(unsalted_hash))`,
    testCode: `if "salted_hash" not in globals() or "unsalted_hash" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні salted_hash і unsalted_hash."}\nelif rainbow.get(salted_hash) is not None:\n    __result__ = {"pass": False, "message": "rainbow.get(salted_hash) має бути None — сіль ламає готову таблицю."}\nelif rainbow.get(unsalted_hash) != "qwerty":\n    __result__ = {"pass": False, "message": "rainbow.get(unsalted_hash) має знайти 'qwerty' миттєво."}\nelse:\n    __result__ = {"pass": True, "message": "Веселкова таблиця безсила проти солоних хешів — саме тому сіль є стандартом зберігання паролів."}`,
  },
  {
    id: "py-security-10",
    title: "Валідація вхідних даних: розпізнавання підозрілих патернів",
    type: "python",
    theory:
      "SQL-ін'єкція — класична атака, коли зловмисник вставляє КОД замість звичайних даних у поле вводу (наприклад, у формі логіну): admin' OR '1'='1 змушує запит бази даних завжди повертати «істина». Перший захист — розпізнати підозрілі символи ще ДО того, як дані потраплять у запит:\n\ndef looks_malicious(input_str):\n    dangerous = [\"'\", \"--\", \";\", \" OR \", \" or \"]\n    return any(d in input_str for d in dangerous)\n\nprint(looks_malicious(\"admin' OR '1'='1\"))\nprint(looks_malicious(\"john_doe\"))\n\nЦе ПРОСТА евристика (справжній захист — параметризовані SQL-запити), але вона показує саму ІДЕЮ: звичайні дані НЕ повинні містити синтаксис коду.",
    examples: [
      { title: "looks_malicious() — розпізнавання SQL-ін'єкції", code: `def looks_malicious(input_str):\n    dangerous = ["'", "--", ";", " OR ", " or "]\n    return any(d in input_str for d in dangerous)\n\nprint(looks_malicious("admin' OR '1'='1"))\nprint(looks_malicious("john_doe"))`, explain: "Перший рядок містить одинарну лапку й ' OR ' — класична спроба SQL-ін'єкції; другий — звичайне ім'я користувача." },
    ],
    task: `Напиши looks_malicious(input_str), що перевіряє наявність будь-якого з dangerous патернів. Виведи looks_malicious("admin' OR '1'='1") і looks_malicious("john_doe").`,
    starter: `def looks_malicious(input_str):\n    dangerous = ["'", "--", ";", " OR ", " or "]\n    # твій код тут\n    pass\n\n# print(looks_malicious("admin' OR '1'='1"))\n# print(looks_malicious("john_doe"))\n`,
    hints: [`any(d in input_str for d in dangerous) — чи присутній ХОЧ ОДИН небезпечний патерн.`, `return any(d in input_str for d in dangerous)`, `def looks_malicious(input_str):\n    dangerous = ["'", "--", ";", " OR ", " or "]\n    return any(d in input_str for d in dangerous)\n\nprint(looks_malicious("admin' OR '1'='1"))\nprint(looks_malicious("john_doe"))`],
    solution: `def looks_malicious(input_str):\n    dangerous = ["'", "--", ";", " OR ", " or "]\n    return any(d in input_str for d in dangerous)\n\nprint(looks_malicious("admin' OR '1'='1"))\nprint(looks_malicious("john_doe"))`,
    testCode: `if "looks_malicious" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція looks_malicious(input_str)."}\nelif looks_malicious("admin' OR '1'='1") != True:\n    __result__ = {"pass": False, "message": "looks_malicious(\\"admin' OR '1'='1\\") має бути True."}\nelif looks_malicious("john_doe") != False:\n    __result__ = {"pass": False, "message": "looks_malicious('john_doe') має бути False."}\nelse:\n    __result__ = {"pass": True, "message": "Розпізнавання підозрілих символів — перший (не єдиний!) рубіж захисту від SQL-ін'єкцій."}`,
  },
  {
    id: "py-security-11",
    title: "Санітизація: знешкодження небезпечних символів",
    type: "python",
    theory:
      "Замість того щоб ВІДХИЛЯТИ підозрілий ввід, іноді його САНІТИЗУЮТЬ — екранують небезпечні символи так, щоб вони втрачали особливе значення. У SQL одинарну лапку екранують, ПОДВОЮЮЧИ її:\n\ndef sanitize(input_str):\n    return input_str.replace(\"'\", \"''\")\n\nprint(sanitize(\"O'Brien\"))\n\nЦе перетворює лапку із «кінець рядка коду» на «звичайний символ лапки всередині тексту» — «O'Brien» (законне прізвище!) обробляється безпечно, а не блокується як атака.",
    examples: [
      { title: "sanitize() — екранування лапок", code: `def sanitize(input_str):\n    return input_str.replace("'", "''")\n\nprint(sanitize("O'Brien"))`, explain: "«O'Brien» стає «O''Brien» — подвоєна лапка більше не завершує SQL-рядок передчасно." },
    ],
    task: `Напиши sanitize(input_str), що замінює кожну одинарну лапку на дві. Виведи sanitize("O'Brien").`,
    starter: `def sanitize(input_str):\n    # твій код тут\n    pass\n\n# print(sanitize("O'Brien"))\n`,
    hints: [`input_str.replace(старе, нове) замінює ВСІ входження.`, `return input_str.replace("'", "''")`, `def sanitize(input_str):\n    return input_str.replace("'", "''")\n\nprint(sanitize("O'Brien"))`],
    solution: `def sanitize(input_str):\n    return input_str.replace("'", "''")\n\nprint(sanitize("O'Brien"))`,
    testCode: `if "sanitize" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція sanitize(input_str)."}\nelif sanitize("O'Brien") != "O''Brien":\n    __result__ = {"pass": False, "message": "sanitize(\\"O'Brien\\") має дати \\"O''Brien\\"."}\nelse:\n    __result__ = {"pass": True, "message": "Санітизація дозволяє законні дані (як прізвище O'Brien), знешкоджуючи їх потенційну небезпеку."}`,
  },
  {
    id: "py-security-12",
    title: "Генерація безпечних токенів",
    type: "python",
    theory:
      "Для сесій входу, скидання пароля чи API-ключів потрібні ВИПАДКОВІ значення, які НЕМОЖЛИВО вгадати. Модуль random (звичайна псевдовипадковість) для цього НЕ підходить — потрібен secrets, криптографічно стійкий генератор:\n\nimport secrets\n\ntoken = secrets.token_hex(16)\nprint(len(token))\n\ntoken2 = secrets.token_hex(16)\nprint(token != token2)\n\ntoken_hex(16) генерує 16 БАЙТІВ випадкових даних, представлених як 32 шістнадцяткові символи (кожен байт — 2 символи).",
    examples: [
      { title: "secrets.token_hex() — криптографічно стійкий токен", code: `import secrets\n\ntoken = secrets.token_hex(16)\nprint(len(token))\n\ntoken2 = secrets.token_hex(16)\nprint(token != token2)`, explain: "Довжина завжди 32 символи (16 байтів × 2), і кожен виклик дає ІНШЕ значення." },
    ],
    task: `Згенеруй token = secrets.token_hex(16) і token2 = secrets.token_hex(16). Виведи len(token) і чи token != token2.`,
    starter: `import secrets\n\n# token = secrets.token_hex(16)\n# token2 = secrets.token_hex(16)\n# print(len(token))\n# print(token != token2)\n`,
    hints: [`secrets.token_hex(n) генерує n байтів у вигляді hex-рядка вдвічі довшого.`, `Виклич функцію двічі, щоб отримати два РІЗНІ токени.`, `token = secrets.token_hex(16)\ntoken2 = secrets.token_hex(16)\nprint(len(token))\nprint(token != token2)`],
    solution: `import secrets\n\ntoken = secrets.token_hex(16)\ntoken2 = secrets.token_hex(16)\nprint(len(token))\nprint(token != token2)`,
    testCode: `if "token" not in globals() or "token2" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні token і token2."}\nelif len(token) != 32:\n    __result__ = {"pass": False, "message": "secrets.token_hex(16) має дати рядок довжиною 32 символи."}\nelif token == token2:\n    __result__ = {"pass": False, "message": "Два виклики secrets.token_hex(16) майже напевно мають дати РІЗНІ значення."}\nelse:\n    __result__ = {"pass": True, "message": "secrets — правильний вибір для токенів сесій, на відміну від звичайного random."}`,
  },
  {
    id: "py-security-13",
    title: "Перевірка цілісності файлу через checksum",
    type: "python",
    theory:
      "Хеш можна використовувати не лише для паролів, а й для ПЕРЕВІРКИ ЦІЛІСНОСТІ: якщо навіть ОДИН символ у файлі зміниться, хеш стане ЗОВСІМ ІНШИМ. Це дозволяє виявити пошкодження чи підробку без порівняння всього вмісту:\n\ndef checksum(content):\n    return hashlib.sha256(content.encode()).hexdigest()\n\ndef verify(content, expected_checksum):\n    return checksum(content) == expected_checksum\n\noriginal = \"original data\"\nc = checksum(original)\nprint(verify(original, c))\nprint(verify(\"tampered data\", c))",
    examples: [
      { title: "checksum() і verify() — виявлення підробки", code: `import hashlib\n\ndef checksum(content):\n    return hashlib.sha256(content.encode()).hexdigest()\n\ndef verify(content, expected_checksum):\n    return checksum(content) == expected_checksum\n\noriginal = "original data"\nc = checksum(original)\nprint(verify(original, c))\nprint(verify("tampered data", c))`, explain: "verify(original, c) True — вміст не змінився; verify(\"tampered data\", c) False — навіть інший текст тієї ж довжини дає ІНШИЙ хеш." },
    ],
    task: `Напиши checksum(content) і verify(content, expected_checksum). Порахуй checksum "original data", потім перевір verify() для оригіналу й для "tampered data".`,
    starter: `import hashlib\n\ndef checksum(content):\n    # твій код тут\n    pass\n\ndef verify(content, expected_checksum):\n    # твій код тут\n    pass\n\n# original = "original data"\n# c = checksum(original)\n# print(verify(original, c))\n# print(verify("tampered data", c))\n`,
    hints: [`checksum: return hashlib.sha256(content.encode()).hexdigest()`, `verify: return checksum(content) == expected_checksum`, `def checksum(content):\n    return hashlib.sha256(content.encode()).hexdigest()\n\ndef verify(content, expected_checksum):\n    return checksum(content) == expected_checksum`],
    solution: `import hashlib\n\ndef checksum(content):\n    return hashlib.sha256(content.encode()).hexdigest()\n\ndef verify(content, expected_checksum):\n    return checksum(content) == expected_checksum\n\noriginal = "original data"\nc = checksum(original)\nprint(verify(original, c))\nprint(verify("tampered data", c))`,
    testCode: `if "checksum" not in globals() or "verify" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні функції checksum(content) і verify(content, expected_checksum)."}\nelif verify("original data", checksum("original data")) != True:\n    __result__ = {"pass": False, "message": "verify() з ПРАВИЛЬНИМ вмістом і хешем має дати True."}\nelif verify("tampered data", checksum("original data")) != False:\n    __result__ = {"pass": False, "message": "verify() зі ЗМІНЕНИМ вмістом має дати False."}\nelse:\n    __result__ = {"pass": True, "message": "Checksum виявляє НАЙМЕНШУ зміну вмісту — основа перевірки цілісності файлів і завантажень."}`,
  },
  {
    id: "py-security-14",
    title: "Виявлення підробленого файлу на диску",
    type: "python",
    theory:
      "Застосуємо checksum() до РЕАЛЬНОГО файлу: збережи контрольну суму ПІД ЧАС створення файлу, а потім, перед використанням, перерахуй її й порівняй — якщо файл підмінили (навіть непомітно для ока), хеші НЕ збіжаться:\n\nwith open(\"protected_file.txt\", \"w\") as f:\n    f.write(\"important config: debug=false\")\nwith open(\"protected_file.txt\") as f:\n    original_checksum = checksum(f.read())\n\n# ... файл підмінили ...\nwith open(\"protected_file.txt\", \"w\") as f:\n    f.write(\"important config: debug=true\")\n\nwith open(\"protected_file.txt\") as f:\n    new_checksum = checksum(f.read())\n\nprint(original_checksum == new_checksum)",
    examples: [
      { title: "Виявлення підміни файлу на диску", code: `import hashlib\n\ndef checksum(content):\n    return hashlib.sha256(content.encode()).hexdigest()\n\nwith open("protected_file.txt", "w") as f:\n    f.write("important config: debug=false")\nwith open("protected_file.txt") as f:\n    original_checksum = checksum(f.read())\n\nwith open("protected_file.txt", "w") as f:\n    f.write("important config: debug=true")\nwith open("protected_file.txt") as f:\n    new_checksum = checksum(f.read())\n\nprint(original_checksum == new_checksum)`, explain: "False — навіть зміна одного слова (false → true) повністю змінює checksum, підміну виявлено." },
    ],
    task: `Дано checksum() (в starter). Створи "protected_file.txt" з текстом "important config: debug=false", порахуй original_checksum. Перепиши файл текстом "important config: debug=true", порахуй new_checksum. Виведи, чи вони однакові.`,
    starter: `import hashlib\n\ndef checksum(content):\n    return hashlib.sha256(content.encode()).hexdigest()\n\n# with open("protected_file.txt", "w") as f:\n#     f.write("important config: debug=false")\n# with open("protected_file.txt") as f:\n#     original_checksum = checksum(f.read())\n\n# with open("protected_file.txt", "w") as f:\n#     f.write("important config: debug=true")\n# with open("protected_file.txt") as f:\n#     new_checksum = checksum(f.read())\n\n# print(original_checksum == new_checksum)\n`,
    hints: [`with open("protected_file.txt", "w") as f: f.write(...) — записує файл.`, `Прочитай файл через with open(...) as f: checksum(f.read()) ПІСЛЯ кожного запису.`, `with open("protected_file.txt", "w") as f:\n    f.write("important config: debug=false")\nwith open("protected_file.txt") as f:\n    original_checksum = checksum(f.read())\n\nwith open("protected_file.txt", "w") as f:\n    f.write("important config: debug=true")\nwith open("protected_file.txt") as f:\n    new_checksum = checksum(f.read())\n\nprint(original_checksum == new_checksum)`],
    solution: `import hashlib\n\ndef checksum(content):\n    return hashlib.sha256(content.encode()).hexdigest()\n\nwith open("protected_file.txt", "w") as f:\n    f.write("important config: debug=false")\nwith open("protected_file.txt") as f:\n    original_checksum = checksum(f.read())\n\nwith open("protected_file.txt", "w") as f:\n    f.write("important config: debug=true")\nwith open("protected_file.txt") as f:\n    new_checksum = checksum(f.read())\n\nprint(original_checksum == new_checksum)`,
    testCode: `import os\nif not os.path.exists("protected_file.txt"):\n    __result__ = {"pass": False, "message": "Файл protected_file.txt має бути створений."}\nelif "original_checksum" not in globals() or "new_checksum" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні змінні original_checksum і new_checksum."}\nelif original_checksum == new_checksum:\n    __result__ = {"pass": False, "message": "Змінений вміст файлу має дати ІНШИЙ checksum."}\nelif not any("False" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи порівняння — має бути False (підміну виявлено)."}\nelse:\n    __result__ = {"pass": True, "message": "Checksum виявив підміну файлу на диску — так антивіруси й системи цілісності перевіряють важливі файли."}`,
  },
  {
    id: "py-security-15",
    title: "Обмеження спроб входу (lockout)",
    type: "python",
    theory:
      "Без обмежень зловмисник може перебирати паролі НЕСКІНЧЕННО. Захист — рахувати невдалі спроби для кожного користувача й блокувати після певної кількості:\n\nattempts = {}\n\ndef record_failed_attempt(username):\n    attempts[username] = attempts.get(username, 0) + 1\n\ndef is_locked_out(username, max_attempts=3):\n    return attempts.get(username, 0) >= max_attempts\n\nfor _ in range(3):\n    record_failed_attempt(\"alice\")\n\nprint(is_locked_out(\"alice\"))\nprint(is_locked_out(\"bob\"))",
    examples: [
      { title: "Блокування після 3 невдалих спроб", code: `attempts = {}\n\ndef record_failed_attempt(username):\n    attempts[username] = attempts.get(username, 0) + 1\n\ndef is_locked_out(username, max_attempts=3):\n    return attempts.get(username, 0) >= max_attempts\n\nfor _ in range(3):\n    record_failed_attempt("alice")\n\nprint(is_locked_out("alice"))\nprint(is_locked_out("bob"))`, explain: "alice заблокована після 3 невдалих спроб (True), bob — жодної спроби, не заблокований (False)." },
    ],
    task: `Напиши record_failed_attempt(username) і is_locked_out(username, max_attempts=3). Зроби 3 невдалі спроби для "alice". Виведи is_locked_out("alice") і is_locked_out("bob").`,
    starter: `attempts = {}\n\ndef record_failed_attempt(username):\n    # твій код тут\n    pass\n\ndef is_locked_out(username, max_attempts=3):\n    # твій код тут\n    pass\n\n# for _ in range(3):\n#     record_failed_attempt("alice")\n\n# print(is_locked_out("alice"))\n# print(is_locked_out("bob"))\n`,
    hints: [`attempts.get(username, 0) + 1 — збільшує лічильник, починаючи з 0, якщо користувача ще немає.`, `is_locked_out: return attempts.get(username, 0) >= max_attempts`, `def record_failed_attempt(username):\n    attempts[username] = attempts.get(username, 0) + 1\n\ndef is_locked_out(username, max_attempts=3):\n    return attempts.get(username, 0) >= max_attempts`],
    solution: `attempts = {}\n\ndef record_failed_attempt(username):\n    attempts[username] = attempts.get(username, 0) + 1\n\ndef is_locked_out(username, max_attempts=3):\n    return attempts.get(username, 0) >= max_attempts\n\nfor _ in range(3):\n    record_failed_attempt("alice")\n\nprint(is_locked_out("alice"))\nprint(is_locked_out("bob"))`,
    testCode: `if "record_failed_attempt" not in globals() or "is_locked_out" not in globals():\n    __result__ = {"pass": False, "message": "Потрібні функції record_failed_attempt(username) і is_locked_out(username, max_attempts=3)."}\nelif is_locked_out("alice") != True:\n    __result__ = {"pass": False, "message": "alice після 3 невдалих спроб має бути заблокована (True)."}\nelif is_locked_out("bob") != False:\n    __result__ = {"pass": False, "message": "bob без жодної спроби НЕ має бути заблокований (False)."}\nelse:\n    __result__ = {"pass": True, "message": "Обмеження спроб — простий, але ефективний захист від перебору пароля навпростець."}`,
  },
  {
    id: "py-security-16",
    title: "Маскування чутливих даних",
    type: "python",
    theory:
      "Коли треба ПОКАЗАТИ, що номер картки чи телефону збережений, але НЕ розкривати його повністю (у логах, квитанціях, інтерфейсі), використовують маскування — приховують усе, крім останніх кількох символів:\n\ndef mask_card(number):\n    return \"*\" * (len(number) - 4) + number[-4:]\n\nprint(mask_card(\"4111111111111111\"))\n\nnumber[-4:] бере ОСТАННІ 4 символи (зріз з від'ємним індексом), а \"*\" * (len(number) - 4) генерує потрібну кількість зірочок.",
    examples: [
      { title: "mask_card() — приховує все, крім останніх 4 цифр", code: `def mask_card(number):\n    return "*" * (len(number) - 4) + number[-4:]\n\nprint(mask_card("4111111111111111"))`, explain: "16-значний номер картки стає 12 зірочками й останніми 4 реальними цифрами." },
    ],
    task: `Напиши mask_card(number). Виведи mask_card("4111111111111111").`,
    starter: `def mask_card(number):\n    # твій код тут\n    pass\n\n# print(mask_card("4111111111111111"))\n`,
    hints: [`number[-4:] — останні 4 символи рядка (зріз з кінця).`, `"*" * (len(number) - 4) — потрібна кількість зірочок перед ними.`, `def mask_card(number):\n    return "*" * (len(number) - 4) + number[-4:]\n\nprint(mask_card("4111111111111111"))`],
    solution: `def mask_card(number):\n    return "*" * (len(number) - 4) + number[-4:]\n\nprint(mask_card("4111111111111111"))`,
    testCode: `if "mask_card" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція mask_card(number)."}\nelif mask_card("4111111111111111") != "************1111":\n    __result__ = {"pass": False, "message": "mask_card('4111111111111111') має дати '************1111'."}\nelse:\n    __result__ = {"pass": True, "message": "Маскування показує, що дані існують, не розкриваючи їх повністю — стандарт для чутливої інформації в логах."}`,
  },
  {
    id: "py-security-17",
    title: "Проста система дозволів (permissions)",
    type: "python",
    theory:
      "Контроль доступу (access control) визначає, ХТО що МОЖЕ робити. Проста реалізація — словник, де кожна роль має набір дозволених дій:\n\nROLES = {\n    \"admin\": {\"read\", \"write\", \"delete\"},\n    \"user\": {\"read\"},\n}\n\ndef has_permission(role, action):\n    return action in ROLES.get(role, set())\n\nprint(has_permission(\"admin\", \"delete\"))\nprint(has_permission(\"user\", \"delete\"))\n\nROLES.get(role, set()) повертає ПОРОЖНЮ множину для невідомої ролі — action in set() завжди дає False, тому невідома роль безпечно не має ЖОДНИХ прав.",
    examples: [
      { title: "has_permission() — перевірка ролі", code: `ROLES = {\n    "admin": {"read", "write", "delete"},\n    "user": {"read"},\n}\n\ndef has_permission(role, action):\n    return action in ROLES.get(role, set())\n\nprint(has_permission("admin", "delete"))\nprint(has_permission("user", "delete"))\nprint(has_permission("guest", "read"))`, explain: "admin може видаляти (True), user — ні (False), а невідома роль «guest» взагалі не має прав (False)." },
    ],
    task: `Дано ROLES. Напиши has_permission(role, action). Виведи has_permission("admin", "delete") і has_permission("user", "delete").`,
    starter: `ROLES = {\n    "admin": {"read", "write", "delete"},\n    "user": {"read"},\n}\n\ndef has_permission(role, action):\n    # твій код тут\n    pass\n\n# print(has_permission("admin", "delete"))\n# print(has_permission("user", "delete"))\n`,
    hints: [`ROLES.get(role, set()) — набір дозволів ролі, або порожній набір, якщо роль невідома.`, `return action in ROLES.get(role, set())`, `def has_permission(role, action):\n    return action in ROLES.get(role, set())\n\nprint(has_permission("admin", "delete"))\nprint(has_permission("user", "delete"))`],
    solution: `ROLES = {\n    "admin": {"read", "write", "delete"},\n    "user": {"read"},\n}\n\ndef has_permission(role, action):\n    return action in ROLES.get(role, set())\n\nprint(has_permission("admin", "delete"))\nprint(has_permission("user", "delete"))`,
    testCode: `if "has_permission" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція has_permission(role, action)."}\nelif has_permission("admin", "delete") != True:\n    __result__ = {"pass": False, "message": "has_permission('admin', 'delete') має бути True."}\nelif has_permission("user", "delete") != False:\n    __result__ = {"pass": False, "message": "has_permission('user', 'delete') має бути False."}\nelif has_permission("guest", "read") != False:\n    __result__ = {"pass": False, "message": "Невідома роль 'guest' не повинна мати ЖОДНИХ прав."}\nelse:\n    __result__ = {"pass": True, "message": "Контроль доступу за ролями — принцип найменших привілеїв: кожен отримує лише те, що дійсно потрібно."}`,
  },
  {
    id: "py-security-18",
    title: "Логування підозрілої активності",
    type: "python",
    theory:
      "Найкращий захист марний, якщо про атаку ніхто не дізнається. Журнал безпеки (security log) записує ПОДІЇ (не паролі й не чутливі дані!) для подальшого розслідування:\n\nlog = []\n\ndef log_event(event_type, detail):\n    log.append(f\"[{event_type}] {detail}\")\n\nlog_event(\"ALERT\", \"Failed login for bob (3rd attempt)\")\nlog_event(\"INFO\", \"Successful login for alice\")\n\nfor entry in log:\n    print(entry)\n\nВАЖЛИВО: у журнал НІКОЛИ не записують самі паролі чи повні номери карток — лише факт події (хто, коли, що сталося).",
    examples: [
      { title: "log_event() — журнал безпеки", code: `log = []\n\ndef log_event(event_type, detail):\n    log.append(f"[{event_type}] {detail}")\n\nlog_event("ALERT", "Failed login for bob (3rd attempt)")\nlog_event("INFO", "Successful login for alice")\n\nfor entry in log:\n    print(entry)`, explain: "Журнал зберігає ФАКТ події («Failed login for bob»), а НЕ сам пароль, який bob невдало ввів." },
    ],
    task: `Напиши log_event(event_type, detail), що додає рядок у log. Запиши подію "ALERT" з деталями "Failed login for bob (3rd attempt)". Виведи весь журнал.`,
    starter: `log = []\n\ndef log_event(event_type, detail):\n    # твій код тут\n    pass\n\n# log_event("ALERT", "Failed login for bob (3rd attempt)")\n# for entry in log:\n#     print(entry)\n`,
    hints: [`f"[{event_type}] {detail}" формує рядок журналу.`, `log.append(...) додає рядок у список.`, `def log_event(event_type, detail):\n    log.append(f"[{event_type}] {detail}")\n\nlog_event("ALERT", "Failed login for bob (3rd attempt)")\nfor entry in log:\n    print(entry)`],
    solution: `log = []\n\ndef log_event(event_type, detail):\n    log.append(f"[{event_type}] {detail}")\n\nlog_event("ALERT", "Failed login for bob (3rd attempt)")\nfor entry in log:\n    print(entry)`,
    testCode: `if "log_event" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція log_event(event_type, detail)."}\nelif not log or "ALERT" not in log[0] or "bob" not in log[0]:\n    __result__ = {"pass": False, "message": "log має містити запис з 'ALERT' і 'bob'."}\nelif not any("ALERT" in l and "bob" in l for l in __logs):\n    __result__ = {"pass": False, "message": "Виведи журнал через print() для кожного запису."}\nelse:\n    __result__ = {"pass": True, "message": "Журнал безпеки записує ПОДІЇ, а не чутливі дані — основа для виявлення атак постфактум."}`,
  },
  {
    id: "py-security-19",
    title: "Аудит паролів користувачів",
    type: "python",
    theory:
      "Об'єднай password_strength() і is_common() в один інструмент, що перевіряє ВСІХ користувачів системи й знаходить тих, чий пароль СЛАБКИЙ (низький бал АБО поширений):\n\ndef audit_passwords(users):\n    weak = []\n    for u in users:\n        if password_strength(u[\"password\"]) < 3 or is_common(u[\"password\"]):\n            weak.append(u[\"username\"])\n    return weak\n\nprint(audit_passwords(users))\n\nТака перевірка запускається адміністратором ПЕРІОДИЧНО — знайдені користувачі отримують запит змінити пароль.",
    examples: [
      { title: "audit_passwords() — звіт про слабкі паролі", code: `def password_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if any(c.isupper() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*" for c in password):\n        score += 1\n    return score\n\nCOMMON_PASSWORDS = {"123456", "password", "qwerty", "111111", "abc123"}\n\ndef is_common(password):\n    return password.lower() in COMMON_PASSWORDS\n\nusers = [\n    {"username": "alice", "password": "Password1!"},\n    {"username": "bob", "password": "123456"},\n    {"username": "carol", "password": "qwerty"},\n    {"username": "dave", "password": "Str0ng&Pass"},\n]\n\ndef audit_passwords(users):\n    weak = []\n    for u in users:\n        if password_strength(u["password"]) < 3 or is_common(u["password"]):\n            weak.append(u["username"])\n    return weak\n\nprint(audit_passwords(users))`, explain: "['bob', 'carol'] — обидва мають поширені паролі, тоді як alice і dave мають достатньо складні (не потрапляють у звіт)." },
    ],
    task: `Дано password_strength(), is_common(), users (в starter). Напиши audit_passwords(users), що повертає список username зі слабким паролем. Виведи результат.`,
    starter: `def password_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if any(c.isupper() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*" for c in password):\n        score += 1\n    return score\n\nCOMMON_PASSWORDS = {"123456", "password", "qwerty", "111111", "abc123"}\n\ndef is_common(password):\n    return password.lower() in COMMON_PASSWORDS\n\nusers = [\n    {"username": "alice", "password": "Password1!"},\n    {"username": "bob", "password": "123456"},\n    {"username": "carol", "password": "qwerty"},\n    {"username": "dave", "password": "Str0ng&Pass"},\n]\n\ndef audit_passwords(users):\n    # твій код тут\n    pass\n\n# print(audit_passwords(users))\n`,
    hints: [`Для кожного u в users: перевір password_strength(u["password"]) < 3 or is_common(u["password"])`, `Якщо умова True — додай u["username"] у weak.`, `def audit_passwords(users):\n    weak = []\n    for u in users:\n        if password_strength(u["password"]) < 3 or is_common(u["password"]):\n            weak.append(u["username"])\n    return weak\n\nprint(audit_passwords(users))`],
    solution: `def password_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if any(c.isupper() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*" for c in password):\n        score += 1\n    return score\n\nCOMMON_PASSWORDS = {"123456", "password", "qwerty", "111111", "abc123"}\n\ndef is_common(password):\n    return password.lower() in COMMON_PASSWORDS\n\nusers = [\n    {"username": "alice", "password": "Password1!"},\n    {"username": "bob", "password": "123456"},\n    {"username": "carol", "password": "qwerty"},\n    {"username": "dave", "password": "Str0ng&Pass"},\n]\n\ndef audit_passwords(users):\n    weak = []\n    for u in users:\n        if password_strength(u["password"]) < 3 or is_common(u["password"]):\n            weak.append(u["username"])\n    return weak\n\nprint(audit_passwords(users))`,
    testCode: `if "audit_passwords" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція audit_passwords(users)."}\nelif audit_passwords(users) != ["bob", "carol"]:\n    __result__ = {"pass": False, "message": "audit_passwords(users) має повернути ['bob', 'carol']."}\nelse:\n    __result__ = {"pass": True, "message": "Аудит паролів об'єднує обидві перевірки в один звіт, готовий для адміністратора системи."}`,
  },
  {
    id: "py-security-20",
    title: "Фінальний проєкт: інструментарій безпеки паролів",
    type: "python",
    theory:
      "Останній крок — зібрати ВСЕ з 20 уроків у password_security_toolkit.py: оцінка складності, перевірка на поширеність, хешування з сіллю, перевірка цілісності через checksum, і повний аудит користувачів. Це і є інструментарій, обіцяний ще на вступній сторінці «Що це?».\n\nУсі ці прийоми — password_strength, is_common, hash_with_salt, checksum — застосовуються в РЕАЛЬНИХ системах щодня: кожен сайт, що просить «придумати складніший пароль», кожна база даних, що зберігає паролі з сіллю, кожен антивірус, що перевіряє checksum файлів, — усе це варіації того самого коду з цих 20 уроків.",
    examples: [
      { title: "Повний інструментарій безпеки", code: `def audit_and_secure(users):\n    report = []\n    for u in users:\n        weak = password_strength(u["password"]) < 3 or is_common(u["password"])\n        salt = "fixed_demo_salt"\n        hashed = hash_with_salt(u["password"], salt)\n        report.append({"username": u["username"], "weak": weak, "hash": hashed[:8] + "..."})\n    return report\n\nfor entry in audit_and_secure(users):\n    print(entry["username"], entry["weak"], entry["hash"])`, explain: "Кожен користувач отримує оцінку (слабкий пароль чи ні) і безпечно хешований пароль замість сирого тексту." },
    ],
    task: `Дано password_strength(), is_common(), hash_with_salt(), users (в starter). Напиши audit_and_secure(users), що для кожного користувача повертає словник {"username", "weak", "hash"} (hash — перші 8 символів солоного хешу + "..."). Виведи username, weak і hash кожного запису.`,
    starter: `import hashlib\n\ndef password_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if any(c.isupper() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*" for c in password):\n        score += 1\n    return score\n\nCOMMON_PASSWORDS = {"123456", "password", "qwerty", "111111", "abc123"}\n\ndef is_common(password):\n    return password.lower() in COMMON_PASSWORDS\n\ndef hash_with_salt(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nusers = [\n    {"username": "alice", "password": "Password1!"},\n    {"username": "bob", "password": "123456"},\n]\n\ndef audit_and_secure(users):\n    # твій код тут\n    pass\n\n# for entry in audit_and_secure(users):\n#     print(entry["username"], entry["weak"], entry["hash"])\n`,
    hints: [`Для кожного u: weak = password_strength(u["password"]) < 3 or is_common(u["password"])`, `hashed = hash_with_salt(u["password"], "fixed_demo_salt"); додай {"username": u["username"], "weak": weak, "hash": hashed[:8] + "..."} у report`, `def audit_and_secure(users):\n    report = []\n    for u in users:\n        weak = password_strength(u["password"]) < 3 or is_common(u["password"])\n        salt = "fixed_demo_salt"\n        hashed = hash_with_salt(u["password"], salt)\n        report.append({"username": u["username"], "weak": weak, "hash": hashed[:8] + "..."})\n    return report`],
    solution: `import hashlib\n\ndef password_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if any(c.isupper() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*" for c in password):\n        score += 1\n    return score\n\nCOMMON_PASSWORDS = {"123456", "password", "qwerty", "111111", "abc123"}\n\ndef is_common(password):\n    return password.lower() in COMMON_PASSWORDS\n\ndef hash_with_salt(password, salt):\n    return hashlib.sha256((salt + password).encode()).hexdigest()\n\nusers = [\n    {"username": "alice", "password": "Password1!"},\n    {"username": "bob", "password": "123456"},\n]\n\ndef audit_and_secure(users):\n    report = []\n    for u in users:\n        weak = password_strength(u["password"]) < 3 or is_common(u["password"])\n        salt = "fixed_demo_salt"\n        hashed = hash_with_salt(u["password"], salt)\n        report.append({"username": u["username"], "weak": weak, "hash": hashed[:8] + "..."})\n    return report\n\nfor entry in audit_and_secure(users):\n    print(entry["username"], entry["weak"], entry["hash"])`,
    testCode: `if "audit_and_secure" not in globals():\n    __result__ = {"pass": False, "message": "Потрібна функція audit_and_secure(users)."}\nelse:\n    report = audit_and_secure(users)\n    if len(report) != 2 or report[0]["username"] != "alice" or report[0]["weak"] != False:\n        __result__ = {"pass": False, "message": "report[0] має бути для alice з weak=False."}\n    elif report[1]["weak"] != True:\n        __result__ = {"pass": False, "message": "report[1] (bob, пароль '123456') має мати weak=True."}\n    elif not report[0]["hash"].endswith("..."):\n        __result__ = {"pass": False, "message": "hash має закінчуватись на '...' (обрізаний для показу)."}\n    else:\n        __result__ = {"pass": True, "message": "Готово! Оцінка складності, хешування з сіллю й аудит — усе разом захищає паролі так, як роблять реальні системи."}`,
    finalProject: {
      techs: ["Python 3", "hashlib", "secrets", "list/dict comprehension"],
      skills: [
        "Оцінка складності паролів і виявлення поширених/скомпрометованих паролів",
        "Класичні шифри (Цезар, XOR) для розуміння ідеї шифрування",
        "Хешування з сіллю та розуміння, чому це зупиняє атаки по словнику",
        "Розпізнавання й санітизація підозрілих вхідних даних (SQL-ін'єкції)",
        "Перевірка цілісності файлів через checksum",
        "Контроль доступу за ролями, обмеження спроб входу, журналювання подій",
      ],
      structure:
        "password_security_toolkit.py\n  ├── password_strength(password)   # бальна оцінка складності\n  ├── is_common(password)             # перевірка проти чорного списку\n  ├── hash_with_salt(password, salt)   # безпечне зберігання\n  ├── checksum(content) / verify(...)   # цілісність файлів\n  └── audit_passwords(users)              # звіт для адміністратора",
      code: `import hashlib
import secrets


COMMON_PASSWORDS = {"123456", "password", "qwerty", "111111", "abc123"}


def password_strength(password):
    score = 0
    if len(password) >= 8:
        score += 1
    if any(c.isupper() for c in password):
        score += 1
    if any(c.isdigit() for c in password):
        score += 1
    if any(c in "!@#$%^&*" for c in password):
        score += 1
    return score


def is_common(password):
    return password.lower() in COMMON_PASSWORDS


def hash_with_salt(password, salt=None):
    salt = salt or secrets.token_hex(8)
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return salt, hashed


def verify_password(password, salt, expected_hash):
    return hashlib.sha256((salt + password).encode()).hexdigest() == expected_hash


def checksum(content):
    return hashlib.sha256(content.encode()).hexdigest()


def looks_malicious(input_str):
    dangerous = ["'", "--", ";", " OR ", " or "]
    return any(d in input_str for d in dangerous)


def audit_passwords(users):
    weak = []
    for u in users:
        if password_strength(u["password"]) < 3 or is_common(u["password"]):
            weak.append(u["username"])
    return weak


if __name__ == "__main__":
    users = [
        {"username": "alice", "password": "Password1!"},
        {"username": "bob", "password": "123456"},
        {"username": "carol", "password": "qwerty"},
        {"username": "dave", "password": "Str0ng&Pass"},
    ]

    print("Слабкі паролі:", audit_passwords(users))

    for u in users:
        salt, hashed = hash_with_salt(u["password"])
        print(f"{u['username']}: salt={salt[:8]}..., hash={hashed[:8]}...")
        assert verify_password(u["password"], salt, hashed)

    print(looks_malicious("admin' OR '1'='1"))`,
      runCommand: "python password_security_toolkit.py",
      installGuide: {
        intro:
          "hashlib і secrets вбудовані в реальний Python — нічого встановлювати не потрібно, щоб запустити ЦЕЙ код локально. Для продакшн-систем варто перейти на bcrypt чи argon2 замість «голого» SHA-256 із сіллю.",
        steps: [
          {
            title: "1. Встанови Python (якщо ще не встановлений)",
            text: "Зайди на python.org/downloads і встанови останню версію. Windows: галочка «Add python.exe to PATH».",
            code: null,
          },
          {
            title: "2. (Продакшн) встанови bcrypt замість ручного SHA-256+сіль",
            text: "bcrypt робить хешування НАВМИСНО повільним (тисячі внутрішніх раундів), що робить перебір непрактичним:",
            code: "pip install bcrypt",
          },
          {
            title: "3. Порівняй: той самий принцип на bcrypt",
            text:
              "bcrypt.hashpw() автоматично генерує й зберігає сіль ВСЕРЕДИНІ самого хешу — не потрібно зберігати її окремо.",
            code: `import bcrypt

hashed = bcrypt.hashpw(b"Password1!", bcrypt.gensalt())
print(bcrypt.checkpw(b"Password1!", hashed))`,
          },
          {
            title: "4. Запусти скрипт",
            text: "Обидва варіанти (навчальний SHA-256+сіль чи продакшн bcrypt) демонструють той самий принцип захисту.",
            code: "python password_security_toolkit.py",
          },
        ],
      },
      improvements: [
        "Перейти на bcrypt/argon2 у продакшні — навмисно повільні алгоритми, стійкіші до перебору",
        "Додати двофакторну автентифікацію (2FA) поверх паролів",
        "Використовувати параметризовані SQL-запити замість ручної санітизації рядків",
        "Додати справжнє журналювання у файл з ротацією (модуль logging)",
      ],
      nextLevel:
        "Далі — 🧪 Science & Research: ті самі навички точних обчислень і уваги до деталей застосовуються для наукового моделювання й аналізу експериментальних даних.",
    },
  },
];
