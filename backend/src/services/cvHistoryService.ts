import { prisma } from "../prisma";

export async function listOptimizedCvs(userId: string) {
    return prisma.cv.findMany({
        where: {
            userId,
            optimizedPdfUrl: { not: null },
        },
        select: {
            id: true,
            fileName: true,
            atsScore: true,
            optimizedPdfUrl: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getOptimizedCvDetail(userId: string, cvId: string) {
    return prisma.cv.findFirst({
        where: {
            id: cvId,
            userId,
            optimizedPdfUrl: { not: null },
        },
        select: {
            id: true,
            atsScore: true,
            analysisResult: true,
            optimizedData: true,
            optimizedPdfUrl: true,
            createdAt: true,
        },
    });
}
