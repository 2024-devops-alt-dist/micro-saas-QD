import { defineConfig, env } from 'prisma/config';
import * as dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx src/db/createFixtures.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
