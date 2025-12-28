export interface AnalysisResult {
    issues?: Array<{
        issue?: string;
        description?: string;
        fix?: string;
    }>;
    strengths?: string[];
    missingKeywords?: string[];
    summary?: string;
}

export interface StructuredData {
    summary?: string;
    skills?: {
        technical?: string[];
    };
}

export interface OptimizationResult {
    optimizedPdfUrl: string;
    atsScore: number;
}

export interface CV {
    id: string;
    fileName: string;
    createdAt: string;
    analysisResult?: AnalysisResult | null;
    optimizedPdfUrl?: string | null;
    atsScore?: number | null;
    structuredData?: StructuredData | null;
}
