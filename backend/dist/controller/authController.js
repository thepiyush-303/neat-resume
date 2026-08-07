import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback_key";
const SALT_ROUNDS = 10;
// POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required." });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
            return;
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ success: false, message: "An account with this email already exists." });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            token,
            user: { id: user.id, email: user.email },
        });
    }
    catch (err) {
        next(err);
    }
};
// POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required." });
            return;
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid email or password." });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: "Invalid email or password." });
            return;
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            token,
            user: { id: user.id, email: user.email },
        });
    }
    catch (err) {
        next(err);
    }
};
