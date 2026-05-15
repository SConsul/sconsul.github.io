import type { EducationEntry } from '@/types';

/**
 * Education — simplified to the degree + field. School names are kept
 * full; honors / minors are dropped from the home card and recovered on
 * the /resume page if needed.
 */
export const education: readonly EducationEntry[] = [
  {
    school: 'Stanford',
    degree: 'M.S. Computer Science (AI)',
  },
  {
    school: 'IIT Bombay',
    degree: 'B.Tech, Electrical Engineering',
  },
];
