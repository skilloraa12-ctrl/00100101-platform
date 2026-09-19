// TypeScript — the one non-Python direction whose code runs for REAL in the
// browser rather than being pattern-matched: learner code is fed through the
// actual TypeScript compiler (self-hosted at /typescript/typescript.js, with
// its own bundled lib.*.d.ts files at /typescript/lib-files.json) via a
// virtual in-memory CompilerHost — see runTypeScriptCheck in App.jsx. This
// gives REAL semantic type errors (not just syntax stripping), exactly the
// way TypeScript actually behaves in an editor or `tsc`. Once a submission
// type-checks cleanly, the compiled JS runs in the same sandboxed-iframe
// mechanism the JS course already uses (buildJsSandboxDoc + testCode).
// Structure: an "intro" lesson, then 20 "ts" lessons building step by step
// toward one cumulative project — a typed in-memory task manager module.
export const TYPESCRIPT_LESSONS = [
  {
    id: "ts-intro",
    title: "Що це? — TypeScript",
    type: "intro",
    theory:
      "TypeScript — це JavaScript із доданою системою типів. Будь-який чинний JS-код є водночас чинним TS-кодом — TypeScript нічого не забирає, він лише ДОДАЄ можливість написати, яким саме має бути значення (число, рядок, масив рядків, об'єкт з конкретними полями), а компілятор перевіряє це ще ДО запуску коду, просто під час набору тексту чи збірки проєкту.\n\nГоловна практична причина, чому TypeScript став стандартом у великих JS-проєктах (React, Vue, Angular, Node.js-бекенди): у звичайному JS помилка на кшталт «очікував рядок, отримав undefined» виявляється лише в РАНТАЙМІ — коли код уже виконується, часто на продакшені, коли користувач щось клікнув. У TypeScript та сама помилка підсвічується в редакторі МИТТЄВО, ще до збереження файлу — тип «розходиться» видно одразу, а не через збій програми хвилинами чи днями пізніше.\n\nВажливо розуміти, ЩО саме тут відбувається технічно: TypeScript-файл (.ts) ПЕРЕВІРЯЄТЬСЯ компілятором на відповідність типів, а потім типи просто ВИДАЛЯЮТЬСЯ — і виходить звичайний JavaScript, який виконує браузер чи Node.js. Типи не існують під час виконання, вони існують лише під час розробки — це «шар безпеки», що зникає, щойно код скомпільовано. Саме тому в цьому курсі кожне завдання спочатку РЕАЛЬНО перевіряється компілятором TypeScript (той самий tsc, що працює в кожному TS-проєкті), а вже потім скомпільований JS виконується і перевіряється на поведінку — так само, як насправді працює цей інструмент.\n\nЩо ти отримаєш після 20 уроків: впевнене читання й написання типізованого коду — інтерфейси, класи з типами, generics (узагальнені типи), typed union/intersection — і завершений проєкт: типізований модуль Task Manager, зібраний поступово, урок за уроком.",
    presentation: [
      { title: "TypeScript коротко", points: ["Надмножина JavaScript: увесь чинний JS — це чинний TS", "Додає систему типів, яка перевіряється ДО запуску коду", "Типи видаляються під час компіляції — на виході чистий JS"] },
      { title: "Навіщо це компаніям", points: ["Помилки типів видно в редакторі одразу, а не в рантаймі на продакшені", "Величезні кодові бази (React, Vue, Angular, Node-бекенди) стандартно на TS", "Тут код реально перевіряється справжнім компілятором TypeScript, не імітацією"] },
    ],
  },
  {
    id: "ts-1",
    title: "Перші типи: string, number, boolean",
    type: "ts",
    theory:
      "У JavaScript тип змінної визначається лише її значенням у момент виконання. У TypeScript тип можна вказати ЯВНО одразу після імені змінної через двокрапку: let age: number = 16. Тепер, якщо десь у коді нижче написати age = \"шістнадцять\" (рядок замість числа), компілятор одразу покаже помилку — ще до запуску коду.\n\nТри найпростіші вбудовані типи: string (текст у лапках), number (будь-яке число — і ціле, і дробове, на відміну від деяких мов тут немає окремого int/float), boolean (true або false). Це саме ті типи, що вже існують у JS як typeof-значення — TypeScript просто дозволяє ЗАЯВИТИ їх заздалегідь, а не здогадуватись за фактом.\n\nЯкщо змінну одразу ІНІЦІАЛІЗУВАТИ значенням, TypeScript часто здатний сам визначити тип без явної анотації — це називається виведення типів (type inference): let userName = \"Ольга\" TypeScript і без двокрапки зрозуміє, що userName має бути string, і так само підсвітить помилку при спробі присвоїти туди число. Явну анотацію (: type) найчастіше пишуть там, де значення ще не відоме одразу, або для параметрів функцій (про це — за два уроки).",
    examples: [
      { title: "Явні анотації типів", code: `let userName: string = "Ольга";\nlet age: number = 16;\nlet isStudent: boolean = true;`, explain: "Двокрапка після імені змінної й перед значенням — ось і вся синтаксична різниця з JS." },
      { title: "Помилка типу — компілятор ловить одразу", code: `let age: number = 16;\nage = "шістнадцять"; // Помилка: Type 'string' is not assignable to type 'number'.`, explain: "Це саме та помилка, яку TypeScript показує ще ДО запуску коду — на відміну від звичайного JS, де це просто мовчки «спрацювало б» неправильно." },
    ],
    task: 'Створи змінну userName типу string зі своїм ім\'ям, змінну age типу number зі своїм віком, і змінну isStudent типу boolean. Виведи всі три через console.log.',
    starter: `let userName: string = ...;\nlet age: number = ...;\nlet isStudent: boolean = ...;\n\n// console.log(userName, age, isStudent);\n`,
    hints: [
      "Двокрапка й тип пишуться одразу після імені змінної, перед знаком =.",
      "Рядок — у лапках, число — без лапок, boolean — true чи false без лапок.",
      `let userName: string = "Ольга";\nlet age: number = 16;\nlet isStudent: boolean = true;\n\nconsole.log(userName, age, isStudent);`,
    ],
    solution: `let userName: string = "Ольга";\nlet age: number = 16;\nlet isStudent: boolean = true;\n\nconsole.log(userName, age, isStudent);`,
    testCode: `if (typeof userName !== 'string' || !userName) return {pass:false, message:"userName має бути непорожнім рядком."};\nif (typeof age !== 'number') return {pass:false, message:"age має бути числом."};\nif (typeof isStudent !== 'boolean') return {pass:false, message:"isStudent має бути true або false."};\nreturn {pass:true, message:"Три базові типи — string, number, boolean — фундамент, на якому побудовано все інше в TypeScript."};`,
  },
  {
    id: "ts-2",
    title: "Масиви та кортежі (tuple)",
    type: "ts",
    theory:
      "Тип масиву в TypeScript пишеться як тип-елемента[] : let names: string[] = [\"Ана\", \"Богдан\"] — масив, що може містити ЛИШЕ рядки. Спроба зробити names.push(42) одразу підсвітиться помилкою: число не є рядком. Так само number[] — масив лише чисел, boolean[] — масив лише true/false.\n\nІснує також запис Array<string> (той самий сенс, інший синтаксис, з кутовими дужками — цей стиль ще знадобиться пізніше для generics). Обидва записи взаємозамінні, string[] просто коротший і частіше зустрічається на практиці.\n\nКортеж (tuple) — це масив ФІКСОВАНОЇ довжини, де тип КОЖНОЇ позиції заданий окремо: let point: [number, number] = [10, 20] — рівно два числа, перше й друге. На відміну від звичайного number[] (будь-яка кількість чисел), tuple точно каже: «тут завжди рівно два елементи, і обидва — числа». Типовий приклад — пара [ключ, значення] або [ширина, висота].",
    examples: [
      { title: "Типізований масив", code: `let scores: number[] = [90, 85, 78];\nscores.push(100); // ок\n// scores.push("A"); // Помилка: рядок не число`, explain: "Масив number[] приймає лише числа — push зі значенням іншого типу одразу підсвічується компілятором." },
      { title: "Кортеж фіксованої довжини", code: `let point: [number, number] = [10, 20];\nlet entry: [string, number] = ["вік", 16];`, explain: "У кортежі важливий і ТИП, і ПОЗИЦІЯ кожного елемента — [number, number] не те саме, що [string, number]." },
    ],
    task: "Створи масив scores типу number[] з трьома числами. Створи кортеж point типу [number, number] з двома координатами. Виведи обидва через console.log.",
    starter: `let scores: number[] = ...;\nlet point: [number, number] = ...;\n\n// console.log(scores, point);\n`,
    hints: [
      "number[] — масив довільної довжини лише з чисел.",
      "[number, number] — рівно два числа в заданому порядку.",
      `let scores: number[] = [90, 85, 78];\nlet point: [number, number] = [10, 20];\n\nconsole.log(scores, point);`,
    ],
    solution: `let scores: number[] = [90, 85, 78];\nlet point: [number, number] = [10, 20];\n\nconsole.log(scores, point);`,
    testCode: `if (!Array.isArray(scores) || scores.length < 1 || !scores.every(s => typeof s === 'number')) return {pass:false, message:"scores має бути масивом чисел."};\nif (!Array.isArray(point) || point.length !== 2 || typeof point[0] !== 'number' || typeof point[1] !== 'number') return {pass:false, message:"point має бути кортежем із рівно двох чисел."};\nreturn {pass:true, message:"Масив (довільна довжина, один тип) і кортеж (фіксована довжина, тип на кожній позиції) — різні інструменти для різних задач."};`,
  },
  {
    id: "ts-3",
    title: "Функції: типи параметрів і повернення",
    type: "ts",
    theory:
      "Параметри функції можна (і варто) типізувати так само, як звичайні змінні: function add(a: number, b: number): number { return a + b; }. Тип ПІСЛЯ дужок параметрів (: number перед {) — це тип значення, яке функція ПОВЕРТАЄ. Якщо тіло функції поверне щось іншого типу (наприклад, рядок), компілятор одразу покаже помилку, навіть не запускаючи код.\n\nЯкщо викликати функцію з неправильною кількістю аргументів або аргументом неправильного типу — add(\"2\", 3) — це теж помилка типів, яку TypeScript ловить ДО виконання: у звичайному JS цей самий виклик мовчки виконався б і повернув рядок \"23\" замість очікуваного числа 5, і баг довелося б шукати значно пізніше.\n\nНеобов'язковий параметр позначається знаком питання ПІСЛЯ імені: function greet(name: string, title?: string). Якщо title не передати, його значення буде undefined — і TypeScript це враховує в типі (title має тип string | undefined всередині функції). Альтернатива — параметр за замовчуванням: function greet(name: string, title: string = \"друже\") — якщо title не передати, використається \"друже\", і жодного undefined не виникає взагалі.",
    examples: [
      { title: "Типізовані параметри й повернення", code: `function add(a: number, b: number): number {\n  return a + b;\n}\nconsole.log(add(2, 3));`, explain: "Обидва параметри — number, і повернене значення теж number. add(\"2\", 3) підсвітиться компілятором як помилка ще до запуску." },
      { title: "Необов'язковий і дефолтний параметри", code: `function greet(name: string, title: string = "друже"): string {\n  return \`Привіт, \${title} \${name}!\`;\n}\nconsole.log(greet("Іван"));\nconsole.log(greet("Іван", "пане"));`, explain: "Дефолтне значення title означає, що другий аргумент можна не передавати взагалі — TypeScript це дозволяє без знаку ?." },
    ],
    task: "Напиши функцію multiply(a: number, b: number): number, що повертає добуток. Виклич її з двома числами й виведи результат через console.log.",
    starter: `function multiply(a: number, b: number): number {\n  // твій код тут\n}\n\n// console.log(multiply(4, 5));\n`,
    hints: [
      "Тип повернення пишеться після дужок параметрів, перед фігурною дужкою тіла.",
      "return a * b;",
      `function multiply(a: number, b: number): number {\n  return a * b;\n}\n\nconsole.log(multiply(4, 5));`,
    ],
    solution: `function multiply(a: number, b: number): number {\n  return a * b;\n}\n\nconsole.log(multiply(4, 5));`,
    testCode: `if (typeof multiply !== 'function') return {pass:false, message:"Потрібна функція multiply."};\nif (multiply(4, 5) !== 20) return {pass:false, message:"multiply(4, 5) має повертати 20."};\nif (multiply(3, 0) !== 0) return {pass:false, message:"multiply(3, 0) має повертати 0."};\nreturn {pass:true, message:"Типи параметрів і повернення — перше, з чим стикаються в реальному TS-проєкті: кожна функція публічного API типізована саме так."};`,
  },
  {
    id: "ts-4",
    title: "Об'єктні типи: readonly та необов'язкові поля",
    type: "ts",
    theory:
      "Тип об'єкта можна описати прямо inline, у фігурних дужках: let user: { name: string; age: number } = { name: \"Ліза\", age: 20 }. Тепер спроба звернутись до user.email (поля, якого немає в описі типу) чи присвоїти user.age рядок — обидві помилки компілятор ловить одразу.\n\nЗнак питання після імені поля робить його НЕОБОВ'ЯЗКОВИМ: { name: string; nickname?: string } — об'єкт можна створити і без nickname, і TypeScript це дозволить. Але звертаючись до user.nickname, тип буде string | undefined — тому перед використанням (наприклад, nickname.toUpperCase()) варто спершу перевірити, що воно взагалі є, інакше компілятор попередить про можливий undefined.\n\nКлючове слово readonly ПЕРЕД іменем поля забороняє змінювати його ПІСЛЯ створення об'єкта: { readonly id: number; name: string } — id можна прочитати скільки завгодно, але user.id = 5 після створення об'єкта — помилка компіляції. Це корисно для значень, які не повинні змінюватись за задумом (ідентифікатори, дата створення) — і саме такий захист від випадкового переприсвоєння часто рятує від важко знаходжуваних багів.",
    examples: [
      { title: "Inline тип з необов'язковим полем", code: `let user: { name: string; nickname?: string } = { name: "Ліза" };\nconsole.log(user.nickname); // undefined, і це очікувано за типом`, explain: "nickname можна не передавати взагалі — знак ? у типі саме це й дозволяє." },
      { title: "readonly захищає від зміни", code: `let item: { readonly id: number; title: string } = { id: 1, title: "Книга" };\nitem.title = "Нова назва"; // ок\n// item.id = 2; // Помилка: Cannot assign to 'id' because it is a read-only property.`, explain: "readonly дозволяє прочитати id будь-де, але забороняє присвоєння після створення об'єкта." },
    ],
    task: "Створи змінну book типу { readonly id: number; title: string; pages?: number } зі значеннями id: 1, title: своя назва (pages можеш не вказувати). Виведи book через console.log.",
    starter: `let book: { readonly id: number; title: string; pages?: number } = ...;\n\n// console.log(book);\n`,
    hints: [
      "Об'єкт створюється як завжди — у фігурних дужках; readonly і ? стосуються лише опису ТИПУ, не самого значення.",
      "pages необов'язковий — його можна просто не писати у значенні.",
      `let book: { readonly id: number; title: string; pages?: number } = { id: 1, title: "Кобзар" };\n\nconsole.log(book);`,
    ],
    solution: `let book: { readonly id: number; title: string; pages?: number } = { id: 1, title: "Кобзар" };\n\nconsole.log(book);`,
    testCode: `if (typeof book !== 'object' || book === null) return {pass:false, message:"Потрібен об'єкт book."};\nif (typeof book.id !== 'number' || typeof book.title !== 'string' || !book.title) return {pass:false, message:"book має мати числове id і непорожній рядок title."};\nreturn {pass:true, message:"readonly і необов'язкові поля (?) — два найпоширеніші уточнення об'єктного типу в реальному коді."};`,
  },
  {
    id: "ts-5",
    title: "interface: іменований тип об'єкта",
    type: "ts",
    theory:
      "Замість того щоб щоразу писати inline-тип об'єкта в фігурних дужках, його можна ОГОЛОСИТИ один раз під іменем через interface: interface User { name: string; age: number }. Тепер User — це готовий тип, яким можна типізувати скільки завгодно змінних, параметрів функцій чи полів інших об'єктів: let u: User = { name: \"Ліза\", age: 20 }.\n\nІменований тип — це не просто скорочення запису. Коли інтерфейс змінюється (додається нове поле), TypeScript одразу покаже помилку в УСІХ місцях коду, де він використовується і де це нове поле не враховано — це і є головна цінність: одна зміна типу підсвічує ВСІ місця, які треба оновити, замість того щоб шукати їх вручну по всьому проєкту.\n\ninterface можна ВКЛАДАТИ одна в одну: interface Order { id: number; customer: User } — поле customer має тип User, тобто повторно використовує вже оголошений інтерфейс. Саме так у реальних проєктах описують складні структури даних — по одному невеликому інтерфейсу на кожну сутність, а потім комбінують їх разом.",
    examples: [
      { title: "Оголошення й використання interface", code: `interface User {\n  name: string;\n  age: number;\n}\n\nfunction describe(user: User): string {\n  return \`\${user.name}, \${user.age} років\`;\n}\n\nconsole.log(describe({ name: "Ліза", age: 20 }));`, explain: "User оголошено один раз і використано і для типу параметра функції describe, і для будь-якої іншої змінної цього типу." },
      { title: "Вкладені інтерфейси", code: `interface User {\n  name: string;\n}\ninterface Order {\n  id: number;\n  customer: User;\n}\nlet order: Order = { id: 1, customer: { name: "Богдан" } };`, explain: "Order.customer має тип User — інтерфейси комбінуються, а не дублюють опис полів." },
    ],
    task: "Оголоси interface Task з полями id (number), title (string), done (boolean). Створи змінну task типу Task і виведи її через console.log.",
    starter: `interface Task {\n  // твої поля тут\n}\n\nlet task: Task = ...;\n\n// console.log(task);\n`,
    hints: [
      "Кожне поле інтерфейсу пишеться на своєму рядку: ім'я, двокрапка, тип, крапка з комою чи перенос рядка.",
      "interface Task { id: number; title: string; done: boolean }",
      `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\nlet task: Task = { id: 1, title: "Купити хліб", done: false };\n\nconsole.log(task);`,
    ],
    solution: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\nlet task: Task = { id: 1, title: "Купити хліб", done: false };\n\nconsole.log(task);`,
    testCode: `if (typeof task !== 'object' || task === null) return {pass:false, message:"Потрібна змінна task."};\nif (typeof task.id !== 'number' || typeof task.title !== 'string' || typeof task.done !== 'boolean') return {pass:false, message:"task має мати id (number), title (string), done (boolean)."};\nreturn {pass:true, message:"interface Task — саме ця структура використовуватиметься у всіх наступних уроках цього курсу, аж до фінального проєкту."};`,
  },
  {
    id: "ts-6",
    title: "type та union-типи",
    type: "ts",
    theory:
      "type — це друга (окрім interface) конструкція для оголошення іменованого типу: type UserId = number дає імені UserId сенс «це число». На перший погляд схоже на interface, і для звичайних об'єктних типів (type User = { name: string }) вони справді часто взаємозамінні — але type може описувати НЕ ЛИШЕ об'єкти: примітиви, union-и, кортежі, функції.\n\nUnion-тип (об'єднання) через вертикальну риску | означає «значення одного з ЦИХ типів»: type Id = number | string — Id може бути або числом, або рядком, і більше нічим. Це особливо корисно для полів, значення яких обмежене конкретним набором варіантів: type Status = \"active\" | \"done\" | \"cancelled\" — тут перелічені не типи, а КОНКРЕТНІ рядкові значення (детальніше про такі literal types — наступний урок).\n\nГоловне практичне правило вибору: якщо потрібен саме ОБ'ЄКТНИЙ тип, і можливо доведеться його РОЗШИРЮВАТИ через extends в іншому місці — обирають interface. Якщо потрібен union, примітив чи складний складений тип — обирають type. Обидва варіанти лишаються лише під час розробки: після компіляції зникають однаково.",
    examples: [
      { title: "type для union", code: `type Id = number | string;\n\nfunction printId(id: Id): void {\n  console.log("ID:", id);\n}\nprintId(42);\nprintId("abc-123");`, explain: "Id приймає і число, і рядок — але спроба передати true (boolean) все одно буде помилкою: union обмежує варіанти саме перерахованими типами." },
      { title: "type для об'єкта", code: `type Point = { x: number; y: number };\nlet p: Point = { x: 10, y: 20 };`, explain: "Для простого об'єктного типу type і interface тут повністю взаємозамінні." },
    ],
    task: "Оголоси type Id = number | string. Напиши функцію printId(id: Id): void, яка виводить id через console.log. Виклич її один раз із числом, один раз із рядком.",
    starter: `type Id = number | string;\n\nfunction printId(id: Id): void {\n  // твій код тут\n}\n\n// printId(1);\n// printId("a1");\n`,
    hints: [
      "Тіло функції — просто console.log(id).",
      "Виклич функцію двічі: один раз із числовим аргументом, один раз із рядковим.",
      `type Id = number | string;\n\nfunction printId(id: Id): void {\n  console.log(id);\n}\n\nprintId(1);\nprintId("a1");`,
    ],
    solution: `type Id = number | string;\n\nfunction printId(id: Id): void {\n  console.log(id);\n}\n\nprintId(1);\nprintId("a1");`,
    testCode: `if (typeof printId !== 'function') return {pass:false, message:"Потрібна функція printId."};\nif (__logs.length < 2) return {pass:false, message:"Виклич printId і з числом, і з рядком — має бути щонайменше два виведення."};\nreturn {pass:true, message:"Union-тип number | string — типовий приклад, коли значення справді може бути одним із кількох конкретних типів, а не будь-яким (any)."};`,
  },
  {
    id: "ts-7",
    title: "Literal types та enum",
    type: "ts",
    theory:
      "Literal type — це тип, що дозволяє РІВНО ОДНЕ конкретне значення: let dir: \"left\" не просто рядок, а САМЕ рядок \"left\" і нічого іншого. Окремо це рідко корисно, але в union-і literal types утворюють «закритий список» дозволених значень: type Direction = \"left\" | \"right\" | \"up\" | \"down\" — змінна такого типу може дорівнювати лише одному з цих чотирьох рядків, спроба присвоїти \"diagonal\" — помилка компіляції ще до запуску.\n\nenum — альтернативний, вбудований у мову спосіб оголосити «список іменованих констант»: enum Status { Active, Done, Cancelled }. За замовчуванням кожному варіанту відповідає число (Active = 0, Done = 1, Cancelled = 2), але значення можна задати явно: enum Status { Active = \"active\", Done = \"done\" }. До enum звертаються через крапку: Status.Active.\n\nНа практиці union з literal types (\"active\" | \"done\") сьогодні використовують ЧАСТІШЕ за enum у новому TS-коді — він простіший, компілюється в звичайні рядки без додаткової обгортки, і легше читається в JSON-даних із сервера. enum лишається зручним, коли явно потрібна саме групова константа з іменем-простором (Status.Active), а не просто рядок.",
    examples: [
      { title: "Union із literal types", code: `type Status = "active" | "done" | "cancelled";\n\nfunction setStatus(status: Status): void {\n  console.log("Статус:", status);\n}\nsetStatus("active");\n// setStatus("paused"); // Помилка: "paused" не входить у Status`, explain: "Тільки три конкретні рядки дозволені — будь-який інший рядок компілятор відхилить ще до запуску." },
      { title: "enum", code: `enum Status {\n  Active = "active",\n  Done = "done",\n}\nconsole.log(Status.Active);`, explain: "Status.Active — звернення через крапку до іменованої константи; значенням буде рядок \"active\"." },
    ],
    task: 'Оголоси type Priority = "low" | "medium" | "high". Створи змінну taskPriority типу Priority зі значенням "medium" і виведи її.',
    starter: `type Priority = "low" | "medium" | "high";\n\nlet taskPriority: Priority = ...;\n\n// console.log(taskPriority);\n`,
    hints: [
      'Значення має бути рівно одним із трьох перелічених рядків.',
      'taskPriority = "medium";',
      `type Priority = "low" | "medium" | "high";\n\nlet taskPriority: Priority = "medium";\n\nconsole.log(taskPriority);`,
    ],
    solution: `type Priority = "low" | "medium" | "high";\n\nlet taskPriority: Priority = "medium";\n\nconsole.log(taskPriority);`,
    testCode: `if (!['low','medium','high'].includes(taskPriority)) return {pass:false, message:"taskPriority має бути одним із: low, medium, high."};\nreturn {pass:true, message:"Union із literal types — «закритий список» дозволених значень, що ловить одруки й неправильні статуси ще на етапі компіляції."};`,
  },
  {
    id: "ts-8",
    title: "Класи: поля, конструктор, типізовані методи",
    type: "ts",
    theory:
      "Клас у TypeScript пишеться так само, як у сучасному JS (class Name { ... }), але поля класу типізують ЯВНО, прямо в тілі класу, до конструктора: class Task { id: number; title: string; done: boolean = false; }. Поле done одразу має значення за замовчуванням (false) — тоді його можна не передавати в конструктор.\n\nКонструктор constructor(...) типізує свої параметри так само, як звичайна функція: constructor(id: number, title: string) { this.id = id; this.title = title; }. Якщо в класі оголошено поле, але конструктор «забув» його ініціалізувати, TypeScript у строгому режимі (strict, який тут завжди увімкнений) покаже помилку — це захищає від об'єктів із «напівзаповненими» полями.\n\nМетоди класу типізують так само, як окремі функції: complete(): void { this.done = true; } — параметрів немає, повертає void (нічого корисного). Такий typed-клас — це, по суті, interface (структура даних) плюс поведінка (методи) в одному місці, і саме так у реальних TS-проєктах моделюють сутності на кшталт користувача, замовлення чи, як у цьому курсі, задачі.",
    examples: [
      { title: "Клас з типізованими полями й методом", code: `class Task {\n  id: number;\n  title: string;\n  done: boolean = false;\n\n  constructor(id: number, title: string) {\n    this.id = id;\n    this.title = title;\n  }\n\n  complete(): void {\n    this.done = true;\n  }\n}\n\nconst t = new Task(1, "Купити хліб");\nt.complete();\nconsole.log(t.done);`, explain: "done ініціалізовано значенням за замовчуванням прямо в оголошенні поля, тому конструктор його не приймає." },
    ],
    presentation: [
      { title: "Анатомія типізованого класу", points: ["Поля оголошуються з типом до конструктора", "constructor типізує параметри так само, як звичайна функція", "Методи типізують параметри й повернене значення (часто void)"] },
    ],
    task: "Створи клас Task з полями id (number), title (string), done (boolean, за замовчуванням false), конструктором Task(id, title) і методом complete(): void, що встановлює done = true. Створи екземпляр, виклич complete(), виведи done.",
    starter: `class Task {\n  id: number;\n  title: string;\n  done: boolean = false;\n\n  constructor(id: number, title: string) {\n    // твій код тут\n  }\n\n  complete(): void {\n    // твій код тут\n  }\n}\n\nconst t = new Task(1, "Купити хліб");\nt.complete();\n// console.log(t.done);`,
    hints: [
      "У конструкторі присвой this.id = id і this.title = title.",
      "У complete() присвой this.done = true.",
      `class Task {\n  id: number;\n  title: string;\n  done: boolean = false;\n\n  constructor(id: number, title: string) {\n    this.id = id;\n    this.title = title;\n  }\n\n  complete(): void {\n    this.done = true;\n  }\n}\n\nconst t = new Task(1, "Купити хліб");\nt.complete();\nconsole.log(t.done);`,
    ],
    solution: `class Task {\n  id: number;\n  title: string;\n  done: boolean = false;\n\n  constructor(id: number, title: string) {\n    this.id = id;\n    this.title = title;\n  }\n\n  complete(): void {\n    this.done = true;\n  }\n}\n\nconst t = new Task(1, "Купити хліб");\nt.complete();\nconsole.log(t.done);`,
    testCode: `if (typeof Task !== 'function') return {pass:false, message:"Потрібен клас Task."};\nif (typeof t === 'undefined' || t.id !== 1 || t.title !== "Купити хліб") return {pass:false, message:"Екземпляр t має мати id=1 і title=\\"Купити хліб\\"."};\nif (t.done !== true) return {pass:false, message:"Після виклику complete() поле done має стати true."};\nreturn {pass:true, message:"Типізований клас Task — основа фінального проєкту цього курсу: структура даних і поведінка в одному місці."};`,
  },
  {
    id: "ts-9",
    title: "Модифікатори доступу: public, private, readonly",
    type: "ts",
    theory:
      "За замовчуванням усі поля й методи класу в TypeScript — public: доступні звідусіль поза класом (task.title — це працює завжди). Ключове слово private ПЕРЕД полем чи методом забороняє звертатись до нього ЗЗОВНІ класу — лише методи ЦЬОГО Ж класу можуть його читати чи змінювати. Це називається інкапсуляція: внутрішні деталі реалізації сховані від зовнішнього коду, і їх можна міняти, не ламаючи нічого поза класом.\n\nprotected схожий на private, з однією відмінністю: доступ дозволений і в класах-НАЩАДКАХ (через extends), а не лише в самому класі. private суворіше забороняє доступ навіть нащадкам.\n\nreadonly для поля класу означає те саме, що й для об'єктного типу з 4-го уроку: значення можна встановити лише один раз, у момент оголошення чи всередині конструктора, а далі — лише читати. Комбінація private readonly id: number — типовий приклад ідентифікатора, який має існувати, але ніколи не повинен змінюватись і не повинен бути доступний напряму ззовні.",
    examples: [
      { title: "private приховує деталі", code: `class BankAccount {\n  private balance: number = 0;\n\n  deposit(amount: number): void {\n    this.balance += amount;\n  }\n\n  getBalance(): number {\n    return this.balance;\n  }\n}\n\nconst acc = new BankAccount();\nacc.deposit(100);\nconsole.log(acc.getBalance());\n// acc.balance; // Помилка: balance є private і недоступний ззовні`, explain: "Єдиний спосіб дізнатись баланс ззовні — через метод getBalance(), а не пряме звернення до поля." },
      { title: "readonly в класі", code: `class Task {\n  readonly id: number;\n  constructor(id: number) {\n    this.id = id;\n  }\n}\nconst t = new Task(1);\n// t.id = 2; // Помилка: id — readonly`, explain: "id встановлюється рівно один раз, у конструкторі, і далі захищений від випадкової зміни." },
    ],
    task: "Створи клас Counter із private полем count (number, починається з 0), методом increment(): void (додає 1 до count) і методом getCount(): number (повертає count). Створи екземпляр, виклич increment() двічі, виведи getCount().",
    starter: `class Counter {\n  private count: number = 0;\n\n  increment(): void {\n    // твій код тут\n  }\n\n  getCount(): number {\n    // твій код тут\n  }\n}\n\nconst c = new Counter();\nc.increment();\nc.increment();\n// console.log(c.getCount());`,
    hints: [
      "increment() має збільшити this.count на 1.",
      "getCount() має повернути this.count.",
      `class Counter {\n  private count: number = 0;\n\n  increment(): void {\n    this.count += 1;\n  }\n\n  getCount(): number {\n    return this.count;\n  }\n}\n\nconst c = new Counter();\nc.increment();\nc.increment();\nconsole.log(c.getCount());`,
    ],
    solution: `class Counter {\n  private count: number = 0;\n\n  increment(): void {\n    this.count += 1;\n  }\n\n  getCount(): number {\n    return this.count;\n  }\n}\n\nconst c = new Counter();\nc.increment();\nc.increment();\nconsole.log(c.getCount());`,
    testCode: `if (typeof Counter !== 'function') return {pass:false, message:"Потрібен клас Counter."};\nif (typeof c === 'undefined' || typeof c.getCount !== 'function') return {pass:false, message:"Потрібен екземпляр c з методом getCount()."};\nif (c.getCount() !== 2) return {pass:false, message:"Після двох increment() getCount() має повернути 2 (зараз: " + c.getCount() + ")."};\nreturn {pass:true, message:"private ховає внутрішній стан count — ззовні доступні лише методи increment/getCount, а не сам лічильник."};`,
  },
  {
    id: "ts-10",
    title: "Класи реалізують interface (implements)",
    type: "ts",
    theory:
      "interface описує лише СТРУКТУРУ (які поля й методи мають існувати, з якими типами) — implements змушує клас ГАРАНТОВАНО відповідати цій структурі: class Task implements Describable { ... }. Якщо клас не реалізує якийсь метод чи поле з інтерфейсу, або реалізує з неправильним типом — компілятор одразу покаже помилку.\n\nЦе особливо корисно, коли РІЗНІ класи мають підтримувати ОДНАКОВУ поведінку по-різному: interface Describable { describe(): string } можуть реалізувати і клас Task, і клас User, кожен по-своєму — а код, що працює з Describable, не має знати, з яким саме класом він працює, лише що в нього точно є метод describe().\n\nОдин клас може реалізовувати ОДРАЗУ кілька інтерфейсів через кому: class Task implements Describable, Completable — тоді він зобов'язаний відповідати вимогам обох. Це дає гнучкість, якої немає в класичному одиночному успадкуванні (extends можна лише від ОДНОГО класу, а implements — від кількох інтерфейсів одразу).",
    examples: [
      { title: "implements гарантує структуру", code: `interface Describable {\n  describe(): string;\n}\n\nclass Task implements Describable {\n  constructor(public title: string) {}\n\n  describe(): string {\n    return \`Задача: \${this.title}\`;\n  }\n}\n\nconst t = new Task("Прибрати кімнату");\nconsole.log(t.describe());`, explain: "Якби Task не реалізував describe() (або реалізував з неправильним типом повернення), компілятор одразу підсвітив би помилку прямо на class Task implements Describable." },
    ],
    task: "Оголоси interface Printable з методом print(): string. Створи клас Note, що implements Printable, з полем text (string, через public у конструкторі) і методом print(): string, що повертає this.text. Створи екземпляр і виведи результат print().",
    starter: `interface Printable {\n  print(): string;\n}\n\nclass Note implements Printable {\n  constructor(public text: string) {}\n\n  print(): string {\n    // твій код тут\n  }\n}\n\nconst n = new Note("Нагадування");\n// console.log(n.print());`,
    hints: [
      "public text у списку параметрів конструктора одразу оголошує й ініціалізує поле — окремо писати this.text = text не потрібно.",
      "print() має повернути this.text.",
      `interface Printable {\n  print(): string;\n}\n\nclass Note implements Printable {\n  constructor(public text: string) {}\n\n  print(): string {\n    return this.text;\n  }\n}\n\nconst n = new Note("Нагадування");\nconsole.log(n.print());`,
    ],
    solution: `interface Printable {\n  print(): string;\n}\n\nclass Note implements Printable {\n  constructor(public text: string) {}\n\n  print(): string {\n    return this.text;\n  }\n}\n\nconst n = new Note("Нагадування");\nconsole.log(n.print());`,
    testCode: `if (typeof Note !== 'function') return {pass:false, message:"Потрібен клас Note."};\nif (typeof n === 'undefined' || typeof n.print !== 'function') return {pass:false, message:"Потрібен екземпляр n з методом print()."};\nif (n.print() !== "Нагадування") return {pass:false, message:"n.print() має повернути \\"Нагадування\\" (зараз: \\"" + n.print() + "\\")."};\nreturn {pass:true, message:"implements гарантує, що клас справді реалізує все, обіцяне інтерфейсом — не лише за назвою, а й за типами."};`,
  },
  {
    id: "ts-11",
    title: "Type narrowing: typeof та instanceof",
    type: "ts",
    theory:
      "Коли змінна має union-тип (наприклад, number | string), TypeScript спочатку дозволяє лише ті операції, що працюють з ОБОМА варіантами водночас. Щоб скористатись чимось специфічним для одного з варіантів (наприклад, .toUpperCase() лише для рядка), спершу потрібно ЗВУЗИТИ (narrow) тип — довести компілятору, яка саме гілка типу тут насправді.\n\nНайпростіший спосіб звуження для примітивів — перевірка typeof: if (typeof value === \"string\") { value.toUpperCase(); } — усередині цього if-блоку TypeScript уже ЗНАЄ, що value тут гарантовано string, і дозволяє рядкові методи без жодної додаткової анотації. У гілці else (чи після return) тип автоматично звужується до того, що лишилось (number).\n\nДля класів і об'єктів той самий принцип працює через instanceof: if (value instanceof Task) { value.complete(); } — усередині if TypeScript знає, що value є саме екземпляром Task, і дозволяє звертатись до методів, специфічних для Task, яких немає в інших можливих типах union-у. Це і є type narrowing — компілятор ВІДСТЕЖУЄ логіку коду й «звужує» тип змінної залежно від того, яку перевірку код щойно пройшов.",
    examples: [
      { title: "Звуження через typeof", code: `function formatId(id: number | string): string {\n  if (typeof id === "string") {\n    return id.toUpperCase();\n  }\n  return id.toFixed(0);\n}\nconsole.log(formatId("abc"));\nconsole.log(formatId(42));`, explain: "У гілці typeof === \"string\" доступний .toUpperCase(); інакше TypeScript знає, що лишилось лише number, і дозволяє .toFixed()." },
      { title: "Звуження через instanceof", code: `class Cat { meow(): string { return "Няв"; } }\nclass Dog { bark(): string { return "Гав"; } }\n\nfunction speak(animal: Cat | Dog): string {\n  if (animal instanceof Cat) {\n    return animal.meow();\n  }\n  return animal.bark();\n}`, explain: "instanceof дозволяє звернутись саме до методу того класу, яким насправді є об'єкт у цій гілці." },
    ],
    task: "Напиши функцію describe(value: number | string): string, яка повертає `Число: ${value}`, якщо value число, або `Текст: ${value}`, якщо рядок. Виклич її з числом і з рядком, виведи обидва результати.",
    starter: `function describe(value: number | string): string {\n  // твій код тут\n}\n\n// console.log(describe(42));\n// console.log(describe("привіт"));\n`,
    hints: [
      "Перевір typeof value === 'number' у if.",
      "У гілці number поверни `Число: ${value}`, інакше `Текст: ${value}`.",
      `function describe(value: number | string): string {\n  if (typeof value === "number") {\n    return \`Число: \${value}\`;\n  }\n  return \`Текст: \${value}\`;\n}\n\nconsole.log(describe(42));\nconsole.log(describe("привіт"));`,
    ],
    solution: `function describe(value: number | string): string {\n  if (typeof value === "number") {\n    return \`Число: \${value}\`;\n  }\n  return \`Текст: \${value}\`;\n}\n\nconsole.log(describe(42));\nconsole.log(describe("привіт"));`,
    testCode: `if (typeof describe !== 'function') return {pass:false, message:"Потрібна функція describe."};\nif (describe(42) !== "Число: 42") return {pass:false, message:"describe(42) має повернути \\"Число: 42\\"."};\nif (describe("привіт") !== "Текст: привіт") return {pass:false, message:"describe(\\"привіт\\") має повернути \\"Текст: привіт\\"."};\nreturn {pass:true, message:"typeof-перевірка — найпростіший спосіб звузити union-тип до конкретного варіанту прямо всередині функції."};`,
  },
  {
    id: "ts-12",
    title: "Дискриміновані об'єднання (discriminated unions)",
    type: "ts",
    theory:
      "Дискриміноване об'єднання — це union з кількох object-типів, у яких є СПІЛЬНЕ поле з РІЗНИМИ literal-значеннями («дискримінант», що відрізняє один варіант від іншого): type Shape = { kind: \"circle\"; radius: number } | { kind: \"square\"; side: number }. Поле kind тут відіграє роль «мітки», за якою можна визначити, з яким саме варіантом маємо справу.\n\nПеревірка if (shape.kind === \"circle\") звужує тип так само, як typeof чи instanceof з попереднього уроку — усередині цього if TypeScript ЗНАЄ, що shape має поле radius (бо тільки варіант \"circle\" його має), і дозволяє його читати без жодних додаткових перевірок чи приведень типу.\n\nЦе один із найпотужніших патернів TypeScript для моделювання «одне з кількох станів»: результат запиту (успіх ЧИ помилка, кожен зі своїми полями), фігура (коло ЧИ квадрат, кожна зі своїми вимірами), подія (клік ЧИ натискання клавіші, кожна зі своїми даними). Дискримінант робить неможливим створити об'єкт із суперечливими полями (kind: \"circle\" разом із side) — компілятор просто не дозволить такого значення.",
    examples: [
      { title: "Дискримінована фігура", code: `type Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; side: number };\n\nfunction area(shape: Shape): number {\n  if (shape.kind === "circle") {\n    return Math.PI * shape.radius ** 2;\n  }\n  return shape.side ** 2;\n}\nconsole.log(area({ kind: "circle", radius: 2 }));\nconsole.log(area({ kind: "square", side: 3 }));`, explain: "Усередині if (shape.kind === \"circle\") доступне shape.radius; у гілці square — лише shape.side. Компілятор сам це відстежує за полем kind." },
    ],
    task: 'Оголоси type Result = { status: "ok"; value: number } | { status: "error"; message: string }. Напиши функцію report(result: Result): string, що повертає `Значення: ${value}` для "ok" і `Помилка: ${message}` для "error". Виклич обидва варіанти.',
    starter: `type Result =\n  | { status: "ok"; value: number }\n  | { status: "error"; message: string };\n\nfunction report(result: Result): string {\n  // твій код тут\n}\n\n// console.log(report({ status: "ok", value: 42 }));\n// console.log(report({ status: "error", message: "Щось пішло не так" }));\n`,
    hints: [
      'Перевір result.status === "ok" у if.',
      "У гілці ok доступне result.value, у гілці error — result.message.",
      `type Result =\n  | { status: "ok"; value: number }\n  | { status: "error"; message: string };\n\nfunction report(result: Result): string {\n  if (result.status === "ok") {\n    return \`Значення: \${result.value}\`;\n  }\n  return \`Помилка: \${result.message}\`;\n}\n\nconsole.log(report({ status: "ok", value: 42 }));\nconsole.log(report({ status: "error", message: "Щось пішло не так" }));`,
    ],
    solution: `type Result =\n  | { status: "ok"; value: number }\n  | { status: "error"; message: string };\n\nfunction report(result: Result): string {\n  if (result.status === "ok") {\n    return \`Значення: \${result.value}\`;\n  }\n  return \`Помилка: \${result.message}\`;\n}\n\nconsole.log(report({ status: "ok", value: 42 }));\nconsole.log(report({ status: "error", message: "Щось пішло не так" }));`,
    testCode: `if (typeof report !== 'function') return {pass:false, message:"Потрібна функція report."};\nif (report({status:"ok", value:42}) !== "Значення: 42") return {pass:false, message:"report для ok має повернути \\"Значення: 42\\"."};\nif (report({status:"error", message:"X"}) !== "Помилка: X") return {pass:false, message:"report для error має повернути \\"Помилка: X\\"."};\nreturn {pass:true, message:"Дискримінант status робить неможливим переплутати поля двох різних форм об'єкта — компілятор сам відрізняє їх."};`,
  },
  {
    id: "ts-13",
    title: "Intersection types (&)",
    type: "ts",
    theory:
      "Якщо union (|) означає «одне з кількох», то intersection (&) означає «одразу ВСІ разом»: type Named = { name: string }; type Aged = { age: number }; type Person = Named & Aged — тип Person вимагає ОБИДВА поля одночасно, name і age. Об'єкт типу Person має відповідати вимогам кожної з частин перетину.\n\nНайчастіше intersection застосовують, щоб «домішати» додаткову поведінку чи метадані до вже наявного типу, не переписуючи його: type Timestamped = { createdAt: Date }; type TaskWithTimestamp = Task & Timestamped — тепер TaskWithTimestamp має всі поля Task ПЛЮС createdAt.\n\nВажливо не плутати & з наслідуванням класів (extends) — intersection працює на рівні ТИПІВ (interface, type), об'єднуючи вимоги до форми об'єкта, а не поведінку методів чи ланцюжок прототипів. Для об'єктних типів це часто зручніша альтернатива, ніж переписувати весь набір полів заново в одному великому interface.",
    examples: [
      { title: "Об'єднання двох типів через &", code: `type Named = { name: string };\ntype Aged = { age: number };\ntype Person = Named & Aged;\n\nconst p: Person = { name: "Марко", age: 30 };\nconsole.log(p.name, p.age);`, explain: "Об'єкт p зобов'язаний мати ОБИДВА поля — і з Named, і з Aged — інакше компілятор покаже помилку про відсутнє поле." },
    ],
    task: "Оголоси type Timestamped = { createdAt: string }. Оголоси type Task = { title: string } & Timestamped. Створи змінну task типу Task з обома полями і виведи її.",
    starter: `type Timestamped = { createdAt: string };\ntype Task = { title: string } & Timestamped;\n\nlet task: Task = ...;\n\n// console.log(task);\n`,
    hints: [
      "Об'єкт task повинен мати ОБИДВА поля: title і createdAt.",
      'task = { title: "Купити хліб", createdAt: "2024-01-01" };',
      `type Timestamped = { createdAt: string };\ntype Task = { title: string } & Timestamped;\n\nlet task: Task = { title: "Купити хліб", createdAt: "2024-01-01" };\n\nconsole.log(task);`,
    ],
    solution: `type Timestamped = { createdAt: string };\ntype Task = { title: string } & Timestamped;\n\nlet task: Task = { title: "Купити хліб", createdAt: "2024-01-01" };\n\nconsole.log(task);`,
    testCode: `if (typeof task !== 'object' || task === null) return {pass:false, message:"Потрібен об'єкт task."};\nif (typeof task.title !== 'string' || typeof task.createdAt !== 'string') return {pass:false, message:"task має мати обидва поля: title і createdAt, обидва рядки."};\nreturn {pass:true, message:"Intersection (&) вимагає ВСІХ полів одразу — зручно, щоб «домішати» додаткові дані до вже наявного типу."};`,
  },
  {
    id: "ts-14",
    title: "Generics: типізовані функції",
    type: "ts",
    theory:
      "Іноді функція повинна працювати з БУДЬ-ЯКИМ типом, але при цьому зберігати ЗВ'ЯЗОК між типом вхідного й вихідного значення — саме для цього існують generics (узагальнені типи). function identity<T>(value: T): T { return value; } — літера T у кутових дужках це «параметр типу»: під час КОЖНОГО виклику T підставляється конкретним типом, з яким його викликали: identity(42) — T це number, identity(\"hi\") — T це string, і результат матиме той самий тип, що й аргумент.\n\nБез generics довелось би або писати окрему функцію на кожен тип (identityNumber, identityString...), або використати any — тип «вимкнути перевірку типів взагалі», що зводить нанівець усю користь TypeScript. Generics дають ТРЕТІЙ шлях: одна функція, що ЗБЕРІГАЄ типову інформацію, а не втрачає її.\n\nТипова назва параметра типу — одна літера T (від Type), або кілька змістовних літер для кількох параметрів: function pair<K, V>(key: K, value: V): [K, V]. Generics стають особливо корисними в масивових функціях — наприклад, function firstElement<T>(arr: T[]): T поверне перший елемент масиву будь-якого типу, зберігаючи саме ЙОГО тип, а не any.",
    examples: [
      { title: "Найпростіша generic-функція", code: `function identity<T>(value: T): T {\n  return value;\n}\nconst a = identity(42);      // T = number\nconst b = identity("hello"); // T = string\nconsole.log(a, b);`, explain: "TypeScript сам визначає T за типом аргументу під час кожного виклику — явно вказувати <number> чи <string> не обов'язково." },
      { title: "Generic для масиву", code: `function firstElement<T>(arr: T[]): T {\n  return arr[0];\n}\nconsole.log(firstElement([1, 2, 3]));       // number\nconsole.log(firstElement(["a", "b"]));      // string`, explain: "Повернене значення зберігає ТОЧНИЙ тип елементів масиву, а не any чи unknown." },
    ],
    task: "Напиши generic-функцію lastElement<T>(arr: T[]): T, що повертає ОСТАННІЙ елемент масиву. Виклич її з масивом чисел і з масивом рядків, виведи обидва результати.",
    starter: `function lastElement<T>(arr: T[]): T {\n  // твій код тут\n}\n\n// console.log(lastElement([1, 2, 3]));\n// console.log(lastElement(["a", "b", "c"]));\n`,
    hints: [
      "Останній елемент масиву — arr[arr.length - 1].",
      "return arr[arr.length - 1];",
      `function lastElement<T>(arr: T[]): T {\n  return arr[arr.length - 1];\n}\n\nconsole.log(lastElement([1, 2, 3]));\nconsole.log(lastElement(["a", "b", "c"]));`,
    ],
    solution: `function lastElement<T>(arr: T[]): T {\n  return arr[arr.length - 1];\n}\n\nconsole.log(lastElement([1, 2, 3]));\nconsole.log(lastElement(["a", "b", "c"]));`,
    testCode: `if (typeof lastElement !== 'function') return {pass:false, message:"Потрібна функція lastElement."};\nif (lastElement([1,2,3]) !== 3) return {pass:false, message:"lastElement([1,2,3]) має повернути 3."};\nif (lastElement(["a","b","c"]) !== "c") return {pass:false, message:"lastElement([\\"a\\",\\"b\\",\\"c\\"]) має повернути \\"c\\"."};\nreturn {pass:true, message:"Generics зберігають зв'язок типів між входом і виходом функції — одна реалізація працює з будь-яким типом, без any."};`,
  },
  {
    id: "ts-15",
    title: "Generics: типізовані інтерфейси й класи",
    type: "ts",
    theory:
      "Так само, як функція, interface чи class можуть мати параметр типу в кутових дужках: interface Box<T> { value: T }. Box<number> означає «Box, де value — число», Box<string> — «Box, де value — рядок». Це той самий принцип, що й з масивами (Array<T>, тобто T[]) — але тепер можна створювати ВЛАСНІ узагальнені структури даних.\n\nНайпоширеніший практичний приклад — узагальнене сховище (Repository): class Repository<T> { private items: T[] = []; add(item: T): void { this.items.push(item) } getAll(): T[] { return this.items } }. Один і той самий клас Repository можна використати і як Repository<Task>, і як Repository<User> — код методів пишеться ОДИН РАЗ, а типи підставляються під час використання: const tasks = new Repository<Task>().\n\nЦе саме той шаблон, що лежить в основі фінального проєкту цього курсу: типізоване сховище задач, яке поводиться як звичайний масив, але з гарантією, що туди неможливо випадково покласти щось, що не є Task.",
    examples: [
      { title: "Узагальнений Box", code: `interface Box<T> {\n  value: T;\n}\nconst numberBox: Box<number> = { value: 42 };\nconst stringBox: Box<string> = { value: "hi" };`, explain: "Той самий interface Box<T> обслуговує будь-який тип — конкретний тип підставляється в кутових дужках під час використання." },
      { title: "Узагальнений Repository", code: `class Repository<T> {\n  private items: T[] = [];\n\n  add(item: T): void {\n    this.items.push(item);\n  }\n\n  getAll(): T[] {\n    return this.items;\n  }\n}\n\nconst numbers = new Repository<number>();\nnumbers.add(1);\nnumbers.add(2);\nconsole.log(numbers.getAll());`, explain: "Repository<number> гарантує, що add() приймає лише числа — той самий клас з Repository<string> прийняв би лише рядки." },
    ],
    task: "Створи узагальнений клас Stack<T> з private полем items (T[], порожній масив), методом push(item: T): void і методом pop(): T | undefined (використай Array.prototype.pop). Створи Stack<number>, поклади 1 і 2, виклич pop(), виведи результат.",
    starter: `class Stack<T> {\n  private items: T[] = [];\n\n  push(item: T): void {\n    // твій код тут\n  }\n\n  pop(): T | undefined {\n    // твій код тут\n  }\n}\n\nconst s = new Stack<number>();\ns.push(1);\ns.push(2);\n// console.log(s.pop());`,
    hints: [
      "push() додає елемент через this.items.push(item).",
      "pop() повертає this.items.pop().",
      `class Stack<T> {\n  private items: T[] = [];\n\n  push(item: T): void {\n    this.items.push(item);\n  }\n\n  pop(): T | undefined {\n    return this.items.pop();\n  }\n}\n\nconst s = new Stack<number>();\ns.push(1);\ns.push(2);\nconsole.log(s.pop());`,
    ],
    solution: `class Stack<T> {\n  private items: T[] = [];\n\n  push(item: T): void {\n    this.items.push(item);\n  }\n\n  pop(): T | undefined {\n    return this.items.pop();\n  }\n}\n\nconst s = new Stack<number>();\ns.push(1);\ns.push(2);\nconsole.log(s.pop());`,
    testCode: `if (typeof Stack !== 'function') return {pass:false, message:"Потрібен клас Stack."};\nif (typeof s === 'undefined') return {pass:false, message:"Потрібен екземпляр s."};\nif (!__logs.some(l => l.includes('2'))) return {pass:false, message:"console.log(s.pop()) мав вивести 2 — останній покладений елемент."};\nif (s.pop() !== 1) return {pass:false, message:"Після того як 2 вже вилучено попереднім pop(), у стеку має лишитись 1."};\nreturn {pass:true, message:"Generic-клас Stack<T> — той самий узагальнений шаблон, що й Repository<T>, який знадобиться у фінальному проєкті."};`,
  },
  {
    id: "ts-16",
    title: "Utility types: Partial, Pick, Omit",
    type: "ts",
    theory:
      "TypeScript постачається з готовим набором «утилітарних типів» (utility types), що будують НОВИЙ тип із вже наявного, без переписування полів вручну. Partial<T> робить УСІ поля T необов'язковими: interface Task { id: number; title: string } → Partial<Task> означає { id?: number; title?: string } — типовий сценарй: функція оновлення, куди передають лише ЧАСТИНУ полів, які треба змінити.\n\nPick<T, \"a\" | \"b\"> будує тип лише З ПЕРЕЛІЧЕНИХ полів T: Pick<Task, \"id\" | \"title\"> — якщо в Task було б ще й поле done, Pick тут його просто НЕ ВКЛЮЧИТЬ. Omit<T, \"a\" | \"b\"> робить протилежне — бере ВСІ поля T, КРІМ перелічених: Omit<Task, \"id\"> дає тип із title (і done, якщо воно є), але без id — типовий сценарій для форми створення нового запису, де id ще не існує (його згенерує сервер чи база даних).\n\nЦі три типи покривають найчастіші повсякденні задачі: Partial — часткове оновлення, Pick — вибрати підмножину полів, Omit — прибрати конкретні поля. Усі вони вбудовані в TypeScript і не потребують жодного імпорту — працюють одразу, у будь-якому .ts файлі.",
    examples: [
      { title: "Partial для часткового оновлення", code: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\nfunction updateTask(task: Task, changes: Partial<Task>): Task {\n  return { ...task, ...changes };\n}\n\nconst t: Task = { id: 1, title: "Купити хліб", done: false };\nconsole.log(updateTask(t, { done: true }));`, explain: "changes: Partial<Task> дозволяє передати лише done, без id і title — усі поля Partial<Task> необов'язкові." },
      { title: "Pick і Omit", code: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\ntype TaskPreview = Pick<Task, "id" | "title">;\ntype NewTask = Omit<Task, "id">;\n\nconst preview: TaskPreview = { id: 1, title: "Купити хліб" };\nconst draft: NewTask = { title: "Нова задача", done: false };`, explain: "TaskPreview має лише id і title; NewTask має все, КРІМ id — рівно те, що потрібно ДО того, як запис отримає справжній id." },
    ],
    task: "Маючи interface Task { id: number; title: string; done: boolean }, оголоси type NewTask = Omit<Task, \"id\">. Створи змінну draft типу NewTask (title і done, без id) і виведи її.",
    starter: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\ntype NewTask = Omit<Task, "id">;\n\nlet draft: NewTask = ...;\n\n// console.log(draft);\n`,
    hints: [
      "draft не повинен мати поле id взагалі — лише title і done.",
      'draft = { title: "Нова задача", done: false };',
      `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\ntype NewTask = Omit<Task, "id">;\n\nlet draft: NewTask = { title: "Нова задача", done: false };\n\nconsole.log(draft);`,
    ],
    solution: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\ntype NewTask = Omit<Task, "id">;\n\nlet draft: NewTask = { title: "Нова задача", done: false };\n\nconsole.log(draft);`,
    testCode: `if (typeof draft !== 'object' || draft === null) return {pass:false, message:"Потрібен об'єкт draft."};\nif (typeof draft.title !== 'string' || typeof draft.done !== 'boolean') return {pass:false, message:"draft має мати title (string) і done (boolean)."};\nif ('id' in draft) return {pass:false, message:"NewTask через Omit не повинен мати поле id взагалі — прибери його зі значення draft."};\nreturn {pass:true, message:"Omit<Task, \\"id\\"> — рівно той тип, що потрібен ДО присвоєння id: усе, крім самого ідентифікатора."};`,
  },
  {
    id: "ts-17",
    title: "Utility types: Readonly та Record",
    type: "ts",
    theory:
      "Readonly<T> робить УСІ поля T незмінними після створення: Readonly<Task> означає { readonly id: number; readonly title: string; readonly done: boolean } — жодне з полів не можна перезаписати, навіть якщо в оригінальному Task вони були звичайними. Це зручно для значень, які передають далі по коду й хочуть гарантувати, що ніхто їх випадково не змінить, — наприклад, конфігурація чи вже збережений у базі запис.\n\nRecord<K, V> будує тип ОБ'ЄКТА-СЛОВНИКА: ключі мають тип K, значення — тип V. Record<string, number> — об'єкт, де БУДЬ-ЯКИЙ рядковий ключ веде до числа: { \"дошка\": 25, \"стілець\": 40 }. Це типовий спосіб описати «мапу за ідентифікатором»: Record<number, Task> — об'єкт, де ключ це id задачі (число), а значення — сама задача.\n\nRecord особливо зручний, коли дані з масиву треба швидко ЗНАХОДИТИ за ключем, а не перебирати кожного разу циклом: замість tasks.find(t => t.id === id) (перебір усього масиву щоразу) можна тримати tasksById: Record<number, Task> і звертатись напряму tasksById[id] — миттєвий доступ без перебору.",
    examples: [
      { title: "Readonly захищає готовий об'єкт", code: `interface Task {\n  id: number;\n  title: string;\n}\nfunction freeze(task: Task): Readonly<Task> {\n  return task;\n}\nconst frozen = freeze({ id: 1, title: "Купити хліб" });\n// frozen.title = "Інша назва"; // Помилка: readonly`, explain: "Readonly<Task>, повернений з freeze, забороняє будь-яку зміну полів після цього." },
      { title: "Record як словник за ключем", code: `interface Task {\n  id: number;\n  title: string;\n}\nconst byId: Record<number, Task> = {\n  1: { id: 1, title: "Купити хліб" },\n  2: { id: 2, title: "Погуляти" },\n};\nconsole.log(byId[1].title);`, explain: "byId[1] — миттєвий доступ за ключем, без перебору масиву в пошуках задачі з id === 1." },
    ],
    task: 'Маючи interface Task { id: number; title: string }, створи змінну byId типу Record<number, Task> з двома задачами (ключі 1 і 2). Виведи byId[1].title.',
    starter: `interface Task {\n  id: number;\n  title: string;\n}\n\nlet byId: Record<number, Task> = ...;\n\n// console.log(byId[1].title);\n`,
    hints: [
      "Ключі об'єкта byId — числа 1 і 2, значення — об'єкти Task.",
      'byId = { 1: { id: 1, title: "Купити хліб" }, 2: { id: 2, title: "Погуляти" } };',
      `interface Task {\n  id: number;\n  title: string;\n}\n\nlet byId: Record<number, Task> = {\n  1: { id: 1, title: "Купити хліб" },\n  2: { id: 2, title: "Погуляти" },\n};\n\nconsole.log(byId[1].title);`,
    ],
    solution: `interface Task {\n  id: number;\n  title: string;\n}\n\nlet byId: Record<number, Task> = {\n  1: { id: 1, title: "Купити хліб" },\n  2: { id: 2, title: "Погуляти" },\n};\n\nconsole.log(byId[1].title);`,
    testCode: `if (typeof byId !== 'object' || byId === null) return {pass:false, message:"Потрібен об'єкт byId."};\nif (!byId[1] || !byId[2]) return {pass:false, message:"byId має мати ключі 1 і 2."};\nif (byId[1].title !== "Купити хліб") return {pass:false, message:"byId[1].title має бути \\"Купити хліб\\"."};\nreturn {pass:true, message:"Record<number, Task> — словник за id: миттєвий доступ до задачі, без перебору масиву."};`,
  },
  {
    id: "ts-18",
    title: "Типізовані map/filter/find",
    type: "ts",
    theory:
      "Масивові методи map, filter, find уже мають вбудовані generic-типи в самій бібліотеці TypeScript (у файлах lib.*.d.ts, тих самих, що реально підвантажуються в цьому курсі) — тому тип елементів автоматично виводиться з масиву, без жодних додаткових анотацій: tasks.map(t => t.title) поверне string[], якщо tasks — Task[], бо TypeScript знає, що t тут має тип Task.\n\nfilter із callback, що повертає boolean, звужує МАСИВ (не сам елемент): tasks.filter(t => t.done) поверне Task[] — той самий тип елементів, лише менше елементів. find поверне Task | undefined — саме undefined, тому що елемент, який відповідає умові, може взагалі не існувати в масиві, і TypeScript змушує це врахувати (наприклад, перевіркою if перед використанням результату).\n\nЦе ще один наочний приклад того, чому generics корисні: та сама функція filter однаково добре працює й з Task[], і з number[], і з будь-яким іншим масивом — TypeScript просто підставляє конкретний тип щоразу, коли метод викликають, зберігаючи повну типову безпеку без окремої реалізації на кожен тип масиву.",
    examples: [
      { title: "map, filter, find разом", code: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\nconst tasks: Task[] = [\n  { id: 1, title: "Купити хліб", done: true },\n  { id: 2, title: "Погуляти", done: false },\n];\n\nconst titles: string[] = tasks.map(t => t.title);\nconst doneOnes: Task[] = tasks.filter(t => t.done);\nconst found: Task | undefined = tasks.find(t => t.id === 2);\n\nconsole.log(titles, doneOnes, found?.title);`, explain: "map повернув string[], filter — Task[] (менше елементів, той самий тип), find — Task | undefined (може не знайти)." },
    ],
    task: "Маючи масив tasks: Task[] із трьома задачами (різні done), отримай масив titles (string[], усі назви через map), масив doneOnes (Task[], лише виконані через filter) і found (Task | undefined, знайди задачу з id === 2 через find). Виведи всі три.",
    starter: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\nconst tasks: Task[] = [\n  { id: 1, title: "Купити хліб", done: true },\n  { id: 2, title: "Погуляти", done: false },\n  { id: 3, title: "Прочитати книгу", done: true },\n];\n\nconst titles: string[] = ...;\nconst doneOnes: Task[] = ...;\nconst found: Task | undefined = ...;\n\n// console.log(titles, doneOnes, found);\n`,
    hints: [
      "titles: tasks.map(t => t.title)",
      "doneOnes: tasks.filter(t => t.done); found: tasks.find(t => t.id === 2)",
      `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\nconst tasks: Task[] = [\n  { id: 1, title: "Купити хліб", done: true },\n  { id: 2, title: "Погуляти", done: false },\n  { id: 3, title: "Прочитати книгу", done: true },\n];\n\nconst titles: string[] = tasks.map(t => t.title);\nconst doneOnes: Task[] = tasks.filter(t => t.done);\nconst found: Task | undefined = tasks.find(t => t.id === 2);\n\nconsole.log(titles, doneOnes, found);`,
    ],
    solution: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\nconst tasks: Task[] = [\n  { id: 1, title: "Купити хліб", done: true },\n  { id: 2, title: "Погуляти", done: false },\n  { id: 3, title: "Прочитати книгу", done: true },\n];\n\nconst titles: string[] = tasks.map(t => t.title);\nconst doneOnes: Task[] = tasks.filter(t => t.done);\nconst found: Task | undefined = tasks.find(t => t.id === 2);\n\nconsole.log(titles, doneOnes, found);`,
    testCode: `if (!Array.isArray(titles) || titles.length !== 3) return {pass:false, message:"titles має бути масивом з трьох назв."};\nif (!Array.isArray(doneOnes) || doneOnes.length !== 2) return {pass:false, message:"doneOnes має містити рівно дві виконані задачі (зараз: " + (doneOnes?.length) + ")."};\nif (!found || found.id !== 2) return {pass:false, message:"found має бути задачею з id === 2."};\nreturn {pass:true, message:"map/filter/find зі збереженими типами — щоденний інструмент у будь-якому TS-проєкті, що працює з масивами даних."};`,
  },
  {
    id: "ts-19",
    title: "Async/await із типізованими Promise",
    type: "ts",
    theory:
      "Promise<T> — це тип «значення, яке з'явиться пізніше», де T — тип цього майбутнього значення: Promise<Task[]> означає «зрештою поверне масив задач». Функцію, оголошену як async, TypeScript автоматично типізує так, що вона повертає Promise: async function loadTasks(): Promise<Task[]> { return [...] } — навіть попри те, що в тілі функції return повертає просто Task[], а не Promise, обгортка в Promise відбувається автоматично.\n\nВсередині async-функції await \"розпаковує\" Promise<T> до самого T: const tasks: Task[] = await loadTasks() — тип tasks тут саме Task[], а не Promise<Task[]>, бо await зробив усе очікування за лаштунками. Це і є головна причина, чому async/await зручніший за .then()-ланцюжки: код виглядає як звичайний послідовний код, а типи автоматично узгоджуються на кожному кроці.\n\nЯкщо функція може ЗАВЕРШИТИСЬ ПОМИЛКОЮ, а не просто повернути значення, це варто відобразити в типі результату (наприклад, дискримінованим об'єднанням Result з 12-го уроку) або обробити через try/catch навколо await — TypeScript не примушує це робити автоматично (на відміну від типів значень), але дисципліноване моделювання помилок — ознака якісного TS-коду в реальних проєктах.",
    examples: [
      { title: "async-функція з типізованим Promise", code: `interface Task {\n  id: number;\n  title: string;\n}\n\nasync function loadTasks(): Promise<Task[]> {\n  return [\n    { id: 1, title: "Купити хліб" },\n    { id: 2, title: "Погуляти" },\n  ];\n}\n\nasync function main(): Promise<void> {\n  const tasks: Task[] = await loadTasks();\n  console.log(tasks.length);\n}\nmain();`, explain: "loadTasks оголошена як Promise<Task[]>, а await у main() розпаковує це до звичайного Task[]." },
    ],
    task: "Оголоси interface Task { id: number; title: string }. Напиши async function loadTasks(): Promise<Task[]>, що повертає масив із двох задач. Напиши async function main(): Promise<void>, що через await отримує tasks і виводить tasks.length. Виклич main().",
    starter: `interface Task {\n  id: number;\n  title: string;\n}\n\nasync function loadTasks(): Promise<Task[]> {\n  // твій код тут\n}\n\nasync function main(): Promise<void> {\n  // твій код тут\n}\n\n// main();\n`,
    hints: [
      "loadTasks() просто повертає готовий масив об'єктів Task — return у async-функції автоматично обгортається в Promise.",
      "У main(): const tasks = await loadTasks(); console.log(tasks.length);",
      `interface Task {\n  id: number;\n  title: string;\n}\n\nasync function loadTasks(): Promise<Task[]> {\n  return [\n    { id: 1, title: "Купити хліб" },\n    { id: 2, title: "Погуляти" },\n  ];\n}\n\nasync function main(): Promise<void> {\n  const tasks = await loadTasks();\n  console.log(tasks.length);\n}\n\nmain();`,
    ],
    solution: `interface Task {\n  id: number;\n  title: string;\n}\n\nasync function loadTasks(): Promise<Task[]> {\n  return [\n    { id: 1, title: "Купити хліб" },\n    { id: 2, title: "Погуляти" },\n  ];\n}\n\nasync function main(): Promise<void> {\n  const tasks = await loadTasks();\n  console.log(tasks.length);\n}\n\nmain();`,
    testCode: `if (typeof loadTasks !== 'function') return {pass:false, message:"Потрібна функція loadTasks."};\nconst result = await loadTasks();\nif (!Array.isArray(result) || result.length !== 2) return {pass:false, message:"loadTasks() має повернути масив із двох задач."};\nreturn {pass:true, message:"Promise<Task[]> + await — типи узгоджуються автоматично на кожному кроці асинхронного коду, без жодного any."};`,
  },
  {
    id: "ts-20",
    title: "Фінальний проєкт: типізований Task Manager",
    type: "ts",
    theory:
      "Останній крок: об'єднати ВСЕ, що було зроблено за 19 уроків, в один цілісний, повністю типізований модуль — TaskManager. Це поєднує: interface (5) для форми задачі, Omit (16) для форми створення нової задачі без id, generic-клас (15) як контейнер, private-поле й методи (9), масивові map/filter/find зі збереженими типами (18), і union-тип статусу (7).\n\nTaskManager матиме: private масив tasks (Task[]), метод add(data: Omit<Task, \"id\" | \"done\">): Task, що сам генерує наступний id і встановлює done: false, метод complete(id: number): void, метод getAll(): Task[], метод getStats(): { total: number; done: number }. Кожен метод типізований так само суворо, як в окремих уроках — але тепер усе разом, в одному класі, як цілісна одиниця, яку легко перевикористати в будь-якому реальному TS-проєкті (Node.js-бекенді, React-компоненті, консольній утиліті).\n\nЦе і є проєкт, обіцяний ще на вступній сторінці «Що це?»: типізований модуль керування задачами. Усе, що з ним відбувається на цьому уроці, є результатом рішень, ухвалених крок за кроком за 19 попередніх уроків, а не одного великого стрибка в кінці.",
    examples: [
      { title: "TaskManager — фінальна збірка", code: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\nclass TaskManager {\n  private tasks: Task[] = [];\n  private nextId: number = 1;\n\n  add(data: Omit<Task, "id" | "done">): Task {\n    const task: Task = { id: this.nextId++, title: data.title, done: false };\n    this.tasks.push(task);\n    return task;\n  }\n\n  complete(id: number): void {\n    const task = this.tasks.find(t => t.id === id);\n    if (task) task.done = true;\n  }\n\n  getAll(): Task[] {\n    return this.tasks;\n  }\n\n  getStats(): { total: number; done: number } {\n    return { total: this.tasks.length, done: this.tasks.filter(t => t.done).length };\n  }\n}\n\nconst manager = new TaskManager();\nmanager.add({ title: "Купити хліб" });\nconsole.log(manager.getStats());`, explain: "add() приймає лише title (через Omit), сам генерує id і done — точнісінько так, як мала б працювати форма створення нової задачі." },
    ],
    task: 'Допиши клас TaskManager: add(data: Omit<Task, "id" | "done">): Task (генерує id через this.nextId++, done: false), complete(id: number): void (знаходить задачу і ставить done = true), getStats(): { total: number; done: number }. Додай дві задачі, познач одну виконаною, виведи getStats().',
    starter: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\nclass TaskManager {\n  private tasks: Task[] = [];\n  private nextId: number = 1;\n\n  add(data: Omit<Task, "id" | "done">): Task {\n    // твій код тут\n  }\n\n  complete(id: number): void {\n    // твій код тут\n  }\n\n  getAll(): Task[] {\n    return this.tasks;\n  }\n\n  getStats(): { total: number; done: number } {\n    // твій код тут\n  }\n}\n\nconst manager = new TaskManager();\nmanager.add({ title: "Купити хліб" });\nmanager.add({ title: "Погуляти" });\nmanager.complete(1);\n\n// console.log(manager.getStats());\n`,
    hints: [
      "add(): створи task = { id: this.nextId++, title: data.title, done: false }, поклади в this.tasks і поверни його.",
      "complete(): знайди задачу через this.tasks.find(t => t.id === id) і, якщо знайдено, постав done = true. getStats(): поверни { total: this.tasks.length, done: this.tasks.filter(t => t.done).length }.",
      `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\nclass TaskManager {\n  private tasks: Task[] = [];\n  private nextId: number = 1;\n\n  add(data: Omit<Task, "id" | "done">): Task {\n    const task: Task = { id: this.nextId++, title: data.title, done: false };\n    this.tasks.push(task);\n    return task;\n  }\n\n  complete(id: number): void {\n    const task = this.tasks.find(t => t.id === id);\n    if (task) task.done = true;\n  }\n\n  getAll(): Task[] {\n    return this.tasks;\n  }\n\n  getStats(): { total: number; done: number } {\n    return { total: this.tasks.length, done: this.tasks.filter(t => t.done).length };\n  }\n}\n\nconst manager = new TaskManager();\nmanager.add({ title: "Купити хліб" });\nmanager.add({ title: "Погуляти" });\nmanager.complete(1);\n\nconsole.log(manager.getStats());`,
    ],
    solution: `interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\nclass TaskManager {\n  private tasks: Task[] = [];\n  private nextId: number = 1;\n\n  add(data: Omit<Task, "id" | "done">): Task {\n    const task: Task = { id: this.nextId++, title: data.title, done: false };\n    this.tasks.push(task);\n    return task;\n  }\n\n  complete(id: number): void {\n    const task = this.tasks.find(t => t.id === id);\n    if (task) task.done = true;\n  }\n\n  getAll(): Task[] {\n    return this.tasks;\n  }\n\n  getStats(): { total: number; done: number } {\n    return { total: this.tasks.length, done: this.tasks.filter(t => t.done).length };\n  }\n}\n\nconst manager = new TaskManager();\nmanager.add({ title: "Купити хліб" });\nmanager.add({ title: "Погуляти" });\nmanager.complete(1);\n\nconsole.log(manager.getStats());`,
    testCode: `if (typeof TaskManager !== 'function') return {pass:false, message:"Потрібен клас TaskManager."};\nif (typeof manager === 'undefined') return {pass:false, message:"Потрібен екземпляр manager."};\nconst all = manager.getAll();\nif (!Array.isArray(all) || all.length !== 2) return {pass:false, message:"Після двох add() getAll() має повернути масив із двох задач."};\nconst stats = manager.getStats();\nif (!stats || stats.total !== 2 || stats.done !== 1) return {pass:false, message:"getStats() має повернути { total: 2, done: 1 } (зараз: " + JSON.stringify(stats) + ")."};\nreturn {pass:true, message:"Готово! Це і є завершений типізований TaskManager — inter­face, generics, Omit, private-стан і типізовані методи, зібрані тобою крок за кроком за 20 уроків."};`,
    finalProject: {
      techs: ["TypeScript 5", "interface", "generics", "utility types (Omit, Partial, Record)", "класи з private/readonly", "discriminated unions"],
      skills: [
        "Базові типи, масиви, кортежі та об'єктні типи",
        "interface та type, union і intersection типи",
        "Класи з модифікаторами доступу та implements",
        "Type narrowing (typeof/instanceof) і дискриміновані об'єднання",
        "Generics для функцій, інтерфейсів і класів",
        "Utility types (Partial, Pick, Omit, Readonly, Record)",
      ],
      structure:
        "taskManager.ts\n  ├── interface Task               # форма однієї задачі\n  ├── class TaskManager\n  │     ├── add(data)              # створити задачу (Omit<Task, \"id\"|\"done\">)\n  │     ├── complete(id)           # позначити виконаною\n  │     ├── getAll()               # усі задачі\n  │     └── getStats()             # { total, done }\n  └── const manager = new TaskManager()",
      code: `interface Task {
  id: number;
  title: string;
  done: boolean;
}

class TaskManager {
  private tasks: Task[] = [];
  private nextId: number = 1;

  add(data: Omit<Task, "id" | "done">): Task {
    const task: Task = { id: this.nextId++, title: data.title, done: false };
    this.tasks.push(task);
    return task;
  }

  complete(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) task.done = true;
  }

  getAll(): Task[] {
    return this.tasks;
  }

  getStats(): { total: number; done: number } {
    return { total: this.tasks.length, done: this.tasks.filter(t => t.done).length };
  }
}

const manager = new TaskManager();
manager.add({ title: "Купити хліб" });
manager.add({ title: "Погуляти" });
manager.complete(1);

console.log(manager.getStats());`,
      runCommand: "npx tsc taskManager.ts && node taskManager.js",
      installGuide: {
        intro: "Щоб запустити цей файл на власному комп'ютері поза браузером, потрібні Node.js і пакет typescript (компілятор командного рядка tsc).",
        steps: [
          { title: "Встанови Node.js", text: "Завантаж LTS-версію з nodejs.org і встанови — це дасть команди node і npm у терміналі." },
          { title: "Встанови TypeScript глобально", code: "npm install -g typescript" },
          { title: "Збережи файл", text: "Скопіюй фінальний код у файл taskManager.ts у порожній папці." },
          { title: "Скомпілюй і запусти", code: "npx tsc taskManager.ts\nnode taskManager.js", text: "Побачиш { total: 2, done: 1 } у консолі." },
        ],
      },
      improvements: [
        "Додати метод remove(id: number): void для видалення задачі",
        "Додати поле priority: \"low\" | \"medium\" | \"high\" (union із 7-го уроку)",
        "Зберігати задачі у файл через fs.writeFileSync (у форматі JSON)",
        "Обгорнути TaskManager у клас-адаптер для реального API (fetch замість масиву в пам'яті)",
      ],
      nextLevel:
        "Далі — курс Frontend: той самий TaskManager можна підключити до реальної HTML/CSS/JS сторінки — форма додавання задачі, список, що оновлюється, і статистика на екрані, замість виводу в консоль.",
    },
  },
];
