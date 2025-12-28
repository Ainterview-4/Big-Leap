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
    const key = buildCvKey(userId, file.originalname);
    const { url } = await uploadToS3({
        key,
        body: file.buffer,
        contentType: file.mimetype,
    });

    // 2. Extract Text (Phase 2)
    let textExtract: string | null = null;
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
        console.error("❌ Extraction Error:", err);
        // Throw specific error to be handled by controller if needed, or just propagate
        // For now, rethrow consistent with controller logic (checking code)
        throw err;
    }

    // 3. Create CV Record
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

    // 4. Extract Structured Data (AI)
    if (textExtract) {
        try {
            const prompt = buildExtractStructuredDataPrompt(textExtract);
            const structuredData = await callAIJson(prompt);

            await prisma.cv.update({
                where: { id: cv.id },
                data: { structuredData: structuredData as any },
            });

            // Update the object to return
            (cv as any).structuredData = structuredData;

        } catch (error) {
            console.error("❌ AI Extraction Failed:", error);
            // In the controller, this was setting a 502. 
            // We'll throw a specific error so controller can catch it and send 502.
            throw { code: "AI_EXTRACTION_FAILED", message: "We couldn't analyze your CV. Please try again.", originalError: error };
        }
    }

    return cv;
};
