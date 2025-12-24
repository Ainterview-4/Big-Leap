import api from "../api/axiosInstance";

export interface CreateInterviewParams {
    title: string;
    role?: string;
    level?: string;
    focusArea?: string; // Not directly used in backend create currently, but good to have
    company?: string;
    language?: string;
}

export interface StartSessionParams {
    interviewId: string;
    cvId?: string;
}

export const createInterview = async (params: CreateInterviewParams) => {
    const res = await api.post("/interviews", params);
    return res.data; // { status: "success", data: interview }
};

export const startInterviewSession = async (interviewId: string, cvId?: string) => {
    const res = await api.post(`/interviews/${interviewId}/sessions`, {
        cvId: cvId ?? null,
    });

    return res.data; // { status: "success", data: session }
};

export const answerSession = async (sessionId: string, answer: string) => {
    const res = await api.post(`/interviews/sessions/${sessionId}/answer`, { answer });
    return res.data; // { status: "success", data: { sessionId, questionIndex, nextQuestion } }
};

export const evaluateSession = async (sessionId: string) => {
    const res = await api.post(`/interviews/sessions/${sessionId}/evaluate`);
    return res.data; // { status: "success", data: { score, feedback, ... } }
};

export const getSession = async (sessionId: string) => {
    const res = await api.get(`/interviews/sessions/${sessionId}`);
    return res.data; // { status: "success", data: session }
};
