const { chromium } = require('C:/Users/Ahmed Asif/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const links = [
 ['Galaxy Knitwear','https://galaxy-lilac-alpha.vercel.app/'],
 ['Nova Builders','https://nova-nova-builders.vercel.app/'],
 ['Vantor Automotive','https://vantor-automative.vercel.app/'],
 ['Ember & Grain','https://restaurant-app-blush-mu.vercel.app/'],
 ['Fade & Co.','https://fade-and-co-omega.vercel.app/'],
];
(async()=>{
 const browser = await chromium.launch({channel:'msedge',headless:true,args:['--disable-gpu']});
 const results=[];
 try{
  for(const [name,url] of links){
   const page=await browser.newPage();
   try{const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});await page.waitForTimeout(800);results.push({name,url,status:response.status(),title:await page.title(),content:(await page.locator('body').innerText()).slice(0,2200)});}
   catch(error){results.push({name,url,error:error.message})}
   finally{await page.close()}
  }
  await fs.writeFile('verification/project-links.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
