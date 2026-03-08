"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Play, Loader2, Brain, Target, AlertTriangle, CheckCircle, Video, RotateCcw, Star, ChevronDown, BarChart3, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ---------- Types ---------- */
interface PoseLandmark { x: number; y: number; z: number; visibility?: number }
interface AnalysisResult {
    exercise: string;
    score: number;
    corrections: string[];
    positives: string[];
    jointAngles: Record<string, number>;
    allScores: ExerciseScore[];
    frameClassifications: string[];
    modelAccuracy: number;
}
interface ExerciseScore { name: string; confidence: number }

/* ---------- Angle helpers ---------- */
function angle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let deg = Math.abs(radians * 180 / Math.PI);
    if (deg > 180) deg = 360 - deg;
    return Math.round(deg);
}

/* ---------- Helper: torso angle from vertical ---------- */
function torsoAngleFromVertical(landmarks: PoseLandmark[]): number {
    const shoulderMid = { x: (landmarks[11].x + landmarks[12].x) / 2, y: (landmarks[11].y + landmarks[12].y) / 2 };
    const hipMid = { x: (landmarks[23].x + landmarks[24].x) / 2, y: (landmarks[23].y + landmarks[24].y) / 2 };
    // Angle of torso line from vertical (0° = upright, 90° = horizontal)
    const dx = shoulderMid.x - hipMid.x;
    const dy = shoulderMid.y - hipMid.y; // negative = shoulder above hip
    return Math.abs(Math.atan2(dx, -dy) * 180 / Math.PI);
}

/* ---------- Helper: stance width (normalized) ---------- */
function stanceWidth(landmarks: PoseLandmark[]): number {
    return Math.abs(landmarks[27].x - landmarks[28].x); // ankle-to-ankle
}

/* ---------- Helper: hand height relative to shoulder ---------- */
function handHeightRelShoulder(landmarks: PoseLandmark[]): number {
    const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
    const handY = (landmarks[15].y + landmarks[16].y) / 2;
    return shoulderY - handY; // positive = hands above shoulders
}

/* ---------- Helper: is body horizontal (e.g. bench, push-up) ---------- */
function isBodyHorizontal(landmarks: PoseLandmark[]): boolean {
    const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
    const hipY = (landmarks[23].y + landmarks[24].y) / 2;
    const ankleY = (landmarks[27].y + landmarks[28].y) / 2;
    return Math.abs(shoulderY - hipY) < 0.1 && Math.abs(hipY - ankleY) < 0.15;
}

/* ---------- Helper: torso incline for bench variants ---------- */
function benchInclineAngle(landmarks: PoseLandmark[]): number {
    const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
    const hipY = (landmarks[23].y + landmarks[24].y) / 2;
    const shoulderX = (landmarks[11].x + landmarks[12].x) / 2;
    const hipX = (landmarks[23].x + landmarks[24].x) / 2;
    const dx = hipX - shoulderX;
    const dy = hipY - shoulderY;
    return Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
}

/* ---------- Multi-signal confidence scoring for each exercise ---------- */
function scoreAllExercises(landmarks: PoseLandmark[]): ExerciseScore[] {
    const lk = angle(landmarks[23], landmarks[25], landmarks[27]);
    const rk = angle(landmarks[24], landmarks[26], landmarks[28]);
    const le = angle(landmarks[11], landmarks[13], landmarks[15]);
    const re = angle(landmarks[12], landmarks[14], landmarks[16]);
    const lh = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rh = angle(landmarks[12], landmarks[24], landmarks[26]);
    const ls = angle(landmarks[13], landmarks[11], landmarks[23]);
    const rs = angle(landmarks[14], landmarks[12], landmarks[24]);

    const avgKnee = (lk + rk) / 2;
    const avgElbow = (le + re) / 2;
    const avgHip = (lh + rh) / 2;
    const avgShoulder = (ls + rs) / 2;
    const kneeAsymmetry = Math.abs(lk - rk);
    const torsoAngle = torsoAngleFromVertical(landmarks);
    const stance = stanceWidth(landmarks);
    const handsAboveShoulder = handHeightRelShoulder(landmarks);
    const horizontal = isBodyHorizontal(landmarks);
    const hipKneeRatio = avgHip / avgKnee; // < 1 = more hip bend than knee

    const scores: ExerciseScore[] = [];

    // ===================== SQUAT =====================
    // Upright torso + deep knee bend + equal hip/knee flexion
    {
        let c = 0;
        if (avgKnee < 130) c += 25;   // knees bent
        if (avgKnee < 100) c += 15;   // deep squat bonus
        if (torsoAngle < 35) c += 20; // upright torso (key differentiator from deadlift)
        if (hipKneeRatio > 0.7 && hipKneeRatio < 1.15) c += 15; // hip and knee bend together
        if (avgHip < 130) c += 10;    // hips flexed
        if (kneeAsymmetry < 15) c += 10; // symmetric = squat, not lunge
        if (avgElbow > 100) c += 5;   // arms not curling
        scores.push({ name: "Squat", confidence: c });
    }

    // ===================== DEADLIFT (Conventional) =====================
    // Forward lean + hip hinge dominant + knees moderately bent
    {
        let c = 0;
        if (torsoAngle > 30) c += 25;   // forward lean (KEY)
        if (torsoAngle > 50) c += 10;   // deep lean bonus
        if (avgHip < 130) c += 15;      // hips flexed
        if (hipKneeRatio < 0.9) c += 20; // hip angle < knee angle (hip hinge)
        if (avgKnee > 100 && avgKnee < 170) c += 10; // some knee bend but not squat-deep
        if (kneeAsymmetry < 15) c += 5;  // symmetric
        if (avgElbow > 140) c += 10;    // arms straight (holding bar)
        if (handsAboveShoulder < -0.05) c += 5; // hands below shoulders
        scores.push({ name: "Deadlift", confidence: c });
    }

    // ===================== ROMANIAN DEADLIFT =====================
    // Very straight knees + deep hip hinge + forward lean
    {
        let c = 0;
        if (avgKnee > 145) c += 25;     // nearly straight knees (KEY vs conventional DL)
        if (torsoAngle > 40) c += 20;   // forward lean
        if (avgHip < 120) c += 20;      // deep hip hinge
        if (hipKneeRatio < 0.75) c += 15; // hip much more bent than knee
        if (avgElbow > 150) c += 10;    // arms hanging straight
        if (kneeAsymmetry < 10) c += 5;
        scores.push({ name: "Romanian Deadlift", confidence: c });
    }

    // ===================== BARBELL ROW =====================
    // Forward lean + elbows bending + hands pulling up
    {
        let c = 0;
        if (torsoAngle > 35) c += 20;   // bent over (like deadlift)
        if (avgElbow < 120) c += 25;    // elbows bent (KEY diff from deadlift)
        if (avgElbow < 90) c += 10;     // deep pull bonus
        if (avgHip < 140) c += 10;      // hips flexed
        if (avgShoulder > 30 && avgShoulder < 100) c += 15; // arms pulling back
        if (avgKnee > 130) c += 10;     // knees relatively straight
        scores.push({ name: "Barbell Row", confidence: c });
    }

    // ===================== OVERHEAD PRESS =====================
    // Hands above head + elbows extending + upright torso
    {
        let c = 0;
        if (handsAboveShoulder > 0.05) c += 30; // hands above shoulders (KEY)
        if (avgShoulder > 140) c += 20;   // arms raised high
        if (avgElbow > 130) c += 15;      // elbows extending/locked
        if (torsoAngle < 20) c += 10;     // upright
        if (avgKnee > 150) c += 5;        // standing
        if (kneeAsymmetry < 10) c += 5;
        scores.push({ name: "Overhead Press", confidence: c });
    }

    // ===================== LATERAL RAISE =====================
    // Arms out to sides + elbows slightly bent + upright + hands at/near shoulder height
    {
        let c = 0;
        if (avgShoulder > 60 && avgShoulder < 140) c += 25; // arms abducted but not overhead
        if (avgElbow > 140) c += 15;    // relatively straight arms
        if (torsoAngle < 15) c += 15;   // very upright (KEY — not pressing)
        if (handsAboveShoulder > -0.1 && handsAboveShoulder < 0.1) c += 20; // hands near shoulder height
        if (avgKnee > 155) c += 5;      // standing straight
        if (avgHip > 160) c += 5;       // no hip bend
        scores.push({ name: "Lateral Raise", confidence: c });
    }

    // ===================== FLAT BENCH PRESS =====================
    // Truly horizontal body + elbows bent + no incline
    {
        let c = 0;
        const incAngle = benchInclineAngle(landmarks);
        if (horizontal) c += 30;
        if (avgElbow < 120) c += 20;
        if (avgElbow < 90) c += 10;
        if (avgShoulder < 100) c += 10;
        // PENALTY if body has incline — not flat bench
        if (incAngle > 20 && incAngle < 70) c -= 25;
        if (!horizontal && avgElbow < 110 && avgShoulder < 80) c += 10;
        scores.push({ name: "Bench Press (Flat)", confidence: Math.max(0, c) });
    }

    // ===================== INCLINE BENCH PRESS =====================
    // Shoulders higher than hips (20-50° incline) + elbows bent + pressing upward
    {
        let c = 0;
        const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
        const hipY = (landmarks[23].y + landmarks[24].y) / 2;
        const incAngle = benchInclineAngle(landmarks);
        if (shoulderY < hipY) c += 15;           // shoulders above hips (KEY)
        if (incAngle > 20 && incAngle < 55) c += 30; // incline angle 20-55° (KEY)
        if (avgElbow < 120) c += 15;
        if (avgElbow < 90) c += 10;
        if (avgShoulder > 50 && avgShoulder < 120) c += 10; // arms angled up
        if (horizontal) c -= 30;                 // PENALTY if truly flat
        scores.push({ name: "Incline Bench Press", confidence: Math.max(0, c) });
    }

    // ===================== DECLINE BENCH PRESS =====================
    // Hips higher than shoulders + elbows bent + pressing
    {
        let c = 0;
        const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
        const hipY = (landmarks[23].y + landmarks[24].y) / 2;
        if (hipY < shoulderY) c += 30;          // hips above shoulders (KEY)
        if (avgElbow < 120) c += 15;
        if (avgElbow < 90) c += 10;
        if (avgShoulder < 90) c += 10;
        if (horizontal) c -= 15;
        scores.push({ name: "Decline Bench Press", confidence: Math.max(0, c) });
    }

    // ===================== PUSH-UP =====================
    // Horizontal body + elbows bent + body straight plank
    {
        let c = 0;
        if (horizontal) c += 25;
        if (avgElbow < 120) c += 15;
        // Push-up: face down, arms under shoulders
        const noseY = landmarks[0].y;
        const hipY = (landmarks[23].y + landmarks[24].y) / 2;
        if (Math.abs(noseY - hipY) < 0.15) c += 15; // body in plank
        if (avgKnee > 150) c += 10;    // legs straight
        if (handsAboveShoulder < 0) c += 10;
        scores.push({ name: "Push-Up", confidence: c });
    }

    // ===================== BICEP CURL =====================
    // Arms by sides + tight elbow flexion + upright + upper arm stationary
    {
        let c = 0;
        if (avgElbow < 80) c += 30;     // tight elbow bend (KEY)
        if (avgShoulder < 35) c += 25;  // arms pinned to sides (KEY diff from shoulder exercises)
        if (torsoAngle < 15) c += 10;   // upright
        if (avgKnee > 155) c += 5;      // standing
        if (avgHip > 160) c += 5;       // no hip bend
        if (handsAboveShoulder < 0) c += 5; // hands below shoulders
        scores.push({ name: "Bicep Curl", confidence: c });
    }

    // ===================== TRICEP PUSHDOWN =====================
    // Arms by sides + elbows extending (opposite of curl) + upright
    {
        let c = 0;
        if (avgElbow > 120 && avgElbow < 175) c += 15;
        if (avgShoulder < 30) c += 25;  // arms by sides
        if (torsoAngle < 15) c += 10;
        if (handsAboveShoulder < -0.15) c += 20; // hands well below shoulders (pushing DOWN)
        if (avgKnee > 155) c += 5;
        scores.push({ name: "Tricep Extension", confidence: c });
    }

    // ===================== LUNGE =====================
    // One knee deep, other extended + large knee asymmetry
    {
        let c = 0;
        if (kneeAsymmetry > 25) c += 35; // one knee bent, other straighter (KEY)
        if (Math.min(lk, rk) < 110) c += 20; // front knee deep
        if (torsoAngle < 25) c += 10;   // upright torso
        if (avgHip < 140) c += 5;
        if (stance > 0.15) c += 10;     // wide split stance
        scores.push({ name: "Lunge", confidence: c });
    }

    // ===================== BULGARIAN SPLIT SQUAT =====================
    // Like lunge but rear foot elevated — extreme knee asymmetry
    {
        let c = 0;
        if (kneeAsymmetry > 40) c += 30; // even more asymmetric than lunge
        if (Math.min(lk, rk) < 100) c += 15;
        const rearAnkleY = Math.min(landmarks[27].y, landmarks[28].y);
        const frontAnkleY = Math.max(landmarks[27].y, landmarks[28].y);
        if (frontAnkleY - rearAnkleY > 0.05) c += 20; // rear foot higher
        if (torsoAngle < 20) c += 10;
        scores.push({ name: "Bulgarian Split Squat", confidence: c });
    }

    // ===================== HIP THRUST =====================
    // Hips high, shoulders on bench (back on surface), knees bent 90°
    {
        let c = 0;
        const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
        const hipY = (landmarks[23].y + landmarks[24].y) / 2;
        if (hipY < shoulderY) c += 25;  // hips higher than shoulders
        if (avgKnee > 70 && avgKnee < 110) c += 20; // ~90° knee bend
        if (avgHip > 140) c += 15;      // hips extended/thrusting up
        scores.push({ name: "Hip Thrust", confidence: c });
    }

    // ===================== FRONT SQUAT =====================
    // Like squat but arms in front (elbows high, hands near shoulders)
    {
        let c = 0;
        if (avgKnee < 130) c += 20;
        if (torsoAngle < 25) c += 15;   // very upright (more than back squat)
        if (avgElbow < 100) c += 15;    // elbows bent holding bar in front
        if (avgShoulder > 70 && avgShoulder < 130) c += 15; // arms forward/up
        if (handsAboveShoulder > -0.05 && handsAboveShoulder < 0.1) c += 10; // hands near shoulder height
        if (avgHip < 130) c += 5;
        scores.push({ name: "Front Squat", confidence: c });
    }

    // ===================== STANDING (idle) =====================
    {
        let c = 0;
        if (avgKnee > 160) c += 30;
        if (avgHip > 160) c += 30;
        if (torsoAngle < 10) c += 15;
        if (avgShoulder < 30) c += 10;
        scores.push({ name: "Standing Position", confidence: c });
    }

    return scores.sort((a, b) => b.confidence - a.confidence);
}

/* ---------- Exercise detection — picks highest confidence ---------- */
function detectExercise(landmarks: PoseLandmark[]): string {
    const scores = scoreAllExercises(landmarks);
    // Require minimum confidence threshold
    if (scores[0].confidence < 30) return "Unknown Exercise";
    return scores[0].name;
}

/* ---------- Form analysis per exercise ---------- */
function analyzeForm(landmarks: PoseLandmark[], exercise: string): AnalysisResult {
    const corrections: string[] = [];
    const positives: string[] = [];
    let score = 10;

    const lk = angle(landmarks[23], landmarks[25], landmarks[27]);
    const rk = angle(landmarks[24], landmarks[26], landmarks[28]);
    const le = angle(landmarks[11], landmarks[13], landmarks[15]);
    const re = angle(landmarks[12], landmarks[14], landmarks[16]);
    const lh = angle(landmarks[11], landmarks[23], landmarks[25]);
    const rh = angle(landmarks[12], landmarks[24], landmarks[26]);
    const ls = angle(landmarks[13], landmarks[11], landmarks[23]);
    const rs = angle(landmarks[14], landmarks[12], landmarks[24]);

    const avgKnee = (lk + rk) / 2;
    const avgElbow = (le + re) / 2;
    const avgHip = (lh + rh) / 2;
    const kneeAsym = Math.abs(lk - rk);
    const elbowAsym = Math.abs(le - re);
    const hipAsym = Math.abs(lh - rh);
    const torsoAng = torsoAngleFromVertical(landmarks);

    const jointAngles: Record<string, number> = {
        "Left Knee": lk, "Right Knee": rk,
        "Left Elbow": le, "Right Elbow": re,
        "Left Hip": lh, "Right Hip": rh,
        "Left Shoulder": ls, "Right Shoulder": rs,
        "Torso Angle": Math.round(torsoAng),
    };

    // ---- Universal symmetry checks ----
    if (!["Lunge", "Bulgarian Split Squat"].includes(exercise)) {
        if (kneeAsym > 15) { corrections.push("⚠️ Knee asymmetry — one knee is bending more. Focus on even weight distribution."); score -= 1; }
        else { positives.push("✅ Good bilateral knee symmetry."); }
    }
    if (hipAsym > 15 && !["Lunge", "Bulgarian Split Squat"].includes(exercise)) {
        corrections.push("⚠️ Hip shift detected — hips not level. Strengthen weaker side."); score -= 1;
    } else if (!["Lunge", "Bulgarian Split Squat"].includes(exercise)) {
        positives.push("✅ Hips are level and balanced.");
    }

    // ---- Exercise-specific form checks ----
    if (exercise === "Squat" || exercise === "Front Squat") {
        if (avgKnee > 100) { corrections.push("🦵 Squat depth is shallow — aim for thighs parallel (knee ~90°). Go lower for full glute/quad activation."); score -= 2; }
        else { positives.push("✅ Great squat depth — at or below parallel."); }

        const lkX = landmarks[25].x, laX = landmarks[27].x;
        const rkX = landmarks[26].x, raX = landmarks[28].x;
        if (lkX < laX - 0.03 || rkX > raX + 0.03) { corrections.push("🚨 Knees caving inward — push knees out over toes. Protects ACL and activates glutes."); score -= 2; }
        else { positives.push("✅ Knees tracking well over toes."); }

        if (torsoAng > 40) { corrections.push("🔙 Excessive forward lean — keep chest up and core braced. Consider front squats for torso strength."); score -= 1; }
        else { positives.push("✅ Good upright torso position."); }

        if (exercise === "Front Squat" && torsoAng > 25) { corrections.push("📐 Front squat requires a very upright torso — elbows high, chest proud."); score -= 1; }
    }

    if (exercise === "Deadlift") {
        if (torsoAng > 70) { corrections.push("🔴 Back nearly horizontal — risk of rounding. Keep chest proud and lats engaged."); score -= 2; }
        else { positives.push("✅ Good back position — spine looks neutral."); }

        if (avgHip < 80) { corrections.push("💡 Hips too low — deadlift hips should be higher than knees. You're squatting the weight."); score -= 1; }
        else { positives.push("✅ Good hip hinge — hips positioned correctly."); }

        if (avgElbow < 150) { corrections.push("💪 Arms should be straight — don't bicep curl the deadlift. Relax your arms and let them hang."); score -= 1; }
        else { positives.push("✅ Arms straight — good lockout position."); }

        if (avgHip > 170) { positives.push("✅ Full hip extension at lockout — excellent finish."); }
    }

    if (exercise === "Romanian Deadlift") {
        if (avgKnee < 140) { corrections.push("🦵 Knees bending too much — RDLs require nearly straight legs. Slight bend only to protect joints."); score -= 2; }
        else { positives.push("✅ Good knee position — legs nearly straight as required."); }

        if (torsoAng < 30) { corrections.push("📐 Not hinging enough — push your hips back further. Feel the stretch in your hamstrings."); score -= 1; }
        else { positives.push("✅ Good hip hinge depth."); }

        if (avgElbow < 150) { corrections.push("💪 Keep arms straight and relaxed — let the weight hang."); score -= 1; }
        else { positives.push("✅ Arms hanging straight — correct position."); }
    }

    if (exercise === "Barbell Row") {
        if (torsoAng < 30) { corrections.push("🔙 Not bent over enough — hinge more at the hips. Torso should be near 45° for proper lat engagement."); score -= 1; }
        else { positives.push("✅ Good torso angle for rowing."); }

        if (avgElbow > 130) { corrections.push("📐 Not pulling hard enough — elbows should pull past your torso. Squeeze shoulder blades together."); score -= 1; }
        else { positives.push("✅ Good elbow pull — full range of motion."); }

        if (elbowAsym > 20) { corrections.push("⚠️ Pulling unevenly — one arm doing more work. Squeeze both shoulder blades equally."); score -= 1; }
    }

    if (exercise === "Overhead Press") {
        if (ls < 160 || rs < 160) { corrections.push("⬆️ Arms not fully locked out overhead — press until bar is directly over mid-foot."); score -= 1; }
        else { positives.push("✅ Full lockout — great overhead position."); }

        if (elbowAsym > 15) { corrections.push("⚠️ Uneven press — one arm higher. Focus on even pressing."); score -= 1; }
        if (torsoAng > 15) { corrections.push("🔙 Excessive lean back — brace core and keep ribs down. Leaning risks lower back strain."); score -= 1; }
        else { positives.push("✅ Solid upright torso — safe pressing position."); }
    }

    if (exercise === "Lateral Raise") {
        if (ls < 60) { corrections.push("⬆️ Arms not raised enough — lift until arms are parallel to the floor for full medial delt activation."); score -= 1; }
        else { positives.push("✅ Good arm height — effective range of motion."); }

        if (avgElbow < 130) { corrections.push("📐 Elbows bending too much — keep arms relatively straight, slight bend only."); score -= 1; }
        else { positives.push("✅ Good arm extension — elbows slightly bent as recommended."); }

        if (torsoAng > 15) { corrections.push("🚨 Swinging/using momentum — stay upright and lift controlled. Reduce weight if needed."); score -= 2; }
        else { positives.push("✅ Controlled movement — no swinging."); }
    }

    if (exercise === "Bench Press (Flat)" || exercise === "Incline Bench Press" || exercise === "Decline Bench Press") {
        if (elbowAsym > 20) { corrections.push("⚠️ Uneven elbow angles — use dumbbells to fix imbalances."); score -= 1; }
        if (avgElbow < 70) { positives.push("✅ Good range — elbows at full depth."); }
        else { corrections.push("📐 Limited ROM — lower bar closer to chest for full pec activation."); score -= 1; }

        if (ls > 90 || rs > 90) { corrections.push("🚨 Elbows flaring too wide — tuck to ~45°. Think 'arrow shape' not 'T shape.'"); score -= 2; }
        else { positives.push("✅ Good elbow tuck — shoulders safe."); }

        if (exercise === "Incline Bench Press" && torsoAng < 15) {
            corrections.push("📐 Bench should be inclined at 30-45° — adjust your bench angle for upper pec focus."); score -= 1;
        }
        if (exercise === "Decline Bench Press" && torsoAng < 10) {
            corrections.push("📐 Body not at decline angle — position hips higher than shoulders on the bench."); score -= 1;
        }
    }

    if (exercise === "Bicep Curl") {
        if (ls > 30 || rs > 30) { corrections.push("💪 Upper arms moving — keep elbows pinned at sides. Swinging uses momentum, not biceps."); score -= 2; }
        else { positives.push("✅ Elbows stationary — good isolation."); }

        if (avgElbow < 40) { positives.push("✅ Full contraction at the top — great squeeze."); }
        if (torsoAng > 10) { corrections.push("🔙 Leaning back to curl — reduce weight and stay upright."); score -= 1; }
    }

    if (exercise === "Lunge" || exercise === "Bulgarian Split Squat") {
        const frontKnee = Math.min(lk, rk);
        if (frontKnee > 100) { corrections.push("🦵 Front knee not deep enough — aim for 90°. Thigh parallel to ground."); score -= 1; }
        else { positives.push("✅ Good depth on front leg."); }

        if (torsoAng > 25) { corrections.push("🔙 Leaning forward — keep torso upright to load the front leg properly."); score -= 1; }
        else { positives.push("✅ Upright torso — good form."); }
    }

    if (exercise === "Hip Thrust") {
        if (avgHip < 150) { corrections.push("⬆️ Hips not thrust up enough — squeeze glutes at the top until hips are fully extended."); score -= 1; }
        else { positives.push("✅ Full hip extension — great glute squeeze."); }

        if (avgKnee < 70 || avgKnee > 110) { corrections.push("📐 Knee angle should be ~90° — adjust foot placement closer or further."); score -= 1; }
        else { positives.push("✅ Good knee angle — optimal for glute activation."); }
    }

    if (exercise === "Tricep Extension") {
        if (ls > 30 || rs > 30) { corrections.push("💪 Upper arms moving — keep elbows pinned. Only the forearms should move."); score -= 2; }
        else { positives.push("✅ Elbows stationary — good isolation."); }

        if (avgElbow < 140) { corrections.push("📐 Not fully extending — lock out at the bottom for full tricep contraction."); score -= 1; }
        else { positives.push("✅ Full extension — great lockout."); }
    }

    if (exercise === "Push-Up") {
        if (avgElbow > 120) { corrections.push("📐 Not going low enough — chest should nearly touch the ground."); score -= 1; }
        else { positives.push("✅ Good depth — chest near the floor."); }

        const hipY = (landmarks[23].y + landmarks[24].y) / 2;
        const shoulderY = (landmarks[11].y + landmarks[12].y) / 2;
        const ankleY = (landmarks[27].y + landmarks[28].y) / 2;
        if (hipY < shoulderY - 0.05) { corrections.push("🚨 Hips sagging — engage core and keep body in a straight plank line."); score -= 2; }
        else if (hipY > ankleY + 0.05) { corrections.push("🔺 Hips piking up — lower your hips into a straight line."); score -= 1; }
        else { positives.push("✅ Good plank position — body in a straight line."); }
    }

    if (corrections.length === 0 && positives.length === 0) {
        positives.push("✅ Pose detected — body position looks balanced.");
        positives.push("✅ No major form issues detected in this frame.");
    }

    score = Math.max(1, Math.min(10, score));
    return { exercise, score, corrections, positives, jointAngles, allScores: [], frameClassifications: [], modelAccuracy: 0 };
}

/* ---------- Skeleton drawing ---------- */
const POSE_CONNECTIONS = [
    [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
    [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
    [25, 27], [26, 28], [27, 29], [28, 30], [29, 31], [30, 32],
];

function drawSkeleton(ctx: CanvasRenderingContext2D, landmarks: PoseLandmark[], w: number, h: number) {
    // Draw connections
    ctx.strokeStyle = "#ff6b2b";
    ctx.lineWidth = 3;
    for (const [i, j] of POSE_CONNECTIONS) {
        const a = landmarks[i];
        const b = landmarks[j];
        if (!a || !b) continue;
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
    }
    // Draw keypoints
    for (const lm of landmarks) {
        ctx.fillStyle = "#ff6b2b";
        ctx.beginPath();
        ctx.arc(lm.x * w, lm.y * h, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

/* ---------- Component ---------- */
export function FormAnalyzer() {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [progress, setProgress] = useState(0);
    const [showDiagnostics, setShowDiagnostics] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVideoSrc(URL.createObjectURL(file));
        setResult(null);
        setProgress(0);
    }, []);

    const reset = useCallback(() => {
        setVideoSrc(null);
        setResult(null);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const analyzeVideo = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        setAnalyzing(true);
        setResult(null);
        setProgress(5);

        try {
            // Dynamic import to avoid SSR issues
            const vision = await import("@mediapipe/tasks-vision");
            setProgress(15);

            const { PoseLandmarker, FilesetResolver } = vision;

            const wasmFiles = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            setProgress(30);

            const poseLandmarker = await PoseLandmarker.createFromOptions(wasmFiles, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    delegate: "GPU",
                },
                runningMode: "VIDEO",
                numPoses: 1,
            });
            setProgress(50);

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d")!;

            // Sample multiple frames across the video
            const duration = video.duration;
            const numSamples = 8;
            const allResults: AnalysisResult[] = [];
            const frameClassifications: string[] = [];
            let lastAllScores: ExerciseScore[] = [];

            for (let i = 0; i < numSamples; i++) {
                const time = (duration * (i + 1)) / (numSamples + 1);
                video.currentTime = time;
                await new Promise<void>((resolve) => {
                    video.onseeked = () => resolve();
                });

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);

                const poseResult = poseLandmarker.detectForVideo(video, performance.now());

                if (poseResult.landmarks && poseResult.landmarks.length > 0) {
                    const landmarks = poseResult.landmarks[0];
                    const exercise = detectExercise(landmarks);
                    const analysis = analyzeForm(landmarks, exercise);
                    allResults.push(analysis);
                    frameClassifications.push(exercise);
                    lastAllScores = scoreAllExercises(landmarks);

                    // Draw final frame skeleton
                    if (i === Math.floor(numSamples / 2)) {
                        ctx.drawImage(video, 0, 0);
                        drawSkeleton(ctx, landmarks, canvas.width, canvas.height);
                    }
                }

                setProgress(50 + Math.round((i / numSamples) * 45));
            }

            poseLandmarker.close();

            // ====== STRICT VALIDATION: Reject non-exercise videos ======
            const poseDetectionRate = allResults.length / numSamples;

            // Gate 1: Not enough frames with a detectable human pose
            if (poseDetectionRate < 0.5) {
                setResult({
                    exercise: "Not an Exercise Video",
                    score: 0,
                    corrections: [
                        "❌ No exercise detected — this doesn't appear to be a workout video.",
                        "📹 Please upload a video where your full body is clearly visible while performing an exercise.",
                        "💡 Ensure good lighting, a clear camera angle, and that at least your torso and limbs are in frame.",
                    ],
                    positives: [],
                    jointAngles: {},
                    allScores: [],
                    frameClassifications: [],
                    modelAccuracy: 0,
                });
                setProgress(100);
                setAnalyzing(false);
                return;
            }

            // Gate 2: Check if most frames are "Standing Position" or "Unknown Exercise" (not exercising)
            const nonExerciseLabels = ["Standing Position", "Unknown Exercise"];
            const nonExerciseCount = frameClassifications.filter(f => nonExerciseLabels.includes(f)).length;
            if (nonExerciseCount > frameClassifications.length * 0.6) {
                setResult({
                    exercise: "No Exercise Detected",
                    score: 0,
                    corrections: [
                        "❌ This video does not show a recognizable exercise movement.",
                        "🏋️ Please upload a video of yourself performing an exercise like squats, deadlifts, bench press, curls, etc.",
                        "📐 The AI needs to see clear joint movement (bending, pressing, pulling) to analyze form.",
                    ],
                    positives: [],
                    jointAngles: {},
                    allScores: [],
                    frameClassifications,
                    modelAccuracy: 0,
                });
                setProgress(100);
                setAnalyzing(false);
                return;
            }

            // Gate 3: Check if confidence is too low (ambiguous/random movement)
            if (lastAllScores.length > 0 && lastAllScores[0].confidence < 35) {
                setResult({
                    exercise: "Unrecognized Movement",
                    score: 0,
                    corrections: [
                        "❌ The model could not confidently identify any exercise in this video.",
                        "🎥 Make sure you're performing a clear, standard exercise movement.",
                        "💡 Tips: Face the camera from the side for best results. Avoid loose clothing that hides joint positions.",
                    ],
                    positives: [],
                    jointAngles: {},
                    allScores: lastAllScores,
                    frameClassifications,
                    modelAccuracy: 0,
                });
                setProgress(100);
                setAnalyzing(false);
                return;
            }

            // Aggregate results — pick most common exercise, merge all feedback
            if (allResults.length > 0) {
                // Most frequent exercise name
                const exerciseCounts: Record<string, number> = {};
                for (const r of allResults) {
                    exerciseCounts[r.exercise] = (exerciseCounts[r.exercise] || 0) + 1;
                }
                const detectedExercise = Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1])[0][0];

                // Merge unique corrections and positives
                const allCorrections = [...new Set(allResults.flatMap(r => r.corrections))];
                const allPositives = [...new Set(allResults.flatMap(r => r.positives))];
                const avgScore = Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length);
                const lastAngles = allResults[allResults.length - 1].jointAngles;

                const matchCount = frameClassifications.filter(f => f === detectedExercise).length;
                const modelAccuracy = Math.round((matchCount / frameClassifications.length) * 100);

                setResult({
                    exercise: detectedExercise,
                    score: avgScore,
                    corrections: allCorrections,
                    positives: allPositives,
                    jointAngles: lastAngles,
                    allScores: lastAllScores,
                    frameClassifications,
                    modelAccuracy,
                });
            } else {
                setResult({
                    exercise: "No Pose Detected",
                    score: 0,
                    corrections: ["❌ Could not detect a human pose in the video. Please ensure the full body is visible and the video is well-lit."],
                    positives: [],
                    jointAngles: {},
                    allScores: [],
                    frameClassifications: [],
                    modelAccuracy: 0,
                });
            }

            setProgress(100);
        } catch (err) {
            console.error("Analysis error:", err);
            setResult({
                exercise: "Analysis Error",
                score: 0,
                corrections: ["❌ An error occurred during analysis. Please try a different video or check your browser compatibility."],
                positives: [],
                jointAngles: {},
                allScores: [],
                frameClassifications: [],
                modelAccuracy: 0,
            });
        }

        setAnalyzing(false);
    }, []);

    // Trigger analysis when video is loaded
    const handleVideoLoaded = useCallback(() => {
        if (videoRef.current) {
            const canvas = canvasRef.current!;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
        }
    }, []);

    const scoreColor = result ? (result.score >= 8 ? "text-emerald-400" : result.score >= 5 ? "text-yellow-400" : "text-red-400") : "";
    const scoreBg = result ? (result.score >= 8 ? "from-emerald-500/20 to-emerald-500/5" : result.score >= 5 ? "from-yellow-500/20 to-yellow-500/5" : "from-red-500/20 to-red-500/5") : "";

    return (
        <section id="form-analyzer" className="relative py-24 px-4">
            <div className="mx-auto max-w-5xl">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-4 py-1.5 text-sm text-forge-orange-light">
                        <Brain className="h-4 w-4" />
                        ML-Powered Analysis
                    </div>
                    <h2 className="text-4xl font-bold text-white">AI Form Analyzer</h2>
                    <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
                        Upload a video of your exercise and our ML model will identify the movement, analyze your form, and provide real-time corrections — like having a personal trainer in your pocket.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left: Video Upload & Preview */}
                        <Card className="glass-card border-forge-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Video className="h-5 w-5 text-forge-orange" />
                                    Video Input
                                </h3>

                                {!videoSrc ? (
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-forge-border rounded-xl cursor-pointer hover:border-forge-orange/50 transition-colors bg-slate-900/30">
                                        <Upload className="h-10 w-10 text-slate-500 mb-3" />
                                        <span className="text-sm text-slate-400 font-medium">Click to upload exercise video</span>
                                        <span className="text-xs text-slate-600 mt-1">MP4, MOV, WebM — max 50MB</span>
                                        <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} />
                                    </label>
                                ) : (
                                    <div className="relative">
                                        <video
                                            ref={videoRef}
                                            src={videoSrc}
                                            className="w-full rounded-xl bg-black"
                                            controls
                                            onLoadedMetadata={handleVideoLoaded}
                                        />
                                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-xl pointer-events-none" style={{ display: result ? "block" : "none" }} />
                                    </div>
                                )}

                                {videoSrc && (
                                    <div className="flex gap-3 mt-4">
                                        <Button
                                            onClick={analyzeVideo}
                                            disabled={analyzing}
                                            className="flex-1 bg-linear-to-r from-forge-orange to-forge-orange-light text-white font-semibold border-0 shadow-lg shadow-forge-orange/25"
                                        >
                                            {analyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Play className="h-4 w-4 mr-2" />Analyze Form</>}
                                        </Button>
                                        <Button onClick={reset} variant="outline" className="border-forge-border text-slate-300 hover:text-white">
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                {analyzing && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <span>Processing...</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <motion.div
                                                className="bg-linear-to-r from-forge-orange to-forge-orange-light h-2 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Right: Analysis Results */}
                        <Card className="glass-card border-forge-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-forge-orange" />
                                    Analysis Results
                                </h3>

                                {!result && !analyzing && (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <Brain className="h-12 w-12 text-slate-600 mb-3" />
                                        <p className="text-slate-500 text-sm">Upload a video and click &quot;Analyze Form&quot; to get AI-powered form analysis.</p>
                                        <p className="text-slate-600 text-xs mt-2">Powered by MediaPipe Pose Detection</p>
                                    </div>
                                )}

                                {analyzing && !result && (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <Loader2 className="h-10 w-10 text-forge-orange animate-spin mb-3" />
                                        <p className="text-slate-400 text-sm">Running ML pose detection...</p>
                                        <p className="text-slate-600 text-xs mt-1">Sampling frames and analyzing joint angles</p>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {result && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                            {/* Exercise + Score */}
                                            <div className={`flex items-center justify-between p-4 rounded-xl bg-linear-to-r ${scoreBg}`}>
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Detected Exercise</p>
                                                    <p className="text-xl font-bold text-white">{result.exercise}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Form Score</p>
                                                    <p className={`text-4xl font-black ${scoreColor}`}>{result.score}<span className="text-lg text-slate-500">/10</span></p>
                                                </div>
                                            </div>

                                            {/* Star rating */}
                                            <div className="flex justify-center gap-1">
                                                {[...Array(10)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < result.score ? "text-forge-orange fill-forge-orange" : "text-slate-700"}`} />
                                                ))}
                                            </div>

                                            {/* Positives */}
                                            {result.positives.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1.5"><CheckCircle className="h-4 w-4" />What You&apos;re Doing Right</p>
                                                    <div className="space-y-1.5">
                                                        {result.positives.map((p, i) => (
                                                            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="text-sm text-slate-300">{p}</motion.p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Corrections */}
                                            {result.corrections.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" />Form Corrections</p>
                                                    <div className="space-y-1.5">
                                                        {result.corrections.map((c, i) => (
                                                            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="text-sm text-slate-300">{c}</motion.p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Joint Angles */}
                                            <div>
                                                <p className="text-sm font-semibold text-slate-400 mb-2">Joint Angles (degrees)</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Object.entries(result.jointAngles).map(([joint, deg]) => (
                                                        <div key={joint} className="flex justify-between px-3 py-1.5 rounded-lg bg-slate-900/50 text-xs">
                                                            <span className="text-slate-400">{joint}</span>
                                                            <span className="text-white font-mono font-semibold">{deg}°</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* === Model Diagnostics Toggle === */}
                                            <button
                                                onClick={() => setShowDiagnostics(!showDiagnostics)}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/60 border border-forge-border hover:border-forge-orange/40 transition-colors text-sm"
                                            >
                                                <span className="flex items-center gap-2 text-slate-300 font-semibold">
                                                    <Activity className="h-4 w-4 text-forge-orange" />
                                                    🔬 Model Diagnostics
                                                </span>
                                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${showDiagnostics ? "rotate-180" : ""}`} />
                                            </button>

                                            <AnimatePresence>
                                                {showDiagnostics && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-5 overflow-hidden"
                                                    >
                                                        {/* --- Model Accuracy Gauge --- */}
                                                        <div className="p-4 rounded-xl bg-slate-900/60 border border-forge-border">
                                                            <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                                <Target className="h-4 w-4 text-forge-orange" />
                                                                Classification Consistency
                                                            </p>
                                                            <div className="flex items-center gap-6">
                                                                <div className="relative w-24 h-24 shrink-0">
                                                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                                                        <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="8" fill="none" />
                                                                        <circle
                                                                            cx="50" cy="50" r="42"
                                                                            stroke={result.modelAccuracy >= 85 ? "#34d399" : result.modelAccuracy >= 60 ? "#fbbf24" : "#f87171"}
                                                                            strokeWidth="8" fill="none"
                                                                            strokeDasharray={`${result.modelAccuracy * 2.64} 264`}
                                                                            strokeLinecap="round"
                                                                        />
                                                                    </svg>
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <span className={`text-2xl font-black ${result.modelAccuracy >= 85 ? "text-emerald-400" : result.modelAccuracy >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                                                                            {result.modelAccuracy}%
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs text-slate-500 leading-relaxed">
                                                                    <p>Across <span className="text-white font-semibold">{result.frameClassifications.length}</span> sampled frames,</p>
                                                                    <p><span className="text-white font-semibold">{result.frameClassifications.filter(f => f === result.exercise).length}</span> frames identified as <span className="text-forge-orange font-semibold">{result.exercise}</span>.</p>
                                                                    <p className="mt-1">{result.modelAccuracy >= 85 ? "✅ High confidence — consistent detection." : result.modelAccuracy >= 60 ? "⚠️ Moderate — some frames show different exercises." : "🔴 Low consistency — model may be uncertain."}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* --- Confidence Predictions Bar Chart --- */}
                                                        {result.allScores.length > 0 && (
                                                            <div className="p-4 rounded-xl bg-slate-900/60 border border-forge-border">
                                                                <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                                    <BarChart3 className="h-4 w-4 text-forge-orange" />
                                                                    Confidence Predictions
                                                                </p>
                                                                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                                                    {result.allScores.filter(s => s.confidence > 0).map((s) => {
                                                                        const maxConf = Math.max(...result.allScores.map(x => x.confidence), 1);
                                                                        const pct = Math.round((s.confidence / maxConf) * 100);
                                                                        const isDetected = s.name === result.exercise;
                                                                        return (
                                                                            <div key={s.name} className="flex items-center gap-2 text-xs">
                                                                                <span className={`w-36 truncate text-right ${isDetected ? "text-forge-orange font-bold" : "text-slate-500"}`}>{s.name}</span>
                                                                                <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                                                                                    <motion.div
                                                                                        initial={{ width: 0 }}
                                                                                        animate={{ width: `${pct}%` }}
                                                                                        transition={{ duration: 0.5, delay: 0.1 }}
                                                                                        className={`h-full rounded-full ${isDetected ? "bg-linear-to-r from-forge-orange to-forge-orange-light" : "bg-slate-600"}`}
                                                                                    />
                                                                                </div>
                                                                                <span className={`w-8 text-right font-mono ${isDetected ? "text-forge-orange font-bold" : "text-slate-500"}`}>{s.confidence}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* --- Confusion Matrix --- */}
                                                        {result.frameClassifications.length > 0 && (
                                                            <div className="p-4 rounded-xl bg-slate-900/60 border border-forge-border">
                                                                <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                                                    <Brain className="h-4 w-4 text-forge-orange" />
                                                                    Frame-by-Frame Classification
                                                                </p>
                                                                <div className="space-y-1.5">
                                                                    {result.frameClassifications.map((cls, i) => {
                                                                        const isMatch = cls === result.exercise;
                                                                        return (
                                                                            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${isMatch ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
                                                                                <span className="text-slate-500 font-mono w-16">Frame {i + 1}</span>
                                                                                <span className={`font-semibold ${isMatch ? "text-emerald-400" : "text-amber-400"}`}>{cls}</span>
                                                                                <span className="ml-auto">{isMatch ? "✅" : "⚠️"}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Supported exercises info */}
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 text-center">
                        <p className="text-sm text-slate-500 mb-3">Exercises the AI can detect and analyze:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {["Squat", "Deadlift", "Romanian Deadlift", "Bench Press (Flat)", "Incline Bench Press", "Decline Bench Press", "Overhead Press", "Barbell Row", "Bicep Curl", "Lunge", "Lateral Raise", "Push-Up", "Hip Thrust", "Front Squat", "Bulgarian Split Squat", "Tricep Extension"].map(ex => (
                                <Badge key={ex} className="bg-slate-800/50 text-slate-400 border-forge-border hover:text-forge-orange transition-colors">{ex}</Badge>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
