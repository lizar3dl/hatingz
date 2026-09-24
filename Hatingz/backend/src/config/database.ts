// Responsável: João
import mysql from 'mysql2/promise';
import { getEnv } from './env';
import { teams } from './store';

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
  const [rows] = await pool.query('SELECT 1 as ok');
  if (!rows) {
    throw new Error('Database connection failed');
  }
}

export async function initializeDatabase(): Promise<void> {
  await pingDatabase();

  for (const team of teams) {
    await pool.execute(
      `INSERT INTO teams (id, name, slug, logo_url)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), slug = VALUES(slug), logo_url = VALUES(logo_url)`,
      [team.id, team.name, team.slug, team.logoUrl],
    );
  }
}
