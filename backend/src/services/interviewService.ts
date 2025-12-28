

const BASE_URL = process.env.INTERVIEW_API_URL;

async function callInterviewApi(path: string, payload: any) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.INTERVIEW_API_KEY!,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Interview API error (${res.status}): ${text}`
        );
    }

    return res.json();
}

/**
 * Start a NEW interview session (first question)
 */

export async function startExternalInterview(payload: {
    session_id: string;
    role: string;
    difficulty: string;
    company?: string;
    tags?: string[];
}) {
    return callInterviewApi("/next-turn", {
        ...payload,
        mode: "new",
    });
}

/**
 * Continue an existing interview session (subsequent questions)
 */

export async function continueExternalInterview(payload: {
    session_id: string;
    role: string;
    difficulty: string;
    company?: string;
    tags?: string[];
    previous_question_id: string;
    previous_question: string;
    previous_answer: string;
    mode?: string;
}) {
    return callInterviewApi("/next-turn", {
        ...payload,
        mode: "new",
    });
}

/**
 * Finalize interview session
 */
export async function finalizeExternalInterview(sessionId: string) {
    return callInterviewApi("/finalize-session", {
        session_id: sessionId,
    });
}



export function extractInterviewTags(structuredData: any): string[] {
    if (!structuredData?.skills?.technical) return [];

    return structuredData.skills.technical
        .map((skill: string) =>
            skill
                .toLowerCase()
                .replace(/[^a-z0-9+.#]/g, "") // keep c++, c#, node.js
                .trim()
        )
        .filter(Boolean)
        .slice(0, 3); // limit to avoid overload max 3 tags
}

