import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
function createPrismaClient() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl)
        throw new Error("DATABASE_URL is not set");
    // Parse DATABASE_URL: mysql://user:password@host:port/database
    const url = new URL(dbUrl);
    const adapter = new PrismaMariaDb({
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username,
        password: decodeURIComponent(url.password),
        database: url.pathname.slice(1),
    });
    return new PrismaClient({ adapter });
}
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
export default prisma;
