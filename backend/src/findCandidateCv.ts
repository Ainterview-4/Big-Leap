
import { PrismaClient, Prisma } from '@prisma/client';
import { connectDatabase, disconnectDatabase } from './prisma';

const prisma = new PrismaClient();

async function main() {
    await connectDatabase();
    try {
        // Find a CV that has both structuredData and analysisResult (if analysisResult is stored in DB, otherwise check requirements)
        // The service checks: !cv || !cv.structuredData || !cvAny.analysisResult

        // Note: structuredData is a Json field, analysisResult is also likely a Json field
        const cv = await prisma.cv.findFirst({
            where: {
                structuredData: {
                    not: Prisma.DbNull,
                }
            },
            select: {
                id: true,
                structuredData: true,
                analysisResult: true
            }
        });

        if (cv) {
            console.log("Found suitable CV:", cv.id);
            console.log("Has structuredData:", !!cv.structuredData);
            console.log("Has analysisResult:", !!cv.analysisResult);
        } else {
            console.log("No suitable CV found (need structuredData and analysisResult).");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await disconnectDatabase();
    }
}

main();
