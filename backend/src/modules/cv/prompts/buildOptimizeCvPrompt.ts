import { CvStructuredData } from "../cv.types";

export function buildOptimizeCvPrompt(
  structuredData: CvStructuredData,
  analysisResult: any,
  jobDescription?: string
) {
  const system = `
You are an expert resume writer and ATS optimization specialist.

Task:
- Rewrite the resume to maximize ATS compatibility and recruiter clarity.
- Apply the analysis feedback strictly.
- Do NOT invent experience or skills.
- Improve wording, structure, and keyword usage.

Rules:
- Output MUST be valid JSON only.
- No markdown, no explanations.
- Use strong action verbs.
- Keep content concise and professional.

Return JSON with exactly this shape:
{
  "header": {
    "fullName": string,
    "title": string,
    "location": string,
    "email": string,
    "phone": string
  },
  "summary": string,
  "experience": [
    {
      "company": string,
      "role": string,
      "bullets": string[]
    }
  ],
  "skills": {
    "technical": string[],
    "soft": string[]
  },
  "education": [
    {
      "school": string,
      "degree": string
    }
  ]
}
`.trim();

  const user = `
Original structured resume:
${JSON.stringify(structuredData)}

ATS analysis feedback:
${JSON.stringify(analysisResult)}
`.trim();

  return { system, user };
}
