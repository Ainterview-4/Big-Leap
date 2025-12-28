// backend/src/services/uploadOptimizedCvPdf.ts

import { uploadToS3 } from "./s3Service";

/**
 * Upload optimized CV PDF buffer to Cloudflare R2
 * and return the public URL.
 */
export async function uploadOptimizedCvPdf(
    cvId: string,
    pdfBuffer: Buffer
): Promise<string> {
    const key = `cv/optimized/${cvId}.pdf`;

    const { url } = await uploadToS3({
        key,
        body: pdfBuffer,
        contentType: "application/pdf",
        cacheControl: "public, max-age=31536000",
    });

    return url;
}
