# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AI Fashion Studio — a React + TypeScript frontend for an AI-assisted custom T-shirt shop. Customers browse a catalog, design a shirt (2D canvas editor + 3D preview), try it on virtually, checkout, and pay. Staff manage print orders; admins manage the catalog and moderate feedback.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # tsc -b (type-check via project references) then vite build
npm run lint      # eslint .

npm run preview   # preview a production build
```

There is no test runner configured in this repo. Verify changes via `npm run build` (type-check) and `npm run lint`, and by exercising the affected flow in the dev server.

Backend URL is read from `VITE_API_BASE_URL` (see `.env.example`), default `http://localhost:8080`.

## Architecture

**Layout**: `src/app` (router/providers/App shell), `src/features/<domain>` (one folder per business domain), `src/shared` (cross-feature API client, UI components, constants, layouts, utils).

**Feature module shape**: each `src/features/<name>` folder holds its own `api.ts` (axios calls + React Query hooks), `types.ts`, `schemas.ts` (Zod, where forms exist), and page components. Keep new domain logic inside its feature folder rather than in `shared`.

**API layer** (`src/shared/api/httpClient.ts`):
- `apiRequest<T>(config)` wraps `axios` and always resolves to the `ApiResponse<T>` envelope shape (`{ success, message, data, errors, meta }`, see `apiResponse.ts`), normalizing non-enveloped backend responses into that same shape.
- A request interceptor rewrites relative URLs to be prefixed with `/api/` (`normalizeApiPath`) and attaches `Authorization: Bearer <token>` from `useAuthStore`.
- A response interceptor clears the auth session on `401`, except for requests to `AUTH_ENTRYPOINTS` (login/register/forgot-password/etc.) so failed-login errors don't wipe an unrelated session.
- Feature `api.ts` files call `apiRequest` and export both the raw async function and a `useXQuery` / `useXMutation` React Query hook wrapper — follow this pattern for new endpoints (see `features/catalog/api.ts` or `features/auth/api.ts`).
- Some list/detail pages (e.g. `ProductListPage`) fall back to local `mockData.ts` when the query errors, to keep the UI usable without a live backend. Preserve this fallback pattern when touching those pages rather than removing it.

**Auth & routing** (`src/features/auth/authStore.ts`, `src/app/routeAccess.tsx`, `src/app/router.tsx`):
- `useAuthStore` (Zustand) is the single source of truth for `accessToken`, `refreshToken`, and `currentUser`, persisted to `localStorage` and hydrated on boot via `initFromStorage` (called from `Providers`/`AuthBootstrap`, which also revalidates via `/auth/me`).
- Roles are `CUSTOMER` / `STAFF` / `ADMIN` (`shared/constants/roles.ts`), grouped in `shared/constants/roleGroups.ts` (`customerOnly`, `staffAndAdmin`, `adminOnly`).
- `ProtectedRoute` gates on authentication; `RoleGuard` additionally gates on allowed roles; `GuestRoute` redirects already-authenticated users away from login/register based on `getRoleRedirect` in `features/auth/roleRedirect.ts`.
- `routeAccess.tsx` is documented as **the single source of truth for path → roles** and is meant to stay in sync with `router.tsx`'s actual route tree — when adding/moving a route, update both files together.
- All app routes render under one root `MainLayout` (`Navbar` + `Outlet`); there's no separate layout per role.

**Design editor** (`src/features/design`): 2D editing uses `fabric` (`DesignEditorPage.tsx`, `TShirtCanvas.tsx`); 3D preview/landing visuals use `three` / `@react-three/fiber` / `@react-three/drei` (see `landing/components/Hero3DPreview.tsx`, `catalog/ProductVisual.tsx`). Keep the fabric canvas (design authoring) and three.js scenes (product preview/try-on visualization) as separate concerns — don't mix canvas libraries within one component.

**Styling**: Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no separate `tailwind.config`), global styles in `src/styles/index.css`.

**Path conventions**: no `@/` alias is configured — imports use relative paths (`../../shared/...`).

## Bối cảnh dự án (SWD392 - AI Fashion Studio)
- Nền tảng bán áo thun tuỳ chỉnh AI: chọn mẫu, tự thiết kế, virtual try-on AI, đặt hàng, theo dõi đơn.
- Backend: Java Spring Boot (catalog, design, cart, order, payment, shipment, RBAC) + C# .NET
  (notification, invoice, AI, loyalty, wishlist, analytics). Chạy local bằng `docker compose up -d`
  trong repo ai-fashion-studio-api, Swagger tại http://localhost:8080/webjars/swagger-ui/index.html
- FE này chạy `npm run dev` ở http://localhost:5173, gọi BE ở http://localhost:8080.
- Auth/Register đang lỗi CORS phía BE, người khác trong nhóm đang fix - không cần và không được
  sửa logic Auth để né lỗi này.
- Không có bảng feedback/review trong DB spec 38 bảng -> trang feedback phải dùng mock data + EmptyState.

## Phạm vi tôi được sửa
Chỉ trong: src/features/landing/, src/features/about/, src/features/feedback/,
src/shared/components/, src/features/catalog/, src/features/staff/, src/features/admin/

## File TUYỆT ĐỐI không sửa nếu chưa hỏi tôi
src/shared/api/httpClient.ts, src/shared/api/apiResponse.ts, src/app/router.tsx,
src/app/routeAccess.tsx, src/app/providers.tsx, src/features/auth/*, src/shared/components/ProtectedRoute.tsx,
src/shared/components/RoleGuard.tsx, src/features/design/TShirtCanvas.tsx,
src/features/design/designStore.ts, src/features/payment/api.ts, src/features/order/api.ts,
src/features/tryon/api.ts
Nếu cần route mới hoặc phải sửa 1 trong các file trên: dừng lại, hỏi tôi trước.

## Quy tắc
- Giữ nguyên style Tailwind hiện có, không đổi config/theme.
- Không sửa dist/, node_modules/, .env.
- Không tạo cấu trúc thư mục mới nếu thư mục đó đã tồn tại.
- Page chưa có API thật -> làm UI với mock data + loading/empty/error state trước.
- Trước khi báo 1 việc đã xong, luôn chạy npm run build để chắc không lỗi.