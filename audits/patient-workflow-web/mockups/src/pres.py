"""Full bilingual presentation per variant (every section, 3 devices) + zip with a readme.

python3 build.py && node shoot.cjs && python3 pres.py
"""
import json
import zipfile
from pathlib import Path

from build import VARIANTS

HERE = Path(__file__).resolve().parent
DIST = HERE.parent / "dist"
LINKS = json.loads((HERE / "links.json").read_text(encoding="utf-8")) if (HERE / "links.json").exists() else {}
LOGIN, PASSWORD = "admin", "Demo2026!"

# key, title UA, title EN, was UA, was EN, now UA, now EN, shot prefixes
SECTIONS = [
    ("01-login", "Вхід", "Sign in",
     "Окрема форма на порожньому сірому фоні з підказкою про демо-акаунти.",
     "A lone form on an empty grey page with a hint about demo accounts.",
     "Вхід у стилі програми: панель з назвою зліва, форма справа, «око» для пароля, підказка «забули пароль». Демо-підказки прибрано.",
     "Sign-in in the app's style: brand panel on the left, form on the right, an eye to show the password, a 'forgot password' hint. Demo hints removed.",
     ["01-login"]),
    ("02-menu", "Меню", "Menu",
     "9–10 пунктів в одному верхньому рядку, вони обрізаються («ashboard», «Setting»). Settings відкривається в новій вкладці.",
     "9–10 items in one top row, cut off ('ashboard', 'Setting'). Settings opens in a new browser tab.",
     "Бокове меню з групами Clinical / Practice / Admin / Help. Settings має власне підменю. На планшеті меню згортається до іконок, на телефоні відкривається кнопкою «Menu».",
     "Side menu with Clinical / Practice / Admin / Help groups. Settings has its own submenu. On tablet the menu shrinks to icons; on phone it opens with a Menu button.",
     ["02-menu"]),
    ("03-dashboard", "Дашборд", "Dashboard",
     "16 однакових плиток з цифрами й статусами. Не зрозуміло, що важливе і куди натискати.",
     "16 identical tiles with numbers and statuses. Unclear what matters and where to click.",
     "Зверху блок «Needs attention» з кольорами важливості, нижче 4 головні цифри, статуси однією смугою (натискання відкриває список) і останні дії.",
     "A 'Needs attention' block with priority colors first, then 4 key numbers, one status strip (click opens the list) and recent activity.",
     ["03-dashboard"]),
    ("04-patients", "Пацієнти", "Patients",
     "13 кнопок-статусів (деякі повторюються), спільне поле пошуку і кнопка «Apply filters».",
     "13 status buttons (some repeated), one shared search box and an 'Apply filters' button.",
     "Окремі поля Name, E-mail, Phone. Збіги з'являються з першої букви карткою пацієнта. Одна кнопка «Filter» відкриває вікно зі списком статусів і клінік. Активні фільтри показані тегами з ×.",
     "Separate Name, E-mail and Phone boxes. Matching patient cards appear from the first letter. One Filter button opens a window with statuses and clinics. Active filters show as tags with ×.",
     ["04-patients", "05-patients-search", "06-patients-filter"]),
    ("07-calendar", "Календар", "Calendar",
     "Порожня сітка місяця. Не видно, навіщо вона і як щось додати.",
     "An empty month grid. Unclear what it is for and how to add anything.",
     None, None,
     ["07-calendar", "07-calendar-schedule", "07-calendar-notes"]),
    ("08-new-patient", "Новий пацієнт", "New Patient",
     "Близько 20 полів підряд без зірочок і підказок. Вибір дати відкривається мовою браузера (українською).",
     "About 20 fields in a row, no stars, no help. The date picker follows the browser language (Ukrainian).",
     "4 пронумеровані блоки. Червона «*» біля обов'язкових, позначки «optional» і «to discuss», біля кожного поля «?». Вибір дати завжди англійською. Помилки підсвічуються під полем. Кнопка «Create patient» завжди внизу і перепитує перед збереженням.",
     "4 numbered blocks. Red * on required fields, 'optional' and 'to discuss' tags, a ? on every field. English date picker. Errors show under the field. 'Create patient' stays at the bottom and asks before saving.",
     ["08-new-patient", "09-help", "10-new-patient-errors"]),
    ("11-test-panel", "Test Panel", "Test Panel",
     "Таблиця панелі алергенів.",
     "The allergen panel grid.",
     "За домовленістю структуру не змінювали. Оновлено лише шрифти, поля й відступи.",
     "Layout unchanged by agreement. Only fonts, fields and spacing were refreshed.",
     ["11-test-panel"]),
    ("12-my-profile", "Мій профіль (лікар)", "My Profile (doctor)",
     "Довга сторінка: не видно, що обов'язкове. NPI має 12 полів, а Linked Facilities «вийшли криво».",
     "A long page: unclear what is required. NPI has 12 fields; Linked Facilities look broken.",
     "Смуга прогресу «Required: 2 of 3»: ім'я, клініка, підпис. Підпис з поясненням «без нього звіт не сформується». Клініки показані тегами, видалення лише з підтвердженням. NPI необов'язковий, деталі сховані.",
     "A 'Required: 2 of 3' progress bar: name, clinic, signature. Signature explains 'without it the report cannot be created'. Clinics as tags; removing asks first. NPI optional, details hidden.",
     ["12-my-profile"]),
    ("13-antigens", "Antigens", "Antigens",
     "Таблиця на 150 рядків. У кожному рядку кнопки Save і Archive, а Archive спрацьовує без підтвердження.",
     "A 150-row table with Save and Archive on every row; Archive acts without asking.",
     "Розділи розгортаються й згортаються натисканням на заголовок. Пошук, редагування рядка олівцем, архів лише після підтвердження. Додавання алергену у вікні з «*» і «?».",
     "Sections open and close by tapping the title. Search, edit a row with the pencil, archive only after confirming. Add allergen in a window with * and ?.",
     ["13-antigens"]),
    ("14-accounts", "Акаунти", "Accounts",
     "Скидання пароля й деактивація виконуються без підтвердження.",
     "Password reset and deactivation happen without confirmation.",
     "Таблиця зі статусом. Скидання пароля перепитує. Для деактивації треба вписати слово DEACTIVATE.",
     "A table with status. Password reset asks first. Deactivation requires typing DEACTIVATE.",
     ["14-accounts"]),
    ("15-settings", "Settings", "Settings",
     "Одна довга сторінка зі згорнутими блоками, відкривається в новій вкладці.",
     "One long page of collapsed blocks that opens in a new tab.",
     "Підменю в боковому меню. Кожен пункт відкривається окремою карткою: VitusSource, Reminders, Notifications, Immunotherapy (кольори флаконів, етикетки), Document Templates (картки з підтвердженням Upload і Roll back), Facilities & Doctors.",
     "A submenu in the side menu. Each item opens as its own card: VitusSource, Reminders, Notifications, Immunotherapy (vial colors, labels), Document Templates (cards; Upload and Roll back ask first), Facilities & Doctors.",
     ["15a-settings-vitus", "15b-settings-reminders", "15c-settings-notifications", "15d-settings-immuno", "15e-settings-templates", "15f-settings-facilities"]),
    ("16-training", "Навчання (новий розділ)", "Training (new section)",
     "Розділу не було.",
     "Did not exist.",
     "6 коротких уроків із прогресом. Кнопка «Show me» відкриває потрібний екран і підсвічує кнопку, на яку натиснути.",
     "6 short lessons with progress. 'Show me' opens the right screen and highlights the button to press.",
     ["16-training", "18-training-show-me"]),
    ("17-confirm", "Підтвердження дій", "Action confirmation",
     "Майже всі небезпечні дії виконувалися одним кліком.",
     "Almost every risky action happened in one click.",
     "Білий екран із червоним питанням і двома великими кнопками: «Ні, назад» (сіра) і «Так» (червона). Однаково на всіх пристроях.",
     "A white screen with a red question and two big buttons: 'No, go back' (grey) and 'Yes' (red). The same on every device.",
     ["17-confirm"]),
]
DISCUSS = [
    ("Які поля нового пацієнта обов'язкові і чи блокують вони збереження (позначка «to discuss»)?", "Which New Patient fields are required, and do they block saving ('to discuss' tags)?"),
    ("Календар: чи потрібні графік роботи й нотатки, чи досить наступного прийому пацієнта?", "Calendar: are staff schedule and notes needed, or only the next patient visit?"),
    ("Правило наступного візиту: останній укол + 7 днів. Чи правильно це для всіх?", "Next-visit rule: last shot + 7 days. Right for everyone?"),
    ("Профіль лікаря: обов'язкові лише ім'я, клініка й підпис?", "Doctor profile: only name, clinic and signature required?"),
    ("Звіт: реакцію 3–5 мм названо «не значущою», але вона потрапляє в позитивні. Яке правило правильне?", "Report: 3–5 mm is called 'not significant' but listed as positive. Which rule is right?"),
]
DEV = [("desktop", "Комп'ютер", "Desktop"), ("tablet", "Планшет", "Tablet"), ("phone", "Телефон", "Phone")]
SHOT_NAMES = {
    "05-patients-search": ("Пошук: збіги з першої букви", "Search: matches from the first letter"),
    "06-patients-filter": ("Вікно Filter", "Filter window"),
    "09-help": ("Підказка «?»", "The ? help"),
    "10-new-patient-errors": ("Помилки і вибір дати англійською", "Errors and English date picker"),
    "07-calendar-schedule": ("Вкладка: графік роботи", "Tab: staff schedule"),
    "07-calendar-notes": ("Вкладка: нотатки з кольорами", "Tab: color-coded notes"),
    "15a-settings-vitus": ("VitusSource integration", "VitusSource integration"),
    "15b-settings-reminders": ("Workflow Reminders", "Workflow Reminders"),
    "15c-settings-notifications": ("Workflow Notifications", "Workflow Notifications"),
    "15d-settings-immuno": ("Immunotherapy Settings", "Immunotherapy Settings"),
    "15e-settings-templates": ("Document Templates", "Document Templates"),
    "15f-settings-facilities": ("Facilities & Doctors", "Facilities & Doctors"),
    "18-training-show-me": ("«Show me» підсвічує кнопку", "'Show me' highlights the button"),
}


def bi(ua, en, tag="span"):
    return f'<{tag} lang="uk">{ua}</{tag}><{tag} lang="en">{en}</{tag}>'


def page(v):
    shots = DIST / v["id"] / "shots"
    have = {p.stem for p in shots.glob("*.jpg")}
    toc, body = [], []
    for i, (key, tu, te, wu, we, nu, ne, prefixes) in enumerate(SECTIONS, 1):
        if nu is None:
            nu, ne = v["cal_ua"], v["cal_en"]
        prefixes = [p for p in prefixes if f"{p}-desktop" in have]
        toc.append(f'<a href="#{key}">{i}. {bi(tu, te)}</a>')
        gal = ""
        for p in prefixes:
            cap = SHOT_NAMES.get(p)
            cap_html = f'<h4>{bi(*cap)}</h4>' if cap and len(prefixes) > 1 else ""
            gal += f'<div class="shotset">{cap_html}<div class="devs">' + "".join(
                f'<figure class="d-{d}"><a href="shots/{p}-{d}.jpg"><img src="shots/{p}-{d}.jpg" alt="{te} — {de}" loading="lazy"></a><figcaption>{bi(du, de)}</figcaption></figure>'
                for d, du, de in DEV) + "</div></div>"
        body.append(f"""<section id="{key}"><div class="s-h"><span class="num">{i:02d}</span><h2>{bi(tu, te)}</h2></div>
<div class="wn"><div class="was"><span class="lbl">{bi("Було", "Before")}</span><p>{bi(wu, we)}</p></div><div class="now"><span class="lbl">{bi("Стало", "Now")}</span><p>{bi(nu, ne)}</p></div></div>{gal}</section>""")
    others = "".join(f'<a href="{LINKS.get(o["id"], "#")}"{" aria-current=\"page\"" if o["id"] == v["id"] else ""}>{o["num"]}. {bi(o["ua"], o["en"])}</a>' for o in VARIANTS)
    sw = "".join(f'<span class="sw" style="background:{c}"></span>' for c in v["swatch"])
    discuss = "".join(f"<li>{bi(u, e)}</li>" for u, e in DISCUSS)
    return f"""<!doctype html>
<html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{v['title']} Deck</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{v['fonts']}&display=swap">
<style>
/* Layout: one long deck; table of contents, then one block per app section with 3 device screenshots */
:root{{--acc:#1e62d0;--bg:#f4f7fb;--surface:#ffffff;--fg:#10212f;--muted:#536679;--line:#d7e2ec;--red:#b42318;--now:#e6eefb;--font:"{v['font_name']}",system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#0f1520;--surface:#162030;--fg:#e8eef5;--muted:#9fb0c2;--line:#26344a;--now:#17294a;--acc:#6ea0f0;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#0f1520;--surface:#162030;--fg:#e8eef5;--muted:#9fb0c2;--line:#26344a;--now:#17294a;--acc:#6ea0f0;color-scheme:dark}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font);font-size:16px;line-height:1.55}}
html:not(.en) [lang="en"]{{display:none!important}} html.en [lang="uk"]{{display:none!important}}
.bar{{position:sticky;top:env(safe-area-inset-top,0px);z-index:10;background:var(--surface);border-bottom:1px solid var(--line);padding:10px max(16px,env(safe-area-inset-right,0px)) 10px max(16px,env(safe-area-inset-left,0px));display:flex;gap:8px 18px;align-items:center;flex-wrap:wrap}}
body::before{{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:11;background:var(--surface)}}
.bar nav{{display:flex;gap:14px;flex-wrap:wrap;font-size:14px}}
.bar a{{color:var(--muted);text-decoration:none;font-weight:600}}
.bar a[aria-current]{{color:var(--fg);border-bottom:2px solid var(--acc)}}
.lang{{margin-left:auto;display:flex;border:1px solid var(--line)}}
.lang button{{font:inherit;font-weight:700;font-size:13px;border:0;background:none;color:var(--muted);padding:6px 12px;cursor:pointer}}
.lang button[aria-pressed="true"]{{background:var(--acc);color:#fff}}
main{{padding:0 max(16px,env(safe-area-inset-right,0px)) 0 max(16px,env(safe-area-inset-left,0px))}}
section,.hero,.toc{{max-width:1240px;margin:0 auto;padding-block:48px;border-bottom:1px solid var(--line);display:grid;gap:20px}}
.eyebrow{{font-size:13px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:var(--acc)}}
h1{{font-size:clamp(2rem,5vw,3.3rem);line-height:1.08;margin:0;text-wrap:balance;letter-spacing:-.02em}}
h2{{font-size:clamp(1.35rem,3vw,1.9rem);margin:0;line-height:1.2;text-wrap:balance}}
h4{{margin:0 0 10px;font-size:1rem;color:var(--muted)}}
p{{margin:0;max-width:72ch}}
.lead{{font-size:1.12rem;color:var(--muted)}}
.facts{{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start}}
.fact{{display:grid;gap:4px}}.fact small{{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:700}}
.sw{{display:inline-block;width:26px;height:26px;border:1px solid var(--line);margin-right:4px}}
.creds{{background:var(--surface);border:1px solid var(--line);border-left:5px solid var(--acc);padding:14px 18px;display:grid;gap:6px;max-width:560px}}
.creds code{{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:1.05em;background:var(--now);padding:2px 8px;font-weight:700}}
.live{{display:flex;gap:10px;flex-wrap:wrap}}
.live a{{display:inline-flex;align-items:center;gap:6px;padding:10px 16px;background:var(--acc);color:#fff;text-decoration:none;font-weight:700;border-radius:6px}}
.toc-l{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px 20px}}
.toc-l a{{color:var(--fg);text-decoration:none;padding:6px 0;border-bottom:1px solid var(--line);font-weight:600}}
.toc-l a:hover{{color:var(--acc)}}
.s-h{{display:flex;align-items:baseline;gap:14px}}
.num{{font-size:14px;font-weight:800;color:var(--acc);font-variant-numeric:tabular-nums}}
.wn{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}
.was,.now{{padding:14px 16px;border:1px solid var(--line);background:var(--surface);display:grid;gap:4px;align-content:start}}
.now{{background:var(--now);border-color:transparent}}
.lbl{{font-size:12px;text-transform:uppercase;letter-spacing:.1em;font-weight:800;color:var(--muted)}}
.now .lbl{{color:var(--acc)}}
.shotset{{display:grid}}
.devs{{display:grid;grid-template-columns:minmax(0,3.2fr) minmax(0,1.25fr) minmax(0,.75fr);gap:14px;align-items:start}}
figure{{margin:0;display:grid;gap:6px}}
figure img{{width:100%;height:auto;display:block;border:1px solid var(--line);background:#fff;box-shadow:0 8px 24px rgba(16,33,47,.08)}}
.d-tablet img{{border-radius:14px;border:6px solid #1b1f24}}
.d-phone img{{border-radius:18px;border:5px solid #1b1f24}}
figcaption{{font-size:13px;color:var(--muted);font-weight:600;text-align:center}}
.discuss{{margin:0;padding-left:22px;display:grid;gap:10px}}
.discuss li::marker{{color:var(--red);font-weight:800}}
footer{{max-width:1240px;margin:0 auto;padding-block:28px 56px;color:var(--muted)}}
@media (max-width:820px){{.wn{{grid-template-columns:1fr}}.devs{{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)}}.d-desktop{{grid-column:1/-1}}}}
@media (max-width:520px){{.lang{{margin-left:0}}}}
</style></head><body>
<header class="bar"><strong>{bi("Презентація", "Presentation")}</strong><nav>{others}<a href="{LINKS.get('audit', '#')}">{bi("Аудит", "Audit")}</a></nav><div class="lang" role="group" aria-label="Language"><button type="button" id="l-uk" aria-pressed="true">UA</button><button type="button" id="l-en" aria-pressed="false">EN</button></div></header>
<main>
<div class="hero"><span class="eyebrow">{bi(f"Варіант {v['num']} з 3", f"Variant {v['num']} of 3")} · Allergy Workflow</span>
<h1>{bi(v['ua'], v['en'])}</h1><p class="lead">{bi(v['about_ua'], v['about_en'])}</p>
<div class="facts"><div class="fact"><small>{bi("Кольори (не змінювали)", "Colors (unchanged)")}</small><span>{sw}</span></div><div class="fact"><small>{bi("Шрифт", "Font")}</small><strong>{v['font_name']}</strong></div><div class="fact"><small>{bi("Розділів", "Sections")}</small><strong>{len(SECTIONS)}</strong></div><div class="fact"><small>{bi("Пристрої", "Devices")}</small><strong>{bi("Комп'ютер · Планшет · Телефон", "Desktop · Tablet · Phone")}</strong></div></div>
<p>{bi("Структуру програми не змінювали: ті самі розділи й поля. Змінено вигляд, додано захист від помилок, підказки й навчання. Усі імена вигадані.", "The app structure is unchanged: same sections and fields. The look changed, plus mistake protection, help and training. All names are made up.")}</p>
<div class="creds"><strong>{bi("Вхід у живий макет", "Sign in to the live mockup")}</strong><span>{bi("Логін", "Username")}: <code>{LOGIN}</code> &nbsp; {bi("Пароль", "Password")}: <code>{PASSWORD}</code></span><small class="lbl">{bi("Лише для макета, це не справжній акаунт.", "Mockup only, not a real account.")}</small></div>
<div class="live"><a href="mockup-desktop.html">{bi("Живий макет: комп'ютер", "Live mockup: desktop")}</a><a href="mockup-tablet.html">{bi("Планшет", "Tablet")}</a><a href="mockup-phone.html">{bi("Телефон", "Phone")}</a></div></div>
<nav class="toc" aria-label="Contents"><span class="eyebrow">{bi("Зміст", "Contents")}</span><div class="toc-l">{"".join(toc)}<a href="#discuss">{len(SECTIONS) + 1}. {bi("Питання до замовника", "Questions for the client")}</a></div></nav>
{"".join(body)}
<section id="discuss"><div class="s-h"><span class="num">{len(SECTIONS) + 1:02d}</span><h2>{bi("Питання до замовника", "Questions for the client")}</h2></div><ol class="discuss">{discuss}</ol></section>
</main>
<footer>Allergy Workflow · {bi("макет візуалу, листопад 2026", "visual mockup, November 2026")}</footer>
<script>
(function(){{const r=document.documentElement,u=document.getElementById("l-uk"),e=document.getElementById("l-en");
function set(l){{r.classList.toggle("en",l==="en");r.lang=l==="en"?"en":"uk";u.setAttribute("aria-pressed",l!=="en");e.setAttribute("aria-pressed",l==="en");try{{localStorage.setItem("deck-lang",l)}}catch(x){{}}}}
u.onclick=()=>set("uk");e.onclick=()=>set("en");try{{const s=localStorage.getItem("deck-lang");if(s)set(s)}}catch(x){{}}}})();
</script></body></html>
"""


def readme(v):
    return f"""ALLERGY WORKFLOW: ВАРІАНТ {v['num']} З 3, «{v['ua'].upper()}»
(Variant {v['num']} of 3: {v['en']})
================================================================

ЩО ВІДКРИВАТИ
  presentation.html    Презентація (UA/EN, перемикач угорі). Усі розділи програми
                       зі скрінами для комп'ютера, планшета й телефона.
                       Починати з неї.
  mockup-desktop.html  Живий макет для комп'ютера. Можна натискати все.
  mockup-tablet.html   Живий макет для планшета (на ПК показується в рамці).
  mockup-phone.html    Живий макет для телефона (на ПК показується в рамці).
  shots/               Скріни кожного розділу: назва-розділу-пристрій.jpg
  audit.html           Повний аудит програми: помилки, що змінити, чому.

ВХІД У МАКЕТ
  Логін:   {LOGIN}
  Пароль:  {PASSWORD}
  Це лише макет, а не справжня програма. Пароль працює тільки тут.

ЩО ВАЖЛИВО ЗНАТИ
  - Кольори програми не змінювали: білий фон і той самий синій.
  - Структуру не змінювали: ті самі розділи й поля. Змінено тільки вигляд.
  - Нове: бокове меню з підменю Settings, «?» біля кожного поля,
    «*» біля обов'язкових полів, червоні вікна підтвердження, розділ Training.
  - Позначка «to discuss» означає, що поле треба обговорити із замовником.
  - Усі пацієнти й лікарі в макеті вигадані.
  - Для шрифтів потрібен інтернет. Без нього вигляд трохи інший.

{v['about_ua']}
{v['cal_ua']}
"""


if __name__ == "__main__":
    for v in VARIANTS:
        d = DIST / v["id"]
        (d / "presentation.html").write_text(page(v), encoding="utf-8")
        (d / "0_ПРОЧИТАЙ_МЕНЕ.txt").write_text(readme(v), encoding="utf-8")
        name = f"Allergy-Workflow-Variant-{v['num']}-{v['id'].split('-')[1].capitalize()}.zip"
        with zipfile.ZipFile(DIST / name, "w", zipfile.ZIP_DEFLATED) as z:
            z.write(HERE.parent.parent / "audit.html", f"Variant-{v['num']}-{v['id'].split('-')[1].capitalize()}/audit.html")
            for f in sorted(d.rglob("*")):
                if f.is_file():
                    z.write(f, f"Variant-{v['num']}-{v['id'].split('-')[1].capitalize()}/" + str(f.relative_to(d)))
        print("built", name, round((DIST / name).stat().st_size / 1e6, 1), "MB")
