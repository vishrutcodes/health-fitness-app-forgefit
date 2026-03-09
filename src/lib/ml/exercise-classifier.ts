/**
 * Exercise Classifier — ML Inference Module
 * 
 * Takes MediaPipe pose landmarks, extracts 12 biomechanical features,
 * and runs them through the trained TensorFlow.js neural network
 * to classify the exercise being performed.
 */

import * as tf from '@tensorflow/tfjs';
import { EXERCISE_CLASSES, FEATURE_NAMES, trainModel } from './train-model';
import type { ExerciseClass } from './train-model';

export type { ExerciseClass };

export interface ClassificationResult {
    exercise: ExerciseClass;
    confidence: number;
    probabilities: Record<ExerciseClass, number>;
    features: Record<string, number>;
}

export interface PoseLandmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
}

// Singleton model instance
let model: tf.Sequential | null = null;
let isTraining = false;

/**
 * Calculate angle between three landmarks (in degrees)
 */
function angle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
    const ba = { x: a.x - b.x, y: a.y - b.y };
    const bc = { x: c.x - b.x, y: c.y - b.y };
    const dot = ba.x * bc.x + ba.y * bc.y;
    const magBA = Math.sqrt(ba.x ** 2 + ba.y ** 2);
    const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2);
    if (magBA === 0 || magBC === 0) return 0;
    const cosAngle = Math.max(-1, Math.min(1, dot / (magBA * magBC)));
    return Math.acos(cosAngle) * (180 / Math.PI);
}

/**
 * Extract 12 biomechanical features from MediaPipe landmarks
 * These MUST match the training data feature order exactly
 */
export function extractFeatures(landmarks: PoseLandmark[]): number[] {
    // Joint angles
    const lKnee = angle(landmarks[23], landmarks[25], landmarks[27]);
    const rKnee = angle(landmarks[24], landmarks[26], landmarks[28]);
    const lElbow = angle(landmarks[11], landmarks[13], landmarks[15]);
    const rElbow = angle(landmarks[12], landmarks[14], landmarks[16]);
    const lHip = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rHip = angle(landmarks[12], landmarks[24], landmarks[26]);
    const lShoulder = angle(landmarks[13], landmarks[11], landmarks[23]);
    const rShoulder = angle(landmarks[14], landmarks[12], landmarks[24]);

    const avgKnee = (lKnee + rKnee) / 2;
    const avgElbow = (lElbow + rElbow) / 2;
    const avgHip = (lHip + rHip) / 2;
    const avgShoulder = (lShoulder + rShoulder) / 2;

    // Torso angle from vertical
    const shoulderMid = { x: (landmarks[11].x + landmarks[12].x) / 2, y: (landmarks[11].y + landmarks[12].y) / 2 };
    const hipMid = { x: (landmarks[23].x + landmarks[24].x) / 2, y: (landmarks[23].y + landmarks[24].y) / 2 };
    const dx = shoulderMid.x - hipMid.x;
    const dy = shoulderMid.y - hipMid.y;
    const torsoAngle = Math.abs(Math.atan2(dx, -dy) * 180 / Math.PI);

    // Hip-knee ratio
    const hipKneeRatio = avgKnee > 0 ? avgHip / avgKnee : 1;

    // Stance width (normalized ankle distance)
    const stanceWidth = Math.abs(landmarks[27].x - landmarks[28].x);

    // Hand height relative to shoulders
    const handY = (landmarks[15].y + landmarks[16].y) / 2;
    const shoulderY = shoulderMid.y;
    const handHeightRel = shoulderY - handY; // positive = hands above shoulders

    // Is horizontal (body lying flat)
    const ankleY = (landmarks[27].y + landmarks[28].y) / 2;
    const shoulderHipDiff = Math.abs(shoulderMid.y - hipMid.y);
    const bodyLength = Math.abs(shoulderMid.y - ankleY);
    const isHorizontal = bodyLength > 0.01 ? 1 - (shoulderHipDiff / bodyLength) : 0;

    // Arm straightness (0=bent, 1=straight)
    const armStraightness = Math.min(1, Math.max(0, (avgElbow - 90) / 90));

    // Wrist below hip
    const hipY = hipMid.y;
    const wristY = (landmarks[15].y + landmarks[16].y) / 2;
    const wristBelowHip = wristY > hipY ? Math.min(1, (wristY - hipY) * 5) : 0;

    // Symmetry (bilateral)
    const kneeAsym = 1 - Math.min(1, Math.abs(lKnee - rKnee) / 30);
    const elbowAsym = 1 - Math.min(1, Math.abs(lElbow - rElbow) / 30);
    const hipAsym = 1 - Math.min(1, Math.abs(lHip - rHip) / 30);
    const symmetry = (kneeAsym + elbowAsym + hipAsym) / 3;

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
    ];
}

/**
 * Get raw (un-normalized) feature values for display
 */
export function extractRawFeatures(landmarks: PoseLandmark[]): Record<string, number> {
    const lKnee = angle(landmarks[23], landmarks[25], landmarks[27]);
    const rKnee = angle(landmarks[24], landmarks[26], landmarks[28]);
    const lElbow = angle(landmarks[11], landmarks[13], landmarks[15]);
    const rElbow = angle(landmarks[12], landmarks[14], landmarks[16]);
    const lHip = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rHip = angle(landmarks[12], landmarks[24], landmarks[26]);
    const lShoulder = angle(landmarks[13], landmarks[11], landmarks[23]);
    const rShoulder = angle(landmarks[14], landmarks[12], landmarks[24]);

    return {
        'Left Knee': Math.round(lKnee),
        'Right Knee': Math.round(rKnee),
        'Left Elbow': Math.round(lElbow),
        'Right Elbow': Math.round(rElbow),
        'Left Hip': Math.round(lHip),
        'Right Hip': Math.round(rHip),
        'Left Shoulder': Math.round(lShoulder),
        'Right Shoulder': Math.round(rShoulder),
    };
}

/**
 * Initialize the model (train if not already trained)
 */
export async function initializeModel(
    onProgress?: (message: string, progress: number) => void
): Promise<void> {
    if (model) return; // Already initialized
    if (isTraining) {
        // Wait for ongoing training
        while (isTraining) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return;
    }

    isTraining = true;
    try {
        onProgress?.('Generating training data...', 10);

        const result = await trainModel((epoch, logs) => {
            const progress = 10 + Math.round((epoch / 50) * 80);
            const acc = logs?.val_acc ? (logs.val_acc as number * 100).toFixed(1) : '?';
            onProgress?.(`Training neural network... Epoch ${epoch + 1}/50 (${acc}% acc)`, progress);
        });

        model = result.model;
        onProgress?.('Model trained successfully!', 100);
        console.log('[MLClassifier] Model initialized and ready.');
    } finally {
        isTraining = false;
    }
}

/**
 * Classify an exercise from pose landmarks using the neural network
 */
export async function classifyExercise(landmarks: PoseLandmark[]): Promise<ClassificationResult> {
    if (!model) {
        throw new Error('Model not initialized. Call initializeModel() first.');
    }

    const features = extractFeatures(landmarks);
    const inputTensor = tf.tensor2d([features]);

    const prediction = model.predict(inputTensor) as tf.Tensor;
    const probabilities = Array.from(prediction.dataSync());

    inputTensor.dispose();
    prediction.dispose();

    // Find top class
    let maxIdx = 0;
    let maxProb = 0;
    for (let i = 0; i < probabilities.length; i++) {
        if (probabilities[i] > maxProb) {
            maxProb = probabilities[i];
            maxIdx = i;
        }
    }

    const exercise = EXERCISE_CLASSES[maxIdx];
    const probs: Record<ExerciseClass, number> = {} as Record<ExerciseClass, number>;
    for (let i = 0; i < EXERCISE_CLASSES.length; i++) {
        probs[EXERCISE_CLASSES[i]] = Math.round(probabilities[i] * 100);
    }

    // Log for debugging
    console.log(`[MLClassifier] ${exercise} (${(maxProb * 100).toFixed(1)}%) | DL:${probs['Deadlift']}% SQ:${probs['Squat']}% BP:${probs['Bench Press']}% NO:${probs['No Exercise']}%`);

    // Build feature display
    const featureDisplay: Record<string, number> = {};
    for (let i = 0; i < FEATURE_NAMES.length; i++) {
        featureDisplay[FEATURE_NAMES[i]] = Number(features[i].toFixed(3));
    }

    return {
        exercise,
        confidence: Math.round(maxProb * 100),
        probabilities: probs,
        features: featureDisplay,
    };
}

/**
 * Generate form analysis for a classified exercise
 */
export function analyzeForm(
    landmarks: PoseLandmark[],
    exercise: ExerciseClass
): { score: number; corrections: string[]; positives: string[] } {
    const corrections: string[] = [];
    const positives: string[] = [];
    let score = 10;

    const lKnee = angle(landmarks[23], landmarks[25], landmarks[27]);
    const rKnee = angle(landmarks[24], landmarks[26], landmarks[28]);
    const lElbow = angle(landmarks[11], landmarks[13], landmarks[15]);
    const rElbow = angle(landmarks[12], landmarks[14], landmarks[16]);
    const avgKnee = (lKnee + rKnee) / 2;
    const avgElbow = (lElbow + rElbow) / 2;
    const kneeAsym = Math.abs(lKnee - rKnee);
    const elbowAsym = Math.abs(lElbow - rElbow);
    const lHip = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rHip = angle(landmarks[12], landmarks[24], landmarks[26]);
    const avgHip = (lHip + rHip) / 2;

    // Torso angle
    const sx = (landmarks[11].x + landmarks[12].x) / 2;
    const sy = (landmarks[11].y + landmarks[12].y) / 2;
    const hx = (landmarks[23].x + landmarks[24].x) / 2;
    const hy = (landmarks[23].y + landmarks[24].y) / 2;
    const torsoAng = Math.abs(Math.atan2(sx - hx, -(sy - hy)) * 180 / Math.PI);

    // Universal symmetry
    if (kneeAsym > 15) { corrections.push('⚠️ Knee asymmetry — one knee bending more. Focus on even weight distribution.'); score -= 1; }
    else { positives.push('✅ Good bilateral knee symmetry.'); }

    if (exercise === 'Deadlift') {
        if (torsoAng > 70) { corrections.push('🔴 Back nearly horizontal — keep chest proud, engage lats.'); score -= 2; }
        else if (torsoAng > 55) { corrections.push('⚠️ Excessive forward lean — brace core harder.'); score -= 1; }
        else { positives.push('✅ Good back angle — spine neutral.'); }
        if (avgElbow < 150) { corrections.push('💪 Arms bending — deadlift arms must stay straight.'); score -= 2; }
        else { positives.push('✅ Arms straight — proper form.'); }
        if (avgHip > 170) { positives.push('✅ Full hip extension at lockout.'); }
        if (avgKnee < 90) { corrections.push('🦵 Knees too bent — push hips back more.'); score -= 1; }
    }

    if (exercise === 'Squat') {
        if (avgKnee > 110) { corrections.push('🦵 Squat too shallow — thighs should reach parallel.'); score -= 2; }
        else if (avgKnee > 95) { corrections.push('🦵 Almost parallel — go a bit deeper.'); score -= 1; }
        else { positives.push('✅ Great squat depth — at or below parallel.'); }
        if (torsoAng > 45) { corrections.push('🔙 Too much forward lean — chest up, core braced.'); score -= 1; }
        else { positives.push('✅ Good upright torso position.'); }
        if (elbowAsym > 15) { corrections.push('⚠️ Uneven arm position — bar may be unbalanced.'); score -= 1; }
    }

    if (exercise === 'Bench Press') {
        if (avgElbow < 70) { positives.push('✅ Great range of motion — full depth.'); }
        else if (avgElbow > 130) { corrections.push('📐 Not deep enough — lower bar to chest.'); score -= 1; }
        else { positives.push('✅ Good pressing depth.'); }
        if (elbowAsym > 20) { corrections.push('⚠️ Uneven press — one arm doing more work.'); score -= 1; }
        else { positives.push('✅ Symmetric pressing — both arms even.'); }
    }

    if (corrections.length === 0 && positives.length < 2) {
        positives.push('✅ Pose detected — body position looks balanced.');
    }

    return { score: Math.max(1, Math.min(10, score)), corrections, positives };
}
