import api from "./axiosInstance";

export const uploadCVRequest = (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // Changed "cv" to "file" to match backend

    return api.post<{ message: string; file: string }>("/cv/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minutes for AI processing
    });
};

export const analyzeCVRequest = (cvId: string) => {
    return api.post<{
        analysis: any;
        atsScore: number;
        cached: boolean;
    }>(`/cv/${cvId}/analyze`, {}, {
        timeout: 90000 // Increase to 90s for AI analysis
    });
};

export const optimizeCVRequest = (data: { cvId: string; jobDescription?: string; force?: boolean }) => {
    return api.post<{
        optimizedData: any;
        optimizedPdfUrl: string;
        reused: boolean;
        atsScore: number | null;
    }>("/cv/optimize", data, {
        timeout: 180000 // 3 minutes for generation
    });
};

export const listMyCVs = () => {
    return api.get<any[]>("/cv");
};
