# Blog v2

Personal blog system with modern tech stack — front-end and back-end separated architecture.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17 + Spring Boot 3 + Spring Security + JWT |
| Database | PostgreSQL |
| Cache | Redis |
| Frontend | Next.js 14 + React + TypeScript + Tailwind CSS |
| API Docs | SpringDoc OpenAPI 3 |
| Testing | JUnit 5 + Mockito |
| Deployment | Docker Compose |

## Project Structure

```
blog-v2/
├── backend/          # Spring Boot 3 REST API
│   ├── controller/   # REST endpoints (public + admin)
│   ├── dto/          # Request/Response DTOs
│   ├── entity/       # JPA entities with BaseEntity auditing
│   ├── repository/   # Spring Data JPA
│   ├── security/     # JWT + Spring Security
│   └── service/      # Business logic
├── frontend/         # Next.js + TypeScript
│   ├── app/          # Pages (App Router)
│   ├── components/   # React components
│   ├── lib/          # API client, auth helpers
│   └── types/        # TypeScript type definitions
└── docker-compose.yml
```

## Features

- **Blog CRUD** — Create, edit, delete posts with Markdown support
- **Categories & Tags** — Organize posts, tag cloud, top categories
- **Comment System** — Nested replies, admin/guest distinction
- **Search** — Full-text blog search
- **Archives** — Posts grouped by year
- **Authentication** — JWT + refresh token, BCrypt password hashing
- **Role-based Access** — ADMIN, AUTHOR, READER roles with `@PreAuthorize`
- **Auditing** — Auto-tracked createdAt/updatedAt/createdBy/updatedBy on all entities
- **Soft Delete** — Records are never permanently deleted
- **SSR** — Server-side rendering for public pages (SEO friendly)
- **API Documentation** — Swagger UI at `/swagger-ui.html`

## Quick Start

### Docker Compose (recommended)

```bash
cp .env.example .env
# Edit .env with your secrets
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Default admin: `admin` / `admin123`

### Local Development

**Backend:**
```bash
cd backend
# Ensure PostgreSQL and Redis are running locally
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/blogs | List blogs (paginated) |
| GET | /api/blogs/{id} | Blog detail |
| GET | /api/blogs/search?query= | Search |
| GET | /api/blogs/recommend | Recommended posts |
| GET | /api/blogs/archive | Archives by year |
| GET | /api/types | All categories |
| GET | /api/tags | All tags |
| GET | /api/comments/blog/{id} | Comments for a blog |
| POST | /api/comments | Submit comment |

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Login (returns JWT) |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/logout | Logout |

### Admin (requires JWT)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/admin/blogs | Create blog |
| PUT | /api/admin/blogs/{id} | Update blog |
| DELETE | /api/admin/blogs/{id} | Delete blog (ADMIN) |
| POST | /api/admin/types | Create category |
| PUT | /api/admin/types/{id} | Update category |
| DELETE | /api/admin/types/{id} | Delete category (ADMIN) |
| POST | /api/admin/tags | Create tag |
| PUT | /api/admin/tags/{id} | Update tag |
| DELETE | /api/admin/tags/{id} | Delete tag (ADMIN) |
| DELETE | /api/admin/comments/{id} | Delete comment (ADMIN) |

## Roadmap

- [ ] OAuth2 Google Login
- [ ] WebSocket real-time notifications
- [ ] GraphQL endpoint
- [ ] Payment integration (Stripe)
- [ ] Kafka event-driven messaging
- [ ] Microservice architecture
- [ ] Terraform infrastructure as code
- [ ] CI/CD with Jenkins / GitHub Actions
