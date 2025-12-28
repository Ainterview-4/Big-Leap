
import { PrismaClient } from '@prisma/client';
import { generateOptimizedCv } from './services/cvOptimizationService';
import { connectDatabase, disconnectDatabase } from './prisma';

const prisma = new PrismaClient();

async function main() {
    await connectDatabase();
    try {
        console.log("🛠️ Preparing test environment...");

        const user = await prisma.user.findFirst();
        if (!user) throw new Error("No user found for testing");

        // Create a fresh dummy CV
        const cv = await prisma.cv.create({
            data: {
                userId: user.id,
                fileName: "caching_test.pdf",
                mimeType: "application/pdf",
                sizeBytes: 1024,
                s3Key: "test/caching_test.pdf",
                s3Url: "http://example.com/caching_test.pdf",
                // analysisResult is required for "ready" check
                analysisResult: { score: 80, summary: "Good start" },
                structuredData: {
                    header: { fullName: "Test Cache" },
                    skills: { technical: ["Node.js"] }
                }
            }
        });
        console.log(`📝 Created test CV: ${cv.id}`);

        // --- TEST 1: First Optimization ---
        console.log("\n🧪 Test 1: First optimization (Expect: reused=false)");
        const res1 = await generateOptimizedCv({ cvId: cv.id });
        if (res1.reused === false) {
            console.log("✅ PASS: First run triggered AI.");
        } else {
            console.error("❌ FAIL: First run reported reused=true.");
        }

        // --- TEST 2: Second Optimization (Same Request) ---
        console.log("\n🧪 Test 2: Second optimization (Expect: reused=true)");
        const res2 = await generateOptimizedCv({ cvId: cv.id });
        if (res2.reused === true) {
            console.log("✅ PASS: Second run used cache.");
            if (res2.optimizedPdfUrl === res1.optimizedPdfUrl) {
                console.log("   (Confirmed URL matches previous run)");
            } else {
                console.warn("   (Warning: URL changed? Should be identical)");
            }
        } else {
            console.error("❌ FAIL: Second run triggered AI again.");
        }

        // --- TEST 3: Force Re-run ---
        console.log("\n🧪 Test 3: Force re-run (Expect: reused=false)");
        const res3 = await generateOptimizedCv({ cvId: cv.id, force: true });
        if (res3.reused === false) {
            console.log("✅ PASS: Forced run triggered AI.");
        } else {
            console.error("❌ FAIL: Forced run used cache.");
        }

        // --- TEST 4: Job Description Change ---
        console.log("\n🧪 Test 4: Job Description Change (Expect: reused=false)");
        const res4 = await generateOptimizedCv({ cvId: cv.id, jobDescription: "Senior Node.js Developer" });
        if (res4.reused === false) {
            console.log("✅ PASS: New JD triggered AI.");
        } else {
            console.error("❌ FAIL: New JD used cache.");
        }

        // --- TEST 4b: Same Job Description (Expect: reused=true) ---
        console.log("\n🧪 Test 4b: Same JD again (Expect: reused=true)");
        const res4b = await generateOptimizedCv({ cvId: cv.id, jobDescription: "Senior Node.js Developer" });
        if (res4b.reused === true) {
            console.log("✅ PASS: Repeated identical JD used cache.");
        } else {
            console.error("❌ FAIL: Repeated identical JD triggered AI.");
        }


    } catch (e) {
        console.error("Error during caching test:", e);
    } finally {
        await disconnectDatabase();
    }
}

main();
