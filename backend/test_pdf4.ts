import { PDFParse } from 'pdf-parse';
const fs = require('fs');
const buf = fs.readFileSync('test_pdf4.ts');
const instance = new PDFParse();
console.log('Instance keys:', Object.keys(instance));
console.log('Prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));
