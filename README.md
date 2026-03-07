<div align="center">

# 🔥 ForgeFit — AI-Powered Fitness & Nutrition Platform

### *Forge Your Dream Physique*

A premium, full-stack fitness web application powered by **AI** — enabling users to generate personalized workout plans, analyze nutrition, track body progress, log personal records, and get real-time coaching guidance. Built with **Next.js 16**, **TypeScript**, **TailwindCSS v4**, and the **Groq LLM API**.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-ForgeFit-FF6B2B?style=for-the-badge)](https://health-fitness-app-forgefit.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/vishrutcodes/health-fitness-app-forgefit)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Pages & Components](#-pages--components)
- [AI Integration](#-ai-integration)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [LinkedIn Description](#-linkedin-description)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## 🚀 About The Project

**ForgeFit** is a comprehensive, AI-driven fitness platform designed to serve as a one-stop solution for fitness enthusiasts, beginners, and athletes. It combines **intelligent workout planning**, **real-time nutritional analysis**, **body progress tracking**, and **personal record management** into a beautifully crafted, responsive web experience.

The platform leverages **Groq's LLaMA 3.3 70B model** to power 5 distinct AI features — from an interactive AI coach that answers fitness questions in real-time, to intelligent diet plan generation and exercise form guidance. All AI responses are structured as JSON and rendered in rich, interactive UI components.

### What Makes ForgeFit Stand Out:
- 🤖 **5 AI-Powered Features** — Coach, Macro Analyzer, Exercise Guide, Diet Architect, Fitness Roadmap
- 📊 **Data Visualization** — Interactive Recharts graphs for tracking body measurements and strength progress
- 🎨 **Premium Dark-Mode UI** — Glassmorphism, smooth animations, and a cohesive design system using custom CSS tokens
- ⚡ **Blazing Fast** — Built on Next.js 16 with Turbopack for sub-second HMR and optimized production builds
- 📱 **Fully Responsive** — Pixel-perfect across desktop, tablet, and mobile viewports
- 🧮 **12+ Interactive Tools** — Calculators, timers, planners, and knowledge resources

---

## ✨ Key Features

### 🤖 AI-Powered Features (Groq LLaMA 3.3 70B)

| Feature | Description | Endpoint |
|---------|-------------|----------|
| **AI Coach** | Real-time conversational fitness assistant. Ask about workouts, nutrition, supplements, recovery, and more. Maintains chat history for contextual responses. | `POST /api/ai/coach` |
| **Macro Breakdown** | Input any food items and get detailed per-food macronutrient analysis (calories, protein, carbs, fat) with daily totals and AI-powered nutritional insights. | `POST /api/ai/macros` |
| **Exercise Guide** | Search any exercise to get comprehensive form guidance: target muscles, step-by-step technique, common mistakes, pro tips, and clickable variations. | `POST /api/ai/exercise` |
| **Diet Architect** | Generate personalized meal plans based on calorie targets, protein goals, dietary preferences, and restrictions. Returns structured meals with food breakdowns. | `POST /api/ai/diet` |
| **Fitness Roadmap** | Create phased training programs with progressive overload. Input your starting point, goal, timeframe, and equipment — get a detailed periodized plan. | `POST /api/ai/roadmap` |

### 📊 Progress Tracking

| Feature | Description | Data Storage |
|---------|-------------|--------------|
| **Body Progress** (`/progress`) | Track 6 body metrics over time: Body Weight (kg), Waist Size (cm), Chest Size (cm), Arm Size (cm), Thigh Size (cm), Body Fat (%). Interactive line charts with metric filtering, measurement logging dialog, and full history table with delete functionality. | `localStorage` |
| **Personal Records** (`/prs`) | Log and track your best lifts across 10 exercises: Squat, Bench Press, Deadlift, Overhead Press, Barbell Row, Pull Up, Dips, Leg Press, Romanian Deadlift, Incline Bench Press. Visualize strength progress with per-exercise charts, best PR highlights, and sortable history. | `localStorage` |

### 🧮 Fitness Calculators & Tools

| Tool | Description |
|------|-------------|
| **BMI Calculator** | Calculate Body Mass Index with visual classification (underweight, normal, overweight, obese) |
| **TDEE Calculator** | Estimate Total Daily Energy Expenditure based on activity level, age, weight, height, and gender |
| **1RM Calculator** | Predict one-rep max from submaximal lifts using the Epley formula |
| **Body Fat Estimator** | Estimate body fat percentage using the U.S. Navy method (neck, waist, hip circumference) |
| **Workout Timer** | Configurable interval timer with work/rest periods, round tracking, audio cues, and visual countdown |
| **Phase Planner** | Plan periodized training blocks (hypertrophy, strength, peaking, deload) with calendar-based scheduling |
| **Knowledge Base** | Curated fitness education covering training principles, nutrition science, recovery protocols, and supplementation |

---

## 🛠 Tech Stack

### Core Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | React meta-framework with App Router, Server Components, API Routes |
| **React** | 19.2.3 | UI library with Hooks, Server/Client Components |
| **TypeScript** | 5.x | Type-safe development across the entire codebase |
| **TailwindCSS** | 4.x | Utility-first CSS framework with custom design tokens |

### AI & Data
| Technology | Purpose |
|-----------|---------|
| **Groq SDK** | LLM inference API — uses LLaMA 3.3 70B Versatile model |
| **Recharts** | Data visualization library for progress tracking charts |
| **localStorage** | Client-side persistent storage for progress & PR data |

### UI & Animation
| Technology | Purpose |
|-----------|---------|
| **shadcn/ui** (Base UI) | Headless, accessible component primitives (Dialog, Select, Button, Card, etc.) |
| **Framer Motion** | Declarative animations, page transitions, micro-interactions |
| **Lucide React** | Modern icon library (100+ icons used throughout the app) |
| **tsParticles** | Animated particle backgrounds for the hero section |

### Development & Deployment
| Technology | Purpose |
|-----------|---------|
| **Turbopack** | Next.js bundler for instant HMR during development |
| **ESLint** | Code quality and consistency |
| **PostCSS** | CSS processing pipeline for TailwindCSS |
| **Vercel** | Production deployment with edge functions and CDN |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │ Homepage │ │ Progress │ │   Personal Records│   │
│  │ (SSR)    │ │ (CSR)    │ │   (CSR)           │   │
│  └────┬─────┘ └────┬─────┘ └────────┬──────────┘   │
│       │             │                │              │
│       │        localStorage      localStorage       │
│       │                                             │
│  ┌────┴─────────────────────────────────────────┐   │
│  │              12 Section Components            │   │
│  │  Hero · Calculator · Toolkit · Diet · Roadmap │   │
│  │  Exercise · Timer · Planner · Knowledge · ... │   │
│  └────┬──────────────────────────────────────────┘   │
└───────┼─────────────────────────────────────────────┘
        │ fetch()
┌───────┼─────────────────────────────────────────────┐
│       ▼         SERVER (Next.js API Routes)          │
│  ┌──────────────────────────────────────────────┐   │
│  │              /api/ai/*                        │   │
│  │  /coach · /macros · /exercise · /diet · /roadmap │
│  └──────────────────┬───────────────────────────┘   │
│                     │                                │
│                     ▼                                │
│            ┌─────────────────┐                       │
│            │   Groq LLM API  │                       │
│            │  LLaMA 3.3 70B  │                       │
│            └─────────────────┘                       │
└──────────────────────────────────────────────────────┘
```

---

## 📄 Pages & Components

### Page Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server-rendered | Main landing page with all 12 interactive sections, AI coach dialog, navbar, and footer |
| `/progress` | Client-rendered | Body progress dashboard — log measurements, view charts, manage history |
| `/prs` | Client-rendered | Personal records dashboard — log lifts, track PRs, visualize strength gains |

### Component Architecture (12 Sections)

```
src/components/sections/
├── navbar.tsx           → Responsive nav with dropdown, mobile menu, 9 links
├── hero.tsx             → Animated hero with particle background, CTA buttons
├── calculator.tsx       → 4-in-1 fitness calculator (BMI, TDEE, 1RM, Body Fat)
├── toolkit.tsx          → Interactive fitness toolkit with multiple tools
├── macro-breakdown.tsx  → AI-powered food macro analysis with per-item breakdown
├── diet-architect.tsx   → AI meal plan generator with preference inputs
├── exercise-guide.tsx   → AI exercise search with form tips & variations
├── roadmap.tsx          → AI training roadmap with phased periodization
├── workout-timer.tsx    → Configurable interval timer with audio & visual cues
├── phase-planner.tsx    → Training phase calendar & block periodization planner
├── knowledge-base.tsx   → Fitness education with categorized topics
└── footer.tsx           → Site footer with links and branding
```

---

## 🤖 AI Integration

All AI features use **Groq's inference API** with the `llama-3.3-70b-versatile` model. Each endpoint includes:

- **Specialized System Prompts** — Tailored instructions ensuring domain-specific, accurate fitness responses
- **Structured JSON Output** — All AI responses are parsed as JSON and rendered in rich UI components
- **Error Handling** — Graceful fallbacks with user-friendly error messages
- **Rate Limiting** — Server-side API routes prevent direct client exposure of API keys

```typescript
// Example: AI Coach API Route
const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: FITNESS_COACH_PROMPT },
    ...userMessages,
  ],
  temperature: 0.7,
  max_tokens: 1024,
});
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or later
- **npm** or **yarn**
- **Groq API Key** — [Get one free at groq.com](https://console.groq.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/vishrutcodes/health-fitness-app-forgefit.git
cd health-fitness-app-forgefit

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your Groq API key to .env.local:
# GROQ_API_KEY=your_groq_api_key_here

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | API key for Groq's LLM inference (powers all AI features) |

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
forgefit/
├── src/
│   ├── app/
│   │   ├── api/ai/              # 5 AI API routes (coach, macros, exercise, diet, roadmap)
│   │   ├── progress/page.tsx    # Body progress tracking dashboard
│   │   ├── prs/page.tsx         # Personal records tracking dashboard  
│   │   ├── layout.tsx           # Root layout with metadata & fonts
│   │   ├── page.tsx             # Main landing page
│   │   └── globals.css          # Design system tokens & global styles
│   ├── components/
│   │   ├── sections/            # 12 page section components
│   │   ├── ui/                  # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   │   └── ai-coach-dialog.tsx  # Floating AI chat dialog
│   └── lib/
│       ├── groq.ts              # Groq SDK client initialization
│       └── utils.ts             # Utility functions (cn, etc.)
├── .env.local                   # Environment variables (not committed)
├── tailwind.config.ts           # TailwindCSS v4 configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

---

## 📝 LinkedIn Description

> **Copy-paste the following for your LinkedIn Projects section:**

---

**ForgeFit — AI-Powered Fitness & Nutrition Platform**

Built a full-stack AI-powered fitness web application using Next.js 16, TypeScript, TailwindCSS v4, and the Groq LLM API (LLaMA 3.3 70B). The platform features 5 AI-driven tools (real-time coaching chat, macro analysis, exercise form guidance, personalized diet plans, and periodized training roadmaps), along with body progress tracking with interactive Recharts visualizations, personal record logging, 4 fitness calculators (BMI, TDEE, 1RM, Body Fat), an interval workout timer, a phase training planner, and a fitness knowledge base — totaling 12+ interactive features across 3 distinct pages.

Key Highlights:
• Integrated Groq's LLaMA 3.3 70B model via 5 server-side API routes with structured JSON output
• Built responsive, premium dark-mode UI with glassmorphism, Framer Motion animations, and shadcn/ui components
• Implemented client-side data persistence with localStorage for progress tracking and PR management
• Deployed on Vercel with CI/CD from GitHub

Tech Stack: Next.js 16 · React 19 · TypeScript · TailwindCSS v4 · Groq AI (LLaMA 3.3 70B) · Recharts · Framer Motion · shadcn/ui · Vercel

🔗 Live: https://health-fitness-app-forgefit.vercel.app
💻 Code: https://github.com/vishrutcodes/health-fitness-app-forgefit

---

## 🎨 Design System

ForgeFit uses a custom design system built on TailwindCSS v4 with carefully crafted CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--forge-orange` | `#ff6b2b` | Primary accent, CTAs, highlights |
| `--forge-orange-light` | `#ff8c5a` | Hover states, gradients |
| `--forge-card` | `#0d1117` | Card backgrounds |
| `--forge-border` | `#1e293b` | Subtle borders |
| `--background` | `#030712` | Page background |

### Design Principles
- **Glassmorphism** — Semi-transparent cards with backdrop blur for depth
- **Micro-animations** — Hover effects, loading states, and smooth transitions
- **Dark-first** — Designed exclusively for dark mode with high contrast ratios
- **Mobile-first** — Responsive layouts that adapt seamlessly across all viewports

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with 🔥 by [Vishrut Gupta](https://github.com/vishrutcodes)**

*If you found this useful, give it a ⭐ on GitHub!*

</div>
