import { prisma } from "../prisma";
import { buildOptimizeCvPrompt } from "../modules/cv/prompts/buildOptimizeCvPrompt";
import { callAIJson } from "./aiService";


import { renderOptimizedCvPdf } from "./pdfRenderService";
import { uploadToS3 } from "./s3Service";

export async function generateOptimizedCv(params: {
    cvId: string;
    jobDescription?: string;
    force?: boolean;
}) {
    const { cvId, jobDescription, force } = params;

    const cv = await prisma.cv.findUnique({ where: { id: cvId } });
    const cvAny = cv as any;

    if (!cv || !cv.structuredData || !cvAny.analysisResult) {
        throw new Error("CV not ready for optimization");
    }

    const hasExisting =
        !!cvAny.optimizedData && typeof cvAny.optimizedPdfUrl === "string";

    const prevJD = (cvAny.lastJobDescription ?? "").trim();
    const nextJD = (jobDescription ?? "").trim();

    const jobChanged = prevJD !== nextJD && nextJD.length > 0;

    // ✅ Guard: reuse existing unless force OR job changed
    if (hasExisting && !force && !jobChanged) {
        return {
            optimizedData: cvAny.optimizedData,
            optimizedPdfUrl: cvAny.optimizedPdfUrl,
            reused: true,
            atsScore: cvAny.atsScore ?? null,
        };
    }

    // 1) AI optimize (you may want to include jobDescription in the prompt later)
    const { system, user } = buildOptimizeCvPrompt(
        cv.structuredData as any,
        cvAny.analysisResult,
        jobDescription
    );

    const optimizedCv = await callAIJson<any>({ system, user });

    // 2) save optimizedData
    await prisma.cv.update({
        where: { id: cvId },
        data: {
            optimizedData: optimizedCv as any,
            lastJobDescription: nextJD || null,
            optimizedAt: new Date(),
        } as any,
    });

    // 3) PDF buffer
    const pdfBuffer = await renderOptimizedCvPdf(optimizedCv);

    // 4) upload to R2
    const key = `cv/optimized/${cvId}.pdf`;
    const { url } = await uploadToS3({
        key,
        body: pdfBuffer,
        contentType: "application/pdf",
        cacheControl: "public, max-age=31536000",
    });

    // 5) save optimizedPdfUrl
    await prisma.cv.update({
        where: { id: cvId },
        data: {
            optimizedPdfUrl: url,
        } as any,
    });

    return {
        optimizedData: optimizedCv,
        optimizedPdfUrl: url,
        reused: false,
        atsScore: cvAny.atsScore ?? null,
    };
}
