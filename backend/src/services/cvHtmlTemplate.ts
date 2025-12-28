// backend/src/services/cvHtmlTemplate.ts



type AnyRecord = Record<string, any>;

/**
 * Escape HTML to prevent broken markup when user data contains <, >, &, etc.
 */
function escapeHtml(input: unknown): string {
  const s = String(input ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Join non-empty parts with a separator
 */
function joinParts(parts: Array<unknown>, sep: string): string {
  const cleaned = parts
    .map((p) => String(p ?? "").trim())
    .filter((p) => p.length > 0);
  return cleaned.join(sep);
}

/**
 * Safely read nested properties.
 */
function get(obj: AnyRecord | null | undefined, path: string, fallback: any = ""): any {
  if (!obj) return fallback;
  return path.split(".").reduce((acc: any, key) => (acc && acc[key] != null ? acc[key] : undefined), obj) ?? fallback;
}

/**
 * Render ATS-friendly CV HTML from optimizedData JSON.
 * This expects your optimization JSON to have something like:
 * {
 *   header: { fullName, title, location, email, phone, linkedin, github, website },
 *   summary: string,
 *   experience: [{ company, role, startDate, endDate, bullets: string[] }],
 *   skills: { technical: string[], soft: string[] },
 *   education: [{ school, degree, department, startYear, endYear }],
 *   projects: [{ name, description, technologies: string[], link }],
 *   certifications: string[],
 *   languages: [{ name, level }]
 * }
 *
 * But it is resilient if some fields are missing.
 */
export function renderCvHtml(optimizedData: AnyRecord): string {
  const header = get(optimizedData, "header", {}) as AnyRecord;

  const fullName = escapeHtml(get(header, "fullName", ""));
  const title = escapeHtml(get(header, "title", ""));
  const location = escapeHtml(get(header, "location", ""));
  const email = escapeHtml(get(header, "email", ""));
  const phone = escapeHtml(get(header, "phone", ""));
  const linkedin = escapeHtml(get(header, "linkedin", ""));
  const github = escapeHtml(get(header, "github", ""));
  const website = escapeHtml(get(header, "website", ""));

  const summaryRaw = get(optimizedData, "summary", "");
  const summary = escapeHtml(summaryRaw);

  const experience = (get(optimizedData, "experience", []) as any[]).filter(Boolean);
  const skills = (get(optimizedData, "skills", {}) as AnyRecord) || {};
  const technicalSkills = (get(skills, "technical", []) as any[]).filter(Boolean).map(escapeHtml);
  const softSkills = (get(skills, "soft", []) as any[]).filter(Boolean).map(escapeHtml);

  const education = (get(optimizedData, "education", []) as any[]).filter(Boolean);
  const projects = (get(optimizedData, "projects", []) as any[]).filter(Boolean);
  const certifications = (get(optimizedData, "certifications", []) as any[]).filter(Boolean).map(escapeHtml);
  const languages = (get(optimizedData, "languages", []) as any[]).filter(Boolean);

  const contactLine = joinParts(
    [
      location,
      email,
      phone,
      linkedin ? `LinkedIn: ${linkedin}` : "",
      github ? `GitHub: ${github}` : "",
      website ? `Website: ${website}` : "",
    ],
    " · "
  );

  const expHtml = experience
    .map((exp) => {
      const company = escapeHtml(exp?.company ?? "");
      const role = escapeHtml(exp?.role ?? "");
      const startDate = escapeHtml(exp?.startDate ?? "");
      const endDate = escapeHtml(exp?.endDate ?? "");
      const dateRange = joinParts([startDate, endDate], " - ");

      const bullets = (exp?.bullets ?? [])
        .filter(Boolean)
        .map((b: any) => `<li>${escapeHtml(b)}</li>`)
        .join("");

      return `
        <div class="item">
          <div class="item-title"><strong>${role}</strong>${company ? ` — ${company}` : ""}</div>
          ${dateRange ? `<div class="meta">${escapeHtml(dateRange)}</div>` : ""}
          ${bullets ? `<ul>${bullets}</ul>` : ""}
        </div>
      `.trim();
    })
    .join("\n");

  const eduHtml = education
    .map((e) => {
      const school = escapeHtml(e?.school ?? e?.institution ?? "");
      const degree = escapeHtml(e?.degree ?? "");
      const department = escapeHtml(e?.department ?? "");
      const startYear = escapeHtml(e?.startYear ?? "");
      const endYear = escapeHtml(e?.endYear ?? "");
      const years = joinParts([startYear, endYear], " - ");
      const line = joinParts([degree, department].filter(Boolean), " · ");

      return `
        <div class="item">
          <div class="item-title"><strong>${school}</strong></div>
          ${line ? `<div>${escapeHtml(line)}</div>` : ""}
          ${years ? `<div class="meta">${escapeHtml(years)}</div>` : ""}
        </div>
      `.trim();
    })
    .join("\n");

  const projHtml = projects
    .map((p) => {
      const name = escapeHtml(p?.name ?? "");
      const description = escapeHtml(p?.description ?? "");
      const link = escapeHtml(p?.link ?? "");
      const techs = (p?.technologies ?? []).filter(Boolean).map(escapeHtml);
      const techLine = techs.length ? techs.join(", ") : "";

      return `
        <div class="item">
          <div class="item-title"><strong>${name}</strong>${link ? ` — ${link}` : ""}</div>
          ${description ? `<div>${description}</div>` : ""}
          ${techLine ? `<div class="meta">Tech: ${techLine}</div>` : ""}
        </div>
      `.trim();
    })
    .join("\n");

  const langHtml = languages
    .map((l) => {
      const name = escapeHtml(l?.name ?? "");
      const level = escapeHtml(l?.level ?? "");
      return `<li>${name}${level ? ` — ${level}` : ""}</li>`;
    })
    .join("");

  // ATS-friendly: avoid tables/columns, keep it linear and plain
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Optimized CV</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
    }
    .header {
      margin-bottom: 12px;
    }
    h1 {
      font-size: 20pt;
      margin: 0 0 4px 0;
    }
    .subtitle {
      font-size: 12pt;
      margin: 0 0 6px 0;
    }
    .contact {
      font-size: 10.5pt;
      margin: 0;
    }
    h2 {
      font-size: 13pt;
      margin: 18px 0 8px 0;
      border-bottom: 1px solid #ddd;
      padding-bottom: 4px;
    }
    .item {
      margin-bottom: 10px;
    }
    .item-title {
      margin: 0 0 2px 0;
    }
    .meta {
      font-size: 10.5pt;
      color: #333;
      margin: 0 0 4px 0;
    }
    ul {
      margin: 6px 0 0 18px;
      padding: 0;
    }
    li { margin-bottom: 4px; }
  </style>
</head>
<body>

  <div class="header">
    <h1>${fullName}</h1>
    ${title ? `<div class="subtitle">${title}</div>` : ""}
    ${contactLine ? `<p class="contact">${escapeHtml(contactLine)}</p>` : ""}
  </div>

  ${summary ? `
    <h2>Professional Summary</h2>
    <p>${summary}</p>
  ` : ""}

  ${experience.length ? `
    <h2>Experience</h2>
    ${expHtml}
  ` : ""}

  ${(technicalSkills.length || softSkills.length) ? `
    <h2>Skills</h2>
    ${technicalSkills.length ? `<p><strong>Technical:</strong> ${technicalSkills.join(", ")}</p>` : ""}
    ${softSkills.length ? `<p><strong>Soft:</strong> ${softSkills.join(", ")}</p>` : ""}
  ` : ""}

  ${education.length ? `
    <h2>Education</h2>
    ${eduHtml}
  ` : ""}

  ${projects.length ? `
    <h2>Projects</h2>
    ${projHtml}
  ` : ""}

  ${certifications.length ? `
    <h2>Certifications</h2>
    <ul>${certifications.map((c) => `<li>${c}</li>`).join("")}</ul>
  ` : ""}

  ${languages.length ? `
    <h2>Languages</h2>
    <ul>${langHtml}</ul>
  ` : ""}

</body>
</html>
`.trim();
}
