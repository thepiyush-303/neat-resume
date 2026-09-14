const mod = require('pdf-parse');
console.log('mod is a function?', typeof mod === 'function');
if (typeof mod === 'function') {
  console.log('Success, mod is a function');
} else {
  // Let's check which key is a function
  for (const k of Object.keys(mod)) {
    console.log(k, typeof mod[k]);
  }
}
const defaultExport = mod.default || mod.PDFParse || mod;
console.log('Using:', typeof defaultExport);
