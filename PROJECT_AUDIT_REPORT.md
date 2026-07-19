# EyeX Technologies — Full System Audit Report

**Date:** 2026-07-19
**Auditor:** OpenCode (automated + manual review)
**Scope:** Full stack (Python backend, frontend), tests, lint, migrations, security
**Command:** Audit-only; no new features added.

---

## Executive Summary

| Area | Result | Notes |
|------|--------|-------|
| Backend tests | 390 passed, 0 failed, 8 warnings | All green |
| Frontend build | Success | Vite + Nitro build completed |
| Frontend lint | 3,170 issues (mostly Prettier formatting) | Build unaffected; code is functional |
| Backend lint | 805 issues (mostly E501/I001 existing debt) | No runtime errors introduced |
| Critical runtime bugs found | 4 | All fixed |
| Database migrations | 5 migrations importable; env.py fixed for async driver | Could not connect to live PG (not running) |
| Security scan | Manual review | No SQL injection, eval/exec, or hardcoded production secrets; weak default secrets noted |

**Overall verdict:** System is functionally healthy. Test suite passes, frontend builds, migrations are syntactically valid, and four real runtime bugs were corrected. The largest remaining risk is long-standing lint/formatting debt and weak default secrets in local config.

---

## Codebase Metrics

| Layer | Files | Lines |
|-------|-------|-------|
| Python backend (`app/`) | 134 | ~21,680 |
| TypeScript frontend (`src/`) | 174 | ~18,740 |
| Tests (`tests/`) | 50+ | ~7,000+ |

---

## Critical Issues Fixed

### 1. `app/services/gtm_pricing.py` — Missing `defaultdict` import (F821)
- **Impact:** `get_revenue_analytics()` would raise `NameError` at runtime.
- **Fix:** Added `from collections import defaultdict`.

### 2. `app/services/gtm_sales.py` — Missing `CustomerOnboarding` import (F821)
- **Impact:** All onboarding methods (`start_onboarding`, `get_onboarding`, etc.) would raise `NameError`.
- **Fix:** Added `CustomerOnboarding` to the `app.models.gtm` import.

### 3. `app/services/gtm_sales.py` — Loop variable shadowed `desc` import (F402)
- **Impact:** Local variable `desc` in `start_onboarding()` shadowed the SQLAlchemy `desc` import; could cause confusion/errors if reused later.
- **Fix:** Renamed loop variable to `description`.

### 4. SQLAlchemy boolean comparison anti-patterns (E712)
- **Files:** `app/api/v1/billing.py`, `app/services/gtm_proof.py`
- **Impact:** `== True` works in some SQLAlchemy contexts but is flagged and can behave unexpectedly with SQLAlchemy 2.0.
- **Fix:** Replaced with `.is_(True)`.

### 5. `alembic/env.py` — Sync engine used with asyncpg driver
- **Impact:** `alembic current` / `alembic upgrade head` failed with `MissingGreenlet` because `engine_from_config` created a synchronous engine for an asyncpg URL.
- **Fix:** Rewrote `run_migrations_online()` to use `async_engine_from_config` and `asyncio.run()`.

---

## Test Results

```text
390 passed, 8 warnings in 57.95s
```

Warnings are pre-existing `RuntimeWarning: coroutine 'AsyncMockMixin._execute_mock_call' was never awaited` in fallback tests. They do not cause failures.

### Test Distribution (approximate)

| Module | Tests |
|--------|-------|
| Agent schema/fallback/integration | ~40 |
| Graph routing/execution | ~20 |
| Memory integration | ~20 |
| Tool tests | ~60 |
| Endpoint tests | ~40 |
| Security tests | ~20 |
| Cognitive Data Layer | ~32 |
| GTM | ~18 |
| Governance | ~22 |
| Benchmarks | ~35 |
| Competitive Moat / Industry / Marketplace | ~40 |
| Platform / other | ~43 |

---

## Lint & Static Analysis

### Backend (`ruff check app`)

```text
805 errors total
  603 E501 line-too-long
  103 F401 unused-import
   30 I001 unsorted-imports
   13 F821 undefined-name  ← critical, now 0 remaining
   11 UP042 replace-str-enum
    9 UP041 timeout-error-alias
    7 E402 module-import-not-at-top
    7 F841 unused-variable
    7 UP035 deprecated-import
    5 W292 missing-newline-at-end
    4 F541 f-string-missing-placeholders
    2 E712 true-false-comparison  ← fixed
    1 E741 ambiguous-variable
    1 F402 import-shadowed-by-loop-var  ← fixed
    1 N818 error-suffix-on-exception
    1 UP037 quoted-annotation
```

All **runtime-critical** rules (F821, F402, E712) are resolved. Remaining issues are style/quality debt.

### Frontend (`npm run lint`)

```text
3,170 problems (3,159 errors, 11 warnings)
3,112 errors potentially fixable with --fix
```

- Dominant issue: Prettier formatting (line breaks, quote style, trailing commas).
- Real lint issues: `@typescript-eslint/no-explicit-any` and a few `no-case-declarations`.
- **Build passes**, so these are quality/style concerns, not blockers.

---

## Security Review

### No critical vulnerabilities found

- No `eval()`, `exec()`, or `compile()` on user input.
- No SQL string concatenation; DB tools use parameterized queries and table allowlists.
- No hardcoded production secrets in source.

### Security concerns (non-blocking)

1. **Default secrets in `app/config.py`**
   - `app_secret_key` default is a placeholder string.
   - `database_url` default contains `eyex_password`.
   - Mitigation: Override via environment variables in production.

2. **Fallback secret key in `app/core/enterprise_security.py`**
   - `_get_fernet()` falls back to `default-secret-key-32-bytes-long!!` if `APP_SECRET_KEY` is not set.
   - Mitigation: Always set `APP_SECRET_KEY` in production.

3. **Code execution tool inherits `os.environ`**
   - `run_python_code` runs user code in a subprocess with the full parent environment.
   - Mitigation: Use a restricted env or dedicated sandbox for untrusted code.

4. **Frontend `any` types**
   - Widespread use of `any` reduces TypeScript safety.
   - Mitigation: Gradually replace with concrete types.

---

## Database & Migrations

- 5 migrations present and syntactically valid:
  - `0001_initial.py`
  - `0002_memory_tables.py`
  - `0003_customer_platform.py`
  - `0004_gtm_growth_system.py`
  - `0005_enterprise_trust_intelligence.py`
- `alembic/env.py` updated to use `async_engine_from_config`.
- Live migration validation blocked because PostgreSQL was not running locally.
- Recommend running `alembic upgrade head` and `alembic check` against a live database before deploying.

---

## Frontend Build

```text
npm run build → success
```

- Output generated in `.output/`.
- Wrangler config warnings are non-blocking (Cloudflare plugin overrides existing config).

---

## Recommendations

### Immediate (pre-deploy)
1. Run full migration against a real PostgreSQL instance.
2. Replace default/placeholder secrets with production values.
3. Verify `APP_SECRET_KEY` is at least 32 bytes for Fernet encryption.

### Short-term
4. Run `ruff check app --fix` and `npm run lint -- --fix` to clear formatting debt.
5. Remove unused imports flagged by F401.
6. Address `@typescript-eslint/no-explicit-any` violations in frontend services.

### Medium-term
7. Add `pip-audit` / `safety` dependency scanning to CI.
8. Add frontend unit tests beyond the build step.
9. Sandbox `run_python_code` with a restricted environment and resource limits.
10. Add end-to-end tests for critical user flows.

---

## Audit Scope & Limitations

- **Automated tools used:** pytest, ruff, npm build/lint.
- **Manual review:** critical lint errors, security patterns, migration env.
- **Not performed:** live dependency vulnerability scan (tools not installed), live penetration test, performance/load testing.
- **No new features were added.** Only critical bug fixes and migration infrastructure correction.

---

## Sign-off

System is **functionally stable** with 390 passing tests, a successful frontend build, and all identified critical runtime issues resolved. Remaining work is code-quality cleanup and production hardening.
