package com.yao.blog.config;

import com.yao.blog.entity.Blog;
import com.yao.blog.entity.Tag;
import com.yao.blog.entity.User;
import com.yao.blog.enums.Role;
import com.yao.blog.repository.BlogRepository;
import com.yao.blog.repository.TagRepository;
import com.yao.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final BlogRepository blogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        User admin = initAdmin();
        List<Tag> tags = initTags();
        initBlogs(admin, tags);
    }

    private User initAdmin() {
        if (!userRepository.existsByUsernameAndDeletedFalse("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .nickname("Admin")
                    .email("admin@blog.com")
                    .avatar("/images/admin-avatar.png")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created: admin / admin123");
            return admin;
        }
        return userRepository.findByUsernameAndDeletedFalse("admin").orElseThrow();
    }

    private List<Tag> initTags() {
        if (tagRepository.findByDeletedFalse().isEmpty()) {
            List<Tag> tags = List.of(
                    Tag.builder().name("Java").build(),
                    Tag.builder().name("Spring Boot").build(),
                    Tag.builder().name("Docker").build(),
                    Tag.builder().name("React").build(),
                    Tag.builder().name("Next.js").build(),
                    Tag.builder().name("DevOps").build(),
                    Tag.builder().name("PostgreSQL").build(),
                    Tag.builder().name("TypeScript").build()
            );
            tagRepository.saveAll(tags);
            log.info("Default tags created: {}", tags.size());
            return tags;
        }
        return tagRepository.findByDeletedFalse();
    }

    private void initBlogs(User admin, List<Tag> tags) {
        if (blogRepository.countByDeletedFalse() > 0) return;

        Tag java = findTag(tags, "Java");
        Tag spring = findTag(tags, "Spring Boot");
        Tag docker = findTag(tags, "Docker");
        Tag react = findTag(tags, "React");
        Tag nextjs = findTag(tags, "Next.js");
        Tag devops = findTag(tags, "DevOps");
        Tag postgres = findTag(tags, "PostgreSQL");
        Tag typescript = findTag(tags, "TypeScript");

        List<Blog> blogs = List.of(
                Blog.builder()
                        .title("Getting Started with Spring Boot 3")
                        .content("## Introduction\n\nSpring Boot 3 brings several exciting features including support for **Java 17+**, GraalVM native images, and improved observability.\n\n### Key Features\n\n- Jakarta EE 10 migration\n- Native compilation support\n- Improved auto-configuration\n- Better Docker support\n\n### Quick Start\n\n```java\n@SpringBootApplication\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.run(Application.class, args);\n    }\n}\n```\n\nSpring Boot 3 is a major milestone for the Spring ecosystem.")
                        .description("An introduction to Spring Boot 3 and its key features including Java 17 support and native compilation.")
                        .tags(List.of(java, spring))
                        .user(admin)
                        .published(true)
                        .recommend(true)
                        .commentable(true)
                        .build(),

                Blog.builder()
                        .title("Docker Compose for Local Development")
                        .content("## Why Docker Compose?\n\nDocker Compose simplifies multi-container development environments. Instead of installing PostgreSQL, Redis, and other services locally, just define them in `docker-compose.yml`.\n\n### Example\n\n```yaml\nservices:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_DB: myapp\n      POSTGRES_PASSWORD: secret\n    ports:\n      - \"5432:5432\"\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - \"6379:6379\"\n```\n\n### Tips\n\n- Use `volumes` to persist data\n- Use `depends_on` with health checks\n- Use `.env` files for secrets\n\nDocker Compose is essential for modern development workflows.")
                        .description("Learn how to use Docker Compose to set up local development environments with databases and caches.")
                        .tags(List.of(docker, devops))
                        .user(admin)
                        .published(true)
                        .recommend(true)
                        .commentable(true)
                        .build(),

                Blog.builder()
                        .title("Building a Blog with Next.js App Router")
                        .content("## Next.js App Router\n\nThe App Router in Next.js introduces a new paradigm for building React applications with:\n\n- **Server Components** by default\n- **Nested layouts** for shared UI\n- **Streaming** for progressive rendering\n\n### Server vs Client Components\n\nServer Components run on the server and can directly fetch data:\n\n```tsx\nexport default async function BlogPage() {\n  const posts = await fetch('http://api/posts');\n  return <div>{posts.map(p => <h2>{p.title}</h2>)}</div>;\n}\n```\n\nClient Components are needed for interactivity:\n\n```tsx\n'use client';\nexport default function LikeButton() {\n  const [liked, setLiked] = useState(false);\n  return <button onClick={() => setLiked(!liked)}>Like</button>;\n}\n```\n\nThe App Router is the future of Next.js development.")
                        .description("Exploring the Next.js App Router with Server Components, nested layouts, and streaming.")
                        .tags(List.of(react, nextjs, typescript))
                        .user(admin)
                        .published(true)
                        .recommend(true)
                        .commentable(true)
                        .build(),

                Blog.builder()
                        .title("PostgreSQL Performance Tuning Basics")
                        .content("## PostgreSQL Performance\n\nPostgreSQL is powerful out of the box, but proper tuning can make a huge difference.\n\n### Key Settings\n\n- `shared_buffers`: Set to 25% of total RAM\n- `effective_cache_size`: Set to 75% of total RAM\n- `work_mem`: Start with 4MB, increase for complex queries\n\n### Indexing Strategies\n\n```sql\n-- B-tree index for equality and range queries\nCREATE INDEX idx_blog_created ON t_blog (created_at DESC);\n\n-- Partial index for published blogs only\nCREATE INDEX idx_blog_published ON t_blog (updated_at DESC)\n  WHERE deleted = false AND published = true;\n```\n\n### EXPLAIN ANALYZE\n\nAlways use `EXPLAIN ANALYZE` to understand query plans before optimizing.")
                        .description("Essential PostgreSQL performance tuning tips covering configuration, indexing strategies, and query analysis.")
                        .tags(List.of(postgres))
                        .user(admin)
                        .published(true)
                        .commentable(true)
                        .build(),

                Blog.builder()
                        .title("TypeScript Tips for React Developers")
                        .content("## TypeScript + React\n\nTypeScript makes React development safer and more productive.\n\n### Essential Patterns\n\n**Typing Props:**\n```tsx\ninterface ButtonProps {\n  label: string;\n  onClick: () => void;\n  variant?: 'primary' | 'secondary';\n}\n\nexport default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {\n  return <button className={variant} onClick={onClick}>{label}</button>;\n}\n```\n\n**Generic Components:**\n```tsx\ninterface ListProps<T> {\n  items: T[];\n  renderItem: (item: T) => React.ReactNode;\n}\n\nfunction List<T>({ items, renderItem }: ListProps<T>) {\n  return <ul>{items.map(renderItem)}</ul>;\n}\n```\n\nTypeScript catches bugs at compile time that would otherwise slip into production.")
                        .description("Practical TypeScript patterns for React development including prop typing and generic components.")
                        .tags(List.of(typescript, react))
                        .user(admin)
                        .published(true)
                        .recommend(false)
                        .commentable(true)
                        .build(),

                Blog.builder()
                        .title("JWT Authentication in Spring Security")
                        .content("## JWT Auth with Spring Security\n\nJSON Web Tokens provide stateless authentication for REST APIs.\n\n### How It Works\n\n1. User sends credentials to `/api/auth/login`\n2. Server validates and returns a JWT\n3. Client includes JWT in `Authorization: Bearer <token>` header\n4. Server validates token on each request\n\n### Implementation\n\n```java\n@Component\npublic class JwtService {\n    public String generateToken(UserDetails user) {\n        return Jwts.builder()\n            .setSubject(user.getUsername())\n            .setIssuedAt(new Date())\n            .setExpiration(new Date(System.currentTimeMillis() + 900000))\n            .signWith(getSigningKey())\n            .compact();\n    }\n}\n```\n\nAlways use refresh tokens for long-lived sessions and short-lived access tokens for security.")
                        .description("Implementing JWT-based authentication with Spring Security for REST APIs.")
                        .tags(List.of(java, spring))
                        .user(admin)
                        .published(true)
                        .commentable(true)
                        .build()
        );

        blogRepository.saveAll(blogs);
        log.info("Test blog posts created: {}", blogs.size());
    }

    private Tag findTag(List<Tag> tags, String name) {
        return tags.stream()
                .filter(t -> t.getName().equals(name))
                .findFirst()
                .orElseThrow();
    }
}
