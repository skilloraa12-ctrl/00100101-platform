(function () {
"use strict";
const V = window.VARIANT;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const TODAY = "2026-11-04";

/* ---------- demo data (synthetic, not real patients) ---------- */
const DOCTORS = [
  { id: "d1", name: "Elena Markova, MD", clinic: "Queens Allergy Center", addr: "118-20 Queens Blvd, Forest Hills, NY" },
  { id: "d2", name: "Daniel Okafor, NP", clinic: "Brooklyn Family Practice", addr: "1540 Kings Hwy, Brooklyn, NY" },
  { id: "d3", name: "Priya Raman, MD", clinic: "Midtown Sleep & Allergy", addr: "305 W 45th St, New York, NY" }
];
let PATIENTS = [
  { id: 1, doc: "d1", last: "ALVAREZ", first: "Marisol", dob: "1984-03-12", status: "it", it: { mix: "Trees (Maple, Oak, Birch)", vial: 5, vol: 0.20, date: "10/28/2026" } },
  { id: 2, doc: "d1", last: "BRENNAN", first: "Owen", dob: "2012-07-30", status: "review" },
  { id: 3, doc: "d1", last: "CHEN", first: "Lily", dob: "1991-11-02", status: "it", it: { mix: "Dust mite + Cat", vial: 4, vol: 0.45, date: "10/31/2026" } },
  { id: 4, doc: "d1", last: "DUARTE", first: "Paulo", dob: "1977-01-19", status: "draft" },
  { id: 5, doc: "d1", last: "EWING", first: "Grace", dob: "1969-05-08", status: "done" },
  { id: 6, doc: "d2", last: "FISCHER", first: "Noah", dob: "2001-09-14", status: "it", it: { mix: "Grass + Ragweed", vial: 6, vol: 0.10, date: "11/01/2026" } },
  { id: 7, doc: "d2", last: "GUPTA", first: "Anika", dob: "1995-02-25", status: "review" },
  { id: 8, doc: "d3", last: "HOLLOWAY", first: "James", dob: "1958-12-03", status: "it", it: { mix: "Molds", vial: 3, vol: 0.30, date: "10/30/2026" } },
  { id: 9, doc: "d3", last: "IBARRA", first: "Sofia", dob: "2015-04-17", status: "draft" }
];
const STATUS = {
  draft: ["Test not finished", "warn"], review: ["Waiting for doctor", "info"],
  it: ["On allergy shots", "accent"], done: ["Finished", "muted"]
};
const VIALS = {
  6: { color: "WHITE", hex: "#ffffff", dil: "1:100,000" }, 5: { color: "GRAY", hex: "#a7afba", dil: "1:10,000" },
  4: { color: "GREEN", hex: "#2f9e57", dil: "1:1,000" }, 3: { color: "BLUE", hex: "#2f6fd6", dil: "1:100" },
  2: { color: "YELLOW", hex: "#f2c230", dil: "1:10" }, 1: { color: "RED", hex: "#d23a2f", dil: "1:1" }
};
const GROUPS = [
  ["Animals & insects", [["a1", "Cat hair"], ["a2", "Dog epithelia"], ["a3", "Cockroach mix"], ["a4", "Dust mite mix"]]],
  ["Molds", [["m1", "Alternaria"], ["m2", "Aspergillus mix"], ["m3", "Penicillium mix"]]],
  ["Trees", [["t1", "Maple mix"], ["t2", "Oak, Eastern"], ["t3", "Birch mix"], ["t4", "Walnut, Black"]]],
  ["Grass & weeds", [["g1", "Timothy grass"], ["g2", "Johnson grass"], ["g3", "Ragweed mix"], ["g4", "English plantain"]]]
];
const HELP = {
  last: "Patient's last name, exactly as on the ID card. Example: GARCIA.",
  first: "Patient's first name, as on the ID card. Example: Maria.",
  dob: "Date of birth from the ID card. If the patient is under 18, a parent or guardian must sign the consent.",
  dos: "The day you do the test. Today's date is filled in for you.",
  body: "Where you put the test drops. Most tests are done on both arms.",
  antihist: "Ask: \"Did you take any allergy pill (Zyrtec, Claritin, Allegra, Benadryl) in the last 7 days?\" These pills can hide reactions and make the test wrong.",
  notes: "Anything the doctor should know. Example: patient was nervous, test done on the back.",
  signer: "Who signs the form. If the patient is under 18, a parent or legal guardian must sign.",
  signerName: "Full name of the person who signs.",
  relation: "How the signer is related to the patient. Example: Mother, Father, Legal guardian.",
  signature: "Ask the person to sign inside the box with a finger or the stylus.",
  consentRead: "Tick this only after the form was read to the patient, or they read it themselves.",
  h: "Positive control. Measure the bump from histamine in millimeters (mm). It must be 3 mm or more. That proves the skin can react. If it is smaller, stop and call the doctor.",
  g: "Negative control. Measure the bump from glycerin in mm. Usually 0. This number is subtracted from every allergen.",
  mm: "Measure the bump across its widest part, in millimeters. 0 means no bump. Use the + and − buttons.",
  epi: "An Epi-Pen must be in the room before ANY allergy shot, in case of a severe reaction.",
  vial: "Pick the vial you are holding. Match the COLOR of the label. A lower vial number means stronger medicine.",
  peak: "Breathing test before the shot, in liters per minute. Skip it if the doctor did not ask for it.",
  volume: "How much liquid to inject, in milliliters (mL). Usually +0.05 mL each visit. With a new, stronger vial, start again at 0.05 mL."
};

/* ---------- icons ---------- */
const svg = p => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I = {
  home: svg('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>'),
  flask: svg('<path d="M9 3h6"/><path d="M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-6-10V3"/><path d="M7 15h10"/>'),
  syringe: svg('<path d="M18 2l4 4"/><path d="M17 7l3-3"/><path d="M19 9L9 19l-4 1 1-4L16 6z"/><path d="M12 9l3 3"/><path d="M2 22l3-3"/>'),
  book: svg('<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h5z"/>'),
  warn: svg('<path d="M12 3l10 18H2z"/><path d="M12 10v5"/><path d="M12 18h.01"/>'),
  check: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  logo: svg('<circle cx="12" cy="12" r="9"/><path d="M8 14c1.5 2 6.5 2 8 0"/><path d="M9 9h.01M15 9h.01"/>'),
  arrow: svg('<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>'),
  back: svg('<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>')
};

/* ---------- state ---------- */
const freshTest = () => ({ dos: TODAY, body: "Both arms", mm: { h: 0, g: 0 } });
const S = { screen: "pick", doctor: null, step: 1, t: freshTest(), err: {}, q: "", inj: { pid: null }, editing: null };
let done = {};
try { done = JSON.parse(localStorage.getItem("aw-training-" + V.id) || "{}") || {}; } catch (e) { done = {}; }
const saveDone = () => { try { localStorage.setItem("aw-training-" + V.id, JSON.stringify(done)); } catch (e) {} };

const doctor = () => DOCTORS.find(d => d.id === S.doctor);
const age = dob => { if (!dob) return null; const b = new Date(dob), t = new Date(TODAY); let a = t.getFullYear() - b.getFullYear(); if (t < new Date(t.getFullYear(), b.getMonth(), b.getDate())) a--; return a; };
const fmtDate = iso => { if (!iso) return ""; const [y, m, d] = iso.split("-"); return `${m}/${d}/${y}`; };
const corrected = k => Math.max((S.t.mm[k] || 0) - (S.t.mm.g || 0), 0);
const sev = mm => mm <= 2 ? ["No reaction", "none"] : mm <= 5 ? ["Mild", "mild"] : mm <= 8 ? ["Moderate", "mod"] : ["Severe", "sev"];

/* ---------- small builders ---------- */
function help(key, coach) {
  return `<span class="help-wrap"${coach ? ` data-coach="${coach}"` : ""}><button type="button" class="help" aria-label="What is this?" aria-describedby="h-${key}">?</button><span class="help-pop" role="tooltip" id="h-${key}">${esc(HELP[key])}</span></span>`;
}
function fld(name, label, o = {}) {
  const v = S.t[name] ?? "", err = S.err[name], inv = err ? ' aria-invalid="true"' : "";
  let ctl;
  if (o.opts) ctl = `<select id="f-${name}" data-f="${name}"${inv}><option value="">${esc(o.ph || "Choose…")}</option>${o.opts.map(([val, l]) => `<option value="${esc(val)}"${v === val ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  else if (o.area) ctl = `<textarea id="f-${name}" data-f="${name}" rows="2" placeholder="${esc(o.ph || "")}">${esc(v)}</textarea>`;
  else ctl = `<input id="f-${name}" data-f="${name}" type="${o.type || "text"}" value="${esc(v)}" placeholder="${esc(o.ph || "")}"${o.max ? ` max="${o.max}"` : ""} autocomplete="off"${inv}>`;
  return `<div class="fld${o.wide ? " wide" : ""}"><div class="fld-top"><label for="f-${name}">${esc(label)}${o.req === false ? ' <span class="opt">(optional)</span>' : ""}</label>${help(o.help || name, o.coach)}</div>${ctl}${err ? `<div class="fld-err" role="alert">${I.warn}<span>${esc(err)}</span></div>` : ""}</div>`;
}
function guide(text, step) {
  if (!text) return "";
  return `<div class="guide" role="note"><span class="guide-tag">${step ? esc(step) : "What to do now"}</span><span class="guide-text">${esc(text)}</span></div>`;
}
function chip(status) { const [l, t] = STATUS[status]; return `<span class="chip chip-${t}">${l}</span>`; }
function stepper(k, coach) {
  const v = S.t.mm[k] || 0;
  return `<div class="stepper"${coach ? ` data-coach="${coach}"` : ""}><button type="button" class="step-btn" data-act="mm-dec" data-k="${k}" aria-label="Less">−</button><input id="mm-${k}" class="mm-in" data-mm="${k}" inputmode="numeric" value="${v}" aria-label="Millimeters"><span class="mm-unit">mm</span><button type="button" class="step-btn" data-act="mm-inc" data-k="${k}" aria-label="More">+</button></div>`;
}

/* ---------- shell ---------- */
function shell(inner) {
  const d = doctor();
  const nav = [["home", "Home", I.home], ["test", "New test", I.flask], ["inject", "Allergy shots", I.syringe], ["training", "Training", I.book]];
  const navHTML = d ? nav.map(([k, l, ic]) => `<button type="button" class="nav-btn${S.screen === k ? " is-on" : ""}" data-go="${k}"${S.screen === k ? ' aria-current="page"' : ""}${k === "training" ? ' data-coach="nav-training"' : ""}>${ic}<span>${l}</span></button>`).join("") : "";
  const who = d ? `<div class="who"><span class="who-label">Working for</span><strong>${esc(d.name)}</strong><span class="who-sub">${esc(d.clinic)}</span><button type="button" class="link-btn" data-act="change-doctor">Change doctor</button></div>` : "";
  return `<div class="app layout-${V.layout}">
    <aside class="side">
      <div class="brand">${I.logo}<span>Allergy Workflow</span></div>
      ${who}
      <nav class="nav" aria-label="Main">${navHTML}</nav>
      <div class="user">${I.user}<span>William B.<small>Technician</small></span></div>
    </aside>
    <main class="main" id="main">${inner}</main>
  </div>`;
}

/* ---------- screens ---------- */
function scrPick() {
  return `${guide("Tap the doctor you work for today.", V.guided ? "Step 1" : "")}
  <h1 class="h1">Who are you working for today?</h1>
  <p class="lead">You will only see this doctor's patients.</p>
  <div class="doc-grid" data-coach="doctor-list">${DOCTORS.map(d => `<button type="button" class="doc-card" data-act="pick" data-id="${d.id}"><span class="doc-ini">${d.name.split(" ").slice(0, 2).map(w => w[0]).join("")}</span><strong>${esc(d.name)}</strong><span>${esc(d.clinic)}</span><span class="muted">${esc(d.addr)}</span><span class="doc-go">${V.guided ? "Tap here" : "Select"} ${I.arrow}</span></button>`).join("")}</div>`;
}

function listHTML() {
  const d = doctor(), q = S.q.trim().toLowerCase();
  const list = PATIENTS.filter(p => p.doc === d.id && (!q || `${p.last} ${p.first}`.toLowerCase().includes(q)));
  if (!list.length) return `<div class="empty">No patients found. Check the spelling or start a new test.</div>`;
  return list.map(p => {
    let act = "";
    if (p.status === "draft") act = `<button type="button" class="btn btn-primary" data-act="continue" data-id="${p.id}">Continue test</button><button type="button" class="btn btn-danger-ghost" data-act="del-draft" data-id="${p.id}">Delete</button>`;
    else if (p.status === "it") act = `<button type="button" class="btn btn-primary" data-act="inject" data-id="${p.id}">${I.syringe}<span>Give shot</span></button>`;
    else if (p.status === "review") act = `<span class="wait">Doctor is checking</span>`;
    else act = `<button type="button" class="btn btn-ghost" data-act="view" data-id="${p.id}">View</button>`;
    return `<div class="prow"><div class="pname"><strong>${esc(p.last)}, ${esc(p.first)}</strong><span class="muted">DOB ${fmtDate(p.dob)} · ${age(p.dob)} y</span></div><div class="pstat">${chip(p.status)}</div><div class="pact">${act}</div></div>`;
  }).join("");
}
function scrHome() {
  const d = doctor();
  const drafts = PATIENTS.filter(p => p.doc === d.id && p.status === "draft").length;
  const shots = PATIENTS.filter(p => p.doc === d.id && p.status === "it").length;
  return `${guide("Start a new allergy test, or give a shot to a patient who is on allergy shots.")}
  <h1 class="h1">Patients of ${esc(d.name)}</h1>
  <div class="actions">
    <button type="button" class="big-act big-primary${V.guided ? " next-glow" : ""}" data-act="new-test" data-coach="new-test">${I.plus}<span><strong>New allergy test</strong><small>Skin prick test for a new patient</small></span></button>
    <button type="button" class="big-act" data-go="inject">${I.syringe}<span><strong>Give an allergy shot</strong><small>${shots} patient${shots === 1 ? "" : "s"} on shots</small></span></button>
  </div>
  ${drafts ? `<div class="notice">${I.warn}<span>${drafts} test${drafts === 1 ? " is" : "s are"} not finished. Finish ${drafts === 1 ? "it" : "them"} before the patient leaves.</span></div>` : ""}
  <div class="list-head"><h2 class="h2">All patients</h2><label class="search"><span class="sr">Search patient</span><input id="search" type="search" placeholder="Search by name" value="${esc(S.q)}" autocomplete="off"></label></div>
  <div class="plist" id="plist">${listHTML()}</div>`;
}

const STEPS = ["Patient", "Consent", "Test results", "Check & save"];
function scrTest() {
  const tips = [
    "Type the patient's name and date of birth from the ID card. Press the ? if you are not sure.",
    "Give the tablet to the patient (or parent) to read and sign.",
    "Measure the controls first: histamine, then glycerin. Then measure each bump.",
    "Check everything. If it is correct, press Save test."
  ];
  const bar = `<ol class="steps" aria-label="Progress">${STEPS.map((s, i) => `<li class="${i + 1 < S.step ? "is-done" : i + 1 === S.step ? "is-now" : ""}"${i + 1 === S.step ? ' aria-current="step"' : ""}><span class="step-n">${i + 1 < S.step ? "✓" : i + 1}</span><span class="step-l">${s}</span></li>`).join("")}</ol>`;
  const body = [stepPatient, stepConsent, stepResults, stepReview][S.step - 1]();
  const next = S.step < 4
    ? `<button type="button" class="btn btn-primary btn-lg${V.guided ? " next-glow" : ""}" data-act="next">Next: ${STEPS[S.step]} ${I.arrow}</button>`
    : `<button type="button" class="btn btn-primary btn-lg${V.guided ? " next-glow" : ""}" data-act="save-test">${I.check}<span>Save test</span></button>`;
  return `${guide(tips[S.step - 1], V.guided ? `Step ${S.step} of 4` : "")}
  <div class="test-head"><h1 class="h1">New allergy test</h1><button type="button" class="btn btn-danger-ghost" data-act="cancel-test">Cancel test</button></div>
  ${bar}
  <section class="card">${body}</section>
  <div class="foot">${S.step > 1 ? `<button type="button" class="btn btn-ghost btn-lg" data-act="back">${I.back}<span>Back</span></button>` : "<span></span>"}${next}</div>`;
}
function stepPatient() {
  return `<h2 class="h2">Who is the patient?</h2>
  <div class="grid">
    ${fld("last", "Last name", { ph: "GARCIA", coach: "help-first" })}
    ${fld("first", "First name", { ph: "Maria" })}
    ${fld("dob", "Date of birth", { type: "date", max: TODAY })}
    ${fld("dos", "Date of test", { type: "date" })}
    ${fld("body", "Where is the test done?", { opts: [["Both arms", "Both arms"], ["Left arm", "Left arm"], ["Right arm", "Right arm"], ["Back", "Back"]] })}
    ${fld("antihist", "Allergy pills in the last 7 days?", { opts: [["no", "No, no allergy pills"], ["yes", "Yes, took allergy pills"]], ph: "Ask the patient…" })}
    ${fld("notes", "Notes for the doctor", { area: true, req: false, wide: true, ph: "Anything unusual" })}
  </div>`;
}
function stepConsent() {
  const a = age(S.t.dob), minor = a !== null && a < 18;
  if (minor) S.t.signer = "guardian";
  const g = S.t.signer === "guardian";
  return `<h2 class="h2">Allergy testing consent</h2>
  ${minor ? `<div class="notice notice-strong">${I.warn}<span>The patient is ${a} years old. A <b>parent or legal guardian</b> must sign.</span></div>` : ""}
  <div class="consent-text">
    <p>I allow the clinic staff to do a skin prick test on <b>${esc(S.t.first || "the patient")} ${esc(S.t.last || "")}</b> to find allergies.</p>
    <p>I understand the test can cause itching, redness, and in rare cases a strong allergic reaction. Staff will watch the patient during the test. A photo of the test results may be taken.</p>
  </div>
  <div class="grid">
    ${minor ? `<div class="fld"><div class="fld-top"><label>Who signs?</label>${help("signer")}</div><div class="fixed">Parent / guardian</div></div>` : fld("signer", "Who signs?", { opts: [["patient", "The patient"], ["guardian", "Parent / guardian"]] })}
    ${fld("signerName", "Signer's full name", { ph: g ? "Ana Garcia" : "Maria Garcia" })}
    ${g ? fld("relation", "Relationship to patient", { opts: [["Mother", "Mother"], ["Father", "Father"], ["Legal guardian", "Legal guardian"]] }) : ""}
  </div>
  <div class="fld wide"><div class="fld-top"><label for="sig">Signature</label>${help("signature")}</div>
    <div class="sig-box${S.err.sig ? " is-err" : ""}"><canvas id="sig" aria-label="Signature box"></canvas><span class="sig-hint"${S.t.sig ? " hidden" : ""}>Sign here</span><button type="button" class="link-btn sig-clear" data-act="sig-clear">Clear</button></div>
    ${S.err.sig ? `<div class="fld-err" role="alert">${I.warn}<span>${esc(S.err.sig)}</span></div>` : ""}</div>
  <label class="check${S.err.consentRead ? " is-err" : ""}"><input type="checkbox" data-f="consentRead"${S.t.consentRead ? " checked" : ""}><span>The form was read and explained to the signer.</span>${help("consentRead")}</label>`;
}
function stepResults() {
  const h = S.t.mm.h || 0, locked = h < 3;
  const groups = GROUPS.map(([g, items]) => `<div class="agroup"><h3 class="h3">${g}</h3>${items.map(([k, n]) => { const c = corrected(k), [sl, st] = sev(c); return `<div class="arow"><span class="aname">${n}</span>${stepper(k)}<span class="sev sev-${st}">${sl}${c && st !== "none" ? ` · ${c} mm` : ""}</span></div>`; }).join("")}</div>`).join("");
  return `<h2 class="h2">1. Controls first</h2>
  <div class="controls">
    <div class="arow arow-ctl"><span class="aname">Histamine (positive) ${help("h")}</span>${stepper("h", "histamine")}<span class="sev ${h >= 3 ? "sev-ok" : "sev-sev"}">${h >= 3 ? "OK: skin reacts" : "Must be 3 mm or more"}</span></div>
    <div class="arow arow-ctl"><span class="aname">Glycerin (negative) ${help("g")}</span>${stepper("g")}<span class="sev sev-none">Subtracted from all</span></div>
  </div>
  <h2 class="h2">2. Allergens ${help("mm")}</h2>
  ${locked ? `<div class="notice notice-strong">${I.warn}<span>Allergens are locked. Enter histamine first: it must be <b>3 mm or more</b>. If it is smaller, stop and call the doctor.</span></div>` : ""}
  <div class="agroups${locked ? " is-locked" : ""}"${locked ? ' inert aria-disabled="true"' : ""}>${groups}</div>`;
}
function stepReview() {
  const d = doctor(), a = age(S.t.dob);
  const pos = GROUPS.flatMap(g => g[1]).map(([k, n]) => [n, corrected(k)]).filter(([, c]) => c >= 3);
  return `<h2 class="h2">Check before saving</h2>
  <dl class="review">
    <div><dt>Patient</dt><dd>${esc(S.t.last)}, ${esc(S.t.first)} · DOB ${fmtDate(S.t.dob)} (${a} y)</dd></div>
    <div><dt>Doctor</dt><dd>${esc(d.name)}</dd></div>
    <div><dt>Date · place</dt><dd>${fmtDate(S.t.dos)} · ${esc(S.t.body)}</dd></div>
    <div><dt>Consent signed by</dt><dd>${esc(S.t.signerName)}${S.t.signer === "guardian" ? ` (${esc(S.t.relation)})` : " (patient)"}</dd></div>
    <div><dt>Controls</dt><dd>Histamine ${S.t.mm.h} mm · Glycerin ${S.t.mm.g} mm</dd></div>
  </dl>
  <h3 class="h3">Positive reactions (${pos.length})</h3>
  ${pos.length ? `<ul class="pos">${pos.map(([n, c]) => { const [l, t] = sev(c); return `<li><span>${n}</span><span class="sev sev-${t}">${l} · ${c} mm</span></li>`; }).join("")}</ul>` : `<p class="muted">No positive reactions.</p>`}`;
}

function scrInject() {
  const d = doctor();
  if (!S.inj.pid) {
    const list = PATIENTS.filter(p => p.doc === d.id && p.status === "it");
    return `${guide("Find the patient and press Give shot.")}
    <h1 class="h1">Allergy shots</h1>
    <div class="plist">${list.length ? list.map((p, i) => { const v = VIALS[p.it.vial]; return `<div class="prow"><div class="pname"><strong>${esc(p.last)}, ${esc(p.first)}</strong><span class="muted">${esc(p.it.mix)} · last shot ${p.it.date}</span></div><div class="pstat"><span class="vial-dot" style="--vc:${v.hex}"></span><span>Vial #${p.it.vial} ${v.color}</span></div><div class="pact"><button type="button" class="btn btn-primary${V.guided ? " next-glow" : ""}" data-act="inject" data-id="${p.id}"${i === 0 ? ' data-coach="give-shot"' : ""}>${I.syringe}<span>Give shot</span></button></div></div>`; }).join("") : `<div class="empty">No patients of this doctor are on allergy shots.</div>`}</div>`;
  }
  const p = PATIENTS.find(x => x.id === S.inj.pid), last = p.it, j = S.inj;
  if (j.vial == null) j.vial = last.vial;
  const cv = VIALS[j.vial];
  const strip = [6, 5, 4, 3, 2, 1].map(n => `<div class="vial${n === last.vial ? " is-cur" : ""}${n === j.vial ? " is-pick" : ""}" style="--vc:${VIALS[n].hex}"><span class="vial-cap"></span><b>#${n}</b><small>${VIALS[n].color}</small><small>${VIALS[n].dil}</small>${n === last.vial ? '<em>Last time</em>' : ""}</div>`).join("");
  const choices = [last.vial, last.vial - 1].filter(n => n >= 1);
  const vols = []; for (let v = 0.05; v <= 0.501; v += 0.05) vols.push(v.toFixed(2));
  const epiErr = S.err.epi, volErr = S.err.vol;
  return `${guide("Answer each question from top to bottom. Then press Save shot.", V.guided ? "Allergy shot" : "")}
  <div class="test-head"><h1 class="h1">${esc(p.last)}, ${esc(p.first)}</h1><button type="button" class="btn btn-ghost" data-act="inj-back">${I.back}<span>Back to list</span></button></div>
  <section class="card">
    <div class="last-shot"><span class="muted">Last shot</span><strong>${last.date} · Vial #${last.vial} ${VIALS[last.vial].color} · ${last.vol.toFixed(2)} mL</strong><span class="muted">${esc(last.mix)}</span></div>
    <div class="vials" aria-label="Vials from weakest to strongest"><span class="vials-l">weakest</span>${strip}<span class="vials-l">strongest</span></div>
  </section>
  <section class="card qcard">
    <div class="q"><div class="q-h"><span class="q-n">1</span><h2 class="h2">Is the Epi-Pen in the room?</h2>${help("epi")}</div>
      <div class="seg"><button type="button" class="seg-btn${j.epi === "yes" ? " is-on" : ""}" data-act="epi" data-v="yes" aria-pressed="${j.epi === "yes"}">Yes</button><button type="button" class="seg-btn seg-no${j.epi === "no" ? " is-on" : ""}" data-act="epi" data-v="no" aria-pressed="${j.epi === "no"}">No</button></div>
      ${j.epi === "no" ? `<div class="notice notice-strong">${I.warn}<span><b>Stop.</b> Do not give the shot without an Epi-Pen in the room.</span></div>` : ""}
      ${epiErr ? `<div class="fld-err" role="alert">${I.warn}<span>${esc(epiErr)}</span></div>` : ""}</div>
    <div class="q${j.epi !== "yes" ? " is-dim" : ""}"><div class="q-h"><span class="q-n">2</span><h2 class="h2">Which vial are you holding?</h2>${help("vial")}</div>
      <div class="vpick">${choices.map(n => `<button type="button" class="vp${j.vial === n ? " is-on" : ""}" data-act="vial" data-v="${n}" aria-pressed="${j.vial === n}" style="--vc:${VIALS[n].hex}"><span class="vial-dot"></span><span><b>Vial #${n} · ${VIALS[n].color}</b><small>${n === last.vial ? "Same as last time" : "NEW, stronger vial"} · ${VIALS[n].dil}</small></span></button>`).join("")}</div></div>
    <div class="q${j.epi !== "yes" ? " is-dim" : ""}"><div class="q-h"><span class="q-n">3</span><h2 class="h2">Peak flow</h2>${help("peak")}<span class="opt">(optional)</span></div>
      <select id="f-peak" data-inj="peak"><option value="">Skip</option>${[250, 300, 350, 400, 450, 500, 550, 600].map(v => `<option${j.peak == v ? " selected" : ""}>${v}</option>`).join("")}</select></div>
    <div class="q${j.epi !== "yes" ? " is-dim" : ""}"><div class="q-h"><span class="q-n">4</span><h2 class="h2">How much? (mL)</h2>${help("volume")}</div>
      <div class="vols">${vols.map(v => `<button type="button" class="vol${j.vol === v ? " is-on" : ""}" data-act="vol" data-v="${v}" aria-pressed="${j.vol === v}">${v}</button>`).join("")}</div>
      ${volErr ? `<div class="fld-err" role="alert">${I.warn}<span>${esc(volErr)}</span></div>` : ""}</div>
  </section>
  <div class="foot"><span class="today-pick">Today: <span class="vial-dot" style="--vc:${cv.hex}"></span> Vial #${j.vial} ${cv.color}${j.vol ? ` · ${j.vol} mL` : ""}</span><button type="button" class="btn btn-primary btn-lg${V.guided ? " next-glow" : ""}" data-act="save-shot">${I.check}<span>Save shot</span></button></div>`;
}

const LESSONS = [
  { id: "l1", title: "Choose your doctor", min: 1, steps: ["After you log in, tap the doctor you work for today.", "You will only see that doctor's patients.", "Wrong doctor? Press Change doctor on the left."], show() { S.screen = "pick"; S.doctor = null; }, target: "[data-coach=doctor-list]", tip: "Tap your doctor here. You can change it later." },
  { id: "l2", title: "Start a new allergy test", min: 2, steps: ["On Home, press the big New allergy test button.", "Go through 4 steps: Patient, Consent, Test results, Check & save.", "The blue button at the bottom always takes you to the next step."], show() { S.doctor = S.doctor || "d1"; S.screen = "home"; }, target: "[data-coach=new-test]", tip: "Press this to start a test." },
  { id: "l3", title: "Use the ? buttons", min: 1, steps: ["Every field has a round ? button.", "Point at it or tap it to see what to type and an example.", "Not sure? Always read the ? before you type."], show() { S.doctor = S.doctor || "d1"; S.screen = "test"; S.step = 1; }, target: "[data-coach=help-first]", tip: "Point here to read the help for this field." },
  { id: "l4", title: "Enter test results", min: 2, steps: ["Measure histamine first. It must be 3 mm or more.", "Then glycerin. It is usually 0.", "Then each allergen. Use + and −. Numbers above 15 mm will ask you to double-check."], show() { S.doctor = S.doctor || "d1"; S.screen = "test"; S.step = 3; }, target: "[data-coach=histamine]", tip: "Start here: the histamine bump in mm." },
  { id: "l5", title: "Give an allergy shot safely", min: 2, steps: ["Open Allergy shots and press Give shot.", "Answer the 4 questions from top to bottom.", "Match the vial COLOR with the screen. A new, stronger vial shows a red warning."], show() { S.doctor = S.doctor || "d1"; S.screen = "inject"; S.inj = { pid: null }; }, target: "[data-coach=give-shot]", tip: "Press Give shot for the patient in front of you." },
  { id: "l6", title: "What the red warning means", min: 1, steps: ["A red question on a white screen means: stop and think.", "Read it out loud. Check the patient, the vial, the numbers.", "Press the red button only if you are sure. If not, press the grey button to go back."], demo: true }
];
function scrTraining() {
  const n = LESSONS.filter(l => done[l.id]).length, pct = Math.round(n / LESSONS.length * 100);
  return `${guide("Do every lesson once. Press Show me to see where to click.")}
  <h1 class="h1">Training</h1>
  <div class="progress"><div class="progress-top"><strong>${n} of ${LESSONS.length} lessons done</strong><span class="muted">${pct}%</span></div><div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div></div>
  <div class="lessons">${LESSONS.map((l, i) => `<article class="lesson${done[l.id] ? " is-done" : ""}"><div class="lesson-h"><span class="lesson-n">${done[l.id] ? "✓" : i + 1}</span><div><h2 class="h2">${l.title}</h2><span class="muted">${l.min} min</span></div></div><ol class="lesson-steps">${l.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol><div class="lesson-a"><button type="button" class="btn btn-primary" data-act="show-me" data-id="${l.id}">Show me</button><button type="button" class="btn btn-ghost" data-act="lesson-done" data-id="${l.id}">${done[l.id] ? "Done ✓" : "Mark as done"}</button></div></article>`).join("")}</div>`;
}

/* ---------- render ---------- */
function render() {
  clearCoach();
  const map = { pick: scrPick, home: scrHome, test: scrTest, inject: scrInject, training: scrTraining };
  if (S.screen !== "pick" && !S.doctor) S.screen = "pick";
  $("#app").innerHTML = shell(map[S.screen]());
  if (S.screen === "test" && S.step === 2) setupSig();
}
function go(screen) { S.screen = screen; S.err = {}; if (screen === "inject") S.inj = { pid: null }; render(); window.scrollTo(0, 0); }

/* ---------- modal ---------- */
function modal(o, onYes) {
  const root = $("#modal-root");
  const prev = document.activeElement;
  root.innerHTML = `<div class="modal-back"><div class="modal${o.tone === "save" ? " is-save" : ""}" role="alertdialog" aria-modal="true" aria-labelledby="m-t" aria-describedby="m-d">
    <div class="modal-icon">${o.tone === "save" ? I.check : I.warn}</div>
    <h2 id="m-t" class="modal-title">${esc(o.title)}</h2>
    <div id="m-d" class="modal-text">${o.html || `<p>${esc(o.text)}</p>`}</div>
    ${o.check ? `<label class="modal-check"><input type="checkbox" id="m-check"><span>${esc(o.check)}</span></label>` : ""}
    ${o.typeWord ? `<label class="modal-type" for="m-type">Type <b>${o.typeWord}</b> to confirm</label><input id="m-type" class="modal-input" autocomplete="off" autocapitalize="characters">` : ""}
    <div class="modal-actions"><button type="button" class="btn m-no" id="m-no">${esc(o.no || "No, go back")}</button>${o.yes ? `<button type="button" class="btn m-yes${o.tone === "save" ? " is-save" : ""}" id="m-yes">${esc(o.yes)}</button>` : ""}</div>
  </div></div>`;
  const yes = $("#m-yes"), chk = $("#m-check"), typ = $("#m-type");
  const upd = () => { if (yes) yes.disabled = (chk && !chk.checked) || (typ && typ.value.trim().toUpperCase() !== o.typeWord); };
  upd(); chk && chk.addEventListener("change", upd); typ && typ.addEventListener("input", upd);
  const close = () => { root.innerHTML = ""; document.removeEventListener("keydown", key); prev && prev.focus && prev.focus(); };
  const key = e => { if (e.key === "Escape") { close(); o.onNo && o.onNo(); } };
  document.addEventListener("keydown", key);
  $("#m-no").addEventListener("click", () => { close(); o.onNo && o.onNo(); });
  yes && yes.addEventListener("click", () => { if (yes.disabled) return; close(); onYes && onYes(); });
  $("#m-no").focus();
}
function chain(list, done_) { const step = i => i >= list.length ? done_() : modal(list[i], () => step(i + 1)); step(0); }
function toast(text) {
  const r = $("#toast-root");
  r.innerHTML = `<div class="toast" role="status">${I.check}<span>${esc(text)}</span><button type="button" class="toast-x" aria-label="Close">×</button></div>`;
  r.querySelector(".toast-x").onclick = () => r.innerHTML = "";
  clearTimeout(toast.t); toast.t = setTimeout(() => r.innerHTML = "", 6000);
}

/* ---------- coach marks ---------- */
function clearCoach() { document.querySelectorAll(".coach-on").forEach(e => e.classList.remove("coach-on")); const b = $("#coach-bubble"); b && b.remove(); }
function coach(sel, text) {
  const el = $(sel); if (!el) return;
  el.classList.add("coach-on");
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  const b = document.createElement("div");
  b.id = "coach-bubble"; b.className = "coach-bubble"; b.setAttribute("role", "dialog"); b.setAttribute("aria-label", "Training hint");
  b.innerHTML = `<span class="coach-tag">Training</span><p>${esc(text)}</p><button type="button" class="btn btn-primary">Got it</button>`;
  document.body.appendChild(b);
  const place = () => { const r = el.getBoundingClientRect(); const w = Math.min(300, window.innerWidth - 32); b.style.width = w + "px"; let left = r.left + window.scrollX; left = Math.max(16, Math.min(left, window.scrollX + window.innerWidth - w - 16)); const below = r.bottom + 14 + window.scrollY; b.style.left = left + "px"; b.style.top = below + "px"; };
  place(); setTimeout(place, 400);
  b.querySelector("button").onclick = clearCoach;
  b.querySelector("button").focus({ preventScroll: true });
}

/* ---------- signature ---------- */
function setupSig() {
  const c = $("#sig"); if (!c) return;
  const box = c.parentElement, dpr = window.devicePixelRatio || 1;
  c.width = box.clientWidth * dpr; c.height = box.clientHeight * dpr;
  const x = c.getContext("2d"); x.scale(dpr, dpr); x.lineWidth = 2.4; x.lineCap = "round"; x.strokeStyle = getComputedStyle(c).color;
  if (S.t.sig) { const img = new Image(); img.onload = () => x.drawImage(img, 0, 0, box.clientWidth, box.clientHeight); img.src = S.t.sig; }
  let draw = false;
  const pt = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  c.addEventListener("pointerdown", e => { draw = true; c.setPointerCapture(e.pointerId); const [a, b] = pt(e); x.beginPath(); x.moveTo(a, b); const h = box.querySelector(".sig-hint"); if (h) h.hidden = true; });
  c.addEventListener("pointermove", e => { if (!draw) return; const [a, b] = pt(e); x.lineTo(a, b); x.stroke(); });
  const end = () => { if (!draw) return; draw = false; S.t.sig = c.toDataURL(); if (S.err.sig) { delete S.err.sig; box.classList.remove("is-err"); } };
  c.addEventListener("pointerup", end); c.addEventListener("pointercancel", end);
}

/* ---------- actions ---------- */
function validate() {
  const t = S.t, e = {};
  if (S.step === 1) {
    if (!t.last || !t.last.trim()) e.last = "Type the last name.";
    else if (!/^[A-Za-z' -]+$/.test(t.last.trim())) e.last = "Use letters only. Example: GARCIA.";
    if (!t.first || !t.first.trim()) e.first = "Type the first name.";
    else if (!/^[A-Za-z' -]+$/.test(t.first.trim())) e.first = "Use letters only. Example: Maria.";
    if (!t.dob) e.dob = "Choose the date of birth.";
    else if (t.dob > TODAY) e.dob = "The date of birth cannot be in the future.";
    if (!t.antihist) e.antihist = "Ask the patient and choose an answer.";
  } else if (S.step === 2) {
    if (!t.signer) e.signer = "Choose who signs.";
    if (!t.signerName || !t.signerName.trim()) e.signerName = "Type the signer's full name.";
    if (t.signer === "guardian" && !t.relation) e.relation = "Choose the relationship.";
    if (!t.sig) e.sig = "The signer must sign in the box.";
    if (!t.consentRead) e.consentRead = "Tick the box after the form was explained.";
  } else if (S.step === 3) {
    if ((t.mm.h || 0) < 3) e.h = "Histamine must be 3 mm or more.";
  }
  S.err = e; return !Object.keys(e).length;
}
function next() {
  if (!validate()) { render(); const f = $("[aria-invalid=true], .fld-err, .is-err"); f && f.scrollIntoView({ block: "center" }); if (S.step === 3) toast("Enter the histamine control first. It must be 3 mm or more."); return; }
  const adv = () => { S.step++; S.err = {}; render(); window.scrollTo(0, 0); };
  if (S.step === 1 && S.t.antihist === "yes") {
    modal({ title: "Allergy pills taken. Continue?", text: "The patient took an allergy pill in the last 7 days. The test may show no reactions even if the patient is allergic. Ask the doctor before you continue.", yes: "The doctor said continue", no: "Stop, ask the doctor" }, adv);
  } else adv();
}
function setMM(k, val) {
  const old = S.t.mm[k] || 0;
  val = Math.round(Number(val));
  if (!Number.isFinite(val) || val < 0) val = 0;
  if (val > 30) { toast("The biggest number allowed is 30 mm."); val = 30; }
  const apply = () => { S.t.mm[k] = val; if (k === "h" && val >= 3) delete S.err.h; render(); const i = $("#mm-" + k); i && i.focus({ preventScroll: true }); };
  if (val > 15 && old <= 15) {
    modal({ title: `Is ${val} mm correct?`, text: `${val} mm is a very big bump. Most reactions are under 15 mm. Measure again. Did you type ${String(val)[0]} by mistake?`, yes: `Yes, it is ${val} mm`, no: "No, fix it", onNo: () => render() }, apply);
  } else apply();
}
function saveTest() {
  const d = doctor();
  modal({ title: "Save this test?", html: `<p>After saving, <b>${esc(d.name)}</b> will check it.</p><p>You <b>cannot change</b> the numbers after this.</p>`, yes: "Yes, save test", no: "No, go back", tone: "save" }, () => {
    if (S.editing) PATIENTS = PATIENTS.filter(p => p.id !== S.editing);
    PATIENTS.unshift({ id: Date.now(), doc: d.id, last: S.t.last.trim().toUpperCase(), first: S.t.first.trim(), dob: S.t.dob, status: "review" });
    S.t = freshTest(); S.step = 1; S.editing = null; go("home");
    toast(`Test saved. It was sent to ${d.name} to check.`);
  });
}
function saveShot() {
  const j = S.inj, p = PATIENTS.find(x => x.id === j.pid), last = p.it, e = {};
  if (j.epi !== "yes") e.epi = j.epi === "no" ? "Get the Epi-Pen first." : "Answer this question.";
  if (!j.vol) e.vol = "Choose how much to inject.";
  S.err = e;
  if (Object.keys(e).length) { render(); return; }
  const v = VIALS[j.vial], lv = VIALS[last.vial], vol = Number(j.vol), list = [];
  if (j.vial < last.vial) list.push({ title: "STRONGER vial. Are you sure?", html: `<p>You picked <b>Vial #${j.vial} · ${v.color}</b> (${v.dil}).</p><p>Last time: Vial #${last.vial} · ${lv.color} (${lv.dil}).</p><p>This medicine is <b>10 times stronger</b>.</p>`, check: `I checked: the vial label is ${v.color}`, yes: "Yes, it is correct", no: "No, go back" });
  if (j.vial < last.vial && vol > 0.05) list.push({ title: "Dose too big for a new vial?", text: `With a new, stronger vial the dose usually starts again at 0.05 mL. You picked ${j.vol} mL.`, check: "The doctor told me to use this dose", yes: "Continue", no: "No, change the dose" });
  if (j.vial === last.vial && vol - last.vol > 0.051) list.push({ title: "Big dose jump. Are you sure?", text: `Last time: ${last.vol.toFixed(2)} mL. Today: ${j.vol} mL. The normal step is +0.05 mL.`, check: "The doctor approved this dose", yes: "Continue", no: "No, change the dose" });
  if (j.vial === last.vial && vol < last.vol) list.push({ title: "Smaller dose than last time?", text: `Last time: ${last.vol.toFixed(2)} mL. Today: ${j.vol} mL. This is fine if the doctor asked to go down.`, yes: "Continue", no: "No, change the dose" });
  list.push({ title: "Save this shot?", html: `<p><b>${esc(p.last)}, ${esc(p.first)}</b></p><p>Vial #${j.vial} · ${v.color} · ${j.vol} mL</p>`, yes: "Yes, save shot", no: "No, go back", tone: "save" });
  chain(list, () => {
    p.it = { ...last, vial: j.vial, vol, date: "11/04/2026" };
    S.inj = { pid: null }; S.err = {}; render(); window.scrollTo(0, 0);
    toast("Shot saved. Keep the patient in the office for 30 minutes and check the arm.");
  });
}

document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g) { if (g.dataset.go === "test") { S.step = S.step || 1; } go(g.dataset.go); return; }
  const a = e.target.closest("[data-act]"); if (!a) return;
  const act = a.dataset.act, id = Number(a.dataset.id);
  switch (act) {
    case "pick": S.doctor = a.dataset.id; go("home"); toast(`You now see the patients of ${doctor().name}.`); break;
    case "change-doctor": modal({ title: "Change doctor?", text: "You will see a different doctor's patients. Unsaved work on this screen will be lost.", yes: "Yes, change doctor", no: "No, stay" }, () => { S.doctor = null; S.t = freshTest(); S.step = 1; go("pick"); }); break;
    case "new-test": S.t = freshTest(); S.step = 1; S.editing = null; go("test"); break;
    case "continue": { const p = PATIENTS.find(x => x.id === id); S.t = { ...freshTest(), last: p.last, first: p.first, dob: p.dob }; S.step = 1; S.editing = id; go("test"); break; }
    case "del-draft": { const p = PATIENTS.find(x => x.id === id); modal({ title: "Delete this test?", html: `<p>The unfinished test for <b>${esc(p.last)}, ${esc(p.first)}</b> will be deleted.</p><p>This <b>cannot be undone</b>.</p>`, typeWord: "DELETE", yes: "Yes, delete", no: "No, keep it" }, () => { PATIENTS = PATIENTS.filter(x => x.id !== id); render(); toast("The test was deleted."); }); break; }
    case "view": toast("Opening the patient record (demo)."); break;
    case "inject": S.screen = "inject"; S.inj = { pid: id }; S.err = {}; render(); window.scrollTo(0, 0); break;
    case "inj-back": modal({ title: "Leave without saving?", text: "The shot is not saved yet. If you leave, your answers will be lost.", yes: "Yes, leave", no: "No, stay" }, () => go("inject")); break;
    case "next": next(); break;
    case "back": S.step--; S.err = {}; render(); window.scrollTo(0, 0); break;
    case "cancel-test": modal({ title: "Cancel this test?", text: "Everything you typed for this test will be deleted.", yes: "Yes, cancel test", no: "No, keep working" }, () => { S.t = freshTest(); S.step = 1; S.editing = null; go("home"); toast("The test was cancelled."); }); break;
    case "save-test": saveTest(); break;
    case "mm-inc": setMM(a.dataset.k, (S.t.mm[a.dataset.k] || 0) + 1); break;
    case "mm-dec": setMM(a.dataset.k, (S.t.mm[a.dataset.k] || 0) - 1); break;
    case "sig-clear": S.t.sig = null; render(); break;
    case "epi": S.inj.epi = a.dataset.v; delete S.err.epi; render(); break;
    case "vial": S.inj.vial = Number(a.dataset.v); render(); break;
    case "vol": S.inj.vol = a.dataset.v; delete S.err.vol; render(); break;
    case "save-shot": saveShot(); break;
    case "show-me": { const l = LESSONS.find(x => x.id === a.dataset.id); if (l.demo) { modal({ title: "Delete this patient?", html: "<p>This is a <b>practice</b> warning. Nothing will be deleted.</p><p>Read the red question. If you are not sure, press the grey button.</p>", yes: "Yes, delete", no: "No, go back" }, () => toast("Practice only. Nothing was deleted.")); } else { l.show(); S.err = {}; render(); window.scrollTo(0, 0); setTimeout(() => coach(l.target, l.tip), 60); } break; }
    case "lesson-done": done[a.dataset.id] = !done[a.dataset.id]; saveDone(); render(); break;
  }
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "search") { S.q = t.value; $("#plist").innerHTML = listHTML(); return; }
  if (t.dataset.f && t.tagName !== "SELECT" && t.type !== "checkbox") { S.t[t.dataset.f] = t.value; }
});
document.addEventListener("change", e => {
  const t = e.target;
  if (t.dataset.mm) { setMM(t.dataset.mm, t.value); return; }
  if (t.dataset.inj) { S.inj[t.dataset.inj] = t.value; return; }
  if (t.dataset.f) {
    S.t[t.dataset.f] = t.type === "checkbox" ? t.checked : t.value;
    if (S.err[t.dataset.f]) delete S.err[t.dataset.f];
    if (t.tagName === "SELECT" || t.type === "checkbox" || t.type === "date") render();
  }
});
window.addEventListener("resize", () => { if (S.screen === "test" && S.step === 2) setupSig(); });

render();
})();
