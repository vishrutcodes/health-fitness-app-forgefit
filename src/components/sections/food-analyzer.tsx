"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Scan, Activity, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";

interface FoodItem {
    name: string;
    detectedName: string;
    quantity: number;
    weight_g: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    matched: boolean;
}

interface ScanResult {
    totalMacros: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    items: FoodItem[];
    message?: string;
}

export function FoodAnalyzer() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Start the camera
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" } // Prefer back camera on mobile
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
            setResult(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure you have granted permission.");
        }
    };

    // Stop the camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopCamera();
    }, [stream]);

    // Handle the scanning process
    const handleScan = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsScanning(true);
        setError(null);
        setScanProgress(0);

        // Draw current video frame to canvas
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
            setError("Failed to capture image context.");
            setIsScanning(false);
            return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas image to Base64
        const base64Image = canvas.toDataURL("image/jpeg", 0.8);

        // Simulate scanning progress UI
        const progressInterval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 90) return prev; // Hold at 90% until API responds
                return prev + 10;
            });
        }, 500);

        try {
            // Send to Groq Vision API
            const response = await fetch("/api/ai/food-analyzer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image })
            });

            clearInterval(progressInterval);
            setScanProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to analyze food");
            }

            const data: ScanResult = await response.json();
            setResult(data);
            
            // Stop the camera once we have a result
            stopCamera();

        } catch (err) {
            clearInterval(progressInterval);
            console.error("Scan error:", err);
            setError(err instanceof Error ? err.message : "An error occurred during analysis.");
        } finally {
            setIsScanning(false);
            setTimeout(() => setScanProgress(0), 1000); // Reset progress bar after a moment
        }
    };

    return (
        <section id="food-scanner" className="py-20 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-forge-orange/10 rounded-full blur-[100px] -z-10 translate-y-[-50%]" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 translate-y-[-50%]" />
            
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-12 text-center">
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-forge-orange to-forge-red">
                            God-Mode
                        </span>{" "}
                        Food Scanner
                    </h2>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Point your camera at any meal. Our AI instantly identifies ingredients, estimates volume, and calculates hyper-accurate macros.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Camera Side */}
                    <Card className="bg-card/50 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden flex flex-col">
                        <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-5 w-5 text-forge-orange" />
                                Live View
                            </CardTitle>
                            <CardDescription>Position your food clearly in the frame.</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-0 relative grow bg-black aspect-video flex items-center justify-center">
                            {/* Hidden canvas for capturing the frame */}
                            <canvas ref={canvasRef} className="hidden" />
                            
                            {!stream && !result && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 p-6 text-center z-10">
                                    <Scan className="h-16 w-16 text-zinc-600 mb-4" />
                                    <p className="text-zinc-400 mb-6">Camera is currently inactive.</p>
                                    <Button onClick={startCamera} className="bg-forge-orange hover:bg-forge-red text-white">
                                        Activate Camera
                                    </Button>
                                </div>
                            )}

                            {/* Active Video Feed */}
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted 
                                className={`w-full h-full object-cover ${!stream ? 'hidden' : 'block'}`}
                            />

                            {/* Scanning Overlay UI */}
                            {isScanning && (
                                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-md">
                                    <div className="absolute inset-0 bg-forge-orange/10 transition-opacity duration-300"></div>
                                    <div 
                                        className="h-1 w-full bg-forge-orange absolute top-0 shadow-[0_0_15px_rgba(255,87,34,0.8)] animate-scan-line"
                                        style={{ top: `${Math.max(5, scanProgress)}%` }}
                                    ></div>
                                    {/* Targeting Brackets */}
                                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-forge-orange"></div>
                                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-forge-orange"></div>
                                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-forge-orange"></div>
                                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-forge-orange"></div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="bg-white/5 border-t border-white/5 p-4 flex flex-col gap-4">
                            {error && (
                                <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            
                            {stream && !isScanning && (
                                <Button 
                                    size="lg" 
                                    onClick={handleScan}
                                    className="w-full bg-linear-to-r from-forge-orange to-forge-red text-white uppercase font-bold tracking-wider hover:opacity-90 transition-opacity button-glow font-display"
                                >
                                    <Scan className="mr-2 h-5 w-5" /> Analyze Plate
                                </Button>
                            )}

                            {isScanning && (
                                <div className="w-full space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-bold">
                                        <span className="flex items-center gap-2"><Activity className="h-3 w-3 animate-pulse text-forge-orange" /> Processing</span>
                                        <span>{scanProgress}%</span>
                                    </div>
                                    <Progress value={scanProgress} className="w-full">
                                        <ProgressTrack className="h-2 bg-zinc-800">
                                            <ProgressIndicator 
                                                className="bg-linear-to-r from-forge-orange to-forge-red" 
                                                style={{ width: `${scanProgress}%` }}
                                            />
                                        </ProgressTrack>
                                    </Progress>
                                </div>
                            )}

                            {result && (
                                <Button 
                                    variant="outline"
                                    onClick={() => {
                                        setResult(null);
                                        startCamera();
                                    }}
                                    className="w-full border-zinc-700 hover:bg-zinc-800"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" /> Scan Another Meal
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Results Side */}
                    <Card className="bg-card/50 backdrop-blur-xl border-white/10 shadow-2xl flex flex-col h-full">
                        <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-green-500" />
                                Macro Breakdown
                            </CardTitle>
                            <CardDescription>Zero-tolerance math applied to detected volume.</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-6 grow">
                            {!result ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
                                        <ArrowRight className="h-6 w-6 opacity-50" />
                                    </div>
                                    <p>Scan a plate to see exact nutrition data.</p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    
                                    {/* Total Macros Header */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg bg-zinc-900/80 border border-zinc-800">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Cals</span>
                                            <span className="text-2xl font-black text-white">{result.totalMacros.calories}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Pro</span>
                                            <span className="text-2xl font-black text-forge-orange">{result.totalMacros.protein}g</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Carb</span>
                                            <span className="text-2xl font-black text-blue-400">{result.totalMacros.carbs}g</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Fat</span>
                                            <span className="text-2xl font-black text-orange-400">{result.totalMacros.fats}g</span>
                                        </div>
                                    </div>

                                    {/* Itemized Breakdown List */}
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                            Identified Ingredients
                                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full text-[10px]">{result.items.reduce((sum, i) => sum + (i.quantity || 1), 0)} detected</span>
                                        </h4>
                                        <ScrollArea className="h-[250px] pr-4">
                                            <div className="space-y-3">
                                                {result.items.length === 0 ? (
                                                    <p className="text-sm text-zinc-500 italic p-4 text-center border border-dashed border-zinc-800 rounded-md">
                                                        {result.message || "No ingredients identified."}
                                                    </p>
                                                ) : (
                                                    result.items.map((item, idx) => (
                                                        <div key={idx} className="p-3 rounded-md bg-zinc-900 border border-zinc-800 flex flex-col gap-2">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="font-medium text-white text-sm">{item.quantity > 1 ? `${item.quantity}× ` : ""}{item.name}</p>
                                                                    <p className="text-xs text-zinc-500">Est. Volume: {item.weight_g}g{item.quantity > 1 ? ` (${item.quantity} pieces)` : ""}</p>
                                                                </div>
                                                                {!item.matched && (
                                                                    <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-bold">Unverified</span>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-3 text-xs text-zinc-400">
                                                                <span>{item.calories} kcal</span>
                                                                <span>•</span>
                                                                <span className="text-forge-orange/80">{item.protein}P</span>
                                                                <span className="text-blue-400/80">{item.carbs}C</span>
                                                                <span className="text-orange-400/80">{item.fats}F</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
            
            {/* Custom animation for the scan line */}
            <style jsx global>{`
                @keyframes scan-line {
                    0% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
                .animate-scan-line {
                    transition: top 0.5s ease-out;
                }
            `}</style>
        </section>
    );
}
