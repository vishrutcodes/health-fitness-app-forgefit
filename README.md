<div align="center">

# 🔥 ForgeFit — AI-Powered Fitness & Nutrition Platform

### *Forge Your Dream Physique*

A premium, production-grade fitness web application combining **artificial intelligence**, **real-time data visualization**, and **interactive fitness tools** into a single, beautifully designed platform. ForgeFit empowers users to generate personalized workout plans, analyze nutrition on the fly, track body composition changes, log personal records, and receive real-time coaching — all powered by **Groq's LLaMA 3.3 70B** large language model.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-ForgeFit-FF6B2B?style=for-the-badge)](https://health-fitness-app-forgefit.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/vishrutcodes/health-fitness-app-forgefit)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

</div>

---

## 📋 Table of Contents

1. [About The Project](#-about-the-project)
2. [Demo & Deployment](#-demo--deployment)
3. [Complete Tech Stack](#-complete-tech-stack)
4. [System Architecture](#-system-architecture)
5. [Feature Deep Dives](#-feature-deep-dives)
   - [AI Coach (Real-Time Chat)](#1--ai-coach--real-time-conversational-assistant)
   - [Macro Breakdown (AI Nutrition)](#2--macro-breakdown--ai-powered-nutritional-analysis)
   - [Exercise Guide (AI Form Coach)](#3--exercise-guide--ai-exercise-form-guidance)
   - [Diet Architect (AI Meal Plans)](#4--diet-architect--ai-meal-plan-generator)
   - [Fitness Roadmap (AI Periodization)](#5--fitness-roadmap--ai-training-periodization)
   - [TDEE & Macro Calculator](#6--tdee--macro-calculator)
   - [Fitness Toolkit (5-in-1)](#7--fitness-toolkit--5-in-1-calculator-suite)
   - [Workout Timer (Rest + HIIT)](#8--workout-timer--dual-mode-interval-timer)
   - [Phase Planner](#9--phase-planner--training-block-periodization)
   - [Knowledge Base](#10--knowledge-base--fitness-education-hub)
   - [Body Progress Tracker](#11--body-progress-tracker--measurement-dashboard)
   - [Personal Records Tracker](#12--personal-records-tracker--strength-dashboard)
6. [Page & Route Architecture](#-page--route-architecture)
7. [Component Architecture](#-component-architecture)
8. [Design System & UI Philosophy](#-design-system--ui-philosophy)
9. [API Endpoints Reference](#-api-endpoints-reference)
10. [Getting Started](#-getting-started)
11. [Project Directory Structure](#-project-directory-structure)
12. [Performance & Optimization](#-performance--optimization)
13. [Future Enhancements](#-future-enhancements)
14. [License](#-license)

---

## 🚀 About The Project

ForgeFit was born from a simple idea: **fitness guidance should be intelligent, interactive, and accessible to everyone.** Traditional fitness apps are either too generic (one-size-fits-all plans), too expensive (personal trainer costs $50-150/session), or too fragmented (one app for nutrition, another for workouts, another for tracking).

ForgeFit solves all three problems by combining:

- **🤖 Artificial Intelligence** — 5 distinct AI-powered features that give personalized, context-aware fitness guidance using Meta's LLaMA 3.3 70B model through Groq's ultra-fast inference API
- **📊 Data-Driven Tracking** — Interactive Recharts visualizations for body composition and strength progress with full CRUD operations
- **🧮 Scientific Calculators** — Evidence-based formulas (Mifflin-St Jeor for BMR, Epley for 1RM, U.S. Navy method for body fat) built into dedicated calculator components
- **⏱️ Training Tools** — Configurable timers, phase planners, and periodization tools for structured training

### What Makes ForgeFit Different

| Traditional Fitness Apps | ForgeFit |
|-------------------------|----------|
| Static workout templates | AI generates custom programs based on your exact inputs |
| Basic calorie counters | AI analyzes any food you describe and returns per-item macronutrient breakdowns |
| No form guidance | AI provides step-by-step exercise technique, common mistakes, and variations |
| Separate apps for each feature | 15+ features in a single, cohesive platform |
| Generic UI | Premium dark-mode glassmorphism with Framer Motion micro-animations |
| Monthly subscriptions | Completely free and open source |

---

## 🌐 Demo & Deployment

| | Details |
|---|---|
| **Live URL** | [health-fitness-app-forgefit.vercel.app](https://health-fitness-app-forgefit.vercel.app) |
| **Hosting** | Vercel (Edge Network, automatic HTTPS, global CDN) |
| **CI/CD** | GitHub → Vercel (auto-deploy on every push to `main`) |
| **Region** | Auto-detected (served from nearest Vercel Edge node) |
| **Uptime** | 99.9% (Vercel SLA) |

---

## 🛠 Complete Tech Stack

### Frontend Framework & Language

| Technology | Version | Role in Project |
|-----------|---------|-----------------|
| **Next.js** | 16.1.6 | React meta-framework — provides App Router for file-based routing, Server Components for SSR, API Routes for backend endpoints, and Turbopack for blazing-fast HMR during development. All pages use the App Router pattern (`app/` directory). |
| **React** | 19.2.3 | UI library — leverages React 19's latest features including Client/Server Component model, `use client` directive for interactive components, and concurrent rendering for smooth UI updates. |
| **TypeScript** | 5.x | Strict type safety across the entire codebase — all components, API routes, utility functions, and state management are fully typed with interfaces and generics. Zero `any` types in production code. |

### Styling & Design

| Technology | Version | Role in Project |
|-----------|---------|-----------------|
| **TailwindCSS** | 4.x | Utility-first CSS framework — uses v4's new CSS-first configuration, `@theme` directive for custom design tokens, and PostCSS pipeline. Custom utilities include `glass-card`, `glass-nav`, `text-gradient-forge`, and `glow-orange`. |
| **Framer Motion** | 12.35.1 | Declarative animations — powers scroll-triggered viewport animations (`whileInView`), page entrance transitions (`initial`/`animate`), micro-interactions on hover, and layout animations. Used in every section component. |
| **Lucide React** | 0.577.0 | Icon library providing 100+ hand-picked SVG icons used across the entire interface — from navigation icons to feature-specific icons like `Dumbbell`, `Scale`, `Flame`, `TrendingUp`, etc. |
| **tw-animate-css** | 1.4.0 | TailwindCSS animation utilities for CSS-based animations beyond what Framer Motion handles. |

### UI Component Library

| Technology | Version | Role in Project |
|-----------|---------|-----------------|
| **shadcn/ui** (Base UI) | 4.0.0 | Headless, unstyled, accessible component primitives — provides the foundation for `Button`, `Card`, `Dialog`, `Select`, `Input`, `Label`, `Tabs`, `Badge`, and `Table` components. Each component is customized with ForgeFit's design tokens. |
| **class-variance-authority** | 0.7.1 | Variant-based component styling — manages component variants (size, color, state) for shadcn/ui Button and other polymorphic components. |
| **clsx** + **tailwind-merge** | 2.1.1 / 3.5.0 | Utility functions for conditional class composition — `cn()` helper merges Tailwind classes without conflicts, used in every component. |

### AI & LLM Integration

| Technology | Version | Role in Project |
|-----------|---------|-----------------|
| **Groq SDK** | 0.37.0 | Official Groq TypeScript SDK — connects to Groq's ultra-fast LLM inference API. ForgeFit uses the `llama-3.3-70b-versatile` model for all AI features. Groq provides 10x faster inference than traditional GPU providers. |
| **LLaMA 3.3 70B** | Versatile | Meta's open-weight large language model — 70 billion parameters, fine-tuned for instruction following. Handles fitness coaching, nutritional analysis, exercise guidance, diet planning, and training periodization. |

### Data Visualization & Storage

| Technology | Version | Role in Project |
|-----------|---------|-----------------|
| **Recharts** | 3.8.0 | React charting library — renders interactive `LineChart` components with custom-styled `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, and `Line` elements. Used in both Progress and PRs dashboards with dark-themed styling. |
| **localStorage** | Web API | Client-side persistent storage — stores body progress measurements and personal records as JSON arrays. Provides instant read/write with no network latency. Data persists across browser sessions. |

### Particle Effects

| Technology | Version | Role in Project |
|-----------|---------|-----------------|
| **tsParticles React** | 3.0.0 | React wrapper for tsParticles — renders animated particle backgrounds in the Hero section for a premium, dynamic visual effect. |
| **tsParticles Slim** | 3.9.1 | Lightweight particle engine — handles particle physics, collision detection, and rendering. Configured for subtle, non-intrusive background animation. |

### Development Toolchain

| Technology | Version | Role in Project |
|-----------|---------|-----------------|
| **Turbopack** | Built-in | Next.js 16's Rust-based bundler — provides sub-100ms HMR (Hot Module Replacement) during development. Orders of magnitude faster than Webpack. |
| **ESLint** | 9.x | Code quality enforcement — uses `eslint-config-next` for Next.js-specific rules, React hooks validation, and TypeScript integration. |
| **PostCSS** | — | CSS processing pipeline — transforms TailwindCSS utilities and custom properties into optimized browser-ready CSS. |
| **@tailwindcss/postcss** | 4.x | PostCSS plugin for TailwindCSS v4 — enables the CSS-first configuration approach. |

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Landing Page (/)                         │  │
│  │  ┌──────────┐ ┌──────────────┐ ┌────────────────────────┐ │  │
│  │  │ Navbar   │ │ Hero Section │ │ AI Coach Dialog (Float) │ │  │
│  │  └──────────┘ └──────────────┘ └────────────────────────┘ │  │
│  │  ┌──────────┐ ┌────────┐ ┌──────────┐ ┌───────────────┐  │  │
│  │  │Calculator│ │Toolkit │ │Macro B.  │ │ Exercise Guide│  │  │
│  │  │(TDEE/BMR)│ │(5 tabs)│ │(AI)      │ │ (AI)          │  │  │
│  │  └──────────┘ └────────┘ └──────────┘ └───────────────┘  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │  │
│  │  │Diet Plan │ │ Roadmap  │ │  Timer   │ │Phase Plan.  │  │  │
│  │  │(AI)      │ │(AI)      │ │(Rest+HIT)│ │(Periodize)  │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │  │
│  │  ┌──────────────┐ ┌──────────┐                           │  │
│  │  │Knowledge Base│ │ Footer   │                           │  │
│  │  └──────────────┘ └──────────┘                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │  /progress            │  │  /prs                            │ │
│  │  Body Metrics Dashboard│  │  Personal Records Dashboard     │ │
│  │  ┌──────────────────┐ │  │  ┌──────────────────────────┐   │ │
│  │  │ Log Measurement  │ │  │  │ Log PR Dialog            │   │ │
│  │  │ Dialog (6 metrics)│ │  │  │ (10 exercises)           │   │ │
│  │  ├──────────────────┤ │  │  ├──────────────────────────┤   │ │
│  │  │ Recharts Line    │ │  │  │ Recharts Line Chart      │   │ │
│  │  │ Chart (filtered) │ │  │  │ + Best PR Display        │   │ │
│  │  ├──────────────────┤ │  │  ├──────────────────────────┤   │ │
│  │  │ History Table    │ │  │  │ History Table + Delete    │   │ │
│  │  │ + Delete Actions │ │  │  │                          │   │ │
│  │  └──────────────────┘ │  │  └──────────────────────────┘   │ │
│  │  📦 localStorage      │  │  📦 localStorage                │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
│                                                                  │
│              fetch() ──────────────────────┐                     │
└──────────────────────────────────────────┼─────────────────────┘
                                           │
┌──────────────────────────────────────────┼─────────────────────┐
│              SERVER (Next.js API Routes) │                      │
│                                          ▼                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     /api/ai/*                             │  │
│  │                                                           │  │
│  │  POST /api/ai/coach     → Conversational fitness Q&A      │  │
│  │  POST /api/ai/macros    → Per-food macronutrient analysis  │  │
│  │  POST /api/ai/exercise  → Exercise form & technique guide  │  │
│  │  POST /api/ai/diet      → Structured meal plan generation  │  │
│  │  POST /api/ai/roadmap   → Periodized training roadmap      │  │
│  │                                                           │  │
│  │  Each route:                                              │  │
│  │  ├── Validates request body                               │  │
│  │  ├── Constructs specialized system prompt                 │  │
│  │  ├── Calls Groq SDK with llama-3.3-70b-versatile          │  │
│  │  ├── Parses JSON from AI response                         │  │
│  │  └── Returns structured data to client                    │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
└───────────────────────────────┼─────────────────────────────────┘
                                │ HTTPS
                                ▼
                    ┌───────────────────────┐
                    │    Groq Cloud API     │
                    │  ┌─────────────────┐  │
                    │  │  LLaMA 3.3 70B  │  │
                    │  │   Versatile     │  │
                    │  │  (70B params)   │  │
                    │  └─────────────────┘  │
                    │  ~200ms inference     │
                    └───────────────────────┘
```

---

## 🔥 Feature Deep Dives

### 1. 🤖 AI Coach — Real-Time Conversational Assistant

**Component:** `src/components/ai-coach-dialog.tsx`
**API Route:** `POST /api/ai/coach`
**Model:** `llama-3.3-70b-versatile` via Groq SDK

The AI Coach is an always-accessible, floating chat widget that appears as a circular button in the bottom-right corner of every page. When opened, it reveals a sleek chat interface with:

- **Persistent Chat History** — Messages are maintained in React state throughout the session, allowing multi-turn conversations where the AI remembers previous context
- **Specialized System Prompt** — The AI is prompted as a certified fitness coach and sports nutritionist with expertise in bodybuilding, powerlifting, CrossFit, calisthenics, nutrition science, and injury prevention
- **Real-Time Streaming** — User messages are sent via fetch to the API route, which forwards them to Groq with the full conversation history for contextual responses
- **Rich UI** — Messages are displayed in chat bubbles with different styling for user (orange gradient) vs. AI (dark glass) messages. Loading states show animated dots.

**Technical Implementation:**
```
User Input → fetch('/api/ai/coach', { messages }) → Groq SDK → LLaMA 3.3 70B → JSON Response → Rendered in Chat UI
```

**Example Queries:** "What's the best exercise for building chest mass?", "How many calories should I eat to lose 1lb per week?", "Create a 4-day upper/lower split"

---

### 2. 🥗 Macro Breakdown — AI-Powered Nutritional Analysis

**Component:** `src/components/sections/macro-breakdown.tsx`
**API Route:** `POST /api/ai/macros`

Users type in any food items (e.g., "2 eggs, 1 cup rice, grilled chicken breast 200g") and the AI returns:

- **Per-Food Breakdown** — Each food item listed separately with its individual calorie, protein, carb, and fat values
- **Daily Totals** — Aggregated macronutrient summary across all foods
- **AI Insights** — Contextual nutritional advice (e.g., "This meal is high in protein but low in fiber — consider adding vegetables")

**How It Works:**
1. User enters comma-separated food items in the input field
2. Client sends the food list to `POST /api/ai/macros`
3. Server constructs a system prompt instructing the AI to return structured JSON: `{ foods: [{ name, calories, protein, carbs, fat }], totals: { calories, protein, carbs, fat }, insights: string }`
4. AI response is parsed and rendered in a styled grid with per-food cards and a totals summary

---

### 3. 🏋️ Exercise Guide — AI Exercise Form Guidance + Voice Coach

**Component:** `src/components/sections/exercise-guide.tsx`
**API Route:** `POST /api/ai/exercise`

A searchable exercise encyclopedia powered by AI with **built-in voice guidance**. Users type any exercise name and receive:

- **Target Muscles** — Primary and secondary muscle groups activated (e.g., "Primary: Quadriceps, Glutes; Secondary: Hamstrings, Core")
- **Step-by-Step Form Instructions** — Detailed numbered steps for proper execution
- **Common Mistakes** — Top 3-5 form errors to avoid with explanations
- **Pro Tips** — Advanced cues for maximizing muscle engagement
- **Variations** — Related exercises that are clickable — clicking a variation auto-searches for that exercise, creating a seamless exploration flow

#### 🔊 Voice Guidance (Web Speech API)

A standout feature — after the AI generates form tips, users can click the green **"Voice Guide"** button to have the instructions **read aloud step-by-step**, hands-free, like a personal trainer coaching you through the movement.

- **Step-by-Step Narration** — Reads each form tip sequentially, then common mistakes, with an intro and closing line
- **Real-Time Step Highlighting** — The currently spoken step glows orange with a pulsing 🔊 icon, so users can follow along visually
- **Full Playback Controls** — Pause ⏸, Resume ▶, Skip ⏭, and Stop 🔇 buttons for complete control
- **Smart Voice Selection** — Automatically picks the best available English voice (prefers Google/Samantha/Daniel voices)
- **Auto-Stop on Navigation** — Speech cancels when switching to a new exercise

**Technical Implementation:** Uses the browser's native `SpeechSynthesis` API — zero external dependencies, works offline, no API calls needed. The speech queue is managed via `useRef` to track the current step index, and `onend` callbacks chain each step sequentially. Active step index is calculated relative to the speech queue position to highlight the correct form tip or mistake in the UI.

**Technical Detail:** The AI is instructed to return JSON with fields: `{ muscles, steps[], mistakes[], tips[], variations[] }`. Variations are rendered as clickable badges that trigger a new search.

---

### 4. 🍽️ Diet Architect — AI Meal Plan Generator

**Component:** `src/components/sections/diet-architect.tsx`
**API Route:** `POST /api/ai/diet`

A comprehensive meal plan generator that creates structured daily nutrition plans. Users input:

- **Daily Calorie Target** — e.g., 2500 kcal
- **Protein Goal** — e.g., 180g
- **Fitness Goal** — Bulking, Cutting, or Maintaining
- **Number of Meals** — 3, 4, 5, or 6 meals per day
- **Dietary Restrictions** — Vegetarian, Vegan, Gluten-Free, Dairy-Free, Keto, etc.

**Output Structure:**
```json
{
  "meals": [
    {
      "name": "Meal 1 - Power Breakfast",
      "foods": [
        { "item": "4 egg whites + 2 whole eggs scrambled", "calories": 280, "protein": 32, "carbs": 2, "fat": 14 },
        { "item": "1 cup oatmeal with berries", "calories": 180, "protein": 6, "carbs": 32, "fat": 3 }
      ]
    }
  ],
  "dailyTotals": { "calories": 2480, "protein": 182, "carbs": 290, "fat": 72 }
}
```

Each meal is rendered as a card with a food-by-food breakdown table and color-coded macro badges.

---

### 5. 🗺️ Fitness Roadmap — AI Training Periodization

**Component:** `src/components/sections/roadmap.tsx`
**API Route:** `POST /api/ai/roadmap`

Generates multi-phase training roadmaps with progressive overload. Users specify:

- **Starting Point** — Current fitness level (e.g., "Bench 60kg, can run 2km")
- **Goal** — Target outcome (e.g., "Bench 100kg, run 10km, visible abs")
- **Timeframe** — 4 weeks, 8 weeks, 12 weeks, or 16 weeks
- **Available Equipment** — Full gym, Home (dumbbells), Bodyweight only, Resistance bands

**Output:** A phased plan with 3-4 training blocks, each containing:
- Phase name and duration (e.g., "Phase 1: Foundation — Weeks 1-4")
- Weekly workout schedule with exercises, sets, reps, and rest periods
- Key milestones and targets for each phase
- Progressive overload strategy

---

### 6. 🧮 TDEE & Macro Calculator

**Component:** `src/components/sections/calculator.tsx`

A comprehensive metabolic calculator using the **Mifflin-St Jeor equation** — the gold standard for estimating Basal Metabolic Rate (BMR) recommended by the Academy of Nutrition and Dietetics.

**Inputs:** Age, weight (kg), height (cm), gender (male/female), activity level (5 options from sedentary to extra active)

**Formulas Used:**
```
BMR (Male)   = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 5 + 161
BMR (Female) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
TDEE = BMR × Activity Multiplier
Protein = weight × 2.2g
Fat = TDEE × 0.25 / 9
Carbs = (TDEE - protein×4 - fat×9) / 4
```

**Activity Multipliers:**
| Level | Multiplier | Description |
|-------|-----------|-------------|
| Sedentary | 1.2 | Little or no exercise |
| Lightly Active | 1.375 | Light exercise 1-3 days/week |
| Moderately Active | 1.55 | Moderate exercise 3-5 days/week |
| Very Active | 1.725 | Hard exercise 6-7 days/week |
| Extra Active | 1.9 | Very hard exercise + physical job |

**Results Display:** BMR, TDEE, and recommended protein/carb/fat targets — all rendered in animated stat cards with color-coded values.

---

### 7. 🛠️ Fitness Toolkit — 5-in-1 Calculator Suite

**Component:** `src/components/sections/toolkit.tsx`

A tabbed interface containing 5 independent health calculators, each built as a separate React component:

#### Tab 1: BMI Calculator
- **Formula:** `BMI = weight(kg) / height(m)²`
- **Output:** Numeric BMI value with classification (Underweight < 18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese ≥ 30) and color-coded result badge

#### Tab 2: One-Rep Max (1RM) Calculator
- **Formula (Epley):** `1RM = weight × (1 + reps / 30)`
- **Inputs:** Weight lifted, reps performed
- **Output:** Estimated 1RM with percentage breakdown for common rep ranges (90% for 3 reps, 85% for 5 reps, etc.)

#### Tab 3: Body Fat % Calculator
- **Formula (U.S. Navy Method):**
  - Male: `86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76`
  - Female: `163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387`
- **Inputs:** Neck, waist, hip (female only) circumferences in cm, height
- **Output:** Estimated body fat percentage with category classification

#### Tab 4: Water Intake Calculator
- **Formula:** `baseIntake = weight × 0.033` (liters/day), adjusted for activity level
- **Output:** Recommended daily water intake in liters, adjusted for exercise frequency

#### Tab 5: Sleep Calculator
- **Based on:** 90-minute sleep cycles (REM + NREM)
- **Inputs:** Desired wake-up time
- **Output:** Optimal bedtimes that align with complete sleep cycles (4, 5, or 6 cycles = 6h, 7.5h, or 9h sleep)

---

### 8. ⏱️ Workout Timer — Dual-Mode Interval Timer

**Component:** `src/components/sections/workout-timer.tsx`

A fully functional workout timer with two distinct modes:

#### Mode 1: Rest Timer
- **Presets:** 30s, 60s, 90s, 120s, 180s (one-click selection)
- **Features:** Custom duration input, play/pause toggle, reset button
- **Visual Timer:** SVG-based circular progress indicator with animated `stroke-dashoffset` that smoothly depletes as time counts down
- **Phase Label:** Displays "REST" during countdown

#### Mode 2: HIIT Timer
- **Presets:** 20/10 (Tabata), 30/15, 40/20, 45/15 — representing work/rest intervals
- **Features:** Configurable work time, rest time, and number of rounds
- **Phase Tracking:** Automatically alternates between "WORK" (green) and "REST" (red) phases
- **Round Counter:** Displays current round vs. total rounds (e.g., "Round 3/8")
- **Circular Timer:** Same SVG circular display, with color-coded animation matching the current phase

**Technical Implementation:** Uses `useEffect` with `setInterval` for precise timing, `useRef` for audio cue references, and `useCallback` for optimized preset selection. The SVG timer uses `stroke-dasharray` and `stroke-dashoffset` calculations to render a smooth circular countdown.

---

### 9. 📅 Phase Planner — Training Block Periodization

**Component:** `src/components/sections/phase-planner.tsx`

An interactive training phase manager for planning long-term periodized training blocks:

- **Phase Types:** Cutting (red), Bulking (green), Maintaining (blue), Deload (yellow) — each with distinct color-coded badges
- **CRUD Operations:** Add new phases via a shadcn/ui Dialog, remove phases with one click
- **Phase Properties:** Name, type, duration (weeks), and daily caloric target
- **Visual Layout:** Timeline-style card layout showing all planned phases in sequence

This tool helps intermediate and advanced trainees plan structured mesocycles — alternating between hypertrophy, strength, peaking, and recovery phases over weeks or months.

---

### 10. 📚 Knowledge Base — Fitness Education Hub

**Component:** `src/components/sections/knowledge-base.tsx`

A curated collection of 5 fitness education categories, each represented as an interactive card:

| Guide | Description | Icon |
|-------|-------------|------|
| **Bulking Guide** | Lean mass gain strategies | TrendingUp (Emerald) |
| **Fat Loss Guide** | Sustainable cutting methods | Award (Red) |
| **Muscle Building** | Hypertrophy fundamentals | Dumbbell (Blue) |
| **Supplementation** | Evidence-based supplements | Pill (Purple) |
| **Best Exercises** | Top compound movements | Dumbbell (Yellow) |

Cards feature hover animations (scale transform on icons, color transitions on titles), and the section includes a prominent "Ask AI Coach" CTA button.

---

### 11. 📈 Body Progress Tracker — Measurement Dashboard

**Route:** `/progress`
**Component:** `src/app/progress/page.tsx`
**Storage:** `localStorage` (`forgefit_progress`)

A dedicated dashboard for tracking body composition changes over time. Fully self-contained page with:

#### Log Measurement Dialog
- **6 Supported Metrics:** Body Weight (kg), Waist Size (cm), Chest Size (cm), Arm Size (cm), Thigh Size (cm), Body Fat (%)
- **Input Fields:** Metric type (select dropdown), value (number with 0.1 step), date picker, optional notes
- **Unit Auto-Detection:** Automatically displays the correct unit (kg, cm, or %) based on selected metric

#### Interactive Progress Chart (Recharts)
- **Chart Type:** Responsive `LineChart` with smooth monotone curves
- **Metric Filter:** Dropdown to switch between all 6 metrics — chart re-renders instantly
- **Styling:** Dark themed with custom tooltip (backgroundColor: `#161b22`, rounded corners), emerald green line (#10b981), and semi-transparent grid lines
- **Data Points:** Circles on each data point with active dot enlargement on hover

#### Measurement History Table
- **Columns:** Metric name, value with auto-unit, notes (or "—" if empty), formatted date
- **Actions:** Per-row delete button with red hover effect
- **Styling:** Semi-transparent row hover, forge-border separators

---

### 12. 🏆 Personal Records Tracker — Strength Dashboard

**Route:** `/prs`
**Component:** `src/app/prs/page.tsx`
**Storage:** `localStorage` (`forgefit_prs`)

A dedicated dashboard for logging and tracking personal bests across major lifts:

#### Log PR Dialog
- **10 Supported Exercises:** Squat, Bench Press, Deadlift, Overhead Press, Barbell Row, Pull Up, Dips, Leg Press, Romanian Deadlift, Incline Bench Press
- **Input Fields:** Exercise (select dropdown), weight in kg (0.5 step), reps, date picker
- **Validation:** Submit button disabled until exercise and weight are filled

#### Strength Progress Chart (Recharts)
- **Exercise Filter:** Dropdown populated dynamically from logged exercises — only shows exercises you've actually recorded
- **Best PR Display:** Shows your all-time best for the selected exercise (e.g., "Best PR: 120 kg × 3") next to the filter
- **Chart Styling:** Orange line (#ff6b2b) matching ForgeFit's brand accent, with custom tooltip

#### PR History Table
- **Columns:** Exercise name (white, bold), weight in kg (forge-orange, bold), reps, formatted date
- **Actions:** Per-row delete button
- **Sort Order:** Most recent entries displayed first

---

## 📄 Page & Route Architecture

| Route | Rendering | Component Count | Description |
|-------|-----------|----------------|-------------|
| `/` | Server-rendered (SSR) | 12 sections + AI Coach dialog | Main landing page — single-page scrollable layout with anchor-link navigation. Contains all calculators, AI features, timer, planner, and knowledge base. |
| `/progress` | Client-rendered (CSR) | 1 page component | Body progress dashboard — standalone page with its own header, log dialog, Recharts chart, and history table. Data stored in localStorage. |
| `/prs` | Client-rendered (CSR) | 1 page component | Personal records dashboard — standalone page with its own header, log dialog, Recharts chart, and history table. Data stored in localStorage. |

---

## 🧩 Component Architecture

```
src/components/
├── sections/                          # 12 page section components
│   ├── navbar.tsx                     # [135 lines] Fixed nav with 9 links, "More" dropdown,
│   │                                  #   mobile hamburger menu, AI Coach CTA button
│   ├── hero.tsx                       # [95 lines] Animated hero with radial glow, gradient
│   │                                  #   text, dual CTA buttons, 3 animated stat counters
│   ├── calculator.tsx                 # [215 lines] TDEE/BMR/macro calculator using
│   │                                  #   Mifflin-St Jeor equation, 5 activity levels
│   ├── toolkit.tsx                    # [305 lines] 5-tab calculator suite: BMI (body mass
│   │                                  #   index), 1RM (Epley formula), Body Fat (Navy method),
│   │                                  #   Water Intake, Sleep Cycles
│   ├── macro-breakdown.tsx            # [234 lines] AI macro analyzer — input foods, get
│   │                                  #   per-food breakdown with totals and insights
│   ├── exercise-guide.tsx             # [219 lines] AI exercise encyclopedia — search any
│   │                                  #   exercise for muscles, form, mistakes, variations
│   ├── diet-architect.tsx             # [270 lines] AI meal plan generator — calories, protein,
│   │                                  #   goal, meals, restrictions → structured daily plan
│   ├── roadmap.tsx                    # [245 lines] AI training roadmap — starting point, goal,
│   │                                  #   timeframe, equipment → phased periodized program
│   ├── workout-timer.tsx              # [293 lines] Dual-mode timer: Rest Timer (preset/custom)
│   │                                  #   + HIIT Timer (work/rest/rounds) with SVG circular display
│   ├── phase-planner.tsx              # [140 lines] Training block planner with CRUD — cutting,
│   │                                  #   bulking, maintaining, deload phases with calorie targets
│   ├── knowledge-base.tsx             # [58 lines] Fitness education hub — 5 guide categories
│   │                                  #   with hover animations and AI Coach CTA
│   └── footer.tsx                     # [80 lines] Site footer with links and branding
│
├── ai-coach-dialog.tsx                # [154 lines] Floating chat widget — persistent conversation
│                                      #   history, streaming responses, animated message bubbles
└── ui/                                # shadcn/ui component primitives
    ├── button.tsx                     # Polymorphic button with size/variant CVA
    ├── card.tsx                       # Card, CardHeader, CardContent, CardTitle, CardDescription
    ├── dialog.tsx                     # Modal dialog with overlay, trigger, content
    ├── select.tsx                     # Custom select dropdown with styled options
    ├── input.tsx                      # Styled text/number/date inputs
    ├── label.tsx                      # Form labels
    ├── tabs.tsx                       # Tabbed interface primitives
    ├── badge.tsx                      # Small status badges
    └── table.tsx                      # Table components
```

**Total:** ~2,400+ lines of hand-written, typed component code across 14 feature components.

---

## 🎨 Design System & UI Philosophy

### Custom CSS Design Tokens

```css
@theme {
  --color-forge-orange: #ff6b2b;
  --color-forge-orange-light: #ff8c5a;
  --color-forge-card: #0d1117;
  --color-forge-border: #1e293b;
  --color-background: #030712;
  --color-foreground: #f8fafc;
}
```

### Custom Utility Classes

| Class | Effect |
|-------|--------|
| `glass-card` | Semi-transparent card with `backdrop-blur-xl`, subtle border, and dark gradient background |
| `glass-nav` | Navigation-specific glassmorphism with higher blur and fixed positioning |
| `text-gradient-forge` | Orange-to-light-orange gradient text using `background-clip: text` |
| `glow-orange` | Outer glow effect using `box-shadow` with forge-orange color |
| `glow-text` | Text shadow glow for hero headings |

### Design Principles

1. **Dark-First Design** — Every component is designed exclusively for dark mode with high contrast ratios (WCAG AA compliant). Background is true dark (#030712), not grey.

2. **Glassmorphism** — Cards use `backdrop-blur-xl` with semi-transparent backgrounds (`rgba` values) and subtle borders, creating a frosted glass depth effect.

3. **Micro-Animations Everywhere** — Every interactive element has hover states, transitions, and Framer Motion animations. Cards scale on hover, icons rotate, text changes color, buttons glow.

4. **Color-Coded Semantics** — Orange = primary/CTA, Emerald = success/growth, Red = danger/delete, Blue = info, Yellow = warning/deload. Consistent across all components.

5. **Mobile-First Responsive** — All layouts use TailwindCSS responsive prefixes (`sm:`, `md:`, `lg:`) with mobile as the base. Navbar collapses to hamburger menu. Grids adjust from 1 to 2 to 3 columns.

6. **Typography Hierarchy** — Clear heading progression: Hero h1 (7xl), Section h2 (4xl), Card h3 (lg), Body text (base), Labels (sm), Captions (xs). All using system font stack with tracking adjustments.

---

## 📡 API Endpoints Reference

All endpoints are Next.js API routes (server-side only). API key is never exposed to the client.

| Method | Endpoint | Request Body | Response | Groq Model |
|--------|----------|-------------|----------|------------|
| `POST` | `/api/ai/coach` | `{ messages: [{ role, content }] }` | `{ response: string }` | llama-3.3-70b-versatile |
| `POST` | `/api/ai/macros` | `{ foods: string }` | `{ foods: [{name, calories, protein, carbs, fat}], totals, insights }` | llama-3.3-70b-versatile |
| `POST` | `/api/ai/exercise` | `{ exercise: string }` | `{ muscles, steps[], mistakes[], tips[], variations[] }` | llama-3.3-70b-versatile |
| `POST` | `/api/ai/diet` | `{ calories, protein, goal, meals, restrictions }` | `{ meals: [{ name, foods[] }], dailyTotals }` | llama-3.3-70b-versatile |
| `POST` | `/api/ai/roadmap` | `{ start, goal, timeframe, equipment }` | `{ phases: [{ name, duration, workouts[], milestones[] }] }` | llama-3.3-70b-versatile |

**Security:** All API routes run server-side. The `GROQ_API_KEY` is accessed via `process.env` and never sent to the client. Rate limiting is handled by Groq's API-level quotas.

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | ≥ 18.x | JavaScript runtime |
| npm | ≥ 9.x | Package manager |
| Groq API Key | — | Required for AI features ([Get free key](https://console.groq.com)) |

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/vishrutcodes/health-fitness-app-forgefit.git
cd health-fitness-app-forgefit

# Install dependencies (14 production + 6 dev dependencies)
npm install

# Create environment file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local

# Start development server (Turbopack — sub-100ms HMR)
npm run dev

# Open in browser
# → http://localhost:3000
```

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Groq API key for LLM inference. Get one free at [console.groq.com](https://console.groq.com). Powers all 5 AI features. |

> **Note:** If `GROQ_API_KEY` is not set, the application will still work — all non-AI features (calculators, timer, phase planner, progress tracking, PR tracking) function independently. Only the 5 AI features will show error states.

---

## 📁 Project Directory Structure

```
forgefit/
├── public/                              # Static assets
│   └── favicon.ico                      # App favicon
│
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── api/
│   │   │   └── ai/
│   │   │       ├── coach/route.ts       # AI Coach chat endpoint
│   │   │       ├── macros/route.ts      # Macro analysis endpoint
│   │   │       ├── exercise/route.ts    # Exercise guide endpoint
│   │   │       ├── diet/route.ts        # Diet plan endpoint
│   │   │       └── roadmap/route.ts     # Training roadmap endpoint
│   │   │
│   │   ├── progress/
│   │   │   └── page.tsx                 # Body progress dashboard (CSR)
│   │   │
│   │   ├── prs/
│   │   │   └── page.tsx                 # Personal records dashboard (CSR)
│   │   │
│   │   ├── globals.css                  # Design tokens, custom utilities, animations
│   │   ├── layout.tsx                   # Root layout (metadata, fonts, body)
│   │   └── page.tsx                     # Landing page (composes 12 sections)
│   │
│   ├── components/
│   │   ├── sections/                    # 12 page section components (see above)
│   │   ├── ui/                          # 9 shadcn/ui primitives
│   │   └── ai-coach-dialog.tsx          # Floating AI chat widget
│   │
│   └── lib/
│       ├── groq.ts                      # Groq SDK client initialization
│       └── utils.ts                     # cn() utility for class merging
│
├── .env.local                           # Environment variables (gitignored)
├── .gitignore                           # Files excluded from version control
├── eslint.config.mjs                    # ESLint configuration
├── next.config.ts                       # Next.js configuration
├── package.json                         # Dependencies & npm scripts
├── postcss.config.mjs                   # PostCSS configuration (TailwindCSS)
├── tsconfig.json                        # TypeScript configuration
└── README.md                            # This file
```

---

## ⚡ Performance & Optimization

| Metric | Implementation |
|--------|---------------|
| **Bundler** | Turbopack (Rust-based) — sub-100ms HMR, 10x faster than Webpack |
| **Server Components** | Landing page sections render on the server, reducing client JS bundle |
| **Client Components** | Only interactive sections use `"use client"` — calculators, AI features, timer |
| **Code Splitting** | Next.js automatic code splitting — `/progress` and `/prs` pages are separate chunks |
| **Font Loading** | System font stack — no external font requests, zero CLS |
| **Image Optimization** | SVG icons via Lucide React — no raster images to optimize |
| **CSS** | TailwindCSS purges unused styles in production — minimal CSS footprint |
| **API Security** | All AI API keys are server-side only — never exposed to client bundle |

---

## 🔮 Future Enhancements

- [ ] **Supabase Authentication** — Implement email/password and OAuth (Google, GitHub) sign-in using Supabase Auth with Row Level Security (RLS). Users will be able to create accounts, log in, and have their sessions managed securely via Supabase's JWT-based auth system with middleware-protected routes.
- [ ] **Cloud Data Storage (Supabase PostgreSQL)** — Migrate Progress and PR data from localStorage to Supabase's PostgreSQL database. This will enable cross-device syncing, data persistence beyond the browser, and multi-user support. Schema will include `user_profiles`, `personal_records`, and `progress_logs` tables with RLS policies ensuring users can only access their own data.
- [ ] **Progressive Web App (PWA)** — Offline support with service worker caching
- [ ] **Workout Library** — Pre-built workout programs (PPL, PHUL, Starting Strength)
- [ ] **Dark/Light Theme Toggle** — System-preference-aware theme switching
- [ ] **Export Data** — CSV/PDF export for progress reports and PR history
- [ ] **Workout Logging** — Full set-by-set workout tracking with volume analysis
- [ ] **Community Features** — Share PRs, compare progress with friends
- [ ] **Wearable Integration** — Sync with Fitbit/Apple Watch for heart rate and step data

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### Built with 🔥 by [Vishrut Gupta](https://github.com/vishrutcodes)

**If you found this project useful or impressive, please give it a ⭐ on GitHub!**

*ForgeFit — Because your physique deserves intelligent guidance.*

</div>
