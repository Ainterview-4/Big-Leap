import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { ok, fail } from "../../utils/response";

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
    const { cvId } = req.body ?? {}; // ✅ 10.2 - body’den al

    if (!interviewId) {
        return fail(res, "VALIDATION_ERROR", "interviewId is required", null, 400);
    }

    // ✅ Interview bu kullanıcıya mı ait?
    const interview = await prisma.interview.findFirst({
        where: { id: interviewId, userId },
        select: { id: true },
    });

    if (!interview) {
        return fail(res, "NOT_FOUND", "Interview not found", { interviewId }, 404);
    }

    // ✅ 10.2 - cvId geldiyse: bu kullanıcıya mı ait?
    if (cvId) {
        const cv = await prisma.cv.findFirst({
            where: { id: cvId, userId },
            select: { id: true },
        });

        if (!cv) {
            return fail(res, "NOT_FOUND", "CV not found", { cvId }, 404);
        }
    }

    // ✅ session create: cvId’yi bağla
    const session = await prisma.interviewSession.create({
        data: {
            interviewId,
            userId,
            cvId: cvId ?? null, // ✅ bağlandı
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
    const { answer } = req.body ?? {};

    if (!sessionId) {
        return fail(res, "VALIDATION_ERROR", "sessionId is required", null, 400);
    }

    if (!answer || typeof answer !== "string") {
        return fail(
            res,
            "VALIDATION_ERROR",
            "answer is required",
            { field: "answer" },
            400
        );
    }

    const session = await prisma.interviewSession.findFirst({
        where: { id: sessionId, userId },
        include: {
            interview: true,
            cv: true, // ✅ 10.5 için gerekli
        },
    });


    if (!session) {
        return fail(res, "NOT_FOUND", "Session not found", { sessionId }, 404);
    }

    if (session.status !== "IN_PROGRESS") {
        return fail(
            res,
            "INVALID_STATE",
            "Session is not in progress",
            { status: session.status },
            400
        );
    }

    // 1) user cevabını kaydet
    await prisma.interviewMessage.create({
        data: {
            sessionId: session.id,
            role: "user",
            content: answer,
        },
    });

    // 2) bir sonraki soru index’i
    const nextQuestionIndex = (session.currentQuestion ?? 0) + 1;

    // 3) şimdilik basit mock soru (LLM sonra)
    let nextQuestion = `Soru ${nextQuestionIndex}: Bu konudaki deneyimini biraz daha açar mısın?`;

    if (session.cv) {
        nextQuestion = `Soru ${nextQuestionIndex}: CV'nde yer alan "${session.cv.fileName}" ile ilgili en güçlü olduğunu düşündüğün kısmı anlatır mısın?`;
    }


    // 4) assistant sorusunu kaydet
    await prisma.interviewMessage.create({
        data: {
            sessionId: session.id,
            role: "assistant",
            content: nextQuestion,
        },
    });

    // 5) session state update
    await prisma.interviewSession.update({
        where: { id: session.id },
        data: { currentQuestion: nextQuestionIndex },
    });

    return ok(res, {
        sessionId: session.id,
        questionIndex: nextQuestionIndex,
        nextQuestion,
    });
};

/**
 * POST /api/interviews/sessions/:sessionId/evaluate
 * Session mesajlarına göre değerlendirme üretir ve session'ı COMPLETED yapar
 */
export const evaluateInterview = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
        return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);
    }

    const { sessionId } = req.params;

    if (!sessionId) {
        return fail(res, "VALIDATION_ERROR", "sessionId is required", null, 400);
    }

    const session = await prisma.interviewSession.findFirst({
        where: { id: sessionId, userId },
        include: { messages: true, interview: true, cv: true },
    });


    if (!session) {
        return fail(res, "NOT_FOUND", "Session not found", { sessionId }, 404);
    }

    // basit scoring (şimdilik)
    const msgCount = session.messages?.length ?? 0;
    const score = Math.min(100, msgCount * 10);

    const feedbackLines = [
        "İletişim: İyi",
        "Teknik seviye: Orta",
        "Genel izlenim: Pozitif",
        `Mesaj sayısı: ${msgCount}`,
    ];

    if (session.cv) {
        feedbackLines.push(`CV referansı: ${session.cv.fileName}`);
        feedbackLines.push("Not: Değerlendirme CV ile uyum hedeflenerek yapılmıştır (mock).");
    }

    const feedback = feedbackLines.join("\n");


    const updated = await prisma.interviewSession.update({
        where: { id: session.id },
        data: {
            status: "COMPLETED",
            score,
            feedback,
            endedAt: new Date(), // sende varsa, yoksa kaldır
        },
    });

    return ok(res, {
        sessionId: updated.id,
        status: updated.status,
        score: updated.score,
        feedback: updated.feedback,
    });
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
