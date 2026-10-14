const fs = require('node:fs/promises');
const { chromium } = require('C:/Users/Ahmed Asif/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu'] });
  try {
    const page = await browser.newPage({ viewport: {width:1440,height:1000}, reducedMotion:'reduce' });
    await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});
    for(const [selector,name] of [['.automation-section','desktop-automation'],['.approach-section','desktop-approach'],['.about-section','desktop-about']]){
      await page.locator(selector).evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));
      await page.screenshot({path:`verification/${name}.png`});
    }
    await page.setViewportSize({width:390,height:844});
    for(const [selector,name] of [['.services-section','mobile-services'],['.automation-card','mobile-automation'],['.approach-section','mobile-approach']]){
      await page.locator(selector).first().evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));
      await page.screenshot({path:`verification/${name}.png`});
    }
    console.log('Captured the remaining sections for visual review.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
