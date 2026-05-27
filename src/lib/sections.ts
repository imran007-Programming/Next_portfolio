export const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "projects",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}

export function sectionIndex(id: SectionId) {
  return SECTION_IDS.indexOf(id);
}

export function hashToSection(hash: string): SectionId | null {
  const id = hash.replace(/^#/, "");
  if (!id) return "hero";
  return isSectionId(id) ? id : null;
}

export function sectionToHash(id: SectionId) {
  return id === "hero" ? "" : `#${id}`;
}
