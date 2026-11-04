"""Build 9 single-file mockups (3 variants x desktop/tablet/phone) and 3 bilingual presentations.

python3 build.py  ->  ../v1-clear-desktop.html ... ../v3-easy-phone.html  and  ../presentation-v1-clear.html ...
Each mockup is one self-contained file: HTML + CSS + JS inline. Fonts load from Google Fonts.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
JS = (HERE / "app.js").read_text(encoding="utf-8")
CSS = (HERE / "app.css").read_text(encoding="utf-8")
LINKS = json.loads((HERE / "links.json").read_text(encoding="utf-8")) if (HERE / "links.json").exists() else {}

V1 = """
--font:"Public Sans",system-ui,-apple-system,"Segoe UI",sans-serif; --font-d:"Public Sans",system-ui,sans-serif; --fs:15.5px; --h1:1.85rem; --h2:1.12rem; --h-track:-.015em;
--nav-on-bg:#1e62d0; --nav-on-fg:#ffffff; --help-bg:#ffffff; --help-fg:#1e62d0; --help-line:#1e62d0; --help-s:22px;
--login-art:#1e62d0; --login-art-fg:#ffffff;
--in-bd:1px solid #b9c8d6; --in-bg:#ffffff; --in-h:44px; --btn-h:42px; --nav-h:42px; --side-w:260px; --main-max:1240px;
--r-card:8px; --r-btn:6px; --r-nav:6px; --r-chip:4px; --r-item:6px; --r-sec:6px; --r-logo:8px; --r-modal:12px; --card-bd:1px solid #d7e2ec; --card-pad:20px; --shadow:0 1px 2px rgba(16,33,47,.05);

--stage:#e3e9f0; --stage-fg:#536679; --bg:#f4f7fb; --surface:#ffffff; --surface-2:#eef3f8; --fg:#10212f; --strong:#10212f; --muted:#536679; --line:#d7e2ec; --line-strong:#b9c8d6;
--accent:#1e62d0; --accent-h:#174fab; --accent-fg:#ffffff; --accent-soft:#e6eefb; --accent-ink:#174fab; --link:#1e62d0; --focus:#1e62d0;
--side-bg:#ffffff; --side-fg:#2a3b4b; --side-strong:#10212f; --side-muted:#7a8a9a; --side-line:#d7e2ec; --side-hover:#eef3f8; --sub-on:#1e62d0;
--logo-bg:#1e62d0; --logo-fg:#ffffff; --top-bg:rgba(255,255,255,.94);
--ok:#16845f; --ok-soft:#e3f3ec; --ok-ink:#11684b; --warn:#c98a1a; --warn-soft:#fdf3df; --warn-ink:#9a620d; --info-soft:#e6eefb; --info-ink:#174fab; --danger:#b42318; --danger-soft:#fdecea; --danger-line:#f0b8b2;
--disc-bg:#eef3f8; --disc-ink:#536679; --guide-bg:#e6eefb; --guide-fg:#10212f; --guide-line:#1e62d0;
--tip-bg:#10212f; --tip-fg:#ffffff; --toast-bg:#10212f; --toast-fg:#ffffff; --toast-ic:#5fd0a6; --coach:#1e62d0; --coach-fg:#ffffff;
--glow:rgba(30,98,208,.28); --glow-0:rgba(30,98,208,0); --th-bg:#f4f7fb; --row-h:#f6f9fd; --tp-h:#dce7f7; --tp-mm:#eef4fc;
"""
V2 = """
--font:"Figtree",system-ui,-apple-system,"Segoe UI",sans-serif; --font-d:"Figtree",system-ui,sans-serif; --fs:15.5px; --h1:2.05rem; --h2:1.15rem; --h-track:-.025em;
--nav-on-bg:#e6eefb; --nav-on-fg:#174fab; --help-bg:#e6eefb; --help-fg:#174fab; --help-line:transparent; --help-s:22px;
--login-art:#e6eefb; --login-art-fg:#10212f;
--in-bd:1px solid #d7e2ec; --in-bg:#fbfcfe; --in-h:46px; --btn-h:42px; --nav-h:44px; --side-w:264px; --main-max:1160px;
--r-card:18px; --r-btn:999px; --r-nav:12px; --r-chip:999px; --r-item:12px; --r-sec:50%; --r-logo:50%; --r-modal:20px; --card-bd:1px solid transparent; --card-pad:22px; --shadow:0 10px 24px rgba(16,33,47,.08);

--stage:#e3e9f0; --stage-fg:#536679; --bg:#f4f7fb; --surface:#ffffff; --surface-2:#eef3f8; --fg:#10212f; --strong:#10212f; --muted:#536679; --line:#d7e2ec; --line-strong:#b9c8d6;
--accent:#1e62d0; --accent-h:#174fab; --accent-fg:#ffffff; --accent-soft:#e6eefb; --accent-ink:#174fab; --link:#1e62d0; --focus:#1e62d0;
--side-bg:#ffffff; --side-fg:#2a3b4b; --side-strong:#10212f; --side-muted:#7a8a9a; --side-line:#d7e2ec; --side-hover:#eef3f8; --sub-on:#1e62d0;
--logo-bg:#1e62d0; --logo-fg:#ffffff; --top-bg:rgba(255,255,255,.94);
--ok:#16845f; --ok-soft:#e3f3ec; --ok-ink:#11684b; --warn:#c98a1a; --warn-soft:#fdf3df; --warn-ink:#9a620d; --info-soft:#e6eefb; --info-ink:#174fab; --danger:#b42318; --danger-soft:#fdecea; --danger-line:#f0b8b2;
--disc-bg:#eef3f8; --disc-ink:#536679; --guide-bg:#e6eefb; --guide-fg:#10212f; --guide-line:#1e62d0;
--tip-bg:#10212f; --tip-fg:#ffffff; --toast-bg:#10212f; --toast-fg:#ffffff; --toast-ic:#5fd0a6; --coach:#1e62d0; --coach-fg:#ffffff;
--glow:rgba(30,98,208,.28); --glow-0:rgba(30,98,208,0); --th-bg:#f4f7fb; --row-h:#f6f9fd; --tp-h:#dce7f7; --tp-mm:#eef4fc;
"""
V3 = """
--font:"Atkinson Hyperlegible",Verdana,system-ui,sans-serif; --font-d:"Atkinson Hyperlegible",Verdana,system-ui,sans-serif; --fs:17.5px; --h1:2.1rem; --h2:1.25rem; --h-track:0;
--nav-on-bg:#1e62d0; --nav-on-fg:#ffffff; --help-bg:#1e62d0; --help-fg:#ffffff; --help-line:#1e62d0; --help-s:30px;
--login-art:#1e62d0; --login-art-fg:#ffffff;
--in-bd:2px solid #9fb2c4; --in-bg:#ffffff; --in-h:56px; --btn-h:54px; --nav-h:56px; --side-w:290px; --main-max:1100px;
--r-card:12px; --r-btn:10px; --r-nav:10px; --r-chip:8px; --r-item:10px; --r-sec:50%; --r-logo:10px; --r-modal:16px; --card-bd:2px solid #d7e2ec; --card-pad:24px; --shadow:none;

--stage:#e3e9f0; --stage-fg:#536679; --bg:#f4f7fb; --surface:#ffffff; --surface-2:#eef3f8; --fg:#10212f; --strong:#10212f; --muted:#536679; --line:#d7e2ec; --line-strong:#b9c8d6;
--accent:#1e62d0; --accent-h:#174fab; --accent-fg:#ffffff; --accent-soft:#e6eefb; --accent-ink:#174fab; --link:#1e62d0; --focus:#1e62d0;
--side-bg:#ffffff; --side-fg:#2a3b4b; --side-strong:#10212f; --side-muted:#7a8a9a; --side-line:#d7e2ec; --side-hover:#eef3f8; --sub-on:#1e62d0;
--logo-bg:#1e62d0; --logo-fg:#ffffff; --top-bg:rgba(255,255,255,.94);
--ok:#16845f; --ok-soft:#e3f3ec; --ok-ink:#11684b; --warn:#c98a1a; --warn-soft:#fdf3df; --warn-ink:#9a620d; --info-soft:#e6eefb; --info-ink:#174fab; --danger:#b42318; --danger-soft:#fdecea; --danger-line:#f0b8b2;
--disc-bg:#eef3f8; --disc-ink:#536679; --guide-bg:#e6eefb; --guide-fg:#10212f; --guide-line:#1e62d0;
--tip-bg:#10212f; --tip-fg:#ffffff; --toast-bg:#10212f; --toast-fg:#ffffff; --toast-ic:#5fd0a6; --coach:#1e62d0; --coach-fg:#ffffff;
--glow:rgba(30,98,208,.28); --glow-0:rgba(30,98,208,0); --th-bg:#f4f7fb; --row-h:#f6f9fd; --tp-h:#dce7f7; --tp-mm:#eef4fc;
"""
V3_EXTRA = """
.nav-i{font-weight:700;font-size:1.02em}
.nav-gl{color:#1e62d0}
.btn-ghost{border-width:3px}
.chip{font-size:.86em;padding:4px 12px}
.kpi strong{font-size:2.3rem}
.dev-tablet .side:not(.is-open) .nav-i{min-height:64px}
"""

VARIANTS = [
    dict(id="v1-clear", num=1, cfg={"id": "v1", "guided": False, "calendar": "simple"}, tokens=V1, extra="",
         fonts="family=Public+Sans:wght@400;500;600;700;800", title="Allergy Workflow Clear",
         ua="Сучасний, але простий", en="Modern and simple",
         about_ua="Класичний CRM-стиль у нинішніх кольорах програми (білий + синій): біле бокове меню, чіткі таблиці, компактні картки.",
         about_en="Classic CRM look in the app's current colors (white + blue): white side menu, clean tables, compact cards.",
         swatch=["#1e62d0", "#f4f7fb", "#10212f", "#b42318"], font_name="Public Sans",
         cal_ua="Календар мінімальний: лише пацієнти на імунотерапії та наступний прийом (+7 днів від останньої ін'єкції).",
         cal_en="Minimal calendar: only immunotherapy patients and their next visit (last shot + 7 days)."),
    dict(id="v2-airy", num=2, cfg={"id": "v2", "guided": False, "calendar": "full"}, tokens=V2, extra="",
         fonts="family=Figtree:wght@400;500;600;700;800", title="Allergy Workflow Airy",
         ua="Сучасний, легший", en="Modern and lighter",
         about_ua="Ті самі білі й сині кольори, але легше: більше повітря, м'які картки без рамок і з тінню, округлі кнопки. Поля для введення лишаються прямими.",
         about_en="Same white and blue colors, but lighter: more white space, soft borderless cards with shadow, round buttons. Input boxes stay square.",
         swatch=["#1e62d0", "#f4f7fb", "#10212f", "#b42318"], font_name="Figtree",
         cal_ua="«Козир»: календар із 3 вкладок: записи пацієнтів, графік роботи, нотатки з кольорами важливості. Термінові нотатки з'являються на дашборді.",
         cal_en="The 'trump card': a 3-tab calendar: patient appointments, staff schedule, to-do notes with priority colors. Urgent notes show on the Dashboard."),
    dict(id="v3-easy", num=3, cfg={"id": "v3", "guided": True, "calendar": "simple"}, tokens=V3, extra=V3_EXTRA,
         fonts="family=Atkinson+Hyperlegible:wght@400;700", title="Allergy Workflow Easy",
         ua="Максимально просто", en="As simple as possible",
         about_ua="Для неуважного й непідготовленого користувача: ті самі білі й сині кольори, великий шрифт для слабкого зору, плашка «Що робити зараз» на кожному екрані, головна кнопка пульсує, все велике.",
         about_en="For a distracted, non-technical user: same white and blue colors, a large low-vision font, a 'What to do now' bar on every screen, the main button pulses, everything big.",
         swatch=["#1e62d0", "#f4f7fb", "#10212f", "#b42318"], font_name="Atkinson Hyperlegible",
         cal_ua="Календар мінімальний (як у варіанті 1), але з більшими елементами.",
         cal_en="Minimal calendar (as in variant 1) with larger elements."),
]
DEVICES = [("desktop", "Desktop · 1440 × 900", "Комп'ютер", "Desktop"), ("tablet", "Tablet · 820 × 1180", "Планшет", "Tablet"), ("phone", "Phone · 390 × 844", "Телефон", "Phone")]


def mockup(v, dev, label):
    return f"""<!doctype html>
<html lang="en" class="dev-{dev}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{v['title']} · {dev.capitalize()}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{v['fonts']}&display=swap">
<style>
:root{{{v['tokens']}color-scheme:light}}
{CSS}
{v['extra']}
</style>
</head>
<body>
<div class="stage"><span class="stage-l">{label} · Variant {v['num']}: {v['en']}</span><div class="dev-wrap"><div class="device">
<div id="app"></div><div id="modal-root"></div><div id="toast-root" aria-live="polite"></div>
</div></div></div>
<script>window.VARIANT = {json.dumps(v['cfg'])}; window.DEVICE = "{dev}";</script>
<script>
{JS}
</script>
</body>
</html>
"""


CHANGES = [
    ("Бокове меню з групами замість стиснутого верхнього рядка. На планшеті воно згортається до іконок, на телефоні відкривається кнопкою «Menu».",
     "Side menu with groups instead of the cramped top bar. Collapses to icons on tablet; opens with a Menu button on phone."),
    ("Settings тепер підменю в боковому меню. Обрав пункт, і відкривається лише він, без нової вкладки.",
     "Settings is a submenu in the side menu. Pick an item and only that item opens. No new browser tab."),
    ("Пацієнти: одна кнопка «Filter» відкриває список статусів. Пошук розбитий на поля «Name», «E-mail», «Phone», і з першої букви випадають картки пацієнтів, що збігаються.",
     "Patients: one Filter button opens the status list. Search is split into Name, E-mail and Phone boxes, and matching patient cards appear from the first letter."),
    ("Дашборд: зверху блок «Needs attention», нижче 4 головні цифри, а статуси показані однією смугою, де натискання відкриває список.",
     "Dashboard: a 'Needs attention' block first, then 4 key numbers, and one status strip where a click opens the list."),
    ("Новий пацієнт: червоні зірочки біля обов'язкових полів, позначки «to discuss», необов'язкові поля підписані, біля кожного поля «?».",
     "New Patient: red stars on required fields, 'to discuss' tags, optional fields labelled, and a ? on every field."),
    ("Вибір дати завжди англійською (MM/DD/YYYY), незалежно від мови браузера.",
     "Date picker is always in English (MM/DD/YYYY), whatever the browser language."),
    ("Профіль лікаря: 3 обов'язкові кроки (ім'я, клініка, підпис) зі смугою прогресу. NPI необов'язковий, деталі сховані.",
     "Doctor profile: 3 required steps (name, clinic, signature) with a progress bar. NPI is optional, details are hidden."),
    ("Antigens: розділи розгортаються натисканням на заголовок. Є пошук, редагування олівцем, архівування лише з підтвердженням.",
     "Antigens: sections open and close by tapping the title. Search, edit with a pencil, archive only after confirmation."),
    ("Document Templates: кожен шаблон як картка. Upload і Roll back лише з підтвердженням.",
     "Document Templates: each template is a card. Upload and Roll back only after confirmation."),
    ("Кольори програми не змінювали: білий фон і той самий синій. Поля для введення з прямими кутами. Test Panel за домовленістю не змінювали.",
     "App colors unchanged: white background and the same blue. Square input boxes. Test Panel layout unchanged by agreement."),
]
SAFETY = [
    ("Червоне питання на білому", "Red question on white", "Кожне «Видалити», «Зберегти», «Архівувати», «Вийти» перепитує. Для деактивації акаунта треба вписати слово.", "Every Delete, Save, Archive and Log out asks first. Deactivating an account requires typing a word."),
    ("Кружечок «?»", "The ? circle", "Біля кожного поля: навіщо воно, що вписати, приклад.", "Next to every field: why it is there, what to type, an example."),
    ("Зірочка *", "The * star", "Позначає обов'язкові поля. Фінальний список узгоджуємо із замовником.", "Marks required fields. The final list is agreed with the client."),
    ("Розділ Training", "Training section", "6 коротких уроків. Кнопка «Show me» підсвічує потрібну кнопку на екрані.", "6 short lessons. 'Show me' highlights the right button on screen."),
]
DISCUSS = [
    ("Які поля нового пацієнта обов'язкові і чи блокують вони збереження (позначка «to discuss»)?", "Which New Patient fields are required, and do they block saving (the 'to discuss' tags)?"),
    ("Календар: чи потрібен графік роботи і нотатки, чи досить наступного прийому пацієнта?", "Calendar: do they need staff schedule and notes, or only the patient's next visit?"),
    ("Правило наступного візиту: останній укол + 7 днів. Чи це правильно для всіх пацієнтів?", "Next-visit rule: last shot + 7 days. Is this right for every patient?"),
    ("Профіль лікаря: обов'язкові лише ім'я, клініка і підпис?", "Doctor profile: only name, clinic and signature are required?"),
    ("Звіт: реакція 3–5 мм названа «не значущою», але потрапляє в позитивні. Яке правило правильне?", "Report: 3–5 mm is called 'not significant' but is listed as positive. Which rule is right?"),
]


def bi(ua, en, tag="span"):
    return f'<{tag} lang="uk">{ua}</{tag}><{tag} lang="en">{en}</{tag}>'


def presentation(v):
    others = "".join(f'<a href="{LINKS.get(o["id"], "#")}"{" aria-current=\"page\"" if o["id"] == v["id"] else ""}>{o["num"]}. {bi(o["ua"], o["en"])}</a>' for o in VARIANTS)
    sw = "".join(f'<span class="sw" style="background:{c}"></span>' for c in v["swatch"])
    devs = ""
    sizes = {"desktop": (1440, 900), "tablet": (820, 1180), "phone": (390, 844)}
    for dev, lab, ua, en in DEVICES:
        w, h = sizes[dev]
        devs += f"""<section class="dev-sec" id="{dev}"><div class="sec-h"><span class="eyebrow">{bi(ua, en)}</span><h2>{bi(ua + ": живий макет", en + ": live mockup")}</h2><p>{bi("Натискайте все: меню, фільтри, кнопки, «?». Це той самий файл, що й окремий макет.", "Click anything: menu, filters, buttons, ?. It is the same file as the standalone mockup.")}</p></div>
<div class="frame frame-{dev}" style="--w:{w};--h:{h}"><iframe src="{dev}.html" title="{v['en']} — {en}" width="{w}" height="{h}" loading="lazy"></iframe></div>
<a class="open" href="{dev}.html">{bi("Відкрити на весь екран", "Open full screen")} →</a></section>"""
    changes = "".join(f"<li>{bi(u, e)}</li>" for u, e in CHANGES)
    safety = "".join(f'<div class="s-card"><h3>{bi(a, b)}</h3><p>{bi(c, d)}</p></div>' for a, b, c, d in SAFETY)
    discuss = "".join(f"<li>{bi(u, e)}</li>" for u, e in DISCUSS)
    audit = LINKS.get("audit", "#")
    return f"""<title>{v['title']} Deck</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{v['fonts']}&display=swap">
<style>
/* Layout: a single scrolling deck; each section is one 'slide' with a live device frame */
:root{{--acc:{v['swatch'][0]};--bg:#f4f5f7;--surface:#ffffff;--fg:#1a1f26;--muted:#5b6470;--line:#e1e4e9;--red:#c8102e;--font:{'"' + v['font_name'] + '"'},system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#111418;--surface:#181c22;--fg:#e8ebef;--muted:#9aa3ae;--line:#2a3039;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#111418;--surface:#181c22;--fg:#e8ebef;--muted:#9aa3ae;--line:#2a3039;color-scheme:dark}}
*{{box-sizing:border-box}}
body{{background:var(--bg);color:var(--fg);font-family:var(--font);font-size:16px;line-height:1.55}}
html:not(.en) [lang="en"]{{display:none!important}} html.en [lang="uk"]{{display:none!important}}
.bar{{position:sticky;top:env(safe-area-inset-top,0px);z-index:10;background:var(--surface);border-bottom:1px solid var(--line);padding:10px max(16px,env(safe-area-inset-right,0px)) 10px max(16px,env(safe-area-inset-left,0px));display:flex;gap:10px 18px;align-items:center;flex-wrap:wrap}}
body::before{{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:11;background:var(--surface)}}
.bar nav{{display:flex;gap:14px;flex-wrap:wrap;font-size:14px}}
.bar a{{color:var(--muted);text-decoration:none;font-weight:600}}
.bar a[aria-current]{{color:var(--fg);border-bottom:2px solid var(--acc)}}
.lang{{margin-left:auto;display:flex;border:1px solid var(--line)}}
.lang button{{font:inherit;font-weight:700;font-size:13px;border:0;background:none;color:var(--muted);padding:6px 12px;cursor:pointer}}
.lang button[aria-pressed="true"]{{background:var(--acc);color:#fff}}
main{{padding:0 max(16px,env(safe-area-inset-right,0px)) 0 max(16px,env(safe-area-inset-left,0px))}}
section{{max-width:1240px;margin:0 auto;padding-block:56px;border-bottom:1px solid var(--line);display:grid;gap:22px}}
.hero{{padding-block:64px 48px}}
.eyebrow{{font-size:13px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:var(--acc)}}
h1{{font-size:clamp(2rem,5vw,3.4rem);line-height:1.08;margin:0;text-wrap:balance;letter-spacing:-.02em}}
h2{{font-size:clamp(1.4rem,3vw,2rem);margin:0;text-wrap:balance;line-height:1.2}}
h3{{margin:0;font-size:1.05rem}}
p{{margin:0;max-width:70ch}}
.lead{{font-size:1.15rem;color:var(--muted)}}
.facts{{display:flex;gap:28px;flex-wrap:wrap;align-items:center}}
.fact{{display:grid;gap:4px}}.fact small{{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:700}}
.sw{{display:inline-block;width:28px;height:28px;border:1px solid var(--line);margin-right:4px}}
.sec-h{{display:grid;gap:8px}}.sec-h p{{color:var(--muted)}}
.changes{{margin:0;padding-left:22px;display:grid;gap:10px;max-width:80ch}}
.cal-note{{background:var(--surface);border:1px solid var(--line);border-left:5px solid var(--acc);padding:14px 16px}}
.frame{{width:100%;max-width:calc(var(--w) * 1px);aspect-ratio:var(--w)/var(--h);position:relative;overflow:hidden;background:#fff;border:1px solid var(--line);box-shadow:0 20px 50px rgba(0,0,0,.12);justify-self:center}}
.frame-tablet{{max-width:min(560px,100%);border-radius:24px;border:10px solid #1b1f24}}
.frame-phone{{max-width:min(360px,100%);border-radius:36px;border:9px solid #1b1f24}}
.frame iframe{{position:absolute;left:0;top:0;border:0;transform-origin:0 0}}
.open{{justify-self:center;color:var(--acc);font-weight:700}}
.safety{{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}}
.s-card{{background:var(--surface);border:1px solid var(--line);padding:18px;display:grid;gap:6px;align-content:start}}
.s-card p{{color:var(--muted);font-size:15px}}
.s-card:first-child{{border-top:5px solid var(--red)}}
.demo-modal{{background:#fff;color:#1d1d1f;border-top:8px solid var(--red);max-width:440px;padding:22px;text-align:center;display:grid;gap:8px;box-shadow:0 20px 50px rgba(0,0,0,.18)}}
.demo-modal strong{{color:var(--red);font-size:1.35rem}}
.demo-modal .b{{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}}.demo-modal .b span{{padding:12px;font-weight:700;background:#eef0f3}}.demo-modal .b span+span{{background:var(--red);color:#fff}}
.discuss{{margin:0;padding-left:22px;display:grid;gap:10px}}
.discuss li::marker{{color:var(--red);font-weight:800}}
footer{{max-width:1240px;margin:0 auto;padding-block:32px 56px;color:var(--muted);display:flex;gap:16px;flex-wrap:wrap}}
footer a{{color:var(--acc);font-weight:700}}
@media (max-width:860px){{.safety{{grid-template-columns:repeat(2,minmax(0,1fr))}}}}
@media (max-width:520px){{.safety{{grid-template-columns:minmax(0,1fr)}}.lang{{margin-left:0}}}}
</style>
<header class="bar"><strong>{bi("Презентація", "Presentation")}</strong><nav>{others}<a href="{audit}">{bi("Аудит", "Audit")}</a></nav><div class="lang" role="group" aria-label="Language"><button type="button" id="l-uk" aria-pressed="true">UA</button><button type="button" id="l-en" aria-pressed="false">EN</button></div></header>
<main>
<section class="hero"><span class="eyebrow">{bi(f"Варіант {v['num']} з 3", f"Variant {v['num']} of 3")} · Allergy Workflow</span>
<h1>{bi(v['ua'], v['en'])}</h1><p class="lead">{bi(v['about_ua'], v['about_en'])}</p>
<div class="facts"><div class="fact"><small>{bi("Кольори", "Colors")}</small><span>{sw}</span></div><div class="fact"><small>{bi("Шрифт", "Font")}</small><strong>{v['font_name']}</strong></div><div class="fact"><small>{bi("Пристрої", "Devices")}</small><strong>{bi("Комп'ютер · Планшет · Телефон", "Desktop · Tablet · Phone")}</strong></div></div>
<p>{bi("Структуру програми не змінювали: ті самі розділи (Dashboard, Patients, Calendar, New Patient, Test Panel, My Profile, Antigens, Accounts, Settings) і ті самі поля. Змінено лише вигляд і додано захист від помилок. Усі імена в макеті вигадані.", "The app structure is unchanged: same sections (Dashboard, Patients, Calendar, New Patient, Test Panel, My Profile, Antigens, Accounts, Settings) and the same fields. Only the look changed, plus protection from mistakes. All names in the mockup are made up.")}</p></section>
<section><div class="sec-h"><span class="eyebrow">{bi("Що змінилось", "What changed")}</span><h2>{bi("10 змін за результатами аналізу", "10 changes from the review")}</h2></div><ul class="changes">{changes}</ul><div class="cal-note">{bi(v['cal_ua'], v['cal_en'], "p")}</div></section>
{devs}
<section><div class="sec-h"><span class="eyebrow">{bi("Захист від помилок", "Mistake protection")}</span><h2>{bi("Однаково в усіх трьох варіантах", "The same in all three variants")}</h2></div><div class="safety">{safety}</div>
<div class="demo-modal" aria-hidden="true"><strong>{bi("Ви дійсно хочете видалити?", "Delete this patient?")}</strong><span>{bi("Цю дію не можна скасувати.", "This cannot be undone.")}</span><div class="b"><span>{bi("Ні, назад", "No, go back")}</span><span>{bi("Так, видалити", "Yes, delete")}</span></div></div></section>
<section><div class="sec-h"><span class="eyebrow">{bi("Для обговорення", "To discuss")}</span><h2>{bi("Питання до замовника", "Questions for the client")}</h2><p>{bi("Відповіді на ці питання визначать, які поля блокуватимуть збереження і що лишиться в календарі.", "The answers decide which fields block saving and what stays in the calendar.")}</p></div><ol class="discuss">{discuss}</ol></section>
</main>
<footer><span>Allergy Workflow · {bi("макет візуалу, 2026", "visual mockup, 2026")}</span>{"".join(f'<a href="{d}.html">{bi(u, e)}</a>' for d, _, u, e in DEVICES)}</footer>
<script>
(function(){{
  const root=document.documentElement, uk=document.getElementById("l-uk"), en=document.getElementById("l-en");
  function set(l){{root.classList.toggle("en",l==="en");root.lang=l==="en"?"en":"uk";uk.setAttribute("aria-pressed",l!=="en");en.setAttribute("aria-pressed",l==="en");try{{localStorage.setItem("deck-lang",l)}}catch(e){{}}}}
  uk.onclick=()=>set("uk"); en.onclick=()=>set("en");
  try{{const s=localStorage.getItem("deck-lang"); if(s) set(s);}}catch(e){{}}
  const fit=()=>document.querySelectorAll(".frame").forEach(f=>{{const i=f.querySelector("iframe");i.style.transform="scale("+(f.clientWidth/Number(i.width))+")";}});
  window.addEventListener("resize",fit); if(window.ResizeObserver) document.querySelectorAll(".frame").forEach(f=>new ResizeObserver(fit).observe(f)); fit();
}})();
</script>
"""


for v in VARIANTS:
    for dev, label, _, _ in DEVICES:
        (OUT / f"{v['id']}-{dev}.html").write_text(mockup(v, dev, label), encoding="utf-8")
    (OUT / f"presentation-{v['id']}.html").write_text(presentation(v), encoding="utf-8")
    print("built", v["id"])
