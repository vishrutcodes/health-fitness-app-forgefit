import { ParticleBackground } from "@/components/particle-background";
import { Navbar } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero";
import { CalculatorSection } from "@/components/sections/calculator";
import { ToolkitSection } from "@/components/sections/toolkit";
import { DietArchitect } from "@/components/sections/diet-architect";
import { MacroBreakdown } from "@/components/sections/macro-breakdown";
import { RoadmapSection } from "@/components/sections/roadmap";
import { ExerciseGuide } from "@/components/sections/exercise-guide";
import { WorkoutTimer } from "@/components/sections/workout-timer";
import { PhasePlanner } from "@/components/sections/phase-planner";
import { KnowledgeBase } from "@/components/sections/knowledge-base";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <CalculatorSection />
        <ToolkitSection />
        <DietArchitect />
        <MacroBreakdown />
        <RoadmapSection />
        <ExerciseGuide />
        <WorkoutTimer />
        <PhasePlanner />
        <KnowledgeBase />
      </main>
      <Footer />
    </>
  );
}
