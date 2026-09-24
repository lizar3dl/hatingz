# Implementation Plan: Plataforma Ratingz

**Branch**: `001-ratingz-platform` | **Date**: 2026-09-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from [spec.md](./spec.md)

## Summary

Implementar uma plataforma web de torcida com autenticação por time, partidas filtradas
por clube, prancheta 4-3-3, feed de escalações e votação de expulsão. A solução usará
um frontend React/TypeScript, um BFF Node.js/Express e MySQL 8.0, com contratos HTTP
explícitos, autorização baseada em JWT e restrições de unicidade no banco para votos.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 24+, React 18+

**Primary Dependencies**: Express, mysql2, jsonwebtoken, Axios, React Router DOM,
Vite, Jest, Supertest

**Storage**: MySQL 8.0 via Docker Compose; environment variables loaded from `.env`

**Testing**: Jest and Supertest for backend unit/contract/integration coverage; frontend
component tests where configured; TypeScript type-checking

**Target Platform**: Responsive desktop/mobile web browser; backend runs locally or in
the Docker-based development environment

**Project Type**: Full-stack web application with REST BFF

**Performance Goals**: At least 95% of match and feed reads under 200 ms in the
defined development concurrency test

**Constraints**: JWT required for restricted routes; no raw numeric IDs in UI responses;
database uniqueness for lineup and expulsion votes; real club/player seed data; no
secrets committed

**Scale/Scope**: Five clubs, 55 initial players, authenticated users, match dashboard,
lineup editor/feed, and match voting for the first release

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|---|---|---|
| Domain behavior is user-scoped and displays real names, logos, scores, and players | PASS | Match query contract requires authenticated team scope; response schemas expose display fields |
| Restricted behavior is secured by verified JWT and environment-backed secrets | PASS | Auth middleware and security schemes are defined in the contract; `.env` configuration is required |
| Business rules have unit and integration coverage | PASS | Quickstart and test plan cover auth, filtering, lineup isolation, and duplicate votes |
| Tactical UI is accessible, readable, and non-overlapping | PASS | UI contract specifies 4-3-3 positions, labels, empty/loading/error states |
| Performance and actionable errors are observable | PASS | Response target is defined; error envelope and validation scenarios are documented |

## Project Structure

### Documentation (this feature)

```text
specs/001-ratingz-platform/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── repositories/
│   ├── services/
│   ├── models/
│   └── server.ts
└── tests/
    ├── unit/
    ├── integration/
    └── contract/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── App.tsx
└── tests/

docker-compose.yml
backend/.env.example
```

**Structure Decision**: Use the existing two-application web layout from the project
context: `backend/` owns authentication, authorization, domain services, repositories,
and REST controllers; `frontend/` owns pages, accessible components, typed API calls,
and user state. MySQL schema and seed data are versioned with the backend setup.

## Complexity Tracking

No constitution violations identified; no complexity exception is required.
