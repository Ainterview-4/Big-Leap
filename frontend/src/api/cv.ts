import api from "./axiosInstance";

import type { AnalysisResult, CV, OptimizationResult } from "./types";

export const uploadCVRequest = (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // Changed "cv" to "file" to match backend

    return api.post<CV>("/cv/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minutes for AI processing
    });
};

export const analyzeCVRequest = (cvId: string) => {
    return api.post<{
        analysis: AnalysisResult;
        atsScore: number;
        cached: boolean;
    }>(`/cv/${cvId}/analyze`, {}, {
        timeout: 90000 // Increase to 90s for AI analysis
    });
};

export const optimizeCVRequest = (data: { cvId: string; jobDescription?: string; force?: boolean }) => {
    return api.post<OptimizationResult & { reused: boolean }>("/cv/optimize", data, {
        timeout: 180000 // 3 minutes for generation
    });
};

export const listMyCVs = () => {
    return api.get<CV[]>("/cv");
};
