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
- If a job description is provided, tailor wording and emphasis to that role.
- Do NOT invent experience, skills, roles, or companies.

CRITICAL RULES:
- Output MUST be valid JSON only. No markdown, no explanations.
- Use strong action verbs.
- Keep content concise and professional.
- NEVER add information that does not exist in the provided data.
- Do NOT merge Projects into Experience (or vice versa). Use the respective arrays.
- CRITICAL: You must include ALL experiences, educations, and projects from the original data. Do NOT omit any items. If there are 3 parts of experience, your output must contain 3 parts of experience.

Return JSON with exactly this shape:
{
  "header": {
    "fullName": string,
    "title": string,
    "location": string,
    "email": string,
    "phone": string,
    "linkedin": string,
    "github": string,
    "website": string
  },
  "summary": string,
  "experience": [
    {
      "company": string,
      "role": string,
      "startDate": string,
      "endDate": string,
      "bullets": string[]
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": string[],
      "link": string
    }
  ],
  "skills": {
    "technical": string[],
    "soft": string[]
  },
  "education": [
    {
      "school": string,
      "degree": string,
      "department": string,
      "startYear": string,
      "endYear": string
    }
  ],
  "certifications": string[],
  "languages": [
    {
      "name": string,
      "level": string
    }
  ]
}
`.trim();

  const userParts: string[] = [];

  userParts.push(`
Original structured resume:
${JSON.stringify(structuredData)}
`);

  userParts.push(`
ATS analysis feedback:
${JSON.stringify(analysisResult)}
`);

  if (jobDescription && jobDescription.trim().length > 0) {
    userParts.push(`
Target job description (for tailoring only, not as a source of facts):
${jobDescription}
`);
  }

  const user = userParts.join("\n\n").trim();

  return { system, user };
}
