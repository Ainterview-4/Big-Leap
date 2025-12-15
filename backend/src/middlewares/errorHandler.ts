import type { Request, Response, NextFunction } from "express";
import { fail } from "../utils/response";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error("🔥 Unhandled error:", err);

    const statusCode = err.statusCode || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    const message =
        err.message || "Something went wrong on the server";

    return fail(res, code, message, err.details, statusCode);
}
