export type CvAnalysisResult = {
    atsScore: number; // 0-100
    overallLevel: "poor" | "average" | "good" | "excellent";
    strengths: string[];
    issues: Array<{
        title: string;
        whyItMatters: string;
        fix: string;
        priority: "high" | "medium" | "low";
    }>;
    missingKeywords: string[];
    suggestedSections: string[];
    quickWins: string[];
};
