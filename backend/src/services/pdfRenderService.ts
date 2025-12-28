// backend/src/services/pdfRenderService.ts

import { chromium } from "playwright";
import { renderCvHtml } from "./cvHtmlTemplate";

/**
 * Generates a PDF buffer from optimized CV data.
 * - Uses Playwright (Chromium)
 * - No filesystem usage
 * - Returns Buffer ready for upload
 */
export async function renderOptimizedCvPdf(
    optimizedData: any
): Promise<Buffer> {
    const browser = await chromium.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();

        const html = renderCvHtml(optimizedData);

        // Load HTML into browser
        await page.setContent(html, {
            waitUntil: "networkidle",
        });

        // Generate PDF buffer
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm",
            },
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}
