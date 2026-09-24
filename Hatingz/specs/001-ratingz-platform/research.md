# Research: Plataforma Ratingz

## Decision 1: Use a REST BFF with typed resource contracts

- **Decision**: Expose authentication, matches, lineups, lineup votes, and expulsion
  voting as resource-oriented HTTP endpoints documented in `contracts/openapi.yaml`.
- **Rationale**: The feature has a browser client and a single backend boundary. Explicit
  request/response shapes make authorization, validation, and integration tests
  independently verifiable without coupling the frontend to database models.
- **Alternatives considered**: GraphQL was rejected because the first release has a small,
  stable set of workflows and needs straightforward route-level authorization.

## Decision 2: Enforce vote uniqueness in the database and service layer

- **Decision**: Use unique constraints for `(user_id, lineup_id)` and
  `(user_id, match_id, player_id)`, with service-level conflict handling returning a
  stable user-facing error.
- **Rationale**: The database is the final protection against rapid duplicate requests or
  concurrent submissions; service validation provides a clear response rather than an
  opaque database failure.
- **Alternatives considered**: Client-only disabling was rejected because it cannot
  protect against retries, multiple devices, or concurrent requests.

## Decision 3: Derive authorization scope from the verified JWT

- **Decision**: Registration and login issue a signed token containing the user identity;
  restricted handlers use the verified identity and load the user's selected team from
  persisted data.
- **Rationale**: This prevents clients from substituting another user or team in request
  parameters and keeps all restricted routes consistent.
- **Alternatives considered**: Trusting a client-provided `userId` or team identifier was
  rejected as insecure and inconsistent with the constitution.

## Decision 4: Keep user lineup edits isolated from published lineups

- **Decision**: Treat a saved lineup as an immutable community snapshot after publication;
  personal removal updates only the authenticated user's current lineup state.
- **Rationale**: This directly satisfies the requirement that one torcedor cannot alter
  another torcedor's published formation and makes feed reads predictable.
- **Alternatives considered**: Mutating shared lineup records was rejected because it
  creates cross-user side effects and violates the domain rule.

## Decision 5: Use seeded canonical club and player data

- **Decision**: Seed the five supported clubs and 11 initial players per club with stable
  internal identifiers, while all API/UI display payloads use names, positions, logos,
  and shirt numbers.
- **Rationale**: The feature requires real player data and truthful match cards while
  preventing raw numeric identifiers from leaking into the UI.
- **Alternatives considered**: Placeholder squads were rejected because they fail the
  core acceptance criteria.

## Resolved Unknowns

- Authentication method: email and password with JWT, based on the approved feature
  assumptions and constitution security rules.
- First-release scope: five named clubs, responsive web experience, persistent votes,
  and no password recovery or social login.
- Performance target: at least 95% of match/feed reads below 200 ms in the planned
  development concurrency test, matching the feature success criterion.
