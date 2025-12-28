const pdf = require("pdf-parse");

interface ExtractionResult {
    text: string;
    pageCount: number;
    info: any;
}

export class PdfValidationError extends Error {
    code: string;

    constructor(message: string, code: string = "UNSUPPORTED_PDF") {
        super(message);
        this.code = code;
        this.name = "PdfValidationError";
    }
}

export const extractTextFromPdfBuffer = async (buffer: Buffer): Promise<string> => {
    try {
        const data = await pdf(buffer);
        const text = data.text.trim();

        // VALIDATION: Reject if text is too short (likely scanned/image)
        if (text.length < 50) {
            throw new PdfValidationError(
                "The PDF appears to be scanned or image-based. Please upload a selectable text PDF.",
                "UNSUPPORTED_PDF"
            );
        }

        return text;
    } catch (error: any) {
        if (error instanceof PdfValidationError) {
            throw error;
        }
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
};
