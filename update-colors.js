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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Replace indigo with red, violet with rose
    // Example: text-indigo-400 -> text-red-400
    // bg-indigo-500/10 -> bg-red-500/10
    // from-indigo-500 to-violet-600 -> from-red-500 to-rose-600
    
    content = content.replace(/indigo-/g, 'red-');
    content = content.replace(/violet-/g, 'rose-');

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Updated ${updatedCount} files.`);
