import { Router } from "express";
import { prisma } from "../prisma";
import { authGuard } from "../middlewares/authGuard";
import { ok, fail } from "../utils/response";

const router = Router();

/**
 * GET /api/user/profile
 * Login olmuş kullanıcının profilini döner
 */
router.get("/profile", authGuard, async (req, res) => {
    try {
        const userId = req.user!.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        if (!user) {
            return fail(res, "NOT_FOUND", "User not found", null, 404);
        }

        return ok(res, user);
    } catch (err: any) {
        return fail(
            res,
            "SERVER_ERROR",
            "Unexpected error",
            err?.message ?? null,
            500
        );
    }
});

/**
 * PATCH /api/user/profile
 * Şimdilik sadece name güncelleyebilir
 */
router.patch("/profile", authGuard, async (req, res) => {
    try {
        const userId = req.user!.userId;
        const name = String(req.body?.name ?? "").trim();

        if (!name) {
            return fail(res, "VALIDATION_ERROR", "name is required", null, 400);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name },
            select: {
                id: true,
                email: true,
                name: true,
                // updatedAt: true,
            },
        });

        return ok(res, updatedUser);
    } catch (err: any) {
        return fail(
            res,
            "SERVER_ERROR",
            "Unexpected error",
            err?.message ?? null,
            500
        );
    }
});

export default router;
