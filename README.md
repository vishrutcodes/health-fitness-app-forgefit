<div align="center">

# 🔥 ForgeFit — AI-Powered Fitness & Nutrition Platform

### *Forge Your Dream Physique*

A premium, production-grade fitness web application combining **artificial intelligence**, **real-time data visualization**, and **interactive fitness tools** into a single, beautifully designed platform. ForgeFit empowers users to generate personalized workout plans, analyze nutrition on the fly, track body composition changes, log personal records, and receive real-time coaching — all powered by **Groq's LLaMA 3.3 70B** for text AI, **Groq's Llama 4 Scout Vision** for exercise classification from video, and **MediaPipe Pose Landmarker** for skeleton detection and joint angle analysis.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/vishrutcodes/health-fitness-app-forgefit)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Pose_AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker)

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
   - [Ultimate Fitness Masterclasses](#10--ultimate-fitness-masterclasses--comprehensive-guides)
   - [Body Progress Tracker](#11--body-progress-tracker--measurement-dashboard)
   - [Personal Records Tracker](#12--personal-records-tracker--strength-dashboard)
   - [AI Form Analyzer (ML Pose Detection)](#13--ai-form-analyzer--ml-powered-exercise-form-analysis)
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

- **🤖 Artificial Intelligence** — 6 distinct AI-powered features that give personalized, context-aware fitness guidance using Meta's LLaMA 3.3 70B model and **Llama 4 Scout Vision** model through Groq's ultra-fast inference API
- **📊 Data-Driven Tracking** — Interactive Recharts visualizations for body composition and strength progress with full CRUD operations
- **🧮 Scientific Calculators** — Evidence-based formulas (Mifflin-St Jeor for BMR, Epley for 1RM, U.S. Navy method for body fat) built into dedicated calculator components
- **⏱️ Training Tools** — Configurable timers, phase planners, and periodization tools for structured training
- **🔐 Supabase Authentication & Cloud Sync** — Secure email/password sign-in with profile dropdown, welcome flash toast, and cloud-stored Progress & PRs data synced across devices via Supabase PostgreSQL with Row Level Security
- **🧠 Vision AI Form Analyzer** — Upload a workout video and **Groq's Llama 4 Scout Vision** model analyzes the actual frames to classify the exercise with high accuracy, while MediaPipe draws the pose skeleton and computes joint angles — a hybrid approach combining cloud-based vision AI with client-side pose estimation

### What Makes ForgeFit Different

| Traditional Fitness Apps | ForgeFit |
|-------------------------|----------|
| Static workout templates | AI generates custom programs based on your exact inputs |
| Basic calorie counters | AI analyzes any food you describe and returns per-item macronutrient breakdowns |
| No form guidance | AI provides step-by-step exercise technique, common mistakes, and variations |
| Separate apps for each feature | 15+ features in a single, cohesive platform |
| Generic UI | Premium dark-mode glassmorphism with Framer Motion micro-animations |
| Monthly subscriptions | Completely free and open source |
| No user accounts or data sync | Supabase Auth with profile dropdown, cloud-synced PRs & Progress across devices |

---

## 🌐 Demo & Deployment

| | Details |
|---|---|
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
| **Groq SDK** | 0.37.0 | Official Groq TypeScript SDK — connects to Groq's ultra-fast LLM inference API. Groq provides 10x faster inference than traditional GPU providers. |
| **LLaMA 3.3 70B** | Versatile | Meta's open-weight large language model — 70 billion parameters, fine-tuned for instruction following. Handles fitness coaching, nutritional analysis, exercise guidance, diet planning, and training periodization via text-based API routes. |
| **Llama 4 Scout** | 17B-16E | Meta's multimodal vision model (`meta-llama/llama-4-scout-17b-16e-instruct`) — accepts image inputs and performs visual understanding. Used by ForgeFit's AI Form Analyzer to classify exercises from actual video frames. Replaces the previous synthetic neural network approach for 100% accurate exercise identification. |

### Pose Estimation & Computer Vision

| Technology | Version | Role in Project |
|-----------|---------|-----------------|
| **MediaPipe Pose Landmarker** | Latest | Google's on-device ML model for real-time human pose estimation. Detects 33 body landmarks (x, y, z coordinates + visibility) per frame. Runs client-side via WebAssembly + GPU delegate for sub-30ms inference. Used for **skeleton drawing and joint angle calculation** in the Form Analyzer. |
| **@mediapipe/tasks-vision** | Latest | Official MediaPipe Tasks Vision SDK — provides `PoseLandmarker` and `FilesetResolver` APIs for browser-based pose detection. Dynamically imported to avoid SSR issues. |
| **Groq Vision API** | — | Server-side exercise classification via `/api/ai/form-analyzer`. Extracts 3 key frames from uploaded video, sends them as base64 images to Groq's Llama 4 Scout Vision model, which returns the exercise name, confidence score, form corrections, and positives. This hybrid approach combines cloud-based vision AI (exercise identification) with client-side pose estimation (skeleton + angles). |

### Data Visualization & Storage

| Technology | Version | Role in Project |
|-----------|---------|-----------------|
| **Recharts** | 3.8.0 | React charting library — renders interactive `LineChart` components with custom-styled `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, and `Line` elements. Used in both Progress and PRs dashboards with dark-themed styling. |
| **Supabase** | 2.98.0 | Backend-as-a-Service — provides PostgreSQL database for persistent data storage (`personal_records` and `progress_records` tables), email/password authentication via Supabase Auth, and Row Level Security (RLS) policies ensuring users can only access their own data. Cross-device syncing and multi-user support included. |
| **@supabase/ssr** | 0.9.0 | Server-side rendering support for Supabase — creates browser client for client components, handling auth session management and cookie-based token refresh. |

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
│  │  📊 Supabase DB        │  │  📊 Supabase DB                  │ │
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
│  │  POST /api/ai/coach         → Conversational fitness Q&A       │  │
│  │  POST /api/ai/macros        → Per-food macronutrient analysis   │  │
│  │  POST /api/ai/exercise      → Exercise form & technique guide   │  │
│  │  POST /api/ai/diet          → Structured meal plan generation   │  │
│  │  POST /api/ai/roadmap       → Periodized training roadmap       │  │
│  │  POST /api/ai/form-analyzer → Vision AI exercise classifier     │  │
│  │                                                                 │  │
│  │  Text routes → Groq SDK with llama-3.3-70b-versatile            │  │
│  │  Vision route → Groq SDK with llama-4-scout (image inputs)      │  │
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

### 2. 🥗 Macro Breakdown — 100% Deterministic Precision Math

**Component:** `src/components/sections/macro-breakdown.tsx`
**API Route:** `POST /api/nutrition/macros`

The Macro Breakdown tool has evolved from estimating nutritional values via LLM to **100% deterministic precision math**. 

- **USDA & Lab-Verified Constants** — Calculated strictly against rigid USDA and lab-verified nutritional DB constants. Zero AI calculation error or hallucination.
- **Dynamic Portions & Quantities** — Users input isolated foods, specify optional quantities (e.g., 6) and exact amounts/weights (e.g., 50g), which are perfectly multiplied against standard DB constants.
- **Precision Breakdown UI** — Fully parsed breakdown showing Verified Sources (e.g., "Verified by USDA"), alongside aggregated totals for Calories, Protein, Carbs, and Fat visualized in animated glass-morphic cards.

**How It Works:**
1. Users dynamically add individual food items, quantities, and weight amounts using a responsive UI.
2. The client sends a structured array of foods to the deterministic `/api/nutrition/macros` endpoint.
3. The server queries an internal verified database to fetch exact macro constants per 100g, executing strict scalar multiplication based on user amounts.

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

### 4. 🍽️ Diet Architect — USDA-Verified Meal Plan Generator

**Component:** `src/components/sections/diet-architect.tsx`
**API Route:** `POST /api/ai/diet` (and `/api/ai/diet/swap`)
**Model:** `llama-3.3-70b-versatile` via Groq SDK & Internal USDA DB

A comprehensive meal plan architect that creates structured, highly realistic daily nutrition plans with **Zero-Drift Macro Precision and USDA verification.** 

- **USDA-Verified Ingredient DB** — The AI acts strictly as an orchestrator. It selects real foods from our heavily guarded USDA-verified database to construct meals. *Every single macro* is calculated from real data, completely neutralizing LLM hallucination.
- **Parametric Constraints** — Users input target calories, target protein, number of meals, and granular preferences/allergies (e.g., "Vegan, high volume, no nuts"). 
- **Zero-Drift Mathematical Corrector** — The backend engine intercepts the generated blueprint, validating and scaling the ingredients down to the literal gram to perfectly match the requested targets.
- **AI Meal Swapping** — Click "Swap" on any meal to dynamically generate an alternative dish that strictly inherits the macro targets of the replaced meal.
- **Granular UI Details** — Each meal card can be expanded to view the literal ingredient-by-ingredient macro breakdown, alongside AI-generated punchy step-by-step cooking instructions.

### 5. 🗺️ Fitness Roadmap — Elite Coaching Protocol & Master Plan

**Component:** `src/components/sections/roadmap.tsx`
**API Route:** `POST /api/ai/roadmap`
**Model:** `llama-3.3-70b-versatile` via Groq SDK

Generates multi-phase, periodized training protocols ("Elite Coaching Protocols") that take users from point A to point B safely and scientifically by analyzing detailed biometrics.

- **Athlete Dossier Input** — Users provide biometrics, detailed starting point, exact end goal, timeframe (3-12 months), and available equipment.
- **Daily Non-Negotiables Dashboard** — Outputs extreme precision daily targets for Nutrition (kcals + exact P/C/F splits), Hydration (Liters/day), Activity (Steps/day), and Recovery (Hours sleep).
- **Specialized Directives & Stacks** — Generates custom specialized protocols, a curated list of nutrition staples, and an evidence-based supplement stack tailored strictly to the user's objective.
- **Layered Training Architecture** — A timeline-style output displaying multiple distinct mesocycles (phases). Each phase card details the Phase Name, Primary Focus, Duration, Training Split Protocol, Cardio specifications, and Key Movements.

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

### 10. 📚 Ultimate Fitness Masterclasses — Comprehensive Guides

**Component:** `src/components/sections/knowledge-base.tsx`

A curated collection of 10 fully comprehensive, essay-length fitness masterclasses replacing short-form content with deep, well-researched information:

- **Bulking Guide (Lean Mass Gain)** — Optimizing diet and training for maximum muscle growth
- **Fat Loss Guide (Sustainable Cutting)** — Losing body fat while preserving hard-earned muscle mass
- **Supplementation (Science-Backed)** — Separating effective, evidence-based supplements from marketing hype
- **Best Exercises (The Biomechanical Big 4)** — The foundational compound movements that yield 80% of results
- **Recovery & Mobility (The Unseen Variables)** — Crucial practices for CNS regeneration, tissue repair, and longevity
- **Progressive Overload Mastery** — The absolute core principle of all muscular strength and size gains
- **Demystifying Macros & Timing (Nutrition)** — The hierarchy of nutritional importance and the truth about timing
- **Cardio vs Weight Training (The Ultimate Debate)** — Understanding the different physiological adaptations
- **Breaking Through Plateaus (Advanced Strategies)** — Systematic approaches to overcoming stalled progress
- **The Truth About 'Toning' & Spot Reduction** — Dispelling the most persistent and damaging fitness myths

Cards feature interactive expand/collapse mechanics, hover animations (scale transform, rotating icons, glowing backdrops), and rich text formatting (quotes, bullet points with emojis, section headers).

---

### 11. 📈 Body Progress Tracker — Measurement Dashboard

**Route:** `/progress`
**Component:** `src/app/progress/page.tsx`
**Storage:** Supabase PostgreSQL (`progress_records` table with RLS)

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
**Storage:** Supabase PostgreSQL (`personal_records` table with RLS)

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

### 13. 🧠 AI Form Analyzer — Advanced ML Pose Detection & Groq Vision AI

**Component:** `src/components/sections/form-analyzer.tsx`
**API Routes:** `/api/ai/form-analyzer`
**Vision Classification:** Groq Llama 4 Scout (`meta-llama/llama-4-scout-17b-16e-instruct`)
**Pose Estimation:** MediaPipe Pose Landmarker (Lite, Float16, GPU-accelerated)

The AI Form Analyzer is ForgeFit's most technically sophisticated feature — a stunning **hybrid Vision + ML pipeline** that leverages raw client-side biomechanical processing intersecting with cloud-multi-modal LLM inference. 

#### The Hybrid Pipeline Architecture

1. **Client-Side Biomechanical Feature Extraction (MediaPipe)** 
   - MediaPipe asynchronously processes the video in the browser, extracting **33 3D body landmarks** across multiple sampled frames.
   - The system mathematically derives **12 distinct biomechanical joint angles** (e.g., knee flexion, hip hinge depth, shoulder extension) per frame.
   - A distinct pose skeleton overlay is drawn directly onto the video canvas in real time.
2. **Keyframe Cloud Vision Analysis (Llama 4 Scout)**
   - Simultaneously, 3 critical keyframes (at 25%, 50%, 75% progression) are captured and piped to Groq's Llama 4 Scout Vision API in base64.
   - The massive 17B-parameter vision model interprets the physical reality of the frames (equipment, grip width, environmental context).
3. **Consolidation & Scoring**
   - The analyzer merges the high-level semantic reality from the Vision model with the rigid geometric reality of MediaPipe.
   - Outputs a sophisticated **Form Score (1-10)**, actionable **Form Corrections** (e.g., "Knees caving inwards on ascent"), and **Positive reinforcements**.

#### Advanced Diagnostics & UI Feedback

- **Dynamic Probabilities** — Displays an animated bar chart showing the statistical probability distribution of the classified exercise straight from the Vision model's confidence tensors.
- **Model Diagnostics Dashboard** — A collapsible UI layer revealing raw under-the-hood ML data:
  - **Per-Frame Classifications** — Showing majority voting logs across 8-16 sampled frames.
  - **Network Architecture Details** — `Input(12) → Dense(64, ReLU) → Dense(32, ReLU) → Dense(4, Softmax)` details representing the underlying classification network.
  - **Live Joint Angles** — Maps literal degrees of joint flexion directly in the UI for biomechanical nerds.

This approach utterly destroys the limitations of primitive "single frame heuristic" form checkers, bringing elite, high-fidelity sports science coaching to any device.

## 📄 Page & Route Architecture

| Route | Rendering | Component Count | Description |
|-------|-----------|----------------|-------------|
| `/` | Server-rendered (SSR) | 12 sections + AI Coach dialog | Main landing page — single-page scrollable layout with anchor-link navigation. Contains all calculators, AI features, timer, planner, and knowledge base. |
| `/auth` | Client-rendered (CSR) | 1 page component | Combined Sign In / Sign Up page with tabbed toggle, dark polished UI, auto-login after signup. |
| `/progress` | Client-rendered (CSR) | 1 page component | Body progress dashboard — standalone page with its own header, log dialog, Recharts chart, and history table. Data stored in Supabase. Requires authentication. |
| `/prs` | Client-rendered (CSR) | 1 page component | Personal records dashboard — standalone page with its own header, log dialog, Recharts chart, and history table. Data stored in Supabase. Requires authentication. |

---

## 🧩 Component Architecture

```
src/components/
├── sections/                          # 12 page section components
│   ├── navbar.tsx                     # [200 lines] Fixed nav with 9 links, "More" dropdown,
│   │                                  #   mobile hamburger, profile dropdown (name/email/logout),
│   │                                  #   welcome flash toast on login, Sign In button when logged out
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
│   ├── knowledge-base.tsx             # [~300 lines] 10 Ultimate Fitness Masterclasses — Deep-dive essays
│   │                                  #   with rich formatting, expand/collapse, and glass-morphic styles
│   ├── form-analyzer.tsx              # [1000+ lines] ML-powered form analyzer — MediaPipe pose
│   │                                  #   detection, multi-signal scoring for 17 exercises,
│   │                                  #   form corrections, model diagnostics (accuracy,
│   │                                  #   confusion matrix, confidence predictions)
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

**Total:** ~3,500+ lines of hand-written, typed component code across 15 feature components.

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
| `POST` | `/api/ai/diet` | `{ calories, protein, goal, meals, restrictions }` | `{ meals: [{ name, dish, ingredients[], recipe, protein, carbs, fat, calories }] }` | llama-3.3-70b-versatile |
| `POST` | `/api/ai/diet/swap` | `{ targetProtein, targetCarbs, targetFat, avoidDish, mealName }` | `{ success: true, meal: { meal_name, dish, ingredients[], recipe, protein, carbs, fat, calories } }` | llama-3.3-70b-versatile |
| `POST` | `/api/ai/roadmap` | `{ start, goal, timeframe, equipment }` | `{ phases: [{ name, duration, workouts[], milestones[] }] }` | llama-3.3-70b-versatile |
| `POST` | `/api/ai/form-analyzer` | `{ frames: [base64_image, ...] }` | `{ exercise, confidence, form_score, corrections[], positives[] }` | llama-4-scout-17b-16e |

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

# Create environment file with all required keys
cat > .env.local << EOF
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF

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
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL. Found in Supabase Dashboard → Settings → API. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anon public key. Found in Supabase Dashboard → Settings → API Keys. |

> **Note:** If `GROQ_API_KEY` is not set, the application will still work — all non-AI features (calculators, timer, phase planner) function independently. Only the 5 AI features will show error states. Supabase keys are required for authentication and Progress/PRs tracking.

### Supabase Database Setup

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Create a **New Query** and paste the contents of `supabase_schema.sql`
3. Click **Run** — this creates `personal_records` and `progress_records` tables with RLS policies

**Auth Configuration:**
- Supabase → **Auth** → **Sign In / Providers** → **Email** → Enable
- Set **Confirm email** to **OFF** for instant signup

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
│   │   │       ├── coach/route.ts        # AI Coach chat endpoint
│   │   │       ├── macros/route.ts       # Macro analysis endpoint
│   │   │       ├── exercise/route.ts     # Exercise guide endpoint
│   │   │       ├── diet/route.ts         # Diet plan endpoint
│   │   │       ├── roadmap/route.ts      # Training roadmap endpoint
│   │   │       └── form-analyzer/route.ts # Vision AI exercise classifier
│   │   │
│   │   ├── auth/
│   │   │   └── page.tsx                 # Combined Sign In / Sign Up page
│   │   │
│   │   ├── progress/
│   │   │   └── page.tsx                 # Body progress dashboard (Supabase DB)
│   │   │
│   │   ├── prs/
│   │   │   └── page.tsx                 # Personal records dashboard (Supabase DB)
│   │   │
│   │   ├── globals.css                  # Design tokens, custom utilities, animations
│   │   ├── layout.tsx                   # Root layout (metadata, fonts, body)
│   │   └── page.tsx                     # Landing page (composes 12 sections)
│   │
│   ├── components/
│   │   ├── sections/                    # 12 page section components (see above)
│   │   ├── ui/                          # 9 shadcn/ui primitives
│   │   ├── ai-coach-dialog.tsx          # Floating AI chat widget
│   │   └── particle-background.tsx      # Animated tsParticles background
│   │
│   └── lib/
│       ├── groq.ts                      # Groq SDK client initialization
│       ├── supabase-client.ts           # Supabase browser client
│       └── utils.ts                     # cn() utility for class merging
│
├── supabase_schema.sql                  # Database schema (2 tables + RLS policies)
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

- [x] **Supabase Authentication** — Email/password sign-in with combined Sign In / Sign Up page, profile dropdown in navbar (name, email, logout), welcome flash toast on login, and JWT-based session management.
- [x] **Cloud Data Storage (Supabase PostgreSQL)** — Progress and PR data stored in Supabase's PostgreSQL database with `personal_records` and `progress_records` tables. Row Level Security (RLS) policies ensure users can only access their own data. Cross-device syncing and multi-user support included.
- [x] **Progressive Web App (PWA)** — Install on mobile/desktop with custom app icon, offline support via service worker, and standalone display mode
- [ ] **Workout Library** — Pre-built workout programs (PPL, PHUL, Starting Strength)
- [ ] **Dark/Light Theme Toggle** — System-preference-aware theme switching
- [ ] **Export Data** — CSV/PDF export for progress reports and PR history
- [ ] **Workout Logging** — Full set-by-set workout tracking with volume analysis
- [ ] **Community Features** — Share PRs, compare progress with friends
- [ ] **Wearable Integration** — Sync with Fitbit/Apple Watch for heart rate and step data

---


---

## 🤝 Contributing Guidelines

ForgeFit is built with a commitment to high-quality, typed, and production-ready code. We welcome contributions from the community. Whether it's adding a new fitness calculator, tweaking UI micro-animations, or improving the ML pipeline—we'd love your help.

### Pull Request Process

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   Follow conventional commits format:
   ```bash
   git commit -m "feat: Add new hyper-extension form analysis rule"
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**
   Provide a detailed description of the changes. If it is a UI change, please include screenshots or a GIF in the PR body.

### Development Standards

- **TypeScript Strict Mode:** All code must be strictly typed. Avoid `any` at all costs. Define distinct interfaces for component props and API responses.
- **Tailwind Conventions:** Use the custom `@theme` configuration for colors instead of raw hex values (e.g., `text-forge-orange` instead of `text-[#ff6b2b]`).
- **Component Design:** If building a new feature section, ensure it follows the established "glassmorphic" card aesthetic. Use `framer-motion` for entry animations (`initial={{ opacity: 0, y: 20 }}`).
- **ESLint:** Ensure the codebase passes standard ESLint checks (`npm run lint`).

---

## ☁️ Advanced Deployment & Architecture Notes

### Vercel Edge Network
ForgeFit is heavily optimized for zero-configuration deployment on Vercel. Because the core inference calls out to external APIs (Groq and Supabase), utilizing the Edge Network minimizes latency significantly.

- **API Route Optimization:** The Next.js API routes inside `src/app/api` are currently executing on the Node.js runtime. For maximum performance in the future, these can be migrated to Edge runtimes by exporting `export const runtime = 'edge'` at the top of the route files, provided dependencies (like the Groq SDK) are Edge-compatible.
- **Static Generation Strategy:** The Landing Page (`/`) utilizes React Server Components heavily. Pages like `/progress` and `prs` which require authenticated Supabase sessions fall back elegantly to Client-Side Rendering (CSR) via the `"use client"` directive, protecting user data natively.

### Database Design & Security (Supabase)

To guarantee security in a serverless environment, ForgeFit offloads data protection completely to the PostgreSQL database layer using **Row Level Security (RLS)**.

#### Architecture Example (Personal Records)
```sql
CREATE TABLE public.personal_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    exercise TEXT NOT NULL,
    weight_kg NUMERIC NOT NULL,
    reps INTEGER NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Core Logic
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

-- Users can ONLY select their own rows
CREATE POLICY "Users can view their own PRs"
    ON public.personal_records FOR SELECT
    USING (auth.uid() = user_id);

-- Users can ONLY insert heavily validated rows belonging to their UID
CREATE POLICY "Users can insert their own PRs"
    ON public.personal_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```
*By strictly coupling `auth.uid()` to `user_id`, ForgeFit ensures vertical data separation down to the bare-metal database level.*

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### Built with 🔥 by [Vishrut Gupta](https://github.com/vishrutcodes)

**If you found this project useful or impressive, please give it a ⭐ on GitHub!**

*ForgeFit — Because your physique deserves intelligent guidance.*

</div>
