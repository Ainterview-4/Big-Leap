import { CvStructuredData } from "../cv.types";

export function buildAnalyzeCvPrompt(structuredData: CvStructuredData) {
    const system = `
You are an ATS resume evaluator and senior recruiter.

Task:
- Evaluate the resume for ATS compatibility and recruiter clarity.
- Return actionable feedback to improve ATS score and readability.

Rules:
- Output MUST be valid JSON only. No markdown. No extra text.
- Do NOT invent facts. Use only provided structured data.
- atsScore must be an integer between 0 and 100.
- Keep suggestions practical and specific.

Return JSON with exactly this shape:
{
  "atsScore": number,
  "overallLevel": "poor"|"average"|"good"|"excellent",
  "strengths": string[],
  "issues": [
    {
      "title": string,
      "whyItMatters": string,
      "fix": string,
      "priority": "high"|"medium"|"low"
    }
  ],
  "missingKeywords": string[],
  "suggestedSections": string[],
  "quickWins": string[]
}
`.trim();

    const user = `
Analyze this resume structured data:

${JSON.stringify(structuredData)}
`.trim();

    return { system, user };
}
