// Full Stack — the closing course, tying git, a Linux-style shell, and
// deployment concepts (Docker, CI/CD, client-server architecture) into one
// workflow around the same shop project from SQL/Backend.
//
// Real TCP servers, a real git binary, and a real Linux kernel are all
// impossible in a browser sandbox — so git and shell lessons run against
// small, purpose-built in-memory engines (MINI_GIT_SOURCE / MINI_SHELL_SOURCE
// below) that genuinely implement the CORE mechanics: staging really stages,
// commit really creates a commit-graph node with a parent pointer, branch
// really creates a pointer, merge really combines two file snapshots; cd/ls/
// mkdir/rm really operate on a real (virtual) file tree with real path
// resolution (.., absolute vs relative). This is the exact same "reuse the
// existing JS sandbox via an optional harness" mechanism the Backend course
// introduced (see buildJsSandboxDoc's `harness` param in App.jsx) — nothing
// new needed there. Only the SHA-1 object format and the real filesystem/
// network are simplified away; the workflow (init → add → commit → branch →
// merge, or cd → mkdir → touch → grep) is the real one.
//
// Docker/CI-CD/deployment lessons can't execute at all (no container runtime
// in a browser) — those use a new "text" lesson type (regex-validated raw
// text, the same mechanism the CSS course already uses for its `tests`
// array, just without the HTML/CSS preview wrapper): the learner writes a
// real Dockerfile/docker-compose.yml/.env/CI-workflow, and it's checked for
// the concrete lines a working one needs.
const MINI_GIT_SOURCE = `
function createRepo() {
  let files = {};
  let staged = {};
  const commits = [];
  const branches = { main: null };
  let currentBranch = 'main';
  let nextId = 1;
  return {
    writeFile(path, content) { files[path] = content; },
    readFile(path) { return files[path]; },
    listFiles() { return Object.keys(files).sort(); },
    add(path) {
      if (path === '.') { staged = Object.assign({}, staged, files); }
      else { staged[path] = files[path]; }
    },
    stagedFiles() { return Object.keys(staged).sort(); },
    commit(message) {
      if (Object.keys(staged).length === 0) throw new Error('Nothing to commit (staging area is empty)');
      const id = 'c' + nextId++;
      const parent = branches[currentBranch];
      const snapshot = Object.assign({}, staged);
      commits.push({ id, message, snapshot, parent, branch: currentBranch });
      branches[currentBranch] = id;
      staged = {};
      return id;
    },
    log() {
      const result = [];
      let cur = branches[currentBranch];
      while (cur) {
        const c = commits.find((x) => x.id === cur);
        result.push({ id: c.id, message: c.message });
        cur = c.parent;
      }
      return result;
    },
    branch(name) {
      if (branches[currentBranch] === null) throw new Error('Cannot create a branch before the first commit');
      branches[name] = branches[currentBranch];
    },
    listBranches() { return Object.keys(branches).sort(); },
    currentBranchName() { return currentBranch; },
    checkout(name) {
      if (!(name in branches)) throw new Error('Branch not found: ' + name);
      currentBranch = name;
      const commitId = branches[name];
      const c = commits.find((x) => x.id === commitId);
      files = c ? Object.assign({}, c.snapshot) : {};
      staged = {};
    },
    merge(name) {
      if (!(name in branches)) throw new Error('Branch not found: ' + name);
      const commitId = branches[name];
      const c = commits.find((x) => x.id === commitId);
      if (!c) throw new Error('Nothing to merge from ' + name);
      const merged = Object.assign({}, files, c.snapshot);
      const id = 'c' + nextId++;
      commits.push({ id, message: 'Merge branch ' + name, snapshot: merged, parent: branches[currentBranch] });
      branches[currentBranch] = id;
      files = merged;
      staged = {};
      return id;
    },
  };
}
`;

const MINI_SHELL_SOURCE = `
function createShell() {
  const nodes = {
    '/': { type: 'dir', mode: 'rwxr-xr-x' },
    '/home': { type: 'dir', mode: 'rwxr-xr-x' },
    '/home/user': { type: 'dir', mode: 'rwxr-xr-x' },
  };
  let cwd = '/home/user';
  function resolve(path) {
    if (!path) return cwd;
    const base = path.startsWith('/') ? '' : cwd;
    const parts = (base + '/' + path).split('/').filter(Boolean);
    const stack = [];
    for (const part of parts) {
      if (part === '.') continue;
      else if (part === '..') stack.pop();
      else stack.push(part);
    }
    return '/' + stack.join('/');
  }
  function parentOf(path) {
    const idx = path.lastIndexOf('/');
    return idx <= 0 ? '/' : path.slice(0, idx);
  }
  function requireDir(path) {
    const n = nodes[path];
    if (!n) throw new Error('No such file or directory: ' + path);
    if (n.type !== 'dir') throw new Error('Not a directory: ' + path);
    return n;
  }
  return {
    pwd() { return cwd; },
    mkdir(path) {
      const full = resolve(path);
      requireDir(parentOf(full));
      if (nodes[full]) throw new Error('File exists: ' + full);
      nodes[full] = { type: 'dir', mode: 'rwxr-xr-x' };
    },
    touch(path) {
      const full = resolve(path);
      requireDir(parentOf(full));
      if (!nodes[full]) nodes[full] = { type: 'file', mode: 'rw-r--r--', content: '' };
    },
    writeFile(path, content) {
      const full = resolve(path);
      requireDir(parentOf(full));
      nodes[full] = { type: 'file', mode: (nodes[full] && nodes[full].mode) || 'rw-r--r--', content };
    },
    readFile(path) {
      const full = resolve(path);
      const n = nodes[full];
      if (!n) throw new Error('No such file or directory: ' + full);
      if (n.type !== 'file') throw new Error('Is a directory: ' + full);
      return n.content;
    },
    ls(path) {
      const full = resolve(path || '.');
      requireDir(full);
      const prefix = full === '/' ? '/' : full + '/';
      const names = new Set();
      for (const p of Object.keys(nodes)) {
        if (p === full) continue;
        if (p.startsWith(prefix)) {
          const rest = p.slice(prefix.length);
          if (!rest.includes('/')) names.add(rest);
        }
      }
      return Array.from(names).sort();
    },
    cd(path) {
      const full = resolve(path);
      requireDir(full);
      cwd = full;
    },
    rm(path) {
      const full = resolve(path);
      if (!nodes[full]) throw new Error('No such file or directory: ' + full);
      delete nodes[full];
    },
    chmod(mode, path) {
      const full = resolve(path);
      if (!nodes[full]) throw new Error('No such file or directory: ' + full);
      nodes[full].mode = mode;
    },
    stat(path) {
      const full = resolve(path);
      const n = nodes[full];
      if (!n) throw new Error('No such file or directory: ' + full);
      return { type: n.type, mode: n.mode };
    },
    grep(term, path) {
      const content = this.readFile(path);
      return content.split('\\n').filter((line) => line.includes(term));
    },
  };
}
`;

function gitHarness(seed) {
  return MINI_GIT_SOURCE + "\nconst repo = createRepo();\n" + (seed || "") + "\n";
}
function shellHarness(seed) {
  return MINI_SHELL_SOURCE + "\nconst shell = createShell();\n" + (seed || "") + "\n";
}

export const FULLSTACK_LESSONS = [
  {
    id: "fullstack-intro",
    title: "Що це? — Full Stack",
    type: "intro",
    theory:
      "Full Stack — це не «ще одна мова» чи бібліотека, а те, що ОБ'ЄДНУЄ всі попередні курси в один робочий процес: код (Frontend/Backend/SQL) треба ЗБЕРІГАТИ й РОЗВИВАТИ разом з командою (git), розгортати в передбачуваному середовищі (Docker), і зрештою виставляти в реальний інтернет (deployment, CI/CD). Це «клей» між написанням коду і його появою в реальному застосунку, яким користуються люди.\n\nУ цьому курсі git-команди й команди virtual-оболонки (shell) виконуються ПО-СПРАВЖНЬОМУ: власний, спрощений, але РЕАЛЬНО ПРАЦЮЮЧИЙ движок відтворює саму механіку git (staging → commit → branch → merge, зі справжнім графом комітів і батьківськими посиланнями) і файлової системи (cd/ls/mkdir/rm із реальним розбором шляхів, включно з .. і абсолютними шляхами) — це не імітація тексту, а працююча логіка. Реального git-бінарника чи ядра Linux в браузерній пісочниці не існує, тому формат об'єктів git (SHA-1) і справжня ОС спрощені — сам робочий процес лишається справжнім.\n\nDocker, CI/CD і розгортання неможливо ЗАПУСТИТИ в браузері взагалі (потрібен реальний контейнерний рушій) — ці уроки навчають ПИСАТИ реальні конфігураційні файли (Dockerfile, docker-compose.yml, .env, CI-workflow), які перевіряються на відповідність тому, що дійсно потрібне робочому файлу, так само, як CSS-курс перевіряє написаний CSS.\n\nЩо ти отримаєш після цього курсу: впевнене володіння git (staging, коміти, гілки, злиття), базовими командами Linux-подібної оболонки, і розуміння того, як реальний проєкт (той самий магазин з курсів SQL і Backend) готують до розгортання — Dockerfile, docker-compose, .env, CI/CD-пайплайн.",
    presentation: [
      { title: "Full Stack коротко", points: ["Об'єднує весь попередній код в один робочий процес", "git і shell-команди тут виконуються по-справжньому (власний движок)", "Docker/CI/CD — реальні конфігураційні файли, перевірені на відповідність"] },
      { title: "Результат", points: ["Понад 20 уроків: git, shell, Docker, CI/CD, архітектура", "Фінал: повний git-цикл для проєкту магазину", "Кожна git/shell-команда реально виконується й перевіряється"] },
    ],
  },
  {
    id: "fullstack-1",
    title: "git init і три області git",
    type: "js",
    harness: gitHarness(""),
    theory:
      "git — система контролю версій: вона запам'ятовує КОЖЕН стан проєкту в часі, дозволяючи повернутись до будь-якої попередньої версії, побачити, ХТО і ЩО саме змінив, і безпечно працювати кільком людям над одним кодом одночасно. git init перетворює звичайну папку на git-репозиторій — з цього моменту git готовий відстежувати зміни.\n\nУсередині git-робочого процесу є ТРИ області: робоча директорія (working directory — файли, які ти редагуєш прямо зараз, «сирі», ще нічим не відстежені формально), область підготовки (staging area / index — файли, позначені «ці зміни готові потрапити в наступний комітет»), і сам репозиторій (репо — уже ЗБЕРЕЖЕНА історія комітів). Файл проходить шлях: working directory → (git add) → staging → (git commit) → репозиторій.\n\nУ цьому курсі об'єкт repo — власний, спрощений git-движок: repo.writeFile(шлях, вміст) записує файл у робочу директорію (те, що ти щойно редагував(-ла)) — саме з цього і починається робота з будь-яким файлом, ще ДО git add.",
    examples: [
      { title: "Запис файлу в робочу директорію", code: `repo.writeFile('README.md', '# Мій проєкт');`, explain: "Файл існує, але ще НЕ відстежується git — це лише 'сира' робоча директорія, перший крок перед git add." },
    ],
    task: "Створи файл README.md з вмістом '# Мій проєкт' у робочій директорії (repo.writeFile).",
    starter: `// твій код тут\n`,
    hints: [
      "repo.writeFile('README.md', '...');",
      "Другий аргумент — вміст файлу, рядок.",
      `repo.writeFile('README.md', '# Мій проєкт');`,
    ],
    solution: `repo.writeFile('README.md', '# Мій проєкт');`,
    testCode: `if (repo.readFile('README.md') !== '# Мій проєкт') return {pass:false, message:"README.md має містити рівно '# Мій проєкт'."};\nreturn {pass:true, message:"Робоча директорія — перша з трьох областей git: тут файл існує, але ще нічим не відстежений формально."};`,
  },
  {
    id: "fullstack-2",
    title: "git add: область підготовки",
    type: "js",
    harness: gitHarness("repo.writeFile('README.md', '# Мій проєкт');\nrepo.writeFile('index.js', 'console.log(1);');"),
    theory:
      "git add переміщує зміни з робочої директорії в область підготовки (staging) — позначає файл «готовий увійти в наступний коміт». git add конкретний-файл додає лише його, git add . додає УСІ змінені файли робочої директорії одразу.\n\nЦей проміжний крок — не формальність: він дозволяє закомітити лише ЧАСТИНУ змінених файлів, лишивши решту «на потім» — наприклад, коли одна логічна зміна стосується двох файлів, а третій ще не готовий. Комміт відображає САМЕ те, що потрапило в staging, а не все, що взагалі змінено в робочій директорії.\n\nrepo.stagedFiles() (у цьому курсі — навчальний допоміжний метод, якого немає в реальному git, там для цього є git status) показує, які файли зараз у staging і чекають на коміт.",
    examples: [
      { title: "Додавання всіх файлів одразу", code: `repo.add('.');`, explain: "Крапка означає 'усі змінені файли робочої директорії' — усі одразу потрапляють у staging." },
    ],
    task: "Додай ОБИДВА файли (README.md та index.js, уже записані в робочій директорії) у staging одним викликом repo.add('.').",
    starter: `// твій код тут\n`,
    hints: [
      "repo.add('.') — крапка означає 'усі файли'.",
      "Не потрібно викликати add окремо для кожного файлу.",
      `repo.add('.');`,
    ],
    solution: `repo.add('.');`,
    testCode: `const staged = repo.stagedFiles();\nif (staged.length !== 2 || !staged.includes('README.md') || !staged.includes('index.js')) return {pass:false, message:"У staging мають бути обидва файли: README.md і index.js (зараз: " + JSON.stringify(staged) + ")."};\nreturn {pass:true, message:"git add . — найчастіший спосіб підготувати ВСІ зміни робочої директорії до коміту одним викликом."};`,
  },
  {
    id: "fullstack-3",
    title: "git commit: збереження знімку",
    type: "js",
    harness: gitHarness("repo.writeFile('README.md', '# Мій проєкт');\nrepo.add('.');"),
    theory:
      "git commit зберігає ВСЕ, що зараз у staging, як один НАЗАВЖДИ зафіксований знімок проєкту (snapshot), з обов'язковим повідомленням (message), що коротко пояснює, ЩО і НАВІЩО змінилось. Після коміту staging area спорожняється — наступний коміт знову почнеться з чистого аркуша.\n\nГарне повідомлення коміту описує ЗМІСТ зміни ('Add user authentication'), а не механічний факт ('changes' чи 'update') — за кілька місяців саме повідомлення допоможе зрозуміти історію проєкту, не перечитуючи весь код заново.\n\nЯкщо спробувати закомітити, коли staging area ПОРОЖНЯ (нічого не додано через git add) — git (і наш repo) відмовиться: nothing to commit — коміт без жодних змін не має сенсу.",
    examples: [
      { title: "Коміт зі змістовним повідомленням", code: `repo.add('.');\nrepo.commit('Initial commit: add README');`, explain: "Повідомлення описує ЗМІСТ, не просто факт зміни." },
    ],
    task: "Закомить вже підготовлений (staged) README.md з повідомленням 'Initial commit'.",
    starter: `// твій код тут\n`,
    hints: [
      "repo.commit('...');",
      "README.md уже в staging — просто виклич commit з повідомленням.",
      `repo.commit('Initial commit');`,
    ],
    solution: `repo.commit('Initial commit');`,
    testCode: `const log = repo.log();\nif (log.length !== 1) return {pass:false, message:"Має бути рівно 1 коміт (зараз: " + log.length + ")."};\nif (log[0].message !== 'Initial commit') return {pass:false, message:"Повідомлення коміту має бути 'Initial commit' (зараз: '" + log[0].message + "')."};\nreturn {pass:true, message:"git commit зберігає знімок staging area НАЗАВЖДИ в історію — з обов'язковим поясненням, що саме змінилось."};`,
  },
  {
    id: "fullstack-4",
    title: "git log: історія комітів",
    type: "js",
    harness: gitHarness(""),
    theory:
      "git log показує ІСТОРІЮ комітів — від найновішого до найпершого, кожен зі своїм ідентифікатором і повідомленням. Це щоденний інструмент: подивитись, ЩО змінювалось, у якому порядку, і повернутись подумки до будь-якого моменту розробки.\n\nКожен коміт (окрім найпершого) має «батька» (parent) — попередній коміт, з якого він виріс — так утворюється ЛАНЦЮЖОК (у реальному git — навіть ГРАФ, з розгалуженнями через branch/merge): repo.log() у цьому курсі проходить саме цим ланцюжком від поточного стану назад до самого початку.\n\nПорядок git log — від НОВІШОГО до СТАРІШОГО (найостанніший коміт першим) — саме так найчастіше й потрібно: спочатку побачити, що змінилось НЕЩОДАВНО.",
    examples: [
      { title: "Два коміти в історії", code: `repo.writeFile('a.txt', 'A');\nrepo.add('.');\nrepo.commit('Add a.txt');\nrepo.writeFile('b.txt', 'B');\nrepo.add('.');\nrepo.commit('Add b.txt');`, explain: "repo.log() поверне ['Add b.txt', 'Add a.txt'] — новіший коміт першим." },
    ],
    task: "Зроби ДВА окремі коміти: спочатку створи й закомить a.txt з повідомленням 'Add a.txt', потім b.txt з повідомленням 'Add b.txt'.",
    starter: `// твій код тут\n`,
    hints: [
      "writeFile → add → commit, двічі поспіль, для різних файлів.",
      "Кожен файл — окремий коміт, не один спільний.",
      `repo.writeFile('a.txt', 'A');\nrepo.add('.');\nrepo.commit('Add a.txt');\nrepo.writeFile('b.txt', 'B');\nrepo.add('.');\nrepo.commit('Add b.txt');`,
    ],
    solution: `repo.writeFile('a.txt', 'A');\nrepo.add('.');\nrepo.commit('Add a.txt');\nrepo.writeFile('b.txt', 'B');\nrepo.add('.');\nrepo.commit('Add b.txt');`,
    testCode: `const log = repo.log();\nif (log.length !== 2) return {pass:false, message:"Мають бути рівно 2 коміти (зараз: " + log.length + ")."};\nif (log[0].message !== 'Add b.txt' || log[1].message !== 'Add a.txt') return {pass:false, message:"Порядок має бути НОВІШИЙ ПЕРШИМ: 'Add b.txt', потім 'Add a.txt' (зараз: " + JSON.stringify(log.map(c=>c.message)) + ")."};\nreturn {pass:true, message:"git log показує історію від найновішого коміту до найпершого — кожен наступний коміт 'виростає' зі свого попередника."};`,
  },
  {
    id: "fullstack-5",
    title: ".gitignore: що НЕ відстежувати",
    type: "text",
    theory:
      "Не кожен файл проєкту варто зберігати в git: залежності (node_modules — тисячі файлів, які завжди можна перевстановити командою npm install), секрети (.env з паролями й ключами API — НІКОЛИ не повинні потрапити в спільну історію, доступну всій команді чи навіть публічно на GitHub), тимчасові файли й логи (*.log). .gitignore — звичайний текстовий файл у корені проєкту, що каже git: «ці шляхи й патерни — ігноруй, навіть не пропонуй додати їх через git add .».\n\nКожен рядок .gitignore — окремий патерн: node_modules ігнорує папку з такою назвою будь-де в проєкті, *.log ігнорує УСІ файли з розширенням .log (зірочка — «будь-який текст»), .env ігнорує саме цей файл.\n\nЗабутий .gitignore — одна з найпоширеніших причин витоку секретів (паролі бази даних, API-ключі) у публічні репозиторії: якщо .env вже ЗАКОМІЧЕНО до того, як його додали в .gitignore, сам .gitignore більше не допоможе — файл уже в історії назавжди (доведеться спеціально переписувати історію, що набагато складніше, ніж просто не допустити цього спочатку).",
    examples: [
      { title: "Типовий .gitignore для Node-проєкту", code: `node_modules\n.env\n*.log\ndist`, explain: "Чотири патерни: залежності, секрети, логи, зібраний білд — жоден з них не повинен потрапляти в git-історію." },
    ],
    task: "Напиши вміст файлу .gitignore, що виключає: папку node_modules, файл .env, і всі файли з розширенням .log.",
    starter: `# .gitignore\n`,
    hints: [
      "Кожен патерн — на окремому рядку, без ком чи інших роздільників.",
      "*.log — зірочка означає 'будь-яка назва з таким розширенням'.",
      `node_modules\n.env\n*.log`,
    ],
    solution: `node_modules\n.env\n*.log`,
    successMessage: ".gitignore захищає секрети й тримає репозиторій чистим від того, що завжди можна відтворити заново.",
    tests: [
      { re: /node_modules/, msg: "Має бути виключено node_modules." },
      { re: /\.env/, msg: "Має бути виключено .env (файл із секретами)." },
      { re: /\*\.log/, msg: "Має бути виключено *.log (усі лог-файли)." },
    ],
  },
  {
    id: "fullstack-6",
    title: "git branch: паралельна лінія розробки",
    type: "js",
    harness: gitHarness("repo.writeFile('README.md', '# Проєкт');\nrepo.add('.');\nrepo.commit('Initial commit');"),
    theory:
      "Гілка (branch) — незалежна лінія розробки: git branch feature створює НОВУ гілку з іменем feature, що вказує на ТОЙ САМИЙ коміт, що й поточна (зазвичай main) — на цьому етапі гілки ще нічим не відрізняються, розбіжність з'явиться лише після НАСТУПНИХ комітів У НІЙ.\n\nГілки дозволяють працювати над новою функцією, не чіпаючи стабільний код у main: якщо експеримент не вдався — гілку просто видаляють, і main лишається незачепленим; якщо вдався — гілку зливають (merge, наступний урок) назад у main.\n\nСтворення гілки САМЕ ПО СОБІ не перемикає на неї поточну роботу — для цього потрібен git checkout (наступний урок). git branch без імені (тут — repo.listBranches()) показує список УСІХ наявних гілок.",
    examples: [
      { title: "Створення нової гілки", code: `repo.branch('feature');`, explain: "feature тепер існує й вказує на той самий коміт, що й main — але ПОТОЧНОЮ гілкою лишається main, доки не викликано checkout." },
    ],
    task: "Створи нову гілку з іменем 'feature' (repo.branch).",
    starter: `// твій код тут\n`,
    hints: [
      "repo.branch('feature');",
      "Коміт уже є (з harness) — гілку можна створювати лише ПІСЛЯ першого коміту.",
      `repo.branch('feature');`,
    ],
    solution: `repo.branch('feature');`,
    testCode: `const branches = repo.listBranches();\nif (!branches.includes('feature')) return {pass:false, message:"Гілка 'feature' не знайдена (наявні: " + JSON.stringify(branches) + ")."};\nif (repo.currentBranchName() !== 'main') return {pass:false, message:"Поточна гілка досі має бути 'main' — branch лише СТВОРЮЄ гілку, не перемикає на неї."};\nreturn {pass:true, message:"git branch створює нову ЛІНІЮ розробки — незалежну від main, доки її явно не зіллють назад."};`,
  },
  {
    id: "fullstack-7",
    title: "git checkout: перемикання гілок",
    type: "js",
    harness: gitHarness("repo.writeFile('main.txt', 'main version');\nrepo.add('.');\nrepo.commit('Initial commit');\nrepo.branch('feature');"),
    theory:
      "git checkout ім'я-гілки перемикає РОБОЧУ ДИРЕКТОРІЮ на стан ЦІЄЇ гілки — файли на диску (у нашому русі — файли, повернуті repo.readFile) відповідатимуть саме тому знімку, на який вказує ця гілка. Перемкнувшись на feature, можна робити нові коміти, що впливають ЛИШЕ на неї, доки не станеться злиття.\n\nЦе природний спосіб ізолювати роботу: поки ти на feature, будь-які коміти НЕ торкаються main — колеги, що продовжують працювати з main, навіть не побачать твоїх незавершених змін, доки ти сама не зіллєш їх.\n\nУ сучасному git тій самій команді відповідає й git switch (введена пізніше спеціально для перемикання гілок, тоді як checkout історично робить більше різних речей) — але checkout лишається найпоширенішим, знайомим усім варіантом.",
    examples: [
      { title: "Перемикання й коміт на новій гілці", code: `repo.checkout('feature');\nrepo.writeFile('feature.txt', 'new feature');\nrepo.add('.');\nrepo.commit('Add feature');`, explain: "Коміт 'Add feature' існує ЛИШЕ на гілці feature — main про нього поки що 'не знає'." },
    ],
    task: "Перемкнись на гілку 'feature' (repo.checkout), створи файл feature.txt з вмістом 'new feature', додай і закомить його з повідомленням 'Add feature'.",
    starter: `// твій код тут\n`,
    hints: [
      "repo.checkout('feature'); спочатку.",
      "Потім writeFile → add → commit, як у попередніх уроках.",
      `repo.checkout('feature');\nrepo.writeFile('feature.txt', 'new feature');\nrepo.add('.');\nrepo.commit('Add feature');`,
    ],
    solution: `repo.checkout('feature');\nrepo.writeFile('feature.txt', 'new feature');\nrepo.add('.');\nrepo.commit('Add feature');`,
    testCode: `if (repo.currentBranchName() !== 'feature') return {pass:false, message:"Поточна гілка має бути 'feature' (зараз: '" + repo.currentBranchName() + "')."};\nif (!repo.listFiles().includes('feature.txt')) return {pass:false, message:"feature.txt має існувати на гілці feature."};\nrepo.checkout('main');\nif (repo.listFiles().includes('feature.txt')) return {pass:false, message:"feature.txt НЕ повинен бути видимий на main — коміт існує лише на feature, доки не станеться merge."};\nreturn {pass:true, message:"checkout перемикає робочу директорію на стан ІНШОЇ гілки — коміти на feature не торкаються main, доки їх явно не зіллють."};`,
  },
  {
    id: "fullstack-8",
    title: "git merge: злиття гілок",
    type: "js",
    harness: gitHarness(
      "repo.writeFile('main.txt', 'main version');\nrepo.add('.');\nrepo.commit('Initial commit');\nrepo.branch('feature');\nrepo.checkout('feature');\nrepo.writeFile('feature.txt', 'feature work');\nrepo.add('.');\nrepo.commit('Add feature');\nrepo.checkout('main');"
    ),
    theory:
      "git merge ім'я-гілки ОБ'ЄДНУЄ зміни з іншої гілки в ПОТОЧНУ: git checkout main; git merge feature переносить усе, що було зроблено на feature, назад у main — з цього моменту main містить обидві лінії роботи разом. Це завершальний крок будь-якого гілкування: розробив окремо, перевірив, зілив назад.\n\nЗлиття створює НОВИЙ коміт (merge commit) — у РЕАЛЬНОМУ git він має ДВОМА батьками одразу (посилання і на попередній стан main, і на останній коміт feature), саме так в історії видно МОМЕНТ, коли дві лінії розробки знову з'єдналися в одну; спрощений repo.log() цього курсу показує лише один прямий ланцюжок, тому окремий коміт 'Add feature' з гілки в ньому не з'явиться, хоча файли з нього — так.\n\nЯкщо ОБИДВІ гілки змінили ОДИН і той самий рядок одного файлу по-різному — виникає конфлікт злиття (merge conflict), і git не може вирішити його автоматично; людині доводиться вручну обрати, яку версію лишити. Наш спрощений repo.merge() для навчальної простоти завжди вирішує такі ситуації на користь гілки, ЩО ЗЛИВАЄТЬСЯ (тут — feature), без явного конфлікту.",
    examples: [
      { title: "Перемикання на main і злиття", code: `repo.checkout('main');\nrepo.merge('feature');`, explain: "Після цього main міститиме і main.txt, і feature.txt — обидві лінії роботи разом." },
    ],
    task: "Перебуваючи на main (уже перемкнено), злий гілку 'feature' у main (repo.merge).",
    starter: `// твій код тут\n`,
    hints: [
      "repo.merge('feature');",
      "Поточна гілка вже main — merge зливає ЗАЗНАЧЕНУ гілку В поточну.",
      `repo.merge('feature');`,
    ],
    solution: `repo.merge('feature');`,
    testCode: `const files = repo.listFiles();\nif (!files.includes('main.txt') || !files.includes('feature.txt')) return {pass:false, message:"Після merge на main мають бути ОБИДВА файли: main.txt і feature.txt (зараз: " + JSON.stringify(files) + ")."};\nconst log = repo.log();\nif (!log.some(c => c.message.includes('Merge branch feature'))) return {pass:false, message:"В історії main має з'явитись merge-коміт."};\nreturn {pass:true, message:"git merge об'єднує дві лінії розробки назад в одну — main тепер містить усе, що робилося на feature."};`,
  },
  {
    id: "fullstack-9",
    title: "Shell: pwd і mkdir",
    type: "js",
    harness: shellHarness(""),
    theory:
      "Командний рядок (shell, термінал) — текстовий інтерфейс для керування файлами й запуску програм, набагато швидший за клацання мишею для повторюваних задач — саме так більшість серверів (без жодного графічного інтерфейсу) керуються віддалено. pwd (print working directory) показує ПОВНИЙ шлях до поточної папки — де саме «перебуває» термінал прямо зараз.\n\nmkdir (make directory) створює нову папку за вказаним шляхом. Шлях може бути ВІДНОСНИМ (projects — відносно поточної папки) чи АБСОЛЮТНИМ (/home/user/projects — повний шлях від кореня файлової системи /, незалежно від того, де зараз перебуває термінал).\n\nУ цьому курсі об'єкт shell — власна, спрощена віртуальна файлова система: shell.mkdir(шлях) і shell.pwd() працюють з тим самим принципом розбору шляхів, що й справжня Unix/Linux оболонка.",
    examples: [
      { title: "Створення папки", code: `shell.mkdir('projects');`, explain: "Створює папку 'projects' усередині поточної директорії (відносний шлях)." },
    ],
    task: "Створи папку 'projects' у поточній директорії (shell.mkdir).",
    starter: `// твій код тут\n`,
    hints: [
      "shell.mkdir('projects');",
      "Відносний шлях — без похилої риски на початку.",
      `shell.mkdir('projects');`,
    ],
    solution: `shell.mkdir('projects');`,
    testCode: `const listing = shell.ls('.');\nif (!listing.includes('projects')) return {pass:false, message:"Папка 'projects' не знайдена в поточній директорії (зараз: " + JSON.stringify(listing) + ")."};\nconst info = shell.stat('projects');\nif (info.type !== 'dir') return {pass:false, message:"'projects' має бути папкою, не файлом."};\nreturn {pass:true, message:"pwd показує, ДЕ ти зараз; mkdir створює нову папку — два перших інструменти для орієнтування у файловій системі."};`,
  },
  {
    id: "fullstack-10",
    title: "Shell: cd — переміщення між папками",
    type: "js",
    harness: shellHarness("shell.mkdir('a');\nshell.cd('a');\nshell.mkdir('b');\nshell.cd('/home/user');"),
    theory:
      "cd (change directory) переміщує термінал в ІНШУ папку — усі наступні команди (ls, mkdir, cat) виконуватимуться відносно НОВОГО поточного місця. cd папка (відносний шлях) заходить УСЕРЕДИНУ вказаної папки поточної директорії; cd /повний/шлях переміщує в БУДЬ-ЯКЕ місце файлової системи одразу, незалежно від поточного розташування.\n\nДві спеціальні назви: . означає «поточна папка сама по собі» (рідко потрібна для cd, частіше для ls . чи шляхів на кшталт ./script.sh), .. означає «папка на рівень ВИЩЕ» — cd .. піднімає на один рівень угору в ієрархії, найчастіша команда для 'вийти назад'.\n\ncd без жодного аргументу в реальному Linux повертає в домашню папку користувача — у цьому курсі для явності завжди використовується конкретний шлях.",
    examples: [
      { title: "Углиб і назад через ..", code: `shell.cd('a');\nshell.cd('b');\nshell.cd('..');\nconsole.log(shell.pwd());`, explain: "Після cd('a'), cd('b') і одного cd('..') опиняємось знову в 'a', не в 'a/b'." },
    ],
    task: "Зайди в папку 'a', потім углиб у 'b' (a вже містить b), а тоді підіймись на один рівень назад через cd('..') — і залишся саме там.",
    starter: `// твій код тут\n`,
    hints: [
      "shell.cd('a'); shell.cd('b'); — заходимо вглиб.",
      "shell.cd('..'); — підіймає на рівень вище, назад до 'a'.",
      `shell.cd('a');\nshell.cd('b');\nshell.cd('..');`,
    ],
    solution: `shell.cd('a');\nshell.cd('b');\nshell.cd('..');`,
    testCode: `if (shell.pwd() !== '/home/user/a') return {pass:false, message:"Після cd('a'), cd('b'), cd('..') поточна папка має бути /home/user/a (зараз: " + shell.pwd() + ")."};\nreturn {pass:true, message:"cd('..') піднімає на один рівень ВИЩЕ в ієрархії — найчастіша команда для 'вийти з поточної папки назад'."};`,
  },
  {
    id: "fullstack-11",
    title: "Shell: touch і запис файлів",
    type: "js",
    harness: shellHarness(""),
    theory:
      "touch створює НОВИЙ ПОРОЖНІЙ файл за вказаним шляхом (у реальному Linux touch також оновлює час останньої зміни вже існуючого файлу, не чіпаючи вміст — тут для навчальної простоти лише створює, якщо файлу ще немає). Порожній файл часто потрібен як «заготовка», яку далі наповнюють вмістом.\n\nЗаписати ВМІСТ у файл у реальному терміналі найчастіше роблять через ПЕРЕНАПРАВЛЕННЯ (echo 'текст' > файл.txt) — тут для тієї самої мети напряму служить shell.writeFile(шлях, вміст), що одночасно й створює файл (якщо його не було), і записує в нього текст.\n\nЯк і з mkdir, шлях для touch/writeFile може бути відносним чи абсолютним — файл завжди створюється всередині ІСНУЮЧОЇ батьківської папки (спроба записати файл у неіснуючу папку — помилка, так само, як у реальному терміналі).",
    examples: [
      { title: "Порожній файл і файл із вмістом", code: `shell.touch('empty.txt');\nshell.writeFile('notes.txt', 'Перша нотатка');`, explain: "empty.txt порожній одразу після створення; notes.txt одразу містить текст." },
    ],
    task: "Створи порожній файл 'empty.txt' (touch) і файл 'notes.txt' з вмістом 'Перша нотатка' (writeFile).",
    starter: `// твій код тут\n`,
    hints: [
      "shell.touch('empty.txt');",
      "shell.writeFile('notes.txt', 'Перша нотатка');",
      `shell.touch('empty.txt');\nshell.writeFile('notes.txt', 'Перша нотатка');`,
    ],
    solution: `shell.touch('empty.txt');\nshell.writeFile('notes.txt', 'Перша нотатка');`,
    testCode: `if (shell.readFile('empty.txt') !== '') return {pass:false, message:"empty.txt має бути порожнім одразу після touch."};\nif (shell.readFile('notes.txt') !== 'Перша нотатка') return {pass:false, message:"notes.txt має містити 'Перша нотатка'."};\nreturn {pass:true, message:"touch — порожня заготовка; writeFile (у реальному терміналі — echo '...' > файл) одразу наповнює файл вмістом."};`,
  },
  {
    id: "fullstack-12",
    title: "Shell: cat — читання вмісту файлу",
    type: "js",
    harness: shellHarness("shell.writeFile('config.txt', 'PORT=3000\\nDEBUG=true');"),
    theory:
      "cat (concatenate) виводить УВЕСЬ вміст файлу прямо в термінал — найшвидший спосіб швидко переглянути невеликий текстовий файл, не відкриваючи окремий редактор. У цьому курсі та сама дія — shell.readFile(шлях), що повертає вміст як рядок.\n\nСпроба прочитати файл, якого НЕ ІСНУЄ (чи вказати шлях до ПАПКИ замість файлу), — помилка: 'No such file or directory' чи 'Is a directory' — та сама поведінка, що й у справжньому терміналі.\n\nЦе базова, але постійно потрібна дія: перевірити вміст конфігураційного файлу (.env, package.json), переглянути лог помилок, звірити, що файл узагалі містить те, що очікувалось, перш ніж робити щось складніше.",
    examples: [
      { title: "Читання конфігураційного файлу", code: `const content = shell.readFile('config.txt');\nconsole.log(content);`, explain: "Виведе весь вміст config.txt як є, з переносами рядків." },
    ],
    task: "Прочитай вміст файлу config.txt (уже існує) через shell.readFile і виведи його в консоль.",
    starter: `// твій код тут\n`,
    hints: [
      "const content = shell.readFile('config.txt');",
      "console.log(content);",
      `const content = shell.readFile('config.txt');\nconsole.log(content);`,
    ],
    solution: `const content = shell.readFile('config.txt');\nconsole.log(content);`,
    testCode: `if (!__logs.some(l => l.includes('PORT=3000'))) return {pass:false, message:"У консолі має з'явитись вміст config.txt, включно з PORT=3000."};\nreturn {pass:true, message:"cat/readFile — швидкий спосіб переглянути вміст текстового файлу прямо в терміналі, без окремого редактора."};`,
  },
  {
    id: "fullstack-13",
    title: "Shell: ls — список вмісту папки",
    type: "js",
    harness: shellHarness("shell.mkdir('src');\nshell.touch('src/index.js');\nshell.touch('src/utils.js');\nshell.touch('package.json');"),
    theory:
      "ls (list) показує ВМІСТ вказаної папки — імена всіх файлів і підпапок усередині неї, ОДИН рівень углиб (не рекурсивно, не показує вміст ВКЛАДЕНИХ папок автоматично). ls . (чи просто ls без аргументу) показує вміст ПОТОЧНОЇ папки.\n\nЦе перший інструмент ОРІЄНТАЦІЇ: перш ніж читати чи змінювати щось, корисно побачити, ЩО ВЗАГАЛІ є в цій папці — ls src покаже вміст папки src, НЕ переміщуючись у неї (на відміну від cd src, що фактично туди заходить).\n\nУ реальному терміналі ls часто супроводжують прапорцями (ls -la показує приховані файли й детальну інформацію) — тут shell.ls повертає простий відсортований список імен, достатній для розуміння самого принципу.",
    examples: [
      { title: "Перегляд вмісту без переходу", code: `const items = shell.ls('src');\nconsole.log(items);`, explain: "Покаже вміст src (index.js, utils.js), не переміщуючи туди поточну папку." },
    ],
    task: "Виведи в консоль список файлів у поточній папці (shell.ls('.')) і список файлів у папці 'src' (shell.ls('src')).",
    starter: `// твій код тут\n`,
    hints: [
      "console.log(shell.ls('.'));",
      "console.log(shell.ls('src'));",
      `console.log(shell.ls('.'));\nconsole.log(shell.ls('src'));`,
    ],
    solution: `console.log(shell.ls('.'));\nconsole.log(shell.ls('src'));`,
    testCode: `if (!__logs.some(l => l.includes('package.json') && l.includes('src'))) return {pass:false, message:"ls('.') має показати package.json і src."};\nif (!__logs.some(l => l.includes('index.js') && l.includes('utils.js'))) return {pass:false, message:"ls('src') має показати index.js і utils.js."};\nreturn {pass:true, message:"ls показує вміст ОДНІЄЇ вказаної папки — перший інструмент, щоб зорієнтуватись, не переходячи в неї."};`,
  },
  {
    id: "fullstack-14",
    title: "Shell: rm — видалення файлів",
    type: "js",
    harness: shellHarness("shell.touch('temp.txt');\nshell.touch('keep.txt');"),
    theory:
      "rm (remove) видаляє файл БЕЗПОВОРОТНО — на відміну від видалення через графічний інтерфейс (де файл часто спершу потрапляє в кошик і його можна відновити), термінальний rm стирає файл одразу, без проміжного «кошика» за замовчуванням. Це робить rm однією з команд, де варто ДВІЧІ перевірити шлях, перш ніж натиснути Enter.\n\nСпроба видалити файл, якого не існує, — помилка (у реальному терміналі rm -f придушує цю помилку, якщо файла й так немає — не наш випадок тут, для явності).\n\nЦе завершальна команда в циклі «створив тимчасовий файл для перевірки — прибрав за собою»: tehnічні, службові файли (логи, кеш, тимчасові копії) регулярно прибирають саме так, лишаючи в проєкті тільки те, що дійсно потрібне.",
    examples: [
      { title: "Видалення тимчасового файлу", code: `shell.rm('temp.txt');`, explain: "temp.txt зникає одразу й безповоротно." },
    ],
    task: "Видали файл 'temp.txt', лишивши 'keep.txt' недоторканим.",
    starter: `// твій код тут\n`,
    hints: [
      "shell.rm('temp.txt');",
      "keep.txt чіпати не потрібно — він має лишитись.",
      `shell.rm('temp.txt');`,
    ],
    solution: `shell.rm('temp.txt');`,
    testCode: `const listing = shell.ls('.');\nif (listing.includes('temp.txt')) return {pass:false, message:"temp.txt мав бути видалений."};\nif (!listing.includes('keep.txt')) return {pass:false, message:"keep.txt мав ЛИШИТИСЬ — видалено щось зайве."};\nreturn {pass:true, message:"rm видаляє файл безповоротно, без проміжного кошика — саме тому шлях варто перевіряти двічі."};`,
  },
  {
    id: "fullstack-15",
    title: "Shell: grep — пошук у вмісті файлу",
    type: "js",
    harness: shellHarness("shell.writeFile('server.log', 'INFO: сервер запущено\\nERROR: не вдалось підключитись до бази\\nINFO: порт 3000\\nERROR: тайм-аут запиту');"),
    theory:
      "grep шукає рядки, що МІСТЯТЬ вказаний текст, серед усього вмісту файлу — і повертає ЛИШЕ ЦІ рядки, ігноруючи решту. Замість того, щоб вручну прогортати сотні рядків логу в пошуках помилок, grep ERROR server.log одразу покаже ЛИШЕ рядки з ERROR.\n\nЦе один із найчастіше використовуваних інструментів у роботі з логами й великими текстовими файлами на сервері — швидко звузити тисячі рядків до тих кількох, що дійсно цікавлять, за одну команду.\n\nУ цьому курсі shell.grep(термін, шлях) повертає масив рядків, що містять цей термін (простий підрядок, без повної підтримки регулярних виразів, як у справжньому grep -E) — самої ІДЕЇ фільтрації великого тексту за ключовим словом цілком достатньо для розуміння принципу.",
    examples: [
      { title: "Пошук помилок у логах", code: `const errors = shell.grep('ERROR', 'server.log');\nconsole.log(errors);`, explain: "Поверне лише два рядки з ERROR, ігноруючи рядки з INFO." },
    ],
    task: "Знайди всі рядки з 'ERROR' у файлі server.log (shell.grep) і виведи їх у консоль.",
    starter: `// твій код тут\n`,
    hints: [
      "const errors = shell.grep('ERROR', 'server.log');",
      "console.log(errors);",
      `const errors = shell.grep('ERROR', 'server.log');\nconsole.log(errors);`,
    ],
    solution: `const errors = shell.grep('ERROR', 'server.log');\nconsole.log(errors);`,
    testCode: `if (!__logs.some(l => l.includes('не вдалось підключитись') && l.includes('тайм-аут'))) return {pass:false, message:"Має вивестись рівно 2 рядки з ERROR: про підключення до бази і про тайм-аут."};\nif (__logs.some(l => l.includes('запущено') && !l.includes('ERROR'))) return {pass:false, message:"Рядки з INFO не мають потрапити у вивід grep за 'ERROR'."};\nreturn {pass:true, message:"grep звужує великий текстовий файл до лише тих рядків, що дійсно цікавлять — незамінний інструмент для роботи з логами."};`,
  },
  {
    id: "fullstack-16",
    title: "Shell: chmod — права доступу",
    type: "js",
    harness: shellHarness("shell.touch('deploy.sh');"),
    theory:
      "Кожен файл у Unix-подібній системі (Linux, macOS) має ПРАВА ДОСТУПУ (permissions) — хто може його читати (r, read), змінювати (w, write) і ВИКОНУВАТИ як програму (x, execute). rw-r--r-- (типово для звичайного текстового файлу) означає: власник може читати й писати, усі інші — лише читати, ніхто не може виконати як програму.\n\nchmod (change mode) змінює ці права: скрипт (наприклад, deploy.sh — файл із командами розгортання) спочатку не виконуваний, доки явно не дати йому право x — rwxr-xr-x означає, що ВЛАСНИК може читати, писати Й виконувати, решта — читати й виконувати, але не змінювати.\n\nЦе не формальність, а реальний захист: файл БЕЗ права виконання (x) неможливо випадково запустити як програму, навіть якщо в ньому ціла послідовність команд — систему потрібно ЯВНО попросити дозволити це, перш ніж воно спрацює.",
    examples: [
      { title: "Дозвіл на виконання скрипта", code: `shell.chmod('rwxr-xr-x', 'deploy.sh');`, explain: "Тепер файл можна ЗАПУСТИТИ як програму — до цього така спроба була б відхилена." },
    ],
    task: "Зроби файл deploy.sh виконуваним, встановивши права rwxr-xr-x (shell.chmod).",
    starter: `// твій код тут\n`,
    hints: [
      "shell.chmod(режим, шлях) — саме в такому порядку аргументів.",
      "shell.chmod('rwxr-xr-x', 'deploy.sh');",
      `shell.chmod('rwxr-xr-x', 'deploy.sh');`,
    ],
    solution: `shell.chmod('rwxr-xr-x', 'deploy.sh');`,
    testCode: `const info = shell.stat('deploy.sh');\nif (info.mode !== 'rwxr-xr-x') return {pass:false, message:"Права deploy.sh мають бути 'rwxr-xr-x' (зараз: '" + info.mode + "')."};\nreturn {pass:true, message:"chmod з правом x робить файл ВИКОНУВАНИМ як програму — без цього права навіть готовий скрипт просто не запуститься."};`,
  },
  {
    id: "fullstack-17",
    title: "Dockerfile: опис образу застосунку",
    type: "text",
    theory:
      "Docker пакує застосунок разом з УСІМ, що йому потрібне для роботи (конкретна версія Node.js, усі залежності, налаштування) в ОДИН переносний контейнер — той самий контейнер працюватиме ОДНАКОВО на комп'ютері розробника, тестовому сервері й у продакшені, вирішуючи класичну проблему «у мене працює, а на сервері — ні».\n\nDockerfile — текстова інструкція, ЯК зібрати такий образ: FROM node:20 обирає базовий образ (готовий Node.js певної версії, а не «чистий» Linux, у якому все довелось би встановлювати вручну), WORKDIR /app встановлює робочу папку ВСЕРЕДИНІ контейнера, COPY package.json ./ і RUN npm install копіюють і встановлюють залежності, COPY . . копіює решту коду, CMD [\"node\", \"server.js\"] визначає команду, що запускається, коли контейнер стартує.\n\nПорядок інструкцій має значення для швидкості збірки: COPY package.json і npm install зазвичай ставлять ДО копіювання всього коду (COPY . .) — Docker кешує кожен крок, і якщо сам код змінився, а залежності — ні, переустановлювати npm install заново не доведеться.",
    examples: [
      { title: "Мінімальний Dockerfile для Node-застосунку", code: `FROM node:20\nWORKDIR /app\nCOPY package.json ./\nRUN npm install\nCOPY . .\nCMD ["node", "server.js"]`, explain: "П'ять інструкцій: базовий образ, робоча папка, залежності, код, команда запуску." },
    ],
    task: "Напиши Dockerfile для Node-застосунку: базовий образ node, робоча папка /app (WORKDIR), встановлення залежностей (RUN npm install), і команда запуску CMD.",
    starter: `# Dockerfile\n`,
    hints: [
      "FROM node:... — перший рядок, база.",
      "WORKDIR /app, RUN npm install, CMD [...]",
      `FROM node:20\nWORKDIR /app\nCOPY package.json ./\nRUN npm install\nCOPY . .\nCMD ["node", "server.js"]`,
    ],
    solution: `FROM node:20\nWORKDIR /app\nCOPY package.json ./\nRUN npm install\nCOPY . .\nCMD ["node", "server.js"]`,
    successMessage: "Dockerfile — рецепт контейнера: те саме середовище на будь-якій машині, де є Docker.",
    tests: [
      { re: /FROM\s+node/i, msg: "Потрібен базовий образ: FROM node:..." },
      { re: /WORKDIR\s+\/app/i, msg: "Потрібна робоча папка: WORKDIR /app." },
      { re: /RUN\s+npm install/i, msg: "Потрібне встановлення залежностей: RUN npm install." },
      { re: /CMD/i, msg: "Потрібна команда запуску: CMD [...]." },
    ],
  },
  {
    id: "fullstack-18",
    title: "docker-compose.yml: кілька сервісів разом",
    type: "text",
    theory:
      "Реальний застосунок рідко складається з ОДНОГО контейнера — потрібен ще й контейнер бази даних, можливо кеш (Redis), окремий контейнер для фронтенду. docker-compose.yml описує ВСІ ці сервіси РАЗОМ, одним файлом, і одна команда (docker compose up) запускає їх УСІ одночасно, вже з'єднаними в спільну мережу.\n\nКожен сервіс під ключем services: має власне ім'я (app, db) і опис: image: (готовий образ з реєстру, наприклад postgres:16) або build: . (зібрати образ із власного Dockerfile у поточній папці), ports: для прокидання портів назовні (\"3000:3000\" — порт 3000 контейнера доступний як порт 3000 на хост-машині).\n\nСервіси в docker-compose можуть звертатись ОДИН ДО ОДНОГО за ІМ'ЯМ сервісу як за хостом (застосунок app звертається до бази даних просто як db:5432, а не за складною IP-адресою) — docker-compose сам налаштовує внутрішню мережу між контейнерами.",
    examples: [
      { title: "Застосунок і база даних разом", code: `services:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n  db:\n    image: postgres:16\n    ports:\n      - "5432:5432"`, explain: "Два сервіси: app (зібраний з локального Dockerfile) і db (готовий образ postgres)." },
    ],
    task: "Напиши docker-compose.yml з двома сервісами: app (build: .) і db (image: postgres:16), під ключем services:.",
    starter: `# docker-compose.yml\n`,
    hints: [
      "services: — обов'язковий кореневий ключ, з якого все починається.",
      "Два сервіси на одному рівні відступу: app: і db:",
      `services:\n  app:\n    build: .\n  db:\n    image: postgres:16`,
    ],
    solution: `services:\n  app:\n    build: .\n  db:\n    image: postgres:16`,
    successMessage: "docker-compose.yml описує ВЕСЬ набір сервісів одним файлом — один застосунок рідко живе сам по собі.",
    tests: [
      { re: /services:/, msg: "Потрібен кореневий ключ services:." },
      { re: /app:/, msg: "Потрібен сервіс app." },
      { re: /db:/, msg: "Потрібен сервіс db." },
      { re: /image:\s*postgres/i, msg: "Сервіс db має використовувати image: postgres:16 (готовий образ)." },
    ],
  },
  {
    id: "fullstack-19",
    title: ".env: змінні середовища",
    type: "text",
    theory:
      "Конфігурація, що змінюється залежно від СЕРЕДОВИЩА (локальна розробка, тест, продакшн) — адреса бази даних, порт, секретні ключі — не повинна бути «зашита» прямо в код. .env — текстовий файл формату КЛЮЧ=значення, з якого застосунок читає ці налаштування при старті (у Node — через process.env.PORT, після завантаження бібліотекою на кшталт dotenv).\n\nЦе той самий .env, що вже згадувався в уроці про .gitignore: він МАЄ бути в .gitignore, а не в git-історії — секрети (паролі бази даних, ключі API), що там зберігаються, ніколи не повинні потрапляти в спільний, а тим паче публічний репозиторій.\n\nТипові поля для сервера: PORT (на якому порту слухати), DATABASE_URL (адреса підключення до бази), і будь-які секретні ключі зовнішніх сервісів (API_KEY, JWT_SECRET) — кожен розробник у команді має власний .env локально, ніколи не діляться ним через git.",
    examples: [
      { title: "Типовий .env сервера", code: `PORT=3000\nDATABASE_URL=postgres://localhost:5432/shop\nJWT_SECRET=change-me-in-production`, explain: "Три змінні: порт, адреса бази даних, секретний ключ — жодна з них не 'зашита' в самому коді." },
    ],
    task: "Напиши .env файл із трьома змінними: PORT (число), DATABASE_URL (рядок з'єднання), JWT_SECRET (будь-який секретний рядок).",
    starter: `# .env\n`,
    hints: [
      "Формат: КЛЮЧ=значення, кожен на своєму рядку, без пробілів навколо =.",
      "PORT=3000",
      `PORT=3000\nDATABASE_URL=postgres://localhost:5432/shop\nJWT_SECRET=change-me-in-production`,
    ],
    solution: `PORT=3000\nDATABASE_URL=postgres://localhost:5432/shop\nJWT_SECRET=change-me-in-production`,
    successMessage: ".env тримає конфігурацію ОКРЕМО від коду — і ніколи не потрапляє в git (.gitignore з попереднього блоку уроків).",
    tests: [
      { re: /PORT=\d+/, msg: "Потрібна змінна PORT з числовим значенням." },
      { re: /DATABASE_URL=\S+/, msg: "Потрібна змінна DATABASE_URL." },
      { re: /JWT_SECRET=\S+/, msg: "Потрібна змінна JWT_SECRET." },
    ],
  },
  {
    id: "fullstack-20",
    title: "CI/CD: автоматична перевірка й розгортання",
    type: "text",
    theory:
      "CI (Continuous Integration, безперервна інтеграція) — автоматична перевірка КОЖНОЇ зміни коду: щойно хтось надсилає код (git push), спеціальний сервер сам запускає тести й лінтер, і одразу повідомляє, якщо щось зламалось — ще ДО того, як зламаний код потрапить у спільну гілку. CD (Continuous Deployment/Delivery) продовжує цей самий процес далі — автоматично розгортає код, що пройшов усі перевірки, на реальний сервер, без ручного втручання.\n\nCI/CD-пайплайн описують YAML-файлом (наприклад, GitHub Actions зберігає його в .github/workflows/): on: визначає, КОЛИ пайплайн запускається (push — на кожен push, pull_request — на кожен pull request), jobs: описує послідовність КРОКІВ (встановити залежності, запустити тести, задеплоїти).\n\nГоловна цінність CI/CD — швидкий, ПОСТІЙНИЙ зворотний зв'язок: розробник дізнається про поламаний тест за хвилини після push, а не через тиждень, коли хтось випадково натрапить на баг у продакшені.",
    examples: [
      { title: "Мінімальний CI-workflow", code: `name: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm install\n      - run: npm test`, explain: "На кожен push: встановити залежності, запустити тести — найпростіший можливий CI-пайплайн." },
    ],
    task: "Напиши мінімальний CI-workflow (YAML): запускається on: push, має jobs з кроками npm install і npm test.",
    starter: `# .github/workflows/ci.yml\n`,
    hints: [
      "on: push — коли запускається пайплайн.",
      "jobs: ... steps: ... - run: npm install ... - run: npm test",
      `name: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm install\n      - run: npm test`,
    ],
    solution: `name: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm install\n      - run: npm test`,
    successMessage: "CI перевіряє КОЖНУ зміну автоматично — баг виявляється за хвилини, а не тижні по тому.",
    tests: [
      { re: /on:\s*push/, msg: "Пайплайн має запускатись on: push." },
      { re: /jobs:/, msg: "Потрібен ключ jobs:." },
      { re: /npm install/, msg: "Потрібен крок npm install." },
      { re: /npm test/, msg: "Потрібен крок npm test." },
    ],
  },
  {
    id: "fullstack-21",
    title: "Клієнт-сервер і мікросервіси",
    type: "vocab",
    theory:
      "Клієнт-серверна архітектура — базова модель майже всього інтернету: КЛІЄНТ (браузер, мобільний застосунок) надсилає запити, СЕРВЕР їх обробляє й повертає відповідь. Клієнт зазвичай не знає (і не повинен знати) ВНУТРІШНЬОЇ будови сервера — лише те, ЯК до нього звертатись (курс Backend).\n\nКоли застосунок стає великим, один-єдиний сервер («монолiт», що робить УСЕ — автентифікацію, платежі, товари, сповіщення в одному процесі) стає складно розвивати: зміна в одній частині ризикує зламати геть іншу, а масштабувати доводиться ВЕСЬ застосунок одразу, навіть якщо навантажене лише щось одне.\n\nМікросервісна архітектура розбиває один великий сервер на КІЛЬКА незалежних, менших сервісів, кожен з яких відповідає за ОДНУ конкретну область (сервіс товарів, сервіс замовлень, сервіс сповіщень) і спілкується з іншими через мережу (найчастіше — той самий HTTP/REST API з курсу Backend). Це дає незалежне масштабування й розгортання КОЖНОГО сервісу окремо, ціною додаткової складності мережевої взаємодії між ними.",
    presentation: [
      { title: "Клієнт-сервер", points: ["Клієнт надсилає запити, сервер обробляє й відповідає", "Клієнт не знає внутрішньої будови сервера", "Курс Backend саме про цю модель"] },
      { title: "Монoліт vs мікросервіси", points: ["Монoліт: усе в одному процесі — просто, але важко масштабувати частково", "Мікросервіси: незалежні сервіси, кожен за одну область", "Спілкуються між собою через мережу — найчастіше HTTP/REST"] },
    ],
    task: "Як називається архітектура, де застосунок розбитий на кілька незалежних сервісів, кожен за свою окрему область, що спілкуються через мережу?",
    starter: "",
    hints: ["Слово починається на 'мікро-'.", "Протилежність — 'моноліт' (усе в одному).", "мікросервіси"],
    solution: "мікросервіси",
    accepted: ["мікросервіси", "мікросервісна архітектура", "microservices"],
  },
  {
    id: "fullstack-22",
    title: "Балансування навантаження",
    type: "vocab",
    theory:
      "Коли ОДИН сервер більше не встигає обробляти весь потік запитів (застосунок став популярним, трафік виріс), рішення — запустити КІЛЬКА однакових копій сервера й розподіляти запити МІЖ ними. Компонент, що приймає ВХІДНІ запити першим і вирішує, ЯКОМУ саме серверу з кількох однакових копій передати кожен конкретний запит, називається балансувальником навантаження (load balancer).\n\nНайпростіша стратегія розподілу — round-robin (по черзі: перший запит на сервер 1, другий на сервер 2, третій знову на сервер 1, і так по колу) — прості, передбачувані, рівномірні. Складніші стратегії враховують ПОТОЧНЕ навантаження кожного сервера (least connections — надіслати запит серверу, що зараз найменш зайнятий).\n\nБалансувальник навантаження також підвищує НАДІЙНІСТЬ: якщо один із серверів раптом «падає» (перестає відповідати), балансувальник просто перестає надсилати запити САМЕ йому, перенаправляючи весь трафік на ті, що й далі працюють — користувачі часто навіть не помічають, що один сервер зі списку вийшов з ладу.",
    presentation: [
      { title: "Навіщо балансування", points: ["Один сервер не встигає — запускають кілька однакових копій", "Балансувальник розподіляє вхідні запити між ними", "Round-robin — найпростіша стратегія: по черзі"] },
      { title: "Бонус: надійність", points: ["Сервер, що 'впав', автоматично виключається з розподілу", "Користувачі часто навіть не помічають збій одного з серверів", "Це і масштабування, і стійкість до відмов одночасно"] },
    ],
    task: "Як називається компонент, що розподіляє вхідні запити між кількома однаковими серверами?",
    starter: "",
    hints: ["Дослівний переклад з англійської 'load balancer'.", "Українською — два слова.", "балансувальник навантаження"],
    solution: "балансувальник навантаження",
    accepted: ["балансувальник навантаження", "балансувальник", "load balancer"],
  },
  {
    id: "fullstack-23",
    title: "Фінальний проєкт: повний git-цикл для магазину",
    type: "js",
    harness: gitHarness(""),
    theory:
      "Останній крок: зібрати ВЕСЬ git-робочий процес цього курсу в один цілісний цикл — той самий, яким щодня користуються реальні команди розробників над реальними проєктами. Для проєкту магазину (той самий, що й у курсах SQL і Backend): перший коміт з README, нова гілка для окремої роботи, коміт у цій гілці, і фінальне злиття назад.\n\nЦе комбінація КОЖНОЇ техніки з попередніх git-уроків: writeFile → add → commit (уроки 1-3), branch і checkout (уроки 6-7), другий коміт УЖЕ на новій гілці, і нарешті merge назад у main (урок 8) — рівно та сама послідовність дій, яку робить будь-який розробник, додаючи нову функцію до існуючого проєкту.\n\nПісля цього уроку — Dockerfile, docker-compose.yml, .env і CI/CD-workflow з попередніх уроків цього курсу готові розгорнути САМЕ той код, що щойно пройшов через цей git-цикл: від першого рядка коду до працюючого, розгорнутого застосунку.",
    examples: [
      { title: "Повний цикл: коміт → гілка → коміт → злиття", code: `repo.writeFile('README.md', '# Shop API');\nrepo.add('.');\nrepo.commit('Initial commit');\n\nrepo.branch('add-changelog');\nrepo.checkout('add-changelog');\nrepo.writeFile('CHANGELOG.md', '## v1.0.0\\n- Перший реліз');\nrepo.add('.');\nrepo.commit('Add changelog');\n\nrepo.checkout('main');\nrepo.merge('add-changelog');`, explain: "Шість кроків: базовий коміт, нова гілка, робота в ній, і фінальне злиття — повний, реальний git-цикл." },
    ],
    task: "Виконай повний git-цикл: закомить README.md ('Initial commit') на main, створи й перемкнись на гілку 'add-changelog', закомить у ній CHANGELOG.md ('Add changelog'), повернись на main і злий 'add-changelog' назад.",
    starter: `// твій код тут — увесь git-цикл\n`,
    hints: [
      "Спочатку звичайний перший коміт на main (writeFile → add → commit).",
      "Потім branch → checkout → writeFile → add → commit на новій гілці, і зрештою checkout('main') → merge.",
      `repo.writeFile('README.md', '# Shop API');\nrepo.add('.');\nrepo.commit('Initial commit');\n\nrepo.branch('add-changelog');\nrepo.checkout('add-changelog');\nrepo.writeFile('CHANGELOG.md', '## v1.0.0\\n- Перший реліз');\nrepo.add('.');\nrepo.commit('Add changelog');\n\nrepo.checkout('main');\nrepo.merge('add-changelog');`,
    ],
    solution: `repo.writeFile('README.md', '# Shop API');\nrepo.add('.');\nrepo.commit('Initial commit');\n\nrepo.branch('add-changelog');\nrepo.checkout('add-changelog');\nrepo.writeFile('CHANGELOG.md', '## v1.0.0\\n- Перший реліз');\nrepo.add('.');\nrepo.commit('Add changelog');\n\nrepo.checkout('main');\nrepo.merge('add-changelog');`,
    testCode: `if (repo.currentBranchName() !== 'main') return {pass:false, message:"Наприкінці має бути на гілці main."};\nconst files = repo.listFiles();\nif (!files.includes('README.md') || !files.includes('CHANGELOG.md')) return {pass:false, message:"На main мають бути ОБИДВА файли після злиття: README.md і CHANGELOG.md (зараз: " + JSON.stringify(files) + ")."};\nconst log = repo.log();\nif (log.length < 2) return {pass:false, message:"В історії main має бути щонайменше 2 коміти: Initial commit і merge-коміт (зараз: " + log.length + ")."};\nif (!log.some(c => c.message === 'Initial commit')) return {pass:false, message:"У історії main має лишитись 'Initial commit'."};\nif (!log.some(c => c.message.includes('Merge branch add-changelog'))) return {pass:false, message:"Має бути merge-коміт від злиття add-changelog."};\nreturn {pass:true, message:"Готово! Це і є повний git-цикл — той самий, яким щодня користуються реальні команди: коміт, гілка, робота, злиття назад."};`,
    finalProject: {
      techs: ["git (init/add/commit/branch/checkout/merge)", "Linux-подібна оболонка (cd/ls/mkdir/rm/grep/chmod)", "Dockerfile / docker-compose.yml", ".env / CI-CD workflow", "клієнт-сервер, мікросервіси, балансування навантаження"],
      skills: [
        "Повний git-цикл: staging, коміти, гілки, злиття",
        "Навігація й робота з файлами у файловій системі (cd/ls/mkdir/touch/rm)",
        "Пошук у файлах (grep) і права доступу (chmod)",
        "Написання Dockerfile, docker-compose.yml, .env, CI-workflow",
        "Розуміння клієнт-серверної архітектури, мікросервісів, балансування навантаження",
      ],
      structure:
        "shop-project/\n  ├── .git/                    # git-репозиторій (init → add → commit → branch → merge)\n  ├── .gitignore               # node_modules, .env, *.log\n  ├── .env                     # PORT, DATABASE_URL, JWT_SECRET\n  ├── Dockerfile                # опис образу застосунку\n  ├── docker-compose.yml        # app + db разом\n  └── .github/workflows/ci.yml  # автоматичні тести на кожен push",
      code: `repo.writeFile('README.md', '# Shop API');
repo.add('.');
repo.commit('Initial commit');

repo.branch('add-changelog');
repo.checkout('add-changelog');
repo.writeFile('CHANGELOG.md', '## v1.0.0\\n- Перший реліз');
repo.add('.');
repo.commit('Add changelog');

repo.checkout('main');
repo.merge('add-changelog');`,
      runCommand: "git init && git add . && git commit -m \"Initial commit\"",
      installGuide: {
        intro: "Усе, написане в цьому курсі, працює в РЕАЛЬНОМУ git і терміналі майже без змін — синтаксис навмисно ідентичний.",
        steps: [
          { title: "Встанови git", text: "На macOS/Linux git зазвичай уже встановлений; на Windows завантаж з git-scm.com." },
          { title: "Ініціалізуй репозиторій", code: "git init\ngit add .\ngit commit -m \"Initial commit\"" },
          { title: "Створи гілку й перемкнись", code: "git branch add-changelog\ngit checkout add-changelog" },
          { title: "Закомить зміни і злий назад", code: "git add .\ngit commit -m \"Add changelog\"\ngit checkout main\ngit merge add-changelog" },
        ],
      },
      improvements: [
        "Підключити віддалений репозиторій (git remote add origin ...) і надіслати зміни (git push)",
        "Реально зібрати Docker-образ (docker build .) і запустити docker-compose up",
        "Налаштувати справжній CI на GitHub Actions для автоматичних тестів на push",
        "Додати git rebase чи squash-merge для чистішої історії комітів",
      ],
      nextLevel:
        "Це був останній курс платформи — від HTML/CSS/JS і TypeScript, через Python, SQL і Backend, до git та розгортання. Далі — застосувати все це до ВЛАСНОГО проєкту, поза межами навчальних вправ.",
    },
  },
];
