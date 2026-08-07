import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
function createPrismaClient() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.warn("⚠️ DATABASE_URL is not set. Running in database-free mode.");
        return null;
    }
    try {
        return new PrismaClient();
    }
    catch (e) {
        console.warn("⚠️ Could not initialize PrismaClient. Running in fallback mode.");
        return null;
    }
}
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma !== undefined ? globalForPrisma.prisma : createPrismaClient();
if (process.env.NODE_ENV !== "production" && prisma)
    globalForPrisma.prisma = prisma;
export default prisma;
