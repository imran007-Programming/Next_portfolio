import type { IconType } from "react-icons";
import {
  SiCss,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFramer,
  SiGit,
  SiGithub,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiReact,
  SiRedis,
  SiRedux,
  SiSass,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";
import { TbApi, TbGitBranch } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";

const icons: Record<string, IconType> = {
  nextjs:       SiNextdotjs,
  react:        SiReact,
  typescript:   SiTypescript,
  javascript:   SiJavascript,
  tailwind:     SiTailwindcss,
  sass:         SiSass,
  framer:       SiFramer,
  redux:        SiRedux,
  vite:         SiVite,
  htmlcss:      SiHtml5,
  nodejs:       SiNodedotjs,
  express:      SiExpress,
  nestjs:       SiNestjs,
  restapi:      TbApi,
  postgresql:   SiPostgresql,
  mongodb:      SiMongodb,
  prisma:       SiPrisma,
  redis:        SiRedis,
  graphql:      SiGraphql,
  git:          SiGit,
  github:       SiGithub,
  docker:       SiDocker,
  postman:      SiPostman,
  vercel:       SiVercel,
  figma:        SiFigma,
  vscode:       VscVscode,
  linux:        SiLinux,
  cicd:         TbGitBranch,
};

type SkillIconProps = {
  id: string;
  className?: string;
};

export function SkillIcon({ id, className }: SkillIconProps) {
  const Icon = icons[id];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden />;
}

export function SkillIconStack({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className ?? ""}`}>
      <SiHtml5 className="text-[#E34F26]" aria-hidden />
      <SiCss className="text-[#1572B6]" aria-hidden />
    </span>
  );
}

export function usesStackedIcon(id: string) {
  return id === "htmlcss";
}
