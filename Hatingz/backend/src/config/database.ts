// Responsável: João
import mysql from 'mysql2/promise';
import { getEnv } from './env';
import { matches, players, teams } from './store';

const env = getEnv();

function getDatabaseConfig() {
  if (!env.databaseUrl) {
    return {
      host: env.dbHost,
      port: env.dbPort,
      user: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,
    };
  }

  const url = new URL(env.databaseUrl);
  if (url.protocol !== 'mysql:' && url.protocol !== 'mysql2:') {
    throw new Error('DATABASE_URL must use the mysql:// or mysql2:// scheme');
  }

  return {
    host: url.hostname || env.dbHost,
    port: url.port ? Number(url.port) : env.dbPort,
    user: url.username ? decodeURIComponent(url.username) : env.dbUser,
    password: url.password ? decodeURIComponent(url.password) : env.dbPassword,
    database: url.pathname.slice(1) || env.dbName,
  };
}

export const pool = mysql.createPool({
  ...getDatabaseConfig(),
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

export async function pingDatabase(): Promise<void> {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    if (!rows) {
      throw new Error('Database connection failed');
    }
    console.info('[ratingz] Database connection verified');
  } catch (error: unknown) {
    console.error('[ratingz] Database connection failed:', error);
    throw error;
  }
}

const createTableStatements = [
  `CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    logo_url VARCHAR(255) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    favorite_team_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_team FOREIGN KEY (favorite_team_id) REFERENCES teams(id)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS players (
    id VARCHAR(64) PRIMARY KEY,
    team_id VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    shirt_number INT NOT NULL,
    position VARCHAR(32) NOT NULL,
    CONSTRAINT fk_players_team FOREIGN KEY (team_id) REFERENCES teams(id)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(64) PRIMARY KEY,
    home_team_id VARCHAR(64) NOT NULL,
    away_team_id VARCHAR(64) NOT NULL,
    home_score INT NOT NULL DEFAULT 0,
    away_score INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL,
    starts_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_match_home_team FOREIGN KEY (home_team_id) REFERENCES teams(id),
    CONSTRAINT fk_match_away_team FOREIGN KEY (away_team_id) REFERENCES teams(id)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS lineups (
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
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS lineup_votes (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    lineup_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_user_lineup (user_id, lineup_id),
    CONSTRAINT fk_lineup_vote_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_lineup_vote_lineup FOREIGN KEY (lineup_id) REFERENCES lineups(id)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS expulsion_votes (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    match_id VARCHAR(64) NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_user_match_player (user_id, match_id, player_id),
    CONSTRAINT fk_expulsion_vote_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_expulsion_vote_match FOREIGN KEY (match_id) REFERENCES matches(id),
    CONSTRAINT fk_expulsion_vote_player FOREIGN KEY (player_id) REFERENCES players(id)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
];

export async function initializeDatabase(): Promise<void> {
  try {
    await pingDatabase();
  } catch (error: unknown) {
    console.error('[ratingz] Initialization stopped during connection check:', error);
    throw error;
  }

  try {
    for (const [index, statement] of createTableStatements.entries()) {
      await pool.execute(statement);
      console.info(`[ratingz] Database table ${index + 1}/${createTableStatements.length} is ready`);
    }
    console.info('[ratingz] Database schema initialized');
  } catch (error: unknown) {
    console.error('[ratingz] Database schema initialization failed:', error);
    throw error;
  }

  try {
    for (const team of teams) {
      await pool.execute(
        `INSERT INTO teams (id, name, slug, logo_url)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), slug = VALUES(slug), logo_url = VALUES(logo_url)`,
        [team.id, team.name, team.slug, team.logoUrl],
      );
    }
    console.info(`[ratingz] Seeded ${teams.length} teams`);
  } catch (error: unknown) {
    console.error('[ratingz] Team seed failed:', error);
    throw error;
  }

  try {
    for (const player of players) {
      await pool.execute(
        `INSERT INTO players (id, team_id, name, shirt_number, position)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE team_id = VALUES(team_id), name = VALUES(name),
           shirt_number = VALUES(shirt_number), position = VALUES(position)`,
        [player.id, player.teamId, player.name, player.shirtNumber, player.position],
      );
    }
    console.info(`[ratingz] Seeded ${players.length} players`);
  } catch (error: unknown) {
    console.error('[ratingz] Player seed failed:', error);
    throw error;
  }

  try {
    for (const match of matches) {
      await pool.execute(
        `INSERT INTO matches
          (id, home_team_id, away_team_id, home_score, away_score, status, starts_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE home_team_id = VALUES(home_team_id),
           away_team_id = VALUES(away_team_id), home_score = VALUES(home_score),
           away_score = VALUES(away_score), status = VALUES(status),
           starts_at = VALUES(starts_at)`,
        [
          match.id,
          match.homeTeamId,
          match.awayTeamId,
          match.homeScore,
          match.awayScore,
          match.status,
          match.startsAt,
        ],
      );
    }
    console.info(`[ratingz] Seeded ${matches.length} matches`);
  } catch (error: unknown) {
    console.error('[ratingz] Match seed failed:', error);
    throw error;
  }

  console.info('[ratingz] Database initialization completed');
}
