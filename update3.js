const fs = require('fs');
let lines = fs.readFileSync('src/lib/ml/train-model.ts', 'utf8').split('\n');

function replaceBlock(profileName, newLines) {
    const idx = lines.findIndex(l => l.includes(`const ${profileName}_PROFILE: ExerciseProfile = {`));
    if (idx !== -1) {
        // Find the index of handDistToHip
        const startIdx = lines.findIndex((l, i) => i > idx && l.includes('handDistToHip:'));
        if (startIdx !== -1) {
            lines.splice(startIdx, 6, ...newLines.map(l => "    " + l));
        }
    }
}

replaceBlock('SQUAT', [
    'handDistToHip: { min: 0.2, max: 0.5, mean: 0.35, std: 0.1 }, // Hands on back',
    'hipToKneeX: { min: 0.0, max: 0.2, mean: 0.1, std: 0.05 }, // Hips drop down not far back',
    'kneeToAnkleX: { min: 0.15, max: 0.5, mean: 0.25, std: 0.1 }, // Knees forward',
    'handDistToKnee: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }, // Hands high',
    'handDistToAnkle: { min: 0.6, max: 1.0, mean: 0.8, std: 0.1 }, // Hands highest',
    'headPosition: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }'
]);

replaceBlock('BENCH', [
    'handDistToHip: { min: 0.3, max: 0.7, mean: 0.5, std: 0.1 },',
    'hipToKneeX: { min: 0.1, max: 0.6, mean: 0.35, std: 0.1 },',
    'kneeToAnkleX: { min: 0.0, max: 0.2, mean: 0.1, std: 0.05 },',
    'handDistToKnee: { min: 0.3, max: 0.8, mean: 0.5, std: 0.1 },',
    'handDistToAnkle: { min: 0.4, max: 0.9, mean: 0.65, std: 0.1 },',
    'headPosition: { min: 0.4, max: 0.6, mean: 0.5, std: 0.05 }'
]);

replaceBlock('PUSHUP', [
    'handDistToHip: { min: 0.2, max: 0.6, mean: 0.4, std: 0.1 },',
    'hipToKneeX: { min: 0.2, max: 0.6, mean: 0.4, std: 0.1 },',
    'kneeToAnkleX: { min: 0.2, max: 0.6, mean: 0.4, std: 0.1 },',
    'handDistToKnee: { min: 0.5, max: 0.9, mean: 0.7, std: 0.1 },',
    'handDistToAnkle: { min: 0.7, max: 1.0, mean: 0.9, std: 0.1 },',
    'headPosition: { min: 0.4, max: 0.7, mean: 0.55, std: 0.05 }'
]);

replaceBlock('DUMBBELL_PRESS', [
    'handDistToHip: { min: 0.4, max: 0.9, mean: 0.65, std: 0.1 }, // Hands over head',
    'hipToKneeX: { min: 0.0, max: 0.3, mean: 0.15, std: 0.1 }, // Seated or standing',
    'kneeToAnkleX: { min: 0.0, max: 0.15, mean: 0.05, std: 0.05 }, // Vertical shins',
    'handDistToKnee: { min: 0.6, max: 1.0, mean: 0.8, std: 0.1 }, // Hands high',
    'handDistToAnkle: { min: 0.7, max: 1.0, mean: 0.95, std: 0.1 }, // Hands highest',
    'headPosition: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }'
]);

replaceBlock('PULLUP', [
    'handDistToHip: { min: 0.4, max: 0.9, mean: 0.7, std: 0.1 },',
    'hipToKneeX: { min: 0.0, max: 0.15, mean: 0.05, std: 0.05 }, // Vertical hanging',
    'kneeToAnkleX: { min: 0.0, max: 0.15, mean: 0.05, std: 0.05 }, // Vertical hanging',
    'handDistToKnee: { min: 0.6, max: 1.0, mean: 0.8, std: 0.1 },',
    'handDistToAnkle: { min: 0.7, max: 1.0, mean: 0.9, std: 0.1 },',
    'headPosition: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }'
]);

replaceBlock('NO_EXERCISE', [
    'handDistToHip: { min: 0.0, max: 0.2, mean: 0.1, std: 0.05 },',
    'hipToKneeX: { min: 0.0, max: 0.1, mean: 0.05, std: 0.05 },',
    'kneeToAnkleX: { min: 0.0, max: 0.1, mean: 0.05, std: 0.05 },',
    'handDistToKnee: { min: 0.3, max: 0.6, mean: 0.45, std: 0.1 },',
    'handDistToAnkle: { min: 0.6, max: 0.9, mean: 0.75, std: 0.1 },',
    'headPosition: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }'
]);

fs.writeFileSync('src/lib/ml/train-model.ts', lines.join('\n'), 'utf8');
