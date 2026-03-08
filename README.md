<div align="center">

# 🔥 ForgeFit — AI-Powered Fitness & Nutrition Platform

### *Forge Your Best Self*

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)](https://health-fitness-app-forgefit.vercel.app)

<br/>

**ForgeFit** is a premium, full-stack fitness web application built with **Next.js 16**, **Supabase**, and **AI-powered** features. It delivers a complete fitness ecosystem — from intelligent workout planning and macro tracking to real-time progress visualization — all wrapped in a stunning dark-themed UI with animated particles.

<br/>

[**🌐 Live Demo**](https://health-fitness-app-forgefit.vercel.app) · [**🐛 Report Bug**](https://github.com/vishrutcodes/health-fitness-app-forgefit/issues) · [**✨ Request Feature**](https://github.com/vishrutcodes/health-fitness-app-forgefit/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🧠 AI-Powered Modules](#-ai-powered-modules)
- [📊 Data & Analytics](#-data--analytics)
- [🔐 Authentication](#-authentication)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🗄️ Database Setup](#️-database-setup)
- [☁️ Deployment](#️-deployment)
- [📄 Environment Variables](#-environment-variables)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

ForgeFit packs **14+ interactive sections** into a single-page experience, with dedicated pages for tracking progress and personal records.

### 🏠 Core Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | **Hero** | Eye-catching landing with animated gradient text, CTAs, and stats |
| 2 | **Calculator** | BMI, TDEE, 1-Rep Max, and body fat percentage calculators |
| 3 | **Toolkit** | Curated collection of fitness tools and quick-access features |
| 4 | **Diet Architect** | AI-powered personalized meal plan generator based on your goals |
| 5 | **Macro Breakdown** | Visual macronutrient calculator with AI recommendations |
| 6 | **Roadmap** | AI-generated progressive training roadmaps for any goal |
| 7 | **Exercise Guide** | AI-powered exercise encyclopedia with form tips and variations |
| 8 | **Workout Timer** | Multi-mode timer (Stopwatch, Countdown, HIIT/Tabata intervals) |
| 9 | **Phase Planner** | AI-driven periodization planner for structured training cycles |
| 10 | **Knowledge Base** | Searchable fitness knowledge hub with categorized articles |
| 11 | **AI Coach** | Floating chatbot powered by Groq AI for real-time fitness advice |
| 12 | **Progress Tracker** | Body measurement logging with Recharts line graphs |
| 13 | **PR Tracker** | Personal record logging with strength progress visualization |

### 🎨 UI/UX Highlights

- 🌑 **Dark Theme** — Premium dark design with deep blacks and orange accents
- ✨ **Particle Background** — 165 animated tsParticles floating across the entire app
- 🎬 **Framer Motion Animations** — Smooth page transitions, hover effects, and micro-interactions
- 📱 **Fully Responsive** — Mobile-first design with hamburger menu and adaptive layouts
- 🔮 **Glassmorphism** — Glass-card effects with backdrop blur throughout the UI
- 🧭 **Centered Navbar** — Clean navigation with profile dropdown and "More" overflow

---

## 🧠 AI-Powered Modules

ForgeFit uses **5 dedicated AI API routes** powered by **Groq (LLaMA 3)** for ultra-fast inference:

| API Route | Feature | What It Does |
|-----------|---------|--------------|
| `/api/ai/coach` | AI Coach Chatbot | Real-time conversational fitness advice (floating dialog) |
| `/api/ai/diet` | Diet Architect | Generates personalized meal plans based on goals, allergies, and preferences |
| `/api/ai/exercise` | Exercise Guide | Returns detailed exercise info: muscles targeted, form cues, variations |
| `/api/ai/macros` | Macro Breakdown | Calculates and explains macronutrient splits with food recommendations |
| `/api/ai/roadmap` | Training Roadmap | Creates week-by-week progressive training plans for specific goals |

> All AI responses are streamed in real-time for instant feedback. No waiting — just pure speed.

---

## 📊 Data & Analytics

### Progress Tracker (`/progress`)
- Log body measurements: **body weight, waist, chest, arm, thigh, body fat %**
- **Recharts LineChart** visualizes trends over time
- Filter chart by any metric
- Full measurement history table with delete support
- Data persisted in **Supabase** `progress_records` table

### PR Tracker (`/prs`)
- Log personal records for **10 major lifts**: Squat, Bench, Deadlift, OHP, Rows, and more
- **Recharts LineChart** tracks strength progress per exercise
- **Best PR badge** highlights your all-time record
- Full PR history table with date and reps
- Data persisted in **Supabase** `personal_records` table

> Both pages use the **exact same architecture pattern** — consistent, clean, and maintainable.

---

## 🔐 Authentication

Powered by **Supabase Auth** with a seamless user experience:

| Feature | Details |
|---------|---------|
| **Single Auth Page** (`/auth`) | Combined Sign In / Sign Up with tabbed toggle |
| **Email + Password** | Secure authentication with 6+ char passwords |
| **Auto Sign-In** | After signup, session is created instantly (no email confirmation required) |
| **Profile Dropdown** | Navbar shows user initials → dropdown with name, email, and logout |
| **Welcome Flash** | Animated orange toast — *"Welcome back, [Name]! 🔥"* — on every login |
| **Row Level Security** | All DB data is scoped per-user via Supabase RLS policies |
| **Protected Data** | Progress and PRs pages require authentication to access data |

---

## 🛠️ Tech Stack

<table>
<tr><td><strong>Category</strong></td><td><strong>Technology</strong></td></tr>
<tr><td>Framework</td><td>Next.js 16.1.6 (App Router, Turbopack)</td></tr>
<tr><td>Language</td><td>TypeScript 5.x</td></tr>
<tr><td>UI Library</td><td>React 19.2</td></tr>
<tr><td>Styling</td><td>Tailwind CSS 4.0</td></tr>
<tr><td>Components</td><td>shadcn/ui (Base UI), Lucide React Icons</td></tr>
<tr><td>Animations</td><td>Framer Motion, tw-animate-css</td></tr>
<tr><td>Particles</td><td>tsParticles (slim engine)</td></tr>
<tr><td>Charts</td><td>Recharts 3.8</td></tr>
<tr><td>Auth & DB</td><td>Supabase (Auth + PostgreSQL + RLS)</td></tr>
<tr><td>AI/LLM</td><td>Groq SDK (LLaMA 3, streaming responses)</td></tr>
<tr><td>Deployment</td><td>Vercel</td></tr>
</table>

---

## 📁 Project Structure

```
forgefit/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Main single-page app (14 sections)
│   │   ├── auth/page.tsx             # Combined Sign In / Sign Up page
│   │   ├── progress/page.tsx         # Body progress tracker + charts
│   │   ├── prs/page.tsx              # Personal records tracker + charts
│   │   └── api/ai/
│   │       ├── coach/route.ts        # AI Coach chatbot API
│   │       ├── diet/route.ts         # AI Diet plan generator API
│   │       ├── exercise/route.ts     # AI Exercise guide API
│   │       ├── macros/route.ts       # AI Macro breakdown API
│   │       └── roadmap/route.ts      # AI Training roadmap API
│   ├── components/
│   │   ├── sections/                 # 12 page sections (navbar, hero, etc)
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── particle-background.tsx   # Animated tsParticles
│   │   └── ai-coach-dialog.tsx       # Floating AI coach chatbot
│   └── lib/
│       ├── supabase-client.ts        # Supabase browser client
│       └── utils.ts                  # Utility functions
├── supabase_schema.sql               # Database schema (2 tables + RLS)
├── .env.local                        # Environment variables
├── tailwind.config.ts                # Tailwind configuration
└── package.json                      # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- A **Supabase** account (free tier works)
- A **Groq** API key ([get one free](https://console.groq.com))

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/vishrutcodes/health-fitness-app-forgefit.git
cd health-fitness-app-forgefit

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys (see Environment Variables section)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're forging! 🔥

---

## 🗄️ Database Setup

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Create a **New Query**
3. Paste the contents of `supabase_schema.sql`
4. Click **Run**

This creates:
- `personal_records` table (for PRs)
- `progress_records` table (for body progress)
- Row Level Security policies (users only see their own data)
- Performance indexes

### Auth Configuration

1. Supabase → **Auth** → **Sign In / Providers** → **Email**
2. Enable **Email provider** → ON
3. Set **Confirm email** → **OFF** (for instant signup)
4. Click **Save**

---

## ☁️ Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in **Settings → Environment Variables**:
   - `GROQ_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — done! ✅

---

## 📄 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for AI features | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key | ✅ |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with 🔥 by [Vishrut](https://github.com/vishrutcodes)**

*Forge your body. Forge your mind. Forge your future.*

</div>
