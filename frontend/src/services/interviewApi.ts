import api from "../api/axiosInstance";

export interface CreateInterviewParams {
    title: string;
    role?: string;
    level?: string;
    focusArea?: string;
    company?: string;
    language?: string;
    difficulty?: string;
    cvId?: string;
}

export interface StartSessionParams {
    interviewId: string;
    cvId?: string;
}

export const createInterview = async (params: CreateInterviewParams) => {
    const res = await api.post("/interviews", params);
    return res.data; // { status: "success", data: interview }
};

export const startInterviewSession = async (interviewId: string) => {
    const res = await api.post(`/interviews/${interviewId}/sessions`);
    return res.data; // { status: "success", data: { sessionId, question } }
};

export const answerSession = async (
    sessionId: string,
    payload: {
        previous_question_id: string;
        previous_question: string;
        previous_answer: string
    }
) => {
    const res = await api.post(`/interviews/sessions/${sessionId}/answer`, payload);
    return res.data; // { status: "success", data: ... }
};

export const evaluateSession = async (sessionId: string) => {
    const res = await api.post(`/interviews/sessions/${sessionId}/finalize`);
    return res.data; // { status: "success", data: { summary: ... } }
};

export const getSession = async (sessionId: string) => {
    const res = await api.get(`/interviews/sessions/${sessionId}`);
    return res.data; // { status: "success", data: session }
};

export const listInterviews = async () => {
    const res = await api.get("/interviews");
    return res.data; // { status: "success", data: Interview[] }
};
