import { callAIJson } from "./aiService";
import { CvStructuredData } from "../modules/cv/cv.types";
import { CvAnalysisResult } from "../modules/cv/cv.analysis.types";
import { buildAnalyzeCvPrompt } from "../modules/cv/prompts/analyzeCv";

export async function analyzeStructuredCv(
    structuredData: CvStructuredData
): Promise<CvAnalysisResult> {
    const { system, user } = buildAnalyzeCvPrompt(structuredData);

    const analysis = await callAIJson<CvAnalysisResult>({
        system,
        user,
    });

    // Safety checks
    if (
        typeof analysis.atsScore !== "number" ||
        analysis.atsScore < 0 ||
        analysis.atsScore > 100
    ) {
        throw new Error("AI_INVALID_ATS_SCORE");
    }

    analysis.atsScore = Math.round(analysis.atsScore);

    return analysis;
}
