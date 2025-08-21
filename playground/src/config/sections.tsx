export const SECTION_IDS = ['home', 'about', 'roadmap', 'projects', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const TRANSITION_MS = 720;