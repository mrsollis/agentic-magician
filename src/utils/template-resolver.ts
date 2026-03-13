import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// tsup bundles everything into dist/index.js
// templates/ is at ../templates relative to dist/index.js
export function getTemplatesDir(): string {
  return path.resolve(__dirname, '..', 'templates');
}

export function getPluginDir(pluginName: string): string {
  return path.join(getTemplatesDir(), 'plugins', pluginName);
}

export function getManifestPath(): string {
  return path.join(getTemplatesDir(), 'plugins.json');
}
