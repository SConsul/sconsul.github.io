import type { Project } from '@/types';

/**
 * Open source / personal projects.
 * Featured projects surface on the home bento grid; the rest live on the
 * /projects page (not yet implemented in this scaffold).
 */
export const projects: readonly Project[] = [
  {
    id: 'splat-viewer',
    title: 'Streamable Gaussian Splat Viewer',
    description:
      'High-performance Rust renderer for streamable 3D Gaussian-splat scenes: ' +
      'progressive LOD streaming over the network, on-the-fly decoding, and ' +
      'custom GPU rasterization kernels.',
    tech: ['Rust', 'WGPU', 'CUDA'],
    status: 'wip',
    featured: true,
  },
];

/** Convenience selector — the single featured project (or undefined). */
export function featuredProject(): Project | undefined {
  return projects.find((p) => p.featured);
}
