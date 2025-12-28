import OpenAI from "openai";

const MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

export async function callAIJson<T>(args: {
    system: string;
    user: string;
}): Promise<T> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not configured.");
    }

    const openai = new OpenAI({ apiKey });

    const res = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: "system", content: args.system },
            { role: "user", content: args.user },
        ],
        // Encourage deterministic JSON output - Removed temp for o1 compatibility
    });

    const text = res.choices[0]?.message?.content ?? "";

    // Expect JSON ONLY. If model wraps in ```json ...```, strip safely
    const cleaned = text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

    try {
        return JSON.parse(cleaned) as T;
    } catch {
        // If AI returns non-JSON, throw a clear error (you can log cleaned)
        throw new Error("AI_JSON_PARSE_FAILED");
    }
}
