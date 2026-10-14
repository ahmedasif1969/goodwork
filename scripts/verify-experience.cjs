const { chromium } = require('C:/Users/Ahmed Asif/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const base='http://127.0.0.1:3000';
const results=[];
let browser;
(async()=>{
 await fs.mkdir('verification',{recursive:true});
 browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-gpu']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(()=>{
  window.__qaLayoutShifts=[];
  new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__qaLayoutShifts.push(entry.value)}).observe({type:'layout-shift',buffered:true});
 });
 const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base,{waitUntil:'networkidle'});await page.waitForTimeout(2200);
 const field=page.locator('.ambient-layer-violet');
 const transform=()=>field.evaluate(element=>getComputedStyle(element).transform);
 const first=await transform();await page.waitForTimeout(550);assert.notEqual(await transform(),first,'Ambient light should move');
 assert.equal(await page.locator('.hero').evaluate(element=>element.classList.contains('ambient-running')),true);
 await page.getByRole('button',{name:'Pause background motion'}).click();
 const paused=await transform();await page.waitForTimeout(500);assert.equal(await transform(),paused,'Manual pause should stop ambient movement');
 assert.equal(await page.getByRole('button',{name:'Resume background motion'}).getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'Resume background motion'}).click();await page.waitForTimeout(500);assert.notEqual(await transform(),paused);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});
 const hidden=await transform();await page.waitForTimeout(450);assert.equal(await transform(),hidden);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});
 await page.waitForTimeout(500);assert.notEqual(await transform(),hidden);
 await page.screenshot({path:'verification/experience-desktop-hero.png'});
 await page.locator('#services').evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(400);
 assert.equal(await page.locator('.hero').evaluate(element=>element.classList.contains('ambient-running')),false);
 const offscreen=await transform();await page.waitForTimeout(500);assert.equal(await transform(),offscreen);
 assert.equal(await page.locator('.site-header').evaluate(element=>element.classList.contains('is-scrolled')),true);
 results.push({ambientDrift:true,manualPauseAndResume:true,simulatedHiddenTabPause:true,offscreenPause:true,headerScrollState:true});
 const firstProject=page.locator('.project-card').first();await firstProject.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
 await firstProject.hover();await page.waitForTimeout(800);
 assert.notEqual(await firstProject.locator('.project-browser').evaluate(element=>getComputedStyle(element).transform),'none');
 await page.mouse.move(20,100);
 const links=await page.locator('.project-card').evaluateAll(elements=>elements.map(element=>({href:element.href,target:element.target,rel:element.rel})));
 assert.equal(links.length,5);assert.ok(links.every(link=>link.target==='_blank'&&link.rel.includes('noopener')));
 assert.equal(await page.locator('.project-kind').filter({hasText:'Web App'}).count(),2);
 await page.locator('.project-card').last().scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 assert.ok(await page.locator('.project-browser-body img').evaluateAll(elements=>elements.every(image=>image.complete&&image.naturalWidth>0)));
 await page.locator('.work-disciplines a').click();await page.waitForTimeout(1000);assert.equal(new URL(page.url()).hash,'#automation');
 await page.locator('#home').evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(1000);
 assert.equal(await page.locator('h1').evaluate(element=>getComputedStyle(element).opacity),'1');
 assert.equal(await page.locator('.hero').evaluate(element=>element.classList.contains('ambient-running')),true);
 results.push({projectHoverDepth:true,realProjectLinks:5,loadedProjectPreviews:5,websiteLabels:3,webAppLabels:2,automationAnchor:true,scrollDownAndUp:true});
 for(const [selector,name] of [['#work','work'],['#services','services'],['#automation','automation'],['.approach-section','approach'],['#about','about'],['#contact','contact'],['.footer','footer']]){
  await page.locator(selector).evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(1000);
  await page.screenshot({path:`verification/experience-desktop-${name}.png`});
 }
 const cls=await page.evaluate(()=>window.__qaLayoutShifts.reduce((sum,value)=>sum+value,0));assert.ok(cls<.02,`Unexpected layout shifts: ${cls}`);results.push({observedLayoutShift:cls});
 for(const width of [1440,1024,768,390,320]){
  await page.setViewportSize({width,height:900});await page.waitForTimeout(1000);
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,titleRight:document.querySelector('h1').getBoundingClientRect().right}));
  assert.ok(layout.scrollWidth<=width);assert.ok(layout.titleRight<=width);
  results.push({width,horizontalOverflow:false});
 }
 // Repeated preference changes check that media contexts clean up and restore content.
 await page.setViewportSize({width:1440,height:1000});
 for(let i=0;i<3;i++){
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
  assert.equal(await page.locator('.ambient-layer-violet').evaluate(element=>getComputedStyle(element).transform),'none');
  assert.equal(await page.locator('.motion-control').isVisible(),false);
  assert.equal(await page.locator('h1').evaluate(element=>getComputedStyle(element).opacity),'1');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(100);
 }
 results.push({reducedMotionPreferenceCycles:3});
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const touch=await mobile.newPage();touch.on('pageerror',error=>errors.push(error.message));
 await touch.goto(base,{waitUntil:'networkidle'});await touch.waitForTimeout(2200);
 assert.equal(await touch.evaluate(()=>matchMedia('(hover: none)').matches),true);
 await touch.screenshot({path:'verification/experience-mobile-hero.png'});
 const menu=touch.locator('.menu-toggle');await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');
 await touch.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');
 await menu.click();await touch.locator('#main-navigation').getByRole('link',{name:'Services',exact:true}).click();assert.equal(await menu.getAttribute('aria-expanded'),'false');
 const details=touch.locator('.service-details').first();await details.locator('summary').click();assert.notEqual(await details.getAttribute('open'),null);assert.equal(await details.locator('li').count(),4);await details.locator('summary').click();
 for(const [selector,name] of [['#work','work'],['#services','services'],['#automation','automation'],['.approach-section','approach'],['#contact','contact'],['.footer','footer']]){
  await touch.locator(selector).evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));await touch.waitForTimeout(1000);
  await touch.screenshot({path:`verification/experience-mobile-${name}.png`});
 }
 await touch.locator('#contact').evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));await touch.getByRole('button',{name:'Start a Conversation',exact:true}).click();
 assert.equal(await touch.locator('[aria-invalid="true"]').count(),4);
 assert.equal(await touch.locator('#contact-name').evaluate(element=>element===document.activeElement),true);
 await touch.locator('#contact-name').fill('Test Person');await touch.locator('#contact-email').fill('person@example.com');await touch.locator('#contact-service').selectOption('Website');await touch.locator('#contact-details').fill('We would like a responsive website for our business.');
 await touch.getByRole('button',{name:'Start a Conversation',exact:true}).click();await touch.locator('.form-status.error').waitFor();assert.match(await touch.locator('.form-status').innerText(),/not accepting messages yet/);assert.equal(await touch.locator('#contact-name').inputValue(),'Test Person');
 results.push({touchMobile:true,mobileMenu:true,serviceAccordion:true,contactValidation:true,inputPreservedOnDeliveryError:true});
 await page.emulateMedia({reducedMotion:'reduce'});await firstProject.scrollIntoViewIfNeeded();
 await firstProject.locator('img').evaluate(image=>{image.removeAttribute('srcset');image.src='/missing-preview.webp'});await firstProject.locator('.project-fallback').waitFor();
 assert.equal(await firstProject.locator('.project-fallback').evaluate(element=>getComputedStyle(element).color),'rgb(234, 223, 245)');
 const staticContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}});const staticPage=await staticContext.newPage();await staticPage.goto(base,{waitUntil:'networkidle'});
 assert.equal(await staticPage.locator('h1').innerText(),'Goodwork.');assert.equal(await staticPage.locator('h1').evaluate(element=>getComputedStyle(element).opacity),'1');
 assert.deepEqual(errors,[]);results.push({brokenImageFallback:true,contentVisibleWithoutJS:true,runtimeErrors:errors});
 await fs.writeFile('verification/experience-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{if(browser)await browser.close()});
