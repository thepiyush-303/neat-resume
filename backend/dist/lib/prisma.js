"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const client_1 = require("@prisma/client");
function createPrismaClient() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.warn("⚠️ DATABASE_URL is not set. Running in database-free mode.");
        return null;
    }
    try {
        return new client_1.PrismaClient();
    }
    catch (e) {
        console.warn("⚠️ Could not initialize PrismaClient. Running in fallback mode.");
        return null;
    }
}
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma !== undefined ? globalForPrisma.prisma : createPrismaClient();
if (process.env.NODE_ENV !== "production" && exports.prisma)
    globalForPrisma.prisma = exports.prisma;
exports.default = exports.prisma;
