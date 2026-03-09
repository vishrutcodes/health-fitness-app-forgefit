const fs = require('fs');

let content = fs.readFileSync('src/lib/ml/train-model.ts', 'utf8');

// 1. FEATURE_NAMES
content = content.replace(
    /'Hand-to-Hip Dist', 'Shoulder-Hip Lean', 'Hands In Front',\s*'Shin Angle', 'Hand-to-Knee Dist', 'Head Position'/g,
    "'Hand-to-Hip Dist', 'Hip-Knee X', 'Knee-Ankle X',\n    'Hand-to-Knee Dist', 'Hand-to-Ankle Dist', 'Head Position'"
);

// 2. ExerciseProfile interface
content = content.replace(
    /handDistToHip: FeatureRange;\s*shoulderHipKneePos: FeatureRange;\s*handsInFront: FeatureRange;\s*ankleToKneeLean: FeatureRange;\s*handDistToKnee: FeatureRange;\s*headPosition: FeatureRange;/g,
    "handDistToHip: FeatureRange;\n    hipToKneeX: FeatureRange;\n    kneeToAnkleX: FeatureRange;\n    handDistToKnee: FeatureRange;\n    handDistToAnkle: FeatureRange;\n    headPosition: FeatureRange;"
);

// 3. DEADLIFT_PROFILE
content = content.replace(
    /handDistToHip:.+?\n\s+shoulderHipKneePos:.+?\n\s+handsInFront:.+?\n\s+ankleToKneeLean:.+?\n\s+handDistToKnee:.+?\n\s+headPosition:.+?\n/g,
    "handDistToHip: { min: 0.1, max: 0.5, mean: 0.3, std: 0.1 }, // Hands near knees/hips\n    " +
    "hipToKneeX: { min: 0.15, max: 0.5, mean: 0.35, std: 0.1 }, // Hips pushed way back\n    " +
    "kneeToAnkleX: { min: 0.0, max: 0.15, mean: 0.05, std: 0.05 }, // Vertical shins\n    " +
    "handDistToKnee: { min: 0.0, max: 0.25, mean: 0.1, std: 0.05 }, // Hands at knees\n    " +
    "handDistToAnkle: { min: 0.1, max: 0.5, mean: 0.25, std: 0.1 }, // Hands mid shin\n    " +
    "headPosition: { min: 0.3, max: 0.8, mean: 0.55, std: 0.1 }\n"
);

// We need to specifically target each one since the replace above might match globally or wrongly.
// Actually, let's just write exactly the replacements for the training data arrays
content = content.replace(
    /gaussianSample\(profile\.handDistToHip\),\s*gaussianSample\(profile\.shoulderHipKneePos\),\s*gaussianSample\(profile\.handsInFront\),\s*gaussianSample\(profile\.ankleToKneeLean\),\s*gaussianSample\(profile\.handDistToKnee\),\s*gaussianSample\(profile\.headPosition\),/g,
    "gaussianSample(profile.handDistToHip),\n                gaussianSample(profile.hipToKneeX),\n                gaussianSample(profile.kneeToAnkleX),\n                gaussianSample(profile.handDistToKnee),\n                gaussianSample(profile.handDistToAnkle),\n                gaussianSample(profile.headPosition),"
);

fs.writeFileSync('src/lib/ml/train-model.ts', content, 'utf8');

let exerciseContent = fs.readFileSync('src/lib/ml/exercise-classifier.ts', 'utf8');

// Replace the calculation block
const oldCalcStart = `    // 13. Hand-to-Hip Distance (normalized)`;
const newCalc = `    // Euclidean distance helper
    const dist = (p1: {x: number, y: number}, p2: {x: number, y: number}) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    const handMid = { x: (landmarks[15].x + landmarks[16].x) / 2, y: (landmarks[15].y + landmarks[16].y) / 2 };
    const kneeMid = { x: (landmarks[25].x + landmarks[26].x) / 2, y: (landmarks[25].y + landmarks[26].y) / 2 };
    const ankleMid = { x: (landmarks[27].x + landmarks[28].x) / 2, y: (landmarks[27].y + landmarks[28].y) / 2 };
    const shoulderMid = { x: (landmarks[11].x + landmarks[12].x) / 2, y: (landmarks[11].y + landmarks[12].y) / 2 };
    const hipMid = { x: (landmarks[23].x + landmarks[24].x) / 2, y: (landmarks[23].y + landmarks[24].y) / 2 };

    // 13. Hand-to-Hip Distance
    const handDistToHip = Math.min(1, dist(handMid, hipMid));

    // 14. Hip-to-Knee X Displacement (Structural Depth)
    const hipToKneeX = Math.min(1, Math.abs(hipMid.x - kneeMid.x));

    // 15. Knee-to-Ankle X Displacement (Shin lean)
    const kneeToAnkleX = Math.min(1, Math.abs(kneeMid.x - ankleMid.x));

    // 16. Hand-to-Knee Distance
    const handDistToKnee = Math.min(1, dist(handMid, kneeMid));

    // 17. Hand-to-Ankle Distance
    const handDistToAnkle = Math.min(1, dist(handMid, ankleMid));

    // 18. Head Position (relative to shoulders Y) - mostly just posture
    const headY = landmarks[0].y; 
    const headPosition = Math.max(0, Math.min(1, (shoulderMid.y - headY) + 0.5));

    // Normalize features to match training data scaling
    return [
        avgKnee / 180,
        avgElbow / 180,
        avgHip / 180,
        avgShoulder / 180,
        torsoAngle / 90,
        hipKneeRatio,
        stanceWidth * 5,
        handHeightRel + 0.5,
        isHorizontal,
        armStraightness,
        wristBelowHip,
        symmetry,
        handDistToHip,
        hipToKneeX,
        kneeToAnkleX,
        handDistToKnee,
        handDistToAnkle,
        headPosition
    ];`;

const classMatch = exerciseContent.indexOf(oldCalcStart);
const returnMatch = exerciseContent.indexOf('];', classMatch);
if (classMatch !== -1 && returnMatch !== -1) {
    exerciseContent = exerciseContent.substring(0, classMatch) + newCalc + exerciseContent.substring(returnMatch + 2);
}

fs.writeFileSync('src/lib/ml/exercise-classifier.ts', exerciseContent, 'utf8');

