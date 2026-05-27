"use client";

import { useSectionNavigation } from "@/context/SectionNavigation";

export type { SectionId } from "@/lib/sections";

export function useActiveSection() {
  return useSectionNavigation().section;
}
