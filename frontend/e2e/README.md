# E2E Tests — Learning Notes

Day 1 — 2026-05-06

## Setup decisions

- **Where:** `frontend/e2e/` (could also live at repo root; either is fine).
- **Language:** TypeScript — matches the frontend, types help with Playwright's API.
- **CI workflow:** skipped for now, can add later when tests stabilize.
- **Browsers:** let Playwright install its own pinned Chromium/Firefox/WebKit. They differ from system Chrome — pinned versions, automation hooks, headless-optimized.

## Common commands

```bash
npx playwright test                    # run all tests
npx playwright test home.spec.ts       # run one file
npx playwright test --ui               # interactive UI mode (great for debugging)
npx playwright codegen http://localhost:3000   # record actions, generates test code
npx playwright show-report             # open last HTML report
```

## Config notes (`playwright.config.ts`)

- `reporter: 'html'` — generates HTML report in `playwright-report/`. Doesn't auto-open on pass; run `show-report`.
- `use.baseURL: 'http://localhost:3000'` — lets you write `page.goto('/')` instead of full URL.
- Three projects by default: chromium, firefox, webkit — each test runs in all three.

## Locator priority (most → least preferred)

1. `getByRole(role, { name })` — semantic, mirrors how screen readers see the page.
2. `getByLabel` / `getByPlaceholder` — for form inputs.
3. `getByText` — non-interactive content.
4. `getByTestId` — last resort, when nothing else fits.
5. CSS / XPath — avoid; brittle.

## Gotcha learned today

`<a href="...">Jack's Blog</a>` has ARIA role **`link`**, not `heading`.

```ts
// ❌ fails — element is not a heading
await expect(page.getByRole('heading', { name: "Jack's Blog" })).toBeVisible();

// ✅ correct
await expect(page.getByRole('link', { name: "Jack's Blog" })).toBeVisible();
```

When in doubt: open the page, inspect the element, check its tag — or use `--ui` mode and pick the locator visually.

## Prereq before running tests

The full stack must be up:

```bash
docker compose up -d   # from repo root
```

Tests hit `http://localhost:3000` (frontend) which talks to the backend container.