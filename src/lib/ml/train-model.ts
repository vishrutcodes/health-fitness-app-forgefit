/**
 * ML Training Pipeline for Exercise Classification
 * 
 * Architecture: Input(12 features) → Dense(64, ReLU) → Dense(32, ReLU) → Dense(4, Softmax)
 * 
 * This module generates synthetic training data from biomechanical angle ranges
 * for each exercise, trains a neural network, and exports the model weights.
 * 
 * The 12 input features are extracted from MediaPipe pose landmarks:
 * 1. avgKneeAngle      - Average knee flexion (left + right)
 * 2. avgElbowAngle     - Average elbow flexion
 * 3. avgHipAngle       - Average hip flexion
 * 4. avgShoulderAngle  - Average shoulder abduction
 * 5. torsoAngle        - Torso deviation from vertical (degrees)
 * 6. hipKneeRatio      - Hip angle / Knee angle (hip-dominant vs knee-dominant)
 * 7. stanceWidth       - Normalized distance between ankles
 * 8. handHeightRel     - Hand height relative to shoulders
 * 9. isHorizontal      - Body orientation (0=vertical, 1=horizontal)
 * 10. armStraightness  - How straight the arms are (0-1)
 * 11. wristBelowHip    - Whether wrists are below hip level (0/1)
 * 12. symmetry         - Overall bilateral symmetry score (0-1)
 */

import * as tf from '@tensorflow/tfjs';

// Exercise class labels
export const EXERCISE_CLASSES = ['Deadlift', 'Squat', 'Bench Press', 'No Exercise'] as const;
export type ExerciseClass = typeof EXERCISE_CLASSES[number];

// Feature names for debugging/display
export const FEATURE_NAMES = [
    'Knee Angle', 'Elbow Angle', 'Hip Angle', 'Shoulder Angle',
    'Torso Angle', 'Hip-Knee Ratio', 'Stance Width', 'Hand Height',
    'Is Horizontal', 'Arm Straightness', 'Wrist Below Hip', 'Symmetry'
] as const;

/**
 * Biomechanical feature ranges for each exercise.
 * Each range defines [min, max, mean, stddev] for synthetic data generation.
 * Ranges are derived from exercise biomechanics research.
 */
interface FeatureRange {
    min: number;
    max: number;
    mean: number;
    std: number;
}

interface ExerciseProfile {
    kneeAngle: FeatureRange;
    elbowAngle: FeatureRange;
    hipAngle: FeatureRange;
    shoulderAngle: FeatureRange;
    torsoAngle: FeatureRange;
    hipKneeRatio: FeatureRange;
    stanceWidth: FeatureRange;
    handHeight: FeatureRange;
    isHorizontal: FeatureRange;
    armStraightness: FeatureRange;
    wristBelowHip: FeatureRange;
    symmetry: FeatureRange;
}

// Deadlift: Forward lean, straight arms, hands near ground, hip-dominant hinge
const DEADLIFT_PROFILE: ExerciseProfile = {
    kneeAngle: { min: 95, max: 170, mean: 135, std: 20 },   // moderately bent
    elbowAngle: { min: 140, max: 180, mean: 165, std: 10 },   // STRAIGHT arms
    hipAngle: { min: 60, max: 155, mean: 110, std: 25 },   // hinged
    shoulderAngle: { min: 10, max: 50, mean: 25, std: 12 },   // arms hanging
    torsoAngle: { min: 15, max: 75, mean: 42, std: 18 },   // forward lean
    hipKneeRatio: { min: 0.45, max: 0.95, mean: 0.75, std: 0.12 }, // hip-dominant
    stanceWidth: { min: 0.08, max: 0.28, mean: 0.16, std: 0.05 },
    handHeight: { min: -0.35, max: 0.0, mean: -0.15, std: 0.08 }, // below shoulders
    isHorizontal: { min: 0, max: 0.15, mean: 0.05, std: 0.05 },  // NOT horizontal
    armStraightness: { min: 0.7, max: 1.0, mean: 0.9, std: 0.08 },  // arms straight
    wristBelowHip: { min: 0.5, max: 1.0, mean: 0.8, std: 0.15 },  // wrists low
    symmetry: { min: 0.7, max: 1.0, mean: 0.88, std: 0.08 },
};

// Squat: Upright torso, deep knee bend, hip-knee co-flexion, bar on back
const SQUAT_PROFILE: ExerciseProfile = {
    kneeAngle: { min: 55, max: 155, mean: 100, std: 25 },   // DEEP bend
    elbowAngle: { min: 40, max: 150, mean: 85, std: 30 },   // arms holding bar
    hipAngle: { min: 55, max: 155, mean: 100, std: 25 },   // co-flexing with knee
    shoulderAngle: { min: 30, max: 90, mean: 55, std: 18 },   // arms up on bar
    torsoAngle: { min: 3, max: 38, mean: 18, std: 10 },   // UPRIGHT
    hipKneeRatio: { min: 0.85, max: 1.15, mean: 1.0, std: 0.08 }, // balanced
    stanceWidth: { min: 0.10, max: 0.32, mean: 0.20, std: 0.06 },
    handHeight: { min: -0.10, max: 0.15, mean: 0.02, std: 0.06 },
    isHorizontal: { min: 0, max: 0.1, mean: 0.03, std: 0.03 }, // NOT horizontal
    armStraightness: { min: 0.1, max: 0.65, mean: 0.35, std: 0.15 }, // arms bent on bar
    wristBelowHip: { min: 0.0, max: 0.3, mean: 0.1, std: 0.1 },  // wrists up
    symmetry: { min: 0.7, max: 1.0, mean: 0.88, std: 0.08 },
};

// Bench Press: Horizontal body, arms pressing, lying on bench
const BENCH_PROFILE: ExerciseProfile = {
    kneeAngle: { min: 65, max: 140, mean: 95, std: 20 },   // feet on floor
    elbowAngle: { min: 40, max: 175, mean: 110, std: 35 },   // pressing range
    hipAngle: { min: 80, max: 175, mean: 140, std: 25 },   // lying flat
    shoulderAngle: { min: 30, max: 100, mean: 65, std: 20 },   // pressing
    torsoAngle: { min: 0, max: 18, mean: 8, std: 5 },    // flat on bench
    hipKneeRatio: { min: 0.8, max: 2.5, mean: 1.5, std: 0.35 },
    stanceWidth: { min: 0.08, max: 0.25, mean: 0.15, std: 0.05 },
    handHeight: { min: -0.15, max: 0.25, mean: 0.05, std: 0.10 },
    isHorizontal: { min: 0.5, max: 1.0, mean: 0.82, std: 0.12 }, // HORIZONTAL
    armStraightness: { min: 0.1, max: 0.85, mean: 0.45, std: 0.22 },
    wristBelowHip: { min: 0.0, max: 0.2, mean: 0.05, std: 0.06 },
    symmetry: { min: 0.65, max: 1.0, mean: 0.85, std: 0.10 },
};

// No Exercise / Standing idle: everything relaxed
const NO_EXERCISE_PROFILE: ExerciseProfile = {
    kneeAngle: { min: 155, max: 180, mean: 170, std: 6 },    // legs straight
    elbowAngle: { min: 135, max: 180, mean: 162, std: 12 },   // arms relaxed
    hipAngle: { min: 155, max: 180, mean: 172, std: 6 },    // standing tall
    shoulderAngle: { min: 5, max: 30, mean: 15, std: 8 },    // arms at sides
    torsoAngle: { min: 0, max: 12, mean: 5, std: 3 },    // upright
    hipKneeRatio: { min: 0.95, max: 1.05, mean: 1.0, std: 0.02 },
    stanceWidth: { min: 0.05, max: 0.18, mean: 0.10, std: 0.04 },
    handHeight: { min: -0.25, max: 0.0, mean: -0.12, std: 0.06 },
    isHorizontal: { min: 0, max: 0.08, mean: 0.02, std: 0.02 },
    armStraightness: { min: 0.65, max: 1.0, mean: 0.85, std: 0.10 },
    wristBelowHip: { min: 0.3, max: 0.8, mean: 0.5, std: 0.15 },
    symmetry: { min: 0.8, max: 1.0, mean: 0.92, std: 0.05 },
};

const PROFILES = [DEADLIFT_PROFILE, SQUAT_PROFILE, BENCH_PROFILE, NO_EXERCISE_PROFILE];

/**
 * Generate a single synthetic sample from a Gaussian distribution
 * clamped to [min, max]
 */
function gaussianSample(range: FeatureRange): number {
    // Box-Muller transform for gaussian random
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const value = range.mean + z * range.std;
    return Math.max(range.min, Math.min(range.max, value));
}

/**
 * Generate synthetic training data
 */
function generateTrainingData(samplesPerClass: number = 400): { xs: number[][]; ys: number[] } {
    const xs: number[][] = [];
    const ys: number[] = [];

    for (let classIdx = 0; classIdx < PROFILES.length; classIdx++) {
        const profile = PROFILES[classIdx];
        for (let i = 0; i < samplesPerClass; i++) {
            const sample = [
                gaussianSample(profile.kneeAngle) / 180,        // normalize to 0-1
                gaussianSample(profile.elbowAngle) / 180,
                gaussianSample(profile.hipAngle) / 180,
                gaussianSample(profile.shoulderAngle) / 180,
                gaussianSample(profile.torsoAngle) / 90,         // normalize to 0-1 (max ~90°)
                gaussianSample(profile.hipKneeRatio),
                gaussianSample(profile.stanceWidth) * 5,         // scale up for better gradients
                gaussianSample(profile.handHeight) + 0.5,        // shift to 0-1 range
                gaussianSample(profile.isHorizontal),
                gaussianSample(profile.armStraightness),
                gaussianSample(profile.wristBelowHip),
                gaussianSample(profile.symmetry),
            ];
            xs.push(sample);
            ys.push(classIdx);
        }
    }

    return { xs, ys };
}

/**
 * Build the neural network model
 */
function buildModel(): tf.Sequential {
    const model = tf.sequential();

    // Input layer → Hidden layer 1 (64 neurons, ReLU)
    model.add(tf.layers.dense({
        inputShape: [12],
        units: 64,
        activation: 'relu',
        kernelInitializer: 'heNormal',
    }));

    // Dropout for regularization
    model.add(tf.layers.dropout({ rate: 0.2 }));

    // Hidden layer 2 (32 neurons, ReLU)
    model.add(tf.layers.dense({
        units: 32,
        activation: 'relu',
        kernelInitializer: 'heNormal',
    }));

    // Dropout
    model.add(tf.layers.dropout({ rate: 0.15 }));

    // Output layer (4 classes, Softmax)
    model.add(tf.layers.dense({
        units: EXERCISE_CLASSES.length,
        activation: 'softmax',
    }));

    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
}

/**
 * Train the model and return it with training history
 */
export async function trainModel(
    onEpochEnd?: (epoch: number, logs: tf.Logs | undefined) => void
): Promise<{ model: tf.Sequential; history: tf.History }> {
    console.log('[MLTrainer] Generating synthetic training data...');
    const { xs, ys } = generateTrainingData(400);

    // Shuffle data
    const indices = Array.from({ length: xs.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const shuffledXs = indices.map(i => xs[i]);
    const shuffledYs = indices.map(i => ys[i]);

    // Convert to tensors
    const xsTensor = tf.tensor2d(shuffledXs);
    const ysTensor = tf.tensor1d(shuffledYs, 'int32');

    // Split train/validation (85/15)
    const splitIdx = Math.floor(shuffledXs.length * 0.85);
    const xTrain = xsTensor.slice([0, 0], [splitIdx, 12]);
    const yTrain = ysTensor.slice([0], [splitIdx]);
    const xVal = xsTensor.slice([splitIdx, 0], [shuffledXs.length - splitIdx, 12]);
    const yVal = ysTensor.slice([splitIdx], [shuffledYs.length - splitIdx]);

    console.log(`[MLTrainer] Training data: ${splitIdx} train, ${shuffledXs.length - splitIdx} val`);

    // Build and train
    const model = buildModel();

    const history = await model.fit(xTrain, yTrain, {
        epochs: 50,
        batchSize: 32,
        validationData: [xVal, yVal],
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if (epoch % 10 === 0 || epoch === 49) {
                    console.log(`[MLTrainer] Epoch ${epoch + 1}: loss=${logs?.loss?.toFixed(4)}, acc=${logs?.acc?.toFixed(4)}, val_acc=${logs?.val_acc?.toFixed(4)}`);
                }
                onEpochEnd?.(epoch, logs);
            }
        }
    });

    // Cleanup tensors
    xsTensor.dispose();
    ysTensor.dispose();
    xTrain.dispose();
    yTrain.dispose();
    xVal.dispose();
    yVal.dispose();

    const finalAcc = history.history['val_acc']?.slice(-1)[0] as number;
    console.log(`[MLTrainer] Training complete! Final validation accuracy: ${(finalAcc * 100).toFixed(1)}%`);

    return { model, history };
}

/**
 * Extract the model weights as a serializable JSON object
 */
export async function exportModelWeights(model: tf.Sequential): Promise<object[]> {
    const weights: object[] = [];
    for (const layer of model.layers) {
        const layerWeights = layer.getWeights();
        const layerData: object[] = [];
        for (const w of layerWeights) {
            layerData.push({
                shape: w.shape,
                data: Array.from(w.dataSync()),
            });
        }
        weights.push(layerData);
    }
    return weights;
}
