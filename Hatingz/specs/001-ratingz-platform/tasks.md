---
description: "Task list for Plataforma Ratingz"
---

# Tasks: Plataforma Ratingz

**Input**: Design documents from `specs/001-ratingz-platform/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/openapi.yaml`, and `quickstart.md`

**Tests**: Included because the constitution requires unit and integration coverage for
authentication, team filtering, lineup isolation, and duplicate-vote protection.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the two-application web project and reproducible local services.

- [X] T001 Create the `backend/` and `frontend/` project manifests and source/test directory structure described in `specs/001-ratingz-platform/plan.md`
- [X] T002 [P] Configure the MySQL 8.0 service, persistent volume, health check, and startup environment in `docker-compose.yml`
- [X] T003 [P] Configure backend TypeScript, scripts, Jest, Supertest, and lint/type-check commands in `backend/package.json`, `backend/tsconfig.json`, and `backend/jest.config.ts`
- [X] T004 [P] Configure frontend Vite, React, TypeScript, React Router DOM, Axios, and test/type-check commands in `frontend/package.json`, `frontend/tsconfig.json`, and `frontend/vite.config.ts`
- [X] T005 [P] Document non-secret MySQL and JWT variables in `backend/.env.example` and ensure `.env` files are ignored by `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared persistence, domain types, security, routing, and error handling
before any user story is implemented.

**Critical**: No user story work can begin until this phase is complete.

- [X] T006 Create the MySQL schema and indexes for `users`, `teams`, `players`, `matches`, `lineups`, `lineup_votes`, and `expulsion_votes` in `backend/src/config/schema.sql`, including unique `(user_id, lineup_id)` and `(user_id, match_id, player_id)` constraints
- [X] T007 [P] Seed the five supported clubs, their real 11-player squads, and representative matches in `backend/src/config/seed.sql`, preserving team/player relationships and display fields
- [X] T008 [P] Implement typed domain models for User, Team, Player, Match, Lineup, LineupVote, and ExpulsionVote in `backend/src/models/`
- [X] T009 Implement environment validation and a MySQL connection pool using `.env` values in `backend/src/config/env.ts` and `backend/src/config/database.ts`
- [X] T010 Implement the shared API error type, error middleware, validation error mapping, and actionable request logging in `backend/src/middlewares/errorHandler.ts` and `backend/src/middlewares/requestLogger.ts`
- [X] T011 Implement JWT signing and verification helpers using the environment-backed secret in `backend/src/config/jwt.ts`
- [X] T012 Implement authentication middleware that attaches the verified user identity to the request and rejects missing or invalid bearer tokens in `backend/src/middlewares/authMiddleware.ts`
- [X] T013 [P] Implement shared request/response validators and public serializers that expose names, slugs, logos, scores, and timestamps without raw numeric IDs in `backend/src/models/validators.ts` and `backend/src/models/serializers.ts`
- [X] T014 Create the Express application, health route, JSON parsing, CORS policy, error middleware, and route registration in `backend/src/app.ts` and `backend/src/server.ts`
- [X] T015 [P] Create frontend API client, auth storage/context, protected-route guard, shared API types, and error-state helpers in `frontend/src/services/api.ts`, `frontend/src/services/auth.ts`, `frontend/src/types/api.ts`, and `frontend/src/components/ProtectedRoute.tsx`

**Checkpoint**: Database, security middleware, API conventions, and frontend routing
foundations are ready for independent story implementation.

---

## Phase 3: User Story 1 - Entrar e acompanhar o time do coraÃ§Ã£o (Priority: P1) MVP

**Goal**: A torcedor can register/login and see only matches involving the persisted
favorite team.

**Independent Test**: Register a Corinthians user, authenticate, call the matches route,
and verify every returned match contains Corinthians; unauthenticated access is rejected.

### Tests for User Story 1

- [X] T016 [P] [US1] Add authentication contract tests for register/login success, invalid input, duplicate email, invalid credentials, and token response in `backend/tests/contract/auth.contract.test.ts`
- [X] T017 [P] [US1] Add integration tests for protected-route rejection and favorite-team match filtering in `backend/tests/integration/auth-matches.integration.test.ts`
- [X] T018 [P] [US1] Add repository/service unit tests for normalized email lookup, password verification, and match team-scope predicates in `backend/tests/unit/auth-match-services.test.ts`

### Implementation for User Story 1

- [X] T019 [P] [US1] Implement user repository methods for unique email lookup, user creation, password hash storage, and favorite-team retrieval in `backend/src/repositories/userRepository.ts`
- [X] T020 [P] [US1] Implement team and match repository queries that return display-ready team data and filter home/away matches by the authenticated user's favorite team in `backend/src/repositories/teamRepository.ts` and `backend/src/repositories/matchRepository.ts`
- [X] T021 [US1] Implement registration and login services with input validation, password hashing, JWT issuance, and safe conflict/credential errors in `backend/src/services/authService.ts`
- [X] T022 [US1] Implement match service with mandatory authenticated-user team scope and empty-result handling in `backend/src/services/matchService.ts`
- [X] T023 [US1] Implement `POST /api/auth/register` and `POST /api/auth/login` controllers and routes matching `contracts/openapi.yaml` in `backend/src/controllers/authController.ts` and `backend/src/routes/authRoutes.ts`
- [X] T024 [US1] Implement authenticated `GET /api/matches` controller and route using the verified request identity rather than client-supplied user/team IDs in `backend/src/controllers/matchController.ts` and `backend/src/routes/matchRoutes.ts`
- [X] T025 [P] [US1] Build login and registration pages with team selector, field validation, accessible errors, and session redirect in `frontend/src/pages/LoginPage.tsx` and `frontend/src/pages/RegisterPage.tsx`
- [X] T026 [P] [US1] Build match card and dashboard components that render real club names, logos, scores, status, and date/time without numeric IDs in `frontend/src/components/MatchCard.tsx`, `frontend/src/pages/DashboardPage.tsx`, and `frontend/src/styles/matches.css`
- [X] T027 [US1] Wire React Router routes, protected dashboard navigation, loading state, empty-state message, and unauthorized redirect in `frontend/src/App.tsx`, `frontend/src/components/ProtectedRoute.tsx`, and `frontend/src/pages/DashboardPage.tsx`

**Checkpoint**: US1 is independently demonstrable as the MVP.

---

## Phase 4: User Story 2 - Montar e compartilhar uma escalaÃ§Ã£o (Priority: P2)

**Goal**: A torcedor can build a readable 4-3-3 lineup, remove players only from the
personal lineup, publish it, browse community lineups, and vote once per lineup.

**Independent Test**: Authenticated users can add/remove/save a lineup; a second user can
view but not mutate the published snapshot and can cast only one lineup vote.

### Tests for User Story 2

- [X] T028 [P] [US2] Add lineup contract tests for save, validation, community listing, and lineup-vote success/conflict responses in `backend/tests/contract/lineups.contract.test.ts`
- [ ] T029 [P] [US2] Add integration tests for player ownership validation, personal removal isolation, published snapshot immutability, and one-vote-per-user behavior in `backend/tests/integration/lineups.integration.test.ts`
- [ ] T030 [P] [US2] Add frontend component tests for 4-3-3 placement, duplicate-player prevention, individual removal, loading/error states, and vote feedback in `frontend/tests/tactical-lineup.test.tsx`

### Implementation for User Story 2

- [X] T031 [P] [US2] Implement player and lineup repositories with team ownership checks, unique player lists, optional match association, publication state, and community vote totals in `backend/src/repositories/playerRepository.ts` and `backend/src/repositories/lineupRepository.ts`
- [X] T032 [US2] Implement lineup service enforcing `4-3-3`, at most 11 unique players belonging to the lineup team, owner-only mutation, and immutable published snapshots in `backend/src/services/lineupService.ts`
- [X] T033 [US2] Implement lineup vote service with published-lineup validation, unique `(user_id, lineup_id)` handling, atomic count retrieval, and stable conflict errors in `backend/src/services/lineupVoteService.ts`
- [X] T034 [US2] Implement `POST /api/lineups`, `GET /api/lineups/community`, and `POST /api/lineups/:lineupId/votes` controllers/routes matching `contracts/openapi.yaml` in `backend/src/controllers/lineupController.ts`, `backend/src/controllers/lineupVoteController.ts`, and `backend/src/routes/lineupRoutes.ts`
- [X] T035 [P] [US2] Implement typed lineup API calls and local personal-lineup state so removal cannot mutate community data in `frontend/src/services/lineupApi.ts` and `frontend/src/types/lineup.ts`
- [X] T036 [P] [US2] Build the green non-overlapping 4-3-3 tactical pitch with real player labels, position slots, add-player selector, and individual remove action in `frontend/src/components/TacticalPitch.tsx` and `frontend/src/styles/tacticalPitch.css`
- [X] T037 [P] [US2] Build lineup editor and save/publish flow with validation and user feedback in `frontend/src/pages/LineupPage.tsx`
- [X] T038 [P] [US2] Build community lineup feed and one-vote interaction with author, team, formation, players, and vote total in `frontend/src/pages/CommunityLineupsPage.tsx` and `frontend/src/components/LineupCard.tsx`
- [X] T039 [US2] Add authenticated lineup routes and navigation while preserving US1 dashboard behavior in `frontend/src/App.tsx`

**Checkpoint**: US1 and US2 both work independently after foundational setup.

---

## Phase 5: User Story 3 - Votar pela expulsÃ£o de um jogador (Priority: P3)

**Goal**: A torcedor can view eligible players for a match, cast one expulsion vote per
player/match, and see an accumulated community total.

**Independent Test**: Cast an expulsion vote, verify the total increases by one, repeat the
same request, and verify a conflict response with no count change.

### Tests for User Story 3

- [ ] T040 [P] [US3] Add expulsion-vote contract tests for eligible-player validation, successful vote, duplicate conflict, and aggregate count response in `backend/tests/contract/expulsion-votes.contract.test.ts`
- [ ] T041 [P] [US3] Add integration tests proving unique `(user_id, match_id, player_id)` enforcement under repeated requests and concurrent submission in `backend/tests/integration/expulsion-votes.integration.test.ts`
- [ ] T042 [P] [US3] Add frontend component tests for player list, count refresh, successful vote, duplicate-vote message, and empty eligible-player state in `frontend/tests/expulsion-voting.test.tsx`

### Implementation for User Story 3

- [X] T043 [P] [US3] Implement expulsion-vote repository methods for eligible players, unique insertion, transaction-safe aggregate counting, and duplicate detection in `backend/src/repositories/expulsionVoteRepository.ts`
- [X] T044 [US3] Implement expulsion-vote service validating that the player belongs to a team participating in the match and mapping duplicate attempts to a conflict error in `backend/src/services/expulsionVoteService.ts`
- [X] T045 [US3] Implement `POST /api/matches/:matchId/expulsion-votes` and the authenticated eligible-player/count read route in `backend/src/controllers/expulsionVoteController.ts` and `backend/src/routes/expulsionVoteRoutes.ts`
- [X] T046 [P] [US3] Implement typed expulsion-vote API functions and response models without exposing raw numeric IDs in `frontend/src/services/expulsionVoteApi.ts` and `frontend/src/types/expulsionVote.ts`
- [X] T047 [P] [US3] Build the match voting page with eligible squad players, accumulated totals, loading/error/empty states, and duplicate-vote messaging in `frontend/src/pages/ExpulsionVotingPage.tsx` and `frontend/src/components/ExpulsionVoteList.tsx`
- [X] T048 [US3] Add authenticated voting routes and match-card navigation to the voting page in `frontend/src/App.tsx` and `frontend/src/components/MatchCard.tsx`

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete product against constitutional gates and quickstart outcomes.

- [ ] T049 [P] Add API contract coverage for every endpoint and error envelope in `backend/tests/contract/openapi-contract.test.ts`
- [ ] T050 [P] Add frontend accessibility and responsive-layout checks for authentication, match cards, tactical pitch, lineup feed, and voting screens in `frontend/tests/accessibility.test.tsx`
- [ ] T051 [P] Add database indexes and query timing instrumentation for team-scoped matches and community feed in `backend/src/config/schema.sql` and `backend/src/middlewares/requestLogger.ts`
- [X] T052 Run backend unit/integration/contract tests and frontend component/type-check commands, fixing failures without weakening the acceptance criteria
- [ ] T053 Run every scenario in `specs/001-ratingz-platform/quickstart.md` against the local Docker/MySQL environment and record any setup correction in that guide
- [ ] T054 Review all frontend response mappers and rendered screens for raw numeric IDs, missing real team/player data, and tactical-pitch overlap before marking the feature complete
- [ ] T055 Verify environment files, JWT secret handling, CORS policy, authorization ownership checks, and duplicate-vote database constraints before release

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T002-T005 can run in parallel after T001 establishes the project layout.
- **Foundational (Phase 2)**: Depends on T001-T005 and blocks all user stories.
- **User Stories (Phases 3-5)**: Depend on Phase 2; US1 is the MVP, while US2 and US3 can be staffed in parallel after foundation.
- **Polish (Phase 6)**: Depends on the stories selected for release, with T049-T051 parallelizable.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 and has no dependency on another story.
- **US2 (P2)**: Starts after Phase 2; it reuses authentication and team/player data but has its own lineup contracts and tests.
- **US3 (P3)**: Starts after Phase 2; it reuses authentication and match/player data but has its own vote contracts and tests.

### Within Each User Story

- Contract/integration/component tests are written before the implementation tasks and must fail before the behavior is implemented.
- Repositories and domain validation precede services; services precede controllers/routes; backend contracts precede frontend integration.
- A story checkpoint must pass before it is considered independently deliverable.

## Parallel Opportunities

- **Setup**: T002, T003, T004, and T005 can run concurrently after T001.
- **Foundation**: T007, T008, T013, and T015 can run concurrently once the base layout exists; T009-T012 depend on the configuration/model decisions.
- **US1**: T016-T018 can run concurrently; T019, T020, T025, and T026 can run concurrently before their dependent wiring tasks.
- **US2**: T028-T030 can run concurrently; T031, T035, T036, T037, and T038 can be split across backend/frontend owners.
- **US3**: T040-T042 can run concurrently; T043, T046, and T047 can be split across backend/frontend owners.
- **Polish**: T049-T051 can run concurrently before T052-T055.

## Parallel Example: User Story 1

```text
Task T016: Contract tests in backend/tests/contract/auth.contract.test.ts
Task T017: Integration tests in backend/tests/integration/auth-matches.integration.test.ts
Task T018: Service tests in backend/tests/unit/auth-match-services.test.ts
Task T025: Login/Register pages in frontend/src/pages/
Task T026: Match card/dashboard presentation in frontend/src/components/ and frontend/src/pages/
```

## Implementation Strategy

1. Deliver Phase 1 and Phase 2 as the shared platform foundation.
2. Ship US1 first as the MVP, including its tests and checkpoint.
3. Add US2 without allowing personal lineup edits to mutate published snapshots.
4. Add US3 with database-enforced uniqueness and transaction-safe aggregate counts.
5. Run the complete quickstart and constitutional quality gates before release.

