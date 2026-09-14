import pdfParse from 'pdf-parse';
console.log('pdfParse is:', typeof pdfParse);
console.log('pdfParse default is:', typeof (pdfParse as any).default);
console.log('Keys:', Object.keys(pdfParse));

const req = require('pdf-parse');
console.log('req is:', typeof req);
console.log('req Keys:', Object.keys(req));
