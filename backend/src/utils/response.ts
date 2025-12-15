import type { Response } from "express";

type ApiError = {
    code: string;
    message: string;
    details?: unknown;
};

export function ok<T>(
    res: Response,
    data: T,
    statusCode: number = 200
) {
    return res.status(statusCode).json({
        success: true,
        data,
        error: null,
    });
}

export function fail(
    res: Response,
    code: string,
    message: string,
    details?: unknown,
    statusCode: number = 400
) {
    const error: ApiError = { code, message };
    if (details !== undefined) error.details = details;

    return res.status(statusCode).json({
        success: false,
        data: null,
        error,
    });
}
