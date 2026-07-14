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
    { from: /\bbg-\[#0a0a0f\]\b/g, to: 'bg-slate-50 dark:bg-[#0a0a0f]' },
    { from: /\bbg-\[#111118\]\b/g, to: 'bg-white dark:bg-[#111118]' },
    { from: /\bbg-\[#0d0d15\]\b/g, to: 'bg-slate-100 dark:bg-[#0d0d15]' },
    { from: /\bbg-\[#080810\]\b/g, to: 'bg-slate-100 dark:bg-[#080810]' },
    { from: /\bborder-white\/10\b/g, to: 'border-slate-200 dark:border-white/10' },
    { from: /\bborder-white\/5\b/g, to: 'border-slate-200 dark:border-white/5' },
    { from: /\bbg-white\/5\b/g, to: 'bg-slate-100 dark:bg-white/5' },
    { from: /\bbg-white\/10\b/g, to: 'bg-slate-200 dark:bg-white/10' },
    { from: /\bhover:bg-white\/5\b/g, to: 'hover:bg-slate-200 dark:hover:bg-white/5' },
    { from: /\bhover:bg-white\/10\b/g, to: 'hover:bg-slate-300 dark:hover:bg-white/10' }
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Check if the file already has dark: classes to avoid double replacing
    if (content.includes('dark:text-white') && file.indexOf('layout.tsx') === -1 && file.indexOf('Navbar.tsx') === -1) {
       // skip if it looks already updated, except layout/navbar which we did manually
       return;
    }

    replacements.forEach(r => {
        // Prevent double replacing if script is run multiple times
        // We use a small hack by temporarily replacing and checking
        let temp = content.replace(r.from, r.to);
        // if r.to already existed, it might have created dark:text-slate-900 dark:text-white
        temp = temp.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white'); // just in case
        
        // Actually, since we check for \b (word boundary) and text-white is inside dark:text-white, it might match.
        // It's safer to just do a smart regex replacement that avoids matching if preceded by dark:
        content = content.replace(new RegExp(`(?<!dark:)${r.from.source}`, 'g'), r.to);
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Updated ${updatedCount} files.`);
