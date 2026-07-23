// This file creates ONE shared database client that the whole app imports.
// Anywhere in the app you can now `import { db } from "@/lib/db"` and call
// things like db.workout.findMany() or db.workout.create().
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// In development, Next.js reloads your code constantly. Without this, each
// reload would open a brand-new database connection and eventually exhaust
// them. So we cache a single client on the global object and reuse it.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  // Prisma 7 requires a "driver adapter" — the bridge between Prisma and the
  // real Postgres driver. It reads the connection string from DATABASE_URL.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
