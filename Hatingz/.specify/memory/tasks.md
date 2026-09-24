### 4. `tasks.md`
> Salvar como: `.specify/memory/tasks.md`

```markdown
# Tasks: Ratingz Core System

**Input**: Design documents from `.specify/memory/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Initialize repository structure with backend/ and frontend/ directories
- [ ] T002 [P] Configure docker-compose.yml for MySQL 8.0 container with init.sql script
- [ ] T003 [P] Initialize Node.js + Express + TypeScript project in backend/ with `tsx` runner

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Setup MySQL database schema (users, teams, players, matches, lineups, expulsion_votes)
- [ ] T005 [P] Seed MySQL database with 11 real starting players for Palmeiras, Bahia, Corinthians, São Paulo, and Vasco
- [ ] T006 [P] Implement JWT authentication middleware in `backend/src/middlewares/authMiddleware.ts`
- [ ] T007 Initialize React + TypeScript application with Vite and React Router DOM in `frontend/`

---

## Phase 3: User Story 1 - Autenticação & Partidas do Time do Coração (Priority: P1) 🎯 MVP

### Implementation for User Story 1

- [ ] T008 [P] [US1] Create User model and Auth Repository in `backend/src/repositories/userRepository.ts`
- [ ] T009 [US1] Implement AuthController (register/login) in `backend/src/controllers/authController.ts`
- [ ] T010 [P] [US1] Implement Match Repository and Service in `backend/src/services/matchService.ts` filtering by user's team
- [ ] T011 [US1] Implement MatchController for GET /api/matches in `backend/src/controllers/matchController.ts`
- [ ] T012 [P] [US1] Create LoginPage and RegisterPage components in `frontend/src/pages/LoginPage.tsx`
- [ ] T013 [US1] Create DashboardPage and MatchCard components in `frontend/src/pages/DashboardPage.tsx` rendering user team matches only

---

## Phase 4: User Story 2 - Prancheta Tática Visual & Feed de Escalações (Priority: P2)

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create Lineup Repository and Service in `backend/src/services/lineupService.ts`
- [ ] T015 [US2] Implement LineupController for POST /api/lineups and GET /api/lineups/community
- [ ] T016 [P] [US2] Build TacticalPitch visual component (green pitch 4-3-3 layout) in `frontend/src/components/TacticalPitch.tsx`
- [ ] T017 [US2] Add player selection dropdown and individual 'Remove' button logic on TacticalPitch
- [ ] T018 [US2] Build FeedEscalacoesPage component in `frontend/src/pages/FeedEscalacoesPage.tsx` with upvoting system

---

## Phase 5: User Story 3 - Votação Acumulativa de Expulsão (Priority: P3)

### Implementation for User Story 3

- [ ] T019 [P] [US3] Create ExpulsionVote Repository with UNIQUE constraint (user_id, match_id, player_id) in `backend/src/repositories/voteRepository.ts`
- [ ] T020 [US3] Implement VoteController for POST /api/votes/expel in `backend/src/controllers/voteController.ts`
- [ ] T021 [US3] Build VotacaoPage component in `frontend/src/pages/VotacaoPage.tsx` with squad player list and expulsion counter
- [ ] T022 [P] [US3] Write unit tests in `backend/tests/voteService.test.ts` verifying duplicate vote protection (Rick)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T023 [P] Verify CORS configuration between frontend (localhost:5173) and backend (localhost:3000)
- [ ] T024 Perform end-to-end user journey validation across all 5 clubs