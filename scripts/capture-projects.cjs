const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('C:/Users/Ahmed Asif/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const projects = [
  ['galaxy', 'https://galaxy-lilac-alpha.vercel.app/'],
  ['nova', 'https://nova-nova-builders.vercel.app/'],
  ['vantor', 'https://vantor-automative.vercel.app/'],
  ['ember', 'https://restaurant-app-blush-mu.vercel.app/'],
  ['fade', 'https://fade-and-co-omega.vercel.app/'],
];
(async () => {
  await fs.mkdir(path.join(process.cwd(), 'public', 'projects'), { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu'] });
  const results = [];
  for (const [id, url] of projects) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(process.cwd(), 'public', 'projects', `${id}.png`) });
      results.push({ id, url, status: response.status(), title: await page.title(), content: (await page.locator('body').innerText()).slice(0, 14000) });
    } catch (error) { results.push({ id, url, error: error.message }); }
    finally { await page.close(); }
  }
  await fs.writeFile('scripts/project-inspection.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
