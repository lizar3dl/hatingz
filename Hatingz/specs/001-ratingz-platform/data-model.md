# Data Model: Plataforma Ratingz

## User

- **Purpose**: Authenticated torcedor and owner of private/published interactions.
- **Fields**: `id`, `name`, `email`, `password_hash`, `favorite_team_id`, `created_at`.
- **Rules**: Email is unique and normalized; password is never returned; favorite team must
  be one of the five supported clubs.
- **Relationships**: Belongs to one `Team`; owns many `Lineup`, `LineupVote`, and
  `ExpulsionVote` records.

## Team

- **Purpose**: Supported club displayed throughout the product.
- **Fields**: `id`, `name`, `slug`, `logo_url`.
- **Rules**: Name and slug are unique; only the five supported clubs are seeded in v1.
- **Relationships**: Has many `Player`, home/away `Match`, `User`, and `Lineup` records.

## Player

- **Purpose**: Real player available for lineups and match voting.
- **Fields**: `id`, `team_id`, `name`, `shirt_number`, `position`.
- **Rules**: Player belongs to exactly one team; shirt number is valid for the seed data;
  a player cannot appear twice in one lineup.
- **Relationships**: Belongs to `Team`; participates in `Lineup` and `ExpulsionVote`.

## Match

- **Purpose**: Club confrontation shown on the dashboard and voting screen.
- **Fields**: `id`, `home_team_id`, `away_team_id`, `home_score`, `away_score`, `status`,
  `starts_at`.
- **Rules**: Home and away teams differ; status and timestamp are required; dashboard
  access is scoped to the authenticated user's favorite team.
- **Relationships**: Has two `Team` roles and many `Lineup`/`ExpulsionVote` records.

## Lineup

- **Purpose**: User-created tactical formation and optionally published community snapshot.
- **Fields**: `id`, `user_id`, `team_id`, `match_id` (nullable for club-level lineups),
  `formation`, `players_json`, `is_published`, `created_at`, `updated_at`.
- **Rules**: Formation is `4-3-3` in v1; player list is unique and belongs to the lineup
  team; removal changes only the owner's current lineup; published snapshots are not
  editable by other users.
- **Relationships**: Belongs to `User`, `Team`, and optional `Match`; has many `LineupVote`.

## LineupVote

- **Purpose**: Community vote on a published lineup.
- **Fields**: `id`, `user_id`, `lineup_id`, `created_at`.
- **Rules**: Unique `(user_id, lineup_id)`; only published lineups can receive votes.
- **Relationships**: Belongs to one `User` and one `Lineup`.

## ExpulsionVote

- **Purpose**: Accumulated community vote to expel a player from a match.
- **Fields**: `id`, `user_id`, `match_id`, `player_id`, `created_at`.
- **Rules**: Unique `(user_id, match_id, player_id)`; player must belong to a team
  participating in the match; duplicate attempts return a conflict without changing
  the aggregate count.
- **Relationships**: Belongs to one `User`, `Match`, and `Player`.

## State and Boundary Rules

1. A request without a valid authenticated user cannot read or mutate restricted entities.
2. A match response is filtered before serialization by the user's persisted favorite team.
3. A lineup mutation checks ownership before changing private state.
4. Vote insertion and aggregate counting occur in a transaction or equivalent atomic
   operation so concurrent submissions cannot inflate totals.
