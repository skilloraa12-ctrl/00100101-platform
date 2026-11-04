// Screenshots of every section for every variant and device: node shoot.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const DIST = path.join(__dirname, "..", "dist");
const VARIANTS = ["v1-clear", "v2-airy", "v3-easy"];
const DEVICES = [["desktop", 1440, 900], ["tablet", 820, 1180], ["phone", 390, 844]];

(async () => {
  const browser = await chromium.launch();
  for (const v of VARIANTS) {
    const shots = path.join(DIST, v, "shots");
    fs.rmSync(shots, { recursive: true, force: true });
    fs.mkdirSync(shots, { recursive: true });
    for (const [dev, w, h] of DEVICES) {
      const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      const errs = [];
      p.on("pageerror", e => errs.push(e.message));
      await p.goto("file://" + path.join(DIST, v, `mockup-${dev}.html`));
      await p.evaluate(() => document.fonts.ready);
      const clean = async () => { await p.evaluate(() => { document.querySelector("#toast-root").innerHTML = ""; }); await p.mouse.move(1, 1); await p.waitForTimeout(120); };
      const snap = async name => { await clean(); await p.screenshot({ path: path.join(shots, `${name}-${dev}.jpg`), type: "jpeg", quality: 82 }); };
      const snapKeep = async name => { await p.evaluate(() => { document.querySelector("#toast-root").innerHTML = ""; }); await p.waitForTimeout(150); await p.screenshot({ path: path.join(shots, `${name}-${dev}.jpg`), type: "jpeg", quality: 82 }); };
      const open = async () => { if (dev !== "desktop") await p.click("[data-act=drawer]"); };
      const nav = async k => { await open(); await p.click(`[data-go=${k}]`); };
      const sub = async k => {
        await open();
        if (await p.$eval(".subnav", e => e.hidden)) await p.click("[data-act=settings-toggle]");
        await p.click(`[data-act=sub][data-k=${k}]`);
      };

      await snap("01-login");
      await p.fill("#f-username", "admin"); await p.fill("#f-password", "Demo2026!");
      await p.click(".login-card button[type=submit]");
      await snap("03-dashboard");
      // menu with Settings submenu open
      if (dev === "desktop") { await p.click("[data-act=settings-toggle]"); await snap("02-menu"); await p.click("[data-act=settings-toggle]"); }
      else { await p.click("[data-act=drawer]"); await p.click("[data-act=settings-toggle]"); await snap("02-menu"); await p.click("[data-act=drawer-close]"); }
      await nav("patients");
      await snap("04-patients");
      await p.fill("#f-sName", "s"); await snap("05-patients-search");
      await p.fill("#f-sName", "");
      await p.click("[data-act=filter]"); await snapKeep("06-patients-filter"); await p.click(".sh-h [data-act=sheet-close]");
      await nav("calendar");
      if (v === "v2-airy") {
        await snap("07-calendar");
        await p.click("[data-act=caltab][data-k=sched]"); await snap("07-calendar-schedule");
        await p.click("[data-act=caltab][data-k=notes]"); await snap("07-calendar-notes");
        await p.click("[data-act=caltab][data-k=appt]");
      } else await snap("07-calendar");
      await nav("newpatient");
      await snap("08-new-patient");
      await p.hover(".help"); await p.waitForTimeout(200); await p.screenshot({ path: path.join(shots, `09-help-${dev}.jpg`), type: "jpeg", quality: 82 });
      await p.click("button[type=submit]"); await p.click("[data-act=dp][data-k=dob]"); await snap("10-new-patient-errors");
      await p.keyboard.press("Escape");
      await nav("testpanel"); await snap("11-test-panel");
      await nav("profile"); await snap("12-my-profile");
      await nav("antigens"); await snap("13-antigens");
      await nav("accounts"); await snap("14-accounts");
      for (const [k, i] of [["vitus", "a"], ["reminders", "b"], ["notifications", "c"], ["immuno", "d"], ["templates", "e"], ["facilities", "f"]]) { await sub(k); await snap(`15${i}-settings-${k}`); }
      await nav("training"); await snap("16-training");
      await p.click("[data-act=show-me] >> nth=5"); await snapKeep("17-confirm"); await p.click("#m-no");
      await nav("training"); await p.click("[data-act=show-me] >> nth=1"); await p.waitForTimeout(250); await p.screenshot({ path: path.join(shots, `18-training-show-me-${dev}.jpg`), type: "jpeg", quality: 82 });
      console.log(v, dev, errs.length ? errs : "ok");
      await p.close();
    }
  }
  await browser.close();
})();
