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
    status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
}

export interface InterviewMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    metadata?: Record<string, unknown> | null;
    createdAt: string;
}

export interface InterviewSession {
    id: string;
    interviewId: string;
    status: "STARTED" | "FINISHED";
    score?: number | null;
    feedback?: string | null;
    createdAt: string;
    endedAt?: string | null;
    currentQuestion: number;
    messages?: InterviewMessage[];
    interview?: Interview;
}

export interface Interview {
    id: string;
    userId: string;
    title: string;
    role?: string | null;
    company?: string | null;
    level?: string | null;
    difficulty?: string | null;
    status: "DRAFT" | "COMPLETED";
    createdAt: string;
    updatedAt: string;
    sessions?: InterviewSession[];
}
