import type { Request, Response, NextFunction } from "express";
import { fail } from "../utils/response";
import { Prisma } from "@prisma/client";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Log error with request context
    console.error('🔥 Error occurred:');
    console.error('   Method:', req.method);
    console.error('   Path:', req.path);
    console.error('   Error:', err);

    // Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return fail(res, 'DUPLICATE_ENTRY', 'A record with this value already exists', { field: err.meta?.target }, 409);
        }
        if (err.code === 'P2025') {
            return fail(res, 'NOT_FOUND', 'Record not found', null, 404);
        }
        return fail(res, 'DATABASE_ERROR', 'Database operation failed', { code: err.code }, 500);
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        return fail(res, 'VALIDATION_ERROR', 'Invalid data provided', null, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return fail(res, 'INVALID_TOKEN', 'Invalid authentication token', null, 401);
    }

    if (err.name === 'TokenExpiredError') {
        return fail(res, 'TOKEN_EXPIRED', 'Authentication token has expired', null, 401);
    }

    // CORS errors
    if (err.message && err.message.includes('CORS')) {
        console.error('⚠️  CORS error - check CORS_ORIGIN environment variable');
        return fail(res, 'CORS_ERROR', err.message, null, 403);
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return fail(res, 'FILE_TOO_LARGE', 'File size exceeds limit (10MB)', null, 413);
        }
        return fail(res, 'UPLOAD_ERROR', err.message, null, 400);
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    const message =
        err.message || "Something went wrong on the server";

    return fail(res, code, message, err.details, statusCode);
}
