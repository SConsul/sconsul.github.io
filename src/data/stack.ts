import type { StackGroup } from '@/types';

/**
 * Technical skills, grouped. Sourced from main.tex \section{Technical Skills}
 * and enriched with keywords that appear consistently in inference / ML-infra
 * job descriptions at frontier labs (Ray, Nsight Systems vs. Compute,
 * distillation as a first-class technique).
 *
 * Order within each group is rough proficiency / recency.
 */
export const stack: readonly StackGroup[] = [
  {
    category: 'Languages',
    items: ['Python', 'Rust', 'CUDA', 'C/C++', 'TypeScript', 'SQL'],
  },
  {
    category: 'ML',
    items: ['PyTorch', 'TensorRT', 'DALI', 'DDP', 'AMP', 'NCCL', 'torch.compile', 'distillation'],
  },
  {
    category: 'Infra',
    items: ['Docker', 'Bazel', 'Ray', 'Slurm', 'Apache DataFusion', 'Parquet', 'Nsight Systems', 'Nsight Compute'],
  },
];

/**
 * Short list of current interests, surfaced on the home page Focus card.
 * Curated separately from the resume's exhaustive skill list — these are
 * the things the site is signaling to recruiters and collaborators.
 */
export const focus: readonly string[] = [
  'inference optimization',
  'Rust',
  'CUDA',
  'computer vision',
  'world models',
  'scalable ML infra',
];
