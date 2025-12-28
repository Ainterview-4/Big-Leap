
import { PrismaClient } from '@prisma/client';
import { generateOptimizedCv } from './services/cvOptimizationService';
import { connectDatabase, disconnectDatabase } from './prisma';

const prisma = new PrismaClient();

async function main() {
    await connectDatabase();
    try {
        console.log("🔍 Checking for Hallucinations...");

        const user = await prisma.user.findFirst();
        if (!user) throw new Error("No user found");

        const cv = await prisma.cv.create({
            data: {
                userId: user.id,
                fileName: "hallucination_test.pdf",
                mimeType: "application/pdf",
                sizeBytes: 1024,
                s3Key: "test/hallucination.pdf",
                s3Url: "http://example.com/h.pdf",
                analysisResult: { score: 70, feedback: "Missing skills" },
                structuredData: {
                    header: { fullName: "Honest Candidate" },
                    summary: "I know Vue.js.",
                    skills: { technical: ["Vue.js", "JavaScript"] },
                    experience: []
                }
            }
        });

        const targetJobDescription = `
        We are looking for a React Developer.
        Must be expert in React, Redux, and Next.js.
        `;

        console.log("🚀 Running optimization with React JD...");
        const result = await generateOptimizedCv({
            cvId: cv.id,
            jobDescription: targetJobDescription
        });

        const optimizedData: any = result.optimizedData;
        const allskills = [
            ...(optimizedData.skills?.technical || []),
            ...(optimizedData.skills?.soft || [])
        ].map(s => s.toLowerCase());

        console.log("Optimized Skills:", allskills);

        if (allskills.includes("react")) {
            console.error("❌ FAIL: Hallucination detected! 'React' was added to skills.");
        } else {
            console.log("✅ PASS: 'React' was NOT added to skills.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await disconnectDatabase();
    }
}

main();
