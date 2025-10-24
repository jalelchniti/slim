# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SmartHub Tunis** - An English language learning application (A1-A2 level) built with React, TypeScript, and Vite. Provides interactive educational content through quizzes and flashcards with text-to-speech capabilities, organized by language skill types.

**Branding:** SmartHub Tunis - "Connecting Intelligent People"
**Deployment:** Configured for `/slim/` subfolder deployment

## Development Commands

### Core Commands
- `npm run dev` - Start development server (typically runs on http://localhost:5173)
- `npm run build` - Type check and build for production (runs `tsc -b && vite build`)
- `npm run preview` - Preview production build locally
- `npm run serve` - Serve the dist folder using serve package
- `npm run lint` - Run ESLint to check code quality
- `npm run lint -- --fix` - Automatically fix linting issues

### Testing Commands
- `npm test` or `npx vitest` - Run all tests in watch mode
- `npx vitest --run` - Run all tests once and exit
- `npx vitest --run src/path/to/file.test.tsx` - Run tests for a specific file
- `npx vitest --ui` - Open interactive test UI
- `npx vitest --run --reporter=verbose` - Run tests with detailed output (useful for debugging)

### Build Commands
- `npx vite build` - Build for production without TypeScript checking (skips strict type validation)

**Note on Build Commands:** The project uses `npm run build` for CI/CD (includes type checking) and `npx vite build` for quick local builds when you want to skip strict TypeScript checking. Both output to the `dist/` folder.

**Development Notes:**
- TypeScript strict mode is enabled - all source files must be `.tsx` (no `.js` files)
- React components must be exported at the top level for React Refresh to work correctly (avoid exporting default from wrapped functions)

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
├── u2/              # Unit 2 content (organized by skill) - Shopping & Directions
│   ├── Vocabulary/  # vo_02-01.tsx through vo_02-04.tsx
│   ├── Grammar/     # gr_02-01.tsx through gr_02-04.tsx
│   ├── Reading/     # re_02-01.tsx through re_02-04.tsx
│   ├── Speaking/    # sp_02-01.tsx through sp_02-04.tsx
│   └── Listening/   # li_02-01.tsx through li_02-04.tsx
└── plan.tsx         # Business calculator feature
```

**Unit 2 Activities (20 Total)**
Created based on `Students/Slim_Gharbi/Slim_Gharbi_Course_Schedule.md` Lesson 4: Shopping & Directions

- **Vocabulary (4)**: Shopping, Directions & Landmarks, Currency & Payment, Shopping Conversation
- **Grammar (4)**: Imperatives for Directions, Asking Questions, Prepositions of Place, Modal Verbs
- **Reading (4)**: Shopping Information, Directions, Shopping Dialogue, Return & Exchange Policy
- **Speaking (4)**: Asking for Directions, Shopping Phrases, Dialogue Practice, Role Play Scenarios
- **Listening (4)**: Understanding Directions, Shopping Conversations, Landmarks & Locations, Prices & Numbers

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

### My English Companion Feature (`src/pages/MyCompanion.tsx`)

**Overview:** AI-powered conversational English coach using HeyGen avatar

**Components:**
- Hero section with "My English Companion" heading
- Instructions section with 5 guided steps
- **Centered Avatar Section** - HeyGen streaming avatar (main focal point)
- Features showcase (Real Conversations, AI Coaching, Track Progress)
- Tips for better practice
- Call-to-action section

**HeyGen Integration:**
- Embedded script injected via `useEffect` hook
- Avatar appears as circular button, expands to full conversation view
- Responsive design (mobile: 266px height, desktop: 366px × 16:9 aspect ratio)
- Microphone required and requested on activation
- Conversation auto-scales based on screen size

**User Flow:**
1. Navigate to `/companion`
2. Read instructions and tips
3. Click centered avatar button
4. Grant microphone permission when prompted
5. Start with greeting: "Hello. I am a non-native learner of English. My level is A1..."
6. Avatar responds and guides conversation for ~10 minutes
7. Copy conversation script to share with teacher on WhatsApp

**Topics Covered:**
- Personal introductions (who you are)
- Shopping & transactions
- Everyday activities & routines
- Basic A1-level conversational English

**Styling:**
- White background section for avatar (high contrast)
- Centered container with `flex` + `justify-center`
- Minimum height of 250px for avatar container
- Responsive padding and spacing

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

## Creating New Units from Course Schedule

**Reference Document:** `Students/{StudentName}/{StudentName}_Course_Schedule.md`

**Step-by-Step Process for Complete Unit Creation:**

### 1. **Extract Lesson Information**
   - Review the course schedule for the target lesson
   - Identify: Learning objectives, learning items, topics covered
   - Example: Lesson 4 focuses on "Shopping & Directions" with vocabulary, grammar, dialogue, and practical skills

### 2. **Create Directory Structure**
   ```bash
   mkdir -p src/store/u{unit}/{Skill} for each skill
   # Example: src/store/u2/Vocabulary, u2/Grammar, u2/Reading, u2/Speaking, u2/Listening
   ```

### 3. **Create 20 Quiz Files (4 per skill)**
   - **Naming Convention**: `{skillCode}_{unit}-{lessonNumber}.tsx`
   - **File Locations**: `src/store/u{unit}/{SkillType}/{filename}.tsx`
   - **Pattern**: Create 4 activities per skill demonstrating different interaction types:
     1. **Vocabulary**: Flashcard quizzes with definitions
     2. **Grammar**: Multiple choice with explanations
     3. **Reading**: Passages with comprehension questions
     4. **Speaking**: Phrase practice and dialogue role-plays
     5. **Listening**: Audio comprehension and QA

### 4. **Content Guidelines - ENGLISH ONLY**
   ⚠️ **ABSOLUTE RULE: Never use any language other than English**
   - All explanations, synonyms, and definitions must be in **simple, basic English**
   - Definitions should be beginner-friendly (A1 level)
   - Each definition explains the concept clearly without translation
   - Example: Instead of Arabic synonym, use: "A piece of clothing worn on the upper body"

### 5. **Register All Quizzes in QuizPage.tsx**
   ```typescript
   // In src/pages/QuizPage.tsx, add to quizMap:
   'vo_02-01': lazy(() => import('../store/u2/Vocabulary/vo_02-01')),
   'gr_02-01': lazy(() => import('../store/u2/Grammar/gr_02-01')),
   // ... repeat for all 20 quizzes, organized by skill and unit
   ```

### 6. **Update Skill Pages** (`src/pages/`)
   Add entries to each skill page's content array:
   - **VocabularyPage.tsx**: Add vo_02-01 through vo_02-04
   - **GrammarPage.tsx**: Add gr_02-01 through gr_02-04
   - **ReadingPage.tsx**: Add re_02-01 through re_02-04
   - **SpeakingPage.tsx**: Add sp_02-01 through sp_02-04
   - **ListeningPage.tsx**: Add li_02-01 through li_02-04

   Structure for each item:
   ```typescript
   {
     id: 'skillCode_unit-lesson',
     title: 'Activity Title',
     content: 'Short description',
     level: 'A1',
     topic: 'Topic category',
     quizId: 'skillCode_unit-lesson'
   }
   ```

### 7. **Update HomePage** (`src/pages/HomePage.tsx`)
   - Update featured practice section with new unit details
   - Change featured quiz links to new unit quizzes
   - Update `featuredLessonPoints` array with new unit topics

### 8. **Test All Routes**
   ```bash
   npm run dev
   # Visit: http://localhost:5173/vocabulary (shows all vocab items)
   # Click on new unit items
   # Verify routing to /quiz/{quizId} works
   # Test TTS functionality
   ```

### 9. **Verify Integration**
   - ✅ Quizzes accessible from skill pages
   - ✅ Direct URL access works: `/quiz/vo_02-01`
   - ✅ HomePage features new unit
   - ✅ All links properly routed
   - ✅ No Arabic or other language text
   - ✅ TTS working in all quizzes

## Code Quality and Testing

**ESLint Configuration** (`eslint.config.js`)
- Enforces React Hooks rules via `eslint-plugin-react-hooks`
- Warns on missing React Refresh exports with `react-refresh/only-export-components`
- TypeScript ESLint recommended rules enabled
- Ignores `dist` folder during linting
- All source files must be `.tsx` (100% TypeScript)

**Testing Setup** (`vitest.config.ts`)
- Test environment: jsdom (browser-like environment)
- Global test utilities enabled
- Setup file: `src/test/setup.ts`
- Run with: `npm test` (watch mode) or `npx vitest --run` (single run)

## Technology Stack

- React 18 + TypeScript + Vite 6
- React Router v7 (with `basename="/slim"` for subfolder deployment)
- Tailwind CSS 3 + Framer Motion
- Radix UI + custom shadcn/ui-style components
- Zustand (state management - minimal usage)
- Vitest (testing - configured with jsdom)
- Icons: Lucide React, React Icons
- Carousel: react-responsive-carousel (used in EFLCurriculumCarousel)

## Key Configuration Files

- `tsconfig.json` - TypeScript configuration with path alias `@/*` → `src/*`
- `vite.config.ts` - **IMPORTANT:** Vite build config with React plugin, base path `/slim/`, and `manualChunks` configuration for quiz code splitting
- `vitest.config.ts` - Test environment setup with jsdom
- `eslint.config.js` - Linting rules for React Hooks and TypeScript
- `tailwind.config.ts` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugins for Tailwind

### Code Splitting with manualChunks

**Location:** `vite.config.ts` lines 13-32

**How it works:**
- Each skill's quizzes are bundled into separate chunks: `u1-vocabulary`, `u1-grammar`, etc.
- This reduces initial bundle size - only needed quiz chunks are loaded
- **When adding new quizzes:** Add their file paths to the appropriate chunk in `manualChunks`
- Example: Adding `vo_03-01.tsx` requires adding it to a `u3-vocabulary` chunk entry

**Current chunks:**
- U1: `u1-vocabulary`, `u1-grammar`, `u1-reading`, `u1-speaking`, `u1-listening`
- U2: `u2-vocabulary`, `u2-grammar`, `u2-reading`, `u2-speaking`, `u2-listening`

**When to update manualChunks:**
- When creating Unit 3, 4, etc., add new chunk definitions
- When adding quizzes beyond lessons 1-4, update the file path array for that chunk
- Build will fail if file paths in chunks don't exist - fix by adding actual file paths or removing non-existent ones

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

**Option 1: Full build with TypeScript checking** (recommended for production)
```bash
npm run build
```
This runs both type checking and Vite build. Fails if TypeScript errors exist.

**Option 2: Skip TypeScript checking** (for quick local builds)
```bash
npx vite build
```
Builds without strict type validation. The app runs perfectly but may have non-critical type issues.

Both commands output to the `dist/` folder.

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
- **Base path configuration**: Critical to set `/slim/` in two places - if they don't match, routing will fail:
  - `vite.config.ts`: `base: '/slim/'`
  - `src/main.tsx`: `<BrowserRouter basename="/slim">`
- **Deploy to `/slim/` folder**: Upload all `dist/` contents to server's `/slim/` directory (not root!)
- **Root landing page**: `dist-root-index.html` provides branded welcome page (upload separately as `/index.html`)
- SPA routing handled by `.htaccess` file (auto-included in build, must be in `/slim/` folder)
- Asset files include cache-busting hashes for better caching
- Total bundle size: ~144 KB (gzipped main bundle + lazy-loaded quiz chunks)

## Quiz Registration Reference

**Location of quiz map:** `src/pages/QuizPage.tsx` (line ~45)

**Registration syntax:**
```typescript
const quizMap = {
  'skillCode_unit-lesson': lazy(() => import('../store/u{unit}/{Skill}/{skillCode}_{unit}-{lesson}')),
};
```

**Quiz ID Format:** `{skillCode}_{unitNumber}-{lessonNumber}`
- Example: `vo_02-03` = Vocabulary Unit 2 Lesson 3
- Skill codes: `vo`, `gr`, `re`, `sp`, `li`
- Must match filename exactly

## Common Development Workflows

**Adding a New Quiz (Quick Reference)**
```
1. Choose template from src/store/samples/
2. Create file: src/store/u{unit}/{Skill}/{skillCode}_{unit}-{lesson}.tsx
3. Add entry to quizMap in src/pages/QuizPage.tsx
4. Add content item to corresponding skill page (src/pages/{SkillName}Page.tsx)
5. Test at http://localhost:5173/quiz/{quizId}
6. npm run lint -- --fix to ensure quality
```

**Checking Code Quality Before Commit**
```bash
npm run lint              # Check for linting issues
npm run build             # Full type check + build (REQUIRED before deploy)
npm test                  # Run tests (watch mode)
npx vitest --run          # Run tests once (single run)
```

**Local Build Preview**
```bash
npm run build             # Production build with type checking
npm run preview           # Preview production build locally (on /slim/)
# OR for quick test without type check:
npx vite build && npm run serve
```

## Important Notes

- **100% TypeScript**: All JavaScript files removed - project uses only `.tsx` files
- **Writing Skill Removed**: Project focuses on Vocabulary, Grammar, Reading, Speaking, and Listening
- **TTS Browser Support**: Web Speech API works best in Chrome/Edge (Safari has limited support, Firefox requires user gesture)
- **Resources**: `src/resources/Read_TTS_Highlight_Quiz_Docs.md` contains comprehensive TTS implementation guide
- **Additional Features**:
  - Business calculator in `src/store/plan.tsx`
  - Curriculum carousel at `/curriculum`
  - **My English Companion** at `/companion` - AI-powered avatar for conversational practice
- **Deployment Files**:
  - `DEPLOYMENT.md` - Complete FTP upload guide
  - `DEPLOYMENT_READY.md` - Quick deployment checklist with troubleshooting
  - `FTP_DEPLOYMENT_OVH_GUIDE.md` - Comprehensive OVH deployment guide (v3)
  - `DEPLOYMENT_CHECKLIST.md` - Quick reference checklist
  - `dist-root-index.html` - Optional root landing page

## Troubleshooting Common Issues

**Build Fails with TypeScript Errors**
- Use `npm run build` to catch all type errors before deployment
- Fix errors in the source files - they must resolve for production
- If you need quick iteration, use `npx vite build` to skip type checking temporarily
- Always run full `npm run build` before committing or deploying

**Routing Not Working (404 or Blank Page)**
- Verify `basename="/slim"` is set in `src/main.tsx`
- Verify `base: '/slim/'` is set in `vite.config.ts`
- Both must match or routing will fail
- When testing locally with `npm run dev`, routes use `/quiz/` not `/slim/quiz/`

**TTS Not Working**
- Test in Chrome or Edge (best support)
- Check if microphone/audio permissions are blocked
- Ensure `isTtsEnabled` state is true in the component
- Verify voices are loaded: browser console should show voices available
- Test with simple speech first: `window.speechSynthesis.speak(utterance)`

**Quiz Not Loading**
- Verify quiz ID in URL matches entry in `quizMap` in `src/pages/QuizPage.tsx`
- Verify quiz file exists at correct path: `src/store/u{unit}/{Skill}/{quizId}.tsx`
- Check browser console for import errors
- Ensure lazy import syntax is correct: `lazy(() => import('...'))`

**Flashcard Images Not Showing**
- Images must be in `public/assets/images/`
- Image paths in code should use relative paths: `/assets/images/image-name.jpg`
- Vite automatically prefixes with base path (`/slim/`) in production
- In development with `npm run dev`, use same paths (no `/slim/` prefix needed)

**Asset Files Not Found (404 in Production)**
- Build adds hash to filenames: `assets/index-abc123.css`
- Ensure `npm run build` completes successfully before deploying
- Check that all files in `dist/` folder are uploaded to `/slim/` directory
- Verify `.htaccess` file is included in upload (handles SPA routing)

## Language & Content Guidelines

⚠️ **ABSOLUTE RULE: English Only - No Other Languages Allowed**

### Never Use:
- ❌ Arabic translations or synonyms
- ❌ Any language other than English
- ❌ Transliteration or code-switching
- ❌ Mixed-language explanations

### Always Use:
- ✅ Simple, basic English explanations
- ✅ Beginner-friendly vocabulary (A1 level)
- ✅ Clear, direct descriptions
- ✅ Contextual examples in English only
- ✅ TTS for pronunciation support (English only)

### Example - Correct Approach:
```typescript
// ✅ CORRECT
{ sideA: "Shirt", sideB: "A piece of clothing worn on the upper body" }

// ❌ WRONG
{ sideA: "Shirt", sideB: "قميص" }
```

## Deployment Versions

### Version 1 - Unit 1 Only (Introductions)
**Status:** ✅ Deployed to OVH `/slim/` directory

**Contents:**
- Vocabulary: 4 quizzes (Introductions, Everyday Objects, Classroom Objects)
- Grammar: 4 quizzes (Verb To Be, Present Simple, Yes/No Questions)
- Reading: 4 passages (All About You, Anna's Daily Life, Notices, Relationships)
- Speaking: 1 activity (Introducing Yourself)
- Listening: 1 activity (Short Conversations)
- **Total:** 14 interactive exercises
- **Features:** Flashcards with TTS, Multiple choice quizzes, Reading comprehension

**Flashcard Images Fixed:**
- Updated all flashcard image paths to include `/slim/` prefix for correct deployment
- All 8 available images (table, chair, door, window, bed, desk, lamp, book) properly configured
- TTS working for all flashcard activities

### Version 2 - Units 1 & 2 (Full Content) ✨ NOW WITH ALL U2 BUNDLED!
**Status:** ✅ **FULLY COMPLETE & READY FOR DEPLOYMENT**

**Build Configuration:**
- **vite.config.ts** enhanced with `manualChunks` for proper code splitting
- All 34 quizzes bundled as separate, lazy-loaded chunks
- U1: 12 quiz files + 5 skill chunks
- U2: 20 quiz files + 5 skill chunks

**Contents:**
- **Unit 1 (14 exercises):**
  - Vocabulary (4), Grammar (4), Reading (4), Speaking (1), Listening (1)

- **Unit 2 (20 exercises) - ALL INCLUDED:**
  - Vocabulary (4): Shopping, Directions & Landmarks, Currency & Payment, Shopping Conversation
  - Grammar (4): Imperatives for Directions, Asking Questions, Prepositions of Place, Modal Verbs
  - Reading (4): Shopping Information, Directions, Shopping Dialogue, Return & Exchange Policy
  - Speaking (4): Asking for Directions, Shopping Phrases, Dialogue Practice, Role Play Scenarios
  - Listening (4): Understanding Directions, Shopping Conversations, Landmarks & Locations, Prices & Numbers

**Total: 34 interactive exercises**

**Build Statistics:**
- **Total Build Size:** 2.0 MB (uncompressed)
- **Gzipped:** ~150 KB (optimized for transfer)
- **Total Files:** 60 (including .htaccess, index.html, vite.svg, assets)
- **JavaScript Files:** 43 (12 U1 quizzes + 20 U2 quizzes + chunks + main bundle)
- **CSS Files:** 2 (Tailwind + App CSS)
- **Images:** 12 (flashcard images + branding)
- **Build Time:** ~30 seconds

**Version 2 Features:**
- ✅ All U1 quizzes with fixed flashcard images and correct `/slim/` paths
- ✅ **ALL U2 quizzes included** (20 separate lazy-loaded chunks)
- ✅ Complete Unit 2 content with shopping and navigation themes
- ✅ Featured Unit 2 section on HomePage promoting new curriculum
- ✅ All skill pages updated with full content (8 items each: Vocab, Grammar, Reading; 5 items each: Speaking, Listening)
- ✅ TTS working across all interactive activities
- ✅ Proper code splitting with individual quiz chunks
- ✅ Created October 2024 - Based on Slim_Gharbi_Course_Schedule.md Lesson 4
- ✅ Theme: Shopping & Directions (practical, real-world vocabulary)
- ✅ Content: Fully in English with simple definitions
- ✅ Routing: All 34 quizzes registered in QuizPage.tsx
- ✅ Integration: Added to all skill pages and featured on HomePage
- ✅ Testing: All routes verified, TTS working, navigation complete
- ✅ .htaccess configured for SPA routing and caching

**Deployment Package Ready:**
- **Location:** `C:\Users\asus\en-a1\dist\`
- **Contents:** All files ready for FTP upload to OVH `/slim/` directory
- **Deployment Time:** ~5-10 minutes (depending on connection)
- **Testing:** 12-point post-deployment checklist available in FTP_DEPLOYMENT_VERSION_2.md

**Deployment Strategy:**
- **Version 1 (U1 Only):** Already deployed to OVH `/slim/` for initial launch
- **Version 2 (U1 + U2):** ✅ **NOW READY** for deployment - all U2 content properly bundled
- Both versions maintain flashcard image paths with `/slim/` prefix
- Both versions fully functional with TTS enabled
- **Key Fix:** Updated `vite.config.ts` with `manualChunks` to ensure U2 files are created as separate bundles
