import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { ok, fail } from "../../utils/response";
import { buildCvKey, uploadToS3 } from "../../services/s3Service";
import { optimizeCv } from "../../services/cvService";

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

    const key = buildCvKey(userId, file.originalname);
    const { url } = await uploadToS3({
        key,
        body: file.buffer,
        contentType: file.mimetype,
    });

    // ✅ BURASI
    const cv = await prisma.cv.create({
        data: {
            userId,
            fileName: file.originalname,
            mimeType: file.mimetype,
            sizeBytes: file.size,
            s3Key: key,
            s3Url: url,
        },
    });

    return ok(res, cv, 201);
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

    const { cvId, jobDescription } = req.body;

    if (!cvId) {
        return fail(res, "VALIDATION_ERROR", "cvId is required", null, 400);
    }

    // Verify ownership
    const cv = await prisma.cv.findFirst({ where: { id: cvId, userId } });
    if (!cv) {
        return fail(res, "NOT_FOUND", "CV not found", { cvId }, 404);
    }

    try {
        const result = await optimizeCv({ cvId, jobDescription });
        return ok(res, result);
    } catch (error: any) {
        return fail(res, "SERVER_ERROR", "Optimization failed", error?.message, 500);
    }
};
