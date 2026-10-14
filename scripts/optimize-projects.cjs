const sharp = require('sharp');
const path = require('node:path');
(async () => {
  for (const name of ['galaxy', 'nova', 'vantor', 'ember', 'fade']) {
    const output = path.join(process.cwd(), 'public', 'projects', `${name}.webp`);
    const result = await sharp(`public/projects/${name}.png`).resize({width:1200}).webp({quality:85}).toFile(output);
    console.log(name, `${Math.round(result.size / 1024)}KB`);
  }
})();
