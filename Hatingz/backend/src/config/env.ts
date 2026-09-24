import dotenv from 'dotenv';

dotenv.config();

export type AppEnv = {
  port: number;
  jwtSecret: string;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  databaseUrl?: string;
};

export function getEnv(): AppEnv {
  const port = Number(process.env.PORT ?? '3000');
  const jwtSecret = process.env.JWT_SECRET ?? 'development-secret';
  const dbHost = process.env.DB_HOST ?? 'localhost';
  const dbPort = Number(process.env.DB_PORT ?? '3306');
  const dbName = process.env.DB_NAME ?? 'ratingz';
  const dbUser = process.env.DB_USER ?? 'ratingz';
  const dbPassword = process.env.DB_PASSWORD ?? 'ratingzpass';
  const databaseUrl = process.env.DATABASE_URL;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }

  return { port, jwtSecret, dbHost, dbPort, dbName, dbUser, dbPassword, databaseUrl };
}
