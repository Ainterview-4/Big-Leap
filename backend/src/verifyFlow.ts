
import { PrismaClient, Prisma } from '@prisma/client';
import { generateOptimizedCv } from './services/cvOptimizationService';
import { connectDatabase, disconnectDatabase } from './prisma';

const prisma = new PrismaClient();

async function main() {
    await connectDatabase();
    try {
        console.log("1. Creating dummy CV for testing...");
        // Create user first if needed, but we might have one? 
        // Let's try to find a user or create a fake one if foreign key is needed.
        // Actually, User relation is required in Schema: userId String, User fake?
        // Let's check if any user exists or create one.

        let user = await prisma.user.findFirst();
        if (!user) {
            console.log("Creating dummy user...");
            user = await prisma.user.create({
                data: {
                    email: `testuser_${Date.now()}@example.com`,
                    password: "password123",
                    name: "Test User"
                }
            });
        }

        const cv = await prisma.cv.create({
            data: {
                userId: user.id,
                fileName: "test_cv.pdf",
                mimeType: "application/pdf",
                sizeBytes: 1024,
                s3Key: "test/key",
                s3Url: "http://example.com/test.pdf",
                analysisResult: {
                    strengths: ["Clean layout"],
                    weaknesses: ["Missing keywords"],
                    suggestions: ["Add TypeScript"],
                    score: 75
                },
                structuredData: {
                    header: {
                        fullName: "John Doe",
                        email: "john@example.com",
                        title: "Developer",
                        location: "NY",
                        phone: "123",
                        linkedin: "linkedin.com/in/john",
                        github: "github.com/john",
                        website: "john.com"
                    },
                    summary: "A developer.",
                    experience: [{
                        company: "Company A",
                        role: "Dev",
                        startDate: "2020",
                        endDate: "2021",
                        bullets: ["Did stuff"]
                    }],
                    skills: {
                        technical: ["JS", "TS"],
                        soft: ["Teamwork"]
                    },
                    education: [],
                    projects: [],
                    certifications: [],
                    languages: []
                }
            }
        });
        console.log(`CV Created: ${cv.id}`);

        console.log("2. Running Optimization Service...");
        const result = await generateOptimizedCv({ cvId: cv.id });
        console.log("Optimization Result:", JSON.stringify(result, null, 2));

        console.log("3. Verifying DB updates...");
        const updatedCv = await prisma.cv.findUnique({
            where: { id: cv.id }
        });

        if (updatedCv?.optimizedData && (updatedCv as any)?.optimizedPdfUrl) {
            console.log("✅ DB Verification PASSED!");
            console.log("Optimized PDF URL:", (updatedCv as any).optimizedPdfUrl);
        } else {
            console.error("❌ DB Verification FAILED received:", updatedCv);
        }

    } catch (e) {
        console.error("Error during verification:", e);
    } finally {
        await disconnectDatabase();
    }
}

main();
