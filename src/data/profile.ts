import type { Profile } from '@/types';

/**
 * Top-level personal data — name, contact info, one-liner bio.
 * Sourced from main.tex (\name, \address) and adapted for web.
 */
export const profile: Profile = {
  name: 'Sarthak Consul',
  tagline: 'Research engineer at Matic Robots',
  bio:
    'I build the machine-learning systems that let robots see and act in the world. ' +
    'Currently at Matic Robots, working on vision-language models, on-device ' +
    'inference, and the infrastructure underneath.',
  now:
    'shipping a streamable Gaussian-splat viewer in Rust + WGPU · ' +
    'optimizing edge inference on Jetson SOMs',
  location: 'Bay Area, CA',
  email: 'sarthakconsul@gmail.com',
  github: 'SConsul',
  linkedin: 'sarthak-consul',
  scholar: 'https://scholar.google.com/citations?user=OhT--ngAAAAJ&hl=en',
  resumeUrl: '/resume.pdf',
};
