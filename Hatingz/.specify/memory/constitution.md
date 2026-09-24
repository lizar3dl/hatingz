<!--
Sync Impact Report
- Version change: template/unratified -> 1.0.0
- Modified principles: none; all five scaffold principle slots are established.
- Added sections: Product and Technical Constraints; Quality Gates and Workflow.
- Removed sections: none.
- Follow-up TODOs: none. Ratification date inferred from the feature specification creation date.
-->

# Ratingz Core System Constitution

## Core Principles

### I. Domain Integrity and User-Scoped Behavior
All product behavior MUST preserve the domain rules in the feature specification. Match
queries MUST be filtered by the authenticated user's chosen team, and the interface MUST
display real team names, logos, scores, and player data rather than raw database IDs or
numeric placeholders. Any change to a business rule MUST include updated acceptance
criteria and tests.

### II. Secure-by-Default Architecture
Restricted API endpoints MUST require validated JWT authentication, and authorization MUST
derive the user identity from the verified token rather than request-supplied identity
fields. MySQL connection settings and JWT secrets MUST come from environment variables and
MUST NOT be committed to source control. Database constraints MUST enforce security-critical
invariants, including one expulsion vote per user, match, and player.

### III. Testable, Contract-Driven Development
Every feature MUST have tests for its externally observable behavior before it is considered
complete. Unit tests MUST cover business rules, repository constraints, and error paths;
integration or end-to-end tests MUST cover authentication, team-scoped match filtering,
lineup isolation, and duplicate-vote rejection. API contracts, validation, and response
shapes MUST remain explicit and type-safe.

### IV. Accessible and Truthful User Experience
The frontend MUST provide clear, responsive feedback for loading, validation, authorization,
and rejected actions. The tactical pitch MUST render a readable, non-overlapping 4-3-3
formation on a green field, using real player names and positions. Removing a player from a
user's tactical pitch MUST affect only that user's local or persisted lineup and MUST NOT
mutate community lineups or other users' state.

### V. Observable Simplicity and Performance
Implementations MUST prefer the simplest design that satisfies the requirement and MUST
avoid speculative abstractions. Backend services MUST expose actionable errors through the
project's standard logging and HTTP error mechanisms. BFF endpoints MUST target responses
under 200 ms under the expected development workload; performance-sensitive queries MUST
use appropriate indexes and avoid unbounded or duplicated work.

## Product and Technical Constraints

The system is a web application with a React and TypeScript frontend, a Node.js and Express
BFF, and MySQL 8.0 storage running through Docker Compose. The five supported clubs are
Palmeiras, Bahia, Corinthians, São Paulo, and Vasco da Gama. Player, team, match, lineup,
and vote data MUST use stable typed models and repository boundaries. Sensitive values MUST
be configured through `.env`-backed environment variables, with a safe example or documented
configuration supplied without secrets.

## Quality Gates and Workflow

Work MUST be traceable to a user story or functional requirement. Before implementation,
the responsible change MUST identify its affected API, data, and UI surfaces. Before
completion, contributors MUST run the smallest relevant automated test suite plus type
checking or linting when configured. A change is not complete until its acceptance scenario
passes and related documentation or SpecKit artifacts are updated. Cross-cutting changes
MUST include regression coverage for existing behavior.

## Governance

This constitution is the governing quality and architecture policy for the Ratingz project.
When another project document conflicts with it, this constitution takes precedence unless
an explicit amendment is approved. Every pull request or equivalent review MUST verify
compliance with the principles and quality gates, and any justified exception MUST document
its scope, rationale, owner, and removal or review condition.

Amendments MUST update this document's Sync Impact Report, version, and last-amended date.
Versioning follows semantic versioning: MAJOR for incompatible principle removals or
redefinitions, MINOR for new principles or materially expanded governance, and PATCH for
clarifications that do not change obligations. Amendments MUST preserve the heading
structure, contain no unexplained placeholders, and include any required migration or
follow-up work in the review summary.

**Version**: 1.0.0 | **Ratified**: 2026-09-22 | **Last Amended**: 2026-09-22
