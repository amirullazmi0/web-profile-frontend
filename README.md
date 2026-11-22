# Web Profile Frontend

Next.js 16 (App Router) frontend with authentication built in, wired to the `Web Profile` backend API.

## Stack

- Next 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (new-york), lucide icons, next-themes
- TanStack Query (server state), Zustand (client auth state), nuqs (URL state)
- axios with access-token injection and a queued refresh-on-401 interceptor
- react-hook-form + yup, sonner toasts

## Getting started

```bash
cp .env.example .env    # already done by the scaffolder; set NEXT_PUBLIC_API_URL
yarn install
yarn dev                # http://localhost:3000
```

Scripts: `yarn dev`, `yarn build`, `yarn start`, `yarn lint`, `yarn typecheck`, `yarn format`, `yarn deploy:vps`.

## Auth flow

- Pages: `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password` (also resends verification), `/auth/reset-password?token=`.
- Login stores `accessToken`, `refreshToken` and `userRole` cookies (`src/lib/auth-sync.ts`) and the user in Zustand (`src/stores/auth.store.ts`).
- `src/lib/axios.ts` adds `Authorization: Bearer <accessToken>`; on 401 it calls `POST /auth/refresh` once, queues parallel requests, replays them, or signs out.
- `src/proxy.ts` (Next 16's middleware) guards routes: `/admin/*` needs ADMIN or SUPERADMIN, `/dashboard` needs any session, `/auth/*` sends signed-in users home. Sign-in honours `?redirect=`.
- `src/hooks/react-query/useAuth.ts` exposes `login`, `register`, `logout`, `forgetPassword`, `resendVerification`, `resetPassword` and the current `user`.

## Project structure

```
src/
  proxy.ts                         route protection
  app/(page)/                      pages: / , dashboard/, auth/*, admin/*
  app/(page)/admin/(pages)/users/  example CRUD module (superadmin)
  components/ui/                   shadcn primitives
  components/custom/               shared app components (modal, pagination, theme toggle)
  components/admin/                admin shell: sidebar, navbar, menu (admin.list.tsx)
  data-services/                   endpoint registry: queries/<domain>, mutations/<domain>
  hooks/react-query/               useQueryApiRequest, useMutationApiRequest, useAuth
  lib/ provider/ stores/ types/
```

Feature files follow `page.tsx` → `<feature>.view.tsx` (UI) + `<feature>.hook.ts` (logic) + `<feature>.config.ts` (yup schema).

### Adding an API module

1. Add `src/data-services/queries/<domain>/index.ts` (key → URL) and/or `mutations/<domain>/index.ts` (key → `{ url, method, refetchQueries }`).
2. Register the keys in `src/data-services/queries/index.ts` / `mutations/index.ts`.
3. Call `useQueryApiRequest({ key, params, queries })` or `useMutationApiRequest({ key, params })`.
4. For admin pages, add a folder under `src/app/(page)/admin/(pages)/` and a menu entry in `src/components/admin/admin.list.tsx`.

## CI/CD

- `.github/workflows/ci.yml` runs lint, typecheck and build on PRs and pushes to `main`, `staging`, `development`.
- A push to `staging` deploys to the `staging` GitHub Environment, a push to `main` to `production`, via `.github/workflows/deploy.yml` (CapRover).
- Create both GitHub Environments with secrets `CAPROVER_SERVER`, `CAPROVER_TOKEN` (app token) and `CAPROVER_APP_NAME`.
- `NEXT_PUBLIC_API_URL` is baked in at build time: set it on the CapRover app as a build argument / env var before deploying.
