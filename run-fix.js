const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
let updatedCount = 0;

const replacements = [
    { from: /\btext-white\b/g, to: 'text-slate-900 dark:text-white' },
    { from: /\btext-gray-300\b/g, to: 'text-slate-600 dark:text-gray-300' },
    { from: /\btext-gray-400\b/g, to: 'text-slate-500 dark:text-gray-400' },
    { from: /\btext-gray-500\b/g, to: 'text-slate-500 dark:text-gray-500' },
    { from: /bg-\[#0a0a0f\]/g, to: 'bg-slate-50 dark:bg-[#0a0a0f]' },
    { from: /bg-\[#111118\]/g, to: 'bg-white dark:bg-[#111118]' },
    { from: /bg-\[#0d0d15\]/g, to: 'bg-slate-100 dark:bg-[#0d0d15]' },
    { from: /bg-\[#080810\]/g, to: 'bg-slate-100 dark:bg-[#080810]' },
    { from: /border-white\/10/g, to: 'border-slate-200 dark:border-white/10' },
    { from: /border-white\/5/g, to: 'border-slate-200 dark:border-white/5' },
    { from: /bg-white\/5/g, to: 'bg-slate-100 dark:bg-white/5' },
    { from: /bg-white\/10/g, to: 'bg-slate-200 dark:bg-white/10' },
    { from: /hover:bg-white\/5/g, to: 'hover:bg-slate-200 dark:hover:bg-white/5' },
    { from: /hover:bg-white\/10/g, to: 'hover:bg-slate-300 dark:hover:bg-white/10' }
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Skip if it's already updated manually like layout or Navbar
    if (file.indexOf('layout.tsx') !== -1 || file.indexOf('ThemeProvider.tsx') !== -1) {
       return;
    }

    replacements.forEach(r => {
        // Prevent double replacing if preceded by dark:
        content = content.replace(new RegExp(`(?<!dark:)${r.from.source}`, 'g'), r.to);
    });
    
    // Clean up any double additions just in case
    content = content.replace(/bg-slate-50 dark:bg-slate-50 dark:bg-\[#0a0a0f\]/g, 'bg-slate-50 dark:bg-[#0a0a0f]');
    content = content.replace(/bg-white dark:bg-white dark:bg-\[#111118\]/g, 'bg-white dark:bg-[#111118]');
    content = content.replace(/bg-slate-100 dark:bg-slate-100 dark:bg-white\/5/g, 'bg-slate-100 dark:bg-white/5');
    content = content.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
    content = content.replace(/text-slate-900 dark:text-white bg-gradient/g, 'text-white bg-gradient'); // For red buttons

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Updated ${updatedCount} files.`);
