const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../src/lib/nutrition-db.ts');
let code = fs.readFileSync(DB_FILE, 'utf-8');

console.log("Read DB file, length:", code.length);

// 1. Add aliases to existing items
// Regex to find id: "...", name: "..."
// We need to inject aliases if it doesn't have it.
const entryRegex = /(id:\s*"[^"]+",\s*\n\s*name:\s*"([^"]+)",)(?!\s*\n\s*aliases:)/g;

code = code.replace(entryRegex, (match, prefix, nameStr) => {
    // lowercase and remove parentheticals for the generated alias
    const aliasBase = nameStr.replace(/\([^)]*\)/g, '').trim().toLowerCase();
    return `${prefix}\n        aliases: ["${aliasBase}"],`;
});

// 2. Extract batch food strings
let newFoodsStr = "";
for (let i = 1; i <= 4; i++) {
    const batchFile = path.join(__dirname, `../src/lib/foods_batch${i}.ts`);
    const batchCode = fs.readFileSync(batchFile, 'utf-8');
    
    // Find the content inside the outer {}
    const startIndex = batchCode.indexOf('{');
    const endIndex = batchCode.lastIndexOf('}');
    
    if (startIndex !== -1 && endIndex !== -1) {
        let content = batchCode.substring(startIndex + 1, endIndex).trim();
        if (content.endsWith(',')) {
            content = content.slice(0, -1);
        }
        if (i > 1 && newFoodsStr && content) {
            newFoodsStr += ',\n';
        }
        newFoodsStr += content;
    }
}

// 3. Inject into LOCAL_NUTRITION_DB
// Find the end of LOCAL_NUTRITION_DB. 
// It ends right before:
// // ============================================================================
// // UTILITY FUNCTIONS

const endMarkerRegex = /};[\r\n]+\/\/ ============================================================================[\r\n]+\/\/ UTILITY FUNCTIONS/;
if (endMarkerRegex.test(code)) {
    code = code.replace(endMarkerRegex, `,\n\n    // === NEW BATCH ADDITIONS ===\n${newFoodsStr}\n};\n\n// ============================================================================\n// UTILITY FUNCTIONS`);
    console.log("Successfully injected new foods.");
} else {
    console.error("Could not find the end marker for LOCAL_NUTRITION_DB.");
    process.exit(1);
}

// 4. Write back
fs.writeFileSync(DB_FILE, code, 'utf-8');
console.log("Wrote back to nutrition-db.ts!");
