export type SkillCategory = "frontend" | "backend" | "tools";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  color: string;
};

export const skillCategories: {
  id: SkillCategory;
  title: string;
  subtitle: string;
  accent: string;
}[] = [
  { id: "frontend", title: "Frontend",         subtitle: "Interfaces users love",   accent: "#38bdf8" },
  { id: "backend",  title: "Backend",          subtitle: "APIs & data that scale",  accent: "#4ade80" },
  { id: "tools",    title: "Tools & Workflow", subtitle: "Ship faster, ship safer", accent: "#fbbf24" },
];

export const skills: Skill[] = [
  // Frontend
  { id: "nextjs",      name: "Next.js",       category: "frontend", color: "#ffffff" },
  { id: "react",       name: "React",         category: "frontend", color: "#61DAFB" },
  { id: "typescript",  name: "TypeScript",    category: "frontend", color: "#3178C6" },
  { id: "javascript",  name: "JavaScript",    category: "frontend", color: "#F7DF1E" },
  { id: "tailwind",    name: "Tailwind CSS",  category: "frontend", color: "#38BDF8" },
  { id: "sass",        name: "Sass",          category: "frontend", color: "#CC6699" },
  { id: "framer",      name: "Framer Motion", category: "frontend", color: "#BB4BFF" },
  { id: "redux",       name: "Redux",         category: "frontend", color: "#764ABC" },
  { id: "vite",        name: "Vite",          category: "frontend", color: "#646CFF" },
  { id: "htmlcss",     name: "HTML & CSS",    category: "frontend", color: "#E34F26" },

  // Backend
  { id: "nodejs",      name: "Node.js",       category: "backend",  color: "#339933" },
  { id: "express",     name: "Express",       category: "backend",  color: "#ffffff" },
  { id: "nestjs",      name: "NestJS",        category: "backend",  color: "#E0234E" },
  { id: "restapi",     name: "REST APIs",     category: "backend",  color: "#2dd4bf" },
  { id: "graphql",     name: "GraphQL",       category: "backend",  color: "#E10098" },
  { id: "postgresql",  name: "PostgreSQL",    category: "backend",  color: "#4169E1" },
  { id: "mongodb",     name: "MongoDB",       category: "backend",  color: "#47A248" },
  { id: "prisma",      name: "Prisma",        category: "backend",  color: "#5A67D8" },
  { id: "redis",       name: "Redis",         category: "backend",  color: "#DC382D" },

  // Tools
  { id: "git",         name: "Git",           category: "tools",    color: "#F05032" },
  { id: "github",      name: "GitHub",        category: "tools",    color: "#ffffff" },
  { id: "docker",      name: "Docker",        category: "tools",    color: "#2496ED" },
  { id: "postman",     name: "Postman",       category: "tools",    color: "#FF6C37" },
  { id: "vercel",      name: "Vercel",        category: "tools",    color: "#ffffff" },
  { id: "figma",       name: "Figma",         category: "tools",    color: "#F24E1E" },
  { id: "vscode",      name: "VS Code",       category: "tools",    color: "#007ACC" },
  { id: "linux",       name: "Linux",         category: "tools",    color: "#FCC624" },
  { id: "cicd",        name: "CI/CD",         category: "tools",    color: "#2dd4bf" },
];
