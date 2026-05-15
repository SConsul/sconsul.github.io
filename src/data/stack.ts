import type { StackGroup } from '@/types';

/**
 * Technical skills, grouped. Sourced from main.tex \section{Technical Skills}.
 * Order within each group is rough proficiency / recency.
 */
export const stack: readonly StackGroup[] = [
  {
    category: 'Languages',
    items: ['Python', 'Rust', 'CUDA', 'C/C++', 'SQL', 'Bash', 'TypeScript'],
  },
  {
    category: 'ML',
    items: ['PyTorch', 'TensorRT', 'DALI', 'DDP', 'AMP', 'NCCL', 'torch.compile'],
  },
  {
    category: 'Infra',
    items: ['Docker', 'Slurm', 'Apache DataFusion', 'Parquet', 'Nsight', 'TAO'],
  },
];

/**
 * Short list of current interests, surfaced on the home page Focus card.
 * Curated separately from the resume's exhaustive skill list — these are
 * the things the site is signaling to recruiters and collaborators.
 */
export const focus: readonly string[] = [
  'Rust',
  'CUDA',
  'computer vision',
  'world models',
  'scalable ML infra',
];
