const { chromium } = require('C:/Users/Ahmed Asif/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true,args:['--disable-gpu']});
 try {
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});await page.waitForTimeout(1100);
  for(const [width,height] of [[1440,1000],[1024,900],[768,1024],[390,844],[320,900]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(1100);
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   const layout=await page.evaluate(()=>{const shell=document.querySelector('.site-shell');const style=getComputedStyle(shell);const box=shell.getBoundingClientRect();const title=document.querySelector('h1').getBoundingClientRect();return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,left:box.left,right:box.right,border:style.borderTopWidth,radius:style.borderRadius,titleRight:title.right}});
   assert.equal(layout.left,0);assert.equal(layout.right,width);assert.equal(layout.border,'0px');assert.equal(layout.radius,'0px');assert.ok(layout.scrollWidth<=width);assert.ok(layout.titleRight<=width);
   console.log(JSON.stringify({width,...layout}));
   await page.screenshot({path:`verification/refined-hero-${width}.png`});
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#main-navigation').getByRole('link',{name:'Work',exact:true}).click();await page.waitForTimeout(1100);
  const workHeading=await page.locator('#work-title').boundingBox();assert.ok(workHeading.y>=88);
  await page.screenshot({path:'verification/refined-work.png'});
  await page.locator('#main-navigation').getByRole('link',{name:'Services',exact:true}).click();await page.waitForTimeout(1100);
  await page.screenshot({path:'verification/refined-services.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  assert.equal(await page.locator('h1').evaluate(element=>getComputedStyle(element).opacity),'1');
  assert.deepEqual(errors,[]);console.log('Border removal, section navigation, responsive layout, reduced motion, and runtime checks passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
