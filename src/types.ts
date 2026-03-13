export type Platform = 'claude' | 'cursor';

export type ProjectType =
  | 'nextjs'
  | 'react-spa'
  | 'flutter'
  | 'serverless-python'
  | 'serverless-node';

export interface PluginManifestEntry {
  name: string;
  description: string;
  version: string;
  agents: string[];
  commands: string[];
  skills: string[];
}

export interface InstallPlan {
  platform: Platform;
  projectType: ProjectType;
  plugins: string[];
  targetDir: string;
}

export interface InstallResult {
  filesWritten: number;
  filesSkipped: number;
}
