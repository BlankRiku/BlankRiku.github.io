export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "ai" | "devops" | "web" | "mobile" | "all";
  tags: string[];
  achievements: string[];
  links?: { label: string; url: string }[];
  metrics?: { label: string; value: string }[];
  accentColor: string; // Tailwind color class like 'indigo-500'
}

export interface Skill {
  name: string;
}

export interface SkillGroup {
  category: string;
  description: string;
  iconName: string; // Lucide icon identification
  skills: Skill[];
}

export interface TimelineItem {
  id: string;
  role: string;
  institution: string; // Company or school
  location: string;
  period: string;
  description: string;
  isEducation: boolean;
  achievements?: string[];
  tags?: string[];
}

export interface TerminalEntry {
  input: string;
  output: string;
  timestamp: string;
  dir: string;
}
