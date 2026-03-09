import { useState, useRef, useCallback } from "react";
import { Upload, FolderKanban, Save, Play, Loader2, Image as ImageIcon, Database, BrainCircuit, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ML Imports
import * as tf from "@tensorflow/tfjs";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { extractFeatures, EXERCISE_CLASSES, type ExerciseClass } from "@/lib/ml/exercise-classifier";

interface ProcessingStats {
    total: number;
    success: number;
    failed: number;
    currentFile: string;
}

export default function DatasetTrainer() {
    const [selectedRole, setSelectedRole] = useState<ExerciseClass | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stats, setStats] = useState<ProcessingStats>({ total: 0, success: 0, failed: 0, currentFile: "" });
    const [masterDataset, setMasterDataset] = useState<Record<string, number[][]>>({});

    // Hidden standard elements for ML processing
    const imgRef = useRef<HTMLImageElement>(null);

    const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Filter only images
            const imageFiles = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
            setFiles(imageFiles);
        }
    };

    const processImages = async (targetExercise: ExerciseClass) => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setStats({ total: files.length, success: 0, failed: 0, currentFile: "Initializing MediaPipe..." });

        try {
            // 1. Initialize Vision Model
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    delegate: "GPU",
                },
                runningMode: "IMAGE",
                numPoses: 1,
                minPoseDetectionConfidence: 0.5,
                minPosePresenceConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            const newFeatures: number[][] = [];

            // 2. Loop through all images
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setStats(prev => ({ ...prev, currentFile: `Processing ${i + 1}/${files.length}: ${file.name}` }));

                // Load image to DOM element (required for MediaPipe)
                const imgElement = imgRef.current;
                if (!imgElement) continue;

                await new Promise<void>((resolve, reject) => {
                    imgElement.onload = () => resolve();
                    imgElement.onerror = reject;
                    imgElement.src = URL.createObjectURL(file);
                });

                // Run inference
                try {
                    const result = poseLandmarker.detect(imgElement);
                    if (result.landmarks && result.landmarks.length > 0) {
                        const landmarks = result.landmarks[0];

                        // Extract 18 custom features!
                        const features = extractFeatures(landmarks);
                        newFeatures.push(features);

                        setStats(prev => ({ ...prev, success: prev.success + 1 }));
                    } else {
                        setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
                    }
                } catch (err) {
                    console.error("Inference failed for", file.name, err);
                    setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
                }

                URL.revokeObjectURL(imgElement.src);
            }

            // 3. Save to master memory
            setMasterDataset(prev => {
                const updated = { ...prev };
                if (!updated[targetExercise]) updated[targetExercise] = [];
                updated[targetExercise] = [...updated[targetExercise], ...newFeatures];
                return updated;
            });

            poseLandmarker.close();
            setStats(prev => ({ ...prev, currentFile: "Processing Complete!" }));

        } catch (err) {
            console.error(err);
            alert("Failed to initialize MediaPipe.");
        } finally {
            setIsProcessing(false);
            setFiles([]); // clear queue
        }
    };

    const downloadDataset = () => {
        if (Object.keys(masterDataset).length === 0) return;

        // Export the raw JSON structure
        const dataStr = JSON.stringify(masterDataset, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "real_training_data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-background pt-24 px-4 pb-12">
            {/* Hidden image element used strictly for ML Vision inference */}
            <img ref={imgRef} alt="hidden processor" style={{ display: 'none' }} crossOrigin="anonymous" />

            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold flex items-center gap-3">
                        <Database className="h-8 w-8 text-forge-orange" />
                        AI Dataset Ingestion
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Upload folders of images representing specific exercises. The pipeline will automatically extract the 18 geometric rules from every image using MediaPipe and compile them into a master JSON blob used to train the Neural Network.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* INGESTION PANEL */}
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <FolderKanban className="h-5 w-5 text-forge-orange" />
                                1. Load Images
                            </CardTitle>
                            <CardDescription>Select a target exercise, then select a folder of images belonging to that class.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300">Target Exercise Class:</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {EXERCISE_CLASSES.map((cls: ExerciseClass) => (
                                        <Button
                                            key={cls}
                                            variant={selectedRole === cls ? "default" : "outline"}
                                            className={selectedRole === cls ? "bg-forge-orange hover:bg-forge-orange" : "border-white/10"}
                                            onClick={() => setSelectedRole(cls)}
                                            size="sm"
                                        >
                                            {cls}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300">Image Source (Folder):</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        // @ts-ignore - webkitdirectory is non-standard but heavily supported
                                        webkitdirectory=""
                                        directory=""
                                        multiple
                                        onChange={handleFolderSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        disabled={!selectedRole || isProcessing}
                                    />
                                    <div className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors ${!selectedRole ? "border-white/5 bg-white/5 opacity-50" :
                                        files.length > 0 ? "border-emerald-500/50 bg-emerald-500/10" : "border-forge-orange/30 bg-forge-orange/5 hover:bg-forge-orange/10"
                                        }`}>
                                        <ImageIcon className={`h-8 w-8 mb-2 ${files.length > 0 ? "text-emerald-400" : "text-forge-orange/60"}`} />
                                        {files.length > 0 ? (
                                            <p className="text-emerald-400 font-medium">{files.length} images loaded</p>
                                        ) : (
                                            <>
                                                <p className="text-sm text-slate-300 font-medium">Click to select folder</p>
                                                <p className="text-xs text-slate-500 mt-1">Requires selecting an Exercise Class first</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-linear-to-r from-forge-orange to-forge-orange-light text-white"
                                disabled={files.length === 0 || !selectedRole || isProcessing}
                                onClick={() => selectedRole && processImages(selectedRole)}
                            >
                                {isProcessing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting Features...</>
                                ) : (
                                    <><Play className="mr-2 h-4 w-4" /> Start Batch Processing</>
                                )}
                            </Button>

                            {isProcessing && (
                                <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5 space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Status:</span>
                                        <span className="truncate max-w-[200px]">{stats.currentFile}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-forge-orange transition-all duration-300"
                                            style={{ width: `${((stats.success + stats.failed) / stats.total) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex gap-4 text-xs">
                                        <span className="text-emerald-400">Success: {stats.success}</span>
                                        <span className="text-red-400">Failed: {stats.failed}</span>
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>

                    {/* COMPILED DATASET PANEL */}
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-purple-400" />
                                2. Compiled Dataset
                            </CardTitle>
                            <CardDescription>The master list of extracted features ready for Neural Network Training.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {Object.keys(masterDataset).length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-xl">
                                    <Database className="h-8 w-8 mb-2 opacity-50" />
                                    <p className="text-sm">Dataset empty.</p>
                                    <p className="text-xs">Process a folder to begin compilation.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(masterDataset).map(([cls, features]) => (
                                            <div key={cls} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5">
                                                <span className="text-sm font-medium text-slate-300">{cls}</span>
                                                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                                                    {features.length} Tensors
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        <p className="flex items-center gap-2 text-sm font-medium">
                                            <CheckCircle2 className="h-4 w-4" /> Ready for Export!
                                        </p>
                                        <p className="text-xs mt-1 text-emerald-400/80">
                                            Ensure you have a balanced amount of images for every class before downloading the compiled dataset. Once downloaded, place it in the `public` folder.
                                        </p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                                        onClick={downloadDataset}
                                    >
                                        <Save className="mr-2 h-4 w-4" /> Export `real_training_data.json`
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                        onClick={() => setMasterDataset({})}
                                    >
                                        Clear Master Dataset
                                    </Button>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
