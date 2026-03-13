const fs = require('fs');

const FILE_PATH = 'src/lib/nutrition-db.ts';
let code = fs.readFileSync(FILE_PATH, 'utf-8');

// 1. We will use a regex to find the LOCAL_NUTRITION_DB object
const startMarker = "export const LOCAL_NUTRITION_DB: Record<string, NutritionFact> = {";
const startIndex = code.indexOf(startMarker);
if (startIndex === -1) {
    console.error("Could not find LOCAL_NUTRITION_DB");
    process.exit(1);
}

// Simple parser to find the end of the object
let braceCount = 0;
let endIndex = -1;
for (let i = startIndex + startMarker.length - 1; i < code.length; i++) {
    if (code[i] === '{') braceCount++;
    else if (code[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
            endIndex = i;
            break;
        }
    }
}

if (endIndex === -1) {
    console.error("Could not find end of object");
    process.exit(1);
}

let dbString = code.substring(startIndex + startMarker.length, endIndex);

// We'll roughly add aliases to existing ones using regex if they don't have it
// Find all id: "...", name: "..."
const entryRegex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)",/g;
let enhancedDbString = dbString;

enhancedDbString = enhancedDbString.replace(entryRegex, (match, id, name) => {
    // If it has aliases already, this naive regex might still match, but we will check later if aliases exist in the block.
    // Let's generate a basic alias from name: remove parentheses and lowercase
    let baseName = name.replace(/\([^)]*\)/g, '').trim().toLowerCase();
    
    return `${match}\n        aliases: ["${baseName}"],`;
});

// Since some had aliases already, we might have duplicate aliases fields. Let's fix that.
// A better way: eval the object! We are in Node!
// But wait, the file has TS types and other exports, so we can't eval the whole file. 
// We can transpile or just parse it.

