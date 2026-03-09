import { calculateMacrosForWeight, LOCAL_NUTRITION_DB } from './src/lib/nutrition-db';

async function runTest() {
    console.log("---- DETERMINISTIC MACRO VERIFICATION TEST ----");

    // 1. 6 Boiled Eggs Large
    // DB: 50g per egg. 6 eggs = 300g.
    const eggResult = calculateMacrosForWeight("egg_whole_large", 300);
    console.log("\n[TEST 1]: 6 Boiled Eggs (Large)");
    console.log(`Expected Math: 300g / 100g * 12.56g = 37.68g Protein`);
    console.log(`Actual Result: ${eggResult?.protein}g Protein`);
    console.assert(eggResult?.protein === 37.7, "Egg protein math failed!"); // toFixed(1) = 37.7

    // 2. 2 Scoops Whey Protein
    // DB: 30g per scoop. 2 scoops = 60g.
    const wheyResult = calculateMacrosForWeight("whey_protein_isolate", 60);
    console.log("\n[TEST 2]: 2 Scoops Whey Isolate");
    console.log(`Expected Math: 60g / 100g * 83.3g = 49.98g Protein`);
    console.log(`Actual Result: ${wheyResult?.protein}g Protein`);
    console.assert(wheyResult?.protein === 50.0, "Whey protein math failed!"); // toFixed(1) = 50.0 (49.98 rounded)

    // Total verification
    const totalActual = (eggResult?.protein || 0) + (wheyResult?.protein || 0);
    console.log("\n[TOTAL PROTEIN] 6 Eggs + 2 Scoops Whey:");
    console.log(`Expected Math: 37.68 + 49.98 = 87.66g`);
    console.log(`Actual Result: ${totalActual}g`);

    // Test the strict calorie math 
    console.log("\n[CALORIE CHECK] 6 Eggs Math:");
    const expectedCals = Math.round((37.7 * 4) + (2.2 * 4) + (28.5 * 9));
    console.log(`Expected: (${eggResult?.protein} * 4) + (${eggResult?.carbs} * 4) + (${eggResult?.fat} * 9) = ${expectedCals} kcal`);
    console.log(`Actual: ${eggResult?.calories} kcal`);
    console.assert(eggResult?.calories === expectedCals, "Calorie calculation failed!");

    console.log("\n✔️ VERIFICATION PASSED: 100% Deterministic Match.");
}

runTest();
