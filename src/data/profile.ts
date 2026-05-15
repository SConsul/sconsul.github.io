import type { Profile } from '@/types';

/**
 * Top-level personal data — name, contact info, headline + status.
 * Sourced from main.tex (\name, \address). Headline + now are written
 * to position broadly (ML systems / perf), not pigeonholed to robotics.
 */
export const profile: Profile = {
  name: 'Sarthak Consul',
  tagline: 'ML systems engineer',
  bio:
    'I work on the systems that scale foundation models — distributed ' +
    'training, low-precision inference, and the GPU kernels in between. ' +
    'Currently at Matic Robots; previously at Meta and IIT Bombay.',
  now:
    'tightening inference latency on Jetson · writing a Rust + WGPU ' +
    'Gaussian-splat viewer on the side',
  location: 'Bay Area, CA',
  email: 'sarthakconsul@gmail.com',
  github: 'SConsul',
  linkedin: 'sarthak-consul',
  scholar: 'https://scholar.google.com/citations?user=OhT--ngAAAAJ&hl=en',
  resumeUrl: '/resume.pdf',
};
