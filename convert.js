const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'src', 'templates', 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Replacements
content = content.replace(/\{%\s*if\s+(.*?)\s*%\}/g, '{{#if $1}}');
content = content.replace(/\{%\s*endif\s*%\}/g, '{{/if}}');
content = content.replace(/\{%\s*for\s+(\w+)\s+in\s+(.*?)\s*%\}/g, '{{#each $2 as |$1|}}');
content = content.replace(/\{%\s*endfor\s*%\}/g, '{{/each}}');

// Fixing the 'or Present' fallback syntax for Handlebars
content = content.replace(/\{\{\s*(\w+\.endDate)\s+or\s+'Present'\s*\}\}/g, '{{#if $1}}{{$1}}{{else}}Present{{/if}}');
// Also Handle group['items']
content = content.replace(/group\['items'\]/g, 'group.items');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Conversion successful');
