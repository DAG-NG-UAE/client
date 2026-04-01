# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Next.js dev server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

There is no test runner configured — do not assume one exists.

## Architecture

This is a **Next.js 16 recruitment/HR management platform** using the App Router. The app serves both internal HR users and public-facing candidates.

**Key libraries:** React 19, TypeScript 5, MUI 7, Redux Toolkit 2, Axios 1, SWR 2, TipTap 3, Tailwind CSS 4, Framer Motion 12, dnd-kit, dayjs.

### Route Structure

- `/` → redirects to `/login`
- Protected internal routes: `/dashboard`, `/requisition`, `/candidates`, `/offers`, `/pending-requisition`, `/salary-proposal` (internal), `/data-management`, `/history`, `/library`
- Public routes (no auth): `/careers`, `/salary-proposal/[slug]`, `/share/[slug]`

The root `layout.tsx` detects public pages by pathname to skip auth wrapping.

### State Management

Redux Toolkit with `redux-persist` (localStorage). Store slices: `auth`, `candidates`, `requisitions`, `interviews`, `offers`, `users`, `salaryProposals`, `positions`, `schedule`, `preferences`.

- Auth state is **excluded** from persistence (blacklisted)
- SSR uses a noop storage engine to prevent hydration issues
- Use `dispatchHandle.ts` to access dispatch outside React components

### API Layer

All HTTP calls go through `/api/axiosInstance.ts`:
- Base URL: `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`)
- `withCredentials: true` — auth is cookie-based (no Authorization header)
- 401 responses trigger auto-logout and redirect to `/login`

API modules in `/api/` are plain async functions (not hooks). Async Redux thunks call these functions, dispatch reducer actions on success, and dispatch `hasError()` + a notistack snackbar on failure.

### Document Handling

The app supports rich document types:
- Word (`.docx`) via `mammoth`
- Excel via `xlsx` (parser in `/utils/excelParser.ts`)
- PDF via `pdfjs-dist`
- Markdown via `marked` / `react-markdown`
- Rich text editing via TipTap

The `next.config.ts` aliases `canvas` and `encoding` to `empty.js` for build compatibility with `pdfjs-dist`.

### Key Conventions

- **Path alias:** `@/*` maps to the project root (e.g., `@/components/...`)
- **Column configs** for tables live in `/utils/candidateColumnConfig.tsx` and `/utils/offersColumnConfig.tsx`
- **Status/role constants** are in `/utils/constants.ts`
- **TypeScript interfaces** are in `/interface/` (domain-split: `user.ts`, `candidate.ts`, `requisition.ts`, etc.)
- `ignoreBuildErrors: true` is set in `next.config.ts` — TypeScript errors won't block builds, but should still be fixed
- `trailingSlash: true` is enabled (for S3/static hosting compatibility)
- MUI theming via `theme.ts` — use `getAppTheme(mode)` which supports `'light'` and `'dark'` modes
