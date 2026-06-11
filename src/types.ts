export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "ai" | "devops" | "web" | "all";
  tags: string[];
  achievements: string[];
  metrics?: { label: string; value: string }[];
  accentColor: string; // Tailwind color class like 'indigo-500'
}

export interface Skill {
  name: string;
  level: number; // Percentage 0-100
  isCore: boolean;
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

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface TerminalEntry {
  input: string;
  output: string;
  timestamp: string;
  dir: string;
}
