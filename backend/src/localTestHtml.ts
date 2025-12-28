
import { PrismaClient, Prisma } from '@prisma/client';
import { prisma, connectDatabase, disconnectDatabase } from './prisma';
import { renderCvHtml } from './services/cvHtmlTemplate';
import { renderOptimizedCvPdf } from './services/pdfRenderService';
import { uploadOptimizedCvPdf } from './services/uploadOptimizedCvPdf';
import fs from 'fs';

async function main() {
    console.log("Connecting to DB...");
    await connectDatabase();
    try {
        // Fetch just an ID to simulate a real CV record
        /*
        const cv = await prisma.cv.findFirst({
            select: {
                id: true
            }
        });

        if (!cv) {
            console.log("No CV found in DB to use for testing.");
            return;
        }
        */

        const cvId = "test-cv-id-mock-" + Date.now();
        console.log("Using Mock CV ID:", cvId);

        // Mock data since DB columns might be missing
        const mockOptimizedData = {
            header: {
                fullName: "John Doe",
                title: "Software Engineer",
                location: "San Francisco, CA",
                email: "john@example.com",
                phone: "123-456-7890",
                linkedin: "linkedin.com/in/johndoe",
                github: "github.com/johndoe",
                website: "johndoe.com"
            },
            summary: "Experienced software engineer with a passion for building scalable web applications.",
            experience: [
                {
                    company: "Tech Corp",
                    role: "Senior Developer",
                    startDate: "2020",
                    endDate: "Present",
                    bullets: ["Built amazing things", "Led a team of 5"]
                }
            ],
            skills: {
                technical: ["TypeScript", "Node.js", "React"],
                soft: ["Leadership", "Communication"]
            },
            education: [
                {
                    school: "University of Tech",
                    degree: "BS Computer Science",
                    startYear: "2016",
                    endYear: "2020"
                }
            ],
            projects: [],
            certifications: [],
            languages: []
        };

        // Test PDF generation
        console.log("Generating PDF with mock data...");
        const buffer = await renderOptimizedCvPdf(mockOptimizedData);
        console.log("PDF generated. Size:", buffer.length);

        // Test PDF Upload
        console.log("Uploading PDF to R2...");
        const url = await uploadOptimizedCvPdf(cvId, buffer);
        console.log("PDF Uploaded successfully!");
        console.log("PDF URL:", url);

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await disconnectDatabase();
    }
}

main();
