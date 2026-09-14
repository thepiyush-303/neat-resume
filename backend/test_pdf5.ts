import pdfParse from 'pdf-parse';
const fs = require('fs');
console.log('pdfParse type:', typeof pdfParse);
const buf = fs.readFileSync('test_pdf5.ts');
pdfParse(buf).then(res => console.log('Length:', res.text.length));
