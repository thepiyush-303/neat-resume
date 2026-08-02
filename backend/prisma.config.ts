import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Required by `prisma migrate` CLI even when using a driver adapter at runtime
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
