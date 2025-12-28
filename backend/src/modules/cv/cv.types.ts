export type CvStructuredData = {
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
        languages: string[];      // JavaScript, Python, Java
        frameworks: string[];     // React, Express, Django
        libraries: string[];      // Redux, Prisma
        databases: string[];      // PostgreSQL, MongoDB
        devOps: string[];         // Docker, CI/CD, GitHub Actions
        cloud: string[];          // AWS, GCP, Cloudflare
        tools: string[];          // Git, Figma, Postman
    };

    skills: {
        technical: string[];      // General technical skills
        soft: string[];           // Communication, teamwork
    };

    experience: Array<{
        company: string | null;
        role: string | null;
        location: string | null;
        startDate: string | null; // YYYY-MM if possible
        endDate: string | null;   // YYYY-MM or "Present"
        bullets: string[];
        technologies: string[];  // Tech used in this role
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


