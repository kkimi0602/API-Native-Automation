# API Native Automation

Automated API test framework for [Restful Booker](https://restful-booker.herokuapp.com/), built with
Playwright, TypeScript, and Allure Reports.

## Stack

| Concern        | Tool / Library                        |
| -------------- | ------------------------------------- |
| Language       | TypeScript (strict mode)              |
| Testing engine | `@playwright/test`                    |
| Data factory   | `@faker-js/faker` + Builder pattern   |
| Reporting      | `allure-playwright` + Allure CLI      |
| Linting        | ESLint v8 + `@typescript-eslint`      |
| Formatting     | Prettier                              |
| Pre-commit     | Husky v9 + lint-staged                |
| CI             | GitHub Actions (4-shard parallel run) |

## Project Structure

```
├── src/
│   ├── types/          # TypeScript interfaces (domain models + service contracts)
│   ├── services/       # HTTP service layer (AuthService, BookingService, BaseService)
│   ├── factories/      # BookingFactory + BookingBuilder (Faker.js integration)
│   └── fixtures/       # Playwright custom fixtures (DI for services + auth token)
├── tests/
│   ├── auth/           # Authentication tests
│   ├── booking/        # Create / Update / Delete booking tests
│   └── negative/       # Negative & edge-case scenarios
├── .github/workflows/  # GitHub Actions CI pipeline
├── .husky/             # Pre-commit hooks
├── PROMPTS.md          # AI & manual approach documentation
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

```bash
# All tests
npm test

# With sharding (e.g. shard 1 of 4)
npx playwright test --shard=1/4

# Specific file
npx playwright test tests/auth/auth.spec.ts
```

## Linting & Formatting

```bash
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check (used in CI)
npm run typecheck     # tsc --noEmit
```

## Allure Reports

```bash
npm run allure:generate   # Generate HTML report from allure-results/
npm run allure:open       # Open report in browser
```

## Environment Variables

| Variable       | Default                                | Description   |
| -------------- | -------------------------------------- | ------------- |
| `BASE_URL`     | `https://restful-booker.herokuapp.com` | API base URL  |
| `API_USERNAME` | `admin`                                | Auth username |
| `API_PASSWORD` | `password123`                          | Auth password |

## Design Decisions

- **No direct `request` calls in `.spec` files** — all HTTP goes through the service layer.
- **Dependency Inversion** — specs depend on `IAuthService` / `IBookingService` interfaces, not
  concrete classes. Concrete implementations are injected via Playwright fixtures.
- **Dual service methods** — typed methods (`createBooking`) for happy-path tests, `Raw` variants
  (`createBookingRaw`) for negative tests that need HTTP status code assertions.
- **Builder + Factory** — `BookingBuilder` for explicit data setup, `BookingFactory.createWithFaker()`
  for unique random data that avoids test pollution across parallel shards.

See [PROMPTS.md](./PROMPTS.md) for full documentation of AI vs manual decisions.
