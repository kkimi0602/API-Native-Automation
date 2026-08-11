# PROMPTS.md — AI & Manual Approach Documentation

This file documents how GitHub Copilot (Claude Sonnet 4.6 via VS Code Copilot) and manual decisions
were combined to build the framework, as required by the Definition of Done.

---

## 1. API Exploration

**Approach:** Playwright MCP + manual review of the Restful Booker API documentation.

- Used the Playwright MCP `fetch_webpage` tool to retrieve the full API spec from
  `https://restful-booker.herokuapp.com/apidoc/index.html`.
- Extracted all endpoints, request/response shapes, and authentication requirements.
- Identified that `DELETE /booking/:id` returns **201 Created** (unusual but correct per docs).
- Identified that `POST /auth` always returns **200**, even on failure — failure is signaled via
  `{ "reason": "Bad credentials" }` in the response body.

---

## 2. TypeScript Types Generation

**Approach:** AI-assisted (GitHub Copilot).

- Prompt: _"Based on the Restful Booker API documentation, generate TypeScript interfaces for all
  request/response models, including service interfaces that apply the Dependency Inversion
  principle."_
- Result: `src/types/booking.types.ts` with `Booking`, `CreateBookingResponse`, `IAuthService`,
  `IBookingService`, and `ServiceResponse<T>`.

---

## 3. Service Layer

**Approach:** AI-assisted architecture, manually reviewed.

- `BaseService` abstracts all HTTP methods over `APIRequestContext`.
- Each concrete service (`AuthService`, `BookingService`) extends `BaseService` and implements a
  corresponding interface — satisfying **Dependency Inversion**.
- Dual methods (e.g., `createBooking` / `createBookingRaw`) allow typed return values for happy
  paths and raw `ServiceResponse<T>` for negative/edge-case assertions — without exposing
  `request` directly to `.spec` files.

---

## 4. Builder & Factory Pattern

**Approach:** AI-generated skeleton, manually enriched.

- `BookingBuilder`: fluent, chainable builder with sensible defaults.
- `BookingFactory`: static factory methods — `createDefault()`, `createWithFaker()`, `builder()`.
- Faker.js (`@faker-js/faker`) is used in `createWithFaker()` for realistic, unique test data per
  run, preventing stale-data collisions across parallel shards.

---

## 5. Fixtures

**Approach:** AI-generated.

- Custom `test` is created via `base.extend<ApiFixtures>()`, injecting `AuthService`,
  `BookingService`, and a resolved `authToken` into tests.
- Specs declare only what they need; the fixture graph resolves dependencies automatically.
- No direct `request` usage in `.spec` files — all HTTP goes through the service layer.

---

## 6. ESLint + Prettier + Husky

**Approach:** AI-generated config, manually verified.

- ESLint v8 with `@typescript-eslint` plugin and `eslint-config-prettier` (disables conflicting
  formatting rules).
- Prettier enforces consistent style (single quotes, trailing commas, LF line endings).
- Husky v9 with `lint-staged` runs ESLint and Prettier on staged `.ts` files before every commit,
  blocking commits that introduce linting or formatting errors.

---

## 7. Allure Reporting

**Approach:** AI-generated.

- `allure-playwright` reporter is configured in `playwright.config.ts`.
- `allure-commandline` is used to generate the HTML report from raw `allure-results/`.
- CI workflow merges sharded results and generates a unified report, uploaded as an artifact and
  (optionally) deployed to GitHub Pages.

---

## 8. CI/CD Pipeline

**Approach:** AI-generated, architecture decisions reviewed manually.

- Three-job pipeline: `lint` → `test` (4 shards, parallel) → `allure-report`.
- Lint job gates the test run — the pipeline fails if ESLint or Prettier check fails.
- Playwright traces are uploaded on test failure for debugging.
- Sharding is implemented via a `matrix.shard` strategy (1–4), enabling ~4× faster CI.

---

## 9. Negative Scenarios — AI Brainstorm vs Manual Ideas

**AI-suggested edge cases:**

- Empty credentials for auth.
- Invalid/missing token for PUT and DELETE.
- Non-existent booking ID (GET → 404).
- Empty or partial JSON body for POST.

**Manually identified additional cases:**

- Empty string token (as opposed to missing cookie header) — still returns 403.
- Verifying that a deleted booking is unretrievable (composite test across delete + get).

---

## 10. Automated Healing Example

A test failure during development was observed where `partialUpdateBooking` tests failed because the
`bookingdates` object was partially overwritten rather than merged by the API. This was resolved by:

1. Identifying the issue via the Playwright HTML report and request trace.
2. Adjusting the test expectation to match the actual API behaviour (the API replaces the entire
   `bookingdates` object when any sub-field is patched).
3. Documenting the finding here for future reference.
