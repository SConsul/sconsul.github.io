import type { ExperienceRole } from '@/types';

/**
 * Work history, newest first.
 * Extracted from main.tex \cventryproj blocks. Highlights are condensed for
 * web — one sentence each, no LaTeX formatting commands.
 */
export const experience: readonly ExperienceRole[] = [
  {
    company: 'Matic Robots',
    location: 'Mountain View, CA',
    title: 'Research Engineer, Mapping & Neural Networks',
    start: '2023-04',
    end: null,
    highlights: [
      'Fine-tuned vision-language (VLA) and ViT foundation models for object localization and floor tidying.',
      'Drove transition from CNN-based to ViT-based occupancy networks with distillation — sub-voxel geometric/semantic prediction, eliminated irrecoverable failure modes.',
      '23.7× training speedup and 14× memory efficiency via multi-node DDP, DALI, AMP, and selective torch.compile.',
      'End-to-end inference optimization with TensorRT — 6.7× speedup. Automated FP16/INT8 quantization workflows saving 20+ engineering hours/week.',
      'Engineered multi-model inference pipelines: halved latency via pipelining, GPU memory pinning, model preloading — 30% improvement in bot responsiveness.',
      'Custom CUDA kernels that outperformed TensorRT-optimized kernels by 18% on the same workload.',
      'Architected a Rust + Apache DataFusion data platform over multi-TB of multimodal robot logs — annotation, semantic search, dataset curation, side-by-side model-output diffing.',
      'Led 3-engineer team deploying data-parallel inference on NVIDIA Jetson SOMs — Rust TensorRT wrappers, CUDA stream managers, custom memory allocators.',
      '2D/3D maps that are globally stable and locally dynamic: <250ms latency, 1cm³ resolution, 12,000+ sq ft coverage.',
      'Single-handedly authored a Python→Ambarella vector-processor compiler supporting 130 operations.',
    ],
  },
  {
    company: 'Meta',
    location: 'Menlo Park, CA',
    title: 'SWE Intern, Ad Product Optimization',
    start: '2022-06',
    end: '2022-09',
    highlights: [
      "Implemented a group-DRO loss for the production ad-finder model's online-learning loop — improved distributional robustness, reducing worst-group traffic-partition gap by 15% in a live A/B test.",
    ],
  },
  {
    company: 'IIT Bombay',
    location: 'Mumbai, India',
    title: 'Research Assistant',
    start: '2020-06',
    end: '2021-08',
    highlights: [
      'Designed a single-round group-testing algorithm for COVID-19 detection — reduced RT-qPCR tests needed by up to 10×. Deployed across Indian testing facilities during the pandemic.',
    ],
  },
];
