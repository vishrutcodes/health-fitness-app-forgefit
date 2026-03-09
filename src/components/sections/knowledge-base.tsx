"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, TrendingUp, Dumbbell, Pill, Award, ChevronDown, Heart, Shield, Activity, Scale, Zap, Flame, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GuideSection {
    type: "paragraph" | "bullet" | "header" | "quote";
    text: string;
    emoji?: string;
}

interface Guide {
    title: string;
    desc: string;
    icon: any;
    color: string;
    content: GuideSection[];
}

const guides: Guide[] = [
    {
        title: "Bulking Guide (Lean Mass Gain)",
        desc: "Optimizing diet and training for maximum muscle growth without excess fat.",
        icon: TrendingUp,
        color: "text-emerald-400",
        content: [
            { type: "paragraph", text: "The concept of 'bulking' is arguably the most misunderstood phase in bodybuilding and general fitness. A true bulk is a calculated, systematic process of providing your body with just enough excess energy and targeted physical stimulus to mandate the synthesis of new muscle tissue." },
            { type: "header", text: "The Thermodynamic Reality" },
            { type: "paragraph", text: "To construct new muscle tissue, your body requires energy—specifically, a caloric surplus above your Total Daily Energy Expenditure (TDEE). However, the human body can only synthesize a finite amount of muscle tissue per month (roughly 1 to 2 pounds for a natural male beginner, and far less for advanced lifters or females). Therefore, consuming a massive 1,000-calorie surplus (a 'dirty bulk') does not force the body to build muscle faster; it merely forces it to store the excess energy as adipose tissue (fat). A lean bulk requires a meticulous surplus of only 200 to 400 calories per day." },
            { type: "header", text: "Macronutrient Orchestration" },
            { type: "bullet", emoji: "🥩", text: "Protein The Architect: You absolutely must consume 1.6 to 2.2 grams of high-quality protein per kilogram of body weight daily. Without amino acids, your body cannot repair micro-tears in the muscle fibers caused by heavy lifting." },
            { type: "bullet", emoji: "🍚", text: "Carbohydrates The Fuel: Carbs are notoriously demonized, but during a bulk, they are highly anabolic. They restore depleted muscle glycogen, allow you to train with crushing intensity, and spike insulin—a hormone that halts muscle breakdown and shuttles nutrients into cells." },
            { type: "bullet", emoji: "🥑", text: "Fats The Regulators: Dietary fats (aim for 0.8g–1g per kg) are indispensable for hormone production, particularly testosterone, which is the primary driver of muscle hypertrophy." },
            { type: "header", text: "The Silent Variable: Sleep" },
            { type: "paragraph", text: "You do not grow in the gym; the gym is where you break tissue down. You grow in your bed. During deep, slow-wave sleep, your pituitary gland releases the vast majority of its daily Human Growth Hormone (HGH). Chronic sleep deprivation (less than 7 hours) has been shown in clinical trials to reduce testosterone by 10-15% and radically impair insulin sensitivity, meaning your surplus calories are more likely to be stored as fat rather than utilized for muscle synthesis." },
            { type: "quote", text: "A successful bulk is 16+ weeks of grueling consistency, meticulous caloric tracking, and progressive tension. There are no shortcuts to raw muscle mass." }
        ]
    },
    {
        title: "Fat Loss Guide (Sustainable Cutting)",
        desc: "Losing body fat while preserving hard-earned muscle mass and maintaining sanity.",
        icon: Award,
        color: "text-red-400",
        content: [
            { type: "paragraph", text: "Fat loss is mathematically simple but physiologically complex. The fitness industry thrives on selling complicated diets—Keto, Paleo, Carnivore, Intermittent Fasting—but every single one of these diets 'works' through the exact same mechanism: the caloric deficit. The unbending laws of thermodynamics dictate that you must consume less energy than your body expends to force it to utilize stored adipose tissue (fat) for fuel." },
            { type: "header", text: "The Great Muscle Preservation Dilemma" },
            { type: "paragraph", text: "When you enter a caloric deficit, your body is in an energy crisis. It looks for tissues to break down for fuel. Muscle tissue is metabolically expensive to maintain, meaning the body is highly eager to burn it away alongside fat. Preserving your muscle while stripping away fat requires three non-negotiable pillars." },
            { type: "bullet", emoji: "🥗", text: "Elevated Protein Intake: You must increase your protein intake during a cut to 2.0–2.4g per kg of body weight. The heightened protein provides a continuous stream of amino acids into the bloodstream, acting as a direct signal to the body to spare existing muscle tissue." },
            { type: "bullet", emoji: "🏋️", text: "High-Intensity Resistance Training: The biggest mistake trainees make is switching to 'light weights and high reps' to burn more calories during a cut. This removes the primary mechanical tension signal that tells your nervous system, 'We still need this muscle to survive!' Keep lifting heavy. You may reduce your total sets (volume) by 20-30% due to fatigue, but the weight on the bar (intensity) must remain high." },
            { type: "header", text: "Metabolic Adaptation & NEAT" },
            { type: "paragraph", text: "As you lose weight, your Total Daily Energy Expenditure (TDEE) decreases because a smaller body requires fewer calories to exist. Furthermore, your subconscious brain will reduce your non-exercise activity thermogenesis (NEAT)—meaning you will fidget less, blink less, and sit more heavily. NEAT accounts for up to 30% of your daily burn. This is why tracking daily steps (aiming for 10,000+) is arguably more important for fat loss than a 45-minute gym session. If fat loss stalls completely for 2-3 weeks, you must either decrease food by 100-200 calories or increase daily movement." },
            { type: "quote", text: "Fat loss is not a sprint; it is a war of attrition. Crash dieting leads to metabolic crash and binge eating. Target a loss of 0.5% to 1% of your total body weight per week for permanent, sustainable results." }
        ]
    },
    {
        title: "Progressive Overload Mastery",
        desc: "The fundamental law of making continuous progress in the gym.",
        icon: Activity,
        color: "text-blue-400",
        content: [
            { type: "paragraph", text: "Progressive overload is the undisputed king of strength and hypertrophy training. It dictates that the human body will only adapt to stressors that are unaccustomed. If you go to the gym and lift the same 135 lbs on the bench press for 3 sets of 10 reps every single week for a year, your chest will look exactly the same in 365 days as it does today. The body has already adapted to that specific stimulus and has absolutely zero biological mandate to invest metabolic energy into building more muscle." },
            { type: "header", text: "The Dimensions of Overload" },
            { type: "paragraph", text: "Most people erroneously believe that the only way to progressively overload is to add more weight to the bar. While load progression is vital, it is only one variable. If you try to add 5 lbs to your bench press every week, you will inevitably hit a plateau and injure yourself. There are multiple dimensions to overload that you must utilize:" },
            { type: "bullet", emoji: "⚖️", text: "Volume (Reps & Sets): Lifting 135 lbs for 11 reps this week instead of 10 reps last week." },
            { type: "bullet", emoji: "⏱️", text: "Density (Rest Periods): Lifting the exact same weight for the exact same reps, but decreasing your rest time from 90 seconds to 60 seconds." },
            { type: "bullet", emoji: "🎯", text: "Execution (Form & Control): Lifting the same weight but eliminating momentum, pausing at the bottom of the movement, and controlling the eccentric (lowering) phase for 3 seconds instead of simply dropping the weight." },
            { type: "header", text: "The Double Progression Model" },
            { type: "paragraph", text: "The most effective system for natural lifters is the Double Progression method. You select a specific rep range target, for example, 8 to 12 reps. You choose a weight that allows you to cleanly hit 8 reps. You stay at that exact weight until, over weeks or months, you are strong enough to hit 12 perfect reps with it. Only once you hit the top of the rep range (12) do you increase the weight (usually by 5 lbs). The heavier weight will knock you back down to 8 reps, and the cycle begins anew. This ensures you milk every single ounce of progression out of a specific weight before exposing your joints to heavier loads." },
            { type: "quote", text: "You cannot manage what you do not measure. A logbook—whether physical or an app—is mandatory. Without tracking your lifts, progressive overload is just guesswork." }
        ]
    },
    {
        title: "Demystifying Macros & Timing",
        desc: "Understanding what actually matters when it comes to the food you eat.",
        icon: Flame,
        color: "text-orange-400",
        content: [
            { type: "paragraph", text: "The landscape of fitness nutrition is cluttered with an overwhelming amount of misinformation. Major supplement companies and fitness influencers have created a culture of extreme anxiety around when you eat and exactly what you eat, specifically designed to sell you solutions. To understand nutrition, you must look at the hierarchy of nutritional importance." },
            { type: "header", text: "The Nutritional Hierarchy" },
            { type: "paragraph", text: "Imagine nutrition as a pyramid. At the foundational base is Total Energy Balance (calories in vs. calories out). This single metric determines whether your total body mass goes up or down. Nothing else matters if this base is incorrect." },
            { type: "paragraph", text: "The second tier is Macronutrients (Protein, Fats, and Carbohydrates). While total calories dictate your scale weight, macronutrients dictate 'what' that weight is made of. Ample protein ensures you build/keep muscle rather than fat. Fats regulate your hormones (specifically testosterone, estrogen, and thyroid function), and carbohydrates dictate your training intensity and daily energy levels." },
            { type: "header", text: "Debunking the 'Anabolic Window'" },
            { type: "paragraph", text: "For decades, bodybuilders preached that if you did not consume a whey protein shake within 30 minutes of finishing a workout, your muscles would undergo catabolism (break down) and your workout would be entirely wasted. This is scientifically false. The 'anabolic window' actually stays open for 24 to 36 hours post-workout, especially for beginners and intermediates. As long as your total daily protein intake (e.g., 150 grams for the entire 24-hour period) is met, meal timing is biologically trivial." },
            { type: "header", text: "Carbohydrates at Night" },
            { type: "bullet", emoji: "🌙", text: "The 'No Carbs After 6 PM' myth assumes your metabolism shuts off when you sleep. It does not. Your Basal Metabolic Rate (BMR) functions 24/7. A bowl of oats eaten at 9 PM has the exact same caloric value as a bowl of oats eaten at 9 AM. The body stores and oxidizes energy continuously. The only reason 'no eating late' works for some people is simply because it eliminates their late-night junk food snacking, thereby putting them in a caloric deficit." },
            { type: "quote", text: "Stop majoring in the minors. Do not worry about whether your meal is eaten at 2:00 PM or 4:00 PM when your total daily protein is sitting at 60 grams. Fix the base of the pyramid first." }
        ]
    },
    {
        title: "Muscle Building & Hypertrophy",
        desc: "The actual science of making muscles grow larger.",
        icon: Dumbbell,
        color: "text-cyan-400",
        content: [
            { type: "paragraph", text: "Hypertrophy (the enlargement of an organ or tissue from the increase in size of its cells) is a highly specific biological response. Your body does not want to build muscle; muscle implies a high metabolic cost. To force the body to build muscle, you must subject it to an intense stimulus that threatens its current structural integrity, followed by adequate rest and nutrients to recover stronger." },
            { type: "header", text: "The Mechanisms of Hypertrophy" },
            { type: "paragraph", text: "Scientific literature outlines three primary mechanisms for muscle growth, ranked in order of absolute importance:" },
            { type: "bullet", emoji: "🏗️", text: "1. Mechanical Tension (The Prime Driver): This is the magnitude of the load and the time the muscle spends under that load through a full range of motion. Heavy lifting creates immense mechanical tension across muscle fibers, triggering mechanosensors that initiate the muscle protein synthesis cascade." },
            { type: "bullet", emoji: "💥", text: "2. Muscle Damage: Micro-tears in the muscle fiber created during training (specifically during the eccentric/lowering phase of the lift). The body repairs these tears thicker than before." },
            { type: "bullet", emoji: "🩸", text: "3. Metabolic Stress: The 'pump'. The accumulation of metabolites (like lactate) and blood pooling in the muscle. While it feels great, relying solely on high-rep \"pump\" work yields significantly less growth than focusing on heavy mechanical tension." },
            { type: "header", text: "Reps in Reserve (RIR) and Failure" },
            { type: "paragraph", text: "The single greatest reason most gym-goers look exactly the same year after year is a lack of true intensity. They do 3 sets of 10 reps, but those 10 reps were easy. For a set to stimulate hypertrophy, it must be taken to within 1 to 3 Reps in Reserve (RIR). Total muscular failure is the point where you physically cannot complete another concentric rep despite maximal effort. If you stop a set of 10, but could have cleanly performed 15, you have engaged in 'junk volume' that generated fatigue without generating a growth stimulus. You must train close to the threshold of failure to recruit the high-threshold motor units that have the greatest potential for growth." },
            { type: "quote", text: "Volume drives hypertrophy, but only if that volume is sufficiently intense. 10 hard sets taken to near-failure per muscle group per week will build infinitely more tissue than 25 easy, thoughtless sets." }
        ]
    },
    {
        title: "Truth About Supplements",
        desc: "Separating evidence-based supplements from expensive marketing placebos.",
        icon: Pill,
        color: "text-purple-400",
        content: [
            { type: "paragraph", text: "The supplement industry is a multi-billion dollar machine built largely on marketing, proprietary blends, and obfuscated science. While no supplement will ever out-train a poor diet or bad programming, there are a select few compounds that possess decades of rigorous, peer-reviewed clinical data backing their efficacy." },
            { type: "header", text: "The Proven Tier" },
            { type: "bullet", emoji: "🥇", text: "Creatine Monohydrate: The single most comprehensively studied sports supplement in human history. Creatine is naturally found in red meat, but supplementing 3 to 5 grams daily fully saturates your muscles' phosphocreatine stores. This allows for faster ATP (cellular energy) regeneration, enabling you to squeeze out 1 or 2 extra reps on heavy sets. Over a year, those extra reps translate to significant hypertrophic gains. It is intensely safe and cheap. Skip the expensive 'Creatine HCL' or 'Ethyl Ester'—basic Monohydrate is perfect." },
            { type: "bullet", emoji: "🥈", text: "Caffeine: The ultimate performance enhancer. Consuming 3-6mg per kg of bodyweight 30-45 minutes pre-workout drastically reduces the perception of effort, blunts pain receptors, and increases raw power output. Most commercial 'pre-workouts' are simply overpriced caffeine flavored with artificial sweeteners." },
            { type: "bullet", emoji: "🥉", text: "Whey Protein Isolate/Concentrate: Not a magical muscle builder, but a highly bioavailable, convenient, and cost-effective food source. Use it exclusively if you struggle to reach your 2.0g/kg daily protein target via whole foods." },
            { type: "header", text: "The Placebo & Waste Tier" },
            { type: "paragraph", text: "Conversely, the industry pushes products that are biologically redundant. BCAAs (Branched-Chain Amino Acids) are wildly popular, yet clinically useless if you already consume adequate daily protein, as protein naturally contains all essential amino acids. Fat Burners are almost entirely caffeine pills mixed with trace amounts of cayenne pepper or green tea extract; they do not melt tissue. The only biological mechanism capable of oxidizing fat is a sustained caloric deficit. Finally, 'natural testosterone boosters' (containing Tribulus or Ashwagandha) may slightly improve libido, but they will not raise serum testosterone levels anywhere near the threshold required to increase muscle mass." },
            { type: "quote", text: "Supplements account for roughly 2-5% of your total results. If your sleep is poor, your diet is unmeasured, and your training lacks intensity, no powder on earth will save your physique." }
        ]
    },
    {
        title: "Cardio vs. Weight Training",
        desc: "How to balance endurance and strength for a perfect physique and health.",
        icon: Heart,
        color: "text-pink-400",
        content: [
            { type: "paragraph", text: "The fitness community has long been divided into two militant camps: the cardio enthusiasts who run endlessly but lack musculature and suffer from joint degradation, and the powerlifters who possess immense strength but get winded walking up a flight of stairs. True fitness, longevity, and aesthetic excellence require the intelligent integration of both modalities." },
            { type: "header", text: "The Concurrent Training Effect" },
            { type: "paragraph", text: "The 'Concurrent Training Effect' or 'Interference Effect' is the scientifically documented phenomenon where the body struggles to adapt to both endurance stimuli and strength stimuli simultaneously. Weight training signals the mTOR pathway (muscle growth), while extensive cardio signals the AMPK pathway (mitochondrial endurance); these pathways are antagonistically opposed. If you run 10 miles a day, your body will systematically shed heavy muscle tissue because carrying it wastes oxygen." },
            { type: "paragraph", text: "However, this effect only becomes detrimental at extremes. Performing 3 to 4 sessions of 30-minute steady-state cardiovascular exercise a week will not 'kill your gains'. In fact, the increased capillary density and aerobic capacity will allow you to recover faster between heavy sets of squats and deadlifts, ultimately improving your lifting." },
            { type: "header", text: "Strategic Implementation" },
            { type: "bullet", emoji: "⏱️", text: "Order of Operations: If you must perform both in the same session, ALWAYS lift weights first. Weight training requires elite neurological recruitment, explosive ATP energy, and glycogen. If you exhaust these systems on a treadmill, your lifting form will degrade, risk of injury skyrockets, and your strength output will plummet. Lift first. Do cardio afterward." },
            { type: "bullet", emoji: "🏃", text: "Zone 2 Cardio: The 'sweet spot' for lifters is Zone 2 cardio (maintaining a heart rate roughly between 120-140 BPM). At this intensity, you are primarily utilizing fat oxidation for energy rather than depleting muscle glycogen. It builds a bulletproof cardiovascular base without plunging your nervous system into deep fatigue." },
            { type: "quote", text: "Weight training dictates the shape of your body. Cardio dictates the health of your engine. Stop arguing over which is better and start doing both intelligently." }
        ]
    },
    {
        title: "Breaking Through Plateaus",
        desc: "What to do when the scale stops moving and the weights stop going up.",
        icon: Shield,
        color: "text-slate-400",
        content: [
            { type: "paragraph", text: "Encountering a plateau is an inevitable, entirely natural phase of the training lifecycle. The body is a highly efficient, adaptive organism; its primary goal is homeostasis. When you introduce a stressor (lifting weights or eating fewer calories), it adapts rapidly. Eventually, the stressor becomes the new normal, and biological adaptation ceases. Identifying whether you have hit a training plateau or a nutritional plateau is the first step in dismantling it." },
            { type: "header", text: "The Strength Plateau & The Deload" },
            { type: "paragraph", text: "If your bench press or squat has not increased in weight or reps for 3 consecutive weeks, you have hit a strength plateau. The most common instinct is to push harder, drink more pre-workout, and grind through it. This is the worst possible approach. A plateau is usually the body screaming that its systemic fatigue is masking its actual fitness capability." },
            { type: "paragraph", text: "The solution is the 'Deload Week'. Every 6 to 8 weeks, you must run a scheduled week where you reduce your total training volume (number of sets) by 50%, and reduce the weight on the bar by 10-15%. This gives your central nervous system, tendons, and connective tissues time to fully repair. When you return to normal training the following week, you will frequently find your strength has surged forward." },
            { type: "header", text: "The Weight Loss Plateau & Metabolic Adaptation" },
            { type: "paragraph", text: "Weight loss plateaus are dictated by math. If you started a diet weighing 220 lbs, your body required 2,800 calories to maintain that mass. You dropped to 2,300 calories and lost 20 lbs. You now weigh 200 lbs. The critical realization is that a 200-lb body requires significantly less energy to exist than a 220-lb body. That 2,300-calorie 'deficit' is now your new 'maintenance' level. To resume fat loss, you must either drop calories again (e.g., to 2,050) or drastically increase your daily activity (NEAT/steps)." },
            { type: "quote", text: "A plateau is not a failure; it is the physical proof that your previous programming forced an adaptation. Adjust the variables, respect fatigue, and keep moving forward." }
        ]
    },
    {
        title: "Best Compound Exercises",
        desc: "The non-negotiable movements that provide 80% of your results.",
        icon: Zap,
        color: "text-yellow-400",
        content: [
            { type: "paragraph", text: "In an era of endless fitness variations on social media—bosu ball squats, banded glute kickbacks, and elaborate cable arrays—it is easy to lose sight of the foundational truth of biomechanics. The highest return on your time investment in the gym will always yield from heavy, multi-joint compound movements. A compound exercise requires movement across two or more joints, recruiting massive amounts of muscle tissue and triggering a robust systemic hormonal response." },
            { type: "header", text: "The Biomechanical Big Four" },
            { type: "bullet", emoji: "👑", text: "The Squat (Knee Dominant): Whether it is a barbell back squat, a front squat, or a Bulgarian split squat, deep knee flexion is non-negotiable for lower body development. A proper squat loads the quadriceps, demands immense stabilization from the spinal erectors and the anterior core, and heavily recruits the gluteus maximus coming out of 'the hole'." },
            { type: "bullet", emoji: "🏋️", text: "The Deadlift (Hip Hinge): The ultimate posterior chain builder. A heavy deadlift taxes the body from the Achilles tendon to the trapezius. It builds thick, powerful hamstrings, massive glute density, and a back thick enough to stop a bullet. Form is paramount—maintain a neutral spine and drive the earth away with your legs." },
            { type: "bullet", emoji: "💎", text: "The Press (Horizontal & Vertical): The barbell or dumbbell bench press builds the entire pectoral girdle and the anterior deltoids. The overhead standing press demands immense core rigidity while building the shoulders and triceps. To prevent injury, shoulder blades must be aggressively retracted and depressed during horizontal pressing." },
            { type: "bullet", emoji: "🔙", text: "The Pull (Vertical & Horizontal): Heavy bent-over barbell rows build mid-back thickness (rhomboids, traps, teres major). Pull-ups and heavy lat pulldowns construct back width (the latissimus dorsi), giving the torso the coveted 'V-Taper' which creates the illusion of a smaller waist." },
            { type: "quote", text: "The 80/20 Rule: 80% of your gains will come from 20% of your exercises. Dedicate the first 45 minutes of a workout to crushing the heavy compound lifts. Save the bicep curls and calf raises for the final 15 minutes." }
        ]
    },
    {
        title: "The Truth About 'Toning' & Spot Reduction",
        desc: "Dispelling the most common, harmful myths pushed by fitness influencers.",
        icon: Scale,
        color: "text-teal-400",
        content: [
            { type: "paragraph", text: "The fitness industry targets beginners, particularly women, with specific buzzwords designed to sell programs. The most egregious and biologically illiterate of these terms is 'Toning'. There is no such physiological process as 'toning' a muscle. Muscles do not get harder, softer, longer, or leaner. Muscles only possess the capability to perform two actions: they hypertrophy (increase in cross-sectional area) or they atrophy (shrink)." },
            { type: "header", text: "Deconstructing 'Toned'" },
            { type: "paragraph", text: "When someone says they want to look 'toned', what they actually mean in clinical terms is: 'I want to possess an adequate amount of muscle mass, covered by a low enough subcutaneous body fat percentage that the shape of the muscle is visible against the skin.' Doing sets of 50 repetitions with neon 2-pound dumbbells does not 'tone' anything; it merely builds localized muscular endurance. To achieve a 'toned' look, you must lift heavy weights (to build the muscle) and eat in a caloric deficit (to strip the fat obscuring it)." },
            { type: "header", text: "The Spot Reduction Fallacy" },
            { type: "paragraph", text: "The second most pervasive myth is 'Spot Reduction'—the idea that performing specific exercises will selectively burn fat from that specific region. Influencers sell '10-minute lower belly fat destroyer' ab routines. It is a biological impossibility. Performing 500 crunches will build the rectus abdominis muscles, but it will do absolutely nothing to the layer of fat sitting on top of them. Adipose tissue is utilized systemically. When you eat in a caloric deficit, your genetics determine where the body pulls fat from first, and where it pulls it from last." },
            { type: "quote", text: "You cannot out-crunch a bad diet. You cannot target belly fat. You must drop your overall body fat percentage. Embrace heavy resistance training and caloric control; throw away the 2-pound dumbbells and the 'ab burner' routines." }
        ]
    },
];

export function KnowledgeBase() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleGuide = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section id="knowledge" className="relative py-28 px-4 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-forge-orange/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="mx-auto max-w-5xl relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forge-orange/20 bg-forge-orange/5 px-5 py-2 text-sm font-semibold text-forge-orange-light tracking-wide uppercase">
                        <BookOpen className="h-4 w-4" />
                        Comprehensive Knowledge
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                        Ultimate Fitness <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-forge-orange to-yellow-500">Masterclasses</span>
                    </h2>
                    <p className="mt-6 text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        We have compiled the absolute, uncompromising truth about training, nutrition, and recovery.
                        No myths, no bro-science, no shortcuts. Click any masterclass below to expand and read the full curriculum.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <div className="flex flex-col gap-6">
                        {guides.map((guide, i) => (
                            <motion.div key={guide.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                                <Card
                                    className={`glass-card border-[1.5px] border-forge-border hover:border-forge-orange/50 transition-all duration-300 cursor-pointer group shadow-lg ${expandedIndex === i ? "border-forge-orange/70 bg-slate-900/80 shadow-forge-orange/20 ring-1 ring-forge-orange/20" : "bg-slate-900/40"}`}
                                    onClick={() => toggleGuide(i)}
                                >
                                    <CardContent className="p-6 md:p-10">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950/80 border border-white/5 ${guide.color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner`}>
                                                <guide.icon className="h-8 w-8 stroke-[1.5]" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <h3 className={`text-2xl md:text-3xl font-bold transition-colors duration-300 tracking-tight ${expandedIndex === i ? "text-forge-orange-light" : "text-white group-hover:text-forge-orange"}`}>
                                                        {guide.title}
                                                    </h3>
                                                    <div className={`hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800/50 border border-slate-700 transition-all duration-300 ${expandedIndex === i ? "rotate-180 bg-forge-orange/20 border-forge-orange/50" : "group-hover:bg-slate-700/80"}`}>
                                                        <ChevronDown className={`h-5 w-5 transition-colors ${expandedIndex === i ? "text-forge-orange-light" : "text-slate-400"}`} />
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-base md:text-lg text-slate-400 font-medium">{guide.desc}</p>
                                            </div>
                                            <div className={`md:hidden self-end h-10 w-10 flex items-center justify-center rounded-full bg-slate-800/50 border border-slate-700 transition-all duration-300 ${expandedIndex === i ? "rotate-180 bg-forge-orange/20 border-forge-orange/50" : ""}`}>
                                                <ChevronDown className={`h-5 w-5 transition-colors ${expandedIndex === i ? "text-forge-orange-light" : "text-slate-400"}`} />
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {expandedIndex === i && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                                                    animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                                                    exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                                                    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-8 pt-8 border-t border-forge-border/80 space-y-6">
                                                        {guide.content.map((section, j) => {
                                                            if (section.type === "paragraph") {
                                                                return (
                                                                    <motion.p
                                                                        key={j}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: j * 0.05 + 0.1 }}
                                                                        className="text-base md:text-lg text-slate-300 leading-relaxed font-normal"
                                                                    >
                                                                        {section.text}
                                                                    </motion.p>
                                                                );
                                                            }

                                                            if (section.type === "header") {
                                                                return (
                                                                    <motion.h4
                                                                        key={j}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: j * 0.05 + 0.1 }}
                                                                        className="text-xl md:text-2xl font-bold text-white pt-2 border-b border-forge-border/40 pb-2"
                                                                    >
                                                                        {section.text}
                                                                    </motion.h4>
                                                                );
                                                            }

                                                            if (section.type === "bullet") {
                                                                const [boldPart, restPart] = section.text.split(":");
                                                                return (
                                                                    <motion.div
                                                                        key={j}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: j * 0.05 + 0.1 }}
                                                                        className="flex gap-4 group/item items-start pl-2"
                                                                    >
                                                                        <span className="text-2xl shrink-0 mt-0.5">{section.emoji}</span>
                                                                        <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                                                                            {restPart ? (
                                                                                <>
                                                                                    <strong className="text-white font-semibold">{boldPart}:</strong>
                                                                                    <span className="text-slate-400">{restPart}</span>
                                                                                </>
                                                                            ) : (
                                                                                <span className="text-slate-400">{section.text}</span>
                                                                            )}
                                                                        </p>
                                                                    </motion.div>
                                                                );
                                                            }

                                                            if (section.type === "quote") {
                                                                return (
                                                                    <motion.div
                                                                        key={j}
                                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: j * 0.05 + 0.1 }}
                                                                        className="mt-8 relative"
                                                                    >
                                                                        <div className="absolute inset-0 bg-linear-to-r from-forge-orange/10 to-transparent rounded-xl" />
                                                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-forge-orange rounded-l-xl" />
                                                                        <div className="relative p-6 flex gap-4 items-start">
                                                                            <Info className="h-6 w-6 text-forge-orange shrink-0 mt-1" />
                                                                            <p className="italic font-medium text-lg text-slate-200">
                                                                                &quot;{section.text}&quot;
                                                                            </p>
                                                                        </div>
                                                                    </motion.div>
                                                                );
                                                            }

                                                            return null;
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
