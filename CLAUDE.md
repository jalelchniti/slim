# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SmartHub Tunis** - An English language learning application (A1-A2 level) built with React, TypeScript, and Vite. Provides interactive educational content through quizzes and flashcards with text-to-speech capabilities, organized by language skill types.

**Branding:** SmartHub Tunis - "Connecting Intelligent People"
**Deployment:** Configured for `/slim/` subfolder deployment

## Development Commands

- `npm run dev` - Start development server (typically runs on http://localhost:5173)
- `npm run build` - Type check and build for production
- `npm run preview` - Preview production build locally
- `npm run serve` - Serve the dist folder using serve package
- `npm run lint` - Run ESLint to check code quality
- `npm test` or `npx vitest` - Run tests (Vitest configured with jsdom)

## Architecture Overview

### Routing System

**Layout Structure** (`src/App.tsx` + `src/components/layout/layout.tsx`)
- React Router v7 with centralized route definitions
- **CRITICAL:** BrowserRouter configured with `basename="/slim"` in `src/main.tsx` for subfolder deployment
- All pages wrapped in `Layout` component providing header, sidebar, footer, and Framer Motion page transitions
- Skill pages (Vocabulary, Grammar, etc.) act as navigation hubs to individual exercises
- SmartHub branding in header (logo), footer, and mobile sidebar

**Dynamic Quiz Routing** (`src/pages/QuizPage.tsx`)
- Central quiz router using lazy-loaded components via `quizMap` object
- Maps URL patterns to quiz components: `/quiz/{quizId}` → lazy import
- Quiz IDs follow strict naming: `{skillCode}_{unitNumber}-{lessonNumber}`
  - Examples: `vo_01-01` (Vocabulary Unit 1 Lesson 1), `gr_01-02` (Grammar Unit 1 Lesson 2)
  - Skill codes: `vo` (Vocabulary), `gr` (Grammar), `re` (Reading), `sp` (Speaking), `li` (Listening)
- When adding new quizzes: add entry to `quizMap` in `QuizPage.tsx`

### Quiz Content Organization

**Directory Structure**
```
src/store/
├── samples/          # Template exercises showing different interaction patterns
│   ├── InteractiveFlashcardsWithTTS.tsx    # Basic flashcard with TTS
│   ├── ReadingComprehensionQuizWithTTS.tsx # Reading with sentence highlighting
│   ├── MCQAndTypingQuiz.tsx                # Mixed question types
│   ├── Simple_Grammar_Rules.tsx            # Grammar presentation format
│   ├── TextInputQuizWithHints.tsx          # Type-in with hints
│   └── ...                                 # Additional sample templates
├── u1/              # Unit 1 content (organized by skill)
│   ├── Vocabulary/  # vo_01-01.tsx, vo_01-02.tsx, ...
│   ├── Grammar/     # gr_01-01.tsx, gr_01-02.tsx, ...
│   ├── Reading/     # re_01-01.tsx, re_01-02.tsx, ...
│   ├── Speaking/    # sp_01-01.tsx
│   └── Listening/   # li_01-01.tsx
└── plan.tsx         # Business calculator feature
```

**Quiz Types**
1. Flashcard Quizzes - Card flip with conditional TTS based on card index
2. Multiple Choice - Question/answer selection with scoring
3. Type-in Quizzes - Text input validation
4. Reading Comprehension - Text passages with sentence highlighting + TTS + follow-up questions

### Text-to-Speech Implementation

**Core Pattern** (see `src/store/u1/Vocabulary/vo_01-01.tsx`)
```typescript
const isSpeakingRef = useRef(false);  // Prevent duplicate calls
const speak = (text: string) => {
  if (!isTtsEnabled || isSpeakingRef.current) return;
  isSpeakingRef.current = true;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  const voice = voices.find(v => v.lang === "en-US") || voices[0];
  utterance.voice = voice;
  utterance.onend = () => { isSpeakingRef.current = false; };
  window.speechSynthesis.speak(utterance);
};
```

**Key Features**
- Voice loading via `speechSynthesis.onvoiceschanged` event
- Conditional TTS based on card index or flip state
- Toggle functionality with state management
- Sentence-level highlighting synchronized with speech playback

**Reading Quiz TTS Pattern**
- Text split by sentences: `text.split(/(?<=[.!?])\s+/)`
- Sequential speech with highlighting via `currentSentenceIndex` state
- Play/Pause/Stop controls with utterance chaining

### Component Architecture

**UI Stack**
- Radix UI primitives for accessible components
- Custom components in `src/components/ui/` (shadcn/ui style)
- Tailwind CSS for styling (utility-first)
- Framer Motion for page transitions and animations

**State Management**
- Zustand for global state (minimal usage)
- Local component state for quiz logic
- Refs for TTS deduplication

## Path Configuration

**Import Alias** - `@/*` maps to `src/*`
- Configured in `tsconfig.json` and `vite.config.ts`
- Use: `import Button from '@/components/ui/button'`
- Avoid: `../../../@/components/ui/button` (incorrect relative paths)

**Asset Paths in Production**
- All assets automatically prefixed with `/slim/` during build
- Example: `/slim/assets/images/lnkd_profile_picture-01.jpg`
- No need to manually add `/slim/` prefix in component code
- Vite handles path resolution based on `base` config

## Adding New Quizzes

**Step-by-step Process:**

1. **Choose a template** from `src/store/samples/` based on desired interaction pattern
2. **Create quiz component** in `src/store/u{unit}/{SkillType}/{skillCode}_{unit}-{lesson}.tsx`
   - Example: `src/store/u1/Vocabulary/vo_01-05.tsx`
3. **Register quiz** by adding lazy import to `quizMap` in `src/pages/QuizPage.tsx`:
   ```typescript
   'vo_01-05': lazy(() => import('../store/u1/Vocabulary/vo_01-05'))
   ```
4. **Implement TTS** (if needed):
   - For basic TTS: follow pattern in `src/store/u1/Vocabulary/vo_01-01.tsx`
   - For reading with highlighting: see comprehensive guide in `src/resources/Read_TTS_Highlight_Quiz_Docs.md`
5. **Test** by navigating to `/quiz/{quizId}` (e.g., `/quiz/vo_01-05`)

## Technology Stack

- React 18 + TypeScript + Vite 6
- React Router v7 (with `basename="/slim"` for subfolder deployment)
- Tailwind CSS 3 + Framer Motion
- Radix UI + custom shadcn/ui-style components
- Zustand (state management - minimal usage)
- Vitest (testing - configured, tests may be minimal)
- Icons: Lucide React, React Icons
- Carousel: react-responsive-carousel (used in EFLCurriculumCarousel)

## Branding Assets

**Logo:** `public/assets/images/lnkd_profile_picture-01.jpg`
- Used in header, footer, mobile sidebar, root landing page
- Circular logo with orange border

**Cover Banner:** `public/assets/images/fb_cover-01.png`
- Used in home page hero section
- "SMARTHUB - Connecting Intelligent People" design

**Color Scheme:**
- Primary: Blue tones (from Tailwind config)
- Accent: Orange/Red tones (brand colors)
- Used consistently across header, footer, buttons

## Deployment

**Standard Deployment Method: Manual FTP Upload**

### Build for Production
```bash
npx vite build
```
Note: Use `npx vite build` (not `npm run build`) to skip TypeScript strict checking. The app runs perfectly but has non-critical type issues.

### FTP Upload Process
1. Build creates optimized files in `dist` folder
2. Upload **contents** of `dist` folder to `/slim/` directory on server:
   - `index.html` (main entry point)
   - `assets/` folder (CSS, JS, images, audio, video)
   - `.htaccess` (Apache routing rules - auto-included)
   - `vite.svg` (favicon)
3. **Optional:** Upload `dist-root-index.html` as `/index.html` at web root (provides branded landing page)
4. See `DEPLOYMENT.md` for detailed FTP instructions and troubleshooting

### Important Deployment Notes
- **Base path configuration**: Set to `/slim/` in two places:
  - `vite.config.ts`: `base: '/slim/'`
  - `src/main.tsx`: `<BrowserRouter basename="/slim">`
  - Both must match for routing to work correctly
- **Deploy to `/slim/` folder**: Upload all `dist/` contents to server's `/slim/` directory
- **Root landing page**: `dist-root-index.html` provides branded welcome page (upload as `/index.html`)
- SPA routing handled by `.htaccess` file (auto-included in build, goes in `/slim/` folder)
- Asset files include cache-busting hashes
- Total bundle size: ~144 KB (gzipped main bundle + lazy-loaded quiz chunks)

## Important Notes

- **100% TypeScript**: All JavaScript files removed - project uses only `.tsx` files
- **Writing Skill Removed**: Project focuses on Vocabulary, Grammar, Reading, Speaking, and Listening
- **TTS Browser Support**: Web Speech API works best in Chrome/Edge
- **Resources**: `src/resources/Read_TTS_Highlight_Quiz_Docs.md` contains comprehensive TTS implementation guide
- **Additional Features**: Business calculator in `src/store/plan.tsx`, curriculum carousel at `/curriculum`
- **Deployment Files**:
  - `DEPLOYMENT.md` - Complete FTP upload guide
  - `DEPLOYMENT_READY.md` - Quick deployment checklist with troubleshooting
  - `dist-root-index.html` - Optional root landing page
