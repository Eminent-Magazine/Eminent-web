
## Goal
Replace the current mocked voting UI with live data from the Pageant Voting API at `https://pageant-voting-api.onrender.com`, add a public contestant registration flow (paid + free, driven by admin settings), and add a protected admin dashboard that uses every remaining endpoint.

## API base
- `VITE_PAGEANT_API_BASE = https://pageant-voting-api.onrender.com`
- Central client `src/lib/pageantApi.ts` — thin `fetch` wrapper, JSON, throws on non‑2xx, attaches `Authorization: Bearer <token>` from `localStorage` when present.
- All data fetched via TanStack Query (already installed); mutations invalidate the relevant keys.

## Endpoint → UI map

### Public
| Endpoint | Screen |
|---|---|
| `GET /api/candidates` | `/vote` grid, replaces `CONTESTANTS` mock |
| `GET /api/candidates/category/{category}` | category filter chips on `/vote` |
| `GET /api/candidates/{id}` | new `/vote/$id` contestant profile page |
| `GET /api/votes/results` | Leaderboard section on `/vote` |
| `GET /api/votes/statistics` | Stat strip (total votes, contestants, etc.) on `/vote` and homepage banner |
| `GET /api/payments/packages` | vote bundles inside `VoteDialog` (replaces hardcoded `BUNDLES`) |
| `POST /api/payments/initialize` | called from `VoteDialog` → redirect user to returned Paystack `authorization_url` |
| `GET /api/payments/verify?reference=…` | new `/vote/callback` route reads `?reference=` from URL, verifies, shows success/failure |
| `GET /api/users/registration/settings` | drives `/register` page (paid vs free, open/closed, categories list) |
| `POST /api/payments/registration/initialize` | `/register` step 1 when `requirePaymentBeforeRegistration=true` → redirect to Paystack |
| `GET /api/payments/registration/verify` | `/register/callback` verifies then auto-advances to profile form |
| `POST /api/users/register` | `/register` submit (with `transactionReference` when paid) |
| `GET /api/users/{id}` | success page after registration |

### Admin (new `/admin/*` section, gated by token in `localStorage`)
| Endpoint | Screen |
|---|---|
| `POST /api/admin/login` | `/admin/login` — stores JWT |
| `GET /api/admin/stats` | `/admin` dashboard KPI cards |
| `GET /api/admin/settings` / `PUT /api/admin/settings` | `/admin/settings` form (registration open, requirePaymentBeforeRegistration, price, categories, voting window, etc.) |
| `GET /api/admin/users` (+ status, paymentStatus, category, search filters) | `/admin/users` table with filter bar |
| `GET /api/admin/users/{id}` | `/admin/users/$id` detail drawer |
| `PUT /api/admin/users/{id}` / `DELETE /api/admin/users/{id}` | edit + delete actions in drawer |
| `POST /api/admin/users/{id}/approve` | Approve button → creates contestant |
| `POST /api/admin/users/{id}/reject` | Reject dialog with `adminNotes` textarea |
| `POST /api/admin/users/bulk-upload` | `/admin/users` "Bulk upload" — CSV/XLSX file input, multipart POST |
| `GET /api/candidates` / `POST` / `PUT /{id}` / `DELETE /{id}` | `/admin/contestants` CRUD table |
| `POST /api/admin/votes/add` | "Adjust votes" modal on `/admin/contestants` (candidateId, votes, reason) |
| `GET /api/payments/transactions` | `/admin/transactions` table |
| `GET /api/payments/transaction/{reference}` | row-click detail modal |

## New / changed files
- `src/lib/pageantApi.ts` — fetch client + typed helpers for every endpoint above.
- `src/lib/adminAuth.ts` — token storage, `useAdminToken`, `requireAdmin` guard hook.
- `src/routes/vote.tsx` — rewritten to consume live candidates, packages, leaderboard, stats; `VoteDialog` calls `/payments/initialize` and redirects.
- `src/routes/vote.$id.tsx` — contestant profile + vote CTA.
- `src/routes/vote.callback.tsx` — verifies `?reference=` and shows result.
- `src/routes/register.tsx` — dynamic flow based on `/users/registration/settings`; paid path redirects to Paystack.
- `src/routes/register.callback.tsx` — verifies registration payment, then renders profile form and submits `/users/register` with the returned `transactionReference`.
- `src/routes/admin.tsx` — pathless layout: sidebar (Dashboard, Users, Contestants, Transactions, Settings), auth gate.
- `src/routes/admin.login.tsx`
- `src/routes/admin.index.tsx` — stats dashboard.
- `src/routes/admin.users.tsx` + `admin.users.$id.tsx`.
- `src/routes/admin.contestants.tsx`.
- `src/routes/admin.transactions.tsx`.
- `src/routes/admin.settings.tsx`.
- `SiteNav.tsx` — add small "Admin" link in footer / hidden route; nav gets a "Register" CTA when registration is open.

## Auth model
Admin JWT lives in `localStorage.pageant_admin_token`. `admin.tsx` layout redirects to `/admin/login` when missing/expired (401 responses clear it). No server functions needed — API is external and CORS-enabled per the docs (will verify at wire-up; if CORS blocks browser calls, we add a thin TanStack server route `/api/public/pageant/*` proxy — noted as fallback).

## Out of scope
- Real Paystack keys / webhooks (handled by the external API).
- Migrating existing site content or Lovable Cloud data.
- Realtime updates (polling every 15s on leaderboard is enough).

## Open assumptions
- API accepts browser `fetch` with `Content-Type: application/json` from the preview origin. If CORS blocks, fall back to a TanStack server-route proxy under `/api/public/pageant/$`.
- Bulk upload accepts `multipart/form-data` with field name `file` (standard); we'll confirm at implementation and adjust if the API expects a different name.
