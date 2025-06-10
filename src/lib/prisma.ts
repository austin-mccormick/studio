
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

// IMPORTANT: After adding this file and the schema.prisma, you need to:
// 1. Set up your PostgreSQL database and get the connection string.
// 2. Create a .env.local file with DATABASE_URL="your_postgresql_connection_string".
// 3. Run `npx prisma db push` (or `npx prisma migrate dev --name init` for migrations).
// 4. Run `npx prisma generate` to generate the Prisma Client based on your schema.
// Without these steps, importing PrismaClient will result in an error.
