# 📝 Blog API – Production-Grade REST Backend

A **modern, scalable, and production-ready REST API** for a Markdown-based blogging platform.

This project demonstrates **real-world backend engineering practices** including authentication, authorization, modular architecture, cursor pagination, security hardening, and clean API design — built with **TypeScript, Express 5, PostgreSQL, Drizzle ORM, and Zod**.

> ⚡ Designed as a portfolio-grade backend to showcase job-ready backend skills.

---

## ⭐ Why This Project Matters

This is not a CRUD demo.

It demonstrates:

- Real authentication flows
- Scalable pagination
- Proper authorization modeling
- Production-grade security
- Clean, maintainable backend architecture

If you’re reviewing this repo:  
👉 this backend is **ready to be extended, deployed, and scaled.**

---

## 🚀 Features

### 🔐 Authentication & Security

- JWT **access tokens** (short-lived)
- **Refresh tokens** via HTTP-only cookies
- Secure logout & token rotation
- Role-based access control (**USER / AUTHOR / ADMIN**)
- Rate limiting on sensitive routes
- Security headers via **Helmet**
- Proper CORS for multiple frontends

### ✍️ Blogging System

- Markdown-based posts
- Draft / Published / Archived states
- SEO-friendly slugs
- Cursor-based pagination (no OFFSET issues)
- View counting with deduplication
- Like system with optimistic counters
- `likedByMe` support for authenticated users

### 💬 Comments

- Nested comments (replies)
- Cursor pagination
- Ownership & admin moderation policies

### 🏷️ Tags

- Normalized tag system
- Many-to-many post ↔ tags
- Popular tags endpoint
- Safe deduplication & normalization

### 🧱 Architecture & DX

- Modular feature-based structure
- Clean separation of:
  - routes
  - controllers
  - services
  - repositories
  - policies
- Zod-based request validation
- Zod-based request validation at API boundaries
- Centralized validation middleware for params, body, and query
- Centralized error handling
- Structured logging with request IDs
- OpenAPI / Swagger documentation

---

## 🏗️ Tech Stack

| Layer      | Tech                   |
| ---------- | ---------------------- |
| Runtime    | Node.js                |
| Language   | TypeScript             |
| Framework  | Express 5              |
| Database   | PostgreSQL             |
| ORM        | Drizzle ORM            |
| Validation | Zod                    |
| Auth       | JWT (Access + Refresh) |
| Security   | Helmet, Rate Limiting  |
| Logging    | Pino                   |
| Docs       | Swagger (OpenAPI 3)    |

---

## 📁 Project Structure

```txt
src/
├─ modules/
│  ├─ auth/
│  ├─ post/
│  ├─ comment/
│  ├─ post-like/
│  └─ tag/
│
├─ middlewares/
│  ├─ auth.middleware.ts
│  ├─ cors.middleware.ts
│  ├─ rate-limit.middleware.ts
│  ├─ security.middleware.ts
│  └─ error.middleware.ts
│
├─ db/
│  ├─ schema/
│  └─ index.ts
│
├─ docs/              # OpenAPI / Swagger
├─ utils/
├─ errors/
├─ @types/
├─ env.ts
├─ app.ts
└─ server.ts
```

---

## 🔐 Authentication Flow

### 1. Login / Signup

- Returns access token (JWT)
- Sets refresh token (HTTP-only cookie)

### 2. Authenticated Requests

- Use `Authorization: Bearer <access_token>`

### 3. Token Refresh

- Access token expires → `/auth/refresh`
- Refresh token rotated automatically

### 4. Logout

- All refresh tokens revoked
- Cookie cleared

### Refresh Token Rotation

- Refresh tokens are **hashed before storage**
- Each refresh request **revokes the previous token**
- Reuse of revoked tokens is rejected
- All active refresh tokens are revoked on logout

---

## 📚 Pagination Strategy (Cursor-Based)

Instead of `offset`, the API uses cursor pagination:

```http
GET /posts?limit=10&cursor=2025-01-01T10:00:00Z
```

Response:

```json
{
  "data": [...],
  "meta": {
    "nextCursor": "2025-01-01T09:12:30Z",
    "hasNextPage": true
  }
}
```

### Why cursor pagination?

- Stable ordering
- No duplicate / skipped rows
- Scales with large datasets

---

## 👍 Likes & Views (Correctly Done)

### Likes

- Unique per user per post
- Stored in `post_likes`
- Atomic counter updates via transactions
- `likedByMe` included only when authenticated

### Views

- IP-based view deduplication with transactional counter updates
- Author views excluded
- View count stored on post
- Separate `post_views` table for analytics

---

## 🛡️ Security Measures

- Rate limiting:
  - Auth routes (strict)
  - Public reads (soft)
  - Writes (moderate)
- Helmet security headers
- Strict CORS allowlist
- No `*` origins with credentials
- SQL injection safe via ORM
- Passwords hashed with Argon2id
- Timing-attack resistant auth checks

---

## 📖 API Documentation (Swagger / OpenAPI)

This API includes full OpenAPI 3 documentation generated manually alongside the codebase.

### Availability

- **Development:**  
  Swagger UI is available at:

  ```bash
  http://localhost:6969/docs
  ```

- **Production:**  
  API documentation is intentionally **not publicly exposed** to reduce attack surface.

In production, `/docs` can be enabled behind authentication (ADMIN-only) or accessed via a private deployment.

### Why not public in prod?

Exposing API schemas publicly in production can:

- Leak internal API structure
- Increase enumeration risk
- Expand attack surface

This project follows **security-first practices** by restricting documentation access in production.

---

## ⚙️ Environment Variables

```
NODE_ENV=development
PORT=6969
DATABASE_URL=postgresql://...
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
```

---

## 🧪 Scripts

```bash
pnpm dev # development
pnpm build # production build
pnpm start # start prod server

pnpm db:push
pnpm db:migrate
pnpm db:studio
```

---

## 🧠 Design Decisions

- Policy-based authorization instead of hardcoded checks
- Optional authentication for public routes
- Single source of truth for roles
- Explicit transactions for counters & relations
- Zod at the boundary, not everywhere
- Services stay framework-agnostic

---

## 📋 Project Analysis & Career Guidance

Looking for detailed analysis and career guidance?

- **[📊 PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)** - Comprehensive technical analysis of this project (architecture, security, code quality)
- **[💼 CAREER_GUIDANCE.md](./CAREER_GUIDANCE.md)** - Detailed salary expectations, job search strategy, and career roadmap
- **[🎯 QUICK_SUMMARY.md](./QUICK_SUMMARY.md)** - TL;DR of analysis, salary ranges, and next steps

---

## 👤 Author

### Sameer Ali

Backend-focused full-stack developer
Passionate about clean architecture, scalable APIs, and real-world systems.
