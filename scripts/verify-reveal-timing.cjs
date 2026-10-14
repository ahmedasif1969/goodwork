const {
  chromium,
} = require("C:/Users/Ahmed Asif/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];
  try {
    for (const mobile of [false, true]) {
      const page = await browser.newPage({
        viewport: mobile
          ? { width: 390, height: 844 }
          : { width: 1536, height: 950 },
        isMobile: mobile,
        hasTouch: mobile,
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);
      const glow = () =>
        page.locator(".horizon-drift").evaluate((e) => {
          const m = new DOMMatrix(getComputedStyle(e).transform);
          return {
            x: m.m41,
            y: m.m42,
            angle: (Math.atan2(m.m12, m.m11) * 180) / Math.PI,
          };
        });
      const before = await glow();
      await page.screenshot({
        path: `verification/hero-motion-${mobile ? "mobile" : "desktop"}-a.png`,
      });
      await page.waitForTimeout(1400);
      const after = await glow();
      await page.screenshot({
        path: `verification/hero-motion-${mobile ? "mobile" : "desktop"}-b.png`,
      });
      assert.ok(
        Math.abs(after.y - before.y) > 6,
        "Hero must move visibly within 1.4 seconds",
      );
      assert.ok(
        Math.abs(after.angle - before.angle) > 0.5,
        "Hero tilt must be perceptible",
      );
      if (mobile) {
        for (const selector of [".service-card", ".approach-grid > li"]) {
          const first = page.locator(selector).first(),
            last = page.locator(selector).last();
          await first.evaluate((e) =>
            scrollTo({
              top: e.getBoundingClientRect().top + scrollY - innerHeight * 0.65,
              behavior: "instant",
            }),
          );
          await page.waitForTimeout(1100);
          const lastTop = await last.evaluate(
            (e) => e.getBoundingClientRect().top,
          );
          assert.ok(lastTop > 844 * 0.8);
          assert.ok(
            Number(await last.evaluate((e) => getComputedStyle(e).opacity)) <
              0.5,
            "Later items must not reveal with first item",
          );
          await last.evaluate((e) =>
            scrollTo({
              top: e.getBoundingClientRect().top + scrollY - innerHeight * 0.92,
              behavior: "instant",
            }),
          );
          await page.waitForTimeout(1000);
          assert.ok(
            Number(await last.evaluate((e) => getComputedStyle(e).opacity)) <
              0.5,
            "Must wait until viewport entry",
          );
          await last.evaluate((e) =>
            scrollTo({
              top: e.getBoundingClientRect().top + scrollY - innerHeight * 0.65,
              behavior: "instant",
            }),
          );
          await page.waitForTimeout(200);
          const entering = Number(
            await last.evaluate((e) => getComputedStyle(e).opacity),
          );
          assert.ok(
            entering > 0.4 && entering < 1,
            "Must animate visibly on entry",
          );
          await page.waitForTimeout(900);
          assert.equal(
            Number(await last.evaluate((e) => getComputedStyle(e).opacity)),
            1,
          );
          await last.evaluate((e) =>
            scrollTo({
              top: e.getBoundingClientRect().top + scrollY - innerHeight * 0.96,
              behavior: "instant",
            }),
          );
          await page.waitForTimeout(1000);
          assert.ok(
            Number(await last.evaluate((e) => getComputedStyle(e).opacity)) <
              0.5,
            "Must reset scrolling back up",
          );
        }
      }
      assert.deepEqual(errors, []);
      results.push({
        mobile,
        heroDeltaY: Math.round(Math.abs(after.y - before.y)),
        heroDeltaAngle: Math.abs(after.angle - before.angle).toFixed(2),
        individualReveals: mobile ? "passed" : "not applicable",
        errors,
      });
      await page.close();
    }
    await fs.writeFile(
      "verification/reveal-timing-results.json",
      JSON.stringify(results, null, 2),
    );
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
