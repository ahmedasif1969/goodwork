const {
  chromium,
} = require("C:/Users/Ahmed Asif/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("node:fs/promises");
const assert = require("node:assert/strict");
let browser;
(async () => {
  browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1536, height: 950 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  assert.equal(await page.locator(".page-aurora").count(), 1);
  assert.equal(
    await page
      .locator(".page-aurora")
      .evaluate((e) => getComputedStyle(e).pointerEvents),
    "none",
  );
  const idle = () =>
    page.locator(".aurora-idle").evaluate((e) => getComputedStyle(e).transform);
  const scrollState = () =>
    page
      .locator(".aurora-scroll")
      .evaluate((e) =>
        Array.from(
          new DOMMatrix(getComputedStyle(e).transform).toFloat64Array(),
        ),
      );
  const d0 = await scrollState();
  assert.equal(
    await page
      .locator(".aurora-svg")
      .evaluate((e) => e.complete && e.naturalWidth > 0),
    true,
  );
  assert.equal(await page.locator(".aurora-path").count(), 0);
  await page.screenshot({ path: "verification/aurora-hero.png" });
  await page
    .locator("#services")
    .evaluate((e) => e.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(1500);
  const d1 = await scrollState();
  assert.notDeepEqual(d1, d0, "Ribbon must move with scroll");
  const t0 = await idle();
  await page.waitForTimeout(550);
  assert.notEqual(
    await idle(),
    t0,
    "Aurora should keep drifting below the hero",
  );
  await page.screenshot({ path: "verification/aurora-services.png" });
  await page
    .locator("#work")
    .evaluate((e) => e.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "verification/aurora-work.png" });
  await page
    .locator("#contact")
    .evaluate((e) => e.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "verification/aurora-contact.png" });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1600);
  await page.waitForFunction(
    (expected) => {
      const matrix = Array.from(
        new DOMMatrix(
          getComputedStyle(document.querySelector(".aurora-scroll")).transform,
        ).toFloat64Array(),
      );
      return expected.every((n, i) => Math.abs(n - matrix[i]) < 0.5);
    },
    d0,
    { timeout: 10000 },
  );
  await page.getByRole("button", { name: "Pause background motion" }).click();
  const paused = await idle();
  await page.waitForTimeout(500);
  assert.equal(await idle(), paused);
  await page.getByRole("button", { name: "Resume background motion" }).click();
  await page.waitForTimeout(500);
  assert.notEqual(await idle(), paused);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(200);
  assert.equal(await idle(), "none");
  const reduced = await scrollState();
  await page
    .locator("#services")
    .evaluate((e) => e.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(300);
  assert.deepEqual(await scrollState(), reduced);
  for (const width of [1920, 1366, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(300);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    const box = await page.locator(".page-aurora").boundingBox();
    assert.equal(box.width, width);
    assert.equal(box.height, 900);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator("#work")
    .evaluate((e) => e.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.screenshot({ path: "verification/aurora-mobile-work.png" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(400);
  const mobileD = await scrollState();
  await page
    .locator("#services")
    .evaluate((e) => e.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(1000);
  assert.notDeepEqual(
    await scrollState(),
    mobileD,
    "Mobile must share scroll motion",
  );
  const menu = page.locator(".menu-toggle");
  await menu.click();
  assert.equal(await menu.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Escape");
  await page.locator(".service-details").first().locator("summary").click();
  assert.notEqual(
    await page.locator(".service-details").first().getAttribute("open"),
    null,
  );
  assert.deepEqual(errors, []);
  const result = {
    singleRibbon: true,
    pointerEventsNone: true,
    scrollTransforms: true,
    scrollUpRestoresPosition: true,
    idleDriftBelowHero: true,
    pauseResume: true,
    reducedMotion: true,
    sharedMobileDesktopMotion: true,
    immutableExternalArtwork: true,
    noOverflow: true,
    mobileNavigation: true,
    serviceInteraction: true,
    runtimeErrors: errors,
  };
  await fs.writeFile(
    "verification/aurora-results.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
  });
