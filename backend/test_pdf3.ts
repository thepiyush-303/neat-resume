import { PDFParse } from 'pdf-parse';
const fs = require('fs');
const buf = fs.readFileSync('test_pdf3.ts');
console.log('PDFParse is:', typeof PDFParse);
try {
  const result = PDFParse(buf);
  console.log('Success, returned type:', typeof result, result instanceof Promise ? 'promise' : '');
} catch(e) {
  console.log('Error:', e.message);
}
