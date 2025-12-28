import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { ok, fail } from "../../utils/response";




import crypto from "crypto";

import {
    startExternalInterview,
    extractInterviewTags,
    continueExternalInterview,
    finalizeExternalInterview,
} from "../../services/interviewService";

/**
 * POST /api/interviews
 * Interview oluşturur (authGuard -> userId)
 */
export const createInterview = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
        return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);
    }

    const { title, role, company, level, language, difficulty, cvId } = req.body ?? {};

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
            difficulty: difficulty ?? "Medium", // Default to Medium
            cvId: cvId ?? null,
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

    try {
        // 1️⃣ Load interview
        const interview = await prisma.interview.findFirst({
            where: { id: interviewId, userId },
        });

        if (!interview) {
            return fail(res, "NOT_FOUND", "Interview not found", null, 404);
        }

        // 2️⃣ Prepare tags
        let tags: string[] | undefined = undefined;

        if (interview.cvId) {
            // Load CV
            const cv = await prisma.cv.findFirst({
                where: { id: interview.cvId, userId },
            });

            if (!cv) {
                return fail(res, "NOT_FOUND", "CV not found", null, 404);
            }

            if (!cv.optimizedPdfUrl) {
                return fail(
                    res,
                    "CV_NOT_READY",
                    "CV must be optimized before starting interview",
                    null,
                    400
                );
            }

            // Extract tags from CV
            tags = extractInterviewTags(cv.structuredData);
        }

        // 3️⃣ Generate session_id
        const sessionId = crypto.randomUUID();

        // 4️⃣ Call external interview API (FIRST QUESTION)
        const firstQuestion = await startExternalInterview({
            session_id: sessionId,
            role: interview.role || "Software Engineer",
            difficulty: interview.difficulty || "Medium",
            company: interview.company ?? undefined,
            tags,
        });

        // 5️⃣ Save session metadata & First message
        await prisma.interviewSession.create({
            data: {
                id: sessionId,
                interviewId: interview.id,
                userId,
                status: "STARTED",
                messages: {
                    create: {
                        role: "assistant", // The bot asks the first question
                        content: firstQuestion.text || firstQuestion.question_text || firstQuestion.question || "Merhaba!",
                        metadata: {
                            question_id: firstQuestion.id || firstQuestion.question_id,
                            category: firstQuestion.category,
                            ...firstQuestion // Save raw response for debug
                        } as any, // Cast to any to avoid stale type error
                    },
                },
            },
        });

        // 6️⃣ Return first question
        return ok(res, {
            sessionId,
            question: firstQuestion,
        });
    } catch (err: any) {
        console.error("❌ startSession error:", err);
        return fail(
            res,
            "INTERVIEW_SESSION_START_FAILED",
            err.message ?? "Failed to start interview session",
            null,
            500
        );
    }
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
        include: { sessions: { orderBy: { createdAt: "desc" }, take: 1 } }, // Include latest session
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
        where: { id: interviewId, userId },
        include: { sessions: true },
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

/**
 * POST /api/interviews/sessions/:sessionId/answer
 * Session'a cevap ekler, bir sonraki soruyu üretir
 */

export const answerInterview = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
        return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);
    }

    const { sessionId } = req.params;
    const {
        previous_question_id,
        previous_question,
        previous_answer,
    } = req.body;

    if (
        !previous_question_id ||
        !previous_question ||
        !previous_answer
    ) {
        return fail(
            res,
            "VALIDATION_ERROR",
            "Missing question or answer data",
            null,
            400
        );
    }

    try {
        // 1️⃣ Load session
        const session = await prisma.interviewSession.findFirst({
            where: { id: sessionId, userId },
            include: {
                interview: true,
            },
        });

        if (!session) {
            return fail(res, "NOT_FOUND", "Session not found", null, 404);
        }

        if (session.status !== "STARTED") {
            return fail(
                res,
                "SESSION_ENDED",
                "Interview session has already ended",
                null,
                400
            );
        }

        // 2️⃣ Check question limit (finalize if >= 7)
        if (session.currentQuestion >= 7) {
            // Already reached limit, should finalize
            return fail(
                res,
                "INTERVIEW_LIMIT_REACHED",
                "Interview limit reached (7 questions). Please finalize.",
                null,
                400
            );
        }

        // 3️⃣ Forward answer to external interview API
        const response = await continueExternalInterview({
            session_id: session.id, // 🔥 SAME ID
            role: session.interview.role || "Software Engineer",
            difficulty: session.interview.difficulty || "Medium",
            company: session.interview.company ?? undefined,
            previous_question_id,
            previous_question,
            previous_answer,
            mode: "new", // Enforce mode "new"
        });

        // 4️⃣ Check for "final" category from API (Loop break)
        if (response.category === "final") {
            // Optionally auto-finalize
        }

        // 5️⃣ Persist User Answer & Assistant Question
        await prisma.$transaction(async (tx) => {
            // Save User's Answer
            await tx.interviewMessage.create({
                data: {
                    sessionId: session.id,
                    role: "user",
                    content: previous_answer,
                    // Store the question ID they were answering if we had it easily, 
                    // or just rely on sequence/time specific
                    metadata: {
                        answering_question_id: previous_question_id,
                        grade: response.last_grade // Save the grade we just got!
                    } as any
                }
            });

            // Save Assistant's Next Question
            if (response.question_text || response.text) {
                await tx.interviewMessage.create({
                    data: {
                        sessionId: session.id,
                        role: "assistant",
                        content: response.question_text || response.text || "...",
                        metadata: {
                            question_id: response.id || response.question_id,
                            category: response.category,
                            // ...response
                        } as any
                    }
                });
            }

            // Update session counter
            await tx.interviewSession.update({
                where: { id: session.id },
                data: {
                    currentQuestion: session.currentQuestion + 1,
                },
            });
        });

        // 6️⃣ Return response (next question + grading)
        return ok(res, response);
    } catch (err: any) {
        console.error("❌ answerInterview error:", err);
        return fail(
            res,
            "INTERVIEW_ANSWER_FAILED",
            err.message ?? "Failed to submit answer",
            null,
            500
        );
    }
};




/**
 * GET /api/interviews/sessions/:sessionId
 * Session + messages getirir (debug / UI için çok işe yarar)
 */
export const getSessionById = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
        return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);
    }

    const { sessionId } = req.params;

    const session = await prisma.interviewSession.findFirst({
        where: { id: sessionId, userId },
        include: {
            interview: true,
            cv: true, // ✅ eklendi
            messages: { orderBy: { createdAt: "asc" } },
        },

    });

    if (!session) {
        return fail(res, "NOT_FOUND", "Session not found", { sessionId }, 404);
    }

    return ok(res, session);
};


export const finalizeInterview = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
        return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);
    }

    const { sessionId } = req.params;

    try {
        // 1️⃣ Load session
        const session = await prisma.interviewSession.findFirst({
            where: { id: sessionId, userId },
        });

        if (!session) {
            return fail(res, "NOT_FOUND", "Session not found", null, 404);
        }

        if (session.status !== "STARTED") {
            return fail(
                res,
                "SESSION_ALREADY_FINALIZED",
                "Interview session already finalized",
                null,
                400
            );
        }

        // 2️⃣ Call external API to finalize
        const result = await finalizeExternalInterview(session.id);

        // result example:
        // {
        //   session_id: "...",
        //   total_answers: 7,
        //   average_score: 4.2
        // }

        // 3️⃣ Save summary to DB
        await prisma.interviewSession.update({
            where: { id: session.id },
            data: {
                status: "FINISHED",
                score: result.average_score
                    ? Math.round(result.average_score * 20) // normalize to 0–100 (optional)
                    : null,
                feedback: `Answered ${result.total_answers} questions`,
                endedAt: new Date(),
            },
        });

        // 4️⃣ Return summary
        return ok(res, {
            sessionId: session.id,
            summary: result,
        });
    } catch (err: any) {
        console.error("❌ finalizeInterview error:", err);
        return fail(
            res,
            "INTERVIEW_FINALIZE_FAILED",
            err.message ?? "Failed to finalize interview session",
            null,
            500
        );
    }
};
