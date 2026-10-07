# AssessOrch - AI-Powered Coding Assessment Platform

AssessOrch is a premium, AI-driven technical assessment platform designed to streamline the hiring process for recruiters and provide a seamless, real-world testing environment for candidates. 

![AssessOrch Dashboard Preview](https://github.com/ThanuSuthapalli/AssessOrch/blob/main/public/dashboard-preview.png?raw=true)

## 🚀 Key Features

### For Recruiters
- **AI Question Generation**: Automatically generate coding and system design questions based on job roles or specific skills using OpenAI.
- **Dynamic Assessment Creation**: Build custom tests with multiple-choice, coding, and system design questions.
- **Candidate Management**: Track progress, review detailed performance reports, and see real-time submission data.
- **Question Bank**: Manage a private repository of questions or use our curated AI-vetted pool.

### For Students/Candidates
- **Advanced Code Editor**: Multi-language support with integrated test case validation.
- **Real-time Progress Hub**: Track your history, average scores, and active days across all assessments.
- **Instant Result Analysis**: Receive immediate feedback and AI-generated insights into your strengths and areas for improvement.
- **User-Centric UI**: A premium, dark-themed experience optimized for focus during technical tests.

## 🛠 Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: Custom Session-based Auth (Mocked for easy demo, extensible to Firebase Auth)
- **AI Engine**: OpenAI GPT-4 Integrated API
- **Icons**: Lucide React

## 📦 Project Structure
```text
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/              # Backend API routes (Firestore & AI Logic)
│   ├── recruiter/        # Recruiter-facing dashboard & test creation
│   └── student/          # Candidate-facing assessment hub
├── components/           # Reusable UI components
│   ├── assessment/       # Core assessment engine (Editor, Timer, etc.)
│   └── dashboard/        # Layout and nav components
├── lib/                  # Helper utilities (Firebase init, shared types)
├── public/               # Static assets & images
└── styles/               # Global CSS & Tailwind configuration
```

## ⚙️ Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ThanuSuthapalli/AssessOrch.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`.env.local`):
   ```env
   OPENAI_API_KEY=your_openai_key
   # Firebase config is already initialized in lib/firebase.ts for the demo
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🛡 Proctoring & Security
AssessOrch is built with integrity in mind, featuring:
- Tab-switching detection
- Full-screen enforcement
- Copy-paste monitoring (configurable per test)
- Real-time time management tracking

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ by [Thanu Suthapalli](https://github.com/ThanuSuthapalli)
