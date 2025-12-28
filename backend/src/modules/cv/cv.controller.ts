import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { ok, fail } from "../../utils/response";
import { optimizeCv, processCvUpload } from "../../services/cvService";
import { analyzeStructuredCv } from "../../services/cvAnalysisService";
import { getOptimizedCvDetail, listOptimizedCvs } from "../../services/cvHistoryService";


export const uploadCv = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);

    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return fail(res, "VALIDATION_ERROR", "file is required", null, 400);

    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(file.mimetype)) {
        return fail(
            res,
            "VALIDATION_ERROR",
            "Only PDF or TXT allowed",
            { mimeType: file.mimetype },
            400
        );
    }

    try {
        const cv = await processCvUpload(userId, file);
        return ok(res, cv, 201);
    } catch (err: any) {
        if (err.code === "UNSUPPORTED_PDF") {
            return fail(res, "UNSUPPORTED_PDF", err.message, null, 400);
        }
        if (err.code === "AI_EXTRACTION_FAILED") {
            return fail(res, "AI_EXTRACTION_FAILED", err.message, null, 502);
        }
        console.error("❌ Upload Error:", err);
        return fail(res, "INTERNAL_ERROR", "Failed to process CV", { error: err.message }, 500);
    }
};

export const listMyCvs = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);

    // ✅ BURASI
    const cvs = await prisma.cv.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    return ok(res, cvs);
};

export const getCvById = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);

    const { cvId } = req.params;

    // ZATEN DOĞRUYDU
    const cv = await prisma.cv.findFirst({
        where: { id: cvId, userId },
    });

    if (!cv) return fail(res, "NOT_FOUND", "CV not found", { cvId }, 404);

    return ok(res, cv);
};

export const optimizeCvHandler = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);

    const { cvId, jobDescription, force } = req.body;

    if (!cvId) {
        return fail(res, "VALIDATION_ERROR", "cvId is required", null, 400);
    }

    // Verify ownership
    const cv = await prisma.cv.findFirst({ where: { id: cvId, userId } });
    if (!cv) {
        return fail(res, "NOT_FOUND", "CV not found", { cvId }, 404);
    }

    try {
        const result = await optimizeCv({ cvId, jobDescription, force });
        return ok(res, result);
    } catch (error: any) {
        return fail(res, "SERVER_ERROR", "Optimization failed", error?.message, 500);
    }
};


export const analyzeCvHandler = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);

    const { cvId } = req.params;

    if (!cvId) {
        return fail(res, "VALIDATION_ERROR", "cvId is required", null, 400);
    }

    const cv = await prisma.cv.findFirst({
        where: { id: cvId, userId },
    });

    if (!cv) {
        return fail(res, "NOT_FOUND", "CV not found", { cvId }, 404);
    }

    if (!cv.structuredData) {
        return fail(
            res,
            "STRUCTURED_DATA_MISSING",
            "Structured CV data is missing",
            null,
            400
        );
    }

    // ✅ Cache: return existing analysis
    const cvAny = cv as any;
    if (cvAny.analysisResult && typeof cvAny.atsScore === "number") {
        return ok(res, {
            analysis: cvAny.analysisResult,
            atsScore: cvAny.atsScore,
            cached: true,
        });
    }

    try {
        const analysis = await analyzeStructuredCv(cv.structuredData as any);

        await prisma.cv.update({
            where: { id: cv.id },
            data: {
                analysisResult: analysis,
                atsScore: analysis.atsScore,
            } as any,
        });

        return ok(res, {
            analysis,
            atsScore: analysis.atsScore,
            cached: false,
        });
    } catch (err: any) {
        console.error("❌ CV Analysis Error:", err);

        if (err.message === "AI_INVALID_ATS_SCORE") {
            return fail(
                res,
                "AI_ANALYSIS_FAILED",
                "AI returned invalid ATS score",
                null,
                502
            );
        }

        return fail(
            res,
            "AI_ANALYSIS_FAILED",
            "Failed to analyze CV",
            err?.message,
            502
        );
    }
};


export const listOptimizedCvHistory = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) return fail(res, "UNAUTHORIZED", "Missing userId", null, 401);

    const cvs = await listOptimizedCvs(userId);
    return ok(res, cvs);
};

export const getOptimizedCvDetailHandler = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { cvId } = req.params;

    const cv = await getOptimizedCvDetail(userId, cvId);
    if (!cv) return fail(res, "NOT_FOUND", "Optimized CV not found", null, 404);

    return ok(res, cv);
};
