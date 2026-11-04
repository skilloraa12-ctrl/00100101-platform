"""Build the three standalone prototype pages from the shared core.

Usage: python build.py   (writes ../variant-1-clear.html, ../variant-2-airy.html, ../variant-3-easy.html)
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
CORE_JS = (HERE / "core.js").read_text(encoding="utf-8")
CORE_CSS = (HERE / "core.css").read_text(encoding="utf-8")
URLS = json.loads((HERE / "urls.json").read_text(encoding="utf-8")) if (HERE / "urls.json").exists() else {}

LIGHT_DARK_KEYS = None

VARIANTS = [
    {
        "id": "clear", "file": "variant-1-clear.html", "num": 1,
        "title": "Allergy Workflow Clear",
        "ua": "Сучасний, але простий",
        "about": "Звична структура (меню зліва), але чисто, спокійно і з великими кнопками.",
        "fonts": "family=Public+Sans:wght@400;500;600;700;800",
        "config": {"id": "clear", "layout": "sidebar", "guided": False},
        "css": """
/* Layout: classic left sidebar + wide work area; calm clinical slate with a teal-blue accent */
:root{
  --font:"Public Sans",system-ui,-apple-system,"Segoe UI",sans-serif; --font-display:"Public Sans",system-ui,sans-serif; --fs:16px;
  --h1:clamp(1.6rem,2.6vw,2rem); --h2:1.2rem;
  --bg:#f3f5f7; --surface:#ffffff; --surface-2:#eef1f4; --fg:#26313d; --strong:#111a24; --muted:#5f6b78; --line:#e3e7ec; --line-strong:#c9d0d8;
  --accent:#0f6e8c; --accent-hover:#0b5a73; --accent-fg:#ffffff; --accent-soft:#e1f0f5; --accent-ink:#0b5a73; --link:#0f6e8c;
  --side-bg:#ffffff; --side-fg:#33404d; --side-strong:#111a24; --side-muted:#6b7784; --side-line:#e3e7ec; --side-card:#f1f4f6; --accent-on-side:#0f6e8c;
  --nav-on-bg:#0f6e8c; --nav-on-fg:#ffffff;
  --ok:#1f8a4c; --warn-soft:#fff4dc; --warn-ink:#8a5a00; --info-soft:#e7eefc; --info-ink:#2a4f9e; --danger:#c8102e; --danger-soft:#fde8eb; --danger-ink:#9d0b23;
  --sev-mild:#a06b00; --sev-mod:#c2410c;
  --guide-bg:#e1f0f5; --guide-fg:#0b3f52; --guide-border:0; --guide-tag-bg:#0f6e8c; --guide-tag-fg:#fff;
  --help-bg:#ffffff; --help-fg:#0f6e8c; --help-line:#0f6e8c; --tip-bg:#111a24; --tip-fg:#ffffff;
  --toast-bg:#111a24; --toast-fg:#ffffff; --toast-ic:#5fd08f; --coach:#f5b700; --coach-fg:#111a24; --focus:#1d4ed8;
  --glow:rgba(15,110,140,.25); --glow-0:rgba(15,110,140,0);
  --pres-bg:#111a24; --pres-fg:#e8edf2;
  --r:10px; --r-btn:10px; --r-card:14px; --r-in:10px; --btn-h:46px; --in-h:48px; --in-border:1px solid #c9d0d8; --in-bg:#ffffff;
  --card-border:1px solid #e3e7ec; --shadow:0 1px 2px rgba(17,26,36,.05);
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#0e1419; --surface:#151d24; --surface-2:#1c262f; --fg:#d5dde5; --strong:#f2f5f8; --muted:#94a2b0; --line:#25313b; --line-strong:#364552;
  --accent:#2fa3c6; --accent-hover:#46b5d6; --accent-fg:#06222c; --accent-soft:#12303b; --accent-ink:#7fd0ea; --link:#7fd0ea;
  --side-bg:#121a20; --side-fg:#c4ced8; --side-strong:#f2f5f8; --side-muted:#8a98a6; --side-line:#25313b; --side-card:#1a242c; --accent-on-side:#2fa3c6;
  --nav-on-bg:#2fa3c6; --nav-on-fg:#06222c;
  --ok:#3fb86f; --warn-soft:#3a2d10; --warn-ink:#f3c768; --info-soft:#1a2747; --info-ink:#9db8f2; --danger:#ff6b7d; --danger-soft:#3c161d; --danger-ink:#ffb3bd;
  --sev-mild:#f3c768; --sev-mod:#fb923c;
  --guide-bg:#12303b; --guide-fg:#cdeef8; --guide-tag-bg:#2fa3c6; --guide-tag-fg:#06222c;
  --help-bg:#151d24; --help-fg:#7fd0ea; --help-line:#7fd0ea; --tip-bg:#f2f5f8; --tip-fg:#111a24;
  --toast-bg:#f2f5f8; --toast-fg:#111a24; --toast-ic:#1f8a4c; --focus:#93b4ff;
  --in-border:1px solid #364552; --in-bg:#10171d; --card-border:1px solid #25313b; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#0e1419; --surface:#151d24; --surface-2:#1c262f; --fg:#d5dde5; --strong:#f2f5f8; --muted:#94a2b0; --line:#25313b; --line-strong:#364552;
  --accent:#2fa3c6; --accent-hover:#46b5d6; --accent-fg:#06222c; --accent-soft:#12303b; --accent-ink:#7fd0ea; --link:#7fd0ea;
  --side-bg:#121a20; --side-fg:#c4ced8; --side-strong:#f2f5f8; --side-muted:#8a98a6; --side-line:#25313b; --side-card:#1a242c; --accent-on-side:#2fa3c6;
  --nav-on-bg:#2fa3c6; --nav-on-fg:#06222c;
  --ok:#3fb86f; --warn-soft:#3a2d10; --warn-ink:#f3c768; --info-soft:#1a2747; --info-ink:#9db8f2; --danger:#ff6b7d; --danger-soft:#3c161d; --danger-ink:#ffb3bd;
  --sev-mild:#f3c768; --sev-mod:#fb923c;
  --guide-bg:#12303b; --guide-fg:#cdeef8; --guide-tag-bg:#2fa3c6; --guide-tag-fg:#06222c;
  --help-bg:#151d24; --help-fg:#7fd0ea; --help-line:#7fd0ea; --tip-bg:#f2f5f8; --tip-fg:#111a24;
  --toast-bg:#f2f5f8; --toast-fg:#111a24; --toast-ic:#1f8a4c; --focus:#93b4ff;
  --in-border:1px solid #364552; --in-bg:#10171d; --card-border:1px solid #25313b; color-scheme:dark}
""",
    },
    {
        "id": "airy", "file": "variant-2-airy.html", "num": 2,
        "title": "Allergy Workflow Airy",
        "ua": "Сучасний, легший",
        "about": "Меню зверху, багато повітря, м'які кольори, мінімум ліній. Менше візуального шуму.",
        "fonts": "family=Figtree:wght@400;500;600;700;800",
        "config": {"id": "airy", "layout": "top", "guided": False},
        "css": """
/* Layout: slim top bar, centered column with soft floating cards; sage-green accent on a warm-white ground */
:root{
  --font:"Figtree",system-ui,-apple-system,"Segoe UI",sans-serif; --font-display:"Figtree",system-ui,sans-serif; --fs:16.5px;
  --h1:clamp(1.7rem,3vw,2.3rem); --h2:1.22rem; --h-track:-.02em; --main-max:980px;
  --bg:#fafbf8; --surface:#ffffff; --surface-2:#f1f4ef; --fg:#2c3a33; --strong:#14211a; --muted:#66756c; --line:#edf0ea; --line-strong:#d6ddd3;
  --accent:#2f7d5b; --accent-hover:#256a4c; --accent-fg:#ffffff; --accent-soft:#e3f1e9; --accent-ink:#1f6446; --link:#2f7d5b;
  --side-bg:#fafbf8; --side-fg:#3a4a41; --side-strong:#14211a; --side-muted:#6b7a71; --side-line:#edf0ea; --side-card:#eff3ec; --accent-on-side:#2f7d5b;
  --nav-on-bg:#e3f1e9; --nav-on-fg:#1f6446;
  --ok:#2f8f5a; --warn-soft:#fdf3dd; --warn-ink:#865c06; --info-soft:#e9effa; --info-ink:#34558f; --danger:#c8102e; --danger-soft:#fdeaec; --danger-ink:#9d0b23;
  --sev-mild:#9a6a00; --sev-mod:#c2410c;
  --guide-bg:transparent; --guide-fg:#3a4a41; --guide-border:1px dashed #cfd8cb; --guide-tag-bg:#e3f1e9; --guide-tag-fg:#1f6446;
  --help-bg:#e3f1e9; --help-fg:#1f6446; --help-line:transparent; --tip-bg:#14211a; --tip-fg:#ffffff;
  --toast-bg:#14211a; --toast-fg:#ffffff; --toast-ic:#7fd8a6; --coach:#f5b700; --coach-fg:#14211a; --focus:#1d4ed8;
  --glow:rgba(47,125,91,.22); --glow-0:rgba(47,125,91,0);
  --pres-bg:#14211a; --pres-fg:#e6efe9;
  --r:14px; --r-btn:999px; --r-card:22px; --r-in:14px; --btn-h:46px; --in-h:50px; --in-border:1px solid #dfe5dc; --in-bg:#fbfcfa;
  --card-border:1px solid transparent; --shadow:0 6px 24px rgba(30,60,45,.07);
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#101512; --surface:#171e1a; --surface-2:#1e2722; --fg:#d3ddd6; --strong:#f1f6f2; --muted:#93a399; --line:#232d27; --line-strong:#33413a;
  --accent:#5cc28f; --accent-hover:#74d1a2; --accent-fg:#06241a; --accent-soft:#183326; --accent-ink:#8fe0b6; --link:#8fe0b6;
  --side-bg:#101512; --side-fg:#c3d0c7; --side-strong:#f1f6f2; --side-muted:#8a9a90; --side-line:#232d27; --side-card:#1a221d; --accent-on-side:#5cc28f;
  --nav-on-bg:#183326; --nav-on-fg:#8fe0b6;
  --ok:#4cc27f; --warn-soft:#382c12; --warn-ink:#f0c66a; --info-soft:#1b2640; --info-ink:#a3baf0; --danger:#ff6b7d; --danger-soft:#3a161c; --danger-ink:#ffb3bd;
  --sev-mild:#f0c66a; --sev-mod:#fb923c;
  --guide-fg:#c3d0c7; --guide-border:1px dashed #33413a; --guide-tag-bg:#183326; --guide-tag-fg:#8fe0b6;
  --help-bg:#183326; --help-fg:#8fe0b6; --tip-bg:#f1f6f2; --tip-fg:#14211a;
  --toast-bg:#f1f6f2; --toast-fg:#14211a; --toast-ic:#2f8f5a; --focus:#93b4ff;
  --in-border:1px solid #33413a; --in-bg:#131915; --shadow:0 6px 24px rgba(0,0,0,.25); color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#101512; --surface:#171e1a; --surface-2:#1e2722; --fg:#d3ddd6; --strong:#f1f6f2; --muted:#93a399; --line:#232d27; --line-strong:#33413a;
  --accent:#5cc28f; --accent-hover:#74d1a2; --accent-fg:#06241a; --accent-soft:#183326; --accent-ink:#8fe0b6; --link:#8fe0b6;
  --side-bg:#101512; --side-fg:#c3d0c7; --side-strong:#f1f6f2; --side-muted:#8a9a90; --side-line:#232d27; --side-card:#1a221d; --accent-on-side:#5cc28f;
  --nav-on-bg:#183326; --nav-on-fg:#8fe0b6;
  --ok:#4cc27f; --warn-soft:#382c12; --warn-ink:#f0c66a; --info-soft:#1b2640; --info-ink:#a3baf0; --danger:#ff6b7d; --danger-soft:#3a161c; --danger-ink:#ffb3bd;
  --sev-mild:#f0c66a; --sev-mod:#fb923c;
  --guide-fg:#c3d0c7; --guide-border:1px dashed #33413a; --guide-tag-bg:#183326; --guide-tag-fg:#8fe0b6;
  --help-bg:#183326; --help-fg:#8fe0b6; --tip-bg:#f1f6f2; --tip-fg:#14211a;
  --toast-bg:#f1f6f2; --toast-fg:#14211a; --toast-ic:#2f8f5a; --focus:#93b4ff;
  --in-border:1px solid #33413a; --in-bg:#131915; --shadow:0 6px 24px rgba(0,0,0,.25); color-scheme:dark}
.layout-top .nav-btn{min-height:42px;padding:8px 16px;border-radius:999px}
.big-primary{box-shadow:0 10px 26px rgba(47,125,91,.28)}
.steps li{background:transparent;padding:6px 4px}
.steps li.is-now{background:transparent}
.plist{gap:0}
""",
    },
    {
        "id": "easy", "file": "variant-3-easy.html", "num": 3,
        "title": "Allergy Workflow Easy",
        "ua": "Максимально просто",
        "about": "Розбереться навіть дитина: один крок за раз, жовта підказка «Що робити зараз», величезні кнопки, наступна дія пульсує.",
        "fonts": "family=Atkinson+Hyperlegible:wght@400;700",
        "config": {"id": "easy", "layout": "top", "guided": True},
        "css": """
/* Layout: big top bar of four giant buttons; one task per screen; a yellow "what to do now" band always on top. One high-contrast light look by design. */
:root{
  --font:"Atkinson Hyperlegible",Verdana,system-ui,sans-serif; --font-display:"Atkinson Hyperlegible",Verdana,system-ui,sans-serif; --fs:18.5px;
  --h1:clamp(1.8rem,4vw,2.5rem); --h2:1.35rem; --h-track:0; --main-max:920px;
  --bg:#ffffff; --surface:#ffffff; --surface-2:#f0f2f5; --fg:#111111; --strong:#000000; --muted:#4a4f57; --line:#d9dde3; --line-strong:#8c939d;
  --accent:#0047ab; --accent-hover:#003a8c; --accent-fg:#ffffff; --accent-soft:#e3ecfb; --accent-ink:#00377f; --link:#0047ab;
  --side-bg:#0b1f3a; --side-fg:#ffffff; --side-strong:#ffffff; --side-muted:#c6d0de; --side-line:#0b1f3a; --side-card:#16325a; --accent-on-side:#ffd23f;
  --nav-on-bg:#ffd23f; --nav-on-fg:#0b1f3a;
  --ok:#137a3a; --warn-soft:#fff3c4; --warn-ink:#5c4300; --info-soft:#e3ecfb; --info-ink:#00377f; --danger:#c8102e; --danger-soft:#fde3e7; --danger-ink:#8c0a20;
  --sev-mild:#8a5a00; --sev-mod:#b33c00;
  --guide-bg:#ffd23f; --guide-fg:#1a1400; --guide-border:3px solid #1a1400; --guide-tag-bg:#1a1400; --guide-tag-fg:#ffd23f; --guide-pad:16px 18px; --guide-fs:1.15em; --guide-w:700;
  --help-bg:#0047ab; --help-fg:#ffffff; --help-line:#0047ab; --help-s:32px; --tip-bg:#000000; --tip-fg:#ffffff;
  --toast-bg:#137a3a; --toast-fg:#ffffff; --toast-ic:#ffffff; --coach:#ffd23f; --coach-fg:#1a1400; --focus:#c8102e;
  --glow:rgba(255,210,63,.95); --glow-0:rgba(255,210,63,.15);
  --pres-bg:#000000; --pres-fg:#ffffff;
  --r:14px; --r-btn:14px; --r-card:18px; --r-in:12px; --btn-h:58px; --in-h:62px; --in-border:3px solid #8c939d; --in-bg:#ffffff; --in-fs:1.1em;
  --card-border:3px solid #d9dde3; --shadow:none; --step-n:40px; --q-n:42px; --step-w:56px; --step-h:56px; --mm-w:60px; --big-h:120px; --big-ic:44px; --big-pad:26px; --ini:60px; --doc-h:200px;
  color-scheme:light;
}
body{background:#ffffff;color:#111111}
.layout-top .side{padding-block:14px}
.layout-top .nav{flex:1 1 100%;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;order:5}
.nav-btn{flex-direction:column;gap:6px;min-height:84px;justify-content:center;text-align:center;font-weight:700;font-size:1.02em;background:#16325a;border:2px solid transparent}
.nav-btn svg{width:30px;height:30px}
.nav-btn.is-on{border-color:#ffd23f}
.layout-top .who{background:#16325a}
.link-btn{color:#ffd23f}
.main .link-btn{color:#0047ab}
.fld label,.fld-top label{font-size:1.08em}
.grid{--cols:1;max-width:620px}
.doc-card{border-width:3px}
.doc-card strong{font-size:1.3em}
.doc-go{font-size:1.1em;background:#0047ab;color:#fff;padding:10px 16px;border-radius:12px;justify-self:start}
.big-act strong{font-size:1.35em}
.big-act{border-width:3px}
.steps li{font-size:1.02em;padding:12px}
.btn-danger-ghost{font-weight:700}
.vol{font-size:1.1em;min-height:62px}
.agroups{grid-template-columns:minmax(0,1fr)}
.chip{font-size:.9em;padding:5px 12px}
@media (max-width:640px){.layout-top .nav{grid-template-columns:repeat(2,minmax(0,1fr))}}
""",
    },
]

ORDER = ["clear", "airy", "easy"]


def page(v):
    links = []
    for other in VARIANTS:
        url = URLS.get(other["id"], "#")
        cur = ' aria-current="page"' if other["id"] == v["id"] else ""
        links.append(f'<a href="{url}"{cur}>{other["num"]}. {other["ua"]}</a>')
    audit = URLS.get("audit")
    if audit:
        links.append(f'<a href="{audit}">Аудит</a>')
    return f"""<title>{v['title']}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{v['fonts']}&display=swap">
<style>
{CORE_CSS}
{v['css']}
</style>
<div class="pres" role="note"><span><b>Варіант {v['num']} з 3 · {v['ua']}.</b> {v['about']} Це клікабельний прототип: оберіть лікаря, пройдіть тест, введіть ін'єкцію, відкрийте «Training».</span><span class="pres-links">{''.join(links)}</span></div>
<div id="app"></div>
<div id="modal-root"></div>
<div id="toast-root" aria-live="polite"></div>
<script>window.VARIANT = {json.dumps(v['config'])};</script>
<script>
{CORE_JS}
</script>
"""


for v in VARIANTS:
    (OUT / v["file"]).write_text(page(v), encoding="utf-8")
    print("wrote", v["file"])
