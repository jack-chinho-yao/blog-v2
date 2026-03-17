# Blog V2

Personal blog system with admin dashboard.

## Tech Stack

- **Backend**: Spring Boot 3.2.2, Java 17, PostgreSQL 16, Redis 7, JWT auth
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Infra**: Docker Compose (all services containerized)

## Project Structure

```
backend/
  src/main/java/com/yao/blog/
    config/          # SecurityConfig, RedisConfig, OpenApiConfig, DataInitializer
    controller/      # REST controllers (public + Admin* prefixed for admin)
    dto/request/     # Inbound DTOs (BlogRequest, LoginRequest, etc.)
    dto/response/    # Outbound DTOs (BlogResponse, AuthResponse, etc.)
    entity/          # JPA entities (Blog, User, Tag, Comment, RefreshToken)
    enums/           # Role enum
    exception/       # GlobalExceptionHandler, ResourceNotFoundException, DuplicateResourceException
    repository/      # Spring Data JPA repositories
    security/        # JWT filter, JwtService, CustomUserDetails
    service/         # Business logic
    util/            # MarkdownUtils
  src/main/resources/application.yml

frontend/
  src/
    app/             # Next.js App Router pages
      admin/         # Admin dashboard pages (login, blogs, tags)
      blog/[id]/     # Blog detail (dynamic route, Server Component)
      archives/      # Archive page (Server Component)
      tags/           # Tags page (Client Component with Suspense)
    components/      # Reusable components (Header, Footer, BlogCard, CommentSection)
    lib/api.ts       # API client (client-side, uses NEXT_PUBLIC_API_URL)
    lib/auth.ts      # Auth helpers (token storage)
    types/index.ts   # TypeScript type definitions
```

## Running Locally

```bash
cp .env.example .env
docker compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Default admin: admin / admin123

## Environment Variables

Server Components use `API_URL` (runtime, container-to-container: `http://backend:8080`).
Client Components use `NEXT_PUBLIC_API_URL` (build-time, browser access: `http://localhost:8080`).

## Key Conventions

- Backend uses Lombok (`@Getter`, `@Builder`, `@Data`) — don't manually write getters/setters
- JPA DDL is `update` mode (auto-creates/alters tables from entities)
- Table names prefixed with `t_` (e.g. `t_blog`, `t_user`)
- Public API: `/api/**`, Admin API: `/api/admin/**` (requires JWT Bearer token)
- Pages using `useSearchParams()` must wrap content in `<Suspense>`
- Server Component pages that fetch from backend use `export const dynamic = 'force-dynamic'`
- Backend Dockerfile uses `-Dmaven.test.skip=true` (test compilation has known issues)
- Backend runtime image: `eclipse-temurin:17-jre-jammy` (ARM64 compatible)

## Common Commands

```bash
docker compose up -d --build    # Rebuild and start all services
docker compose logs backend     # View backend logs
docker compose logs frontend    # View frontend logs
docker compose down             # Stop all services
docker compose down -v          # Stop and remove volumes (deletes DB data)
```
