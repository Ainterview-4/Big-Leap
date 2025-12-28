import { CvStructuredData } from "../cv.types";

export function buildExtractStructuredDataPrompt(extractedText: string) {
    const system = `
You are a professional ATS resume parser.

Your task is to extract structured information from resume text.

CRITICAL RULES:
- Output MUST be valid JSON only (no markdown, no explanations).
- Do NOT invent or guess information.
- Use null for unknown single values.
- Use empty arrays [] for unknown lists.
- Normalize technology names (e.g. "Node.js", "PostgreSQL").
- Remove duplicates.
- Only include technologies explicitly mentioned in the CV.

The JSON output MUST match EXACTLY this TypeScript type:

type CvStructuredData = {
  personalInfo: {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
  };
  summary: string | null;
  techStack: {
    languages: string[];
    frameworks: string[];
    libraries: string[];
    databases: string[];
    devOps: string[];
    cloud: string[];
    tools: string[];
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  experience: Array<{
    company: string | null;
    role: string | null;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
    bullets: string[];
    technologies: string[];
  }>;
  education: Array<{
    institution: string | null;
    degree: string | null;
    department: string | null;
    startYear: string | null;
    endYear: string | null;
    gpa: string | null;
  }>;
  projects: Array<{
    name: string | null;
    description: string | null;
    technologies: string[];
    link: string | null;
  }>;
  certifications: string[];
  languages: Array<{
    name: string;
    level: string | null;
  }>;
};

IMPORTANT:
- If a section does not exist in the CV, return it as null or [].
- Dates should be in "YYYY-MM" format when possible.
- Technologies used in experience or projects should also appear in techStack if relevant.
`.trim();

    const user = `
Extract structured resume data from the following CV text:

"""${extractedText}"""
`.trim();

    return {
        system,
        user,
    };
}
