import { prisma } from "../prisma";

function normalizeText(s: string) {
    return (s || "").trim();
}

// Basit değerlendirme (LLM yoksa) — sonra geliştirebiliriz
function simpleScore(answer: string) {
    const a = normalizeText(answer);
    if (!a) return { score: 0, feedback: "Cevap boş." };

    // Çok basit heuristik:
    const len = a.split(/\s+/).length;
    let score = 0;

    if (len >= 30) score += 40;
    else if (len >= 15) score += 25;
    else score += 10;

    if (a.includes("örnek") || a.includes("mesela")) score += 15;
    if (a.match(/\d+%|\d+\s*(yıl|ay|hafta)/i)) score += 15; // metrik / süre
    if (a.toLowerCase().includes("sonuç") || a.toLowerCase().includes("etki")) score += 10;

    if (score > 100) score = 100;

    const feedback =
        score >= 80 ? "Güçlü cevap: detay + örnek + etki var."
            : score >= 60 ? "İyi: biraz daha ölçülebilir sonuç ve net örnek ekle."
                : "Zayıf: daha yapılandırılmış anlat (durum-aksiyon-sonuç) ve örnek/metrik ekle.";

    return { score, feedback };
}

export async function answerInterviewQuestion(params: {
    userId: string;
    sessionId: string;
    answer: string;
}) {
    const { userId, sessionId, answer } = params;

    const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!session) {
        const err: any = new Error("Session not found");
        err.code = "NOT_FOUND";
        throw err;
    }
    if (session.userId !== userId) {
        const err: any = new Error("Forbidden");
        err.code = "FORBIDDEN";
        throw err;
    }
    if (session.status !== "IN_PROGRESS") {
        const err: any = new Error("Session already completed");
        err.code = "INVALID_STATE";
        throw err;
    }

    const cleaned = normalizeText(answer);
    if (!cleaned) {
        const err: any = new Error("Answer is required");
        err.code = "VALIDATION_ERROR";
        throw err;
    }

    // Kullanıcı cevabını yaz
    const userMessage = await prisma.interviewMessage.create({
        data: { sessionId, role: "user", content: cleaned },
    });

    // Cevabı basitçe puanla
    const { score, feedback } = simpleScore(cleaned);

    // Session'ı güncelle
    await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
            score, // Şimdilik sadece son cevabın skoru yazılıyor
            feedback,
        },
    });

    // Asistan (sistem) cevabını kaydet
    const assistantMessage = await prisma.interviewMessage.create({
        data: {
            sessionId,
            role: "assistant",
            content: feedback,
        },
    });

    return { userMessage, assistantMessage, score };
}