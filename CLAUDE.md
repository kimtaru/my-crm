# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

영업관리 CRM 웹 애플리케이션.

- **목적:** 영업 활동을 효율적으로 관리하기 위한 CRM 도구
- **현황:** 기능 요구사항이 확정되는 단계이며, 빠른 개발 착수를 위한 기반(베이스) 구축 중
- **방향:** 기능이 협의·확정되는 즉시 빠르게 개발을 시작할 수 있는 확장 가능한 구조를 우선시함

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check (tsc -b) then build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test framework is configured yet.

## Architecture

React 19 + TypeScript SPA using Vite and React Router v7.

**Path alias:** `@/` maps to `src/` (configured in `tsconfig.app.json` and Vite).

**Routing pattern** (`src/routes/index.tsx`): Pages are lazy-loaded via `React.lazy`. Export `HomePage` directly from routes, and export a `routes` array for all other pages. `App.tsx` renders these under a single `<Route path="/" element={<RootLayout />}>` with `<Suspense fallback={<Spinner />}>`.

**Layout** (`src/layouts/RootLayout.tsx`): Wraps all pages with `<Header>`, `<main><Outlet /></main>`, and `<Footer>`.

**Styles** (`src/assets/styles/`): Global CSS split across `reset.css`, `layout.css`, and `common.css`. Component-scoped styles use CSS Modules (e.g., `Spinner.module.css`).

## TypeScript

Strict mode is enabled with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`. The `allowImportingTsExtensions` flag is on, so `.tsx` extensions in imports are allowed (and used in route definitions).
