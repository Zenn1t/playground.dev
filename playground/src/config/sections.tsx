export const SECTION_IDS = ['home', 'about', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const TRANSITION_MS = 720;