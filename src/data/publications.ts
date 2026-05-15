import type { Publication } from '@/types';

/**
 * Selected publications, newest first.
 * Extracted from main.tex "Selected Publications" enumeration.
 */
export const publications: readonly Publication[] = [
  {
    title:
      'Invalid Logic, Equivalent Gains: The Bizarreness of Reasoning in Language Model Prompting',
    venue: 'ICML Knowledge and Logical Reasoning Workshop',
    year: 2023,
    url: 'https://arxiv.org/abs/2307.10573',
  },
  {
    title: 'Compressed Sensing Approach to Group-testing for COVID-19 Detection',
    venue: 'IEEE Open Journal of Signal Processing',
    year: 2021,
    url: 'https://ieeexplore.ieee.org/document/9416868',
  },
  {
    title: 'Lower Bounds for Policy Iteration on Multi-action MDPs',
    venue: '59th IEEE Conference on Decision and Control',
    year: 2020,
    url: 'https://arxiv.org/abs/2009.07842',
  },
];
