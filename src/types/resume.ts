export interface TemplateVariant {
  label: string;
  format: "pdf" | "docx";
  relPath: string;
}

export interface TemplateItem {
  id: string;
  volume: number;
  title: string;
  shortTitle: string;
  series: "InDesign" | "Illustrator";
  category:
    | "Executive"
    | "Creative & Design"
    | "Tech & Engineering"
    | "Minimalist"
    | "Academic";
  archetype:
    | "executive"
    | "swiss"
    | "editorial"
    | "modern-sidebar"
    | "technical"
    | "minimal";
  accentColor: string;
  atsScore: number;
  pages: number;
  hasPdf: boolean;
  hasDocx: boolean;
  pdfRelPath: string | null;
  docxRelPath: string | null;
  thumbnail: string | null;
  variantCount: number;
  variants: TemplateVariant[];
  featured: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  period: string;
  details: string;
}

export interface ResumeData {
  fullName: string;
  roleTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  languages: string[];
  accentColor: string;
  fontPair: "modern" | "editorial" | "technical";
  density: "comfortable" | "compact";
}

export interface SavedDraft {
  id: string;
  title: string;
  templateId: string;
  templateTitle: string;
  archetype: TemplateItem["archetype"];
  updatedAt: string;
  completion: number;
  data: ResumeData;
  docxFields?: Record<string, string>;
}

export interface DownloadRecord {
  id: string;
  title: string;
  templateId: string;
  format: "PDF" | "DOCX";
  source: "template" | "editor";
  downloadedAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  plan: "Free Studio" | "Pro Workspace";
  avatarUrl?: string | null;
  brandLogoUrl?: string | null;
  jobTitle?: string;
  phone?: string;
  location?: string;
  website?: string;
}

export const DEFAULT_RESUME_DATA: ResumeData = {
  fullName: "Alex Morgan",
  roleTitle: "Senior Product Designer",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 234-5678",
  location: "New York, NY · Remote",
  website: "alexmorgan.design",
  summary:
    "Product designer and systems specialist with 6+ years of experience crafting clear interfaces, scalable design systems, and conversion-focused web applications.",
  experience: [
    {
      id: "exp-1",
      role: "Lead Product Designer",
      company: "Northstar Studio",
      period: "2023 — Present",
      location: "Remote",
      highlights: [
        "Led the core design system adopted across 10+ product teams, improving UI shipping velocity by 38%.",
        "Redesigned onboarding and workspace workflows, increasing weekly active retention by 29%.",
      ],
    },
    {
      id: "exp-2",
      role: "Product Designer",
      company: "Meridian Digital",
      period: "2020 — 2023",
      location: "New York, NY",
      highlights: [
        "Shipped responsive web and mobile interfaces serving 150K+ monthly active users.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Interaction Design",
      school: "State University",
      period: "2016 — 2020",
      details: "Honors · Focus on Human-Computer Interaction",
    },
  ],
  skills: [
    "Product Design",
    "Design Systems",
    "Figma",
    "Prototyping",
    "Typography",
    "User Research",
  ],
  languages: ["English (Fluent)"],
  accentColor: "#107C41",
  fontPair: "modern",
  density: "comfortable",
};
