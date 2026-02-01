import { prisma } from "../prisma";
import { uploadToS3, buildCvKey } from "./s3Service";
import { extractTextFromPdfBuffer } from "./pdfService";
import { callAIJson } from "./aiService";
import { buildExtractStructuredDataPrompt } from "../modules/cv/prompts/extractStructuredData";

import { generateOptimizedCv } from "./cvOptimizationService";

export interface OptimizeCvParams {
    cvId: string;
    jobDescription?: string;
    force?: boolean;
}

export const optimizeCv = async (params: OptimizeCvParams) => {
    // Call the dedicated optimization service
    return generateOptimizedCv({
        cvId: params.cvId,
        jobDescription: params.jobDescription,
        force: params.force,
    });
};


export const processCvUpload = async (userId: string, file: Express.Multer.File) => {
    console.time("✅ Total Process Time");

    console.time("1. S3 Upload");
    const key = buildCvKey(userId, file.originalname);
    const { url } = await uploadToS3({
        key,
        body: file.buffer,
        contentType: file.mimetype,
    });
    console.timeEnd("1. S3 Upload");

    // 2. Extract Text (Phase 2)
    let textExtract: string | null = null;
    console.time("2. Text Extraction");
    try {
        if (file.mimetype === "application/pdf") {
            textExtract = await extractTextFromPdfBuffer(file.buffer);
        } else if (file.mimetype === "text/plain") {
            textExtract = file.buffer.toString("utf-8");
        }
        if (textExtract) {
            // Postgres cannot handle null bytes (0x00) in text fields
            textExtract = textExtract.replace(/\x00/g, "");
        }
    } catch (err: any) {
        console.timeEnd("2. Text Extraction");
        console.error("❌ Extraction Error:", err);
        // Throw specific error to be handled by controller if needed, or just propagate
        // For now, rethrow consistent with controller logic (checking code)
        throw err;
    }
    console.timeEnd("2. Text Extraction");

    // 3. Create CV Record
    console.time("3. DB Create");
    const cv = await prisma.cv.create({
        data: {
            userId,
            fileName: file.originalname,
            mimeType: file.mimetype,
            sizeBytes: file.size,
            s3Key: key,
            s3Url: url,
            textExtract,
        },
    });
    console.timeEnd("3. DB Create");


    // 4. Extract Structured Data (AI)
    if (textExtract) {
        // Fire and forget - do not await!
        (async () => {
            console.time("Background AI Extraction");
            try {
                const prompt = buildExtractStructuredDataPrompt(textExtract!);
                const structuredData = await callAIJson(prompt);

                await prisma.cv.update({
                    where: { id: cv.id },
                    data: { structuredData: structuredData as any },
                });
                console.log(`✅ Background AI analysis completed for CV ${cv.id}`);

            } catch (error) {
                console.timeEnd("Background AI Extraction");
                console.error("❌ Background AI Extraction Failed:", error);
                // We can't throw here to the controller, maybe update a status field in DB later
            }
            console.timeEnd("Background AI Extraction");
        })();
    }

    console.timeEnd("✅ Total Process Time");

    return cv;
};

