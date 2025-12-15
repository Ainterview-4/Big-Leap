import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { fail } from "../utils/response";

export type AuthUser = { userId: string };

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export function authGuard(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = String(req.headers.authorization || "");

        // Standard: Authorization: Bearer <token>
        if (!authHeader.startsWith("Bearer ")) {
            return fail(res, "UNAUTHORIZED", "Missing or invalid Authorization header", null, 401);
        }

        const token = authHeader.slice("Bearer ".length).trim();
        if (!token) {
            return fail(res, "UNAUTHORIZED", "Missing token", null, 401);
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return fail(res, "CONFIG_ERROR", "JWT_SECRET not set", null, 500);
        }

        const payload = jwt.verify(token, secret) as any;

        // Login'de { userId } imzaladığımız için bunu bekliyoruz
        const userId = payload?.userId;
        if (!userId) {
            return fail(res, "UNAUTHORIZED", "Invalid token payload", null, 401);
        }

        // Route’lar “kim bu?” bilgisini buradan alacak
        req.user = { userId: String(userId) };

        return next();
    } catch (err: any) {
        return fail(res, "UNAUTHORIZED", "Invalid or expired token", err?.message ?? null, 401);
    }
}
