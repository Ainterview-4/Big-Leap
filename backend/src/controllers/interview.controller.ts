import { Request, Response } from "express";
import { prisma } from "../prisma";
import { ok, fail } from "../utils/response";

/**
 * POST /api/interviews
 * Interview oluşturur (authGuard -> userId)
 */
export const createInterview = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
        return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);
    }

    const { title, role, company, level, language } = req.body ?? {};

    if (!title || typeof title !== "string") {
        return fail(
            res,
            "VALIDATION_ERROR",
            "title is required",
            { field: "title" },
            400
        );
    }

    const interview = await prisma.interview.create({
        data: {
            userId,
            title,
            role: role ?? null,
            company: company ?? null,
            level: level ?? null,
            language: language ?? "tr",
            status: "DRAFT",
        },
    });

    return ok(res, interview, 201);
};

/**
 * POST /api/interviews/:interviewId/sessions
 * Interview için yeni session başlatır
 */
export const startSession = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
        return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);
    }

    const { interviewId } = req.params;

    if (!interviewId) {
        return fail(
            res,
            "VALIDATION_ERROR",
            "interviewId is required",
            null,
            400
        );
    }

    // Interview bu kullanıcıya mı ait?
    const interview = await prisma.interview.findFirst({
        where: {
            id: interviewId,
            userId,
        },
        select: { id: true },
    });

    if (!interview) {
        return fail(
            res,
            "NOT_FOUND",
            "Interview not found",
            { interviewId },
            404
        );
    }

    const session = await prisma.interviewSession.create({
        data: {
            interviewId,
            userId,
            status: "IN_PROGRESS",
            startedAt: new Date(),
        },
    });

    return ok(res, session, 201);
};

/**
 * GET /api/interviews
 * Kullanıcının interview'larını listeler
 */
export const listMyInterviews = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
        return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);
    }

    const interviews = await prisma.interview.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    return ok(res, interviews);
};

/**
 * GET /api/interviews/:interviewId
 * Interview + session'ları getirir
 */
export const getInterviewById = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
        return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);
    }

    const { interviewId } = req.params;

    const interview = await prisma.interview.findFirst({
        where: {
            id: interviewId,
            userId,
        },
        include: {
            sessions: true,
        },
    });

    if (!interview) {
        return fail(
            res,
            "NOT_FOUND",
            "Interview not found",
            { interviewId },
            404
        );
    }

    return ok(res, interview);
};
