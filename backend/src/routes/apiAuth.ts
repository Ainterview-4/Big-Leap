import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { ok, fail } from "../utils/response";
import jwt from "jsonwebtoken";


const router = Router();

/**
 * POST /api/auth/register
 * body: { email, password, full_name }
 * name gelirse full_name yerine kabul ediyoruz (fallback)
 */
router.post("/register", async (req, res) => {
    try {

        const email = String(req.body?.email ?? "").trim().toLowerCase();


        const password = String(req.body?.password ?? "");
        // Frontend "full_name" gönderiyor ama Prisma "name" bekliyor
        const name = String(req.body?.full_name ?? req.body?.name ?? "").trim();

        if (!email || !password || !name) {
            return fail(
                res,
                "VALIDATION_ERROR",
                "email, password, full_name are required",
                null,
                400
            );
        }

        // Email kontrolü
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return fail(res, "EMAIL_EXISTS", "Email already registered", null, 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        return ok(res, { user: newUser }, 201);
    } catch (err: any) {
        console.error("POST /api/auth/register error:", err);
        return fail(res, "SERVER_ERROR", "Unexpected error", err?.message ?? null, 500);
    }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
    try {
        const email = String(req.body?.email ?? "").trim().toLowerCase();
        const password = String(req.body?.password ?? "");


        if (!email || !password) {
            return fail(res, "VALIDATION_ERROR", "email and password are required", null, 400);
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return fail(res, "INVALID_CREDENTIALS", "Email or password incorrect", null, 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return fail(res, "INVALID_CREDENTIALS", "Email or password incorrect", null, 401);
        }


        if (!process.env.JWT_SECRET) {
            return fail(res, "CONFIG_ERROR", "JWT_SECRET not set", null, 500);
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return ok(res, {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err: any) {
        console.error("POST /api/auth/login error:", err);
        return fail(res, "SERVER_ERROR", "Unexpected error", err?.message ?? null, 500);
    }
});


export default router;
