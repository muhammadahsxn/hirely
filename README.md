# Hirely

> **AI-powered CV analysis that helps you understand how recruiters see your resume — and what to fix next.**

Hirely is an AI-powered CV analysis platform built to help students, job seekers, and professionals turn their resumes into stronger, more targeted applications.

Upload a CV, let Hirely analyze it, and receive structured feedback covering your overall CV quality, strengths, weaknesses, recruiter impression, skills, section-level feedback, and prioritized recommendations.

## Features

* **AI-Powered CV Analysis**
  Analyze your CV and receive structured, actionable feedback.

* **Overall CV Score**
  Get a clear score out of 100 representing the quality of your CV.

* **Recruiter Impression**
  Understand your CV's first impression, strongest signals, and biggest concerns.

* **Strengths & Weaknesses**
  Identify what's working and what is reducing your CV's impact.

* **Skills Analysis**
  See which skills are demonstrated, missing, unclear, or weakly supported by your CV.

* **Section-Level Feedback**
  Receive targeted feedback on areas such as education, experience, projects, skills, summary, and contact information.

* **Prioritized Recommendations**
  Get specific improvements ranked by priority so you know what to fix first.

* **Analysis History**
  Keep track of previous CV analyses and revisit your results.

* **Secure Authentication**
  User accounts and authentication are handled through Neon Auth.

* **Persistent Data**
  CV analyses and results are securely stored for authenticated users.

## How It Works

```text
Upload CV
    ↓
Extract CV Content
    ↓
AI Analysis
    ↓
Structured Validation
    ↓
Store Analysis Result
    ↓
Display Insights
    ↓
Improve CV
```

Hirely is designed around structured AI output rather than displaying a raw model response. This allows the application to transform AI analysis into consistent, readable product experiences.

## Tech Stack

### Frontend

* **Next.js 16** — React framework and application architecture
* **React** — UI development
* **TypeScript** — type-safe application development
* **Tailwind CSS** — styling and design system

### Backend

* **Next.js Server Components & Server Actions**
* **Prisma ORM** — database access and data modeling
* **Neon PostgreSQL** — persistent database
* **Neon Auth** — authentication and user management

### AI

* **AI-powered structured CV analysis**
* Schema-oriented analysis results
* Structured JSON stored alongside each analysis

## Core Application Structure

```text
Hirely
├── Public Landing Page
│   ├── Hero
│   ├── Product Introduction
│   └── Authentication Entry
│
├── Authentication
│   ├── Sign In
│   └── Sign Up
│
└── Dashboard
    ├── Overview
    ├── Analyze CV
    ├── Analysis Results
    ├── History
    ├── Settings
    └── Account
```

## Analysis Results

Each completed analysis can provide:

* Overall score
* AI verdict
* CV overview
* Recruiter first impression
* Strongest professional signals
* Biggest recruiter concerns
* Strengths
* Weaknesses
* Demonstrated skills
* Missing or unclear skills
* Weakly supported claims
* Section-specific feedback
* Prioritized recommendations
* ATS analysis
* Experience analysis
* Project analysis

The analysis architecture is designed so additional AI modules can be introduced without rebuilding the core application.

## Authentication & Data

Hirely uses authenticated user sessions to ensure that users can access their own CV analyses and history.

Analysis records are associated with the authenticated user and stored in PostgreSQL through Prisma.

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* A PostgreSQL-compatible database
* The required authentication and AI environment variables

### Installation

Clone the repository:

```bash
git clone https://github.com/muhammadahsxn/hirely.git
cd hirely
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required environment variables.

Then generate the Prisma client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

To verify the application before deployment:

```bash
npm run build
```

A successful production build confirms that the application compiles and passes TypeScript validation.

## Project Goal

Hirely is being developed as a practical AI-powered product rather than simply an AI wrapper.

The goal is to combine:

**AI analysis + structured data + useful UX + actionable recommendations**

into a product that helps users understand not only **whether their CV is good**, but **why it is good, where it fails, and what they should do next.**

## Roadmap

Future development may include:

* [ ] Job description matching
* [ ] ATS compatibility analysis
* [ ] Advanced experience analysis
* [ ] Project quality analysis
* [ ] CV improvement suggestions
* [ ] Target-role optimization
* [ ] Improved AI scoring consistency
* [ ] CV version comparison
* [ ] Exportable analysis reports
* [ ] Production deployment

## Project Status

**Working MVP**

The core Hirely application is functional, including authentication, CV analysis, persistent analysis history, structured results, dashboard functionality, and settings.

The next development phase focuses on improving the AI analysis engine and expanding the depth and usefulness of the generated insights.

## Author

**Muhammad Ahsan**

BS Software Engineering student and developer building Hirely as an AI-focused software project.

---

### License

This project is currently intended as a personal/academic project.
