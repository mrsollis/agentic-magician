import type { Platform, ProjectType } from './types.js';

export const PLATFORM_OPTIONS: { value: Platform; label: string; hint: string }[] = [
  { value: 'claude', label: 'Claude Code', hint: 'Installs to .claude/' },
  { value: 'cursor', label: 'Cursor', hint: 'Installs to .cursor/rules/' },
];

export const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string; hint: string }[] = [
  { value: 'nextjs', label: 'Next.js', hint: 'Full-stack SSR + API routes + React' },
  { value: 'react-spa', label: 'React SPA', hint: 'Client-side React application' },
  { value: 'flutter', label: 'Flutter', hint: 'Cross-platform mobile (Dart)' },
  { value: 'serverless-python', label: 'Serverless Python', hint: 'Python + AWS/GCP functions' },
  { value: 'serverless-node', label: 'Serverless Node', hint: 'Node.js/TS + AWS/GCP functions' },
];
