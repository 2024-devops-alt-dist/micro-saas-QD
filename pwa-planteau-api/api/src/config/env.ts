import { existsSync } from 'node:fs';
import dotenv from 'dotenv';

const envCandidates =
  process.env.NODE_ENV === 'test' ? ['.env.test', '.env'] : ['.env', '.env.test'];
const envFile = envCandidates.find(candidate => existsSync(candidate));

if (envFile) {
  // Load matching env file, falling back when the primary file is absent
  dotenv.config({ path: envFile });
}

export const config = {
  API_PORT: process.env.API_PORT || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '5432',
  DB_USER: process.env.DB_USER || 'user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'database',
  FRONT_URL: process.env.FRONT_URL || 'http://localhost:5173',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER || 'user'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'database'}`,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev_secret_access_key_change_in_production',
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || 'dev_secret_refresh_key_change_in_production',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
