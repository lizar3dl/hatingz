SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS teams (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  logo_url VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  favorite_team_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_team FOREIGN KEY (favorite_team_id) REFERENCES teams(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS players (
  id VARCHAR(64) PRIMARY KEY,
  team_id VARCHAR(64) NOT NULL,
  name VARCHAR(120) NOT NULL,
  shirt_number INT NOT NULL,
  position VARCHAR(32) NOT NULL,
  CONSTRAINT fk_players_team FOREIGN KEY (team_id) REFERENCES teams(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS matches (
  id VARCHAR(64) PRIMARY KEY,
  home_team_id VARCHAR(64) NOT NULL,
  away_team_id VARCHAR(64) NOT NULL,
  home_score INT NOT NULL DEFAULT 0,
  away_score INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_match_home_team FOREIGN KEY (home_team_id) REFERENCES teams(id),
  CONSTRAINT fk_match_away_team FOREIGN KEY (away_team_id) REFERENCES teams(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lineups (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  team_id VARCHAR(64) NOT NULL,
  match_id VARCHAR(64) NULL,
  formation VARCHAR(32) NOT NULL,
  players_json JSON NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lineups_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_lineups_team FOREIGN KEY (team_id) REFERENCES teams(id),
  CONSTRAINT fk_lineups_match FOREIGN KEY (match_id) REFERENCES matches(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lineup_votes (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  lineup_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_lineup (user_id, lineup_id),
  CONSTRAINT fk_lineup_vote_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_lineup_vote_lineup FOREIGN KEY (lineup_id) REFERENCES lineups(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS expulsion_votes (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  match_id VARCHAR(64) NOT NULL,
  player_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_match_player (user_id, match_id, player_id),
  CONSTRAINT fk_expulsion_vote_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_expulsion_vote_match FOREIGN KEY (match_id) REFERENCES matches(id),
  CONSTRAINT fk_expulsion_vote_player FOREIGN KEY (player_id) REFERENCES players(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_matches_team ON matches (home_team_id, away_team_id);
CREATE INDEX idx_lineup_feed ON lineups (is_published, created_at DESC);

CREATE INDEX idx_users_favorite_team ON users (favorite_team_id);
CREATE INDEX idx_players_team ON players (team_id);
CREATE INDEX idx_matches_status_starts_at ON matches (status, starts_at);
