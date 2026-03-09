const fs = require('fs');
let content = fs.readFileSync('src/lib/ml/train-model.ts', 'utf8');

// Squat Profile
content = content.replace(
    /handDistToHip: \{ min: 0\.4, max: 0\.8, mean: 0\.6, std: 0\.1 \}, \/\/ hands high on back, far from hips\n\s+shoulderHipKneePos: \{ min: 0\.0, max: 0\.3, mean: 0\.1, std: 0\.1 \}, \/\/ torso mostly vertical, shoulders stacked over hips\n\s+handsInFront: \{ min: 0\.0, max: 0\.3, mean: 0\.1, std: 0\.1 \}, \/\/ hands behind neck holding barbell\n\s+ankleToKneeLean: \{ min: 0\.2, max: 0\.7, mean: 0\.4, std: 0\.15 \}, \/\/ Knees travel forward substantially\n\s+handDistToKnee: \{ min: 0\.5, max: 0\.9, mean: 0\.7, std: 0\.1 \}, \/\/ Hands high up, nowhere near knees\n\s+headPosition: \{ min: 0\.6, max: 1\.0, mean: 0\.85, std: 0\.1 \}/,
    "handDistToHip: { min: 0.2, max: 0.5, mean: 0.35, std: 0.1 }, // Hands on back\n" +
    "    hipToKneeX: { min: 0.0, max: 0.2, mean: 0.1, std: 0.05 }, // Hips drop down not far back\n" +
    "    kneeToAnkleX: { min: 0.15, max: 0.5, mean: 0.25, std: 0.1 }, // Knees forward\n" +
    "    handDistToKnee: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }, // Hands high\n" +
    "    handDistToAnkle: { min: 0.6, max: 1.0, mean: 0.8, std: 0.1 }, // Hands highest\n" +
    "    headPosition: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }"
);

// Bench Profile
content = content.replace(
    /handDistToHip: \{ min: 0\.3, max: 0\.8, mean: 0\.55, std: 0\.1 \},\n\s+shoulderHipKneePos: \{ min: 0\.7, max: 1\.0, mean: 0\.9, std: 0\.1 \}, \/\/ horizontal, shoulders and hips are parallel to ground\n\s+handsInFront: \{ min: 0\.7, max: 1\.0, mean: 0\.9, std: 0\.1 \}, \/\/ pressing up into space\n\s+ankleToKneeLean: \{ min: 0\.3, max: 0\.8, mean: 0\.5, std: 0\.15 \},\n\s+handDistToKnee: \{ min: 0\.4, max: 0\.9, mean: 0\.6, std: 0\.1 \},\n\s+headPosition: \{ min: 0\.0, max: 0\.3, mean: 0\.1, std: 0\.1 \} \/\/ head resting flat on bench/,
    "handDistToHip: { min: 0.3, max: 0.7, mean: 0.5, std: 0.1 },\n" +
    "    hipToKneeX: { min: 0.1, max: 0.6, mean: 0.35, std: 0.1 },\n" +
    "    kneeToAnkleX: { min: 0.0, max: 0.2, mean: 0.1, std: 0.05 },\n" +
    "    handDistToKnee: { min: 0.3, max: 0.8, mean: 0.5, std: 0.1 },\n" +
    "    handDistToAnkle: { min: 0.4, max: 0.9, mean: 0.65, std: 0.1 },\n" +
    "    headPosition: { min: 0.4, max: 0.6, mean: 0.5, std: 0.05 }"
);

// Pushup Profile
content = content.replace(
    /handDistToHip: \{ min: 0\.3, max: 0\.6, mean: 0\.45, std: 0\.1 \},\n\s+shoulderHipKneePos: \{ min: 0\.7, max: 1\.0, mean: 0\.9, std: 0\.1 \}, \/\/ parallel\n\s+handsInFront: \{ min: 0\.7, max: 1\.0, mean: 0\.85, std: 0\.1 \}, \/\/ pressing floor\n\s+ankleToKneeLean: \{ min: 0\.7, max: 1\.0, mean: 0\.9, std: 0\.1 \}, \/\/ legs straight back\n\s+handDistToKnee: \{ min: 0\.5, max: 0\.9, mean: 0\.7, std: 0\.1 \}, \/\/ hands at shoulders, knees far back\n\s+headPosition: \{ min: 0\.2, max: 0\.6, mean: 0\.4, std: 0\.1 \}/,
    "handDistToHip: { min: 0.2, max: 0.6, mean: 0.4, std: 0.1 },\n" +
    "    hipToKneeX: { min: 0.2, max: 0.6, mean: 0.4, std: 0.1 },\n" +
    "    kneeToAnkleX: { min: 0.2, max: 0.6, mean: 0.4, std: 0.1 },\n" +
    "    handDistToKnee: { min: 0.5, max: 0.9, mean: 0.7, std: 0.1 },\n" +
    "    handDistToAnkle: { min: 0.7, max: 1.0, mean: 0.9, std: 0.1 },\n" +
    "    headPosition: { min: 0.4, max: 0.7, mean: 0.55, std: 0.05 }"
);

// Dumbbell OHP Profile
content = content.replace(
    /handDistToHip: \{ min: 0\.5, max: 0\.95, mean: 0\.75, std: 0\.15 \}, \/\/ pressing directly upward away from hips\n\s+shoulderHipKneePos: \{ min: 0\.0, max: 0\.2, mean: 0\.05, std: 0\.05 \}, \/\/ stacked vertical posture\n\s+handsInFront: \{ min: 0\.2, max: 0\.6, mean: 0\.4, std: 0\.1 \}, \/\/ overhead\n\s+ankleToKneeLean: \{ min: 0\.4, max: 0\.9, mean: 0\.6, std: 0\.15 \},\n\s+handDistToKnee: \{ min: 0\.5, max: 1\.0, mean: 0\.8, std: 0\.15 \}, \/\/ far away overhead\n\s+headPosition: \{ min: 0\.6, max: 1\.0, mean: 0\.85, std: 0\.1 \}/,
    "handDistToHip: { min: 0.4, max: 0.9, mean: 0.65, std: 0.1 }, // Hands over head\n" +
    "    hipToKneeX: { min: 0.0, max: 0.3, mean: 0.15, std: 0.1 }, // Seated or standing\n" +
    "    kneeToAnkleX: { min: 0.0, max: 0.15, mean: 0.05, std: 0.05 }, // Vertical shins\n" +
    "    handDistToKnee: { min: 0.6, max: 1.0, mean: 0.8, std: 0.1 }, // Hands high\n" +
    "    handDistToAnkle: { min: 0.7, max: 1.0, mean: 0.95, std: 0.1 }, // Hands highest\n" +
    "    headPosition: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }"
);

// Pullup Profile
content = content.replace(
    /handDistToHip: \{ min: 0\.6, max: 1\.0, mean: 0\.8, std: 0\.1 \}, \/\/ hanging directly down from bar\n\s+shoulderHipKneePos: \{ min: 0\.0, max: 0\.3, mean: 0\.1, std: 0\.1 \}, \/\/ stacked hanging\n\s+handsInFront: \{ min: 0\.0, max: 0\.5, mean: 0\.2, std: 0\.1 \}, \/\/ pulling overhead\n\s+ankleToKneeLean: \{ min: 0\.7, max: 1\.0, mean: 0\.85, std: 0\.1 \}, \/\/ feet hanging straight\n\s+handDistToKnee: \{ min: 0\.6, max: 1\.0, mean: 0\.85, std: 0\.1 \}, \/\/ hands on bar far from knees\n\s+headPosition: \{ min: 0\.6, max: 1\.0, mean: 0\.8, std: 0\.1 \}/,
    "handDistToHip: { min: 0.4, max: 0.9, mean: 0.7, std: 0.1 },\n" +
    "    hipToKneeX: { min: 0.0, max: 0.15, mean: 0.05, std: 0.05 }, // Vertical hanging\n" +
    "    kneeToAnkleX: { min: 0.0, max: 0.15, mean: 0.05, std: 0.05 }, // Vertical hanging\n" +
    "    handDistToKnee: { min: 0.6, max: 1.0, mean: 0.8, std: 0.1 },\n" +
    "    handDistToAnkle: { min: 0.7, max: 1.0, mean: 0.9, std: 0.1 },\n" +
    "    headPosition: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }"
);

// No Exercise Profile
content = content.replace(
    /handDistToHip: \{ min: 0\.0, max: 0\.2, mean: 0\.1, std: 0\.05 \}, \/\/ hands idle at hips\n\s+shoulderHipKneePos: \{ min: 0\.0, max: 0\.1, mean: 0\.05, std: 0\.03 \}, \/\/ stacked standing perfectly straight\n\s+handsInFront: \{ min: 0\.0, max: 0\.3, mean: 0\.1, std: 0\.1 \}, \/\/ hands at side\n\s+ankleToKneeLean: \{ min: 0\.8, max: 1\.0, mean: 0\.95, std: 0\.05 \}, \/\/ straight up\n\s+handDistToKnee: \{ min: 0\.3, max: 0\.6, mean: 0\.45, std: 0\.1 \}, \/\/ midway down thigh standing\n\s+headPosition: \{ min: 0\.7, max: 1\.0, mean: 0\.9, std: 0\.1 \}/,
    "handDistToHip: { min: 0.0, max: 0.2, mean: 0.1, std: 0.05 },\n" +
    "    hipToKneeX: { min: 0.0, max: 0.1, mean: 0.05, std: 0.05 },\n" +
    "    kneeToAnkleX: { min: 0.0, max: 0.1, mean: 0.05, std: 0.05 },\n" +
    "    handDistToKnee: { min: 0.3, max: 0.6, mean: 0.45, std: 0.1 },\n" +
    "    handDistToAnkle: { min: 0.6, max: 0.9, mean: 0.75, std: 0.1 },\n" +
    "    headPosition: { min: 0.4, max: 0.8, mean: 0.6, std: 0.1 }"
);

fs.writeFileSync('src/lib/ml/train-model.ts', content, 'utf8');
