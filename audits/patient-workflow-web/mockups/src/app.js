(function () {
"use strict";
const V = window.VARIANT, D = window.DEVICE;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const TODAY = new Date(2026, 10, 4);

/* ================= demo data (synthetic) ================= */
const DOCTORS = ["Elena Markova, MD", "Daniel Okafor, NP", "Priya Raman, MD", "Marcus Bell, DNP"];
const FACILITIES = [
  { name: "Queens Allergy Center", addr: "118-20 Queens Blvd, Forest Hills, NY 11375", phone: "(718) 555-0140", fax: "(718) 555-0141" },
  { name: "Kings Highway Medical PC", addr: "1540 Kings Hwy, Brooklyn, NY 11229", phone: "(718) 555-0172", fax: "(718) 555-0173" },
  { name: "Midtown Sleep & Allergy", addr: "305 W 45th St, New York, NY 10036", phone: "(212) 555-0190", fax: "(212) 555-0191" },
  { name: "Harbor Family Health", addr: "77 Bay St, Staten Island, NY 10301", phone: "(718) 555-0115", fax: "(718) 555-0116" }
];
const STATUSES = [
  ["new", "New", "info"], ["intake", "Allergy Intake", "warn"], ["checking", "Report Checking", "info"],
  ["reviewed", "Report Reviewed", "info"], ["ready", "Ready for IT", "ok"], ["authorized", "IT Authorized", "ok"],
  ["progress", "IT In Progress", "accent"], ["completed", "IT Completed", "muted"], ["declined", "IT Declined", "danger"],
  ["noit", "No Immunotherapy", "muted"], ["done", "Done", "muted"]
];
const ST = Object.fromEntries(STATUSES.map(s => [s[0], s]));
const P = (id, first, last, email, phone, doc, fac, dob, dos, status, lastShot) => ({ id, code: "P2026WEB" + String(id).padStart(4, "0"), first, last, email, phone, doc: DOCTORS[doc], fac: FACILITIES[fac].name, dob, dos, status, lastShot });
const PATIENTS = [
  P(1, "Sarah", "Simon", "sarah.simon@example.com", "(347) 555-1020", 0, 0, "08/15/1988", "10/19/2026", "progress", "2026-10-30"),
  P(2, "Owen", "Brennan", "owen.b@example.com", "(718) 555-3311", 0, 0, "07/30/2012", "11/02/2026", "checking"),
  P(3, "Lily", "Chen", "lily.chen@example.com", "(917) 555-8823", 1, 1, "11/02/1991", "10/12/2026", "progress", "2026-10-28"),
  P(4, "Paulo", "Duarte", "", "(718) 555-4410", 1, 1, "01/19/1977", "11/03/2026", "new"),
  P(5, "Grace", "Ewing", "grace.ewing@example.com", "(212) 555-7781", 2, 2, "05/08/1969", "09/21/2026", "done"),
  P(6, "Noah", "Fischer", "noah.f@example.com", "(347) 555-6612", 2, 2, "09/14/2001", "10/05/2026", "progress", "2026-11-01"),
  P(7, "Anika", "Gupta", "anika.g@example.com", "(917) 555-2290", 3, 3, "02/25/1995", "11/02/2026", "intake"),
  P(8, "James", "Holloway", "", "(718) 555-9034", 3, 3, "12/03/1958", "09/30/2026", "progress", "2026-10-26"),
  P(9, "Sofia", "Ibarra", "sofia.ibarra@example.com", "(646) 555-1148", 0, 0, "04/17/2015", "10/29/2026", "ready"),
  P(10, "Marta", "Lewis", "marta.lewis@example.com", "(347) 555-1021", 1, 1, "08/15/1998", "07/27/2026", "authorized"),
  P(11, "Victor", "Morales", "v.morales@example.com", "(718) 555-5502", 2, 2, "03/03/1983", "10/08/2026", "checking"),
  P(12, "Hannah", "Novak", "hannah.novak@example.com", "(917) 555-4477", 3, 3, "06/22/1990", "08/18/2026", "declined"),
  P(13, "Ethan", "Park", "ethan.park@example.com", "(646) 555-3009", 0, 0, "10/10/1979", "09/02/2026", "noit"),
  P(14, "Julia", "Brown", "julia.brown@example.com", "(212) 555-6060", 1, 1, "04/07/1994", "08/04/2026", "progress", "2026-11-03")
];
const ALLERGENS = ["Positive Histamine Control", "Negative Glycerin Control", "Cockroach, American", "Cockroach, German", "Tobacco Leaf", "Cat Hair, Standardized", "Dog Epithelia", "Dust Mite - Farinae", "Dust Mite - Pteronyssinus", "Guinea Pig Epithelia", "Goat Epithelia", "Mouse Epithelia", "Rat Epithelia", "Horse Epithelia", "Alternaria Alternata", "Aspergillus Mix", "Maple Mix", "Oak, Eastern", "Birch Mix", "Timothy Grass", "Ragweed Mix"];
const ANTIGENS = [
  ["Alder, White", "Trees", "453088", "03/31/2029", "1:20 W/V", "Greer"], ["Birch Mix", "Trees", "451270", "01/31/2029", "1:20 W/V", "Greer"],
  ["Cat Hair, Standardized", "Animals", "448120", "10/31/2028", "10,000 BAU/mL", "ALK"], ["Cockroach, German", "Insects", "440911", "06/30/2028", "1:20 W/V", "Greer"],
  ["Dust Mite - Farinae", "Mites", "447005", "09/30/2028", "10,000 AU/mL", "ALK"], ["Maple Mix", "Trees", "448955", "03/31/2029", "1:20 W/V", "Greer"],
  ["Oak, Eastern", "Trees", "449330", "02/28/2029", "1:20 W/V", "Greer"], ["Ragweed Mix", "Weeds", "446610", "12/31/2028", "1:20 W/V", "Greer"],
  ["Timothy Grass", "Grass", "445502", "11/30/2028", "100,000 BAU/mL", "ALK"]
];
const USERS = [
  ["Admin User", "admin", "Admin", true], ["Elena Markova, MD", "emarkova", "Doctor", true], ["Priya Raman, MD", "praman", "Doctor Specialist", true],
  ["William Brooks", "wbrooks", "Technician", true], ["Nadia Frazier", "nfrazier", "Technician", true], ["Old Front Desk", "frontdesk", "Technician", false]
];

/* ================= help texts ================= */
const HELP = {
  username: "Your login name. Ask the administrator if you do not have one.",
  password: "Your personal password. Never share it. Press the eye to see what you typed.",
  sName: "Type part of the first or last name. Matching patients appear below as you type.",
  sEmail: "Type part of the e-mail address. Matching patients appear below as you type.",
  sPhone: "Type any digits of the phone number, for example 555-1020.",
  first: "Patient's first name as on the ID card. Example: Maria.",
  middle: "Middle name, only if the patient has one. You can leave it empty.",
  last: "Patient's last name as on the ID card. Example: GARCIA.",
  dob: "Date of birth from the ID card. Format MM/DD/YYYY. Press the calendar button to pick it.",
  email: "Patient's e-mail for reports and reminders. Example: maria@gmail.com.",
  phone: "Patient's phone number. Example: (347) 555-1012.",
  insurance: "Insurance company from the patient's card. Choose 'Self-pay' if there is none.",
  dos: "Date of Service: the day of the visit. Today is filled in for you.",
  allergy: "Choose the allergy test type if an allergy test is ordered today. Leave empty if not.",
  pft: "Choose the breathing test (PFT) if it is ordered today. Leave empty if not.",
  physician: "The doctor who ordered the test. Pick from the list.",
  npi: "The doctor's 10-digit NPI number. It fills in by itself when you choose the doctor.",
  facility: "The clinic where the patient is seen. The address, phone and fax fill in by themselves.",
  faddr: "Clinic address. It fills in by itself when you choose the clinic.",
  fphone: "Clinic phone. It fills in by itself.",
  ffax: "Clinic fax. It fills in by itself.",
  interp: "The doctor who reads (interprets) the test results.",
  billed: "Company that sends the bill. Ask the office manager if you are not sure.",
  rn: "Name of the nurse (RN) on the visit, if there is one.",
  cpt: "Billing procedure codes. Search by number or by words, for example 95004.",
  icd: "Diagnosis codes. Search by number or words, for example J30.1.",
  notes: "Notes for staff only. The patient does not see them.",
  dname: "Doctor's full legal name as on the license. It is printed on every report.",
  dphone: "Doctor's work phone.",
  daddr: "Doctor's work address.",
  demail: "Doctor's work e-mail for notifications.",
  dsig: "Upload the doctor's signature as a PDF. Without it, reports cannot be created.",
  facAdd: "Choose a clinic and press Add. The doctor will see patients from linked clinics only.",
  npiNum: "10-digit NPI number. Press Verify to fill the rest from the national registry. You can add it later.",
  cred: "Letters after the name, for example MD, NP, DNP.",
  spec: "The doctor's specialty.",
  fname: "Name of the hospital or clinic for this NPI.",
  regname: "Name in the national NPI registry. Filled in by Verify.",
  taxonomy: "Registry specialty codes. Filled in by Verify.",
  aname: "Extract name exactly as on the bottle label. Example: Maple Mix.",
  atype: "Group of the allergen: Trees, Grass, Weeds, Animals, Mites, Insects, Molds.",
  alot: "Lot number from the bottle label.",
  aexp: "Expiration date from the bottle label.",
  astr: "Strength from the label, for example 1:20 W/V.",
  aman: "Company that made the extract, for example Greer or ALK.",
  antQ: "Type part of a name to find an allergen fast.",
  preset: "Name of this test panel. Usually you do not need to change it.",
  findAllergen: "Type part of an allergen name to find it in the panel.",
  apPatient: "Choose the patient for this appointment.",
  apDate: "Day of the appointment.",
  apTime: "Time of the appointment.",
  ntText: "What needs to be done. Example: Call Sarah Simon to confirm Friday visit.",
  ntDate: "When it must be done.",
  ntPri: "Red = urgent, yellow = soon, gray = can wait. Urgent notes also appear on the Dashboard.",
  remDays: "How many days before the yearly review the reminder appears.",
  accName: "Full name of the person.",
  accUser: "Login name. Letters and digits only, no spaces.",
  accRole: "What this person can do. Technicians see less than doctors and admins."
};

/* ================= icons ================= */
const ip = {
  dash: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21c1-4 4-6 7-6s6 2 7 6"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M22 21c-.5-2.5-2-4.3-4-5.2"/>',
  cal: '<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  grid: '<rect x="3" y="3" width="18" height="18"/><path d="M3 9h18M3 15h18M9 3v18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  flask: '<path d="M9 3h6"/><path d="M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-6-10V3"/><path d="M7 15h10"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h5z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  chev: '<path d="M9 6l6 6-6 6"/>', chevd: '<path d="M6 9l6 6 6-6"/>', chevl: '<path d="M15 6l-6 6 6 6"/>',
  warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5"/><path d="M12 18h.01"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  logout: '<path d="M9 21H5V3h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/>', download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
  doc: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>', archive: '<rect x="3" y="4" width="18" height="4"/><path d="M5 8v12h14V8M10 12h4"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/>', vial: '<path d="M9 2h6M10 2v14a2 2 0 0 0 4 0V2"/><path d="M10 10h4"/>',
  hosp: '<rect x="4" y="3" width="16" height="18"/><path d="M12 7v6M9 10h6M9 21v-4h6v4"/>', undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', note: '<path d="M5 3h14v14l-4 4H5z"/><path d="M15 21v-4h4M9 8h6M9 12h6"/>'
};
const I = (n, s = 20) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ip[n]}</svg>`;

/* ================= menu ================= */
const MENU = [
  ["Clinical", [["dashboard", "Dashboard", "dash"], ["patients", "Patients", "users"], ["calendar", "Calendar", "cal"], ["newpatient", "New Patient", "plus"]]],
  ["Practice", [["testpanel", "Test Panel", "grid"], ["profile", "My Profile", "user"], ["antigens", "Antigens", "flask"]]],
  ["Admin", [["accounts", "Accounts", "key"], ["settings", "Settings", "gear"]]],
  ["Help", [["training", "Training", "book"]]]
];
const SETTINGS = [["vitus", "VitusSource integration", "plug"], ["reminders", "Workflow Reminders", "clock"], ["notifications", "Workflow Notifications", "bell"], ["immuno", "Immunotherapy Settings", "vial"], ["templates", "Document Templates", "doc"], ["facilities", "Facilities & Doctors", "hosp"]];
const TITLES = Object.fromEntries(MENU.flatMap(g => g[1]).map(m => [m[0], m[1]]));

/* ================= state ================= */
const S = {
  screen: "login", sub: "vitus", drawer: false, setOpen: false,
  f: { dos: "11/04/2026", physician: DOCTORS[0], npi: "1234567893", preset: "Allergy Test Form Preset", remDays: "7" },
  err: {}, filt: { st: [], fac: "" }, srch: { name: "", email: "", phone: "" }, dp: null, dpMonth: null,
  calTab: "appt", showPw: false, antOpen: { test: true, it: false }, antQ: "", editRow: null, npiMore: false,
  prof: { name: "Elena Markova", sig: "signature-markova.pdf", facs: ["Queens Allergy Center", "Kings Highway Medical PC"] },
  notes: [
    { id: 1, text: "Dr. Markova must see Sarah Simon in 2 days (shot #14)", date: "11/06/2026", pri: "high", done: false },
    { id: 2, text: "Call Paulo Duarte to confirm the allergy test time", date: "11/05/2026", pri: "mid", done: false },
    { id: 3, text: "Order new Maple Mix bottle (lot expires in March)", date: "11/12/2026", pri: "low", done: false }
  ],
  appts: [
    { id: 1, pid: 1, date: "11/06/2026", time: "09:30", st: "confirmed" }, { id: 2, pid: 3, date: "11/04/2026", time: "11:00", st: "arrived" },
    { id: 3, pid: 6, date: "11/08/2026", time: "14:15", st: "scheduled" }, { id: 4, pid: 8, date: "11/02/2026", time: "10:00", st: "noshow" },
    { id: 5, pid: 14, date: "11/10/2026", time: "16:00", st: "rescheduled" }
  ]
};
let doneLessons = {};
try { doneLessons = JSON.parse(localStorage.getItem("aw2-" + V.id) || "{}") || {}; } catch (e) { doneLessons = {}; }

/* ================= helpers ================= */
const pad = n => String(n).padStart(2, "0");
const fmt = d => `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
const parse = s => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s || ""); return m ? new Date(+m[3], +m[1] - 1, +m[2]) : null; };
const days = (a, b) => Math.round((b - a) / 864e5);
const chip = st => { const s = ST[st]; return `<span class="chip chip-${s[2]}">${s[1]}</span>`; };
const name = p => `${p.first} ${p.last}`;

function help(k) {
  if (!HELP[k]) return "";
  return `<span class="help-wrap"><button type="button" class="help" aria-label="Help: what to type here" aria-describedby="h-${k}">?</button><span class="help-pop" role="tooltip" id="h-${k}">${esc(HELP[k])}</span></span>`;
}
function lab(k, label, o) {
  return `<span class="lab"><label for="f-${k}">${esc(label)}${o.req ? '<span class="req" aria-hidden="true">*</span>' : ""}</label>${o.opt ? '<span class="optl">optional</span>' : ""}${o.discuss ? '<span class="disc">to discuss</span>' : ""}${help(o.help || k)}</span>`;
}
function fld(k, label, o = {}) {
  const v = S.f[k] ?? "", err = S.err[k], inv = err ? ' aria-invalid="true"' : "";
  let c;
  if (o.opts) c = `<div class="sel"><select id="f-${k}" data-k="${k}"${inv}><option value="">${esc(o.ph || "Select…")}</option>${o.opts.map(x => `<option${v === x ? " selected" : ""}>${esc(x)}</option>`).join("")}</select>${I("chevd", 16)}</div>`;
  else if (o.area) c = `<textarea id="f-${k}" data-k="${k}" rows="${o.rows || 3}" placeholder="${esc(o.ph || "")}">${esc(v)}</textarea>`;
  else if (o.date) {
    c = `<div class="date"><input id="f-${k}" data-k="${k}" value="${esc(v)}" placeholder="MM/DD/YYYY" inputmode="numeric" autocomplete="off"${inv}><button type="button" class="date-btn" data-act="dp" data-k="${k}" aria-label="Open calendar">${I("cal", 18)}</button>${S.dp === k ? datePop(k) : ""}</div>`;
  } else if (o.file) {
    c = `<div class="file"><span class="file-name">${v ? `${I("check", 16)} ${esc(v)}` : "No file chosen"}</span><button type="button" class="btn btn-ghost btn-sm" data-act="file" data-k="${k}">${I("upload", 16)}<span>${v ? "Replace PDF" : "Choose PDF"}</span></button></div>`;
  } else if (o.pw) {
    c = `<div class="pw"><input id="f-${k}" data-k="${k}" type="${S.showPw ? "text" : "password"}" value="${esc(v)}" autocomplete="current-password"${inv}><button type="button" class="pw-eye" data-act="pw" aria-label="${S.showPw ? "Hide" : "Show"} password">${I("eye", 18)}</button></div>`;
  } else c = `<input id="f-${k}" data-k="${k}" type="${o.type || "text"}" value="${esc(v)}" placeholder="${esc(o.ph || "")}" autocomplete="off"${o.ro ? " readonly" : ""}${inv}>`;
  return `<div class="fld${o.wide ? " wide" : ""}${o.half ? " half" : ""}">${lab(k, label, o)}${c}${o.note ? `<span class="fnote">${esc(o.note)}</span>` : ""}${err ? `<span class="ferr" role="alert">${I("warn", 16)}${esc(err)}</span>` : ""}</div>`;
}
function datePop(k) {
  const base = S.dpMonth || parse(S.f[k]) || TODAY, y = base.getFullYear(), m = base.getMonth();
  const first = new Date(y, m, 1), start = first.getDay(), n = new Date(y, m + 1, 0).getDate(), sel = S.f[k];
  let cells = ""; for (let i = 0; i < start; i++) cells += "<span></span>";
  for (let d = 1; d <= n; d++) { const v = fmt(new Date(y, m, d)); cells += `<button type="button" class="dp-d${v === sel ? " is-sel" : ""}${v === fmt(TODAY) ? " is-today" : ""}" data-act="dp-pick" data-k="${k}" data-v="${v}">${d}</button>`; }
  const mn = first.toLocaleString("en-US", { month: "long", year: "numeric" });
  return `<div class="dp" role="dialog" aria-label="Choose date"><div class="dp-h"><button type="button" data-act="dp-m" data-d="-1" aria-label="Previous month">${I("chevl", 18)}</button><strong>${mn}</strong><button type="button" data-act="dp-m" data-d="1" aria-label="Next month">${I("chev", 18)}</button></div><div class="dp-w">${["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(w => `<span>${w}</span>`).join("")}</div><div class="dp-g">${cells}</div><div class="dp-f"><button type="button" class="link" data-act="dp-clear" data-k="${k}">Clear</button><button type="button" class="link" data-act="dp-pick" data-k="${k}" data-v="${fmt(TODAY)}">Today</button></div></div>`;
}
function guide(t) { return V.guided && t ? `<div class="guide" role="note"><span class="guide-tag">What to do now</span><span>${esc(t)}</span></div>` : ""; }
function head(title, sub, actions = "", g = "") {
  return `${guide(g)}<div class="phead"><div class="phead-t"><h1>${esc(title)}</h1>${sub ? `<p>${sub}</p>` : ""}</div>${actions ? `<div class="phead-a">${actions}</div>` : ""}</div>`;
}
const btn = (label, act, o = {}) => `<button type="button" class="btn ${o.cls || "btn-ghost"}${o.glow && V.guided ? " glow" : ""}" data-act="${act}"${o.data || ""}${o.coach ? ` data-coach="${o.coach}"` : ""}>${o.icon ? I(o.icon, 18) : ""}<span>${label}</span></button>`;
function table(cols, rows) {
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td data-l="${esc(cols[i].replace(/<[^>]+>/g, ""))}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

/* ================= shell ================= */
function navHTML() {
  return MENU.map(([g, items]) => `<div class="nav-g"><span class="nav-gl">${g}</span>${items.map(([k, l, ic]) => {
    const on = S.screen === k;
    if (k === "settings") {
      return `<button type="button" class="nav-i${on ? " is-on" : ""}" data-act="settings-toggle" aria-expanded="${S.setOpen}" title="${l}" data-coach="nav-settings">${I(ic)}<span class="nav-t">${l}</span><span class="nav-c${S.setOpen ? " is-open" : ""}">${I("chevd", 16)}</span></button>
      <div class="subnav"${S.setOpen ? "" : " hidden"}>${SETTINGS.map(([sk, sl, si]) => `<button type="button" class="sub-i${on && S.sub === sk ? " is-on" : ""}" data-act="sub" data-k="${sk}">${I(si, 16)}<span>${sl}</span></button>`).join("")}</div>`;
    }
    return `<button type="button" class="nav-i${on ? " is-on" : ""}" data-go="${k}" title="${l}"${on ? ' aria-current="page"' : ""}>${I(ic)}<span class="nav-t">${l}</span>${k === "calendar" && V.calendar === "full" ? '<span class="nav-b">2</span>' : ""}</button>`;
  }).join("")}</div>`).join("");
}
function shell(inner) {
  if (S.screen === "login") return login();
  const title = S.screen === "settings" ? `Settings · ${SETTINGS.find(s => s[0] === S.sub)[1]}` : TITLES[S.screen];
  return `<div class="app">
    <aside class="side${S.drawer ? " is-open" : ""}" aria-label="Main menu">
      <div class="side-h"><div class="brand"><span class="logo">AW</span><span class="brand-t">Allergy Workflow<small>Admin console</small></span></div><button type="button" class="icon-btn side-x" data-act="drawer-close" aria-label="Close menu">${I("x")}</button></div>
      <nav class="nav">${navHTML()}</nav>
      <div class="side-f"><span class="avatar">AU</span><span class="side-u">Admin User<small>Admin</small></span><button type="button" class="icon-btn" data-act="logout" aria-label="Log out" title="Log out">${I("logout")}</button></div>
    </aside>
    ${S.drawer ? '<div class="scrim" data-act="drawer-close"></div>' : ""}
    <div class="body">
      <header class="top"><button type="button" class="icon-btn menu-btn" data-act="drawer" aria-label="Open menu" data-coach="menu-btn">${I("menu")}<span class="menu-l">Menu</span></button><span class="top-t">${esc(title)}</span><span class="top-r"><span class="hipaa">${I("shield", 16)}<span>HIPAA secured</span></span><button type="button" class="icon-btn bell" data-go="dashboard" aria-label="Notifications">${I("bell")}<span class="dot"></span></button></span></header>
      <main class="main" id="main">${inner}</main>
    </div>
  </div>`;
}

/* ================= screens ================= */
function login() {
  return `<div class="login">
    <div class="login-art"><span class="logo logo-lg">AW</span><h2>Allergy Workflow</h2><p>Allergy testing, reports and immunotherapy in one place.</p><ul><li>${I("shield", 18)}<span>HIPAA-oriented, every action is logged</span></li><li>${I("book", 18)}<span>Built-in training for new staff</span></li></ul></div>
    <form class="login-card" data-form="login" novalidate>
      ${guide("Type your username and password, then press Sign in.")}
      <h1>Sign in</h1><p class="muted">Use the account your administrator gave you.</p>
      ${fld("username", "Username", { req: true })}
      ${fld("password", "Password", { req: true, pw: true })}
      <button type="submit" class="btn btn-primary btn-block${V.guided ? " glow" : ""}">Sign in</button>
      <p class="muted small">Forgot your password? Ask your administrator to reset it.</p>
    </form>
  </div>`;
}

function dashboard() {
  const cnt = k => PATIENTS.filter(p => p.status === k).length;
  const due = itVisits().filter(v => v.left <= 2);
  const att = [
    ...(V.calendar === "full" ? S.notes.filter(n => !n.done && n.pri === "high").map(n => ({ pri: "high", t: n.text, d: `Due ${n.date}`, go: "calendar", tab: "notes" })) : []),
    { pri: "mid", t: `${cnt("checking")} reports are waiting for doctor review`, d: "Report Checking", go: "patients", st: "checking" },
    ...due.map(v => ({ pri: v.left < 0 ? "high" : "mid", t: `${name(v.p)}: ${v.left < 0 ? `shot overdue by ${-v.left} day${v.left === -1 ? "" : "s"}` : v.left === 0 ? "shot due today" : `shot due in ${v.left} day${v.left === 1 ? "" : "s"}`}`, d: `Next visit ${fmt(v.next)}`, go: "calendar" })),
    { pri: "low", t: `${cnt("new")} new patient${cnt("new") === 1 ? "" : "s"} without a test yet`, d: "New", go: "patients", st: "new" }
  ];
  const kpi = [["Patients", PATIENTS.length, "users"], ["Active work", PATIENTS.filter(p => ["intake", "ready", "progress", "authorized"].includes(p.status)).length, "flask"], ["Report checking", cnt("checking") + cnt("reviewed"), "doc"], ["IT in progress", cnt("progress"), "vial"]];
  const recent = PATIENTS.slice(0, 6);
  return `${head("Dashboard", "Good morning. Here is what needs attention today.", `${btn("Add Patient", "go-new", { cls: "btn-primary", icon: "plus", glow: true })}${btn("Open Patient List", "go-patients")}${btn("Edit Test Panel", "go-panel")}`, "Start with the red items in 'Needs attention'. Then use the menu to open what you need.")}
  <section class="attn card"><div class="card-h"><h2>${I("bell")} Needs attention</h2><span class="muted small">${att.length} items</span></div>
    <ul class="attn-l">${att.map(a => `<li class="pri-${a.pri}"><span class="pri-dot"></span><span class="attn-t"><strong>${esc(a.t)}</strong><small>${esc(a.d)}</small></span><button type="button" class="btn btn-ghost btn-sm" data-act="attn" data-go2="${a.go}" data-st="${a.st || ""}" data-tab="${a.tab || ""}">Open</button></li>`).join("")}</ul></section>
  <div class="kpis">${kpi.map(([l, n, ic]) => `<div class="kpi">${I(ic, 22)}<strong>${n}</strong><span>${l}</span></div>`).join("")}</div>
  <section class="card"><div class="card-h"><h2>Patients by status</h2><span class="muted small">Tap a status to see the patients</span></div>
    <div class="stbar">${STATUSES.map(([k, l, t]) => `<button type="button" class="stb stb-${t}" data-act="attn" data-go2="patients" data-st="${k}"><span>${l}</span><b>${cnt(k)}</b></button>`).join("")}</div></section>
  <section class="card"><div class="card-h"><h2>Recent activity</h2><button type="button" class="link" data-go="patients">All patients</button></div>
    ${table(["Patient", "Doctor / Facility", "Date of service", "Status", ""], recent.map(p => [`<strong>${name(p)}</strong><small class="muted block">${p.code}</small>`, `${esc(p.doc)}<small class="muted block">${esc(p.fac)}</small>`, p.dos, chip(p.status), `<button type="button" class="btn btn-ghost btn-sm" data-act="open-p" data-id="${p.id}">Open</button>`]))}</section>`;
}

function matches() {
  const s = S.srch, q = [s.name.trim().toLowerCase(), s.email.trim().toLowerCase(), s.phone.replace(/\D/g, "")];
  if (!q[0] && !q[1] && !q[2]) return null;
  return PATIENTS.filter(p => (!q[0] || name(p).toLowerCase().includes(q[0])) && (!q[1] || p.email.toLowerCase().includes(q[1])) && (!q[2] || p.phone.replace(/\D/g, "").includes(q[2])));
}
function suggestHTML() {
  const m = matches(); if (!m) return "";
  return `<div class="sugg" role="listbox" aria-label="Matching patients">${m.length ? `<span class="sugg-h">${m.length} matching patient${m.length === 1 ? "" : "s"}</span>${m.slice(0, 6).map(p => `<button type="button" class="sugg-i" role="option" data-act="open-p" data-id="${p.id}"><span class="avatar sm">${p.first[0]}${p.last[0]}</span><span class="sugg-t"><strong>${name(p)}</strong><small>${esc(p.email || "no e-mail")} · ${esc(p.phone)}</small><small>DOB ${p.dob} · ${esc(p.doc)}</small></span>${chip(p.status)}</button>`).join("")}` : `<span class="sugg-h">No patient found. Check the spelling.</span>`}</div>`;
}
function patients() {
  const f = S.filt, list = PATIENTS.filter(p => (!f.st.length || f.st.includes(p.status)) && (!f.fac || p.fac === f.fac));
  const active = [...f.st.map(k => [`st:${k}`, ST[k][1]]), ...(f.fac ? [["fac", f.fac]] : [])];
  return `${head("Patients", "Find a patient by name, e-mail or phone. Use Filter to show a status or clinic.", btn("New Patient", "go-new", { cls: "btn-primary", icon: "plus", glow: true }), "Start typing a name. The patient appears right below. Tap the card to open.")}
  <section class="card search-card"><div class="search-grid" data-coach="search">
    <div class="fld">${lab("sName", "Name", {})}<div class="ic-in">${I("search", 18)}<input id="f-sName" data-s="name" value="${esc(S.srch.name)}" placeholder="First or last name" autocomplete="off"></div></div>
    <div class="fld">${lab("sEmail", "E-mail", {})}<div class="ic-in">${I("search", 18)}<input id="f-sEmail" data-s="email" value="${esc(S.srch.email)}" placeholder="name@example.com" autocomplete="off"></div></div>
    <div class="fld">${lab("sPhone", "Phone", {})}<div class="ic-in">${I("search", 18)}<input id="f-sPhone" data-s="phone" value="${esc(S.srch.phone)}" placeholder="(347) 555-…" inputmode="tel" autocomplete="off"></div></div>
    <div class="fld fbtn"><span class="lab"><label>&nbsp;</label></span>${btn(`Filter${active.length ? ` (${active.length})` : ""}`, "filter", { icon: "filter", cls: active.length ? "btn-accent-soft" : "btn-ghost", coach: "filter" })}</div>
  </div><div id="sugg">${suggestHTML()}</div>
  ${active.length ? `<div class="actf">${active.map(([k, l]) => `<button type="button" class="tag" data-act="unfilt" data-k="${k}">${esc(l)} ${I("x", 14)}</button>`).join("")}<button type="button" class="link" data-act="clear-filt">Clear all</button></div>` : ""}</section>
  <section class="card pad0"><div class="card-h padx"><h2>${list.length} patient${list.length === 1 ? "" : "s"}</h2><span class="muted small">Page 1 of 1</span></div>
  ${table(["Patient", "E-mail / Phone", "Doctor", "Facility", "DOB", "Date of service", "Status", ""], list.map(p => [`<strong>${name(p)}</strong><small class="muted block">${p.code}</small>`, `${esc(p.email || "—")}<small class="muted block">${esc(p.phone)}</small>`, esc(p.doc), esc(p.fac), p.dob, p.dos, chip(p.status), `<button type="button" class="btn btn-ghost btn-sm" data-act="open-p" data-id="${p.id}">Open</button>`]))}</section>`;
}

function itVisits() {
  return PATIENTS.filter(p => p.status === "progress" && p.lastShot).map(p => { const l = new Date(p.lastShot + "T00:00"); const next = new Date(l); next.setDate(l.getDate() + 7); return { p, last: l, next, left: days(TODAY, next) }; }).sort((a, b) => a.next - b.next);
}
function monthGrid(marks) {
  const y = 2026, m = 10, first = new Date(y, m, 1), n = new Date(y, m + 1, 0).getDate();
  let cells = ""; for (let i = 0; i < first.getDay(); i++) cells += '<div class="mg-c is-out"></div>';
  for (let d = 1; d <= n; d++) {
    const key = fmt(new Date(y, m, d)), ev = marks[key] || [];
    cells += `<div class="mg-c${key === fmt(TODAY) ? " is-today" : ""}"><span class="mg-n">${d}</span>${ev.slice(0, 2).map(e => `<span class="mg-e mg-${e.t}">${esc(e.l)}</span>`).join("")}${ev.length > 2 ? `<span class="mg-more">+${ev.length - 2} more</span>` : ""}</div>`;
  }
  return `<div class="mg"><div class="mg-w">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(w => `<span>${w}</span>`).join("")}</div><div class="mg-g">${cells}</div></div>`;
}
function calendar() {
  const vis = itVisits();
  if (V.calendar !== "full") {
    const marks = {}; vis.forEach(v => { const k = fmt(v.next); (marks[k] = marks[k] || []).push({ l: v.p.last, t: v.left < 0 ? "late" : v.left <= 2 ? "soon" : "ok" }); });
    return `${head("Calendar", "Next immunotherapy visit for every patient on shots. Rule: last shot + 7 days.", "", "Look at the list on the right. Red means the patient is late. Call them.")}
    <div class="note-bar">${I("warn", 18)}<span><b>To discuss with the client:</b> is the weekly rule (last shot + 7 days) correct for everyone?</span></div>
    <div class="cal-2"><section class="card"><div class="card-h"><h2>November 2026</h2><span class="legend"><span class="lg lg-late"></span>Late<span class="lg lg-soon"></span>In 2 days<span class="lg lg-ok"></span>Later</span></div>${monthGrid(marks)}</section>
    <section class="card"><div class="card-h"><h2>Upcoming visits</h2></div><ul class="vis">${vis.map(v => `<li class="vis-${v.left < 0 ? "late" : v.left <= 2 ? "soon" : "ok"}"><span class="vis-d"><b>${v.next.toLocaleString("en-US", { month: "short" })}</b>${v.next.getDate()}</span><span class="vis-t"><strong>${name(v.p)}</strong><small>Last shot ${fmt(v.last)} · ${esc(v.p.doc)}</small></span><span class="vis-s">${v.left < 0 ? `${-v.left} d late` : v.left === 0 ? "Today" : `in ${v.left} d`}</span></li>`).join("")}</ul></section></div>`;
  }
  const tabs = [["appt", "Patient appointments", "users"], ["sched", "Work schedule", "clock"], ["notes", "To-do notes", "note"]];
  let body = "";
  if (S.calTab === "appt") {
    const marks = {}; S.appts.forEach(a => { const p = PATIENTS.find(x => x.id === a.pid); (marks[a.date] = marks[a.date] || []).push({ l: `${a.time} ${p.last}`, t: a.st === "noshow" ? "late" : a.st === "rescheduled" ? "soon" : "ok" }); });
    const AST = { scheduled: ["Scheduled", "info"], confirmed: ["Confirmed", "ok"], arrived: ["Arrived", "accent"], rescheduled: ["Rescheduled", "warn"], noshow: ["No-show", "danger"] };
    body = `<div class="cal-2"><section class="card"><div class="card-h"><h2>November 2026</h2>${btn("Add appointment", "add-appt", { cls: "btn-primary", icon: "plus", glow: true })}</div>${monthGrid(marks)}</section>
    <section class="card"><div class="card-h"><h2>Appointments</h2></div><ul class="vis">${S.appts.slice().sort((a, b) => parse(a.date) - parse(b.date)).map(a => { const p = PATIENTS.find(x => x.id === a.pid), d = parse(a.date); return `<li><span class="vis-d"><b>${d.toLocaleString("en-US", { month: "short" })}</b>${d.getDate()}</span><span class="vis-t"><strong>${name(p)}</strong><small>${a.time} · ${esc(p.doc)}</small></span><span class="chip chip-${AST[a.st][1]}">${AST[a.st][0]}</span><button type="button" class="icon-btn sm" data-act="appt-menu" data-id="${a.id}" aria-label="Change appointment">${I("edit", 16)}</button></li>`; }).join("")}</ul></section></div>`;
  } else if (S.calTab === "sched") {
    const staff = [["Elena Markova, MD", "Doctor"], ["Priya Raman, MD", "Doctor"], ["William Brooks", "Technician"], ["Nadia Frazier", "Technician"]];
    const sh = [["9–5", "9–5", "—", "9–5", "9–1", "—", "—"], ["—", "10–6", "10–6", "—", "10–6", "9–1", "—"], ["8–4", "8–4", "8–4", "8–4", "8–4", "—", "—"], ["12–8", "—", "12–8", "12–8", "—", "9–3", "—"]];
    body = `<section class="card pad0"><div class="card-h padx"><h2>Week of Nov 2 – Nov 8</h2>${btn("Edit shifts", "toast", { icon: "edit", data: ' data-msg="Shift editor opens here (demo)."' })}</div>${table(["Staff", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], staff.map((s, i) => [`<strong>${s[0]}</strong><small class="muted block">${s[1]}</small>`, ...sh[i].map(x => x === "—" ? '<span class="off">Off</span>' : `<span class="shift">${x}</span>`)]))}</section>`;
  } else {
    const PRI = { high: ["Urgent", "danger"], mid: ["Soon", "warn"], low: ["Can wait", "muted"] };
    body = `<section class="card"><div class="card-h"><h2>To-do notes</h2>${btn("Add note", "add-note", { cls: "btn-primary", icon: "plus", glow: true })}</div><p class="muted small">Urgent notes are also shown on the Dashboard under "Needs attention".</p>
    <ul class="notes">${S.notes.map(n => `<li class="pri-${n.pri}${n.done ? " is-done" : ""}"><label class="nchk"><input type="checkbox" data-act="note-done" data-id="${n.id}"${n.done ? " checked" : ""}><span class="sr">Done</span></label><span class="attn-t"><strong>${esc(n.text)}</strong><small>Due ${n.date}</small></span><span class="chip chip-${PRI[n.pri][1]}">${PRI[n.pri][0]}</span><button type="button" class="icon-btn sm danger" data-act="note-del" data-id="${n.id}" aria-label="Delete note">${I("archive", 16)}</button></li>`).join("")}</ul></section>`;
  }
  return `${head("Calendar", "Appointments, staff schedule and daily to-do notes.", "", "Choose a tab at the top: appointments, schedule or notes.")}
  <div class="note-bar">${I("warn", 18)}<span><b>Optional module, to discuss with the client.</b> If it is not needed, the simple version stays.</span></div>
  <div class="tabs" role="tablist">${tabs.map(([k, l, ic]) => `<button type="button" role="tab" class="tab${S.calTab === k ? " is-on" : ""}" aria-selected="${S.calTab === k}" data-act="caltab" data-k="${k}">${I(ic, 18)}<span>${l}</span></button>`).join("")}</div>${body}`;
}

function newPatient() {
  const insur = ["Aetna", "Blue Cross Blue Shield", "Cigna", "Medicare", "Medicaid", "UnitedHealthcare", "Self-pay"];
  return `${head("New Patient", `Fields with <span class="req">*</span> are required. <span class="disc">to discuss</span> = the client confirms if the field blocks saving.`, "", "Fill the boxes with a red star first. Press ? if you do not know what to type.")}
  <form class="np" data-form="np" novalidate>
  <section class="card"><div class="card-h"><h2><span class="sec-n">1</span>Patient identity</h2></div><div class="grid g3">
    ${fld("first", "First name", { req: true, discuss: true })}${fld("middle", "Middle name", { opt: true })}${fld("last", "Last name", { req: true, discuss: true })}
    ${fld("dob", "Date of birth", { req: true, date: true, discuss: true })}${fld("email", "E-mail", { type: "email", ph: "name@example.com", discuss: true })}${fld("phone", "Phone", { type: "tel", ph: "(347) 555-1012", discuss: true })}
    ${fld("insurance", "Insurance", { opts: insur, discuss: true })}</div></section>
  <section class="card"><div class="card-h"><h2><span class="sec-n">2</span>Visit and testing</h2></div><div class="grid g3">
    ${fld("dos", "Date of service", { req: true, date: true })}${fld("allergy", "Allergy test", { opt: true, opts: ["Nano Panel", "Full Panel (78)", "Pediatric Panel"] })}${fld("pft", "PFT (breathing test)", { opt: true, opts: ["Spirometry", "Spirometry + bronchodilator"] })}</div></section>
  <section class="card"><div class="card-h"><h2><span class="sec-n">3</span>Provider and facility</h2></div><div class="grid g3">
    ${fld("physician", "Prescribing physician", { req: true, opts: DOCTORS })}${fld("npi", "Prescribing NPI", { ro: true, note: "Fills in by itself" })}${fld("facility", "Facility name", { req: true, opts: FACILITIES.map(f => f.name), discuss: true })}
    ${fld("faddr", "Facility address", { ro: true, wide: true })}${fld("fphone", "Facility phone", { ro: true })}${fld("ffax", "Fax", { ro: true })}
    ${fld("interp", "Interpreting doctor", { opts: DOCTORS, discuss: true })}${fld("billed", "Billed by", { discuss: true })}${fld("rn", "RN", { opt: true })}</div></section>
  <section class="card"><div class="card-h"><h2><span class="sec-n">4</span>Billing</h2><span class="optl">optional</span></div><div class="grid g2">
    ${fld("cpt", "CPT codes", { opt: true, ph: "Search CPT, e.g. 95004" })}${fld("icd", "ICD-10 codes", { opt: true, ph: "Search ICD-10, e.g. J30.1" })}${fld("notes", "Internal notes", { opt: true, area: true, wide: true, ph: "Only staff can see this" })}</div></section>
  <div class="stick-foot">${btn("Cancel", "np-cancel", { cls: "btn-ghost" })}<button type="submit" class="btn btn-primary btn-lg${V.guided ? " glow" : ""}">${I("check", 18)}<span>Create patient</span></button></div>
  </form>`;
}

function testPanel() {
  const opts = v => `<div class="sel sel-sm"><select aria-label="Allergen">${ALLERGENS.slice(2).map(a => `<option${a === v ? " selected" : ""}>${a}</option>`).join("")}</select>${I("chevd", 14)}</div>`;
  const L = ["Cockroach, American", "Cockroach, German", "Tobacco Leaf"], R = ["Cat Hair, Standardized", "Dog Epithelia", "Dust Mite - Farinae", "Dust Mite - Pteronyssinus", "Guinea Pig Epithelia"];
  let rows = `<tr><td class="n">1</td><td class="ctl">Positive Histamine Control</td><td class="mm"><span class="yn"><button type="button">Y</button><button type="button">N</button></span></td><td class="panel" rowspan="5">A</td><td class="n">6</td><td>${opts(R[0])}</td><td class="mm"></td></tr>
  <tr><td class="n">2</td><td class="ctl">Negative Glycerin Control</td><td class="mm"></td><td class="n">7</td><td>${opts(R[1])}</td><td class="mm"></td></tr>`;
  for (let i = 0; i < 3; i++) rows += `<tr><td class="n">${i + 3}</td><td>${opts(L[i])}</td><td class="mm"></td><td class="n">${i + 8}</td><td>${opts(R[i + 2])}</td><td class="mm"></td></tr>`;
  return `${head("Allergy Test Panel", "Elena Markova, MD · 2 facility presets", btn("Patients", "go-patients"), "This screen keeps its layout. Choose allergens in the lists and press Save.")}
  <div class="note-bar ok">${I("check", 18)}<span>Layout unchanged by agreement. Only colors, fonts and fields were refreshed.</span></div>
  <section class="card"><div class="card-h"><div><h2>Queens Allergy Center</h2><span class="muted small">Allergy Test Form Preset · version 1 · 78 allergens</span></div><span class="chip chip-ok">Active</span></div>
  <div class="grid g2">${fld("preset", "Preset name", {})}${fld("findAllergen", "Find diagnostic allergen", { ph: "Type, e.g. dust" })}</div>
  <div class="tbl-wrap"><table class="tp"><thead><tr><th></th><th>Allergen</th><th>MM</th><th>Panel</th><th></th><th>Allergen</th><th>MM</th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="row-end">${btn("Save panel", "save-panel", { cls: "btn-primary", icon: "check" })}</div></section>`;
}

function antigensBlock() {
  const q = S.antQ.trim().toLowerCase(), rows = ANTIGENS.map((a, i) => [a, i]).filter(([a]) => !q || a[0].toLowerCase().includes(q));
  const sec = (k, title, count) => {
    const open = S.antOpen[k];
    return `<section class="card acc${open ? " is-open" : ""}"><button type="button" class="acc-h" data-act="acc" data-k="${k}" aria-expanded="${open}"${k === "test" ? ' data-coach="antigens"' : ""}><span class="acc-c">${I("chev", 18)}</span><span class="acc-t"><strong>${title}</strong><small>${count} records · tap to ${open ? "hide" : "show"}</small></span></button>
    ${open ? `<div class="acc-b"><div class="ant-tools"><div class="fld">${lab("antQ", "Search", {})}<div class="ic-in">${I("search", 18)}<input id="f-antQ" data-ant value="${esc(S.antQ)}" placeholder="Extract name" autocomplete="off"></div></div>${btn("Add allergen", "add-ant", { cls: "btn-primary", icon: "plus" })}</div>
    ${table(["Extract name", "Type", "Lot #", "Expiration", "Strength", "Manufacturer", ""], rows.map(([a, i]) => S.editRow === `${k}${i}` ? [`<input class="cell-in" value="${esc(a[0])}" aria-label="Extract name">`, `<input class="cell-in" value="${esc(a[1])}" aria-label="Type">`, `<input class="cell-in" value="${esc(a[2])}" aria-label="Lot">`, `<input class="cell-in" value="${esc(a[3])}" aria-label="Expiration">`, `<input class="cell-in" value="${esc(a[4])}" aria-label="Strength">`, `<input class="cell-in" value="${esc(a[5])}" aria-label="Manufacturer">`, `<span class="cell-a">${btn("Save", "ant-save", { cls: "btn-primary btn-sm", data: ` data-n="${esc(a[0])}"` })}${btn("Cancel", "ant-cancel", { cls: "btn-ghost btn-sm" })}</span>`] : [`<strong>${esc(a[0])}</strong>`, esc(a[1]), a[2], a[3], esc(a[4]), esc(a[5]), `<span class="cell-a"><button type="button" class="icon-btn sm" data-act="ant-edit" data-k="${k}${i}" aria-label="Edit ${esc(a[0])}">${I("edit", 16)}</button><button type="button" class="icon-btn sm danger" data-act="ant-arch" data-n="${esc(a[0])}" aria-label="Archive ${esc(a[0])}">${I("archive", 16)}</button></span>`]))}</div>` : ""}</section>`;
  };
  return sec("test", "Allergen test records", 153) + sec("it", "Allergen immunotherapy records", 150);
}
function antigens() {
  return `${head("Antigens", "Private catalogue of Elena Markova, MD. Tap a section title to open or hide it.", "", "Tap 'Allergen test records' to open the list. Use the pencil to edit a row.")}${antigensBlock()}`;
}

function profile() {
  const pr = S.prof, req = [!!pr.name, pr.facs.length > 0, !!pr.sig], n = req.filter(Boolean).length;
  S.f.dname = S.f.dname ?? pr.name; S.f.dsig = pr.sig;
  const avail = FACILITIES.map(f => f.name).filter(x => !pr.facs.includes(x));
  return `${head("My Profile", "Doctor profile. Three things are required, the rest can be added later.", "", "Check the 3 required steps. Green means done.")}
  <section class="card prog"><div class="prog-h"><strong>Required: ${n} of 3 done</strong><span class="muted small">${n === 3 ? "The profile is ready for reports." : "Reports are blocked until all 3 are done."}</span></div><div class="prog-bar"><span style="width:${n / 3 * 100}%"></span></div>
  <ol class="prog-s">${[["Legal name", req[0]], ["Linked clinic", req[1]], ["Signature PDF", req[2]]].map(([l, ok]) => `<li class="${ok ? "is-ok" : ""}">${ok ? I("check", 18) : `<span class="ring"></span>`}<span>${l}</span></li>`).join("")}</ol></section>
  <section class="card"><div class="card-h"><h2><span class="sec-n">1</span>Doctor account details</h2></div><div class="grid g2">
    ${fld("dname", "Doctor legal name", { req: true })}${fld("dphone", "Phone", { opt: true, type: "tel" })}${fld("daddr", "Address", { opt: true, wide: true })}${fld("demail", "E-mail", { opt: true, type: "email" })}
    ${fld("dsig", "Signature PDF", { req: true, file: true, note: "Without a signature the report cannot be created." })}</div>
    <div class="row-end">${btn("Save doctor profile", "save-prof", { cls: "btn-primary", icon: "check" })}</div></section>
  <section class="card"><div class="card-h"><h2><span class="sec-n">2</span>Linked facilities<span class="req">*</span>${help("facAdd")}</h2></div>
    <div class="facs">${pr.facs.map(f => `<span class="fac">${I("hosp", 16)}<span>${esc(f)}</span><button type="button" class="icon-btn sm danger" data-act="fac-rm" data-n="${esc(f)}" aria-label="Remove ${esc(f)}">${I("x", 14)}</button></span>`).join("") || '<span class="ferr">Add at least one clinic.</span>'}</div>
    ${avail.length ? `<div class="fac-add"><div class="sel"><select id="f-facAdd" aria-label="Clinic to add">${avail.map(a => `<option>${esc(a)}</option>`).join("")}</select>${I("chevd", 16)}</div>${btn("Add facility", "fac-add", { cls: "btn-primary", icon: "plus" })}</div>` : ""}</section>
  <section class="card"><div class="card-h"><h2><span class="sec-n">3</span>NPI profile</h2><span class="optl">optional, add later</span></div>
    <div class="npi-row">${fld("npiNum", "NPI number", { ph: "10 digits" })}${btn("Verify in registry", "npi-verify", { icon: "check" })}</div>
    <button type="button" class="acc-mini" data-act="npi-more" aria-expanded="${S.npiMore}">${I(S.npiMore ? "chevd" : "chev", 16)}<span>${S.npiMore ? "Hide" : "Show"} NPI details (credentials, specialty, hospital)</span></button>
    ${S.npiMore ? `<div class="grid g2">${fld("cred", "Credentials", { ph: "MD" })}${fld("spec", "Specialization", { opts: ["Allergist", "Therapist", "Pediatrician", "Pulmonologist", "Other"] })}${fld("fname", "Facility / hospital name", {})}${fld("regname", "Registry provider name", { ro: true })}${fld("taxonomy", "Registry taxonomy codes", { ro: true, wide: true })}</div>
    <div class="row-end">${btn("Unlink NPI", "npi-unlink", { cls: "btn-danger-ghost" })}${btn("Save NPI profile", "npi-save", { cls: "btn-primary" })}</div>` : ""}</section>
  <h2 class="h2-out">Antigens</h2>${antigensBlock()}`;
}

function accounts() {
  return `${head("Accounts", "Who can log in and what they can do.", btn("New account", "add-acc", { cls: "btn-primary", icon: "plus", glow: true }), "To stop someone from logging in, press Deactivate next to their name.")}
  <section class="card pad0">${table(["Name", "Username", "Role", "Status", ""], USERS.map((u, i) => [`<strong>${esc(u[0])}</strong>`, `<code>${u[1]}</code>`, esc(u[2]), u[3] ? '<span class="chip chip-ok">Active</span>' : '<span class="chip chip-muted">Deactivated</span>', `<span class="cell-a">${btn("Reset password", "acc-reset", { cls: "btn-ghost btn-sm", data: ` data-n="${esc(u[0])}"` })}${u[3] ? btn("Deactivate", "acc-off", { cls: "btn-danger-ghost btn-sm", data: ` data-n="${esc(u[0])}"` }) : btn("Activate", "toast", { cls: "btn-ghost btn-sm", data: ' data-msg="Account activated."' })}</span>`]))}</section>`;
}

function settings() {
  const s = S.sub, t = SETTINGS.find(x => x[0] === s)[1];
  let b = "";
  if (s === "vitus") b = `<div class="stat-row"><span class="chip chip-ok">Connected · sandbox</span><span class="muted small">Last check 11/04/2026 08:12</span></div>
    ${table(["Event", "Report", "Received", "Result"], [["Report updated", "sbx_nano_typical", "10/14/2026 16:02", '<span class="chip chip-ok">Imported</span>'], ["Webhook test", "—", "10/14/2026 15:58", '<span class="chip chip-ok">Accepted</span>'], ["Reconciliation", "sbx_nano_typical", "10/14/2026 16:03", '<span class="chip chip-info">Replay, no changes</span>']])}
    <div class="row-end">${btn("Run reconciliation", "vitus-run", { cls: "btn-primary", icon: "undo" })}</div>`;
  else if (s === "reminders") b = `<div class="grid g2">${fld("remDays", "Days before yearly review", { opts: ["3", "7", "14", "30"] })}<div class="fld"><span class="lab"><label>Notify the doctor</label></span><label class="switch"><input type="checkbox" checked><span></span><em>On</em></label></div></div><div class="row-end">${btn("Save reminder rules", "save-set", { cls: "btn-primary", icon: "check" })}</div>`;
  else if (s === "notifications") { const ev = ["New patient created", "Report ready for review", "Report signed", "Immunotherapy started", "Repeat immunotherapy started"]; b = `${table(["Event", "Admin", "Doctor", "Specialist"], ev.map((e, i) => [e, ...[i >= 3, true, i > 0].map(on => `<label class="switch sm"><input type="checkbox"${on ? " checked" : ""} aria-label="${e}"><span></span></label>`)]))}<div class="row-end">${btn("Save notifications", "save-set", { cls: "btn-primary", icon: "check" })}</div>`; }
  else if (s === "immuno") { const v = [["#6", "White", "#ffffff", "1:100,000"], ["#5", "Gray", "#a7afba", "1:10,000"], ["#4", "Green", "#2f9e57", "1:1,000"], ["#3", "Blue", "#2f6fd6", "1:100"], ["#2", "Yellow", "#f2c230", "1:10"], ["#1", "Red", "#d23a2f", "1:1"]]; b = `<h3 class="h3">Vial colors</h3><div class="vials">${v.map(x => `<div class="vial"><span class="vcap" style="background:${x[2]}"></span><b>${x[0]}</b><small>${x[1]}</small><small>${x[3]}</small></div>`).join("")}</div><h3 class="h3">Label sizes</h3><div class="grid g2"><div class="mini"><strong>Small color label</strong><span class="muted">50.8 × 25.4 mm (2 × 1 in) · 6 per vial set</span></div><div class="mini"><strong>Large yellow vial label</strong><span class="muted">100 × 18 mm · landscape</span></div></div><div class="row-end">${btn("Label calibration", "toast", { icon: "vial", data: ' data-msg="Label calibration page opens here (demo)."' })}</div>`; }
  else if (s === "templates") { const tp = [["Allergy Test Template", "Allergy_Test_Web_Field_Template.xlsx", "31.4 KB", false], ["Allergy Report DOCX", "Allergy_Report_Web_Field_Template.docx", "36.6 KB", true], ["Negative Allergy Report DOCX", "Allergy_Report_Negative_Web_Field_Template.docx", "36.5 KB", true], ["Allergy Report Field Map", "Allergy_Report_Web_Field_Template.xlsx", "38.4 KB", false]]; b = `<div class="tpl">${tp.map(x => `<article class="tpl-c"><span class="tpl-ic">${I("doc", 26)}</span><span class="tpl-t"><strong>${x[0]}</strong><small>${x[1]} · ${x[2]}</small><small>${x[3] ? "Previous version saved, you can roll back" : "Standard copy, always kept"}</small></span><span class="tpl-a">${btn("Preview", "toast", { icon: "eye", cls: "btn-ghost btn-sm", data: ' data-msg="Preview opens here (demo)."' })}${btn("Download", "toast", { icon: "download", cls: "btn-ghost btn-sm", data: ' data-msg="Download started (demo)."' })}${btn("Upload new", "tpl-up", { icon: "upload", cls: "btn-primary btn-sm", data: ` data-n="${x[0]}"` })}${x[3] ? btn("Roll back", "tpl-rb", { icon: "undo", cls: "btn-danger-ghost btn-sm", data: ` data-n="${x[0]}"` }) : ""}</span></article>`).join("")}</div><div class="note-bar">${I("warn", 18)}<span>A new file must be the same Office type with the same fields. The standard copy is never deleted.</span></div>`; }
  else b = `${table(["Facility", "Address", "Linked doctors", ""], FACILITIES.map((f, i) => [`<strong>${esc(f.name)}</strong>`, esc(f.addr), `${[2, 3, 1, 2][i]} doctors`, `<span class="cell-a">${btn("Open", "toast", { cls: "btn-ghost btn-sm", data: ' data-msg="Facility details open here (demo)."' })}</span>`]))}<div class="row-end">${btn("Link doctor to facility", "toast", { cls: "btn-primary", icon: "plus", data: ' data-msg="Link form opens here (demo)."' })}</div>`;
  return `${head(t, "Settings", "", "Choose a settings item in the menu on the left. Only that item opens here.")}<section class="card island">${b}</section>`;
}

const LESSONS = [
  { id: "l1", t: "Use the side menu", m: 1, s: ["The menu is on the left. On a tablet or phone press the Menu button.", "Groups: Clinical, Practice, Admin, Help.", "Settings opens a small list of its own. Pick one item."], go: "dashboard", target: D === "desktop" ? "[data-coach=nav-settings]" : "[data-coach=menu-btn]", tip: D === "desktop" ? "Press Settings to see its own small menu." : "Press Menu to open the list of sections." },
  { id: "l2", t: "Find a patient", m: 1, s: ["Open Patients.", "Type part of the name, e-mail or phone.", "Matching patients appear right away. Tap the card."], go: "patients", target: "[data-coach=search]", tip: "Type here. Results appear under the boxes." },
  { id: "l3", t: "Filter the list", m: 1, s: ["Press Filter.", "Tick the statuses or choose a clinic.", "Press Show patients. Remove a filter with its ×."], go: "patients", target: "[data-coach=filter]", tip: "One button for all filters." },
  { id: "l4", t: "Add a new patient", m: 2, s: ["Fields with a red * are required.", "Press ? next to a field to see what to type.", "Dates: press the calendar button."], go: "newpatient", target: ".help", tip: "Point at ? to read the help for this field." },
  { id: "l5", t: "Finish a doctor profile", m: 2, s: ["Legal name, at least one clinic, and a signature PDF are required.", "The green bar shows how much is done.", "NPI can be added later."], go: "profile", target: ".prog", tip: "All 3 steps must be green." },
  { id: "l6", t: "Red warnings", m: 1, s: ["A red question on white means: stop and check.", "Read it out loud.", "If you are not sure, press the gray button."], demo: true }
];
function training() {
  const n = LESSONS.filter(l => doneLessons[l.id]).length;
  return `${head("Training", "Short lessons. Press Show me and the app shows where to click.", "", "Do the lessons in order. Press Show me in each card.")}
  <section class="card prog"><div class="prog-h"><strong>${n} of ${LESSONS.length} lessons done</strong></div><div class="prog-bar"><span style="width:${n / LESSONS.length * 100}%"></span></div></section>
  <div class="lessons">${LESSONS.map((l, i) => `<article class="card lesson${doneLessons[l.id] ? " is-done" : ""}"><div class="lesson-h"><span class="sec-n">${doneLessons[l.id] ? "✓" : i + 1}</span><span><strong>${l.t}</strong><small class="muted block">${l.m} min</small></span></div><ol>${l.s.map(x => `<li>${esc(x)}</li>`).join("")}</ol><div class="row">${btn("Show me", "show-me", { cls: "btn-primary btn-sm", data: ` data-id="${l.id}"` })}${btn(doneLessons[l.id] ? "Done ✓" : "Mark as done", "lesson-done", { cls: "btn-ghost btn-sm", data: ` data-id="${l.id}"` })}</div></article>`).join("")}</div>`;
}

/* ================= render ================= */
const SCREENS = { dashboard, patients, calendar, newpatient: newPatient, testpanel: testPanel, profile, antigens, accounts, settings, training };
function render(keepScroll) {
  clearCoach();
  const sc = $(".body") || $(".login"), top = sc ? sc.scrollTop : 0;
  $("#app").innerHTML = shell(S.screen === "login" ? "" : SCREENS[S.screen]());
  const nb = $(".body") || $(".login"); if (nb) nb.scrollTop = keepScroll ? top : 0;
}
function go(k) { S.screen = k; S.drawer = false; S.err = {}; S.dp = null; if (k === "settings") S.setOpen = true; render(); }

/* ================= dialogs ================= */
function confirmBox(o, onYes) {
  const root = $("#modal-root"), prev = document.activeElement;
  root.innerHTML = `<div class="m-back"><div class="m-box" role="alertdialog" aria-modal="true" aria-labelledby="m-t" aria-describedby="m-d"><span class="m-ic">${I(o.ok ? "check" : "warn", 34)}</span><h2 id="m-t" class="m-t">${esc(o.title)}</h2><div id="m-d" class="m-d">${o.html || `<p>${esc(o.text)}</p>`}</div>
  ${o.word ? `<label class="m-wl" for="m-w">Type <b>${o.word}</b> to confirm</label><input id="m-w" class="m-w" autocomplete="off">` : ""}
  <div class="m-a"><button type="button" class="btn m-no" id="m-no">${esc(o.no || "No, go back")}</button><button type="button" class="btn m-yes" id="m-yes">${esc(o.yes)}</button></div></div></div>`;
  const yes = $("#m-yes"), w = $("#m-w");
  const upd = () => { yes.disabled = !!(w && w.value.trim().toUpperCase() !== o.word); };
  upd(); w && w.addEventListener("input", upd);
  const close = () => { root.innerHTML = ""; document.removeEventListener("keydown", key); prev && prev.focus && prev.focus({ preventScroll: true }); };
  const key = e => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", key);
  $("#m-no").onclick = close;
  yes.onclick = () => { if (yes.disabled) return; close(); onYes && onYes(); };
  $("#m-no").focus();
}
function sheet(title, body, foot, onMount) {
  const root = $("#modal-root");
  root.innerHTML = `<div class="m-back sh-back" data-act="sheet-close"><div class="sh" role="dialog" aria-modal="true" aria-labelledby="sh-t"><div class="sh-h"><h2 id="sh-t">${esc(title)}</h2><button type="button" class="icon-btn" data-act="sheet-close" aria-label="Close">${I("x")}</button></div><div class="sh-b">${body}</div><div class="sh-f">${foot}</div></div></div>`;
  onMount && onMount(root);
  const f = root.querySelector("input,select,button.sh-first"); f && f.focus();
}
const closeSheet = () => { $("#modal-root").innerHTML = ""; };
function toast(t, warn) {
  const r = $("#toast-root");
  r.innerHTML = `<div class="toast${warn ? " is-warn" : ""}" role="status">${I(warn ? "warn" : "check", 20)}<span>${esc(t)}</span><button type="button" class="toast-x" aria-label="Close">${I("x", 16)}</button></div>`;
  r.querySelector(".toast-x").onclick = () => r.innerHTML = "";
  clearTimeout(toast.t); toast.t = setTimeout(() => r.innerHTML = "", 5000);
}
function clearCoach() { document.querySelectorAll(".coach-on").forEach(e => e.classList.remove("coach-on")); const b = $("#coach"); b && b.remove(); }
function coach(sel, text) {
  const el = $("#app " + sel); if (!el) return;
  coach.at = Date.now();
  el.scrollIntoView({ block: "center" });
  el.classList.add("coach-on");
  const dev = $(".device"), dr = dev.getBoundingClientRect(), sc = dr.width / dev.offsetWidth, r = el.getBoundingClientRect();
  const b = document.createElement("div"); b.id = "coach"; b.className = "coach"; b.setAttribute("role", "dialog"); b.setAttribute("aria-label", "Training hint");
  b.innerHTML = `<span class="coach-tag">Training</span><p>${esc(text)}</p><button type="button" class="btn">Got it</button>`;
  dev.appendChild(b);
  const w = Math.min(280, dev.offsetWidth - 32); b.style.width = w + "px";
  let left = (r.left - dr.left) / sc; left = Math.max(16, Math.min(left, dev.offsetWidth - w - 16));
  let top = (r.bottom - dr.top) / sc + 12; if (top + 150 > dev.offsetHeight) top = (r.top - dr.top) / sc - 150;
  b.style.left = left + "px"; b.style.top = Math.max(12, top) + "px";
  b.querySelector("button").onclick = clearCoach; b.querySelector("button").focus({ preventScroll: true });
}

/* ================= actions ================= */
function validateNP() {
  const e = {}, f = S.f;
  if (!(f.first || "").trim()) e.first = "Type the first name.";
  if (!(f.last || "").trim()) e.last = "Type the last name.";
  if (!parse(f.dob)) e.dob = "Choose the date of birth (MM/DD/YYYY).";
  else if (parse(f.dob) > TODAY) e.dob = "The date of birth cannot be in the future.";
  if (!parse(f.dos)) e.dos = "Choose the date of service.";
  if (!f.physician) e.physician = "Choose the doctor.";
  if (!f.facility) e.facility = "Choose the clinic.";
  if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = "Check the e-mail, it looks wrong. Example: maria@gmail.com";
  S.err = e; return !Object.keys(e).length;
}
function filterSheet() {
  const tmp = { st: [...S.filt.st], fac: S.filt.fac };
  const body = () => `<p class="muted small">Tick what you want to see. You can tick several.</p><div class="fl">${STATUSES.map(([k, l, t]) => `<label class="fl-i"><input type="checkbox" data-fst="${k}"${tmp.st.includes(k) ? " checked" : ""}><span class="chip chip-${t}">${l}</span><b>${PATIENTS.filter(p => p.status === k).length}</b></label>`).join("")}</div>
  <div class="fld"><span class="lab"><label for="fl-fac">Facility</label></span><div class="sel"><select id="fl-fac"><option value="">All facilities</option>${FACILITIES.map(f => `<option${tmp.fac === f.name ? " selected" : ""}>${esc(f.name)}</option>`).join("")}</select>${I("chevd", 16)}</div></div>`;
  sheet("Filter patients", body(), `<button type="button" class="btn btn-ghost" data-act="fl-clear">Clear</button><button type="button" class="btn btn-primary" data-act="fl-apply">Show patients</button>`, root => {
    root.addEventListener("change", e => { const k = e.target.dataset.fst; if (k) { e.target.checked ? tmp.st.push(k) : tmp.st.splice(tmp.st.indexOf(k), 1); } if (e.target.id === "fl-fac") tmp.fac = e.target.value; });
    root.querySelector("[data-act=fl-apply]").onclick = () => { S.filt = tmp; closeSheet(); render(true); };
    root.querySelector("[data-act=fl-clear]").onclick = () => { S.filt = { st: [], fac: "" }; closeSheet(); render(true); };
  });
}
function formSheet(title, fields, yes, onSave) {
  sheet(title, `<div class="grid g1">${fields}</div>`, `<button type="button" class="btn btn-ghost" data-act="sheet-close">Cancel</button><button type="button" class="btn btn-primary" id="sh-save">${esc(yes)}</button>`, root => {
    root.querySelector("#sh-save").onclick = () => { const vals = {}; root.querySelectorAll("[data-k]").forEach(i => vals[i.dataset.k] = i.value); if (onSave(vals, root) !== false) closeSheet(); };
  });
}

document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g && $("#app").contains(g)) { go(g.dataset.go); return; }
  const a = e.target.closest("[data-act]"); if (!a) return;
  const act = a.dataset.act, id = Number(a.dataset.id), n = a.dataset.n;
  switch (act) {
    case "drawer": S.drawer = true; render(true); break;
    case "drawer-close": S.drawer = false; render(true); break;
    case "settings-toggle":
      if (D !== "desktop" && !S.drawer) { S.drawer = true; S.setOpen = true; render(true); break; }
      S.setOpen = !S.setOpen; render(true); break;
    case "sub": S.sub = a.dataset.k; go("settings"); break;
    case "logout": confirmBox({ title: "Log out?", text: "You will need your password to come back.", yes: "Yes, log out", no: "No, stay" }, () => { S.screen = "login"; S.drawer = false; render(); }); break;
    case "pw": S.showPw = !S.showPw; render(true); $("#f-password") && $("#f-password").focus(); break;
    case "go-new": go("newpatient"); break;
    case "go-patients": go("patients"); break;
    case "go-panel": go("testpanel"); break;
    case "attn": if (a.dataset.st) S.filt = { st: [a.dataset.st], fac: "" }; if (a.dataset.tab) S.calTab = a.dataset.tab; go(a.dataset.go2); break;
    case "open-p": { const p = PATIENTS.find(x => x.id === id); toast(`Opening ${name(p)} (patient record, demo).`); break; }
    case "filter": filterSheet(); break;
    case "unfilt": { const k = a.dataset.k; if (k === "fac") S.filt.fac = ""; else S.filt.st = S.filt.st.filter(x => `st:${x}` !== k); render(true); break; }
    case "clear-filt": S.filt = { st: [], fac: "" }; render(true); break;
    case "sheet-close": if (e.target === a || a.tagName === "BUTTON") closeSheet(); break;
    case "dp": S.dp = S.dp === a.dataset.k ? null : a.dataset.k; S.dpMonth = null; render(true); break;
    case "dp-m": { const b = S.dpMonth || parse(S.f[S.dp]) || TODAY; S.dpMonth = new Date(b.getFullYear(), b.getMonth() + Number(a.dataset.d), 1); render(true); break; }
    case "dp-pick": S.f[a.dataset.k] = a.dataset.v; delete S.err[a.dataset.k]; S.dp = null; S.dpMonth = null; render(true); break;
    case "dp-clear": S.f[a.dataset.k] = ""; S.dp = null; render(true); break;
    case "np-cancel": confirmBox({ title: "Leave without saving?", text: "Everything you typed for this patient will be lost.", yes: "Yes, leave", no: "No, keep typing" }, () => { S.f = { dos: "11/04/2026", physician: DOCTORS[0], npi: "1234567893", preset: S.f.preset, remDays: "7" }; go("dashboard"); }); break;
    case "caltab": S.calTab = a.dataset.k; render(true); break;
    case "add-appt": formSheet("Add appointment", `<div class="fld"><span class="lab"><label for="ap-p">Patient<span class="req">*</span></label>${help("apPatient")}</span><div class="sel"><select id="ap-p" data-k="pid">${PATIENTS.filter(p => p.status === "progress").map(p => `<option value="${p.id}">${name(p)}</option>`).join("")}</select>${I("chevd", 16)}</div></div><div class="fld"><span class="lab"><label for="ap-d">Date<span class="req">*</span></label>${help("apDate")}</span><input id="ap-d" data-k="date" value="11/13/2026" placeholder="MM/DD/YYYY"></div><div class="fld"><span class="lab"><label for="ap-t">Time<span class="req">*</span></label>${help("apTime")}</span><input id="ap-t" data-k="time" value="10:00" placeholder="HH:MM"></div>`, "Save appointment", v => { if (!parse(v.date)) { toast("Type the date as MM/DD/YYYY.", true); return false; } S.appts.push({ id: Date.now(), pid: Number(v.pid), date: v.date, time: v.time, st: "scheduled" }); render(true); toast("Appointment saved."); }); break;
    case "appt-menu": { const ap = S.appts.find(x => x.id === id), p = PATIENTS.find(x => x.id === ap.pid); sheet(`${name(p)} · ${ap.date} ${ap.time}`, `<p class="muted">What happened with this appointment?</p><div class="choice">${[["confirmed", "Confirmed"], ["arrived", "Arrived"], ["rescheduled", "Rescheduled"], ["noshow", "No-show"]].map(([k, l]) => `<button type="button" class="btn btn-ghost" data-ast="${k}">${l}</button>`).join("")}</div>`, `<button type="button" class="btn btn-danger-ghost" id="ap-del">Cancel appointment</button>`, root => { root.querySelectorAll("[data-ast]").forEach(b => b.onclick = () => { ap.st = b.dataset.ast; closeSheet(); render(true); toast("Appointment updated."); }); root.querySelector("#ap-del").onclick = () => confirmBox({ title: "Cancel this appointment?", html: `<p><b>${name(p)}</b>, ${ap.date} at ${ap.time}.</p>`, yes: "Yes, cancel it", no: "No, keep it" }, () => { S.appts = S.appts.filter(x => x !== ap); render(true); toast("Appointment cancelled."); }); }); break; }
    case "add-note": formSheet("Add note", `<div class="fld"><span class="lab"><label for="nt-t">What to do<span class="req">*</span></label>${help("ntText")}</span><input id="nt-t" data-k="text" placeholder="Call Sarah Simon to confirm Friday"></div><div class="fld"><span class="lab"><label for="nt-d">Due date<span class="req">*</span></label>${help("ntDate")}</span><input id="nt-d" data-k="date" value="11/05/2026"></div><div class="fld"><span class="lab"><label for="nt-p">Importance</label>${help("ntPri")}</span><div class="sel"><select id="nt-p" data-k="pri"><option value="high">Urgent (red)</option><option value="mid" selected>Soon (yellow)</option><option value="low">Can wait (gray)</option></select>${I("chevd", 16)}</div></div>`, "Save note", v => { if (!v.text.trim()) { toast("Type what needs to be done.", true); return false; } S.notes.unshift({ id: Date.now(), text: v.text.trim(), date: v.date, pri: v.pri, done: false }); render(true); toast(v.pri === "high" ? "Note saved. It is also on the Dashboard." : "Note saved."); }); break;
    case "note-done": { const nt = S.notes.find(x => x.id === id); nt.done = a.checked; render(true); break; }
    case "note-del": { const nt = S.notes.find(x => x.id === id); confirmBox({ title: "Delete this note?", html: `<p>“${esc(nt.text)}”</p>`, yes: "Yes, delete", no: "No, keep it" }, () => { S.notes = S.notes.filter(x => x !== nt); render(true); toast("Note deleted."); }); break; }
    case "save-panel": confirmBox({ title: "Save this test panel?", text: "New tests for this clinic will use these allergens.", yes: "Yes, save", no: "No, go back", ok: true }, () => toast("Test panel saved.")); break;
    case "acc": S.antOpen[a.dataset.k] = !S.antOpen[a.dataset.k]; render(true); break;
    case "add-ant": formSheet("Add allergen", ["aname:Extract name:1", "atype:Type:1", "alot:Lot #:0", "aexp:Expiration (MM/DD/YYYY):0", "astr:Strength:0", "aman:Manufacturer:0"].map(x => { const [k, l, r] = x.split(":"); return `<div class="fld"><span class="lab"><label for="sh-${k}">${l}${r === "1" ? '<span class="req">*</span>' : ""}</label>${help(k)}</span><input id="sh-${k}" data-k="${k}"></div>`; }).join(""), "Add allergen", v => { if (!v.aname.trim() || !v.atype.trim()) { toast("Extract name and Type are required.", true); return false; } ANTIGENS.unshift([v.aname.trim(), v.atype.trim(), v.alot, v.aexp, v.astr, v.aman]); render(true); toast("Allergen added."); }); break;
    case "ant-edit": S.editRow = a.dataset.k; render(true); break;
    case "ant-cancel": S.editRow = null; render(true); break;
    case "ant-save": confirmBox({ title: "Save changes?", html: `<p>Allergen <b>${esc(n)}</b> will be updated.</p>`, yes: "Yes, save", no: "No, go back", ok: true }, () => { S.editRow = null; render(true); toast("Allergen saved."); }); break;
    case "ant-arch": confirmBox({ title: "Archive this allergen?", html: `<p><b>${esc(n)}</b> will be hidden from the list.</p><p>You can restore it from the archive later.</p>`, yes: "Yes, archive", no: "No, keep it" }, () => toast(`${n} archived.`)); break;
    case "file": S.prof.sig = "signature-markova.pdf"; toast("PDF chosen: signature-markova.pdf (demo)."); render(true); break;
    case "save-prof": confirmBox({ title: "Save the doctor profile?", text: "The new details will be used on all new reports.", yes: "Yes, save", no: "No, go back", ok: true }, () => { S.prof.name = S.f.dname || ""; render(true); toast("Doctor profile saved."); }); break;
    case "fac-rm": confirmBox({ title: "Remove this clinic?", html: `<p>The doctor will stop seeing new patients from <b>${esc(n)}</b>.</p>`, yes: "Yes, remove", no: "No, keep it" }, () => { S.prof.facs = S.prof.facs.filter(x => x !== n); render(true); toast("Clinic removed."); }); break;
    case "fac-add": { const v = $("#f-facAdd").value; S.prof.facs.push(v); render(true); toast(`${v} linked.`); break; }
    case "npi-more": S.npiMore = !S.npiMore; render(true); break;
    case "npi-verify": if (!/^\d{10}$/.test(S.f.npiNum || "")) { S.err.npiNum = "NPI must be exactly 10 digits."; render(true); } else { delete S.err.npiNum; S.npiMore = true; S.f.regname = "ELENA MARKOVA"; S.f.taxonomy = "207K00000X: Allergy & Immunology"; S.f.cred = "MD"; render(true); toast("NPI found in the registry. Details filled in."); } break;
    case "npi-unlink": confirmBox({ title: "Unlink this NPI?", text: "Old reports keep their NPI. New reports will not use it.", word: "UNLINK", yes: "Yes, unlink", no: "No, keep it" }, () => { S.f.npiNum = ""; S.npiMore = false; render(true); toast("NPI unlinked."); }); break;
    case "npi-save": confirmBox({ title: "Save the NPI profile?", text: "This NPI will be printed on new reports.", yes: "Yes, save", no: "No, go back", ok: true }, () => toast("NPI profile saved.")); break;
    case "add-acc": formSheet("New account", `<div class="fld"><span class="lab"><label for="ac-n">Full name<span class="req">*</span></label>${help("accName")}</span><input id="ac-n" data-k="name"></div><div class="fld"><span class="lab"><label for="ac-u">Username<span class="req">*</span></label>${help("accUser")}</span><input id="ac-u" data-k="user"></div><div class="fld"><span class="lab"><label for="ac-r">Role<span class="req">*</span></label>${help("accRole")}</span><div class="sel"><select id="ac-r" data-k="role"><option>Technician</option><option>Doctor</option><option>Doctor Specialist</option><option>Admin</option></select>${I("chevd", 16)}</div></div>`, "Create account", v => { if (!v.name.trim() || !/^[a-z0-9]+$/i.test(v.user)) { toast("Type a name and a username (letters and digits).", true); return false; } USERS.push([v.name.trim(), v.user, v.role, true]); render(true); toast("Account created. A temporary password was generated."); }); break;
    case "acc-reset": confirmBox({ title: "Reset this password?", html: `<p><b>${esc(n)}</b> will get a new temporary password and must change it at next login.</p>`, yes: "Yes, reset", no: "No, go back" }, () => toast("Password reset. Give the new temporary password to the person.")); break;
    case "acc-off": confirmBox({ title: "Deactivate this account?", html: `<p><b>${esc(n)}</b> will not be able to log in.</p>`, word: "DEACTIVATE", yes: "Yes, deactivate", no: "No, keep active" }, () => { const u = USERS.find(x => x[0] === n); u[3] = false; render(true); toast("Account deactivated."); }); break;
    case "vitus-run": confirmBox({ title: "Run reconciliation now?", text: "The app will ask VitusSource for new reports. It can take a minute.", yes: "Yes, run", no: "No, go back", ok: true }, () => toast("Reconciliation finished: no new reports.")); break;
    case "save-set": confirmBox({ title: "Save these settings?", text: "The change applies to everyone right away.", yes: "Yes, save", no: "No, go back", ok: true }, () => toast("Settings saved.")); break;
    case "tpl-up": confirmBox({ title: "Upload a new template?", html: `<p><b>${esc(n)}</b> will be replaced. The current version is kept for roll back.</p>`, yes: "Yes, choose file", no: "No, go back" }, () => toast("File chosen (demo). Template updated.")); break;
    case "tpl-rb": confirmBox({ title: "Roll back this template?", html: `<p><b>${esc(n)}</b> will go back to the previous version.</p>`, yes: "Yes, roll back", no: "No, keep current" }, () => toast("Template rolled back.")); break;
    case "toast": toast(a.dataset.msg); break;
    case "show-me": { const l = LESSONS.find(x => x.id === a.dataset.id); if (l.demo) { confirmBox({ title: "Delete this patient?", html: "<p>This is a <b>practice</b> warning. Nothing will be deleted.</p><p>Read the red question. If you are not sure, press the gray button.</p>", yes: "Yes, delete", no: "No, go back" }, () => toast("Practice only. Nothing was deleted.")); } else { go(l.go); setTimeout(() => coach(l.target, l.tip), 80); } break; }
    case "lesson-done": doneLessons[a.dataset.id] = !doneLessons[a.dataset.id]; try { localStorage.setItem("aw2-" + V.id, JSON.stringify(doneLessons)); } catch (err) {} render(true); break;
  }
});
document.addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target.dataset.form;
  if (f === "login") {
    const er = {}; if (!(S.f.username || "").trim()) er.username = "Type your username."; if (!S.f.password) er.password = "Type your password.";
    S.err = er; if (Object.keys(er).length) { render(true); return; }
    S.f.password = ""; go("dashboard"); toast("Welcome back, Admin User.");
  } else if (f === "np") {
    if (!validateNP()) { render(true); const x = $("#app [aria-invalid=true]"); x && x.scrollIntoView({ block: "center" }); toast("Some required fields are empty. They are marked in red.", true); return; }
    confirmBox({ title: "Create this patient?", html: `<p><b>${esc(S.f.first)} ${esc(S.f.last)}</b>, DOB ${esc(S.f.dob)}</p><p>${esc(S.f.physician)} · ${esc(S.f.facility)}</p>`, yes: "Yes, create", no: "No, go back", ok: true }, () => {
      PATIENTS.unshift(P(PATIENTS.length + 1, S.f.first.trim(), S.f.last.trim(), S.f.email || "", S.f.phone || "", Math.max(0, DOCTORS.indexOf(S.f.physician)), Math.max(0, FACILITIES.findIndex(x => x.name === S.f.facility)), S.f.dob, S.f.dos, "new"));
      S.f = { dos: "11/04/2026", physician: DOCTORS[0], npi: "1234567893", preset: S.f.preset, remDays: "7" }; go("patients"); toast("Patient created.");
    });
  }
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.s) { S.srch[t.dataset.s] = t.value; $("#sugg").innerHTML = suggestHTML(); return; }
  if (t.hasAttribute("data-ant")) { S.antQ = t.value; const pos = t.selectionStart; render(true); const i = $("#f-antQ"); if (i) { i.focus(); i.setSelectionRange(pos, pos); } return; }
  if (t.dataset.k && $("#app").contains(t)) { S.f[t.dataset.k] = t.value; }
});
document.addEventListener("change", e => {
  const t = e.target;
  if (!t.dataset.k || !$("#app").contains(t)) return;
  S.f[t.dataset.k] = t.value;
  if (S.err[t.dataset.k]) { delete S.err[t.dataset.k]; }
  if (t.dataset.k === "facility") { const fc = FACILITIES.find(x => x.name === t.value); S.f.faddr = fc ? fc.addr : ""; S.f.fphone = fc ? fc.phone : ""; S.f.ffax = fc ? fc.fax : ""; render(true); }
  else if (t.dataset.k === "physician") { S.f.npi = t.value ? "12345678" + (90 + DOCTORS.indexOf(t.value)) : ""; render(true); }
  else if (t.tagName === "SELECT") render(true);
});
document.addEventListener("keydown", e => { if (e.key === "Escape") { if (S.dp) { S.dp = null; render(true); } else if (S.drawer) { S.drawer = false; render(true); } } });

/* ================= device frame ================= */
const SIZES = { tablet: [820, 1180], phone: [390, 844] };
function fit() {
  const stage = $(".stage"), dev = $(".device"), wrap = $(".dev-wrap");
  if (D === "desktop") return;
  const [W, H] = SIZES[D], full = window.innerWidth < W + 48;
  stage.classList.toggle("is-full", full);
  if (full) { dev.style.transform = ""; wrap.style.width = ""; wrap.style.height = ""; return; }
  const s = Math.min(1, (window.innerWidth - 48) / W, (window.innerHeight - 96) / H);
  dev.style.transform = `scale(${s})`; wrap.style.width = W * s + "px"; wrap.style.height = H * s + "px";
}
window.addEventListener("resize", () => { fit(); clearCoach(); });
document.addEventListener("scroll", () => { if (Date.now() - (coach.at || 0) > 800) clearCoach(); }, true);
fit();
render();
})();
