import dotenv from 'dotenv';
dotenv.config();

export const config = {
  API_PORT: process.env.API_PORT || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '5432',
  DB_USER: process.env.DB_USER || 'user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'database',
  FRONT_URL: process.env.FRONT_URL || 'http://localhost:5173/',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER || 'user'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'database'}`,
};
